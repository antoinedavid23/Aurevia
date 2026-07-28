"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const stepLabels = ["Proprietario", "Proprietà", "Progetto"];

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
    else setStatus("Non è stato possibile inviare la richiesta. Riprova tra poco.");
  }

  return (
    <form onSubmit={submit}>
      <div className="form-progress" aria-label={`Passaggio ${step + 1} di 3`}>
        {stepLabels.map((label, index) => <span key={label} className={index <= step ? "active" : ""}>{index + 1}<small>{label}</small></span>)}
      </div>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" />

      <fieldset data-step="0" hidden={step !== 0}>
        <legend>Informazioni del proprietario</legend>
        <div className="field-row"><label>Nome<input required name="name" maxLength={80}/></label><label>Cognome<input required name="surname" maxLength={80}/></label></div>
        <div className="field-row"><label>Email<input required name="email" type="email" maxLength={160}/></label><label>Telefono<input required name="phone" type="tel" maxLength={40}/></label></div>
      </fieldset>

      <fieldset data-step="1" hidden={step !== 1}>
        <legend>Caratteristiche della proprietà</legend>
        <div className="field-row"><label>Indirizzo<input required name="address"/></label><label>Città<input required name="city"/></label></div>
        <div className="field-row"><label>Tipologia<select name="type"><option>Appartamento</option><option>Attico</option><option>Villa</option><option>Casa indipendente</option></select></label><label>Superficie m²<input required name="area" type="number" min="20"/></label></div>
        <div className="field-row"><label>Camere<input required name="bedrooms" type="number" min="1"/></label><label>Bagni<input required name="bathrooms" type="number" min="1"/></label></div>
        <div className="field-row"><label>Capacità ospiti<input name="capacity" type="number" min="1"/></label><label>Dotazioni<select name="amenities"><option>Nessuna</option><option>Vista mare</option><option>Terrazza</option><option>Piscina</option><option>Parcheggio</option><option>Più dotazioni</option></select></label></div>
      </fieldset>

      <fieldset data-step="2" hidden={step !== 2}>
        <legend>Il progetto</legend>
        <div className="field-row"><label>Proprietà già locata?<select name="currentlyRented"><option>No</option><option>Sì</option></select></label><label>Disponibilità annuale<select name="availability"><option>Fino a 3 mesi</option><option>3–6 mesi</option><option>6–9 mesi</option><option>Più di 9 mesi</option></select></label></div>
        <label>Obiettivo principale<select name="objective"><option>Delegare la gestione</option><option>Aumentare i ricavi</option><option>Migliorare l’esperienza degli ospiti</option><option>Proteggere e mantenere la proprietà</option><option>Ricevere una valutazione</option></select></label>
        <label>Servizi richiesti<select name="services"><option>Gestione completa</option><option>Concierge</option><option>Accoglienza</option><option>Pulizie e biancheria</option><option>Manutenzione</option><option>Revenue management</option></select></label>
        <label>Messaggio<textarea required name="message" maxLength={2000}/></label>
        <label><span><input required type="checkbox" name="consent"/> Accetto che i miei dati vengano utilizzati per essere ricontattato in relazione alla mia richiesta.</span></label>
      </fieldset>

      <div className="form-navigation">
        {step > 0 && <button type="button" className="button ghost" onClick={() => setStep((value) => value - 1)}>Indietro</button>}
        {step < 2 ? <button type="button" className="button" onClick={next}>Continua</button> : <button className="button" type="submit">Invia la richiesta riservata</button>}
      </div>
      <div role="status" className="form-status">{status}</div>
    </form>
  );
}
