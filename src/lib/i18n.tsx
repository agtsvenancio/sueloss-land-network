import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
export type Language = 'pt' | 'en' | 'es';
export type Copy = readonly [string, string, string];
const LanguageContext = createContext<{language:Language; setLanguage:(v:Language)=>void; t:(pt:string,en:string,es:string)=>string}>({language:'pt',setLanguage:()=>{},t:(pt)=>pt});
export function LanguageProvider({children}:{children:ReactNode}) {
 const [language,setValue]=useState<Language>('pt');
 useEffect(()=>{const v=localStorage.getItem('sueloss-language');if(v==='pt'||v==='en'||v==='es')setValue(v)},[]);
 useEffect(()=>{document.documentElement.lang=language},[language]);
 const setLanguage=(v:Language)=>{setValue(v);localStorage.setItem('sueloss-language',v)};
 const t=(pt:string,en:string,es:string)=>[pt,en,es][language==='pt'?0:language==='en'?1:2] ?? pt;
 return <LanguageContext.Provider value={{language,setLanguage,t}}>{children}</LanguageContext.Provider>;
}
export const useLanguage=()=>useContext(LanguageContext);
