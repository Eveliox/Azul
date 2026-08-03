// Bilingual content for Azul. Miami/Latin American Spanish, professional "usted" register.
// All user-facing strings live here so the LanguageToggle can flip between EN and ES cleanly.

export const content = {
  en: {
    announcement: {
      long: '🎉 Founding Client Offer. First 10 Miami businesses get the Growth Suite at',
      short: '🎉 Founding Offer:',
      priceHighlight: '$399/mo locked for life',
      trailingLong: 'Only a few spots left →',
      trailingShort: '→',
    },
    nav: {
      solutions: 'Solutions',
      pricing: 'Pricing',
      industries: 'Industries',
      howItWorks: 'How It Works',
      contact: 'Contact',
      bookDemo: 'Book Free Demo',
      toggleMenu: 'Toggle menu',
    },
    hero: {
      badge: 'AI Growth System for Miami Home Services · English + Español',
      headline: ['Get More', 'Customers,', 'Reviews, And', 'Booked Jobs.'],
      subtitle:
        'Azul helps South Florida roofers, HVAC pros, and home service businesses get found online, answer every call, and turn happy customers into 5-star reviews. All in one bilingual growth system.',
      ctaPrimary: 'Book a Free Demo',
      ctaSecondary: 'See Growth Plans',
      trust: [
        'Bilingual delivery',
        'Built for local biz',
        'No long contracts',
        'Setup in days',
      ],
      dashboard: {
        title: 'Azul Growth Dashboard',
        live: 'Live',
        stats: [
          { label: 'New Leads', value: '47', delta: '+12 this week' },
          { label: 'Calls Recovered', value: '23', delta: '+8 this week' },
          { label: '5-Star Reviews', value: '156', delta: '+4 this week' },
          { label: 'Local SEO Posts', value: '32', delta: 'This month' },
        ],
        recentActivity: 'Recent Activity',
        activity: [
          { text: 'New lead from website form', time: '2m ago', dot: 'blue' },
          { text: 'Missed call auto-texted back', time: '5m ago', dot: 'green' },
          { text: 'New 5-star review received', time: '12m ago', dot: 'yellow' },
          { text: 'Google Business post published', time: '1h ago', dot: 'blue' },
        ],
      },
    },
    about: {
      eyebrow: 'Why Azul',
      headline: ['The Growth System Built for', 'Miami Local Business'],
      subtitle:
        "Most local businesses in South Florida are losing customers every day. Calls get missed, leads never get followed up, and happy customers never leave a review. Azul fixes all of that with one bilingual, AI-powered growth system.",
      cards: [
        {
          title: 'Our Mission',
          body:
            "Give South Florida's home service and local businesses the same growth tech that big national brands use. Reviews, SEO, AI answering, and websites that actually book jobs. Without the enterprise price tag or the language barrier.",
        },
        {
          title: 'Bilingual By Default',
          body:
            "Every review request, SEO post, social caption, and AI phone call can run in English or Español, because your customers do. We're built for Miami, not retrofitted for it.",
        },
      ],
      whatWeDoEyebrow: 'What We Do',
      whatWeDoHeadline: 'What Azul Actually Does For Your Business',
      whatWeDoCards: [
        {
          title: 'Get Found Online',
          body:
            'We keep your Google Business Profile active with local SEO posts, service-area content, and location-based updates so the right Miami customers find you first.',
        },
        {
          title: 'Capture More Leads',
          body:
            'Your website, forms, calls, and messages all feed into one connected system so a new lead never slips through the cracks, even on a Sunday.',
        },
        {
          title: 'Answer Faster (English & Español)',
          body:
            "AI answering plus missed-call text-back respond instantly, in the caller's language, even when your whole crew is out on a job.",
        },
        {
          title: 'Build Trust With Reviews',
          body:
            'Automated SMS and email review requests collect 5-star Google reviews from happy customers, with a private feedback shield for the unhappy ones.',
        },
      ],
    },
    solutions: {
      eyebrow: 'Solutions',
      headline: 'Six Services, One Growth System',
      subtitle:
        'Pick the one that solves your biggest problem right now, or bundle them all for a fully connected system that runs itself.',
      seePricingCta: 'See Pricing →',
      joinWaitlistCta: 'Join Waitlist →',
      cards: [
        {
          price: '$79/mo',
          title: 'Review Booster',
          badge: 'Free review audit included',
          description:
            'After a job is completed, the system automatically texts or emails the customer asking for a review. Unhappy customers get a private feedback option before posting publicly, so your Google profile only grows.',
          bullets: ['Automated SMS & email requests', 'Review shield for negative feedback', 'Review dashboard & tracking'],
        },
        {
          price: '$299/mo',
          title: 'Local Proof SEO',
          badge: 'Free local presence check',
          description:
            'We turn your real completed jobs into local SEO content. Google Business Profile posts, service-area updates, and job summaries that show Google your business is active in Miami-Dade & Broward.',
          bullets: ['Weekly Google Business posts', 'Service-area location content', 'AI-written local updates (EN/ES)'],
        },
        {
          price: '$149/mo',
          title: 'Social Media AI',
          badge: 'Get 5 posts free',
          description:
            'Send us job photos, before-and-afters, or team photos. We turn them into bilingual social media posts for Facebook and Instagram, daily or weekly, using your real work.',
          bullets: ['AI-written captions (EN/ES)', 'Uses your real photos', 'Facebook & Instagram content'],
        },
        {
          price: '$349/mo',
          title: 'AI Answering Service',
          badge: 'Free 7-day trial',
          description:
            'If a customer calls and your team is busy on a roof or in a duct, AI answers, captures their information, answers basic questions in English or Spanish, and makes sure the opportunity does not disappear.',
          bullets: ['24/7 bilingual AI call answering', 'Customer capture & call summaries', 'After-hours coverage'],
        },
        {
          price: '$199/mo + $499 setup',
          title: 'Website Build',
          badge: 'Free website mockup',
          description:
            'Modern websites built to turn visitors into calls, quote requests, and booked appointments. Connected to your full growth system and includes a live chat widget in both languages.',
          bullets: ['Conversion-focused design', 'Connected inquiry forms', 'Chat widget & hosting'],
        },
        {
          price: 'Coming Soon',
          title: 'AI Facebook Ads',
          badge: 'Join the waitlist',
          description:
            'AI-powered Facebook and Instagram ad campaigns built specifically for local businesses. Automated targeting, creative, and budget optimization tuned for South Florida service areas.',
          bullets: ['Automated campaign creation', 'Local audience targeting', 'AI ad creative & copy'],
          comingSoon: true,
        },
      ],
    },
    howItWorks: {
      eyebrow: 'How It Works',
      headline: 'From First Call To First 5-Star Review',
      subtitle:
        "We handle the tech, the copy, the automations, and the setup. You keep running your business. We just make sure more customers find it, call it, and rave about it.",
      steps: [
        { step: '01', title: 'Book a Free Demo', description: '15-minute call. We audit your Google profile, reviews, website, and phone answering. No pitch, just a plan.' },
        { step: '02', title: 'We Set It All Up', description: 'Within 7 days we connect your tools, wire up automations, and write your first bilingual content. You approve, we launch.' },
        { step: '03', title: 'You Start Getting Results', description: 'Reviews come in, missed calls get texted back, leads land in your inbox, and your Google profile starts ranking for local searches.' },
        { step: '04', title: 'We Keep Optimizing', description: 'Every month we refine your content, review your numbers, and add new campaigns. No contracts. You stay because it works.' },
      ],
    },
    pricing: {
      eyebrow: 'Pricing',
      headline: ['Simple Plans For', 'Miami Local Business'],
      subtitle:
        'Start with one service or bundle them all. No long-term contracts. Every plan includes a free trial or free offer to get you started.',
      tiers: [
        {
          title: 'Review Booster',
          price: '$79',
          badge: 'Free review audit',
          features: [
            'Automated SMS & email review requests',
            'Private feedback shield for unhappy customers',
            'Review dashboard & tracking',
            'Google, Facebook & Yelp integration',
          ],
          ctaLabel: 'Get Started',
        },
        {
          title: 'Local Proof SEO',
          price: '$299',
          badge: 'Free local check',
          features: [
            'Weekly Google Business Profile posts',
            'Service-area location content',
            'AI-written local updates (EN/ES)',
            'Monthly local ranking report',
          ],
          ctaLabel: 'Start Local SEO',
        },
        {
          title: 'Social Media AI',
          price: '$149',
          badge: '5 free posts',
          features: [
            'AI-written captions (EN/ES)',
            'Uses your real job photos',
            'Facebook & Instagram posting',
            'Weekly content calendar',
          ],
          ctaLabel: 'Start Posting',
        },
        {
          title: 'Website Build',
          price: '$199',
          priceNote: '+ $499 setup',
          badge: 'Free mockup',
          stripeLinkKey: 'websiteSetup',
          features: [
            'Modern conversion-focused design',
            'Chat widget included',
            'Contact & quote forms',
            'Hosting & ongoing support',
          ],
          ctaLabel: 'Get Free Mockup',
        },
        {
          title: 'AI Answering',
          price: '$349',
          badge: '7-day free trial',
          features: [
            '24/7 AI call answering (EN/ES)',
            'Customer capture & call summaries',
            'Missed-call text-back',
            'After-hours coverage',
          ],
          ctaLabel: 'Book Demo',
        },
        {
          title: 'AI Facebook Ads',
          badge: 'Join Waitlist',
          features: [
            'Automated campaign creation',
            'Local audience targeting',
            'AI ad creative & copy',
            'Budget optimization',
          ],
          ctaLabel: 'Join Waitlist',
          comingSoon: true,
        },
      ],
      bundle: {
        badge: 'Best Value · Most Popular',
        title: 'Azul Growth Suite',
        description:
          'Everything your local business needs to get found, capture leads, collect reviews, and stay active online. All connected, all bilingual, one flat monthly price.',
        features: [
          'Professional website + chat widget',
          '5-star review automation',
          'Local Proof SEO content',
          'Social Media AI posting',
          'Missed-call text-back',
          'Customer pipeline & tracking',
          'Full automation setup',
          'Optional AI Answering add-on',
        ],
        startingAt: 'Starting at',
        price: '$549',
        crossed: '$1,075 à la carte',
        ctaLabel: 'Book Free Demo',
        microcopy: 'No contracts. Cancel anytime.',
      },
    },
    industries: {
      eyebrow: 'Industries',
      headline: 'Built For South Florida Local Business',
      subtitle:
        'We specialize in home service verticals across Miami-Dade, Broward, and Palm Beach, with bilingual delivery baked in from day one.',
      focusBadge: 'Focus',
      soonBadge: 'Soon',
      fallback: 'Not on the list?',
      fallbackLink: 'Talk to us',
      fallbackAfter: ". If you're a local business in South Florida, chances are the system fits.",
      items: [
        { name: 'Roofing', primary: true },
        { name: 'HVAC', primary: true },
        { name: 'Plumbing' },
        { name: 'Pool Services' },
        { name: 'Landscaping' },
        { name: 'General Contractors' },
        { name: 'Pressure Washing' },
        { name: 'Med Spas', comingSoon: true },
      ],
    },
    recentWork: {
      eyebrow: 'Clients',
      headline: 'Real Miami Businesses On The Growth Suite',
      subtitle:
        'Every client runs the full Azul stack. Website, review automation, local SEO, and bilingual lead capture, all working together.',
    },
    faq: {
      headline: 'Frequently Asked Questions',
      items: [
        {
          question: 'How is this different from just hiring a marketing agency?',
          answer:
            'Traditional agencies bill you $2,000+ per month for one service (usually ads or SEO) and hand you a report at the end. Azul is a productized growth system: reviews, SEO, social, website, and AI answering all working together, at a flat monthly price, with no long-term contract. You get the outcome (more booked jobs), not just a deliverable.',
        },
        {
          question: 'Do I need to be tech-savvy to use this?',
          answer:
            'No. We set up everything: Google Business, review requests, missed-call text-back, social posting, your dashboard. You get a simple weekly summary showing new reviews, calls captured, and leads generated. If you can read a text message, you can use Azul.',
        },
        {
          question: 'Do you really answer calls in English and Spanish?',
          answer:
            'Yes. Every part of the system (review requests, SEO content, social posts, and AI phone answering) can run in English, Spanish, or both. Miami customers switch languages mid-conversation and our AI keeps up. This is baked in, not an add-on.',
        },
        {
          question: 'How fast will I actually see results?',
          answer:
            'Missed-call text-back and AI answering start capturing leads on day 1. New Google reviews typically start landing within the first week after we turn on review requests. Local SEO ranking improvements are usually visible within 30-60 days. Every plan includes a free trial or free offer so you can prove it works before paying full price.',
        },
        {
          question: 'Do you serve businesses outside of Miami?',
          answer:
            "Our focus is South Florida (Miami-Dade, Broward, and Palm Beach) because that's where the bilingual delivery matters most. If you're outside the area but still want a productized bilingual growth system, book a demo and we'll tell you honestly if we're the right fit.",
        },
        {
          question: 'What if I want to cancel?',
          answer:
            "No long-term contracts, no cancellation fees. Give us 30 days' notice and we shut everything off cleanly. You keep the website, the reviews, the customer list, and the Google Business content we built. Founding Client pricing is the only plan locked in: it stays at $399/mo for life, but you can still cancel anytime.",
        },
      ],
    },
    contact: {
      eyebrow: 'Contact',
      headline: 'Ready To Grow?',
      subtitle:
        "Book a free 15-minute demo. We'll audit your Google profile, reviews, and phone answering, and show you exactly what Azul can do for your Miami business. No pitch, just a plan.",
      form: {
        nameLabel: 'Name',
        namePlaceholder: 'Your name',
        emailLabel: 'Email',
        emailPlaceholder: 'your@email.com',
        businessTypeLabel: 'Business Type',
        businessTypeOptions: [
          'Roofing', 'HVAC', 'Plumbing', 'Pool Services', 'Landscaping',
          'General Contractor', 'Med Spa', 'Other Local Business',
        ],
        interestLabel: "I'm interested in",
        interestOptions: [
          { value: 'Growth Suite Bundle', label: 'Growth Suite Bundle ($549/mo)' },
          { value: 'Founding Client Offer', label: 'Founding Client Offer ($399/mo)' },
          { value: 'Review Booster', label: 'Review Booster' },
          { value: 'Local Proof SEO', label: 'Local Proof SEO' },
          { value: 'Social Media AI', label: 'Social Media AI' },
          { value: 'Website Build', label: 'Website Build' },
          { value: 'AI Answering', label: 'AI Answering' },
          { value: 'Not sure yet', label: 'Not sure yet, help me decide' },
        ],
        messageLabel: 'Tell us about your business',
        messagePlaceholder:
          "What's your biggest challenge right now? Reviews, missed calls, getting found on Google?",
        recaptcha: 'Protected by reCAPTCHA',
        submit: 'Send Message',
        responseTime: 'We respond within 24 hours',
      },
      demoCard: {
        title: 'Book a Free Demo',
        body:
          '15 minutes. We audit your Google profile, reviews, and phone setup, then show you exactly what Azul will do for your business. No pressure, no pitch.',
        cta: 'Book Free Demo →',
      },
    },
    footer: {
      tagline: 'The bilingual AI growth system for South Florida home service businesses.',
      subline: 'Miami · En Español · Built for local',
      quickLinks: 'Quick Links',
      services: 'Services',
      connect: 'Connect',
      links: {
        solutions: 'Solutions',
        pricing: 'Pricing',
        industries: 'Industries',
        howItWorks: 'How It Works',
        recentWork: 'Clients',
        contact: 'Contact',
      },
      serviceLinks: [
        'Review Booster',
        'Local Proof SEO',
        'Social Media AI',
        'Website Build',
        'AI Answering',
      ],
      soonLabel: 'AI Facebook Ads (soon)',
      bookDemo: 'Book Free Demo →',
      whatsapp: 'WhatsApp us',
      contactForm: 'Contact form',
      copyright: (year) => `© ${year} Azul. Growing local Miami businesses, one 5-star review at a time.`,
      serviceArea: 'Serving Miami-Dade, Broward & Palm Beach · Se habla español',
    },
    whatsapp: {
      ariaLabel: 'Chat with Azul on WhatsApp',
      tooltip: 'Chat with us on WhatsApp',
      message: "Hi Azul, I'd like to learn more about the Growth Suite",
    },
  },

  es: {
    announcement: {
      long: '🎉 Oferta Cliente Fundador. Los primeros 10 negocios de Miami obtienen el Growth Suite por',
      short: '🎉 Oferta Fundador:',
      priceHighlight: '$399/mes de por vida',
      trailingLong: 'Quedan pocos cupos →',
      trailingShort: '→',
    },
    nav: {
      solutions: 'Servicios',
      pricing: 'Precios',
      industries: 'Industrias',
      howItWorks: 'Cómo Funciona',
      contact: 'Contacto',
      bookDemo: 'Demo Gratis',
      toggleMenu: 'Menú',
    },
    hero: {
      badge: 'Sistema de Crecimiento AI para Home Services en Miami · English + Español',
      headline: ['Más Clientes,', 'Más Reseñas,', 'Y Más', 'Trabajos.'],
      subtitle:
        'Azul ayuda a techeros, técnicos de HVAC y negocios de servicios en el sur de Florida a aparecer en Google, contestar todas las llamadas, y convertir clientes felices en reseñas de 5 estrellas. Todo en un solo sistema bilingüe.',
      ctaPrimary: 'Reserva Demo Gratis',
      ctaSecondary: 'Ver Planes',
      trust: [
        'Servicio bilingüe',
        'Hecho para negocio local',
        'Sin contratos largos',
        'Listo en pocos días',
      ],
      dashboard: {
        title: 'Panel de Crecimiento Azul',
        live: 'En Vivo',
        stats: [
          { label: 'Nuevos Leads', value: '47', delta: '+12 esta semana' },
          { label: 'Llamadas Recuperadas', value: '23', delta: '+8 esta semana' },
          { label: 'Reseñas 5 Estrellas', value: '156', delta: '+4 esta semana' },
          { label: 'Posts SEO Local', value: '32', delta: 'Este mes' },
        ],
        recentActivity: 'Actividad Reciente',
        activity: [
          { text: 'Nuevo lead del formulario web', time: 'hace 2m', dot: 'blue' },
          { text: 'Llamada perdida contestada por SMS', time: 'hace 5m', dot: 'green' },
          { text: 'Nueva reseña de 5 estrellas', time: 'hace 12m', dot: 'yellow' },
          { text: 'Post publicado en Google Business', time: 'hace 1h', dot: 'blue' },
        ],
      },
    },
    about: {
      eyebrow: 'Por Qué Azul',
      headline: ['El Sistema de Crecimiento Hecho Para', 'Negocios Locales de Miami'],
      subtitle:
        'La mayoría de negocios locales en el sur de Florida están perdiendo clientes todos los días. Se pierden llamadas, los leads no reciben seguimiento, y los clientes felices nunca dejan reseña. Azul lo arregla todo con un solo sistema bilingüe impulsado por AI.',
      cards: [
        {
          title: 'Nuestra Misión',
          body:
            'Darle a los negocios de home services y locales del sur de Florida la misma tecnología de crecimiento que usan las grandes marcas nacionales. Reseñas, SEO, contestación con AI, y sitios web que realmente generan trabajos. Sin el precio corporativo ni la barrera del idioma.',
        },
        {
          title: 'Bilingüe Por Defecto',
          body:
            'Cada solicitud de reseña, post de SEO, caption de redes sociales, y llamada con AI puede funcionar en inglés o español, porque sus clientes lo hacen. Estamos hechos para Miami, no adaptados a ella.',
        },
      ],
      whatWeDoEyebrow: 'Qué Hacemos',
      whatWeDoHeadline: 'Lo Que Azul Hace Por Su Negocio',
      whatWeDoCards: [
        {
          title: 'Aparecer En Google',
          body:
            'Mantenemos activo su perfil de Google Business con posts de SEO local, contenido de área de servicio, y actualizaciones basadas en ubicación para que los clientes correctos de Miami lo encuentren primero.',
        },
        {
          title: 'Capturar Más Leads',
          body:
            'Su sitio web, formularios, llamadas y mensajes se conectan a un solo sistema para que ningún lead nuevo se pierda, ni siquiera un domingo.',
        },
        {
          title: 'Contestar Más Rápido (Inglés y Español)',
          body:
            'La contestación con AI y el SMS automático de llamadas perdidas responden al instante, en el idioma del cliente, aún cuando todo su equipo está en un trabajo.',
        },
        {
          title: 'Construir Confianza Con Reseñas',
          body:
            'Solicitudes automáticas de reseña por SMS y email recolectan reseñas de 5 estrellas en Google de clientes felices, con un escudo privado para los descontentos.',
        },
      ],
    },
    solutions: {
      eyebrow: 'Servicios',
      headline: 'Seis Servicios, Un Sistema de Crecimiento',
      subtitle:
        'Elija el que resuelve su problema más grande ahora mismo, o combínelos todos en un sistema completamente conectado que trabaja solo.',
      seePricingCta: 'Ver Precios →',
      joinWaitlistCta: 'Únase a Lista →',
      cards: [
        {
          price: '$79/mes',
          title: 'Review Booster',
          badge: 'Auditoría de reseñas gratis',
          description:
            'Después de completar un trabajo, el sistema le envía un SMS o email al cliente pidiendo una reseña. Los clientes descontentos reciben una opción de feedback privado antes de publicar públicamente, así su perfil de Google solo crece.',
          bullets: ['Solicitudes SMS & email automáticas', 'Escudo para feedback negativo', 'Panel de reseñas & seguimiento'],
        },
        {
          price: '$299/mes',
          title: 'Local Proof SEO',
          badge: 'Chequeo local gratis',
          description:
            'Convertimos sus trabajos reales completados en contenido de SEO local. Posts en Google Business, actualizaciones de área de servicio, y resúmenes de trabajos que le muestran a Google que su negocio está activo en Miami-Dade y Broward.',
          bullets: ['Posts semanales de Google Business', 'Contenido de área de servicio', 'Actualizaciones AI (EN/ES)'],
        },
        {
          price: '$149/mes',
          title: 'Social Media AI',
          badge: '5 posts gratis',
          description:
            'Envíenos fotos de trabajos, antes-y-después, o fotos del equipo. Las convertimos en posts bilingües para Facebook e Instagram, diario o semanal, usando su trabajo real.',
          bullets: ['Captions AI (EN/ES)', 'Usa sus fotos reales', 'Contenido para Facebook e Instagram'],
        },
        {
          price: '$349/mes',
          title: 'Contestación AI',
          badge: 'Prueba gratis 7 días',
          description:
            'Si un cliente llama y su equipo está ocupado en un techo o un ducto, la AI contesta, captura su información, responde preguntas básicas en inglés o español, y se asegura de que la oportunidad no desaparezca.',
          bullets: ['Contestación bilingüe AI 24/7', 'Captura de cliente & resúmenes', 'Cobertura fuera de horario'],
        },
        {
          price: '$199/mes + $499 setup',
          title: 'Sitio Web',
          badge: 'Mockup gratis',
          description:
            'Sitios web modernos hechos para convertir visitantes en llamadas, solicitudes de cotización, y citas reservadas. Conectados a su sistema completo e incluye chat widget en ambos idiomas.',
          bullets: ['Diseño enfocado en conversión', 'Formularios conectados', 'Chat widget & hosting'],
        },
        {
          price: 'Próximamente',
          title: 'Anuncios AI en Facebook',
          badge: 'Únase a la lista',
          description:
            'Campañas de anuncios con AI en Facebook e Instagram hechas específicamente para negocios locales. Targeting automático, creativos, y optimización de presupuesto ajustada al sur de Florida.',
          bullets: ['Creación automática de campañas', 'Targeting de audiencia local', 'Creativos & copy con AI'],
          comingSoon: true,
        },
      ],
    },
    howItWorks: {
      eyebrow: 'Cómo Funciona',
      headline: 'De la Primera Llamada a la Primera Reseña 5 Estrellas',
      subtitle:
        'Nosotros manejamos la tecnología, el copy, las automatizaciones, y la configuración. Usted sigue manejando su negocio. Nosotros nos aseguramos de que más clientes lo encuentren, lo llamen, y hablen bien de usted.',
      steps: [
        { step: '01', title: 'Reserve Demo Gratis', description: 'Llamada de 15 minutos. Auditamos su perfil de Google, reseñas, sitio web, y contestación telefónica. Sin pitch, solo un plan.' },
        { step: '02', title: 'Nosotros Configuramos Todo', description: 'En 7 días conectamos sus herramientas, activamos automatizaciones, y escribimos su primer contenido bilingüe. Usted aprueba, nosotros lanzamos.' },
        { step: '03', title: 'Empieza A Ver Resultados', description: 'Llegan reseñas, las llamadas perdidas reciben SMS, los leads entran a su inbox, y su perfil de Google empieza a posicionar en búsquedas locales.' },
        { step: '04', title: 'Seguimos Optimizando', description: 'Cada mes refinamos su contenido, revisamos sus números, y agregamos nuevas campañas. Sin contratos. Se queda porque funciona.' },
      ],
    },
    pricing: {
      eyebrow: 'Precios',
      headline: ['Planes Simples Para', 'Negocios Locales de Miami'],
      subtitle:
        'Empiece con un servicio o combínelos todos. Sin contratos a largo plazo. Cada plan incluye una prueba gratis u oferta gratis para empezar.',
      tiers: [
        {
          title: 'Review Booster',
          price: '$79',
          badge: 'Auditoría gratis',
          features: [
            'Solicitudes SMS & email automáticas',
            'Escudo privado para clientes descontentos',
            'Panel de reseñas & seguimiento',
            'Integración con Google, Facebook y Yelp',
          ],
          ctaLabel: 'Empezar',
        },
        {
          title: 'Local Proof SEO',
          price: '$299',
          badge: 'Chequeo local gratis',
          features: [
            'Posts semanales en Google Business',
            'Contenido de área de servicio',
            'Actualizaciones AI (EN/ES)',
            'Reporte mensual de posicionamiento',
          ],
          ctaLabel: 'Empezar SEO Local',
        },
        {
          title: 'Social Media AI',
          price: '$149',
          badge: '5 posts gratis',
          features: [
            'Captions AI (EN/ES)',
            'Usa sus fotos reales de trabajos',
            'Publicación en Facebook & Instagram',
            'Calendario semanal de contenido',
          ],
          ctaLabel: 'Empezar A Postear',
        },
        {
          title: 'Sitio Web',
          price: '$199',
          priceNote: '+ $499 setup',
          badge: 'Mockup gratis',
          stripeLinkKey: 'websiteSetup',
          features: [
            'Diseño moderno enfocado en conversión',
            'Chat widget incluido',
            'Formularios de contacto & cotización',
            'Hosting & soporte continuo',
          ],
          ctaLabel: 'Mockup Gratis',
        },
        {
          title: 'Contestación AI',
          price: '$349',
          badge: 'Prueba gratis 7 días',
          features: [
            'Contestación AI 24/7 (EN/ES)',
            'Captura de cliente & resúmenes',
            'SMS automático de llamadas perdidas',
            'Cobertura fuera de horario',
          ],
          ctaLabel: 'Reservar Demo',
        },
        {
          title: 'Anuncios AI en Facebook',
          badge: 'Únase a la Lista',
          features: [
            'Creación automática de campañas',
            'Targeting de audiencia local',
            'Creativos & copy con AI',
            'Optimización de presupuesto',
          ],
          ctaLabel: 'Únase a la Lista',
          comingSoon: true,
        },
      ],
      bundle: {
        badge: 'Mejor Valor · Más Popular',
        title: 'Azul Growth Suite',
        description:
          'Todo lo que su negocio local necesita para aparecer en Google, capturar leads, recolectar reseñas, y mantenerse activo online. Todo conectado, todo bilingüe, un solo precio mensual.',
        features: [
          'Sitio web profesional + chat widget',
          'Automatización de reseñas 5 estrellas',
          'Contenido de Local Proof SEO',
          'Publicación con Social Media AI',
          'SMS de llamadas perdidas',
          'Pipeline de clientes & seguimiento',
          'Configuración completa automatizada',
          'Add-on opcional de Contestación AI',
        ],
        startingAt: 'Desde',
        price: '$549',
        crossed: '$1,075 por separado',
        ctaLabel: 'Reservar Demo Gratis',
        microcopy: 'Sin contratos. Cancele cuando quiera.',
      },
    },
    industries: {
      eyebrow: 'Industrias',
      headline: 'Hecho Para Negocios Locales del Sur de Florida',
      subtitle:
        'Nos especializamos en verticales de home services en Miami-Dade, Broward, y Palm Beach, con servicio bilingüe integrado desde el primer día.',
      focusBadge: 'Focus',
      soonBadge: 'Pronto',
      fallback: '¿No está en la lista?',
      fallbackLink: 'Hable con nosotros',
      fallbackAfter: '. Si es un negocio local del sur de Florida, seguramente el sistema le sirve.',
      items: [
        { name: 'Techos', primary: true },
        { name: 'HVAC', primary: true },
        { name: 'Plomería' },
        { name: 'Servicios de Piscina' },
        { name: 'Jardinería' },
        { name: 'Contratistas Generales' },
        { name: 'Limpieza a Presión' },
        { name: 'Med Spas', comingSoon: true },
      ],
    },
    recentWork: {
      eyebrow: 'Clientes',
      headline: 'Negocios Reales de Miami en el Growth Suite',
      subtitle:
        'Cada cliente usa el sistema Azul completo. Sitio web, automatización de reseñas, SEO local, y captura de leads bilingüe, todo trabajando junto.',
    },
    faq: {
      headline: 'Preguntas Frecuentes',
      items: [
        {
          question: '¿En qué se diferencia esto de contratar una agencia de marketing?',
          answer:
            'Las agencias tradicionales le cobran $2,000+ al mes por un solo servicio (usualmente anuncios o SEO) y le entregan un reporte al final. Azul es un sistema de crecimiento productizado: reseñas, SEO, redes sociales, sitio web, y contestación AI trabajando juntos, a un precio mensual fijo, sin contrato largo. Usted recibe el resultado (más trabajos reservados), no solo un entregable.',
        },
        {
          question: '¿Necesito saber de tecnología para usarlo?',
          answer:
            'No. Nosotros configuramos todo: Google Business, solicitudes de reseña, SMS de llamadas perdidas, publicación en redes, su panel. Usted recibe un resumen semanal simple mostrando reseñas nuevas, llamadas capturadas, y leads generados. Si sabe leer un mensaje de texto, sabe usar Azul.',
        },
        {
          question: '¿Realmente contestan llamadas en inglés y español?',
          answer:
            'Sí. Cada parte del sistema (solicitudes de reseña, contenido SEO, posts sociales, y contestación telefónica AI) puede funcionar en inglés, español, o ambos. Los clientes en Miami cambian de idioma en medio de la conversación y nuestra AI sigue el ritmo. Esto está integrado, no es un add-on.',
        },
        {
          question: '¿Qué tan rápido veré resultados?',
          answer:
            'El SMS de llamadas perdidas y la contestación AI empiezan a capturar leads el día 1. Las reseñas nuevas de Google típicamente empiezan a llegar la primera semana después de que activamos las solicitudes. Las mejoras en posicionamiento SEO local usualmente se ven en 30-60 días. Cada plan incluye una prueba gratis para que pueda comprobar que funciona antes de pagar el precio completo.',
        },
        {
          question: '¿Atienden negocios fuera de Miami?',
          answer:
            'Nuestro enfoque es el sur de Florida (Miami-Dade, Broward, y Palm Beach) porque es donde el servicio bilingüe importa más. Si está fuera del área pero aún quiere un sistema bilingüe productizado, reserve una demo y le diremos honestamente si somos la opción correcta.',
        },
        {
          question: '¿Qué pasa si quiero cancelar?',
          answer:
            'Sin contratos a largo plazo, sin penalidad por cancelación. Nos avisa con 30 días de anticipación y apagamos todo limpiamente. Usted se queda con el sitio web, las reseñas, la lista de clientes, y el contenido de Google Business que construimos. El precio de Cliente Fundador es el único plan bloqueado: se queda en $399/mes de por vida, pero aún puede cancelar cuando quiera.',
        },
      ],
    },
    contact: {
      eyebrow: 'Contacto',
      headline: '¿Listo Para Crecer?',
      subtitle:
        'Reserve una demo gratis de 15 minutos. Auditamos su perfil de Google, reseñas, y contestación telefónica, y le mostramos exactamente lo que Azul puede hacer por su negocio en Miami. Sin pitch, solo un plan.',
      form: {
        nameLabel: 'Nombre',
        namePlaceholder: 'Su nombre',
        emailLabel: 'Email',
        emailPlaceholder: 'su@email.com',
        businessTypeLabel: 'Tipo de Negocio',
        businessTypeOptions: [
          'Techos', 'HVAC', 'Plomería', 'Servicios de Piscina', 'Jardinería',
          'Contratista General', 'Med Spa', 'Otro Negocio Local',
        ],
        interestLabel: 'Me interesa',
        interestOptions: [
          { value: 'Growth Suite Bundle', label: 'Growth Suite Bundle ($549/mes)' },
          { value: 'Founding Client Offer', label: 'Oferta Cliente Fundador ($399/mes)' },
          { value: 'Review Booster', label: 'Review Booster' },
          { value: 'Local Proof SEO', label: 'Local Proof SEO' },
          { value: 'Social Media AI', label: 'Social Media AI' },
          { value: 'Website Build', label: 'Sitio Web' },
          { value: 'AI Answering', label: 'Contestación AI' },
          { value: 'Not sure yet', label: 'Aún no estoy seguro, ayúdenme a decidir' },
        ],
        messageLabel: 'Cuéntenos sobre su negocio',
        messagePlaceholder:
          '¿Cuál es su problema más grande ahora? ¿Reseñas, llamadas perdidas, no aparecer en Google?',
        recaptcha: 'Protegido por reCAPTCHA',
        submit: 'Enviar Mensaje',
        responseTime: 'Respondemos en menos de 24 horas',
      },
      demoCard: {
        title: 'Reserve Demo Gratis',
        body:
          '15 minutos. Auditamos su perfil de Google, reseñas, y sistema telefónico, luego le mostramos exactamente lo que Azul va a hacer por su negocio. Sin presión, sin pitch.',
        cta: 'Reservar Demo Gratis →',
      },
    },
    footer: {
      tagline: 'El sistema de crecimiento bilingüe con AI para negocios de home services en el sur de Florida.',
      subline: 'Miami · En Español · Hecho para negocio local',
      quickLinks: 'Enlaces',
      services: 'Servicios',
      connect: 'Conectar',
      links: {
        solutions: 'Servicios',
        pricing: 'Precios',
        industries: 'Industrias',
        howItWorks: 'Cómo Funciona',
        recentWork: 'Clientes',
        contact: 'Contacto',
      },
      serviceLinks: [
        'Review Booster',
        'Local Proof SEO',
        'Social Media AI',
        'Sitio Web',
        'Contestación AI',
      ],
      soonLabel: 'Anuncios AI en Facebook (pronto)',
      bookDemo: 'Reservar Demo Gratis →',
      whatsapp: 'WhatsApp',
      contactForm: 'Formulario de contacto',
      copyright: (year) => `© ${year} Azul. Haciendo crecer negocios locales de Miami, una reseña 5 estrellas a la vez.`,
      serviceArea: 'Atendemos Miami-Dade, Broward & Palm Beach · Se habla español',
    },
    whatsapp: {
      ariaLabel: 'Chatee con Azul en WhatsApp',
      tooltip: 'Chatee con nosotros en WhatsApp',
      message: 'Hola Azul, quiero saber más sobre el Growth Suite',
    },
  },
}
