from collections import Counter
import csv, json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
DEFAULTS = [ROOT.parent / "Whatsapp_chat.csv", ROOT / "gold-threads.txt"]
KNOWN = re.compile(r"how are you|not bad|taking it easy|lazy|free later|are you free|what you into|horny|naughty|how big|anal|selfie|how much|book me|8pm|im glenn", re.I)

def pull_texts(path):
    raw = path.read_text(encoding="utf-8", errors="replace")
    if path.suffix.lower() == ".csv":
        rows = list(csv.reader(raw.splitlines()))
        if not rows:
            return []
        header = [c.strip().lower() for c in rows[0]]
        idx = next((header.index(n) for n in ("message", "text", "dialogue", "body", "content") if n in header), None)
        if idx is None:
            return []
        return [r[idx] for r in rows[1:] if len(r) > idx and r[idx].strip()]
    out = []
    for line in raw.splitlines():
        line = line.strip()
        m = re.match(r"^(Glenn|User|Guest)\s*:\s*(.+)$", line, re.I)
        if m:
            out.append(m.group(2))
    return out

def main():
    paths = [Path(a) for a in sys.argv[1:]] or [p for p in DEFAULTS if p.exists()]
    bag = Counter()
    for path in paths:
        texts = pull_texts(path)
        print(f"{path.name}: {len(texts)} lines")
        for t in texts:
            if not KNOWN.search(t):
                bag[re.sub(r"\s+", " ", t.lower())[:80]] += 1
    for phrase, n in bag.most_common(40):
        print(f"  {n:4}  {phrase}")
    out = Path(__file__).resolve().parent / "unmapped-phrases.json"
    out.write_text(json.dumps(bag.most_common(100), indent=2), encoding="utf-8")
    print("Wrote", out)

if __name__ == "__main__":
    main()
