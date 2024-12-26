"use client"
import clsx from "clsx"
import AnimatedBackground from "./animated-background"
import { useEffect, useState } from "react"

const funFacts = [
  "Blockchain is a decentralized, distributed ledger technology.",
  "EVM stands for Ethereum Virtual Machine.",
  "Oracles bridge the gap between blockchain and real-world data.",
  "Smart contracts are self-executing contracts with the terms directly written into code.",
  "The first blockchain was conceptualized in 2008 by Satoshi Nakamoto.",
  "Ethereum introduced the concept of programmable blockchain.",
  "Oracles can provide external data to smart contracts.",
  "Gas fees in Ethereum are paid in Gwei, a smaller denomination of Ether.",
  "EVM is Turing complete, meaning it can solve any computational problem.",
  "Blockchain technology ensures transparency and immutability of data.",
  "The largest cryptocurrency by market cap is Bitcoin.",
  "Ethereum uses a proof-of-stake consensus mechanism.",
  "NFTs (Non-Fungible Tokens) are unique digital assets verified by blockchain.",
  "DeFi stands for Decentralized Finance.",
  "The Bitcoin whitepaper was published on October 31, 2008.",
  "Ethereum's native cryptocurrency is called Ether (ETH).",
  "Chainlink is a popular decentralized oracle network.",
  "Smart contracts eliminate the need for intermediaries in many transactions.",
  "The EVM executes smart contracts in a sandboxed environment.",
  "Blockchain can potentially revolutionize supply chain management.",
  "The term 'Web3' refers to a decentralized internet built on blockchain.",
  "DAOs are Decentralized Autonomous Organizations governed by smart contracts.",
  "Metamask is a popular Ethereum wallet and gateway to blockchain apps.",
  "The 'genesis block' is the first block in a blockchain.",
  "Proof-of-Work and Proof-of-Stake are common consensus mechanisms.",
  "Ethereum's London Hard Fork introduced EIP-1559, changing its fee structure.",
  "Solidity is the primary programming language for Ethereum smart contracts.",
  "Layer 2 solutions aim to solve blockchain scalability issues.",
  "Blockchain technology can be used for secure voting systems.",
  "The EVM uses 'gas' to measure computational effort.",
  "Oracles help prevent the 'oracle problem' in blockchain systems.",
  "Ethereum's monetary policy changed significantly with 'The Merge'.",
  "Zero-knowledge proofs can enhance privacy in blockchain transactions.",
  "The InterPlanetary File System (IPFS) is often used with blockchain for decentralized storage.",
  "Blockchain can potentially reduce fraud in financial transactions.",
  "The term 'HODL' originated from a typo of 'hold' in a Bitcoin forum.",
  "Ethereum Improvement Proposals (EIPs) guide the network's evolution.",
  "The Bitcoin network has never been successfully hacked.",
  "Stablecoins are cryptocurrencies designed to minimize price volatility.",
  "The concept of 'mining' in PoW blockchains involves solving complex mathematical problems.",
  "Ethereum's transition to PoS reduced its energy consumption by ~99.95%.",
  "Blockchain technology can be used to create decentralized social media platforms.",
  "The 'halving' event in Bitcoin reduces the block reward by half approximately every four years.",
  "Sidechains are separate blockchains that run in parallel to the main chain.",
  "The term 'whale' in crypto refers to individuals or entities that hold large amounts of a cryptocurrency.",
  "Blockchain can potentially revolutionize the way we handle digital identity.",
  "The concept of 'Gas Wars' refers to competition for transaction priority on the Ethereum network.",
  "Ethereum's 'account abstraction' aims to improve user experience and security.",
  "The 'Beacon Chain' was a crucial part of Ethereum's transition to Proof-of-Stake.",
  "Blockchain technology can be used to create more transparent and efficient charity organizations.",
  "The term 'DYOR' in the crypto world stands for 'Do Your Own Research'.",
]

export default function LoadingScreen({
  message = "",
  disappears = false,
  showMessage = true,
}: {
  message?: string
  disappears?: boolean
  showMessage?: boolean
}) {
  const [displayMessage, setDisplayMessage] = useState<string>(message)

  useEffect(() => {
    if (showMessage && !message) {
      const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)]
      setDisplayMessage(randomFact)
    }
  }, [message])

  return (
    <div
      className={clsx(
        "pointer-events-none bg-black absolute inset-0 h-full w-full flex flex-col gap-8 justify-center items-center",
        {
          disappear: disappears,
        }
      )}
    >
      <span className="text-4xl font-heading font-semibold text-center px-4 w-[50%]">
        {displayMessage}
      </span>
      <div className="loader"></div>
      <AnimatedBackground shader={false} />
    </div>
  )
}
