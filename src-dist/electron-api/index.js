"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var fsUtil = require("./fs-util");
var wm_preload_1 = require("./wm-preload");
var ipcHelper = require("@canwdev/electron-utils/ipc/ipc-helper-render");
exports["default"] = __assign(__assign(__assign({}, fsUtil), ipcHelper), wm_preload_1.wmUtils);
//# sourceMappingURL=index.js.map