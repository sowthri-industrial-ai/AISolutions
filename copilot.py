"""Co-Pilot: always consult the Knowledge tool first; Qwen only presents the result."""
import ollama
from brain import answer as knowledge_answer, REFUSAL

MODEL = "qwen2.5:7b-instruct"

def knowledge(question):
    ans, ranked, score = knowledge_answer(question)
    return ans

SYSTEM = (
    "You are a diesel-blending Co-Pilot. You are given a KNOWLEDGE RESULT retrieved from the "
    "document corpus for the user's question. Your job: "
    "(1) If the KNOWLEDGE RESULT contains an answer, present it clearly to the user, preserving "
    "its citations (like [biodiesel_guide.pdf #65]) exactly. "
    "(2) If the KNOWLEDGE RESULT is a refusal or says the answer isn't available, tell the user "
    "the answer isn't in the documents. "
    "Never add facts, numbers, or specifications that are not in the KNOWLEDGE RESULT."
)

def run(user_question, verbose=True):
    # Step 1: ALWAYS consult the specialist first (it self-refuses if out of corpus)
    if verbose: print(f"  [Co-Pilot calls: knowledge({user_question!r})]")
    result = knowledge(user_question)

    # Step 2: Qwen presents the result (or its refusal) to the user
    messages = [
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": f"User question: {user_question}\n\nKNOWLEDGE RESULT:\n{result}"},
    ]
    resp = ollama.chat(model=MODEL, messages=messages)
    return resp["message"]["content"]

if __name__ == "__main__":
    q = "How should biodiesel be stored?"
    print(f"\nUSER: {q}\n")
    print("CO-PILOT:", run(q))
