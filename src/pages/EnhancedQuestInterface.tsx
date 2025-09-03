import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InputPanel } from "@/components/InputPanel";
import { StoryPanel } from "@/components/StoryPanel";
import { CheckpointFlow } from "@/components/CheckpointFlow";
import { ParentDigest } from "@/components/ParentDigest";
import { ConversationHistory } from "@/components/ConversationHistory";
import { SessionControls } from "@/components/SessionControls";
import { AuthButton } from "@/components/AuthButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { ArrowLeft, Sparkles } from "lucide-react";
import { generateStory } from "@/api/quest";
import type { Theme } from "@/components/ThemeSelector";
import type { ConversationSession, StorySession } from "@/lib/types";

type SessionPhase = 'questioning' | 'storytelling' | 'checkpoint' | 'digest' | 'continue';

const EnhancedQuestInterface = () => {
  const { theme } = useParams<{ theme: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  // Session state
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>('questioning');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Current story navigation
  const [currentStep, setCurrentStep] = useState(0);
  const [showContinueInput, setShowContinueInput] = useState(false);

  // Validate and convert theme parameter
  const getValidTheme = (urlTheme: string | undefined): Theme | null => {
    if (urlTheme === "space") return "space";
    if (urlTheme === "forest") return "forest";
    return null;
  };

  const validTheme = getValidTheme(theme);
  
  // Initialize session
  useEffect(() => {
    if (user && !session && validTheme) {
      // Convert to API format (capitalized)
      const apiTheme = validTheme === "space" ? "Space" : "Forest";
      
      const newSession: ConversationSession = {
        id: `session-${Date.now()}`,
        userId: user.id,
        theme: apiTheme as 'Space' | 'Forest',
        stories: [],
        currentStoryIndex: 0,
        currentStep: 0,
        startTime: Date.now(),
        lastActivity: Date.now()
      };
      setSession(newSession);
    }
  }, [user, session, validTheme]);

  // Guard clause after hooks
  if (!validTheme) {
    navigate("/quest", { replace: true });
    return null;
  }

  // Convert to API format (capitalized)
  const apiTheme = validTheme === "space" ? "Space" : "Forest";

  const getCurrentStory = (): StorySession | null => {
    if (!session || session.stories.length === 0) return null;
    return session.stories[session.currentStoryIndex] || null;
  };

  const handleQuestionSubmit = async (question: string) => {
    if (!user || !validTheme || !session) return;
    
    setIsLoading(true);
    setError(null);
    setCurrentStep(0);
    setCurrentPhase('storytelling');
    
    try {
      const result = await generateStory(user.id, apiTheme, question, 7);
      
      // Create new story session
      const newStorySession: StorySession = {
        id: `story-${Date.now()}`,
        question,
        story: result,
        cached: result.cached,
        checkpointPassed: false
      };

      // Add to session
      const updatedSession = {
        ...session,
        stories: [...session.stories, newStorySession],
        currentStoryIndex: session.stories.length,
        currentStep: 0,
        lastActivity: Date.now()
      };

      setSession(updatedSession);
      setHasUnsavedChanges(true);
      setShowContinueInput(false);
      
      toast({
        title: result.cached ? "Story loaded! 📖" : "Story created! ✨",
        description: result.cached 
          ? "This story was saved from before!" 
          : "A new adventure awaits! Make your choice!",
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate story';
      setError(errorMessage);
      setCurrentPhase('questioning');
      toast({
        title: "Oops! 😅",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    const currentStory = getCurrentStory();
    if (!currentStory || !session) return;
    
    const nextStep = currentStep + 1;
    
    if (nextStep < currentStory.story.steps.length) {
      setCurrentStep(nextStep);
      
      // Update session
      const updatedSession = {
        ...session,
        currentStep: nextStep,
        lastActivity: Date.now()
      };
      setSession(updatedSession);
      
      toast({
        title: "Next step! ✨",
        description: "Your learning continues...",
      });
    } else {
      // Story complete, show checkpoint
      setCurrentPhase('checkpoint');
      
      toast({
        title: "Story complete! 🎉",
        description: "Time for a quick check!",
      });
    }
  };

  const handleCheckpointComplete = (success: boolean) => {
    const currentStory = getCurrentStory();
    if (!currentStory || !session) return;

    // Update story session
    const updatedStories = session.stories.map((story, index) => 
      index === session.currentStoryIndex 
        ? { ...story, checkpointPassed: success, completedAt: Date.now() }
        : story
    );

    const updatedSession = {
      ...session,
      stories: updatedStories,
      lastActivity: Date.now()
    };

    setSession(updatedSession);
    setCurrentPhase('digest');
    setHasUnsavedChanges(true);
    
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

  const handleStepNavigation = (stepIndex: number) => {
    const currentStory = getCurrentStory();
    if (!currentStory || !session) return;

    setCurrentStep(stepIndex);
    
    const updatedSession = {
      ...session,
      currentStep: stepIndex,
      lastActivity: Date.now()
    };
    setSession(updatedSession);
    
    // Adjust phase based on step
    if (stepIndex < currentStory.story.steps.length) {
      setCurrentPhase('storytelling');
    }
  };

  const handleStorySelect = (storyIndex: number) => {
    if (!session) return;

    const updatedSession = {
      ...session,
      currentStoryIndex: storyIndex,
      currentStep: 0,
      lastActivity: Date.now()
    };

    setSession(updatedSession);
    setCurrentStep(0);
    
    const selectedStory = session.stories[storyIndex];
    if (selectedStory.completedAt) {
      setCurrentPhase('digest');
    } else {
      setCurrentPhase('storytelling');
    }

    toast({
      title: "Story switched! 📚",
      description: `Now viewing: "${selectedStory.question}"`,
    });
  };

  const handleContinueLearning = () => {
    setCurrentPhase('questioning');
    setShowContinueInput(true);
    setError(null);
  };

  const handleNewTopic = () => {
    if (!user) return;

    // Create fresh session
    const newSession: ConversationSession = {
      id: `session-${Date.now()}`,
      userId: user.id,
      theme: apiTheme as 'Space' | 'Forest',
      stories: [],
      currentStoryIndex: 0,
      currentStep: 0,
      startTime: Date.now(),
      lastActivity: Date.now()
    };

    setSession(newSession);
    setCurrentPhase('questioning');
    setCurrentStep(0);
    setShowContinueInput(false);
    setHasUnsavedChanges(false);
    setError(null);
    
    toast({
      title: "Starting fresh! 🔄",
      description: "New learning session began!",
    });
  };

  const handleSaveSession = async () => {
    // In a real app, this would save to Supabase
    // For now, just mark as saved
    setHasUnsavedChanges(false);
    
    toast({
      title: "Session saved! 💾",
      description: "Your learning progress has been saved.",
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

  // Get current display data
  const currentStory = getCurrentStory();
  const currentStoryData = currentStory?.story;
  const currentStepText = currentStoryData?.steps[currentStep] || "";

  const themeEmoji = validTheme === "space" ? "🚀" : "🌲";
  const themeTitle = validTheme === "space" ? "Space" : "Forest";

  const shouldShowInputPanel = 
    currentPhase === 'questioning' || 
    (currentPhase === 'digest' && showContinueInput);

  const shouldShowDigestContinue = 
    currentPhase === 'digest' && currentStory?.completedAt && !showContinueInput;

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
              {themeTitle} Learning Session
            </h1>
          </div>
          <div className="flex items-center gap-3">
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
          {/* Session Controls */}
          <SessionControls
            theme={validTheme}
            storiesCount={session?.stories.length || 0}
            onNewTopic={handleNewTopic}
            onSaveSession={handleSaveSession}
            onContinueLearning={handleContinueLearning}
            hasUnsavedChanges={hasUnsavedChanges}
            isLoading={isLoading}
          />

          {/* Conversation History - Show above main content when present */}
          {session && session.stories.length > 0 && (
            <ConversationHistory
              theme={validTheme}
              stories={session.stories}
              currentStoryIndex={session.currentStoryIndex}
              onStorySelect={handleStorySelect}
            />
          )}

          {/* Input Panel */}
          {shouldShowInputPanel && (
            <InputPanel
              theme={validTheme}
              onQuestionSubmit={handleQuestionSubmit}
              isLoading={isLoading}
              title={showContinueInput ? "What else would you like to explore? 🌟" : "What would you like to learn about? 🤔"}
              placeholder={showContinueInput ? "Ask another question..." : "What would you like to learn about?"}
            />
          )}

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
          {currentStepText && currentStoryData && (
            <StoryPanel
              theme={validTheme}
              currentStep={currentStepText}
              stepNumber={currentStep + 1}
              totalSteps={currentStoryData.steps.length}
              onStepChange={handleStepNavigation}
              canNavigate={currentPhase !== 'checkpoint'}
            />
          )}

          {/* Next Step Button */}
          {currentPhase === 'storytelling' && currentStoryData && currentStep < currentStoryData.steps.length - 1 && (
            <div className="text-center">
              <Button
                variant={validTheme === "space" ? "space" : "forest"}
                size="lg"
                onClick={handleNextStep}
                disabled={isLoading}
                className="gap-3 text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Continue Learning ✨
              </Button>
            </div>
          )}
          
          {/* Complete Story Button */}
          {currentPhase === 'storytelling' && currentStoryData && currentStep === currentStoryData.steps.length - 1 && (
            <div className="text-center">
              <Button
                variant={validTheme === "space" ? "space" : "forest"}
                size="lg"
                onClick={() => setCurrentPhase('checkpoint')}
                disabled={isLoading}
                className="gap-3 text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Complete Story & Take Quiz 🎯
              </Button>
            </div>
          )}

          {/* Checkpoint Flow */}
          {currentPhase === 'checkpoint' && currentStoryData && (
            <CheckpointFlow
              theme={validTheme}
              checkpoint={currentStoryData.checkpoint}
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
          {currentPhase === 'digest' && currentStoryData && (
            <ParentDigest
              data={currentStoryData.parent_digest}
              isVisible={true}
            />
          )}

          {/* Continue Learning Prompt */}
          {shouldShowDigestContinue && (
            <div className="text-center py-12">
              <div className="space-y-8 max-w-2xl mx-auto">
                <div className="animate-bounce">
                  <Sparkles className="w-20 h-20 text-primary mx-auto" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-foreground">
                    Amazing work! 🎉
                  </h3>
                  <p className="text-xl text-muted-foreground">
                    You've completed another learning adventure!
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Ready to explore something new? Ask another question to continue your journey!
                  </p>
                </div>
                <Button
                  variant={validTheme === "space" ? "space" : "forest"}
                  size="lg"
                  onClick={handleContinueLearning}
                  className="gap-3 text-xl px-12 py-8 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <Sparkles className="w-7 h-7" />
                  Continue Learning Adventure
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EnhancedQuestInterface;