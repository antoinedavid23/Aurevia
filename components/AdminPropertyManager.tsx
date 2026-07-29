"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

type Item={id:number;name:string;slug:string;location:string;bedrooms:number;guests:number;baths:number;status:string;image:string};

export function AdminPropertyManager(){
  const [items,setItems]=useState<Item[]>([]);
  const [message,setMessage]=useState("");
  const [editing,setEditing]=useState<Item|null>(null);
  async function refresh(){const response=await fetch("/api/properties");setItems(await response.json());}
  useEffect(()=>{fetch("/api/properties").then(response=>response.json()).then(setItems).catch(()=>setItems([]));},[]);
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();setMessage("Enregistrement…");
    const data=Object.fromEntries(new FormData(event.currentTarget));
    const endpoint=editing?`/api/properties/${editing.id}`:"/api/properties";
    const response=await fetch(endpoint,{method:editing?"PATCH":"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
    if(response.ok){event.currentTarget.reset();setEditing(null);setMessage(editing?"Bien modifié.":"Bien enregistré.");await refresh();}else setMessage("Impossible d’enregistrer ce bien.");
  }
  async function remove(id:number){if(!confirm("Supprimer ce bien ?"))return;await fetch(`/api/properties/${id}`,{method:"DELETE"});await refresh();}
  return <div className="admin-layout">
    <form key={editing?.id||"new"} className="form-card" onSubmit={submit}><div className="admin-form-title"><h2>{editing?"Modifier le bien":"Ajouter un bien"}</h2>{editing&&<button type="button" onClick={()=>setEditing(null)} aria-label="Annuler la modification"><X/></button>}</div><div className="field-row"><label>Nom<input name="name" required defaultValue={editing?.name}/></label><label>Slug<input name="slug" required pattern="[a-z0-9-]+" defaultValue={editing?.slug}/></label></div><label>Localisation<input name="location" required defaultValue={editing?.location}/></label><div className="field-row"><label>Chambres<input name="bedrooms" type="number" min="1" defaultValue={editing?.bedrooms||2}/></label><label>Voyageurs<input name="guests" type="number" min="1" defaultValue={editing?.guests||4}/></label></div><div className="field-row"><label>Salles de bain<input name="baths" type="number" min="1" defaultValue={editing?.baths||1}/></label><label>Statut<select name="status" defaultValue={editing?.status||"draft"}><option value="draft">Invisible / brouillon</option><option value="published">Visible / publié</option></select></label></div><label>Chemin de l’image<input name="image" defaultValue={editing?.image||"/images/home/hero-concierge.webp"}/></label><button className="button" type="submit">{editing?<Pencil size={15}/>:<Plus size={15}/>} {editing?"Enregistrer les modifications":"Ajouter le bien"}</button><p role="status">{message}</p></form>
    <div className="admin-list"><h2>Biens gérés</h2>{items.length===0?<p>Aucun bien enregistré pour le moment.</p>:items.map(item=><article key={item.id}><div><span>{item.location} · {item.status==="published"?"Visible":"Brouillon"}</span><h3>{item.name}</h3><p>{item.bedrooms} ch. · {item.guests} voyageurs · {item.baths} sdb</p></div><div className="admin-actions"><button onClick={()=>setEditing(item)} aria-label={`Modifier ${item.name}`}><Pencil size={17}/></button><button onClick={()=>remove(item.id)} aria-label={`Supprimer ${item.name}`}><Trash2 size={17}/></button></div></article>)}</div>
  </div>;
}
