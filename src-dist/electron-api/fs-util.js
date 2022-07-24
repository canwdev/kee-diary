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
exports.readFileAsPlainText = exports.showSaveDialog = exports.showFileChooser = void 0;
var remote = require("@electron/remote");
var fs = require("fs");
// 打开文件选择器
function showFileChooser(config) {
    var _this = this;
    if (config === void 0) { config = {}; }
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var _a, filters, _b, sizeLimit, resOpen, files, allSize;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = config.filters, filters = _a === void 0 ? [] : _a, _b = config.sizeLimit, sizeLimit = _b === void 0 ? 0 : _b;
                    return [4 /*yield*/, remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
                            properties: ['openFile'],
                            filters: filters
                        })];
                case 1:
                    resOpen = _c.sent();
                    if (resOpen.canceled) {
                        return [2 /*return*/, resolve([])];
                    }
                    files = resOpen.filePaths;
                    if (!files) {
                        return [2 /*return*/, resolve([])];
                    }
                    if (sizeLimit > 0) {
                        allSize = files.reduce(function (pv, cv) {
                            return pv + fs.statSync(cv).size;
                        }, 0);
                        if (allSize > sizeLimit) {
                            throw new Error("File size cannot exceed ".concat((sizeLimit / 1024).toFixed(2), " KB, current size: ").concat((allSize / 1024).toFixed(2), " KB"));
                        }
                    }
                    return [2 /*return*/, resolve(files)];
            }
        });
    }); });
}
exports.showFileChooser = showFileChooser;
function showSaveDialog(text, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var title, defaultPath, buttonLabel, filters, saveRes, savePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    title = options.title, defaultPath = options.defaultPath, buttonLabel = options.buttonLabel, filters = options.filters;
                    return [4 /*yield*/, remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
                            title: title,
                            defaultPath: defaultPath,
                            buttonLabel: buttonLabel,
                            filters: filters
                        })];
                case 1:
                    saveRes = _a.sent();
                    if (saveRes.canceled) {
                        return [2 /*return*/, resolve(false)];
                    }
                    savePath = saveRes.filePath;
                    if (!savePath) {
                        return [2 /*return*/, reject(new Error('savePath is undefined'))];
                    }
                    fs.writeFile(savePath, text, {
                        encoding: 'utf-8'
                    }, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(true);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.showSaveDialog = showSaveDialog;
function readFileAsPlainText(path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}
exports.readFileAsPlainText = readFileAsPlainText;
//# sourceMappingURL=fs-util.js.map