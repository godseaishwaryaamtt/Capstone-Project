#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include "time.h"

// WiFi and Firebase config
#define WIFI_SSID "Your_WiFi_Network"
#define WIFI_PASSWORD "Your_WiFi_Password"
#define FIREBASE_HOST "https://agrorakshak-97ae7-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "AIzaSyBspxjXObANcvC0FIlloqF8m304rr3COV4"

// Sensor pins
#define DHT_PIN 4
#define SOIL_MOISTURE_PIN 34
#define LIGHT_SENSOR_PIN 35

// Control pins
#define RED_LED_PIN 25      // Heat indicator (high temp)
#define YELLOW_LED_PIN 26   // Medium temp
#define GREEN_LED_PIN 27    // Optimal temp
#define FAN_RELAY_PIN 23    // Fan control
#define PUMP_RELAY_PIN 22   // **NEW: Water pump control**

// Device config
#define DEVICE_ID "esp32_greenhouse_001"
#define LOCATION "greenhouse_1"

DHT dht(DHT_PIN, DHT22);

// Thresholds
const float LOW_TEMP = 20.0;
const float HIGH_TEMP = 30.0;
const float CRITICAL_TEMP = 35.0;
const float LOW_MOISTURE = 30.0;    // **NEW: Pump ON threshold**
const float HIGH_MOISTURE = 70.0;   // **NEW: Pump OFF threshold**

// Watering control variables
unsigned long lastWateringTime = 0;
const unsigned long wateringDuration = 10000;  // 10 seconds
const unsigned long minWateringInterval = 300000; // 5 minutes between waterings

void setup() {
  Serial.begin(115200);
  
  // Initialize sensor
  dht.begin();
  
  // Initialize control pins
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(YELLOW_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(FAN_RELAY_PIN, OUTPUT);
  pinMode(PUMP_RELAY_PIN, OUTPUT);  // **NEW: Pump control**
  
  // Initial state - all off
  digitalWrite(FAN_RELAY_PIN, LOW);
  digitalWrite(PUMP_RELAY_PIN, LOW);  // **NEW: Pump initially off**
  
  connectToWiFi();
  
  Serial.println("🌱 AgroRakshak Enhanced System with Auto-Watering Started!");
  Serial.println("Features: Temperature LEDs + Fan Control + **Automatic Watering**");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }
  
  readSensorsAndControl();
  delay(30000); // 30 seconds
}

void readSensorsAndControl() {
  Serial.println("\n📊 Reading sensors & updating all controls...");
  
  // Read sensors
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
  float soilMoisture = map(soilMoistureRaw, 4095, 0, 0, 100);
  
  int lightRaw = analogRead(LIGHT_SENSOR_PIN);
  float lightLevel = map(lightRaw, 0, 4095, 0, 100);
  
  // Control systems
  controlTemperatureLEDs(temperature);
  controlFan(temperature);
  controlWaterPump(soilMoisture);  // **NEW: Automatic watering**
  
  // Print readings
  Serial.printf("🌡️  Temperature: %.2f°C\n", temperature);
  Serial.printf("💨 Humidity: %.2f%%\n", humidity);
  Serial.printf("💧 Soil Moisture: %.2f%%\n", soilMoisture);
  Serial.printf("☀️  Light Level: %.2f%%\n", lightLevel);
  Serial.printf("🚰 Water Pump: %s\n", digitalRead(PUMP_RELAY_PIN) ? "ON" : "OFF");
  
  // Send to Firebase
  sendToFirebase(temperature, humidity, soilMoisture, lightLevel);
}

void controlWaterPump(float soilMoisture) {
  static bool isWatering = false;
  static unsigned long wateringStartTime = 0;
  
  unsigned long currentTime = millis();
  
  // Stop watering after duration
  if (isWatering && (currentTime - wateringStartTime >= wateringDuration)) {
    digitalWrite(PUMP_RELAY_PIN, LOW);
    isWatering = false;
    lastWateringTime = currentTime;
    Serial.println("🚰 Watering STOPPED - Duration complete");
  }
  
  // Start watering if needed
  if (!isWatering && 
      soilMoisture < LOW_MOISTURE && 
      (currentTime - lastWateringTime >= minWateringInterval)) {
    
    digitalWrite(PUMP_RELAY_PIN, HIGH);
    isWatering = true;
    wateringStartTime = currentTime;
    Serial.printf("🚰 WATERING STARTED - Soil moisture %.1f%% is below %.1f%%\n", 
                  soilMoisture, LOW_MOISTURE);
  }
  
  // Emergency stop if moisture too high
  if (isWatering && soilMoisture > HIGH_MOISTURE) {
    digitalWrite(PUMP_RELAY_PIN, LOW);
    isWatering = false;
    lastWateringTime = currentTime;
    Serial.println("🚰 Emergency STOP - Soil moisture optimal");
  }
}

void controlTemperatureLEDs(float temperature) {
  // Turn off all LEDs first
  digitalWrite(RED_LED_PIN, LOW);
  digitalWrite(YELLOW_LED_PIN, LOW);
  digitalWrite(GREEN_LED_PIN, LOW);
  
  if (temperature >= CRITICAL_TEMP) {
    digitalWrite(RED_LED_PIN, HIGH);
    Serial.println("🔴 Critical Heat - Red LED ON");
  } else if (temperature >= HIGH_TEMP) {
    digitalWrite(YELLOW_LED_PIN, HIGH);
    Serial.println("🟡 High Temperature - Yellow LED ON");
  } else if (temperature >= LOW_TEMP) {
    digitalWrite(GREEN_LED_PIN, HIGH);
    Serial.println("🟢 Optimal Temperature - Green LED ON");
  }
}

void controlFan(float temperature) {
  if (temperature >= HIGH_TEMP) {
    digitalWrite(FAN_RELAY_PIN, HIGH);
    Serial.println("🌪️  Cooling Fan ON");
  } else if (temperature <= LOW_TEMP + 2) {
    digitalWrite(FAN_RELAY_PIN, LOW);
    Serial.println("🌪️  Cooling Fan OFF");
  }
}

void sendToFirebase(float temp, float humidity, float soilMoisture, float light) {
  time_t now;
  time(&now);
  
  DynamicJsonDocument doc(1024);
  doc["device_id"] = DEVICE_ID;
  doc["location"] = LOCATION;
  doc["timestamp"] = (unsigned long)now;
  doc["temperature"] = temp;
  doc["humidity"] = humidity;
  doc["soil_moisture"] = soilMoisture;
  doc["light_level"] = light;
  doc["fan_status"] = digitalRead(FAN_RELAY_PIN) ? "ON" : "OFF";
  doc["pump_status"] = digitalRead(PUMP_RELAY_PIN) ? "WATERING" : "OFF";  // **NEW**
  doc["led_status"] = getLEDStatus();
  doc["system_mode"] = "AUTO_IRRIGATION";  // **NEW**
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  bool success1 = sendToFirebaseEndpoint("/sensor_data/" + String(DEVICE_ID) + "/" + String(now), jsonString);
  bool success2 = sendToFirebaseEndpoint("/latest_readings/" + String(DEVICE_ID), jsonString);
  
  if (success1 && success2) {
    Serial.println("✅ Complete System Status sent to Firebase!");
  }
}

String getLEDStatus() {
  if (digitalRead(RED_LED_PIN)) return "RED_CRITICAL";
  if (digitalRead(YELLOW_LED_PIN)) return "YELLOW_HIGH";
  if (digitalRead(GREEN_LED_PIN)) return "GREEN_OPTIMAL";
  return "OFF_COLD";
}

// ... (WiFi and HTTP functions remain same as before)
