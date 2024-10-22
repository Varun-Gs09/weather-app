const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sun-rise"),
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status");
   
let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";


//update Date Time

function getDateTime() {
    let now = new Date(),
    hour = now.getHours(),
        minute = now.getMinutes();
     
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "saturday",
    ];
    //12 hour format
    hours = hours % 12;
    if(hour < 10) {
        hour = "0" + hour
    }
    if (minute < 10) {
        minute = "0"+ minute
        }

        let dayString = days[now.getDay()];
        return `${dayString}, ${hour}:${minute}`;
}

Date.innerText = getDateTime();
//update time every second
setInterval(()=>{
    date.innerText = getDateTime();
}, 1000);

//function to get public ip with fetch

function getPublicIp() {
    fetch("https://geolocation-db.com/json/" ,{
        method:"GET",
    })
    .then((response)=>response.json())
        .then((data)=> {
            console.log(data);
            currentCity = data.currentCity;
            getWeatherData(data.city , currentUnit , hourlyorWeek);
        });
}
getPublicIp();

//function to get weather data

function getWeatherData (city, unit, hourlyorWeek) {
    // const apiKey = "EJ6UBL2JEQGYB3AA4ENASN62J";
    fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/$%7Bcity%7D?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`,
        {
            method: "GET",
        }
        )
            .then((response) => response.json())
            .then((data) =>{
                let today = data.currentConditions;
                if(unit == "c") {
                    temp.innerText = today.temp;
                } else {
                    temp.innerText = celciusToFahrenheit(today.temp);
                }
                currentLocation.innerText = data.resolvedAddress;
                condition.innerText = today.conditions;
                rain.innerText = "perc - " + today.precip + "%";
                uvIndex.innerText = today.uvindex;
                windSpeed.innerText = today.windspeed;
                humidity.innerText = today.humidity + "%";
                visibility.innerText = today.visibility;
                airQuality.innerText = today.winddir;
                measureUvIndex(today.uvindex);
                updateHumidityStatus(today.humidity);
                updateVisibilityStatus(today.visibility);
                updateAirQualityStatus(today.winddir);
                sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
                sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
            });
}

//convert celcius to fahrenheit

function celciusToFahrenheit(temp){ 
    return ((temp*9)/5+ 32).toFixed(1);
}

//function to get uv index status

function measureUvIndex(uvIndex) {
    if(uvIndex <= 2) {
        uvText.innerText = "Low";
    } else if(uvIndex <= 5) {
        uvText.innerText = "Moderate";
    } else if(uvIndex <= 7) {
        uvText.innerText = "High";
    } else if(uvIndex <= 10) {
        uvText.innerText = "Very High";
    } else {
        uvIndex.innerText = "Extreme";
    }
}

function updateHumidityStatus(humidity) {
    if(humidity <= 30) {
        humidityStatus.innerText = "Low";
    } else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate";
    } else {
        humidityStatus.innerText = "High";
    }
}

function updateVisibilityStatus(visibility) {
    if(visibility <= 0.3) {
        visibilityStatus.innerText = "Dense Fog";
    } else if(visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate Fog";
    } else if(visibility <= 0.35) {
        visibilityStatus.innerText = "Light Fog";
    } else if(visibility <= 1.13) {
        visibilityStatus.innerText = "Very Light Fog";
    } else if(visibility <= 2.16) {
        visibilityStatus.innerText = "Light Mist";
    } else if(visibility <= 5.4) {
        visibilityStatus.innerText = "Very Light Mist";
    } else if(visibility <= 10.8) {
        visibilityStatus.innerText = "Clear Air";
    } else if(visibility <= 10.8) {
        visibilityStatus.innerText = "Very Clear Air";
    } 
}

function updateAirQualityStatus(airQuality) {
    if(airQuality <= 50) {
        airQualityStatus.innerText = "Good";
    } else if(airQuality <= 100) {
        airQualityStatus.innerText = "Moderate";
    } else if(airQuality <= 150) {
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
    } else if(airQuality <= 200) {
        airQualityStatus.innerText = "Unhealthy";
    } else if(airQuality <= 250) {
        airQualityStatus.innerText = "Very Unhealthy";
    } else {
        airQualityStatus.innerText = "Hazardous";
    }
}
function convertTimeTo12HourFormet(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour & 12;
    hour = hour ? hour : 12; //the zero hour should be 12
    hour = hour < 10 ? "0" + hour : hour;//add prefix zero if less than 10
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + ":"+ ampm;
    return strTime; 
}
