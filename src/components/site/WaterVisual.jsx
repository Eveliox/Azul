/** One continuous contour field; every line passes behind the phone's peak. */
export function WaterVisual() {
  return <svg className="abstract-water" viewBox="0 0 1600 500" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
    {Array.from({ length: 38 }, (_, index) => {
      const t = index / 37
      return <path key={index}
        d={`M -80 ${330 + t * 120} C 230 ${380 + t * 100}, 390 ${70 + t * 160}, 740 ${65 + t * 175} S 1140 ${390 + t * 70}, 1680 ${250 + t * 130}`}
        stroke="#6F86E8" strokeOpacity={.2 + Math.sin(t * Math.PI) * .15} strokeWidth="1" vectorEffect="non-scaling-stroke" />
    })}
  </svg>
}
