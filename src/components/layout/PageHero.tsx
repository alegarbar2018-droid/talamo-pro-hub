import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DESIGN_TOKENS, MODULE_THEMES, ModuleTheme } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface StatCard {
  icon: LucideIcon;
  value: string | number;
  label: string;
}

interface PageHeroProps {
  /** Módulo para aplicar tema de colores */
  module: ModuleTheme;
  /** Título principal */
  title: string;
  /** Subtítulo o descripción */
  subtitle?: string;
  /** Fragmento destacado en el subtítulo (opcional) */
  subtitleHighlight?: string;
  /** Badge superior con ícono */
  badge?: {
    icon: LucideIcon;
    text: string;
    pulse?: boolean;
  };
  /** Stats cards a la derecha (opcional) */
  stats?: StatCard[];
  /** Features tags debajo del título (opcional) */
  features?: Array<{
    icon: LucideIcon;
    text: string;
  }>;
  /** Contenido custom adicional */
  children?: React.ReactNode;
  /** Container width override */
  containerWidth?: 'narrow' | 'default' | 'wide';
}

export const PageHero: React.FC<PageHeroProps> = ({
  module,
  title,
  subtitle,
  subtitleHighlight,
  badge,
  stats,
  features,
  children,
  containerWidth = 'default'
}) => {
  const theme = MODULE_THEMES[module];
  const containerClass = DESIGN_TOKENS.container[containerWidth];

  return (
    <div className={cn(
      'relative border-b backdrop-blur-xl overflow-hidden',
      theme.gradient.border,
      theme.gradient.hero,
      DESIGN_TOKENS.spacing.hero.full
    )}>
      {/* Decorative Blobs */}
      <div className={cn(
        'absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30',
        theme.gradient.blob1
      )} />
      <div className={cn(
        'absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-30',
        theme.gradient.blob2
      )} />

      <div className={cn(containerClass, 'relative z-10')}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 lg:gap-8">
          <div className="flex-1 space-y-3 md:space-y-4">
            {/* Badge */}
            {badge && (
              <div className={cn(
                'inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-md',
                theme.badge.bg,
                theme.badge.border,
                theme.badge.shadow,
                'border shadow-sm'
              )}>
                {badge.pulse && (
                  <div className={cn('w-2 h-2 rounded-full animate-pulse', theme.badge.bg)} />
                )}
                <badge.icon className={cn('h-3.5 w-3.5 md:h-4 md:w-4', theme.badge.text)} />
                <span className={cn('text-xs md:text-sm font-medium', theme.badge.text)}>
                  {badge.text}
                </span>
              </div>
            )}

            {/* Title & Subtitle */}
            <div>
              <h1 className={cn(
                DESIGN_TOKENS.typography.hero.h1,
                DESIGN_TOKENS.typography.hero.lineHeight,
                'text-white animate-fade-in'
              )}>
                {title}
              </h1>
              {subtitle && (
                <p className={cn(
                  DESIGN_TOKENS.typography.hero.subtitle,
                  'text-muted-foreground mt-1 md:mt-2 animate-fade-in'
                )} style={{ animationDelay: '0.1s' }}>
                  {subtitle}
                  {subtitleHighlight && (
                    <>
                      {' '}
                      <span className={cn('font-semibold', theme.badge.text)}>
                        {subtitleHighlight}
                      </span>
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Features */}
            {features && features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg backdrop-blur-sm border shadow-sm',
                      theme.badge.bg,
                      theme.badge.border
                    )}
                  >
                    <feature.icon className={cn('w-4 h-4', theme.badge.text)} />
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Custom Children */}
            {children}
          </div>

          {/* Stats Cards */}
          {stats && stats.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className={cn(
                    'backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1',
                    theme.badge.border,
                    theme.badge.bg,
                    'hover:shadow-xl'
                  )}
                >
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className={cn(
                      'p-2 md:p-2.5 rounded-xl w-fit mx-auto mb-2 md:mb-3 shadow-sm',
                      theme.badge.bg,
                      theme.badge.shadow
                    )}>
                      <stat.icon className={cn('h-5 w-5 md:h-6 md:w-6', theme.badge.text)} strokeWidth={2.5} />
                    </div>
                    <p className={cn(
                      'text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent',
                      `from-${theme.primary} to-${theme.secondary}`
                    )}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] md:text-xs font-medium text-muted-foreground tracking-wide uppercase">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
