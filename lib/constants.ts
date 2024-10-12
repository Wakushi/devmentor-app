const PINATA_GATEWAY_BASE_URL = "https://tan-key-moth-8.mypinata.cloud/ipfs"

const DEVMENTOR_CONTRACT_ADDRESS = "0x67225FBe246DfBED468AB785e09A478665C46356"
const DEVMENTOR_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_sessionId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_accepted",
        type: "bool",
      },
    ],
    name: "acceptSession",
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
        name: "_sessionId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_accepted",
        type: "bool",
      },
    ],
    name: "acceptSessionAdmin",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "cancelSession",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "confirmSessionAsMentor",
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
        name: "_sessionId",
        type: "uint256",
      },
    ],
    name: "confirmSessionAsMentorAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_sessionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_rating",
        type: "uint256",
      },
    ],
    name: "confirmSessionAsStudent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_studentAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_sessionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_rating",
        type: "uint256",
      },
    ],
    name: "confirmSessionAsStudentAdmin",
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
        name: "_studentContactHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "_sessionGoalHash",
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
    inputs: [
      {
        internalType: "address",
        name: "_studentAddress",
        type: "address",
      },
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
        name: "_studentContactHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "_sessionGoalHash",
        type: "string",
      },
    ],
    name: "createSessionAdmin",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "Devmentor__AddressMismatch",
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
    name: "Devmentor__NotAuthorizedForValidation",
    type: "error",
  },
  {
    inputs: [],
    name: "Devmentor__NotAuthorizedToConfirm",
    type: "error",
  },
  {
    inputs: [],
    name: "Devmentor__NotEnoughFundsSent",
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
    inputs: [],
    name: "Devmentor__WrongRating",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
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
    name: "OwnableUnauthorizedAccount",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "MentorRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentPending",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PendingPaymentResolved",
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
            internalType: "enum DevmentorLib.Subject[]",
            name: "subjects",
            type: "uint8[]",
          },
        ],
        internalType: "struct DevmentorLib.BaseUser",
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
                internalType: "enum DevmentorLib.Subject[]",
                name: "subjects",
                type: "uint8[]",
              },
            ],
            internalType: "struct DevmentorLib.BaseUser",
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
            internalType: "uint256",
            name: "totalRating",
            type: "uint256",
          },
        ],
        internalType: "struct DevmentorLib.Mentor",
        name: "",
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
            internalType: "enum DevmentorLib.Subject[]",
            name: "subjects",
            type: "uint8[]",
          },
        ],
        internalType: "struct DevmentorLib.BaseUser",
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
    name: "registerMentorAdmin",
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
                internalType: "enum DevmentorLib.Subject[]",
                name: "subjects",
                type: "uint8[]",
              },
            ],
            internalType: "struct DevmentorLib.BaseUser",
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
            internalType: "uint256",
            name: "totalRating",
            type: "uint256",
          },
        ],
        internalType: "struct DevmentorLib.Mentor",
        name: "",
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
            internalType: "enum DevmentorLib.Subject[]",
            name: "subjects",
            type: "uint8[]",
          },
        ],
        internalType: "struct DevmentorLib.BaseUser",
        name: "_baseUser",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "_contactHash",
        type: "string",
      },
      {
        internalType: "enum DevmentorLib.Experience",
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
                internalType: "enum DevmentorLib.Subject[]",
                name: "subjects",
                type: "uint8[]",
              },
            ],
            internalType: "struct DevmentorLib.BaseUser",
            name: "user",
            type: "tuple",
          },
          {
            internalType: "string",
            name: "contactHash",
            type: "string",
          },
          {
            internalType: "enum DevmentorLib.Experience",
            name: "experience",
            type: "uint8",
          },
        ],
        internalType: "struct DevmentorLib.Student",
        name: "",
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
            internalType: "enum DevmentorLib.Subject[]",
            name: "subjects",
            type: "uint8[]",
          },
        ],
        internalType: "struct DevmentorLib.BaseUser",
        name: "_baseUser",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "_contactHash",
        type: "string",
      },
      {
        internalType: "enum DevmentorLib.Experience",
        name: "_experience",
        type: "uint8",
      },
    ],
    name: "registerStudentAdmin",
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
                internalType: "enum DevmentorLib.Subject[]",
                name: "subjects",
                type: "uint8[]",
              },
            ],
            internalType: "struct DevmentorLib.BaseUser",
            name: "user",
            type: "tuple",
          },
          {
            internalType: "string",
            name: "contactHash",
            type: "string",
          },
          {
            internalType: "enum DevmentorLib.Experience",
            name: "experience",
            type: "uint8",
          },
        ],
        internalType: "struct DevmentorLib.Student",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "resetMentors",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "resolvePendingPayment",
    outputs: [],
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
        name: "mentorAccount",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "studentAccount",
        type: "address",
      },
    ],
    name: "SessionCompleted",
    type: "event",
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
    ],
    name: "SessionConfirmed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "studentAccount",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    name: "SessionCreated",
    type: "event",
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
        name: "mentorAccount",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "accepted",
        type: "bool",
      },
    ],
    name: "SessionValidated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "StudentRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "UpdatedMentorInfo",
    type: "event",
  },
  {
    inputs: [
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
    name: "updateMentorInfo",
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
        internalType: "uint256",
        name: "_hourlyRateUsd",
        type: "uint256",
      },
    ],
    name: "getHourlyRateInWei",
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
                internalType: "enum DevmentorLib.Subject[]",
                name: "subjects",
                type: "uint8[]",
              },
            ],
            internalType: "struct DevmentorLib.BaseUser",
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
            internalType: "uint256",
            name: "totalRating",
            type: "uint256",
          },
        ],
        internalType: "struct DevmentorLib.Mentor",
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
        name: "account",
        type: "address",
      },
    ],
    name: "getPendingEarnings",
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
        name: "_account",
        type: "address",
      },
    ],
    name: "getRoleByAccount",
    outputs: [
      {
        internalType: "enum DevmentorLib.Role",
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
            internalType: "string",
            name: "sessionGoalHash",
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
            name: "accepted",
            type: "bool",
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
        internalType: "struct DevmentorLib.Session",
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
        name: "_account",
        type: "address",
      },
    ],
    name: "getSessionIdsByAccount",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
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
                internalType: "enum DevmentorLib.Subject[]",
                name: "subjects",
                type: "uint8[]",
              },
            ],
            internalType: "struct DevmentorLib.BaseUser",
            name: "user",
            type: "tuple",
          },
          {
            internalType: "string",
            name: "contactHash",
            type: "string",
          },
          {
            internalType: "enum DevmentorLib.Experience",
            name: "experience",
            type: "uint8",
          },
        ],
        internalType: "struct DevmentorLib.Student",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
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
        internalType: "string",
        name: "sessionGoalHash",
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
        name: "accepted",
        type: "bool",
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

const BASE_USER_PATH = "/api/user"
const MEETING_EVENTS_PATH = "/meeting-events"
const BASE_CONTRACT_PATH = "/api/contract"

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
  ETH_DECIMALS,
  BASE_CONTRACT_PATH,
  BASE_USER_PATH,
  MEETING_EVENTS_PATH,
}
