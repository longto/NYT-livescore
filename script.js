var storeObject = function(key,object){
  sessionStorage.setItem(key, JSON.stringify(object));
}
var retrieveObject = function(key){
  return JSON.parse(sessionStorage.getItem(key));
}

    var config = {
      apiKey: "AIzaSyCv-9uJoc3lugtnPqN6VklRMH72Ujz0eUg",
      authDomain: "nyt-livescore.firebaseapp.com",
      databaseURL: "https://nyt-livescore.firebaseio.com",
      projectId: "nyt-livescore",
      storageBucket: "nyt-livescore.appspot.com",
      messagingSenderId: "26355614222"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user);
        // var displayName = user.displayName;
        // var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
      } else {
        console.warn("User is signed out.");
      }
    });

    // function writeUserData(userId, name, email, imageUrl) {
    //   firebase.database().ref('users/' + userId).set({
    //     username: name,
    //     email: email,
    //     profile_picture : imageUrl
    //   });
    // }
    // writeUserData("1","long","long.to@niteco.se","https://www.w3schools.com/css/trolltunga.jpg");

    var doWelcome = function(e){
      var userId = firebase.auth().currentUser.uid;
      return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        console.log(snapshot.val());
      });
    }

    var doLogin = function(e){
      var form = document.querySelector("#login"),
          email = form.querySelector("#email").value,
          password = form.querySelector("#password").value;
          //console.log(email,password);
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        console.error(error);
      }).then(function(user){
        console.log(user);
        //sessionStorage.setItem("firebase",firebase);
        doWelcome();
        //window.location.href="index.html";
      });
    }

    var doRegister = function(e) {
      var form = document.querySelector("#register"),
          email = form.querySelector("#email").value,
          password = form.querySelector("#password").value;
          //console.log(email,password);
      firebase.auth().createUserWithEmailAndPassword(email,password).catch(function(error) {
        console.error(error);
      }).then(function(user){
        console.log(user);
        //window.location.href="login.html";
      });
    }
