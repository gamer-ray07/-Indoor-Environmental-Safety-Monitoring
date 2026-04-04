import { memo } from 'react'
import { Shield, ShieldAlert, CheckCircle, XCircle } from 'lucide-react'

const SystemStatus = memo(function SystemStatus({ systemStatus }) {
  const isSafe = systemStatus.status === 'safe'

  return (
    <div className={`system-status ${isSafe ? 'safe' : 'unsafe'}`} id="system-status">
      <div className={`status-ring ${isSafe ? 'safe' : 'unsafe'}`}>
        <div className={`status-ring-inner ${isSafe ? 'safe' : 'unsafe'}`}>
          {isSafe ? <Shield /> : <ShieldAlert />}
        </div>
      </div>

      <div className={`status-label ${isSafe ? 'safe' : 'unsafe'}`}>
        {isSafe ? 'SAFE' : 'UNSAFE'}
      </div>

      <div className="status-detail">
        System score: {systemStatus.score}/100
      </div>

      <div style={{
        display: 'flex',
        gap: '16px',
        marginTop: '4px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.6875rem',
          color: '#64748b',
        }}>
          <CheckCircle size={12} style={{ color: '#34d399' }} />
          {systemStatus.activeSensors} Active
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.6875rem',
          color: '#64748b',
        }}>
          <XCircle size={12} style={{ color: '#fb7185' }} />
          {systemStatus.totalSensors - systemStatus.activeSensors} Offline
        </div>
      </div>

      <div style={{
        fontSize: '0.6875rem',
        color: '#475569',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        Uptime: {systemStatus.uptime}
      </div>
    </div>
  )
})

export default SystemStatus
