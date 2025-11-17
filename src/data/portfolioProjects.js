import { gradients } from '../constants/designSystem'

export const portfolioProjects = [
  {
    id: 1,
    industry: "restaurant",
    title: "Bella Vista Restaurant",
    tagline: "Fine dining reimagined",
    shortDescription: "Modern reservation-driven restaurant site",
    description: "A sophisticated restaurant website featuring online reservations, interactive menus, and an elegant showcase of culinary artistry.",
    gradient: gradients.restaurant,
    backgroundImage: "/waterfront.jpg",
    features: [
      "Real-time table reservation system",
      "Interactive menu with dietary filters",
      "High-resolution food photography gallery",
      "Event booking for private dining",
      "Multi-language support",
      "Mobile-optimized ordering"
    ],
    techStack: ["React", "Next.js", "Stripe", "MongoDB", "Tailwind CSS"]
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
  }
]

