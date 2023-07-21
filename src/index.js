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

const today = document.querySelector("#current-date");
today.innerHTML = currentDate();

function showTime() {
  const currentTime = new Date();
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const second = currentTime.getSeconds();
  const makeTime = `${hour}:${minute}:${second}`;
  return makeTime;
}
const timenow = document.querySelector("#current-time");
timenow.innerHTML = showTime();

//week5 homework
const apiKey = "bf54175800a55e59e6c4d6461deeef12";

function updateWeather(response, cityName) {
  const cTemp = Math.round(response.data.main.temp);
  const tempMin = Math.round(response.data.main.temp_min);
  const tempMax = Math.round(response.data.main.temp_max);
  const humidity = Math.round(response.data.main.humidity);
  const wind = Math.round(response.data.wind.speed);
  const weather = response.data.weather[0].main;
  const weatherIcon = response.data.weather[0].icon;
  const location = cityName || response.data.name;

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
  const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  weatherIconElement.innerHTML = `
    <img height="200px" src="${iconUrl}"/>
    `;
}

function currentPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(updateWeather);
}

function currentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentPosition);
}

const currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", currentCity);

const searchCity = document.querySelector("#input-city");
const changeButton = document.querySelector("#change-city");

function changeCityInfo(response) {
  const changeLat = response.data[0].lat;
  const changeLon = response.data[0].lon;
  const cityName = response.data[0].name;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${changeLat}&lon=${changeLon}&appid=${apiKey}&units=metric`;

  function updateWeatherAndCity(response) {
    updateWeather(response, cityName);
  }
  axios.get(apiUrl).then(updateWeatherAndCity);
}
function changeCity(event) {
  event.preventDefault();
  const city = searchCity.value;
  const getLatLonUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
  axios.get(getLatLonUrl).then(changeCityInfo);
}
changeButton.addEventListener("click", changeCity);

// create forecast loop
function displayForecast() {
  const forecastElement = document.querySelector("#forecast");
  const days = ["Thu", "Fri", "Sat", "Sun", "Mon"];
  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
        <div class="col">
          <div class="date"><h5>${day}</h5></div>
          <span class="weather-icon"><i class="fa-solid fa-cloud"></i></span>
          <div class="high-low"><span class="bold">H:18°</span> L:10°</div>
        </div>
        `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

displayForecast();
