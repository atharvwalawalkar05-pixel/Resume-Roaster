import { create } from 'zustand'

const useResumeStore = create((set) => ({
  // State
  originalText: '',
  roastFeedback: null, // { score: 0, feedback: '', roastItems: [] }
  rebuiltText: '',
  currentMode: 'upload', // 'upload' | 'roast' | 'rebuild'
  isLoading: false,
  error: null,

  // Actions
  setError: (error) => set({ error }),
  setOriginalText: (text) => set({ originalText: text }),
  
  setRoastFeedback: (feedback) => set({ 
    roastFeedback: feedback,
    currentMode: 'roast' 
  }),

  setRebuiltText: (text) => set({ 
    rebuiltText: text,
    currentMode: 'rebuild'
  }),

  setMode: (mode) => set({ currentMode: mode }),

  setLoading: (loading) => set({ isLoading: loading }),

  reset: () => set({
    originalText: '',
    roastFeedback: null,
    rebuiltText: '',
    currentMode: 'upload',
    isLoading: false
  })
}))

export default useResumeStore
