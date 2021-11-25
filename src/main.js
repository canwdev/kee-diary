// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const {app} = require('electron')
require('@electron/remote/main').initialize()
const path = require('path')
const url = require('url')
const {isDev} = require('./utils')
const {kInstance} = require('./keepass/api')
const wm = require('./utils/wm-instance')
const settingsEnum = require('./electron-api/settings-helper/ipc')
const settings = require('electron-settings')

let mainWindow

function createMainWindow() {
  // and load the index.html of the app.
  // mainWindow.loadFile('src/index.html')
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../dist-frontend/index.html'),
    protocol: 'file:',
    slashes: true
  });
  // mainWindow.loadURL(startUrl);

  const bordered = settings.getSync(settingsEnum.keyBordered)
  const windowFrameConfig = bordered ? {} : {
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    trafficLightPosition: { x: 15, y: 15.5 },
  }
  let transparent = false
  if (!bordered) {
    transparent = settings.getSync(settingsEnum.keyWindowTransparent) || false
  }

  mainWindow = wm.createWindow({
      width: 1000,
      height: 700,
      minWidth: 375,
      minHeight: 375,
      icon: path.join(__dirname, '../build/256x256.png'),
      // frame: true,
      transparent: transparent,
      ...windowFrameConfig,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        // enableRemoteModule: true,
        webSecurity: false,
        spellcheck: false,
      },
      customConfig: {
        isOpenDevTools: false, //isDev,
        saveWindowStateName: 'mainWindow',
        isCloseHide: false
      }
    },
    startUrl
  )
  require("@electron/remote/main").enable(mainWindow.webContents);

  // Hide macOS traffic lights
  // mainWindow.setWindowButtonVisibility(false)

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
    if (kInstance) {
      kInstance.close()
    }
    mainWindow = null
  })

  // hide menu bar
  mainWindow.setMenuBarVisibility(false)

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

