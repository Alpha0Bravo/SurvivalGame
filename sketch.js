let player;
let playerSpriteSheet;
let canvasWidth = 1280;
let canvasHeight = 720;
let borderRebound = -0.2;
let playerSpriteLeft;
let playerSpriteRight;
let bullets = [];
let enemies = [];
let enemySprite;
let fireRate = 10;
let cd = 90;     // cooldown
let refresh = 60;
let enemiesKilled = 0;

function preload() {
  // player sprite sheet is loaded
  playerSpriteSheet = loadImage('assets/playerSpriteSheet.png');
  enemySprite = loadImage('assets/badGuy.png');
}

function setup() {
  playerSpriteRight = playerSpriteSheet.get(0, 0, playerSpriteSheet.width / 2, playerSpriteSheet.height);
  playerSpriteLeft = playerSpriteSheet.get(playerSpriteSheet.width / 2, 0, playerSpriteSheet.width / 2, playerSpriteSheet.height);

  createCanvas(canvasWidth, canvasHeight);
  player = new Player(400, 200, 5, playerSpriteRight);
  
}

function draw() {
  cd -= fireRate
  if (cd < 0)
    cd = -1;
  background(100);

  
  player.update();
  player.show();
  player.edges(canvasWidth, canvasHeight, borderRebound)

  let x = random(canvasWidth);
  let y = random(canvasHeight);
  if(random(1) < 0.04){
    do {
      x = random(canvasWidth);
      y = random(canvasHeight);
      spawnPoint = createVector(x,y);
    } while(dist(player.pos.x, player.pos.y, spawnPoint.x, spawnPoint.y) < 350);
    enemy = new Enemy(spawnPoint.x, spawnPoint.y, enemySprite);
    enemies.push(enemy);
    console.log('ENEMY');
  }
  for (let i = enemies.length - 1; i >= 0; i--) {

    if (dist(player.pos.x, player.pos.y, enemies[i].pos.x, enemies[i].pos.y) < enemies[i].perceptionRadius){
        let steering = enemies[i].pursue(player);
        enemies[i].applyForce(steering);
        enemies[i].pursue(player);
    }
    else
      enemies[i].wander();
    
    enemies[i].update();
    enemies[i].show();
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();

    // Remove bullet if it goes off the screen
    if (bullets[i].offScreen()) {
      bullets.splice(i, 1); // Remove the bullet from the array
      console.log('BULLET GOOOOONE');
    }
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    
    for (let j = enemies.length - 1; j >= 0; j--) {
      let e = enemies[j];
      
      if (b.didHit(e)) {
        // Handle collision
        console.log('A BULLET HIT!!!!!!!')
        enemies.splice(j,1);  // Remove the enemy
        bullets.splice(i,1);  // Remove the bullet
        enemiesKilled++ ;
      }
    }
  }
}

function mousePressed() {
  if (cd <= 0 ){
    target = createVector(mouseX, mouseY);
    let bullet = new Bullets(player.pos.x +7, player.pos.y+3, target); // Create a new bullet at the mouse position
    bullets.push(bullet); // Add the bullet to the array
    console.log('BULLET');
    cd = refresh;
  }


}
