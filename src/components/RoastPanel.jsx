import React from 'react'
import { Flame, AlertTriangle, ArrowRight, Zap, Target, Loader2 } from 'lucide-react'
import useResumeStore from '../store/resumeStore'
import { useGeminiRoast } from '../hooks/useGeminiRoast'

const RoastPanel = () => {
  const { originalText, roastFeedback, isLoading } = useResumeStore()
  const { rebuildResume, isProcessing } = useGeminiRoast()
  
  // Display data from feedback or placeholder
  const feedback = roastFeedback || {
    score: 0,
    feedback: isLoading ? "The Roaster is sharpening their knives... Preparing the most brutal review of your career." : "Check your API key. The roast could not be generated.",
    roastItems: isLoading ? ["Igniting the flames...", "Analyzing your failures...", "Consulting the recruiters council..."] : ["Error: No feedback received."]
  }

  const handleRebuild = async () => {
    if (!originalText || !roastFeedback) return
    await rebuildResume(originalText, roastFeedback)
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
      {/* Left: Original Text */}
      <div className="glass-card rounded-3xl overflow-hidden flex flex-col border-white/5">
        <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Original Resume</h3>
          <span className="text-[10px] text-zinc-500 font-mono">TEXT_MODE</span>
        </div>
        <div className="p-8 overflow-y-auto max-h-[700px] font-mono text-sm leading-relaxed text-zinc-400 whitespace-pre-wrap text-left">
          {originalText || "No text extracted."}
        </div>
      </div>

      {/* Right: Roast Feedback */}
      <div className="flex flex-col gap-6">
        <div className={`glass-card rounded-3xl p-8 border-orange-600/30 bg-orange-600/5 relative overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center justify-between mb-8 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center border border-orange-600/50">
                {isLoading ? <Loader2 className="text-orange-500 animate-spin" size={20} /> : <Flame className="text-orange-500" size={20} />}
              </div>
              <h2 className="text-2xl font-bold text-orange-500 text-left">
                {isLoading ? 'Roasting...' : 'The Roast'}
              </h2>
            </div>
            {!isLoading && (
              <div className="flex flex-col items-end">
                <span className="text-4xl font-black text-orange-500">{feedback.score}<span className="text-sm text-orange-600/50">/100</span></span>
                <span className="text-[10px] uppercase font-bold tracking-tighter text-orange-600">Burn Score</span>
              </div>
            )}
          </div>

          <p className="text-orange-100/80 leading-relaxed italic mb-8 border-l-2 border-orange-600/50 pl-4 py-1 text-left">
            "{feedback.feedback}"
          </p>

          <div className="space-y-4">
            {feedback.roastItems.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-orange-100/70 leading-relaxed text-left">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-6 rounded-2xl border-white/5 opacity-50 cursor-not-allowed text-left">
            <div className="mb-2 text-zinc-500"><Zap size={20} /></div>
            <h4 className="text-sm font-semibold mb-1">Regenerate Roast</h4>
            <p className="text-[10px] text-zinc-600">Meaner, faster, better.</p>
          </div>
          <button 
            onClick={handleRebuild}
            disabled={isProcessing || isLoading || !roastFeedback}
            className="group flex flex-col items-start p-6 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 transition-all border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="mb-2 text-emerald-600">
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Target size={20} />}
            </div>
            <div className="flex items-center gap-2 w-full justify-between">
              <h4 className="text-sm font-bold">{isProcessing ? 'Optimizing...' : 'Fix Everything'}</h4>
              {(!isProcessing && !isLoading && roastFeedback) && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </div>
            <p className="text-[10px] text-zinc-500 text-left">Generate optimized version.</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoastPanel
