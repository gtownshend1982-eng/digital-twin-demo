/* Persona voices; Travis = mate/bro Vauxhall 2h */
(function () {
  var WING = {andreia:"female",tanita:"female",caroline:"female",faye:"female",joselyn:"female",ben:"male",glenn:"male",travis:"male",luke:"male",jeremy:"male",alexis:"trans",marianna:"trans",nicole:"trans",sophie:"trans",duda:"trans"};
  var AREA = {andreia:"my place in Kensington",tanita:"my place in Central London",caroline:"Zone 3 incall",faye:"Zone 2 incall",joselyn:"Zone 2 North",ben:"South London",glenn:"East / Essex fringe",travis:"my flat in Vauxhall",luke:"North / Camden",jeremy:"Kensington / Chelsea",alexis:"East / Canary",marianna:"Zone 2 West",nicole:"Zone 2/3 West",sophie:"Zone 1/2 West",duda:"Chelsea / Marylebone"};
  var TAG = {travis:"mate",ben:"mate",glenn:"mate",luke:"mate",jeremy:"",tanita:"babe",andreia:"",caroline:"love",faye:"",joselyn:"",alexis:"",marianna:"babe",nicole:"",sophie:"",duda:""};
  var PRICE = {tanita:{h:2,fee:"\u00a3700",dep:"\u00a3100"},travis:{h:2,fee:"\u00a3700",dep:"\u00a3100"},duda:{h:2,fee:"\u00a3700",dep:"\u00a3100"},jeremy:{h:2,fee:"\u00a3700",dep:"\u00a3100"}};
  var BUZZ = {travis:"buzz flat 3A",tanita:"buzz flat 4B",andreia:"buzz when you get to the door"};
  var WINE = {travis:"Malbec or Shiraz",tanita:"Malbec or cab sav",andreia:"red or prosecco"};
  var WEAR = {travis:"Lounge shorts and a casual top. Easy.",tanita:"Something easy. Silk if I feel like it.",andreia:"Something cozy."};
  var SEX = {travis:"Full GFE. Kissing, physical, unhurried.",tanita:"Passionate GFE. Kissing, unhurried.",andreia:"Soft GFE — kissing, cuddling.",ben:"GFE, kissing, unhurried.",glenn:"Girlfriend energy with women.",luke:"GFE or more physical.",jeremy:"Dinner, hotel, slow.",caroline:"Straightforward session.",faye:"Dominance, protocol.",joselyn:"Soft D/s, aftercare.",alexis:"GFE, kissing, I can lead.",marianna:"Playful GFE.",nicole:"Sweet GFE.",sophie:"Massage into sex.",duda:"Dinner, hotel, kissing."};
  var ANAL = {travis:"Yes — on my list. Receptive preferred. We talk first.",caroline:"No. Greek is a hard no unless we later agree it.",faye:"Strap-on can be earned.",joselyn:"Plug only if we agree.",andreia:"Not something I list.",tanita:"Not on my list."};
  var SIZE = {ben:{cat:"large"},glenn:{cat:"medium"},travis:{cat:"medium"},luke:{cat:"large"},jeremy:{cat:"medium"},alexis:{cat:"large"},marianna:{cat:"medium"},nicole:{cat:"medium"},sophie:{cat:"medium"},duda:{cat:"large"}};
  var BUST = {andreia:"Big natural chest.",tanita:"Natural, tall frame.",caroline:"Natural.",faye:"Natural.",joselyn:"Petite, natural.",alexis:"Enhanced.",marianna:"Enhanced hourglass.",nicole:"Enhanced, petite.",sophie:"Enhanced, not huge.",duda:"Enhanced, model frame."};
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function norm(s){return String(s||"").toLowerCase().replace(/[’']/g,"'").trim();}
  var STOP=/^(hi|hey|hello|yo|yes|yeah|ok|okay|cool|im|i'm|me|you|who|what|when|how|free|tonight|today|book|hotel|love|baby|babe|hun|mate|here)$/i;
  function titleName(s){return String(s||"").replace(/[^\p{L}\p{N}'-]+/gu,"").replace(/^\w/,function(c){return c.toUpperCase();});}
  function extractGuestName(raw){
    var text=String(raw||"").trim();
    var m=text.match(/(?:i(?:['’]?m| am)|this is|call me)\s+([A-Za-z][A-Za-z'\-]{1,20})/i);
    if(m&&m[1]&&!STOP.test(m[1])) return titleName(m[1]);
    var words=text.replace(/[^A-Za-z'\- ]/g," ").trim().split(/\s+/);
    if(words.length===1 && words[0].length>=2 && !STOP.test(words[0])) return titleName(words[0]);
    return "";
  }
  function parseMinHours(p){
    var s=String((p&&p.minDuration)||"1 hour").toLowerCase();
    return /2 hour/.test(s)?2:(/45|30/.test(s)?0.75:1);
  }
  function minLabel(h){return h>=2?"2-hour minimum":"1-hour minimum";}
  function grabSlots(raw,state){
    var t=norm(raw);
    if(/tonight|today|this evening/.test(t)) state.day="tonight";
    if(/tomorrow/.test(t)) state.day="tomorrow";
    var tm=t.match(/\b(\d{1,2})\s*(am|pm)\b/i)||t.match(/\b(\d{1,2})(am|pm)\b/i)||t.match(/around\s+(\d{1,2})/i);
    if(tm){ state.time=tm[1]+((tm[2]&&/am|pm/i.test(tm[2]))?tm[2]:"pm"); if(!state.day) state.day="tonight"; }
    if(/incall|at yours|your flat/.test(t)) state.where="incall";
    if(/outcall|hotel/.test(t)) state.where="hotel";
    if(/1 hour|one hour|an hour/.test(t)) state.wantHours=1;
    if(/2 hour/.test(t)) state.wantHours=2;
  }
  function tag(id){return TAG[id]?(" "+TAG[id]):"";}
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
    var tg=tag(id);
    if(/underage|teen/.test(t)) return "No. Adult bookings only.";
    if(!state.guestName && state.turns<=2) return id==="travis" ? "Hey. Who am I talking to?" : "Hey. Thanks for reaching out. Who am I talking to?";
    if(state.guestName && state.turns<=3 && extractGuestName(raw) && !/available|free|into|book|hour|pm/.test(t))
      return say(state, id==="travis" ? "Alright. Good to meet you. How's your afternoon going?" : "Hey. Lovely to meet you. How's your afternoon going?");
    if(/what (you|'?re you|are you) into|kind of vibe|when we meet/.test(t))
      return say(state,(SEX[id]||"GFE.")+" Drink, music, no rush. What vibe do you want tonight?");
    if(/how are you|afternoon going|not bad/.test(t) && !/available|free|book/.test(t))
      return say(state,"Yeah not bad. Quiet one. You?");
    if(/what you up to|wyd/.test(t)) return say(state,"Just in. Music on. You?");
    if(/\banal\b|\bgreek\b/.test(t)) return say(state, ANAL[id]||"Not something I list.");
    if(/selfie|prove (it'?s|its) you/.test(t))
      return say(state, id==="travis" ? "I get why you're cautious, but the pics on the profile are me. No extra selfies over text. Better in person." : "Photos on the profile are me. I don't send extra selfies.");
    if(/how much|price|rate|cost|\u00a3/.test(t))
      return say(state, pr.fee.indexOf("I'll")===0 ? ("I'll text the figure. "+label+".") : ("It's "+pr.fee+" for the "+pr.h+" hours at mine. Unhurried."));
    if(/cash|deposit/.test(t) && !/paid/.test(t))
      return say(state,"Cash on arrival. "+pr.dep+" holds "+(state.time||"the")+" slot. Rest when you get here.");
    if(/just paid|paid the/.test(t))
      return say(state,"Got the notification. Confirmed "+(state.time||"")+" "+(state.day||"tonight")+". Address is in the text.");
    if(/address come|got it|20 mins/.test(t)) return say(state,"Good. I'll get things ready.");
    if(/hit book|filled it out|just filled/.test(t)) return say(state,"Got it. Deposit link should ping your phone.");
    if(/what happens after|how do we sort/.test(t)) return say(state,"Hit Book me now. Then deposit, then address.");
    if(/copy of (our )?chat/.test(t)) return say(state,"Yes. I get the chat so I know who I'm opening the door to.");
    if(/running late|traffic/.test(t)) return say(state,"Text me here. Heads-up and it's fine.");
    if(/what should i wear|jeans|shirt|casual or smart/.test(t)) return say(state,"Smart casual. Whatever you feel good in.");
    if(/buzzer|code|front door/.test(t)) return say(state,"Main entrance, "+(BUZZ[id]||"buzz and I'll let you up")+".");
    if(/park up|outside|leaving your place|setting off/.test(t)) return say(state,"Yes. Text when you're outside.");
    if(/quiet building|discreet|hallway/.test(t)) return say(state,"Quiet building. Private.");
    if(/parking/.test(t)) return say(state,"Pay-and-display near the building, or street parking after 6:30.");
    if(/wine|malbec|shiraz|bottle|prosecco/.test(t)) return say(state,"Yes please. "+(WINE[id]||"Red or prosecco")+".");
    if(/music|lighting|candles|silence/.test(t)) return say(state,"Soft music, warm dim light. Not a silent room.");
    if(/what (are )?you wearing|shorts|robe/.test(t)) return say(state, WEAR[id]||"Something easy.");
    if(/see you|very soon|safe drive/.test(t)) return say(state,"See you at "+(state.time||"the time")+". Text when you leave.");
    if(/outcall|incall/.test(t)) return say(state,"Mostly incall at "+area+". Hotel outcall if we plan it. Incall is easiest tonight.");
    if(/available|free/.test(t)) return say(state,"Might be. I'm based at "+area+" this evening. What time were you thinking?");
    if((state.wantHours!=null && state.wantHours<mh) || (/1 hour/.test(t) && mh>1))
      return say(state,(state.time?state.time+" works. ":"")+"I have a "+label+". Drink, no clock-watching. 8 to 10 if that works.");
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
