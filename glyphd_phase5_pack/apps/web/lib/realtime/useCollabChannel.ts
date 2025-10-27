'use client'
import { useEffect, useRef } from 'react'
type Handler=(payload:any)=>void
export function useCollabChannel(collabId:string){const h=useRef<Record<string,Handler[]>>({});function on(ev:string,fn:Handler){h.current[ev]=h.current[ev]||[];h.current[ev].push(fn);return()=>{h.current[ev]=(h.current[ev]||[]).filter(x=>x!==fn)}}function emit(ev:string,p:any){(h.current[ev]||[]).forEach(fn=>fn(p))}useEffect(()=>{},[collabId]);return{on,emit}}
