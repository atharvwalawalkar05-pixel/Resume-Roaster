import React, { useState, useCallback } from 'react'
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { usePdfParser } from '../hooks/usePdfParser'
import useResumeStore from '../store/resumeStore'
import { useGeminiRoast } from '../hooks/useGeminiRoast'

const UploadZone = () => {
  const [isOver, setIsOver] = useState(false)
  const { parsePdf, isParsing, error: parseError } = usePdfParser()
  const { roastResume } = useGeminiRoast()
  
  const setOriginalText = useResumeStore((state) => state.setOriginalText)
  const setMode = useResumeStore((state) => state.setMode)

  const handleFile = useCallback(async (file) => {
    if (file && file.type === 'application/pdf') {
      try {
        const text = await parsePdf(file)
        setOriginalText(text)
        setMode('roast') // Transition IMMEDIATELY after parsing
        roastResume(text) // Don't await here, let the RoastPanel handle it
      } catch (err) {
        console.error(err)
      }
    }
  }, [parsePdf, setOriginalText, setMode, roastResume])

  const onDragOver = (e) => {
    e.preventDefault()
    setIsOver(true)
  }

  const onDragLeave = () => setIsOver(false)

  const onDrop = (e) => {
    e.preventDefault()
    setIsOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const onFileChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative group border-2 border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer
          ${isOver ? 'border-purple-500 bg-purple-500/10 scale-[1.02]' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'}
          ${isParsing ? 'pointer-events-none' : ''}`}
      >
        <input
          type="file"
          onChange={onFileChange}
          accept=".pdf"
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500
          ${isOver ? 'bg-purple-500/20 border-purple-500/40' : 'bg-zinc-800/50 border-zinc-700/50'}`}>
          {isParsing ? (
            <Loader2 className="text-purple-400 animate-spin" size={32} />
          ) : (
            <Upload className={isOver ? 'text-purple-400' : 'text-zinc-500'} size={32} />
          )}
        </div>

        <h3 className="text-2xl font-semibold mb-2">
          {isParsing ? 'Parsing Resume...' : 'Drop your resume'}
        </h3>
        <p className="text-zinc-500 text-center max-w-sm">
          {isParsing 
            ? 'We are extracting text from your PDF. Almost there.' 
            : 'Drag and drop your PDF here, or click to browse. We only accept PDF files for now.'}
        </p>

        {parseError && (
          <div className="mt-6 flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-full border border-red-400/20">
            <AlertCircle size={14} />
            {parseError}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {[
          { icon: <FileText size={16} />, label: 'PDF Only' },
          { icon: <Loader2 size={16} />, label: 'Fast Parsing' },
          { icon: <AlertCircle size={16} />, label: 'Safe & Secure' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-widest">
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UploadZone
