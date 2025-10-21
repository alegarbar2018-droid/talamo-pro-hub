/**
 * Sistema de tokens de diseño unificado para Tálamo
 * Base: Sistema de 8pt
 * Versión: 1.0.0
 */

export const DESIGN_TOKENS = {
  // Sistema de espaciado basado en 8pt
  spacing: {
    section: {
      mobile: 'py-8',
      tablet: 'sm:py-12',
      desktop: 'lg:py-16',
      full: 'py-8 sm:py-12 lg:py-16'
    },
    hero: {
      mobile: 'py-12',
      desktop: 'lg:py-16',
      full: 'py-12 lg:py-16'
    },
    card: {
      base: 'p-4 sm:p-6',
      compact: 'p-3 sm:p-4',
      spacious: 'p-6 sm:p-8'
    },
    gap: {
      xs: 'gap-2',
      sm: 'gap-3 sm:gap-4',
      md: 'gap-4 sm:gap-6',
      lg: 'gap-6 sm:gap-8',
      xl: 'gap-8 sm:gap-12'
    }
  },

  // Contenedores y max-width
  container: {
    narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    default: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
    wide: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    full: 'w-full px-4 sm:px-6 lg:px-8'
  },

  // Tipografía con line-heights
  typography: {
    hero: {
      h1: 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight',
      subtitle: 'text-base sm:text-lg font-light',
      lineHeight: 'leading-tight'
    },
    section: {
      h2: 'text-2xl sm:text-3xl font-bold',
      h3: 'text-xl sm:text-2xl font-semibold',
      body: 'text-sm sm:text-base',
      caption: 'text-xs sm:text-sm'
    }
  },

  // Border radius consistente
  radius: {
    card: 'rounded-xl',
    button: 'rounded-lg',
    badge: 'rounded-full',
    input: 'rounded-lg',
    blob: 'rounded-full'
  },

  // Sistema de sombras
  shadow: {
    card: 'shadow-lg',
    cardHover: 'hover:shadow-glow-subtle',
    blob: 'shadow-sm',
    statCard: 'shadow-lg'
  },

  // Tamaños de iconos
  icon: {
    xs: 'h-3 w-3 sm:h-4 sm:w-4',
    sm: 'h-4 w-4',
    md: 'h-5 w-5 sm:h-6 sm:w-6',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  },

  // Transiciones
  transition: {
    default: 'transition-all duration-300',
    fast: 'transition-all duration-200',
    slow: 'transition-all duration-500',
    card: 'transition-all duration-300 hover:-translate-y-1'
  }
} as const;

// Temas por módulo (colores optimizados para coherencia visual)
export const MODULE_THEMES = {
  academy: {
    name: 'Academia',
    primary: 'violet-500',
    secondary: 'purple-600',
    gradient: {
      hero: 'bg-gradient-to-br from-violet-950/50 via-background to-purple-950/40',
      blob1: 'bg-violet-500/25',
      blob2: 'bg-purple-500/25',
      border: 'border-violet-500/15'
    },
    badge: {
      bg: 'bg-violet-500/15',
      border: 'border-violet-500/25',
      text: 'text-violet-400',
      shadow: 'shadow-violet-500/15'
    }
  },
  signals: {
    name: 'Señales',
    primary: 'amber-500',
    secondary: 'orange-500',
    gradient: {
      hero: 'bg-gradient-to-br from-amber-950/50 via-background to-orange-950/40',
      blob1: 'bg-amber-500/25',
      blob2: 'bg-orange-500/25',
      border: 'border-amber-500/15'
    },
    badge: {
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/25',
      text: 'text-amber-400',
      shadow: 'shadow-amber-500/15'
    }
  },
  copy: {
    name: 'Copy Trading',
    primary: 'emerald-500',
    secondary: 'teal-500',
    gradient: {
      hero: 'bg-gradient-to-br from-emerald-950/50 via-background to-teal-950/40',
      blob1: 'bg-emerald-500/25',
      blob2: 'bg-teal-500/25',
      border: 'border-emerald-500/15'
    },
    badge: {
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/25',
      text: 'text-emerald-400',
      shadow: 'shadow-emerald-500/15'
    }
  },
  tools: {
    name: 'Herramientas',
    primary: 'sky-500',
    secondary: 'blue-500',
    gradient: {
      hero: 'bg-gradient-to-br from-sky-950/50 via-background to-blue-950/40',
      blob1: 'bg-sky-500/25',
      blob2: 'bg-blue-500/25',
      border: 'border-sky-500/15'
    },
    badge: {
      bg: 'bg-sky-500/15',
      border: 'border-sky-500/25',
      text: 'text-sky-400',
      shadow: 'shadow-sky-500/15'
    }
  },
  journal: {
    name: 'Diario',
    primary: 'slate-500',
    secondary: 'gray-500',
    gradient: {
      hero: 'bg-gradient-to-br from-slate-950/50 via-background to-gray-950/40',
      blob1: 'bg-slate-500/25',
      blob2: 'bg-gray-500/25',
      border: 'border-slate-500/15'
    },
    badge: {
      bg: 'bg-slate-500/15',
      border: 'border-slate-500/25',
      text: 'text-slate-300',
      shadow: 'shadow-slate-500/15'
    }
  },
  audit: {
    name: 'Auditoría',
    primary: 'indigo-500',
    secondary: 'violet-500',
    gradient: {
      hero: 'bg-gradient-to-br from-indigo-950/50 via-background to-violet-950/40',
      blob1: 'bg-indigo-500/25',
      blob2: 'bg-violet-500/25',
      border: 'border-indigo-500/15'
    },
    badge: {
      bg: 'bg-indigo-500/15',
      border: 'border-indigo-500/25',
      text: 'text-indigo-400',
      shadow: 'shadow-indigo-500/15'
    }
  },
  community: {
    name: 'Comunidad',
    primary: 'cyan-500',
    secondary: 'teal-500',
    gradient: {
      hero: 'bg-gradient-to-br from-cyan-950/50 via-background to-teal-950/40',
      blob1: 'bg-cyan-500/25',
      blob2: 'bg-teal-500/25',
      border: 'border-cyan-500/15'
    },
    badge: {
      bg: 'bg-cyan-500/15',
      border: 'border-cyan-500/25',
      text: 'text-cyan-400',
      shadow: 'shadow-cyan-500/15'
    }
  }
} as const;

export type ModuleTheme = keyof typeof MODULE_THEMES;
