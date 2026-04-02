'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const AuthContext = createContext(null)

const supabase = createClient()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('id', session.user.id)
            .single()
            
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: profile?.name || '',
            role: profile?.role || 'creator'
          })
        }
      } catch (error) {
        console.error('Error in initAuth:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('id', session.user.id)
            .single()
            
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: profile?.name || '',
            role: profile?.role || 'creator'
          })
        } catch (error) {
          console.error('Error fetching profile on auth change:', error)
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    
    if (data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', data.user.id)
        .single()
        
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || '',
        role: profile?.role || 'creator'
      })
    }
    
    return data
  }

  const register = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { name } 
      }
    })
    
    if (error) throw error
    
    // Wait 500ms for trigger to create profile
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', data.user.id)
        .single()
        
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || name || '',
        role: profile?.role || 'creator'
      })
    }
    
    return data
  }

  const updateProfile = async ({ name }) => {
    const { error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', user.id)
    if (error) throw error
    setUser(prev => ({ ...prev, name }))
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      router.push('/')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
