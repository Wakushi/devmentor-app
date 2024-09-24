"use client"

import { Connector, useConnect } from "wagmi"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { connect } from "@wagmi/core"
import { config } from "@/providers"
import { useState } from "react"
import { FaGoogle } from "react-icons/fa"
import Loader from "@/components/ui/loader"
import { usePathname } from "next/navigation"

export default function Connectors() {
  const { connectors } = useConnect()
  const pathName = usePathname()
  const [loading, setLoading] = useState<boolean>(false)

  async function handleConnect(connector: Connector) {
    setLoading(true)

    connect(config, { connector }).catch(() => {
      setLoading(false)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[90px] my-2">
        <Loader />
      </div>
    )
  }

  return (
    <div className="flex flex-col fade-in-bottom items-center justify-center gap-4 w-full max-w-[250px] min-h-[90px] my-2">
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
            {pathName === "/auth/login" ? "Connect" : "Signup"} with {name}
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
