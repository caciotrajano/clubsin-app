import { useAuth } from '../hooks/useAuth'
import { useRanking } from '../hooks/useRanking'
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function Dashboard() {
  const { profile } = useAuth()
  const { rankings, myRanking, loading } = useRanking()

  const stats = [
    {
      label: 'Sua Pontuação',
      value: myRanking?.total_points || 0,
      delta: '+128 pts este mês',
      deltaType: 'up',
      color: '#3b82f6'
    },
    {
      label: 'Atividades Enviadas',
      value: myRanking?.total_activities || 0,
      delta: '3 pendentes de aprovação',
      deltaType: 'up',
      color: '#c9a84c'
    },
    {
      label: 'Posição no Ranking',
      value: myRanking?.position ? `${myRanking.position}º` : '-',
      delta: '-1 posição vs mês passado',
      deltaType: 'down',
      color: '#16a34a'
    }
  ]

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={14} style={{ color: '#16a34a' }} />
    if (trend === 'down') return <TrendingDown size={14} style={{ color: '#dc2626' }} />
    return <Minus size={14} style={{ color: '#94a3b8' }} />
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Ranking de Associados</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Temporada 2026 · Atualizado em tempo real</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 14px',
          background: '#e8f5ee',
          borderRadius: 24,
          fontSize: 13, fontWeight: 600, color: '#1a5c3a'
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#1a5c3a', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700
          }}>
            {profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
          </div>
          <span>{profile?.full_name?.split(' ')[0] || 'Você'} · {myRanking?.position ? `${myRanking.position}º lugar` : 'Sem posição'}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: 18,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: stat.color }} />
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: 12, marginTop: 4, fontWeight: 500,
              color: stat.deltaType === 'up' ? '#16a34a' : stat.deltaType === 'down' ? '#dc2626' : '#94a3b8'
            }}>
              {stat.delta}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Trophy size={18} style={{ color: '#c9a84c' }} />
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Ranking Geral</h2>
        <span style={{
          background: '#fef3c7', color: '#b45309',
          fontSize: 11, fontWeight: 700,
          padding: '2px 8px', borderRadius: 12
        }}>TOP {rankings.length}</span>
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
                <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', textAlign: 'center', width: 50 }}>#</th>
                <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', textAlign: 'left' }}>Associado</th>
                <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', textAlign: 'right' }}>Pontos</th>
                <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', textAlign: 'right' }}>Atividades</th>
                <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', textAlign: 'right' }}>Tendência</th>
              </tr>
            </thead>
            <tbody>
              {rankings.slice(0, 10).map((rank, i) => {
                const isMe = rank.profile_id === profile?.id
                const trend = rank.previous_position
                  ? rank.position < rank.previous_position ? 'up'
                    : rank.position > rank.previous_position ? 'down' : 'same'
                  : 'same'
                return (
                  <tr key={rank.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: isMe ? '#e8f5ee' : 'transparent'
                  }}>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: 16, fontWeight: 700,
                        color: i === 0 ? '#c9a84c' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : '#64748b'
                      }}>
                        {rank.position}
                      </span>
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
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, fontSize: 12 }}>
                        {getTrendIcon(trend)}
                      </div>
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