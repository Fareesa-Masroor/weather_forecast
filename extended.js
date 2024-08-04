const apiKey = "2f43aef7f30a0de2d9f13735299e6009";
const recentSearchesKey = "recentSearches";

// Elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const recentSearchesList = document.getElementById('recent-searches-list');
const weatherContainer = document.getElementById('weather-container');

// Event Listeners
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
        updateRecentSearches(city);
    } else {
        alert('Please enter a city name');
    }
});

recentSearchesList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const city = event.target.textContent;
        fetchWeatherByCity(city);
    }
});

// Fetch Weather Data by City
function fetchWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                displayWeather(data);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Fetch Weather Data by Current Location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByLocation(lat, lon);
        },
        (error) => console.error('Error getting location:', error)
    );
} else {
    console.error('Geolocation is not supported by this browser.');
}

function fetchWeatherByLocation(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => console.error('Error fetching weather data:', error));
}

// Display Weather Data
function displayWeather(data) {
    weatherContainer.innerHTML = ''; // Clear previous data
    const forecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const temp = forecast.main.temp;
        const weather = forecast.weather[0].main;
        const icon = forecast.weather[0].icon;
        const windSpeed = forecast.wind.speed;
        const humidity = forecast.main.humidity;

        const weatherCard = document.createElement('div');
        weatherCard.className = 'bg-white p-4 rounded shadow';

        weatherCard.innerHTML = `
            <h2 class="text-xl font-bold">${date.toDateString()}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${weather}" class="w-16 h-16 mx-auto">
            <p class="text-lg">${temp} °C</p>
            <p class="text-gray-600">${weather}</p>
            <p class="text-gray-600">Wind: ${windSpeed} m/s</p>
            <p class="text-gray-600">Humidity: ${humidity}%</p>
        `;

        weatherContainer.appendChild(weatherCard);
    });
}

// Update Recent Searches
function updateRecentSearches(city) {
    let recentSearches = JSON.parse(localStorage.getItem(recentSearchesKey)) || [];
    if (!recentSearches.includes(city)) {
        recentSearches.push(city);
        if (recentSearches.length > 5) {
            recentSearches.shift(); // Keep only the latest 5 searches
        }
        localStorage.setItem(recentSearchesKey, JSON.stringify(recentSearches));
        displayRecentSearches();
    }
}

// Display Recent Searches
function displayRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem(recentSearchesKey)) || [];
    recentSearchesList.innerHTML = '';

    if (recentSearches.length > 0) {
        recentSearches.forEach(city => {
            const listItem = document.createElement('li');
            listItem.className = 'p-2 hover:bg-gray-200 cursor-pointer';
            listItem.textContent = city;
            recentSearchesList.appendChild(listItem);
        });
        recentSearchesList.classList.remove('hidden');
    } else {
        recentSearchesList.classList.add('hidden');
    }
}

// Initial display of recent searches on page load
displayRecentSearches();
