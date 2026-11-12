import assert from 'node:assert/strict';

const endpoint = new URL(process.env.GW_TEST_BASE || 'http://127.0.0.1:8766/api/store.php');
assert.equal(endpoint.hostname, '127.0.0.1', 'Use an isolated local store with disposable data.');
const password = 'LocalVerificationOnly123';
const client = () => {
  let cookie = '';
  return async (action, payload) => {
    const url = new URL(endpoint);
    if (!payload) url.searchParams.set('action', action);
    const response = await fetch(url, {
      method: payload ? 'POST' : 'GET',
      headers: {...(cookie && {Cookie:cookie}), ...(payload && {'Content-Type':'application/json'})},
      body: payload && JSON.stringify({action, ...payload}),
    });
    const updated = response.headers.get('set-cookie');
    if (updated) cookie = updated.split(';')[0];
    return {status:response.status, ...await response.json()};
  };
};
const admin = client(), shopper = client(), other = client(), staff = client(), guest = client();
const stamp = Date.now().toString(36);
const email = `local-shopper-${stamp}@example.test`;
const contact = {name:'Local QA Shopper', password};

assert.equal((await admin('login', {identifier:'local-owner@example.test', password})).status, 200);
assert.equal((await guest('register', contact)).status, 422);
assert.equal((await guest('register', {...contact, phone:'abc9876543210'})).status, 422);
const registered = await shopper('register', {...contact, email, role:'admin'});
assert.equal(registered.status, 201, registered.error);
assert.equal(registered.user.role, 'shopper');
assert.equal(registered.user.phone, '');
assert.equal((await other('register', {...contact, email:email.toUpperCase()})).status, 409);
assert.equal((await shopper('logout', {})).status, 200);
assert.equal((await shopper('login', {identifier:email.toUpperCase(), password})).user.id, registered.user.id);
const otherEmail = `local-other-${stamp}@example.test`;
const phone = String(8000000000 + (Date.now() % 999999999));
assert.equal((await other('register', {...contact, email:otherEmail, phone})).status, 201);
assert.equal((await other('login', {identifier:`+91 ${phone}`, password})).user.email, otherEmail);
const legacy = await guest('register', {...contact, email:'legacy-contact@example.test'});
if (legacy.status === 409) await guest('login', {identifier:'legacy-contact@example.test', password});
assert.ok(!(await guest('my-orders')).orders.some(order => order.id === 'QA-LEGACY'));
assert.equal((await guest('order-request', {id:'QA-LEGACY', type:'return', reason:'Access test'})).status, 404);
await guest('logout', {});
const staffEmail = `local-staff-${stamp}@example.test`;
assert.equal((await admin('user-create', {...contact, email:staffEmail, role:'staff'})).status, 201);
assert.equal((await staff('login', {identifier:staffEmail, password})).status, 200);
console.log('PASS: registration, both login identifiers, duplicate prevention and legacy order privacy');

const delivery = {customerName:'Local QA Shopper', phone, address:'Isolated QA address', city:'Sahjanwa', state:'Uttar Pradesh', pincode:'273209', payment:'cod'};
const tee = (await guest('catalog')).products.find(product => product.id === 'cloud-oversized');
const checkout = {...delivery, items:[{productId:tee.id, size:tee.sizes[0], quantity:1, unitPrice:tee.price}]};
async function createOrder(values = {}) {
  const result = await shopper('create', {...checkout, ...values});
  assert.equal(result.status, 201, result.error);
  return result.order;
}
const request = (id, type, reason='QA reason') => shopper('order-request', {id, type, reason});
const latest = order => order.serviceRequests.at(-1);
const review = (actor, id, requestId, decision, note='') => actor('review-order-request', {id, requestId, decision, note});
const myOrder = async id => (await shopper('my-orders')).orders.find(order => order.id === id);
const cancel = await createOrder();
assert.equal(cancel.accountId, registered.user.id);
assert.equal((await guest('order-request', {id:cancel.id,type:'cancel',reason:'Guest test'})).status, 401);
assert.equal((await other('order-request', {id:cancel.id,type:'cancel',reason:'Ownership test'})).status, 404);
assert.equal((await request(cancel.id, 'return')).status, 409);
assert.equal((await request(cancel.id, 'cancel', ' ')).status, 422);
const cancelResult = await request(cancel.id, 'cancel');
assert.equal(cancelResult.status, 201, cancelResult.error);
const cancelRequest = latest(cancelResult.order);
assert.equal((await request(cancel.id, 'cancel')).status, 409);
assert.equal((await review(shopper, cancel.id, cancelRequest.id, 'approve')).status, 401);
assert.equal((await admin('status', {id:cancel.id,status:'Shipped'})).status, 409);
const cancelled = await review(admin, cancel.id, cancelRequest.id, 'approve', 'Cancellation confirmed.');
assert.equal(cancelled.order.status, 'Cancelled');
assert.equal(latest(await myOrder(cancel.id)).status, 'Completed');
assert.equal((await review(admin, cancel.id, cancelRequest.id, 'approve')).status, 409);
assert.equal((await admin('status', {id:cancel.id,status:'Shipped'})).status, 409);
console.log('PASS: customer cancellation, ownership, duplicate protection and dispatch hold');

for (const type of ['return', 'replacement']) {
  const order = await createOrder();
  await admin('status', {id:order.id,status:'Shipped'});
  assert.equal((await request(order.id, 'cancel')).status, 409);
  await admin('status', {id:order.id,status:'Delivered'});
  const first = latest((await request(order.id,type)).order);
  assert.equal((await review(staff,order.id,first.id,'decline')).status, 422);
  assert.equal((await review(staff,order.id,first.id,'decline','Please add pickup details.')).status, 200);
  assert.equal(latest(await myOrder(order.id)).note, 'Please add pickup details.');
  const second = latest((await request(order.id,type,'Pickup details added.')).order);
  assert.equal((await review(staff,order.id,first.id,'approve')).status, 409);
  assert.equal((await review(staff,order.id,second.id,'complete')).status, 409);
  assert.equal(latest((await review(staff,order.id,second.id,'approve','Pickup arranged.')).order).status, 'Approved');
  assert.equal(latest(await myOrder(order.id)).status, 'Approved');
  assert.equal((await review(staff,order.id,second.id,'complete','Completed by store.')).status, 200);
  const final = await myOrder(order.id);
  assert.equal(final.status, type === 'return' ? 'Returned' : 'Delivered');
  assert.deepEqual(latest(final).history.map(entry=>entry.status), ['Pending','Approved','Completed']);
}
const demo = await createOrder({payment:'online-demo',demoOutcome:'success',demoMethod:'upi',checkoutAttemptId:`qa-demo-attempt-${stamp}`});
assert.equal((await request(demo.id,'cancel')).status, 409);
assert.ok(!(await other('my-orders')).orders.some(order => order.id === cancel.id));
console.log('PASS: delivered return and replacement, staff review, customer updates and demo exclusion');
