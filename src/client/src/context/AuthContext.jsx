import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

function isExpired(token) {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) return true
  return payload.exp * 1000 < Date.now()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (t && !isExpired(t)) {
      const payload = decodeJWT(t)
      if (payload) {
        setToken(t)
        setUser({ userId: payload.userId, role: payload.role })
      } else {
        localStorage.removeItem('token')
      }
    } else {
      localStorage.removeItem('token')
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const json = await res.json()
    
    if (!res.ok) {
      throw new Error(json.msg || 'Login failed')
    }
    
    if (json.token) {
      localStorage.setItem('token', json.token)
      const payload = decodeJWT(json.token)
      setToken(json.token)
      setUser({ userId: payload.userId, role: payload.role })
    }
    
    return json
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  function getAuthHeader() {
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  function hasRole(role) {
    if (!user) return false
    return Array.isArray(role) ? role.includes(user.role) : user.role === role
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    getAuthHeader,
    hasRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
