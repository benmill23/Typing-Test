import React from 'react';
import { Target, Zap, TrendingUp } from 'lucide-react';

export default function StatsDisplay({ wpm, accuracy, correctChars, totalChars }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">WPM</p>
            <p className="text-3xl font-bold text-blue-600 tabular-nums">{wpm}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Accuracy</p>
            <p className="text-3xl font-bold text-emerald-600 tabular-nums">{accuracy}%</p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Progress</p>
            <p className="text-3xl font-bold text-purple-600 tabular-nums">
              {correctChars}/{totalChars}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
