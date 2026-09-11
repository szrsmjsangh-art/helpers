import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
export default function LoginPage(){ const [mode,setMode]=useState('login'); return <div><PageHeader title={mode==='login'?'Login':'Register'}/><div className="mb-4 flex gap-2"><button onClick={()=>setMode('login')} className="rounded-lg border px-3 py-2">Login</button><button onClick={()=>setMode('register')} className="rounded-lg border px-3 py-2">Register</button></div>{mode==='login'?<LoginForm/>:<RegisterForm/>}</div> }
