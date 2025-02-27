/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/preload.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/preload.ts":
/*!************************!*\
  !*** ./src/preload.ts ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderer */ "./src/renderer/index.ts");
 // Only load within extension page context

if (location.href.startsWith('chrome-extension://')) {
  Object(_renderer__WEBPACK_IMPORTED_MODULE_0__["injectExtensionAPIs"])();
}

/***/ }),

/***/ "./src/renderer/event.ts":
/*!*******************************!*\
  !*** ./src/renderer/event.ts ***!
  \*******************************/
/*! exports provided: addExtensionListener, removeExtensionListener */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addExtensionListener", function() { return addExtensionListener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeExtensionListener", function() { return removeExtensionListener; });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);


const formatIpcName = name => `crx-${name}`;

const listenerMap = new Map();
const addExtensionListener = (extensionId, name, callback) => {
  const listenerCount = listenerMap.get(name) || 0;

  if (listenerCount === 0) {
    // TODO: should these IPCs be batched in a microtask?
    electron__WEBPACK_IMPORTED_MODULE_0__["ipcRenderer"].send('crx-add-listener', extensionId, name);
  }

  listenerMap.set(name, listenerCount + 1);
  electron__WEBPACK_IMPORTED_MODULE_0__["ipcRenderer"].addListener(formatIpcName(name), function (event, ...args) {
    if (true) {
      console.log(name, '(result)', ...args);
    }

    callback(...args);
  });
};
const removeExtensionListener = (extensionId, name, callback) => {
  if (listenerMap.has(name)) {
    const listenerCount = listenerMap.get(name) || 0;

    if (listenerCount <= 1) {
      listenerMap.delete(name);
      electron__WEBPACK_IMPORTED_MODULE_0__["ipcRenderer"].send('crx-remove-listener', extensionId, name);
    } else {
      listenerMap.set(name, listenerCount - 1);
    }
  }

  electron__WEBPACK_IMPORTED_MODULE_0__["ipcRenderer"].removeListener(formatIpcName(name), callback);
};

/***/ }),

/***/ "./src/renderer/index.ts":
/*!*******************************!*\
  !*** ./src/renderer/index.ts ***!
  \*******************************/
/*! exports provided: injectExtensionAPIs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "injectExtensionAPIs", function() { return injectExtensionAPIs; });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event */ "./src/renderer/event.ts");


const injectExtensionAPIs = () => {
  const invokeExtension = async function (extensionId, fnName, options = {}, ...args) {
    const callback = typeof args[args.length - 1] === 'function' ? args.pop() : undefined;

    if (true) {
      console.log(fnName, args);
    }

    if (options.noop) {
      console.warn(`${fnName} is not yet implemented.`);
      if (callback) callback();
      return;
    }

    if (options.serialize) {
      args = options.serialize(...args);
    }

    let result;

    try {
      result = await electron__WEBPACK_IMPORTED_MODULE_0__["ipcRenderer"].invoke('crx-msg', extensionId, fnName, ...args);
    } catch (e) {
      // TODO: Set chrome.runtime.lastError?
      console.error(e);
      result = undefined;
    }

    if (true) {
      console.log(fnName, '(result)', result);
    }

    if (callback) {
      callback(result);
    } else {
      return result;
    }
  };

  const electronContext = {
    invokeExtension,
    addExtensionListener: _event__WEBPACK_IMPORTED_MODULE_1__["addExtensionListener"],
    removeExtensionListener: _event__WEBPACK_IMPORTED_MODULE_1__["removeExtensionListener"]
  }; // Function body to run in the main world.
  // IMPORTANT: This must be self-contained, no closure variable will be included!

  function mainWorldScript() {
    var _chrome$runtime;

    // Use context bridge API or closure variable when context isolation is disabled.
    const electron = window.electron || electronContext;
    const chrome = window.chrome || {};
    const extensionId = (_chrome$runtime = chrome.runtime) === null || _chrome$runtime === void 0 ? void 0 : _chrome$runtime.id; // NOTE: This uses a synchronous IPC to get the extension manifest.
    // To avoid this, JS bindings for RendererExtensionRegistry would be
    // required.

    const manifest = extensionId && chrome.runtime.getManifest() || {};

    const invokeExtension = (fnName, opts = {}) => (...args) => electron.invokeExtension(extensionId, fnName, opts, ...args);

    function imageData2base64(imageData) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    }

    class ExtensionEvent {
      constructor(name) {
        this.name = name;
      }

      addListener(callback) {
        electron.addExtensionListener(extensionId, this.name, callback);
      }

      removeListener(callback) {
        electron.removeExtensionListener(extensionId, this.name, callback);
      }

      getRules(ruleIdentifiers, callback) {
        throw new Error('Method not implemented.');
      }

      hasListener(callback) {
        throw new Error('Method not implemented.');
      }

      removeRules(ruleIdentifiers, callback) {
        throw new Error('Method not implemented.');
      }

      addRules(rules, callback) {
        throw new Error('Method not implemented.');
      }

      hasListeners() {
        throw new Error('Method not implemented.');
      }

    }

    class ChromeSetting {
      set() {}

      get() {}

      clear() {} // onChange: chrome.types.ChromeSettingChangedEvent


    }

    /**
     * Factories for each additional chrome.* API.
     */
    const apiDefinitions = {
      browserAction: {
        shouldInject: () => !!manifest.browser_action,
        factory: base => {
          const api = { ...base,
            setTitle: invokeExtension('browserAction.setTitle'),
            getTitle: invokeExtension('browserAction.getTitle'),
            setIcon: invokeExtension('browserAction.setIcon', {
              serialize: details => {
                if (details.imageData) {
                  if (details.imageData instanceof ImageData) {
                    details.imageData = imageData2base64(details.imageData);
                  } else {
                    details.imageData = Object.entries(details.imageData).reduce((obj, pair) => {
                      obj[pair[0]] = imageData2base64(pair[1]);
                      return obj;
                    }, {});
                  }
                }

                return [details];
              }
            }),
            setPopup: invokeExtension('browserAction.setPopup'),
            getPopup: invokeExtension('browserAction.getPopup'),
            setBadgeText: invokeExtension('browserAction.setBadgeText'),
            getBadgeText: invokeExtension('browserAction.getBadgeText'),
            setBadgeBackgroundColor: invokeExtension('browserAction.setBadgeBackgroundColor'),
            getBadgeBackgroundColor: invokeExtension('browserAction.getBadgeBackgroundColor'),
            enable: invokeExtension('browserAction.enable', {
              noop: true
            }),
            disable: invokeExtension('browserAction.disable', {
              noop: true
            }),
            onClicked: new ExtensionEvent('browserAction.onClicked')
          };
          return api;
        }
      },
      commands: {
        factory: base => {
          return { ...base,
            getAll: invokeExtension('commands.getAll'),
            onCommand: new ExtensionEvent('commands.onCommand')
          };
        }
      },
      contextMenus: {
        factory: base => {
          let menuCounter = 0;
          const menuCallbacks = {};
          const menuCreate = invokeExtension('contextMenus.create');
          let hasInternalListener = false;

          const addInternalListener = () => {
            api.onClicked.addListener((info, tab) => {
              const callback = menuCallbacks[info.menuItemId];
              if (callback && tab) callback(info, tab);
            });
            hasInternalListener = true;
          };

          const api = { ...base,
            create: function (createProperties, callback) {
              if (typeof createProperties.id === 'undefined') {
                createProperties.id = `${++menuCounter}`;
              }

              if (createProperties.onclick) {
                if (!hasInternalListener) addInternalListener();
                menuCallbacks[createProperties.id] = createProperties.onclick;
                delete createProperties.onclick;
              }

              menuCreate(createProperties, callback);
              return createProperties.id;
            },
            update: invokeExtension('contextMenus.update', {
              noop: true
            }),
            remove: invokeExtension('contextMenus.remove'),
            removeAll: invokeExtension('contextMenus.removeAll'),
            onClicked: new ExtensionEvent('contextMenus.onClicked')
          };
          return api;
        }
      },
      cookies: {
        factory: base => {
          return { ...base,
            get: invokeExtension('cookies.get'),
            getAll: invokeExtension('cookies.getAll'),
            set: invokeExtension('cookies.set'),
            remove: invokeExtension('cookies.remove'),
            getAllCookieStores: invokeExtension('cookies.getAllCookieStores'),
            onChanged: new ExtensionEvent('cookies.onChanged')
          };
        }
      },
      extension: {
        factory: base => {
          return { ...base,
            isAllowedIncognitoAccess: () => false
          };
        }
      },
      notifications: {
        factory: base => {
          return { ...base,
            clear: invokeExtension('notifications.clear'),
            create: invokeExtension('notifications.create'),
            getAll: invokeExtension('notifications.getAll'),
            getPermissionLevel: invokeExtension('notifications.getPermissionLevel'),
            update: invokeExtension('notifications.update'),
            onClicked: new ExtensionEvent('notifications.onClicked'),
            onButtonClicked: new ExtensionEvent('notifications.onButtonClicked'),
            onClosed: new ExtensionEvent('notifications.onClosed')
          };
        }
      },
      privacy: {
        factory: base => {
          return { ...base,
            network: {
              networkPredictionEnabled: new ChromeSetting(),
              webRTCIPHandlingPolicy: new ChromeSetting()
            },
            websites: {
              hyperlinkAuditingEnabled: new ChromeSetting()
            }
          };
        }
      },
      runtime: {
        factory: base => {
          return { ...base,
            openOptionsPage: invokeExtension('runtime.openOptionsPage')
          };
        }
      },
      storage: {
        factory: base => {
          const local = base && base.local;
          return { ...base,
            // TODO: provide a backend for browsers to opt-in to
            managed: local,
            sync: local
          };
        }
      },
      tabs: {
        factory: base => {
          const api = { ...base,
            create: invokeExtension('tabs.create'),
            executeScript: function (arg1, arg2, arg3) {
              // Electron's implementation of chrome.tabs.executeScript is in
              // C++, but it doesn't support implicit execution in the active
              // tab. To handle this, we need to get the active tab ID and
              // pass it into the C++ implementation ourselves.
              if (typeof arg1 === 'object') {
                api.query({
                  active: true,
                  windowId: chrome.windows.WINDOW_ID_CURRENT
                }, ([activeTab]) => {
                  api.executeScript(activeTab.id, arg1, arg2);
                });
              } else {
                ;
                base.executeScript(arg1, arg2, arg3);
              }
            },
            get: invokeExtension('tabs.get'),
            getCurrent: invokeExtension('tabs.getCurrent'),
            getAllInWindow: invokeExtension('tabs.getAllInWindow'),
            insertCSS: invokeExtension('tabs.insertCSS'),
            query: invokeExtension('tabs.query'),
            reload: invokeExtension('tabs.reload'),
            update: invokeExtension('tabs.update'),
            remove: invokeExtension('tabs.remove'),
            goBack: invokeExtension('tabs.goBack'),
            goForward: invokeExtension('tabs.goForward'),
            onCreated: new ExtensionEvent('tabs.onCreated'),
            onRemoved: new ExtensionEvent('tabs.onRemoved'),
            onUpdated: new ExtensionEvent('tabs.onUpdated'),
            onActivated: new ExtensionEvent('tabs.onActivated')
          };
          return api;
        }
      },
      webNavigation: {
        factory: base => {
          return { ...base,
            getFrame: invokeExtension('webNavigation.getFrame'),
            getAllFrames: invokeExtension('webNavigation.getAllFrames'),
            onBeforeNavigate: new ExtensionEvent('webNavigation.onBeforeNavigate'),
            onCommitted: new ExtensionEvent('webNavigation.onCommitted'),
            onCompleted: new ExtensionEvent('webNavigation.onCompleted'),
            onCreatedNavigationTarget: new ExtensionEvent('webNavigation.onCreatedNavigationTarget'),
            onDOMContentLoaded: new ExtensionEvent('webNavigation.onDOMContentLoaded'),
            onErrorOccurred: new ExtensionEvent('webNavigation.onErrorOccurred'),
            onHistoryStateUpdated: new ExtensionEvent('webNavigation.onHistoryStateUpdated'),
            onReferenceFragmentUpdated: new ExtensionEvent('webNavigation.onReferenceFragmentUpdated'),
            onTabReplaced: new ExtensionEvent('webNavigation.onTabReplaced')
          };
        }
      },
      webRequest: {
        factory: base => {
          return { ...base,
            onHeadersReceived: new ExtensionEvent('webRequest.onHeadersReceived')
          };
        }
      },
      windows: {
        factory: base => {
          return { ...base,
            WINDOW_ID_NONE: -1,
            WINDOW_ID_CURRENT: -2,
            get: invokeExtension('windows.get'),
            getLastFocused: invokeExtension('windows.getLastFocused'),
            getAll: invokeExtension('windows.getAll'),
            create: invokeExtension('windows.create'),
            update: invokeExtension('windows.update'),
            remove: invokeExtension('windows.remove'),
            onCreated: new ExtensionEvent('windows.onCreated'),
            onRemoved: new ExtensionEvent('windows.onRemoved'),
            onFocusChanged: new ExtensionEvent('windows.onFocusChanged')
          };
        }
      }
    }; // Initialize APIs

    Object.keys(apiDefinitions).forEach(key => {
      const apiName = key;
      const baseApi = chrome[apiName];
      const api = apiDefinitions[apiName]; // Allow APIs to opt-out of being available in this context.

      if (api.shouldInject && !api.shouldInject()) return;
      Object.defineProperty(chrome, apiName, {
        value: api.factory(baseApi),
        enumerable: true,
        configurable: true
      });
    }); // Remove access to internals

    delete window.electron;
    Object.freeze(chrome);
    void 0; // no return
  }

  try {
    // Expose extension IPC to main world
    electron__WEBPACK_IMPORTED_MODULE_0__["contextBridge"].exposeInMainWorld('electron', electronContext); // Mutate global 'chrome' object with additional APIs in the main world.

    electron__WEBPACK_IMPORTED_MODULE_0__["webFrame"].executeJavaScript(`(${mainWorldScript}());`);
  } catch {
    // contextBridge threw an error which means we're in the main world so we
    // can just execute our function.
    mainWorldScript();
  }
};

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ })

/******/ });
//# sourceMappingURL=preload.js.map