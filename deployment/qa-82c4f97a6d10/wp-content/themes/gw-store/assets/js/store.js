(() => {
  'use strict';
  const defaultProducts = [
    {id:'midnight-essential',name:'Midnight Essential Tee',category:'Essential',audiences:['Men','Women','GenZ'],tags:'regular minimal basics',price:349,mrp:449,colour:'Black',shirt:'#171a20',print:'#f8f5ef',motif:'',badge:'Bestseller',sizes:['S','M','L','XL','XXL'],art:['#d8d3cc','#f6f3ef'],description:'A clean regular-fit cotton tee built for everyday rotation.'},
    {id:'cloud-oversized',name:'Cloud Oversized Tee',category:'Oversized',audiences:['Men','Women','GenZ'],tags:'roomy relaxed soft neutral street',price:499,mrp:649,colour:'White',shirt:'#eee9df',print:'#101522',motif:'type',badge:'Popular',sizes:['S','M','L','XL'],art:['#d9e0e5','#ffffff'],description:'Relaxed shoulders, a substantial hand feel and an easy off-duty shape.'},
    {id:'dawn-lines',name:'Dawn Lines Graphic Tee',category:'Graphic',audiences:['Women','Kids','GenZ'],tags:'bright bold teen colour',price:449,mrp:599,colour:'Coral',shirt:'#ff5c45',print:'#fff5e9',motif:'sun',badge:'New',sizes:['M','L','XL','XXL'],art:['#ffd8cf','#f5eee8'],description:'A warm graphic tee with a crisp, original sun mark.'},
    {id:'sage-studio',name:'Sage Studio Tee',category:'Essential',audiences:['Women','GenZ'],tags:'soft neutral limited minimal',price:529,mrp:649,colour:'Sage',shirt:'#82916e',print:'#f5eee4',motif:'type',badge:'Limited',sizes:['S','M','L','XL'],art:['#dfe5d8','#f8f4ee'],description:'Muted sage, smooth cotton and a subtle studio graphic.'},
    {id:'deep-blue-wave',name:'Deep Blue Wave Tee',category:'Graphic',audiences:['Men','GenZ'],tags:'bold street teen roomy',price:479,mrp:599,colour:'Blue',shirt:'#223954',print:'#ff6b52',motif:'wave',badge:'New',sizes:['S','M','L','XL','XXL'],art:['#cad5dd','#f6f8f8'],description:'A clean wave mark on a deep blue base with relaxed everyday proportions.'},
    {id:'offwhite-heavy',name:'Off-White Heavyweight Tee',category:'Oversized',audiences:['Men','Women'],tags:'roomy soft neutral premium',price:599,mrp:749,colour:'White',shirt:'#f2eee5',print:'#172335',motif:'',badge:'Premium',sizes:['M','L','XL','XXL'],art:['#e4ded4','#ffffff'],description:'A heavier oversized blank with dropped shoulders and a structured drape.'},
    {id:'black-orbit',name:'Black Orbit Graphic Tee',category:'Graphic',audiences:['Men','GenZ'],tags:'bold street limited teen',price:549,mrp:699,colour:'Black',shirt:'#14171d',print:'#ff725c',motif:'sun',badge:'Bestseller',sizes:['S','M','L','XL'],art:['#c8cbd0','#f4f2ee'],description:'A bold orbit graphic on a soft, dark cotton base.'},
    {id:'coral-easy',name:'Coral Easy Tee',category:'Essential',audiences:['Women','Kids'],tags:'bright colour junior regular',price:399,mrp:499,colour:'Coral',shirt:'#ef715f',print:'#fff',motif:'',badge:'Everyday',sizes:['S','M','L','XL','XXL'],art:['#f4d4cc','#fff7f2'],description:'A clean coral staple with an easy regular fit.'},
    {id:'navy-roomy',name:'Navy Roomy Tee',category:'Oversized',audiences:['Men','GenZ'],tags:'roomy relaxed street',price:579,mrp:699,colour:'Blue',shirt:'#1d3049',print:'#f5efe7',motif:'type',badge:'Popular',sizes:['S','M','L','XL','XXL'],art:['#d1d9df','#fafafa'],description:'Room through the body, balanced sleeves and a rich navy finish.'},
    {id:'white-signal',name:'White Signal Graphic Tee',category:'Graphic',audiences:['Women','Kids'],tags:'junior minimal soft bright',price:429,mrp:549,colour:'White',shirt:'#f7f4ee',print:'#ff5c45',motif:'wave',badge:'Fresh',sizes:['S','M','L','XL'],art:['#e5e1dc','#fff'],description:'A bright base with a minimal coral signal graphic.'},
    {id:'sage-oversized',name:'Sage Oversized Tee',category:'Oversized',audiences:['Men','Women','GenZ'],tags:'roomy limited soft neutral',price:549,mrp:699,colour:'Sage',shirt:'#7d8d72',print:'#f4efe8',motif:'',badge:'New',sizes:['M','L','XL','XXL'],art:['#d8e0d2','#f6f4ef'],description:'A roomy sage blank designed to work across seasons.'},
    {id:'custom-text',name:'Your Words Custom Tee',category:'Custom',audiences:['Men','Women','Kids','GenZ'],tags:'name custom junior teen bold',price:498,mrp:0,colour:'White',shirt:'#f2eee7',print:'#101522',motif:'type',badge:'Custom',sizes:['S','M','L','XL','XXL'],art:['#eadfd4','#fff'],description:'Choose your words, type style, colour and placement in the custom studio.',customizable:true},
    {id:'gift-photo-mug',name:'Personalized Photo Mug',category:'Gift',audiences:['Men','Women','Kids','GenZ'],tags:'cup coffee photo birthday anniversary wedding',price:349,mrp:449,colour:'White',shirt:'#fff',print:'#ff5c45',motif:'type',badge:'Personalize',sizes:['Standard'],art:['#ffe0d8','#fff8f5'],description:'A glossy ceramic mug printed with your photo, logo or message.',customizable:true},
    {id:'gift-led-frame',name:'LED Photo Frame',category:'Gift',audiences:['Men','Women','Kids','GenZ'],tags:'photo frame glass light anniversary wedding',price:899,mrp:1199,colour:'Black',shirt:'#151b28',print:'#fff',motif:'type',badge:'Gift pick',sizes:['8×10','10×12'],art:['#cbd4df','#f7f8fa'],description:'A warm LED photo frame for celebrations and keepsakes.',customizable:true},
    {id:'gift-name-keychain',name:'Custom Name Keychain',category:'Gift',audiences:['Men','Women','Kids','GenZ'],tags:'bike car keychain name wood acrylic',price:199,mrp:299,colour:'Coral',shirt:'#ff6b52',print:'#fff',motif:'type',badge:'Popular',sizes:['Bike','Car'],art:['#ffd7ce','#fff'],description:'Personalized keychain with a name and vehicle-style option.',customizable:true},
    {id:'gift-bottle',name:'Printed Steel Bottle',category:'Gift',audiences:['Men','Women','Kids','GenZ'],tags:'water bottle logo name sports school',price:549,mrp:699,colour:'Blue',shirt:'#223954',print:'#fff',motif:'wave',badge:'New',sizes:['500 ml','750 ml'],art:['#d2dde5','#fff'],description:'Reusable steel bottle printed with a name, photo or logo.',customizable:true},
    {id:'beauty-face-wash',name:'Gentle Daily Face Wash',category:'Beauty',audiences:['Men','Women','GenZ'],tags:'skincare face wash grooming',price:299,mrp:349,colour:'Sage',shirt:'#8ca07d',print:'#fff',motif:'',badge:'Daily care',sizes:['100 ml'],art:['#dce8d5','#fff'],description:'A gentle everyday cleanser for a fresh, comfortable finish.'},
    {id:'beauty-moisturizer',name:'Hydra Glow Moisturizer',category:'Beauty',audiences:['Women','GenZ'],tags:'skincare moisturizer face cream',price:449,mrp:549,colour:'White',shirt:'#f4eee7',print:'#ff5c45',motif:'',badge:'Bestseller',sizes:['50 g'],art:['#f2ded9','#fff'],description:'Lightweight daily hydration with a non-greasy feel.'},
    {id:'beauty-lip-kit',name:'Everyday Lip Care Kit',category:'Beauty',audiences:['Women','GenZ'],tags:'lipstick lip balm makeup cosmetics kit',price:599,mrp:749,colour:'Coral',shirt:'#c94f58',print:'#fff',motif:'type',badge:'Kit',sizes:['3 piece'],art:['#f1cdd0','#fff'],description:'A coordinated lip colour and care set for everyday looks.'},
    {id:'beauty-hair-serum',name:'Smooth Finish Hair Serum',category:'Beauty',audiences:['Men','Women','GenZ'],tags:'haircare serum oil shampoo conditioner',price:399,mrp:499,colour:'Blue',shirt:'#416481',print:'#fff',motif:'wave',badge:'New',sizes:['100 ml'],art:['#d2e1e9','#fff'],description:'A lightweight finishing serum for shine and manageability.'},
    {id:'beauty-perfume',name:'Fresh Day Eau de Parfum',category:'Beauty',audiences:['Men','Women','GenZ'],tags:'perfume deodorant fragrance grooming',price:799,mrp:999,colour:'Black',shirt:'#202530',print:'#fff',motif:'type',badge:'Premium',sizes:['50 ml'],art:['#d1d2d6','#fff'],description:'A bright modern fragrance designed for everyday wear.'}
  ];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = (value) => `₹${Number(value).toLocaleString('en-IN')}`;
  const safe = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
  const storageKey = 'qa-82c4f97a6d10-cart-v2';
  const accountKey = 'qa-82c4f97a6d10-accounts-v2';
  const sessionKey = 'qa-82c4f97a6d10-session-v1';
  const customerResetKey = 'qa-82c4f97a6d10-reset-2026-11-07-v1';
  const productStorageKey = 'qa-82c4f97a6d10-products-v1';
  const orderStorageKey = 'qa-82c4f97a6d10-orders-v1';
  const defaultAdmin = {name:'GW Store Admin',email:'admin@gorakhpurwale.com',role:'admin',salt:'R1dTdG9yZUFkbWluMjAyNiE=',hash:'lE7x8QiFVIJwAAJCw6uiore0MdrCH/XVmoMxLLRT0c0=',system:true};
  const ordersApi = new URL('api/store.php',location.href).pathname;
  const sharedOrdersEnabled = /^https?:$/.test(location.protocol) && !['127.0.0.1','localhost'].includes(location.hostname);
  let products = defaultProducts.map((product,index) => ({...product,stock:18+(index*3)%27,status:'active',images:[]}));
  try { const saved=JSON.parse(localStorage.getItem(productStorageKey)||'null'); if(Array.isArray(saved)&&saved.length) products=saved; } catch (_) {}
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch (_) { cart = []; }
  let orders = [];
  try { const savedOrders=JSON.parse(localStorage.getItem(orderStorageKey)||'[]');orders=Array.isArray(savedOrders)?savedOrders:[]; } catch (_) { orders=[]; }
  let state = {category:'All',audience:'All',search:'',sizes:[],colours:[],maxPrice:2999,sort:'featured'};
  let lastFocus = null;
  let editorImages = [];
  let productCustomImage = '';
  let serverUser = null;
  let customerOrderSnapshot = null;
  let customerOrderRefresh = null;
  let customerOrderGeneration = 0;
  let checkoutAfterLogin = false;
  let demoPaymentOrder = null;
  let demoPaymentBusy = false;
  let demoPaymentGeneration = 0;
  let deliverySettings = {revision:0,areas:[]};
  let deliveryQuote = null;
  let deliveryRequest = 0;
  let productDeliveryRequest = 0;
  let selectedDeliveryPin = '';
  try{selectedDeliveryPin=localStorage.getItem('qa-82c4f97a6d10-pin')||'';}catch(_){}

  const toBase64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
  const fromBase64 = (value) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
  async function passwordHash(password, salt) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:100000,hash:'SHA-256'}, key, 256);
    return toBase64(bits);
  }
  function currentAccount() {
    if(sharedOrdersEnabled)return serverUser;
    try {
      let accounts = JSON.parse(localStorage.getItem(accountKey) || '[]');
      if (!Array.isArray(accounts)) accounts = [accounts].filter(Boolean);
      const session = localStorage.getItem(sessionKey);
      return accounts.find((account) => (account.id||account.email||account.phone) === session) || null;
    } catch (_) { return null; }
  }

  function allAccounts() { try { const value=JSON.parse(localStorage.getItem(accountKey)||'[]'); return Array.isArray(value)?value:[]; } catch(_){ return []; } }
  function saveAccounts(accounts) { localStorage.setItem(accountKey,JSON.stringify(accounts)); }
  function ensureDefaultAdmin() {
    const accounts=allAccounts();
    const index=accounts.findIndex((account)=>account.email===defaultAdmin.email);
    if(index<0) accounts.unshift({...defaultAdmin});
    else accounts[index]={...accounts[index],...defaultAdmin};
    saveAccounts(accounts);
  }
  function removeExistingCustomerAccounts() {
    if(localStorage.getItem(customerResetKey)==='done')return;
    const accounts=allAccounts();
    const session=localStorage.getItem(sessionKey);
    const signedIn=accounts.find(account=>account.email===session);
    saveAccounts(accounts.filter(account=>account.role==='admin'||account.role==='staff'));
    if(signedIn?.role==='shopper')localStorage.removeItem(sessionKey);
    localStorage.setItem(customerResetKey,'done');
  }
  function persistProducts() { try { localStorage.setItem(productStorageKey,JSON.stringify(products)); return true; } catch (_) { toast('Browser storage is full. Remove an image and try again.'); return false; } }
  function persistOrders() { try { localStorage.setItem(orderStorageKey,JSON.stringify(orders)); return true; } catch (_) { toast('Could not save the order in this browser.'); return false; } }
  async function apiPost(payload) {
    const response=await fetch(ordersApi,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await response.json().catch(()=>({ok:false,error:'The order service returned an invalid response.'}));
    if(!response.ok||!data.ok){const error=new Error(data.error||'The order service is unavailable.');error.status=response.status;error.code=data.code;throw error;}
    return data;
  }
  async function apiGet(action) {
    const response=await fetch(`${ordersApi}?action=${action}`,{credentials:'same-origin',cache:'no-store'});
    const data=await response.json();
    if(!response.ok||!data.ok){const error=new Error(data.error||'Store service unavailable.');error.status=response.status;throw error;}
    return data;
  }
  async function syncServerSession(){if(!sharedOrdersEnabled)return;const data=await apiGet('session');serverUser=data.user;localStorage.removeItem(sessionKey);if(serverUser?.role==='admin'){const result=await apiGet('users');saveAccounts(result.users);}else saveAccounts(serverUser?[serverUser]:[]);}
  const normalizeMobile=value=>String(value||'').replace(/\D/g,'').replace(/^91(?=\d{10}$)/,'');
  async function localAuth(action,values){
    const accounts=allAccounts();const email=action==='register'?'':String(values.email||'').trim().toLowerCase();const phone=normalizeMobile(values.phone);
    if(action==='login'){
      const identifier=String(values.identifier||values.email||'').trim().toLowerCase();const mobile=normalizeMobile(identifier);
      const user=accounts.find(user=>(user.email&&user.email===identifier)||(user.phone&&user.phone===mobile));
      if(!user||await passwordHash(values.password,fromBase64(user.salt))!==user.hash)throw new Error('Incorrect email, mobile number or password.');
      localStorage.setItem(sessionKey,user.id||user.email||user.phone);return {user};
    }
    if(action==='user-create'&&currentAccount()?.role!=='admin')throw new Error('Administrator required.');
    if(action==='register'&&!/^[6-9]\d{9}$/.test(phone))throw new Error('Enter a valid 10-digit Indian mobile number.');
    if(!email&&!phone)throw new Error('Enter an email address or mobile number.');
    if(phone&&!/^[6-9]\d{9}$/.test(phone))throw new Error('Enter a valid 10-digit Indian mobile number.');
    if(accounts.some(user=>(email&&user.email===email)||(phone&&user.phone===phone)))throw new Error('Email or mobile number already registered.');
    const salt=crypto.getRandomValues(new Uint8Array(16));const user={id:crypto.randomUUID(),name:values.name.trim(),email,phone,role:action==='register'?'shopper':values.role,salt:toBase64(salt),hash:await passwordHash(values.password,salt)};
    accounts.push(user);saveAccounts(accounts);if(action==='register')localStorage.setItem(sessionKey,user.id);return {user};
  }
  async function serverAuthSubmit(event,action){
    event.preventDefault();event.stopImmediatePropagation();const form=event.currentTarget;if(!form.reportValidity())return;
    const values=Object.fromEntries(new FormData(form));if(action==='register'&&values.password!==values.confirm){authMessage(form,'Passwords do not match.');return;}
    if(action==='register'&&!/^[6-9]\d{9}$/.test(normalizeMobile(values.phone))){authMessage(form,'Enter a valid 10-digit Indian mobile number.');return;}
    if(action==='user-create'&&!String(values.email||'').trim()&&!String(values.phone||'').trim()){authMessage(form,'Enter an email address or mobile number.');return;}
    const button=$('button[type="submit"]',form);button.disabled=true;
    try{const result=sharedOrdersEnabled?await apiPost({action,...values}):await localAuth(action,values);if(action==='user-create'){if(sharedOrdersEnabled){const data=await apiGet('users');saveAccounts(data.users);}renderAdmin();authMessage(form,'User created.','success');}else{resetCustomerOrders();serverUser=result.user;await syncServerSession();renderAuth();refreshCustomerOrderStatuses();toast('Logged in successfully');resumeCheckoutAfterAuth();}form.reset();}catch(error){authMessage(form,error.message);}finally{button.disabled=false;}
  }
  async function loginSharedOwner(email,password) { if(!sharedOrdersEnabled||email!==defaultAdmin.email)return;await apiPost({action:'login',email,password}); }
  async function fetchSharedOrders() {
    const account=currentAccount();if(!sharedOrdersEnabled||!['admin','staff'].includes(account?.role))return;
    const response=await fetch(`${ordersApi}?action=list`,{credentials:'same-origin'});const data=await response.json().catch(()=>({ok:false,error:'Invalid order response.'}));
    if(!response.ok||!data.ok)throw new Error(data.error||'Could not load shared orders.');orders=Array.isArray(data.orders)?data.orders:[];persistOrders();
  }
  async function saveSharedOrder(order) { if(!sharedOrdersEnabled)return order;const data=await apiPost({action:'create',...order});return data.order; }
  async function updateSharedOrder(id,status) { if(!sharedOrdersEnabled)return null;const data=await apiPost({action:'status',id,status});return data.order; }
  async function updateSharedTracking(id,details){
    if(!sharedOrdersEnabled){const order=orders.find(order=>order.id===id);return {...order,...details,trackingUpdatedAt:new Date().toISOString()};}
    const data=await apiPost({action:'tracking',id,...details});return data.order;
  }
  function safeTrackingUrl(value){try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:'';}catch(_){return '';}}
  function trackingMarkup(order){
    if(order.isDemo)return '<section class="gw-order-tracking gw-demo-notice"><h4>Demo order · Do not dispatch</h4><p>No real payment was collected and no delivery will be arranged. Your bag is saved so you can place a real cash-on-delivery order.</p></section>';
    if(!order.courierName||!order.trackingNumber)return '<section class="gw-order-tracking"><h4>Track delivery</h4><p>Courier and tracking details will appear here when the store adds them.</p></section>';
    const url=safeTrackingUrl(order.trackingUrl);
    return `<section class="gw-order-tracking"><h4>Track delivery</h4><dl><div><dt>Courier</dt><dd>${safe(order.courierName)}</dd></div><div><dt>Tracking number</dt><dd>${safe(order.trackingNumber)}</dd></div><div><dt>Delivery status</dt><dd>${safe(order.status)}</dd></div></dl>${url?`<a class="gw-tracking-link" href="${safe(url)}" target="_blank" rel="noopener noreferrer">Track on courier website ↗</a>`:''}${order.trackingUpdatedAt?`<small>Tracking updated ${orderDate(order.trackingUpdatedAt)}</small>`:''}</section>`;
  }
  function trackingEditorMarkup(order){if(order.isDemo)return '<section class="gw-order-tracking gw-demo-notice"><h4>Demo payment · Do not dispatch</h4><p>₹0 collected. This is a payment simulation. Stock has not been reserved and no real order should be fulfilled.</p></section>';return `<form class="gw-tracking-form" data-tracking-order="${safe(order.id)}"><h4>Courier tracking</h4><div class="gw-field-grid"><label>Courier name<input name="courierName" maxlength="100" value="${safe(order.courierName||'')}" placeholder="Courier or delivery partner"></label><label>Tracking number<input name="trackingNumber" maxlength="100" value="${safe(order.trackingNumber||'')}" placeholder="Shipment / AWB number"></label></div><label>Courier tracking link (optional)<input name="trackingUrl" type="url" maxlength="2000" value="${safe(order.trackingUrl||'')}" placeholder="https://…"></label><small>Update the order status above as delivery progresses. Courier updates are not imported automatically.</small><button type="submit">Save tracking</button><p class="gw-auth-message" aria-live="polite"></p></form>`;}
  const accountIdentity=account=>account?.id||account?.email||account?.phone||'';
  function resetCustomerOrders(){customerOrderGeneration++;customerOrderSnapshot=null;customerOrderRefresh=null;clearInterval(showProfileOrders.timer);}
  function customerOrdersNotice(message,state=''){
    const node=$('#customer-orders-sync');if(node){node.textContent=message;node.dataset.state=state;}
  }
  async function refreshCustomerOrderStatuses() {
    const identity=accountIdentity(currentAccount());if(!identity)return;
    if(!sharedOrdersEnabled){try{orders=JSON.parse(localStorage.getItem(orderStorageKey)||'[]');renderCustomerOrders();customerOrdersNotice('Orders updated from this browser.');}catch(_){customerOrdersNotice('Could not refresh orders. Please try again.','error');}return;}
    if(customerOrderRefresh?.identity===identity)return customerOrderRefresh.promise;
    const generation=customerOrderGeneration;
    const request={identity,promise:null};customerOrderRefresh=request;
    customerOrdersNotice('Checking for order updates…');
    $('#refresh-customer-orders')?.setAttribute('aria-busy','true');
    request.promise=(async()=>{
      try{
        const data=await apiGet(`my-orders&_sync=${Date.now()}`);
        if(generation!==customerOrderGeneration||identity!==accountIdentity(currentAccount()))return;
        if(!Array.isArray(data.orders))throw new Error('Invalid order response.');
        // Another tab can change the shared login cookie. Never show that account's orders here.
        if(data.user&&accountIdentity(data.user)!==identity){resetCustomerOrders();serverUser=data.user;renderAuth();customerOrdersNotice('Your signed-in account changed. Open My Orders again.','error');return;}
        const changed=customerOrderSnapshot?.identity!==identity||JSON.stringify(customerOrderSnapshot.orders)!==JSON.stringify(data.orders);
        customerOrderSnapshot={identity,orders:data.orders};if(changed)renderCustomerOrders();
        customerOrdersNotice(`Updated ${new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})} · Checks automatically every 5 seconds.`,'success');
      }catch(error){
        if(generation!==customerOrderGeneration||identity!==accountIdentity(currentAccount()))return;
        if(error.status===401){resetCustomerOrders();serverUser=null;renderAuth();setAuthTab('login');authMessage($('#login-form'),'Your session expired. Please log in to view current orders.');return;}
        customerOrdersNotice('Could not refresh orders. Check your connection and tap Refresh.','error');
      }finally{if(customerOrderRefresh===request){customerOrderRefresh=null;$('#refresh-customer-orders')?.setAttribute('aria-busy','false');}}
    })();
    return request.promise;
  }
  function refreshVisibleCustomerOrders(){if(!document.hidden&&!$('#auth-modal')?.hidden&&!$('#profile-orders')?.hidden)refreshCustomerOrderStatuses();}
  async function fetchSharedProducts() {
    if(!sharedOrdersEnabled)return;
    const response=await fetch(`${ordersApi}?action=catalog`,{credentials:'same-origin'});const data=await response.json().catch(()=>({ok:false,error:'Invalid catalog response.'}));
    if(!response.ok||!data.ok)throw new Error(data.error||'Could not load the shared catalog.');
    if(Array.isArray(data.products)){products=data.products;persistProducts();}
  }
  async function saveSharedProducts(product) {
    if(!sharedOrdersEnabled){persistProducts();return;}
    const data=await apiPost({action:'product-save',product});products=Array.isArray(data.products)?data.products:products;persistProducts();
  }

  const persist = () => { try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch (_) {} };
  const productById = (id) => products.find((product) => product.id === id);
  const itemProduct = (item) => productById(item.productId)||{name:'Unavailable product',shirt:'#f2eee7',colour:''};
  const itemPrice = (item) => {
    const base=Number(productById(item.productId)?.price??item.price??0);
    return item.productId==='custom-text'&&item.custom?base+(item.custom.surface==='back'?50:0)+(item.custom.artwork_id?50:0):base;
  };
  const subtotal = () => cart.reduce((sum, item) => sum + itemPrice(item) * item.quantity, 0);
  const shipping = () => deliveryQuote?.eligible && deliveryQuote.subtotal===subtotal() ? deliveryQuote.shipping : (subtotal() === 0 || subtotal() >= 799 ? 0 : 79);

  function deliveryQuoteFor(areas,pin,amount){
    if(!/^[1-9]\d{5}$/.test(pin))return {eligible:false,message:'Enter a valid six-digit PIN code.'};
    const area=areas.find(area=>area.active&&area.pincodes.includes(pin));
    if(!area)return {eligible:false,message:areas.some(area=>area.active)?'Delivery is not available in this area yet. Please use another delivery address.':'Delivery areas are being set up. Ordering is temporarily unavailable.'};
    return {eligible:true,pincode:pin,area:area.name,city:area.city,state:area.state,eta:area.eta,shipping:amount>0&&area.freeAbove>0&&amount>=area.freeAbove?0:area.fee,freeAbove:area.freeAbove,message:`Delivery available in ${area.name}.`};
  }
  async function getDeliveryQuote(pin,amount){
    if(sharedOrdersEnabled){const data=await apiGet(`delivery-check&pincode=${encodeURIComponent(pin)}&subtotal=${amount}`);return data.quote;}
    try{deliverySettings=JSON.parse(localStorage.getItem('qa-82c4f97a6d10-delivery'))||deliverySettings;}catch(_){}
    return deliveryQuoteFor(deliverySettings.areas,pin,amount);
  }
  function rememberDeliveryPin(pin){selectedDeliveryPin=pin;try{localStorage.setItem('qa-82c4f97a6d10-pin',pin);}catch(_){}const form=$('#checkout-form');if(form&&form.elements.pincode.value!==pin){form.elements.pincode.value=pin;deliveryQuote=null;deliveryRequest++;}}
  function productDeliveryMarkup(product){return `<form id="product-delivery-check" class="gw-product-delivery" data-delivery-product="${safe(product.id)}"><label>Delivery PIN code<input name="pincode" inputmode="numeric" autocomplete="postal-code" pattern="[1-9][0-9]{5}" maxlength="6" value="${safe(selectedDeliveryPin)}" placeholder="Enter six-digit PIN" required></label><button type="submit">Check availability</button><p class="gw-product-delivery-result" role="status" aria-live="polite">Enter your PIN code to check if this product can be delivered.</p></form>`;}
  async function checkProductDelivery(form){
    if(!form.reportValidity())return;const pin=form.elements.pincode.value.trim(),id=form.dataset.deliveryProduct,request=++productDeliveryRequest;
    const result=$('.gw-product-delivery-result',form),button=$('button[type="submit"]',form),add=$('#product-modal-content [data-modal-add]');const product=productById(id);
    rememberDeliveryPin(pin);button.disabled=true;if(add)add.disabled=true;result.textContent='Checking availability…';result.dataset.state='';
    try{const quote=await getDeliveryQuote(pin,product?.price||0);if(request!==productDeliveryRequest||form.elements.pincode.value.trim()!==pin||$('#product-modal-content [data-modal-add]')?.dataset.modalAdd!==id)return;
      const inStock=product?.status!=='draft'&&product?.status!=='inactive'&&Number(product?.stock)>0;
      result.textContent=!quote.eligible?'Delivery is not available in this area. Please try another PIN code.':!inStock?'This product is currently out of stock.':`Available for delivery in ${quote.area}. ${quote.eta} Delivery: ${money(quote.shipping)}.`;
      result.dataset.state=quote.eligible&&inStock?'success':'error';if(add)add.disabled=!quote.eligible||!inStock;
    }catch(_){if(request===productDeliveryRequest){result.textContent='Could not check availability. Please try again.';result.dataset.state='error';if(add)add.disabled=true;}}
    finally{if(request===productDeliveryRequest)button.disabled=false;}
  }
  function validCheckoutDelivery(){return deliveryQuote?.eligible&&deliveryQuote.pincode===$('#checkout-form').elements.pincode.value.trim()&&deliveryQuote.subtotal===subtotal();}
  async function checkCheckoutDelivery(){
    const pin=$('#checkout-form').elements.pincode.value.trim(),amount=subtotal(),request=++deliveryRequest;
    deliveryQuote=null;renderCheckout();const result=$('#checkout-delivery-result');if(result)result.textContent='Checking delivery…';
    try{const quote=await getDeliveryQuote(pin,amount);if(request!==deliveryRequest||pin!==$('#checkout-form').elements.pincode.value.trim()||amount!==subtotal())return false;
      deliveryQuote={...quote,subtotal:amount};if(result){result.textContent=quote.eligible?`${quote.message} ${quote.eta} Delivery: ${money(quote.shipping)}.`:quote.message;result.dataset.state=quote.eligible?'success':'error';}
      if(quote.eligible){const form=$('#checkout-form');if(quote.city)form.elements.city.value=quote.city;if(quote.state){if(![...form.elements.state.options].some(option=>option.value===quote.state))form.elements.state.add(new Option(quote.state,quote.state));form.elements.state.value=quote.state;}}
      renderCheckout();return Boolean(quote.eligible);
    }catch(error){if(request===deliveryRequest){deliveryQuote=null;if(result){result.textContent='Could not check delivery. Please try again.';result.dataset.state='error';}renderCheckout();}return false;}
  }
  async function loadDeliverySettings(){
    if(sharedOrdersEnabled){const data=await apiGet('delivery-settings');deliverySettings=data.settings;}else{try{deliverySettings=JSON.parse(localStorage.getItem('qa-82c4f97a6d10-delivery'))||{revision:0,areas:[]};}catch(_){deliverySettings={revision:0,areas:[]};}}
    renderDeliveryAreas();
  }
  function renderDeliveryAreas(){
    const owner=currentAccount()?.role==='admin',list=$('#delivery-area-list');if(!list)return;
    $('#delivery-area-form').hidden=!owner;$('#delivery-area-count').textContent=`${deliverySettings.areas.filter(area=>area.active).length} enabled areas`;
    list.innerHTML=deliverySettings.areas.length?deliverySettings.areas.map((area,index)=>`<article class="gw-delivery-area"><div><strong>${safe(area.name)}</strong><span class="gw-order-status">${area.active?'Enabled':'Paused'}</span></div><p>${safe([area.city,area.state].filter(Boolean).join(', '))}</p><p class="gw-delivery-pins">${area.pincodes.map(safe).join(', ')}</p><small>${safe(area.eta)} · ${money(area.fee)} delivery${area.freeAbove>0?` · Free over ${money(area.freeAbove)}`:''}</small>${owner?`<div class="gw-delivery-actions"><button type="button" data-edit-delivery="${index}">Edit area</button><button type="button" data-toggle-delivery="${index}">${area.active?'Pause delivery':'Enable delivery'}</button></div>`:''}</article>`).join(''):'<div class="gw-no-orders"><strong>No delivery areas configured.</strong><p>Add the PIN codes you can serve. Orders remain blocked until at least one area is enabled.</p></div>';
  }
  async function saveDeliveryAreas(areas){
    if(currentAccount()?.role!=='admin')throw new Error('Administrator required.');
    if(sharedOrdersEnabled){const data=await apiPost({action:'delivery-save',revision:deliverySettings.revision,areas});deliverySettings=data.settings;}else{deliverySettings={revision:deliverySettings.revision+1,areas};localStorage.setItem('qa-82c4f97a6d10-delivery',JSON.stringify(deliverySettings));}
    deliveryQuote=null;renderDeliveryAreas();
  }

  function setupDeliveryUI(){
    $('.gw-admin-sidebar nav')?.insertAdjacentHTML('beforeend','<button type="button" data-admin-view="delivery">Delivery areas</button>');
    $('.gw-admin-main')?.insertAdjacentHTML('beforeend',`<section id="admin-delivery" hidden><div class="gw-admin-toolbar"><div><h3>Delivery coverage</h3><p>Only the enabled PIN codes below can place orders. Add more areas as your business grows.</p></div><span id="delivery-area-count"></span><button id="reload-delivery" type="button">Refresh areas</button></div><div class="gw-delivery-layout"><div id="delivery-area-list"></div><form id="delivery-area-form" class="gw-admin-user-form"><h3>Add or edit an area</h3><input name="editIndex" type="hidden" value="-1"><label>Area name<input name="areaName" maxlength="100" required placeholder="Your delivery area"></label><label>PIN codes<textarea name="pincodes" rows="3" required placeholder="Six-digit PINs, separated by commas or new lines"></textarea><small>Use exact PIN codes. No ranges or wildcard matching.</small></label><div class="gw-field-grid"><label>City<input name="city" maxlength="100"></label><label>State<input name="state" maxlength="100"></label></div><label>Estimated delivery<input name="eta" maxlength="120" value="Confirmed before dispatch" required></label><div class="gw-field-grid"><label>Delivery fee (₹)<input name="fee" type="number" min="0" max="999999" step="0.01" value="79" required></label><label>Free delivery from (₹)<input name="freeAbove" type="number" min="0" max="999999" step="0.01" value="799" required></label></div><small>Set the free-delivery threshold to 0 to charge the delivery fee on every order.</small><label class="gw-admin-toggle"><input name="enabled" type="checkbox" checked> Enable delivery in this area</label><button class="gw-button" type="submit">Save area</button><button id="clear-delivery-form" type="button">New area</button><p class="gw-auth-message" aria-live="polite"></p></form></div></section>`);
    $('#shop .gw-section-heading')?.insertAdjacentHTML('afterend','<form id="delivery-check-form" class="gw-delivery-check"><label>Check delivery to your area<input name="pincode" type="text" inputmode="numeric" autocomplete="postal-code" pattern="[1-9][0-9]{5}" maxlength="6" placeholder="Enter six-digit PIN" required></label><button class="gw-button" type="submit">Check delivery</button><p id="shop-delivery-result" role="status" aria-live="polite"></p></form>');
    const pin=$('#checkout-form')?.elements.pincode;
    if(pin){pin.pattern='[1-9][0-9]{5}';pin.closest('label').insertAdjacentHTML('afterend','<div class="gw-full gw-delivery-checkout"><button id="check-checkout-delivery" type="button">Check delivery availability</button><p id="checkout-delivery-result" role="status" aria-live="polite">Enter your delivery PIN code to check availability and charges.</p></div>');
      pin.addEventListener('input',()=>{deliveryRequest++;deliveryQuote=null;const result=$('#checkout-delivery-result');result.textContent='Check this PIN code before placing your order.';result.dataset.state='';renderCheckout();clearTimeout(pin.deliveryTimer);if(/^[1-9]\d{5}$/.test(pin.value))pin.deliveryTimer=setTimeout(checkCheckoutDelivery,350);});
      $('#check-checkout-delivery').addEventListener('click',checkCheckoutDelivery);
    }
    $('#delivery-check-form')?.addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const pin=form.elements.pincode.value.trim();rememberDeliveryPin(pin);const button=$('button',form),result=$('#shop-delivery-result');button.disabled=true;result.textContent='Checking…';try{const quote=await getDeliveryQuote(pin,subtotal());result.textContent=quote.eligible?`${quote.message} ${quote.eta}${subtotal()>0?` Delivery: ${money(quote.shipping)}.`:''}`:quote.message;result.dataset.state=quote.eligible?'success':'error';if(quote.eligible)$('#checkout-form').elements.pincode.value=pin;}catch(_){result.textContent='Unable to check delivery. Please try again.';result.dataset.state='error';}finally{button.disabled=false;}});
    $('#reload-delivery')?.addEventListener('click',()=>loadDeliverySettings().catch(error=>toast(error.message)));
    $('#clear-delivery-form')?.addEventListener('click',()=>{$('#delivery-area-form').reset();$('#delivery-area-form').elements.editIndex.value='-1';});
    $('#delivery-area-list')?.addEventListener('click',async event=>{const edit=event.target.closest('[data-edit-delivery]'),toggle=event.target.closest('[data-toggle-delivery]');if(edit){const index=Number(edit.dataset.editDelivery),area=deliverySettings.areas[index],form=$('#delivery-area-form');form.elements.editIndex.value=index;form.elements.areaName.value=area.name;form.elements.pincodes.value=area.pincodes.join(', ');['city','state','eta','fee','freeAbove'].forEach(field=>form.elements[field].value=area[field]);form.elements.enabled.checked=area.active;form.elements.areaName.focus();}if(toggle){toggle.disabled=true;try{const index=Number(toggle.dataset.toggleDelivery);await saveDeliveryAreas(deliverySettings.areas.map((area,i)=>i===index?{...area,active:!area.active}:area));toast('Delivery availability updated');}catch(error){toast(error.message);toggle.disabled=false;}}});
    $('#delivery-area-form')?.addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const index=Number(form.elements.editIndex.value);const pins=form.elements.pincodes.value.split(/[\s,;]+/).filter(Boolean);if(!pins.length||pins.some(pin=>!/^[1-9]\d{5}$/.test(pin))){authMessage(form,'Enter complete six-digit PIN codes.');return;}const otherPins=deliverySettings.areas.flatMap((area,i)=>i===index?[]:area.pincodes);if(new Set(pins).size!==pins.length||pins.some(pin=>otherPins.includes(pin))){authMessage(form,'Each PIN code can belong to only one area.');return;}const area={name:form.elements.areaName.value.trim(),pincodes:pins,city:form.elements.city.value.trim(),state:form.elements.state.value.trim(),eta:form.elements.eta.value.trim(),fee:Number(form.elements.fee.value),freeAbove:Number(form.elements.freeAbove.value),active:form.elements.enabled.checked};const areas=deliverySettings.areas.map(area=>({...area}));if(index<0)areas.push(area);else areas[index]=area;const button=$('button[type="submit"]',form);button.disabled=true;try{await saveDeliveryAreas(areas);form.reset();form.elements.editIndex.value='-1';authMessage(form,'Delivery area saved.','success');}catch(error){authMessage(form,error.message);}finally{button.disabled=false;}});
  }

  function shirtMarkup(product, compact = false) {
    const image=(product.images||[]).find((value)=>/^data:image\/(?:png|jpeg|webp);base64,/.test(value));
    return `<div class="gw-product-art${image?' has-photo':''}" style="--art-a:${product.art?.[0] || '#eee8df'};--art-b:${product.art?.[1] || '#fff'}">${image?`<img class="gw-real-product-image" src="${image}" alt="${safe(product.name)}">`:`<div class="gw-shirt-shape" data-motif="${safe(product.motif || '')}" style="--shirt:${product.shirt};--print:${product.print || '#fff'}"></div>`}${compact ? '' : `<span class="gw-card-badge">${safe(product.badge||'New')}</span>`}</div>`;
  }

  function renderProducts() {
    const grid = $('#product-grid');
    if (!grid) return;
    const query = state.search.toLowerCase().trim();
    let visible = products.filter((product) => {
      const category = state.category === 'All' || product.category === state.category;
      const audience = state.audience === 'All' || product.audiences.includes(state.audience);
      const search = !query || `${product.name} ${product.category} ${product.colour} ${product.tags}`.toLowerCase().includes(query);
      const sizes = !state.sizes.length || state.sizes.some((size) => product.sizes.includes(size));
      const colours = !state.colours.length || state.colours.includes(product.colour);
      return (product.status||'active') === 'active' && category && audience && search && sizes && colours && product.price <= state.maxPrice;
    });
    if (state.sort === 'price-low') visible.sort((a,b) => a.price-b.price);
    if (state.sort === 'price-high') visible.sort((a,b) => b.price-a.price);
    if (state.sort === 'newest') visible.sort((a,b) => Number(b.badge === 'New' || b.badge === 'Fresh') - Number(a.badge === 'New' || a.badge === 'Fresh'));
    grid.innerHTML = visible.map((product) => `<article class="gw-product-card">${shirtMarkup(product)}<div class="gw-card-body"><span class="gw-card-meta">${safe(product.category)} · ${safe(product.colour)}</span><h3>${safe(product.name)}</h3><div class="gw-card-price"><strong>${money(product.price)}</strong>${product.mrp ? `<del>${money(product.mrp)}</del><span>${Math.round((1-product.price/product.mrp)*100)}% off</span>` : ''}</div><div class="gw-card-actions"><button type="button" data-add="${product.id}">${product.category === 'Custom' ? 'Customize' : 'Add to bag'}</button><button class="gw-quick-view" type="button" data-view="${product.id}" aria-label="View ${safe(product.name)}">＋</button></div></div></article>`).join('');
    $('.gw-result-count').textContent = `${visible.length} style${visible.length === 1 ? '' : 's'}`;
    $('#empty-products').hidden = visible.length > 0;
  }

  function resetFilters() {
    state = {...state,category:'All',audience:'All',search:'',sizes:[],colours:[],maxPrice:2999,sort:'featured'};
    $('#product-search').value = '';
    $('#price-range').value = '2999'; $('#price-output').textContent = '₹2,999'; $('#product-sort').value = 'featured';
    $$('.gw-filter-panel input[type="checkbox"]').forEach((input) => { input.checked = false; });
    $$('.gw-filter-chips button').forEach((button) => button.classList.toggle('is-active', button.dataset.category === 'All'));
    renderProducts();
  }

  function toast(message) {
    const node = $('#gw-toast'); node.textContent = message; node.classList.add('is-visible');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove('is-visible'), 2200);
  }

  function addItem(productId, size = 'M', custom = null) {
    const product = productById(productId);
    if (!product) return;
    const reserved=cart.filter(item=>item.productId===productId).reduce((sum,item)=>sum+item.quantity,0);
    if(product.status!=='active'||reserved>=Number(product.stock)){toast('This item is unavailable or there is not enough stock.');return;}
    if (product.category === 'Custom' && !custom) { location.hash = '#custom'; toast('Open the studio to create your custom tee'); return; }
    const designKey = custom ? btoa(unescape(encodeURIComponent(JSON.stringify(custom)))).slice(0,24) : '';
    const key = `${productId}-${size}-${designKey}`;
    const existing = cart.find((item) => item.key === key);
    if(existing?.quantity>=20){toast('Maximum 20 units per variation.');return;}
    if (existing) existing.quantity += 1;
    else cart.push({key,productId,size,quantity:1,custom,price:custom?.price || product.price});
    persist(); renderCart(); toast(`${product.name} added to your bag`);
  }

  function renderCart() {
    const count = cart.reduce((sum,item) => sum + item.quantity,0);
    $$('.gw-cart-count').forEach((node) => { node.textContent = count; });
    const items = $('#cart-items');
    if (!items) return;
    if (!cart.length) items.innerHTML = '<div class="gw-empty-cart"><div><strong>Your bag is ready for a story.</strong><p>Add a tee to get started.</p></div></div>';
    else items.innerHTML = cart.map((item) => { const product = itemProduct(item); const detail = item.custom ? `${item.size} · “${safe(item.custom.text || 'Custom text')}” · ${safe(item.custom.surface)}` : `${item.size} · ${safe(product.colour)}`; return `<article class="gw-cart-item" data-key="${safe(item.key)}"><div class="gw-cart-thumb"><span style="--shirt:${product.shirt}"></span></div><div class="gw-cart-copy"><strong>${safe(product.name)}</strong><small>${detail}</small><div class="gw-quantity"><button data-qty="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-qty="1" aria-label="Increase quantity">+</button></div></div><div><strong class="gw-cart-price">${money(itemPrice(item)*item.quantity)}</strong><button class="gw-remove" data-remove type="button">Remove</button></div></article>`; }).join('');
    $('#cart-subtotal').textContent = money(subtotal());
    $('#shipping-message').textContent = subtotal() >= 799 ? 'You qualify for free demo delivery.' : subtotal() ? `Add ${money(799-subtotal())} more for free demo delivery.` : 'Delivery calculated at checkout.';
    $('#checkout-button').disabled = cart.length === 0;
  }

  function openCart() {
    lastFocus = document.activeElement; $('[data-close-cart]').hidden = false; $('.gw-cart-drawer').classList.add('is-open'); $('.gw-cart-drawer').setAttribute('aria-hidden','false'); document.body.classList.add('gw-lock'); $('.gw-drawer-head [data-close-cart]').focus();
  }
  function closeCart() {
    $('[data-close-cart]').hidden = true; $('.gw-cart-drawer').classList.remove('is-open'); $('.gw-cart-drawer').setAttribute('aria-hidden','true'); document.body.classList.remove('gw-lock'); lastFocus?.focus();
  }

  function productDetailMedia(product) {
    const images=(product.images||[]).filter((value)=>/^data:image\/(?:png|jpeg|webp);base64,/.test(value));
    if(!images.length) return shirtMarkup(product,true);
    return `<div class="gw-product-gallery" data-gallery-index="0"><div class="gw-gallery-main"><img src="${images[0]}" alt="${safe(product.name)}">${images.length>1?'<button class="gw-gallery-arrow is-prev" type="button" data-gallery-step="-1" aria-label="Previous product image">‹</button><button class="gw-gallery-arrow is-next" type="button" data-gallery-step="1" aria-label="Next product image">›</button>':''}</div><div class="gw-gallery-thumbs">${images.map((image,index)=>`<button type="button" data-gallery-image="${index}" class="${index===0?'is-active':''}"><img src="${image}" alt="View ${index+1}"></button>`).join('')}</div></div>`;
  }

  function openProduct(id) {
    const product = productById(id); if (!product) return;
    if (product.category === 'Custom') { location.hash='#custom'; return; }
    lastFocus = document.activeElement;
    productCustomImage='';$('#product-modal-content').innerHTML = `<article class="gw-product-detail">${productDetailMedia(product)}<div class="gw-product-info"><p class="gw-eyebrow">${safe(product.category)} · ${safe(product.colour)}</p><h2 id="product-modal-title">${safe(product.name)}</h2><div class="gw-detail-price"><strong>${money(product.price)}</strong>${product.mrp ? `<del>${money(product.mrp)}</del>` : ''}</div><p>${safe(product.description)}</p><p class="gw-stock-note">${Number(product.stock)>0?`${Number(product.stock)} available`:'Currently out of stock'}</p><fieldset><legend>Select variation</legend><div class="gw-size-picker">${product.sizes.map((size,index) => `<label><input type="radio" name="modal-size" value="${size}" ${index===0?'checked':''}><span>${safe(size)}</span></label>`).join('')}</div></fieldset>${product.customizable?'<fieldset class="gw-personalize"><legend>Personalize this item</legend><label>Custom text or name<input name="product-custom-text" maxlength="80" placeholder="Enter a name or message"></label><label>Photo or logo<input name="product-custom-image" type="file" accept="image/png,image/jpeg,image/webp"><small>PNG, JPG or WebP, maximum 5 MB.</small></label><div class="gw-custom-image-preview"></div></fieldset>':''}${productDeliveryMarkup(product)}<p class="gw-safe-note">Review the product, variation and personalization before adding it.</p><div class="gw-detail-actions"><button class="gw-button" type="button" data-modal-add="${product.id}" ${Number(product.stock)<=0?'disabled':''}>${Number(product.stock)>0?'Add to bag':'Out of stock'}</button><button class="gw-text-button" type="button" data-close-product>Keep browsing</button></div></div></article>`;
    $('#product-modal').hidden = false; document.body.classList.add('gw-lock'); $('#product-modal .gw-modal-close').focus();if(/^[1-9]\d{5}$/.test(selectedDeliveryPin))checkProductDelivery($('#product-delivery-check'));
  }
  function closeProduct() { productDeliveryRequest++;$('#product-modal').hidden = true; document.body.classList.remove('gw-lock'); lastFocus?.focus(); }

  function renderCheckout() {
    $('#checkout-items').innerHTML = cart.map((item) => { const product=itemProduct(item); return `<div class="gw-checkout-line"><div><strong>${safe(product.name)}</strong><span>${safe(item.size)} × ${item.quantity}</span></div><strong>${money(itemPrice(item)*item.quantity)}</strong></div>`; }).join('');
    const verified=validCheckoutDelivery(),total=subtotal()+shipping();
    $('#checkout-totals').innerHTML = `<div class="gw-checkout-totals"><div class="gw-total-line"><span>Subtotal</span><strong>${money(subtotal())}</strong></div><div class="gw-total-line"><span>Delivery</span><strong>${verified?(shipping()?money(shipping()):'Free'):'Check PIN code'}</strong></div><div class="gw-total-line is-total"><span>Total</span><strong>${verified?money(total):`${money(subtotal())} + delivery`}</strong></div></div>`;
    const submit=$('#checkout-form button[type="submit"]');if(submit){submit.disabled=!verified;submit.textContent=$('#checkout-form').elements.payment?.value==='online-demo'?'Continue to payment demo':'Place order';}
  }
  function startDemoPayment(order){
    demoPaymentGeneration++;demoPaymentBusy=false;
    demoPaymentOrder={...order,payment:'online-demo',checkoutAttemptId:crypto.randomUUID()};
    $('#checkout-flow').hidden=true;$('#order-success').hidden=true;renderDemoPayment();
  }
  function renderDemoPayment(failed=false){
    const panel=$('#demo-payment-panel');panel.hidden=false;
    panel.innerHTML=`<span class="gw-demo-badge">DEMO MODE · ₹0 will be collected</span><h2 id="demo-payment-title">${failed?'Demo payment failed':'Online payment demo'}</h2><p>${failed?'This was a simulated failure. No payment or order was created. Your bag is saved.':'Try the payment experience. Do not enter real card, bank, UPI or OTP details.'}</p><div class="gw-demo-amount"><span>Demo order total</span><strong>${money(demoPaymentOrder.total)}</strong></div>${failed?'<button class="gw-button" type="button" data-demo-action="retry">Try demo again</button>':'<fieldset class="gw-demo-methods"><legend>Choose a demo payment method</legend><label><input type="radio" name="demo-method" value="upi" checked> UPI demo</label><label><input type="radio" name="demo-method" value="card"> Card demo</label><label><input type="radio" name="demo-method" value="netbanking"> Netbanking demo</label></fieldset><div class="gw-demo-actions"><button class="gw-button" type="button" data-demo-action="success">Simulate successful payment</button><button class="gw-demo-secondary" type="button" data-demo-action="failure">Simulate failed payment</button></div>'}<button class="gw-text-button" type="button" data-demo-action="cancel">${failed?'Back to checkout':'Cancel demo'}</button><p class="gw-demo-status" role="status" aria-live="polite"></p>`;
    panel.querySelector('button')?.focus();
  }
  function cancelDemoPayment(message='Demo cancelled. No payment was collected. Your bag is saved.'){
    if(demoPaymentBusy)return;
    demoPaymentGeneration++;demoPaymentOrder=null;$('#demo-payment-panel').hidden=true;$('#order-success').hidden=true;$('#checkout-flow').hidden=false;
    $('#checkout-payment-note').textContent=message;renderCheckout();
  }
  async function demoPaymentAction(action){
    if(!demoPaymentOrder||demoPaymentBusy)return;
    if(action==='cancel'){cancelDemoPayment();return;}
    if(action==='retry'){renderDemoPayment();return;}
    if(action==='failure'){renderDemoPayment(true);return;}
    if(action!=='success')return;
    const generation=demoPaymentGeneration,panel=$('#demo-payment-panel');demoPaymentBusy=true;
    $$('button',panel).forEach(button=>button.disabled=true);$('.gw-demo-status',panel).textContent='Creating your demo confirmation…';
    const demo={...demoPaymentOrder,id:`DEMO-${Date.now().toString(36).toUpperCase()}`,isDemo:true,status:'Demo only',statusHistory:[{status:'Demo only',at:new Date().toISOString()}],paymentLabel:'Online payment demo · ₹0 collected',paymentStatus:'Demo success — no real payment',amountCollected:0,demoOutcome:'success',demoMethod:$('input[name="demo-method"]:checked',panel)?.value||'upi'};
    try{
      const order=await saveSharedOrder(demo);if(!orders.some(item=>item.id===order.id))orders.unshift(order);persistOrders();
      if(generation!==demoPaymentGeneration)return;
      panel.hidden=true;$('#checkout-flow').hidden=true;const success=$('#order-success');success.hidden=false;
      success.innerHTML=`<div class="gw-success-mark">✓</div><span class="gw-demo-badge">DEMO ONLY · Not a real payment</span><p class="gw-eyebrow">${safe(order.id)}</p><h2>Demo payment successful</h2><p>Amount collected: <strong>₹0</strong>. This demo order will not be dispatched and stock has not changed.</p><p>Your bag is saved. Choose cash on delivery at checkout to place a real order.</p><button class="gw-button" type="button" data-view-completed-orders>View my orders</button><button class="gw-text-button" type="button" data-demo-checkout>Back to checkout</button>`;
      demoPaymentOrder=null;
    }catch(error){
      if(generation!==demoPaymentGeneration)return;
      $('.gw-demo-status',panel).textContent=error.message||'Could not save the demo. No payment was collected. Please try again.';
      $$('button',panel).forEach(button=>button.disabled=false);
    }finally{if(generation===demoPaymentGeneration)demoPaymentBusy=false;}
  }
  function requestCheckoutLogin(message='Log in or create an account to continue checkout. Your bag is saved.') {
    checkoutAfterLogin=true;closeCart();closeCheckout();openAuth();setAuthTab('login');
    let notice=$('#checkout-login-notice');if(!notice){notice=document.createElement('p');notice.id='checkout-login-notice';notice.className='gw-contact-help';notice.setAttribute('role','status');$('#auth-guest').prepend(notice);}notice.textContent=message;notice.hidden=false;
  }
  async function ensureCheckoutLogin(){
    try{await syncServerSession();}catch(error){toast('Could not verify your login. Please try again.');return false;}
    if(!currentAccount()){requestCheckoutLogin();return false;}return true;
  }
  function resumeCheckoutAfterAuth(){if(!checkoutAfterLogin)return;checkoutAfterLogin=false;closeAuth();openCheckout();}
  async function openCheckout() {
    if (!cart.length) return;if(!await ensureCheckoutLogin())return;try{await fetchSharedProducts();}catch(error){toast(error.message);return;}closeCart();renderCheckout();const account=currentAccount();if(account){const form=$('#checkout-form');form.elements.name.value=account.name;form.elements.email.value=account.email||'';if(account.phone)form.elements.phone.value=account.phone;}demoPaymentGeneration++;demoPaymentOrder=null;demoPaymentBusy=false;$('#demo-payment-panel').hidden=true;$('#checkout-payment-note').textContent='';$('#checkout-flow').hidden=false; $('#order-success').hidden=true; $('#checkout-modal').hidden=false; document.body.classList.add('gw-lock'); $('#checkout-modal .gw-modal-close').focus();if(/^[1-9]\d{5}$/.test($('#checkout-form').elements.pincode.value))checkCheckoutDelivery();
  }
  function closeCheckout() { demoPaymentGeneration++;demoPaymentOrder=null;demoPaymentBusy=false;$('#checkout-modal').hidden=true; document.body.classList.remove('gw-lock'); }

  function setAuthTab(tab) {
    $$('[data-auth-tab]').forEach((button) => { const active=button.dataset.authTab===tab; button.classList.toggle('is-active',active); button.setAttribute('aria-selected',String(active)); });
    $('#login-form').hidden=tab!=='login'; $('#register-form').hidden=tab!=='register';
    $$('.gw-auth-message').forEach((message)=>{message.textContent='';message.classList.remove('is-error','is-success');});
  }
  function orderDate(value) { try{return new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));}catch(_){return value;} }
  function customerOrders() {
    const account=currentAccount();if(!account)return [];
    if(sharedOrdersEnabled)return customerOrderSnapshot?.identity===accountIdentity(account)?customerOrderSnapshot.orders:[];
    const aliases=[account.id,account.email,account.phone].filter(Boolean);
    return orders.filter(order=>order.accountId?aliases.includes(order.accountId):Boolean(account.email)&&order.email?.toLowerCase()===account.email.toLowerCase());
  }
  function renderCustomerOrders() {
    const list=$('#customer-order-list');if(!list)return;
    if(sharedOrdersEnabled&&currentAccount()&&customerOrderSnapshot?.identity!==accountIdentity(currentAccount())){list.innerHTML='<p class="gw-no-orders">Loading your latest orders…</p>';$('#profile-order-count').textContent='…';return;}
    const visible=customerOrders();$('#profile-order-count').textContent=visible.length;
    list.innerHTML=visible.length?visible.map((order)=>`<article class="gw-customer-order"><div><strong>${safe(order.id)}</strong><span>${orderDate(order.createdAt)}</span></div><span class="gw-order-status is-${safe(order.status.toLowerCase().replaceAll(' ','-'))}">${safe(order.status)}</span><ul>${order.items.map((item)=>`<li>${safe(item.name)} <span>${safe(item.size)} × ${item.quantity}</span>${item.custom?.text?`<small>Personalization: ${safe(item.custom.text)}</small>`:''}</li>`).join('')}</ul><div><span>${safe(order.paymentLabel)}</span><strong>${money(order.total)}</strong></div><small>${order.isDemo?'Demo address':'Deliver to'} ${safe(order.city)}, ${safe(order.state)} · PIN ${safe(order.pincode)}</small>${trackingMarkup(order)}${order.statusHistory?.length?`<details><summary>Status history</summary><ol>${order.statusHistory.map(entry=>`<li><b>${safe(entry.status)}</b><span>${orderDate(entry.at)}</span></li>`).join('')}</ol></details>`:''}</article>`).join(''):'<div class="gw-no-orders"><strong>No orders yet.</strong><p>When you complete checkout, the order will appear here.</p><a href="#shop" data-close-auth>Start shopping</a></div>';
  }
  function showProfileOrders(show=true) {
    $('#profile-orders').hidden=!show;$('.gw-profile-avatar').hidden=show;$('#auth-profile>.gw-eyebrow').hidden=show;$('#auth-profile>h2').hidden=show;$('.gw-profile-email').hidden=show;$('.gw-role-badge').hidden=show;$('.gw-profile-links').hidden=show;$('#logout-button').hidden=show;
    clearInterval(showProfileOrders.timer);
    if(show){renderCustomerOrders();refreshCustomerOrderStatuses();showProfileOrders.timer=setInterval(refreshVisibleCustomerOrders,5000);}
  }
  function renderAuth() {
    const account=currentAccount();
    $('#auth-guest').hidden=Boolean(account); $('#auth-profile').hidden=!account;
    const label=$('.gw-account-link small'); label.textContent=account ? account.name.split(/\s+/)[0] : 'Login';
    if(account){$('.gw-profile-avatar').textContent=account.name.trim().charAt(0).toUpperCase();$('#auth-profile>h2').textContent=`Hi, ${account.name.split(/\s+/)[0]}!`;$('.gw-profile-email').textContent=[account.email,account.phone].filter(Boolean).join(' · ');$('.gw-role-badge').textContent=account.role==='admin'?'Administrator':account.role==='staff'?'Store staff':'Shopper';$('#open-admin').hidden=!['admin','staff'].includes(account.role);renderCustomerOrders();}
  }
  function openAuth() { lastFocus=document.activeElement;renderAuth();if(currentAccount()){showProfileOrders(false);refreshCustomerOrderStatuses();}$('#auth-modal').hidden=false;document.body.classList.add('gw-lock');$('#auth-modal .gw-modal-close').focus(); }
  function closeAuth() { clearInterval(showProfileOrders.timer);checkoutAfterLogin=false;const notice=$('#checkout-login-notice');if(notice)notice.hidden=true;$('#auth-modal').hidden=true;document.body.classList.remove('gw-lock');lastFocus?.focus(); }
  function authMessage(form,text,type='error') { const node=$('.gw-auth-message',form);node.textContent=text;node.classList.toggle('is-error',type==='error');node.classList.toggle('is-success',type==='success'); }

  function renderAdmin() {
    const account=currentAccount();
    const query=($('#admin-search')?.value||'').toLowerCase().trim();
    const visible=products.filter((product)=>!query||`${product.name} ${product.category} ${product.colour}`.toLowerCase().includes(query));
    $('#admin-product-count').textContent=`${visible.length} product${visible.length===1?'':'s'}`;
    $('#admin-product-list').innerHTML=visible.map((product)=>{const image=(product.images||[])[0];return `<article class="gw-admin-product"><div class="gw-admin-thumb">${image?`<img src="${image}" alt="">`:`<span style="--shirt:${product.shirt||'#172335'}"></span>`}</div><div><strong>${safe(product.name)}</strong><small>${safe(product.category)} · ${safe((product.audiences||[]).join(', '))}</small></div><span>${money(product.price)}</span><span>${Number(product.stock)||0} in stock</span><em class="is-${safe(product.status||'active')}">${safe(product.status||'active')}</em><button type="button" data-edit-product="${safe(product.id)}">Edit</button></article>`;}).join('');
    $('#stat-products').textContent=products.length;$('#stat-stock').textContent=products.reduce((sum,product)=>sum+(Number(product.stock)||0),0);$('#stat-value').textContent=money(products.reduce((sum,product)=>sum+(Number(product.price)||0)*(Number(product.stock)||0),0));$('#stat-users').textContent=allAccounts().length;$('#stat-orders').textContent=orders.filter(order=>!order.isDemo).length;$('#stat-revenue').textContent=money(orders.filter((order)=>!order.isDemo&&order.status!=='Cancelled').reduce((sum,order)=>sum+(Number(order.total)||0),0));
    const usersButton=$('[data-admin-view="users"]');if(usersButton)usersButton.hidden=account?.role!=='admin';
    renderAdminUsers();renderAdminOrders();
  }
  function renderAdminOrders() {
    $('#admin-order-count').textContent=`${orders.length} order${orders.length===1?'':'s'}`;
    $('#admin-order-list').innerHTML=orders.length?orders.map((order)=>`<article class="gw-admin-order"><header><div><strong>${safe(order.id)}</strong><span>${orderDate(order.createdAt)}</span></div>${order.isDemo?'<span class="gw-demo-badge">DEMO · Do not dispatch</span>':`<select data-order-status="${safe(order.id)}" aria-label="Status for ${safe(order.id)}">${['Received','Confirmed','Processing','Packed','Shipped','Out for Delivery','Delivered','Cancelled','Returned','Refunded'].map((status)=>`<option ${status===order.status?'selected':''}>${status}</option>`).join('')}</select>`}</header><div class="gw-admin-order-meta"><span><b>${safe(order.customerName)}</b>${safe(order.email)} · ${safe(order.phone)}</span><span>${safe(order.paymentLabel)} · <b>${money(order.total)}</b></span></div><ul>${order.items.map((item)=>`<li>${safe(item.name)} <span>${safe(item.size)} × ${item.quantity}</span>${item.custom?`<small>Customization: ${safe(item.custom.text||item.custom.artwork_name||'Artwork supplied')}</small>`:''}</li>`).join('')}</ul><p>${safe(order.address)}, ${safe(order.city)}, ${safe(order.state)} — ${safe(order.pincode)}</p>${trackingEditorMarkup(order)}${order.statusHistory?.length?`<details><summary>Status history</summary><ol>${order.statusHistory.map(entry=>`<li>${safe(entry.status)} · ${orderDate(entry.at)}</li>`).join('')}</ol></details>`:''}</article>`).join(''):'<div class="gw-no-orders"><strong>No orders received.</strong><p>Completed customer checkouts will appear here.</p></div>';
  }
  function renderAdminUsers() {
    const account=currentAccount();
    const accounts=allAccounts();
    $('#admin-user-count').textContent=`${accounts.length} user${accounts.length===1?'':'s'}`;
    $('#admin-user-list').innerHTML=accounts.map((user)=>`<article class="gw-admin-user"><div class="gw-user-avatar">${safe(user.name.trim().charAt(0).toUpperCase())}</div><div><strong>${safe(user.name)}</strong><small class="gw-user-contact">Email: ${safe(user.email||'Not provided')}</small><small class="gw-user-contact">Mobile: ${safe(user.phone||'Not provided')}</small></div><span class="gw-role-badge">${user.role==='admin'?'Administrator':user.role==='staff'?'Store staff':'Shopper'}</span>${(user.id||user.email||user.phone)===(account?.id||account?.email||account?.phone)?'<em>Current</em>':''}</article>`).join('');
  }
  function setAdminView(view) {
    const account=currentAccount();
    if(view==='users'&&account?.role!=='admin'){toast('Administrator access is required');return;}
    $('#admin-products').hidden=view!=='products';$('#admin-orders').hidden=view!=='orders';$('#admin-users').hidden=view!=='users';$('#admin-overview').hidden=view!=='overview';
    if($('#admin-delivery'))$('#admin-delivery').hidden=view!=='delivery';
    $('#admin-title').textContent=view==='overview'?'Overview':view==='orders'?'Orders':view==='users'?'Users':'Products';$('#new-product').hidden=view!=='products';
    $$('[data-admin-view]').forEach((node)=>node.classList.toggle('is-active',node.dataset.adminView===view));
    if(view==='users'){renderAdminUsers();if(sharedOrdersEnabled)apiGet('users').then(data=>{saveAccounts(data.users);renderAdminUsers();}).catch(error=>toast(error.message));}if(view==='orders')renderAdminOrders();
    if(view==='delivery'){$('#admin-title').textContent='Delivery areas';renderDeliveryAreas();loadDeliverySettings().catch(error=>toast(error.message));}
  }
  async function openAdmin() { const account=currentAccount();if(!account||!['admin','staff'].includes(account.role)){toast('Admin or staff access is required');return;}closeAuth();$('#admin-modal').hidden=false;document.body.classList.add('gw-lock');renderAdmin();setAdminView('products');try{await fetchSharedOrders();renderAdmin();}catch(error){toast(error.message);} }
  function closeAdmin() { $('#admin-modal').hidden=true;$('#product-editor').hidden=true;document.body.classList.remove('gw-lock'); }
  function renderImagePreviews() { $('#image-previews').innerHTML=editorImages.map((image,index)=>`<div><img src="${image}" alt="Product image ${index+1}"><button type="button" data-remove-image="${index}" aria-label="Remove image ${index+1}">×</button></div>`).join(''); }
  function openEditor(product=null) {
    const form=$('#product-form');form.reset();editorImages=[...(product?.images||[])];form.elements.id.value=product?.id||'';form.elements.name.value=product?.name||'';form.elements.category.value=product?.category||'Essential';form.elements.colour.value=product?.colour||'Black';form.elements.price.value=product?.price||349;form.elements.mrp.value=product?.mrp||0;form.elements.stock.value=product?.stock??10;form.elements.status.value=product?.status||'active';form.elements.description.value=product?.description||'';if(form.elements.customizable)form.elements.customizable.checked=Boolean(product?.customizable);if(form.elements.variants)form.elements.variants.value=(product?.sizes||[]).join(', ');$$('input[name="audiences"]',form).forEach((input)=>{input.checked=(product?.audiences||['Men','Women']).includes(input.value);});$('#editor-title').textContent=product?'Edit product':'Add product';$('#archive-product').hidden=!product;renderImagePreviews();$('#product-editor').hidden=false;form.elements.name.focus();
  }
  function closeEditor(){ $('#product-editor').hidden=true; }
  function resizeProductImage(file) {
    return new Promise((resolve,reject)=>{if(!['image/png','image/jpeg','image/webp'].includes(file.type)){reject(new Error('Use PNG, JPG or WebP images.'));return;}if(file.size>5*1024*1024){reject(new Error('Each image must be under 5 MB.'));return;}const reader=new FileReader();reader.onerror=()=>reject(new Error('Could not read image.'));reader.onload=()=>{const img=new Image();img.onerror=()=>reject(new Error('Invalid image file.'));img.onload=()=>{const scale=Math.min(1,1000/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.78));};img.src=reader.result;};reader.readAsDataURL(file);});
  }

  function setupEnhancedUI(){
    $('#admin-modal .gw-admin-main>header')?.insertAdjacentHTML('beforeend','<button type="button" class="gw-manager-refresh" id="refresh-store-manager">↻ Refresh</button>');
    const menu=$('#gw-primary-menu ul');
    if(menu&&!menu.querySelector('[data-category-link="Beauty"]'))menu.insertAdjacentHTML('beforeend','<li class="gw-nav-item"><a href="#shop" data-category-link="Beauty">Beauty</a><div class="gw-mega-menu"><div><strong>Beauty</strong><a href="#shop" data-category-link="Beauty" data-shop-search="skincare">Skincare</a><a href="#shop" data-category-link="Beauty" data-shop-search="makeup">Makeup & lip care</a><a href="#shop" data-category-link="Beauty" data-shop-search="hair">Haircare</a></div><div><strong>More care</strong><a href="#shop" data-category-link="Beauty" data-shop-search="perfume">Fragrance</a><a href="#shop" data-category-link="Beauty" data-shop-search="grooming">Grooming</a><a href="#shop" data-category-link="Beauty">View all beauty</a></div></div></li><li class="gw-nav-item"><a href="#shop" data-category-link="Gift">Gift</a><div class="gw-mega-menu"><div><strong>Personalized gifts</strong><a href="#shop" data-category-link="Gift" data-shop-search="mug">Mugs</a><a href="#shop" data-category-link="Gift" data-shop-search="photo">Photo gifts</a><a href="#shop" data-category-link="Gift" data-shop-search="keychain">Keychains</a></div><div><strong>Occasions</strong><a href="#shop" data-category-link="Gift" data-shop-search="birthday">Birthday</a><a href="#shop" data-category-link="Gift" data-shop-search="anniversary">Anniversary</a><a href="#shop" data-category-link="Gift">View all gifts</a></div></div></li>');
    const chips=$('.gw-filter-chips');
    ['Beauty','Gift'].forEach(category=>{if(chips&&!chips.querySelector(`[data-category="${category}"]`))chips.insertAdjacentHTML('beforeend',`<button data-category="${category}">${category}</button>`);});
    const form=$('#product-form');
    if(form){const category=form.elements.category;['Beauty','Gift'].forEach(value=>{if(![...category.options].some(option=>option.value===value))category.add(new Option(value,value));});const status=form.elements.status;if(![...status.options].some(option=>option.value==='inactive'))status.add(new Option('Inactive','inactive'));if(!form.elements.variants){form.querySelector('fieldset').insertAdjacentHTML('beforebegin','<label>Variants / sizes<input name="variants" placeholder="Example: 500 ml, 750 ml"><small>Comma-separated options shown to shoppers.</small></label><label class="gw-admin-toggle"><input name="customizable" type="checkbox"> Allow photo, logo and custom text</label>');}}
  }

  function setupEvents() {
    $('#demo-payment-panel')?.addEventListener('click',event=>{const button=event.target.closest('[data-demo-action]');if(button)demoPaymentAction(button.dataset.demoAction);});
    $('#checkout-form')?.addEventListener('change',event=>{if(event.target.name==='payment'){renderCheckout();$('#checkout-payment-note').textContent=event.target.value==='online-demo'?'Demo only. No money will be collected and no shipment will be created.':'';}});
    $('#refresh-store-manager')?.addEventListener('click',async event=>{const button=event.currentTarget;button.disabled=true;try{await Promise.all([fetchSharedProducts(),fetchSharedOrders()]);renderAdmin();renderProducts();toast('Store manager updated');}catch(error){toast(error.message);}finally{button.disabled=false;}});
    $('#refresh-customer-orders')?.addEventListener('click',()=>refreshCustomerOrderStatuses());
    window.addEventListener('focus',refreshVisibleCustomerOrders);
    window.addEventListener('online',refreshVisibleCustomerOrders);
    window.addEventListener('storage',event=>{if(event.key===orderStorageKey)refreshVisibleCustomerOrders();});
    document.addEventListener('visibilitychange',refreshVisibleCustomerOrders);
    $('#product-modal-content')?.addEventListener('submit',event=>{const form=event.target.closest('#product-delivery-check');if(!form)return;event.preventDefault();checkProductDelivery(form);});
    $('#product-modal-content')?.addEventListener('input',event=>{if(!event.target.closest('#product-delivery-check'))return;productDeliveryRequest++;const form=event.target.closest('form'),product=productById(form.dataset.deliveryProduct),result=$('.gw-product-delivery-result',form);result.textContent='Check this PIN code to verify delivery availability.';result.dataset.state='';$('button[type="submit"]',form).disabled=false;const add=$('#product-modal-content [data-modal-add]');if(add)add.disabled=Number(product?.stock)<=0;});
    $('#admin-order-list')?.addEventListener('submit',async event=>{const form=event.target.closest('[data-tracking-order]');if(!form)return;event.preventDefault();if(!form.reportValidity())return;const details=Object.fromEntries(new FormData(form));const courier=details.courierName.trim(),number=details.trackingNumber.trim();if(Boolean(courier)!==Boolean(number)){authMessage(form,'Enter both courier name and tracking number.');return;}if(details.trackingUrl&&!safeTrackingUrl(details.trackingUrl)){authMessage(form,'Use a valid HTTPS tracking link.');return;}const button=$('button[type="submit"]',form);button.disabled=true;try{const updated=await updateSharedTracking(form.dataset.trackingOrder,{courierName:courier,trackingNumber:number,trackingUrl:details.trackingUrl.trim()});const order=orders.find(order=>order.id===form.dataset.trackingOrder);if(order&&updated)Object.assign(order,updated);persistOrders();authMessage(form,'Tracking saved. Customers can see it in My Orders.','success');toast('Courier tracking updated');}catch(error){authMessage(form,error.message);}finally{button.disabled=false;}});
    {
      $('#login-form')?.addEventListener('submit',event=>serverAuthSubmit(event,'login'));
      $('#register-form')?.addEventListener('submit',event=>serverAuthSubmit(event,'register'));
      $('#user-form')?.addEventListener('submit',event=>serverAuthSubmit(event,'user-create'));
      $('#logout-button')?.addEventListener('click',async event=>{event.stopImmediatePropagation();if(sharedOrdersEnabled){await apiPost({action:'logout'});saveAccounts([]);}localStorage.removeItem(sessionKey);resetCustomerOrders();serverUser=null;renderAuth();setAuthTab('login');});
    }
    $('.gw-menu-toggle')?.addEventListener('click', (event) => { const open=event.currentTarget.getAttribute('aria-expanded')!=='true'; event.currentTarget.setAttribute('aria-expanded',String(open)); $('#gw-primary-menu').classList.toggle('is-open',open); });
    $('.gw-search-toggle')?.addEventListener('click', (event) => { const search=$('#gw-header-search'); const open=search.hidden; search.hidden=!open; event.currentTarget.setAttribute('aria-expanded',String(open)); if(open) $('#header-search').focus(); });
    $('.gw-search-form')?.addEventListener('submit',(event)=>{event.preventDefault(); state.search=$('#header-search').value; $('#product-search').value=state.search; renderProducts(); location.hash='#shop';});
    $('#product-search')?.addEventListener('input',(event)=>{state.search=event.target.value;renderProducts();});
    $('#product-sort')?.addEventListener('change',(event)=>{state.sort=event.target.value;renderProducts();});
    $('#price-range')?.addEventListener('input',(event)=>{state.maxPrice=Number(event.target.value);$('#price-output').textContent=money(state.maxPrice);renderProducts();});
    $$('.gw-filter-chips button').forEach((button)=>button.addEventListener('click',()=>{state.category=button.dataset.category;$$('.gw-filter-chips button').forEach((node)=>node.classList.toggle('is-active',node===button));renderProducts();}));
    $$('.gw-filter-panel input[type="checkbox"]').forEach((input)=>input.addEventListener('change',()=>{state.sizes=$$('input[name="size"]:checked').map((node)=>node.value);state.colours=$$('input[name="colour"]:checked').map((node)=>node.value);renderProducts();}));
    $('#clear-filters')?.addEventListener('click',resetFilters); $('#empty-products .gw-button')?.addEventListener('click',resetFilters);
    $('.gw-mobile-filter')?.addEventListener('click',(event)=>{const open=event.currentTarget.getAttribute('aria-expanded')!=='true';event.currentTarget.setAttribute('aria-expanded',String(open));$('.gw-filter-panel').classList.toggle('is-open',open);});
    $$('[data-category-link],[data-audience-link],[data-shop-search]').forEach((link)=>link.addEventListener('click',()=>{if(link.dataset.categoryLink)state.category=link.dataset.categoryLink;if(link.dataset.audienceLink){state.audience=link.dataset.audienceLink;if(link.dataset.shopSearch===undefined){state.search='';$('#product-search').value='';}}if(link.dataset.shopSearch!==undefined){state.search=link.dataset.shopSearch;$('#product-search').value=state.search;}$$('.gw-filter-chips button').forEach((button)=>button.classList.toggle('is-active',button.dataset.category===state.category));renderProducts();$('#gw-primary-menu').classList.remove('is-open');$('.gw-menu-toggle')?.setAttribute('aria-expanded','false');}));
    $('#product-grid')?.addEventListener('click',(event)=>{const add=event.target.closest('[data-add]');const view=event.target.closest('[data-view]');if(add) add.dataset.add==='custom-text'?location.hash='#custom':openProduct(add.dataset.add);if(view)openProduct(view.dataset.view);});
    $('.gw-cart-link')?.addEventListener('click',openCart); $$('[data-close-cart]').forEach((button)=>button.addEventListener('click',closeCart));
    $('#cart-items')?.addEventListener('click',(event)=>{const item=event.target.closest('.gw-cart-item');if(!item)return;const index=cart.findIndex((entry)=>entry.key===item.dataset.key);if(index<0)return;if(event.target.closest('[data-remove]'))cart.splice(index,1);const quantity=event.target.closest('[data-qty]');if(quantity){const delta=Number(quantity.dataset.qty),entry=cart[index],product=productById(entry.productId),reserved=cart.filter(item=>item.productId===entry.productId).reduce((sum,item)=>sum+item.quantity,0);if(delta>0&&(entry.quantity>=20||reserved>=Number(product?.stock||0))){toast('Maximum available quantity reached.');return;}entry.quantity+=delta;if(entry.quantity<=0)cart.splice(index,1);}persist();renderCart();});
    $$('[data-close-product]').forEach((button)=>button.addEventListener('click',closeProduct));
    $('#product-modal-content')?.addEventListener('change',async(event)=>{if(event.target.name!=='product-custom-image')return;const file=event.target.files?.[0];if(!file)return;try{productCustomImage=await resizeProductImage(file);$('.gw-custom-image-preview').innerHTML=`<img src="${productCustomImage}" alt="Customization preview">`;}catch(error){toast(error.message);event.target.value='';}});
    $('#product-modal-content')?.addEventListener('click',(event)=>{const close=event.target.closest('[data-close-product]');if(close){closeProduct();return;}const thumb=event.target.closest('[data-gallery-image]');const step=event.target.closest('[data-gallery-step]');if(thumb||step){const product=productById($('#product-modal-content [data-modal-add]')?.dataset.modalAdd);const gallery=$('.gw-product-gallery');const images=product?.images||[];let index=thumb?Number(thumb.dataset.galleryImage):Number(gallery?.dataset.galleryIndex||0)+Number(step.dataset.galleryStep);if(images.length){index=(index+images.length)%images.length;gallery.dataset.galleryIndex=String(index);$('.gw-gallery-main img').src=images[index];$$('[data-gallery-image]').forEach((button)=>button.classList.toggle('is-active',Number(button.dataset.galleryImage)===index));}return;}const add=event.target.closest('[data-modal-add]');if(!add)return;const product=productById(add.dataset.modalAdd);const size=$('input[name="modal-size"]:checked')?.value||'Standard';const text=$('input[name="product-custom-text"]')?.value.trim()||'';const custom=product?.customizable?{text,artwork:productCustomImage,artwork_name:productCustomImage?'Customer photo/logo':''}:null;if(product?.customizable&&!text&&!productCustomImage){toast('Add custom text or a photo/logo');return;}addItem(add.dataset.modalAdd,size,custom);closeProduct();openCart();});
    $('#checkout-button')?.addEventListener('click',openCheckout); $$('[data-close-checkout]').forEach((button)=>button.addEventListener('click',closeCheckout));
    $('#checkout-form')?.addEventListener('submit',async(event)=>{event.preventDefault();const form=event.currentTarget;if(!await ensureCheckoutLogin())return;if(!form.reportValidity())return;if(!await checkCheckoutDelivery())return;const button=$('button[type="submit"]',form);button.disabled=true;button.textContent='Sending order…';const data=new FormData(form);const account=currentAccount();const name=String(data.get('name')).trim();const email=String(data.get('email')||'').trim().toLowerCase();const orderItems=cart.map((item)=>{const product=itemProduct(item);return {productId:item.productId,name:product?.name||'Product',size:item.size,quantity:item.quantity,unitPrice:itemPrice(item),custom:item.custom||null};});let order={id:`GW-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${Math.random().toString(36).slice(2,7).toUpperCase()}`,createdAt:new Date().toISOString(),accountId:account?.id||account?.email||account?.phone||null,status:'Received',customerName:name,email,phone:String(data.get('phone')),address:String(data.get('address')),city:String(data.get('city')),state:String(data.get('state')),pincode:String(data.get('pincode')),payment:String(data.get('payment')),paymentLabel:data.get('payment')==='online'?'UPI / Card / Netbanking (demo)':'Cash on delivery',items:orderItems,subtotal:subtotal(),shipping:shipping(),total:subtotal()+shipping()};if(data.get('payment')==='online-demo'){startDemoPayment(order);button.disabled=false;renderCheckout();return;}try{order=await saveSharedOrder(order);}catch(error){if(error.status===401){serverUser=null;requestCheckoutLogin('Your session expired. Please log in again to continue. Your bag is saved.');}else if(error.code==='DELIVERY_UNAVAILABLE'){deliveryQuote=null;const result=$('#checkout-delivery-result');result.textContent=error.message;result.dataset.state='error';renderCheckout();}else if(['PRICE_CHANGED','STOCK_CHANGED'].includes(error.code)){try{await fetchSharedProducts();renderCart();renderProducts();renderCheckout();}catch(_){}toast(error.message);}else toast(error.message||'Could not send the order to the store.');button.disabled=!validCheckoutDelivery();button.textContent='Place order';return;}orders.unshift(order);persistOrders();if(sharedOrdersEnabled){try{await fetchSharedProducts();}catch(_){}}else{cart.forEach(item=>{const product=productById(item.productId);if(product)product.stock=Math.max(0,(Number(product.stock)||0)-item.quantity);});persistProducts();}cart=[];persist();renderCart();renderProducts();renderCustomerOrders();$('#checkout-flow').hidden=true;const success=$('#order-success');success.hidden=false;success.innerHTML=`<div class="gw-success-mark">✓</div><p class="gw-eyebrow">Order ${safe(order.id)}</p><h2>Thanks, ${safe(name)}.</h2><p>Your order was sent to the store owner with status <strong>Received</strong>. No online payment was collected.</p>${account?'<button class="gw-button" type="button" data-view-completed-orders>View my orders</button>':''}<button class="gw-text-button" type="button" data-finish-order>Continue shopping</button>`;button.disabled=false;button.textContent='Place order';});
    $('#order-success')?.addEventListener('click',(event)=>{if(event.target.closest('[data-demo-checkout]')){cancelDemoPayment('Demo complete. No real payment was collected. Your bag is saved.');return;}if(event.target.closest('[data-view-completed-orders]')){closeCheckout();openAuth();showProfileOrders(true);return;}if(event.target.closest('[data-finish-order]')){closeCheckout();location.hash='#shop';}});
    $('#add-custom')?.addEventListener('click',()=>{let design={};try{design=JSON.parse($('.gwtd-design-data').value||'{}');}catch(_){}const text=(design.text||'').trim();if(!text){toast('Add your text before adding the custom tee');return;}const price=Number(productById('custom-text')?.price||498)+(design.surface==='back'?50:0)+(design.artwork_id?50:0);addItem('custom-text',$('#custom-size').value,{...design,text,price});openCart();});
    $('.gw-account-link')?.addEventListener('click',openAuth); $$('[data-close-auth]').forEach((button)=>button.addEventListener('click',closeAuth));
    $('#view-orders')?.addEventListener('click',()=>showProfileOrders(true));$('#close-profile-orders')?.addEventListener('click',()=>showProfileOrders(false));
    $$('[data-auth-tab]').forEach((button)=>button.addEventListener('click',()=>setAuthTab(button.dataset.authTab)));
    $('#register-form')?.addEventListener('submit',async(event)=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);const name=String(data.get('name')).trim();const email=String(data.get('email')).trim().toLowerCase();const password=String(data.get('password'));const accounts=allAccounts();if(accounts.some((account)=>account.email===email)){authMessage(form,'An account with this email already exists.');return;}if(password!==String(data.get('confirm'))){authMessage(form,'Passwords do not match.');return;}const button=$('button[type="submit"]',form);button.disabled=true;button.textContent='Creating…';try{const salt=crypto.getRandomValues(new Uint8Array(16));const hash=await passwordHash(password,salt);accounts.push({name,email,role:'shopper',salt:toBase64(salt),hash});saveAccounts(accounts);localStorage.setItem(sessionKey,email);form.reset();renderAuth();toast('Your shopper account is ready');}catch(_){authMessage(form,'Account creation is not supported in this browser.');}finally{button.disabled=false;button.textContent='Create shopper account';}});
    $('#login-form')?.addEventListener('submit',async(event)=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);const email=String(data.get('email')).trim().toLowerCase();const password=String(data.get('password'));const account=allAccounts().find((entry)=>entry.email===email);if(!account){authMessage(form,'No account found for this email.');return;}const button=$('button[type="submit"]',form);button.disabled=true;button.textContent='Checking…';try{const hash=await passwordHash(password,fromBase64(account.salt));if(hash!==account.hash){authMessage(form,'Incorrect password.');return;}await loginSharedOwner(email,password);localStorage.setItem(sessionKey,email);form.reset();renderAuth();toast(`Welcome back, ${account.name.split(/\s+/)[0]}`);}catch(error){authMessage(form,error.message||'Login is not available right now.');}finally{button.disabled=false;button.textContent='Login';}});
    $('#logout-button')?.addEventListener('click',()=>{if(sharedOrdersEnabled&&currentAccount()?.email===defaultAdmin.email)apiPost({action:'logout'}).catch(()=>{});localStorage.removeItem(sessionKey);renderAuth();setAuthTab('login');toast('You are logged out');});
    $('#open-admin')?.addEventListener('click',openAdmin);$$('[data-close-admin]').forEach((button)=>button.addEventListener('click',closeAdmin));
    $$('[data-admin-view]').forEach((button)=>button.addEventListener('click',()=>setAdminView(button.dataset.adminView)));
    $('#user-form')?.addEventListener('submit',async(event)=>{event.preventDefault();const form=event.currentTarget;const current=currentAccount();if(current?.role!=='admin'){authMessage(form,'Administrator access is required.');return;}if(!form.reportValidity())return;const data=new FormData(form);const name=String(data.get('name')).trim();const email=String(data.get('email')).trim().toLowerCase();const role=String(data.get('role'));const password=String(data.get('password'));const accounts=allAccounts();if(accounts.some((account)=>account.email===email)){authMessage(form,'An account with this email already exists.');return;}const button=$('button[type="submit"]',form);button.disabled=true;button.textContent='Creating…';try{const salt=crypto.getRandomValues(new Uint8Array(16));const hash=await passwordHash(password,salt);accounts.push({name,email,role,salt:toBase64(salt),hash,createdBy:current.email});saveAccounts(accounts);form.reset();renderAdmin();authMessage(form,`${role==='admin'?'Administrator':role==='staff'?'Store staff':'Shopper'} account created.`,'success');toast('User account created');}catch(_){authMessage(form,'Account creation is not supported in this browser.');}finally{button.disabled=false;button.textContent='Create user';}});
    $('#admin-search')?.addEventListener('input',renderAdmin);$('#new-product')?.addEventListener('click',()=>openEditor());$('#close-editor')?.addEventListener('click',closeEditor);
    $('#admin-product-list')?.addEventListener('click',(event)=>{const button=event.target.closest('[data-edit-product]');if(button)openEditor(productById(button.dataset.editProduct));});
    $('#admin-order-list')?.addEventListener('change',async(event)=>{const select=event.target.closest('[data-order-status]');if(!select)return;const order=orders.find((item)=>item.id===select.dataset.orderStatus);if(!order)return;const previous=order.status;select.disabled=true;try{const updated=await updateSharedOrder(order.id,select.value);if(updated)Object.assign(order,updated);else order.status=select.value;persistOrders();renderAdmin();toast(`Order ${order.id} updated to ${order.status}`);}catch(error){select.value=previous;toast(error.message||'Could not update the order.');}finally{select.disabled=false;}});
    $('#product-images')?.addEventListener('change',async(event)=>{const files=[...event.target.files].slice(0,Math.max(0,5-editorImages.length));const form=$('#product-form');try{for(const file of files)editorImages.push(await resizeProductImage(file));renderImagePreviews();authMessage(form,`${files.length} image${files.length===1?'':'s'} ready.`,'success');}catch(error){authMessage(form,error.message);}event.target.value='';});
    $('#image-previews')?.addEventListener('click',(event)=>{const button=event.target.closest('[data-remove-image]');if(!button)return;editorImages.splice(Number(button.dataset.removeImage),1);renderImagePreviews();});
    $('#product-form')?.addEventListener('submit',async(event)=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);const id=String(data.get('id')||'').trim()||`product-${Date.now().toString(36)}`;const existing=productById(id);const variants=String(data.get('variants')||'').split(',').map(value=>value.trim()).filter(Boolean);const product={...(existing||{}),id,name:String(data.get('name')).trim(),category:String(data.get('category')),colour:String(data.get('colour')),price:Number(data.get('price')),mrp:Number(data.get('mrp')||0),stock:Number(data.get('stock')||0),status:String(data.get('status')),audiences:data.getAll('audiences'),description:String(data.get('description')||'').trim(),images:[...editorImages],sizes:variants.length?variants:(existing?.sizes||['Standard']),variants,customizable:data.get('customizable')==='on',tags:existing?.tags||'new catalog',shirt:existing?.shirt||'#172335',print:existing?.print||'#fff',motif:existing?.motif||'',badge:existing?.badge||'New',art:existing?.art||['#e5e0d9','#fff']};if(!product.audiences.length){authMessage(form,'Choose at least one audience.');return;}const before=products.map((item)=>({...item}));const index=products.findIndex((item)=>item.id===id);if(index>=0)products[index]=product;else products.unshift(product);const button=$('button[type="submit"]',form);button.disabled=true;button.textContent='Saving…';try{await saveSharedProducts(product);renderAdmin();renderProducts();closeEditor();toast(existing?'Product updated for all shoppers':'Product added for all shoppers');}catch(error){products=before;authMessage(form,error.message||'Could not save the shared catalog.');}finally{button.disabled=false;button.textContent='Save product';}});
    $('#archive-product')?.addEventListener('click',async()=>{const id=$('#product-form').elements.id.value;const product=productById(id);if(!product)return;const previous=product.status;product.status='draft';try{await saveSharedProducts(product);renderAdmin();renderProducts();closeEditor();toast('Product moved to draft for all shoppers');}catch(error){product.status=previous;authMessage($('#product-form'),error.message||'Could not update the shared catalog.');}});
    document.addEventListener('keydown',(event)=>{if(event.key!=='Escape')return;if(!$('#product-editor').hidden)closeEditor();else if(!$('#admin-modal').hidden)closeAdmin();else if(!$('#auth-modal').hidden)closeAuth();else if(!$('#checkout-modal').hidden)closeCheckout();else if(!$('#product-modal').hidden)closeProduct();else if($('.gw-cart-drawer').classList.contains('is-open'))closeCart();});
  }

  const init = async() => { if(!sharedOrdersEnabled){removeExistingCustomerAccounts();ensureDefaultAdmin();}setupEnhancedUI();setupDeliveryUI();setupEvents();renderAuth();try{await syncServerSession();await fetchSharedProducts();renderProducts();renderCart();renderAuth();}catch(error){toast(error.message);} };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded',init) : init();
})();
