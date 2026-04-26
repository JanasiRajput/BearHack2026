import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import CalendarGrid from './CalendarGrid';
import InsightBox from './InsightBox';
import CycleWeather from './CycleWeather';
import { DEFAULT_CYCLE_LENGTH } from '../data/cycleUtils';

const CalendarSidebar = ({ selectedDate, onDateSelect, cycleData, googleEvents = [] }) => {
  const lastPeriodStart = cycleData?.lastPeriodStart;
  const periodDuration = cycleData?.duration ?? 5;
  const cycleLength = cycleData?.cycleLength ?? DEFAULT_CYCLE_LENGTH;
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div
      className="h-full w-full p-6 md:p-10 pt-20 flex flex-col glass rounded-[2.5rem] md:rounded-[3rem] border border-white/40 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <h2 className="text-3xl font-tales text-gray-700 font-medium lowercase tracking-wide">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={prevMonth}
            className="p-3 rounded-full hover:bg-white/50 transition-colors text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-3 rounded-full hover:bg-white/50 transition-colors text-gray-400 hover:text-gray-600"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <CalendarGrid
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        lastPeriodStart={lastPeriodStart}
        periodDuration={periodDuration}
        cycleLength={cycleLength}
        googleEvents={googleEvents}
      />

      {/* Cycle Weather Widget */}
      <div className="mt-6">
        <CycleWeather
          date={selectedDate}
          lastPeriodStart={lastPeriodStart}
          periodDuration={periodDuration}
          cycleLength={cycleLength}
        />
      </div>

      {/* Educational Section (Legend + Insight) */}
      <div className="mt-8 space-y-6">
        {/* Upgraded Legend */}
        <div className="flex flex-wrap justify-between gap-y-3 px-1">
           {['menstrual', 'follicular', 'ovulation', 'luteal'].map(p => (
             <div key={p} className="flex items-center gap-3">
               <div className={`w-4 h-4 rounded-lg shadow-sm border border-white/50
                 ${p === 'menstrual' ? 'bg-rose-300 shadow-rose-200/50' : 
                   p === 'follicular' ? 'bg-orange-300 shadow-orange-200/50' : 
                   p === 'ovulation' ? 'bg-amber-300 shadow-amber-200/50' : 'bg-indigo-300 shadow-indigo-200/50'}`} 
               />
               <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
                 {p.slice(0, 3)}
               </span>
             </div>
           ))}
        </div>
        <div className="flex items-center gap-3 px-1 pt-1">
          <Sparkles className="w-4 h-4 text-sky-500 shrink-0" aria-hidden />
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
            AI sync (Google Calendar)
          </span>
        </div>

        {/* Insight Box (Now part of the educational stack) */}
        <div className="pt-2 border-t border-gray-100">
          <InsightBox
            date={selectedDate}
            lastPeriodStart={lastPeriodStart}
            periodDuration={periodDuration}
            cycleLength={cycleLength}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;
