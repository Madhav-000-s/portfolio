"use client"

import { useRef, forwardRef } from "react"
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

    // Debug logging
    console.log("TuxModel: scene loaded", scene)
    console.log("TuxModel: scene children", scene.children)

    // Calculate and log model bounds
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    console.log("TuxModel: model size", size)

    return (
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        <primitive object={scene.clone()} />
      </group>
    )
  }
)

TuxModel.displayName = "TuxModel"

export default TuxModel
