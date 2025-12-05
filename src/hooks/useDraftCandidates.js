import { useState, useCallback, useEffect, useRef } from 'react'

const STORAGE_KEY_PREFIX = 'draft_candidates_'

function getStorageKey(caseId) {
  return `${STORAGE_KEY_PREFIX}${caseId}`
}

function loadFromStorage(caseId) {
  try {
    const data = localStorage.getItem(getStorageKey(caseId))
    if (data) {
      const parsed = JSON.parse(data)
      if (parsed.candidates && Array.isArray(parsed.candidates)) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Failed to load candidates from localStorage:', e)
  }
  return null
}

function saveToStorage(caseId, candidates) {
  try {
    const data = {
      candidates,
      generatedAt: new Date().toISOString()
    }
    localStorage.setItem(getStorageKey(caseId), JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save candidates to localStorage:', e)
  }
}

function clearStorage(caseId) {
  try {
    localStorage.removeItem(getStorageKey(caseId))
  } catch (e) {
    console.error('Failed to clear candidates from localStorage:', e)
  }
}

export function useDraftCandidates(caseId) {
  const [candidates, setCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const abortControllerRef = useRef(null)
  const currentCaseIdRef = useRef(caseId)

  // Load from localStorage when caseId changes
  useEffect(() => {
    currentCaseIdRef.current = caseId
    
    const stored = loadFromStorage(caseId)
    if (stored) {
      setCandidates(stored.candidates)
      setHasGenerated(true)
      setError(null)
    } else {
      setCandidates([])
      setHasGenerated(false)
      setError(null)
    }
    
    // Cleanup: abort any in-flight request when case changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [caseId])

  const generateCandidates = useCallback(async (caseData, sellerPreferences = '') => {
    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caseData, sellerPreferences }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate candidates')
      }

      const data = await response.json()
      
      // Only update state if we're still on the same case
      if (currentCaseIdRef.current === caseData.id) {
        setCandidates(data.candidates)
        setHasGenerated(true)
        saveToStorage(caseData.id, data.candidates)
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return
      }
      
      console.error('Candidates generation error:', err)
      if (currentCaseIdRef.current === caseData.id) {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      if (currentCaseIdRef.current === caseData.id) {
        setIsLoading(false)
      }
      abortControllerRef.current = null
    }
  }, [])

  const regenerateCandidates = useCallback(async (caseData, sellerPreferences = '') => {
    clearStorage(caseData.id)
    setCandidates([])
    setHasGenerated(false)
    await generateCandidates(caseData, sellerPreferences)
  }, [generateCandidates])

  const clearCandidates = useCallback(() => {
    setCandidates([])
    setHasGenerated(false)
    setError(null)
  }, [])

  return {
    candidates,
    isLoading,
    error,
    hasGenerated,
    generateCandidates,
    regenerateCandidates,
    clearCandidates,
  }
}

