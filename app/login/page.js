'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Kept in sync with the same theme tokens used in app/page.js's Settings
// tab. This page has no Settings UI of its own - it just reads whatever
// theme/font/accent was last chosen there, so sign-in matches the rest
// of the app. Defaults to Parchment/Medium the very first time someone
// visits before ever signing in.
const THEMES = {
  parchment: { bg: '#F6F1E4', surface: '#FFFFFF', surfaceAlt: '#FBF6EA', text: '#2B2116', textMuted: '#6B5D4B', border: '#E3D9C2', accent: '#7A2E2E', onAccent: '#FFFFFF', danger: '#B00000' },
  midnight: { bg: '#1B1D24', surface: '#242732', surfaceAlt: '#2B2E3A', text: '#EDEAE2', textMuted: '#A8A296', border: '#3A3D4A', accent: '#C9A24B', onAccent: '#1B1D24', danger: '#FF6B6B' },
  sage: { bg: '#F1F3EA', surface: '#FFFFFF', surfaceAlt: '#E9EDE0', text: '#2C3326', textMuted: '#5E6B52', border: '#D7DCC6', accent: '#4B6B4A', onAccent: '#FFFFFF', danger: '#B0342C' },
  slate: { bg: '#EEF1F4', surface: '#FFFFFF', surfaceAlt: '#E4E9EE', text: '#212B36', textMuted: '#5E6B78', border: '#D3DBE2', accent: '#2F5C8A', onAccent: '#FFFFFF', danger: '#B0342C' },
  rose: { bg: '#F8F1EF', surface: '#FFFFFF', surfaceAlt: '#F1E5E2', text: '#3A2A28', textMuted: '#7A6360', border: '#E7D4CF', accent: '#A65D57', onAccent: '#FFFFFF', danger: '#B0342C' },
}
const FONT_SCALES = { small: 0.9, medium: 1, large: 1.15, xlarge: 1.3 }
const FONT_IMPORT_CSS = `@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap');`

function contrastText(hex) {
  if (!hex) return '#FFFFFF'
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const r = parseInt(full.substring(0, 2), 16)
  const g = parseInt(full.substring(2, 4), 16)
  const b = parseInt(full.substring(4, 6), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 150 ? '#1B1D24' : '#FFFFFF'
}

export default function LoginPage() {
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  const [themeKey, setThemeKey] = useState('parchment')
  const [fontScaleKey, setFontScaleKey] = useState('medium')
  const [accentOverride, setAccentOverride] = useState(null)

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem('fb_theme')
      const savedFont = window.localStorage.getItem('fb_font_scale')
      const savedAccent = window.localStorage.getItem('fb_accent')
      if (savedTheme && THEMES[savedTheme]) setThemeKey(savedTheme)
      if (savedFont && FONT_SCALES[savedFont]) setFontScaleKey(savedFont)
      if (savedAccent) setAccentOverride(savedAccent)
    } catch (e) { /* localStorage unavailable */ }
  }, [])

  const themePalette = THEMES[themeKey] || THEMES.parchment
  const resolvedAccent = accentOverride || themePalette.accent
  const resolvedOnAccent = accentOverride ? contrastText(accentOverride) : themePalette.onAccent
  const fontScale = FONT_SCALES[fontScaleKey] || 1

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

  const inputStyle = {
    width: '100%', padding: 11, marginBottom: 12, boxSizing: 'border-box', fontSize: 15,
    fontFamily: "'Inter', system-ui, sans-serif", borderRadius: 8,
    border: `1px solid ${themePalette.border}`, background: themePalette.surfaceAlt, color: themePalette.text,
  }

  return (
    <div style={{ minHeight: '100vh', background: themePalette.bg, color: themePalette.text, fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, boxSizing: 'border-box' }}>
      <style>{FONT_IMPORT_CSS}</style>
      <div style={{ maxWidth: 380, width: '100%', zoom: fontScale }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: themePalette.textMuted, marginBottom: 6 }}>Family Bible</div>
          <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 28, margin: 0, fontWeight: 600, color: themePalette.text }}>
            {mode === 'signup' ? 'Create an account' : 'Welcome back'}
          </h1>
        </div>

        <div style={{ background: themePalette.surface, border: `1px solid ${themePalette.border}`, borderRadius: 14, padding: 28, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, marginBottom: 18 }}
            />
            <button type="submit" disabled={busy}
              style={{
                width: '100%', padding: 12, fontSize: 15, cursor: busy ? 'default' : 'pointer',
                fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, border: 'none', borderRadius: 8,
                background: resolvedAccent, color: resolvedOnAccent, opacity: busy ? 0.7 : 1,
              }}>
              {busy ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
            {error && <p style={{ color: themePalette.danger, marginTop: 12, fontSize: 13, marginBottom: 0 }}>{error}</p>}
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <button
            onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError('') }}
            style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: 13, color: themePalette.textMuted, fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            {mode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  )
}
