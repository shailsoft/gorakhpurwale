import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const shopper={id:'shopper-1',name:'Shopper One',email:'one@example.test',role:'shopper'};
const other={id:'shopper-2',name:'Shopper Two',email:'two@example.test',role:'shopper'};
const first={id:'ORDER-1',accountId:shopper.id,status:'Received',createdAt:'2026-11-07T10:00:00Z',items:[{name:'Test tee',size:'M',quantity:1}],total:499,paymentLabel:'Cash on delivery',city:'Sahjanwa',state:'Uttar Pradesh',pincode:'273209'};

function app(remote=true){
 const nodes=new Map(),storage=new Map(),events=new Map(),timers=new Map();let nextTimer=0,calls=0,pending=null,errorStatus=0;
 let records=[structuredClone(first)],responseUser=shopper;
 const node=()=>({hidden:false,textContent:'',innerHTML:'',value:'',dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(name,value){this[name]=value;},addEventListener(name,fn){this[name]=fn;},focus(){},querySelector(){return node();}});
 const document={readyState:'loading',hidden:false,activeElement:node(),body:node(),querySelector(selector){if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector);},querySelectorAll(){return [];},addEventListener(name,fn){events.set(name,fn);}};
 const window={addEventListener(name,fn){events.set(name,fn);}};
 const fetch=async(url,options={})=>{
   if(options.method==='POST'){
     const input=JSON.parse(options.body),order=records.find(record=>record.id===input.id);
     if(input.action==='status')order.status=input.status;
     if(input.action==='tracking')Object.assign(order,input);
     return {ok:true,status:200,json:async()=>({ok:true,order:structuredClone(order)})};
   }
   assert.match(url,/my-orders&_sync=/);assert.equal(options.cache,'no-store');assert.equal(options.credentials,'same-origin');calls++;
   const snapshot=structuredClone({ok:true,user:responseUser,orders:records});
   if(pending){const resolve=pending;pending=null;await new Promise(done=>resolve(done));}
   return {ok:!errorStatus,status:errorStatus||200,json:async()=>errorStatus?{ok:false,error:'Service unavailable'}:snapshot};
 };
 const context=vm.createContext({document,window,fetch,URL,Intl,Date,btoa,atob,clearInterval:id=>timers.delete(id),setInterval:(fn,ms)=>{const id=++nextTimer;timers.set(id,{fn,ms});return id;},location:{protocol:remote?'https:':'file:',hostname:remote?'example.test':''},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)}});
 let source=fs.readFileSync('wp-content/themes/gw-store/assets/js/store.js','utf8');
 source=source.replace('  const init = async()',`  globalThis.syncTest={refreshCustomerOrderStatuses,customerOrders,showProfileOrders,closeAuth,setupEvents,updateSharedOrder,updateSharedTracking,resetCustomerOrders,currentAccount,setUser:user=>{resetCustomerOrders();serverUser=user;renderAuth();},setOrders:value=>{orders=value;},adminOrders:()=>orders};\n  const init = async()`);
 vm.runInContext(source,context);
 const test=context.syncTest;test.setUser(shopper);test.setupEvents();
 return {test,nodes,storage,events,timers,document,records,calls:()=>calls,setResponseUser:user=>responseUser=user,setError:status=>errorStatus=status,defer:fn=>pending=fn};
}

const remote=app();const {test,nodes}=remote;
test.setOrders([{...first,status:'Cancelled'},{...first,id:'OTHER',accountId:other.id}]);
test.setUser(shopper);
assert.match(nodes.get('#customer-order-list').innerHTML,/Loading your latest orders/);
await test.refreshCustomerOrderStatuses();
assert.match(nodes.get('#customer-order-list').innerHTML,/Received/);
assert.equal(test.adminOrders().length,2);assert.equal(test.adminOrders()[0].status,'Cancelled');
await test.updateSharedOrder(first.id,'Confirmed');await test.refreshCustomerOrderStatuses();
assert.match(nodes.get('#customer-order-list').innerHTML,/Confirmed/);
await test.updateSharedTracking(first.id,{courierName:'Test Courier',trackingNumber:'AWB-123',trackingUrl:'https://example.test/track'});
await test.refreshCustomerOrderStatuses();
assert.match(nodes.get('#customer-order-list').innerHTML,/Test Courier/);assert.match(nodes.get('#customer-order-list').innerHTML,/AWB-123/);
// My Orders refreshes on a timer, manual action, focus, reconnect and tab visibility.
test.showProfileOrders();assert.equal([...remote.timers.values()][0].ms,5000);await test.refreshCustomerOrderStatuses();
remote.records[0].status='Shipped';await [...remote.timers.values()][0].fn();await test.refreshCustomerOrderStatuses();
assert.match(nodes.get('#customer-order-list').innerHTML,/Shipped/);
for(const event of ['focus','online','visibilitychange']){remote.records[0].trackingNumber=event;remote.events.get(event)();await test.refreshCustomerOrderStatuses();assert.match(nodes.get('#customer-order-list').innerHTML,new RegExp(event));}
remote.records[0].status='Delivered';nodes.get('#refresh-customer-orders').click();await test.refreshCustomerOrderStatuses();assert.match(nodes.get('#customer-order-list').innerHTML,/Delivered/);
const before=remote.calls();remote.document.hidden=true;remote.events.get('visibilitychange')();assert.equal(remote.calls(),before);remote.document.hidden=false;
test.closeAuth();assert.equal(remote.timers.size,0);remote.events.get('focus')();assert.equal(remote.calls(),before);
// Slow responses cannot overlap or overwrite another account after a login change.
let release;remote.defer(resolve=>release=resolve);const slow=test.refreshCustomerOrderStatuses();test.refreshCustomerOrderStatuses();assert.equal(remote.calls(),before+1);
test.setUser(other);release();await slow;assert.equal(test.customerOrders().length,0);
remote.setResponseUser(other);remote.records[0]={...first,id:'SECOND',accountId:other.id};await test.refreshCustomerOrderStatuses();assert.equal(test.customerOrders()[0].id,'SECOND');
remote.setError(503);await test.refreshCustomerOrderStatuses();assert.match(nodes.get('#customer-orders-sync').textContent,/Could not refresh/);assert.equal(test.customerOrders()[0].id,'SECOND');
remote.setError(401);await test.refreshCustomerOrderStatuses();assert.equal(test.currentAccount(),null);assert.equal(test.customerOrders().length,0);
// Local preview reads order changes made by another tab instead of returning early.
const local=app(false);local.storage.set('gw-demo-accounts-v2',JSON.stringify([shopper]));local.storage.set('gw-demo-session-v1',shopper.id);
local.storage.set('gw-demo-orders-v1',JSON.stringify([first]));await local.test.refreshCustomerOrderStatuses();assert.equal(local.test.customerOrders()[0].status,'Received');
local.storage.set('gw-demo-orders-v1',JSON.stringify([{...first,status:'Confirmed',courierName:'Local courier',trackingNumber:'LOCAL-123'}]));await local.test.refreshCustomerOrderStatuses();assert.equal(local.test.customerOrders()[0].status,'Confirmed');assert.equal(local.test.customerOrders()[0].trackingNumber,'LOCAL-123');
console.log('PASS: status/courier synchronization, server-only customer snapshots, separate admin data, timer/manual/focus/reconnect refresh, stale-response protection, session expiry and local preview updates');
