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
    $('.fixed-action-btn').floatingActionButton();
});

var database = firebase.database()
var ViewsNumber = database.ref('ViewsNumber/ViewsNumber'.valueOf());
var uid = "";
var cityKey = "";
var signInPass = $("#signInPass").attr("value")
const btnLogin = document.getElementById("signInNow");
const btnSignUp = document.getElementById("signUpNow");

var signInBtn = document.getElementById("signInBtn")
var signOutBtn = document.getElementById("signOutBtn")
var signUpBtn = document.getElementById("signUpBtn")
var content = document.getElementsByClassName("container");
var isAuthenticated = false;
$("div.content").hide()
$("div.showRest").hide()
authenticate(false);

database.ref().on("value", function (snapshot) {
    console.log(snapshot.val())
    if (snapshot.child("ViewsNumber").exists()) {
        ViewsNumber = snapshot.val().ViewsNumber
        console.log(ViewsNumber)
    }
})

function authenticate(isAuth = Boolean) {
    isAuthenticated = isAuth;
    if (isAuthenticated == false) {
        $("div.content").hide();
        var html = "<p style='text-align:center;'>You must Sign Up/Sign In to view content.</p>"
        $(".noResults").html(html);
    } else {
        $("div.content").show();
        $(".noResults").html("");
    }
}

// signUpBtn.addEventListener('click', e => {
//     $("#signUpForm").validate({
//         rules: {
//             signUpEmail: {
//                 required: true,
//                 email: true
//             },
//             signUpPass: {
//                 required: true,
//                 minlength: "6"
//             },
//             signUpPassConfirm: {
//                 required: true,
//                 minlength: "6",
//                 equalTo: "#signUpPass"
//             }
//         },
//         messages: {
//             signUpEmail: {
//                 required: "Please enter your email",
//                 email: "Must be a valid email"
//             },
//             signUpPass: {
//                 required: "Please enter a password",
//                 minlength: "Your password must be at least 6 characters"
//             },
//             signUpPassConfirm: {
//                 required: "Please enter a password",
//                 minlength: "Your password must be at least 6 characters",
//                 equalTo: "Passwords do not match"
//             }
//         }
//     })
// })

signOutBtn.addEventListener('click', e => {
    e.preventDefault();
    firebase.auth().signOut();
    authenticate(false)
})

btnLogin.addEventListener('click', e => {
    e.preventDefault();
    const email = $("#signInEmail").val();
    const pass = $("#signInPass").val();
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    authenticate(true);
    console.log("Logged in")
})

btnSignUp.addEventListener('click', e => {
    e.preventDefault();
    const email = $("#signUpEmail").val();
    const pass = $("#signUpPass").val();
    const auth = firebase.auth();
    auth.createUserWithEmailAndPassword(email, pass);
    authenticate(true);
    console.log("Logged in")
})

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        uid = firebaseUser.G;
        signInBtn.style.display = "none"
        signUpBtn.style.display = "none"
        signOutBtn.style.display = "inline-block"
        var newDiv = $("<li>")
        newDiv.html(firebaseUser.email)
        newDiv.attr("id", "navEmail")
        $("#nav-mobile").prepend(newDiv)
        authenticate(true);
        ViewsNumber++;
        firebase.database().ref("/Views").push({
            uid
        })
    }
    else {
        console.log("Not Logged In");
        signInBtn.style.display = "inline-block"
        signUpBtn.style.display = "inline-block"
        signOutBtn.style.display = "none"
        $("#navEmail").empty();
        authenticate(false);
    }
})

// database.ref().on("value", function (snapshot) {
//     if (snapshot.child("ViewsNumber").exists()) {

//         console.log("works")
//         ViewsNumber = snapshot.val().ViewsNumber


//     }
// })

var modal1 = $("#modal1")

function findCity() {

    var apiKey = "b1ea2298caabef8f64aebd0a4fb8bfab"
    var zip = $("#cityName").val();
    var queryURL = "https://dataservice.accuweather.com/locations/v1/cities/search?apikey=DrAxvb70qpJHcWljiu1szFIHWqsGBF7P&q=" + zip

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (city) {
        cityKey = city[0].Key
        displayWeatherInfo();
    })

}

function displayWeatherInfo() {
    var apiKey = "b1ea2298caabef8f64aebd0a4fb8bfab"

    var queryURL = "https://dataservice.accuweather.com/forecasts/v1/daily/5day/" + cityKey + "?apikey=DrAxvb70qpJHcWljiu1szFIHWqsGBF7P"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
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
$(document).on("click", "#showLess", buttonSwitch);


function displayNews() {
    var apiKey = "96b0859adb5e4b5ba3524e2d2e8571af";
    var url = "https://newsapi.org/v2/top-headlines?" +
        'country=us&apiKey=' +
        apiKey;
    $.ajax({
        url: url,
        method: "GET"
    }).then(function (res) {
        $("div.moreNews").hide();
        var firstFive = res.articles.slice(0, 5);
        var rest = res.articles.slice(5, res.articles.length);
        $(document).ready(function () {
            var html = "<table border='1|1' id='table-one'>";
            for (var i = 0; i < firstFive.length; i++) {
                html += "<tr class='news-table'>";
                html += "<td class='news-title news-row'>" + firstFive[i].title + "</td>";
                html += "<td class='news-published-at news-row'><strong>" + firstFive[i].author + 
                "</strong> - " + new Date(firstFive[i].publishedAt).toLocaleDateString() + 
                "<a href='" + firstFive[i].url + "' target='_blank'> - Source: " + firstFive[i].source.name + "</a></td>";
                html += "<td class='news-description news-row'>" + firstFive[i].description + "</td>";
                // html += "<td><button class='btn' style='max-width:200px;' click='showFullArticle(" + firstFive[i] + ") type='submit' id='showFull'>Show Full Article</button></td>"
                html += "</tr>";
            }
            html += "</table>";
            html += "<button class='btn' type='submit' id='showRest'>Show More</button>";
            $("div.newsContent").html(html);

            var html2 = "<table border='1|1' id='table-two'>";
            for (var i = 0; i < rest.length; i++) {
                html2 += "<tr class='news-table'>";
                html2 += "<td class='news-title news-row'>" + rest[i].title + "</td>";
                html2 += "<td class='news-published-at news-row'><strong>" + rest[i].author + 
                "</strong> - " + new Date(rest[i].publishedAt).toLocaleDateString() + 
                "<a href='" + rest[i].url + "' target='_blank'> - Source: " + rest[i].source.name + "</a></td>";
                html2 += "<td class='news-description news-row'>" + rest[i].description + "</td>";
                html2 += "</tr>";
            }
            html2 += "</table>";
            html2 += "<button class='btn' type='submit' id='showLess'>Show Less</button>";
            $("div.moreNews").html(html2);
        });
    })
}

function buttonSwitch() {
    $("div.moreNews").toggle();
    $("#showRest").toggle();
}

function showFullArticle(article) {
    $("#fullArticleTitle").text(article.title);
}

$("#smallWeather").on("click", function () {
    $("#news").hide();
    $("#weatherCard").show();
})
$("#smallNews").on("click", function () {
    $("#weatherCard").hide();
    $("#news").show();
    displayNews();
})