import { publicClient } from "@/providers"
import { IProvider } from "@web3auth/base"
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  formatEther,
} from "viem"
import { baseSepolia } from "viem/chains"

export const getBalance = async (
  provider: IProvider,
  userAddress?: Address
): Promise<string> => {
  try {
    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(provider),
    })

    const accounts = userAddress
      ? [userAddress]
      : await walletClient.getAddresses()

    const balance = await publicClient.getBalance({ address: accounts[0] })
    return formatEther(balance)
  } catch (error) {
    return error as string
  }
}
