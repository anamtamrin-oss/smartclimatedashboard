'use client'

import { ThemeToggle } from './ThemeToggle'
import { Upload, RotateCcw } from 'lucide-react'
import { useAppStore } from '@/store'

interface HeaderProps {
  onUpload?: () => void
  onReset?: () => void
}

export function Header({ onUpload, onReset }: HeaderProps) {
  const { resetData } = useAppStore()

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mereset semua data?')) {
      resetData()
      onReset?.()
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Climate Budget AI-Analyzer
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Platform Analisis Anggaran Iklim Daerah
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Data</span>
          </button>

          {onUpload && (
            <button
              onClick={onUpload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0047BB] hover:bg-blue-700 text-white transition-colors shadow-lg shadow-blue-500/30"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
