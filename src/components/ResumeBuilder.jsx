import React, { useState, useEffect } from 'react'
import { CheckCircle, Save, Download, Sparkles, Wand2, Type } from 'lucide-react'
import useResumeStore from '../store/resumeStore'
import ExportButton from './ExportButton'

const ResumeBuilder = () => {
  const { rebuiltText, originalText, setRebuiltText } = useResumeStore()
  const [content, setContent] = useState('')

  useEffect(() => {
    // If we have rebuilt text, use it. Otherwise, default to original to start.
    setContent(rebuiltText || originalText)
  }, [rebuiltText, originalText])

  const handleSave = () => {
    setRebuiltText(content)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="text-emerald-500" size={18} />
            <h2 className="text-2xl font-bold text-emerald-400">Optimization Center</h2>
          </div>
          <p className="text-zinc-500 text-sm">Fine-tune your AI-generated masterpiece before exporting.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-300 hover:bg-zinc-800 transition-colors text-sm font-medium"
          >
            <Save size={16} />
            Save Draft
          </button>
          <ExportButton text={content} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Editor Wrapper */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card rounded-3xl border-emerald-500/20 bg-emerald-500/5 p-1">
             <div className="bg-zinc-950/80 rounded-[1.4rem] p-6">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                  <Type className="text-emerald-500/50" size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Document Editor</span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[800px] bg-transparent border-none outline-none resize-none text-zinc-300 font-serif text-lg leading-relaxed selection:bg-emerald-500/20"
                  placeholder="Start building your resume..."
                />
             </div>
          </div>
        </div>

        {/* Sidebar / Tools */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-500" />
              AI Suggestions
            </h4>
            <div className="space-y-3">
              {[
                "Use more action verbs in your recent role.",
                "Quantify your achievements with percentages.",
                "Simplify your technical skills list."
              ].map((tip, i) => (
                <div key={i} className="text-[11px] p-3 rounded-lg bg-white/5 border border-white/5 text-zinc-400 hover:border-emerald-500/30 transition-colors cursor-pointer">
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 mb-4">
              <Wand2 className="text-emerald-400" size={20} />
            </div>
            <h4 className="text-sm font-bold mb-2 text-white">Smart Rewrite</h4>
            <p className="text-[10px] text-zinc-500 mb-4 leading-relaxed">
              Highlight any section of your resume to rewrite it with AI for better ATS scoring.
            </p>
            <button className="w-full py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500/30 transition-colors">
              Magic Select
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
