/*
* Utility array functions
*/
ESC.array = {};
/*
* Shuffle function taken from:
* http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
*/
ESC.array.shuffle = function(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

ESC.array.randElement = function(array){
	return array[Math.floor(Math.random() * array.length)];
}