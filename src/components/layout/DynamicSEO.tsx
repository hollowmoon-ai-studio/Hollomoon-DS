import React, { useEffect } from 'react';
import { servicesData, caseStudiesData, blogPostsData } from '../../data/sitemapData';
import { Language } from '../../types';

interface DynamicSEOProps {
  currentRoute: string;
  activeSlug?: string;
  lang: Language;
  legalTab?: 'privacy' | 'terms' | 'cookies';
}

interface SEOTagConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogType: string;
  schemaJson: object;
}

const BASE_URL = 'https://hollowmoon.studio';

export const DynamicSEO: React.FC<DynamicSEOProps> = ({
  currentRoute,
  activeSlug,
  lang,
  legalTab,
}) => {
  useEffect(() => {
    const config = getSEOConfig(currentRoute, activeSlug, lang, legalTab);

    // 1. Update Document Title
    document.title = config.title;

    // 2. Helper to safely set meta attribute tags
    const setMetaTag = (selector: string, attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper for link tags (e.g. canonical)
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard meta tags
    setMetaTag('meta[name="description"]', 'name', 'description', config.description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', config.keywords);
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setLinkTag('canonical', config.canonicalUrl);

    // OpenGraph Social Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', config.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', config.description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', config.canonicalUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', config.ogType);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Hollowmoon Digital Studio');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', lang === 'es' ? 'es_PA' : 'en_US');
    setMetaTag('meta[property="og:locale:alternate"]', 'property', 'og:locale:alternate', lang === 'es' ? 'en_US' : 'es_PA');

    // Twitter / X Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', config.title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', config.description);
    setMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', config.canonicalUrl);

    // 3. Inject / Update Dynamic Schema.org JSON-LD
    let scriptTag = document.getElementById('hollowmoon-dynamic-seo') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'hollowmoon-dynamic-seo';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(config.schemaJson, null, 2);
  }, [currentRoute, activeSlug, lang, legalTab]);

  return null;
};

/**
 * Computes deep SEO metadata and structured JSON-LD data for any active view and service.
 */
function getSEOConfig(
  route: string,
  slug: string | undefined,
  lang: Language,
  legalTab?: 'privacy' | 'terms' | 'cookies'
): SEOTagConfig {
  const isEs = lang === 'es';
  const origin = typeof window !== 'undefined' ? window.location.origin : BASE_URL;

  // 1. Service Detail Page
  if (route === 'service-detail') {
    const service = servicesData.find((s) => s.slug === slug) || servicesData[0];
    const canonicalUrl = `${origin}/#service-${service.slug}`;

    const esServiceTitles: Record<string, { title: string; tagline: string; desc: string }> = {
      'web-design-development': {
        title: 'Diseño y Desarrollo Web de Alto Rendimiento',
        tagline: 'Plataformas Digitales de Élite Diseñadas con Precisión Apple',
        desc: 'Desarrollamos flagships web ultrarrápidos con Next.js y TypeScript, optimizados para conversiones y tiempos de carga inferiores a 500ms.',
      },
      'app-development': {
        title: 'Desarrollo de Aplicaciones Móviles y Web a Medida',
        tagline: 'Aplicaciones Inteligentes con Rendimiento Nativo y Sincronización en Tiempo Real',
        desc: 'Ingeniería de software a medida para portales de clientes y operaciones críticas, combinando React Native, Node.js y arquitecturas seguras.',
      },
      'ai-automation': {
        title: 'Automatización y Flujos de Trabajo con IA Autónoma',
        tagline: 'Agentes de Inteligencia Artificial que Eliminan Tareas Manuales Repetitivas',
        desc: 'Implementamos flujos multi-agente con modelos Gemini para extraer datos de documentos, sincronizar ERPs y reducir hasta 70% de carga manual.',
      },
      'hollowmoon-os': {
        title: 'Hollowmoon OS – El Sistema Operativo Inteligente Empresarial',
        tagline: 'Centro Neurálgico Unificado para Empresas de Servicios Modernas',
        desc: 'Unifique captación de clientes, telemetría operativa, agentes de IA y facturación automatizada en un centro de mando privado.',
      },
      'cloud-infrastructure': {
        title: 'Infraestructura Cloud y Escalabilidad Zero-Trust',
        tagline: 'Arquitecturas Cloud Resilientes Diseñadas para 99.99% de Disponibilidad',
        desc: 'Automatice despliegues CI/CD, microservicios en contenedores Docker y políticas de seguridad Zero-Trust en Google Cloud.',
      },
    };

    const esData = esServiceTitles[service.slug];
    const pageTitle = isEs && esData
      ? `${esData.title} | Hollowmoon Digital Studio`
      : `${service.title} – ${service.tagline.slice(0, 48)}... | Hollowmoon Digital Studio`;

    const pageDesc = isEs && esData
      ? esData.desc
      : `${service.shortDesc} ${service.problemSolved.slice(0, 70)}...`;

    const keywords = [
      service.title,
      ...service.techStack,
      service.category,
      'digital transformation',
      'Hollowmoon Digital Studio',
      'AI studio Panama',
      'service modernization',
      ...(isEs ? ['transformación digital Panamá', 'servicios de tecnología', 'desarrollo de software'] : []),
    ].join(', ');

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': canonicalUrl,
      name: service.title,
      alternateName: service.tagline,
      serviceType: service.category,
      description: service.fullDesc,
      category: service.category,
      provider: {
        '@type': 'ProfessionalService',
        name: 'Hollowmoon Digital Studio',
        url: BASE_URL,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Panama City',
          addressRegion: 'Panamá',
          addressCountry: 'PA',
        },
      },
      areaServed: ['Panama', 'Latin America', 'United States', 'Global'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${service.title} Capabilities`,
        itemListElement: service.features.map((feature, idx) => ({
          '@type': 'Offer',
          position: idx + 1,
          itemOffered: {
            '@type': 'Service',
            name: feature,
          },
        })),
      },
      award: service.metrics.map((m) => `${m.label}: ${m.value}`).join(' | '),
    };

    return {
      title: pageTitle,
      description: pageDesc,
      keywords,
      canonicalUrl,
      ogType: 'service',
      schemaJson,
    };
  }

  // 2. Services Overview Page
  if (route === 'services') {
    const canonicalUrl = `${origin}/#services`;
    const title = isEs
      ? 'Servicios y Capacidades Digitales | Hollowmoon Digital Studio'
      : 'Digital Transformation & AI Services | Hollowmoon Digital Studio';
    const description = isEs
      ? 'Descubra nuestras capacidades de élite: Diseño Web, Apps a Medida, Flujos de IA Autónoma, Hollowmoon OS e Infraestructura Cloud.'
      : 'Explore precision digital capabilities: Web Design & Development, Custom Apps, Autonomous AI Workflows, Hollowmoon OS, and Cloud Infrastructure.';
    const keywords = 'digital transformation services, AI automation, custom software, enterprise systems, web engineering, cloud scalability, Panama City';

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: 'Hollowmoon Digital Transformation Services',
      description: 'Comprehensive suite of engineering and artificial intelligence services.',
      itemListElement: servicesData.map((s, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.shortDesc,
          url: `${origin}/#service-${s.slug}`,
        },
      })),
    };

    return { title, description, keywords, canonicalUrl, ogType: 'website', schemaJson };
  }

  // 3. Hollowmoon OS
  if (route === 'os') {
    const canonicalUrl = `${origin}/#os`;
    const title = isEs
      ? 'Hollowmoon OS – El Sistema Operativo Neurálgico Empresarial'
      : 'Hollowmoon OS – Enterprise Command Center & Intelligent Operating System';
    const description = isEs
      ? 'Unifique captación de clientes, telemetría operativa en vivo, agentes de IA y facturación automatizada en un sistema operativo privado.'
      : 'The unified digital operating backbone linking communications, billing, AI agent execution, and real-time operational telemetry into one command center.';
    const keywords = 'Hollowmoon OS, enterprise operating system, AI orchestration, business automation, executive telemetry, SaaS consolidation, intelligent command center';

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': canonicalUrl,
      name: 'Hollowmoon OS',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Cloud-Native',
      softwareVersion: '2.5',
      description,
      featureList: [
        'Client Ingestion Gateway with multi-channel support',
        'AI Reasoning & Intent Matrix using Gemini models',
        'Asynchronous Event Dispatch Bus',
        'Encrypted Enterprise Data Vault (PostgreSQL & Vector Store)',
        'Executive Command Cockpit with real-time operational telemetry',
      ],
      creator: {
        '@type': 'ProfessionalService',
        name: 'Hollowmoon Digital Studio',
        url: BASE_URL,
      },
    };

    return { title, description, keywords, canonicalUrl, ogType: 'product', schemaJson };
  }

  // 4. Case Studies Page
  if (route === 'case-studies') {
    const canonicalUrl = `${origin}/#case-studies`;
    const title = isEs
      ? 'Casos de Éxito y Resultados Empresariales | Hollowmoon Digital Studio'
      : 'Case Studies & Measurable Impact | Hollowmoon Digital Studio';
    const description = isEs
      ? 'Resultados tangibles de modernización con IA en logística marítima, salud y gestión de patrimonio privado.'
      : 'Real-world AI transformations and measurable enterprise outcomes in maritime freight, private banking wealth management, and clinical healthcare.';
    const keywords = 'case studies, AI results, customs automation Panama, healthcare patient triage, wealth management portal, enterprise outcomes';

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      hasPart: caseStudiesData.map((cs) => ({
        '@type': 'Article',
        name: cs.title,
        headline: `${cs.client} – ${cs.summary}`,
        about: cs.industry,
        provider: {
          '@type': 'Organization',
          name: cs.client,
        },
      })),
    };

    return { title, description, keywords, canonicalUrl, ogType: 'website', schemaJson };
  }

  // 5. Blog / Insights Page
  if (route === 'blog') {
    const canonicalUrl = `${origin}/#blog`;
    const title = isEs
      ? 'Artículos y Perspectivas de Ingeniería | Hollowmoon Digital Studio'
      : 'Insights & Technical Perspectives | Hollowmoon Digital Studio';
    const description = isEs
      ? 'Análisis en profundidad sobre flujos de IA autónomos, arquitectura web sub-100ms y la modernización empresarial en América Latina.'
      : 'In-depth engineering articles on autonomous AI workflows, sub-100ms web architectures, and modernizing Latin American enterprise.';
    const keywords = 'engineering blog, autonomous workflows, sub-100ms web, tech insights Panama, AI enterprise, digital modernization LATAM';

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: title,
      description,
      blogPost: blogPostsData.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: '2026-09-01',
        author: {
          '@type': 'Person',
          name: post.author.name,
          jobTitle: post.author.role,
        },
      })),
    };

    return { title, description, keywords, canonicalUrl, ogType: 'website', schemaJson };
  }

  // 6. About Page
  if (route === 'about') {
    const canonicalUrl = `${origin}/#about`;
    const title = isEs
      ? 'Sobre Nosotros – Estudio de Innovación e IA | Hollowmoon Digital Studio'
      : 'About Us – AI-Driven Transformation Studio | Hollowmoon Digital Studio';
    const description = isEs
      ? 'Conozca al equipo de ingenieros y diseñadores detrás de Hollowmoon Digital Studio. Sede en Ciudad de Panamá, creando sistemas de alta precisión a nivel global.'
      : 'Meet the engineering and design collective behind Hollowmoon Digital Studio. Headquartered in Panama City, building high-precision systems globally.';
    const keywords = 'about Hollowmoon, tech studio Panama, AI engineering collective, senior developers, Costa del Este, digital studio';

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: title,
      description,
      mainEntity: {
        '@type': 'ProfessionalService',
        name: 'Hollowmoon Digital Studio',
        url: BASE_URL,
        founder: 'Mateo Castillo',
        location: {
          '@type': 'PostalAddress',
          addressLocality: 'Panama City',
          addressCountry: 'Panama',
        },
      },
    };

    return { title, description, keywords, canonicalUrl, ogType: 'website', schemaJson };
  }

  // 7. Contact Page
  if (route === 'contact') {
    const canonicalUrl = `${origin}/#contact`;
    const title = isEs
      ? 'Agendar Sesión Estratégica de Arquitectura | Hollowmoon Digital Studio'
      : 'Book an Architectural Strategy Session | Hollowmoon Digital Studio';
    const description = isEs
      ? 'Reserve una consulta de 30 minutos con nuestros ingenieros principales para analizar sus procesos y recibir una hoja de ruta técnica personalizada.'
      : 'Schedule a 30-minute consultation with senior engineers to analyze operational bottlenecks and architect a bespoke AI modernization roadmap.';
    const keywords = 'book consultation, AI strategy session, architecture audit, digital transformation meeting, Panama tech consulting';

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: title,
      description,
      mainEntity: {
        '@type': 'ProfessionalService',
        name: 'Hollowmoon Digital Studio',
        url: BASE_URL,
        telephone: '+507-833-9200',
        availableLanguage: ['English', 'Spanish'],
      },
    };

    return { title, description, keywords, canonicalUrl, ogType: 'website', schemaJson };
  }

  // 8. Legal Pages (privacy, terms, cookies)
  if (route === 'legal') {
    const activeTab = legalTab || 'privacy';
    const canonicalUrl = `${origin}/#${activeTab}`;
    const titles = {
      privacy: isEs ? 'Política de Privacidad | Hollowmoon Digital Studio' : 'Privacy Policy | Hollowmoon Digital Studio',
      terms: isEs ? 'Términos de Servicio | Hollowmoon Digital Studio' : 'Terms of Service | Hollowmoon Digital Studio',
      cookies: isEs ? 'Política de Cookies | Hollowmoon Digital Studio' : 'Cookie Policy | Hollowmoon Digital Studio',
    };
    const title = titles[activeTab] || titles.privacy;
    const description = isEs
      ? 'Consulte los términos de servicio, políticas de privacidad y directivas de cookies de Hollowmoon Digital Studio.'
      : 'Review the privacy policy, client terms of engagement, and cookie compliance for Hollowmoon Digital Studio.';

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
    };

    return {
      title,
      description,
      keywords: 'privacy policy, terms of service, compliance, security, Hollowmoon Digital Studio',
      canonicalUrl,
      ogType: 'website',
      schemaJson,
    };
  }

  // 9. Home Default Page
  const canonicalUrl = `${origin}/`;
  const title = isEs
    ? 'Hollowmoon Digital Studio – Transformación Digital Impulsada por IA'
    : 'Hollowmoon Digital Studio – AI-Driven Digital Transformation';
  const description = isEs
    ? 'Estudio de transformación digital con IA que moderniza empresas de servicios mediante desarrollo web, aplicaciones personalizadas y flujos de automatización inteligente.'
    : 'AI-driven digital transformation studio modernizing service-based businesses with AI, automation, and intelligent digital systems.';
  const keywords = 'AI transformation studio, web design and development, custom app development, AI workflows, enterprise automation, Hollowmoon OS, cloud infrastructure, Panama City, digital transformation Latin America';

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${origin}/#organization`,
    name: 'Hollowmoon Digital Studio',
    url: BASE_URL,
    description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Costa del Este Financial District',
      addressLocality: 'Panama City',
      addressRegion: 'Panamá',
      addressCountry: 'PA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 8.9824,
      longitude: -79.5199,
    },
    areaServed: ['Panama', 'United States', 'Latin America', 'Global'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Core Capabilities',
      itemListElement: servicesData.map((s, idx) => ({
        '@type': 'Offer',
        position: idx + 1,
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.shortDesc,
          url: `${origin}/#service-${s.slug}`,
        },
      })),
    },
  };

  return { title, description, keywords, canonicalUrl, ogType: 'website', schemaJson };
}

export default DynamicSEO;
