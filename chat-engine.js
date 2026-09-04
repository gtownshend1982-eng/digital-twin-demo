/* First-time / nervous guest + Travis mate voice */
(function () {
  var WING = {andreia:"female",tanita:"female",caroline:"female",faye:"female",joselyn:"female",ben:"male",glenn:"male",travis:"male",luke:"male",jeremy:"male",alexis:"trans",marianna:"trans",nicole:"trans",sophie:"trans",duda:"trans"};
  var AREA = {andreia:"my place in Kensington",tanita:"my place in Central London",caroline:"Zone 3 incall",faye:"Zone 2 incall",joselyn:"Zone 2 North",ben:"South London",glenn:"East / Essex fringe",travis:"my flat in Vauxhall",luke:"North / Camden",jeremy:"Kensington / Chelsea",alexis:"East / Canary",marianna:"Zone 2 West",nicole:"Zone 2/3 West",sophie:"Zone 1/2 West",duda:"Chelsea / Marylebone"};
  var PRICE = {tanita:{h:2,fee:"\u00a3700",dep:"\u00a3100"},travis:{h:2,fee:"\u00a3700",dep:"\u00a3100"},duda:{h:2,fee:"\u00a3700",dep:"\u00a3100"},jeremy:{h:2,fee:"\u00a3700",dep:"\u00a3100"}};
  var BUZZ = {travis:"press the buzzer for flat 3A",tanita:"buzz flat 4B"};
  var WINE = {travis:"Malbec or Shiraz",tanita:"Malbec or cab sav"};
  var WEAR = {travis:"Lounge shorts and a casual t-shirt. Easy.",tanita:"Something easy."};
  var SEX = {travis:"Relaxed GFE. Kissing, chemistry, no pressure.",tanita:"Passionate GFE. Kissing, unhurried.",andreia:"Soft GFE — kissing, cuddling.",ben:"GFE, unhurried.",glenn:"Girlfriend energy.",luke:"GFE or more physical.",jeremy:"Dinner, hotel, slow.",caroline:"Straightforward session.",faye:"Dominance, protocol.",joselyn:"Soft D/s, aftercare.",alexis:"GFE, I can lead.",marianna:"Playful GFE.",nicole:"Sweet GFE.",sophie:"Massage into sex.",duda:"Dinner, hotel, kissing."};
  var ANAL = {travis:"Yes — on my list. Receptive preferred. We talk first.",caroline:"No. Greek is a hard no unless we later agree it.",faye:"Strap-on can be earned.",joselyn:"Plug only if we agree.",andreia:"Not something I list.",tanita:"Not on my list."};
  var SIZE = {ben:{cat:"large"},glenn:{cat:"medium"},travis:{cat:"medium"},luke:{cat:"large"},jeremy:{cat:"medium"},alexis:{cat:"large"},marianna:{cat:"medium"},nicole:{cat:"medium"},sophie:{cat:"medium"},duda:{cat:"large"}};
  var BUST = {andreia:"Big natural chest.",tanita:"Natural, tall frame.",caroline:"Natural.",faye:"Natural.",joselyn:"Petite, natural.",alexis:"Enhanced.",marianna:"Enhanced hourglass.",nicole:"Enhanced, petite.",sophie:"Enhanced, not huge.",duda:"Enhanced."};
  function norm(s){return String(s||"").toLowerCase().replace(/[’']/g,"'").trim();}
  var STOP=/^(hi|hey|hello|yo|yes|yeah|ok|okay|cool|im|i'm|me|you|who|what|when|how|free|tonight|today|book|hotel|love|baby|babe|hun|mate|here|sorry)$/i;
  function titleName(s){return String(s||"").replace(/[^\p{L}\p{N}'-]+/gu,"").replace(/^\w/,function(c){return c.toUpperCase();});}
  function extractGuestName(raw){
    var text=String(raw||"").trim();
    var m=text.match(/(?:i(?:['’]?m| am)|this is|it'?s|call me)\s+([A-Za-z][A-Za-z'\-]{1,20})/i);
    if(m&&m[1]&&!STOP.test(m[1])) return titleName(m[1]);
    var words=text.replace(/[^A-Za-z'\- ]/g," ").trim().split(/\s+/);
    if(words.length===1 && words[0].length>=2 && !STOP.test(words[0])) return titleName(words[0]);
    return "";
  }
  function parseMinHours(p){ var s=String((p&&p.minDuration)||"1 hour").toLowerCase(); return /2 hour/.test(s)?2:1; }
  function minLabel(h){return h>=2?"2-hour minimum":"1-hour minimum";}
  function grabSlots(raw,state){
    var t=norm(raw);
    if(/tonight|today|this evening/.test(t)) state.day="tonight";
    if(/tomorrow/.test(t)) state.day="tomorrow";
    var tm=t.match(/\b(\d{1,2})\s*(am|pm)\b/i)||t.match(/\b(\d{1,2})(am|pm)\b/i)||t.match(/around\s+(\d{1,2})/i);
    if(tm){ state.time=tm[1]+((tm[2]&&/am|pm/i.test(tm[2]))?tm[2]:"pm"); if(!state.day) state.day="tonight"; }
    if(/incall|at yours|your flat/.test(t)) state.where="incall";
    if(/outcall|hotel/.test(t)) state.where="hotel";
    if(/1 hour|one hour|an hour|see how it goes/.test(t)) state.wantHours=1;
    if(/2 hour/.test(t)) state.wantHours=2;
    if(/new to this|first time|nervous|hesitant|anxious|paranoid|awkward|sorry/.test(t)) state.nervous=true;
  }
  function say(state,text){
    var n=state.guestName;
    var out=String(text||"").trim();
    if(n&&!state._named){out=out.replace(/[.!?]\s*$/,"")+", "+n+".";state._named=true;}
    return out.replace(/\s+/g," ").trim();
  }
  window.twinOpening=function(p){return "Hi im "+((p&&p.name)||"me")+" who am i talking with";};
  window.twinCaptureName=function(raw,state){ if(!state.guestName){var n=extractGuestName(raw);if(n) state.guestName=n;} return state.guestName||""; };
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
    var pr=PRICE[id]||{h:mh,fee:"I'll text the figure",dep:"a deposit"};
    var travis=id==="travis";

    if(/underage|teen/.test(t)) return "No. Adult bookings only.";
    if(!state.guestName && state.turns<=2) return "Hey. Thanks for reaching out. Who am I talking to?";

    if(state.guestName && extractGuestName(raw) && state.turns<=4){
      if(state.nervous) return say(state, travis?"No need to apologise. Dead normal to feel nervous if it's your first time. How's your afternoon going?":"No need to apologise. First time is allowed to feel odd. How's your afternoon going?");
      return say(state, travis?"Alright. Good to meet you. How's your afternoon going?":"Hey. Lovely to meet you. How's your afternoon going?");
    }

    if(/new to this|first time|nervous|hesitant|anxious|paranoid|awkward|less nervous/.test(t))
      return say(state, travis?"Take a breath. No pressure. We'll sit, drink, chat until you're comfortable.":"Take a breath. No pressure. We go at your pace.");
    if(/someone nice to talk|unwind with|just want someone/.test(t))
      return say(state,"That's the job. I'm based at "+area+" this evening. What time were you thinking?");
    if(/what happens when i get there|don't want it to be awkward|dont want it to be awkward/.test(t))
      return say(state,"You come in, coat off, drink, sofa, music, chat until you're comfortable. Nothing rushed.");
    if(/what (you|'?re you|are you) into|kind of vibe|when we meet/.test(t))
      return say(state,(state.nervous?"Totally get it. ":"")+(SEX[id]||"GFE.")+" At a pace you're alright with. What vibe do you want tonight?");
    if(/how are you|afternoon going|not bad|okay i guess/.test(t) && !/available|free|book/.test(t))
      return say(state,"Yeah not bad. Quiet one. You?");
    if(/what you up to|wyd/.test(t)) return say(state,"Just in. Music on. You?");
    if(/\banal\b|\bgreek\b/.test(t)) return say(state, ANAL[id]||"Not something I list.");
    if(/selfie|prove (it'?s|its) you|wrong address|scam/.test(t))
      return say(state,"I get the worry. Photos on the profile are me. I don't send extra selfies. Address after the deposit.");
    if(/how much|price|rate|cost|\u00a3/.test(t))
      return say(state, pr.fee.indexOf("I'll")===0 ? ("I'll text the figure. "+label+".") : ("It's "+pr.fee+" for the "+pr.h+" hours at mine. Unhurried. Zero rush."));
    if(/cash|deposit/.test(t) && !/paid/.test(t))
      return say(state,"Cash on arrival. "+pr.dep+" holds the slot so I know you're coming. Rest when you get here.");
    if(/just paid|paid the/.test(t)) return say(state,"Got the notification. Confirmed "+(state.time||"")+" "+(state.day||"tonight")+".");
    if(/address (text|come|came)|got it|20 min/.test(t)) return say(state,"Good. Easy to find. Discreet. I'll have the place ready.");
    if(/hit book|filled it out|just filled/.test(t)) return say(state, state.nervous?"Got it. You're doing fine. Deposit link should ping your phone.":"Got it. Deposit link should ping your phone.");
    if(/what happens after|how do we (sort|actually)|press that button/.test(t))
      return say(state,"Book me now. SMS deposit link. When that clears, address and entry note to your phone.");
    if(/copy of (our )?chat|see our chat/.test(t)) return say(state,"Yes. I get the chat so I know who I'm opening the door to.");
    if(/running late|traffic|a bit late/.test(t)) return say(state,"Text me here. Heads-up and there's zero stress.");
    if(/what should i wear|over or under|jeans|shirt/.test(t)) return say(state,"Whatever you're comfortable in. Jeans and a shirt is fine.");
    if(/buzzer|code|front door|main buzzer/.test(t)) return say(state,"Main entrance, "+(BUZZ[id]||"buzz and I'll let you in")+".");
    if(/park up|outside|setting off|getting into the car|set off/.test(t))
      return say(state,"Text when you're outside. If you're about 20 minutes away, leave around 7:35 so you're not rushing.");
    if(/quiet building|discreet|hallway|communal/.test(t)) return say(state,"Quiet building. Private. No nosey neighbours.");
    if(/parking|wandering around/.test(t)) return say(state,"Pay-and-display by the entrance, or street parking after 6:30. You won't be circling.");
    if(/wine|malbec|shiraz|bottle|prosecco|take the edge/.test(t)) return say(state,"Yes please. "+(WINE[id]||"Red or prosecco")+".");
    if(/music|lighting|silence|quiet\?/.test(t)) return say(state,"Chill music, warm dim lamps. Not a silent room.");
    if(/how long have you (lived|been)/.test(t)) return say(state,"A couple of years. It's set up to be easy — light, music, private.");
    if(/what (are )?you wearing|shorts|robe/.test(t)) return say(state, WEAR[id]||"Something easy.");
    if(/see you|very soon|safe drive|see you at 8/.test(t)) return say(state,"See you at "+(state.time||"8pm")+". You'll be fine.");
    if(/outcall|incall/.test(t)) return say(state,"Incall at "+area+" is easiest tonight. Private. Hotel if we plan it.");
    if(/available|free/.test(t)) return say(state,"Might be. I'm based at "+area+" this evening. What time were you thinking?");
    if((state.wantHours!=null && state.wantHours<mh) || (/1 hour|see how it goes/.test(t) && mh>1))
      return say(state,(state.time?state.time+" works. ":"")+"I have a "+label+". For a first time, two hours is easier — drink, chat, no rush. 8 to 10 if that works.");
    if(/i('|)d like to book|book me now/.test(t)) return say(state,"Use Book me now. It keeps "+(state.time||"the time")+".");
    if(/bareback|no condom|\bbb\b/.test(t)) return say(state,"No. Protection stays on.");
    if(/are you big|cock size|inches/.test(t)){
      if(wing==="female") return say(state,"That's a male or trans question.");
      var s=SIZE[id]; return say(state,s&&s.cat==="large"?"Yeah, on the bigger side.":"I do alright.");
    }
    if(/boobs?|tits|breast/.test(t)) return say(state, wing==="male"?"That's a female or trans question.":(BUST[id]||"Natural."));
    if(state.time) return say(state,"Got you — "+state.time+" "+(state.day||"tonight")+" at "+area+". "+label+". Book me now when you're ready.");
    if(/^(yeah|yes|ok|okay|cool|perfect|brilliant)\b/.test(t)) return say(state,"What time were you thinking? I'm at "+area+" this evening.");
    return say(state,"I'm around. What time works, or do you want to talk first?");
  };
})();
