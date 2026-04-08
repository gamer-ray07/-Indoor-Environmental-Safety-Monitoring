import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
const [liveData, setLiveData] = useState(null);
const [history, setHistory] = useState([]);
const [lastAlert, setLastAlert] = useState(0);
const [notification, setNotification] = useState("");

useEffect(() => {
const fetchData = () => {
fetch("http://127.0.0.1:5000/live")
.then(res => res.json())
.then(data => {
if (!data.error) {
setLiveData(data);

```
        // Store last 20 readings
        setHistory(prev => {
          const updated = [...prev, data];
          return updated.slice(-20);
        });

        // 🔊 SOUND + 📱 NOTIFICATION
        if (data.status === "DANGER") {
          const now = Date.now();

          if (now - lastAlert > 5000) {
            const audio = new Audio(
              "https://www.soundjay.com/buttons/sounds/beep-01a.mp3"
            );
            audio.play();

            setNotification("🚨 Emergency Alert Sent to Admin");
            setLastAlert(now);
          }
        } else if (data.status === "WARNING") {
          setNotification("📩 Warning Notification Sent");
        } else {
          setNotification("");
        }
      }
    })
    .catch(err => console.error(err));
};

fetchData();
const interval = setInterval(fetchData, 2000);

return () => clearInterval(interval);
```

}, [lastAlert]);

const labels = history.map((_, i) => `T${i}`);

// 🔌 AUTO ACTION SYSTEM
const getActionMessage = () => {
if (!liveData) return "";

```
if (liveData.status === "DANGER") {
  return "🚨 Emergency: Ventilation System Activated";
}

if (liveData.status === "WARNING") {
  return "⚠️ Monitoring Increased - Standby Mode";
}

return "✅ System Stable";
```

};

return (
<div style={{
padding: "20px",
color: "white",
backgroundColor:
liveData?.status === "DANGER" ? "#3b0000" : "black"
}}> <h1>Live Air Quality Dashboard</h1>

```
  {/* STATUS */}
  <h2>
    Air Quality:{" "}
    {!liveData
      ? "Loading..."
      : liveData.status === "DANGER"
      ? "🚨 DANGER"
      : liveData.status === "WARNING"
      ? "⚠️ WARNING"
      : "✅ SAFE"}
  </h2>

  {/* ALERT MESSAGE */}
  <h3 style={{
    color:
      liveData?.status === "DANGER"
        ? "red"
        : liveData?.status === "WARNING"
        ? "orange"
        : "green",
    fontWeight: "bold"
  }}>
    {!liveData
      ? ""
      : liveData.status === "DANGER"
      ? "🚨 Dangerous Condition Detected"
      : liveData.status === "WARNING"
      ? "⚠️ Moderate Risk Detected"
      : "✅ Environment Safe"}
  </h3>

  {/* 🔌 AUTO ACTION MESSAGE */}
  <h3 style={{
    marginTop: "10px",
    color:
      liveData?.status === "DANGER"
        ? "red"
        : liveData?.status === "WARNING"
        ? "orange"
        : "lightgreen",
    fontWeight: "bold"
  }}>
    {getActionMessage()}
  </h3>

  {/* 📱 NOTIFICATION */}
  {notification && (
    <h3 style={{
      marginTop: "10px",
      color: "cyan",
      fontWeight: "bold"
    }}>
      {notification}
    </h3>
  )}

  {/* SENSOR VALUES */}
  {liveData && (
    <div style={{ marginBottom: "20px" }}>
      <p>Gas: {liveData.gas}</p>
      <p>Dust: {liveData.dust}</p>
      <p>Temperature: {liveData.temp} °C</p>
      <p>Humidity: {liveData.humidity} %</p>

      <p style={{ fontWeight: "bold" }}>
        Risk Score: {liveData.risk_score || 50}%
      </p>
    </div>
  )}

  {/* GRAPH 1 */}
  <h3>Gas & Dust</h3>
  <Line
    key={history.length}
    data={{
      labels,
      datasets: [
        {
          label: "Gas",
          data: history.map(d => d.gas),
          borderWidth: 2,
          tension: 0.4
        },
        {
          label: "Dust",
          data: history.map(d => d.dust),
          borderWidth: 2,
          tension: 0.4
        }
      ]
    }}
  />

  {/* GRAPH 2 */}
  <h3>Temperature</h3>
  <Line
    key={history.length + 1}
    data={{
      labels,
      datasets: [
        {
          label: "Temperature",
          data: history.map(d => d.temp),
          borderWidth: 2,
          tension: 0.4
        }
      ]
    }}
  />

  {/* GRAPH 3 */}
  <h3>Humidity</h3>
  <Line
    key={history.length + 2}
    data={{
      labels,
      datasets: [
        {
          label: "Humidity",
          data: history.map(d => d.humidity),
          borderWidth: 2,
          tension: 0.4
        }
      ]
    }}
  />
</div>
```

);
}
