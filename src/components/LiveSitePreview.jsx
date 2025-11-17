import { useEffect, useState } from 'react'

export default function LiveSitePreview({ project, isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState('LUNCH')
  const [realEstateViewMode, setRealEstateViewMode] = useState('list')
  const [showRealEstateFilters, setShowRealEstateFilters] = useState(false)
  
  // Restaurant features state
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [reservationDate, setReservationDate] = useState('')
  const [reservationTime, setReservationTime] = useState('')
  const [reservationGuests, setReservationGuests] = useState(2)
  const [dietaryFilters, setDietaryFilters] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [showEventBooking, setShowEventBooking] = useState(false)
  const [language, setLanguage] = useState('en')
  const [showMobileOrder, setShowMobileOrder] = useState(false)
  const [cart, setCart] = useState([])
  const [favoriteDishes, setFavoriteDishes] = useState([])
  const [scrollY, setScrollY] = useState(0)
  const [showReservationCard, setShowReservationCard] = useState(false)
  
  // Fitness features state
  const [showClassBooking, setShowClassBooking] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [showMemberPortal, setShowMemberPortal] = useState(false)
  const [showTrainerProfiles, setShowTrainerProfiles] = useState(false)
  const [showVideoLibrary, setShowVideoLibrary] = useState(false)
  const [showNutritionTools, setShowNutritionTools] = useState(false)
  const [showMobileApp, setShowMobileApp] = useState(false)
  const [fitnessPage, setFitnessPage] = useState('home')
  
  // Real estate features state
  const [showMapSearch, setShowMapSearch] = useState(false)
  const [showVirtualTour, setShowVirtualTour] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [showMortgageCalc, setShowMortgageCalc] = useState(false)
  const [showNeighborhoodInsights, setShowNeighborhoodInsights] = useState(false)
  const [showAgentContact, setShowAgentContact] = useState(false)
  const [realEstatePage, setRealEstatePage] = useState('home')

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

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    if (isOpen) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen])

  if (!isOpen || !project) return null

  // Render based on industry
  const renderSite = () => {
    switch(project.industry) {
      case 'restaurant':
        return renderRestaurantSite(
          activeCategory, setActiveCategory,
          showReservationModal, setShowReservationModal,
          reservationDate, setReservationDate,
          reservationTime, setReservationTime,
          reservationGuests, setReservationGuests,
          dietaryFilters, setDietaryFilters,
          selectedPhoto, setSelectedPhoto,
          showEventBooking, setShowEventBooking,
          language, setLanguage,
          showMobileOrder, setShowMobileOrder,
          cart, setCart,
          favoriteDishes, setFavoriteDishes,
          scrollY,
          showReservationCard, setShowReservationCard
        )
      case 'fitness':
        return renderFitnessSite(
          showClassBooking, setShowClassBooking, selectedClass, setSelectedClass,
          showMemberPortal, setShowMemberPortal,
          showTrainerProfiles, setShowTrainerProfiles,
          showVideoLibrary, setShowVideoLibrary,
          showNutritionTools, setShowNutritionTools,
          showMobileApp, setShowMobileApp,
          fitnessPage, setFitnessPage
        )
      case 'realEstate':
        return renderRealEstateSite(
          realEstateViewMode, setRealEstateViewMode, showRealEstateFilters, setShowRealEstateFilters,
          showMapSearch, setShowMapSearch,
          showVirtualTour, setShowVirtualTour, selectedProperty, setSelectedProperty,
          showLeadForm, setShowLeadForm,
          showMortgageCalc, setShowMortgageCalc,
          showNeighborhoodInsights, setShowNeighborhoodInsights,
          showAgentContact, setShowAgentContact,
          realEstatePage, setRealEstatePage
        )
      case 'medical':
        return renderMedicalSite()
      case 'personal':
        return renderPersonalSite()
      case 'travel':
        return renderTravelSite()
      case 'finance':
        return renderFinanceSite()
      default:
        return renderRestaurantSite(
          activeCategory, setActiveCategory,
          showReservationModal, setShowReservationModal,
          reservationDate, setReservationDate,
          reservationTime, setReservationTime,
          reservationGuests, setReservationGuests,
          dietaryFilters, setDietaryFilters,
          selectedPhoto, setSelectedPhoto,
          showEventBooking, setShowEventBooking,
          language, setLanguage,
          showMobileOrder, setShowMobileOrder,
          cart, setCart
        )
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
  function renderRestaurantSite(
    activeCategory, setActiveCategory,
    showReservationModal, setShowReservationModal,
    reservationDate, setReservationDate,
    reservationTime, setReservationTime,
    reservationGuests, setReservationGuests,
    dietaryFilters, setDietaryFilters,
    selectedPhoto, setSelectedPhoto,
    showEventBooking, setShowEventBooking,
    language, setLanguage,
    showMobileOrder, setShowMobileOrder,
    cart, setCart,
    favoriteDishes, setFavoriteDishes,
    scrollY,
    showReservationCard, setShowReservationCard
  ) {
    // Translations
    const translations = {
      en: {
        menu: 'Menu',
        reservations: 'Reservations',
        about: 'About',
        bookNow: 'BOOK NOW',
        orderNow: 'Order Now',
        events: 'Events',
        language: 'Language'
      },
      es: {
        menu: 'Menú',
        reservations: 'Reservaciones',
        about: 'Acerca de',
        bookNow: 'RESERVAR AHORA',
        orderNow: 'Ordenar Ahora',
        events: 'Eventos',
        language: 'Idioma'
      },
      fr: {
        menu: 'Menu',
        reservations: 'Réservations',
        about: 'À propos',
        bookNow: 'RÉSERVER MAINTENANT',
        orderNow: 'Commander',
        events: 'Événements',
        language: 'Langue'
      }
    }
    const t = translations[language] || translations.en

    // Menu items with enhanced dietary info
    const menuItems = [
      { title: 'APPETIZERS', items: [
        { name: 'Bruschetta Trio', desc: 'Tomato, basil, mozzarella', price: '$12.99', dietary: ['vegetarian'], tags: ['popular'] },
        { name: 'Calamari Fritti', desc: 'Crispy squid rings with marinara', price: '$14.99', dietary: [], tags: [] }
      ]},
      { title: 'DAILY LUNCH SPECIALS * MONDAY TO FRIDAY', price: '$17.99', items: [
        { name: 'Pasta of the Day', desc: 'Chef\'s selection', price: '$17.99', dietary: ['vegetarian', 'gluten-free'], tags: [] },
        { name: 'Soup & Salad', desc: 'House soup with fresh greens', price: '$17.99', dietary: ['vegetarian', 'vegan'], tags: [] }
      ]},
      { title: 'SALADS WITH SOMETHING ON TOP', price: '$19.99', items: [
        { name: 'Caesar Salad', desc: 'Romaine, parmesan, croutons', price: '$19.99', dietary: ['vegetarian'], tags: ['popular'] },
        { name: 'Caprese Salad', desc: 'Fresh mozzarella, tomatoes, basil', price: '$19.99', dietary: ['vegetarian'], tags: [] }
      ]},
      { title: 'SANDWICHES: ALL SERVED WITH FRENCH FRIES', items: [
        { name: 'Italian Panini', desc: 'Prosciutto, mozzarella, arugula', price: '$16.99', dietary: [], tags: ['spicy'] },
        { name: 'Grilled Chicken Club', desc: 'Bacon, avocado, tomato', price: '$18.99', dietary: ['gluten-free'], tags: ['popular'] }
      ]},
      { title: 'ENTREES', price: '$25.99', items: [
        { name: 'Grilled Salmon', desc: 'Lemon butter, seasonal vegetables', price: '$28.99', dietary: ['gluten-free', 'pescatarian'], tags: [] },
        { name: 'Filet Mignon', desc: '8oz, mashed potatoes, asparagus', price: '$32.99', dietary: ['gluten-free'], tags: ['popular'] },
        { name: 'Thai Curry Bowl', desc: 'Coconut curry with vegetables', price: '$24.99', dietary: ['vegetarian'], tags: ['spicy', 'nuts'] }
      ]}
    ]

    // Filter menu items based on dietary preferences
    const filteredMenuItems = menuItems.map(section => ({
      ...section,
      items: section.items.filter(item => {
        if (dietaryFilters.length === 0) return true
        return dietaryFilters.some(filter => item.dietary.includes(filter))
      })
    }))

    // Available time slots
    const timeSlots = ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM']

    return (
      <div className="bg-white text-gray-900 min-h-screen">
        {/* Waterfront Hero Section */}
        <section className="relative h-screen overflow-hidden">
          {/* Background Image with Parallax */}
          <div className="absolute inset-0">
            <img 
              src="/waterfront.jpg" 
              alt="Bella Vista Waterfront"
              className="w-full h-full object-cover scale-105"
              style={{ transform: `translateY(${scrollY * 0.3}px) scale(1.05)` }}
            />
            {/* Enhanced gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent"></div>
            {/* Enhanced gradient vignette effect */}
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)'
            }}></div>
            {/* Floating particles - subtle animation */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/10 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                    animation: `float ${8 + i * 2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Advanced Elegant Header - Glassmorphism with Floating Design */}
          <header className="relative z-20 px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex justify-between items-center">
            <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-r from-black/40 via-black/30 to-black/40 border-b border-white/10"></div>
            <div className="relative z-10 flex items-center gap-2 sm:gap-4">
              <div className="text-lg sm:text-xl md:text-2xl font-light text-white tracking-[0.2em] sm:tracking-[0.3em] uppercase break-words">BELLA VISTA</div>
              <div className="hidden lg:block h-6 w-px bg-white/20"></div>
              <div className="hidden lg:block text-xs text-white/70 font-light tracking-widest uppercase">Since 1985</div>
            </div>
            <nav className="hidden md:flex gap-6 lg:gap-8 text-xs sm:text-sm text-white/90 font-light uppercase tracking-wider relative z-10">
              <a href="#" className="hover:text-white transition-all duration-300 relative group px-2 py-1">
                <span className="relative z-10">{t.menu}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:w-full transition-all duration-500"></span>
                <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowReservationModal(true) }} className="hover:text-white transition-all duration-300 relative group px-2 py-1">
                <span className="relative z-10">{t.reservations}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:w-full transition-all duration-500"></span>
                <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowEventBooking(true) }} className="hover:text-white transition-all duration-300 relative group px-2 py-1">
                <span className="relative z-10">{t.events}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:w-full transition-all duration-500"></span>
                <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
              <a href="#" className="hover:text-white transition-all duration-300 relative group px-2 py-1">
                <span className="relative z-10">{t.about}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:w-full transition-all duration-500"></span>
                <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
            </nav>
            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
              {/* Enhanced Language Switcher with Animation */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-2 sm:px-3 py-1.5 sm:py-2 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-white text-xs font-light uppercase tracking-wider outline-none cursor-pointer transition-all duration-300 group-hover:text-white"
                >
                  <option value="en" className="bg-gray-900">EN</option>
                  <option value="es" className="bg-gray-900">ES</option>
                  <option value="fr" className="bg-gray-900">FR</option>
                </select>
                <svg className="w-3 h-3 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileOrder(true)}
                className="md:hidden relative z-10 p-2 text-white hover:text-amber-400 transition-colors"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {/* Mobile Order Button */}
              <button 
                onClick={() => setShowMobileOrder(true)}
                className="hidden md:flex relative z-10 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500/90 to-amber-600/90 backdrop-blur-md text-white rounded-full text-xs font-light uppercase tracking-wider hover:from-amber-500 hover:to-amber-600 transition-all duration-300 items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transform border border-white/20 min-h-[40px]"
              >
                {t.orderNow}
              </button>
            </div>
          </header>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <div className="mb-6">
              <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-white/90 font-light tracking-widest uppercase mb-8">
                Since 1985
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white mb-4 sm:mb-6 tracking-tight leading-none break-words px-4" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Bella Vista
            </h1>
            <div className="w-16 sm:w-24 h-0.5 bg-red-500/90 mx-auto mb-6 sm:mb-10"></div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mb-8 sm:mb-14 font-light leading-relaxed tracking-wide px-4 break-words">
              WITH ITS TRULY UNIQUE LOUNGE SETTING AND PICTURESQUE WATERFRONT DINING IT IS ONE OF BRICKELL'S MOST UPSCALE PREFERRED DESTINATIONS.
            </p>
            <button 
              onClick={() => setShowReservationModal(true)}
              className="group px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 bg-white/95 backdrop-blur-sm text-gray-900 rounded-sm hover:bg-white transition-all duration-300 font-light text-sm sm:text-base uppercase tracking-widest flex items-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 relative overflow-hidden min-h-[48px] mx-4 sm:mx-0"
            >
              <span className="relative z-10 flex items-center gap-3">
                {t.bookNow} <span className="text-xl transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-amber-500/30 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            </button>
          </div>
        </section>

        {/* Story Section - Light background with large headlines */}
        <section className="py-20 sm:py-32 md:py-40 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 sm:gap-16 md:gap-24 items-start mb-20 sm:mb-32 md:mb-40 relative">
              {/* Vertical divider line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></div>
              
              <div className="sticky top-32 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light text-gray-900 mb-6 sm:mb-8 leading-[1.2] uppercase tracking-tight break-words" style={{ letterSpacing: '-0.02em' }}>
                  IMAGINE STEPPING INTO A PLACE...
                </h2>
              </div>
              <div className="space-y-6 sm:space-y-8 text-base sm:text-lg text-gray-700 leading-[1.9] font-light opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                <p className="text-lg sm:text-xl break-words">
                  Where every detail is designed to transport you to a magic World. As you enter Bella Vista, you're greeted by a warm breeze, and it becomes clear that this isn't just dinner—it's a waterfront dining experience that beckons you to relax and unwind. The sky shifts from soft orange to deep purple as the sun sets, painting a breathtaking backdrop to your evening as you enjoy your meal or your Lovers Lane Lemonade.
                </p>
                <p className="text-xl">
                  As you sip, you notice the other guests around you, laughing and enjoying themselves, each one caught up in their own moment of joy.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 sm:gap-16 md:gap-24 items-start mb-20 sm:mb-32 md:mb-40 relative">
              {/* Vertical divider line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></div>
              
              <div className="sticky top-32 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light text-gray-900 mb-6 sm:mb-8 leading-[1.2] uppercase tracking-tight break-words" style={{ letterSpacing: '-0.02em' }}>
                  THE AIR IS FILLED WITH THE SOUND...
                </h2>
              </div>
              <div className="space-y-6 sm:space-y-8 text-base sm:text-lg text-gray-700 leading-[1.9] font-light opacity-0 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                <p className="text-lg sm:text-xl break-words">
                  Of clinking glasses and lively conversation. It's as if you've entered a hidden oasis in the heart of the city. Then, there's the food—vibrant, creative, and bursting with flavor. Each dish is an invitation to explore, to share, and to savor. You start with a selection of tapas, each one more enticing than the last, and move on to a main course that leaves you wondering how it could get any better. But it does, with a dessert that feels like a sweet dream. By the time the evening ends, you're already planning your next visit, knowing that no two experiences here are ever the same.
                </p>
              </div>
            </div>
            <div className="text-center pt-12">
              <button 
                onClick={() => setShowReservationModal(true)}
                className="px-14 py-5 border-2 border-gray-900 text-gray-900 uppercase font-light text-sm tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                SO BOOK NOW!
              </button>
            </div>
          </div>
        </section>

        {/* Food Photography Gallery */}
        <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16 md:mb-20 px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-4 sm:mb-6 tracking-tight break-words">
                AT BELLA VISTA
              </h2>
              <div className="w-20 sm:w-24 h-0.5 bg-gray-300 mx-auto"></div>
              <p className="text-gray-600 mt-3 sm:mt-4 font-light text-sm sm:text-base">Click any image to view in full resolution</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4">
              {/* Cocktail */}
              <div 
                onClick={() => setSelectedPhoto({ src: '/cocktail.jpg', title: 'Craft Cocktails', desc: 'Handcrafted with premium spirits' })}
                className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer"
              >
                <img 
                  src="/cocktail.jpg" 
                  alt="Craft Cocktails" 
                  className="w-full h-full object-cover transform group-hover:scale-[1.07] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                {/* Glasmorphism overlay on hover */}
                <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-[2px] transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                {/* Dish tag */}
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-light uppercase tracking-wider text-gray-900 border border-white/50 shadow-lg">
                    Signature
                  </span>
                </div>
                <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl transform group-hover:translate-y-[-4px] transition-all duration-300 border border-white/50 group-hover:shadow-2xl">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-1 sm:mb-2 break-words">Craft Cocktails</h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-light break-words">Handcrafted with premium spirits</p>
                  </div>
                </div>
              </div>

              {/* Steak */}
              <div 
                onClick={() => setSelectedPhoto({ src: '/steak.jpg', title: 'Prime Cuts', desc: 'Perfectly grilled to perfection' })}
                className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer"
              >
                <img 
                  src="/steak.jpg" 
                  alt="Prime Cuts" 
                  className="w-full h-full object-cover transform group-hover:scale-[1.07] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                {/* Glasmorphism overlay on hover */}
                <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-[2px] transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                {/* Dish tag */}
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-light uppercase tracking-wider text-gray-900 border border-white/50 shadow-lg">
                    Chef's Pick
                  </span>
                </div>
                <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl transform group-hover:translate-y-[-4px] transition-all duration-300 border border-white/50 group-hover:shadow-2xl">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-1 sm:mb-2 break-words">Prime Cuts</h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-light break-words">Perfectly grilled to perfection</p>
                  </div>
                </div>
              </div>

              {/* Pasta */}
              <div 
                onClick={() => setSelectedPhoto({ src: '/pasta.jpg', title: 'Fresh Pasta', desc: 'Made daily with authentic recipes' })}
                className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer"
              >
                <img 
                  src="/pasta.jpg" 
                  alt="Fresh Pasta" 
                  className="w-full h-full object-cover transform group-hover:scale-[1.07] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                {/* Glasmorphism overlay on hover */}
                <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-[2px] transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                {/* Dish tag */}
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-light uppercase tracking-wider text-gray-900 border border-white/50 shadow-lg">
                    Fan Favorite
                  </span>
                </div>
                <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl transform group-hover:translate-y-[-4px] transition-all duration-300 border border-white/50 group-hover:shadow-2xl">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-1 sm:mb-2 break-words">Fresh Pasta</h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-light break-words">Made daily with authentic recipes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Lightbox Modal */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 z-[210] w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all text-white text-2xl"
            >
              ×
            </button>
            <div 
              className="max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedPhoto.src} 
                alt={selectedPhoto.title}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="mt-6 text-center">
                <h3 className="text-3xl font-light text-white mb-2">{selectedPhoto.title}</h3>
                <p className="text-white/70 font-light">{selectedPhoto.desc}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dark Menu Section */}
        <section className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white min-h-screen py-24 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-6xl mx-auto px-8 relative z-10">
            {/* Menu Header */}
            <div className="text-center mb-20">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-light mb-8 uppercase tracking-[0.1em] leading-tight">
                EXPLORE OUR MENU
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto mb-4"></div>
              <p className="text-white/50 text-sm font-light tracking-widest uppercase">Curated Culinary Excellence</p>
            </div>

            {/* Category Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-20">
              {['LUNCH', 'DINNER', 'WEEKEND BRUNCH', 'DRINKS & COCKTAILS', 'HAPPY HOUR', 'CRAZY WEDNESDAY', 'WINES', 'BREEZY BITES'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-full text-xs font-light uppercase tracking-[0.15em] transition-all duration-300 relative overflow-hidden group ${
                    activeCategory === cat
                      ? 'bg-white text-gray-900 shadow-xl shadow-white/20 scale-105'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="relative z-10">{cat}</span>
                  {activeCategory === cat && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-white/90"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Dietary Filters - Enhanced Design */}
            <div className="mb-16">
              <div className="text-center mb-6">
                <p className="text-white/40 text-xs font-light uppercase tracking-widest mb-4">Filter by Dietary Preference</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                  onClick={() => {
                    const newFilters = dietaryFilters.includes('vegetarian') 
                      ? dietaryFilters.filter(f => f !== 'vegetarian')
                      : [...dietaryFilters, 'vegetarian']
                    setDietaryFilters(newFilters)
                  }}
                  className={`px-6 py-3 rounded-full text-sm font-light transition-all duration-300 relative overflow-hidden group ${
                    dietaryFilters.includes('vegetarian')
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-2 border-green-500/50 shadow-lg shadow-green-500/20'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="relative z-10">Vegetarian</span>
                </button>
                <button
                  onClick={() => {
                    const newFilters = dietaryFilters.includes('vegan') 
                      ? dietaryFilters.filter(f => f !== 'vegan')
                      : [...dietaryFilters, 'vegan']
                    setDietaryFilters(newFilters)
                  }}
                  className={`px-6 py-3 rounded-full text-sm font-light transition-all duration-300 relative overflow-hidden group ${
                    dietaryFilters.includes('vegan')
                      ? 'bg-gradient-to-r from-lime-500/20 to-green-500/20 text-lime-300 border-2 border-lime-500/50 shadow-lg shadow-lime-500/20'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="relative z-10">Vegan</span>
                </button>
                <button
                  onClick={() => {
                    const newFilters = dietaryFilters.includes('gluten-free') 
                      ? dietaryFilters.filter(f => f !== 'gluten-free')
                      : [...dietaryFilters, 'gluten-free']
                    setDietaryFilters(newFilters)
                  }}
                  className={`px-6 py-3 rounded-full text-sm font-light transition-all duration-300 relative overflow-hidden group ${
                    dietaryFilters.includes('gluten-free')
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-2 border-amber-500/50 shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="relative z-10">Gluten-Free</span>
                </button>
                <button
                  onClick={() => {
                    const newFilters = dietaryFilters.includes('pescatarian') 
                      ? dietaryFilters.filter(f => f !== 'pescatarian')
                      : [...dietaryFilters, 'pescatarian']
                    setDietaryFilters(newFilters)
                  }}
                  className={`px-6 py-3 rounded-full text-sm font-light transition-all duration-300 relative overflow-hidden group ${
                    dietaryFilters.includes('pescatarian')
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="relative z-10">Pescatarian</span>
                </button>
                {dietaryFilters.length > 0 && (
                  <button
                    onClick={() => setDietaryFilters([])}
                    className="px-6 py-3 rounded-full text-sm font-light bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 shadow-lg shadow-red-500/10"
                  >
                    Clear All
                  </button>
                )}
              </div>
              {dietaryFilters.length > 0 && (
                <p className="text-center text-white/50 text-xs font-light tracking-wide">
                  Showing <span className="text-amber-400 font-medium">{filteredMenuItems.reduce((acc, section) => acc + section.items.length, 0)}</span> items matching your preferences
                </p>
              )}
            </div>

            {/* Item Labels - Enhanced */}
            <div className="flex gap-8 justify-center mb-16 text-xs text-white/50 font-light">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="tracking-wider uppercase">New</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="tracking-wider uppercase">Vegetarian</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="tracking-wider uppercase">Raw</span>
              </div>
            </div>

            {/* Highlighted Item - Enhanced */}
            <div className="border-2 border-amber-500/40 rounded-3xl p-10 mb-20 bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs uppercase tracking-widest text-amber-400/70 font-light">Featured</span>
                    <h3 className="text-4xl font-light">Fresh Baked Cornbread</h3>
                </div>
                  <p className="text-white/70 text-lg font-light leading-relaxed">Wisconsin cheddar, chives & Irish whipped butter</p>
                </div>
                <div className="text-3xl font-light text-amber-400 ml-8">$8.99</div>
              </div>
            </div>

            {/* Menu Sections - Enhanced with Scroll Animation */}
            <div className="space-y-16">
              {filteredMenuItems.map((section, i) => (
                <div key={`${activeCategory}-${i}`} className="border-b border-white/5 pb-12 group opacity-0 animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-amber-400/90 uppercase tracking-wider break-words">
                      {section.title}
                    </h3>
                    {section.price && (
                        <span className="text-base sm:text-lg md:text-xl font-light text-amber-400/70 px-3 sm:px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 whitespace-nowrap">
                          {section.price}
                        </span>
                    )}
                  </div>
                    <span className="text-2xl sm:text-3xl text-white/20 font-light group-hover:text-white/30 transition-colors hidden sm:block">+</span>
                  </div>
                  <div className="space-y-6 sm:space-y-8 ml-0 sm:ml-4">
                    {section.items.map((item, j) => {
                      const isFavorite = favoriteDishes.includes(`${i}-${j}`)
                      return (
                        <div key={j} className="flex flex-col sm:flex-row justify-between items-start sm:items-start group/item cursor-pointer p-3 sm:p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10 opacity-0 animate-fade-in gap-3" style={{ animationDelay: `${j * 0.1}s`, animationFillMode: 'forwards' }}>
                          <div className="flex-1 pr-0 sm:pr-8 w-full sm:w-auto">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                              <h4 className="text-lg sm:text-xl md:text-2xl font-light group-hover/item:text-amber-400 transition-colors duration-300 break-words">{item.name}</h4>
                              {/* Favorite button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const key = `${i}-${j}`
                                  if (isFavorite) {
                                    setFavoriteDishes(favoriteDishes.filter(f => f !== key))
                                  } else {
                                    setFavoriteDishes([...favoriteDishes, key])
                                  }
                                }}
                                className="ml-2 text-white/40 hover:text-red-400 transition-colors"
                              >
                                <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </button>
                              {/* Dietary and tag icons */}
                              <div className="flex gap-1.5">
                                {item.dietary && item.dietary.length > 0 && (
                                  <>
                                    {item.dietary.includes('vegetarian') && <span className="text-xs uppercase tracking-wider bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/30 text-green-300 font-light">V</span>}
                                    {item.dietary.includes('vegan') && <span className="text-xs uppercase tracking-wider bg-lime-500/20 px-2 py-0.5 rounded-full border border-lime-500/30 text-lime-300 font-light">VG</span>}
                                    {item.dietary.includes('gluten-free') && <span className="text-xs uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-300 font-light">GF</span>}
                                    {item.dietary.includes('pescatarian') && <span className="text-xs uppercase tracking-wider bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30 text-blue-300 font-light">P</span>}
                                  </>
                                )}
                                {item.tags && item.tags.length > 0 && (
                                  <>
                                    {item.tags.includes('spicy') && <span className="text-xs" title="Spicy">🌶️</span>}
                                    {item.tags.includes('popular') && <span className="text-xs" title="Popular">⭐</span>}
                                    {item.tags.includes('nuts') && <span className="text-xs" title="Contains Nuts">🥥</span>}
                                  </>
                                )}
                              </div>
                            </div>
                            <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed break-words">{item.desc}</p>
                          </div>
                          <span className="text-lg sm:text-xl font-light text-amber-400/90 whitespace-nowrap group-hover/item:text-amber-300 transition-colors flex-shrink-0">{item.price}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reservation Modal */}
        {showReservationModal && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowReservationModal(false)}
          >
            <div 
              className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-light text-white">Make a Reservation</h2>
                <button
                  onClick={() => setShowReservationModal(false)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ×
                </button>
          </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-white/80 mb-2 font-light">Date</label>
                  <input
                    type="date"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2 font-light">Time</label>
                  <div className="grid grid-cols-5 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setReservationTime(time)}
                        className={`px-4 py-2 rounded-lg text-sm font-light transition-all ${
                          reservationTime === time
                            ? 'bg-amber-500 text-gray-900'
                            : 'bg-gray-800 text-white/80 hover:bg-gray-700 border border-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 mb-2 font-light">Number of Guests</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setReservationGuests(Math.max(1, reservationGuests - 1))}
                      className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 text-white hover:bg-gray-700"
                    >
                      −
                    </button>
                    <span className="text-white text-xl font-light w-12 text-center">{reservationGuests}</span>
                    <button
                      onClick={() => setReservationGuests(Math.min(20, reservationGuests + 1))}
                      className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 text-white hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    alert(`Reservation confirmed for ${reservationDate} at ${reservationTime} for ${reservationGuests} guests!`)
                    setShowReservationModal(false)
                  }}
                  disabled={!reservationDate || !reservationTime}
                  className="w-full px-6 py-4 bg-amber-500 text-gray-900 rounded-lg font-light uppercase tracking-wider hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Reservation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Event Booking Modal */}
        {showEventBooking && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowEventBooking(false)}
          >
            <div 
              className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-light text-white">Private Dining Events</h2>
                <button
                  onClick={() => setShowEventBooking(false)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-6">
                <p className="text-white/70 font-light leading-relaxed">
                  Host your special occasion in our elegant private dining room. Perfect for corporate events, celebrations, and intimate gatherings.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-light text-white mb-2">Capacity</h3>
                    <p className="text-white/70 font-light">Up to 50 guests</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-light text-white mb-2">Custom Menu</h3>
                    <p className="text-white/70 font-light">Tailored to your preferences</p>
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 mb-2 font-light">Event Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2 font-light">Expected Guests</label>
                  <input
                    type="number"
                    min="10"
                    max="50"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2 font-light">Special Requests</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="Tell us about your event..."
                  />
                </div>
                <button
                  onClick={() => {
                    alert('Event booking request submitted! We will contact you shortly.')
                    setShowEventBooking(false)
                  }}
                  className="w-full px-6 py-4 bg-amber-500 text-gray-900 rounded-lg font-light uppercase tracking-wider hover:bg-amber-400 transition-all"
                >
                  Request Event Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reservation UX Section */}
        <section className="py-32 px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-6xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight">
                Reserve Your Table
              </h2>
              <div className="w-24 h-0.5 bg-gray-300 mx-auto"></div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm text-gray-600 mb-3 font-light uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-500 transition-all font-light"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-3 font-light uppercase tracking-wider">Time</label>
                  <select
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-500 transition-all font-light"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-3 font-light uppercase tracking-wider">Party Size</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setReservationGuests(Math.max(1, reservationGuests - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-amber-500 text-gray-600 hover:text-amber-500 transition-all"
                    >
                      −
                    </button>
                    <span className="text-xl font-light text-gray-900 w-12 text-center">{reservationGuests}</span>
                    <button
                      onClick={() => setReservationGuests(Math.min(20, reservationGuests + 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-amber-500 text-gray-600 hover:text-amber-500 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (reservationDate && reservationTime) {
                    setShowReservationModal(true)
                  } else {
                    alert('Please select date and time')
                  }
                }}
                className="w-full px-8 py-4 bg-gray-900 text-white rounded-lg font-light uppercase tracking-wider hover:bg-amber-600 transition-all duration-300"
              >
                Check Availability
              </button>
            </div>
          </div>
        </section>

        {/* Enhanced Event Booking Section */}
        <section className="py-32 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-6xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight">
                Private Events & Celebrations
              </h2>
              <div className="w-24 h-0.5 bg-gray-300 mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                Host your special occasion in our elegant private dining space
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="space-y-6">
                <h3 className="text-3xl font-light text-gray-900 mb-6">What We Offer</h3>
                <div className="space-y-4">
                  {['Birthdays', 'Corporate Dinners', 'Weddings', 'Proposals', 'Anniversaries', 'Private Parties'].map((event, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-amber-500 transition-all group">
                      <div className="w-2 h-2 bg-amber-500 rounded-full group-hover:scale-150 transition-transform"></div>
                      <span className="text-lg font-light text-gray-700">{event}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                <h3 className="text-2xl font-light text-gray-900 mb-6">Packages Starting At</h3>
                <div className="text-5xl font-light text-gray-900 mb-4">$500</div>
                <p className="text-gray-600 font-light leading-relaxed mb-6">
                  Custom menus tailored to your event. Capacity up to 50 guests. Includes private dining room, dedicated server, and personalized service.
                </p>
                <button
                  onClick={() => setShowEventBooking(true)}
                  className="w-full px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-lg font-light uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300"
                >
                  Request Event Booking
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-32 px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-6xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight">
                What Our Guests Say
              </h2>
              <div className="w-24 h-0.5 bg-gray-300 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Alex P.', location: 'Miami', rating: 5, text: 'An unforgettable experience. The ambience is magical.' },
                { name: 'Sarah M.', location: 'Brickell', rating: 5, text: 'The food exceeded all expectations. We\'ll definitely be back!' },
                { name: 'Michael R.', location: 'Coral Gables', rating: 5, text: 'Perfect waterfront dining. The service was impeccable.' }
              ].map((review, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-xl">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-700 font-light leading-relaxed mb-6 text-lg italic">
                    "{review.text}"
                  </p>
                  <div className="text-gray-600 font-light">
                    <div className="font-medium">{review.name}</div>
                    <div className="text-sm">{review.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Elements Section */}
        <section className="py-32 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Timeline */}
            <div className="mb-32">
              <h2 className="text-6xl md:text-7xl font-light text-gray-900 mb-16 text-center tracking-tight">
                Since 1985
              </h2>
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gray-300"></div>
                  {[
                    { year: '1985', event: 'Bella Vista opens its doors' },
                    { year: '1995', event: 'Expansion to waterfront location' },
                    { year: '2010', event: 'Award-winning chef joins team' },
                    { year: '2020', event: 'Renovation and modern updates' }
                  ].map((milestone, idx) => (
                    <div key={idx} className={`relative mb-12 ${idx % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8 ml-auto'} w-1/2`}>
                      <div className="absolute top-0 w-4 h-4 bg-amber-500 rounded-full border-4 border-white" style={{ [idx % 2 === 0 ? 'right' : 'left']: '-2px' }}></div>
                      <div className="text-3xl font-light text-gray-900 mb-2">{milestone.year}</div>
                      <div className="text-gray-600 font-light">{milestone.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chef Card */}
            <div className="mb-32">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight">
                    Meet the Chef
                  </h2>
                  <p className="text-xl text-gray-700 font-light leading-relaxed mb-6">
                    Chef Maria Rodriguez brings over 20 years of culinary excellence to Bella Vista. Her passion for Mediterranean cuisine and commitment to using the finest local ingredients has earned her recognition throughout Miami.
                  </p>
                  <p className="text-xl text-gray-700 font-light leading-relaxed">
                    "Every dish tells a story. At Bella Vista, we don't just serve food—we create experiences that linger long after the last bite."
                  </p>
                </div>
                <div className="bg-gray-100 rounded-3xl p-12 text-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl text-white">
                    👨‍🍳
                  </div>
                  <div className="text-2xl font-light text-gray-900 mb-2">Chef Maria Rodriguez</div>
                  <div className="text-gray-600 font-light">Executive Chef</div>
                </div>
              </div>
            </div>

            {/* Philosophy */}
            <div className="mb-32 text-center max-w-4xl mx-auto">
              <h2 className="text-6xl md:text-7xl font-light text-gray-900 mb-12 tracking-tight">
                Our Philosophy
              </h2>
              <p className="text-2xl text-gray-700 font-light leading-relaxed">
                At Bella Vista, we believe dining is an art form. Every ingredient is carefully selected, every dish thoughtfully crafted, and every moment designed to create memories that last a lifetime.
              </p>
            </div>

            {/* Wine List & Cocktails */}
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-5xl font-light text-gray-900 mb-8 tracking-tight">Wine Selection</h2>
                <div className="space-y-6">
                  {['House Red - $8/glass', 'Chardonnay Reserve - $12/glass', 'Prosecco - $10/glass', 'Cabernet Sauvignon - $14/glass'].map((wine, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 border-b border-gray-200">
                      <span className="text-lg font-light text-gray-700">{wine}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-5xl font-light text-gray-900 mb-8 tracking-tight">Signature Cocktails</h2>
                <div className="space-y-6">
                  {['Lovers Lane Lemonade - $14', 'Brickell Sunset - $16', 'Waterfront Mule - $15', 'Bella Vista Old Fashioned - $18'].map((cocktail, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 border-b border-gray-200">
                      <span className="text-lg font-light text-gray-700">{cocktail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* High-End Footer */}
        <footer className="bg-gray-900 text-white py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-light mb-6 tracking-wider">Bella Vista</h3>
                <ul className="space-y-3 font-light">
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Home</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Menu</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setShowReservationModal(true) }} className="text-white/70 hover:text-white transition-colors">Reservations</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setShowEventBooking(true) }} className="text-white/70 hover:text-white transition-colors">Events</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">About</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-light mb-6 tracking-wider">Contact</h3>
                <ul className="space-y-3 font-light text-white/70">
                  <li className="flex items-center gap-2">
                    <span>📍</span>
                    <span>1200 Brickell Ave, Miami, FL</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📞</span>
                    <span>(305) 555-0123</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✉️</span>
                    <span>info@bellavista.com</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-light mb-6 tracking-wider">Hours</h3>
                <ul className="space-y-3 font-light text-white/70">
                  <li>Mon–Thu: 5:00 PM – 10:00 PM</li>
                  <li>Fri–Sun: 5:00 PM – 11:00 PM</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-light mb-6 tracking-wider">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-white/70 hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">Facebook</a>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-white/50 font-light text-sm">
              © {new Date().getFullYear()} Bella Vista. All rights reserved.
            </div>
          </div>
        </footer>

        {/* Mobile Ordering Interface */}
        {showMobileOrder && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowMobileOrder(false)}
          >
            <div 
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-light">Mobile Order</h2>
                <button
                  onClick={() => setShowMobileOrder(false)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4 mb-6">
                  {menuItems.flatMap(section => section.items).slice(0, 6).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-light text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 font-light">{item.desc}</p>
                        <p className="text-amber-600 font-light mt-1">{item.price}</p>
                      </div>
                      <button
                        onClick={() => {
                          setCart([...cart, { ...item, id: Date.now() }])
                        }}
                        className="ml-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all text-sm font-light"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="mb-4">
                    <h3 className="font-light text-gray-900 mb-3">Your Order ({cart.length})</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {cart.map((item, idx) => (
                        <div key={item.id || idx} className="flex justify-between text-sm">
                          <span className="text-gray-700 font-light">{item.name}</span>
                          <span className="text-gray-900 font-light">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-200">
                    <span className="font-light text-gray-900">Total</span>
                    <span className="text-xl font-light text-gray-900">
                      ${cart.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      alert('Order placed! Your food will be ready for pickup.')
                      setCart([])
                      setShowMobileOrder(false)
                    }}
                    className="w-full px-6 py-4 bg-amber-500 text-white rounded-lg font-light uppercase tracking-wider hover:bg-amber-600 transition-all"
                  >
                    Place Order
                  </button>
                  <button
                    onClick={() => setCart([])}
                    className="w-full mt-2 px-6 py-2 text-gray-600 hover:text-gray-900 font-light"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ========== FITNESS SITE - Equinox-Inspired Luxury ==========
  function renderFitnessSite(
    showClassBooking, setShowClassBooking, selectedClass, setSelectedClass,
    showMemberPortal, setShowMemberPortal,
    showTrainerProfiles, setShowTrainerProfiles,
    showVideoLibrary, setShowVideoLibrary,
    showNutritionTools, setShowNutritionTools,
    showMobileApp, setShowMobileApp,
    fitnessPage, setFitnessPage
  ) {
    // Sample data
    const classes = [
      { id: 1, name: 'HIIT Power', time: '6:00 AM', instructor: 'Sarah Chen', capacity: 20, booked: 18, waitlist: 3 },
      { id: 2, name: 'Yoga Flow', time: '7:30 AM', instructor: 'Marcus Johnson', capacity: 25, booked: 25, waitlist: 5 },
      { id: 3, name: 'Cycling Intensity', time: '12:00 PM', instructor: 'Emma Rodriguez', capacity: 30, booked: 22, waitlist: 2 },
      { id: 4, name: 'Strength Training', time: '5:30 PM', instructor: 'David Park', capacity: 20, booked: 15, waitlist: 0 }
    ]
    
    const trainers = [
      { id: 1, name: 'Sarah Chen', specialty: 'HIIT & Cardio', schedule: 'Mon-Fri 6AM-2PM', rating: 4.9 },
      { id: 2, name: 'Marcus Johnson', specialty: 'Yoga & Flexibility', schedule: 'Mon-Sat 7AM-12PM', rating: 4.8 },
      { id: 3, name: 'Emma Rodriguez', specialty: 'Cycling & Endurance', schedule: 'Tue-Sat 10AM-6PM', rating: 5.0 },
      { id: 4, name: 'David Park', specialty: 'Strength & Conditioning', schedule: 'Mon-Fri 4PM-9PM', rating: 4.9 }
    ]
    // Render page content based on current page
    const renderPageContent = () => {
      switch(fitnessPage) {
        case 'home':
          return (
            <>
              {/* Hero Section with Background Image */}
              <section className="relative h-screen overflow-hidden">
                {/* Background Image with Parallax */}
                <div className="absolute inset-0">
                  <img 
                    src="/gym-bg.jpg" 
                    alt="FitZone Gym" 
                    className="w-full h-full object-cover scale-105 transition-transform duration-700"
                    style={{ transform: `translateY(${scrollY * 0.3}px) scale(1.05)` }}
                  />
                  {/* Sophisticated overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent"></div>
                  {/* Enhanced vignette effect */}
                  <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)'
                  }}></div>
                </div>
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
                  <div className="mb-8">
                    <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-white/90 font-light tracking-[0.3em] uppercase mb-4">
                      Since 2018
                    </div>
                    {/* 113 Clubs Worldwide Badge */}
                    <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-white/90 font-light tracking-[0.3em] uppercase ml-3">
                      113 Clubs Worldwide
                    </div>
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-light mb-6 sm:mb-8 tracking-tight leading-[0.95] uppercase break-words px-4">
                    YOUR HIGH-PERFORMANCE<br />SANCTUARY
                  </h1>
                  <div className="w-24 sm:w-32 h-0.5 bg-white/50 mx-auto mb-6 sm:mb-10"></div>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-10 sm:mb-14 font-light max-w-3xl leading-relaxed tracking-wide px-4 break-words">
                    Become a Member and gain access to 113 iconic Clubs featuring Unlimited Signature Classes and exclusive luxury amenities.
                  </p>
                  <button className="group px-8 sm:px-12 md:px-14 py-4 sm:py-5 md:py-6 bg-white/95 backdrop-blur-sm text-black hover:bg-white transition-all duration-300 font-light text-sm sm:text-base tracking-[0.2em] uppercase shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center gap-2 sm:gap-3 relative overflow-hidden min-h-[48px] mx-4 sm:mx-0">
                    <span className="relative z-10 flex items-center gap-3">
                      JOIN NOW <span className="text-xl transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                    {/* Light glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-500/30 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  </button>
                </div>
              </section>

              {/* One Membership Section */}
              <section className="py-20 sm:py-32 md:py-40 px-4 sm:px-6 bg-gradient-to-b from-black via-gray-950 to-black">
                <div className="max-w-6xl mx-auto text-center">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-6 sm:mb-10 tracking-tight leading-tight break-words px-4">
                    One Membership.<br />Limitless Potential.
                  </h2>
                  <div className="w-20 sm:w-24 h-0.5 bg-white/30 mx-auto mb-8 sm:mb-12"></div>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-10 sm:mb-16 font-light max-w-3xl mx-auto leading-relaxed px-4 break-words">
                    Unlimited Signature Classes, precision-backed Personal Training, and exclusive amenities to recover and regenerate.
                  </p>
                  
                  {/* Member Benefits Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-6xl mx-auto px-4">
                    {[
                      { title: 'Unlimited Signature Classes', desc: 'Access to all classes' },
                      { title: 'Precision-Backed Personal Training', desc: '1:1 coaching sessions' },
                      { title: 'Wellness Spa Access', desc: 'Recovery & regeneration' },
                      { title: 'Exclusive Member Events', desc: 'Special experiences' },
                      { title: 'Digital Coaching App', desc: 'Track your progress' }
                    ].map((benefit, idx) => (
                      <div key={idx} className="bg-gray-900/50 border border-white/5 rounded-xl p-6 hover:border-white/20 hover:bg-gray-900/70 transition-all duration-300 group cursor-pointer">
                        <h3 className="text-sm font-light text-white mb-2 uppercase tracking-wider">{benefit.title}</h3>
                        <p className="text-xs text-white/60 font-light">{benefit.desc}</p>
                      </div>
                    ))}
                  </div>
                  
                  <button onClick={() => setFitnessPage('membership')} className="px-12 py-5 border-2 border-white/30 hover:border-white/60 hover:bg-white/5 transition-all duration-300 text-sm font-light tracking-[0.2em] uppercase">
                    Explore Member Benefits
                  </button>
                </div>
              </section>

              {/* Testimonials Section */}
              <section className="py-40 px-6 bg-gradient-to-b from-black via-gray-950 to-black">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-10 tracking-tight">
                      What Members Say
                    </h2>
                    <div className="w-24 h-0.5 bg-white/30 mx-auto"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4">
                    {[
                      { name: 'Jessica M.', location: 'Brickell', rating: 5, text: 'Best gym I\'ve ever been part of. Clean, elite, motivating atmosphere.' },
                      { name: 'Robert K.', location: 'Downtown', rating: 5, text: 'The trainers are world-class. My strength has increased 40% in 3 months.' },
                      { name: 'Amanda L.', location: 'Coral Gables', rating: 5, text: 'The spa and recovery amenities are unmatched. Worth every penny.' }
                    ].map((review, idx) => (
                      <div key={idx} className="bg-gray-900/50 border border-white/5 rounded-xl p-6 sm:p-8 hover:border-white/20 transition-all duration-300">
                        <div className="mb-4">
                          <span className="text-amber-400 text-sm font-light">Rating: {review.rating}/5</span>
                        </div>
                        <p className="text-white/80 font-light leading-relaxed mb-6 text-lg italic">
                          "{review.text}"
                        </p>
                        <div className="text-white/60 font-light">
                          <div className="font-medium text-white">{review.name}</div>
                          <div className="text-sm">{review.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )
        
        case 'classes':
          return (
            <section className="py-20 px-6 bg-black min-h-screen">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-10 tracking-tight">
                    Signature Classes
                  </h2>
                  <div className="w-24 h-0.5 bg-white/30 mx-auto mb-12"></div>
                  <p className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed">
                    New and Unlimited Classes exclusive to FitZone. Designed for the individual. Powered by the collective.
                  </p>
                </div>

                {/* Class Categories */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
                  {['Strength', 'Conditioning', 'Yoga', 'HIIT', 'Pilates'].map((category, idx) => (
                    <div key={idx} className="bg-gray-900/50 border border-white/5 rounded-xl p-4 sm:p-6 text-center hover:border-white/20 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group">
                      <div className="text-white font-light uppercase tracking-wider text-xs sm:text-sm break-words">{category}</div>
                    </div>
                  ))}
                </div>

                {/* Class Booking */}
                <div className="mb-12 sm:mb-16 px-4">
                  <button 
                    onClick={() => setShowClassBooking(true)}
                    className="w-full px-6 sm:px-12 py-4 sm:py-6 bg-white text-black hover:bg-white/90 transition-all duration-300 font-light text-sm sm:text-base tracking-[0.2em] uppercase shadow-2xl hover:shadow-3xl transform hover:scale-105 min-h-[48px]"
                  >
                    View Class Schedule & Book
                  </button>
                </div>

                {/* FitZone+ App Section */}
                <section className="py-20 px-6 bg-gradient-to-b from-black via-gray-950 to-black">
                  <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                      <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-10 tracking-tight">
                        FitZone+
                      </h2>
                      <div className="w-24 h-0.5 bg-white/30 mx-auto mb-12"></div>
                      <p className="text-xl md:text-2xl text-white/80 mb-16 font-light max-w-3xl mx-auto leading-relaxed">
                        Get exclusive access to 1,000+ hours of live and on-demand classes. Wherever you are. Whenever you're ready.
                      </p>
                    </div>
                    
                    {/* App Preview Mockups */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4">
                      {[
                        { title: 'Class Schedule', color: 'from-blue-500/20 to-blue-600/30' },
                        { title: 'Workout Tracking', color: 'from-purple-500/20 to-purple-600/30' },
                        { title: 'Member Dashboard', color: 'from-green-500/20 to-green-600/30' }
                      ].map((app, idx) => (
                        <div key={idx} className="relative group">
                          <div className={`bg-gradient-to-br ${app.color} border border-white/10 rounded-2xl p-6 sm:p-8 h-[300px] sm:h-[350px] md:h-[400px] flex flex-col items-center justify-center hover:border-white/20 transition-all duration-300 cursor-pointer`}>
                            <h3 className="text-lg sm:text-xl font-light text-white mb-2 break-words text-center">{app.title}</h3>
                            <p className="text-white/60 text-xs sm:text-sm font-light text-center">Interactive preview</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Interactive Buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                      <button 
                        onClick={() => setShowVideoLibrary(true)}
                        className="group relative px-12 py-5 border-2 border-white/30 hover:border-white/60 hover:bg-white/5 transition-all duration-300 text-sm font-light tracking-[0.2em] uppercase"
                      >
                        Video Library
                      </button>
                      <button 
                        onClick={() => setShowMobileApp(true)}
                        className="group relative px-12 py-5 border-2 border-white/30 hover:border-white/60 hover:bg-white/5 transition-all duration-300 text-sm font-light tracking-[0.2em] uppercase"
                      >
                        Mobile App
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          )

        case 'training':
          return (
            <section className="py-20 px-6 bg-black min-h-screen">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-10 tracking-tight">
                    Training & Coaching
                  </h2>
                  <div className="w-24 h-0.5 bg-white/30 mx-auto mb-12"></div>
                  <p className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed">
                    Precision-backed training programs designed to maximize your potential
                  </p>
                </div>

                {/* Coach Spotlight */}
                <div className="mb-16">
                  <h3 className="text-3xl font-light text-white mb-8 text-center">Meet Our Coaches</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    {trainers.map((trainer) => (
                      <div key={trainer.id} className="bg-gray-900/50 border border-white/5 rounded-xl p-6 hover:border-white/20 transition-all duration-300 group cursor-pointer" onClick={() => setShowTrainerProfiles(true)}>
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mx-auto mb-4 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                          <span className="text-white/50 text-xs font-light uppercase">Coach</span>
                        </div>
                        <h4 className="text-white font-light text-center mb-2">{trainer.name}</h4>
                        <p className="text-blue-400 text-sm font-light text-center mb-2">{trainer.specialty}</p>
                        <div className="flex items-center justify-center gap-1 mb-3">
                          <span className="text-white/70 text-sm font-light">Rating: {trainer.rating}</span>
                        </div>
                        <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-light">
                          View Schedule
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Training Programs */}
                <div className="mb-12">
                  <h3 className="text-3xl font-light text-white mb-8 text-center">Training Programs</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { name: 'Elite Performance', desc: '12-week intensive program', duration: '12 weeks' },
                      { name: 'Strength Builder', desc: 'Progressive overload training', duration: '8 weeks' },
                      { name: 'Flexibility & Mobility', desc: 'Yoga and stretching focused', duration: '6 weeks' }
                    ].map((program, idx) => (
                      <div key={idx} className="bg-gray-900/50 border border-white/5 rounded-xl p-8 hover:border-white/20 transition-all duration-300">
                        <h4 className="text-xl font-light text-white mb-3">{program.name}</h4>
                        <p className="text-white/70 font-light mb-4">{program.desc}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-white/50 text-sm font-light">{program.duration}</span>
                          <button className="text-blue-400 hover:text-blue-300 text-sm font-light">Learn More →</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <button 
                    onClick={() => setShowTrainerProfiles(true)}
                    className="px-14 py-6 bg-white text-black hover:bg-white/90 transition-all duration-300 font-light text-base tracking-[0.2em] uppercase shadow-2xl hover:shadow-3xl transform hover:scale-105"
                  >
                    Book a Session
                  </button>
                </div>
              </div>
            </section>
          )

        case 'membership':
          return (
            <section className="py-20 px-6 bg-black min-h-screen">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-10 tracking-tight">
                    Membership Tiers
                  </h2>
                  <div className="w-24 h-0.5 bg-white/30 mx-auto mb-12"></div>
                  <p className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed">
                    Choose the membership that fits your fitness journey
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      name: 'Essential',
                      price: '$69',
                      period: '/mo',
                      features: ['Access to all clubs', 'Unlimited classes', 'Locker room access', 'Mobile app']
                    },
                    {
                      name: 'Performance',
                      price: '$129',
                      period: '/mo',
                      features: ['Everything in Essential', 'Spa access', 'Priority class booking', 'Nutrition planning', 'Progress tracking'],
                      highlighted: true
                    },
                    {
                      name: 'Elite+',
                      price: '$199',
                      period: '/mo',
                      features: ['Everything in Performance', 'Personal training sessions', 'Exclusive events', 'Concierge service', 'Guest privileges']
                    }
                  ].map((tier, idx) => (
                    <div key={idx} className={`bg-gray-900/50 border rounded-xl p-8 ${tier.highlighted ? 'border-white/30 md:scale-105 shadow-2xl' : 'border-white/5'} hover:border-white/20 transition-all duration-300`}>
                      <h3 className="text-2xl font-light text-white mb-2">{tier.name}</h3>
                      <div className="mb-6">
                        <span className="text-4xl font-light text-white">{tier.price}</span>
                        <span className="text-white/60 font-light">{tier.period}</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/70 font-light text-sm">
                            <span className="text-blue-400 mt-1 text-xs">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button className={`w-full py-3 rounded-lg font-light uppercase tracking-wider text-sm transition-all ${
                        tier.highlighted
                          ? 'bg-white text-black hover:bg-white/90'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      }`}>
                        Join Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )

        case 'amenities':
          return (
            <section className="py-20 px-6 bg-black min-h-screen">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-10 tracking-tight">
                    Where Luxury<br />and Fitness Meet
                  </h2>
                  <div className="w-24 h-0.5 bg-white/30 mx-auto mb-12"></div>
                  <p className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed">
                    Award-winning spaces and regenerative amenities designed to drive your performance forward.
                  </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Signature Classes */}
                  <div className="group cursor-pointer" onClick={() => { setFitnessPage('classes'); setShowClassBooking(true) }}>
                    <div className="relative h-[450px] overflow-hidden mb-6 rounded-lg border border-white/5 group-hover:border-white/20 transition-all duration-500">
                      <img 
                        src="/classes.jpg" 
                        alt="Signature Classes" 
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-[1.07] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-light uppercase tracking-wider text-white border border-white/20">
                          Training Floor
                        </span>
                      </div>
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
                  <div className="group cursor-pointer" onClick={() => setFitnessPage('training')}>
                    <div className="relative h-[450px] overflow-hidden mb-6 rounded-lg border border-white/5 group-hover:border-white/20 transition-all duration-500">
                      <img 
                        src="/personal-training.jpg" 
                        alt="Personal Training" 
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-[1.07] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-light uppercase tracking-wider text-white border border-white/20">
                          Training
                        </span>
                      </div>
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

                  {/* The Spa */}
                  <div className="group cursor-pointer">
                    <div className="relative h-[450px] overflow-hidden mb-6 rounded-lg border border-white/5 group-hover:border-white/20 transition-all duration-500">
                      <img 
                        src="/spa.jpg" 
                        alt="The Spa at FitZone" 
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-[1.07] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-light uppercase tracking-wider text-white border border-white/20">
                          Spa
                        </span>
                      </div>
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
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-[1.07] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-light uppercase tracking-wider text-white border border-white/20">
                          Amenities
                        </span>
                      </div>
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
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-[1.07] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-light uppercase tracking-wider text-white border border-white/20">
                          Spaces
                        </span>
                      </div>
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
                
                {/* Scrolling Marquee */}
                <div className="mt-16 overflow-hidden border-t border-white/10 pt-8">
                  <div className="animate-scroll whitespace-nowrap">
                    <span className="text-xs text-white/40 font-light tracking-[0.3em] uppercase mx-8">
                      HIGH-PERFORMANCE AMENITIES · DESIGNED FOR ATHLETES · ENGINEERED FOR RESULTS · HIGH-PERFORMANCE AMENITIES · DESIGNED FOR ATHLETES · ENGINEERED FOR RESULTS
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )

        default:
          return null
      }
    }

    return (
      <div className="bg-black text-white min-h-screen">
        {/* Advanced Premium Header - Gradient with Split Design */}
        <header className="bg-gradient-to-r from-black via-gray-950 to-black backdrop-blur-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex justify-between items-center border-b border-white/5 sticky top-0 z-50 shadow-2xl">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setFitnessPage('home')} className="cursor-pointer">
              <div className="text-lg sm:text-xl md:text-2xl font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white break-words">FITZONE</div>
              <div className="text-[8px] sm:text-[10px] text-white/50 font-light tracking-widest uppercase hidden sm:block">High Performance</div>
            </button>
          </div>
          <nav className="hidden lg:flex gap-4 xl:gap-6 text-xs font-light tracking-widest uppercase">
            <button onClick={() => setFitnessPage('home')} className={`hover:text-white transition-all duration-300 relative group px-3 py-2 ${fitnessPage === 'home' ? 'text-white' : 'text-white/80'}`}>
              <span className="relative z-10">Home</span>
              <span className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ${fitnessPage === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button onClick={() => setFitnessPage('classes')} className={`hover:text-white transition-all duration-300 relative group px-3 py-2 ${fitnessPage === 'classes' ? 'text-white' : 'text-white/80'}`}>
              <span className="relative z-10">Classes</span>
              <span className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ${fitnessPage === 'classes' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button onClick={() => setFitnessPage('training')} className={`hover:text-white transition-all duration-300 relative group px-3 py-2 ${fitnessPage === 'training' ? 'text-white' : 'text-white/80'}`}>
              <span className="relative z-10">Training</span>
              <span className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ${fitnessPage === 'training' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button onClick={() => setFitnessPage('membership')} className={`hover:text-white transition-all duration-300 relative group px-3 py-2 ${fitnessPage === 'membership' ? 'text-white' : 'text-white/80'}`}>
              <span className="relative z-10">Membership</span>
              <span className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ${fitnessPage === 'membership' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button onClick={() => setFitnessPage('amenities')} className={`hover:text-white transition-all duration-300 relative group px-3 py-2 ${fitnessPage === 'amenities' ? 'text-white' : 'text-white/80'}`}>
              <span className="relative z-10">Amenities</span>
              <span className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ${fitnessPage === 'amenities' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button onClick={() => setShowMemberPortal(true)} className="hover:text-white transition-all duration-300 relative group px-3 py-2 text-white/80">
              <span className="relative z-10">Member Portal</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-500"></span>
              <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden lg:block px-6 xl:px-8 py-2.5 xl:py-3 bg-gradient-to-r from-white to-gray-100 text-black hover:from-white hover:to-white transition-all duration-300 text-xs font-light tracking-widest uppercase shadow-2xl hover:shadow-3xl transform hover:scale-105 rounded-sm border border-white/20 min-h-[40px]">
              JOIN NOW
            </button>
            {/* Mobile Menu Button */}
            <button 
              onClick={() => {
                const mobileMenu = document.getElementById('mobile-menu')
                if (mobileMenu) {
                  mobileMenu.classList.toggle('hidden')
                }
              }}
              className="lg:hidden w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center text-white min-h-[40px] min-w-[40px]"
              aria-label="Menu"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="lg:hidden hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-sm overflow-y-auto">
          <div className="flex flex-col items-center justify-center min-h-full py-12 px-4 gap-6 sm:gap-8">
            <button 
              onClick={() => {
                setFitnessPage('home')
                document.getElementById('mobile-menu')?.classList.add('hidden')
              }}
              className={`text-xl sm:text-2xl font-light tracking-widest uppercase min-h-[48px] px-4 ${fitnessPage === 'home' ? 'text-white' : 'text-white/70'}`}
            >
              Home
            </button>
            <button 
              onClick={() => {
                setFitnessPage('classes')
                document.getElementById('mobile-menu')?.classList.add('hidden')
              }}
              className={`text-xl sm:text-2xl font-light tracking-widest uppercase min-h-[48px] px-4 ${fitnessPage === 'classes' ? 'text-white' : 'text-white/70'}`}
            >
              Classes
            </button>
            <button 
              onClick={() => {
                setFitnessPage('training')
                document.getElementById('mobile-menu')?.classList.add('hidden')
              }}
              className={`text-2xl font-light tracking-widest uppercase ${fitnessPage === 'training' ? 'text-white' : 'text-white/70'}`}
            >
              Training
            </button>
            <button 
              onClick={() => {
                setFitnessPage('membership')
                document.getElementById('mobile-menu')?.classList.add('hidden')
              }}
              className={`text-2xl font-light tracking-widest uppercase ${fitnessPage === 'membership' ? 'text-white' : 'text-white/70'}`}
            >
              Membership
            </button>
            <button 
              onClick={() => {
                setFitnessPage('amenities')
                document.getElementById('mobile-menu')?.classList.add('hidden')
              }}
              className={`text-2xl font-light tracking-widest uppercase ${fitnessPage === 'amenities' ? 'text-white' : 'text-white/70'}`}
            >
              Amenities
            </button>
            <button 
              onClick={() => {
                setShowMemberPortal(true)
                document.getElementById('mobile-menu')?.classList.add('hidden')
              }}
              className="text-2xl font-light tracking-widest uppercase text-white/70"
            >
              Member Portal
            </button>
            <button 
              onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center text-white"
            >
              ×
            </button>
          </div>
        </div>

        {/* Page Content with Smooth Transitions */}
        <div key={fitnessPage} className="animate-fade-in">
          {renderPageContent()}
        </div>

        {/* Footer - Always Visible */}
        <footer className="bg-black border-t border-white/10 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              <div>
                <h3 className="text-2xl font-light mb-6 tracking-wider text-white">FitZone</h3>
                <ul className="space-y-3 font-light">
                  <li><button onClick={() => setFitnessPage('home')} className="text-white/70 hover:text-white transition-colors">Home</button></li>
                  <li><button onClick={() => setFitnessPage('amenities')} className="text-white/70 hover:text-white transition-colors">Amenities</button></li>
                  <li><button onClick={() => setFitnessPage('membership')} className="text-white/70 hover:text-white transition-colors">Membership</button></li>
                  <li><button onClick={() => setFitnessPage('training')} className="text-white/70 hover:text-white transition-colors">Training</button></li>
                  <li><button onClick={() => setFitnessPage('amenities')} className="text-white/70 hover:text-white transition-colors">Spa</button></li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-light mb-6 tracking-wider text-white">Member Tools</h3>
                <ul className="space-y-3 font-light">
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Login</a></li>
                  <li><button onClick={() => { setFitnessPage('classes'); setShowClassBooking(true) }} className="text-white/70 hover:text-white transition-colors">Class Schedule</button></li>
                  <li><button onClick={() => setShowMobileApp(true)} className="text-white/70 hover:text-white transition-colors">Mobile App</button></li>
                  <li><button onClick={() => setShowMemberPortal(true)} className="text-white/70 hover:text-white transition-colors">Member Portal</button></li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-light mb-6 tracking-wider text-white">Contact</h3>
                <ul className="space-y-3 font-light text-white/70">
                  <li className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider">Location:</span>
                    <span>1200 Brickell Ave, Miami, FL 33131</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider">Phone:</span>
                    <span>(305) 555-0123</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider">Email:</span>
                    <span>info@fitzone.com</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-white/50 font-light text-sm">
              © {new Date().getFullYear()} FitZone. All rights reserved.
            </div>
          </div>
        </footer>

        {/* Modals and Popups */}
        {/* Class Booking Modal with Waitlists */}
        {showClassBooking && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowClassBooking(false)}
          >
            <div 
              className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full border border-gray-700 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-light text-white">Class Booking</h2>
                <button
                  onClick={() => setShowClassBooking(false)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                {classes.map((classItem) => (
                  <div key={classItem.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-light text-white mb-2">{classItem.name}</h3>
                        <p className="text-white/60 text-sm font-light">{classItem.time} • {classItem.instructor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-sm font-light mb-1">
                          {classItem.booked}/{classItem.capacity} booked
                        </p>
                        {classItem.booked >= classItem.capacity ? (
                          <span className="text-xs text-amber-400 font-light">Full - {classItem.waitlist} on waitlist</span>
                        ) : (
                          <span className="text-xs text-green-400 font-light">{classItem.capacity - classItem.booked} spots available</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (classItem.booked >= classItem.capacity) {
                          alert(`Added to waitlist for ${classItem.name}. You'll be notified if a spot opens up.`)
                        } else {
                          alert(`Booked ${classItem.name} at ${classItem.time}!`)
                        }
                      }}
                      className={`w-full px-6 py-3 rounded-lg font-light uppercase tracking-wider transition-all ${
                        classItem.booked >= classItem.capacity
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {classItem.booked >= classItem.capacity ? 'Join Waitlist' : 'Book Class'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Member Portal with Progress Analytics */}
        {showMemberPortal && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowMemberPortal(false)}
          >
            <div 
              className="bg-gray-900 rounded-2xl p-8 max-w-6xl w-full border border-gray-700 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light text-white">Member Portal Dashboard</h2>
                <button
                  onClick={() => setShowMemberPortal(false)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Dashboard Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-light text-white mb-4">Workout Stats</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/70 text-sm">This Month</span>
                        <span className="text-white text-sm font-light">24 workouts</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/70 text-sm">Calories Burned</span>
                        <span className="text-white text-sm font-light">12,450</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/70 text-sm">Classes Attended</span>
                        <span className="text-white text-sm font-light">18/20 goal</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-light text-white mb-4">Progress Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Weight Loss</span>
                      <span className="text-green-400 text-sm font-light">-8 lbs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Strength Gain</span>
                      <span className="text-blue-400 text-sm font-light">+15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Cardio Endurance</span>
                      <span className="text-purple-400 text-sm font-light">+22%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Flexibility</span>
                      <span className="text-amber-400 text-sm font-light">+18%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-light text-white mb-4">Body Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Body Fat</span>
                      <span className="text-white text-sm font-light">18.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Muscle Mass</span>
                      <span className="text-white text-sm font-light">145 lbs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Resting HR</span>
                      <span className="text-white text-sm font-light">58 bpm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">VO2 Max</span>
                      <span className="text-white text-sm font-light">42 ml/kg/min</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Calendar View & Meal Tracking */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-light text-white mb-4">Class Schedule</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <div>
                        <p className="text-white font-light">HIIT Power</p>
                        <p className="text-white/60 text-sm font-light">Tomorrow, 6:00 AM</p>
                      </div>
                      <span className="text-xs text-green-400 font-light">Booked</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <div>
                        <p className="text-white font-light">Yoga Flow</p>
                        <p className="text-white/60 text-sm font-light">Friday, 7:30 AM</p>
                      </div>
                      <span className="text-xs text-green-400 font-light">Booked</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <div>
                        <p className="text-white font-light">Strength Training</p>
                        <p className="text-white/60 text-sm font-light">Saturday, 9:00 AM</p>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 text-sm font-light">Book Now</button>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-light text-white mb-4">Meal Tracking</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Today's Calories</span>
                      <span className="text-white text-sm font-light">1,850 / 2,200</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/70">Protein</span>
                      <span className="text-white font-light">145g / 180g</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/70">Carbs</span>
                      <span className="text-white font-light">220g / 250g</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Class Check-ins */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-light text-white mb-4">Recent Check-ins</h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-white/50 text-xs font-light mb-1">{day}</div>
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-light ${
                        idx < 5 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700 text-white/30'
                      }`}>
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trainer Profiles and Schedules */}
        {showTrainerProfiles && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowTrainerProfiles(false)}
          >
            <div 
              className="bg-gray-900 rounded-2xl p-8 max-w-5xl w-full border border-gray-700 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light text-white">Trainer Profiles</h2>
                <button
                  onClick={() => setShowTrainerProfiles(false)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {trainers.map((trainer) => (
                  <div key={trainer.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-light text-white mb-1">{trainer.name}</h3>
                        <p className="text-blue-400 text-sm font-light mb-2">{trainer.specialty}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-amber-400 text-sm">★</span>
                          <span className="text-white/70 text-sm font-light">{trainer.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-white/60 text-sm font-light">
                        <span className="text-white/80">Schedule:</span> {trainer.schedule}
                      </p>
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-light">
                      View Schedule & Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* On-Demand Video Library */}
        {showVideoLibrary && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowVideoLibrary(false)}
          >
            <div 
              className="bg-gray-900 rounded-2xl p-8 max-w-6xl w-full border border-gray-700 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light text-white">On-Demand Workout Library</h2>
                <button
                  onClick={() => setShowVideoLibrary(false)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: 'HIIT Power', duration: '30 min', category: 'Cardio' },
                  { title: 'Yoga Flow', duration: '45 min', category: 'Flexibility' },
                  { title: 'Strength Builder', duration: '40 min', category: 'Strength' },
                  { title: 'Cycling Endurance', duration: '35 min', category: 'Cardio' },
                  { title: 'Pilates Core', duration: '25 min', category: 'Core' },
                  { title: 'Meditation', duration: '20 min', category: 'Recovery' }
                ].map((video, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer group">
                    <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
                        <span className="text-white text-2xl">▶</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-light">{video.title}</h3>
                        <span className="text-white/50 text-xs font-light">{video.duration}</span>
                      </div>
                      <p className="text-blue-400 text-xs font-light uppercase">{video.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Nutrition Planning Tools */}
        {showNutritionTools && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowNutritionTools(false)}
          >
            <div 
              className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full border border-gray-700 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light text-white">Nutrition Planning</h2>
                <button
                  onClick={() => setShowNutritionTools(false)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-light text-white mb-4">Daily Macros</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-light text-blue-400 mb-1">185g</p>
                      <p className="text-white/60 text-sm font-light">Protein</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-light text-green-400 mb-1">245g</p>
                      <p className="text-white/60 text-sm font-light">Carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-light text-amber-400 mb-1">65g</p>
                      <p className="text-white/60 text-sm font-light">Fats</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-light text-white mb-4">Meal Plans</h3>
                  <div className="space-y-3">
                    {['High Protein Plan', 'Keto-Friendly', 'Balanced Nutrition', 'Muscle Building'].map((plan, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0">
                        <span className="text-white font-light">{plan}</span>
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-light">View Plan</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-light text-white mb-4">Calorie Tracker</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="text-white/70 text-sm">Today's Intake</span>
                        <span className="text-white text-sm font-light">1,850 / 2,200 cal</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile App Integration */}
        {showMobileApp && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowMobileApp(false)}
          >
            <div 
              className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full border border-gray-700 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light text-white">FitZone Mobile App</h2>
                <button
                  onClick={() => setShowMobileApp(false)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-6">
                <p className="text-white/70 font-light leading-relaxed text-lg">
                  Access all FitZone features on the go with our comprehensive mobile app.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-light text-white mb-3">App Features</h3>
                    <ul className="space-y-2 text-white/70 font-light text-sm">
                      <li>• Class booking & waitlist management</li>
                      <li>• Real-time workout tracking</li>
                      <li>• Progress analytics & insights</li>
                      <li>• Trainer schedules & booking</li>
                      <li>• On-demand video library</li>
                      <li>• Nutrition planning tools</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-light text-white mb-3">Download Now</h3>
                    <div className="space-y-3">
                      <button className="w-full px-6 py-3 bg-white text-black rounded-lg font-light hover:bg-white/90 transition-all">
                        Download for iOS
                      </button>
                      <button className="w-full px-6 py-3 bg-white text-black rounded-lg font-light hover:bg-white/90 transition-all">
                        Download for Android
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    )
  }

  // ========== REAL ESTATE SITE - Zillow-Inspired Design ==========
  function renderRealEstateSite(
    viewMode, setViewMode, showFilters, setShowFilters,
    showMapSearch, setShowMapSearch,
    showVirtualTour, setShowVirtualTour, selectedProperty, setSelectedProperty,
    showLeadForm, setShowLeadForm,
    showMortgageCalc, setShowMortgageCalc,
    showNeighborhoodInsights, setShowNeighborhoodInsights,
    showAgentContact, setShowAgentContact,
    realEstatePage, setRealEstatePage
  ) {
    
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

    // Render page content based on current page
    const renderPageContent = (page, properties, viewMode, setViewMode, showFilters, setShowFilters,
      showMapSearch, setShowMapSearch,
      showVirtualTour, setShowVirtualTour, selectedProperty, setSelectedProperty,
      showLeadForm, setShowLeadForm,
      showNeighborhoodInsights, setShowNeighborhoodInsights,
      showAgentContact, setShowAgentContact,
      setRealEstatePage) => {
      
      switch(page) {
        case 'home':
          return (
            <>
              {/* Enhanced Hero Search Section */}
              <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 border-b border-gray-200 py-12 sm:py-16 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent break-words px-4">
                    Find your place
                  </h1>
                  <p className="text-center text-gray-600 mb-6 sm:mb-10 text-base sm:text-lg px-4">Search homes, condos, and more</p>
                  <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          placeholder="Enter an address, neighborhood, city, or ZIP code" 
                          className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base min-h-[48px]"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button className="px-6 sm:px-10 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors whitespace-nowrap shadow-md hover:shadow-lg min-h-[48px] text-sm sm:text-base">
                          Search
                        </button>
                        <button 
                          onClick={() => setShowMapSearch(true)}
                          className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors whitespace-nowrap min-h-[48px] text-sm sm:text-base"
                        >
                          Map View
                        </button>
                      </div>
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
                <section className="bg-white border-b border-gray-200 py-4 sm:py-6 px-4 sm:px-6">
                  <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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

              {/* Market Insights */}
              <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 px-4 break-words">Market Insights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                      <div className="text-sm text-blue-700 font-semibold mb-2">Median Home Price</div>
                      <div className="text-3xl font-bold text-blue-900 mb-1">$625,000</div>
                      <div className="text-sm text-blue-700">↑ 5.2% from last year</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
                      <div className="text-sm text-green-700 font-semibold mb-2">Average Days on Market</div>
                      <div className="text-3xl font-bold text-green-900 mb-1">28 days</div>
                      <div className="text-sm text-green-700">↓ 12% faster than last year</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
                      <div className="text-sm text-purple-700 font-semibold mb-2">Price per Sqft</div>
                      <div className="text-3xl font-bold text-purple-900 mb-1">$312</div>
                      <div className="text-sm text-purple-700">↑ 3.8% from last year</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Additional Info Section */}
              <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                      <h3 className="text-xl font-bold mb-3">Buy a home</h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">Find your place with an immersive photo experience and the most listings, including things you won't find anywhere else.</p>
                      <button 
                        onClick={() => setRealEstatePage('properties')}
                        className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1 transition-all hover:gap-2"
                      >
                        Browse homes <span>→</span>
                      </button>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                      <h3 className="text-xl font-bold mb-3">Sell a home</h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">No matter what path you take to sell your home, we can help you navigate a successful sale.</p>
                      <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1 transition-all hover:gap-2">
                        See your options <span>→</span>
                      </button>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                      <h3 className="text-xl font-bold mb-3">Rent a home</h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">We're creating a seamless online experience – from shopping on the largest rental network, to applying, to paying rent.</p>
                      <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1 transition-all hover:gap-2">
                        Find rentals <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )
        
        case 'properties':
          return (
            <>
              {/* Main Content Area - List/Map Toggle */}
              <section className="py-6 sm:py-8 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 break-words">Homes for sale</h2>
                      <p className="text-sm sm:text-base text-gray-600">6 homes available</p>
                    </div>
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base min-h-[40px] ${
                          viewMode === 'list' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        List View
                      </button>
                      <button 
                        onClick={() => setViewMode('map')}
                        className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base min-h-[40px] ${
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-3">
                              <div className="text-xs text-gray-500">
                                Built in {property.year}
                              </div>
                              <div className="text-sm font-semibold text-blue-600">
                                Est. ${Math.round(parseInt(property.price.replace(/[^0-9]/g, '')) / 30 / 1000)}k/mo
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedProperty(property)
                                  setShowVirtualTour(true)
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
                              >
                                360° Tour
                              </button>
                              <button
                                onClick={() => setShowLeadForm(true)}
                                className="flex-1 px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold text-sm transition-colors"
                              >
                                Get Info
                              </button>
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
            </>
          )
        
        case 'neighborhoods':
          return (
            <>
              {/* Featured Neighborhoods */}
              <section className="py-16 px-6 bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 px-4 break-words">Explore Popular Neighborhoods</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-4">
                    {[
                      { name: 'Downtown', count: '24 homes', avgPrice: '$485k', image: '/downtown.jpg' },
                      { name: 'Suburbia', count: '18 homes', avgPrice: '$620k', image: '/suburbia.jpg' },
                      { name: 'Coastal', count: '12 homes', avgPrice: '$1.1M', image: '/coastal.jpg' },
                      { name: 'Riverside', count: '31 homes', avgPrice: '$395k', image: '/riverside.jpg' }
                    ].map((neighborhood, i) => (
                      <div 
                        key={i} 
                        onClick={() => setShowNeighborhoodInsights(true)}
                        className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                      >
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
            </>
          )
        
        case 'agents':
          return (
            <>
              {/* Top Agents Section */}
              <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 px-4 break-words">Top Agents in Your Area</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-4">
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
                        <button 
                          onClick={() => {
                            setShowLeadForm(true)
                            setShowAgentContact(false)
                          }}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
                        >
                          Contact Agent
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )
        
        default:
          return null
      }
    }

    return (
      <div className="bg-gray-50 text-gray-900 min-h-screen">
        {/* Clean Modern Header - Professional Real Estate Design */}
        <header className="bg-white border-b-2 border-blue-600 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
          <button 
            onClick={() => setRealEstatePage('home')}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 tracking-tight hover:opacity-80 transition-opacity cursor-pointer break-words"
          >
            Prime Properties
          </button>
          <nav className="hidden md:flex gap-4 lg:gap-8 items-center">
            <button 
              onClick={() => setRealEstatePage('properties')}
              className={`text-sm font-semibold transition-colors relative group ${
                realEstatePage === 'properties' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <span>Properties</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                realEstatePage === 'properties' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </button>
            <button 
              onClick={() => setRealEstatePage('neighborhoods')}
              className={`text-sm font-semibold transition-colors relative group ${
                realEstatePage === 'neighborhoods' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <span>Neighborhoods</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                realEstatePage === 'neighborhoods' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </button>
            <button 
              onClick={() => setRealEstatePage('agents')}
              className={`text-sm font-semibold transition-colors relative group ${
                realEstatePage === 'agents' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <span>Agents</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                realEstatePage === 'agents' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </button>
            <button 
              onClick={() => setShowMortgageCalc(true)}
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              <span>Mortgage Calculator</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </button>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="px-4 sm:px-5 py-2 text-xs sm:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors hidden md:block min-h-[40px]">Sign in</button>
            <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs sm:text-sm font-semibold transition-colors shadow-lg hover:shadow-xl hidden md:block min-h-[40px]">List your home</button>
            <button 
              onClick={() => setRealEstatePage(realEstatePage === 'mobileMenu' ? 'home' : 'mobileMenu')}
              className="md:hidden text-gray-700 hover:text-blue-600 text-2xl p-2 min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Menu"
            >
              ☰
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {realEstatePage === 'mobileMenu' && (
          <div className="fixed inset-0 z-[100] bg-white md:hidden">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div className="text-2xl font-bold text-blue-600">Prime Properties</div>
                <button 
                  onClick={() => setRealEstatePage('home')}
                  className="text-3xl text-gray-700"
                >
                  ×
                </button>
              </div>
              <nav className="flex flex-col p-6 gap-4">
                <button 
                  onClick={() => setRealEstatePage('home')}
                  className="text-left text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Home
                </button>
                <button 
                  onClick={() => setRealEstatePage('properties')}
                  className="text-left text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Properties
                </button>
                <button 
                  onClick={() => setRealEstatePage('neighborhoods')}
                  className="text-left text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Neighborhoods
                </button>
                <button 
                  onClick={() => setRealEstatePage('agents')}
                  className="text-left text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Agents
                </button>
                <button 
                  onClick={() => { setShowMortgageCalc(true); setRealEstatePage('home'); }}
                  className="text-left text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Mortgage Calculator
                </button>
                <div className="border-t border-gray-200 my-4"></div>
                <button className="text-left text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors py-2">
                  Sign in
                </button>
                <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-colors mt-2">
                  List your home
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        {realEstatePage !== 'mobileMenu' && renderPageContent(
          realEstatePage,
          properties,
          viewMode, setViewMode, showFilters, setShowFilters,
          showMapSearch, setShowMapSearch,
          showVirtualTour, setShowVirtualTour, selectedProperty, setSelectedProperty,
          showLeadForm, setShowLeadForm,
          showNeighborhoodInsights, setShowNeighborhoodInsights,
          showAgentContact, setShowAgentContact,
          setRealEstatePage
        )}

        {/* Modals and overlays - always available */}
        {/* Advanced Property Search with Maps */}
        {showMapSearch && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowMapSearch(false)}
          >
            <div 
              className="bg-white rounded-2xl p-8 max-w-6xl w-full border border-gray-300 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Map Search</h2>
                <button
                  onClick={() => setShowMapSearch(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
            </div>
              <div className="mb-6">
                <input 
                  type="text" 
                  placeholder="Search by address, city, or ZIP code"
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
          </div>
              <div className="relative h-[500px] bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 font-semibold text-lg mb-2">Interactive Map View</p>
                  <p className="text-gray-500 text-sm">Powered by Google Maps API</p>
                  <p className="text-gray-400 text-xs mt-4">Click on property markers to view details</p>
            </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                  Apply Filters
            </button>
                <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors">
                  Reset View
            </button>
          </div>
          </div>
          </div>
        )}

        {/* 360° Virtual Tour */}
        {showVirtualTour && selectedProperty && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setShowVirtualTour(false); setSelectedProperty(null) }}
          >
            <div 
              className="bg-white rounded-2xl p-8 max-w-5xl w-full border border-gray-300 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">360° Virtual Tour</h2>
                  <p className="text-gray-600 mt-1">{selectedProperty.address}</p>
              </div>
          <button
                  onClick={() => { setShowVirtualTour(false); setSelectedProperty(null) }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
          >
                  ×
          </button>
              </div>
              <div className="relative h-[500px] bg-gray-900 rounded-lg border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                <div className="text-center text-white">
                  <p className="font-semibold text-lg mb-2">Interactive 360° Tour</p>
                  <p className="text-gray-300 text-sm">Drag to explore • Click hotspots for details</p>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all text-sm font-semibold">
                    Living Room
                  </button>
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all text-sm font-semibold">
                    Kitchen
                  </button>
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all text-sm font-semibold">
                    Bedroom
                  </button>
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all text-sm font-semibold">
                    Bathroom
                  </button>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
          <button
                  onClick={() => { setShowLeadForm(true); setShowVirtualTour(false) }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
                  Schedule a Viewing
          </button>
                <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors">
                  Share Tour
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Intelligent Lead Capture Form */}
        {showLeadForm && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowLeadForm(false)}
          >
            <div 
              className="bg-white rounded-2xl p-8 max-w-2xl w-full border border-gray-300 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Get More Information</h2>
              <button
                  onClick={() => setShowLeadForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
          </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Phone</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(555) 123-4567"
                  />
                  </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Property Interest</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Buying</option>
                    <option>Selling</option>
                    <option>Renting</option>
                    <option>Just Browsing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Timeline</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Within 1 month</option>
                    <option>1-3 months</option>
                    <option>3-6 months</option>
                    <option>6+ months</option>
                  </select>
                  </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Message (Optional)</label>
                  <textarea 
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about your needs..."
                  />
                </div>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Thank you! An agent will contact you shortly.')
                    setShowLeadForm(false)
                  }}
                  className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
                  </div>
                </div>
        )}

        {/* Mortgage Calculator */}
        {showMortgageCalc && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowMortgageCalc(false)}
          >
            <div 
              className="bg-white rounded-2xl p-8 max-w-3xl w-full border border-gray-300 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Mortgage Calculator</h2>
                <button
                  onClick={() => setShowMortgageCalc(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
                  </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Home Price</label>
                    <input 
                      type="number" 
                      defaultValue="500000"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Down Payment</label>
                    <input 
                      type="number" 
                      defaultValue="100000"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
              </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Interest Rate (%)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      defaultValue="6.5"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Loan Term (years)</label>
                    <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>15</option>
                      <option selected>30</option>
                    </select>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Payment</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal & Interest</span>
                      <span className="font-bold text-gray-900">$2,528</span>
                  </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Tax</span>
                      <span className="font-bold text-gray-900">$417</span>
                </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Home Insurance</span>
                      <span className="font-bold text-gray-900">$125</span>
              </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PMI</span>
                      <span className="font-bold text-gray-900">$0</span>
                </div>
                    <div className="border-t-2 border-blue-300 pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total Monthly Payment</span>
                        <span className="text-2xl font-bold text-blue-600">$3,070</span>
                  </div>
                </div>
                  </div>
                  <button 
                    onClick={() => setShowLeadForm(true)}
                    className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Get Pre-Approved
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Neighborhood Insights */}
        {showNeighborhoodInsights && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowNeighborhoodInsights(false)}
          >
            <div 
              className="bg-white rounded-2xl p-8 max-w-5xl w-full border border-gray-300 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Neighborhood Insights</h2>
                <button
                  onClick={() => setShowNeighborhoodInsights(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                    </button>
                  </div>
              <div className="mb-6">
                <input 
                  type="text" 
                  placeholder="Search neighborhood or ZIP code"
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                  </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: 'Downtown', walkScore: 95, crimeRate: 'Low', schools: '8/10', avgPrice: '$485k', growth: '+5.2%' },
                  { name: 'Suburbia', walkScore: 45, crimeRate: 'Very Low', schools: '9/10', avgPrice: '$620k', growth: '+4.8%' },
                  { name: 'Coastal', walkScore: 78, crimeRate: 'Low', schools: '9/10', avgPrice: '$1.1M', growth: '+7.1%' },
                  { name: 'Riverside', walkScore: 62, crimeRate: 'Low', schools: '7/10', avgPrice: '$395k', growth: '+3.9%' }
                ].map((area, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{area.name}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Walk Score</span>
                        <span className="font-semibold text-gray-900">{area.walkScore}/100</span>
                    </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crime Rate</span>
                        <span className="font-semibold text-green-600">{area.crimeRate}</span>
                    </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">School Rating</span>
                        <span className="font-semibold text-gray-900">{area.schools}</span>
                    </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg. Home Price</span>
                        <span className="font-semibold text-gray-900">{area.avgPrice}</span>
                  </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Growth (YoY)</span>
                        <span className="font-semibold text-green-600">{area.growth}</span>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
            </div>
        )}

        {/* Agent Contact System */}
        {showAgentContact && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowAgentContact(false)}
          >
            <div 
              className="bg-white rounded-2xl p-8 max-w-4xl w-full border border-gray-300 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Find Your Perfect Agent</h2>
              <button 
                  onClick={() => setShowAgentContact(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                  ×
              </button>
            </div>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {[
                  { name: 'Sarah Johnson', sales: '127 sales', rating: 4.9, specialties: 'Luxury Homes, First-Time Buyers', phone: '(555) 123-4567', email: 'sarah@primeproperties.com' },
                  { name: 'Michael Chen', sales: '98 sales', rating: 4.8, specialties: 'Investment Properties, Condos', phone: '(555) 234-5678', email: 'michael@primeproperties.com' },
                  { name: 'Emily Rodriguez', sales: '156 sales', rating: 5.0, specialties: 'Family Homes, Relocations', phone: '(555) 345-6789', email: 'emily@primeproperties.com' }
                ].map((agent, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-500 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${i === 0 ? 'from-blue-300 to-blue-500' : i === 1 ? 'from-green-300 to-green-500' : 'from-purple-300 to-purple-500'} flex items-center justify-center text-2xl text-white font-bold`}>
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
                    <p className="text-sm text-gray-600 mb-4">{agent.specialties}</p>
                    <div className="space-y-2 mb-4">
                      <div className="text-xs text-gray-500">{agent.phone}</div>
                      <div className="text-xs text-gray-500">{agent.email}</div>
                </div>
                  <button
                    onClick={() => {
                        setShowLeadForm(true)
                        setShowAgentContact(false)
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
                    >
                      Contact Agent
                  </button>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <h3 className="font-bold text-gray-900 mb-2">Need Help Finding the Right Agent?</h3>
                <p className="text-sm text-gray-600 mb-4">Our intelligent matching system will connect you with an agent based on your needs and preferences.</p>
                <button
                  onClick={() => {
                    setShowLeadForm(true)
                    setShowAgentContact(false)
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Get Matched with an Agent
                </button>
              </div>
            </div>
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
                </div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold">
            <a href="#" className="hover:text-pink-600 transition-colors">Work</a>
            <a href="#" className="hover:text-pink-600 transition-colors">About</a>
            <a href="#" className="hover:text-pink-600 transition-colors">Contact</a>
          </nav>
          <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 font-bold text-sm transition-all shadow-lg">Let's Work Together</button>
        </header>
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
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold">
            <a href="#" className="hover:text-pink-600 transition-colors">Work</a>
            <a href="#" className="hover:text-pink-600 transition-colors">About</a>
            <a href="#" className="hover:text-pink-600 transition-colors">Contact</a>
          </nav>
          <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 font-bold text-sm transition-all shadow-lg">Let's Work Together</button>
        </header>
      </div>
    )
  }

  // ========== TRAVEL SITE - Adventure Booking Platform ==========
  function renderTravelSite() {
    return (
      <div className="bg-white text-gray-900 min-h-screen">
        {/* Travel Header */}
        <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
          <div className="text-2xl font-bold">Wanderlust</div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold">
            <a href="#" className="hover:text-blue-100 transition-colors">Destinations</a>
            <a href="#" className="hover:text-blue-100 transition-colors">Tours</a>
            <a href="#" className="hover:text-blue-100 transition-colors">Book</a>
          </nav>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-bold text-sm transition-colors shadow-lg">Sign In</button>
        </header>
      </div>
    )
  }

  // ========== FINANCE SITE - Banking Platform ==========
  function renderFinanceSite() {
    return (
      <div className="bg-white text-gray-900 min-h-screen">
        {/* Finance Header */}
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
          <div className="text-2xl font-bold">SecureBank</div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold">
            <a href="#" className="hover:text-indigo-100 transition-colors">Accounts</a>
            <a href="#" className="hover:text-indigo-100 transition-colors">Investments</a>
            <a href="#" className="hover:text-indigo-100 transition-colors">Loans</a>
          </nav>
          <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-bold text-sm transition-colors shadow-lg">Sign In</button>
        </header>
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

