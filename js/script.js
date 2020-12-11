const apiKey = '9c6020d97d308aa722166c4d02730e67';
// Get history from local storage, or if there is none assign history as an empty array
const history = JSON.parse(localStorage.getItem("weather-history")) || [];

if (history.length > 0) renderCity(history[history.length - 1]);

$("#search").on("click", renderCity);
$(document).on("click", ".city", function() {
    renderCity($(this).text());
});
$(document).on("click", "#clear-history", function() {
    history.length = 0;
    localStorage.clear();
    $("#history").empty();
})

// Render the forecast for a city
async function renderCity(cityName) {
    // If cityName is an object (because it is "event" passed from a click listener)...
    if (typeof cityName == 'object') {
        // Assign the city name from the search bar and add it to history
        cityName = $("#search-input").val();
        addToHistory(cityName);
    }

    renderHistory();
    $("#today").show();
    $("#5-day-forecast").show();

    const cityQuery = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    const cityRes = await $.get(cityQuery);
    const {lat, lon} = cityRes.coord;
    const oneCallQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}`;
    const oneCallRes = await $.get(oneCallQuery);
    
    const today = oneCallRes.current;
    const todaysDate = moment(today.dt * 1000).format("L");
    const todaysIcon = today.weather[0].icon;
    const {temp: todaysTemp, uvi: todaysUvi, humidity: todaysHumidity, wind_speed: todaysWind} = today;

    $("#city-name")     .text(cityName);
    $("#today-date")    .text(`(${todaysDate})`);
    $("#today-icon")    .attr('src', `https://openweathermap.org/img/wn/${todaysIcon}.png`);
    $("#today-temp")    .text(`Temperature: ${todaysTemp} °F`);
    $("#today-humidity").text(`Humidity: ${todaysHumidity}%`);
    $("#today-wind")    .text(`Wind Speed: ${todaysWind} MPH`);
    $("#today-uvi")     .text(`UV Index: ${todaysUvi}`);

    const fiveDays = oneCallRes.daily.slice(1, 6);
    for (let i = 1; i < 6; i++) {
        const day = fiveDays[i - 1];
        const dayDate = moment(day.dt * 1000).format("L");
        const dayIcon = day.weather[0].icon;
        const {temp: dayTemp, humidity: dayHumidity} = day;

        $(`#day-${i}-date`)    .text(dayDate);
        $(`#day-${i}-icon`)    .attr('src', `https://openweathermap.org/img/wn/${dayIcon}.png`);
        $(`#day-${i}-temp`)    .text(`Temp: ${dayTemp.day} °F`);
        $(`#day-${i}-humidity`).text(`Humidity: ${dayHumidity}%`);
    }
}

// Render all the cities in history
function renderHistory() {
    $("#history").empty();
    $("#history").append(`<li id="clear-history" class="list-group-item bg-danger text-light" role="button">Clear History</li>`);
    for (const city of history) {
        const listItem = $(`<li class="list-group-item city" role="button">${city}</li>`);
        $("#history").prepend(listItem);
    }
}

// Adds a city to history and syncs history up with local storage
function addToHistory(name) {
    history.push(name);
    localStorage.setItem("weather-history", JSON.stringify(history));
}
