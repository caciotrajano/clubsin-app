import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { User, Save } from 'lucide-react'

export default function Perfil() {
  const { profile, user, refreshProfile } = useAuth()
  const [formData, setFormData] = useState({
    full_name: '', phone: '', profession: '', company: '',
    address: '', city: '', state: 'CE', cep: '', bio: '',
    emergency_contact_name: '', emergency_contact_phone: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        profession: profile.profession || '',
        company: profile.company || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || 'CE',
        cep: profile.cep || '',
        bio: profile.bio || '',
        emergency_contact_name: profile.emergency_contact_name || '',
        emergency_contact_phone: profile.emergency_contact_phone || ''
      })
    }
  }, [profile])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          profession: formData.profession,
          company: formData.company,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          cep: formData.cep,
          bio: formData.bio,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Perfil atualizado com sucesso!')
      if (refreshProfile) await refreshProfile()
    } catch (err) {
      console.error('Erro:', err)
      toast.error(err.message || 'Erro ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid #e2e8f0', borderRadius: 10,
    fontSize: 14, outline: 'none'
  }
  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: '#64748b', marginBottom: 6
  }
  const sectionStyle = {
    background: '#fff', border: '1px solid #e2e8f0',
    borderRadius: 12, padding: 24, marginBottom: 20
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Meu Perfil</h1>
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Atualize seus dados pessoais e de contato</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} style={{ color: '#1a5c3a' }} />
            Dados Pessoais
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Nome Completo *</label>
              <input type="text" value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>E-mail</label>
              <input type="email" value={user?.email || ''} disabled
                style={{ ...inputStyle, background: '#f8fafc', color: '#94a3b8' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Telefone</label>
              <input type="tel" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(85) 99999-9999" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Profissão</label>
              <input type="text" value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                placeholder="Síndico Profissional" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Biografia</label>
            <textarea value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Conte um pouco sobre você..." rows={3}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Empresa / Condomínio</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Empresa ou Condomínio</label>
            <input type="text" value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Nome do condomínio ou empresa" style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Endereço</label>
              <input type="text" value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, número, bairro" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cidade</label>
              <input type="text" value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Fortaleza" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>CEP</label>
              <input type="text" value={formData.cep}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                placeholder="00000-000" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Contato de Emergência</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Nome</label>
              <input type="text" value={formData.emergency_contact_name}
                onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                placeholder="Nome do contato" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Telefone</label>
              <input type="tel" value={formData.emergency_contact_phone}
                onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                placeholder="(85) 99999-9999" style={inputStyle} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving}
          style={{
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #2d8f5a, #1a5c3a)',
            color: 'white', border: 'none', borderRadius: 10,
            fontSize: 14, fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
          <Save size={16} />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  )
}