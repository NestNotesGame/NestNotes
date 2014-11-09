var gameState = null;
var currentBirdId;
var gameSize = {w: 800, h: 600};
var treeSize = {w: 300, h: 300};
var treePos = {x: 200, y: 50};

var rightSidebarSize = {w: 250, h: gameSize.h};

var defaultTextPadding = 10;
var smokeyPosition = {x: 0, y: 0};
var smokeyVisible = false;
var birdSize = {w: 103, h: 103};
var birdY = treePos.y + treeSize.h * .25;
var birdLeftPos = {x: treePos.x + (.50 * treeSize.w) - (.5*birdSize.w), y: birdY - 25};
var birdRightPos = {x: treePos.x + (.25 * treeSize.w) - (.5*birdSize.w), y: birdY};
var correctBirdCount = 0;

var smokey;
var smokeySize = {w: 150, h: 250};
var smokeyText;
var songWaitDelay = 1.5;

var noteIds = ['C', 'D', 'E', 'F', 'G', 'A'];

var birdData = {
  'unison': {id: 'unison', notes: ['C', 'C'], label: 'Ruby-throated\ngarlic sucker'},
  'M2': {id: 'M2', notes: ['C', 'D'], label: 'Peruvian\n Squash Pecker'},
}

var levels = [
  {
    id: 0,
    numTests: 2,
    smokeyMessage: "Welcome aboard, rookie!\n" +
      "Your first assignment is to identify the Ruby-Throated garlic sucker.\n" + 
      "It sings a unison interval.",
    activeBirdIds: ['unison']
  },
  {
    id: 0,
    numTests: 5,
    smokeyMessage: "Now get ready for a challenge.\n" +
      "A flock of Peruvian Squash Peckers has been spotted nearby.\n" + 
      "They sing in major seconds.",
    activeBirdIds: ['unison', 'M2']
  }
];
var currentLevelIdx;
var currentLevel;

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'contentBox', { preload: preload, create: create, update: update});

var sidebarItems = [];
var audio = {};
var cropRect;

var activeBirds = [];
var birdSprite;
var birdHover = false;

function preload () {
  game.load.image('tree', 'assets/tree_450x450.png');
  game.load.image('bird1', 'assets/bird1_160x160.png');
  game.load.image('bird2', 'assets/bird2_160x160.png');
  game.load.image('bg', 'assets/bg.png');
  game.load.image('smokey', 'assets/smokey_64x64.png');

  // Load notes
  for (var i=0; i < noteIds.length; i++) {
    var noteId = noteIds[i];
    game.load.audio(noteId, 'assets/' + noteId + '.mp3');
  }
  game.load.bitmapFont('nokia', 'assets/bitmapFonts/nokia16black.png', 'assets/bitmapFonts/nokia16black.xml');
  game.load.spritesheet('button', 'assets/buttons/flixel-button.png', 80, 20);
}

function create () {

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
  
  birdSprite = game.add.sprite(birdLeftPos.x, birdLeftPos.y, 'bird1');
  cropRect = new Phaser.Rectangle(0,0,160,110);
  birdSprite.cropRect = cropRect;
  birdSprite.updateCrop();
  birdSprite.scale.setTo(.67, .67);

  // Draw right sidebar.
  graphics = game.add.graphics(0, 0);
  graphics.beginFill(0xFFFFFF);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(gameSize.w - rightSidebarSize.w, 0, rightSidebarSize.w, rightSidebarSize.h);
  
  // Underline current bird
  graphics = game.add.graphics(0, 0);
  graphics.beginFill(0x009626);
  graphics.lineStyle(1, 0x006626, 0);
  graphics.drawRect(birdSprite.x+9, birdSprite.y+birdSprite.height, birdSprite.width-27, 9);
  graphics.endFill();
  
  // Outer Smokey box
  graphics = game.add.graphics(smokeyPosition.x, smokeyPosition.y);
  graphics.beginFill(0xFFCA22);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(0, 0, smokeySize.w, smokeySize.h);
  graphics.endFill();
  // Inner Smokey box
  graphics = game.add.graphics(smokeyPosition.x+5, smokeyPosition.y+5);
  graphics.beginFill(0xC5850A);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(0, 0, 140, smokeySize.h - 10);
  graphics.endFill();
  // Smokey outline - outer
  graphics = game.add.graphics(smokeyPosition.x, smokeyPosition.y);
  graphics.beginFill(0x0000CC);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(0, 0, 69, 69);
  graphics.endFill();
  // Smokey outline - outer
  graphics = game.add.graphics(smokeyPosition.x+5, smokeyPosition.y+5);
  graphics.beginFill(0x653512);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(0, 0, 59, 59);
  graphics.endFill();
  // Smokey
  smokey = game.add.sprite(smokeyPosition.x+2, smokeyPosition.y, 'smokey');
  
  currentLevelIdx = 0;
  gameState = 'levelStart';
}

function update (){
  if (gameState == 'win') {
    updateSmokey({text: 'Congratulations!\nYou are now a master bird ranger!'});
    game.paused = true;
  }
  else if (gameState == 'levelStart') {
    currentLevel = levels[currentLevelIdx];
    updateSidebar();
    updateSmokey({text: currentLevel.smokeyMessage});
    gameState = 'birdStart';
  }
  else if (gameState == 'birdStart') {
    var activeBirdIds = currentLevel.activeBirdIds;
    // Select random bird id from current active birds.
    currentBirdId = activeBirdIds[Math.floor(Math.random() * activeBirdIds.length)];
    showBirdById(currentBirdId, {
      callback: function(){ 
        playSong(birdData[currentBirdId].notes);
      }
    });
	birdSprite.crop(cropRect);
    gameState = 'awaitingInput';
  }
}

var updateSmokey = function(opts) {
  if (smokeyText) {
    smokeyText.destroy();
  }
  var style = { font: "14px Arial", fill: "#333333", align: "left" };
  smokeyText = game.add.text(
    smokeyPosition.x + defaultTextPadding, smokeyPosition.y + smokey.height + defaultTextPadding, opts.text, style);
  smokeyText.wordWrap = true;
  smokeyText.wordWrapWidth = smokeySize.w - (2*defaultTextPadding);
};

var updateSidebar = function() {
  for (var i=0; i < sidebarItems.length; i++) {
    sidebarItems[i].button.destroy();
    sidebarItems[i].text.destroy();
  }
  sidebarItems = [];
  var previousY = 0;
  for (var i=0; i < currentLevel.activeBirdIds.length; i++) {
    var currentY = previousY + defaultTextPadding;
    var birdId = currentLevel.activeBirdIds[i];
    var sidebarItem = makeSidebarItems({y: currentY, birdId: birdId});
    sidebarItems.push(sidebarItem);
    previousY = currentY + sidebarItem.text.height;
  }
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
  console.log("response: ", response, "cbid: ", currentBirdId);
  if (response.birdId == currentBirdId) {
    correctBirdCount++;
    updateSmokey({text: 'Correct!'});
  } else {
    updateSmokey({text: 'Nope! Try again rookie...'});
  }
}

function makeSidebarItems(opts) {
  var x = gameSize.w - rightSidebarSize.w + defaultTextPadding;
  var button = game.add.button(x, opts.y, 'button', onBirdButtonDown, this, 0, 1, 2);
  button.birdId = opts.birdId;
  button.scale.set(1, 2);
  var birdText = birdData[opts.birdId].label;

  var buttonText = game.add.bitmapText(x, opts.y + 7, 'nokia', birdText, 16);
  buttonText.x = x + button.width + defaultTextPadding;

  return {button: button, text: buttonText};
}

function onBirdButtonDown(birdButton) {
  birdButton.events.onInputDown.add(onBirdButtonDown, this);
  if (gameState != 'awaitingInput') {
    return;
  } else {
    evaluateBirdButtonResponse({birdId: birdButton.birdId});
    hideBird({callback: function(){
      setTimeout(function() {
        if (correctBirdCount >= currentLevel.numTests) {
          currentLevelIdx += 1;

          if (currentLevelIdx >= levels.length) {
            gameState = 'win';
            return;
          }

          correctBirdCount = 0;
          gameState = 'levelStart';
        } else {
          gameState = 'birdStart';
        }
      }, 1000);
    }});
  }
}

function showBirdById(birdId, opts) {
  var tween = game.add.tween(birdSprite).to({ alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
  if (opts.callback) {
    tween.onComplete.add(opts.callback, this);
  }
}

function iterateUntilCropHeight(h){
  birdSprite.cropRect = cropRect;
  birdSprite.updateCrop();
  if(cropRect.height != h)
	iterateUntilCropHeight(h);
}

function hideBird(opts) {
  var tween = game.add.tween(birdSprite).to({ alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
  if (opts.callback) {
    tween.onComplete.add(opts.callback, this);
  }
}

function hoverOverBird(){
	birdHover = true;
}
