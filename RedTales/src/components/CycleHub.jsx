import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Edit3, Check, Info } from 'lucide-react';
import { format, parse, addDays, differenceInCalendarDays, startOfDay } from 'date-fns';
import { getCycleState, DEFAULT_CYCLE_LENGTH } from '../data/cycleUtils';

const CycleHub = ({ cycleData, onUpdate, isEditing, setIsEditing }) => {
  const [tempDate, setTempDate] = useState(() =>
    cycleData?.lastPeriodStart ? format(cycleData.lastPeriodStart, 'yyyy-MM-dd') : ''
  );
  const [tempDuration, setTempDuration] = useState(String(cycleData?.duration || 5));
  const [tempCycleLength, setTempCycleLength] = useState(
    String(cycleData?.cycleLength ?? DEFAULT_CYCLE_LENGTH)
  );

  const periodDur = cycleData?.duration ?? 5;
  const cycleLen = cycleData?.cycleLength ?? DEFAULT_CYCLE_LENGTH;
  const state = cycleData?.lastPeriodStart
    ? getCycleState(new Date(), cycleData.lastPeriodStart, periodDur, cycleLen)
    : null;

  useEffect(() => {
    if (!isEditing) return;
    if (cycleData?.lastPeriodStart) {
      setTempDate(format(cycleData.lastPeriodStart, 'yyyy-MM-dd'));
      setTempDuration(String(cycleData.duration ?? 5));
      setTempCycleLength(String(cycleData.cycleLength ?? DEFAULT_CYCLE_LENGTH));
    }
  }, [isEditing, cycleData]);

  const handleSave = () => {
    if (!tempDate) return;
    const start = startOfDay(parse(tempDate, 'yyyy-MM-dd', new Date()));
    onUpdate({
      lastPeriodStart: start,
      duration: parseInt(tempDuration, 10) || 5,
      cycleLength: parseInt(tempCycleLength, 10) || DEFAULT_CYCLE_LENGTH,
    });
    setIsEditing(false);
  };

  const onLastBleedingDayChange = (e) => {
    const v = e.target.value;
    if (!tempDate || !v) return;
    const start = startOfDay(parse(tempDate, 'yyyy-MM-dd', new Date()));
    const end = startOfDay(parse(v, 'yyyy-MM-dd', new Date()));
    let d = differenceInCalendarDays(end, start) + 1;
    d = Math.max(1, Math.min(10, d));
    setTempDuration(String(d));
  };

  const lastBleedingDayValue =
    tempDate && tempDuration
      ? format(
          addDays(parse(tempDate, 'yyyy-MM-dd', new Date()), (parseInt(tempDuration, 10) || 1) - 1),
          'yyyy-MM-dd'
        )
      : '';

  return (
    <div className="relative w-full max-w-[30rem] mx-auto p-4">
      <AnimatePresence mode="wait">
        {isEditing || !cycleData?.lastPeriodStart ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative glass p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border border-white/50 shadow-2xl space-y-6 md:space-y-10"
          >
            <div className="text-center space-y-2 md:space-y-3">
              <h3 className="text-2xl md:text-3xl font-medium text-gray-800 tracking-tight">Your Cycle Hub</h3>
              <p className="text-sm md:text-base text-gray-400">Let's set up your tracking</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4 relative z-10">
                <label className="text-[13px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-3">
                  <Calendar size={18} /> First day of last period
                </label>
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="relative z-10 w-full p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/90 border-2 border-white/50 focus:border-pink-300 focus:bg-white outline-none transition-all text-lg md:text-xl text-gray-800 font-bold cursor-pointer hover:shadow-md"
                />
              </div>

              <div className="space-y-4 relative z-10">
                <label className="text-[13px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-3">
                  <Calendar size={18} /> Last bleeding day
                </label>
                <input
                  type="date"
                  value={lastBleedingDayValue}
                  min={tempDate || undefined}
                  onChange={onLastBleedingDayChange}
                  disabled={!tempDate}
                  className="relative z-10 w-full p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/90 border-2 border-white/50 focus:border-pink-300 focus:bg-white outline-none transition-all text-lg md:text-xl text-gray-800 font-bold cursor-pointer hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-400">Or adjust length with the slider below.</p>
              </div>

              <div className="space-y-4">
                <label className="text-[13px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-3">
                  <Info size={18} /> Period length (days)
                </label>
                <div className="flex items-center gap-6">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={tempDuration}
                    onChange={(e) => setTempDuration(e.target.value)}
                    className="flex-grow h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-pink-300"
                  />
                  <span className="text-2xl font-medium text-gray-600 w-10">{tempDuration}</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[13px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-3">
                  <Info size={18} /> Full cycle length (days)
                </label>
                <div className="flex items-center gap-6">
                  <input
                    type="range"
                    min="21"
                    max="35"
                    value={tempCycleLength}
                    onChange={(e) => setTempCycleLength(e.target.value)}
                    className="flex-grow h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-pink-300"
                  />
                  <span className="text-2xl font-medium text-gray-600 w-10">{tempCycleLength}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={!tempDate}
                onClick={handleSave}
                className={`w-full py-4 md:py-6 rounded-2xl md:rounded-3xl font-bold text-base md:text-lg shadow-lg flex items-center justify-center gap-4 transition-all
                           ${tempDate ? 'bg-gray-800 text-white hover:scale-[1.02] active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                <Check size={24} />
                Confirm Cycle
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative flex flex-col items-center w-full"
          >
            <div className="w-full flex justify-end mb-2 pr-1">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-3 rounded-xl glass border border-white/50 text-gray-500 hover:text-gray-800 transition-all hover:scale-105 shadow-sm bg-white/50"
                title="Edit cycle dates"
              >
                <Edit3 size={18} />
              </button>
            </div>

            <div className="relative w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 320 320">
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  fill="none"
                  stroke="#F7FAFC"
                  strokeWidth="12"
                  className="opacity-50"
                />
                <motion.circle
                  cx="160"
                  cy="160"
                  r="140"
                  fill="none"
                  stroke={`var(--${state.phaseId}-accent)`}
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 1000' }}
                  animate={{ strokeDasharray: `${(state.progressPercent / 100) * 880} 1000` }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  style={{ strokeDashoffset: 0 }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[12px] font-medium text-gray-400 uppercase tracking-[0.4em] mb-2">Day</span>
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl md:text-8xl font-rose text-gray-800 leading-none"
                >
                  {state.cycleDay}
                </motion.span>
                <span className="text-[14px] font-medium text-gray-500 mt-2 uppercase tracking-[0.3em]">{state.phaseId}</span>
              </div>

              <motion.div
                className="absolute w-6 h-6 rounded-full blur-md pointer-events-none"
                style={{
                  backgroundColor: `var(--${state.phaseId}-accent)`,
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${state.progressPercent * 3.6 - 90}deg) translate(140px) rotate(${-(state.progressPercent * 3.6 - 90)}deg) translate(-50%, -50%)`,
                }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-center px-4 py-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm"
            >
              <p className="text-sm md:text-base text-gray-500 font-medium whitespace-nowrap">
                Next period: <span className="font-bold text-gray-700">{format(state.nextPeriod, 'MMM d')}</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CycleHub;
