'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// All 66 books of the Protestant canon, with their USFM code (used to
// talk to the /api/bible route) and total chapter count (used to build
// the chapter dropdown). Verse text itself is fetched live from
// api.bible - see fetchChapter() and the chapterCache state below.
const BOOK_META = [
  { name: 'Genesis', usfm: 'GEN', chapters: 50 }, { name: 'Exodus', usfm: 'EXO', chapters: 40 },
  { name: 'Leviticus', usfm: 'LEV', chapters: 27 }, { name: 'Numbers', usfm: 'NUM', chapters: 36 },
  { name: 'Deuteronomy', usfm: 'DEU', chapters: 34 }, { name: 'Joshua', usfm: 'JOS', chapters: 24 },
  { name: 'Judges', usfm: 'JDG', chapters: 21 }, { name: 'Ruth', usfm: 'RUT', chapters: 4 },
  { name: '1 Samuel', usfm: '1SA', chapters: 31 }, { name: '2 Samuel', usfm: '2SA', chapters: 24 },
  { name: '1 Kings', usfm: '1KI', chapters: 22 }, { name: '2 Kings', usfm: '2KI', chapters: 25 },
  { name: '1 Chronicles', usfm: '1CH', chapters: 29 }, { name: '2 Chronicles', usfm: '2CH', chapters: 36 },
  { name: 'Ezra', usfm: 'EZR', chapters: 10 }, { name: 'Nehemiah', usfm: 'NEH', chapters: 13 },
  { name: 'Esther', usfm: 'EST', chapters: 10 }, { name: 'Job', usfm: 'JOB', chapters: 42 },
  { name: 'Psalms', usfm: 'PSA', chapters: 150 }, { name: 'Proverbs', usfm: 'PRO', chapters: 31 },
  { name: 'Ecclesiastes', usfm: 'ECC', chapters: 12 }, { name: 'Song of Solomon', usfm: 'SNG', chapters: 8 },
  { name: 'Isaiah', usfm: 'ISA', chapters: 66 }, { name: 'Jeremiah', usfm: 'JER', chapters: 52 },
  { name: 'Lamentations', usfm: 'LAM', chapters: 5 }, { name: 'Ezekiel', usfm: 'EZK', chapters: 48 },
  { name: 'Daniel', usfm: 'DAN', chapters: 12 }, { name: 'Hosea', usfm: 'HOS', chapters: 14 },
  { name: 'Joel', usfm: 'JOL', chapters: 3 }, { name: 'Amos', usfm: 'AMO', chapters: 9 },
  { name: 'Obadiah', usfm: 'OBA', chapters: 1 }, { name: 'Jonah', usfm: 'JON', chapters: 4 },
  { name: 'Micah', usfm: 'MIC', chapters: 7 }, { name: 'Nahum', usfm: 'NAM', chapters: 3 },
  { name: 'Habakkuk', usfm: 'HAB', chapters: 3 }, { name: 'Zephaniah', usfm: 'ZEP', chapters: 3 },
  { name: 'Haggai', usfm: 'HAG', chapters: 2 }, { name: 'Zechariah', usfm: 'ZEC', chapters: 14 },
  { name: 'Malachi', usfm: 'MAL', chapters: 4 },
  { name: 'Matthew', usfm: 'MAT', chapters: 28 }, { name: 'Mark', usfm: 'MRK', chapters: 16 },
  { name: 'Luke', usfm: 'LUK', chapters: 24 }, { name: 'John', usfm: 'JHN', chapters: 21 },
  { name: 'Acts', usfm: 'ACT', chapters: 28 }, { name: 'Romans', usfm: 'ROM', chapters: 16 },
  { name: '1 Corinthians', usfm: '1CO', chapters: 16 }, { name: '2 Corinthians', usfm: '2CO', chapters: 13 },
  { name: 'Galatians', usfm: 'GAL', chapters: 6 }, { name: 'Ephesians', usfm: 'EPH', chapters: 6 },
  { name: 'Philippians', usfm: 'PHP', chapters: 4 }, { name: 'Colossians', usfm: 'COL', chapters: 4 },
  { name: '1 Thessalonians', usfm: '1TH', chapters: 5 }, { name: '2 Thessalonians', usfm: '2TH', chapters: 3 },
  { name: '1 Timothy', usfm: '1TI', chapters: 6 }, { name: '2 Timothy', usfm: '2TI', chapters: 4 },
  { name: 'Titus', usfm: 'TIT', chapters: 3 }, { name: 'Philemon', usfm: 'PHM', chapters: 1 },
  { name: 'Hebrews', usfm: 'HEB', chapters: 13 }, { name: 'James', usfm: 'JAS', chapters: 5 },
  { name: '1 Peter', usfm: '1PE', chapters: 5 }, { name: '2 Peter', usfm: '2PE', chapters: 3 },
  { name: '1 John', usfm: '1JN', chapters: 5 }, { name: '2 John', usfm: '2JN', chapters: 1 },
  { name: '3 John', usfm: '3JN', chapters: 1 }, { name: 'Jude', usfm: 'JUD', chapters: 1 },
  { name: 'Revelation', usfm: 'REV', chapters: 22 },
]
const BOOK_LIST = BOOK_META.map((b) => b.name)
const usfmFor = (bookName) => BOOK_META.find((b) => b.name === bookName)?.usfm
const chaptersFor = (book) => {
  const meta = BOOK_META.find((b) => b.name === book)
  return meta ? Array.from({ length: meta.chapters }, (_, i) => i + 1) : []
}
const chapterCacheKey = (book, chapter) => `${book}-${chapter}`
const HIGHLIGHTS = { yellow: '#F0D774', green: '#B9CBA6', pink: '#E3B7B0', blue: '#A9C4D1' }
const vKey = (b, c, v) => `${b}-${c}-${v}`
const PRAYER_CATEGORIES = ['Family', 'Health', 'Guidance', 'Praise', 'Other']
const summaryKey = (b, c) => `${b}-${c}`

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const [tab, setTab] = useState('read') // 'read' | 'prayers'

  const [book, setBook] = useState('Psalms')
  const [chapter, setChapter] = useState(23)
  const [scope, setScope] = useState('personal')
  const [selectedVerse, setSelectedVerse] = useState(null)
  const [showSummary, setShowSummary] = useState(true)
  const [chapterSummaries, setChapterSummaries] = useState({}) // key -> {summary, updated_by, updated_at}
  const [editingSummary, setEditingSummary] = useState(false)
  const [summaryDraft, setSummaryDraft] = useState('')
  const [savingSummary, setSavingSummary] = useState(false)

  // Split view — right pane is a fully independent reading pane
  const [splitOn, setSplitOn] = useState(false)
  const [splitBook, setSplitBook] = useState('Genesis')
  const [splitChapter, setSplitChapter] = useState(1)
  const [splitScope, setSplitScope] = useState('personal')
  const [splitSelectedVerse, setSplitSelectedVerse] = useState(null)
  const [splitDraftText, setSplitDraftText] = useState('')
  const [splitDraftImageFile, setSplitDraftImageFile] = useState(null)
  const [splitDraftLinkOn, setSplitDraftLinkOn] = useState(false)
  const [splitDraftLink, setSplitDraftLink] = useState({ book: 'Genesis', chapter: 1, verse: 1, type: 'cross-ref' })
  const [splitSaving, setSplitSaving] = useState(false)
  const [splitReplyDraftFor, setSplitReplyDraftFor] = useState(null)
  const [splitReplyText, setSplitReplyText] = useState('')

  // Live Bible text, fetched from /api/bible and cached by "Book-chapter"
  // key so re-visiting a chapter (or both panes showing the same one)
  // doesn't re-fetch. Shape: { [key]: { verses, loading, error, copyright } }
  const [chapterCache, setChapterCache] = useState({})

  const [highlights, setHighlights] = useState({}) // key -> color
  const [notes, setNotes] = useState([])
  const [replies, setReplies] = useState({}) // note_id -> [reply, ...]
  const [bookmark, setBookmark] = useState(null)

  // Prayer list
  const [prayers, setPrayers] = useState([])
  const [showAnswered, setShowAnswered] = useState(false)
  const [prayerTitle, setPrayerTitle] = useState('')
  const [prayerDetails, setPrayerDetails] = useState('')
  const [prayerCategory, setPrayerCategory] = useState('Family')
  const [prayerShared, setPrayerShared] = useState(false)
  const [prayerVerseOn, setPrayerVerseOn] = useState(false)
  const [prayerVerse, setPrayerVerse] = useState({ book: 'Genesis', chapter: 1, verse: 1 })
  const [savingPrayer, setSavingPrayer] = useState(false)

  // Search
  const [searchQuery, setSearchQuery] = useState('')
  const [bibleSearchResults, setBibleSearchResults] = useState([])
  const [bibleSearching, setBibleSearching] = useState(false)

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

    const { data: pr } = await supabase.from('prayers').select('*').order('created_at', { ascending: false })
    setPrayers(pr || [])

    const { data: cs } = await supabase.from('chapter_summaries').select('*')
    const csMap = {}
    ;(cs || []).forEach((s) => { csMap[summaryKey(s.book, s.chapter)] = s })
    setChapterSummaries(csMap)
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

  // Fetches a chapter's verse text from /api/bible and stores it in
  // chapterCache. Skips the fetch if we already have (or are already
  // fetching) that chapter.
  const fetchChapter = useCallback((book, chapter) => {
    const key = chapterCacheKey(book, chapter)
    setChapterCache((cache) => {
      if (cache[key]) return cache // already loaded or loading
      return { ...cache, [key]: { verses: [], loading: true, error: null, copyright: null } }
    })
    const usfm = usfmFor(book)
    fetch(`/api/bible?book=${usfm}&chapter=${chapter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setChapterCache((cache) => ({ ...cache, [key]: { verses: [], loading: false, error: data.error, copyright: null } }))
        } else {
          setChapterCache((cache) => ({ ...cache, [key]: { verses: data.verses || [], loading: false, error: null, copyright: data.copyright || null } }))
        }
      })
      .catch((err) => {
        setChapterCache((cache) => ({ ...cache, [key]: { verses: [], loading: false, error: String(err), copyright: null } }))
      })
  }, [])

  useEffect(() => {
    if (book && chapter) fetchChapter(book, chapter)
  }, [book, chapter, fetchChapter])

  useEffect(() => {
    if (splitOn && splitBook && splitChapter) fetchChapter(splitBook, splitChapter)
  }, [splitOn, splitBook, splitChapter, fetchChapter])

  // Debounced remote Bible search (300ms after typing stops) using
  // api.bible's own search endpoint via /api/bible?q=...
  useEffect(() => {
    const q = searchQuery.trim()
    if (!q) { setBibleSearchResults([]); setBibleSearching(false); return }
    setBibleSearching(true)
    const timer = setTimeout(() => {
      fetch(`/api/bible?q=${encodeURIComponent(q)}`)
        .then((res) => res.json())
        .then((data) => setBibleSearchResults(data.results || []))
        .catch(() => setBibleSearchResults([]))
        .finally(() => setBibleSearching(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  async function toggleHighlight(color, b, c, v) {
    if (!v || !user) return
    const key = vKey(b, c, v)
    const current = highlights[key]
    if (current === color) {
      await supabase.from('highlights').delete().eq('user_id', user.id).eq('book', b).eq('chapter', c).eq('verse', v)
      setHighlights((h) => { const n = { ...h }; delete n[key]; return n })
    } else {
      await supabase.from('highlights').upsert({ user_id: user.id, book: b, chapter: c, verse: v, color }, { onConflict: 'user_id,book,chapter,verse' })
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

  async function addNote(p, verseNum) {
    if (!p.draftText.trim() || !verseNum || !user) return
    p.setSaving(true)
    try {
      let image_url = null
      if (p.draftImageFile) {
        image_url = await uploadNoteImage(p.draftImageFile)
      }
      const payload = {
        user_id: user.id,
        family_id: profile?.family_id || null,
        scope: p.scope,
        book: p.book, chapter: p.chapter, verse: verseNum,
        text: p.draftText.trim(),
        image_url,
        link_book: p.draftLinkOn ? p.draftLink.book : null,
        link_chapter: p.draftLinkOn ? Number(p.draftLink.chapter) : null,
        link_verse: p.draftLinkOn ? Number(p.draftLink.verse) : null,
        link_type: p.draftLinkOn ? p.draftLink.type : null,
      }
      const { data, error } = await supabase.from('notes').insert(payload).select().single()
      if (error) throw error
      setNotes((n) => [data, ...n])
      p.setDraftText(''); p.setDraftImageFile(null); p.setDraftLinkOn(false)
    } catch (err) {
      alert('Could not save note: ' + err.message)
    } finally {
      p.setSaving(false)
    }
  }

  async function deleteNote(noteId) {
    if (!confirm('Delete this note?')) return
    const { error } = await supabase.from('notes').delete().eq('id', noteId)
    if (error) {
      alert('Could not delete note: ' + error.message)
      return
    }
    setNotes((n) => n.filter((note) => note.id !== noteId))
  }

  async function addReply(noteId, p) {
    if (!p.replyText.trim() || !user) return
    const { data, error } = await supabase.from('note_replies').insert({
      note_id: noteId, user_id: user.id, scope: p.scope, text: p.replyText.trim(),
    }).select().single()
    if (!error && data) {
      setReplies((r) => ({ ...r, [noteId]: [...(r[noteId] || []), data] }))
      p.setReplyText(''); p.setReplyDraftFor(null)
    }
  }

  async function setBookmarkHere(b, c, v) {
    if (!v || !user) return
    const { data } = await supabase.from('bookmarks').upsert({
      user_id: user.id, book: b, chapter: c, verse: v, updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' }).select().single()
    if (data) setBookmark(data)
  }

  async function addPrayer() {
    if (!prayerTitle.trim() || !user) return
    setSavingPrayer(true)
    try {
      const payload = {
        user_id: user.id,
        family_id: profile?.family_id || null,
        title: prayerTitle.trim(),
        details: prayerDetails.trim() || null,
        category: prayerCategory,
        is_shared: prayerShared,
        verse_book: prayerVerseOn ? prayerVerse.book : null,
        verse_chapter: prayerVerseOn ? Number(prayerVerse.chapter) : null,
        verse_verse: prayerVerseOn ? Number(prayerVerse.verse) : null,
      }
      const { data, error } = await supabase.from('prayers').insert(payload).select().single()
      if (error) throw error
      setPrayers((p) => [data, ...p])
      setPrayerTitle(''); setPrayerDetails(''); setPrayerCategory('Family')
      setPrayerShared(false); setPrayerVerseOn(false)
    } catch (err) {
      alert('Could not save prayer: ' + err.message)
    } finally {
      setSavingPrayer(false)
    }
  }

  async function markPrayerAnswered(prayerId) {
    const note = prompt('Optional: how was this prayer answered?') || null
    const { data, error } = await supabase.from('prayers').update({
      is_answered: true, answered_note: note, answered_at: new Date().toISOString(),
    }).eq('id', prayerId).select().single()
    if (error) { alert('Could not update prayer: ' + error.message); return }
    setPrayers((p) => p.map((pr) => (pr.id === prayerId ? data : pr)))
  }

  async function deletePrayer(prayerId) {
    if (!confirm('Delete this prayer?')) return
    const { error } = await supabase.from('prayers').delete().eq('id', prayerId)
    if (error) { alert('Could not delete prayer: ' + error.message); return }
    setPrayers((p) => p.filter((pr) => pr.id !== prayerId))
  }

  async function saveChapterSummary() {
    if (!summaryDraft.trim() || !user) return
    setSavingSummary(true)
    try {
      const payload = {
        book, chapter,
        summary: summaryDraft.trim(),
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      }
      const { data, error } = await supabase
        .from('chapter_summaries')
        .upsert(payload, { onConflict: 'book,chapter' })
        .select()
        .single()
      if (error) throw error
      setChapterSummaries((m) => ({ ...m, [summaryKey(book, chapter)]: data }))
      setEditingSummary(false)
    } catch (err) {
      alert('Could not save summary: ' + err.message)
    } finally {
      setSavingSummary(false)
    }
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

  // Renders a fully-interactive verse list (highlight, notes, cross-ref links,
  // replies, bookmark) for a given pane's book/chapter/state. Used for both
  // the main pane and the split-view right pane so they share all features.
  function renderReadingPane(p) {
    const entry = chapterCache[chapterCacheKey(p.book, p.chapter)]
    if (!entry || entry.loading) {
      return <p style={{ fontSize: 13, opacity: 0.6 }}>Loading {p.book} {p.chapter}...</p>
    }
    if (entry.error) {
      return <p style={{ fontSize: 13, color: '#a33' }}>Couldn't load {p.book} {p.chapter}: {entry.error}</p>
    }
    const verses = entry.verses
    return (
      <>
      {verses.map((v) => {
      const key = vKey(p.book, p.chapter, v.n)
      const isSelected = p.selectedVerse === v.n
      const notesHere = notesForVerse(p.book, p.chapter, v.n)
      return (
        <div key={v.n} style={{ marginBottom: 10 }}>
          <span
            onClick={() => p.setSelectedVerse(isSelected ? null : v.n)}
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
                  <button key={name} onClick={() => toggleHighlight(name, p.book, p.chapter, v.n)}
                    style={{ width: 18, height: 18, borderRadius: '50%', background: color, border: '1px solid #0002', cursor: 'pointer' }} />
                ))}
                <button onClick={() => setBookmarkHere(p.book, p.chapter, v.n)} style={{ fontSize: 12, cursor: 'pointer' }}>Bookmark this verse</button>
              </div>

              {notesHere.map((n) => {
                const isLinkedIn = !(n.book === p.book && n.chapter === p.chapter && n.verse === v.n)
                const otherRef = isLinkedIn
                  ? { book: n.book, chapter: n.chapter, verse: n.verse }
                  : (n.link_book ? { book: n.link_book, chapter: n.link_chapter, verse: n.link_verse } : null)
                return (
                  <div key={n.id} style={{ fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #0001' }}>
                    <div style={{ opacity: 0.6, fontSize: 11, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{new Date(n.created_at).toLocaleString()} · {n.scope}</span>
                      {n.user_id === user.id && (
                        <button onClick={() => deleteNote(n.id)} style={{ fontSize: 11, color: '#b00', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                      )}
                    </div>
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
                    {p.replyDraftFor === n.id ? (
                      <div style={{ marginTop: 6, marginLeft: 12, display: 'flex', gap: 6 }}>
                        <input value={p.replyText} onChange={(e) => p.setReplyText(e.target.value)}
                          style={{ flex: 1, fontSize: 12, padding: 4 }} placeholder="Reply..." autoFocus />
                        <button onClick={() => addReply(n.id, p)} style={{ fontSize: 12, cursor: 'pointer' }}>Send</button>
                      </div>
                    ) : (
                      <button onClick={() => { p.setReplyDraftFor(n.id); p.setReplyText('') }}
                        style={{ marginTop: 6, marginLeft: 12, fontSize: 11, background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                        Reply
                      </button>
                    )}
                  </div>
                )
              })}

              <textarea value={p.draftText} onChange={(e) => p.setDraftText(e.target.value)} placeholder={`Add a ${p.scope} note...`}
                style={{ width: '100%', minHeight: 50, boxSizing: 'border-box', marginBottom: 6 }} />

              <div style={{ marginBottom: 6 }}>
                <label style={{ fontSize: 12, cursor: 'pointer' }}>
                  Attach a photo
                  <input type="file" accept="image/*" style={{ display: 'block', marginTop: 4 }}
                    onChange={(e) => p.setDraftImageFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <label style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                <input type="checkbox" checked={p.draftLinkOn} onChange={(e) => p.setDraftLinkOn(e.target.checked)} /> Link this note to another verse
              </label>
              {p.draftLinkOn && (
                <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                  <select value={p.draftLink.book} onChange={(e) => p.setDraftLink((d) => ({ ...d, book: e.target.value, chapter: chaptersFor(e.target.value)[0] }))}>
                    {BOOK_LIST.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <select value={p.draftLink.chapter} onChange={(e) => p.setDraftLink((d) => ({ ...d, chapter: Number(e.target.value) }))}>
                    {chaptersFor(p.draftLink.book).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="number" min={1} value={p.draftLink.verse} onChange={(e) => p.setDraftLink((d) => ({ ...d, verse: e.target.value }))} style={{ width: 50 }} />
                  <select value={p.draftLink.type} onChange={(e) => p.setDraftLink((d) => ({ ...d, type: e.target.value }))}>
                    <option value="cross-ref">Cross-reference</option>
                    <option value="prophecy">Prophecy - fulfilled here</option>
                  </select>
                </div>
              )}

              <button onClick={() => addNote(p, v.n)} disabled={p.saving} style={{ cursor: 'pointer' }}>{p.saving ? 'Saving...' : 'Save note'}</button>
            </div>
          )}
        </div>
      )
      })}
      {entry.copyright && (
        <p style={{ fontSize: 10, opacity: 0.5, marginTop: 12 }}>{entry.copyright}</p>
      )}
      </>
    )
  }

  // Search saved notes (personal + any shared family notes already loaded)
  function searchNotes(query) {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return notes.filter((n) => n.text && n.text.toLowerCase().includes(q))
  }

  function jumpToVerse(b, c, v) {
    setBook(b); setChapter(c); setSelectedVerse(v); setTab('read')
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>

  const leftPane = {
    book, chapter, scope,
    selectedVerse, setSelectedVerse,
    draftText, setDraftText,
    draftImageFile, setDraftImageFile,
    draftLinkOn, setDraftLinkOn,
    draftLink, setDraftLink,
    saving, setSaving,
    replyDraftFor, setReplyDraftFor,
    replyText, setReplyText,
  }

  const rightPane = {
    book: splitBook, chapter: splitChapter, scope: splitScope,
    selectedVerse: splitSelectedVerse, setSelectedVerse: setSplitSelectedVerse,
    draftText: splitDraftText, setDraftText: setSplitDraftText,
    draftImageFile: splitDraftImageFile, setDraftImageFile: setSplitDraftImageFile,
    draftLinkOn: splitDraftLinkOn, setDraftLinkOn: setSplitDraftLinkOn,
    draftLink: splitDraftLink, setDraftLink: setSplitDraftLink,
    saving: splitSaving, setSaving: setSplitSaving,
    replyDraftFor: splitReplyDraftFor, setReplyDraftFor: setSplitReplyDraftFor,
    replyText: splitReplyText, setReplyText: setSplitReplyText,
  }

  return (
    <div style={{ maxWidth: splitOn ? 1000 : 640, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>{tab === 'read' ? 'Reading' : tab === 'prayers' ? 'Prayer List' : 'Search'}</h1>
        <button onClick={signOut} style={{ fontSize: 13, cursor: 'pointer' }}>Sign out</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #0002' }}>
        <button onClick={() => setTab('read')}
          style={{ cursor: 'pointer', padding: '8px 4px', background: 'none', border: 'none',
            borderBottom: tab === 'read' ? '2px solid #333' : '2px solid transparent',
            fontWeight: tab === 'read' ? 600 : 400, fontSize: 14 }}>
          Read
        </button>
        <button onClick={() => setTab('prayers')}
          style={{ cursor: 'pointer', padding: '8px 4px', background: 'none', border: 'none',
            borderBottom: tab === 'prayers' ? '2px solid #333' : '2px solid transparent',
            fontWeight: tab === 'prayers' ? 600 : 400, fontSize: 14 }}>
          Prayers{prayers.filter((p) => !p.is_answered).length > 0 ? ` (${prayers.filter((p) => !p.is_answered).length})` : ''}
        </button>
        <button onClick={() => setTab('search')}
          style={{ cursor: 'pointer', padding: '8px 4px', background: 'none', border: 'none',
            borderBottom: tab === 'search' ? '2px solid #333' : '2px solid transparent',
            fontWeight: tab === 'search' ? 600 : 400, fontSize: 14 }}>
          Search
        </button>
      </div>

      {tab === 'read' && (<>
      {bookmark && (
        <p style={{ fontSize: 13, marginBottom: 16 }}>
          🔖 Resume: {bookmark.book} {bookmark.chapter}:{bookmark.verse}{' '}
          <button onClick={() => { setBook(bookmark.book); setChapter(bookmark.chapter); setSelectedVerse(bookmark.verse) }} style={{ cursor: 'pointer' }}>Go</button>
        </p>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
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
        <button onClick={() => setSplitOn((s) => !s)}
          style={{ marginLeft: 'auto', fontSize: 12, cursor: 'pointer' }}>
          {splitOn ? '✕ Exit split view' : '⬛ Split view'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 300px', minWidth: 280 }}>

      <div style={{ background: '#eef0e8', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span onClick={() => setShowSummary((s) => !s)} style={{ cursor: 'pointer', fontWeight: 600 }}>
            Chapter summary {showSummary ? '▾' : '▸'}
          </span>
          {showSummary && !editingSummary && (
            <button
              onClick={() => { setSummaryDraft(chapterSummaries[summaryKey(book, chapter)]?.summary || ''); setEditingSummary(true) }}
              style={{ fontSize: 11, cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}
            >
              {chapterSummaries[summaryKey(book, chapter)] ? 'Edit' : 'Add summary'}
            </button>
          )}
        </div>

        {showSummary && !editingSummary && (
          chapterSummaries[summaryKey(book, chapter)]
            ? <p style={{ margin: '8px 0 0', opacity: 0.85 }}>{chapterSummaries[summaryKey(book, chapter)].summary}</p>
            : <p style={{ margin: '8px 0 0', opacity: 0.5, fontStyle: 'italic' }}>No summary yet for this chapter.</p>
        )}

        {showSummary && editingSummary && (
          <div style={{ marginTop: 8 }}>
            <textarea
              value={summaryDraft}
              onChange={(e) => setSummaryDraft(e.target.value)}
              placeholder="Write a short summary of this chapter..."
              autoFocus
              style={{ width: '100%', minHeight: 70, boxSizing: 'border-box', fontSize: 13, padding: 6 }}
            />
            <div style={{ marginTop: 6, display: 'flex', gap: 10 }}>
              <button onClick={saveChapterSummary} disabled={savingSummary} style={{ cursor: 'pointer', fontSize: 12 }}>
                {savingSummary ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditingSummary(false)} style={{ cursor: 'pointer', fontSize: 12, background: 'none', border: 'none', textDecoration: 'underline' }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {renderReadingPane(leftPane)}

      </div>

      {splitOn && (
        <div style={{ flex: '1 1 300px', minWidth: 280, borderLeft: '1px solid #0002', paddingLeft: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <select value={splitBook} onChange={(e) => { setSplitBook(e.target.value); setSplitChapter(chaptersFor(e.target.value)[0]); setSplitSelectedVerse(null) }}>
              {BOOK_LIST.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={splitChapter} onChange={(e) => { setSplitChapter(Number(e.target.value)); setSplitSelectedVerse(null) }}>
              {chaptersFor(splitBook).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={splitScope} onChange={(e) => setSplitScope(e.target.value)}>
              <option value="personal">Personal</option>
              <option value="family">Family</option>
            </select>
          </div>

          {renderReadingPane(rightPane)}
        </div>
      )}
      </div>
      </>)}

      {tab === 'prayers' && (
        <div>
          <div style={{ background: '#f4f1ea', borderRadius: 8, padding: 12, marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 8px' }}>Add a prayer</h3>
            <input value={prayerTitle} onChange={(e) => setPrayerTitle(e.target.value)} placeholder="What are you praying for?"
              style={{ width: '100%', boxSizing: 'border-box', marginBottom: 6, padding: 6 }} />
            <textarea value={prayerDetails} onChange={(e) => setPrayerDetails(e.target.value)} placeholder="Details (optional)"
              style={{ width: '100%', minHeight: 40, boxSizing: 'border-box', marginBottom: 6, padding: 6 }} />

            <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={prayerCategory} onChange={(e) => setPrayerCategory(e.target.value)}>
                {PRAYER_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <label style={{ fontSize: 12 }}>
                <input type="checkbox" checked={prayerShared} onChange={(e) => setPrayerShared(e.target.checked)} /> Share with family
              </label>
            </div>

            <label style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
              <input type="checkbox" checked={prayerVerseOn} onChange={(e) => setPrayerVerseOn(e.target.checked)} /> Link a Bible verse
            </label>
            {prayerVerseOn && (
              <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                <select value={prayerVerse.book} onChange={(e) => setPrayerVerse((d) => ({ ...d, book: e.target.value, chapter: chaptersFor(e.target.value)[0] }))}>
                  {BOOK_LIST.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <select value={prayerVerse.chapter} onChange={(e) => setPrayerVerse((d) => ({ ...d, chapter: Number(e.target.value) }))}>
                  {chaptersFor(prayerVerse.book).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" min={1} value={prayerVerse.verse} onChange={(e) => setPrayerVerse((d) => ({ ...d, verse: e.target.value }))} style={{ width: 50 }} />
              </div>
            )}

            <button onClick={addPrayer} disabled={savingPrayer} style={{ cursor: 'pointer' }}>
              {savingPrayer ? 'Saving...' : 'Add prayer'}
            </button>
          </div>

          <h3 style={{ fontSize: 15, margin: '0 0 8px' }}>Active</h3>
          {prayers.filter((p) => !p.is_answered).length === 0 && (
            <p style={{ fontSize: 13, opacity: 0.6 }}>No active prayers yet.</p>
          )}
          {prayers.filter((p) => !p.is_answered).map((p) => (
            <div key={p.id} style={{ fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #0001' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong>{p.title}</strong>
                <span style={{ fontSize: 11, opacity: 0.6 }}>{p.category}{p.is_shared ? ' · Family' : ''}</span>
              </div>
              {p.details && <div style={{ marginTop: 2 }}>{p.details}</div>}
              {p.verse_book && (
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                  📖 {p.verse_book} {p.verse_chapter}:{p.verse_verse}
                </div>
              )}
              <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>{new Date(p.created_at).toLocaleDateString()}</div>
              <div style={{ marginTop: 6, display: 'flex', gap: 12 }}>
                {p.user_id === user.id && (
                  <>
                    <button onClick={() => markPrayerAnswered(p.id)} style={{ fontSize: 11, background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                      Mark answered
                    </button>
                    <button onClick={() => deletePrayer(p.id)} style={{ fontSize: 11, color: '#b00', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 20 }}>
            <button onClick={() => setShowAnswered((s) => !s)} style={{ fontSize: 13, cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}>
              {showAnswered ? 'Hide' : 'Show'} answered prayers ({prayers.filter((p) => p.is_answered).length})
            </button>
            {showAnswered && prayers.filter((p) => p.is_answered).map((p) => (
              <div key={p.id} style={{ fontSize: 13, marginTop: 10, paddingBottom: 10, borderBottom: '1px solid #0001', opacity: 0.75 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong>{p.title}</strong>
                  <span style={{ fontSize: 11, opacity: 0.6 }}>{p.category}</span>
                </div>
                {p.details && <div style={{ marginTop: 2 }}>{p.details}</div>}
                {p.answered_note && <div style={{ marginTop: 4, fontStyle: 'italic' }}>✓ {p.answered_note}</div>}
                <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>
                  Answered {p.answered_at ? new Date(p.answered_at).toLocaleDateString() : ''}
                </div>
                {p.user_id === user.id && (
                  <button onClick={() => deletePrayer(p.id)} style={{ fontSize: 11, color: '#b00', background: 'none', border: 'none', cursor: 'pointer', marginTop: 6 }}>
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'search' && (
        <div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Bible text and your notes..."
            autoFocus
            style={{ width: '100%', boxSizing: 'border-box', padding: 8, fontSize: 14, marginBottom: 20 }}
          />

          {searchQuery.trim() && (() => {
            const noteResults = searchNotes(searchQuery)
            return (
              <>
                <h3 style={{ fontSize: 15, margin: '0 0 8px' }}>Bible verses {bibleSearching ? '(searching...)' : `(${bibleSearchResults.length})`}</h3>
                {!bibleSearching && bibleSearchResults.length === 0 && <p style={{ fontSize: 13, opacity: 0.6 }}>No matches.</p>}
                {bibleSearchResults.map((r) => (
                  <div key={`${r.book}-${r.chapter}-${r.verse}`}
                    onClick={() => jumpToVerse(r.book, r.chapter, r.verse)}
                    style={{ fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #0001', cursor: 'pointer' }}>
                    <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 2 }}>{r.book} {r.chapter}:{r.verse}</div>
                    <div>{r.text}</div>
                  </div>
                ))}

                <h3 style={{ fontSize: 15, margin: '20px 0 8px' }}>Your notes ({noteResults.length})</h3>
                {noteResults.length === 0 && <p style={{ fontSize: 13, opacity: 0.6 }}>No matches.</p>}
                {noteResults.map((n) => (
                  <div key={n.id}
                    onClick={() => jumpToVerse(n.book, n.chapter, n.verse)}
                    style={{ fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #0001', cursor: 'pointer' }}>
                    <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 2 }}>
                      {n.book} {n.chapter}:{n.verse} · {new Date(n.created_at).toLocaleDateString()} · {n.scope}
                    </div>
                    <div>{n.text}</div>
                  </div>
                ))}
              </>
            )
          })()}

          {!searchQuery.trim() && (
            <p style={{ fontSize: 13, opacity: 0.6 }}>Start typing to search Bible verses and your saved notes.</p>
          )}
        </div>
      )}
    </div>
  )
}
