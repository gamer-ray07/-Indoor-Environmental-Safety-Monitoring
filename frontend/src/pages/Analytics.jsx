import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Lightbulb,
  GitCompare,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Activity,
  Grid3X3,
} from 'lucide-react'
import TrendLineChart from '../components/charts/TrendLineChart'
import ComparisonBarChart from '../components/charts/ComparisonBarChart'
import AnomalyScatterPlot from '../components/charts/AnomalyScatterPlot'
import Heatmap from '../components/charts/Heatmap'
import {
  monthlyTrend,
  sensorComparison,
  anomalyData,
  heatmapData,
  patterns,
  sensorUptime,
  zoneComparison,
} from '../data/mockData'

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' },
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d')

  const patternIcons = {
    correlation: GitCompare,
    recurring: Activity,
    anomaly: Lightbulb,
    trend: TrendingUp,
  }

  const patternColors = {
    correlation: { bg: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)' },
    recurring: { bg: 'var(--accent-violet-dim)', color: 'var(--accent-violet)' },
    anomaly: { bg: 'var(--accent-rose-dim)', color: 'var(--accent-rose)' },
    trend: { bg: 'var(--accent-emerald-dim)', color: 'var(--accent-emerald)' },
  }

  return (
    <motion.div {...fadeUp}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Historical trends, pattern analysis, and deeper insights</p>
        </div>
        <div className="page-header-right">
          <div className="tab-group">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                className={`tab-item ${timeRange === range ? 'active' : ''}`}
                onClick={() => setTimeRange(range)}
                id={`range-${range}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Trends */}
      <div className="grid-dashboard" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="col-span-8">
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="chart-card-title">
                <TrendingUp />
                Historical Trends
              </div>
              <span className="card-badge">{timeRange}</span>
            </div>
            <TrendLineChart
              data={monthlyTrend}
              lines={[
                { dataKey: 'avgTemp', color: '#fbbf24', name: 'Avg Temp (°C)' },
                { dataKey: 'avgHumidity', color: '#60a5fa', name: 'Avg Humidity (%)' },
                { dataKey: 'avgAqi', color: '#38bdf8', name: 'Avg AQI' },
                { dataKey: 'avgGas', color: '#a78bfa', name: 'Avg Gas (ppm)' },
              ]}
              height={320}
              showLegend
            />
          </div>
        </div>

        {/* Comparison Table */}
        <div className="col-span-4">
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
              <div className="card-title">
                <GitCompare />
                Metric Comparison
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Current</th>
                  <th>Avg</th>
                  <th>Peak</th>
                </tr>
              </thead>
              <tbody>
                {sensorComparison.map((row) => (
                  <tr key={row.metric}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.metric}</td>
                    <td>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{row.current}</span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-tertiary)' }}>
                        {row.average}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{row.peak}</span>
                      {row.status === 'warning' && (
                        <ArrowUpRight size={12} style={{ color: 'var(--accent-amber)', marginLeft: '4px' }} />
                      )}
                      {row.status === 'critical' && (
                        <ArrowUpRight size={12} style={{ color: 'var(--accent-rose)', marginLeft: '4px' }} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pattern Analysis + Additional Charts */}
      <div className="grid-dashboard" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Pattern Analysis */}
        <div className="col-span-4">
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
              <div className="card-title">
                <Lightbulb />
                Pattern Analysis
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {patterns.map((pattern) => {
                const Icon = patternIcons[pattern.type]
                const colors = patternColors[pattern.type]
                return (
                  <div key={pattern.id} className="analytics-insight">
                    <div
                      className="analytics-insight-icon"
                      style={{ background: colors.bg, color: colors.color }}
                    >
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="analytics-insight-text">
                        <strong>{pattern.title}</strong>
                      </div>
                      <div style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-tertiary)',
                        marginTop: '4px',
                        lineHeight: 1.4,
                      }}>
                        {pattern.description}
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${pattern.confidence}%`,
                              background: colors.color,
                            }}
                          />
                        </div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-muted)',
                          marginTop: '4px',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          {pattern.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Scatter Plot */}
        <div className="col-span-4">
          <div className="chart-card" style={{ height: '100%' }}>
            <div className="chart-card-header">
              <div className="chart-card-title">
                <Activity />
                Correlation Analysis
              </div>
            </div>
            <AnomalyScatterPlot data={anomalyData} height={340} />
            <div className="chart-legend" style={{ marginTop: '8px' }}>
              <div className="chart-legend-item">
                <div className="chart-legend-dot" style={{ background: 'rgba(56,189,248,0.5)' }} />
                Normal
              </div>
              <div className="chart-legend-item">
                <div className="chart-legend-dot" style={{ background: 'rgba(251,113,133,0.8)' }} />
                Anomaly
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="col-span-4">
          <div className="chart-card" style={{ height: '100%' }}>
            <div className="chart-card-header">
              <div className="chart-card-title">
                <Grid3X3 />
                Sensor Activity Heatmap
              </div>
            </div>
            <Heatmap data={heatmapData} />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid-dashboard">
        {/* Zone Comparison */}
        <div className="col-span-6">
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="chart-card-title">
                <BarChart3 />
                Zone Comparison
              </div>
            </div>
            <ComparisonBarChart
              data={zoneComparison}
              bars={[
                { dataKey: 'temperature', color: '#fbbf24', name: 'Temperature' },
                { dataKey: 'humidity', color: '#60a5fa', name: 'Humidity' },
                { dataKey: 'aqi', color: '#38bdf8', name: 'AQI' },
                { dataKey: 'gas', color: '#a78bfa', name: 'Gas' },
              ]}
              height={280}
            />
          </div>
        </div>

        {/* Sensor Uptime */}
        <div className="col-span-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Activity />
                Sensor Uptime
              </div>
              <span className="card-badge">Last 30 days</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {sensorUptime.map((sensor) => {
                const uptime = Math.round(sensor.uptime * 10) / 10
                const color = uptime > 98 ? 'var(--accent-emerald)' : uptime > 90 ? 'var(--accent-amber)' : 'var(--accent-rose)'
                return (
                  <div key={sensor.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                  }}>
                    <div style={{
                      width: '100px',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                      fontFamily: "'JetBrains Mono', monospace",
                      flexShrink: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {sensor.id}
                    </div>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${uptime}%`,
                          background: color,
                        }}
                      />
                    </div>
                    <div style={{
                      width: '50px',
                      textAlign: 'right',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      fontFamily: "'JetBrains Mono', monospace",
                      color,
                      flexShrink: 0,
                    }}>
                      {uptime}%
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
