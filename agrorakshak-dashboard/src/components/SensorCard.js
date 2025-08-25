import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

const SensorCard = ({ title, value, unit, optimal, icon }) => {
  const getStatus = (value, optimal) => {
    if (!value || !optimal) return { color: 'default', label: 'No Data', bgColor: '#f5f5f5' };
    
    if (value >= optimal[0] && value <= optimal[1]) {
      return { color: 'success', label: 'Optimal', bgColor: '#e8f5e8' };
    } else if (value < optimal[0] * 0.8 || value > optimal[1] * 1.2) {
      return { color: 'error', label: 'Critical', bgColor: '#fdeaea' };
    } else {
      return { color: 'warning', label: 'Attention', bgColor: '#fff8e1' };
    }
  };

  const status = getStatus(value, optimal);

  return (
    <Card sx={{ 
      height: '100%', 
      bgcolor: status.bgColor,
      boxShadow: 3,
      '&:hover': { boxShadow: 6 },
      border: `2px solid ${status.color === 'success' ? '#4caf50' : status.color === 'warning' ? '#ff9800' : status.color === 'error' ? '#f44336' : '#e0e0e0'}`
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontSize: '2rem' }}>{icon}</Typography>
        </Box>
        
        <Typography variant="h2" component="div" sx={{ 
          color: status.color === 'success' ? 'success.main' : 
                 status.color === 'warning' ? 'warning.main' : 
                 status.color === 'error' ? 'error.main' : 'text.secondary',
          fontWeight: 'bold',
          mb: 1,
          fontSize: '2.5rem'
        }}>
          {value ? `${value.toFixed(1)}${unit}` : '--'}
        </Typography>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Target: {optimal[0]}-{optimal[1]}{unit}
          </Typography>
          <Chip 
            label={status.label} 
            color={status.color} 
            size="small"
            variant="filled"
          />
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          Last updated: {value ? new Date().toLocaleTimeString('en-IN') : 'Never'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SensorCard;
