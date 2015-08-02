/*
* Shuffle function taken from:
* http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
*/
function shuffle(array) {
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

function randElement(array){
	return array[Math.floor(Math.random() * array.length)];
}

var noteNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
var noteDurations = ['quarter', 'eighth', 'dottedQuarter', 'half', 'dottedHalf', 'sixteenth', 'dottedEighth'];
var noteDurationsNotation = {'quarter': ':q', 'eighth' : ':8', 'sixteenth' : ':16', 'half' : ':h', 'dottedHalf': ':hd', 'dottedQuarter' : ':qd', 'dottedEighth' : ':8d'};
var toneRow = shuffle(noteNames);

function init(){
	var conductor = new BandJS();
	var notationText = 'tabstave notation=true tablature=false \n notes ';
	conductor.setTimeSignature(4,4);
	conductor.setTempo(120);
	var piano = conductor.createInstrument();
	for (var i = 0; i < toneRow.length; i++) {
		var note = toneRow[i] + '/4';
		var duration = randElement(noteDurations);
		notationText = notationText + noteDurationsNotation[duration] + ' ' + note.replace(/b/g, '@') + ' ';
		piano.note(duration, note.replace('/', ''));
	};
	var sheet_music = document.getElementById('sheet_music');
	sheet_music.innerHTML = notationText;
	sheet_music.className = 'vex-tabdiv';
	console.log(notationText);
	return conductor.finish();
}

function play(){
	player.play();	
}

player = init();