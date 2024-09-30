const DEVMENTOR_CONTRACT_ADDRESS = "0x8B4A082AEf19fE3f6545847E9483ED505Bfc8277"
const DEVMENTOR_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_mentor",
        type: "address",
      },
    ],
    name: "bookSession",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "Devmentor__TransferFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "mentor",
        type: "address",
      },
    ],
    name: "SessionBooked",
    type: "event",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
]

const DAYS_OF_WEEK = 7
const NINE_THIRTY_AM = 1727681433688
const FIVE_PM = 1727708414510
const SUNDAY = 0
const SATURDAY = 6
const ONE_HOUR_IN_MS = 60 * 60 * 1000
const NINETY_DAYS = 90

export {
  DEVMENTOR_CONTRACT_ABI,
  DEVMENTOR_CONTRACT_ADDRESS,
  DAYS_OF_WEEK,
  NINETY_DAYS,
  NINE_THIRTY_AM,
  FIVE_PM,
  SATURDAY,
  ONE_HOUR_IN_MS,
  SUNDAY,
}
