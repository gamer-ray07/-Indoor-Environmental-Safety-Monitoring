import { memo, useMemo } from 'react'

const Heatmap = memo(function Heatmap({ data, rows = 7, cols = 24 }) {
  const { cells, maxVal } = useMemo(() => {
    const maxVal = Math.max(...data.map((d) => d.value))
    return { cells: data, maxVal }
  }, [data])

  const getColor = (value) => {
    const intensity = value / maxVal
    if (intensity < 0.2) return 'rgba(56, 189, 248, 0.08)'
    if (intensity < 0.4) return 'rgba(56, 189, 248, 0.2)'
    if (intensity < 0.6) return 'rgba(56, 189, 248, 0.4)'
    if (intensity < 0.8) return 'rgba(56, 189, 248, 0.65)'
    return 'rgba(56, 189, 248, 0.9)'
  }

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingTop: '0px' }}>
          {dayLabels.map((d) => (
            <div
              key={d}
              style={{
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '10px',
                color: '#475569',
                fontFamily: "'JetBrains Mono', monospace",
                paddingRight: '4px',
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div
          className="heatmap-grid"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, flex: 1 }}
        >
          {cells.map((cell, i) => (
            <div
              key={i}
              className="heatmap-cell"
              style={{
                backgroundColor: getColor(cell.value),
                height: '16px',
              }}
              title={`${cell.day} ${cell.hour}: ${cell.value}`}
            />
          ))}
        </div>
      </div>
      <div className="heatmap-labels" style={{ marginLeft: '36px' }}>
        <span className="heatmap-label">00:00</span>
        <span className="heatmap-label">06:00</span>
        <span className="heatmap-label">12:00</span>
        <span className="heatmap-label">18:00</span>
        <span className="heatmap-label">23:00</span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '12px',
          justifyContent: 'flex-end',
        }}
      >
        <span style={{ fontSize: '10px', color: '#475569', fontFamily: "'JetBrains Mono', monospace" }}>Low</span>
        {[0.08, 0.2, 0.4, 0.65, 0.9].map((opacity, i) => (
          <div
            key={i}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '2px',
              backgroundColor: `rgba(56, 189, 248, ${opacity})`,
            }}
          />
        ))}
        <span style={{ fontSize: '10px', color: '#475569', fontFamily: "'JetBrains Mono', monospace" }}>High</span>
      </div>
    </div>
  )
})

export default Heatmap
