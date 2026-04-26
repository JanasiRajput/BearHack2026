import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { getDaysInMonth } from '../data/cycleUtils';
import { indexEventsByLocalDay } from '../utils/googleCalendar';
import DayCell from './DayCell';

const CalendarGrid = ({
  currentMonth,
  selectedDate,
  onDateSelect,
  lastPeriodStart,
  periodDuration,
  cycleLength,
  googleEvents = [],
}) => {
  const days = getDaysInMonth(currentMonth);
  const eventsByDay = useMemo(() => indexEventsByLocalDay(googleEvents), [googleEvents]);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="flex-grow flex flex-col min-h-0">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-6">
        {weekDays.map((day, i) => (
          <div key={`${day}-${i}`} className="text-center text-[13px] font-medium text-gray-400 uppercase tracking-[0.3em]">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-3 pb-6 overflow-y-auto custom-scrollbar pr-1">
        {days.map((date, idx) => {
          const key = format(date, 'yyyy-MM-dd');
          return (
            <DayCell
              key={idx}
              date={date}
              isSelected={selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')}
              onClick={onDateSelect}
              lastPeriodStart={lastPeriodStart}
              periodDuration={periodDuration}
              cycleLength={cycleLength}
              googleDayEvents={eventsByDay.get(key) || []}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
