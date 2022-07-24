var _a = require('electron'), shell = _a.shell, remote = _a.remote;
var fetch = require('node-fetch');
var os = require('os');
var checkUrl = 'http://developers.google.cn/generate_204';
var checkUrlOrigin = 'http://developers.google.cn';
var checkConnectivity = function () {
    return new Promise(function (resolve) {
        fetch(checkUrl, {
            headers: { Origin: checkUrlOrigin }
        })
            .then(function () {
            resolve(true);
        })["catch"](function () {
            resolve(false);
        });
    });
};
function alert(message) {
    remote.dialog.showMessageBoxSync(remote.getCurrentWindow(), {
        type: 'warning',
        message: message
    });
}
function showErrorBox(title, message) {
    remote.dialog.showMessageBoxSync(remote.getCurrentWindow(), {
        type: 'error',
        title: title,
        message: message
    });
}
module.exports = {
    openExternal: shell.openExternal,
    checkConnectivity: checkConnectivity,
    alert: alert,
    showErrorBox: showErrorBox,
    require: require
};
//# sourceMappingURL=util.js.map