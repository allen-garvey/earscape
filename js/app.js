ESC.jukebox = new ESC.controllers.Jukebox();
ESC.jukebox.newPlayItem();
document.getElementById('play_button').onclick = function(){ESC.jukebox.play();};
document.getElementById('new_button').onclick = function(){ESC.jukebox.newPlayItem();};

document.getElementById('button_replace_notes').onclick = function(){ESC.jukebox.melodyWithNew('notes')};
document.getElementById('button_replace_rhythm').onclick = function(){ESC.jukebox.melodyWithNew('rhythm')};

document.getElementById('button_transform_original').onclick = function(){
																			ESC.jukebox.transformMelody('original');
																			$('.transformations li').removeClass('selected');
																			$(this).addClass('selected');
																		};


document.getElementById('button_transform_retrograde').onclick = function(){
																			ESC.jukebox.transformMelody('retrograde');
																			$('.transformations li').removeClass('selected');
																			$(this).addClass('selected');
																			};
$('#tempo_input, #tempo_slider').on('change', function(event) {
	ESC.jukebox.setTempo(this.value);
});