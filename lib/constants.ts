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

export { DEVMENTOR_CONTRACT_ABI, DEVMENTOR_CONTRACT_ADDRESS }
