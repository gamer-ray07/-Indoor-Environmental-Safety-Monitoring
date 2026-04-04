import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Search, X, Battery, Wifi, Clock, Wrench, Activity } from 'lucide-react'
import SensorCard from '../components/SensorCard'
import TrendLineChart from '../components/charts/TrendLineChart'
import { sensors, temperatureTrend } from '../data/mockData'

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' },
}

// Generate mock sensor-specific data
function generateSensorHistory(sensor) {
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
  return hours.map((time) => ({
    time,
    value: Math.round((sensor.avg + (Math.random() - 0.5) * (sensor.max - sensor.min) * 0.6) * 10) / 10,
  }))
}

export default function Sensors() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedSensor, setSelectedSensor] = useState(null)

  const filteredSensors = useMemo(() => {
    return sensors.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'all' && s.type !== typeFilter) return false
      if (statusFilter !== 'all' && s.status !== statusFilter) return false
      return true
    })
  }, [search, typeFilter, statusFilter])

  const sensorTypes = useMemo(() => [...new Set(sensors.map((s) => s.type))], [])

  const sensorHistory = useMemo(() => {
    if (!selectedSensor) return []
    return generateSensorHistory(selectedSensor)
  }, [selectedSensor])

  const handleSelectSensor = useCallback((sensor) => {
    setSelectedSensor(sensor)
  }, [])

  const handleCloseSensor = useCallback(() => {
    setSelectedSensor(null)
  }, [])

  const stats = useMemo(() => ({
    total: sensors.length,
    online: sensors.filter(s => s.status === 'online').length,
    degraded: sensors.filter(s => s.status === 'degraded').length,
    offline: sensors.filter(s => s.status === 'offline').length,
  }), [])

  return (
    <motion.div {...fadeUp}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Sensors</h1>
          <p className="page-subtitle">
            {stats.online} online · {stats.degraded} degraded · {stats.offline} offline
          </p>
        </div>
        <div className="page-header-right">
          <div className="header-timestamp">
            <span className="live-dot"></span>
            <span>{stats.total} sensors registered</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search sensors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '30px' }}
            id="sensor-search"
          />
        </div>
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          id="sensor-type-filter"
        >
          <option value="all">All Types</option>
          {sensorTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          id="sensor-status-filter"
        >
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="degraded">Degraded</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', gap: 'var(--space-xl)' }}>
        {/* Sensor Grid */}
        <div style={{ flex: 1 }}>
          <div className="grid-3">
            {filteredSensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                onClick={handleSelectSensor}
              />
            ))}
          </div>
          {filteredSensors.length === 0 && (
            <div className="empty-state">
              <Cpu size={48} />
              <p>No sensors match your filters</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedSensor && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              style={{ width: '380px', flexShrink: 0 }}
            >
              <div className="detail-panel">
                <div className="detail-panel-header">
                  <div>
                    <div className="detail-panel-title">{selectedSensor.name}</div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-muted)',
                      fontFamily: "'JetBrains Mono', monospace",
                      marginTop: '4px',
                    }}>
                      {selectedSensor.id}
                    </div>
                  </div>
                  <button className="close-btn" onClick={handleCloseSensor} id="close-sensor-detail">
                    <X size={18} />
                  </button>
                </div>

                {/* Big Reading */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: selectedSensor.color,
                    letterSpacing: '-0.03em',
                  }}>
                    {selectedSensor.value}
                    <span style={{
                      fontSize: '1rem',
                      color: 'var(--text-tertiary)',
                      fontWeight: 400,
                      marginLeft: '4px',
                    }}>
                      {selectedSensor.unit}
                    </span>
                  </div>
                  <div className={`sensor-health ${selectedSensor.status}`} style={{ justifyContent: 'center', marginTop: '8px' }}>
                    <div className="sensor-health-dot" />
                    {selectedSensor.status.charAt(0).toUpperCase() + selectedSensor.status.slice(1)}
                  </div>
                </div>

                {/* Stats */}
                <div className="detail-stats">
                  <div className="detail-stat">
                    <div className="detail-stat-value">{selectedSensor.min}</div>
                    <div className="detail-stat-label">Min</div>
                  </div>
                  <div className="detail-stat">
                    <div className="detail-stat-value">{selectedSensor.avg}</div>
                    <div className="detail-stat-label">Avg</div>
                  </div>
                  <div className="detail-stat">
                    <div className="detail-stat-value">{selectedSensor.max}</div>
                    <div className="detail-stat-label">Max</div>
                  </div>
                </div>

                {/* Mini Chart */}
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-md)',
                  }}>
                    24h History
                  </div>
                  <TrendLineChart
                    data={sensorHistory}
                    lines={[{ dataKey: 'value', color: selectedSensor.color, name: selectedSensor.type }]}
                    height={140}
                    showGrid={false}
                  />
                </div>

                {/* Info Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {[
                    { icon: Cpu, label: 'Type', value: selectedSensor.type },
                    { icon: Wifi, label: 'Zone', value: selectedSensor.zone },
                    { icon: Battery, label: 'Battery', value: `${selectedSensor.battery}%` },
                    { icon: Clock, label: 'Last Update', value: selectedSensor.lastUpdate },
                    { icon: Wrench, label: 'Firmware', value: selectedSensor.firmware },
                  ].map((item) => (
                    <div key={item.label} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-sm) 0',
                      borderBottom: '1px solid var(--border-primary)',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-tertiary)',
                      }}>
                        <item.icon size={14} />
                        {item.label}
                      </div>
                      <div style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
