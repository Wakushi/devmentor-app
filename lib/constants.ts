const PINATA_GATEWAY_BASE_URL = "https://tan-key-moth-8.mypinata.cloud/ipfs"

const DEVMENTOR_CONTRACT_ADDRESS = "0x07D91454EF167c9db31a41da7700198f52951059"
const DEVMENTOR_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_sessionId",
        type: "uint256",
      },
    ],
    name: "confirmSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mentorAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endTime",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "studentContactHash",
        type: "string",
      },
    ],
    name: "createSession",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "deleteAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_nativeToUsdpriceFeed",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Devmentor__AlreadyRegisteredAsMentor",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Devmentor__AlreadyRegisteredAsStudent",
    type: "error",
  },
  {
    inputs: [],
    name: "Devmentor__FundsTransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "Devmentor__InvalidSessionTime",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "mentorAddress",
        type: "address",
      },
    ],
    name: "Devmentor__MentorNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "Devmentor__NotAuthorizedToConfirm",
    type: "error",
  },
  {
    inputs: [],
    name: "Devmentor__NotEnoughFundsLocked",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Devmentor__NotRegisteredAsMentor",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Devmentor__NotRegisteredAsStudent",
    type: "error",
  },
  {
    inputs: [],
    name: "Devmentor__SessionAlreadyConfirmed",
    type: "error",
  },
  {
    inputs: [],
    name: "Devmentor__SessionNotCompleted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    name: "Devmentor__SessionNotFound",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "mentor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FundsSentToMentor",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "string",
            name: "userName",
            type: "string",
          },
          {
            internalType: "uint8[]",
            name: "languages",
            type: "uint8[]",
          },
          {
            internalType: "enum Devmentor.Subject[]",
            name: "subjects",
            type: "uint8[]",
          },
        ],
        internalType: "struct Devmentor.BaseUser",
        name: "_baseUser",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_yearsOfExperience",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_hourlyRate",
        type: "uint256",
      },
    ],
    name: "registerMentor",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "string",
                name: "userName",
                type: "string",
              },
              {
                internalType: "uint8[]",
                name: "languages",
                type: "uint8[]",
              },
              {
                internalType: "enum Devmentor.Subject[]",
                name: "subjects",
                type: "uint8[]",
              },
            ],
            internalType: "struct Devmentor.BaseUser",
            name: "user",
            type: "tuple",
          },
          {
            internalType: "bool",
            name: "validated",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "yearsOfExperience",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sessionCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hourlyRate",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "timeslotsHash",
            type: "string",
          },
          {
            internalType: "string",
            name: "reviewsHash",
            type: "string",
          },
        ],
        internalType: "struct Devmentor.Mentor",
        name: "mentor",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "string",
            name: "userName",
            type: "string",
          },
          {
            internalType: "uint8[]",
            name: "languages",
            type: "uint8[]",
          },
          {
            internalType: "enum Devmentor.Subject[]",
            name: "subjects",
            type: "uint8[]",
          },
        ],
        internalType: "struct Devmentor.BaseUser",
        name: "_baseUser",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "_contactHash",
        type: "string",
      },
      {
        internalType: "enum Devmentor.Experience",
        name: "_experience",
        type: "uint8",
      },
    ],
    name: "registerStudent",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "string",
                name: "userName",
                type: "string",
              },
              {
                internalType: "uint8[]",
                name: "languages",
                type: "uint8[]",
              },
              {
                internalType: "enum Devmentor.Subject[]",
                name: "subjects",
                type: "uint8[]",
              },
            ],
            internalType: "struct Devmentor.BaseUser",
            name: "user",
            type: "tuple",
          },
          {
            internalType: "string",
            name: "contactHash",
            type: "string",
          },
          {
            internalType: "enum Devmentor.Experience",
            name: "experience",
            type: "uint8",
          },
        ],
        internalType: "struct Devmentor.Student",
        name: "student",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "confirmedBy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isMentor",
        type: "bool",
      },
    ],
    name: "SessionConfirmed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_timeslotHash",
        type: "string",
      },
    ],
    name: "updateTimeslot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllMentors",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getEthPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mentorAddress",
        type: "address",
      },
    ],
    name: "getMentor",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "string",
                name: "userName",
                type: "string",
              },
              {
                internalType: "uint8[]",
                name: "languages",
                type: "uint8[]",
              },
              {
                internalType: "enum Devmentor.Subject[]",
                name: "subjects",
                type: "uint8[]",
              },
            ],
            internalType: "struct Devmentor.BaseUser",
            name: "user",
            type: "tuple",
          },
          {
            internalType: "bool",
            name: "validated",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "yearsOfExperience",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sessionCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hourlyRate",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "timeslotsHash",
            type: "string",
          },
          {
            internalType: "string",
            name: "reviewsHash",
            type: "string",
          },
        ],
        internalType: "struct Devmentor.Mentor",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "getRoleByAccount",
    outputs: [
      {
        internalType: "enum Devmentor.Role",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_sessionId",
        type: "uint256",
      },
    ],
    name: "getSession",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "studentContactHash",
            type: "string",
          },
          {
            internalType: "address",
            name: "mentor",
            type: "address",
          },
          {
            internalType: "address",
            name: "student",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "valueLocked",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "mentorConfirmed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "studentConfirmed",
            type: "bool",
          },
        ],
        internalType: "struct Devmentor.Session",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSessionCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_studentAddress",
        type: "address",
      },
    ],
    name: "getStudent",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "string",
                name: "userName",
                type: "string",
              },
              {
                internalType: "uint8[]",
                name: "languages",
                type: "uint8[]",
              },
              {
                internalType: "enum Devmentor.Subject[]",
                name: "subjects",
                type: "uint8[]",
              },
            ],
            internalType: "struct Devmentor.BaseUser",
            name: "user",
            type: "tuple",
          },
          {
            internalType: "string",
            name: "contactHash",
            type: "string",
          },
          {
            internalType: "enum Devmentor.Experience",
            name: "experience",
            type: "uint8",
          },
        ],
        internalType: "struct Devmentor.Student",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "s_sessionCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "s_sessions",
    outputs: [
      {
        internalType: "string",
        name: "studentContactHash",
        type: "string",
      },
      {
        internalType: "address",
        name: "mentor",
        type: "address",
      },
      {
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "valueLocked",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "mentorConfirmed",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "studentConfirmed",
        type: "bool",
      },
    ],
    stateMutability: "view",
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
const ETH_DECIMALS = 18

export {
  PINATA_GATEWAY_BASE_URL,
  DEVMENTOR_CONTRACT_ABI,
  DEVMENTOR_CONTRACT_ADDRESS,
  DAYS_OF_WEEK,
  NINETY_DAYS,
  NINE_THIRTY_AM,
  FIVE_PM,
  SATURDAY,
  ONE_HOUR_IN_MS,
  SUNDAY,
  ETH_DECIMALS
}
