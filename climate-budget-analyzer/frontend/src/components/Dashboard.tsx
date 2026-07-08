'use client'

import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useAppStore } from '@/store'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { TrendingUp, Leaf, DollarSign, FileText } from 'lucide-react'

const COLORS = ['#0047BB', '#FDB913', '#10B981', '#F59E0B']

export function Dashboard() {
  const { dashboardStats, budgetItems } = useAppStore()

  // Sample data for demonstration
  const sectorData = [
    { name: 'Kehutanan', amount: 25000000000 },
    { name: 'Infrastruktur', amount: 35000000000 },
    { name: 'Energi', amount: 15000000000 },
    { name: 'Pertanian', amount: 20000000000 },
  ]

  const mitigationData = [
    { name: 'Mitigasi', value: 45, color: '#0047BB' },
    { name: 'Adaptasi', value: 30, color: '#FDB913' },
    { name: 'Non-Iklim', value: 25, color: '#94A3B8' },
  ]

  const stats = [
    {
      title: 'Total Anggaran',
      value: formatCurrency(95000000000),
      icon: DollarSign,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Anggaran Iklim',
      value: '75%',
      icon: Leaf,
      color: 'bg-green-500',
      trend: '+5%',
    },
    {
      title: 'Funding Gap',
      value: formatCurrency(5000000000),
      icon: TrendingUp,
      color: 'bg-amber-500',
      trend: '-8%',
    },
    {
      title: 'Total RO',
      value: formatNumber(156),
      icon: FileText,
      color: 'bg-purple-500',
      trend: '+3',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-500">{stat.trend}</span>
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Distribusi Anggaran per Sektor
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sectorData}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `Rp ${(value / 1e9).toFixed(1)}B`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="amount" fill="#0047BB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mitigation vs Adaptation */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Komposisi Mitigasi vs Adaptasi
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mitigationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {mitigationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value}%`}
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
