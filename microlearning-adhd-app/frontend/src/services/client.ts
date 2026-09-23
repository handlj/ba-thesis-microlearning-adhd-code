import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? `${import.meta.env.BASE_URL}api`

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
