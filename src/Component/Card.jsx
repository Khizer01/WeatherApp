import React, { useEffect, useState } from 'react';

function Card({ query }) {
  const Api_key = process.env.REACT_APP_API_KEY;
  const [WeatherData, setData] = useState(null);
  const [ForecastData, setForecast] = useState([]);
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState(false);
  
  function groupForecastByDay(data) {
    const days = {};
  
    data.list.forEach(item => {
      const date = new Date(item.dt_txt).toISOString().split('T')[0]; 
      if (!days[date]) {
        days[date] = [];
      }
      days[date].push(item);
    });
  
    return Object.values(days).slice(0, 5); 
  }
  
  useEffect(() => {
    const fetchData = async (term) => {
      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${term}&units=metric&appid=${Api_key}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        
        if (weatherData.cod === '404') {
          setError(true);
          setData(null);
          setForecast([]);
          return;
        }
        
        setData(weatherData);

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${term}&units=metric&appid=${Api_key}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        if (forecastData.cod === '404') {
          setError(true);
          setForecast([]);
          return;
        }

        setForecast(groupForecastByDay(forecastData));
        setError(false);
      } catch (err) {
        setError(true);
        setData(null);
        setForecast([]);
      }
    };

    if (query) {
      fetchData(query);
    }
    
  }, [query]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); 
  }, []);

  if (error) {
    return (
      <div className='noReturn'>
        <div className='box'>
          <h3>No weather data found for the searched city.</h3>
        </div>
      </div>
    );
  }

  if (!WeatherData || !WeatherData.weather || WeatherData.weather.length === 0) {
    return (
      <div className='noReturn'>
        <div className='box'>
          <h3>Trying to fetch data.</h3>
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const { weather, main, wind, name, clouds } = WeatherData;
  const list = ForecastData.length > 0 ? ForecastData : [];
  const ConvertDate = (date) => {
    const day = new Date(date);
    return day.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <>
      <div className="weather-info">
        <div className="logo">
          <img src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`} alt="" style={{ width: "65px" }} />
          <div>{Math.floor(main.temp)}°</div>
        </div>
        <div className='name'>{name}</div>
        <div className='date'>{new Date().toLocaleDateString()} <span>{time.toLocaleTimeString()}</span></div>
      </div>
      <div className="container">
        <div className="right-container">
          <div className="weather-details">
            <h5>Weather Details</h5>
            <p>Feels Like: <span>{Math.floor(main.feels_like)} °C</span></p>
            <p>Cloudy: <span>{clouds.all} %</span></p>
            <p>Humidity: <span>{main.humidity} %</span></p>
            <p>Wind Speed: <span>{wind.speed} km/h</span></p>
            <p>Rain: <span>{WeatherData.rain ? WeatherData.rain['1h'] : 0} mm</span></p>
          </div>
          <hr className='hr' />
          <div className="forecast-cards">
            {list.map((items, index) => {
              const item = items[2]; 
              return (
              <div key={index} className="small-card">
                <div className="onHover-hide">
                <div className="day">{ConvertDate(item.dt_txt)}</div>
                <div className="icon">
                  <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt={item.weather[0].description} />
                </div>
                <div className="temp">{Math.floor(item.main.temp)}°C</div>
                </div>
                <div className="onHover-show">
                <div className="day">{ConvertDate(item.dt_txt)}</div>
                <div className="temp">{Math.floor(item.main.temp)}°C</div>
                <div className="weather">{(item.weather[0].description).toUpperCase()}</div>
                <div className="wind">Wind: {item.wind.speed} km/h</div>
                </div>
              </div>)
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
