var gameState = null;
var currentBirdId = 0;
var gameSize = {w: 800, h: 600};
var treeSize = {w: 300, h: 300};
var treePos = {x: 200, y: 50};

var birdSize = {w: 103, h: 103};
var birdY = treePos.y + treeSize.h * .25;
var birdLeftPos = {x: treePos.x + (.25 * treeSize.w) - (.5*birdSize.w), y: birdY};
var birdRightPos = {x: treePos.x + (.25 * treeSize.w) - (.5*birdSize.w), y: birdY};

var songWaitDelay = 1.5;

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'contentBox', { preload: preload, create: create, update: update});

function preload () {
  game.load.image('tree', 'assets/tree_450x450.png');
  game.load.image('bird1', 'assets/bird1_160x160.png');
  game.load.image('bird2', 'assets/bird2_160x160.png');

  game.load.bitmapFont('nokia', 'assets/fonts/bitmapFonts/nokia16black.png', 'assets/fonts/bitmapFonts/nokia16black.xml');
  game.load.spritesheet('button', 'assets/buttons/flixel-button.png', 80, 20);

  game.load.audio('sfx', 'assets/A.mp3');

}

function create () {
  var tree = game.add.sprite(treePos.x, treePos.y, 'tree');
  tree.scale.setTo(.67, .67);
  
  var bird = game.add.sprite(birdLeftPos.x, birdLeftPos.y, 'bird1');
  bird.scale.setTo(.67, .67);

  audio = game.add.audio('sfx');

  // Draw sidebar.
  var graphics = game.add.graphics(0, 0);
  graphics.beginFill(0xFFFFFF);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(600, 0, 200, 600);

  // Draw initial sidebar buttons.
  makeBirdButton({x: 600, y: 15, birdId: 0, text: 'Ruby-Throated Sap-Sucker'});

  gameState = 'birdStart';
}

function update (){
  if (gameState == 'birdStart') {
    console.log('show bird');
    console.log('play bird song');
    currentBirdId = 0;
    gameState = 'awaitingInput';
  }
}


var evaluateBirdButtonResponse = function(response) {
  if (response.birdId == currentBirdId) {
    console.log('correct');
  } else {
    console.log('incorrect');
  }
}

function makeBirdButton(opts) {
  var button = game.add.button(opts.x, opts.y, 'button', onBirdButtonDown, this, 0, 1, 2);
  button.birdId = opts.birdId;
  button.scale.set(2, 1.5);
  button.smoothed = false;

  var buttonText = game.add.bitmapText(opts.x, opts.y + 7, 'nokia', opts.text, 16);
  buttonText.x += (button.width / 2) - (buttonText.textWidth / 2);

}

function onBirdButtonDown(birdButton) {
  console.log('obbd');
  birdButton.events.onInputDown.add(onBirdButtonDown, this);
  if (gameState != 'awaitingInput') {
    return;
  } else {
    evaluateBirdButtonResponse({birdId: birdButton.birdId});
    gameState = 'birdStart';
  }
}


function playSound(item) {
	audio.play('note', 0, 2.5);
}

