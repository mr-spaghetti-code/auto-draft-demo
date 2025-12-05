import { useState, useCallback, useEffect, useRef } from 'react'
import { useSellerPreferences } from '../hooks/useSellerPreferences'

// Skeleton loader for individual card
function CardSkeleton() {
  return (
    <div className="flex-shrink-0 w-full px-1">
      <div className="bg-gray-100 rounded-lg p-4 h-[200px] animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
        </div>
      </div>
    </div>
  )
}

// Individual draft card
function DraftCard({ draft, index, isActive, onClick }) {
  const labels = ['Concise', 'Detailed', 'Warm']
  const icons = ['⚡', '📝', '💬']
  
  // Truncate text for preview (~350 chars fits well in 200px card)
  const preview = draft.length > 350 ? draft.slice(0, 350) + '...' : draft

  return (
    <div className="flex-shrink-0 w-full px-1">
      <button
        onClick={onClick}
        className={`
          w-full text-left rounded-lg p-4 h-[200px] transition-all duration-150
          border-2 cursor-pointer overflow-hidden
          ${isActive 
            ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20' 
            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
          }
        `}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">{icons[index]}</span>
          <span className={`text-xs font-medium ${isActive ? 'text-teal-700' : 'text-gray-500'}`}>
            {labels[index]}
          </span>
          {isActive && (
            <span className="ml-auto text-xs text-teal-600 font-medium">Selected</span>
          )}
        </div>
        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isActive ? 'text-teal-900' : 'text-gray-600'}`}>
          {preview}
        </p>
      </button>
    </div>
  )
}

export default function DraftCarousel({ 
  candidates, 
  isLoading, 
  error,
  onSelect, 
  onRegenerate,
  selectedIndex,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showPreferencesPopover, setShowPreferencesPopover] = useState(false)
  const [tempPreferences, setTempPreferences] = useState('')
  const preferencesInputRef = useRef(null)
  const popoverRef = useRef(null)
  
  const { preferences, setPreferences } = useSellerPreferences()

  // Focus textarea when popover opens
  useEffect(() => {
    if (showPreferencesPopover && preferencesInputRef.current) {
      setTempPreferences(preferences)
      preferencesInputRef.current.focus()
    }
  }, [showPreferencesPopover, preferences])

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showPreferencesPopover && popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowPreferencesPopover(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPreferencesPopover])

  const handleSavePreferences = useCallback(() => {
    setPreferences(tempPreferences)
    setShowPreferencesPopover(false)
  }, [tempPreferences, setPreferences])

  const handlePreferencesKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowPreferencesPopover(false)
    }
  }, [])

  const handleSelect = useCallback((index) => {
    setActiveIndex(index)
    onSelect?.(candidates[index], index)
  }, [candidates, onSelect])

  const handlePrev = useCallback(() => {
    setActiveIndex(prev => (prev > 0 ? prev - 1 : candidates.length - 1))
  }, [candidates.length])

  const handleNext = useCallback(() => {
    setActiveIndex(prev => (prev < candidates.length - 1 ? prev + 1 : 0))
  }, [candidates.length])

  // Loading state
  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <span className="text-xs text-gray-500">Generating drafts...</span>
        </div>
        {!isCollapsed && (
          <div className="relative">
            <div className="flex gap-2">
              <CardSkeleton />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="mb-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
          <p className="mb-2">{error}</p>
          <button
            onClick={onRegenerate}
            className="text-red-700 hover:text-red-800 underline text-xs"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // Empty state - no candidates yet
  if (!candidates || candidates.length === 0) {
    return null
  }

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide hover:text-gray-700 transition-colors group"
          >
            <svg 
              className={`w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            ✨ AI Suggestions
            {isCollapsed && (
              <span className="text-gray-400 font-normal normal-case tracking-normal">
                ({candidates.length} available)
              </span>
            )}
          </button>
          
          {/* Settings icon for seller preferences */}
          <div className="relative" ref={popoverRef}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowPreferencesPopover(!showPreferencesPopover)
              }}
              className={`p-1 rounded transition-colors ${
                preferences 
                  ? 'text-teal-500 hover:text-teal-600 hover:bg-teal-50' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Seller preferences"
              title="Customize AI with your seller policies"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
            {/* Preferences popover */}
            {showPreferencesPopover && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">Seller Preferences</h3>
                  <button
                    onClick={() => setShowPreferencesPopover(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Add your store policies and preferences. The AI will consider these when generating responses.
                </p>
                <textarea
                  ref={preferencesInputRef}
                  value={tempPreferences}
                  onChange={(e) => setTempPreferences(e.target.value)}
                  onKeyDown={handlePreferencesKeyDown}
                  placeholder="Examples:&#10;- Refund threshold: $50 without questions&#10;- No expedited shipping on weekends&#10;- Always offer 10% discount for repeat customers&#10;- Escalate orders over $500 to manager"
                  className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-gray-400"
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => setShowPreferencesPopover(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-3 py-1.5 text-xs rounded-md font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            {/* Navigation dots */}
            <div className="flex items-center gap-1.5">
              {candidates.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-150
                    ${i === activeIndex 
                      ? 'bg-teal-500 w-4' 
                      : 'bg-gray-300 hover:bg-gray-400'
                    }
                  `}
                  aria-label={`Go to draft ${i + 1}`}
                />
              ))}
            </div>
            {/* Prev/Next arrows */}
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={handlePrev}
                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Previous draft"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Next draft"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Collapsible content */}
      <div 
        className={`
          overflow-hidden transition-all duration-300 ease-out
          ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[300px] opacity-100'}
        `}
      >
        {/* Carousel container */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {candidates.map((draft, index) => (
              <DraftCard
                key={index}
                draft={draft}
                index={index}
                isActive={selectedIndex === index}
                onClick={() => handleSelect(index)}
              />
            ))}
          </div>
        </div>

        {/* Regenerate link */}
        <div className="flex justify-center mt-3">
          <button
            onClick={onRegenerate}
            className="text-xs text-gray-400 hover:text-teal-600 transition-colors"
          >
            Regenerate suggestions
          </button>
        </div>
      </div>
    </div>
  )
}

