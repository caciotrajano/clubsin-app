import { AuthProvider } from '../hooks/useAuth'
import Layout from '../components/Layout'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: 14,
            borderRadius: 10,
            padding: '12px 16px',
          },
          success: {
            style: {
              background: '#dcfce7',
              color: '#166534',
              border: '1px solid #bbf7d0',
            },
          },
          error: {
            style: {
              background: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
          },
        }}
      />
    </AuthProvider>
  )
}
