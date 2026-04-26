import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus } from 'lucide-react';

const moods = [
  { id: 'calm', label: 'Calm', icon: '🌿' },
  { id: 'energetic', label: 'Energetic', icon: '⚡' },
  { id: 'tired', label: 'Tired', icon: '☁️' },
  { id: 'overwhelmed', label: 'Overwhelmed', icon: '🌊' },
  { id: 'happy', label: 'Happy', icon: '☀️' },
  { id: 'overthinking', label: 'Overthinking', icon: '🌀' },
];

const defaultTags = ['School', 'Friends', 'Sleep', 'Food', 'Body'];

const ReflectionModal = ({ isOpen, onClose, phase, onSave }) => {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');

  if (!phase) return null;

  const handleToggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e) => {
    if (e.key === 'Enter' && customTag.trim()) {
      handleToggleTag(customTag.trim());
      setCustomTag('');
    }
  };

  const handleSubmit = () => {
    onSave(phase.id, { 
      mood: selectedMood, 
      note, 
      tags: selectedTags 
    });
    onClose();
    // Reset state for next time
    setTimeout(() => {
      setStep(1);
      setSelectedMood(null);
      setNote('');
      setSelectedTags([]);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 backdrop-blur-md z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm 
                       bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] z-[210] p-8 border border-white/50"
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors z-[220]"
            >
              <X size={20} className="text-gray-400" />
            </button>

            <div className="space-y-8">
              {/* Progress Indicator */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map(i => (
                  <div 
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-gray-600' : 'w-4 bg-gray-100'}`}
                  />
                ))}
              </div>

              {/* Step 1: Mood */}
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-1">
                    <h3 className="text-2xl font-medium text-gray-800">How are you feeling?</h3>
                    <p className="text-sm text-gray-400">Select your current mood</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {moods.map(mood => (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedMood(mood.id);
                        }}
                        className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group
                                   ${selectedMood === mood.id 
                                     ? 'bg-gray-50 border-gray-400 shadow-inner scale-[0.98]' 
                                     : 'bg-white border-gray-50 hover:border-gray-200 hover:bg-gray-50/50'}`}
                      >
                        <span className="text-3xl transition-transform group-hover:scale-110">{mood.icon}</span>
                        <span className="text-xs font-bold text-gray-600">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={!selectedMood}
                    onClick={() => setStep(2)}
                    className={`w-full py-4 rounded-2xl font-medium transition-all
                               ${selectedMood 
                                 ? 'bg-gray-800 text-white shadow-lg' 
                                 : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    Next
                  </button>
                </motion.div>
              )}

              {/* Step 2: Short Note */}
              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-1">
                    <h3 className="text-2xl font-medium text-gray-800">Small thought?</h3>
                    <p className="text-sm text-gray-400">Just a line or two (optional)</p>
                  </div>
                  <textarea
                    autoFocus
                    placeholder="Add a small thought..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full h-24 p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-gray-100 
                               resize-none text-gray-700 placeholder-gray-300 transition-all font-normal"
                    maxLength={100}
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-2xl font-medium bg-gray-50 text-gray-500"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 py-4 rounded-2xl font-medium bg-gray-800 text-white shadow-lg"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Tags */}
              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-1">
                    <h3 className="text-2xl font-medium text-gray-800">Any focus?</h3>
                    <p className="text-sm text-gray-400">Tap to add tags (optional)</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {[...defaultTags, ...selectedTags.filter(t => !defaultTags.includes(t))].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleTag(tag);
                        }}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border
                                   ${selectedTags.includes(tag)
                                     ? 'bg-gray-800 text-white border-gray-800 shadow-lg scale-[0.98]'
                                     : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                      >
                        {tag}
                      </button>
                    ))}
                    <div className="relative inline-flex items-center">
                      <Plus size={12} className="absolute left-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Add tag..."
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyDown={handleAddCustomTag}
                        className="pl-8 pr-4 py-2 rounded-full text-xs bg-gray-50 border-none focus:ring-2 focus:ring-gray-100 w-28 text-gray-600 placeholder-gray-300"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 rounded-2xl font-medium bg-gray-50 text-gray-500"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-[2] py-4 rounded-2xl font-medium bg-gray-800 text-white shadow-lg flex items-center justify-center gap-2"
                    >
                      <Check size={18} />
                      Save Reflection
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReflectionModal;
