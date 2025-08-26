import React from 'react';
import { Card, CardContent, Typography, Box, Chip, LinearProgress, alpha } from '@mui/material';
import { keyframes } from '@mui/system';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const shimmer = keyframes`
  0% { 
    background-position: -200px 0;
    opacity: 0.3;
  }
  100% { 
    background-position: calc(200px + 100%) 0;
    opacity: 0.6;
  }
`;

const  SensorCard = ({ title, value, unit, optimal, icon }) => {
  const getStatus = (value, optimal) => {
    if (!value || !optimal) return { 
      color: 'text.secondary',
      label: 'No Data', 
      bgGradient: 'linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)',
      progress: 0,
      trend: 'flat'
    };
    
    const percentage = ((value - optimal[0]) / (optimal[12] - optimal)) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    if (value >= optimal && value <= optimal[12]) {
      return { 
        color: 'success.main',
        label: 'Optimal', 
        bgGradient: 'linear-gradient(135deg, rgba(0, 200, 83, 0.08) 0%, rgba(105, 240, 174, 0.08) 100%)',
        progress: clampedPercentage,
        trend: 'up'
      };
    } else if (value < optimal * 0.8 || value > optimal[12] * 1.2) {
      return { 
        color: 'error.main',
        label: 'Critical', 
        bgGradient: 'linear-gradient(135deg, rgba(255, 87, 34, 0.08) 0%, rgba(255, 138, 101, 0.08) 100%)',
        progress: clampedPercentage,
        trend: 'down'
      };
    } else {
      return { 
        color: 'warning.main',
        label: 'Attention', 
        bgGradient: 'linear-gradient(135deg, rgba(255, 179, 0, 0.08) 0%, rgba(255, 213, 79, 0.08) 100%)',
        progress: clampedPercentage,
        trend: 'flat'
      };
    }
  };

  const status = getStatus(value, optimal);

  const getTrendIcon = () => {
    const iconStyle = { fontSize: 20, mr: 0.5 };
    switch (status.trend) {
      case 'up': return <TrendingUpIcon sx={{ ...iconStyle, color: 'success.main' }} />;
      case 'down': return <TrendingDownIcon sx={{ ...iconStyle, color: 'error.main' }} />;
      default: return <TrendingFlatIcon sx={{ ...iconStyle, color: 'warning.main' }} />;
    }
  };

  return (
    <Card sx={{ 
      height: '100%',
      background: status.bgGradient,
      backdropFilter: 'blur(10px)',
      border: `2px solid ${alpha(status.color === 'success.main' ? '#00C853' : 
                                 status.color === 'warning.main' ? '#FFB300' : 
                                 status.color === 'error.main' ? '#FF5722' : '#78909C', 0.2)}`,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-200px',
        width: '200px',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        animation: `${shimmer} 4s infinite`,
      },
      '&:hover': { 
        transform: 'translateY(-6px) scale(1.02)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="body1" sx={{ 
              color: 'text.primary', 
              fontWeight: 700, 
              mb: 0.5,
              fontSize: '1rem'
            }}>
              {title}
            </Typography>
            <Box display="flex" alignItems="center">
              {getTrendIcon()}
              <Typography variant="caption" sx={{ 
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Live Data
              </Typography>
            </Box>
          </Box>
          <Typography variant="h2" sx={{ 
            fontSize: '3rem', 
            lineHeight: 1,
            filter: 'drop-shadow(0 2px 4px rgba(55, 71, 79, 0.1))'
          }}>
            {icon}
          </Typography>
        </Box>
        
        {/* Main Value */}
        <Typography variant="h3" component="div" sx={{ 
          color: status.color,
          fontWeight: 800,
          mb: 2,
          fontSize: '2.75rem',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 4px rgba(55, 71, 79, 0.1)'
        }}>
          {value ? `${value.toFixed(1)}${unit}` : '--'}
        </Typography>
        
        {/* Enhanced Progress Bar */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={status.progress}
            sx={{ 
              height: 10,
              borderRadius: 5,
              backgroundColor: alpha('#37474F', 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                background: status.color === 'success.main' 
                  ? 'linear-gradient(90deg, #00C853, #69F0AE)' 
                  : status.color === 'warning.main' 
                  ? 'linear-gradient(90deg, #FFB300, #FFD54F)'
                  : 'linear-gradient(90deg, #FF5722, #FF8A65)',
              }
            }}
          />
        </Box>
        
        {/* Footer */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" sx={{ 
              color: 'text.secondary', 
              fontWeight: 600,
              display: 'block'
            }}>
              Range: {optimal}-{optimal[12]}{unit}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: 'text.secondary', 
              opacity: 0.8 
            }}>
              {value ? new Date().toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : 'No data'}
            </Typography>
          </Box>
          <Chip 
            label={status.label} 
            sx={{
              backgroundColor: alpha(status.color === 'success.main' ? '#00C853' : 
                                   status.color === 'warning.main' ? '#FFB300' : '#FF5722', 0.15),
              color: status.color,
              fontWeight: 700,
              fontSize: '0.75rem',
              border: `1px solid ${alpha(status.color === 'success.main' ? '#00C853' : 
                                       status.color === 'warning.main' ? '#FFB300' : '#FF5722', 0.3)}`,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SensorCard;
