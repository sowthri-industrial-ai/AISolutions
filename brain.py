import sys, json, torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import config
import retrieve as R

print("loading brain:", config.BRAIN)
_tok = AutoTokenizer.from_pretrained(config.BRAIN)
_model = AutoModelForCausalLM.from_pretrained(config.BRAIN, torch_dtype=torch.bfloat16)
_model.eval()

REFUSAL = "I don't have a good match for that in the documents."

def _generate(messages, max_new_tokens):
    text = _tok.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = _tok(text, return_tensors="pt")
    with torch.no_grad():
        out = _model.generate(**inputs, max_new_tokens=max_new_tokens, do_sample=False,
                              repetition_penalty=1.05, pad_token_id=_tok.eos_token_id)
    return _tok.decode(out[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True).strip()

EXPAND_SYS = (
    "You expand a user question into exactly 4 search queries for a technical document "
    "collection. Each query MUST target a DIFFERENT aspect - never reword the same idea. "
    "Cover distinct angles such as: normal operating conditions, contamination or impurities, "
    "material and equipment compatibility, and degradation or aging over time. "
    "Return ONLY a JSON array of 4 short query strings.\n"
    "Example question: How do I maintain a car battery?\n"
    'Example output: ["car battery charging voltage", "car battery acid leak corrosion", '
    '"car battery terminal material compatibility", "car battery lifespan degradation"]'
)

def expand_queries(question):
    raw = _generate([{"role": "system", "content": EXPAND_SYS},
                     {"role": "user", "content": question}], 130)
    try:
        subs = json.loads(raw[raw.index("["): raw.rindex("]") + 1])
        subs = [s.strip() for s in subs if isinstance(s, str) and s.strip()]
    except Exception:
        subs = []
    return ([question] + [s for s in subs if s.lower() != question.lower()])[:5]

SYSTEM = (
    "You are a careful assistant for diesel-blending engineers. Answer ONLY using the "
    "provided context. After each fact you use, cite its tag exactly like [biodiesel_guide.pdf #12]. "
    "If the context does not contain the answer, reply exactly: " + REFUSAL
)

def _write_answer(question, ranked):
    ctx = "\n\n".join(f"[{m['source']} #{m['chunk']}] {d}" for _, _, d, m in ranked)
    return _generate([{"role": "system", "content": SYSTEM},
                      {"role": "user", "content": f"Context:\n{ctx}\n\nQuestion: {question}"}], 250)

def answer(question, queries=None):
    base, _ = R.retrieve_pool([question], question)
    if float(base[0][0]) < config.MIN_RERANK_SCORE:
        return REFUSAL, base, float(base[0][0])
    if config.USE_QUERY_EXPANSION:
        if queries is None:
            queries = expand_queries(question)
        ranked, _ = R.retrieve_pool(queries, question)
    else:
        ranked = base
    return _write_answer(question, ranked), ranked, float(ranked[0][0])

if __name__ == "__main__":
    q = " ".join(sys.argv[1:]) or "how should biodiesel be stored?"
    print("\nQ:", q)
    qs = expand_queries(q) if config.USE_QUERY_EXPANSION else [q]
    print("search queries:")
    for s in qs:
        print("   -", s)
    ans, ranked, best = answer(q, queries=qs)
    print("\ntop score:", round(best, 2))
    print("\nANSWER:\n" + ans)
    print("\n--- chunks used ---")
    for sc, sem, doc, m in ranked:
        print(f"  rr={sc:+.2f}  [{m['source']} #{m['chunk']}]")
