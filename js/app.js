ESC.jukebox = new ESC.controllers.Jukebox();
ESC.jukebox.newPlayItem();
document.getElementById('play_button').onclick = function(){ESC.jukebox.play();};
document.getElementById('new_button').onclick = function(){ESC.jukebox.newPlayItem();};