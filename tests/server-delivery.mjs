import assert from 'node:assert/strict';
import readline from 'node:readline/promises';
const reader=readline.createInterface({input:process.stdin});
const credentials=JSON.parse(await reader.question('Credentials JSON (hidden): '));reader.close();
const base=process.env.GW_TEST_BASE||'https://gorakhpurwale.com/api/store.php';let cookie='';
async function call(action,payload,auth=true){const response=await fetch(payload?base:`${base}?action=${action}`,{method:payload?'POST':'GET',headers:{...(payload?{'Content-Type':'application/json'}:{}),...(auth&&cookie?{Cookie:cookie}:{})},body:payload?JSON.stringify({action,...payload}):undefined});if(auth&&response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];return {status:response.status,data:await response.json()};}
assert.equal((await call('delivery-settings',null,false)).status,401);
assert.equal((await call('delivery-save',{revision:0,areas:[]},false)).status,401);
assert.equal((await call('login',credentials)).status,200);
const initial=await call('delivery-settings');assert.equal(initial.status,200);
const settings=initial.data.settings;
assert.equal((await call('delivery-save',{revision:-1,areas:settings.areas})).status,409);
for(const pincodes of [['123*'],['012345'],['123456','123456']]){
 const invalid=await call('delivery-save',{revision:settings.revision,areas:[{name:'Validation only',pincodes,active:false,fee:79,freeAbove:799}]});assert.equal(invalid.status,422);
}
const denied=await call('delivery-check&pincode=000000&subtotal=499',null,false);assert.equal(denied.data.quote.eligible,false);
const before=(await call('list')).data.orders.length;
const order=await call('create',{customerName:'Delivery Validation',email:'validation@example.test',phone:'9999999999',address:'Validation only',city:'Validation',state:'Validation',pincode:'000000',items:[{productId:'cloud-oversized',name:'Validation only',size:'M',quantity:1,unitPrice:499}],shipping:0,total:0});
assert.equal(order.status,422);assert.equal(order.data.code,'DELIVERY_UNAVAILABLE');
assert.equal((await call('list')).data.orders.length,before);
const after=(await call('delivery-settings')).data.settings;
assert.deepEqual(after,settings);
console.log('PASS: admin-only settings, stale-save rejection, invalid/duplicate PIN rejection, server checkout denial, zero order/config mutations');
