const menubar = require('menubar');
const electron = require('electron');
const Menu = electron.Menu;
const mb = menubar();

mb.setOption('preload-window', true);
mb.setOption('height', 464);

const spotify = require('./spotify.js');

const ipcMain = require('electron').ipcMain;

const contextMenu = Menu.buildFromTemplate([
  { label: 'spotify-menubar', enabled: false },
  //{ label: 'Settings', click: function() { /*TODO*/ } },
  { type: 'separator' },
  { label: 'Quit', click: function() { mb.app.quit(); } }
]);

mb.on('ready', function ready() {
  console.log('app is ready');
  spotify.init();
  mb.tray.on('right-click', function() {
    mb.tray.popUpContextMenu(contextMenu);
  });
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

ipcMain.on('repeat', function(event, data) {
  spotify.repeat(data);
});