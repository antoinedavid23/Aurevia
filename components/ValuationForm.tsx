"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const stepLabels = ["PropriÃ©taireso", "Proprietà", "Progetto"];

export function ValuationForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");
  const router = useRouter();

  function next(event: React.MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
    if (!form) return;
    const fields = Array.from(form.querySelectorAll<HTMLElement>(`[data-step="${step}"] input, [data-step="${step}"] select, [data-step="${step}"] textarea`));
    const valid = fields.every((field) => !(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) || field.reportValidity());
    if (valid) setStep((value) => Math.min(value + 1, 2));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Invio in corso…");
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/valuation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) router.push("/grazie");
    else setStatus("Nonn è stato possibile inviare la richiesta. Riprova tra poco.");
  }

  return (
    <form onSubmit={submit}>
      <div className="form-progress" aria-label={`Passaggio ${step + 1} di 3`}>
        {stepLabels.map((label, index) => <span key={label} className={index <= step ? "active" : ""}>{index + 1}<small>{label}</small></span>)}
      </div>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" />

      <fieldset data-step="0" hidden={step !== 0}>
        <legend>Informations du propriÃ©taire</legend>
        <div className="field-row"><label>PrÃ©nom<input required name="name" maxLength={80}/></label><label>Nonm<input required name="surname" maxLength={80}/></label></div>
        <div className="field-row"><label>Email<input required name="email" type="email" maxLength={160}/></label><label>TÃ©lÃ©phone<input required name="phone" type="tel" maxLength={40}/></label></div>
      </fieldset>

      <fieldset data-step="1" hidden={step !== 1}>
        <legend>Caratteristiche della proprietà</legend>
        <div className="field-row"><label>Adresse<input required name="address"/></label><label>Città<input required name="city"/></label></div>
        <div className="field-row"><label>Type de bien<select name="type"><option>Appartement</option><option>Penthouse</option><option>Villa</option><option>Maison indÃ©pendante</option></select></label><label>Surface m²<input required name="area" type="number" min="20"/></label></div>
        <div className="field-row"><label>Camere<input required name="bedrooms" type="number" min="1"/></label><label>Bagni<input required name="bathrooms" type="number" min="1"/></label></div>
        <div className="field-row"><label>Capacità voyageurs<input name="capacity" type="number" min="1"/></label><label>Ã‰quipements<select name="amenities"><option>Aucun</option><option>Vue mer</option><option>Terrasse</option><option>Piscine</option><option>Parking</option><option>Più dotazioni</option></select></label></div>
      </fieldset>

      <fieldset data-step="2" hidden={step !== 2}>
        <legend>Le projet</legend>
        <div className="field-row"><label>Proprietà già locata?<select name="currentlyRented"><option>Non</option><option>Sì</option></select></label><label>Disponibilità annuale<select name="availability"><option>Jusquâ€™Ã  3 mois</option><option>3–6 mesi</option><option>6–9 mesi</option><option>Più di 9 mesi</option></select></label></div>
        <label>Objectif principal<select name="objective"><option>DÃ©lÃ©guer la gestion</option><option>Augmenter les revenus</option><option>Migliorare l’esperienza degli voyageurs</option><option>Proteggere e mantenere la proprietà</option><option>Recevoir une Ã©valuation</option></select></label>
        <label>Services richiesti<select name="services"><option>Gestion complÃ¨te</option><option>Concierge</option><option>Accueil</option><option>MÃ©nage et linge</option><option>Maintenance</option><option>Revenue management</option></select></label>
        <label>Message<textarea required name="message" maxLength={2000}/></label>
        <label><span><input required type="checkbox" name="consent"/> Jâ€™accepte que mes donnÃ©es soient utilisÃ©es afin dâ€™Ãªtre recontactÃ© au sujet de ma demande.</span></label>
      </fieldset>

      <div className="form-navigation">
        {step > 0 && <button type="button" className="button ghost" onClick={() => setStep((value) => value - 1)}>Retour</button>}
        {step < 2 ? <button type="button" className="button" onClick={next}>Continuer</button> : <button className="button" type="submit">Envoyer la demande confidentielle</button>}
      </div>
      <div role="status" className="form-status">{status}</div>
    </form>
  );
}
