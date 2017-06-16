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

var checkLoginStatus = function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user, "is logged in");
      // var displayName = user.displayName;
      // var email = user.email;
      // var emailVerified = user.emailVerified;
      // var photoURL = user.photoURL;
      // var isAnonymous = user.isAnonymous;
      // var uid = user.uid;
      // var providerData = user.providerData;
      $('#content').removeClass("hide");
      $('body').removeClass("home-page");
      doWelcome();
    } else {
      console.warn("User is signed out.");
      $('#loginModal').modal('show');
      $('body').addClass("home-page");
    }
  });
}

checkLoginStatus();

var ce = function(tag,options,child){
  var tag = document.createElement(tag);
  if (options){
    for (var attr in options) {
      tag.setAttribute(attr,options[attr]);
    }
  }
  if (child) tag.innerHTML=child;
  return tag;
}
var createTable = function(data){
  //console.log(data);
  var count = 0;
  var table = ce('table');
  for (var id in data) {
    var item = data[id];
    if (count==0){
      var tr = ce('tr');
      for(var attr in item){
        tr.appendChild(ce('th',null,attr));
      }
      tr.appendChild(ce('th',null,'Action'));
      table.appendChild(tr);
    }
    var tr = ce('tr');
    for(var attr in item){
      tr.appendChild(ce('td',null,item[attr]));
    }
    var td=ce('td',{
      "readonly" : true
    });
    var edit=ce('span',{
      'class':'glyphicon glyphicon-pencil action',
      'title' : 'edit',
      'data-id' : id,
      'data-status' : 'edit'
    });
    edit.addEventListener('click',function(e){
      var that = e.target;
      var id = that.dataset.id;
      if (that.dataset.status=="edit") {
        that.dataset.status="update";
        $(that).closest("tr").find("td:not([readonly])").attr("contenteditable",true);
        $(that).removeClass("glyphicon-pencil").addClass("glyphicon-refresh");
      }
      else {
        that.dataset.status="edit";
        var newPost = {};
        $(that).closest("tr").find("td:not([readonly])").each(function(e){
          newPost[e==0?"category":e==1?"image":"title"]=this.innerHTML;
        }).removeAttr("contenteditable");
        //console.log(id,newPost);
        database.ref("posts/"+id+"/").set(newPost);
        $(that).removeClass("glyphicon-refresh").addClass("glyphicon-pencil");
      }
    });
    var remove=ce('span',{
      'class':'glyphicon glyphicon-remove text-danger action',
      'title' : 'delete',
      'data-id' : id
    });
    remove.addEventListener('click',function(e){
      //console.log(e.target.dataset.id);
      var that = e.target;
      var id = that.dataset.id;
      database.ref("posts/"+id+"/").remove();
      $(that).closest("tr").remove();
    });
    td.appendChild(edit);
    td.appendChild(remove);
    tr.appendChild(td);
    table.appendChild(tr);
    count++;
  }
  document.querySelector("#content").appendChild(table);
  //console.log(table);
  return table;
}

var doWelcome = function(e){
  var refPosts = database.ref("posts/");
  refPosts.once("value", function(data) {
    createTable(data.val());
  });
  //listen for the change
  refPosts.on("value", function(data) {
    console.log(data.val());
  });
  //listen for the child add
  refPosts.on("child_added", function(data) {
    console.log(data.val());
  });
  //listen for the child update
  refPosts.on("child_changed", function(data) {
    console.log(data.val());
  });
  //listen for the child remove
  refPosts.on("child_changed", function(data) {
    console.log(data.val());
  });

  var newPostRef = database.ref("posts/").push({
    "title" : "alone in mountain"+Math.floor(Math.random()*1000),
    "category" : "travel"+Math.floor(Math.random()*1000),
    "image" : "https://www.w3schools.com/css/trolltunga.jpg"
  });
  console.log("push new post with Id = "+newPostRef.key);
  database.ref("posts").on('value', function(snapshot) {
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
    checkLoginStatus();
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
