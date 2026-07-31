"use client";

import { useEffect, useMemo, useState } from "react";
import type { Property } from "@/data/content";
import { PropertyCard } from "@/components/Cards";

export function PropertyGrid() {
  const [location, setLocation] = useState("Toutes");
  const [managed,setManaged]=useState<Property[]>([]);
  useEffect(()=>{fetch("/api/properties").then(response=>response.ok?response.json():[]).then((rows:Property[])=>setManaged(rows.map((row,index)=>({...row,tone:(index%6)+1})))).catch(()=>setManaged([]));},[]);
  const collection=managed;
  const availableLocations=useMemo(()=>["Toutes",...Array.from(new Set(collection.map(item=>item.location)))],[collection]);
  const visible = location === "Toutes" ? collection : collection.filter((property) => property.location === location);

  return (
    <>
      {collection.length > 0 && <div className="property-filters" aria-label="Filtrer les propriétés par localisation">
        {availableLocations.map((item) => (
          <button
            key={item}
            type="button"
            className={location === item ? "active" : ""}
            aria-pressed={location === item}
            onClick={() => setLocation(item)}
          >
            {item}
          </button>
        ))}
      </div>}
      {collection.length === 0 ? <p className="property-empty" aria-live="polite">Aucun bien actuellement.</p> : <div className="card-grid three" aria-live="polite">
        {visible.map((property) => <PropertyCard key={property.slug} property={property} />)}
      </div>}
    </>
  );
}
