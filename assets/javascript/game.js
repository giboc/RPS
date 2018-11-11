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

//global variables
var database = firebase.database(); 
var player = ""; //local global to keep track of which player you are.
var player_key;  //Keeps track of the player_key for the firebase

//Small functions that set up the intitial display: player names and scores.
function setP1(name, win_count) {
    $("#p1").html("<p>Player 1: " + name + "</p>");
    var score_display = $('<p class="text-center" id="p1_score">Score: ' + win_count + '</p>');
    $("#p1").append(score_display);
};

function setP2(name, win_count) {
    $("#p2").html("<p>Player 2: " + name + "</p>");
    var score_display = $('<p class="text-center" id="p2_score">Score: ' + win_count + '</p>');
    $("#p2").append(score_display);
};

//This function clears the page in between the rounds, and resets it the neutral state.
function reset_game_board() {
    $("#timer_display").remove();
    $("#winning_move").html("");
    $("#" + player + "_move > img").removeClass("d-none");
    $("#" + player + "_move > img").addClass("d-block");
    if (player === "p1") {
        $("#p2_move > img").addClass("d-none");
        $("#p2_move > img").removeClass("d-block");
    }
    else {
        $("#p1_move > img").addClass("d-none");
        $("#p1_move > img").removeClass("d-block");
    }
}

//This function checks each player's input and determine who wins.
//Also adjusts the win count for the winner.
//Lastly, it clears out the current move in the database to prepare for next round.
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

    if (p1 === p2) {
        $("#winning_move").html("<p>It's a tie!</p>");
        database.ref(player_key).update({ move: "" });
    }
    else if (p1 === "rock") {
        if (p2 === "paper") {
            if (player === "p1") {
                $("#winning_move").html("<p>You lose!</p>");
                database.ref(player_key).update({ move: "" });
            }
            else {
                $("#winning_move").html("<p>You win!</p>");
                database.ref(player_key).update({ move: "" });
                var win_count;
                database.ref(player_key + "/wins").transaction(function (current_wins) {
                    win_count = current_wins + 1;
                });
                database.ref(player_key).update({ wins: win_count });
            }
        }
        else {
            if (player === "p1") {
                $("#winning_move").html("<p>You win!</p>");
                database.ref(player_key).update({ move: "" });
                var win_count;
                database.ref(player_key + "/wins").transaction(function (current_wins) {
                    win_count = current_wins + 1;
                });
                database.ref(player_key).update({ wins: win_count });
            }
            else {
                $("#winning_move").html("<p>You lose!</p>");
                database.ref(player_key).update({ move: "" });
            }
        }
    }
    else if (p1 === "paper") {
        if (p2 === "rock") {
            if (player === "p1") {
                $("#winning_move").html("<p>You win!</p>");
                database.ref(player_key).update({ move: "" });
                var win_count;
                database.ref(player_key + "/wins").transaction(function (current_wins) {
                    win_count = current_wins + 1;
                });
                database.ref(player_key).update({ wins: win_count });
            }
            else {
                $("#winning_move").html("<p>You lose!</p>");
                database.ref(player_key).update({ move: "" });
            }
        }
        else {
            if (player === "p1") {
                $("#winning_move").html("<p>You lose!</p>");
                database.ref(player_key).update({ move: "" });
            }
            else {
                $("#winning_move").html("<p>You win!</p>");
                database.ref(player_key).update({ move: "" });
                var win_count;
                database.ref(player_key + "/wins").transaction(function (current_wins) {
                    win_count = current_wins + 1;
                });
                database.ref(player_key).update({ wins: win_count });
            }
        }
    }
    else {
        if (p2 === "rock") {
            if (player === "p1") {
                $("#winning_move").html("<p>You lose!</p>");
                database.ref(player_key).update({ move: "" });
            }
            else {
                $("#winning_move").html("<p>You win!</p>");
                database.ref(player_key).update({ move: "" });
                var win_count;
                database.ref(player_key + "/wins").transaction(function (current_wins) {
                    win_count = current_wins + 1;
                });
                database.ref(player_key).update({ wins: win_count });
            }
        }
        else {
            if (player === "p1") {
                $("#winning_move").html("<p>You win!</p>");
                database.ref(player_key).update({ move: "" });
                var win_count;
                database.ref(player_key + "/wins").transaction(function (current_wins) {
                    win_count = current_wins + 1;
                });
                database.ref(player_key).update({ wins: win_count });
            }
            else {
                $("#winning_move").html("<p>You lose!</p>");
                database.ref(player_key).update({ move: "" });
            }
        }
    }

    //This probably should be it's own function but I'm running out of time :O
    //This shows a countdown in between rounds. After 3 seconds, the new round begins.
    var time_count = 3;
    var td = $('<p class="text-center" id="timer_display">' + time_count + ' before next round.</p>');
    $("#winning_move").append(td);
    var timer = setInterval(function () {
        $("#timer_display").text(--time_count + ' seconds before next round.');
        if (time_count < 0) {
            clearInterval(timer);
            reset_game_board();
        }
    }, 1000);
};

//The main "ready" function
$("document").ready(function () {
    
    //First, set up the chat box.
    database.ref("chatlog").once("value", function (snapshot) {
        $("#log").append(snapshot.val());
    });
    $("#log").append('\n\n\n\n\n\n');//Need 6 spaces to offset the chat log.

    //On submit, update firebase database.
    $("#chat").submit(function (event) {
        event.preventDefault();
        database.ref("chatlog").push({
            text: $("#chat_entry").val(),
            timestamp: firebase.database.ServerValue.TIMESTAMP
        })
        var $textarea = $('#log');
        $textarea.scrollTop($textarea[0].scrollHeight);
        $("#chat_entry").val("");
    });
    //When chatlog gets a new entry, added it to the log display.
    database.ref("chatlog/").orderByChild("timestamp").limitToLast(1).on("child_added", function (snapshot) {
        $("#log").append(snapshot.val().text + '\n');

        var $textarea = $('#log');
        $textarea.scrollTop($textarea[0].scrollHeight); //Keep the chat scrolled to the bottom.
    });

    //Reset button for testing. I left it in because this RPS game isn't 100% complete.
    $("#reset").click(function (event) {
        event.preventDefault();
        database.ref().set({
            p1: false,
            p2: false,
            p2_key: "",
            p1_key: "",
        });

    });


    database.ref().on("value", function (snapshot) {
        //sets up the browser.
        //If no players, default to player 1.
        //If player 1 exists, default to player 2.
        //If both players exist, do not allow the 3rd to play.
        if (snapshot.val().p1 === true) {
            database.ref(snapshot.val().p1_key).once('value').then(function (snapshot) {
                setP1(snapshot.val().name, snapshot.val().wins);
            });
        }
        if (snapshot.val().p2 === true) {
            database.ref(snapshot.val().p2_key).once('value').then(function (snapshot) {
                setP2(snapshot.val().name, snapshot.val().wins);
            });
        }
        if (snapshot.val().p1 === true && snapshot.val().p2 === true && player === "") {

            $("#player").css("display", "none");
            $("#input_display").html("<p>Too many players!</p>");
        }

        var temp1 = snapshot.val().p1_key;
        var temp2 = snapshot.val().p2_key;

        if (temp1 != "" && temp2 != "") {

            database.ref(temp1).once("value", function (snapshot) {
                temp1 = snapshot.val().move;
            });
            database.ref(temp2).once("value", function (snapshot) {
                temp2 = snapshot.val().move;
            });
            if (temp1 != "" && temp2 != "") {
                compare_moves();
            }
        }
    });

    //Name entry for RPS game.
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
        //what happens when you click the images.
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




