import React, { useState, useEffect, useCallback } from 'react';
import { AnimationStep } from '../types';

interface PalindromeAnimationProps {
  input: string;
  isPlaying: boolean;
  currentStep: number;
  onStepChange: (step: number) => void;
  speed: number;
}

export const PalindromeAnimation: React.FC<PalindromeAnimationProps> = ({
  input,
  isPlaying,
  currentStep,
  onStepChange,
  speed
}) => {
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);

  const generateSteps = useCallback((s: string): AnimationStep[] => {
    const steps: AnimationStep[] = [];
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Initial step
    steps.push({
      left: 0,
      right: cleaned.length - 1,
      comparing: false,
      leftChar: cleaned[0] || '',
      rightChar: cleaned[cleaned.length - 1] || '',
      isMatch: null,
      message: `Cleaned string: "${cleaned}". Starting with two pointers.`,
      highlightLine: 3
    });

    let left = 0;
    let right = cleaned.length - 1;

    while (left < right) {
      // Comparison step
      const isMatch = cleaned[left] === cleaned[right];
      steps.push({
        left,
        right,
        comparing: true,
        leftChar: cleaned[left],
        rightChar: cleaned[right],
        isMatch,
        message: `Comparing '${cleaned[left]}' and '${cleaned[right]}': ${isMatch ? 'Match!' : 'No match - not a palindrome'}`,
        highlightLine: 6
      });

      if (!isMatch) {
        steps.push({
          left,
          right,
          comparing: false,
          leftChar: cleaned[left],
          rightChar: cleaned[right],
          isMatch: false,
          message: 'Characters don\'t match. Return false.',
          highlightLine: 7
        });
        return steps;
      }

      // Move pointers
      left++;
      right--;

      if (left < right) {
        steps.push({
          left,
          right,
          comparing: false,
          leftChar: cleaned[left] || '',
          rightChar: cleaned[right] || '',
          isMatch: true,
          message: 'Characters match! Move pointers inward.',
          highlightLine: 9
        });
      }
    }

    // Success step
    steps.push({
      left,
      right,
      comparing: false,
      leftChar: '',
      rightChar: '',
      isMatch: true,
      message: 'All characters checked. It\'s a palindrome!',
      highlightLine: 13
    });

    return steps;
  }, []);

  useEffect(() => {
    const steps = generateSteps(input);
    setAnimationSteps(steps);
    if (currentStep >= steps.length) {
      onStepChange(0);
    }
  }, [input, generateSteps, currentStep, onStepChange]);

  useEffect(() => {
    if (isPlaying && animationSteps.length > 0 && currentStep < animationSteps.length - 1) {
      const timer = setTimeout(() => {
        onStepChange(currentStep + 1);
      }, 2000 / speed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, animationSteps.length, onStepChange, speed]);

  const cleaned = input.toLowerCase().replace(/[^a-z0-9]/g, '');
  const currentStepData = animationSteps[currentStep];

  if (!currentStepData || cleaned.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="text-center text-gray-500">
          Enter a string to see the animation
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Algorithm Visualization</h3>
        <div className="text-sm text-gray-600">
          Original: <code className="bg-gray-100 px-2 py-1 rounded">"{input}"</code>
        </div>
        <div className="text-sm text-gray-600">
          Cleaned: <code className="bg-gray-100 px-2 py-1 rounded">"{cleaned}"</code>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          {cleaned.split('').map((char, index) => {
            const isLeft = index === currentStepData.left;
            const isRight = index === currentStepData.right;
            const isComparing = currentStepData.comparing && (isLeft || isRight);
            
            return (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-lg font-mono transition-all duration-500 ${
                  isLeft && isRight
                    ? 'border-purple-500 bg-purple-100 text-purple-700 scale-110 shadow-lg'
                    : isLeft
                    ? 'border-blue-500 bg-blue-100 text-blue-700 scale-110 shadow-lg'
                    : isRight
                    ? 'border-green-500 bg-green-100 text-green-700 scale-110 shadow-lg'
                    : 'border-gray-300 bg-gray-50 text-gray-700'
                } ${isComparing ? 'animate-pulse' : ''}`}
              >
                {char}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center space-x-8 mb-4">
          {currentStepData.left <= currentStepData.right && (
            <>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2">
                  L
                </div>
                <div className="text-xs text-gray-600">Left: {currentStepData.left}</div>
              </div>
              
              {currentStepData.left !== currentStepData.right && (
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2">
                    R
                  </div>
                  <div className="text-xs text-gray-600">Right: {currentStepData.right}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-2">Current Step:</div>
        <div className="text-gray-600">{currentStepData.message}</div>
        
        {currentStepData.comparing && (
          <div className="mt-3 flex items-center justify-center space-x-4">
            <div className={`px-3 py-2 rounded-lg ${currentStepData.isMatch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              '{currentStepData.leftChar}' {currentStepData.isMatch ? '=' : '≠'} '{currentStepData.rightChar}'
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
