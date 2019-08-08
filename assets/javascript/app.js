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



var signInPass = $("#signInPass").attr("value")
const btnLogin = document.getElementById("signInNow");
const btnSignUp =document.getElementById("signUpNow");

var signInBtn = document.getElementById("signInBtn")
var signOutBtn = document.getElementById("signOutBtn")
var signUpBtn = document.getElementById("signUpBtn")


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
    if(firebaseUser) {
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



        


function displayWeatherInfo() {
    var apiKey = "b1ea2298caabef8f64aebd0a4fb8bfab"
    var zip = $("#cityName").val();
    var queryURL = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + zip + "?apikey=DrAxvb70qpJHcWljiu1szFIHWqsGBF7P"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.DailyForecasts)

        var fiveDay = $("<div>");
        var weather = ("<p>" + response.DailyForecasts[0].EpochDate + "</p>")
        console.log(weather)

        
    })
};
$(document).on("click", "#addCity", displayWeatherInfo);

