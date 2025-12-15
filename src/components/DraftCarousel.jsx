import { useState, useCallback, useEffect } from 'react'
import FeedbackModal from './FeedbackModal'

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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

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

          {/* Report AI Issue button */}
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="p-1 rounded text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            aria-label="Report AI issue"
            title="Report AI issue (hallucination, wrong tone, etc.)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </button>
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

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  )
}

