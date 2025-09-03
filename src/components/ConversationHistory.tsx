import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, CheckCircle, XCircle, BookOpen } from "lucide-react";
import type { StorySession } from "@/lib/types";
import type { Theme } from "./ThemeSelector";

interface ConversationHistoryProps {
  theme: Theme;
  stories: StorySession[];
  currentStoryIndex: number;
  onStorySelect: (index: number) => void;
}

export function ConversationHistory({ 
  theme, 
  stories, 
  currentStoryIndex, 
  onStorySelect 
}: ConversationHistoryProps) {
  if (stories.length === 0) {
    return null;
  }

  const themeStyles = {
    space: "bg-space-bg/50 border-space-accent/30",
    forest: "bg-forest-bg/50 border-forest-accent/30"
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Card className={`p-6 ${themeStyles[theme]} border-2 shadow-lg`}>
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-bold text-foreground">
            Your Learning Journey
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {stories.length} {stories.length === 1 ? 'story' : 'stories'} completed
        </p>
      </div>
      
      <ScrollArea className="h-32">
        <div className="space-y-2">
          {stories.map((story, index) => (
            <button
              key={story.id}
              onClick={() => onStorySelect(index)}
              className={`w-full text-left p-3 rounded-lg border transition-all hover:scale-[1.02] ${
                index === currentStoryIndex
                  ? theme === "space"
                    ? "bg-space-primary/20 border-space-primary"
                    : "bg-forest-primary/20 border-forest-primary"
                  : "bg-background/50 border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {story.question}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {story.completedAt ? formatTime(story.completedAt) : 'In progress'}
                      </span>
                    </div>
                    {story.cached && (
                      <Badge variant="secondary" className="text-xs">
                        Cached
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  {story.completedAt && (
                    <div className="flex items-center">
                      {story.checkpointPassed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                  )}
                  {index === currentStoryIndex && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        theme === "space" ? "border-space-primary" : "border-forest-primary"
                      }`}
                    >
                      Current
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
      
      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          Click any story to review it • Green ✓ = checkpoint passed
        </p>
      </div>
    </Card>
  );
}