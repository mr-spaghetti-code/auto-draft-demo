import { useMemo } from 'react'

function formatMessageTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export default function Message({ message }) {
  const isSeller = message.role === 'seller'
  
  const formattedTime = useMemo(
    () => formatMessageTime(message.timestamp),
    [message.timestamp]
  )

  return (
    <div className="mb-4">
      {/* Timestamp */}
      <p className="text-xs text-gray-400 mb-2">
        {formattedTime}
      </p>

      {/* Message bubble */}
      <div className={`flex ${isSeller ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`
            max-w-[85%] rounded-lg px-4 py-3 border
            ${isSeller 
              ? 'bg-blue-50 border-blue-200 text-gray-800' 
              : 'bg-gray-100 border-gray-200 text-gray-800'
            }
          `}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  )
}
