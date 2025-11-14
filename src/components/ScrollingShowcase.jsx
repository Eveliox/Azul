export default function ScrollingShowcase() {
  const showcaseItems = [
    {
      title: "DUNA",
      tagline: "The new standard in compliance",
      description: "Meet the modern platform that accelerates business onboarding, automates manual work and grows revenue.",
      gradient: "from-emerald-600 to-green-700",
      bgImage: "from-emerald-50 to-green-100",
      button: "Get started",
      buttonColor: "bg-emerald-700 hover:bg-emerald-800",
      layout: "landscape"
    },
    {
      title: "algo",
      tagline: "Data-visualization studio",
      description: "We build dashboards that turn data into videos, at scale. Specializing in video automation.",
      gradient: "from-blue-600 via-purple-600 to-pink-600",
      bgImage: "from-blue-900 to-purple-900",
      button: "View work",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      layout: "abstract"
    },
    {
      title: "Cartesia",
      tagline: "The fastest, ultra-realistic voice AI",
      description: "Powered by high performance State Space Model technology. Purpose-built for developers.",
      gradient: "from-gray-900 to-black",
      bgImage: "from-gray-800 to-black",
      button: "Start for free",
      buttonColor: "bg-white text-black hover:bg-gray-100",
      layout: "minimal"
    },
    {
      title: "Haptic",
      tagline: "Turn bold visions into lasting impact",
      description: "We help ambitious teams turn bold visions into lasting impact.",
      gradient: "from-orange-500 to-red-600",
      bgImage: "from-orange-500 to-red-600",
      button: "Get started",
      buttonColor: "bg-white text-orange-600 hover:bg-orange-50",
      layout: "bold"
    },
    {
      title: "sonar",
      tagline: "Build with the best AI answer engine",
      description: "Power your products with the fastest, cheapest grounded search APIs. Get started in minutes.",
      gradient: "from-green-700 to-emerald-800",
      bgImage: "from-green-900 to-emerald-900",
      button: "Start building",
      buttonColor: "bg-green-600 hover:bg-green-700",
      layout: "tech"
    },
    {
      title: "comet",
      tagline: "A personal AI assistant",
      description: "Your intelligent companion for productivity and organization.",
      gradient: "from-white to-gray-100",
      bgImage: "from-white to-gray-50",
      button: "Get Comet",
      buttonColor: "bg-black text-white hover:bg-gray-900",
      layout: "clean"
    },
    {
      title: "PAGE BREAK",
      tagline: "NOVEL READING RETREATS",
      description: "READ TOGETHER. Start and finish reading an entire novel, together.",
      gradient: "from-blue-500 to-yellow-400",
      bgImage: "from-blue-500 to-yellow-400",
      button: "Learn more",
      buttonColor: "bg-white text-blue-600 hover:bg-blue-50",
      layout: "vibrant"
    },
    {
      title: "polarsteps",
      tagline: "One travel app for all your adventures",
      description: "Plan, track & relive your journeys in one beautiful app.",
      gradient: "from-cyan-500 to-teal-600",
      bgImage: "from-cyan-500 to-teal-600",
      button: "Get the app",
      buttonColor: "bg-white text-cyan-600 hover:bg-cyan-50",
      layout: "travel"
    },
    {
      title: "OBO STUDIO",
      tagline: "Creating memorable brand experiences",
      description: "We push past the expected, challenge conventions, and provoke curiosity.",
      gradient: "from-pink-500 via-purple-500 to-indigo-500",
      bgImage: "from-pink-900 to-indigo-900",
      button: "View portfolio",
      buttonColor: "bg-white text-purple-600 hover:bg-purple-50",
      layout: "creative"
    },
    {
      title: "TOWN",
      tagline: "Tax prep that never stops working",
      description: "Expert CPAs with AI that's always looking for new ways to save. Proactive, personal, and impossible to beat.",
      gradient: "from-green-600 to-emerald-700",
      bgImage: "from-green-700 to-emerald-800",
      button: "GET STARTED",
      buttonColor: "bg-white text-green-700 hover:bg-green-50",
      layout: "finance"
    }
  ]

  // Duplicate items multiple times for seamless infinite scroll
  const duplicatedItems = [...showcaseItems, ...showcaseItems, ...showcaseItems]

  const renderCardContent = (item) => {
    switch(item.layout) {
      case "landscape":
        return (
          <div className={`h-full bg-gradient-to-br ${item.bgImage} p-8 flex flex-col justify-between relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-2xl opacity-40"></div>
            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <h4 className="text-2xl font-semibold text-gray-800 mb-4">{item.tagline}</h4>
              <p className="text-gray-700 text-sm mb-6 leading-relaxed max-w-md">{item.description}</p>
              <button className={`px-6 py-3 ${item.buttonColor} rounded-lg font-semibold text-sm transition-all`}>
                {item.button}
              </button>
            </div>
          </div>
        )
      
      case "abstract":
        return (
          <div className={`h-full bg-gradient-to-br ${item.bgImage} p-8 flex flex-col justify-between relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-pink-400 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <div className="text-xs text-gray-300 mb-2">algo</div>
              <h4 className="text-xl font-semibold text-white mb-3">{item.tagline}</h4>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">{item.description}</p>
              <div className="flex gap-2 text-xs text-gray-400 mb-4">
                <span>00 Home</span>
                <span>•</span>
                <span>01 Tech</span>
                <span>•</span>
                <span>02 API</span>
              </div>
              <button className={`px-4 py-2 ${item.buttonColor} rounded-lg font-medium text-sm transition-all`}>
                {item.button}
              </button>
            </div>
          </div>
        )
      
      case "minimal":
        return (
          <div className={`h-full bg-gradient-to-br ${item.bgImage} p-8 flex flex-col justify-between relative overflow-hidden border border-gray-700`}>
            <div className="relative z-10">
              <div className="text-xs text-gray-400 mb-6">Cartesia</div>
              <h4 className="text-2xl font-bold text-white mb-3">{item.tagline}</h4>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{item.description}</p>
              <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-700 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-1 bg-gray-700 rounded-full"></div>
              </div>
              <div className="flex gap-3">
                <button className={`px-4 py-2 ${item.buttonColor} rounded-lg font-medium text-sm transition-all flex-1`}>
                  {item.button}
                </button>
                <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg font-medium text-sm hover:border-gray-500 transition-all">
                  Read docs
                </button>
              </div>
            </div>
          </div>
        )
      
      case "bold":
        return (
          <div className={`h-full bg-gradient-to-br ${item.bgImage} p-8 flex flex-col justify-between relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="text-xs text-white/80 mb-4">Haptic</div>
              <div className="w-12 h-12 border-2 border-white mb-6"></div>
              <h4 className="text-3xl font-bold text-white mb-4 leading-tight">{item.tagline}</h4>
              <button className={`px-6 py-3 ${item.buttonColor} rounded-lg font-bold text-sm transition-all`}>
                {item.button}
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-tl-full"></div>
          </div>
        )
      
      case "tech":
        return (
          <div className={`h-full bg-gradient-to-br ${item.bgImage} p-8 flex flex-col justify-between relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'
            }}></div>
            <div className="relative z-10">
              <div className="text-xs text-green-400 mb-4">sonar</div>
              <h4 className="text-2xl font-bold text-white mb-3">{item.tagline}</h4>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">{item.description}</p>
              <div className="grid grid-cols-3 gap-2 mb-6 text-xs">
                <div className="bg-green-800/50 p-2 rounded text-center text-green-300">Outperforms</div>
                <div className="bg-green-800/50 p-2 rounded text-center text-green-300">Secure</div>
                <div className="bg-green-800/50 p-2 rounded text-center text-green-300">Affordable</div>
              </div>
              <div className="flex gap-3">
                <button className={`px-4 py-2 ${item.buttonColor} rounded-lg font-medium text-sm transition-all`}>
                  {item.button}
                </button>
                <button className="px-4 py-2 border border-green-600 text-green-400 rounded-lg font-medium text-sm hover:bg-green-900/30 transition-all">
                  Docs
                </button>
              </div>
            </div>
          </div>
        )
      
      case "clean":
        return (
          <div className={`h-full bg-gradient-to-br ${item.bgImage} p-8 flex flex-col justify-between relative overflow-hidden border border-gray-200`}>
            <div className="relative z-10">
              <div className="text-xs text-gray-500 mb-6">comet</div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 mb-6 mx-auto"></div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3 text-center">{item.tagline}</h4>
              <p className="text-gray-600 text-sm mb-6 text-center">{item.description}</p>
              <div className="flex justify-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">📑</div>
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">✉️</div>
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">📅</div>
              </div>
              <button className={`w-full px-6 py-3 ${item.buttonColor} rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2`}>
                <span>↓</span> {item.button}
              </button>
            </div>
          </div>
        )
      
      case "vibrant":
        return (
          <div className={`h-full bg-gradient-to-br ${item.bgImage} p-6 flex flex-col relative overflow-hidden`}>
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="text-xs text-white/80 mb-2">PAGE BREAK</div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-300">⭐</span>
                <h4 className="text-2xl font-black text-white uppercase tracking-tight">{item.tagline}</h4>
                <span className="text-yellow-300">⭐</span>
              </div>
              <div className="text-white/90 text-sm mb-6 font-semibold uppercase">{item.description}</div>
              <div className="flex gap-2 text-xs text-white/80 mb-auto">
                <span>RETREATS</span>
                <span>•</span>
                <span>SHOP</span>
                <span>•</span>
                <span>ABOUT</span>
              </div>
              <div className="mt-auto bg-yellow-400 text-black p-4 rounded-lg">
                <div className="text-xs font-bold mb-1">ABOUT</div>
                <div className="text-xs">A NEW WEEKEND READING RETREAT HOSTED IN NEW YORK</div>
              </div>
            </div>
          </div>
        )
      
      case "travel":
        return (
          <div className={`h-full bg-gradient-to-br ${item.bgImage} p-8 flex flex-col justify-between relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="text-xs text-white/80 mb-4">polarsteps</div>
              <h4 className="text-3xl font-bold text-white mb-3">{item.tagline}</h4>
              <p className="text-white/90 text-sm mb-6">{item.description}</p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/30">
                <div className="h-24 bg-white/20 rounded mb-2"></div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/30"></div>
                  <div className="flex-1">
                    <div className="h-2 bg-white/30 rounded mb-1"></div>
                    <div className="h-2 bg-white/30 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
              <button className={`w-full px-6 py-3 ${item.buttonColor} rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2`}>
                <span>📱</span> {item.button}
              </button>
            </div>
          </div>
        )
      
      case "creative":
        return (
          <div className={`h-full bg-gradient-to-br ${item.bgImage} p-8 flex flex-col justify-between relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 left-10 w-20 h-20 bg-pink-400 rounded-lg transform rotate-12 blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-400 rounded-lg transform -rotate-12 blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-indigo-400 rounded-lg transform rotate-45 blur-2xl"></div>
            </div>
            <div className="relative z-10">
              <div className="text-xs text-white/80 mb-4">OBO STUDIO</div>
              <h4 className="text-2xl font-bold text-white mb-3">{item.tagline}</h4>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">{item.description}</p>
              <button className={`px-6 py-3 ${item.buttonColor} rounded-lg font-semibold text-sm transition-all`}>
                {item.button}
              </button>
            </div>
          </div>
        )
      
      case "finance":
        return (
          <div className={`h-full bg-gradient-to-br ${item.bgImage} p-8 flex flex-col justify-between relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="text-xs text-white/80 mb-4">TOWN</div>
              <h4 className="text-3xl font-bold text-white mb-3">{item.tagline}</h4>
              <p className="text-white/90 text-sm mb-6 leading-relaxed">{item.description}</p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-white/20 rounded mb-2"></div>
                    <div className="h-2 bg-white/20 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
              <button className={`w-full px-6 py-3 ${item.buttonColor} rounded-lg font-bold text-sm transition-all uppercase`}>
                {item.button}
              </button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <section className="py-20 overflow-hidden relative bg-black/30">
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Built for Every Industry
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-miami-cyan to-miami-purple mx-auto rounded-full"></div>
      </div>
      
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black via-black/90 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black via-black/90 to-transparent z-10 pointer-events-none"></div>
        
        {/* Scrolling container */}
        <div className="flex gap-6 animate-scroll will-change-transform">
          {duplicatedItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-96 h-[500px] rounded-2xl overflow-hidden border border-gray-800/50 bg-gradient-to-br from-gray-900 to-black group hover:border-gray-700 hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-2xl"
            >
              {renderCardContent(item)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
