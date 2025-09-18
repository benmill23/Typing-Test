import React from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ timeLeft, isRunning }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const circumference = 2 * Math.PI * 45;
  const progress = ((60 - timeLeft) / 60) * circumference;

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className={`transition-all duration-1000 ease-linear ${
              timeLeft <= 10 ? 'text-red-500' : 'text-blue-500'
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Clock className={`w-5 h-5 mb-1 ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-600'}`} />
          <span className={`text-lg font-bold tabular-nums ${
            timeLeft <= 10 ? 'text-red-500' : 'text-gray-900'
          }`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
