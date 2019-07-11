var House = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function House ()
    {
        Phaser.Scene.call(this, { key: "House" });
    },
	preload: function ()
    {	
		this.load.tilemapTiledJSON('domek', 'assets/domek.json');
		this.load.spritesheet('chara', 'assets/chara.png', { frameWidth: 50, frameHeight: 75 });
		this.load.image('floor', 'assets/floor.png');
		this.load.image('furniture', 'assets/furniture.png');
		this.load.image('por1', 'assets/por1-removebg.png');
		this.load.image('por2', 'assets/por2-removebg.png');
		
		
	},
	create: function ()
    { 	
		let inside = this.make.tilemap({key:'domek'}); 
     
		floor = this.add.tileSprite(415, 300, 410, 600, 'floor');
		
		const furniture = inside.addTilesetImage("furniture", "furniture");
		
		const layerFur = inside.createStaticLayer(1,"furniture",320,150);
		
		//Portal Zone
		this.entrance = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        
		var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
		
		const portalEntrance = inside.findObject("portal", obj => obj.name === "portal");
		this.entrance = this.physics.add.sprite(410,180, 'portal');
		
		//Spawns Points
		const spawnPoint = inside.findObject('SpawnChara', obj => obj.name === "Spawn");
		this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "chara");
		
		this.player.setCollideWorldBounds(true);
		
		//Portal Enter
		this.physics.add.overlap(this.player, this.entrance, this.enterPortal, false, this);
		
		//Cursors && Camera
		this.cursors = this.input.keyboard.createCursorKeys();
		
		//  Animation with key 'left'
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('chara', { frames: [8, 9, 10, 11] }),
            frameRate: 10,
            repeat: -1
        });
        
        // Animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('chara', { frames: [12, 13, 14, 15] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('chara', { frames: [4, 5, 6, 7] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('chara', { frames: [ 0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
		
		
		this.anims.create
		({
			key: 'po',
			frames: 
			[
				{ key: 'por1' },
				{ key: 'por2', duration: 50  }
				
			],
			frameRate: 8,
			repeat: -1
		});

		this.add.sprite(422,190, 'por1').play('po');
	},
	enterPortal: function(player, enterPortal)
	{
		
		enterPortal.x = Phaser.Math.RND.between(00, this.physics.world.bounds.width);
		enterPortal.y = Phaser.Math.RND.between(00, this.physics.world.bounds.height);       
		
		this.scene.switch('BossCave'); 
	},
	update: function (time, delta)
	{
		this.player.body.setVelocity(0);

		// Horizontal movement
		if (this.cursors.left.isDown)
		{
			this.player.body.setVelocityX(-280);
		}
		else if (this.cursors.right.isDown)
		{
			this.player.body.setVelocityX(280);
		}

		// Vertical movement
		if (this.cursors.up.isDown)
		{
			this.player.body.setVelocityY(-280);
		}
		else if (this.cursors.down.isDown)
		{
			this.player.body.setVelocityY(280);
		}
		
		//Block Slant
		if(this.cursors.left.isDown && this.cursors.up.isDown)
		{
			this.player.body.velocity.x = 0;
			this.player.body.velocity.y = 0;
		}
		  
		if(this.cursors.right.isDown && this.cursors.up.isDown)
		{
		   this.player.body.velocity.x = 0;
		   this.player.body.velocity.y = 0;
		}
	  
		if(this.cursors.left.isDown && this.cursors.down.isDown)
		{
		   this.player.body.velocity.x = 0;
		   this.player.body.velocity.y = 0;
		}
	  
		if(this.cursors.right.isDown && this.cursors.down.isDown)
		{
		   this.player.body.velocity.x = 0;
		   this.player.body.velocity.y = 0;
		}
		
		//Play Animation
		if (this.cursors.left.isDown)
		{
			this.player.anims.play('left', true);
		}
		else if (this.cursors.right.isDown)
		{
			this.player.anims.play('right', true);
		}
		else if (this.cursors.up.isDown)
		{
			this.player.anims.play('up', true);
		}
		else if (this.cursors.down.isDown)
		{
			this.player.anims.play('down', true);
		}
		else
		{
			this.player.anims.stop();
		}		  
	},
	
});



