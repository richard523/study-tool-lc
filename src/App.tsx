import React, { useState, useMemo } from 'react';
import { ProblemHeader } from './components/ProblemHeader';
import { PalindromeAnimation } from './components/PalindromeAnimation';
import { AlienDictionaryAnimation } from './components/AlienDictionaryAnimation';
import { InputSection } from './components/InputSection';
import { AlienDictionaryInput } from './components/AlienDictionaryInput';
import { CodeDisplay } from './components/CodeDisplay';
import { AnimationControls } from './components/AnimationControls';
import { ProblemNavigation } from './components/ProblemNavigation';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { problems } from './data/problems';
import { Brain, Code } from 'lucide-react';

function App() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('A man, a plan, a canal: Panama');
  const [alienWords, setAlienWords] = useState(['wrt', 'wrf', 'er', 'ett', 'rftt']);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1);

  const problem = problems[currentProblemIndex];

  // Reset animation state when switching problems
  const handleProblemChange = (index: number) => {
    setCurrentProblemIndex(index);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Keyboard navigation
  useKeyboardNavigation({
    onPrevious: () => handleProblemChange(Math.max(0, currentProblemIndex - 1)),
    onNext: () => handleProblemChange(Math.min(problems.length - 1, currentProblemIndex + 1)),
    canGoPrevious: currentProblemIndex > 0,
    canGoNext: currentProblemIndex < problems.length - 1
  });

  const generateSteps = useMemo(() => {
    if (problem.id === 125) {
      // Valid Palindrome logic
      const cleaned = currentInput.toLowerCase().replace(/[^a-z0-9]/g, '');
      let stepCount = 1; // Initial step
      let left = 0;
      let right = cleaned.length - 1;

      while (left < right) {
        stepCount++; // Comparison step
        if (cleaned[left] !== cleaned[right]) {
          stepCount++; // Return false step
          break;
        }
        left++;
        right--;
        if (left < right) {
          stepCount++; // Move pointers step
        }
      }

      if (left >= right) {
        stepCount++; // Success step
      }

      return stepCount;
    } else if (problem.id === 269) {
      // Alien Dictionary logic
      const graph: Record<string, string[]> = {};
      const inDegree: Record<string, number> = {};
      let stepCount = 1; // Initial step

      // Initialize
      for (const word of alienWords) {
        for (const char of word) {
          if (!(char in graph)) {
            graph[char] = [];
            inDegree[char] = 0;
          }
        }
      }

      // Build graph
      for (let i = 0; i < alienWords.length - 1; i++) {
        const word1 = alienWords[i];
        const word2 = alienWords[i + 1];
        
        if (word1.length > word2.length && word1.startsWith(word2)) {
          return stepCount + 1; // Invalid case
        }
        
        for (let j = 0; j < Math.min(word1.length, word2.length); j++) {
          if (word1[j] !== word2[j]) {
            if (!graph[word1[j]].includes(word2[j])) {
              stepCount++; // Add edge step
            }
            break;
          }
        }
      }

      stepCount++; // Queue initialization
      
      // Topological sort
      const queue: string[] = [];
      for (const char in inDegree) {
        if (inDegree[char] === 0) {
          queue.push(char);
        }
      }

      while (queue.length > 0) {
        stepCount++; // Process character
        const char = queue.shift()!;
        
        for (const neighbor of graph[char]) {
          inDegree[neighbor]--;
          if (inDegree[neighbor] === 0) {
            queue.push(neighbor);
          }
        }
        
        if (graph[char].length > 0) {
          stepCount++; // Update neighbors
        }
      }

      stepCount++; // Final result
      return stepCount;
    }
    
    return 1;
  }, [currentInput, alienWords, problem.id]);

  const generateStepsPalindrome = useMemo(() => {
    const cleaned = currentInput.toLowerCase().replace(/[^a-z0-9]/g, '');
    let stepCount = 1; // Initial step
    let left = 0;
    let right = cleaned.length - 1;

    while (left < right) {
      stepCount++; // Comparison step
      if (cleaned[left] !== cleaned[right]) {
        stepCount++; // Return false step
        break;
      }
      left++;
      right--;
      if (left < right) {
        stepCount++; // Move pointers step
      }
    }

    if (left >= right) {
      stepCount++; // Success step
    }

    return stepCount;
  }, [currentInput]);

  const highlightLine = useMemo(() => {
    if (problem.id === 269) {
      // Alien Dictionary highlighting logic
      if (currentStep === 0) return 4; // Initialize
      // Add more specific highlighting logic for alien dictionary
      return 4;
    }
    
    // Valid Palindrome highlighting logic
    if (currentStep === 0) return 2; // Variable initialization
    const cleaned = currentInput.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (cleaned.length <= 1) return 13; // Return true for empty/single char
    
    let left = 0;
    let right = cleaned.length - 1;
    let step = 1;

    while (left < right && step <= currentStep) {
      if (step === currentStep) {
        if (cleaned[left] !== cleaned[right]) {
          return 7; // Return false
        }
        return 6; // Comparison
      }
      
      if (cleaned[left] !== cleaned[right]) {
        return 7; // Return false
      }
      
      step++;
      left++;
      right--;
      
      if (step === currentStep) {
        return 9; // Move pointers
      }
      step++;
    }

    return 13; // Return true
  }, [currentStep, currentInput, problem.id]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handleStepBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
    setIsPlaying(false);
  };
  const handleStepForward = () => {
    setCurrentStep(Math.min(generateSteps - 1, currentStep + 1));
    setIsPlaying(false);
  };

  const renderInputSection = () => {
    if (problem.id === 125) {
      return (
        <InputSection 
          onInputChange={setCurrentInput} 
          initialInput={currentInput} 
        />
      );
    } else if (problem.id === 269) {
      return (
        <AlienDictionaryInput
          onInputChange={setAlienWords}
          initialInput={alienWords}
        />
      );
    }
    return null;
  };

  const renderAnimation = () => {
    if (problem.id === 125) {
      return (
        <PalindromeAnimation
          input={currentInput}
          isPlaying={isPlaying}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          speed={speed}
        />
      );
    } else if (problem.id === 269) {
      return (
        <AlienDictionaryAnimation
          input={alienWords}
          isPlaying={isPlaying}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          speed={speed}
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LeetCode Blind 75</h1>
              <p className="text-gray-600">Interactive Animation Study Tool</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProblemNavigation
          problems={problems}
          currentIndex={currentProblemIndex}
          onNavigate={handleProblemChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <ProblemHeader problem={problem} />
            {renderInputSection()}
            <AnimationControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              onStepBack={handleStepBack}
              onStepForward={handleStepForward}
              currentStep={currentStep}
              totalSteps={generateSteps}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {renderAnimation()}
            <CodeDisplay 
              code={problem.code} 
              highlightLine={highlightLine}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <Code size={16} />
            <span className="text-sm">Built for interactive learning • {problems.length} problems available</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
