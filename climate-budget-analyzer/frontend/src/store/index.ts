'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: 'theme-storage',
    }
  )
)

interface AppState {
  documents: any[]
  budgetItems: any[]
  dashboardStats: any | null
  setDocuments: (docs: any[]) => void
  setBudgetItems: (items: any[]) => void
  setDashboardStats: (stats: any) => void
  resetData: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      documents: [],
      budgetItems: [],
      dashboardStats: null,
      setDocuments: (docs) => set({ documents: docs }),
      setBudgetItems: (items) => set({ budgetItems: items }),
      setDashboardStats: (stats) => set({ dashboardStats: stats }),
      resetData: () => set({ documents: [], budgetItems: [], dashboardStats: null }),
    }),
    {
      name: 'app-storage',
    }
  )
)
