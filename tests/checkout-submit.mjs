import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const storage=new Map(),nodes=new Map();
const account={id:'qa-shopper',name:'QA Shopper',email:'',phone:'9000000101',role:'shopper'};
storage.set('gw-demo-accounts-v2',JSON.stringify([account]));storage.set('gw-demo-session-v1',account.id);
storage.set('gw-delivery-settings-v1',JSON.stringify({revision:1,areas:[{name:'Sahjanwa',city:'Sahjanwa',state:'Uttar Pradesh',pincodes:['273209'],active:true,fee:79,freeAbove:799,eta:'QA'}]}));
function node(){return {hidden:false,disabled:false,value:'',textContent:'',innerHTML:'',dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(name,fn){this[name]=fn;},setAttribute(){},focus(){},querySelector(selector){return get(selector);},reportValidity(){return true;}};}
function get(selector){if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector);}
const document={readyState:'loading',activeElement:node(),body:node(),querySelector:get,querySelectorAll(){return [];},addEventListener(){}};
const form=get('#checkout-form');form.values={name:account.name,email:'',phone:account.phone,address:'QA only',city:'Sahjanwa',state:'Uttar Pradesh',pincode:'273209',payment:'cod'};
form.elements=Object.fromEntries(Object.entries(form.values).map(([key,value])=>[key,{value,options:[{value:'Uttar Pradesh'}]}]));
const context=vm.createContext({document,window:{addEventListener(){}},Intl,Date,URL,btoa,atob,setTimeout,clearTimeout,clearInterval,location:{protocol:'file:',hostname:''},FormData:class{constructor(target){assert.equal(target,form,'Submit must retain its form across login checks');this.values=target.values;}get(name){return this.values[name]??null;}},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)}});
let source=fs.readFileSync('wp-content/themes/gw-store/assets/js/store.js','utf8');
source=source.replace('  const init = async()',`  globalThis.submitTest={setupEvents,setBag:items=>{cart=items;},orders:()=>orders,bag:()=>cart};\n  const init = async()`);
vm.runInContext(source,context);context.submitTest.setupEvents();context.submitTest.setBag([{productId:'cloud-oversized',size:'M',quantity:1,price:499}]);
const event={currentTarget:form,preventDefault(){}};
const submission=form.submit(event);
// The browser clears currentTarget immediately after dispatch, before awaited work resumes.
event.currentTarget=null;await submission;
assert.equal(context.submitTest.orders().length,1);assert.equal(context.submitTest.orders()[0].email,'');assert.equal(context.submitTest.bag().length,0);assert.equal(get('#order-success').hidden,false);assert.match(get('#order-success').innerHTML,/Your order was sent/);
clearTimeout(get('#gw-toast').timer);
console.log('PASS: real submit-handler lifecycle survives async login check, saves mobile-only order, clears bag and shows confirmation');
