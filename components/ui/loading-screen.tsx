import clsx from "clsx"

export default function LoadingScreen({
  message = "",
  disappears = false,
}: {
  message?: string
  disappears?: boolean
}) {
  return (
    <div
      className={clsx(
        "pointer-events-none bg-black absolute inset-0 h-full w-full flex flex-col gap-8 justify-center items-center",
        {
          disappear: disappears,
        }
      )}
    >
      {!!message && (
        <span className="text-4xl font-heading font-semibold">{message}</span>
      )}
      <div className="loader"></div>
    </div>
  )
}
