import { useState } from "react";
import { ThemeSelector, type Theme } from "@/components/ThemeSelector";
import { InputPanel } from "@/components/InputPanel";
import { StoryPanel } from "@/components/StoryPanel";
import { ChoiceButtons } from "@/components/ChoiceButtons";
import { CheckpointFlow } from "@/components/CheckpointFlow";
import { ParentDigest } from "@/components/ParentDigest";
import { AuthButton } from "@/components/AuthButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw } from "lucide-react";

// Mock data for demo purposes
const mockStoryResponse = {
  steps: [
    "Once upon a time, a brave little astronaut found a mysterious glowing crystal on Mars. The crystal hummed with magical energy.",
    "The astronaut picked up the crystal and suddenly it started to glow brighter! Strange symbols appeared in the air around them.",
    "The symbols formed a map showing a secret cave nearby. Inside the cave, the astronaut could see more crystals twinkling like stars!"
  ],
  choices: [
    ["Touch the crystal gently", "Leave the crystal alone"],
    ["Follow the map to the cave", "Study the symbols first"],
    ["Enter the cave carefully", "Call for backup from Earth"]
  ],
  checkpoint: {
    question: "How many crystals did the astronaut find first?",
    expected: "one",
    type: "count" as const
  },
  hint: "Look at the beginning of the story!",
  parent_digest: {
    skills: ["Counting", "Reading comprehension", "Decision making", "Science vocabulary"],
    note: "This story helps children practice counting skills while engaging with space-themed vocabulary. The decision points encourage critical thinking and consequence awareness.",
    home_activity: "Try counting objects around the house and creating simple stories about space adventures together!"
  }
};

const Index = () => {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [storyContent, setStoryContent] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parentDigest, setParentDigest] = useState(mockStoryResponse.parent_digest);
  const { toast } = useToast();

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    toast({
      title: `${theme === "space" ? "🚀" : "🌲"} ${theme.charAt(0).toUpperCase() + theme.slice(1)} Adventure Selected!`,
      description: "Now ask me a question to start your story!",
    });
  };

  const handleQuestionSubmit = async (question: string) => {
    if (!selectedTheme) return;
    
    setIsLoading(true);
    setCurrentStep(0);
    
    // Simulate API call delay
    setTimeout(() => {
      setStoryContent(mockStoryResponse.steps[0]);
      setChoices(mockStoryResponse.choices[0]);
      setIsLoading(false);
      
      toast({
        title: "Story started! 📖",
        description: "Listen to your adventure and make your choice!",
      });
    }, 1500);
  };

  const handleChoiceSelect = (choice: string, choiceIndex: number) => {
    const nextStep = currentStep + 1;
    
    if (nextStep < mockStoryResponse.steps.length) {
      setCurrentStep(nextStep);
      setStoryContent(mockStoryResponse.steps[nextStep]);
      setChoices(mockStoryResponse.choices[nextStep]);
      
      toast({
        title: "Great choice! ✨",
        description: "Your story continues...",
      });
    } else {
      // Story complete, show checkpoint
      setShowCheckpoint(true);
      setChoices([]);
      
      toast({
        title: "Story complete! 🎉",
        description: "Time for a quick check!",
      });
    }
  };

  const handleCheckpointComplete = (success: boolean) => {
    setShowCheckpoint(false);
    
    if (success) {
      toast({
        title: "Excellent work! 🌟",
        description: "You've completed this adventure!",
      });
    } else {
      toast({
        title: "Good try! 💪",
        description: "Every attempt helps you learn!",
      });
    }
  };

  const handleRestart = () => {
    setSelectedTheme(null);
    setCurrentStep(0);
    setStoryContent("");
    setChoices([]);
    setShowCheckpoint(false);
    
    toast({
      title: "Starting fresh! 🔄",
      description: "Choose your theme to begin a new adventure!",
    });
  };

  const handleAuth = () => {
    if (isSignedIn) {
      setIsSignedIn(false);
      toast({
        title: "Signed out",
        description: "Parent features are now hidden.",
      });
    } else {
      // In a real app, this would integrate with Supabase
      toast({
        title: "Connect to Supabase First! 🔗",
        description: "Click the green Supabase button to enable authentication.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✨</div>
            <h1 className="text-2xl font-bold text-foreground">
              Ainia Quest Cards
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {selectedTheme && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Adventure
              </Button>
            )}
            <AuthButton
              isSignedIn={isSignedIn}
              onSignIn={handleAuth}
              onSignOut={handleAuth}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Theme Selection */}
          {!selectedTheme ? (
            <ThemeSelector
              selectedTheme={selectedTheme}
              onThemeSelect={handleThemeSelect}
            />
          ) : (
            <div className="space-y-6">
              {/* Input Panel */}
              <InputPanel
                theme={selectedTheme}
                onQuestionSubmit={handleQuestionSubmit}
                isLoading={isLoading}
              />

              {/* Story Panel */}
              {storyContent && (
                <StoryPanel
                  theme={selectedTheme}
                  currentStep={storyContent}
                  stepNumber={currentStep + 1}
                  totalSteps={3}
                />
              )}

              {/* Choice Buttons */}
              {choices.length > 0 && !showCheckpoint && (
                <ChoiceButtons
                  theme={selectedTheme}
                  choices={choices}
                  onChoiceSelect={handleChoiceSelect}
                  disabled={isLoading}
                />
              )}

              {/* Checkpoint Flow */}
              {showCheckpoint && (
                <CheckpointFlow
                  theme={selectedTheme}
                  checkpoint={mockStoryResponse.checkpoint}
                  onComplete={handleCheckpointComplete}
                />
              )}

              {/* Parent Digest */}
              <ParentDigest
                data={parentDigest}
                isVisible={isSignedIn && (storyContent !== "" || showCheckpoint)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>🌟 Ainia Quest Cards - Learning through storytelling</p>
          <p className="mt-2">
            Connect to Supabase for full features: authentication, story caching, and AI integration
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;