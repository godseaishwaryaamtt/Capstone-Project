import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Container, Grid, AppBar, Toolbar, Typography, CssBaseline, 
  Button, Box, Alert, Paper, Fab
} from '@mui/material';
import { ref, onValue, off } from 'firebase/database';
import { database } from './services/firebase';
import { testFirebaseConnection, addTestSensorData, addTestDiseaseDetection } from './utils/testFirebase';
import SensorCard from './components/SensorCard';
import WeatherCard from './components/WeatherCard';
import DiseaseAlert from './components/DiseaseAlert';
import AddIcon from '@mui/icons-material/Add';
import BugReportIcon from '@mui/icons-material/BugReport';

// Agricultural theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Green for plants
    },
    secondary: {
      main: '#8BC34A', // Light green
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f1f8e9', // Very light green background
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [sensorData, setSensorData] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Test Firebase connection on startup
    const testConnection = async () => {
      const isConnected = await testFirebaseConnection();
      setConnectionStatus(isConnected ? 'connected' : 'failed');
    };
    
    testConnection();

    // Listen to latest sensor readings
    const latestRef = ref(database, 'latest_readings');
    const unsubscribe = onValue(latestRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData(data);
        setLastUpdate(new Date());
        setLoading(false);
      }
    }, (error) => {
      console.error('Firebase read error:', error);
      setConnectionStatus('failed');
      setLoading(false);
    });

    return () => {
      off(latestRef, 'value', unsubscribe);
    };
  }, []);

  const handleAddTestData = async () => {
    setLoading(true);
    await addTestSensorData();
    // Data will update automatically via the listener
  };

  const handleAddTestDisease = async () => {
    await addTestDiseaseDetection();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ bgcolor: 'primary.main', boxShadow: 3 }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🌱 AgroRakshak Dashboard
          </Typography>
          <Box textAlign="right">
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Smart Plant Monitoring System
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Capstone Project 2025
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Connection Status */}
        <Box mb={3}>
          {connectionStatus === 'connected' && (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              ✅ Firebase connected successfully! Real-time data monitoring is active.
              {lastUpdate && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  Last update: {lastUpdate.toLocaleTimeString('en-IN')}
                </Typography>
              )}
            </Alert>
          )}
          {connectionStatus === 'failed' && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              ❌ Firebase connection failed. Please check your configuration and internet connection.
            </Alert>
          )}
          {connectionStatus === 'testing' && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              🔄 Testing Firebase connection...
            </Alert>
          )}
        </Box>

        {/* Test Controls */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            🧪 Testing Controls
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button 
              variant="contained" 
              onClick={handleAddTestData}
              startIcon={<AddIcon />}
              sx={{ minWidth: 200 }}
            >
              Add Test Sensor Data
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleAddTestDisease}
              startIcon={<BugReportIcon />}
              sx={{ minWidth: 200 }}
            >
              Add Test Disease Detection
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Use these buttons to test the system before connecting real hardware
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Current Sensor Conditions */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              📊 Current Plant Conditions
            </Typography>
          </Grid>
          
          {loading && Object.keys(sensorData).length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Waiting for sensor data... Click "Add Test Sensor Data" to test the system, or connect your ESP32 device.
              </Alert>
            </Grid>
          ) : (
            Object.keys(sensorData).map(deviceId => (
              <React.Fragment key={deviceId}>
                <Grid item xs={12}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Device: {deviceId} - Location: {sensorData[deviceId]?.location || 'Unknown'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <SensorCard
                    title="Soil Moisture"
                    value={sensorData[deviceId]?.soil_moisture}
                    unit="%"
                    optimal={[40, 70]}
                    icon="💧"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <SensorCard
                    title="Temperature"
                    value={sensorData[deviceId]?.temperature}
                    unit="°C"
                    optimal={[20, 30]}
                    icon="🌡️"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <SensorCard
                    title="Humidity"
                    value={sensorData[deviceId]?.humidity}
                    unit="%"
                    optimal={[60, 80]}
                    icon="💨"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <SensorCard
                    title="Soil pH"
                    value={sensorData[deviceId]?.soil_ph}
                    unit=""
                    optimal={[6.0, 7.5]}
                    icon="⚗️"
                  />
                </Grid>
              </React.Fragment>
            ))
          )}
          
          {/* Disease Detection */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 3 }}>
              🏥 Plant Health Analysis
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <DiseaseAlert />
          </Grid>
          
          {/* Weather Information */}
          <Grid item xs={12} md={4}>
            <WeatherCard />
          </Grid>
        </Grid>
      </Container>

      {/* Floating Action Button for quick actions */}
      <Fab 
        color="primary" 
        aria-label="add test data" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddTestData}
      >
        <AddIcon />
      </Fab>
    </ThemeProvider>
  );
}

export default App;
