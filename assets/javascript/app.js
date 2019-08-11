var firebaseConfig = {
    apiKey: "AIzaSyBsBbHW6M7cPBBnsoJQRtQp_2BOTK6X8mk",
    authDomain: "weatherandnews-3e2be.firebaseapp.com",
    databaseURL: "https://weatherandnews-3e2be.firebaseio.com",
    projectId: "weatherandnews-3e2be",
    storageBucket: "",
    messagingSenderId: "702726209163",
    appId: "1:702726209163:web:ec01191da327cc95"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.modal').modal();
});


var cityKey = "";
var signInPass = $("#signInPass").attr("value")
const btnLogin = document.getElementById("signInNow");
const btnSignUp = document.getElementById("signUpNow");

var signInBtn = document.getElementById("signInBtn")
var signOutBtn = document.getElementById("signOutBtn")
var signUpBtn = document.getElementById("signUpBtn")

$("div.showRest").hide()

signOutBtn.addEventListener('click', e => {
    firebase.auth().signOut();
})

btnLogin.addEventListener('click', e => {
    const email = $("#signInEmail").val();
    const pass = $("#signInPass").val();
    console.log(email)
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);

    console.log("Logged in")
})



btnSignUp.addEventListener('click', e => {
    const email = $("#signUpEmail").val();
    const pass = $("#signUpPass").val();
    console.log(email)
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    console.log("Logged in")
})

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser.email);
        signInBtn.style.display = "none"
        signUpBtn.style.display = "none"
        signOutBtn.style.display = "inline-block"
        var newDiv = $("<li>")
        newDiv.html(firebaseUser.email)
        newDiv.attr("id", "navEmail")
        $("#nav-mobile").prepend(newDiv)
    }
    else {
        console.log("Not Logged In");
        signInBtn.style.display = "inline-block"
        signUpBtn.style.display = "inline-block"
        signOutBtn.style.display = "none"
        $("#navEmail").empty();
    }
})

var modal1 = $("#modal1")

function findCity() {
    
    var apiKey = "b1ea2298caabef8f64aebd0a4fb8bfab"
    var zip = $("#cityName").val();
    var queryURL = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=DrAxvb70qpJHcWljiu1szFIHWqsGBF7P&q=" + zip 

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (city) {
        console.log(city)
        cityKey = city[0].Key
        console.log(cityKey)
        displayWeatherInfo();
    })
    
}

function displayWeatherInfo() {
    var apiKey = "b1ea2298caabef8f64aebd0a4fb8bfab"
    
    var queryURL = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + cityKey + "?apikey=DrAxvb70qpJHcWljiu1szFIHWqsGBF7P"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // console.log(response)
        $(".card-content").empty();

        for (i = 0; i < 5; i++) {
            var tempDiv = $("<p>")
            var fiveDay = $("<p>");
            var epochdate = (response.DailyForecasts[i].EpochDate)
            var tempHigh = (response.DailyForecasts[i].Temperature.Maximum.Value)
            var tempLow = (response.DailyForecasts[i].Temperature.Minimum.Value)
            tempDiv.html(tempHigh + " / " + tempLow)
            var day = ((epochdate / 86400) + 4) % 7
            var days = Math.floor(day)
            console.log(days)
            if (days === 4) {
                days = "Thursday"
            } else if (days === 5) {
                days = "Friday"
            } else if (days === 6) {
                days = "Saturday"
            } else if (days === 0) {
                days = "Sunday"
            } else if (days === 1) {
                days = "Monday"
            } else if (days === 2) {
                days = "Tuesday"
            } else if (days === 3) {
                days = "Wednesday"
            }

            fiveDay.html(days)
            $("#weatherArea").append(tempDiv)
            $("#dayofweek").append(fiveDay)
            days = 0


        }

        $("#weatherArea").prepend("H / L", "<hr>")
        $("#dayofweek").prepend("Day", "<hr>")



    })
};
$(document).on("click", "#addCity", findCity);

$(document).on("click", "#getNews", displayNews);
$(document).on("click", "#showRest", buttonSwitch);


function displayNews() {
    var apiKey = "96b0859adb5e4b5ba3524e2d2e8571af";
    var url = "https://newsapi.org/v2/top-headlines?" +
        'country=us&apiKey=' +
        apiKey;
    $.ajax({
        url: url,
        method: "GET"
    }).then(function (res) {
        console.log(res.articles)
        $("div.moreNews").hide();
        var firstFive = res.articles.slice(0, 5);
        var rest = res.articles.slice(5, res.articles.length - 1);
        $(document).ready(function () {
            var html = "<table border='1|1'>";
            for (var i = 0; i < firstFive.length; i++) {
                html += "<tr class='news-table'>";
                html += "<td class='news-title news-row'>" + res.articles[i].title + "</td>";
                html += "<td class='news-published-at news-row'>" + res.articles[i].publishedAt + "</td>";
                html += "<td class='news-description news-row'>" + res.articles[i].description + "</td>";
                html += "</tr>";
            }
            html += "</table>";
            html += "<button class='btn' type='submit' id='showRest'>Show More</button>";
            $("div.newsContent").html(html);

            var html2 = "<table border='1|1'>";
            for (var i = 0; i < rest.length; i++) {
                html2 += "<tr class='news-table'>";
                html2 += "<td class='news-title news-row'>" + res.articles[i].title + "</td>";
                html2 += "<td class='news-published-at news-row'>" + res.articles[i].publishedAt + "</td>";
                html2 += "<td class='news-description news-row'>" + res.articles[i].description + "</td>";
                html2 += "</tr>";
            }
            html2 += "</table>";
            $("div.moreNews").html(html2);
        });
    })
}

function buttonSwitch() {
    $("div.moreNews").show();
    $("#showRest").hide();
}

