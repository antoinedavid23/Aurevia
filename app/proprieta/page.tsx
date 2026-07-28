import { PageHero,CTA } from "@/components/PageHero";import { PropertyGrid } from "@/components/PropertyGrid";
export const metadata={title:"Proprietà selezionate"};
export default function Page(){return <><PageHero label="Proprietà" title="Dimore con un carattere preciso." text="Una collezione dimostrativa che racconta il tipo di cura e presentazione AUREVIA." image="/images/home/liguria-coast.webp"/><section className="section ivory"><div className="container"><PropertyGrid/><p className="demo-note">Proprietà e contenuti presentati a scopo dimostrativo.</p></div></section><CTA/></>}
