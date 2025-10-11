import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accessibility } from 'lucide-react';

interface AccessibilityTriggerProps {
  onClick: () => void;
}

export const AccessibilityTrigger: React.FC<AccessibilityTriggerProps> = ({ onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-40 rounded-full h-14 w-14 bg-primary hover:bg-primary/90 hover:scale-110 transition-transform shadow-lg"
            aria-label="Abrir panel de accesibilidad"
          >
            <Accessibility className="h-6 w-6 text-primary-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Accesibilidad</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
