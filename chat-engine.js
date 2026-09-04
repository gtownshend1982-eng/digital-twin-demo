/* Nicole-style flow for every persona */
(function () {
  var AREA = {andreia:"Kensington",tanita:"Central London",caroline:"Mayfair",faye:"Chelsea",joselyn:"Soho",ben:"Vauxhall",glenn:"East London",travis:"Vauxhall",luke:"Vauxhall",jeremy:"Mayfair",alexis:"Kensington",marianna:"Chelsea",nicole:"Soho",sophie:"Mayfair",duda:"Kensington"};
  var VOICE = {ben:"mate",travis:"mate",luke:"mate",glenn:"mate",jeremy:"",andreia:"love",tanita:"babe",caroline:"darling",faye:"babe",joselyn:"babe",alexis:"babe",marianna:"babe",nicole:"babe",sophie:"babe",duda:"amor"};
  var SEX = {nicole:"I'm all about a super fun, passionate GFE vibe. Lots of sweet kissing, affection, and genuine intimacy.",tanita:"I'm all about a proper, passionate GFE. Lots of kissing, total intimacy.",andreia:"I'm all about a passionate, affectionate GFE. Lots of kissing and chemistry.",ben:"I keep it focused on a full GFE vibe. Lots of kissing, physical chemistry.",travis:"I keep it focused on a full GFE vibe. Lots of kissing, physical chemistry.",luke:"High-end GFE. Warm chemistry, passionate kissing.",jeremy:"A sophisticated, affectionate GFE. Unhurried and refined.",caroline:"A luxurious genuine Girlfriend Experience. Passionate kissing, unhurried.",faye:"A super passionate, affectionate GFE. Kissing and chemistry.",joselyn:"A fiery, passionate GFE. Sweet kissing and cuddling.",alexis:"A glamorous GFE. Sweet kissing and affection.",marianna:"A playful passionate GFE.",sophie:"Massage into a warm GFE.",duda:"A passionate GFE. Kissing and chemistry.",glenn:"Girlfriend energy. Unhurried."};
  var ANAL = {caroline:"No. I don't offer that.",travis:"I don't offer anal. GFE only.",ben:"I don't offer anal. GFE only.",nicole:"I don't offer anal. Passionate GFE only."};
  function norm(s){return String(s||"").toLowerCase().replace(/['\u2019]/g,"'").replace(/\s+/g," ").trim();}
  function titleName(s){return String(s||"").replace(/[^\p{L}\p{N}'-]+/gu,"").replace(/^\w/,function(c){return c.toUpperCase();});}
  var STOP=/^(hi|hey|hello|yo|yes|yeah|ok|okay|cool|im|i'm|me|you|who|what|when|how|free|tonight|today|book|hotel|love|baby|babe|hun|mate|bro|here|sorry|the|and|for|with|that|this|not|bad)$/i;
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
    if(/tonight|today|this evening/.test(t)) state.day="tonight";
    var tm=t.match(/\b(\d{1,2})\s*(am|pm)\b/i)||t.match(/around\s+(\d{1,2})/i);
    if(tm){ state.time=tm[1]+((tm[2]&&/am|pm/i.test(String(tm[2])))?tm[2]:"pm"); if(!state.day) state.day="tonight"; }
    if(/1 hour|one hour/.test(t)) state.wantHours=1;
  }
  function tag(id){ return VOICE[id]||""; }
  function say(state,text){
    var n=state.guestName, out=String(text||"").trim();
    if(n&&!state._named){ out=out.replace(/[.!?]\s*$/,"")+", "+n+"."; state._named=true; }
    return out.replace(/\s+/g," ").trim();
  }
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
    var t=norm(raw);
    state.turns=(state.turns||0)+1;
    window.twinCaptureName(raw,state);
    grabSlots(raw,state);
    var id=(p&&p.id)||"";
    var area=AREA[id]||"London";
    var mh=parseMinHours(p);
    var v=tag(id);
    var female = /female|transexual|trans/.test(String(p.wing||""));
    var reply="";
    if(/underage|teen/.test(t)) return "No. Adult bookings only.";
    if(/\bbro\b/.test(t) && female) return say(state, "Sorry \u2014 that was a slip. I wouldn't call you bro.");
    if(/^(stop|enough|shut up)\b/.test(t)) return say(state, "Okay. Ask me one thing and I'll answer that.");
    if(/not what i asked|what are you saying|i didn'?t ask|again what/.test(t)) return say(state, "You're right, I jumped. What did you actually want to know?");
    if(/are you there|you there|hello\?|sorry are you/.test(t)) return say(state, "Yes I'm here. What did you want to ask?");
    if(!state.guestName && state.turns<=2) return "Hey. Who am I talking to?";
    if(state.guestName && extractGuestName(raw) && state.turns<=3){
      var n=state.guestName;
      if(v==="mate") return "Alright "+n+"! Good to meet you mate. How's your afternoon going?";
      if(v==="darling") return "Hello "+n+". Splendid to meet you. How is your afternoon unfolding?";
      return "Hey "+n+"! Lovely to meet you"+(v?(" "+v):"")+". How's your afternoon going?";
    }
    var gold = retrieveExact(p, raw);
    if(gold){
      reply = fill(gold, p, state);
      if(female) reply = reply.replace(/\bbro\b/gi, v||"babe").replace(/\bmate\b/gi, v||"babe");
      return say(state, reply);
    }
    if(/yours\?|how are you|not bad/.test(t) && !/looking to see|was free|into|horny/.test(t))
      return say(state, "Pretty good thanks. Just relaxing at home in "+area+" and getting ready for the evening. What are you up to today? Busy one or taking it easy?");
    if(/looking to see if you|see if you (was|were|are) free|if you'?re free|was looking/.test(t))
      return say(state, "I might be. I'm based at my flat in "+area+" this evening. What sort of time were you thinking of popping over?");
    if(/what time (are you|you) free|what time (can|could) you/.test(t))
      return say(state, "I've got availability from 7pm onwards tonight"+(v?(" "+v):"")+". What sort of time were you hoping to pop over?");
    if(/what you up to|wyd/.test(t) && !/into/.test(t)) return say(state, "Just in, music on. You busy or taking it easy?");
    if(/what (you|'?re you|are you) into|kind of vibe/.test(t)) return say(state, (SEX[id]||"GFE.")+" What kind of vibe are you looking for tonight?");
    if(/\bhorny\b|turned on|need to (fuck|cum)|i'?m hard/.test(t))
      return say(state, "Haha I can help you take care of that"+(v?(" "+v):"")+". I've got availability from 7pm onwards tonight \u2014 what time works best for you?");
    if(/sounds great|sounds good|that sounds/.test(t)) return say(state, "Good. What sort of time were you thinking of popping over?");
    if(/\banal\b|\bgreek\b/.test(t)) return say(state, ANAL[id]||"I don't offer anal. Sessions stay GFE.");
    if(/selfie|prove (it'?s|its) you|scam/.test(t)) return say(state, "Photos on the profile are me. I don't send extra selfies over text.");
    if(/how much|price|rate/.test(t)) return say(state, mh>=2 ? "It's \u00a3700 for 2 hours at mine. \u00a3100 deposit holds the slot." : "I'll text the figure once we have night and length.");
    if(/cash|deposit/.test(t) && !/paid/.test(t)) return say(state, "Cash on arrival. \u00a3100 deposit holds the time. Rest when you get here.");
    if(/available|free tonight|free\?/.test(t)) return say(state, "I might be. I'm based at my flat in "+area+" this evening. What sort of time were you thinking of popping over?");
    if((state.wantHours && state.wantHours<mh) || (/1 hour/.test(t) && mh>1)) return say(state, (state.time?state.time+" can work. ":"")+"I have a 2-hour minimum. 8 to 10 if that suits.");
    if(/book me|i('|)d like to book|hit book/.test(t)) return say(state, "Use Book me now on the profile. It keeps "+(state.time||"the time")+".");
    if(/bareback|no condom|\bbb\b/.test(t)) return say(state, "No. Protection stays on.");
    if(state.time) return say(state, "Got "+state.time+" "+(state.day||"tonight")+" in "+area+". Book me now when you're ready, or ask me something else.");
    return say(state, "I might be free this evening in "+area+". What sort of time were you thinking, or what did you want to know first?");
  };
})();
