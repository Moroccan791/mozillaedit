// Minimal CSInterface for CEP panels.
// Talks to window.__adobe_cep__ (provided by the host) to eval ExtendScript.
(function (global) {
    "use strict";

    function CSInterface() {}

    CSInterface.prototype.getHostEnvironment = function () {
        if (!global.__adobe_cep__) return {};
        try {
            return JSON.parse(global.__adobe_cep__.getHostEnvironment());
        } catch (e) {
            return {};
        }
    };

    // Async: callback receives the string returned by the ExtendScript.
    CSInterface.prototype.evalScript = function (script, callback) {
        if (!script) return;
        if (!global.__adobe_cep__) {
            if (callback) callback("__no_cep__");
            return;
        }
        global.__adobe_cep__.evalScript(script, function (res) {
            if (callback) callback(res);
        });
    };

    // Promise wrapper for convenience.
    CSInterface.prototype.evalScriptP = function (script) {
        var self = this;
        return new Promise(function (resolve) {
            self.evalScript(script, resolve);
        });
    };

    CSInterface.prototype.getSystemPath = function (pathType) {
        var path = "";
        if (global.__adobe_cep__) {
            path = global.__adobe_cep__.getSystemPath(pathType);
        }
        return path;
    };

    CSInterface.prototype.closeExtension = function () {
        if (global.__adobe_cep__) {
            global.__adobe_cep__.closeExtension();
        }
    };

    global.CSInterface = CSInterface;
    global.SystemPath = {
        USER_DATA: "userData",
        COMMON_FILES: "commonFiles",
        MY_DOCUMENTS: "myDocuments",
        APPLICATION: "application",
        EXTENSION: "extension",
        HOST_APPLICATION: "hostApplication"
    };
})(window);
