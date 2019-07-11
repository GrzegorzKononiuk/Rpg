var BattleScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
	
	function BattleScene ()
    {
        Phaser.Scene.call(this, { key: "BattleScene" });
		
    },
	preload: function()
	{
		this.load.image('fireball1', 'assets/fireball1-removebg.png');
		this.load.image('fireball2', 'assets/fireball2-removebg.png');
		this.load.image('fireball3', 'assets/fireball3-removebg.png');
		this.load.image('fireball4', 'assets/fireball4-removebg.png');
		this.load.image('blood1', 'assets/blood1-removebg.png');
		this.load.image('blood2', 'assets/blood2-removebg.png');
		this.load.image('blood3', 'assets/blood3-removebg.png');
		this.load.image('blood4', 'assets/blood4-removebg.png');
		this.load.image('blood5', 'assets/blood5-removebg.png');
		this.load.image('blood6', 'assets/blood6-removebg.png');
		this.load.image('battle_background', 'assets/battle_background.png');
	},
	create: function ()
    {    
		battle_background = this.add.tileSprite(400, 300, 900, 600, 'battle_background');
       
		this.load.json('update', 'http://rpg/api/users/update/'+sesion,true);
		this.startBattle();
		
		this.sys.events.on('wake', this.startBattle, this);             
    },
	startBattle: function() 
	{
		//Get current player data from database
		var data = this.cache.json.get('levelData');
		var x = JSON.stringify(data);
		this.username = "";
		this.strength = "";
		this.health = "";
		this.exp = "";
		
		for (x in data) 
		{
			this.username +=  data[x].username;
			this.strength +=  data[x].strength;
			this.health   +=  data[x].health;
			this.exp   +=  data[x].exp;
		}
		
		// player character - warrior
		var warrior = new PlayerCharacter(this, 630, 280, "player", 1, this.username,this.health, this.strength,this.exp);        
        
		this.add.existing(warrior);
        
		// array with heroes
        this.heroes = [warrior];
		/////////////////////////////////////////////////////////////////////////////
	
		var x = Math.floor((Math.random() * 2) + 1);
		
		if( x == 1)
		{
			//Orange Dragon
			var monsterData = this.cache.json.get('monsterData');
			var x = JSON.stringify(monsterData);
			this.name = "";
			this.max_health = "";
			this.strength = "";
			this.defense = "";
			
			for (x in monsterData) 
			{
				this.name 		+=  monsterData[x].name;
				this.max_health +=  monsterData[x].max_health;
				this.strength   +=  monsterData[x].strength;
				this.defense 	+=  monsterData[x].defense;
			}
			
			// AI character - dragonOrange
			var dragonOrange = new Enemy(this, 150, 250, "dragonorrange", null,this.name, this.max_health, this.strength, this.defense);
			
			this.add.existing(dragonOrange);
			
			this.enemies = [dragonOrange];
		}
		
		
		//Blue Draagon
		if( x == 2)
		{
			var dragonData = this.cache.json.get('dragonData');
			var x = JSON.stringify(dragonData);
			this.name = "";
			this.max_health = "";
			this.strength = "";
			this.defense = "";
			
			for (x in dragonData) 
			{
				this.name 		+=  dragonData[x].name;
				this.max_health +=  dragonData[x].max_health;
				this.strength   +=  dragonData[x].strength;
				this.defense 	+=  dragonData[x].defense;
			}
			
			 var dragonBlue = new Enemy(this, 150, 250, "dragonblue", null,this.name, this.max_health,this.strength, this.defense);
			 
			 this.add.existing(dragonBlue);
			 this.enemies = [dragonBlue];
		 
		}
		
		
       
        this.units = this.heroes.concat(this.enemies);
        
		this.index = -1; // currently active unit
        
		this.scene.run("UIScene");
		 
    },
    nextTurn: function() 
	{  
        // if we have victory or game over
        if(this.checkEndBattle()) 
		{           
			
            this.endBattle();
            return;
		}
		
        do 
		{
            // currently active unit
            this.index++;
            // if there are no more units, we start again from the first one
            if(this.index >= this.units.length) 
			{
                this.index = 0;
            }            
        } while(!this.units[this.index].living);
        
		// if its player hero
        if(this.units[this.index] instanceof PlayerCharacter) 
		{
            // we need the player to select action and then enemy
            this.events.emit("PlayerSelect", this.index);
        } 
		else 
		{ 	// else if its enemy unit
            // pick random living hero to be attacked
            var r;
            do 
			{
                r = Math.floor(Math.random() * this.heroes.length);
            } 
			while(!this.heroes[r].living) 
            
			// call the enemy's attack function 
            this.units[this.index].attack(this.heroes[r]);  
            
			//NIECH KREW ZNIKA PO ANIMACJI
			this.anims.create
					({
						key: 'po',
						frames: 
						[
							{ key: 'blood1' },
							{ key: 'blood2' },
							{ key: 'blood3' },
							{ key: 'blood4' },
							{ key: 'blood5' },
							{ key: 'blood6', duration: 50  }
							
						],
						frameRate: 6,
						repeat: -2,
						hideOnComplete: true
					});

					this.add.sprite(630, 250, 'blood1').play('po')
			// add timer for the next turn, so will have smooth gameplay
            this.time.addEvent({ delay: 1000, callback: this.nextTurn, callbackScope: this });
        }
    },     
    
	// check for game over or victory
    checkEndBattle: function() 
	{        
        var victory = true;
        
		// if all enemies are dead we have victory
        for(var i = 0; i < this.enemies.length; i++) 
		{
            if(this.enemies[i].living)
			{
				 victory = false;
			}
		}
        
		var gameOver = true;
        
		// if all heroes are dead we have game over
        for(var i = 0; i < this.heroes.length; i++) 
		{
			
            if(this.heroes[i].living)
			{
				
				gameOver = false;
			}
                
        }
		
		if(victory)
		{
		
			var bars = this.add.graphics();
			bars.fillStyle(0x242121);
			bars.fillRect(610, 320, 50, 16);
			//console.log("Heal to wyslania = " + this.health);
			//console.log("EXP to wyslania = " + this.exp);
				
				this.exp *= 1.2;
				
				console.log("EXP to wyslania = " + this.exp);
				
				var data = {"exp": this.exp};
			
				var json = JSON.stringify(data);

				var xhr = new XMLHttpRequest();
				
				xhr.open("PUT", "http://rpg/api/users/update/"+sesion, true);
				xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
				xhr.send(json);
				
		}
		

        return victory || gameOver;
		
		
    },
    // when the player have selected the enemy to be attacked
    receivePlayerSelection: function(action, target) 
	{
        if(action == "attack") 
		{            
            this.units[this.index].attack(this.enemies[target]);
			
			//NIECH FIREBALL ZNIKA PO ANIMACJI
			this.anims.create
					({
						key: 'fireball',
						frames: 
						[
							{ key: 'fireball1' },
							{ key: 'fireball2' },
							{ key: 'fireball3' },
							{ key: 'fireball4', duration: 50  }
						],
						frameRate: 8,
						repeat: -2,
						hideOnComplete: true
					});

					this.add.sprite(170, 200, 'fireball1').play('fireball')
					 

					
        }
        // next turn in 3 seconds
        this.time.addEvent({ delay: 1500, callback: this.nextTurn, callbackScope: this });        
    },    
    endBattle: function() 
	{  
		// clear state, remove sprites
        
		this.heroes.length = 0;
        this.enemies.length = 0;
        for(var i = 0; i < this.units.length; i++) 
		{
            // link item
            this.units[i].destroy();            
        }
        this.units.length = 0;
        // sleep the UI
       
		this.scene.sleep('UIScene');
		
		setTimeout("location.reload(true);",150);
		
		setTimeout("this.scene.switch('WorldScene');",200);
	},
});

// base class for heroes
var Unit = new Phaser.Class
({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Unit(scene, x, y, texture, frame, username, health, strength, exp) 
	{
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
        
		// tu sie wczutyja wartosci z PHP (var data = this.cache.json.get('levelData');)
		this.username = username;
        console.log("Player = " + username);
		
		this.health = health;
        console.log("Health = " + health);
		
		this.strength = strength; // damage     
		console.log("Strength = " + strength);
		
		this.exp = exp; // damage     
		console.log("Exp = " + exp);
		
		this.visible = true;
		this.living = true;         
        this.menuItem = null;
		
		this.monsterBar = this.scene.add.graphics();
        
		//  BG
		this.monsterBar.fillStyle(0xffffff);
        this.monsterBar.fillRect(118, 320, 50, 16);
	},
    // we will use this to notify the menu item when the unit is dead
    setMenuItem: function(item) 
	{
        this.menuItem = item;
    },
    // attack the target unit
    attack: function(target) 
	{
        if(target.living) 
		{
		   target.takeDamage(Math.floor((Math.random() * this.strength) + 1));
           this.scene.events.emit("Message", this.username + " deal " + " " + Math.floor((Math.random() * this.strength) + 1) + " damage ");
		}
		
    },
	takeDamage: function(strength) 
	{
        this.health -= strength
		this.bar = this.scene.add.graphics();
        
		//  BG
		this.bar.fillStyle(0xDC143C);
        this.bar.fillRect(610, 320, 50, 16);

        //  Health
		this.bar.fillStyle(0xffffff);
        this.bar.fillRect(610, 320, this.health, 16);
		
		if(this.health <= 0) 
		{
            this.health = 0;
			this.menuItem.unitKilled();
			this.bar.fillStyle(0x242121);
			this.bar.fillRect(610, 320, 50, 16);
			
			
            this.living = false;
            this.visible = false;   
            this.menuItem = null;
		}
	}
});

//MONSTER CLASS
var MonsterUnit = new Phaser.Class
({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function MonsterUnit(scene, x, y, texture, frame, name, max_health, strength, defense) 
	{
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
        
		// tu sie wczutyja wartosci z PHP (var data = this.cache.json.get('levelData');)
		this.name = name;
        console.log('Enemy = ' + name);
		
		this.max_health = max_health;
        console.log('Health = ' + max_health);
		
		this.strength = strength;    
		console.log('Strength = ' + strength);
		
		this.defense = defense;    
		console.log('Defense = ' + defense);
		
		this.visible = true;
		this.living = true;         
        this.menuItem = null;
		
		this.bar = this.scene.add.graphics();
        
		//  BG
		this.bar.fillStyle(0xffffff);
        this.bar.fillRect(610, 320, 50, 16);
	},
    // we will use this to notify the menu item when the unit is dead
    setMenuItem: function(item) 
	{
        this.menuItem = item;
    },
    // attack the target unit
    attack: function(target) 
	{
        if(target.living) 
		{
           target.takeDamage(Math.floor((Math.random() * this.strength) + 1));
           this.scene.events.emit("Message", this.name + " deal" + target.name +" " + Math.floor((Math.random() * this.strength) + 1) + " damage ");
			
			this.scene.events.emit("AnimAttack");
			
		   console.log("zdrowie Monstera - " + this.max_health);
		   console.log("ENEMY DAMAGE - " + this.strength);
		}
    },
	takeDamage: function(strength) 
	{
		this.max_health -= strength
		this.monsterBar = this.scene.add.graphics();
        
		//  BG
		this.monsterBar.fillStyle(0xDC143C);
        this.monsterBar.fillRect(118, 320, 50, 16);
		
        //  Health
		this.monsterBar.fillStyle(0xffffff);
        this.monsterBar.fillRect(118, 320, this.max_health, 16);
		
		if(this.max_health <= 0) 
		{
			this.monsterBar.fillStyle(0x242121);
			this.monsterBar.fillRect(118, 320, 50, 16); //43 bo tyle hp ma dragon
          
			this.max_health = 0;
			this.menuItem.unitKilled();
			this.living = false;
            this.visible = false;   
            this.menuItem = null;
		}
	}    
});

var Enemy = new Phaser.Class
({
    Extends: MonsterUnit,

    initialize:
    function Enemy(scene, x, y, texture, frame, name, max_health, strength, defense) 
	{
        MonsterUnit.call(this, scene, x, y, texture, frame,  name, max_health, strength, defense);
		
		this.setScale(4);
    }
});

var PlayerCharacter = new Phaser.Class
({
    Extends: Unit,

    initialize:
    function PlayerCharacter(scene, x, y, texture, frame, username, health, strength, exp) 
	{
        Unit.call(this, scene, x, y, texture, frame, username, health, strength, exp);
        
		// flip the image so I don"t have to edit it manually
        this.flipX = true;
        
        this.setScale(4);
    }
});

var MenuItem = new Phaser.Class
({
    Extends: Phaser.GameObjects.Text,
    
    initialize:
            
    function MenuItem(x, y, text, scene) 
	{
        Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: "#ffffff", align: "center", fontSize: 25});
    },
    select: function() 
	{
        this.setColor("#f8ff38");
    },
    deselect: function() 
	{
        this.setColor("#ffffff");
    },
    // when the associated enemy or player unit is killed
    unitKilled: function() 
	{
        this.active = false;
        this.visible = false;
    }
});

// base menu class, container for menu items
var Menu = new Phaser.Class
({
    Extends: Phaser.GameObjects.Container,
    
    initialize:
            
    function Menu(x, y, scene, heroes) 
	{
        Phaser.GameObjects.Container.call(this, scene, x, y);
        this.menuItems = [];
        this.menuItemIndex = 0;
        this.x = x;
        this.y = y;        
        this.selected = false;
    },     
    addMenuItem: function(unit) 
	{
        var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
        this.menuItems.push(menuItem);
        this.add(menuItem); 
        return menuItem;
    },  
    
    select: function(index) 
	{
        if(!index)
            index = 0;       
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = index;
        while(!this.menuItems[this.menuItemIndex].active) 
		{
            this.menuItemIndex++;
            if(this.menuItemIndex >= this.menuItems.length)
                this.menuItemIndex = 0;
            if(this.menuItemIndex == index)
                return;
        }        
        this.menuItems[this.menuItemIndex].select();
        this.selected = true;
    },
    // deselect this menu
    deselect: function() 
	{        
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = 0;
        this.selected = false;
    },
    confirm: function() 
	{
        // when the player confirms his slection, do the action
    },
    // clear menu and remove all menu items
    clear: function() 
	{
        for(var i = 0; i < this.menuItems.length; i++) 
		{
            this.menuItems[i].destroy();
        }
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    },
    // recreate the menu items
    remap: function(units) 
	{
        this.clear();        
        for(var i = 0; i < units.length; i++) 
		{
            var unit = units[i];
            unit.setMenuItem(this.addMenuItem(unit.username));
			unit.setMenuItem(this.addMenuItem(unit.name));        
        }
        this.menuItemIndex = 0;
    }
});

var HeroesMenu = new Phaser.Class({
    Extends: Menu,
    
    initialize:
            
    function HeroesMenu(x, y, scene) 
	{
        Menu.call(this, x, y, scene); 
    }
});

var ActionsMenu = new Phaser.Class
({
    Extends: Menu,
    
    initialize:
            
    function ActionsMenu(x, y, scene) 
	{
        Menu.call(this, x, y, scene);   
        this.addMenuItem("Attack");
    },
    confirm: function() 
	{ 
        // we select an action and go to the next menu and choose from the enemies to apply the action
        this.scene.events.emit("SelectedAction");
    }
    
});

var EnemiesMenu = new Phaser.Class
({
    Extends: Menu,
    
    initialize:
            
    function EnemiesMenu(x, y, scene) 
	{
        Menu.call(this, x, y, scene);        
    },       
    confirm: function() 
	{      
        // the player has selected the enemy and we send its id with the event
        this.scene.events.emit("Enemy", this.menuItemIndex);
    }
});


// User Interface scene
var UIScene = new Phaser.Class
({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: "UIScene" });
    },

    create: function ()
    {    
        // draw some background for the menu
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(5, 0xffffff);
        
		//MONSTER MENU
		this.graphics.fillStyle(0x0, 1);
		this.graphics.fillRect(50, 380, 230, 150);        
        this.graphics.strokeRect(50, 380, 230, 150);
        
		//ATTACK MENU
		this.graphics.fillRect(288, 380, 230, 150);
        this.graphics.strokeRect(288, 380, 230, 150);
        
		//PLAYER MENU
		this.graphics.fillRect(526, 380, 230, 150);
        this.graphics.strokeRect(526, 380, 230, 150);
        
       
        // basic container to hold all menus
        
		this.menus = this.add.container();
                
        this.heroesMenu = new HeroesMenu(580, 400, this);           
        this.actionsMenu = new ActionsMenu(350, 400, this);            
        this.enemiesMenu = new EnemiesMenu(65, 380, this);   
       
		// the currently selected menu 
        this.currentMenu = this.actionsMenu;
        
        // add menus to the container
        this.menus.add(this.heroesMenu);
        this.menus.add(this.actionsMenu);
        this.menus.add(this.enemiesMenu);
         
        this.battleScene = this.scene.get("BattleScene");                                
       
		// listen for keyboard events
        this.input.keyboard.on("keydown", this.onKeyInput, this);   
        
        // when its player cunit turn to move
        this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);
        
        // when the action on the menu is selected
        // for now we have only one action so we dont send and action id
        this.events.on("SelectedAction", this.onSelectedAction, this);
        
        // an enemy is selected
        this.events.on("Enemy", this.onEnemy, this);
        
        // when the scene receives wake event
        this.sys.events.on('wake', this.createMenu, this);
        
        // the message describing the current action
        this.message = new Message(this, this.battleScene.events);
        this.add.existing(this.message);        
        
		this.createMenu();     
    },
    createMenu: function() 
	{
        // map hero menu items to heroes
        this.remapHeroes();
        // map enemies menu items to enemies
        this.remapEnemies();
        // first move
        this.battleScene.nextTurn(); 
    },
    onEnemy: function(index) 
	{
        // when the enemy is selected, we deselect all menus and send event with the enemy id
        this.heroesMenu.deselect();
        this.actionsMenu.deselect();
        this.enemiesMenu.deselect();
        this.currentMenu = null;
        this.battleScene.receivePlayerSelection("attack", index);   
    },
    onPlayerSelect: function(id) 
	{
        // when its player turn, we select the active hero item and the first action
        // then we make actions menu active
        this.heroesMenu.select(id);
        this.actionsMenu.select(0);
        this.currentMenu = this.actionsMenu;
    },
    // we have action selected and we make the enemies menu active
    // the player needs to choose an enemy to attack
    onSelectedAction: function() 
	{
        this.currentMenu = this.enemiesMenu;
        this.enemiesMenu.select(0);
    },
    remapHeroes: function() 
	{
        var heroes = this.battleScene.heroes;
        this.heroesMenu.remap(heroes);
    },
    remapEnemies: function() 
	{
        var enemies = this.battleScene.enemies;
        this.enemiesMenu.remap(enemies);
    },
    onKeyInput: function(event) 
	{
        if(this.currentMenu && this.currentMenu.selected) 
		{
            if(event.code === "Space") 
			{
                this.currentMenu.confirm();
			}
		}
	},
});

// the message class extends containter 
var Message = new Phaser.Class
({

    Extends: Phaser.GameObjects.Container,

    initialize:
    function Message(scene, events) 
	{
        
		Phaser.GameObjects.Container.call(this, scene, 380, 150);
        var graphics = this.scene.add.graphics();
        this.add(graphics);
        
		graphics.lineStyle(3, 0xffffff, 3.8);
        graphics.fillStyle(0x031f4c, 0.3);        
        graphics.strokeRect(-90, -15, 250, 50);
        graphics.fillRect(-90, -15, 250, 50);
		
		this.text = new Phaser.GameObjects.Text(scene, 30, 10, "", { color: "#ffffff", align: "center", fontSize: 15});
        
		this.add(this.text);
        this.text.setOrigin(0.5);        
        events.on("Message", this.showMessage, this);
        this.visible = false;
    },
    showMessage: function(text) 
	{
        this.text.setText(text);
        this.visible = true;
        
		if(this.hideEvent)
		{
			this.hideEvent.remove(false);
		}
            
        this.hideEvent = this.scene.time.addEvent({ delay: 1500, callback: this.hideMessage, callbackScope: this });
    },
    hideMessage: function() 
	{
        this.hideEvent = null;
        this.visible = false;
    }
});
