import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Sun, CloudSun, Cloud, Wind } from 'lucide-react';
import { getPhaseForDate } from '../data/cycleUtils';

const weatherConfig = {
  menstrual: {
    icon: CloudRain,
    label: "Stormy",
    desc: "Chance of self-care",
    color: "text-rose-400",
    bg: "bg-rose-50/50"
  },
  follicular: {
    icon: CloudSun,
    label: "Breezy",
    desc: "Rising energy",
    color: "text-orange-400",
    bg: "bg-orange-50/50"
  },
  ovulation: {
    icon: Sun,
    label: "Sunny",
    desc: "Peak radiance",
    color: "text-amber-400",
    bg: "bg-amber-50/50"
  },
  luteal: {
    icon: Cloud,
    label: "Cloudy",
    desc: "Evening shadows",
    color: "text-indigo-400",
    bg: "bg-indigo-50/50"
  }
};

const CycleWeather = ({ date, lastPeriodStart, periodDuration, cycleLength }) => {
  const phaseId = getPhaseForDate(date, lastPeriodStart, periodDuration, cycleLength);
  const config = weatherConfig[phaseId] || weatherConfig.luteal;
  const Icon = config.icon;

  return (
    <motion.div
      key={phaseId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-3xl ${config.bg} border border-white/50 shadow-sm flex items-center gap-4 transition-all duration-700`}
    >
      <div className={`p-3 rounded-2xl bg-white shadow-sm ${config.color}`}>
        <Icon size={24} />
      </div>
      <div className="flex flex-col">
        <span className={`text-xs font-bold uppercase tracking-widest ${config.color}`}>
          {config.label}
        </span>
        <span className="text-sm text-gray-500 font-medium">
          {config.desc}
        </span>
      </div>
    </motion.div>
  );
};

export default CycleWeather;
