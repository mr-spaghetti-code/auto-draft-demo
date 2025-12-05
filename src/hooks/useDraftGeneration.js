import { useState, useRef, useCallback } from 'react'

export function useDraftGeneration() {
  const [draftContent, setDraftContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)

  const generateDraft = useCallback(async (caseData, onUpdate) => {
    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    
    setIsGenerating(true)
    setError(null)
    setDraftContent('')

    try {
      const response = await fetch('/api/generate-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caseData }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Failed to generate draft')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.error) {
                throw new Error(data.error)
              }
              
              if (data.text) {
                accumulatedText += data.text
                setDraftContent(accumulatedText)
                onUpdate?.()
              }
              
              if (data.done) {
                setIsGenerating(false)
              }
            } catch (parseError) {
              // Skip invalid JSON lines
              if (parseError.message !== 'Unexpected end of JSON input') {
                console.error('Parse error:', parseError)
              }
            }
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was aborted, don't treat as error
        return
      }
      
      console.error('Draft generation error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
      abortControllerRef.current = null
    }
  }, [])

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsGenerating(false)
  }, [])

  const clearDraft = useCallback(() => {
    setDraftContent('')
    setError(null)
  }, [])

  const updateDraftContent = useCallback((content) => {
    setDraftContent(content)
  }, [])

  return {
    draftContent,
    isGenerating,
    error,
    generateDraft,
    cancelGeneration,
    clearDraft,
    updateDraftContent,
  }
}

