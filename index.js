const menubar = require('menubar');
const electron = require('electron');
const AutoLaunch = require('auto-launch');

const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const mb = menubar();

mb.setOption('preload-window', true);
mb.setOption('height', 464);

const spotify = require('./spotify.js');

const ipcMain = require('electron').ipcMain;

let settingsWindow;

var appLauncher = new AutoLaunch({
  name: 'spotifymenubar'
});

const contextMenu = Menu.buildFromTemplate([
  { label: 'Baritone', enabled: false },
  //{ label: 'Settings', click: function() { openSettings(); } },
  { label: 'Launch on Login', type: 'checkbox', checked: false, click: function(item) {
    appLauncher.isEnabled().then(function(enabled) {
      if (enabled) {
        return appLauncher.disable().then(function() {
          item.checked = false;
        });
      }
      else {
        return appLauncher.enable().then(function() {
          item.checked = true;
        });
      }
    });
  } },
  { type: 'separator' },
  { label: 'Quit Baritone', click: function() { mb.app.quit(); } }
]);

appLauncher.isEnabled().then(function(enabled) {
  contextMenu.items[1].checked = enabled;
});

function openSettings() {
  settingsWindow = new BrowserWindow({width: 400, height: 500});
  settingsWindow.on('closed', function () {
    settingsWindow = null;
  });
}

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