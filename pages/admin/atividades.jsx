import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Clock, Eye, Filter } from 'lucide-react'

export default function AdminAtividades() {
  const { isAdmin, isManager } = useAuth()
  const router = useRouter()
  const [activities, setActivities] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [viewingActivity, setViewingActivity] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectionModal, setShowRejectionModal] = useState(false)

  useEffect(() => {
    if (!isAdmin && !isManager) {
      router.push('/dashboard')
      return
    }
    fetchActivities()
  }, [filter])

  async function fetchActivities() {
    setLoading(true)
    try {
      let query = supabase
        .from('activities')
        .select(`
          *,
          profiles(full_name, company),
          activity_types(name, default_points)
        `)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setActivities(data || [])
    } catch (err) {
      console.error('Erro ao buscar atividades:', err)
      toast.error('Erro ao carregar atividades')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(activity) {
    try {
      const { error } = await supabase
        .from('activities')
        .update({
          status: 'approved',
          points_awarded: activity.activity_types?.default_points * activity.quantity,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', activity.id)

      if (error) throw error

      // Criar notificação
      await supabase.from('notifications').insert({
        profile_id: activity.profile_id,
        type: 'approved',
        title: 'Atividade Aprovada!',
        message: `Sua atividade "${activity.title}" foi aprovada e você ganhou ${activity.activity_types?.default_points * activity.quantity} pontos!`,
        is_read: false
      })

      toast.success('Atividade aprovada com sucesso!')
      fetchActivities()
    } catch (err) {
      console.error('Erro ao aprovar:', err)
      toast.error('Erro ao aprovar atividade')
    }
  }

  async function handleReject(activity) {
    if (!rejectionReason.trim()) {
      toast.error('Informe o motivo da rejeição')
      return
    }

    try {
      const { error } = await supabase
        .from('activities')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', activity.id)

      if (error) throw error

      // Criar notificação
      await supabase.from('notifications').insert({
        profile_id: activity.profile_id,
        type: 'rejected',
        title: 'Atividade Rejeitada',
        message: `Sua atividade "${activity.title}" foi rejeitada. Motivo: ${rejectionReason}`,
        is_read: false
      })

      toast.success('Atividade rejeitada')
      setShowRejectionModal(false)
      setRejectionReason('')
      setViewingActivity(null)
      fetchActivities()
    } catch (err) {
      console.error('Erro ao rejeitar:', err)
      toast.error('Erro ao rejeitar atividade')
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#b45309', icon: Clock, label: 'Pendente' },
      approved: { bg: '#dcfce7', color: '#166534', icon: CheckCircle, label: 'Aprovado' },
      rejected: { bg: '#fee2e2', color: '#991b1b', icon: XCircle, label: 'Rejeitado' }
    }
    const s = styles[status] || styles.pending
    const Icon = s.icon
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 10px', borderRadius: 12,
        background: s.bg, color: s.color,
        fontSize: 11, fontWeight: 600
      }}>
        <Icon size={12} /> {s.label}
      </span>
    )
  }

  const filters = [
    { key: 'pending', label: 'Pendentes', color: '#f59e0b' },
    { key: 'approved', label: 'Aprovadas', color: '#10b981' },
    { key: 'rejected', label: 'Rejeitadas', color: '#ef4444' },
    { key: 'all', label: 'Todas', color: '#64748b' }
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Gerenciar Atividades</h1>
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Aprove ou rejeite atividades dos associados</p>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 16px',
              background: filter === f.key ? f.color : '#fff',
              color: filter === f.key ? '#fff' : '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Filter size={14} />
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Carregando...</p>
      ) : activities.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60,
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 12, color: '#94a3b8'
        }}>
          <Clock size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: 14 }}>Nenhuma atividade encontrada.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {activities.map((act) => (
            <div key={act.id} style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{act.title}</h3>
                    {getStatusBadge(act.status)}
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
                    <strong>{act.profiles?.full_name}</strong> · {act.profiles?.company}
                  </p>
                  <p style={{ fontSize: 12, color: '#94a3b8' }}>
                    {act.activity_types?.name} · Quantidade: {act.quantity} · Enviado em {new Date(act.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => setViewingActivity(act)}
                  style={{
                    padding: '6px 12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Eye size={14} /> Ver
                </button>
              </div>

              {act.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleApprove(act)}
                    style={{
                      padding: '8px 16px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <CheckCircle size={14} /> Aprovar
                  </button>
                  <button
                    onClick={() => {
                      setViewingActivity(act)
                      setShowRejectionModal(true)
                    }}
                    style={{
                      padding: '8px 16px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <XCircle size={14} /> Rejeitar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Visualização */}
      {viewingActivity && !showRejectionModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            maxWidth: 500,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Detalhes da Atividade</h2>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Título</label>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{viewingActivity.title}</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Descrição</label>
              <p style={{ fontSize: 14, color: '#1e293b' }}>{viewingActivity.description || '—'}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Associado</label>
                <p style={{ fontSize: 14 }}>{viewingActivity.profiles?.full_name}</p>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Tipo</label>
                <p style={{ fontSize: 14 }}>{viewingActivity.activity_types?.name}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Quantidade</label>
                <p style={{ fontSize: 14 }}>{viewingActivity.quantity}</p>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Pontos</label>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1a5c3a' }}>
                  {viewingActivity.points_awarded || viewingActivity.activity_types?.default_points * viewingActivity.quantity} pts
                </p>
              </div>
            </div>

            {viewingActivity.rejection_reason && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Motivo da Rejeição</label>
                <p style={{ fontSize: 14, color: '#dc2626' }}>{viewingActivity.rejection_reason}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setViewingActivity(null)
                  setShowRejectionModal(false)
                }}
                style={{
                  padding: '8px 16px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Rejeição */}
      {showRejectionModal && viewingActivity && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            maxWidth: 400,
            width: '90%'
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#dc2626' }}>
              Rejeitar Atividade
            </h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                Motivo da Rejeição *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explique por que esta atividade foi rejeitada..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 13,
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowRejectionModal(false)
                  setRejectionReason('')
                  setViewingActivity(null)
                }}
                style={{
                  padding: '8px 16px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleReject(viewingActivity)}
                style={{
                  padding: '8px 16px',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
