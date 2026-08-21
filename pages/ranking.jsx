import { useRanking } from '../hooks/useRanking'
import { useAuth } from '../hooks/useAuth'
import { Trophy } from 'lucide-react'

export default function Ranking() {
  const { profile } = useAuth()
  const { rankings, myRanking, loading } = useRanking()

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Ranking da Temporada 2026</h1>
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Classificação geral dos associados</p>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Carregando ranking...</p>
      ) : (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', textAlign: 'center' }}>#</th>
                <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', textAlign: 'left' }}>Associado</th>
                <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', textAlign: 'right' }}>Pontos</th>
                <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', textAlign: 'right' }}>Atividades</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((rank, i) => {
                const isMe = rank.profile_id === profile?.id
                return (
                  <tr key={rank.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: isMe ? '#e8f5ee' : 'transparent'
                  }}>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 16, fontWeight: 700, color: i === 0 ? '#c9a84c' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : '#64748b' }}>
                      {rank.position}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: isMe ? '#1a5c3a' : '#f1f5f9',
                          color: isMe ? 'white' : '#64748b',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700
                        }}>
                          {rank.profiles?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                            {rank.profiles?.full_name || 'Associado'}
                            {isMe && <span style={{ color: '#1a5c3a', fontWeight: 600, marginLeft: 6 }}>Você</span>}
                          </div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>{rank.profiles?.company || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 15, fontWeight: 700, color: '#1a5c3a' }}>
                      {rank.total_points}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: '#64748b' }}>
                      {rank.total_activities}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}