"use client"

import GridBackground from "./grid-background"
import ShaderGradientBackground from "./shader-gradient"

export default function AnimatedBackground({
  shader = true,
}: {
  shader?: boolean
}) {
  return (
    <>
      <GridBackground />
      {shader && <ShaderGradientBackground />}
    </>
  )
}
