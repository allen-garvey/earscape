<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Earscape</title>
        <meta name="description" content="Test of band.js library"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" type="text/css" href="<?= STYLES_URL.'master.css'; ?>"/>
        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    </head>
    <body>
        <header class='jumbotron'>
            <div class='container'>
                <h1 class='brand'>Earscape</h1>
                <p class='lead'>Generate your own random twelve-tone melody!</p>
            </div>
        </header>
        <main class='container'>
            <div class='controls'>
                <div class='flex_container'><input type="number" class='tempo_input' value='120' id='tempo_input' /><input type="range" min='40' max='300' step='1' value='120' class='tempo_slider' id='tempo_slider' /></div>
                <div class='flex_container'>
                    <div class='button_container play' id='play_button'><?php include(SVG_PATH.'ei-play.svg'); ?></div>
                    <ul>
                        <li><div class='button_container' id='new_button'><?php include(SVG_PATH.'ei-plus.svg'); ?><span>New Melody</span></div></li>
                        <li><div class='button_container' id='button_replace_notes'><?php include(SVG_PATH.'ei-refresh.svg'); ?><span>Change Notes</span></div></li>
                        <li><div class='button_container' id='button_replace_rhythm'><?php include(SVG_PATH.'ei-refresh.svg'); ?><span>Change Rhythm</span></div></li>
                    </ul>
                </div>
            </div>
            <div id='sheet_music'>
                <canvas class="vex-canvas" id='sheet_music_canvas'  width="400" height="200"></canvas>
            </div>
            <div class='transformations'>
                <ul>
                    <li id='button_transform_original' class='selected'>Original</li>
                    <li id='button_transform_inversion'>Inversion</li>
                    <li id='button_transform_retrograde'>Retrograde</li>
                    <li id='button_transform_retrograde_inversion'>Retrograde Inversion</li>
                </ul>
            </div>
            <div class='playlist'>
                <ol id='play_items_list'>
                    
                </ol>
            </div>

        </main>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script type="text/javascript" src='<?= SCRIPTS_URL.'vextab-div.js'; ?>'></script>
        <script type="text/javascript" src='<?= SCRIPTS_URL.'band.min.js'; ?>'></script>
        <script type="text/javascript" src='<?= SCRIPTS_URL.'app.js'; ?>'></script>
    </body>
</html>