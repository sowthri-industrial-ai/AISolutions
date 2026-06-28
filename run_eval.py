import json
import config
from brain import answer

items = json.load(open("eval/golden.json"))
REFUSAL = "i don't have a good match"

def covered(ans, keywords):
    a = ans.lower()
    return any(k.lower() in a for k in keywords)

ans_scores, guard_pass = [], []
print(f"\nRunning golden set: {len(items)} items")
print("=" * 64)
for it in items:
    q = it["question"]
    ans, ranked, best = answer(q)
    if it["type"] == "refuse":
        ok = (best < config.MIN_RERANK_SCORE) or (REFUSAL in ans.lower())
        guard_pass.append(ok)
        print(f"[refuse] {q}")
        print(f"   score {best:+.2f}  ->  {'REFUSED (ok)' if ok else 'ANSWERED (MISS!)'}\n")
    else:
        facets = it["must_cover"]
        hits = [n for n, kws in facets.items() if covered(ans, kws)]
        miss = [n for n in facets if n not in hits]
        ans_scores.append(len(hits) / len(facets))
        line = f"[answer] {q}\n   score {best:+.2f} | facets {len(hits)}/{len(facets)}"
        line += (f" | MISSED: {', '.join(miss)}" if miss else " | all covered")
        print(line + "\n")

print("=" * 64)
if ans_scores:
    print(f"Answer facet coverage : {sum(ans_scores)/len(ans_scores)*100:.0f}%  (avg over {len(ans_scores)} questions)")
if guard_pass:
    print(f"Guard accuracy        : {sum(guard_pass)}/{len(guard_pass)} refused correctly")
