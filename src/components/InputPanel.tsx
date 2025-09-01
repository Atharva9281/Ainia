import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mic, Send } from "lucide-react";
import type { Theme } from "./ThemeSelector";

interface InputPanelProps {
  theme: Theme;
  onQuestionSubmit: (question: string) => void;
  isLoading?: boolean;
}

export function InputPanel({ theme, onQuestionSubmit, isLoading }: InputPanelProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onQuestionSubmit(question.trim());
      setQuestion("");
    }
  };

  const handleSpeakClick = () => {
    // TODO: Implement Web Speech API when backend is connected
    alert("Voice input will be available when connected to Supabase!");
  };

  const themeStyles = {
    space: "bg-space-bg border-space-primary/20",
    forest: "bg-forest-bg border-forest-primary/20"
  };

  const buttonVariant = theme === "space" ? "space" : "forest";

  return (
    <Card className={`p-6 ${themeStyles[theme]} border-2`}>
      <h3 className="text-xl font-semibold mb-4 text-foreground">
        Ask me anything! 🤔
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to learn about?"
            className="text-lg h-12 border-2"
            disabled={isLoading}
            aria-label="Ask a question"
          />
          <Button
            type="button"
            variant={buttonVariant}
            size="icon"
            onClick={handleSpeakClick}
            disabled={isLoading}
            aria-label="Speak your question"
          >
            <Mic className="w-5 h-5" />
          </Button>
        </div>
        <Button
          type="submit"
          variant={buttonVariant}
          size="lg"
          disabled={!question.trim() || isLoading}
          className="w-full"
        >
          <Send className="w-5 h-5 mr-2" />
          {isLoading ? "Thinking..." : "Ask Question"}
        </Button>
      </form>
    </Card>
  );
}