import { notFound } from "next/navigation";
import { services } from "@/data/content";
import { PageHero,CTA } from "@/components/PageHero";

export function generateStaticParams(){return services.map(s=>({slug:s.slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=services.find(x=>x.slug===slug);
  if(!s)notFound();
  return <><PageHero label="Servizi" title={s.title} text={s.short} image={s.image}/>
    <section className="content-section ivory"><div className="container split"><div><p className="eyebrow dark">La sfida</p><h2>Più tempo, più controllo, meno imprevisti.</h2></div><div><p>Gestire una proprietà richiede continuità, persone affidabili e attenzione. AUREVIA coordina attività, comunicazioni e controlli attraverso un unico referente.</p><ul className="feature-list"><li>Analisi iniziale</li><li>Standard condivisi</li><li>Coordinamento locale</li><li>Report chiari</li></ul></div></div></section>
    <section className="content-section"><div className="container"><p className="eyebrow">Il processo</p><h2>Un servizio calibrato sulla proprietà.</h2><div className="steps">{["Ascolto e sopralluogo","Piano operativo","Attivazione","Controllo continuo"].map((x,i)=><div key={x}><span>0{i+1}</span><h3>{x}</h3></div>)}</div></div></section><CTA/></>
}
