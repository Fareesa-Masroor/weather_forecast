const apikey = "2f43aef7f30a0de2d9f13735299e6009"
let lat = "";
let log = "";
// get the elements from html doc
const current = document.getElementById("current")

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
    console.log(data)
   let extended = document.getElementById("Extended")
   console.log()
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

