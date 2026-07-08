'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react'
import { useAppStore } from '@/store'
import { formatCurrency } from '@/lib/utils'

interface BudgetItem {
  id: string
  ro_code: string
  ro_name: string
  opd_name: string
  sector: string
  amount: number
  tag_code: string
  tag_label: string
  activity_type: string
  justification: string
}

export function AnalisisCBT() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Sample data for demonstration
  const sampleData: BudgetItem[] = [
    {
      id: '1',
      ro_code: '2.01.01.001',
      ro_name: 'Penyediaan Jasa Administrasi Perkantoran',
      opd_name: 'Dinas Lingkungan Hidup',
      sector: 'Infrastruktur',
      amount: 5000000000,
      tag_code: '004',
      tag_label: 'Mitigasi',
      activity_type: 'Core',
      justification: 'Kegiatan ini mendukung mitigasi perubahan iklim melalui pengurangan emisi dari operasional kantor dengan penerapan green office.',
    },
    {
      id: '2',
      ro_code: '2.01.02.002',
      ro_name: 'Pengembangan Sistem Drainase',
      opd_name: 'Dinas PU',
      sector: 'Infrastruktur',
      amount: 15000000000,
      tag_code: '007',
      tag_label: 'Adaptasi',
      activity_type: 'Core',
      justification: 'Sistem drainase yang baik membantu adaptasi terhadap banjir dan cuaca ekstrem akibat perubahan iklim.',
    },
    {
      id: '3',
      ro_code: '2.02.01.003',
      ro_name: 'Program Penanaman Hutan Kota',
      opd_name: 'Dinas Kehutanan',
      sector: 'Kehutanan',
      amount: 8000000000,
      tag_code: '004',
      tag_label: 'Mitigasi',
      activity_type: 'Core',
      justification: 'Penanaman hutan kota meningkatkan penyerapan karbon dan mengurangi efek urban heat island.',
    },
  ]

  const sectors = ['all', 'Kehutanan', 'Infrastruktur', 'Energi', 'Pertanian']
  const tags = ['all', '004', '007', '000']

  const filteredData = sampleData.filter((item) => {
    const matchesSearch = item.ro_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.ro_code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = selectedSector === 'all' || item.sector === selectedSector
    const matchesTag = selectedTag === 'all' || item.tag_code === selectedTag
    
    return matchesSearch && matchesSector && matchesTag
  })

  const getTagColor = (tagCode: string) => {
    switch (tagCode) {
      case '004': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case '007': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'Core' 
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
  }

  const totalMitigation = sampleData
    .filter(i => i.tag_code === '004')
    .reduce((sum, i) => sum + i.amount, 0)
  
  const totalAdaptation = sampleData
    .filter(i => i.tag_code === '007')
    .reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm">
          <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Mitigasi</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalMitigation)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-l-4 border-amber-500 shadow-sm">
          <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Adaptasi</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalAdaptation)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-l-4 border-emerald-500 shadow-sm">
          <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-1">Kegiatan Core</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {sampleData.filter(i => i.activity_type === 'Core').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode RO atau nama kegiatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0047BB] focus:border-transparent"
          />
        </div>
        
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0047BB]"
        >
          {sectors.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'Semua Sektor' : s}</option>
          ))}
        </select>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0047BB]"
        >
          {tags.map(t => (
            <option key={t} value={t}>
              {t === 'all' ? 'Semua Tag' : t === '004' ? 'Mitigasi (004)' : t === '007' ? 'Adaptasi (007)' : 'Non-Iklim (000)'}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kode RO</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Kegiatan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">OPD</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sektor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tag</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Anggaran</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredData.map((item) => (
                <>
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{item.ro_code}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-xs truncate">{item.ro_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{item.opd_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{item.sector}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(item.tag_code)}`}>
                        {item.tag_label} ({item.tag_code})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.activity_type)}`}>
                        {item.activity_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900 dark:text-white">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        {expandedRow === item.id ? (
                          <ChevronUp className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRow === item.id && (
                    <tr className="bg-slate-50 dark:bg-slate-900/30">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="prose dark:prose-invert max-w-none">
                          <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Justifikasi AI:</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{item.justification}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
