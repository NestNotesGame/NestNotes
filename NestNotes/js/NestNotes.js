var game = new Phaser.Game(800, 600, Phaser.AUTO, 'contentBox', { preload: preload, create: create});

function preload () {
  game.load.image('background', 'assets/bg.png');
  game.load.image('tree', 'assets/tree.png');
  game.load.image('playerI1', 'assets/playerI1.png');

  game.load.audio('sfx', 'assets/A.mp3');

}

function create () {
  game.add.sprite(0, 0, 'background');
  game.add.sprite(0, 0, 'tree');
  game.add.sprite(0, 0, 'playerI1');

  audio = game.add.audio('sfx');
  audio.addMarker('note', 1, 1.0);


  // Draw sidebar.
  var graphics = game.add.graphics(0, 0);
  graphics.beginFill(0xFFFFFF);
  graphics.lineStyle(1, 0xffffff, 0);
  graphics.drawRect(600, 0, 200, 600);

  // Draw sidebar text.
  var text = game.add.text(615, 15, "Ruby-throated Sap Sucker",
  { font: "12px Arial", fill: "#ff0044", align: "left" });
  text.inputEnabled = true;
  text.events.onInputDown.add(down, this);
  text.events.onInputUp.add(up, this);

  var soundLink = game.add.text(615, 30, "Play Song",
  { font: "12px Arial", fill: "#ff0044", align: "left" });
  soundLink.inputEnabled = true;
  soundLink.events.onInputDown.add(playSound, this);
}

function down(item) {
  console.log("down");
}

function up(item) {
  console.log("up");
}

function playSound(item) {
	audio.play('note');
}

