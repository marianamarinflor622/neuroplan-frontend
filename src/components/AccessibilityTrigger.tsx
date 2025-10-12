import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accessibility } from 'lucide-react';

interface AccessibilityTriggerProps {
  onClick: () => void;
}

export const AccessibilityTrigger: React.FC<AccessibilityTriggerProps> = ({ onClick }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Crear un contenedor específico para el botón si no existe
    let container = document.getElementById('accessibility-trigger-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'accessibility-trigger-container';
      container.style.cssText = `
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        z-index: 2147483647 !important;
        pointer-events: none !important;
      `;
      document.body.appendChild(container);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2147483647, // Máximo valor de z-index
        pointerEvents: 'none',
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClick}
              size="lg"
              style={{
                pointerEvents: 'auto',
                borderRadius: '50%',
                width: '64px',
                height: '64px',
                padding: 0,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                backgroundColor: 'hsl(var(--primary))',
                color: 'white',
                position: 'relative',
                zIndex: 2147483647,
              }}
              aria-label="Abrir panel de accesibilidad"
              className="hover:scale-110 transition-transform duration-200"
            >
              <Accessibility className="h-7 w-7" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Accesibilidad</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
