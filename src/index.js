// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
// Modules to control application life and create native browser window
const {app, BrowserWindow, session} = require('electron')
const path = require('path')
const url = require('url')
const isDev = isElectionDevMode()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  console.log('createWindow')

  // 自定义菜单
  // require('./electron/menu')

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      spellcheck: false,
      enableRemoteModule: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron', 'preload.js')
    },
    icon: path.join(__dirname, '../build/256x256.png')
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('src/index.html')
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../dist-frontend/index.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(startUrl);

  // 退出前询问
  app.showExitPrompt = false
  mainWindow.on('close', (e) => {
    if (app.showExitPrompt) {
      console.log('prevent close')
      e.preventDefault() // Prevents the window from closing
      mainWindow.webContents.send('app-closing')
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // hide menu bar
  mainWindow.setMenuBarVisibility(false)
}

// 限制 APP 单实例
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
  })

  if (isDev) {
    app.on('ready', async () => {
      await session.defaultSession.loadExtension(path.join(__dirname, 'vue-devtools'))
      // Note that in order to use the React DevTools extension, you'll need to
      // download and unzip a copy of the extension.
    })
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function isElectionDevMode() {
  const electron = require('electron');

  const app = electron.app || electron.remote.app;

  const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
  const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

  return isEnvSet ? getFromEnv : !app.isPackaged;
}
