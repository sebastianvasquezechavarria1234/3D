import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

const COLORS = [
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Orange', hex: '#f97316' },
]

export default function ColorPalette({ selected, onSelect }) {
  const barRef = useRef()

  useEffect(() => {
    gsap.from(barRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: 'power3.out',
    })
  }, [])

  return (
    <div
      ref={barRef}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10"
    >
      {COLORS.map((c) => (
        <button
          key={c.hex}
          title={c.name}
          onClick={() => onSelect(c.hex)}
          className={`w-6 h-6 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 active:scale-95 ${
            selected === c.hex
              ? 'ring-2 ring-white scale-110 shadow-lg shadow-white/20'
              : 'ring-1 ring-white/20 hover:ring-white/40'
          }`}
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  )
}

export { COLORS }
