'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CHARACTERS, ERAS, getCharacter, getChildren, getParents, getSpouses, layoutTree } from '@/lib/characters'

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
const chapterCacheKey = (book, chapter, lang) => `${lang}-${book}-${chapter}`
const HIGHLIGHTS = { yellow: '#F0D774', green: '#B9CBA6', pink: '#E3B7B0', blue: '#A9C4D1' }
const vKey = (b, c, v) => `${b}-${c}-${v}`
const PRAYER_CATEGORIES = ['Family', 'Health', 'Guidance', 'Praise', 'Other']
const summaryKey = (b, c) => `${b}-${c}`

// Curated color themes for the Settings tab. Each theme provides a full
// set of tokens used throughout the app (page background, card surfaces,
// text, borders, and an accent color for buttons/tabs/selection).
const THEMES = {
  parchment: { label: 'Parchment', bg: '#F6F1E4', surface: '#FFFFFF', surfaceAlt: '#FBF6EA', chip: '#EDE2C8', text: '#2B2116', textMuted: '#6B5D4B', border: '#E3D9C2', hairline: 'rgba(43,33,22,0.14)', accent: '#7A2E2E', onAccent: '#FFFFFF', danger: '#B00000' },
  midnight: { label: 'Midnight', bg: '#1B1D24', surface: '#242732', surfaceAlt: '#2B2E3A', chip: '#333748', text: '#EDEAE2', textMuted: '#A8A296', border: '#3A3D4A', hairline: 'rgba(255,255,255,0.14)', accent: '#C9A24B', onAccent: '#1B1D24', danger: '#FF6B6B' },
  sage: { label: 'Sage Garden', bg: '#F1F3EA', surface: '#FFFFFF', surfaceAlt: '#E9EDE0', chip: '#DCE3CB', text: '#2C3326', textMuted: '#5E6B52', border: '#D7DCC6', hairline: 'rgba(44,51,38,0.12)', accent: '#4B6B4A', onAccent: '#FFFFFF', danger: '#B0342C' },
  slate: { label: 'Slate Study', bg: '#EEF1F4', surface: '#FFFFFF', surfaceAlt: '#E4E9EE', chip: '#D6DEE6', text: '#212B36', textMuted: '#5E6B78', border: '#D3DBE2', hairline: 'rgba(33,43,54,0.12)', accent: '#2F5C8A', onAccent: '#FFFFFF', danger: '#B0342C' },
  rose: { label: 'Dusty Rose', bg: '#F8F1EF', surface: '#FFFFFF', surfaceAlt: '#F1E5E2', chip: '#EAD5D0', text: '#3A2A28', textMuted: '#7A6360', border: '#E7D4CF', hairline: 'rgba(58,42,40,0.12)', accent: '#A65D57', onAccent: '#FFFFFF', danger: '#B0342C' },
}
const THEME_ORDER = ['parchment', 'midnight', 'sage', 'slate', 'rose']
const FONT_SCALES = { small: 0.9, medium: 1, large: 1.15, xlarge: 1.3 }
const FONT_SCALE_ORDER = ['small', 'medium', 'large', 'xlarge']
const FONT_SCALE_LABELS = { small: 'Small', medium: 'Medium', large: 'Large', xlarge: 'Extra Large' }
// Fonts used throughout the app: Lora for scripture/headings, Inter for UI chrome.
const FONT_IMPORT_CSS = `@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap');`
// Picks readable text (near-black or near-white) for a given hex background,
// so custom accent colors chosen in Settings always stay legible.
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

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const [tab, setTab] = useState('read') // 'read' | 'prayers'

  // Reading language for the whole app. 'en' = NKJV (NT) + Brenton
  // Septuagint (OT). 'ar' = Smith & Van Dyck Arabic (whole Bible).
  // Applies to both the main pane and the split-view pane.
  const [bibleLang, setBibleLang] = useState('en')

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

  // Verse themes ("folders") - each row tags one verse with one theme
  // name, personal to the signed-in user. allThemeNames is the distinct
  // list of folder names, derived from verseThemes below.
  const [verseThemes, setVerseThemes] = useState([])
  const [activeTheme, setActiveTheme] = useState(null)
  const [themeDraft, setThemeDraft] = useState('')
  const [splitThemeDraft, setSplitThemeDraft] = useState('')
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [splitThemeMenuOpen, setSplitThemeMenuOpen] = useState(false)

  // Characters tab - Family Tree + Timeline views over the curated
  // CHARACTERS dataset in lib/characters.js. Notes and hidden-character
  // choices are personal to the signed-in user (character_notes /
  // character_hidden tables), matching the verse-themes pattern above.
  const [characterView, setCharacterView] = useState('tree') // 'tree' | 'timeline'
  const [selectedCharacterId, setSelectedCharacterId] = useState(null)
  const [hideMinorCharacters, setHideMinorCharacters] = useState(false)
  const [characterNotes, setCharacterNotes] = useState({}) // character_id -> row
  const [characterNoteDraft, setCharacterNoteDraft] = useState('')
  const [savingCharacterNote, setSavingCharacterNote] = useState(false)
  const [hiddenCharacterIds, setHiddenCharacterIds] = useState([])
  const [showHiddenManager, setShowHiddenManager] = useState(false)
  const [treeZoom, setTreeZoom] = useState(1)
  const [treePan, setTreePan] = useState({ x: 40, y: 20 })
  const [treeDragging, setTreeDragging] = useState(false)

  // Meditation mode - a full-screen, distraction-free guided flow for a
  // single verse. Steps: 'read' -> 'pause' -> 'stands_out' -> 'apply' ->
  // 'prayer' -> 'review' -> saved (closes). Answers become one note under
  // the verse; a non-empty prayer answer also becomes a linked prayer.
  const [meditationOn, setMeditationOn] = useState(false)
  const [meditationTarget, setMeditationTarget] = useState(null) // { book, chapter, verse, text }
  const [meditationStep, setMeditationStep] = useState('read')
  const [meditationAnswers, setMeditationAnswers] = useState({ standsOut: '', apply: '', prayer: '' })
  const [meditationSaving, setMeditationSaving] = useState(false)
  const [meditationPauseLeft, setMeditationPauseLeft] = useState(45)
  const meditationSteps = ['read', 'pause', 'stands_out', 'apply', 'prayer', 'review']

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

  // Appearance settings (Settings tab). Saved to this browser's
  // localStorage so they persist across visits on this device.
  const [themeKey, setThemeKey] = useState('parchment')
  const [fontScaleKey, setFontScaleKey] = useState('medium')
  const [accentOverride, setAccentOverride] = useState(null)
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem('fb_theme')
      const savedFont = window.localStorage.getItem('fb_font_scale')
      const savedAccent = window.localStorage.getItem('fb_accent')
      if (savedTheme && THEMES[savedTheme]) setThemeKey(savedTheme)
      if (savedFont && FONT_SCALES[savedFont]) setFontScaleKey(savedFont)
      if (savedAccent) setAccentOverride(savedAccent)
    } catch (e) { /* localStorage unavailable */ }
    setSettingsLoaded(true)
  }, [])

  useEffect(() => {
    if (!settingsLoaded) return
    try { window.localStorage.setItem('fb_theme', themeKey) } catch (e) {}
  }, [themeKey, settingsLoaded])

  useEffect(() => {
    if (!settingsLoaded) return
    try { window.localStorage.setItem('fb_font_scale', fontScaleKey) } catch (e) {}
  }, [fontScaleKey, settingsLoaded])

  useEffect(() => {
    if (!settingsLoaded) return
    try {
      if (accentOverride) window.localStorage.setItem('fb_accent', accentOverride)
      else window.localStorage.removeItem('fb_accent')
    } catch (e) {}
  }, [accentOverride, settingsLoaded])

  const themePalette = THEMES[themeKey] || THEMES.parchment
  const resolvedAccent = accentOverride || themePalette.accent
  const resolvedOnAccent = accentOverride ? contrastText(accentOverride) : themePalette.onAccent
  const fontScale = FONT_SCALES[fontScaleKey] || 1

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

    const { data: vt } = await supabase.from('verse_themes').select('*').eq('user_id', uid).order('theme', { ascending: true })
    setVerseThemes(vt || [])

    const { data: cn } = await supabase.from('character_notes').select('*').eq('user_id', uid)
    const cnMap = {}
    ;(cn || []).forEach((n) => { cnMap[n.character_id] = n })
    setCharacterNotes(cnMap)

    const { data: ch } = await supabase.from('character_hidden').select('character_id').eq('user_id', uid)
    setHiddenCharacterIds((ch || []).map((r) => r.character_id))
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
  // fetching) that chapter in that language.
  const fetchChapter = useCallback((book, chapter, lang) => {
    const key = chapterCacheKey(book, chapter, lang)
    setChapterCache((cache) => {
      if (cache[key]) return cache // already loaded or loading
      return { ...cache, [key]: { verses: [], loading: true, error: null, copyright: null, dir: 'ltr' } }
    })
    const usfm = usfmFor(book)
    fetch(`/api/bible?book=${usfm}&chapter=${chapter}&lang=${lang}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setChapterCache((cache) => ({ ...cache, [key]: { verses: [], loading: false, error: data.error, copyright: null, dir: 'ltr' } }))
        } else {
          setChapterCache((cache) => ({ ...cache, [key]: { verses: data.verses || [], loading: false, error: null, copyright: data.copyright || null, dir: data.dir || 'ltr' } }))
        }
      })
      .catch((err) => {
        setChapterCache((cache) => ({ ...cache, [key]: { verses: [], loading: false, error: String(err), copyright: null, dir: 'ltr' } }))
      })
  }, [])

  useEffect(() => {
    if (book && chapter) fetchChapter(book, chapter, bibleLang)
  }, [book, chapter, bibleLang, fetchChapter])

  useEffect(() => {
    if (splitOn && splitBook && splitChapter) fetchChapter(splitBook, splitChapter, bibleLang)
  }, [splitOn, splitBook, splitChapter, bibleLang, fetchChapter])

  // When viewing a theme folder, make sure each tagged verse's chapter
  // text is loaded so we can show the actual verse, not just the reference.
  useEffect(() => {
    if (!activeTheme) return
    const seen = new Set()
    verseThemes.filter((t) => t.theme === activeTheme).forEach((t) => {
      const k = `${t.book}-${t.chapter}`
      if (seen.has(k)) return
      seen.add(k)
      fetchChapter(t.book, t.chapter, bibleLang)
    })
  }, [activeTheme, verseThemes, bibleLang, fetchChapter])

  // Looks up a specific verse's text from chapterCache (already loaded,
  // or being loaded, by the effect above).
  function themeVerseText(book, chapter, verseNum) {
    const entry = chapterCache[chapterCacheKey(book, chapter, bibleLang)]
    if (!entry) return null
    if (entry.loading) return null
    if (entry.error) return null
    const v = entry.verses.find((v) => v.n === verseNum)
    return v ? v.t : null
  }

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

  // Tags a verse with a theme name, creating the "folder" the first time
  // it's used. Safe to call again for the same verse+theme (no duplicate).
  async function addVerseTheme(b, c, v, themeName) {
    const theme = themeName.trim()
    if (!theme || !v || !user) return
    if (verseThemes.some((t) => t.book === b && t.chapter === c && t.verse === v && t.theme.toLowerCase() === theme.toLowerCase())) return
    const { data, error } = await supabase.from('verse_themes').insert({
      user_id: user.id, book: b, chapter: c, verse: v, theme,
    }).select().single()
    if (!error && data) setVerseThemes((t) => [...t, data])
  }

  async function removeVerseTheme(themeId) {
    const { error } = await supabase.from('verse_themes').delete().eq('id', themeId)
    if (!error) setVerseThemes((t) => t.filter((x) => x.id !== themeId))
  }

  function themesForVerse(b, c, v) {
    return verseThemes.filter((t) => t.book === b && t.chapter === c && t.verse === v)
  }

  const allThemeNames = [...new Set(verseThemes.map((t) => t.theme))].sort((a, b) => a.localeCompare(b))

  // --- Characters tab ---

  async function saveCharacterNote(characterId, text) {
    if (!user) return
    setSavingCharacterNote(true)
    const trimmed = text.trim()
    if (!trimmed) {
      // Empty note = remove it entirely rather than storing a blank row.
      const existing = characterNotes[characterId]
      if (existing) {
        await supabase.from('character_notes').delete().eq('id', existing.id)
        setCharacterNotes((m) => { const next = { ...m }; delete next[characterId]; return next })
      }
      setSavingCharacterNote(false)
      return
    }
    const { data, error } = await supabase.from('character_notes').upsert({
      user_id: user.id, character_id: characterId, note_text: trimmed, updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,character_id' }).select().single()
    if (!error && data) setCharacterNotes((m) => ({ ...m, [characterId]: data }))
    setSavingCharacterNote(false)
  }

  async function toggleHiddenCharacter(characterId) {
    if (!user) return
    if (hiddenCharacterIds.includes(characterId)) {
      await supabase.from('character_hidden').delete().eq('user_id', user.id).eq('character_id', characterId)
      setHiddenCharacterIds((ids) => ids.filter((id) => id !== characterId))
    } else {
      await supabase.from('character_hidden').insert({ user_id: user.id, character_id: characterId })
      setHiddenCharacterIds((ids) => [...ids, characterId])
    }
  }

  function openCharacter(id) {
    setSelectedCharacterId(id)
    setCharacterNoteDraft(characterNotes[id]?.note_text || '')
  }

  // Characters currently shown in both the Family Tree and Timeline views,
  // after applying the "hide minor figures" toggle and any characters the
  // user has individually hidden.
  const visibleCharacters = CHARACTERS.filter((c) => {
    if (hiddenCharacterIds.includes(c.id)) return false
    if (hideMinorCharacters && c.significance === 'minor') return false
    return true
  })
  const visibleIds = new Set(visibleCharacters.map((c) => c.id))
  const treePositions = layoutTree(visibleCharacters)
  const TREE_NODE_W = 148
  const TREE_NODE_H = 52
  const TREE_PAD = 60
  const treeMaxX = Math.max(0, ...visibleCharacters.map((c) => treePositions[c.id]?.x || 0))
  const treeMaxY = Math.max(0, ...visibleCharacters.map((c) => treePositions[c.id]?.y || 0))
  const treeCanvasW = treeMaxX + TREE_NODE_W + TREE_PAD * 2
  const treeCanvasH = treeMaxY + TREE_NODE_H + TREE_PAD * 2

  function prettyGroupLabel(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase())
  }

  function handleTreeWheel(e) {
    e.preventDefault()
    setTreeZoom((z) => Math.min(2, Math.max(0.4, z - e.deltaY * 0.001)))
  }

  // A ref (not state) so drag position survives re-renders triggered by
  // setTreePan while dragging, without itself causing extra re-renders.
  const treeDragStart = useRef(null)
  function handleTreeMouseDown(e) {
    treeDragStart.current = { x: e.clientX, y: e.clientY, panX: treePan.x, panY: treePan.y }
    setTreeDragging(true)
  }
  function handleTreeMouseMove(e) {
    if (!treeDragStart.current) return
    const d = treeDragStart.current
    setTreePan({ x: d.panX + (e.clientX - d.x), y: d.panY + (e.clientY - d.y) })
  }
  function handleTreeMouseUp() {
    treeDragStart.current = null
    setTreeDragging(false)
  }
  function handleTreeTouchStart(e) {
    const t = e.touches[0]
    treeDragStart.current = { x: t.clientX, y: t.clientY, panX: treePan.x, panY: treePan.y }
    setTreeDragging(true)
  }
  function handleTreeTouchMove(e) {
    if (!treeDragStart.current) return
    const t = e.touches[0]
    const d = treeDragStart.current
    setTreePan({ x: d.panX + (t.clientX - d.x), y: d.panY + (t.clientY - d.y) })
  }
  function handleTreeTouchEnd() {
    treeDragStart.current = null
    setTreeDragging(false)
  }

  // --- Meditation mode ---

  function startMeditation(book, chapter, verseNum, verseText) {
    setMeditationTarget({ book, chapter, verse: verseNum, text: verseText })
    setMeditationAnswers({ standsOut: '', apply: '', prayer: '' })
    setMeditationStep('read')
    setMeditationPauseLeft(45)
    setMeditationOn(true)
    if (typeof document !== 'undefined' && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }

  function exitMeditation() {
    setMeditationOn(false)
    setMeditationTarget(null)
    if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    }
  }

  function meditationNext() {
    const i = meditationSteps.indexOf(meditationStep)
    if (i < meditationSteps.length - 1) setMeditationStep(meditationSteps[i + 1])
  }

  // Countdown for the quiet-reflection pause. Auto-advances when it hits 0.
  useEffect(() => {
    if (!meditationOn || meditationStep !== 'pause') return
    if (meditationPauseLeft <= 0) { meditationNext(); return }
    const t = setTimeout(() => setMeditationPauseLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [meditationOn, meditationStep, meditationPauseLeft])

  // Saves the whole session as one note under the verse, and - if the
  // "turn it into a prayer" step has text - also adds a linked prayer.
  async function saveMeditation() {
    if (!user || !meditationTarget) return
    setMeditationSaving(true)
    try {
      const { standsOut, apply, prayer } = meditationAnswers
      const parts = []
      if (standsOut.trim()) parts.push(`What stood out: ${standsOut.trim()}`)
      if (apply.trim()) parts.push(`How I can apply it: ${apply.trim()}`)
      if (prayer.trim()) parts.push(`Turned into a prayer: ${prayer.trim()}`)

      if (parts.length > 0) {
        const text = `🧘 Meditation\n${parts.join('\n\n')}`
        const payload = {
          user_id: user.id,
          family_id: profile?.family_id || null,
          scope: 'personal',
          book: meditationTarget.book, chapter: meditationTarget.chapter, verse: meditationTarget.verse,
          text,
        }
        const { data, error } = await supabase.from('notes').insert(payload).select().single()
        if (error) throw error
        setNotes((n) => [data, ...n])
      }

      if (prayer.trim()) {
        const { data: pData, error: pErr } = await supabase.from('prayers').insert({
          user_id: user.id,
          family_id: profile?.family_id || null,
          title: `${meditationTarget.book} ${meditationTarget.chapter}:${meditationTarget.verse}`,
          details: prayer.trim(),
          category: 'Other',
          is_shared: false,
          verse_book: meditationTarget.book,
          verse_chapter: meditationTarget.chapter,
          verse_verse: meditationTarget.verse,
        }).select().single()
        if (pErr) throw pErr
        setPrayers((p) => [pData, ...p])
      }

      exitMeditation()
    } catch (err) {
      alert('Could not save your meditation: ' + err.message)
    } finally {
      setMeditationSaving(false)
    }
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
    const entry = chapterCache[chapterCacheKey(p.book, p.chapter, bibleLang)]
    if (!entry || entry.loading) {
      return <p style={{ fontSize: 13, opacity: 0.6 }}>Loading {p.book} {p.chapter}...</p>
    }
    if (entry.error) {
      return <p style={{ fontSize: 13, color: themePalette.danger }}>Couldn't load {p.book} {p.chapter}: {entry.error}</p>
    }
    const verses = entry.verses
    return (
      <div dir={entry.dir === 'rtl' ? 'rtl' : 'ltr'} style={{ textAlign: entry.dir === 'rtl' ? 'right' : 'left', fontFamily: entry.dir === 'rtl' ? 'inherit' : "'Lora', Georgia, serif", fontSize: 17, lineHeight: 1.75 }}>
      {verses.map((v) => {
      const key = vKey(p.book, p.chapter, v.n)
      const isSelected = p.selectedVerse === v.n
      const notesHere = notesForVerse(p.book, p.chapter, v.n)
      return (
        <div key={v.n} style={{ marginBottom: 12 }}>
          <span
            onClick={() => { p.setSelectedVerse(isSelected ? null : v.n); p.setThemeMenuOpen(false) }}
            style={{
              cursor: 'pointer',
              background: highlights[key] ? HIGHLIGHTS[highlights[key]] : 'transparent',
              outline: isSelected ? `2px solid ${resolvedAccent}` : 'none',
              borderRadius: 3,
            }}
          >
            <sup style={{ opacity: 0.6, marginRight: 4, fontFamily: "'Inter', system-ui, sans-serif", color: themePalette.textMuted }}>{v.n}</sup>{v.t}
          </span>
          {notesHere.length > 0 && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.6, fontFamily: "'Inter', system-ui, sans-serif" }}>Notes: {notesHere.length}</span>}

          {isSelected && (
            <div style={{ marginTop: 8, background: themePalette.surfaceAlt, borderRadius: 8, padding: 12, fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                {Object.entries(HIGHLIGHTS).map(([name, color]) => (
                  <button key={name} onClick={() => toggleHighlight(name, p.book, p.chapter, v.n)}
                    style={{ width: 18, height: 18, borderRadius: '50%', background: color, border: `1px solid ${themePalette.hairline}`, cursor: 'pointer' }} />
                ))}
                <button onClick={() => setBookmarkHere(p.book, p.chapter, v.n)} style={{ fontSize: 12, cursor: 'pointer' }}>Bookmark this verse</button>
                <button onClick={() => p.setThemeMenuOpen(!p.themeMenuOpen)} style={{ fontSize: 12, cursor: 'pointer' }}>
                  🏷 Theme{themesForVerse(p.book, p.chapter, v.n).length > 0 ? ` (${themesForVerse(p.book, p.chapter, v.n).length})` : ''}
                </button>
                <button onClick={() => startMeditation(p.book, p.chapter, v.n, v.t)} style={{ fontSize: 12, cursor: 'pointer' }}>
                  🧘 Meditate
                </button>
              </div>

              {p.themeMenuOpen && (
              <div style={{ marginBottom: 10 }}>
                {themesForVerse(p.book, p.chapter, v.n).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                    {themesForVerse(p.book, p.chapter, v.n).map((t) => (
                      <span key={t.id} style={{ fontSize: 11, background: themePalette.chip, borderRadius: 12, padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        📁 {t.theme}
                        <button onClick={() => removeVerseTheme(t.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 11, padding: 0, lineHeight: 1, opacity: 0.6 }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
                {allThemeNames.filter((name) => !themesForVerse(p.book, p.chapter, v.n).some((t) => t.theme === name)).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                    {allThemeNames.filter((name) => !themesForVerse(p.book, p.chapter, v.n).some((t) => t.theme === name)).map((name) => (
                      <button key={name} onClick={() => addVerseTheme(p.book, p.chapter, v.n, name)}
                        style={{ fontSize: 11, cursor: 'pointer', background: 'none', border: `1px solid ${themePalette.hairline}`, borderRadius: 12, padding: '2px 8px' }}>
                        + {name}
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 6 }}>
                  <input value={p.themeDraft} onChange={(e) => p.setThemeDraft(e.target.value)}
                    placeholder="New theme name..." autoFocus style={{ flex: 1, fontSize: 12, padding: 4 }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && p.themeDraft.trim()) { addVerseTheme(p.book, p.chapter, v.n, p.themeDraft.trim()); p.setThemeDraft('') } }} />
                  <button onClick={() => { if (p.themeDraft.trim()) { addVerseTheme(p.book, p.chapter, v.n, p.themeDraft.trim()); p.setThemeDraft('') } }}
                    style={{ fontSize: 12, cursor: 'pointer' }}>Add</button>
                </div>
              </div>
              )}

              {notesHere.map((n) => {
                const isLinkedIn = !(n.book === p.book && n.chapter === p.chapter && n.verse === v.n)
                const otherRef = isLinkedIn
                  ? { book: n.book, chapter: n.chapter, verse: n.verse }
                  : (n.link_book ? { book: n.link_book, chapter: n.link_chapter, verse: n.link_verse } : null)
                return (
                  <div key={n.id} style={{ fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${themePalette.hairline}` }}>
                    <div style={{ opacity: 0.6, fontSize: 11, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{new Date(n.created_at).toLocaleString()} · {n.scope}</span>
                      {n.user_id === user.id && (
                        <button onClick={() => deleteNote(n.id)} style={{ fontSize: 11, color: themePalette.danger, background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
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
                      <div key={r.id} style={{ marginTop: 6, marginLeft: 12, borderLeft: `2px solid ${themePalette.hairline}`, paddingLeft: 8, fontSize: 12 }}>
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
        <p style={{ fontSize: 10, opacity: 0.5, marginTop: 12, textAlign: 'left', direction: 'ltr' }}>{entry.copyright}</p>
      )}
      </div>
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

  if (meditationOn && meditationTarget) {
    const stepIndex = meditationSteps.indexOf(meditationStep)
    const mm = String(Math.floor(meditationPauseLeft / 60)).padStart(2, '0')
    const ss = String(meditationPauseLeft % 60).padStart(2, '0')
    return (
      <div style={{
        position: 'fixed', inset: 0, background: themePalette.bg, color: themePalette.text, zIndex: 1000,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24, boxSizing: 'border-box', textAlign: 'center',
        fontFamily: "'Inter', system-ui, sans-serif", zoom: fontScale,
      }}>
        <style>{FONT_IMPORT_CSS}</style>
        <button onClick={exitMeditation}
          style={{ position: 'absolute', top: 16, right: 20, fontSize: 13, cursor: 'pointer', background: 'none', border: 'none', opacity: 0.6 }}>
          ✕ Exit
        </button>

        <div style={{ maxWidth: 480, width: '100%' }}>
          <p style={{ fontSize: 12, letterSpacing: 1, opacity: 0.5, marginBottom: 4 }}>
            {meditationTarget.book} {meditationTarget.chapter}:{meditationTarget.verse}
          </p>
          <p style={{ fontSize: 22, lineHeight: 1.6, marginBottom: 28, fontFamily: "'Lora', Georgia, serif" }}>{meditationTarget.text}</p>

          {meditationStep === 'read' && (
            <>
              <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 20 }}>
                Take a moment to read it slowly, maybe more than once.<br />
                Consider turning on Do Not Disturb before you begin.
              </p>
              <button onClick={meditationNext} style={{ fontSize: 14, cursor: 'pointer', padding: '8px 20px' }}>Continue</button>
            </>
          )}

          {meditationStep === 'pause' && (
            <>
              <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 12 }}>Sit quietly with this verse for a moment...</p>
              <p style={{ fontSize: 28, fontVariantNumeric: 'tabular-nums', marginBottom: 20 }}>{mm}:{ss}</p>
              <button onClick={meditationNext} style={{ fontSize: 13, cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', opacity: 0.7 }}>
                Skip ahead
              </button>
            </>
          )}

          {meditationStep === 'stands_out' && (
            <>
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>What about this verse stands out to you?</p>
              <textarea value={meditationAnswers.standsOut}
                onChange={(e) => setMeditationAnswers((a) => ({ ...a, standsOut: e.target.value }))}
                autoFocus placeholder="Write freely..."
                style={{ width: '100%', minHeight: 100, boxSizing: 'border-box', fontSize: 14, padding: 10, marginBottom: 16 }} />
              <button onClick={meditationNext} style={{ fontSize: 14, cursor: 'pointer', padding: '8px 20px' }}>Next</button>
            </>
          )}

          {meditationStep === 'apply' && (
            <>
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>How can you apply it to your life?</p>
              <textarea value={meditationAnswers.apply}
                onChange={(e) => setMeditationAnswers((a) => ({ ...a, apply: e.target.value }))}
                autoFocus placeholder="Write freely..."
                style={{ width: '100%', minHeight: 100, boxSizing: 'border-box', fontSize: 14, padding: 10, marginBottom: 16 }} />
              <button onClick={meditationNext} style={{ fontSize: 14, cursor: 'pointer', padding: '8px 20px' }}>Next</button>
            </>
          )}

          {meditationStep === 'prayer' && (
            <>
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Turn it into a prayer</p>
              <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 12 }}>This will be added to your Prayer List, linked to this verse.</p>
              <textarea value={meditationAnswers.prayer}
                onChange={(e) => setMeditationAnswers((a) => ({ ...a, prayer: e.target.value }))}
                autoFocus placeholder="Lord, help me to..."
                style={{ width: '100%', minHeight: 100, boxSizing: 'border-box', fontSize: 14, padding: 10, marginBottom: 16 }} />
              <button onClick={meditationNext} style={{ fontSize: 14, cursor: 'pointer', padding: '8px 20px' }}>Next</button>
            </>
          )}

          {meditationStep === 'review' && (
            <>
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Review before saving</p>
              <div style={{ textAlign: 'left', fontSize: 13, marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, marginTop: 10 }}>What stood out</label>
                <textarea value={meditationAnswers.standsOut}
                  onChange={(e) => setMeditationAnswers((a) => ({ ...a, standsOut: e.target.value }))}
                  style={{ width: '100%', minHeight: 60, boxSizing: 'border-box', fontSize: 13, padding: 8 }} />
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, marginTop: 10 }}>How to apply it</label>
                <textarea value={meditationAnswers.apply}
                  onChange={(e) => setMeditationAnswers((a) => ({ ...a, apply: e.target.value }))}
                  style={{ width: '100%', minHeight: 60, boxSizing: 'border-box', fontSize: 13, padding: 8 }} />
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, marginTop: 10 }}>Prayer</label>
                <textarea value={meditationAnswers.prayer}
                  onChange={(e) => setMeditationAnswers((a) => ({ ...a, prayer: e.target.value }))}
                  style={{ width: '100%', minHeight: 60, boxSizing: 'border-box', fontSize: 13, padding: 8 }} />
              </div>
              <button onClick={saveMeditation} disabled={meditationSaving} style={{ fontSize: 14, cursor: 'pointer', padding: '8px 20px' }}>
                {meditationSaving ? 'Saving...' : 'Save & Finish'}
              </button>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 28 }}>
            {meditationSteps.map((s, i) => (
              <span key={s} style={{ width: 6, height: 6, borderRadius: '50%', background: i <= stepIndex ? resolvedAccent : themePalette.hairline }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

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
    themeDraft, setThemeDraft,
    themeMenuOpen, setThemeMenuOpen,
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
    themeDraft: splitThemeDraft, setThemeDraft: setSplitThemeDraft,
    themeMenuOpen: splitThemeMenuOpen, setThemeMenuOpen: setSplitThemeMenuOpen,
  }

  return (
    <div style={{ minHeight: '100vh', background: themePalette.bg, color: themePalette.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{FONT_IMPORT_CSS}</style>
      <div style={{ maxWidth: splitOn ? 1000 : 640, margin: '0 auto', padding: '32px 24px 64px', zoom: fontScale }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${themePalette.border}` }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: themePalette.textMuted, marginBottom: 4 }}>Family Bible</div>
          <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 26, margin: 0, fontWeight: 600, color: themePalette.text }}>
            {tab === 'read' ? 'Reading' : tab === 'prayers' ? 'Prayer List' : tab === 'themes' ? 'Themes' : tab === 'characters' ? 'Characters' : tab === 'settings' ? 'Settings' : 'Search'}
          </h1>
        </div>
        <button onClick={signOut} style={{ fontSize: 13, cursor: 'pointer', background: 'none', border: 'none', color: themePalette.textMuted, textDecoration: 'underline' }}>Sign out</button>
      </div>

      <div style={{ display: 'flex', gap: 2, marginBottom: 28, borderBottom: `1px solid ${themePalette.border}`, overflowX: 'auto' }}>
        {[
          { key: 'read', label: 'Read' },
          { key: 'prayers', label: `Prayers${prayers.filter((p) => !p.is_answered).length > 0 ? ` (${prayers.filter((p) => !p.is_answered).length})` : ''}` },
          { key: 'search', label: 'Search' },
          { key: 'themes', label: 'Themes' },
          { key: 'characters', label: 'Characters' },
          { key: 'settings', label: 'Settings' },
        ].map((navTab) => (
          <button key={navTab.key} onClick={() => setTab(navTab.key)}
            style={{
              cursor: 'pointer', padding: '10px 14px', background: 'none', border: 'none',
              borderBottom: tab === navTab.key ? `2px solid ${resolvedAccent}` : '2px solid transparent',
              fontWeight: tab === navTab.key ? 600 : 400, fontSize: 14, whiteSpace: 'nowrap',
              color: tab === navTab.key ? themePalette.text : themePalette.textMuted,
            }}>
            {navTab.label}
          </button>
        ))}
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
        <div style={{ display: 'flex', border: `1px solid ${themePalette.border}`, borderRadius: 6, overflow: 'hidden' }}>
          <button onClick={() => setBibleLang('en')}
            style={{ padding: '5px 12px', fontSize: 12, cursor: 'pointer', border: 'none',
              background: bibleLang === 'en' ? resolvedAccent : themePalette.surface, color: bibleLang === 'en' ? resolvedOnAccent : themePalette.textMuted }}>
            English
          </button>
          <button onClick={() => setBibleLang('ar')}
            style={{ padding: '5px 12px', fontSize: 12, cursor: 'pointer', border: 'none',
              background: bibleLang === 'ar' ? resolvedAccent : themePalette.surface, color: bibleLang === 'ar' ? resolvedOnAccent : themePalette.textMuted }}>
            العربية
          </button>
        </div>
        <button onClick={() => setSplitOn((s) => !s)}
          style={{ marginLeft: 'auto', fontSize: 12, cursor: 'pointer' }}>
          {splitOn ? '✕ Exit split view' : '⬛ Split view'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 300px', minWidth: 280 }}>

      <div style={{ background: themePalette.surfaceAlt, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13 }}>
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
        <div style={{ flex: '1 1 300px', minWidth: 280, borderLeft: `1px solid ${themePalette.hairline}`, paddingLeft: 20 }}>
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
          <div style={{ background: themePalette.surfaceAlt, borderRadius: 8, padding: 12, marginBottom: 20 }}>
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
            <div key={p.id} style={{ fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${themePalette.hairline}` }}>
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
                    <button onClick={() => deletePrayer(p.id)} style={{ fontSize: 11, color: themePalette.danger, background: 'none', border: 'none', cursor: 'pointer' }}>
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
              <div key={p.id} style={{ fontSize: 13, marginTop: 10, paddingBottom: 10, borderBottom: `1px solid ${themePalette.hairline}`, opacity: 0.75 }}>
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
                  <button onClick={() => deletePrayer(p.id)} style={{ fontSize: 11, color: themePalette.danger, background: 'none', border: 'none', cursor: 'pointer', marginTop: 6 }}>
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
            style={{ width: '100%', boxSizing: 'border-box', padding: 8, fontSize: 14, marginBottom: 4 }}
          />
          <p style={{ fontSize: 11, opacity: 0.6, margin: '0 0 16px' }}>Bible-text search currently covers the English translations only.</p>

          {searchQuery.trim() && (() => {
            const noteResults = searchNotes(searchQuery)
            return (
              <>
                <h3 style={{ fontSize: 15, margin: '0 0 8px' }}>Bible verses {bibleSearching ? '(searching...)' : `(${bibleSearchResults.length})`}</h3>
                {!bibleSearching && bibleSearchResults.length === 0 && <p style={{ fontSize: 13, opacity: 0.6 }}>No matches.</p>}
                {bibleSearchResults.map((r) => (
                  <div key={`${r.book}-${r.chapter}-${r.verse}`}
                    onClick={() => jumpToVerse(r.book, r.chapter, r.verse)}
                    style={{ fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${themePalette.hairline}`, cursor: 'pointer' }}>
                    <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 2 }}>{r.book} {r.chapter}:{r.verse}</div>
                    <div>{r.text}</div>
                  </div>
                ))}

                <h3 style={{ fontSize: 15, margin: '20px 0 8px' }}>Your notes ({noteResults.length})</h3>
                {noteResults.length === 0 && <p style={{ fontSize: 13, opacity: 0.6 }}>No matches.</p>}
                {noteResults.map((n) => (
                  <div key={n.id}
                    onClick={() => jumpToVerse(n.book, n.chapter, n.verse)}
                    style={{ fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${themePalette.hairline}`, cursor: 'pointer' }}>
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

      {tab === 'themes' && (
        <div>
          {!activeTheme ? (
            <>
              <h3 style={{ fontSize: 15, margin: '0 0 8px' }}>Your theme folders</h3>
              {allThemeNames.length === 0 && (
                <p style={{ fontSize: 13, opacity: 0.6 }}>
                  No themes yet. Select a verse in Read, then use "Add theme" to create your first folder.
                </p>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {allThemeNames.map((name) => (
                  <button key={name} onClick={() => setActiveTheme(name)}
                    style={{ cursor: 'pointer', padding: '10px 14px', borderRadius: 8, background: themePalette.surfaceAlt, border: 'none', fontSize: 13, textAlign: 'left' }}>
                    📁 {name}{' '}
                    <span style={{ opacity: 0.6, fontSize: 11 }}>
                      ({verseThemes.filter((t) => t.theme === name).length})
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTheme(null)}
                style={{ fontSize: 12, cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', marginBottom: 12, padding: 0 }}>
                ← All themes
              </button>
              <h3 style={{ fontSize: 15, margin: '0 0 12px' }}>📁 {activeTheme}</h3>
              {verseThemes.filter((t) => t.theme === activeTheme).length === 0 && (
                <p style={{ fontSize: 13, opacity: 0.6 }}>No verses left in this folder.</p>
              )}
              {verseThemes.filter((t) => t.theme === activeTheme).map((t) => {
                const text = themeVerseText(t.book, t.chapter, t.verse)
                return (
                  <div key={t.id}
                    onClick={() => jumpToVerse(t.book, t.chapter, t.verse)}
                    style={{ fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${themePalette.hairline}`, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 11, opacity: 0.6 }}>{t.book} {t.chapter}:{t.verse}</span>
                      <button onClick={(e) => { e.stopPropagation(); removeVerseTheme(t.id) }}
                        style={{ fontSize: 11, color: themePalette.danger, background: 'none', border: 'none', cursor: 'pointer' }}>
                        Remove
                      </button>
                    </div>
                    <div style={{ marginTop: 2 }}>{text || <span style={{ opacity: 0.5, fontStyle: 'italic' }}>Loading verse text...</span>}</div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      )}

      {tab === 'characters' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setCharacterView('tree')}
                style={{
                  cursor: 'pointer', padding: '7px 14px', borderRadius: 8, fontSize: 13,
                  border: characterView === 'tree' ? `1px solid ${resolvedAccent}` : `1px solid ${themePalette.border}`,
                  background: characterView === 'tree' ? themePalette.surfaceAlt : themePalette.surface,
                  color: themePalette.text, fontWeight: characterView === 'tree' ? 600 : 400,
                }}>
                Family Tree
              </button>
              <button onClick={() => setCharacterView('timeline')}
                style={{
                  cursor: 'pointer', padding: '7px 14px', borderRadius: 8, fontSize: 13,
                  border: characterView === 'timeline' ? `1px solid ${resolvedAccent}` : `1px solid ${themePalette.border}`,
                  background: characterView === 'timeline' ? themePalette.surfaceAlt : themePalette.surface,
                  color: themePalette.text, fontWeight: characterView === 'timeline' ? 600 : 400,
                }}>
                Timeline
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: themePalette.textMuted, cursor: 'pointer' }}>
                <input type="checkbox" checked={hideMinorCharacters} onChange={(e) => setHideMinorCharacters(e.target.checked)} />
                Hide minor figures
              </label>
              {hiddenCharacterIds.length > 0 && (
                <button onClick={() => setShowHiddenManager((v) => !v)}
                  style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: 13, color: resolvedAccent, textDecoration: 'underline', padding: 0 }}>
                  {hiddenCharacterIds.length} hidden — manage
                </button>
              )}
            </div>
          </div>

          {showHiddenManager && hiddenCharacterIds.length > 0 && (
            <div style={{
              marginBottom: 16, padding: 12, borderRadius: 10, border: `1px solid ${themePalette.border}`,
              background: themePalette.surfaceAlt,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: themePalette.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Hidden people
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {hiddenCharacterIds.map((id) => {
                  const c = getCharacter(id)
                  if (!c) return null
                  return (
                    <button key={id} onClick={() => toggleHiddenCharacter(id)}
                      style={{
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
                        borderRadius: 20, border: `1px solid ${themePalette.border}`, background: themePalette.surface,
                        color: themePalette.text, fontSize: 12, fontFamily: "'Inter', system-ui, sans-serif",
                      }}>
                      {c.name} <span style={{ color: resolvedAccent }}>Unhide</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {characterView === 'tree' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginBottom: 8 }}>
                <button onClick={() => setTreeZoom((z) => Math.max(0.4, z - 0.15))}
                  style={{ cursor: 'pointer', width: 30, height: 30, borderRadius: 6, border: `1px solid ${themePalette.border}`, background: themePalette.surface, color: themePalette.text, fontSize: 16 }}>
                  −
                </button>
                <button onClick={() => { setTreeZoom(1); setTreePan({ x: 40, y: 20 }) }}
                  style={{ cursor: 'pointer', padding: '0 10px', height: 30, borderRadius: 6, border: `1px solid ${themePalette.border}`, background: themePalette.surface, color: themePalette.text, fontSize: 12 }}>
                  Reset
                </button>
                <button onClick={() => setTreeZoom((z) => Math.min(2, z + 0.15))}
                  style={{ cursor: 'pointer', width: 30, height: 30, borderRadius: 6, border: `1px solid ${themePalette.border}`, background: themePalette.surface, color: themePalette.text, fontSize: 16 }}>
                  +
                </button>
              </div>

              <div
                onWheel={handleTreeWheel}
                onMouseDown={handleTreeMouseDown}
                onMouseMove={handleTreeMouseMove}
                onMouseUp={handleTreeMouseUp}
                onMouseLeave={handleTreeMouseUp}
                onTouchStart={handleTreeTouchStart}
                onTouchMove={handleTreeTouchMove}
                onTouchEnd={handleTreeTouchEnd}
                style={{
                  position: 'relative', overflow: 'hidden', height: 480, borderRadius: 12,
                  border: `1px solid ${themePalette.border}`, background: themePalette.surfaceAlt,
                  cursor: treeDragging ? 'grabbing' : 'grab', touchAction: 'none',
                }}
              >
                <div style={{
                  position: 'absolute', left: 0, top: 0,
                  width: treeCanvasW, height: treeCanvasH,
                  transform: `translate(${treePan.x}px, ${treePan.y}px) scale(${treeZoom})`,
                  transformOrigin: '0 0',
                }}>
                  <svg width={treeCanvasW} height={treeCanvasH} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
                    {(() => {
                      // One connector per FAMILY UNIT (a set of full siblings
                      // sharing the same parent(s)), instead of one line per
                      // parent-child pair - so a couple with 3 kids draws a
                      // single stem + bus + drops, not 3 separate crossing
                      // lines from each parent to each child.
                      const units = {}
                      visibleCharacters.forEach((c) => {
                        const knownParents = c.parentIds.filter((pid) => visibleIds.has(pid))
                        if (knownParents.length === 0) return
                        const key = knownParents.slice().sort().join('|')
                        if (!units[key]) units[key] = { parentIds: knownParents, childIds: [] }
                        units[key].childIds.push(c.id)
                      })
                      const lines = []
                      Object.entries(units).forEach(([key, unit]) => {
                        const parentPositions = unit.parentIds.map((pid) => treePositions[pid]).filter(Boolean)
                        const childPositions = unit.childIds.map((cid) => treePositions[cid]).filter(Boolean)
                        if (parentPositions.length === 0 || childPositions.length === 0) return
                        const parentMidX = parentPositions.reduce((s, p) => s + p.x, 0) / parentPositions.length + TREE_PAD + TREE_NODE_W / 2
                        const parentY = parentPositions[0].y + TREE_PAD + TREE_NODE_H
                        const childXs = childPositions.map((p) => p.x + TREE_PAD + TREE_NODE_W / 2)
                        const childTopY = childPositions[0].y + TREE_PAD
                        const busY = parentY + (childTopY - parentY) / 2
                        const minChildX = Math.min(...childXs)
                        const maxChildX = Math.max(...childXs)
                        // stem from the parent midpoint down to the bus
                        lines.push(<line key={`${key}-stem`} x1={parentMidX} y1={parentY} x2={parentMidX} y2={busY} stroke={themePalette.border} strokeWidth="1.5" />)
                        // horizontal bus spanning the children (skip if only one child directly below)
                        if (childXs.length > 1 || Math.abs(minChildX - parentMidX) > 2) {
                          lines.push(<line key={`${key}-bus`} x1={minChildX} y1={busY} x2={maxChildX} y2={busY} stroke={themePalette.border} strokeWidth="1.5" />)
                        }
                        // drop from the bus down to each child
                        childXs.forEach((x, i) => {
                          lines.push(<line key={`${key}-drop-${unit.childIds[i]}`} x1={x} y1={busY} x2={x} y2={childTopY} stroke={themePalette.border} strokeWidth="1.5" />)
                        })
                      })
                      return lines
                    })()}
                    {(() => {
                      // Draw one dashed line per unique spouse pair. Characters
                      // can have several spouses (e.g. Jacob had four), so this
                      // walks every spouseIds entry rather than just the first.
                      const drawn = new Set()
                      const lines = []
                      visibleCharacters.forEach((c) => {
                        c.spouseIds.filter((sid) => visibleIds.has(sid)).forEach((sid) => {
                          const pairKey = [c.id, sid].sort().join('|')
                          if (drawn.has(pairKey)) return
                          drawn.add(pairKey)
                          const p1 = treePositions[c.id]
                          const p2 = treePositions[sid]
                          if (!p1 || !p2 || p1.y !== p2.y) return
                          const [left, right] = p1.x <= p2.x ? [p1, p2] : [p2, p1]
                          const y = left.y + TREE_PAD + TREE_NODE_H / 2
                          const x1 = left.x + TREE_PAD + TREE_NODE_W
                          const x2 = right.x + TREE_PAD
                          lines.push(<line key={pairKey} x1={x1} y1={y} x2={x2} y2={y} stroke={resolvedAccent} strokeWidth="1.5" strokeDasharray="3,3" />)
                        })
                      })
                      return lines
                    })()}
                    {(() => {
                      // Draw a "generations not shown" gap connector for any
                      // character linked via impliedGapFrom rather than a
                      // real, fully-documented parentIds link - e.g. Salmon
                      // is several real generations after Perez, but those
                      // in-between names aren't individually curated. A
                      // dotted line with a small (dots) marker bridges the
                      // two so the lineage still reads as continuous instead
                      // of the descendant just appearing out of nowhere.
                      const lines = []
                      visibleCharacters.forEach((c) => {
                        if (!c.impliedGapFrom || !visibleIds.has(c.impliedGapFrom)) return
                        const p1 = treePositions[c.impliedGapFrom]
                        const p2 = treePositions[c.id]
                        if (!p1 || !p2) return
                        const x1 = p1.x + TREE_PAD + TREE_NODE_W / 2
                        const y1 = p1.y + TREE_PAD + TREE_NODE_H
                        const x2 = p2.x + TREE_PAD + TREE_NODE_W / 2
                        const y2 = p2.y + TREE_PAD
                        const midX = (x1 + x2) / 2
                        const midY = (y1 + y2) / 2
                        lines.push(
                          <g key={`gap-${c.id}`}>
                            <path d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`} stroke={themePalette.textMuted} strokeWidth="1.5" strokeDasharray="1,4" strokeLinecap="round" fill="none" />
                            <circle cx={midX} cy={midY} r="9" fill={themePalette.surfaceAlt} stroke={themePalette.textMuted} strokeWidth="1" />
                            <text x={midX} y={midY + 3} textAnchor="middle" fontSize="10" fill={themePalette.textMuted}>⋯</text>
                          </g>
                        )
                      })
                      return lines
                    })()}
                  </svg>
                  {visibleCharacters.map((c) => {
                    const pos = treePositions[c.id]
                    if (!pos) return null
                    return (
                      <div key={c.id} style={{ position: 'absolute', left: pos.x + TREE_PAD, top: pos.y + TREE_PAD, width: TREE_NODE_W }}>
                        <button onClick={() => openCharacter(c.id)}
                          style={{
                            width: '100%', minHeight: TREE_NODE_H, cursor: 'pointer',
                            borderRadius: 8, padding: '6px 10px', textAlign: 'left',
                            border: selectedCharacterId === c.id ? `2px solid ${resolvedAccent}` : `1px solid ${themePalette.border}`,
                            background: c.significance === 'major' ? themePalette.surface : themePalette.chip,
                            fontFamily: "'Inter', system-ui, sans-serif",
                          }}>
                          <div style={{ fontSize: 12, fontWeight: c.significance === 'major' ? 600 : 400, color: themePalette.text, lineHeight: 1.25 }}>{c.name}</div>
                          {characterNotes[c.id] && <div style={{ fontSize: 10, color: themePalette.textMuted, marginTop: 2 }}>📝 note</div>}
                        </button>
                        <button
                          title="Hide this person"
                          onClick={(e) => { e.stopPropagation(); toggleHiddenCharacter(c.id) }}
                          style={{
                            position: 'absolute', top: -6, right: -6, width: 18, height: 18, cursor: 'pointer',
                            borderRadius: '50%', border: `1px solid ${themePalette.border}`, background: themePalette.surface,
                            color: themePalette.textMuted, fontSize: 10, lineHeight: '16px', padding: 0,
                          }}>
                          ✕
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
              <p style={{ fontSize: 12, color: themePalette.textMuted, marginTop: 8 }}>
                Drag to pan, scroll or use +/− to zoom. Solid lines connect parent and child; dashed lines connect spouses; dotted lines with ⋯ mean generations in between aren't individually listed.
              </p>
            </div>
          )}

          {characterView === 'timeline' && (
            <div>
              {ERAS.map((era) => {
                const eraChars = visibleCharacters.filter((c) => c.era === era.key)
                if (eraChars.length === 0) return null
                const groups = {}
                eraChars.forEach((c) => {
                  if (!groups[c.storyGroup]) groups[c.storyGroup] = []
                  groups[c.storyGroup].push(c)
                })
                return (
                  <div key={era.key} style={{ marginBottom: 28 }}>
                    <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 17, margin: '0 0 12px', color: themePalette.text, borderBottom: `1px solid ${themePalette.border}`, paddingBottom: 6 }}>
                      {era.label}
                    </h3>
                    {Object.entries(groups).map(([groupKey, groupChars]) => (
                      <div key={groupKey} style={{ marginBottom: 12 }}>
                        {Object.keys(groups).length > 1 && (
                          <div style={{ fontSize: 11, color: themePalette.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                            {prettyGroupLabel(groupKey)}
                          </div>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {groupChars.map((c) => (
                            <div key={c.id} style={{
                              display: 'flex', alignItems: 'center', borderRadius: 16,
                              border: selectedCharacterId === c.id ? `2px solid ${resolvedAccent}` : `1px solid ${themePalette.border}`,
                              background: c.significance === 'major' ? themePalette.surface : themePalette.chip,
                              overflow: 'hidden',
                            }}>
                              <button onClick={() => openCharacter(c.id)}
                                style={{
                                  cursor: 'pointer', padding: '7px 4px 7px 12px', fontSize: 13, border: 'none', background: 'transparent',
                                  color: themePalette.text, fontWeight: c.significance === 'major' ? 600 : 400,
                                  fontFamily: "'Inter', system-ui, sans-serif",
                                }}>
                                {c.name}{characterNotes[c.id] ? ' 📝' : ''}
                              </button>
                              <button
                                title="Hide this person"
                                onClick={() => toggleHiddenCharacter(c.id)}
                                style={{
                                  cursor: 'pointer', border: 'none', background: 'transparent', color: themePalette.textMuted,
                                  fontSize: 11, padding: '7px 10px 7px 2px',
                                }}>
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {selectedCharacterId && (() => {
            const c = getCharacter(selectedCharacterId)
            if (!c) return null
            const parents = getParents(c.id)
            const children = getChildren(c.id)
            const spouses = getSpouses(c.id)
            const isHidden = hiddenCharacterIds.includes(c.id)
            const gapAncestor = c.impliedGapFrom ? getCharacter(c.impliedGapFrom) : null
            return (
              <div style={{ marginTop: 20, background: themePalette.surface, border: `1px solid ${themePalette.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 20, margin: 0, color: themePalette.text }}>{c.name}</h3>
                  <button onClick={() => setSelectedCharacterId(null)}
                    style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: 13, color: themePalette.textMuted }}>
                    Close ✕
                  </button>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: themePalette.text, margin: '0 0 14px' }}>{c.blurb}</p>

                {gapAncestor && (
                  <p style={{ fontSize: 12, color: themePalette.textMuted, margin: '0 0 14px', fontStyle: 'italic' }}>
                    ⋯ continues the line from <button onClick={() => openCharacter(gapAncestor.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: resolvedAccent, textDecoration: 'underline', fontSize: 12, fontStyle: 'italic' }}>{gapAncestor.name}</button> — the generations between them aren't individually listed.
                  </p>
                )}

                {(parents.length > 0 || spouses.length > 0 || children.length > 0) && (
                  <div style={{ fontSize: 13, color: themePalette.textMuted, marginBottom: 14, lineHeight: 1.8 }}>
                    {parents.length > 0 && (
                      <div>Parents: {parents.map((p, i) => (
                        <span key={p.id}>{i > 0 && ', '}<button onClick={() => openCharacter(p.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: resolvedAccent, textDecoration: 'underline', fontSize: 13 }}>{p.name}</button></span>
                      ))}</div>
                    )}
                    {spouses.length > 0 && (
                      <div>Spouse{spouses.length > 1 ? 's' : ''}: {spouses.map((p, i) => (
                        <span key={p.id}>{i > 0 && ', '}<button onClick={() => openCharacter(p.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: resolvedAccent, textDecoration: 'underline', fontSize: 13 }}>{p.name}</button></span>
                      ))}</div>
                    )}
                    {children.length > 0 && (
                      <div>Children: {children.map((p, i) => (
                        <span key={p.id}>{i > 0 && ', '}<button onClick={() => openCharacter(p.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: resolvedAccent, textDecoration: 'underline', fontSize: 13 }}>{p.name}</button></span>
                      ))}</div>
                    )}
                  </div>
                )}

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: themePalette.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                    Your notes
                  </div>
                  <textarea
                    value={characterNoteDraft}
                    onChange={(e) => setCharacterNoteDraft(e.target.value)}
                    placeholder="Write a private note or comment about this person..."
                    rows={3}
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: 10, fontSize: 13, borderRadius: 8,
                      border: `1px solid ${themePalette.border}`, background: themePalette.surfaceAlt, color: themePalette.text,
                      fontFamily: "'Inter', system-ui, sans-serif", resize: 'vertical',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <button onClick={() => saveCharacterNote(c.id, characterNoteDraft)} disabled={savingCharacterNote}
                      style={{
                        cursor: savingCharacterNote ? 'default' : 'pointer', padding: '7px 16px', borderRadius: 8, fontSize: 13,
                        border: 'none', background: resolvedAccent, color: resolvedOnAccent, fontWeight: 600,
                        opacity: savingCharacterNote ? 0.7 : 1,
                      }}>
                      {savingCharacterNote ? 'Saving...' : 'Save note'}
                    </button>
                    <button onClick={() => toggleHiddenCharacter(c.id)}
                      style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: 12, color: themePalette.textMuted, textDecoration: 'underline' }}>
                      {isHidden ? 'Unhide this person' : 'Hide this person'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {tab === 'settings' && (
        <div style={{ maxWidth: 480 }}>
          <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 18, margin: '0 0 4px', color: themePalette.text }}>Appearance</h3>
          <p style={{ fontSize: 13, color: themePalette.textMuted, margin: '0 0 20px' }}>
            These settings are saved on this device.
          </p>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: themePalette.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Color theme
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {THEME_ORDER.map((key) => {
                const t = THEMES[key]
                const selected = themeKey === key
                return (
                  <button key={key} onClick={() => setThemeKey(key)}
                    style={{
                      cursor: 'pointer', width: 96, padding: '12px 8px 10px', borderRadius: 12,
                      border: selected ? `2px solid ${t.accent}` : `1px solid ${themePalette.border}`,
                      background: themePalette.surface,
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 8 }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: t.bg, border: `1px solid ${t.border}`, display: 'inline-block' }} />
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: t.accent, display: 'inline-block' }} />
                    </div>
                    <div style={{ fontSize: 12, color: themePalette.text, fontWeight: selected ? 600 : 400 }}>{t.label}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: themePalette.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Accent color
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <input type="color" value={accentOverride || themePalette.accent}
                onChange={(e) => setAccentOverride(e.target.value)}
                style={{ width: 42, height: 34, padding: 0, border: `1px solid ${themePalette.border}`, borderRadius: 6, cursor: 'pointer', background: 'none' }} />
              <span style={{ fontSize: 13, color: themePalette.textMuted }}>
                Used for buttons, tabs, and selections
              </span>
              {accentOverride && (
                <button onClick={() => setAccentOverride(null)}
                  style={{ fontSize: 12, cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', color: themePalette.textMuted }}>
                  Reset to theme default
                </button>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: themePalette.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Text size
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FONT_SCALE_ORDER.map((key) => {
                const selected = fontScaleKey === key
                return (
                  <button key={key} onClick={() => setFontScaleKey(key)}
                    style={{
                      cursor: 'pointer', padding: '8px 14px', borderRadius: 8,
                      border: selected ? `2px solid ${resolvedAccent}` : `1px solid ${themePalette.border}`,
                      background: selected ? themePalette.surfaceAlt : themePalette.surface,
                      fontSize: 13, color: themePalette.text, fontWeight: selected ? 600 : 400,
                    }}>
                    {FONT_SCALE_LABELS[key]}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
