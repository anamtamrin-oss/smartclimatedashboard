'use client'

import { useState } from 'react'
import { Upload, X, FileText, CheckCircle } from 'lucide-react'
import { documentsAPI } from '@/lib/api'
import { useAppStore } from '@/store'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { setDocuments } = useAppStore()

  if (!isOpen) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      await uploadFile(files[0])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      await uploadFile(files[0])
    }
  }

  const uploadFile = async (file: File) => {
    // Validate file size (25MB max)
    if (file.size > 25 * 1024 * 1024) {
      alert('Ukuran file melebihi 25MB')
      return
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.csv', '.xlsx', '.xls']
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!allowedTypes.includes(fileExt)) {
      alert('Tipe file tidak didukung. Gunakan PDF, CSV, atau Excel.')
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await documentsAPI.upload(file)
      
      clearInterval(progressInterval)
      setProgress(100)

      // Update store
      const docs = await documentsAPI.list()
      setDocuments(docs.data)

      setTimeout(() => {
        onClose()
        setUploading(false)
        setProgress(0)
      }, 1000)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Gagal mengupload file')
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Upload Dokumen Anggaran
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!uploading ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-[#0047BB] bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Drag & drop file di sini
              </h4>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                atau klik untuk memilih file
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Format: PDF, CSV, XLSX | Max: 25MB
              </p>
              <input
                type="file"
                accept=".pdf,.csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block mt-4 px-6 py-3 bg-[#0047BB] hover:bg-blue-700 text-white rounded-xl cursor-pointer transition-colors"
              >
                Pilih File
              </label>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                {progress === 100 ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <FileText className="w-8 h-8 text-[#0047BB]" />
                )}
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {progress === 100 ? 'Upload Berhasil!' : 'Memproses...'}
              </h4>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-4">
                <div
                  className="bg-[#0047BB] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {progress}% selesai
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
