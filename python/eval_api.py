import json, sys, urllib.error, urllib.request
URLS = ("http://127.0.0.1:3000/api/chat", "http://127.0.0.1:8787/api/chat")

def post(url, payload):
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers={"content-type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())

def main():
    url = None
    err = ""
    for u in URLS:
        try:
            post(u, {"personaId": "marianna", "message": "ping", "guestName": "", "history": []})
            url = u
            break
        except Exception as e:
            err = str(e)
    if not url:
        print("API down. Start node server.js")
        print(err)
        return 2
    print("API", url)
    data = post(url, {"personaId": "marianna", "message": "im glenn", "guestName": "", "history": []})
    print(data.get("reply") or data)
    return 0 if data.get("reply") else 1

if __name__ == "__main__":
    raise SystemExit(main())
