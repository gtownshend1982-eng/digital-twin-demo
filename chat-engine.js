/* Pitch chat — same booking tone for all; min from questionnaire */
(function () {
  var WING = {andreia:"female",tanita:"female",caroline:"female",faye:"female",joselyn:"female",ben:"male",glenn:"male",travis:"male",luke:"male",jeremy:"male",alexis:"trans",marianna:"trans",nicole:"trans",sophie:"trans",duda:"trans"};
  var AREA = {andreia:"my place in Kensington",tanita:"central — Marylebone / Mayfair",caroline:"Zone 3 incall",faye:"a private incall, Zone 2",joselyn:"Zone 2 North",ben:"South London, easy into town",glenn:"East / Essex fringe",travis:"Vauxhall",luke:"North / Camden side",jeremy:"Kensington / Chelsea",alexis:"East / Canary",marianna:"Zone 2 West",nicole:"Zone 2/3 West",sophie:"Zone 1/2 West",duda:"Chelsea / Marylebone"};
  var SIZE = {ben:{inches:"7.5",cat:"large"},glenn:{inches:"6.5",cat:"medium"},travis:{inches:"6",cat:"medium"},luke:{inches:"7",cat:"large"},jeremy:{inches:"6.8",cat:"medium"},alexis:{inches:"7.5",cat:"large"},marianna:{inches:"6.5",cat:"medium"},nicole:{inches:"5",cat:"medium"},sophie:{inches:"6.2",cat:"medium"},duda:{inches:"7",cat:"large"}};
  var BUST = {andreia:"Big natural chest. Soft curves.",tanita:"Natural, proportional on a tall frame.",caroline:"Natural, girl-next-door.",faye:"Natural. Not the point of the booking.",joselyn:"Natural, petite frame.",alexis:"Enhanced. Hourglass.",marianna:"Enhanced. Brazilian hourglass.",nicole:"Enhanced. Petite frame.",sophie:"Enhanced. Willowy, not huge.",duda:"Enhanced. Model frame."};
  var SEX = {ben:"GFE, kissing, unhurried.",glenn:"Girlfriend energy with women.",travis:"Kissing, oral.",luke:"GFE or more physical.",jeremy:"Dinner, hotel, slow.",andreia:"Soft GFE — kissing, cuddling.",tanita:"Hotel GFE, dinner.",caroline:"Straightforward session.",faye:"Dominance, protocol.",joselyn:"Soft D/s, aftercare.",alexis:"GFE, kissing, I can lead.",marianna:"Playful GFE.",nicole:"Sweet GFE.",sophie:"Massage into sex.",duda:"Dinner, hotel, kissing."};
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function norm(s){return String(s||"").toLowerCase().replace(/[’']/g,"'").trim();}
  var STOP=/^(hi|hey|hello|yo|yes|yeah|yeh|yep|ok|okay|cool|nice|im|i'm|me|you|who|what|when|how|free|tonight|today|book|hotel|love|baby|babe|hun|mate|here)$/i;
  function titleName(s){return String(s||"").replace(/[^\p{L}\p{N}'-]+/gu,"").replace(/^\w/,function(c){return c.toUpperCase();});}
  function extractGuestName(raw){
    var text=String(raw||"").trim();
    var m=text.match(/(?:i(?:['’]?m| am)|this is|call me|name(?:'s| is))\s+([A-Za-z][A-Za-z'\-]{1,20})/i);
    if(m&&m[1]&&!STOP.test(m[1])) return titleName(m[1]);
    var words=text.replace(/[^A-Za-z'\- ]/g," ").trim().split(/\s+/);
    if(words.length===1 && words[0].length>=2 && words[0].length<=20 && !STOP.test(words[0])) return titleName(words[0]);
    return "";
  }
  function parseMinHours(p){
    var s=String((p&&p.minDuration)||"1 hour").toLowerCase();
    if(/2 hour/.test(s)) return 2;
    if(/45|30/.test(s)) return 0.75;
    return 1;
  }
  function minLabel(h){
    if(h>=2) return "2-hour minimum";
    if(h<1) return "45-minute incall minimum";
    return "1-hour minimum";
  }
  function grabSlots(raw,state){
    var t=norm(raw);
    if(/\btonight\b|\btoday\b/.test(t)) state.day="tonight";
    if(/\btomorrow\b/.test(t)) state.day="tomorrow";
    var d=t.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/);
    if(d) state.day=d[1];
    var tm=t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/)||t.match(/\b(\d{1,2})\s*(am|pm)\b/);
    if(tm) state.time=tm[0].replace(/\s+/g,"");
    if(/\bincall\b|your place|at yours|at mine/.test(t)) state.where="incall";
    if(/\boutcall\b|hotel|my place/.test(t)) state.where="hotel";
    if(/\b1 hour\b|one hour|an hour/.test(t)) state.wantHours=1;
    if(/\b2 hour/.test(t)) state.wantHours=2;
    if(/30 min|half an hour|45 min/.test(t)) state.wantHours=0.5;
  }
  function say(state,text){
    var n=state.guestName;
    var out=String(text||"").trim();
    if(n&&!state._named){out=out.replace(/[.!?]\s*$/,"")+", "+n+".";state._named=true;}
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
    var wing=WING[id]||(p&&p.wing)||"";
    var area=AREA[id]||(p&&p.city)||"London";
    var mh=parseMinHours(p);
    var label=minLabel(mh);

    if(/underage|teen|schoolgirl/.test(t)) return "No. Adult bookings only. That's the end of this chat.";
    if(!state.guestName && state.turns<=2) return "Nice to meet you. What should I call you?";
    if(state.guestName && state.turns<=3 && extractGuestName(raw)) return say(state,"Hey. Nice to meet you.");
    if(/^(hi|hey|hello|hiya)\b/.test(t) && state.guestName && state.turns<=3) return say(state,"Hey. Nice to meet you.");

    if(/selfie|prove (it'?s|its) you|video call first|custom photo/.test(t))
      return say(state,"I get why you're cautious, but the photos on the profile are me. I don't send extra selfies over chat. Better in person.");
    if(/how much|\u00a3|price|rate|cost/.test(t))
      return say(state,"Send the night and length and I'll text the figure. "+label+".");
    if(/cash|deposit|how do we (pay|sort)|how do i book|how do we sort the booking/.test(t))
      return say(state,"Cash on arrival is fine. A deposit holds the slot. Address after that. Easiest is Book me now — it can fill "+(state.time||"the time")+" "+(state.day||"")+".");
    if(/i('|)d like to book|book me now|want to book/.test(t))
      return say(state,"Use Book me now on the profile. It keeps "+(state.time||"the time")+" "+(state.day||"")+". Deposit and address come after.");

    if((state.wantHours!=null && state.wantHours<mh) || (/30 min|half an hour/.test(t) && mh>=1)){
      var when=state.time ? state.time+" works nicely, but " : "";
      return say(state, when+"I have a "+label+". I like us to take our time without watching the clock. "+(state.time? (state.time+" for "+(mh>=2?"2 hours":"a full hour")+" if that works."):"What time were you thinking?"));
    }

    if(/available|free/.test(t) || (/tonight/.test(t) && !state.time))
      return say(state,"Might be. I'm based at "+area+" this evening. What time were you thinking?");
    if(state.time && /hour|book/.test(t))
      return say(state, state.time+" "+(state.day||"")+" can work at "+area+". "+label+".");

    if(/\bbb\b|bareback|no condom|owo|bbbj|\bcim\b|atm\b/.test(t)) return say(state,"No. Protection stays on.");
    if(/\bgfe\b|girlfriend experience/.test(t)) return say(state,"Yes — GFE is how I like it.");
    if(/\bdtf\b|\bnsa\b|\bfwb\b|sneaky link|booty call|hook ?up/.test(t)) return say(state,"This is a booking, not a secret hookup thread.");
    if(/are you big|you hung|cock size|how many inches/.test(t)){
      if(wing==="female") return say(state,"That's a male or trans question.");
      var s=SIZE[id];
      return say(state, !s?"You'll see.":(/inch/.test(t)?("About "+s.inches+" inches."):(s.cat==="large"?"Yeah, on the bigger side.":"Not a monster, I do alright.")));
    }
    if(/boobs?|tits|breast|bust/.test(t)) return say(state, wing==="male"?"That's a female or trans question.":(BUST[id]||"Natural."));
    if(/are you (a )?(trans|tranny|shemale)|trans woman/.test(t)) return say(state, wing==="trans"?"Yes. Trans woman. She/her.":"No. I'm not trans.");
    if(/what (are you|r you) into|sexually|in bed|kinks?/.test(t)) return say(state,(SEX[id]||"GFE.")+" What are you in the mood for?");
    if(/how are you|how's it going|whats up|what's up|not bad/.test(t)) return say(state,pick(["Yeah not bad. You?","Yeah I'm good. Quiet afternoon."]));
    if(/who else|male house|female house|trans house/.test(t)) return say(state,"Three houses. Female: Andreia, Tanita, Caroline, Faye, Joselyn. Male: Ben, Glenn, Travis, Luke, Jeremy. Trans: Alexis, Marianna, Nicole, Sophie, Duda.");
    if(/i said/.test(t) && (state.day||state.time)) return say(state,"Got it — "+[state.time,state.day].filter(Boolean).join(" ")+".");
    if(state.time&&state.day) return say(state,"I can look at "+state.time+" "+state.day+" at "+area+".");
    return say(state,pick(["Okay.","Yeah.","I'm here."]));
  };
})();
