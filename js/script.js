const apiKey = '9c6020d97d308aa722166c4d02730e67';
$("#search").on("click", async function(event) {
    const cityName = $("#search-input").val();
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&mode=json&appid=${apiKey}`;
    const res = await $.get(queryURL);
    $("#dump").text(JSON.stringify(res));
});

// const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=London,us&mode=json&appid=${apiKey}`;
