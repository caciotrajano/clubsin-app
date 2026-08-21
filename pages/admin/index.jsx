import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import { Activity, Users, Trophy, CheckCircle, Clock, XCircle } from 'lucide-react'

export default function AdminDashboard() {
  const { isAdmin, isManager } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingActivities: 0,
    approvedActivities: 0,
    totalPoints: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin && !isManager) {
      router.push('/dashboard')
      return
    }
    fetchStats()
  }, [isAdmin, isManager])

  async function fetchStats() {
    setLoading(true)
    try {
      // Total de usuários
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Atividades pendentes
      const { count: pendingCount } = await supabase
        .from('activities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Atividades aprovadas
      const { count: approvedCount } = await supabase
        .from('activities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')

      // Total de pontos distribuídos
      const { data: pointsData } = await supabase
        .from('activities')
        .select('points_awarded')
        .eq('status', 'approved')

      const totalPoints = pointsData?.reduce((sum, act) => sum + (act.points_awarded || 0), 0) || 0

      setStats({
        totalUsers: userCount || 0,
        pendingActivities: pendingCount || 0,
        approvedActivities: approvedCount || 0,
        totalPoints
      })
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      label: 'Total de Associados',
      value: stats.totalUsers,
      icon: Users,
      color: '#3b82f6',
      bg: '#eff6ff'
    },
    {
      label: 'Atividades Pendentes',
      value: stats.pendingActivities,
      icon: Clock,
      color: '#f59e0b',
      bg: '#fffbeb'
    },
    {
      label: 'Atividades Aprovadas',
      value: stats.approvedActivities,
      icon: CheckCircle,
      color: '#10b981',
      bg: '#ecfdf5'
    },
    {
      label: 'Pontos Distribuídos',
      value: stats.totalPoints,
      icon: Trophy,
      color: '#8b5cf6',
      bg: '#f5f3ff'
    }
  ]

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Carregando...</div>
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Painel Administrativo</h1>
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Visão geral do sistema de gamificação</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 24 }}>
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10,
                background: stat.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={24} style={{ color: stat.color }} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{stat.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <div
          onClick={() => router.push('/admin/atividades')}
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: 24,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2d8f5a'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Activity size={20} style={{ color: '#1a5c3a' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Gerenciar Atividades</h3>
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
            Aprovar ou rejeitar atividades pendentes dos associados
          </p>
          {stats.pendingActivities > 0 && (
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: '#fef3c7',
              color: '#b45309',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600
            }}>
              {stats.pendingActivities} pendente(s)
            </span>
          )}
        </div>

        <div
          onClick={() => router.push('/admin/tipos')}
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: 24,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2d8f5a'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Trophy size={20} style={{ color: '#1a5c3a' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Tipos de Atividades</h3>
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
            Gerenciar tipos de atividades e pontuações
          </p>
        </div>
      </div>
    </div>
  )
}
