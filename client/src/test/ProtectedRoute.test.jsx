import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route path="/forbidden" element={<p>Forbidden page</p>} />
          <Route element={<ProtectedRoute roles={['freelancer']} />}>
            <Route path="/dashboard" element={<p>Dashboard page</p>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('sends logged-out users to login', () => {
    renderAt('/dashboard');
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('blocks a client from the freelancer dashboard', () => {
    localStorage.setItem('hh_user', JSON.stringify({ name: 'Cli', role: 'client' }));
    renderAt('/dashboard');
    expect(screen.getByText('Forbidden page')).toBeInTheDocument();
  });

  it('lets a freelancer in', () => {
    localStorage.setItem('hh_user', JSON.stringify({ name: 'Ann', role: 'freelancer' }));
    renderAt('/dashboard');
    expect(screen.getByText('Dashboard page')).toBeInTheDocument();
  });
});
