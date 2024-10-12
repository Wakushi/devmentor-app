import { PINATA_GATEWAY_BASE_URL } from "@/lib/constants"

export async function pinJSON(json: any): Promise<string> {
  const response = await fetch("/api/ipfs/json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ json }),
  })

  const { data } = await response.json()
  return data
}

export async function unpinFile(hash: string): Promise<void> {
  const response = await fetch("/api/ipfs/json", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      hash,
    }),
  })

  await response.json()
}

export async function getFileByHash(hash: string): Promise<any> {
  const response = await fetch(`${PINATA_GATEWAY_BASE_URL}/${hash}`)
  const data = await response.json()
  return data
}
