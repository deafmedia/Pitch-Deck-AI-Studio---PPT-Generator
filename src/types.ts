export type SlideLayoutType =
  | 'title'
  | 'stats'
  | 'pillars'
  | 'problem_solution'
  | 'market'
  | 'cards'
  | 'table'
  | 'timeline'
  | 'team'
  | 'cta';

export type ThemePresetId = 'modern_dark' | 'corporate_blue' | 'emerald_impact' | 'sunset_purple' | 'warm_editorial';

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  bgColor: string; // e.g. '#0f172a' or '#ffffff'
  textColor: string; // e.g. '#f8fafc' or '#0f172a'
  accentColor: string; // e.g. '#3b82f6'
  secondaryColor: string; // e.g. '#64748b'
  cardBg: string; // e.g. '#1e293b'
  cardBorder: string; // e.g. '#334155'
  fontFamily: string;
}

export interface StatItem {
  value: string;
  label: string;
  sublabel?: string;
}

export interface CardItem {
  tag?: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableRow {
  [key: string]: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
}

export interface TimelineStep {
  period: string;
  title: string;
  description: string;
}

export interface SlideData {
  id: string;
  layout: SlideLayoutType;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  stats?: StatItem[];
  cards?: CardItem[];
  tableColumns?: TableColumn[];
  tableRows?: TableRow[];
  teamMembers?: TeamMember[];
  timelineSteps?: TimelineStep[];
  speakerNotes?: string;
  accentBadge?: string;
}

export interface PitchDeck {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  theme: ThemePresetId;
  slides: SlideData[];
}
