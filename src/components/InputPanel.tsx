import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Theme } from "./ThemeSelector";

interface InputPanelProps {
  theme: Theme;
  onQuestionSubmit: (question: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  title?: string;
  showWhenStoryComplete?: boolean;
}

export function InputPanel({ 
  theme, 
  onQuestionSubmit, 
  isLoading,
  placeholder = "What would you like to learn about?",
  title = "Ask me anything! 🤔",
  showWhenStoryComplete = true
}: InputPanelProps) {
  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onQuestionSubmit(question.trim());
      setQuestion("");
    }
  };

  const handleSpeakClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      // Stop listening
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // Start listening
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "🎤 Listening...",
        description: "Speak your question now!",
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      setIsListening(false);
      toast({
        title: "Voice captured! ✨",
        description: "You can edit or submit your question.",
      });
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      toast({
        title: "Voice input error",
        description: "Please try again or type your question.",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const themeStyles = {
    space: "bg-space-bg border-space-primary/20",
    forest: "bg-forest-bg border-forest-primary/20"
  };

  const buttonVariant = theme === "space" ? "space" : "forest";

  return (
    <Card className={`p-6 ${themeStyles[theme]} border-2`}>
      <h3 className="text-xl font-semibold mb-4 text-foreground">
        {title}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={placeholder}
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
            aria-label={isListening ? "Stop listening" : "Speak your question"}
            className={isListening ? "animate-pulse" : ""}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
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