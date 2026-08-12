'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); return }
    router.push('/')
    router.refresh()
  }

  return (
    <main className="max-w-sm mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">Log in</h1>
      <form onSubmit={handleLogin} className="space-y-3">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email" required className="border p-2 w-full" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Password" required className="border p-2 w-full" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Log in</button>
      </form>
    </main>
  )
}