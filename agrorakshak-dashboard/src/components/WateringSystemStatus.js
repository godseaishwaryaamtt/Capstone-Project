import React from 'react';
import { Card, CardContent, Typography, Grid, Box, LinearProgress } from '@mui/material';

const WateringSystemStatus = ({ sensorData = {} }) => {
  // ✅ Safe extraction with default values
  const pumpStatus = sensorData?.pump_status || 'OFF';
  const soilMoisture = sensorData?.soil_moisture || 0;

  const getPumpColor = (status) => {
    return status === 'WATERING' ? 'info.main' : 'grey.300';
  };

  return (
    <Card sx={{ p: 3, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        💧 Automatic Irrigation System
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8}>
          <Box display="flex" alignItems="center">
            <Box sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%',
              bgcolor: getPumpColor(pumpStatus),
              mr: 2,
              animation: pumpStatus === 'WATERING' ? 'pulse 1.5s infinite' : 'none'
            }} />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Water Pump: {pumpStatus}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Soil Moisture: {soilMoisture?.toFixed(1) || '0.0'}%
                {soilMoisture < 30 && soilMoisture > 0 ? ' - Needs Water!' : ''}
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={4}>
          <Box textAlign="center">
            <Typography variant="h4">
              {pumpStatus === 'WATERING' ? '🚰' : '💧'}
            </Typography>
            <Typography variant="caption" color="primary.main">
              {sensorData ? 'Auto Mode' : 'Initializing...'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <LinearProgress 
        variant="determinate" 
        value={Math.max(0, Math.min(100, soilMoisture))} // ✅ Ensure valid range
        sx={{ 
          mt: 2,
          height: 8,
          borderRadius: 4,
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            backgroundColor: soilMoisture < 30 ? 'error.main' : 
                            soilMoisture > 70 ? 'success.main' : 'warning.main',
            borderRadius: 4,
          }
        }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Target Range: 30% - 70% • {sensorData ? 'Live Data' : 'Waiting for sensor data...'}
      </Typography>
    </Card>
  );
};

export default WateringSystemStatus;
