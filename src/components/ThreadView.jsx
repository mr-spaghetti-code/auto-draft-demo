import { useRef, useEffect, useState, useCallback } from 'react'
import Message from './Message'
import Composer from './Composer'

// US Flag component
function USFlag({ className }) {
  return (
    <svg className={className} viewBox="0 0 640 480" fill="none">
      <rect width="640" height="480" fill="#fff"/>
      <g>
        <rect y="0" width="640" height="37" fill="#bf0a30"/>
        <rect y="74" width="640" height="37" fill="#bf0a30"/>
        <rect y="148" width="640" height="37" fill="#bf0a30"/>
        <rect y="222" width="640" height="37" fill="#bf0a30"/>
        <rect y="296" width="640" height="37" fill="#bf0a30"/>
        <rect y="370" width="640" height="37" fill="#bf0a30"/>
        <rect y="444" width="640" height="36" fill="#bf0a30"/>
      </g>
      <rect y="0" width="256" height="259" fill="#002868"/>
    </svg>
  )
}

export default function ThreadView({ caseData, onSendMessage, onOpenSettings }) {
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [isUserScrolled, setIsUserScrolled] = useState(false)
  const [prevMessagesLength, setPrevMessagesLength] = useState(caseData.messages.length)

  // Track if user has scrolled up from bottom
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50
    setIsUserScrolled(!isAtBottom)
  }, [])

  // Auto-scroll to bottom when new messages arrive (if user hasn't scrolled up)
  useEffect(() => {
    if (caseData.messages.length !== prevMessagesLength) {
      setPrevMessagesLength(caseData.messages.length)
      if (!isUserScrolled) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [caseData.messages.length, prevMessagesLength, isUserScrolled])

  // Reset scroll state when case changes
  useEffect(() => {
    setIsUserScrolled(false)
    setPrevMessagesLength(caseData.messages.length)
    // Immediate scroll without animation on case change
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [caseData.id])

  const handleSend = useCallback((content) => {
    onSendMessage(caseData.id, content)
    // Reset scroll state so we auto-scroll to new message
    setIsUserScrolled(false)
  }, [caseData.id, onSendMessage])

  const needsResponse = caseData.status === 'needs_response'

  return (
    <div className="h-full flex flex-col">
      {/* Thread header */}
      <header className="px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
        {/* Top row: Buyer info and location */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {caseData.buyerName}
            </h2>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {caseData.buyerType === 'Business Buyer' && (
              <span className="px-2 py-0.5 text-xs font-medium bg-teal-600 text-white rounded">
                Business Buyer
              </span>
            )}
            <button className="text-sm text-teal-600 hover:text-teal-700 hover:underline">
              See all communication with this buyer
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <USFlag className="w-5 h-3.5 border border-gray-200 rounded-sm" />
            <span>{caseData.country === 'US' ? 'United States' : caseData.country}</span>
            <span className="text-gray-300">|</span>
            <span>{caseData.language}</span>
          </div>
        </div>

        {/* Topic row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Topic:</span>
            <span className="text-teal-600 font-medium">{caseData.topic}</span>
          </div>
          {needsResponse && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-700">Response Needed</span>
              {caseData.dueHours && (
                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                  Due: {caseData.dueHours} hrs
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Messages container */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white"
      >
        {caseData.messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <Composer 
        caseData={caseData}
        onSend={handleSend}
        onOpenSettings={onOpenSettings}
      />
    </div>
  )
}
