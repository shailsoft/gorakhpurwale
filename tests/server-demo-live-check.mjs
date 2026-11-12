import assert from 'node:assert/strict';
import readline from 'node:readline/promises';
const input=readline.createInterface({input:process.stdin});const credentials=JSON.parse(await input.question('Credentials JSON (hidden): '));input.close();
const base='https://gorakhpurwale.com/api/store.php';let cookie='';
async function call(action,payload){const response=await fetch(payload?base:`${base}?action=${action}&_sync=${Date.now()}`,{method:payload?'POST':'GET',headers:{...(cookie?{Cookie:cookie}:{}),...(payload?{'Content-Type':'application/json'}:{})},body:payload?JSON.stringify({action,...payload}):undefined,cache:'no-store'});if(response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];return {status:response.status,data:await response.json()};}
assert.equal((await call('login',credentials)).status,200);
const before=(await call('list')).data.orders,catalog=(await call('catalog')).data.products;
// The unsupported PIN/empty items are additional guards against ever creating a production order.
const payload={customerName:'Validation only',phone:'9000000101',email:'',address:'Validation only',city:'Validation only',state:'Uttar Pradesh',pincode:'273001',items:[],payment:'online-demo',demoMethod:'upi'};
for(const demoOutcome of ['failure','cancelled']){const result=await call('create',{...payload,demoOutcome});assert.equal(result.status,422);assert.match(result.data.error,/demo payment was not completed/);}
const invalid=await call('create',{...payload,demoOutcome:'success',checkoutAttemptId:''});assert.equal(invalid.status,422);assert.match(invalid.data.error,/Start a new demo/);
assert.deepEqual((await call('list')).data.orders,before);assert.deepEqual((await call('catalog')).data.products,catalog);
console.log('PASS: live demo outcome/attempt validation is active; zero production order or stock changes');
