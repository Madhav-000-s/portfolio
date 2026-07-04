"use client"

import { useEffect, useRef, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Center } from "@react-three/drei"
import gsap from "gsap"
import TuxModel from "@/components/TuxModel"
import * as THREE from "three"

export default function MobileTux() {
  const modelRef = useRef<THREE.Group>(null)
  const isAnimatingRef = useRef(false)
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const idleTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const scheduleIdleRef = useRef<(() => void) | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    const checkModelLoaded = setInterval(() => {
      if (modelRef.current && !initializedRef.current) {
        clearInterval(checkModelLoaded)
        initializedRef.current = true
        initialize()
      }
    }, 100)

    function initialize() {
      const model = modelRef.current
      if (!model) return

      // Entrance: spin in and rise
      gsap.fromTo(
        model.rotation,
        { y: Math.PI * 2 },
        { y: 0, duration: 1.2, ease: "power3.out", delay: 0.2, onComplete: scheduleIdle }
      )
      gsap.fromTo(
        model.position,
        { y: -2 },
        { y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
      )

      // Idle: gentle waddle every few seconds
      function playWaddle() {
        if (!model || isAnimatingRef.current) return
        isAnimatingRef.current = true
        idleTimelineRef.current = gsap
          .timeline()
          .to(model.rotation, { z: 0.1, duration: 0.3, ease: "sine.inOut" })
          .to(model.rotation, { z: -0.1, duration: 0.3, ease: "sine.inOut" })
          .to(model.rotation, { z: 0.06, duration: 0.25, ease: "sine.inOut" })
          .to(model.rotation, { z: -0.06, duration: 0.25, ease: "sine.inOut" })
          .to(model.rotation, { z: 0, duration: 0.2, ease: "sine.out" })
        idleTimelineRef.current.eventCallback("onComplete", () => {
          isAnimatingRef.current = false
          scheduleIdle()
        })
      }

      function scheduleIdle() {
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
        idleTimeoutRef.current = setTimeout(playWaddle, 3000)
      }

      scheduleIdleRef.current = scheduleIdle
    }

    return () => {
      clearInterval(checkModelLoaded)
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
      if (idleTimelineRef.current) idleTimelineRef.current.kill()
    }
  }, [])

  // Tap: excited hop (ignored while another animation plays)
  const handleTap = () => {
    const model = modelRef.current
    if (!model || isAnimatingRef.current) return
    isAnimatingRef.current = true
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)

    gsap
      .timeline({
        onComplete: () => {
          model.rotation.y = 0
          isAnimatingRef.current = false
          scheduleIdleRef.current?.()
        },
      })
      .to(model.position, { y: 0.3, duration: 0.25, ease: "power2.out" })
      .to(model.rotation, { y: 0.4, duration: 0.15, ease: "power1.inOut" }, "<")
      .to(model.rotation, { y: -0.4, duration: 0.15, ease: "power1.inOut" })
      .to(model.rotation, { y: 0.25, duration: 0.12, ease: "power1.inOut" })
      .to(model.rotation, { y: 0, duration: 0.1, ease: "power1.out" })
      .to(model.position, { y: 0, duration: 0.5, ease: "bounce.out" }, "-=0.2")
  }

  return (
    <div className="relative select-none" onClick={handleTap}>
      <Canvas
        style={{ width: "170px", height: "190px" }}
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={2} />
          <directionalLight position={[5, 5, 5]} intensity={3} />
          <directionalLight position={[-5, -5, -5]} intensity={2} />
          <pointLight position={[0, 7, 0]} intensity={2} />
          <Center>
            <TuxModel ref={modelRef} scale={0.075} />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  )
}
