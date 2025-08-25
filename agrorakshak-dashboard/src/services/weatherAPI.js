const API_KEY = '078b236399fab6413b08d248a817684c'; // Get free API key from openweathermap.org
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Default coordinates for Mumbai (replace with your project location)
const DEFAULT_LAT = 19.0760;
const DEFAULT_LON = 72.8777;

export const getWeatherData = async (lat = DEFAULT_LAT, lon = DEFAULT_LON) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
};

export const getCurrentWeather = async (lat = DEFAULT_LAT, lon = DEFAULT_LON) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Current weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Current weather API error:', error);
    return null;
  }
};

// Mock weather data for testing without API key
export const getMockWeatherData = () => {
  return {
    current: {
      temp: 28.5,
      description: 'partly cloudy',
      humidity: 72,
      wind_speed: 3.2
    },
    forecast: [
      { date: 'Today', temp: 28, rain: false },
      { date: 'Tomorrow', temp: 30, rain: true },
      { date: 'Day 3', temp: 26, rain: false }
    ],
    nextRain: 'Tomorrow evening'
  };
};
