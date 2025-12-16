import { useState, useCallback } from 'react'
import FeedbackModal from './FeedbackModal'

// Skeleton loader for individual card
function CardSkeleton() {
  return (
    <div className="w-full">
      <div className="bg-gray-100 rounded-lg p-4 h-[200px] animate-pulse">
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
function DraftCard({ draft, isActive, onClick }) {
  // Truncate text for preview (~350 chars fits well in 200px card)
  const preview = draft.length > 350 ? draft.slice(0, 350) + '...' : draft

  return (
    <div className="w-full">
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
        {isActive && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-teal-600 font-medium">Selected</span>
          </div>
        )}
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
  onOpenSettings,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const handleSelect = useCallback(() => {
    onSelect?.(candidates[0], 0)
  }, [candidates, onSelect])

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
          <span className="text-xs text-gray-500">Generating draft...</span>
        </div>
        {!isCollapsed && (
          <div className="relative">
            <CardSkeleton />
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
            ✨ Inbox Agent Suggestion
          </button>

          {/* Refresh button */}
          <button
            onClick={onRegenerate}
            className="p-1 rounded text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
            aria-label="Regenerate suggestion"
            title="Regenerate suggestion"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
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

        {/* AI Settings button - right side */}
        <button
          onClick={onOpenSettings}
          className="p-1 rounded text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
          aria-label="Inbox Agent Settings"
          title="Inbox Agent Settings"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Collapsible content */}
      <div 
        className={`
          overflow-hidden transition-all duration-300 ease-out
          ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[300px] opacity-100'}
        `}
      >
        {/* Single draft card */}
        <DraftCard
          draft={candidates[0]}
          isActive={selectedIndex === 0}
          onClick={handleSelect}
        />
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  )
}
