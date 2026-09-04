# Capital Companions — digital twin demo

Pitch demo for 15 fictional adult companion personas. WhatsApp-style chat that sounds human, asks who it is talking to, uses that name, and keeps every reply open toward a booking.

Not clones of real people. Questionnaire-backed characters.

## Open a profile

Serve the folder and open `index.html`, or:

```bash
npm install
node server.js
```

Then visit `http://localhost:8787`.

First bubble on every profile:

> Hi im {Name} who am i talking with

After the guest gives a name, later replies use it. The only closed reply is an underage refusal.

## Layout

- `index.html` / `male.html` / `female.html` / `trans.html` — roster pages
- `profile.html` + `chat-engine.js` — demo chat
- `*_100q_en.json` + `all_personas_100q.json` — 100-question persona packs
- `persona-core.js` + `server.js` — optional `/api/chat` (OpenAI or Ollama)
- `datasets/` — 150 ShareGPT / ChatML scenes
- `generate-dataset.js` / `integrity-test.js` — rebuild and score scenes

Photos stay local (`photos/`) and are not in this repo.

## Integrity

```bash
node generate-dataset.js
node integrity-test.js
```

Offline gold: 150/150 last run.
