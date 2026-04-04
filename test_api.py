import requests

url = "http://127.0.0.1:5000/predict"

data = {
    "gas": 1000,
    "dust": 400,
    "temp": 26,
    "humidity": 60
}

response = requests.post(url, json=data)

print(response.json())