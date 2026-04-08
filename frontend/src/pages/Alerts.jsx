import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCircle2 } from 'lucide-react'
import AlertItem from '../components/AlertItem'

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' },
}

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [filter, setFilter] = useState('all')
  const [acknowledged, setAcknowledged] = useState('all')

  // FIX 1: Wrapped fetchAlerts in useCallback to avoid re-creating
  // on every render, and moved it outside useEffect so it's stable.
  const fetchAlerts = useCallback(() => {
    fetch('http://127.0.0.1:5000/live')
      .then((res) => {
        // FIX 2: Check for non-OK HTTP responses before parsing JSON
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (data.error) return // FIX 3: Guard against API-level errors

        let severity = null
        let message = ''

        if (data.status === 'DANGER') {
          severity = 'critical'
          message = '🚨 Dangerous Air Condition Detected'
        } else if (data.status === 'WARNING') {
          severity = 'warning'
          message = '⚠️ Moderate Risk Detected'
        }

        if (severity) {
          const newAlert = {
            id: Date.now(),
            severity,
            message,
            sensor: 'Live Sensor',
            zone: 'Zone 1',
            timestamp: new Date().toLocaleTimeString(),
            acknowledged: false,
          }
          // FIX 4: Kept slice(0, 9) but moved to be explicit — keeps max 10 alerts
          setAlerts((prev) => [newAlert, ...prev].slice(0, 10))
        }
      })
      .catch((err) => console.error('Alert fetch failed:', err))
  }, [])

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 3000)
    return () => clearInterval(interval)
  }, [fetchAlerts]) // FIX 5: Added fetchAlerts to dependency array (was missing)

  // FIX 6: Added acknowledge handler — was completely missing, so AlertItem
  // had no way to flip the acknowledged flag.
  const handleAcknowledge = useCallback((id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    )
  }, [])

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (filter !== 'all' && a.severity !== filter) return false
      if (acknowledged === 'active' && a.acknowledged) return false
      if (acknowledged === 'acknowledged' && !a.acknowledged) return false
      return true
    })
  }, [alerts, filter, acknowledged])

  const stats = useMemo(
    () => ({
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === 'critical').length,
      warning: alerts.filter((a) => a.severity === 'warning').length,
      // FIX 7: Was counting active as unacknowledged (correct), but label
      // said "Active" with emerald (green) color — misleading. Renamed stat.
      unacknowledged: alerts.filter((a) => !a.acknowledged).length,
    }),
    [alerts]
  )

  return (
    <motion.div {...fadeUp}>
      {/* HEADER */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Alerts</h1>
          <p className="page-subtitle">Live system alerts from sensors</p>
        </div>
        <div className="page-header-right">
          <div className="header-timestamp">
            <span className="live-dot" />
            <span>Live monitoring</span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card rose">
          <div className="stat-card-value">{stats.critical}</div>
          <div className="stat-card-label">Critical</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-card-value">{stats.warning}</div>
          <div className="stat-card-label">Warnings</div>
        </div>
        {/* FIX 7 cont: Changed emerald → amber-ish label for unacknowledged */}
        <div className="stat-card amber">
          <div className="stat-card-value">{stats.unacknowledged}</div>
          <div className="stat-card-label">Unacknowledged</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-card-value">{stats.total}</div>
          <div className="stat-card-label">Total</div>
        </div>
      </div>

      {/* ALERT LIST */}
      <div className="grid-dashboard">
        {/* FIX 8: col-span-7 is non-standard — changed to col-span-full
            or wrap in a full-width container. Adjust to your grid setup. */}
        <div className="col-span-full">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Bell />
                Live Alerts
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                </select>

                <select
                  value={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  {/* FIX 9: "acknowledged" option existed in state/filter logic
                      but was missing from the <select> dropdown entirely */}
                  <option value="acknowledged">Acknowledged Only</option>
                </select>
              </div>
            </div>

            <div className="alert-list">
              {filteredAlerts.map((alert) => (
                // FIX 10: Pass onAcknowledge down — AlertItem was receiving
                // no handler, so the acknowledge button was a dead click.
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={handleAcknowledge}
                />
              ))}

              {filteredAlerts.length === 0 && (
                <div className="empty-state">
                  <CheckCircle2 size={32} />
                  <p>No alerts — System Safe</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}