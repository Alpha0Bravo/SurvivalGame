class Player {
  /* ACCELERATION = FORCE / MASS


  */
    constructor (x, y, m, playerSprite) {
        this.playerImage = playerSprite;
        this.hp = 100;
        this.maxHp = 100;
        this.pos = createVector(x,y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.masse = m;
        this.scale = 0.3;
        this.ms = 6 * this.scale;  // (ms = movement speed)
        
    }

    applyForce(force){
      let accelerationForce = p5.Vector.div(force, this.masse); // We use a static fonction (p5.Vector.div) to NOT MODIFY the variable force
      this.acc.add(accelerationForce);
    }

    playerMovement() {   // using  https://www.toptal.com/developers/keycode I get the code for each key 
      if (keyIsDown(87) === true) {  // code for W
        let movementDirection = createVector(0, -this.ms);
        this.applyForce(movementDirection);
      }
    
      if (keyIsDown(65) === true) { // code for A
        let movementDirection = createVector(-this.ms, 0);
        this.applyForce(movementDirection);
      }
    
      if (keyIsDown(83) === true) { // code for S
        let movementDirection = createVector(0, this.ms);
        this.applyForce(movementDirection);
      }
    
      if (keyIsDown(68) === true) { // code for D
        let movementDirection = createVector(this.ms, 0);
        this.applyForce(movementDirection);
      }
    }

    update(){
        // let mouse = createVector(mouseX, mouseY);

        // this.acc = p5.Vector.sub(mouse, this.pos);
        // this.acc.setMag(1);

        
        
        this.playerMovement();
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.vel.mult(0.90); // a way of simulating friction with the ground that takes 10% of the curent speed each frame
        this.acc.set(0,0);
    }

    show() {
        imageMode(CENTER);
  
        // On regarde la direction dans laquelle le boid va :
        push();
        translate(this.pos.x, this.pos.y);
        if (Math.abs(this.vel.x) > Math.abs(this.vel.y)) {

          if (this.vel.x > 0) {
            // Moving right, use the right-facing sprite
            if (this.playerImage !== playerSpriteRight) {
              // Only update if the sprite is different
              this.playerImage = playerSpriteRight;
            }
          } else if (this.vel.x < 0) {
            // Moving left, use the left-facing sprite
            if (this.playerImage !== playerSpriteLeft) {
              // Only update if the sprite is different
              this.playerImage = playerSpriteLeft;
            }
          }
      }

        // image(this.playerImage, 0, 0);
        
        let scaledWidth = this.playerImage.width * this.scale;
        let scaledHeight = this.playerImage.height * this.scale;
        image(this.playerImage, 0, 0, scaledWidth, scaledHeight);


        pop();
  
        return;
    }

    isHit(enemy){
      let w = this.playerImage.width / 2 * this.scale;
      let h = this.playerImage.height / 2 * this.scale;
      let hitbox = enemy.getHitbox();
      return collideRectCircle(hitbox.x, hitbox.y, hitbox.width, hitbox.height, this.pos.x, this.pos.y, w, h)
    }

      edges() {

        let w = this.playerImage.width / 2 * this.scale;
        let h = this.playerImage.height / 2 * this.scale;

        if (this.pos.y >= height - h) {
          this.pos.y = height - h;
          this.vel.y *= -0.8;
        } else if (this.pos.y <= h) {
          this.pos.y = h;
          this.vel.y *= -0.8;
        }
    
        if (this.pos.x >= width - w) {
          this.pos.x = width - w;
          this.vel.x *= -0.8;
        } else if (this.pos.x <= w) {
          this.pos.x = w;
          this.vel.x *= -0.8;
        }
      }
}
