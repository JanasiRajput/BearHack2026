import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Check } from 'lucide-react';
import MonthlyWrap from './MonthlyWrap';
import { getMonthlySummary } from '../data/cycleUtils';

const MonthlyWrapModal = ({ isOpen, onClose, cycleData, reflections }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const summary = getMonthlySummary(cycleData, reflections);
    if (!summary) return;

    const shareText = `My month in RedTales: I'm a "${summary.persona.title}"! ✨ ${summary.totalReflections} reflections this month. Check your wrap on RedTales!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RedTales - My Monthly Wrap',
          text: shareText,
          url: window.location.origin
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Immersive Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#fdfaf7]/95 backdrop-blur-3xl z-[200]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-[210] flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Header Area */}
            <div className="absolute top-12 text-center pointer-events-none">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.6em] mb-4 block">Monthly Journey</span>
              <h2 className="text-4xl font-tales text-gray-800 font-light tracking-widest">Your Wrap</h2>
            </div>

            {/* Actions Area */}
            <div className="absolute top-12 right-12 flex gap-4 pointer-events-auto z-[220]">
              <button
                type="button"
                onClick={handleShare}
                className="p-4 rounded-full hover:bg-black/5 transition-all group relative bg-white/20 border border-white/40"
                title="Share your wrap"
              >
                {copied ? <Check className="w-6 h-6 text-emerald-500" /> : <Share2 className="w-6 h-6 text-gray-400 group-hover:text-gray-800" />}
                {copied && (
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Copied to Clipboard!
                  </span>
                )}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="p-4 rounded-full hover:bg-black/5 transition-all group"
              >
                <X size={24} className="text-gray-400 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            {/* Content Container */}
            <div className="w-full h-full pointer-events-auto">
              <MonthlyWrap cycleData={cycleData} reflections={reflections} />
            </div>

            {/* Ambient Background Glows */}
            <motion.div 
              animate={{ opacity: [0.03, 0.08, 0.03] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-purple-50 -z-10"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MonthlyWrapModal;
