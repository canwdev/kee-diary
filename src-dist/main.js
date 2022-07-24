"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
var electron_1 = require("electron");
require('@electron/remote/main').initialize();
var path = require("path");
var url = require("url");
var index_1 = require("./utils/index");
// const {kInstance} = require('./keepass/api')
var wm_instance_1 = require("./utils/wm-instance");
var mainWindow;
function createMainWindow() {
    // and load the index.html of the app.
    // mainWindow.loadFile('src/index.html')
    var startUrl = process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '/../frontend-dist/index.html'),
            protocol: 'file:',
            slashes: true
        });
    // mainWindow.loadURL(startUrl);
    mainWindow = wm_instance_1["default"].createWindow({
        width: 1000,
        height: 700,
        minWidth: 375,
        minHeight: 100,
        icon: path.join(__dirname, '../build/256x256.png'),
        // frame: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            // enableRemoteModule: true,
            webSecurity: false,
            spellcheck: false
        },
        customConfig: {
            isOpenDevTools: false,
            saveWindowStateName: 'mainWindow',
            isCloseHide: false
        }
    }, startUrl);
    require('@electron/remote/main').enable(mainWindow.webContents);
    // Hide macOS traffic lights
    // mainWindow.setWindowButtonVisibility(false)
    // 退出前询问
    mainWindow.on('close', function (e) {
        // if (kInstance.isChanged) {
        //   console.log('prevent close')
        //   e.preventDefault() // Prevents the window from closing
        //   mainWindow.webContents.send('IPC_APP_CLOSING')
        // }
    });
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // if (kInstance) {
        //   kInstance.close()
        // }
        mainWindow = null;
    });
    // hide menu bar
    mainWindow.setMenuBarVisibility(false);
}
// Limit single app instance
var gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    electron_1.app.quit();
}
else {
    electron_1.app.on('second-instance', function () {
        if (mainWindow) {
            // if (mainWindow.isMinimized()) mainWindow.restore()
            // mainWindow.focus()
            createMainWindow();
        }
    });
    electron_1.app.whenReady().then(createMainWindow);
    electron_1.app.on('window-all-closed', function () {
        if (process.platform !== 'darwin')
            electron_1.app.quit();
    });
    electron_1.app.on('activate', function () {
        if (mainWindow === null)
            createMainWindow();
    });
    if (index_1.isDev) {
        electron_1.app.on('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // await session.defaultSession.loadExtension(path.join(__dirname, 'vue-devtools'))
                require('vue-devtools').install();
                return [2 /*return*/];
            });
        }); });
    }
}
//# sourceMappingURL=main.js.map