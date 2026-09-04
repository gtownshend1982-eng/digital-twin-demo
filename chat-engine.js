/* Tanita-style long booking chat; mins from questionnaire */
(function () {
  var WING = {andreia:"female",tanita:"female",caroline:"female",faye:"female",joselyn:"female",ben:"male",glenn:"male",travis:"male",luke:"male",jeremy:"male",alexis:"trans",marianna:"trans",nicole:"trans",sophie:"trans",duda:"trans"};
  var AREA = {andreia:"my place in Kensington",tanita:"my place in Central London",caroline:"Zone 3 incall",faye:"a private incall, Zone 2",joselyn:"Zone 2 North",ben:"South London",glenn:"East / Essex fringe",travis:"Vauxhall",luke:"North / Camden",jeremy:"Kensington / Chelsea",alexis:"East / Canary",marianna:"Zone 2 West",nicole:"Zone 2/3 West",sophie:"Zone 1/2 West",duda:"Chelsea / Marylebone"};
  var PRICE = {tanita:{h:2,fee:"\u00a3700",dep:"\u00a3100"},duda:{h:2,fee:"\u00a3700",dep:"\u00a3100"},jeremy:{h:2,fee:"\u00a3700",dep:"\u00a3100"},andreia:{h:1,fee:"I'll text the figure",dep:"a deposit"}};
  var BUZZ = {tanita:"buzz flat 4B",andreia:"buzz when you get to the door",duda:"I'll text the entry note after the deposit"};
  var ANAL = {travis:"Yes — on my list. Receptive preferred. We talk first.",caroline:"No. Greek is a hard no unless we later agree it.",faye:"Strap-on can be earned. Not a casual add-on.",joselyn:"A plug only if we agree it.",andreia:"Not something I list. GFE, kissing, taking our time.",tanita:"Not on my list. Hotel GFE is the booking.",ben:"Not something I list.",glenn:"Not something I list.",luke:"Not a default.",jeremy:"No. Dinner and hotel GFE.",alexis:"Not a menu item.",marianna:"Not a default extra.",nicole:"No. Sweet GFE.",sophie:"No. Massage into sex.",duda:"No. Dinner, hotel, kissing."};
  var SEX = {ben:"GFE, kissing, unhurried.",glenn:"Girlfriend energy with women.",travis:"Kissing, oral.",luke:"GFE or more physical.",jeremy:"Dinner, hotel, slow.",andreia:"Soft GFE — kissing, cuddling.",tanita:"A proper passionate GFE. Lots of kissing, unhurried.",caroline:"Straightforward session. No Greek.",faye:"Dominance, protocol.",joselyn:"Soft D/s, aftercare.",alexis:"GFE, kissing, I can lead.",marianna:"Playful GFE.",nicole:"Sweet GFE.",sophie:"Massage into sex.",duda:"Dinner, hotel, kissing."};
  var SIZE = {ben:{inches:"7.5",cat:"large"},glenn:{inches:"6.5",cat:"medium"},travis:{inches:"6",cat:"medium"},luke:{inches:"7",cat:"large"},jeremy:{inches:"6.8",cat:"medium"},alexis:{inches:"7.5",cat:"large"},marianna:{inches:"6.5",cat:"medium"},nicole:{inches:"5",cat:"medium"},sophie:{inches:"6.2",cat:"medium"},duda:{inches:"7",cat:"large"}};
  var BUST = {andreia:"Big natural chest. Soft curves.",tanita:"Natural, proportional on a tall frame.",caroline:"Natural, girl-next-door.",faye:"Natural. Not the point of the booking.",joselyn:"Natural, petite frame.",alexis:"Enhanced. Hourglass.",marianna:"Enhanced. Brazilian hourglass.",nicole:"Enhanced. Petite frame.",sophie:"Enhanced. Willowy, not huge.",duda:"Enhanced. Model frame."};
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
  function minLabel(h){ return h>=2?"2-hour minimum":(h<1?"45-minute incall minimum":"1-hour minimum"); }
  function grabSlots(raw,state){
    var t=norm(raw);
    if(/tonight|today|this evening/.test(t)) state.day="tonight";
    if(/tomorrow/.test(t)) state.day="tomorrow";
    var d=t.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/);
    if(d) state.day=d[1];
    var tm=t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i)||t.match(/\b(\d{1,2})(am|pm)\b/i)||t.match(/around\s+(\d{1,2})\s*(pm)?/i);
    if(tm){ state.time=(tm[1]+(tm[tm.length-1]&&/am|pm/i.test(tm[tm.length-1])?tm[tm.length-1]:"pm")).replace(/\s+/g,""); if(!state.day) state.day="tonight"; }
    if(/incall|at yours|your flat|your place/.test(t)) state.where="incall";
    if(/outcall|hotel/.test(t)) state.where="hotel";
    if(/1 hour|one hour|an hour/.test(t)) state.wantHours=1;
    if(/2 hour/.test(t)) state.wantHours=2;
    if(/paid|deposit now|just paid/.test(t)) state.paid=true;
    if(/hit book|filled it out|book me/.test(t)) state.booked=true;
  }
  function fee(id,mh){ return PRICE[id]||{h:mh,fee:"I'll text the figure",dep:"a deposit"}; }
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
    var wing=WING[id]||"";
    var area=AREA[id]||"London";
    var mh=parseMinHours(p);
    var label=minLabel(mh);
    var pr=fee(id,mh);
    var n=state.guestName||"";

    if(/underage|teen|schoolgirl/.test(t)) return "No. Adult bookings only.";
    if(!state.guestName && state.turns<=2) return "Hey. Thanks for reaching out. Who am I talking to?";
    if(state.guestName && state.turns<=3 && extractGuestName(raw) && !/available|free|book|hour|pm|into/.test(t))
      return say(state,"Hey. Lovely to meet you. How's your afternoon going?");

    if(/what (you|'?re you|are you) into|kind of vibe|when we meet/.test(t))
      return say(state,(SEX[id]||"GFE.")+" Super warm. Drink, music, no rushing. What vibe do you want tonight?");
    if(/how are you|afternoon going|not bad/.test(t) && !/available|free|book/.test(t))
      return say(state,"Yeah not bad. Quiet one. You?");
    if(/what you up to|wyd|what you doing/.test(t))
      return say(state,"Just in. Phones and a bit of music. You?");
    if(/\banal\b|\bgreek\b/.test(t)) return say(state, ANAL[id]||"Not something I list.");
    if(/selfie|prove (it'?s|its) you/.test(t))
      return say(state,"I get why you're cautious, but the photos on the profile are me. I don't send extra selfies. Better in person.");
    if(/how much|price|rate|cost|\u00a3/.test(t))
      return say(state, pr.fee.indexOf("I'll")===0 ? ("Send the night and length and I'll text the figure. "+label+".") : ("It's "+pr.fee+" for the "+pr.h+" hours at mine. Unhurried. You'll be looked after."));
    if(/cash|deposit/.test(t) && !/paid/.test(t))
      return say(state,"Cash on arrival is fine. "+pr.dep+" holds "+(state.time||"the")+" slot. Rest when you get here.");
    if(/just paid|paid the/.test(t))
      return say(state,"Got the notification. You're confirmed for "+(state.time||"the time")+" "+(state.day||"tonight")+". Address is in the confirmation text.");
    if(/address come|did the address|got it|20 mins/.test(t))
      return say(state,"Good. Easy to find. I'll get things ready.");
    if(/hit book|filled it out|book me|just filled/.test(t))
      return say(state,"Got it on my end. Deposit link should ping your phone. Once that's paid we're locked in.");
    if(/what happens after|how do we sort|book the booking/.test(t))
      return say(state,"Hit Book me now. It can fill "+(state.time||"8pm")+" "+(state.day||"tonight")+". Then deposit link, then address.");
    if(/copy of (our )?chat/.test(t))
      return say(state,"Yes. I get the chat so I know what we agreed and who I'm opening the door to.");
    if(/running late|traffic|few minutes late/.test(t))
      return say(state,"Text me here. Heads-up and it's fine.");
    if(/what should i wear|jeans|shirt|casual or smart/.test(t))
      return say(state,"Smart casual. Whatever you feel good in. I'll be in something easy.");
    if(/buzzer|code|front door|flat/.test(t))
      return say(state,"When you get to the entrance, "+(BUZZ[id]||"buzz and I'll let you up")+".");
    if(/text you when i park|when i'?m outside|leaving your place/.test(t))
      return say(state,"Yes. Quick heads-up when you're outside.");
    if(/quiet building|discreet|hallway/.test(t))
      return say(state,"Quiet building. Private. No nosey neighbours.");
    if(/parking/.test(t))
      return say(state,"Pay-and-display around the corner, or street parking after 6:30.");
    if(/wine|malbec|bottle|prosecco/.test(t))
      return say(state,"Yes please. Red or prosecco. Malbec or cab sav is perfect.");
    if(/music|lighting|candles|silence/.test(t))
      return say(state,"Soft music, warm dim light. Not a silent room.");
    if(/how long have you been in|flat/.test(t) && /year|live|decorat/.test(t))
      return say(state,"A while now. It's set up to be easy and private.");
    if(/friday|busy on/.test(t))
      return say(state,"Evenings go quick. Glad we grabbed "+(state.time||"this")+" window.");
    if(/hectic|unwind|long week/.test(t))
      return say(state,"Leave work at the door. That's the point of the time.");
    if(/what (are )?you wearing|silk|robe|tease/.test(t))
      return say(state,"Something easy. You'll see.");
    if(/see you|very soon|safe drive/.test(t))
      return say(state,"See you at "+(state.time||"the time")+". Text when you leave.");
    if(/outcall|incall|just incall/.test(t))
      return say(state,"Mostly incall at "+area+". Outcall to a proper hotel if we plan it. Incall is easiest tonight.");
    if(/available|free/.test(t))
      return say(state,"I might be. I'm based at "+area+" this evening. What time were you thinking?");
    if((state.wantHours!=null && state.wantHours<mh) || (/1 hour/.test(t) && mh>1))
      return say(state,(state.time?state.time+" works nicely. ":"")+"I have a "+label+". Drink, no clock-watching.");
    if(/i('|)d like to book|book me now/.test(t))
      return say(state,"Use Book me now. It keeps "+(state.time||"the time")+" "+(state.day||"tonight")+".");
    if(/\bbb\b|bareback|no condom/.test(t)) return say(state,"No. Protection stays on.");
    if(/are you big|cock size|how many inches/.test(t)){
      if(wing==="female") return say(state,"That's a male or trans question.");
      var s=SIZE[id]; return say(state,s? (s.cat==="large"?"Yeah, on the bigger side.":"I do alright."):"You'll see.");
    }
    if(/boobs?|tits|breast/.test(t)) return say(state, wing==="male"?"That's a female or trans question.":(BUST[id]||"Natural."));
    if(state.time) return say(state,"Got you — "+state.time+" "+(state.day||"tonight")+" at "+area+". "+label+". Hit Book me now when you're ready.");
    if(/^(yeah|yes|ok|okay|cool|perfect|brilliant|ideal|good stuff|sounds good)\b/.test(t))
      return say(state,"What time were you thinking? I'm at "+area+" this evening.");
    return say(state,"I'm around. What time works, or do you want to talk first?");
  };
})();
