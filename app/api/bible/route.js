// Server-side proxy for Bible text. Two sources are combined here:
//
// 1) api.bible - used for English. New Testament comes from NKJV
//    (BIBLE_ID_NT), Old Testament comes from the Brenton English
//    Septuagint (BIBLE_ID_OT). Both env vars are Vercel Environment
//    Variables and the api.bible key never reaches the browser.
// 2) getBible (api.getbible.net) - used for Arabic (Smith & Van Dyck).
//    This is a free public API, no key needed, covers the whole Bible
//    in one translation.
//
// GET /api/bible?book=GEN&chapter=1              -> English (NKJV/Brenton), { verses, reference, copyright }
// GET /api/bible?book=GEN&chapter=1&lang=ar       -> Arabic (Van Dyck), { verses, reference, copyright, dir: 'rtl' }
// GET /api/bible?q=faith                          -> English search, { results }
// GET /api/bible?list=1                           -> every Bible your api.bible account can access

import { NextResponse } from 'next/server'

const API_BASE = 'https://rest.api.bible/v1'
const GETBIBLE_BASE = 'https://api.getbible.net/v2'
const BIBLE_ID_NT = process.env.BIBLE_ID_NT || process.env.BIBLE_ID // fallback to old name
const BIBLE_ID_OT = process.env.BIBLE_ID_OT
const API_KEY = process.env.BIBLE_API_KEY

// All 66 books in canonical order. Index (1-based) doubles as the
// numeric book ID getBible expects (e.g. Genesis=1, 1 John=62).
// "testament" decides whether a book is fetched from BIBLE_ID_OT or
// BIBLE_ID_NT on api.bible.
const BOOK_ORDER = [
  ['GEN', 'Genesis', 'OT'], ['EXO', 'Exodus', 'OT'], ['LEV', 'Leviticus', 'OT'], ['NUM', 'Numbers', 'OT'],
  ['DEU', 'Deuteronomy', 'OT'], ['JOS', 'Joshua', 'OT'], ['JDG', 'Judges', 'OT'], ['RUT', 'Ruth', 'OT'],
  ['1SA', '1 Samuel', 'OT'], ['2SA', '2 Samuel', 'OT'], ['1KI', '1 Kings', 'OT'], ['2KI', '2 Kings', 'OT'],
  ['1CH', '1 Chronicles', 'OT'], ['2CH', '2 Chronicles', 'OT'], ['EZR', 'Ezra', 'OT'], ['NEH', 'Nehemiah', 'OT'],
  ['EST', 'Esther', 'OT'], ['JOB', 'Job', 'OT'], ['PSA', 'Psalms', 'OT'], ['PRO', 'Proverbs', 'OT'],
  ['ECC', 'Ecclesiastes', 'OT'], ['SNG', 'Song of Solomon', 'OT'], ['ISA', 'Isaiah', 'OT'], ['JER', 'Jeremiah', 'OT'],
  ['LAM', 'Lamentations', 'OT'], ['EZK', 'Ezekiel', 'OT'], ['DAN', 'Daniel', 'OT'], ['HOS', 'Hosea', 'OT'],
  ['JOL', 'Joel', 'OT'], ['AMO', 'Amos', 'OT'], ['OBA', 'Obadiah', 'OT'], ['JON', 'Jonah', 'OT'],
  ['MIC', 'Micah', 'OT'], ['NAM', 'Nahum', 'OT'], ['HAB', 'Habakkuk', 'OT'], ['ZEP', 'Zephaniah', 'OT'],
  ['HAG', 'Haggai', 'OT'], ['ZEC', 'Zechariah', 'OT'], ['MAL', 'Malachi', 'OT'],
  ['MAT', 'Matthew', 'NT'], ['MRK', 'Mark', 'NT'], ['LUK', 'Luke', 'NT'], ['JHN', 'John', 'NT'],
  ['ACT', 'Acts', 'NT'], ['ROM', 'Romans', 'NT'], ['1CO', '1 Corinthians', 'NT'], ['2CO', '2 Corinthians', 'NT'],
  ['GAL', 'Galatians', 'NT'], ['EPH', 'Ephesians', 'NT'], ['PHP', 'Philippians', 'NT'], ['COL', 'Colossians', 'NT'],
  ['1TH', '1 Thessalonians', 'NT'], ['2TH', '2 Thessalonians', 'NT'], ['1TI', '1 Timothy', 'NT'], ['2TI', '2 Timothy', 'NT'],
  ['TIT', 'Titus', 'NT'], ['PHM', 'Philemon', 'NT'], ['HEB', 'Hebrews', 'NT'], ['JAS', 'James', 'NT'],
  ['1PE', '1 Peter', 'NT'], ['2PE', '2 Peter', 'NT'], ['1JN', '1 John', 'NT'], ['2JN', '2 John', 'NT'],
  ['3JN', '3 John', 'NT'], ['JUD', 'Jude', 'NT'], ['REV', 'Revelation', 'NT'],
]
const USFM_TO_NAME = Object.fromEntries(BOOK_ORDER.map(([usfm, name]) => [usfm, name]))
const bookInfo = (usfm) => {
  const idx = BOOK_ORDER.findIndex((b) => b[0] === usfm)
  if (idx === -1) return null
  return { number: idx + 1, name: BOOK_ORDER[idx][1], testament: BOOK_ORDER[idx][2] }
}

// Turns api.bible's plain-text chapter content (verse numbers wrapped
// in brackets, e.g. "[1] In the beginning...[2] And the earth...")
// into an array of {n, t} verse objects.
function parseVerses(content) {
  const cleaned = content.replace(/\[|\]/g, '').replace(/\s+/g, ' ').trim()
  const verses = []
  const re = /(\d{1,3})([^\d]+)/g
  let match
  while ((match = re.exec(cleaned)) !== null) {
    const n = parseInt(match[1], 10)
    const t = match[2].trim()
    if (t) verses.push({ n, t })
  }
  return verses
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const book = searchParams.get('book')
  const chapter = searchParams.get('chapter')
  const q = searchParams.get('q')
  const list = searchParams.get('list')
  const lang = searchParams.get('lang') || 'en'

  try {
    if (list) {
      if (!API_KEY) return NextResponse.json({ error: 'Set BIBLE_API_KEY in Vercel to use list.' }, { status: 500 })
      return await handleList()
    }
    if (book && chapter) {
      if (lang === 'ar') {
        return await handleArabicChapter(book, chapter)
      }
      if (!API_KEY || !BIBLE_ID_NT || !BIBLE_ID_OT) {
        return NextResponse.json(
          { error: 'Bible API is not fully configured. Need BIBLE_API_KEY, BIBLE_ID_NT, and BIBLE_ID_OT in Vercel.' },
          { status: 500 }
        )
      }
      return await handleChapter(book, chapter)
    }
    if (q) {
      if (!API_KEY || !BIBLE_ID_NT) {
        return NextResponse.json({ error: 'Bible API is not configured for search.' }, { status: 500 })
      }
      return await handleSearch(q)
    }
    return NextResponse.json({ error: 'Provide either book & chapter, q, or list=1' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: 'Bible API request failed', detail: String(err) }, { status: 500 })
  }
}

async function handleList() {
  const url = `${API_BASE}/bibles`
  const res = await fetch(url, { headers: { 'api-key': API_KEY } })
  if (!res.ok) {
    const detail = await res.text()
    return NextResponse.json({ error: `api.bible returned ${res.status}`, detail }, { status: res.status })
  }
  const json = await res.json()
  const bibles = (json.data || []).map((b) => ({
    id: b.id,
    name: b.name,
    nameLocal: b.nameLocal,
    abbreviation: b.abbreviationLocal || b.abbreviation,
    language: b.language?.name,
  })).sort((a, b) => (a.language || '').localeCompare(b.language || ''))
  return NextResponse.json({ count: bibles.length, bibles })
}

async function handleChapter(book, chapter) {
  const info = bookInfo(book)
  if (!info) return NextResponse.json({ error: `Unknown book code: ${book}` }, { status: 400 })
  const bibleId = info.testament === 'OT' ? BIBLE_ID_OT : BIBLE_ID_NT

  const chapterId = `${book}.${chapter}`
  const url = `${API_BASE}/bibles/${bibleId}/chapters/${chapterId}` +
    `?content-type=text&include-verse-numbers=true&include-chapter-numbers=false` +
    `&include-notes=false&include-titles=false&include-verse-spans=false`

  const res = await fetch(url, { headers: { 'api-key': API_KEY } })
  if (!res.ok) {
    const detail = await res.text()
    return NextResponse.json({ error: `api.bible returned ${res.status}`, detail }, { status: res.status })
  }
  const json = await res.json()
  const verses = parseVerses(json.data.content || '')
  return NextResponse.json({
    verses,
    reference: json.data.reference,
    copyright: json.data.copyright || null,
    dir: 'ltr',
  })
}

// Van Dyck Arabic, via the free getBible API. Covers the whole Bible
// in one translation, so no OT/NT split is needed here.
async function handleArabicChapter(book, chapter) {
  const info = bookInfo(book)
  if (!info) return NextResponse.json({ error: `Unknown book code: ${book}` }, { status: 400 })

  const url = `${GETBIBLE_BASE}/arabicsv/${info.number}/${chapter}.json`
  const res = await fetch(url)
  if (!res.ok) {
    const detail = await res.text()
    return NextResponse.json({ error: `getBible returned ${res.status}`, detail }, { status: res.status })
  }
  const json = await res.json()
  // getBible's chapter endpoint returns a "verses" array of
  // {chapter, verse, name, text} objects (confirmed via their query
  // API docs; the main chapter endpoint follows the same verse shape).
  const rawVerses = json.verses || json.book?.chapter?.verses || []
  const verses = rawVerses.map((v) => ({
    n: v.verse ?? v.verse_nr ?? v.n,
    t: (v.text || '').trim(),
  })).filter((v) => v.n && v.t)

  return NextResponse.json({
    verses,
    reference: `${info.name} ${chapter}`,
    copyright: 'Smith & Van Dyck Arabic Bible (public domain), via getBible.net',
    dir: 'rtl',
  })
}

async function handleSearch(query) {
  const url = `${API_BASE}/bibles/${BIBLE_ID_NT}/search?query=${encodeURIComponent(query)}&limit=30`
  const res = await fetch(url, { headers: { 'api-key': API_KEY } })
  if (!res.ok) {
    const detail = await res.text()
    return NextResponse.json({ error: `api.bible returned ${res.status}`, detail }, { status: res.status })
  }
  const json = await res.json()
  const rawVerses = json.data?.verses || []
  const results = rawVerses.map((v) => {
    const idParts = (v.id || v.orgId || '').split('.') // e.g. "GEN.1.1"
    const bookId = idParts[0]
    const chapterNum = parseInt(idParts[1], 10)
    const verseNum = parseInt(idParts[2], 10)
    return {
      book: USFM_TO_NAME[bookId] || bookId,
      chapter: chapterNum,
      verse: verseNum,
      text: (v.text || '').replace(/\s+/g, ' ').trim(),
    }
  }).filter((r) => r.book && !isNaN(r.chapter) && !isNaN(r.verse))

  return NextResponse.json({ results })
}
