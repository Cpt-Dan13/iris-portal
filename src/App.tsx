import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import type { Screen } from './components/Sidebar';
import Activate from './screens/Activate';
import Ranking from './screens/Ranking';
import Prospective from './screens/Prospective';
import Reports from './screens/Reports';
import ProfileDetail from './screens/ProfileDetail';
import Login from './screens/Login';
import { useProfiles } from './hooks/useProfiles';
import { useProfile } from './hooks/useProfile';
import type { Profile } from './types';

function Dashboard() {
  const [screen, setScreen] = useState<Screen>('ranking');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const { profiles, loading: listLoading } = useProfiles();
  const { profile: selectedProfile, loading: detailLoading } = useProfile(selectedProfileId);

  const handleSelectProfile = (profile: Profile) => setSelectedProfileId(profile.id);
  const handleBack = () => setSelectedProfileId(null);
  const handleNavigate = (s: Screen) => { setScreen(s); setSelectedProfileId(null); };

  const renderContent = () => {
    if (selectedProfileId) {
      if (detailLoading) return <Loader />;
      if (selectedProfile) return <ProfileDetail profile={selectedProfile} onBack={handleBack} />;
    }
    if (listLoading) return <Loader />;
    switch (screen) {
      case 'activate':    return <Activate />;
      case 'ranking':     return <Ranking profiles={profiles} onSelectProfile={handleSelectProfile} />;
      case 'prospective': return <Prospective profiles={profiles} onSelectProfile={handleSelectProfile} />;
      case 'reports':     return <Reports profiles={profiles} onSelectProfile={handleSelectProfile} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar active={screen} onNavigate={handleNavigate} />
      <main
        style={{ flex: 1, minHeight: '100vh', overflowY: 'auto' }}
        className="md:ml-[220px] pt-[52px] md:pt-0"
      >
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            flex: 1,
            display: screen === 'activate' && !selectedProfileId ? 'flex' : 'block',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '3px solid var(--border)',
        borderTopColor: '#c084fc',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
