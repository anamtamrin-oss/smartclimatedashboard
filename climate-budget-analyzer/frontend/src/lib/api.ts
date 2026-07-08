import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (data: any) => 
    api.post('/auth/register', data),
  me: () => 
    api.get('/auth/me'),
}

// Document APIs
export const documentsAPI = {
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  list: () => api.get('/documents/'),
  get: (id: string) => api.get(`/documents/${id}`),
  delete: (id: string) => api.delete(`/documents/${id}`),
}

// Budget Items APIs
export const budgetItemsAPI = {
  list: (params?: any) => api.get('/budget-items/', { params }),
  stats: () => api.get('/budget-items/stats'),
  sectorDistribution: () => api.get('/budget-items/sector-distribution'),
  mitigationAdaptationRatio: () => api.get('/budget-items/mitigation-adaptation-ratio'),
}

// EFT Calculator APIs
export const eftAPI = {
  calculate: (data: any) => api.post('/eft/calculate', data),
  recommendations: () => api.get('/eft/recommendations'),
}

// Config APIs
export const configAPI = {
  get: () => api.get('/config/'),
  update: (data: any) => api.put('/config/', data),
}
