import { PageHero,CTA } from "@/components/PageHero";import { ServiceCard } from "@/components/Cards";import { services } from "@/data/content";
export const metadata={title:"Servizi di gestione proprietà"};
export default function Page(){return <><PageHero label="Servizi" title="Un servizio completo, su misura." text="Dalla gestione quotidiana alla valorizzazione dell’immobile, coordiniamo ogni dettaglio."/><section className="section"><div className="container card-grid three">{services.map(s=><ServiceCard key={s.slug} service={s}/>)}</div></section><CTA/></>}
