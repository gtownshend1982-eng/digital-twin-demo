/* Pitch chat — slang clusters, houses, slots, Book me now */
(function () {
  var WING = {andreia:"female",tanita:"female",caroline:"female",faye:"female",joselyn:"female",ben:"male",glenn:"male",travis:"male",luke:"male",jeremy:"male",alexis:"trans",marianna:"trans",nicole:"trans",sophie:"trans",duda:"trans"};
  var SIZE = {ben:{inches:"7.5",cat:"large"},glenn:{inches:"6.5",cat:"medium"},travis:{inches:"6",cat:"medium"},luke:{inches:"7",cat:"large"},jeremy:{inches:"6.8",cat:"medium"},alexis:{inches:"7.5",cat:"large"},marianna:{inches:"6.5",cat:"medium"},nicole:{inches:"5",cat:"medium"},sophie:{inches:"6.2",cat:"medium"},duda:{inches:"7",cat:"large"}};
  var BUST = {andreia:"Big natural chest. Soft curves.",tanita:"Natural, proportional on a tall frame.",caroline:"Natural, girl-next-door.",faye:"Natural. Not the point of the booking.",joselyn:"Natural, petite frame.",alexis:"Enhanced. Hourglass.",marianna:"Enhanced. Brazilian hourglass.",nicole:"Enhanced. Petite frame.",sophie:"Enhanced. Willowy, not huge.",duda:"Enhanced. Model frame."};
  var SEX = {ben:"GFE, kissing, unhurried.",glenn:"Girlfriend energy with women.",travis:"Kissing, oral.",luke:"GFE or more physical.",jeremy:"Dinner, hotel, slow.",andreia:"Soft GFE — kissing, cuddling.",tanita:"Hotel GFE, dinner.",caroline:"Straightforward session.",faye:"Dominance, protocol.",joselyn:"Soft D/s, aftercare.",alexis:"GFE, kissing, I can lead.",marianna:"Playful GFE.",nicole:"Sweet GFE.",sophie:"Massage into sex.",duda:"Dinner, hotel, kissing."};
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function norm(s){return String(s||"").toLowerCase().replace(/[’']/g,"'").trim();}
  var STOP=/^(hi|hey|hello|yo|yes|yeah|ok|okay|cool|im|i'm|me|you|who|what|when|how|free|tonight|today|book|hotel|love|baby|babe|hun|mate)$/i;
  function titleName(s){return String(s||"").replace(/[^\p{L}\p{N}'-]+/gu,"").replace(/^\w/,function(c){return c.toUpperCase();});}
  function extractGuestName(raw){
    var m=String(raw||"").trim().match(/(?:i(?:['’]?m| am)|this is|call me)\s+([A-Za-z][A-Za-z'\-]{1,20})/i);
    if(m&&m[1]&&!STOP.test(m[1])) return titleName(m[1]);
    return "";
  }
  function grabSlots(raw,state){
    var t=norm(raw);
    if(/\btonight\b|\btoday\b/.test(t)) state.day="tonight";
    if(/\btomorrow\b/.test(t)) state.day="tomorrow";
    var d=t.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/);
    if(d) state.day=d[1];
    var tm=t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/)||t.match(/\b(\d{1,2})\s*(am|pm)\b/);
    if(tm) state.time=tm[0].replace(/\s+/g,"");
    if(/\bincall\b|your place|at yours/.test(t)) state.where="incall";
    if(/\boutcall\b|hotel|my place/.test(t)) state.where="hotel";
  }
  function nextAsk(state){
    if(!state.day) return "Tonight or another night?";
    if(!state.time) return "What time?";
    if(!state.where) return "Incall or hotel?";
    return "Want me to look at holding "+state.time+" "+state.day+"?";
  }
  function say(state,text,askMore){
    var n=state.guestName;
    var out=String(text||"").trim();
    if(n&&!state._named){out=out.replace(/[.!?]\s*$/,"")+", "+n+".";state._named=true;}
    if(askMore===true && !/\?/.test(out)) out+=" "+nextAsk(state);
    return out.replace(/\s+/g," ").trim();
  }
  function slang(t,id,wing){
    if(/\bbb\b|bareback|no condom|owo|bbbj|bbbjtc|\bcim\b|cimws|\bcof\b|\bcob\b|atm\b|ass to mouth/.test(t))
      return "No. Protection stays on. I don't do those extras off a list.";
    if(/\bgfe\b|girlfriend experience|vanilla/.test(t)) return "Yes — GFE is how I like it. Kissing, unhurried.";
    if(/\bpse\b|porn star experience/.test(t)) return "I'm more GFE than PSE.";
    if(/\bfs\b|full service|home run|getting laid|\bbang\b|\bbone\b|smash|pipe|dicked down|clapping cheeks/.test(t))
      return "That's a normal booking, not slang for the sake of it. Use Book me now when you want the slot.";
    if(/\bdtf\b|down to fuck|\bnsa\b|no strings|\bfwb\b|fuck buddy|friends with privileges|sneaky link|booty call|side piece|one-night stand|\bons\b|casual encounter|hook ?up/.test(t))
      return "This is a booking, not a secret hookup thread.";
    if(/time-?waster|punter|\bjohn\b/.test(t)) return "Don't be that. Book or keep it light.";
    if(/\bincall\b/.test(t) && /what|do you|yours/.test(t)) return "I can do incall.";
    if(/\boutcall\b/.test(t)) return "Outcall is hotel or a proper place, not a car.";
    if(/screen(ing)?|deposit/.test(t)) return "Screening and a deposit lock the slot. Address after that.";
    if(/overnight|\bo\/n\b|dinner date/.test(t)) return "Overnight and dinner are for when we've already met, or a proper long booking.";
    if(/\bext\b|extension/.test(t)) return "I don't bump the next person. Book the hours you want first.";
    if(/duo|tandem|couples booking|threesome|foursome|group sex|m[eé]nage/.test(t)) return id==="ben"||id==="luke"||id==="andreia" ? "Couples only if we agreed it first." : "I only see one guest.";
    if(/\bbj\b|\bcbj\b|\bfrench\b|blow ?job|\bhj\b|hand ?job|happy ending|\bhead\b|\bbrain\b|going down|third-base|daty|cunnilingus/.test(t))
      return "Oral and hands can be part of a normal session. Covered. Not haggled as extras.";
    if(/\bdfk\b|french kiss|\blk\b|light kissing|make out|hickey/.test(t)) return "Kissing is part of it if the vibe is there.";
    if(/\bgreek\b|anal|\bdp\b|\bddp\b|dato|rimming|pegging|\bcbt\b/.test(t)) return "That's not an automatic yes. Limits stay limits.";
    if(/spanish|russian|italian|titty ?fuck|motorboat|body slide|\bbs\b|\bmsog\b|doggy|missionary|cowgirl|sixty-?nine|\b69\b|dry hump|spooning|mile high/.test(t))
      return "I don't work off a position menu. Book the time and we'll see.";
    if(/\bbdsm\b|\bb&d\b|\bs&m\b|domme|\bdom\b|\bsub\b|switch|kink|fetish|roleplay|\brp\b|edging|tease & denial/.test(t)){
      if(id==="faye") return "That's the session. Protocol, not a girlfriend date.";
      if(id==="joselyn") return "Soft D/s if we agree it. Aftercare included.";
      return "Light only, if at all. I'm not a dungeon booking.";
    }
    if(/body count|butterface|simp|coomer|goon/.test(t)) return "I'm not doing that conversation.";
    if(/sugar daddy|sugar baby/.test(t)) return "This is a booked session, not an allowance arrangement.";
    if(/\bof\b|fansly|ppv|spicy page|content creator|\bsw\b|swer|accountant|custy|\bwhale\b|custom video|cybersex|sexting/.test(t))
      return "This chat is for meeting in person. I'm not selling clips here.";
    if(/rizz|thirst|glow up|down bad|gyatt|smash or pass|horny|randy|wet|blue balls|morning wood|afterglow|pnc|freak/.test(t))
      return "Cute. If you want to meet, Book me now. If you want to talk, talk.";
    if(/\uD83C\uDF51|\uD83C\uDF46|\uD83C\uDF4C/.test(t) || /eggplant|banana emoji/.test(t)){
      if(wing==="female") return "That's a male or trans question.";
      var s=SIZE[id];
      return s && s.cat==="large" ? "Yeah, on the bigger side." : "I do alright.";
    }
    if(/\uD83C\uDF51|peach|cake emoji|gyatt|\uD83E\uDD70/.test(t) && /ass|bum|butt|peach/.test(t)) return id==="marianna"||id==="andreia" ? "That's rather the point." : "You'll see.";
    if(/\uD83C\uDF4E|\uD83C\uDF48|boobs?|tits|melons/.test(t) && wing!=="male") return BUST[id]||"Natural.";
    return "";
  }
  window.twinOpening=function(p){return "Hi im "+((p&&p.name)||"me")+" who am i talking with";};
  window.twinCaptureName=function(raw,state){
    if(!state.guestName){var n=extractGuestName(raw);if(n) state.guestName=n;}
    return state.guestName||"";
  };
  window.twinReply=function(p,raw,state){
    var t=norm(raw);
    state.turns=(state.turns||0)+1;
    window.twinCaptureName(raw,state);
    grabSlots(raw,state);
    var id=(p&&p.id)||"";
    var min=(p&&p.minDuration)||"1 hour";
    var wing=WING[id]||"";
    if(/underage|teen|schoolgirl/.test(t)) return "No. Adult bookings only. That's the end of this chat.";
    if(!state.guestName && state.turns<=2) return "Nice to meet you. What should I call you?";
    if(/^(hi|hey|hello|hiya)\b/.test(t) && state.guestName && state.turns<=3) return say(state,"Hey. Nice to meet you.");
    if(/i('|)d like to book|book me now|want to book/.test(t)) return say(state,"Cute. Let's lock it in.", true);
    var sl=slang(t,id,wing);
    if(sl) return say(state,sl);
    if(/are you big|you hung|cock size|dick size|how big|how many inches|well endowed/.test(t)){
      if(wing==="female") return say(state,"That's a male or trans question.");
      var s=SIZE[id];
      if(!s) return say(state,"You'll see.");
      if(/inch/.test(t)) return say(state,"About "+s.inches+" inches.");
      return say(state, s.cat==="large" ? "Yeah, on the bigger side." : "Not a monster, I do alright.");
    }
    if(/boobs?|tits|breast|bust/.test(t)) return say(state, wing==="male" ? "That's a female or trans question." : (BUST[id]||"Natural."));
    if(/are you (a )?(trans|tranny|shemale)|trans woman/.test(t)) return say(state, wing==="trans" ? "Yes. Trans woman. She/her." : "No. I'm not trans.");
    if(/are you (a )?(man|guy|male)/.test(t)) return say(state, wing==="male" ? "Yes. I'm a man." : "No.");
    if(/are you (a )?(woman|girl|female)/.test(t)) return say(state, (wing==="female"||wing==="trans") ? "Yes. Woman. She/her." : "No. I'm a man.");
    if(/who else|male house|female house|trans house/.test(t)) return say(state,"Three houses. Female: Andreia, Tanita, Caroline, Faye, Joselyn. Male: Ben, Glenn, Travis, Luke, Jeremy. Trans: Alexis, Marianna, Nicole, Sophie, Duda.");
    if(/what (are you|r you) into|sexually|in bed|kinks?/.test(t)) return say(state,(SEX[id]||"GFE.")+" What are you in the mood for?");
    if(/how are you|how's it going|whats up|what's up/.test(t)) return say(state,pick(["Yeah I'm good. Quiet afternoon.","Not bad. You?"]));
    if(/30 min|half an hour/.test(t)) return say(state,"I don't do a rushed 30 minutes. "+min+" is the floor.");
    if(/available|free/.test(t)) return say(state,"Might be. Use Book me now when you want to lock it.");
    if(state.time&&state.day) return say(state,"I can look at "+state.time+" "+state.day+".");
    if(/i said/.test(t) && (state.day||state.time)) return say(state,"Got it — "+[state.time,state.day].filter(Boolean).join(" ")+".");
    return say(state,pick(["Okay.","Yeah.","I'm here."]));
  };
})();
