import { SOPStyle, TemplateStyleId } from '../types/document';

export const TEMPLATE_STYLES: Record<TemplateStyleId, SOPStyle> = {
  corporate: {
    id: 'corporate',
    name: 'Corporate Professional',
    tagline: 'Clean, authoritative corporate presentation',
    description: 'Crisp corporate document styling with deep cobalt accents, structured headings, professional data tables, and balanced typography.',
    fontFamily: {
      heading: 'font-sans font-semibold tracking-tight',
      body: 'font-sans',
      mono: 'font-mono'
    },
    accentColor: '#1d4ed8', // blue-700
    secondaryColor: '#3b82f6', // blue-500
    headingStyle: 'bar',
    headerFooterStyle: 'classic',
    tableStyle: 'bordered',
    borderAccent: 'border-blue-600',
    badgeStyle: 'soft'
  },
  industrial: {
    id: 'industrial',
    name: 'Industrial',
    tagline: 'High-contrast operational and safety-first layout',
    description: 'Engineered for manufacturing floors, cleanrooms, and chemical processing facilities. Dark neutral palette with high-visibility caution hierarchy.',
    fontFamily: {
      heading: 'font-sans font-bold uppercase tracking-wider',
      body: 'font-sans',
      mono: 'font-mono'
    },
    accentColor: '#0f172a', // slate-900
    secondaryColor: '#f59e0b', // amber-500
    headingStyle: 'boxed',
    headerFooterStyle: 'heavy',
    tableStyle: 'striped',
    borderAccent: 'border-slate-900',
    badgeStyle: 'solid'
  },
  minimal: {
    id: 'minimal',
    name: 'Modern Minimal',
    tagline: 'Pure typographic clarity and generous whitespace',
    description: 'Subtle and elegant aesthetic with zero visual clutter. Ideal for clinical research, biotech startups, and academic lab procedures.',
    fontFamily: {
      heading: 'font-serif font-medium tracking-normal',
      body: 'font-sans font-light',
      mono: 'font-mono'
    },
    accentColor: '#334155', // slate-700
    secondaryColor: '#64748b', // slate-500
    headingStyle: 'minimal',
    headerFooterStyle: 'clean',
    tableStyle: 'minimal',
    borderAccent: 'border-slate-300',
    badgeStyle: 'outline'
  },
  compliance: {
    id: 'compliance',
    name: 'Quality / Compliance',
    tagline: 'Formal ISO / cGMP audit-ready document control',
    description: 'Strict regulatory aesthetic emphasizing traceability, document control headers, formal revision logs, and signature authorization blocks.',
    fontFamily: {
      heading: 'font-sans font-bold tracking-tight',
      body: 'font-sans',
      mono: 'font-mono font-medium'
    },
    accentColor: '#047857', // emerald-700
    secondaryColor: '#059669', // emerald-600
    headingStyle: 'border-bottom',
    headerFooterStyle: 'boxed',
    tableStyle: 'compliance',
    borderAccent: 'border-emerald-700',
    badgeStyle: 'solid'
  },
  technical: {
    id: 'technical',
    name: 'Technical',
    tagline: 'Calibrated blue/gray layout for precision engineering',
    description: 'Designed for analytical instrumentation, calibration protocols, and software-adjacent lab systems with formula-friendly tables and monospace telemetry.',
    fontFamily: {
      heading: 'font-sans font-semibold tracking-tight',
      body: 'font-sans',
      mono: 'font-mono'
    },
    accentColor: '#0284c7', // sky-600
    secondaryColor: '#0ea5e9', // sky-500
    headingStyle: 'underline',
    headerFooterStyle: 'technical',
    tableStyle: 'technical',
    borderAccent: 'border-sky-600',
    badgeStyle: 'soft'
  }
};

export const TEMPLATE_STYLE_LIST: SOPStyle[] = Object.values(TEMPLATE_STYLES);
