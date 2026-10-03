import React from 'react';
import { DocumentProvider, useSOP } from './state/documentContext';
import { AppHeader } from './components/shell/AppHeader';
import { HomeScreen } from './components/home/HomeScreen';
import { Workspace } from './components/shell/Workspace';
import { NewSOPWizard } from './components/wizard/NewSOPWizard';

const MainLayout: React.FC = () => {
  const { currentScreen } = useSOP();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 font-sans">
      <AppHeader />
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'new-wizard' && <NewSOPWizard />}
      {currentScreen === 'workspace' && <Workspace />}
    </div>
  );
};

export default function App() {
  return (
    <DocumentProvider>
      <MainLayout />
    </DocumentProvider>
  );
}
