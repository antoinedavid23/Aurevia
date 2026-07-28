"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Item={id:number;name:string;slug:string;location:string;bedrooms:number;guests:number;baths:number;status:string};

export function AdminPropertyManager(){
  const [items,setItems]=useState<Item[]>([]);
  const [message,setMessage]=useState("");
  async function refresh(){const response=await fetch("/api/properties");setItems(await response.json());}
  useEffect(()=>{fetch("/api/properties").then(response=>response.json()).then(setItems).catch(()=>setItems([]));},[]);
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();setMessage("Enregistrement…");
    const data=Object.fromEntries(new FormData(event.currentTarget));
    const response=await fetch("/api/properties",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
    if(response.ok){event.currentTarget.reset();setMessage("Bien enregistré.");await refresh();}else setMessage("Impossible d’enregistrer ce bien.");
  }
  async function remove(id:number){if(!confirm("Supprimer ce bien ?"))return;await fetch(`/api/properties/${id}`,{method:"DELETE"});await refresh();}
  return <div className="admin-layout">
    <form className="form-card" onSubmit={submit}><h2>Ajouter un bien</h2><div className="field-row"><label>Nom<input name="name" required/></label><label>Slug<input name="slug" required pattern="[a-z0-9-]+"/></label></div><label>Localisation<input name="location" required/></label><div className="field-row"><label>Chambres<input name="bedrooms" type="number" min="1" defaultValue="2"/></label><label>Voyageurs<input name="guests" type="number" min="1" defaultValue="4"/></label></div><div className="field-row"><label>Salles de bain<input name="baths" type="number" min="1" defaultValue="1"/></label><label>Statut<select name="status"><option value="draft">Brouillon</option><option value="published">Publié</option></select></label></div><label>Chemin de l’image<input name="image" defaultValue="/images/home/hero-concierge.webp"/></label><button className="button" type="submit"><Plus size={15}/>Ajouter</button><p role="status">{message}</p></form>
    <div className="admin-list"><h2>Biens publiés</h2>{items.length===0?<p>Aucun bien publié pour le moment.</p>:items.map(item=><article key={item.id}><div><span>{item.location}</span><h3>{item.name}</h3><p>{item.bedrooms} ch. · {item.guests} voyageurs · {item.baths} sdb</p></div><button onClick={()=>remove(item.id)} aria-label={`Supprimer ${item.name}`}><Trash2 size={17}/></button></article>)}</div>
  </div>;
}
