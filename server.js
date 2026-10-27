const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname, port=process.env.PORT||3000;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
function normalizeProducts(input){
 const list=Array.isArray(input)?input:(input.products||input.productos||input.items||input.data||[]);
 if(!Array.isArray(list))return [];
 return list.filter(p=>{
  const cat=p.category||p.categoria||p.categoryName||p.nombreCategoria||p.category?.name||'';
  return String(typeof cat==='object'?(cat.name||cat.nombre||''):cat).trim().toUpperCase()==='COMBO';
 }).map((p,i)=>({id:p.id||i,name:p.name||p.nombre||p.title||'Combo',price:p.price??p.precio??p.salePrice??'',image:p.image||p.imagen||p.imageUrl||p.foto||''}));
}
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/promos'){
  res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
  try{
   if(process.env.RESTOLIA_FEED_URL){
    const target=new URL(process.env.RESTOLIA_FEED_URL);
    if(target.protocol!=='https:')throw Error('Feed must use HTTPS');
    const response=await fetch(target,{signal:AbortSignal.timeout(12000),headers:{Accept:'application/json'}});
    if(!response.ok)throw Error('Feed HTTP '+response.status);
    const products=normalizeProducts(await response.json());
    return res.end(JSON.stringify({source:'restolia-feed',products}));
   }
   const data=JSON.parse(fs.readFileSync(path.join(root,'promos.json'),'utf8'));
   return res.end(JSON.stringify({source:'local',products:normalizeProducts(data)}));
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
