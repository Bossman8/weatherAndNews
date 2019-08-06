$(document).ready(function(){
    $('.sidenav').sidenav();
  });
    
function displayWeatherInfo() {
    var city = $("#cityName").val();
    var apiKey = "b1ea2298caabef8f64aebd0a4fb8bfab"
    var city = ("#cityName").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID="+apiKey+"&units=imperial&cnt=5"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
    })
};
displayWeatherInfo();