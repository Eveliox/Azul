export default function ServiceCard({ title, description }) {
  return (
    <div className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
      <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

