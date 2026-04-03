import { useState, useCallback } from 'react'
import * as pdfjs from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'

// Set up the worker for pdfjs-dist using Vite's URL asset loading
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker

export const usePdfParser = () => {
  const [error, setError] = useState(null)
  const [isParsing, setIsParsing] = useState(false)

  const parsePdf = useCallback(async (file) => {
    setIsParsing(true)
    setError(null)
    
    try {
      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjs.getDocument({ 
        data: arrayBuffer,
        useSystemFonts: true,
        isEvalDisabled: true,
      })
      const pdf = await loadingTask.promise
      
      let fullText = ''
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const strings = textContent.items.map(item => item.str)
        fullText += (strings.join(' ') || '') + '\n'
      }
      
      if (!fullText.trim()) {
        throw new Error('No text content found in the PDF.')
      }

      setIsParsing(false)
      return fullText
    } catch (err) {
      console.error('PDF Parsing Error:', err)
      setError('Failed to parse PDF. Make sure it\'s a valid document.')
      setIsParsing(false)
      throw err
    }
  }, [])

  return { parsePdf, isParsing, error }
}
