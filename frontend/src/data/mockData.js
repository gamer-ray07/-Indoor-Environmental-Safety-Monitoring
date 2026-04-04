// ═══════════════════════════════════════════════════════════════
// Mock Data Layer — structured for easy API replacement
// ═══════════════════════════════════════════════════════════════

// ── Time Series Generators ────────────────────────────────────
const hours24 = Array.from({ length: 24 }, (_, i) => {
  const h = i.toString().padStart(2, '0')
  return `${h}:00`
})

const days7 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const days30 = Array.from({ length: 30 }, (_, i) => `Mar ${i + 1}`)

function generateTimeSeries(points, baseFn, noise = 5) {
  return points.map((label, i) => ({
    time: label,
    value: Math.round(baseFn(i, points.length) + (Math.random() - 0.5) * noise * 2),
  }))
}

// ── Dashboard Stats ───────────────────────────────────────────
export const dashboardStats = [
  {
    id: 'aqi',
    label: 'Air Quality Index',
    value: 42,
    unit: 'AQI',
    change: -8,
    color: 'cyan',
    icon: 'Wind',
  },
  {
    id: 'temperature',
    label: 'Temperature',
    value: 23.5,
    unit: '°C',
    change: 1.2,
    color: 'amber',
    icon: 'Thermometer',
  },
  {
    id: 'humidity',
    label: 'Humidity',
    value: 67,
    unit: '%',
    change: -3,
    color: 'blue',
    icon: 'Droplets',
  },
  {
    id: 'gas',
    label: 'Gas Level',
    value: 18,
    unit: 'ppm',
    change: 2,
    color: 'violet',
    icon: 'Flame',
  },
]

// ── System Status ─────────────────────────────────────────────
export const systemStatus = {
  status: 'safe', // 'safe' | 'unsafe'
  score: 87,
  lastCheck: '2 seconds ago',
  activeSensors: 12,
  totalSensors: 14,
  uptime: '99.7%',
}

// ── Alerts ────────────────────────────────────────────────────
export const alerts = [
  {
    id: 'a1',
    severity: 'critical',
    message: 'CO₂ levels exceeded 1200 ppm threshold in Zone B',
    sensor: 'GAS-007',
    zone: 'Zone B',
    timestamp: '2 min ago',
    fullTimestamp: '2026-04-02T18:30:00',
    acknowledged: false,
  },
  {
    id: 'a2',
    severity: 'warning',
    message: 'Temperature rising above 35°C in Server Room',
    sensor: 'TEMP-003',
    zone: 'Server Room',
    timestamp: '8 min ago',
    fullTimestamp: '2026-04-02T18:24:00',
    acknowledged: false,
  },
  {
    id: 'a3',
    severity: 'warning',
    message: 'Humidity sensor HUM-005 showing intermittent readings',
    sensor: 'HUM-005',
    zone: 'Lab 2',
    timestamp: '15 min ago',
    fullTimestamp: '2026-04-02T18:17:00',
    acknowledged: true,
  },
  {
    id: 'a4',
    severity: 'info',
    message: 'Scheduled maintenance window approaching for Zone A sensors',
    sensor: 'SYSTEM',
    zone: 'Zone A',
    timestamp: '32 min ago',
    fullTimestamp: '2026-04-02T18:00:00',
    acknowledged: true,
  },
  {
    id: 'a5',
    severity: 'critical',
    message: 'AQI reading spike detected — particulate matter PM2.5 above safe limit',
    sensor: 'AQI-002',
    zone: 'Zone C',
    timestamp: '1 hr ago',
    fullTimestamp: '2026-04-02T17:32:00',
    acknowledged: false,
  },
  {
    id: 'a6',
    severity: 'warning',
    message: 'Gas sensor calibration overdue by 48 hours',
    sensor: 'GAS-004',
    zone: 'Lab 1',
    timestamp: '2 hr ago',
    fullTimestamp: '2026-04-02T16:30:00',
    acknowledged: true,
  },
  {
    id: 'a7',
    severity: 'info',
    message: 'New firmware v3.2.1 available for temperature sensors',
    sensor: 'SYSTEM',
    zone: 'All',
    timestamp: '5 hr ago',
    fullTimestamp: '2026-04-02T13:00:00',
    acknowledged: true,
  },
  {
    id: 'a8',
    severity: 'critical',
    message: 'Methane levels above safe threshold in Storage Area',
    sensor: 'GAS-012',
    zone: 'Storage',
    timestamp: '6 hr ago',
    fullTimestamp: '2026-04-02T12:30:00',
    acknowledged: true,
  },
]

// ── Sensors ───────────────────────────────────────────────────
export const sensors = [
  {
    id: 'TEMP-001',
    name: 'Temperature Sensor A1',
    type: 'Temperature',
    zone: 'Zone A',
    status: 'online',
    value: 23.5,
    unit: '°C',
    min: 18.2,
    max: 28.7,
    avg: 22.8,
    battery: 92,
    lastUpdate: '3s ago',
    firmware: 'v3.1.4',
    color: '#fbbf24',
  },
  {
    id: 'TEMP-002',
    name: 'Temperature Sensor A2',
    type: 'Temperature',
    zone: 'Zone A',
    status: 'online',
    value: 22.1,
    unit: '°C',
    min: 17.5,
    max: 26.3,
    avg: 21.4,
    battery: 87,
    lastUpdate: '5s ago',
    firmware: 'v3.1.4',
    color: '#fbbf24',
  },
  {
    id: 'TEMP-003',
    name: 'Server Room Temp',
    type: 'Temperature',
    zone: 'Server Room',
    status: 'degraded',
    value: 35.2,
    unit: '°C',
    min: 22.0,
    max: 36.1,
    avg: 28.5,
    battery: 45,
    lastUpdate: '12s ago',
    firmware: 'v3.0.9',
    color: '#fb923c',
  },
  {
    id: 'HUM-001',
    name: 'Humidity Sensor A1',
    type: 'Humidity',
    zone: 'Zone A',
    status: 'online',
    value: 67,
    unit: '%',
    min: 42,
    max: 78,
    avg: 61,
    battery: 95,
    lastUpdate: '2s ago',
    firmware: 'v2.8.1',
    color: '#60a5fa',
  },
  {
    id: 'HUM-005',
    name: 'Humidity Sensor Lab 2',
    type: 'Humidity',
    zone: 'Lab 2',
    status: 'degraded',
    value: 54,
    unit: '%',
    min: 38,
    max: 72,
    avg: 55,
    battery: 23,
    lastUpdate: '45s ago',
    firmware: 'v2.7.3',
    color: '#60a5fa',
  },
  {
    id: 'GAS-004',
    name: 'Gas Sensor Lab 1',
    type: 'Gas',
    zone: 'Lab 1',
    status: 'online',
    value: 18,
    unit: 'ppm',
    min: 5,
    max: 42,
    avg: 15,
    battery: 78,
    lastUpdate: '4s ago',
    firmware: 'v4.0.2',
    color: '#a78bfa',
  },
  {
    id: 'GAS-007',
    name: 'CO₂ Sensor Zone B',
    type: 'Gas',
    zone: 'Zone B',
    status: 'online',
    value: 1245,
    unit: 'ppm',
    min: 400,
    max: 1300,
    avg: 680,
    battery: 81,
    lastUpdate: '3s ago',
    firmware: 'v4.0.2',
    color: '#a78bfa',
  },
  {
    id: 'GAS-012',
    name: 'Methane Detector Storage',
    type: 'Gas',
    zone: 'Storage',
    status: 'offline',
    value: 0,
    unit: 'ppm',
    min: 0,
    max: 85,
    avg: 12,
    battery: 0,
    lastUpdate: '6h ago',
    firmware: 'v3.9.1',
    color: '#fb7185',
  },
  {
    id: 'AQI-001',
    name: 'Air Quality Zone A',
    type: 'AQI',
    zone: 'Zone A',
    status: 'online',
    value: 42,
    unit: 'AQI',
    min: 28,
    max: 67,
    avg: 45,
    battery: 88,
    lastUpdate: '6s ago',
    firmware: 'v5.1.0',
    color: '#38bdf8',
  },
  {
    id: 'AQI-002',
    name: 'Air Quality Zone C',
    type: 'AQI',
    zone: 'Zone C',
    status: 'online',
    value: 89,
    unit: 'AQI',
    min: 35,
    max: 112,
    avg: 62,
    battery: 73,
    lastUpdate: '8s ago',
    firmware: 'v5.1.0',
    color: '#38bdf8',
  },
  {
    id: 'AQI-003',
    name: 'PM2.5 Monitor Lab 1',
    type: 'AQI',
    zone: 'Lab 1',
    status: 'online',
    value: 31,
    unit: 'µg/m³',
    min: 12,
    max: 48,
    avg: 27,
    battery: 90,
    lastUpdate: '4s ago',
    firmware: 'v5.0.8',
    color: '#2dd4bf',
  },
  {
    id: 'TEMP-010',
    name: 'Outdoor Temperature',
    type: 'Temperature',
    zone: 'Outdoor',
    status: 'online',
    value: 28.3,
    unit: '°C',
    min: 19.2,
    max: 33.5,
    avg: 25.8,
    battery: 98,
    lastUpdate: '10s ago',
    firmware: 'v3.2.0',
    color: '#fbbf24',
  },
]

// ── Chart Data ────────────────────────────────────────────────

// Line chart: 24h temperature trend
export const temperatureTrend = hours24.map((time, i) => ({
  time,
  indoor: Math.round((22 + 3 * Math.sin((i / 24) * Math.PI * 2 - 1.5) + (Math.random() - 0.5) * 1.5) * 10) / 10,
  outdoor: Math.round((18 + 8 * Math.sin((i / 24) * Math.PI * 2 - 1) + (Math.random() - 0.5) * 2) * 10) / 10,
}))

// Line chart: AQI trend
export const aqiTrend = hours24.map((time, i) => ({
  time,
  aqi: Math.round(40 + 15 * Math.sin((i / 24) * Math.PI * 2) + (Math.random() - 0.5) * 12),
  pm25: Math.round(25 + 10 * Math.sin((i / 24) * Math.PI * 2 + 0.5) + (Math.random() - 0.5) * 8),
}))

// Bar chart: zone comparison
export const zoneComparison = [
  { zone: 'Zone A', temperature: 23, humidity: 67, aqi: 42, gas: 15 },
  { zone: 'Zone B', temperature: 25, humidity: 58, aqi: 55, gas: 32 },
  { zone: 'Zone C', temperature: 21, humidity: 72, aqi: 89, gas: 12 },
  { zone: 'Lab 1', temperature: 22, humidity: 45, aqi: 31, gas: 18 },
  { zone: 'Lab 2', temperature: 24, humidity: 54, aqi: 48, gas: 22 },
  { zone: 'Storage', temperature: 27, humidity: 65, aqi: 62, gas: 45 },
]

// Scatter plot: anomaly detection
export const anomalyData = Array.from({ length: 60 }, (_, i) => {
  const isAnomaly = Math.random() < 0.12
  return {
    temperature: Math.round((20 + Math.random() * 8 + (isAnomaly ? 8 : 0)) * 10) / 10,
    humidity: Math.round((45 + Math.random() * 30 + (isAnomaly ? -15 : 0)) * 10) / 10,
    isAnomaly,
    id: `point-${i}`,
  }
})

// Heatmap data: 7 days x 24 hours intensity
export const heatmapData = days7.flatMap((day, di) =>
  hours24.map((hour, hi) => ({
    day,
    hour,
    dayIndex: di,
    hourIndex: hi,
    value: Math.round(
      30 +
      20 * Math.sin((hi / 24) * Math.PI * 2 - 1.5) +
      10 * Math.sin((di / 7) * Math.PI) +
      (Math.random() - 0.5) * 15
    ),
  }))
)

// Analytics: 30-day trends
export const monthlyTrend = days30.map((day, i) => ({
  day,
  avgTemp: Math.round((22 + 2 * Math.sin((i / 30) * Math.PI * 2) + (Math.random() - 0.5) * 1.5) * 10) / 10,
  avgHumidity: Math.round(60 + 8 * Math.sin((i / 30) * Math.PI * 2 + 1) + (Math.random() - 0.5) * 5),
  avgAqi: Math.round(45 + 12 * Math.sin((i / 30) * Math.PI * 2 + 0.5) + (Math.random() - 0.5) * 8),
  avgGas: Math.round(18 + 6 * Math.sin((i / 30) * Math.PI * 2 - 0.3) + (Math.random() - 0.5) * 4),
}))

// Comparison data for analytics
export const sensorComparison = [
  { metric: 'Temperature', current: 23.5, average: 22.8, peak: 28.7, status: 'normal' },
  { metric: 'Humidity', current: 67, average: 61, peak: 78, status: 'normal' },
  { metric: 'AQI', current: 42, average: 45, peak: 67, status: 'good' },
  { metric: 'Gas (CO₂)', current: 680, average: 520, peak: 1245, status: 'warning' },
  { metric: 'PM2.5', current: 31, average: 27, peak: 48, status: 'normal' },
  { metric: 'Gas (CH₄)', current: 12, average: 10, peak: 85, status: 'critical' },
]

// Gauge data
export const gaugeData = {
  aqi: { value: 42, max: 300, label: 'Air Quality Index', status: 'Good' },
  gas: { value: 18, max: 100, label: 'Gas Safety Level', status: 'Safe' },
}

// Alert history for analytics
export const alertHistory = days7.map((day) => ({
  day,
  critical: Math.floor(Math.random() * 3),
  warning: Math.floor(Math.random() * 5 + 1),
  info: Math.floor(Math.random() * 8 + 2),
}))

// Sensor uptime data
export const sensorUptime = sensors.map((s) => ({
  id: s.id,
  name: s.name,
  uptime: s.status === 'offline' ? 0 : s.status === 'degraded' ? 85 + Math.random() * 10 : 95 + Math.random() * 5,
}))

// Pattern analysis
export const patterns = [
  {
    id: 'p1',
    title: 'Temperature Correlation',
    description: 'Indoor temperature follows outdoor trends with a 2-hour delay and 60% amplitude reduction.',
    confidence: 94,
    type: 'correlation',
  },
  {
    id: 'p2',
    title: 'Humidity Spike Pattern',
    description: 'Humidity spikes detected between 06:00–08:00 consistently across weekdays, likely due to HVAC cycles.',
    confidence: 87,
    type: 'recurring',
  },
  {
    id: 'p3',
    title: 'CO₂ Level Anomaly',
    description: 'Zone B CO₂ levels have trended 40% higher than baseline over the past 72 hours.',
    confidence: 91,
    type: 'anomaly',
  },
  {
    id: 'p4',
    title: 'Weekend AQI Improvement',
    description: 'Air quality consistently improves by 25-30% on weekends across all monitored zones.',
    confidence: 96,
    type: 'trend',
  },
]
