import { notFound } from "next/navigation";
import { services } from "@/data/content";
import { PageHero,CTA } from "@/components/PageHero";

export function generateStaticParams(){return services.map(s=>({slug:s.slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=services.find(x=>x.slug===slug);
  if(!s)notFound();
  return <><PageHero label="Services" title={s.title} text={s.short} image={s.image}/>
    <section className="content-section ivory"><div className="container split"><div><p className="eyebrow dark">Lâ€™enjeu</p><h2>Più tempo, più controllo, meno imprevisti.</h2></div><div><p>Gestire una proprietà richiede continuità, persone affidabili e attenzione. AUREVIA coordina attività, comunicazioni e controlli attraverso un unico referente.</p><ul className="feature-list"><li>Analyse initiale</li><li>Standards partagÃ©s</li><li>Coordination locale</li><li>Rapports clairs</li></ul></div></div></section>
    <section className="content-section"><div className="container"><p className="eyebrow">Le processus</p><h2>Un servizio calibrato sulla proprietà.</h2><div className="steps">{["Ã‰change et visite","Plan opÃ©rationnel","Mise en place","Suivi continu"].map((x,i)=><div key={x}><span>0{i+1}</span><h3>{x}</h3></div>)}</div></div></section><CTA/></>
}
