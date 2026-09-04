# Capital Companions — digital twin demo

Pitch demo. First bubble: `Hi im {Name} who am i talking with`.

## Why `file:///C:/Users/Alexis/digital-twin-demo/profile.html?id=andreia` is broken

`profile.html` loads two scripts from the **same folder**:

- `profiles.js`
- `chat-engine.js`

If those files are missing, the page says Profile not found and chat does nothing. An early GitHub clone only had HTML.

Put `profiles.js` and `chat-engine.js` next to `profile.html`, then open `female.html` and click Andreia.

## Optional server

```bash
npm install
node server.js
```

http://localhost:8787
