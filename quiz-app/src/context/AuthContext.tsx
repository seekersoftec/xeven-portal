import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { students } from '../data/Users'

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
    // Simulate a signup process
    try {
      // Signup logic here
      // This example doesn't implement signup because we're focusing on login
      setError(null)
    } catch (err) {
      setError('Error during signup')
    }
  }

  const login = async (studentID: string, password: string) => {
    try {
      let student

      // Check if the studentID is an email using a simple regex
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentID)

      if (isEmail) {
        student = Object.values(students).find(
          (student) => student.email === studentID && student.password === password
        )
      } else {
        student = Object.values(students).find(
          (student) =>
            student.rollNum.toString() === studentID && student.password === password
        )
      }

      if (student) {
        if (!student.hasPaidSchoolFee) {
          setError('School fees have not been paid')
          return false
        }
        const token = `${student.rollNum}-${student.name}` // Generate a simple token
        localStorage.setItem('token', token)
        setCurrentUser(token)
        setError(null)
        return true
      } else {
        setError('Invalid student ID or password')
        return false
      }
    } catch (err: unknown) {
      console.error('Unexpected error:', err)
      setError('Unable to Login')
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
