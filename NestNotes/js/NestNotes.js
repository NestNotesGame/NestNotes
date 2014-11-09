var gameState = null;
var currentBirdId = 0;
var gameSize = {w: 800, h: 600};
var treeSize = {w: 300, h: 300};
var treePos = {x: 200, y: 50};

var rightSidebarSize = {w: 250, h: gameSize.h};

var defaultTextPadding = 10;

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

  var tree = game.add.sprite(treePos.x, treePos.y, 'tree');
  tree.scale.setTo(.67, .67);
  
  var bird = game.add.sprite(birdLeftPos.x, birdLeftPos.y, 'bird1');
  bird.scale.setTo(.67, .67);

  // Draw right sidebar.
  var graphics = game.add.graphics(0, 0);
  graphics.beginFill(0xFFFFFF);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(gameSize.w - rightSidebarSize.w, 0, rightSidebarSize.w, rightSidebarSize.h);

  // Draw initial sidebar buttons.
  gameState = 'birdStart';
}

function update (){
  if (gameState == 'birdStart') {
    updateSidebar();
    currentBirdId = activeBirdIds[0];
    playSong(birdData[currentBirdId].notes);
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


function playSound(item) {
	audio.play('note', 0, 2.5);
}

