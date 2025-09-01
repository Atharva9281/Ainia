import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import spaceImage from "@/assets/space-theme.jpg";
import forestImage from "@/assets/forest-theme.jpg";

export type Theme = "space" | "forest";

interface ThemeSelectorProps {
  selectedTheme: Theme | null;
  onThemeSelect: (theme: Theme) => void;
}

export function ThemeSelector({ selectedTheme, onThemeSelect }: ThemeSelectorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
        Choose Your Adventure!
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className={`relative overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            selectedTheme === "space" ? "ring-4 ring-space-primary shadow-glow" : "shadow-soft"
          }`}
          onClick={() => onThemeSelect("space")}
        >
          <div className="relative h-48">
            <img 
              src={spaceImage} 
              alt="Space adventure with rockets and planets"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-space-primary/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-2xl font-bold text-white mb-2">🚀 Space</h3>
              <p className="text-white/90 text-sm">
                Explore planets, stars, and rockets!
              </p>
            </div>
          </div>
          {selectedTheme === "space" && (
            <div className="absolute top-2 right-2">
              <div className="bg-space-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">
                ✨
              </div>
            </div>
          )}
        </Card>

        <Card 
          className={`relative overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            selectedTheme === "forest" ? "ring-4 ring-forest-primary shadow-glow" : "shadow-soft"
          }`}
          onClick={() => onThemeSelect("forest")}
        >
          <div className="relative h-48">
            <img 
              src={forestImage} 
              alt="Forest adventure with trees and animals"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-primary/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-2xl font-bold text-white mb-2">🌲 Forest</h3>
              <p className="text-white/90 text-sm">
                Meet animals, trees, and flowers!
              </p>
            </div>
          </div>
          {selectedTheme === "forest" && (
            <div className="absolute top-2 right-2">
              <div className="bg-forest-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">
                ✨
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}