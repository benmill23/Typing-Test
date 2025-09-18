import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Results({ 
  wpm, 
  accuracy, 
  correctChars, 
  totalChars, 
  totalWords,
  onRestart 
}) {
  const getPerformanceRating = () => {
    if (wpm >= 60 && accuracy >= 95) return { rating: 'Exceptional', color: 'text-yellow-500', icon: Star };
    if (wpm >= 40 && accuracy >= 90) return { rating: 'Excellent', color: 'text-green-500', icon: Trophy };
    if (wpm >= 25 && accuracy >= 85) return { rating: 'Good', color: 'text-blue-500', icon: Trophy };
    return { rating: 'Keep Practicing', color: 'text-gray-500', icon: Trophy };
  };

  const { rating, color, icon: Icon } = getPerformanceRating();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
          color.includes('yellow') ? 'bg-yellow-100' :
          color.includes('green') ? 'bg-green-100' :
          color.includes('blue') ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <Icon className={`w-10 h-10 ${color}`} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h2>
        <p className={`text-xl font-semibold ${color}`}>{rating}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2 tabular-nums">{wpm}</div>
          <div className="text-sm text-gray-600 font-medium">Words/Min</div>
        </div>
 
