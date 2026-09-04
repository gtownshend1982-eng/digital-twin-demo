/* Learn from gold examples + localStorage; rules as fallback */
(function () {
  var AREA = {andreia:"my place in Kensington",tanita:"my place in Central London",caroline:"Zone 3 incall",faye:"Zone 2 incall",joselyn:"Zone 2 North",ben:"South London",glenn:"East / Essex fringe",travis:"my flat in Vauxhall",luke:"North / Camden",jeremy:"Kensington / Chelsea",alexis:"East / Canary",marianna:"Zone 2 West",nicole:"Zone 2/3 West",sophie:"Zone 1/2 West",duda:"Chelsea / Marylebone"};
  var PRICE = {tanita:{h:2,fee:"\u00a3700",dep:"\u00a3100"},travis:{h:2,fee:"\u00a3700",dep:"\u00a3100"},duda:{h:2,fee:"\u00a3700",dep:"\u00a3100"},jeremy:{h:2,fee:"\u00a3700",dep:"\u00a3100"}};
  var SEX = {travis:"Relaxed GFE. Kissing, chemistry, no pressure.",tanita:"Passionate GFE. Kissing, unhurried.",andreia:"Soft GFE — kissing, cuddling.",ben:"GFE, unhurried.",glenn:"Girlfriend energy.",luke:"GFE or more physical.",jeremy:"Dinner, hotel, slow.",caroline:"Straightforward session.",faye:"Dominance, protocol.",joselyn:"Soft D/s, aftercare.",alexis:"GFE, I can lead.",marianna:"Playful GFE.",nicole:"Sweet GFE.",sophie:"Massage into sex.",duda:"Dinner, hotel, kissing."};
  var ANAL = {travis:"Yes — on my list. Receptive preferred. We talk first.",caroline:"No. Greek is a hard no unless we later agree it.",faye:"Strap-on can be earned.",joselyn:"Plug only if we agree.",andreia:"Not something I list.",tanita:"Not on my list."};
  var STOP=/^(hi|hey|hello|yo|yes|yeah|ok|okay|cool|im|i'm|me|you|who|what|when|how|free|tonight|today|book|hotel|love|baby|babe|hun|mate|here|sorry|the|and|for|with|that|this)$/i;
  function norm(s){return String(s||"").toLowerCase().replace(/['\u2019]/g,"'").trim();}
  function titleName(s){return String(s||"").replace(/[^\p{L}\p{N}'-]+/gu,"").replace(/^\w/,function(c){return c.toUpperCase();});}
  function tokens(s){ return norm(s).replace(/[^a-z0-9\u00a3'\s]/g," ").split(/\s+/).filter(function(w){return w.length>2 && !STOP.test(w);}); }
  function extractGuestName(raw){
    var text=String(raw||"").trim();
    var m=text.match(/(?:i(?:['\u2019]?m| am)|this is|it'?s|call me)\s+([A-Za-z][A-Za-z'\-]{1,20})/i);
    if(m&&m[1]&&!STOP.test(m[1])) return titleName(m[1]);
    var words=text.replace(/[^A-Za-z'\- ]/g," ").trim().split(/\s+/);
    if(words.length===1 && words[0].length>=2 && !STOP.test(words[0])) return titleName(words[0]);
    return "";
  }
  function parseMinHours(p){ return /2 hour/i.test(String((p&&p.minDuration)||""))?2:1; }
  function minLabel(h){return h>=2?"2-hour minimum":"1-hour minimum";}
  function grabSlots(raw,state){
    var t=norm(raw);
    if(/tonight|today|this evening/.test(t)) state.day="tonight";
    if(/tomorrow/.test(t)) state.day="tomorrow";
    var tm=t.match(/\b(\d{1,2})\s*(am|pm)\b/i)||t.match(/\b(\d{1,2})(am|pm)\b/i)||t.match(/around\s+(\d{1,2})/i);
    if(tm){ state.time=tm[1]+((tm[2]&&/am|pm/i.test(tm[2]))?tm[2]:"pm"); if(!state.day) state.day="tonight"; }
    if(/1 hour|one hour|an hour|see how it goes/.test(t)) state.wantHours=1;
    if(/new to this|first time|nervous|hesitant|anxious|paranoid|awkward|sorry/.test(t)) state.nervous=true;
  }
  function say(state,text){
    var n=state.guestName;
    var out=String(text||"").trim();
    if(n&&!state._named){out=out.replace(/[.!?]\s*$/,"")+", "+n+".";state._named=true;}
    return out.replace(/\s+/g," ").trim();
  }
  function loadLearned(){ try { return JSON.parse(localStorage.getItem("twinLearn")||"[]"); } catch(e){ return []; } }
  function saveLearn(id,u,a){
    try {
      var all=loadLearned();
      all.push({id:id,u:u,a:a,t:Date.now()});
      if(all.length>400) all=all.slice(-400);
      localStorage.setItem("twinLearn", JSON.stringify(all));
    } catch(e){}
  }
  function score(user, exampleU){
    var a=tokens(user), b=tokens(exampleU);
    if(!a.length||!b.length) return 0;
    var set={}, i, hit=0;
    for(i=0;i<b.length;i++) set[b[i]]=1;
    for(i=0;i<a.length;i++) if(set[a[i]]) hit++;
    return hit / Math.sqrt(a.length*b.length);
  }
  function fill(ans, p, state){
    var guest=state.guestName||"";
    var name=p.name||"";
    return ans.replace(/\bGlenn\b/g, guest||"Glenn").replace(/\bTanita\b/g, name).replace(/\bTravis\b/g, name);
  }
  function retrieve(p, raw, state){
    var bank=(window.TWIN_EXAMPLES||[]).concat(loadLearned());
    var best=null, bestS=0, i, row, s;
    for(i=0;i<bank.length;i++){
      row=bank[i];
      if(!row||!row.u||!row.a) continue;
      s=score(raw, row.u);
      if(row.id===p.id) s+=0.12;
      if(row.id==="*") s+=0.02;
      if(s>bestS){ bestS=s; best=row; }
    }
    if(best && bestS>=0.28) return fill(best.a, p, state);
    return "";
  }
  window.twinOpening=function(p){return "Hi im "+((p&&p.name)||"me")+" who am i talking with";};
  window.twinCaptureName=function(raw,state){ if(!state.guestName){var n=extractGuestName(raw);if(n) state.guestName=n;} return state.guestName||""; };
  window.twinResetLearn=function(){ try{ localStorage.removeItem("twinLearn"); }catch(e){} };
  window.twinReply=function(p,raw,state){
    var t=norm(raw);
    state.turns=(state.turns||0)+1;
    window.twinCaptureName(raw,state);
    grabSlots(raw,state);
    var id=(p&&p.id)||"";
    var area=AREA[id]||"London";
    var mh=parseMinHours(p);
    var label=minLabel(mh);
    var pr=PRICE[id]||{h:mh,fee:"I'll text the figure",dep:"a deposit"};
    var reply="";
    if(/underage|teen/.test(t)) return "No. Adult bookings only.";
    if(!state.guestName && state.turns<=2) return "Hey. Thanks for reaching out. Who am I talking to?";
    if(state.guestName && extractGuestName(raw) && state.turns<=4){
      reply = state.nervous
        ? say(state, "No need to apologise. First time is allowed to feel odd. How's your afternoon going?")
        : say(state, id==="travis" ? "Alright. Good to meet you. How's your afternoon going?" : "Hey. Lovely to meet you. How's your afternoon going?");
      saveLearn(id, raw, reply);
      return reply;
    }
    var learned = retrieve(p, raw, state);
    if(learned){ reply=say(state, learned); saveLearn(id, raw, reply); return reply; }
    if(/new to this|first time|nervous|hesitant|anxious|awkward/.test(t))
      reply = say(state, "Take a breath. No pressure. We'll sit, drink, chat until you're comfortable.");
    else if(/what (you|'?re you|are you) into|kind of vibe/.test(t))
      reply = say(state, (SEX[id]||"GFE.")+" What vibe do you want tonight?");
    else if(/\banal\b|\bgreek\b/.test(t))
      reply = say(state, ANAL[id]||"Not something I list.");
    else if(/selfie|prove (it'?s|its) you|scam/.test(t))
      reply = say(state, "Photos on the profile are me. I don't send extra selfies.");
    else if(/how much|price|rate/.test(t))
      reply = say(state, pr.fee.indexOf("I'll")===0 ? ("I'll text the figure. "+label+".") : ("It's "+pr.fee+" for the "+pr.h+" hours at mine."));
    else if(/cash|deposit/.test(t) && !/paid/.test(t))
      reply = say(state, "Cash on arrival. "+pr.dep+" holds the slot. Rest when you get here.");
    else if(/available|free/.test(t))
      reply = say(state, "Might be. I'm based at "+area+" this evening. What time were you thinking?");
    else if((state.wantHours!=null && state.wantHours<mh) || (/1 hour|see how it goes/.test(t) && mh>1))
      reply = say(state, (state.time?state.time+" works. ":"")+"I have a "+label+". Two hours is easier if it's a first visit.");
    else if(/i('|)d like to book|book me now/.test(t))
      reply = say(state, "Use Book me now. It keeps "+(state.time||"the time")+".");
    else if(/bareback|no condom|\bbb\b/.test(t))
      reply = say(state, "No. Protection stays on.");
    else if(state.time)
      reply = say(state, "Got you — "+state.time+" "+(state.day||"tonight")+" at "+area+". "+label+". Book me now when you're ready.");
    else
      reply = say(state, "I'm around. What time works, or do you want to talk first?");
    saveLearn(id, raw, reply);
    return reply;
  };
})();
