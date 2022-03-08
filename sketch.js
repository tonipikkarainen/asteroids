// Asteroids game by Toni Pikkarainen
// Started 13.11.2021

// Ship
let xShip = 0;
let yShip = 0;
let shipSize = 50;
let speed = 5;
// Bullet
let bulletSpeed = -8;
let bullets = [];
let bulletSize = 30;
// Enemies
let enemies = [];
let maxEnemySpeed = 5;
let minEnemySpeed = 3;
let enemySpeed = [minEnemySpeed,maxEnemySpeed];
let enemySize = 40;
let numberOfenemies = 3;

let scoreElem;

let shipImg;
let bulletImg;
let enemyImg;
let spaceImg;

/*
Preload images.
*/
function preload() {
  shipImg = loadImage('rocket.svg');
  bulletImg = loadImage('bullet.svg');
  enemyImg = loadImage('enemy.svg');
  spaceImg = loadImage('space.jpeg');
}

function setup() {
  cnv  = createCanvas(600, 600);
  cnv.id("canvas");
  cnv.parent("parentForGame");


  scoreElem = createDiv('Score = 0');
  scoreElem.parent("parentForGame");
  scoreElem.position(20, 20);
  scoreElem.id = 'score';
  scoreElem.style('color', 'white');
  
  xShip = width/2 - shipSize/2
  yShip = height - 2 * shipSize
  // Create enemies
  for (let i = 0; i < numberOfenemies ; i++) {
    createItem(random(width), 0, 
               random(enemySpeed[0],enemySpeed[1]),
               enemies);
  }
}

// This is main loop
// Actions inside this function are repeated
// periodically
function draw() {
  background(spaceImg);
  drawShip()
  updateShipCoordinates();
  cleanBullets();
  drawItems(bullets, bulletImg, bulletSize);
  drawItems(enemies, enemyImg, enemySize);
  updateEnemies();
  checkEnemyCollisions();
}

function drawShip(){
  image(shipImg, xShip, yShip, shipSize, shipSize);
}

function drawItems(items, itemImage, size) {
   for( var i = 0; i < items.length; i++){
      moveItem(items[i], items[i].speed);
      image(itemImage, items[i].x, items[i].y, size, size);
    }
}

/*
Check if enemies collides with bullets or ship.
*/
function checkEnemyCollisions(){
  for( var i = 0; i < enemies.length; i++){
    checkBulletCollisions(enemies[i]);
    checkShipCollisions(enemies[i]);
  }
}

function checkBulletCollisions(enemy) {
  for( var i = 0; i < bullets.length; i++){
    if( bullets[i].x > enemy.x - bulletSize && 
        bullets[i].x < enemy.x + enemySize && 
        bullets[i].y < enemy.y + enemySize &&
        bullets[i].y > enemy.y - bulletSize
      ){
      // add score
      const prevScore = parseInt(scoreElem.html().substring(8));
      scoreElem.html('Score = ' + (prevScore + 1));
      updateEnemy(enemy);
    }
  }
}


function checkShipCollisions(enemy) {
  if( enemy.x > xShip - enemySize&& 
      enemy.x < xShip + shipSize && 
      enemy.y > yShip - enemySize
    ){
      // Game over
      noLoop();
      const scoreVal = parseInt(scoreElem.html().substring(8));
      scoreElem.html('Game ended! Your score was: ' + scoreVal);
    }
}

function updateEnemies() {
  for( var i = 0; i < enemies.length; i++){
    if(enemies[i].y > height){
      updateEnemy(enemies[i]);
    }
  }
}

/*
Update enemy back to top of the screen
if they are about fall out of sight.
Also give new random speed to enemy.
*/
function updateEnemy(enemy) {
  enemy.x = random(width)
  enemy.y = 0
  enemy.speed = random(enemySpeed[0],enemySpeed[1])
}

/*
Change item's position the amount of given speed.
*/
function moveItem(item, speed) {
  item.y += speed;
}

/*
Create item with coordinates and speed and
push it to given store.
*/
function createItem(item_x, item_y, item_speed, store){
  store.push({
    x: item_x,
    y: item_y,
    speed: item_speed
  })
}

/*
Check if any bullet has left screen area and 
remove these bullets from bullet store.
*/
function cleanBullets(){
  bullets = bullets.filter(bullet => bullet.y >= 0);
}

/*
Change coordinates of the spaceship
*/
function updateShipCoordinates(){
  if (keyIsDown(RIGHT_ARROW)){
    xShip += speed;
  }
  if (keyIsDown(LEFT_ARROW)){
    xShip -= speed;
  }
}

/*
Shoot if space is pressed.
*/
function keyPressed() {
  switch (keyCode) {
    case 32:
      // 32 is Space -  Space is pressed -> create bullet
      createItem(xShip - bulletSize/2 + shipSize/2, 
                 yShip, bulletSpeed, bullets);
      break;
  }
}

function drawSquare(color, x, y, size) {
  let c = color(color);
  fill(c);
  noStroke();
  square(x, y, size);  
}