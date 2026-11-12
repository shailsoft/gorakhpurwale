import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
const values=new Map();
const context=vm.createContext({crypto:webcrypto,TextEncoder,btoa,atob,location:{protocol:'file:',hostname:''},localStorage:{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)},document:{readyState:'loading',addEventListener:()=>{}}});
let source=fs.readFileSync('wp-content/themes/gw-store/assets/js/store.js','utf8');
source=source.replace('  const init = async()', '  globalThis.contactsTest={localAuth,normalizeMobile,currentAccount};\n  const init = async()');
vm.runInContext(source,context);
const {localAuth,normalizeMobile,currentAccount}=context.contactsTest;
assert.equal(normalizeMobile('+91 98765 43210'),'9876543210');
const base={name:'Test Shopper',password:'test-only-password'};
await assert.rejects(localAuth('register',base),/Enter an email address or mobile number/);
await assert.rejects(localAuth('register',{...base,phone:'123'}),/valid 10-digit/);
await assert.rejects(localAuth('register',{...base,email:'invalid-email'}),/valid email/);
const emailOnly=(await localAuth('register',{...base,email:'EMAIL-ONLY@example.test',role:'admin'})).user;
assert.equal(emailOnly.email,'email-only@example.test');
assert.equal(emailOnly.phone,'');
assert.equal(emailOnly.role,'shopper');
// Keep existing email accounts usable after the registration change.
const salt=webcrypto.getRandomValues(new Uint8Array(16));
const key=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(base.password),'PBKDF2',false,['deriveBits']);
const hash=await webcrypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:100000,hash:'SHA-256'},key,256);
const emailUser={id:'legacy-admin',name:'Existing Admin',email:'shopper@example.test',role:'admin',salt:Buffer.from(salt).toString('base64'),hash:Buffer.from(hash).toString('base64')};
const accountKey='gw-demo-accounts-v2';
values.set(accountKey,JSON.stringify([emailUser,emailOnly]));
await localAuth('login',{identifier:emailOnly.email,password:base.password});
assert.equal(currentAccount().id,emailOnly.id);
const mobileUser=(await localAuth('register',{...base,phone:'+91 98765 43210'})).user;
assert.equal(mobileUser.email,'');assert.equal(mobileUser.phone,'9876543210');
await localAuth('register',{...base,phone:'8765432109'});
assert.notEqual(mobileUser.id,currentAccount().id);
await localAuth('login',{identifier:'9876543210',password:base.password});assert.equal(currentAccount().id,mobileUser.id);
await localAuth('login',{identifier:'+91 98765 43210',password:base.password});assert.equal(currentAccount().id,mobileUser.id);
await localAuth('login',{identifier:'SHOPPER@example.test',password:base.password});assert.equal(currentAccount().id,emailUser.id);
await assert.rejects(localAuth('register',{...base,phone:'9876543210'}),/already registered/);
await assert.rejects(localAuth('register',{...base,email:'shopper@example.test'}),/already registered/);
await assert.rejects(localAuth('login',{identifier:'9876543210',password:'incorrect'}),/Incorrect/);
await localAuth('login',{identifier:mobileUser.phone,password:base.password});
await assert.rejects(localAuth('user-create',{...base,email:'staff@example.test',role:'admin'}),/Administrator required/);
const both=(await localAuth('register',{...base,email:'both@example.test',phone:'7654321098'})).user;
assert.equal(both.phone,'7654321098');assert.equal(both.email,'both@example.test');
for(const identifier of [both.email,both.phone]){
 await localAuth('login',{identifier,password:base.password});
 assert.equal(currentAccount().id,both.id);
}
await localAuth('login',{identifier:emailUser.email,password:base.password});
const staff=(await localAuth('user-create',{...base,email:'newstaff@example.test',role:'staff'})).user;
assert.equal(staff.email,'newstaff@example.test');assert.equal(staff.role,'staff');
for(const file of ['preview/index.html','deployment/static/index.html']){
 const html=fs.readFileSync(file,'utf8');
 assert.ok(!html.includes('Self-registration always creates a shopper account.'));
 const register=html.match(/<form id="register-form"[\s\S]*?<\/form>/)[0];
 for(const name of ['phone','email']) {
  const field=register.match(new RegExp(`<input name="${name}"[^>]*>`))[0];
  assert.doesNotMatch(field,/required/);
 }
 const checkout=html.match(/<form id="checkout-form"[\s\S]*?<\/form>/)[0];
 assert.match(checkout,/Email address \(optional\)/);assert.doesNotMatch(checkout,/name="email"[^>]*required/);
}
console.log('PASS: email-only, mobile-only and combined registration and login, duplicate detection, shopper role, legacy email login and optional checkout email');
