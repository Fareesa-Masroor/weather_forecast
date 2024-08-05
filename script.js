const apikey = "2f43aef7f30a0de2d9f13735299e6009"
let lat = "";
let log = "";
// get the elements from html doc
const current = document.getElementById("current")
let searchString=""
// current location 
navigator.geolocation.getCurrentPosition(x=>{
    lat = x.coords.latitude
    log = x.coords.longitude
    // current day data
    const getCurrentData = ()=>{
        fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+log+"&appid=2f43aef7f30a0de2d9f13735299e6009")
        .then(resp => resp.json())
        .then(res =>
            displayCurrent(res)
        )
    }
   getCurrentData() 

    // forecast for upcoming 5 days
    const getExtendedData = ()=>{
        fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+log+"&appid=2f43aef7f30a0de2d9f13735299e6009")
        .then(resp => resp.json())
        .then(res =>
         displayExtendedData(res.list.filter(i=>i.dt_txt.includes("12:00:00")))
        )
    }
    getExtendedData() 

})

// display
function displayCurrent(x){
    let cityName = x.name;
    let kelvin = x.main.temp;
    let temp = kelvin-273 ;
    console.log(x.main.humidity)
    let windSpeed = x.wind.speed;
    let humidity = x.main.humidity;

    let displayCity = document.createElement("h3")
    displayCity.innerText ="City Name: "+ cityName
    current.appendChild(displayCity)

    let temperature = document.createElement("p")
    temperature.innerText ="Temperature: "+ temp.toFixed(1)
    current.appendChild(temperature)

    let wind = document.createElement("p")
    wind.innerText ="Wind Speed: "+ windSpeed
    current.appendChild(wind)

    let humid = document.createElement("p")
    humid.innerText ="Humidity: "+ humidity
    current.appendChild(humid)

}

function displayExtendedData(data){

   let extended = document.getElementById("Extended")

    for(let i = 0; i<data.length; i++){
       const icon = data[i].weather[0].icon
       const weather = data[i].weather[0].main
       
       // card
        card = document.createElement("div")
        card.className = ''
        card.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${weather}" class="w-16 h-16 mx-auto">`
        
        // temp
        temp = document.createElement("p")
        temp.innerText= "Temperature "+(data[i].main.temp-273).toFixed(2)
        card.appendChild(temp)

        // humidity
        humid = document.createElement("p")
        humid.innerText= "Humidity "+ (data[i].main.humidity)
        card.appendChild(humid)

        // wind
        wind = document.createElement("p")
        wind.innerText="wind Speed "+ (data[i].wind.speed)
        card.appendChild(wind)

        extended.appendChild(card)
    }
}

// try local storage

// localStorage.setItem('username', 'JohnDoe');
// const username = localStorage.getItem('username');
// console.log(username);

// localStorage.removeItem('username');

// localStorage.clear();

// get and write the input into local storage
let searchResults = document.getElementById('search-results');
let button = document.querySelector('button[type="submit"]');

// CREATING an array to store all data searched we need to first retrieve and then write
let history = JSON.parse(localStorage.getItem('history')) || [];

button.addEventListener('click', () => {
    searchString = document.getElementById("searchString").value.trim();
    if (searchString) {
        history.push(searchString);
        fetchWeatherByCity(searchString);
        localStorage.setItem('history', JSON.stringify(history));
    }
});

// Display data by city name
function fetchWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                console.log("Sending data to display");
                displayWeather(data);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayWeather(params) {
    // Clear previous search result
    searchResults.innerHTML = '';

    let city_temp = params.list[0].main.temp;
    let city_humid = params.list[0].main.humidity;
    let city_icon = params.list[0].weather[0].icon;
    let desc = params.list[0].weather[0].description;

    let searchedData = document.createElement("div");
    searchedData.innerHTML = `
        <h2>${searchString}</h2>
        <p class="text-lg">${city_temp} °C</p>
        <p class="text-gray-600">${desc}</p>
        <img src="https://openweathermap.org/img/wn/${city_icon}@2x.png" class="w-16 h-16 mx-auto">
        <p class="text-gray-600">Humidity: ${city_humid}%</p>
    `;
    searchResults.append(searchedData);
}
