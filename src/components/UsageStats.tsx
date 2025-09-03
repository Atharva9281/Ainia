
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { BarChart3, BookOpen, Clock, Sparkles } from "lucide-react";
import { getDailyStoryCount } from "@/api/quest";
import { useAuth } from "@/components/AuthProvider";

export function UsageStats() {
  const { user } = useAuth();
  const [dailyCount, setDailyCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const maxStoriesPerDay = 20;

  useEffect(() => {
    if (user) {
      loadUsageStats();
    }
  }, [user]);

  const loadUsageStats = async () => {
    if (!user) return;
    
    try {
      const count = await getDailyStoryCount(user.id);
      setDailyCount(count);
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return null;
  }

  const remainingStories = Math.max(0, maxStoriesPerDay - dailyCount);
  const progressPercentage = (dailyCount / maxStoriesPerDay) * 100;
  
  // Color based on usage
  const getUsageColor = () => {
    if (dailyCount >= maxStoriesPerDay) return 'text-red-600';
    if (dailyCount >= maxStoriesPerDay * 0.8) return 'text-orange-500';
    if (dailyCount >= maxStoriesPerDay * 0.5) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getUsageText = () => {
    if (dailyCount >= maxStoriesPerDay) return 'Daily limit reached';
    if (dailyCount >= maxStoriesPerDay * 0.8) return 'Almost at limit';
    if (dailyCount >= maxStoriesPerDay * 0.5) return 'Halfway there';
    return 'Just getting started';
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/10 border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Today's Learning Progress
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stories Asked */}
        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <BookOpen className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Stories Asked</p>
            <p className="text-2xl font-bold text-foreground">{dailyCount}</p>
          </div>
        </div>
        
        {/* Remaining Stories */}
        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Stories Left</p>
            <p className="text-2xl font-bold text-foreground">{remainingStories}</p>
          </div>
        </div>
        
        {/* Usage Status */}
        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant="secondary" className={getUsageColor()}>
              {getUsageText()}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Daily Progress</span>
          <span className="text-sm font-medium text-foreground">
            {dailyCount}/{maxStoriesPerDay}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>
      
      {dailyCount >= maxStoriesPerDay && (
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-700">
            🎯 You've reached your daily limit! Come back tomorrow for more learning adventures.
          </p>
        </div>
      )}
    </Card>
  );
}