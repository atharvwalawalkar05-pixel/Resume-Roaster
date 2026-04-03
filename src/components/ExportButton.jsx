import React from 'react'
import { Download, Loader2 } from 'lucide-react'
import { jsPDF } from 'jspdf'

const ExportButton = ({ text }) => {
  const [exporting, setExporting] = React.useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
      })

      // Simple formatting for now
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      
      const margin = 40
      const pageWidth = doc.internal.pageSize.getWidth()
      const maxWidth = pageWidth - (margin * 2)
      
      const lines = doc.splitTextToSize(text || "No content found.", maxWidth)
      
      doc.text(lines, margin, margin + 20)
      
      doc.save('optimized-resume.pdf')
    } catch (err) {
      console.error('Export error:', err)
      alert('Failed to export PDF.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <button 
      onClick={handleExport}
      disabled={exporting || !text}
      className={`flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-all font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] 
        ${(exporting || !text) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
    >
      {exporting ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <Download size={18} />
      )}
      {exporting ? 'Exporting...' : 'Export PDF'}
    </button>
  )
}

export default ExportButton
