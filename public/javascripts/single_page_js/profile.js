var userMenu = document.getElementById("userMenu");

function toggleMenu() {
  if (document.getElementById("userMenu").style.display == "block") {
    document.getElementById("userMenu").style.display = "none";
  } else {
      document.getElementById("userMenu").style.display = "block";
  }
}

// Show upload box
function uploadAvatar() {
    document.getElementById("uploadBox").style.display = "block";
}


window.onclick = function(event) {
    if (event.target == document.getElementById("uploadBox")) { // Close upload box
        document.getElementById("uploadBox").style.display = "none";
    }
    if (event.target == document.getElementById("editProfile")) { // Close edit profile box
        document.getElementById("editProfile").style.display = "none";
    }
};

// Show confirmation box
function showConfirmationBox() {
    document.getElementById("confirmationBox").style.display = "block";
}

// Close confirmation box
function closeConfirmationBox() {
    document.getElementById("confirmationBox").style.display = "none";
}

// Hide the user account menu when user clicks away
document.addEventListener("click", function(event) {
    // If user clicks inside the element, do nothing
	if (event.target.closest("#userMenu")) return;
	// If user clicks profile icon, do nothing also (otherwise clicking the icon also hides div so it never opens)
	if (event.target.closest(".profileicon")) return;
	// Else hide user account menu on any click
    document.getElementById("userMenu").style.display = "none";
});

//Logout
function logout() {
    // End user session
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "index.html";
        }
    };
    xhttp.open("POST", "/users/logout", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

    // End GoogleAuth session if user is signed in with google
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    });
}

function googleAuth() {
    gapi.load('auth2', function() {
        auth2 = gapi.auth2.init({
            client_id: '93800279261-gth1fq4j4ukij0ecbrr0j1htrqpjjl0d.apps.googleusercontent.com',
        });
    });
}

var vue = new Vue ({
    el: "#main",
    data: {
        // currentUser: {userid: 2, firstName: "Henry", lastName: "Yin-Chen", email: "henry.yinchen@gmail.com", avatar: "23e092379ad791e387f491e79f1a17db", aboutMe: "I am a computer science student looking to further my skills in javascript", socialMedia: {google: true, facebook: true}, onlineCalendar: {google: true}, availability: {Sunday: false, Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: false}, preferences: ["Coding", "Brainstorming", "Lecture", "Proofing"], isManager: false},
        currentUser: {socialMedia: {google: null, facebook: null}, onlineCalendar: {google: null}, isManager: null},
        nightmode: false,
        updatedProfile: {userid: "", firstName: "", lastName: "", email: "", aboutMe: "", availability: {}, preferences: []},
        taskTypes: [],
        password: {old: null, new: null},
        incorrectPassword: false

    },
    computed: {
        currentUserName: function() {
            return this.currentUser.firstName + " " + this.currentUser.lastName;
        },
        currentUserAvailability: function() {
            var availability = [];
            for (day in this.currentUser.availability) {
                if (this.currentUser.availability[day]==true) {
                    availability.push(day);
                }
            }

            return availability;
        }
    },
    created: function() {
        this.initialise();
    },
    methods: {
        initialise: function() {
            this.getNightmode();
            this.getProfile();
            this.getTaskTypes();
        },
        // Set nightmode according to cookie
        getNightmode: function() {
            this.nightmode = (this.getCookie("nightmode")=="true");
        },
        // Set value of nightmode cookie according to settings
        setNightmodeCookie: function() {
            document.cookie = "nightmode=" + this.nightmode;
        },
        // Get value of a cookie
        getCookie: function(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        getProfile: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.currentUser = JSON.parse(this.responseText);
                }
            };
            xhttp.open("GET", "/users/profile", true);
            xhttp.send();
        },
        getInitials: function(name) {
            var initials = String(name).match(/\b(\w)/g);
            if (initials !== null) {
                return initials.join('');
            } return;
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
        openEditProfile: function() {
            document.getElementById("editProfile").style.display = "block";
            this.updatedProfile.userid = this.currentUser.userid;
            this.updatedProfile.firstName = this.currentUser.firstName;
            this.updatedProfile.lastName = this.currentUser.lastName;
            this.updatedProfile.email = this.currentUser.email;
            this.updatedProfile.aboutMe = this.currentUser.aboutMe;
            this.updatedProfile.availability = JSON.parse(JSON.stringify(this.currentUser.availability));
            this.updatedProfile.preferences = JSON.parse(JSON.stringify(this.currentUser.preferences));
        },
        updateProfile: function() {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.getProfile();
                    vue.closeEditProfile();
                }
            };

            xhttp.open("POST", "/users/updateprofile", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(this.updatedProfile));
        },
        openChangePassword: function() {
            document.getElementById("changePasswordBox").style.display = "block";
        },
        closeChangePassword: function() {
            document.getElementById("changePasswordBox").style.display = "none";
        },
        updatePassword: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.incorrectPassword = false;
                    vue.password.old = null;
                    vue.password.new = null;
                    vue.closeChangePassword();
                } else if (this.readyState == 4 && this.status == 401) {
                    vue.incorrectPassword = true;
                }
            };

            xhttp.open("POST", "/users/updatepassword", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({userid: this.currentUser.userid, password: this.password}));
        },
        deleteAvatar: function() {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.getProfile();
                }
            };

            xhttp.open("POST", "/users/deleteavatar", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({userid: this.currentUser.userid}));
        },
        // Close edit profile box
        closeEditProfile: function() {
            document.getElementById("editProfile").style.display = "none";
        },
        addItem: function () {
            this.updatedProfile.preferences.push("");
        },
        removeItem: function (index) {
            this.updatedProfile.preferences.splice(index, 1);
            if(this.updatedProfile.preferences.length===0) {
                this.addItem();
            }
        }
    },
    mounted: function() {
        $(this.$refs.checkbox).bootstrapToggle().change(function(e) {
            this.nightmode = $(e.target).prop('checked');
            this.setNightmodeCookie();
        }.bind(this));
    },
});