import React, { useState } from 'react';

interface AlienDictionaryInputProps {
  onInputChange: (input: string[]) => void;
  initialInput: string[];
}

export const AlienDictionaryInput: React.FC<AlienDictionaryInputProps> = ({ 
  onInputChange, 
  initialInput 
}) => {
  const [inputText, setInputText] = useState(initialInput.join(', '));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputText(newValue);
    const words = newValue.split(',').map(word => word.trim()).filter(word => word.length > 0);
    onInputChange(words);
  };

  const presetInputs = [
    ['wrt', 'wrf', 'er', 'ett', 'rftt'],
    ['z', 'x'],
    ['z', 'x', 'z'],
    ['abc', 'ab'],
    ['ac', 'ab', 'zc', 'zb']
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Input</h3>
      
      <div className="mb-4">
        <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
          Enter words separated by commas:
        </label>
        <input
          type="text"
          id="input"
          value={inputText}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="wrt, wrf, er, ett, rftt"
        />
      </div>

      <div>
        <div className="text-sm font-medium text-gray-700 mb-2">Quick Test Cases:</div>
        <div className="flex flex-wrap gap-2">
          {presetInputs.map((preset, index) => (
            <button
              key={index}
              onClick={() => {
                const newText = preset.join(', ');
                setInputText(newText);
                onInputChange(preset);
              }}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-all duration-200 hover:shadow-sm"
            >
              [{preset.map(w => `"${w}"`).join(', ')}]
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
