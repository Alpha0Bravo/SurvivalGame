class Powerup  {
    constructor(x, y, type, image) {
        this.pos = createVector(x, y);
        this.type = type;
        this.image = image;
        this.scale = 0.2;
        this.r = this.scale * this.image.height
    }
    show(){
        push();
        translate(this.pos.x, this.pos.y);
        let scaledWidth = this.image.width * this.scale;
        let scaledHeight = this.image.height * this.scale;
        image(this.image, 0, 0, scaledWidth, scaledHeight);
        pop();
    }
    isOnPlayer(character){
            let w = character.playerImage.width / 2 * character.scale;
            let h = character.playerImage.height / 2 * character.scale;
            if (dist(this.pos.x, this.pos.y, character.pos.x, character.pos.y) < this.image.height * this.scale)
                return true;
            else
                return false;
            //return collideRectRect(character.pos.x, character.pos.y, w, h, this.pos.x, this.pos.y, this.r);
    }
    grantPowerUp(player){
        if(this.type === 0)
            fireRate++;
          else if (this.type === 1)
            if(bulletSpeed <=6)
               bulletSpeed += enemiesKilled * 0.2;
          else if (this.type === 2)
            player.ms = enemiesKilled * 0.15;
          else if (this.type === 3){
            if (player.hp + 20 + enemiesKilled > player.maxHp){
              player.hp += 20 + enemiesKilled;
              player.maxHp = player.hp;
            }
            else
              player.hp += 20 + enemiesKilled;
          }
    }
}