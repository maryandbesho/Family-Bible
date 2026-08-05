'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function sendLink(e) {
    e.preventDefault()
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Sign in</h1>
      {sent ? (
        <p>Check your email for a sign-in link.</p>
      ) : (
        <form onSubmit={sendLink}>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 10, boxSizing: 'border-box', fontSize: 15 }}
          />
          <button type="submit" style={{ width: '100%', padding: 10, fontSize: 15, cursor: 'pointer' }}>
            Send magic link
          </button>
          {error && <p style={{ color: '#b00', marginTop: 10 }}>{error}</p>}
        </form>
      )}
    </div>
  )
}
