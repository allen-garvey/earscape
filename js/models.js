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
* gets total value of Pitch by combining noteNum and octave
* used to get inversion
*/
ESC.models.Pitch.prototype.totalValue = function(){
	return this.octave * 12 + this.noteNum;
}
ESC.models.Pitch.pitchFromTotalValue = function(totalValue){
	var noteNum = totalValue % 12;
	var octave = Math.floor(totalValue / 12);
	return new ESC.models.Pitch(noteNum, octave);
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
ESC.models.Melody.transformationTypes = ['original', 'inversion', 'retrograde', 'retrograde_inversion'];
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
* options is {} with possible values of tempo : int
*/
ESC.models.Melody.prototype.getPlayer = function(conductor){
	conductor.setTimeSignature(this.timeSignature.top, this.timeSignature.bottom);
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

ESC.models.Melody.prototype.copy = function(){
	var copy = new ESC.models.Melody();
	copy.tempo = this.tempo;
	copy.timeSignature.top = this.timeSignature.top;
	copy.timeSignature.bottom = this.timeSignature.bottom; 
	var len = this.pitches.length;
	for (var i = 0; i < len; i++) {
		copy.pitches.push(new ESC.models.Pitch(this.pitches[i].noteNum, this.pitches[i].octave));
		copy.rhythms.push(new ESC.models.Rhythm(this.rhythms[i].duration));
	};
	return copy;
}
ESC.models.Melody.prototype.retrograde = function(){
	var retrograde = this.copy();
	retrograde.pitches.reverse();
	retrograde.rhythms.reverse();
	return retrograde;
}
/*
* Inversion does not handle octave changes correctly (for now)
*/
ESC.models.Melody.prototype.inversion = function(){
	var inverse = this.copy();

	var diffArray = [inverse.pitches[0].totalValue()];
	for (var i = 1; i < inverse.pitches.length; i++) {
		var currentTotalValue = inverse.pitches[i].totalValue();
		diffArray.push(currentTotalValue);
		var diff =  currentTotalValue - diffArray[i-1];
		inverse.pitches[i] = ESC.models.Pitch.pitchFromTotalValue(inverse.pitches[i-1].totalValue() - diff);
	};
	return inverse;
}
ESC.models.Melody.prototype.retrogradeInversion = function(){
	return this.retrograde().inversion();
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
		melody.rhythms.push(ESC.models.MelodyFactory.randRhythm());
	}
	return melody;
}
/*
* Return ESC.models.Rhythm object of random duration
*/
ESC.models.MelodyFactory.randRhythm = function(){
	return new ESC.models.Rhythm(ESC.array.randItem(Object.keys(ESC.models.Rhythm.durationMap)));
}
/*
* Takes a melody and return a new melody with pitches replaced with new random ones
* @param melody - instance of ESC.models.Melody
*/
ESC.models.MelodyFactory.replacePitches = function(melody){
	var newMelody = melody.copy();
	newMelody.pitches = [];
	var len = melody.pitches.length;
	var pitches = ESC.array.shuffle(ESC.array.range(0,12));
	for (var i = 0; i < len; i++) {
		newMelody.pitches.push(new ESC.models.Pitch(pitches[i], 4));
	};
	return newMelody;
}

/*
* Takes a melody and return a new melody with rhythms replaced with new random ones
* @param melody - instance of ESC.models.Melody
*/
ESC.models.MelodyFactory.replaceRhythms = function(melody){
	var newMelody = melody.copy();
	newMelody.rhythms = [];
	var len = melody.rhythms.length;
	for (var i = 0; i < len; i++) {
		newMelody.rhythms.push(ESC.models.MelodyFactory.randRhythm());
	};
	return newMelody;
}