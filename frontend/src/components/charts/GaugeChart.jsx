import { memo, useMemo } from 'react'

const GaugeChart = memo(function GaugeChart({
  value,
  max,
  label,
  status,
  size = 160,
  strokeWidth = 12,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = Math.PI * radius // semicircle
  const progress = Math.min(value / max, 1)
  const offset = circumference * (1 - progress)

  const color = useMemo(() => {
    if (progress <= 0.33) return '#34d399'
    if (progress <= 0.66) return '#fbbf24'
    return '#fb7185'
  }, [progress])

  return (
    <div className="gauge-container">
      <svg
        width={size}
        height={size / 2 + 20}
        viewBox={`0 0 ${size} ${size / 2 + 20}`}
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2 + 10}`}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2 + 10}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
        />
        {/* Value text */}
        <text
          x={size / 2}
          y={size / 2 - 2}
          textAnchor="middle"
          fill="#e2e8f0"
          fontSize="24"
          fontWeight="700"
          fontFamily="'JetBrains Mono', monospace"
        >
          {value}
        </text>
        {/* Max label */}
        <text
          x={size / 2}
          y={size / 2 + 16}
          textAnchor="middle"
          fill="#64748b"
          fontSize="11"
          fontFamily="'JetBrains Mono', monospace"
        >
          / {max}
        </text>
      </svg>
      <div className="gauge-label" style={{ color, marginTop: '-4px' }}>
        {status}
      </div>
      <div className="gauge-label">{label}</div>
    </div>
  )
})

export default GaugeChart
