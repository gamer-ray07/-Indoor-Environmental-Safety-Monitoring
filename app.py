from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load ML model
model = joblib.load("model.pkl")


# -------------------------
# OPTIONAL: Manual prediction
# -------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        gas = data['gas']
        dust = data['dust']
        temp = data['temp']
        humidity = data['humidity']

        prediction = model.predict([[gas, dust, temp, humidity]])[0]

        return jsonify({"prediction": int(prediction)})

    except Exception as e:
        return jsonify({"error": str(e)})


# -------------------------
# LIVE SENSOR (NO COM LOCK ISSUE)
# -------------------------
@app.route("/live", methods=["GET"])
def live():
    try:
        import serial

        #  Open port only when needed
        ser = serial.Serial('COM9', 115200, timeout=1)

        line = ser.readline().decode(errors='ignore').strip()

        ser.close()  #  ALWAYS close port

        if "Gas" in line and "Temp" in line:
            parts = line.replace("Gas:", "").replace("Dust:", "").replace("Temp:", "").replace("Humidity:", "").split("|")

            if len(parts) == 4:
                gas = int(parts[0])
                dust = int(parts[1])
                temp = float(parts[2])
                humidity = float(parts[3])

                # ML Prediction
                prediction = model.predict([[gas, dust, temp, humidity]])[0]

                # Alert logic
                alert = "⚠️ ALERT: Unsafe Air Quality!" if prediction == 1 else "✅ Air Quality is Safe"

                return jsonify({
                    "gas": gas,
                    "dust": dust,
                    "temp": temp,
                    "humidity": humidity,
                    "prediction": int(prediction),
                    "alert": alert
                })

        return jsonify({"error": "No valid data"})

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)