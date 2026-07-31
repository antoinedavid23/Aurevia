"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  Inbox,
  Mail,
  Phone,
  Search,
} from "lucide-react";

type Lead = {
  id: number;
  kind: "contact" | "valuation";
  name: string;
  surname: string;
  email: string;
  phone: string | null;
  city: string | null;
  propertyType: string | null;
  subject: string | null;
  message: string;
  details: Record<string, unknown>;
  status: "new" | "read" | "archived";
  createdAt: string | number;
};

const detailLabels: Record<string, string> = {
  address: "Adresse",
  availability: "Disponibilité",
  bathrooms: "Salles de bain",
  bedrooms: "Chambres",
  capacity: "Capacité",
  currentRental: "Location actuelle",
  deadline: "Délai souhaité",
  goals: "Objectifs",
  numberOfProperties: "Nombre de biens",
  ownerType: "Profil",
  parking: "Parking",
  pool: "Piscine / jacuzzi",
  propertyType: "Type de bien",
  seaView: "Vue mer",
  services: "Services recherchés",
  surface: "Surface",
  terrace: "Terrasse",
};

function displayValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (value === null || value === undefined || value === "") return "Non renseigné";
  return String(value);
}

export function AdminLeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState<"active" | "new" | "read" | "archived">("active");
  const [kind, setKind] = useState<"all" | Lead["kind"]>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function refresh(silent = false) {
      if (!silent) setLoading(true);
      try {
        const response = await fetch("/api/leads", { cache: "no-store" });
        if (!response.ok) throw new Error("Inbox unavailable");
        const nextLeads = await response.json();
        if (active) {
          setLeads(nextLeads);
          setError("");
        }
      } catch {
        if (active) setError("La boîte de réception n’a pas pu être actualisée.");
      } finally {
        if (active && !silent) setLoading(false);
      }
    }
    void refresh();
    const interval = window.setInterval(() => void refresh(true), 20_000);
    const onFocus = () => void refresh(true);
    window.addEventListener("focus", onFocus);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  async function updateStatus(id: number, nextStatus: Lead["status"]) {
    const response = await fetch("/api/leads", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    if (response.ok) {
      setLeads((items) =>
        items.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)),
      );
    }
  }

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const statusMatches =
        status === "active"
          ? lead.status !== "archived"
          : lead.status === status;
      const kindMatches = kind === "all" || lead.kind === kind;
      const text = [
        lead.name,
        lead.surname,
        lead.email,
        lead.phone,
        lead.city,
        lead.propertyType,
        lead.subject,
        lead.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return statusMatches && kindMatches && (!normalized || text.includes(normalized));
    });
  }, [leads, status, kind, query]);

  const unread = leads.filter((lead) => lead.status === "new").length;

  function exportCsv() {
    const escape = (value: unknown) => `"${displayValue(value).replaceAll('"', '""')}"`;
    const rows = visible.map((lead) =>
      [
        lead.id,
        lead.kind,
        `${lead.name} ${lead.surname}`,
        lead.email,
        lead.phone,
        lead.city,
        lead.propertyType,
        lead.status,
        new Date(lead.createdAt).toLocaleString("fr-FR"),
        lead.message,
      ]
        .map(escape)
        .join(";"),
    );
    const csv = [
      "ID;Type;Nom;E-mail;Téléphone;Ville;Type de bien;Statut;Date;Message",
      ...rows,
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `demandes-aurevia-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="admin-inbox" id="demandes">
      <div className="admin-section-head">
        <div>
          <p className="eyebrow">Demandes reçues</p>
          <h2>Boîte de réception</h2>
          <p>
            {unread} nouvelle{unread > 1 ? "s" : ""} demande
            {unread > 1 ? "s" : ""} à traiter.
          </p>
        </div>
        <button className="admin-export" onClick={exportCsv} disabled={!visible.length}>
          <Download size={16} /> Exporter la sélection
        </button>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={17} />
          <span className="sr-only">Rechercher une demande</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nom, e-mail, ville, message…"
          />
        </label>
        <label>
          <span className="sr-only">Filtrer par origine</span>
          <select value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}>
            <option value="all">Toutes les demandes</option>
            <option value="contact">Contacts</option>
            <option value="valuation">Évaluations</option>
          </select>
        </label>
        <div className="admin-inbox-filters" aria-label="Filtrer par statut">
          {(["active", "new", "read", "archived"] as const).map((item) => (
            <button
              key={item}
              className={status === item ? "active" : ""}
              onClick={() => setStatus(item)}
            >
              {item === "active"
                ? "Actives"
                : item === "new"
                  ? "Nouvelles"
                  : item === "read"
                    ? "Lues"
                    : "Archivées"}
            </button>
          ))}
        </div>
      </div>

      {error && <p role="alert" className="form-status">{error}</p>}
      {loading ? (
        <p>Chargement des demandes…</p>
      ) : visible.length === 0 ? (
        <div className="admin-empty">
          <Inbox />
          <p>Aucune demande ne correspond à ces critères.</p>
        </div>
      ) : (
        <div className="lead-list">
          {visible.map((lead) => (
            <article className={`lead-card status-${lead.status}`} key={lead.id}>
              <div className="lead-card-top">
                <div>
                  <span>
                    {lead.kind === "valuation" ? "Évaluation" : "Contact"} · #{lead.id}
                  </span>
                  <h3>
                    {lead.name} {lead.surname}
                  </h3>
                </div>
                <time>
                  {new Date(lead.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="lead-meta">
                <a href={`mailto:${lead.email}`}>
                  <Mail size={15} />
                  {lead.email}
                  <ExternalLink size={13} />
                </a>
                {lead.phone && (
                  <a href={`tel:${lead.phone}`}>
                    <Phone size={15} />
                    {lead.phone}
                  </a>
                )}
                {lead.city && <span>{lead.city}</span>}
                {lead.propertyType && <span>{lead.propertyType}</span>}
              </div>
              {lead.subject && <p className="lead-subject">{lead.subject}</p>}
              <p className="lead-message">{lead.message}</p>
              {lead.details && Object.keys(lead.details).length > 0 && (
                <details className="lead-details">
                  <summary>
                    Voir toutes les informations <ChevronDown size={16} />
                  </summary>
                  <dl>
                    {Object.entries(lead.details).map(([key, value]) => (
                      <div key={key}>
                        <dt>{detailLabels[key] || key}</dt>
                        <dd>{displayValue(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              )}
              <div className="lead-actions">
                {lead.status === "new" && (
                  <button onClick={() => updateStatus(lead.id, "read")}>
                    <Check size={15} /> Marquer comme lue
                  </button>
                )}
                {lead.status !== "archived" ? (
                  <button onClick={() => updateStatus(lead.id, "archived")}>
                    <Archive size={15} /> Archiver
                  </button>
                ) : (
                  <button onClick={() => updateStatus(lead.id, "read")}>
                    <Inbox size={15} /> Restaurer
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
