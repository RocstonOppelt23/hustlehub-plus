import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import { Dashboard, Forbidden, Home } from './pages/Placeholders';
import './App.css';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forbidden" element={<Forbidden />} />

          {/* Freelancer-only pages */}
          <Route element={<ProtectedRoute roles={['freelancer']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
