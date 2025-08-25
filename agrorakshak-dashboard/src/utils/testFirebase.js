import { ref, push, set, get } from 'firebase/database';
import { database } from '../services/firebase';

export const testFirebaseConnection = async () => {
  try {
    const testRef = ref(database, 'test');
    await set(testRef, {
      message: 'AgroRakshak Firebase connected successfully!',
      timestamp: Date.now(),
      project: 'AgroRakshak Capstone 2025'
    });
    console.log('✅ Firebase connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};

export const addTestSensorData = async () => {
  try {
    const deviceId = 'esp32_greenhouse_001';
    const sensorRef = ref(database, `sensor_data/${deviceId}`);
    const timestamp = Date.now();
    const newDataRef = ref(database, `sensor_data/${deviceId}/${timestamp}`);
    
    const testData = {
      device_id: deviceId,
      location: 'greenhouse_1',
      timestamp: timestamp,
      temperature: Math.round((20 + Math.random() * 15) * 10) / 10, // 20-35°C
      humidity: Math.round((50 + Math.random() * 30) * 10) / 10,    // 50-80%
      soil_moisture: Math.round((30 + Math.random() * 40) * 10) / 10, // 30-70%
      soil_ph: Math.round((6.0 + Math.random() * 2.0) * 10) / 10,   // 6.0-8.0
      signal_strength: -45,
      battery_level: 100
    };
    
    await set(newDataRef, testData);
    
    // Also update latest reading
    const latestRef = ref(database, `latest_readings/${deviceId}`);
    await set(latestRef, testData);
    
    console.log('✅ Test sensor data added!', testData);
    return true;
  } catch (error) {
    console.error('❌ Failed to add test data:', error);
    return false;
  }
};

export const addTestDiseaseDetection = async () => {
  try {
    const deviceId = 'raspberry_pi_001';
    const timestamp = Date.now();
    const diseaseRef = ref(database, `disease_detection/${deviceId}/${timestamp}`);
    
    const diseases = [
      { name: 'healthy', confidence: 0.95, severity: 'none', treatments: [] },
      { name: 'bacterial_blight', confidence: 0.85, severity: 'moderate', treatments: ['Apply copper-based bactericide', 'Improve ventilation', 'Remove affected leaves'] },
      { name: 'early_blight', confidence: 0.78, severity: 'mild', treatments: ['Apply fungicide', 'Ensure proper spacing', 'Water at soil level'] }
    ];
    
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    
    const diseaseData = {
      device_id: deviceId,
      location: 'greenhouse_1',
      timestamp: new Date().toISOString(),
      disease_name: randomDisease.name,
      confidence: randomDisease.confidence,
      severity: randomDisease.severity,
      treatment_suggestions: randomDisease.treatments,
      image_data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNENBRjUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QbGFudCBJbWFnZTwvdGV4dD48L3N2Zz4=' // Placeholder image
    };
    
    await set(diseaseRef, diseaseData);
    console.log('✅ Test disease detection added!', diseaseData);
    return true;
  } catch (error) {
    console.error('❌ Failed to add disease detection:', error);
    return false;
  }
};
