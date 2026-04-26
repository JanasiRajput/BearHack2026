import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const Sparkle = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
    animate={{ 
      opacity: [0, 1, 0], 
      scale: [0, 1.2, 0.6], 
      y: -80,
      x: (Math.random() - 0.5) * 60
    }}
    transition={{ duration: 1.8, delay, ease: "easeOut" }}
    className="absolute text-[12px] pointer-events-none z-30"
  >
    ✨
  </motion.div>
);

const CharacterCard = ({ phase, onClick, onPlusClick, isActive, showFeedback }) => {
  const handlePlusClick = (e) => {
    e.stopPropagation();
    onPlusClick();
  };

  // Uniform sizes for all cards (Scaled down slightly)
  const sizes = {
    container: "w-20 h-32 md:w-36 md:h-56 lg:w-44 lg:h-64",
    inner: "w-16 h-24 md:w-32 md:h-48 lg:w-40 lg:h-56",
    radius: "rounded-[1rem] md:rounded-[2rem] lg:rounded-[2.5rem]"
  };

  // Custom scale for the character picture itself
  const imageScale = phase.id === 'menstrual' ? 2.2 : 
                    (phase.id === 'follicular' ? 1.4 : 
                    (phase.id === 'ovulation' || phase.id === 'luteal' ? 1.5 : 1.1));

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        scale: showFeedback ? 1.05 : (isActive ? 1.08 : 1),
      }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="relative group flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      {/* Top Indicator Space */}
      <div className="h-10 flex items-center justify-center mb-3">
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="px-4 py-1.5 rounded-full bg-gray-800/5 border border-gray-800/10"
            >
              <span className="text-[12px] font-medium text-gray-400 uppercase tracking-[0.3em]">Now</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Glow/Halo Effect */}
      <AnimatePresence>
        {(isActive || showFeedback) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: showFeedback ? 0.7 : 0.4, 
              scale: showFeedback ? 1.5 : 1.2 
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute inset-0 top-10 blur-[50px] rounded-full z-0 transition-colors duration-700`}
            style={{ backgroundColor: `var(--${phase.id}-accent)` }}
          />
        )}
      </AnimatePresence>

      {/* Sparkles on Save */}
      {showFeedback && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <Sparkle key={i} delay={i * 0.08} />
          ))}
        </div>
      )}

      {/* Character Placeholder / Container */}
      <div className={`relative ${sizes.container} mb-4 flex items-end justify-center z-10`}>
        <motion.div
          animate={{ 
            y: [0, -8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-full h-full flex flex-col items-center justify-end"
        >
          <div className={`relative ${sizes.inner} ${sizes.radius} bg-gradient-to-b from-white/80 to-transparent 
                          flex items-center justify-center border-b-4 border-white/50 shadow-sm transition-all duration-700
                          overflow-hidden ${isActive || showFeedback ? 'ring-4 ring-white/50 shadow-xl brightness-110' : 'brightness-100 opacity-90'}`}>
             
             {/* Shimmer Sweep Effect */}
             {showFeedback && (
               <motion.div
                 initial={{ x: '-100%' }}
                 animate={{ x: '100%' }}
                 transition={{ duration: 1.2, ease: "easeInOut" }}
                 className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
               />
             )}

             <motion.div
               style={{ scale: imageScale }}
               className="w-full h-full flex items-center justify-center transition-transform duration-700"
             >
               {phase.image ? (
                 <img 
                   src={phase.image} 
                   alt={phase.name} 
                   className="w-full h-full object-contain p-4"
                   onError={(e) => {
                     e.target.onerror = null;
                     e.target.style.display = 'none';
                     e.target.parentElement.innerHTML = '<div class="text-4xl">✨</div>';
                   }}
                 />
               ) : (
                 <div className="text-4xl">✨</div>
               )}
             </motion.div>
          </div>
        </motion.div>

        {/* Plus Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlusClick}
          className={`absolute bottom-6 -right-3 p-3.5 rounded-full shadow-lg z-20 transition-colors
                     bg-white text-gray-800 hover:shadow-xl ${(isActive || showFeedback) ? 'animate-pulse-slow ring-2 ring-white' : ''}`}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Label */}
      <motion.span 
        className={`text-lg font-medium tracking-[0.2em] uppercase transition-colors duration-500
                   ${isActive || showFeedback ? 'text-gray-800' : 'text-gray-500'}`}
      >
        {phase.name.split(' ')[0]}
      </motion.span>
    </motion.div>
  );
};

export default CharacterCard;
