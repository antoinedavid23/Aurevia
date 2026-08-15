import { PageHero, CTA } from "@/components/PageHero";
import { faqs } from "@/data/content";

export default function Page() {
  return <><PageHero label="Questions fréquentes" title="Des réponses claires avant de commencer" text="Zone d’intervention, suivi, frais séparés, estimation et démarrage : les principaux points à clarifier avec Velyo." image="/images/about/genova-architecture.webp" /><section className="section ivory"><div className="container faq">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section><CTA /></>;
}
