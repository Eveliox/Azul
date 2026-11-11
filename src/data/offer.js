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
      title: 'Set up for your business.\nManaged by Azul.',
      body: 'We connect the website, calling rules, and calendar around the way your team works. You get one place to see what happened to every inquiry.',
      steps: [
        { title: 'Start with your business.', body: 'We learn your services, service area, booking availability, and when a call should go straight to you.' },
        { title: 'Connect the pieces.', body: 'We build or connect your website, configure the agent, and link your Google Calendar. Calling hours and retries follow your settings.' },
        { title: 'Test, then go live.', body: 'We test the flow before turning it on. Once live, your dashboard shows new leads, call results, bookings, and anything that needs your attention.' },
      ],
    },
    included: {
      eyebrow: 'What’s included',
      title: 'Your website and agent.\nWorking together.',
      badge: 'Included',
      items: [
        { title: 'Website build', body: 'A fast, bilingual website built around your services and the areas you serve. Every inquiry arrives in your lead workspace, ready for the next step.' },
        { title: 'Speed-to-lead agent', body: 'An AI voice agent that responds during your calling hours, asks about the job, and books available visits. Configure retries, lead alerts, and transfers to your team.' },
        { title: 'Your lead workspace', body: 'See who inquired, what the agent learned, and what happens next. Search leads, review call summaries, and find the conversations that need a personal response.' },
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
      body: 'Three South Florida businesses, one connected system. Owner-reported numbers, first 90 days post-launch.',
      view: 'See the project',
      items: [
        { id: 'aspire', business: 'Aspire Roofing Services', metric: '+50 calls / month', note: 'Revenue doubled year-over-year', quote: 'Working with Azul was easy from day one. They listened, delivered fast, and the results speak for themselves. I’m glad I made the call.', person: 'Norberto', role: 'Owner, Aspire Roofing Services' },
        { id: 'sanos', business: 'Sanos Medical Group', metric: '30+ new patient leads', quote: 'Our patients need to feel taken care of from the first click, and Azul got that right away. The site feels like our practice: professional, warm, and easy for everyone to use.', person: 'Harold', role: 'Owner, Sanos Medical Group' },
        { id: 'coatings', business: '110% Coatings', metric: '+30 calls / month', quote: 'Azul didn’t just build us a website, they built us a machine that brings in customers. I’d recommend them to any business owner who’s serious about growing.', person: 'Ozzy', role: 'Owner, 110% Coatings' },
      ],
      footer: 'Owner-reported results, first 90 days post-launch. Approved by owners, November 2026.',
    },
    final: {
      eyebrow: 'Get started',
      title: 'See Azul working\nfor your business.',
      body: 'Walk through your website, your lead flow, and how the agent would work for your team. No long-term contracts.',
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
      title: 'A su medida.\nAdministrado por Azul.',
      body: 'Conectamos su sitio, las reglas de llamadas y su calendario según la forma de trabajar de su equipo. Usted ve qué pasó con cada solicitud en un solo panel.',
      steps: [
        { title: 'Empezamos con su negocio.', body: 'Conocemos sus servicios, las áreas que atiende, los horarios disponibles y cuándo una llamada debe pasar directamente a usted.' },
        { title: 'Conectamos cada parte.', body: 'Creamos o conectamos su sitio, configuramos el agente y enlazamos Google Calendar. Los horarios y reintentos siguen sus ajustes.' },
        { title: 'Probamos y activamos.', body: 'Probamos todo antes de activarlo. Después, su panel muestra solicitudes, resultados de llamadas, citas y lo que necesita su atención.' },
      ],
    },
    included: {
      eyebrow: 'Qué incluye',
      title: 'Su sitio y su agente.\nTrabajando juntos.',
      badge: 'Incluido',
      items: [
        { title: 'Sitio web', body: 'Un sitio rápido y bilingüe, creado para sus servicios y las áreas que atiende. Cada solicitud llega a su panel, lista para el próximo paso.' },
        { title: 'Agente de respuesta inmediata', body: 'Un agente de voz con IA que responde dentro de su horario, pregunta por el trabajo y agenda visitas disponibles. Configure reintentos, avisos y transferencias a su equipo.' },
        { title: 'Su panel de clientes', body: 'Vea quién solicitó un servicio, qué aprendió el agente y cuál es el próximo paso. Busque clientes, revise resúmenes e identifique las conversaciones que necesitan una respuesta personal.' },
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
      body: 'Tres negocios del sur de Florida, un sistema conectado. Números reportados por los propietarios, primeros 90 días desde el lanzamiento.',
      view: 'Ver el proyecto',
      items: [
        { id: 'aspire', business: 'Aspire Roofing Services', metric: '+50 llamadas / mes', note: 'Ingresos duplicados interanuales', quote: 'Trabajar con Azul fue fácil desde el primer día. Escucharon, entregaron rápido y los resultados hablan por sí solos. Me alegra haber hecho la llamada.', person: 'Norberto', role: 'Dueño, Aspire Roofing Services' },
        { id: 'sanos', business: 'Sanos Medical Group', metric: '30+ nuevos pacientes potenciales', quote: 'Nuestros pacientes necesitan sentirse cuidados desde el primer clic, y Azul lo entendió enseguida. El sitio se siente como nuestra práctica: profesional, cálido y fácil para todos.', person: 'Harold', role: 'Dueño, Sanos Medical Group' },
        { id: 'coatings', business: '110% Coatings', metric: '+30 llamadas / mes', quote: 'Azul no solo nos hizo un sitio web, nos hizo una máquina que trae clientes. Se lo recomendaría a cualquier dueño de negocio que esté serio sobre crecer.', person: 'Ozzy', role: 'Dueño, 110% Coatings' },
      ],
      footer: 'Resultados reportados por los propietarios, primeros 90 días desde el lanzamiento. Aprobado por los propietarios, noviembre de 2026.',
    },
    final: {
      eyebrow: 'Empieza hoy',
      title: 'Vea cómo funciona Azul\npara su negocio.',
      body: 'Revisemos su sitio, sus solicitudes y cómo trabajaría el agente para su equipo. Sin contratos a largo plazo.',
    },
    contact: {
      eyebrow: 'Contacto',
      title: 'Hablemos de\ntu próximo cliente.',
      body: 'Agenda una llamada con el equipo de Azul o escríbenos un correo.',
    },
    banner: { badge: 'Techos + aire acondicionado', headline: 'Sitio web + agente de respuesta inmediata', price: (setup, monthly) => `${setup} de configuración + ${monthly}/mes`, spots: 'Sin contratos a largo plazo', cta: 'Agenda una llamada', close: 'Cerrar anuncio' },
  },
}
