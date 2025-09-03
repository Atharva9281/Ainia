import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RotateCcw, Save, Plus, History } from "lucide-react";
import type { Theme } from "./ThemeSelector";

interface SessionControlsProps {
  theme: Theme;
  storiesCount: number;
  onNewTopic: () => void;
  onSaveSession: () => void;
  onContinueLearning: () => void;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
}

export function SessionControls({
  theme,
  storiesCount,
  onNewTopic,
  onSaveSession,
  onContinueLearning,
  hasUnsavedChanges,
  isLoading
}: SessionControlsProps) {
  const themeStyles = {
    space: "bg-space-bg/30 border-space-accent/20",
    forest: "bg-forest-bg/30 border-forest-accent/20"
  };

  const buttonVariant = theme === "space" ? "space" : "forest";

  return (
    <Card className={`p-6 ${themeStyles[theme]} border-2 shadow-lg`}>
      {storiesCount === 0 ? (
        /* Welcome State */
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="text-2xl">✨</div>
            <h2 className="text-xl font-bold text-foreground">
              Welcome to Your Learning Adventure!
            </h2>
            <div className="text-2xl">✨</div>
          </div>
          <p className="text-muted-foreground">
            Ask a question below to begin your first story
          </p>
        </div>
      ) : (
        /* Active Session State */
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <History className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Learning Session Active
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {storiesCount} {storiesCount === 1 ? 'story' : 'stories'} explored so far
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Continue Learning Button */}
            <Button
              variant={buttonVariant}
              size="default"
              onClick={onContinueLearning}
              disabled={isLoading}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Ask Another Question
            </Button>

            {/* Save Session Button */}
            {hasUnsavedChanges && (
              <Button
                variant="outline"
                size="default"
                onClick={onSaveSession}
                disabled={isLoading}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save Progress
              </Button>
            )}

            {/* New Topic Button with Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  disabled={isLoading}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Topic
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start a new topic?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear your current learning session with {storiesCount} {storiesCount === 1 ? 'story' : 'stories'}. 
                    {hasUnsavedChanges && ' Your progress hasn\'t been saved yet.'}
                    Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Learning</AlertDialogCancel>
                  <AlertDialogAction onClick={onNewTopic}>
                    Start Fresh
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Progress Indicator */}
          <div className="pt-3 border-t border-border/30">
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${hasUnsavedChanges ? 'bg-orange-500' : 'bg-green-500'}`} />
              <span className="text-muted-foreground">
                {hasUnsavedChanges ? 'Unsaved changes' : 'All progress saved'}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}