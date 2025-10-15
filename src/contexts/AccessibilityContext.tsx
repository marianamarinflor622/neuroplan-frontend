import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';

interface AccessibilitySettings {
  // Sliders de contenido
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  wordSpacing: number;
  
  // Sliders de color
  contrast: number;
  saturation: number;
  brightness: number;
  
  // Herramientas de accesibilidad
  cursorBlack: boolean;
  cursorWhite: boolean;
  readingGuide: boolean;
  magnifier: boolean;
  textAlignment: 'left' | 'center' | 'right' | 'justify';
  blockFlashing: boolean;
  focusMode: boolean;
  dyslexiaFont: boolean;
  readableFont: boolean;
  easyReading: boolean;
  readingMode: boolean;
  hideImages: boolean;
  highlightLinks: boolean;
  highlightTitles: boolean;
  muteSounds: boolean;
  highBrightness: boolean;
  lowBrightness: boolean;
  highContrast: boolean;
  lightContrast: boolean;
  invertedContrast: boolean;
  darkContrast: boolean;
  monochrome: boolean;
  highSaturation: boolean;
  lowSaturation: boolean;
  
  // Perfiles
  activeProfile: string | null;
  activeColorblindProfile: string | null;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetAll: () => void;
  resetContent: () => void;
  resetColor: () => void;
  applyProfile: (profile: string) => void;
  applyColorblindProfile: (profile: string) => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  letterSpacing: 0,
  lineHeight: 150,
  wordSpacing: 0,
  contrast: 100,
  saturation: 100,
  brightness: 100,
  cursorBlack: false,
  cursorWhite: false,
  readingGuide: false,
  magnifier: false,
  textAlignment: 'left',
  blockFlashing: false,
  focusMode: false,
  dyslexiaFont: false,
  readableFont: false,
  easyReading: false,
  readingMode: false,
  hideImages: false,
  highlightLinks: false,
  highlightTitles: false,
  muteSounds: false,
  highBrightness: false,
  lowBrightness: false,
  highContrast: false,
  lightContrast: false,
  invertedContrast: false,
  darkContrast: false,
  monochrome: false,
  highSaturation: false,
  lowSaturation: false,
  activeProfile: null,
  activeColorblindProfile: null,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // SIEMPRE cargar configuración por defecto (sin filtros)
    // Limpiar cualquier configuración guardada previamente
    localStorage.removeItem('accessibilitySettings');
    return defaultSettings;
  });

  // NO guardar en localStorage - los filtros se resetean cada vez
  // useEffect(() => {
  //   localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  // }, [settings]);

  // Aplicar estilos CSS cuando cambien los settings
    // Helpers para reducir complejidad cognitiva
    const setCSSVar = (root: HTMLElement, name: string, value: number, defaultValue: number, unit: string) => {
      if (value !== defaultValue) {
        root.style.setProperty(name, `${value}${unit}`);
      } else {
        root.style.removeProperty(name);
      }
    };
  
    const applyTypography = (root: HTMLElement, s: AccessibilitySettings) => {
      setCSSVar(root, '--accessibility-font-size', s.fontSize, 100, '%');
      setCSSVar(root, '--accessibility-letter-spacing', s.letterSpacing, 0, 'px');
      setCSSVar(root, '--accessibility-line-height', s.lineHeight, 150, '%');
      setCSSVar(root, '--accessibility-word-spacing', s.wordSpacing, 0, 'px');
    };
  
    const applyColors = (root: HTMLElement, s: AccessibilitySettings) => {
      setCSSVar(root, '--accessibility-contrast', s.contrast, 100, '%');
      setCSSVar(root, '--accessibility-saturation', s.saturation, 100, '%');
      setCSSVar(root, '--accessibility-brightness', s.brightness, 100, '%');
    };
  
    const ALL_BODY_CLASSES = [
      'accessibility-cursor-black',
      'accessibility-cursor-white',
      'accessibility-reading-guide',
      'accessibility-magnifier',
      'accessibility-text-left',
      'accessibility-text-center',
      'accessibility-text-right',
      'accessibility-text-justify',
      'accessibility-block-flashing',
      'accessibility-focus-mode',
      'accessibility-dyslexia-font',
      'accessibility-readable-font',
      'accessibility-easy-reading',
      'accessibility-reading-mode',
      'accessibility-hide-images',
      'accessibility-highlight-links',
      'accessibility-highlight-titles',
      'accessibility-mute-sounds',
      'accessibility-high-brightness',
      'accessibility-low-brightness',
      'accessibility-high-contrast',
      'accessibility-light-contrast',
      'accessibility-inverted-contrast',
      'accessibility-dark-contrast',
      'accessibility-monochrome',
      'accessibility-high-saturation',
      'accessibility-low-saturation',
      // Limpiar filtros de daltonismo
      'accessibility-colorblind-deuteranopia',
      'accessibility-colorblind-deuteranomalía',
      'accessibility-colorblind-protanopia',
      'accessibility-colorblind-tritanopia',
      'accessibility-colorblind-tritanomalía',
      'accessibility-colorblind-acromatopsia'
    ];
  
    const addActiveClasses = (body: HTMLElement, s: AccessibilitySettings) => {
      body.classList.remove(...ALL_BODY_CLASSES);
  
      const conditionalClasses: Array<[boolean, string]> = [
        [s.cursorBlack, 'accessibility-cursor-black'],
        [s.cursorWhite, 'accessibility-cursor-white'],
        [s.readingGuide, 'accessibility-reading-guide'],
        [s.magnifier, 'accessibility-magnifier'],
        [s.blockFlashing, 'accessibility-block-flashing'],
        [s.focusMode, 'accessibility-focus-mode'],
        [s.dyslexiaFont, 'accessibility-dyslexia-font'],
        [s.readableFont, 'accessibility-readable-font'],
        [s.easyReading, 'accessibility-easy-reading'],
        [s.readingMode, 'accessibility-reading-mode'],
        [s.hideImages, 'accessibility-hide-images'],
        [s.highlightLinks, 'accessibility-highlight-links'],
        [s.highlightTitles, 'accessibility-highlight-titles'],
        [s.muteSounds, 'accessibility-mute-sounds'],
        [s.highBrightness, 'accessibility-high-brightness'],
        [s.lowBrightness, 'accessibility-low-brightness'],
        [s.highContrast, 'accessibility-high-contrast'],
        [s.lightContrast, 'accessibility-light-contrast'],
        [s.invertedContrast, 'accessibility-inverted-contrast'],
        [s.darkContrast, 'accessibility-dark-contrast'],
        [s.monochrome, 'accessibility-monochrome'],
        [s.highSaturation, 'accessibility-high-saturation'],
        [s.lowSaturation, 'accessibility-low-saturation']
      ];
  
      conditionalClasses.forEach(([cond, cls]) => {
        if (cond) body.classList.add(cls);
      });
  
      if (s.textAlignment) {
        body.classList.add(`accessibility-text-${s.textAlignment}`);
      }
  
      if (s.activeColorblindProfile) {
        body.classList.add(`accessibility-colorblind-${s.activeColorblindProfile.toLowerCase()}`);
      }
    };
  
    useEffect(() => {
      const root = document.documentElement;
      const body = document.body;
  
      // Aplicar fuentes
      applyTypography(root, settings);
  
      // Aplicar colores
      applyColors(root, settings);
  
      // Aplicar clases al body
      addActiveClasses(body, settings);
    }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetAll = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibilitySettings');
  }, []);

  const resetContent = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      fontSize: 100,
      letterSpacing: 0,
      lineHeight: 150,
      wordSpacing: 0,
    }));
  }, []);

  const resetColor = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      contrast: 100,
      saturation: 100,
      brightness: 100,
    }));
  }, []);

  const applyProfile = useCallback((profile: string) => {
    let profileSettings: Partial<AccessibilitySettings> = { activeProfile: profile };

    switch (profile.toLowerCase()) {
      case 'epilepsia':
        profileSettings = {
          ...profileSettings,
          blockFlashing: true,
          lowSaturation: true,
          saturation: 50,
        };
        break;
      case 'aprendizaje':
        profileSettings = {
          ...profileSettings,
          fontSize: 120,
          readingGuide: true,
          highlightTitles: true,
        };
        break;
      case 'discapacidad visual':
        profileSettings = {
          ...profileSettings,
          fontSize: 150,
          cursorBlack: true,
          highlightTitles: true,
          highlightLinks: true,
        };
        break;
      case 'mayores':
        profileSettings = {
          ...profileSettings,
          fontSize: 150,
          lineHeight: 180,
          letterSpacing: 2,
          wordSpacing: 4,
          readingGuide: true,
          focusMode: true,
          easyReading: true,
        };
        break;
      case 'tdah':
        profileSettings = {
          ...profileSettings,
          readingGuide: true,
          focusMode: true,
          blockFlashing: true,
          easyReading: true,
          highlightTitles: true,
        };
        break;
      case 'dislexia':
        profileSettings = {
          ...profileSettings,
          dyslexiaFont: true,
          readingGuide: true,
          letterSpacing: 1,
          lineHeight: 180,
        };
        break;
    }

    setSettings(prev => ({ ...prev, ...profileSettings }));
  }, []);

  const applyColorblindProfile = useCallback((profile: string) => {
    setSettings(prev => ({
      ...prev,
      activeColorblindProfile: profile,
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      settings,
      updateSettings,
      resetAll,
      resetContent,
      resetColor,
      applyProfile,
      applyColorblindProfile,
    }),
    [settings, updateSettings, resetAll, resetContent, resetColor, applyProfile, applyColorblindProfile]
  );

  return (
    <AccessibilityContext.Provider
      value={contextValue}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
