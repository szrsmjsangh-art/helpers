import { useState } from 'react'
import TextInput from '../common/TextInput'
import Button from '../common/Button'
import ErrorMessage from '../common/ErrorMessage'
import { signUp } from '../../services/authService'
export default function RegisterForm(){ const [form,setForm]=useState({name:'',email:'',password:''}); const [error,setError]=useState(''); const submit=async(e)=>{e.preventDefault();setError('');try{await signUp(form)}catch(err){setError(err.message)}}; return <form onSubmit={submit} className="space-y-4"><TextInput label="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><TextInput label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/><TextInput label="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/><ErrorMessage message={error}/><Button type="submit" className="w-full">Register</Button></form> }
