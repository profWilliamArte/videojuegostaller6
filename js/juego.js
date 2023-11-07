const config={
	width:1920,//ancho
	height:1080,//alto
	scale: { // para establecer responsive
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		parent:"container" // es el contenedor id creado en el html
	},
	backgroundColor:"#9b59b6",//color de fondo
	type:Phaser.AUTO,// permite detectar la mejor opción entre renderizado en Canvas o WebGL
	scene:{ //escenas
		preload:preload, // cargar estos recursos (imágenes, audio, spritesheets, etc.)
		create:create,// se utiliza para crear los elementos visuales del juego
		update:update,// se utiliza para actualizar el estado del juego
	},
	physics:{
		default:'arcade',//se utiliza para especificar el motor de física
		arcade:{
			gravity:{y:0},
			gravitx:{x:0},
			debug:false
			}
		}    
	}
let game = new Phaser.Game(config) // se instancia el objeto game
let w,h;
let player;
let velocidad=500;
let vidas=10;
let puntosParaGanar=30;
let burbujas;
let tamano;
let se1,se2,se3;
function preload(){
	// colisiones fondo burbujas ganaste persiste y sonidos
	this.physics.world.setBoundsCollision(false,false,true,true);
	this.load.image('fondo', 'assets/fondos/f6b.png');
	this.load.image('burbujas', 'assets/img/burbujas.png');
	// imagenes de ganaste y perdiste
	this.load.image('ganaste','assets/img/ganaste.png');
	this.load.image('gameover','assets/img/gameover01.png')
	// sonidos
	this.load.audio('captura','assets/sonidos/captura1.mp3')
	this.load.audio('pierde','assets/sonidos/pierdepuntos.mp3');
	this.load.audio('sonidoFondo','assets/sonidos/fondoagua1.mp3');
	this.load.audio('peligro','assets/sonidos/tiburon-banda-sonora.mp3');
	// player 
	this.load.image('player', 'assets/naves/p1.png');
	//enemigos  espaciales
	this.load.image('ene01','assets/enemigos/p1.png');
	this.load.image('ene02','assets/enemigos/p2.png');
	this.load.image('ene03','assets/enemigos/p3.png');
	this.load.image('ene04','assets/enemigos/p4.png');
	this.load.image('ene05','assets/enemigos/p5.png');
	this.load.image('ene06','assets/enemigos/p6.png');
	this.load.image('ene07','assets/enemigos/p7.png');
	this.load.image('ene08','assets/enemigos/p8.png');
	this.load.image('ene09','assets/enemigos/p9.png');
	this.load.image('ene10','assets/enemigos/p10.png');
	this.load.image('ene11','assets/enemigos/p11.png');
	this.load.image('ene12','assets/enemigos/p12.png');
	this.load.image('ene13','assets/enemigos/p13.png');
	this.load.image('ene14','assets/enemigos/p14.png');
	this.load.image('ene15','assets/enemigos/p15.png');
	this.load.image('ene16','assets/enemigos/p16.png');
	this.load.image('ene17','assets/enemigos/p17.png');
	this.load.image('ene18','assets/enemigos/p18.png');
	this.load.image('ene19','assets/enemigos/p19.png');
	this.load.image('ene20','assets/enemigos/p20.png');
	// super enemigos
	this.load.image('supe1','assets/enemigos/superenemigo1.png');
	this.load.image('supe2','assets/enemigos/superenemigo2.png');
	this.load.image('supe3','assets/enemigos/superenemigo3.png');
	



	
}
function create(){
// centrado fondo busbujas y sonidos
w=game.config.width/2;
h=game.config.height/2;
this.add.image(0,0,'fondo').setOrigin(0);
// burbujas
const emitter1 = this.add.particles('burbujas').createEmitter({
	x: 250,
	y: game.config.height,
	speed: { min: -100, max: 100 },
	angle: { min: 0, max: 360 },
	frequency: 100,
	lifespan: 5000,
	gravityY: -200,
	scale: { start: 1, end: 0 },
	alpha: { start: 1, end: 0 },
	blendMode: 'ADD'
  });
const emitter = this.add.particles('burbujas').createEmitter({
	x: w,
	y: game.config.height,
	speed: { min: -100, max: 100 },
	angle: { min: 0, max: 360 },
	frequency: 100,
	lifespan: 5000,
	gravityY: -200,
	scale: { start: 1, end: 0 },
	alpha: { start: 1, end: 0 },
	blendMode: 'ADD'
  });
  const emitter2 = this.add.particles('burbujas').createEmitter({
	x: game.config.width-200,
	y: game.config.height,
	speed: { min: -100, max: 100 },
	angle: { min: 0, max: 360 },
	frequency: 100,
	lifespan: 5000,
	gravityY: -200,
	scale: { start: 1, end: 0 },
	alpha: { start: 1, end: 0 },
	blendMode: 'ADD'
  });
  
  //sonidos
  captura      = this.sound.add('captura');
  pierde       = this.sound.add('pierde');
  peligro      = this.sound.add('peligro');

  sonidoFondo	=this.sound.add('sonidoFondo', {
	loop: true
	//volume: 1
  });
  sonidoFondo.play();


  //player
	player=this.physics.add.sprite(w,h,'player');// ubicacion del player
	player.setOrigin(0.5);//para que el player este centrado en horizontal
	player.setDepth(2);// numero de la capa
	player.setScale(0.9);// tamaño del player
	player.setCollideWorldBounds(true);// que tenga colisiones con el mundo
	player.setImmovable(true);// si le pego un enemimo no le afectas las fisicas
	player.puntos=0;// puntos inicioales
	player.vidas=vidas;// vidas iniciales
	cursors = this.input.keyboard.createCursorKeys(); // movimientos con las flechas
	//textos
	textoPuntos = this.add.text(100,20, "Puntos: "+player.puntos+" de "+puntosParaGanar,
	{ font: '24px sans serif Bold', fill: '#fff' }).setOrigin(0.5);

	let creador=this.add.text(w,20, "Realizado por Ar Sistema",
	{ font: '24px sans serif Bold', fill: '#fff' }).setOrigin(0.5);

	tamano=this.add.text(w,50, "Tamaño:"+player.width*player.scaleX,
	{ font: '24px sans serif Bold', fill: '#fff' }).setOrigin(0.5);

	textoVidas = this.add.text(game.config.width-60,20, "Vidas: "+player.vidas,
	{ font: '24px sans serif Bold', fill: '#fff' }).setOrigin(0.5);


	enemigos=['ene01','ene02','ene03','ene04','ene05','ene06','ene07','ene08','ene09','ene10','ene11','ene12','ene13','ene14','ene15','ene16','ene17','ene18','ene19','ene20'];
	this.time.addEvent({
		delay:1500,// cada 900 milesegungos
		loop:true,// que el loop sea infinito (false)
		callback:()=>{
			let ene	=enemigos[Phaser.Math.Between(0,19)]// selecciona un asteroide del arreglo
			let posY 	=Phaser.Math.Between(100,game.config.height-50); // crea la posicion en x que va de 
			let posX 	=Phaser.Math.Between(100,1500); // crea la posicion en x que va de 
			let Tam 	=Phaser.Math.FloatBetween(0.1,3)//para cambiar los tamaÃ±os
			let graX	=Phaser.Math.FloatBetween(10, 250)//afecta la gravedad en x
			let graY	=Phaser.Math.FloatBetween(10, 200)//afecta la gravedad en y
			enemigo   =this.physics.add.image(game.config.width+200,posY,ene).setScale(Tam) // crea el asteroide
			enemigo.setCollideWorldBounds(true); //permite que colisione
			enemigo.body.setGravity(-graX, 0); //le asigna la gravedad diferente a cada asteroide
			this.physics.add.collider(player, enemigo, capturaEnemigo, null, this)// enemigos contra el submarino
			
		}
	})

	//super enemigos
	supenemigos=['supe1','supe2','supe3'];
	this.time.addEvent({
        delay:35000,
        loop:true,
        callback:()=>{
           peligro.play();
			let sup		=supenemigos[Phaser.Math.Between(0,2)]// selecciona un asteroide del arreglo
            let posY 	= Phaser.Math.Between(200,800); 
			let graX	=Phaser.Math.FloatBetween(5, 30)//afecta la gravedad en y
			se1			=this.physics.add.image(game.config.width+200,posY,sup);
			se1.setCollideWorldBounds(true); //permite que colisione
			se1.body.setGravity(-graX, 0); //le asigna la gravedad diferente a cada asteroide
            this.physics.add.overlap(player, se1, pierdeJuego, null, this);

        } 
    })

	

}
function capturaEnemigo(player, enemigo){
	let tamaPlayer = (player.width*player.scaleX);
	let tamaEnemigo = (enemigo.width*enemigo.scaleX);
	if(tamaPlayer>tamaEnemigo){
		// gana player
		captura.play();
		enemigo.setTint(0xff0000);
		player.setScale((player.scaleX/0.95),(player.scaleY/0.95))
		player.puntos++;
		textoPuntos.setText("Puntos: "+player.puntos+" de "+puntosParaGanar)
	}else{
		//gana enemigo
		pierde.play()
		player.setTint(0xff0000);
		player.setScale((player.scaleX*0.95),(player.scaleY*0.95))
		player.vidas-=1;
        textoVidas.setText("Vidas: "+player.vidas)
		this.time.addEvent({
			delay:1800,
			loop:false,
			callback:()=>{
				player.setTint(0xffffff);
	
			} 
		})
	}
	if( player.puntos>=puntosParaGanar){
        this.add.image(game.config.width/2,game.config.height/2,'ganaste').setDepth(10).setVisible(true).setOrigin(0.5);
        this.add.text(game.config.width/2,game.config.height/2+150, "F5 para Reiniciar",
        { font: '30px Arial Bold', fill: '#FBFBAC' }).setOrigin(0.5);
        game.scene.pause("default") 
    }
	if(player.vidas<=0){
        this.add.image(game.config.width/2,game.config.height/2,'gameover').setDepth(10).setVisible(true).setOrigin(0.5);
        this.add.text(game.config.width/2,game.config.height/2+150, "F5 para Reiniciar",
        { font: '30px Arial Bold', fill: '#FBFBAC' }).setOrigin(0.5);
        game.scene.pause("default") 
    }
	enemigo.setVisible(false);
	enemigo.destroy();
	tamano.setText("Tamaño:"+Math.floor(player.width*player.scaleX))	
}
function pierdeJuego(player, enemigo){
	pierde.play()
	player.setTint(0xff0000);
	player.setScale((player.scaleX*0.95),(player.scaleY*0.95))
	player.vidas-=1;
    textoVidas.setText("Vidas: "+player.vidas)
    this.add.image(game.config.width/2,game.config.height/2,'gameover').setDepth(10).setVisible(true).setOrigin(0.5);
    this.add.text(game.config.width/2,game.config.height/2+150, "F5 para Reiniciar",
    { font: '30px Arial Bold', fill: '#FBFBAC' }).setOrigin(0.5);
    game.scene.pause("default") 
    
}
function update(){
	// Controla el movimiento del personaje

	if (cursors.left.isDown) {
		player.setVelocityX(-velocidad);
		player.setFlip(false);
	} else if (cursors.right.isDown) {
		player.setVelocityX(velocidad);
		player.setFlip(true);
	} else if (cursors.up.isDown) {
		player.setVelocityY(-velocidad);
	} else if (cursors.down.isDown) {
		player.setVelocityY(velocidad);
	} else {
		player.setVelocityX(0);
		player.setVelocityY(0);
	}
	if(player.x>game.config.width){
        player.x=10;
    }
    if(player.x<0){
        player.x=game.config.width;
    }
	
}

