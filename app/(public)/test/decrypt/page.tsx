"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ethers } from "ethers"
import { useState } from "react"
import { useAccount, useSignMessage } from "wagmi"
import useEthPriceQuery from "@/hooks/queries/eth-price-query"
import { decryptWithSignature, encryptForAddress } from "@/lib/crypto/crypto"

export default function DecryptPage() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const ethPriceQuery = useEthPriceQuery()

  const [message, setMessage] = useState<string>("")
  const [targetAddress, setTargetAddress] = useState<string>("")
  const [encryptedInfo, setEncryptedInfo] = useState("")
  const [decryptedInfo, setDecryptedInfo] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (log: string) => {
    setLogs((prevLogs) => [...prevLogs, log])
    console.log(log)
  }

  async function checkEthPrice() {
    const { data: ethPrice } = ethPriceQuery
    console.log("ethPrice: ", ethPrice)
  }

  async function encrypt() {
    try {
      addLog(`Encrypting message: "${message}" for address: ${targetAddress}`)

      if (!ethers.isAddress(targetAddress)) {
        throw new Error("Invalid Ethereum address")
      }

      const encrypted = await encryptForAddress(message, targetAddress)
      addLog(`Encrypted result: ${encrypted}`)
      setEncryptedInfo(encrypted)
      setError(null)
    } catch (err: any) {
      const errorMessage = `Encryption failed: ${err.message}`
      addLog(errorMessage)
      setError(errorMessage)
    }
  }

  async function decrypt() {
    try {
      if (!address) {
        throw new Error("Please connect your wallet")
      }

      addLog(`Requesting signature to authorize decryption`)
      const signature = await signMessageAsync({
        message: "Authorize decryption",
      })

      addLog(`Signature received, attempting to decrypt`)
      const decrypted = await decryptWithSignature(
        encryptedInfo,
        address,
        signature
      )

      addLog(`Decrypted result: "${decrypted}"`)

      setDecryptedInfo(decrypted)
      setError(null)
    } catch (err: any) {
      const errorMessage = `Decryption failed: ${err.message}`
      addLog(errorMessage)
      setError(errorMessage)
    }
  }

  return (
    <div className="p-4 pt-[8rem] min-h-screen m-auto w-[90%]">
      <div className="flex flex-col gap-2 max-w-[300px]">
        <Label>Message</Label>
        <Input
          placeholder="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Label>Target Address (for encryption)</Label>
        <Input
          placeholder="Address"
          value={targetAddress}
          onChange={(e) => setTargetAddress(e.target.value)}
        />
        <Label>Encrypted value</Label>
        <Input
          placeholder="Encrypted value"
          value={encryptedInfo}
          onChange={(e) => setEncryptedInfo(e.target.value)}
        />
        <Button onClick={encrypt}>Encrypt</Button>
        <Button onClick={decrypt}>Decrypt (using connected wallet)</Button>
        {error && <div className="text-red-500">{error}</div>}
        {encryptedInfo && (
          <div>
            <Label>Encrypted Info:</Label>
            <p className="break-all">{encryptedInfo}</p>
          </div>
        )}
        {decryptedInfo && (
          <div>
            <Label>Decrypted Info:</Label>
            <p>{decryptedInfo}</p>
          </div>
        )}
        <Button onClick={checkEthPrice}>Check ETH price</Button>
      </div>
    </div>
  )
}
