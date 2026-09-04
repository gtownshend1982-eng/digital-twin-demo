/* Pitch chat — houses, slots, cock size, breast size */
(function () {
  var WING = {
    andreia:"female", tanita:"female", caroline:"female", faye:"female", joselyn:"female",
    ben:"male", glenn:"male", travis:"male", luke:"male", jeremy:"male",
    alexis:"trans", marianna:"trans", nicole:"trans", sophie:"trans", duda:"trans"
  };
  var SIZE = {
    ben:{inches:"7.5",cat:"large"}, glenn:{inches:"6.5",cat:"medium"}, travis:{inches:"6",cat:"medium"},
    luke:{inches:"7",cat:"large"}, jeremy:{inches:"6.8",cat:"medium"},
    alexis:{inches:"7.5",cat:"large"}, marianna:{inches:"6.5",cat:"medium"}, nicole:{inches:"5",cat:"medium"},
    sophie:{inches:"6.2",cat:"medium"}, duda:{inches:"7",cat:"large"}
  };
  var BUST = {
    andreia: "Big natural chest. Soft curves.",
    tanita: "Natural, proportional on a tall frame.",
    caroline: "Natural, girl-next-door. Not a fake glam set.",
    faye: "Natural. Not the point of the booking.",
    joselyn: "Natural, petite frame.",
    alexis: "Enhanced. Hourglass.",
    marianna: "Enhanced. Brazilian hourglass.",
    nicole: "Enhanced. Petite frame.",
    sophie: "Enhanced. Willowy, not huge.",
    duda: "Enhanced. Model frame, not the main event."
  };
  var SEX = {
    ben:"GFE, kissing, unhurried.", glenn:"Girlfriend energy with women.", travis:"Kissing, oral.",
    luke:"GFE or more physical.", jeremy:"Dinner, hotel, slow.",
    andreia:"Soft GFE — kissing, cuddling.", tanita:"Hotel GFE, dinner.", caroline:"Straightforward session.",
    faye:"Dominance, protocol.", joselyn:"Soft D/s, aftercare.",
    alexis:"GFE, kissing, I can lead.", marianna:"Playful GFE.", nicole:"Sweet GFE.",
    sophie:"Massage into sex.", duda:"Dinner, hotel, kissing."
  };
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function norm(s){return String(s||"").toLowerCase().replace(/[’']/g,"'").trim();}
  var STOP=/^(hi|hey|hello|yo|yes|yeah|ok|okay|cool|im|i'm|me|you|who|what|when|how|free|tonight|today|book|hotel|love|baby|babe|hun|mate)$/i;
  function titleName(s){return String(s||"").replace(/[^\p{L}\p{N}'-]+/gu,"").replace(/^\w/,function(c){return c.toUpperCase();});}
  function extractGuestName(raw){
    var text=String(raw||"").trim();
    var m=text.match(/(?:i(?:['’]?m| am)|this is|call me)\s+([A-Za-z][A-Za-z'\-]{1,20})/i);
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
    if(askMore!==false && !/\?/.test(out)) out+=" "+nextAsk(state);
    return out.replace(/\s+/g," ").trim();
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
    if(/^(hi|hey|hello|hiya)\b/.test(t) && state.guestName && state.turns<=3) return say(state,"Hey. Nice to meet you.",false);
    if(/boobs?|tits|breast|bust|cup size|how big are your (boobs|tits|breasts)/.test(t)){
      if(wing==="male") return say(state,"That's a female or trans question.",false);
      return say(state, BUST[id]||"Natural.", false);
    }
    if(/are you big|you hung|cock size|dick size|how big|how many inches|what size are you|well endowed/.test(t)){
      if(wing==="female") return say(state,"That's a male or trans question. I'm a woman.",false);
      var s=SIZE[id];
      if(!s) return say(state,"You'll see.",false);
      if(/inch/.test(t)) return say(state,"About "+s.inches+" inches.",false);
      return say(state, s.cat==="large" ? "Yeah, on the bigger side." : "Not a monster, I do alright.", false);
    }
    if(/are you (a )?(trans|tranny|shemale|ladyboy)|trans woman/.test(t)){
      return say(state, wing==="trans" ? "Yes. Trans woman. She/her." : "No. I'm not trans.", false);
    }
    if(/are you (a )?(man|guy|male)/.test(t)) return say(state, wing==="male" ? "Yes. I'm a man." : "No.", false);
    if(/are you (a )?(woman|girl|female)/.test(t)) return say(state, (wing==="female"||wing==="trans") ? "Yes. Woman. She/her." : "No. I'm a man.", false);
    if(/who else|other (girls|guys|women|men)|male house|female house|trans house/.test(t)){
      return say(state,"Three houses. Female: Andreia, Tanita, Caroline, Faye, Joselyn. Male: Ben, Glenn, Travis, Luke, Jeremy. Trans: Alexis, Marianna, Nicole, Sophie, Duda.",false);
    }
    if(/i said/.test(t) || (/tonight|today/.test(t) && state.day && state.turns>2)){
      if(state.time&&state.day) return say(state,"Got it — "+state.time+" "+state.day+".",true);
      if(state.day) return say(state,"Got it — "+state.day+".",true);
    }
    if(/what (are you|r you) into|sexually|in bed|kinks?/.test(t)) return say(state,(SEX[id]||"GFE.")+" What are you in the mood for?",false);
    if(/how are you|how's it going|whats up|what's up/.test(t)) return say(state,pick(["Yeah I'm good. Quiet afternoon.","Not bad. You?"]),false);
    if(/30 min|half an hour|half hour/.test(t)) return say(state,"I don't do a rushed 30 minutes. "+min+" is the floor.");
    if(/available|free/.test(t)||state.day||state.time){
      if(state.time&&state.day) return say(state,"I can look at "+state.time+" "+state.day+".");
      if(state.day&&!state.time) return say(state,"Tonight could work.");
      if(state.time&&!state.day) return say(state,state.time+" is possible — which night?");
      return say(state,"Might be.");
    }
    return say(state,pick(["Okay.","Yeah."]),state.turns>=5);
  };
})();
