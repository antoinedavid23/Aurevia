"use client";
import { motion, useReducedMotion } from "motion/react";
export function Reveal({children,className="",eager=false}:{children:React.ReactNode,className?:string;eager?:boolean}){const reduced=useReducedMotion();return <motion.div className={className} initial={reduced?false:eager?{opacity:1,y:24}:{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}} transition={{duration:.75,ease:[.22,1,.36,1]}}>{children}</motion.div>}
