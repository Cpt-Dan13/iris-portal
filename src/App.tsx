import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import type { Screen } from './components/Sidebar';
import Activate from './screens/Activate';
import Ranking from './screens/Ranking';
import Prospective from './screens/Prospective';
import Reports from './screens/Reports';
import ProfileDetail from './screens/ProfileDetail';
import type { Profile } from './data/mockData';

export default function App() {
  const [screen, setScreen] = useState<Screen>('activate');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const handleSelectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleBack = () => {
    setSelectedProfile(null);
  };

  const handleNavigate = (s: Screen) => {
    setScreen(s);
    setSelectedProfile(null);
  };

  const renderContent = () => {
    if (selectedProfile) {
      return <ProfileDetail profile={selectedProfile} onBack={handleBack} />;
    }
    switch (screen) {
      case 'activate':    return <Activate />;
      case 'ranking':     return <Ranking onSelectProfile={handleSelectProfile} />;
      case 'prospective': return <Prospective onSelectProfile={handleSelectProfile} />;
      case 'reports':     return <Reports onSelectProfile={handleSelectProfile} />;
    }
  };

  return (
    <ThemeProvider>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <Sidebar active={screen} onNavigate={handleNavigate} />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            minHeight: '100vh',
            overflowY: 'auto',
            // Account for sidebar on md+, top bar on mobile
            paddingTop: 0,
          }}
          className="md:ml-[220px] pt-[52px] md:pt-0"
        >
          {/* Full height flex for Activate screen centering */}
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: screen === 'activate' && !selectedProfile ? 'flex' : 'block', flexDirection: 'column', justifyContent: 'center' }}>
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
