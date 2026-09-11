import { createContext, useEffect, useState } from 'react'
export const LanguageContext=createContext({language:'en',setLanguage:()=>{}})
export function LanguageProvider({children}){ const [language,setLanguage]=useState(()=>localStorage.getItem('language')||'en'); useEffect(()=>localStorage.setItem('language',language),[language]); return <LanguageContext.Provider value={{language,setLanguage}}>{children}</LanguageContext.Provider> }
