'use client'
import { useEffect, useRef } from 'react'

export default function OrbBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    const drawOrb = () => {
      const { width, height } = canvas
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      // Create gradient for orb
      const gradient = ctx.createRadialGradient(
        width * 0.5, height * 0.3, 0,
        width * 0.5, height * 0.3, width * 0.8
      )
      
      // Add gradient stops with your brand colors
      gradient.addColorStop(0, 'rgba(255, 45, 170, 0.8)') // --accent-pink
      gradient.addColorStop(0.3, 'rgba(51, 255, 242, 0.6)') // --accent-cyan
      gradient.addColorStop(0.6, 'rgba(255, 45, 170, 0.3)')
      gradient.addColorStop(1, 'rgba(11, 12, 16, 0.1)') // --background
      
      // Draw orb
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(width * 0.5, height * 0.3, width * 0.4, 0, Math.PI * 2)
      ctx.fill()
      
      // Add subtle animation
      const time = Date.now() * 0.0005
      const offsetX = Math.sin(time) * 20
      const offsetY = Math.cos(time * 0.7) * 15
      
      // Redraw with slight movement
      ctx.clearRect(0, 0, width, height)
      
      const animatedGradient = ctx.createRadialGradient(
        width * 0.5 + offsetX, height * 0.3 + offsetY, 0,
        width * 0.5 + offsetX, height * 0.3 + offsetY, width * 0.8
      )
      
      animatedGradient.addColorStop(0, 'rgba(255, 45, 170, 0.8)')
      animatedGradient.addColorStop(0.3, 'rgba(51, 255, 242, 0.6)')
      animatedGradient.addColorStop(0.6, 'rgba(255, 45, 170, 0.3)')
      animatedGradient.addColorStop(1, 'rgba(11, 12, 16, 0.1)')
      
      ctx.fillStyle = animatedGradient
      ctx.beginPath()
      ctx.arc(width * 0.5 + offsetX, height * 0.3 + offsetY, width * 0.4, 0, Math.PI * 2)
      ctx.fill()
      
      animationId = requestAnimationFrame(drawOrb)
    }

    resizeCanvas()
    drawOrb()

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full orb-canvas"
    />
  )
}
