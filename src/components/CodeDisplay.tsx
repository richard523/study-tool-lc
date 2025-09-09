import React from 'react';

interface CodeDisplayProps {
  code: string;
  highlightLine: number;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, highlightLine }) => {
  const lines = code.split('\n');

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Solution Code</h3>
      </div>
      
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`leading-6 transition-all duration-300 ${
                index === highlightLine
                  ? 'bg-yellow-500 bg-opacity-20 border-l-4 border-yellow-500 pl-2 -ml-2'
                  : 'text-gray-300'
              }`}
            >
              <span className="text-gray-500 select-none inline-block w-8 text-right mr-4">
                {index + 1}
              </span>
              <code className={index === highlightLine ? 'text-yellow-200' : 'text-gray-300'}>
                {line}
              </code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
