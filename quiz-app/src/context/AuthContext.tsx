// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { STUDENT_LOGIN_URL } from '../config/env'

interface AuthContextType {
  currentUser: string | null
  login: (studentID: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
}

const initialState: AuthContextType = {
  currentUser: null,
  login: async () => {
    return false
  },
  signup: async () => {},
  logout: () => {},
  error: null,
}

const AuthContext = createContext<AuthContextType>(initialState)

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(initialState.currentUser)
  const [error, setError] = useState<string | null>(initialState.error)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setCurrentUser(token)
    }
  }, [])

  const signup = async (email: string, password: string) => {
    try {
      const res = await axios.post('/api/auth/register', { email, password })
      localStorage.setItem('token', res.data.token)
      setCurrentUser(res.data.token)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Error during signup')
    }
  }

  const login = async (studentID: string, password: string) => {
    try {
      const res = await axios.post(STUDENT_LOGIN_URL, { studentID, password })

      localStorage.setItem('token', res.data.token)
      setCurrentUser(res.data.token)
      setError(null)
      return false
    } catch (err: unknown) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        console.error('Unexpected error:', err)
        setError('Unable to Login')
      }

      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setCurrentUser(null)
    setError(null)
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
