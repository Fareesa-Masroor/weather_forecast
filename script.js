// my api key, lat log variable initailization
const apikey = "2f43aef7f30a0de2d9f13735299e6009";
let lat = "";
let log = "";
const current = document.getElementById("current");
let searchString = "";

const recentCities = document.getElementById("recentCities");

// current location 
navigator.geolocation.getCurrentPosition(x => {
    lat = x.coords.latitude;
    log = x.coords.longitude;
    getCurrentData();
    getExtendedData();
});

const getCurrentData = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=${apikey}`)
        .then(resp => resp.json())
        .then(res => displayCurrent(res));
};

const getExtendedData = () => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${log}&appid=${apikey}`)
        .then(resp => resp.json())
        .then(res => displayExtendedData(res.list.filter(i => i.dt_txt.includes("12:00:00"))));
};

// Fetch and display weather by city name
const fetchWeatherByCity = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                displayWeather(data);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
};

// Update the dropdown menu
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
    }
});

// Handle dropdown selection
recentCities.addEventListener('change', (event) => {
    const city = event.target.value;
    fetchWeatherByCity(city);
});

// Display functions (current weather and extended forecast)
function displayCurrent(x) {
    const current = document.getElementById("current");
    current.innerHTML = ""; // Clear previous data
    let cityName = x.name;
    let temp = (x.main.temp - 273).toFixed(0);
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

function displayExtendedData(data) {
    let extended = document.getElementById("Extended");

    for (let i = 0; i < data.length; i++) {
        const icon = data[i].weather[0].icon;
        const weather = data[i].weather[0].main;
        const date = data[i].dt_txt.slice(0,10)
        console.log(data[i].dt_txt.slice(0,10))
        // card
        let card = document.createElement("div");
        card.className = '';
        card.innerHTML = `
        <h1 class="text-xl bold" >${date}</h1>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${weather}" class="w-16 h-16 mx-auto">`

        // temp
        let temp = document.createElement("p");
        temp.innerText = "Temperature " + (data[i].main.temp - 273).toFixed(2);
        card.appendChild(temp);

        // humidity
        let humid = document.createElement("p");
        humid.innerText = "Humidity " + (data[i].main.humidity);
        card.appendChild(humid);

        // wind
        let wind = document.createElement("p");
        wind.innerText = "Wind Speed " + (data[i].wind.speed);
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

// Display weather function (existing)
function displayWeather(params) {
    let searchResults = document.getElementById("searchResults");
    searchResults.className = 'text-center p-4';
    console.log(params);
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
