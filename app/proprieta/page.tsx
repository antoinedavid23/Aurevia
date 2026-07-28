import { PageHero,CTA } from "@/components/PageHero";import { PropertyGrid } from "@/components/PropertyGrid";
export const metadata={title:"Proprietà selezionate"};
export default function Page(){return <><PageHero label="Proprietà" title="Des demeures au caractÃ¨re affirmÃ©." text="Une collection de dÃ©monstration qui illustre le niveau de soin AUREVIA." image="/images/home/liguria-coast.webp"/><section className="section ivory"><div className="container"><PropertyGrid/><p className="demo-note">Proprietà e contenuti presentati a scopo dimostrativo.</p></div></section><CTA/></>}
