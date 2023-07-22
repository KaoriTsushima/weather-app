function currentDate() {
  const current = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[current.getDay()];
  const date = current.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[current.getMonth()];
  const year = current.getFullYear();
  const todayDate = `${day} ${date} ${month} ${year}`;
  return todayDate;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

const today = document.querySelector("#current-date");
today.innerHTML = currentDate();

function displayForecast(response) {
  let forecast = response.data.daily;
  const forecastElement = document.querySelector("#forecast");
  //const days = ["Thu", "Fri", "Sat", "Sun", "Mon"];
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
         <div class="col">
          <div class="date"><h5>${formatDay(forecastDay.time)}</h5></div>
          <span class="weather-icon"><img src="${
            forecastDay.condition.icon_url
          }" /></span>
          <div class="high-low"><span class="bold">H:${Math.round(
            forecastDay.temperature.maximum
          )}°</span> L:${Math.round(forecastDay.temperature.minimum)}°</div>
        </div>
        `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function showTime() {
  const currentTime = new Date();
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const second = currentTime.getSeconds();
  function padTime(time) {
    return String(time).padStart(2, "0");
  }
  return `${padTime(hour)}:${padTime(minute)}:${padTime(second)}`;
}

function updateTime() {
  const timenow = document.querySelector("#current-time");
  timenow.innerHTML = showTime();
}

//week5 homework
//const apiKey = "bf54175800a55e59e6c4d6461deeef12";
const apiKey = "9c350f182b3bcf281a5dbac65ff4ot92";

function updateWeather(response, cityName) {
  displayForecast(response);
  const cTemp = Math.round(response.data.daily[0].temperature.day);
  const tempMin = Math.round(response.data.daily[0].temperature.minimum);
  const tempMax = Math.round(response.data.daily[0].temperature.maximum);
  const humidity = Math.round(response.data.daily[0].temperature.humidity);
  const wind = Math.round(response.data.daily[0].wind.speed);
  const weather = response.data.daily[0].condition.description;
  const weatherIcon = response.data.daily[0].condition.icon;
  const location = cityName || response.data.city;

  const currentCityName = document.querySelector("#main-city-name");
  currentCityName.innerHTML = `${location}`;
  const currentTemp = document.querySelector("#temp");
  currentTemp.innerHTML = `${cTemp}`;

  const maxMinTemp = document.querySelector(".main-city-high-low");
  maxMinTemp.innerHTML = `H:${tempMax}° L:${tempMin}°`;
  const mainWeather = document.querySelector("#main-weather");
  mainWeather.innerHTML = `${weather}`;
  const currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = `Humidity: ${humidity}%`;
  const windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Wind: ${wind}mph`;
  const weatherIconElement = document.querySelector("#main-weather-icon");
  const iconUrl = `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${weatherIcon}.png`;
  weatherIconElement.innerHTML = `
    <img height="200px" src="${iconUrl}"/>
    `;
}

function currentPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateWeather);
}

function currentCity(event) {
  if (event) {
    event.preventDefault();
  }
  navigator.geolocation.getCurrentPosition(currentPosition);
}

const currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", currentCity);

const searchCity = document.querySelector("#input-city");
const changeButton = document.querySelector("#change-city");

function changeCityInfo(response) {
  const changeLat = response.data.coordinates.latitude;
  const changeLon = response.data.coordinates.longitude;
  const cityName = response.data.city;
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${changeLon}&lat=${changeLat}&key=${apiKey}&units=metric`;

  function updateWeatherAndCity(response) {
    updateWeather(response, cityName);
  }
  axios.get(apiUrl).then(updateWeatherAndCity);
}
function changeCity(event) {
  event.preventDefault();
  const city = searchCity.value;
  const getLatLonUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  axios.get(getLatLonUrl).then(changeCityInfo);
}
changeButton.addEventListener("click", changeCity);

currentCity();
updateTime();
setInterval(updateTime, 1000);
