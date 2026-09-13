import { ServiceItem, CaseStudy, BlogPost, HollowmoonOSNode } from '../types';
import postAiWorkflowsImg from '../assets/images/post_ai_workflows_1789261726597.jpg';
import postAppleDesignImg from '../assets/images/post_apple_design_1789261735571.jpg';
import postPanamaBridgeImg from '../assets/images/post_panama_bridge_1789261747259.jpg';

export const servicesData: ServiceItem[] = [
  {
    slug: 'web-design-development',
    title: 'Web Design & Development',
    tagline: 'High-Converting Digital Flagships Crafted with Apple-Level Precision',
    category: 'Engineering & UI/UX',
    icon: 'Layout',
    shortDesc: 'Visually stunning, hyper-fast digital platforms optimized for conversions, sub-second latency, and frictionless user experiences.',
    fullDesc: 'We build digital flagships that do not merely inform—they convert. Combining clean typography, generous negative space, and modern web architectures, each platform is custom-engineered to elevate your brand prestige while maximizing client acquisition.',
    problemSolved: 'Legacy corporate websites with bloated CMS templates, slow load times, and poor conversion rates that fail to reflect modern business standards.',
    features: [
      'Sub-500ms global response times via edge distribution',
      'Glassmorphic, typography-first responsive design',
      'Conversion-Rate Optimization (CRO) baked into layout hierarchy',
      'Automated SEO structured metadata and OpenGraph engines',
      'Headless architecture with instant page transitions'
    ],
    benefits: [
      { title: 'Elevated Brand Authority', desc: 'Command enterprise-tier pricing with a digital presence that outclasses competitors.' },
      { title: 'Higher Lead Velocity', desc: 'Frictionless capture forms and clear conversion pathways that lift conversion rates by 40%+.' },
      { title: 'Zero Maintenance Friction', desc: 'Robust TypeScript architecture built to scale effortlessly without plugin rot.' }
    ],
    process: [
      { step: '01', title: 'Architectural Blueprint', description: 'Auditing user flows, CRO milestones, and content architecture.' },
      { step: '02', title: 'Precision UI/UX Design', description: 'Crafting pixel-perfect design systems, typography hierarchies, and motion gestures.' },
      { step: '03', title: 'Fullstack Engineering', description: 'Next.js/React development with strict type safety, edge caching, and API integration.' },
      { step: '04', title: 'Optimization & Launch', description: 'Lighthouse 99+ audits, automated CDN provisioning, and multi-language verification.' }
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Edge CDN', 'Motion'],
    metrics: [
      { label: 'Avg Page Load', value: '< 340ms' },
      { label: 'Client Conversion Lift', value: '+46%' },
      { label: 'Lighthouse Score', value: '99/100' }
    ],
    deliverable: 'Complete production repository, design tokens, CI/CD pipeline, and 60-day telemetry monitoring.'
  },
  {
    slug: 'app-development',
    title: 'Custom App Development',
    tagline: 'Intelligent Web & Mobile Applications with Native-Grade Performance',
    category: 'Product Engineering',
    icon: 'Smartphone',
    shortDesc: 'Bespoke mobile and web applications built with cross-platform velocity, reactive state management, and enterprise-grade reliability.',
    fullDesc: 'From intuitive client portals to mission-critical operational tools, we engineer applications that simplify complex business workflows into delightful, reliable interactions.',
    problemSolved: 'Fragmented internal software, disconnected spreadsheets, and off-the-shelf SaaS that cannot adapt to unique operational models.',
    features: [
      'Real-time data synchronization with offline-first support',
      'Role-based access control (RBAC) and biometric security',
      'Interactive executive dashboards with instant telemetry',
      'Native iOS/Android and Progressive Web App packaging',
      'Seamless REST and GraphQL backend connections'
    ],
    benefits: [
      { title: 'Empowered Field Teams', desc: 'Enable personnel to update inventory, tasks, and client records on mobile in real time.' },
      { title: 'Unified Data Source', desc: 'Eliminate duplicate data entry across siloed departments.' },
      { title: 'Future-Proof Scalability', desc: 'Modular microservice-ready frontend architecture that grows with your company.' }
    ],
    process: [
      { step: '01', title: 'Domain Modeling', description: 'Mapping core business entities, user roles, and state requirements.' },
      { step: '02', title: 'Component Architecture', description: 'Designing reusable, accessible design systems and interaction patterns.' },
      { step: '03', title: 'Rapid Iteration Engine', description: 'Weekly bi-directional releases with live staging environments for stakeholder reviews.' },
      { step: '04', title: 'Hardened Deployment', description: 'End-to-end testing, security penetration audit, and store certification.' }
    ],
    techStack: ['React Native', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL', 'WebSockets'],
    metrics: [
      { label: 'Task Execution Speed', value: '3.4x faster' },
      { label: 'System Uptime SLA', value: '99.98%' },
      { label: 'User Adoption Rate', value: '94%' }
    ],
    deliverable: 'Tested iOS/Android release builds, administrative web dashboard, and API documentation.'
  },
  {
    slug: 'ai-automation',
    title: 'AI Workflows & Automation',
    tagline: 'Autonomous AI Agents that Eliminate Manual Repetition',
    category: 'Artificial Intelligence',
    icon: 'Cpu',
    shortDesc: 'Replace tedious human data entry, document audits, and routine coordination with autonomous multi-agent pipelines.',
    fullDesc: 'We architect enterprise AI pipelines that ingest unorganized emails, PDFs, manifests, and inquiries—extracting structured intelligence and orchestrating downstream actions across your existing CRM, ERP, and databases automatically.',
    problemSolved: 'Teams drowning in repetitive administrative tasks, manual data extraction, slow response times, and preventable human errors.',
    features: [
      'Autonomous document parsing (invoices, contracts, customs bills)',
      'Multi-agent decision logic with human-in-the-loop safeguards',
      'Direct synchronization with Salesforce, HubSpot, QuickBooks, SAP',
      'Intelligent routing of client inquiries with contextual synthesis',
      'Auditable event trails and automated regression logs'
    ],
    benefits: [
      { title: '70%+ Labor Time Reclaimed', desc: 'Free key operators from clerical busywork to focus on high-margin advisory and growth.' },
      { title: 'Zero Latency Execution', desc: 'Process contracts and client requests in seconds rather than 2-3 business days.' },
      { title: 'Error-Free Consistency', desc: 'Algorithmic precision across every calculation and field mapping.' }
    ],
    process: [
      { step: '01', title: 'Bottleneck Audit', description: 'Identifying manual friction points, repetitive forms, and high-labor cost centers.' },
      { step: '02', title: 'Agent Prompt & Tool Design', description: 'Building domain-specialized AI reasoning prompts with strict validation schemas.' },
      { step: '03', title: 'Pipeline Integration', description: 'Wiring webhooks, message queues, and encrypted data bridges.' },
      { step: '04', title: 'Telemetry & Guardrails', description: 'Enforcing fallback behaviors, rate limits, and audit compliance logging.' }
    ],
    techStack: ['Gemini 2.5/Flash', 'Python/Node', 'Vector DB', 'LangGraph', 'Webhooks', 'Docker'],
    metrics: [
      { label: 'Processing Speed', value: '88% faster' },
      { label: 'Monthly Labor Saved', value: '180+ hours' },
      { label: 'Accuracy Benchmark', value: '99.2%' }
    ],
    deliverable: 'Autonomous agent suite, fail-safe orchestration layer, and self-updating documentation.'
  },
  {
    slug: 'hollowmoon-os',
    title: 'Hollowmoon OS – Intelligent Systems',
    tagline: 'The Unified Operating System for Modern Service Enterprises',
    category: 'Enterprise Infrastructure',
    icon: 'Layers',
    shortDesc: 'A bespoke unified digital operating backbone linking your communications, billing, project execution, and analytics into one intelligent nerve center.',
    fullDesc: 'Hollowmoon OS is not an off-the-shelf subscription tool—it is your private enterprise command center. Custom-crafted around your specific operational workflows, it provides executive clarity, automated milestone tracking, and real-time operational telemetry.',
    problemSolved: 'Paying thousands in disconnected SaaS subscriptions that do not talk to each other, creating blind spots for business leaders.',
    features: [
      'Centralized executive command cockpit with predictive analytics',
      'Automated milestone billing and invoice generation',
      'Internal knowledge base powered by semantic vector search',
      'Client collaboration portal with zero-password magic links',
      'Custom KPI telemetry with automated weekly briefings'
    ],
    benefits: [
      { title: 'Complete Executive Visibility', desc: 'Real-time birds-eye view over projects, cash flow, and team bandwidth.' },
      { title: 'Reduced SaaS Sprawl', desc: 'Consolidate 6+ fragmented tools into a single bespoke operating system.' },
      { title: 'Proprietary Company Asset', desc: 'You own the intellectual property and code entirely, increasing your enterprise valuation.' }
    ],
    process: [
      { step: '01', title: 'Operational X-Ray', description: 'Deep-dive interviews with department leads to uncover undocumented workflows.' },
      { step: '02', title: 'Core Data Modeling', description: 'Consolidating client, project, financial, and document schemas into a single source of truth.' },
      { step: '03', title: 'Bespoke Engine Build', description: 'Deploying custom views, autonomous background workers, and team dashboards.' },
      { step: '04', title: 'Gradual Transition', description: 'Zero-downtime migration, comprehensive team training, and executive handover.' }
    ],
    techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Tailwind', 'Cloud Run'],
    metrics: [
      { label: 'SaaS Cost Reduction', value: '-65%' },
      { label: 'Decision Latency', value: 'Instant' },
      { label: 'Client Satisfaction', value: '4.9/5' }
    ],
    deliverable: 'Full source code ownership, private deployment, unlimited user seats, and maintenance guarantee.'
  },
  {
    slug: 'cloud-infrastructure',
    title: 'Cloud Infrastructure & Scalability',
    tagline: 'Resilient, Zero-Trust Cloud Architectures Engineered for 99.99% Uptime',
    category: 'Cloud Engineering',
    icon: 'Cloud',
    shortDesc: 'Automated CI/CD pipelines, containerized microservices, zero-trust security boundaries, and auto-scaling cloud topologies.',
    fullDesc: 'We architect cloud backbones that never break under traffic surges. Built with strict defense-in-depth protocols, edge acceleration, and automated rollback capabilities, we protect your digital operations 24/7.',
    problemSolved: 'Random server crashes, vulnerability to cyber threats, unoptimized cloud hosting bills, and manual fragile deployments.',
    features: [
      'Multi-region failover and geo-redundant database replication',
      'Zero-Trust network architecture with automated TLS and IAM policies',
      'Automated preview deployments and branch environments',
      'Real-time anomaly detection and incident alerting via Slack/Telegram',
      'Infrastructure as Code (IaC) with reproducible staging'
    ],
    benefits: [
      { title: 'Peace of Mind', desc: 'Sleep soundly knowing enterprise monitoring detects and resolves anomalies automatically.' },
      { title: '30-50% Cloud Cost Savings', desc: 'Eliminate over-provisioned idle resources through intelligent auto-scaling.' },
      { title: 'Instant Deployment Cadence', desc: 'Ship updates in seconds without downtime or broken production code.' }
    ],
    process: [
      { step: '01', title: 'Security & Cost Audit', description: 'Reviewing current cloud configurations, IAM privileges, and monthly spend.' },
      { step: '02', title: 'Architecture Synthesis', description: 'Designing containerized, edge-optimized topology with minimal attack surface.' },
      { step: '03', title: 'IaC & Migration', description: 'Provisioning infrastructure via Terraform/Docker with zero-downtime cutover.' },
      { step: '04', title: '24/7 Observability', description: 'Setting up Grafana/Datadog metrics, error budgeting, and automated alerts.' }
    ],
    techStack: ['Google Cloud', 'Docker', 'Terraform', 'Nginx', 'PostgreSQL', 'Kubernetes'],
    metrics: [
      { label: 'Uptime Reliability', value: '99.99%' },
      { label: 'Deployment Time', value: '< 90 sec' },
      { label: 'Infrastructure Savings', value: '42%' }
    ],
    deliverable: 'Terraform IaC scripts, hardened container images, monitoring dashboards, and disaster recovery plan.'
  }
];

export const caseStudiesData: CaseStudy[] = [
  {
    id: 'omnipanam-maritime',
    title: 'Autonomous Manifest Ingestion & Customs Clearing',
    client: 'OmniPanama Logistics Hub',
    industry: 'Maritime & Global Freight',
    location: 'Panama City & Colon Free Zone',
    summary: 'Automating the parsing of complex bilingual bill-of-lading documents, reducing customs filing latency from 48 hours to under 4 minutes.',
    challenge: 'Dispatch agents spent over 120 hours each week manually keying multimodal freight manifests across English, Spanish, and Chinese PDFs into legacy government systems.',
    solution: 'Engineered a specialized Gemini-powered agent pipeline integrated with Hollowmoon OS to parse raw PDFs, validate tariff classifications, and trigger automated customs submissions.',
    architecture: ['Gemini 2.5 Extraction Agent', 'PostgreSQL Audit Store', 'Custom Node.js Webhook Bus', 'Real-time Operator Approval UI'],
    results: [
      { metric: '94%', label: 'Reduction in Manual Entry' },
      { metric: '3.8 min', label: 'Turnaround (vs 48 hrs)' },
      { metric: '$180,000+', label: 'Annual Operational Savings' }
    ],
    tags: ['AI Agents', 'Document Intelligence', 'Customs Automation'],
    quote: {
      text: 'Hollowmoon transformed our core bottleneck. We expanded throughput by 220% without adding a single headcount in customs processing.',
      author: 'Carlos E. Mendez',
      role: 'Chief Operations Officer, OmniPanama'
    }
  },
  {
    id: 'vitalis-medgroup',
    title: 'Unified Clinic Operations & Patient Triage Engine',
    client: 'Vitalis Medical Network',
    industry: 'Healthcare Services',
    location: 'Central America & Caribbean',
    summary: 'Architecting a patient intake and appointment routing engine across 14 specialist clinics with instant WhatsApp AI booking.',
    challenge: 'Patients faced 15-minute phone queues and disjointed clinic databases, resulting in a 28% no-show rate and lost patient lifetime value.',
    solution: 'Developed a HIPAA-aligned patient communication system with natural language WhatsApp scheduling, automated doctor availability sync, and pre-consultation medical intake questionnaires.',
    architecture: ['WhatsApp Business API', 'Next.js Clinic Portal', 'Real-time Socket Dispatch', 'Cloud Run Serverless Engine'],
    results: [
      { metric: '-68%', label: 'No-Show Rate Drop' },
      { metric: '14,000+', label: 'Monthly Automated Consults' },
      { metric: '4.9/5', label: 'Patient Satisfaction Rating' }
    ],
    tags: ['Web Application', 'Conversational AI', 'Healthcare'],
    quote: {
      text: 'The user experience is so smooth our elderly patients prefer it over calling. Hollowmoon’s attention to Apple-level polish made the adoption instant.',
      author: 'Dr. Sofia Valdes',
      role: 'Medical Director, Vitalis Group'
    }
  },
  {
    id: 'novus-wealth-latam',
    title: 'Bespoke Client Wealth Portal & Regulatory Engine',
    client: 'Novus Wealth Partners',
    industry: 'Private Banking & Wealth Management',
    location: 'Panama & Miami',
    summary: 'A minimalist, high-security client portal delivering sub-second portfolio valuations and automated quarterly compliance reports.',
    challenge: 'High-net-worth clients demanded real-time transparency, while compliance officers were overwhelmed by cross-border regulatory reporting.',
    solution: 'Designed and engineered an ultra-refined web and tablet application in dark mode aesthetic with biometric auth, automated portfolio balance sync, and one-click PDF generation.',
    architecture: ['Next.js 15', 'Tailwind CSS v4', 'Encrypted PostgreSQL', 'Edge Rendering CDN'],
    results: [
      { metric: '< 200ms', label: 'Portfolio Render Latency' },
      { metric: '100%', label: 'Regulatory Compliance Audit Pass' },
      { metric: '$45M+', label: 'New AUM Attracted via Portal' }
    ],
    tags: ['FinTech Portal', 'High Security', 'Apple UI Aesthetic'],
    quote: {
      text: 'Our clients consistently praise the elegance of the interface. Hollowmoon delivered an asset that actively helps us win new private wealth mandates.',
      author: 'Mateo De La Guardia',
      role: 'Managing Partner, Novus Wealth'
    }
  }
];

export const blogPostsData: BlogPost[] = [
  {
    id: 'death-of-unintelligent-saas',
    slug: 'death-of-unintelligent-saas',
    title: 'The Death of Unintelligent SaaS: Why Autonomous Workflows Are Replacing Dashboards',
    excerpt: 'Traditional SaaS sold you a database with buttons. Modern enterprises require autonomous systems that complete tasks rather than just report them.',
    content: [
      'For the past decade, software companies promised efficiency by giving your team another dashboard to stare at. In reality, dashboards merely shifted the burden of data transcription onto already overwhelmed employees.',
      'The new paradigm is Autonomous Execution. Instead of an employee checking a CRM, exporting a CSV, uploading to an ERP, and sending a status email, an intelligent system executes this entire chain in milliseconds.',
      'At Hollowmoon, we view software as an active employee rather than a passive notebook. When your digital systems possess reasoning and tool-calling capabilities, your human team can return to what actually drives enterprise value: client relationships and strategic creativity.'
    ],
    readTime: '4 min read',
    date: 'Sep 2026',
    category: 'AI & Automation',
    author: { name: 'Diego Arango', role: 'Head of Engineering' },
    tags: ['Autonomous AI', 'Architecture', 'Enterprise Ops'],
    featuredImage: postAiWorkflowsImg,
    imageAlt: 'Autonomous AI multi-agent workflow architecture with neural execution pipelines replacing traditional dashboards',
    caption: 'Visualizing multi-agent autonomous decision pipelines connected through zero-latency event buses.',
    keyMetric: { label: 'Manual Ops Eliminated', value: '88%' }
  },
  {
    id: 'sub-100ms-web-architecture',
    slug: 'sub-100ms-web-architecture',
    title: 'Sub-100ms Web Architectures: Engineering the Apple Aesthetic for High-Conversion B2B',
    excerpt: 'How thoughtful typography, optical margins, and edge-first caching create the visceral feeling of luxury and drive higher conversion rates.',
    content: [
      'Speed is not simply a technical metric—it is the foundation of digital respect. When an interface responds instantaneously, users perceive the underlying company as competent, elite, and trustworthy.',
      'Translating the Apple design ethos into web software requires mathematical discipline: strict step ratios in typography, calculated inner/outer border radii, and soft multi-layered shadows that emulate physical studio lighting.',
      'By pairing static generation with reactive edge updates, we eliminate layout shift and latency. The result is an experience that feels as tangible and deliberate as holding polished glass.'
    ],
    readTime: '6 min read',
    date: 'Aug 2026',
    category: 'Design Engineering',
    author: { name: 'Elena Rios', role: 'Design Principal' },
    tags: ['UI/UX', 'Performance', 'Next.js', 'Typography'],
    featuredImage: postAppleDesignImg,
    imageAlt: 'Minimalist luxury digital layout showing typography step ratios and sub-second web architecture',
    caption: 'Apple-grade precision layout engineering: calculated corner curves and sub-100ms edge rendering.',
    keyMetric: { label: 'Median Edge Latency', value: '< 64ms' }
  },
  {
    id: 'modernizing-latam-enterprise',
    slug: 'modernizing-latam-enterprise',
    title: 'Modernizing Latin American Enterprise: The Strategic Advantage of Panama’s Tech Bridge',
    excerpt: 'How Central and South American service businesses are leaping legacy technological debt by adopting modern AI architectures.',
    content: [
      'Latin American commerce is undergoing a rapid generational transition. Family-owned conglomerates and service leaders are replacing legacy paper trails with unified digital command centers.',
      'Panama’s strategic role as the financial and logistical crossroads of the Americas positions it as the ideal testing ground for high-reliability automation. Companies that modernize today will capture the lion’s share of international trade.',
      'The opportunity is not in buying generic US software suites, but in crafting bespoke, localized intelligence systems that respect bilingual workflows and local compliance frameworks.'
    ],
    readTime: '5 min read',
    date: 'Jul 2026',
    category: 'Digital Transformation',
    author: { name: 'Mateo Castillo', role: 'Studio Director' },
    tags: ['Panama', 'LATAM', 'Strategy', 'Growth'],
    featuredImage: postPanamaBridgeImg,
    imageAlt: 'Panama City skyline and maritime logistics canal hub connected via autonomous digital data streams',
    caption: 'Connecting the Americas: Panama as the high-throughput logistics and financial intelligence crossroad.',
    keyMetric: { label: 'Trade Lane Acceleration', value: '4.2x' }
  }
];

export const hollowmoonOSNodes: HollowmoonOSNode[] = [
  {
    id: 'ingestion',
    label: 'Client Ingestion Gateway',
    type: 'input',
    status: 'active',
    description: 'Pipes inbound emails, webhook payloads, mobile app inputs, and PDF manifests.',
    metrics: '1,420 events/min'
  },
  {
    id: 'reasoning',
    label: 'AI Reasoning & Triage Matrix',
    type: 'ai',
    status: 'active',
    description: 'Domain-trained Gemini models classify intent, extract structured schema, and check guardrails.',
    metrics: '99.4% confidence'
  },
  {
    id: 'orchestration',
    label: 'Hollowmoon Dispatch Bus',
    type: 'process',
    status: 'syncing',
    description: 'Asynchronous event orchestrator routing tasks to ERP, CRM, and internal workflows.',
    metrics: '12ms dispatch'
  },
  {
    id: 'data-vault',
    label: 'Secure Enterprise Data Vault',
    type: 'storage',
    status: 'active',
    description: 'PostgreSQL & Vector Store with end-to-end encryption and zero-knowledge storage.',
    metrics: 'Zero data leakage'
  },
  {
    id: 'cockpit',
    label: 'Executive Command Cockpit',
    type: 'output',
    status: 'active',
    description: 'Real-time telemetry, active alerts, revenue velocity, and automated weekly briefings.',
    metrics: 'Sub-second sync'
  }
];

export const siteTranslations = {
  en: {
    nav: {
      services: 'Services',
      os: 'Hollowmoon OS',
      about: 'About',
      caseStudies: 'Case Studies',
      insights: 'Insights',
      contact: 'Contact',
      bookCall: 'Book a Strategy Session',
      searchPrompt: 'Search studio...',
      searchShortcut: '⌘K'
    },
    hero: {
      badge: 'AI-DRIVEN DIGITAL TRANSFORMATION STUDIO',
      titleStart: 'Transform Your Business with',
      titleHighlight: 'Intelligent Digital Systems',
      subtitle: 'We engineer high-performance web platforms, custom applications, and autonomous AI automation pipelines for ambitious service-based enterprises.',
      primaryCta: 'Book a Strategy Session',
      secondaryCta: 'Explore Hollowmoon OS',
      metrics: {
        uptime: 'System Reliability',
        uptimeVal: '99.98%',
        speed: 'Avg Workflow Acceleration',
        speedVal: '3.8x',
        savings: 'Client Labor Saved',
        savingsVal: '$420K+',
        velocity: 'Avg Deployment Sprint',
        velocityVal: '14 Days'
      }
    },
    servicesOverview: {
      eyebrow: 'CORE CAPABILITIES',
      title: 'Precision-Crafted Digital Solutions',
      description: 'We do not sell cookie-cutter templates. Every system is custom engineered to solve your operational bottlenecks and establish industry leadership.',
      viewAll: 'Explore All Services',
      learnMore: 'Explore Capability'
    },
    osSection: {
      eyebrow: 'THE ENTERPRISE NERVE CENTER',
      title: 'Why Hollowmoon OS?',
      description: 'Stop juggling 7 disconnected subscription tools. Hollowmoon OS unifies your client intake, autonomous agent execution, billing, and executive telemetry into one bespoke operating system.',
      interactiveHint: 'Click on any pipeline node to inspect real-time telemetry and operational throughput.'
    },
    roiSection: {
      eyebrow: 'QUANTIFIABLE IMPACT',
      title: 'AI Automation & ROI Calculator',
      description: 'Calculate the immediate monthly capital and hours returned to your business by replacing manual bottlenecks with autonomous pipelines.'
    },
    caseStudiesSection: {
      eyebrow: 'PROVEN OUTCOMES',
      title: 'Featured Enterprise Transformations',
      description: 'Measurable business expansion achieved for market leaders across logistics, healthcare, and wealth management.'
    },
    testimonials: {
      eyebrow: 'CLIENT ENDORSEMENTS',
      title: 'Trusted by Ambitious Business Leaders'
    },
    ctaBanner: {
      title: 'Ready to Modernize Your Operations?',
      subtitle: 'Schedule a 30-minute architectural strategy session with our senior engineers. We will analyze your bottlenecks and provide a tailored system roadmap.',
      button: 'Claim Your Strategy Session'
    },
    footer: {
      description: 'Hollowmoon Digital Studio engineers bespoke digital systems, web flagships, and autonomous AI automation for forward-thinking enterprises in Panama and worldwide.',
      location: 'Panama City • Costa del Este Financial District',
      copyright: '© 2026 Hollowmoon Digital Studio. All rights reserved.',
      status: 'All Core Systems Operational'
    }
  },
  es: {
    nav: {
      services: 'Servicios',
      os: 'Hollowmoon OS',
      about: 'Nosotros',
      caseStudies: 'Casos de Éxito',
      insights: 'Artículos',
      contact: 'Contacto',
      bookCall: 'Sesión Estratégica',
      searchPrompt: 'Buscar en el estudio...',
      searchShortcut: '⌘K'
    },
    hero: {
      badge: 'ESTUDIO DE TRANSFORMACIÓN DIGITAL CON IA',
      titleStart: 'Transforme su Empresa con',
      titleHighlight: 'Sistemas Digitales Inteligentes',
      subtitle: 'Diseñamos plataformas web de alto rendimiento, aplicaciones personalizadas y flujos de automatización autónomos con IA para empresas ambiciosas.',
      primaryCta: 'Agendar Sesión Estratégica',
      secondaryCta: 'Descubrir Hollowmoon OS',
      metrics: {
        uptime: 'Confiabilidad del Sistema',
        uptimeVal: '99.98%',
        speed: 'Aceleración Operativa',
        speedVal: '3.8x',
        savings: 'Ahorro Operativo Generado',
        savingsVal: '$420K+',
        velocity: 'Ciclo Promedio de Entrega',
        velocityVal: '14 Días'
      }
    },
    servicesOverview: {
      eyebrow: 'CAPACIDADES PRINCIPALES',
      title: 'Soluciones Digitales de Alta Precisión',
      description: 'No vendemos plantillas genéricas. Cada sistema se diseña a la medida para erradicar cuellos de botella y consolidar su liderazgo de mercado.',
      viewAll: 'Ver Todos los Servicios',
      learnMore: 'Conocer Más'
    },
    osSection: {
      eyebrow: 'EL CENTRO NEURÁLGICO EMPRESARIAL',
      title: '¿Por qué Hollowmoon OS?',
      description: 'Deje de coordinar 7 herramientas desconectadas. Hollowmoon OS unifica la captación, la ejecución autónoma de agentes, la facturación y la telemetría ejecutiva en un solo sistema operativo.',
      interactiveHint: 'Haga clic en cualquier nodo para inspeccionar la telemetría en tiempo real y la capacidad operativa.'
    },
    roiSection: {
      eyebrow: 'IMPACTO CUANTIFICABLE',
      title: 'Calculadora de ROI y Automatización',
      description: 'Estime las horas y el capital mensual recuperado al sustituir procesos manuales por flujos autónomos inteligentes.'
    },
    caseStudiesSection: {
      eyebrow: 'RESULTADOS COMPROBADOS',
      title: 'Transformaciones Empresariales Destacadas',
      description: 'Impacto medible en líderes de la industria en logística marítima, salud y gestión de patrimonio.'
    },
    testimonials: {
      eyebrow: 'RESPALDO EMPRESARIAL',
      title: 'La Confianza de Líderes de la Industria'
    },
    ctaBanner: {
      title: '¿Listo para modernizar sus operaciones?',
      subtitle: 'Reserve una sesión estratégica de 30 minutos con nuestros ingenieros principales. Evaluaremos sus procesos y entregaremos una hoja de ruta técnica.',
      button: 'Reservar Sesión Estratégica'
    },
    footer: {
      description: 'Hollowmoon Digital Studio crea sistemas digitales a la medida, plataformas web de élite y automatización con IA para empresas de vanguardia en Panamá y el mundo.',
      location: 'Ciudad de Panamá • Distrito Financiero de Costa del Este',
      copyright: '© 2026 Hollowmoon Digital Studio. Todos los derechos reservados.',
      status: 'Todos los Sistemas Operando con Normalidad'
    }
  }
};
