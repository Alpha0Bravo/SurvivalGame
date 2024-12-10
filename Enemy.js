class Enemy {
    constructor(x, y, enemySprite) {
      // position du véhicule
      this.enemySprite = enemySprite;
      this.pos = createVector(x, y);
      // vitesse du véhicule
      this.vel = createVector(random(-2,2),random(-2,2));
      // accélération du véhicule
      this.acc = createVector(0, 0);
      // vitesse maximale du véhicule
      this.maxSpeed = 2 + enemiesKilled * 0.02;
      // force maximale appliquée au véhicule
      this.maxForce = 0.6;
      // rayon du véhicule
      this.r = 16;
      this.perceptionRadius = 180;
      this.wanderTheta = PI / 2;
      this.scale = 2;
      this.fleeModifier = 5;
      this.alignWeight = 0.5;

      this.cohesionWeight = 0.8;
      this.separationWeight = 1;
    }
  
    applyBehaviors(target) {
      //let force = this.seek(target);
      let force = this.seek(target);
      this.applyForce(force);
    }
    // seek est une méthode qui permet de faire se rapprocher le véhicule de la cible passée en paramètre

    seek(target) {
      let force = p5.Vector.sub(target, this.pos);
      force.setMag(this.maxSpeed);
      force.sub(this.vel);
      force.limit(this.maxForce);
      return force;
    }

    pursue(mover) {
      let target = mover.pos.copy();
      let prediction = mover.vel.copy();
      prediction.mult(15);
      target.add(prediction);
      // fill(0, 255, 0);
      // circle(target.x, target.y, 16);
      return this.seek(target);
    }
  
    flee(target) {
      // inverse de seek ! REMPLACER LA LIGNE SUIVANTE POUR RENVOYER UNE FORCE INVERSE A CELLE RENVOYEE
      // PAR LE COMPORTEMENT SEEK
      let force = this.seek(target).mult(-1*this.fleeModifier);  
      return force;
    }
  
    // applyForce est une méthode qui permet d'appliquer une force au véhicule
    // en fait on additionne le vecteurr force au vecteur accélération
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    }
  
    // On dessine le véhicule
    show() {
      imageMode(CENTER);

      push();
      translate(this.pos.x, this.pos.y);
      image(this.enemySprite, 0, 0);


      let scaledWidth = this.enemySprite.width * this.scale;
      let scaledHeight = this.enemySprite.height * this.scale;
      image(this.enemySprite, 0, 0, scaledWidth, scaledHeight);
    
      pop();

      // noFill();
      // stroke(0, 255, 255);  // Cyan color for the hitbox outline
      // rect(this.getHitbox().x, this.getHitbox().y, this.getHitbox().width, this.getHitbox().height);
    }

    getHitbox() {
      // This is the real (non-translated) position
      return {
        x: this.pos.x - this.enemySprite.width / 2, // Left side of the hitbox
        y: this.pos.y - this.enemySprite.height,    // Top side of the hitbox
        width: this.enemySprite.width,              // Width of the hitbox
        height: this.enemySprite.height * 2         // Height of the hitbox (scaled)
      };
    }

    wander() {
      let wanderPoint = this.vel.copy();
      wanderPoint.setMag(125);
      wanderPoint.add(this.pos);

      let wanderRadius = 10;
    // noFill();
    // stroke(255);
    // circle(wanderPoint.x, wanderPoint.y, wanderRadius * 2);
    // line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);

      let theta = this.wanderTheta + this.vel.heading();

      let x = wanderRadius * cos(theta);
      let y = wanderRadius * sin(theta);
      wanderPoint.add(x, y);
    // fill(0, 255, 0);
    // noStroke();
    // circle(wanderPoint.x, wanderPoint.y, 16);

    // stroke(255);
    // line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);

      let steer = wanderPoint.sub(this.pos);
      steer.setMag(this.maxForce);
      this.applyForce(steer);

      let displaceRange = 0.32;
      this.wanderTheta += random(-displaceRange, displaceRange);
    }
    
    horde(enemies) {
      let alignment = this.align(enemies);
      let cohesion = this.cohesion(enemies);
      let separation = this.separation(enemies);

  
      alignment.mult(this.alignWeight);
      cohesion.mult(this.cohesionWeight);
      separation.mult(this.separationWeight);
  
      this.applyForce(alignment);
      this.applyForce(cohesion);
      this.applyForce(separation);
    }
  
    align(enemies) {
      let perceptionRadius = 50 + floor(enemiesKilled*0.7);
  
      let steering = createVector();
      let total = 0;
      for (let other of enemies) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (other != this && d < perceptionRadius) {
          steering.add(other.vel);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        steering.setMag(this.maxSpeed);
        steering.sub(this.vel);
        steering.limit(this.maxForce);
      }
      return steering;
    }
  
    separation(enemies) {
      let perceptionRadius = 50 + floor(enemiesKilled*0.7);
  
      let steering = createVector();
      let total = 0;
  
      for (let other of enemies) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (other != this && d < perceptionRadius) {
          let diff = p5.Vector.sub(this.pos, other.pos);
          diff.div(d * d);
          steering.add(diff);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        steering.setMag(this.maxSpeed);
        steering.sub(this.vel);
        steering.limit(this.maxForce);
      }
      return steering;
    }
  
    cohesion(enemies) {
      let perceptionRadius = 2* 50 + floor(enemiesKilled*0.7);
  
      let steering = createVector();
      let total = 0;
  
      for (let other of enemies) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (other != this && d < perceptionRadius) {
          steering.add(other.pos);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
  
        steering.sub(this.pos);
        steering.setMag(this.maxSpeed);
        steering.sub(this.vel);
        steering.limit(this.maxForce);
      }
      return steering;
    }

    edges() {

      let w = this.enemySprite.width / 2 * this.scale;
      let h = this.enemySprite.height / 2 * this.scale;

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
  