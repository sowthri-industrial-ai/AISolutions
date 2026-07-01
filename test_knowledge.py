# Test the full Knowledge tool end-to-end
from brain import answer

q = "How should biodiesel be stored?"
print(f"\nQ: {q}\n")
ans, ranked, score = answer(q)
print("ANSWER:\n", ans)
print("\nTOP SCORE:", round(score, 3))
print("TOP CHUNKS:", [r[1].get("source","?")+"::"+str(r[1].get("chunk","?")) for r in ranked[:3]] if ranked else "none")
