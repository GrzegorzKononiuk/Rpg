var myCustomCanvas = document.createElement('canvas');

myCustomCanvas.id = 'myCustomCanvas';
myCustomCanvas.style = 'border: 8px solid #8F594E';

document.body.appendChild(myCustomCanvas);

var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 820,
    height: 550,
    canvas: document.getElementById('myCustomCanvas'),
	zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true // set to true to view zones
        }
    },
    scene: [
        BootScene,
        WorldScene,
        BattleScene,
        UIScene,
		House,
		BossCave
		
		
		
	
		
		]
};
var game = new Phaser.Game(config);
