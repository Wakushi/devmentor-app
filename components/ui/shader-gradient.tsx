"use client"
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient"
import * as reactSpring from "@react-spring/three"
import * as drei from "@react-three/drei"
import * as fiber from "@react-three/fiber"

export default function ShaderGradientBackground() {
  return (
    <ShaderGradientCanvas
      importedfiber={{ ...fiber, ...drei, ...reactSpring }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      <ShaderGradient
        control="query"
        urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=170&cDistance=4.4&cPolarAngle=70&cameraZoom=1&color1=%232563eb&color2=%23121212&color3=%233c83f6&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=2.1&positionX=0&positionY=0.9&positionZ=-0.3&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=45&rotationY=0&rotationZ=0&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.2&uStrength=1&uTime=0&wireframe=false"
      />
    </ShaderGradientCanvas>
  )
}
