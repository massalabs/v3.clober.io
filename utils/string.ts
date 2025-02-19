export function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const handleCopyClipBoard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (e) {
    console.error(e)
  }
}
