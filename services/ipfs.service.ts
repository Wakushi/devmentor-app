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
