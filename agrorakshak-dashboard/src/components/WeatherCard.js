import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Alert, Box, CircularProgress } from '@mui/material';
import { getCurrentWeather, getWeatherData, getMockWeatherData } from '../services/weatherAPI';

const WeatherCard = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [nextRain, setNextRain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        
        // Try to get real weather data
        const current = await getCurrentWeather();
        const forecastData = await getWeatherData();
        
        if (current && forecastData) {
          setCurrentWeather(current);
          setForecast(forecastData);
          
          // Find next rainfall
          const rainForecast = forecastData.list?.find(
            item => item.weather[0].main.toLowerCase().includes('rain')
          );
          setNextRain(rainForecast);
          setError(false);
        } else {
          // Use mock data if API fails
          const mockData = getMockWeatherData();
          setCurrentWeather({
            main: { temp: mockData.current.temp, humidity: mockData.current.humidity },
            weather: [{ description: mockData.current.description }],
            wind: { speed: mockData.current.wind_speed }
          });
          setNextRain(mockData.nextRain);
          setError(true);
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        // Use mock data on error
        const mockData = getMockWeatherData();
        setCurrentWeather({
          main: { temp: mockData.current.temp, humidity: mockData.current.humidity },
          weather: [{ description: mockData.current.description }],
          wind: { speed: mockData.current.wind_speed }
        });
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    // Refresh every hour
    const interval = setInterval(fetchWeatherData, 3600000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%', bgcolor: 'white', boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', bgcolor: 'white', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
          🌤️ Weather Conditions
        </Typography>
        
        {error && (
          <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
            Using demo weather data - Add OpenWeatherMap API key for live data
          </Alert>
        )}
        
        {currentWeather && (
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Current Temperature</Typography>
                <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  {currentWeather.main.temp.toFixed(1)}°C
                </Typography>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {currentWeather.weather[0].description}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Humidity</Typography>
                <Typography variant="h5" sx={{ color: 'info.main' }}>
                  {currentWeather.main.humidity}%
                </Typography>
                <Typography variant="body2" color="text.secondary">Wind Speed</Typography>
                <Typography variant="body2">
                  {currentWeather.wind.speed} m/s
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {nextRain && typeof nextRain === 'object' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Next Rainfall:</strong> {formatDate(nextRain.dt)}
            </Typography>
            <Typography variant="caption">
              Expected: {nextRain.weather[0].description}
            </Typography>
          </Alert>
        )}
        
        {nextRain && typeof nextRain === 'string' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Next Rainfall:</strong> {nextRain}
            </Typography>
          </Alert>
        )}
        
        {!nextRain && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              No rain expected in the forecast period
            </Typography>
          </Alert>
        )}
        
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date().toLocaleTimeString('en-IN')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
