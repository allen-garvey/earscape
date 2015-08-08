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
                <div class='flex_container'><input type="number" class='tempo_input' value='120' /><input type="range" min='1' max='300' step='1' class='tempo_slider' /></div>
                <div class='flex_container'>
                    <div class='button_container play'><?php include(SVG_PATH.'ei-play.svg'); ?></div>
                    <ul>
                        <li><div class='button_container'><?php include(SVG_PATH.'ei-plus.svg'); ?><span>New Melody</span></div></li>
                        <li><div class='button_container'><?php include(SVG_PATH.'ei-refresh.svg'); ?><span>Change Notes</span></div></li>
                        <li><div class='button_container'><?php include(SVG_PATH.'ei-refresh.svg'); ?><span>Change Rhythm</span></div></li>
                    </ul>
                </div>
            </div>
            <div id='sheet_music' class='vex-tabdiv'>
            </div>
            <div class='options'>
                <ul>
                    <li>Original</li>
                    <li>Inversion</li>
                    <li>Retrograde</li>
                    <li>Retrograde Inversion</li>
                </ul>
            </div>
            <div class='playlist'>
                <ol>
                    <li class='selected'><span>F#-A-B-C-D-E-F-G-G#-Bb-C#-Eb </span><?php include(SVG_PATH.'ei-star.svg'); ?></li>
                    <li><span>F#-A-B-C-D-E-F-G-G#-Bb-C#-Eb </span><?php include(SVG_PATH.'ei-star.svg'); ?></li>
                </ol>
            </div>

        </main>
        <script type="text/javascript" src='<?= SCRIPTS_URL.'band.min.js'; ?>'></script>
        <script type="text/javascript" src='<?= SCRIPTS_URL.'vextab-div.js'; ?>'></script>
        <script type="text/javascript" src='<?= SCRIPTS_URL.'app.js'; ?>'></script>
    </body>
</html>