//top level object for earscape app
var ESC = {};
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
ESC.models.Pitch.prototype.transpose = function(halfSteps){
	var newValue = this.totalValue() + halfSteps;
	this.noteNum = newValue % 12;
	this.octave = Math.floor(newValue / 12);
}
ESC.models.Pitch.pitchFromTotalValue = function(totalValue){
	var pitch = new ESC.models.Pitch(0, 0);
	pitch.transpose(totalValue);
	return pitch;
}
ESC.models.Pitch.prototype.copy = function(){
	return new ESC.models.Pitch(this.noteNum, this.octave);
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
		copy.pitches.push(this.pitches[i].copy());
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
ESC.controllers = {};

/*
* PlayItem - container for playlist items
* @param melody is instance of ESC.models.Melody
* baseMelody is original melody before any transformations
* currentMelody is the current melody after any transformations (inversion, retrograde, etc)
*/
ESC.controllers.PlayItem = function(melody){
	this.baseMelody = melody;
	this.currentMelody = melody;
	this.isStarred = false;
	this.melodyState = 'original';
}
/* 
* options is {} with possible values of tempo : int
*/
ESC.controllers.PlayItem.prototype.play = function(conductor){
	return this.currentMelody.getPlayer(conductor);
}
ESC.controllers.PlayItem.prototype.getNotation = function(){
	return this.currentMelody.toNotation();
}
ESC.controllers.PlayItem.prototype.getTitle = function(){
	return this.currentMelody.getTitle();
}

ESC.controllers.PlayItem.prototype.setTransformation = function(type){
	if(type === 'retrograde'){
		this.currentMelody = this.baseMelody.retrograde();
		this.melodyState = type;
	}
	else if(type === 'inversion'){
		this.currentMelody = this.baseMelody.inversion();
		this.melodyState = type;
	}
	else if(type === 'retrograde_inversion'){
		this.currentMelody = this.baseMelody.retrogradeInversion();
		this.melodyState = type;	
	}
	//type is original
	else{
		this.currentMelody = this.baseMelody;
		this.melodyState = 'original';
	}
}
ESC.controllers.PlayItem.prototype.toHTML = function(){
	return this.getTitle() + '<span class="star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M11,47.8c-0.3,0-0.5-0.1-0.8-0.3c-0.5-0.4-0.6-0.9-0.5-1.4l5-15.5L1.6,21c-0.5-0.4-0.6-0.9-0.5-1.4c0.1-0.5,0.6-0.9,1.3-0.9h16.4l4.9-15.6c0.1-0.5,0.6-0.9,1.3-0.9s1,0.4,1.3,0.9l5,15.6h16.4c0.5,0,1,0.3,1.3,0.8c0.3,0.5,0,1.2-0.5,1.4l-13.1,9.5l5,15.5c0.1,0.5,0,1.2-0.5,1.4c-0.5,0.3-1,0.4-1.5,0L24.9,38l-13.1,9.5C11.5,47.7,11.2,47.8,11,47.8L11,47.8z M24.9,35.1c0.3,0,0.5,0.1,0.8,0.3l10.7,7.9l-4.1-12.6c-0.1-0.5,0-1.2,0.5-1.4l10.7-7.9H30.2c-0.5,0-1-0.4-1.3-0.9l-4-12.6l-4.1,12.6c-0.1,0.5-0.6,0.9-1.3,0.9H6.2l10.7,7.9c0.5,0.4,0.6,0.9,0.5,1.4l-4,12.6l10.7-7.9C24.4,35.2,24.7,35.1,24.9,35.1L24.9,35.1z"/><path class="star_center" d="M24.9,35.1c0.3,0,0.5,0.1,0.8,0.3l10.7,7.9l-4.1-12.6c-0.1-0.5,0-1.2,0.5-1.4l10.7-7.9H30.2c-0.5,0-1-0.4-1.3-0.9l-4-12.6l-4.1,12.6c-0.1,0.5-0.6,0.9-1.3,0.9H6.2l10.7,7.9c0.5,0.4,0.6,0.9,0.5,1.4l-4,12.6l10.7-7.9C24.4,35.2,24.7,35.1,24.9,35.1L24.9,35.1z"/></svg></span>';
}

/*
* Jukebox - master controller for app
* keeps track of a list of PlayItems
*/
ESC.controllers.Jukebox = function(){
	this.playItems = [];
	this.currentPlayItemIndex = -1;
	this.currentPlayItem = null;
	this.conductor = new BandJS();
	this.setTempo(120);
	
}
ESC.controllers.Jukebox.prototype.addPlayItem = function(playItem){
	this.playItems.push(playItem);
	var play_items_list = document.getElementById('play_items_list');
	play_items_list.innerHTML = play_items_list.innerHTML + "<li>" + playItem.toHTML() +  "</li>";
	this.setCurrentPlayItem(this.playItems.length - 1);
	//scroll to added item
	var playlist = $('.playlist');
	playlist.scrollTop(playlist[0].scrollHeight);
}

ESC.controllers.Jukebox.prototype.setCurrentPlayItem = function(index){
	this.currentPlayItemIndex = index;
	this.currentPlayItem = this.playItems[index];
	
	//sets selected state in play_items_list
	var allPlaylistItems = $('#play_items_list li');
	allPlaylistItems.removeClass('selected');
	allPlaylistItems.eq(index).addClass('selected');

	this.displayMelodyState(this.currentPlayItem.melodyState);

	//displays sheet music
	this.displayCurrentPlayItem();
}
ESC.controllers.Jukebox.prototype.displayCurrentPlayItem = function(){
	//displays notation - adapted from: https://groups.google.com/forum/?fromgroups#!topic/vexflow/sgj9bjcSx9Y
	var artist = new VexTabDiv.Artist(10, 10, 600, {scale: 0.8});
	var vextab = new VexTabDiv.VexTab(artist);
	//1 is enum for CANVAS - using VexTabDiv.Flow.Renderer.Backends.CANVAS doesn't work for some reason
	//'sheet_music_canvas' is name of id of canvas element
	var renderer = new VexTabDiv.Flow.Renderer('sheet_music_canvas', 1);
	try {
          vextab.reset();
          artist.reset();
          vextab.parse(this.currentPlayItem.getNotation());
          artist.render(renderer);
        } catch (e) {
          console.log(e);
        }
}
ESC.controllers.Jukebox.prototype.play = function(){
	this.conductor.setTempo(this.tempo); //changing tempo while song is playing causes weird distortion
	//clear instruments since this.currentPlayItem.play(this.conductor) will load instruments into the conductor
	//this has the same effect as clearing the last played melody from conductor's memory
	//doesn't prevent playing multiple melodies at the same time
	this.conductor.instruments = [];
	this.player = this.currentPlayItem.play(this.conductor);
	this.player.play();
}
ESC.controllers.Jukebox.prototype.newPlayItem = function(){
	this.addPlayItem(new ESC.controllers.PlayItem(ESC.models.MelodyFactory.getToneRow()));
}
ESC.controllers.Jukebox.prototype.melodyWithNew = function(attr){
	var newMelody;
	if(attr === 'notes'){
		newMelody = ESC.models.MelodyFactory.replacePitches(this.currentPlayItem.currentMelody);
	}
	// replace rhythm
	else{
		newMelody = ESC.models.MelodyFactory.replaceRhythms(this.currentPlayItem.currentMelody);
	}
	this.addPlayItem(new ESC.controllers.PlayItem(newMelody));
}
ESC.controllers.Jukebox.prototype.transformMelody = function(type){
	this.currentPlayItem.setTransformation(type);
	this.displayMelodyState(this.currentPlayItem.melodyState);
	this.displayCurrentPlayItem();
}
ESC.controllers.Jukebox.prototype.setTempo = function(tempo){
	tempo = parseInt(tempo);
	if(!(isNaN(tempo) || tempo > 300 || tempo < 40)){
		this.tempo = tempo;
	}
	$('#tempo_input, #tempo_slider').val(this.tempo);
}
ESC.controllers.Jukebox.prototype.displayMelodyState = function(melodyState){
	$('.transformations li').removeClass('selected');
	$('#button_transform_' + melodyState).addClass('selected');
}

ESC.jukebox = new ESC.controllers.Jukebox();
ESC.jukebox.newPlayItem();
document.getElementById('play_button').onclick = function(){ESC.jukebox.play();};
document.getElementById('new_button').onclick = function(){ESC.jukebox.newPlayItem();};

document.getElementById('button_replace_notes').onclick = function(){ESC.jukebox.melodyWithNew('notes')};
document.getElementById('button_replace_rhythm').onclick = function(){ESC.jukebox.melodyWithNew('rhythm')};

(function(){
	for (var i = 0; i < ESC.models.Melody.transformationTypes.length; i++) {
		var type = ESC.models.Melody.transformationTypes[i];
		(function(type){document.getElementById('button_transform_' + type).onclick = function(){
																			ESC.jukebox.transformMelody(type);
																		};
																	})(type);
	};
})();


$('#tempo_input, #tempo_slider').on('change', function(event) {
	ESC.jukebox.setTempo(this.value);
});

$('#play_items_list').on('click', 'li', function(){
	var index = $('#play_items_list li').index($(this));
	ESC.jukebox.setCurrentPlayItem(index);
});
$('#play_items_list').on('click', '.star', function(e){
	e.stopPropagation(); //so that play item is not selected
	$(this).toggleClass('starred');
});



//# sourceMappingURL=app.js.map