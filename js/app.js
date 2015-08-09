function init(){
	var melody =  ESC.models.MelodyFactory.getToneRow();
	
	var sheet_music = document.getElementById('sheet_music');
	sheet_music.innerHTML = melody.toNotation();
	console.log(melody.toNotation());
	return melody.getPlayer();
}

function play(){
	player.play();	
}

var player = init();