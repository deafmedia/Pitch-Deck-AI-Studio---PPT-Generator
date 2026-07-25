import { SlideData, ThemePreset } from '../types';

export interface AccessibilityIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  suggestion: string;
  type: 'alt-text' | 'contrast' | 'heading' | 'font-size' | 'speaker-notes' | 'video-caption';
  autoFix?: (slide: SlideData) => SlideData;
}

// Convert Hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let cleanHex = hex.trim().replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  if (cleanHex.length !== 6) return null;

  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Calculate Relative Luminance according to WCAG 2.1 specifications
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate Contrast Ratio (1:1 to 21:1)
export function getContrastRatio(color1: string, color2: string): number | null {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return null;

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// Main Slide Accessibility Scanner Utility
export function scanSlideAccessibility(slide: SlideData, theme: ThemePreset): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // 1. Missing Image Alt Text Check
  if (slide.imageUrl && slide.imageUrl.trim() !== '') {
    if (!slide.imageAltText || slide.imageAltText.trim() === '') {
      issues.push({
        id: `alt-text-${slide.id}`,
        severity: 'critical',
        title: 'Missing Image Alt-Text',
        description: 'The current slide features an image without descriptive alt-text for screen readers and accessibility tools.',
        suggestion: 'Add descriptive alt-text explaining the key visual content of the image.',
        type: 'alt-text',
        autoFix: (prev) => ({
          ...prev,
          imageAltText: prev.mediaCaption || `Visual slide illustration for ${prev.title || 'presentation'}`,
        }),
      });
    }
  }

  // 2. Text vs Background Contrast Ratio (WCAG 2.1)
  if (theme.bgColor && theme.textColor) {
    const contrastRatio = getContrastRatio(theme.textColor, theme.bgColor);
    if (contrastRatio !== null) {
      const isLargeText = (slide.titleFontSize || 32) >= 24;
      const minRatio = isLargeText ? 3.0 : 4.5;

      if (contrastRatio < minRatio) {
        issues.push({
          id: `contrast-main-${slide.id}`,
          severity: 'critical',
          title: 'Low Text Contrast (WCAG Failure)',
          description: `Main text contrast ratio is ${contrastRatio.toFixed(2)}:1, which falls below the WCAG 2.1 AA minimum requirement of ${minRatio}:1.`,
          suggestion: 'Switch to a higher-contrast theme or increase text color brightness against the slide background.',
          type: 'contrast',
        });
      }
    }
  }

  // 3. Card Background vs Text Contrast Ratio Check
  if (slide.cards && slide.cards.length > 0 && theme.cardBg && theme.textColor) {
    const cardContrast = getContrastRatio(theme.textColor, theme.cardBg);
    if (cardContrast !== null && cardContrast < 4.0) {
      issues.push({
        id: `contrast-card-${slide.id}`,
        severity: 'warning',
        title: 'Low Card Element Contrast',
        description: `Card background vs text contrast ratio is ${cardContrast.toFixed(2)}:1. Card items may be difficult to read for visually impaired users.`,
        suggestion: 'Ensure card backgrounds contrast strongly against body and heading text.',
        type: 'contrast',
      });
    }
  }

  // 4. Missing Slide Title Structure
  if (!slide.title || slide.title.trim() === '') {
    issues.push({
      id: `heading-${slide.id}`,
      severity: 'critical',
      title: 'Missing Slide Heading (H1)',
      description: 'Slide lacks a primary title. Screen readers rely on slide headings to navigate presentation hierarchy.',
      suggestion: 'Add a clear, descriptive title for this slide.',
      type: 'heading',
      autoFix: (prev) => ({
        ...prev,
        title: 'Untitled Slide Section',
      }),
    });
  }

  // 5. Small Font Size Warning for Presentation View
  if (slide.titleFontSize && slide.titleFontSize < 22) {
    issues.push({
      id: `font-size-title-${slide.id}`,
      severity: 'warning',
      title: 'Title Font Size Too Small',
      description: `Title font size (${slide.titleFontSize}px) is under 22px, making it difficult to read from a distance or on mobile devices.`,
      suggestion: 'Increase slide title font size to at least 24px-36px for optimal audience legibility.',
      type: 'font-size',
      autoFix: (prev) => ({
        ...prev,
        titleFontSize: 28,
      }),
    });
  }

  if (slide.subtitleFontSize && slide.subtitleFontSize < 13) {
    issues.push({
      id: `font-size-subtitle-${slide.id}`,
      severity: 'warning',
      title: 'Subtitle Font Size Small',
      description: `Subtitle font size (${slide.subtitleFontSize}px) is very small.`,
      suggestion: 'Increase subtitle font size to at least 14px.',
      type: 'font-size',
      autoFix: (prev) => ({
        ...prev,
        subtitleFontSize: 16,
      }),
    });
  }

  // 6. Video Captioning & Transcript Check
  if (slide.videoUrl && slide.videoUrl.trim() !== '') {
    if (!slide.mediaCaption || slide.mediaCaption.trim() === '') {
      issues.push({
        id: `video-caption-${slide.id}`,
        severity: 'warning',
        title: 'Missing Video Caption / Audio Description',
        description: 'An embedded video is present without caption summary or accessible audio description.',
        suggestion: 'Provide a media caption or transcript summary in the notes.',
        type: 'video-caption',
        autoFix: (prev) => ({
          ...prev,
          mediaCaption: 'Embedded video presentation with key commentary',
        }),
      });
    }
  }

  // 7. Speaker Notes / Screen Reader Guidance Check
  const hasComplexContent =
    (slide.cards && slide.cards.length >= 3) ||
    (slide.tableRows && slide.tableRows.length >= 3) ||
    (slide.stats && slide.stats.length >= 3);

  if (hasComplexContent && (!slide.speakerNotes || slide.speakerNotes.trim().length < 15)) {
    issues.push({
      id: `speaker-notes-${slide.id}`,
      severity: 'info',
      title: 'Missing Presenter & Screen Reader Notes',
      description: 'This slide contains dense visual components (cards/tables/stats) but has no presenter notes or audio narrative.',
      suggestion: 'Use 1-Tap AI Speaker Notes to auto-generate audio description notes.',
      type: 'speaker-notes',
    });
  }

  return issues;
}
