import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface HeaderSectionProps {
  onClose: () => void;
  currentIndex: number;
  totalCount: number;
  context: string;
}

export default function HeaderSection({
  onClose,
  currentIndex,
  totalCount,
  context,
}: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-sm">
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-sm">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <span className="text-sm text-muted-foreground">
          {currentIndex} of {totalCount} in{" "}
          <span className="underline text-foreground">{context}</span>
        </span>
      </div>
    </div>
  );
}
