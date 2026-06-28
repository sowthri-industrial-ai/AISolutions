import json, torch
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model
from torch.utils.data import Dataset

BASE = "Qwen/Qwen2.5-0.5B-Instruct"
OUT  = "models/blending-slm"
MAXLEN = 1280

tok = AutoTokenizer.from_pretrained(BASE)
if tok.pad_token is None:
    tok.pad_token = tok.eos_token

rows = [json.loads(l) for l in open("data/raft_sft.jsonl") if l.strip()]
print(f"training rows: {len(rows)}")

class SFT(Dataset):
    def __init__(self, rows):
        self.data = []
        for r in rows:
            msgs = r["messages"]
            prompt_text = tok.apply_chat_template(msgs[:-1], add_generation_prompt=True, tokenize=False)
            full_text   = tok.apply_chat_template(msgs, tokenize=False)
            prompt_ids = tok(prompt_text, add_special_tokens=False)["input_ids"]
            full_ids   = tok(full_text,   add_special_tokens=False)["input_ids"]
            plen = len(prompt_ids) if full_ids[:len(prompt_ids)] == prompt_ids else 0
            full_ids = full_ids[:MAXLEN]
            labels = list(full_ids)
            for i in range(min(plen, len(labels))):
                labels[i] = -100
            self.data.append({"input_ids": full_ids, "labels": labels})
    def __len__(self): return len(self.data)
    def __getitem__(self, i): return self.data[i]

def collate(batch):
    m = max(len(b["input_ids"]) for b in batch)
    ii, ll, am = [], [], []
    for b in batch:
        pad = m - len(b["input_ids"])
        ii.append(b["input_ids"] + [tok.pad_token_id] * pad)
        ll.append(b["labels"]    + [-100] * pad)
        am.append([1] * len(b["input_ids"]) + [0] * pad)
    return {"input_ids": torch.tensor(ii, dtype=torch.long),
            "attention_mask": torch.tensor(am, dtype=torch.long),
            "labels": torch.tensor(ll, dtype=torch.long)}

print("loading base:", BASE)
model = AutoModelForCausalLM.from_pretrained(BASE, torch_dtype=torch.float32)
model.config.use_cache = False
lora = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05, bias="none",
                  target_modules=["q_proj","k_proj","v_proj","o_proj","gate_proj","up_proj","down_proj"],
                  task_type="CAUSAL_LM")
model = get_peft_model(model, lora)
model.print_trainable_parameters()

args = TrainingArguments(
    output_dir="out_slm", per_device_train_batch_size=1, gradient_accumulation_steps=8,
    num_train_epochs=3, learning_rate=2e-4, lr_scheduler_type="cosine", warmup_ratio=0.1,
    logging_steps=10, save_strategy="no", report_to=[], dataloader_num_workers=0,
    bf16=False, fp16=False)

trainer = Trainer(model=model, args=args, train_dataset=SFT(rows), data_collator=collate)
print("\ntraining the blending SLM (LoRA, CPU) ...")
trainer.train()

print("\nmerging LoRA into the base and saving ...")
model = model.merge_and_unload()
model.save_pretrained(OUT)
tok.save_pretrained(OUT)
print("saved blending SLM ->", OUT)
