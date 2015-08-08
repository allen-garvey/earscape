/*
* Utility array functions
*/
ESC.array = {};
/*
* Shuffle function taken from:
* http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
*/
ESC.array.shuffle = function(array) {
    var cloneArray = array.slice(0);
    var currentIndex = cloneArray.length;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        var randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        var temporaryValue = cloneArray[currentIndex];
        cloneArray[currentIndex] = cloneArray[randomIndex];
        cloneArray[randomIndex] = temporaryValue;
    }

  return cloneArray;
}

ESC.array.randItem = function(array){
	return array[Math.floor(Math.random() * array.length)];
}
/*
* Returns array of numbers from start to end exclusive (one less than the end number)
*/
ESC.array.range = function(start, end){
    var a = [];
    for (var i = start; i < end; i++) {
        a.push(i);
    };
    return a;
}