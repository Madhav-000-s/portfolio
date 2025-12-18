"use client"

import { useEffect, useRef, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Center } from "@react-three/drei"
import gsap from "gsap"
import TuxModel from "./TuxModel"
import * as THREE from "three"

export default function HeroText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<THREE.Group>(null)
  const isNearRef = useRef(false)
  const floatAnimationRef = useRef<gsap.core.Tween | null>(null)
  const isBouncingRef = useRef(false)
  const initializedRef = useRef(false)

  useEffect(() => {
    let mouseMoveHandler: ((e: MouseEvent) => void) | null = null

    // Poll until model is loaded
    const checkModelLoaded = setInterval(() => {
      if (modelRef.current && containerRef.current && !initializedRef.current) {
        clearInterval(checkModelLoaded)
        initializedRef.current = true
        initializeAnimations()
      }
    }, 100)

    function initializeAnimations() {
      if (!modelRef.current || !containerRef.current) return

      const model = modelRef.current

      // Entrance animation
      gsap.fromTo(
        model.rotation,
        { y: Math.PI * 2 },
        {
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.3,
          onComplete: startFloatingAnimation,
        }
      )

      gsap.fromTo(
        model.position,
        { y: -2 },
        {
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.3,
        }
      )

      // Idle floating animation (gentle up and down bobbing)
      function startFloatingAnimation() {
        if (!model || isBouncingRef.current) return

        floatAnimationRef.current = gsap.to(model.position, {
          y: 0.3,
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      }

      function stopFloatingAnimation() {
        if (floatAnimationRef.current) {
          floatAnimationRef.current.kill()
          floatAnimationRef.current = null
        }
      }

      // Jump/bounce animation on hover
      function triggerBounce() {
        if (!model || isBouncingRef.current) return

        isBouncingRef.current = true
        stopFloatingAnimation()

        // Quick jump up and bounce down
        gsap.timeline()
          .to(model.position, {
            y: 1.2,
            duration: 0.25,
            ease: "power2.out",
          })
          .to(model.position, {
            y: 0,
            duration: 0.5,
            ease: "bounce.out",
            onComplete: () => {
              isBouncingRef.current = false
              // Resume floating if mouse is no longer near
              if (!isNearRef.current) {
                startFloatingAnimation()
              }
            },
          })
      }

      // Mouse follow effect with rotation
      const rotationXTo = gsap.quickTo(model.rotation, "x", {
        duration: 0.6,
        ease: "power3.out",
      })
      const rotationYTo = gsap.quickTo(model.rotation, "y", {
        duration: 0.6,
        ease: "power3.out",
      })

      mouseMoveHandler = (e: MouseEvent) => {
        if (!containerRef.current || !model) return

        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Calculate distance from center
        const deltaX = e.clientX - centerX
        const deltaY = e.clientY - centerY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        // Magnetic effect when within 300px
        const maxDistance = 300
        if (distance < maxDistance) {
          if (!isNearRef.current) {
            isNearRef.current = true
            stopFloatingAnimation()
            triggerBounce() // Bounce when mouse enters zone
          }
          const strength = 1 - distance / maxDistance
          // Convert mouse position to rotation
          const rotateY = (deltaX / maxDistance) * strength * 0.5
          const rotateX = -(deltaY / maxDistance) * strength * 0.5

          rotationYTo(rotateY)
          rotationXTo(rotateX)
        } else {
          if (isNearRef.current) {
            isNearRef.current = false
            rotationYTo(0)
            rotationXTo(0)
            // Restart floating animation after mouse leaves
            if (!isBouncingRef.current) {
              setTimeout(startFloatingAnimation, 600)
            }
          }
        }
      }

      window.addEventListener("mousemove", mouseMoveHandler)
    }

    return () => {
      clearInterval(checkModelLoaded)
      if (mouseMoveHandler) {
        window.removeEventListener("mousemove", mouseMoveHandler)
      }
      if (floatAnimationRef.current) {
        floatAnimationRef.current.kill()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="text-center select-none">
        <Canvas
          style={{ width: "550px", height: "100vh" }}
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={2} />
            <directionalLight position={[5, 5, 5]} intensity={3} />
            <directionalLight position={[-5, -5, -5]} intensity={2} />
            <pointLight position={[0, 5, 0]} intensity={2} />
            {/* Center wrapper for automatic model centering */}
            <Center>
              <TuxModel ref={modelRef} scale={0.05} />
            </Center>
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
