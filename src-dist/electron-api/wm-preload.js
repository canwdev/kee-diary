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
exports.wmUtils = void 0;
var electron_1 = require("electron");
var remote = require("@electron/remote");
var Channels = require("@canwdev/electron-window-manager/channels");
exports.wmUtils = {
    // 创建窗口
    wmCreateWindow: function (config, url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke(Channels.CREATE_WINDOW, config, url)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    // 向窗口发送消息
    wmSendMessage: function (windowId, message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke(Channels.SEND_MESSAGE, windowId, message)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    // 向所有窗口发送广播消息
    wmSendBroadcastMessage: function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke(Channels.SEND_BROADCAST_MESSAGE, message)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    // 获取所有窗口ids
    wmGetWindowIds: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke(Channels.GET_WINDOW_IDS)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    wmWindowAction: function (windowId, action, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke(Channels.WINDOW_ACTION, windowId, action, params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    wmGetState: function () {
        return electron_1.ipcRenderer.invoke(Channels.GET_STATE);
    },
    wmSetState: function (state) {
        return electron_1.ipcRenderer.invoke(Channels.SET_STATE, state);
    },
    wmUpdateState: function (path, value) {
        return electron_1.ipcRenderer.invoke(Channels.UPDATE_STATE, path, value);
    },
    /**
     * 监听消息更新事件
     * @param channel
     * @param listener 回调函数
     */
    onChannelMessage: function (channel, listener) {
        if (channel === void 0) { channel = Channels.UPDATE_MESSAGE; }
        electron_1.ipcRenderer.on(channel, listener);
    },
    offChannelMessage: function (channel, listener) {
        if (channel === void 0) { channel = Channels.UPDATE_MESSAGE; }
        electron_1.ipcRenderer.off(channel, listener);
    },
    /**
     * 监听窗口变化事件
     * @param listener 回调函数
     */
    onUpdateWindowIds: function (listener) {
        electron_1.ipcRenderer.on(Channels.UPDATE_WINDOW_IDS, listener);
    },
    // 当前窗口事件监听
    windowEventListener: function (name, callback) {
        remote.getCurrentWindow().on(name, callback);
    },
    // 当前窗口事件取消监听
    windowEventListenerOff: function (name, callback) {
        remote.getCurrentWindow().off(name, callback);
    },
    // 窗口最小化
    minWindow: function () {
        remote.getCurrentWindow().minimize();
    },
    // 获取 isMaximized
    getIsMaximized: function () {
        return remote.getCurrentWindow().isMaximized();
    },
    // 获取 isResizable
    getIsResizable: function () {
        return remote.getCurrentWindow().isResizable();
    },
    getWindowId: function () {
        return remote.getCurrentWindow().id;
    },
    // 窗口最大化
    maxWindow: function (isMaxed) {
        var browserWindow = remote.getCurrentWindow();
        if (!isMaxed) {
            browserWindow.unmaximize();
        }
        else {
            browserWindow.maximize();
        }
    },
    // 窗口关闭
    closeWindow: function () {
        remote.getCurrentWindow().close();
    },
    // 窗口隐藏
    hideWindow: function () {
        remote.getCurrentWindow().hide();
    },
    // 窗口显示
    showWindow: function () {
        remote.getCurrentWindow().show();
    }
};
//# sourceMappingURL=wm-preload.js.map