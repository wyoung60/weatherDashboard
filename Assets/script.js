var cityArray = JSON.parse(localStorage.getItem("searchHistory"));
if (cityArray === null) {
  var cityArray = [];
}
console.log(cityArray);
for (var i = 0; i < cityArray.length; i++) {
  var historyButton = $("<button>").attr(
    "class",
    "btn btn-outline-primary btnsize"
  );
  historyButton.text(cityArray[i]);
  $(".searchHistory").prepend(historyButton);
}
var currentDayHeader = $("<h2>").attr("class", "float_left");
var currentDate = "";
var currentDayImg = "";
var endFloat = $("<h4>").attr("style", "clear:both");
var currentHumidity = "";
var currentWindSpeed = "";
var uvIndexElement = $("<h4>").text("UV Index: ");
var uvSpanElement = $("<span>");
var fiveDayHeader = $("<h1>").text("5 Day Forecast:").attr("class", "row m-2");
var dailyForcastRow = $("<div>").attr("class", "row m-2");
var dailyCard = [];
var dailyCardBody = [];
var forecastDate = [];
var dailyForecastImg = [];
var dailyTemp = [];
var dailyHumidity = [];
for (var i = 1; i < 6; i++) {
  dailyCard[i] = $("<div>")
    .attr("class", "col card m-2")
    .css({ "background-color": "blue", color: "white" });
  dailyCardBody[i] = $("<div>").attr("class", "card-body");
  forecastDate[i] = $("<h3>");
  dailyForecastImg[i] = $("<img>").attr("alt", "Daily Weather Image");
  dailyTemp[i] = $("<h5>");
  dailyHumidity[i] = $("<h5>");
}

//Click event for search button

$("#searchBtn").on("click", function () {
  console.log($("#cityName").val());
  if ($("#cityName").val() == "") {
    console.log("here");
    return;
  }
  $(".col-10").empty();
  $(".searchHistory").empty();

  //Store selected city
  var userCity = $("#cityName").val();
  $("#cityName").val("");
  $("#cityName").attr("placeholder", "Enter City Here");
  if (cityArray.length < 7) {
    cityArray.push(userCity);
  } else {
    cityArray.push(userCity);
    cityArray.shift();
  }
  var uniqueCity = [...new Set(cityArray)];
  localStorage.setItem("searchHistory", JSON.stringify(uniqueCity));
  console.log(cityArray);
  //Create url for API
  urlLink =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    userCity +
    "&appid=96bbb97e9dec979e1eede50c7d6896d7";
  //Call function with link
  for (var i = 0; i < uniqueCity.length; i++) {
    var historyButton = $("<button>").attr(
      "class",
      "btn btn-outline-primary btnsize"
    );
    historyButton.text(uniqueCity[i]);
    $(".searchHistory").prepend(historyButton);
  }
  getAPI(urlLink);
});

$(".searchHistory").on("click", ".btnsize", function () {
  $(".col-10").empty();
  var userCity = $(this).text();
  urlLink =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    userCity +
    "&appid=96bbb97e9dec979e1eede50c7d6896d7";
  getAPI(urlLink);
});

function getAPI(urlLink) {
  fetch(urlLink)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cityName = data.city.name;
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
          currentDate = new Date(Number(data.daily[0].dt) * 1000);

          currentDayHeader.text(
            cityName + " " + currentDate.toLocaleString().split(",")[0]
          );
          currentDayImg = $("<img>").attr({
            src:
              "http://openweathermap.org/img/wn/" +
              data.current.weather[0].icon +
              "@2x.png",
            class: "float_left",
            alt: "Current Weather",
          });
          endFloat.text("Temperature: " + data.current.temp + " °F");
          currentHumidity = data.current.humidity;
          currentWindSpeed = data.current.wind_speed;

          for (var i = 1; i < 6; i++) {
            var dailyDate = new Date(Number(data.daily[i].dt) * 1000);

            forecastDate[i].text(dailyDate.toLocaleString().split(",")[0]);

            dailyForecastImg[i].attr(
              "src",
              "http://openweathermap.org/img/wn/" +
                data.daily[i].weather[0].icon +
                "@2x.png"
            );
            dailyTemp[i].html(
              "<br />" + "Temp: " + data.daily[i].temp.max + " °F"
            );
            dailyHumidity[i].html("Humidity: " + data.daily[i].humidity + "%");
          }
          fetch(uvLink)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              uvSpanElement.text(data.value);
              if (Number(data.value) < 3) {
                uvSpanElement.css({
                  "background-color": "green",
                  padding: "3px",
                  "border-radius": "10px",
                });
              } else if (Number(data.value) > 5) {
                uvSpanElement.css({
                  "background-color": "red",
                  padding: "3px",
                  "border-radius": "10px",
                });
              } else {
                uvSpanElement.css({
                  "background-color": "yellow",
                  padding: "3px",
                  "border-radius": "10px",
                });
              }
              formatFunction();
            });
        });
    });
}

function formatFunction() {
  var currentCard = $("<div>").attr("class", "row card m-2");
  var currentCardBody = $("<div>").attr("class", "card-body currentData");
  $(".col-10").append(currentCard);
  currentCard.append(currentCardBody);
  $(".currentData").append(currentDayHeader);
  $(".currentData").append(currentDayImg);
  $(".currentData").append(endFloat);
  $(".currentData").append(
    $("<h4>").text("Humidity: " + currentHumidity + "%")
  );
  $(".currentData").append(
    $("<h4>").text("Wind Speed: " + currentWindSpeed + " MPH")
  );
  $(".currentData").append(uvIndexElement);
  uvIndexElement.append(uvSpanElement);
  $(".col-10").append(fiveDayHeader);
  $(".col-10").append(dailyForcastRow);
  for (var i = 1; i < 6; i++) {
    dailyForcastRow.append(dailyCard[i]);
    dailyCard[i].append(dailyCardBody[i]);
    dailyCardBody[i].append(forecastDate[i]);
    dailyCardBody[i].append(dailyForecastImg[i]);
    dailyCardBody[i].append(dailyTemp[i]);
    dailyCardBody[i].append(dailyHumidity[i]);
  }
}
