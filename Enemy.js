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
      this.maxSpeed = 2;
      // force maximale appliquée au véhicule
      this.maxForce = 0.7;
      // rayon du véhicule
      this.r = 16;
      this.perceptionRadius = 180;
      this.wanderTheta = PI / 2;
      this.scale = 2;
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
      fill(0, 255, 0);
      circle(target.x, target.y, 16);
      return this.seek(target);
    }
  
    flee(target) {
      // inverse de seek ! REMPLACER LA LIGNE SUIVANTE POUR RENVOYER UNE FORCE INVERSE A CELLE RENVOYEE
      // PAR LE COMPORTEMENT SEEK
      let force = this.seek(target).mult(-1);  
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

      noFill();
      stroke(0, 255, 255);  // Cyan color for the hitbox outline
      rect(this.getHitbox().x, this.getHitbox().y, this.getHitbox().width, this.getHitbox().height);
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

        // MR BUFFA VERSION AND EXPLANATION
  
      // point devant le véhicule, centre du cercle
  
      // let centreCercleDevant = this.vel.copy();
      // centreCercleDevant.setMag(this.distanceCercle);
      // centreCercleDevant.add(this.pos);
  
      // // On va s'occuper de calculer le point vert SUR LE CERCLE
      // // il fait un angle wanderTheta avec le centre du cercle
      // // l'angle final par rapport à l'axe des X c'est l'angle du vaisseau
      // // + cet angle
      // let wanderAngle = this.vel.heading() + this.wanderTheta;
      // // on calcule les coordonnées du point vert
      // let pointSurCercle = createVector(this.wanderRadius * cos(wanderAngle), this.wanderRadius * sin(wanderAngle));
      // // on ajoute la position du vaisseau
      // pointSurCercle.add(centreCercleDevant);
  
      // // on dessine le vecteur desiredSpeed qui va du vaisseau au point vert
      // let desiredSpeed = p5.Vector.sub(pointSurCercle, this.pos);
  
  
      // // On a donc la vitesse désirée que l'on cherche qui est le vecteur
      // // allant du vaisseau au cercle vert. On le calcule :
      // // ci-dessous, steer c'est la desiredSpeed directement !
      // // Voir l'article de Craig Reynolds, Daniel Shiffman s'est trompé
      // // dans sa vidéo, on ne calcule pas la formule classique
      // // force = desiredSpeed - vitesseCourante, mais ici on a directement
      // // force = desiredSpeed
      // let force = p5.Vector.sub(desiredSpeed, this.vel);
      // force.setMag(this.maxForce);
  
      // // On déplace le point vert sur le cerlcle (en radians)
      // this.wanderTheta += random(-this.displaceRange, this.displaceRange);
  
      // return force;
    }
    

    // edges() {
    //   if (this.pos.x > width + this.r) {
    //     this.pos.x = -this.r;
    //   } else if (this.pos.x < -this.r) {
    //     this.pos.x = width + this.r;
    //   }
    //   if (this.pos.y > height + this.r) {
    //     this.pos.y = -this.r;
    //   } else if (this.pos.y < -this.r) {
    //     this.pos.y = height + this.r;
    //   }
    // }
  }
  