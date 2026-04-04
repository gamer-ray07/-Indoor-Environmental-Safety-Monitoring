import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Bell, Filter, AlertTriangle, Info, AlertCircle, CheckCircle2 } from 'lucide-react'
import AlertItem from '../components/AlertItem'
import ComparisonBarChart from '../components/charts/ComparisonBarChart'
import { alerts, alertHistory } from '../data/mockData'

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' },
}

export default function Alerts() {
  const [filter, setFilter] = useState('all')
  const [acknowledged, setAcknowledged] = useState('all')

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (filter !== 'all' && a.severity !== filter) return false
      if (acknowledged === 'active' && a.acknowledged) return false
      if (acknowledged === 'acknowledged' && !a.acknowledged) return false
      return true
    })
  }, [filter, acknowledged])

  const stats = useMemo(() => ({
    total: alerts.length,
    critical: alerts.filter((a) => a.severity === 'critical').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    info: alerts.filter((a) => a.severity === 'info').length,
    active: alerts.filter((a) => !a.acknowledged).length,
  }), [])

  return (
    <motion.div {...fadeUp}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Alerts</h1>
          <p className="page-subtitle">Active alerts, warnings, and system notifications</p>
        </div>
        <div className="page-header-right">
          <div className="header-timestamp">
            <span className="live-dot"></span>
            <span>Live monitoring</span>
          </div>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card rose">
          <div className="stat-card-top">
            <div className="stat-card-icon rose">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="stat-card-value">{stats.critical}</div>
          <div className="stat-card-label">Critical Alerts</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-card-top">
            <div className="stat-card-icon amber">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="stat-card-value">{stats.warning}</div>
          <div className="stat-card-label">Warnings</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-card-top">
            <div className="stat-card-icon cyan">
              <Info size={18} />
            </div>
          </div>
          <div className="stat-card-value">{stats.info}</div>
          <div className="stat-card-label">Information</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-card-top">
            <div className="stat-card-icon emerald">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="stat-card-value">{stats.active}</div>
          <div className="stat-card-label">Unacknowledged</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid-dashboard">
        {/* Alert List */}
        <div className="col-span-7">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Bell />
                All Alerts
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  className="filter-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  id="alert-severity-filter"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
                <select
                  className="filter-select"
                  value={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.value)}
                  id="alert-status-filter"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="acknowledged">Acknowledged</option>
                </select>
              </div>
            </div>

            <div className="alert-list">
              {filteredAlerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
              {filteredAlerts.length === 0 && (
                <div className="empty-state" style={{ padding: 'var(--space-3xl)' }}>
                  <CheckCircle2 size={32} style={{ color: 'var(--accent-emerald)' }} />
                  <p>No alerts matching your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alert History + Details */}
        <div className="col-span-5">
          <div className="chart-card" style={{ marginBottom: 'var(--space-xl)' }}>
            <div className="chart-card-header">
              <div className="chart-card-title">
                <Filter />
                Alert History
              </div>
              <span className="card-badge">7 Days</span>
            </div>
            <ComparisonBarChart
              data={alertHistory}
              xKey="day"
              bars={[
                { dataKey: 'critical', color: '#fb7185', name: 'Critical' },
                { dataKey: 'warning', color: '#fbbf24', name: 'Warning' },
                { dataKey: 'info', color: '#38bdf8', name: 'Info' },
              ]}
              height={240}
            />
          </div>

          {/* Alert timeline */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <AlertTriangle />
                Sensor-Triggered Warnings
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {alerts.filter(a => a.severity !== 'info').slice(0, 5).map((alert) => (
                <div key={alert.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                }}>
                  <div className={`alert-severity ${alert.severity}`} style={{ marginTop: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {alert.sensor}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                    }}>
                      {alert.zone} · {alert.timestamp}
                    </div>
                  </div>
                  <span className={`alert-severity-label ${alert.severity}`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
