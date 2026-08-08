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
  const [replies, setReplies] = useState({}) // note_id -> [reply, ...]
  const [bookmark, setBookmark] = useState(null)

  // Note draft
  const [draftText, setDraftText] = useState('')
  const [draftImageFile, setDraftImageFile] = useState(null)
  const [draftLinkOn, setDraftLinkOn] = useState(false)
  const [draftLink, setDraftLink] = useState({ book: 'Genesis', chapter: 1, verse: 1, type: 'cross-ref' })
  const [saving, setSaving] = useState(false)

  // Reply drafts
  const [replyDraftFor, setReplyDraftFor] = useState(null)
  const [replyText, setReplyText] = useState('')

  const loadData = useCallback(async (uid) => {
    const { data: hl } = await supabase.from('highlights').select('*').eq('user_id', uid)
    const hlMap = {}
    ;(hl || []).forEach((h) => { hlMap[vKey(h.book, h.chapter, h.verse)] = h.color })
    setHighlights(hlMap)

    const { data: nt } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
    setNotes(nt || [])

    if (nt && nt.length > 0) {
      const { data: rp } = await supabase
        .from('note_replies')
        .select('*')
        .in('note_id', nt.map((n) => n.id))
        .order('created_at', { ascending: true })
      const map = {}
      ;(rp || []).forEach((r) => {
        if (!map[r.note_id]) map[r.note_id] = []
        map[r.note_id].push(r)
      })
      setReplies(map)
    }

    const { data: bm } = await supabase.from('bookmarks').select('*').eq('user_id', uid).maybeSingle()
    setBookmark(bm || null)
  }, [supabase])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
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

  async function uploadNoteImage(file) {
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('note-images').upload(path, file)
    if (upErr) throw upErr
    const { data } = supabase.storage.from('note-images').getPublicUrl(path)
    return data.publicUrl
  }

  async function addNote() {
    if (!draftText.trim() || !selectedVerse || !user) return
    setSaving(true)
    try {
      let image_url = null
      if (draftImageFile) {
        image_url = await uploadNoteImage(draftImageFile)
      }
      const payload = {
        user_id: user.id,
        family_id: profile?.family_id || null,
        scope,
        book, chapter, verse: selectedVerse,
        text: draftText.trim(),
        image_url,
        link_book: draftLinkOn ? draftLink.book : null,
        link_chapter: draftLinkOn ? Number(draftLink.chapter) : null,
        link_verse: draftLinkOn ? Number(draftLink.verse) : null,
        link_type: draftLinkOn ? draftLink.type : null,
      }
      const { data, error } = await supabase.from('notes').insert(payload).select().single()
      if (error) throw error
      setNotes((n) => [data, ...n])
      setDraftText(''); setDraftImageFile(null); setDraftLinkOn(false)
    } catch (err) {
      alert('Could not save note: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function addReply(noteId) {
    if (!replyText.trim() || !user) return
    const { data, error } = await supabase.from('note_replies').insert({
      note_id: noteId, user_id: user.id, scope, text: replyText.trim(),
    }).select().single()
    if (!error && data) {
      setReplies((r) => ({ ...r, [noteId]: [...(r[noteId] || []), data] }))
      setReplyText(''); setReplyDraftFor(null)
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

  // Notes visible on a given verse: notes written directly on it, OR
  // notes written elsewhere that link TO it (cross-reference/prophecy).
  function notesForVerse(b, c, v) {
    return notes.filter((n) =>
      (n.book === b && n.chapter === c && n.verse === v) ||
      (n.link_book === b && n.link_chapter === c && n.link_verse === v)
    )
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>

  const verses = BOOKS[book][chapter] || []

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

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
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
        const notesHere = notesForVerse(book, chapter, v.n)
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
            {notesHere.length > 0 && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.6 }}>Notes: {notesHere.length}</span>}

            {isSelected && (
              <div style={{ marginTop: 8, background: '#f4f1ea', borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                  {Object.entries(HIGHLIGHTS).map(([name, color]) => (
                    <button key={name} onClick={() => toggleHighlight(name)}
                      style={{ width: 18, height: 18, borderRadius: '50%', background: color, border: '1px solid #0002', cursor: 'pointer' }} />
                  ))}
                  <button onClick={setBookmarkHere} style={{ fontSize: 12, cursor: 'pointer' }}>Bookmark this verse</button>
                </div>

                {notesHere.map((n) => {
                  const isLinkedIn = !(n.book === book && n.chapter === chapter && n.verse === v.n)
                  const otherRef = isLinkedIn
                    ? { book: n.book, chapter: n.chapter, verse: n.verse }
                    : (n.link_book ? { book: n.link_book, chapter: n.link_chapter, verse: n.link_verse } : null)
                  return (
                    <div key={n.id} style={{ fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #0001' }}>
                      <div style={{ opacity: 0.6, fontSize: 11 }}>{new Date(n.created_at).toLocaleString()} · {n.scope}</div>
                      <div>{n.text}</div>
                      {n.image_url && (
                        <img src={n.image_url} alt="" style={{ maxWidth: '100%', borderRadius: 6, marginTop: 6 }} />
                      )}
                      {otherRef && (
                        <div style={{ marginTop: 4, fontSize: 11, opacity: 0.7 }}>
                          {isLinkedIn ? 'Linked from ' : (n.link_type === 'prophecy' ? 'Fulfilled in ' : 'Cross-ref to ')}
                          {otherRef.book} {otherRef.chapter}:{otherRef.verse}
                        </div>
                      )}

                      {(replies[n.id] || []).map((r) => (
                        <div key={r.id} style={{ marginTop: 6, marginLeft: 12, borderLeft: '2px solid #0002', paddingLeft: 8, fontSize: 12 }}>
                          <div style={{ opacity: 0.55, fontSize: 10 }}>{new Date(r.created_at).toLocaleString()} · {r.scope}</div>
                          {r.text}
                        </div>
                      ))}
                      {replyDraftFor === n.id ? (
                        <div style={{ marginTop: 6, marginLeft: 12, display: 'flex', gap: 6 }}>
                          <input value={replyText} onChange={(e) => setReplyText(e.target.value)}
                            style={{ flex: 1, fontSize: 12, padding: 4 }} placeholder="Reply..." autoFocus />
                          <button onClick={() => addReply(n.id)} style={{ fontSize: 12, cursor: 'pointer' }}>Send</button>
                        </div>
                      ) : (
                        <button onClick={() => { setReplyDraftFor(n.id); setReplyText('') }}
                          style={{ marginTop: 6, marginLeft: 12, fontSize: 11, background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                          Reply
                        </button>
                      )}
                    </div>
                  )
                })}

                <textarea value={draftText} onChange={(e) => setDraftText(e.target.value)} placeholder={`Add a ${scope} note...`}
                  style={{ width: '100%', minHeight: 50, boxSizing: 'border-box', marginBottom: 6 }} />

                <div style={{ marginBottom: 6 }}>
                  <label style={{ fontSize: 12, cursor: 'pointer' }}>
                    Attach a photo
                    <input type="file" accept="image/*" style={{ display: 'block', marginTop: 4 }}
                      onChange={(e) => setDraftImageFile(e.target.files?.[0] || null)} />
                  </label>
                </div>

                <label style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                  <input type="checkbox" checked={draftLinkOn} onChange={(e) => setDraftLinkOn(e.target.checked)} /> Link this note to another verse
                </label>
                {draftLinkOn && (
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                    <select value={draftLink.book} onChange={(e) => setDraftLink((d) => ({ ...d, book: e.target.value, chapter: chaptersFor(e.target.value)[0] }))}>
                      {BOOK_LIST.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select value={draftLink.chapter} onChange={(e) => setDraftLink((d) => ({ ...d, chapter: Number(e.target.value) }))}>
                      {chaptersFor(draftLink.book).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" min={1} value={draftLink.verse} onChange={(e) => setDraftLink((d) => ({ ...d, verse: e.target.value }))} style={{ width: 50 }} />
                    <select value={draftLink.type} onChange={(e) => setDraftLink((d) => ({ ...d, type: e.target.value }))}>
                      <option value="cross-ref">Cross-reference</option>
                      <option value="prophecy">Prophecy - fulfilled here</option>
                    </select>
                  </div>
                )}

                <button onClick={addNote} disabled={saving} style={{ cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save note'}</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
