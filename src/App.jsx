import { useState } from 'react'
import ServiceCard from './components/ServiceCard'
import PortfolioCard from './components/PortfolioCard'
import ProjectModal from './components/ProjectModal'
import PricingCard from './components/PricingCard'
import { portfolioProjects } from './data/portfolioProjects'
import { spacing, shadows } from './constants/designSystem'

function App() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedPricing, setExpandedPricing] = useState(null)
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden w-full">
      {/* Header with Logo */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-5 flex items-center justify-between">
          <a href="#" className="flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
            <img 
              src="/azul-logo.png" 
              alt="Azul" 
              className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
          </a>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-10 items-center">
            <a href="#about" className="text-sm text-gray-400 hover:text-blue-500 transition-colors font-medium relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#portfolio" className="text-sm text-gray-400 hover:text-blue-500 transition-colors font-medium relative group">
              Portfolio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-blue-500 transition-colors font-medium relative group">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" className="text-sm text-gray-400 hover:text-blue-500 transition-colors font-medium relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-blue-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-800 bg-gray-900/98 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a 
                href="#about" 
                className="block text-base text-gray-400 hover:text-blue-500 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#portfolio" 
                className="block text-base text-gray-400 hover:text-blue-500 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Portfolio
              </a>
              <a 
                href="#pricing" 
                className="block text-base text-gray-400 hover:text-blue-500 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#contact" 
                className="block text-base text-gray-400 hover:text-blue-500 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className={`relative py-20 sm:py-24 md:py-28 lg:py-36 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`}>
        {/* Floating gradient orbs with enhanced animation */}
        <div className="absolute top-10 right-10 sm:top-20 sm:right-20 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        {/* Additional floating elements for parallax effect */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight break-words" style={{ letterSpacing: '-0.02em' }}>
                  <span className="text-gray-100">Beautiful Web</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Experiences
                  </span>
                  <br />
                  <span className="text-gray-100">for Every</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                    Industry
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-blue-400/90 font-medium mb-3 sm:mb-4 leading-relaxed max-w-2xl break-words">
                  Premium, modern websites built with clean code, fast performance, and industry-leading UI/UX.
                </p>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl font-light break-words">
                  We craft stunning, high-performance websites and web applications that drive results. From elegant landing pages to powerful SaaS platforms.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 w-full sm:w-auto">
                <a 
                  href="https://calendly.com/purplexmythzz/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-6 sm:px-8 md:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-white hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 relative overflow-hidden text-center w-full sm:w-auto min-h-[48px] flex items-center justify-center"
                >
                  <span className="relative z-10 break-words">Book a Free Consultation</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a 
                  href="#portfolio" 
                  className="px-6 sm:px-8 md:px-10 py-4 sm:py-5 border-2 border-gray-700 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 text-center flex items-center justify-center group text-gray-300 w-full sm:w-auto min-h-[48px]"
                >
                  <span className="break-words">See Examples</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform flex-shrink-0">→</span>
                </a>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Glass morphism card */}
                <div className="bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-8 border-2 border-gray-700 shadow-2xl">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 space-y-4 border border-gray-700">
                    {/* Browser chrome */}
                    <div className="flex gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    {/* Content preview */}
                    <div className="space-y-3">
                      <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-3/4"></div>
                      <div className="h-3 bg-gray-600 rounded-full w-1/2"></div>
                      <div className="grid grid-cols-3 gap-3 mt-6">
                        <div className="h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-xl border border-blue-500/30"></div>
                        <div className="h-20 bg-gradient-to-br from-blue-600/30 to-blue-700/40 rounded-xl border border-blue-600/30"></div>
                        <div className="h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-xl border border-blue-500/30"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-blue-600/40 rounded-2xl rotate-12 opacity-50 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-500/30 rounded-2xl -rotate-12 opacity-40 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-900`}>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent" style={{ letterSpacing: '-0.02em' }}>
            About Azul
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-4 sm:mb-6 leading-relaxed px-4">
            We're a premium web development studio dedicated to creating beautiful, high-performance digital experiences that drive real results for businesses across all industries.
          </p>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 mx-auto rounded-full"></div>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-100">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
                To empower businesses with stunning, high-performance websites and web applications that not only look incredible but drive measurable growth and success.
              </p>
            </div>
          </div>
          <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-100">Our Values</h3>
              <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
                Quality, innovation, and client success are at the heart of everything we do. We believe in building long-term partnerships and delivering solutions that exceed expectations.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent" style={{ letterSpacing: '-0.02em' }}>
            Meet the Team
          </h3>
          <p className="text-base sm:text-lg text-gray-400">The talented developers behind Azul</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Evelio Gonzalez */}
          <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img 
                  src="/evelio.jpg" 
                  alt="Evelio Gonzalez" 
                  className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-700 group-hover:border-blue-500 transition-all duration-300 shadow-xl"
                />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold mb-2 text-gray-100">Evelio Gonzalez</h4>
              <p className="text-blue-400 mb-2 font-medium text-sm sm:text-base">Co-Founder & Lead Developer</p>
              <p className="text-gray-500 mb-3 sm:mb-4 text-xs sm:text-sm font-medium italic">Frontend, UI/UX, Branding</p>
              <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base px-2">
                Full-stack developer passionate about creating elegant solutions and exceptional user experiences.
              </p>
              <a 
                href="https://www.linkedin.com/in/evelio-gonzalez-77a3b5329/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg sm:rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* David Cabrera */}
          <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img 
                  src="/david.jpg" 
                  alt="David Cabrera" 
                  className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-700 group-hover:border-blue-500 transition-all duration-300 shadow-xl"
                />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold mb-2 text-gray-100">David Cabrera</h4>
              <p className="text-blue-400 mb-2 font-medium text-sm sm:text-base">Co-Founder & Lead Developer</p>
              <p className="text-gray-500 mb-3 sm:mb-4 text-xs sm:text-sm font-medium italic">Backend, Cloud, DevOps</p>
              <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base px-2">
                Experienced developer specializing in modern web technologies and scalable application architecture.
              </p>
              <a 
                href="https://www.linkedin.com/in/davidacabrerawrestling/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg sm:rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mt-12 sm:mt-16 md:mt-20 max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 opacity-50"></div>
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-100" style={{ letterSpacing: '-0.01em' }}>What Sets Us Apart</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center group">
                  <h4 className="text-xl font-bold mb-3 text-gray-100">Fast Turnaround</h4>
                  <p className="text-gray-400 leading-relaxed">
                    We deliver projects quickly without compromising on quality or attention to detail.
                  </p>
                </div>
                <div className="text-center group">
                  <h4 className="text-xl font-bold mb-3 text-gray-100">Premium Design</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Every project is crafted with meticulous attention to design, user experience, and brand identity.
                  </p>
                </div>
                <div className="text-center group">
                  <h4 className="text-xl font-bold mb-3 text-gray-100">Modern Technology</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Built with the latest frameworks and best practices for optimal performance and scalability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className={`py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-900`}>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent" style={{ letterSpacing: '-0.02em' }}>
            What We Do
          </h2>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
          <ServiceCard 
            title="Websites"
            description="Custom websites tailored to your brand and goals."
          />
          <ServiceCard 
            title="Webapps"
            description="Interactive web applications that solve real problems."
          />
          <ServiceCard 
            title="UI/UX & SEO"
            description="Beautiful designs optimized for search and conversions."
          />
          <ServiceCard 
            title="Performance & Security"
            description="Fast, secure sites that protect your data and users."
          />
          <ServiceCard 
            title="Maintenance"
            description="Ongoing support to keep your site running smoothly."
          />
        </div>
      </section>

      {/* Portfolio Section - "Built for Every Industry" */}
      <section id="portfolio" className={`py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 relative bg-gray-800`}>
        <div className="text-center mb-16 sm:mb-20 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Built for Every Industry
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Explore our portfolio of stunning websites across diverse industries
          </p>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
          {portfolioProjects.map((project) => (
            <PortfolioCard 
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Process Section */}
      <section className={`py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-900`}>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent" style={{ letterSpacing: '-0.02em' }}>
            Our Process
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4 sm:mb-6 leading-relaxed px-4">
            A transparent, structured approach to bringing your vision to life
          </p>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 mx-auto rounded-full"></div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                title: "Discovery Call",
                description: "We discuss your goals, target audience, and project requirements to understand your vision."
              },
              {
                step: "02",
                title: "Design Mockup",
                description: "We create detailed design mockups and wireframes for your approval before development begins."
              },
              {
                step: "03",
                title: "Development",
                description: "Our team builds your website or webapp using modern technologies and best practices."
              },
              {
                step: "04",
                title: "Launch + Support",
                description: "We launch your project and provide ongoing support to ensure everything runs smoothly."
              }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-6 sm:p-8 hover:border-blue-500/50 transition-all duration-300 group h-full">
                  <div className="text-4xl sm:text-5xl font-black text-blue-500/20 mb-4">{item.step}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{item.description}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-900 overflow-visible`}>
        <div className="text-center mb-12 sm:mb-16 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent overflow-visible" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
            Pricing
          </h2>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12">
          {[
            {
              title: "Starter Website",
              price: "$100-200",
              features: [
                "Up to 5 pages",
                "Mobile responsive design",
                "Basic SEO setup",
                "Contact form"
              ],
              details: [
                "Fully responsive on all devices",
                "Basic contact form with email integration",
                "SEO meta tags and descriptions",
                "Social media integration",
                "1 round of revisions",
                "2 weeks delivery time"
              ]
            },
            {
              title: "Business Website",
              price: "$350-500",
              highlighted: true,
              features: [
                "Up to 10 pages",
                "Custom design & branding",
                "Advanced SEO optimization",
                "CMS integration",
                "Analytics setup"
              ],
              details: [
                "Custom design tailored to your brand",
                "Advanced SEO with keyword optimization",
                "Content management system (CMS)",
                "Google Analytics & Search Console setup",
                "Social media integration",
                "3 rounds of revisions",
                "3-4 weeks delivery time",
                "1 month of support included"
              ]
            },
            {
              title: "Custom Webapp",
              price: "$1,200-2,000",
              features: [
                "Full-stack application",
                "User authentication",
                "Database integration",
                "API development",
                "Ongoing maintenance"
              ],
              details: [
                "Custom full-stack web application",
                "User authentication & authorization",
                "Database design & integration",
                "RESTful API development",
                "Third-party integrations",
                "Performance optimization",
                "Security best practices",
                "Unlimited revisions during development",
                "6-8 weeks delivery time",
                "3 months of support included"
              ]
            }
          ].map((plan, idx) => (
            <div key={idx} className={`bg-gray-800 rounded-xl sm:rounded-xl p-6 sm:p-8 border-2 transition-all duration-300 hover:shadow-xl overflow-visible ${
              plan.highlighted 
                ? 'border-blue-500 shadow-xl shadow-blue-500/30 md:scale-105' 
                : 'border-gray-700 hover:border-blue-500/50'
            }`}>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">{plan.title}</h3>
              <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-4 sm:mb-6">{plan.price}</div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-sm sm:text-base text-gray-400 flex items-start leading-relaxed">
                    <span className="text-blue-500 mr-2 sm:mr-3 font-bold flex-shrink-0 mt-0.5">✓</span>
                    <span className="flex-1">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setExpandedPricing(expandedPricing === idx ? null : idx)}
                className="w-full py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 mb-3 bg-gray-700 text-gray-200 hover:bg-gray-600 border-2 border-gray-600"
              >
                {expandedPricing === idx ? 'Hide Details' : 'What\'s Included'}
              </button>
              {expandedPricing === idx && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-2.5">
                  {plan.details.map((detail, i) => (
                    <div key={i} className="text-sm sm:text-base text-gray-400 flex items-start leading-relaxed">
                      <span className="text-blue-500 mr-2 font-bold flex-shrink-0 mt-0.5">•</span>
                      <span className="flex-1">{detail}</span>
                    </div>
                  ))}
                </div>
              )}
              <a
                href="https://calendly.com/purplexmythzz/30min"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 block text-center ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-2 border-gray-600'
                }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
        <div className="text-center max-w-3xl mx-auto px-4">
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
            <span className="font-semibold text-gray-300">Note:</span> Prices depend on project complexity. Schedule a call so we can give you a personalized quote tailored to your specific needs.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-800`}>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent" style={{ letterSpacing: '-0.02em' }}>
            Frequently Asked Questions
          </h2>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 mx-auto rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {[
            {
              question: "How long does a website take?",
              answer: "Timeline depends on project complexity. A starter website typically takes 2 weeks, business websites 3-4 weeks, and custom webapps 6-8 weeks. We'll provide a detailed timeline during our discovery call."
            },
            {
              question: "What tech stack do you use?",
              answer: "We use modern, industry-leading technologies including React, Next.js, TypeScript, Node.js, and Tailwind CSS. We choose the best stack for each project based on requirements, performance needs, and scalability."
            },
            {
              question: "Do you offer revisions?",
              answer: "Yes! Starter websites include 1 round of revisions, business websites include 3 rounds, and custom webapps include unlimited revisions during the development phase. We want to ensure you're completely satisfied."
            },
            {
              question: "Can you host and maintain the site?",
              answer: "Absolutely. We can set up hosting, configure domains, and provide ongoing maintenance and support. We offer maintenance packages to keep your site updated, secure, and running smoothly."
            },
            {
              question: "Do you work with small businesses?",
              answer: "Yes! We work with businesses of all sizes, from startups to established companies. Our pricing is transparent and we offer flexible payment options. Every business deserves a professional online presence."
            },
            {
              question: "What if I need changes after launch?",
              answer: "We offer ongoing support and maintenance packages. You can request changes, updates, or new features anytime. We're here to help your website grow with your business."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-gray-900 border-2 border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                className="w-full px-6 sm:px-8 py-4 sm:py-5 text-left flex items-center justify-between group"
              >
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-100 pr-4">{faq.question}</h3>
                <svg 
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 transform transition-transform duration-300 ${expandedFAQ === idx ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFAQ === idx && (
                <div className="px-6 sm:px-8 pb-4 sm:pb-5">
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-800`}>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent" style={{ letterSpacing: '-0.02em' }}>
            Get In Touch
          </h2>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-900 border-2 border-gray-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl">
            <form 
              action="https://formspree.io/f/meovalvq" 
              method="POST"
              className="space-y-6"
            >
              <div>
                <label className="block text-sm text-gray-300 mb-3 font-medium">Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-gray-100 text-base sm:text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-3 font-medium">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-gray-100 text-base sm:text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-3 font-medium">Project Type</label>
                <select 
                  name="project_type"
                  className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-gray-100 text-base sm:text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                >
                  <option value="Website">Website</option>
                  <option value="Webapp">Webapp</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-3 font-medium">Message</label>
                <textarea 
                  name="message"
                  rows="5"
                  required
                  className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-gray-100 text-base sm:text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none min-h-[120px]"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Protected by reCAPTCHA</span>
              </div>
              <button 
                type="submit"
                className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-bold text-base sm:text-lg text-white hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.02] min-h-[56px] flex items-center justify-center"
              >
                Send Message
              </button>
              <p className="text-xs text-gray-500 text-center">
                We respond within 24 hours
              </p>
            </form>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-2 border-blue-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
              <span className="text-3xl sm:text-4xl">📅</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-100">Schedule a Call</h3>
            <p className="text-gray-400 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              Book a free consultation to discuss your project and explore how we can help bring your vision to life.
            </p>
            <a
              href="https://calendly.com/purplexmythzz/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 sm:px-8 md:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-white hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 inline-block mb-6"
            >
              Open Calendly
            </a>
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-6 border-t border-blue-500/20 w-full justify-center">
              <a 
                href="https://www.linkedin.com/in/evelio-gonzalez-77a3b5329/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-blue-500/20 flex items-center justify-center transition-all group"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/azuldevsmiami/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-blue-500/20 flex items-center justify-center transition-all group"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Brand */}
            <div>
              <img 
                src="/azul-logo.png" 
                alt="Azul" 
                className="h-16 sm:h-20 md:h-24 w-auto object-contain mb-4"
              />
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Modern websites, built right.
              </p>
              <p className="text-gray-500 text-xs italic">
                Premium web development studio
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-gray-300 font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">About</a></li>
                <li><a href="#portfolio" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Portfolio</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Pricing</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Contact</a></li>
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="text-gray-300 font-bold mb-4 text-sm uppercase tracking-wider">Services</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-400 text-sm">Websites</span></li>
                <li><span className="text-gray-400 text-sm">Webapps</span></li>
                <li><span className="text-gray-400 text-sm">UI/UX Design</span></li>
                <li><span className="text-gray-400 text-sm">SEO & Performance</span></li>
                <li><span className="text-gray-400 text-sm">Maintenance</span></li>
              </ul>
            </div>
            
            {/* Social & Contact */}
            <div>
              <h4 className="text-gray-300 font-bold mb-4 text-sm uppercase tracking-wider">Connect</h4>
              <div className="flex gap-3 mb-4">
                <a 
                  href="https://www.linkedin.com/in/evelio-gonzalez-77a3b5329/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-500/20 flex items-center justify-center transition-all group"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/azuldevsmiami/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-500/20 flex items-center justify-center transition-all group"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
              <a 
                href="https://calendly.com/purplexmythzz/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 text-sm transition-colors block"
              >
                Book a Consultation
              </a>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-400">
              © {new Date().getFullYear()} Azul Web Studio. All rights reserved.
            </p>
            <p className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              Built by <span className="text-blue-500 font-semibold">Azul</span> with <span className="text-blue-500 font-semibold">React</span> + <span className="text-blue-500 font-semibold">Tailwind CSS</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
