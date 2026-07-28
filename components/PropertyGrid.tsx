"use client";

import { useState } from "react";
import { properties } from "@/data/content";
import { PropertyCard } from "@/components/Cards";

const locations = ["Tutte", "Genova", "Portofino", "Santa Margherita Ligure", "Camogli", "Rapallo", "Nervi"];

export function PropertyGrid() {
  const [location, setLocation] = useState("Tutte");
  const visible = location === "Tutte" ? properties : properties.filter((property) => property.location === location);

  return (
    <>
      <div className="property-filters" aria-label="Filtra le proprietà per località">
        {locations.map((item) => (
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
      </div>
      <div className="card-grid three" aria-live="polite">
        {visible.map((property) => <PropertyCard key={property.slug} property={property} />)}
      </div>
    </>
  );
}
