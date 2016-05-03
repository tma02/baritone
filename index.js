var menubar = require('menubar');
var mb = menubar();
mb.setOption('preload-window', true);
mb.setOption('height', 464);

var spotify = require('./spotify.js');

const ipcMain = require('electron').ipcMain;

mb.on('ready', function ready() {
  console.log('app is ready');
  spotify.init();
});

mb.on('after-create-window', function() {
  spotify.setWindow(mb.window);
});

ipcMain.on('seek', function(event, percent) {
  spotify.seek(percent);
});

ipcMain.on('playpause', function(event, data) {
  spotify.playpause();
});

ipcMain.on('skip', function(event, data) {
  spotify.skip(data);
});

ipcMain.on('shuffle', function(event, data) {
  spotify.shuffle(data);
});