"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { LanguageOptions, useLocale } from "@/components/LocaleController";

export function AuditLanguageMenu(){
  const {locale}=useLocale();
  const [open,setOpen]=useState(false);
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const close=(event:PointerEvent)=>{if(root.current&&!root.current.contains(event.target as Node))setOpen(false)};
    document.addEventListener("pointerdown",close);
    return()=>document.removeEventListener("pointerdown",close);
  },[]);
  return <div className={`audit-language-menu ${open?"is-open":""}`} ref={root} data-no-translate>
    <button className="audit-language-trigger" type="button" aria-label="Choose language" aria-haspopup="menu" aria-expanded={open} onClick={()=>setOpen(value=>!value)}>
      <span>{locale.toUpperCase()}</span><ChevronDown size={14}/>
    </button>
    {open&&<div className="audit-language-popover" role="menu"><LanguageOptions onSelect={()=>setOpen(false)}/></div>}
  </div>;
}
