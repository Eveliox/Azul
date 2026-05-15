import { gradients } from '../constants/designSystem'

export const portfolioProjects = [
  {
    id: 4,
    industry: "construction",
    title: "Aspire Roofing Services",
    tagline: "Stronger roofs, built right the first time",
    shortDescription: "Professional roofing services website",
    description: "A modern, professional website for Aspire Roofing Services featuring service information, contact forms, and a gallery showcasing their roofing expertise. The site highlights their comprehensive services including shingle, tile, metal, and flat-roof installations.",
    gradient: gradients.construction,
    backgroundImage: "/aspire-roofing-preview.png",
    liveUrl: "https://aspireroofingservices.com/",
    features: [
      "Service information pages",
      "Contact form with free estimate requests",
      "Service gallery showcase",
      "Mobile-responsive design",
      "Professional hero section with call-to-action",
      "Contact information integration"
    ],
    techStack: ["React", "Tailwind CSS", "Modern Web Design"]
  },
  {
    id: 5,
    industry: "wellness",
    title: "Hello You Wellness Center",
    tagline: "Personalized wellness, physician-supervised",
    shortDescription: "Medical wellness clinic platform",
    description: "A modern site for a Miami-based medical wellness clinic offering physician-supervised treatments including IV therapy, hormone therapy, peptide programs, aesthetics, and assisted weight loss. Features a service catalog, integrated booking, and a clean conversion-focused design.",
    gradient: gradients.wellness,
    backgroundImage: "/vitality.png",
    liveUrl: "https://helloyouwellness.com/",
    features: [
      "Detailed service and treatment pages",
      "Cal.com booking integration for consultations",
      "Google Maps location embed",
      "Optimized images via Next.js",
      "Mobile-responsive, conversion-focused design",
      "Clear CTAs across every section"
    ],
    techStack: ["Next.js", "React", "Cal.com", "Google Maps API"]
  }
]
