import { defineStore } from 'pinia'
import axios from 'axios'

interface AuthState {
  token: string | null
  user: any | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const token = localStorage.getItem('token')

    let user: any | null = null
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        user = JSON.parse(userStr)
      } catch (_e) {
        user = null
      }
    }

    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    } else {
      delete axios.defaults.headers.common['Authorization']
    }

    return { token, user }
  },

  getters: {
    isAuthenticated: (state): boolean => !!state.token,
  },

  actions: {
    async login(username: string, password: string) {
      try {
        const { data } = await axios.post('http://localhost:3000/api/login', {
          username,
          password,
        })

        const token: string | null = data?.token ?? null
        const user: any | null = data?.user ?? null

        if (!token) {
          throw new Error('Token no recibido del servidor')
        }

        this.token = token
        this.user = user

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
        return true
      } catch (error) {
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      delete axios.defaults.headers.common['Authorization']
    },
  },
})
