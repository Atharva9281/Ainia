import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";

interface AuthButtonProps {
  isSignedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function AuthButton({ isSignedIn, onSignIn, onSignOut }: AuthButtonProps) {
  if (isSignedIn) {
    return (
      <Button variant="outline" onClick={onSignOut} className="gap-2">
        <User className="w-4 h-4" />
        Sign Out
      </Button>
    );
  }

  return (
    <Button variant="default" onClick={onSignIn} className="gap-2">
      <LogIn className="w-4 h-4" />
      Sign In (Parents)
    </Button>
  );
}