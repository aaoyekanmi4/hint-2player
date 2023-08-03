const socket = io();
/**TODO REFACTOR INTO FILES */
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var x = 0;
var y = 0;
var width = 350;
var height = 600;
var unitSize = 25;
var weapons = [
  "knife",
  "candlestick",
  "wrench",
  "revolver",
  "lead pipe",
  "rope",
];

var suspects = [
  "Col. Mustard",
  "Prof. Plum",
  "Ms. Scarlet",
  "Mr. Green",
  "Mrs. Peacock",
  "Mrs. Black",
];

var locations = [
  "hall",
  "study",
  "dining room",
  "ballroom",
  "billiard",
  "conservatory",
  "lounge",
  "kitchen",
  "library",
];

//Draw grid border(rectangle)
function drawBorder(x, y, width, height) {
  context.beginPath();
  context.lineWidth = 4;
  context.rect(x, y, width, height);
  context.strokeStyle = "black";
  context.stroke();
}

//Draw horizontal lines of grid
function drawRows(x, width, height, unitSize) {
  var currentHeight = height - unitSize;
  for (var i = 0; i < height / unitSize + 1; i++) {
    context.beginPath();
    context.lineWidth = 1;
    context.moveTo(x, currentHeight);
    context.lineTo(width, currentHeight);
    context.stroke();
    currentHeight = currentHeight - unitSize;
  }
}

//Draw lines vertically
function drawColumns(y, width, height, unitSize) {
  var currentWidth = width - unitSize;

  for (var i = 0; i < 8; i++) {
    context.beginPath();
    context.lineWidth = 1;
    context.moveTo(currentWidth, y);
    context.lineTo(currentWidth, height);
    context.stroke();
    currentWidth = currentWidth - unitSize;
  }
}

//Row labels and headings for each card
function labelSection(array, unitSize, start, title, titleY) {
  var margin = 5;

  for (var i = 0; i < array.length; i++) {
    context.font = "15px Arial";
    context.fillStyle = "black";
    context.textAlign = "left";
    context.fillText(array[i], margin, start - margin);
    start = start - unitSize;
  }

  //Section header
  context.fillStyle = "black";
  context.fillRect(0, titleY, 350, 25);
  context.font = "20px san-serif";
  context.fillStyle = "white";
  context.fillText(title, 0, start - margin);
}

//Create 2D array to track clicked squares
function matrix(rows, cols, defaultValue) {
  var grid = [];

  // Creates rows of empty lists
  for (var i = 0; i < rows; i++) {
    grid.push([]);

    // Starting j at 6 to account for row labels which do not need a value
    for (var j = 6; j < cols; j++) {
      grid[i][j] = defaultValue;
    }
  }

  return grid;
}

//Get current mouse position
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

//Function to fill gridsquare with a black square
function fill(color, row, column, unitSize) {
  context.fillStyle = color;
  var side = unitSize - 2;
  var x = row * unitSize + 1;
  var y = column * unitSize + 1;
  context.fillRect(x, y, side, side);
}

//Get mouse position on click and fill square at that position
canvas.addEventListener("click", function (evt) {
  var mousePos = getMousePos(canvas, evt);

  var column = Math.floor(mousePos.x / unitSize);
  var row = Math.floor(mousePos.y / unitSize);

  //On initial click, fill grid square with smaller black square
  if (grid[row][column] === 0) {
    fill("black", column, row, 25);
    grid[row][column] = 1;
  }

  //If square is black, change it back to white.
  else if (grid[row][column] === 1) {
    fill("white", column, row, 25);
    grid[row][column] = 0;
  }
});

var grid = matrix(24, 14, 0);

drawBorder(x, y, width, height);

drawRows(x, width, height, unitSize);

drawColumns(y, width, height, unitSize);

labelSection(weapons, unitSize, height, "Weapons", 425);

labelSection(suspects, unitSize, 425, "Suspects", 250);

labelSection(locations, unitSize, 250, "Locations", 0);

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
  var beforeRoom;
  var culprit;
  var murderLocation;
  var murderWeapon;

  function drawCircle(x, y, r, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, r, 0, Math.PI * 2, true);
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
    return setInterval(draw, 10);
  }

  //calls io from index.js
  var socket = io();

  //objects for player and opponent
  var player = {
    character: "",
    id: "",
    isTurn: false,
    inRoom: false,
    cards: [],
    trackedTurn: [],
    x: "",
    y: "",
    color: "",
  };

  var opponent = {
    character: "",
    id: "",
    isTurn: false,
    inRoom: false,
    trackedTurn: [],
    x: "",
    y: "",
    color: "",
  };

  function getCharacterValues (player) {

    const coords = startingSquares[player.character].split(",");
    player.x = parseFloat(coords[0]);
    player.y = parseFloat(coords[1]);
    console.log(coords)
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

  function rollDye() {
    rollAmount = Math.floor(Math.random() * 12 + 1);

    $("#rollDye").hide();
    $("#accusation").hide();
    $(".showRoll").show();
    $(".showMoves").show();

    i = 0;
    movesLeft = rollAmount;
    socket.emit("trackRoll", movesLeft, rollAmount);
    return rollAmount;
  }

  function turnChange(movesLeft, player) {
    if (movesLeft === 0 && player.inRoom === false) {
      socket.emit("changeTurn");
    }
  }

  function squareIsPlayable (x, y) {
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
        if (i === rollAmount || movesLeft === 0) {
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
              i += 1;

              movesLeft = rollAmount - i;

              socket.emit("trackRoll", movesLeft, rollAmount);
              player.trackedTurn.push({ x: +player.x, y: +player.y });

              turnChange(movesLeft, player);
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
              i += 1;

              movesLeft = rollAmount - i;
              socket.emit("trackRoll", movesLeft, rollAmount);
              player.trackedTurn.push({ x: +player.x, y: +player.y });

              turnChange(movesLeft, player);
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
              i += 1;
              movesLeft = rollAmount - i;

              socket.emit("trackRoll", movesLeft, rollAmount);
              player.trackedTurn.push({ x: +player.x, y: +player.y });

              turnChange(movesLeft, player);
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
              i += 1;

              movesLeft = rollAmount - i;
              socket.emit("trackRoll", movesLeft, rollAmount);
              player.trackedTurn.push({ x: +player.x, y: +player.y });

              turnChange(movesLeft, player);
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
  window.addEventListener("keyup", doKeyDown, true);
  window.addEventListener(
    "keyup",
    socket.on("playerMoved", function (x, y, id) {
      if (player.id === id) {
        player.y = y;
        player.x = x;
      } else {
        opponent.y = y;
        opponent.x = x;
        drawCircle(opponent.x, opponent.y, r, opponent.color);
      }
    })
  );

  let currentRoom;
  window.addEventListener("keyup", function checkForDoorSquare () {
    if (doorSquares[`${player.x},${player.y}`]) {
      currentRoom = doorSquares[`${player.x},${player.y}`];
      $("#enter-prompt").text(`Would you like to enter the ${currentRoom}?`)
      enterRoomDialog.dialog("open");
    }
    // for (var i = 0; i < placesArray.length; i++) {
    //   var playerWidth = player.x - 12.5 + 2 * r;
    //   var playerHeight = player.y - 12.5 + 2 * r;

    //   if (
    //     [i].x < playerWidth &&
    //     placesArray[i].x + placesArray[i].width > player.x &&
    //     placesArray[i].y < playerHeight &&
    //     placesArray[i].y + placesArray[i].height > player.y
    //   ) {
    //     $("#rooms").val(placesArray[i].name);
    //     $("#rooms").attr("disabled", true);
    //     $("#rooms").selectmenu("refresh");

    //     beforeRoom = player.trackedTurn[player.trackedTurn.length - 2];

    //     player.inRoom = true;

    //     movesLeft = 0;
    //     socket.emit("trackRoll", movesLeft, rollAmount);
    //     socket.emit("insideRoom", player.character);

    //     $("button:contains('Accuse')").hide();

    //     suggestionDialog.dialog("open");
      // }
    // }
  });

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

        player.x = beforeRoom.x;
        player.y = beforeRoom.y;
        socket.emit("playerMoved", player.x, player.y);
        player.inRoom = false;

        player.trackedTurn.push(beforeRoom);
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

  function placePlayerInRoom (currentRoom) {
    // if spot in room already occupied by opponent place them in next avaialabe space
    const coordsList = inRoomCoords[currentRoom];
    coordsList.forEach((coord) => {
      const xAndY = coord.split(",");
      const [currentX, currentY] = xAndY;
      if (opponent.x === currentX && opponent.y === currentY) {
        return;
      } else {
        player.x = currentX;
        player.y = currentY;
      }
    })
  }

  function confirmEnterRoom (currentRoom) {
    player.inRoom = true;
    enterRoomDialog.dialog("close");
    placePlayerInRoom(currentRoom);
    if (secretPassages[currentRoom]) {
         $("#secret-passage-btn").text(`Go to ${secretPassages[currentRoom]}`);
      $("#secret-passage-btn").show();
        $("#secret-passage-btn").click(function () {
          useSecretPassage(currentRoom);
        });
    }
      $("#make-suggestion").click(function () {
        makeSuggestion(currentRoom);
      });
    roomOptionsDialog.dialog("open")
  }

  function makeSuggestion (currentRoom) {
     console.log(currentRoom)
     movesLeft = 0;
     $("#rooms").val(currentRoom);
     $("#rooms").attr("disabled", true);
     $("#rooms").selectmenu("refresh");
     socket.emit("insideRoom", player.character);
    $("button:contains('Accuse')").hide();
    roomOptionsDialog.dialog("close");
    suggestionDialog.dialog("open");
  }



  function useSecretPassage (currentRoom) {
    const newRoom = secretPassages[currentRoom];
     if (secretPassages[newRoom]) {
       $("#secret-passage-btn").text(`Go to ${secretPassages[newRoom]}`);
       $("#secret-passage-btn").show();
     }
    currentRoom = newRoom;
    confirmEnterRoom(currentRoom)
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
        confirmEnterRoom(currentRoom)
        enterRoomDialog.dialog("close");
      },
      No: function () {
        enterRoomDialog.dialog("close");
      }
    }
  })

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

  socket.on("grabSocketId", function (id, cards,) {
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
