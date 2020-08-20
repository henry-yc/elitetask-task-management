// Initialise Google sign in
function googleAuth() {
    gapi.load('auth2', function() {
        auth2 = gapi.auth2.init({
            client_id: '93800279261-gth1fq4j4ukij0ecbrr0j1htrqpjjl0d.apps.googleusercontent.com',
        });
    });
}

function loginWithGoogle() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then(function() {
        var id_token = auth2.currentUser.get().getAuthResponse().id_token;
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
    el: "#signup",
    components: {
        'password': Password
    },
    data: {
        fname: "",
        lname: "",
        email: "",
        password: "",
        suggestions: "",
        warning: "",
        score: "",
        isManager: "",
        emailExists: false

    },
    methods: {
        submitForm: function () {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // redirect to post-registration page
                    window.location.href = "post_registration.html";
                } else if (this.readyState == 4 && this.status == 409) { // Email already exists
                    vue.emailExists = true;
                }
            };
            xhttp.open("POST", "/signup", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ firstName: this.fname, lastName: this.lname, email: this.email, password: this.userPassword, manager: this.isManager }));
        },
        signupWithFacebook: function () {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (vue.isManager == true) {
                        // redirect to manager post-registration page
                        window.location.href = "post_registration_manager.html";
                    } else {
                        // redirect to team member post-registration page
                        window.location.href = "post_registration_member.html";
                    }
                }
            };
            xhttp.open("POST", "/signup", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify());
        },
        showFeedback ({suggestions, warning}) {
            this.suggestions = suggestions;
            this.warning = warning;
        },
        showScore (score) {
            this.score = score;
        }
    }
});