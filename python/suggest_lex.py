import json, re
from pathlib import Path
HERE = Path(__file__).resolve().parent
INTENTS = {
    "taking it easy": re.compile(r"lazy|chill|laid ?back|cba"),
    "horny": re.compile(r"dtf|naughty|filthy|horny|turned on"),
    "are you free": re.compile(r"\bfree\b|available"),
    "how much": re.compile(r"how much|rates?|price|cost"),
    "selfie": re.compile(r"selfie|pic|photo|prove"),
    "anal": re.compile(r"\banal\b|greek"),
    "how big": re.compile(r"how big|are you big|inches"),
}

def main():
    src = HERE / "unmapped-phrases.json"
    if not src.exists():
        print("Run mine_phrases.py first.")
        return
    rows = json.loads(src.read_text(encoding="utf-8"))
    suggestions = {}
    for item in rows:
        phrase, n = item if isinstance(item, list) else (item, 1)
        phrase = str(phrase).strip()
        for intent, rx in INTENTS.items():
            if rx.search(phrase):
                words = [w for w in re.findall(r"[a-z']+", phrase.lower()) if w not in {"i", "im", "you", "a", "the", "to"}]
                key = " ".join(words[:2]) or phrase[:20]
                suggestions[key] = intent
                break
    print("Suggested LEX:")
    for k, v in suggestions.items():
        print(f'    "{k}":"{v}",')
    (HERE / "lex-suggestions.json").write_text(json.dumps({"lex": suggestions}, indent=2), encoding="utf-8")

if __name__ == "__main__":
    main()
