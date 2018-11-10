
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCF_52AjWU6l1f9C__FK8pSTFxd0bGMSmg",
    authDomain: "rps-online-62a53.firebaseapp.com",
    databaseURL: "https://rps-online-62a53.firebaseio.com",
    projectId: "rps-online-62a53",
    storageBucket: "rps-online-62a53.appspot.com",
    messagingSenderId: "32977836434"
};
firebase.initializeApp(config);

var database = firebase.database();

var player = "";



function setP1(name) {
    $("#p1").html("<p>" + name + "</p>");
    player = "p1";
}

function setP2(name) {
    $("#p2").html("<p>" + name + "</p>");
    player = "p2";
}

function play_game(){

    var rock = $("<img>" );

    $("#"+player+"-move").append() 

}

function update_page(data) {
    database.ref().once('value').then(function (snapshot) {
        if (snapshot.val().p1 === true) {
            database.ref(snapshot.val().p1_key).once('value').then(function (snapshot) {
                setP1(snapshot.val().name);
            });
        }
        if (snapshot.val().p2 === true) {
            console.log("???");
            database.ref(snapshot.val().p2_key).once('value').then(function (snapshot) {
                setP2(snapshot.val().name);
            });
        }
        if (snapshot.val().p1 === true && snapshot.val().p2 === true && player === "") {

            $("#player").css("display", "none");
            $("#input_display").html("<p>Too many players!</p>");
        }
        if (snapshot.val().p1 === true && snapshot.val().p2 === true && player != "") {

            //
        }

    });

}


$("document").ready(function () {

    database.ref().on("value", function (snapshot) {


        update_page(snapshot.val());
    });

    $("#player").submit(function (event) {
        event.preventDefault();

        var input = $("#player > input");
        if (input.val().trim() === "")
            alert("Invalid name!");
        else {
            database.ref().once('value').then(function (snapshot) {
                if (snapshot.val().p1 === false) {
                    var temp = database.ref().push({
                        name: input.val(),
                        move: "",
                        wins: 0
                    }).key;
                    database.ref().update({
                        p1: true,
                        p1_key: temp
                    });
                    player = "p1";
                    $("#input_display").html('<p>You are player 1</p>');
                }
                else if (snapshot.val().p2 === false) {
                    var temp = database.ref().push({
                        name: input.val(),
                        move: "",
                        wins: 0
                    }).key;
                    database.ref().update({
                        p2: true,
                        p2_key: temp
                    });
                    player = "p2"
                    $("#input_display").html('<p>You are player 2</p>');
                }
                $("#player").css("display", "none");
                $("#"+player+"_move > img").removeClass("d-none");
                $("#"+player+"_move > img").addClass("d-block");
                input.val("");                    

            });
        }

        $("document").on("click","img",function(){
            console.log(this);
        });

               
    });
});




