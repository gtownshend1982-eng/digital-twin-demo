"""Replay guest lines against chat-engine.js. Fail if the reply looks like a loop."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT / "chat-engine.js"
PROFILES = ROOT / "profiles.js"

CASES = [
    ("marianna", "im glenn", ["glenn", "afternoon", "meet"]),
    ("marianna", "its not bad yours?", ["chelsea", "easy", "later"]),
    ("marianna", "taking it easy today", ["chelsea", "time"]),
    ("marianna", "feeling lazy today", ["chelsea", "time", "easy", "later"]),
    ("marianna", "8pm", ["8pm", "chelsea"]),
    ("marianna", "what you into", ["gfe", "mood", "vibe"]),
    ("marianna", "naughty fun", ["help", "8pm", "7pm"]),
    ("marianna", "how big are you", ["7", "thick", "see"]),
    ("marianna", "are you free later", ["might", "time", "chelsea"]),
    ("nicole", "im glenn", ["glenn"]),
    ("nicole", "im horny", ["help", "7pm", "time"]),
]


def run_node(persona, lines):
    payload = json.dumps({"id": persona, "lines": lines})
    js = (
        "const fs=require('fs');const vm=require('vm');const ctx={window:{}};"
        "vm.createContext(ctx);"
        "vm.runInContext(fs.readFileSync(process.argv[1],'utf8'),ctx);"
        "vm.runInContext(fs.readFileSync(process.argv[2],'utf8'),ctx);"
        "const job=JSON.parse(process.argv[3]);"
        "const p=ctx.window.PROFILES[job.id];"
        "const s={turns:0,guestName:''};const out=[];"
        "for (const u of job.lines) out.push(ctx.window.twinReply(p,u,s));"
        "console.log(JSON.stringify(out));"
    )
    r = subprocess.run(
        ["node", "-e", js, str(PROFILES), str(ENGINE), payload],
        capture_output=True,
        text=True,
    )
    if r.returncode != 0:
        raise SystemExit(r.stderr or r.stdout or "node failed")
    return json.loads(r.stdout.strip().splitlines()[-1])


def main():
    if not ENGINE.exists():
        print("Missing chat-engine.js next to python/", file=sys.stderr)
        return 2
    fails = 0
    grouped = {}
    for pid, user, needles in CASES:
        grouped.setdefault(pid, []).append((user, needles))
    for pid, items in grouped.items():
        lines = [u for u, _ in items]
        replies = run_node(pid, lines)
        print(f"\n=== {pid} ===")
        for (user, needles), reply in zip(items, replies):
            low = reply.lower()
            loop = "what did you want to know" in low and "time, vibe" in low
            time_hijack = "i've got" in low and "in my head" in low and "how big" in user
            hit = any(n in low for n in needles)
            ok = hit and not loop and not time_hijack
            mark = "OK " if ok else "FAIL"
            if not ok:
                fails += 1
            print(f"{mark}  G: {user}\n      A: {reply}")
    print(f"\n{fails} failed")
    return 1 if fails else 0


if __name__ == "__main__":
    raise SystemExit(main())
