import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Alert, AlertTitle, 
  Box, Chip, Button, Dialog, DialogContent, DialogTitle,
  List, ListItem, ListItemText, ListItemIcon, DialogActions
} from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { database } from '../services/firebase';
import BugReportIcon from '@mui/icons-material/BugReport';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const DiseaseAlert = () => {
  const [diseaseData, setDiseaseData] = useState({});
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const diseaseRef = ref(database, 'disease_detection');
    const unsubscribe = onValue(diseaseRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Get latest detection for each device
        const latestDetections = {};
        Object.keys(data).forEach(deviceId => {
          const deviceDetections = data[deviceId];
          const timestamps = Object.keys(deviceDetections).sort();
          const latestTimestamp = timestamps[timestamps.length - 1];
          latestDetections[deviceId] = {
            ...deviceDetections[latestTimestamp],
            timestamp: latestTimestamp
          };
        });
        setDiseaseData(latestDetections);
      }
    }, (error) => {
      console.error('Disease detection read error:', error);
    });

    return () => unsubscribe();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'mild': return 'warning';
      case 'moderate': return 'error';
      case 'severe': return 'error';
      case 'none': return 'success';
      default: return 'info';
    }
  };

  const handleViewTreatment = (detection) => {
    setSelectedAlert(detection);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAlert(null);
  };

  return (
    <>
      <Card sx={{ bgcolor: 'white', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            🔍 Plant Health Monitoring
          </Typography>
          
          {Object.keys(diseaseData).length === 0 ? (
            <Alert severity="info">
              <AlertTitle>Monitoring Active</AlertTitle>
              Disease detection system is running. Results will appear here when available.
            </Alert>
          ) : (
            Object.keys(diseaseData).map(deviceId => {
              const detection = diseaseData[deviceId];
              const isHealthy = detection.disease_name === 'healthy';
              
              return (
                <Alert 
                  key={deviceId}
                  severity={isHealthy ? 'success' : getSeverityColor(detection.severity)}
                  sx={{ mb: 2 }}
                >
                  <AlertTitle>
                    {isHealthy ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <HealthAndSafetyIcon />
                        Plant is Healthy - Device: {deviceId}
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" gap={1}>
                        <BugReportIcon />
                        {detection.disease_name?.replace('_', ' ').toUpperCase()} Detected - Device: {deviceId}
                      </Box>
                    )}
                  </AlertTitle>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} flexWrap="wrap" gap={2}>
                    <Box>
                      <Typography variant="body2">
                        Confidence: <strong>{(detection.confidence * 100).toFixed(1)}%</strong>
                      </Typography>
                      {detection.severity && detection.severity !== 'none' && (
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          Severity: <Chip 
                            label={detection.severity} 
                            size="small" 
                            color={getSeverityColor(detection.severity)}
                            variant="outlined"
                          />
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        Detected: {new Date(detection.timestamp).toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                    
                    {!isHealthy && detection.treatment_suggestions?.length > 0 && (
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleViewTreatment(detection)}
                        startIcon={<LocalHospitalIcon />}
                      >
                        View Treatment
                      </Button>
                    )}
                  </Box>
                </Alert>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Treatment Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <LocalHospitalIcon color="primary" />
            Treatment Recommendations
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <>
              <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
                {selectedAlert.disease_name?.replace('_', ' ').toUpperCase()}
              </Typography>
              
              <Box display="flex" gap={2} mb={2}>
                <Chip 
                  label={`${(selectedAlert.confidence * 100).toFixed(1)}% Confidence`} 
                  color="info" 
                  variant="outlined"
                />
                {selectedAlert.severity && selectedAlert.severity !== 'none' && (
                  <Chip 
                    label={`${selectedAlert.severity} Severity`} 
                    color={getSeverityColor(selectedAlert.severity)}
                    variant="outlined"
                  />
                )}
              </Box>
              
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
                Recommended Actions:
              </Typography>
              
              {selectedAlert.treatment_suggestions?.length > 0 ? (
                <List>
                  {selectedAlert.treatment_suggestions.map((treatment, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <LocalHospitalIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={treatment}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No specific treatments available. Consult with an agricultural expert.
                </Typography>
              )}
              
              {selectedAlert.image_data && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Detection Image:
                  </Typography>
                  <img 
                    src={selectedAlert.image_data} 
                    alt="Plant disease detection"
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto', 
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0'
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DiseaseAlert;
