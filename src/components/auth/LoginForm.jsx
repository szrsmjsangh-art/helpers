import { useState } from 'react'
import TextInput from '../common/TextInput'
import Button from '../common/Button'
import ErrorMessage from '../common/ErrorMessage'
import { signIn } from '../../services/authService'
export default function LoginForm(){ const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const submit=async(e)=>{e.preventDefault();setError('');try{await signIn(email,password)}catch(err){setError(err.message)}}; return <form onSubmit={submit} className="space-y-4"><TextInput label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><TextInput label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><ErrorMessage message={error}/><Button type="submit" className="w-full">Login</Button></form> }
