import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { Calendar, Receipt, Camera, Handshake, CheckCircle, Clock, XCircle, Activity } from 'lucide-react'

export default function Atividades() {
  const { profile } = useAuth()
  const [activityTypes, setActivityTypes] = useState([])
  const [myActivities, setMyActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', quantity: 1 })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (profile?.id) {
      fetchData()
    }
  }, [profile])

  async function fetchData() {
    if (!profile?.id) return
    
    setLoading(true)
    try {
      // Buscar tipos de atividade
      const { data: types, error: typesError } = await supabase
        .from('activity_types')
        .select('*')
        .eq('is_active', true)
        .order('display_order')

      if (typesError) {
        console.error('Erro ao buscar tipos:', typesError)
      } else {
        setActivityTypes(types || [])
      }

      // Buscar atividades do usuário
      const { data: activities, error: activitiesError } = await supabase
        .from('activities')
        .select(`
          *,
          activity_types(name, icon, default_points)
        `)
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (activitiesError) {
        console.error('Erro ao buscar atividades:', activitiesError)
      } else {
        setMyActivities(activities || [])
      }
    } catch (err) {
      console.error('Erro geral:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedType || !profile?.id) {
      toast.error('Dados incompletos. Tente novamente.')
      return
    }

    setUploading(true)
    try {
      // Buscar temporada ativa
      const { data: season, error: seasonError } = await supabase
        .from('seasons')
        .select('id')
        .eq('name', 'Temporada 2026')
        .single()

      if (seasonError || !season) {
        throw new Error('Temporada 2026 não encontrada')
      }

      const { data, error } = await supabase
        .from('activities')
        .insert([{
          profile_id: profile.id,
          activity_type_id: selectedType.id,
          season_id: season.id,
          title: formData.title || selectedType.name,
          description: formData.description,
          quantity: formData.quantity,
          status: selectedType.requires_approval ? 'pending' : 'approved',
          points_awarded: selectedType.requires_approval ? 0 : selectedType.default_points * formData.quantity,
          event_date: new Date().toISOString().split('T')[0]
        }])
        .select()

      if (error) throw error

      toast.success(
        selectedType.requires_approval
          ? 'Atividade enviada! Aguardando aprovação.'
          : 'Atividade registrada! Pontos creditados.'
      )

      setShowForm(false)
      setSelectedType(null)
      setFormData({ title: '', description: '', quantity: 1 })
      fetchData()
    } catch (err) {
      console.error('Erro:', err)
      toast.error(err.message || 'Erro ao enviar atividade')
    } finally {
      setUploading(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#b45309', icon: <Clock size={12} />, label: 'Pendente' },
      approved: { bg: '#dcfce7', color: '#166534', icon: <CheckCircle size={12} />, label: 'Aprovado' },
      rejected: { bg: '#fee2e2', color: '#991b1b', icon: <XCircle size={12} />, label: 'Rejeitado' }
    }
    const s = styles[status] || styles.pending
    const Icon = s.icon
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 12,
        background: s.bg, color: s.color,
        fontSize: 11, fontWeight: 600
      }}>
        <Icon size={12} /> {s.label}
      </span>
    )
  }

  const icons = { Calendar, Receipt, Camera, Handshake }

  if (!profile) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
        Carregando...
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Registrar Atividade</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Escolha o tipo de atividade para ganhar pontos</p>
        </div>
      </div>

      {!showForm && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 24 }}>
          {activityTypes.map((type) => {
            const IconComponent = icons[type.icon] || Calendar
            return (
              <div
                key={type.id}
                onClick={() => { setSelectedType(type); setShowForm(true) }}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 20,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2d8f5a'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={{
                  position: 'absolute', top: 16, right: 16,
                  background: '#e8f5ee', color: '#1a5c3a',
                  fontSize: 11, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 12
                }}>
                  +{type.default_points} pts
                </span>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: '#e8f5ee',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12
                }}>
                  <IconComponent size={20} style={{ color: '#1a5c3a' }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                  {type.name}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>
                  {type.description || 'Registre sua participação'}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && selectedType && (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                background: 'none', border: 'none', color: '#94a3b8',
                cursor: 'pointer', fontSize: 14
              }}
            >
              ← Voltar
            </button>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
              {selectedType.name}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: '#64748b', marginBottom: 6
              }}>
                Título da atividade
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Participação na Rota de Agosto"
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 10,
                  fontSize: 14, outline: 'none'
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: '#64748b', marginBottom: 6
              }}>
                Descrição / Detalhes
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva a atividade realizada..."
                rows={3}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 10,
                  fontSize: 14, outline: 'none', resize: 'vertical'
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: '#64748b', marginBottom: 6
              }}>
                Quantidade
              </label>
              <input
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                style={{
                  width: 100, padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 10,
                  fontSize: 14, outline: 'none'
                }}
              />
              <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 10 }}>
                Total estimado: <strong style={{ color: '#1a5c3a' }}>{selectedType.default_points * formData.quantity} pts</strong>
              </span>
            </div>
            <button
              type="submit"
              disabled={uploading}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #2d8f5a, #1a5c3a)',
                color: 'white', border: 'none', borderRadius: 10,
                fontSize: 14, fontWeight: 600,
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.7 : 1
              }}
            >
              {uploading ? 'Enviando...' : 'Enviar Atividade'}
            </button>
          </form>
        </div>
      )}

      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={18} />
          Suas Atividades Recentes
        </h2>
        {loading ? (
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Carregando...</p>
        ) : myActivities.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Nenhuma atividade registrada ainda.</p>
        ) : (
          myActivities.map((act) => (
            <div key={act.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              marginBottom: 8
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: act.status === 'approved' ? '#16a34a' : act.status === 'rejected' ? '#dc2626' : '#f59e0b',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                  {act.title}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  {act.activity_types?.name} · Enviado em {new Date(act.created_at).toLocaleDateString('pt-BR')}
                  {act.reviewed_at && ` · ${act.status === 'approved' ? 'Aprovado' : 'Rejeitado'} em ${new Date(act.reviewed_at).toLocaleDateString('pt-BR')}`}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: act.status === 'rejected' ? '#dc2626' : act.status === 'approved' ? '#1a5c3a' : '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>
                {act.status === 'rejected' ? '0' : act.points_awarded !== null ? `+${act.points_awarded}` : '—'}
              </div>
              <div>
                {getStatusBadge(act.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
