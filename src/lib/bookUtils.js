import axios from 'axios'

// simple hash to hsl
export function titleToHsl(title) {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = Math.abs(hash) % 360
  return `hsl(${h} 100% 45%)`
}

export async function fetchCoverFromOpenLibrary(title) {
  try {
    const q = encodeURIComponent(title)
    const res = await axios.get(`https://openlibrary.org/search.json?title=${q}&limit=1`)
    const doc = res.data.docs && res.data.docs[0]
    if (!doc) return null
    if (doc.cover_i) {
      return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
    }
    return null
  } catch (err) {
    console.error('OpenLibrary error', err)
    return null
  }
}
