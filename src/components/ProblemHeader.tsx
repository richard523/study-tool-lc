import React from 'react';
import { Problem } from '../types';

interface ProblemHeaderProps {
  problem: Problem;
}

export const ProblemHeader: React.FC<ProblemHeaderProps> = ({ problem }) => {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Hard: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {problem.id}. {problem.title}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${difficultyColors[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
      </div>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        {problem.description}
      </p>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Examples:</h3>
        {problem.examples.map((example, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">Input:</span>{' '}
                <code className="bg-gray-200 px-2 py-1 rounded text-sm">{example.input}</code>
              </div>
              <div>
                <span className="font-medium text-gray-700">Output:</span>{' '}
                <code className="bg-gray-200 px-2 py-1 rounded text-sm">{example.output}</code>
              </div>
              {example.explanation && (
                <div>
                  <span className="font-medium text-gray-700">Explanation:</span>{' '}
                  <span className="text-gray-600">{example.explanation}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Constraints:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          {problem.constraints.map((constraint, index) => (
            <li key={index}>{constraint}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
