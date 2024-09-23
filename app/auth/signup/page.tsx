"use client"

import AnimatedBackground from "@/components/ui/animated-background"
import { Connector, useConnect } from "wagmi"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { connect } from "@wagmi/core"
import { config } from "@/providers"
import { useState } from "react"
import { FaGoogle } from "react-icons/fa"

export default function SignUpPage() {
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <>
      <section className="min-h-screen flex flex-col gap-4 justify-center items-center text-center">
        <h1 className="text-5xl">Create an account</h1>
        <p className="text-xl">Start your journey with us!</p>
        <Connectors setLoading={setLoading} />
        <p className="text-small text-dim max-w-[500px]">
          By clicking Sign up with Web3Auth or Sign up with Metamask, you agree
          to our terms and conditions and privacy policy.
        </p>
        <p className="text-small max-w-[500px]">
          Already have an account? <span className="font-bold">Log in</span>
        </p>
      </section>
      <AnimatedBackground />
    </>
  )
}

function Connectors({ setLoading }: { setLoading: (state: boolean) => void }) {
  const { connectors } = useConnect()

  async function handleConnect(connector: Connector) {
    setLoading(true)

    connect(config, { connector }).catch(() => {
      setLoading(false)
    })
  }

  return (
    <div className="flex flex-col items-center justify-center  gap-4 w-full max-w-[250px] my-2">
      {connectors.map((connector) => {
        const { id, icon, name } = connector
        return (
          <Button
            className="w-full gap-2"
            key={id}
            onClick={() => {
              handleConnect(connector)
            }}
          >
            {connector.id === "web3auth" && (
              <FaGoogle className="text-lg drop-shadow-lg" />
            )}
            {icon && <ConnectorIcon url={icon} name={name} />}
            Signup with {name}
          </Button>
        )
      })}
    </div>
  )
}

function ConnectorIcon({ url, name }: { url: string; name: string }) {
  return (
    <div className="w-[20px] h-[20px]">
      <Image width="100" height="100" src={url} alt={name}></Image>
    </div>
  )
}
