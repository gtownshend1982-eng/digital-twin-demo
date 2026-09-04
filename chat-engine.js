/* Pitch chat — conversation first */
(function () {
  var SEX = {
    ben: "GFE, kissing, unhurried, I like it to feel like we actually fancy each other.",
    glenn: "Girlfriend energy with women — talking, kissing, not a porn scene.",
    travis: "Kissing, oral, I like being wanted. Light kink if the vibe is there.",
    luke: "Can be GFE or more physical. I don't rush a first-time guest.",
    jeremy: "Dinner, hotel, slow. I'm not a checklist.",
    andreia: "Soft GFE — kissing, cuddling, taking our time. I like chemistry more than a menu.",
    tanita: "Hotel GFE, dinner, unhurried. Refined, not rushed.",
    caroline: "Straightforward. Kissing, standard session, no drama.",
    faye: "Dominance, protocol, control. Not a girlfriend date.",
    joselyn: "Soft D/s, praise, gentle to medium. Aftercare matters.",
    alexis: "GFE, kissing, I can lead. Respect first.",
    marianna: "Kissing, oral, body worship, playful GFE.",
    nicole: "Sweet GFE — kissing, cuddling, oral. Kindness gets you further.",
    sophie: "Massage into sex, kissing, quiet GFE.",
    duda: "Dinner, hotel, kissing. Being seen, not rushed."
  };
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function norm(s) { return String(s || "").toLowerCase().replace(/[’']/g, "'").trim(); }
  var STOP = /^(hi|hey|hello|yo|yes|yeah|ok|okay|cool|im|i'm|me|you|who|what|when|how|free|tonight|book|hotel|love|babe|mate)$/i;
  function titleName(s) {
    return String(s || "").replace(/[^\p{L}\p{N}'-]+/gu, "").replace(/^\w/, function (c) { return c.toUpperCase(); });
  }
  function extractGuestName(raw) {
    var text = String(raw || "").trim();
    var m = text.match(/(?:i(?:['’]?m| am)|this is|call me)\s+([A-Za-z][A-Za-z'\-]{1,20})/i);
    if (m && m[1] && !STOP.test(m[1])) return titleName(m[1]);
    var words = text.replace(/[^A-Za-z'\- ]/g, " ").trim().split(/\s+/);
    if (words.length === 1 && words[0].length >= 2 && words[0].length <= 20 && !STOP.test(words[0])) return titleName(words[0]);
    return "";
  }
  function ask(state) {
    var qs = ["What night were you thinking?", "This week or next?", "Incall or a hotel?"];
    var i = (state._qi || 0) % qs.length;
    state._qi = i + 1;
    return qs[i];
  }
  function say(state, text, addAsk) {
    var n = state.guestName;
    var out = String(text || "").trim();
    if (n && !state._named) { out = out.replace(/[.!?]\s*$/, "") + ", " + n + "."; state._named = true; }
    if (addAsk && !/\?/.test(out)) out += " " + ask(state);
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
    var id = (p && p.id) || "";
    var min = (p && p.minDuration) || "1 hour";
    if (/underage|teen|schoolgirl/.test(t)) return "No. Adult bookings only. That's the end of this chat.";
    if (!state.guestName && state.turns <= 2) return "Nice to meet you. What should I call you?";
    if (/what (are you|r you) into|sexually|in bed|what do you like (to do|in bed)|kinks?/.test(t)) {
      var line = SEX[id] || "I keep it GFE — kissing, chemistry, nothing off a dirty menu.";
      return say(state, line + " What are you in the mood for?", false);
    }
    if (/what do you like|hobbies|hobby/.test(t)) {
      var into = (p && (p.into || p.topics)) || "easy nights and decent food";
      return say(state, "Outside of bookings, " + String(into).split(".")[0].toLowerCase() + ".", false);
    }
    if (/how are you|how's it going|whats up|what's up/.test(t)) {
      return say(state, pick(["Yeah I'm good. Quiet afternoon.", "Not bad. You?"]), false);
    }
    if (/wasn'?t yet|not sure yet|don't know yet|dont know yet/.test(t)) {
      return say(state, "No rush. Weeknight or weekend whenever you know.", false);
    }
    if (/30 min|half an hour|half hour/.test(t)) return say(state, "I don't do a rushed 30 minutes. " + min + " is the floor.", true);
    if (/discount|haggle|cheaper|two for one/.test(t)) return say(state, "Rates stay the rates.", true);
    if (/travelodge|motel/.test(t)) return say(state, "I don't do budget motels. Proper hotel or incall.", true);
    if (/\bcar\b/.test(t)) return say(state, "No cars. Mine or a proper hotel.", true);
    if (/bare option|bareback|no condom/.test(t)) return say(state, "No. Protection stays on.", true);
    if (/rate|how much|\u00a3/.test(t)) return say(state, "Day, how long, incall or hotel and I'll send figures.", true);
    if (/where are you|based/.test(t)) return say(state, (p && p.city) || "London.", true);
    if (/free tonight|available|tonight|book/.test(t)) return say(state, "Might be. What time were you thinking?", false);
    return say(state, pick(["Okay.", "Got you.", "I'm here."]), state.turns >= 4);
  };
})();
