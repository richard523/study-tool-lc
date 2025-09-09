import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const useKeyboardNavigation = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (canGoPrevious) {
            onPrevious();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (canGoNext) {
            onNext();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPrevious, onNext, canGoPrevious, canGoNext]);
};
