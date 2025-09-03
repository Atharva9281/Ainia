import { Hero } from "@/components/Hero";
import { ThemeSelector } from "@/components/ThemeSelector";
import { AuthButton } from "@/components/AuthButton";
import { UsageStats } from "@/components/UsageStats";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

const Index = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();

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
            <AuthButton
              isSignedIn={!!user}
              onSignIn={handleAuth}
              onSignOut={handleAuth}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      <main className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-8">
          {/* Usage Statistics */}
          {user && (
            <div className="mt-8">
              <UsageStats />
            </div>
          )}
          
          {/* Theme Selection */}
          <div className="mt-10 md:mt-16">
            <ThemeSelector />
          </div>
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