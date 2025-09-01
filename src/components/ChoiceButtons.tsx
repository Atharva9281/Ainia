import { Button } from "@/components/ui/button";
import type { Theme } from "./ThemeSelector";

interface ChoiceButtonsProps {
  theme: Theme;
  choices: string[];
  onChoiceSelect: (choice: string, index: number) => void;
  disabled?: boolean;
}

export function ChoiceButtons({ theme, choices, onChoiceSelect, disabled }: ChoiceButtonsProps) {
  if (!choices || choices.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-foreground text-center">
        What happens next? 🤔
      </h4>
      <div className="grid gap-3">
        {choices.map((choice, index) => (
          <Button
            key={index}
            variant="choice"
            size="lg"
            onClick={() => onChoiceSelect(choice, index)}
            disabled={disabled}
            className="text-left h-auto py-4 px-6 whitespace-normal min-h-[60px]"
            aria-label={`Choice ${index + 1}: ${choice}`}
          >
            <div className="flex items-start gap-3 w-full">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center text-white font-bold flex-shrink-0 ${
                theme === "space" ? "bg-space-primary" : "bg-forest-primary"
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="flex-1 text-base leading-relaxed">
                {choice}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}