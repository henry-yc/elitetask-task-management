function showAboutUs() {
    document.getElementById("aboutUs").style.display = "block";
}

function showContactUs() {
    document.getElementById("contactUs").style.display = "block";
}

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

// For some reason when Vue.js is active, shortened form of DOM get methods don't work
var newTask = document.getElementById("newTask");

// Show new task modal box
function createNewTask() {
    document.getElementById("newTask").style.display = "block";
}

// Hide new task modal box
function closeNewTask() {
    document.getElementById("newTask").style.display = "none";
}

// If the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById("uploadBox")) { // Close upload box
        document.getElementById("uploadBox").style.display = "none";
    }
    if (event.target == document.getElementById("editProfile")) { // Close edit profile box
        document.getElementById("editProfile").style.display = "none";
    }
    if (event.target == document.getElementById("login")) { // Close login box
    document.getElementById("login").style.display = "none";
    }
    if (event.target == document.getElementById("newTask")) {
        document.getElementById("newTask").style.display = "none";
    }
    if (event.target == document.getElementById("userMenu")) {
        document.getElementById("userMenu").style.display = "none";
    }
    if (event.target == document.getElementById("dialogue")) {
        document.getElementById("dialogue").style.display = "none";
    }
    if (event.target == document.getElementById("editTask")) {
        document.getElementById("editTask").style.display = "none";
    }
    if (event.target == document.getElementById("searchResults")) {
        document.getElementById("searchResults").style.display = "none";
    }
    if (event.target == document.getElementById("usersCard")) {
        document.querySelector("#usersCard").style.display = "none";
    }
    if (event.target == document.getElementById("newTaskTypeBox")) {
        document.querySelector("#newTaskTypeBox").style.display = "none";
    }
    if (event.target == document.getElementById("aboutUs")) {
        document.getElementById("aboutUs").style.display = "none";
    }
    if (event.target == document.getElementById("contactUs")) {
        document.getElementById("contactUs").style.display = "none";
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

if (window.location.pathname=="/profile.html" || window.location.pathname=="/task_page.html") {
    // Hide the user account menu when user clicks away
    document.addEventListener("click", function(event) {
        // If user clicks inside the element, do nothing
        if (event.target.closest("#userMenu")) return;
        // If user clicks profile icon, do nothing also (otherwise clicking the icon also hides div so it never opens)
        if (event.target.closest(".profileicon")) return;
        // Else hide user account menu on any click
        document.getElementById("userMenu").style.display = "none";
    });
}

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
    auth2.signOut();
}


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

// Close user account menu
function closeMenu() {
  document.getElementById("userMenu").style.display = "none";
}

function closeDialogue() {
    document.getElementById("dialogue").style.display = "none";
}

function closeEditTask() {
  document.getElementById("editTask").style.display = "none";
}

function closeWarningBoxPreferences() {
    document.getElementById("warningBoxPreferences").style.display = "none";
}

function closeWarningBoxAvailability() {
    document.getElementById("warningBoxAvailability").style.display = "none";
}

// function showConfirmationBox() { // Confirmation for deleting task
//     document.getElementById("confirmationBox").style.display = "block";
// }

// function closeConfirmationBox() {
//     document.getElementById("confirmationBox").style.display = "none";
// }

function showCompleteConfirmation() {
    document.getElementById("markCompleteBox").style.display = "block";
}

function closeCompleteConfirmation() {
    document.getElementById("markCompleteBox").style.display = "none";
}

function closeSearchResults() {
    document.getElementById("searchResults").style.display = "none";
}

function closeUsersCard() {
    document.querySelector("#usersCard").style.display = "none";
}

function closeNewTaskTypeBox() {
    document.querySelector("#newTaskTypeBox").style.display = "none";
}

// Refresh user's avatar on the profile page with new upload
if (window.location.pathname=="/profile.html") {
    Dropzone.options.dropzone = {
        // maxFilesize: 4096,
        init: function () {
            this.on("complete", function (file) {
                vue.getProfile();
            });
        }
    };
}

if (window.location.pathname=="/signup.html") {
    Vue.component('password', Password);
}

if (window.location.pathname=="/task_page.html") {
    Vue.component('tinymce', VueEasyTinyMCE);
}

var vue = new Vue ({
    el: "#vue",
    data: {
        currentPage: null,
        aboutMe: "",
        availability: {Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false},
        preferences: [""],
        taskTypes: [],
        file: null,
        onlyOpenID: null,
        isManager: null,
        isManagerSelection: null,
        currentUser: {socialMedia: {google: null, facebook: null}, onlineCalendar: {google: null}, isManager: null},
        nightmode: true,
        updatedProfile: {userid: "", firstName: "", lastName: "", email: "", aboutMe: "", availability: {}, preferences: []},
        password: {old: null, new: null},
        incorrectPassword: false,
        fname: "",
        lname: "",
        email: "",
        userPassword: "",
        suggestions: "",
        warning: "",
        score: "",
        // isManager: "",
        emailExists: false,
        failedLogin: false,
        // currentUser: {},
        upcoming: [],
        pending: [],
        completed: [],
        downarrow1: true,
        uparrow1: false,
        downarrow2: true,
        uparrow2: false,
        uparrow3: true,
        downarrow3: false,
        tTitle: "",
        tDetails: "",
        tTeam: [""],
        tPriority: "",
        tType: "",
        dueDay: "",
        dueTime: "",
        reqApproval: false,
        newTitle: "",
        newDetails: "",
        newTeam: [""],
        newPriority: "",
        newType: "",
        newDueDay: "",
        newDueTime: "",
        newReqApproval: false,
        membersToRemove: [],
        members: [],
        // taskTypes: [],
        // nightmode: false,
        currentTaskId: "",
        currentDialoguesTitle: "",
        currentDialogues: "",
        currentTaskPending: false,
        currentTaskCompleted: false,
        currentTaskManager: "",
        currentTaskTeam: [],
        managerCard: false,
        teamCard: false,
        postSubject: "",
        postContent: "",
        editedPostSubject: "",
        editedPostContent: "",
        currentPostId: "",
        notPreferred: [],
        submitType: "",
        unavailable: [],
        reqToComplete: false,
        searchQuery: "",
        searchResults: [],
        filterString: "",
        filterResults: [],
        // Originals used for filtering tasks
        originalUpcoming: [],
        originalPending: [],
        originalCompleted: [],
        // Keep track of which order the tasks are being sorted
        sortedByName: 0,
        sortedByType: 0,
        sortedByDate: 1, // Already incremented as tasks start off sorted
        timer: '',
        // showNewTaskType: ''
        newTaskType: "",
        taskTypeExists: false,
        googleEmailExists: false
    },
    created: function() {
        this.currentPage = window.location.pathname;
        this.initialise();
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
        },
        tDueDate: function() {
            return this.dateToMs(this.dueDay, this.dueTime);
        },
        newDueDate: function() {
            return this.dateToMs(this.newDueDay,this.newDueTime);
        }
    },
    methods: {
        initialise: function() {
            if (this.currentPage=="/profile.html") {
                this.getNightmode();
                this.getProfile();
                this.getTaskTypes();
            } else if (this.currentPage=="/post_registration.html") {
                this.getSignUpMethod();
                this.getAccountType();
                this.getTaskTypes();
            } else if (this.currentPage=="/task_page.html") {
                this.getNightmode();
                this.getCurrentUser();
                this.getTasks();
                this.getTaskTypes();
                this.getMembersList();
                this.timer = setInterval(this.getTasks, 60000);
                // setInterval(this.getTasks, 1000);
            }
        },
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
        // For passwor strength meter
        showFeedback ({suggestions, warning}) {
            this.suggestions = suggestions;
            this.warning = warning;
        },
        showScore (score) {
            this.score = score;
        },
        linkGoogleAccount: function() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signIn().then(function() {
                var id_token = auth2.currentUser.get().getAuthResponse().id_token;
                // Update user's profile with Google account information
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        vue.getProfile();
                        vue.googleEmailExists = false;
                    } else if (this.readyState == 4 && this.status == 409) {
                        vue.googleEmailExists = true;
                    }
                };
                xhttp.open("POST", "/users/googleaccount", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify({token: id_token}));

            });
        },
        authorizeGoogleCalendar: function(event) {
            if (window.location.pathname=="/profile.html") {
                gapi.auth2.getAuthInstance().signIn().then(function() {
                    // Update user's profile to show link
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            vue.getProfile();
                        }
                    };
                    xhttp.open("POST", "/users/googlecalendar", true);
                    xhttp.setRequestHeader("Content-type", "application/json");
                    xhttp.send();
                });
            } else {
                gapi.auth2.getAuthInstance().signIn();
            }
        },
        unlinkGoogleCalendar: function(event) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.getProfile();
                }
            };
            xhttp.open("POST", "/users/unlinkgooglecalendar", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        addPreferencePostReg: function () {
            this.preferences.push("");
        },
        removePreferencePostReg: function (index) {
            this.preferences.splice(index, 1);
            if(this.preferences.length===0) {
                this.addPreferencePostReg();
            }
        },
        getSignUpMethod: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.onlyOpenID = (JSON.parse(this.responseText)).onlyOpenID;
                    // console.log(vue.onlyOpenID);
                    // console.log(JSON.parse(this.responseText));
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
        },
        // Set nightmode according to cookie
        getNightmode: function() {
            if (this.getCookie("nightmode")=="") {
                this.nightmode = true;
                this.setNightmodeCookie();
            } else {
                this.nightmode = (this.getCookie("nightmode")=="true");
            }
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
        addPreferenceProfile: function () {
            this.updatedProfile.preferences.push("");
        },
        removePreferenceProfile: function (index) {
            this.updatedProfile.preferences.splice(index, 1);
            if(this.updatedProfile.preferences.length===0) {
                this.addPreferenceProfile();
            }
        },
        getCurrentUser: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.currentUser = JSON.parse(this.responseText);
                }
            };
            xhttp.open("GET", "/users/currentuser", true);
            xhttp.send();
        },
        getTasks: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var tasks = JSON.parse(this.responseText);
                    // Sort tasks by due date, with closer due dates ordered first
                    tasks.sort(function(a,b){return a.dueDate - b.dueDate});
                    vue.upcoming = [];
                    vue.pending = [];
                    vue.completed = [];
                    for (var i=0; i<tasks.length; i++) {
                        if (tasks[i].pending == false && tasks[i].completed == false) {
                            vue.upcoming.push(tasks[i]);
                        } else if (tasks[i].pending == true) {
                            vue.pending.push(tasks[i]);
                        } else {
                            vue.completed.push(tasks[i]);
                        }
                    }
                    // Deepcopy - Originals used for filtering tasks
                    vue.originalUpcoming = JSON.parse(JSON.stringify(vue.upcoming));
                    vue.originalPending = JSON.parse(JSON.stringify(vue.pending));
                    vue.originalCompleted = JSON.parse(JSON.stringify(vue.completed));
                }
            };
            xhttp.open("GET", "/users/tasks", true);
            xhttp.send();
        },
        getMembersList: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.members = JSON.parse(this.responseText);
                }
            };
            xhttp.open("GET", "/users/managers/memberslist", true);
            xhttp.send();
        },
        dateToMs: function(day, time) {
            return Date.parse(day + "T" + time);
        },
        dateToString: function(date) {
            var today = new Date;
            var d = new Date(date);
            var localeTimeString = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            // Display the day of week if within the week
            if (Math.abs(this.getCurrentTime() - date) <= 3*24*60*60*1000) {
                if (today.toLocaleDateString()===d.toLocaleDateString()) { // If due today
                    return "Today, " + localeTimeString; // expected output: Today, 12:00 PM
                } else {
                    return this.getDayOfWeek(date) + ", " + localeTimeString;
                }
            } else {
                return d.toLocaleDateString() + ", " +  localeTimeString; // expected output: "7/25/2016, 12:00 PM"
            }
        },
        dateToDashString: function(date) { // Expected output: "yyyy-mm-dd"
            var d = new Date(date); //
            var year = d.getFullYear();
            var month = ("0" + (d.getMonth() + 1)).slice(-2);
            var day = ("0" + d.getDate()).slice(-2);
            return year + "-" + month + "-" + day;
        },
        dateToLocaleString: function(date) {
            var d = new Date(date);
            return d.toLocaleString(); // expected output: "7/25/2016, 1:35:07 PM"
        },
        dateToFullString: function(date) { // returns full date and time of input
            var d = new Date(date);
            return d;
        },
        dateToLocaleTimeString: function(date) {
            var d = new Date(date);
            return d.toLocaleTimeString(); // expected output: "1:35:07 PM"
        },
        getCurrentTime: function() { // Return current time in ms
              return Date.parse(new Date());
        },
        getCurrentTimeString: function() {  // Return current time as string
            return new Date(); // Date Fri Jun 26 2020 15:49:16 GMT+0930 (Australian Central Standard Time)
        },
        getTimeString: function(date) {
            var d = new Date(date);
            var time = d.toString().split(' ')[4];
            return time; // 18:00:00
        },
        toggleUpcoming: function() {
            this.uparrow1=!this.uparrow1;
            var upcomingBody = document.getElementById("upcoming-body");
            if (upcomingBody.style.display == "none") {
                upcomingBody.style.display = "table-row-group";
            } else {
                upcomingBody.style.display = "none";
            }
        },
        togglePending: function() {
            this.uparrow2=!this.uparrow2;
            var pendingBody = document.getElementById("pending-body");
            if (pendingBody.style.display == "none") {
                pendingBody.style.display = "table-row-group";
            } else {
                pendingBody.style.display = "none";
            }
        },
        toggleCompleted: function() {
            this.uparrow3=!this.uparrow3;
            this.downarrow3=!this.downarrow3;
            var completedBody = document.getElementById("completed-body");
            if (completedBody.style.display == "none") {
                completedBody.style.display = "table-row-group";
            } else {
                completedBody.style.display = "none";
            }
        },
        addMember: function () {
            this.tTeam.push('');
        },
        addMemberEdit: function () {
            this.newTeam.push('');
        },
        removeMember: function (index) {
            this.tTeam.splice(index, 1);
            if(this.tTeam.length===0) {
                this.addMember();
            }
        },
        removeMemberEdit: function (index) {
            this.membersToRemove.push(this.newTeam[index].userid);
            this.newTeam.splice(index, 1);
            if(this.newTeam.length===0) {
                this.addMemberEdit();
            }
        },
        openNewTaskType: function() {
            this.newTaskType = "";
            this.taskTypeExists = false;
            document.getElementById("newTaskTypeBox").style.display = "block";
        },
        submitNewTaskType: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.taskTypeExists = false;
                    vue.newTaskType = "";
                    vue.getTaskTypes();
                    closeNewTaskTypeBox();
                } else if (this.readyState == 4 && this.status == 409) {
                    vue.taskTypeExists = true;
                }
            };
            xhttp.open("POST", "/users/managers/addnewtasktype", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({taskType: this.newTaskType}));
        },
        inArray: function(array, item) {
            for (var i=0;i<array.length;i++) {
                if (array[i] === item) {
                return true;
                }
            }
            return false;
        },
        checkPreferences: function(submitType, dueDate, taskType, team) { // Check task type with users' preferences
            this.submitType = submitType;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var team = JSON.parse(this.responseText);
                    vue.notPreferred = [];
                    for (var i=0; i<team.length; i++) {
                        if (!vue.inArray(team[i].preferences, taskType)) { // If user does not prefer task
                            vue.notPreferred.push(team[i].name);            // Push user to array
                        }
                    }
                    if (vue.notPreferred.length === 0) {    // If task type does not clash with any preferences
                        vue.checkAvailability(dueDate, team); // Go on to check users' availability
                    } else {
                        document.querySelector("#warningBoxPreferences").style.display = "block"; // Otherwise show warning message
                    }

                }
            };
            xhttp.open("POST", "/users/managers/checkpreferences", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(team));
        },
        getDayOfWeek: function(date) { // Return the day of the week from a given date (in ms)
            var d = new Date(date);
            var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            return weekday[d.getDay()];
        },
        checkAvailability: function(date, team) { // Check users' availability against the task due date
            var dueDay = this.getDayOfWeek(date);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var team = JSON.parse(this.responseText);
                    vue.unavailable = [];
                    for (var i=0; i<team.length; i++) {
                        if (team[i].availability[dueDay]==false) { // If user is unavailable on due date
                            vue.unavailable.push(team[i].name);     // Push user to array
                        }
                    }
                    if (vue.unavailable.length===0) {   // Empty array means due date does not clash with any user's availability
                        if (vue.submitType === "newTask") { // Submit or update to server depending on whether it's a new task or an edit
                            vue.submitTask();
                        } else {
                            vue.updateTask();
                        }
                    } else {
                        document.querySelector("#warningBoxAvailability").style.display = "block";
                    }
                }
            };
            xhttp.open("POST", "/users/managers/checkavailability", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(team));
        },
        submitTask: function () {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    console.log(response);
                    vue.addCalendarEvent(response.taskid, response.membersEmails);
                    vue.getTasks();
                    document.getElementById("newTask").style.display = "none";
                    // Clear the fields
                    vue.tTitle = "";
                    vue.tDetails = "";
                    vue.tTeam = [""];
                    vue.tPriority = "";
                    vue.tType = "";
                    vue.dueDay = "";
                    vue.dueTime = "";
                    vue.reqApproval = false;
                }
            };
            xhttp.open("POST", "/users/managers/addtask", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({title: this.tTitle, manager: {userid: this.currentUser.userid, name: this.currentUserName}, team: this.tTeam, priority: this.tPriority, status: "Not started", type: this.tType, dueDate: this.tDueDate, reqApproval: this.reqApproval, pending: false, completed: false, completedDate: null,
                                        dialogues: [{ author: {userid: this.currentUser.userid, name: this.currentUserName}, date: this.getCurrentTime(), subject: "Task details", content: this.tDetails }] }));

        },
        addCalendarEvent: function(taskid, membersEmails) {
            var startDay = this.dateToDashString(this.tDueDate);
            // var startTime = this.dateToLocaleTimeString(this.tDueDate).split(' ')[0];
            var startTime = this.getTimeString(this.tDueDate);
            var endDateTime = this.tDueDate + 1;
            var endDay = this.dateToDashString(endDateTime);
            // var endTime = this.dateToLocaleTimeString(endDateTime).split(' ')[0];
            var endTime = this.getTimeString(endDateTime);
            var event = {
                'summary': this.tTitle,
                'description': this.tDetails,
                'start': {
                    'timeZone': 'Australia/Adelaide'
                },
                'end': {
                    'dateTime': endDay + "T" + endTime,
                    'timeZone': 'Australia/Adelaide'
                },
                'attendees': membersEmails,
                'reminders': {
                    'useDefault': false,
                    'overrides': [{
                            'method': 'email',
                            'minutes': 24 * 60
                        },
                        {
                            'method': 'popup',
                            'minutes': 10
                        }
                    ]
                }
            };

            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event,
                'sendUpdates': "all" // Send email notification on event creation and cancellation
            });

            request.execute(function(event) {
                console.log('Event created: ' + event.htmlLink);
                // console.log('Event id: ' + event.id);
                // console.log(event);
                vue.addEventId(taskid, event.id);
            });
        },
        addEventId: function(taskid, eventid) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // Do something
                }
            };
            xhttp.open("POST", "/users/managers/eventid", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({taskid: taskid, eventid: eventid}));
        },
        updateStatus: function(array, index) { // Update the status of the selected task
            var taskid = array[index].taskid;
            var status = array[index].status;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.getTasks();
                }
            };
            xhttp.open("POST", "/users/updatestatus", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({taskid: taskid, status: status}));
        },
        openDialogue: function (array, index) { // Open the dialogue box and load corresponding posts
            document.getElementById("dialogue").style.display = "block";
            this.currentTaskId = array[index].taskid;
            this.currentDialoguesTitle = array[index].title;
            this.currentDialogues = array[index].dialogues;
            this.currentDialogues.sort(function(a,b){return a.date - b.date});
            this.currentTaskPending = array[index].pending;
            this.currentTaskCompleted = array[index].completed;
        },
        submitPost: function () {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.postSubject = "";
                    vue.postContent = "";
                    vue.reqToComplete = false;
                    vue.getTasks();
                    var newPost = JSON.parse(this.responseText);
                    vue.currentDialogues.push(newPost);
                }
            };
            xhttp.open("POST", "/users/addpost", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({taskid: this.currentTaskId, reqToComplete: this.reqToComplete, newPost: { author: {userid: this.currentUser.userid, name: this.currentUserName, avatar: this.currentUser.avatar}, date: this.getCurrentTime(), subject: this.postSubject, content: this.postContent }}));
        },
        markTaskComplete: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.getTasks();
                }
            };
            xhttp.open("POST", "/users/managers/completetask", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({taskid: this.currentTaskId}));
        },
        toggleMoreOptions: function(index) {
            var menu = document.getElementsByClassName("more-options")[index];
            if (menu.style.display == "block") {
                menu.style.display = "none";
            } else {
                menu.style.display = "block";
            }
        },
        hidePost: function(index) {
            document.getElementsByClassName("dialogue-post")[index].style.display = "none";
        },
        editPost: function(index) {
            // Hide all open menus
            for (var i=0; i<document.getElementsByClassName("more-options").length; i++) {
                document.getElementsByClassName("more-options")[i].style.display = "none";
            }
            var post = document.getElementsByClassName("dialogue-post")[index];
            document.getElementsByClassName("editor")[index].style.display = "block";
            this.editedPostSubject = this.currentDialogues[index].subject;
            this.editedPostContent = this.currentDialogues[index].content;
            post.style.display = "none";
        },
        updatePost: function(index) {
            this.currentPostId = this.currentDialogues[index].postid;
            var author = this.currentDialogues[index].author;
            var date = this.currentDialogues[index].date;
            // var editDate = '<p><em><span style="color: #95a5a6;">Edited ' + this.getCurrentTimeString() + '</span></em></p>';
            var post = document.getElementsByClassName("dialogue-post")[index];
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var updatedPost = JSON.parse(this.responseText);
                    vue.currentDialogues[index] = updatedPost;
                    vue.getTasks();
                    vue.hideEditor(index);
                }
            };

            xhttp.open("POST", "/users/editpost", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({postid: this.currentPostId, author: author, date: date, subject: this.editedPostSubject, content: this.editedPostContent, editDate: this.getCurrentTime()}));
        },
        hideOtherEditors: function(index) {
            var editors = document.getElementsByClassName("editor");
            var posts = document.getElementsByClassName("dialogue-post");
            for (var i=0; i<editors.length; i++) {
                if (editors[i] !== editors[index]) {
                    editors[i].style.display = "none";
                    posts[i].style.display = "block";
                }
            }
        },
        hideEditor: function(index) {
            document.getElementsByClassName("editor")[index].style.display = "none";
            document.getElementsByClassName("dialogue-post")[index].style.display = "block";
        },
        deletePost: function(index) {
            this.currentPostId = this.currentDialogues[index].postid;
            var post = document.getElementsByClassName("dialogue-post")[index];
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.currentDialogues.splice(index, 1);
                    vue.getTasks();
                }
            };

            xhttp.open("POST", "/users/deletepost", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({taskid: this.currentTaskId, postid: this.currentPostId}));
        },
        openEditTask: function(array,index) {
            this.currentTaskId = array[index].taskid;
            this.currentPostId = array[index].dialogues[0].postid;
            this.newTitle = array[index].title;
            this.newDetails = array[index].dialogues[0].content;
            this.newTeam = JSON.parse(JSON.stringify(array[index].team));
            this.newPriority = array[index].priority;
            this.newType = array[index].type;
            this.newDueDay = this.dateToDashString(array[index].dueDate);
            // this.newDueTime = this.dateToLocaleTimeString(array[index].dueDate).split(' ')[0]; // Need to split as FireFox adds AM/PM to the end which makes it incompatible with date selector
            this.newDueTime = this.getTimeString(array[index].dueDate);
            this.newReqApproval = array[index].reqApproval;
            this.membersToRemove = [];
            document.getElementById("editTask").style.display = "block";

        },
        updateTask: function() {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    vue.updateCalendarEvent(response.eventid, response.membersEmails);
                    vue.getTasks();
                    document.getElementById("editTask").style.display = "none";
                }
            };

            xhttp.open("POST", "/users/managers/edittask", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({taskid: this.currentTaskId, postid: this.currentPostId, newTitle: this.newTitle, newDetails: this.newDetails, newTeam: this.newTeam, newPriority: this.newPriority, newType: this.newType, newDueDate: this.newDueDate, newReqApproval: this.newReqApproval, toRemove: this.membersToRemove }));
        },
        updateCalendarEvent: function(eventid, membersEmails) {
            var startDay = this.dateToDashString(this.newDueDate);
            // var startTime = this.dateToLocaleTimeString(this.newDueDate).split(' ')[0];
            var startTime = this.getTimeString(this.newDueDate);
            var endDateTime = this.newDueDate + 1;
            var endDay = this.dateToDashString(endDateTime);
            // var endTime = this.dateToLocaleTimeString(endDateTime).split(' ')[0];
            var endTime = this.getTimeString(endDateTime);

            // Get event
            gapi.client.calendar.events.get({
                calendarId: 'primary',
                eventId: eventid
            }).execute(function(event) {
                // Update event
                event.summary = vue.newTitle;
                event.description = vue.newDetails;
                event.start.dateTime = startDay + "T" + startTime;
                event.end.dateTime = endDay + "T" + endTime;
                event.attendees = membersEmails;

                var request = gapi.client.calendar.events.update({
                    calendarId: 'primary',
                    eventId: eventid,
                    resource: event
                });

                request.execute(function(response) {
                    console.log(response);
                });
            });
        },
        requireApproval: function(bool) {
            if (bool==true) {
                return "Yes";
            } else {
                return "No";
            }
        },
        deleteTask: function() {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var eventid = this.responseText;
                    vue.deleteCalendarEvent(eventid);
                    vue.getTasks();
                    document.getElementById("editTask").style.display = "none";
                }
            };

            xhttp.open("POST", "/users/managers/deletetask", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({taskid: this.currentTaskId}));
        },
        deleteCalendarEvent: function(eventid) {
            var request = gapi.client.calendar.events.delete({
                calendarId: 'primary',
                eventId: eventid,
            });

            request.execute(function(response) {
                console.log(response);
            });

        },
        showSearchResults: function() {
            document.getElementById("searchResults").style.display = "block";
        },
        searchUsers: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vue.searchResults = JSON.parse(this.responseText);
                    vue.showSearchResults();
                }
            };
            xhttp.open("GET", "/users/managers/search?q=" + encodeURIComponent(this.searchQuery), true);
            xhttp.send();
        },
        getAvailabilityArray: function(availability) {
            var availabilityArray = [];
            for (day in availability) {
                if (availability[day]==true) {
                    availabilityArray.push(day);
                }
            }
            return availabilityArray;
        },
        showManager: function(array, index) {
            document.querySelector("#usersCard").style.display = "block";
            this.currentTaskManager = array[index].manager;
            this.teamCard = false;
            this.managerCard = true;
        },
        showTeam: function(array, index) {
             document.querySelector("#usersCard").style.display = "block";
             this.currentTaskTeam = array[index].team;
             this.managerCard = false;
             this.teamCard = true;
        },
        filterTasks: function() {
            if (this.filterString==="") {
                this.upcoming = this.originalUpcoming;
                this.pending = this.originalPending;
                this.completed = this.originalCompleted;
            } else {
                var filter = this.filterString.toLowerCase();
                // Filter upcoming tasks
                this.upcoming = [];
                for (var i=0;i<this.originalUpcoming.length; i++) {
                    if (this.originalUpcoming[i].title.toLowerCase().includes(filter)) {
                        this.upcoming.push(this.originalUpcoming[i]);
                    }
                }
                // Filter pending tasks
                this.pending = [];
                for (var i=0;i<this.originalPending.length; i++) {
                    if (this.originalPending[i].title.toLowerCase().includes(filter)) {
                        this.pending.push(this.originalPending[i]);
                    }
                }
            }
        },
        sortByName: function() {
            this.sortedByDate = 0;
            this.sortedByType = 0;

            var nameAsc = function(a,b){var x = a.title.toLowerCase();var y = b.title.toLowerCase();if (x < y) {return -1;}if (x > y){return 1;}return 0;};
            var nameDsc = function(a,b){var x = a.title.toLowerCase();var y = b.title.toLowerCase();if (x < y){return 1;}if (x > y) {return -1;}return 0;};

            if (this.sortedByName%2===0) {
                //  First sort by ascending order
                this.upcoming.sort(nameAsc);
                this.pending.sort(nameAsc);
                this.completed.sort(nameAsc);
                this.sortedByName++;
            } else {
                // Then sort by descending order
                this.upcoming.sort(nameDsc);
                this.pending.sort(nameDsc);
                this.completed.sort(nameDsc);
                this.sortedByName++;
            }
        },
        sortByType: function() {
            this.sortedByName = 0;
            this.sortedByDate = 0;

            var typeAsc = function(a,b){var x = a.type.toLowerCase();var y = b.type.toLowerCase();if (x < y) {return -1;}if (x > y){return 1;}return 0;};
            var typeDsc = function(a,b){var x = a.type.toLowerCase();var y = b.type.toLowerCase();if (x < y){return 1;}if (x > y) {return -1;}return 0;};

            if (this.sortedByType%2===0) {
                //  Sort by ascending order
                this.upcoming.sort(typeAsc);
                this.pending.sort(typeAsc);
                this.completed.sort(typeAsc);
                this.sortedByType++;
            } else {
                // Sort by descending order
                this.upcoming.sort(typeDsc);
                this.pending.sort(typeDsc);
                this.completed.sort(typeDsc);
                this.sortedByType++;
            }
        },
        sortByDate: function() {
            this.sortedByName = 0;
            this.sortedByType = 0;

            var intAsc = function(a,b){return a.dueDate - b.dueDate};
            var intDsc = function(a,b){return b.dueDate - a.dueDate};

            // Sort by ascending order
            if (this.sortedByDate%2===0) {
                //  Sort by ascending order
                this.upcoming.sort(intAsc);
                this.pending.sort(intAsc);
                this.completed.sort(intAsc);

                this.sortedByDate++;
            } else {
                // Sort by descending order
                // var intDsc = function(a,b){return b.dueDate - a.dueDate};
                this.upcoming.sort(intDsc);
                this.pending.sort(intDsc);
                this.completed.sort(intDsc);

                this.sortedByDate++;
            }
        },
        // Returns the amount of time since date
        timeSince: function (date) {
            var seconds = Math.floor((new Date() - date) / 1000);

            var interval = Math.floor(seconds / 31536000);

            if (interval > 1) {
                return interval + " years";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + " months";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " days";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + " hours";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + " minutes";
            }
            return Math.floor(seconds) + " seconds";
        }
    },
    // Detect if toggle is clicked, then update the value of nightmode (and cookie) accordingly
    mounted: function() {
        if (this.currentPage == "/profile.html" || this.currentPage == "/task_page.html") {
            $(this.$refs.checkbox).bootstrapToggle().change(function(e) {
                this.nightmode = $(e.target).prop('checked');
                this.setNightmodeCookie();
            }.bind(this));
        }
    },
});