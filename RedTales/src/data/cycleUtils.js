import { addDays, differenceInDays, startOfDay, isBefore, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';

export const DEFAULT_CYCLE_LENGTH = 28;

export const getCycleState = (date, lastPeriodStart, periodDuration = 5, cycleLength = DEFAULT_CYCLE_LENGTH) => {
  if (!lastPeriodStart) return null;

  const dayRef = startOfDay(date);
  const anchor = startOfDay(lastPeriodStart);
  const diffInDays = differenceInDays(dayRef, anchor);
  const len = Math.max(1, cycleLength);
  const cycleDay = (diffInDays % len + len) % len + 1;
  const progressPercent = ((cycleDay - 1) / len) * 100;

  let phaseId = 'luteal';
  if (cycleDay <= periodDuration) phaseId = 'menstrual';
  else if (cycleDay <= 13) phaseId = 'follicular';
  else if (cycleDay <= 16) phaseId = 'ovulation';

  let nextPeriod = addDays(anchor, len);
  while (isBefore(startOfDay(nextPeriod), dayRef)) {
    nextPeriod = addDays(nextPeriod, len);
  }

  return {
    cycleDay,
    progressPercent,
    phaseId,
    nextPeriod
  };
};

export const getPhaseForDate = (date, lastPeriodStart, periodDuration = 5, cycleLength = DEFAULT_CYCLE_LENGTH) => {
  if (!lastPeriodStart) return 'follicular';
  const state = getCycleState(date, lastPeriodStart, periodDuration, cycleLength);
  return state.phaseId;
};

export const getDaysInMonth = (date) => {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  return eachDayOfInterval({ start, end });
};

export const getInsight = (date, lastPeriodStart, periodDuration = 5, cycleLength = DEFAULT_CYCLE_LENGTH) => {
  const phase = getPhaseForDate(date, lastPeriodStart, periodDuration, cycleLength);
  switch (phase) {
    case 'menstrual':
      return "Your cycle is consistent this month. Take extra time to rest. 🌙";
    case 'follicular':
      return "Your energy is starting to rise! Great time for new ideas. ✨";
    case 'ovulation':
      return "You're at your peak glow today. Enjoy the confidence! 💛";
    case 'luteal':
      return "Your body is winding down. Be extra kind to yourself. ☁️";
    default:
      return "Your pattern is still forming. 💛";
  }
};

/**
 * Determines the monthly persona based on mood and tag patterns.
 */
export const getMonthlyPersona = (reflections) => {
  if (!reflections || reflections.length === 0) {
    return {
      id: 'calm',
      title: 'The Serene Observer',
      description: 'You moved through this month with a quiet, observant grace.',
      image: '/images/persona_img/calm.png'
    };
  }

  // 1. Count moods
  const moodCounts = reflections.reduce((acc, r) => {
    acc[r.mood] = (acc[r.mood] || 0) + 1;
    return acc;
  }, {});

  // 2. Count tags
  const tagCounts = reflections.reduce((acc, r) => {
    (r.tags || []).forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  // 3. Determine dominant mood
  let dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0];

  // 4. Handle ties or specific tag combinations (Secondary Logic)
  if (moodCounts['happy'] && moodCounts['energetic'] && moodCounts['happy'] === moodCounts['energetic']) {
    if (tagCounts['Friends'] > tagCounts['Body']) dominantMood = 'happy';
  }

  const personas = {
    happy: {
      id: 'happy',
      title: 'The Radiant Joy-Seeker',
      description: 'Your energy was a source of light, blooming most in moments of connection.',
      image: '/images/persona_img/happy.png'
    },
    energetic: {
      id: 'energetic',
      title: 'The Spirited Catalyst',
      description: 'You embraced momentum and creative flow, turning ideas into action.',
      image: '/images/persona_img/energetic.png'
    },
    calm: {
      id: 'calm',
      title: 'The Serene Observer',
      description: 'You moved through this month with a quiet, observant grace.',
      image: '/images/persona_img/calm.png'
    },
    tired: {
      id: 'tired',
      title: 'The Quiet Rester',
      description: 'You listened to your body\'s need for rest, finding strength in the slow moments.',
      image: '/images/persona_img/tired.png'
    },
    overthinking: {
      id: 'overthinking',
      title: 'The Deep Navigator',
      description: 'You explored the complexity of your thoughts, seeking depth and understanding.',
      image: '/images/persona_img/overthinking.png'
    },
    overwhelmed: {
      id: 'overwhelmed',
      title: 'The Brave Tide-Walker',
      description: 'Even when the waves felt high, you kept moving with resilience and courage.',
      image: '/images/persona_img/overwhelmed.png'
    }
  };

  return personas[dominantMood] || personas['calm'];
};

export const getMonthlySummary = (cycleData, reflections) => {
  // Provide safe defaults if cycleData is missing
  const safeCycleData = cycleData || {
    cycleLength: 28,
    duration: 5,
    lastPeriodStart: new Date()
  };
  
  const moodCounts = (reflections || []).reduce((acc, r) => {
    acc[r.mood] = (acc[r.mood] || 0) + 1;
    return acc;
  }, {});

  const primaryMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'calm';
  const persona = getMonthlyPersona(reflections || []);
  
  return {
    cycleLength: safeCycleData.cycleLength || 28,
    periodDuration: safeCycleData.duration || 5,
    primaryMood: primaryMood.charAt(0).toUpperCase() + primaryMood.slice(1),
    totalReflections: (reflections || []).length,
    persona,
    reflections: reflections || []
  };
};
