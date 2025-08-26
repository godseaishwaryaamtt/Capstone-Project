import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Professional Agricultural Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32',
      light: '#66BB6A',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF8F00',
      light: '#FFCC02',
      dark: '#E65100',
    },
    success: { main: '#4CAF50' },
    warning: { main: '#FB8C00' },
    error: { main: '#E53935' },
    info: { main: '#1E88E5' },
    background: {
      default: '#F8FDF8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2E3440',
      secondary: '#5E6C84',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(46, 125, 50, 0.08)',
          border: '1px solid rgba(46, 125, 50, 0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(46, 125, 50, 0.15)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(46, 125, 50, 0.12)',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FDF8 100%)',
        },
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
        background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
        color: 'white',
        animation: `${slideInLeft} 0.6s ease-out`
      }}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, width: 48, height: 48 }}>
            <AgricultureIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: -0.5 }}>
              AgroRakshak
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Smart Farm Monitor
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, pt: 2 }}>
        {navigationItems.map((item, index) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavClick(item.id)}
              selected={currentView === item.id}
              sx={{
                mx: 2,
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'rgba(46, 125, 50, 0.1)',
                  '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.15)' },
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                  '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 600 },
                },
                '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.05)' },
                animation: `${slideInLeft} ${0.8 + index * 0.1}s ease-out`,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{ fontSize: '0.95rem' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* System Status in Sidebar */}
      <Paper sx={{ m: 2, p: 2, bgcolor: 'rgba(46, 125, 50, 0.05)' }}>
        <Typography variant="subtitle2" color="primary.main" gutterBottom>
          System Status
        </Typography>
        <Stack spacing={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption">Health:</Typography>
            <Chip label={`${systemHealth}%`} color="success" size="small" />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption">Devices:</Typography>
            <Chip label={deviceCount} color="info" size="small" />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption">Status:</Typography>
            <Chip 
              label={connectionStatus === 'connected' ? 'Online' : 'Offline'} 
              color={connectionStatus === 'connected' ? 'success' : 'error'} 
              size="small" 
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

  // Dashboard Content
  const DashboardContent = () => (
    <Box>
      {/* Quick Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
            color: 'white',
            animation: `${fadeIn} 0.6s ease-out`
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {getHealthyPlantsCount()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Healthy Plants
                  </Typography>
                </Box>
                <AgricultureIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #FF8F00 0%, #FFCC02 100%)',
            color: 'white',
            animation: `${fadeIn} 0.8s ease-out`
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {deviceCount}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Sensors
                  </Typography>
                </Box>
                <DeviceHubIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)',
            color: 'white',
            animation: `${fadeIn} 1.0s ease-out`
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {systemHealth}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    System Health
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={systemHealth} 
                sx={{ 
                  mt: 1,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'rgba(255,255,255,0.8)' }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #E53935 0%, #EF5350 100%)',
            color: 'white',
            animation: `${fadeIn} 1.2s ease-out`
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    3
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Alerts
                  </Typography>
                </Box>
                <Badge badgeContent={3} color="warning">
                  <NotificationsIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    
      {sensorData && Object.keys(sensorData).length > 0 && (
        <Grid item xs={12} md={6}>
          <WateringSystemStatus sensorData={sensorData['esp32_greenhouse_001']} />
        </Grid>
      )}
      {/* Control Center */}
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FDF8 100%)',
        border: '1px solid rgba(46, 125, 50, 0.1)'
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            System Control Center
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button 
              variant="contained" 
              onClick={handleAddTestData}
              startIcon={<AddIcon />}
              size="small"
            >
              Test Data
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleAddTestDisease}
              startIcon={<BugReportIcon />}
              size="small"
            >
              Test Disease
            </Button>
          </Stack>
        </Box>
        
        {connectionStatus === 'connected' && (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            🚀 All systems operational. Real-time monitoring active.
            {lastUpdate && (
              <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.8 }}>
                Last sync: {lastUpdate.toLocaleTimeString('en-IN')}
              </Typography>
            )}
          </Alert>
        )}
      </Paper>
    </Box>
  );

  // Monitoring Content
  const MonitoringContent = () => (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 }
          }}
        >
          <Tab icon={<WaterDropIcon />} label="Soil Monitoring" />
          <Tab icon={<ThermostatIcon />} label="Climate Control" />
          <Tab icon={<ScienceIcon />} label="Nutrient Analysis" />
        </Tabs>
      </Paper>

      {loading && Object.keys(sensorData).length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <AgricultureIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Initializing Plant Monitoring System
          </Typography>
          <LinearProgress sx={{ borderRadius: 2, mt: 2 }} />
        </Card>
      ) : (
        Object.keys(sensorData).map((deviceId, index) => (
          <Paper key={deviceId} sx={{ mb: 3, overflow: 'hidden' }}>
            {/* Device Header */}
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(46, 125, 50, 0.05)', 
              borderBottom: '1px solid rgba(46, 125, 50, 0.1)'
            }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
                    <DeviceHubIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="primary.main">
                      {deviceId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: {sensorData[deviceId]?.location || 'Unknown'}
                    </Typography>
                  </Box>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip label="Online" color="success" size="small" />
                  <Chip label="Monitoring" color="info" size="small" />
                </Stack>
              </Box>
            </Box>

            {/* Sensor Grid */}
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
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
              </Grid>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );

  // Health Content
  const HealthContent = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <DiseaseAlert />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              Plant Health Summary
            </Typography>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Healthy Plants:</Typography>
                <Chip label={getHealthyPlantsCount()} color="success" size="small" />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">At Risk:</Typography>
                <Chip label="2" color="warning" size="small" />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Critical:</Typography>
                <Chip label="1" color="error" size="small" />
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Weather Content
  const WeatherContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <WeatherCard />
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary.main">
            Weather Impact Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-powered insights on how weather conditions affect your plants.
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );

  // Analytics Content
  const AnalyticsContent = () => (
    <Card sx={{ p: 4, textAlign: 'center' }}>
      <AnalyticsIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Advanced analytics and reporting features coming soon.
      </Typography>
    </Card>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FDF8 100%)',
            color: 'text.primary',
            boxShadow: '0 2px 12px rgba(46, 125, 50, 0.08)',
            borderBottom: '1px solid rgba(46, 125, 50, 0.12)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Breadcrumbs */}
            <Box sx={{ flexGrow: 1 }}>
              <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
                <Link underline="hover" color="inherit" href="#" sx={{ display: 'flex', alignItems: 'center' }}>
                  <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                  AgroRakshak
                </Link>
                <Typography color="primary.main" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                  {currentView}
                </Typography>
              </Breadcrumbs>
              <Typography variant="caption" color="text.secondary">
                {lastUpdate ? `Last updated: ${lastUpdate.toLocaleTimeString('en-IN')}` : 'Initializing...'}
              </Typography>
            </Box>

            {/* Header Actions */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Badge badgeContent={3} color="error">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Badge>
              <IconButton color="inherit" onClick={handleProfileClick}>
                <AccountCircleIcon />
              </IconButton>
            </Stack>

            {/* Profile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileClose}
            >
              <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
              <MenuItem onClick={handleProfileClose}>Settings</MenuItem>
              <MenuItem onClick={handleProfileClose}>Logout</MenuItem>
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

        {/* Floating Actions */}
        <Fab
          color="primary"
          aria-label="refresh"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
          }}
          onClick={handleAddTestData}
        >
          <RefreshIcon />
        </Fab>
      </Box>
    </ThemeProvider>
  );
}

export default App;
