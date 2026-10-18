import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { LevelingTab } from './components/LevelingTab';
import { RoadmapTab } from './components/RoadmapTab';
import { IntensifTab } from './components/IntensifTab';
import { SKDITab } from './components/SKDITab';
import { TryoutTab } from './components/TryoutTab';
import { ErrorBookTab } from './components/ErrorBookTab';
import { OSCETab } from './components/OSCETab';
import { HabitTab } from './components/HabitTab';
import { GuidelinesTab } from './components/GuidelinesTab';
import { EditLevelModal } from './components/EditLevelModal';
import { EditDateModal } from './components/EditDateModal';
import { DataBackupModal } from './components/DataBackupModal';
import { EditAvatarModal } from './components/EditAvatarModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { UserAccountModal } from './components/UserAccountModal';
import { StreakModal } from './components/StreakModal';
import { Sidebar } from './components/Sidebar';

const VALID_TABS = new Set([
  'dashboard',
  'leveling',
  'roadmap',
  'intensif',
  'skdi',
  'tryout',
  'error-book',
  'osce',
  'habit',
  'guidelines'
]);

const getInitialTab = (): string => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
    if (VALID_TABS.has(hash)) {
      return hash;
    }
    try {
      const savedTab = localStorage.getItem('doctor_tracker_active_tab');
      if (savedTab && VALID_TABS.has(savedTab)) {
        return savedTab;
      }
    } catch {}
  }
  return 'dashboard';
};

// Authenticated Tracker Component (Only rendered for logged in users)
const MainTracker: React.FC<{
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAccount: () => void;
  onOpenBackup: () => void;
}> = ({ darkMode, setDarkMode, onOpenAccount, onOpenBackup }) => {
  const { state, progress } = useApp();
  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);
  const [isEditLevelOpen, setIsEditLevelOpen] = useState<boolean>(false);
  const [isEditDateOpen, setIsEditDateOpen] = useState<boolean>(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState<boolean>(false);
  const [isStreakOpen, setIsStreakOpen] = useState<boolean>(false);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('doctor_tracker_active_tab', tab);
      if (typeof window !== 'undefined' && window.location.hash.replace(/^#\/?/, '') !== tab) {
        window.history.replaceState(null, '', `#${tab}`);
      }
    } catch {}
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
      if (VALID_TABS.has(hash)) {
        setActiveTabState(hash);
        try {
          localStorage.setItem('doctor_tracker_active_tab', hash);
        } catch {}
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.history.replaceState(null, '', `#${activeTab}`);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  // Mobile drawer open state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  // Desktop collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('doctor_tracker_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => {
        const next = !prev;
        try {
          localStorage.setItem('doctor_tracker_sidebar_collapsed', String(next));
        } catch {}
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5efe4] dark:bg-[#12100e] text-hogwarts-900 dark:text-hogwarts-100 transition-colors font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEditLevel={() => setIsEditLevelOpen(true)}
        onOpenEditDate={() => setIsEditDateOpen(true)}
        onOpenBackup={onOpenBackup}
        onOpenAvatar={() => setIsAvatarOpen(true)}
        onOpenAuth={() => {}}
        onOpenAccount={onOpenAccount}
        onOpenStreak={() => setIsStreakOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex w-full relative">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        <main className="flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardTab
            onOpenEditDate={() => setIsEditDateOpen(true)}
            onOpenEditLevel={() => setIsEditLevelOpen(true)}
            onOpenAvatar={() => setIsAvatarOpen(true)}
            setActiveTab={setActiveTab}
            onOpenStreak={() => setIsStreakOpen(true)}
          />
        )}
        {activeTab === 'leveling' && (
          <LevelingTab onOpenEditLevel={() => setIsEditLevelOpen(true)} />
        )}
        {activeTab === 'roadmap' && <RoadmapTab />}
        {activeTab === 'intensif' && <IntensifTab />}
        {activeTab === 'skdi' && <SKDITab />}
        {activeTab === 'tryout' && <TryoutTab />}
        {activeTab === 'error-book' && <ErrorBookTab />}
        {activeTab === 'osce' && <OSCETab />}
        {activeTab === 'habit' && <HabitTab />}
        {activeTab === 'guidelines' && <GuidelinesTab />}
      </main>
    </div>

      {/* Forbidden Forest Footer */}
      <footer className="border-t-2 border-hogwarts-300 dark:border-[#383028] py-6 text-center text-xs text-hogwarts-800 dark:text-hogwarts-400 bg-[#faf6ee] dark:bg-[#191613] font-medium shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-hogwarts-950 dark:text-white tracking-wide">Forbidden Forest 🌲</span>
            <span>·</span>
            <span className="text-hogwarts-700 dark:text-hogwarts-400 font-medium">Ordo Medicus · Healer Sanctum Tracker for Dokter Muda</span>
          </div>
          <div className="text-[11px] text-tiffany-900 dark:text-tiffany-400 font-bold tracking-wide">
            Semangat berjuang! Setiap halaman hafalan membawamu mendekati sumpah dokter 🌿📜
          </div>
        </div>
      </footer>

      {/* Local Editing Modals */}
      <EditLevelModal
        isOpen={isEditLevelOpen}
        onClose={() => setIsEditLevelOpen(false)}
      />

      <EditDateModal
        isOpen={isEditDateOpen}
        onClose={() => setIsEditDateOpen(false)}
      />

      <EditAvatarModal
        isOpen={isAvatarOpen}
        onClose={() => setIsAvatarOpen(false)}
      />

      <StreakModal
        isOpen={isStreakOpen}
        onClose={() => setIsStreakOpen(false)}
        streak={progress.streak}
        onNavigateToHabits={() => setActiveTab('habit')}
        doctorAvatar={state.dashboard.doctorAvatar}
      />
    </div>
  );
};

// Root Router & Gate Controller
const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isBackupOpen, setIsBackupOpen] = useState<boolean>(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('theme_dark') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('theme_dark', 'true');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('theme_dark', 'false');
      } catch {}
    }
  }, [darkMode]);

  // Automatically trigger onboarding wizard if newly registered / not onboarded yet
  useEffect(() => {
    if (isAuthenticated && user && !user.isOnboarded) {
      setIsOnboardingOpen(true);
    }
  }, [isAuthenticated, user]);

  // Loading state while verifying tokens
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5efe4] dark:bg-[#12100e] text-hogwarts-900 dark:text-hogwarts-100 font-serif">
        <div className="text-center space-y-3 animate-pulse">
          <div className="text-4xl">🌲</div>
          <div className="font-bold text-sm tracking-wide">Memasuki Forbidden Forest...</div>
        </div>
      </div>
    );
  }

  // AUTH WALL: If not authenticated, render the Forbidden Forest Landing Page
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onOpenAuth={(mode) => {
            setAuthMode(mode);
            setIsAuthOpen(true);
          }}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <AuthModal
          isOpen={isAuthOpen}
          initialMode={authMode}
          onClose={() => setIsAuthOpen(false)}
        />
      </>
    );
  }

  // AUTHENTICATED: Render Tracker with AppProvider & state
  return (
    <AppProvider key={user?.id || 'guest'}>
      <MainTracker
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      <DataBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
    </AppProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
