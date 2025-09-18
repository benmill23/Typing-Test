import React from 'react';

export default function TextDisplay({ 
  words, 
  currentWordIndex, 
  currentCharIndex, 
  typedText, 
  errors 
}) {
  const getWordClass = (wordIndex, charIndex) => {
    if (wordIndex < currentWordIndex) {
      return errors[wordIndex] ? 'text-red-400 bg-red-50' : 'text-green-600 bg-green-50';
    }
    if (wordIndex === currentWordIndex) {
      return 'bg-blue-50 text-blue-900 shadow-sm';
    }
    return 'text-gray-400';
  };

  const getCharClass = (wordIndex, charIndex, char) => {
    if (wordIndex !== currentWordIndex) return '';
    
    const typedChar = typedText[charIndex];
    if (charIndex < typedText.length) {
      if (typedChar === char) {
        return 'bg-green-200 text-green-800';
      } else {
        return 'bg-red-200 text-red-800';
      }
    } else if (charIndex === typedText.length) {
      return 'bg-blue-200 animate-pulse';
    }
    return '';
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
      <div className="text-2xl leading-relaxed font-light tracking-wide">
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block mr-2 mb-2">
            <span
              className={`px-2 py-1 rounded-lg transition-all duration-200 ${getWordClass(
                wordIndex
              )}`}
            >
              {word.split('').map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={`${getCharClass(wordIndex, charIndex, char)} transition-colors duration-150`}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
