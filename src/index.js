function currentDate() {
  let current = new Date();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[current.getDay()];
  let date = current.getDate();
  let months = [
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
  let month = months[current.getMonth()];
  let year = current.getFullYear();
  let todayDate = `${day} ${date} ${month} ${year}`;
  return todayDate;
}

let today = document.querySelector("#current-date");
today.innerHTML = currentDate();

function showTime() {
  let currentTime = new Date();
  let hour = currentTime.getHours();
  let minute = currentTime.getMinutes();
  let second = currentTime.getSeconds();
  let makeTime = `${hour}:${minute}:${second}`;
  return makeTime;
}
let timenow = document.querySelector("#current-time");
timenow.innerHTML = showTime();

function convertToF(t) {
  return Math.round((t * 9) / 5 + 32);
}

//week5 homework
let apiKey = "bf54175800a55e59e6c4d6461deeef12";
let cTemp = 17;
let fTemp = convertToF(cTemp);

function updateWeather(response, cityName) {
  cTemp = Math.round(response.data.main.temp);
  fTemp = convertToF(cTemp);
  let tempMin = Math.round(response.data.main.temp_min);
  let tempMax = Math.round(response.data.main.temp_max);
  let humidity = Math.round(response.data.main.humidity);
  let wind = Math.round(response.data.wind.speed);
  let weather = response.data.weather[0].main;
  let weatherIcon = response.data.weather[0].icon;
  let location = cityName || response.data.name;

  let currentCityName = document.querySelector("#main-city-name");
  currentCityName.innerHTML = `${location}`;
  // let currentTemp = document.querySelector("#temp");
  // currentTemp.innerHTML = `${cTemp}`;
  changeToC();
  let maxMinTemp = document.querySelector(".main-city-high-low");
  maxMinTemp.innerHTML = `H:${tempMax}° L:${tempMin}°`;
  let mainWeather = document.querySelector("#main-weather");
  mainWeather.innerHTML = `${weather}`;
  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = `Humidity: ${humidity}%`;
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Wind: ${wind}mph`;
  let weatherIconElement = document.querySelector("#main-weather-icon");
  let iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  weatherIconElement.innerHTML = `
    <img height="200px" src="${iconUrl}"/>
    `;
}

function currentPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(updateWeather);
}

function currentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentPosition);
}

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", currentCity);

let searchCity = document.querySelector("#input-city");
let changeButton = document.querySelector("#change-city");

function changeCityInfo(response) {
  let changeLat = response.data[0].lat;
  let changeLon = response.data[0].lon;
  let cityName = response.data[0].name;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${changeLat}&lon=${changeLon}&appid=${apiKey}&units=metric`;

  function updateWeatherAndCity(response) {
    updateWeather(response, cityName);
  }
  axios.get(apiUrl).then(updateWeatherAndCity);
}
function changeCity(event) {
  event.preventDefault();
  let city = searchCity.value;
  let getLatLonUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
  axios.get(getLatLonUrl).then(changeCityInfo);
}
changeButton.addEventListener("click", changeCity);

//change C to F, F to C
//let fakeTemp = 17;

let cTempElement = document.querySelector("#cTemp");
let fTempElement = document.querySelector("#fTemp");

function changeToC() {
  cTempElement.classList.add("big");
  fTempElement.classList.remove("big");
  let temp = document.querySelector("#temp");
  temp.innerHTML = cTemp;
}

function changeToF() {
  cTempElement.classList.remove("big");
  fTempElement.classList.add("big");

  let temp = document.querySelector("#temp");
  temp.innerHTML = fTemp;
}

cTempElement.addEventListener("click", changeToC);
fTempElement.addEventListener("click", changeToF);

// create forecast loop
function displayForecast() {
  let forecastElement = document.querySelector("#forecast");
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon"];
  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
<div class="col">
          <div class="date"><h5>${day}</h5></div>
          <span class="weather-icon"><i class="fa-solid fa-cloud"></i></span>
          <div class="higt-low"><span class="bold">H:18°</span> L:10°</div>
        </div>
        `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

displayForecast();
