/* Reterns a random integer between 0 and (max - 1).  */
function getRandomInt(max)
{
  return Math.floor(Math.random() * Math.floor(max));
}

var startAnimBtn = document.getElementById("startAnimBtn");
startAnimBtn.classList.toggle("Button_Disabled"); //Set class=Button_Disabled to false

var reloadPage = document.getElementById("resetBtn");

var canvas = document.getElementById('canvas');
var pencil = canvas.getContext('2d');

/* 'percentageOverlap' calculated and used to determine the transparency of the sky and visibility of the stars */
var percentageOverlap = 1.0;

/* Distance in pixels that will be covered with each frame */
const TRANSITION_SPEED = 1;

/* Coordinates of Sol and Luna */
var solX   = 400;
var solY   = 200;
var lunaX  = 580;
var lunaY  = 200;

/* Radius of Sol and Luna */
const SOL_R   = 40;
const LUNA_R  = 41;
const AREA_OF_SOL = Math.PI * Math.pow(SOL_R, 2);

/* Matrix of stars that will be rendered */
const NumberOfStars = 100;
var starMatrix = [];

//Creates a matrix of stars that will be rendered when renderStars() is called.
function mapStars()
{
  //Generate random stars and save their locations in a JSON array:
  for (iterator = 0; iterator < NumberOfStars; iterator++)
  {
    var x = getRandomInt(canvas.width);
    var y = getRandomInt(canvas.height);
    starMatrix.push(x);
    starMatrix.push(y);
  }
}

/* ------------------------------ Sky ------------------------------ */
function renderSky()
{
  /* Pencil Properties */
  pencil.fillStyle   = "rgb(0," + ((255 * percentageOverlap) / 2) + ", " + (255 * percentageOverlap) + ")";

  /* Sky */
  pencil.fillRect(0, 0, canvas.width, canvas.height);
}
/* ----------------------------- /Sky/ ----------------------------- */

/* ----------------------------- Stars ----------------------------- */
function renderStars()
{
  pencil.fillStyle = "rgb(255, 255, 255, " + (1 - percentageOverlap) + ")";

  //Get star coordinates from starMatrix and render them on canvas
  for (index = 0; index < (NumberOfStars * 2); index += 2)
  {
    pencil.fillRect(starMatrix[index], starMatrix[index + 1], 2, getRandomInt(2));
  }
}
/* ---------------------------- /Stars/ ---------------------------- */

/* ------------------------------ Sun ------------------------------ */
function drawSun()
{
  /* Pencil Properties */
  pencil.lineWidth = 0;
  pencil.strokeStyle = "#e0be00";
  pencil.fillStyle = "#e0be00";

  /* Actual Circle */
  pencil.beginPath();
  pencil.arc(solX, solY, SOL_R, 0, (2 * Math.PI) );
  pencil.fill();
  pencil.stroke();
}
/* ----------------------------- /Sun/ ----------------------------- */

/* ------------------------------ Moon ----------------------------- */
function drawMoon()
{
  /* Pencil Properties */
  pencil.lineWidth   = 0;
  pencil.strokeStyle = "rgb(0," + ( (255 * percentageOverlap) / 2) + ", " + (255 * percentageOverlap) + ")";
  pencil.fillStyle   = "rgb(0," + ( (255 * percentageOverlap) / 2) + ", " + (255 * percentageOverlap) + ")";

  // arc(x, y, radius, starting-angle, ending-angle)
  pencil.beginPath();
  pencil.arc(lunaX, lunaY, LUNA_R, 0, (2 * Math.PI) );
  pencil.fill();
  pencil.stroke();
}
/* ----------------------------- /Moon/ ---------------------------- */


/* --------------------------- Signature --------------------------- */
function signature()
{
  pencil.strokeStyle = "#000000";
  pencil.font = '30px Arial';
  pencil.strokeText("Solar Eclipse: By Scott McKay", 390, 790);
}
/* -------------------------- /Signature/ -------------------------- */

function startAnimation()
{
  startAnimBtn.classList.toggle("Button_Enabled");
  startAnimBtn.classList.toggle("Button_Disabled");
  startAnimBtn.disabled = true;
  startAnimBtn.innerHTML = "Please be Patient. . ."

  this.setInterval(beginEclipse, 1000 / 20);
}

/* ---------------------------- Animation ---------------------------- */
function beginEclipse()
{
  /* Reset Canvas */
  pencil.clearRect(0, 0, canvas.width, canvas.height);

  lunaX -= TRANSITION_SPEED;
  //If the moon is to the right of the sun (and transitioning left):
  if (lunaX > solX)
  {
    //If the sun and the moon are overlapping:
    if ((lunaX - (LUNA_R * 2)) < solX)
    {
      var radius         = (solX - (lunaX - (LUNA_R * 2) ) ) / 2; //Calculate the width of the intersecting area of both circles, divide by 2 to get a radius:
      var areaOfCoverage = Math.PI * Math.pow(radius, 2);        //Create a circle using the calculated radius:
      percentageOverlap  = 1 - (areaOfCoverage / AREA_OF_SOL);     //Find the percentage of coverage, and get the inverse
    }
  }
  //If the moon is to the left of the sun (and transitioning left):
  else
  {
    //If the sun and moon are overlapping:
    if ((solX - (SOL_R * 2)) < lunaX)
    {
      var radius         = (lunaX - (solX - (SOL_R * 2) ) ) / 2;
      var areaOfCoverage = Math.PI * Math.pow(radius, 2);
      percentageOverlap  = 1 - (areaOfCoverage / AREA_OF_SOL);
    }
    else
    {
        startAnimBtn.innerHTML = "The eclipse has ended!";
    }
  }

  renderSky();
  renderStars();
  drawSun();
  drawMoon();
  signature();
}
/* --------------------------- /Animation/ --------------------------- */

mapStars();
renderSky();
renderStars();
drawSun();
drawMoon();
signature();
