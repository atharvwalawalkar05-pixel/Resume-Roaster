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
      console.error('API Key Missing: Please set VITE_GEMINI_API_KEY in your environment variables.')
      throw new Error("Missing VITE_GEMINI_API_KEY. Please set it in your environment variables (e.g., in Netlify settings).")
    }

    const genAI = new GoogleGenerativeAI(apiKey, { apiVersion: 'v1beta' })
    
    // List of models to try, based on available models for this API key (2026 environment)
    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-3-flash-preview',
      'gemini-flash-latest',
      'gemini-2.5-pro',
      'gemini-2.0-flash-lite'
    ]

    let lastError = null
    
    for (const modelId of modelsToTry) {
      try {
        console.log(`Attempting to use Gemini model: ${modelId}`)
        const model = genAI.getGenerativeModel({ 
          model: modelId,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          }
        })

        const result = await model.generateContent(userPrompt)
        const response = await result.response
        const text = response.text()
        
        if (text) {
          console.log(`Successfully used model: ${modelId}`)
          return text
        }
      } catch (err) {
        console.warn(`Model ${modelId} failed:`, err.message)
        lastError = err
        // Continue to next model on 404 (Not Found) or 429 (Rate Limit/Quota)
        if (err.message.includes('404') || err.message.includes('not found') || err.message.includes('429')) {
          continue
        }
        // For other errors (like 401/403), we stop early as they are likely API key issues
        break
      }
    }

    // If we reach here, all models failed
    console.error('All Gemini models failed. Last error:', lastError)
    const errorMsg = lastError?.message || "All Gemini models failed to respond."
    throw new Error(`${errorMsg} (Tried ${modelsToTry.length} models including ${modelsToTry[0]})`)
  }

  const roastResume = useCallback(async (text) => {
    setIsProcessing(true)
    setLoading(true)
    setError(null)
    console.log('Starting resume roast process...')

    try {
      const prompt = buildRoastPrompt(text)
      console.log('Sending roast prompt to Gemini...')
      
      const resultText = await callGemini(SYSTEM_PROMPTS.ROASTER, prompt)
      
      console.log('Received roast response, parsing JSON...')
      const jsonMatch = resultText.match(/\{[\s\S]*\}/)
      const feedback = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(resultText)
      
      console.log('Roast successful! Feedback parsed.')
      setRoastFeedback(feedback)
      setIsProcessing(false)
      setLoading(false)
      return feedback
    } catch (err) {
      console.error('Gemini Roast Error:', err)
      const friendlyError = err.message || 'Failed to roast resume. Please check your API key.'
      setError(friendlyError)
      setIsProcessing(false)
      setLoading(false)
    }
  }, [setRoastFeedback, setLoading, setError])

  const rebuildResume = useCallback(async (text, roastFeedback) => {
    setIsProcessing(true)
    setLoading(true)
    setError(null)
    console.log('Starting resume rebuild process...')

    try {
      const prompt = buildRebuildPrompt(text, JSON.stringify(roastFeedback))
      console.log('Sending rebuild prompt to Gemini...')
      
      const builtText = await callGemini(SYSTEM_PROMPTS.BUILDER, prompt)
      
      if (!builtText || builtText.trim() === "") {
        throw new Error("Gemini returned an empty response during rebuild.")
      }

      console.log('Rebuild successful! Received optimized resume.')
      setRebuiltText(builtText)
      setIsProcessing(false)
      setLoading(false)
      return builtText
    } catch (err) {
      console.error('Gemini Rebuild Error:', err)
      const friendlyError = err.message || 'Failed to build resume with Gemini. Please try again.'
      setError(friendlyError)
      setIsProcessing(false)
      setLoading(false)
    }
  }, [setRebuiltText, setLoading, setError])

  return { roastResume, rebuildResume, isProcessing }
}
