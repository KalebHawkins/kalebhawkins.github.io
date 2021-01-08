// Create a new scene
let gameScene = new Phaser.Scene('Game')

gameScene.init = function(){
    this.playerSpeed = 3

    this.dragonSpeed = 2.5
    this.dragonMinSpeed = 2
    this.dragonMaxSpeed = 5

    this.topBoundry = 80
    this.bottomBoundry = this.sys.game.config.height - 80
}


// Load assets
gameScene.preload = function(){
    // Load images
    this.load.image('background', 'assets/background.png')
    this.load.image('player', 'assets/player.png')
    this.load.image('dragon', 'assets/dragon.png')
    this.load.image('treasure', 'assets/treasure.png')
}

// Called once after the preload ends
gameScene.create = function(){
    // Create a background sprite
    background = this.add.sprite(0, 0, 'background')
    // Change the origin to the top left corner
    background.setPosition(this.sys.game.config.width/2, this.sys.game.config.height/2)

    // Create the player
    this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player')
    // Reduce the height and with by 50%
    this.player.setScale(0.5)

    this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure')
    this.treasure.setScale(0.5)

    this.dragons = this.add.group({
        key: 'dragon',
        repeat: 4,
        setXY: {
            x: 100,
            y: 140,
            stepX: 100,
            stepY: 20
        }
    })

    Phaser.Actions.ScaleXY(this.dragons.getChildren(), -0.4, -0.4)
    Phaser.Actions.Call(this.dragons.getChildren(), function(dragon){
        dragon.flipX = true

        let direction = Math.random() < 0.5 ? 1 : -1
        let speed = this.dragonMinSpeed + Math.random() * (this.dragonMaxSpeed - this.dragonMinSpeed)
        dragon.speed = speed * direction
    }, this)

}

// Called up to 60 times per second
gameScene.update = function(){
     // Check for input
     if(this.input.activePointer.isDown){
         this.player.x += this.playerSpeed
     }

     let playerRect = this.player.getBounds()
     let treasureRect = this.treasure.getBounds()

     if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)){
        // Restart the scene
        this.scene.restart()
        return
     }

     let allDragons = this.dragons.getChildren()
     let numDragons = allDragons.length

     for(let i = 0; i < numDragons; i++) {
        let isMovingUp = allDragons[i].speed < 0 && allDragons[i].y <= this.topBoundry
         let isMovingDown = allDragons[i].speed > 0 && allDragons[i].y >= this.bottomBoundry
    
         if( isMovingUp || isMovingDown ){
            allDragons[i].speed *= -1
         }
    
         allDragons[i].y += allDragons[i].speed

         let dragonRect = allDragons[i].getBounds()
         if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, dragonRect)){
             this.scene.restart()
             return
         }
     }
}

// Set the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use GL if available otherwise it will use canvas
    width:  640,
    height: 360,
    scene: gameScene
}

// Creat a new game, pass the configuration
let game = new Phaser.Game(config)

