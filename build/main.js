'use strict';

const path = require('path');
const electron = require('electron');
const Menu = electron.Menu;
const Tray = electron.Tray;

// Module to control application life.
var app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const appName = 'SGRQ';
var appIcon = path.join(__dirname, 'sgrq-icon.png');

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    center: true,
    title: appName,
    icon: appIcon 
  });

  // remove application menu
  mainWindow.setMenu(null);


  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html#/');

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // add Tray Menu
  appIcon = new Tray(appIcon);
  var contextMenu = Menu.buildFromTemplate([
    {
        label: appName,
        enabled: false
    },
    {
        label: 'Quit',
        accelerator: 'Command+Q',
        selector: 'terminate:'
    }
  ]);
  appIcon.setToolTip(appName);
  appIcon.setContextMenu(contextMenu);

  // application Menu on Mac
  if (process.platform == 'darwin') {
    var appMenu = [{
      label: appName,
      submenu: [
        {
          label: 'About ' + appName,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + appName,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        },
      ]
    }];

    let menu = Menu.buildFromTemplate(appMenu);
    Menu.setApplicationMenu(menu);
  }


  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
