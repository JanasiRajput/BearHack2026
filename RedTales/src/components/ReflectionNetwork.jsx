import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Wind, Sprout } from 'lucide-react';

const PollenParticles = ({ count = 6, phaseId }) => (
  <g>
    {[...Array(count)].map((_, i) => (
      <motion.circle
        key={i}
        r={1 + Math.random() * 1.5}
        fill={`var(--${phaseId}-accent)`}
        initial={{
          x: (Math.random() - 0.5) * 40,
          y: (Math.random() - 0.5) * 40,
          opacity: 0
        }}
        animate={{
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          opacity: [0, 0.6, 0],
          scale: [0.5, 1.2, 0.5]
        }}
        transition={{
          duration: 4 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 2
        }}
        className="filter blur-[1px]"
      />
    ))}
  </g>
);

const GardenStem = ({ start, end, phaseId, strength = 1, delay = 0, isSubBranch = false }) => {
  // Create a more organic, multi-point curve
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const midX = start.x + dx * 0.5 + (Math.random() - 0.5) * 80;
  const midY = start.y + dy * 0.5 + (Math.random() - 0.5) * 80;
  
  const path = `M ${start.x} ${start.y} Q ${midX} ${midY}, ${end.x} ${end.y}`;

  return (
    <g>
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: (isSubBranch ? 0.4 : 0.7) + strength * 0.1 }}
        transition={{ duration: 3, delay, ease: "easeInOut" }}
        d={path}
        fill="none"
        stroke={`var(--${phaseId}-accent)`}
        strokeWidth={(isSubBranch ? 3 : 5) + strength * 3}
        strokeLinecap="round"
        className="filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] brightness-[1.1]"
      />
      
      {/* Organic Nodes/Leaves along the curve */}
      {[0.2, 0.5, 0.8].map((t, i) => {
        const x = start.x + (midX - start.x) * t * 2 + (end.x - midX) * Math.max(0, t * 2 - 1);
        const y = start.y + (midY - start.y) * t * 2 + (end.y - midY) * Math.max(0, t * 2 - 1);
        
        return (
          <motion.path
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isSubBranch ? 0.8 : 1.2, opacity: 0.8 }}
            transition={{ delay: delay + 1 + i * 0.4 }}
            d="M 0 0 C 8 -8, 15 -8, 20 0 C 15 8, 8 8, 0 0"
            fill={`var(--${phaseId}-accent)`}
            className="filter brightness-[0.5]"
            style={{ x, y, rotate: Math.random() * 360 }}
          />
        );
      })}
    </g>
  );
};

const FlowerBloom = ({ x, y, phaseId, stage = 0, delay = 0 }) => {
  const petalConfig = {
    menstrual: { count: 3, shape: "M 0 0 C -8 -15, 8 -15, 0 0", rotate: 120 },
    follicular: { count: 5, shape: "M 0 0 C -5 -20, 5 -20, 0 0", rotate: 72 },
    ovulation: { count: 10, shape: "M 0 0 C -12 -25, 12 -25, 0 0", rotate: 36 },
    luteal: { count: 6, shape: "M 0 0 C -15 -20, 15 -20, 0 0", rotate: 60 }
  };

  const config = petalConfig[phaseId];
  const scale = 0.8 + stage * 1.2;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 15, delay }}
      className="cursor-help"
      style={{ x, y }}
    >
      {stage > 0.4 && (
        <motion.circle
          r={35 * stage}
          fill={`var(--${phaseId}-accent)`}
          animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="filter blur-3xl brightness-[0.9]"
        />
      )}

      <g>
        {[...Array(config.count)].map((_, i) => (
          <motion.path
            key={i}
            d={config.shape}
            fill={`var(--${phaseId}-accent)`}
            className="filter drop-shadow-2xl brightness-[0.7]"
            initial={{ rotate: i * config.rotate, scale: 0 }}
            animate={{ 
              rotate: i * config.rotate, 
              scale: scale,
              opacity: 0.95
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: delay + i * 0.05 }}
          />
        ))}
      </g>

      <motion.circle
        r={5 + stage * 6}
        fill={`var(--${phaseId}-accent)`}
        className="filter blur-[1px] brightness-[0.5]"
        animate={{ 
          opacity: [0.7, 1.0, 0.7],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.circle
        r={3 + stage * 2}
        fill="white"
        className="opacity-80"
      />
      
      {stage > 0.8 && <PollenParticles phaseId={phaseId} />}
    </motion.g>
  );
};

const ReflectionNetwork = ({ isOpen, onClose, reflections, activePhaseId }) => {
  const [showInfo, setShowInfo] = React.useState(false);
  const phaseIds = ['menstrual', 'follicular', 'ovulation', 'luteal'];
  
  const networkData = useMemo(() => {
    const center = { x: 0, y: 0 };
    const now = new Date();
    const currentMonthReflections = reflections.filter(r => {
      const rDate = new Date(r.date || Date.now());
      return rDate.getMonth() === now.getMonth() && rDate.getFullYear() === now.getFullYear();
    });

    const phaseNodes = phaseIds.map((id, i) => {
      const baseAngle = (i * 90 - 45) * (Math.PI / 180);
      const phaseReflections = currentMonthReflections.filter(r => r.phaseId === id);
      
      // Intelligent Consolidation: Max 5 branch "slots"
      // If reflections > 5, we increase maturity instead of branch count
      const maturity = Math.min(phaseReflections.length / 5, 1.5); 
      const visibleCount = Math.min(phaseReflections.length, 5);
      
      const dist = 140 + (maturity * 20); // Elder branches grow longer
      const mainX = Math.cos(baseAngle) * dist;
      const mainY = Math.sin(baseAngle) * dist;

      const subBranches = phaseReflections.slice(0, 5).map((ref, rIdx) => {
        // Spread sub-branches organically with avoidance
        const spread = 0.6 + (maturity * 0.2);
        const subAngle = baseAngle + (rIdx - (visibleCount - 1) / 2) * spread;
        const subDist = 200 + (maturity * 40);
        
        return {
          id: ref.id,
          mood: ref.mood,
          x: Math.cos(subAngle) * subDist,
          y: Math.sin(subAngle) * subDist,
          maturity: maturity > 1 ? 1.2 : 0.8,
          splitPoint: {
            x: mainX * (0.3 + (rIdx * 0.1)),
            y: mainY * (0.3 + (rIdx * 0.1))
          }
        };
      });

      return {
        id,
        x: mainX,
        y: mainY,
        maturity,
        subBranches
      };
    });

    return { center, phaseNodes, totalHistoryCount: reflections.length };
  }, [reflections]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#fdfaf7]/99 backdrop-blur-3xl z-[200]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-12 z-[210] flex flex-col items-center justify-center glass rounded-[4rem] border-2 border-white/80 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] pointer-events-none overflow-hidden"
          >
            {/* Header Area */}
            <div className="absolute top-12 text-center pointer-events-auto">
              <span className="text-xs font-semibold text-emerald-800/60 uppercase tracking-[0.5em] mb-4 block flex items-center justify-center gap-4">
                <Sprout size={20} />
                Reflective Ecosystem
              </span>
              <h2 className="text-6xl md:text-7xl font-rose text-gray-800 font-light tracking-[0.1em]">Cycle Garden</h2>
            </div>

            {/* Left Side Information Column (Legend + Info Trigger) */}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-10 pointer-events-auto">
              <div className="space-y-6">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.4em] mb-4 block">Garden Phases</span>
                {phaseIds.map(id => (
                  <div key={id} className="flex items-center gap-5 group cursor-default">
                    <div className={`relative w-5 h-5 rounded-md shadow-md border border-white/40 transition-transform group-hover:scale-110 duration-300
                      ${id === 'menstrual' ? 'bg-rose-400 shadow-rose-200/40' : 
                        id === 'follicular' ? 'bg-orange-400 shadow-orange-200/40' : 
                        id === 'ovulation' ? 'bg-amber-400 shadow-amber-200/40' : 'bg-indigo-400 shadow-indigo-200/40'}`} 
                    >
                      <div className="absolute inset-0 rounded-md bg-white opacity-20" />
                    </div>
                    <span 
                      className="text-lg font-medium capitalize tracking-[0.1em] transition-all duration-300"
                      style={{ color: `var(--${id}-accent)`, filter: 'brightness(0.8)' }}
                    >
                      {id}
                    </span>
                  </div>
                ))}
              </div>

              {/* Info Trigger moved to bottom of legend column */}
              <div className="pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowInfo(!showInfo)}
                  className="flex items-center gap-4 group transition-all"
                >
                  <div className="p-4 rounded-2xl glass border border-white/50 shadow-md group-hover:scale-110 group-hover:bg-emerald-50 transition-all text-gray-400 group-hover:text-emerald-600">
                    <Sparkles size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Garden Guide
                  </span>
                </button>
              </div>
            </div>

            {/* Info Pop-up Card (Repositioned to left relative to new trigger) */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.9 }}
                  className="absolute left-60 top-1/2 -translate-y-1/2 w-72 glass p-8 rounded-[2.5rem] border-2 border-white/80 shadow-2xl pointer-events-auto space-y-6"
                >
                  <div className="space-y-3">
                    <h3 className="text-2xl font-rose text-gray-800 font-light">Your Living Cycle</h3>
                    <p className="text-[9px] text-gray-400 font-medium leading-relaxed uppercase tracking-[0.4em]">Growth through reflection</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-[9px] font-medium text-emerald-800 uppercase tracking-widest opacity-60">The System</p>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">
                        Each branch represents a phase of your cycle. As you add notes and moods, your garden grows.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-medium text-emerald-800 uppercase tracking-widest opacity-60">Symbolism</p>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">
                        Buds represent your first thoughts, while full blooms signify deep emotional engagement.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInfo(false)}
                    className="w-full py-3.5 rounded-2xl bg-gray-800 text-white text-[9px] font-medium uppercase tracking-[0.4em] hover:bg-emerald-800 transition-all shadow-lg"
                  >
                    Got it
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={onClose}
              className="absolute top-12 right-12 p-6 rounded-full hover:bg-black/5 transition-all pointer-events-auto group"
            >
              <X size={32} className="text-gray-400 group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center pointer-events-auto">
              <svg viewBox="-300 -300 600 600" className="w-full h-full overflow-visible">
                {/* Tree Structure */}
                {networkData.phaseNodes.map((phase, i) => (
                  <React.Fragment key={`phase-tree-${phase.id}`}>
                    <GardenStem 
                      start={networkData.center}
                      end={{ x: phase.x, y: phase.y }}
                      phaseId={phase.id}
                      strength={1 + phase.maturity}
                      delay={i * 0.2}
                    />

                    {phase.subBranches.map((sub, sIdx) => (
                      <React.Fragment key={sub.id}>
                        <GardenStem 
                          start={sub.splitPoint}
                          end={{ x: sub.x, y: sub.y }}
                          phaseId={phase.id}
                          strength={sub.maturity}
                          isSubBranch={true}
                          delay={i * 0.2 + sIdx * 0.1 + 0.5}
                        />
                        <FlowerBloom 
                          x={sub.x} y={sub.y} 
                          phaseId={phase.id} 
                          stage={sub.maturity * (sub.mood ? 1.2 : 0.8)}
                          delay={i * 0.2 + sIdx * 0.1 + 1.5}
                        />
                      </React.Fragment>
                    ))}

                    <FlowerBloom 
                      x={phase.x} y={phase.y} 
                      phaseId={phase.id} 
                      stage={phase.maturity}
                      delay={i * 0.2 + 0.8}
                    />
                  </React.Fragment>
                ))}

                {/* Central Core (Hub Style with History) */}
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  {/* Golden Root (History Indicator) */}
                  {networkData.totalHistoryCount > 0 && (
                    <motion.circle
                      r={65 + Math.min(networkData.totalHistoryCount, 50)}
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="2"
                      strokeDasharray="5,10"
                      animate={{ opacity: [0.1, 0.4, 0.1], rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="filter blur-[2px]"
                    />
                  )}

                  <motion.circle
                    r="100"
                    fill="none"
                    stroke="#F7FAFC"
                    strokeWidth="1"
                    animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  />
                  <motion.circle
                    r="80"
                    fill="white"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    className="filter blur-2xl"
                  />
                  
                  <circle r="60" fill="white" className="shadow-2xl" />
                  <defs>
                    <clipPath id="avatarCircle">
                      <circle cx="0" cy="0" r="58" />
                    </clipPath>
                    <radialGradient id="avatarOverlay" cx="50%" cy="50%" r="50%">
                      <stop offset="85%" stopColor="white" stopOpacity="0" />
                      <stop offset="100%" stopColor="white" stopOpacity="0.8" />
                    </radialGradient>
                  </defs>
                  <circle r="58" fill="white" />
                  <image
                    href="/images/avatar.png"
                    x="-58" y="-58" width="116" height="116"
                    clipPath="url(#avatarCircle)"
                    className="select-none pointer-events-none"
                  />
                  <circle r="58" fill="url(#avatarOverlay)" className="pointer-events-none" />
                  <text y="85" textAnchor="middle" className="text-[10px] font-medium uppercase tracking-[0.5em] fill-gray-400">Guardian</text>
                  {networkData.totalHistoryCount > 0 && (
                    <text y="-75" textAnchor="middle" className="text-[9px] font-bold uppercase tracking-[0.2em] fill-amber-500">
                      {networkData.totalHistoryCount} Rooted Insights
                    </text>
                  )}
                </motion.g>
              </svg>
            </div>

            {/* Bottom Details */}
            <div className="absolute bottom-12 text-center max-w-2xl pointer-events-auto space-y-10">
               <div className="flex justify-center gap-16">
                  <div className="flex items-center gap-4">
                    <Sparkles size={28} className="text-emerald-700/60" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-[0.3em]">Full Bloom</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Wind size={28} className="text-gray-400/60" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-[0.3em]">Dormant Bud</span>
                  </div>
               </div>
               <p className="text-lg md:text-xl text-gray-400 font-normal leading-relaxed italic max-w-xl mx-auto opacity-70">
                  "Your thoughts are seeds. The more you reflect, the more your emotional landscape blooms into a unique, personal garden."
               </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReflectionNetwork;
