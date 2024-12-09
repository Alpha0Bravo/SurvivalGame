class Bullets {
    constructor(x, y, target) {
        this.acc = createVector(0, 0);
        this.vel = createVector(0, 0);
        this.pos = createVector(x, y);

        this.acc = p5.Vector.sub(target, this.pos);

        this.speed = 0.5;
        this.acc.setMag(this.speed);

        this.r = 6; // Bullet size
        
    }
  
    // Update the bullet's position
    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0.90);
    }
  
    // Check if the bullet is off the screen
    offScreen() {
      return this.pos.x < 0 || this.pos.x > canvasWidth || this.pos.y < 0 || this.pos.y > canvasHeight;
    }
    didHit(target){
        let hitbox = target.getHitbox();

        return collideRectCircle(hitbox.x, hitbox.y, hitbox.width, hitbox.height, this.pos.x, this.pos.y, this.r)
        // let closeX = hitbox.x;
        // let closeY = hitbox.y;


        // if (this.pos.x >= hitbox.x + hitbox.width){
        //     closeX = hitbox.x + hitbox.width;
        // }else if(this.pos.x <= hitbox.x){
        //     closeX = hitbox.x;
        // }

        // if (this.pos.y >= hitbox.y + hitbox.height){
        //     closeY = hitbox.y + hitbox.height;
        // }else if(this.pos.y <= hitbox.y){
        //     closeY = hitbox.y;
        // }

        // let distance = dist(closeX, closeY, this.pos.x, this.pos.y);

        // if (distance <= this.r*2)
        //     return true;
        // else
        //     return false;
    }
  
    // Draw the bullet on the canvas
    show() {
        push();
        fill(230, 200, 110);
        ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
        pop();
    }
}