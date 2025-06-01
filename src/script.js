window.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("input");
  const locationText = document.getElementById("location-text");
  const conditionIcon = document.getElementById("condition-icon");
  const conditionText = document.getElementById("condition-text");
  const temperatureText = document.getElementById("temperature-text");
  const cloudText = document.getElementById("cloud-text");
  const humidityText = document.getElementById("humidity-text");
  const windText = document.getElementById("wind-text");
  const windDirectionText = document.getElementById("wind-direction-text");
  const forecastList = document.getElementById("forecast-list");

  const apiKey = "2784d2c98182467b98b212939241812";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function fetchWeatherData(location) {
    if (!location) return;

    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=no&alerts=yes`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data || !data.current || !data.location || !data.forecast) {
          throw new Error("Incomplete data received");
        }

        const { current, location, forecast } = data;

        // Update current weather info
        if (conditionIcon) conditionIcon.src = current.condition.icon;
        if (conditionText) conditionText.textContent = current.condition.text;
        if (locationText)
          locationText.textContent = `${location.name}, ${location.country}`;
        if (temperatureText)
          temperatureText.innerHTML = `${current.temp_c} &deg;C`;
        if (cloudText) cloudText.textContent = `${current.cloud}%`;
        if (humidityText) humidityText.textContent = `${current.humidity}%`;
        if (windText) windText.textContent = `${current.wind_kph} kp/h`;
        if (windDirectionText) windDirectionText.textContent = current.wind_dir;

        // Update forecast list
        if (forecast?.forecastday?.length > 0) {
          const content = forecast.forecastday.map((forecastDay) => {
            const { day, date } = forecastDay;
            const weekday = days[new Date(date).getDay()];

            return `
                        <div class="flex flex-col items-center gap-2 rounded-md border border-gray-200 w-full p-4 flex-shrink-0 snap-start snap-always">
                            <img src="${day.condition.icon}" alt="forecast-icon" class="w-[100px] h-[100px]">
                            <p class="text-xl font-medium">${day.condition.text}</p>
                            <p class="font-medium">${weekday}</p>
                            <p class="font-medium">${date}</p>
                            <p class="font-medium">${day.mintemp_c}&deg;C - ${day.maxtemp_c}&deg;C</p>
                        </div>
                        `;
          });
          forecastList.innerHTML = content.join("\n");
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error.message);
        alert(
          "Failed to fetch weather data. Please check your input or try again later."
        );
      });
  }

  // Initial fetch for default location
  fetchWeatherData("Dhaka");

  // Handle search input
  searchInput.addEventListener("change", (event) => {
    const value = event.target.value.trim();
    if (value) fetchWeatherData(value);
  });
});
