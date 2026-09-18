"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocale } from "@/components/LocaleController";
import { translate } from "@/lib/public-site/i18n";
import { ItalianContent } from "@/components/public-site/ItalianContent";
import { formContactCopy } from "@/lib/public-site/form-copy";
import { trackMetaLead } from "@/lib/meta-pixel";
import { isConfirmedAuditDelivery } from "@/lib/audit-session";

const valuationSchema = z.object({
  name: z.string().trim().min(1, "Indiquez votre prénom.").max(80),
  surname: z.string().trim().min(1, "Indiquez votre nom.").max(80),
  email: z.string().trim().email("Saisissez une adresse e-mail valide.").max(160),
  phone: z.string().trim().max(40).optional(),
  profile: z.string().min(1, "Sélectionnez votre profil."),
  address: z.string().trim().min(3, "Indiquez l’adresse du bien."),
  city: z.string().trim().min(2, "Indiquez la ville."),
  type: z.string().min(1),
  area: z.string().min(1, "Indiquez la surface."),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  capacity: z.string().optional(),
  finish: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  currentlyRented: z.string().optional(),
  availability: z.string().optional(),
  currentOccupancy: z.string().optional(),
  currentRevenue: z.string().optional(),
  objective: z.string().optional(),
  services: z.array(z.string()).optional(),
  message: z.string().trim().min(10, "Décrivez votre situation en quelques mots.").max(2000),
  website: z.string().max(0).optional(),
  consent: z.boolean().refine(Boolean, "Veuillez prendre connaissance de la politique de confidentialité."),
});

type ValuationFormValues = z.infer<typeof valuationSchema>;

const stepFields: Array<Array<keyof ValuationFormValues>> = [
  ["name", "surname", "email", "profile"],
  ["address", "city", "type", "area"],
  ["message", "consent"],
];

function FieldError({ message }: { message?: string }) {
  const { locale } = useLocale();
  return message ? <p className="field-error" role="alert">{translate(message, locale)}</p> : null;
}

export function ValuationForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");
  const [failed, setFailed] = useState(false);
  const router = useRouter();
  const { locale } = useLocale();
  const tr = (text: string) => translate(text, locale);
  const contactCopy = formContactCopy[locale];
  const stepLabels = contactCopy.steps;
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ValuationFormValues>({
    resolver: zodResolver(valuationSchema),
    defaultValues: { amenities: [], services: [], consent: false, website: "" },
  });

  async function next() {
    if (await trigger(stepFields[step], { shouldFocus: true })) setStep((value) => Math.min(value + 1, 2));
  }

  const submit = handleSubmit(async (data) => {
    setFailed(false);
    setStatus(tr("Envoi en cours…"));
    let response: Response;
    try {
      response = await fetch("/api/valuation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      setFailed(true);
      setStatus(tr("La connexion a été interrompue. Réessayez dans un instant."));
      return;
    }
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      setFailed(true);
      setStatus(tr(result?.code === "invalid_payload" ? "Les informations transmises sont incomplètes." : "L’envoi n’a pas abouti. Réessayez dans un instant."));
      return;
    }
    if (isConfirmedAuditDelivery(result)) trackMetaLead();
    setStatus(tr("Demande bien enregistrée."));
    router.push("/grazie");
  }, () => {
    if (errors.name || errors.surname || errors.email || errors.profile) setStep(0);
    else if (errors.address || errors.city || errors.type || errors.area) setStep(1);
  });

  return (
    <ItalianContent><form className="valuation-form" onSubmit={submit} noValidate>
      <input className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" {...register("website")} />
      <div className="valuation-form-topline" data-no-translate><span>{contactCopy.duration}</span><strong>{contactCopy.step} {step + 1} {contactCopy.of} 3</strong></div>
      <div className="form-progress" data-no-translate aria-label={locale === "it" ? `Fase ${step + 1} di 3` : locale === "en" ? `Step ${step + 1} of 3` : `Étape ${step + 1} sur 3`}>{stepLabels.map((label, index) => <span key={label} className={index <= step ? "active" : ""} aria-current={index === step ? "step" : undefined}><b>0{index + 1}</b><small>{label}</small></span>)}</div>

      <fieldset data-step="0" hidden={step !== 0}>
        <legend data-no-translate>{contactCopy.contactLegend}</legend><p className="form-hint">Indiquez simplement les coordonnées auxquelles nous pouvons vous répondre.</p><p className="form-required">Les champs marqués * sont nécessaires.</p>
        <div className="field-row">
          <label data-no-translate><span>{contactCopy.firstName} *</span><input placeholder={contactCopy.firstNamePlaceholder} maxLength={80} autoComplete="given-name" aria-invalid={Boolean(errors.name)} {...register("name")} /><FieldError message={errors.name?.message} /></label>
          <label data-no-translate><span>{contactCopy.lastName} *</span><input placeholder={contactCopy.lastNamePlaceholder} maxLength={80} autoComplete="family-name" aria-invalid={Boolean(errors.surname)} {...register("surname")} /><FieldError message={errors.surname?.message} /></label>
        </div>
        <div className="field-row">
          <label data-no-translate><span>{contactCopy.email} *</span><input type="email" placeholder={contactCopy.emailPlaceholder} maxLength={160} autoComplete="email" aria-invalid={Boolean(errors.email)} {...register("email")} /><FieldError message={errors.email?.message} /></label>
          <label data-no-translate><span>{contactCopy.phone} <small>({contactCopy.optional})</small></span><input type="tel" placeholder={contactCopy.phonePlaceholder} maxLength={40} autoComplete="tel" aria-invalid={Boolean(errors.phone)} {...register("phone")} /><FieldError message={errors.phone?.message} /></label>
        </div>
        <label>Vous êtes… *<select aria-invalid={Boolean(errors.profile)} {...register("profile")}><option value="">Sélectionnez votre situation</option><option>Propriétaire occupant</option><option>Propriétaire bailleur</option><option>Investisseur</option><option>Mandataire</option></select><FieldError message={errors.profile?.message} /></label>
      </fieldset>

      <fieldset data-step="1" hidden={step !== 1}>
        <legend>Parlez-nous du bien.</legend><p className="form-hint">Quelques informations pratiques suffisent pour comprendre le lieu.</p><p className="form-required">Les champs marqués * sont nécessaires. Une estimation suffit pour le reste.</p>
        <div className="field-row">
          <label>Adresse du bien *<input placeholder="Rue et numéro" autoComplete="street-address" aria-invalid={Boolean(errors.address)} {...register("address")} /><FieldError message={errors.address?.message} /></label>
          <label>Ville *<input placeholder="Genova" autoComplete="address-level2" aria-invalid={Boolean(errors.city)} {...register("city")} /><FieldError message={errors.city?.message} /></label>
        </div>
        <div className="field-row">
          <label>Type de bien *<select {...register("type")}><option>Studio</option><option>Appartement 1 chambre</option><option>Appartement 2 chambres</option><option>Appartement 3 chambres ou plus</option><option>Bien indépendant</option></select></label>
          <label>Surface en m² *<input type="number" placeholder="Ex. 75" min="20" aria-invalid={Boolean(errors.area)} {...register("area")} /><FieldError message={errors.area?.message} /></label>
        </div>
        <div className="field-row">
          <label>Nombre de chambres<input type="number" placeholder="0 pour un studio" min="0" aria-invalid={Boolean(errors.bedrooms)} {...register("bedrooms")} /><FieldError message={errors.bedrooms?.message} /></label>
          <label>Nombre de salles de bain<input type="number" placeholder="Ex. 1" min="1" aria-invalid={Boolean(errors.bathrooms)} {...register("bathrooms")} /><FieldError message={errors.bathrooms?.message} /></label>
        </div>
        <div className="field-row">
          <label>Nombre de voyageurs prévu<input type="number" placeholder="Ex. 4" min="1" {...register("capacity")} /></label>
          <label>Le bien est…<select {...register("finish")}><option>Déjà prêt à accueillir</option><option>À équiper légèrement</option><option>À rafraîchir</option><option>Encore en travaux</option><option>Je ne sais pas encore</option></select></label>
        </div>
        <div className="amenities-checks"><span>Équipements déjà présents</span>{["Wi-Fi", "Cuisine équipée", "Lave-linge", "Climatisation", "Ascenseur", "Parking"].map((item) => <label key={item}><input type="checkbox" value={item} {...register("amenities")} />{item}</label>)}</div>
      </fieldset>

      <fieldset data-step="2" hidden={step !== 2}>
        <legend data-no-translate>{contactCopy.delegationLegend}</legend><p className="form-hint">Dites-nous comment le bien est utilisé aujourd’hui et ce que vous ne voulez plus gérer seul.</p><p className="form-required">Seule la description finale est nécessaire.</p>
        <div className="field-row">
          <label>Le bien est-il déjà loué ?<select {...register("currentlyRented")}><option>Non, pas encore</option><option>Oui, quelques semaines par an</option><option>Oui, plusieurs mois par an</option><option>Oui, toute l’année</option></select></label>
          <label>À quelle fréquence souhaitez-vous le louer ?<select {...register("availability")}><option>Quelques semaines par an</option><option>Pendant les vacances</option><option>Plusieurs mois par an</option><option>Toute l’année</option><option>Je ne sais pas encore</option></select></label>
        </div>
        <div className="field-row">
          <label>Qui s’en occupe aujourd’hui ?<select {...register("currentOccupancy")}><option>Moi-même</option><option>Un proche</option><option>Plusieurs prestataires</option><option>Une autre conciergerie</option><option>Personne pour le moment</option></select></label>
          <label>Prix habituel par nuit<input type="number" min="0" placeholder="Ex. 85 € — facultatif" {...register("currentRevenue")} /></label>
        </div>
        <label>Votre besoin principal<select {...register("objective")}><option>Commencer à louer</option><option>Ne plus gérer les arrivées</option><option>Déléguer le ménage et le linge</option><option>Avoir quelqu’un sur place</option><option>Mieux organiser les réservations</option><option>Gagner du temps au quotidien</option></select></label>
        <div className="amenities-checks"><span>Ce que vous aimeriez nous confier</span>{["Préparer le bien", "Répondre aux voyageurs", "Organiser les arrivées", "Ménage et linge", "Petits problèmes sur place", "Calendrier et réservations"].map((item) => <label key={item}><input type="checkbox" value={item} {...register("services")} />{item}</label>)}</div>
        <label>Expliquez-nous simplement votre situation *<textarea maxLength={2000} placeholder="Ex. Je loue mon appartement pendant mes absences et je cherche quelqu’un pour préparer le logement, accueillir les voyageurs et suivre le ménage." aria-invalid={Boolean(errors.message)} {...register("message")} /><FieldError message={errors.message?.message} /></label>
        <p className="form-privacy valuation-privacy">AUREVIA utilise ces informations pour étudier votre demande et préparer les éventuelles mesures précontractuelles. Elles ne servent pas à vous envoyer de la prospection sans base légale distincte.{" "}<a href="/privacy" target="_blank" rel="noreferrer">Lire la politique de confidentialité</a>{"."}</p>
        <label className="valuation-consent"><span><input type="checkbox" aria-invalid={Boolean(errors.consent)} {...register("consent")} /> Je confirme avoir pris connaissance de la politique de confidentialité. *</span><FieldError message={errors.consent?.message} /></label>
      </fieldset>

      <div className="form-navigation">
        <p className="valuation-next-label">{step < 2 ? <>Ensuite : <strong data-no-translate>{stepLabels[step + 1]}</strong></> : <><strong>Dernière étape</strong> · envoi confidentiel</>}</p>
        {step > 0 && <button type="button" className="button ghost" onClick={() => setStep((value) => value - 1)}>← Retour</button>}
        {step < 2 ? <button type="button" className="button" onClick={next}>Continuer <span aria-hidden="true">→</span></button> : <button className="button" type="submit" disabled={isSubmitting}>{isSubmitting ? tr("Envoi en cours…") : <>Envoyer ma demande <span aria-hidden="true">→</span></>}</button>}
      </div>
      <div role={failed ? "alert" : "status"} aria-live="polite" className="form-status">{status}</div>
    </form></ItalianContent>
  );
}
