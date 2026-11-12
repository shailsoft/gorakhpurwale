import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base='https://gorakhpurwale.com';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
await Promise.all(['index.html','wp-content/themes/gw-store/assets/js/store.js','wp-content/themes/gw-store/assets/css/store.css'].map(async file=>{
 const response=await fetch(`${base}/${file}?verify=20261112-v16`,{cache:'no-store'});assert.equal(response.status,200);
 const live=Buffer.from(await response.arrayBuffer()),local=await fs.readFile(`deployment/static/${file}`);
 assert.equal(hash(live),hash(local),`${file} differs from the tested release`);console.log('PASS: deployed '+file+' matches the tested release');
}));
for(const endpoint of ['store.php','orders.php']){const response=await fetch(`${base}/api/${endpoint}?action=health`,{cache:'no-store'});assert.equal(response.status,200);const data=await response.json();assert.equal(data.service,'gw-store');assert.equal(data.version,'server-users-v1');}
for(const action of ['list','users','my-orders']){const response=await fetch(`${base}/api/store.php?action=${action}`,{cache:'no-store'});assert.equal(response.status,401);}
for(const endpoint of ['store.php','orders.php']){const response=await fetch(`${base}/api/${endpoint}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'create'})});assert.equal(response.status,401);}
for(const action of ['order-request','review-order-request']){
 const response=await fetch(`${base}/api/store.php`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action})});
 assert.equal(response.status,401,`The live API must require sign-in for ${action}`);
}
const privateResponse=await fetch(`${base}/private-data/users.json`,{cache:'no-store'});assert.ok([401,403,404].includes(privateResponse.status),'Private records must require authorization or be hidden');await privateResponse.body?.cancel();
assert.equal((await fetch(`${base}/api/inventory.php`,{cache:'no-store'})).status,200);
console.log('PASS: live APIs, legacy endpoint authentication, private-file protection and inventory helper');
