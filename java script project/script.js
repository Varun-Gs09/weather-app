const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sunrise"),
    sunSet = document.querySelector(".sunset"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status"),
    weatherCards = document.querySelector("#weather-cards"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    searchForm = document.querySelector("#search"),
    search = document.querySelector("#query");
   
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
        "Saturday",
    ];
    //12 hour format
    hour = hour % 12;
    if(hour < 10) {
        hour = "0" + hour
    }
    if (minute < 10) {
        minute = "0"+ minute
        }

        let dayString = days[now.getDay()];
        return `${dayString}, ${hour}:${minute}`;
}

date.innerText = getDateTime();
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
            currentCity = data.city;
            getWeatherData(data.city , currentUnit , hourlyorWeek);
        });
}
getPublicIp();

//function to get weather data

function getWeatherData (city, unit, hourlyorWeek) {
    // const apiKey = "EJ6UBL2JEQGYB3AA4ENASN62J";
    fetch(
       `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`,
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
                mainIcon.src = getIcon(today.icon);
                changeBackground(today.icon);
                if (hourlyorWeek == "hourly") {
                    updateForecast(data.days[0].hours , unit , "day");
                } else {
                    updateForecast(data.days, unit , "week");
                }
            })
            .catch((err) => {
                alert("City not found in our database");
            })
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
function convertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour & 12;
    hour = hour ? hour : 12; //the zero hour should be 12
    hour = hour < 10 ? "0" + hour : hour;//add prefix zero if less than 10
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + ""+ ampm;
    return strTime; 
}
function getIcon(condition) {
    switch (condition) {
        case "partly-cloudy-day":
            return "https://i.ibb.co/PZQXH8V/27.png";
        case "partly-cloudy-night":
            return "https://i.ibb.co/Kzkk59k/15.png";
        case "rain":
            return "https://i.ibb.co/kBd2NTS/39.png";
        case "clear-day":
            return "https://i.ibb.co/rb4rrJL/26.png";
        case "clear-night":
            return "https://i.ibb.co/1nxNGHL/10.png";
        default:
            return "https://i.ibb.co/1nxNGHL/10.png"; // Default icon if condition is unknown
    }
}

function getDayName(date) {


    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "saturday"
    ];
    return days[day.getDay()];
}

// function getHour (time) {
//     let hour = time.split(":")[0];
//     let min = time.split(":")[1];
//     if (hour > 12) {
//         hour = hour -12;
//         return `${hour}:${min} PM`
//     } else {
//         return `${hour}:${min} AM`
//     }
// }
function getHour(time) {
    let[hour,minute] = time.split(":");
    let ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12|| 12;
    return `${hour}:${minute} ${ampm}`;
}

function updateForecast (data , unit , type) {
    weatherCards.innerHTML = "";

    let day = 0;
    let numCards = 0;
    // 24 cards if hourly weather and 7 for weekly
    if(type == "day") {
        numCards = 24;
    } else {
        numCards = 7;
    }
    for(let i =0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        // hour if hourly time and day name if weekly
        let dayName = getHour(data[day].datetime); 
        if(type == "week") {
            dayName =getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if(unit == "F") {
            dayTemp = celciusToFahrenheit(data[day].temp);
            }
            let iconCondition = data[day].icon;
            let iconSrc = getIcon(iconCondition);
            let tempUnit = "°C";
            if(unit == "f") {
                tempUnit = "°F"
            }
            card.innerHTML = `
            
             <h2 class="day-name">${dayName}</h2>
                <div class="card-icon">
                    <img src="${iconSrc}" alt="">
                </div>
                <div class="day-temp">
                    <h2 class="temp">${dayTemp}</h2>
                    <span class="temp-unit">${tempUnit}</span>
                </div>
            
            `;
            weatherCards.appendChild(card);
            day++;
    }
}

function changeBackground(condition) {
    const body = document.querySelector("body");
    let bg = "";
    switch (condition) {
        case "partly-cloudy-day":
            bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
            break;
        case "partly-cloudy-night":
            bg = "https://i.ibb.co/RDfPqXz/pcn.jpg";
            break;
        case "rain":
            bg = "https://i.ibb.co/h2p6Yhd/rain.webp";
            break;
        case "clear-day":
            bg = "https://i.ibb.co/WGry01m/cd.jpg";
            break;
        case "clear-night":
            bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
            break;
        default:
            bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg"; // Default background if condition is unknown
            break;
    }
    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg})`;
}
fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
})
celciusBtn.addEventListener("click", () => {
    changeUnit("c");
});

function changeUnit(unit) {
    if(currentUnit != unit) {
        currentUnit = unit;
         {
            //change unit on document
            tempUnit.forEach((elem) => {
                elem.innerText = `${unit.toUpperCase()}`;
            });
            if (unit == "c") {
                celciusBtn.classList.add("active")
                fahrenheitBtn.classList.remove("active")
            } else {
                celciusBtn.classList.remove("active")
                fahrenheitBtn.classList.add("active")
            }
            // call get weather after change unit
            getWeatherData(currentCity, currentUnit, hourlyorWeek);
        }
    }
}

hourlyBtn.addEventListener("click",() => {
    changeTimeSpan ("hourly");
});
weekBtn.addEventListener("click",() => {
    changeTimeSpan ("week");
});


function changeTimeSpan(unit) {
    if(hourlyorWeek != unit ) {
        hourlyorWeek = unit;
        if(unit == "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        // update weather on time change
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
        currentCity = location;
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
})

//lets create a cities array which we want to suggest or we can use any api for this.

cities = [
    "Banglore",
    "Abbottabad",
    "Lahore",
    "Guntur",
    "Madhurai",
    "Goa",
    "Delhi",
    "mumbai",
    "Hydrabad",
    "Vishakapatnam",
];

var currentFocus;
// adding eventlistner on search
search.addEventListener("input", function(e) {
    removeSuggestions();
    var
     a, 
     b,
     i,
     val=this.value;
     //if there is nothing search input do nothing
    if(!val) {
        return false;
    }
    currentFocus = -1;

    a = document.createElement("ul");
    a.setAttribute("id","suggestions");
//append the ul to its parent which is search form
    this.parentNode.appendChild(a);


    //adding li's with matching search suggestions

    for (i = 0; i < cities.length; i++) {
        //check items starts with same letters 

        if(cities[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            // if any suggestions matching
            b = document.createElement("li");
            // adding content in li
            //strong to make the matching letters bold
            b.innerHTML="<strong>" + cities[i].substr(0,val.length)+ "</strong>"
            // remaining par of suggestions
            b.innerHTML += cities[i].substr(val.length);
            //input field to hold the suggestions value
            b.innerHTML += "<input type= 'hidden' value='" + cities[i] + "'>"; 
            //add event listener on suggestion
            b.addEventListener("click", function (e) {
            //on click set the search input with clicked suggestion value
            search.value = this.getElementByTagName("input")[0].value;
            removeSuggestions();
            });


            //append suggestions li to ul
            a.appendChild(b);
            
        }
    }
});

//its working but every new suggestion is coming over prev
//lets remove prev suggestion then add new ones

function removeSuggestions() {
    //select the ul which is being adding on search input
    var x = document.getElementById("suggestions");
    //if x exists remove it
    if (x) x.parentNode.removeChild(x);
}

//lets add up and down keys functionality to select a suggestion ul

search.addEventListener("keydown", function (e) {
    var x = document.getElementById("suggestions");
    //select the li elements of suggestion ul
    if (x) x = document.getElementsByTagName("li");

    if (e.keyCode == 40) {
        //if key code is down button
        currentFocus++;
        //lets create a function to add active suggestions
        addActive(x);
    } else if (e.keyCode == 38) {
        //if code is up button 
        currentFocus--;
        addActive(x);
    }
    if(e.keyCode == 13){
        // if enter is pressed add the current suggestion

        e.preventDefault();
        if (currentFocus > -1) {
            // if any suggestions is selected click it
            if (x) x[currentFocus].click();
        }
    }
});
function addActive(x) {
    //if there is no suggestion return as it is

    if(!x) return false;
    removeActive(x);
    //if current focus is more than length of suggestion array make it 0

    if (currentFocus >! x.length) currentFocus = 0;
    // if it is less than 0 make suggestion equals
    if (currentFocus < 0) currentFocus = x.length -1;

    //adding active class on focused li
    x[currentFocus].classList.add("active");

    
}

// its working but we need to remove previously active suggestion

function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
}
