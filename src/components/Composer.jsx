import { useRef, useEffect, useCallback, useState } from 'react'
import { useDraftCandidates } from '../hooks/useDraftCandidates'
import { useSellerPreferences } from '../hooks/useSellerPreferences'
import DraftCarousel from './DraftCarousel'

export default function Composer({ caseData, onSend, onOpenSettings }) {
  const textareaRef = useRef(null)
  const improveInputRef = useRef(null)
  const [draftContent, setDraftContent] = useState('')
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(null)
  const [showImprovePopover, setShowImprovePopover] = useState(false)
  const [improveInstruction, setImproveInstruction] = useState('')
  const [isImproving, setIsImproving] = useState(false)
  const [previousDraftContent, setPreviousDraftContent] = useState(null)
  
  const { preferences: sellerPreferences } = useSellerPreferences()
  
  const {
    candidates,
    isLoading,
    error,
    hasGenerated,
    generateCandidates,
    regenerateCandidates,
  } = useDraftCandidates(caseData.id)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    // Reset height to calculate proper scrollHeight
    textarea.style.height = 'auto'
    // Set height with min (3 lines ~72px) and max (~192px for 8 lines)
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 72), 192)
    textarea.style.height = `${newHeight}px`
  }, [draftContent])

  // Clear draft content and selection when case changes
  useEffect(() => {
    setDraftContent('')
    setSelectedCandidateIndex(null)
    setPreviousDraftContent(null)
  }, [caseData.id])

  // Auto-generate candidates when opening a new thread (only if not already generated)
  useEffect(() => {
    if (!hasGenerated && !isLoading) {
      generateCandidates(caseData, sellerPreferences)
    }
  }, [caseData.id, hasGenerated, isLoading, generateCandidates, caseData, sellerPreferences])

  const handleCandidateSelect = useCallback((draft, index) => {
    setDraftContent(draft)
    setSelectedCandidateIndex(index)
    // Focus the textarea after selection
    textareaRef.current?.focus()
  }, [])

  const handleRegenerate = useCallback(() => {
    setSelectedCandidateIndex(null)
    regenerateCandidates(caseData, sellerPreferences)
  }, [caseData, regenerateCandidates, sellerPreferences])

  const handleSendClick = useCallback(() => {
    if (!draftContent.trim()) return
    onSend(draftContent.trim())
    setDraftContent('')
    setSelectedCandidateIndex(null)
    setPreviousDraftContent(null)
  }, [draftContent, onSend])

  const handleTextChange = useCallback((e) => {
    setDraftContent(e.target.value)
    // Clear selection when user manually edits
    if (selectedCandidateIndex !== null) {
      setSelectedCandidateIndex(null)
    }
  }, [selectedCandidateIndex])

  const handleKeyDown = useCallback((e) => {
    // Cmd/Ctrl + Enter to send
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && draftContent.trim()) {
      e.preventDefault()
      handleSendClick()
    }
  }, [draftContent, handleSendClick])

  // Focus improve input when popover opens
  useEffect(() => {
    if (showImprovePopover && improveInputRef.current) {
      improveInputRef.current.focus()
    }
  }, [showImprovePopover])

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showImprovePopover && !e.target.closest('.improve-popover-container')) {
        setShowImprovePopover(false)
        setImproveInstruction('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showImprovePopover])

  const handleImproveClick = useCallback(() => {
    if (!draftContent.trim()) return
    setShowImprovePopover(true)
  }, [draftContent])

  const handleImproveSubmit = useCallback(async () => {
    if (!improveInstruction.trim() || !draftContent.trim()) return
    
    setIsImproving(true)
    const contentBeforeImprove = draftContent
    try {
      const response = await fetch('/api/improve-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: draftContent,
          instruction: improveInstruction.trim()
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to improve text')
      }
      
      const data = await response.json()
      if (data.improvedText) {
        setPreviousDraftContent(contentBeforeImprove)
        setDraftContent(data.improvedText)
        setSelectedCandidateIndex(null)
      }
    } catch (err) {
      console.error('Error improving text:', err)
    } finally {
      setIsImproving(false)
      setShowImprovePopover(false)
      setImproveInstruction('')
      textareaRef.current?.focus()
    }
  }, [draftContent, improveInstruction])

  const handleRevertImprovement = useCallback(() => {
    if (previousDraftContent !== null) {
      setDraftContent(previousDraftContent)
      setPreviousDraftContent(null)
      textareaRef.current?.focus()
    }
  }, [previousDraftContent])

  const handleImproveKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleImproveSubmit()
    } else if (e.key === 'Escape') {
      setShowImprovePopover(false)
      setImproveInstruction('')
    }
  }, [handleImproveSubmit])

  const canSend = draftContent.trim().length > 0
  const canImprove = draftContent.trim().length > 0

  return (
    <div className="px-6 py-4 bg-white border-t border-gray-200 flex-shrink-0">
      {/* Draft Carousel */}
      <DraftCarousel
        candidates={candidates}
        isLoading={isLoading}
        error={error}
        onSelect={handleCandidateSelect}
        onRegenerate={handleRegenerate}
        selectedIndex={selectedCandidateIndex}
        onOpenSettings={onOpenSettings}
      />

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={draftContent}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Write your response..."
          className="
            w-full resize-none rounded-lg border border-gray-300 
            bg-white px-4 py-3 text-sm text-gray-800
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
            transition-all
          "
          style={{ minHeight: '72px', maxHeight: '192px' }}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-400">
          {canSend && <span>⌘ + Enter to send</span>}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Revert button - only shows after an improvement was applied */}
          {previousDraftContent !== null && (
            <button
              onClick={handleRevertImprovement}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300 border border-gray-200"
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Revert
              </span>
            </button>
          )}

          {/* Improve button with popover */}
          <div className="relative improve-popover-container">
            <button
              onClick={handleImproveClick}
              disabled={!canImprove || isImproving}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-150
                ${canImprove && !isImproving
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 active:bg-purple-300 border border-purple-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }
              `}
            >
              {isImproving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Improving...
                </span>
              ) : (
                'Improve'
              )}
            </button>
            
            {/* Improve popover */}
            {showImprovePopover && (
              <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-10">
                <div className="text-xs font-medium text-gray-600 mb-2">How should I improve this?</div>
                <input
                  ref={improveInputRef}
                  type="text"
                  value={improveInstruction}
                  onChange={(e) => setImproveInstruction(e.target.value)}
                  onKeyDown={handleImproveKeyDown}
                  placeholder="e.g., make it more formal"
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setShowImprovePopover(false)
                      setImproveInstruction('')
                    }}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImproveSubmit}
                    disabled={!improveInstruction.trim()}
                    className={`
                      px-3 py-1.5 text-xs rounded-md font-medium
                      ${improveInstruction.trim()
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Send button */}
          <button
            onClick={handleSendClick}
            disabled={!canSend}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-150
              ${canSend
                ? 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
