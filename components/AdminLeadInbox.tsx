"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Download, Mail, Phone, RefreshCw, Search } from "lucide-react";
import { AdminAuditDossier } from "./AdminAuditDossier";
import { csvCell, leadStatuses, leadStatusLabels, type CrmLead, type LeadPage, type LeadStatus } from "@/lib/lead-crm";
import styles from "./AdminLeadInbox.module.css";

export function AdminLeadInbox({ initialSelectedId }: { initialSelectedId?: number }) {
  const [data, setData] = useState<LeadPage | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CrmLead | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
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
  const lastRequestAt = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => { setSearch(query.trim()); setPage(1); }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (selectedId) { setLoading(false); return; }
    const controller = new AbortController();
    async function refresh() {
      setLoading(true); lastRequestAt.current = Date.now();
      try {
        const params = new URLSearchParams({ page: String(page), status, kind, q: search });
        const response = await fetch(`/api/leads?${params}`, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error(response.status === 403 ? "Votre session a expiré. Reconnectez-vous pour consulter les dossiers." : "Le stockage des dossiers est indisponible. Réessayez avant de considérer cette liste comme complète.");
        const result = await response.json() as LeadPage;
        if (!Array.isArray(result.items) || !result.counts) throw new Error("La liste des dossiers n’a pas pu être lue.");
        if (!controller.signal.aborted) {
          if (result.total > 0 && result.items.length === 0 && page > 1) setPage(Math.max(1, Math.ceil(result.total / result.pageSize)));
          else { setData(result); setError(""); }
        }
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Actualisation impossible.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void refresh();
    return () => controller.abort();
  }, [page, status, kind, search, refreshKey, selectedId]);

  useEffect(() => {
    // No background polling: refresh only on a real return to the admin or on demand.
    const focus = () => { if (savingId === null && document.visibilityState === "visible" && Date.now() - lastRequestAt.current > 60_000) setRefreshKey(key => key + 1); };
    window.addEventListener("focus", focus);
    return () => window.removeEventListener("focus", focus);
  }, [savingId]);

  useEffect(() => {
    if (!selectedId) { setDetailLoading(false); return; }
    const controller = new AbortController();
    setDetailLoading(true); setDetailError(""); lastRequestAt.current = Date.now();
    void (async () => {
      try {
        const response = await fetch(`/api/leads?id=${selectedId}`, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error(response.status === 404 ? "Ce dossier est introuvable." : response.status === 403 ? "Votre session a expiré. Reconnectez-vous." : "Le dossier n’a pas pu être chargé. Réessayez.");
        const lead = await response.json() as CrmLead;
        if (!controller.signal.aborted) setSelected(lead);
      } catch (cause) { if (!controller.signal.aborted) setDetailError(cause instanceof Error ? cause.message : "Chargement impossible."); }
      finally { if (!controller.signal.aborted) setDetailLoading(false); }
    })();
    return () => controller.abort();
  }, [selectedId, refreshKey]);

  useEffect(() => { if (selected) headingRef.current?.focus(); }, [selected?.id]);

  async function updateStatus(id: number, nextStatus: LeadStatus) {
    if (savingId !== null) return;
    setSavingId(id); setUpdateError("");
    try {
      const response = await fetch("/api/leads", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status: nextStatus }) });
      if (!response.ok) throw new Error("Le changement de statut n’a pas été enregistré. Réessayez.");
      const saved = await response.json();
      if (saved.id !== id || saved.status !== nextStatus) throw new Error("Le changement de statut n’a pas été confirmé.");
      const previousStatus = selected?.status;
      setSelected(item => item?.id === id ? { ...item, status: nextStatus } : item);
      setData(current => current ? { ...current, counts: { ...current.counts,
        new: current.counts.new + Number(nextStatus === "new") - Number(previousStatus === "new"),
        appointments: current.counts.appointments + Number(nextStatus === "appointment") - Number(previousStatus === "appointment") } } : current);
    } catch (cause) { setUpdateError(cause instanceof Error ? cause.message : "Enregistrement impossible."); }
    finally { setSavingId(null); }
  }

  const visible = data?.items || [];
  const pages = Math.max(1, Math.ceil((data?.total || 0) / (data?.pageSize || 25)));

  function selectLead(id?: number) {
    setSelectedId(id); setSelected(null); setDetailError(""); setUpdateError(""); setError("");
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
    <div className={styles.heading}><div><h2>Contacts & audits</h2><p>Votre suivi, du premier contact au rendez-vous.</p></div><button type="button" onClick={() => setRefreshKey(key => key + 1)} disabled={loading || detailLoading || savingId !== null}><RefreshCw size={16}/> Actualiser</button></div>
    <div className={styles.metrics} aria-label="Vue d’ensemble">
      <div><span>Contacts reçus</span><strong>{!data || loading || error ? "—" : data.counts.total}</strong></div>
      <div><span>Nouveaux</span><strong>{!data || loading || error ? "—" : data.counts.new}</strong></div>
      <div><span>Audits complets</span><strong>{!data || loading || error ? "—" : data.counts.audits}</strong></div>
      <div><span>Rendez-vous</span><strong>{!data || loading || error ? "—" : data.counts.appointments}</strong></div>
    </div>
    {error && <p className={styles.error} role="alert">{error} <a href="/connexion">Connexion</a></p>}
    {updateError && <p className={styles.error} role="alert">{updateError}</p>}
    {detailError && <p className={styles.error} role="alert">{detailError} <button type="button" onClick={() => selectLead()}>Tous les contacts</button> <a href="/connexion">Connexion</a></p>}
    {detailLoading && <p role="status">Chargement du dossier complet…</p>}
    {selected ? <article className={styles.dossier}>
      <div className={styles.dossierToolbar}><button type="button" onClick={() => selectLead()}><ArrowLeft size={16}/> Tous les contacts</button><span>Dossier privé · #{selected.id}</span></div>
      <div className={styles.contactHead}>
        <div><h2 ref={headingRef} tabIndex={-1}>{selected.name} {selected.surname}</h2><p>{selected.city || "Localisation à préciser"} · Reçu le {new Date(selected.createdAt).toLocaleDateString("fr-FR")}</p></div>
        <label>Suivi de la demande<select value={selected.status} disabled={savingId !== null} onChange={event => void updateStatus(selected.id, event.target.value as LeadStatus)}>{leadStatuses.map(value => <option key={value} value={value}>{leadStatusLabels[value]}</option>)}</select></label>
      </div>
      <div className={styles.contactLinks}><a href={`mailto:${selected.email}`}><Mail size={17}/>{selected.email}</a>{selected.phone && <a href={`tel:${selected.phone.replace(/[^+\d]/g, "")}`}><Phone size={17}/>{selected.phone}</a>}<span>{savingId === selected.id ? "Enregistrement…" : leadStatusLabels[selected.status]}</span></div>
      <AdminAuditDossier key={selected.id} lead={selected}/>
    </article> : !selectedId && <>
      <div className={styles.toolbar}>
        <label className={styles.search}><Search size={17}/><span className="sr-only">Rechercher un contact</span><input value={query} maxLength={120} onChange={event => setQuery(event.target.value)} placeholder="Nom, e-mail, téléphone, ville…"/></label>
        <label><span className="sr-only">Statut</span><select value={status} onChange={event => { setStatus(event.target.value as typeof status); setPage(1); }}><option value="active">À traiter</option><option value="all">Tous les statuts</option>{leadStatuses.map(value => <option key={value} value={value}>{leadStatusLabels[value]}</option>)}</select></label>
        <label><span className="sr-only">Type de demande</span><select value={kind} onChange={event => { setKind(event.target.value); setPage(1); }}><option value="all">Toutes les demandes</option><option value="audit">Audits</option><option value="contact">Contacts simples</option></select></label>
        <button type="button" onClick={exportCsv} disabled={loading || !visible.length || !!error}><Download size={16}/> Exporter cette page</button>
      </div>
      <p className={styles.count} role="status">{loading ? "Chargement des contacts…" : error ? "Liste non vérifiée" : `${data?.total || 0} contact(s) · Page ${page} sur ${pages}`}</p>
      {!loading && !error && visible.length === 0 && <div className={styles.empty}><h3>Aucun contact pour le moment</h3><p>Les demandes enregistrées apparaîtront ici. Modifiez les filtres si vous recherchez un ancien dossier.</p></div>}
      {!loading && !error && visible.length > 0 && <div className={styles.tableWrap}><table><thead><tr><th>Contact</th><th>Projet</th><th>Reçu le</th><th>Suivi</th><th><span className="sr-only">Dossier</span></th></tr></thead><tbody>{visible.map(lead => <tr key={lead.id}>
        <td><button type="button" className={styles.name} onClick={() => selectLead(lead.id)}>{lead.name} {lead.surname}</button><a className={styles.email} href={`mailto:${lead.email}`}>{lead.email}</a></td>
        <td><strong>{lead.isAudit ? "Audit immobilier" : "Prise de contact"}</strong><span>{lead.city || "À préciser"}{lead.propertyCount ? ` · ${lead.propertyCount} bien(s)` : ""}</span></td>
        <td>{new Date(lead.createdAt).toLocaleDateString("fr-FR")}</td>
        <td><span className={`${styles.status} ${lead.status === "new" ? styles.newStatus : ""}`}>{leadStatusLabels[lead.status] || lead.status}</span></td>
        <td><button type="button" onClick={() => selectLead(lead.id)} aria-label={`Ouvrir le dossier de ${lead.name} ${lead.surname}`}>Ouvrir <ArrowUpRight size={16}/></button></td>
      </tr>)}</tbody></table></div>}
      <nav className={styles.pagination} aria-label="Pages des contacts"><button type="button" disabled={loading || page <= 1} onClick={() => setPage(value => value - 1)}><ChevronLeft size={16}/> Précédent</button><span>{page} / {pages}</span><button type="button" disabled={loading || page >= pages} onClick={() => setPage(value => value + 1)}>Suivant <ChevronRight size={16}/></button></nav>
    </>}
  </section>;
}
