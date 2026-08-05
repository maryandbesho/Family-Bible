'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [mode, setMode] = useState('create')
  const [familyName, setFamilyName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: family, error: famErr } = await supabase
      .from('families')
      .insert({ name: familyName })
      .select()
      .single()
    if (famErr) { setError(famErr.message); setBusy(false); return }
    const { error: profErr } = await supabase
      .from('profiles')
      .upsert({ id: user.id, family_id: family.id })
    if (profErr) { setError(profErr.message); setBusy(false); return }
    router.push('/')
  }

  async function handleJoin(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: family, error: famErr } = await supabase
      .from('families')
      .select('id')
      .eq('invite_code', inviteCode.trim())
      .single()
    if (famErr || !family) { setError('Invite code not found'); setBusy(false); return }
    const { error: profErr } = await supabase
      .from('profiles')
      .upsert({ id: user.id, family_id: family.id })
    if (profErr) { setError(profErr.message); setBusy(false); return }
    router.push('/')
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Set up your family</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode('create')} style={{ padding: 8, fontWeight: mode === 'create' ? 700 : 400, cursor: 'pointer' }}>Create a family</button>
        <button onClick={() => setMode('join')} style={{ padding: 8, fontWeight: mode === 'join' ? 700 : 400, cursor: 'pointer' }}>Join with a code</button>
      </div>
      {mode === 'create' ? (
        <form onSubmit={handleCreate}>
          <input placeholder="Family name" value={familyName} onChange={(e) => setFamilyName(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 10, boxSizing: 'border-box' }} required />
          <button type="submit" disabled={busy} style={{ width: '100%', padding: 10, cursor: 'pointer' }}>Create family</button>
        </form>
      ) : (
        <form onSubmit={handleJoin}>
          <input placeholder="Invite code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 10, boxSizing: 'border-box' }} required />
          <button type="submit" disabled={busy} style={{ width: '100%', padding: 10, cursor: 'pointer' }}>Join family</button>
        </form>
      )}
      {error && <p style={{ color: '#b00', marginTop: 10 }}>{error}</p>}
      <button onClick={() => router.push('/')} style={{ marginTop: 20, background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', display: 'block' }}>
        Skip for now
      </button>
    </div>
  )
}
