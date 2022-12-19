$(document).ready(function () {
  // Forcast API (Tampa) = 'https://api.openweathermap.org/data/2.5/forecast?lat=27.96&lon=-82.45&appid=9e0fd8d1ada727875d6145837cff9db1';
  // GeolocationAPI = 'http://api.openweathermap.org/geo/1.0/direct?q=Tampa&limit=5&appid=9e0fd8d1ada727875d6145837cff9db1';
  var weatherKey = '&units=imperial&appid=9e0fd8d1ada727875d6145837cff9db1';
  var weatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=';
  var searchDisplayBox = $('#searchDisplay')
  var userSearch = $('#searchBar');
  var display = $('#displayBox');
  var weeklyDisplay = $('#fiveDayForcast');
  var searchHistory = [];
  var feelLike;
  var currentTemp;
  var humidity;
  var weatherDesc;
  var weatherType;
  var windSpeeds;

  function storeUserCity() {
    $("#searchBtn").click(function () {
      if (userSearch.val() === "") {
        var warning = $("<p>");
        warning.text("Please write a city");
        searchDisplayBox.append(warning);
        warning.addClass("fade-out");
      } else {
        collectInformation();
        localStorage.setItem("userCity", userSearch.val());
      }


    });
  }



  function collectInformation() {
    var forecastArray = [];

    fetch(weatherAPI + userSearch.val() + weatherKey)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {

            feelLike = data.list[0].main.feels_like;
            currentTemp = data.list[0].main.temp;
            humidity = data.list[0].main.humidity;
            weatherDesc = data.list[0].weather[0].description;
            weatherType = data.list[0].weather[0].icon;
            windSpeeds = data.list[0].wind.speed;


            for (let i = 3; i < data.list.length; i += 8) {
                forecastArray.push(data.list[i]);
            }

            console.log(forecastArray);

            weeklyDisplay.empty();

            for (let i = 0; i < forecastArray.length; i++) {

                var dailyDisplay = $('<div>');
                var dateDisplay = $('<div>');
                var dailyIcons = $('<img>');    

                var dailyUrl = 'http://openweathermap.org/img/w/' + forecastArray[i].weather[0].icon + '.png';

                dailyDisplay.attr('class', 'col m-1 p-1 bg-success bg-opacity-75 border border-dark');
                dateDisplay.attr('class', 'm-1 p-1');

                dailyIcons.attr('alt', 'Weather icon');
                dailyIcons.attr('src', dailyUrl);

                var forecastDate = dayjs(forecastArray[i].dt_txt).format('dddd MM/DD');
                console.log(forecastDate);

                dateDisplay.html(forecastDate)
                dailyDisplay.append(dateDisplay);


                dailyDisplay.html('<b>' + forecastDate + '</b>' + '<br>' +
                    forecastArray[i].weather[0].description + '<br>' + 'Temp: ' +
                    forecastArray[i].main.temp + '˚F' + '<br>' + 'Humidity: ' +
                    forecastArray[i].main.humidity + '%' + '<br>' + 'Wind speed: ' +
                    forecastArray[i].wind.speed + 'mph' + '<br>');

                    dailyDisplay.append(dailyIcons);
                    weeklyDisplay.append(dailyDisplay);
    
            }

            showWeather();

        })

}

  function showWeather() {
    var iconURL = "http://openweathermap.org/img/w/" + weatherType + ".png";
    var iconDisplay = $("#iconImage");

    display.removeClass("hidden");
    iconDisplay.attr("src", iconURL);
    display.html(
      weatherDesc +
        "<br>" +
        "Current Temp: " +
        currentTemp +
        "˚F" +
        "<br>" +
        "Feels Like Temp: " +
        feelLike +
        "˚F" +
        "<br>" +
        "Humidity: " +
        humidity +
        "%" +
        "<br>" +
        "Wind speed: " +
        windSpeeds +
        "mph" +
        "<br>"
    );
    display.append(iconDisplay);
  }
  storeUserCity();
});
