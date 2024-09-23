export default function LoadingScreen() {
  return (
    <div className="pointer-events-none bg-black disappear absolute inset-0 h-full w-full flex justify-center items-center">
      <div className="loader"></div>
    </div>
  )
}
