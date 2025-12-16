import { useState, useCallback } from 'react'
import CaseList from './components/CaseList'
import ThreadView from './components/ThreadView'
import OrderDetails from './components/OrderDetails'
import SellerSettingsModal from './components/SellerSettingsModal'
import { initialCases } from './data/mockCases'

function App() {
  const [cases, setCases] = useState(initialCases)
  const [selectedCaseId, setSelectedCaseId] = useState(initialCases[0]?.id || null)
  const [showOrderDetails, setShowOrderDetails] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const selectedCase = cases.find(c => c.id === selectedCaseId)

  // Filter cases based on active filter
  const filteredCases = cases.filter(c => {
    switch (activeFilter) {
      case 'response_needed':
        return c.status === 'needs_response'
      case 'sent':
        return c.status === 'responded'
      case 'resolved':
        return c.status === 'resolved'
      default:
        return true
    }
  })

  const handleSelectCase = useCallback((caseId) => {
    setSelectedCaseId(caseId)
    setShowOrderDetails(true)
  }, [])

  const handleSendMessage = useCallback((caseId, messageContent) => {
    setCases(prevCases => 
      prevCases.map(c => {
        if (c.id !== caseId) return c
        
        const newMessage = {
          id: `msg_${Date.now()}`,
          role: 'seller',
          content: messageContent,
          timestamp: new Date().toISOString(),
        }

        return {
          ...c,
          status: 'responded',
          lastMessageAt: newMessage.timestamp,
          messages: [...c.messages, newMessage],
        }
      })
    )
  }, [])

  const handleUpdateCaseStatus = useCallback((caseId, status) => {
    setCases(prevCases =>
      prevCases.map(c => 
        c.id === caseId ? { ...c, status } : c
      )
    )
  }, [])

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  const handleCloseOrderDetails = useCallback(() => {
    setShowOrderDetails(false)
  }, [])

  const handleOpenSettings = useCallback(() => {
    setShowSettingsModal(true)
  }, [])

  const handleCloseSettings = useCallback(() => {
    setShowSettingsModal(false)
  }, [])

  return (
    <div className="h-screen flex bg-white">
      {/* Left Sidebar - Case List */}
      <aside 
        className={`bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-200 ${
          sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-[420px]'
        }`}
      >
        <CaseList 
          cases={filteredCases} 
          selectedCaseId={selectedCaseId} 
          onSelectCase={handleSelectCase}
          onToggleCollapse={handleToggleSidebar}
          isCollapsed={sidebarCollapsed}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          totalCounts={{
            all: cases.length,
            response_needed: cases.filter(c => c.status === 'needs_response').length,
            sent: cases.filter(c => c.status === 'responded').length,
          }}
        />
      </aside>

      {/* Expand button when sidebar is collapsed */}
      {sidebarCollapsed && (
        <button
          onClick={handleToggleSidebar}
          className="flex-shrink-0 px-2 py-4 bg-white border-r border-gray-200 hover:bg-gray-50 text-sm text-gray-600"
        >
          <span className="writing-vertical">Inbox ›</span>
        </button>
      )}

      {/* Center Panel - Thread View */}
      <main className="flex-1 bg-gray-50 overflow-hidden min-w-0">
        {selectedCase ? (
          <ThreadView 
            caseData={selectedCase}
            onSendMessage={handleSendMessage}
            onOpenSettings={handleOpenSettings}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>Select a case to view the thread</p>
          </div>
        )}
      </main>

      {/* Right Sidebar - Order Details */}
      {showOrderDetails && selectedCase && (
        <aside className="w-[280px] flex-shrink-0">
          <OrderDetails 
            caseData={selectedCase}
            onClose={handleCloseOrderDetails}
          />
        </aside>
      )}

      {/* Settings Modal */}
      <SellerSettingsModal 
        isOpen={showSettingsModal}
        onClose={handleCloseSettings}
      />
    </div>
  )
}

export default App
