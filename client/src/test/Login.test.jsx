import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';
import api from '../api/client';

vi.mock('../api/client', async (orig) => {
  const mod = await orig();
  return { ...mod, default: { ...mod.default, post: vi.fn() } };
});

describe('Login page', () => {
  it('renders the form', () => {
    render(<MemoryRouter><AuthProvider><Login /></AuthProvider></MemoryRouter>);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('shows the server error when login fails', async () => {
    api.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid email or password' } } });
    render(<MemoryRouter><AuthProvider><Login /></AuthProvider></MemoryRouter>);

    await userEvent.type(screen.getByLabelText('Email'), 'a@b.com');
    await userEvent.type(screen.getByLabelText('Password'), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
  });
});
