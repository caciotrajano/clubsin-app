import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Erro ao buscar perfil:', error)
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err)
    } finally {
      setLoading(false)
    }
  }

  // Ler role do JWT (app_metadata) em vez da tabela profiles
  const userRole = user?.app_metadata?.role || user?.user_metadata?.role || 'member'
  const isAdmin = userRole === 'admin'
  const isManager = userRole === 'manager' || userRole === 'admin'

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    isManager,
    userRole,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    refreshProfile: async () => {
      if (user) await fetchProfile(user.id)
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
