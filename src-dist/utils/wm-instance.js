"use strict";
exports.__esModule = true;
// 全局唯一实例
var path = require("path");
var WindowManager = require("@canwdev/electron-window-manager");
var wm = new WindowManager({
    preloadDir: path.join(__dirname, '../'),
    isDebug: true
});
exports["default"] = wm;
//# sourceMappingURL=wm-instance.js.map