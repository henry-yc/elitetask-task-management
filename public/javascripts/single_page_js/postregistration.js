// Initialise Google calendar API
// Client ID and API key from the Developer Console
var CLIENT_ID = '93800279261-gth1fq4j4ukij0ecbrr0j1htrqpjjl0d.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAjvXVAcWIsoMn-mMKowDPHZ4KDZ78oLGs';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize_button');


// On load, called to load the auth2 library and API client library.

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Initializes the API client library and sets up sign-in state
// listeners.
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES

    });
}

// Sign in the user upon button click.
function authorizeGoogleCalendar(event) {
    gapi.auth2.getAuthInstance().signIn().then(function() {
        // Update user's profile to show link
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Do something on success
            }
        };
        xhttp.open("POST", "/users/googlecalendar", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
    });
}


var vue = new Vue ({
    el: "#postregistration",
    data: {
        aboutMe: "",
        availability: {Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false},
        preferences: [""],
        taskTypes: [],
        file: null,
        onlyOpenID: null,
        isManager: null,
        isManagerSelection: null
    },
    created: function() {
        this.getSignUpMethod();
        this.getAccountType();
        this.getTaskTypes();
    },
    methods: {
        addItem: function () {
            this.preferences.push("");
        },
        removeItem: function (index) {
            this.preferences.splice(index, 1);
            if(this.preferences.length===0) {
                this.addItem();
            }
        },
        getSignUpMethod: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.onlyOpenID = (JSON.parse(this.responseText)).onlyOpenID;
                    console.log(vue.onlyOpenID);
                    console.log(JSON.parse(this.responseText));
                    if (vue.onlyOpenID) {
                        document.querySelector("#accountType").style.display = "block";
                    }
                }
            };
            xhttp.open("GET", "/users/signupmethod", true);
            xhttp.send();
        },
        setAccountType: function () {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                  vue.getAccountType();
                  document.querySelector("#accountType").style.display = "none";
                }
            };
            xhttp.open("POST", "/users/setaccounttype", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ isManager: this.isManagerSelection }));
        },
        getAccountType: function () {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                  vue.isManager = (JSON.parse(this.responseText)).isManager;
                }
            };
            xhttp.open("GET", "/users/getaccounttype", true);
            xhttp.send();
        },
        getTaskTypes: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.taskTypes = JSON.parse(this.responseText);
                }
            };
            xhttp.open("GET", "/users/tasktypes", true);
            xhttp.send();
        },
        submit: function () {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                  window.location.href = "task_page.html";
                }
            };

            xhttp.open("POST", "/users/completeprofile", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            if (this.isManager) {
                xhttp.send(JSON.stringify({ aboutMe: this.aboutMe }));
            } else {
                xhttp.send(JSON.stringify({ aboutMe: this.aboutMe, availability: this.availability, preferences: this.preferences }));
            }

        }
    }
});