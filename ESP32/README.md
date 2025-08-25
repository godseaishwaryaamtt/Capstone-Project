# ESP32 AgroRakshak Sensor Module

## 🌱 Overview

This ESP32 module is part of the **AgroRakshak Smart Plant Monitoring System** - a comprehensive IoT solution for precision agriculture. The ESP32 continuously monitors soil moisture, temperature, humidity, and pH levels, then sends real-time data to Firebase for display on the AgroRakshak web dashboard.

**Project**: AgroRakshak Capstone Project 2025  
**Authors**: Abhirav Yadav, Aishwarya Godse, Josna Jojen, Ananyachetam Avasthi  
**Institution**: Electronics & Communication Engineering  

## 🚀 Features

- ✅ **Real-time Soil Monitoring**: Moisture, pH, temperature, humidity
- ✅ **WiFi Connectivity**: Automatic connection with reconnection handling
- ✅ **Firebase Integration**: Direct upload to cloud database
- ✅ **Dashboard Compatibility**: Data syncs with AgroRakshak web interface
- ✅ **Error Handling**: Robust sensor reading and network error recovery
- ✅ **Low Power Design**: Optimized for continuous operation

## 🛠 Hardware Requirements

### **ESP32 Development Board**
- ESP32-DevKitC or NodeMCU-32S
- USB-C or Micro-USB cable for programming

### **Sensors**
| Sensor | Purpose | Pin Connection | Operating Voltage |
|--------|---------|----------------|-------------------|
| **DHT22** | Temperature & Humidity | GPIO 4 | 3.3V - 5V |
| **Soil Moisture Sensor** | Soil moisture measurement | GPIO 34 (ADC) | 3.3V - 5V |
| **pH Sensor** | Soil acidity measurement | GPIO 35 (ADC) | 3.3V - 5V |

### **Wiring Diagram**
ESP32 DevKit-C V4 Pinout:
┌─────────────┐
│ ESP32 │
│ ┌─────────┐ │
DHT22 Data ────── │ │ GPIO 4 │ │
Soil Moisture ────── │ │ GPIO 34 │ │ (ADC1_CH6)
pH Sensor ────── │ │ GPIO 35 │ │ (ADC1_CH7)
│ │ 3.3V │ │ ──── Power (+)
│ │ GND │ │ ──── Ground (-)
│ └─────────┘ │
└─────────────┘


### **Breadboard Connections**
ESP32 → Sensor
GPIO 4 → DHT22 Data Pin
GPIO 34 → Soil Moisture Analog Output
GPIO 35 → pH Sensor Analog Output
3.3V → All Sensor VCC/Power
GND → All Sensor GND


## 💻 Software Setup

### **Step 1: Install Arduino IDE**
1. Download [Arduino IDE](https://www.arduino.cc/en/software) (version 1.8.19 or newer)
2. Install and run Arduino IDE

### **Step 2: Add ESP32 Board Package**
1. Open Arduino IDE → **File** → **Preferences**
2. In "Additional Board Manager URLs" add:
https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_dev_index.json

3. Go to **Tools** → **Board** → **Boards Manager**
4. Search for "**ESP32**" and install "**ESP32 by Espressif Systems**"

### **Step 3: Install Required Libraries**
Go to **Sketch** → **Include Library** → **Manage Libraries** and install:

| Library | Version | Purpose |
|---------|---------|---------|
| **ArduinoJson** | 6.21.0+ | JSON data formatting |
| **DHT sensor library** | 1.4.4+ | Temperature/humidity reading |
| **Adafruit Unified Sensor** | 1.1.9+ | Sensor dependency |

### **Step 4: Select Board and Port**
1. **Tools** → **Board** → **ESP32 Arduino** → **ESP32 Dev Module**
2. **Tools** → **Port** → Select your ESP32 COM port
3. **Tools** → **Upload Speed** → **921600**

## ⚙️ Configuration

### **1. Network Configuration**
Edit these lines in the code:
#define WIFI_SSID "Your_WiFi_Network_Name"
#define WIFI_PASSWORD "Your_WiFi_Password"


### **2. Firebase Configuration**
The Firebase settings are pre-configured for AgroRakshak project:
#define FIREBASE_HOST "https://agrorakshak-97ae7-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "AIzaSyBspxjXObANcvC0FIlloqF8m304rr3COV4"


### **3. Device Configuration**
Customize device identification:
#define DEVICE_ID "esp32_greenhouse_001" // Change if you have multiple devices
#define LOCATION "greenhouse_1" // Your greenhouse/farm location


### **4. Sensor Calibration**
#### **pH Sensor Calibration**
The pH sensor requires calibration for accurate readings:
// In readAndSendSensorData() function:
float phVoltage = (phRaw / 4095.0) * 3.3;
float phValue = 7.0 + ((phVoltage - 1.65) / 0.18); // Adjust these values

// Calibration steps:
// 1. Test with pH 7.0 buffer solution → should read ~7.0
// 2. Test with pH 4.0 buffer solution → adjust slope (0.18)
// 3. Fine-tune offset (7.0) if needed


#### **Soil Moisture Calibration**
// Calibrate based on your sensor:
float soilMoisture = map(soilMoistureRaw, 4095, 0, 0, 100);

// For more accurate readings:
// 4095 = sensor in air (dry)
// 1024 = sensor in water (wet)
// Adjust these values based on your sensor testing


## 🚀 Upload and Testing

### **Step 1: Upload Code**
1. Connect ESP32 to computer via USB
2. Open `AgroRakshak_ESP32.ino` in Arduino IDE
3. Click **Upload** (→) button
4. **Hold BOOT button** on ESP32 when you see "Connecting..." in the console
5. Release BOOT button when upload progresses
6. Press **RESET button** after upload completes

### **Step 2: Monitor Serial Output**
1. Open **Tools** → **Serial Monitor**
2. Set baud rate to **115200**
3. Press RESET button on ESP32
4. You should see:
🌱 AgroRakshak ESP32 Starting...
Project: agrorakshak-97ae7
Connecting to your dashboard database...
Connecting to WiFi.....
✅ WiFi connected!
IP address: 192.168.1.xxx
✅ Setup complete! Starting sensor monitoring...

📊 Reading sensors for AgroRakshak dashboard...
Sensor Readings:
🌡️ Temperature: 25.60°C
💨 Humidity: 68.20%
💧 Soil Moisture: 45.80%
⚗️ pH: 6.70
✅ Data sent to AgroRakshak dashboard successfully!
🚀 Check your web dashboard - data should appear now!


### **Step 3: Verify Dashboard Integration**
1. Open your **AgroRakshak Web Dashboard**
2. Navigate to **Plant Monitoring** section
3. You should see your device: `esp32_greenhouse_001`
4. Real-time sensor values should update every 30 seconds

## 🔧 Troubleshooting

### **Common Issues**

#### **1. Upload Failed / Port Not Found**
- **Solution**: Install [CP2102 USB Driver](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers)
- **Mac/Linux**: Check with `ls /dev/cu.usbserial*` or `ls /dev/ttyUSB*`
- **Windows**: Check Device Manager for COM ports

#### **2. WiFi Connection Failed**
// Enable debugging by adding:
WiFi.setDebugOutput(true);

- Check SSID/password spelling
- Ensure 2.4GHz network (ESP32 doesn't support 5GHz)
- Try moving closer to router

#### **3. Firebase Upload Failed**
- Check Serial Monitor for HTTP error codes:
  - `401`: API key invalid
  - `403`: Permission denied
  - `404`: Database URL wrong
- Verify Firebase project URL matches exactly

#### **4. Sensor Reading Issues**
| Issue | Cause | Solution |
|-------|--------|----------|
| DHT22 returns NaN | Wiring/power issue | Check connections, use 5V power |
| pH readings unstable | Sensor not calibrated | Use buffer solutions for calibration |
| Soil moisture always 0/100 | Wrong sensor type | Check if sensor is capacitive/resistive |

#### **5. Serial Monitor Shows Garbage**
- Set baud rate to **115200**
- Press RESET button on ESP32
- Check USB cable quality

### **Advanced Debugging**
Enable detailed logging:


## 📊 Data Format

The ESP32 sends data in this JSON structure:
{
"device_id": "esp32_greenhouse_001",
"location": "greenhouse_1",
"timestamp": 1693987200,
"temperature": 25.6,
"humidity": 68.2,
"soil_moisture": 45.8,
"soil_ph": 6.7,
"signal_strength": -45,
"battery_level": 100
}


## 🔄 Customization

### **Multiple Devices**
To deploy multiple ESP32 sensors:
1. Change `DEVICE_ID` for each device:
#define DEVICE_ID "esp32_greenhouse_002" // greenhouse_003, etc.

2. Update `LOCATION` accordingly:

### **Additional Sensors**
Add more sensors by:
1. Defining new pins:
#define LIGHT_SENSOR_PIN 32
#define CO2_SENSOR_PIN 33

2. Adding readings to JSON:
doc["light_intensity"] = analogRead(LIGHT_SENSOR_PIN);
doc["co2_level"] = analogRead(CO2_SENSOR_PIN);


### **Change Update Frequency**

## 🔋 Power Management

For battery-powered operation:
// Add deep sleep functionality:
#include "esp_sleep.h"

// In loop(), after sending data:
esp_sleep_enable_timer_wakeup(30 * 1000000); // 30 seconds
esp_deep_sleep_start();


## 📞 Support

### **Project Team**
- **Abhirav Yadav** - Project Lead
- **Aishwarya Godse** - Hardware Integration  
- **Josna Jojen** - Software Development
- **Ananyachetam Avasthi** - System Testing

### **Getting Help**
1. Check **Serial Monitor** output first
2. Verify **Firebase Console** for data reception
3. Test individual sensors separately
4. Check **AgroRakshak Dashboard** for real-time updates

### **Resources**
- [ESP32 Documentation](https://docs.espressif.com/projects/esp32/en/latest/)
- [Arduino ESP32 Reference](https://github.com/espressif/arduino-esp32)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)

---

**AgroRakshak ESP32 Sensor Module** - Bringing precision agriculture to modern farming! 🌱🚀
