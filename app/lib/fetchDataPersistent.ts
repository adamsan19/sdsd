import { promises as fs } from 'fs'
import path from 'path'

const CACHE_FILE = path.resolve('./cacheData.json')
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 1 hari dalam milidetik

export async function fetchDataWithPersistentCache() {
  try {
    const now = Date.now()
    // Cek apakah file cache ada dan masih valid
    try {
      const stats = await fs.stat(CACHE_FILE)
      const age = now - stats.mtimeMs
      if (age < CACHE_DURATION) {
        const data = await fs.readFile(CACHE_FILE, 'utf-8')
        return JSON.parse(data)
      }
    } catch {
      // File cache tidak ada atau error, lanjut fetch data baru
    }

    // Fetch data baru
    const response = await fetch("https://akulakasa.pages.dev/data.json")
    const data = await response.json()

    // Simpan data ke file cache
    await fs.writeFile(CACHE_FILE, JSON.stringify(data), 'utf-8')

    return data
  } catch (error) {
    console.error("Gagal mengambil data:", error)
    throw new Error("Gagal mengambil data")
  }
}
