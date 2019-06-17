
var game = new Phaser.Game(900, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update});

var speedship;
var spacefield;
var keys

var bulletTime = 0;
var bullet;
var star;

var meteor;

var score = 0;
var scoreString = '';
var scoreText;
var stateText;
var stateText2;

var lives;

var meteor;

var explosions;
var boom

function preload() {
    game.load.image('spacefield', 'assets/starfield.jpg');
    game.load.image('ship', 'assets/speedship.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('meteor', 'assets/meteor.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('kaboom', 'assets/explode.png', 64, 64, 23);
    this.load.audio('boom', 'assets/boom.mp3');
    game.load.audio('background_music', 'spacemusic.mp3');
}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //background music
    backgroundMusic = game.add.audio('background_music');
    backgroundMusic.loop = true;
    backgroundMusic.play();

    //  the background
    spacefield = game.add.tileSprite(0, 0, 900, 600, 'spacefield');


    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    // the bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++) {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetBullet, this);
    }



    //  Where the ship is set
    speedship = game.add.sprite(450, 500, 'ship');
    speedship.anchor.setTo(0.5, 0.5);
    game.physics.enable(speedship, Phaser.Physics.ARCADE);

    // to make up down rigth the left keys work 
    keys = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    //  Keeping score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '30px Aclonica', fill: '#CCFF00' });

    // Track Lives and set images on top
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives', { font: '30px Aclonica', fill: '#CCFF00' });
    for (var i = 0; i < 4; i++) {
        var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 180;
        ship.alpha = 0.4;
    }

    //  Text
    stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '50px Aclonica', fill: '#CCFF00' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    stateText2 = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '20px Aclonica', fill: '#CCFF00' });
    stateText2.anchor.setTo(0.5, 0.5);
    stateText2.visible = false;


    // Set stars
    stars = game.add.group();
    stars.enableBody = true;
    stars.physicsBodyType = Phaser.Physics.ARCADE;
    createStars();


    //  setting meteors
    meteor = game.add.group();
    meteor.enableBody = true;
    meteor.physicsBodyType = Phaser.Physics.ARCADE;
    meteor.createMultiple(5, 'meteor');
    meteor.setAll('anchor.x', 0.5);
    meteor.setAll('anchor.y', 0.5);
    meteor.setAll('scale.x', 0.5);
    meteor.setAll('scale.y', 0.5);
    meteor.setAll('angle', 180);
    meteor.setAll('outOfBoundsKill', true);
    meteor.setAll('checkWorldBounds', true);
    flyingMeteors();

    // Setting up on collision audio
    boom = game.add.audio('boom');
    //game.sound.setDecodedCallback([boom], start, this);



    // Setting up explosions
    explosions = game.add.group();

    for (var i = 0; i < 10; i++) {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }
}


//Flying Meteors
function flyingMeteors() {

    var SPACING = 500;
    var SPEED = 500;

    var enemy = meteor.getFirstExists(false);
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), -20);
        enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
        enemy.body.velocity.y = SPEED;
        enemy.body.drag.x = 100;
    }
    //  At what pace are the meteors coming in 
    game.time.events.add(game.rnd.integerInRange(SPACING, SPACING), flyingMeteors);


}

// Flying stars
function createStars() {
    for (var i = 0; i < 30; i++) {
        var star = stars.create(game.world.randomX, game.world.randomY, 'star');
        star.name = 'stars' + star;
        star.body.collideWorldBounds = true;
        star.body.bounce.setTo(0.8, 0.8);
        star.body.velocity.setTo(10 + Math.random() * 30, 10 + Math.random() * 30);
    }
}

function update() {
    // continious moving background
    spacefield.tilePosition.y += 1;

    // Setting speeds and keys movements
    speedship.body.velocity.setTo(0, 0);

    if (keys.left.isDown) {
        speedship.body.velocity.x = -200;
    }
    else if (keys.right.isDown) {
        speedship.body.velocity.x = 200;
    }

    if (keys.up.isDown) {
        speedship.body.velocity.y = -200;
    }
    else if (keys.down.isDown) {
        speedship.body.velocity.y = 200;
    }

    //  Bordeing the edges x axis
    if (speedship.x > game.width - 50) {
        speedship.x = game.width - 50;
        speedship.body.acceleration.x = 0;
    }
    if (speedship.x < 50) {
        speedship.x = 50;
        speedship.body.acceleration.x = 0;
    }

    //  y axis
    if (speedship.y > game.height - 50) {
        speedship.y = game.height - 50;
        speedship.body.acceleration.y = 0;
    }
    if (speedship.y < 50) {
        speedship.y = 50;
        speedship.body.acceleration.y = 0;
    }

    // space key for the bullet
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        fireBullet();
    }

    game.physics.arcade.overlap(speedship, meteor, Shipattacked, null, this);
    game.physics.arcade.overlap(stars, speedship, collectStar, null, this);
    game.physics.arcade.overlap(meteor, bullet, destroyMeteor, null, this);

}

// bullets being at whatspeed and location
function fireBullet() {

    if (game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(speedship.x - 8, speedship.y - 50);
            bullet.body.velocity.y = -300;
            bulletTime = game.time.now + 150;
        }
    }

}



function resetBullet(bullet) {

    bullet.kill();

}

// Collect the stars
function collectStar(speedship, star) {
    star.kill();
    score += 10;
    scoreText.text = scoreString + score;

    if (score == 300) {
        game.paused = true;
        stateText2.text = " You Won! I didn't think that would happen...like really ";
        stateText2.visible = true;
    }
}


// Meteors hits the Spaceship
function Shipattacked(speedship, bullet) {

    bullet.kill();

    live = lives.getFirstAlive();

    if (live) {
        live.kill();
    }

    // Make the explosion
    var explosion = explosions.getFirstExists(false);
    explosion.reset(speedship.body.x, speedship.body.y);
    explosion.play('kaboom', 30, false, true);
    let sound = this.sound.add('boom');
    sound.play();

    // Running out of lives
    if (lives.countLiving() < 1) {
        speedship.kill();
        meteor.callAll('kill');

        game.paused = true;

        stateText.text = "Game Over. You lose sucker!";
        stateText.visible = true;
    }

}


// Meteors hits the Spaceship
function destroyMeteor(meteor, bullet) {

    bullet.kill();
    meteor.kill();


    // Make the explosion
    var explosion = explosions.getFirstExists(false);
    explosion.reset(meteor.body.x, meteor.body.y);
    explosion.play('kaboom', 30, false, true);
    let sound = this.sound.add('boom');
    sound.play();

}




