"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from 'lucide-react'
import Link from 'next/link'

interface CardData {
  title: string
  description: string
}

const cards: CardData[] = [
  { title: "Web Development", description: "Creating responsive and interactive websites" },
  { title: "UI/UX Design", description: "Crafting beautiful and intuitive user interfaces" },
  { title: "Mobile Apps", description: "Developing cross-platform mobile applications" },
  { title: "Data Analysis", description: "Extracting insights from complex datasets" },
]

export default function FloatingCards() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <div className="bg-yellow-400 text-black p-2 text-center">
        This website will be removed soon from the internet, please check out our main website which is{' '}
        <Link href="https://t8project.link" className="underline font-semibold">
          t8project.link
        </Link>
      </div>
      <div className="flex-grow p-4 sm:p-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8 sm:mb-12 text-center" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
          T8Project.xyz
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl w-full mb-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FloatingCard
                title={card.title}
                description={card.description}
              />
            </motion.div>
          ))}
        </div>
        <Link href="mailto:maksimas@t8project.link" className="flex items-center text-white hover:text-yellow-400 transition-colors">
          <Mail className="mr-2" />
          <span>Contact me by email!</span>
        </Link>
      </div>
    </div>
  )
}

function FloatingCard({ title, description }: CardData) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useSpring(0, { stiffness: 300, damping: 30 })
  const y = useSpring(0, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(y, [-50, 50], [5, -5])
  const rotateY = useTransform(x, [-50, 50], [-5, 5])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current && isHovered) {
        const rect = cardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const moveX = (e.clientX - centerX) / 10
        const moveY = (e.clientY - centerY) / 10

        x.set(moveX)
        y.set(moveY)
      }
    }

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isHovered, x, y])

  return (
    <motion.div
      ref={cardRef}
      style={{
        perspective: 1000,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        x.set(0)
        y.set(0)
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          x,
          y,
        }}
        animate={{
          y: isHovered ? -10 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Card className="relative h-full bg-white/10 backdrop-blur-md border-none text-white shadow-xl transition-all duration-300 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-0 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              opacity: isHovered ? 0.6 : 0,
              filter: 'blur(20px)',
              transform: 'scale(1.2)',
            }}
          />
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <CardDescription className="text-gray-300 text-sm sm:text-base">{description}</CardDescription>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
