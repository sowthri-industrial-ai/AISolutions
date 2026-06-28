import json, re, random
inp = {}
for l in open("data/raft_inputs.jsonl"):
    if l.strip():
        r = json.loads(l); inp[r["id"]] = r
ans = {}
for l in open("data/raft_answers.jsonl"):
    if l.strip():
        a = json.loads(l); ans[a["id"]] = a["answer"]

SYSTEM = ("You are a careful assistant for diesel-blending engineers. Answer ONLY using the "
    "provided context. After each fact you use, cite its tag exactly like [biodiesel_guide.pdf #12]. "
    "If the context does not contain the answer, reply exactly: "
    "I don't have a good match for that in the documents.")
REFUSAL = "I don't have a good match for that in the documents."

def fmt_tag(tag):
    src, n = tag.rsplit("#", 1); return f"{src} #{n}"
def cites(text):
    return set(re.sub(r"\s+", "", c) for c in re.findall(r"\[([^\]]+)\]", text))

stats = {"input":0,"no_answer":0,"caseA_nocite":0,"caseB_bad":0,"kept":0}
rows = []
for id_, ex in inp.items():
    stats["input"] += 1
    if id_ not in ans:
        stats["no_answer"] += 1; continue
    answer = ans[id_].strip()
    ctx_norm = set(re.sub(r"\s+", "", t["tag"]) for t in ex["context"])
    if ex["has_oracle"]:
        if not (cites(answer) & ctx_norm):
            stats["caseA_nocite"] += 1; continue
    else:
        if answer.lower() != REFUSAL.lower():
            stats["caseB_bad"] += 1; continue
    ctx = "\n\n".join(f"[{fmt_tag(t['tag'])}] {t['text']}" for t in ex["context"])
    user = f"Context:\n{ctx}\n\nQuestion: {ex['question']}"
    rows.append({"messages": [
        {"role":"system","content":SYSTEM},
        {"role":"user","content":user},
        {"role":"assistant","content":answer}]})
    stats["kept"] += 1

random.seed(7); random.shuffle(rows)
with open("data/raft_sft.jsonl","w") as f:
    for r in rows: f.write(json.dumps(r)+"\n")

print("=== RAFT SFT build report ===")
for k in ["input","no_answer","caseA_nocite","caseB_bad","kept"]:
    print(f"  {k:13s}: {stats[k]}")
print(f"\nwrote {len(rows)} SFT rows -> data/raft_sft.jsonl")
if rows:
    print("\n--- sample assistant target ---")
    print(rows[0]["messages"][2]["content"][:160])
