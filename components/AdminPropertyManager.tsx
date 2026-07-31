"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive, BedDouble, Bath, Check, Copy, Eye, EyeOff, FileImage, Home,
  ImagePlus, MapPin, Pencil, Plus, Save, Search, Sparkles, Trash2, Upload, Users, X,
} from "lucide-react";

type Status = "draft" | "published" | "archived";
type Item = {
  id: number;
  name: string;
  slug: string;
  location: string;
  address: string;
  propertyType: string;
  bedrooms: number;
  guests: number;
  baths: number;
  surface: number | null;
  shortDescription: string;
  description: string;
  amenities: string[];
  image: string;
  gallery: string[];
  status: Status;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  updatedAt?: string;
};

const emptyItem: Omit<Item, "id"> = {
  name: "", slug: "", location: "", address: "", propertyType: "Appartement",
  bedrooms: 1, guests: 2, baths: 1, surface: null, shortDescription: "", description: "",
  amenities: [], image: "", gallery: [], status: "draft", featured: false,
  seoTitle: "", seoDescription: "",
};

const suggestedAmenities = [
  "Vue mer", "Terrasse", "Piscine / jacuzzi", "Parking", "Climatisation",
  "Wi-Fi", "Cuisine équipée", "Ascenseur", "Jardin", "Accès privé",
];

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function AdminPropertyManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [draft, setDraft] = useState<Omit<Item, "id"> & { id?: number }>(emptyItem);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<"all" | Status>("all");
  const [tab, setTab] = useState<"identity" | "content" | "media" | "settings">("identity");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [amenityInput, setAmenityInput] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function refresh() {
    const response = await fetch("/api/properties", { cache: "no-store" });
    if (!response.ok) throw new Error("Chargement impossible");
    setItems(await response.json());
  }

  useEffect(() => {
    fetch("/api/properties", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  function startNew() {
    setDraft(emptyItem); setEditing(true); setTab("identity"); setMessage("");
    requestAnimationFrame(() => document.getElementById("property-editor")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function startEdit(item: Item) {
    setDraft({ ...item, amenities: item.amenities || [], gallery: item.gallery || [] });
    setEditing(true); setTab("identity"); setMessage("");
    requestAnimationFrame(() => document.getElementById("property-editor")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function update<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function addAmenity(value = amenityInput) {
    const clean = value.trim();
    if (clean && !draft.amenities.includes(clean)) update("amenities", [...draft.amenities, clean]);
    setAmenityInput("");
  }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true); setMessage("Téléversement des images…");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData(); body.append("file", file);
        const response = await fetch("/api/media", { method: "POST", body });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Téléversement impossible");
        uploaded.push(result.url);
      }
      setDraft((current) => ({
        ...current,
        image: current.image || uploaded[0],
        gallery: [...current.gallery, ...uploaded].slice(0, 20),
      }));
      setTab("media"); setMessage(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} ajoutée${uploaded.length > 1 ? "s" : ""}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Téléversement impossible.");
    } finally { setUploading(false); if (fileInput.current) fileInput.current.value = ""; }
  }

  async function save(statusOverride?: Status) {
    const payload = { ...draft, status: statusOverride || draft.status };
    if (!payload.name.trim() || !payload.slug.trim() || !payload.location.trim()) {
      setTab("identity"); setMessage("Complétez le nom, l’adresse web et la localisation."); return;
    }
    setSaving(true); setMessage("Enregistrement…");
    const endpoint = draft.id ? `/api/properties/${draft.id}` : "/api/properties";
    const response = await fetch(endpoint, {
      method: draft.id ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(result.error || "Impossible d’enregistrer ce bien.");
      setSaving(false); return;
    }
    setMessage(statusOverride === "published" ? "Le bien est maintenant visible sur le site." : "Modifications enregistrées.");
    setDraft({ ...result }); setEditing(true); setSaving(false); await refresh();
  }

  async function patchStatus(item: Item, status: Status) {
    const response = await fetch(`/api/properties/${item.id}`, {
      method: "PATCH", headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...item, status }),
    });
    if (response.ok) await refresh();
  }

  async function remove(item: Item) {
    if (!confirm(`Supprimer définitivement « ${item.name} » ? Cette action est irréversible.`)) return;
    const response = await fetch(`/api/properties/${item.id}`, { method: "DELETE" });
    if (response.ok) { if (draft.id === item.id) { setDraft(emptyItem); setEditing(false); } await refresh(); }
  }

  function duplicate(item: Item) {
    const suffix = Date.now().toString().slice(-5);
    setDraft({ ...item, id: undefined, name: `${item.name} — copie`, slug: `${item.slug}-copie-${suffix}`, status: "draft", featured: false });
    setEditing(true); setTab("identity");
  }

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) =>
      (visibility === "all" || item.status === visibility) &&
      (!normalized || `${item.name} ${item.location} ${item.slug} ${item.propertyType}`.toLowerCase().includes(normalized)),
    );
  }, [items, query, visibility]);

  const counts = {
    published: items.filter((item) => item.status === "published").length,
    draft: items.filter((item) => item.status === "draft").length,
    archived: items.filter((item) => item.status === "archived").length,
  };

  return (
    <div className="property-manager" id="biens">
      <div className="property-manager-toolbar">
        <div className="property-manager-stats">
          <span><strong>{items.length}</strong> au total</span>
          <span><strong>{counts.published}</strong> publiés</span>
          <span><strong>{counts.draft}</strong> brouillons</span>
          <span><strong>{counts.archived}</strong> archivés</span>
        </div>
        <button className="button" type="button" onClick={startNew}><Plus size={16} /> Nouveau bien</button>
      </div>

      {editing && (
        <section className="property-editor" id="property-editor">
          <header className="property-editor-header">
            <div>
              <p className="eyebrow">{draft.id ? "Fiche du bien" : "Création d’un bien"}</p>
              <h3>{draft.name || "Nouveau bien"}</h3>
              <span>{draft.status === "published" ? "Visible sur le site" : draft.status === "archived" ? "Archivé" : "Brouillon privé"}</span>
            </div>
            <div className="property-editor-header-actions">
              {draft.id && <a className="admin-icon-button" href={`/proprieta/${draft.slug}`} target="_blank" rel="noreferrer" aria-label="Prévisualiser"><Eye size={17} /></a>}
              <button className="admin-icon-button" type="button" onClick={() => setEditing(false)} aria-label="Fermer"><X size={18} /></button>
            </div>
          </header>

          <nav className="property-editor-tabs" aria-label="Sections de la fiche">
            {[
              ["identity", Home, "Informations"],
              ["content", Pencil, "Présentation"],
              ["media", FileImage, "Photos"],
              ["settings", Sparkles, "Publication"],
            ].map(([key, Icon, label]) => {
              const TabIcon = Icon as typeof Home;
              return <button key={key as string} type="button" className={tab === key ? "active" : ""} onClick={() => setTab(key as typeof tab)}><TabIcon size={15} />{label as string}</button>;
            })}
          </nav>

          <div className="property-editor-body">
            {tab === "identity" && <div className="property-form-grid">
              <label className="span-2">Nom public du bien<input value={draft.name} onChange={(e) => {
                const name = e.target.value; setDraft((current) => ({ ...current, name, slug: current.id || current.slug ? current.slug : slugify(name) }));
              }} placeholder="Ex. Attico Castelletto" /></label>
              <label>Adresse web<input value={draft.slug} onChange={(e) => update("slug", slugify(e.target.value))} placeholder="attico-castelletto" /></label>
              <label>Type de bien<select value={draft.propertyType} onChange={(e) => update("propertyType", e.target.value)}>
                {["Appartement", "Attique", "Villa", "Maison indépendante", "Palazzo", "Autre"].map((type) => <option key={type}>{type}</option>)}
              </select></label>
              <label>Localisation<input value={draft.location} onChange={(e) => update("location", e.target.value)} placeholder="Gênes — Albaro" /></label>
              <label>Adresse privée <small>Jamais affichée publiquement</small><input value={draft.address} onChange={(e) => update("address", e.target.value)} placeholder="Adresse complète" /></label>
              <label>Chambres<input type="number" min="0" value={draft.bedrooms} onChange={(e) => update("bedrooms", Number(e.target.value))} /></label>
              <label>Voyageurs<input type="number" min="1" value={draft.guests} onChange={(e) => update("guests", Number(e.target.value))} /></label>
              <label>Salles de bain<input type="number" min="0" value={draft.baths} onChange={(e) => update("baths", Number(e.target.value))} /></label>
              <label>Surface en m²<input type="number" min="1" value={draft.surface ?? ""} onChange={(e) => update("surface", e.target.value ? Number(e.target.value) : null)} /></label>
            </div>}

            {tab === "content" && <div className="property-content-editor">
              <label>Accroche de la carte <span>{draft.shortDescription.length}/240</span>
                <textarea rows={3} value={draft.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} placeholder="Une phrase précise qui donne envie de découvrir le bien." />
              </label>
              <label>Description complète <span>{draft.description.length}/6000</span>
                <textarea rows={8} value={draft.description} onChange={(e) => update("description", e.target.value)} placeholder="Décrivez l’atmosphère, les espaces, la situation et ce qui rend ce bien singulier." />
              </label>
              <div className="amenities-editor">
                <p>Équipements et points forts</p>
                <div className="amenity-suggestions">{suggestedAmenities.map((amenity) => <button type="button" className={draft.amenities.includes(amenity) ? "selected" : ""} key={amenity} onClick={() => draft.amenities.includes(amenity) ? update("amenities", draft.amenities.filter((item) => item !== amenity)) : addAmenity(amenity)}>{draft.amenities.includes(amenity) && <Check size={13} />}{amenity}</button>)}</div>
                <div className="amenity-custom"><input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity(); } }} placeholder="Ajouter un équipement personnalisé" /><button type="button" onClick={() => addAmenity()}><Plus size={15} /></button></div>
                <div className="amenity-tags">{draft.amenities.filter((item) => !suggestedAmenities.includes(item)).map((item) => <span key={item}>{item}<button type="button" onClick={() => update("amenities", draft.amenities.filter((value) => value !== item))}><X size={12} /></button></span>)}</div>
              </div>
            </div>}

            {tab === "media" && <div className="property-media-editor">
              <button className="media-dropzone" type="button" disabled={uploading} onClick={() => fileInput.current?.click()}>
                <Upload size={26} /><strong>{uploading ? "Téléversement en cours…" : "Ajouter des photos"}</strong>
                <span>JPG, PNG, WebP ou AVIF · 8 Mo maximum par image</span>
              </button>
              <input ref={fileInput} hidden multiple type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => uploadImages(e.target.files)} />
              {draft.gallery.length > 0 ? <div className="media-grid">{draft.gallery.map((url, index) => <figure key={`${url}-${index}`} className={draft.image === url ? "cover" : ""}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" />
                <figcaption><button type="button" onClick={() => update("image", url)}>{draft.image === url ? "Photo principale" : "Définir en couverture"}</button><button type="button" aria-label="Retirer l’image" onClick={() => { update("gallery", draft.gallery.filter((item) => item !== url)); if (draft.image === url) update("image", draft.gallery.find((item) => item !== url) || ""); }}><Trash2 size={14} /></button></figcaption>
              </figure>)}</div> : <div className="media-empty"><ImagePlus size={28} /><p>Aucune photo ajoutée.</p><span>Commencez par la photo principale, puis ajoutez la galerie.</span></div>}
            </div>}

            {tab === "settings" && <div className="property-settings-grid">
              <div className="publication-choice">
                <p>État de la fiche</p>
                {[
                  ["draft", EyeOff, "Brouillon", "Visible uniquement dans l’administration."],
                  ["published", Eye, "Publié", "Visible dans la collection et accessible au public."],
                  ["archived", Archive, "Archivé", "Conservé, mais retiré de la collection."],
                ].map(([value, Icon, title, text]) => {
                  const StatusIcon = Icon as typeof Eye;
                  return <button key={value as string} type="button" className={draft.status === value ? "active" : ""} onClick={() => update("status", value as Status)}><StatusIcon size={18} /><span><strong>{title as string}</strong><small>{text as string}</small></span>{draft.status === value && <Check size={17} />}</button>;
                })}
              </div>
              <label className="featured-toggle"><input type="checkbox" checked={draft.featured} onChange={(e) => update("featured", e.target.checked)} /><span><strong>Mettre ce bien en avant</strong><small>Le bien pourra apparaître prioritairement dans les sélections.</small></span></label>
              <label>Titre SEO <span>{draft.seoTitle.length}/70</span><input value={draft.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} placeholder={draft.name || "Titre de la page"} /></label>
              <label>Description SEO <span>{draft.seoDescription.length}/170</span><textarea rows={3} value={draft.seoDescription} onChange={(e) => update("seoDescription", e.target.value)} placeholder={draft.shortDescription || "Description destinée aux moteurs de recherche"} /></label>
            </div>}
          </div>

          <footer className="property-editor-footer">
            <p role="status">{message}</p>
            <div><button type="button" className="button secondary" onClick={() => setEditing(false)}>Fermer</button><button type="button" className="button secondary" disabled={saving} onClick={() => save()}><Save size={15} /> Enregistrer</button>{draft.status !== "published" && <button type="button" className="button" disabled={saving} onClick={() => save("published")}><Eye size={15} /> Publier</button>}</div>
          </footer>
        </section>
      )}

      <section className="property-catalogue">
        <div className="admin-list-heading">
          <div><p className="eyebrow">Catalogue</p><h3>Vos biens</h3></div>
          <div className="admin-property-filters">
            <label className="admin-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom, ville, type…" /></label>
            <select value={visibility} onChange={(e) => setVisibility(e.target.value as typeof visibility)} aria-label="Filtrer par statut">
              <option value="all">Tous les statuts</option><option value="published">Publiés</option><option value="draft">Brouillons</option><option value="archived">Archivés</option>
            </select>
          </div>
        </div>
        {visibleItems.length === 0 ? <div className="catalogue-empty"><Home size={30} /><h3>{items.length ? "Aucun résultat" : "Votre catalogue est vide"}</h3><p>{items.length ? "Modifiez vos filtres pour retrouver un bien." : "Créez votre première fiche et préparez-la avant sa publication."}</p>{!items.length && <button type="button" className="button" onClick={startNew}><Plus size={15} /> Ajouter un bien</button>}</div> :
          <div className="property-admin-grid">{visibleItems.map((item) => <article key={item.id}>
            <div className="property-admin-image" style={{ backgroundImage: item.image ? `linear-gradient(180deg,transparent,rgba(7,16,25,.72)),url("${item.image}")` : undefined }}>
              {!item.image && <FileImage size={28} />}<span className={`status ${item.status}`}>{item.status === "published" ? "Publié" : item.status === "archived" ? "Archivé" : "Brouillon"}</span>{item.featured && <b><Sparkles size={12} /> À la une</b>}
            </div>
            <div className="property-admin-copy"><span><MapPin size={12} /> {item.location}</span><h3>{item.name}</h3><p>{item.shortDescription || "Présentation à compléter."}</p><div className="property-admin-facts"><span><BedDouble size={14} />{item.bedrooms}</span><span><Users size={14} />{item.guests}</span><span><Bath size={14} />{item.baths}</span>{item.surface && <span>{item.surface} m²</span>}</div></div>
            <footer><button type="button" onClick={() => startEdit(item)}><Pencil size={15} /> Modifier</button>{item.status === "published" ? <button type="button" onClick={() => patchStatus(item, "draft")}><EyeOff size={15} /> Masquer</button> : <button type="button" onClick={() => patchStatus(item, "published")}><Eye size={15} /> Publier</button>}<div className="property-more-actions"><button type="button" title="Dupliquer" onClick={() => duplicate(item)}><Copy size={15} /></button><button type="button" title="Supprimer" onClick={() => remove(item)}><Trash2 size={15} /></button></div></footer>
          </article>)}</div>}
      </section>
    </div>
  );
}
