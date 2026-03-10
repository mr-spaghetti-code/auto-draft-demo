import { useState, useRef, useCallback, useEffect } from 'react'

const RECOMMENDATIONS = [
  {
    id: 'return-sop',
    impact: 'High Impact',
    impactColor: 'red',
    title: '20% of suggested responses aren\'t accepted due to missing context',
    description: 'Upload your Return Policy SOP so the assistant can reference accurate return procedures.',
    cta: 'Upload Return Policy SOP',
    action: 'upload',
    uploadLabel: 'Return Policy SOP',
  },
  {
    id: 'shipping-info',
    impact: 'Medium Impact',
    impactColor: 'amber',
    title: 'Shipping questions are being answered too generically',
    description: 'Add detailed shipping info — carriers, cutoff times, and international rules — to improve draft accuracy.',
    cta: 'Add Shipping Details',
    action: 'navigate',
    navigateTo: 'policies',
  },
  {
    id: 'tone-mismatch',
    impact: 'Medium Impact',
    impactColor: 'amber',
    title: 'Buyers are responding better to a friendlier tone',
    description: 'Your current style is set to "Professional". Switching to "Friendly" may increase response acceptance.',
    cta: 'Update Response Style',
    action: 'navigate',
    navigateTo: 'responses',
  },
  {
    id: 'product-docs',
    impact: 'Low Impact',
    impactColor: 'blue',
    title: 'Technical questions lack product-specific context',
    description: 'Upload product manuals or spec sheets so the assistant can answer warranty and troubleshooting questions accurately.',
    cta: 'Upload Product Docs',
    action: 'upload',
    uploadLabel: 'Product Documentation',
  },
]

const mockUploadedFiles = [
  { id: 1, name: 'Return_Policy_2024.pdf', size: '245 KB', uploadedAt: 'Dec 10, 2025' },
  { id: 2, name: 'Product_Manual_BT500.pdf', size: '1.2 MB', uploadedAt: 'Dec 8, 2025' },
]

const mockExtractedInsights = [
  {
    id: 1,
    category: 'Return Policy',
    icon: 'return',
    insights: [
      { label: 'Return Window', value: '30 days from delivery date' },
      { label: 'Condition', value: 'Items must be unused with original packaging' },
      { label: 'Refund Method', value: 'Original payment method within 5-7 business days' },
    ],
    applyTo: 'returnPolicy',
    suggestedText: '30-day return window from delivery. Items must be unused with original packaging. Refunds processed to original payment method within 5-7 business days.',
  },
  {
    id: 2,
    category: 'Product Specifications',
    icon: 'product',
    insights: [
      { label: 'Model', value: 'BT500 Wireless Headphones' },
      { label: 'Battery Life', value: 'Up to 40 hours playback' },
      { label: 'Connectivity', value: 'Bluetooth 5.3, multipoint pairing' },
    ],
    applyTo: 'productNotes',
    suggestedText: 'BT500 Wireless Headphones: Up to 40 hours battery life, Bluetooth 5.3 with multipoint pairing support.',
  },
  {
    id: 3,
    category: 'Troubleshooting',
    icon: 'troubleshoot',
    insights: [
      { label: 'Pairing Issues', value: 'Hold power button 10 seconds to reset' },
      { label: 'Audio Dropouts', value: 'Ensure device is within 10m range' },
      { label: 'Charging Problems', value: 'Use only included USB-C cable' },
    ],
    applyTo: 'commonIssues',
    suggestedText: 'Pairing issues: Hold power 10 seconds to reset. Audio dropouts: Stay within 10m of device. Charging problems: Use included USB-C cable only.',
  },
]

const mockPreferences = {
  storeName: 'TechGadgets Pro',
  responseStyle: 'professional',
  returnPolicy: '30-day no-questions-asked returns. Free return shipping on defective items.',
  shippingInfo: 'Orders ship within 1-2 business days. Free shipping on orders over $35.',
  businessHours: 'Mon-Fri 9am-6pm EST. Emails answered within 24 hours.',
  productNotes: 'All electronics include 1-year manufacturer warranty. Extended warranty available for purchase.',
  commonIssues: 'For Bluetooth pairing issues, always suggest resetting device first. Battery replacement available at discounted rate.',
  toneNotes: 'Use friendly but professional tone. Address customers by first name. Express empathy for frustrations.',
}

export default function SellerSettingsModal({ isOpen, onClose }) {
  const [preferences, setPreferences] = useState(mockPreferences)
  const [activeTab, setActiveTab] = useState('recommendations')
  const [saved, setSaved] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState(mockUploadedFiles)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [extractedInsights, setExtractedInsights] = useState([])
  const [appliedInsights, setAppliedInsights] = useState(new Set())
  const [resolvedRecommendations, setResolvedRecommendations] = useState(new Set())
  const [pendingUploadRec, setPendingUploadRec] = useState(null)
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your Seller Assistant. Tell me how you'd like me to change the way I respond — tone, length, style, anything." }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const fileInputRef = useRef(null)
  const recFileInputRef = useRef(null)
  const chatBottomRef = useRef(null)
  const chatInputRef = useRef(null)

  const handleChatSend = useCallback(async () => {
    const text = chatInput.trim()
    if (!text || isChatLoading) return

    const userMsg = { role: 'user', content: text }
    const updatedMessages = [...chatMessages, userMsg]
    setChatMessages(updatedMessages)
    setChatInput('')
    setIsChatLoading(true)

    try {
      const res = await fetch('/api/agent-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Skip the initial greeting (index 0) so the API receives user/assistant turns only
          messages: updatedMessages.slice(1).map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that. Please try again." }])
    } finally {
      setIsChatLoading(false)
    }
  }, [chatInput, chatMessages, isChatLoading])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isChatLoading])

  const handleRecommendationAction = useCallback((rec) => {
    if (rec.action === 'navigate') {
      setActiveTab(rec.navigateTo)
      setResolvedRecommendations(prev => new Set([...prev, rec.id]))
    } else if (rec.action === 'upload') {
      setPendingUploadRec(rec)
      recFileInputRef.current?.click()
    }
  }, [])

  if (!isOpen) return null

  const handleAnalyzeDocuments = () => {
    if (uploadedFiles.length === 0) return
    setIsAnalyzing(true)
    setExtractedInsights([])
    setAppliedInsights(new Set())
    
    // Simulate AI analysis with staggered results
    setTimeout(() => {
      setExtractedInsights([mockExtractedInsights[0]])
    }, 800)
    setTimeout(() => {
      setExtractedInsights(prev => [...prev, mockExtractedInsights[1]])
    }, 1400)
    setTimeout(() => {
      setExtractedInsights(prev => [...prev, mockExtractedInsights[2]])
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleApplyInsight = (insight) => {
    setPreferences(prev => ({
      ...prev,
      [insight.applyTo]: prev[insight.applyTo] 
        ? prev[insight.applyTo] + '\n\n' + insight.suggestedText 
        : insight.suggestedText
    }))
    setAppliedInsights(prev => new Set([...prev, insight.id]))
  }

  const handleApplyAll = () => {
    extractedInsights.forEach(insight => {
      if (!appliedInsights.has(insight.id)) {
        handleApplyInsight(insight)
      }
    })
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: formatFileSize(file.size),
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }))
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: formatFileSize(file.size),
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }))
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1500)
  }

  const handleChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }))
  }

  const handleRecFileSelect = (e) => {
    const files = e.target.files
    if (files && files.length > 0 && pendingUploadRec) {
      const newFiles = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: formatFileSize(file.size),
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }))
      setUploadedFiles(prev => [...prev, ...newFiles])
      setResolvedRecommendations(prev => new Set([...prev, pendingUploadRec.id]))
      setPendingUploadRec(null)
    }
    if (recFileInputRef.current) recFileInputRef.current.value = ''
  }

  const tabs = [
    { id: 'recommendations', label: 'Recommendations', icon: 'lightbulb' },
    { id: 'improve', label: 'Improve', icon: 'sparkle' },
    { id: 'policies', label: 'Policies', icon: 'document' },
    { id: 'responses', label: 'Response Style', icon: 'chat' },
    { id: 'documents', label: 'Documents', icon: 'upload' },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Hidden file input for recommendation uploads */}
      <input
        ref={recFileInputRef}
        type="file"
        multiple
        onChange={handleRecFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
      />

      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Inbox Agent Settings</h2>
                <p className="text-sm text-gray-500">Customize how your AI automation responds to customers</p>
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

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TabIcon type={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className={`p-6 ${activeTab === 'improve' ? '' : 'max-h-[60vh] overflow-y-auto'}`}>
            {activeTab === 'recommendations' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4">
                  Based on your drafting activity, here are actions that can improve suggestion quality.
                </p>
                {RECOMMENDATIONS.map(rec => {
                  const resolved = resolvedRecommendations.has(rec.id)
                  const impactStyles = {
                    red: 'bg-red-50 text-red-700 border-red-200',
                    amber: 'bg-amber-50 text-amber-700 border-amber-200',
                    blue: 'bg-blue-50 text-blue-700 border-blue-200',
                  }
                  return (
                    <div
                      key={rec.id}
                      className={`rounded-xl border p-4 transition-all duration-200 ${
                        resolved
                          ? 'bg-gray-50 border-gray-200 opacity-60'
                          : 'bg-white border-gray-200 hover:border-teal-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Check indicator */}
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                          resolved
                            ? 'bg-teal-500 border-teal-500'
                            : 'border-gray-300'
                        }`}>
                          {resolved && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${impactStyles[rec.impactColor]}`}>
                              {rec.impact}
                            </span>
                          </div>
                          <p className={`text-sm font-medium mb-1 ${resolved ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            {rec.title}
                          </p>
                          <p className="text-xs text-gray-500 mb-3">{rec.description}</p>
                          {!resolved && (
                            <button
                              onClick={() => handleRecommendationAction(rec)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm"
                            >
                              {rec.action === 'upload' ? (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              )}
                              {rec.cta}
                            </button>
                          )}
                          {resolved && (
                            <span className="text-xs text-teal-600 font-medium">Done</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === 'improve' && (
              <div className="flex flex-col" style={{ height: '420px' }}>
                <p className="text-sm text-gray-500 mb-3 flex-shrink-0">
                  Tell me how you'd like me to respond differently — tone, length, what to avoid, anything.
                </p>

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                      )}
                      <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-teal-600 text-white rounded-tr-sm'
                          : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 flex-shrink-0 border-t border-gray-200 pt-3">
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend() } }}
                    placeholder="e.g. Reply more professionally..."
                    disabled={isChatLoading}
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50"
                  />
                  <button
                    onClick={handleChatSend}
                    disabled={!chatInput.trim() || isChatLoading}
                    className={`p-2 rounded-lg transition-colors ${
                      chatInput.trim() && !isChatLoading
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'policies' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={preferences.storeName}
                    onChange={(e) => handleChange('storeName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
                    placeholder="Your store name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Policy
                  </label>
                  <textarea
                    value={preferences.returnPolicy}
                    onChange={(e) => handleChange('returnPolicy', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow resize-none"
                    placeholder="Describe your return policy..."
                  />
                  <p className="mt-1.5 text-xs text-gray-500">The AI will reference this when handling return requests</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Information
                  </label>
                  <textarea
                    value={preferences.shippingInfo}
                    onChange={(e) => handleChange('shippingInfo', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow resize-none"
                    placeholder="Describe shipping times, costs, carriers..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Hours
                  </label>
                  <input
                    type="text"
                    value={preferences.businessHours}
                    onChange={(e) => handleChange('businessHours', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
                    placeholder="Mon-Fri 9am-5pm..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'responses' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Style
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['professional', 'friendly', 'concise'].map(style => (
                      <button
                        key={style}
                        onClick={() => handleChange('responseStyle', style)}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                          preferences.responseStyle === style
                            ? 'border-teal-500 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tone & Style Notes
                  </label>
                  <textarea
                    value={preferences.toneNotes}
                    onChange={(e) => handleChange('toneNotes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow resize-none"
                    placeholder="Any specific instructions for how the AI should communicate..."
                  />
                  <p className="mt-1.5 text-xs text-gray-500">These guidelines shape how the AI drafts responses</p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-amber-800">Tip</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Be specific about what makes your brand unique. The AI uses these notes to match your voice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-5">
                {/* Upload area */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    isDragging
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
                  />
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-full mb-3 ${isDragging ? 'bg-teal-100' : 'bg-gray-100'}`}>
                      <svg className={`w-8 h-8 ${isDragging ? 'text-teal-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">or click to browse</p>
                    <p className="text-xs text-gray-400">
                      PDF, DOC, TXT, CSV, XLS up to 10MB each
                    </p>
                  </div>
                </div>

                {/* Uploaded files list */}
                {uploadedFiles.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Uploaded Documents ({uploadedFiles.length})
                    </label>
                    <div className="space-y-2">
                      {uploadedFiles.map(file => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg group hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white border border-gray-200 rounded-lg">
                              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.size} • Uploaded {file.uploadedAt}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            title="Remove file"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Analysis Section */}
                {uploadedFiles.length > 0 && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-purple-100 rounded-lg">
                            <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-800">AI Document Analysis</span>
                        </div>
                        <button
                          onClick={handleAnalyzeDocuments}
                          disabled={isAnalyzing}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                            isAnalyzing
                              ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                          }`}
                        >
                          {isAnalyzing ? (
                            <>
                              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Extract Insights
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1.5">
                        Let AI analyze your documents to automatically extract policies, product info, and troubleshooting guides
                      </p>
                    </div>

                    {/* Extracted Insights */}
                    {(extractedInsights.length > 0 || isAnalyzing) && (
                      <div className="p-4 space-y-3">
                        {isAnalyzing && extractedInsights.length === 0 && (
                          <div className="flex items-center justify-center py-6">
                            <div className="flex flex-col items-center gap-3">
                              <div className="relative">
                                <div className="w-12 h-12 border-4 border-purple-200 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                              </div>
                              <p className="text-sm text-gray-600">Analyzing documents...</p>
                              <p className="text-xs text-gray-400">Extracting policies and product information</p>
                            </div>
                          </div>
                        )}

                        {extractedInsights.map((insight, index) => (
                          <div
                            key={insight.id}
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm animate-fadeIn"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <InsightIcon type={insight.icon} className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-medium text-gray-800">{insight.category}</span>
                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-700 rounded">
                                  AI Extracted
                                </span>
                              </div>
                              {appliedInsights.has(insight.id) ? (
                                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Applied
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleApplyInsight(insight)}
                                  className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                                >
                                  Apply
                                </button>
                              )}
                            </div>
                            <div className="space-y-1.5">
                              {insight.insights.map((item, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                  <span className="text-gray-500 min-w-[120px]">{item.label}:</span>
                                  <span className="text-gray-800">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        {extractedInsights.length > 0 && !isAnalyzing && (
                          <div className="flex items-center justify-between pt-2">
                            <p className="text-xs text-gray-500">
                              {appliedInsights.size} of {extractedInsights.length} insights applied
                            </p>
                            {appliedInsights.size < extractedInsights.length && (
                              <button
                                onClick={handleApplyAll}
                                className="text-xs font-medium text-purple-600 hover:text-purple-700"
                              >
                                Apply all remaining
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-800">How documents are used</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Upload product manuals, FAQs, policy documents, or any reference materials. The AI will search these documents to provide accurate, grounded responses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Data Privacy Disclaimer */}
          <div className="mx-6 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex gap-2.5 items-start">
              <svg className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-slate-600">
                <span className="font-medium">Your data is private.</span> All information and documents you provide are used exclusively to help the AI automation craft better responses. Your data is never shared, sold, or used for any other purpose.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <p className="text-xs text-gray-500">
              Changes apply to all future AI-generated drafts
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saved}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                  saved
                    ? 'bg-green-600 text-white'
                    : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm hover:shadow'
                }`}
              >
                {saved ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabIcon({ type, className }) {
  switch (type) {
    case 'lightbulb':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    case 'sparkle':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    case 'document':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    case 'chat':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    case 'cube':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    case 'upload':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      )
    default:
      return null
  }
}

function InsightIcon({ type, className }) {
  switch (type) {
    case 'return':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
        </svg>
      )
    case 'product':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    case 'troubleshoot':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    default:
      return null
  }
}

