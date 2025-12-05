import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'seller_preferences'

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return data
    }
  } catch (e) {
    console.error('Failed to load seller preferences from localStorage:', e)
  }
  return ''
}

function saveToStorage(preferences) {
  try {
    localStorage.setItem(STORAGE_KEY, preferences)
  } catch (e) {
    console.error('Failed to save seller preferences to localStorage:', e)
  }
}

export function useSellerPreferences() {
  const [preferences, setPreferencesState] = useState(() => loadFromStorage())

  // Sync with localStorage on mount (in case another tab changed it)
  useEffect(() => {
    const stored = loadFromStorage()
    if (stored !== preferences) {
      setPreferencesState(stored)
    }
  }, [])

  const setPreferences = useCallback((newPreferences) => {
    setPreferencesState(newPreferences)
    saveToStorage(newPreferences)
  }, [])

  const clearPreferences = useCallback(() => {
    setPreferencesState('')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear seller preferences:', e)
    }
  }, [])

  return {
    preferences,
    setPreferences,
    clearPreferences,
  }
}

