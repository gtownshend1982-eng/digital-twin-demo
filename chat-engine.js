/* Pitch chat — conversation first, booking ask after */
(function () {
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function norm(s) { return String(s || "").toLowerCase().replace(/[’']/g, "'").trim(); }
  var STOP = /^(hi|hey|hello|yo|sup|hiya|oi|alright|yes|yeah|yeh|yep|ok|okay|cool|nice|thanks|im|i'm|me|you|who|what|when|where|how|free|tonight|book|incall|outcall|hotel|love|baby|babe|hun|mate)$/i;
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
    var qs = ["What night were you thinking?", "This week or next?", "Incall or a hotel?", "Hour or a bit longer?"];
    var i = (state._qi || 0) % qs.length;
    state._qi = i + 1;
    return qs[i];
  }
  function say(state, text, addAsk) {
    var n = state.guestName;
    var out = String(text || "").trim();
    if (n && !state._named) { out = out.replace(/[.!?]\s*$/, "") + ", " + n + "."; state._named = true; }
    if (addAsk !== false && !/\?/.test(out)) out += " " + ask(state);
    if (state._last === out) out = "Fair. " + ask(state);
    state._last = out;
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
    var min = (p && p.minDuration) || "1 hour";
    if (/underage|teen|schoolgirl/.test(t)) return "No. Adult bookings only. That's the end of this chat.";
    if (!state.guestName && state.turns <= 2) return "Nice to meet you. What should I call you?";
    if (/what (are you|r you) into|what do you like|hobbies|hobby/.test(t)) {
      var into = (p && (p.into || p.topics)) || "";
      var music = (p && p.music) || "";
      var line = into ? ("I'm into " + String(into).split(".")[0].toLowerCase() + ".") : "Easy company, food, not a checklist.";
      if (music) line += " Music-wise " + String(music).split(".")[0].toLowerCase() + ".";
      return say(state, line);
    }
    if (/how are you|how's it going|whats up|what's up/.test(t)) {
      return say(state, pick(["Yeah I'm good. Quiet afternoon, just on my phone.", "Not bad. Was going to make tea. You?", "I'm alright. You just saying hi or did you have a night in mind?"]));
    }
    if (/wasn'?t yet|not sure yet|don't know yet|dont know yet/.test(t)) {
      return say(state, pick(["No rush. Even a rough idea helps \u2014 weeknight or weekend.", "That's fine. Are you more incall or hotel when you do book?"]));
    }
    if (/30 min|half an hour|half hour/.test(t)) return say(state, "I don't do a rushed 30 minutes. " + min + " is the floor.");
    if (/discount|haggle|cheaper|two for one|2 for 1/.test(t)) return say(state, "Rates stay the rates.");
    if (/travelodge|motel/.test(t)) return say(state, "I don't do budget motels. Proper hotel or incall.");
    if (/\bcar\b/.test(t)) return say(state, "No cars. Mine or a proper hotel.");
    if (/bare option|bareback|no condom/.test(t)) return say(state, "No. Protection stays on.");
    if (/rate|how much|\u00a3/.test(t)) return say(state, "I don't throw numbers in the first line. Day, how long, incall or hotel.");
    if (/where are you|based/.test(t)) return say(state, (p && p.city) || "London.");
    if (/free tonight|available|tonight/.test(t)) return say(state, "Might be. What time were you thinking?", false);
    return say(state, pick(["Okay.", "Got you.", "I'm here."]));
  };
})();
