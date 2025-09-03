import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Lightbulb } from "lucide-react";
import type { Theme } from "./ThemeSelector";

interface Checkpoint {
  question: string;
  expected: string;
  type: "compare" | "count";
}

interface CheckpointFlowProps {
  theme: Theme;
  checkpoint: Checkpoint;
  onComplete: (success: boolean) => void;
}

export function CheckpointFlow({ theme, checkpoint, onComplete }: CheckpointFlowProps) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitted(true);
    
    // Enhanced answer validation with fuzzy matching and multiple correct answers
    const userAnswer = answer.toLowerCase().trim();
    const expectedAnswer = checkpoint.expected.toLowerCase().trim();
    
    // Check for exact match first
    let correct = userAnswer === expectedAnswer;
    
    // Check for partial matches (contains expected answer)
    if (!correct) {
      correct = userAnswer.includes(expectedAnswer) || expectedAnswer.includes(userAnswer);
    }
    
    // Handle numbers for count questions
    if (!correct && checkpoint.type === 'count') {
      const userNumber = parseInt(userAnswer);
      const expectedNumber = parseInt(expectedAnswer);
      correct = !isNaN(userNumber) && !isNaN(expectedNumber) && userNumber === expectedNumber;
    }
    
    // Handle common synonyms and variations for compare questions
    if (!correct && checkpoint.type === 'compare') {
      const synonyms: Record<string, string[]> = {
        'big': ['large', 'huge', 'giant', 'enormous', 'massive'],
        'small': ['tiny', 'little', 'mini', 'miniature'],
        'fast': ['quick', 'speedy', 'rapid', 'swift'],
        'slow': ['sluggish', 'gradual', 'leisurely'],
        'hot': ['warm', 'heated', 'burning'],
        'cold': ['cool', 'freezing', 'chilly', 'icy'],
        'bright': ['shiny', 'brilliant', 'glowing', 'luminous'],
        'dark': ['dim', 'shadowy', 'gloomy']
      };
      
      for (const [key, values] of Object.entries(synonyms)) {
        if (expectedAnswer.includes(key) && values.some(synonym => userAnswer.includes(synonym))) {
          correct = true;
          break;
        }
        if (values.includes(expectedAnswer) && userAnswer.includes(key)) {
          correct = true;
          break;
        }
      }
    }
    
    // Remove common articles and prepositions for better matching
    if (!correct) {
      const cleanUserAnswer = userAnswer.replace(/\b(the|a|an|is|are|was|were|in|on|at|by|for|with|to)\b/g, '').trim();
      const cleanExpectedAnswer = expectedAnswer.replace(/\b(the|a|an|is|are|was|were|in|on|at|by|for|with|to)\b/g, '').trim();
      correct = cleanUserAnswer === cleanExpectedAnswer || 
                cleanUserAnswer.includes(cleanExpectedAnswer) || 
                cleanExpectedAnswer.includes(cleanUserAnswer);
    }
    
    setIsCorrect(correct);
    
    if (correct) {
      setTimeout(() => onComplete(true), 2000);
    } else {
      setShowHint(true);
    }
  };

  const handleRetry = () => {
    setAnswer("");
    setSubmitted(false);
    setIsCorrect(null);
    setShowHint(false);
  };

  const themeStyles = {
    space: "bg-space-bg border-space-accent/30",
    forest: "bg-forest-bg border-forest-accent/30"
  };

  const buttonVariant = theme === "space" ? "space" : "forest";

  return (
    <Card className={`p-6 ${themeStyles[theme]} border-2`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          🧠 Quick Check!
        </h3>
        <p className="text-lg text-foreground">
          {checkpoint.question}
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="text-lg h-12 text-center border-2"
            aria-label="Your answer"
            autoFocus
          />
          <Button
            type="submit"
            variant={buttonVariant}
            size="lg"
            disabled={!answer.trim()}
            className="w-full"
          >
            Submit Answer
          </Button>
        </form>
      ) : isCorrect ? (
        <div className="text-center space-y-4 animate-in fade-in duration-500">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-success animate-bounce-gentle" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-success mb-2">
              Great job! 🎉
            </h4>
            <p className="text-lg text-foreground">
              You got it right! Keep exploring!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex justify-center">
            <XCircle className="w-12 h-12 text-warning" />
          </div>
          <div className="text-center">
            <h4 className="text-xl font-semibold text-foreground mb-2">
              Not quite! Let's try again 😊
            </h4>
          </div>
          
          {showHint && (
            <Card className="p-4 bg-warning/10 border-warning/30">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-semibold text-foreground mb-1">
                    Hint:
                  </h5>
                  <p className="text-foreground">
                    The answer is "{checkpoint.expected}". Try typing that!
                  </p>
                </div>
              </div>
            </Card>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleRetry}
              className="flex-1"
            >
              Try Again
            </Button>
            <Button
              variant={buttonVariant}
              size="lg"
              onClick={() => onComplete(false)}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}