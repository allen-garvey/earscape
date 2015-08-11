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
}
ESC.controllers.PlayItem.prototype.play = function(){
	var player = this.currentMelody.getPlayer();
	player.play();
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
	}
	//type is original
	else{
		this.currentMelody = this.baseMelody;
	}
}

/*
* Jukebox - master controller for app
* keeps track of a list of PlayItems
*/
ESC.controllers.Jukebox = function(){
	this.playItems = [];
	this.currentPlayItemIndex = -1;
	this.currentPlayItem = null;
	this.setTempo(120);
	
}
ESC.controllers.Jukebox.prototype.addPlayItem = function(playItem){
	this.playItems.push(playItem);
	this.setCurrentPlayItem(this.playItems.length - 1);
	var play_items_list = document.getElementById('play_items_list');
	console.log(playItem.getTitle());
	play_items_list.innerHTML = play_items_list.innerHTML + "<li>" + playItem.getTitle() + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M15.2 40.6c-.2 0-.4-.1-.6-.2-.4-.3-.5-.7-.4-1.1l3.9-12-10.2-7.5c-.4-.3-.5-.7-.4-1.1s.5-.7 1-.7h12.7L25 5.9c.1-.4.5-.7 1-.7s.8.3 1 .7L30.9 18h12.7c.4 0 .8.2 1 .6s0 .9-.4 1.1L34 27.1l3.9 12c.1.4 0 .9-.4 1.1s-.8.3-1.2 0L26 33l-10.2 7.4c-.2.1-.4.2-.6.2zM26 30.7c.2 0 .4.1.6.2l8.3 6.1-3.2-9.8c-.1-.4 0-.9.4-1.1l8.3-6.1H30.1c-.4 0-.8-.3-1-.7L26 9.5l-3.2 9.8c-.1.4-.5.7-1 .7H11.5l8.3 6.1c.4.3.5.7.4 1.1L17.1 37l8.3-6.1c.2-.1.4-.2.6-.2z"/></svg>' +  "</li>";
}

ESC.controllers.Jukebox.prototype.setCurrentPlayItem = function(index){
	this.currentPlayItemIndex = index;
	this.currentPlayItem = this.playItems[index];
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
	this.currentPlayItem.play();
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
	this.displayCurrentPlayItem();
}
ESC.controllers.Jukebox.prototype.setTempo = function(tempo){
	tempo = parseInt(tempo);
	if(!(isNaN(tempo) || tempo > 300 || tempo < 40)){
		this.tempo = tempo;
	}
	$('#tempo_input, #tempo_slider').val(this.tempo);
}
