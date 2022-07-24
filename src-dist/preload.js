"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var electron_api_1 = require("./electron-api");
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', function () {
//     window.electronAPI = new electronAPI()
// })
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electronAPI', electron_api_1["default"]);
//# sourceMappingURL=preload.js.map