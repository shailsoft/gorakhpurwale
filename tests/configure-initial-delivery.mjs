import assert from 'node:assert/strict';
import readline from 'node:readline/promises';
const reader=readline.createInterface({input:process.stdin});
const credentials=JSON.parse(await reader.question('Credentials JSON (hidden): '));reader.close();
const base=process.env.GW_TEST_BASE||'https://gorakhpurwale.com/api/store.php';let cookie='';
async function call(action,payload,auth=true){const response=await fetch(payload?base:`${base}?action=${action}`,{method:payload?'POST':'GET',headers:{...(payload?{'Content-Type':'application/json'}:{}),...(auth&&cookie?{Cookie:cookie}:{})},body:payload?JSON.stringify({action,...payload}):undefined});if(auth&&response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];const data=await response.json();assert.equal(data.ok,true,data.error);return data;}
await call('login',credentials);
const {settings}=await call('delivery-settings');
assert.equal(settings.areas.length,0,'Areas already configured; no changes made.');
// PIN codes explicitly supplied by the owner. This is a one-time setup tool, not a runtime seed.
const areas=[['Pepeeganj (Pipiganj / Peppeganj)','273165','Pepeeganj'],['Basgoan','273411','Basgoan'],['Sahjanwa','273209','Sahjanwa']].map(([name,pin,city])=>({name,pincodes:[pin],city,state:'Uttar Pradesh',eta:'Confirmed before dispatch',fee:79,freeAbove:799,active:true}));
await call('delivery-save',{revision:settings.revision,areas});
for(const area of areas){
 const {quote}=await call(`delivery-check&pincode=${area.pincodes[0]}&subtotal=499`,null,false);
 assert.equal(quote.eligible,true);assert.equal(quote.shipping,79);assert.equal(quote.area,area.name);
 const free=(await call(`delivery-check&pincode=${area.pincodes[0]}&subtotal=799`,null,false)).quote;
 assert.equal(free.shipping,0);
}
assert.equal((await call('delivery-check&pincode=273001&subtotal=499',null,false)).quote.eligible,false);
const saved=(await call('delivery-settings')).settings;
assert.equal(saved.areas.length,3);assert.equal(saved.areas.every(area=>area.active),true);
console.log('PASS: approved PINs 273165, 273411, 273209 saved; all publicly serviceable; fees and free threshold verified; unapproved PIN blocked');
