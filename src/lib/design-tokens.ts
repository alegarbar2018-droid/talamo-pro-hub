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

// Temas por módulo (colores y gradientes)
export const MODULE_THEMES = {
  academy: {
    name: 'Academia',
    primary: 'purple-500',
    secondary: 'violet-500',
    gradient: {
      hero: 'bg-gradient-to-br from-purple-950/40 via-background to-violet-950/30',
      blob1: 'bg-purple-500/20',
      blob2: 'bg-violet-500/20',
      border: 'border-purple-500/10'
    },
    badge: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      shadow: 'shadow-purple-500/10'
    }
  },
  signals: {
    name: 'Señales',
    primary: 'orange-500',
    secondary: 'amber-500',
    gradient: {
      hero: 'bg-gradient-to-br from-orange-950/40 via-background to-amber-950/30',
      blob1: 'bg-orange-500/20',
      blob2: 'bg-amber-500/20',
      border: 'border-orange-500/10'
    },
    badge: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-400',
      shadow: 'shadow-orange-500/10'
    }
  },
  copy: {
    name: 'Copy Trading',
    primary: 'emerald-500',
    secondary: 'green-500',
    gradient: {
      hero: 'bg-gradient-to-br from-emerald-950/40 via-background to-green-950/30',
      blob1: 'bg-emerald-500/20',
      blob2: 'bg-green-500/20',
      border: 'border-emerald-500/10'
    },
    badge: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      shadow: 'shadow-emerald-500/10'
    }
  },
  tools: {
    name: 'Herramientas',
    primary: 'pink-500',
    secondary: 'rose-500',
    gradient: {
      hero: 'bg-gradient-to-br from-pink-950/40 via-background to-rose-950/30',
      blob1: 'bg-pink-500/20',
      blob2: 'bg-rose-500/20',
      border: 'border-pink-500/10'
    },
    badge: {
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
      text: 'text-pink-400',
      shadow: 'shadow-pink-500/10'
    }
  },
  journal: {
    name: 'Diario',
    primary: 'blue-500',
    secondary: 'cyan-500',
    gradient: {
      hero: 'bg-gradient-to-br from-blue-950/40 via-background to-cyan-950/30',
      blob1: 'bg-blue-500/20',
      blob2: 'bg-cyan-500/20',
      border: 'border-blue-500/10'
    },
    badge: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      shadow: 'shadow-blue-500/10'
    }
  },
  audit: {
    name: 'Auditoría',
    primary: 'indigo-500',
    secondary: 'violet-500',
    gradient: {
      hero: 'bg-gradient-to-br from-indigo-950/40 via-background to-violet-950/30',
      blob1: 'bg-indigo-500/20',
      blob2: 'bg-violet-500/20',
      border: 'border-indigo-500/10'
    },
    badge: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      shadow: 'shadow-indigo-500/10'
    }
  },
  community: {
    name: 'Comunidad',
    primary: 'teal-500',
    secondary: 'cyan-500',
    gradient: {
      hero: 'bg-gradient-to-br from-teal-950/40 via-background to-cyan-950/30',
      blob1: 'bg-teal-500/20',
      blob2: 'bg-cyan-500/20',
      border: 'border-teal-500/10'
    },
    badge: {
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20',
      text: 'text-teal-400',
      shadow: 'shadow-teal-500/10'
    }
  }
} as const;

export type ModuleTheme = keyof typeof MODULE_THEMES;
