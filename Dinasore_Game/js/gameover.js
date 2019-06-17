var GameOver = function (game) { };

GameOver.prototype = {

    create: function () {


        this.quit = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.resume = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.showScore();
    },

    update: function () {


        if (this.resume.isDown) {
            this.restartGame();
        }
        if (this.quit.isDown) {
            // this.quitGame();
        }

    },

    showScore: function () {



        var scoreFont = "50px Aclonica";

        this.scoreLabel = this.game.add.text(this.game.world.centerX
            , this.game.world.centerY / 2, "0", { font: scoreFont, fill: "#fff" });
        this.scoreLabel.anchor.setTo(0.5, 0.5);
        this.scoreLabel.align = 'center';
        this.game.world.bringToTop(this.scoreLabel);
        this.scoreLabel.text = "Your score is " + (score);

        this.restart = this.game.add.text(this.game.world.centerX
            , this.game.world.centerY * 1.5
            , "Press \n Space bar to exit the game ", { font: scoreFont, fill: "#fff" });
        this.restart.anchor.setTo(0.5, 0.5);
        this.restart.align = 'center';
        this.game.world.bringToTop(this.restart);
        // this.scoreLabel.bringToTop()

    },

    restartGame: function () {

        window.open('assets/endpage.html');
    }

}