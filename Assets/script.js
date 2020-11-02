// Pull information from local storage
var cityArray = JSON.parse(localStorage.getItem("searchHistory"));
if (cityArray === null) {
  var cityArray = [];
}
//Create the buttons for recently searched cities
for (var i = 0; i < cityArray.length; i++) {
  var historyButton = $("<button>").attr(
    "class",
    "btn btn-outline-primary btnsize"
  );
  historyButton.text(cityArray[i]);
  //Adds to list is reverse order
  $(".searchHistory").prepend(historyButton);
}
//Group of global variables needed for the different html elements
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
//Loop to create the daily forecast elements
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
  //If statement to kick out of function if nothing is entered
  if ($("#cityName").val() == "") {
    return;
  }
  //Clears last entry info
  $(".col-10").empty();
  //Clear history buttons
  $(".searchHistory").empty();
  //Store selected city
  var userCity = $("#cityName").val();
  //Erase and resets input box
  $("#cityName").val("");
  $("#cityName").attr("placeholder", "Enter City Here");
  //Keeps list of search history to 7 or less
  if (cityArray.length < 7) {
    cityArray.push(userCity);
  } else {
    cityArray.push(userCity);
    //Removes first item in the array
    cityArray.shift();
  }
  //Ensures the same city isn't in the array twice
  var uniqueCity = [...new Set(cityArray)];
  //Stores the search history array in local storage
  localStorage.setItem("searchHistory", JSON.stringify(uniqueCity));
  //Create url for API
  urlLink =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    userCity +
    "&appid=96bbb97e9dec979e1eede50c7d6896d7";
  //For loop to add search history buttons to page
  for (var i = 0; i < uniqueCity.length; i++) {
    var historyButton = $("<button>").attr(
      "class",
      "btn btn-outline-primary btnsize"
    );
    historyButton.text(uniqueCity[i]);
    $(".searchHistory").prepend(historyButton);
  }
  //Call function with link
  getAPI(urlLink);
});
//Click event for search history buttons
$(".searchHistory").on("click", ".btnsize", function () {
  //Erases last search on page
  $(".col-10").empty();
  var userCity = $(this).text();
  urlLink =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    userCity +
    "&appid=96bbb97e9dec979e1eede50c7d6896d7";
  getAPI(urlLink);
});

//Function to call api
function getAPI(urlLink) {
  //First fetch to api
  fetch(urlLink)
    .then(function (response) {
      //Returns response in JSON format
      return response.json();
    })
    .then(function (data) {
      //Saving necessary information for later calls and page
      var cityName = data.city.name;
      var cityLat = data.city.coord.lat;
      var cityLon = data.city.coord.lon;
      //Creating the next links needed for api for UV index and 5 day forecast
      var urlLink =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        cityLat +
        "&lon=" +
        cityLon +
        "&exclude=minutely,hourly,alerts&units=imperial&appid=96bbb97e9dec979e1eede50c7d6896d7";
      var uvLink =
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        cityLat +
        "&lon=" +
        cityLon +
        "&appid=96bbb97e9dec979e1eede50c7d6896d7";
      //Fetch for 5 day forcast
      fetch(urlLink)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          //Converting the date from unix timestamp to standard format
          currentDate = new Date(Number(data.daily[0].dt) * 1000);
          //Adding text to current day card
          currentDayHeader.text(
            cityName + " " + currentDate.toLocaleString().split(",")[0]
          );
          //Adds Weather image to page
          currentDayImg = $("<img>").attr({
            src:
              "https://openweathermap.org/img/wn/" +
              data.current.weather[0].icon +
              "@2x.png",
            class: "float_left",
            alt: "Current Weather",
          });
          //Adds next line of text as well as end float for next line
          endFloat.text("Temperature: " + data.current.temp + " °F");
          //Adds remainder of info for current day from this api
          currentHumidity = data.current.humidity;
          currentWindSpeed = data.current.wind_speed;
          //For loop to add daily content
          for (var i = 1; i < 6; i++) {
            //Converts unix timestamp to standard format
            var dailyDate = new Date(Number(data.daily[i].dt) * 1000);
            //Pulls just the date
            forecastDate[i].text(dailyDate.toLocaleString().split(",")[0]);
            //Adds icon to daily forecast
            dailyForecastImg[i].attr(
              "src",
              "https://openweathermap.org/img/wn/" +
                data.daily[i].weather[0].icon +
                "@2x.png"
            );
            //Adds text to html elements
            dailyTemp[i].html(
              "<br />" + "Temp: " + data.daily[i].temp.max + " °F"
            );
            dailyHumidity[i].html("Humidity: " + data.daily[i].humidity + "%");
          }
          //Fetch from UV api
          fetch(uvLink)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              //Adds UV text and applies hazard color to value
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

//Function to append all html elements page
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
