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
