// Temporary pages so the routes work. Say replaces Home and Dashboard with the real pages.
import { useAuth } from '../context/AuthContext';

export function Home() {
  const { user } = useAuth();
  return (
    <div className="page">
      <h1>Browse gigs</h1>
      <p>{user ? `Welcome back, ${user.name}.` : 'Log in to book a gig.'}</p>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="page">
      <h1>Freelancer dashboard</h1>
      <p>My gigs, bookings and income go here.</p>
    </div>
  );
}

export function Forbidden() {
  return (
    <div className="page">
      <h1>Access denied</h1>
      <p>Your account type can't open this page.</p>
    </div>
  );
}
