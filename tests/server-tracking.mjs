import assert from 'node:assert/strict';
import readline from 'node:readline/promises';
const input=readline.createInterface({input:process.stdin});const credentials=JSON.parse(await input.question('Credentials JSON (hidden): '));input.close();
const base=process.env.GW_TEST_BASE||'https://gorakhpurwale.com/api/store.php';let cookie='';
async function call(action,payload,auth=true){const response=await fetch(payload?base:`${base}?action=${action}`,{method:payload?'POST':'GET',headers:{...(payload?{'Content-Type':'application/json'}:{}),...(auth&&cookie?{Cookie:cookie}:{})},body:payload?JSON.stringify({action,...payload}):undefined});if(auth&&response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];return {status:response.status,data:await response.json()};}
assert.equal((await call('tracking',{id:'nonexistent'},false)).status,401);
assert.equal((await call('my-orders',null,false)).status,401);
assert.equal((await call('login',credentials)).status,200);
const before=(await call('list')).data.orders;
assert.equal((await call('tracking',{id:'nonexistent',courierName:'Test Courier',trackingNumber:''})).status,422);
for(const trackingUrl of ['javascript:alert(1)','http://example.com','https://user:pass@example.com'])assert.equal((await call('tracking',{id:'nonexistent',courierName:'Test Courier',trackingNumber:'AWB-123',trackingUrl})).status,422);
assert.equal((await call('tracking',{id:'nonexistent',courierName:'Test Courier',trackingNumber:'AWB-123',trackingUrl:'https://example.com/track'})).status,404);
assert.deepEqual((await call('list')).data.orders,before);
const rejected=(await call('delivery-check&pincode=273001&subtotal=499',null,false)).data.quote;
assert.equal(rejected.eligible,false);assert.match(rejected.message,/not available in this area/);
for(const pin of ['273165','273411','273209'])assert.equal((await call(`delivery-check&pincode=${pin}&subtotal=499`,null,false)).data.quote.eligible,true);
console.log('PASS: tracking authorization, field/URL validation, missing-order protection, zero order mutations, unsupported-area message and all three enabled PINs');
