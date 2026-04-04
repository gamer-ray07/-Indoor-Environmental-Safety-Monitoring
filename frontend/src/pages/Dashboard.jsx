import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [liveData, setLiveData] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastAlert, setLastAlert] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:5000/live")
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setLiveData(data);

            // store last 20 readings
            setHistory(prev => {
              const updated = [...prev, data];
              return updated.slice(-20);
            });

            // 🔥 SOUND ALERT (only when unsafe and not repeating too fast)
            if (data.prediction === 1) {
              const now = Date.now();
              if (now - lastAlert > 5000) {
                const audio = new Audio(
                  "https://www.soundjay.com/buttons/sounds/beep-01a.mp3"
                );
                audio.play();
                setLastAlert(now);
              }
            }
          }
        })
        .catch(err => console.error(err));
    }, 2000);

    return () => clearInterval(interval);
  }, [lastAlert]);

  const labels = history.map((_, i) => i);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Live Air Quality Dashboard</h1>

      {/* MAIN STATUS */}
      <h2>
        Air Quality:{" "}
        {!liveData
          ? "Loading..."
          : liveData.prediction === 1
          ? "⚠️ Unsafe"
          : "✅ Safe"}
      </h2>

      {/* 🔥 ALERT TEXT */}
      <h3 style={{ color: liveData?.prediction === 1 ? "red" : "green" }}>
        {liveData?.alert}
      </h3>

      {/* VALUES */}
      {liveData && (
        <div style={{ marginBottom: "20px" }}>
          <p>Gas: {liveData.gas}</p>
          <p>Dust: {liveData.dust}</p>
          <p>Temperature: {liveData.temp} °C</p>
          <p>Humidity: {liveData.humidity} %</p>
        </div>
      )}

      {/* GRAPH 1 */}
      <h3>Gas & Dust</h3>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Gas",
              data: history.map(d => d.gas),
              borderWidth: 2
            },
            {
              label: "Dust",
              data: history.map(d => d.dust),
              borderWidth: 2
            }
          ]
        }}
      />

      {/* GRAPH 2 */}
      <h3>Temperature</h3>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Temperature",
              data: history.map(d => d.temp),
              borderWidth: 2
            }
          ]
        }}
      />

      {/* GRAPH 3 */}
      <h3>Humidity</h3>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Humidity",
              data: history.map(d => d.humidity),
              borderWidth: 2
            }
          ]
        }}
      />
    </div>
  );
}