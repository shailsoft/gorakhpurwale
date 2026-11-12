import fs from 'node:fs/promises';
import path from 'node:path';
const name=process.argv[2];
if(!/^qa-[a-z0-9]{12}$/.test(name||''))throw new Error('Use a unique qa- directory name with 12 lowercase alphanumeric characters.');
const target=path.resolve('deployment',name),source=path.resolve('deployment/static');
await fs.mkdir(path.join(target,'api'),{recursive:true});
await fs.mkdir(path.join(target,'private-data'),{recursive:true});
await fs.cp(path.join(source,'wp-content'),path.join(target,'wp-content'),{recursive:true});
let html=await fs.readFile(path.join(source,'index.html'),'utf8');
html=html.replace('<title>','<title>[TEST STORE] ').replace('<body>','<body><div style="padding:10px;background:#ffd67a;text-align:center;font-weight:800">TEST STORE — isolated data, no real payment or delivery</div>');
await fs.writeFile(path.join(target,'index.html'),html);
let js=await fs.readFile(path.join(source,'wp-content/themes/gw-store/assets/js/store.js'),'utf8');
js=js.replace("const ordersApi = '/api/store.php';","const ordersApi = new URL('api/store.php',location.href).pathname;");
// Scope storage keys only; UI class names such as gw-demo-badge must stay unchanged.
for(const suffix of ['cart-v2','accounts-v2','session-v1','products-v1','orders-v1'])js=js.replaceAll(`'gw-demo-${suffix}'`,`'${name}-${suffix}'`);
js=js.replaceAll("'gw-delivery-pin'",`'${name}-pin'`).replaceAll("'gw-delivery-settings-v1'",`'${name}-delivery'`).replaceAll("'gw-customer-reset-2026-11-07-v1'",`'${name}-reset-2026-11-07-v1'`);
await fs.writeFile(path.join(target,'wp-content/themes/gw-store/assets/js/store.js'),js);
for(const file of ['store.php','delivery.php','inventory.php','orders.php']){
 let content;try{content=await fs.readFile(path.join(source,'api',file),'utf8');}catch(error){if(error.code==='ENOENT')continue;throw error;}
 if(file==='store.php')content=content.replace('session_start();',`session_name('${name.replaceAll('-','')}');\nsession_start();`);
 await fs.writeFile(path.join(target,'api',file),content);
}
for(const file of ['web.config','.htaccess'])await fs.copyFile(path.join(source,'private-data',file),path.join(target,'private-data',file));
// Rebuilding must retain test accounts/orders so browser and API sessions remain usable.
for(const [file,value] of [['products.json',[]],['orders.json',[]],['delivery-areas.json',{revision:0,areas:[]}]]){
 try{await fs.writeFile(path.join(target,'private-data',file),JSON.stringify(value),{flag:'wx'});}catch(error){if(error.code!=='EEXIST')throw error;}
}
console.log(target);
