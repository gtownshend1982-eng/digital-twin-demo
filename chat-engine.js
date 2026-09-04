/* Pitch chat — English, named guest, conversation then a booking ask */
(function () {
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function norm(s) { return String(s || "").toLowerCase().replace(/[’']/g, "'").trim(); }
  var STOP = /^(hi|hey|hello|yo|sup|hiya|oi|alright|morning|evening|afternoon|yes|yeah|yeh|yep|yup|ok|okay|k|cool|nice|thanks|thank|cheers|ta|please|here|its|it's|im|i'm|me|you|who|what|when|where|how|free|tonight|today|book|booking|incall|outcall|hotel|love|baby|babe|hun|mate)$/i;
  function titleName(s) {
    return String(s || "").replace(/[^\p{L}\p{N}'-]+/gu, "").replace(/^\w/, function (c) { return c.toUpperCase(); });
  }
  function extractGuestName(raw) {
    var text = String(raw || "").trim();
    if (!text) return "";
    var m = text.match(/(?:i(?:['’]?m| am)|this is|it['’]?s|call me)\s+([A-Za-z][A-Za-z'\-]{1,20})/i);
    if (m && m[1] && !STOP.test(m[1])) return titleName(m[1]);
    var words = text.replace(/[^A-Za-z'\- ]/g, " ").trim().split(/\s+/);
    if (words.length === 1 && words[0].length >= 2 && words[0].length <= 20 && !STOP.test(words[0])) return titleName(words[0]);
    return "";
  }
  function nm(state) { return (state && state.guestName) || ""; }
  function withName(state, s) {
    var n = nm(state);
    if (!n || new RegExp("\\b" + n + "\\b", "i").test(s)) return s;
    if (state._named && state.turns > 3) return s;
    state._named = true;
    return s.replace(/[.!?]\s*$/, "") + ", " + n + ".";
  }
  function ask(state) {
    var qs = ["What night were you thinking?", "This week or next?", "Incall or a hotel?", "Hour or a bit longer?", "You local or travelling in?"];
    var i = (state._qi || 0) % qs.length;
    state._qi = i + 1;
    return qs[i];
  }
  function say(state, text, addAsk) {
    var out = withName(state, String(text || "").trim());
    if (addAsk !== false && !/\?/.test(out)) out += " " + ask(state);
    if (state._last === out) out = "Fair. " + ask(state);
    state._last = out;
    return out.replace(/\s+/g, " ").trim();
  }
  window.twinOpening = function (p) {
    return "Hi im " + ((p && p.name) || "me") + " who am i talking with";
  };
  window.twinCaptureName = function (raw, state) {
    if (state.guestName) return state.guestName;
    var n = extractGuestName(raw);
    if (n) state.guestName = n;
    return state.guestName || "";
  };
  window.twinReply = function (p, raw, state) {
    var t = norm(raw);
    state.turns = (state.turns || 0) + 1;
    window.twinCaptureName(raw, state);
    var min = (p && p.minDuration) || "1 hour";
    var n = nm(state);
    if (/underage|teen|schoolgirl|little girl/.test(t)) return "No. Adult bookings only. That's the end of this chat.";
    if (!n && state.turns <= 2) return say(state, "Nice to meet you.", false) + " What should I call you?";
    if (/how are you|how's it going|hows it going|what's up|whats up|you good|you alright/.test(t)) {
      return say(state, pick([
        "Yeah I'm good. Quiet afternoon, just on my phone.",
        "Not bad. Was going to make tea. You?",
        "I'm alright. You just saying hi or did you have a night in mind?"
      ]));
    }
    if (/wasn'?t yet|dont know yet|don't know yet|not sure yet|no idea|haven'?t thought/.test(t)) {
      return say(state, pick([
        "No rush. Even a rough idea helps \u2014 weeknight or weekend.",
        "That's fine. Are you more incall or hotel when you do book?",
        "Okay. Are you in London or coming in?"
      ]));
    }
    if (/^(lol|lmao|haha+|hehe|yeah|yeh|yep|ok|okay|cool|nice|fair|true|right)$/.test(t)) {
      return say(state, pick(["Haha okay.", "Fair.", "Alright."]));
    }
    if (/30 min|thirty min|half an hour|half hour/.test(t)) return say(state, "I don't do a rushed 30 minutes. " + min + " is the floor.");
    if (/2 hours for the price|two for one|2 for 1|discount|haggle|cheaper|can you do \u00a3/.test(t)) return say(state, "Rates stay the rates. No two-for-one.");
    if (/travelodge|premier inn|budget motel|motel/.test(t)) return say(state, "I don't do budget motels. Proper hotel or incall.");
    if (/\bcar\b|tinted windows|public spot/.test(t)) return say(state, "No cars, no public. Mine or a proper hotel.");
    if (/drop in|round the corner|open the door|come now/.test(t)) return say(state, "I don't do instant drop-ins. Give me time to get ready.");
    if (/live selfie|prove (it'?s|its) you|custom photo|quick video/.test(t)) return say(state, "I don't send live selfies over chat. Profile is me.");
    if (/street address|flat number|full address/.test(t)) return say(state, "I don't send the full address before screening.");
    if (/reading\b|watford|luton|outside london/.test(t)) return say(state, "That's outside my patch. Central hotel or incall.");
    if (/\bcim\b|explicit menu|menu checklist/.test(t)) return say(state, "I don't work off an explicit checklist. GFE, chemistry, no menu.");
    if (/girlfriend and i|my wife and|couples? session|duo session/.test(t)) return say(state, "I only see one guest. One-to-one I can do.");
    if (/smashed|intoxicated|wild drinks|drunk|pissed at the pub/.test(t)) return say(state, "I don't take guests mid-session at the pub. Tomorrow when you're clear-headed.");
    if (/bank statement|merchant name|what name shows/.test(t)) return say(state, "Card shows a generic merchant. Balance in cash on arrival.");
    if (/overnight|10pm to 8am/.test(t)) return say(state, "Overnight is for people I've already met. First time we do a couple of hours.");
    if (/bare option|bareback|no condom|hate condoms/.test(t)) return say(state, "No. Protection stays on \u2014 extra money doesn't change that.");
    if (/travel fee|charging extra for travel/.test(t)) return say(state, "Travel time and the cab sit with you on outcall.");
    if (/extend to|push your next/.test(t)) return say(state, "I don't bump the next person. We make the time you booked count.");
    if (/private apartment|come to my (flat|place|house|apartment)/.test(t)) return say(state, "First outcall is a proper hotel, not a private flat. Or come to me.");
    if (/rate|price|how much|\u00a3/.test(t)) return say(state, "I don't throw numbers in the first line. Day, how long, incall or hotel.");
    if (/where are you|based|location/.test(t)) return say(state, (p && p.city) ? p.city : "London.");
    if (/available|free tonight|free now|tonight/.test(t)) return say(state, "Might be. What time were you thinking?", false);
    if (/book|reserv/.test(t)) return say(state, "Tell me the day, length, and incall or hotel.", false);
    if (/scale of|missing me/.test(t)) return say(state, "Depends if you actually book or just text.");
    if (/who are you|your name/.test(t)) return say(state, "I'm " + ((p && p.name) || "me") + ".");
    return say(state, pick(["Okay.", "Got you.", "I'm here.", "Say a bit more \u2014 day or hotel is enough to start."]));
  };
})();
