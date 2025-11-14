import { useEffect, useState } from 'react'
import { shadows } from '../constants/designSystem'
import LiveSitePreview from './LiveSitePreview'

export default function ProjectModal({ project, isOpen, onClose }) {
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showDemo) {
          setShowDemo(false)
        } else {
          onClose()
        }
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
  }, [isOpen, onClose, showDemo])

  if (!isOpen || !project) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={`bg-gradient-to-br from-gray-900 via-gray-900 to-black w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-800/50 ${shadows.card} transform transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className={`relative h-64 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full border border-white/20 hover:bg-black/70 transition-all group"
          >
            <span className="text-white text-2xl group-hover:rotate-90 transition-transform">×</span>
          </button>

          {/* Header content */}
          <div className="relative z-10 h-full flex flex-col justify-end p-8">
            <div className="text-6xl mb-4">{project.icon}</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{project.title}</h2>
            <p className="text-xl text-white/90">{project.tagline}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {/* Description */}
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">{project.description}</p>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {project.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-gray-200 hover:border-blue-500/50 hover:text-blue-400 transition-all"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Metrics */}
          {project.metrics && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/30 text-center"
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-2">
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-400 font-medium mb-1">{metric.label}</div>
                    <div className="text-xs text-gray-500">{metric.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-800/50">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDemo(true)
              }}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
            >
              View Full Demo →
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 border-2 border-gray-700 rounded-xl font-semibold text-gray-300 hover:border-gray-600 hover:text-white transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Live Site Preview */}
      <LiveSitePreview 
        project={project}
        isOpen={showDemo}
        onClose={() => setShowDemo(false)}
      />
    </div>
  )
}

