// my api key, lat log variable initailization
const apikey = "2f43aef7f30a0de2d9f13735299e6009";
let lat = "";
let log = "";
const current = document.getElementById("current");
let searchString = "";

const recentCities = document.getElementById("recentCities");

// Get current location using Geolocation API
navigator.geolocation.getCurrentPosition(x => {
    lat = x.coords.latitude;
    log = x.coords.longitude;
    getCurrentData();
    getExtendedData();
});

// Fetch current weather data for the current location
const getCurrentData = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=${apikey}`)
        .then(response => response.json())
        .then(data => displayCurrent(data))
        .catch(error => displayError('Error fetching current weather data: ' + error.message));
};
// Fetch extended weather forecast data for the current location
const getExtendedData = () => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${log}&appid=${apikey}`)
        .then(response => response.json())
        .then(data => displayExtendedData(data.list.filter(item => item.dt_txt.includes("12:00:00"))))
        .catch(error => displayError('Error fetching extended forecast data: ' + error.message));
};
// Fetch and display weather by city name
const fetchWeatherByCity = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                displayWeather(data);
            } else {
                displayError(data.message);
            }
        })
        .catch(error => displayError('Error fetching weather data: ' + error.message));
};
// Update the dropdown menu with recently searched cities
const updateDropdown = () => {
    recentCities.innerHTML = '<option value="" disabled selected>Select a recently searched city</option>';
    history.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        recentCities.appendChild(option);
    });
    recentCities.classList.remove('hidden');
};

// Handle search button click
document.getElementById('searchButton').addEventListener('click', () => {
    searchString = document.getElementById("searchString").value.trim();
    if (searchString) {
        if (!history.includes(searchString)) {
            history.push(searchString);
        }
        fetchWeatherByCity(searchString);
        localStorage.setItem('history', JSON.stringify(history));
        updateDropdown();
    } else {
        displayError('Please enter a city name.');
    }
});

// Handle dropdown selection
recentCities.addEventListener('change', (event) => {
    const city = event.target.value;
    fetchWeatherByCity(city);
});

// Display current weather data
function displayCurrent(x) {
    current.innerHTML = ""; // Clear previous data
    let cityName = x.name;
    let temp = (x.main.temp - 273).toFixed(0); // Convert from Kelvin to Celsius
    let windSpeed = x.wind.speed;
    let humidity = x.main.humidity;
    let description = x.weather[0].description;
    let iconSrc = x.weather[0].icon;

    let displayCity = document.createElement("h3");
    displayCity.className = "text-xl font-bold";
    displayCity.innerHTML = `City Name: <span>${cityName}</span>`;
    current.appendChild(displayCity);

    let temperature = document.createElement("p");
    temperature.className = "text-5xl font-semibold";
    temperature.innerHTML = `<span>${temp}</span>°C`;
    current.appendChild(temperature);

    let desc = document.createElement("p");
    desc.className = "text-gray-600";
    desc.innerText = description;
    current.appendChild(desc);

    let iconDiv = document.createElement("div");
    iconDiv.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconSrc}@2x.png" alt="" class="w-16 h-16 mx-auto">`
    current.appendChild(iconDiv);

    let humid = document.createElement("p");
    humid.className = "text-gray-600";
    humid.innerHTML = `Humidity: <span>${humidity}</span>%`;
    current.appendChild(humid);

    let wind = document.createElement("p");
    wind.className = "text-gray-600";
    wind.innerHTML = `Wind Speed: <span>${windSpeed}</span> km/h`;
    current.appendChild(wind);
}

// Display extended weather forecast data
function displayExtendedData(data) {
    let extended = document.getElementById("Extended");

    for (let i = 0; i < data.length; i++) {
        const icon = data[i].weather[0].icon;
        const weather = data[i].weather[0].main;
        const date = data[i].dt_txt.slice(0,10);

        // Create forecast card
        let card = document.createElement("div");
        card.className = 'bg-white p-4 rounded-lg shadow-md';
        card.innerHTML = `
        <h1 class="text-xl bold">${date}</h1>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${weather}" class="w-16 h-16 mx-auto">`;

        // Temperature
        let temp = document.createElement("p");
        temp.innerText = "Temperature: " + (data[i].main.temp - 273).toFixed(2) + "°C";
        card.appendChild(temp);

        // Humidity
        let humid = document.createElement("p");
        humid.innerText = "Humidity: " + data[i].main.humidity + "%";
        card.appendChild(humid);

        // Wind speed
        let wind = document.createElement("p");
        wind.innerText = "Wind Speed: " + data[i].wind.speed + " km/h";
        card.appendChild(wind);

        extended.appendChild(card);
    }
}

// Initialize the dropdown with stored history
let history = JSON.parse(localStorage.getItem('history')) || [];
if (history.length > 0) {
    updateDropdown();
}

// Show search results and hide current weather when searching
document.getElementById('searchButton').addEventListener('click', function() {
    document.getElementById('searchResults').classList.remove('hidden');
    document.getElementById('current').classList.add('hidden');
});

// Show current weather when a city is selected from the dropdown
recentCities.addEventListener('change', function() {
    document.getElementById('current').classList.remove('hidden');
    document.getElementById('searchResults').classList.add('hidden');
});

// Display weather for searched city
function displayWeather(params) {
    let searchResults = document.getElementById("searchResults");
    searchResults.className = 'text-center p-4';

    // Clear previous search result
    searchResults.innerHTML = '';

    let city_temp = params.list[0].main.temp;
    let city_humid = params.list[0].main.humidity;
    let city_icon = params.list[0].weather[0].icon;
    let desc = params.list[0].weather[0].description;

    let searchedData = document.createElement("div");

    searchedData.innerHTML = `
        <h2 class="text-5xl">${params.city.name}</h2>
        <p class="text-lg">${city_temp} °C</p>
        <p class="text-gray-600">${desc}</p>
        <img src="https://openweathermap.org/img/wn/${city_icon}@2x.png" class="w-16 h-16 mx-auto">
        <p class="text-gray-600">Humidity: ${city_humid}%</p>
    `;
    searchResults.append(searchedData);
}

// Display error messages within the UI
const displayError = (message) => {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2';
    errorContainer.innerHTML = `<strong class="font-bold">Error:</strong> <span class="block sm:inline">${message}</span>`;
    document.getElementById('searchResults').appendChild(errorContainer);
};
