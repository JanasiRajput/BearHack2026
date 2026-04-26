import React from 'react';
import { motion } from 'framer-motion';
import { getMonthlySummary } from '../data/cycleUtils';
import { Pin, Sparkles, Heart, Star, Cloud, Moon, Zap } from 'lucide-react';

const ScrapbookElement = ({ children, className, rotation = 0, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }}
    animate={{ opacity: 1, scale: 1, rotate: rotation }}
    transition={{ type: 'spring', damping: 15, delay }}
    className={`absolute ${className}`}
  >
    {children}
  </motion.div>
);

const Polaroid = ({ image, caption, className, rotation = 0, delay = 0 }) => (
  <ScrapbookElement rotation={rotation} delay={delay} className={`${className} p-4 bg-white shadow-xl border border-gray-100`}>
    <div className="relative aspect-square overflow-hidden mb-4 bg-gray-50">
      <img src={image} alt="Persona" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
    </div>
    <p className="font-rose text-2xl text-gray-700 text-center leading-tight">
      {caption}
    </p>
  </ScrapbookElement>
);

const TornNote = ({ children, className, color = 'bg-yellow-50', rotation = 0, delay = 0 }) => (
  <ScrapbookElement rotation={rotation} delay={delay} className={`${className} p-6 ${color} shadow-lg relative`}>
    {/* Torn Edge Effect */}
    <div className="absolute -top-1 left-0 right-0 h-2 bg-inherit" style={{ clipPath: 'polygon(0% 100%, 5% 40%, 10% 80%, 15% 20%, 20% 90%, 25% 30%, 30% 70%, 35% 10%, 40% 85%, 45% 40%, 50% 95%, 55% 30%, 60% 80%, 65% 15%, 70% 90%, 75% 25%, 80% 75%, 85% 10%, 90% 85%, 95% 40%, 100% 100%)' }} />
    <div className="absolute -bottom-1 left-0 right-0 h-2 bg-inherit" style={{ clipPath: 'polygon(0% 0%, 5% 60%, 10% 20%, 15% 80%, 20% 10%, 25% 70%, 30% 30%, 35% 90%, 40% 15%, 45% 60%, 50% 5%, 55% 70%, 60% 20%, 65% 85%, 70% 10%, 75% 75%, 80% 25%, 85% 90%, 90% 15%, 95% 60%, 100% 0%)' }} />
    
    <Pin className="absolute -top-3 left-1/2 -translate-x-1/2 text-gray-400 rotate-12" size={20} />
    {children}
  </ScrapbookElement>
);

const MonthlyWrap = ({ cycleData, reflections }) => {
  const [focusedId, setFocusedId] = React.useState(null);
  const summary = getMonthlySummary(cycleData, reflections);
  
  const { persona } = summary;

  const getZIndex = (id) => focusedId === id ? 100 : 'auto';

  return (
    <div className="h-full w-full relative overflow-hidden bg-[#fdfaf7] p-8 font-['Outfit',_sans-serif]">
      {/* Background Textures/Doodles */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-[0.6em] mb-2">Your Month in Motion</h3>
        <h2 className="text-5xl font-rose text-[#DC143C]/80">The Reveal</h2>
      </motion.div>

      <div className="relative w-full max-w-4xl mx-auto h-[600px]">
        {/* Main Persona Polaroid */}
        <div onClick={() => setFocusedId('persona')} style={{ zIndex: getZIndex('persona') }} className="relative">
          <Polaroid 
            image={persona.image}
            caption={persona.title}
            rotation={-3}
            delay={0.2}
            className="left-1/2 -translate-x-1/2 top-0 w-80 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          />
        </div>

        {/* Identity Summary Note */}
        <div onClick={() => setFocusedId('note')} style={{ zIndex: getZIndex('note') }} className="relative">
          <TornNote 
            rotation={5}
            delay={0.5}
            className="right-4 top-20 w-64 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <p className="text-gray-600 text-sm leading-relaxed italic">
              "{persona.description}"
            </p>
          </TornNote>
        </div>

        {/* Mood Snapshot - Layered Card */}
        <div onClick={() => setFocusedId('mood')} style={{ zIndex: getZIndex('mood') }} className="relative">
          <ScrapbookElement rotation={-8} delay={0.7} className="left-4 top-32 w-56 p-5 bg-white shadow-xl border border-gray-100 cursor-pointer transition-transform hover:scale-105 active:scale-95">
            <h4 className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-4">Mood Snapshot</h4>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">
                {persona.id === 'happy' ? '☀️' : 
                 persona.id === 'energetic' ? '⚡' : 
                 persona.id === 'calm' ? '🌿' : 
                 persona.id === 'tired' ? '☁️' : 
                 persona.id === 'overthinking' ? '🌀' : 
                 persona.id === 'overwhelmed' ? '🌊' : '✨'}
              </span>
              <span className="text-lg font-medium text-gray-700 capitalize">{persona.id}</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Dominant energy reflected throughout your cycle journey.
            </p>
          </ScrapbookElement>
        </div>

        {/* Insight Snippets */}
        <div onClick={() => setFocusedId('reflections')} style={{ zIndex: getZIndex('reflections') }} className="relative">
          <ScrapbookElement rotation={12} delay={0.9} className="left-20 bottom-24 cursor-pointer transition-transform hover:scale-110 active:scale-90">
            <div className="px-5 py-3 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg border border-emerald-100">
              {summary.totalReflections} Reflections
            </div>
          </ScrapbookElement>
        </div>

        <div onClick={() => setFocusedId('rhythm')} style={{ zIndex: getZIndex('rhythm') }} className="relative">
          <ScrapbookElement rotation={-5} delay={1.1} className="right-20 bottom-36 cursor-pointer transition-transform hover:scale-110 active:scale-90">
            <div className="px-5 py-3 bg-pink-50 text-pink-600 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg border border-pink-100 flex items-center gap-2">
              <Heart size={14} /> Unique Rhythm
            </div>
          </ScrapbookElement>
        </div>

        {/* "Handwritten" Insights */}
        <ScrapbookElement rotation={2} delay={1.3} className="left-1/2 -translate-x-1/2 bottom-0 w-96 text-center">
          <div className="space-y-4">
            <p className="font-rose text-3xl text-gray-500 leading-tight">
              "Every cycle tells a different story."
            </p>
            <div className="flex justify-center gap-6 opacity-30">
               <Star size={16} /> <Sparkles size={16} /> <Star size={16} />
            </div>
          </div>
        </ScrapbookElement>

        {/* Decorative Stickers */}
        <ScrapbookElement rotation={45} delay={1.5} className="top-10 left-10 text-pink-200">
          <Sparkles size={48} />
        </ScrapbookElement>
        <ScrapbookElement rotation={-15} delay={1.7} className="bottom-40 right-10 text-purple-200 opacity-50">
          <Moon size={64} />
        </ScrapbookElement>
        <ScrapbookElement rotation={20} delay={1.9} className="top-1/2 right-1/4 text-emerald-200">
          <Zap size={32} />
        </ScrapbookElement>
      </div>
    </div>
  );
};

export default MonthlyWrap;
