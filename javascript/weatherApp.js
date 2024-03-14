// Define a constant for the API username
const API_USERNAME = "mtuna";

// Define a function to initialize the application
const init = () => {
  // Select the button element with id "getWeather"
  const weatherButton = document.querySelector("#getWeather");
  // Add a click event listener to the button that calls the getLocation function
  weatherButton.addEventListener("click", getLocation);
};

// Define a function to convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius) => {
  // Perform the conversion
  const fahrenheit = (celsius * 9) / 5 + 32;
  // Return the result
  return fahrenheit;
};

// Define a function to convert wind speed from knots to mph
const knotsToMph = (knots) => {
  // Perform the conversion
  const mph = knots * 1.151;
  // Return the result
  return mph;
};

// Define a function to add HTML elements to display weather data
const addHtmlElements = (temperature, windSpeed, city) => {
  // Select the container element with id "weatherData"
  const container = document.getElementById("weatherData");
  // Clear any existing content in the container
  container.innerHTML = "";

  // Create a div element for the city name
  const cityDiv = document.createElement("div");
  // Set the text content of the div
  cityDiv.textContent = "City: " + city;
  // Append the div to the container
  container.appendChild(cityDiv);

  // Create a div element for the temperature
  const tempDiv = document.createElement("div");
  // Convert the temperature to Fahrenheit
  const convertedTemperature = celsiusToFahrenheit(temperature);
  // Create a string to display the temperature
  let tempText = "Temp: " + convertedTemperature + "°F ";

  // Add an icon depending on the temperature
  if (convertedTemperature <= 34) {
    tempText += '<i class="bi bi-thermometer-snow"></i>';
  } else if (convertedTemperature >= 83) {
    tempText += '<i class="bi bi-thermometer-sun"></i>';
  }

  // Set the HTML content of the temperature div
  tempDiv.innerHTML = tempText;
  // Append the div to the container
  container.appendChild(tempDiv);

  // Create a div element for the wind speed
  const windDiv = document.createElement("div");
  // Create a string to display the wind speed in knots
  const windSpeedKnotsText = "Wind Speed (knots): " + windSpeed;
  // Create a string to display the wind speed in mph
  const windSpeedMphText = "Wind Speed (mph): " + knotsToMph(windSpeed);

  // Add an icon if the wind speed is high (in knots)
  if (windSpeed > 15) {
    windSpeedKnotsText += ' <i class="bi bi-wind"></i>';
  }

  // Add an icon if the wind speed is high (in mph)
  if (knotsToMph(windSpeed) > 15) {
    windSpeedMphText += ' <i class="bi bi-wind"></i>';
  }

  // Set the HTML content of the wind div
  windDiv.innerHTML = windSpeedKnotsText + "<br>" + windSpeedMphText;
  // Append the div to the container
  container.appendChild(windDiv);
};

// Define a function to get the weather data for a given location
const getWeather = (lat, lng, city) => {
  // Construct the API URL
  let url = `http://api.geonames.org/findNearByWeatherJSON?username=${API_USERNAME}&lat=${lat}&lng=${lng}`;

  if (lat && lng) {
    // Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();

    // Configure the XMLHttpRequest with the HTTP method and URL
    xhr.open("get", url);

    // Define the function to handle the XMLHttpRequest state changes
    xhr.onreadystatechange = () => {
      // Check if the request is complete
      if (xhr.readyState == 4) {
        // Parse the JSON response
        const data = JSON.parse(xhr.responseText);
        // Extract the temperature in Celsius and wind speed in knots from the response
        const temperatureCelsius = data.weatherObservation.temperature;
        const windSpeedKnots = data.weatherObservation.windSpeed;

        // Call the function to add HTML elements for the weather data
        addHtmlElements(temperatureCelsius, windSpeedKnots, city);
      }
    };

    // Send the XMLHttpRequest
    xhr.send(null);
  }
};

// Define a function to get the location data for a given postal code
const getLocation = () => {
  // Select the input element with id "zipCode"
  const zipCodeInput = document.querySelector("#zipCode");
  // Get the value of the input
  const zipCodeValue = zipCodeInput.value;

  // Construct the API URL
  let url = `http://api.geonames.org/postalCodeSearchJSON?username=${API_USERNAME}&postalcode=${zipCodeValue}`;

  // Create a new XMLHttpRequest object
  let xhr = new XMLHttpRequest();

  // Configure the XMLHttpRequest with the HTTP method and URL
  xhr.open("get", url);

  // Define the function to handle the XMLHttpRequest state changes
  xhr.onreadystatechange = () => {
    // Check if the request is complete
    if (xhr.readyState == 4) {
      // Parse the JSON response
      const data = JSON.parse(xhr.responseText);
      // Extract the latitude, longitude, and city name from the response
      const lat = data.postalCodes[0].lat;
      const lng = data.postalCodes[0].lng;
      const city = data.postalCodes[0].placeName;
      // Call the function to get the weather data for the location
      getWeather(lat, lng, city);
    }
  };

  // Send the XMLHttpRequest
  xhr.send(null);
};

// Add an event listener to call the init function when the window loads
window.onload = init;
