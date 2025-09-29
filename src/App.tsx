import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { Landing } from './components/Landing';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { CreateUser } from './components/CreateUser';
import { ProfileModal } from './components/ProfileModal';
import { ConversationPage } from './components/ConversationPage';
import { NavBar } from './components/nav/NavBar';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <NavBar />
          <div className="pt-4">
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
                    <CreateUser />
                  </PublicRoute>
                }
              />
              <Route path="/user/:userId" element={<ProfileModal />} />
              <Route
                path="/conversation/:conversationId"
                element={
                  <ProtectedRoute>
                    <ConversationPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;