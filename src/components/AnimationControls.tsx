import React from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

interface AnimationControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStepBack,
  onStepForward,
  currentStep,
  totalSteps,
  speed,
  onSpeedChange
}) => {
  const buttonClass = "p-3 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Animation Controls</h3>
        <div className="text-sm text-gray-600">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onStepBack}
          disabled={currentStep === 0}
          className={buttonClass}
          title="Previous Step"
        >
          <SkipBack size={20} />
        </button>
        
        <button
          onClick={isPlaying ? onPause : onPlay}
          className={`${buttonClass} ${isPlaying ? 'bg-red-50 border-red-300 text-red-600' : 'bg-green-50 border-green-300 text-green-600'}`}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button
          onClick={onStepForward}
          disabled={currentStep === totalSteps - 1}
          className={buttonClass}
          title="Next Step"
        >
          <SkipForward size={20} />
        </button>
        
        <button
          onClick={onReset}
          className={`${buttonClass} text-gray-600`}
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Animation Speed</label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.5x</span>
          <span>{speed}x</span>
          <span>3x</span>
        </div>
      </div>
    </div>
  );
};
