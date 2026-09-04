/* Short WhatsApp lines. Time slot does not steal other questions. */
(function () {
  var AREA = {andreia:"Kensington",tanita:"Central London",caroline:"Mayfair",faye:"Chelsea",joselyn:"Soho",ben:"Vauxhall",glenn:"East London",travis:"Vauxhall",luke:"Vauxhall",jeremy:"Mayfair",alexis:"Kensington",marianna:"Chelsea",nicole:"Soho",sophie:"Mayfair",duda:"Kensington"};
  var VOICE = {ben:"mate",travis:"mate",luke:"mate",glenn:"mate",jeremy:"",andreia:"love",tanita:"babe",caroline:"darling",faye:"babe",joselyn:"babe",alexis:"babe",marianna:"babe",nicole:"babe",sophie:"babe",duda:"amor"};
  var SEX = {nicole:"Super fun passionate GFE — kissing, affection, no rush.",tanita:"Proper passionate GFE. Kissing, unhurried.",andreia:"Affectionate GFE. Kissing and chemistry.",ben:"Full GFE. Kissing, physical, no clock-watching.",travis:"Relaxed GFE. Kissing, chemistry, no pressure.",luke:"Warm GFE. Chemistry first.",jeremy:"Refined GFE. Unhurried.",caroline:"Luxurious GFE. Kissing, no rush.",faye:"Passionate GFE.",joselyn:"Fiery GFE. Kissing and cuddles.",alexis:"Glam GFE.",marianna:"Playful GFE.",sophie:"Massage into GFE.",duda:"Passionate GFE.",glenn:"Girlfriend energy."};
  var SIZE = {marianna:"About 7.5 and thick.",nicole:"About 7 and thick.",alexis:"About 8.",sophie:"About 7.",duda:"About 7.5.",ben:"About 7.5.",travis:"About 8.",luke:"About 7.",glenn:"About 7.",jeremy:"I don't do locker-room numbers."};
  var LEX = {lazy:"taking it easy",laidback:"taking it easy","laid back":"taking it easy",chilled:"taking it easy",chilling:"taking it easy",relaxed:"taking it easy",knackered:"tired",shattered:"tired",wrecked:"tired",horny:"horny",naughty:"naughty",filthy:"naughty",dirty:"naughty",dtf:"horny","down to fuck":"horny",free:"are you free",available:"are you free",rates:"how much",price:"how much",cost:"how much",pics:"selfie",selfie:"selfie",photo:"selfie",bb:"bareback",bareback:"bareback",greek:"anal",anal:"anal"};
  function applyLex(t){ var out=" "+t+" "; var k; for (k in LEX){ out=out.replace(new RegExp("\\b"+k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b","g"), " "+LEX[k]+" "); } return out.replace(/\s+/g," ").trim(); }
  function norm(s){return String(s||"").toLowerCase().replace(/['\u2019]/g,"'").replace(/\s+/g," ").trim();}
  function titleName(s){return String(s||"").replace(/[^\p{L}\p{N}'-]+/gu,"").replace(/^\w/,function(c){return c.toUpperCase();});}
  var STOP=/^(hi|hey|hello|yo|yes|yeah|ok|okay|cool|im|i'm|me|you|who|what|when|how|free|tonight|today|book|hotel|love|baby|babe|hun|mate|bro|here|sorry|the|and|for|with|that|this|not|bad|horny|naughty|lazy)$/i;
  function extractGuestName(raw){
    var text=String(raw||"").trim();
    var m=text.match(/(?:i(?:['\u2019]?m| am)|this is|it'?s|call me)\s+([A-Za-z][A-Za-z'\-]{1,20})/i);
    if(m&&m[1]&&!STOP.test(m[1])) return titleName(m[1]);
    var words=text.replace(/[^A-Za-z'\- ]/g," ").trim().split(/\s+/);
    if(words.length===1 && words[0].length>=2 && !STOP.test(words[0])) return titleName(words[0]);
    return "";
  }
  function parseMinHours(p){ return /2 hour/i.test(String((p&&p.minDuration)||"2 hours"))?2:1; }
  function grabSlots(raw,state){
    var t=norm(raw);
    if(/tonight|today|this evening|later/.test(t)) state.day="tonight";
    var tm=t.match(/\b(\d{1,2})\s*(am|pm)\b/i)||t.match(/around\s+(\d{1,2})/i);
    if(tm){ state.time=tm[1]+((tm[2]&&/am|pm/i.test(String(tm[2])))?tm[2]:"pm"); if(!state.day) state.day="tonight"; }
    if(/1 hour|one hour/.test(t)) state.wantHours=1;
  }
  function tag(id){ return VOICE[id]||""; }
  function vbit(v){ return v ? " "+v : ""; }
  function fill(ans,p,state){
    var guest=state.guestName||""; var name=p.name||"";
    return ans.replace(/\bGlenn\b/g, guest||"Glenn").replace(/\bTanita\b/g,name).replace(/\bTravis\b/g,name).replace(/\bNicole\b/g,name).replace(/\bBen\b/g,name);
  }
  function retrieveExact(p, raw){
    var bank=window.TWIN_EXAMPLES||[];
    var want=norm(raw), i, row;
    for(i=0;i<bank.length;i++){
      row=bank[i];
      if(!row||!row.u||!row.a) continue;
      if(row.id!==p.id) continue;
      if(norm(row.u)===want) return row.a;
    }
    return "";
  }
  window.twinOpening=function(p){return "Hi im "+((p&&p.name)||"me")+" who am i talking with";};
  window.twinCaptureName=function(raw,state){ if(!state.guestName){var n=extractGuestName(raw);if(n) state.guestName=n;} return state.guestName||""; };
  window.twinReply=function(p,raw,state){
    var t=applyLex(norm(raw));
    state.turns=(state.turns||0)+1;
    window.twinCaptureName(raw,state);
    grabSlots(raw,state);
    var id=(p&&p.id)||"";
    var area=AREA[id]||"London";
    var mh=parseMinHours(p);
    var v=tag(id);
    var female=/female|transexual|trans/.test(String(p.wing||""));
    var n=state.guestName||"";
    if(/underage|teen/.test(t)) return "No. Adult bookings only.";
    if(/\bbro\b/.test(t) && female) return "Haha sorry \u2014 wouldn't call you bro.";
    if(/^(stop|enough|shut up)\b/.test(t)) return "Okay. What did you actually want to ask?";
    if(/not what i asked|what are you saying|i didn'?t ask|again what/.test(t)) return "You're right, I jumped ahead. Ask me again.";
    if(/are you there|you there|hello\?|sorry are you/.test(t)) return "Yeah I'm here. Go on.";
    if(!state.guestName && state.turns<=2) return "Hey \u2014 who am I talking to?";
    if(state.guestName && extractGuestName(raw) && state.turns<=3){
      if(v==="mate") return "Alright "+n+"! Good to meet you mate. How's your afternoon going?";
      if(v==="darling") return "Hello "+n+". Lovely to meet you. How's your afternoon unfolding?";
      return "Hey "+n+"! Lovely to meet you"+vbit(v)+". How's your afternoon going?";
    }
    if(/^(ok|okay|cool|nice|yeah|yes|sure|thanks|thank you|cheers)\.?$/.test(t)){
      if(state.time) return "Sorted. "+state.time+" at mine in "+area+". Text me when you're heading over.";
      return "Yeah? What did you want to know.";
    }
    var gold=retrieveExact(p, raw);
    if(gold){
      var g=fill(gold,p,state);
      if(female) g=g.replace(/\bbro\b/gi,v||"babe").replace(/\bmate\b/gi,v||"babe");
      if(g.length>220) g=g.split(/[.!]/)[0]+".";
      return g.replace(/\s+/g," ").trim();
    }
    if(/yours\?|how are you|not bad|it'?s ok|its ok/.test(t) && !/looking to see|was free|into|horny/.test(t))
      return "Pretty good thanks. Just at home in "+area+" getting ready for later. You busy or taking it easy?";
    if(/taking it easy|chilling|not much/.test(t) && !/free|into|horny/.test(t))
      return "Same. I'm in "+area+" later if you fancy it \u2014 what time were you thinking?";
    if(/looking to see if you|see if you (was|were|are) free|if you'?re free|was looking/.test(t))
      return "I might be. I'm at my place in "+area+" tonight \u2014 what sort of time were you thinking?";
    if(/what time (are you|you) free|what time (can|could) you/.test(t))
      return "From about 7pm"+vbit(v)+". What time were you hoping to come over?";
    if(/what you up to|wyd/.test(t) && !/into/.test(t)) return "Just in, music on. You?";
    if(/what (you|'?re you|are you) into|kind of vibe/.test(t)) return (SEX[id]||"GFE.")+" What are you in the mood for?";
    if(/\bhorny\b|naughty|turned on|need to (fuck|cum)|i'?m hard/.test(t))
      return state.time ? ("Haha I can help with that"+vbit(v)+". "+state.time+" still works.") : ("Haha I can help with that"+vbit(v)+". From 7pm tonight \u2014 what time works?");
    if(/how big|are you big|how many inches|size (are you|is it)/.test(t)) return SIZE[id] || "You'll see when you get here.";
    if(/boob|breast/.test(t)) return "Natural C, depending who you ask.";
    if(/sounds great|sounds good|that sounds|up my street/.test(t)) return "Good. When did you want to come by?";
    if(/\banal\b|\bgreek\b/.test(t)) return "Not something I offer. GFE only.";
    if(/selfie|prove (it'?s|its) you|scam/.test(t)) return "I get it. The photos on the profile are me. I don't ping extra selfies over text.";
    if(/how much|price|rate/.test(t)) return mh>=2 ? "\u00a3700 for 2 hours at mine. \u00a3100 holds the slot." : "Tell me the night and length and I'll text the figure.";
    if(/cash|deposit/.test(t) && !/paid/.test(t)) return "Cash when you get here. \u00a3100 deposit to hold the time.";
    if(/available|free tonight|free later|you free|are you free|free\?/.test(t))
      return "Might be. I'm in "+area+" tonight \u2014 what time were you thinking?";
    if((state.wantHours && state.wantHours<mh) || (/1 hour/.test(t) && mh>1))
      return (state.time?state.time+" can work. ":"")+"I do a 2-hour minimum though. Means we don't watch the clock.";
    if(/book me|i('|)d like to book|hit book/.test(t)) return "Hit Book me now on the profile. It'll keep "+(state.time||"the time")+".";
    if(/bareback|no condom|\bbb\b/.test(t)) return "No. Protection stays on.";
    if(/parking|park/.test(t)) return "Pay-and-display near the building, or street after 6:30.";
    if(/wine|bottle/.test(t)) return "Yes please. Malbec or prosecco and I'm happy.";
    if(/wear|wearing/.test(t)) return female ? "Something easy. You'll see when you get here." : "Low key. Don't overthink it.";
    if(/outcall|incall|your place|my place|hotel/.test(t)) return "Incall at mine in "+area+" is easiest tonight. Hotels work if they're central.";
    if(/^\d{1,2}\s*(am|pm)?$/.test(t) || /^around \d/.test(t))
      return (state.time||t)+" at mine in "+area+" works. Want me to hold it?";
    if(state.time && /^(right|got it|makes sense|fair|deal)\b/.test(t)) return "Nice. See you at "+state.time+" then.";
    return "What did you want to know \u2014 time, vibe, or just whether I'm free later?";
  };
})();
