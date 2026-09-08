"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Download, Mail, Phone, RefreshCw, Search } from "lucide-react";
import { AdminAuditDossier } from "./AdminAuditDossier";
import { csvCell, isRecord, leadStatuses, leadStatusLabels, type CrmLead, type LeadStatus } from "@/lib/lead-crm";
import styles from "./AdminLeadInbox.module.css";

export function AdminLeadInbox({ initialSelectedId }: { initialSelectedId?: number }) {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [status, setStatus] = useState<"active" | "all" | LeadStatus>("active");
  const [kind, setKind] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [savingId, setSavingId] = useState<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const requestGeneration = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    async function refresh(silent = false) {
      const generation = ++requestGeneration.current;
      if (!silent) setLoading(true);
      try {
        const response = await fetch("/api/leads", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error(response.status === 403 ? "Votre session a expiré. Reconnectez-vous pour consulter les dossiers." : "Le stockage des dossiers est indisponible. Réessayez avant de considérer cette liste comme complète.");
        const rows = await response.json();
        if (!Array.isArray(rows)) throw new Error("La liste des dossiers n’a pas pu être lue.");
        if (!controller.signal.aborted && generation === requestGeneration.current) { setLeads(rows); setError(""); }
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Actualisation impossible.");
      } finally {
        if (!controller.signal.aborted && !silent) setLoading(false);
      }
    }
    void refresh();
    const interval = window.setInterval(() => void refresh(true), 30_000);
    const focus = () => void refresh(true);
    window.addEventListener("focus", focus);
    return () => { controller.abort(); window.clearInterval(interval); window.removeEventListener("focus", focus); };
  }, [refreshKey]);

  useEffect(() => { if (selectedId) headingRef.current?.focus(); }, [selectedId, loading]);

  async function updateStatus(id: number, nextStatus: LeadStatus) {
    if (savingId !== null) return;
    setSavingId(id); setUpdateError("");
    ++requestGeneration.current;
    try {
      const response = await fetch("/api/leads", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status: nextStatus }) });
      if (!response.ok) throw new Error("Le changement de statut n’a pas été enregistré. Réessayez.");
      ++requestGeneration.current;
      setLeads(items => items.map(item => item.id === id ? { ...item, status: nextStatus } : item));
    } catch (cause) { setUpdateError(cause instanceof Error ? cause.message : "Enregistrement impossible."); }
    finally { setSavingId(null); }
  }

  const visible = useMemo(() => leads.filter(lead => {
    const statusMatches = status === "all" || (status === "active" ? !["closed", "archived"].includes(lead.status) : lead.status === status);
    const audit = isRecord(lead.details?.auditReport);
    const kindMatches = kind === "all" || (kind === "audit" ? audit : !audit);
    const text = [lead.name, lead.surname, lead.email, lead.phone, lead.city, lead.subject].filter(Boolean).join(" ").toLocaleLowerCase("fr");
    return statusMatches && kindMatches && text.includes(query.trim().toLocaleLowerCase("fr"));
  }), [leads, status, kind, query]);
  const selected = leads.find(lead => lead.id === selectedId);
  const newCount = leads.filter(lead => lead.status === "new").length;
  const appointmentCount = leads.filter(lead => lead.status === "appointment").length;
  const audits = leads.filter(lead => isRecord(lead.details?.auditReport)).length;

  function selectLead(id?: number) {
    setSelectedId(id); setUpdateError("");
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("demande", String(id)); else url.searchParams.delete("demande");
    window.history.replaceState(null, "", `${url.pathname}${url.search}#demandes`);
  }
  function exportCsv() {
    const rows = visible.map(lead => [lead.id, lead.name, lead.surname, lead.email, lead.phone, lead.city, leadStatusLabels[lead.status], new Date(lead.createdAt).toLocaleString("fr-FR")].map(csvCell).join(";"));
    const url = URL.createObjectURL(new Blob(["\uFEFFID;Prénom;Nom;E-mail;Téléphone;Ville;Statut;Reçu le\n" + rows.join("\n")], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `contacts-aurevia-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <section id="demandes" className={styles.crm} data-no-translate>
    <div className={styles.heading}><div><h2>Votre portefeuille de contacts</h2><p>Contacts, audits et suivi des échanges.</p></div><button type="button" onClick={() => setRefreshKey(key => key + 1)} disabled={loading}><RefreshCw size={16}/> Actualiser</button></div>
    <div className={styles.metrics} aria-label="Vue d’ensemble">
      <div><span>Contacts reçus</span><strong>{loading || error ? "—" : leads.length}</strong></div>
      <div><span>Nouveaux</span><strong>{loading || error ? "—" : newCount}</strong></div>
      <div><span>Audits complets</span><strong>{loading || error ? "—" : audits}</strong></div>
      <div><span>Rendez-vous</span><strong>{loading || error ? "—" : appointmentCount}</strong></div>
    </div>
    {error && <p className={styles.error} role="alert">{error} <a href="/connexion">Connexion</a></p>}
    {updateError && <p className={styles.error} role="alert">{updateError}</p>}
    {selected ? <article className={styles.dossier}>
      <div className={styles.dossierToolbar}><button type="button" onClick={() => selectLead()}><ArrowLeft size={16}/> Tous les contacts</button><span>Dossier privé · #{selected.id}</span></div>
      <div className={styles.contactHead}>
        <div><h2 ref={headingRef} tabIndex={-1}>{selected.name} {selected.surname}</h2><p>{selected.city || "Localisation à préciser"} · Reçu le {new Date(selected.createdAt).toLocaleDateString("fr-FR")}</p></div>
        <label>Suivi de la demande<select value={selected.status} disabled={savingId !== null} onChange={event => void updateStatus(selected.id, event.target.value as LeadStatus)}>{leadStatuses.map(value => <option key={value} value={value}>{leadStatusLabels[value]}</option>)}</select></label>
      </div>
      <div className={styles.contactLinks}><a href={`mailto:${selected.email}`}><Mail size={17}/>{selected.email}</a>{selected.phone && <a href={`tel:${selected.phone.replace(/[^+\d]/g, "")}`}><Phone size={17}/>{selected.phone}</a>}<span>{savingId === selected.id ? "Enregistrement…" : leadStatusLabels[selected.status]}</span></div>
      <AdminAuditDossier key={selected.id} lead={selected}/>
    </article> : <>
      {selectedId && !loading && !error && <p className={styles.error} role="alert">Ce dossier est introuvable. <button type="button" onClick={() => selectLead()}>Afficher les contacts</button></p>}
      <div className={styles.toolbar}>
        <label className={styles.search}><Search size={17}/><span className="sr-only">Rechercher un contact</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Nom, e-mail, téléphone, ville…"/></label>
        <label><span className="sr-only">Statut</span><select value={status} onChange={event => setStatus(event.target.value as typeof status)}><option value="active">À traiter</option><option value="all">Tous les statuts</option>{leadStatuses.map(value => <option key={value} value={value}>{leadStatusLabels[value]}</option>)}</select></label>
        <label><span className="sr-only">Type de demande</span><select value={kind} onChange={event => setKind(event.target.value)}><option value="all">Toutes les demandes</option><option value="audit">Audits</option><option value="contact">Contacts simples</option></select></label>
        <button type="button" onClick={exportCsv} disabled={!visible.length || !!error}><Download size={16}/> Exporter</button>
      </div>
      <p className={styles.count} role="status">{loading ? "Chargement des dossiers…" : error ? "Liste non vérifiée" : `${visible.length} contact${visible.length > 1 ? "s" : ""}`}</p>
      {!loading && !error && visible.length === 0 && <div className={styles.empty}><h3>Aucun contact pour le moment</h3><p>Les demandes enregistrées apparaîtront ici. Modifiez les filtres si vous recherchez un ancien dossier.</p></div>}
      {visible.length > 0 && <div className={styles.tableWrap}><table><thead><tr><th>Contact</th><th>Projet</th><th>Reçu le</th><th>Suivi</th><th><span className="sr-only">Dossier</span></th></tr></thead><tbody>{visible.map(lead => <tr key={lead.id}>
        <td><button type="button" className={styles.name} onClick={() => selectLead(lead.id)}>{lead.name} {lead.surname}</button><a className={styles.email} href={`mailto:${lead.email}`}>{lead.email}</a></td>
        <td><strong>{isRecord(lead.details?.auditReport) ? "Audit immobilier" : "Prise de contact"}</strong><span>{lead.city || "À préciser"}{typeof lead.details?.propertyCount === "number" ? ` · ${lead.details.propertyCount} bien(s)` : ""}</span></td>
        <td>{new Date(lead.createdAt).toLocaleDateString("fr-FR")}</td>
        <td><span className={`${styles.status} ${lead.status === "new" ? styles.newStatus : ""}`}>{leadStatusLabels[lead.status] || lead.status}</span></td>
        <td><button type="button" onClick={() => selectLead(lead.id)} aria-label={`Ouvrir le dossier de ${lead.name} ${lead.surname}`}>Ouvrir <ArrowUpRight size={16}/></button></td>
      </tr>)}</tbody></table></div>}
    </>}
  </section>;
}
