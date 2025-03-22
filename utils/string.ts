export function formatAddress(address: string, length = 6) {
  return `${address.slice(0, length)}...${address.slice(-length + 2)}`
}

export const handleCopyClipBoard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (e) {
    console.error(e)
  }
}
