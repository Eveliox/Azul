import { gradients } from '../constants/designSystem'

export const portfolioProjects = [
  {
    id: 1,
    industry: "restaurant",
    title: "Bella Vista Restaurant",
    tagline: "Fine dining reimagined",
    description: "A sophisticated restaurant website featuring online reservations, interactive menus, and an elegant showcase of culinary artistry.",
    gradient: gradients.restaurant,
    backgroundImage: "/bella-vista-bg.jpg",
    icon: "🍽️",
    features: [
      "Real-time table reservation system",
      "Interactive menu with dietary filters",
      "High-resolution food photography gallery",
      "Event booking for private dining",
      "Multi-language support",
      "Mobile-optimized ordering"
    ],
    techStack: ["React", "Next.js", "Stripe", "MongoDB", "Tailwind CSS"],
    metrics: [
      { label: "Reservations", value: "+45%", description: "increase" },
      { label: "Mobile Orders", value: "+60%", description: "engagement" }
    ]
  },
  {
    id: 2,
    industry: "fitness",
    title: "FitZone Gym & Wellness",
    tagline: "Transform your body, transform your life",
    description: "A comprehensive fitness platform with class scheduling, membership management, and personalized workout tracking.",
    gradient: gradients.fitness,
    backgroundImage: "/gym-bg.jpg",
    icon: "💪",
    features: [
      "Advanced class booking with waitlists",
      "Member portal with progress analytics",
      "Trainer profiles and schedules",
      "On-demand workout video library",
      "Nutrition planning tools",
      "Mobile app integration"
    ],
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe"],
    metrics: [
      { label: "Memberships", value: "+55%", description: "sign-ups" },
      { label: "No-Shows", value: "-30%", description: "reduction" }
    ]
  },
  {
    id: 3,
    industry: "realEstate",
    title: "Prime Properties",
    tagline: "Find your dream home",
    description: "A high-converting real estate platform featuring property listings, virtual tours, and intelligent lead generation.",
    gradient: gradients.realEstate,
    backgroundImage: "/prime-properties-preview.png",
    icon: "🏠",
    features: [
      "Advanced property search with maps",
      "360° virtual tour integration",
      "Intelligent lead capture forms",
      "Mortgage calculator",
      "Neighborhood insights",
      "Agent contact system"
    ],
    techStack: ["React", "Google Maps API", "Firebase", "SendGrid", "Tailwind CSS"],
    metrics: [
      { label: "Lead Generation", value: "3x", description: "more leads" },
      { label: "Conversion", value: "+70%", description: "improvement" }
    ]
  },
  {
    id: 4,
    industry: "ecommerce",
    title: "Nova Commerce",
    tagline: "Modern shopping experience",
    description: "A sleek e-commerce platform with advanced product filtering, seamless checkout, and personalized recommendations.",
    gradient: gradients.ecommerce,
    backgroundImage: "/nova-commerce-preview.png",
    icon: "🛒",
    features: [
      "Advanced product search & filters",
      "One-click checkout",
      "Personalized recommendations",
      "Wishlist & favorites",
      "Order tracking",
      "Customer reviews system"
    ],
    techStack: ["Next.js", "Shopify API", "Stripe", "PostgreSQL", "Redis"],
    metrics: [
      { label: "Sales", value: "+85%", description: "increase" },
      { label: "Cart Abandonment", value: "-40%", description: "reduction" }
    ]
  }
]

