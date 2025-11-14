export default function PortfolioCard({ project, onClick }) {
  // Create CSS-based preview for projects without background images
  const renderPreviewBackground = () => {
    if (project.backgroundImage) {
      return (
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={project.backgroundImage} 
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              transform: 'translate(calc(var(--mouse-x, 0) * 0.5), calc(var(--mouse-y, 0) * 0.5)) scale(1.15)',
              willChange: 'transform',
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
    
    if (project.industry === 'ecommerce') {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
          {/* Product preview mockup with parallax */}
          <div 
            className="absolute inset-0 flex items-center justify-center opacity-30 transition-transform duration-700"
            style={{
              transform: 'translate(calc(var(--mouse-x, 0) * 0.3), calc(var(--mouse-y, 0) * 0.3))',
            }}
          >
            <div className="grid grid-cols-3 gap-3 p-8 w-full h-full">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-3 border border-gray-200 transform hover:scale-105 transition-transform">
                  <div className="h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-2"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-2/3"></div>
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
      className="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
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

      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      
      {/* Content */}
      <div className="relative h-full p-8 flex flex-col justify-between z-10">
        {/* Top Section */}
        <div>
          <div className="text-xs text-white/60 uppercase tracking-wider mb-2">
            {project.industry.replace(/([A-Z])/g, ' $1').trim()}
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            {project.title}
          </h3>
          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-sm">
            {project.tagline}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-white/20 group-hover:bg-white/40 transition-colors"></div>
            <span className="text-white/60 text-sm group-hover:text-white transition-colors">
              View Project
            </span>
            <div className="h-px flex-1 bg-white/20 group-hover:bg-white/40 transition-colors"></div>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/80 group-hover:text-white transition-colors">
            <span className="text-sm font-medium">Explore</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} blur-2xl opacity-30`}></div>
      </div>
    </div>
  )
}
