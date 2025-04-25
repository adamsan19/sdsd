const CACHE_DURATION_LAYER1 = 5 * 60 * 1000 // 5 menit
const CACHE_DURATION_LAYER2 = 60 * 60 * 1000 // 1 jam

let layer1Cache: { data: any; timestamp: number } | null = null
const layer2Cache: Map<string, { data: any; timestamp: number }> = new Map()

export async function fetchDataWithMultiLayerCache() {
  const now = Date.now()

  // Cek layer 1 cache
  if (layer1Cache && now - layer1Cache.timestamp < CACHE_DURATION_LAYER1) {
    return layer1Cache.data
  }

  // Cek layer 2 cache
  const key = 'data'
  const layer2Entry = layer2Cache.get(key)
  if (layer2Entry && now - layer2Entry.timestamp < CACHE_DURATION_LAYER2) {
    // Update layer 1 cache dari layer 2 cache
    layer1Cache = { data: layer2Entry.data, timestamp: now }
    return layer2Entry.data
  }

  // Fetch data baru
  try {
    const response = await fetch("https://akulakasa.pages.dev/data.json")
    const data = await response.json()

    // Update kedua layer cache
    layer1Cache = { data, timestamp: now }
    layer2Cache.set(key, { data, timestamp: now })

    return data
  } catch (error) {
    console.error("Gagal mengambil data:", error)
    throw new Error("Gagal mengambil data")
  }
}
