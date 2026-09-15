"use client";

import Link from "next/link";
import { useLocale } from "./LocaleController";
import { PageHero } from "./PageHero";

const copy = {
  it: {
    title: "Informativa sui cookie", intro: "Strumenti essenziali e pubblicità: scegli tu.", date: "Ultimo aggiornamento: 15 settembre 2026",
    headings: ["1. Strumenti essenziali", "2. Meta Pixel, solo con il tuo consenso", "3. Dati e destinatari", "4. Durata", "5. Gestisci la tua scelta"],
    paragraphs: [
      "Il sito usa cookie di sessione per l’accesso riservato e il salvataggio locale della lingua. La preferenza pubblicitaria è salvata nel browser con la chiave aurevia-marketing-consent-v1, la data della scelta e una scadenza di sei mesi. Il precedente avviso aurevia-cookie non autorizza il tracciamento pubblicitario.",
      "Solo dopo l’accettazione dei cookie pubblicitari, il pixel Aurevia Web di Meta misura le pagine pubbliche visitate (PageView) e le richieste di contatto o valutazione confermate dal sito (Lead), per attribuire le conversioni e migliorare le campagne Facebook e Instagram. Il pixel resta disattivato nell’amministrazione e nelle pagine di accesso.",
      "Meta Platforms Ireland Limited può ricevere l’URL della pagina, l’indirizzo IP, informazioni sul browser e sul dispositivo, identificativi dei cookie ed eventi di visita e richiesta. Il nostro codice non invia nomi, e-mail, numeri di telefono o contenuti dei moduli a Meta e non abilita la corrispondenza avanzata automatica. Meta può associare gli eventi a un account Meta e trattarli anche fuori dallo Spazio economico europeo secondo le proprie condizioni e garanzie per i trasferimenti.",
      "Il pixel può usare i cookie _fbp e _fbc, normalmente con una durata massima di 90 giorni, e gli strumenti descritti nell’informativa di Meta. La conservazione dei dati ricevuti da Meta è distinta dalla durata dei cookie: consulta la sua informativa sulla privacy.",
      "Accettare è facoltativo. Rifiutare non limita moduli e servizi. Il pulsante «Preferenze cookie» nelle pagine pubbliche permette di modificare o ritirare il consenso. Il rifiuto blocca i nuovi eventi e rimuove i cookie Meta accessibili al sito, senza cancellare dati già ricevuti da Meta. La scelta vale per questo browser ed è richiesta nuovamente dopo sei mesi o dopo la cancellazione della preferenza. Scorrere o continuare a navigare non equivale ad accettare.",
    ],
    noticeTitle: "8. Misurazione pubblicitaria facoltativa", notice: "Con il tuo consenso usiamo Meta Pixel per misurare visite e richieste inviate e migliorare le campagne Facebook e Instagram. Meta Platforms Ireland Limited riceve dati tecnici e di navigazione, ma il nostro codice non trasmette il contenuto dei moduli. La base giuridica è il consenso, revocabile tramite «Preferenze cookie». Finalità, dati, durata e destinatari sono descritti nell’informativa sui cookie.",
    privacy: "Privacy di AUREVIA", metaPrivacy: "Privacy di Meta", metaCookies: "Cookie di Meta",
  },
  fr: {
    title: "Politique relative aux cookies", intro: "Outils essentiels et publicité : vous choisissez.", date: "Dernière mise à jour : 15 septembre 2026",
    headings: ["1. Outils essentiels", "2. Pixel Meta, uniquement avec votre accord", "3. Données et destinataires", "4. Durée", "5. Gérer votre choix"],
    paragraphs: [
      "Le site utilise des cookies de session pour l’accès privé et le stockage local de la langue. Le choix publicitaire est enregistré dans le navigateur sous la clé aurevia-marketing-consent-v1, avec la date du choix et une expiration à six mois. L’ancien avis aurevia-cookie n’autorise pas le suivi publicitaire.",
      "Uniquement après acceptation des cookies publicitaires, le pixel Aurevia Web de Meta mesure les pages publiques consultées (PageView) et les demandes de contact ou d’évaluation confirmées par le site (Lead), afin d’attribuer les conversions et améliorer les campagnes Facebook et Instagram. Le pixel reste désactivé dans l’administration et sur les pages de connexion.",
      "Meta Platforms Ireland Limited peut recevoir l’URL de la page, l’adresse IP, des informations sur le navigateur et l’appareil, des identifiants de cookies et les événements de visite et de demande. Notre code ne transmet à Meta ni les noms, ni les e-mails, ni les numéros de téléphone, ni le contenu des formulaires et n’active pas la correspondance avancée automatique. Meta peut associer les événements à un compte Meta et les traiter hors de l’Espace économique européen selon ses conditions et garanties de transfert.",
      "Le pixel peut utiliser les cookies _fbp et _fbc, généralement d’une durée maximale de 90 jours, ainsi que les outils décrits dans la politique de Meta. La conservation des données reçues par Meta est distincte de la durée des cookies : consultez sa politique de confidentialité.",
      "L’acceptation est facultative. Le refus ne limite ni les formulaires ni les services. Le bouton « Préférences cookies » des pages publiques permet de modifier ou retirer votre accord. Le refus bloque les nouveaux événements et supprime les cookies Meta accessibles au site, sans effacer les données déjà reçues par Meta. Le choix concerne ce navigateur et sera redemandé après six mois ou suppression de la préférence. Faire défiler la page ou poursuivre la navigation ne vaut pas acceptation.",
    ],
    noticeTitle: "8. Mesure publicitaire facultative", notice: "Avec votre accord, nous utilisons le pixel Meta pour mesurer les visites et les demandes envoyées et améliorer les campagnes Facebook et Instagram. Meta Platforms Ireland Limited reçoit des données techniques et de navigation, mais notre code ne transmet pas le contenu des formulaires. La base juridique est le consentement, révocable via « Préférences cookies ». Les finalités, données, durées et destinataires figurent dans la politique relative aux cookies.",
    privacy: "Confidentialité AUREVIA", metaPrivacy: "Confidentialité de Meta", metaCookies: "Cookies de Meta",
  },
  en: {
    title: "Cookie policy", intro: "Essential tools and advertising: the choice is yours.", date: "Last updated: 15 September 2026",
    headings: ["1. Essential tools", "2. Meta Pixel, only with your consent", "3. Data and recipients", "4. Duration", "5. Manage your choice"],
    paragraphs: [
      "The site uses session cookies for private access and local storage for your language. Your advertising choice is stored under aurevia-marketing-consent-v1, with the date of your choice and a six-month expiry. The former aurevia-cookie notice does not authorise advertising tracking.",
      "Only after you accept advertising cookies, Meta’s Aurevia Web pixel measures public page visits (PageView) and contact or valuation requests confirmed by the website (Lead), to attribute conversions and improve Facebook and Instagram campaigns. The pixel is disabled on administration and sign-in pages.",
      "Meta Platforms Ireland Limited may receive the page URL, IP address, browser and device information, cookie identifiers, and visit and enquiry events. Our code does not send names, email addresses, phone numbers or form contents to Meta and does not enable automatic advanced matching. Meta may link events to a Meta account and process them outside the European Economic Area under its terms and transfer safeguards.",
      "The pixel may use the _fbp and _fbc cookies, usually lasting up to 90 days, and tools described in Meta’s cookie policy. Retention of data received by Meta is separate from cookie duration: please consult its privacy policy.",
      "Acceptance is optional. Declining does not restrict forms or services. The “Cookie preferences” button on public pages lets you change or withdraw consent. Declining blocks new events and removes Meta cookies accessible to this site, without erasing data already received by Meta. Your choice applies to this browser and will be requested again after six months or after the preference is deleted. Scrolling or continuing to browse does not mean acceptance.",
    ],
    noticeTitle: "8. Optional advertising measurement", notice: "With your consent, we use the Meta Pixel to measure visits and submitted enquiries and improve Facebook and Instagram campaigns. Meta Platforms Ireland Limited receives technical and browsing data, but our code does not transmit form contents. The legal basis is consent, which you can withdraw through “Cookie preferences”. See the cookie policy for purposes, data, retention and recipients.",
    privacy: "AUREVIA privacy", metaPrivacy: "Meta privacy", metaCookies: "Meta cookies",
  },
};

export function MarketingCookiePolicy() {
  const { locale } = useLocale();
  const t = copy[locale];
  return <div data-no-translate><PageHero label={t.title} title={t.title} text={t.intro}/><section className="section ivory"><article className="container legal-content"><p className="legal-updated">{t.date}</p>
    {t.headings.map((heading, index) => <section key={index}><h2>{heading}</h2><p>{t.paragraphs[index]}</p></section>)}
    <p className="legal-inline-links"><Link href="/privacy">{t.privacy}</Link><a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noreferrer">{t.metaPrivacy}</a><a href="https://www.facebook.com/privacy/policies/cookies/" target="_blank" rel="noreferrer">{t.metaCookies}</a></p>
    <div className="legal-contact"><a href="mailto:contatto@aurevia-genova.com">contatto@aurevia-genova.com</a></div>
  </article></section></div>;
}

export function MetaPrivacyNotice() {
  const { locale } = useLocale();
  const t = copy[locale];
  return <section data-no-translate><h2>{t.noticeTitle}</h2><p className="legal-updated">{t.date}</p><p>{t.notice}</p><p><Link href="/cookie-policy">{t.title}</Link></p></section>;
}
