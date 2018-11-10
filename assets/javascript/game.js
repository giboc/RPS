
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
var player_key;



function setP1(name) {
    $("#p1").html("<p>" + name + "</p>");
};

function setP2(name) {
    $("#p2").html("<p>" + name + "</p>");
};

function reset_game_board(){
    
    $("#timer_display").remove();
    $("#winning_move").html("");
    $("#" + player + "_move > img").removeClass("d-none");
    $("#" + player + "_move > img").addClass("d-block");
    if(player === "p1"){
        console.log("player===p1")
        $("#p2_move > img").addClass("d-none");
        $("#p2_move > img").removeClass("d-block");
    }
    else{
        $("#p1_move > img").addClass("d-none");
        $("#p1_move > img").removeClass("d-block");
    }
    database.ref(player_key).update({move: ""});
}

function compare_moves() {
    var p1;
    var p2;
    database.ref().once("value", function (snapshot) {
        p1 = snapshot.val().p1_key;
        p2 = snapshot.val().p2_key;
    });
    database.ref(p1).once("value", function (snapshot) {
        p1 = snapshot.val().move;
    });
    database.ref(p2).once("value", function (snapshot) {
        p2 = snapshot.val().move;
    });

    if (player === "p1") {
        $("#p2_" + p2).addClass("d-block");
        $("#p2_" + p2).removeClass("d-none");
    }
    else {
        $("#p1_" + p1).addClass("d-block");
        $("#p1_" + p1).removeClass("d-none");
    }


    if (p1 === p2)
        $("#winning_move").html("<p>It's a tie!</p>");
    else if (p1 === "rock") {
        if (p2 === "paper") {
            if (player === "p1")
                $("#winning_move").html("<p>You lose!</p>");
            else
                $("#winning_move").html("<p>You win!</p>");
        }
        else{
            if (player === "p1")
                $("#winning_move").html("<p>You win!</p>");
            else
                $("#winning_move").html("<p>You lose!</p>");
        }
    }
    else if (p1 === "paper") {
        if (p2 === "rock"){
            if (player === "p1")
                $("#winning_move").html("<p>You win!</p>");
            else
                $("#winning_move").html("<p>You lose!</p>");
        }
        else{
            if (player === "p1")
                $("#winning_move").html("<p>You lose!</p>");
            else
                $("#winning_move").html("<p>You win!</p>");
        }
            
    }
    else {
        if (p2 === "rock"){
            if (player === "p1")
                $("#winning_move").html("<p>You lose!</p>");
            else
                $("#winning_move").html("<p>You win!</p>");
        }
            
        else{
            if (player === "p1")
                $("#winning_move").html("<p>You win!</p>");
            else
                $("#winning_move").html("<p>You lose!</p>");
        }
            
    }
    var time_count = 3;
    var td = $('<p class="text-center" id="timer_display">'+ time_count + ' before next round.</p>');
    $("#winning_move").append(td);
    var timer = setInterval(function(){
        $("#timer_display").text(--time_count + ' seconds before next round.');
        if (time_count < 0){
            clearInterval(timer);
            reset_game_board();
        }
    },1000);
    

};

function update_page(data) {
    database.ref().once('value').then(function (snapshot) {
        if (snapshot.val().p1 === true) {
            database.ref(snapshot.val().p1_key).once('value').then(function (snapshot) {
                setP1(snapshot.val().name);
            });
        }
        if (snapshot.val().p2 === true) {
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


$("#reset").click(function (event) {
    event.preventDefault();
    database.ref().set({
        p1: false,
        p2: false,
        p2_key: "",
        p1_key: "",
    });
});

$("document").ready(function () {

    database.ref().on("value", function (snapshot) {
        update_page(snapshot.val());

        var temp1 = snapshot.val().p1_key;
        var temp2 = snapshot.val().p2_key;

        if (temp1 != "" && temp2 != "") {

            database.ref(temp1).once("value", function (snapshot) {
                temp1 = snapshot.val().move;
            });
            database.ref(temp2).once("value", function (snapshot) {
                temp2 = snapshot.val().move;
            });
            if (temp1 != "" && temp2 != "")
                compare_moves();
        }
        
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
                player_key = temp;
                $("#player").css("display", "none");
                $("#" + player + "_move > img").removeClass("d-none");
                $("#" + player + "_move > img").addClass("d-block");
                input.val("");

            });
        }

        $("body").on("click", "img", function () {
            $("#" + player + "_move > img").addClass("d-none");
            $("#" + player + "_move > img").removeClass("d-block");
            $("#" + this.id).addClass("d-block");
            $("#" + this.id).removeClass("d-none");
            var player_move = this.id.substring(3);
            database.ref(player_key).update({ move: player_move });


        });




    });
});




