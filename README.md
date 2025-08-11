# AgroRakshak: Smart Plant Monitoring and Care System 🌱

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Arduino](https://img.shields.io/badge/Arduino-Compatible-00979D?logo=Arduino&logoColor=white)](https://www.arduino.cc/)
[![ESP32](https://img.shields.io/badge/ESP32-Microcontroller-red)](https://www.espressif.com/en/products/socs/esp32)

An intelligent IoT-based plant monitoring and automated care system that combines embedded systems, AI-powered disease detection, and environmental control to optimize plant health and growth.

## 🚀 Features

### Core Monitoring
- **Real-time Environmental Monitoring**: Soil moisture, pH, NPK levels, temperature, and humidity
- **Weather Integration**: API-based forecasting for intelligent irrigation scheduling
- **AI Disease Detection**: Computer vision-based plant health analysis using ESP32-CAM

### Automated Control Systems
- **Smart Irrigation**: Automated watering based on soil conditions and weather data
- **Temperature Control**: Heating/cooling elements for optimal growing conditions
- **pH Management**: Automated dispensing of pH-adjusting solutions
- **Greenhouse Integration**: Controlled environment with automated vents and LED grow lights

### User Interface
- **Interactive Dashboard**: Real-time data visualization and system control
- **Smart Alerts**: Timely notifications for plant care requirements
- **Plant Care Recommendations**: AI-powered suggestions based on plant type and conditions

## 🛠️ Hardware Components

| Component | Purpose | Model/Type |
|-----------|---------|------------|
| ESP32 Microcontroller | Main processing unit | ESP32 (16MB version) |
| Soil Moisture Sensor | Monitor soil water content | Capacitive soil sensor |
| pH Sensor | Monitor soil acidity | pH probe with amplifier |
| NPK Sensor | Monitor nutrients | NPK soil sensor |
| Temperature/Humidity | Environmental monitoring | DHT22 |
| Camera Module | Disease detection | ESP32-CAM |
| Water Pump | Automated irrigation | 5V DC water pump |
| Relay Module | Control actuators | 4-channel relay |
| pH Solutions | pH adjustment | pH up/down solutions |

## 📋 Software Stack

### Embedded Systems
- **Development Environment**: Arduino IDE
- **Microcontroller Programming**: C++ for ESP32
- **Libraries**: WiFi, Firebase ESP32, DHT sensor library, Camera library

### Cloud & Backend
- **Database**: Firebase Realtime Database
- **Cloud Storage**: Firebase Storage (for images)
- **Authentication**: Firebase Auth
- **API Integration**: OpenWeatherMap API

### Frontend
- **Web Dashboard**: React.js / Flutter Web
- **Mobile App**: Flutter (optional)
- **Data Visualization**: Chart.js / Recharts

### AI/ML
- **Disease Detection**: TensorFlow Lite
- **Model Training**: Pre-trained models from PlantVillage dataset
- **Inference**: On-device or cloud-based processing

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Sensor Layer  │────│  ESP32 MCU   │────│  Cloud Services │
│ • Soil Sensors  │    │ • Data Proc. │    │ • Firebase DB   │
│ • Camera Module │    │ • Control    │    │ • Weather API   │
│ • Environment   │    │ • WiFi Comm. │    │ • ML Inference  │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                       │                    │
         │              ┌──────────────┐              │
         │              │   Actuators  │              │
         └──────────────│ • Water Pump │──────────────┘
                        │ • Heater/Fan │
                        │ • pH Pumps   │
                        │ • Dome Vents │
                        └──────────────┘
                               │
                    ┌─────────────────────┐
                    │   User Interface    │
                    │ • Web Dashboard     │
                    │ • Mobile App        │
                    │ • Alerts/Notifs     │
                    └─────────────────────┘
```

## 🔧 Installation & Setup

### Prerequisites
- Arduino IDE with ESP32 board support
- Firebase account and project setup
- OpenWeatherMap API key
- Required hardware components

### Hardware Setup
1. **ESP32 Wiring**: Connect sensors according to the circuit diagram
2. **Sensor Calibration**: Calibrate pH and NPK sensors
3. **Actuator Connection**: Wire pumps, relays, and control elements
4. **Greenhouse Assembly**: Set up dome structure with automated components

### Software Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/agrorakshak.git
   cd agrorakshak
   ```

2. **ESP32 Setup**
   ```bash
   # Install required libraries in Arduino IDE
   # - FirebaseESP32
   # - DHT sensor library
   # - ArduinoJson
   # - ESP32Servo
   ```

3. **Configure Firebase**
   ```cpp
   // Update config.h with your credentials
   #define FIREBASE_HOST "your-project.firebaseio.com"
   #define FIREBASE_AUTH "your-database-secret"
   #define WIFI_SSID "your-wifi-ssid"
   #define WIFI_PASSWORD "your-wifi-password"
   ```

4. **Weather API Setup**
   ```cpp
   // Add OpenWeatherMap API key
   #define WEATHER_API_KEY "your-api-key"
   ```

5. **Upload Code**
   - Compile and upload `main.ino` to ESP32
   - Verify serial monitor for successful connections

### Dashboard Setup
1. **Install Dependencies**
   ```bash
   cd dashboard
   npm install
   ```

2. **Configure Firebase**
   ```javascript
   // Update firebase-config.js
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     databaseURL: "your-database-url",
     projectId: "your-project-id"
   };
   ```

3. **Run Dashboard**
   ```bash
   npm start
   ```

## 📊 Usage

### Initial Setup
1. Power on the ESP32 system
2. Connect to WiFi network
3. Access dashboard via web browser
4. Select plant type and configure preferences
5. Calibrate sensors if needed

### Daily Operation
- **Automatic Mode**: System operates autonomously based on sensor data
- **Manual Override**: Control irrigation, temperature, and pH manually
- **Monitoring**: View real-time data and historical trends
- **Alerts**: Receive notifications for critical conditions

### Disease Detection
1. Camera captures plant images periodically
2. AI model analyzes images for disease symptoms
3. Results displayed on dashboard with recommendations
4. Historical disease tracking available

## 📈 Monitoring Dashboard

The web dashboard provides:
- **Live Data Streams**: Real-time sensor readings
- **Historical Charts**: Trends and patterns over time
- **Control Panels**: Manual override controls
- **Alert System**: Critical condition notifications
- **Plant Health Status**: AI-based disease detection results
- **Weather Integration**: Current and forecast data
- **Recommendations**: Personalized plant care suggestions

## 🎯 Project Objectives

- [x] Real-time multi-parameter monitoring
- [x] Automated irrigation system
- [x] Temperature and pH control
- [x] Weather API integration
- [x] AI-based disease detection
- [x] User-friendly dashboard
- [x] Greenhouse dome integration
- [x] Mobile notifications
- [x] Data analytics and recommendations

## 🧪 Testing

### Hardware Testing
- Sensor accuracy verification
- Actuator response testing
- Network connectivity validation
- Power consumption analysis

### Software Testing
- API integration testing
- Database operations validation
- UI/UX testing across devices
- AI model accuracy assessment

## 📚 Documentation

- **[Hardware Guide](docs/hardware-setup.md)**: Detailed wiring and assembly instructions
- **[Software Manual](docs/software-guide.md)**: Code structure and API documentation
- **[User Manual](docs/user-guide.md)**: Operating instructions and troubleshooting
- **[API Reference](docs/api-reference.md)**: Complete API documentation

## 🔮 Future Enhancements

- **Multi-plant Support**: Monitor multiple plants simultaneously
- **Advanced Analytics**: Machine learning for growth prediction
- **Mobile App**: Native iOS/Android applications
- **Voice Control**: Integration with voice assistants
- **Social Features**: Plant care community and sharing
- **Commercial Scaling**: Adaptation for larger agricultural operations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Capstone Project Team (2025-2026)**
- **Abhirav Yadav** - Hardware Integration & Embedded Systems
- **Aishwarya Godse** - AI/ML Development & Disease Detection
- **Josna Jojen** - Frontend Development & UI/UX Design
- **Ananyachetam Avasthi** - Backend Development & Cloud Integration

**Project Guide**: Prof. Manisha Wani  
**Department**: Electrical and Electronics Engineering

## 🙏 Acknowledgments

- PlantVillage dataset for disease detection training
- OpenWeatherMap for weather API services
- Firebase for cloud infrastructure
- Arduino and ESP32 community for hardware support
- Academic mentors and peer reviewers

---

<div align="center">
  <strong>🌿 Bridging Technology and Agriculture for Sustainable Plant Care 🌿</strong>
</div>

---

*This project is part of the academic capstone program and demonstrates the practical application of IoT, AI, and embedded systems in modern agriculture.*
