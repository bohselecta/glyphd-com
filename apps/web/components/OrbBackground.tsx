'use client'
import { useEffect, useRef, useState } from 'react'

export default function OrbBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const drawOrb = () => {
      const { width, height } = canvas
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      // Calculate hover offset based on mouse position (intensity 3.5)
      const hoverIntensity = 3.5
      const mouseX = mousePos.x
      const mouseY = mousePos.y
      const centerX = width * 0.5
      const centerY = height * 0.3
      
      const offsetX = ((mouseX - centerX) / width) * hoverIntensity * 40
      const offsetY = ((mouseY - centerY) / height) * hoverIntensity * 40
      
      // Add subtle animation
      const time = Date.now() * 0.0005
      const animX = Math.sin(time) * 20
      const animY = Math.cos(time * 0.7) * 15
      
      const finalX = centerX + offsetX + animX
      const finalY = centerY + offsetY + animY
      
      // Create gradient with hue shift (321 degrees)
      const hueShift = 321
      const baseHue = 321 // Pink hue
      const shiftedHue = (baseHue + (offsetX * 0.5)) % 360
      
      // Convert HSV to RGB for the primary color
      const h = shiftedHue / 360
      const s = 1
      const v = 1
      
      const c = v * s
      const x = c * (1 - Math.abs((h * 6) % 2 - 1))
      const m = v - c
      
      let r = 0, g = 0, b = 0
      if (h < 1/6) { r = c; g = x; b = 0 }
      else if (h < 2/6) { r = x; g = c; b = 0 }
      else if (h < 3/6) { r = 0; g = c; b = x }
      else if (h < 4/6) { r = 0; g = x; b = c }
      else if (h < 5/6) { r = x; g = 0; b = c }
      else { r = c; g = 0; b = x }
      
      const primaryR = Math.round((r + m) * 255)
      const primaryG = Math.round((g + m) * 255)
      const primaryB = Math.round((b + m) * 255)
      
      // Create gradient with shifted colors
      const gradient = ctx.createRadialGradient(
        finalX, finalY, 0,
        finalX, finalY, width * 0.8
      )
      
      gradient.addColorStop(0, `rgba(${primaryR}, ${primaryG}, ${primaryB}, 0.8)`)
      gradient.addColorStop(0.3, 'rgba(51, 255, 242, 0.6)') // Cyan
      gradient.addColorStop(0.6, `rgba(${primaryR}, ${primaryG}, ${primaryB}, 0.3)`)
      gradient.addColorStop(1, 'rgba(11, 12, 16, 0.1)')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(finalX, finalY, width * 0.4, 0, Math.PI * 2)
      ctx.fill()
      
      animationId = requestAnimationFrame(drawOrb)
    }

    resizeCanvas()
    drawOrb()
    window.addEventListener('mousemove', handleMouseMove)

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [mousePos])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full orb-canvas"
    />
  )
}
