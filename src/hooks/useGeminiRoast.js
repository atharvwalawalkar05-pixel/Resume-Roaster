import { useState, useCallback } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { SYSTEM_PROMPTS, buildRoastPrompt, buildRebuildPrompt } from '../utils/promptBuilder'
import useResumeStore from '../store/resumeStore'

/**
 * Hook for interacting with Google Gemini AI (Free Tier)
 */
export const useGeminiRoast = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  
  const setRoastFeedback = useResumeStore(state => state.setRoastFeedback)
  const setRebuiltText = useResumeStore(state => state.setRebuiltText)
  const setLoading = useResumeStore(state => state.setLoading)
  const setError = useResumeStore(state => state.setError)

  const callGemini = async (systemPrompt, userPrompt) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY in .env file.")
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt
    })

    const result = await model.generateContent(userPrompt)
    const response = await result.response
    return response.text()
  }

  const roastResume = useCallback(async (text) => {
    setIsProcessing(true)
    setLoading(true)
    setError(null)

    try {
      const resultText = await callGemini(SYSTEM_PROMPTS.ROASTER, buildRoastPrompt(text))
      
      const jsonMatch = resultText.match(/\{[\s\S]*\}/)
      const feedback = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(resultText)
      
      setRoastFeedback(feedback)
      setIsProcessing(false)
      setLoading(false)
      return feedback
    } catch (err) {
      console.error('Gemini FULL Error:', err)
      setError(err.toString())
      setIsProcessing(false)
      setLoading(false)
    }
  }, [setRoastFeedback, setLoading, setError])

  const rebuildResume = useCallback(async (text, roastFeedback) => {
    setIsProcessing(true)
    setLoading(true)
    setError(null)

    try {
      const builtText = await callGemini(
        SYSTEM_PROMPTS.BUILDER, 
        buildRebuildPrompt(text, JSON.stringify(roastFeedback))
      )
      
      setRebuiltText(builtText)
      setIsProcessing(false)
      setLoading(false)
      return builtText
    } catch (err) {
      console.error('Gemini Rebuild Error:', err)
      setError(err.message || 'Failed to build resume with Gemini.')
      setIsProcessing(false)
      setLoading(false)
    }
  }, [setRebuiltText, setLoading])

  return { roastResume, rebuildResume, isProcessing, error }
}
