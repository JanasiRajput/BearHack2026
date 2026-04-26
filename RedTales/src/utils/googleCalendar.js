import { format, parseISO, startOfDay } from 'date-fns';

/** Build yyyy-MM-dd -> events[] from Google Calendar API `items`. */
export function indexEventsByLocalDay(items) {
  const map = new Map();
  if (!Array.isArray(items)) return map;
  for (const ev of items) {
    const raw = ev.start?.dateTime || ev.start?.date;
    if (!raw) continue;
    const d = parseISO(raw.length <= 10 ? `${raw}T12:00:00` : raw);
    const key = format(startOfDay(d), 'yyyy-MM-dd');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(ev);
  }
  return map;
}
