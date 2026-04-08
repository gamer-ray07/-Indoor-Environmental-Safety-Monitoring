import { useState, useEffect, useRef, useCallback } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [liveData, setLiveData] = useState(null);
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState("");

  // FIX 1: Use a ref for lastAlert instead of state.
  // Refs don't trigger re-renders or effect restarts — perfect for timers.
  const lastAlertRef = useRef(0);

  // FIX 2: Wrap fetchData in useCallback so it's stable across renders.
  const fetchData = useCallback(() => {
    fetch("http://127.0.0.1:5000/live")
      .then((res) => {
        // FIX 3: Guard against non-OK HTTP responses before parsing JSON
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) return; // FIX 4: Early return on API-level error

        setLiveData(data);
        setHistory((prev) => [...prev, data].slice(-20));

        if (data.status === "DANGER") {
          const now = Date.now();
          if (now - lastAlertRef.current > 5000) {
            // FIX 5: audio.play() returns a Promise — must handle rejection
            // or browser throws an uncaught error (especially on mobile)
            const audio = new Audio(
              "https://www.soundjay.com/buttons/sounds/beep-01a.mp3"
            );
            audio.play().catch((err) => console.warn("Audio blocked:", err));

            setNotification("🚨 Emergency Alert Sent to Admin");
            lastAlertRef.current = now; // FIX 6: Update ref, not state
          }
        } else if (data.status === "WARNING") {
          setNotification("📩 Warning Notification Sent");
        } else {
          setNotification("");
        }
      })
      .catch((err) => console.error("Fetch failed:", err));
  }, []); // FIX 7: Empty deps — fetchData never needs to be recreated

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [fetchData]); // FIX 8: Stable dep — interval never accidentally resets now

  const labels = history.map((_, i) => `T${i}`);

  const getActionMessage = () => {
    if (!liveData) return "";
    if (liveData.status === "DANGER") return "🚨 Emergency: Ventilation System Activated";
    if (liveData.status === "WARNING") return "⚠️ Monitoring Increased - Standby Mode";
    return "✅ System Stable";
  };

  // FIX 9: Shared chart options — avoids repeating config and enables
  // Chart.js to UPDATE data in place rather than full remount
  const chartOptions = {
    animation: false, // smoother live updates
    responsive: true,
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" } },
    },
    plugins: {
      legend: { labels: { color: "white" } },
    },
  };

  const statusColor =
    liveData?.status === "DANGER"
      ? "red"
      : liveData?.status === "WARNING"
      ? "orange"
      : "green";

  return (
    <div
      style={{
        padding: "20px",
        color: "white",
        // FIX 10: Added WARNING background color — was missing (only DANGER had one)
        backgroundColor:
          liveData?.status === "DANGER"
            ? "#3b0000"
            : liveData?.status === "WARNING"
            ? "#2b1a00"
            : "black",
      }}
    >
      <h1>Live Air Quality Dashboard</h1>

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

      <h3 style={{ color: statusColor, fontWeight: "bold" }}>
        {!liveData
          ? ""
          : liveData.status === "DANGER"
          ? "🚨 Dangerous Condition Detected"
          : liveData.status === "WARNING"
          ? "⚠️ Moderate Risk Detected"
          : "✅ Environment Safe"}
      </h3>

      <h3 style={{ marginTop: "10px", color: statusColor, fontWeight: "bold" }}>
        {getActionMessage()}
      </h3>

      {notification && (
        <h3 style={{ marginTop: "10px", color: "cyan", fontWeight: "bold" }}>
          {notification}
        </h3>
      )}

      {liveData && (
        <div style={{ marginBottom: "20px" }}>
          <p>Gas: {liveData.gas}</p>
          <p>Dust: {liveData.dust}</p>
          <p>Temperature: {liveData.temp} °C</p>
          <p>Humidity: {liveData.humidity} %</p>
          {/* FIX 11: risk_score || 50 shows 50 even when score is 0 — use ?? instead */}
          <p style={{ fontWeight: "bold" }}>
            Risk Score: {liveData.risk_score ?? "N/A"}%
          </p>
        </div>
      )}

      {/* FIX 12: Removed `key` prop from Line charts entirely.
          Using history.length as key caused full unmount+remount on every
          new data point — very expensive and causes chart flicker.
          Chart.js handles live data updates natively without remounting. */}
      <h3>Gas & Dust</h3>
      <Line
        data={{
          labels,
          datasets: [
            { label: "Gas", data: history.map((d) => d.gas), borderWidth: 2, tension: 0.4 },
            { label: "Dust", data: history.map((d) => d.dust), borderWidth: 2, tension: 0.4 },
          ],
        }}
        options={chartOptions}
      />

      <h3>Temperature</h3>
      <Line
        data={{
          labels,
          datasets: [
            { label: "Temperature", data: history.map((d) => d.temp), borderWidth: 2, tension: 0.4 },
          ],
        }}
        options={chartOptions}
      />

      <h3>Humidity</h3>
      <Line
        data={{
          labels,
          datasets: [
            { label: "Humidity", data: history.map((d) => d.humidity), borderWidth: 2, tension: 0.4 },
          ],
        }}
        options={chartOptions}
      />
    </div>
  );
}