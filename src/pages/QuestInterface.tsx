import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InputPanel } from "@/components/InputPanel";
import { StoryPanel } from "@/components/StoryPanel";
import { ChoiceButtons } from "@/components/ChoiceButtons";
import { CheckpointFlow } from "@/components/CheckpointFlow";
import { ParentDigest } from "@/components/ParentDigest";
import { AuthButton } from "@/components/AuthButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { generateStory } from "@/api/quest";
import type { Theme } from "@/components/ThemeSelector";
import type { StoryResponse } from "@/lib/types";

const QuestInterface = () => {
  const { theme } = useParams<{ theme: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [storyContent, setStoryContent] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parentDigest, setParentDigest] = useState<StoryResponse['parent_digest'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [fullStory, setFullStory] = useState<StoryResponse | null>(null);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  // Validate and convert theme parameter
  const getValidTheme = (urlTheme: string | undefined): Theme | null => {
    if (urlTheme === "space") return "space";
    if (urlTheme === "forest") return "forest";
    return null;
  };

  const validTheme = getValidTheme(theme);
  
  if (!validTheme) {
    navigate("/quest", { replace: true });
    return null;
  }

  // Convert to API format (capitalized)
  const apiTheme = validTheme === "space" ? "Space" : "Forest";

  const handleQuestionSubmit = async (question: string) => {
    if (!user || !validTheme) return;
    
    setIsLoading(true);
    setError(null);
    setCurrentStep(0);
    
    try {
      const result = await generateStory(user.id, apiTheme, question, 7);
      
      setFullStory(result);
      setStoryContent(result.steps[0]);
      setChoices(result.choices[0]);
      setParentDigest(result.parent_digest);
      setIsCached(result.cached);
      
      toast({
        title: result.cached ? "Story loaded! 📖" : "Story created! ✨",
        description: result.cached 
          ? "This story was saved from before!" 
          : "A new adventure awaits! Make your choice!",
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate story';
      setError(errorMessage);
      toast({
        title: "Oops! 😅",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoiceSelect = (choice: string, choiceIndex: number) => {
    if (!fullStory) return;
    
    const nextStep = currentStep + 1;
    
    if (nextStep < fullStory.steps.length) {
      setCurrentStep(nextStep);
      setStoryContent(fullStory.steps[nextStep]);
      setChoices(fullStory.choices[nextStep]);
      
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
    setCurrentStep(0);
    setStoryContent("");
    setChoices([]);
    setShowCheckpoint(false);
    setFullStory(null);
    setParentDigest(null);
    setError(null);
    setIsCached(false);
    
    toast({
      title: "Starting fresh! 🔄",
      description: "Ask a new question to begin another adventure!",
    });
  };

  const handleAuth = async () => {
    if (user) {
      await signOut();
      toast({
        title: "Signed out",
        description: "Redirecting to homepage...",
      });
    } else {
      toast({
        title: "Authentication Error",
        description: "You should not see this button when not signed in.",
      });
    }
  };

  const handleBackToThemes = () => {
    navigate("/quest");
  };

  const themeEmoji = validTheme === "space" ? "🚀" : "🌲";
  const themeTitle = validTheme === "space" ? "Space" : "Forest";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToThemes}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Themes
            </Button>
            <div className="text-3xl">{themeEmoji}</div>
            <h1 className="text-2xl font-bold text-foreground">
              {themeTitle} Adventure
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {storyContent && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Story
              </Button>
            )}
            <AuthButton
              isSignedIn={!!user}
              onSignIn={handleAuth}
              onSignOut={handleAuth}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-4xl py-8">
        <div className="space-y-8">
          {/* Input Panel */}
          <InputPanel
            theme={validTheme}
            onQuestionSubmit={handleQuestionSubmit}
            isLoading={isLoading}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg font-semibold">Creating your adventure...</p>
                <p className="text-sm text-muted-foreground">This might take a moment</p>
              </div>
            </div>
          )}

          {/* Story Panel */}
          {storyContent && fullStory && (
            <StoryPanel
              theme={validTheme}
              currentStep={storyContent}
              stepNumber={currentStep + 1}
              totalSteps={fullStory.steps.length}
            />
          )}

          {/* Choice Buttons */}
          {choices.length > 0 && !showCheckpoint && (
            <ChoiceButtons
              theme={validTheme}
              choices={choices}
              onChoiceSelect={handleChoiceSelect}
              disabled={isLoading}
            />
          )}

          {/* Checkpoint Flow */}
          {showCheckpoint && fullStory && (
            <CheckpointFlow
              theme={validTheme}
              checkpoint={fullStory.checkpoint}
              onComplete={handleCheckpointComplete}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
              <p className="font-semibold">Oops! Something went wrong:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Parent Digest */}
          {parentDigest && (
            <ParentDigest
              data={parentDigest}
              isVisible={!!user && (storyContent !== "" || showCheckpoint)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default QuestInterface;