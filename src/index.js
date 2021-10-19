// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const {app, BrowserWindow, session} = require('electron')
const path = require('path')
const url = require('url')
const windowStateKeeper = require('electron-window-state');
const {isDev} = require('./utils')
const {kInstance} = require('./keepass/api')

let mainWindow

function createMainWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 700
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 375,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      spellcheck: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
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

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  // 退出前询问
  mainWindow.on('close', (e) => {
    if (kInstance.isChanged) {
      console.log('prevent close')
      e.preventDefault() // Prevents the window from closing
      mainWindow.webContents.send('IPC_APP_CLOSING')
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // hide menu bar
  mainWindow.setMenuBarVisibility(false)

  mainWindowState.manage(mainWindow);
}

// Limit single app instance
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      // if (mainWindow.isMinimized()) mainWindow.restore()
      // mainWindow.focus()
      createMainWindow()
    }
  })

  app.whenReady().then(createMainWindow)

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', function () {
    if (mainWindow === null) createMainWindow()
  })

  if (isDev) {
    app.on('ready', async () => {
      // await session.defaultSession.loadExtension(path.join(__dirname, 'vue-devtools'))
      require('vue-devtools').install()
    })
  }
}

