import { memo } from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const AnomalyScatterPlot = memo(function AnomalyScatterPlot({ data, height = 260 }) {
  const normal = data.filter((d) => !d.isAnomaly)
  const anomalies = data.filter((d) => d.isAnomaly)

  return (
    <div className="chart-container" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.5)" />
          <XAxis
            dataKey="temperature"
            name="Temperature"
            unit="°C"
            tick={{ fill: '#475569', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
            label={{ value: 'Temperature (°C)', position: 'bottom', offset: -5, fill: '#475569', fontSize: 11 }}
          />
          <YAxis
            dataKey="humidity"
            name="Humidity"
            unit="%"
            tick={{ fill: '#475569', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft', offset: 15, fill: '#475569', fontSize: 11 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload
              return (
                <div className="custom-tooltip">
                  <div className="label">
                    {d.isAnomaly ? '⚠ Anomaly Detected' : 'Normal Reading'}
                  </div>
                  <div className="value">Temp: {d.temperature}°C</div>
                  <div className="value">Humidity: {d.humidity}%</div>
                </div>
              )
            }}
          />
          <Scatter name="Normal" data={normal}>
            {normal.map((_, i) => (
              <Cell key={i} fill="rgba(56, 189, 248, 0.5)" r={4} />
            ))}
          </Scatter>
          <Scatter name="Anomaly" data={anomalies}>
            {anomalies.map((_, i) => (
              <Cell key={i} fill="rgba(251, 113, 133, 0.8)" r={6} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
})

export default AnomalyScatterPlot
