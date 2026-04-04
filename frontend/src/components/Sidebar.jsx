import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Bell,
  Cpu,
  BarChart3,
  Activity,
  Zap,
} from 'lucide-react'
import { alerts } from '../data/mockData'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/alerts', label: 'Alerts', icon: Bell, badge: alerts.filter(a => !a.acknowledged).length },
  { path: '/sensors', label: 'Sensors', icon: Cpu },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Zap />
        </div>
        <div className="sidebar-brand">
          <span className="sidebar-brand-name">EnviroSense</span>
          <span className="sidebar-brand-sub">Monitoring</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Overview</span>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase()}`}
            >
              <Icon />
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="nav-item-badge">{item.badge}</span>
              )}
            </NavLink>
          )
        })}

        <span className="nav-section-label" style={{ marginTop: '16px' }}>System</span>
        <div className="nav-item" id="nav-system-health">
          <Activity />
          <span>System Health</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="status-dot"></span>
          <span>All systems operational</span>
        </div>
      </div>
    </aside>
  )
}
