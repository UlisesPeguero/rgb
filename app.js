// defines how many colors will be generated depending on the mode, default = 6
var numSquares = 6;
// stores the 3 or 6 colors used in the round
var colors = [];
// defines the color we need to click on to win
var pickedColor;
// array of divs with the class square
var squares = document.querySelectorAll(".square");
// stores the object that shows the RGB value of the color to be found
var colorDisplay = document.getElementById("colorDisplay");
// stores the object of the message of victory or failure that is displayed
var messageDisplay = document.querySelector("#message");
// stores the object of the header <h1>
var h1 = document.querySelector("h1");
// stores the object for the button #reset
var resetButton = document.querySelector("#reset");
// array of buttons which define the difficulty mode
var modeButtons = document.querySelectorAll(".mode");
// stores the score
var score = 0; 
// stores the object that display the score
var scoreDisplay = document.querySelector("#scoreDisplay"); 
// flag for when the reset function starts
var resetPressed = true; 

// calls for init
init();

// initialize the game after the HTML File and JS file are loaded
function init(){
	setupModeButtons();
	setupSquares();
	// gets the value of token "score" from localStorage
	var lsScore = localStorage.getItem('score');
	if( lsScore !== null ){ // if there was token "score"
		score = lsScore; 
		scoreDisplay.textContent = score;
	}
	else { // if not 
		// creates one
		localStorage.setItem('score', score); 
	}
	reset();
}

// Initializes the mode buttons
function setupModeButtons(){
	// cycles thru the array of mode buttons
	for(var i = 0; i < modeButtons.length; i++){
		// adds onclick event to the individual button
		modeButtons[i].addEventListener("click", function(){
			// whenever a button is clicked it removes the class selected from the previously selected one
			document.getElementsByClassName('selected')[0].classList.remove('selected');
			// adds the class select to the clicked button
			this.classList.add("selected");
			// the number of squares that will be displayed depends on the mode
			numSquares = this.textContent === "Easy" ? 3 : 6;
			// calls reset of the game with new specifications
			reset();
		});
	}
}

// initializes the squares count and background values
function setupSquares(){
	// cycle thru the divs with class square
	for(var i = 0; i < squares.length; i++){
		//add click listeners to squares
		squares[i].addEventListener("click", function(){
			//grab color of clicked square
			var clickedColor = this.style.backgroundColor; // changed to backgroundColor for browser compatibility
			//compare color to pickedColor
			if(clickedColor === pickedColor){ // if selected the color we are looking for
				updateColorName();
				//console.log(colorName);
				// if the selected square is the right color, display "Correct"
				messageDisplay.textContent = "Correct!";
				// the game is over, ask if they want to reset the game
				resetButton.textContent = "Play Again?";
				changeColors(clickedColor);
				// change header to the color we were looking for
				h1.style.background = clickedColor;
				// if the game had been resetted
				if(resetPressed){
					// increase score by 5
					score+=5; 
					// changes flag resetPressed to false
					resetPressed = false;
				}
				// display score
				scoreDisplay.textContent = score;
				// overwrite "score" token in localStorage with the new score
				localStorage.setItem('score', score);
			} else { // if not
				// change background of selected square to the same background of the body
				this.style.background = "#232323";
				// display message
				messageDisplay.textContent = "Try Again";
				// decrease score by 1
				score--;
				// display score
				scoreDisplay.textContent = score; 
				// overwrite "score" token in localStorage with the new score
				localStorage.setItem('score', score);
			}
		});
	}
}

// asynchronous function to update the color displayed from RGB to a name from thecolorapi.com 
async function updateColorName(){
	// regular expression  to find ( anything but ')' )
	const regex = /\([^\)]+\)/g; 
	// obtain the rgb color in the form '(r, g, b)' to use on the API
	var rgbColors = pickedColor.match(regex); 
	// concatenate the value to look onto the url of the API
	const url = "https://www.thecolorapi.com/id?rgb="+rgbColors[0];
	// create object with with options for the asynchronous request
	var requestOptions = {
	  method: 'GET',
	  redirect: 'follow'
	};
	// execute the request and wait for answer
	let result = await fetch(url, requestOptions); 
	// once we have an answer we wait for the response to be provided in a JSON Object
	let colorData = await result.json(); 
	// verify if the color was found
	if(colorData.name.exact_match_name) {
		// if so assigns the color's name to be displayed
		colorDisplay.textContent = colorData.name.value; 
	}
	else {
		// if not uses the closest name available 
		colorDisplay.textContent = colorData.name.value + "-ish"; 
	}
}

// resets the state of the game
function reset(){
	// indicates that a reset was called
	resetPressed = true;
	// gets the new colors for the round
	colors = generateRandomColors(numSquares);
	//pick a new random color from array
	pickedColor = pickColor();
	//change colorDisplay to match picked Color
	colorDisplay.textContent = pickedColor;
	// resets button
	resetButton.textContent = "New Colors"
	// resets display message
	messageDisplay.textContent = "";
	//change colors of squares
	for(var i = 0; i < squares.length; i++){
		// change the background color of the squares, only if there is a valid color in the colors array
		if(colors[i]){
			squares[i].style.display = "block"
			squares[i].style.background = colors[i];
		} else {
			// if there is no color because the mode doesn't allow it, it hides the rest of the squares
			squares[i].style.display = "none";
		}
	}
	// resets color of header
	h1.style.background = "steelblue";
}

// adds onclick listener to reset button
resetButton.addEventListener("click", function(){
	reset();
})

// changes all swuares background to the parameter color
function changeColors(color){
	//loop through all squares
	for(var i = 0; i < squares.length; i++){
		//change each color to match given color
		squares[i].style.background = color;
	}
}

// selects one of the colors stored on the array colors to be the one that we need to find
function pickColor(){
	// limits the options from 0 to (colors lenght - 1)
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

// generates a colors array of as many as the num parameter, in this case numSquares
function generateRandomColors(num){
	//make an array
	var arr = [];
	//repeat num times
	for(var i = 0; i < num; i++){
		//get random color and push into arr
		arr.push(randomColor());
	}
	//return that array
	return arr;
}

// creates random RGB values
function randomColor(){
	//pick a "red" from 0 - 255
	var r = Math.floor(Math.random() * 256);
	//pick a "green" from  0 -255
	var g = Math.floor(Math.random() * 256);
	//pick a "blue" from  0 -255
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r + ", " + g + ", " + b + ")";
}