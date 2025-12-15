import CaseListItem from './CaseListItem'

const navItems = [
  { id: 'all', label: 'All', icon: 'inbox' },
  { id: 'response_needed', label: 'Response Needed', icon: 'clock' },
  { id: 'sent', label: 'Sent Messages', icon: 'send' },
  { id: 'resolved', label: 'Resolved', icon: 'check' },
  { id: 'reported', label: 'Reported Unresolved', icon: 'flag' },
]

function NavIcon({ type, className }) {
  switch (type) {
    case 'inbox':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )
    case 'clock':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'send':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    case 'check':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'flag':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      )
    default:
      return null
  }
}

export default function CaseList({ 
  cases, 
  selectedCaseId, 
  onSelectCase, 
  onToggleCollapse,
  activeFilter,
  onFilterChange,
  totalCounts,
  onOpenSettings,
}) {
  // Sort cases: needs_response first, then by lastMessageAt (most recent first)
  const sortedCases = [...cases].sort((a, b) => {
    // Priority order: needs_response > draft_in_progress > responded
    const statusOrder = { needs_response: 0, draft_in_progress: 1, responded: 2 }
    const statusDiff = statusOrder[a.status] - statusOrder[b.status]
    if (statusDiff !== 0) return statusDiff
    
    // Within same status, sort by most recent
    return new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
  })

  return (
    <div className="h-full flex flex-col">
      {/* Inbox Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Inbox</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenSettings}
            className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            title="AI Settings"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button 
            onClick={onToggleCollapse}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <span>‹</span> Collapse
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-200">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onFilterChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              activeFilter === item.id
                ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 border-l-2 border-transparent'
            }`}
          >
            <NavIcon type={item.icon} className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Filters */}
      <div className="px-4 py-2 border-b border-gray-200">
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <span>Filters (0)</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        {sortedCases.map(caseItem => (
          <CaseListItem
            key={caseItem.id}
            caseData={caseItem}
            isSelected={caseItem.id === selectedCaseId}
            onClick={() => onSelectCase(caseItem.id)}
          />
        ))}
      </div>
    </div>
  )
}
