import { useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '../data/products';
import '../styles/estilocomentarios.css';

const CMT_KEY = 'comments_v1';


function readAll(){
try { return JSON.parse(localStorage.getItem(CMT_KEY)) ?? []; }
catch { return []; }
}
function writeAll(arr){
try { localStorage.setItem(CMT_KEY, JSON.stringify(arr)); } catch {""}
}


function renderStars(val){
return '★'.repeat(val) + '☆'.repeat(5-val);
}


export default function Comentarios(){
const [all, setAll] = useState(() => readAll());
const [prod, setProd] = useState( PRODUCTS[0]?.id || 1 );
const [stars, setStars] = useState(5);
const [text, setText] = useState('');


const list = useMemo(()=> all.filter(x=>x.productId===Number(prod)), [all, prod]);


useEffect(()=>{ writeAll(all); }, [all]);


function add(){
if(!text.trim()) return;
const id = all.length ? Math.max(...all.map(c=>c.id||0))+1 : 1;
setAll(prev => [...prev, { id, productId:Number(prod), stars, text, createdAt: Date.now() }]);
setText(''); setStars(5);
}
function clear(){ setAll(prev => prev.filter(c=>c.productId!==Number(prod))); }


return (
<main>
<h1>Comentarios</h1>
<div className="row" style={{gap:8, alignItems:'center'}}>
<select value={prod} onChange={e=>setProd(Number(e.target.value))}>
{PRODUCTS.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
</select>
<span style={{fontSize:20}}>{renderStars(stars)}</span>
<input type="range" min="1" max="5" value={stars} onChange={e=>setStars(Number(e.target.value))} />
</div>
<div className="row" style={{gap:8, marginTop:8}}>
<input value={text} onChange={e=>setText(e.target.value)} placeholder="Escribe tu comentario..." />
<button onClick={add}>Agregar</button>
<button onClick={clear}>Borrar todos</button>
</div>


<ul style={{marginTop:16}}>
{list.map(c => (
<li key={c.id}>
<strong>{renderStars(c.stars)}</strong> — {c.text}
</li>
))}
</ul>
</main>
);
}