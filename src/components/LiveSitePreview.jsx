import { useEffect, useState } from 'react'

export default function LiveSitePreview({ project, isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState('LUNCH')
  const [realEstateViewMode, setRealEstateViewMode] = useState('list')
  const [showRealEstateFilters, setShowRealEstateFilters] = useState(false)
  // Auto-open chatbot for Nova Commerce to show in preview
  const [chatOpen, setChatOpen] = useState(project?.industry === 'ecommerce')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hi! I'm Nova, your AI shopping assistant. How can I help you today?", sender: 'bot', timestamp: new Date() }
  ])
  const [chatInput, setChatInput] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    '/beige-boots.webp',
    '/red-shoes.webp',
    '/small-boots.webp'
  ]

  // Auto-advance slideshow for Nova Commerce
  useEffect(() => {
    if (project?.industry === 'ecommerce') {
      setCurrentSlide(0) // Reset to first slide when opening Nova Commerce
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % 3)
      }, 5000) // Change slide every 5 seconds
      return () => clearInterval(interval)
    }
  }, [project?.industry])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !project) return null

  // Render based on industry
  const renderSite = () => {
    switch(project.industry) {
      case 'restaurant':
        return renderRestaurantSite(activeCategory, setActiveCategory)
      case 'fitness':
        return renderFitnessSite()
      case 'realEstate':
        return renderRealEstateSite(realEstateViewMode, setRealEstateViewMode, showRealEstateFilters, setShowRealEstateFilters)
      case 'ecommerce':
        return renderEcommerceSite(chatOpen, setChatOpen, chatMessages, setChatMessages, chatInput, setChatInput, currentSlide, setCurrentSlide, slides)
      case 'medical':
        return renderMedicalSite()
      case 'personal':
        return renderPersonalSite()
      case 'travel':
        return renderTravelSite()
      case 'finance':
        return renderFinanceSite()
      default:
        return renderRestaurantSite(activeCategory, setActiveCategory)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[120] w-12 h-12 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm rounded-full border border-gray-700/50 hover:bg-gray-800 transition-all duration-300 group"
        aria-label="Close"
      >
        <span className="text-gray-400 text-2xl group-hover:text-white transition-colors">×</span>
      </button>

      <div 
        className="min-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        {renderSite()}
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[120] bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-lg px-6 py-3 text-sm text-gray-300">
        <span className="mr-2">👁️</span>
        Demo Preview - Interactive Website Interface
      </div>
    </div>
  )

  // ========== RESTAURANT SITE - Elegant Fine Dining ==========
  function renderRestaurantSite(activeCategory, setActiveCategory) {
    return (
      <div className="bg-white text-gray-900 min-h-screen">
        {/* Waterfront Hero Section */}
        <section className="relative h-screen overflow-hidden">
          {/* Background Video */}
          <div className="absolute inset-0">
            <video 
              key="bella-vista-video"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-105"
            >
              <source src={`/bella-vista-bg.mp4?v=${Date.now()}`} type="video/mp4" />
            </video>
            {/* Sophisticated overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent"></div>
            {/* Subtle vignette effect */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20"></div>
          </div>
          
          {/* Advanced Elegant Header - Glassmorphism with Floating Design */}
          <header className="relative z-20 px-8 py-5 flex justify-between items-center">
            <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-r from-black/40 via-black/30 to-black/40 border-b border-white/10"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="text-2xl font-light text-white tracking-[0.3em] uppercase">BELLA VISTA</div>
              <div className="hidden lg:block h-6 w-px bg-white/20"></div>
              <div className="hidden lg:block text-xs text-white/70 font-light tracking-widest uppercase">Since 1985</div>
            </div>
            <nav className="hidden md:flex gap-8 text-sm text-white/90 font-light uppercase tracking-wider relative z-10">
              <a href="#" className="hover:text-white transition-all duration-300 relative group px-2 py-1">
                <span className="relative z-10">Menu</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:w-full transition-all duration-500"></span>
                <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
              <a href="#" className="hover:text-white transition-all duration-300 relative group px-2 py-1">
                <span className="relative z-10">Reservations</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:w-full transition-all duration-500"></span>
                <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
              <a href="#" className="hover:text-white transition-all duration-300 relative group px-2 py-1">
                <span className="relative z-10">About</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:w-full transition-all duration-500"></span>
                <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
            </nav>
            <button className="relative z-10 px-8 py-3 bg-gradient-to-r from-white/95 to-white backdrop-blur-md text-gray-900 rounded-full text-sm font-light uppercase tracking-wider hover:from-white hover:to-white/95 transition-all duration-300 flex items-center gap-2 shadow-2xl hover:shadow-3xl hover:scale-105 transform border border-white/20">
              <span className="text-lg">📅</span> BOOK NOW
            </button>
          </header>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <div className="mb-6">
              <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-white/90 font-light tracking-widest uppercase mb-8">
                Since 1985
              </div>
            </div>
            <h1 className="text-8xl md:text-9xl font-light text-white mb-6 tracking-tight leading-none" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Bella Vista
            </h1>
            <div className="w-24 h-0.5 bg-red-500/90 mx-auto mb-10"></div>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mb-14 font-light leading-relaxed tracking-wide">
              WITH ITS TRULY UNIQUE LOUNGE SETTING AND PICTURESQUE WATERFRONT DINING IT IS ONE OF BRICKELL'S MOST UPSCALE PREFERRED DESTINATIONS.
            </p>
            <button className="px-12 py-5 bg-white/95 backdrop-blur-sm text-gray-900 rounded-sm hover:bg-white transition-all duration-300 font-light text-base uppercase tracking-widest flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105">
              Book Now <span className="text-xl">→</span>
            </button>
          </div>
        </section>

        {/* Story Section - Light background with large headlines */}
        <section className="py-40 px-8 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-24 items-start mb-40">
              <div className="sticky top-32">
                <h2 className="text-7xl md:text-8xl font-light text-gray-900 mb-8 leading-[0.9] uppercase tracking-tight">
                  IMAGINE STEPPING INTO A PLACE...
                </h2>
              </div>
              <div className="space-y-8 text-lg text-gray-700 leading-relaxed font-light">
                <p className="text-xl">
                  Where every detail is designed to transport you to a magic World. As you enter Bella Vista, you're greeted by a warm breeze, and it becomes clear that this isn't just dinner—it's a waterfront dining experience that beckons you to relax and unwind. The sky shifts from soft orange to deep purple as the sun sets, painting a breathtaking backdrop to your evening as you enjoy your meal or your Lovers Lane Lemonade.
                </p>
                <p className="text-xl">
                  As you sip, you notice the other guests around you, laughing and enjoying themselves, each one caught up in their own moment of joy.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-24 items-start mb-20">
              <div className="sticky top-32">
                <h2 className="text-7xl md:text-8xl font-light text-gray-900 mb-8 leading-[0.9] uppercase tracking-tight">
                  THE AIR IS FILLED WITH THE SOUND...
                </h2>
              </div>
              <div className="space-y-8 text-lg text-gray-700 leading-relaxed font-light">
                <p className="text-xl">
                  Of clinking glasses and lively conversation. It's as if you've entered a hidden oasis in the heart of the city. Then, there's the food—vibrant, creative, and bursting with flavor. Each dish is an invitation to explore, to share, and to savor. You start with a selection of tapas, each one more enticing than the last, and move on to a main course that leaves you wondering how it could get any better. But it does, with a dessert that feels like a sweet dream. By the time the evening ends, you're already planning your next visit, knowing that no two experiences here are ever the same.
                </p>
              </div>
            </div>
            <div className="text-center pt-12">
              <button className="px-14 py-5 border-2 border-gray-900 text-gray-900 uppercase font-light text-sm tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all duration-300">
                SO BOOK NOW!
              </button>
            </div>
          </div>
        </section>

        {/* Food Photography Collage */}
        <section className="py-32 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-6xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight">
                AT BELLA VISTA
              </h2>
              <div className="w-24 h-0.5 bg-gray-300 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Cocktail */}
              <div className="relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer">
                <img 
                  src="/cocktail.jpg" 
                  alt="Craft Cocktails" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-xl transform group-hover:translate-y-[-4px] transition-all duration-300">
                    <h3 className="text-2xl font-light text-gray-900 mb-2">Craft Cocktails</h3>
                    <p className="text-sm text-gray-600 font-light">Handcrafted with premium spirits</p>
                  </div>
                </div>
              </div>

              {/* Steak */}
              <div className="relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer">
                <img 
                  src="/steak.jpg" 
                  alt="Prime Cuts" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-xl transform group-hover:translate-y-[-4px] transition-all duration-300">
                    <h3 className="text-2xl font-light text-gray-900 mb-2">Prime Cuts</h3>
                    <p className="text-sm text-gray-600 font-light">Perfectly grilled to perfection</p>
                  </div>
                </div>
              </div>

              {/* Pasta */}
              <div className="relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer">
                <img 
                  src="/pasta.jpg" 
                  alt="Fresh Pasta" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-xl transform group-hover:translate-y-[-4px] transition-all duration-300">
                    <h3 className="text-2xl font-light text-gray-900 mb-2">Fresh Pasta</h3>
                    <p className="text-sm text-gray-600 font-light">Made daily with authentic recipes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dark Menu Section */}
        <section className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white min-h-screen py-24">
          <div className="max-w-6xl mx-auto px-8">
            {/* Menu Header */}
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-light mb-6 uppercase tracking-wider">
                EXPLORE O<span className="relative inline-block">
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="relative">UR</span>
                </span> MENU
              </h2>
              <div className="w-24 h-0.5 bg-yellow-500/50 mx-auto"></div>
            </div>

            {/* Category Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {['LUNCH', 'DINNER', 'WEEKEND BRUNCH', 'DRINKS & COCKTAILS', 'HAPPY HOUR', 'CRAZY WEDNESDAY', 'WINES', 'BREEZY BITES'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-md text-sm font-light uppercase tracking-wider transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Item Labels */}
            <div className="flex gap-8 justify-center mb-12 text-sm text-white/70 font-light">
              <div className="flex items-center gap-2">
                <span className="text-lg">❄️</span> <span>New Item</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌿</span> <span>Vegetarian</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🥩</span> <span>Raw</span>
              </div>
            </div>

            {/* Highlighted Item */}
            <div className="border border-yellow-500/40 rounded-2xl p-8 mb-16 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm shadow-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-light mb-3">Fresh Baked Cornbread</h3>
                  <p className="text-white/70 text-base font-light leading-relaxed">Wisconsin cheddar, chives & Irish whipped butter</p>
                </div>
                <div className="text-2xl font-light text-yellow-400">$8.99</div>
              </div>
            </div>

            {/* Menu Sections */}
            <div className="space-y-12">
              {[
                { title: 'APPETIZERS', items: [
                  { name: 'Bruschetta Trio', desc: 'Tomato, basil, mozzarella', price: '$12.99' },
                  { name: 'Calamari Fritti', desc: 'Crispy squid rings with marinara', price: '$14.99' }
                ]},
                { title: 'DAILY LUNCH SPECIALS * MONDAY TO FRIDAY', price: '$17.99', items: [
                  { name: 'Pasta of the Day', desc: 'Chef\'s selection', price: '$17.99' },
                  { name: 'Soup & Salad', desc: 'House soup with fresh greens', price: '$17.99' }
                ]},
                { title: 'SALADS WITH SOMETHING ON TOP', price: '$19.99', items: [
                  { name: 'Caesar Salad', desc: 'Romaine, parmesan, croutons', price: '$19.99' },
                  { name: 'Caprese Salad', desc: 'Fresh mozzarella, tomatoes, basil', price: '$19.99' }
                ]},
                { title: 'SANDWICHES: ALL SERVED WITH FRENCH FRIES', items: [
                  { name: 'Italian Panini', desc: 'Prosciutto, mozzarella, arugula', price: '$16.99' },
                  { name: 'Grilled Chicken Club', desc: 'Bacon, avocado, tomato', price: '$18.99' }
                ]},
                { title: 'ENTREES', price: '$25.99', items: [
                  { name: 'Grilled Salmon', desc: 'Lemon butter, seasonal vegetables', price: '$28.99' },
                  { name: 'Filet Mignon', desc: '8oz, mashed potatoes, asparagus', price: '$32.99' }
                ]}
              ].map((section, i) => (
                <div key={i} className="border-b border-white/10 pb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl md:text-4xl font-light text-yellow-400/90 uppercase tracking-wide">
                      {section.title}
                    </h3>
                    {section.price && (
                      <span className="text-xl font-light text-yellow-400/90">{section.price}</span>
                    )}
                    <span className="text-2xl text-white/30 font-light">+</span>
                  </div>
                  <div className="space-y-6 ml-6">
                    {section.items.map((item, j) => (
                      <div key={j} className="flex justify-between items-start group cursor-pointer">
                        <div className="flex-1">
                          <h4 className="text-xl font-light mb-2 group-hover:text-yellow-400/80 transition-colors">{item.name}</h4>
                          <p className="text-sm text-white/60 font-light leading-relaxed">{item.desc}</p>
                        </div>
                        <span className="text-lg font-light ml-6 text-yellow-400/90">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dark Footer CTA */}
        <section className="bg-gradient-to-b from-gray-900 to-black border-t border-white/10 py-20">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-light uppercase tracking-wider text-white">
              EXPLORE OUR MENU
            </h2>
          </div>
        </section>
      </div>
    )
  }

  // ========== FITNESS SITE - Equinox-Inspired Luxury ==========
  function renderFitnessSite() {
    return (
      <div className="bg-black text-white min-h-screen">
        {/* Advanced Premium Header - Gradient with Split Design */}
        <header className="bg-gradient-to-r from-black via-gray-950 to-black backdrop-blur-2xl px-8 py-5 flex justify-between items-center border-b border-white/5 sticky top-0 z-50 shadow-2xl">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-2xl font-light tracking-[0.2em] uppercase text-white">FITZONE</div>
              <div className="text-[10px] text-white/50 font-light tracking-widest uppercase">High Performance</div>
            </div>
          </div>
          <nav className="hidden lg:flex gap-6 text-xs font-light tracking-widest uppercase">
            <a href="#" className="hover:text-white transition-all duration-300 relative group px-3 py-2">
              <span className="relative z-10 text-white/80">Clubs</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-500"></span>
              <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
            <a href="#" className="hover:text-white transition-all duration-300 relative group px-3 py-2">
              <span className="relative z-10 text-white/80">Membership</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-500"></span>
              <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
            <a href="#" className="hover:text-white transition-all duration-300 relative group px-3 py-2">
              <span className="relative z-10 text-white/80">Classes</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-500"></span>
              <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
            <a href="#" className="hover:text-white transition-all duration-300 relative group px-3 py-2">
              <span className="relative z-10 text-white/80">Training</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-500"></span>
              <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
            <a href="#" className="hover:text-white transition-all duration-300 relative group px-3 py-2">
              <span className="relative z-10 text-white/80">Spa</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-500"></span>
              <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
          </nav>
          <button className="px-8 py-3 bg-gradient-to-r from-white to-gray-100 text-black hover:from-white hover:to-white transition-all duration-300 text-xs font-light tracking-widest uppercase shadow-2xl hover:shadow-3xl transform hover:scale-105 rounded-sm border border-white/20">
            JOIN NOW
          </button>
        </header>

        {/* Hero Section with Background Image */}
        <section className="relative h-screen overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="/gym-bg.jpg" 
              alt="FitZone Gym" 
              className="w-full h-full object-cover scale-105 transition-transform duration-700"
            />
            {/* Sophisticated overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent"></div>
            {/* Subtle vignette effect */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30"></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <div className="mb-8">
              <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-white/90 font-light tracking-[0.3em] uppercase mb-8">
                Since 1991
              </div>
            </div>
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-light mb-8 tracking-tight leading-[0.95] uppercase">
              YOUR HIGH-PERFORMANCE<br />SANCTUARY
            </h1>
            <div className="w-32 h-0.5 bg-white/50 mx-auto mb-10"></div>
            <p className="text-xl md:text-2xl text-white/95 mb-14 font-light max-w-3xl leading-relaxed tracking-wide">
              Become a Member and gain access to 113 iconic Clubs featuring Unlimited Signature Classes and exclusive luxury amenities.
            </p>
            <button className="px-14 py-6 bg-white/95 backdrop-blur-sm text-black hover:bg-white transition-all duration-300 font-light text-base tracking-[0.2em] uppercase shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center gap-3">
              JOIN NOW <span className="text-xl">→</span>
            </button>
          </div>
        </section>

        {/* One Membership Section */}
        <section className="py-40 px-6 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-10 tracking-tight leading-tight">
              One Membership.<br />Limitless Potential.
            </h2>
            <div className="w-24 h-0.5 bg-white/30 mx-auto mb-12"></div>
            <p className="text-xl md:text-2xl text-white/80 mb-16 font-light max-w-3xl mx-auto leading-relaxed">
              Unlimited Signature Classes, precision-backed Personal Training, and exclusive amenities to recover and regenerate.
            </p>
            <button className="px-12 py-5 border-2 border-white/30 hover:border-white/60 hover:bg-white/5 transition-all duration-300 text-sm font-light tracking-[0.2em] uppercase">
              Explore Member Benefits
            </button>
          </div>
        </section>

        {/* Where Luxury and Fitness Meet */}
        <section className="py-32 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 tracking-tight leading-tight">
                Where Luxury<br />and Fitness Meet
              </h2>
              <div className="w-24 h-0.5 bg-white/30 mx-auto mb-10"></div>
              <p className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed mb-12">
                Award-winning spaces and regenerative amenities designed to drive your performance forward.
              </p>
              <button className="px-12 py-5 border-2 border-white/30 hover:border-white/60 hover:bg-white/5 transition-all duration-300 text-sm font-light tracking-[0.2em] uppercase">
                Find A Club
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Signature Classes */}
              <div className="group cursor-pointer">
                <div className="relative h-[450px] overflow-hidden mb-6 rounded-lg border border-white/5 group-hover:border-white/20 transition-all duration-500">
                  <img 
                    src="/classes.jpg" 
                    alt="Signature Classes" 
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl font-light mb-3 tracking-wide group-hover:text-white transition-colors">Signature Classes</h3>
                    <p className="text-sm text-white/70 font-light leading-relaxed">
                      New and Unlimited Classes exclusive to FitZone. Designed for the individual. Powered by the collective.
                    </p>
                  </div>
                </div>
                <button className="text-sm font-light tracking-wider uppercase hover:text-white transition-colors duration-300 flex items-center gap-2 group-hover:gap-4">
                  Discover Classes <span className="text-lg">→</span>
                </button>
              </div>

              {/* Personal Training */}
              <div className="group cursor-pointer">
                <div className="relative h-[450px] overflow-hidden mb-6 rounded-lg border border-white/5 group-hover:border-white/20 transition-all duration-500">
                  <img 
                    src="/personal-training.jpg" 
                    alt="Personal Training" 
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl font-light mb-3 tracking-wide group-hover:text-white transition-colors">Personal Training</h3>
                    <p className="text-sm text-white/70 font-light leading-relaxed">
                      Precision-backed 1:1 Personal Training with certified COACHES, dedicated to maximizing your potential.
                    </p>
                  </div>
                </div>
                <button className="text-sm font-light tracking-wider uppercase hover:text-white transition-colors duration-300 flex items-center gap-2 group-hover:gap-4">
                  Discover Personal Training <span className="text-lg">→</span>
                </button>
              </div>

              {/* Authentic Pilates */}
              <div className="group cursor-pointer">
                <div className="relative h-[450px] overflow-hidden mb-6 rounded-lg border border-white/5 group-hover:border-white/20 transition-all duration-500">
                  <img 
                    src="/pilates.jpg" 
                    alt="Authentic Pilates" 
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl font-light mb-3 tracking-wide group-hover:text-white transition-colors">Authentic Pilates</h3>
                    <p className="text-sm text-white/70 font-light leading-relaxed">
                      Studio Pilates sessions with 1:1 instruction. Tone your core and activate your mind-body connection.
                    </p>
                  </div>
                </div>
                <button className="text-sm font-light tracking-wider uppercase hover:text-white transition-colors duration-300 flex items-center gap-2 group-hover:gap-4">
                  Discover Pilates <span className="text-lg">→</span>
                </button>
              </div>

              {/* The Spa */}
              <div className="group cursor-pointer">
                <div className="relative h-[450px] overflow-hidden mb-6 rounded-lg border border-white/5 group-hover:border-white/20 transition-all duration-500">
                  <img 
                    src="/spa.jpg" 
                    alt="The Spa at FitZone" 
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl font-light mb-3 tracking-wide group-hover:text-white transition-colors">The Spa at FitZone</h3>
                    <p className="text-sm text-white/70 font-light leading-relaxed">
                      Relax. Recover. Want It All at The Spa, where innovative treatments rejuvenate the body at a cellular level.
                    </p>
                  </div>
                </div>
                <button className="text-sm font-light tracking-wider uppercase hover:text-white transition-colors duration-300 flex items-center gap-2 group-hover:gap-4">
                  Discover The Spa <span className="text-lg">→</span>
                </button>
              </div>

              {/* Exclusive Amenities */}
              <div className="group cursor-pointer">
                <div className="relative h-[450px] overflow-hidden mb-6 rounded-lg border border-white/5 group-hover:border-white/20 transition-all duration-500">
                  <img 
                    src="/amenities.jpg" 
                    alt="Exclusive Amenities" 
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl font-light mb-3 tracking-wide group-hover:text-white transition-colors">Exclusive Amenities</h3>
                    <p className="text-sm text-white/70 font-light leading-relaxed">
                      Access immaculate locker rooms, saunas, and steam rooms equipped with premium products.
                    </p>
                  </div>
                </div>
                <button className="text-sm font-light tracking-wider uppercase hover:text-white transition-colors duration-300 flex items-center gap-2 group-hover:gap-4">
                  Discover More <span className="text-lg">→</span>
                </button>
              </div>

              {/* Iconic Spaces */}
              <div className="group cursor-pointer">
                <div className="relative h-[450px] overflow-hidden mb-6 rounded-lg border border-white/5 group-hover:border-white/20 transition-all duration-500">
                  <img 
                    src="/spaces.jpg" 
                    alt="Iconic Spaces" 
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl font-light mb-3 tracking-wide group-hover:text-white transition-colors">Iconic Spaces</h3>
                    <p className="text-sm text-white/70 font-light leading-relaxed">
                      Each Club is designed with Award-Winning Precision to reflect our High-Performance Community.
                    </p>
                  </div>
                </div>
                <button className="text-sm font-light tracking-wider uppercase hover:text-white transition-colors duration-300 flex items-center gap-2 group-hover:gap-4">
                  Discover More <span className="text-lg">→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FitZone+ App Section */}
        <section className="py-40 px-6 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-10 tracking-tight">
              FitZone+
            </h2>
            <div className="w-24 h-0.5 bg-white/30 mx-auto mb-12"></div>
            <p className="text-xl md:text-2xl text-white/80 mb-16 font-light max-w-3xl mx-auto leading-relaxed">
              Get exclusive access to 1,000+ hours of live and on-demand classes. Wherever you are. Whenever you're ready.
            </p>
            <button className="px-12 py-5 border-2 border-white/30 hover:border-white/60 hover:bg-white/5 transition-all duration-300 text-sm font-light tracking-[0.2em] uppercase">
              Explore the App
            </button>
          </div>
        </section>
      </div>
    )
  }

  // ========== REAL ESTATE SITE - Zillow-Inspired Design ==========
  function renderRealEstateSite(viewMode, setViewMode, showFilters, setShowFilters) {
    
    const properties = [
      { 
        id: 1,
        address: '123 Main St, Downtown, CA 90210', 
        price: '$450,000',
        beds: 2, 
        baths: 2, 
        sqft: '1,200',
        year: '2018',
        image: '/house1.jpg',
        daysOnMarket: 12,
        status: 'For Sale',
        type: 'Condo'
      },
      { 
        id: 2,
        address: '456 Oak Avenue, Suburbia, CA 90211', 
        price: '$650,000',
        beds: 4, 
        baths: 3, 
        sqft: '2,400',
        year: '2020',
        image: '/house2.jpg',
        daysOnMarket: 5,
        status: 'For Sale',
        type: 'House'
      },
      { 
        id: 3,
        address: '789 Beach Drive, Coastal, CA 90212', 
        price: '$1,200,000',
        beds: 5, 
        baths: 4, 
        sqft: '3,800',
        year: '2015',
        image: '/house3.jpg',
        daysOnMarket: 8,
        status: 'For Sale',
        type: 'House'
      },
      { 
        id: 4,
        address: '321 Park Lane, Riverside, CA 90213', 
        price: '$380,000',
        beds: 3, 
        baths: 2, 
        sqft: '1,800',
        year: '2019',
        image: '/house4.jpg',
        daysOnMarket: 3,
        status: 'For Sale',
        type: 'Townhouse'
      },
      { 
        id: 5,
        address: '654 Hill Street, Uptown, CA 90214', 
        price: '$520,000',
        beds: 3, 
        baths: 2.5, 
        sqft: '2,100',
        year: '2021',
        image: '/house5.jpg',
        daysOnMarket: 15,
        status: 'For Sale',
        type: 'House'
      },
      { 
        id: 6,
        address: '987 Valley Road, Hillside, CA 90215', 
        price: '$890,000',
        beds: 4, 
        baths: 3, 
        sqft: '2,800',
        year: '2017',
        image: '/house6.jpg',
        daysOnMarket: 20,
        status: 'For Sale',
        type: 'House'
      }
    ]

    return (
      <div className="bg-gray-50 text-gray-900 min-h-screen">
        {/* Clean Modern Header - Professional Real Estate Design */}
        <header className="bg-white border-b-2 border-blue-600 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
          <div className="text-3xl font-bold text-blue-600 tracking-tight">Prime Properties</div>
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors relative group">
              <span>Buy</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors relative group">
              <span>Rent</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors relative group">
              <span>Sell</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors relative group">
              <span>Home Loans</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors relative group">
              <span>Agent finder</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="px-5 py-2 text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors">Sign in</button>
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-colors shadow-lg hover:shadow-xl">List your home</button>
          </div>
        </header>

        {/* Enhanced Hero Search Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 border-b border-gray-200 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Find your place
            </h1>
            <p className="text-center text-gray-600 mb-8 text-lg">Search homes, condos, and more</p>
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Enter an address, neighborhood, city, or ZIP code" 
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  />
                </div>
                <button className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors whitespace-nowrap shadow-md">
                  Search
                </button>
              </div>
              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium">
                  Price: Any
                </button>
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium">
                  Beds: Any
                </button>
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium">
                  Baths: Any
                </button>
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium">
                  Home Type: Any
                </button>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 text-sm border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  More Filters
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <section className="bg-white border-b border-gray-200 py-6 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Min Price</label>
                  <input type="number" placeholder="$0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Max Price</label>
                  <input type="number" placeholder="No max" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Property Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Types</option>
                    <option>House</option>
                    <option>Condo</option>
                    <option>Townhouse</option>
                    <option>Multi-family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Year Built</label>
                  <input type="number" placeholder="Any year" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Content Area - List/Map Toggle */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Homes for sale</h2>
                <p className="text-gray-600">6 homes available</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  List View
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Map View
                </button>
              </div>
            </div>

            {viewMode === 'list' ? (
              /* Property Listings Grid */
              <div className="grid md:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all cursor-pointer group">
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img 
                        src={property.image} 
                        alt={property.address}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {property.status}
                      </div>
                      {/* Favorite button */}
                      <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors z-10">
                        <span className="text-xl">♡</span>
                      </button>
                      {/* Image count badge */}
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                        24 photos
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-2xl font-bold text-gray-900">{property.price}</div>
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {property.daysOnMarket} days on market
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <span className="font-semibold">{property.beds} bd</span>
                        <span>•</span>
                        <span className="font-semibold">{property.baths} ba</span>
                        <span>•</span>
                        <span className="font-semibold">{property.sqft} sqft</span>
                        <span>•</span>
                        <span>{property.type}</span>
                      </div>
                      <div className="text-sm text-gray-700 mb-3 font-medium">{property.address}</div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          Built in {property.year}
                        </div>
                        <div className="text-sm font-semibold text-blue-600">
                          Est. ${Math.round(parseInt(property.price.replace(/[^0-9]/g, '')) / 30 / 1000)}k/mo
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Interactive Map View */
              <div className="grid md:grid-cols-3 gap-6">
                {/* Map */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                    <div className="relative h-[600px] bg-gradient-to-br from-green-100 via-green-50 to-blue-50">
                      {/* Map-like background with streets */}
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `
                          repeating-linear-gradient(0deg, transparent, transparent 40px, #333 40px, #333 41px),
                          repeating-linear-gradient(90deg, transparent, transparent 40px, #333 40px, #333 41px)
                        `
                      }}></div>
                      
                      {/* Property markers on map */}
                      {properties.map((property, i) => {
                        const positions = [
                          { top: '20%', left: '25%' },
                          { top: '35%', left: '60%' },
                          { top: '50%', left: '15%' },
                          { top: '65%', left: '75%' },
                          { top: '40%', left: '45%' },
                          { top: '70%', left: '30%' }
                        ]
                        return (
                          <div 
                            key={property.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                            style={positions[i]}
                          >
                            <div className="relative">
                              <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center transform group-hover:scale-125 transition-transform">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                              </div>
                              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                <div className="text-sm font-bold text-gray-900">{property.price}</div>
                                <div className="text-xs text-gray-600">{property.address}</div>
                                <div className="text-xs text-gray-500 mt-1">{property.beds}bd • {property.baths}ba • {property.sqft}sqft</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}

                      {/* Map controls */}
                      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2">
                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                          <span className="text-xl">+</span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                          <span className="text-xl">−</span>
                        </button>
                        <div className="border-t border-gray-300 my-1"></div>
                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                          <span className="text-lg">⌖</span>
                        </button>
                      </div>

                      {/* Map type selector */}
                      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-1 flex gap-1">
                        <button className="px-4 py-2 text-sm font-medium rounded hover:bg-gray-100 transition-colors">Map</button>
                        <button className="px-4 py-2 text-sm font-medium rounded hover:bg-gray-100 transition-colors text-gray-500">Satellite</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property List Sidebar */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {properties.map((property) => (
                    <div key={property.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer group">
                      <div className="flex gap-3 p-3">
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <img 
                            src={property.image} 
                            alt={property.address}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-bold text-gray-900 mb-1">{property.price}</div>
                          <div className="text-xs text-gray-600 mb-1">{property.beds}bd • {property.baths}ba • {property.sqft}sqft</div>
                          <div className="text-xs text-gray-500 truncate">{property.address}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Featured Neighborhoods */}
        <section className="py-16 px-6 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Explore Popular Neighborhoods</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: 'Downtown', count: '24 homes', avgPrice: '$485k', image: '/downtown.jpg' },
                { name: 'Suburbia', count: '18 homes', avgPrice: '$620k', image: '/suburbia.jpg' },
                { name: 'Coastal', count: '12 homes', avgPrice: '$1.1M', image: '/coastal.jpg' },
                { name: 'Riverside', count: '31 homes', avgPrice: '$395k', image: '/riverside.jpg' }
              ].map((neighborhood, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={neighborhood.image} 
                      alt={neighborhood.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-white font-bold text-lg drop-shadow-lg">{neighborhood.name}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-600 mb-1">{neighborhood.count}</div>
                    <div className="text-lg font-bold text-gray-900">Avg. {neighborhood.avgPrice}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Agents Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Top Agents in Your Area</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Sarah Johnson', sales: '127 sales', rating: 4.9, image: 'from-blue-300 to-blue-500' },
                { name: 'Michael Chen', sales: '98 sales', rating: 4.8, image: 'from-green-300 to-green-500' },
                { name: 'Emily Rodriguez', sales: '156 sales', rating: 5.0, image: 'from-purple-300 to-purple-500' }
              ].map((agent, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${agent.image} flex items-center justify-center text-2xl text-white font-bold`}>
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{agent.name}</div>
                      <div className="text-sm text-gray-600">{agent.sales}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-semibold">{agent.rating}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors">
                    Contact Agent
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Insights */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Market Insights</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="text-sm text-blue-700 font-semibold mb-2">Median Home Price</div>
                <div className="text-3xl font-bold text-blue-900 mb-1">$625,000</div>
                <div className="text-sm text-blue-700">↑ 5.2% from last year</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="text-sm text-green-700 font-semibold mb-2">Average Days on Market</div>
                <div className="text-3xl font-bold text-green-900 mb-1">28 days</div>
                <div className="text-sm text-green-700">↓ 12% faster than last year</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="text-sm text-purple-700 font-semibold mb-2">Price per Sqft</div>
                <div className="text-3xl font-bold text-purple-900 mb-1">$312</div>
                <div className="text-sm text-purple-700">↑ 3.8% from last year</div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Buy a home</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">Find your place with an immersive photo experience and the most listings, including things you won't find anywhere else.</p>
                <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
                  Browse homes <span>→</span>
                </button>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Sell a home</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">No matter what path you take to sell your home, we can help you navigate a successful sale.</p>
                <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
                  See your options <span>→</span>
                </button>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Rent a home</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">We're creating a seamless online experience – from shopping on the largest rental network, to applying, to paying rent.</p>
                <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
                  Find rentals <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ========== ECOMMERCE SITE - Allbirds-Inspired Shoe Store ==========
  function renderEcommerceSite(chatOpen, setChatOpen, chatMessages, setChatMessages, chatInput, setChatInput, currentSlide, setCurrentSlide, slides) {
    const goToSlide = (index) => {
      setCurrentSlide(index)
    }

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + 3) % 3)
    }

    const handleSendMessage = (e) => {
      e.preventDefault()
      if (!chatInput.trim()) return

      const userMessage = {
        id: Date.now(),
        text: chatInput,
        sender: 'user',
        timestamp: new Date()
      }

      setChatMessages(prev => [...prev, userMessage])
      setChatInput('')

      // Simulate AI response
      setTimeout(() => {
        const botResponse = generateBotResponse(chatInput.toLowerCase())
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        }])
        
        // Auto-scroll to bottom after message
        setTimeout(() => {
          const chatContainer = document.getElementById('chat-messages')
          if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight
          }
        }, 100)
      }, 800)
    }

    const generateBotResponse = (input) => {
      if (input.includes('size') || input.includes('fit')) {
        return "Our shoes come in sizes 5-14 for both men and women. We recommend going half a size up if you're between sizes. Would you like to see our size guide?"
      } else if (input.includes('price') || input.includes('cost') || input.includes('expensive')) {
        return "Our shoes range from $98 to $135. We offer free shipping on orders over $75 and easy returns. Would you like to see our bestsellers?"
      } else if (input.includes('material') || input.includes('sustainable') || input.includes('eco')) {
        return "All our shoes are made from sustainable materials like wool, tree fiber, and sugarcane. They're soft, breathable, and better for the planet! Would you like to learn more about our sustainability practices?"
      } else if (input.includes('return') || input.includes('refund') || input.includes('exchange')) {
        return "We offer free returns within 30 days of purchase. Items must be unworn and in original packaging. Would you like help with a return?"
      } else if (input.includes('shipping') || input.includes('delivery') || input.includes('ship')) {
        return "We offer free shipping on orders over $75. Standard shipping takes 3-5 business days. Express shipping (2-3 days) is available for $15. Would you like to check out?"
      } else if (input.includes('men') || input.includes('mens') || input.includes('male')) {
        return "Our men's collection includes the Tree Runner, Wool Runner NZ, and Tree Dasher 2. They're all designed for comfort and style. Would you like to see the men's collection?"
      } else if (input.includes('women') || input.includes('womens') || input.includes('female') || input.includes('ladies')) {
        return "Our women's collection features the Wool Cruiser, Tree Runner, and Tree Dasher 2. All available in multiple colors! Would you like to browse the women's collection?"
      } else if (input.includes('color') || input.includes('colour') || input.includes('available')) {
        return "We offer a variety of colors including Jet Black, Dark Camel, Thunder Green, and Dark Grey. Each style has different color options. Which product are you interested in?"
      } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        return "Hello! I'm here to help you find the perfect pair of shoes. What are you looking for today?"
      } else if (input.includes('help') || input.includes('question')) {
        return "I'm here to help! I can assist with sizing, product information, shipping, returns, and more. What would you like to know?"
      } else {
        return "That's a great question! I'd be happy to help. Could you tell me more about what you're looking for? I can help with product recommendations, sizing, shipping, or anything else you need."
      }
    }
    return (
      <div className="bg-white text-gray-900 min-h-screen">
        {/* Advanced Floating Header - Minimalist with Icon System */}
        <header className="bg-white/90 backdrop-blur-2xl border-b border-gray-100/50 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xl font-bold tracking-tight text-gray-900">Nova Commerce</div>
              <div className="text-[10px] text-gray-500 font-medium">Sustainable • Comfortable</div>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest">
            <a href="#" className="relative group hover:text-gray-900 transition-all duration-300 text-gray-600 px-2 py-1">
              <span className="relative z-10">Men</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-500"></span>
              <span className="absolute inset-0 bg-gray-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
            <a href="#" className="relative group hover:text-gray-900 transition-all duration-300 text-gray-600 px-2 py-1">
              <span className="relative z-10">Women</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-500"></span>
              <span className="absolute inset-0 bg-gray-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
            <a href="#" className="relative group hover:text-gray-900 transition-all duration-300 text-gray-600 px-2 py-1">
              <span className="relative z-10">Sale</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-500"></span>
              <span className="absolute inset-0 bg-gray-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-3 text-xs font-medium text-gray-600">
              <button className="hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-50">Stores</button>
              <button className="hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-50">About</button>
              <button className="hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-50">ReRun</button>
            </div>
            <div className="h-6 w-px bg-gray-200 hidden xl:block"></div>
            <button className="hover:text-gray-900 transition-all text-gray-600 p-2.5 hover:bg-gray-100 rounded-xl transition-all relative group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="absolute inset-0 bg-gray-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            </button>
            <button className="hover:text-gray-900 transition-all text-gray-600 p-2.5 hover:bg-gray-100 rounded-xl transition-all relative group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="absolute inset-0 bg-gray-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            </button>
            <button className="hover:text-gray-900 transition-all text-gray-600 p-2.5 hover:bg-gray-100 rounded-xl transition-all relative group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white shadow-lg"></span>
              <span className="absolute inset-0 bg-gray-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            </button>
          </div>
        </header>

        {/* Premium Hero Banner with Slideshow */}
        <section className="relative h-[700px] bg-gradient-to-br from-red-700 via-red-800 to-red-900 overflow-hidden group">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(255,255,255,0.08) 60px, rgba(255,255,255,0.08) 120px)',
              animation: 'slide 20s linear infinite'
            }}></div>
          </div>
          
          {/* Slideshow Images */}
          <div className="absolute inset-0">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-red-700/60 via-red-800/50 to-red-900/60"></div>
              </div>
            ))}
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30 shadow-lg hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30 shadow-lg hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Hero Content */}
          <div className="relative h-full flex flex-col justify-end items-end pr-12 pb-12 z-10">
            <div className="text-right mb-6">
              <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-xs text-white font-semibold mb-4 uppercase tracking-wider">
                New Collection
              </div>
              <h1 className="text-5xl md:text-6xl font-light text-white mb-3 tracking-tight">Mary Jane</h1>
              <p className="text-white/90 text-lg font-light">Comfort meets style</p>
            </div>
            <button className="bg-white text-gray-900 px-10 py-4 rounded-full font-semibold text-sm hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 transform duration-300 uppercase tracking-wider">
              Shop Now
            </button>
          </div>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? 'w-8 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Premium Four-Column Category Grid */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-5">
              {/* BESTSELLERS */}
              <div className="relative h-[550px] rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900">
                  <img 
                    src="/shoex.webp" 
                    alt="Bestsellers"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-8 left-8 right-8">
                  <div className="bg-white/98 backdrop-blur-md border-2 border-black/20 rounded-full px-7 py-3.5 inline-block shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-900">BESTSELLERS</span>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 backdrop-blur-md rounded-full px-6 py-3 text-center">
                    <span className="text-sm font-semibold text-gray-900">Shop Collection →</span>
                  </div>
                </div>
              </div>

              {/* MENS */}
              <div className="relative h-[550px] rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                  <img 
                    src="/tree-runner.webp" 
                    alt="Men's"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-8 left-8 right-8">
                  <div className="bg-white/98 backdrop-blur-md border-2 border-black/20 rounded-full px-7 py-3.5 inline-block shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-900">MENS</span>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 backdrop-blur-md rounded-full px-6 py-3 text-center">
                    <span className="text-sm font-semibold text-gray-900">Shop Collection →</span>
                  </div>
                </div>
              </div>

              {/* WOMENS */}
              <div className="relative h-[550px] rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-red-900">
                  <img 
                    src="/lady.webp" 
                    alt="Women's"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-8 left-8 right-8">
                  <div className="bg-white/98 backdrop-blur-md border-2 border-black/20 rounded-full px-7 py-3.5 inline-block shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-900">WOMENS</span>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 backdrop-blur-md rounded-full px-6 py-3 text-center">
                    <span className="text-sm font-semibold text-gray-900">Shop Collection →</span>
                  </div>
                </div>
              </div>

              {/* GIFTS */}
              <div className="relative h-[550px] rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-red-900">
                  <img 
                    src="/gifts.webp" 
                    alt="Gifts"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-8 left-8 right-8">
                  <div className="bg-white/98 backdrop-blur-md border-2 border-black/20 rounded-full px-7 py-3.5 inline-block shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-900">GIFTS</span>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 backdrop-blur-md rounded-full px-6 py-3 text-center">
                    <span className="text-sm font-semibold text-gray-900">Shop Collection →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* "BUILT FOR GIFTING" Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-stone-50 to-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-4">BUILT FOR GIFTING</h2>
            <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
              Thoughtfully designed products that make perfect gifts for every occasion
            </p>
          </div>
        </section>

        {/* Premium Product Showcase Sections */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Section - Shoe Product */}
              <div className="relative h-[650px] bg-gradient-to-br from-stone-50 to-stone-100 rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <img 
                    src="/wool-runner-nz.webp" 
                    alt="Wool Runner NZ"
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                {/* Subtle dot pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
                  backgroundSize: '24px 24px'
                }}></div>
                {/* Product info overlay */}
                <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Wool Runner NZ</h3>
                    <p className="text-gray-600 text-sm mb-4">Premium comfort meets sustainable design</p>
                    <button className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                      Shop Now →
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Section - Model/Person */}
              <div className="relative h-[650px] bg-stone-200 rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500">
                <img 
                  src="/hero-banner.jpg" 
                  alt="Featured"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">New Arrivals</h3>
                    <p className="text-gray-600 text-sm mb-4">Discover our latest collection</p>
                    <button className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                      Explore →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Bestsellers Product Grid */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-gray-900">Bestsellers</h2>
              <p className="text-gray-600 text-lg font-light">Our most loved products</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { name: "Wool Cruiser", gender: "Women's", color: "Dark Camel", price: "$98", image: '/womens-wool-cruiser.webp' },
                { name: "Tree Runner", gender: "Men's", color: "Jet Black", price: "$98", image: '/tree-runner.webp' },
                { name: "Tree Dasher 2", gender: "Women's", color: "Thunder Green", price: "$135", image: '/tree-dasher-2.webp' },
                { name: "Wool Runner NZ", gender: "Men's", color: "Dark Grey", price: "$98", image: '/wool-runner-nz.webp' }
              ].map((shoe, i) => (
                <div key={i} className="cursor-pointer group">
                  <div className="relative h-[420px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden mb-5 shadow-md hover:shadow-xl transition-all duration-500">
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <img 
                        src={shoe.image} 
                        alt={shoe.name}
                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </div>
                    {/* Quick view button */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors">
                        <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                    {/* Favorite button */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors">
                        <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest font-medium">{shoe.gender}</div>
                    <h3 className="font-semibold mb-2 text-gray-900 text-lg">{shoe.name}</h3>
                    <div className="text-sm text-gray-600 mb-3 font-light">{shoe.color}</div>
                    <div className="text-lg font-semibold text-gray-900">{shoe.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Sustainability Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-stone-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-gray-900">Sustainability In Every Step</h2>
              <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
                Committed to making a positive impact on our planet
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="text-6xl mb-8 transform group-hover:scale-110 transition-transform duration-300">🌍</div>
                <h3 className="text-2xl font-medium mb-5 text-gray-900">Materials From The Earth</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  We replace petroleum-based synthetics with natural alternatives wherever we can. Like using wool, tree fiber, and sugarcane. They're soft, breathable, and better for the planet—win, win, win.
                </p>
              </div>
              <div className="text-center group">
                <div className="text-6xl mb-8 transform group-hover:scale-110 transition-transform duration-300">♻️</div>
                <h3 className="text-2xl font-medium mb-5 text-gray-900">Reduced Carbon Footprint</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  From materials to transport, we're working to reduce our carbon footprint to near zero. Holding ourselves accountable and striving for climate goals isn't a 30-year goal—it's now.
                </p>
              </div>
              <div className="text-center group">
                <div className="text-6xl mb-8 transform group-hover:scale-110 transition-transform duration-300">🌱</div>
                <h3 className="text-2xl font-medium mb-5 text-gray-900">Better For The Planet</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Every step we take is designed to minimize our impact on the environment while maximizing comfort and quality for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Chat Button - Fixed Bottom Right */}
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed bottom-8 right-8 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-gray-800 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 transform duration-300 z-50 flex items-center gap-2 group"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Chat</span>
        </button>

        {/* AI Chatbot Modal */}
        {chatOpen && (
          <div className="fixed bottom-24 right-8 w-96 h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-200 z-[60] flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">Nova AI Assistant</div>
                  <div className="text-xs text-gray-300">Usually replies instantly</div>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              id="chat-messages" 
              className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4"
            >
              {chatMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white text-gray-900 shadow-md border border-gray-200'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
              {chatMessages[chatMessages.length - 1]?.sender === 'user' && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 shadow-md border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 bg-white border-t border-gray-200">
              <div className="flex gap-2 mb-3 flex-wrap">
                {['Size Guide', 'Shipping Info', 'Returns', 'Men\'s Collection'].map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => {
                      const userMessage = {
                        id: Date.now(),
                        text: action,
                        sender: 'user',
                        timestamp: new Date()
                      }
                      setChatMessages(prev => [...prev, userMessage])
                      
                      setTimeout(() => {
                        const botResponse = generateBotResponse(action.toLowerCase())
                        setChatMessages(prev => [...prev, {
                          id: Date.now() + 1,
                          text: botResponse,
                          sender: 'bot',
                          timestamp: new Date()
                        }])
                        
                        // Auto-scroll to bottom after message
                        setTimeout(() => {
                          const chatContainer = document.getElementById('chat-messages')
                          if (chatContainer) {
                            chatContainer.scrollTop = chatContainer.scrollHeight
                          }
                        }, 100)
                      }, 800)
                    }}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors font-medium"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    )
  }

  // ========== MEDICAL SITE - Clean Healthcare Platform ==========
  function renderMedicalSite() {
    return (
      <div className="bg-white text-gray-900 min-h-screen">
        {/* Professional Medical Header */}
        <header className="bg-teal-600 text-white px-8 py-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
            <div className="text-2xl font-bold">MedCare Clinic</div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold">
            <a href="#" className="hover:text-teal-200 transition-colors">Services</a>
            <a href="#" className="hover:text-teal-200 transition-colors">Doctors</a>
            <a href="#" className="hover:text-teal-200 transition-colors">Appointments</a>
            <a href="#" className="hover:text-teal-200 transition-colors">Contact</a>
          </nav>
          <button className="px-8 py-3 bg-white text-teal-600 rounded-lg hover:bg-teal-50 font-bold text-sm transition-colors shadow-lg">Patient Portal</button>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-32 px-6 relative overflow-hidden">
          {/* Medical pattern background */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, #000 20px, #000 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, #000 20px, #000 21px)'
          }}></div>
          <div className="relative z-10 max-w-6xl mx-auto text-center">
            <div className="inline-block px-6 py-2 bg-teal-600/10 border border-teal-600/20 rounded-full text-sm text-teal-700 font-semibold mb-8">
              Trusted Healthcare Since 2010
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-6 text-gray-900">Healthcare Made Simple</h1>
            <p className="text-2xl mb-10 text-gray-600">Your trusted partner in health and wellness</p>
            <div className="flex justify-center gap-4">
              <button className="px-10 py-5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-bold text-lg transition-colors shadow-2xl">Book Appointment</button>
              <button className="px-10 py-5 border-2 border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 font-bold text-lg transition-colors">Learn More</button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-16 text-center">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: 'Primary Care', desc: 'Comprehensive health services for all ages', icon: '👨‍⚕️', color: 'from-teal-500 to-cyan-500' },
              { name: 'Telemedicine', desc: 'Virtual consultations from the comfort of home', icon: '💻', color: 'from-cyan-500 to-blue-500' },
              { name: 'Specialty Care', desc: 'Expert specialists available for complex conditions', icon: '🏥', color: 'from-blue-500 to-indigo-500' }
            ].map((service, i) => (
              <div key={i} className="bg-white rounded-2xl p-10 shadow-xl border-2 border-gray-100 hover:border-teal-200 transition-all group cursor-pointer">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-4xl mb-6 shadow-lg`}>
                  {service.icon}
                </div>
                <h3 className="text-3xl font-black mb-4">{service.name}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">{service.desc}</p>
                <button className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-bold">Learn More</button>
              </div>
            ))}
          </div>
        </section>

        {/* Appointment Booking */}
        <section className="py-24 px-6 bg-gradient-to-br from-teal-50 to-cyan-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-black mb-12 text-center">Book Your Appointment</h2>
            <div className="bg-white rounded-2xl p-10 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-700">Select Date</label>
                  <input type="date" className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-700">Select Time</label>
                  <select className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all">
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-700">Service Type</label>
                  <select className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all">
                    <option>General Consultation</option>
                    <option>Telemedicine</option>
                    <option>Follow-up</option>
                    <option>Specialist Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-700">Contact Phone</label>
                  <input type="tel" placeholder="(555) 123-4567" className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" />
                </div>
              </div>
              <button className="w-full py-5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-black text-lg shadow-lg">Confirm Appointment</button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ========== PERSONAL SITE - Creative Portfolio ==========
  function renderPersonalSite() {
    return (
      <div className="bg-white text-gray-900 min-h-screen">
        {/* Minimalist Creative Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center sticky top-0 z-50">
          <div className="text-2xl font-black">
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Alexandra</span>
            <span className="text-gray-900"> Creative</span>
          </div>
          <nav className="hidden md:flex gap-10 text-sm font-semibold">
            <a href="#" className="hover:text-pink-600 transition-colors">Work</a>
            <a href="#" className="hover:text-pink-600 transition-colors">About</a>
            <a href="#" className="hover:text-pink-600 transition-colors">Services</a>
            <a href="#" className="hover:text-pink-600 transition-colors">Contact</a>
          </nav>
          <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 font-bold text-sm transition-all shadow-lg">Let's Work Together</button>
        </header>

        {/* Hero Section */}
        <section className="py-32 px-6 max-w-6xl mx-auto text-center">
          <div className="mb-16">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 mx-auto mb-10 flex items-center justify-center text-6xl shadow-2xl">
              ✨
            </div>
            <h1 className="text-7xl md:text-8xl font-black mb-8 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent leading-tight">
              Creative Professional
            </h1>
            <p className="text-3xl text-gray-600 mb-12 font-light">Designing beautiful experiences that tell your story</p>
            <div className="flex justify-center gap-6">
              <button className="px-10 py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 font-black text-lg transition-all shadow-2xl">View Portfolio</button>
              <button className="px-10 py-5 border-2 border-gray-300 rounded-xl hover:border-pink-500 hover:text-pink-500 font-bold text-lg transition-all">Get In Touch</button>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-black mb-16 text-center">Featured Work</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Brand Identity Design', category: 'Branding', image: 'from-pink-200 via-rose-200 to-red-200', year: '2024' },
                { title: 'E-commerce Website', category: 'Web Design', image: 'from-rose-200 via-pink-200 to-fuchsia-200', year: '2024' },
                { title: 'Photography Portfolio', category: 'Creative', image: 'from-red-200 via-rose-200 to-pink-200', year: '2023' }
              ].map((project, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                  <div className={`relative h-96 bg-gradient-to-br ${project.image} overflow-hidden`}>
                    {/* Creative image simulation */}
                    <div className="absolute inset-0">
                      {/* Abstract creative shapes */}
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/40 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/30 rounded-full blur-3xl"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/50 rounded-lg rotate-45"></div>
                      <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-white/60 rounded-full"></div>
                    </div>
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-gray-900">
                      {project.year}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="text-sm text-pink-600 font-bold mb-3 uppercase tracking-wider">{project.category}</div>
                    <h3 className="text-2xl font-black mb-4">{project.title}</h3>
                    <button className="text-pink-600 font-bold group-hover:underline flex items-center gap-2">
                      View Project <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <h2 className="text-5xl font-black mb-16 text-center">What Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'CEO, Tech Startup', quote: 'Alexandra transformed our brand identity completely. Absolutely stunning work!' },
              { name: 'Michael Chen', role: 'Founder, E-commerce', quote: 'The website design exceeded all expectations. Professional and creative.' },
              { name: 'Emily Rodriguez', role: 'Creative Director', quote: 'Working with Alexandra was a dream. Her attention to detail is unmatched.' }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-100">
                <div className="flex gap-1 mb-4">
                  {'★★★★★'.split('').map((_, j) => (
                    <span key={j} className="text-pink-500 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-black">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  // ========== TRAVEL SITE - Adventure Booking Platform ==========
  function renderTravelSite() {
    return (
      <div className="bg-white text-gray-900 min-h-screen">
        {/* Adventure Header */}
        <header className="bg-emerald-600 text-white px-8 py-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
          <div className="text-2xl font-black">Wanderlust Adventures</div>
          <nav className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-wider">
            <a href="#" className="hover:text-emerald-200 transition-colors">Destinations</a>
            <a href="#" className="hover:text-emerald-200 transition-colors">Tours</a>
            <a href="#" className="hover:text-emerald-200 transition-colors">About</a>
            <a href="#" className="hover:text-emerald-200 transition-colors">Contact</a>
          </nav>
          <button className="px-8 py-3 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 font-black text-sm transition-colors shadow-lg">Book Now</button>
        </header>

        {/* Hero with Travel Imagery */}
        <section className="relative h-[800px] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 overflow-hidden">
          {/* Travel scene simulation */}
          <div className="absolute inset-0">
            {/* Sky gradient */}
            <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-blue-300/40 via-cyan-300/30 to-transparent"></div>
            {/* Mountain silhouettes */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3">
              <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-t from-emerald-700/40 to-transparent transform skew-x-12"></div>
              <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-t from-teal-700/40 to-transparent transform -skew-x-12"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/4 h-3/4 bg-gradient-to-t from-cyan-700/50 to-transparent"></div>
            </div>
            {/* Sun */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-300/60 rounded-full blur-2xl"></div>
            {/* Clouds */}
            <div className="absolute top-32 left-20 w-48 h-24 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute top-40 right-1/3 w-40 h-20 bg-white/15 rounded-full blur-xl"></div>
          </div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
            <div className="mb-8">
              <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm text-white font-semibold mb-6">
                ✈️ Your Next Adventure Awaits
              </div>
            </div>
            <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">Your Next Adventure Awaits</h1>
            <p className="text-3xl mb-12 text-emerald-100 font-light">Discover breathtaking destinations around the world</p>
            <button className="px-12 py-5 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors font-black text-lg shadow-2xl">Explore Destinations</button>
          </div>
        </section>

        {/* Destination Cards */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-16 text-center">Popular Destinations</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: 'Bali, Indonesia', price: '$1,299', days: '7 Days', image: 'from-emerald-300 via-teal-300 to-cyan-300', features: ['Beach', 'Temples', 'Culture'] },
              { name: 'Santorini, Greece', price: '$1,899', days: '5 Days', image: 'from-teal-300 via-cyan-300 to-blue-300', features: ['Sunset', 'Wine', 'Views'] },
              { name: 'Tokyo, Japan', price: '$2,199', days: '10 Days', image: 'from-cyan-300 via-blue-300 to-indigo-300', features: ['Culture', 'Food', 'Technology'] }
            ].map((destination, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                <div className="relative h-80 overflow-hidden">
                  <div className={`h-full bg-gradient-to-br ${destination.image} relative`}>
                    {/* Destination image simulation */}
                    <div className="absolute inset-0">
                      {/* Landscape elements */}
                      {i === 0 && (
                        <>
                          {/* Bali - Beach scene */}
                          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-400/40 to-transparent"></div>
                          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/60 rounded-full blur-xl"></div>
                          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/40 rounded-full blur-lg"></div>
                        </>
                      )}
                      {i === 1 && (
                        <>
                          {/* Santorini - White buildings */}
                          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/50 to-transparent"></div>
                          <div className="absolute bottom-0 left-1/4 w-20 h-32 bg-white/60 rounded-t-2xl"></div>
                          <div className="absolute bottom-0 right-1/4 w-24 h-40 bg-white/70 rounded-t-2xl"></div>
                          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-blue-300/50 rounded-full blur-xl"></div>
                        </>
                      )}
                      {i === 2 && (
                        <>
                          {/* Tokyo - Cityscape */}
                          <div className="absolute bottom-0 left-0 right-0 h-1/2">
                            <div className="absolute bottom-0 left-1/4 w-8 h-24 bg-gray-400/60 rounded-t"></div>
                            <div className="absolute bottom-0 left-1/2 w-12 h-32 bg-gray-500/60 rounded-t transform -translate-x-1/2"></div>
                            <div className="absolute bottom-0 right-1/4 w-10 h-28 bg-gray-400/60 rounded-t"></div>
                          </div>
                          <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-pink-400/60 rounded-full blur-lg"></div>
                        </>
                      )}
                    </div>
                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-black text-emerald-600 shadow-lg">
                      {destination.price}
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-sm text-emerald-600 font-bold mb-3 uppercase tracking-wider">{destination.days}</div>
                  <h3 className="text-3xl font-black mb-4">{destination.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {destination.features.map((feature, j) => (
                      <span key={j} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">{feature}</span>
                    ))}
                  </div>
                  <button className="w-full px-6 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-black shadow-lg">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  // ========== FINANCE SITE - Professional Tax Platform ==========
  function renderFinanceSite() {
    return (
      <div className="bg-gray-50 text-gray-900 min-h-screen">
        {/* Professional Finance Header */}
        <header className="bg-green-600 text-white px-8 py-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-2xl font-black">TaxFlow Pro</div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-wider">
            <a href="#" className="hover:text-green-200 transition-colors">Features</a>
            <a href="#" className="hover:text-green-200 transition-colors">Pricing</a>
            <a href="#" className="hover:text-green-200 transition-colors">About</a>
            <a href="#" className="hover:text-green-200 transition-colors">Contact</a>
          </nav>
          <button className="px-8 py-3 bg-white text-green-600 rounded-xl hover:bg-green-50 font-black text-sm transition-colors shadow-lg">Get Started</button>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white py-32 px-6 relative overflow-hidden">
          {/* Financial pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)'
          }}></div>
          <div className="relative z-10 max-w-6xl mx-auto text-center">
            <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm text-white font-bold mb-8">
              💰 Save More, Stress Less
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-6">Tax Prep That Never Stops Working</h1>
            <p className="text-2xl mb-10 text-green-100">Expert CPAs with AI that's always looking for new ways to save</p>
            <div className="flex justify-center gap-6">
              <button className="px-10 py-5 bg-white text-green-600 rounded-xl hover:bg-green-50 font-black text-lg transition-colors shadow-2xl">Start Free Trial</button>
              <button className="px-10 py-5 border-2 border-white text-white rounded-xl hover:bg-white/10 font-black text-lg transition-colors">Learn More</button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-16 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '1', title: 'Upload Documents', desc: 'Securely upload your tax documents in minutes', icon: '📄', color: 'from-green-500 to-emerald-500' },
              { step: '2', title: 'AI Analysis', desc: 'Our AI finds every possible deduction automatically', icon: '🤖', color: 'from-emerald-500 to-teal-500' },
              { step: '3', title: 'Expert Review', desc: 'CPA reviews and optimizes your return for maximum savings', icon: '👨‍💼', color: 'from-teal-500 to-cyan-500' }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-10 shadow-xl text-center border-2 border-gray-100 hover:border-green-200 transition-all">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-5xl mb-6 mx-auto shadow-lg`}>
                  {item.icon}
                </div>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} text-white flex items-center justify-center font-black text-2xl mx-auto mb-6 shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="text-3xl font-black mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Savings Calculator */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-black mb-12 text-center">Calculate Your Savings</h2>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-10 border-2 border-green-200 shadow-xl">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-black mb-3 text-gray-700">Annual Income</label>
                  <input type="number" placeholder="$75,000" className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-lg font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-black mb-3 text-gray-700">Filing Status</label>
                  <select className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-lg font-semibold">
                    <option>Single</option>
                    <option>Married Filing Jointly</option>
                    <option>Married Filing Separately</option>
                    <option>Head of Household</option>
                  </select>
                </div>
              </div>
              <div className="bg-white rounded-xl p-8 mb-8 border-2 border-green-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-3 font-semibold uppercase tracking-wider">Estimated Savings</div>
                  <div className="text-6xl font-black text-green-600 mb-2">$2,450</div>
                  <div className="text-sm text-gray-500">Based on similar profiles</div>
                </div>
              </div>
              <button className="w-full py-5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-black text-lg shadow-lg">Get Started Free</button>
            </div>
          </div>
        </section>
      </div>
    )
  }
}
