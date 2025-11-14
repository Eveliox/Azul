import { useState } from 'react'
import ServiceCard from './components/ServiceCard'
import PortfolioCard from './components/PortfolioCard'
import ProjectModal from './components/ProjectModal'
import WhyCard from './components/WhyCard'
import PricingCard from './components/PricingCard'
import { portfolioProjects } from './data/portfolioProjects'
import { spacing, shadows } from './constants/designSystem'

function App() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      {/* Header with Logo */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-sm">
        <div className="container mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
          <a href="#" className="flex items-center group">
            <div className="text-2xl md:text-3xl font-bold text-blue-500 group-hover:text-blue-400 transition-colors duration-300">
              Azul.
            </div>
          </a>
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
        </div>
      </header>

      {/* Hero Section */}
      <section className={`relative ${spacing.section} ${spacing.container} overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`}>
        {/* Floating gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm text-blue-400 font-medium mb-4">
                  Premium Web Development Studio
                </div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight">
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
                <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl font-light">
                  We craft stunning, high-performance websites and web applications that drive results. From elegant landing pages to powerful SaaS platforms.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl font-bold text-base text-white hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
                  <span className="relative z-10">Book a Free Consultation</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <a 
                  href="#portfolio" 
                  className="px-10 py-5 border-2 border-gray-700 rounded-2xl font-bold text-base hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 text-center flex items-center justify-center group text-gray-300"
                >
                  <span>View Portfolio</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
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
      <section id="about" className={`${spacing.section} ${spacing.container} bg-gray-900`}>
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            About Azul
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            We're a premium web development studio dedicated to creating beautiful, high-performance digital experiences that drive real results for businesses across all industries.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 mx-auto rounded-full"></div>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
          <div className="bg-gray-800 border-2 border-gray-700 rounded-3xl p-10 shadow-xl">
            <h3 className="text-3xl font-bold mb-4 text-gray-100">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              To empower businesses with stunning, high-performance websites and web applications that not only look incredible but drive measurable growth and success.
            </p>
          </div>
          <div className="bg-gray-800 border-2 border-gray-700 rounded-3xl p-10 shadow-xl">
            <h3 className="text-3xl font-bold mb-4 text-gray-100">Our Values</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              Quality, innovation, and client success are at the heart of everything we do. We believe in building long-term partnerships and delivering solutions that exceed expectations.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Meet the Team
          </h3>
          <p className="text-lg text-gray-400">The talented developers behind Azul</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Evelio Gonzalez */}
          <div className="bg-gray-800 border-2 border-gray-700 rounded-3xl p-8 shadow-xl hover:border-blue-500/50 transition-all duration-300 group">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img 
                  src="/evelio.jpg" 
                  alt="Evelio Gonzalez" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 group-hover:border-blue-500 transition-all duration-300 shadow-xl"
                />
              </div>
              <h4 className="text-2xl font-bold mb-2 text-gray-100">Evelio Gonzalez</h4>
              <p className="text-blue-400 mb-4 font-medium">Co-Founder & Lead Developer</p>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Full-stack developer passionate about creating elegant solutions and exceptional user experiences.
              </p>
              <a 
                href="https://www.linkedin.com/in/evelio-gonzalez-77a3b5329/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* David Cabrera */}
          <div className="bg-gray-800 border-2 border-gray-700 rounded-3xl p-8 shadow-xl hover:border-blue-500/50 transition-all duration-300 group">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img 
                  src="/david.jpg" 
                  alt="David Cabrera" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 group-hover:border-blue-500 transition-all duration-300 shadow-xl"
                />
              </div>
              <h4 className="text-2xl font-bold mb-2 text-gray-100">David Cabrera</h4>
              <p className="text-blue-400 mb-4 font-medium">Co-Founder & Lead Developer</p>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Experienced developer specializing in modern web technologies and scalable application architecture.
              </p>
              <a 
                href="https://www.linkedin.com/in/davidacabrerawrestling/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-3xl p-12 shadow-2xl">
            <h3 className="text-4xl font-bold mb-8 text-center text-gray-100">What Sets Us Apart</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h4 className="text-xl font-bold mb-3 text-gray-100">Fast Turnaround</h4>
                <p className="text-gray-400 leading-relaxed">
                  We deliver projects quickly without compromising on quality or attention to detail.
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold mb-3 text-gray-100">Premium Design</h4>
                <p className="text-gray-400 leading-relaxed">
                  Every project is crafted with meticulous attention to design, user experience, and brand identity.
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold mb-3 text-gray-100">Modern Technology</h4>
                <p className="text-gray-400 leading-relaxed">
                  Built with the latest frameworks and best practices for optimal performance and scalability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className={`${spacing.section} ${spacing.container} bg-gray-900`}>
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            What We Do
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
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
      <section id="portfolio" className={`${spacing.section} ${spacing.container} relative bg-gray-800`}>
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Built for Every Industry
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
            Explore our portfolio of stunning websites across diverse industries
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
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

      {/* Why Choose Us */}
      <section className={`${spacing.section} ${spacing.container} bg-gray-900`}>
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Why Choose Us
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <WhyCard 
            title="Fast Delivery"
            description="Get your project launched quickly without compromising quality."
          />
          <WhyCard 
            title="Clean, Modern Stack"
            description="Built with the latest technologies for performance and scalability."
          />
          <WhyCard 
            title="Built to Grow"
            description="Your site will scale with your business as it expands."
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`${spacing.section} ${spacing.container} bg-gray-800`}>
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Pricing
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard 
            title="Starter Website"
            price="$100-200"
            features={[
              "Up to 5 pages",
              "Mobile responsive design",
              "Basic SEO setup",
              "Contact form"
            ]}
          />
          <PricingCard 
            title="Business Website"
            price="$350-500"
            highlighted={true}
            features={[
              "Up to 10 pages",
              "Custom design & branding",
              "Advanced SEO optimization",
              "CMS integration",
              "Analytics setup"
            ]}
          />
          <PricingCard 
            title="Custom Webapp"
            price="$1,200-2,000"
            features={[
              "Full-stack application",
              "User authentication",
              "Database integration",
              "API development",
              "Ongoing maintenance"
            ]}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`${spacing.section} ${spacing.container} bg-gray-900`}>
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800 border-2 border-gray-700 rounded-3xl p-10 shadow-xl">
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
                  className="w-full px-5 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-gray-100 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-3 font-medium">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full px-5 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-gray-100 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-3 font-medium">Project Type</label>
                <select 
                  name="project_type"
                  className="w-full px-5 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-gray-100 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                  className="w-full px-5 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-gray-100 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-bold text-base text-white hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-2 border-blue-500/30 rounded-3xl p-10 shadow-xl flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-100">Schedule a Call</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Book a free consultation to discuss your project and explore how we can help bring your vision to life.
            </p>
            <a
              href="https://calendly.com/purplexmythzz/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-bold text-base text-white hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Open Calendly
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} azul. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Built with <span className="text-blue-500 font-semibold">React</span> + <span className="text-blue-500 font-semibold">Tailwind CSS</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
