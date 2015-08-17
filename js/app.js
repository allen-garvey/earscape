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


