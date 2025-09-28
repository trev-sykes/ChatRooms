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

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Landing page - public */}
          <Route path="/" element={<Landing />} />

          {/* Protected home page */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />


          {/* Public routes */}
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
          <Route
            path="/user/:userId"
            element={<ProfileModal />}
          />
          <Route
            path="/conversation/:conversationId"
            element={
              <ProtectedRoute>
                <ConversationPage />
              </ProtectedRoute>
            }
          />
          {/* Redirect unknown routes to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
