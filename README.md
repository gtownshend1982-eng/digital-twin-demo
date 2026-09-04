# Capital Companions — digital twin demo

Pitch demo. Open `index.html` then a house, then a name.

**Needs next to `profile.html`:** `profiles.js`, `chat-engine.js`, `css.css`, `photos/`.

Windows (no git):

```
cd C:\Users\Alexis
Invoke-WebRequest -Uri "https://github.com/gtownshend1982-eng/digital-twin-demo/archive/refs/heads/main.zip" -OutFile "digital-twin-demo.zip"
Expand-Archive -Path "digital-twin-demo.zip" -DestinationPath "C:\Users\Alexis" -Force
Remove-Item "C:\Users\Alexis\digital-twin-demo" -Recurse -Force
Rename-Item "C:\Users\Alexis\digital-twin-demo-main" "digital-twin-demo"
start C:\Users\Alexis\digital-twin-demo\index.html
```

Then Ctrl+Shift+R.

## Behaviour (2026-09-04)

- First line: `Hi im {Name} who am i talking with`
- Uses the guest’s given name
- English only
- Chat is conversation; booking questions only after **Book me now** or availability
- Remembers tonight / 7pm / incall vs hotel
- Houses: female / male / trans
- Male + trans: “are you big” = cock size from questionnaire
- Female + trans: breast questions use questionnaire notes
- Escort slang clusters understood; not a service menu
- Underage = hard stop

Calendar APIs are not wired yet. Book me now is a chat hold, not Google/Cal.com.
