import { promises as fs } from 'fs'
import path from 'path'

let cachedData: any = null
const CACHE_FILE = path.resolve('./cacheData.json')
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 1 hari dalam milidetik

export async function fetchDataWithCombinedCache() {
  if (cachedData) {
    return cachedData
  }

  try {
    const now = Date.now()
    // Cek apakah file cache ada dan masih valid
    try {
      const stats = await fs.stat(CACHE_FILE)
      const age = now - stats.mtimeMs
      if (age < CACHE_DURATION) {
        const data = await fs.readFile(CACHE_FILE, 'utf-8')
        cachedData = JSON.parse(data)
        return cachedData
      }
    } catch {
      // File cache tidak ada atau error, lanjut fetch data baru
    }

    // Fetch data baru
    const response = await fetch("https://akulakasa.pages.dev/data.json")
    const data = await response.json()

    // Simpan data ke file cache dan cache memori
    await fs.writeFile(CACHE_FILE, JSON.stringify(data), 'utf-8')
    cachedData = data

    return cachedData
  } catch (error) {
    console.error("Gagal mengambil data:", error)
    throw new Error("Gagal mengambil data")
  }
}
