
import React, { useState } from 'react';
import { AppView } from './types';
import Layout from './components/Layout';
import StudyNotes from './components/StudyNotes';
import Quiz from './components/Quiz';
import Planner from './components/Planner';
import SignIn from './components/SignIn';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('signin');
  const [user, setUser] = useState<{ name: string } | null>(null);

  const handleSignIn = () => {
    setUser({ name: "Student" });
    setView('study');
  };

  const handleSignOut = () => {
    setUser(null);
    setView('signin');
  };

  if (view === 'signin') {
    return <SignIn onSignIn={handleSignIn} />;
  }

  return (
    <Layout 
      activeView={view} 
      onNavigate={setView}
      onSignOut={handleSignOut}
    >
      {view === 'study' && <StudyNotes />}
      {view === 'quiz' && <Quiz />}
      {view === 'planner' && <Planner />}
    </Layout>
  );
};

export default App;
