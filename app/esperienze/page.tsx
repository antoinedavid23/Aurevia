import Link from "next/link";
import { PageHero,CTA } from "@/components/PageHero";
import { experiences } from "@/data/content";

export default function Page(){
  return <><PageHero label="ExpÃ©riences" title="Des moments exclusifs, organisÃ©s sur mesure." text="Le meilleur de la Ligurie, orchestrÃ© avec soin et discrÃ©tion." image="/images/experiences/yacht.webp"/>
    <section className="section">
      <div className="container card-grid three">{experiences.map(e=><Link href={`/esperienze/${e.slug}`} className="experience-card" style={{backgroundImage:`linear-gradient(180deg,transparent,rgba(7,16,25,.96)),url(${e.image})`}} key={e.slug}><span>SUR DEMANDE</span><h3>{e.title}</h3><p>{e.short}</p></Link>)}</div>
      <div className="container"><p className="demo-note">Le esperienze sono organizzate su richiesta e soggette a disponibilità.</p></div>
    </section><CTA/></>
}
