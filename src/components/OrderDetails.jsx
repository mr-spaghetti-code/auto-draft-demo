import { useState, useCallback } from 'react'

export default function OrderDetails({ caseData, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleCopyOrderId = useCallback(() => {
    navigator.clipboard.writeText(caseData.orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [caseData.orderId])

  if (!caseData) return null

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Order</h3>
        <button
          onClick={onClose}
          className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
        >
          Less info
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Response Status */}
        <div className="flex items-center gap-2 mb-4">
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

        {/* Product Info */}
        <div className="flex gap-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-16 h-16 flex-shrink-0 bg-white rounded border border-gray-200 overflow-hidden">
            <img
              src={caseData.product?.image}
              alt={caseData.product?.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-teal-600 font-medium line-clamp-2 hover:underline cursor-pointer">
              {caseData.product?.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Qty: {caseData.product?.quantity || 1}
            </p>
            <p className="text-xs text-gray-500">
              Id: {caseData.product?.asin}
            </p>
          </div>
        </div>

        {/* Order ID */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Order ID</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-teal-600 font-medium">{caseData.orderId}</span>
            <button
              onClick={handleCopyOrderId}
              className="p-1 hover:bg-gray-100 rounded"
              title="Copy Order ID"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Refund Button */}
        <button className="w-auto px-4 py-1.5 mb-6 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700">
          Refund Order
        </button>

        {/* Order Dates */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">Purchase date</p>
            <p className="text-sm text-gray-900">{caseData.order?.purchaseDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Ship by</p>
            <p className="text-sm text-gray-900">{caseData.order?.shipBy}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Deliver by</p>
            <p className="text-sm text-gray-900">{caseData.order?.deliverBy}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

