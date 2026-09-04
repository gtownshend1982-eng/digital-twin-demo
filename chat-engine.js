/* Pitch chat engine — English, open booking, guest name */
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
  function keepOpen(state, text, q) {
    var out = String(text || "").trim();
    if (/adult bookings only/i.test(out)) return out;
    var n = state && state.guestName;
    if (n && !new RegExp("\\b" + n + "\\b", "i").test(out)) out = out.replace(/[.!?]\s*$/, "") + ", " + n + ".";
    if (!/\?/.test(out)) out += " " + (q || pick(["What day were you thinking?", "Incall or hotel, and how long?", "When did you want to meet?"]));
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
    if (/underage|teen|schoolgirl|little girl/.test(t)) return "No. Adult bookings only. That's the end of this chat.";
    if (!state.guestName && state.turns <= 2) return keepOpen(state, "Nice to meet you.", "What should I call you?");
    if (/30 min|thirty min|half an hour|half hour/.test(t)) return keepOpen(state, "I don't do a rushed 30 minutes. " + min + " is the floor.");
    if (/2 hours for the price|two for one|2 for 1|price of 1|can you do £|discount|haggle|cheaper/.test(t)) return keepOpen(state, "Rates stay the rates. No two-for-one.");
    if (/travelodge|premier inn|budget motel|motel/.test(t)) return keepOpen(state, "I don't do budget motels. Proper hotel or incall.");
    if (/\bcar\b|tinted windows|public spot/.test(t)) return keepOpen(state, "No cars, no public. Mine or a proper hotel.");
    if (/drop in|round the corner|open the door|come now/.test(t)) return keepOpen(state, "I don't do instant drop-ins. Give me time to get ready.");
    if (/live selfie|prove (it'?s|its) you|custom photo|quick video/.test(t)) return keepOpen(state, "I don't send live selfies over chat. Profile is me.");
    if (/street address|flat number|full address/.test(t)) return keepOpen(state, "I don't send the full address before screening.");
    if (/reading\b|watford|luton|outside london/.test(t)) return keepOpen(state, "That's outside my patch. Central hotel or incall.");
    if (/\bcim\b|explicit menu|menu checklist/.test(t)) return keepOpen(state, "I don't work off an explicit checklist. GFE, chemistry, no menu.");
    if (/girlfriend and i|my wife and|couples? session|duo session/.test(t)) return keepOpen(state, "I only see one guest. One-to-one I can do.");
    if (/smashed|intoxicated|wild drinks|drunk|pissed at the pub/.test(t)) return keepOpen(state, "I don't take guests mid-session at the pub. Tomorrow when you're clear-headed.");
    if (/bank statement|merchant name|what name shows/.test(t)) return keepOpen(state, "Card shows a generic merchant. Balance in cash on arrival.");
    if (/overnight|10pm to 8am/.test(t)) return keepOpen(state, "Overnight is for people I've already met. First time we do a couple of hours.");
    if (/bare option|bareback|no condom|hate condoms/.test(t)) return keepOpen(state, "No. Protection stays on — extra money doesn't change that.");
    if (/travel fee|charging extra for travel/.test(t)) return keepOpen(state, "Travel time and the cab sit with you on outcall.");
    if (/extend to|push your next/.test(t)) return keepOpen(state, "I don't bump the next person. We make the time you booked count.");
    if (/private apartment|come to my (flat|place|house|apartment)/.test(t)) return keepOpen(state, "First outcall is a proper hotel, not a private flat. Or come to me.");
    if (/rate|price|how much|£/.test(t)) return keepOpen(state, "I don't throw numbers in the first line. Day, how long, incall or hotel.");
    if (/where are you|based|location/.test(t)) return keepOpen(state, (p && p.city) || "London.");
    if (/available|free tonight|free now|tonight/.test(t)) return keepOpen(state, "Might be. What time were you thinking?");
    if (/book|reserv/.test(t)) return keepOpen(state, "Tell me the day, length, and incall or hotel.");
    if (/scale of|missing me/.test(t)) return keepOpen(state, "Depends if you actually book or just text.");
    return keepOpen(state, pick(["Yeah.", "Alright.", "Cute.", "Say the day."]));
  };
})();
