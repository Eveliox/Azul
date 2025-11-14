export default function PricingCard({ title, price, features, highlighted = false }) {
  return (
    <div className={`bg-gray-800 rounded-xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
      highlighted 
        ? 'border-blue-500 shadow-xl shadow-blue-500/30 scale-105' 
        : 'border-gray-700 hover:border-blue-500/50'
    }`}>
      <h3 className="text-xl font-semibold text-gray-100 mb-2">{title}</h3>
      <div className="text-3xl font-bold text-blue-500 mb-6">{price}</div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-gray-400 flex items-start">
            <span className="text-blue-500 mr-3 font-bold">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
        highlighted
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30'
          : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-2 border-gray-600'
      }`}>
        Get Started
      </button>
    </div>
  )
}

