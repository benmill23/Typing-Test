
import React, { useState, useEffect, useCallback } from 'react';
import { TextContent } from '@/entities/TextContent';
import { Button } from '@/components/ui/button';
import { Play, Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

import Timer from '../components/typing/Timer';
import TextDisplay from '../components/typing/TextDisplay';
import StatsDisplay from '../components/typing/StatsDisplay';
import Results from '../components/typing/Results';

const TEST_DURATION = 60; // 1 minute in seconds

export default function TypingTest() {
  const [textContents, setTextContents] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [errors, setErrors] = useState({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const selectRandomText = useCallback((contents) => {
    if (contents.length === 0) return;
    
    const content = contents[Math.floor(Math.random() * contents.length)];
    const contentWords = content.content.split(/\s+/).filter(word => word.length > 0);
    
    // Select random starting point (ensure at least 100 words available)
    const maxStartIndex = Math.max(0, contentWords.length - 100);
    const startIndex = Math.floor(Math.random() * maxStartIndex);
    const selectedWords = contentWords.slice(startIndex, startIndex + 100);
    
    setCurrentText(content.content);
    setWords(selectedWords);
  }, []); // Dependencies: state setters are stable, `contents` is an argument.

  const loadTextContents = useCallback(async () => {
    const contents = await TextContent.list();
    setTextContents(contents);
    if (contents.length > 0) {
      selectRandomText(contents);
    }
  }, [selectRandomText]); // Dependency: selectRandomText is now a useCallback

  useEffect(() => {
    loadTextContents();
  }, [loadTextContents]); // Dependency: loadTextContents is now a useCallback

  const calculateStats = useCallback(() => {
    const timeElapsed = (TEST_DURATION - timeLeft) / 60; // in minutes
    const wpm = timeElapsed > 0 ? Math.round(correctChars / 5 / timeElapsed) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    
    return { wpm, accuracy };
  }, [correctChars, totalChars, timeLeft]);

  const handleKeyPress = useCallback((e) => {
    if (!isRunning || isCompleted) return;

    const key = e.key;
    const currentWord = words[currentWordIndex];
    
    if (!currentWord) return;

    if (key === ' ') {
      e.preventDefault();
      if (typedText === currentWord) {
        setCurrentWordIndex(prev => prev + 1);
        setCurrentCharIndex(0);
        setTypedText('');
      } else {
        setErrors(prev => ({ ...prev, [currentWordIndex]: true }));
        setCurrentWordIndex(prev => prev + 1);
        setCurrentCharIndex(0);
        setTypedText('');
      }
      return;
    }

    if (key === 'Backspace') {
      e.preventDefault();
      setTypedText(prev => prev.slice(0, -1));
      setCurrentCharIndex(prev => Math.max(0, prev - 1));
      return;
    }

    if (key.length === 1) {
      e.preventDefault();
      const newTypedText = typedText + key;
      const newTotalChars = totalChars + 1;
      const isCorrect = key === currentWord[currentCharIndex];
      
      setTypedText(newTypedText);
      setCurrentCharIndex(prev => prev + 1);
      setTotalChars(newTotalChars);
      
      if (isCorrect) {
        setCorrectChars(prev => prev + 1);
      }
    }
  }, [isRunning, isCompleted, currentWordIndex, currentCharIndex, typedText, words, totalChars]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isRunning, handleKeyPress]);

  const startTest = () => {
    if (words.length === 0) {
      // If words haven't been loaded or selected, try to select again.
      // This case should be rare if loadTextContents runs correctly on mount.
      selectRandomText(textContents);
      if (words.length === 0) return; // If still no words, can't start.
    }
    
    setIsRunning(true);
    setStartTime(Date.now());
    setTimeLeft(TEST_DURATION);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setTypedText('');
    setErrors({});
    setCorrectChars(0);
    setTotalChars(0);
    setIsCompleted(false);
  };

  const restartTest = () => {
    selectRandomText(textContents);
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeft(TEST_DURATION);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setTypedText('');
    setErrors({});
    setCorrectChars(0);
    setTotalChars(0);
    setStartTime(null);
  };

  const { wpm, accuracy } = calculateStats();

  if (textContents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-2xl p-12 shadow-xl border border-gray-100 max-w-md">
          <FileText className="w-16 h-16 mx-auto mb-6 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Text Content Available</h2>
          <p className="text-gray-600 mb-6">Please add some text content to start practicing.</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Add Text Content
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Typing Master
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Test your typing speed and accuracy
          </p>
        </motion.div>

        {!isCompleted ? (
          <>
            {isRunning ? (
              <Timer timeLeft={timeLeft} isRunning={isRunning} />
            ) : (
              <div className="text-center mb-8">
                <Button
                  onClick={startTest}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Start 1-Minute Test
                </Button>
              </div>
            )}

            {isRunning && (
              <StatsDisplay 
                wpm={wpm}
                accuracy={accuracy}
                correctChars={correctChars}
                totalChars={totalChars}
              />
            )}

            {words.length > 0 && (
              <TextDisplay
                words={words}
                currentWordIndex={currentWordIndex}
                currentCharIndex={currentCharIndex}
                typedText={typedText}
                errors={errors}
              />
            )}

            {!isRunning && !isCompleted && (
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-4">
                  Click "Start" and begin typing to start the test
                </p>
                <Button
                  variant="outline"
                  onClick={restartTest}
                  className="mr-4"
                >
                  New Random Text
                </Button>
              </div>
            )}
          </>
        ) : (
          <Results
            wpm={wpm}
            accuracy={accuracy}
            correctChars={correctChars}
            totalChars={totalChars}
            totalWords={currentWordIndex}
            onRestart={restartTest}
          />
        )}
      </div>
    </div>
  );
}
