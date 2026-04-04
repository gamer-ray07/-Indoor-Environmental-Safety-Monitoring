from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

model = joblib.load("model.pkl")

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

if __name__ == "__main__":
    app.run(debug=True)