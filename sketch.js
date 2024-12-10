let player;
let playerSpriteSheet;
let canvasWidth = 1280;
let canvasHeight = 720;
let borderRebound = -0.2;
let playerSpriteLeft;
let playerSpriteRight;
let bullets = [];
let enemies = [];
let powerUps = [];
let enemySprite;
let fireRate = 1.1;
let cd = 90;     // cooldown
let refresh = 60;
let enemiesKilled = 0;
let bulletSpeed = 1.6;

function preload() {
  // player sprite sheet is loaded
  playerSpriteSheet = loadImage('assets/playerSpriteSheet.png');
  enemySprite = loadImage('assets/badGuy.png');
  powerUpImage = loadImage('assets/power.png');
}

function setup() {
  labelNbEnemies = createP("Nombre d'enemies : " + enemies.length);
  labelNbEnemies.style('color', 'blue');
  labelNbEnemies.position(10, 20);

  labelEnemiesKilled = createP("Enemies elimines : " + enemiesKilled);
  labelEnemiesKilled.style('color', 'cyan');
  labelEnemiesKilled.position(10, 40)

  playerSpriteRight = playerSpriteSheet.get(0, 0, playerSpriteSheet.width / 2, playerSpriteSheet.height);
  playerSpriteLeft = playerSpriteSheet.get(playerSpriteSheet.width / 2, 0, playerSpriteSheet.width / 2, playerSpriteSheet.height);

  createCanvas(canvasWidth, canvasHeight);
  player = new Player(400, 200, 5, playerSpriteRight);
  labelHP = createP(player.hp + " / " + player.maxHp);
  labelHP.position(80, -5)
}

function draw() {
  cd -= fireRate
  

  if (cd < 0)
    cd = -1;
  labelNbEnemies.html("Nombre d'enemies : " + enemies.length);
  labelEnemiesKilled.html("Enemies elimines : " + enemiesKilled);
  labelHP.html(floor(player.hp) + " / " + floor(player.maxHp));
  background(100);

  push();
  stroke(0);
  strokeWeight(4);
  noFill();
  rect(10, 10, 200, 20);
  
  noStroke();
  fill(255, 0, 0);
  rect(10, 10, map(player.hp, 0, player.maxHp, 0, 200), 20);
  pop();


  player.update();
  player.show();
  player.edges(canvasWidth, canvasHeight, borderRebound)


  let x = random(canvasWidth);
  let y = random(canvasHeight);
  if(random(1) < 0.0036 + 0.0005*enemiesKilled){
    do {
      x = random(canvasWidth);
      y = random(canvasHeight);
      spawnPoint = createVector(x,y);
    } while(dist(player.pos.x, player.pos.y, spawnPoint.x, spawnPoint.y) < 350);
    enemy = new Enemy(spawnPoint.x, spawnPoint.y, enemySprite);
    enemies.push(enemy);
    console.log('ENEMY');
  }

  let r = random(1)
  if(r < -0.1 + 0.01*enemiesKilled && r > 0){
    x = random(canvasWidth);
    y = random(canvasHeight);
    spawnPoint = createVector(x,y);
    let powerUp = floor(random(3.2));
    powerUp = new Powerup(spawnPoint.x, spawnPoint.y, powerUp, powerUpImage);
    powerUps.push(powerUp);
    
  }
  for(let i = powerUps.length - 1; i >= 0; i--){
    powerUps[i].show();
    if(powerUps[i].isOnPlayer(player)){
      console.log('POWER UP !');
      powerUps[i].grantPowerUp(player);
      powerUps.splice(i, 1);
    }
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].edges();
    // if(player.isHit(enemies[i])){
    //   player.hp -= 0.2 + 0.05 *enemiesKilled;
    // }
    if (dist(player.pos.x, player.pos.y, enemies[i].pos.x, enemies[i].pos.y) < enemies[i].perceptionRadius){
        let steering = enemies[i].pursue(player);
        enemies[i].applyForce(steering);
        // enemies[i].pursue(player);
    }
    else 
      enemies[i].wander();
      enemies[i].horde(enemies);
    
    enemies[i].update();
    enemies[i].show();
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();

    // Remove bullet if it goes off the screen
    if (bullets[i].offScreen()) {
      bullets.splice(i, 1);
      console.log('BULLET GONE');
    }
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    
    for (let j = enemies.length - 1; j >= 0; j--) {
      let e = enemies[j];
      if (b.didHit(e)) {  // Handle collision
       
        console.log('A BULLET HIT!!!!!!!')
        enemies.splice(j,1);  // Remove the enemy
        bullets.splice(i,1);  // Remove the bullet
        enemiesKilled = enemiesKilled + 1 ;
        break;
      }
    }
  }
  if(player.hp < 0){
    background(0);
    push();
    labelLostScreenMessage = createP("U LOST !!! But hey.. you killed " + enemiesKilled  +" ! Nice try I guess xd");
    labelLostScreenMessage.position(width/2, height/2);
    labelLostScreenMessage.style('color', 'yellow');
    noLoop();
  }
}

function mousePressed() {
  if (cd <= 0 ){
    target = createVector(mouseX, mouseY); // making the bullet's target the mouse position
    let bullet = new Bullets(player.pos.x +7, player.pos.y+3, target); // Create a new bullet at the player position
    bullets.push(bullet); // Add the bullet to the array
    console.log('BULLET');
    cd = refresh;
  }


}
