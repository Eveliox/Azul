export default function PortfolioCard({ project, onClick }) {
  // Create CSS-based preview for projects without background images
  const renderPreviewBackground = () => {
    if (project.backgroundImage) {
      return (
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={project.backgroundImage} 
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            style={{
              transform: 'translate(calc(var(--mouse-x, 0) * 0.5), calc(var(--mouse-y, 0) * 0.5)) scale(1.1)',
              willChange: 'transform',
            }}
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none'
            }}
          />
          {/* Subtle continuous animation overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 animate-pulse"
            style={{ animationDuration: '4s' }}
          ></div>
        </div>
      )
    }
    
    // CSS-based previews for real estate and e-commerce with parallax
    if (project.industry === 'realEstate') {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50 overflow-hidden">
          {/* House preview mockup with parallax */}
          <div 
            className="absolute inset-0 flex items-center justify-center opacity-30 transition-transform duration-700"
            style={{
              transform: 'translate(calc(var(--mouse-x, 0) * 0.3), calc(var(--mouse-y, 0) * 0.3))',
            }}
          >
            <div className="grid grid-cols-2 gap-4 p-8 w-full h-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 transform hover:scale-105 transition-transform">
                  <div className="h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    
    
    // Fallback to gradient
    return (
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-500`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="group relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 w-full"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty('--mouse-x', '0px')
        e.currentTarget.style.setProperty('--mouse-y', '0px')
      }}
    >
      {/* Background Image/Preview with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        {renderPreviewBackground()}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30"></div>
      </div>

      {/* Glass overlay effect with glassmorphism on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-all duration-500"></div>
      <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-[2px] transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
      
      {/* Content */}
      <div className="relative h-full p-4 sm:p-6 md:p-8 flex flex-col justify-between z-10">
        {/* Top Section */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-xs text-white/60 uppercase tracking-wider">
              {project.industry.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-xs text-white/70 font-medium px-2 py-0.5 bg-white/10 rounded-full backdrop-blur-sm">
              {project.industry === 'restaurant' ? 'Restaurant' : 
               project.industry === 'fitness' ? 'Fitness' : 
               project.industry === 'realEstate' ? 'Real Estate' :
               project.industry === 'construction' ? 'Construction' :
               project.industry.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 leading-tight">
            {project.title}
          </h3>
          <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed max-w-sm mb-2 font-medium">
            {project.shortDescription || project.tagline}
          </p>
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.tagline}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <div className="h-px flex-1 bg-white/20 group-hover:bg-white/40 transition-colors"></div>
            <span className="text-white/60 text-xs sm:text-sm group-hover:text-white transition-colors">
              View Project
            </span>
            <div className="h-px flex-1 bg-white/20 group-hover:bg-white/40 transition-colors"></div>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/80 group-hover:text-white transition-colors">
            <span className="text-xs sm:text-sm font-medium">Explore</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.industry === 'construction' ? 'from-blue-500 via-blue-600 to-blue-700' : project.gradient} blur-2xl opacity-30`}></div>
      </div>
    </div>
  )
}
