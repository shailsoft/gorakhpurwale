import assert from 'node:assert/strict';
import readline from 'node:readline/promises';
const input=readline.createInterface({input:process.stdin});
const credentials=JSON.parse(await input.question('Credentials JSON (hidden): '));input.close();
const base=process.env.GW_TEST_BASE||'https://gorakhpurwale.com/api/store.php';let cookie='';
async function call(action,payload,auth=true){
 const response=await fetch(payload?base:`${base}?action=${action}`,{method:payload?'POST':'GET',headers:{...(payload?{'Content-Type':'application/json'}:{}),...(auth&&cookie?{Cookie:cookie}:{})},body:payload?JSON.stringify({action,...payload}):undefined});
 if(auth&&response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];
 return {status:response.status,data:await response.json()};
}
assert.equal((await call('login',credentials)).status,200);
const users=(await call('users')).data.users,orders=(await call('list')).data.orders;
for(const contacts of [{}, {phone:'123'}, {email:'invalid-email'}]){
 const result=await call('register',{name:'Validation only',...contacts,password:'test-only-password'},false);
 assert.equal(result.status,422);
}
const order={customerName:'Validation only',phone:'9876543210',address:'Validation only',city:'Test',state:'Uttar Pradesh',pincode:'273001',items:[{productId:'validation-only',name:'Validation only',unitPrice:1,quantity:1}]};
// Unsupported PIN prevents any order write, but comes after contact validation.
for(const email of [undefined,'','valid@example.test']){
 const result=await call('create',{...order,...(email===undefined?{}:{email})});
 assert.equal(result.status,422);assert.equal(result.data.code,'DELIVERY_UNAVAILABLE');
}
const invalid=await call('create',{...order,email:'invalid-email'});
assert.equal(invalid.status,422);assert.match(invalid.data.error,/valid email/);
assert.deepEqual((await call('users')).data.users,users);
assert.deepEqual((await call('list')).data.orders,orders);
console.log('PASS: missing or invalid registration contact rejected server-side, existing admin email login, missing/blank/valid checkout email accepted through contact validation, invalid email rejected, zero user/order mutations');
