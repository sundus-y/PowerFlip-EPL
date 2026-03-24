import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import { useLeague } from './hooks/useLeague';

export default function App() {
  const [appState, setAppState] = useState('splash'); // 'splash' | 'landing' | 'dashboard'

  const leagueData = useLeague();

  if (appState === 'splash') {
    return <SplashScreen onComplete={() => setAppState('landing')} />;
  }

  if (appState === 'landing') {
    return (
      <LandingPage
        customTable={leagueData.customTable}
        realTable={leagueData.realTable}
        matches={leagueData.matches}
        loading={leagueData.loading}
        onExplore={() => setAppState('dashboard')}
      />
    );
  }

  return <Dashboard {...leagueData} />;
}
