//Code for building grid in notebook panel


var x = 0;
var y = 0;
var width = 350;
var height = 600;
var unitSize = 25;

var weapons = ["knife", "candlestick", "wrench", "revolver", "lead pipe", "rope" ]

var suspects = ["Col. Mustard", "Prof. Plum", "Ms. Scarlet", "Mr. Green", "Mrs. Peacock", "Mrs. Black"]

var locations = ["hall", "study", "dining room", "ballroom", "billiard", "conservatory", "lounge", "kitchen", "library"]


//Draw grid border(rectangle)
function drawBorder(x, y, width, height){
  context.beginPath();
  context.lineWidth = 4;
  context.rect(x, y, width, height);
  context.strokeStyle = 'black';
  context.stroke();
}

//Draw horizontal lines of grid
function drawRows (x, width, height, unitSize ){
  var currentHeight = height - unitSize;
  for (var i =0; i < ((height/unitSize) + 1); i++) {
    context.beginPath();
    context.lineWidth = 1;
    context.moveTo(x, currentHeight);
    context.lineTo(width, currentHeight);
    context.stroke();
    currentHeight = currentHeight - unitSize;
  }
}

//Draw lines vertically
function drawColumns(y, width, height, unitSize){

  var currentWidth = width - unitSize;

  for (var i =0; i < 8; i++) {
    context.beginPath();
    context.lineWidth = 1;
    context.moveTo(currentWidth, y);
    context.lineTo(currentWidth, height);
    context.stroke();
    currentWidth = currentWidth - unitSize;
  }
}

//Row labels and headings for each card
function labelSection(array, unitSize, start, title, titleY){

  var margin = 5;

  for (var i = 0; i < array.length; i ++) {
    context.font = "15px Arial";
    context.fillStyle = "black";
    context.textAlign = "left";
    context.fillText(array[i], margin, start - margin);
    start = start- unitSize;
  }


  //Section header
  context.fillStyle = "black";
  context.fillRect(0, titleY, 350, 25)
  context.font = "20px san-serif";
  context.fillStyle= "white";
  context.fillText(title ,0 , start -margin);
}

//Create 2D array to track clicked squares
function matrix( rows, cols, defaultValue){

  var grid = [];

  // Creates rows of empty lists
  for(var i=0; i < rows; i++){
    grid.push([]);

    // Starting j at 6 to account for row labels which do not need a value
    for(var j=6; j < cols; j++){

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
      y: evt.clientY - rect.top
    };
}

//Function to fill gridsquare with a black square
function fill(color, row, column, unitSize) {

  context.fillStyle = color;
  var side = unitSize-2;
  var x = (row * unitSize) + 1;
  var y = (column * unitSize) + 1;
  context.fillRect(x, y, side, side);
}

//Get mouse position on click and fill square at that position
canvas.addEventListener('click', function(evt) {
  var mousePos = getMousePos(canvas, evt);

  var column = Math.floor(mousePos.x/unitSize);
  console.log(column)
  var row = Math.floor(mousePos.y/unitSize);
  console.log(row)

  //On initial click, fill grid square with smaller black square
  if (grid[row][column] === 0) {
    console.log("i clicked")
    fill('black', column, row, 25);
    grid[row][column]=1;
  }

  //If square is black, change it back to white.
  else if (grid[row][column] === 1) {
    fill('white', column, row, 25);
    grid[row][column] =0;
  }
});

var grid = matrix(24, 14, 0);

drawBorder(x, y, width, height);

drawRows(x, width, height, unitSize);

drawColumns(y, width, height, unitSize);

labelSection(weapons, unitSize, height, "Weapons", 425);

labelSection(suspects, unitSize, 425, "Suspects", 250);

labelSection(locations, unitSize, 250, "Locations", 0);
