ESC.models = {};

/*
* Model for pitch information
* noteNum is integer 0-11 with C being 0
* octave is integer 1-8
*/
ESC.models.Pitch = function(noteNum, octave){
	this.noteNum = noteNum;
	this.octave = octave;
}

ESC.models.Pitch.pitchNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

ESC.models.Pitch.prototype.toNotation = function(){
	return ESC.models.Pitch.pitchNames[this.noteNum].replace('b', '@') + '/' + this.octave;
}
ESC.models.Pitch.prototype.toString = function(){
	return ESC.models.Pitch.pitchNames[this.noteNum] + this.octave;
}
ESC.models.Pitch.prototype.toHTML = function(){
	return ESC.models.Pitch.pitchNames[this.noteNum].replace('#', '&#9839;').replace('b', '&#9837;');
}

/*
* Model for rhythm information
* duration is the number of 64th note triplets in note (i.e quarter is 24) - lowest number is 1
* duration can also be string value (i.e. quarter) - taken from name keys in durationInfo
*/
ESC.models.Rhythm = function(duration){
	if(typeof duration === 'string' && isNaN(parseInt(duration))){
		duration = this.nameToDuration(duration);	
	}
	else{
		duration = parseInt(duration);
	}
	this.duration = duration;
}
ESC.models.Rhythm.durationMap = { '6' : {name : 'sixteenth', notation : ':16'}, 
											'12' : {name : 'eighth', notation: ':16'}, 
											'18' : {name : 'dottedEighth', notation : ':8d'}, 
											'24': {name: 'quarter', notation: ':q'}, 
											'36' : {name: 'dottedQuarter', notation: ':qd'}, 
											'48' : {name: 'half', notation : ':h'},
											'72' : {name: 'dottedHalf', notation : ':hd'},
											'96' : {name : 'whole', notation : ':w'}
										};
ESC.models.Rhythm.prototype.nameToDuration = function(name){
	for(var key in ESC.models.Rhythm.durationMap){
		if(ESC.models.Rhythm.durationMap[key].name === name){
			return parseInt(key);
		}
	}
}
ESC.models.Rhythm.prototype.toString = function() {
	return ESC.models.Rhythm.durationMap[this.duration].name;
}
ESC.models.Rhythm.prototype.toNotation = function(){
	return ESC.models.Rhythm.durationMap[this.duration].notation;	
}

/*
* Model for melody, which is a container for pitch and rhythm information
* pitches is array of Pitches
* rhythms is array of Rhythms
*/
ESC.models.Melody = function(){
	this.pitches = [];
	this.rhythms = [];
	this.tempo = 120;
	this.timeSignature = {top: 4, bottom: 4};
}
/*
* Returns string formatted for vextab to turn into notation
*/
ESC.models.Melody.prototype.toNotation = function(){
	var notation = 'tabstave notation=true tablature=false\nnotes';
	var len = this.pitches.length;
	for (var i = 0; i < len; i++) {
		notation = notation + ' ' + this.rhythms[i].toNotation() + ' ' + this.pitches[i].toNotation();
	};
	return notation;
}
/*
* Returns Band.js player instance - call .play function to play melody
*/
ESC.models.Melody.prototype.getPlayer = function(){
	var conductor = new BandJS();
	conductor.setTimeSignature(this.timeSignature.top, this.timeSignature.bottom);
	conductor.setTempo(this.tempo);
	var piano = conductor.createInstrument();
	var len = this.pitches.length;
	for (var i = 0; i < len; i++) {
		piano.note(this.rhythms[i].toString(), this.pitches[i].toString());
	};
	return conductor.finish();
}
ESC.models.Melody.prototype.getTitle = function(){
	var title = '';
	this.pitches.forEach(function(pitch) {
		title = title + pitch.toHTML() + '-';
	});
	return title.slice(0, - 1);
}

/*
* Melody Factory
* Class to conveniently build various kinds of melodies
*/
ESC.models.MelodyFactory = function(){};

ESC.models.MelodyFactory.getToneRow = function(){
	var melody = new ESC.models.Melody();
	var pitches = ESC.array.shuffle(ESC.array.range(0,12));
	for(var i=0;i<12;i++){
		melody.pitches.push(new ESC.models.Pitch(pitches[i], 4));
		melody.rhythms.push(new ESC.models.Rhythm(ESC.array.randItem(Object.keys(ESC.models.Rhythm.durationMap))));
	}
	return melody;
}