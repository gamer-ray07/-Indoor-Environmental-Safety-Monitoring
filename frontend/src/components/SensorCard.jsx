import { memo } from 'react'
import { Battery, Clock } from 'lucide-react'

const SensorCard = memo(function SensorCard({ sensor, onClick }) {
  return (
    <div className="sensor-card" id={`sensor-${sensor.id}`} onClick={() => onClick?.(sensor)}>
      <div className="sensor-card-header">
        <div>
          <div className="sensor-card-name">{sensor.name}</div>
          <div className="sensor-card-id">{sensor.id}</div>
        </div>
        <div className={`sensor-health ${sensor.status}`}>
          <div className="sensor-health-dot" />
          {sensor.status}
        </div>
      </div>

      <div className="sensor-reading">
        <span className="sensor-reading-value" style={{ color: sensor.color }}>
          {sensor.value}
        </span>
        <span className="sensor-reading-unit">{sensor.unit}</span>
        <div className="sensor-reading-label">{sensor.type} · {sensor.zone}</div>
      </div>

      <div className="sensor-meta">
        <div className="sensor-meta-item">
          <span className="sensor-meta-label">Min</span>
          <span className="sensor-meta-value">{sensor.min}</span>
        </div>
        <div className="sensor-meta-item">
          <span className="sensor-meta-label">Max</span>
          <span className="sensor-meta-value">{sensor.max}</span>
        </div>
        <div className="sensor-meta-item">
          <span className="sensor-meta-label">Avg</span>
          <span className="sensor-meta-value">{sensor.avg}</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '12px',
        fontSize: '0.6875rem',
        color: '#475569',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Battery size={12} />
          {sensor.battery}%
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} />
          {sensor.lastUpdate}
        </span>
      </div>
    </div>
  )
})

export default SensorCard
