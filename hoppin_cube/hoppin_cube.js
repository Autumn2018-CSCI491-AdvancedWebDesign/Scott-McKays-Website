/* Author:......... Scott McKay
 * Date:........... Monday, October 29th, 2018
 * Institution:.... University of Montana
 * Class:.......... Advanced Web-design & Programming
*/

var canvas = document.getElementById("canvas");
var pencil = canvas.getContext('2d');
$('#retry').hide();

const BORDER_WIDTH = 4;
const ADJUSTED_HEIGHT = canvas.height - (BORDER_WIDTH / 2);
var gameStarted = false;
var gameOver    = false;

/* Player Properties */
const PLAYER_WIDTH  = 30;
const PLAYER_HEIGHT = 30;
var   playerX = 25;  //Starting position
var   playerY = alignToBottom(PLAYER_HEIGHT);

var   playerScore = 0;

/* Obstacle Properties */
//Maximum and minimum size of opening that can be picked for each generated bar.
var   distanceBetweenEach = 100;
const MIN_OPENING = 40;
const MAX_OPENING = 60;
const BAR_WIDTH   = 30;

var previouslyMoved = -1;
var obstacles =
{
  "openings":
  [
      {"x1":200, "y1":getRandomInt(ADJUSTED_HEIGHT - MIN_OPENING, 0), "x2": BAR_WIDTH, "y2": getRandomInt(MAX_OPENING, MIN_OPENING)},
      {"x1":400, "y1":getRandomInt(ADJUSTED_HEIGHT - MIN_OPENING, 0), "x2": BAR_WIDTH, "y2": getRandomInt(MAX_OPENING, MIN_OPENING)},
      {"x1":600, "y1":getRandomInt(ADJUSTED_HEIGHT - MIN_OPENING, 0), "x2": BAR_WIDTH, "y2": getRandomInt(MAX_OPENING, MIN_OPENING)},
      {"x1":800, "y1":getRandomInt(ADJUSTED_HEIGHT - MIN_OPENING, 0), "x2": BAR_WIDTH, "y2": getRandomInt(MAX_OPENING, MIN_OPENING)}
  ]
};

//Returns a random integer between max and min.
function getRandomInt(max, min)
{
  return Math.random() * (max - min) + min;
}

/* Draws a blue-border around the canvas */
function drawBorder()
{
  pencil.lineWidth = BORDER_WIDTH;
  pencil.strokeStyle = "#416ef6";
  pencil.rect(0, 0, canvas.width, canvas.height);
  pencil.stroke();
}

/* Draws obstacles that player will have to jump over */
function drawBars()
{
  for (index in obstacles.openings)
  {
    pencil.beginPath();
    //Draw upper bars:
    pencil.fillRect(obstacles.openings[index].x1, 0, obstacles.openings[index].x2, obstacles.openings[index].y1);
    //Draw lower bars:
    pencil.fillRect(obstacles.openings[index].x1, (obstacles.openings[index].y1 + obstacles.openings[index].y2),
                    obstacles.openings[index].x2, ADJUSTED_HEIGHT);
    pencil.stroke();
  }
}

function drawPlayer()
{
  pencil.beginPath();
  pencil.fillRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
  pencil.stroke();
}

function gameOverMessage()
{
  if (gameOver)
  {
    pencil.strokeStyle = "#ff0000";
    pencil.font = "70px Arial";
    pencil.strokeText("GAME OVER", 180, 200);
  }
}

function moveBars()
{
  if (gameStarted)
  {
    for (index in obstacles.openings)
    {
      obstacles.openings[index].x1 -= 1;

      //If the opening has gone out of sight:
      if ((obstacles.openings[index].x1 + BAR_WIDTH) < 0)
      {
        obstacles.openings[index].x1 = canvas.width;
        obstacles.openings[index].y1 = getRandomInt(ADJUSTED_HEIGHT - MIN_OPENING, 0);
        obstacles.openings[index].y2 = getRandomInt(MAX_OPENING, MIN_OPENING);
      }
    }
    checkForCollisions();
  }
}

function checkForCollisions()
{
  //If the player has an x-axis greater than the nearest opening AND the player has not passed the (x-axis + width)
  //Ensure that the player is within the y-range of the gap (between y1 and (y1+y2))
  for (index in obstacles.openings)
  {
    if
    (
      ( ((playerX + PLAYER_WIDTH) >= obstacles.openings[index].x1) && ((playerX + PLAYER_WIDTH) <= obstacles.openings[index].x1 + BAR_WIDTH) )
      ||
      ( (playerX <= obstacles.openings[index].x1 + BAR_WIDTH) && (playerX >= obstacles.openings[index].x1) )
    )
    {
      if ( (playerY <= obstacles.openings[index].y1) || ( (playerY + PLAYER_HEIGHT) >= (obstacles.openings[index].y1 + obstacles.openings[index].y2)) )
      {
        gameStarted = false;
        gameOver    = true;
        document.getElementById("scoreMessage").innerHTML = "Your final score is: ";
        document.getElementById("playerScore").style = "left: 125px";
        window.localStorage.setItem("playerScore", playerScore);
      }
      else
      {
        playerScore++;
        document.getElementById("playerScore").innerHTML = playerScore;
      }
    }
  }
}

/*------------------------------ PLAYER MOVEMENT ------------------------------*/

//Allows the player to jump (when spacebar is pressed, see $(function($)) )
function jump()
{
  //TODO: IMPLEMENT
}

function moveUp()
{
  //If the player has NOT reached the top border of the canvas:
  if (playerY > (BORDER_WIDTH / 2))
  {
    playerY -= 5;
  }
  checkForCollisions();
}

function moveDown()
{
  //If the player has NOT reached the bottom border of the canvas:
  if ((playerY + PLAYER_HEIGHT) < ADJUSTED_HEIGHT )
  {
    playerY += 5;
  }
  checkForCollisions();
}

function moveRight()
{
  //If the player has NOT reached the right border of the canvas:
  if ((playerX + PLAYER_WIDTH) < canvas.width - (BORDER_WIDTH / 2) )
  {
    playerX += 5;
  }
  checkForCollisions();
}

function moveLeft()
{
  //If the player has NOT reached the left border of the canvas:
  if (playerX > (BORDER_WIDTH / 2))
  {
    playerX -= 5;
  }
  checkForCollisions();
}

/*----------------------------- /PLAYER MOVEMENT/ -----------------------------*/



//Returns the adjusted y-value to draw an object at the bottom of the screen
//without conflicting with the canvas border or going beyond the canvas dimensions.
function alignToBottom(objHeight)
{
  return ADJUSTED_HEIGHT - objHeight;
}

/* $( handler) synonymous to $("document").isReady( handler ) */
/* This jQuery function accepts keyboard-input from the user */
$(function($)
{
  $('#startGame').on('click', function()
  {
    gameStarted = true;
    console.log("Game Started");
    $('#startGame').hide();
    $('#retry').show();
  });

  $('#retry').on('click', function()
  {
    window.location.href = "hoppin_cube.html";
  });

  $('body').on('keypress', function (event)
  {
    //event.which and event.keyCode are synonymous, but both are required for cross-browser support.
    var keyValue = event.which || event.keyCode;
    var keyChar  = String.fromCharCode(keyValue);

    //This will only accept user-input if they have started the game:
    if (gameStarted)
    {
      switch (keyChar)
      {
        case 'w':
          moveUp();
          break;
        case 'W':
          moveUp();
          break;

        case 's':
          moveDown();
          break;
        case 'S':
          moveDown();
          break;

        case 'a':
          moveLeft();
          break;
        case 'A':
          moveLeft();
          break;

        case 'd':
          moveRight();
          break;
        case 'D':
          moveRight();
          break;

        case ' ':
          jump();
          break;

        default:
          console.log("This key is not supported");
      }
    } //End of: if (startGame)

  }) //End of: $('body').on('keypress, function (event)

}); //End of: $(function($

function clear()
{
  pencil.clearRect(0, 0, canvas.width, canvas.height);
}

function draw()
{
  //First remove previous frame:
  clear();

  //Then draw new frame:
  drawPlayer();
  moveBars();
  drawBars();
  drawBorder();
  gameOverMessage();
}

//Save previous score in local storage (data will be maintained after page reload):
if (window.localStorage.getItem("playerScore") == null)
{
  window.document.getElementById("previousScoreMessage").innerHTML = "(Last recorded score: None. Play to record!)";
}
else
{
  window.document.getElementById("previousScoreMessage").innerHTML = "(Last recorded score: " + window.localStorage.getItem("playerScore") + ")";
}
setInterval(draw, 1000/60);
