import { FaBook } from "react-icons/fa"

export default function SessionTopic({ topic }: { topic: string }) {
  return (
    <div className="flex items-center gap-2">
      <FaBook />
      <span className="text-small text-dim text-nowrap">{topic}</span>
    </div>
  )
}
