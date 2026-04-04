import { memo } from 'react'
import {
  Wind,
  Thermometer,
  Droplets,
  Flame,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

const iconMap = {
  Wind,
  Thermometer,
  Droplets,
  Flame,
}

const StatCard = memo(function StatCard({ stat }) {
  const Icon = iconMap[stat.icon] || Wind
  const isUp = stat.change > 0

  return (
    <div className={`stat-card ${stat.color}`}>
      <div className="stat-card-top">
        <div className={`stat-card-icon ${stat.color}`}>
          <Icon />
        </div>
        <div className={`stat-card-change ${isUp ? 'up' : 'down'}`}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(stat.change)}{stat.unit === '%' || stat.unit === '°C' ? stat.unit : ''}
        </div>
      </div>
      <div className="stat-card-value">
        {stat.value}
        <span style={{ fontSize: '0.65em', color: '#64748b', fontWeight: 400, marginLeft: '4px' }}>
          {stat.unit}
        </span>
      </div>
      <div className="stat-card-label">{stat.label}</div>
    </div>
  )
})

export default StatCard
