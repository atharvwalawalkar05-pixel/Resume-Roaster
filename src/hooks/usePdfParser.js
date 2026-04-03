import { useState, useCallback } from 'react'
import * as pdfjs from 'pdfjs-dist'

// Set up the worker for pdfjs-dist
// We use a CDN version or the local one. In Vite, we can usually just point to the worker in node_modules.
// However, the cleanest way for a hook is often to import it.
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

export const usePdfParser = () => {
  const [error, setError] = useState(null)
  const [isParsing, setIsParsing] = useState(false)

  const parsePdf = useCallback(async (file) => {
    setIsParsing(true)
    setError(null)
    
    try {
      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      
      let fullText = ''
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const strings = textContent.items.map(item => item.str)
        fullText += strings.join(' ') + '\n'
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
