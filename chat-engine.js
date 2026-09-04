/* Pitch chat — remember name, day, time */
(function () {
  var SEX = {
    ben: "GFE, kissing, unhurried. I like it to feel like we fancy each other.",
    glenn: "Girlfriend energy with women — talking, kissing, not a porn scene.",
    travis: "Kissing, oral, I like being wanted. Light kink if it fits.",
    luke: "GFE or more physical. I don't rush a first-timer.",
    jeremy: "Dinner, hotel, slow. Not a checklist.",
    andreia: "Soft GFE — kissing, cuddling, taking our time. Chemistry over a menu.",
    tanita: "Hotel GFE, dinner, unhurried.",
    caroline: "Straightforward. Kissing, standard session.",
    faye: "Dominance, protocol, control. Not a girlfriend date.",
    joselyn: "Soft D/s, praise, gentle to medium. Aftercare matters.",
    alexis: "GFE, kissing, I can lead. Respect first.",
    marianna: "Kissing, oral, playful GFE.",
    nicole: "Sweet GFE — kissing, cuddling, oral.",
    sophie: "Massage into sex, kissing, quiet GFE.",
    duda: "Dinner, hotel, kissing. Not rushed."
  };
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function norm(s) { return String(s || "").toLowerCase().replace(/[’']/g, "'").trim(); }
  var STOP = /^(hi|hey|hello|yo|yes|yeah|ok|okay|cool|im|i'm|me|you|who|what|when|how|free|tonight|today|tomorrow|book|hotel|love|baby|babe|hun|mate)$/i;
  function titleName(s) {
    return String(s || "").replace(/[^\p{L}\p{N}'-]+/gu, "").replace(/^\w/, function (c) { return c.toUpperCase(); });
  }
  function extractGuestName(raw) {
    var text = String(raw || "").trim();
    var m = text.match(/(?:i(?:['’]?m| am)|this is|call me)\s+([A-Za-z][A-Za-z'\-]{1,20})/i);
    if (m && m[1] && !STOP.test(m[1])) return titleName(m[1]);
    return "";
  }
  function grabSlots(raw, state) {
    var t = norm(raw);
    if (/\btonight\b|\btoday\b/.test(t)) state.day = "tonight";
    if (/\btomorrow\b/.test(t)) state.day = "tomorrow";
    if (/\bweekend\b/.test(t)) state.day = "the weekend";
    var d = t.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/);
    if (d) state.day = d[1];
    var tm = t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/) || t.match(/\b(\d{1,2})\s*(am|pm)\b/);
    if (tm) state.time = tm[0].replace(/\s+/g, "");
    if (/\bincall\b|your place|at yours/.test(t)) state.where = "incall";
    if (/\boutcall\b|hotel|my place/.test(t)) state.where = "hotel";
  }
  function nextAsk(state) {
    if (!state.day) return "Tonight or another night?";
    if (!state.time) return "What time?";
    if (!state.where) return "Incall or hotel?";
    return "Want me to look at holding " + state.time + " " + state.day + "?";
  }
  function say(state, text, askMore) {
    var n = state.guestName;
    var out = String(text || "").trim();
    if (n && !state._named) { out = out.replace(/[.!?]\s*$/, "") + ", " + n + "."; state._named = true; }
    if (askMore !== false && !/\?/.test(out)) out += " " + nextAsk(state);
    return out.replace(/\s+/g, " ").trim();
  }
  window.twinOpening = function (p) { return "Hi im " + ((p && p.name) || "me") + " who am i talking with"; };
  window.twinCaptureName = function (raw, state) {
    if (!state.guestName) { var n = extractGuestName(raw); if (n) state.guestName = n; }
    return state.guestName || "";
  };
  window.twinReply = function (p, raw, state) {
    var t = norm(raw);
    state.turns = (state.turns || 0) + 1;
    window.twinCaptureName(raw, state);
    grabSlots(raw, state);
    var id = (p && p.id) || "";
    var min = (p && p.minDuration) || "1 hour";
    if (/underage|teen|schoolgirl/.test(t)) return "No. Adult bookings only. That's the end of this chat.";
    if (!state.guestName && state.turns <= 2) return "Nice to meet you. What should I call you?";
    if (/^(hi|hey|hello|hiya)\b/.test(t) && state.guestName && state.turns <= 3) {
      return say(state, "Hey. Nice to meet you.", false);
    }
    if (/i said/.test(t) || (/tonight|today/.test(t) && state.day && state.turns > 2)) {
      if (state.time && state.day) return say(state, "Got it — " + state.time + " " + state.day + ".", true);
      if (state.day) return say(state, "Got it — " + state.day + ".", true);
    }
    if (/what (are you|r you) into|sexually|in bed|kinks?/.test(t)) {
      return say(state, (SEX[id] || "Soft GFE — kissing, chemistry.") + " What are you in the mood for?", false);
    }
    if (/how are you|how's it going|whats up|what's up/.test(t)) {
      return say(state, pick(["Yeah I'm good. Quiet afternoon.", "Not bad. You?"]), false);
    }
    if (/30 min|half an hour|half hour/.test(t)) return say(state, "I don't do a rushed 30 minutes. " + min + " is the floor.");
    if (/discount|haggle|cheaper|two for one/.test(t)) return say(state, "Rates stay the rates.");
    if (/available|free/.test(t) || state.day || state.time) {
      if (state.time && state.day) return say(state, "I can look at " + state.time + " " + state.day + ".");
      if (state.day && !state.time) return say(state, "Tonight could work.");
      if (state.time && !state.day) return say(state, state.time + " is possible — which night?");
      return say(state, "Might be.");
    }
    return say(state, pick(["Okay.", "Yeah."]), state.turns >= 5);
  };
})();
