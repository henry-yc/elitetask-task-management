var loginBox = document.getElementById("login");

// Show modal box
function showLogin() {
    document.getElementById("login").style.display = "block";
}

// Hide modal box
function closeLogin() {
    document.getElementById("login").style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == document.getElementById("login")) {
    document.getElementById("login").style.display = "none";
  }
};

// function onSignIn(googleUser) {
//     // Useful data for your client-side scripts:
//     var profile = googleUser.getBasicProfile();
//     console.log("ID: " + profile.getId()); // Don't send this directly to your server!
//     console.log('Full Name: ' + profile.getName());
//     console.log('Given Name: ' + profile.getGivenName());
//     console.log('Family Name: ' + profile.getFamilyName());
//     console.log("Image URL: " + profile.getImageUrl());
//     console.log("Email: " + profile.getEmail());

//     // The ID token you need to pass to your backend:
//     var id_token = googleUser.getAuthResponse().id_token;
//     console.log("ID Token: " + id_token);

//     // POST ID token to server
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             window.location.href = "task_page.html";
//         } else if (this.readyState == 4 && this.status == 404) {
//             window.location.href = "post_registration.html";
//         }
//     };
//     xhttp.open("POST", "/googlelogin", true);
//     xhttp.setRequestHeader("Content-type", "application/json");
//     xhttp.send(JSON.stringify({token: id_token}));
// }

// Initialise Google sign in
function googleAuth() {
    gapi.load('auth2', function() {
        auth2 = gapi.auth2.init({
            client_id: '93800279261-gth1fq4j4ukij0ecbrr0j1htrqpjjl0d.apps.googleusercontent.com',
        });
    });
}

function loginWithGoogle() {
    // var auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then(function() {
        var id_token = auth2.currentUser.get().getAuthResponse().id_token;
        console.log(id_token);
        // POST ID token to server
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.href = "task_page.html";
            } else if (this.readyState == 4 && this.status == 404) {
                window.location.href = "post_registration.html";
            }
        };
        xhttp.open("POST", "/googlelogin", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({token: id_token}));

    });
}

var vue = new Vue ({
    el: "#login",
    data: {
        email: "",
        password: "",
        failedLogin: false
    },
    methods: {
        login: function () {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                  window.location.href = "task_page.html";
                } else if (this.readyState == 4 && this.status == 401) {
                    vue.failedLogin = true;
                }
            };

            xhttp.open("POST", "/login", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ email: this.email, password: this.userPassword }));
        },
        loginWithGoogle: function () {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                  window.location.href = "task_page.html";
                } else if (this.readyState == 4 && this.status == 401) {
                    vue.failedLogin = true;
                }
            };

            xhttp.open("POST", "/login", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ email: "henry.yinchen@gmail.com", password: " " }));
        },
        loginWithFacebook: function () {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                  window.location.href = "task_page.html";
                } else if (this.readyState == 4 && this.status == 401) {
                    vue.failedLogin = true;
                }
            };

            xhttp.open("POST", "/login", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ email: "henry.yinchen@gmail.com", password: " " }));
        }
    }
});