"use client"

import { useEffect, useRef, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Center } from "@react-three/drei"
import gsap from "gsap"
import TuxModel from "./TuxModel"
import * as THREE from "three"

interface HeroTextProps {
  startAnimation?: boolean
}

export default function HeroText({ startAnimation = true }: HeroTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<THREE.Group>(null)
  const isNearRef = useRef(false)
  const idleAnimationRef = useRef<gsap.core.Timeline | null>(null)
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isAnimatingRef = useRef(false)
  const initializedRef = useRef(false)
  const hoverCountRef = useRef(0)

  useEffect(() => {
    // Don't start animations until splash is complete
    if (!startAnimation) return

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
          onComplete: startIdleCycle,
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

      // ==========================================
      // IDLE ANIMATION SYSTEM (3 animations, 5-sec cycle)
      // ==========================================

      // Idle Animation 1: Look Around
      function playIdleAnimation1() {
        if (!model) return
        return gsap.timeline()
          .to(model.rotation, { y: 0.4, duration: 1, ease: "sine.inOut" })
          .to({}, { duration: 0.3 })
          .to(model.rotation, { y: -0.4, duration: 1.2, ease: "sine.inOut" })
          .to({}, { duration: 0.3 })
          .to(model.rotation, { y: 0, duration: 0.8, ease: "sine.inOut" })
      }

      // Idle Animation 2: Waddle
      function playIdleAnimation2() {
        if (!model) return
        return gsap.timeline()
          .to(model.rotation, { z: 0.1, duration: 0.3, ease: "sine.inOut" })
          .to(model.rotation, { z: -0.1, duration: 0.3, ease: "sine.inOut" })
          .to(model.rotation, { z: 0.08, duration: 0.25, ease: "sine.inOut" })
          .to(model.rotation, { z: -0.08, duration: 0.25, ease: "sine.inOut" })
          .to(model.rotation, { z: 0.05, duration: 0.2, ease: "sine.inOut" })
          .to(model.rotation, { z: -0.05, duration: 0.2, ease: "sine.inOut" })
          .to(model.rotation, { z: 0, duration: 0.2, ease: "sine.out" })
      }

      // Idle Animation 3: Curious Tilt
      function playIdleAnimation3() {
        if (!model) return
        return gsap.timeline()
          .to(model.rotation, { z: 0.2, x: 0.1, duration: 0.5, ease: "power2.out" })
          .to({}, { duration: 0.8 })
          .to(model.rotation, { z: 0, x: 0, duration: 0.4, ease: "power2.inOut" })
          .to({}, { duration: 0.2 })
          .to(model.rotation, { z: -0.15, x: 0.05, duration: 0.4, ease: "power2.out" })
          .to({}, { duration: 0.5 })
          .to(model.rotation, { z: 0, x: 0, duration: 0.3, ease: "power2.in" })
      }

      // Play random idle animation
      function playRandomIdleAnimation() {
        if (!model || isAnimatingRef.current) return

        isAnimatingRef.current = true
        const animations = [playIdleAnimation1, playIdleAnimation2, playIdleAnimation3]
        const randomIndex = Math.floor(Math.random() * animations.length)

        idleAnimationRef.current = animations[randomIndex]()!
        idleAnimationRef.current.eventCallback("onComplete", () => {
          isAnimatingRef.current = false
          // Schedule next idle cycle
          scheduleNextIdleAnimation()
        })
      }

      // Schedule the next idle animation after 5 seconds
      function scheduleNextIdleAnimation() {
        if (idleTimeoutRef.current) {
          clearTimeout(idleTimeoutRef.current)
        }
        idleTimeoutRef.current = setTimeout(() => {
          if (!isNearRef.current && !isAnimatingRef.current) {
            playRandomIdleAnimation()
          }
        }, 2000)
      }

      
      // Start the idle cycle
      function startIdleCycle() {
        if (!model || isAnimatingRef.current) return
        scheduleNextIdleAnimation()
      }

      // Stop all idle animations
      function stopIdleCycle() {
        if (idleTimeoutRef.current) {
          clearTimeout(idleTimeoutRef.current)
          idleTimeoutRef.current = null
        }
        if (idleAnimationRef.current) {
          idleAnimationRef.current.kill()
          idleAnimationRef.current = null
          isAnimatingRef.current = false
        }
        // Reset model position
        if (model) {
          gsap.to(model.rotation, { x: 0, y: 0, z: 0, duration: 0.2 })
        }
      }

      // ==========================================
      // HOVER ANIMATION SYSTEM (2 animations, alternating)
      // ==========================================

      // Hover Animation 1: Jump Spin
      function triggerHoverAnimation1() {
        if (!model) return
        return gsap.timeline()
          // Jump up
          .to(model.position, { y: 0.6, duration: 0.4, ease: "power2.out" })
          // Spin 360° during jump (slower so you can see it)
          .to(model.rotation, { y: Math.PI * 2, duration: 1.0, ease: "power1.inOut" }, "<")
          // Land with bounce
          .to(model.position, { y: 0, duration: 0.6, ease: "bounce.out" }, "-=0.4")
      }

      // Hover Animation 2: Excited Hop with Head Shake
      function triggerHoverAnimation2() {
        if (!model) return
        return gsap.timeline()
          // Small hop
          .to(model.position, { y: 0.3, duration: 0.25, ease: "power2.out" })
          // Head shake during hop (slower so you can see it)
          .to(model.rotation, { y: 0.4, duration: 0.15, ease: "power1.inOut" }, "<")
          .to(model.rotation, { y: -0.4, duration: 0.15, ease: "power1.inOut" })
          .to(model.rotation, { y: 0.25, duration: 0.12, ease: "power1.inOut" })
          .to(model.rotation, { y: -0.25, duration: 0.12, ease: "power1.inOut" })
          .to(model.rotation, { y: 0, duration: 0.1, ease: "power1.out" })
          // Land
          .to(model.position, { y: 0, duration: 0.5, ease: "bounce.out" }, "-=0.2")
          // Excited lean forward
          .to(model.rotation, { x: 0.2, duration: 0.25, ease: "power2.out" }, "-=0.2")
          .to(model.rotation, { x: 0, duration: 0.35, ease: "power2.inOut" })
      }

      // Trigger alternating hover animation
      function triggerHoverAnimation() {
        if (!model || isAnimatingRef.current) return

        isAnimatingRef.current = true
        stopIdleCycle()

        // Alternate between animations based on hover count
        const isEvenHover = hoverCountRef.current % 2 === 0
        hoverCountRef.current++

        const timeline = isEvenHover ? triggerHoverAnimation1() : triggerHoverAnimation2()

        timeline!.eventCallback("onComplete", () => {
          // Reset rotation for clean state
          model.rotation.y = 0
          isAnimatingRef.current = false
          // Resume idle cycle if mouse is no longer near
          if (!isNearRef.current) {
            startIdleCycle()
          }
        })
      }

      // ==========================================
      // MOUSE INTERACTION
      // ==========================================

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

        // Magnetic effect when within 200px
        const maxDistance = 200
        if (distance < maxDistance) {
          if (!isNearRef.current) {
            isNearRef.current = true
            stopIdleCycle()
            triggerHoverAnimation() // Play hover animation when mouse enters zone
          }

          // Only apply magnetic effect when NOT animating
          if (!isAnimatingRef.current) {
            const strength = 1 - distance / maxDistance
            // Convert mouse position to rotation
            const rotateY = (deltaX / maxDistance) * strength * 0.5
            const rotateX = -(deltaY / maxDistance) * strength * 0.5

            rotationYTo(rotateY)
            rotationXTo(rotateX)
          }
        } else {
          if (isNearRef.current) {
            isNearRef.current = false
            rotationYTo(0)
            rotationXTo(0)
            // Restart idle cycle after mouse leaves
            if (!isAnimatingRef.current) {
              setTimeout(startIdleCycle, 600)
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
      if (idleAnimationRef.current) {
        idleAnimationRef.current.kill()
      }
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current)
      }
    }
  }, [startAnimation])

  return (
    <div
      ref={containerRef}
      className="absolute bottom-10 left-5"
    >
      <div className="select-none">
        <Canvas
          style={{ width: "400px", height: "450px" }}
          camera={{ position: [0, 0, 12], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={2} />
            <directionalLight position={[5, 5, 5]} intensity={3} />
            <directionalLight position={[-5, -5, -5]} intensity={2} />
            <pointLight position={[0, 7, 0]} intensity={2} />
            {/* Center wrapper for automatic model centering */}
            <Center>
              <TuxModel ref={modelRef} scale={0.06} />
            </Center>
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
