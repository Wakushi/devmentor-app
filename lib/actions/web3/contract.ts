import { createWalletClient, custom, Address, parseEther } from "viem"
import { simulateContract, writeContract } from "@wagmi/core"
import { config, publicClient } from "@/providers"
import { baseSepolia } from "viem/chains"
import { web3AuthInstance } from "@/lib/Web3AuthConnectorInstance"
import {
  DEVMENTOR_CONTRACT_ABI,
  DEVMENTOR_CONTRACT_ADDRESS,
} from "@/lib/constants"

export enum ContractEvent {
  SESSION_BOOKED = "SessionBooked",
}

interface WatchContractEventArgs {
  event: ContractEvent
  args?: any
  handler: (logs?: any) => void
}

export async function watchForEvent({
  event,
  args,
  handler,
}: WatchContractEventArgs) {
  publicClient.watchContractEvent({
    address: DEVMENTOR_CONTRACT_ADDRESS,
    abi: DEVMENTOR_CONTRACT_ABI,
    eventName: event,
    args,
    onLogs: (logs: any) => {
      handler(logs)
    },
  })
}

interface BookSessionArgs {
  studentAddress: Address
  mentorAddress: Address
  ethPayment: string
}

export async function writeBookSession({
  studentAddress,
  mentorAddress,
  ethPayment,
}: BookSessionArgs) {
  if (!web3AuthInstance.provider) {
    throw new Error("Failed to create ad parcel: missing provider")
  }

  if (!studentAddress) {
    throw new Error("Failed to create ad parcel: missing account")
  }

  try {
    const walletClient = createWalletClient({
      account: studentAddress,
      chain: baseSepolia,
      transport: custom(web3AuthInstance.provider),
    })

    const value = ethPayment ? parseEther(ethPayment) : undefined

    const { request } = await simulateContract(config, {
      account: walletClient.account,
      address: DEVMENTOR_CONTRACT_ADDRESS,
      abi: DEVMENTOR_CONTRACT_ABI,
      functionName: "bookSession",
      args: [mentorAddress],
      value,
    })

    const result = await writeContract(config, request)

    return result
  } catch (error: any) {
    throw new Error(error.metaMessages ? error.metaMessages[0] : error)
  }
}
