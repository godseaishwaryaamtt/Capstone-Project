#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include "time.h"

// WiFi credentials - UPDATE THESE WITH YOUR WIFI
#define WIFI_SSID "Your_WiFi_Network"
#define WIFI_PASSWORD "Your_WiFi_Password"

// Firebase configuration - YOUR EXACT PROJECT
#define FIREBASE_HOST "https://agrorakshak-97ae7-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "AIzaSyBspxjXObANcvC0FIlloqF8m304rr3COV4"  // Your API key

// Sensor pins - ADJUST ACCORDING TO YOUR WIRING
#define DHT_PIN 4
#define SOIL_MOISTURE_PIN 34    // ADC pin
#define PH_SENSOR_PIN 35        // ADC pin  
#define DHT_TYPE DHT22

// Device configuration - MAKE SURE THIS MATCHES YOUR DASHBOARD
#define DEVICE_ID "esp32_greenhouse_001"
#define LOCATION "greenhouse_1"

// Initialize sensors
DHT dht(DHT_PIN, DHT_TYPE);

// Timing variables
unsigned long lastSensorRead = 0;
const unsigned long sensorInterval = 30000; // 30 seconds

// NTP server for timestamps
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800; // IST offset (5.5 hours)
const int daylightOffset_sec = 0;

void setup() {
  Serial.begin(115200);
  delay(2000);
  
  Serial.println("🌱 AgroRakshak ESP32 Starting...");
  Serial.println("Project: agrorakshak-97ae7");
  Serial.println("Connecting to your dashboard database...");
  
  // Initialize sensors
  dht.begin();
  
  // Connect to WiFi
  connectToWiFi();
  
  // Initialize time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  
  Serial.println("✅ Setup complete! Starting sensor monitoring...");
  Serial.println("Data will appear in your web dashboard in real-time!");
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectToWiFi();
  }
  
  // Read and send sensor data
  if (millis() - lastSensorRead >= sensorInterval) {
    readAndSendSensorData();
    lastSensorRead = millis();
  }
  
  delay(1000);
}

void connectToWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("❌ WiFi connection failed!");
  }
}

void readAndSendSensorData() {
  Serial.println("\n📊 Reading sensors for AgroRakshak dashboard...");
  
  // Read DHT22 sensor
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  // Read soil moisture (0-4095, convert to percentage)
  int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
  float soilMoisture = map(soilMoistureRaw, 4095, 0, 0, 100); // Invert for dry to wet
  
  // Read pH sensor (calibrate according to your sensor)
  int phRaw = analogRead(PH_SENSOR_PIN);
  float phVoltage = (phRaw / 4095.0) * 3.3;
  float phValue = 7.0 + ((phVoltage - 1.65) / 0.18);
  
  // Validate sensor readings
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("❌ DHT sensor reading failed!");
    temperature = 25.0;  // Fallback value
    humidity = 65.0;     // Fallback value
  }
  
  // Get timestamp
  time_t now;
  time(&now);
  
  // Print readings
  Serial.println("Sensor Readings:");
  Serial.printf("  🌡️  Temperature: %.2f°C\n", temperature);
  Serial.printf("  💨 Humidity: %.2f%%\n", humidity);
  Serial.printf("  💧 Soil Moisture: %.2f%%\n", soilMoisture);
  Serial.printf("  ⚗️  pH: %.2f\n", phValue);
  
  // Create JSON payload matching your dashboard structure
  DynamicJsonDocument doc(1024);
  doc["device_id"] = DEVICE_ID;
  doc["location"] = LOCATION;
  doc["timestamp"] = (unsigned long)now;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["soil_moisture"] = soilMoisture;
  doc["soil_ph"] = phValue;
  doc["signal_strength"] = WiFi.RSSI();
  doc["battery_level"] = 100; // Mains powered
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Send to both locations that your dashboard reads from
  bool success1 = sendToFirebase("/sensor_data/" + String(DEVICE_ID) + "/" + String(now), jsonString);
  bool success2 = sendToFirebase("/latest_readings/" + String(DEVICE_ID), jsonString);
  
  if (success1 && success2) {
    Serial.println("✅ Data sent to AgroRakshak dashboard successfully!");
    Serial.println("🚀 Check your web dashboard - data should appear now!");
  } else {
    Serial.println("❌ Failed to send data to dashboard");
  }
}

bool sendToFirebase(String path, String data) {
  HTTPClient http;
  String url = String(FIREBASE_HOST) + path + ".json?auth=" + String(FIREBASE_AUTH);
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.PUT(data); // Use PUT for latest_readings, PATCH for history
  
  bool success = (httpResponseCode >= 200 && httpResponseCode < 300);
  
  if (!success) {
    Serial.printf("HTTP Error: %d\n", httpResponseCode);
    Serial.println("Response: " + http.getString());
  }
  
  http.end();
  return success;
}
