import { Language } from '../../types';
import { AuraMessage, AuraLeadProfile, CroDiagnostic, RecommendedArchitecture, AuraSessionMemory } from './auraTypes';
import { formatMemoryContextForPrompt } from './auraMemoryStorage';

export const initialAuraGreeting = (lang: Language): AuraMessage => ({
  id: 'msg-init-1',
  sender: 'aura',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  category: 'system',
  text:
    lang === 'es'
      ? 'Saludos. Soy AURA, Asesora Ejecutiva de Desarrollo de Negocios e Inteligencia Digital de Hollowmoon Studio. ¿En qué puedo orientar a su empresa hoy? Puedo diagnosticar la tasa de conversión (CRO) de su sitio, estructurar la arquitectura de su próximo sistema o coordinar una sesión estratégica.'
      : 'Greetings. I am AURA, Senior Business Development & Digital Intelligence Director at Hollowmoon Studio. How may I counsel your enterprise today? I can audit your conversion bottlenecks (CRO), architect a custom Hollowmoon OS system, or reserve a private discovery session.',
  suggestedPills:
    lang === 'es'
      ? [
          '⚡ Diagnóstico Rápido de CRO',
          '🎯 Recomendar Arquitectura de Software',
          '🏢 ¿Por qué el Hub de Panamá?',
          '📅 Reservar Sesión de Estrategia',
        ]
      : [
          '⚡ Instant CRO Diagnostic',
          '🎯 Recommend System Architecture',
          '🏢 Why Panama Digital Hub?',
          '📅 Reserve Strategy Session',
        ],
});

export const initialLeadProfile: AuraLeadProfile = {
  companyName: '',
  contactName: '',
  email: '',
  industry: 'Enterprise Logistics & Supply Chain',
  teamSize: '15-50 Members',
  currentBottleneck: 'Clerical manual data reconciliation & legacy monolithic speed drops',
  targetBudget: '$25k - $50k',
  timeline: '4-8 Weeks',
  qualificationScore: 68,
  status: 'exploring',
};

export const defaultCroAudit = (lang: Language, industry = 'Logistics'): CroDiagnostic => {
  if (lang === 'es') {
    return {
      frictionScore: 74,
      conversionPotential: '+38% a +52% de Cierre Comercial',
      estimatedAnnualRecovery: '$148,000 USD',
      speedMultiplier: '3.4x más rápido',
      topBottlenecks: [
        {
          title: 'Latencia Móvil & Core Web Vitals Bloqueados',
          impact: 'Pérdida del 32% de prospectos antes de la primera interacción',
          fix: 'Migración a arquitectura Edge Cloudflare y Next.js estático reactivo',
        },
        {
          title: 'Formularios Monolíticos de 8 Campos',
          impact: 'Tasa de abandono del 58% en cotizaciones B2B',
          fix: 'Formulario conversacional agéntico de 2 pasos con pre-calificación en vivo',
        },
        {
          title: 'Falta de Prueba Social & Telemetría en Vivo',
          impact: 'Tiempo de decisión dilatado en 4.5 semanas adicionales',
          fix: 'Dashboard interactivo de ROI y cálculo de payback transparente',
        },
      ],
    };
  }

  return {
    frictionScore: 74,
    conversionPotential: '+38% to +52% Conversion Velocity',
    estimatedAnnualRecovery: '$148,000 USD',
    speedMultiplier: '3.4x Faster Response',
    topBottlenecks: [
      {
        title: 'Mobile Latency & Render Blocking Assets',
        impact: '32% visitor drop-off before first meaningful paint',
        fix: 'Migrate to Edge-rendered Next.js with sub-600ms LCP guarantee',
      },
      {
        title: '8-Field Monolithic Lead Forms',
        impact: '58% abandonment rate on enterprise quote requests',
        fix: '2-step agentic qualification flow with instant calendar slot locking',
      },
      {
        title: 'Absence of Live Telemetry & Value Proof',
        impact: 'Enterprise evaluation cycles stalled by 4.5 weeks',
        fix: 'Embedded ROI modeler and quantifiable Panama compliance guarantees',
      },
    ],
  };
};

export const defaultRecommendedArchitecture = (lang: Language, industry = 'Logistics'): RecommendedArchitecture => {
  if (lang === 'es') {
    return {
      stackName: 'Hollowmoon OS • Enterprise Autonomous Suite',
      targetIndustry: industry,
      estimatedTimeline: '6 a 9 semanas para producción',
      keyDeliverable: 'Buque insignia web completo, agentes IA autónomos y propiedad total de código',
      modules: [
        {
          name: 'Edge Ingestion Gateway',
          role: 'Captura y validación de tráfico global',
          tech: 'Cloudflare Workers + Next.js Edge',
          benefit: '18ms de latencia media en las Américas',
        },
        {
          name: 'Autonomous Reasoning Engine',
          role: 'Procesamiento de documentos y atención 24/7',
          tech: 'Gemini 3.8 Flash + Python FastAPI Agents',
          benefit: 'Elimina el 75% de tareas clericales repetitivas',
        },
        {
          name: 'Live Executive Cockpit',
          role: 'Métricas de conversión y analítica financiera',
          tech: 'Tailwind CSS v4 + WebSockets en tiempo real',
          benefit: 'Visibilidad ejecutiva instantánea sin costo por asiento',
        },
      ],
    };
  }

  return {
    stackName: 'Hollowmoon OS • Enterprise Autonomous Suite',
    targetIndustry: industry,
    estimatedTimeline: '6 to 9 Weeks to Production Delivery',
    keyDeliverable: 'Full custom digital flagship, autonomous AI agents, and 100% IP code handover',
    modules: [
      {
        name: 'Edge Ingestion Gateway',
        role: 'Global traffic routing & sub-millisecond edge ingest',
        tech: 'Cloudflare Workers + Next.js Edge',
        benefit: '18ms median latency across the Americas',
      },
      {
        name: 'Autonomous Reasoning Engine',
        role: 'Clerical automation & 24/7 lead qualification',
        tech: 'Gemini 3.8 Flash + Python FastAPI Agents',
        benefit: 'Reclaims 75% of repetitive administrative hours',
      },
      {
        name: 'Live Executive Cockpit',
        role: 'Real-time telemetry, lead management & CRO tracking',
        tech: 'Tailwind CSS v4 + Real-Time WebSockets',
        benefit: 'Zero per-seat SaaS licensing tax forever',
      },
    ],
  };
};

// Process user input via server API or client-side fallback
export async function queryAuraConcierge(
  userText: string,
  lang: Language,
  currentProfile: AuraLeadProfile,
  sessionMemory?: AuraSessionMemory
): Promise<{
  reply: string;
  category: 'cs' | 'cx' | 'cro' | 'sales';
  croAudit?: CroDiagnostic;
  recommendedStack?: RecommendedArchitecture;
  leadUpdate?: Partial<AuraLeadProfile>;
  suggestedPills?: string[];
}> {
  // Format memory context if available
  const memoryContext = sessionMemory ? formatMemoryContextForPrompt(sessionMemory) : '';
  const history = sessionMemory?.messages || [];

  // Try server endpoint first
  try {
    const res = await fetch('/api/concierge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: userText,
        lang,
        profile: currentProfile,
        history,
        memoryContext,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return data;
      }
    }
  } catch (err) {
    // Graceful fallback to client engine
    console.debug('Using client intelligence engine for AURA');
  }

  // Client-side intelligent business development engine with Memory Recall
  const lower = userText.toLowerCase();

  // Explicit session recall / recap request
  if (
    lower.includes('recap') ||
    lower.includes('summary') ||
    lower.includes('resumen') ||
    lower.includes('remember') ||
    lower.includes('memoria') ||
    lower.includes('recall') ||
    lower.includes('que hemos') ||
    lower.includes('what did we discuss')
  ) {
    const points = sessionMemory?.recallPoints || [];
    const pointsList = points.length > 0
      ? points.map((p) => `• ${p.topic}: ${p.detail}`).join('\n')
      : (lang === 'es' ? '• Diagnóstico inicial de operaciones y modelo de conversión.' : '• Baseline diagnostic of operations and conversion model.');

    return {
      category: 'cs',
      reply:
        lang === 'es'
          ? `Accediendo a la memoria de sesión de AURA:\n\n${pointsList}\n\nCon base en estos parámetros retenidos para ${currentProfile.companyName || currentProfile.industry}, nuestra recomendación inmediata es formalizar la hoja de ruta en una sesión de 30 minutos.`
          : `Accessing AURA persistent session memory:\n\n${pointsList}\n\nSynthesizing these retained parameters for ${currentProfile.companyName || currentProfile.industry}, our immediate recommendation is locking in an engineering roadmap session.`,
      suggestedPills:
        lang === 'es'
          ? ['📅 Agendar Sesión de 30 min', '⚡ Diagnóstico CRO', '🎯 Ver Arquitectura']
          : ['📅 Book 30-min Strategy Session', '⚡ Run CRO Diagnostic', '🎯 View Architecture'],
      leadUpdate: {
        qualificationScore: Math.min(97, currentProfile.qualificationScore + 6),
      },
    };
  }

  // CRO Diagnostic intent
  if (lower.includes('cro') || lower.includes('conversion') || lower.includes('tasa') || lower.includes('diagnostico') || lower.includes('audit')) {
    const audit = defaultCroAudit(lang, currentProfile.industry);
    return {
      category: 'cro',
      reply:
        lang === 'es'
          ? `He ejecutado el diagnóstico de conversión (CRO) preliminar para su modelo. Identificamos un índice de fricción digital del ${audit.frictionScore}%. La principal fuga de valor ocurre en la latencia móvil y formularios monolíticos. Con una arquitectura optimizada en Hollowmoon OS, proyectamos una recuperación operativa de aproximadamente ${audit.estimatedAnnualRecovery} anuales y una aceleración de ${audit.speedMultiplier}. ¿Desea revisar la arquitectura recomendada o agendar una llamada ejecutiva?`
          : `I have initiated the conversion rate optimization (CRO) audit. We detect an operational friction score of ${audit.frictionScore}%. The primary yield leakage stems from mobile render latency and monolithic multi-step forms. By re-architecting your presence on Hollowmoon OS, we project an annual capital recovery of approximately ${audit.estimatedAnnualRecovery} and ${audit.speedMultiplier}. Would you like to inspect your custom architecture roadmap or lock in a discovery slot?`,
      croAudit: audit,
      suggestedPills:
        lang === 'es'
          ? ['🎯 Ver Arquitectura Recomendada', '📅 Agendar Llamada Ejecutiva', '📊 Simular ROI']
          : ['🎯 View Recommended Stack', '📅 Reserve Strategy Session', '📊 Simulate ROI'],
      leadUpdate: {
        qualificationScore: Math.min(95, currentProfile.qualificationScore + 12),
        status: 'qualified',
      },
    };
  }

  // Architecture / Tech Stack intent
  if (lower.includes('architect') || lower.includes('stack') || lower.includes('tech') || lower.includes('software') || lower.includes('tecnologia') || lower.includes('sistema')) {
    const stack = defaultRecommendedArchitecture(lang, currentProfile.industry);
    return {
      category: 'cx',
      reply:
        lang === 'es'
          ? `Para su operación en ${currentProfile.industry}, nuestra recomendación estándar es el paquete ${stack.stackName}. Combina una pasarela Edge ultra-rápida (18ms), agentes de razonamiento autónomo con IA para automatizar flujos clericales, y un centro de comando ejecutivo sin tarifas por usuario. El plazo estimado de entrega es de ${stack.estimatedTimeline} con entrega total del código fuente. ¿Desea que elabore un resumen de descubrimiento para su junta directiva?`
          : `For your operational footprint in ${currentProfile.industry}, our engineering recommendation is ${stack.stackName}. It bridges an ultra-low latency Edge gateway (18ms), autonomous reasoning AI agents for repetitive paperwork, and a bespoke executive cockpit with zero per-seat licensing fees. Estimated deployment timeline is ${stack.estimatedTimeline} with 100% intellectual property handover. Shall I draft an Executive Brief for your leadership team?`,
      recommendedStack: stack,
      suggestedPills:
        lang === 'es'
          ? ['📝 Generar Brief Ejecutivo', '📅 Reservar Sesión de Arquitectura', '⚡ Diagnóstico CRO']
          : ['📝 Generate Executive Brief', '📅 Book Architecture Session', '⚡ CRO Diagnostic'],
      leadUpdate: {
        qualificationScore: Math.min(98, currentProfile.qualificationScore + 15),
        status: 'qualified',
      },
    };
  }

  // Panama Hub / Compliance / Location intent
  if (lower.includes('panama') || lower.includes('compliance') || lower.includes('soc2') || lower.includes('iso') || lower.includes('seguridad') || lower.includes('security')) {
    return {
      category: 'cs',
      reply:
        lang === 'es'
          ? 'Hollowmoon Studio opera con sede central en la Ciudad de Panamá, un nodo financiero, marítimo y digital de primer orden. Esto nos otorga sincronización horaria perfecta con las Américas, régimen fiscal y regulatorio pro-empresa, y conectividad interoceánica de fibra óptica de latencia mínima. Todos nuestros sistemas cumplen con estándares Zero-Trust, ISO27001 y están preparados para auditorías SOC2.'
          : 'Hollowmoon Studio is headquartered in Panama City, a premier intercontinental financial, maritime, and technological hub. This affords us flawless real-time timezone alignment with North and South America, favorable enterprise regulatory jurisdiction, and subsea fiber interconnectivity. All systems are deployed under Zero-Trust protocols, ISO27001 rigor, and SOC2 audit readiness.',
      suggestedPills:
        lang === 'es'
          ? ['⚡ Diagnóstico CRO', '🎯 Recomendar Arquitectura', '📅 Agendar Auditoría de 30 min']
          : ['⚡ CRO Diagnostic', '🎯 Recommend Architecture', '📅 Book 30-min Strategy Call'],
    };
  }

  // Booking / Schedule intent
  if (lower.includes('book') || lower.includes('schedule') || lower.includes('call') || lower.includes('calendar') || lower.includes('agendar') || lower.includes('reunion') || lower.includes('cita')) {
    return {
      category: 'sales',
      reply:
        lang === 'es'
          ? 'Con gusto coordinamos una sesión de descubrimiento arquitectónico de 30 minutos con nuestros directores de ingeniería. En la pestaña derecha "Gestión & Brief", puede seleccionar el horario que mejor se adapte a su agenda para confirmar su sesión de inmediato y sin fricción.'
          : 'I would be delighted to lock in a complimentary 30-minute Architectural Discovery Session with our engineering partners. On the right "Lead & Brief" panel, you can choose an immediate calendar slot to confirm your booking seamlessly.',
      suggestedPills:
        lang === 'es'
          ? ['📅 Confirmar Horario en Calendario', '📝 Exportar Brief Ejecutivo', '⚡ Diagnóstico CRO']
          : ['📅 Confirm Calendar Slot', '📝 Export Executive Brief', '⚡ Run CRO Diagnostic'],
      leadUpdate: {
        status: 'priority_enterprise',
        qualificationScore: 96,
      },
    };
  }

  // General Business Development & Sales inquiry
  return {
    category: 'sales',
    reply:
      lang === 'es'
        ? 'Entendido. En Hollowmoon nos especializamos en transformar empresas de servicios en potencias digitales de alta velocidad. Eliminamos el software monolítico obsoleto y las suscripciones mensuales infladas mediante flagships a medida con agentes autónomos de IA. ¿Cuál es el principal cuello de botella operativo o reto de conversión que enfrenta su equipo actualmente?'
        : 'Understood. At Hollowmoon, we specialize in modernizing established service organizations into high-velocity digital leaders. We replace bloated legacy software and recurring per-seat SaaS sprawl with custom, lightning-fast digital flagships powered by autonomous AI. What is the primary operational friction or conversion bottleneck your team is currently looking to solve?',
    suggestedPills:
      lang === 'es'
        ? [
            '⚡ Evaluar Cuello de Botella Operativo',
            '🎯 Ver Casos de Estudio Reales',
            '📊 Calcular Retorno de Inversión',
            '📅 Agendar Sesión de Descubrimiento',
          ]
        : [
            '⚡ Audit Operational Friction',
            '🎯 View Case Studies',
            '📊 Calculate Financial ROI',
            '📅 Book Discovery Session',
          ],
    leadUpdate: {
      qualificationScore: Math.min(88, currentProfile.qualificationScore + 8),
    },
  };
}
