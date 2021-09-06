var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

document.addEventListener("keypress", event => { 
  if(player.y === 350 || player.y === 620) {
    float = 1;
  }
});

state = 0;
float = 0;
score = 0;
highScore = 0;
angle = 0;
obs = 0;
pow = 0;
invincible = 0;
loss = 0;
var x1, y1, x2, y2, x3, y3;

function floor(x, width, height) {
  this.x = x;
  this.width = width;
  this.height = height;
}
    
function ceiling(x, width, height) {
  this.x = x;
  this.width = width;
  this.height = height;
}

function obstacle(x, y) {
  this.x = x;
  this.y = y;
  this.obsMove = 0;
} 

function powerUp(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

var world = {
  height: 1080,
  width: 1920,
  gravity: 15,
  speed: 7.5,
  distanceTravelled: 0,
            
  floorTiles: [
    new floor(0, 1000 + Math.floor(Math.random() * 800), 290)
  ],

  ceilingTiles: [
    new ceiling(0, 1000 + Math.floor(Math.random() * 800), 290)
  ],

  obstacles: [

  ],

  powerUps:[

  ],

  moveLevel: function() {
    for(index in this.floorTiles) {
      var tile = this.floorTiles[index];
      tile.x -= this.speed;
      this.distanceTravelled += this.speed;
    }

    for(index in this.ceilingTiles) {
      var tile = this.ceilingTiles[index];
      tile.x -= this.speed;
    }

    for(index in this.obstacles) {
      var obstacle = this.obstacles[index];
      obstacle.x -= this.speed;

      if(obstacle.obsMove === 0) {
        obstacle.y += 10;
        if(obstacle.y >= 600) {
          obstacle.obsMove = 1;
        }
      }

      else if(obstacle.obsMove === 1) {
        obstacle.y -= 10;
        if(obstacle.y <= 310) {
          obstacle.obsMove = 0;
        }
      }

      if(obstacle.x <= 0) {
        this.obstacles.splice(index, 1);
      }
    }

    for(index in this.powerUps) {
      var powerUp = this.powerUps[index];
      powerUp.x -= this.speed;

      if(powerUp.x <= 0) {
        this.powerUps.splice(index, 1);
      }      
    }

    

    this.speed += 1/120;
  },

  addFutureTiles: function() {
    var previousTileF = this.floorTiles[this.floorTiles.length - 1];
    var leftValueF = (previousTileF.x + previousTileF.width);
    var nextF = new floor(leftValueF + 100 + Math.floor(Math.random() * 100), 200 + Math.floor(Math.random() * 1000), 290);
    
    var previousTileC = this.ceilingTiles[this.ceilingTiles.length - 1];
    var leftValueC = (previousTileC.x + previousTileC.width);
    var nextC = new floor(leftValueC + 100 + Math.floor(Math.random() * 100), 200 + Math.floor(Math.random() * 1000), 290);
    
    rand = Math.random();
    obstacleChance = Math.random();
    powerUpChance = Math.random();

    if(rand < 0.5) {
      if(this.floorTiles.length < 50) {
        this.floorTiles.push(nextF);
      }
      if((leftValueC < this.floorTiles[1].x - 60 && leftValueC > leftValueF) === 0) {
        if(this.ceilingTiles.length < 50) {
          this.ceilingTiles.push(nextC);
        }
      }
    }

    if(rand >= 0.5) {
      if(this.ceilingTiles.length < 20) {
        this.ceilingTiles.push(nextC);
      }
      if((leftValueF < this.ceilingTiles[1].x - 60 && leftValueF > leftValueC) === 0) {
        if(this.floorTiles.length < 20) {
          this.floorTiles.push(nextF);
        }
      }
    }

    if(obstacleChance > 0.995) {
      obs = 1;
      var nextObs = new obstacle(player.x + 1920, 310 + Math.floor(Math.random() * 290));
      this.obstacles.push(nextObs);
    }

    if(powerUpChance > 0.9975) {
      pow = 1;

      if(rand > 0.5) {
        var y = 290;
      }
      else {
        var y = 580;
      }

      var nextPow = new powerUp(player.x + 1920, y, 40, 40);
      this.powerUps.push(nextPow);
    }

    //FALLING//
    if(invincible === 0) {
      if(state === 0) {
        for(index in this.floorTiles) {
          var tileF = this.floorTiles[index];     
          if(player.y >= 620 && player.x > tileF.x + tileF.width && player.x +60 < this.floorTiles[1].x) {
            player.y += world.gravity;
            if(player.x + 60 >= this.floorTiles[1].x) {
              player.x = this.floorTiles[1].x - 60;
            }
          }
        }
      }
  
      if(state === 1) {
        for(index in this.ceilingTiles) {
          var tileC = this.ceilingTiles[index];     
          if(player.y <= 350 && player.x > tileC.x + tileC.width && player.x + 60 < this.ceilingTiles[1].x ) {
            player.y -= world.gravity;
            if(player.x + 60 >= this.ceilingTiles[1].x) {
              player.x = this.ceilingTiles[1].x - 60;
            }
          }
        }
      }
    }   
  },

  cleanOldTiles: function() {
    for(index in this.floorTiles) {
        if(this.floorTiles[index].x <= -this.floorTiles[index].width) {
            this.floorTiles.splice(index, 1);
        }
    }

    for(index in this.ceilingTiles) {
      if(this.ceilingTiles[index].x <= -this.ceilingTiles[index].width) {
          this.ceilingTiles.splice(index, 1);
      }
    }
  },  

  tick: function() {
    this.cleanOldTiles();
    this.addFutureTiles();
    this.moveLevel();
  },

  draw: function() {
    ctx.fillStyle = "#666666";
    ctx.fillRect (0, 0, this.width, this.height);

    for(index in this.floorTiles) {
        var tile = this.floorTiles[index];
        var y = 620;
        ctx.fillStyle = "black";
        ctx.fillRect(tile.x, y, tile.width, tile.height);
    }

    for(index in this.ceilingTiles) {
        var tile = this.ceilingTiles[index];
        var y = 0;
        ctx.fillStyle = "black";
        ctx.fillRect(tile.x, y, tile.width, tile.height);
    } 
    
    if(obs === 1){
      for(index in this.obstacles) {
        var obstacle = this.obstacles[index];

        ctx.fillStyle = "#ff4d4d";
        ctx.beginPath();
        ctx.arc(obstacle.x, obstacle.y, 20, 0, 2 * Math.PI);
        ctx.fill(); 
      }
    }    

    if(pow === 1) {
      for(index in this.powerUps) {
        var powerUp = this.powerUps[index];
        ctx.fillStyle = "#ffff4d";
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
      }    
    }

    score = Math.floor(this.distanceTravelled/200);

    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText("Score: " + score, 10, 40);
    ctx.fillText("High Score: " + highScore, 10, 75); 
  }  
};

var player = {
  x: 350,
  y: 620,
  height: 60,
  width: 60,

  draw: function() {
    if(invincible === 0) {
      ctx.fillStyle = "#3399ff";
    }
    else if(invincible === 1) {
      ctx.fillStyle = "white";
    }

    if(float === 0 && state === 0) { 
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + 60, this.y);
      ctx.lineTo(this.x + 30, this.y - 60);
      ctx.fill();
      x1 = this.x;
      y1 = this.y;
      x2 = this.x + 60;
      y2 = this.y;
      x3 = this.x + 30;
      y3 = this.y - 60;
    }

    else if(float === 0 && state === 1) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 60);
      ctx.lineTo(this.x + 60, this.y - 60);
      ctx.lineTo(this.x + 30, this.y);
      ctx.fill();
      x1 = this.x;
      y1 = this.y - 60;
      x2 = this.x + 60;
      y2 = this.y - 60;
      x3 = this.x + 30;
      y3 = this.y;
    }
    
    else if(float === 1 && state === 1) {
      angle -= 15 * Math.PI/180 
      ctx.beginPath();
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x + 60 * Math.cos(angle), this.y - 60 * Math.sin(angle));
      ctx.lineTo(this.x + 30 * Math.sqrt(5) * Math.cos(63.4 * Math.PI/180 + angle), this.y - 30 * Math.sqrt(5) * Math.sin(63.4 * Math.PI/180 + angle));
      ctx.fill();
      x1 = this.x;
      y1 = this.y;
      x2 = this.x + 60 * Math.cos(angle);
      y2 = this.y - 60 * Math.sin(angle);
      x3 = this.x + 30 * Math.sqrt(5) * Math.cos(63.4 * Math.PI/180 + angle);
      y3 = this.y - 30 * Math.sqrt(5) * Math.sin(63.4 * Math.PI/180 + angle);
    }

    else if(float === 1 && state === 0) {
      angle += 15 * Math.PI/180 
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 60)
      ctx.lineTo(this.x + 60 * Math.cos(angle), this.y - 60 * Math.sin(angle) - 60);
      ctx.lineTo(this.x + 30 * Math.sqrt(5) * Math.cos(63.4 * Math.PI/180 + angle), this.y - 30 * Math.sqrt(5) * Math.sin(63.4 * Math.PI/180 + angle) - 60);
      ctx.fill();
      x1 = this.x;
      y1 = this.y - 60;
      x2 = this.x + 60 * Math.cos(angle);
      y2 = this.y - 60 * Math.sin(angle) - 60;
      x3 = this.x + 30 * Math.sqrt(5) * Math.cos(63.4 * Math.PI/180 + angle);
      y3 = this.y - 30 * Math.sqrt(5) * Math.sin(63.4 * Math.PI/180 + angle) - 60;
    }

    // ctx.fillStyle = "#3399ff";
    // ctx.fillRect(this.x, this.y - 60, this.width, this.height);
  },
};

function jump() {
  if(float === 1) {
    if(state === 0) {
      if(player.y > 350) {
        player.y -= world.gravity; 
      }
      if(player.y === 350) {
        state = 1;
        float = 0;
      }
    } 
    
    else if(state === 1) {
      if(player.y < 620) {
        player.y += world.gravity; 
      }
      if(player.y === 620) {
        state = 0;
        float = 0;
      }
      return;
    } 
  }
}

function lose() {
  if(obs === 1) {
    for(index in world.obstacles) {
      if(((x1 > world.obstacles[index].x - 20) && (x1 < world.obstacles[index].x + 20) && (y1 < world.obstacles[index].y + 20) && (y1 > world.obstacles[index].y - 20))
          || ((x2 > world.obstacles[index].x - 20) && (x2 < world.obstacles[index].x + 20) && (y2 < world.obstacles[index].y + 20) && (y2 > world.obstacles[index].y - 20))
          || ((x3 > world.obstacles[index].x - 20) && (x3 < world.obstacles[index].x + 20) && (y3 < world.obstacles[index].y + 20) && (y3 > world.obstacles[index].y - 20))
          || ((world.obstacles[index].x < x2) && (world.obstacles[index].x > x1) && (world.obstacles[index].y < y3) && (world.obstacles[index].y > y1)))
        
        if(invincible === 0) {
          loss = 1;
        }
    }
  }

  if(pow === 1) {
    for(index in world.powerUps) {
      if(((x1 >= world.powerUps[index].x) && (x1 <= world.powerUps[index].x + 60) && (y1 <= world.powerUps[index].y + 60) && (y1 >= world.powerUps[index].y))
          || ((x2 >= world.powerUps[index].x) && (x2 <= world.powerUps[index].x + 60) && (y2 <= world.powerUps[index].y + 60) && (y2 >= world.powerUps[index].y))
          || ((x3 >= world.powerUps[index].x) && (x3 <= world.powerUps[index].x + 60) && (y3 <= world.powerUps[index].y + 60) && (y3 >= world.powerUps[index].y ))
          || ((world.powerUps[index].x < x2) && (world.powerUps[index].x > x1) && (world.powerUps[index].y < y3) && (world.powerUps[index].y > y1))) {
        
        if(invincible === 0) {
          invincible = 1;
          world.powerUps.splice(index, 1);
          window.setTimeout(function() {invincible = 0}, 5000);
        }
      }       
    }
  }

  if(invincible === 0) {
    if((player.y > 620 && player.x + 60 >= world.floorTiles[1].x) || (player.y < 350 && player.x + 60 >= world.ceilingTiles[1].x) || (loss === 1)) {
      console.log("X:", player.x, "Y:", player.y, "Loss:", loss, "Invincible:", invincible);

      alert("F, u lost bro.");

      if(score > highScore) {
        highScore = score;
      }

      player.x = 350;
      player.y = 620;
      state = 0;
      angle = 0;
      float = 0;
      obs = 0;
      pow = 0;
      invincible = 0;
      loss = 0;

      world.speed = 7.5;
      world.distanceTravelled = 0;
      world.gravity = 15;

      world.floorTiles = [];
      world.ceilingTiles = [];
      world.obstacles = [];
      world.powerUps = [];
      world.floorTiles.push(new floor(0, 1000 + Math.floor(Math.random() * 800), 290));
      world.ceilingTiles.push(new ceiling(0, 1000 + Math.floor(Math.random() * 800), 290));
    }
  }
}

function tick() {
world.tick();
world.draw();
player.draw();
jump();
lose();
window.setTimeout("tick()", 1000/60);
}

tick();           
