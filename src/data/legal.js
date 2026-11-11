// Privacy policy and terms, rendered by src/pages/Legal.jsx at /privacy and /terms.
// Carriers read these pages when reviewing text-message (A2P 10DLC) registration. The SMS clauses
// (no sharing of mobile numbers or opt-in data, STOP, HELP, frequency, rates) are required; tests/legal.test.js checks them.
// A section body item is a paragraph (string), a bullet list (array), or a highlighted clause ({ key }).

export const legalUpdated = { en: 'Last updated November 10, 2026', es: 'Última actualización: 10 de noviembre de 2026' }

export const legalCopy = {
  en: {
    privacy: {
      meta: { title: 'Privacy Policy | Azul', description: 'How Azul collects, uses and protects your information, including phone numbers and text-message consent.' },
      label: 'Legal / Privacy',
      title: 'Privacy Policy',
      intro: 'What we collect, why, who helps us process it, and the choices you have.',
      sections: [
        { id: 'who-we-are', title: 'Who we are', body: [
          'Azul ("we", "us") builds bilingual websites and AI lead follow-up for contractors in South Florida. This policy covers azulwebdev.com, the calls and text messages we send, and the forms we run.',
          'Questions about this policy: azulagencyco@gmail.com.',
        ] },
        { id: 'what-we-collect', title: 'What we collect', body: [
          [
            'What you give us in a form, by email or on a call: your name, phone number, email, business name, trade, city, website, service address and what you tell us about your request.',
            'For the free growth report: the business details you enter and public information about the business from Google.',
            'If you agree to calls and texts: recordings, transcripts and summaries of calls with our AI assistant, and the text messages you send and receive.',
            'On your device: your language and cookie preferences, saved in your browser.',
            'Basic technical data our hosting provider logs for security, such as IP address and browser type.',
          ],
        ] },
        { id: 'how-we-use-it', title: 'How we use it', body: [
          [
            'To answer your request, send the report you asked for and schedule calls or appointments.',
            'To call and text you about your request, only after you agree.',
            'To provide and improve our services to the businesses we work with.',
            'To keep our services secure and meet legal obligations.',
          ],
        ] },
        { id: 'text-messages', title: 'Calls and text messages', body: [
          'We call or text a phone number only after its owner ticks an unchecked consent box on a form or otherwise agrees. Consent is not a condition of any purchase.',
          'Calls may be placed by an AI assistant and may be recorded and transcribed. You can ask for a person or ask us to stop calling at any time.',
          'Message frequency varies with your request. Message and data rates may apply. Reply STOP (or PARAR) to opt out of texts. Reply HELP (or AYUDA) for help, or email azulagencyco@gmail.com.',
        ] },
        { id: 'sharing', title: 'Who we share it with', body: [
          'We do not sell personal information. We share it only with service providers that run our website and services for us, under their own security and privacy terms:',
          [
            'Hosting: Vercel',
            'Database: Supabase',
            'Email delivery: Resend',
            'Phone calls and text messages: Twilio',
            'AI calling: Vapi, and the speech and language AI providers it uses, such as OpenAI',
            'Scheduling and calendars: Calendly and Google',
          ],
          { key: 'No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text-message opt-in data and consent are excluded from every category of sharing in this policy and will not be shared with any third parties.' },
          'We may also disclose information when the law requires it, or to protect the rights and safety of people and our business.',
        ] },
        { id: 'client-work', title: 'Work we do for contractors', body: [
          'When we run a website form or AI lead follow-up for a contractor, we process that information on the contractor\'s behalf and their privacy policy also applies. The same rule holds: mobile numbers and text-message consent are never shared for marketing.',
        ] },
        { id: 'cookies', title: 'Cookies', body: [
          'We save your language and cookie preferences in your browser. Optional advertising analytics stay off unless you accept them in the cookie banner.',
          'If you accept, we load the Meta Pixel (Facebook/Instagram) to measure which ads bring people to this site and improve them. The Pixel sets cookies and sends your IP address and browsing on this site to Meta. You can turn it off any time in the cookie banner.',
          'Calendly sets its own cookies when you open the booking page.',
        ] },
        { id: 'retention', title: 'How long we keep it', body: [
          'We keep information only as long as we need it for the purpose it was collected, then delete it, unless the law requires us to keep it longer.',
        ] },
        { id: 'your-choices', title: 'Your choices', body: [
          [
            'Texts: reply STOP at any time.',
            'Calls: tell the assistant or the person calling, or email us.',
            'Emails: use the unsubscribe link or email us.',
            'To see, correct or delete the information we hold about you, email azulagencyco@gmail.com.',
          ],
        ] },
        { id: 'security', title: 'Security', body: [
          'We use access controls and encrypted connections to protect your information. No method of storage or transmission is completely secure.',
        ] },
        { id: 'children', title: 'Children', body: [
          'Our services are for businesses and adults. We do not knowingly collect information from children under 13.',
        ] },
        { id: 'changes', title: 'Changes', body: [
          'When we change this policy we update the date at the top of this page.',
        ] },
      ],
    },
    terms: {
      meta: { title: 'Terms of Service | Azul', description: 'Terms for using azulwebdev.com and Azul\'s calls and text messages, including how to opt out.' },
      label: 'Legal / Terms',
      title: 'Terms of Service',
      intro: 'The rules for using azulwebdev.com and for the calls and texts we send.',
      sections: [
        { id: 'agreement', title: 'Agreement', body: [
          'By using azulwebdev.com or agreeing to receive our calls and texts, you accept these terms and our Privacy Policy at azulwebdev.com/privacy.',
        ] },
        { id: 'services', title: 'Our services', body: [
          'Information on this website is general. Paid work is covered by a separate written agreement that sets out scope, price and timing.',
        ] },
        { id: 'sms', title: 'Text message terms', body: [
          [
            'Program: Azul lead follow-up. After you request contact through a form and tick the consent box, you may receive texts from Azul, or from a contractor we work for, about that request: appointment confirmations, reminders and follow-ups.',
            'Message frequency varies with your request.',
            'Message and data rates may apply.',
            'Reply STOP (or PARAR) to cancel at any time. You will receive one message confirming you are opted out, and no more texts after that.',
            'Reply HELP (or AYUDA) for help, or email azulagencyco@gmail.com.',
            'Carriers are not liable for delayed or undelivered messages.',
            'Consent to calls and texts is not a condition of any purchase.',
          ],
          'See our Privacy Policy at azulwebdev.com/privacy. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes.',
        ] },
        { id: 'ai-calls', title: 'AI calls', body: [
          'Calls may be placed by an AI assistant and may be recorded and transcribed. Ask for a person at any time, or say you don\'t want more calls and we will stop.',
        ] },
        { id: 'free-report', title: 'Free growth report', body: [
          'The free report is an automated estimate based on public information. It is not a guarantee of rankings, leads or results.',
        ] },
        { id: 'acceptable-use', title: 'Acceptable use', body: [
          'Submit only your own contact information. Don\'t misuse the site, interfere with how it works, or copy its content in bulk.',
        ] },
        { id: 'ownership', title: 'Ownership', body: [
          'The content and design of this website belong to Azul. Ownership of work we build for clients is set out in each client\'s agreement.',
        ] },
        { id: 'liability', title: 'Disclaimers and liability', body: [
          'The website is provided "as is". To the extent the law allows, Azul is not liable for indirect or consequential losses from using it.',
        ] },
        { id: 'law', title: 'Governing law', body: [
          'These terms are governed by the laws of the State of Florida.',
        ] },
        { id: 'contact', title: 'Contact', body: [
          'Questions about these terms: azulagencyco@gmail.com.',
        ] },
      ],
    },
  },
  es: {
    privacy: {
      meta: { title: 'Política de privacidad | Azul', description: 'Cómo Azul recopila, usa y protege su información, incluidos los números de teléfono y el consentimiento para mensajes de texto.' },
      label: 'Legal / Privacidad',
      title: 'Política de privacidad',
      intro: 'Qué recopilamos, para qué, quién nos ayuda a procesarlo y qué opciones tiene usted.',
      sections: [
        { id: 'who-we-are', title: 'Quiénes somos', body: [
          'Azul ("nosotros") crea sitios web bilingües y seguimiento de clientes potenciales con IA para contratistas del sur de Florida. Esta política cubre azulwebdev.com, las llamadas y mensajes de texto que enviamos y los formularios que gestionamos.',
          'Preguntas sobre esta política: azulagencyco@gmail.com.',
        ] },
        { id: 'what-we-collect', title: 'Qué recopilamos', body: [
          [
            'Lo que usted nos da en un formulario, por correo o en una llamada: su nombre, teléfono, correo electrónico, nombre del negocio, oficio, ciudad, sitio web, dirección del servicio y lo que nos cuenta sobre su solicitud.',
            'Para el informe de crecimiento gratuito: los datos del negocio que usted ingresa e información pública del negocio en Google.',
            'Si acepta llamadas y mensajes: grabaciones, transcripciones y resúmenes de las llamadas con nuestro asistente de IA, y los mensajes de texto que envía y recibe.',
            'En su dispositivo: sus preferencias de idioma y de cookies, guardadas en su navegador.',
            'Datos técnicos básicos que nuestro proveedor de hosting registra por seguridad, como la dirección IP y el tipo de navegador.',
          ],
        ] },
        { id: 'how-we-use-it', title: 'Cómo lo usamos', body: [
          [
            'Para responder a su solicitud, enviarle el informe que pidió y programar llamadas o citas.',
            'Para llamarle y escribirle sobre su solicitud, solo después de que usted lo acepte.',
            'Para prestar y mejorar nuestros servicios a los negocios con los que trabajamos.',
            'Para mantener nuestros servicios seguros y cumplir con la ley.',
          ],
        ] },
        { id: 'text-messages', title: 'Llamadas y mensajes de texto', body: [
          'Solo llamamos o enviamos mensajes a un número después de que su titular marque una casilla de consentimiento que aparece sin marcar en un formulario, o lo acepte de otra forma. El consentimiento no es condición para ninguna compra.',
          'Las llamadas pueden ser realizadas por un asistente de IA y pueden ser grabadas y transcritas. En cualquier momento puede pedir hablar con una persona o pedirnos que dejemos de llamar.',
          'La frecuencia de los mensajes varía según su solicitud. Pueden aplicarse tarifas de mensajes y datos. Responda STOP (o PARAR) para dejar de recibir mensajes. Responda HELP (o AYUDA) para obtener ayuda, o escriba a azulagencyco@gmail.com.',
        ] },
        { id: 'sharing', title: 'Con quién la compartimos', body: [
          'No vendemos información personal. Solo la compartimos con proveedores que operan nuestro sitio y nuestros servicios por encargo nuestro, bajo sus propios términos de seguridad y privacidad:',
          [
            'Hosting: Vercel',
            'Base de datos: Supabase',
            'Envío de correos: Resend',
            'Llamadas y mensajes de texto: Twilio',
            'Llamadas con IA: Vapi y los proveedores de IA de voz y lenguaje que utiliza, como OpenAI',
            'Agenda y calendarios: Calendly y Google',
          ],
          { key: 'No compartiremos información móvil con terceros ni afiliados con fines de marketing o promocionales. Los datos de suscripción y el consentimiento para mensajes de texto quedan excluidos de todas las categorías de esta política y no se compartirán con ningún tercero.' },
          'También podemos divulgar información cuando la ley lo exija, o para proteger los derechos y la seguridad de las personas y de nuestro negocio.',
        ] },
        { id: 'client-work', title: 'El trabajo que hacemos para contratistas', body: [
          'Cuando operamos un formulario web o el seguimiento con IA para un contratista, procesamos esa información en nombre del contratista y también aplica su política de privacidad. La misma regla se mantiene: los números móviles y el consentimiento para mensajes nunca se comparten con fines de marketing.',
        ] },
        { id: 'cookies', title: 'Cookies', body: [
          'Guardamos sus preferencias de idioma y de cookies en su navegador. La analítica publicitaria opcional permanece desactivada hasta que usted la acepte en el aviso de cookies.',
          'Si usted acepta, cargamos el Meta Pixel (Facebook/Instagram) para medir qué anuncios traen visitas a este sitio y mejorarlos. El Pixel coloca cookies y envía a Meta su dirección IP y su navegación en este sitio. Puede desactivarlo cuando quiera desde el aviso de cookies.',
          'Calendly coloca sus propias cookies cuando usted abre la página de reservas.',
        ] },
        { id: 'retention', title: 'Cuánto tiempo la guardamos', body: [
          'Guardamos la información solo el tiempo necesario para el fin con que se recopiló y después la eliminamos, salvo que la ley nos obligue a conservarla más tiempo.',
        ] },
        { id: 'your-choices', title: 'Sus opciones', body: [
          [
            'Mensajes de texto: responda STOP en cualquier momento.',
            'Llamadas: dígaselo al asistente o a la persona que llama, o escríbanos.',
            'Correos: use el enlace para cancelar la suscripción o escríbanos.',
            'Para ver, corregir o eliminar la información que tenemos sobre usted, escriba a azulagencyco@gmail.com.',
          ],
        ] },
        { id: 'security', title: 'Seguridad', body: [
          'Usamos controles de acceso y conexiones cifradas para proteger su información. Ningún método de almacenamiento o transmisión es completamente seguro.',
        ] },
        { id: 'children', title: 'Menores', body: [
          'Nuestros servicios son para negocios y adultos. No recopilamos a sabiendas información de menores de 13 años.',
        ] },
        { id: 'changes', title: 'Cambios', body: [
          'Cuando cambiemos esta política, actualizaremos la fecha al inicio de esta página.',
        ] },
      ],
    },
    terms: {
      meta: { title: 'Términos de servicio | Azul', description: 'Términos para usar azulwebdev.com y las llamadas y mensajes de texto de Azul, incluido cómo darse de baja.' },
      label: 'Legal / Términos',
      title: 'Términos de servicio',
      intro: 'Las reglas para usar azulwebdev.com y para las llamadas y mensajes que enviamos.',
      sections: [
        { id: 'agreement', title: 'Aceptación', body: [
          'Al usar azulwebdev.com o aceptar recibir nuestras llamadas y mensajes, usted acepta estos términos y nuestra Política de privacidad en azulwebdev.com/privacy.',
        ] },
        { id: 'services', title: 'Nuestros servicios', body: [
          'La información de este sitio es general. El trabajo pagado se rige por un acuerdo escrito aparte que define el alcance, el precio y los plazos.',
        ] },
        { id: 'sms', title: 'Términos de mensajes de texto', body: [
          [
            'Programa: seguimiento de clientes de Azul. Después de solicitar contacto mediante un formulario y marcar la casilla de consentimiento, puede recibir mensajes de Azul, o de un contratista para el que trabajamos, sobre esa solicitud: confirmaciones de citas, recordatorios y seguimientos.',
            'La frecuencia de los mensajes varía según su solicitud.',
            'Pueden aplicarse tarifas de mensajes y datos.',
            'Responda STOP (o PARAR) para cancelar en cualquier momento. Recibirá un mensaje confirmando la baja y ningún mensaje más después.',
            'Responda HELP (o AYUDA) para obtener ayuda, o escriba a azulagencyco@gmail.com.',
            'Los operadores no son responsables de mensajes retrasados o no entregados.',
            'El consentimiento para llamadas y mensajes no es condición para ninguna compra.',
          ],
          'Consulte nuestra Política de privacidad en azulwebdev.com/privacy. No compartiremos información móvil con terceros ni afiliados con fines de marketing o promocionales.',
        ] },
        { id: 'ai-calls', title: 'Llamadas con IA', body: [
          'Las llamadas pueden ser realizadas por un asistente de IA y pueden ser grabadas y transcritas. Puede pedir hablar con una persona en cualquier momento, o decir que no quiere más llamadas y dejaremos de llamar.',
        ] },
        { id: 'free-report', title: 'Informe de crecimiento gratuito', body: [
          'El informe gratuito es una estimación automática basada en información pública. No garantiza posiciones, clientes ni resultados.',
        ] },
        { id: 'acceptable-use', title: 'Uso aceptable', body: [
          'Envíe solo sus propios datos de contacto. No haga mal uso del sitio, no interfiera con su funcionamiento ni copie su contenido de forma masiva.',
        ] },
        { id: 'ownership', title: 'Propiedad', body: [
          'El contenido y el diseño de este sitio pertenecen a Azul. La propiedad del trabajo que hacemos para clientes se define en el acuerdo de cada cliente.',
        ] },
        { id: 'liability', title: 'Exenciones y responsabilidad', body: [
          'El sitio se ofrece "tal cual". En la medida que la ley lo permita, Azul no es responsable de pérdidas indirectas o derivadas de su uso.',
        ] },
        { id: 'law', title: 'Ley aplicable', body: [
          'Estos términos se rigen por las leyes del estado de Florida.',
        ] },
        { id: 'contact', title: 'Contacto', body: [
          'Preguntas sobre estos términos: azulagencyco@gmail.com.',
        ] },
      ],
    },
  },
}
