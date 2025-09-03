import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause, Square, Volume2 } from "lucide-react";
import type { Theme } from "./ThemeSelector";

interface StoryPanelProps {
  theme: Theme;
  currentStep: string;
  stepNumber: number;
  totalSteps: number;
  onStepChange?: (stepNumber: number) => void;
  canNavigate?: boolean;
}

export function StoryPanel({ 
  theme, 
  currentStep, 
  stepNumber, 
  totalSteps, 
  onStepChange,
  canNavigate = false
}: StoryPanelProps) {
  const [speechState, setSpeechState] = useState<'idle' | 'playing' | 'paused' | 'stopped'>('idle');
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const themeStyles = {
    space: "bg-space-bg border-space-secondary/30",
    forest: "bg-forest-bg border-forest-secondary/30"
  };

  const themeEmoji = {
    space: "🚀",
    forest: "🌲"
  };

  // Handle speech synthesis events
  const handleSpeechEnd = () => {
    setSpeechState('idle');
    setCurrentUtterance(null);
  };

  const handleSpeechError = () => {
    setSpeechState('idle');
    setCurrentUtterance(null);
  };

  // Clean text for better speech narration
  const cleanTextForSpeech = (text: string): string => {
    // Remove "Step N:" prefix and any leading/trailing whitespace
    return text.replace(/^Step\s+\d+:\s*/i, '').trim();
  };

  // Read the story aloud using Web Speech API
  useEffect(() => {
    if (currentStep && 'speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const cleanedText = cleanTextForSpeech(currentStep);
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      
      // Add event listeners
      utterance.onend = handleSpeechEnd;
      utterance.onerror = handleSpeechError;
      
      setCurrentUtterance(utterance);
      setSpeechState('playing');
      speechSynthesis.speak(utterance);
    }
    
    // Cleanup on unmount or step change
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        setSpeechState('idle');
        setCurrentUtterance(null);
      }
    };
  }, [currentStep]);

  // Periodic check for speech synthesis state reliability
  useEffect(() => {
    const checkSpeechState = () => {
      if ('speechSynthesis' in window && speechState !== 'idle') {
        const isActuallySpeaking = speechSynthesis.speaking;
        const isActuallyPaused = speechSynthesis.paused;
        
        // Sync state if mismatch detected
        if (speechState === 'playing' && !isActuallySpeaking && !isActuallyPaused) {
          setSpeechState('idle');
          setCurrentUtterance(null);
        } else if (speechState === 'paused' && !isActuallyPaused) {
          setSpeechState(isActuallySpeaking ? 'playing' : 'idle');
        }
      }
    };

    const interval = setInterval(checkSpeechState, 500);
    return () => clearInterval(interval);
  }, [speechState]);

  // Voice control functions
  const handlePlay = () => {
    if (!currentStep || !('speechSynthesis' in window)) return;
    
    try {
      if (speechState === 'paused' && speechSynthesis.paused) {
        speechSynthesis.resume();
        setSpeechState('playing');
      } else {
        // Create new utterance
        speechSynthesis.cancel();
        
        // Small delay to ensure cancel completes
        setTimeout(() => {
          const cleanedText = cleanTextForSpeech(currentStep);
          const utterance = new SpeechSynthesisUtterance(cleanedText);
          utterance.rate = 0.8;
          utterance.pitch = 1.1;
          utterance.onend = handleSpeechEnd;
          utterance.onerror = handleSpeechError;
          
          setCurrentUtterance(utterance);
          setSpeechState('playing');
          speechSynthesis.speak(utterance);
        }, 50);
      }
    } catch (error) {
      console.warn('Speech play failed:', error);
      setSpeechState('idle');
      setCurrentUtterance(null);
    }
  };

  const handlePause = () => {
    if ('speechSynthesis' in window) {
      try {
        if (speechState === 'playing') {
          speechSynthesis.pause();
          setSpeechState('paused');
        }
      } catch (error) {
        console.warn('Speech pause failed:', error);
        // Fallback: force stop if pause fails
        handleStop();
      }
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      try {
        speechSynthesis.cancel();
        setSpeechState('stopped');
        setCurrentUtterance(null);
      } catch (error) {
        console.warn('Speech stop failed:', error);
        // Force reset state even if API fails
        setSpeechState('stopped');
        setCurrentUtterance(null);
      }
    }
  };

  return (
    <Card className={`p-6 ${themeStyles[theme]} border-2`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          {themeEmoji[theme]} Story Time
        </h3>
        <div className="flex items-center gap-3">
          {/* Voice Controls */}
          <div className="flex items-center gap-1 bg-background/80 rounded-lg p-1 border">
            {speechState !== 'playing' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlay}
                disabled={!currentStep || !('speechSynthesis' in window)}
                className="h-8 w-8 p-0"
                title="Play audio"
                aria-label="Play story audio"
              >
                <Play className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePause}
                className="h-8 w-8 p-0"
                title="Pause audio"
                aria-label="Pause story audio"
              >
                <Pause className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStop}
              disabled={speechState === 'idle'}
              className="h-8 w-8 p-0"
              title="Stop audio"
              aria-label="Stop story audio"
            >
              <Square className="h-4 w-4" />
            </Button>
            {/* Speech indicator with better visual feedback */}
            <div className="flex items-center gap-1 px-2 min-w-[80px]">
              <Volume2 className={`h-3 w-3 transition-colors ${
                speechState === 'playing' ? 'text-green-500 animate-pulse' : 
                speechState === 'paused' ? 'text-yellow-500' :
                speechState === 'stopped' ? 'text-red-500' : 
                'text-muted-foreground'
              }`} />
              <span className={`text-xs font-medium transition-colors ${
                speechState === 'playing' ? 'text-green-600' :
                speechState === 'paused' ? 'text-yellow-600' :
                speechState === 'stopped' ? 'text-red-600' :
                'text-muted-foreground'
              }`}>
                {speechState === 'playing' ? 'Speaking' : 
                 speechState === 'paused' ? 'Paused' : 
                 speechState === 'stopped' ? 'Stopped' : 'Ready'}
              </span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {stepNumber} of {totalSteps}
          </div>
        </div>
      </div>
      
      <div 
        className="text-lg leading-relaxed text-foreground min-h-[100px] flex items-center"
        aria-live="polite"
        role="region"
        aria-label="Story content"
      >
        {currentStep ? (
          <p className="animate-in fade-in duration-500">
            {currentStep}
          </p>
        ) : (
          <p className="text-muted-foreground italic">
            Ask a question to start your adventure!
          </p>
        )}
      </div>

      {/* Navigation Controls */}
      {canNavigate && onStepChange && (
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStepChange(stepNumber - 2)} // stepNumber is 1-based, convert to 0-based
            disabled={stepNumber <= 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Step {stepNumber} of {totalSteps}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStepChange(stepNumber)} // stepNumber is 1-based, convert to 0-based
            disabled={stepNumber >= totalSteps}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Progress indicator with clickable steps */}
      <div className="mt-4">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <button
              key={i}
              onClick={() => canNavigate && onStepChange && onStepChange(i)}
              disabled={!canNavigate || !onStepChange || i >= stepNumber}
              className={`h-3 flex-1 rounded-full transition-all duration-300 ${
                i < stepNumber 
                  ? theme === "space" 
                    ? "bg-space-primary cursor-pointer hover:opacity-80" 
                    : "bg-forest-primary cursor-pointer hover:opacity-80"
                  : "bg-muted"
              } ${
                canNavigate && i < stepNumber ? 'hover:scale-105' : ''
              }`}
              title={`Go to step ${i + 1}`}
            />
          ))}
        </div>
        {canNavigate && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Click on completed steps to review them
          </p>
        )}
      </div>
    </Card>
  );
}