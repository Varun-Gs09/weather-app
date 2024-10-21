const temp = document.getElementById("temp"),
    date = document.getElementById("date-time");
    currentLocation = document.getElementById("location")

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
                if(unit == "c"){
                    temp.innerText = today.temp;
                } else{
                    temp.innerText == celciusToFahrenheit(today.temp);
                }
                currentLocation.innerText = data.resolvedAddress;
                condition.innerText = today.conditions;
            });
}

//convert celcius to fahrenheit

function celciusToFahrenheit(temp){ 
    return ((temp*9)/5+ 32).toFixed(1);
}