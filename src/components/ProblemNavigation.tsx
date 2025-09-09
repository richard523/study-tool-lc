import React from 'react';
import { ChevronLeft, ChevronRight, Hash } from 'lucide-react';
import { Problem } from '../types';

interface ProblemNavigationProps {
  problems: Problem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export const ProblemNavigation: React.FC<ProblemNavigationProps> = ({
  problems,
  currentIndex,
  onNavigate
}) => {
  const currentProblem = problems[currentIndex];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < problems.length - 1;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => canGoPrevious && onNavigate(currentIndex - 1)}
          disabled={!canGoPrevious}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
            canGoPrevious
              ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft size={16} />
          <span className="text-sm font-medium">Previous</span>
        </button>

        <div className="flex items-center space-x-3">
          <Hash size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-600">
            {currentIndex + 1} of {problems.length}
          </span>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{currentProblem.title}</div>
            <div className="text-sm text-gray-500">Problem #{currentProblem.id}</div>
          </div>
        </div>

        <button
          onClick={() => canGoNext && onNavigate(currentIndex + 1)}
          disabled={!canGoNext}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
            canGoNext
              ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span className="text-sm font-medium">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-3 text-center text-xs text-gray-500">
        Use <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">←</kbd> and{' '}
        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">→</kbd> arrow keys to navigate
      </div>
    </div>
  );
};
