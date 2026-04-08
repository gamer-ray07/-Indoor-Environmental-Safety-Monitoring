import serial
import pandas as pd
from datetime import datetime
import time

#  Connect to ESP32
ser = serial.Serial('COM9', 115200, timeout=1)

data_list = []

print("Collecting data... Press Ctrl+C to stop")

try:
    while True:
        line = ser.readline().decode(errors='ignore').strip()

        if "Gas" in line and "Temp" in line:
            parts = line.replace("Gas:", "").replace("Dust:", "").replace("Temp:", "").replace("Humidity:", "").split("|")

            if len(parts) == 4:
                try:
                    gas = int(parts[0])
                    dust = int(parts[1])
                    temp = float(parts[2])
                    hum = float(parts[3])

                    timestamp = datetime.now()

                    # LABEL LOGIC (can tweak later)
                    if gas > 800 or dust > 300:
                        label = 1   # Unsafe
                    else:
                        label = 0   # Safe

                    data_list.append([timestamp, gas, dust, temp, hum, label])

                    print(f"{timestamp} → Gas:{gas}, Dust:{dust}, Temp:{temp}, Hum:{hum}, Label:{label}")

                    #  Control frequency (VERY IMPORTANT)
                    time.sleep(2)

                except:
                    continue

except KeyboardInterrupt:
    print("\nStopping data collection...")

    df = pd.DataFrame(data_list, columns=["Time", "Gas", "Dust", "Temp", "Humidity", "Label"])
    df.to_csv("research_data.csv", index=False)

    print("✅ Data saved as research_data.csv")