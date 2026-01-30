const getWeather = async (lat = 30.047, lon = 31.233) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Weather API error");
  }
  const data = await response.json();
  return data.current || null;
};

module.exports = { getWeather };
