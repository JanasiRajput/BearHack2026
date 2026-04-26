import { supabase } from './supabase';

export const migrateLocalStorageToSupabase = async (userId) => {
  try {
    // 1. Get data from localStorage
    const cycleData = JSON.parse(localStorage.getItem('redTales_cycleData'));
    const reflections = JSON.parse(localStorage.getItem('redTales_reflections')) || [];

    if (!cycleData && reflections.length === 0) {
      console.log("No data found in localStorage to migrate.");
      return { success: true, message: "No data to migrate" };
    }

    // 2. Migrate Cycle Data
    if (cycleData) {
      const { error: cycleError } = await supabase
        .from('cycles')
        .insert({
          user_id: userId,
          start_date: cycleData.lastPeriodStart,
          period_duration: cycleData.duration,
          cycle_length: 28, // Default or calculated
        });

      if (cycleError) throw cycleError;
    }

    // 3. Migrate Reflections
    if (reflections.length > 0) {
      const formattedReflections = reflections.map(ref => ({
        user_id: userId,
        timestamp: new Date(ref.timestamp).toISOString(),
        mood: ref.mood,
        energy_level: 3, // Default if not tracked in old schema
        tags: ref.tags || [],
        notes: ref.notes || '',
        phase_id: ref.phaseId,
        cycle_day: 1, // Placeholder
      }));

      const { error: refError } = await supabase
        .from('reflections')
        .insert(formattedReflections);

      if (refError) throw refError;
    }

    console.log("Migration successful!");
    return { success: true };

  } catch (error) {
    console.error("Migration failed:", error);
    return { success: false, error: error.message };
  }
};
