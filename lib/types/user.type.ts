import { OpenloginUserInfo } from "@web3auth/openlogin-adapter"

export type User = {
  id?: string
  address: `0x${string}`
  web3AuthData?: Partial<OpenloginUserInfo>
  registered?: boolean
  name?: string
  email?: string
}
