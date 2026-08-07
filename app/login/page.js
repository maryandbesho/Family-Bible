'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const supabase = createClient()

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setBusy(false); return }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setBusy(false); return }
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>{mode === 'signup' ? 'Create an account' : 'Sign in'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, boxSizing: 'border-box', fontSize: 15 }}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, boxSizing: 'border-box', fontSize: 15 }}
        />
        <button type="submit" disabled={busy} style={{ width: '100%', padding: 10, fontSize: 15, cursor: 'pointer' }}>
          {mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
        {error && <p style={{ color: '#b00', marginTop: 10 }}>{error}</p>}
      </form>
      <button
        onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError('') }}
        style={{ marginTop: 16, background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: 13 }}
      >
        {mode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
      </button>
    </div>
  )
}
