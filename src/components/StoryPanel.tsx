import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import type { Theme } from "./ThemeSelector";

interface StoryPanelProps {
  theme: Theme;
  currentStep: string;
  stepNumber: number;
  totalSteps: number;
}

export function StoryPanel({ theme, currentStep, stepNumber, totalSteps }: StoryPanelProps) {
  const themeStyles = {
    space: "bg-space-bg border-space-secondary/30",
    forest: "bg-forest-bg border-forest-secondary/30"
  };

  const themeEmoji = {
    space: "🚀",
    forest: "🌲"
  };

  // Read the story aloud using Web Speech API
  useEffect(() => {
    if (currentStep && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentStep);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  }, [currentStep]);

  return (
    <Card className={`p-6 ${themeStyles[theme]} border-2`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          {themeEmoji[theme]} Story Time
        </h3>
        <div className="text-sm text-muted-foreground">
          Step {stepNumber} of {totalSteps}
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

      {/* Progress indicator */}
      <div className="mt-4">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                i < stepNumber 
                  ? theme === "space" ? "bg-space-primary" : "bg-forest-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}