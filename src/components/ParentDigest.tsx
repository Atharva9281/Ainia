import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Home } from "lucide-react";

interface ParentDigestData {
  skills: string[];
  note: string;
  home_activity?: string;
}

interface ParentDigestProps {
  data: ParentDigestData;
  isVisible: boolean;
}

export function ParentDigest({ data, isVisible }: ParentDigestProps) {
  if (!isVisible) return null;

  return (
    <Card className="p-6 bg-accent/50 border-accent">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">
          Parent Digest
        </h3>
      </div>

      <div className="space-y-4">
        {/* Skills practiced */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-foreground">Skills Practiced:</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Educational note */}
        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Learning Focus:
          </h4>
          <p className="text-foreground/80 leading-relaxed">
            {data.note}
          </p>
        </div>

        {/* Home activity suggestion */}
        {data.home_activity && (
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">
                Try at Home:
              </h4>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              {data.home_activity}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-accent-foreground/10">
        <p className="text-xs text-muted-foreground">
          💡 This digest helps you understand what your child is learning and how to support their growth.
        </p>
      </div>
    </Card>
  );
}