import React, { useState } from 'react';

interface InputSectionProps {
  onInputChange: (input: string) => void;
  initialInput: string;
}

export const InputSection: React.FC<InputSectionProps> = ({ onInputChange, initialInput }) => {
  const [input, setInput] = useState(initialInput);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    onInputChange(newValue);
  };

  const presetInputs = [
    'A man, a plan, a canal: Panama',
    'race a car',
    'Was it a car or a cat I saw?',
    'Madam',
    'No \'x\' in Nixon'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Input</h3>
      
      <div className="mb-4">
        <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
          Enter a string to test:
        </label>
        <input
          type="text"
          id="input"
          value={input}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter your test string..."
        />
      </div>

      <div>
        <div className="text-sm font-medium text-gray-700 mb-2">Quick Test Cases:</div>
        <div className="flex flex-wrap gap-2">
          {presetInputs.map((preset, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(preset);
                onInputChange(preset);
              }}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-all duration-200 hover:shadow-sm"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
