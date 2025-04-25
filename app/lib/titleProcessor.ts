export function processTitle(title: string): string {
  // Contoh sederhana: trim dan ubah ke title case
  if (!title) return ""
  return title
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
