import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const prefixes=['/wp-content/themes/gw-store/assets/','/wp-content/plugins/gw-tee-designer/assets/'];
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 try{
  let pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  if(pathname==='/'){res.writeHead(302,{Location:'/preview/index.html'});res.end();return;}
  if(pathname!=='/preview/index.html'&&!prefixes.some(prefix=>pathname.startsWith(prefix))){res.writeHead(404);res.end();return;}
  const file=await fs.realpath(path.resolve(root,'.'+pathname));
  const allowed=file===path.join(root,'preview/index.html')||prefixes.some(prefix=>file.startsWith(path.resolve(root,'.'+prefix)+path.sep));
  const type=types[path.extname(file)];
  if(!allowed||!type){res.writeHead(404);res.end();return;}
  const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404);res.end();}
});
server.listen(8765,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:8765/preview/index.html'));
