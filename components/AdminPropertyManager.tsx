"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Eye, EyeOff, Pencil, Plus, Search, Trash2, X } from "lucide-react";

type Item = {
  id: number;
  name: string;
  slug: string;
  location: string;
  bedrooms: number;
  guests: number;
  baths: number;
  status: "draft" | "published";
  image: string;
};

export function AdminPropertyManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<"all" | Item["status"]>("all");

  async function refresh() {
    const response = await fetch("/api/properties", { cache: "no-store" });
    setItems(await response.json());
  }

  useEffect(() => {
    fetch("/api/properties", { cache: "no-store" })
      .then((response) => response.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Enregistrement…");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const isExisting = Boolean(editing?.id);
    const endpoint = isExisting ? `/api/properties/${editing!.id}` : "/api/properties";
    const response = await fetch(endpoint, {
      method: isExisting ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      event.currentTarget.reset();
      setEditing(null);
      setMessage(isExisting ? "Bien modifié." : "Bien enregistré.");
      await refresh();
    } else {
      setMessage("Impossible d’enregistrer ce bien. Vérifiez le slug et les champs.");
    }
  }

  async function remove(id: number) {
    if (!confirm("Supprimer définitivement ce bien ?")) return;
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function toggleVisibility(item: Item) {
    await fetch(`/api/properties/${item.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...item,
        status: item.status === "published" ? "draft" : "published",
      }),
    });
    await refresh();
  }

  function duplicate(item: Item) {
    const suffix = Date.now().toString().slice(-5);
    setEditing({
      ...item,
      id: 0,
      name: `${item.name} — copie`,
      slug: `${item.slug}-copie-${suffix}`,
      status: "draft",
    });
    document.getElementById("property-form")?.scrollIntoView({ behavior: "smooth" });
  }

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (visibility === "all" || item.status === visibility) &&
        (!normalized ||
          `${item.name} ${item.location} ${item.slug}`.toLowerCase().includes(normalized)),
    );
  }, [items, query, visibility]);

  const published = items.filter((item) => item.status === "published").length;

  return (
    <div className="admin-layout" id="biens">
      <form
        id="property-form"
        key={editing?.id || editing?.slug || "new"}
        className="form-card admin-property-form"
        onSubmit={submit}
      >
        <div className="admin-form-title">
          <div>
            <p className="eyebrow">{editing ? "Édition" : "Nouveau bien"}</p>
            <h3>{editing?.id ? "Modifier la fiche" : editing ? "Dupliquer le bien" : "Ajouter un bien"}</h3>
          </div>
          {editing && (
            <button type="button" onClick={() => setEditing(null)} aria-label="Annuler">
              <X />
            </button>
          )}
        </div>
        <div className="field-row">
          <label>
            Nom
            <input name="name" required defaultValue={editing?.name} />
          </label>
          <label>
            Adresse web
            <input name="slug" required pattern="[a-z0-9-]+" defaultValue={editing?.slug} />
          </label>
        </div>
        <label>
          Localisation
          <input name="location" required defaultValue={editing?.location} />
        </label>
        <div className="field-row">
          <label>
            Chambres
            <input name="bedrooms" type="number" min="1" defaultValue={editing?.bedrooms || 2} />
          </label>
          <label>
            Voyageurs
            <input name="guests" type="number" min="1" defaultValue={editing?.guests || 4} />
          </label>
        </div>
        <div className="field-row">
          <label>
            Salles de bain
            <input name="baths" type="number" min="1" defaultValue={editing?.baths || 1} />
          </label>
          <label>
            Visibilité
            <select name="status" defaultValue={editing?.status || "draft"}>
              <option value="draft">Brouillon — invisible</option>
              <option value="published">Publié — visible</option>
            </select>
          </label>
        </div>
        <label>
          Chemin de l’image
          <input
            name="image"
            defaultValue={editing?.image || "/images/home/hero-concierge.webp"}
          />
        </label>
        <button className="button" type="submit">
          {editing?.id ? <Pencil size={15} /> : <Plus size={15} />}
          {editing?.id ? "Enregistrer les modifications" : "Ajouter le bien"}
        </button>
        <p role="status" className="admin-form-message">{message}</p>
      </form>

      <div className="admin-list">
        <div className="admin-list-heading">
          <div>
            <p className="eyebrow">Catalogue</p>
            <h3>{items.length} biens · {published} publiés</h3>
          </div>
          <div className="admin-property-filters">
            <label className="admin-search">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher…"
              />
            </label>
            <select
              value={visibility}
              onChange={(event) => setVisibility(event.target.value as typeof visibility)}
              aria-label="Filtrer par visibilité"
            >
              <option value="all">Tous</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
            </select>
          </div>
        </div>
        {visibleItems.length === 0 ? (
          <p>Aucun bien ne correspond à ces critères.</p>
        ) : (
          visibleItems.map((item) => (
            <article key={item.id}>
              <div className="admin-property-thumb" style={{ backgroundImage: `url("${item.image}")` }} />
              <div>
                <span>
                  {item.location} · {item.status === "published" ? "Visible" : "Brouillon"}
                </span>
                <h3>{item.name}</h3>
                <p>
                  {item.bedrooms} ch. · {item.guests} voyageurs · {item.baths} sdb
                </p>
              </div>
              <div className="admin-actions">
                <button
                  onClick={() => toggleVisibility(item)}
                  aria-label={item.status === "published" ? `Masquer ${item.name}` : `Publier ${item.name}`}
                  title={item.status === "published" ? "Masquer" : "Publier"}
                >
                  {item.status === "published" ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
                <button onClick={() => duplicate(item)} aria-label={`Dupliquer ${item.name}`} title="Dupliquer">
                  <Copy size={17} />
                </button>
                <button
                  onClick={() => {
                    setEditing(item);
                    document.getElementById("property-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  aria-label={`Modifier ${item.name}`}
                  title="Modifier"
                >
                  <Pencil size={17} />
                </button>
                <button onClick={() => remove(item.id)} aria-label={`Supprimer ${item.name}`} title="Supprimer">
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
