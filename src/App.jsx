import React from 'react'
import { Sparkles } from 'lucide-react'
import useResumeStore from './store/resumeStore'
import UploadZone from './components/UploadZone'
import RoastPanel from './components/RoastPanel'
import ResumeBuilder from './components/ResumeBuilder'

function App() {
  const { currentMode, reset } = useResumeStore()

  const renderContent = () => {
    switch (currentMode) {
      case 'upload':
        return <UploadZone />
      case 'roast':
        return <RoastPanel />
      case 'rebuild':
        return <ResumeBuilder />
      default:
        return <UploadZone />
    }
  }

  // Dynamic Theme Classes
  const themeClasses = {
    upload: 'from-zinc-900 via-zinc-950 to-black',
    roast: 'from-zinc-950 via-orange-950/20 to-black',
    rebuild: 'from-zinc-950 via-emerald-950/20 to-black',
  }

  const borderClasses = {
    upload: 'border-white/10',
    roast: 'border-orange-600/50',
    rebuild: 'border-emerald-500/50',
  }

  return (
    <div className={`min-h-screen flex flex-col items-center p-6 transition-colors duration-1000 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${themeClasses[currentMode]}`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className={`absolute -top-1/4 -left-1/4 w-1/2 h-1/2 blur-[120px] rounded-full transition-colors duration-1000 
          ${currentMode === 'roast' ? 'bg-orange-600/10' : currentMode === 'rebuild' ? 'bg-emerald-600/10' : 'bg-purple-600/10'}`}></div>
        <div className={`absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 blur-[120px] rounded-full transition-colors duration-1000
          ${currentMode === 'roast' ? 'bg-red-600/10' : currentMode === 'rebuild' ? 'bg-teal-600/10' : 'bg-pink-600/10'}`}></div>
      </div>

      <nav className="w-full max-w-6xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${borderClasses[currentMode]}`}>
            <Sparkles size={16} className={currentMode === 'roast' ? 'text-orange-500' : currentMode === 'rebuild' ? 'text-emerald-400' : 'text-purple-400'} />
          </div>
          <span className="font-bold text-xl tracking-tight">Resume <span className="text-zinc-500">Roaster</span></span>
        </div>
        
        {currentMode !== 'upload' && (
          <button 
            onClick={reset}
            className="text-xs font-medium px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
          >
            Start Over
          </button>
        )}
      </nav>

      <div className="w-full max-w-6xl flex-1 flex flex-col items-center">
        {currentMode === 'upload' && (
          <header className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-xs font-medium tracking-wider uppercase text-zinc-400">AI Powered Resume Optimization</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4">
              Design your <span className="text-gradient">Future.</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Brutal roasts. Professional rebuilding. Zero fluff.
            </p>
          </header>
        )}

        <main className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          {renderContent()}
        </main>
      </div>

      <footer className="mt-24 text-zinc-500 text-sm border-t border-white/5 py-8 w-full max-w-6xl flex justify-between items-center">
        <p>© 2026 Resume Roaster. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-zinc-300">Privacy</a>
          <a href="#" className="hover:text-zinc-300">Terms</a>
        </div>
      </footer>
    </div>
  )
}

export default App


