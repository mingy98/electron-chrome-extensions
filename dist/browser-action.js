module.exports =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/browser-action.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/browser-action.ts":
/*!*******************************!*\
  !*** ./src/browser-action.ts ***!
  \*******************************/
/*! exports provided: injectBrowserAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "injectBrowserAction", function() { return injectBrowserAction; });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! events */ "events");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_1__);


const injectBrowserAction = () => {
  const actionMap = new Map();
  const internalEmitter = new events__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
  const observerCounts = new Map();

  const invoke = (name, partition, ...args) => {
    return electron__WEBPACK_IMPORTED_MODULE_0__["ipcRenderer"].invoke('crx-msg-remote', partition, name, ...args);
  };

  const browserAction = {
    addEventListener(name, listener) {
      internalEmitter.addListener(name, listener);
    },

    removeEventListener(name, listener) {
      internalEmitter.removeListener(name, listener);
    },

    getAction(extensionId) {
      return actionMap.get(extensionId);
    },

    async getState(partition) {
      const state = await invoke('browserAction.getState', partition);

      for (const action of state.actions) {
        actionMap.set(action.id, action);
      }

      queueMicrotask(() => internalEmitter.emit('update', state));
      return state;
    },

    activate: (partition, details) => {
      return invoke('browserAction.activate', partition, details);
    },

    addObserver(partition) {
      let count = observerCounts.has(partition) ? observerCounts.get(partition) : 0;
      count = count + 1;
      observerCounts.set(partition, count);

      if (count === 1) {
        invoke('browserAction.addObserver', partition);
      }
    },

    removeObserver(partition) {
      let count = observerCounts.has(partition) ? observerCounts.get(partition) : 0;
      count = Math.max(count - 1, 0);
      observerCounts.set(partition, count);

      if (count === 0) {
        invoke('browserAction.removeObserver', partition);
      }
    }

  };
  electron__WEBPACK_IMPORTED_MODULE_0__["ipcRenderer"].on('browserAction.update', () => {
    for (const partition of observerCounts.keys()) {
      browserAction.getState(partition);
    }
  }); // Function body to run in the main world.
  // IMPORTANT: This must be self-contained, no closure variables can be used!

  function mainWorldScript() {
    const DEFAULT_PARTITION = '_self';

    class BrowserActionElement extends HTMLButtonElement {
      get id() {
        return this.getAttribute('id') || '';
      }

      set id(id) {
        this.setAttribute('id', id);
      }

      get tab() {
        const tabId = parseInt(this.getAttribute('tab') || '', 10);
        return typeof tabId === 'number' && !isNaN(tabId) ? tabId : -1;
      }

      set tab(tab) {
        this.setAttribute('tab', `${tab}`);
      }

      get partition() {
        return this.getAttribute('partition');
      }

      set partition(partition) {
        if (partition) {
          this.setAttribute('partition', partition);
        } else {
          this.removeAttribute('partition');
        }
      }

      static get observedAttributes() {
        return ['id', 'tab', 'partition'];
      }

      constructor() {
        super(); // TODO: event delegation

        this.updateId = void 0;
        this.badge = void 0;
        this.pendingIcon = void 0;
        this.addEventListener('click', this.onClick.bind(this));
        this.addEventListener('contextmenu', this.onContextMenu.bind(this));
      }

      connectedCallback() {
        if (this.isConnected) {
          this.update();
        }
      }

      disconnectedCallback() {
        if (this.updateId) {
          cancelAnimationFrame(this.updateId);
          this.updateId = undefined;
        }

        if (this.pendingIcon) {
          this.pendingIcon = undefined;
        }
      }

      attributeChangedCallback() {
        if (this.isConnected) {
          this.update();
        }
      }

      activate(event) {
        const rect = this.getBoundingClientRect();
        browserAction.activate(this.partition || DEFAULT_PARTITION, {
          eventType: event.type,
          extensionId: this.id,
          tabId: this.tab,
          anchorRect: {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
          }
        });
      }

      onClick(event) {
        this.activate(event);
      }

      onContextMenu(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        this.activate(event);
      }

      getBadge() {
        let badge = this.badge;

        if (!badge) {
          this.badge = badge = document.createElement('div');
          badge.className = 'badge';
          badge.part = 'badge';
          this.appendChild(badge);
        }

        return badge;
      }

      update() {
        if (this.updateId) return;
        this.updateId = requestAnimationFrame(this.updateCallback.bind(this));
      }

      updateIcon(info) {
        const iconSize = 32;
        const resizeType = 2;
        const timeParam = info.iconModified ? `&t=${info.iconModified}` : '';
        const iconUrl = `crx://extension-icon/${this.id}/${iconSize}/${resizeType}?tabId=${this.tab}${timeParam}`;
        const bgImage = `url(${iconUrl})`;

        if (this.pendingIcon) {
          this.pendingIcon = undefined;
        } // Preload icon to prevent it from blinking


        const img = this.pendingIcon = new Image();

        img.onload = () => {
          if (this.isConnected) {
            this.style.backgroundImage = bgImage;
            this.pendingIcon = undefined;
          }
        };

        img.src = iconUrl;
      }

      updateCallback() {
        this.updateId = undefined;
        const action = browserAction.getAction(this.id);
        const activeTabId = this.tab;
        const tabInfo = activeTabId > -1 ? action.tabs[activeTabId] : {};
        const info = { ...tabInfo,
          ...action
        };
        this.title = typeof info.title === 'string' ? info.title : '';
        this.updateIcon(info);

        if (info.text) {
          const badge = this.getBadge();
          badge.textContent = info.text;
          badge.style.color = '#fff'; // TODO: determine bg lightness?

          badge.style.backgroundColor = info.color;
        } else if (this.badge) {
          this.badge.remove();
          this.badge = undefined;
        }
      }

    }

    customElements.define('browser-action', BrowserActionElement, {
      extends: 'button'
    });

    class BrowserActionListElement extends HTMLElement {
      get tab() {
        const tabId = parseInt(this.getAttribute('tab') || '', 10);
        return typeof tabId === 'number' && !isNaN(tabId) ? tabId : null;
      }

      set tab(tab) {
        if (typeof tab === 'number') {
          this.setAttribute('tab', `${tab}`);
        } else {
          this.removeAttribute('tab');
        }
      }

      get partition() {
        return this.getAttribute('partition');
      }

      set partition(partition) {
        if (partition) {
          this.setAttribute('partition', partition);
        } else {
          this.removeAttribute('partition');
        }
      }

      static get observedAttributes() {
        return ['tab', 'partition'];
      }

      constructor() {
        super();
        this.observing = false;

        this.fetchState = async () => {
          try {
            await browserAction.getState(this.partition || DEFAULT_PARTITION);
          } catch {
            console.error(`browser-action-list failed to update [tab: ${this.tab}, partition: '${this.partition}']`);
          }
        };

        this.update = state => {
          const tabId = typeof this.tab === 'number' && this.tab >= 0 ? this.tab : state.activeTabId || -1;

          for (const action of state.actions) {
            var _this$shadowRoot;

            let browserActionNode = (_this$shadowRoot = this.shadowRoot) === null || _this$shadowRoot === void 0 ? void 0 : _this$shadowRoot.querySelector(`[id=${action.id}]`);

            if (!browserActionNode) {
              var _this$shadowRoot2;

              const node = document.createElement('button', {
                is: 'browser-action'
              });
              node.id = action.id;
              node.className = 'action';
              node.part = 'action';
              browserActionNode = node;
              (_this$shadowRoot2 = this.shadowRoot) === null || _this$shadowRoot2 === void 0 ? void 0 : _this$shadowRoot2.appendChild(browserActionNode);
            }

            if (this.partition) browserActionNode.partition = this.partition;
            browserActionNode.tab = tabId;
          }
        };

        const shadowRoot = this.attachShadow({
          mode: 'open'
        });
        const style = document.createElement('style');
        style.textContent = `
:host {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.action {
  width: 28px;
  height: 28px;
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 70%;
  border: none;
  border-radius: 4px;
  padding: 0;
  position: relative;
  outline: none;
}

.action:hover {
  background-color: var(--browser-action-hover-bg, rgba(255, 255, 255, 0.3));
}

.badge {
  box-shadow: 0px 0px 1px 1px var(--browser-action-badge-outline, #444);
  box-sizing: border-box;
  max-width: 100%;
  height: 12px;
  padding: 0 2px;
  border-radius: 2px;
  position: absolute;
  bottom: 1px;
  right: 0;
  pointer-events: none;
  line-height: 1.5;
  font-size: 9px;
  font-weight: 400;
  overflow: hidden;
  white-space: nowrap;
}`;
        shadowRoot.appendChild(style);
      }

      connectedCallback() {
        if (this.isConnected) {
          this.startObserving();
          this.fetchState();
        }
      }

      disconnectedCallback() {
        this.stopObserving();
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (this.isConnected) {
          this.fetchState();
        }
      }

      startObserving() {
        if (this.observing) return;
        browserAction.addEventListener('update', this.update);
        browserAction.addObserver(this.partition || DEFAULT_PARTITION);
        this.observing = true;
      }

      stopObserving() {
        if (!this.observing) return;
        browserAction.removeEventListener('update', this.update);
        browserAction.removeObserver(this.partition || DEFAULT_PARTITION);
        this.observing = false;
      }

    }

    customElements.define('browser-action-list', BrowserActionListElement);
  }

  try {
    electron__WEBPACK_IMPORTED_MODULE_0__["contextBridge"].exposeInMainWorld('browserAction', browserAction); // Must execute script in main world to modify custom component registry.

    electron__WEBPACK_IMPORTED_MODULE_0__["webFrame"].executeJavaScript(`(${mainWorldScript}());`);
  } catch {
    // When contextIsolation is disabled, contextBridge will throw an error.
    // If that's the case, we're in the main world so we can just execute our
    // function.
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

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ })

/******/ });
//# sourceMappingURL=browser-action.js.map