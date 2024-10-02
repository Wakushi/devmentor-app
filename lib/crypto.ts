import { ethers } from "ethers"
import { AES, enc } from "crypto-js"

function deriveKeyFromAddress(address: string): string {
  const cleanAddress = address.startsWith("0x") ? address.slice(2) : address
  const paddedAddress = cleanAddress.padStart(64, "0")
  return ethers.keccak256("0x" + paddedAddress).slice(2)
}

export async function encryptForAddress(
  data: string,
  address: string
): Promise<string> {
  const key = deriveKeyFromAddress(address)
  const encrypted = AES.encrypt(data, key).toString()
  return encrypted
}

export async function decryptWithSignature(
  encryptedData: string,
  address: string,
  signature: string
): Promise<string> {
  const messageHash = ethers.hashMessage("Authorize decryption")
  const recoveredAddress = ethers.recoverAddress(messageHash, signature)

  if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
    throw new Error("Invalid signature for the given address")
  }

  const key = deriveKeyFromAddress(address)

  const decrypted = AES.decrypt(encryptedData, key).toString(enc.Utf8)
  return decrypted
}
