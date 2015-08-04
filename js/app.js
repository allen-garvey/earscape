var toneRow = ESC.array.shuffle(ESC.notes.noteNames);

function init(){
	var conductor = new BandJS();
	var notationText = 'tabstave notation=true tablature=false \n notes ';
	conductor.setTimeSignature(4,4);
	conductor.setTempo(120);
	var piano = conductor.createInstrument();
	for (var i = 0; i < toneRow.length; i++) {
		var note = toneRow[i] + '/4';
		var duration = ESC.array.randElement(ESC.notes.noteDurations);
		notationText = notationText + ESC.notes.noteDurationsNotation[duration] + ' ' + note.replace(/b/g, '@') + ' ';
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