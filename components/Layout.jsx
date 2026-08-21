import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { LogOut, LayoutDashboard, Activity, Trophy, User } from 'lucide-react'

export default function Layout({ children }) {
  const { user, profile, isAdmin, signOut } = useAuth()
  const router = useRouter()

  if (!user) return <>{children}</>

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/atividades', label: 'Atividades', icon: Activity },
    { path: '/ranking', label: 'Ranking', icon: Trophy },
    { path: '/perfil', label: 'Meu Perfil', icon: User },
  ]

  if (isAdmin || profile?.role === 'manager') {
    menuItems.push({ path: '/admin', label: 'Administração', icon: LayoutDashboard })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <aside style={{
        width: 240,
        background: '#fff',
        borderRight: '1px solid #e2e8f0',
        padding: 24,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #2d8f5a, #1a5c3a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 18, marginBottom: 8
          }}>
            C
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Clubsin Ceará</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Portal do Associado</div>
        </div>

        <nav style={{ flex: 1 }}>
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = router.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px',
                  background: isActive ? '#e8f5ee' : 'transparent',
                  border: 'none', borderRadius: 8,
                  color: isActive ? '#1a5c3a' : '#64748b',
                  fontSize: 14, fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer', marginBottom: 4,
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <button
          onClick={signOut}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px',
            background: '#fee2e2',
            border: 'none', borderRadius: 8,
            color: '#991b1b', fontSize: 14, fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
