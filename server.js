const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname, port=process.env.PORT||3000;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
const RESTOLIA_URL='https://vertex.lambdaclass.com/api/v1/public/venues/sim-n-ram-n-andr-s-main/menu';
function normalizeProducts(input){
 const list=input?.data?.products ?? input?.products ?? input?.items ?? [];
 if(!Array.isArray(list))throw Error('RESTOLIA no devolvió una lista de productos');
 return list.filter(p=>String(p.category_name??p.category?.name??p.category??'').trim().toUpperCase()==='COMBO')
 .map(p=>({id:p.id,name:p.name,price:Number(p.price),image:p.image_url||p.thumb_url||''}));
}
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/promos'){
  res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
  try{
   {
    const target=new URL(process.env.RESTOLIA_FEED_URL||RESTOLIA_URL);
    if(target.protocol!=='https:')throw Error('Feed must use HTTPS');
    const response=await fetch(target,{signal:AbortSignal.timeout(12000),headers:{Accept:'application/json'}});
    if(!response.ok)throw Error('Feed HTTP '+response.status);
    const products=normalizeProducts(await response.json());
    return res.end(JSON.stringify({source:'restolia',updatedAt:new Date().toISOString(),products}));
   }

  }catch(err){res.statusCode=502;return res.end(JSON.stringify({error:'No se pudo obtener el catálogo',details:err.message}));}
 }
 let pathname=decodeURIComponent(url.pathname);if(pathname==='/')pathname='/index.html';
 const file=path.resolve(root,'.'+pathname);
 if(!file.startsWith(root+path.sep)){res.statusCode=403;return res.end('Forbidden');}
 fs.stat(file,(err,stat)=>{
  if(err||!stat.isFile()){res.statusCode=404;return res.end('Not found');}
  res.setHeader('Content-Type',types[path.extname(file).toLowerCase()]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
 });
}).listen(port,()=>console.log('Simón Café TV en puerto '+port));
