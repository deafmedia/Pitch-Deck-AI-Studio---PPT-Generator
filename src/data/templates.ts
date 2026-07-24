import { PitchDeck, ThemePreset } from '../types';

export const THEME_PRESETS: Record<string, ThemePreset> = {
  modern_dark: {
    id: 'modern_dark',
    name: 'Modern Executive Dark',
    bgColor: '#0f172a',
    textColor: '#f8fafc',
    accentColor: '#38bdf8',
    secondaryColor: '#94a3b8',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  corporate_blue: {
    id: 'corporate_blue',
    name: 'Clean Tech Blue',
    bgColor: '#ffffff',
    textColor: '#0f172a',
    accentColor: '#2563eb',
    secondaryColor: '#475569',
    cardBg: '#f8fafc',
    cardBorder: '#e2e8f0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  emerald_impact: {
    id: 'emerald_impact',
    name: 'Emerald Impact & Social',
    bgColor: '#064e3b',
    textColor: '#ecfdf5',
    accentColor: '#34d399',
    secondaryColor: '#a7f3d0',
    cardBg: '#065f46',
    cardBorder: '#047857',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  sunset_purple: {
    id: 'sunset_purple',
    name: 'Creative Violet',
    bgColor: '#1e1b4b',
    textColor: '#f5f3ff',
    accentColor: '#a855f7',
    secondaryColor: '#c084fc',
    cardBg: '#2e1065',
    cardBorder: '#4c1d95',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  warm_editorial: {
    id: 'warm_editorial',
    name: 'Warm Editorial & Minimal',
    bgColor: '#fdfbf7',
    textColor: '#1c1917',
    accentColor: '#d97706',
    secondaryColor: '#78716c',
    cardBg: '#f5f0eb',
    cardBorder: '#e7e5e4',
    fontFamily: 'Georgia, serif',
  },
};

export const SAMPLE_DECKS: PitchDeck[] = [
  {
    id: 'def-demo-ux',
    title: 'DEF Demo — UX Design Brief & Platform Pitch',
    subtitle: 'Deaf-First Membership Network & Emergency VRS Platform for India',
    author: 'DEF Product Design Team',
    category: 'Non-Profit / Accessibility Platform',
    theme: 'corporate_blue',
    slides: [
      {
        id: 'def-1',
        layout: 'title',
        eyebrow: 'DEF DEMO · UX DESIGN BRIEF & PLATFORM PITCH',
        title: 'Deaf-First Digital Identity & Safety Network',
        subtitle: 'Comprehensive UX design concepts and multi-role operations for a nationwide deaf-first platform across India.',
        bullets: [
          'Unified digital membership card with instant QR verification',
          'First-class emergency SOS & Live Video Relay Service (VRS)',
          'Multi-tenant workspace for Members, Admins, CAs, and Interpreters',
          'Full-bleed visual CMS with Indian Sign Language (ISL) guidance'
        ],
        speakerNotes: 'Welcome the stakeholders. Introduce DEF as a deaf-first digital ecosystem connecting members, ISL interpreters, and admin operations.',
        accentBadge: 'DEAF-FIRST UX'
      },
      {
        id: 'def-2',
        layout: 'stats',
        eyebrow: 'EXECUTIVE NORTH STAR',
        title: 'Platform Scope & Core Impact Metrics',
        subtitle: 'Key scale numbers driving the DEF ecosystem architecture and operational readiness.',
        stats: [
          { value: '90', label: 'Pages in Scope', sublabel: 'CMS, Auth, Member, Admin, Field' },
          { value: '6', label: 'Concept Pillars', sublabel: 'Visual-first design principles' },
          { value: '8', label: 'Interaction Patterns', sublabel: 'Standardized UI modules' },
          { value: '2', label: 'Visual Systems', sublabel: 'Marketing CMS & Calm App Shell' }
        ],
        bullets: [
          'One identity, many roles: Digital wallet card with instant QR verification',
          'Emergency SOS triggers nearest ISL interpreter dispatch within seconds',
          'Role-gated doors prevent interface noise for specialized operators'
        ],
        speakerNotes: 'Highlight that 90 pages are already architected into clean, modular interaction flows.',
        accentBadge: 'NORTH STAR METRICS'
      },
      {
        id: 'def-3',
        layout: 'pillars',
        eyebrow: 'FOUNDATIONAL ARCHITECTURE',
        title: 'The 6 Deaf-First Design Pillars',
        subtitle: 'Interaction principles guiding every viewport, modal, and alert across all 90 screens.',
        cards: [
          {
            tag: 'PILLAR 1',
            title: 'See First, Hear Never Required',
            description: 'Visual status, clear captions, ISL video clips, and haptic vibration replace audio-only prompts.',
            highlight: true
          },
          {
            tag: 'PILLAR 2',
            title: 'Prove Identity in One Glance',
            description: 'Digital wallet pass with active color status, expiry date, and secure verification QR.',
            highlight: false
          },
          {
            tag: 'PILLAR 3',
            title: 'Role Chooses the Door',
            description: 'Portal chooser splits Members, Admins, CAs, Affiliations, and Interpreters cleanly.',
            highlight: false
          },
          {
            tag: 'PILLAR 4',
            title: 'Lifecycle is Always Visible',
            description: 'Status steppers show real-time progress for application, payment, approval, and renewal.',
            highlight: false
          },
          {
            tag: 'PILLAR 5',
            title: 'Emergency is First-Class UX',
            description: 'SOS FAB triggers live map, nearest interpreter routing, and VRS video stage.',
            highlight: true
          },
          {
            tag: 'PILLAR 6',
            title: 'Two Skins, One Brand',
            description: 'Bright high-converting public CMS paired with calm, slate-dense operational app shells.',
            highlight: false
          }
        ],
        speakerNotes: 'Emphasize Pillar 1 and Pillar 5 as the unique differentiators that make this platform accessible.',
        accentBadge: '6 PILLARS'
      },
      {
        id: 'def-4',
        layout: 'cards',
        eyebrow: 'AUDIENCE SURFACES',
        title: 'Tailored Interfaces for Every Role',
        subtitle: 'Dedicated workspaces designed around exact operational jobs-to-be-done.',
        cards: [
          {
            tag: 'PUBLIC CMS',
            title: 'High-Conversion Marketing & Path Chooser',
            description: 'Full-bleed story hero, interactive plan comparisons, and ISL video demo studios.',
            highlight: false
          },
          {
            tag: 'MEMBER PORTAL',
            title: 'Digital Card Wallet & Emergency SOS',
            description: 'Wallet-first home card, 1-click renewal checkout, courses, job board, and SafeDIAI SOS.',
            highlight: true
          },
          {
            tag: 'ADMIN & CA',
            title: 'Unified Operations & Audit Heatmaps',
            description: 'KPI summary strips, filterable member tables, state-wise compliance maps, and batch approvals.',
            highlight: false
          },
          {
            tag: 'INTERPRETER & FIELD',
            title: 'VRS Dispatch Console & Gate Verify',
            description: 'Live emergency call claims, availability toggle, and full-screen event gate scanner.',
            highlight: true
          }
        ],
        speakerNotes: 'Discuss how each audience receives a custom-fit workspace without confusing administrative crossover.',
        accentBadge: 'WORKSPACES'
      },
      {
        id: 'def-5',
        layout: 'timeline',
        eyebrow: 'EMERGENCY PROTOCOL',
        title: 'SafeDIAI Emergency & VRS Dispatch Flow',
        subtitle: 'Sub-second emergency activation chain connecting deaf members to live sign-language interpreters.',
        timelineSteps: [
          { period: 'STEP 01', title: 'Member Triggers SOS FAB', description: 'One tap or hold on persistent SOS button captures current GPS location and sends alert.' },
          { period: 'STEP 02', title: 'Auto-Routing to Nearest Interpreter', description: 'System alerts on-duty ISL interpreters with distance, member profile, and situation notes.' },
          { period: 'STEP 03', title: 'Live VRS Video Stage Established', description: 'Claiming interpreter opens 2-way video stream with real-time text chat and admin oversight.' },
          { period: 'STEP 04', title: 'Resolution & Audit Logged', description: 'Emergency contacts notified, location history logged, and incident report archived securely.' }
        ],
        speakerNotes: 'Explain the critical role of low-latency video relay services in emergency situations.',
        accentBadge: 'SOS PROTOCOL'
      },
      {
        id: 'def-6',
        layout: 'table',
        eyebrow: 'STANDARDIZED UI PATTERNS',
        title: 'Reusable Interaction Pattern Matrix',
        subtitle: 'Consistent visual components deployed across all 90 pages for speed and clarity.',
        tableColumns: [
          { key: 'pattern', label: 'Pattern Name' },
          { key: 'concept', label: 'Design Concept & Specs' },
          { key: 'usage', label: 'Primary Page Scope' }
        ],
        tableRows: [
          { pattern: 'Progress Wizard', concept: 'One job per step, ARIA progressbar, sticky action bar + ISL fail clips', usage: 'Register, Donate, Renew' },
          { pattern: 'Wallet Card', concept: 'Phone-framed pass: status badge, QR code reverse, PDF/PVC download', usage: 'Member ID, Interpreter ID' },
          { pattern: 'Ops Console', concept: 'KPI strip → ModuleTabNav → filterable data table with row actions', usage: 'Admin, CA Workspace, Finance' },
          { pattern: 'VRS Stage', concept: 'Stripped chrome: map, video stream, large high-contrast claim CTA', usage: 'Emergency Console' },
          { pattern: 'Trust Verify', concept: 'Public URL/QR scan → Fullscreen Valid/Invalid badge with photo snapshot', usage: 'Public Verification, Gate Duty' }
        ],
        speakerNotes: 'Walk through the pattern library to show modular reusability in frontend development.',
        accentBadge: 'UI PATTERNS'
      },
      {
        id: 'def-7',
        layout: 'problem_solution',
        eyebrow: 'VALUE PROPOSITION',
        title: 'Solving Accessibility Barriers at Scale',
        subtitle: 'Bridging the gap between traditional non-profit administration and modern deaf-first digital services.',
        bullets: [
          'TRADITIONAL PAIN: Voice-only helplines and call centers exclude deaf individuals during critical emergencies.',
          'DEF SOLUTION: 1-Tap SOS FAB routes directly to live Video Relay Services (VRS) with Indian Sign Language interpreters.',
          'TRADITIONAL PAIN: Paper identity cards take weeks to process, get lost, and lack instant verification.',
          'DEF SOLUTION: Instant digital QR wallet card with real-time status color, expiration tracking, and PVC order options.',
          'TRADITIONAL PAIN: Fragmented communication across chapters without centralized audit trails.',
          'DEF SOLUTION: Multi-role portal uniting Members, Affiliated Chapters, Chartered Accountants, and Admins.'
        ],
        speakerNotes: 'Contrast old legacy systems with the DEF digital transformation.',
        accentBadge: 'PROBLEM / SOLUTION'
      },
      {
        id: 'def-8',
        layout: 'cards',
        eyebrow: 'ROADMAP & BACKLOG',
        title: 'Immediate Opportunity Backlog',
        subtitle: 'High-impact product features prioritized for upcoming release cycles.',
        cards: [
          { tag: 'HIGH PRIORITY', title: 'Wallet-First Member Home', description: 'Position digital identity card at top of member dashboard with dynamic status updates.', highlight: true },
          { tag: 'HIGH PRIORITY', title: 'ISL Guidance Tooltips', description: 'Embed short 3-second ISL video clips next to complex form fields for clarity.', highlight: true },
          { tag: 'MEDIUM PRIORITY', title: 'Dashboard "Today Queue"', description: 'Actionable approval strip on admin home showing pending memberships and alerts.', highlight: false },
          { tag: 'MEDIUM PRIORITY', title: 'Fullscreen Gate Scanner', description: 'High-contrast 2-meter readable verification banner for event security staff.', highlight: false }
        ],
        speakerNotes: 'Review execution priorities for engineering sprint planning.',
        accentBadge: 'RELEASE PLAN'
      },
      {
        id: 'def-9',
        layout: 'cta',
        eyebrow: 'BUILD & DEPLOYMENT',
        title: 'Ready for Platform Rollout',
        subtitle: 'Complete design architecture, page inventory, and UI patterns available for immediate export.',
        bullets: [
          'Download complete PowerPoint presentation (.pptx) formatted with native tables and cards',
          'Export PDF documentation & JSON data structure for developer handoff',
          'Deploy web application with full offline accessibility support and live Gemini AI deck builder'
        ],
        speakerNotes: 'Conclude presentation and invite questions from leadership.',
        accentBadge: 'EXPORT & DOWNLOAD'
      }
    ]
  },
  {
    id: 'ai-saas-pitch',
    title: 'NexusAI — Autonomous Enterprise AI Pitch Deck',
    subtitle: 'Next-Generation AI Agent Platform for Enterprise Workflows',
    author: 'NexusAI Founders',
    category: 'AI / SaaS / B2B Enterprise',
    theme: 'modern_dark',
    slides: [
      {
        id: 'saas-1',
        layout: 'title',
        eyebrow: 'SERIES A INVESTMENT OPPORTUNITY',
        title: 'NexusAI: Autonomous Enterprise Workflows',
        subtitle: 'Empowering global enterprises with self-healing, multi-agent AI automation that cuts operational costs by 65%.',
        bullets: [
          '$4.2M ARR achieved in 12 months with 280% YoY growth',
          'Serving 120+ Fortune 2000 enterprise customers',
          'Proprietary agentic memory & multi-modal reasoning engine',
          'Requesting $15M Series A for global market expansion'
        ],
        speakerNotes: 'State vision clearly: NexusAI replaces complex manual enterprise workflows with resilient AI agent teams.',
        accentBadge: 'SERIES A'
      },
      {
        id: 'saas-2',
        layout: 'stats',
        eyebrow: 'MARKET OPPORTUNITY',
        title: 'Massive $120B Enterprise Automation TAM',
        subtitle: 'Enterprise software is shifting from passive SaaS dashboards to autonomous AI execution.',
        stats: [
          { value: '$120B', label: 'Total Addressable Market', sublabel: 'Enterprise AI automation by 2028' },
          { value: '65%', label: 'Cost Reduction', sublabel: 'Average customer ROI within 60 days' },
          { value: '99.4%', label: 'Task Accuracy', sublabel: 'Benchmark accuracy across complex workflows' },
          { value: '142%', label: 'Net Revenue Retention', sublabel: 'Strong land-and-expand trajectory' }
        ],
        bullets: [
          'Legacy RPA tools require brittle scripts that break with every UI change',
          'NexusAI agents reason visually, parse multi-modal docs, and self-heal automatically'
        ],
        speakerNotes: 'Focus on market size and compelling unit economics.',
        accentBadge: 'MARKET SIZE'
      },
      {
        id: 'saas-3',
        layout: 'problem_solution',
        eyebrow: 'THE PROBLEM & SOLUTION',
        title: 'From Fragile Workflows to Resilient Agents',
        subtitle: 'How NexusAI transforms enterprise productivity with zero-code AI orchestration.',
        bullets: [
          'THE PROBLEM: Legacy automation platforms break constantly, requiring army of consultants to maintain.',
          'NEXUS SOLUTION: Self-correcting AI agents that adapt dynamically to changing APIs and visual interfaces.',
          'THE PROBLEM: Enterprise data remains trapped in legacy silos with strict compliance requirements.',
          'NEXUS SOLUTION: SOC2 Type II & HIPAA compliant local vector database integration with zero data retention.'
        ],
        speakerNotes: 'Highlight why incumbent solutions fail and why NexusAI wins.',
        accentBadge: 'CORE VALUE'
      },
      {
        id: 'saas-4',
        layout: 'cards',
        eyebrow: 'PRODUCT CAPABILITIES',
        title: 'The Nexus AI Orchestration Suite',
        subtitle: 'Four core modules delivering end-to-end operational intelligence.',
        cards: [
          { tag: 'MODULE 1', title: 'Visual Workflow Builder', description: 'Drag-and-drop agent setup with real-time browser & API execution previews.', highlight: true },
          { tag: 'MODULE 2', title: 'Agentic Memory Store', description: 'Persistent semantic graph database providing long-term context retention.', highlight: false },
          { tag: 'MODULE 3', title: 'Guardrails & Compliance', description: 'Real-time PII redactor, hallucination filter, and human-in-the-loop approvals.', highlight: true },
          { tag: 'MODULE 4', title: 'Enterprise Connectors', description: 'Pre-built native integrations for SAP, Salesforce, Jira, Snowflake, and Zendesk.', highlight: false }
        ],
        speakerNotes: 'Walk through product demo features and safety guardrails.',
        accentBadge: 'PLATFORM'
      },
      {
        id: 'saas-5',
        layout: 'table',
        eyebrow: 'COMPETITIVE MATRIX',
        title: 'Why NexusAI Leads the Market',
        subtitle: 'Feature-by-feature comparison against legacy RPA and point-solution AI wrappers.',
        tableColumns: [
          { key: 'feature', label: 'Feature / Capability' },
          { key: 'nexus', label: 'NexusAI' },
          { key: 'legacy', label: 'Legacy RPA' },
          { key: 'point', label: 'Point AI Wrappers' }
        ],
        tableRows: [
          { feature: 'Autonomous Self-Healing', nexus: 'Yes (Real-time)', legacy: 'No (Breaks on UI edit)', point: 'Partial' },
          { feature: 'Multi-Modal Reasoning', nexus: 'Native (Vision + Audio)', legacy: 'Text Only', point: 'Text Only' },
          { feature: 'On-Prem / Private Cloud', nexus: 'Supported', legacy: 'Complex Setup', point: 'Cloud Only' },
          { feature: 'Deployment Time', nexus: '2 Days', legacy: '3-6 Months', point: '1 Week' },
          { feature: 'Enterprise Security (SOC2)', nexus: 'Certified', legacy: 'Certified', point: 'In Progress' }
        ],
        speakerNotes: 'Show our moat and technical defensibility against incumbents.',
        accentBadge: 'MOAT'
      },
      {
        id: 'saas-6',
        layout: 'cta',
        eyebrow: 'THE INVESTMENT ASK',
        title: 'Raising $15M Series A',
        subtitle: 'Accelerating enterprise sales, expanding R&D, and launching global partner ecosystem.',
        bullets: [
          '50% Sales & Go-To-Market expansion in North America & Europe',
          '35% Core AI R&D (Next-Gen Reasoning & Multi-Modal Models)',
          '15% Customer Success & Global Operations Infrastructure',
          'Targeting $15M ARR within 18 months of funding'
        ],
        speakerNotes: 'Conclude with explicit use of funds and financial milestone projections.',
        accentBadge: 'SERIES A ASK'
      }
    ]
  },
  {
    id: 'impact-grant-pitch',
    title: 'GreenEarth — Climate Resilience Pitch Deck',
    subtitle: 'Community-Driven Reforestation & Carbon Credit Platform',
    author: 'GreenEarth Non-Profit Foundation',
    category: 'Social Impact / CleanTech / Grant',
    theme: 'emerald_impact',
    slides: [
      {
        id: 'imp-1',
        layout: 'title',
        eyebrow: 'GRANT & IMPACT PITCH DECK',
        title: 'GreenEarth: Verifiable Community Reforestation',
        subtitle: 'Scaling biodiverse tree planting with satellite AI monitoring and direct indigenous farmer payouts.',
        bullets: [
          '2.4 Million native trees planted across 14 vulnerable ecosystems',
          'Direct livelihood support for 8,500 rural farming families',
          'Real-time satellite & drone carbon verification transparent on ledger',
          'Seeking $2.5M strategic grant to expand to 5 new regions'
        ],
        speakerNotes: 'Introduce GreenEarth mission and measurable ecological impact.',
        accentBadge: 'GRANT PITCH'
      },
      {
        id: 'imp-2',
        layout: 'stats',
        eyebrow: 'CLIMATE IMPACT NUMBERS',
        title: 'Quantifiable Ecological & Social Outcomes',
        subtitle: 'Rigorous satellite-tracked climate restoration metrics achieved to date.',
        stats: [
          { value: '2.4M', label: 'Trees Planted', sublabel: '88% 3-year survival rate' },
          { value: '450K', label: 'Tons CO2 Sequestered', sublabel: 'Independently audited' },
          { value: '$1.8M', label: 'Direct Farmer Income', sublabel: 'Paid directly via mobile money' },
          { value: '14', label: 'Restored Regions', sublabel: 'Biodiversity corridors reconnected' }
        ],
        bullets: [
          'Satellite imagery verifies forest canopy cover every 14 days',
          'Smart contracts trigger automated payments when trees reach growth milestones'
        ],
        speakerNotes: 'Highlight survival rates and direct financial impact on local communities.',
        accentBadge: 'IMPACT METRICS'
      },
      {
        id: 'imp-3',
        layout: 'cards',
        eyebrow: 'PROGRAM PILLARS',
        title: 'Four Pillars of Sustainable Reforestation',
        subtitle: 'Combining indigenous ecological wisdom with modern geospatial technology.',
        cards: [
          { tag: 'PILLAR 1', title: 'Community Seed Nurseries', description: 'Empowering local women cooperatives to raise native saplings.', highlight: true },
          { tag: 'PILLAR 2', title: 'Geospatial AI Monitoring', description: 'High-resolution satellite imagery tracks biomass density and tree health.', highlight: false },
          { tag: 'PILLAR 3', title: 'Direct Mobile Financial Payouts', description: 'Zero-fee digital wallets pay farmers for maintenance and tree stewardship.', highlight: true },
          { tag: 'PILLAR 4', title: 'Corporate Carbon Offsets', description: 'Verifiable high-integrity carbon credits sold to Fortune 500 ESG funds.', highlight: false }
        ],
        speakerNotes: 'Walk through how the business model sustains long-term tree growth.',
        accentBadge: 'METHODOLOGY'
      },
      {
        id: 'imp-4',
        layout: 'cta',
        eyebrow: 'GRANT APPLICATION',
        title: 'Join Us in Restoring 10 Million Trees',
        subtitle: 'Your grant support directly funds sapling propagation, satellite tech, and community livelihoods.',
        bullets: [
          '82% of all grant funds go directly to ground operations and farmer stipends',
          'Transparent open-source impact dashboard with live GPS photo updates',
          'Full tax-exempt 80G / 501(c)(3) compliance documentation'
        ],
        speakerNotes: 'Thank grant committee and share contact details.',
        accentBadge: 'SUPPORT OUR MISSION'
      }
    ]
  }
];
