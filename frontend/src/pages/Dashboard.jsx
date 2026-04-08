import { useState, useEffect, useRef, useCallback } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [liveData, setLiveData] = useState(null);
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState("");

  // FIX 1: lastAlert as ref — state version causes stale closure bug.
  // Inside useEffect with [], setLastAlert updates state but the closure
  // still sees lastAlert = 0 forever. Ref escapes the stale closure.
  const lastAlertRef = useRef(0);

  // FIX 2: fetchData in useCallback so it's a stable reference
  const fetchData = useCallback(() => {
    fetch("http://127.0.0.1:5000/live")
      .then((res) => {
        // FIX 3: Check HTTP status before parsing JSON
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) return; // FIX 4: Early exit on API-level error

        setLiveData(data);

        setHistory((prev) =>
          [...prev, { ...data, time: new Date().toLocaleTimeString() }].slice(-20)
        );

        if (data.status === "DANGER") {
          const now = Date.now();
          // FIX 5: Now reads from ref — actually works inside stale closure
          if (now - lastAlertRef.current > 5000) {
            const audio = new Audio(
              "https://www.soundjay.com/buttons/sounds/beep-01a.mp3"
            );
            // FIX 6: .play() returns a Promise — unhandled rejection crashes on mobile/Firefox
            audio.play().catch((err) => console.warn("Audio blocked:", err));

            setNotification("🚨 Emergency Alert Sent to Admin");
            lastAlertRef.current = now; // FIX 7: Update ref, not state
          }
        } else if (data.status === "WARNING") {
          setNotification("📩 Warning Notification Sent");
        } else {
          setNotification("");
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []); // stable — no deps needed

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const labels = history.map((d) => d.time);

  const getActionMessage = () => {
    if (!liveData) return "";
    if (liveData.status === "DANGER") return "🚨 Emergency: Ventilation System Activated";
    if (liveData.status === "WARNING") return "⚠️ Monitoring Increased - Standby Mode";
    return "✅ System Stable";
  };

  const statusColor =
    liveData?.status === "DANGER" ? "red"
    : liveData?.status === "WARNING" ? "orange"
    : "green";

  // FIX 8: Shared chart options — white axis/legend labels for dark bg,
  // and animation: false for smooth live updates without lag
  const chartOptions = {
    animation: false,
    responsive: true,
    scales: {
      x: { ticks: { color: "white" }, grid: { color: "#333" } },
      y: { ticks: { color: "white" }, grid: { color: "#333" } },
    },
    plugins: {
      legend: { labels: { color: "white" } },
    },
  };

  return (
    <div
      style={{
        padding: "20px",
        color: "white",
        // FIX 9: WARNING case was missing — background stayed black during warning
        backgroundColor:
          liveData?.status === "DANGER" ? "#3b0000"
          : liveData?.status === "WARNING" ? "#2b1a00"
          : "black",
      }}
    >
      <h1>Live Air Quality Dashboard</h1>

      <h2>
        Air Quality:{" "}
        {!liveData
          ? "Loading..."
          : liveData.status === "DANGER" ? "🚨 DANGER"
          : liveData.status === "WARNING" ? "⚠️ WARNING"
          : "✅ SAFE"}
      </h2>

      {/* FIX 10: Consolidated duplicate statusColor logic — was repeated 3x */}
      <h3 style={{ color: statusColor, fontWeight: "bold" }}>
        {!liveData ? ""
          : liveData.status === "DANGER" ? "🚨 Dangerous Condition Detected"
          : liveData.status === "WARNING" ? "⚠️ Moderate Risk Detected"
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
          {/* FIX 11: || 50 shows 50 even when risk_score is legitimately 0 */}
          <p style={{ fontWeight: "bold" }}>
            Risk Score: {liveData.risk_score ?? "N/A"}%
          </p>
        </div>
      )}

      {/* FIX 12: Removed key={history.length} from all charts.
          This caused full unmount + remount on every new data point
          = chart flickers every 2 seconds. Chart.js updates data in-place. */}
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