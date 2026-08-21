import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'

export default function AdminTipos() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingType, setEditingType] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    default_points: 1,
    requires_approval: true,
    is_active: true,
    display_order: 0
  })

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard')
      return
    }
    fetchTypes()
  }, [])

  async function fetchTypes() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('activity_types')
        .select('*')
        .order('display_order')

      if (error) throw error
      setTypes(data || [])
    } catch (err) {
      console.error('Erro ao buscar tipos:', err)
      toast.error('Erro ao carregar tipos de atividade')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      if (editingType) {
        const { error } = await supabase
          .from('activity_types')
          .update(formData)
          .eq('id', editingType.id)

        if (error) throw error
        toast.success('Tipo de atividade atualizado!')
      } else {
        const { error } = await supabase
          .from('activity_types')
          .insert([formData])

        if (error) throw error
        toast.success('Tipo de atividade criado!')
      }

      setShowForm(false)
      setEditingType(null)
      setFormData({
        name: '',
        slug: '',
        description: '',
        default_points: 1,
        requires_approval: true,
        is_active: true,
        display_order: 0
      })
      fetchTypes()
    } catch (err) {
      console.error('Erro:', err)
      toast.error('Erro ao salvar tipo de atividade')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja excluir este tipo de atividade?')) return

    try {
      const { error } = await supabase
        .from('activity_types')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Tipo de atividade excluído!')
      fetchTypes()
    } catch (err) {
      console.error('Erro:', err)
      toast.error('Erro ao excluir tipo de atividade')
    }
  }

  function handleEdit(type) {
    setEditingType(type)
    setFormData({
      name: type.name,
      slug: type.slug,
      description: type.description || '',
      default_points: type.default_points,
      requires_approval: type.requires_approval,
      is_active: type.is_active,
      display_order: type.display_order || 0
    })
    setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Tipos de Atividades</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Gerencie os tipos de atividades disponíveis</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #2d8f5a, #1a5c3a)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Plus size={16} /> Novo Tipo
        </button>
      </div>

      {showForm && (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
            {editingType ? 'Editar Tipo' : 'Novo Tipo de Atividade'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 13
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                  required
                  placeholder="ex: rota-clubsin"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 13
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Pontos Padrão *</label>
                <input
                  type="number"
                  value={formData.default_points}
                  onChange={(e) => setFormData({ ...formData, default_points: parseInt(e.target.value) || 0 })}
                  min="0"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 13
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Ordem de Exibição</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  min="0"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 13
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.requires_approval}
                  onChange={(e) => setFormData({ ...formData, requires_approval: e.target.checked })}
                  style={{ width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: '#1e293b' }}>Requer aprovação</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  style={{ width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: '#1e293b' }}>Ativo</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingType(null)
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
                type="submit"
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #2d8f5a, #1a5c3a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {editingType ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Carregando...</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {types.map((type) => (
            <div key={type.id} style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: type.is_active ? '#e8f5ee' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Calendar size={20} style={{ color: type.is_active ? '#1a5c3a' : '#94a3b8' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{type.name}</h3>
                    {!type.is_active && (
                      <span style={{
                        padding: '2px 8px',
                        background: '#f1f5f9',
                        color: '#94a3b8',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 600
                      }}>
                        INATIVO
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                    {type.description || 'Sem descrição'} · {type.default_points} pontos
                    {type.requires_approval && ' · Requer aprovação'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleEdit(type)}
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
                  <Edit size={14} /> Editar
                </button>
                <button
                  onClick={() => handleDelete(type.id)}
                  style={{
                    padding: '6px 12px',
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
