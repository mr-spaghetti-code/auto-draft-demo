import { useState, useRef, useEffect } from 'react'

export default function FeedbackModal({ isOpen, onClose }) {
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackType, setFeedbackType] = useState('hallucination')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setFeedbackText('')
      setFeedbackType('hallucination')
      setSubmitted(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!feedbackText.trim()) return
    
    setIsSubmitting(true)
    
    // Simulate sending feedback to Amazon
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('AI Feedback submitted to Amazon:', {
      type: feedbackType,
      text: feedbackText,
      timestamp: new Date().toISOString(),
    })
    
    setIsSubmitting(false)
    setSubmitted(true)
    
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  const feedbackTypes = [
    { id: 'hallucination', label: 'Hallucination', icon: '🎭', description: 'AI made up information' },
    { id: 'wrong_tone', label: 'Wrong Tone', icon: '🗣️', description: 'Too formal, casual, etc.' },
    { id: 'inaccurate', label: 'Inaccurate', icon: '❌', description: 'Incorrect policy or facts' },
    { id: 'other', label: 'Other Issue', icon: '⚠️', description: 'Other AI quality issue' },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Report AI Issue</h2>
                <p className="text-xs text-gray-500">Help improve AI suggestion quality</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Feedback Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {feedbackTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setFeedbackType(type.id)}
                    className={`flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-lg border text-sm transition-all text-left ${
                      feedbackType === type.id
                        ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-500/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{type.icon}</span>
                      <span className={`font-medium ${feedbackType === type.id ? 'text-rose-700' : 'text-gray-700'}`}>
                        {type.label}
                      </span>
                    </span>
                    <span className={`text-xs ${feedbackType === type.id ? 'text-rose-600' : 'text-gray-500'}`}>
                      {type.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the Issue
              </label>
              <textarea
                ref={textareaRef}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Describe what was wrong with the AI suggestion. For example: 'The AI mentioned a 60-day return policy but our policy is 30 days' or 'The tone was too casual for a business customer'"
                rows={5}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow resize-none placeholder:text-gray-400"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Specific examples help Amazon's AI team fix the issue faster
              </p>
            </div>

            {/* Info Banner */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex gap-2.5 items-start">
                <svg className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-slate-600">
                  Your feedback is sent to Amazon's AI team to improve suggestion quality. No customer data is included.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!feedbackText.trim() || isSubmitting || submitted}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                submitted
                  ? 'bg-green-600 text-white'
                  : feedbackText.trim() && !isSubmitting
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm hover:shadow'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {submitted ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sent!
                </>
              ) : isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Report Issue
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

