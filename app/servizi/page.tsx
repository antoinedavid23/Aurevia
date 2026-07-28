import {PageHero,CTA} from "@/components/PageHero";import {ServiceCard} from "@/components/Cards";import {services} from "@/data/content";
export const metadata={title:"Services de gestion de propriété"};
export default function Page(){return <><PageHero label="Services" title="Un service complet, conçu sur mesure" text="De la gestion quotidienne à la valorisation du bien, nous coordonnons chaque détail."/><section className="section"><div className="container card-grid three">{services.map(s=><ServiceCard key={s.slug} service={s}/>)}</div></section><CTA/></>}
