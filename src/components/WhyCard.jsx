export default function WhyCard({ title, description }) {
  return (
    <div className="bg-gray-800 rounded-xl p-8 border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
      <h3 className="text-xl font-semibold text-gray-100 mb-3">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

