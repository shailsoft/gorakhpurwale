import assert from 'node:assert/strict';
import readline from 'node:readline/promises';
const input = readline.createInterface({input:process.stdin});
const credentials = JSON.parse(await input.question('Credentials JSON (hidden): '));
input.close();
const base = process.env.GW_TEST_BASE || 'https://gorakhpurwale.com/api/store.php';
let cookie = '';
async function request(action, payload, authenticated=true) {
  const response = await fetch(payload ? base : `${base}?action=${action}`, {
    method:payload?'POST':'GET', headers:{...(payload?{'Content-Type':'application/json'}:{}),...(authenticated&&cookie?{Cookie:cookie}:{})},
    body:payload?JSON.stringify({action,...payload}):undefined
  });
  if(authenticated&&response.headers.get('set-cookie')) cookie=response.headers.get('set-cookie').split(';')[0];
  return {status:response.status,data:await response.json()};
}
assert.equal((await request('health')).data.version,'server-users-v1');
assert.equal((await request('product-save',{product:{}},false)).status,401);
assert.equal((await request('login',credentials)).status,200);
assert.equal((await request('session')).data.user.role,'admin');
const users=(await request('users')).data.users;
assert.equal(users.length,1);assert.equal(users[0].role,'admin');
console.log('PASS: server login, session, one admin, anonymous-write protection');
const id=`regression-${Date.now()}`;
const product={id,name:'Deployment verification item',category:'Gift',colour:'White',price:349,mrp:449,stock:2,status:'active',audiences:['Men','Women'],sizes:['Standard','500 ml'],description:'Temporary deployment regression fixture',images:[]};
try {
  const saved=await request('product-save',{product});
  assert.equal(saved.status,200,JSON.stringify(saved.data));
  const publicProduct=(await request('catalog',null,false)).data.products.find(item=>item.id===id);
  assert.deepEqual(publicProduct.sizes,['Standard','500 ml']);assert.equal(publicProduct.price,349);
  await request('product-save',{product:{...product,price:399,status:'inactive'}});
  const edited=(await request('catalog',null,false)).data.products.find(item=>item.id===id);
  assert.equal(edited.price,399);assert.equal(edited.status,'inactive');
  console.log('PASS: new product persists, public reader sees variants, edit and visibility persist');
} finally {
  const latest=(await request('catalog')).data.products;
  if(latest.some(item=>item.id===id)){
    const clean=await request('catalog-save',{products:latest.filter(item=>item.id!==id)});
    assert.equal(clean.status,200,'Fixture cleanup failed');
  }
}
await request('logout',{});
assert.equal((await request('session')).data.user,null);
assert.equal((await request('login',credentials)).status,200);
assert.equal((await request('users')).data.users.length,1);
console.log('PASS: logout/re-login, test fixture removed; one admin remains');
