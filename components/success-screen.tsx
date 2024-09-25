import { CiCircleCheck } from "react-icons/ci"
import { ReactNode } from "react"

interface SuccessScreenProps {
  title: string
  subtitle: string
  children: ReactNode
}

export default function SuccessScreen({
  title,
  subtitle,
  children,
}: SuccessScreenProps) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <CiCircleCheck className="text-8xl text-success fade-in-bottom" />
      <div className="flex flex-col text-center">
        <h3>{title}</h3>
        <p className="mb-4 text-dim">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}
