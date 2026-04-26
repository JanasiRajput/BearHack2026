import React, { useState, useEffect, useCallback } from 'react';
import CharacterCard from './components/CharacterCard';
import PhaseModal from './components/PhaseModal';
import ReflectionModal from './components/ReflectionModal';
import CycleHub from './components/CycleHub';
import ReflectionNetwork from './components/ReflectionNetwork';
import MonthlyWrapModal from './components/MonthlyWrapModal';
import CalendarSidebar from './components/CalendarSidebar';
import { phases } from './data/phases';
import { getPhaseForDate, DEFAULT_CYCLE_LENGTH } from './data/cycleUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronLeft, ChevronRight, TreePine, Sparkles, LogIn, LogOut, RefreshCw } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Persistent Cycle Data
  const [cycleData, setCycleData] = useState(() => {
    const saved = localStorage.getItem('redTales_cycleData');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, lastPeriodStart: new Date(parsed.lastPeriodStart) };
    }
    return null;
  });

  const [isEditingCycle, setIsEditingCycle] = useState(!cycleData);
  const [activePhaseId, setActivePhaseId] = useState(() =>
    getPhaseForDate(
      new Date(),
      cycleData?.lastPeriodStart,
      cycleData?.duration ?? 5,
      cycleData?.cycleLength ?? DEFAULT_CYCLE_LENGTH
    )
  );
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTreeOpen, setIsTreeOpen] = useState(false);
  const [isWrapOpen, setIsWrapOpen] = useState(false);
  const [feedbackPhaseId, setFeedbackPhaseId] = useState(null);
  const [reflections, setReflections] = useState(() => {
    const saved = localStorage.getItem('redTales_reflections');
    return saved ? JSON.parse(saved) : [];
  });
  const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  /** Clears tokens in this app without Auth0 redirect — works even if Logout URLs are misconfigured in the dashboard. */
  const handleLogout = () => {
    logout({ localOnly: true });
  };
  const [isSyncing, setIsSyncing] = useState(false);
  const [googleEvents, setGoogleEvents] = useState([]);

  const refreshGoogleEvents = useCallback(async () => {
    if (!isAuthenticated) {
      setGoogleEvents([]);
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_BASE}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.warn('Calendar events fetch failed:', data.detail || res.statusText);
        return;
      }
      setGoogleEvents(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      console.warn('Calendar events fetch error:', e);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    refreshGoogleEvents();
  }, [refreshGoogleEvents]);

  // Sync active phase when date or cycle data changes
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const phaseId = getPhaseForDate(
      date,
      cycleData?.lastPeriodStart,
      cycleData?.duration ?? 5,
      cycleData?.cycleLength ?? DEFAULT_CYCLE_LENGTH
    );
    setActivePhaseId(phaseId);
  };

  const handleUpdateCycle = (data) => {
    const next = { ...(cycleData || {}), ...data };
    setCycleData(next);
    localStorage.setItem('redTales_cycleData', JSON.stringify(next));
    const phaseId = getPhaseForDate(
      selectedDate,
      next.lastPeriodStart,
      next.duration ?? 5,
      next.cycleLength ?? DEFAULT_CYCLE_LENGTH
    );
    setActivePhaseId(phaseId);
  };

  const handleOpenModal = (phase) => {
    setSelectedPhase(phase);
    setIsModalOpen(true);
  };

  const handleOpenReflection = (phase) => {
    setSelectedPhase(phase);
    setIsReflectionModalOpen(true);
  };

  const handleSaveReflection = (phaseId, data) => {
    const newReflection = {
      id: Date.now(),
      phaseId,
      date: new Date().toISOString(), // Use 'date' to match tree logic
      ...data
    };
    const updated = [...reflections, newReflection];
    setReflections(updated);
    localStorage.setItem('redTales_reflections', JSON.stringify(updated));
    setFeedbackPhaseId(phaseId);
    setTimeout(() => setFeedbackPhaseId(null), 1500);
  };

  const handleSyncLifestyle = async () => {
    if (!isAuthenticated) {
      loginWithRedirect({
        authorizationParams: {
          connection: 'google-oauth2'
        }
      });
      return;
    }

    setIsSyncing(true);
    try {
      const token = await getAccessTokenSilently();
      const energyLevel = (activePhaseId === 'follicular' || activePhaseId === 'ovulation') ? 'high' : 'low';

      const response = await fetch(`${API_BASE}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ energy_level: energyLevel })
      });

      const data = await response.json();
      if (!response.ok) {
        const d = data.detail;
        const msg = Array.isArray(d)
          ? d.map((x) => (typeof x === 'string' ? x : x?.msg || JSON.stringify(x))).join(' ')
          : d || 'Sync failed';
        throw new Error(msg);
      }

      console.log('Sync result:', data);
      refreshGoogleEvents();
      const actions = Array.isArray(data.actions_taken)
        ? data.actions_taken.map((a) => a.summary || a.title).filter(Boolean).join(', ')
        : '';
      alert(actions ? `Sync successful! ${actions}` : 'Sync successful!');
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Sync failed. Please check console for details.');
    } finally {
      setIsSyncing(false);
    }
  };

  const activePhase = phases.find(p => p.id === activePhaseId);

  return (
    <div className="relative min-h-screen w-full bg-[#fdfaf7] font-['Outfit',_sans-serif]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-pink-100/30 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-rose-100/20 blur-[120px] rounded-full" />
      </div>

      {/* Fixed Branding */}
      <div className="fixed top-4 right-6 md:top-8 md:right-8 lg:top-12 lg:right-12 z-[60] text-right pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-end"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-rose text-[#DC143C]/90 leading-[0.7] lowercase font-normal">
            red
          </h1>
          <h1 className="text-xl md:text-3xl lg:text-4xl font-tales text-gray-700/60 tracking-[0.25em] uppercase font-light">
            Tales
          </h1>
        </motion.div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 md:top-8 lg:top-12 z-[140] p-3.5 md:p-4 rounded-2xl glass border border-white/50 shadow-xl 
                   hover:scale-110 active:scale-95 transition-all duration-500 text-gray-500 hover:text-gray-800
                   ${isSidebarOpen
            ? 'left-[calc(100%-64px)] md:left-[380px] lg:left-[430px]'
            : 'left-4 md:left-8 lg:left-12'}`}
      >
        {isSidebarOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
      </button>

      {/* Action Navigation (Right Side Desktop / Bottom Mobile) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-auto md:top-32 md:right-6 lg:top-48 lg:right-12 z-[140] 
                      flex md:flex-col gap-2.5 md:gap-4 items-center md:items-end w-max md:w-auto">
        <button
          type="button"
          onClick={() => setIsTreeOpen(true)}
          className="p-3.5 md:px-6 md:py-4 rounded-2xl glass border border-white/50 shadow-lg 
                     hover:scale-110 active:scale-95 transition-all duration-300 text-gray-500 hover:text-gray-800
                     flex items-center gap-3 group"
        >
          <TreePine size={20} className="md:w-6 md:h-6 group-hover:text-emerald-500 transition-colors" />
          <span className="hidden md:block text-base font-semibold tracking-wide">Tree</span>
        </button>

        <button
          type="button"
          onClick={() => setIsWrapOpen(true)}
          className="p-3.5 md:px-6 md:py-4 rounded-2xl glass border border-white/50 shadow-lg 
                     hover:scale-110 active:scale-95 transition-all duration-300 text-gray-500 hover:text-gray-800
                     flex items-center gap-3 group"
        >
          <Sparkles size={20} className="md:w-6 md:h-6 group-hover:text-pink-400 transition-colors" />
          <span className="hidden md:block text-base font-semibold tracking-wide">Wrap</span>
        </button>

        <button
          type="button"
          onClick={handleSyncLifestyle}
          disabled={isSyncing}
          className="p-3.5 md:px-6 md:py-4 rounded-2xl glass border border-white/50 shadow-lg 
                     hover:scale-110 active:scale-95 transition-all duration-300 text-gray-500 hover:text-gray-800
                     flex items-center gap-3 group bg-white/30 disabled:opacity-60 disabled:pointer-events-none disabled:hover:scale-100"
        >
          <RefreshCw size={20} className={`md:w-6 md:h-6 ${isSyncing ? 'animate-spin text-blue-500' : 'group-hover:text-blue-500'} transition-colors`} />
          <span className="hidden md:block text-base font-semibold tracking-wide">Sync AI</span>
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1 md:hidden" />

        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleLogout}
            className="p-3.5 md:px-6 md:py-4 rounded-2xl glass border border-white/50 shadow-lg 
                       hover:scale-110 active:scale-95 transition-all duration-300 text-gray-500 hover:text-gray-800
                       flex items-center gap-3 group"
          >
            <LogOut size={20} className="md:w-6 md:h-6 group-hover:text-red-500 transition-colors" />
            <span className="hidden md:block text-base font-semibold tracking-wide">Logout</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => loginWithRedirect({
              authorizationParams: {
                connection: 'google-oauth2'
              }
            })}
            className="p-3.5 md:px-6 md:py-4 rounded-2xl glass border border-white/50 shadow-lg 
                       hover:scale-110 active:scale-95 transition-all duration-300 text-gray-500 hover:text-gray-800
                       flex items-center gap-3 group"
          >
            <LogIn size={20} className="md:w-6 md:h-6 group-hover:text-emerald-500 transition-colors" />
            <span className="hidden md:block text-base font-semibold tracking-wide">Login</span>
          </button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -500, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 150 }}
            className="fixed inset-0 md:inset-auto md:left-6 lg:left-8 md:top-6 lg:top-8 md:bottom-6 lg:bottom-8 z-[100] md:z-40 p-4 md:p-0"
          >
            {/* Mobile Overlay Backdrop */}
            <div
              className="absolute inset-0 bg-[#fdfaf7]/60 backdrop-blur-xl md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="relative h-full w-full md:w-[380px] lg:w-[430px]">
              <CalendarSidebar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                cycleData={cycleData}
                googleEvents={googleEvents}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="relative min-h-screen w-full">
        <motion.div
          layout
          className={`relative min-h-screen transition-all duration-700 ease-in-out flex flex-col items-center
                     ${isSidebarOpen ? 'md:pl-[420px] lg:pl-[480px] pr-4 md:pr-12' : 'px-4 md:px-12'}
                     ${isTreeOpen ? 'blur-xl scale-95 opacity-30 pointer-events-none' : ''}`}
        >
          {/* Top Section - Branding Spacing */}
          <div className="flex-shrink-0 h-24 md:h-32" />

          {/* Center Section - Cycle Hub (keep below fixed chrome z-[140]) */}
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center py-12">
            <div className="w-full transition-all duration-500 transform hover:scale-[1.01]">
              <CycleHub
                cycleData={cycleData}
                onUpdate={handleUpdateCycle}
                isEditing={isEditingCycle}
                setIsEditing={setIsEditingCycle}
              />
            </div>
          </div>

          {/* Bottom Section - Characters (Now a wrapping grid, no internal scroll) */}
          <div className="w-full relative z-10 px-4 mt-8 pb-20">
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 lg:gap-14 items-start max-w-6xl mx-auto">
              {phases.map((phase) => (
                <CharacterCard
                  key={phase.id}
                  phase={phase}
                  isActive={activePhaseId === phase.id}
                  showFeedback={feedbackPhaseId === phase.id}
                  onClick={() => handleOpenModal(phase)}
                  onPlusClick={() => handleOpenReflection(phase)}
                />
              ))}
            </div>
          </div>
          
          {/* Bottom Spacing */}
          <div className="h-16 md:hidden" />
        </motion.div>
      </main>

      {/* Modals & Overlays */}
      <PhaseModal
        phase={selectedPhase}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ReflectionModal
        phase={selectedPhase}
        isOpen={isReflectionModalOpen}
        onClose={() => setIsReflectionModalOpen(false)}
        onSave={handleSaveReflection}
      />
      <ReflectionNetwork
        isOpen={isTreeOpen}
        onClose={() => setIsTreeOpen(false)}
        reflections={reflections}
        activePhaseId={activePhaseId}
      />
      <MonthlyWrapModal
        isOpen={isWrapOpen}
        onClose={() => setIsWrapOpen(false)}
        cycleData={cycleData}
        reflections={reflections}
      />
    </div>
  );
}

export default App;
