import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function Login() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await signIn(email, password)
      if (error) throw error
      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e8f5ee 0%, #f8fafc 100%)'
    }}>
      <div style={{
        background: '#fff',
        padding: 40,
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        width: '100%',
        maxWidth: 400
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg, #2d8f5a, #1a5c3a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 28,
            margin: '0 auto 16px'
          }}>
            C
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>Clubsin Ceará</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Portal do Associado — Gamificação & Pontuação</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 14px',
                border: '1px solid #e2e8f0', borderRadius: 10,
                fontSize: 14, outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 14px',
                border: '1px solid #e2e8f0', borderRadius: 10,
                fontSize: 14, outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #2d8f5a, #1a5c3a)',
              color: 'white', border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}