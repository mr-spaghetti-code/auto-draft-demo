import { useMemo } from 'react'

// Format date as "Oct 27, 2025"
function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

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

export default function CaseListItem({ caseData, isSelected, onClick }) {
  const formattedDate = useMemo(
    () => formatDate(caseData.lastMessageAt),
    [caseData.lastMessageAt]
  )

  const needsResponse = caseData.status === 'needs_response'

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3 border-b border-gray-100 transition-colors
        hover:bg-gray-50
        ${isSelected ? 'bg-blue-50' : 'bg-white'}
      `}
    >
      {/* Top row: Flag, Name, Badge, Date */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <USFlag className="w-5 h-3.5 flex-shrink-0 border border-gray-200 rounded-sm" />
          <span className="font-medium text-gray-900 text-sm">
            {caseData.buyerName}
          </span>
          {caseData.buyerType === 'Business Buyer' && (
            <span className="px-1.5 py-0.5 text-xs font-medium bg-teal-600 text-white rounded">
              Business Buyer
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0">
          {formattedDate}
        </span>
      </div>

      {/* Subject line */}
      <p className="text-sm text-gray-700 truncate mb-2">
        {caseData.subject || `${caseData.topic} inquiry from Amazon customer ${caseData.buyerName}`}
      </p>

      {/* Status row */}
      {needsResponse && (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-600">Response Needed</span>
          {caseData.dueHours && (
            <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
              Due: {caseData.dueHours} hrs
            </span>
          )}
        </div>
      )}
    </button>
  )
}
