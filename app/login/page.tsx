'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { buttonPrimaryClass, inputClass, labelClass } from '@/lib/ui'

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
    <main className="mx-auto flex min-h-full max-w-sm items-center p-4 sm:p-8">
      <div className="w-full rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
        <h1 className="mb-4 text-xl font-bold">Log in</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={inputClass}
            />
          </div>
          <button className={`${buttonPrimaryClass} w-full`}>Log in</button>
        </form>
      </div>
    </main>
  )
}
