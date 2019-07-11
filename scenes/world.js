var BootScene = new Phaser.Class({
 
    Extends: Phaser.Scene,
 
    initialize:
 
    function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },
 
    preload: function ()
    {
		 
        // load the resources here
		this.load.tilemapTiledJSON('start_map', 'assets/start_map.json');
		this.load.image('tiles', 'assets/tileset1.png');
		this.load.image('house', 'assets/house.png');
		this.load.image('door', 'assets/door.png');
		this.load.spritesheet('chara', 'assets/chara.png', { frameWidth: 50, frameHeight: 75 });
		this.load.image("dragonorrange", "assets/dragonorrange.png");
        this.load.image("dragonblue", "assets/dragonblue.png");
        
		// user
        this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
		
		// enemies
		this.load.json('monsterData', 'http://rpg/api/monsters/333');
		this.load.json('dragonData', 'http://rpg/api/monsters/334');
	},
 
    create: function ()
    {
		this.scene.start('WorldScene');
	}
});

var WorldScene = new Phaser.Class({
 
    Extends: Phaser.Scene,
 
    initialize:
 
    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },
	
	preload: function ()
    {
		
        this.load.json('levelData', 'http://rpg/api/users/'+sesion,true);
    },
	
	create: function ()
    {	
		let map = this.make.tilemap({ key: 'start_map' });
	
		const house = map.addTilesetImage("house", "house");
		const terrain = map.addTilesetImage('tileset1', 'tiles');
		
		const layer = map.createStaticLayer(0, terrain, 0, 0);
		const belowLayer = map.createStaticLayer("house", house, 0, 0);
		
		//Spawns Points
		const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
		this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "chara");
		
		//Entrance House
		const houseEntrance = map.findObject("door", obj => obj.name === "door");
		this.entrance = this.physics.add.sprite(houseEntrance.x, houseEntrance.y, 'door');
		
		this.enemy = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        
		for(var i = 0; i < 10; i++) 
		{
			var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
			var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
			
			this.enemy.create(x, y, 20, 20);
        }
		
		this.physics.add.overlap(this.player, this.enemy, this.onMeetEnemy, false, this);
        
		
		//Colisions
		belowLayer.setCollisionByProperty({ collides: true });
		this.physics.add.collider(this.player, this.enemy);
		this.physics.add.collider(this.player, this.entrance);
		this.player.setCollideWorldBounds(true); // don't go out of the map
		
		//Cursors && Camera
		this.cursors = this.input.keyboard.createCursorKeys();
		
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;
		
		
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
		
		
		//House (enter zone)
	    this.entrance = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        
		var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        
		
        this.entrance = this.physics.add.sprite(houseEntrance.x, houseEntrance.y, "door");           
        this.physics.add.overlap(this.player, this.entrance, this.enter, false, this);
		
	},
	enter: function(player, enter)
	{
		
		enter.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
		enter.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);       
		
		this.scene.switch('House'); 
	},
	onMeetEnemy: function(player, zone) 
	{
		// we move the zone to some other location
		zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
		zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);       
		
		 // shake the world
        this.cameras.main.shake(300);	
		
		// start battle 
        this.scene.switch('BattleScene');   
		
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
	}
});

