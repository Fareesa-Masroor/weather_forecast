# Weather Forecast Application

🔗link for the project https://fareesa-masroor.github.io/weather_forecast/


![Weather Forecast Background](https://github.com/Fareesa-Masroor/weather_forecast/blob/main/assets/desktop.png)

## Project Setup

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2. Navigate to the project directory:
    ```bash
    cd weather-forecast-app
    ```

3. Open `index.html` in a web browser.

## Features

- Search weather by city name
- Get weather for the current location
- Display current weather conditions
- Show extended 5-day weather forecast
- Dropdown menu for recently searched cities

## Technologies Used

- HTML
- Tailwind CSS
- JavaScript
- OpenWeatherMap API

## Usage

1. **Search by City Name**: Enter a city name in the search bar and click "Search". The current weather and 5-day forecast will be displayed.
2. **Current Location Weather**: The application will automatically fetch and display weather data for your current location.
3. **Recently Searched Cities**: Select a city from the dropdown to quickly view its weather data.

## API Key

The application uses the OpenWeatherMap API. Replace the `apikey` variable in `script.js` with your API key:

```javascript
const apikey = "YOUR_API_KEY";

