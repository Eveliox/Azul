import { gradients } from '../constants/designSystem'

export const portfolioProjects = [
  {
    id: 1,
    industry: "restaurant",
    title: "Bella Vista Restaurant",
    tagline: "Elevated waterfront dining experience",
    shortDescription: "Premium fine dining platform",
    description: "An elegant, high-performance restaurant platform designed for discerning clientele. Seamlessly integrates reservation management, curated menu presentation, and private event coordination with sophisticated design and flawless user experience.",
    gradient: gradients.restaurant,
    backgroundImage: "/waterfront.jpg",
    features: [
      "Advanced reservation management system",
      "Curated menu presentation with dietary accommodations",
      "Private event booking and coordination",
      "Seamless payment integration"
    ],
    techStack: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"]
  },
  {
    id: 2,
    industry: "fitness",
    title: "FitZone Gym & Wellness",
    tagline: "Transform your body, transform your life",
    shortDescription: "Membership-based fitness dashboard",
    description: "A comprehensive fitness platform with class scheduling, membership management, and personalized workout tracking.",
    gradient: gradients.fitness,
    backgroundImage: "/gym-bg.jpg",
    features: [
      "Advanced class booking with waitlists",
      "Member portal with progress analytics",
      "Trainer profiles and schedules",
      "On-demand workout video library",
      "Nutrition planning tools",
      "Mobile app integration"
    ],
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe"]
  },
  {
    id: 3,
    industry: "realEstate",
    title: "Prime Properties",
    tagline: "Find your dream home",
    shortDescription: "MLS-integrated real estate portal",
    description: "A high-converting real estate platform featuring property listings, virtual tours, and intelligent lead generation.",
    gradient: gradients.realEstate,
    backgroundImage: "/house4.jpg",
    features: [
      "Advanced property search with maps",
      "360° virtual tour integration",
      "Intelligent lead capture forms",
      "Mortgage calculator",
      "Neighborhood insights",
      "Agent contact system"
    ],
    techStack: ["React", "Google Maps API", "Firebase", "SendGrid", "Tailwind CSS"]
  },
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
  }
]

