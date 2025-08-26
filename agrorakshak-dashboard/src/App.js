import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import { 
  Container, Grid, AppBar, Toolbar, Typography, CssBaseline, 
  Button, Box, Alert, Paper, Fab, Card, CardContent, Chip,
  Avatar, LinearProgress, Stack, Divider, IconButton, Drawer,
  List, ListItem, ListItemIcon, ListItemText, ListItemButton,
  Tabs, Tab, Badge, Menu, MenuItem, Breadcrumbs, Link
} from '@mui/material';
import { keyframes } from '@mui/system';
import { ref, onValue, off } from 'firebase/database';
import { database } from './services/firebase';
import { testFirebaseConnection, addTestSensorData, addTestDiseaseDetection } from './utils/testFirebase';
import SensorCard from './components/SensorCard';
import WeatherCard from './components/WeatherCard';
import DiseaseAlert from './components/DiseaseAlert';
import WateringSystemStatus from './components/WateringSystemStatus';

// Icons
import AddIcon from '@mui/icons-material/Add';
import BugReportIcon from '@mui/icons-material/BugReport';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ReportIcon from '@mui/icons-material/Report';
import CloudIcon from '@mui/icons-material/Cloud';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import ScienceIcon from '@mui/icons-material/Science';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 280;


// Professional Animations
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const slideInLeft = keyframes`
  from { 
    transform: translateX(-100%); 
    opacity: 0; 
  }
  to { 
    transform: translateX(0); 
    opacity: 1; 
  }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

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
const professionalTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32',      // Deep Forest Green
      light: '#66BB6A',     // Lighter variant
      dark: '#1B5E20',      // Darker variant
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1E88E5',      // Sophisticated Blue
      light: '#64B5F6',     // Lighter variant
      dark: '#1565C0',      // Darker variant
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#00C853',      // Success Emerald
      light: '#69F0AE',
      dark: '#00A152',
    },
    warning: {
      main: '#FFB300',      // Warning Amber
      light: '#FFD54F',
      dark: '#FF8F00',
    },
    error: {
      main: '#FF5722',      // Critical Coral
      light: '#FF8A65',
      dark: '#E64A19',
    },
    info: {
      main: '#00BCD4',      // Info Teal
      light: '#4DD0E1',
      dark: '#0097A7',
    },
    background: {
      default: '#FAFAFA',   // Warm Cream
      paper: '#FFFFFF',     // Pure White
    },
    text: {
      primary: '#37474F',   // Charcoal Grey
      secondary: '#78909C', // Medium Grey
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontSize: '2.5rem',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 20,
          boxShadow: '0px 4px 20px rgba(55, 71, 79, 0.08)',
          border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,1) 100%)',
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
            pointerEvents: 'none',
          },
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0px 12px 32px rgba(55, 71, 79, 0.16)',
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 32px',
          fontSize: '0.95rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(46, 125, 50, 0.24)',
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          backgroundImage: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          fontSize: '0.875rem',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #2E7D32 0%, #1E88E5 50%, #00BCD4 100%)',
          backgroundSize: '200% 200%',
          animation: `${gradientShift} 12s ease infinite`,
          boxShadow: '0px 4px 20px rgba(46, 125, 50, 0.20)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,1) 100%)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          height: 8,
          backgroundColor: alpha(theme.palette.text.primary, 0.1),
        }),
        bar: {
          borderRadius: 8,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRight: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
          backdropFilter: 'blur(10px)',
        }),
      },
    },
  },
});

// Navigation items
const navigationItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, id: 'dashboard' },
  { text: 'Plant Monitoring', icon: <AgricultureIcon />, id: 'monitoring' },
  { text: 'Disease Detection', icon: <HealthAndSafetyIcon />, id: 'health' },
  { text: 'Analytics', icon: <AnalyticsIcon />, id: 'analytics' },
  { text: 'Weather', icon: <CloudIcon />, id: 'weather' },
  { text: 'Devices', icon: <DeviceHubIcon />, id: 'devices' },
  { text: 'Reports', icon: <ReportIcon />, id: 'reports' },
  { text: 'Settings', icon: <SettingsIcon />, id: 'settings' },
];

function App() {
  const [sensorData, setSensorData] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [deviceCount, setDeviceCount] = useState(0);
  const [systemHealth, setSystemHealth] = useState(95);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentView, setCurrentView] = useState('dashboard');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      const isConnected = await testFirebaseConnection();
      setConnectionStatus(isConnected ? 'connected' : 'failed');
    };
    
    testConnection();

    const latestRef = ref(database, 'latest_readings');
    const unsubscribe = onValue(latestRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData(data);
        setDeviceCount(Object.keys(data).length);
        setLastUpdate(new Date());
        setLoading(false);
      }
    }, (error) => {
      console.error('Firebase read error:', error);
      setConnectionStatus('failed');
      setLoading(false);
    });

    return () => off(latestRef, 'value', unsubscribe);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setMobileOpen(false);
  };

  const handleAddTestData = async () => {
    setLoading(true);
    await addTestSensorData();
  };

  const handleAddTestDisease = async () => {
    await addTestDiseaseDetection();
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const getHealthyPlantsCount = () => {
    return deviceCount > 0 ? deviceCount * Math.floor(Math.random() * 5 + 3) : 0;
  };

  // Sidebar Component
  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Sidebar Header */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #2E7D32 0%, #1E88E5 50%, #00BCD4 100%)',
        backgroundSize: '200% 200%',
        animation: `${gradientShift} 12s ease infinite`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box display="flex" alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            mr: 2, 
            width: 56, 
            height: 56,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            <AgricultureIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 800, 
              mb: -0.5,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}>
              AgroRakshak
            </Typography>
            <Typography variant="caption" sx={{ 
              opacity: 0.9,
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}>
              Smart Agricultural Monitor
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, pt: 2, px: 1 }}>
        {navigationItems.map((item, index) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavClick(item.id)}
              selected={currentView === item.id}
              sx={{
                mx: 1,
                borderRadius: 3,
                py: 1.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&.Mui-selected': {
                  bgcolor: alpha('#2E7D32', 0.15),
                  transform: 'translateX(4px)',
                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                  '&:hover': { 
                    bgcolor: alpha('#2E7D32', 0.2),
                    transform: 'translateX(6px)',
                  },
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                  '& .MuiListItemText-primary': { 
                    color: 'primary.main', 
                    fontWeight: 700,
                  },
                },
                '&:hover': { 
                  bgcolor: alpha('#2E7D32', 0.08),
                  transform: 'translateX(2px)',
                },
                animation: `${slideInLeft} ${0.8 + index * 0.1}s ease-out`,
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40, 
                color: 'text.secondary',
                transition: 'color 0.2s ease',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{ 
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* Enhanced System Status in Sidebar */}
      <Paper sx={{ 
        m: 2, 
        p: 3, 
        bgcolor: alpha('#2E7D32', 0.05),
        borderRadius: 3,
        border: `1px solid ${alpha('#2E7D32', 0.1)}`,
      }}>
        <Typography variant="subtitle2" color="primary.main" gutterBottom sx={{ fontWeight: 700 }}>
          🎛️ System Status
        </Typography>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Health:</Typography>
            <Chip 
              label={`${systemHealth}%`} 
              color="success" 
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Devices:</Typography>
            <Chip 
              label={deviceCount} 
              color="info" 
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Status:</Typography>
            <Chip 
              label={connectionStatus === 'connected' ? '🟢 Online' : '🔴 Offline'} 
              color={connectionStatus === 'connected' ? 'success' : 'error'} 
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );

  // Main Content Component
  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardContent />;
      case 'monitoring':
        return <MonitoringContent />;
      case 'health':
        return <HealthContent />;
      case 'weather':
        return <WeatherContent />;
      case 'analytics':
        return <AnalyticsContent />;
      default:
        return <DashboardContent />;
    }
  };

  const DashboardContent = () => (
    <Box>
      {/* Quick Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #00C853 0%, #69F0AE 100%)',
            color: 'white',
            animation: `${fadeIn} 0.6s ease-out`,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 800, 
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}>
                    {getHealthyPlantsCount()}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.9,
                    fontWeight: 600,
                  }}>
                    Healthy Plants
                  </Typography>
                </Box>
                <AgricultureIcon sx={{ 
                  fontSize: 56, 
                  opacity: 0.8,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #FFB300 0%, #FFD54F 100%)',
            color: 'white',
            animation: `${fadeIn} 0.8s ease-out`,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 800, 
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}>
                    {deviceCount}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.9,
                    fontWeight: 600,
                  }}>
                    Active Sensors
                  </Typography>
                </Box>
                <DeviceHubIcon sx={{ 
                  fontSize: 56, 
                  opacity: 0.8,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1E88E5 0%, #64B5F6 100%)',
            color: 'white',
            animation: `${fadeIn} 1.0s ease-out`,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 800, 
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}>
                    {systemHealth}%
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.9,
                    fontWeight: 600,
                  }}>
                    System Health
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ 
                  fontSize: 56, 
                  opacity: 0.8,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={systemHealth} 
                sx={{ 
                  mt: 2,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': { 
                    bgcolor: 'rgba(255,255,255,0.9)',
                    borderRadius: 3,
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #FF5722 0%, #FF8A65 100%)',
            color: 'white',
            animation: `${fadeIn} 1.2s ease-out`,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 800, 
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}>
                    3
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.9,
                    fontWeight: 600,
                  }}>
                    Active Alerts
                  </Typography>
                </Box>
                <Badge 
                  badgeContent={3} 
                  color="warning"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }
                  }}
                >
                  <NotificationsIcon sx={{ 
                    fontSize: 56, 
                    opacity: 0.8,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  }} />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Watering System Status */}
      {sensorData && Object.keys(sensorData).length > 0 && (
        <Box sx={{ mb: 4, animation: `${fadeIn} 1.4s ease-out` }}>
          <WateringSystemStatus sensorData={sensorData['esp32_greenhouse_001']} />
        </Box>
      )}

      {/* Enhanced Control Center */}
      <Paper elevation={0} sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 4, 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,1) 100%)',
        border: `1px solid ${alpha('#37474F', 0.08)}`,
        backdropFilter: 'blur(10px)',
        animation: `${fadeIn} 1.6s ease-out`,
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ 
              bgcolor: 'primary.main', 
              mr: 3, 
              width: 56, 
              height: 56,
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
            }}>
              <DashboardIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: 'primary.main',
                mb: 0.5,
              }}>
                System Control Center
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage and monitor your AgroRakshak system
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="contained" 
              onClick={handleAddTestData}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
              }}
            >
              Generate Data
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleAddTestDisease}
              startIcon={<BugReportIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
              }}
            >
              Test Disease
            </Button>
          </Stack>
        </Box>
        
        {connectionStatus === 'connected' && (
          <Alert 
            severity="success" 
            sx={{ 
              borderRadius: 3,
              border: `1px solid ${alpha('#00C853', 0.2)}`,
              background: alpha('#00C853', 0.08),
              '& .MuiAlert-icon': { 
                fontSize: 28,
                color: '#00C853',
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              🚀 All Systems Operational
            </Typography>
            <Typography variant="body2">
              Real-time monitoring active and data streaming successfully.
              {lastUpdate && (
                <span style={{ marginLeft: 8, opacity: 0.8 }}>
                  Last sync: {lastUpdate.toLocaleTimeString('en-IN')}
                </span>
              )}
            </Typography>
          </Alert>
        )}
      </Paper>
    </Box>
  );
    // Enhanced Monitoring Content
    const MonitoringContent = () => (
      <Box>
        <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ 
              borderBottom: `1px solid ${alpha('#37474F', 0.12)}`,
              '& .MuiTab-root': { 
                textTransform: 'none', 
                fontWeight: 600,
                fontSize: '1rem',
                py: 2,
              },
              '& .Mui-selected': {
                color: 'primary.main',
              },
            }}
          >
            <Tab icon={<WaterDropIcon />} label="Soil Monitoring" iconPosition="start" />
            <Tab icon={<ThermostatIcon />} label="Climate Control" iconPosition="start" />
            <Tab icon={<ScienceIcon />} label="Nutrient Analysis" iconPosition="start" />
          </Tabs>
        </Paper>
  
        {loading && Object.keys(sensorData).length === 0 ? (
          <Card sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
            <AgricultureIcon sx={{ 
              fontSize: 80, 
              color: 'primary.main', 
              mb: 3,
              filter: 'drop-shadow(0 4px 8px rgba(46, 125, 50, 0.2))',
            }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Initializing Plant Monitoring System
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Connecting to sensors and establishing data stream...
            </Typography>
            <LinearProgress sx={{ 
              borderRadius: 4, 
              height: 8,
              width: '60%',
              mx: 'auto',
            }} />
          </Card>
        ) : (
          Object.keys(sensorData).map((deviceId, index) => (
            <Paper key={deviceId} sx={{ 
              mb: 4, 
              overflow: 'hidden', 
              borderRadius: 4,
              animation: `${fadeIn} ${0.8 + index * 0.2}s ease-out`,
            }}>
              {/* Enhanced Device Header */}
              <Box sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.08) 0%, rgba(30, 136, 229, 0.08) 100%)',
                borderBottom: `1px solid ${alpha('#37474F', 0.1)}`,
              }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ 
                      bgcolor: 'primary.main', 
                      mr: 3, 
                      width: 48, 
                      height: 48,
                      boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                    }}>
                      <DeviceHubIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                        📱 {deviceId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        🌍 Location: {sensorData[deviceId]?.location || 'Unknown'} • 
                        🕒 Active since startup
                      </Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Chip 
                      label="🟢 Online" 
                      color="success" 
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                    <Chip 
                      label="📊 Monitoring" 
                      color="info" 
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Stack>
                </Box>
              </Box>
  
              {/* Enhanced Sensor Grid */}
              <Box sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ animation: `${fadeIn} ${1.0 + index * 0.1}s ease-out` }}>
                      <SensorCard
                        title="Soil Moisture"
                        value={sensorData[deviceId]?.soil_moisture}
                        unit="%"
                        optimal={[40, 70]}
                        icon="💧"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ animation: `${fadeIn} ${1.2 + index * 0.1}s ease-out` }}>
                      <SensorCard
                        title="Temperature"
                        value={sensorData[deviceId]?.temperature}
                        unit="°C"
                        optimal={[20, 30]}
                        icon="🌡️"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ animation: `${fadeIn} ${1.4 + index * 0.1}s ease-out` }}>
                      <SensorCard
                        title="Humidity"
                        value={sensorData[deviceId]?.humidity}
                        unit="%"
                        optimal={[60, 80]}
                        icon="💨"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ animation: `${fadeIn} ${1.6 + index * 0.1}s ease-out` }}>
                      <SensorCard
                        title="Soil pH"
                        value={sensorData[deviceId]?.soil_ph}
                        unit=""
                        optimal={[6.0, 7.5]}
                        icon="⚗️"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    );
  
    // Enhanced Health Content
    const HealthContent = () => (
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ animation: `${fadeIn} 0.8s ease-out` }}>
              <DiseaseAlert />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              p: 3, 
              borderRadius: 4,
              animation: `${fadeIn} 1.0s ease-out`,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,1) 100%)',
            }}>
              <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 700 }}>
                🏥 Plant Health Summary
              </Typography>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Healthy Plants:</Typography>
                  <Chip 
                    label={getHealthyPlantsCount()} 
                    color="success" 
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>At Risk:</Typography>
                  <Chip 
                    label="2" 
                    color="warning" 
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Critical:</Typography>
                  <Chip 
                    label="1" 
                    color="error" 
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
              </Stack>
              
              {/* Enhanced Health Metrics */}
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="primary.main" gutterBottom sx={{ fontWeight: 700 }}>
                  📈 Health Trends (24h)
                </Typography>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Recovery Rate:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>
                      +12%
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">New Issues:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'warning.main' }}>
                      3 detected
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Prevention Score:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'info.main' }}>
                      87/100
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  
    // Enhanced Weather Content
    const WeatherContent = () => (
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ animation: `${fadeIn} 0.8s ease-out` }}>
              <WeatherCard />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              p: 4, 
              borderRadius: 4,
              animation: `${fadeIn} 1.0s ease-out`,
              background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.05) 0%, rgba(255,255,255,1) 100%)',
            }}>
              <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 700 }}>
                🌤️ Weather Impact Analysis
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                AI-powered insights on how weather conditions affect your plants and crop yields.
              </Typography>
              
              {/* Weather Impact Metrics */}
              <Stack spacing={2}>
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha('#1E88E5', 0.08), 
                    borderRadius: 2,
                    border: `1px solid ${alpha('#1E88E5', 0.2)}`,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    🌡️ Temperature Impact
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current conditions are optimal for growth. Expected 15% yield increase.
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha('#00BCD4', 0.08), 
                    borderRadius: 2,
                    border: `1px solid ${alpha('#00BCD4', 0.2)}`,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    💧 Humidity Forecast
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ideal humidity levels detected. Reduced disease risk for next 48 hours.
                  </Typography>
                </Box>
  
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha('#FFB300', 0.08), 
                    borderRadius: 2,
                    border: `1px solid ${alpha('#FFB300', 0.2)}`,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    ☀️ Light Conditions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sufficient sunlight exposure. Photosynthesis efficiency at 92%.
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  
    // Enhanced Analytics Content
    const AnalyticsContent = () => (
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ 
              p: 6, 
              textAlign: 'center', 
              borderRadius: 4,
              animation: `${fadeIn} 0.8s ease-out`,
              background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(255,255,255,1) 100%)',
            }}>
              <AnalyticsIcon sx={{ 
                fontSize: 80, 
                color: 'primary.main', 
                mb: 3,
                filter: 'drop-shadow(0 4px 8px rgba(46, 125, 50, 0.2))',
              }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                📈 Advanced Analytics Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Comprehensive data analysis and predictive insights for your agricultural operations.
              </Typography>
              
              {/* Analytics Preview Cards */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: alpha('#2E7D32', 0.05),
                    border: `1px solid ${alpha('#2E7D32', 0.1)}`,
                  }}>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                      📊 Data Trends
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Historical analysis and pattern recognition
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: alpha('#1E88E5', 0.05),
                    border: `1px solid ${alpha('#1E88E5', 0.1)}`,
                  }}>
                    <Typography variant="h6" color="info.main" sx={{ fontWeight: 700 }}>
                      🔮 Predictions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI-powered yield and health forecasting
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: alpha('#FFB300', 0.05),
                    border: `1px solid ${alpha('#FFB300', 0.1)}`,
                  }}>
                    <Typography variant="h6" color="warning.main" sx={{ fontWeight: 700 }}>
                      📈 Optimization
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Resource efficiency recommendations
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
  
              <Box sx={{ mt: 4 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  sx={{ 
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                  }}
                >
                  🚀 Coming Soon
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  
    return (
      <ThemeProvider theme={professionalTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          {/* Enhanced App Bar */}
          <AppBar
            position="fixed"
            sx={{
              width: { md: `calc(100% - ${drawerWidth}px)` },
              ml: { md: `${drawerWidth}px` },
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              color: 'text.primary',
              boxShadow: '0 4px 20px rgba(46, 125, 50, 0.08)',
              borderBottom: `1px solid ${alpha('#37474F', 0.12)}`,
            }}
          >
            <Toolbar sx={{ py: 1 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 2, 
                  display: { md: 'none' },
                  bgcolor: alpha('#37474F', 0.04),
                  '&:hover': { bgcolor: alpha('#37474F', 0.08) },
                }}
              >
                <MenuIcon />
              </IconButton>
              
              {/* Enhanced Breadcrumbs */}
              <Box sx={{ flexGrow: 1 }}>
                <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
                  <Link 
                    underline="hover" 
                    color="inherit" 
                    href="#" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 600,
                    }}
                  >
                    <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                    AgroRakshak
                  </Link>
                  <Typography 
                    color="primary.main" 
                    sx={{ 
                      textTransform: 'capitalize', 
                      fontWeight: 700,
                    }}
                  >
                    {currentView}
                  </Typography>
                </Breadcrumbs>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {lastUpdate ? `🔄 Last updated: ${lastUpdate.toLocaleTimeString('en-IN')}` : '⏳ Initializing...'}
                </Typography>
              </Box>
  
              {/* Enhanced Header Actions */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Badge 
                  badgeContent={3} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }
                  }}
                >
                  <IconButton 
                    color="inherit"
                    sx={{
                      bgcolor: alpha('#37474F', 0.04),
                      '&:hover': { bgcolor: alpha('#37474F', 0.08) },
                    }}
                  >
                    <NotificationsIcon />
                  </IconButton>
                </Badge>
                <IconButton 
                  color="inherit" 
                  onClick={handleProfileClick}
                  sx={{
                    bgcolor: alpha('#37474F', 0.04),
                    '&:hover': { bgcolor: alpha('#37474F', 0.08) },
                  }}
                >
                  <AccountCircleIcon />
                </IconButton>
              </Stack>
  
              {/* Profile Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
                PaperProps={{
                  sx: {
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(55, 71, 79, 0.16)',
                    border: `1px solid ${alpha('#37474F', 0.08)}`,
                  },
                }}
              >
                <MenuItem onClick={handleProfileClose}>👤 Profile</MenuItem>
                <MenuItem onClick={handleProfileClose}>⚙️ Settings</MenuItem>
                <MenuItem onClick={handleProfileClose}>🚪 Logout</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
  
          {/* Sidebar Drawer */}
          <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
  
          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { md: `calc(100% - ${drawerWidth}px)` },
              minHeight: '100vh',
              bgcolor: 'background.default',
            }}
          >
            <Toolbar />
            <Container maxWidth="xl" sx={{ mt: 2 }}>
              {renderMainContent()}
            </Container>
          </Box>
  
          {/* Enhanced Floating Actions */}
          <Fab
            color="primary"
            aria-label="refresh"
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)',
              boxShadow: '0 8px 32px rgba(46, 125, 50, 0.3)',
              '&:hover': {
                boxShadow: '0 12px 40px rgba(46, 125, 50, 0.4)',
                transform: 'scale(1.1) rotate(180deg)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onClick={handleAddTestData}
          >
            <RefreshIcon sx={{ fontSize: 28 }} />
          </Fab>
        </Box>
      </ThemeProvider>
    );
  }
  
  export default App;
  