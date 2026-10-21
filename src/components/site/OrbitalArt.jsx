/** Fine orbital paths inspired by Azul's cobalt / lavender visual language. */
export function OrbitalArt() {
  return <svg className="orbital-art" viewBox="0 0 600 500" fill="none" aria-hidden="true" focusable="false">
    <g stroke="currentColor" strokeWidth=".8">
      {[48, 94, 122, 138].map(radius => <g key={radius}>
        <ellipse cx={300 - radius} cy="250" rx={radius} ry="180" />
        <ellipse cx={300 + radius} cy="250" rx={radius} ry="180" />
      </g>)}
      <path d="M40 35H560M40 465H560" opacity=".35" />
    </g>
    <g fill="currentColor">
      <path d="m300 22 2 11 11 2-11 2-2 11-2-11-11-2 11-2Z" />
      <path d="m300 452 2 11 11 2-11 2-2 11-2-11-11-2 11-2Z" />
    </g>
  </svg>
}
