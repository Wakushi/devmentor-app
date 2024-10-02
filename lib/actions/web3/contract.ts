import {
  createWalletClient,
  custom,
  Address,
  parseEther,
  formatUnits,
} from "viem"
import { simulateContract, writeContract } from "@wagmi/core"
import { config, publicClient } from "@/providers"
import { baseSepolia } from "viem/chains"
import { web3AuthInstance } from "@/lib/Web3AuthConnectorInstance"
import {
  DEVMENTOR_CONTRACT_ABI,
  DEVMENTOR_CONTRACT_ADDRESS,
  ETH_DECIMALS,
} from "@/lib/constants"
import { BaseUser, MentorStruct } from "@/lib/types/user.type"
import { Role } from "@/lib/types/role.type"
import { getMentorReviews } from "../client/pinata-actions"

export enum ContractEvent {
  SESSION_BOOKED = "SessionBooked",
  FUNDS_SENT_TO_MENTOR = "FundsSentToMentor",
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

async function executeContractWrite({
  account,
  functionName,
  args,
  value,
}: {
  account: Address
  functionName: string
  args: any[]
  value?: bigint
}) {
  if (!web3AuthInstance.provider) {
    throw new Error(`Failed to execute ${functionName}: missing provider`)
  }

  if (!account) {
    throw new Error(`Failed to execute ${functionName}: missing account`)
  }

  try {
    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: custom(web3AuthInstance.provider),
    })

    const { request } = await simulateContract(config, {
      account: walletClient.account,
      address: DEVMENTOR_CONTRACT_ADDRESS,
      abi: DEVMENTOR_CONTRACT_ABI,
      functionName,
      args,
      value,
    })

    const result = await writeContract(config, request)
    return result
  } catch (error: any) {
    throw new Error(error.metaMessages ? error.metaMessages[0] : error)
  }
}

export async function registerMentor({
  account,
  baseUser,
  yearsOfExperience,
  hourlyRate,
}: {
  account: Address
  baseUser: BaseUser
  yearsOfExperience: number
  hourlyRate: number
}) {
  return executeContractWrite({
    account,
    functionName: "registerMentor",
    args: [baseUser, yearsOfExperience, hourlyRate],
  })
}

export async function registerStudent({
  account,
  baseUser,
  contactHash,
  experience,
}: {
  account: Address
  baseUser: BaseUser
  contactHash: string
  experience: number
}) {
  return executeContractWrite({
    account,
    functionName: "registerStudent",
    args: [baseUser, contactHash, experience],
  })
}

export async function createSession({
  account,
  mentorAddress,
  startTime,
  endTime,
  studentContactHash,
  value,
}: {
  account: Address
  mentorAddress: Address
  startTime: number
  endTime: number
  studentContactHash: string
  value: bigint
}) {
  return executeContractWrite({
    account,
    functionName: "createSession",
    args: [mentorAddress, startTime, endTime, studentContactHash],
    value,
  })
}

export async function updateTimeslot(account: Address, timeslotHash: string) {
  return executeContractWrite({
    account,
    functionName: "updateTimeslot",
    args: [timeslotHash],
  })
}

export async function confirmSession(account: Address, sessionId: bigint) {
  return executeContractWrite({
    account,
    functionName: "confirmSession",
    args: [sessionId],
  })
}

export async function deleteAccount(account: Address) {
  return executeContractWrite({
    account,
    functionName: "deleteAccount",
    args: [],
  })
}

// Read-only functions
export async function getMentor(mentorAddress: Address): Promise<MentorStruct> {
  const data: any = await publicClient.readContract({
    address: DEVMENTOR_CONTRACT_ADDRESS,
    abi: DEVMENTOR_CONTRACT_ABI,
    functionName: "getMentor",
    args: [mentorAddress],
  })

  const {
    hourlyRate,
    reviewsHash,
    sessionCount,
    timeslotsHash,
    validated,
    yearsOfExperience,
    user,
  } = data

  const { account, userName, languages, subjects } = user

  const baseUser: BaseUser = {
    account,
    userName,
    languages,
    subjects,
  }

  const reviews = reviewsHash ? await getMentorReviews(reviewsHash) : []

  const mentor: MentorStruct = {
    account,
    baseUser,
    validated,
    yearsOfExperience: Number(yearsOfExperience),
    sessionCount: Number(sessionCount),
    hourlyRate: Number(hourlyRate),
    reviewsHash,
    timeslotsHash,
    role: Role.MENTOR,
    reviews,
  }

  return mentor
}

export async function getRole(account: Address) {
  return publicClient.readContract({
    address: DEVMENTOR_CONTRACT_ADDRESS,
    abi: DEVMENTOR_CONTRACT_ABI,
    functionName: "getRoleByAccount",
    args: [account],
  })
}

export async function getStudent(studentAddress: Address) {
  return publicClient.readContract({
    address: DEVMENTOR_CONTRACT_ADDRESS,
    abi: DEVMENTOR_CONTRACT_ABI,
    functionName: "getStudent",
    args: [studentAddress],
  })
}

export async function getSession(sessionId: number) {
  return publicClient.readContract({
    address: DEVMENTOR_CONTRACT_ADDRESS,
    abi: DEVMENTOR_CONTRACT_ABI,
    functionName: "getSession",
    args: [sessionId],
  })
}

export async function getAllMentors(): Promise<Address[]> {
  return publicClient.readContract({
    address: DEVMENTOR_CONTRACT_ADDRESS,
    abi: DEVMENTOR_CONTRACT_ABI,
    functionName: "getAllMentors",
  }) as unknown as Address[]
}

export async function getSessionCounter() {
  return publicClient.readContract({
    address: DEVMENTOR_CONTRACT_ADDRESS,
    abi: DEVMENTOR_CONTRACT_ABI,
    functionName: "getSessionCounter",
  })
}

export async function getEthPrice(): Promise<number> {
  const price = (await publicClient.readContract({
    address: DEVMENTOR_CONTRACT_ADDRESS,
    abi: DEVMENTOR_CONTRACT_ABI,
    functionName: "getEthPrice",
  })) as bigint

  return Number(formatUnits(price, 8))
}

export function usdToWei(usdAmount: number, ethPriceUsd: number): bigint {
  const ethAmount = +usdAmount / +ethPriceUsd
  const weiAmount = parseEther(ethAmount.toString())
  return weiAmount
}

export function weiToUsd(weiAmount: number, ethPriceUsd: number): number {
  const ethAmount = formatUnits(BigInt(weiAmount), ETH_DECIMALS)
  const usdAmount = +ethAmount * +ethPriceUsd
  return Number(usdAmount.toFixed(2))
}
