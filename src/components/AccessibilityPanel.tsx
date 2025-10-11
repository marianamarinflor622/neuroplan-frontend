import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Accessibility,
  X,
  RotateCcw,
  Focus,
  Brain,
  Eye,
  Users,
  BookOpen,
  Glasses,
  Settings,
  Palette,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose,
}) => {
  // Estados para secciones colapsables
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Estados para sliders de contenido
  const [fontSize, setFontSize] = useState([100]);
  const [letterSpacing, setLetterSpacing] = useState([0]);
  const [lineHeight, setLineHeight] = useState([150]);
  const [wordSpacing, setWordSpacing] = useState([0]);

  // Estados para sliders de color
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [brightness, setBrightness] = useState([100]);

  // Función para toggle de secciones
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Función para reset global
  const resetAll = () => {
    setFontSize([100]);
    setLetterSpacing([0]);
    setLineHeight([150]);
    setWordSpacing([0]);
    setContrast([100]);
    setSaturation([100]);
    setBrightness([100]);
  };

  // Función para reset de contenido
  const resetContent = () => {
    setFontSize([100]);
    setLetterSpacing([0]);
    setLineHeight([150]);
    setWordSpacing([0]);
  };

  // Función para reset de color
  const resetColor = () => {
    setContrast([100]);
    setSaturation([100]);
    setBrightness([100]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-80 z-50 bg-accessibility-panel border-l shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-primary text-primary-foreground">
          <div className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            <h2 className="text-lg font-bold">MENÚ DE ACCESIBILIDAD</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Botón Reset Global */}
        <div className="p-4">
          <Button
            variant="outline"
            onClick={resetAll}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restablecer Todo
          </Button>
        </div>

        <Separator />

        {/* Contenido con ScrollArea */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* Perfiles De Accesibilidad */}
            <div>
              <Button
                variant="ghost"
                onClick={() => toggleSection('accessibility-profiles')}
                className="w-full justify-between bg-accessibility-bg hover:bg-accessibility-hover"
              >
                <div className="flex items-center gap-2">
                  <Accessibility className="h-4 w-4" />
                  <span>Perfiles De Accesibilidad</span>
                </div>
                {expandedSections.includes('accessibility-profiles') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expandedSections.includes('accessibility-profiles') && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-1">
                    <Focus className="h-4 w-4" />
                    <span className="text-xs">Epilepsia</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-1">
                    <Brain className="h-4 w-4" />
                    <span className="text-xs">Aprendizaje</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">Discapacidad visual</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xs">Mayores</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-1">
                    <Focus className="h-4 w-4" />
                    <span className="text-xs">TDAH</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs">Dislexia</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Perfiles De Daltonismo */}
            <div>
              <Button
                variant="ghost"
                onClick={() => toggleSection('colorblind-profiles')}
                className="w-full justify-between bg-accessibility-bg hover:bg-accessibility-hover"
              >
                <div className="flex items-center gap-2">
                  <Glasses className="h-4 w-4" />
                  <span>Perfiles De Daltonismo</span>
                </div>
                {expandedSections.includes('colorblind-profiles') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expandedSections.includes('colorblind-profiles') && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-1">
                    <Glasses className="h-4 w-4" />
                    <span className="text-xs">Deuteranopia</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-1">
                    <Glasses className="h-4 w-4" />
                    <span className="text-xs">Deuteranomalía</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-1">
                    <Glasses className="h-4 w-4" />
                    <span className="text-xs">Protanopia</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-1">
                    <Glasses className="h-4 w-4" />
                    <span className="text-xs">Tritanopia</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-1">
                    <Glasses className="h-4 w-4" />
                    <span className="text-xs">Tritanomalía</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-1">
                    <Glasses className="h-4 w-4" />
                    <span className="text-xs">Acromatopsia</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Ajustes De Contenido */}
            <div>
              <Button
                variant="ghost"
                onClick={() => toggleSection('content-settings')}
                className="w-full justify-between bg-accessibility-bg hover:bg-accessibility-hover"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Ajustes De Contenido</span>
                </div>
                {expandedSections.includes('content-settings') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expandedSections.includes('content-settings') && (
                <div className="mt-2 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tamaño de fuente</label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={200}
                      min={50}
                      step={10}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{fontSize[0]}%</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Espacio entre letras</label>
                    <Slider
                      value={letterSpacing}
                      onValueChange={setLetterSpacing}
                      max={10}
                      min={-2}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{letterSpacing[0]}px</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Espacio entre líneas</label>
                    <Slider
                      value={lineHeight}
                      onValueChange={setLineHeight}
                      max={300}
                      min={100}
                      step={10}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{lineHeight[0]}%</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Espacio entre palabras</label>
                    <Slider
                      value={wordSpacing}
                      onValueChange={setWordSpacing}
                      max={20}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{wordSpacing[0]}px</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetContent}
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restablecer Contenido
                  </Button>
                </div>
              )}
            </div>

            {/* Herramientas De Color */}
            <div>
              <Button
                variant="ghost"
                onClick={() => toggleSection('color-tools')}
                className="w-full justify-between bg-accessibility-bg hover:bg-accessibility-hover"
              >
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Herramientas De Color</span>
                </div>
                {expandedSections.includes('color-tools') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expandedSections.includes('color-tools') && (
                <div className="mt-2 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contraste</label>
                    <Slider
                      value={contrast}
                      onValueChange={setContrast}
                      max={150}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{contrast[0]}%</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Saturación</label>
                    <Slider
                      value={saturation}
                      onValueChange={setSaturation}
                      max={200}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{saturation[0]}%</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Brillo</label>
                    <Slider
                      value={brightness}
                      onValueChange={setBrightness}
                      max={150}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{brightness[0]}%</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetColor}
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restablecer Color
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
