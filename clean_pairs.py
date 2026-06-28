import json, re

CHUNKS = "data/chunks.jsonl"
PAIRS  = "data/pairs.jsonl"
OUT    = "data/pairs_clean.jsonl"

def norm(s):
    return re.sub(r"\s+", " ", s or "").strip().lower()

chunks, norm_index = {}, {}
with open(CHUNKS) as f:
    for line in f:
        c = json.loads(line)
        tag = f"{c['source']}#{c['chunk']}"
        chunks[tag] = c["text"]
        norm_index[norm(c["text"])] = tag

JUNK_MARKERS = ["list of acronyms", "this report is available at no cost",
    "acknowledgments", "lead authors", "table of contents", "suggested citation",
    "disclaimer", "library of congress"]
def is_junk_chunk(text):
    t = text.lower()
    for m in JUNK_MARKERS:
        if m in t:
            return m
    if re.search(r"(\.\s*){5,}", text):
        return "toc dot leaders"
    return None

junk_sources = {tag: r for tag, txt in chunks.items() if (r := is_junk_chunk(txt))}

BAD_ANCHOR = ["funding", "author", "acronym", "this report", "this guide",
    "available at no cost", "who wrote", "publication", "published",
    "agreement crd", "acknowledg", "citation"]
def bad_anchor(a):
    al = a.lower()
    return next((b for b in BAD_ANCHOR if b in al), None)

stats = {"input":0,"pos_mismatch":0,"source_fixed":0,"junk_chunk":0,"nondomain":0,"dup":0,"kept":0}
seen, kept = set(), []
with open(PAIRS) as f:
    for line in f:
        line = line.strip()
        if not line: continue
        stats["input"] += 1
        try:
            p = json.loads(line)
        except Exception:
            continue
        anchor   = (p.get("anchor") or "").strip()
        positive = p.get("positive") or ""
        source   = (p.get("source") or "").strip()
        np_ = norm(positive)
        if source in chunks and norm(chunks[source]) == np_:
            tag = source
        elif np_ in norm_index:
            tag = norm_index[np_]
            if tag != source: stats["source_fixed"] += 1
        else:
            stats["pos_mismatch"] += 1; continue
        if tag in junk_sources:
            stats["junk_chunk"] += 1; continue
        if bad_anchor(anchor):
            stats["nondomain"] += 1; continue
        key = (norm(anchor), tag)
        if key in seen:
            stats["dup"] += 1; continue
        seen.add(key)
        kept.append({"anchor": anchor, "positive": chunks[tag], "source": tag})

stats["kept"] = len(kept)
with open(OUT, "w") as f:
    for k in kept:
        f.write(json.dumps(k) + "\n")

print("=== cleaning report ===")
for k in ["input","pos_mismatch","source_fixed","junk_chunk","nondomain","dup","kept"]:
    print(f"  {k:13s}: {stats[k]}")
print(f"  unique chunks : {len(set(k['source'] for k in kept))}")
print(f"  junk chunks   : {len(junk_sources)} -> {[t for t,_ in sorted(junk_sources.items())][:10]}")
print(f"\nwrote {len(kept)} clean pairs to {OUT}\n--- samples ---")
for k in kept[:4]:
    print(f"Q: {k['anchor']}\n   [{k['source']}] {' '.join(k['positive'].split())[:80]}...\n")
