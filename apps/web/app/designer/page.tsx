'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface ImagePlan {
  id: string
  description: string
  type: 'hero' | 'logo' | 'gallery' | 'icon' | 'feature'
  layout?: string
}

interface Section {
  id: string
  name: string
  description?: string
  schemaType?: string
}

export default function PlannerPage() {
  const searchParams = useSearchParams()
  const [idea, setIdea] = useState('An e-commerce page for a neon desert jacket with sizes and colors, free shipping, and 30-day returns.')
  const [autoPlanner, setAutoPlanner] = useState(true) // Default: enabled (checked = greyed out mode)
  const [schemas, setSchemas] = useState<string[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [newSectionName, setNewSectionName] = useState('')
  const [newSectionDesc, setNewSectionDesc] = useState('')
  const [imagePlans, setImagePlans] = useState<ImagePlan[]>([])
  const [newImageDesc, setNewImageDesc] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [message, setMessage] = useState('')

  // Override auto-planner from URL param when homepage toggle is set
  useEffect(() => {
    const autoParam = searchParams.get('auto')
    if (autoParam === 'true' || autoParam === 'false') {
      setAutoPlanner(autoParam === 'true')
      // If auto-planner is enabled from homepage, trigger auto analysis
      if (autoParam === 'true' && idea) {
        setIsAnalyzing(true)
        fetch('/api/designer/map', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ intent: idea }) 
        })
        .then(r => r.json())
        .then(data => {
          setSchemas(data.schemas || [])
          const suggestedImages: ImagePlan[] = []
          if (data.schemas.includes('Product')) {
            suggestedImages.push({ id: '1', description: 'Hero product showcase with neon gradient background', type: 'hero' })
          }
          if (data.schemas.includes('Offer') || data.schemas.includes('Product')) {
            suggestedImages.push({ id: '2', description: 'Product gallery with size/color variants', type: 'gallery' })
          }
          if (data.schemas.includes('Organization')) {
            suggestedImages.push({ id: '3', description: 'Brand logo with neon accent', type: 'logo' })
          }
          if (data.schemas.includes('AggregateRating')) {
            suggestedImages.push({ id: '4', description: 'Customer testimonial photos', type: 'gallery' })
          }
          setImagePlans(suggestedImages)
        })
        .catch(err => console.error('Analysis failed:', err))
        .finally(() => setIsAnalyzing(false))
      }
    }
  }, [searchParams, idea])

  async function analyze() {
    setIsAnalyzing(true)
    try {
      const r = await fetch('/api/designer/map', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ intent: idea }) 
      })
      const data = await r.json()
      
      if (autoPlanner) {
        // Auto-plan schemas
        setSchemas(data.schemas || [])
        
        // Auto-plan images based on schemas
        const suggestedImages: ImagePlan[] = []
        if (data.schemas.includes('Product')) {
          suggestedImages.push({ id: '1', description: 'Hero product showcase with neon gradient background', type: 'hero' })
        }
        if (data.schemas.includes('Offer') || data.schemas.includes('Product')) {
          suggestedImages.push({ id: '2', description: 'Product gallery with size/color variants', type: 'gallery' })
        }
        if (data.schemas.includes('Organization')) {
          suggestedImages.push({ id: '3', description: 'Brand logo with neon accent', type: 'logo' })
        }
        if (data.schemas.includes('AggregateRating')) {
          suggestedImages.push({ id: '4', description: 'Customer testimonial photos', type: 'gallery' })
        }
        
        setImagePlans(suggestedImages)
      } else {
        setSchemas(data.schemas || [])
      }
    } catch (err: any) {
      console.error('Analysis failed:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  function addImage() {
    if (!newImageDesc.trim()) return
    const newPlan: ImagePlan = {
      id: Date.now().toString(),
      description: newImageDesc,
      type: 'gallery' // Default, user can change
    }
    setImagePlans([...imagePlans, newPlan])
    setNewImageDesc('')
  }

  async function workIntoDesign() {
    try {
      // Analyze images and create a layout plan
      const plan = {
        imageCount: imagePlans.length,
        images: imagePlans.map(img => ({
          type: img.type,
          description: img.description,
          suggestedPlacement: getPlacementForType(img.type),
          priority: getPriorityForType(img.type)
        })),
        layout: generateLayoutPlan(imagePlans)
      }
      
      // Show layout preview
      const layoutPreview = `✓ Layout planned: ${imagePlans.length} images will be placed as follows:\n${plan.layout}\n\nReady to build? Click "Create this Mark" below.`
      
      // Update idea to include the plan for better context
      const enhancedIdea = `${idea}\n\nImage Plan:\n${plan.layout}`
      
      setMessage(layoutPreview)
    } catch (err: any) {
      setMessage('Error: ' + err.message)
    }
  }

  function getPlacementForType(type: string): string {
    const placement: Record<string, string> = {
      hero: 'Top of page, full width',
      logo: 'Header, top-left corner',
      gallery: 'Product section, grid layout',
      icon: 'Feature cards, inline',
      feature: 'Highlight sections, alternating'
    }
    return placement[type] || 'Integrated into content'
  }

  function getPriorityForType(type: string): string {
    return ['hero', 'logo'].includes(type) ? 'high' : 'medium'
  }

  function generateLayoutPlan(images: ImagePlan[]): string {
    const plan: string[] = []
    images.forEach((img, i) => {
      plan.push(`${i + 1}. ${img.type.charAt(0).toUpperCase() + img.type.slice(1)}: ${img.description}`)
      plan.push(`   → Placement: ${getPlacementForType(img.type)}`)
    })
    return plan.join('\n')
  }

  return (
    <main className="min-h-dvh p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Plan This Idea</h1>
          <div className="ml-auto flex items-center gap-3">
            <label className="text-sm text-neutral-400 flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={autoPlanner}
                onChange={e => setAutoPlanner(e.target.checked)}
                className="rounded"
              />
              Use AI plan (uncheck for advanced)
            </label>
            <a href="/" className="text-sm text-neutral-400 hover:text-white">← Back</a>
          </div>
        </div>

        {/* Idea Input */}
        <div className="glass p-4 space-y-3">
          <label className="text-ui text-text-secondary font-medium">Enter your idea</label>
          <textarea 
            className="w-full bg-transparent outline-none border border-white/10 rounded-xl px-3 py-2"
            rows={3} 
            value={idea} 
            onChange={e => setIdea(e.target.value)} 
            placeholder="Describe what you want to build..."
          />
          <div className="flex items-center gap-4">
            <button 
              onClick={analyze} 
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50">
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-ui text-text-secondary">Mark Name:</span>
              <input
                type="text"
                className="text-sm font-mono bg-white/5 px-2 py-1 rounded outline-none border border-transparent hover:border-white/10 focus:border-white/20 w-32"
                placeholder="auto-generated"
              />
            </div>
          </div>
        </div>

        {/* Sections/Schemas Section */}
        {schemas.length > 0 && (
          <div className="glass p-4 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {autoPlanner ? '✨' : '📋'} Sections
            </h2>
            <div className={`flex flex-wrap gap-2 ${autoPlanner ? 'opacity-60' : ''}`}>
              {schemas.map((schema, i) => (
                <div key={i} className="px-3 py-1 bg-white/5 rounded-lg text-sm flex items-center gap-2">
                  <span>{schema}</span>
                  {!autoPlanner ? (
                    <button 
                      onClick={() => setSchemas(schemas.filter((_, idx) => idx !== i))}
                      className="text-neutral-400 hover:text-red-400"
                    >
                      ×
                    </button>
                  ) : (
                    <span className="text-green-400">✨</span>
                  )}
                </div>
              ))}
            </div>
            {autoPlanner && (
              <p className="text-xs text-neutral-400 mt-2">
                These sections have been automatically selected for optimal SEO and rich results.
              </p>
            )}
          </div>
        )}

        {/* Add Manual Section (only when auto-planner is unchecked - advanced mode) */}
        {!autoPlanner ? (
          <div className="glass p-4 space-y-3">
            <h3 className="text-ui font-medium text-text-primary">Add Section</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Section name (e.g., Pricing, Features, Gallery)"
                value={newSectionName}
                onChange={e => setNewSectionName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/20"
              />
              <textarea
                placeholder="Describe what this section contains..."
                value={newSectionDesc}
                onChange={e => setNewSectionDesc(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/20"
                rows={2}
              />
              <button
                onClick={async () => {
                  if (!newSectionName.trim()) return
                  const newSection = {
                    id: Date.now().toString(),
                    name: newSectionName,
                    description: newSectionDesc
                  }
                  // Analyze and match to schema
                  try {
                    const r = await fetch('/api/designer/map', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ intent: `${newSectionName}: ${newSectionDesc}` })
                    })
                    const data = await r.json()
                    if (data.schemas && data.schemas.length > 0) {
                      setSchemas([...schemas, ...data.schemas])
                    } else {
                      setSchemas([...schemas, newSectionName])
                    }
                  } catch (err) {
                    setSchemas([...schemas, newSectionName])
                  }
                  setNewSectionName('')
                  setNewSectionDesc('')
                }}
                className="btn-primary text-sm px-4 py-2"
              >
                + Add Section
              </button>
            </div>
          </div>
        ) : (
          <div className="glass p-4 space-y-3 opacity-50 pointer-events-none">
            <h3 className="text-ui font-medium text-text-secondary">Add Section</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Unlock advanced mode to add sections manually"
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
              />
              <textarea
                placeholder="Check the AI plan option above to enable..."
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                rows={2}
              />
              <button
                disabled
                className="btn-primary text-sm px-4 py-2 disabled:opacity-30"
              >
                + Add Section (unlock by unchecking AI plan)
              </button>
            </div>
          </div>
        )}

        {/* Image Planning Section */}
        {imagePlans.length > 0 && (
          <div className="glass p-4 space-y-3">
            <h2 className="text-h3 font-semibold text-text-primary flex items-center gap-2">
              🖼️ Image Plan
            </h2>
            <div className="space-y-2">
              {imagePlans.map(plan => (
                <div key={plan.id} className="flex items-start justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-caption px-2 py-0.5 bg-white/10 rounded">
                        {plan.type}
                      </span>
                      <span className="text-ui text-text-secondary">{plan.description}</span>
                    </div>
                    {plan.layout && (
                      <div className="text-xs text-neutral-500 mt-1">
                        Layout: {plan.layout}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setImagePlans(imagePlans.filter(p => p.id !== plan.id))}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Image */}
        <div className="glass p-4 space-y-3">
          <label className="text-sm text-neutral-400">Add custom image</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none border border-white/10 rounded-xl px-3 py-2 text-sm"
              placeholder="Describe the image you want to add..."
              value={newImageDesc}
              onChange={e => setNewImageDesc(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addImage()}
            />
            <button 
              onClick={addImage}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 flex items-center gap-1 text-sm">
              + Add
            </button>
          </div>
        </div>

        {/* Work Into Design Button */}
        {imagePlans.length > 0 && (
          <div className="glass p-4 space-y-3">
            <button 
              onClick={workIntoDesign}
              className="w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-medium">
              Work these into my design →
            </button>
            <p className="text-xs text-neutral-400">
              This will analyze your images and suggest optimal placement and layout within your design.
            </p>
          </div>
        )}

        {/* Prompt to Create */}
        <div className="glass p-4 text-center space-y-3">
          <p className="text-sm text-neutral-400">Ready to build this idea?</p>
          <button
            onClick={() => {
              const slug = idea.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').substring(0, 30)
              const prompt = idea + (imagePlans.length > 0 ? `\n\nWith ${imagePlans.length} custom images` : '')
              window.location.href = `/build?prompt=${encodeURIComponent(prompt)}&slug=${encodeURIComponent(slug)}`
            }}
            className="btn-primary inline-block"
          >
            Create this Mark →
          </button>
          {message && (
            <div className="glass p-3 mt-3 text-left text-xs text-neutral-300 whitespace-pre-wrap">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
