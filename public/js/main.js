$(function () {
  $("#view-notebook").click(function () {
    $("#board").hide();
    $("#notebook").show();
    $(this).hide();
    $("#close-notebook").show();
  });

  $("#close-notebook").click(function () {
    $("#board").show();
    $("#notebook").hide();
    $(this).hide();
    $("#view-notebook").show();
  });

  var canvas;
  var context;
  let dx = 29.5;
  let dy = 28;
  var r = 14;

  var WIDTH = 792;
  var HEIGHT = 752;

  var rollAmount;
  var movesLeft;
  var i;
  var culprit;
  var murderLocation;
  var murderWeapon;

  function drawCircle(x, y, r, color) {
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, true);
    context.fillStyle = color;
    context.fill();
  }

  function clear() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
  }

  function draw() {
    clear();
    drawCircle(player.x, player.y, r, player.color);
    drawCircle(opponent.x, opponent.y, r, opponent.color);
  }

  function init() {
    canvas = document.getElementById("board");
    context = canvas.getContext("2d");
    $("#make-moves").show();
    draw();
  }

  //calls io from index.js
  var socket = io();

  var player = {
    character: "",
    id: "",
    isTurn: false,
    turnIsComplete: false,
    inRoom: false,
    currentRoom: "",
    cards: [],
    x: "",
    y: "",
    color: "",
  };

  var opponent = {
    character: "",
    id: "",
    isTurn: false,
    turnIsComplete: false,
    inRoom: false,
    x: "",
    y: "",
    color: "",
  };

  function getCharacterValues(player) {
    const coords = startingSquares[player.character].split(",");
    player.x = parseFloat(coords[0]);
    player.y = parseFloat(coords[1]);
    if (player.character === "Col. Mustard") {
      player.color = "yellow";
    } else if (player.character === "Mrs.Peacock") {
      player.color = "blue";
    } else if (player.character === "Mr. Green") {
      player.color = "green";
    } else if (player.character === "Prof. Plum") {
      player.color = "purple";
    } else if (player.character === "Mrs. Black") {
      player.color = "black";
    } else if (player.character === "Ms. Scarlet") {
      player.color = "red";
    }
  }

  socket.emit("joinRoom");

  socket.on("connectToRoom", (msg) => {
    console.log(msg);
  });

  socket.on("cardsChosen", function (who, where, what) {
    culprit = who;
    murderLocation = where;
    murderWeapon = what;
  });

  socket.on("showMovesLeft", function (movesLeft, rollAmount) {
    if (typeof movesLeft !== "undefined") {
      $("#rolled-number").text(rollAmount);
      $("#moves-left").text(movesLeft);
    }
  });

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function rollDye() {
    rollAmount = randomIntFromInterval(2, 12);

    $("#rollDye").hide();
    $("#accusation").hide();
    $(".showRoll").show();
    $(".showMoves").show();

    i = 0;
    movesLeft = rollAmount;
    socket.emit("trackRoll", movesLeft, rollAmount);
    return rollAmount;
  }

  function turnChange (movesLeft, player) {
    if (movesLeft === 0 && player.turnIsComplete) {
      socket.emit("changeTurn");
    }
  }

  function squareIsPlayable(x, y) {
    if (playableSquares.has(`${x},${y}`)) {
      return true;
    }
    return false;
  }

  function doKeyDown(evt) {
    var opponentPosition = [opponent.x, opponent.y];
    var playerPosition;

    if (player.isTurn === true) {
      if (typeof rollAmount !== "undefined") {
        if (i === rollAmount
          || movesLeft === 0
          || player.inRoom) {
          return;
        }

        switch (evt.keyCode) {
          case 38 /* Up arrow was pressed */:
            playerPosition = [player.x, player.y - dy];
            if (
              squareIsPlayable(player.x, player.y - dy) &&
              !playerPosition.every(function (v, i) {
                return v === opponentPosition[i];
              })
            ) {
              player.y -= dy;

              movesLeft--;

              socket.emit("trackRoll", movesLeft, rollAmount);
              draw();
              if (!checkForDoorSquare()) {
                player.turnIsComplete = true;
                turnChange(movesLeft, player);
              }
            }

            break;
          case 40 /* Down arrow was pressed */:
            playerPosition = [player.x, player.y + dy];
            if (
              squareIsPlayable(player.x, player.y + dy) &&
              !playerPosition.every(function (v, i) {
                return v === opponentPosition[i];
              })
            ) {
              player.y += dy;

              movesLeft--;
              socket.emit("trackRoll", movesLeft, rollAmount);
              draw();
              if (!checkForDoorSquare()) {
              player.turnIsComplete = true;
              turnChange(movesLeft, player);
            }
            }

            break;
          case 37 /* Left arrow was pressed */:
            playerPosition = [player.x - dx, player.y];
            if (
              squareIsPlayable(player.x - dx, player.y) &&
              !playerPosition.every(function (v, i) {
                return v === opponentPosition[i];
              })
            ) {
              player.x -= dx;
              movesLeft--;

              socket.emit("trackRoll", movesLeft, rollAmount);
              draw();
              if (!checkForDoorSquare()) {
                 player.turnIsComplete = true;
                 turnChange(movesLeft, player);
               }
            }
            break;
          case 39 /* Right arrow was pressed */:
            playerPosition = [player.x + dx, player.y];
            if (
              squareIsPlayable(player.x + dx, player.y) &&
              !playerPosition.every(function (v, i) {
                return v === opponentPosition[i];
              })
            ) {
              player.x += dx;
              movesLeft--;
              socket.emit("trackRoll", movesLeft, rollAmount);
              draw();
              if (!checkForDoorSquare()) {
                player.turnIsComplete = true;
                turnChange(movesLeft, player)
              }
            }
            break;
        }
        socket.emit("playerMoved", player.x, player.y);
      }
    }
  }

  //remove button from avaiable options
  function removeCharacter(msg) {
    var buttonPressed = $("button:contains('" + msg + "')");
    var buttonId = buttonPressed.attr("id");
    $("#" + buttonId).remove();
  }

  document.getElementById("rollDye").addEventListener("click", rollDye);
    window.addEventListener("keyup", doKeyDown, true)

    window.addEventListener(
      "keyup",
      socket.on("playerMoved", function (x, y, id) {
        if (player.id === id) {
          player.y = y
          player.x = x
          draw()
        } else {
          opponent.y = y
          opponent.x = x
          drawCircle(opponent.x, opponent.y, r, opponent.color)
          draw()
        }
      })
    )

  function checkForDoorSquare() {
    if (doorSquares[`${player.x},${player.y}`]) {
      player.currentRoom = doorSquares[`${player.x},${player.y}`]
      $("#enter-prompt").text(`Would you like to enter the ${player.currentRoom}?`)
      enterRoomDialog.dialog("open")
      return true;
    } else {
      return false;
    }
  }

  var suggestionDialog;
  var dialog;
  var form;
  //jquery ui dialog for options box
  dialog = $("#dialog-form").dialog({
    autoOpen: false,
    height: 400,
    width: 650,
    modal: true,

    close: function () {
      form[0].reset();
    },
  });

  suggestionDialog = $("#suggestion-form").dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      Submit: function () {
        suggestionDialog.dialog("close");
        movesLeft = 0;

        var suspect = $("#suspects").val();
        var weapon = $("#weapons").val();
        var place = $("#rooms").val();

        socket.emit("madeSuggestion", suspect, weapon, place, player.id);

        socket.emit("playerMoved", player.x, player.y);
        player.turnIsComplete = true;
      },
      Accuse: function () {
        suggestionDialog.dialog("close");
        var suspect = $("#suspects").val();
        var weapon = $("#weapons").val();
        var place = $("#rooms").val();
        socket.emit(
          "accuse",
          suspect,
          weapon,
          place,
          culprit,
          murderWeapon,
          murderLocation,
          player.id
        );
      },
    },
  });

  function placePlayerInRoom() {
    // if spot in room already occupied by opponent place them in next available space
    const coordsList = inRoomCoords[player.currentRoom];
    coordsList.forEach((coord) => {
      const xAndY = coord.split(",");
      const [currentX, currentY] = xAndY;
      if (opponent.x === currentX && opponent.y === currentY) {
        return;
      } else {
        player.x = currentX;
        player.y = currentY;
        socket.emit("playerMoved", player.x, player.y);
      }
    });
  }

  function confirmEnterRoom() {
    enterRoomDialog.dialog("close");
    placePlayerInRoom();
    player.inRoom = true;
    if (movesLeft === 0) {
      $("#roll-option").hide()
      $("#leave-option").hide()
    } else if (movesLeft > 0) {
      $("#leave-option").show()
      $("#roll-option").hide()
      $("#leave-option").off("click")
      $("#leave-option").click(function () {
        leaveRoom(player.currentRoom)
      })
    } else {
      $("#leave-option").hide();
      $("#roll-option").show();
      $("#roll-option").off("click");
      $("#roll-option").click(function () {
        rollOutOfRoom(player.currentRoom)
      })
    }
    if (secretPassages[player.currentRoom]) {
      $("#secret-passage-btn").text(`Go to ${secretPassages[player.currentRoom]}`)
      $("#secret-passage-btn").show()
      $("#secret-passage-btn").off("click");
      $("#secret-passage-btn").click(function () {
        useSecretPassage(player.currentRoom)
      })
    } else {
      $("#secret-passage-btn").hide();
    }

    $("#make-suggestion").click(function () {
      makeSuggestion();
    });
    roomOptionsDialog.dialog("open");
  }

  function makeSuggestion() {
    movesLeft = 0;
    socket.emit("trackRoll", movesLeft, rollAmount);

    $("#rooms").val(player.currentRoom);
    $("#rooms").attr("disabled", true);
    $("#rooms").selectmenu("refresh");
    socket.emit("insideRoom", player.character);
    $("button:contains('Accuse')").hide();
    roomOptionsDialog.dialog("close");
    suggestionDialog.dialog("open");
  }

  function useSecretPassage() {
    let newRoom = secretPassages[player.currentRoom];
    if (secretPassages[newRoom]) {
      $("#secret-passage-btn").text(`Go to ${secretPassages[newRoom]}`);
      $("#secret-passage-btn").show();
    }
    player.currentRoom = newRoom;
    confirmEnterRoom(newRoom);
  }

  function markExits (doors) {
    const markers = [];
    doors.forEach((door) => {
      const coords = door.split(",");
      x = parseFloat(coords[0]);
      y = parseFloat(coords[1]);

      let circle = new Path2D();
      markers.push(circle);
      circle.arc(x, y, r, 0, 2 * Math.PI);
      context.stroke(circle);
    });
    for (let i = 0; i < markers.length; i++) {
      canvas.addEventListener("click", function (event) {
        if (context.isPointInPath(markers[i], event.clientX, event.clientY)) {
          const coords = doors[i].split(",");
          x = parseFloat(coords[0]);
          y = parseFloat(coords[1]);
          player.x = x;
          player.y = y;
          socket.emit("playerMoved", player.x, player.y);
          i++;
          movesLeft--;
          socket.emit("trackRoll", movesLeft, rollAmount);
          player.inRoom = false;
          turnChange(movesLeft, player);
          canvas.focus();
          draw();
        }
      });
    }
  }

  function rollOutOfRoom() {
    rollDye();
    roomOptionsDialog.dialog("close");
    //show squares you can move to
    const doorCoords = allDoorsForRoom[player.currentRoom];
    markExits(doorCoords);
  }

  function leaveRoom() {
    roomOptionsDialog.dialog("close");
    //show squares you can move to
    const doorCoords = allDoorsForRoom[player.currentRoom];
    markExits(doorCoords);
  }

  roomOptionsDialog = $("#room-options").dialog({
    autoOpen: false,
    height: 300,
    width: 350,
    modal: true,
  });

  enterRoomDialog = $("#enter-room-form").dialog({
    autoOpen: false,
    height: 300,
    width: 350,
    modal: true,
    buttons: {
      Yes: function () {
        confirmEnterRoom();
        enterRoomDialog.dialog("close");
      },
      No: function () {
        if (movesLeft === 0) {
          player.turnIsComplete = true;
          turnChange(movesLeft, player)
        }
        enterRoomDialog.dialog("close");
      },
    },
  });

  form = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
  });

  $("#suspects").selectmenu();

  $("#weapons").selectmenu();

  $("#rooms").selectmenu();

  form = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
  });

  $("button, input, a").click(function (event) {
    event.preventDefault();
  });

  //create jquery ui buttons
  $(".widget input[type=submit], .widget a, .widget button").button();

  //show waiting message if only one user connected
  $("#waiting").show();
  $(".characters").hide();
  $("#make-moves").hide();
  //open dialog with options to pick characters
  dialog.dialog("open");

  //on click of button in a browser window send button's text to server
  $("button").click(function () {
    socket.emit("nameChosen", $(this).text().trim());
  });

  $("#accusation").click(function () {
    $("button:contains('Submit')").hide();
    var sure = confirm(
      "Are you sure you want to make an accusation? If you are wrong you will lose the game."
    );
    if (sure == true) {
      $("#rooms").attr("disabled", false);
      $("#rooms").selectmenu("refresh");
      $("#suggestion-form").dialog("option", "title", "Make Accusation");
      $("button:contains('Accuse')").show();

      suggestionDialog.dialog("open");
    } else {
      $("button:contains('Submit')").show();
    }
  });

  //get socket ids from index.js and add them to players object
  socket.on("grabSocketId", function (id, cards) {
    player.id = id;
    player.cards = cards;
    $.each(player.cards, function (index, value) {
      $("#player-cards").append(
        $("<li/>", {
          value: value,
          text: value,
          class: "ui-widget-content card",
        })
      );
    });

    //hide waiting since there are now 2 players
    $("#waiting").hide();
    $(".characters").show();
  });

  //function for if user already picked a name and clicked a button
  socket.on("selectCharacter", function (msg, id) {
    $("#already-picked").append("You've picked " + msg);
    player.character = msg;
    getCharacterValues(player);

    removeCharacter(msg);
    socket.emit(
      "opponentInfo",
      player.id,
      player.x,
      player.y,
      player.color,
      player.character
    );
    socket.emit("startGame", msg);
  });

  socket.on("opponentPicked", function (msg, id) {
    if (player.id !== id) {
      $("#opponents-choice").append("Your opponent picked " + msg);
    }
    removeCharacter(msg);
  });

  socket.on("opponentInfo", function (id, x, y, color, character) {
    opponent.id = id;
    opponent.x = x;
    opponent.y = y;
    opponent.color = color;
    opponent.character = character;
  });

  socket.on("startTurn", function (turnValue) {
    player.isTurn = turnValue;
    player.turnIsComplete = false;
    if (player.inRoom) {
        if (!movesLeft) {
          $("#roll-option").show();
          $("#leave-option").hide();
          $("#roll-option").off("click");
          $("#roll-option").click(function () {
            rollOutOfRoom(player.currentRoom);
          });
          roomOptionsDialog.dialog("open");
        }
    }
    $("#rollDye").show();
    $("#accusation").show();
    $(".showRoll").hide();
    $(".showMoves").hide();
    $("#whoseTurn").text("Your turn");
  });

  socket.on("notTurn", function (turnValue) {
    player.isTurn = turnValue;
    $("#rollDye").hide();
    $("#accusation").hide();
    $(".showRoll").show();
    $(".showMoves").show();
    $("#whoseTurn").text(opponent.character.toString() + "'s turn");
    $("#rolled-number").text("");
    $("#moves-left").text("");
  });

  socket.on("startGame", function () {
    init();
    dialog.dialog("close");
  });

  socket.on("insideRoom", function (character) {
    $("#awaitSuggestion").text(
      "Wait for " + character + " to make a suggestion."
    );
    $("#rolled-number").hide();
    $("#moves-left").hide();
    $("#whoseTurn").hide();
  });

  socket.on("madeSuggestion", function (suspect, weapon, place, id) {
    alert("It was " + suspect + " in the " + place + " with the " + weapon);

    $("#awaitSuggestion").text("Click highlighted card to send to player");
    $("#rollDye").hide();
    $("#accusation").hide();
    if (
      player.cards.indexOf(suspect) === -1 &&
      player.cards.indexOf(weapon) === -1 &&
      player.cards.indexOf(place) === -1
    ) {
      socket.emit("noCards", id);
      $("#awaitSuggestion").text("");
      $("#rolled-number").show();
      $("#moves-left").show();
      $("#whoseTurn").show();
      $("#rollDye").show();
      $("#accusation").show();
    }
    if (player.cards.indexOf(suspect) > -1) {
      var suspectSelected = $(".card:contains('" + suspect + "')");
      suspectSelected.css("background", "blue");
      suspectSelected.hover(
        function () {
          $(this).css("cursor", "pointer");
        },
        function () {
          $(this).css("cursor", "default");
        }
      );
      suspectSelected.unbind("click").bind("click", function (card) {
        socket.emit("showCard", suspect, id);
        $(".card").css("background", "");
        $("#awaitSuggestion").text("");
        $("#rolled-number").show();
        $("#moves-left").show();
        $("#whoseTurn").show();
        $("#rollDye").show();
        $("#accusation").show();
      });
    }
    if (player.cards.indexOf(weapon) > -1) {
      var weaponSelected = $(".card:contains('" + weapon + "')");
      weaponSelected.css("background", "blue");
      weaponSelected.hover(
        function () {
          $(this).css("cursor", "pointer");
        },
        function () {
          $(this).css("cursor", "default");
        }
      );
      weaponSelected.unbind("click").bind("click", function (card) {
        socket.emit("showCard", weapon, id);
        $(".card").css("background", "");
        $("#awaitSuggestion").text("");
        $("#rolled-number").show();
        $("#moves-left").show();
        $("#whoseTurn").show();
        $("#rollDye").show();
        $("#accusation").show();
      });
    }
    if (player.cards.indexOf(place) > -1) {
      var placeSelected = $(".card:contains('" + place + "')");
      placeSelected.css("background", "blue");
      placeSelected.hover(
        function () {
          $(this).css("cursor", "pointer");
        },
        function () {
          $(this).css("cursor", "default");
        }
      );
      placeSelected.unbind("click").bind("click", function (card) {
        socket.emit("showCard", place, id);
        $(".card").css("background", "");
        $("#awaitSuggestion").text("");
        $("#rolled-number").show();
        $("#moves-left").show();
        $("#whoseTurn").show();
        $("#rollDye").show();
        $("#accusation").show();
      });
    }
  });

  socket.on("showCard", function (card) {
    alert(card);
    socket.emit("changeTurn");
  });

  socket.on("noCards", function (msg) {
    alert(msg);
    $("#accusation").show();
    $("#pass").show();
  });

  $("#pass").click(function () {
    $("#pass").hide();
    socket.emit("changeTurn");
  });

  socket.on("accusationMade", function (msg) {
    alert(msg);
    $("body").hide();
  });
});
