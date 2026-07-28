import { PageHero,CTA } from "@/components/PageHero";import { ServiceCard } from "@/components/Cards";import { services } from "@/data/content";
export const metadata={title:"Services di gestione proprietà"};
export default function Page(){return <><PageHero label="Services" title="Un service complet, sur mesure." text="Dalla gestione quotidiana alla valorizzazione dell’immobile, coordiniamo ogni dettaglio."/><section className="section"><div className="container card-grid three">{services.map(s=><ServiceCard key={s.slug} service={s}/>)}</div></section><CTA/></>}
