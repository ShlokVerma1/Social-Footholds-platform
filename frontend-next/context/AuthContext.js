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
        const { data: { user: authUser }, error } = await supabase.auth.getUser()

        if (!authUser || error) {
          setLoading(false)
          return
        }

        // Robust profile fetch: select only known safe columns first or handle failure
        let { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, role, phone')
          .eq('id', authUser.id)
          .limit(1)

        // Fallback if 'phone' column is missing or query fails
        if (profileError || !profileData?.length) {
          const { data: fbData } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('id', authUser.id)
            .limit(1)
          profileData = fbData
        }

        const profile = profileData?.[0] || null

        setUser({
          id: authUser.id,
          email: authUser.email,
          name: profile?.name || '',
          role: profile?.role || 'creator',
          phone: profile?.phone || ''
        })
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
          let { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('name, role, phone')
            .eq('id', session.user.id)
            .limit(1)

          if (profileError || !profileData?.length) {
            const { data: fbData } = await supabase
              .from('profiles')
              .select('name, role')
              .eq('id', session.user.id)
              .limit(1)
            profileData = fbData
          }

          const profile = profileData?.[0] || null

          setUser({
            id: session.user.id,
            email: session.user.email,
            name: profile?.name || '',
            role: profile?.role || 'creator',
            phone: profile?.phone || ''
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
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, role, phone')
        .eq('id', data.user.id)
        .limit(1)

      if (profileError || !profileData?.length) {
        const { data: fbData } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', data.user.id)
          .limit(1)
        profileData = fbData
      }

      const profile = profileData?.[0] || null

      setUser({
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || '',
        role: profile?.role || 'creator',
        phone: profile?.phone || ''
      })
    }

    return data
  }

  const register = async (email, password, name, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone }
      }
    })

    if (error) throw error

    await new Promise(resolve => setTimeout(resolve, 500))

    if (data?.user) {
      if (phone) {
        await supabase
          .from('profiles')
          .update({ phone })
          .eq('id', data.user.id)
      }

      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, role, phone')
        .eq('id', data.user.id)
        .limit(1)

      if (profileError || !profileData?.length) {
        const { data: fbData } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', data.user.id)
          .limit(1)
        profileData = fbData
      }

      const profile = profileData?.[0] || null

      setUser({
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || name || '',
        role: profile?.role || 'creator',
        phone: profile?.phone || phone || ''
      })
    }

    return data
  }

  const updateProfile = async ({ name, phone }) => {
    const updates = {}
    if (name !== undefined) updates.name = name
    if (phone !== undefined) updates.phone = phone
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    if (error) throw error
    setUser(prev => ({ ...prev, ...updates }))
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
