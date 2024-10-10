import {
  DEVMENTOR_CONTRACT_ABI,
  DEVMENTOR_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { createPublicClient, createWalletClient, Hash, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { baseSepolia } from "viem/chains"

export async function executeContractWriteGasless({
  functionName,
  args,
}: {
  functionName: string
  args: any[]
}): Promise<Hash> {
  try {
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x`)

    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL),
    })

    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL),
    })

    const { request: gaslessRequest } = await publicClient.simulateContract({
      account,
      address: DEVMENTOR_CONTRACT_ADDRESS,
      abi: DEVMENTOR_CONTRACT_ABI,
      functionName,
      args,
    })

    const result = await walletClient.writeContract(gaslessRequest)

    return result
  } catch (error: any) {
    console.log(error)
    throw new Error(error)
  }
}
