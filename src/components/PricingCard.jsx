export default function PricingCard({
  icon,
  title,
  price,
  priceSuffix = '/mo',
  priceNote,
  badge,
  badgeTone = 'blue',
  features = [],
  ctaLabel = 'Get Started',
  ctaHref = '#contact',
  comingSoon = false,
}) {
  const badgeTones = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    gray: 'bg-gray-100 text-gray-500',
  }

  return (
    <div
      className={`relative flex flex-col h-full bg-white border rounded-2xl p-7 transition-all duration-200 ${
        comingSoon
          ? 'border-gray-200/70 opacity-70'
          : 'border-gray-200/70 hover:border-gray-300 hover:-translate-y-0.5'
      }`}
    >
      <div className="w-11 h-11 rounded-lg bg-blue-500 flex items-center justify-center mb-6">
        {icon}
      </div>

      <div className="mb-1">
        {comingSoon ? (
          <div className="text-[11px] font-semibold tracking-[0.16em] text-gray-400 uppercase mb-1">Coming Soon</div>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-[2.25rem] font-semibold tracking-tight text-gray-900" style={{ letterSpacing: '-0.03em' }}>{price}</span>
              <span className="text-sm text-gray-500 font-medium">{priceSuffix}</span>
            </div>
            {priceNote && <div className="text-xs text-gray-500 mt-1">{priceNote}</div>}
          </>
        )}
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-gray-900 mb-3 mt-3">{title}</h3>

      {badge && (
        <div
          className={`inline-flex self-start items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium mb-5 ${badgeTones[badgeTone] || badgeTones.blue}`}
        >
          {badge}
        </div>
      )}

      <ul className="space-y-2.5 mb-7 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 leading-snug">
            <svg
              className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {comingSoon ? (
        <button
          disabled
          className="w-full py-2.5 rounded-lg font-semibold text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          {ctaLabel}
        </button>
      ) : (
        <a
          href={ctaHref}
          target={ctaHref?.startsWith('http') ? '_blank' : undefined}
          rel={ctaHref?.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="w-full py-2.5 rounded-lg font-semibold text-sm text-center transition-colors duration-200 bg-gray-900 text-white hover:bg-black block"
        >
          {ctaLabel}
        </a>
      )}
    </div>
  )
}
