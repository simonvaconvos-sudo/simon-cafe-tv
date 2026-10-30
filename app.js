const el=id=>document.getElementById(id);
let products=[],current=0,playing=false;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const money=value=>{const n=Number(value);return Number.isFinite(n)?new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n):''};
async function load(){try{const res=await fetch('/api/promos',{cache:'no-store'});if(!res.ok)throw Error('Error de conexión');const json=await res.json();if(!Array.isArray(json.products))throw Error('Formato de catálogo incorrecto');products=json.products.filter(p=>p&&p.name);if(current>=products.length)current=0;el('status').hidden=!!products.length;if(!products.length)el('status').textContent='No hay productos en la categoría COMBO.';}catch(e){if(!products.length){el('status').hidden=false;el('status').textContent='No se pudo cargar RESTOLIA. Se volverá a intentar.';}}}
async function show(p){
 const name=el('name'),price=el('price');
 name.textContent=String(p.name);name.classList.remove('cinematic');
 price.textContent=money(p.price);price.classList.remove('boom');
 el('progressbar').style.width='0';
 const img=el('photo'),placeholder=el('placeholder');img.hidden=true;img.removeAttribute('src');placeholder.hidden=false;
 if(p.image){img.onload=()=>{img.hidden=false;placeholder.hidden=true};img.onerror=()=>{img.hidden=true;placeholder.hidden=false};img.src=p.image;}
 await wait(600);
 void name.offsetWidth;name.classList.add('cinematic');
 await wait(1200);
 price.classList.add('boom');await wait(800);
 el('progressbar').style.transition='none';el('progressbar').style.width='0';void el('progressbar').offsetWidth;el('progressbar').style.transition='width 5s linear';el('progressbar').style.width='100%';await wait(5000);
}
function updateClock(){el('clock').textContent=new Intl.DateTimeFormat('es-AR',{timeZone:'America/Argentina/Mendoza',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());}
const WEATHER_DIRECT='https://api.open-meteo.com/v1/forecast?latitude=-32.8895&longitude=-68.8458&current=temperature_2m&timezone=America%2FArgentina%2FMendoza';
let lastWeatherSuccess=0;
async function updateWeather(){
 const target=el('weather');
 for(const endpoint of ['/api/weather',WEATHER_DIRECT]){
  try{
   const controller=new AbortController();
   const timeout=setTimeout(()=>controller.abort(),8000);
   let response;
   try{response=await fetch(endpoint,{cache:'no-store',signal:controller.signal});}
   finally{clearTimeout(timeout);}
   if(!response.ok)throw Error('HTTP '+response.status);
   const data=await response.json();
   const value=endpoint==='/api/weather'?data.temperature:data?.current?.temperature_2m;
   if(value===null||value===undefined||!Number.isFinite(Number(value)))throw Error('Temperatura inválida');
   target.textContent='Mendoza · '+Math.round(Number(value))+'°C';
   lastWeatherSuccess=Date.now();
   return;
  }catch(error){console.warn('Temperatura: error en '+endpoint,error);}
 }
 if(!lastWeatherSuccess)target.textContent='Mendoza · --°C';
}
updateClock();setInterval(updateClock,10000);
updateWeather();setInterval(()=>updateWeather(),5*60*1000);
window.addEventListener('online',updateWeather);
async function run(){if(playing)return;playing=true;await load();setInterval(load,300000);while(true){if(!products.length){await wait(4000);continue}const p=products[current];if(p)await show(p);current=(current+1)%products.length;await wait(350)}}
run();
