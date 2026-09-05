import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileDrawer } from './components/MobileDrawer';
import { AICopilotModal } from './components/AICopilotModal';
import { EditPortfolioModal } from './components/EditPortfolioModal';
import { FloatingAskDoubtBall } from './components/FloatingAskDoubtBall';
import { AskDoubtModal } from './components/AskDoubtModal';

import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { DoubtHub } from './pages/DoubtHub';
import { ProjectHub } from './pages/ProjectHub';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { SkillGraphPage } from './pages/SkillGraphPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { MentorshipPage } from './pages/MentorshipPage';
import { ProjectAdvisorPage } from './pages/ProjectAdvisorPage';
import { OpportunityHub } from './pages/OpportunityHub';
import { PeerNetworkPage } from './pages/PeerNetworkPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white overflow-x-hidden relative">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden pt-16 pb-16 w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/doubts" element={<DoubtHub />} />
              <Route path="/projects" element={<ProjectHub />} />
              <Route path="/knowledge" element={<KnowledgeBase />} />
              <Route path="/skill-graph" element={<SkillGraphPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/mentors" element={<MentorshipPage />} />
              <Route path="/advisor" element={<ProjectAdvisorPage />} />
              <Route path="/opportunities" element={<OpportunityHub />} />
              <Route path="/peers" element={<PeerNetworkPage />} />
            </Routes>
          </main>
        </div>
        <MobileDrawer />
        <AICopilotModal />
        <EditPortfolioModal />
        <FloatingAskDoubtBall />
        <AskDoubtModal />
      </div>
    </Router>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
