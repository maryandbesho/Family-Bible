// Server-side proxy for api.bible. The API key lives only here (as a
// Vercel Environment Variable) and is never sent to the browser.
//
// GET /api/bible?book=GEN&chapter=1        -> { verses: [{n, t}], reference, copyright }
// GET /api/bible?q=faith                   -> { results: [{book, chapter, verse, text}] }
// GET /api/bible?list=1                    -> { bibles: [{id, name, abbreviation, language}] }
//   Visit this one directly in your browser (once deployed) to see every
//   Bible your api.bible account has access to - useful for finding the
//   exact bibleId of a specific translation (e.g. Septuagint, Van Dyck).

import { NextResponse } from 'next/server'

const API_BASE = 'https://rest.api.bible/v1'
const BIBLE_ID = process.env.BIBLE_ID
const API_KEY = process.env.BIBLE_API_KEY

// USFM book code -> display name used throughout the app (must match
// the "name" values in BOOK_META in app/page.js).
const USFM_TO_NAME = {
  GEN: 'Genesis', EXO: 'Exodus', LEV: 'Leviticus', NUM: 'Numbers', DEU: 'Deuteronomy',
  JOS: 'Joshua', JDG: 'Judges', RUT: 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel',
  '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles',
  EZR: 'Ezra', NEH: 'Nehemiah', EST: 'Esther', JOB: 'Job', PSA: 'Psalms', PRO: 'Proverbs',
  ECC: 'Ecclesiastes', SNG: 'Song of Solomon', ISA: 'Isaiah', JER: 'Jeremiah',
  LAM: 'Lamentations', EZK: 'Ezekiel', DAN: 'Daniel', HOS: 'Hosea', JOL: 'Joel',
  AMO: 'Amos', OBA: 'Obadiah', JON: 'Jonah', MIC: 'Micah', NAM: 'Nahum', HAB: 'Habakkuk',
  ZEP: 'Zephaniah', HAG: 'Haggai', ZEC: 'Zechariah', MAL: 'Malachi',
  MAT: 'Matthew', MRK: 'Mark', LUK: 'Luke', JHN: 'John', ACT: 'Acts', ROM: 'Romans',
  '1CO': '1 Corinthians', '2CO': '2 Corinthians', GAL: 'Galatians', EPH: 'Ephesians',
  PHP: 'Philippians', COL: 'Colossians', '1TH': '1 Thessalonians', '2TH': '2 Thessalonians',
  '1TI': '1 Timothy', '2TI': '2 Timothy', TIT: 'Titus', PHM: 'Philemon', HEB: 'Hebrews',
  JAS: 'James', '1PE': '1 Peter', '2PE': '2 Peter', '1JN': '1 John', '2JN': '2 John',
  '3JN': '3 John', JUD: 'Jude', REV: 'Revelation',
}

// Turns api.bible's plain-text chapter content (verse numbers glued
// directly to the following word, e.g. "1In the beginning...2And the
// earth...") into an array of {n, t} verse objects.
function parseVerses(content) {
  const cleaned = content.replace(/\s+/g, ' ').trim()
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
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Bible API is not configured. Set BIBLE_API_KEY in Vercel.' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const book = searchParams.get('book')
  const chapter = searchParams.get('chapter')
  const q = searchParams.get('q')
  const list = searchParams.get('list')

  try {
    if (list) {
      return await handleList()
    }
    if (!BIBLE_ID) {
      return NextResponse.json(
        { error: 'BIBLE_ID is not set in Vercel yet.' },
        { status: 500 }
      )
    }
    if (q) {
      return await handleSearch(q)
    }
    if (book && chapter) {
      return await handleChapter(book, chapter)
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
  const chapterId = `${book}.${chapter}`
  const url = `${API_BASE}/bibles/${BIBLE_ID}/chapters/${chapterId}` +
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
  })
}

async function handleSearch(query) {
  const url = `${API_BASE}/bibles/${BIBLE_ID}/search?query=${encodeURIComponent(query)}&limit=30`
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
