import { gradients } from '../constants/designSystem'

export const portfolioProjects = [
  {
    id: 4,
    industry: "construction",
    title: "Aspire Roofing Services",
    tagline: "Stronger roofs, built right the first time",
    shortDescription: "Full Growth Suite client · roofing",
    description: "A Growth Suite client running the full Azul stack: website, automated review requests, local SEO content, and connected lead capture. We built the conversion-focused site and now handle their ongoing growth so the owner can stay on the roof, not on marketing.",
    gradient: gradients.construction,
    backgroundImage: "/aspire-roofing-preview.png",
    liveUrl: "https://aspireroofingservices.com/",
    features: [
      "Website build + hosting",
      "Automated 5-star review requests",
      "Local Proof SEO content (bilingual)",
      "Missed-call text-back",
      "Lead capture connected to CRM",
      "Mobile-optimized, conversion-focused"
    ],
    techStack: ["Azul Growth Suite", "React", "Tailwind CSS"]
  },
  {
    id: 5,
    industry: "wellness",
    title: "Hello You Wellness Center",
    tagline: "Personalized wellness, physician-supervised",
    shortDescription: "Full Growth Suite client · medical wellness",
    description: "A Miami-based medical wellness clinic offering physician-supervised treatments. We built the site and run the full growth system: bilingual review automation, booking integration, and local SEO. The team focuses on patients, not marketing.",
    gradient: gradients.wellness,
    backgroundImage: "/vitality.png",
    liveUrl: "https://helloyouwellness.com/",
    features: [
      "Conversion-focused website",
      "Cal.com booking integration",
      "Automated review requests (EN/ES)",
      "Local SEO content pipeline",
      "Google Maps + service-area content",
      "Ongoing site maintenance & support"
    ],
    techStack: ["Azul Growth Suite", "Next.js", "Cal.com"]
  },
  {
    id: 6,
    industry: "finance",
    title: "Caley Insurance",
    tagline: "Coverage that actually protects your business",
    shortDescription: "Full Growth Suite client · insurance",
    description: "A Miami-area insurance agency running the full Azul stack. We built a modern, conversion-focused site and connected it to the growth system: bilingual quote capture, automated review requests, and local SEO content that helps them get found for insurance searches across South Florida.",
    gradient: gradients.finance,
    backgroundImage: "/caley-insurance-preview.jpg",
    liveUrl: "https://www.caleyinsurance.com/",
    features: [
      "Modern, conversion-focused website",
      "Quote request form connected to CRM",
      "Automated review requests (EN/ES)",
      "Bilingual local SEO content",
      "Missed-call text-back",
      "Mobile-optimized for local searches"
    ],
    techStack: ["Azul Growth Suite", "React", "Modern Web Stack"]
  },
  {
    id: 7,
    industry: "medical",
    title: "Sanos Medical Group",
    tagline: "Primary care that meets you in your language",
    shortDescription: "Full Growth Suite client · primary care",
    description: "A Miami-based primary care practice offering annual physicals, preventive care, chronic condition management, weight management, and GLP-1 therapy, plus virtual visits statewide. We built a bilingual website and run the full growth system so patients can find them, book with them, and leave reviews in English or Spanish.",
    gradient: gradients.medical,
    backgroundImage: "/sanos-medical-preview.jpg",
    liveUrl: "https://sanosmedical.com/en",
    features: [
      "Bilingual (EN/ES) website with language toggle",
      "Online appointment booking",
      "Automated review requests after visits",
      "Local SEO for Miami primary care searches",
      "Missed-call text-back for after-hours",
      "HIPAA-aware lead capture"
    ],
    techStack: ["Azul Growth Suite", "Modern Web Stack", "Bilingual CMS"]
  }
]
