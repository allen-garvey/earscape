<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Test of Band.js</title>
        <meta name="description" content="Test of band.js library"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" type="text/css" href="<?= STYLES_URL.'master.css'; ?>"/>
        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    </head>
    <body>
        <main class='container'>
            <h1>Earscape</h1>
            <p>Generate your own random twelve-tone melody!</p>
            <div class='play_button'>
                <img src="<?= IMAGES_URL.'ei-play.svg'; ?>" alt="" onclick='play()' />
            </div>
            <div id='sheet_music'>
            </div>

        </main>
        <script type="text/javascript" src='<?= SCRIPTS_URL.'band.min.js'; ?>'></script>
        <script type="text/javascript" src='<?= SCRIPTS_URL.'vextab-div.js'; ?>'></script>
        <script type="text/javascript" src='<?= SCRIPTS_URL.'app.js'; ?>'></script>
    </body>
</html>