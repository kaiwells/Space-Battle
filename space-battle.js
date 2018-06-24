var canvas = document.getElementById("myCanvas");
canvas.width = 800;
canvas.height = 600;
var c = canvas.getContext("2d");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;	
var POSITIVE_X = 1;
var POSITIVE_Y = 2;
var NEGATIVE_X = 3;
var NEGATIVE_Y = 4;
var player1x = 395;
var player1y = 295;	
var keys = [];
var timeRemaining = 30;
var theCoins = [];
var theBadGuys = [];
var spawnX, spawnY; 
var gameOver = false;
var endMessage = "";
var mouseX;
var mouseY;
var deltaX = 0;
var deltaY = 0;
var rotation = 0;
var xtarget = 0;
var ytarget = 0;
var theBullets = [];
var player1Image;
var player2Image;
var backgroundImage1;
var backgroundImage2;
var backgroundImage3;
var backgroundImage4;
var shipTypes = [
	{bullet: 0, maxSpeed: 10, rotateSpeed: 2, health: 200, rateOfFire: 0.5},
	{bullet: 1, maxSpeed: 5, rotateSpeed: 1, health: 300, rateOfFire: 1},
	{bullet: 2, maxSpeed: 2, rotateSpeed: 0.5, health: 400, rateOfFire: 2}
];
var bulletTypes = [
	{speed: 10, damage: 10, scale: 1, range: 60},
	{speed: 5, damage: 20, scale: 2, range: 90},
	{speed: 2, damage: 40, scale: 4, range: 1600}
];
var camera = {
	x: 0, 
	y: 0, 
	w: 800, 
	h: 600
};

var mapSize = {
	h: 1200,
	w: 1600,
}

function init() {
	c.fillStyle="red";
	c.strokeStyle="blue";
	c.rect(10,10,10,100);
	c.lineWidth=4;
	c.stroke();
	c.fill();
}

init();

function loadImages() {
	player1Image = new Image();
	player2Image = new Image();
	backgroundImage1 = new Image();
	backgroundImage2 = new Image();
	backgroundImage3 = new Image();
	backgroundImage4 = new Image();
	player1Image.src = 'img/player.png';
	player2Image.src = 'img/player2.png';
	backgroundImage1.src = 'img/backgroundstarssmalltest.jpg';
	backgroundImage2.src = 'img/backgroundstarssmalltest.jpg';
	backgroundImage3.src = 'img/backgroundstarssmalltest.jpg';
	backgroundImage4.src = 'img/backgroundstarssmalltest.jpg';

	/*badGuyImage = new Image();
	badGuyImage.src = 'badguy.png';

	balls = new Image();
	balls.src = 'balls.png';*/
}
loadImages();

function mainDraw() {
	c.clearRect(0, 0, WIDTH, HEIGHT);
	if (!gameOver){
		updateCamera();
		drawMap();
		playerMove();	
		updateCamera();
		playerDraw();
		drawCoins();
		drawHUD();
		checkCollision();
		//timeRemaining -= 0.02;
		bulletsMove();
		bulletsDraw();
		checkBulletHits();
		if (timeRemaining < 0) {
			gameOver = true;
			endMessage = " You Survived!";
		}
		badGuysMove();
		badGuysDraw();
		if (Math.random() * 100 < 1 ) {
			//pushBadGuy();
		}
		if (Player1.cooldownTime > 0) {
			Player1.cooldownTime -= 0.02;
		}
		if (Player2.cooldownTime > 0) {
			Player2.cooldownTime -= 0.02;
		}
		updateCamera();
		//c.beginPath();
		//c.strokeStyle= 'blue'; 
		//c.lineWidth=1;
		//c.rect(camera.x, camera.y, camera.w, camera.h);
		//c.stroke();
	}
	if (gameOver) {
		endStats();	
	}
} // mainDraw

/*function playerDraw() {
	c.fillStyle="red";
	c.strokeStyle="blue";
	c.beginPath();
	c.rect(Player1.x, Player1.y, Player1.w, Player1.h);
	c.lineWidth=1;
	c.stroke();
	c.fill();
}*/

function updateCamera() {
	var deltaX;
	var deltaY;
	
	/*if(Player1.wrapped === POSITIVE_X) {
		deltaX = Player1.x + mapSize.w - Player2.x;
		deltaY = Player1.y - Player2.y;
	} else {
		deltaX = Player1.x - Player2.x;
		deltaY = Player1.y - Player2.y;
	}*/
	
	deltaX = Player1.x - Player2.x;
	deltaY = Player1.y - Player2.y;
	
	/*if ( Player1.x > (camera.w / 2) && Player1.x < mapSize.w - (camera.w / 2) ) {
		camera.x = Player1.x - (camera.w / 2);
	} else if ( Player1.x <= camera.w / 2) {
		camera.x = 0;
	} else if ( Player1.x >= mapSize.w - (camera.w / 2)) {
		camera.x = mapSize.w - camera.w;
	}
	if ( Player1.y > (camera.h / 2) && Player1.y < mapSize.h - (camera.h / 2) ) {
		camera.y = Player1.y - (camera.h / 2);
	} else if ( Player1.y <= camera.h / 2) {
		camera.y = 0;
	} else if ( Player1.y >= mapSize.h - (camera.h / 2)) {
		camera.y = mapSize.h - camera.h;
	}*/
	
	//camera.x = Player1.x - (camera.w / 2);
	//camera.y = Player1.y - (camera.h / 2);
	
	if(deltaX > camera.w) {
		Player1.x -= mapSize.w;
		bulletsTeleport(Player1, NEGATIVE_X);
	} else if(deltaX < -camera.w) {
		Player1.x += mapSize.w;
		bulletsTeleport(Player1, POSITIVE_X);
	}
	if(deltaY > camera.h) {
		Player1.y -= mapSize.h;
		bulletsTeleport(Player1, NEGATIVE_Y);
	} else if(deltaY < -camera.h) {
		Player1.y += mapSize.h;
		bulletsTeleport(Player1, POSITIVE_Y);
	}
	
	camera.x = Player1.x - (deltaX / 2) - (camera.w / 2);
	camera.y = Player1.y - (deltaY / 2) - (camera.h / 2);
}

function drawMap() {
	c.drawImage(backgroundImage1, 0 - camera.x, 0 - camera.y);
	if (camera.x <= 0) {
		c.drawImage(backgroundImage2, 0 - camera.x - mapSize.w, 0 - camera.y);
	} else if (camera.x >= mapSize.w - camera.w) {
		c.drawImage(backgroundImage2, 0 - camera.x + mapSize.w, 0 - camera.y);
	}
	if (camera.y <= 0) {
		c.drawImage(backgroundImage2, 0 - camera.x, 0 - camera.y - mapSize.h);
	} else if (camera.y >= mapSize.h - camera.h) {
		c.drawImage(backgroundImage2, 0 - camera.x, 0 - camera.y + mapSize.h);
	}
	if (camera.x <= 0 && camera.y <= 0) {
		c.drawImage(backgroundImage2, 0 - camera.x - mapSize.w, 0 - camera.y - mapSize.h);
	} else if (camera.x <= 0 && camera.y >= mapSize.h - camera.h) {
		c.drawImage(backgroundImage2, 0 - camera.x - mapSize.w, 0 - camera.y + mapSize.h);
	} else if (camera.x >= mapSize.w - camera.w && camera.y <= 0) {
		c.drawImage(backgroundImage2, 0 - camera.x + mapSize.w, 0 - camera.y - mapSize.h);
	} else if (camera.x >= mapSize.w - camera.w && camera.y >= mapSize.h - camera.h) {
		c.drawImage(backgroundImage2, 0 - camera.x + mapSize.w, 0 - camera.y + mapSize.h);
	}
} 

function playerDraw() {
	c.beginPath();

	c.strokeStyle="blue";
	if (Player1.dead != true) {
		c.rect(Player1.x - camera.x, Player1.y - camera.y, Player1.w, Player1.h);
	}
	if (Player2.dead != true) {
		c.rect(Player2.x - camera.x, Player2.y - camera.y, Player2.w, Player2.h);
	}
	c.lineWidth=1;
	c.stroke();

	c.save();
	deltaX = mouseX - Player1.x;
	deltaY = mouseY - Player1.y;
	newAngle = Math.atan(deltaY / deltaX);

	
	
	if (Player1.dead != true) {
		c.translate(Player1.x + (Player1.w / 2) - camera.x, Player1.y + (Player1.h / 2) - camera.y);
		c.rotate(Player1.rotation);
		c.translate(-Player1.x - (Player1.w / 2) + camera.x, -Player1.y - (Player1.h / 2) + camera.y);
		c.drawImage(Player1.image, Player1.x - 4 - camera.x, Player1.y - 2 - camera.y,Player1.w * 1.3, Player1.h * 1.3);
		
		c.restore();
		c.save();
	}
	if (Player2.dead != true) {
		c.translate(Player2.x + (Player2.w / 2) - camera.x, Player2.y + (Player2.h / 2) - camera.y);
		c.rotate(Player2.rotation);
		c.translate(-Player2.x - (Player2.w / 2) + camera.x,-Player2.y - (Player2.h / 2) + camera.y);
		c.drawImage(Player2.image, Player2.x - 4 - camera.x, Player2.y - 2 - camera.y,Player2.w * 1.3, Player2.h * 1.3);
	}
	

	c.restore();
}	

//createNewCoins();
setInterval(mainDraw, 20);

function drawHUD() {
	c.font = '18pt Calibri';
	c.fillStyle = 'black';
	c.fillText("Health:", 10, 25);
	if (Player1.dead != true) {
		c.beginPath();
		if (Player1.health < 50) {
			c.strokeStyle= 'red';
		} else {
			c.strokeStyle= 'yellow'; 
		}
		c.moveTo(85,18);
		c.lineTo(85 + Player1.health, 18);
		c.lineWidth=15;
		c.stroke();
	}
	if (Player2.dead != true) {
		c.beginPath();
		if (Player2.health < 50) {
			c.strokeStyle= 'red';
		} else {
			c.strokeStyle= 'yellow'; 
		}
		c.moveTo(85,40);
		c.lineTo(85 + Player2.health, 40);
		c.lineWidth=15;
		c.stroke();
	}
	c.fillStyle = 'black';
	c.fillText("Points:", 370, 25);
	c.fillText("Time remaining:", 585, 25);
	if (timeRemaining < 10) {
		c.fillStyle = "red"
	}
	c.fillText(Math.ceil(timeRemaining), 750, 25);
	c.fillStyle = 'yellow';
	c.fillText(Player1.points, 445, 25);
}	

function drawCoins() {
	theCoins.forEach( function(i, j) {
		c.beginPath();
		c.fillStyle=i.color;
		c.strokeStyle=i.color;
		c.rect(i.x, i.y, i.w, i.h);
		c.lineWidth=1;
		c.stroke();
		c.fill();
	});
}

function badGuysDraw(){
	theBadGuys.forEach( function(i, j) {
		c.beginPath();
		c.fillStyle="blue";
		c.strokeStyle="red";
		c.rect(i.x, i.y, i.w, i.h);
		c.lineWidth=1;
		c.stroke();
		c.fill();
	});
}

function bulletsDraw() {
	theBullets.forEach( function(i, j) {
		c.beginPath();
		c.save();
		c.fillStyle = i.color;
		c.rect(i.x-camera.x, i.y-camera.y, i.w, i.h);
		c.fill();
	});
}

function Player (i) {
	this.w = 20;
	this.h = 20;
	this.points = 0;
	if(i === 1) {
		this.image = player1Image;
		this.x = 500;
		this.y = 295;
		this.drawX = 500;
		this.drawY = 295;
		this.ship = 2;
	} else if(i === 2) {
		this.image = player2Image;
		this.x = 100;
		this.y = 295;
		this.drawX = 100;
		this.drawY = 295;
		this.ship = 0;
	}
	this.rotation = 0;
	this.speed = 0;
	this.dead = false;
	//this.ship = Math.floor(Math.random() * 3);
	this.bullet = shipTypes[this.ship].bullet;
	this.maxSpeed = shipTypes[this.ship].maxSpeed;
	this.rotateSpeed = shipTypes[this.ship].rotateSpeed;
	this.rateOfFire = shipTypes[this.ship].rateOfFire;
	this.health = shipTypes[this.ship].health;
	this.cooldownTime = 0;
	this.wrapped = 0;
}
var Player1 = new Player(1);
var Player2 = new Player(2);

function playerMove(e){
	//p1
	if (keys[87]) { //w
		if (Player1.speed < Player1.maxSpeed) {
			Player1.speed += 0.2;
		}
	} else if (Player1.speed > 0) {
		Player1.speed -= 0.2;
		if(Player1.speed < 0) {
			Player1.speed = 0;
		}
	}
	if (keys[83] ) { //s
		if (Player1.y < mapSize.h - Player1.h - 2) {
		}
	}
	if (keys[65] ) { //a
		Player1.rotation -= Player1.rotateSpeed * 0.05;
	}
	if (keys[68] ) { //d
		Player1.rotation += Player1.rotateSpeed * 0.05;
	}
	
	/*if (Player1.y < 2) {
		Player1.y = mapSize.h - Player1.h - 2;
	} else if (Player1.y > mapSize.h - Player1.h - 2) {
		Player1.y = 2;
	}
	if (Player1.x < 2) {
		Player1.x = mapSize.w - Player1.w - 2;
	} else if (Player1.x > mapSize.w - Player1.w - 2) {
		Player1.x = 2;
	}*/
	Player1.x += Math.cos(Player1.rotation) * Player1.speed;
	Player1.y += Math.sin(Player1.rotation) * Player1.speed;
	Player1.drawX += Math.cos(Player1.rotation) * Player1.speed;
	Player1.drawY += Math.sin(Player1.rotation) * Player1.speed;
	
	/*
	if (Player1.y < 0) {
		Player1.y += mapSize.h;
	} else if (Player1.y > mapSize.h) {
		Player1.y -= mapSize.h;
	}
	if (Player1.x < 0) {
		Player1.x += mapSize.w;
		if(Player1.drawX != Player1.x) {
			Player1.drawX = Player1.x;
		}
	} else if (Player1.x > mapSize.w) {
		Player1.x -= mapSize.w;
		if(Player2.drawX != Player2.x) {
			Player2.drawX = Player2.x;
			Player1.drawX = Player1.x;
			
		}
	}*/
	
	
	//p2
	if (keys[38]) { //up
		if (Player2.speed < Player2.maxSpeed) {
			Player2.speed += 0.2;
		}
	} else if (Player2.speed > 0) {
		Player2.speed -= 0.2;
		if(Player2.speed < 0) {
			Player2.speed = 0;
		}
	}
	if (keys[40] ) { //down
		if (Player2.y < HEIGHT - Player2.h - 2) {
		}
	}
	if (keys[37] ) { //left
		Player2.rotation -= Player2.rotateSpeed * 0.05;
	}
	if (keys[39] ) { //right
		Player2.rotation += Player2.rotateSpeed * 0.05;
	}
	/*if (Player2.y < 2) {
		Player2.y = 2;
	}
	if (Player2.y > HEIGHT - Player2.h - 2) {
		Player2.y = HEIGHT - Player2.h - 2;
	}
	if (Player2.x < 2) {
		Player2.x = 2;
	}
	if (Player2.x > WIDTH - Player2.w - 2) {
		Player2.x = WIDTH - Player2.w - 2;
	}*/
	Player2.x += Math.cos(Player2.rotation) * Player2.speed;
	Player2.y += Math.sin(Player2.rotation) * Player2.speed;
	Player2.drawX += Math.cos(Player2.rotation) * Player2.speed;
	Player2.drawY += Math.sin(Player2.rotation) * Player2.speed;
	
	/*
	if (Player2.y < 0) {
		Player2.y += mapSize.h;
	} else if (Player2.y > mapSize.h) {
		Player2.y -= mapSize.h;
	}
	if (Player2.x < 0) {
		Player2.x += mapSize.w;
		if(Player2.drawX != Player2.x) {
			Player2.drawX = Player2.x;
		}
	} else if (Player2.x > mapSize.w) {
		Player2.x -= mapSize.w;
		if(Player1.drawX != Player1.x) {
			Player1.drawX = Player1.x;
			Player2.drawX = Player2.x;
			
		}
	}*/
	if (Player1.x > mapSize.w && Player2.x > mapSize.w) {
		Player1.x -= mapSize.w;
		bulletsTeleport(Player1, NEGATIVE_X);
		Player2.x -= mapSize.w;
		bulletsTeleport(Player2, NEGATIVE_X);
	} else if (Player1.x < 0 && Player2.x < 0) {
		Player1.x += mapSize.w;
		bulletsTeleport(Player1, POSITIVE_X);
		Player2.x += mapSize.w;
		bulletsTeleport(Player2, POSITIVE_X);
	}
	if (Player1.y > mapSize.h && Player2.y > mapSize.h) {
		Player1.y -= mapSize.h;
		bulletsTeleport(Player1, NEGATIVE_Y);
		Player2.y -= mapSize.h;
		bulletsTeleport(Player2, NEGATIVE_Y);
	} else if (Player1.y < 0 && Player2.y < 0) {
		Player1.y += mapSize.h;
		bulletsTeleport(Player1, POSITIVE_Y);
		Player2.y += mapSize.h;
		bulletsTeleport(Player2, POSITIVE_Y);
	}
	
	return false;
}

function createNewCoins() {
	theCoins.push({
		x: Math.floor(Math.random() * 800),
		y: Math.floor(Math.random() * 600),
		w: 10,
		h: 10, 
		points: 10, 
		color: 'yellow'
		}
	);

	theCoins.push(
		{
		x: Math.floor(Math.random() * 800),
		y: Math.floor(Math.random() * 600),
		w: 25,
		h: 25, 
		points: 5, 
		color: 'grey'
		}
	);

	theCoins.push(
		{
		x: Math.floor(Math.random() * 800),
		y: Math.floor(Math.random() * 600),
		w: 50,
		h: 50, 
		points: 2, 
		color: 'brown'
		}
	);
	
	theCoins.push(
		{
		x: Math.floor(Math.random() * 800),
		y: Math.floor(Math.random() * 600),
		w: 10,
		h: 10, 
		points: 0, 
		color: 'red'
		}
	);
} // createNewCoins	

/*
function collides(a, b) {
	return	a.x < b.x + b.w &&
	a.x + a.w > b.x &&
	a.y < b.y + b.h &&
	a.y + a.h > b.y;
}
*/
function collides(a, b) {
	return	a.x - camera.x < b.x - camera.x + b.w &&
	a.x - camera.x + a.w > b.x - camera.x &&
	a.y - camera.y < b.y - camera.y + b.h &&
	a.y - camera.y + a.h > b.y - camera.y;
}

function checkCollision() {
	theCoins.forEach( function(i, j){
		if ( collides(i, Player1) ) {
			if(i.points != 0) {
				Player1.points += i.points;
			} else {
				Player1.health += 20;
			}
			theCoins.splice(0);
			createNewCoins();
		}
		if ( collides(i, Player2) ) {
			if(i.points != 0) {
				Player2.points += i.points;
			} else {
				Player2.health += 20;
			}
			theCoins.splice(0);
			createNewCoins();
		}
	});
}

function endStats() {
	c.font = '80pt Calibri';
	c.fillStyle = 'black';
	c.fillText(endMessage, 70, 140);
	c.font = '80pt Calibri';
	c.fillStyle = 'black';
	c.fillText("Your Score:", 70, 240);
	c.fillStyle = 'yellow';
	c.fillText(Player1.points, 580, 240);
	c.font = '30pt Calibri';
	c.fillStyle = 'black';
	c.fillText("Press enter to play again!", 180, 400);
	if ( keys[13] ) {
		Player1.points = 0;
		theCoins.splice(0);
		createNewCoins();
		timeRemaining = 30;
		theBadGuys.splice(0);
		Player1.x = 500;
		Player1.y = 295;
		Player1.health = 200;
		Player1.dead = false;
		Player2.x = 100;
		Player2.y = 295;
		Player2.health = 200;
		Player2.dead = false;
		gameOver = false;
	}
}

function pushBadGuy() {
	var playerTarget;
	
	if (Math.random() < 0.5) {
		spawnX = Math.random() < 0.5 ? -11 : 801;
		spawnY = Math.random() * 600;
	} else {
		spawnX = Math.random() * 800;
		spawnY = Math.random() < 0.5 ? -11 : 601;
	}
	if (Math.floor(Math.random() * 2) === 0) {
		playerTarget = 0;
	} else {
		playerTarget = 1;
	}
	theBadGuys.push( { 
		x: spawnX, y: spawnY, w: 10, h: 10, speed: Math.ceil(Math.random()* 1), target: playerTarget
	});
}

function badGuysMove() {
	theBadGuys.forEach( function(i, j) {
		if (i.target === 0) {
			if (i.x > Player1.x && !badGuyCollidesX(i, j, -i.speed)) {i.x -= i.speed;}
			if (i.x < Player1.x && !badGuyCollidesX(i, j, i.speed)) {i.x += i.speed;}
			if (i.y > Player1.y && !badGuyCollidesY(i, j, -i.speed)) {i.y -= i.speed;}
			if (i.y < Player1.y && !badGuyCollidesY(i, j, i.speed)) {i.y += i.speed;}
			if (Player1.dead === true) {
				i.target = 1;
			}
		} else {
			if (i.x > Player2.x && !badGuyCollidesX(i, j, -i.speed)) {i.x -= i.speed;}
			if (i.x < Player2.x && !badGuyCollidesX(i, j, i.speed)) {i.x += i.speed;}
			if (i.y > Player2.y && !badGuyCollidesY(i, j, -i.speed)) {i.y -= i.speed;}
			if (i.y < Player2.y && !badGuyCollidesY(i, j, i.speed)) {i.y += i.speed;}
			if (Player2.dead === true) {
				i.target = 0;
			}
		}
		if (i.hit === true){ theBadGuys.splice(j, 1); }
	});
}

function badGuyCollidesX (i, j, step) {
	for (k = theBadGuys.length - 1; k >= 0; k--){
		if (j != k && 
			i.x + step < theBadGuys[k].x + theBadGuys[k].w && 
			i.x + step + i.w > theBadGuys[k].x && 
			i.y < theBadGuys[k].y + theBadGuys[k].h && 
			i.y + i.h > theBadGuys[k].y) {
				return true;
		}
	}
	if (i.x + step < Player1.x + Player1.w && 
		i.x + step + i.w > Player1.x && 
		i.y < Player1.y + Player1.h && 
		i.y + i.h > Player1.y) {
			if (i.x + step < Player1.x + Player1.w && 
				i.x + step + i.w > Player1.x && 
				i.y < Player1.y + Player1.h && 
				i.y + i.h > Player1.y && 
				!i.hit) {
					Player1.health -= 40;
					if (Player1.health <= 0) {
						Player1.dead = true;
					}
					if (Player1.health <= 0 && Player2.health <= 0){ 
						gameOver = true;
						endMessage = " Game Over!";
					}
					i.hit = true;
					return true;
			}
	}
	if (i.x + step < Player2.x + Player2.w && 
		i.x + step + i.w > Player2.x && 
		i.y < Player2.y + Player2.h && 
		i.y + i.h > Player2.y) {
			if (i.x + step < Player2.x + Player2.w && 
				i.x + step + i.w > Player2.x && 
				i.y < Player2.y + Player2.h && 
				i.y + i.h > Player2.y && 
				!i.hit) {
					Player2.health -= 40;
					if (Player2.health <= 0) {
						Player2.dead = true;
					}
					if (Player1.health <= 0 && Player2.health <= 0){ 
						gameOver = true;
						endMessage = " Game Over!";
					}
					i.hit = true;
					return true;
			}
	}
	
	return false;	
}

function badGuyCollidesY (i, j, step) {
	for (k = theBadGuys.length - 1; k >= 0; k--){
		if (j != k && 
			i.y + step < theBadGuys[k].y + theBadGuys[k].h && 
			i.y + step + i.h > theBadGuys[k].y && 
			i.x < theBadGuys[k].x + theBadGuys[k].w && 
			i.x + i.w > theBadGuys[k].x) {
				return true;
			}
	}
	if (i.y + step < Player1.y + Player1.h && 
		i.y + step + i.h > Player1.y && 
		i.x < Player1.x + Player1.w && 
		i.x + i.w > Player1.x) {
			if (i.y + step < Player1.y + Player1.h && 
				i.y + step + i.h > Player1.y && 
				i.x < Player1.x + Player1.w && 
				i.x + i.w > Player1.x && 
				!i.hit) {
					Player1.health -= 40;
					if (Player1.health <= 0) {
						Player1.dead = true;
					}
					if (Player1.health <= 0 && Player2.health <= 0){ 
						gameOver = true;
						endMessage = " Game Over!";
					}
					i.hit = true;
					return true;
			}
	}
	if (i.y + step < Player2.y + Player2.h && 
		i.y + step + i.h > Player2.y && 
		i.x < Player2.x + Player2.w && 
		i.x + i.w > Player2.x) {
			if (i.y + step < Player2.y + Player2.h && 
				i.y + step + i.h > Player2.y && 
				i.x < Player2.x + Player2.w && 
				i.x + i.w > Player2.x && 
				!i.hit) {
					Player2.health -= 40;
					if (Player2.health <= 0) {
						Player2.dead = true;
					}
					if (Player1.health <= 0 && Player2.health <= 0){ 
						gameOver = true;
						endMessage = " Game Over!";
					}
					i.hit = true;
					return true;
			}
	}
	
	return false;	
}

function mouseMove(e) {
	if(e.offsetX) {
		mouseX = e.offsetX;
		mouseY = e.offsetY;
	}
	else if (e.layerX) {
		mouseX = e.layerX;
		mouseY = e.layerY;
	}
console.log("mouseX = " + mouseX + ", mouseY = " + mouseY); }

function createBullet(targetX, targetY, player) {
	if (!gameOver) {
		//deltaX = targetX - shooterX;
		//deltaY = targetY - shooterY;
		rotation = player.rotation;
		xtarget = Math.cos(rotation);
		ytarget = Math.sin(rotation);

		theBullets.push({
			active:true,
			//x: shooterX + Math.sin(rotation)*10,
			//y: shooterY + Math.cos(rotation)*10,
			
			x: player.x + (player.w / 2) - 0,
			y: player.y + (player.h / 2) - 2,
			shooter: player,
			speed: bulletTypes[player.bullet].speed,
			damage: bulletTypes[player.bullet].damage,
			range: bulletTypes[player.bullet].range,
			xtarget: xtarget,
			ytarget: ytarget,
			w: 3*bulletTypes[player.bullet].scale,
			h: 3*bulletTypes[player.bullet].scale,
			color: 'red',
			angle: rotation
		});
	}
}

function bulletsMove() {
	theBullets.forEach( function(i, j) {
		if(i.range > 0) {
			i.x += i.xtarget * i.speed;
			i.y += i.ytarget * i.speed;
			if(i.x < camera.x - camera.w) {
				i.x += mapSize.w;
			} else if(i.x > camera.x + camera.w + camera.w) {
				i.x -= mapSize.w;
			}
			if(i.y < camera.y - camera.h) {
				i.y += mapSize.h;
			} else if(i.y > camera.y + camera.h + camera.h) {
				i.y -= mapSize.h;
			}
			i.range--;
		} else {
			theBullets.splice(j, 1);
		}
	});
}

function bulletsTeleport(player, direction) {
	theBullets.forEach( function(i, j) {
		if(i.shooter === player) {
			if(direction === POSITIVE_X) {
				i.x += mapSize.w;
			} else if(direction === NEGATIVE_X) {
				i.x -= mapSize.w;
			} else if(direction === POSITIVE_Y) {
				i.y += mapSize.h;
			} else if(direction === NEGATIVE_Y) {
				i.y -= mapSize.h;
			}
		}
	});
}

function checkBulletHits() {
	if (theBullets.length > 0 /*&& theBadGuys.length > 0*/) {
		for (j = theBullets.length - 1; j >= 0; j--) {
			for (k = theBadGuys.length - 1; k >= 0; k--) {
				if (collides(theBadGuys[k], theBullets[j])) {
					console.log("collides");
					theBadGuys.splice(k, 1);
					theBullets.splice(j, 1);
					Player1.points += 1;	
				}
			}
			if (collides(Player1, theBullets[j]) && theBullets[j].shooter != Player1) {
				console.log("collides");
				Player1.health -= theBullets[j].damage;
				theBullets.splice(j, 1);
				
			} else if (collides(Player2, theBullets[j]) && theBullets[j].shooter != Player2) {
				console.log("collides");
				Player2.health -= theBullets[j].damage;
				theBullets.splice(j, 1);
				
			}
		}
	}
}

canvas.addEventListener('mousemove', mouseMove, true);

canvas.addEventListener("click", function() {
//createBullet(mouseX, mouseY, Player1.x, Player1.y);
});

canvas.addEventListener("keydown", function (e) {
	keys[e.keyCode] = true;
	if (event.keyCode === 86 && Player1.dead != true && Player1.cooldownTime <= 0) {
        createBullet(mouseX, mouseY, Player1);
		Player1.cooldownTime = Player1.rateOfFire;
    }
	if (event.keyCode === 97 && Player2.dead != true && Player2.cooldownTime <= 0) {
        createBullet(mouseX, mouseY, Player2);
		Player2.cooldownTime = Player2.rateOfFire;
    }
});

canvas.addEventListener("keyup", function (e) {
	keys[e.keyCode] = false;
});

/*graffiti*/

//##################################################################################################
//#000###########000###00000000000000000###000#################000####################0000000000####
//#000###########000###00000000000000000###000#################000###################000000000000###
//#000###########000###00000000000000000###000#################000##################00000000000000##
//#000###########000###000#################000#################000#################000##########000#
//#00000000000000000###00000000000000000###000#################000#################000##########000#
//#00000000000000000###00000000000000000###000#################000#################000##########000#
//#00000000000000000###00000000000000000###000#################000#################000##########000#
//#000###########000###000#################000#################000#################000##########000#
//#000###########000###00000000000000000###00000000000000000###00000000000000000####000000000000000#
//#000###########000###00000000000000000###00000000000000000###00000000000000000#####0000000000000##
//#000###########000###00000000000000000###00000000000000000###00000000000000000######00000000000###
//##################################################################################################