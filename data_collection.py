import serial
import pandas as pd
import random

ser = serial.Serial('COM9', 115200)

data_list = []

print("Collecting data...")

while len(data_list) < 300:
    try:
        line = ser.readline().decode().strip()

        if "Gas" in line and "Temp" in line:
            parts = line.replace("Gas:", "").replace("Dust:", "").replace("Temp:", "").replace("Humidity:", "").split("|")

            if len(parts) == 4:
                gas = int(parts[0])
                dust = int(parts[1])
                temp = float(parts[2])
                hum = float(parts[3])

               
                if gas > 800 or dust > 300:
                    label = 1 if random.random() > 0.1 else 0
                else:
                    label = 0 if random.random() > 0.1 else 1

                data_list.append([gas, dust, temp, hum, label])

                print(f"{len(data_list)} → {gas}, {dust}, {temp}, {hum}, {label}")

    except:
        continue

df = pd.DataFrame(data_list, columns=["Gas", "Dust", "Temp", "Humidity", "Label"])
df.to_csv("sensor_data_new.csv", index=False)

print("✅ Data saved!")