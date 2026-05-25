import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function Sidebar({ glRef, materials, materialColors, onColorChange, open, onToggle }) {
  const barRef = useRef()

  useEffect(() => {
    gsap.to(barRef.current, {
      x: open ? 0 : '100%',
      duration: 0.4,
      ease: 'power3.out',
    })
  }, [open])

  const handleScreenshot = () => {
    if (!glRef?.current) return
    glRef.current.domElement.toBlob((blob) => {
      const link = document.createElement('a')
      link.download = `shoe-${Date.now()}.png`
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
    }, 'image/png')
  }

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors text-white/70"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          </svg>
        )}
      </button>

      <div
        ref={barRef}
        className="fixed top-0 right-0 h-full w-72 z-40 bg-black/60 backdrop-blur-xl border-l border-white/5 translate-x-full overflow-y-auto"
      >
        <div className="pt-16 px-5 pb-8">
          <h2 className="text-white/60 text-[10px] font-mono tracking-[0.3em] uppercase mb-6">
            Editor de materiales
          </h2>

          {!materials || materials.length === 0 ? (
            <p className="text-white/20 text-xs font-mono">Cargando materiales...</p>
          ) : (
            <div className="space-y-4">
              {materials.map((mat) => (
                <div key={mat.name} className="space-y-1.5">
                  <label className="flex items-center justify-between text-white/50 text-[10px] font-mono tracking-wider uppercase">
                    <span>{mat.name}</span>
                    <span className="text-white/20">{materialColors[mat.name] || mat.color}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={materialColors[mat.name] || mat.color}
                      onChange={(e) => onColorChange(mat.name, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0"
                    />
                    <input
                      type="text"
                      value={materialColors[mat.name] || mat.color}
                      onChange={(e) => onColorChange(mat.name, e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white/70 text-xs font-mono outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/5">
            <button
              onClick={handleScreenshot}
              className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white/70 text-xs font-mono tracking-wider uppercase cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 4h2a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2m4-1v4m-2-2h4" />
              </svg>
              Descargar screenshot
            </button>
          </div>

          {materials && materials.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  const defaults = {}
                  materials.forEach((m) => { defaults[m.name] = m.color })
                  onColorChange('__reset__', defaults)
                }}
                className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white/30 text-[10px] font-mono tracking-wider uppercase cursor-pointer transition-colors"
              >
                Reset colores
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
