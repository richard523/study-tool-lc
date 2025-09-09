import React, { useState, useEffect, useCallback } from 'react';
import { TopologicalStep } from '../types';

interface AlienDictionaryAnimationProps {
  input: string[];
  isPlaying: boolean;
  currentStep: number;
  onStepChange: (step: number) => void;
  speed: number;
}

export const AlienDictionaryAnimation: React.FC<AlienDictionaryAnimationProps> = ({
  input,
  isPlaying,
  currentStep,
  onStepChange,
  speed
}) => {
  const [animationSteps, setAnimationSteps] = useState<TopologicalStep[]>([]);

  const generateSteps = useCallback((words: string[]): TopologicalStep[] => {
    const steps: TopologicalStep[] = [];
    const graph: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};

    // Initialize graph and in-degree
    for (const word of words) {
      for (const char of word) {
        if (!(char in graph)) {
          graph[char] = [];
          inDegree[char] = 0;
        }
      }
    }

    steps.push({
      graph: { ...graph },
      inDegree: { ...inDegree },
      queue: [],
      result: [],
      currentChar: null,
      message: `Initialized graph with characters: ${Object.keys(graph).join(', ')}`,
      highlightLine: 4,
      processing: false
    });

    // Build graph by comparing adjacent words
    for (let i = 0; i < words.length - 1; i++) {
      const word1 = words[i];
      const word2 = words[i + 1];

      // Check for invalid case
      if (word1.length > word2.length && word1.startsWith(word2)) {
        steps.push({
          graph: { ...graph },
          inDegree: { ...inDegree },
          queue: [],
          result: [],
          currentChar: null,
          message: `Invalid: "${word1}" is longer than "${word2}" but starts with it`,
          highlightLine: 17,
          processing: false
        });
        return steps;
      }

      // Find first different character
      for (let j = 0; j < Math.min(word1.length, word2.length); j++) {
        if (word1[j] !== word2[j]) {
          if (!graph[word1[j]].includes(word2[j])) {
            graph[word1[j]].push(word2[j]);
            inDegree[word2[j]]++;
            
            steps.push({
              graph: { ...graph },
              inDegree: { ...inDegree },
              queue: [],
              result: [],
              currentChar: null,
              message: `Found order: '${word1[j]}' < '${word2[j]}' from "${word1}" vs "${word2}"`,
              highlightLine: 25,
              processing: false
            });
          }
          break;
        }
      }
    }

    // Topological sort using Kahn's algorithm
    const queue: string[] = [];
    for (const char in inDegree) {
      if (inDegree[char] === 0) {
        queue.push(char);
      }
    }

    steps.push({
      graph: { ...graph },
      inDegree: { ...inDegree },
      queue: [...queue],
      result: [],
      currentChar: null,
      message: `Starting topological sort. Queue initialized with: ${queue.join(', ')}`,
      highlightLine: 35,
      processing: false
    });

    const result: string[] = [];
    while (queue.length > 0) {
      const char = queue.shift()!;
      result.push(char);

      steps.push({
        graph: { ...graph },
        inDegree: { ...inDegree },
        queue: [...queue],
        result: [...result],
        currentChar: char,
        message: `Processing '${char}'. Added to result.`,
        highlightLine: 42,
        processing: true
      });

      for (const neighbor of graph[char]) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }

      if (graph[char].length > 0) {
        steps.push({
          graph: { ...graph },
          inDegree: { ...inDegree },
          queue: [...queue],
          result: [...result],
          currentChar: char,
          message: `Updated neighbors of '${char}': ${graph[char].join(', ')}`,
          highlightLine: 45,
          processing: false
        });
      }
    }

    const finalResult = result.length === Object.keys(inDegree).length ? result.join('') : '';
    steps.push({
      graph: { ...graph },
      inDegree: { ...inDegree },
      queue: [],
      result: [...result],
      currentChar: null,
      message: finalResult ? `Complete! Alien order: "${finalResult}"` : 'No valid ordering exists (cycle detected)',
      highlightLine: 52,
      processing: false
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
      }, 2500 / speed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, animationSteps.length, onStepChange, speed]);

  const currentStepData = animationSteps[currentStep];

  if (!currentStepData || input.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="text-center text-gray-500">
          Enter words to see the animation
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Alien Dictionary Visualization</h3>
        <div className="text-sm text-gray-600">
          Words: {input.map((word, i) => (
            <code key={i} className="bg-gray-100 px-2 py-1 rounded mr-2">"{word}"</code>
          ))}
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">Character Dependencies</h4>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.keys(currentStepData.graph).map(char => (
              <div
                key={char}
                className={`p-3 rounded-lg border-2 transition-all duration-500 ${
                  currentStepData.currentChar === char && currentStepData.processing
                    ? 'border-purple-500 bg-purple-100 text-purple-700 scale-105 shadow-lg'
                    : currentStepData.result.includes(char)
                    ? 'border-green-500 bg-green-100 text-green-700'
                    : currentStepData.queue.includes(char)
                    ? 'border-blue-500 bg-blue-100 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-mono font-bold">{char}</div>
                  <div className="text-xs mt-1">
                    In-degree: {currentStepData.inDegree[char]}
                  </div>
                  {currentStepData.graph[char].length > 0 && (
                    <div className="text-xs mt-1 text-gray-600">
                      → {currentStepData.graph[char].join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Queue and Result */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="text-md font-semibold text-blue-800 mb-2">Queue (In-degree = 0)</h4>
          <div className="flex flex-wrap gap-2">
            {currentStepData.queue.length > 0 ? (
              currentStepData.queue.map((char, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-mono font-bold"
                >
                  {char}
                </div>
              ))
            ) : (
              <div className="text-blue-600 text-sm">Empty</div>
            )}
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="text-md font-semibold text-green-800 mb-2">Result</h4>
          <div className="flex flex-wrap gap-2">
            {currentStepData.result.length > 0 ? (
              currentStepData.result.map((char, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-mono font-bold"
                >
                  {char}
                </div>
              ))
            ) : (
              <div className="text-green-600 text-sm">Empty</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-2">Current Step:</div>
        <div className="text-gray-600">{currentStepData.message}</div>
      </div>
    </div>
  );
};
