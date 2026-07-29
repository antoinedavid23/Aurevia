"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, Check, ExternalLink, Inbox, Mail, Phone } from "lucide-react";

type Lead = {
  id: number; kind: "contact" | "valuation"; name: string; surname: string;
  email: string; phone: string | null; city: string | null; propertyType: string | null;
  message: string; status: "new" | "read" | "archived"; createdAt: string | number;
};

export function AdminLeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<"active" | "archived">("active");
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/leads", { cache: "no-store" }).then(response => response.ok ? response.json() : []).then(setLeads).finally(() => setLoading(false)); }, []);
  async function updateStatus(id: number, status: Lead["status"]) {
    const response = await fetch("/api/leads", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (response.ok) setLeads(items => items.map(item => item.id === id ? { ...item, status } : item));
  }
  const visible = useMemo(() => leads.filter(lead => filter === "archived" ? lead.status === "archived" : lead.status !== "archived"), [leads, filter]);
  const unread = leads.filter(lead => lead.status === "new").length;

  return <section className="admin-inbox">
    <div className="admin-section-head">
      <div><p className="eyebrow">Demandes reçues</p><h2>Boîte de réception</h2><p>{unread} nouvelle{unread > 1 ? "s" : ""} demande{unread > 1 ? "s" : ""} à traiter.</p></div>
      <div className="admin-inbox-filters">
        <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}><Inbox size={16}/> Actives</button>
        <button className={filter === "archived" ? "active" : ""} onClick={() => setFilter("archived")}><Archive size={16}/> Archivées</button>
      </div>
    </div>
    {loading ? <p>Chargement des demandes…</p> : visible.length === 0 ? <div className="admin-empty"><Inbox/><p>Aucune demande dans cette catégorie.</p></div> :
      <div className="lead-list">{visible.map(lead => <article className={`lead-card status-${lead.status}`} key={lead.id}>
        <div className="lead-card-top"><div><span>{lead.kind === "valuation" ? "Évaluation" : "Contact"} · #{lead.id}</span><h3>{lead.name} {lead.surname}</h3></div><time>{new Date(lead.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</time></div>
        <div className="lead-meta"><a href={`mailto:${lead.email}`}><Mail size={15}/>{lead.email}<ExternalLink size={13}/></a>{lead.phone && <a href={`tel:${lead.phone}`}><Phone size={15}/>{lead.phone}</a>}{lead.city && <span>{lead.city}</span>}{lead.propertyType && <span>{lead.propertyType}</span>}</div>
        <p className="lead-message">{lead.message}</p>
        <div className="lead-actions">{lead.status === "new" && <button onClick={() => updateStatus(lead.id, "read")}><Check size={15}/> Marquer comme lue</button>}{lead.status !== "archived" ? <button onClick={() => updateStatus(lead.id, "archived")}><Archive size={15}/> Archiver</button> : <button onClick={() => updateStatus(lead.id, "read")}><Inbox size={15}/> Restaurer</button>}</div>
      </article>)}</div>}
  </section>;
}
