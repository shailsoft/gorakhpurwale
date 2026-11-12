import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
const storage=new Map(),nodes=new Map();
const account={id:'demo-shopper',name:'Demo Shopper',email:'',phone:'9000000101',role:'shopper'};
storage.set('gw-demo-accounts-v2',JSON.stringify([account]));storage.set('gw-demo-session-v1',account.id);
storage.set('gw-delivery-settings-v1',JSON.stringify({revision:1,areas:[{name:'Sahjanwa',city:'Sahjanwa',state:'Uttar Pradesh',pincodes:['273209'],active:true,fee:79,freeAbove:799,eta:'Test'}]}));
function node(){return {hidden:false,disabled:false,value:'',textContent:'',innerHTML:'',dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(name,fn){this[name]=fn;},setAttribute(){},focus(){},querySelector:selector=>get(selector),querySelectorAll:()=>[],reportValidity:()=>true};}
function get(selector){if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector);}
const document={readyState:'loading',activeElement:node(),body:node(),querySelector:get,querySelectorAll:()=>[],addEventListener(){}};
const form=get('#checkout-form');form.values={name:account.name,email:'',phone:account.phone,address:'Demo address',city:'Sahjanwa',state:'Uttar Pradesh',pincode:'273209',payment:'online-demo'};
form.elements=Object.fromEntries(Object.entries(form.values).map(([key,value])=>[key,{value,options:[{value:'Uttar Pradesh'}]}]));
const context=vm.createContext({document,window:{addEventListener(){}},crypto:webcrypto,Intl,Date,URL,btoa,atob,setTimeout,clearTimeout,clearInterval,location:{protocol:'file:',hostname:''},FormData:class{constructor(target){assert.equal(target,form);}get(name){return form.values[name]??null;}},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)}});
let source=fs.readFileSync('wp-content/themes/gw-store/assets/js/store.js','utf8');
source=source.replace('  const init = async()',`  globalThis.demoTest={setupEvents,demoPaymentAction,trackingMarkup,trackingEditorMarkup,renderAdmin,setBag:items=>{cart=items;},orders:()=>orders,bag:()=>cart,stock:()=>productById('cloud-oversized').stock};\n  const init = async()`);
vm.runInContext(source,context);const test=context.demoTest;test.setupEvents();test.setBag([{productId:'cloud-oversized',size:'M',quantity:1,price:499}]);
async function submit(){const event={currentTarget:form,preventDefault(){}};const promise=form.submit(event);event.currentTarget=null;await promise;}
await submit();assert.equal(get('#demo-payment-panel').hidden,false);assert.equal(test.orders().length,0);assert.match(get('#demo-payment-panel').innerHTML,/₹0 will be collected/);assert.doesNotMatch(get('#demo-payment-panel').innerHTML,/name="(?:cardNumber|cvv|otp|upiId)"/);
await test.demoPaymentAction('failure');assert.match(get('#demo-payment-panel').innerHTML,/Demo payment failed/);assert.equal(test.orders().length,0);assert.equal(test.bag().length,1);
await test.demoPaymentAction('retry');assert.match(get('#demo-payment-panel').innerHTML,/Simulate successful payment/);
await test.demoPaymentAction('cancel');assert.equal(get('#demo-payment-panel').hidden,true);assert.equal(get('#checkout-flow').hidden,false);assert.match(get('#checkout-payment-note').textContent,/Demo cancelled/);assert.equal(test.bag().length,1);
await submit();const stock=test.stock();await Promise.all([test.demoPaymentAction('success'),test.demoPaymentAction('success')]);
assert.equal(test.orders().length,1);const order=test.orders()[0];assert.equal(order.isDemo,true);assert.equal(order.amountCollected,0);assert.equal(order.status,'Demo only');assert.equal(test.stock(),stock);assert.equal(test.bag().length,1);
assert.match(get('#order-success').innerHTML,/Demo payment successful/);assert.match(test.trackingMarkup(order),/Do not dispatch/);assert.doesNotMatch(test.trackingEditorMarkup(order),/<form/);
test.renderAdmin();assert.equal(get('#stat-orders').textContent,0);assert.equal(get('#stat-revenue').textContent,'₹0');assert.doesNotMatch(get('#admin-order-list').innerHTML,/data-order-status/);
for(const file of ['preview/index.html','deployment/static/index.html']){const html=fs.readFileSync(file,'utf8');assert.match(html,/value="online-demo"/);assert.doesNotMatch(html,/value="online-demo"[^>]*disabled/);assert.match(html,/id="demo-payment-panel"/);}
console.log('PASS: demo checkout selection, failure/cancel/retry, duplicate-click guard, ₹0 collection, unchanged stock/bag, read-only fulfillment and exclusion from real revenue');
