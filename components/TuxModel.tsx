"use client"

import { forwardRef } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

interface TuxModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

const TuxModel = forwardRef<THREE.Group, TuxModelProps>(
  ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }, ref) => {
    const { scene } = useGLTF("/tux.glb")

    return (
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        <primitive object={scene.clone()} />
      </group>
    )
  }
)

TuxModel.displayName = "TuxModel"

export default TuxModel
