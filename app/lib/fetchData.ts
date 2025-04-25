let cachedData: any = null

export async function fetchDataWithCache() {
  if (cachedData) {
    return cachedData
  }

  try {
    const response = await fetch("https://akulakasa.pages.dev/data.json")
    cachedData = await response.json()
    return cachedData
  } catch (error) {
    console.error("Failed to fetch data:", error)
    throw new Error("Failed to fetch data")
  }
}
