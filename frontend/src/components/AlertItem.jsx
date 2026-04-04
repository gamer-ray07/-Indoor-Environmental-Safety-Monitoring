import { memo } from 'react'

const AlertItem = memo(function AlertItem({ alert, compact = false }) {
  return (
    <div className="alert-item" id={`alert-${alert.id}`}>
      <div className={`alert-severity ${alert.severity}`} />
      <div className="alert-content">
        <div className="alert-message">{alert.message}</div>
        <div className="alert-meta">
          <span className={`alert-severity-label ${alert.severity}`}>
            {alert.severity}
          </span>
          <span className="alert-sensor-tag">{alert.sensor}</span>
          {!compact && <span className="alert-sensor-tag">· {alert.zone}</span>}
          <span className="alert-time">{alert.timestamp}</span>
        </div>
      </div>
    </div>
  )
})

export default AlertItem
