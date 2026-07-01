from copilot import run
for q in [
    "How should biodiesel be stored?",          # in corpus -> should answer + cite
    "What is the octane rating of premium gasoline?",  # NOT in corpus -> should refuse
    "What's a good recipe for biryani?",         # totally off-topic -> should refuse/redirect
]:
    print("\n" + "="*70)
    print("USER:", q)
    print("CO-PILOT:", run(q, verbose=True))
