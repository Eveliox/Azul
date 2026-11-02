// Prices are hidden on the site; visitors book a call to hear them. Set to true to show every price again.
export const SHOW_PRICES = false

// The Azul package for roofing and HVAC companies. Prices render exactly as written in both languages.
export const offerPrices = {
  packageSetup: '$4,500',
  packageMonthly: '$450',
  // Set a standard monthly price (e.g. '$___') to show packageMonthly as the founding price next to it. Hidden while null.
  packageStandardMonthly: null,
  // The website alone is a one-time price; the agent alone has a setup fee and a monthly fee.
  websiteSetup: '$2,000',
  agentSetup: '$3,500',
  agentMonthly: '$450',
}

// Copy for the homepage, services page, contact page and banner. Exposed as `c.offer`.
export const offerCopy = {
  en: {
    meta: {
      title: 'Azul · Website + speed-to-lead AI for roofing and HVAC',
      description: 'Homeowners hire whoever answers first. Azul builds your bilingual website and an AI agent that calls every new lead within seconds, in English or Spanish, and books the estimate on your calendar. Miami-Dade, Broward, and Palm Beach.',
    },
    servicesMeta: {
      title: 'Services · The Azul package | Azul',
      description: 'The Azul package: a bilingual website and a speed-to-lead AI agent for roofing and HVAC companies in South Florida. Or get the website or the agent on its own.',
    },
    contactMeta: {
      title: 'Contact | Azul',
      description: 'Book a call with Azul. Websites and AI lead calls for roofing and HVAC companies in South Florida.',
    },
    ctas: { book: 'Book a call' },
    how: {
      eyebrow: 'How it works',
      title: 'Homeowners call three companies.\nThey hire the one that answers first.',
      body: 'Azul makes sure that’s you, every time, even at 9pm.',
      steps: [
        { title: 'A homeowner submits your form.', body: 'A roof leak, an AC that stopped cooling, a new install. The request comes in the moment they hit send.' },
        { title: 'The agent calls within seconds.', body: 'In English or Spanish, it asks what the problem is, the address, and how urgent it is.' },
        { title: 'The estimate is booked on your calendar.', body: 'Nobody on your team has to pick up the phone. If the homeowner doesn’t answer, a text follows up.' },
      ],
    },
    included: {
      eyebrow: 'What’s included',
      title: 'One package.\nFrom the first search to the booked estimate.',
      badge: 'Included',
      items: [
        { title: 'Website build', body: 'A fast, mobile-first site in English and Spanish, with a page for each service (roof repair, roof replacement, AC repair, AC installation) and for each city you serve. We set up your Google Business Profile and wire your lead form to the agent.' },
        { title: 'Speed-to-lead agent', body: 'An AI voice agent that calls every new lead within seconds, in English or Spanish. It asks the key questions (what the problem is, the address, how urgent it is) and books the estimate directly on your calendar. No human needed. If the homeowner doesn’t pick up, a text follows up.' },
        { title: 'Automatic review requests', body: 'After a job, your customer gets a text with a one-tap link to leave a Google review, plus one reminder a few days later.' },
      ],
    },
    pricing: {
      eyebrow: 'Pricing',
      title: 'One package.\nOne flat monthly price.',
      name: 'The Azul package',
      founding: 'Founding price',
      standard: 'Standard',
      month: '/mo',
      setup: price => `+ ${price} setup fee`,
      includes: ['Bilingual website build', 'Speed-to-lead AI agent', 'Automatic Google review requests'],
      terms: 'No long-term contracts.',
      separately: 'Only need one piece?',
      separatelyLink: 'See each service on its own',
    },
    services: {
      eyebrow: 'Services',
      title: 'The Azul package.\nOr just the piece you need.',
      body: 'Built for roofing and HVAC companies in Miami-Dade, Broward, and Palm Beach. Everything works in English and Spanish. No long-term contracts.',
      recommended: 'Best value',
      setup: 'setup',
      oneTime: 'one-time',
      website: {
        name: 'Website build',
        body: 'A fast, bilingual site built to turn searches into estimate requests.',
        items: ['Mobile-first, in English and Spanish', 'A page for each service you offer', 'A page for each city you serve', 'Google Business Profile setup', 'A lead form ready to connect to the agent'],
      },
      agent: {
        name: 'Speed-to-lead agent',
        body: 'An AI voice agent that calls new leads within seconds and books the estimate. Connects to the lead form you already have.',
        items: ['Calls every new lead within seconds', 'Speaks English and Spanish', 'Asks about the problem, address, and urgency', 'Books the estimate on your calendar', 'Text follow-up if the lead doesn’t answer'],
        learn: 'See how the agent works',
      },
      ctaTitle: 'Not sure which one fits?\nLet’s talk it through.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Straight answers.',
      items: [
        ['Does it speak Spanish?', 'Yes. The agent calls in English or Spanish, and your website is built in both languages from day one.'],
        ['What calendar does it book into?', 'Google Calendar. If you use a different scheduling tool, ask us and we’ll review it with you.'],
        ['What if the lead doesn’t answer?', 'A text follows up so the homeowner can still reply and book. Follow-up stops as soon as they book or text STOP.'],
        ['Is there a contract?', SHOW_PRICES ? 'No long-term contracts. You pay a one-time setup fee and a flat monthly price.' : 'No long-term contracts. Book a call and we’ll walk you through pricing for your business.'],
        ['Do I need a new website?', 'The package includes one, built to send every lead straight to the agent. Happy with the site you have? We also offer the speed-to-lead agent on its own and connect it to your current lead form.'],
      ],
    },
    caseStudies: {
      eyebrow: 'Case studies',
      title: 'Results from Azul clients.',
      body: 'Real client results will go here.',
    },
    final: {
      eyebrow: 'Get started',
      title: 'Be the first call\nevery homeowner gets.',
      body: 'Book a call with the Azul team and see how it works for your business.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Let’s talk about\nyour next lead.',
      body: 'Book a call with the Azul team or send us an email.',
    },
    banner: { badge: 'Roofing + HVAC', headline: 'Website + speed-to-lead agent', price: (setup, monthly) => `${setup} setup + ${monthly}/mo`, spots: 'No long-term contracts', cta: 'Book a call', close: 'Dismiss announcement' },
  },
  es: {
    meta: {
      title: 'Azul · Sitio web + agente de IA de respuesta inmediata para techos y aire acondicionado',
      description: 'Los dueños de casa contratan a quien contesta primero. Azul crea tu sitio web bilingüe y un agente de IA que llama a cada nuevo cliente en segundos, en inglés o en español, y agenda el estimado en tu calendario. Miami-Dade, Broward y Palm Beach.',
    },
    servicesMeta: {
      title: 'Servicios · El paquete Azul | Azul',
      description: 'El paquete Azul: un sitio web bilingüe y un agente de IA de respuesta inmediata para compañías de techos y aire acondicionado en el sur de Florida. O el sitio web o el agente por separado.',
    },
    contactMeta: {
      title: 'Contacto | Azul',
      description: 'Agenda una llamada con Azul. Sitios web y llamadas con IA para compañías de techos y aire acondicionado en el sur de Florida.',
    },
    ctas: { book: 'Agenda una llamada' },
    how: {
      eyebrow: 'Cómo funciona',
      title: 'Los dueños de casa llaman a tres compañías.\nContratan a la que contesta primero.',
      body: 'Con Azul, esa compañía es la tuya. Siempre, incluso a las 9 de la noche.',
      steps: [
        { title: 'Un cliente llena tu formulario.', body: 'Una filtración en el techo, un aire acondicionado que dejó de enfriar, una instalación nueva. La solicitud llega en cuanto presiona enviar.' },
        { title: 'El agente llama en segundos.', body: 'En inglés o en español, pregunta cuál es el problema, la dirección y qué tan urgente es.' },
        { title: 'El estimado queda agendado en tu calendario.', body: 'Nadie de tu equipo tiene que contestar el teléfono. Si el cliente no contesta, le llega un mensaje de texto de seguimiento.' },
      ],
    },
    included: {
      eyebrow: 'Qué incluye',
      title: 'Un solo paquete.\nDesde la primera búsqueda hasta el estimado agendado.',
      badge: 'Incluido',
      items: [
        { title: 'Sitio web', body: 'Un sitio rápido, pensado para el celular, en inglés y en español, con una página para cada servicio (reparación de techos, reemplazo de techos, reparación de aire acondicionado, instalación de aire acondicionado) y para cada ciudad donde trabajas. Configuramos tu Perfil de Empresa en Google y conectamos tu formulario al agente.' },
        { title: 'Agente de respuesta inmediata', body: 'Un agente de voz con IA que llama a cada nuevo cliente en segundos, en inglés o en español. Hace las preguntas clave (cuál es el problema, la dirección, qué tan urgente es) y agenda el estimado directamente en tu calendario. Sin intervención humana. Si el cliente no contesta, le llega un mensaje de texto de seguimiento.' },
        { title: 'Solicitudes de reseñas automáticas', body: 'Después de cada trabajo, tu cliente recibe un mensaje de texto con un enlace para dejar una reseña en Google con un solo toque, y un recordatorio unos días después.' },
      ],
    },
    pricing: {
      eyebrow: 'Precio',
      title: 'Un solo paquete.\nUna tarifa mensual fija.',
      name: 'El paquete Azul',
      founding: 'Precio de fundador',
      standard: 'Precio regular',
      month: '/mes',
      setup: price => `+ ${price} de configuración inicial`,
      includes: ['Sitio web bilingüe', 'Agente de IA de respuesta inmediata', 'Solicitudes automáticas de reseñas en Google'],
      terms: 'Sin contratos a largo plazo.',
      separately: '¿Solo necesitas una parte?',
      separatelyLink: 'Ver cada servicio por separado',
    },
    services: {
      eyebrow: 'Servicios',
      title: 'El paquete Azul.\nO solo la parte que necesitas.',
      body: 'Hecho para compañías de techos y aire acondicionado en Miami-Dade, Broward y Palm Beach. Todo funciona en inglés y en español. Sin contratos a largo plazo.',
      recommended: 'Mejor valor',
      setup: 'configuración inicial',
      oneTime: 'pago único',
      website: {
        name: 'Sitio web',
        body: 'Un sitio rápido y bilingüe, hecho para convertir búsquedas en solicitudes de estimado.',
        items: ['Pensado para el celular, en inglés y en español', 'Una página para cada servicio', 'Una página para cada ciudad donde trabajas', 'Configuración del Perfil de Empresa en Google', 'Un formulario listo para conectarse al agente'],
      },
      agent: {
        name: 'Agente de respuesta inmediata',
        body: 'Un agente de voz con IA que llama a los nuevos clientes en segundos y agenda el estimado. Se conecta al formulario que ya tienes.',
        items: ['Llama a cada nuevo cliente en segundos', 'Habla inglés y español', 'Pregunta por el problema, la dirección y la urgencia', 'Agenda el estimado en tu calendario', 'Mensaje de texto de seguimiento si el cliente no contesta'],
        learn: 'Ver cómo funciona el agente',
      },
      ctaTitle: '¿No sabes cuál te conviene?\nHablemos.',
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Respuestas claras.',
      items: [
        ['¿Habla español?', 'Sí. El agente llama en inglés o en español, y tu sitio web está en los dos idiomas desde el primer día.'],
        ['¿En qué calendario agenda?', 'En Google Calendar. Si usas otra herramienta de agenda, pregúntanos y la revisamos contigo.'],
        ['¿Y si el cliente no contesta?', 'Le llega un mensaje de texto de seguimiento para que pueda responder y agendar. El seguimiento se detiene en cuanto agenda o responde STOP.'],
        ['¿Hay contrato?', SHOW_PRICES ? 'No hay contratos a largo plazo. Pagas una configuración inicial única y una tarifa mensual fija.' : 'No hay contratos a largo plazo. Agenda una llamada y te explicamos los precios para tu negocio.'],
        ['¿Necesito un sitio web nuevo?', 'El paquete incluye uno, hecho para enviar cada cliente directamente al agente. ¿Ya estás contento con tu sitio? También ofrecemos el agente de respuesta inmediata por separado y lo conectamos a tu formulario actual.'],
      ],
    },
    caseStudies: {
      eyebrow: 'Casos de éxito',
      title: 'Resultados de clientes de Azul.',
      body: 'Aquí irán resultados reales de clientes.',
    },
    final: {
      eyebrow: 'Empieza hoy',
      title: 'Sé la primera llamada\nque recibe cada cliente.',
      body: 'Agenda una llamada con el equipo de Azul y descubre cómo funciona para tu negocio.',
    },
    contact: {
      eyebrow: 'Contacto',
      title: 'Hablemos de\ntu próximo cliente.',
      body: 'Agenda una llamada con el equipo de Azul o escríbenos un correo.',
    },
    banner: { badge: 'Techos + aire acondicionado', headline: 'Sitio web + agente de respuesta inmediata', price: (setup, monthly) => `${setup} de configuración + ${monthly}/mes`, spots: 'Sin contratos a largo plazo', cta: 'Agenda una llamada', close: 'Cerrar anuncio' },
  },
}
