import assert from 'node:assert/strict';
import readline from 'node:readline/promises';
const base=process.env.GW_TEST_BASE;
if(!/^https:\/\/gorakhpurwale\.com\/qa-[a-z0-9]{12}\/api\/store\.php$/.test(base||''))throw new Error('Isolated QA store required.');
const input=readline.createInterface({input:process.stdin});const values=JSON.parse(await input.question('QA command JSON (hidden): '));input.close();let cookie='';
async function call(action,payload){const response=await fetch(payload?base:`${base}?action=${action}`,{method:payload?'POST':'GET',headers:{...(cookie?{Cookie:cookie}:{}),...(payload?{'Content-Type':'application/json'}:{})},body:payload?JSON.stringify({action,...payload}):undefined});if(response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];const data=await response.json();assert.equal(data.ok,true,JSON.stringify(data));return data;}
await call('login',values.admin);
for(const command of values.commands){const result=await call(command.action,command.payload);console.log(JSON.stringify({action:command.action,id:result.order?.id,status:result.order?.status,courier:result.order?.courierName,tracking:result.order?.trackingNumber}));}
