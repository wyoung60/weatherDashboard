var getData = "";
urlLink =
  "http://api.openweathermap.org/data/2.5/forecast?q=Denver&appid=96bbb97e9dec979e1eede50c7d6896d7";

function getAPI() {
  fetch(urlLink)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var currentDate = data.list[0].dt_txt;
      currentDate = currentDate.slice(0, 10);
      currentDate =
        "(" +
        currentDate.split("-")[1] +
        "-" +
        currentDate.split("-")[2] +
        "-" +
        currentDate.split("-")[0] +
        ")";

      $("#currentCity").text(data.city.name + " " + currentDate);
      var cityLat = data.city.coord.lat;
      var cityLon = data.city.coord.lon;
      var urlLink =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        cityLat +
        "&lon=" +
        cityLon +
        "&exclude=minutely,hourly,alerts&units=imperial&appid=96bbb97e9dec979e1eede50c7d6896d7";
      var uvLink =
        "http://api.openweathermap.org/data/2.5/uvi?lat=" +
        cityLat +
        "&lon=" +
        cityLon +
        "&appid=96bbb97e9dec979e1eede50c7d6896d7";
      fetch(urlLink)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          $("#weather").attr(
            "src",
            "http://openweathermap.org/img/wn/" +
              data.current.weather[0].icon +
              "@2x.png"
          );

          $("#currentTemp").text("Temperature: " + data.current.temp + " °F");
          $("#humidity").text("Humidity: " + data.current.humidity + "%");
          $("#windSpeed").text(
            "Wind Speed: " + data.current.wind_speed + " MPH"
          );
          var dailyDate = new Date(Number(data.daily[0].dt) * 1000);
          console.log(dailyDate);
          console.log();
          $("#forecastDaily").text(dailyDate.toLocaleString().split(",")[0]);
          console.log(data.daily[0].weather[0].icon);
          $("#dailyWeather").attr(
            "src",
            "http://openweathermap.org/img/wn/" +
              data.daily[0].weather[0].icon +
              "@2x.png"
          );
          $("#dailyTemp").html(
            "<br />" + "Temp: " + data.daily[0].temp.max + " °F"
          );
          $("#dailyHumidity").html("Humidity: " + data.daily[0].humidity + "%");
        });
      fetch(uvLink)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data.value);
          if (Number(data.value) < 3) {
            $("#uvIndex").attr("style", "background-color:green");
          } else {
            $("#indexValue").attr("style", "background-color:red");
          }
          $("#indexValue").text(data.value);
        });
    });
}

getAPI();
