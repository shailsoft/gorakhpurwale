import assert from 'node:assert/strict';
import readline from 'node:readline/promises';
const input=readline.createInterface({input:process.stdin});const credentials=JSON.parse(await input.question('Credentials JSON (hidden): '));input.close();
const base='https://gorakhpurwale.com/api/store.php';let cookie='';
async function request(action,payload,auth=true){const response=await fetch(payload?base:`${base}?action=${action}`,{method:payload?'POST':'GET',headers:{...(auth&&cookie?{Cookie:cookie}:{}),...(payload?{'Content-Type':'application/json'}:{})},body:payload?JSON.stringify({action,...payload}):undefined,cache:'no-store'});if(auth&&response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];return {status:response.status,data:await response.json()};}
assert.equal((await request('login',credentials)).status,200);
const orders=(await request('list')).data.orders;
const users=(await request('users')).data.users;
const mine=(await request(`my-orders&_sync=${Date.now()}`)).data;
assert.equal(mine.user.email,credentials.identifier||credentials.email);
assert.ok(mine.orders.every(order=>order.accountId?order.accountId===mine.user.id||order.accountId===mine.user.email:order.email?.toLowerCase()===mine.user.email.toLowerCase()));
for(const order of orders){
 const owner=users.find(user=>order.accountId?order.accountId===user.id:order.email&&order.email===user.email);
 let tokenMatches=null;
 if(order.accessToken){const result=await request(`order-status&id=${encodeURIComponent(order.id)}&token=${encodeURIComponent(order.accessToken)}`,null,false);tokenMatches=result.status===200&&['status','courierName','trackingNumber'].every(field=>(result.data.order[field]||'')===(order[field]||''));assert.ok(tokenMatches);}
 console.log(JSON.stringify({status:order.status,hasCourier:Boolean(order.courierName),hasAccountId:Boolean(order.accountId),accountExists:Boolean(owner),hasToken:Boolean(order.accessToken),tokenMatches,hasEmail:Boolean(order.email),mobileMatches:users.filter(user=>user.phone&&String(order.phone||'').replace(/\D/g,'').endsWith(user.phone)).length}));
}
console.log('PASS: current server and customer token responses agree; no records changed');
