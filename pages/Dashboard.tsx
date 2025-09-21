
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Song, UserRole } from '../types';
import { MOCK_SONG_EARNINGS } from '../mockData';
import RevenueChart from '../components/charts/RevenueChart';
import { useSongs } from '../contexts/SongContext';

const StatCard: React.FC<{ title: string; value: string; icon: JSX.Element; linkTo?: string }> = ({ title, value, icon, linkTo }) => {
    const content = (
        <Card className="flex items-center space-x-4 transition-colors hover:bg-gray-700">
            <div className="text-indigo-400">{icon}</div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </Card>
    );

    return linkTo ? <Link to={linkTo}>{content}</Link> : content;
};


const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { pendingSongs, registeredSongs, getUserSongs } = useSongs();

  // Data for current user
  const { pending: userPendingSongs, registered: userRegisteredSongs } = useMemo(() => {
    if (!user) return { pending: [], registered: [] };
    return getUserSongs(user.id);
  }, [user, getUserSongs, pendingSongs, registeredSongs]);
  
  // Data for admin view
  const adminPendingCount = pendingSongs.length;

  // Memoize chart data calculation
  const chartData = useMemo(() => {
    const monthlyTotals: { [key: string]: number } = {};
    
    MOCK_SONG_EARNINGS.forEach(earning => {
      // Group by YYYY-MM
      const month = earning.date.substring(0, 7); 
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }
      monthlyTotals[month] += earning.amount;
    });

    // Sort by month
    const sortedMonths = Object.keys(monthlyTotals).sort();
    
    const labels = sortedMonths.map(month => {
      const [year, m] = month.split('-');
      // Note: Month in JS Date is 0-indexed (0-11)
      return new Date(parseInt(year), parseInt(m) - 1).toLocaleString('en-US', { month: 'short', year: 'numeric' });
    });
    const values = sortedMonths.map(month => monthlyTotals[month]);

    return { labels, values };
  }, []);

  if (!user) {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Please log in</h1>
            <p className="text-gray-400">You need to be logged in to view the dashboard.</p>
            <Link to="/login" className="mt-4 inline-block"><Button>Go to Login</Button></Link>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Welcome, {user.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Lifetime Earnings" value="$12,345.67" icon={<IconCash />} />
        <StatCard 
          title="Registered Songs" 
          value={userRegisteredSongs.length.toString()} 
          icon={<IconMusic />} 
        />
        {user.role === UserRole.ADMIN ? (
             <StatCard 
               title="Pending Approvals" 
               value={adminPendingCount.toString()} 
               icon={<IconClock />} 
               linkTo="/admin/songs/approvals" 
             />
        ) : (
             <StatCard title="Pending Songs" value={userPendingSongs.length.toString()} icon={<IconClock />} />
        )}
        <StatCard title="Last Payout" value="$1,200.00" icon={<IconReceipt />} />
      </div>

      <Card title="Revenue Overview">
        <RevenueChart data={chartData} />
      </Card>

      {user.role === UserRole.ADMIN && (
          <Card title="Admin Panel">
            <div className="flex flex-wrap gap-4">
                <Link to="/admin/users"><Button>Manage Users</Button></Link>
                <Link to="/admin/songs/approvals"><Button>Song Approvals</Button></Link>
                <Link to="/admin/earnings"><Button>Manage Earnings</Button></Link>
            </div>
          </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Quick Actions">
            <div className="flex flex-wrap gap-4">
                <Link to="/songs/new"><Button>Register a New Song</Button></Link>
                <Link to="/payouts"><Button variant="secondary">Request Payout</Button></Link>
                <Link to="/earnings"><Button variant="secondary">View Earnings</Button></Link>
            </div>
          </Card>
           <Card title="My Registered Songs">
            {userRegisteredSongs.length > 0 ? (
              <ul className="space-y-3">
                {userRegisteredSongs.slice(0, 5).map((song: Song) => (
                   <li key={song.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700">
                      <div className="flex items-center space-x-3">
                        <img src={song.cover_art_url} alt={song.title} className="w-10 h-10 rounded-md object-cover" />
                        <div>
                          <p className="font-semibold text-white">{song.title}</p>
                          <p className="text-sm text-gray-400">{song.artists.join(', ')}</p>
                        </div>
                      </div>
                      <Link to={`/songs/${song.id}`}>
                         <Button variant="secondary" size="sm">Details</Button>
                      </Link>
                   </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">
                You don't have any registered songs yet.
                <Link to="/songs/new" className="text-indigo-400 hover:underline ml-1">Register one now!</Link>
              </p>
            )}
          </Card>
      </div>

    </div>
  );
};

const IconCash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
const IconMusic = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" /></svg>
);
const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const IconReceipt = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

export default Dashboard;
