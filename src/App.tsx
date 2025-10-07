import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { Landing } from './components/Landing';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { ProfileModal } from './components/modals/ProfileModal';
import { Conversation } from './components/Conversation';
import { NavBar } from './components/ui/NavBar';
import { useWakeServer } from './hooks/useWakeServer';
import { ServerStatusToast } from './components/toasts/ServerStatusToast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { IsOnlineToast } from './components/toasts/IsOnlineToast';

function App() {
  const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const isHealthy: null | boolean = useWakeServer();
  return (
    <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <Router>
          <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
            <NavBar />
            <main className="flex-1 flex flex-col pt-4">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <PublicRoute>
                      <SignUp />
                    </PublicRoute>
                  }
                />
                <Route path="/user/:userId" element={<ProfileModal />} />
                <Route
                  path="/conversation/:conversationId"
                  element={
                    <ProtectedRoute>
                      <Conversation />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <IsOnlineToast />
            <ServerStatusToast status={isHealthy} />
          </div>
        </Router>
      </UserProvider >
    </GoogleOAuthProvider>
  );
}

export default App;