import React from 'react';
import { Card, CardContent, Typography, Box, Chip, LinearProgress } from '@mui/material';
import { keyframes } from '@mui/system';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const countUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.8); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const SensorCard = ({ title, value, unit, optimal, icon }) => {
  const getStatus = (value, optimal) => {
    if (!value || !optimal) return { 
      color: 'default', 
      label: 'No Data', 
      bgColor: 'rgba(158, 158, 158, 0.1)',
      progress: 0,
      trend: 'flat'
    };
    
    const percentage = ((value - optimal[0]) / (optimal[1] - optimal[0])) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    if (value >= optimal[0] && value <= optimal[1]) {
      return { 
        color: 'success', 
        label: 'Optimal', 
        bgColor: 'rgba(76, 175, 80, 0.1)',
        progress: clampedPercentage,
        trend: 'up'
      };
    } else if (value < optimal[0] * 0.8 || value > optimal[1] * 1.2) {
      return { 
        color: 'error', 
        label: 'Critical', 
        bgColor: 'rgba(229, 57, 53, 0.1)',
        progress: clampedPercentage,
        trend: 'down'
      };
    } else {
      return { 
        color: 'warning', 
        label: 'Attention', 
        bgColor: 'rgba(255, 143, 0, 0.1)',
        progress: clampedPercentage,
        trend: 'flat'
      };
    }
  };

  const status = getStatus(value, optimal);

  const getTrendIcon = () => {
    switch (status.trend) {
      case 'up': return <TrendingUpIcon sx={{ fontSize: 20, color: 'success.main' }} />;
      case 'down': return <TrendingDownIcon sx={{ fontSize: 20, color: 'error.main' }} />;
      default: return <TrendingFlatIcon sx={{ fontSize: 20, color: 'warning.main' }} />;
    }
  };

  return (
    <Card sx={{ 
      height: '100%', 
      bgcolor: status.bgColor,
      border: `2px solid ${
        status.color === 'success' ? 'rgba(76, 175, 80, 0.3)' : 
        status.color === 'warning' ? 'rgba(255, 143, 0, 0.3)' : 
        status.color === 'error' ? 'rgba(229, 57, 53, 0.3)' : 
        'rgba(158, 158, 158, 0.3)'
      }`,
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-200px',
        width: '200px',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        animation: `${shimmer} 3s infinite`,
      },
      '&:hover': { 
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: `0 16px 48px ${
          status.color === 'success' ? 'rgba(76, 175, 80, 0.25)' : 
          status.color === 'warning' ? 'rgba(255, 143, 0, 0.25)' : 
          status.color === 'error' ? 'rgba(229, 57, 53, 0.25)' : 
          'rgba(158, 158, 158, 0.25)'
        }`,
      },
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {getTrendIcon()}
              <Typography variant="caption" color="text.secondary">
                Real-time
              </Typography>
            </Box>
          </Box>
          <Typography variant="h2" sx={{ fontSize: '3rem', lineHeight: 1 }}>
            {icon}
          </Typography>
        </Box>
        
        {/* Main Value */}
        <Box sx={{ animation: `${countUp} 0.8s ease-out` }}>
          <Typography variant="h2" component="div" sx={{ 
            color: status.color === 'success' ? 'success.main' : 
                   status.color === 'warning' ? 'warning.main' : 
                   status.color === 'error' ? 'error.main' : 'text.secondary',
            fontWeight: 800,
            mb: 1,
            fontSize: '2.5rem',
            letterSpacing: '-0.02em'
          }}>
            {value ? `${value.toFixed(1)}${unit}` : '--'}
          </Typography>
        </Box>
        
        {/* Progress Bar */}
        <LinearProgress 
          variant="determinate" 
          value={status.progress} 
          sx={{ 
            mb: 2,
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(0,0,0,0.05)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: status.color === 'success' ? 'success.main' : 
                              status.color === 'warning' ? 'warning.main' : 
                              status.color === 'error' ? 'error.main' : 'grey.400',
              borderRadius: 3,
            }
          }}
        />
        
        {/* Footer */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Target: {optimal[0]}-{optimal[1]}{unit}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.25 }}>
              {value ? new Date().toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : 'Never'}
            </Typography>
          </Box>
          <Chip 
            label={status.label} 
            color={status.color} 
            size="small"
            variant="filled"
            sx={{ 
              fontWeight: 700,
              fontSize: '0.75rem',
              boxShadow: 1
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SensorCard;
