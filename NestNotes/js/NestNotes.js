var gameState = null;
var currentBirdId = 0;
var gameSize = {w: 800, h: 600};
var treeSize = {w: 300, h: 300};
var treePos = {x: 200, y: 50};

var rightSidebarSize = {w: 250, h: gameSize.h};

var defaultTextPadding = 10;

var smokeyPosition = {x: 0, y: 0};
var smokeyVisible = false;
var birdSize = {w: 103, h: 103};
var birdY = treePos.y + treeSize.h * .25;
var birdLeftPos = {x: treePos.x + (.25 * treeSize.w) - (.5*birdSize.w), y: birdY};
var birdRightPos = {x: treePos.x + (.25 * treeSize.w) - (.5*birdSize.w), y: birdY};

var songWaitDelay = 1.5;

var noteIds = ['C', 'D', 'E', 'F', 'G', 'A'];

var birdData = {
  'unison': {id: 'unison', notes: ['C', 'C'], label: 'Ruby-throated\ngarlic sucker'},
  'M2': {id: 'M2', notes: ['C', 'D'], label: 'Purple-footed\n Tang drinker'},
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'contentBox', { preload: preload, create: create, update: update});

var sidebarItems = [];
var audio = {};

var activeBirds = [];

function preload () {
  game.load.image('bg', 'assets/bg.png');
  game.load.image('tree', 'assets/tree_450x450.png');
  game.load.image('bird1', 'assets/bird1_160x160.png');
  game.load.image('bird2', 'assets/bird2_160x160.png');

  game.load.bitmapFont('nokia', 'assets/bitmapFonts/nokia16black.png', 'assets/bitmapFonts/nokia16black.xml');
  game.load.spritesheet('button', 'assets/buttons/flixel-button.png', 80, 20);

  // Load notes.
  for (var i=0; i < noteIds.length; i++) {
    var noteId = noteIds[i];
    game.load.audio(noteId, 'assets/' + noteId + '.mp3');
  }

}

function create () {

  activeBirdIds = ['unison'];

  game.load.bitmapFont('nokia', 'assets/bitmapFonts/nokia16black.png', 'assets/bitmapFonts/nokia16black.xml');
  game.load.spritesheet('button', 'assets/buttons/flixel-button.png', 80, 20);
  
  // Background Shade
  var graphics = game.add.graphics(0, 0);
  graphics.beginFill(0x006600);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(0, 0, 800, 600);
  
  var bg = game.add.sprite(0, 0, 'bg');
  bg.scale.setTo(1.0,1.5);
  
  var tree = game.add.sprite(treePos.x, treePos.y, 'tree');
  tree.scale.setTo(.67, .67);
  
  var bird = game.add.sprite(birdLeftPos.x, birdLeftPos.y, 'bird1');
  bird.cropRect = new Phaser.Rectangle(0,0,160,110);
  bird.updateCrop();
  bird.scale.setTo(.67, .67);

  // Draw right sidebar.
  graphics = game.add.graphics(0, 0);
  graphics.beginFill(0xFFFFFF);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(gameSize.w - rightSidebarSize.w, 0, rightSidebarSize.w, rightSidebarSize.h);
  
  // Underline current bird
  graphics = game.add.graphics(0, 0);
  graphics.beginFill(0x009626);
  graphics.lineStyle(1, 0x006626, 0);
  graphics.drawRect(bird.x+9, bird.y+bird.height, bird.width-27, 9);
  graphics.endFill();
  
  // Outer Smokey box
  graphics = game.add.graphics(0, 0);
  graphics.beginFill(0xFFCA22);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(0, 0, 150, 200);
  graphics.endFill();
  // Inner Smokey box
  graphics = game.add.graphics(5, 5);
  graphics.beginFill(0xC5850A);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(0, 0, 140, 190);
  graphics.endFill();
  // Smokey outline - outer
  graphics = game.add.graphics(0, 0);
  graphics.beginFill(0xFFCA22);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(0, 0, 69, 69);
  graphics.endFill();
  
  gameState = 'birdStart';
}

function update (){
  if (gameState == 'birdStart') {
    updateSidebar();
    currentBirdId = activeBirdIds[0];
    showBirdById(currentBirdId, {
      callback: function(){ 
        playSong(birdData[currentBirdId].notes);
      }
    });
    gameState = 'awaitingInput';
  }
}

var updateSidebar = function() {
  for (var i=0; i < sidebarItems.length; i++) {
    sidebarItems[i].button.destroy();
    sidebarItems[i].text.destroy();
  }
  sidebarItems = [];
  sidebarItems.push(makeSidebarItems(
    {y: 15, birdId: 0, text: 'Ruby-Throated\nSap-Sucker\n(Interval: Unison)'}));
}

var playSong = function(notes, opts) {
  game.add.audio(notes[0]).play();
  if (notes.length > 1) {
    setTimeout(function(){
      playSong(notes.slice(1), opts);
    }, 2000);
  }
};


var evaluateBirdButtonResponse = function(response) {
  if (response.birdId == currentBirdId) {
  } else {
    console.log('incorrect');
  }
}

function makeSidebarItems(opts) {
  var x = gameSize.w - rightSidebarSize.w + defaultTextPadding;
  var button = game.add.button(x, opts.y, 'button', onBirdButtonDown, this, 0, 1, 2);
  button.birdId = opts.birdId;
  button.scale.set(.5, 2);

  var buttonText = game.add.bitmapText(x, opts.y + 7, 'nokia', opts.text, 16);
  buttonText.x = x + button.width + defaultTextPadding;

  return {button: button, text: buttonText};
}

function onBirdButtonDown(birdButton) {
  birdButton.events.onInputDown.add(onBirdButtonDown, this);
  if (gameState != 'awaitingInput') {
    return;
  } else {
    evaluateBirdButtonResponse({birdId: birdButton.birdId});
    gameState = 'birdStart';
  }
}

function showBirdById(birdId, opts) {
 if (opts.callback) {
  opts.callback();
 }
}
