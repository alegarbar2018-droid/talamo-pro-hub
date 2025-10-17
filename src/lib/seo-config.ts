export const getSEOConfig = (page: string, lang: string = 'es') => {
  const configs: Record<string, Record<string, { title: string; description: string; keywords: string }>> = {
    home: {
      es: {
        title: 'Tálamo Trading - Academia y Señales de Trading Profesional con Exness',
        description: 'Academia de trading profesional, señales verificadas en tiempo real y copy trading con Exness. Aprende trading desde cero o sigue estrategias rentables. Herramientas gratuitas para traders.',
        keywords: 'trading, academia trading, señales forex, copy trading, exness, trading profesional, aprender trading, forex españa, trading latam'
      },
      en: {
        title: 'Tálamo Trading - Professional Trading Academy & Signals with Exness',
        description: 'Professional trading academy, verified real-time signals and copy trading with Exness. Learn trading from scratch or follow profitable strategies. Free tools for traders.',
        keywords: 'trading, trading academy, forex signals, copy trading, exness, professional trading, learn trading, forex'
      },
      pt: {
        title: 'Tálamo Trading - Academia e Sinais de Trading Profissional com Exness',
        description: 'Academia de trading profissional, sinais verificados em tempo real e copy trading com Exness. Aprenda trading do zero ou siga estratégias rentáveis. Ferramentas gratuitas para traders.',
        keywords: 'trading, academia trading, sinais forex, copy trading, exness, trading profissional, aprender trading, forex brasil'
      }
    },
    academy: {
      es: {
        title: 'Academia de Trading Profesional | Cursos Verificados | Tálamo',
        description: 'Aprende trading desde cero con cursos estructurados, verificados y actualizados. Desde conceptos básicos hasta estrategias avanzadas. Certificación incluida.',
        keywords: 'academia trading, curso trading, aprender forex, trading desde cero, cursos trading online, trading profesional españa'
      },
      en: {
        title: 'Professional Trading Academy | Verified Courses | Tálamo',
        description: 'Learn trading from scratch with structured, verified and updated courses. From basic concepts to advanced strategies. Certification included.',
        keywords: 'trading academy, trading course, learn forex, trading from scratch, online trading courses, professional trading'
      },
      pt: {
        title: 'Academia de Trading Profissional | Cursos Verificados | Tálamo',
        description: 'Aprenda trading do zero com cursos estruturados, verificados e atualizados. Desde conceitos básicos até estratégias avançadas. Certificação incluída.',
        keywords: 'academia trading, curso trading, aprender forex, trading do zero, cursos trading online, trading profissional brasil'
      }
    },
    signals: {
      es: {
        title: 'Señales de Trading en Vivo | Análisis Verificado | Tálamo',
        description: 'Señales de trading profesionales en tiempo real con análisis técnico verificado. Seguimiento de operaciones en vivo, estadísticas transparentes y resultados comprobables.',
        keywords: 'señales trading, señales forex, trading señales, señales trading gratis, señales exness, forex signals español'
      },
      en: {
        title: 'Live Trading Signals | Verified Analysis | Tálamo',
        description: 'Professional real-time trading signals with verified technical analysis. Live trade tracking, transparent statistics and verifiable results.',
        keywords: 'trading signals, forex signals, live signals, free trading signals, exness signals, forex signals'
      },
      pt: {
        title: 'Sinais de Trading ao Vivo | Análise Verificada | Tálamo',
        description: 'Sinais de trading profissionais em tempo real com análise técnica verificada. Acompanhamento de operações ao vivo, estatísticas transparentes e resultados comprováveis.',
        keywords: 'sinais trading, sinais forex, trading sinais, sinais trading grátis, sinais exness, forex signals brasil'
      }
    },
    copyTrading: {
      es: {
        title: 'Copy Trading Profesional con Exness | Estrategias Verificadas | Tálamo',
        description: 'Copia automáticamente las estrategias de traders profesionales verificados. Diversificación de cartera, transparencia total y comisiones claras. Compatible con Exness.',
        keywords: 'copy trading, copy trading exness, copiar traders, trading automático, inversión automatizada, social trading'
      },
      en: {
        title: 'Professional Copy Trading with Exness | Verified Strategies | Tálamo',
        description: 'Automatically copy verified professional trader strategies. Portfolio diversification, full transparency and clear commissions. Compatible with Exness.',
        keywords: 'copy trading, copy trading exness, copy traders, automated trading, automated investment, social trading'
      },
      pt: {
        title: 'Copy Trading Profissional com Exness | Estratégias Verificadas | Tálamo',
        description: 'Copie automaticamente as estratégias de traders profissionais verificados. Diversificação de carteira, transparência total e comissões claras. Compatível com Exness.',
        keywords: 'copy trading, copy trading exness, copiar traders, trading automático, investimento automatizado, social trading'
      }
    },
    tools: {
      es: {
        title: 'Calculadoras de Trading Profesionales | Gratis | Tálamo',
        description: 'Herramientas gratuitas de trading: calculadora de tamaño de posición, pip value, margin, profit/loss, risk/reward. Compatibles con todos los pares de Exness.',
        keywords: 'calculadora trading, position size calculator, calculadora forex, herramientas trading gratis, pip calculator, margin calculator'
      },
      en: {
        title: 'Professional Trading Calculators | Free | Tálamo',
        description: 'Free trading tools: position size calculator, pip value, margin, profit/loss, risk/reward. Compatible with all Exness pairs.',
        keywords: 'trading calculator, position size calculator, forex calculator, free trading tools, pip calculator, margin calculator'
      },
      pt: {
        title: 'Calculadoras de Trading Profissionais | Grátis | Tálamo',
        description: 'Ferramentas gratuitas de trading: calculadora de tamanho de posição, pip value, margem, lucro/perda, risco/recompensa. Compatíveis com todos os pares Exness.',
        keywords: 'calculadora trading, calculadora position size, calculadora forex, ferramentas trading grátis, calculadora pip, calculadora margem'
      }
    }
  };

  return configs[page]?.[lang] || configs[page]?.['es'] || configs.home[lang];
};
