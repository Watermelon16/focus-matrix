import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Home from './components/Home'
import { autoMigrate } from './lib/migrateToFirebase'
import { useEffect } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function App() {
  const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || 'demo-client-id';
  console.log('Google Client ID:', clientId);
  
  // Auto-migrate data to Firebase on app start
  useEffect(() => {
    autoMigrate();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Home />
            <Toaster />
          </div>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  )
}

export default App
