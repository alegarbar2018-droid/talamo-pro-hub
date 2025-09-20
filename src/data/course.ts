export type LessonDetail = {
  code: string;
  title: string;
  objectives: string[];
  practice: string[];
  evaluation: string[];
};

export type CourseLevel = { 
  level: string; 
  lessons: LessonDetail[]; 
};

export const COURSE: CourseLevel[] = [
  {
    level: "Módulo 0 — Onboarding y Setup",
    lessons: [
      {
        code: "0.1",
        title: "Seguridad y cuentas",
        objectives: [
          "Diferenciar cuenta demo vs real y cuándo migrar",
          "Aplicar 2FA y buenas prácticas de contraseñas",
          "Entender permisos de API y superficies de ataque"
        ],
        practice: [
          "Activar 2FA y actualizar contraseñas",
          "Checklist anti-phishing (correo y enlaces)",
          "Configurar alertas de inicio de sesión"
        ],
        evaluation: [
          "Quiz de 8 preguntas (≥75%)",
          "Checklist firmado en el journal"
        ]
      },
      {
        code: "0.2",
        title: "Puesta a punto de plataforma",
        objectives: [
          "Instalar y elegir plataforma (MT4/MT5/WebTerminal)",
          "Optimizar servidores y ping",
          "Crear layouts, plantillas y watchlists reutilizables"
        ],
        practice: [
          "Medir ping a 3 servidores y elegir el mejor",
          "Guardar 2 plantillas (intradía/swing)",
          "Configurar atajos clave"
        ],
        evaluation: [
          "Entrega de captura de layout",
          "Verificación de latencia registrada en el journal"
        ]
      },
      {
        code: "0.3",
        title: "Journal y plan de riesgo inicial",
        objectives: [
          "Estructurar un diario de operaciones accionable",
          "Definir límites: pérdida diaria y nº de trades",
          "Establecer reglas de pausa (circuit breaker)"
        ],
        practice: [
          "Crear plantilla de journal con campos mínimos",
          "Definir límites concretos (por % y por nº)",
          "Redactar protocolo de pausa y reinicio"
        ],
        evaluation: [
          "Revisión del plan de riesgo",
          "Checklist de activación de pausas"
        ]
      }
    ]
  },
  {
    level: "Nivel 1 — Fundamentos del Trading",
    lessons: [
      {
        code: "1.1",
        title: "El universo del trading",
        objectives: [
          "Distinguir trading vs inversión y sus métricas",
          "Calcular expectativa (E) simple",
          "Entender drawdown y recuperación"
        ],
        practice: [
          "Ejercicio de expectativa con 20 operaciones simuladas",
          "Curva de equity y DD máximo"
        ],
        evaluation: [
          "Quiz (≥70%)",
          "Entrega de hoja de cálculo con E y DD"
        ]
      },
      {
        code: "1.2",
        title: "Ecosistema del bróker",
        objectives: [
          "Comprender ejecución Market vs Instant",
          "Identificar costos: spread, swap, comisiones",
          "Conocer regulación y riesgos operativos"
        ],
        practice: [
          "Comparar costos de dos tipos de cuenta",
          "Simular impacto del spread en 3 estrategias"
        ],
        evaluation: [
          "Tabla comparativa de costos por instrumento"
        ]
      },
      {
        code: "1.3",
        title: "Instrumentos y especificaciones",
        objectives: [
          "Leer contrato, tamaño de lote y valor del pip",
          "Entender horario y volatilidad típica",
          "Calcular margen y stop-out"
        ],
        practice: [
          "Cálculo de valor del pip en XAUUSD y majors",
          "Ejercicio de margen con distintas palancas"
        ],
        evaluation: [
          "Problemas numéricos corregidos (≥80%)"
        ]
      },
      {
        code: "1.4",
        title: "Análisis de mercado",
        objectives: [
          "Dibujar estructura y zonas S/R",
          "Interpretar drivers macro básicos",
          "Medir volatilidad con ATR"
        ],
        practice: [
          "Marcar estructura en 3 timeframes",
          "Calendario y plan ante 2 noticias semanales"
        ],
        evaluation: [
          "Checklist de preparación de sesión"
        ]
      },
      {
        code: "1.5",
        title: "Gestión de riesgo I",
        objectives: [
          "Definir % riesgo por trade",
          "Diseñar SL/TP coherentes con RR",
          "Usar break-even y trailing básicos"
        ],
        practice: [
          "Calcular tamaño de lote por % de cuenta",
          "Simular 30 trades con RR constantes"
        ],
        evaluation: [
          "Hoja de riesgo validada en la calculadora"
        ]
      },
      {
        code: "1.6",
        title: "Psicología básica",
        objectives: [
          "Reconocer sesgos (FOMO, pérdida)",
          "Crear rutinas previas y reglas de inacción",
          "Definir alarmas conductuales"
        ],
        practice: [
          "Diseñar ritual pre-sesión en 5 pasos",
          "Registro de emociones en 10 trades"
        ],
        evaluation: [
          "Revisión del ritual y su cumplimiento"
        ]
      },
      {
        code: "1.7",
        title: "Plan de trading I",
        objectives: [
          "Redactar hipótesis, gatillos y filtros",
          "Definir invalidación objetiva",
          "Crear checklist de entrada/salida"
        ],
        practice: [
          "Escribir 2 setups con criterios claros",
          "Construir checklist de 8 ítems"
        ],
        evaluation: [
          "Revisión del plan por pares (peer review)"
        ]
      },
      {
        code: "1.8",
        title: "Backtesting básico",
        objectives: [
          "Testear sin sobreajustar",
          "Definir muestra mínima y significancia",
          "Registrar resultados correctamente"
        ],
        practice: [
          "Backtest de 100 trades (papel o simulador)",
          "Resumen: PF, RR, tasa de acierto"
        ],
        evaluation: [
          "Reporte de backtest con conclusiones"
        ]
      }
    ]
  },
  {
    level: "Nivel 2 — Intermedio: Operativa y Gestión",
    lessons: [
      { 
        code: "2.1", 
        title: "Estructuras y setups",
        objectives: ["Reconocer breakouts, pullbacks y rangos","Aplicar lectura HTF/LTF","Entender impulso vs contexto"],
        practice: ["Marcar 3 escenarios por tipo","Ejercicio multi-timeframe con triggers"],
        evaluation: ["Checklist de estructura por operación"] 
      },
      { 
        code: "2.2", 
        title: "Gestión de riesgo II",
        objectives: ["Límites diarios/semanales","Dimensionamiento dinámico","Diversificar por correlación"],
        practice: ["Configurar límites duros en la calculadora","Mapa de correlaciones básico"],
        evaluation: ["Plan de límites firmado"] 
      },
      { 
        code: "2.3", 
        title: "Estrategias por activo",
        objectives: ["Adaptar lógica a XAU, petróleo, índices y FX","Elegir ventanas de liquidez"],
        practice: ["Playbook por activo con horarios","Backtest corto por instrumento"],
        evaluation: ["Playbook aprobado"] 
      },
      { 
        code: "2.4", 
        title: "Noticias y eventos",
        objectives: ["Decidir operar/evitar noticias","Gestionar slippage y spread"],
        practice: ["Plan ante NFP/CPI/Fed","Simulación en alta volatilidad"],
        evaluation: ["Post-mortem de evento"] 
      },
      { 
        code: "2.5", 
        title: "Gestión de posiciones",
        objectives: ["Scale-in/out responsable","TP parcial y trailing avanzados"],
        practice: ["Simulación de 3 gestiones en la misma hipótesis"],
        evaluation: ["Comparativa de resultados"] 
      },
      { 
        code: "2.6", 
        title: "Métricas y panel",
        objectives: ["PF, SQN, rachas, varianza","Expected vs Max DD"],
        practice: ["Construir panel con esas métricas"],
        evaluation: ["Informe quincenal con hallazgos"] 
      },
      { 
        code: "2.7", 
        title: "Plan de trading II",
        objectives: ["Playbooks por mercado","Reglas de pausa y recuperación"],
        practice: ["Plan de recuperación tras DD"],
        evaluation: ["Plan validado por mentor/pares"] 
      },
      { 
        code: "2.8", 
        title: "Journal pro",
        objectives: ["Etiquetar errores técnicos/disciplinarios","Hacer postmortems semanales"],
        practice: ["Etiquetar 20 operaciones","Postmortem semanal estructurado"],
        evaluation: ["Evidencia de mejora (2 semanas)"] 
      }
    ]
  },
  {
    level: "Nivel 3 — Profesional",
    lessons: [
      { 
        code: "3.1", 
        title: "Microestructura y liquidez",
        objectives: ["Comprender bid-ask y ejecución","Identificar gaps/rollovers","Optimizar horarios por latencia"],
        practice: ["Mapa de liquidez por sesión","Registro de slippage real"],
        evaluation: ["Informe de microestructura"] 
      },
      { 
        code: "3.2", 
        title: "Modelos cuantitativos ligeros",
        objectives: ["Ajustar expectativa al DD","Separar edge de ruido","Probar fuera de muestra"],
        practice: ["Walk-forward simple","Curva in/out sample"],
        evaluation: ["Reporte con criterios de parada"] 
      },
      { 
        code: "3.3", 
        title: "Portafolio de estrategias",
        objectives: ["Combinar edges no correlacionados","Asignar por riesgo (vol targeting)"],
        practice: ["Matriz de correlación entre estrategias"],
        evaluation: ["Propuesta de asignación"] 
      },
      { 
        code: "3.4", 
        title: "Riesgo institucional",
        objectives: ["VaR simple","Stress testing de escenarios"],
        practice: ["3 escenarios extremos y sus límites"],
        evaluation: ["Documento de límites"] 
      },
      { 
        code: "3.5", 
        title: "Automatización parcial",
        objectives: ["Alertas y semiautomáticos","Reglas de ejecución MT4/5"],
        practice: ["Checklist de falla y contingencias"],
        evaluation: ["Simulacro de fallo con lecciones"] 
      },
      { 
        code: "3.6", 
        title: "Compliance y operación seria",
        objectives: ["Aspectos básicos de regulación","Gestión de terceros (copy)","Ética"],
        practice: ["Checklist de compliance"],
        evaluation: ["Aprobación de compliance (interno)"] 
      },
      { 
        code: "3.7", 
        title: "Escalamiento",
        objectives: ["Aumentar tamaño responsable","Retiros y recapitalización"],
        practice: ["Plan de escalado por hitos"],
        evaluation: ["Revisión de riesgo por hito"] 
      },
      { 
        code: "3.8", 
        title: "Prep. para algorítmico",
        objectives: ["Estandarizar reglas a código","Definir KPIs antes de automatizar"],
        practice: ["Documento de especificación técnica"],
        evaluation: ["Checklist para pasar a L4"] 
      }
    ]
  },
  {
    level: "Nivel 4 — Algorítmico & EAs",
    lessons: [
      { 
        code: "4.1", 
        title: "Introducción a EAs",
        objectives: ["Arquitectura MT4/5","Eventos OnTick/OnTrade","Riesgos"],
        practice: ["Hello-EA sin entradas reales"],
        evaluation: ["Revisión de logs"] 
      },
      { 
        code: "4.2", 
        title: "Estrategia → código",
        objectives: ["Traducir reglas a condiciones","Parámetros y validaciones"],
        practice: ["Pseudocódigo de una estrategia"],
        evaluation: ["Peer review técnico"] 
      },
      { 
        code: "4.3", 
        title: "Backtesting y walk-forward",
        objectives: ["Datos y calidad de modelado","Evitar overfitting"],
        practice: ["WF con 3 ventanas"],
        evaluation: ["Tabla PF/estancamiento"] 
      },
      { 
        code: "4.4", 
        title: "Riesgo automático",
        objectives: ["Límites diarios y lockout","Gestión de lote (sin martingala)"],
        practice: ["Simular lockout y recovery"],
        evaluation: ["Checklist de protecciones"] 
      },
      { 
        code: "4.5", 
        title: "Deploy y monitoreo",
        objectives: ["VPS, logs, alertas","Versionado/rollback"],
        practice: ["Plan de rollback documentado"],
        evaluation: ["Prueba de rollback"] 
      },
      { 
        code: "4.6", 
        title: "Integración con Tálamo",
        objectives: ["Ficha técnica y publicación","Soporte y actualización"],
        practice: ["Plantilla de ficha técnica"],
        evaluation: ["Checklist de publicación"] 
      },
      { 
        code: "4.7", 
        title: "Ética y seguridad",
        objectives: ["Resultados sin promesas","Uso responsable en terceros"],
        practice: ["Redacción de disclaimers"],
        evaluation: ["Aprobación de ética (interno)"] 
      },
      { 
        code: "4.8", 
        title: "Certificación de nivel",
        objectives: ["Proyecto final EA","Criterios mínimos"],
        practice: ["Entrega de EA con guía"],
        evaluation: ["Rubrica de aprobación (≥80%)"] 
      }
    ]
  }
];