'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Same small sample library as the prototype (public domain KJV).
// Swap this out once the real Bible API is connected.
const BOOKS = {
  Genesis: { 1: [
    { n: 1, t: 'In the beginning God created the heaven and the earth.' },
    { n: 2, t: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
    { n: 3, t: 'And God said, Let there be light: and there was light.' },
  ]},
  Psalms: { 23: [
    { n: 1, t: 'The LORD is my shepherd; I shall not want.' },
    { n: 2, t: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.' },
    { n: 3, t: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
  ]},
  John: { 3: [
    { n: 16, t: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
    { n: 17, t: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.' },
  ]},
}
const BOOK_LIST = Object.keys(BOOKS)
const chaptersFor = (book) => Object.keys(BOOKS[book]).map(Number)
const HIGHLIGHTS = { yellow: '#F0D774', green: '#B9CBA6', pink: '#E3B7B0', blue: '#A9C4D1' }
const vKey = (b, c, v) => `${b}-${c}-${v}`

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const [book, setBook] = useState('Psalms')
  const [chapter, setChapter] = useState(23)
  const [scope, setScope] = useState('personal')
  const [selectedVerse, setSelectedVerse] = useState(null)

  const [highlights, setHighlights] = useState({}) // key -> color
  const [notes, setNotes] = useState([])
  const [draftNote, setDraftNote] = useState('')
  const [bookmark, setBookmark] = useState(null)

  const loadData = useCallback(async (uid) => {
    const { data: hl } = await supabase.from('highlights').select('*').eq('user_id', uid)
    const hlMap = {}
    ;(hl || []).forEach((h) => { hlMap[vKey(h.book, h.chapter, h.verse)] = h.color })
    setHighlights(hlMap)

    const { data: nt } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
    setNotes(nt || [])

    const { data: bm } = await supabase.from('bookmarks').select('*').eq('user_id', uid).maybeSingle()
    setBookmark(bm || null)
  }, [supabase])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (!prof || !prof.family_id) {
        // First time here, or no family yet — send them to set one up.
        // (Comment out this redirect if you'd rather let people skip it entirely.)
      }
      setProfile(prof)
      await loadData(user.id)
      setLoading(false)
    }
    init()
  }, [supabase, router, loadData])

  async function toggleHighlight(color) {
    if (!selectedVerse || !user) return
    const key = vKey(book, chapter, selectedVerse)
    const current = highlights[key]
    if (current === color) {
      await supabase.from('highlights').delete().eq('user_id', user.id).eq('book', book).eq('chapter', chapter).eq('verse', selectedVerse)
      setHighlights((h) => { const n = { ...h }; delete n[key]; return n })
    } else {
      await supabase.from('highlights').upsert({ user_id: user.id, book, chapter, verse: selectedVerse, color }, { onConflict: 'user_id,book,chapter,verse' })
      setHighlights((h) => ({ ...h, [key]: color }))
    }
  }

  async function addNote() {
    if (!draftNote.trim() || !selectedVerse || !user) return
    const { data, error } = await supabase.from('notes').insert({
      user_id: user.id,
      family_id: profile?.family_id || null,
      scope,
      book, chapter, verse: selectedVerse,
      text: draftNote.trim(),
    }).select().single()
    if (!error && data) {
      setNotes((n) => [data, ...n])
      setDraftNote('')
    }
  }

  async function setBookmarkHere() {
    if (!selectedVerse || !user) return
    const { data } = await supabase.from('bookmarks').upsert({
      user_id: user.id, book, chapter, verse: selectedVerse, updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' }).select().single()
    if (data) setBookmark(data)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>

  const verses = BOOKS[book][chapter] || []
  const notesForSelected = selectedVerse
    ? notes.filter((n) => n.book === book && n.chapter === chapter && n.verse === selectedVerse)
    : []

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Reading</h1>
        <button onClick={signOut} style={{ fontSize: 13, cursor: 'pointer' }}>Sign out</button>
      </div>

      {bookmark && (
        <p style={{ fontSize: 13, marginBottom: 16 }}>
          🔖 Resume: {bookmark.book} {bookmark.chapter}:{bookmark.verse}{' '}
          <button onClick={() => { setBook(bookmark.book); setChapter(bookmark.chapter); setSelectedVerse(bookmark.verse) }} style={{ cursor: 'pointer' }}>Go</button>
        </p>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <select value={book} onChange={(e) => { setBook(e.target.value); setChapter(chaptersFor(e.target.value)[0]); setSelectedVerse(null) }}>
          {BOOK_LIST.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={chapter} onChange={(e) => { setChapter(Number(e.target.value)); setSelectedVerse(null) }}>
          {chaptersFor(book).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={scope} onChange={(e) => setScope(e.target.value)}>
          <option value="personal">Personal</option>
          <option value="family">Family</option>
        </select>
      </div>

      {verses.map((v) => {
        const key = vKey(book, chapter, v.n)
        const isSelected = selectedVerse === v.n
        return (
          <div key={v.n} style={{ marginBottom: 10 }}>
            <span
              onClick={() => setSelectedVerse(isSelected ? null : v.n)}
              style={{
                cursor: 'pointer',
                background: highlights[key] ? HIGHLIGHTS[highlights[key]] : 'transparent',
                outline: isSelected ? '2px solid #999' : 'none',
              }}
            >
              <sup style={{ opacity: 0.5, marginRight: 4 }}>{v.n}</sup>{v.t}
            </span>

            {isSelected && (
              <div style={{ marginTop: 8, background: '#f4f1ea', borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  {Object.entries(HIGHLIGHTS).map(([name, color]) => (
                    <button key={name} onClick={() => toggleHighlight(name)}
                      style={{ width: 18, height: 18, borderRadius: '50%', background: color, border: '1px solid #0002', cursor: 'pointer' }} />
                  ))}
                  <button onClick={setBookmarkHere} style={{ fontSize: 12, cursor: 'pointer' }}>Bookmark this verse</button>
                </div>

                {notesForSelected.map((n) => (
                  <div key={n.id} style={{ fontSize: 13, marginBottom: 6, paddingBottom: 6, borderBottom: '1px solid #0001' }}>
                    <div style={{ opacity: 0.6, fontSize: 11 }}>{new Date(n.created_at).toLocaleString()} · {n.scope}</div>
                    {n.text}
                  </div>
                ))}
                <textarea value={draftNote} onChange={(e) => setDraftNote(e.target.value)} placeholder={`Add a ${scope} note...`}
                  style={{ width: '100%', minHeight: 50, boxSizing: 'border-box', marginBottom: 6 }} />
                <button onClick={addNote} style={{ cursor: 'pointer' }}>Save note</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
