# 🌍 IoT-Based Indoor Environmental Safety Monitoring System

## 📌 Overview
This project is a **real-time IoT + Machine Learning system** that monitors indoor environmental conditions and detects unsafe situations.

It uses sensors to collect live data, processes it using a trained ML model, and displays results on an interactive dashboard with alerts.

---

## 🚀 Features

- 📡 Real-time sensor data collection (ESP32)
- 🤖 Machine Learning-based safety prediction
- 📊 Live dashboard with graphs
- ⚠️ Alert system for unsafe conditions
- 🔊 Sound alerts for critical situations
- 📈 Trend visualization (Gas, Dust, Temperature, Humidity)
- 🧠 Prediction tracking over time
- 🏭 Use Cases
Factories
Laboratories
Indoor air quality monitoring
Safety systems
📌 Future Improvements
Real relay hardware control
SMS/Email alert integration
Cloud deployment
Advanced ML models

---

## 🧠 System Architecture

---

## 🛠️ Tech Stack

### 🔹 Hardware
- ESP32
- MQ135 Gas Sensor
- Dust Sensor (G2Y1010AU0F)
- DHT22 (Temperature & Humidity)

### 🔹 Backend
- Python
- Flask
- Scikit-learn
- PySerial

### 🔹 Frontend
- React.js
- Chart.js

### 🔹 Machine Learning
- Logistic Regression
- Isolation Forest (optional)

---

## 📊 Machine Learning Details

- Model: Logistic Regression
- Input Features:
  - Gas
  - Dust
  - Temperature
  - Humidity
- Output:
  - 0 → Safe
  - 1 → Unsafe

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/gamer-ray07/-Indoor-Environmental-Safety-Monitoring.git
cd -Indoor-Environmental-Safety-Monitoring
🧪 Future Improvements
🌐 Deploy online (cloud hosting)
📱 Mobile app integration
📡 MQTT-based communication
📊 Advanced ML models
📍 Multi-room monitoring
