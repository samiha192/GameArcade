var Main = function (game) {

};

var score = 0;
Main.prototype = {

    create: function () {

        this.brickVelocity = -500;
        this.rate = 1500;
        score = 0;

        this.brickWidth = this.game.cache.getImage('tile').width;
        this.brickHeight = this.game.cache.getImage('tile').height;
        this.cubeHeight = this.game.cache.getImage('box').height;

        this.game.stage.backgroundColor = '99ff33';


        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.sound.add('playerStep');

        this.floor = this.game.add.group();
        this.floor.enableBody = true;
        this.floor.createMultiple(Math.ceil(this.game.world.width / this.brickWidth), 'tile');

        this.boxes = this.game.add.group();
        this.boxes.enableBody = true;
        this.boxes.createMultiple(20, 'box');
        this.game.world.bringToTop(this.floor)

        this.jump = false;

        this.addSurface();
        this.printScore();
        this.MakeActor();

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.timer = game.time.events.loop(this.rate, this.addHurdle, this);
        this.Scoretimer = game.time.events.loop(100, this.increaseScore, this);

    },

    update: function () {

        this.game.physics.arcade.collide(this.player, this.floor);
        this.game.physics.arcade.collide(this.player, this.boxes, this.gameOver, null, this);

        var onTheGround = this.player.body.touching.down;

        // No of jumps
        if (onTheGround) {
            this.numberOfJumps = 2;
            this.jump = false;
        }


        if (this.numberOfJumps > 0 && this.IsUpKeyInUse(5)) {
            this.player.body.velocity.y = -1000;
            this.jump = true;
            this.sound.play('playerStep');
        }


        if (this.jump && this.IsUpKeyReleased()) {
            this.numberOfJumps--;
            this.jump = false;
        }



    },

    addSurface: function () {
        var bricksRequired = Math.ceil(this.game.world.width / this.brickWidth);
        var y = (this.game.world.height - this.brickHeight);

        for (var i = 0; i < bricksRequired; i++) {

            this.addBlock(i * this.brickWidth, y);

        }
    },

    addBlock: function (x, y) {

        var tile = this.floor.getFirstDead();

        tile.reset(x, y);

        tile.body.immovable = true;
        tile.checkWorldBounds = true;
        tile.outOfBoundsKill = true;

    },

    addBrick: function (x, y) {

        var tile = this.boxes.getFirstDead();

        tile.reset(x, y);
        tile.body.velocity.x = this.brickVelocity;
        tile.body.immovable = true;
        tile.checkWorldBounds = true;
        tile.outOfBoundsKill = true;

    },

    MakeActor: function () {

        this.player = this.game.add.sprite(this.game.world.width / 5, this.game.world.height -
            (this.brickHeight * 2), 'player');
        this.player.scale.setTo(4, 4);
        this.player.anchor.setTo(0.5, 1.0);
        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 2200;
        this.player.body.collideWorldBounds = true;
        this.player.body.bounce.y = 0.1;
        this.player.body.drag.x = 150;
        var walk = this.player.animations.add('walk');
        this.player.animations.play('walk', 20, true);

    },

    addHurdle: function () {
        var bricksRequired = Math.floor(Math.random() * (5 - 0));

        if (this.rate > 200) {
            this.rate -= 10;
            this.brickVelocity = -(675000 / this.rate);

        }

        for (var i = 0; i < bricksRequired; i++) {

            this.addBrick(this.game.world.width, this.game.world.height -
                this.brickHeight - ((i + 1) * this.cubeHeight));

        }
    },

    IsUpKeyInUse: function (duration) {
        var inUse = false;

        inUse = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
        inUse |= (this.game.input.activePointer.justPressed(duration + 1000 / 60) &&
            this.game.input.activePointer.x > this.game.width / 4 &&
            this.game.input.activePointer.x < this.game.width / 2 + this.game.width / 4);

        return inUse;
    },


    IsUpKeyReleased: function () {
        var isReleased = false;

        isReleased = this.input.keyboard.upDuration(Phaser.Keyboard.UP);
        isReleased |= this.game.input.activePointer.justReleased();

        return isReleased;
    },

    printScore: function () {

        var scoreFont = "50px Aclonica";

        this.scoreLabel = this.game.add.text(this.game.world.centerX, 70, "0", { font: scoreFont, fill: "#fff" });
        this.scoreLabel.anchor.setTo(0.5, 0.5);
        this.scoreLabel.align = 'center';
        this.game.world.bringToTop(this.scoreLabel);

    },

    increaseScore: function () {

        score += 1;


        this.scoreLabel.setText("\n\n Current score :" + score);

        this.game.world.bringToTop(this.scoreLabel);


    },

    gameOver: function () {
        this.game.state.start('GameOver');
    }



};