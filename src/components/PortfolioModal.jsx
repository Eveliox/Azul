import { useEffect, useState } from 'react'
import LiveSitePreview from './LiveSitePreview'

export default function PortfolioModal({ project, isOpen, onClose }) {
  const [showLiveSite, setShowLiveSite] = useState(false)
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-0 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-b from-gray-900 to-black w-full max-w-6xl min-h-screen md:min-h-0 md:rounded-2xl border border-gray-800/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Section */}
        <div className={`relative w-full h-80 md:h-96 bg-gradient-to-br ${project.heroGradient || 'from-gray-800 to-gray-900'} overflow-hidden`}>
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 group"
            aria-label="Close"
          >
            <span className="text-gray-400 text-2xl group-hover:text-white transition-colors">×</span>
          </button>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
            <div className="mb-6">
              <span className="text-7xl md:text-8xl">{project.icon}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light">
              {project.tagline || project.description}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
          {/* One-Sentence Description */}
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <p className="text-lg text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Key Features Section */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center md:text-left">
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {project.features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-miami-cyan to-miami-purple flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors leading-relaxed">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack Section */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center md:text-left">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {project.techStack.map((tech, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-lg text-sm text-gray-200 font-medium hover:border-miami-cyan/50 hover:text-miami-cyan transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Results Section */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center md:text-left">
              Results
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {project.metrics?.map((metric, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 text-center hover:border-miami-cyan/30 transition-all duration-300"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-miami-cyan to-miami-pink bg-clip-text text-transparent mb-2">
                    {metric.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 font-medium mb-1">
                    {metric.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {metric.description}
                  </div>
                </div>
              ))}
            </div>
            {project.results && (
              <div className="mt-8 p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-gray-700/30">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {project.results}
                </p>
              </div>
            )}
          </section>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 border-t border-gray-800/50">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowLiveSite(true)
              }}
              className="px-8 py-3 bg-gradient-to-r from-miami-cyan to-miami-purple rounded-lg font-semibold text-sm text-white hover:shadow-lg hover:shadow-miami-cyan/30 transition-all duration-300 transform hover:scale-105"
            >
              View Live Site →
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-3 border border-gray-700 rounded-lg font-medium text-sm text-gray-300 hover:border-gray-600 hover:text-white transition-all duration-300"
            >
              Close Case Study
            </button>
          </div>
        </div>
      </div>

      {/* Live Site Preview */}
      <LiveSitePreview 
        project={project}
        isOpen={showLiveSite}
        onClose={() => setShowLiveSite(false)}
      />
    </div>
  )
}
