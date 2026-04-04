import { useMemo } from 'react'

export default function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="value" style={{ color: entry.color }}>
          {entry.name}: {formatter ? formatter(entry.value) : entry.value}
        </div>
      ))}
    </div>
  )
}
