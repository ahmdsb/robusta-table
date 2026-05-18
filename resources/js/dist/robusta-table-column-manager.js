// node_modules/sortablejs/modular/sortable.esm.js
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
var version = "1.15.7";
function userAgent(pattern) {
  if (typeof window !== "undefined" && window.navigator) {
    return !!/* @__PURE__ */ navigator.userAgent.match(pattern);
  }
}
var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
var captureMode = {
  capture: false,
  passive: false
};
function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}
function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}
function matches(el, selector) {
  if (!selector) return;
  selector[0] === ">" && (selector = selector.substring(1));
  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }
  return false;
}
function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType && el.host !== el ? el.host : el.parentNode;
}
function closest(el, selector, ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;
    do {
      if (selector != null && (selector[0] === ">" ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }
      if (el === ctx) break;
    } while (el = getParentOrHost(el));
  }
  return null;
}
var R_SPACE = /\s+/g;
function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? "add" : "remove"](name);
    } else {
      var className = (" " + el.className + " ").replace(R_SPACE, " ").replace(" " + name + " ", " ");
      el.className = (className + (state ? " " + name : "")).replace(R_SPACE, " ");
    }
  }
}
function css(el, prop, val) {
  var style = el && el.style;
  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, "");
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }
      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf("webkit") === -1) {
        prop = "-webkit-" + prop;
      }
      style[prop] = val + (typeof val === "string" ? "" : "px");
    }
  }
}
function matrix(el, selfOnly) {
  var appliedTransforms = "";
  if (typeof el === "string") {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, "transform");
      if (transform && transform !== "none") {
        appliedTransforms = transform + " " + appliedTransforms;
      }
    } while (!selfOnly && (el = el.parentNode));
  }
  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return matrixFn && new matrixFn(appliedTransforms);
}
function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }
    return list;
  }
  return [];
}
function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;
  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;
  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }
  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    container = container || el.parentNode;
    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, "transform") !== "none" || relativeToNonStaticParent && css(container, "position") !== "static")) {
          var containerRect = container.getBoundingClientRect();
          top -= containerRect.top + parseInt(css(container, "border-top-width"));
          left -= containerRect.left + parseInt(css(container, "border-left-width"));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
      } while (container = container.parentNode);
    }
  }
  if (undoScale && el !== window) {
    var elMatrix = matrix(container || el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d;
    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }
  return {
    top,
    left,
    bottom,
    right,
    width,
    height
  };
}
function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true), elSideVal = getRect(el)[elSide];
  while (parent) {
    var parentSideVal = getRect(parent)[parentSide], visible = void 0;
    if (parentSide === "top" || parentSide === "left") {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }
    if (!visible) return parent;
    if (parent === getWindowScrollingElement()) break;
    parent = getParentAutoScrollElement(parent, false);
  }
  return false;
}
function getChild(el, childNum, options, includeDragEl) {
  var currentChild = 0, i = 0, children = el.children;
  while (i < children.length) {
    if (children[i].style.display !== "none" && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }
      currentChild++;
    }
    i++;
  }
  return null;
}
function lastChild(el, selector) {
  var last = el.lastElementChild;
  while (last && (last === Sortable.ghost || css(last, "display") === "none" || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }
  return last || null;
}
function index(el, selector) {
  var index2 = 0;
  if (!el || !el.parentNode) {
    return -1;
  }
  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== "TEMPLATE" && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index2++;
    }
  }
  return index2;
}
function getRelativeScrollOffset(el) {
  var offsetLeft = 0, offsetTop = 0, winScroller = getWindowScrollingElement();
  if (el) {
    do {
      var elMatrix = matrix(el), scaleX = elMatrix.a, scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }
  return [offsetLeft, offsetTop];
}
function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }
  return -1;
}
function getParentAutoScrollElement(el, includeSelf) {
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;
  do {
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);
      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == "auto" || elemCSS.overflowX == "scroll") || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == "auto" || elemCSS.overflowY == "scroll")) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
  } while (elem = elem.parentNode);
  return getWindowScrollingElement();
}
function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }
  return dst;
}
function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}
var _throttleTimeout;
function throttle(callback, ms) {
  return function() {
    if (!_throttleTimeout) {
      var args = arguments, _this = this;
      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }
      _throttleTimeout = setTimeout(function() {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}
function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}
function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}
function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;
  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}
function getChildContainingRectFromElement(container, options, ghostEl2) {
  var rect = {};
  Array.from(container.children).forEach(function(child) {
    var _rect$left, _rect$top, _rect$right, _rect$bottom;
    if (!closest(child, options.draggable, container, false) || child.animated || child === ghostEl2) return;
    var childRect = getRect(child);
    rect.left = Math.min((_rect$left = rect.left) !== null && _rect$left !== void 0 ? _rect$left : Infinity, childRect.left);
    rect.top = Math.min((_rect$top = rect.top) !== null && _rect$top !== void 0 ? _rect$top : Infinity, childRect.top);
    rect.right = Math.max((_rect$right = rect.right) !== null && _rect$right !== void 0 ? _rect$right : -Infinity, childRect.right);
    rect.bottom = Math.max((_rect$bottom = rect.bottom) !== null && _rect$bottom !== void 0 ? _rect$bottom : -Infinity, childRect.bottom);
  });
  rect.width = rect.right - rect.left;
  rect.height = rect.bottom - rect.top;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
var expando = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function AnimationStateManager() {
  var animationStates = [], animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function(child) {
        if (css(child, "display") === "none" || child === Sortable.ghost) return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });
        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);
        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);
          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }
        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;
      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === "function") callback();
        return;
      }
      var animating = false, animationTime = 0;
      animationStates.forEach(function(state) {
        var time = 0, target = state.target, fromRect = target.fromRect, toRect = getRect(target), prevFromRect = target.prevFromRect, prevToRect = target.prevToRect, animatingRect = state.rect, targetMatrix = matrix(target, true);
        if (targetMatrix) {
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }
        target.toRect = toRect;
        if (target.thisAnimationDuration) {
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        }
        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;
          if (!time) {
            time = _this.options.animation;
          }
          _this.animate(target, animatingRect, toRect, time);
        }
        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function() {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);
      if (!animating) {
        if (typeof callback === "function") callback();
      } else {
        animationCallbackId = setTimeout(function() {
          if (typeof callback === "function") callback();
        }, animationTime);
      }
      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, "transition", "");
        css(target, "transform", "");
        var elMatrix = matrix(this.el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d, translateX = (currentRect.left - toRect.left) / (scaleX || 1), translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, "transform", "translate3d(" + translateX + "px," + translateY + "px,0)");
        this.forRepaintDummy = repaint(target);
        css(target, "transition", "transform " + duration + "ms" + (this.options.easing ? " " + this.options.easing : ""));
        css(target, "transform", "translate3d(0,0,0)");
        typeof target.animated === "number" && clearTimeout(target.animated);
        target.animated = setTimeout(function() {
          css(target, "transition", "");
          css(target, "transform", "");
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}
function repaint(target) {
  return target.offsetWidth;
}
function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}
var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    for (var option2 in defaults) {
      if (defaults.hasOwnProperty(option2) && !(option2 in plugin)) {
        plugin[option2] = defaults[option2];
      }
    }
    plugins.forEach(function(p) {
      if (p.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;
    this.eventCanceled = false;
    evt.cancel = function() {
      _this.eventCanceled = true;
    };
    var eventNameGlobal = eventName + "Global";
    plugins.forEach(function(plugin) {
      if (!sortable[plugin.pluginName]) return;
      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
          sortable
        }, evt));
      }
      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread2({
          sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults2, options) {
    plugins.forEach(function(plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized;
      _extends(defaults2, initialized.defaults);
    });
    for (var option2 in sortable.options) {
      if (!sortable.options.hasOwnProperty(option2)) continue;
      var modified = this.modifyOption(sortable, option2, sortable.options[option2]);
      if (typeof modified !== "undefined") {
        sortable.options[option2] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function(plugin) {
      if (typeof plugin.eventProperties !== "function") return;
      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function(plugin) {
      if (!sortable[plugin.pluginName]) return;
      if (plugin.optionListeners && typeof plugin.optionListeners[name] === "function") {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};
function dispatchEvent(_ref) {
  var sortable = _ref.sortable, rootEl2 = _ref.rootEl, name = _ref.name, targetEl = _ref.targetEl, cloneEl2 = _ref.cloneEl, toEl = _ref.toEl, fromEl = _ref.fromEl, oldIndex2 = _ref.oldIndex, newIndex2 = _ref.newIndex, oldDraggableIndex2 = _ref.oldDraggableIndex, newDraggableIndex2 = _ref.newDraggableIndex, originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl2 && rootEl2[expando];
  if (!sortable) return;
  var evt, options = sortable.options, onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent(name, true, true);
  }
  evt.to = toEl || rootEl2;
  evt.from = fromEl || rootEl2;
  evt.item = targetEl || rootEl2;
  evt.clone = cloneEl2;
  evt.oldIndex = oldIndex2;
  evt.newIndex = newIndex2;
  evt.oldDraggableIndex = oldDraggableIndex2;
  evt.newDraggableIndex = newDraggableIndex2;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable2 ? putSortable2.lastPutMode : void 0;
  var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
  for (var option2 in allEventProperties) {
    evt[option2] = allEventProperties[option2];
  }
  if (rootEl2) {
    rootEl2.dispatchEvent(evt);
  }
  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}
var _excluded = ["evt"];
var pluginEvent2 = function pluginEvent3(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, originalEvent = _ref.evt, data = _objectWithoutProperties(_ref, _excluded);
  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
    dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    dragStarted: moved,
    putSortable,
    activeSortable: Sortable.active,
    originalEvent,
    oldIndex,
    oldDraggableIndex,
    newIndex,
    newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable,
        name,
        originalEvent
      });
    }
  }, data));
};
function _dispatchEvent(info) {
  dispatchEvent(_objectSpread2({
    putSortable,
    cloneEl,
    targetEl: dragEl,
    rootEl,
    oldIndex,
    oldDraggableIndex,
    newIndex,
    newDraggableIndex
  }, info));
}
var dragEl;
var parentEl;
var ghostEl;
var rootEl;
var nextEl;
var lastDownEl;
var cloneEl;
var cloneHidden;
var oldIndex;
var newIndex;
var oldDraggableIndex;
var newDraggableIndex;
var activeGroup;
var putSortable;
var awaitingDragStarted = false;
var ignoreNextClick = false;
var sortables = [];
var tapEvt;
var touchEvt;
var lastDx;
var lastDy;
var tapDistanceLeft;
var tapDistanceTop;
var moved;
var lastTarget;
var lastDirection;
var pastFirstInvertThresh = false;
var isCircumstantialInvert = false;
var targetMoveDistance;
var ghostRelativeParent;
var ghostRelativeParentInitialScroll = [];
var _silent = false;
var savedInputChecked = [];
var documentExists = typeof document !== "undefined";
var PositionGhostAbsolutely = IOS;
var CSSFloatProperty = Edge || IE11OrLess ? "cssFloat" : "float";
var supportDraggable = documentExists && !ChromeForAndroid && !IOS && "draggable" in document.createElement("div");
var supportCssPointerEvents = (function() {
  if (!documentExists) return;
  if (IE11OrLess) {
    return false;
  }
  var el = document.createElement("x");
  el.style.cssText = "pointer-events:auto";
  return el.style.pointerEvents === "auto";
})();
var _detectDirection = function _detectDirection2(el, options) {
  var elCSS = css(el), elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth), child1 = getChild(el, 0, options), child2 = getChild(el, 1, options), firstChildCSS = child1 && css(child1), secondChildCSS = child2 && css(child2), firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width, secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
  if (elCSS.display === "flex") {
    return elCSS.flexDirection === "column" || elCSS.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  }
  if (elCSS.display === "grid") {
    return elCSS.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  }
  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== "none") {
    var touchingSideChild2 = firstChildCSS["float"] === "left" ? "left" : "right";
    return child2 && (secondChildCSS.clear === "both" || secondChildCSS.clear === touchingSideChild2) ? "vertical" : "horizontal";
  }
  return child1 && (firstChildCSS.display === "block" || firstChildCSS.display === "flex" || firstChildCSS.display === "table" || firstChildCSS.display === "grid" || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === "none" || child2 && elCSS[CSSFloatProperty] === "none" && firstChildWidth + secondChildWidth > elWidth) ? "vertical" : "horizontal";
};
var _dragElInRowColumn = function _dragElInRowColumn2(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top, dragElS2Opp = vertical ? dragRect.right : dragRect.bottom, dragElOppLength = vertical ? dragRect.width : dragRect.height, targetS1Opp = vertical ? targetRect.left : targetRect.top, targetS2Opp = vertical ? targetRect.right : targetRect.bottom, targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
};
var _detectNearestEmptySortable = function _detectNearestEmptySortable2(x, y) {
  var ret;
  sortables.some(function(sortable) {
    var threshold = sortable[expando].options.emptyInsertThreshold;
    if (!threshold || lastChild(sortable)) return;
    var rect = getRect(sortable), insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold, insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
    if (insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
};
var _prepareGroup = function _prepareGroup2(options) {
  function toFn(value, pull) {
    return function(to, from, dragEl2, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
      if (value == null && (pull || sameGroup)) {
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === "clone") {
        return value;
      } else if (typeof value === "function") {
        return toFn(value(to, from, dragEl2, evt), pull)(to, from, dragEl2, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === "string" && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }
  var group = {};
  var originalGroup = options.group;
  if (!originalGroup || _typeof(originalGroup) != "object") {
    originalGroup = {
      name: originalGroup
    };
  }
  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
};
var _hideGhostForTarget = function _hideGhostForTarget2() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, "display", "none");
  }
};
var _unhideGhostForTarget = function _unhideGhostForTarget2() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, "display", "");
  }
};
if (documentExists && !ChromeForAndroid) {
  document.addEventListener("click", function(evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}
var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent2(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;
    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
    if (nearest) {
      var event = {};
      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }
      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;
      nearest[expando]._onDragOver(event);
    }
  }
};
var _checkOutsideTargetEl = function _checkOutsideTargetEl2(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }
  this.el = el;
  this.options = options = _extends({}, options);
  el[expando] = this;
  var defaults2 = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? ">li" : ">*",
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl2) {
      dataTransfer.setData("Text", dragEl2.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    // Disabled on Safari: #1571; Enabled on Safari IOS: #2244
    supportPointer: Sortable.supportPointer !== false && "PointerEvent" in window && (!Safari || IOS),
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults2);
  for (var name in defaults2) {
    !(name in options) && (options[name] = defaults2[name]);
  }
  _prepareGroup(options);
  for (var fn in this) {
    if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
      this[fn] = this[fn].bind(this);
    }
  }
  this.nativeDraggable = options.forceFallback ? false : supportDraggable;
  if (this.nativeDraggable) {
    this.options.touchStartThreshold = 1;
  }
  if (options.supportPointer) {
    on(el, "pointerdown", this._onTapStart);
  } else {
    on(el, "mousedown", this._onTapStart);
    on(el, "touchstart", this._onTapStart);
  }
  if (this.nativeDraggable) {
    on(el, "dragover", this);
    on(el, "dragenter", this);
  }
  sortables.push(this.el);
  options.store && options.store.get && this.sort(options.store.get(this) || []);
  _extends(this, AnimationStateManager());
}
Sortable.prototype = /** @lends Sortable.prototype */
{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === "function" ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(evt) {
    if (!evt.cancelable) return;
    var _this = this, el = this.el, options = this.options, preventOnFilter = options.preventOnFilter, type = evt.type, touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === "touch" && evt, target = (touch || evt).target, originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target, filter = options.filter;
    _saveInputCheckedState(el);
    if (dragEl) {
      return;
    }
    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return;
    }
    if (originalTarget.isContentEditable) {
      return;
    }
    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === "SELECT") {
      return;
    }
    target = closest(target, options.draggable, el, false);
    if (target && target.animated) {
      return;
    }
    if (lastDownEl === target) {
      return;
    }
    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable);
    if (typeof filter === "function") {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: "filter",
          targetEl: target,
          toEl: el,
          fromEl: el
        });
        pluginEvent2("filter", _this, {
          evt
        });
        preventOnFilter && evt.preventDefault();
        return;
      }
    } else if (filter) {
      filter = filter.split(",").some(function(criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);
        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: "filter",
            targetEl: target,
            fromEl: el,
            toEl: el
          });
          pluginEvent2("filter", _this, {
            evt
          });
          return true;
        }
      });
      if (filter) {
        preventOnFilter && evt.preventDefault();
        return;
      }
    }
    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    }
    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(evt, touch, target) {
    var _this = this, el = _this.el, options = _this.options, ownerDocument = el.ownerDocument, dragStartFn;
    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style["will-change"] = "all";
      dragStartFn = function dragStartFn2() {
        pluginEvent2("delayEnded", _this, {
          evt
        });
        if (Sortable.eventCanceled) {
          _this._onDrop();
          return;
        }
        _this._disableDelayedDragEvents();
        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        }
        _this._triggerDragStart(evt, touch);
        _dispatchEvent({
          sortable: _this,
          name: "choose",
          originalEvent: evt
        });
        toggleClass(dragEl, options.chosenClass, true);
      };
      options.ignore.split(",").forEach(function(criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, "dragover", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "mousemove", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "touchmove", nearestEmptyInsertDetectEvent);
      if (options.supportPointer) {
        on(ownerDocument, "pointerup", _this._onDrop);
        !this.nativeDraggable && on(ownerDocument, "pointercancel", _this._onDrop);
      } else {
        on(ownerDocument, "mouseup", _this._onDrop);
        on(ownerDocument, "touchend", _this._onDrop);
        on(ownerDocument, "touchcancel", _this._onDrop);
      }
      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }
      pluginEvent2("delayStart", this, {
        evt
      });
      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();
          return;
        }
        if (options.supportPointer) {
          on(ownerDocument, "pointerup", _this._disableDelayedDrag);
          on(ownerDocument, "pointercancel", _this._disableDelayedDrag);
        } else {
          on(ownerDocument, "mouseup", _this._disableDelayedDrag);
          on(ownerDocument, "touchend", _this._disableDelayedDrag);
          on(ownerDocument, "touchcancel", _this._disableDelayedDrag);
        }
        on(ownerDocument, "mousemove", _this._delayedDragTouchMoveHandler);
        on(ownerDocument, "touchmove", _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, "pointermove", _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(e) {
    var touch = e.touches ? e.touches[0] : e;
    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);
    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, "mouseup", this._disableDelayedDrag);
    off(ownerDocument, "touchend", this._disableDelayedDrag);
    off(ownerDocument, "touchcancel", this._disableDelayedDrag);
    off(ownerDocument, "pointerup", this._disableDelayedDrag);
    off(ownerDocument, "pointercancel", this._disableDelayedDrag);
    off(ownerDocument, "mousemove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "touchmove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(evt, touch) {
    touch = touch || evt.pointerType == "touch" && evt;
    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, "pointermove", this._onTouchMove);
      } else if (touch) {
        on(document, "touchmove", this._onTouchMove);
      } else {
        on(document, "mousemove", this._onTouchMove);
      }
    } else {
      on(dragEl, "dragend", this);
      on(rootEl, "dragstart", this._onDragStart);
    }
    try {
      if (document.selection) {
        _nextTick(function() {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {
    }
  },
  _dragStarted: function _dragStarted(fallback, evt) {
    awaitingDragStarted = false;
    if (rootEl && dragEl) {
      pluginEvent2("dragStarted", this, {
        evt
      });
      if (this.nativeDraggable) {
        on(document, "dragover", _checkOutsideTargetEl);
      }
      var options = this.options;
      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost();
      _dispatchEvent({
        sortable: this,
        name: "start",
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;
      _hideGhostForTarget();
      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;
      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }
      dragEl.parentNode[expando]._isOutsideThisEl(target);
      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target,
              rootEl: parent
            });
            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }
          target = parent;
        } while (parent = getParentOrHost(parent));
      }
      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(evt) {
    if (tapEvt) {
      var options = this.options, fallbackTolerance = options.fallbackTolerance, fallbackOffset = options.fallbackOffset, touch = evt.touches ? evt.touches[0] : evt, ghostMatrix = ghostEl && matrix(ghostEl, true), scaleX = ghostEl && ghostMatrix && ghostMatrix.a, scaleY = ghostEl && ghostMatrix && ghostMatrix.d, relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent), dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1), dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);
      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }
        this._onDragStart(evt, true);
      }
      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }
        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, "webkitTransform", cssMatrix);
        css(ghostEl, "mozTransform", cssMatrix);
        css(ghostEl, "msTransform", cssMatrix);
        css(ghostEl, "transform", cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }
      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl, rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container), options = this.options;
      if (PositionGhostAbsolutely) {
        ghostRelativeParent = container;
        while (css(ghostRelativeParent, "position") === "static" && css(ghostRelativeParent, "transform") === "none" && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }
        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }
        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }
      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, "transition", "");
      css(ghostEl, "transform", "");
      css(ghostEl, "box-sizing", "border-box");
      css(ghostEl, "margin", 0);
      css(ghostEl, "top", rect.top);
      css(ghostEl, "left", rect.left);
      css(ghostEl, "width", rect.width);
      css(ghostEl, "height", rect.height);
      css(ghostEl, "opacity", "0.8");
      css(ghostEl, "position", PositionGhostAbsolutely ? "absolute" : "fixed");
      css(ghostEl, "zIndex", "100000");
      css(ghostEl, "pointerEvents", "none");
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl);
      css(ghostEl, "transform-origin", tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + "% " + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + "%");
    }
  },
  _onDragStart: function _onDragStart(evt, fallback) {
    var _this = this;
    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent2("dragStart", this, {
      evt
    });
    if (Sortable.eventCanceled) {
      this._onDrop();
      return;
    }
    pluginEvent2("setupClone", this);
    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.removeAttribute("id");
      cloneEl.draggable = false;
      cloneEl.style["will-change"] = "";
      this._hideClone();
      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    }
    _this.cloneId = _nextTick(function() {
      pluginEvent2("clone", _this);
      if (Sortable.eventCanceled) return;
      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }
      _this._hideClone();
      _dispatchEvent({
        sortable: _this,
        name: "clone"
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true);
    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      off(document, "mouseup", _this._onDrop);
      off(document, "touchend", _this._onDrop);
      off(document, "touchcancel", _this._onDrop);
      if (dataTransfer) {
        dataTransfer.effectAllowed = "move";
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }
      on(document, "drop", _this);
      css(dragEl, "transform", "translateZ(0)");
    }
    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, "selectstart", _this);
    moved = true;
    window.getSelection().removeAllRanges();
    if (Safari) {
      css(document.body, "user-select", "none");
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver(evt) {
    var el = this.el, target = evt.target, dragRect, targetRect, revert, options = this.options, group = options.group, activeSortable = Sortable.active, isOwner = activeGroup === group, canSort = options.sort, fromSortable = putSortable || activeSortable, vertical, _this = this, completedFired = false;
    if (_silent) return;
    function dragOverEvent(name, extra) {
      pluginEvent2(name, _this, _objectSpread2({
        evt,
        isOwner,
        axis: vertical ? "vertical" : "horizontal",
        revert,
        dragRect,
        targetRect,
        canSort,
        fromSortable,
        target,
        completed,
        onMove: function onMove(target2, after2) {
          return _onMove(rootEl, el, dragEl, dragRect, target2, getRect(target2), evt, after2);
        },
        changed
      }, extra));
    }
    function capture() {
      dragOverEvent("dragOverAnimationCapture");
      _this.captureAnimationState();
      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    }
    function completed(insertion) {
      dragOverEvent("dragOverCompleted", {
        insertion
      });
      if (insertion) {
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }
        if (_this !== fromSortable) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }
        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        }
        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }
        _this.animateAll(function() {
          dragOverEvent("dragOverAnimationComplete");
          _this._ignoreWhileAnimating = null;
        });
        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      }
      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      }
      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
        !insertion && nearestEmptyInsertDetectEvent(evt);
      }
      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    }
    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);
      _dispatchEvent({
        sortable: _this,
        name: "change",
        toEl: el,
        newIndex,
        newDraggableIndex,
        originalEvent: evt
      });
    }
    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }
    target = closest(target, options.draggable, el, true);
    dragOverEvent("dragOver");
    if (Sortable.eventCanceled) return completedFired;
    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }
    ignoreNextClick = false;
    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === "vertical";
      dragRect = getRect(dragEl);
      dragOverEvent("dragOverValid");
      if (Sortable.eventCanceled) return completedFired;
      if (revert) {
        parentEl = rootEl;
        capture();
        this._hideClone();
        dragOverEvent("revert");
        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }
        return completed(true);
      }
      var elLastChild = lastChild(el, options.draggable);
      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        if (elLastChild === dragEl) {
          return completed(false);
        }
        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }
        if (target) {
          targetRect = getRect(target);
        }
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          if (elLastChild && elLastChild.nextSibling) {
            el.insertBefore(dragEl, elLastChild.nextSibling);
          } else {
            el.appendChild(dragEl);
          }
          parentEl = el;
          changed();
          return completed(true);
        }
      } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
        var firstChild = getChild(el, 0, options, true);
        if (firstChild === dragEl) {
          return completed(false);
        }
        target = firstChild;
        targetRect = getRect(target);
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
          capture();
          el.insertBefore(dragEl, firstChild);
          parentEl = el;
          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0, targetBeforeFirstSwap, differentLevel = dragEl.parentNode !== el, differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical), side1 = vertical ? "top" : "left", scrolledPastTop = isScrolledPast(target, "top", "top") || isScrolledPast(dragEl, "top", "top"), scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }
        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;
        if (direction !== 0) {
          var dragIndex = index(dragEl);
          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, "display") === "none" || sibling === ghostEl));
        }
        if (direction === 0 || sibling === target) {
          return completed(false);
        }
        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling, after = false;
        after = direction === 1;
        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }
          _silent = true;
          setTimeout(_unsilent, 30);
          capture();
          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          }
          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }
          parentEl = dragEl.parentNode;
          if (targetBeforeFirstSwap !== void 0 && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }
          changed();
          return completed(true);
        }
      }
      if (el.contains(dragEl)) {
        return completed(false);
      }
    }
    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, "mousemove", this._onTouchMove);
    off(document, "touchmove", this._onTouchMove);
    off(document, "pointermove", this._onTouchMove);
    off(document, "dragover", nearestEmptyInsertDetectEvent);
    off(document, "mousemove", nearestEmptyInsertDetectEvent);
    off(document, "touchmove", nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, "mouseup", this._onDrop);
    off(ownerDocument, "touchend", this._onDrop);
    off(ownerDocument, "pointerup", this._onDrop);
    off(ownerDocument, "pointercancel", this._onDrop);
    off(ownerDocument, "touchcancel", this._onDrop);
    off(document, "selectstart", this);
  },
  _onDrop: function _onDrop(evt) {
    var el = this.el, options = this.options;
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent2("drop", this, {
      evt
    });
    parentEl = dragEl && dragEl.parentNode;
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    if (Sortable.eventCanceled) {
      this._nulling();
      return;
    }
    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);
    _cancelNextTick(this.cloneId);
    _cancelNextTick(this._dragStartId);
    if (this.nativeDraggable) {
      off(document, "drop", this);
      off(el, "dragstart", this._onDragStart);
    }
    this._offMoveEvents();
    this._offUpEvents();
    if (Safari) {
      css(document.body, "user-select", "");
    }
    css(dragEl, "transform", "");
    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }
      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== "clone") {
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }
      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, "dragend", this);
        }
        _disableDraggable(dragEl);
        dragEl.style["will-change"] = "";
        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }
        toggleClass(dragEl, this.options.chosenClass, false);
        _dispatchEvent({
          sortable: this,
          name: "unchoose",
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });
        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            _dispatchEvent({
              rootEl: parentEl,
              name: "add",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: "remove",
              toEl: parentEl,
              originalEvent: evt
            });
            _dispatchEvent({
              rootEl: parentEl,
              name: "sort",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: "sort",
              toEl: parentEl,
              originalEvent: evt
            });
          }
          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              _dispatchEvent({
                sortable: this,
                name: "update",
                toEl: parentEl,
                originalEvent: evt
              });
              _dispatchEvent({
                sortable: this,
                name: "sort",
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }
        if (Sortable.active) {
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }
          _dispatchEvent({
            sortable: this,
            name: "end",
            toEl: parentEl,
            originalEvent: evt
          });
          this.save();
        }
      }
    }
    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent2("nulling", this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    var el = this.el;
    savedInputChecked.forEach(function(checkEl) {
      if (el.contains(checkEl)) {
        checkEl.checked = true;
      }
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(evt) {
    switch (evt.type) {
      case "drop":
      case "dragend":
        this._onDrop(evt);
        break;
      case "dragenter":
      case "dragover":
        if (dragEl) {
          this._onDragOver(evt);
          _globalDragOver(evt);
        }
        break;
      case "selectstart":
        evt.preventDefault();
        break;
    }
  },
  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [], el, children = this.el.children, i = 0, n = children.length, options = this.options;
    for (; i < n; i++) {
      el = children[i];
      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }
    return order;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order, useAnimation) {
    var items = {}, rootEl2 = this.el;
    this.toArray().forEach(function(id, i) {
      var el = rootEl2.children[i];
      if (closest(el, this.options.draggable, rootEl2, false)) {
        items[id] = el;
      }
    }, this);
    useAnimation && this.captureAnimationState();
    order.forEach(function(id) {
      if (items[id]) {
        rootEl2.removeChild(items[id]);
        rootEl2.appendChild(items[id]);
      }
    });
    useAnimation && this.animateAll();
  },
  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },
  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },
  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;
    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);
      if (typeof modifiedValue !== "undefined") {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }
      if (name === "group") {
        _prepareGroup(options);
      }
    }
  },
  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent2("destroy", this);
    var el = this.el;
    el[expando] = null;
    off(el, "mousedown", this._onTapStart);
    off(el, "touchstart", this._onTapStart);
    off(el, "pointerdown", this._onTapStart);
    if (this.nativeDraggable) {
      off(el, "dragover", this);
      off(el, "dragenter", this);
    }
    Array.prototype.forEach.call(el.querySelectorAll("[draggable]"), function(el2) {
      el2.removeAttribute("draggable");
    });
    this._onDrop();
    this._disableDelayedDragEvents();
    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent2("hideClone", this);
      if (Sortable.eventCanceled) return;
      css(cloneEl, "display", "none");
      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }
      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable2) {
    if (putSortable2.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (cloneHidden) {
      pluginEvent2("showClone", this);
      if (Sortable.eventCanceled) return;
      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }
      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }
      css(cloneEl, "display", "");
      cloneHidden = false;
    }
  }
};
function _globalDragOver(evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = "move";
  }
  evt.cancelable && evt.preventDefault();
}
function _onMove(fromEl, toEl, dragEl2, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt, sortable = fromEl[expando], onMoveFn = sortable.options.onMove, retVal;
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent("move", {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent("move", true, true);
  }
  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl2;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);
  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }
  return retVal;
}
function _disableDraggable(el) {
  el.draggable = false;
}
function _unsilent() {
  _silent = false;
}
function _ghostIsFirst(evt, vertical, sortable) {
  var firstElRect = getRect(getChild(sortable.el, 0, sortable.options, true));
  var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
  var spacer = 10;
  return vertical ? evt.clientX < childContainingRect.left - spacer || evt.clientY < firstElRect.top && evt.clientX < firstElRect.right : evt.clientY < childContainingRect.top - spacer || evt.clientY < firstElRect.bottom && evt.clientX < firstElRect.left;
}
function _ghostIsLast(evt, vertical, sortable) {
  var lastElRect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
  var spacer = 10;
  return vertical ? evt.clientX > childContainingRect.right + spacer || evt.clientY > lastElRect.bottom && evt.clientX > lastElRect.left : evt.clientY > childContainingRect.bottom + spacer || evt.clientX > lastElRect.right && evt.clientY > lastElRect.top;
}
function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX, targetLength = vertical ? targetRect.height : targetRect.width, targetS1 = vertical ? targetRect.top : targetRect.left, targetS2 = vertical ? targetRect.bottom : targetRect.right, invert = false;
  if (!invertSwap) {
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        pastFirstInvertThresh = true;
      }
      if (!pastFirstInvertThresh) {
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }
  invert = invert || invertSwap;
  if (invert) {
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }
  return 0;
}
function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent, i = str.length, sum = 0;
  while (i--) {
    sum += str.charCodeAt(i);
  }
  return sum.toString(36);
}
function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName("input");
  var idx = inputs.length;
  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}
function _nextTick(fn) {
  return setTimeout(fn, 0);
}
function _cancelNextTick(id) {
  return clearTimeout(id);
}
if (documentExists) {
  on(document, "touchmove", function(evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
}
Sortable.utils = {
  on,
  off,
  css,
  find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend,
  throttle,
  closest,
  toggleClass,
  clone,
  index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild,
  expando
};
Sortable.get = function(element) {
  return element[expando];
};
Sortable.mount = function() {
  for (var _len = arguments.length, plugins2 = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins2[_key] = arguments[_key];
  }
  if (plugins2[0].constructor === Array) plugins2 = plugins2[0];
  plugins2.forEach(function(plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }
    if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
    PluginManager.mount(plugin);
  });
};
Sortable.create = function(el, options) {
  return new Sortable(el, options);
};
Sortable.version = version;
var autoScrolls = [];
var scrollEl;
var scrollRootEl;
var scrolling = false;
var lastAutoScrollX;
var lastAutoScrollY;
var touchEvt$1;
var pointerElemChangedInterval;
function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      forceAutoScrollFallback: false,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    };
    for (var fn in this) {
      if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
        this[fn] = this[fn].bind(this);
      }
    }
  }
  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;
      if (this.sortable.nativeDraggable) {
        on(document, "dragover", this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, "pointermove", this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, "touchmove", this._handleFallbackAutoScroll);
        } else {
          on(document, "mousemove", this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop3() {
      if (this.sortable.nativeDraggable) {
        off(document, "dragover", this._handleAutoScroll);
      } else {
        off(document, "pointermove", this._handleFallbackAutoScroll);
        off(document, "touchmove", this._handleFallbackAutoScroll);
        off(document, "mousemove", this._handleFallbackAutoScroll);
      }
      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;
      var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt;
      if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback);
        var ogElemScroller = getParentAutoScrollElement(elem, true);
        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval();
          pointerElemChangedInterval = setInterval(function() {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }
            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }
        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: "scroll",
    initializeByDefault: true
  });
}
function clearAutoScrolls() {
  autoScrolls.forEach(function(autoScroll2) {
    clearInterval(autoScroll2.pid);
  });
  autoScrolls = [];
}
function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}
var autoScroll = throttle(function(evt, options, rootEl2, isFallback) {
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, sens = options.scrollSensitivity, speed = options.scrollSpeed, winScroller = getWindowScrollingElement();
  var scrollThisInstance = false, scrollCustomFn;
  if (scrollRootEl !== rootEl2) {
    scrollRootEl = rootEl2;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;
    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl2, true);
    }
  }
  var layersOut = 0;
  var currentParent = scrollEl;
  do {
    var el = currentParent, rect = getRect(el), top = rect.top, bottom = rect.bottom, left = rect.left, right = rect.right, width = rect.width, height = rect.height, canScrollX = void 0, canScrollY = void 0, scrollWidth = el.scrollWidth, scrollHeight = el.scrollHeight, elCSS = css(el), scrollPosX = el.scrollLeft, scrollPosY = el.scrollTop;
    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll" || elCSS.overflowX === "visible");
      canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll" || elCSS.overflowY === "visible");
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll");
      canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll");
    }
    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);
    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }
    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);
      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        autoScrolls[layersOut].pid = setInterval(function() {
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1);
          }
          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
          if (typeof scrollCustomFn === "function") {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== "continue") {
              return;
            }
          }
          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }
    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
  scrolling = scrollThisInstance;
}, 30);
var drop = function drop2(_ref) {
  var originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, dragEl2 = _ref.dragEl, activeSortable = _ref.activeSortable, dispatchSortableEvent = _ref.dispatchSortableEvent, hideGhostForTarget = _ref.hideGhostForTarget, unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable2 || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();
  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent("spill");
    this.onSpill({
      dragEl: dragEl2,
      putSortable: putSortable2
    });
  }
};
function Revert() {
}
Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex2 = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex2;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl2 = _ref3.dragEl, putSortable2 = _ref3.putSortable;
    this.sortable.captureAnimationState();
    if (putSortable2) {
      putSortable2.captureAnimationState();
    }
    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl2, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl2);
    }
    this.sortable.animateAll();
    if (putSortable2) {
      putSortable2.animateAll();
    }
  },
  drop
};
_extends(Revert, {
  pluginName: "revertOnSpill"
});
function Remove() {
}
Remove.prototype = {
  onSpill: function onSpill2(_ref4) {
    var dragEl2 = _ref4.dragEl, putSortable2 = _ref4.putSortable;
    var parentSortable = putSortable2 || this.sortable;
    parentSortable.captureAnimationState();
    dragEl2.parentNode && dragEl2.parentNode.removeChild(dragEl2);
    parentSortable.animateAll();
  },
  drop
};
_extends(Remove, {
  pluginName: "removeOnSpill"
});
Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);
var sortable_esm_default = Sortable;

// resources/js/robusta-table-column-manager.js
function robustaTableColumnManager({
  data = [],
  fixed = [],
  isLoading = false
} = {}) {
  return {
    data,
    fixed,
    isLoading,
    sortable: null,
    unwatchLoading: null,
    init() {
      this.sortable = sortable_esm_default.create(this.$refs.sortable, {
        animation: 150,
        dataIdAttr: "x-sortable-item",
        handle: ".robusta-sortable-handle",
        onSort: () => {
          const sortedSubset = this.sortable.toArray();
          if (!Array.isArray(this.data)) return;
          const result = [];
          let sortableIndex = 0;
          for (const item of this.data) {
            if (this.fixed.includes(item)) {
              result.push(item);
            } else {
              result.push(sortedSubset[sortableIndex]);
              sortableIndex++;
            }
          }
          this.data.splice(0, this.data.length, ...result);
          this.$dispatch("sorted", [...this.data]);
        }
      });
      this.unwatchLoading = this.$watch("isLoading", (value) => {
        this.sortable.option("disabled", !!value);
      });
      this.sortable.option("disabled", !!this.isLoading);
    },
    destroy() {
      this.unwatchLoading?.();
      this.sortable?.destroy();
      this.sortable = null;
    }
  };
}
export {
  robustaTableColumnManager as default
};
/*! Bundled license information:

sortablejs/modular/sortable.esm.js:
  (**!
   * Sortable 1.15.7
   * @author	RubaXa   <trash@rubaxa.org>
   * @author	owenm    <owen23355@gmail.com>
   * @license MIT
   *)
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3NvcnRhYmxlanMvbW9kdWxhci9zb3J0YWJsZS5lc20uanMiLCAiLi4vcm9idXN0YS10YWJsZS1jb2x1bW4tbWFuYWdlci5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyoqIVxuICogU29ydGFibGUgMS4xNS43XG4gKiBAYXV0aG9yXHRSdWJhWGEgICA8dHJhc2hAcnViYXhhLm9yZz5cbiAqIEBhdXRob3JcdG93ZW5tICAgIDxvd2VuMjMzNTVAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KHIsIGEpIHtcbiAgKG51bGwgPT0gYSB8fCBhID4gci5sZW5ndGgpICYmIChhID0gci5sZW5ndGgpO1xuICBmb3IgKHZhciBlID0gMCwgbiA9IEFycmF5KGEpOyBlIDwgYTsgZSsrKSBuW2VdID0gcltlXTtcbiAgcmV0dXJuIG47XG59XG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMocikge1xuICBpZiAoQXJyYXkuaXNBcnJheShyKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KHIpO1xufVxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KGUsIHIsIHQpIHtcbiAgcmV0dXJuIChyID0gX3RvUHJvcGVydHlLZXkocikpIGluIGUgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkoZSwgciwge1xuICAgIHZhbHVlOiB0LFxuICAgIGVudW1lcmFibGU6ICEwLFxuICAgIGNvbmZpZ3VyYWJsZTogITAsXG4gICAgd3JpdGFibGU6ICEwXG4gIH0pIDogZVtyXSA9IHQsIGU7XG59XG5mdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgcmV0dXJuIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiA/IE9iamVjdC5hc3NpZ24uYmluZCgpIDogZnVuY3Rpb24gKG4pIHtcbiAgICBmb3IgKHZhciBlID0gMTsgZSA8IGFyZ3VtZW50cy5sZW5ndGg7IGUrKykge1xuICAgICAgdmFyIHQgPSBhcmd1bWVudHNbZV07XG4gICAgICBmb3IgKHZhciByIGluIHQpICh7fSkuaGFzT3duUHJvcGVydHkuY2FsbCh0LCByKSAmJiAobltyXSA9IHRbcl0pO1xuICAgIH1cbiAgICByZXR1cm4gbjtcbiAgfSwgX2V4dGVuZHMuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbn1cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkocikge1xuICBpZiAoXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgU3ltYm9sICYmIG51bGwgIT0gcltTeW1ib2wuaXRlcmF0b3JdIHx8IG51bGwgIT0gcltcIkBAaXRlcmF0b3JcIl0pIHJldHVybiBBcnJheS5mcm9tKHIpO1xufVxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cbmZ1bmN0aW9uIG93bktleXMoZSwgcikge1xuICB2YXIgdCA9IE9iamVjdC5rZXlzKGUpO1xuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHZhciBvID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhlKTtcbiAgICByICYmIChvID0gby5maWx0ZXIoZnVuY3Rpb24gKHIpIHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGUsIHIpLmVudW1lcmFibGU7XG4gICAgfSkpLCB0LnB1c2guYXBwbHkodCwgbyk7XG4gIH1cbiAgcmV0dXJuIHQ7XG59XG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkMihlKSB7XG4gIGZvciAodmFyIHIgPSAxOyByIDwgYXJndW1lbnRzLmxlbmd0aDsgcisrKSB7XG4gICAgdmFyIHQgPSBudWxsICE9IGFyZ3VtZW50c1tyXSA/IGFyZ3VtZW50c1tyXSA6IHt9O1xuICAgIHIgJSAyID8gb3duS2V5cyhPYmplY3QodCksICEwKS5mb3JFYWNoKGZ1bmN0aW9uIChyKSB7XG4gICAgICBfZGVmaW5lUHJvcGVydHkoZSwgciwgdFtyXSk7XG4gICAgfSkgOiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGUsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHQpKSA6IG93bktleXMoT2JqZWN0KHQpKS5mb3JFYWNoKGZ1bmN0aW9uIChyKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZSwgciwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LCByKSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGU7XG59XG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoZSwgdCkge1xuICBpZiAobnVsbCA9PSBlKSByZXR1cm4ge307XG4gIHZhciBvLFxuICAgIHIsXG4gICAgaSA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKGUsIHQpO1xuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHZhciBuID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhlKTtcbiAgICBmb3IgKHIgPSAwOyByIDwgbi5sZW5ndGg7IHIrKykgbyA9IG5bcl0sIC0xID09PSB0LmluZGV4T2YobykgJiYge30ucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChlLCBvKSAmJiAoaVtvXSA9IGVbb10pO1xuICB9XG4gIHJldHVybiBpO1xufVxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UociwgZSkge1xuICBpZiAobnVsbCA9PSByKSByZXR1cm4ge307XG4gIHZhciB0ID0ge307XG4gIGZvciAodmFyIG4gaW4gcikgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwociwgbikpIHtcbiAgICBpZiAoLTEgIT09IGUuaW5kZXhPZihuKSkgY29udGludWU7XG4gICAgdFtuXSA9IHJbbl07XG4gIH1cbiAgcmV0dXJuIHQ7XG59XG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkocikge1xuICByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKHIpIHx8IF9pdGVyYWJsZVRvQXJyYXkocikgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KHIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpO1xufVxuZnVuY3Rpb24gX3RvUHJpbWl0aXZlKHQsIHIpIHtcbiAgaWYgKFwib2JqZWN0XCIgIT0gdHlwZW9mIHQgfHwgIXQpIHJldHVybiB0O1xuICB2YXIgZSA9IHRbU3ltYm9sLnRvUHJpbWl0aXZlXTtcbiAgaWYgKHZvaWQgMCAhPT0gZSkge1xuICAgIHZhciBpID0gZS5jYWxsKHQsIHIgfHwgXCJkZWZhdWx0XCIpO1xuICAgIGlmIChcIm9iamVjdFwiICE9IHR5cGVvZiBpKSByZXR1cm4gaTtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQEB0b1ByaW1pdGl2ZSBtdXN0IHJldHVybiBhIHByaW1pdGl2ZSB2YWx1ZS5cIik7XG4gIH1cbiAgcmV0dXJuIChcInN0cmluZ1wiID09PSByID8gU3RyaW5nIDogTnVtYmVyKSh0KTtcbn1cbmZ1bmN0aW9uIF90b1Byb3BlcnR5S2V5KHQpIHtcbiAgdmFyIGkgPSBfdG9QcmltaXRpdmUodCwgXCJzdHJpbmdcIik7XG4gIHJldHVybiBcInN5bWJvbFwiID09IHR5cGVvZiBpID8gaSA6IGkgKyBcIlwiO1xufVxuZnVuY3Rpb24gX3R5cGVvZihvKSB7XG4gIFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjtcblxuICByZXR1cm4gX3R5cGVvZiA9IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIFwic3ltYm9sXCIgPT0gdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA/IGZ1bmN0aW9uIChvKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvO1xuICB9IDogZnVuY3Rpb24gKG8pIHtcbiAgICByZXR1cm4gbyAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBvLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgbyAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2YgbztcbiAgfSwgX3R5cGVvZihvKTtcbn1cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShyLCBhKSB7XG4gIGlmIChyKSB7XG4gICAgaWYgKFwic3RyaW5nXCIgPT0gdHlwZW9mIHIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShyLCBhKTtcbiAgICB2YXIgdCA9IHt9LnRvU3RyaW5nLmNhbGwocikuc2xpY2UoOCwgLTEpO1xuICAgIHJldHVybiBcIk9iamVjdFwiID09PSB0ICYmIHIuY29uc3RydWN0b3IgJiYgKHQgPSByLmNvbnN0cnVjdG9yLm5hbWUpLCBcIk1hcFwiID09PSB0IHx8IFwiU2V0XCIgPT09IHQgPyBBcnJheS5mcm9tKHIpIDogXCJBcmd1bWVudHNcIiA9PT0gdCB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdCh0KSA/IF9hcnJheUxpa2VUb0FycmF5KHIsIGEpIDogdm9pZCAwO1xuICB9XG59XG5cbnZhciB2ZXJzaW9uID0gXCIxLjE1LjdcIjtcblxuZnVuY3Rpb24gdXNlckFnZW50KHBhdHRlcm4pIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5uYXZpZ2F0b3IpIHtcbiAgICByZXR1cm4gISEgLypAX19QVVJFX18qL25hdmlnYXRvci51c2VyQWdlbnQubWF0Y2gocGF0dGVybik7XG4gIH1cbn1cbnZhciBJRTExT3JMZXNzID0gdXNlckFnZW50KC8oPzpUcmlkZW50LipydlsgOl0/MTFcXC58bXNpZXxpZW1vYmlsZXxXaW5kb3dzIFBob25lKS9pKTtcbnZhciBFZGdlID0gdXNlckFnZW50KC9FZGdlL2kpO1xudmFyIEZpcmVGb3ggPSB1c2VyQWdlbnQoL2ZpcmVmb3gvaSk7XG52YXIgU2FmYXJpID0gdXNlckFnZW50KC9zYWZhcmkvaSkgJiYgIXVzZXJBZ2VudCgvY2hyb21lL2kpICYmICF1c2VyQWdlbnQoL2FuZHJvaWQvaSk7XG52YXIgSU9TID0gdXNlckFnZW50KC9pUChhZHxvZHxob25lKS9pKTtcbnZhciBDaHJvbWVGb3JBbmRyb2lkID0gdXNlckFnZW50KC9jaHJvbWUvaSkgJiYgdXNlckFnZW50KC9hbmRyb2lkL2kpO1xuXG52YXIgY2FwdHVyZU1vZGUgPSB7XG4gIGNhcHR1cmU6IGZhbHNlLFxuICBwYXNzaXZlOiBmYWxzZVxufTtcbmZ1bmN0aW9uIG9uKGVsLCBldmVudCwgZm4pIHtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZm4sICFJRTExT3JMZXNzICYmIGNhcHR1cmVNb2RlKTtcbn1cbmZ1bmN0aW9uIG9mZihlbCwgZXZlbnQsIGZuKSB7XG4gIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuLCAhSUUxMU9yTGVzcyAmJiBjYXB0dXJlTW9kZSk7XG59XG5mdW5jdGlvbiBtYXRjaGVzKCAvKipIVE1MRWxlbWVudCovZWwsIC8qKlN0cmluZyovc2VsZWN0b3IpIHtcbiAgaWYgKCFzZWxlY3RvcikgcmV0dXJuO1xuICBzZWxlY3RvclswXSA9PT0gJz4nICYmIChzZWxlY3RvciA9IHNlbGVjdG9yLnN1YnN0cmluZygxKSk7XG4gIGlmIChlbCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZWwubWF0Y2hlcykge1xuICAgICAgICByZXR1cm4gZWwubWF0Y2hlcyhzZWxlY3Rvcik7XG4gICAgICB9IGVsc2UgaWYgKGVsLm1zTWF0Y2hlc1NlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiBlbC5tc01hdGNoZXNTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICB9IGVsc2UgaWYgKGVsLndlYmtpdE1hdGNoZXNTZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGdldFBhcmVudE9ySG9zdChlbCkge1xuICByZXR1cm4gZWwuaG9zdCAmJiBlbCAhPT0gZG9jdW1lbnQgJiYgZWwuaG9zdC5ub2RlVHlwZSAmJiBlbC5ob3N0ICE9PSBlbCA/IGVsLmhvc3QgOiBlbC5wYXJlbnROb2RlO1xufVxuZnVuY3Rpb24gY2xvc2VzdCggLyoqSFRNTEVsZW1lbnQqL2VsLCAvKipTdHJpbmcqL3NlbGVjdG9yLCAvKipIVE1MRWxlbWVudCovY3R4LCBpbmNsdWRlQ1RYKSB7XG4gIGlmIChlbCkge1xuICAgIGN0eCA9IGN0eCB8fCBkb2N1bWVudDtcbiAgICBkbyB7XG4gICAgICBpZiAoc2VsZWN0b3IgIT0gbnVsbCAmJiAoc2VsZWN0b3JbMF0gPT09ICc+JyA/IGVsLnBhcmVudE5vZGUgPT09IGN0eCAmJiBtYXRjaGVzKGVsLCBzZWxlY3RvcikgOiBtYXRjaGVzKGVsLCBzZWxlY3RvcikpIHx8IGluY2x1ZGVDVFggJiYgZWwgPT09IGN0eCkge1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9XG4gICAgICBpZiAoZWwgPT09IGN0eCkgYnJlYWs7XG4gICAgICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gICAgfSB3aGlsZSAoZWwgPSBnZXRQYXJlbnRPckhvc3QoZWwpKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbnZhciBSX1NQQUNFID0gL1xccysvZztcbmZ1bmN0aW9uIHRvZ2dsZUNsYXNzKGVsLCBuYW1lLCBzdGF0ZSkge1xuICBpZiAoZWwgJiYgbmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIGVsLmNsYXNzTGlzdFtzdGF0ZSA/ICdhZGQnIDogJ3JlbW92ZSddKG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY2xhc3NOYW1lID0gKCcgJyArIGVsLmNsYXNzTmFtZSArICcgJykucmVwbGFjZShSX1NQQUNFLCAnICcpLnJlcGxhY2UoJyAnICsgbmFtZSArICcgJywgJyAnKTtcbiAgICAgIGVsLmNsYXNzTmFtZSA9IChjbGFzc05hbWUgKyAoc3RhdGUgPyAnICcgKyBuYW1lIDogJycpKS5yZXBsYWNlKFJfU1BBQ0UsICcgJyk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBjc3MoZWwsIHByb3AsIHZhbCkge1xuICB2YXIgc3R5bGUgPSBlbCAmJiBlbC5zdHlsZTtcbiAgaWYgKHN0eWxlKSB7XG4gICAgaWYgKHZhbCA9PT0gdm9pZCAwKSB7XG4gICAgICBpZiAoZG9jdW1lbnQuZGVmYXVsdFZpZXcgJiYgZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICB2YWwgPSBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsLCAnJyk7XG4gICAgICB9IGVsc2UgaWYgKGVsLmN1cnJlbnRTdHlsZSkge1xuICAgICAgICB2YWwgPSBlbC5jdXJyZW50U3R5bGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvcCA9PT0gdm9pZCAwID8gdmFsIDogdmFsW3Byb3BdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIShwcm9wIGluIHN0eWxlKSAmJiBwcm9wLmluZGV4T2YoJ3dlYmtpdCcpID09PSAtMSkge1xuICAgICAgICBwcm9wID0gJy13ZWJraXQtJyArIHByb3A7XG4gICAgICB9XG4gICAgICBzdHlsZVtwcm9wXSA9IHZhbCArICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/ICcnIDogJ3B4Jyk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBtYXRyaXgoZWwsIHNlbGZPbmx5KSB7XG4gIHZhciBhcHBsaWVkVHJhbnNmb3JtcyA9ICcnO1xuICBpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xuICAgIGFwcGxpZWRUcmFuc2Zvcm1zID0gZWw7XG4gIH0gZWxzZSB7XG4gICAgZG8ge1xuICAgICAgdmFyIHRyYW5zZm9ybSA9IGNzcyhlbCwgJ3RyYW5zZm9ybScpO1xuICAgICAgaWYgKHRyYW5zZm9ybSAmJiB0cmFuc2Zvcm0gIT09ICdub25lJykge1xuICAgICAgICBhcHBsaWVkVHJhbnNmb3JtcyA9IHRyYW5zZm9ybSArICcgJyArIGFwcGxpZWRUcmFuc2Zvcm1zO1xuICAgICAgfVxuICAgICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgIH0gd2hpbGUgKCFzZWxmT25seSAmJiAoZWwgPSBlbC5wYXJlbnROb2RlKSk7XG4gIH1cbiAgdmFyIG1hdHJpeEZuID0gd2luZG93LkRPTU1hdHJpeCB8fCB3aW5kb3cuV2ViS2l0Q1NTTWF0cml4IHx8IHdpbmRvdy5DU1NNYXRyaXggfHwgd2luZG93Lk1TQ1NTTWF0cml4O1xuICAvKmpzaGludCAtVzA1NiAqL1xuICByZXR1cm4gbWF0cml4Rm4gJiYgbmV3IG1hdHJpeEZuKGFwcGxpZWRUcmFuc2Zvcm1zKTtcbn1cbmZ1bmN0aW9uIGZpbmQoY3R4LCB0YWdOYW1lLCBpdGVyYXRvcikge1xuICBpZiAoY3R4KSB7XG4gICAgdmFyIGxpc3QgPSBjdHguZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSksXG4gICAgICBpID0gMCxcbiAgICAgIG4gPSBsaXN0Lmxlbmd0aDtcbiAgICBpZiAoaXRlcmF0b3IpIHtcbiAgICAgIGZvciAoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdG9yKGxpc3RbaV0sIGkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuICByZXR1cm4gW107XG59XG5mdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCkge1xuICB2YXIgc2Nyb2xsaW5nRWxlbWVudCA9IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQ7XG4gIGlmIChzY3JvbGxpbmdFbGVtZW50KSB7XG4gICAgcmV0dXJuIHNjcm9sbGluZ0VsZW1lbnQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgfVxufVxuXG4vKipcclxuICogUmV0dXJucyB0aGUgXCJib3VuZGluZyBjbGllbnQgcmVjdFwiIG9mIGdpdmVuIGVsZW1lbnRcclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsICAgICAgICAgICAgICAgICAgICAgICBUaGUgZWxlbWVudCB3aG9zZSBib3VuZGluZ0NsaWVudFJlY3QgaXMgd2FudGVkXHJcbiAqIEBwYXJhbSAge1tCb29sZWFuXX0gcmVsYXRpdmVUb0NvbnRhaW5pbmdCbG9jayAgV2hldGhlciB0aGUgcmVjdCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGNvbnRhaW5pbmcgYmxvY2sgb2YgKGluY2x1ZGluZykgdGhlIGNvbnRhaW5lclxyXG4gKiBAcGFyYW0gIHtbQm9vbGVhbl19IHJlbGF0aXZlVG9Ob25TdGF0aWNQYXJlbnQgIFdoZXRoZXIgdGhlIHJlY3Qgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSByZWxhdGl2ZSBwYXJlbnQgb2YgKGluY2x1ZGluZykgdGhlIGNvbnRhaWVuclxyXG4gKiBAcGFyYW0gIHtbQm9vbGVhbl19IHVuZG9TY2FsZSAgICAgICAgICAgICAgICAgIFdoZXRoZXIgdGhlIGNvbnRhaW5lcidzIHNjYWxlKCkgc2hvdWxkIGJlIHVuZG9uZVxyXG4gKiBAcGFyYW0gIHtbSFRNTEVsZW1lbnRdfSBjb250YWluZXIgICAgICAgICAgICAgIFRoZSBwYXJlbnQgdGhlIGVsZW1lbnQgd2lsbCBiZSBwbGFjZWQgaW5cclxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgYm91bmRpbmdDbGllbnRSZWN0IG9mIGVsLCB3aXRoIHNwZWNpZmllZCBhZGp1c3RtZW50c1xyXG4gKi9cbmZ1bmN0aW9uIGdldFJlY3QoZWwsIHJlbGF0aXZlVG9Db250YWluaW5nQmxvY2ssIHJlbGF0aXZlVG9Ob25TdGF0aWNQYXJlbnQsIHVuZG9TY2FsZSwgY29udGFpbmVyKSB7XG4gIGlmICghZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ICYmIGVsICE9PSB3aW5kb3cpIHJldHVybjtcbiAgdmFyIGVsUmVjdCwgdG9wLCBsZWZ0LCBib3R0b20sIHJpZ2h0LCBoZWlnaHQsIHdpZHRoO1xuICBpZiAoZWwgIT09IHdpbmRvdyAmJiBlbC5wYXJlbnROb2RlICYmIGVsICE9PSBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCkpIHtcbiAgICBlbFJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB0b3AgPSBlbFJlY3QudG9wO1xuICAgIGxlZnQgPSBlbFJlY3QubGVmdDtcbiAgICBib3R0b20gPSBlbFJlY3QuYm90dG9tO1xuICAgIHJpZ2h0ID0gZWxSZWN0LnJpZ2h0O1xuICAgIGhlaWdodCA9IGVsUmVjdC5oZWlnaHQ7XG4gICAgd2lkdGggPSBlbFJlY3Qud2lkdGg7XG4gIH0gZWxzZSB7XG4gICAgdG9wID0gMDtcbiAgICBsZWZ0ID0gMDtcbiAgICBib3R0b20gPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgcmlnaHQgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgfVxuICBpZiAoKHJlbGF0aXZlVG9Db250YWluaW5nQmxvY2sgfHwgcmVsYXRpdmVUb05vblN0YXRpY1BhcmVudCkgJiYgZWwgIT09IHdpbmRvdykge1xuICAgIC8vIEFkanVzdCBmb3IgdHJhbnNsYXRlKClcbiAgICBjb250YWluZXIgPSBjb250YWluZXIgfHwgZWwucGFyZW50Tm9kZTtcblxuICAgIC8vIHNvbHZlcyAjMTEyMyAoc2VlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzc5NTM4MDYvNjA4ODMxMilcbiAgICAvLyBOb3QgbmVlZGVkIG9uIDw9IElFMTFcbiAgICBpZiAoIUlFMTFPckxlc3MpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKGNvbnRhaW5lciAmJiBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ICYmIChjc3MoY29udGFpbmVyLCAndHJhbnNmb3JtJykgIT09ICdub25lJyB8fCByZWxhdGl2ZVRvTm9uU3RhdGljUGFyZW50ICYmIGNzcyhjb250YWluZXIsICdwb3NpdGlvbicpICE9PSAnc3RhdGljJykpIHtcbiAgICAgICAgICB2YXIgY29udGFpbmVyUmVjdCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgIC8vIFNldCByZWxhdGl2ZSB0byBlZGdlcyBvZiBwYWRkaW5nIGJveCBvZiBjb250YWluZXJcbiAgICAgICAgICB0b3AgLT0gY29udGFpbmVyUmVjdC50b3AgKyBwYXJzZUludChjc3MoY29udGFpbmVyLCAnYm9yZGVyLXRvcC13aWR0aCcpKTtcbiAgICAgICAgICBsZWZ0IC09IGNvbnRhaW5lclJlY3QubGVmdCArIHBhcnNlSW50KGNzcyhjb250YWluZXIsICdib3JkZXItbGVmdC13aWR0aCcpKTtcbiAgICAgICAgICBib3R0b20gPSB0b3AgKyBlbFJlY3QuaGVpZ2h0O1xuICAgICAgICAgIHJpZ2h0ID0gbGVmdCArIGVsUmVjdC53aWR0aDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gICAgICB9IHdoaWxlIChjb250YWluZXIgPSBjb250YWluZXIucGFyZW50Tm9kZSk7XG4gICAgfVxuICB9XG4gIGlmICh1bmRvU2NhbGUgJiYgZWwgIT09IHdpbmRvdykge1xuICAgIC8vIEFkanVzdCBmb3Igc2NhbGUoKVxuICAgIHZhciBlbE1hdHJpeCA9IG1hdHJpeChjb250YWluZXIgfHwgZWwpLFxuICAgICAgc2NhbGVYID0gZWxNYXRyaXggJiYgZWxNYXRyaXguYSxcbiAgICAgIHNjYWxlWSA9IGVsTWF0cml4ICYmIGVsTWF0cml4LmQ7XG4gICAgaWYgKGVsTWF0cml4KSB7XG4gICAgICB0b3AgLz0gc2NhbGVZO1xuICAgICAgbGVmdCAvPSBzY2FsZVg7XG4gICAgICB3aWR0aCAvPSBzY2FsZVg7XG4gICAgICBoZWlnaHQgLz0gc2NhbGVZO1xuICAgICAgYm90dG9tID0gdG9wICsgaGVpZ2h0O1xuICAgICAgcmlnaHQgPSBsZWZ0ICsgd2lkdGg7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgdG9wOiB0b3AsXG4gICAgbGVmdDogbGVmdCxcbiAgICBib3R0b206IGJvdHRvbSxcbiAgICByaWdodDogcmlnaHQsXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0XG4gIH07XG59XG5cbi8qKlxyXG4gKiBDaGVja3MgaWYgYSBzaWRlIG9mIGFuIGVsZW1lbnQgaXMgc2Nyb2xsZWQgcGFzdCBhIHNpZGUgb2YgaXRzIHBhcmVudHNcclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICBlbCAgICAgICAgICAgVGhlIGVsZW1lbnQgd2hvJ3Mgc2lkZSBiZWluZyBzY3JvbGxlZCBvdXQgb2YgdmlldyBpcyBpbiBxdWVzdGlvblxyXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgIGVsU2lkZSAgICAgICBTaWRlIG9mIHRoZSBlbGVtZW50IGluIHF1ZXN0aW9uICgndG9wJywgJ2xlZnQnLCAncmlnaHQnLCAnYm90dG9tJylcclxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICBwYXJlbnRTaWRlICAgU2lkZSBvZiB0aGUgcGFyZW50IGluIHF1ZXN0aW9uICgndG9wJywgJ2xlZnQnLCAncmlnaHQnLCAnYm90dG9tJylcclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgICAgICAgVGhlIHBhcmVudCBzY3JvbGwgZWxlbWVudCB0aGF0IHRoZSBlbCdzIHNpZGUgaXMgc2Nyb2xsZWQgcGFzdCwgb3IgbnVsbCBpZiB0aGVyZSBpcyBubyBzdWNoIGVsZW1lbnRcclxuICovXG5mdW5jdGlvbiBpc1Njcm9sbGVkUGFzdChlbCwgZWxTaWRlLCBwYXJlbnRTaWRlKSB7XG4gIHZhciBwYXJlbnQgPSBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChlbCwgdHJ1ZSksXG4gICAgZWxTaWRlVmFsID0gZ2V0UmVjdChlbClbZWxTaWRlXTtcblxuICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICB2YXIgcGFyZW50U2lkZVZhbCA9IGdldFJlY3QocGFyZW50KVtwYXJlbnRTaWRlXSxcbiAgICAgIHZpc2libGUgPSB2b2lkIDA7XG4gICAgaWYgKHBhcmVudFNpZGUgPT09ICd0b3AnIHx8IHBhcmVudFNpZGUgPT09ICdsZWZ0Jykge1xuICAgICAgdmlzaWJsZSA9IGVsU2lkZVZhbCA+PSBwYXJlbnRTaWRlVmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICB2aXNpYmxlID0gZWxTaWRlVmFsIDw9IHBhcmVudFNpZGVWYWw7XG4gICAgfVxuICAgIGlmICghdmlzaWJsZSkgcmV0dXJuIHBhcmVudDtcbiAgICBpZiAocGFyZW50ID09PSBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCkpIGJyZWFrO1xuICAgIHBhcmVudCA9IGdldFBhcmVudEF1dG9TY3JvbGxFbGVtZW50KHBhcmVudCwgZmFsc2UpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXHJcbiAqIEdldHMgbnRoIGNoaWxkIG9mIGVsLCBpZ25vcmluZyBoaWRkZW4gY2hpbGRyZW4sIHNvcnRhYmxlJ3MgZWxlbWVudHMgKGRvZXMgbm90IGlnbm9yZSBjbG9uZSBpZiBpdCdzIHZpc2libGUpXHJcbiAqIGFuZCBub24tZHJhZ2dhYmxlIGVsZW1lbnRzXHJcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbCAgICAgICBUaGUgcGFyZW50IGVsZW1lbnRcclxuICogQHBhcmFtICB7TnVtYmVyfSBjaGlsZE51bSAgICAgIFRoZSBpbmRleCBvZiB0aGUgY2hpbGRcclxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zICAgICAgIFBhcmVudCBTb3J0YWJsZSdzIG9wdGlvbnNcclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgIFRoZSBjaGlsZCBhdCBpbmRleCBjaGlsZE51bSwgb3IgbnVsbCBpZiBub3QgZm91bmRcclxuICovXG5mdW5jdGlvbiBnZXRDaGlsZChlbCwgY2hpbGROdW0sIG9wdGlvbnMsIGluY2x1ZGVEcmFnRWwpIHtcbiAgdmFyIGN1cnJlbnRDaGlsZCA9IDAsXG4gICAgaSA9IDAsXG4gICAgY2hpbGRyZW4gPSBlbC5jaGlsZHJlbjtcbiAgd2hpbGUgKGkgPCBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICBpZiAoY2hpbGRyZW5baV0uc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnICYmIGNoaWxkcmVuW2ldICE9PSBTb3J0YWJsZS5naG9zdCAmJiAoaW5jbHVkZURyYWdFbCB8fCBjaGlsZHJlbltpXSAhPT0gU29ydGFibGUuZHJhZ2dlZCkgJiYgY2xvc2VzdChjaGlsZHJlbltpXSwgb3B0aW9ucy5kcmFnZ2FibGUsIGVsLCBmYWxzZSkpIHtcbiAgICAgIGlmIChjdXJyZW50Q2hpbGQgPT09IGNoaWxkTnVtKSB7XG4gICAgICAgIHJldHVybiBjaGlsZHJlbltpXTtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnRDaGlsZCsrO1xuICAgIH1cbiAgICBpKys7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxyXG4gKiBHZXRzIHRoZSBsYXN0IGNoaWxkIGluIHRoZSBlbCwgaWdub3JpbmcgZ2hvc3RFbCBvciBpbnZpc2libGUgZWxlbWVudHMgKGNsb25lcylcclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsICAgICAgIFBhcmVudCBlbGVtZW50XHJcbiAqIEBwYXJhbSAge3NlbGVjdG9yfSBzZWxlY3RvciAgICBBbnkgb3RoZXIgZWxlbWVudHMgdGhhdCBzaG91bGQgYmUgaWdub3JlZFxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICAgICAgVGhlIGxhc3QgY2hpbGQsIGlnbm9yaW5nIGdob3N0RWxcclxuICovXG5mdW5jdGlvbiBsYXN0Q2hpbGQoZWwsIHNlbGVjdG9yKSB7XG4gIHZhciBsYXN0ID0gZWwubGFzdEVsZW1lbnRDaGlsZDtcbiAgd2hpbGUgKGxhc3QgJiYgKGxhc3QgPT09IFNvcnRhYmxlLmdob3N0IHx8IGNzcyhsYXN0LCAnZGlzcGxheScpID09PSAnbm9uZScgfHwgc2VsZWN0b3IgJiYgIW1hdGNoZXMobGFzdCwgc2VsZWN0b3IpKSkge1xuICAgIGxhc3QgPSBsYXN0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gIH1cbiAgcmV0dXJuIGxhc3QgfHwgbnVsbDtcbn1cblxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGluZGV4IG9mIGFuIGVsZW1lbnQgd2l0aGluIGl0cyBwYXJlbnQgZm9yIGEgc2VsZWN0ZWQgc2V0IG9mXHJcbiAqIGVsZW1lbnRzXHJcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbFxyXG4gKiBAcGFyYW0gIHtzZWxlY3Rvcn0gc2VsZWN0b3JcclxuICogQHJldHVybiB7bnVtYmVyfVxyXG4gKi9cbmZ1bmN0aW9uIGluZGV4KGVsLCBzZWxlY3Rvcikge1xuICB2YXIgaW5kZXggPSAwO1xuICBpZiAoIWVsIHx8ICFlbC5wYXJlbnROb2RlKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICB3aGlsZSAoZWwgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSB7XG4gICAgaWYgKGVsLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgIT09ICdURU1QTEFURScgJiYgZWwgIT09IFNvcnRhYmxlLmNsb25lICYmICghc2VsZWN0b3IgfHwgbWF0Y2hlcyhlbCwgc2VsZWN0b3IpKSkge1xuICAgICAgaW5kZXgrKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGluZGV4O1xufVxuXG4vKipcclxuICogUmV0dXJucyB0aGUgc2Nyb2xsIG9mZnNldCBvZiB0aGUgZ2l2ZW4gZWxlbWVudCwgYWRkZWQgd2l0aCBhbGwgdGhlIHNjcm9sbCBvZmZzZXRzIG9mIHBhcmVudCBlbGVtZW50cy5cclxuICogVGhlIHZhbHVlIGlzIHJldHVybmVkIGluIHJlYWwgcGl4ZWxzLlxyXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxcclxuICogQHJldHVybiB7QXJyYXl9ICAgICAgICAgICAgIE9mZnNldHMgaW4gdGhlIGZvcm1hdCBvZiBbbGVmdCwgdG9wXVxyXG4gKi9cbmZ1bmN0aW9uIGdldFJlbGF0aXZlU2Nyb2xsT2Zmc2V0KGVsKSB7XG4gIHZhciBvZmZzZXRMZWZ0ID0gMCxcbiAgICBvZmZzZXRUb3AgPSAwLFxuICAgIHdpblNjcm9sbGVyID0gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xuICBpZiAoZWwpIHtcbiAgICBkbyB7XG4gICAgICB2YXIgZWxNYXRyaXggPSBtYXRyaXgoZWwpLFxuICAgICAgICBzY2FsZVggPSBlbE1hdHJpeC5hLFxuICAgICAgICBzY2FsZVkgPSBlbE1hdHJpeC5kO1xuICAgICAgb2Zmc2V0TGVmdCArPSBlbC5zY3JvbGxMZWZ0ICogc2NhbGVYO1xuICAgICAgb2Zmc2V0VG9wICs9IGVsLnNjcm9sbFRvcCAqIHNjYWxlWTtcbiAgICB9IHdoaWxlIChlbCAhPT0gd2luU2Nyb2xsZXIgJiYgKGVsID0gZWwucGFyZW50Tm9kZSkpO1xuICB9XG4gIHJldHVybiBbb2Zmc2V0TGVmdCwgb2Zmc2V0VG9wXTtcbn1cblxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBvYmplY3Qgd2l0aGluIHRoZSBnaXZlbiBhcnJheVxyXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyICAgQXJyYXkgdGhhdCBtYXkgb3IgbWF5IG5vdCBob2xkIHRoZSBvYmplY3RcclxuICogQHBhcmFtICB7T2JqZWN0fSBvYmogIEFuIG9iamVjdCB0aGF0IGhhcyBhIGtleS12YWx1ZSBwYWlyIHVuaXF1ZSB0byBhbmQgaWRlbnRpY2FsIHRvIGEga2V5LXZhbHVlIHBhaXIgaW4gdGhlIG9iamVjdCB5b3Ugd2FudCB0byBmaW5kXHJcbiAqIEByZXR1cm4ge051bWJlcn0gICAgICBUaGUgaW5kZXggb2YgdGhlIG9iamVjdCBpbiB0aGUgYXJyYXksIG9yIC0xXHJcbiAqL1xuZnVuY3Rpb24gaW5kZXhPZk9iamVjdChhcnIsIG9iaikge1xuICBmb3IgKHZhciBpIGluIGFycikge1xuICAgIGlmICghYXJyLmhhc093blByb3BlcnR5KGkpKSBjb250aW51ZTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkgJiYgb2JqW2tleV0gPT09IGFycltpXVtrZXldKSByZXR1cm4gTnVtYmVyKGkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5mdW5jdGlvbiBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChlbCwgaW5jbHVkZVNlbGYpIHtcbiAgLy8gc2tpcCB0byB3aW5kb3dcbiAgaWYgKCFlbCB8fCAhZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSByZXR1cm4gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xuICB2YXIgZWxlbSA9IGVsO1xuICB2YXIgZ290U2VsZiA9IGZhbHNlO1xuICBkbyB7XG4gICAgLy8gd2UgZG9uJ3QgbmVlZCB0byBnZXQgZWxlbSBjc3MgaWYgaXQgaXNuJ3QgZXZlbiBvdmVyZmxvd2luZyBpbiB0aGUgZmlyc3QgcGxhY2UgKHBlcmZvcm1hbmNlKVxuICAgIGlmIChlbGVtLmNsaWVudFdpZHRoIDwgZWxlbS5zY3JvbGxXaWR0aCB8fCBlbGVtLmNsaWVudEhlaWdodCA8IGVsZW0uc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICB2YXIgZWxlbUNTUyA9IGNzcyhlbGVtKTtcbiAgICAgIGlmIChlbGVtLmNsaWVudFdpZHRoIDwgZWxlbS5zY3JvbGxXaWR0aCAmJiAoZWxlbUNTUy5vdmVyZmxvd1ggPT0gJ2F1dG8nIHx8IGVsZW1DU1Mub3ZlcmZsb3dYID09ICdzY3JvbGwnKSB8fCBlbGVtLmNsaWVudEhlaWdodCA8IGVsZW0uc2Nyb2xsSGVpZ2h0ICYmIChlbGVtQ1NTLm92ZXJmbG93WSA9PSAnYXV0bycgfHwgZWxlbUNTUy5vdmVyZmxvd1kgPT0gJ3Njcm9sbCcpKSB7XG4gICAgICAgIGlmICghZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QgfHwgZWxlbSA9PT0gZG9jdW1lbnQuYm9keSkgcmV0dXJuIGdldFdpbmRvd1Njcm9sbGluZ0VsZW1lbnQoKTtcbiAgICAgICAgaWYgKGdvdFNlbGYgfHwgaW5jbHVkZVNlbGYpIHJldHVybiBlbGVtO1xuICAgICAgICBnb3RTZWxmID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICB9IHdoaWxlIChlbGVtID0gZWxlbS5wYXJlbnROb2RlKTtcbiAgcmV0dXJuIGdldFdpbmRvd1Njcm9sbGluZ0VsZW1lbnQoKTtcbn1cbmZ1bmN0aW9uIGV4dGVuZChkc3QsIHNyYykge1xuICBpZiAoZHN0ICYmIHNyYykge1xuICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZHN0O1xufVxuZnVuY3Rpb24gaXNSZWN0RXF1YWwocmVjdDEsIHJlY3QyKSB7XG4gIHJldHVybiBNYXRoLnJvdW5kKHJlY3QxLnRvcCkgPT09IE1hdGgucm91bmQocmVjdDIudG9wKSAmJiBNYXRoLnJvdW5kKHJlY3QxLmxlZnQpID09PSBNYXRoLnJvdW5kKHJlY3QyLmxlZnQpICYmIE1hdGgucm91bmQocmVjdDEuaGVpZ2h0KSA9PT0gTWF0aC5yb3VuZChyZWN0Mi5oZWlnaHQpICYmIE1hdGgucm91bmQocmVjdDEud2lkdGgpID09PSBNYXRoLnJvdW5kKHJlY3QyLndpZHRoKTtcbn1cbnZhciBfdGhyb3R0bGVUaW1lb3V0O1xuZnVuY3Rpb24gdGhyb3R0bGUoY2FsbGJhY2ssIG1zKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFfdGhyb3R0bGVUaW1lb3V0KSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoX3RoaXMsIGFyZ3NbMF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoX3RoaXMsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgX3Rocm90dGxlVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhyb3R0bGVUaW1lb3V0ID0gdm9pZCAwO1xuICAgICAgfSwgbXMpO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIGNhbmNlbFRocm90dGxlKCkge1xuICBjbGVhclRpbWVvdXQoX3Rocm90dGxlVGltZW91dCk7XG4gIF90aHJvdHRsZVRpbWVvdXQgPSB2b2lkIDA7XG59XG5mdW5jdGlvbiBzY3JvbGxCeShlbCwgeCwgeSkge1xuICBlbC5zY3JvbGxMZWZ0ICs9IHg7XG4gIGVsLnNjcm9sbFRvcCArPSB5O1xufVxuZnVuY3Rpb24gY2xvbmUoZWwpIHtcbiAgdmFyIFBvbHltZXIgPSB3aW5kb3cuUG9seW1lcjtcbiAgdmFyICQgPSB3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0bztcbiAgaWYgKFBvbHltZXIgJiYgUG9seW1lci5kb20pIHtcbiAgICByZXR1cm4gUG9seW1lci5kb20oZWwpLmNsb25lTm9kZSh0cnVlKTtcbiAgfSBlbHNlIGlmICgkKSB7XG4gICAgcmV0dXJuICQoZWwpLmNsb25lKHRydWUpWzBdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBlbC5jbG9uZU5vZGUodHJ1ZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIHNldFJlY3QoZWwsIHJlY3QpIHtcbiAgY3NzKGVsLCAncG9zaXRpb24nLCAnYWJzb2x1dGUnKTtcbiAgY3NzKGVsLCAndG9wJywgcmVjdC50b3ApO1xuICBjc3MoZWwsICdsZWZ0JywgcmVjdC5sZWZ0KTtcbiAgY3NzKGVsLCAnd2lkdGgnLCByZWN0LndpZHRoKTtcbiAgY3NzKGVsLCAnaGVpZ2h0JywgcmVjdC5oZWlnaHQpO1xufVxuZnVuY3Rpb24gdW5zZXRSZWN0KGVsKSB7XG4gIGNzcyhlbCwgJ3Bvc2l0aW9uJywgJycpO1xuICBjc3MoZWwsICd0b3AnLCAnJyk7XG4gIGNzcyhlbCwgJ2xlZnQnLCAnJyk7XG4gIGNzcyhlbCwgJ3dpZHRoJywgJycpO1xuICBjc3MoZWwsICdoZWlnaHQnLCAnJyk7XG59XG5mdW5jdGlvbiBnZXRDaGlsZENvbnRhaW5pbmdSZWN0RnJvbUVsZW1lbnQoY29udGFpbmVyLCBvcHRpb25zLCBnaG9zdEVsKSB7XG4gIHZhciByZWN0ID0ge307XG4gIEFycmF5LmZyb20oY29udGFpbmVyLmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHZhciBfcmVjdCRsZWZ0LCBfcmVjdCR0b3AsIF9yZWN0JHJpZ2h0LCBfcmVjdCRib3R0b207XG4gICAgaWYgKCFjbG9zZXN0KGNoaWxkLCBvcHRpb25zLmRyYWdnYWJsZSwgY29udGFpbmVyLCBmYWxzZSkgfHwgY2hpbGQuYW5pbWF0ZWQgfHwgY2hpbGQgPT09IGdob3N0RWwpIHJldHVybjtcbiAgICB2YXIgY2hpbGRSZWN0ID0gZ2V0UmVjdChjaGlsZCk7XG4gICAgcmVjdC5sZWZ0ID0gTWF0aC5taW4oKF9yZWN0JGxlZnQgPSByZWN0LmxlZnQpICE9PSBudWxsICYmIF9yZWN0JGxlZnQgIT09IHZvaWQgMCA/IF9yZWN0JGxlZnQgOiBJbmZpbml0eSwgY2hpbGRSZWN0LmxlZnQpO1xuICAgIHJlY3QudG9wID0gTWF0aC5taW4oKF9yZWN0JHRvcCA9IHJlY3QudG9wKSAhPT0gbnVsbCAmJiBfcmVjdCR0b3AgIT09IHZvaWQgMCA/IF9yZWN0JHRvcCA6IEluZmluaXR5LCBjaGlsZFJlY3QudG9wKTtcbiAgICByZWN0LnJpZ2h0ID0gTWF0aC5tYXgoKF9yZWN0JHJpZ2h0ID0gcmVjdC5yaWdodCkgIT09IG51bGwgJiYgX3JlY3QkcmlnaHQgIT09IHZvaWQgMCA/IF9yZWN0JHJpZ2h0IDogLUluZmluaXR5LCBjaGlsZFJlY3QucmlnaHQpO1xuICAgIHJlY3QuYm90dG9tID0gTWF0aC5tYXgoKF9yZWN0JGJvdHRvbSA9IHJlY3QuYm90dG9tKSAhPT0gbnVsbCAmJiBfcmVjdCRib3R0b20gIT09IHZvaWQgMCA/IF9yZWN0JGJvdHRvbSA6IC1JbmZpbml0eSwgY2hpbGRSZWN0LmJvdHRvbSk7XG4gIH0pO1xuICByZWN0LndpZHRoID0gcmVjdC5yaWdodCAtIHJlY3QubGVmdDtcbiAgcmVjdC5oZWlnaHQgPSByZWN0LmJvdHRvbSAtIHJlY3QudG9wO1xuICByZWN0LnggPSByZWN0LmxlZnQ7XG4gIHJlY3QueSA9IHJlY3QudG9wO1xuICByZXR1cm4gcmVjdDtcbn1cbnZhciBleHBhbmRvID0gJ1NvcnRhYmxlJyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG5mdW5jdGlvbiBBbmltYXRpb25TdGF0ZU1hbmFnZXIoKSB7XG4gIHZhciBhbmltYXRpb25TdGF0ZXMgPSBbXSxcbiAgICBhbmltYXRpb25DYWxsYmFja0lkO1xuICByZXR1cm4ge1xuICAgIGNhcHR1cmVBbmltYXRpb25TdGF0ZTogZnVuY3Rpb24gY2FwdHVyZUFuaW1hdGlvblN0YXRlKCkge1xuICAgICAgYW5pbWF0aW9uU3RhdGVzID0gW107XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5hbmltYXRpb24pIHJldHVybjtcbiAgICAgIHZhciBjaGlsZHJlbiA9IFtdLnNsaWNlLmNhbGwodGhpcy5lbC5jaGlsZHJlbik7XG4gICAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICBpZiAoY3NzKGNoaWxkLCAnZGlzcGxheScpID09PSAnbm9uZScgfHwgY2hpbGQgPT09IFNvcnRhYmxlLmdob3N0KSByZXR1cm47XG4gICAgICAgIGFuaW1hdGlvblN0YXRlcy5wdXNoKHtcbiAgICAgICAgICB0YXJnZXQ6IGNoaWxkLFxuICAgICAgICAgIHJlY3Q6IGdldFJlY3QoY2hpbGQpXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZnJvbVJlY3QgPSBfb2JqZWN0U3ByZWFkMih7fSwgYW5pbWF0aW9uU3RhdGVzW2FuaW1hdGlvblN0YXRlcy5sZW5ndGggLSAxXS5yZWN0KTtcblxuICAgICAgICAvLyBJZiBhbmltYXRpbmc6IGNvbXBlbnNhdGUgZm9yIGN1cnJlbnQgYW5pbWF0aW9uXG4gICAgICAgIGlmIChjaGlsZC50aGlzQW5pbWF0aW9uRHVyYXRpb24pIHtcbiAgICAgICAgICB2YXIgY2hpbGRNYXRyaXggPSBtYXRyaXgoY2hpbGQsIHRydWUpO1xuICAgICAgICAgIGlmIChjaGlsZE1hdHJpeCkge1xuICAgICAgICAgICAgZnJvbVJlY3QudG9wIC09IGNoaWxkTWF0cml4LmY7XG4gICAgICAgICAgICBmcm9tUmVjdC5sZWZ0IC09IGNoaWxkTWF0cml4LmU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNoaWxkLmZyb21SZWN0ID0gZnJvbVJlY3Q7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGFkZEFuaW1hdGlvblN0YXRlOiBmdW5jdGlvbiBhZGRBbmltYXRpb25TdGF0ZShzdGF0ZSkge1xuICAgICAgYW5pbWF0aW9uU3RhdGVzLnB1c2goc3RhdGUpO1xuICAgIH0sXG4gICAgcmVtb3ZlQW5pbWF0aW9uU3RhdGU6IGZ1bmN0aW9uIHJlbW92ZUFuaW1hdGlvblN0YXRlKHRhcmdldCkge1xuICAgICAgYW5pbWF0aW9uU3RhdGVzLnNwbGljZShpbmRleE9mT2JqZWN0KGFuaW1hdGlvblN0YXRlcywge1xuICAgICAgICB0YXJnZXQ6IHRhcmdldFxuICAgICAgfSksIDEpO1xuICAgIH0sXG4gICAgYW5pbWF0ZUFsbDogZnVuY3Rpb24gYW5pbWF0ZUFsbChjYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmFuaW1hdGlvbikge1xuICAgICAgICBjbGVhclRpbWVvdXQoYW5pbWF0aW9uQ2FsbGJhY2tJZCk7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBhbmltYXRpbmcgPSBmYWxzZSxcbiAgICAgICAgYW5pbWF0aW9uVGltZSA9IDA7XG4gICAgICBhbmltYXRpb25TdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgdmFyIHRpbWUgPSAwLFxuICAgICAgICAgIHRhcmdldCA9IHN0YXRlLnRhcmdldCxcbiAgICAgICAgICBmcm9tUmVjdCA9IHRhcmdldC5mcm9tUmVjdCxcbiAgICAgICAgICB0b1JlY3QgPSBnZXRSZWN0KHRhcmdldCksXG4gICAgICAgICAgcHJldkZyb21SZWN0ID0gdGFyZ2V0LnByZXZGcm9tUmVjdCxcbiAgICAgICAgICBwcmV2VG9SZWN0ID0gdGFyZ2V0LnByZXZUb1JlY3QsXG4gICAgICAgICAgYW5pbWF0aW5nUmVjdCA9IHN0YXRlLnJlY3QsXG4gICAgICAgICAgdGFyZ2V0TWF0cml4ID0gbWF0cml4KHRhcmdldCwgdHJ1ZSk7XG4gICAgICAgIGlmICh0YXJnZXRNYXRyaXgpIHtcbiAgICAgICAgICAvLyBDb21wZW5zYXRlIGZvciBjdXJyZW50IGFuaW1hdGlvblxuICAgICAgICAgIHRvUmVjdC50b3AgLT0gdGFyZ2V0TWF0cml4LmY7XG4gICAgICAgICAgdG9SZWN0LmxlZnQgLT0gdGFyZ2V0TWF0cml4LmU7XG4gICAgICAgIH1cbiAgICAgICAgdGFyZ2V0LnRvUmVjdCA9IHRvUmVjdDtcbiAgICAgICAgaWYgKHRhcmdldC50aGlzQW5pbWF0aW9uRHVyYXRpb24pIHtcbiAgICAgICAgICAvLyBDb3VsZCBhbHNvIGNoZWNrIGlmIGFuaW1hdGluZ1JlY3QgaXMgYmV0d2VlbiBmcm9tUmVjdCBhbmQgdG9SZWN0XG4gICAgICAgICAgaWYgKGlzUmVjdEVxdWFsKHByZXZGcm9tUmVjdCwgdG9SZWN0KSAmJiAhaXNSZWN0RXF1YWwoZnJvbVJlY3QsIHRvUmVjdCkgJiZcbiAgICAgICAgICAvLyBNYWtlIHN1cmUgYW5pbWF0aW5nUmVjdCBpcyBvbiBsaW5lIGJldHdlZW4gdG9SZWN0ICYgZnJvbVJlY3RcbiAgICAgICAgICAoYW5pbWF0aW5nUmVjdC50b3AgLSB0b1JlY3QudG9wKSAvIChhbmltYXRpbmdSZWN0LmxlZnQgLSB0b1JlY3QubGVmdCkgPT09IChmcm9tUmVjdC50b3AgLSB0b1JlY3QudG9wKSAvIChmcm9tUmVjdC5sZWZ0IC0gdG9SZWN0LmxlZnQpKSB7XG4gICAgICAgICAgICAvLyBJZiByZXR1cm5pbmcgdG8gc2FtZSBwbGFjZSBhcyBzdGFydGVkIGZyb20gYW5pbWF0aW9uIGFuZCBvbiBzYW1lIGF4aXNcbiAgICAgICAgICAgIHRpbWUgPSBjYWxjdWxhdGVSZWFsVGltZShhbmltYXRpbmdSZWN0LCBwcmV2RnJvbVJlY3QsIHByZXZUb1JlY3QsIF90aGlzLm9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGZyb21SZWN0ICE9IHRvUmVjdDogYW5pbWF0ZVxuICAgICAgICBpZiAoIWlzUmVjdEVxdWFsKHRvUmVjdCwgZnJvbVJlY3QpKSB7XG4gICAgICAgICAgdGFyZ2V0LnByZXZGcm9tUmVjdCA9IGZyb21SZWN0O1xuICAgICAgICAgIHRhcmdldC5wcmV2VG9SZWN0ID0gdG9SZWN0O1xuICAgICAgICAgIGlmICghdGltZSkge1xuICAgICAgICAgICAgdGltZSA9IF90aGlzLm9wdGlvbnMuYW5pbWF0aW9uO1xuICAgICAgICAgIH1cbiAgICAgICAgICBfdGhpcy5hbmltYXRlKHRhcmdldCwgYW5pbWF0aW5nUmVjdCwgdG9SZWN0LCB0aW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGltZSkge1xuICAgICAgICAgIGFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgYW5pbWF0aW9uVGltZSA9IE1hdGgubWF4KGFuaW1hdGlvblRpbWUsIHRpbWUpO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0YXJnZXQuYW5pbWF0aW9uUmVzZXRUaW1lcik7XG4gICAgICAgICAgdGFyZ2V0LmFuaW1hdGlvblJlc2V0VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRhcmdldC5hbmltYXRpb25UaW1lID0gMDtcbiAgICAgICAgICAgIHRhcmdldC5wcmV2RnJvbVJlY3QgPSBudWxsO1xuICAgICAgICAgICAgdGFyZ2V0LmZyb21SZWN0ID0gbnVsbDtcbiAgICAgICAgICAgIHRhcmdldC5wcmV2VG9SZWN0ID0gbnVsbDtcbiAgICAgICAgICAgIHRhcmdldC50aGlzQW5pbWF0aW9uRHVyYXRpb24gPSBudWxsO1xuICAgICAgICAgIH0sIHRpbWUpO1xuICAgICAgICAgIHRhcmdldC50aGlzQW5pbWF0aW9uRHVyYXRpb24gPSB0aW1lO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNsZWFyVGltZW91dChhbmltYXRpb25DYWxsYmFja0lkKTtcbiAgICAgIGlmICghYW5pbWF0aW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbmltYXRpb25DYWxsYmFja0lkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcbiAgICAgICAgfSwgYW5pbWF0aW9uVGltZSk7XG4gICAgICB9XG4gICAgICBhbmltYXRpb25TdGF0ZXMgPSBbXTtcbiAgICB9LFxuICAgIGFuaW1hdGU6IGZ1bmN0aW9uIGFuaW1hdGUodGFyZ2V0LCBjdXJyZW50UmVjdCwgdG9SZWN0LCBkdXJhdGlvbikge1xuICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgIGNzcyh0YXJnZXQsICd0cmFuc2l0aW9uJywgJycpO1xuICAgICAgICBjc3ModGFyZ2V0LCAndHJhbnNmb3JtJywgJycpO1xuICAgICAgICB2YXIgZWxNYXRyaXggPSBtYXRyaXgodGhpcy5lbCksXG4gICAgICAgICAgc2NhbGVYID0gZWxNYXRyaXggJiYgZWxNYXRyaXguYSxcbiAgICAgICAgICBzY2FsZVkgPSBlbE1hdHJpeCAmJiBlbE1hdHJpeC5kLFxuICAgICAgICAgIHRyYW5zbGF0ZVggPSAoY3VycmVudFJlY3QubGVmdCAtIHRvUmVjdC5sZWZ0KSAvIChzY2FsZVggfHwgMSksXG4gICAgICAgICAgdHJhbnNsYXRlWSA9IChjdXJyZW50UmVjdC50b3AgLSB0b1JlY3QudG9wKSAvIChzY2FsZVkgfHwgMSk7XG4gICAgICAgIHRhcmdldC5hbmltYXRpbmdYID0gISF0cmFuc2xhdGVYO1xuICAgICAgICB0YXJnZXQuYW5pbWF0aW5nWSA9ICEhdHJhbnNsYXRlWTtcbiAgICAgICAgY3NzKHRhcmdldCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUzZCgnICsgdHJhbnNsYXRlWCArICdweCwnICsgdHJhbnNsYXRlWSArICdweCwwKScpO1xuICAgICAgICB0aGlzLmZvclJlcGFpbnREdW1teSA9IHJlcGFpbnQodGFyZ2V0KTsgLy8gcmVwYWludFxuXG4gICAgICAgIGNzcyh0YXJnZXQsICd0cmFuc2l0aW9uJywgJ3RyYW5zZm9ybSAnICsgZHVyYXRpb24gKyAnbXMnICsgKHRoaXMub3B0aW9ucy5lYXNpbmcgPyAnICcgKyB0aGlzLm9wdGlvbnMuZWFzaW5nIDogJycpKTtcbiAgICAgICAgY3NzKHRhcmdldCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUzZCgwLDAsMCknKTtcbiAgICAgICAgdHlwZW9mIHRhcmdldC5hbmltYXRlZCA9PT0gJ251bWJlcicgJiYgY2xlYXJUaW1lb3V0KHRhcmdldC5hbmltYXRlZCk7XG4gICAgICAgIHRhcmdldC5hbmltYXRlZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNzcyh0YXJnZXQsICd0cmFuc2l0aW9uJywgJycpO1xuICAgICAgICAgIGNzcyh0YXJnZXQsICd0cmFuc2Zvcm0nLCAnJyk7XG4gICAgICAgICAgdGFyZ2V0LmFuaW1hdGVkID0gZmFsc2U7XG4gICAgICAgICAgdGFyZ2V0LmFuaW1hdGluZ1ggPSBmYWxzZTtcbiAgICAgICAgICB0YXJnZXQuYW5pbWF0aW5nWSA9IGZhbHNlO1xuICAgICAgICB9LCBkdXJhdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gcmVwYWludCh0YXJnZXQpIHtcbiAgcmV0dXJuIHRhcmdldC5vZmZzZXRXaWR0aDtcbn1cbmZ1bmN0aW9uIGNhbGN1bGF0ZVJlYWxUaW1lKGFuaW1hdGluZ1JlY3QsIGZyb21SZWN0LCB0b1JlY3QsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhmcm9tUmVjdC50b3AgLSBhbmltYXRpbmdSZWN0LnRvcCwgMikgKyBNYXRoLnBvdyhmcm9tUmVjdC5sZWZ0IC0gYW5pbWF0aW5nUmVjdC5sZWZ0LCAyKSkgLyBNYXRoLnNxcnQoTWF0aC5wb3coZnJvbVJlY3QudG9wIC0gdG9SZWN0LnRvcCwgMikgKyBNYXRoLnBvdyhmcm9tUmVjdC5sZWZ0IC0gdG9SZWN0LmxlZnQsIDIpKSAqIG9wdGlvbnMuYW5pbWF0aW9uO1xufVxuXG52YXIgcGx1Z2lucyA9IFtdO1xudmFyIGRlZmF1bHRzID0ge1xuICBpbml0aWFsaXplQnlEZWZhdWx0OiB0cnVlXG59O1xudmFyIFBsdWdpbk1hbmFnZXIgPSB7XG4gIG1vdW50OiBmdW5jdGlvbiBtb3VudChwbHVnaW4pIHtcbiAgICAvLyBTZXQgZGVmYXVsdCBzdGF0aWMgcHJvcGVydGllc1xuICAgIGZvciAodmFyIG9wdGlvbiBpbiBkZWZhdWx0cykge1xuICAgICAgaWYgKGRlZmF1bHRzLmhhc093blByb3BlcnR5KG9wdGlvbikgJiYgIShvcHRpb24gaW4gcGx1Z2luKSkge1xuICAgICAgICBwbHVnaW5bb3B0aW9uXSA9IGRlZmF1bHRzW29wdGlvbl07XG4gICAgICB9XG4gICAgfVxuICAgIHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocCkge1xuICAgICAgaWYgKHAucGx1Z2luTmFtZSA9PT0gcGx1Z2luLnBsdWdpbk5hbWUpIHtcbiAgICAgICAgdGhyb3cgXCJTb3J0YWJsZTogQ2Fubm90IG1vdW50IHBsdWdpbiBcIi5jb25jYXQocGx1Z2luLnBsdWdpbk5hbWUsIFwiIG1vcmUgdGhhbiBvbmNlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHBsdWdpbnMucHVzaChwbHVnaW4pO1xuICB9LFxuICBwbHVnaW5FdmVudDogZnVuY3Rpb24gcGx1Z2luRXZlbnQoZXZlbnROYW1lLCBzb3J0YWJsZSwgZXZ0KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB0aGlzLmV2ZW50Q2FuY2VsZWQgPSBmYWxzZTtcbiAgICBldnQuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMuZXZlbnRDYW5jZWxlZCA9IHRydWU7XG4gICAgfTtcbiAgICB2YXIgZXZlbnROYW1lR2xvYmFsID0gZXZlbnROYW1lICsgJ0dsb2JhbCc7XG4gICAgcGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICAgIGlmICghc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdKSByZXR1cm47XG4gICAgICAvLyBGaXJlIGdsb2JhbCBldmVudHMgaWYgaXQgZXhpc3RzIGluIHRoaXMgc29ydGFibGVcbiAgICAgIGlmIChzb3J0YWJsZVtwbHVnaW4ucGx1Z2luTmFtZV1bZXZlbnROYW1lR2xvYmFsXSkge1xuICAgICAgICBzb3J0YWJsZVtwbHVnaW4ucGx1Z2luTmFtZV1bZXZlbnROYW1lR2xvYmFsXShfb2JqZWN0U3ByZWFkMih7XG4gICAgICAgICAgc29ydGFibGU6IHNvcnRhYmxlXG4gICAgICAgIH0sIGV2dCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBPbmx5IGZpcmUgcGx1Z2luIGV2ZW50IGlmIHBsdWdpbiBpcyBlbmFibGVkIGluIHRoaXMgc29ydGFibGUsXG4gICAgICAvLyBhbmQgcGx1Z2luIGhhcyBldmVudCBkZWZpbmVkXG4gICAgICBpZiAoc29ydGFibGUub3B0aW9uc1twbHVnaW4ucGx1Z2luTmFtZV0gJiYgc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdW2V2ZW50TmFtZV0oX29iamVjdFNwcmVhZDIoe1xuICAgICAgICAgIHNvcnRhYmxlOiBzb3J0YWJsZVxuICAgICAgICB9LCBldnQpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgaW5pdGlhbGl6ZVBsdWdpbnM6IGZ1bmN0aW9uIGluaXRpYWxpemVQbHVnaW5zKHNvcnRhYmxlLCBlbCwgZGVmYXVsdHMsIG9wdGlvbnMpIHtcbiAgICBwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgdmFyIHBsdWdpbk5hbWUgPSBwbHVnaW4ucGx1Z2luTmFtZTtcbiAgICAgIGlmICghc29ydGFibGUub3B0aW9uc1twbHVnaW5OYW1lXSAmJiAhcGx1Z2luLmluaXRpYWxpemVCeURlZmF1bHQpIHJldHVybjtcbiAgICAgIHZhciBpbml0aWFsaXplZCA9IG5ldyBwbHVnaW4oc29ydGFibGUsIGVsLCBzb3J0YWJsZS5vcHRpb25zKTtcbiAgICAgIGluaXRpYWxpemVkLnNvcnRhYmxlID0gc29ydGFibGU7XG4gICAgICBpbml0aWFsaXplZC5vcHRpb25zID0gc29ydGFibGUub3B0aW9ucztcbiAgICAgIHNvcnRhYmxlW3BsdWdpbk5hbWVdID0gaW5pdGlhbGl6ZWQ7XG5cbiAgICAgIC8vIEFkZCBkZWZhdWx0IG9wdGlvbnMgZnJvbSBwbHVnaW5cbiAgICAgIF9leHRlbmRzKGRlZmF1bHRzLCBpbml0aWFsaXplZC5kZWZhdWx0cyk7XG4gICAgfSk7XG4gICAgZm9yICh2YXIgb3B0aW9uIGluIHNvcnRhYmxlLm9wdGlvbnMpIHtcbiAgICAgIGlmICghc29ydGFibGUub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShvcHRpb24pKSBjb250aW51ZTtcbiAgICAgIHZhciBtb2RpZmllZCA9IHRoaXMubW9kaWZ5T3B0aW9uKHNvcnRhYmxlLCBvcHRpb24sIHNvcnRhYmxlLm9wdGlvbnNbb3B0aW9uXSk7XG4gICAgICBpZiAodHlwZW9mIG1vZGlmaWVkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzb3J0YWJsZS5vcHRpb25zW29wdGlvbl0gPSBtb2RpZmllZDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGdldEV2ZW50UHJvcGVydGllczogZnVuY3Rpb24gZ2V0RXZlbnRQcm9wZXJ0aWVzKG5hbWUsIHNvcnRhYmxlKSB7XG4gICAgdmFyIGV2ZW50UHJvcGVydGllcyA9IHt9O1xuICAgIHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Z2luKSB7XG4gICAgICBpZiAodHlwZW9mIHBsdWdpbi5ldmVudFByb3BlcnRpZXMgIT09ICdmdW5jdGlvbicpIHJldHVybjtcbiAgICAgIF9leHRlbmRzKGV2ZW50UHJvcGVydGllcywgcGx1Z2luLmV2ZW50UHJvcGVydGllcy5jYWxsKHNvcnRhYmxlW3BsdWdpbi5wbHVnaW5OYW1lXSwgbmFtZSkpO1xuICAgIH0pO1xuICAgIHJldHVybiBldmVudFByb3BlcnRpZXM7XG4gIH0sXG4gIG1vZGlmeU9wdGlvbjogZnVuY3Rpb24gbW9kaWZ5T3B0aW9uKHNvcnRhYmxlLCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBtb2RpZmllZFZhbHVlO1xuICAgIHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Z2luKSB7XG4gICAgICAvLyBQbHVnaW4gbXVzdCBleGlzdCBvbiB0aGUgU29ydGFibGVcbiAgICAgIGlmICghc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdKSByZXR1cm47XG5cbiAgICAgIC8vIElmIHN0YXRpYyBvcHRpb24gbGlzdGVuZXIgZXhpc3RzIGZvciB0aGlzIG9wdGlvbiwgY2FsbCBpbiB0aGUgY29udGV4dCBvZiB0aGUgU29ydGFibGUncyBpbnN0YW5jZSBvZiB0aGlzIHBsdWdpblxuICAgICAgaWYgKHBsdWdpbi5vcHRpb25MaXN0ZW5lcnMgJiYgdHlwZW9mIHBsdWdpbi5vcHRpb25MaXN0ZW5lcnNbbmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbW9kaWZpZWRWYWx1ZSA9IHBsdWdpbi5vcHRpb25MaXN0ZW5lcnNbbmFtZV0uY2FsbChzb3J0YWJsZVtwbHVnaW4ucGx1Z2luTmFtZV0sIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbW9kaWZpZWRWYWx1ZTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChfcmVmKSB7XG4gIHZhciBzb3J0YWJsZSA9IF9yZWYuc29ydGFibGUsXG4gICAgcm9vdEVsID0gX3JlZi5yb290RWwsXG4gICAgbmFtZSA9IF9yZWYubmFtZSxcbiAgICB0YXJnZXRFbCA9IF9yZWYudGFyZ2V0RWwsXG4gICAgY2xvbmVFbCA9IF9yZWYuY2xvbmVFbCxcbiAgICB0b0VsID0gX3JlZi50b0VsLFxuICAgIGZyb21FbCA9IF9yZWYuZnJvbUVsLFxuICAgIG9sZEluZGV4ID0gX3JlZi5vbGRJbmRleCxcbiAgICBuZXdJbmRleCA9IF9yZWYubmV3SW5kZXgsXG4gICAgb2xkRHJhZ2dhYmxlSW5kZXggPSBfcmVmLm9sZERyYWdnYWJsZUluZGV4LFxuICAgIG5ld0RyYWdnYWJsZUluZGV4ID0gX3JlZi5uZXdEcmFnZ2FibGVJbmRleCxcbiAgICBvcmlnaW5hbEV2ZW50ID0gX3JlZi5vcmlnaW5hbEV2ZW50LFxuICAgIHB1dFNvcnRhYmxlID0gX3JlZi5wdXRTb3J0YWJsZSxcbiAgICBleHRyYUV2ZW50UHJvcGVydGllcyA9IF9yZWYuZXh0cmFFdmVudFByb3BlcnRpZXM7XG4gIHNvcnRhYmxlID0gc29ydGFibGUgfHwgcm9vdEVsICYmIHJvb3RFbFtleHBhbmRvXTtcbiAgaWYgKCFzb3J0YWJsZSkgcmV0dXJuO1xuICB2YXIgZXZ0LFxuICAgIG9wdGlvbnMgPSBzb3J0YWJsZS5vcHRpb25zLFxuICAgIG9uTmFtZSA9ICdvbicgKyBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHIoMSk7XG4gIC8vIFN1cHBvcnQgZm9yIG5ldyBDdXN0b21FdmVudCBmZWF0dXJlXG4gIGlmICh3aW5kb3cuQ3VzdG9tRXZlbnQgJiYgIUlFMTFPckxlc3MgJiYgIUVkZ2UpIHtcbiAgICBldnQgPSBuZXcgQ3VzdG9tRXZlbnQobmFtZSwge1xuICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICBldnQuaW5pdEV2ZW50KG5hbWUsIHRydWUsIHRydWUpO1xuICB9XG4gIGV2dC50byA9IHRvRWwgfHwgcm9vdEVsO1xuICBldnQuZnJvbSA9IGZyb21FbCB8fCByb290RWw7XG4gIGV2dC5pdGVtID0gdGFyZ2V0RWwgfHwgcm9vdEVsO1xuICBldnQuY2xvbmUgPSBjbG9uZUVsO1xuICBldnQub2xkSW5kZXggPSBvbGRJbmRleDtcbiAgZXZ0Lm5ld0luZGV4ID0gbmV3SW5kZXg7XG4gIGV2dC5vbGREcmFnZ2FibGVJbmRleCA9IG9sZERyYWdnYWJsZUluZGV4O1xuICBldnQubmV3RHJhZ2dhYmxlSW5kZXggPSBuZXdEcmFnZ2FibGVJbmRleDtcbiAgZXZ0Lm9yaWdpbmFsRXZlbnQgPSBvcmlnaW5hbEV2ZW50O1xuICBldnQucHVsbE1vZGUgPSBwdXRTb3J0YWJsZSA/IHB1dFNvcnRhYmxlLmxhc3RQdXRNb2RlIDogdW5kZWZpbmVkO1xuICB2YXIgYWxsRXZlbnRQcm9wZXJ0aWVzID0gX29iamVjdFNwcmVhZDIoX29iamVjdFNwcmVhZDIoe30sIGV4dHJhRXZlbnRQcm9wZXJ0aWVzKSwgUGx1Z2luTWFuYWdlci5nZXRFdmVudFByb3BlcnRpZXMobmFtZSwgc29ydGFibGUpKTtcbiAgZm9yICh2YXIgb3B0aW9uIGluIGFsbEV2ZW50UHJvcGVydGllcykge1xuICAgIGV2dFtvcHRpb25dID0gYWxsRXZlbnRQcm9wZXJ0aWVzW29wdGlvbl07XG4gIH1cbiAgaWYgKHJvb3RFbCkge1xuICAgIHJvb3RFbC5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gIH1cbiAgaWYgKG9wdGlvbnNbb25OYW1lXSkge1xuICAgIG9wdGlvbnNbb25OYW1lXS5jYWxsKHNvcnRhYmxlLCBldnQpO1xuICB9XG59XG5cbnZhciBfZXhjbHVkZWQgPSBbXCJldnRcIl07XG52YXIgcGx1Z2luRXZlbnQgPSBmdW5jdGlvbiBwbHVnaW5FdmVudChldmVudE5hbWUsIHNvcnRhYmxlKSB7XG4gIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fSxcbiAgICBvcmlnaW5hbEV2ZW50ID0gX3JlZi5ldnQsXG4gICAgZGF0YSA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBfZXhjbHVkZWQpO1xuICBQbHVnaW5NYW5hZ2VyLnBsdWdpbkV2ZW50LmJpbmQoU29ydGFibGUpKGV2ZW50TmFtZSwgc29ydGFibGUsIF9vYmplY3RTcHJlYWQyKHtcbiAgICBkcmFnRWw6IGRyYWdFbCxcbiAgICBwYXJlbnRFbDogcGFyZW50RWwsXG4gICAgZ2hvc3RFbDogZ2hvc3RFbCxcbiAgICByb290RWw6IHJvb3RFbCxcbiAgICBuZXh0RWw6IG5leHRFbCxcbiAgICBsYXN0RG93bkVsOiBsYXN0RG93bkVsLFxuICAgIGNsb25lRWw6IGNsb25lRWwsXG4gICAgY2xvbmVIaWRkZW46IGNsb25lSGlkZGVuLFxuICAgIGRyYWdTdGFydGVkOiBtb3ZlZCxcbiAgICBwdXRTb3J0YWJsZTogcHV0U29ydGFibGUsXG4gICAgYWN0aXZlU29ydGFibGU6IFNvcnRhYmxlLmFjdGl2ZSxcbiAgICBvcmlnaW5hbEV2ZW50OiBvcmlnaW5hbEV2ZW50LFxuICAgIG9sZEluZGV4OiBvbGRJbmRleCxcbiAgICBvbGREcmFnZ2FibGVJbmRleDogb2xkRHJhZ2dhYmxlSW5kZXgsXG4gICAgbmV3SW5kZXg6IG5ld0luZGV4LFxuICAgIG5ld0RyYWdnYWJsZUluZGV4OiBuZXdEcmFnZ2FibGVJbmRleCxcbiAgICBoaWRlR2hvc3RGb3JUYXJnZXQ6IF9oaWRlR2hvc3RGb3JUYXJnZXQsXG4gICAgdW5oaWRlR2hvc3RGb3JUYXJnZXQ6IF91bmhpZGVHaG9zdEZvclRhcmdldCxcbiAgICBjbG9uZU5vd0hpZGRlbjogZnVuY3Rpb24gY2xvbmVOb3dIaWRkZW4oKSB7XG4gICAgICBjbG9uZUhpZGRlbiA9IHRydWU7XG4gICAgfSxcbiAgICBjbG9uZU5vd1Nob3duOiBmdW5jdGlvbiBjbG9uZU5vd1Nob3duKCkge1xuICAgICAgY2xvbmVIaWRkZW4gPSBmYWxzZTtcbiAgICB9LFxuICAgIGRpc3BhdGNoU29ydGFibGVFdmVudDogZnVuY3Rpb24gZGlzcGF0Y2hTb3J0YWJsZUV2ZW50KG5hbWUpIHtcbiAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgc29ydGFibGU6IHNvcnRhYmxlLFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBvcmlnaW5hbEV2ZW50OiBvcmlnaW5hbEV2ZW50XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIGRhdGEpKTtcbn07XG5mdW5jdGlvbiBfZGlzcGF0Y2hFdmVudChpbmZvKSB7XG4gIGRpc3BhdGNoRXZlbnQoX29iamVjdFNwcmVhZDIoe1xuICAgIHB1dFNvcnRhYmxlOiBwdXRTb3J0YWJsZSxcbiAgICBjbG9uZUVsOiBjbG9uZUVsLFxuICAgIHRhcmdldEVsOiBkcmFnRWwsXG4gICAgcm9vdEVsOiByb290RWwsXG4gICAgb2xkSW5kZXg6IG9sZEluZGV4LFxuICAgIG9sZERyYWdnYWJsZUluZGV4OiBvbGREcmFnZ2FibGVJbmRleCxcbiAgICBuZXdJbmRleDogbmV3SW5kZXgsXG4gICAgbmV3RHJhZ2dhYmxlSW5kZXg6IG5ld0RyYWdnYWJsZUluZGV4XG4gIH0sIGluZm8pKTtcbn1cbnZhciBkcmFnRWwsXG4gIHBhcmVudEVsLFxuICBnaG9zdEVsLFxuICByb290RWwsXG4gIG5leHRFbCxcbiAgbGFzdERvd25FbCxcbiAgY2xvbmVFbCxcbiAgY2xvbmVIaWRkZW4sXG4gIG9sZEluZGV4LFxuICBuZXdJbmRleCxcbiAgb2xkRHJhZ2dhYmxlSW5kZXgsXG4gIG5ld0RyYWdnYWJsZUluZGV4LFxuICBhY3RpdmVHcm91cCxcbiAgcHV0U29ydGFibGUsXG4gIGF3YWl0aW5nRHJhZ1N0YXJ0ZWQgPSBmYWxzZSxcbiAgaWdub3JlTmV4dENsaWNrID0gZmFsc2UsXG4gIHNvcnRhYmxlcyA9IFtdLFxuICB0YXBFdnQsXG4gIHRvdWNoRXZ0LFxuICBsYXN0RHgsXG4gIGxhc3REeSxcbiAgdGFwRGlzdGFuY2VMZWZ0LFxuICB0YXBEaXN0YW5jZVRvcCxcbiAgbW92ZWQsXG4gIGxhc3RUYXJnZXQsXG4gIGxhc3REaXJlY3Rpb24sXG4gIHBhc3RGaXJzdEludmVydFRocmVzaCA9IGZhbHNlLFxuICBpc0NpcmN1bXN0YW50aWFsSW52ZXJ0ID0gZmFsc2UsXG4gIHRhcmdldE1vdmVEaXN0YW5jZSxcbiAgLy8gRm9yIHBvc2l0aW9uaW5nIGdob3N0IGFic29sdXRlbHlcbiAgZ2hvc3RSZWxhdGl2ZVBhcmVudCxcbiAgZ2hvc3RSZWxhdGl2ZVBhcmVudEluaXRpYWxTY3JvbGwgPSBbXSxcbiAgLy8gKGxlZnQsIHRvcClcblxuICBfc2lsZW50ID0gZmFsc2UsXG4gIHNhdmVkSW5wdXRDaGVja2VkID0gW107XG5cbi8qKiBAY29uc3QgKi9cbnZhciBkb2N1bWVudEV4aXN0cyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcsXG4gIFBvc2l0aW9uR2hvc3RBYnNvbHV0ZWx5ID0gSU9TLFxuICBDU1NGbG9hdFByb3BlcnR5ID0gRWRnZSB8fCBJRTExT3JMZXNzID8gJ2Nzc0Zsb2F0JyA6ICdmbG9hdCcsXG4gIC8vIFRoaXMgd2lsbCBub3QgcGFzcyBmb3IgSUU5LCBiZWNhdXNlIElFOSBEbkQgb25seSB3b3JrcyBvbiBhbmNob3JzXG4gIHN1cHBvcnREcmFnZ2FibGUgPSBkb2N1bWVudEV4aXN0cyAmJiAhQ2hyb21lRm9yQW5kcm9pZCAmJiAhSU9TICYmICdkcmFnZ2FibGUnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICBzdXBwb3J0Q3NzUG9pbnRlckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWRvY3VtZW50RXhpc3RzKSByZXR1cm47XG4gICAgLy8gZmFsc2Ugd2hlbiA8PSBJRTExXG4gICAgaWYgKElFMTFPckxlc3MpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgneCcpO1xuICAgIGVsLnN0eWxlLmNzc1RleHQgPSAncG9pbnRlci1ldmVudHM6YXV0byc7XG4gICAgcmV0dXJuIGVsLnN0eWxlLnBvaW50ZXJFdmVudHMgPT09ICdhdXRvJztcbiAgfSgpLFxuICBfZGV0ZWN0RGlyZWN0aW9uID0gZnVuY3Rpb24gX2RldGVjdERpcmVjdGlvbihlbCwgb3B0aW9ucykge1xuICAgIHZhciBlbENTUyA9IGNzcyhlbCksXG4gICAgICBlbFdpZHRoID0gcGFyc2VJbnQoZWxDU1Mud2lkdGgpIC0gcGFyc2VJbnQoZWxDU1MucGFkZGluZ0xlZnQpIC0gcGFyc2VJbnQoZWxDU1MucGFkZGluZ1JpZ2h0KSAtIHBhcnNlSW50KGVsQ1NTLmJvcmRlckxlZnRXaWR0aCkgLSBwYXJzZUludChlbENTUy5ib3JkZXJSaWdodFdpZHRoKSxcbiAgICAgIGNoaWxkMSA9IGdldENoaWxkKGVsLCAwLCBvcHRpb25zKSxcbiAgICAgIGNoaWxkMiA9IGdldENoaWxkKGVsLCAxLCBvcHRpb25zKSxcbiAgICAgIGZpcnN0Q2hpbGRDU1MgPSBjaGlsZDEgJiYgY3NzKGNoaWxkMSksXG4gICAgICBzZWNvbmRDaGlsZENTUyA9IGNoaWxkMiAmJiBjc3MoY2hpbGQyKSxcbiAgICAgIGZpcnN0Q2hpbGRXaWR0aCA9IGZpcnN0Q2hpbGRDU1MgJiYgcGFyc2VJbnQoZmlyc3RDaGlsZENTUy5tYXJnaW5MZWZ0KSArIHBhcnNlSW50KGZpcnN0Q2hpbGRDU1MubWFyZ2luUmlnaHQpICsgZ2V0UmVjdChjaGlsZDEpLndpZHRoLFxuICAgICAgc2Vjb25kQ2hpbGRXaWR0aCA9IHNlY29uZENoaWxkQ1NTICYmIHBhcnNlSW50KHNlY29uZENoaWxkQ1NTLm1hcmdpbkxlZnQpICsgcGFyc2VJbnQoc2Vjb25kQ2hpbGRDU1MubWFyZ2luUmlnaHQpICsgZ2V0UmVjdChjaGlsZDIpLndpZHRoO1xuICAgIGlmIChlbENTUy5kaXNwbGF5ID09PSAnZmxleCcpIHtcbiAgICAgIHJldHVybiBlbENTUy5mbGV4RGlyZWN0aW9uID09PSAnY29sdW1uJyB8fCBlbENTUy5mbGV4RGlyZWN0aW9uID09PSAnY29sdW1uLXJldmVyc2UnID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgICB9XG4gICAgaWYgKGVsQ1NTLmRpc3BsYXkgPT09ICdncmlkJykge1xuICAgICAgcmV0dXJuIGVsQ1NTLmdyaWRUZW1wbGF0ZUNvbHVtbnMuc3BsaXQoJyAnKS5sZW5ndGggPD0gMSA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgfVxuICAgIGlmIChjaGlsZDEgJiYgZmlyc3RDaGlsZENTU1tcImZsb2F0XCJdICYmIGZpcnN0Q2hpbGRDU1NbXCJmbG9hdFwiXSAhPT0gJ25vbmUnKSB7XG4gICAgICB2YXIgdG91Y2hpbmdTaWRlQ2hpbGQyID0gZmlyc3RDaGlsZENTU1tcImZsb2F0XCJdID09PSAnbGVmdCcgPyAnbGVmdCcgOiAncmlnaHQnO1xuICAgICAgcmV0dXJuIGNoaWxkMiAmJiAoc2Vjb25kQ2hpbGRDU1MuY2xlYXIgPT09ICdib3RoJyB8fCBzZWNvbmRDaGlsZENTUy5jbGVhciA9PT0gdG91Y2hpbmdTaWRlQ2hpbGQyKSA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZDEgJiYgKGZpcnN0Q2hpbGRDU1MuZGlzcGxheSA9PT0gJ2Jsb2NrJyB8fCBmaXJzdENoaWxkQ1NTLmRpc3BsYXkgPT09ICdmbGV4JyB8fCBmaXJzdENoaWxkQ1NTLmRpc3BsYXkgPT09ICd0YWJsZScgfHwgZmlyc3RDaGlsZENTUy5kaXNwbGF5ID09PSAnZ3JpZCcgfHwgZmlyc3RDaGlsZFdpZHRoID49IGVsV2lkdGggJiYgZWxDU1NbQ1NTRmxvYXRQcm9wZXJ0eV0gPT09ICdub25lJyB8fCBjaGlsZDIgJiYgZWxDU1NbQ1NTRmxvYXRQcm9wZXJ0eV0gPT09ICdub25lJyAmJiBmaXJzdENoaWxkV2lkdGggKyBzZWNvbmRDaGlsZFdpZHRoID4gZWxXaWR0aCkgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICB9LFxuICBfZHJhZ0VsSW5Sb3dDb2x1bW4gPSBmdW5jdGlvbiBfZHJhZ0VsSW5Sb3dDb2x1bW4oZHJhZ1JlY3QsIHRhcmdldFJlY3QsIHZlcnRpY2FsKSB7XG4gICAgdmFyIGRyYWdFbFMxT3BwID0gdmVydGljYWwgPyBkcmFnUmVjdC5sZWZ0IDogZHJhZ1JlY3QudG9wLFxuICAgICAgZHJhZ0VsUzJPcHAgPSB2ZXJ0aWNhbCA/IGRyYWdSZWN0LnJpZ2h0IDogZHJhZ1JlY3QuYm90dG9tLFxuICAgICAgZHJhZ0VsT3BwTGVuZ3RoID0gdmVydGljYWwgPyBkcmFnUmVjdC53aWR0aCA6IGRyYWdSZWN0LmhlaWdodCxcbiAgICAgIHRhcmdldFMxT3BwID0gdmVydGljYWwgPyB0YXJnZXRSZWN0LmxlZnQgOiB0YXJnZXRSZWN0LnRvcCxcbiAgICAgIHRhcmdldFMyT3BwID0gdmVydGljYWwgPyB0YXJnZXRSZWN0LnJpZ2h0IDogdGFyZ2V0UmVjdC5ib3R0b20sXG4gICAgICB0YXJnZXRPcHBMZW5ndGggPSB2ZXJ0aWNhbCA/IHRhcmdldFJlY3Qud2lkdGggOiB0YXJnZXRSZWN0LmhlaWdodDtcbiAgICByZXR1cm4gZHJhZ0VsUzFPcHAgPT09IHRhcmdldFMxT3BwIHx8IGRyYWdFbFMyT3BwID09PSB0YXJnZXRTMk9wcCB8fCBkcmFnRWxTMU9wcCArIGRyYWdFbE9wcExlbmd0aCAvIDIgPT09IHRhcmdldFMxT3BwICsgdGFyZ2V0T3BwTGVuZ3RoIC8gMjtcbiAgfSxcbiAgLyoqXHJcbiAgICogRGV0ZWN0cyBmaXJzdCBuZWFyZXN0IGVtcHR5IHNvcnRhYmxlIHRvIFggYW5kIFkgcG9zaXRpb24gdXNpbmcgZW1wdHlJbnNlcnRUaHJlc2hvbGQuXHJcbiAgICogQHBhcmFtICB7TnVtYmVyfSB4ICAgICAgWCBwb3NpdGlvblxyXG4gICAqIEBwYXJhbSAge051bWJlcn0geSAgICAgIFkgcG9zaXRpb25cclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICBFbGVtZW50IG9mIHRoZSBmaXJzdCBmb3VuZCBuZWFyZXN0IFNvcnRhYmxlXHJcbiAgICovXG4gIF9kZXRlY3ROZWFyZXN0RW1wdHlTb3J0YWJsZSA9IGZ1bmN0aW9uIF9kZXRlY3ROZWFyZXN0RW1wdHlTb3J0YWJsZSh4LCB5KSB7XG4gICAgdmFyIHJldDtcbiAgICBzb3J0YWJsZXMuc29tZShmdW5jdGlvbiAoc29ydGFibGUpIHtcbiAgICAgIHZhciB0aHJlc2hvbGQgPSBzb3J0YWJsZVtleHBhbmRvXS5vcHRpb25zLmVtcHR5SW5zZXJ0VGhyZXNob2xkO1xuICAgICAgaWYgKCF0aHJlc2hvbGQgfHwgbGFzdENoaWxkKHNvcnRhYmxlKSkgcmV0dXJuO1xuICAgICAgdmFyIHJlY3QgPSBnZXRSZWN0KHNvcnRhYmxlKSxcbiAgICAgICAgaW5zaWRlSG9yaXpvbnRhbGx5ID0geCA+PSByZWN0LmxlZnQgLSB0aHJlc2hvbGQgJiYgeCA8PSByZWN0LnJpZ2h0ICsgdGhyZXNob2xkLFxuICAgICAgICBpbnNpZGVWZXJ0aWNhbGx5ID0geSA+PSByZWN0LnRvcCAtIHRocmVzaG9sZCAmJiB5IDw9IHJlY3QuYm90dG9tICsgdGhyZXNob2xkO1xuICAgICAgaWYgKGluc2lkZUhvcml6b250YWxseSAmJiBpbnNpZGVWZXJ0aWNhbGx5KSB7XG4gICAgICAgIHJldHVybiByZXQgPSBzb3J0YWJsZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9LFxuICBfcHJlcGFyZUdyb3VwID0gZnVuY3Rpb24gX3ByZXBhcmVHcm91cChvcHRpb25zKSB7XG4gICAgZnVuY3Rpb24gdG9Gbih2YWx1ZSwgcHVsbCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0bywgZnJvbSwgZHJhZ0VsLCBldnQpIHtcbiAgICAgICAgdmFyIHNhbWVHcm91cCA9IHRvLm9wdGlvbnMuZ3JvdXAubmFtZSAmJiBmcm9tLm9wdGlvbnMuZ3JvdXAubmFtZSAmJiB0by5vcHRpb25zLmdyb3VwLm5hbWUgPT09IGZyb20ub3B0aW9ucy5ncm91cC5uYW1lO1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCAmJiAocHVsbCB8fCBzYW1lR3JvdXApKSB7XG4gICAgICAgICAgLy8gRGVmYXVsdCBwdWxsIHZhbHVlXG4gICAgICAgICAgLy8gRGVmYXVsdCBwdWxsIGFuZCBwdXQgdmFsdWUgaWYgc2FtZSBncm91cFxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKHB1bGwgJiYgdmFsdWUgPT09ICdjbG9uZScpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIHRvRm4odmFsdWUodG8sIGZyb20sIGRyYWdFbCwgZXZ0KSwgcHVsbCkodG8sIGZyb20sIGRyYWdFbCwgZXZ0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgb3RoZXJHcm91cCA9IChwdWxsID8gdG8gOiBmcm9tKS5vcHRpb25zLmdyb3VwLm5hbWU7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUgPT09IG90aGVyR3JvdXAgfHwgdmFsdWUuam9pbiAmJiB2YWx1ZS5pbmRleE9mKG90aGVyR3JvdXApID4gLTE7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBncm91cCA9IHt9O1xuICAgIHZhciBvcmlnaW5hbEdyb3VwID0gb3B0aW9ucy5ncm91cDtcbiAgICBpZiAoIW9yaWdpbmFsR3JvdXAgfHwgX3R5cGVvZihvcmlnaW5hbEdyb3VwKSAhPSAnb2JqZWN0Jykge1xuICAgICAgb3JpZ2luYWxHcm91cCA9IHtcbiAgICAgICAgbmFtZTogb3JpZ2luYWxHcm91cFxuICAgICAgfTtcbiAgICB9XG4gICAgZ3JvdXAubmFtZSA9IG9yaWdpbmFsR3JvdXAubmFtZTtcbiAgICBncm91cC5jaGVja1B1bGwgPSB0b0ZuKG9yaWdpbmFsR3JvdXAucHVsbCwgdHJ1ZSk7XG4gICAgZ3JvdXAuY2hlY2tQdXQgPSB0b0ZuKG9yaWdpbmFsR3JvdXAucHV0KTtcbiAgICBncm91cC5yZXZlcnRDbG9uZSA9IG9yaWdpbmFsR3JvdXAucmV2ZXJ0Q2xvbmU7XG4gICAgb3B0aW9ucy5ncm91cCA9IGdyb3VwO1xuICB9LFxuICBfaGlkZUdob3N0Rm9yVGFyZ2V0ID0gZnVuY3Rpb24gX2hpZGVHaG9zdEZvclRhcmdldCgpIHtcbiAgICBpZiAoIXN1cHBvcnRDc3NQb2ludGVyRXZlbnRzICYmIGdob3N0RWwpIHtcbiAgICAgIGNzcyhnaG9zdEVsLCAnZGlzcGxheScsICdub25lJyk7XG4gICAgfVxuICB9LFxuICBfdW5oaWRlR2hvc3RGb3JUYXJnZXQgPSBmdW5jdGlvbiBfdW5oaWRlR2hvc3RGb3JUYXJnZXQoKSB7XG4gICAgaWYgKCFzdXBwb3J0Q3NzUG9pbnRlckV2ZW50cyAmJiBnaG9zdEVsKSB7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ2Rpc3BsYXknLCAnJyk7XG4gICAgfVxuICB9O1xuXG4vLyAjMTE4NCBmaXggLSBQcmV2ZW50IGNsaWNrIGV2ZW50IG9uIGZhbGxiYWNrIGlmIGRyYWdnZWQgYnV0IGl0ZW0gbm90IGNoYW5nZWQgcG9zaXRpb25cbmlmIChkb2N1bWVudEV4aXN0cyAmJiAhQ2hyb21lRm9yQW5kcm9pZCkge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoaWdub3JlTmV4dENsaWNrKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24gJiYgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiAmJiBldnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICBpZ25vcmVOZXh0Q2xpY2sgPSBmYWxzZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sIHRydWUpO1xufVxudmFyIG5lYXJlc3RFbXB0eUluc2VydERldGVjdEV2ZW50ID0gZnVuY3Rpb24gbmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQoZXZ0KSB7XG4gIGlmIChkcmFnRWwpIHtcbiAgICBldnQgPSBldnQudG91Y2hlcyA/IGV2dC50b3VjaGVzWzBdIDogZXZ0O1xuICAgIHZhciBuZWFyZXN0ID0gX2RldGVjdE5lYXJlc3RFbXB0eVNvcnRhYmxlKGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSk7XG4gICAgaWYgKG5lYXJlc3QpIHtcbiAgICAgIC8vIENyZWF0ZSBpbWl0YXRpb24gZXZlbnRcbiAgICAgIHZhciBldmVudCA9IHt9O1xuICAgICAgZm9yICh2YXIgaSBpbiBldnQpIHtcbiAgICAgICAgaWYgKGV2dC5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgIGV2ZW50W2ldID0gZXZ0W2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBldmVudC50YXJnZXQgPSBldmVudC5yb290RWwgPSBuZWFyZXN0O1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPSB2b2lkIDA7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24gPSB2b2lkIDA7XG4gICAgICBuZWFyZXN0W2V4cGFuZG9dLl9vbkRyYWdPdmVyKGV2ZW50KTtcbiAgICB9XG4gIH1cbn07XG52YXIgX2NoZWNrT3V0c2lkZVRhcmdldEVsID0gZnVuY3Rpb24gX2NoZWNrT3V0c2lkZVRhcmdldEVsKGV2dCkge1xuICBpZiAoZHJhZ0VsKSB7XG4gICAgZHJhZ0VsLnBhcmVudE5vZGVbZXhwYW5kb10uX2lzT3V0c2lkZVRoaXNFbChldnQudGFyZ2V0KTtcbiAgfVxufTtcblxuLyoqXHJcbiAqIEBjbGFzcyAgU29ydGFibGVcclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICBlbFxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgIFtvcHRpb25zXVxyXG4gKi9cbmZ1bmN0aW9uIFNvcnRhYmxlKGVsLCBvcHRpb25zKSB7XG4gIGlmICghKGVsICYmIGVsLm5vZGVUeXBlICYmIGVsLm5vZGVUeXBlID09PSAxKSkge1xuICAgIHRocm93IFwiU29ydGFibGU6IGBlbGAgbXVzdCBiZSBhbiBIVE1MRWxlbWVudCwgbm90IFwiLmNvbmNhdCh7fS50b1N0cmluZy5jYWxsKGVsKSk7XG4gIH1cbiAgdGhpcy5lbCA9IGVsOyAvLyByb290IGVsZW1lbnRcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyA9IF9leHRlbmRzKHt9LCBvcHRpb25zKTtcblxuICAvLyBFeHBvcnQgaW5zdGFuY2VcbiAgZWxbZXhwYW5kb10gPSB0aGlzO1xuICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgZ3JvdXA6IG51bGwsXG4gICAgc29ydDogdHJ1ZSxcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgc3RvcmU6IG51bGwsXG4gICAgaGFuZGxlOiBudWxsLFxuICAgIGRyYWdnYWJsZTogL15bdW9dbCQvaS50ZXN0KGVsLm5vZGVOYW1lKSA/ICc+bGknIDogJz4qJyxcbiAgICBzd2FwVGhyZXNob2xkOiAxLFxuICAgIC8vIHBlcmNlbnRhZ2U7IDAgPD0geCA8PSAxXG4gICAgaW52ZXJ0U3dhcDogZmFsc2UsXG4gICAgLy8gaW52ZXJ0IGFsd2F5c1xuICAgIGludmVydGVkU3dhcFRocmVzaG9sZDogbnVsbCxcbiAgICAvLyB3aWxsIGJlIHNldCB0byBzYW1lIGFzIHN3YXBUaHJlc2hvbGQgaWYgZGVmYXVsdFxuICAgIHJlbW92ZUNsb25lT25IaWRlOiB0cnVlLFxuICAgIGRpcmVjdGlvbjogZnVuY3Rpb24gZGlyZWN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9kZXRlY3REaXJlY3Rpb24oZWwsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICBnaG9zdENsYXNzOiAnc29ydGFibGUtZ2hvc3QnLFxuICAgIGNob3NlbkNsYXNzOiAnc29ydGFibGUtY2hvc2VuJyxcbiAgICBkcmFnQ2xhc3M6ICdzb3J0YWJsZS1kcmFnJyxcbiAgICBpZ25vcmU6ICdhLCBpbWcnLFxuICAgIGZpbHRlcjogbnVsbCxcbiAgICBwcmV2ZW50T25GaWx0ZXI6IHRydWUsXG4gICAgYW5pbWF0aW9uOiAwLFxuICAgIGVhc2luZzogbnVsbCxcbiAgICBzZXREYXRhOiBmdW5jdGlvbiBzZXREYXRhKGRhdGFUcmFuc2ZlciwgZHJhZ0VsKSB7XG4gICAgICBkYXRhVHJhbnNmZXIuc2V0RGF0YSgnVGV4dCcsIGRyYWdFbC50ZXh0Q29udGVudCk7XG4gICAgfSxcbiAgICBkcm9wQnViYmxlOiBmYWxzZSxcbiAgICBkcmFnb3ZlckJ1YmJsZTogZmFsc2UsXG4gICAgZGF0YUlkQXR0cjogJ2RhdGEtaWQnLFxuICAgIGRlbGF5OiAwLFxuICAgIGRlbGF5T25Ub3VjaE9ubHk6IGZhbHNlLFxuICAgIHRvdWNoU3RhcnRUaHJlc2hvbGQ6IChOdW1iZXIucGFyc2VJbnQgPyBOdW1iZXIgOiB3aW5kb3cpLnBhcnNlSW50KHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCAxMCkgfHwgMSxcbiAgICBmb3JjZUZhbGxiYWNrOiBmYWxzZSxcbiAgICBmYWxsYmFja0NsYXNzOiAnc29ydGFibGUtZmFsbGJhY2snLFxuICAgIGZhbGxiYWNrT25Cb2R5OiBmYWxzZSxcbiAgICBmYWxsYmFja1RvbGVyYW5jZTogMCxcbiAgICBmYWxsYmFja09mZnNldDoge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9LFxuICAgIC8vIERpc2FibGVkIG9uIFNhZmFyaTogIzE1NzE7IEVuYWJsZWQgb24gU2FmYXJpIElPUzogIzIyNDRcbiAgICBzdXBwb3J0UG9pbnRlcjogU29ydGFibGUuc3VwcG9ydFBvaW50ZXIgIT09IGZhbHNlICYmICdQb2ludGVyRXZlbnQnIGluIHdpbmRvdyAmJiAoIVNhZmFyaSB8fCBJT1MpLFxuICAgIGVtcHR5SW5zZXJ0VGhyZXNob2xkOiA1XG4gIH07XG4gIFBsdWdpbk1hbmFnZXIuaW5pdGlhbGl6ZVBsdWdpbnModGhpcywgZWwsIGRlZmF1bHRzKTtcblxuICAvLyBTZXQgZGVmYXVsdCBvcHRpb25zXG4gIGZvciAodmFyIG5hbWUgaW4gZGVmYXVsdHMpIHtcbiAgICAhKG5hbWUgaW4gb3B0aW9ucykgJiYgKG9wdGlvbnNbbmFtZV0gPSBkZWZhdWx0c1tuYW1lXSk7XG4gIH1cbiAgX3ByZXBhcmVHcm91cChvcHRpb25zKTtcblxuICAvLyBCaW5kIGFsbCBwcml2YXRlIG1ldGhvZHNcbiAgZm9yICh2YXIgZm4gaW4gdGhpcykge1xuICAgIGlmIChmbi5jaGFyQXQoMCkgPT09ICdfJyAmJiB0eXBlb2YgdGhpc1tmbl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXNbZm5dID0gdGhpc1tmbl0uYmluZCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvLyBTZXR1cCBkcmFnIG1vZGVcbiAgdGhpcy5uYXRpdmVEcmFnZ2FibGUgPSBvcHRpb25zLmZvcmNlRmFsbGJhY2sgPyBmYWxzZSA6IHN1cHBvcnREcmFnZ2FibGU7XG4gIGlmICh0aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgIC8vIFRvdWNoIHN0YXJ0IHRocmVzaG9sZCBjYW5ub3QgYmUgZ3JlYXRlciB0aGFuIHRoZSBuYXRpdmUgZHJhZ3N0YXJ0IHRocmVzaG9sZFxuICAgIHRoaXMub3B0aW9ucy50b3VjaFN0YXJ0VGhyZXNob2xkID0gMTtcbiAgfVxuXG4gIC8vIEJpbmQgZXZlbnRzXG4gIGlmIChvcHRpb25zLnN1cHBvcnRQb2ludGVyKSB7XG4gICAgb24oZWwsICdwb2ludGVyZG93bicsIHRoaXMuX29uVGFwU3RhcnQpO1xuICB9IGVsc2Uge1xuICAgIG9uKGVsLCAnbW91c2Vkb3duJywgdGhpcy5fb25UYXBTdGFydCk7XG4gICAgb24oZWwsICd0b3VjaHN0YXJ0JywgdGhpcy5fb25UYXBTdGFydCk7XG4gIH1cbiAgaWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgb24oZWwsICdkcmFnb3ZlcicsIHRoaXMpO1xuICAgIG9uKGVsLCAnZHJhZ2VudGVyJywgdGhpcyk7XG4gIH1cbiAgc29ydGFibGVzLnB1c2godGhpcy5lbCk7XG5cbiAgLy8gUmVzdG9yZSBzb3J0aW5nXG4gIG9wdGlvbnMuc3RvcmUgJiYgb3B0aW9ucy5zdG9yZS5nZXQgJiYgdGhpcy5zb3J0KG9wdGlvbnMuc3RvcmUuZ2V0KHRoaXMpIHx8IFtdKTtcblxuICAvLyBBZGQgYW5pbWF0aW9uIHN0YXRlIG1hbmFnZXJcbiAgX2V4dGVuZHModGhpcywgQW5pbWF0aW9uU3RhdGVNYW5hZ2VyKCkpO1xufVxuU29ydGFibGUucHJvdG90eXBlID0gLyoqIEBsZW5kcyBTb3J0YWJsZS5wcm90b3R5cGUgKi97XG4gIGNvbnN0cnVjdG9yOiBTb3J0YWJsZSxcbiAgX2lzT3V0c2lkZVRoaXNFbDogZnVuY3Rpb24gX2lzT3V0c2lkZVRoaXNFbCh0YXJnZXQpIHtcbiAgICBpZiAoIXRoaXMuZWwuY29udGFpbnModGFyZ2V0KSAmJiB0YXJnZXQgIT09IHRoaXMuZWwpIHtcbiAgICAgIGxhc3RUYXJnZXQgPSBudWxsO1xuICAgIH1cbiAgfSxcbiAgX2dldERpcmVjdGlvbjogZnVuY3Rpb24gX2dldERpcmVjdGlvbihldnQsIHRhcmdldCkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5vcHRpb25zLmRpcmVjdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMub3B0aW9ucy5kaXJlY3Rpb24uY2FsbCh0aGlzLCBldnQsIHRhcmdldCwgZHJhZ0VsKSA6IHRoaXMub3B0aW9ucy5kaXJlY3Rpb247XG4gIH0sXG4gIF9vblRhcFN0YXJ0OiBmdW5jdGlvbiBfb25UYXBTdGFydCggLyoqIEV2ZW50fFRvdWNoRXZlbnQgKi9ldnQpIHtcbiAgICBpZiAoIWV2dC5jYW5jZWxhYmxlKSByZXR1cm47XG4gICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgIGVsID0gdGhpcy5lbCxcbiAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICBwcmV2ZW50T25GaWx0ZXIgPSBvcHRpb25zLnByZXZlbnRPbkZpbHRlcixcbiAgICAgIHR5cGUgPSBldnQudHlwZSxcbiAgICAgIHRvdWNoID0gZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXNbMF0gfHwgZXZ0LnBvaW50ZXJUeXBlICYmIGV2dC5wb2ludGVyVHlwZSA9PT0gJ3RvdWNoJyAmJiBldnQsXG4gICAgICB0YXJnZXQgPSAodG91Y2ggfHwgZXZ0KS50YXJnZXQsXG4gICAgICBvcmlnaW5hbFRhcmdldCA9IGV2dC50YXJnZXQuc2hhZG93Um9vdCAmJiAoZXZ0LnBhdGggJiYgZXZ0LnBhdGhbMF0gfHwgZXZ0LmNvbXBvc2VkUGF0aCAmJiBldnQuY29tcG9zZWRQYXRoKClbMF0pIHx8IHRhcmdldCxcbiAgICAgIGZpbHRlciA9IG9wdGlvbnMuZmlsdGVyO1xuICAgIF9zYXZlSW5wdXRDaGVja2VkU3RhdGUoZWwpO1xuXG4gICAgLy8gRG9uJ3QgdHJpZ2dlciBzdGFydCBldmVudCB3aGVuIGFuIGVsZW1lbnQgaXMgYmVlbiBkcmFnZ2VkLCBvdGhlcndpc2UgdGhlIGV2dC5vbGRpbmRleCBhbHdheXMgd3Jvbmcgd2hlbiBzZXQgb3B0aW9uLmdyb3VwLlxuICAgIGlmIChkcmFnRWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKC9tb3VzZWRvd258cG9pbnRlcmRvd24vLnRlc3QodHlwZSkgJiYgZXZ0LmJ1dHRvbiAhPT0gMCB8fCBvcHRpb25zLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47IC8vIG9ubHkgbGVmdCBidXR0b24gYW5kIGVuYWJsZWRcbiAgICB9XG5cbiAgICAvLyBjYW5jZWwgZG5kIGlmIG9yaWdpbmFsIHRhcmdldCBpcyBjb250ZW50IGVkaXRhYmxlXG4gICAgaWYgKG9yaWdpbmFsVGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gU2FmYXJpIGlnbm9yZXMgZnVydGhlciBldmVudCBoYW5kbGluZyBhZnRlciBtb3VzZWRvd25cbiAgICBpZiAoIXRoaXMubmF0aXZlRHJhZ2dhYmxlICYmIFNhZmFyaSAmJiB0YXJnZXQgJiYgdGFyZ2V0LnRhZ05hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1NFTEVDVCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGFyZ2V0ID0gY2xvc2VzdCh0YXJnZXQsIG9wdGlvbnMuZHJhZ2dhYmxlLCBlbCwgZmFsc2UpO1xuICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0LmFuaW1hdGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChsYXN0RG93bkVsID09PSB0YXJnZXQpIHtcbiAgICAgIC8vIElnbm9yaW5nIGR1cGxpY2F0ZSBgZG93bmBcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBHZXQgdGhlIGluZGV4IG9mIHRoZSBkcmFnZ2VkIGVsZW1lbnQgd2l0aGluIGl0cyBwYXJlbnRcbiAgICBvbGRJbmRleCA9IGluZGV4KHRhcmdldCk7XG4gICAgb2xkRHJhZ2dhYmxlSW5kZXggPSBpbmRleCh0YXJnZXQsIG9wdGlvbnMuZHJhZ2dhYmxlKTtcblxuICAgIC8vIENoZWNrIGZpbHRlclxuICAgIGlmICh0eXBlb2YgZmlsdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZmlsdGVyLmNhbGwodGhpcywgZXZ0LCB0YXJnZXQsIHRoaXMpKSB7XG4gICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICBzb3J0YWJsZTogX3RoaXMsXG4gICAgICAgICAgcm9vdEVsOiBvcmlnaW5hbFRhcmdldCxcbiAgICAgICAgICBuYW1lOiAnZmlsdGVyJyxcbiAgICAgICAgICB0YXJnZXRFbDogdGFyZ2V0LFxuICAgICAgICAgIHRvRWw6IGVsLFxuICAgICAgICAgIGZyb21FbDogZWxcbiAgICAgICAgfSk7XG4gICAgICAgIHBsdWdpbkV2ZW50KCdmaWx0ZXInLCBfdGhpcywge1xuICAgICAgICAgIGV2dDogZXZ0XG4gICAgICAgIH0pO1xuICAgICAgICBwcmV2ZW50T25GaWx0ZXIgJiYgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybjsgLy8gY2FuY2VsIGRuZFxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmlsdGVyKSB7XG4gICAgICBmaWx0ZXIgPSBmaWx0ZXIuc3BsaXQoJywnKS5zb21lKGZ1bmN0aW9uIChjcml0ZXJpYSkge1xuICAgICAgICBjcml0ZXJpYSA9IGNsb3Nlc3Qob3JpZ2luYWxUYXJnZXQsIGNyaXRlcmlhLnRyaW0oKSwgZWwsIGZhbHNlKTtcbiAgICAgICAgaWYgKGNyaXRlcmlhKSB7XG4gICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgc29ydGFibGU6IF90aGlzLFxuICAgICAgICAgICAgcm9vdEVsOiBjcml0ZXJpYSxcbiAgICAgICAgICAgIG5hbWU6ICdmaWx0ZXInLFxuICAgICAgICAgICAgdGFyZ2V0RWw6IHRhcmdldCxcbiAgICAgICAgICAgIGZyb21FbDogZWwsXG4gICAgICAgICAgICB0b0VsOiBlbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHBsdWdpbkV2ZW50KCdmaWx0ZXInLCBfdGhpcywge1xuICAgICAgICAgICAgZXZ0OiBldnRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgIHByZXZlbnRPbkZpbHRlciAmJiBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuOyAvLyBjYW5jZWwgZG5kXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmhhbmRsZSAmJiAhY2xvc2VzdChvcmlnaW5hbFRhcmdldCwgb3B0aW9ucy5oYW5kbGUsIGVsLCBmYWxzZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBQcmVwYXJlIGBkcmFnc3RhcnRgXG4gICAgdGhpcy5fcHJlcGFyZURyYWdTdGFydChldnQsIHRvdWNoLCB0YXJnZXQpO1xuICB9LFxuICBfcHJlcGFyZURyYWdTdGFydDogZnVuY3Rpb24gX3ByZXBhcmVEcmFnU3RhcnQoIC8qKiBFdmVudCAqL2V2dCwgLyoqIFRvdWNoICovdG91Y2gsIC8qKiBIVE1MRWxlbWVudCAqL3RhcmdldCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICBlbCA9IF90aGlzLmVsLFxuICAgICAgb3B0aW9ucyA9IF90aGlzLm9wdGlvbnMsXG4gICAgICBvd25lckRvY3VtZW50ID0gZWwub3duZXJEb2N1bWVudCxcbiAgICAgIGRyYWdTdGFydEZuO1xuICAgIGlmICh0YXJnZXQgJiYgIWRyYWdFbCAmJiB0YXJnZXQucGFyZW50Tm9kZSA9PT0gZWwpIHtcbiAgICAgIHZhciBkcmFnUmVjdCA9IGdldFJlY3QodGFyZ2V0KTtcbiAgICAgIHJvb3RFbCA9IGVsO1xuICAgICAgZHJhZ0VsID0gdGFyZ2V0O1xuICAgICAgcGFyZW50RWwgPSBkcmFnRWwucGFyZW50Tm9kZTtcbiAgICAgIG5leHRFbCA9IGRyYWdFbC5uZXh0U2libGluZztcbiAgICAgIGxhc3REb3duRWwgPSB0YXJnZXQ7XG4gICAgICBhY3RpdmVHcm91cCA9IG9wdGlvbnMuZ3JvdXA7XG4gICAgICBTb3J0YWJsZS5kcmFnZ2VkID0gZHJhZ0VsO1xuICAgICAgdGFwRXZ0ID0ge1xuICAgICAgICB0YXJnZXQ6IGRyYWdFbCxcbiAgICAgICAgY2xpZW50WDogKHRvdWNoIHx8IGV2dCkuY2xpZW50WCxcbiAgICAgICAgY2xpZW50WTogKHRvdWNoIHx8IGV2dCkuY2xpZW50WVxuICAgICAgfTtcbiAgICAgIHRhcERpc3RhbmNlTGVmdCA9IHRhcEV2dC5jbGllbnRYIC0gZHJhZ1JlY3QubGVmdDtcbiAgICAgIHRhcERpc3RhbmNlVG9wID0gdGFwRXZ0LmNsaWVudFkgLSBkcmFnUmVjdC50b3A7XG4gICAgICB0aGlzLl9sYXN0WCA9ICh0b3VjaCB8fCBldnQpLmNsaWVudFg7XG4gICAgICB0aGlzLl9sYXN0WSA9ICh0b3VjaCB8fCBldnQpLmNsaWVudFk7XG4gICAgICBkcmFnRWwuc3R5bGVbJ3dpbGwtY2hhbmdlJ10gPSAnYWxsJztcbiAgICAgIGRyYWdTdGFydEZuID0gZnVuY3Rpb24gZHJhZ1N0YXJ0Rm4oKSB7XG4gICAgICAgIHBsdWdpbkV2ZW50KCdkZWxheUVuZGVkJywgX3RoaXMsIHtcbiAgICAgICAgICBldnQ6IGV2dFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKFNvcnRhYmxlLmV2ZW50Q2FuY2VsZWQpIHtcbiAgICAgICAgICBfdGhpcy5fb25Ecm9wKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIERlbGF5ZWQgZHJhZyBoYXMgYmVlbiB0cmlnZ2VyZWRcbiAgICAgICAgLy8gd2UgY2FuIHJlLWVuYWJsZSB0aGUgZXZlbnRzOiB0b3VjaG1vdmUvbW91c2Vtb3ZlXG4gICAgICAgIF90aGlzLl9kaXNhYmxlRGVsYXllZERyYWdFdmVudHMoKTtcbiAgICAgICAgaWYgKCFGaXJlRm94ICYmIF90aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgICAgICAgIGRyYWdFbC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmluZCB0aGUgZXZlbnRzOiBkcmFnc3RhcnQvZHJhZ2VuZFxuICAgICAgICBfdGhpcy5fdHJpZ2dlckRyYWdTdGFydChldnQsIHRvdWNoKTtcblxuICAgICAgICAvLyBEcmFnIHN0YXJ0IGV2ZW50XG4gICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICBzb3J0YWJsZTogX3RoaXMsXG4gICAgICAgICAgbmFtZTogJ2Nob29zZScsXG4gICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENob3NlbiBpdGVtXG4gICAgICAgIHRvZ2dsZUNsYXNzKGRyYWdFbCwgb3B0aW9ucy5jaG9zZW5DbGFzcywgdHJ1ZSk7XG4gICAgICB9O1xuXG4gICAgICAvLyBEaXNhYmxlIFwiZHJhZ2dhYmxlXCJcbiAgICAgIG9wdGlvbnMuaWdub3JlLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbiAoY3JpdGVyaWEpIHtcbiAgICAgICAgZmluZChkcmFnRWwsIGNyaXRlcmlhLnRyaW0oKSwgX2Rpc2FibGVEcmFnZ2FibGUpO1xuICAgICAgfSk7XG4gICAgICBvbihvd25lckRvY3VtZW50LCAnZHJhZ292ZXInLCBuZWFyZXN0RW1wdHlJbnNlcnREZXRlY3RFdmVudCk7XG4gICAgICBvbihvd25lckRvY3VtZW50LCAnbW91c2Vtb3ZlJywgbmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQpO1xuICAgICAgb24ob3duZXJEb2N1bWVudCwgJ3RvdWNobW92ZScsIG5lYXJlc3RFbXB0eUluc2VydERldGVjdEV2ZW50KTtcbiAgICAgIGlmIChvcHRpb25zLnN1cHBvcnRQb2ludGVyKSB7XG4gICAgICAgIG9uKG93bmVyRG9jdW1lbnQsICdwb2ludGVydXAnLCBfdGhpcy5fb25Ecm9wKTtcbiAgICAgICAgLy8gTmF0aXZlIEQmRCB0cmlnZ2VycyBwb2ludGVyY2FuY2VsXG4gICAgICAgICF0aGlzLm5hdGl2ZURyYWdnYWJsZSAmJiBvbihvd25lckRvY3VtZW50LCAncG9pbnRlcmNhbmNlbCcsIF90aGlzLl9vbkRyb3ApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb24ob3duZXJEb2N1bWVudCwgJ21vdXNldXAnLCBfdGhpcy5fb25Ecm9wKTtcbiAgICAgICAgb24ob3duZXJEb2N1bWVudCwgJ3RvdWNoZW5kJywgX3RoaXMuX29uRHJvcCk7XG4gICAgICAgIG9uKG93bmVyRG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIF90aGlzLl9vbkRyb3ApO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIGRyYWdFbCBkcmFnZ2FibGUgKG11c3QgYmUgYmVmb3JlIGRlbGF5IGZvciBGaXJlRm94KVxuICAgICAgaWYgKEZpcmVGb3ggJiYgdGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnRvdWNoU3RhcnRUaHJlc2hvbGQgPSA0O1xuICAgICAgICBkcmFnRWwuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHBsdWdpbkV2ZW50KCdkZWxheVN0YXJ0JywgdGhpcywge1xuICAgICAgICBldnQ6IGV2dFxuICAgICAgfSk7XG5cbiAgICAgIC8vIERlbGF5IGlzIGltcG9zc2libGUgZm9yIG5hdGl2ZSBEbkQgaW4gRWRnZSBvciBJRVxuICAgICAgaWYgKG9wdGlvbnMuZGVsYXkgJiYgKCFvcHRpb25zLmRlbGF5T25Ub3VjaE9ubHkgfHwgdG91Y2gpICYmICghdGhpcy5uYXRpdmVEcmFnZ2FibGUgfHwgIShFZGdlIHx8IElFMTFPckxlc3MpKSkge1xuICAgICAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkge1xuICAgICAgICAgIHRoaXMuX29uRHJvcCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGUgdXNlciBtb3ZlcyB0aGUgcG9pbnRlciBvciBsZXQgZ28gdGhlIGNsaWNrIG9yIHRvdWNoXG4gICAgICAgIC8vIGJlZm9yZSB0aGUgZGVsYXkgaGFzIGJlZW4gcmVhY2hlZDpcbiAgICAgICAgLy8gZGlzYWJsZSB0aGUgZGVsYXllZCBkcmFnXG4gICAgICAgIGlmIChvcHRpb25zLnN1cHBvcnRQb2ludGVyKSB7XG4gICAgICAgICAgb24ob3duZXJEb2N1bWVudCwgJ3BvaW50ZXJ1cCcsIF90aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuICAgICAgICAgIG9uKG93bmVyRG9jdW1lbnQsICdwb2ludGVyY2FuY2VsJywgX3RoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb24ob3duZXJEb2N1bWVudCwgJ21vdXNldXAnLCBfdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICAgICAgICBvbihvd25lckRvY3VtZW50LCAndG91Y2hlbmQnLCBfdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICAgICAgICBvbihvd25lckRvY3VtZW50LCAndG91Y2hjYW5jZWwnLCBfdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICAgICAgfVxuICAgICAgICBvbihvd25lckRvY3VtZW50LCAnbW91c2Vtb3ZlJywgX3RoaXMuX2RlbGF5ZWREcmFnVG91Y2hNb3ZlSGFuZGxlcik7XG4gICAgICAgIG9uKG93bmVyRG9jdW1lbnQsICd0b3VjaG1vdmUnLCBfdGhpcy5fZGVsYXllZERyYWdUb3VjaE1vdmVIYW5kbGVyKTtcbiAgICAgICAgb3B0aW9ucy5zdXBwb3J0UG9pbnRlciAmJiBvbihvd25lckRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCBfdGhpcy5fZGVsYXllZERyYWdUb3VjaE1vdmVIYW5kbGVyKTtcbiAgICAgICAgX3RoaXMuX2RyYWdTdGFydFRpbWVyID0gc2V0VGltZW91dChkcmFnU3RhcnRGbiwgb3B0aW9ucy5kZWxheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkcmFnU3RhcnRGbigpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgX2RlbGF5ZWREcmFnVG91Y2hNb3ZlSGFuZGxlcjogZnVuY3Rpb24gX2RlbGF5ZWREcmFnVG91Y2hNb3ZlSGFuZGxlciggLyoqIFRvdWNoRXZlbnR8UG9pbnRlckV2ZW50ICoqL2UpIHtcbiAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXMgPyBlLnRvdWNoZXNbMF0gOiBlO1xuICAgIGlmIChNYXRoLm1heChNYXRoLmFicyh0b3VjaC5jbGllbnRYIC0gdGhpcy5fbGFzdFgpLCBNYXRoLmFicyh0b3VjaC5jbGllbnRZIC0gdGhpcy5fbGFzdFkpKSA+PSBNYXRoLmZsb29yKHRoaXMub3B0aW9ucy50b3VjaFN0YXJ0VGhyZXNob2xkIC8gKHRoaXMubmF0aXZlRHJhZ2dhYmxlICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpKSkge1xuICAgICAgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKCk7XG4gICAgfVxuICB9LFxuICBfZGlzYWJsZURlbGF5ZWREcmFnOiBmdW5jdGlvbiBfZGlzYWJsZURlbGF5ZWREcmFnKCkge1xuICAgIGRyYWdFbCAmJiBfZGlzYWJsZURyYWdnYWJsZShkcmFnRWwpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9kcmFnU3RhcnRUaW1lcik7XG4gICAgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnRXZlbnRzKCk7XG4gIH0sXG4gIF9kaXNhYmxlRGVsYXllZERyYWdFdmVudHM6IGZ1bmN0aW9uIF9kaXNhYmxlRGVsYXllZERyYWdFdmVudHMoKSB7XG4gICAgdmFyIG93bmVyRG9jdW1lbnQgPSB0aGlzLmVsLm93bmVyRG9jdW1lbnQ7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICdtb3VzZXVwJywgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ3RvdWNoZW5kJywgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ3BvaW50ZXJ1cCcsIHRoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICdwb2ludGVyY2FuY2VsJywgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMuX2RlbGF5ZWREcmFnVG91Y2hNb3ZlSGFuZGxlcik7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICd0b3VjaG1vdmUnLCB0aGlzLl9kZWxheWVkRHJhZ1RvdWNoTW92ZUhhbmRsZXIpO1xuICAgIG9mZihvd25lckRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9kZWxheWVkRHJhZ1RvdWNoTW92ZUhhbmRsZXIpO1xuICB9LFxuICBfdHJpZ2dlckRyYWdTdGFydDogZnVuY3Rpb24gX3RyaWdnZXJEcmFnU3RhcnQoIC8qKiBFdmVudCAqL2V2dCwgLyoqIFRvdWNoICovdG91Y2gpIHtcbiAgICB0b3VjaCA9IHRvdWNoIHx8IGV2dC5wb2ludGVyVHlwZSA9PSAndG91Y2gnICYmIGV2dDtcbiAgICBpZiAoIXRoaXMubmF0aXZlRHJhZ2dhYmxlIHx8IHRvdWNoKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnN1cHBvcnRQb2ludGVyKSB7XG4gICAgICAgIG9uKGRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRvdWNoKSB7XG4gICAgICAgIG9uKGRvY3VtZW50LCAndG91Y2htb3ZlJywgdGhpcy5fb25Ub3VjaE1vdmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb24oZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9uKGRyYWdFbCwgJ2RyYWdlbmQnLCB0aGlzKTtcbiAgICAgIG9uKHJvb3RFbCwgJ2RyYWdzdGFydCcsIHRoaXMuX29uRHJhZ1N0YXJ0KTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmIChkb2N1bWVudC5zZWxlY3Rpb24pIHtcbiAgICAgICAgX25leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBkb2N1bWVudC5zZWxlY3Rpb24uZW1wdHkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7fVxuICB9LFxuICBfZHJhZ1N0YXJ0ZWQ6IGZ1bmN0aW9uIF9kcmFnU3RhcnRlZChmYWxsYmFjaywgZXZ0KSB7XG4gICAgYXdhaXRpbmdEcmFnU3RhcnRlZCA9IGZhbHNlO1xuICAgIGlmIChyb290RWwgJiYgZHJhZ0VsKSB7XG4gICAgICBwbHVnaW5FdmVudCgnZHJhZ1N0YXJ0ZWQnLCB0aGlzLCB7XG4gICAgICAgIGV2dDogZXZ0XG4gICAgICB9KTtcbiAgICAgIGlmICh0aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgICAgICBvbihkb2N1bWVudCwgJ2RyYWdvdmVyJywgX2NoZWNrT3V0c2lkZVRhcmdldEVsKTtcbiAgICAgIH1cbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICAvLyBBcHBseSBlZmZlY3RcbiAgICAgICFmYWxsYmFjayAmJiB0b2dnbGVDbGFzcyhkcmFnRWwsIG9wdGlvbnMuZHJhZ0NsYXNzLCBmYWxzZSk7XG4gICAgICB0b2dnbGVDbGFzcyhkcmFnRWwsIG9wdGlvbnMuZ2hvc3RDbGFzcywgdHJ1ZSk7XG4gICAgICBTb3J0YWJsZS5hY3RpdmUgPSB0aGlzO1xuICAgICAgZmFsbGJhY2sgJiYgdGhpcy5fYXBwZW5kR2hvc3QoKTtcblxuICAgICAgLy8gRHJhZyBzdGFydCBldmVudFxuICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgbmFtZTogJ3N0YXJ0JyxcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbnVsbGluZygpO1xuICAgIH1cbiAgfSxcbiAgX2VtdWxhdGVEcmFnT3ZlcjogZnVuY3Rpb24gX2VtdWxhdGVEcmFnT3ZlcigpIHtcbiAgICBpZiAodG91Y2hFdnQpIHtcbiAgICAgIHRoaXMuX2xhc3RYID0gdG91Y2hFdnQuY2xpZW50WDtcbiAgICAgIHRoaXMuX2xhc3RZID0gdG91Y2hFdnQuY2xpZW50WTtcbiAgICAgIF9oaWRlR2hvc3RGb3JUYXJnZXQoKTtcbiAgICAgIHZhciB0YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHRvdWNoRXZ0LmNsaWVudFgsIHRvdWNoRXZ0LmNsaWVudFkpO1xuICAgICAgdmFyIHBhcmVudCA9IHRhcmdldDtcbiAgICAgIHdoaWxlICh0YXJnZXQgJiYgdGFyZ2V0LnNoYWRvd1Jvb3QpIHtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnNoYWRvd1Jvb3QuZWxlbWVudEZyb21Qb2ludCh0b3VjaEV2dC5jbGllbnRYLCB0b3VjaEV2dC5jbGllbnRZKTtcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gcGFyZW50KSBicmVhaztcbiAgICAgICAgcGFyZW50ID0gdGFyZ2V0O1xuICAgICAgfVxuICAgICAgZHJhZ0VsLnBhcmVudE5vZGVbZXhwYW5kb10uX2lzT3V0c2lkZVRoaXNFbCh0YXJnZXQpO1xuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgaWYgKHBhcmVudFtleHBhbmRvXSkge1xuICAgICAgICAgICAgdmFyIGluc2VydGVkID0gdm9pZCAwO1xuICAgICAgICAgICAgaW5zZXJ0ZWQgPSBwYXJlbnRbZXhwYW5kb10uX29uRHJhZ092ZXIoe1xuICAgICAgICAgICAgICBjbGllbnRYOiB0b3VjaEV2dC5jbGllbnRYLFxuICAgICAgICAgICAgICBjbGllbnRZOiB0b3VjaEV2dC5jbGllbnRZLFxuICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICAgICAgcm9vdEVsOiBwYXJlbnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGluc2VydGVkICYmICF0aGlzLm9wdGlvbnMuZHJhZ292ZXJCdWJibGUpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhcmdldCA9IHBhcmVudDsgLy8gc3RvcmUgbGFzdCBlbGVtZW50XG4gICAgICAgIH1cbiAgICAgICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqLyB3aGlsZSAocGFyZW50ID0gZ2V0UGFyZW50T3JIb3N0KHBhcmVudCkpO1xuICAgICAgfVxuICAgICAgX3VuaGlkZUdob3N0Rm9yVGFyZ2V0KCk7XG4gICAgfVxuICB9LFxuICBfb25Ub3VjaE1vdmU6IGZ1bmN0aW9uIF9vblRvdWNoTW92ZSggLyoqVG91Y2hFdmVudCovZXZ0KSB7XG4gICAgaWYgKHRhcEV2dCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIGZhbGxiYWNrVG9sZXJhbmNlID0gb3B0aW9ucy5mYWxsYmFja1RvbGVyYW5jZSxcbiAgICAgICAgZmFsbGJhY2tPZmZzZXQgPSBvcHRpb25zLmZhbGxiYWNrT2Zmc2V0LFxuICAgICAgICB0b3VjaCA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnQsXG4gICAgICAgIGdob3N0TWF0cml4ID0gZ2hvc3RFbCAmJiBtYXRyaXgoZ2hvc3RFbCwgdHJ1ZSksXG4gICAgICAgIHNjYWxlWCA9IGdob3N0RWwgJiYgZ2hvc3RNYXRyaXggJiYgZ2hvc3RNYXRyaXguYSxcbiAgICAgICAgc2NhbGVZID0gZ2hvc3RFbCAmJiBnaG9zdE1hdHJpeCAmJiBnaG9zdE1hdHJpeC5kLFxuICAgICAgICByZWxhdGl2ZVNjcm9sbE9mZnNldCA9IFBvc2l0aW9uR2hvc3RBYnNvbHV0ZWx5ICYmIGdob3N0UmVsYXRpdmVQYXJlbnQgJiYgZ2V0UmVsYXRpdmVTY3JvbGxPZmZzZXQoZ2hvc3RSZWxhdGl2ZVBhcmVudCksXG4gICAgICAgIGR4ID0gKHRvdWNoLmNsaWVudFggLSB0YXBFdnQuY2xpZW50WCArIGZhbGxiYWNrT2Zmc2V0LngpIC8gKHNjYWxlWCB8fCAxKSArIChyZWxhdGl2ZVNjcm9sbE9mZnNldCA/IHJlbGF0aXZlU2Nyb2xsT2Zmc2V0WzBdIC0gZ2hvc3RSZWxhdGl2ZVBhcmVudEluaXRpYWxTY3JvbGxbMF0gOiAwKSAvIChzY2FsZVggfHwgMSksXG4gICAgICAgIGR5ID0gKHRvdWNoLmNsaWVudFkgLSB0YXBFdnQuY2xpZW50WSArIGZhbGxiYWNrT2Zmc2V0LnkpIC8gKHNjYWxlWSB8fCAxKSArIChyZWxhdGl2ZVNjcm9sbE9mZnNldCA/IHJlbGF0aXZlU2Nyb2xsT2Zmc2V0WzFdIC0gZ2hvc3RSZWxhdGl2ZVBhcmVudEluaXRpYWxTY3JvbGxbMV0gOiAwKSAvIChzY2FsZVkgfHwgMSk7XG5cbiAgICAgIC8vIG9ubHkgc2V0IHRoZSBzdGF0dXMgdG8gZHJhZ2dpbmcsIHdoZW4gd2UgYXJlIGFjdHVhbGx5IGRyYWdnaW5nXG4gICAgICBpZiAoIVNvcnRhYmxlLmFjdGl2ZSAmJiAhYXdhaXRpbmdEcmFnU3RhcnRlZCkge1xuICAgICAgICBpZiAoZmFsbGJhY2tUb2xlcmFuY2UgJiYgTWF0aC5tYXgoTWF0aC5hYnModG91Y2guY2xpZW50WCAtIHRoaXMuX2xhc3RYKSwgTWF0aC5hYnModG91Y2guY2xpZW50WSAtIHRoaXMuX2xhc3RZKSkgPCBmYWxsYmFja1RvbGVyYW5jZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vbkRyYWdTdGFydChldnQsIHRydWUpO1xuICAgICAgfVxuICAgICAgaWYgKGdob3N0RWwpIHtcbiAgICAgICAgaWYgKGdob3N0TWF0cml4KSB7XG4gICAgICAgICAgZ2hvc3RNYXRyaXguZSArPSBkeCAtIChsYXN0RHggfHwgMCk7XG4gICAgICAgICAgZ2hvc3RNYXRyaXguZiArPSBkeSAtIChsYXN0RHkgfHwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ2hvc3RNYXRyaXggPSB7XG4gICAgICAgICAgICBhOiAxLFxuICAgICAgICAgICAgYjogMCxcbiAgICAgICAgICAgIGM6IDAsXG4gICAgICAgICAgICBkOiAxLFxuICAgICAgICAgICAgZTogZHgsXG4gICAgICAgICAgICBmOiBkeVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNzc01hdHJpeCA9IFwibWF0cml4KFwiLmNvbmNhdChnaG9zdE1hdHJpeC5hLCBcIixcIikuY29uY2F0KGdob3N0TWF0cml4LmIsIFwiLFwiKS5jb25jYXQoZ2hvc3RNYXRyaXguYywgXCIsXCIpLmNvbmNhdChnaG9zdE1hdHJpeC5kLCBcIixcIikuY29uY2F0KGdob3N0TWF0cml4LmUsIFwiLFwiKS5jb25jYXQoZ2hvc3RNYXRyaXguZiwgXCIpXCIpO1xuICAgICAgICBjc3MoZ2hvc3RFbCwgJ3dlYmtpdFRyYW5zZm9ybScsIGNzc01hdHJpeCk7XG4gICAgICAgIGNzcyhnaG9zdEVsLCAnbW96VHJhbnNmb3JtJywgY3NzTWF0cml4KTtcbiAgICAgICAgY3NzKGdob3N0RWwsICdtc1RyYW5zZm9ybScsIGNzc01hdHJpeCk7XG4gICAgICAgIGNzcyhnaG9zdEVsLCAndHJhbnNmb3JtJywgY3NzTWF0cml4KTtcbiAgICAgICAgbGFzdER4ID0gZHg7XG4gICAgICAgIGxhc3REeSA9IGR5O1xuICAgICAgICB0b3VjaEV2dCA9IHRvdWNoO1xuICAgICAgfVxuICAgICAgZXZ0LmNhbmNlbGFibGUgJiYgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9LFxuICBfYXBwZW5kR2hvc3Q6IGZ1bmN0aW9uIF9hcHBlbmRHaG9zdCgpIHtcbiAgICAvLyBCdWcgaWYgdXNpbmcgc2NhbGUoKTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjYzNzA1OFxuICAgIC8vIE5vdCBiZWluZyBhZGp1c3RlZCBmb3JcbiAgICBpZiAoIWdob3N0RWwpIHtcbiAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLm9wdGlvbnMuZmFsbGJhY2tPbkJvZHkgPyBkb2N1bWVudC5ib2R5IDogcm9vdEVsLFxuICAgICAgICByZWN0ID0gZ2V0UmVjdChkcmFnRWwsIHRydWUsIFBvc2l0aW9uR2hvc3RBYnNvbHV0ZWx5LCB0cnVlLCBjb250YWluZXIpLFxuICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICAvLyBQb3NpdGlvbiBhYnNvbHV0ZWx5XG4gICAgICBpZiAoUG9zaXRpb25HaG9zdEFic29sdXRlbHkpIHtcbiAgICAgICAgLy8gR2V0IHJlbGF0aXZlbHkgcG9zaXRpb25lZCBwYXJlbnRcbiAgICAgICAgZ2hvc3RSZWxhdGl2ZVBhcmVudCA9IGNvbnRhaW5lcjtcbiAgICAgICAgd2hpbGUgKGNzcyhnaG9zdFJlbGF0aXZlUGFyZW50LCAncG9zaXRpb24nKSA9PT0gJ3N0YXRpYycgJiYgY3NzKGdob3N0UmVsYXRpdmVQYXJlbnQsICd0cmFuc2Zvcm0nKSA9PT0gJ25vbmUnICYmIGdob3N0UmVsYXRpdmVQYXJlbnQgIT09IGRvY3VtZW50KSB7XG4gICAgICAgICAgZ2hvc3RSZWxhdGl2ZVBhcmVudCA9IGdob3N0UmVsYXRpdmVQYXJlbnQucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2hvc3RSZWxhdGl2ZVBhcmVudCAhPT0gZG9jdW1lbnQuYm9keSAmJiBnaG9zdFJlbGF0aXZlUGFyZW50ICE9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgICAgICBpZiAoZ2hvc3RSZWxhdGl2ZVBhcmVudCA9PT0gZG9jdW1lbnQpIGdob3N0UmVsYXRpdmVQYXJlbnQgPSBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCk7XG4gICAgICAgICAgcmVjdC50b3AgKz0gZ2hvc3RSZWxhdGl2ZVBhcmVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgcmVjdC5sZWZ0ICs9IGdob3N0UmVsYXRpdmVQYXJlbnQuc2Nyb2xsTGVmdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBnaG9zdFJlbGF0aXZlUGFyZW50ID0gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIGdob3N0UmVsYXRpdmVQYXJlbnRJbml0aWFsU2Nyb2xsID0gZ2V0UmVsYXRpdmVTY3JvbGxPZmZzZXQoZ2hvc3RSZWxhdGl2ZVBhcmVudCk7XG4gICAgICB9XG4gICAgICBnaG9zdEVsID0gZHJhZ0VsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIHRvZ2dsZUNsYXNzKGdob3N0RWwsIG9wdGlvbnMuZ2hvc3RDbGFzcywgZmFsc2UpO1xuICAgICAgdG9nZ2xlQ2xhc3MoZ2hvc3RFbCwgb3B0aW9ucy5mYWxsYmFja0NsYXNzLCB0cnVlKTtcbiAgICAgIHRvZ2dsZUNsYXNzKGdob3N0RWwsIG9wdGlvbnMuZHJhZ0NsYXNzLCB0cnVlKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAndHJhbnNpdGlvbicsICcnKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAndHJhbnNmb3JtJywgJycpO1xuICAgICAgY3NzKGdob3N0RWwsICdib3gtc2l6aW5nJywgJ2JvcmRlci1ib3gnKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAnbWFyZ2luJywgMCk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ3RvcCcsIHJlY3QudG9wKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAnbGVmdCcsIHJlY3QubGVmdCk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ3dpZHRoJywgcmVjdC53aWR0aCk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ2hlaWdodCcsIHJlY3QuaGVpZ2h0KTtcbiAgICAgIGNzcyhnaG9zdEVsLCAnb3BhY2l0eScsICcwLjgnKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAncG9zaXRpb24nLCBQb3NpdGlvbkdob3N0QWJzb2x1dGVseSA/ICdhYnNvbHV0ZScgOiAnZml4ZWQnKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAnekluZGV4JywgJzEwMDAwMCcpO1xuICAgICAgY3NzKGdob3N0RWwsICdwb2ludGVyRXZlbnRzJywgJ25vbmUnKTtcbiAgICAgIFNvcnRhYmxlLmdob3N0ID0gZ2hvc3RFbDtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChnaG9zdEVsKTtcblxuICAgICAgLy8gU2V0IHRyYW5zZm9ybS1vcmlnaW5cbiAgICAgIGNzcyhnaG9zdEVsLCAndHJhbnNmb3JtLW9yaWdpbicsIHRhcERpc3RhbmNlTGVmdCAvIHBhcnNlSW50KGdob3N0RWwuc3R5bGUud2lkdGgpICogMTAwICsgJyUgJyArIHRhcERpc3RhbmNlVG9wIC8gcGFyc2VJbnQoZ2hvc3RFbC5zdHlsZS5oZWlnaHQpICogMTAwICsgJyUnKTtcbiAgICB9XG4gIH0sXG4gIF9vbkRyYWdTdGFydDogZnVuY3Rpb24gX29uRHJhZ1N0YXJ0KCAvKipFdmVudCovZXZ0LCAvKipib29sZWFuKi9mYWxsYmFjaykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIGRhdGFUcmFuc2ZlciA9IGV2dC5kYXRhVHJhbnNmZXI7XG4gICAgdmFyIG9wdGlvbnMgPSBfdGhpcy5vcHRpb25zO1xuICAgIHBsdWdpbkV2ZW50KCdkcmFnU3RhcnQnLCB0aGlzLCB7XG4gICAgICBldnQ6IGV2dFxuICAgIH0pO1xuICAgIGlmIChTb3J0YWJsZS5ldmVudENhbmNlbGVkKSB7XG4gICAgICB0aGlzLl9vbkRyb3AoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcGx1Z2luRXZlbnQoJ3NldHVwQ2xvbmUnLCB0aGlzKTtcbiAgICBpZiAoIVNvcnRhYmxlLmV2ZW50Q2FuY2VsZWQpIHtcbiAgICAgIGNsb25lRWwgPSBjbG9uZShkcmFnRWwpO1xuICAgICAgY2xvbmVFbC5yZW1vdmVBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICAgIGNsb25lRWwuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICBjbG9uZUVsLnN0eWxlWyd3aWxsLWNoYW5nZSddID0gJyc7XG4gICAgICB0aGlzLl9oaWRlQ2xvbmUoKTtcbiAgICAgIHRvZ2dsZUNsYXNzKGNsb25lRWwsIHRoaXMub3B0aW9ucy5jaG9zZW5DbGFzcywgZmFsc2UpO1xuICAgICAgU29ydGFibGUuY2xvbmUgPSBjbG9uZUVsO1xuICAgIH1cblxuICAgIC8vICMxMTQzOiBJRnJhbWUgc3VwcG9ydCB3b3JrYXJvdW5kXG4gICAgX3RoaXMuY2xvbmVJZCA9IF9uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBwbHVnaW5FdmVudCgnY2xvbmUnLCBfdGhpcyk7XG4gICAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkgcmV0dXJuO1xuICAgICAgaWYgKCFfdGhpcy5vcHRpb25zLnJlbW92ZUNsb25lT25IaWRlKSB7XG4gICAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUoY2xvbmVFbCwgZHJhZ0VsKTtcbiAgICAgIH1cbiAgICAgIF90aGlzLl9oaWRlQ2xvbmUoKTtcbiAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgc29ydGFibGU6IF90aGlzLFxuICAgICAgICBuYW1lOiAnY2xvbmUnXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAhZmFsbGJhY2sgJiYgdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBvcHRpb25zLmRyYWdDbGFzcywgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgcHJvcGVyIGRyb3AgZXZlbnRzXG4gICAgaWYgKGZhbGxiYWNrKSB7XG4gICAgICBpZ25vcmVOZXh0Q2xpY2sgPSB0cnVlO1xuICAgICAgX3RoaXMuX2xvb3BJZCA9IHNldEludGVydmFsKF90aGlzLl9lbXVsYXRlRHJhZ092ZXIsIDUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVW5kbyB3aGF0IHdhcyBzZXQgaW4gX3ByZXBhcmVEcmFnU3RhcnQgYmVmb3JlIGRyYWcgc3RhcnRlZFxuICAgICAgb2ZmKGRvY3VtZW50LCAnbW91c2V1cCcsIF90aGlzLl9vbkRyb3ApO1xuICAgICAgb2ZmKGRvY3VtZW50LCAndG91Y2hlbmQnLCBfdGhpcy5fb25Ecm9wKTtcbiAgICAgIG9mZihkb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgX3RoaXMuX29uRHJvcCk7XG4gICAgICBpZiAoZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgIGRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgICAgICBvcHRpb25zLnNldERhdGEgJiYgb3B0aW9ucy5zZXREYXRhLmNhbGwoX3RoaXMsIGRhdGFUcmFuc2ZlciwgZHJhZ0VsKTtcbiAgICAgIH1cbiAgICAgIG9uKGRvY3VtZW50LCAnZHJvcCcsIF90aGlzKTtcblxuICAgICAgLy8gIzEyNzYgZml4OlxuICAgICAgY3NzKGRyYWdFbCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGVaKDApJyk7XG4gICAgfVxuICAgIGF3YWl0aW5nRHJhZ1N0YXJ0ZWQgPSB0cnVlO1xuICAgIF90aGlzLl9kcmFnU3RhcnRJZCA9IF9uZXh0VGljayhfdGhpcy5fZHJhZ1N0YXJ0ZWQuYmluZChfdGhpcywgZmFsbGJhY2ssIGV2dCkpO1xuICAgIG9uKGRvY3VtZW50LCAnc2VsZWN0c3RhcnQnLCBfdGhpcyk7XG4gICAgbW92ZWQgPSB0cnVlO1xuICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICBpZiAoU2FmYXJpKSB7XG4gICAgICBjc3MoZG9jdW1lbnQuYm9keSwgJ3VzZXItc2VsZWN0JywgJ25vbmUnKTtcbiAgICB9XG4gIH0sXG4gIC8vIFJldHVybnMgdHJ1ZSAtIGlmIG5vIGZ1cnRoZXIgYWN0aW9uIGlzIG5lZWRlZCAoZWl0aGVyIGluc2VydGVkIG9yIGFub3RoZXIgY29uZGl0aW9uKVxuICBfb25EcmFnT3ZlcjogZnVuY3Rpb24gX29uRHJhZ092ZXIoIC8qKkV2ZW50Ki9ldnQpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsLFxuICAgICAgdGFyZ2V0ID0gZXZ0LnRhcmdldCxcbiAgICAgIGRyYWdSZWN0LFxuICAgICAgdGFyZ2V0UmVjdCxcbiAgICAgIHJldmVydCxcbiAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICBncm91cCA9IG9wdGlvbnMuZ3JvdXAsXG4gICAgICBhY3RpdmVTb3J0YWJsZSA9IFNvcnRhYmxlLmFjdGl2ZSxcbiAgICAgIGlzT3duZXIgPSBhY3RpdmVHcm91cCA9PT0gZ3JvdXAsXG4gICAgICBjYW5Tb3J0ID0gb3B0aW9ucy5zb3J0LFxuICAgICAgZnJvbVNvcnRhYmxlID0gcHV0U29ydGFibGUgfHwgYWN0aXZlU29ydGFibGUsXG4gICAgICB2ZXJ0aWNhbCxcbiAgICAgIF90aGlzID0gdGhpcyxcbiAgICAgIGNvbXBsZXRlZEZpcmVkID0gZmFsc2U7XG4gICAgaWYgKF9zaWxlbnQpIHJldHVybjtcbiAgICBmdW5jdGlvbiBkcmFnT3ZlckV2ZW50KG5hbWUsIGV4dHJhKSB7XG4gICAgICBwbHVnaW5FdmVudChuYW1lLCBfdGhpcywgX29iamVjdFNwcmVhZDIoe1xuICAgICAgICBldnQ6IGV2dCxcbiAgICAgICAgaXNPd25lcjogaXNPd25lcixcbiAgICAgICAgYXhpczogdmVydGljYWwgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnLFxuICAgICAgICByZXZlcnQ6IHJldmVydCxcbiAgICAgICAgZHJhZ1JlY3Q6IGRyYWdSZWN0LFxuICAgICAgICB0YXJnZXRSZWN0OiB0YXJnZXRSZWN0LFxuICAgICAgICBjYW5Tb3J0OiBjYW5Tb3J0LFxuICAgICAgICBmcm9tU29ydGFibGU6IGZyb21Tb3J0YWJsZSxcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgIGNvbXBsZXRlZDogY29tcGxldGVkLFxuICAgICAgICBvbk1vdmU6IGZ1bmN0aW9uIG9uTW92ZSh0YXJnZXQsIGFmdGVyKSB7XG4gICAgICAgICAgcmV0dXJuIF9vbk1vdmUocm9vdEVsLCBlbCwgZHJhZ0VsLCBkcmFnUmVjdCwgdGFyZ2V0LCBnZXRSZWN0KHRhcmdldCksIGV2dCwgYWZ0ZXIpO1xuICAgICAgICB9LFxuICAgICAgICBjaGFuZ2VkOiBjaGFuZ2VkXG4gICAgICB9LCBleHRyYSkpO1xuICAgIH1cblxuICAgIC8vIENhcHR1cmUgYW5pbWF0aW9uIHN0YXRlXG4gICAgZnVuY3Rpb24gY2FwdHVyZSgpIHtcbiAgICAgIGRyYWdPdmVyRXZlbnQoJ2RyYWdPdmVyQW5pbWF0aW9uQ2FwdHVyZScpO1xuICAgICAgX3RoaXMuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG4gICAgICBpZiAoX3RoaXMgIT09IGZyb21Tb3J0YWJsZSkge1xuICAgICAgICBmcm9tU29ydGFibGUuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGludm9jYXRpb24gd2hlbiBkcmFnRWwgaXMgaW5zZXJ0ZWQgKG9yIGNvbXBsZXRlZClcbiAgICBmdW5jdGlvbiBjb21wbGV0ZWQoaW5zZXJ0aW9uKSB7XG4gICAgICBkcmFnT3ZlckV2ZW50KCdkcmFnT3ZlckNvbXBsZXRlZCcsIHtcbiAgICAgICAgaW5zZXJ0aW9uOiBpbnNlcnRpb25cbiAgICAgIH0pO1xuICAgICAgaWYgKGluc2VydGlvbikge1xuICAgICAgICAvLyBDbG9uZXMgbXVzdCBiZSBoaWRkZW4gYmVmb3JlIGZvbGRpbmcgYW5pbWF0aW9uIHRvIGNhcHR1cmUgZHJhZ1JlY3RBYnNvbHV0ZSBwcm9wZXJseVxuICAgICAgICBpZiAoaXNPd25lcikge1xuICAgICAgICAgIGFjdGl2ZVNvcnRhYmxlLl9oaWRlQ2xvbmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY3RpdmVTb3J0YWJsZS5fc2hvd0Nsb25lKF90aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX3RoaXMgIT09IGZyb21Tb3J0YWJsZSkge1xuICAgICAgICAgIC8vIFNldCBnaG9zdCBjbGFzcyB0byBuZXcgc29ydGFibGUncyBnaG9zdCBjbGFzc1xuICAgICAgICAgIHRvZ2dsZUNsYXNzKGRyYWdFbCwgcHV0U29ydGFibGUgPyBwdXRTb3J0YWJsZS5vcHRpb25zLmdob3N0Q2xhc3MgOiBhY3RpdmVTb3J0YWJsZS5vcHRpb25zLmdob3N0Q2xhc3MsIGZhbHNlKTtcbiAgICAgICAgICB0b2dnbGVDbGFzcyhkcmFnRWwsIG9wdGlvbnMuZ2hvc3RDbGFzcywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHB1dFNvcnRhYmxlICE9PSBfdGhpcyAmJiBfdGhpcyAhPT0gU29ydGFibGUuYWN0aXZlKSB7XG4gICAgICAgICAgcHV0U29ydGFibGUgPSBfdGhpcztcbiAgICAgICAgfSBlbHNlIGlmIChfdGhpcyA9PT0gU29ydGFibGUuYWN0aXZlICYmIHB1dFNvcnRhYmxlKSB7XG4gICAgICAgICAgcHV0U29ydGFibGUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQW5pbWF0aW9uXG4gICAgICAgIGlmIChmcm9tU29ydGFibGUgPT09IF90aGlzKSB7XG4gICAgICAgICAgX3RoaXMuX2lnbm9yZVdoaWxlQW5pbWF0aW5nID0gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIF90aGlzLmFuaW1hdGVBbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRyYWdPdmVyRXZlbnQoJ2RyYWdPdmVyQW5pbWF0aW9uQ29tcGxldGUnKTtcbiAgICAgICAgICBfdGhpcy5faWdub3JlV2hpbGVBbmltYXRpbmcgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKF90aGlzICE9PSBmcm9tU29ydGFibGUpIHtcbiAgICAgICAgICBmcm9tU29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgICAgICAgIGZyb21Tb3J0YWJsZS5faWdub3JlV2hpbGVBbmltYXRpbmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE51bGwgbGFzdFRhcmdldCBpZiBpdCBpcyBub3QgaW5zaWRlIGEgcHJldmlvdXNseSBzd2FwcGVkIGVsZW1lbnRcbiAgICAgIGlmICh0YXJnZXQgPT09IGRyYWdFbCAmJiAhZHJhZ0VsLmFuaW1hdGVkIHx8IHRhcmdldCA9PT0gZWwgJiYgIXRhcmdldC5hbmltYXRlZCkge1xuICAgICAgICBsYXN0VGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gbm8gYnViYmxpbmcgYW5kIG5vdCBmYWxsYmFja1xuICAgICAgaWYgKCFvcHRpb25zLmRyYWdvdmVyQnViYmxlICYmICFldnQucm9vdEVsICYmIHRhcmdldCAhPT0gZG9jdW1lbnQpIHtcbiAgICAgICAgZHJhZ0VsLnBhcmVudE5vZGVbZXhwYW5kb10uX2lzT3V0c2lkZVRoaXNFbChldnQudGFyZ2V0KTtcblxuICAgICAgICAvLyBEbyBub3QgZGV0ZWN0IGZvciBlbXB0eSBpbnNlcnQgaWYgYWxyZWFkeSBpbnNlcnRlZFxuICAgICAgICAhaW5zZXJ0aW9uICYmIG5lYXJlc3RFbXB0eUluc2VydERldGVjdEV2ZW50KGV2dCk7XG4gICAgICB9XG4gICAgICAhb3B0aW9ucy5kcmFnb3ZlckJ1YmJsZSAmJiBldnQuc3RvcFByb3BhZ2F0aW9uICYmIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHJldHVybiBjb21wbGV0ZWRGaXJlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gQ2FsbCB3aGVuIGRyYWdFbCBoYXMgYmVlbiBpbnNlcnRlZFxuICAgIGZ1bmN0aW9uIGNoYW5nZWQoKSB7XG4gICAgICBuZXdJbmRleCA9IGluZGV4KGRyYWdFbCk7XG4gICAgICBuZXdEcmFnZ2FibGVJbmRleCA9IGluZGV4KGRyYWdFbCwgb3B0aW9ucy5kcmFnZ2FibGUpO1xuICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICBzb3J0YWJsZTogX3RoaXMsXG4gICAgICAgIG5hbWU6ICdjaGFuZ2UnLFxuICAgICAgICB0b0VsOiBlbCxcbiAgICAgICAgbmV3SW5kZXg6IG5ld0luZGV4LFxuICAgICAgICBuZXdEcmFnZ2FibGVJbmRleDogbmV3RHJhZ2dhYmxlSW5kZXgsXG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChldnQucHJldmVudERlZmF1bHQgIT09IHZvaWQgMCkge1xuICAgICAgZXZ0LmNhbmNlbGFibGUgJiYgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIHRhcmdldCA9IGNsb3Nlc3QodGFyZ2V0LCBvcHRpb25zLmRyYWdnYWJsZSwgZWwsIHRydWUpO1xuICAgIGRyYWdPdmVyRXZlbnQoJ2RyYWdPdmVyJyk7XG4gICAgaWYgKFNvcnRhYmxlLmV2ZW50Q2FuY2VsZWQpIHJldHVybiBjb21wbGV0ZWRGaXJlZDtcbiAgICBpZiAoZHJhZ0VsLmNvbnRhaW5zKGV2dC50YXJnZXQpIHx8IHRhcmdldC5hbmltYXRlZCAmJiB0YXJnZXQuYW5pbWF0aW5nWCAmJiB0YXJnZXQuYW5pbWF0aW5nWSB8fCBfdGhpcy5faWdub3JlV2hpbGVBbmltYXRpbmcgPT09IHRhcmdldCkge1xuICAgICAgcmV0dXJuIGNvbXBsZXRlZChmYWxzZSk7XG4gICAgfVxuICAgIGlnbm9yZU5leHRDbGljayA9IGZhbHNlO1xuICAgIGlmIChhY3RpdmVTb3J0YWJsZSAmJiAhb3B0aW9ucy5kaXNhYmxlZCAmJiAoaXNPd25lciA/IGNhblNvcnQgfHwgKHJldmVydCA9IHBhcmVudEVsICE9PSByb290RWwpIC8vIFJldmVydGluZyBpdGVtIGludG8gdGhlIG9yaWdpbmFsIGxpc3RcbiAgICA6IHB1dFNvcnRhYmxlID09PSB0aGlzIHx8ICh0aGlzLmxhc3RQdXRNb2RlID0gYWN0aXZlR3JvdXAuY2hlY2tQdWxsKHRoaXMsIGFjdGl2ZVNvcnRhYmxlLCBkcmFnRWwsIGV2dCkpICYmIGdyb3VwLmNoZWNrUHV0KHRoaXMsIGFjdGl2ZVNvcnRhYmxlLCBkcmFnRWwsIGV2dCkpKSB7XG4gICAgICB2ZXJ0aWNhbCA9IHRoaXMuX2dldERpcmVjdGlvbihldnQsIHRhcmdldCkgPT09ICd2ZXJ0aWNhbCc7XG4gICAgICBkcmFnUmVjdCA9IGdldFJlY3QoZHJhZ0VsKTtcbiAgICAgIGRyYWdPdmVyRXZlbnQoJ2RyYWdPdmVyVmFsaWQnKTtcbiAgICAgIGlmIChTb3J0YWJsZS5ldmVudENhbmNlbGVkKSByZXR1cm4gY29tcGxldGVkRmlyZWQ7XG4gICAgICBpZiAocmV2ZXJ0KSB7XG4gICAgICAgIHBhcmVudEVsID0gcm9vdEVsOyAvLyBhY3R1YWxpemF0aW9uXG4gICAgICAgIGNhcHR1cmUoKTtcbiAgICAgICAgdGhpcy5faGlkZUNsb25lKCk7XG4gICAgICAgIGRyYWdPdmVyRXZlbnQoJ3JldmVydCcpO1xuICAgICAgICBpZiAoIVNvcnRhYmxlLmV2ZW50Q2FuY2VsZWQpIHtcbiAgICAgICAgICBpZiAobmV4dEVsKSB7XG4gICAgICAgICAgICByb290RWwuaW5zZXJ0QmVmb3JlKGRyYWdFbCwgbmV4dEVsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm9vdEVsLmFwcGVuZENoaWxkKGRyYWdFbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wbGV0ZWQodHJ1ZSk7XG4gICAgICB9XG4gICAgICB2YXIgZWxMYXN0Q2hpbGQgPSBsYXN0Q2hpbGQoZWwsIG9wdGlvbnMuZHJhZ2dhYmxlKTtcbiAgICAgIGlmICghZWxMYXN0Q2hpbGQgfHwgX2dob3N0SXNMYXN0KGV2dCwgdmVydGljYWwsIHRoaXMpICYmICFlbExhc3RDaGlsZC5hbmltYXRlZCkge1xuICAgICAgICAvLyBJbnNlcnQgdG8gZW5kIG9mIGxpc3RcblxuICAgICAgICAvLyBJZiBhbHJlYWR5IGF0IGVuZCBvZiBsaXN0OiBEbyBub3QgaW5zZXJ0XG4gICAgICAgIGlmIChlbExhc3RDaGlsZCA9PT0gZHJhZ0VsKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbXBsZXRlZChmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIGxhc3QgZWxlbWVudCwgaXQgaXMgdGhlIHRhcmdldFxuICAgICAgICBpZiAoZWxMYXN0Q2hpbGQgJiYgZWwgPT09IGV2dC50YXJnZXQpIHtcbiAgICAgICAgICB0YXJnZXQgPSBlbExhc3RDaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgdGFyZ2V0UmVjdCA9IGdldFJlY3QodGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX29uTW92ZShyb290RWwsIGVsLCBkcmFnRWwsIGRyYWdSZWN0LCB0YXJnZXQsIHRhcmdldFJlY3QsIGV2dCwgISF0YXJnZXQpICE9PSBmYWxzZSkge1xuICAgICAgICAgIGNhcHR1cmUoKTtcbiAgICAgICAgICBpZiAoZWxMYXN0Q2hpbGQgJiYgZWxMYXN0Q2hpbGQubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIC8vIHRoZSBsYXN0IGRyYWdnYWJsZSBlbGVtZW50IGlzIG5vdCB0aGUgbGFzdCBub2RlXG4gICAgICAgICAgICBlbC5pbnNlcnRCZWZvcmUoZHJhZ0VsLCBlbExhc3RDaGlsZC5uZXh0U2libGluZyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKGRyYWdFbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcmVudEVsID0gZWw7IC8vIGFjdHVhbGl6YXRpb25cblxuICAgICAgICAgIGNoYW5nZWQoKTtcbiAgICAgICAgICByZXR1cm4gY29tcGxldGVkKHRydWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGVsTGFzdENoaWxkICYmIF9naG9zdElzRmlyc3QoZXZ0LCB2ZXJ0aWNhbCwgdGhpcykpIHtcbiAgICAgICAgLy8gSW5zZXJ0IHRvIHN0YXJ0IG9mIGxpc3RcbiAgICAgICAgdmFyIGZpcnN0Q2hpbGQgPSBnZXRDaGlsZChlbCwgMCwgb3B0aW9ucywgdHJ1ZSk7XG4gICAgICAgIGlmIChmaXJzdENoaWxkID09PSBkcmFnRWwpIHtcbiAgICAgICAgICByZXR1cm4gY29tcGxldGVkKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXQgPSBmaXJzdENoaWxkO1xuICAgICAgICB0YXJnZXRSZWN0ID0gZ2V0UmVjdCh0YXJnZXQpO1xuICAgICAgICBpZiAoX29uTW92ZShyb290RWwsIGVsLCBkcmFnRWwsIGRyYWdSZWN0LCB0YXJnZXQsIHRhcmdldFJlY3QsIGV2dCwgZmFsc2UpICE9PSBmYWxzZSkge1xuICAgICAgICAgIGNhcHR1cmUoKTtcbiAgICAgICAgICBlbC5pbnNlcnRCZWZvcmUoZHJhZ0VsLCBmaXJzdENoaWxkKTtcbiAgICAgICAgICBwYXJlbnRFbCA9IGVsOyAvLyBhY3R1YWxpemF0aW9uXG5cbiAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgcmV0dXJuIGNvbXBsZXRlZCh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0YXJnZXQucGFyZW50Tm9kZSA9PT0gZWwpIHtcbiAgICAgICAgdGFyZ2V0UmVjdCA9IGdldFJlY3QodGFyZ2V0KTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IDAsXG4gICAgICAgICAgdGFyZ2V0QmVmb3JlRmlyc3RTd2FwLFxuICAgICAgICAgIGRpZmZlcmVudExldmVsID0gZHJhZ0VsLnBhcmVudE5vZGUgIT09IGVsLFxuICAgICAgICAgIGRpZmZlcmVudFJvd0NvbCA9ICFfZHJhZ0VsSW5Sb3dDb2x1bW4oZHJhZ0VsLmFuaW1hdGVkICYmIGRyYWdFbC50b1JlY3QgfHwgZHJhZ1JlY3QsIHRhcmdldC5hbmltYXRlZCAmJiB0YXJnZXQudG9SZWN0IHx8IHRhcmdldFJlY3QsIHZlcnRpY2FsKSxcbiAgICAgICAgICBzaWRlMSA9IHZlcnRpY2FsID8gJ3RvcCcgOiAnbGVmdCcsXG4gICAgICAgICAgc2Nyb2xsZWRQYXN0VG9wID0gaXNTY3JvbGxlZFBhc3QodGFyZ2V0LCAndG9wJywgJ3RvcCcpIHx8IGlzU2Nyb2xsZWRQYXN0KGRyYWdFbCwgJ3RvcCcsICd0b3AnKSxcbiAgICAgICAgICBzY3JvbGxCZWZvcmUgPSBzY3JvbGxlZFBhc3RUb3AgPyBzY3JvbGxlZFBhc3RUb3Auc2Nyb2xsVG9wIDogdm9pZCAwO1xuICAgICAgICBpZiAobGFzdFRhcmdldCAhPT0gdGFyZ2V0KSB7XG4gICAgICAgICAgdGFyZ2V0QmVmb3JlRmlyc3RTd2FwID0gdGFyZ2V0UmVjdFtzaWRlMV07XG4gICAgICAgICAgcGFzdEZpcnN0SW52ZXJ0VGhyZXNoID0gZmFsc2U7XG4gICAgICAgICAgaXNDaXJjdW1zdGFudGlhbEludmVydCA9ICFkaWZmZXJlbnRSb3dDb2wgJiYgb3B0aW9ucy5pbnZlcnRTd2FwIHx8IGRpZmZlcmVudExldmVsO1xuICAgICAgICB9XG4gICAgICAgIGRpcmVjdGlvbiA9IF9nZXRTd2FwRGlyZWN0aW9uKGV2dCwgdGFyZ2V0LCB0YXJnZXRSZWN0LCB2ZXJ0aWNhbCwgZGlmZmVyZW50Um93Q29sID8gMSA6IG9wdGlvbnMuc3dhcFRocmVzaG9sZCwgb3B0aW9ucy5pbnZlcnRlZFN3YXBUaHJlc2hvbGQgPT0gbnVsbCA/IG9wdGlvbnMuc3dhcFRocmVzaG9sZCA6IG9wdGlvbnMuaW52ZXJ0ZWRTd2FwVGhyZXNob2xkLCBpc0NpcmN1bXN0YW50aWFsSW52ZXJ0LCBsYXN0VGFyZ2V0ID09PSB0YXJnZXQpO1xuICAgICAgICB2YXIgc2libGluZztcbiAgICAgICAgaWYgKGRpcmVjdGlvbiAhPT0gMCkge1xuICAgICAgICAgIC8vIENoZWNrIGlmIHRhcmdldCBpcyBiZXNpZGUgZHJhZ0VsIGluIHJlc3BlY3RpdmUgZGlyZWN0aW9uIChpZ25vcmluZyBoaWRkZW4gZWxlbWVudHMpXG4gICAgICAgICAgdmFyIGRyYWdJbmRleCA9IGluZGV4KGRyYWdFbCk7XG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgZHJhZ0luZGV4IC09IGRpcmVjdGlvbjtcbiAgICAgICAgICAgIHNpYmxpbmcgPSBwYXJlbnRFbC5jaGlsZHJlbltkcmFnSW5kZXhdO1xuICAgICAgICAgIH0gd2hpbGUgKHNpYmxpbmcgJiYgKGNzcyhzaWJsaW5nLCAnZGlzcGxheScpID09PSAnbm9uZScgfHwgc2libGluZyA9PT0gZ2hvc3RFbCkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIGRyYWdFbCBpcyBhbHJlYWR5IGJlc2lkZSB0YXJnZXQ6IERvIG5vdCBpbnNlcnRcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gMCB8fCBzaWJsaW5nID09PSB0YXJnZXQpIHtcbiAgICAgICAgICByZXR1cm4gY29tcGxldGVkKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0VGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICBsYXN0RGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICB2YXIgbmV4dFNpYmxpbmcgPSB0YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLFxuICAgICAgICAgIGFmdGVyID0gZmFsc2U7XG4gICAgICAgIGFmdGVyID0gZGlyZWN0aW9uID09PSAxO1xuICAgICAgICB2YXIgbW92ZVZlY3RvciA9IF9vbk1vdmUocm9vdEVsLCBlbCwgZHJhZ0VsLCBkcmFnUmVjdCwgdGFyZ2V0LCB0YXJnZXRSZWN0LCBldnQsIGFmdGVyKTtcbiAgICAgICAgaWYgKG1vdmVWZWN0b3IgIT09IGZhbHNlKSB7XG4gICAgICAgICAgaWYgKG1vdmVWZWN0b3IgPT09IDEgfHwgbW92ZVZlY3RvciA9PT0gLTEpIHtcbiAgICAgICAgICAgIGFmdGVyID0gbW92ZVZlY3RvciA9PT0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgX3NpbGVudCA9IHRydWU7XG4gICAgICAgICAgc2V0VGltZW91dChfdW5zaWxlbnQsIDMwKTtcbiAgICAgICAgICBjYXB0dXJlKCk7XG4gICAgICAgICAgaWYgKGFmdGVyICYmICFuZXh0U2libGluZykge1xuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoZHJhZ0VsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRyYWdFbCwgYWZ0ZXIgPyBuZXh0U2libGluZyA6IHRhcmdldCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gVW5kbyBjaHJvbWUncyBzY3JvbGwgYWRqdXN0bWVudCAoaGFzIG5vIGVmZmVjdCBvbiBvdGhlciBicm93c2VycylcbiAgICAgICAgICBpZiAoc2Nyb2xsZWRQYXN0VG9wKSB7XG4gICAgICAgICAgICBzY3JvbGxCeShzY3JvbGxlZFBhc3RUb3AsIDAsIHNjcm9sbEJlZm9yZSAtIHNjcm9sbGVkUGFzdFRvcC5zY3JvbGxUb3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJlbnRFbCA9IGRyYWdFbC5wYXJlbnROb2RlOyAvLyBhY3R1YWxpemF0aW9uXG5cbiAgICAgICAgICAvLyBtdXN0IGJlIGRvbmUgYmVmb3JlIGFuaW1hdGlvblxuICAgICAgICAgIGlmICh0YXJnZXRCZWZvcmVGaXJzdFN3YXAgIT09IHVuZGVmaW5lZCAmJiAhaXNDaXJjdW1zdGFudGlhbEludmVydCkge1xuICAgICAgICAgICAgdGFyZ2V0TW92ZURpc3RhbmNlID0gTWF0aC5hYnModGFyZ2V0QmVmb3JlRmlyc3RTd2FwIC0gZ2V0UmVjdCh0YXJnZXQpW3NpZGUxXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNoYW5nZWQoKTtcbiAgICAgICAgICByZXR1cm4gY29tcGxldGVkKHRydWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZWwuY29udGFpbnMoZHJhZ0VsKSkge1xuICAgICAgICByZXR1cm4gY29tcGxldGVkKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBfaWdub3JlV2hpbGVBbmltYXRpbmc6IG51bGwsXG4gIF9vZmZNb3ZlRXZlbnRzOiBmdW5jdGlvbiBfb2ZmTW92ZUV2ZW50cygpIHtcbiAgICBvZmYoZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG4gICAgb2ZmKGRvY3VtZW50LCAndG91Y2htb3ZlJywgdGhpcy5fb25Ub3VjaE1vdmUpO1xuICAgIG9mZihkb2N1bWVudCwgJ3BvaW50ZXJtb3ZlJywgdGhpcy5fb25Ub3VjaE1vdmUpO1xuICAgIG9mZihkb2N1bWVudCwgJ2RyYWdvdmVyJywgbmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQpO1xuICAgIG9mZihkb2N1bWVudCwgJ21vdXNlbW92ZScsIG5lYXJlc3RFbXB0eUluc2VydERldGVjdEV2ZW50KTtcbiAgICBvZmYoZG9jdW1lbnQsICd0b3VjaG1vdmUnLCBuZWFyZXN0RW1wdHlJbnNlcnREZXRlY3RFdmVudCk7XG4gIH0sXG4gIF9vZmZVcEV2ZW50czogZnVuY3Rpb24gX29mZlVwRXZlbnRzKCkge1xuICAgIHZhciBvd25lckRvY3VtZW50ID0gdGhpcy5lbC5vd25lckRvY3VtZW50O1xuICAgIG9mZihvd25lckRvY3VtZW50LCAnbW91c2V1cCcsIHRoaXMuX29uRHJvcCk7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICd0b3VjaGVuZCcsIHRoaXMuX29uRHJvcCk7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICdwb2ludGVydXAnLCB0aGlzLl9vbkRyb3ApO1xuICAgIG9mZihvd25lckRvY3VtZW50LCAncG9pbnRlcmNhbmNlbCcsIHRoaXMuX29uRHJvcCk7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIHRoaXMuX29uRHJvcCk7XG4gICAgb2ZmKGRvY3VtZW50LCAnc2VsZWN0c3RhcnQnLCB0aGlzKTtcbiAgfSxcbiAgX29uRHJvcDogZnVuY3Rpb24gX29uRHJvcCggLyoqRXZlbnQqL2V2dCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWwsXG4gICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgLy8gR2V0IHRoZSBpbmRleCBvZiB0aGUgZHJhZ2dlZCBlbGVtZW50IHdpdGhpbiBpdHMgcGFyZW50XG4gICAgbmV3SW5kZXggPSBpbmRleChkcmFnRWwpO1xuICAgIG5ld0RyYWdnYWJsZUluZGV4ID0gaW5kZXgoZHJhZ0VsLCBvcHRpb25zLmRyYWdnYWJsZSk7XG4gICAgcGx1Z2luRXZlbnQoJ2Ryb3AnLCB0aGlzLCB7XG4gICAgICBldnQ6IGV2dFxuICAgIH0pO1xuICAgIHBhcmVudEVsID0gZHJhZ0VsICYmIGRyYWdFbC5wYXJlbnROb2RlO1xuXG4gICAgLy8gR2V0IGFnYWluIGFmdGVyIHBsdWdpbiBldmVudFxuICAgIG5ld0luZGV4ID0gaW5kZXgoZHJhZ0VsKTtcbiAgICBuZXdEcmFnZ2FibGVJbmRleCA9IGluZGV4KGRyYWdFbCwgb3B0aW9ucy5kcmFnZ2FibGUpO1xuICAgIGlmIChTb3J0YWJsZS5ldmVudENhbmNlbGVkKSB7XG4gICAgICB0aGlzLl9udWxsaW5nKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0aW5nRHJhZ1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICBpc0NpcmN1bXN0YW50aWFsSW52ZXJ0ID0gZmFsc2U7XG4gICAgcGFzdEZpcnN0SW52ZXJ0VGhyZXNoID0gZmFsc2U7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9sb29wSWQpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9kcmFnU3RhcnRUaW1lcik7XG4gICAgX2NhbmNlbE5leHRUaWNrKHRoaXMuY2xvbmVJZCk7XG4gICAgX2NhbmNlbE5leHRUaWNrKHRoaXMuX2RyYWdTdGFydElkKTtcblxuICAgIC8vIFVuYmluZCBldmVudHNcbiAgICBpZiAodGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAgIG9mZihkb2N1bWVudCwgJ2Ryb3AnLCB0aGlzKTtcbiAgICAgIG9mZihlbCwgJ2RyYWdzdGFydCcsIHRoaXMuX29uRHJhZ1N0YXJ0KTtcbiAgICB9XG4gICAgdGhpcy5fb2ZmTW92ZUV2ZW50cygpO1xuICAgIHRoaXMuX29mZlVwRXZlbnRzKCk7XG4gICAgaWYgKFNhZmFyaSkge1xuICAgICAgY3NzKGRvY3VtZW50LmJvZHksICd1c2VyLXNlbGVjdCcsICcnKTtcbiAgICB9XG4gICAgY3NzKGRyYWdFbCwgJ3RyYW5zZm9ybScsICcnKTtcbiAgICBpZiAoZXZ0KSB7XG4gICAgICBpZiAobW92ZWQpIHtcbiAgICAgICAgZXZ0LmNhbmNlbGFibGUgJiYgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICFvcHRpb25zLmRyb3BCdWJibGUgJiYgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgICAgZ2hvc3RFbCAmJiBnaG9zdEVsLnBhcmVudE5vZGUgJiYgZ2hvc3RFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGdob3N0RWwpO1xuICAgICAgaWYgKHJvb3RFbCA9PT0gcGFyZW50RWwgfHwgcHV0U29ydGFibGUgJiYgcHV0U29ydGFibGUubGFzdFB1dE1vZGUgIT09ICdjbG9uZScpIHtcbiAgICAgICAgLy8gUmVtb3ZlIGNsb25lKHMpXG4gICAgICAgIGNsb25lRWwgJiYgY2xvbmVFbC5wYXJlbnROb2RlICYmIGNsb25lRWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjbG9uZUVsKTtcbiAgICAgIH1cbiAgICAgIGlmIChkcmFnRWwpIHtcbiAgICAgICAgaWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgICAgICAgb2ZmKGRyYWdFbCwgJ2RyYWdlbmQnLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBfZGlzYWJsZURyYWdnYWJsZShkcmFnRWwpO1xuICAgICAgICBkcmFnRWwuc3R5bGVbJ3dpbGwtY2hhbmdlJ10gPSAnJztcblxuICAgICAgICAvLyBSZW1vdmUgY2xhc3Nlc1xuICAgICAgICAvLyBnaG9zdENsYXNzIGlzIGFkZGVkIGluIGRyYWdTdGFydGVkXG4gICAgICAgIGlmIChtb3ZlZCAmJiAhYXdhaXRpbmdEcmFnU3RhcnRlZCkge1xuICAgICAgICAgIHRvZ2dsZUNsYXNzKGRyYWdFbCwgcHV0U29ydGFibGUgPyBwdXRTb3J0YWJsZS5vcHRpb25zLmdob3N0Q2xhc3MgOiB0aGlzLm9wdGlvbnMuZ2hvc3RDbGFzcywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZUNsYXNzKGRyYWdFbCwgdGhpcy5vcHRpb25zLmNob3NlbkNsYXNzLCBmYWxzZSk7XG5cbiAgICAgICAgLy8gRHJhZyBzdG9wIGV2ZW50XG4gICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgICBuYW1lOiAndW5jaG9vc2UnLFxuICAgICAgICAgIHRvRWw6IHBhcmVudEVsLFxuICAgICAgICAgIG5ld0luZGV4OiBudWxsLFxuICAgICAgICAgIG5ld0RyYWdnYWJsZUluZGV4OiBudWxsLFxuICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJvb3RFbCAhPT0gcGFyZW50RWwpIHtcbiAgICAgICAgICBpZiAobmV3SW5kZXggPj0gMCkge1xuICAgICAgICAgICAgLy8gQWRkIGV2ZW50XG4gICAgICAgICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgICAgIHJvb3RFbDogcGFyZW50RWwsXG4gICAgICAgICAgICAgIG5hbWU6ICdhZGQnLFxuICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgZnJvbUVsOiByb290RWwsXG4gICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSBldmVudFxuICAgICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgICAgICAgbmFtZTogJ3JlbW92ZScsXG4gICAgICAgICAgICAgIHRvRWw6IHBhcmVudEVsLFxuICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBkcmFnIGZyb20gb25lIGxpc3QgYW5kIGRyb3AgaW50byBhbm90aGVyXG4gICAgICAgICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgICAgIHJvb3RFbDogcGFyZW50RWwsXG4gICAgICAgICAgICAgIG5hbWU6ICdzb3J0JyxcbiAgICAgICAgICAgICAgdG9FbDogcGFyZW50RWwsXG4gICAgICAgICAgICAgIGZyb21FbDogcm9vdEVsLFxuICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgICAgICAgbmFtZTogJ3NvcnQnLFxuICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcHV0U29ydGFibGUgJiYgcHV0U29ydGFibGUuc2F2ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChuZXdJbmRleCAhPT0gb2xkSW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChuZXdJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgIC8vIGRyYWcgJiBkcm9wIHdpdGhpbiB0aGUgc2FtZSBsaXN0XG4gICAgICAgICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgICAgICAgICBuYW1lOiAndXBkYXRlJyxcbiAgICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnc29ydCcsXG4gICAgICAgICAgICAgICAgdG9FbDogcGFyZW50RWwsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoU29ydGFibGUuYWN0aXZlKSB7XG4gICAgICAgICAgLyoganNoaW50IGVxbnVsbDp0cnVlICovXG4gICAgICAgICAgaWYgKG5ld0luZGV4ID09IG51bGwgfHwgbmV3SW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICBuZXdJbmRleCA9IG9sZEluZGV4O1xuICAgICAgICAgICAgbmV3RHJhZ2dhYmxlSW5kZXggPSBvbGREcmFnZ2FibGVJbmRleDtcbiAgICAgICAgICB9XG4gICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgc29ydGFibGU6IHRoaXMsXG4gICAgICAgICAgICBuYW1lOiAnZW5kJyxcbiAgICAgICAgICAgIHRvRWw6IHBhcmVudEVsLFxuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBTYXZlIHNvcnRpbmdcbiAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9udWxsaW5nKCk7XG4gIH0sXG4gIF9udWxsaW5nOiBmdW5jdGlvbiBfbnVsbGluZygpIHtcbiAgICBwbHVnaW5FdmVudCgnbnVsbGluZycsIHRoaXMpO1xuICAgIHJvb3RFbCA9IGRyYWdFbCA9IHBhcmVudEVsID0gZ2hvc3RFbCA9IG5leHRFbCA9IGNsb25lRWwgPSBsYXN0RG93bkVsID0gY2xvbmVIaWRkZW4gPSB0YXBFdnQgPSB0b3VjaEV2dCA9IG1vdmVkID0gbmV3SW5kZXggPSBuZXdEcmFnZ2FibGVJbmRleCA9IG9sZEluZGV4ID0gb2xkRHJhZ2dhYmxlSW5kZXggPSBsYXN0VGFyZ2V0ID0gbGFzdERpcmVjdGlvbiA9IHB1dFNvcnRhYmxlID0gYWN0aXZlR3JvdXAgPSBTb3J0YWJsZS5kcmFnZ2VkID0gU29ydGFibGUuZ2hvc3QgPSBTb3J0YWJsZS5jbG9uZSA9IFNvcnRhYmxlLmFjdGl2ZSA9IG51bGw7XG4gICAgdmFyIGVsID0gdGhpcy5lbDtcbiAgICBzYXZlZElucHV0Q2hlY2tlZC5mb3JFYWNoKGZ1bmN0aW9uIChjaGVja0VsKSB7XG4gICAgICBpZiAoZWwuY29udGFpbnMoY2hlY2tFbCkpIHtcbiAgICAgICAgY2hlY2tFbC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzYXZlZElucHV0Q2hlY2tlZC5sZW5ndGggPSBsYXN0RHggPSBsYXN0RHkgPSAwO1xuICB9LFxuICBoYW5kbGVFdmVudDogZnVuY3Rpb24gaGFuZGxlRXZlbnQoIC8qKkV2ZW50Ki9ldnQpIHtcbiAgICBzd2l0Y2ggKGV2dC50eXBlKSB7XG4gICAgICBjYXNlICdkcm9wJzpcbiAgICAgIGNhc2UgJ2RyYWdlbmQnOlxuICAgICAgICB0aGlzLl9vbkRyb3AoZXZ0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkcmFnZW50ZXInOlxuICAgICAgY2FzZSAnZHJhZ292ZXInOlxuICAgICAgICBpZiAoZHJhZ0VsKSB7XG4gICAgICAgICAgdGhpcy5fb25EcmFnT3ZlcihldnQpO1xuICAgICAgICAgIF9nbG9iYWxEcmFnT3ZlcihldnQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VsZWN0c3RhcnQnOlxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9LFxuICAvKipcclxuICAgKiBTZXJpYWxpemVzIHRoZSBpdGVtIGludG8gYW4gYXJyYXkgb2Ygc3RyaW5nLlxyXG4gICAqIEByZXR1cm5zIHtTdHJpbmdbXX1cclxuICAgKi9cbiAgdG9BcnJheTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICB2YXIgb3JkZXIgPSBbXSxcbiAgICAgIGVsLFxuICAgICAgY2hpbGRyZW4gPSB0aGlzLmVsLmNoaWxkcmVuLFxuICAgICAgaSA9IDAsXG4gICAgICBuID0gY2hpbGRyZW4ubGVuZ3RoLFxuICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICBmb3IgKDsgaSA8IG47IGkrKykge1xuICAgICAgZWwgPSBjaGlsZHJlbltpXTtcbiAgICAgIGlmIChjbG9zZXN0KGVsLCBvcHRpb25zLmRyYWdnYWJsZSwgdGhpcy5lbCwgZmFsc2UpKSB7XG4gICAgICAgIG9yZGVyLnB1c2goZWwuZ2V0QXR0cmlidXRlKG9wdGlvbnMuZGF0YUlkQXR0cikgfHwgX2dlbmVyYXRlSWQoZWwpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9yZGVyO1xuICB9LFxuICAvKipcclxuICAgKiBTb3J0cyB0aGUgZWxlbWVudHMgYWNjb3JkaW5nIHRvIHRoZSBhcnJheS5cclxuICAgKiBAcGFyYW0gIHtTdHJpbmdbXX0gIG9yZGVyICBvcmRlciBvZiB0aGUgaXRlbXNcclxuICAgKi9cbiAgc29ydDogZnVuY3Rpb24gc29ydChvcmRlciwgdXNlQW5pbWF0aW9uKSB7XG4gICAgdmFyIGl0ZW1zID0ge30sXG4gICAgICByb290RWwgPSB0aGlzLmVsO1xuICAgIHRoaXMudG9BcnJheSgpLmZvckVhY2goZnVuY3Rpb24gKGlkLCBpKSB7XG4gICAgICB2YXIgZWwgPSByb290RWwuY2hpbGRyZW5baV07XG4gICAgICBpZiAoY2xvc2VzdChlbCwgdGhpcy5vcHRpb25zLmRyYWdnYWJsZSwgcm9vdEVsLCBmYWxzZSkpIHtcbiAgICAgICAgaXRlbXNbaWRdID0gZWw7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgdXNlQW5pbWF0aW9uICYmIHRoaXMuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG4gICAgb3JkZXIuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGlmIChpdGVtc1tpZF0pIHtcbiAgICAgICAgcm9vdEVsLnJlbW92ZUNoaWxkKGl0ZW1zW2lkXSk7XG4gICAgICAgIHJvb3RFbC5hcHBlbmRDaGlsZChpdGVtc1tpZF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHVzZUFuaW1hdGlvbiAmJiB0aGlzLmFuaW1hdGVBbGwoKTtcbiAgfSxcbiAgLyoqXHJcbiAgICogU2F2ZSB0aGUgY3VycmVudCBzb3J0aW5nXHJcbiAgICovXG4gIHNhdmU6IGZ1bmN0aW9uIHNhdmUoKSB7XG4gICAgdmFyIHN0b3JlID0gdGhpcy5vcHRpb25zLnN0b3JlO1xuICAgIHN0b3JlICYmIHN0b3JlLnNldCAmJiBzdG9yZS5zZXQodGhpcyk7XG4gIH0sXG4gIC8qKlxyXG4gICAqIEZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIHNldCwgZ2V0IHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3IgYnkgdGVzdGluZyB0aGUgZWxlbWVudCBpdHNlbGYgYW5kIHRyYXZlcnNpbmcgdXAgdGhyb3VnaCBpdHMgYW5jZXN0b3JzIGluIHRoZSBET00gdHJlZS5cclxuICAgKiBAcGFyYW0gICB7SFRNTEVsZW1lbnR9ICBlbFxyXG4gICAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgICAgIFtzZWxlY3Rvcl0gIGRlZmF1bHQ6IGBvcHRpb25zLmRyYWdnYWJsZWBcclxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR8bnVsbH1cclxuICAgKi9cbiAgY2xvc2VzdDogZnVuY3Rpb24gY2xvc2VzdCQxKGVsLCBzZWxlY3Rvcikge1xuICAgIHJldHVybiBjbG9zZXN0KGVsLCBzZWxlY3RvciB8fCB0aGlzLm9wdGlvbnMuZHJhZ2dhYmxlLCB0aGlzLmVsLCBmYWxzZSk7XG4gIH0sXG4gIC8qKlxyXG4gICAqIFNldC9nZXQgb3B0aW9uXHJcbiAgICogQHBhcmFtICAge3N0cmluZ30gbmFtZVxyXG4gICAqIEBwYXJhbSAgIHsqfSAgICAgIFt2YWx1ZV1cclxuICAgKiBAcmV0dXJucyB7Kn1cclxuICAgKi9cbiAgb3B0aW9uOiBmdW5jdGlvbiBvcHRpb24obmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIG9wdGlvbnNbbmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBtb2RpZmllZFZhbHVlID0gUGx1Z2luTWFuYWdlci5tb2RpZnlPcHRpb24odGhpcywgbmFtZSwgdmFsdWUpO1xuICAgICAgaWYgKHR5cGVvZiBtb2RpZmllZFZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBvcHRpb25zW25hbWVdID0gbW9kaWZpZWRWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lID09PSAnZ3JvdXAnKSB7XG4gICAgICAgIF9wcmVwYXJlR3JvdXAob3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAvKipcclxuICAgKiBEZXN0cm95XHJcbiAgICovXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcGx1Z2luRXZlbnQoJ2Rlc3Ryb3knLCB0aGlzKTtcbiAgICB2YXIgZWwgPSB0aGlzLmVsO1xuICAgIGVsW2V4cGFuZG9dID0gbnVsbDtcbiAgICBvZmYoZWwsICdtb3VzZWRvd24nLCB0aGlzLl9vblRhcFN0YXJ0KTtcbiAgICBvZmYoZWwsICd0b3VjaHN0YXJ0JywgdGhpcy5fb25UYXBTdGFydCk7XG4gICAgb2ZmKGVsLCAncG9pbnRlcmRvd24nLCB0aGlzLl9vblRhcFN0YXJ0KTtcbiAgICBpZiAodGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAgIG9mZihlbCwgJ2RyYWdvdmVyJywgdGhpcyk7XG4gICAgICBvZmYoZWwsICdkcmFnZW50ZXInLCB0aGlzKTtcbiAgICB9XG4gICAgLy8gUmVtb3ZlIGRyYWdnYWJsZSBhdHRyaWJ1dGVzXG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChlbC5xdWVyeVNlbGVjdG9yQWxsKCdbZHJhZ2dhYmxlXScpLCBmdW5jdGlvbiAoZWwpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnZHJhZ2dhYmxlJyk7XG4gICAgfSk7XG4gICAgdGhpcy5fb25Ecm9wKCk7XG4gICAgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnRXZlbnRzKCk7XG4gICAgc29ydGFibGVzLnNwbGljZShzb3J0YWJsZXMuaW5kZXhPZih0aGlzLmVsKSwgMSk7XG4gICAgdGhpcy5lbCA9IGVsID0gbnVsbDtcbiAgfSxcbiAgX2hpZGVDbG9uZTogZnVuY3Rpb24gX2hpZGVDbG9uZSgpIHtcbiAgICBpZiAoIWNsb25lSGlkZGVuKSB7XG4gICAgICBwbHVnaW5FdmVudCgnaGlkZUNsb25lJywgdGhpcyk7XG4gICAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkgcmV0dXJuO1xuICAgICAgY3NzKGNsb25lRWwsICdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlQ2xvbmVPbkhpZGUgJiYgY2xvbmVFbC5wYXJlbnROb2RlKSB7XG4gICAgICAgIGNsb25lRWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjbG9uZUVsKTtcbiAgICAgIH1cbiAgICAgIGNsb25lSGlkZGVuID0gdHJ1ZTtcbiAgICB9XG4gIH0sXG4gIF9zaG93Q2xvbmU6IGZ1bmN0aW9uIF9zaG93Q2xvbmUocHV0U29ydGFibGUpIHtcbiAgICBpZiAocHV0U29ydGFibGUubGFzdFB1dE1vZGUgIT09ICdjbG9uZScpIHtcbiAgICAgIHRoaXMuX2hpZGVDbG9uZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY2xvbmVIaWRkZW4pIHtcbiAgICAgIHBsdWdpbkV2ZW50KCdzaG93Q2xvbmUnLCB0aGlzKTtcbiAgICAgIGlmIChTb3J0YWJsZS5ldmVudENhbmNlbGVkKSByZXR1cm47XG5cbiAgICAgIC8vIHNob3cgY2xvbmUgYXQgZHJhZ0VsIG9yIG9yaWdpbmFsIHBvc2l0aW9uXG4gICAgICBpZiAoZHJhZ0VsLnBhcmVudE5vZGUgPT0gcm9vdEVsICYmICF0aGlzLm9wdGlvbnMuZ3JvdXAucmV2ZXJ0Q2xvbmUpIHtcbiAgICAgICAgcm9vdEVsLmluc2VydEJlZm9yZShjbG9uZUVsLCBkcmFnRWwpO1xuICAgICAgfSBlbHNlIGlmIChuZXh0RWwpIHtcbiAgICAgICAgcm9vdEVsLmluc2VydEJlZm9yZShjbG9uZUVsLCBuZXh0RWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdEVsLmFwcGVuZENoaWxkKGNsb25lRWwpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5ncm91cC5yZXZlcnRDbG9uZSkge1xuICAgICAgICB0aGlzLmFuaW1hdGUoZHJhZ0VsLCBjbG9uZUVsKTtcbiAgICAgIH1cbiAgICAgIGNzcyhjbG9uZUVsLCAnZGlzcGxheScsICcnKTtcbiAgICAgIGNsb25lSGlkZGVuID0gZmFsc2U7XG4gICAgfVxuICB9XG59O1xuZnVuY3Rpb24gX2dsb2JhbERyYWdPdmVyKCAvKipFdmVudCovZXZ0KSB7XG4gIGlmIChldnQuZGF0YVRyYW5zZmVyKSB7XG4gICAgZXZ0LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xuICB9XG4gIGV2dC5jYW5jZWxhYmxlICYmIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xufVxuZnVuY3Rpb24gX29uTW92ZShmcm9tRWwsIHRvRWwsIGRyYWdFbCwgZHJhZ1JlY3QsIHRhcmdldEVsLCB0YXJnZXRSZWN0LCBvcmlnaW5hbEV2ZW50LCB3aWxsSW5zZXJ0QWZ0ZXIpIHtcbiAgdmFyIGV2dCxcbiAgICBzb3J0YWJsZSA9IGZyb21FbFtleHBhbmRvXSxcbiAgICBvbk1vdmVGbiA9IHNvcnRhYmxlLm9wdGlvbnMub25Nb3ZlLFxuICAgIHJldFZhbDtcbiAgLy8gU3VwcG9ydCBmb3IgbmV3IEN1c3RvbUV2ZW50IGZlYXR1cmVcbiAgaWYgKHdpbmRvdy5DdXN0b21FdmVudCAmJiAhSUUxMU9yTGVzcyAmJiAhRWRnZSkge1xuICAgIGV2dCA9IG5ldyBDdXN0b21FdmVudCgnbW92ZScsIHtcbiAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgZXZ0LmluaXRFdmVudCgnbW92ZScsIHRydWUsIHRydWUpO1xuICB9XG4gIGV2dC50byA9IHRvRWw7XG4gIGV2dC5mcm9tID0gZnJvbUVsO1xuICBldnQuZHJhZ2dlZCA9IGRyYWdFbDtcbiAgZXZ0LmRyYWdnZWRSZWN0ID0gZHJhZ1JlY3Q7XG4gIGV2dC5yZWxhdGVkID0gdGFyZ2V0RWwgfHwgdG9FbDtcbiAgZXZ0LnJlbGF0ZWRSZWN0ID0gdGFyZ2V0UmVjdCB8fCBnZXRSZWN0KHRvRWwpO1xuICBldnQud2lsbEluc2VydEFmdGVyID0gd2lsbEluc2VydEFmdGVyO1xuICBldnQub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XG4gIGZyb21FbC5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gIGlmIChvbk1vdmVGbikge1xuICAgIHJldFZhbCA9IG9uTW92ZUZuLmNhbGwoc29ydGFibGUsIGV2dCwgb3JpZ2luYWxFdmVudCk7XG4gIH1cbiAgcmV0dXJuIHJldFZhbDtcbn1cbmZ1bmN0aW9uIF9kaXNhYmxlRHJhZ2dhYmxlKGVsKSB7XG4gIGVsLmRyYWdnYWJsZSA9IGZhbHNlO1xufVxuZnVuY3Rpb24gX3Vuc2lsZW50KCkge1xuICBfc2lsZW50ID0gZmFsc2U7XG59XG5mdW5jdGlvbiBfZ2hvc3RJc0ZpcnN0KGV2dCwgdmVydGljYWwsIHNvcnRhYmxlKSB7XG4gIHZhciBmaXJzdEVsUmVjdCA9IGdldFJlY3QoZ2V0Q2hpbGQoc29ydGFibGUuZWwsIDAsIHNvcnRhYmxlLm9wdGlvbnMsIHRydWUpKTtcbiAgdmFyIGNoaWxkQ29udGFpbmluZ1JlY3QgPSBnZXRDaGlsZENvbnRhaW5pbmdSZWN0RnJvbUVsZW1lbnQoc29ydGFibGUuZWwsIHNvcnRhYmxlLm9wdGlvbnMsIGdob3N0RWwpO1xuICB2YXIgc3BhY2VyID0gMTA7XG4gIHJldHVybiB2ZXJ0aWNhbCA/IGV2dC5jbGllbnRYIDwgY2hpbGRDb250YWluaW5nUmVjdC5sZWZ0IC0gc3BhY2VyIHx8IGV2dC5jbGllbnRZIDwgZmlyc3RFbFJlY3QudG9wICYmIGV2dC5jbGllbnRYIDwgZmlyc3RFbFJlY3QucmlnaHQgOiBldnQuY2xpZW50WSA8IGNoaWxkQ29udGFpbmluZ1JlY3QudG9wIC0gc3BhY2VyIHx8IGV2dC5jbGllbnRZIDwgZmlyc3RFbFJlY3QuYm90dG9tICYmIGV2dC5jbGllbnRYIDwgZmlyc3RFbFJlY3QubGVmdDtcbn1cbmZ1bmN0aW9uIF9naG9zdElzTGFzdChldnQsIHZlcnRpY2FsLCBzb3J0YWJsZSkge1xuICB2YXIgbGFzdEVsUmVjdCA9IGdldFJlY3QobGFzdENoaWxkKHNvcnRhYmxlLmVsLCBzb3J0YWJsZS5vcHRpb25zLmRyYWdnYWJsZSkpO1xuICB2YXIgY2hpbGRDb250YWluaW5nUmVjdCA9IGdldENoaWxkQ29udGFpbmluZ1JlY3RGcm9tRWxlbWVudChzb3J0YWJsZS5lbCwgc29ydGFibGUub3B0aW9ucywgZ2hvc3RFbCk7XG4gIHZhciBzcGFjZXIgPSAxMDtcbiAgcmV0dXJuIHZlcnRpY2FsID8gZXZ0LmNsaWVudFggPiBjaGlsZENvbnRhaW5pbmdSZWN0LnJpZ2h0ICsgc3BhY2VyIHx8IGV2dC5jbGllbnRZID4gbGFzdEVsUmVjdC5ib3R0b20gJiYgZXZ0LmNsaWVudFggPiBsYXN0RWxSZWN0LmxlZnQgOiBldnQuY2xpZW50WSA+IGNoaWxkQ29udGFpbmluZ1JlY3QuYm90dG9tICsgc3BhY2VyIHx8IGV2dC5jbGllbnRYID4gbGFzdEVsUmVjdC5yaWdodCAmJiBldnQuY2xpZW50WSA+IGxhc3RFbFJlY3QudG9wO1xufVxuZnVuY3Rpb24gX2dldFN3YXBEaXJlY3Rpb24oZXZ0LCB0YXJnZXQsIHRhcmdldFJlY3QsIHZlcnRpY2FsLCBzd2FwVGhyZXNob2xkLCBpbnZlcnRlZFN3YXBUaHJlc2hvbGQsIGludmVydFN3YXAsIGlzTGFzdFRhcmdldCkge1xuICB2YXIgbW91c2VPbkF4aXMgPSB2ZXJ0aWNhbCA/IGV2dC5jbGllbnRZIDogZXZ0LmNsaWVudFgsXG4gICAgdGFyZ2V0TGVuZ3RoID0gdmVydGljYWwgPyB0YXJnZXRSZWN0LmhlaWdodCA6IHRhcmdldFJlY3Qud2lkdGgsXG4gICAgdGFyZ2V0UzEgPSB2ZXJ0aWNhbCA/IHRhcmdldFJlY3QudG9wIDogdGFyZ2V0UmVjdC5sZWZ0LFxuICAgIHRhcmdldFMyID0gdmVydGljYWwgPyB0YXJnZXRSZWN0LmJvdHRvbSA6IHRhcmdldFJlY3QucmlnaHQsXG4gICAgaW52ZXJ0ID0gZmFsc2U7XG4gIGlmICghaW52ZXJ0U3dhcCkge1xuICAgIC8vIE5ldmVyIGludmVydCBvciBjcmVhdGUgZHJhZ0VsIHNoYWRvdyB3aGVuIHRhcmdldCBtb3ZlbWVuZXQgY2F1c2VzIG1vdXNlIHRvIG1vdmUgcGFzdCB0aGUgZW5kIG9mIHJlZ3VsYXIgc3dhcFRocmVzaG9sZFxuICAgIGlmIChpc0xhc3RUYXJnZXQgJiYgdGFyZ2V0TW92ZURpc3RhbmNlIDwgdGFyZ2V0TGVuZ3RoICogc3dhcFRocmVzaG9sZCkge1xuICAgICAgLy8gbXVsdGlwbGllZCBvbmx5IGJ5IHN3YXBUaHJlc2hvbGQgYmVjYXVzZSBtb3VzZSB3aWxsIGFscmVhZHkgYmUgaW5zaWRlIHRhcmdldCBieSAoMSAtIHRocmVzaG9sZCkgKiB0YXJnZXRMZW5ndGggLyAyXG4gICAgICAvLyBjaGVjayBpZiBwYXN0IGZpcnN0IGludmVydCB0aHJlc2hvbGQgb24gc2lkZSBvcHBvc2l0ZSBvZiBsYXN0RGlyZWN0aW9uXG4gICAgICBpZiAoIXBhc3RGaXJzdEludmVydFRocmVzaCAmJiAobGFzdERpcmVjdGlvbiA9PT0gMSA/IG1vdXNlT25BeGlzID4gdGFyZ2V0UzEgKyB0YXJnZXRMZW5ndGggKiBpbnZlcnRlZFN3YXBUaHJlc2hvbGQgLyAyIDogbW91c2VPbkF4aXMgPCB0YXJnZXRTMiAtIHRhcmdldExlbmd0aCAqIGludmVydGVkU3dhcFRocmVzaG9sZCAvIDIpKSB7XG4gICAgICAgIC8vIHBhc3QgZmlyc3QgaW52ZXJ0IHRocmVzaG9sZCwgZG8gbm90IHJlc3RyaWN0IGludmVydGVkIHRocmVzaG9sZCB0byBkcmFnRWwgc2hhZG93XG4gICAgICAgIHBhc3RGaXJzdEludmVydFRocmVzaCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoIXBhc3RGaXJzdEludmVydFRocmVzaCkge1xuICAgICAgICAvLyBkcmFnRWwgc2hhZG93ICh0YXJnZXQgbW92ZSBkaXN0YW5jZSBzaGFkb3cpXG4gICAgICAgIGlmIChsYXN0RGlyZWN0aW9uID09PSAxID8gbW91c2VPbkF4aXMgPCB0YXJnZXRTMSArIHRhcmdldE1vdmVEaXN0YW5jZSAvLyBvdmVyIGRyYWdFbCBzaGFkb3dcbiAgICAgICAgOiBtb3VzZU9uQXhpcyA+IHRhcmdldFMyIC0gdGFyZ2V0TW92ZURpc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIC1sYXN0RGlyZWN0aW9uO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnZlcnQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZWd1bGFyXG4gICAgICBpZiAobW91c2VPbkF4aXMgPiB0YXJnZXRTMSArIHRhcmdldExlbmd0aCAqICgxIC0gc3dhcFRocmVzaG9sZCkgLyAyICYmIG1vdXNlT25BeGlzIDwgdGFyZ2V0UzIgLSB0YXJnZXRMZW5ndGggKiAoMSAtIHN3YXBUaHJlc2hvbGQpIC8gMikge1xuICAgICAgICByZXR1cm4gX2dldEluc2VydERpcmVjdGlvbih0YXJnZXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpbnZlcnQgPSBpbnZlcnQgfHwgaW52ZXJ0U3dhcDtcbiAgaWYgKGludmVydCkge1xuICAgIC8vIEludmVydCBvZiByZWd1bGFyXG4gICAgaWYgKG1vdXNlT25BeGlzIDwgdGFyZ2V0UzEgKyB0YXJnZXRMZW5ndGggKiBpbnZlcnRlZFN3YXBUaHJlc2hvbGQgLyAyIHx8IG1vdXNlT25BeGlzID4gdGFyZ2V0UzIgLSB0YXJnZXRMZW5ndGggKiBpbnZlcnRlZFN3YXBUaHJlc2hvbGQgLyAyKSB7XG4gICAgICByZXR1cm4gbW91c2VPbkF4aXMgPiB0YXJnZXRTMSArIHRhcmdldExlbmd0aCAvIDIgPyAxIDogLTE7XG4gICAgfVxuICB9XG4gIHJldHVybiAwO1xufVxuXG4vKipcclxuICogR2V0cyB0aGUgZGlyZWN0aW9uIGRyYWdFbCBtdXN0IGJlIHN3YXBwZWQgcmVsYXRpdmUgdG8gdGFyZ2V0IGluIG9yZGVyIHRvIG1ha2UgaXRcclxuICogc2VlbSB0aGF0IGRyYWdFbCBoYXMgYmVlbiBcImluc2VydGVkXCIgaW50byB0aGF0IGVsZW1lbnQncyBwb3NpdGlvblxyXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gdGFyZ2V0ICAgICAgIFRoZSB0YXJnZXQgd2hvc2UgcG9zaXRpb24gZHJhZ0VsIGlzIGJlaW5nIGluc2VydGVkIGF0XHJcbiAqIEByZXR1cm4ge051bWJlcn0gICAgICAgICAgICAgICAgICAgRGlyZWN0aW9uIGRyYWdFbCBtdXN0IGJlIHN3YXBwZWRcclxuICovXG5mdW5jdGlvbiBfZ2V0SW5zZXJ0RGlyZWN0aW9uKHRhcmdldCkge1xuICBpZiAoaW5kZXgoZHJhZ0VsKSA8IGluZGV4KHRhcmdldCkpIHtcbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbn1cblxuLyoqXHJcbiAqIEdlbmVyYXRlIGlkXHJcbiAqIEBwYXJhbSAgIHtIVE1MRWxlbWVudH0gZWxcclxuICogQHJldHVybnMge1N0cmluZ31cclxuICogQHByaXZhdGVcclxuICovXG5mdW5jdGlvbiBfZ2VuZXJhdGVJZChlbCkge1xuICB2YXIgc3RyID0gZWwudGFnTmFtZSArIGVsLmNsYXNzTmFtZSArIGVsLnNyYyArIGVsLmhyZWYgKyBlbC50ZXh0Q29udGVudCxcbiAgICBpID0gc3RyLmxlbmd0aCxcbiAgICBzdW0gPSAwO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgc3VtICs9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICB9XG4gIHJldHVybiBzdW0udG9TdHJpbmcoMzYpO1xufVxuZnVuY3Rpb24gX3NhdmVJbnB1dENoZWNrZWRTdGF0ZShyb290KSB7XG4gIHNhdmVkSW5wdXRDaGVja2VkLmxlbmd0aCA9IDA7XG4gIHZhciBpbnB1dHMgPSByb290LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpO1xuICB2YXIgaWR4ID0gaW5wdXRzLmxlbmd0aDtcbiAgd2hpbGUgKGlkeC0tKSB7XG4gICAgdmFyIGVsID0gaW5wdXRzW2lkeF07XG4gICAgZWwuY2hlY2tlZCAmJiBzYXZlZElucHV0Q2hlY2tlZC5wdXNoKGVsKTtcbiAgfVxufVxuZnVuY3Rpb24gX25leHRUaWNrKGZuKSB7XG4gIHJldHVybiBzZXRUaW1lb3V0KGZuLCAwKTtcbn1cbmZ1bmN0aW9uIF9jYW5jZWxOZXh0VGljayhpZCkge1xuICByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTtcbn1cblxuLy8gRml4ZWQgIzk3MzpcbmlmIChkb2N1bWVudEV4aXN0cykge1xuICBvbihkb2N1bWVudCwgJ3RvdWNobW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoKFNvcnRhYmxlLmFjdGl2ZSB8fCBhd2FpdGluZ0RyYWdTdGFydGVkKSAmJiBldnQuY2FuY2VsYWJsZSkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gRXhwb3J0IHV0aWxzXG5Tb3J0YWJsZS51dGlscyA9IHtcbiAgb246IG9uLFxuICBvZmY6IG9mZixcbiAgY3NzOiBjc3MsXG4gIGZpbmQ6IGZpbmQsXG4gIGlzOiBmdW5jdGlvbiBpcyhlbCwgc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gISFjbG9zZXN0KGVsLCBzZWxlY3RvciwgZWwsIGZhbHNlKTtcbiAgfSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRocm90dGxlOiB0aHJvdHRsZSxcbiAgY2xvc2VzdDogY2xvc2VzdCxcbiAgdG9nZ2xlQ2xhc3M6IHRvZ2dsZUNsYXNzLFxuICBjbG9uZTogY2xvbmUsXG4gIGluZGV4OiBpbmRleCxcbiAgbmV4dFRpY2s6IF9uZXh0VGljayxcbiAgY2FuY2VsTmV4dFRpY2s6IF9jYW5jZWxOZXh0VGljayxcbiAgZGV0ZWN0RGlyZWN0aW9uOiBfZGV0ZWN0RGlyZWN0aW9uLFxuICBnZXRDaGlsZDogZ2V0Q2hpbGQsXG4gIGV4cGFuZG86IGV4cGFuZG9cbn07XG5cbi8qKlxyXG4gKiBHZXQgdGhlIFNvcnRhYmxlIGluc3RhbmNlIG9mIGFuIGVsZW1lbnRcclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnRcclxuICogQHJldHVybiB7U29ydGFibGV8dW5kZWZpbmVkfSAgICAgICAgIFRoZSBpbnN0YW5jZSBvZiBTb3J0YWJsZVxyXG4gKi9cblNvcnRhYmxlLmdldCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50W2V4cGFuZG9dO1xufTtcblxuLyoqXHJcbiAqIE1vdW50IGEgcGx1Z2luIHRvIFNvcnRhYmxlXHJcbiAqIEBwYXJhbSAgey4uLlNvcnRhYmxlUGx1Z2lufFNvcnRhYmxlUGx1Z2luW119IHBsdWdpbnMgICAgICAgUGx1Z2lucyBiZWluZyBtb3VudGVkXHJcbiAqL1xuU29ydGFibGUubW91bnQgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBwbHVnaW5zID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIHBsdWdpbnNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cbiAgaWYgKHBsdWdpbnNbMF0uY29uc3RydWN0b3IgPT09IEFycmF5KSBwbHVnaW5zID0gcGx1Z2luc1swXTtcbiAgcGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICBpZiAoIXBsdWdpbi5wcm90b3R5cGUgfHwgIXBsdWdpbi5wcm90b3R5cGUuY29uc3RydWN0b3IpIHtcbiAgICAgIHRocm93IFwiU29ydGFibGU6IE1vdW50ZWQgcGx1Z2luIG11c3QgYmUgYSBjb25zdHJ1Y3RvciBmdW5jdGlvbiwgbm90IFwiLmNvbmNhdCh7fS50b1N0cmluZy5jYWxsKHBsdWdpbikpO1xuICAgIH1cbiAgICBpZiAocGx1Z2luLnV0aWxzKSBTb3J0YWJsZS51dGlscyA9IF9vYmplY3RTcHJlYWQyKF9vYmplY3RTcHJlYWQyKHt9LCBTb3J0YWJsZS51dGlscyksIHBsdWdpbi51dGlscyk7XG4gICAgUGx1Z2luTWFuYWdlci5tb3VudChwbHVnaW4pO1xuICB9KTtcbn07XG5cbi8qKlxyXG4gKiBDcmVhdGUgc29ydGFibGUgaW5zdGFuY2VcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gIGVsXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgIFtvcHRpb25zXVxyXG4gKi9cblNvcnRhYmxlLmNyZWF0ZSA9IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuICByZXR1cm4gbmV3IFNvcnRhYmxlKGVsLCBvcHRpb25zKTtcbn07XG5cbi8vIEV4cG9ydFxuU29ydGFibGUudmVyc2lvbiA9IHZlcnNpb247XG5cbnZhciBhdXRvU2Nyb2xscyA9IFtdLFxuICBzY3JvbGxFbCxcbiAgc2Nyb2xsUm9vdEVsLFxuICBzY3JvbGxpbmcgPSBmYWxzZSxcbiAgbGFzdEF1dG9TY3JvbGxYLFxuICBsYXN0QXV0b1Njcm9sbFksXG4gIHRvdWNoRXZ0JDEsXG4gIHBvaW50ZXJFbGVtQ2hhbmdlZEludGVydmFsO1xuZnVuY3Rpb24gQXV0b1Njcm9sbFBsdWdpbigpIHtcbiAgZnVuY3Rpb24gQXV0b1Njcm9sbCgpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgc2Nyb2xsOiB0cnVlLFxuICAgICAgZm9yY2VBdXRvU2Nyb2xsRmFsbGJhY2s6IGZhbHNlLFxuICAgICAgc2Nyb2xsU2Vuc2l0aXZpdHk6IDMwLFxuICAgICAgc2Nyb2xsU3BlZWQ6IDEwLFxuICAgICAgYnViYmxlU2Nyb2xsOiB0cnVlXG4gICAgfTtcblxuICAgIC8vIEJpbmQgYWxsIHByaXZhdGUgbWV0aG9kc1xuICAgIGZvciAodmFyIGZuIGluIHRoaXMpIHtcbiAgICAgIGlmIChmbi5jaGFyQXQoMCkgPT09ICdfJyAmJiB0eXBlb2YgdGhpc1tmbl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpc1tmbl0gPSB0aGlzW2ZuXS5iaW5kKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBBdXRvU2Nyb2xsLnByb3RvdHlwZSA9IHtcbiAgICBkcmFnU3RhcnRlZDogZnVuY3Rpb24gZHJhZ1N0YXJ0ZWQoX3JlZikge1xuICAgICAgdmFyIG9yaWdpbmFsRXZlbnQgPSBfcmVmLm9yaWdpbmFsRXZlbnQ7XG4gICAgICBpZiAodGhpcy5zb3J0YWJsZS5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAgICAgb24oZG9jdW1lbnQsICdkcmFnb3ZlcicsIHRoaXMuX2hhbmRsZUF1dG9TY3JvbGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdXBwb3J0UG9pbnRlcikge1xuICAgICAgICAgIG9uKGRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9oYW5kbGVGYWxsYmFja0F1dG9TY3JvbGwpO1xuICAgICAgICB9IGVsc2UgaWYgKG9yaWdpbmFsRXZlbnQudG91Y2hlcykge1xuICAgICAgICAgIG9uKGRvY3VtZW50LCAndG91Y2htb3ZlJywgdGhpcy5faGFuZGxlRmFsbGJhY2tBdXRvU2Nyb2xsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvbihkb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMuX2hhbmRsZUZhbGxiYWNrQXV0b1Njcm9sbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGRyYWdPdmVyQ29tcGxldGVkOiBmdW5jdGlvbiBkcmFnT3ZlckNvbXBsZXRlZChfcmVmMikge1xuICAgICAgdmFyIG9yaWdpbmFsRXZlbnQgPSBfcmVmMi5vcmlnaW5hbEV2ZW50O1xuICAgICAgLy8gRm9yIHdoZW4gYnViYmxpbmcgaXMgY2FuY2VsZWQgYW5kIHVzaW5nIGZhbGxiYWNrIChmYWxsYmFjayAndG91Y2htb3ZlJyBhbHdheXMgcmVhY2hlZClcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmRyYWdPdmVyQnViYmxlICYmICFvcmlnaW5hbEV2ZW50LnJvb3RFbCkge1xuICAgICAgICB0aGlzLl9oYW5kbGVBdXRvU2Nyb2xsKG9yaWdpbmFsRXZlbnQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZHJvcDogZnVuY3Rpb24gZHJvcCgpIHtcbiAgICAgIGlmICh0aGlzLnNvcnRhYmxlLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgICAgICBvZmYoZG9jdW1lbnQsICdkcmFnb3ZlcicsIHRoaXMuX2hhbmRsZUF1dG9TY3JvbGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2ZmKGRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9oYW5kbGVGYWxsYmFja0F1dG9TY3JvbGwpO1xuICAgICAgICBvZmYoZG9jdW1lbnQsICd0b3VjaG1vdmUnLCB0aGlzLl9oYW5kbGVGYWxsYmFja0F1dG9TY3JvbGwpO1xuICAgICAgICBvZmYoZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLl9oYW5kbGVGYWxsYmFja0F1dG9TY3JvbGwpO1xuICAgICAgfVxuICAgICAgY2xlYXJQb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbCgpO1xuICAgICAgY2xlYXJBdXRvU2Nyb2xscygpO1xuICAgICAgY2FuY2VsVGhyb3R0bGUoKTtcbiAgICB9LFxuICAgIG51bGxpbmc6IGZ1bmN0aW9uIG51bGxpbmcoKSB7XG4gICAgICB0b3VjaEV2dCQxID0gc2Nyb2xsUm9vdEVsID0gc2Nyb2xsRWwgPSBzY3JvbGxpbmcgPSBwb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbCA9IGxhc3RBdXRvU2Nyb2xsWCA9IGxhc3RBdXRvU2Nyb2xsWSA9IG51bGw7XG4gICAgICBhdXRvU2Nyb2xscy5sZW5ndGggPSAwO1xuICAgIH0sXG4gICAgX2hhbmRsZUZhbGxiYWNrQXV0b1Njcm9sbDogZnVuY3Rpb24gX2hhbmRsZUZhbGxiYWNrQXV0b1Njcm9sbChldnQpIHtcbiAgICAgIHRoaXMuX2hhbmRsZUF1dG9TY3JvbGwoZXZ0LCB0cnVlKTtcbiAgICB9LFxuICAgIF9oYW5kbGVBdXRvU2Nyb2xsOiBmdW5jdGlvbiBfaGFuZGxlQXV0b1Njcm9sbChldnQsIGZhbGxiYWNrKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgdmFyIHggPSAoZXZ0LnRvdWNoZXMgPyBldnQudG91Y2hlc1swXSA6IGV2dCkuY2xpZW50WCxcbiAgICAgICAgeSA9IChldnQudG91Y2hlcyA/IGV2dC50b3VjaGVzWzBdIDogZXZ0KS5jbGllbnRZLFxuICAgICAgICBlbGVtID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgICAgIHRvdWNoRXZ0JDEgPSBldnQ7XG5cbiAgICAgIC8vIElFIGRvZXMgbm90IHNlZW0gdG8gaGF2ZSBuYXRpdmUgYXV0b3Njcm9sbCxcbiAgICAgIC8vIEVkZ2UncyBhdXRvc2Nyb2xsIHNlZW1zIHRvbyBjb25kaXRpb25hbCxcbiAgICAgIC8vIE1BQ09TIFNhZmFyaSBkb2VzIG5vdCBoYXZlIGF1dG9zY3JvbGwsXG4gICAgICAvLyBGaXJlZm94IGFuZCBDaHJvbWUgYXJlIGdvb2RcbiAgICAgIGlmIChmYWxsYmFjayB8fCB0aGlzLm9wdGlvbnMuZm9yY2VBdXRvU2Nyb2xsRmFsbGJhY2sgfHwgRWRnZSB8fCBJRTExT3JMZXNzIHx8IFNhZmFyaSkge1xuICAgICAgICBhdXRvU2Nyb2xsKGV2dCwgdGhpcy5vcHRpb25zLCBlbGVtLCBmYWxsYmFjayk7XG5cbiAgICAgICAgLy8gTGlzdGVuZXIgZm9yIHBvaW50ZXIgZWxlbWVudCBjaGFuZ2VcbiAgICAgICAgdmFyIG9nRWxlbVNjcm9sbGVyID0gZ2V0UGFyZW50QXV0b1Njcm9sbEVsZW1lbnQoZWxlbSwgdHJ1ZSk7XG4gICAgICAgIGlmIChzY3JvbGxpbmcgJiYgKCFwb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbCB8fCB4ICE9PSBsYXN0QXV0b1Njcm9sbFggfHwgeSAhPT0gbGFzdEF1dG9TY3JvbGxZKSkge1xuICAgICAgICAgIHBvaW50ZXJFbGVtQ2hhbmdlZEludGVydmFsICYmIGNsZWFyUG9pbnRlckVsZW1DaGFuZ2VkSW50ZXJ2YWwoKTtcbiAgICAgICAgICAvLyBEZXRlY3QgZm9yIHBvaW50ZXIgZWxlbSBjaGFuZ2UsIGVtdWxhdGluZyBuYXRpdmUgRG5EIGJlaGF2aW91clxuICAgICAgICAgIHBvaW50ZXJFbGVtQ2hhbmdlZEludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5ld0VsZW0gPSBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHgsIHkpLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChuZXdFbGVtICE9PSBvZ0VsZW1TY3JvbGxlcikge1xuICAgICAgICAgICAgICBvZ0VsZW1TY3JvbGxlciA9IG5ld0VsZW07XG4gICAgICAgICAgICAgIGNsZWFyQXV0b1Njcm9sbHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF1dG9TY3JvbGwoZXZ0LCBfdGhpcy5vcHRpb25zLCBuZXdFbGVtLCBmYWxsYmFjayk7XG4gICAgICAgICAgfSwgMTApO1xuICAgICAgICAgIGxhc3RBdXRvU2Nyb2xsWCA9IHg7XG4gICAgICAgICAgbGFzdEF1dG9TY3JvbGxZID0geTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgRG5EIGlzIGVuYWJsZWQgKGFuZCBicm93c2VyIGhhcyBnb29kIGF1dG9zY3JvbGxpbmcpLCBmaXJzdCBhdXRvc2Nyb2xsIHdpbGwgYWxyZWFkeSBzY3JvbGwsIHNvIGdldCBwYXJlbnQgYXV0b3Njcm9sbCBvZiBmaXJzdCBhdXRvc2Nyb2xsXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmJ1YmJsZVNjcm9sbCB8fCBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChlbGVtLCB0cnVlKSA9PT0gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpKSB7XG4gICAgICAgICAgY2xlYXJBdXRvU2Nyb2xscygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhdXRvU2Nyb2xsKGV2dCwgdGhpcy5vcHRpb25zLCBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChlbGVtLCBmYWxzZSksIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHJldHVybiBfZXh0ZW5kcyhBdXRvU2Nyb2xsLCB7XG4gICAgcGx1Z2luTmFtZTogJ3Njcm9sbCcsXG4gICAgaW5pdGlhbGl6ZUJ5RGVmYXVsdDogdHJ1ZVxuICB9KTtcbn1cbmZ1bmN0aW9uIGNsZWFyQXV0b1Njcm9sbHMoKSB7XG4gIGF1dG9TY3JvbGxzLmZvckVhY2goZnVuY3Rpb24gKGF1dG9TY3JvbGwpIHtcbiAgICBjbGVhckludGVydmFsKGF1dG9TY3JvbGwucGlkKTtcbiAgfSk7XG4gIGF1dG9TY3JvbGxzID0gW107XG59XG5mdW5jdGlvbiBjbGVhclBvaW50ZXJFbGVtQ2hhbmdlZEludGVydmFsKCkge1xuICBjbGVhckludGVydmFsKHBvaW50ZXJFbGVtQ2hhbmdlZEludGVydmFsKTtcbn1cbnZhciBhdXRvU2Nyb2xsID0gdGhyb3R0bGUoZnVuY3Rpb24gKGV2dCwgb3B0aW9ucywgcm9vdEVsLCBpc0ZhbGxiYWNrKSB7XG4gIC8vIEJ1ZzogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NTA1NTIxXG4gIGlmICghb3B0aW9ucy5zY3JvbGwpIHJldHVybjtcbiAgdmFyIHggPSAoZXZ0LnRvdWNoZXMgPyBldnQudG91Y2hlc1swXSA6IGV2dCkuY2xpZW50WCxcbiAgICB5ID0gKGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnQpLmNsaWVudFksXG4gICAgc2VucyA9IG9wdGlvbnMuc2Nyb2xsU2Vuc2l0aXZpdHksXG4gICAgc3BlZWQgPSBvcHRpb25zLnNjcm9sbFNwZWVkLFxuICAgIHdpblNjcm9sbGVyID0gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xuICB2YXIgc2Nyb2xsVGhpc0luc3RhbmNlID0gZmFsc2UsXG4gICAgc2Nyb2xsQ3VzdG9tRm47XG5cbiAgLy8gTmV3IHNjcm9sbCByb290LCBzZXQgc2Nyb2xsRWxcbiAgaWYgKHNjcm9sbFJvb3RFbCAhPT0gcm9vdEVsKSB7XG4gICAgc2Nyb2xsUm9vdEVsID0gcm9vdEVsO1xuICAgIGNsZWFyQXV0b1Njcm9sbHMoKTtcbiAgICBzY3JvbGxFbCA9IG9wdGlvbnMuc2Nyb2xsO1xuICAgIHNjcm9sbEN1c3RvbUZuID0gb3B0aW9ucy5zY3JvbGxGbjtcbiAgICBpZiAoc2Nyb2xsRWwgPT09IHRydWUpIHtcbiAgICAgIHNjcm9sbEVsID0gZ2V0UGFyZW50QXV0b1Njcm9sbEVsZW1lbnQocm9vdEVsLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgdmFyIGxheWVyc091dCA9IDA7XG4gIHZhciBjdXJyZW50UGFyZW50ID0gc2Nyb2xsRWw7XG4gIGRvIHtcbiAgICB2YXIgZWwgPSBjdXJyZW50UGFyZW50LFxuICAgICAgcmVjdCA9IGdldFJlY3QoZWwpLFxuICAgICAgdG9wID0gcmVjdC50b3AsXG4gICAgICBib3R0b20gPSByZWN0LmJvdHRvbSxcbiAgICAgIGxlZnQgPSByZWN0LmxlZnQsXG4gICAgICByaWdodCA9IHJlY3QucmlnaHQsXG4gICAgICB3aWR0aCA9IHJlY3Qud2lkdGgsXG4gICAgICBoZWlnaHQgPSByZWN0LmhlaWdodCxcbiAgICAgIGNhblNjcm9sbFggPSB2b2lkIDAsXG4gICAgICBjYW5TY3JvbGxZID0gdm9pZCAwLFxuICAgICAgc2Nyb2xsV2lkdGggPSBlbC5zY3JvbGxXaWR0aCxcbiAgICAgIHNjcm9sbEhlaWdodCA9IGVsLnNjcm9sbEhlaWdodCxcbiAgICAgIGVsQ1NTID0gY3NzKGVsKSxcbiAgICAgIHNjcm9sbFBvc1ggPSBlbC5zY3JvbGxMZWZ0LFxuICAgICAgc2Nyb2xsUG9zWSA9IGVsLnNjcm9sbFRvcDtcbiAgICBpZiAoZWwgPT09IHdpblNjcm9sbGVyKSB7XG4gICAgICBjYW5TY3JvbGxYID0gd2lkdGggPCBzY3JvbGxXaWR0aCAmJiAoZWxDU1Mub3ZlcmZsb3dYID09PSAnYXV0bycgfHwgZWxDU1Mub3ZlcmZsb3dYID09PSAnc2Nyb2xsJyB8fCBlbENTUy5vdmVyZmxvd1ggPT09ICd2aXNpYmxlJyk7XG4gICAgICBjYW5TY3JvbGxZID0gaGVpZ2h0IDwgc2Nyb2xsSGVpZ2h0ICYmIChlbENTUy5vdmVyZmxvd1kgPT09ICdhdXRvJyB8fCBlbENTUy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnIHx8IGVsQ1NTLm92ZXJmbG93WSA9PT0gJ3Zpc2libGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FuU2Nyb2xsWCA9IHdpZHRoIDwgc2Nyb2xsV2lkdGggJiYgKGVsQ1NTLm92ZXJmbG93WCA9PT0gJ2F1dG8nIHx8IGVsQ1NTLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcpO1xuICAgICAgY2FuU2Nyb2xsWSA9IGhlaWdodCA8IHNjcm9sbEhlaWdodCAmJiAoZWxDU1Mub3ZlcmZsb3dZID09PSAnYXV0bycgfHwgZWxDU1Mub3ZlcmZsb3dZID09PSAnc2Nyb2xsJyk7XG4gICAgfVxuICAgIHZhciB2eCA9IGNhblNjcm9sbFggJiYgKE1hdGguYWJzKHJpZ2h0IC0geCkgPD0gc2VucyAmJiBzY3JvbGxQb3NYICsgd2lkdGggPCBzY3JvbGxXaWR0aCkgLSAoTWF0aC5hYnMobGVmdCAtIHgpIDw9IHNlbnMgJiYgISFzY3JvbGxQb3NYKTtcbiAgICB2YXIgdnkgPSBjYW5TY3JvbGxZICYmIChNYXRoLmFicyhib3R0b20gLSB5KSA8PSBzZW5zICYmIHNjcm9sbFBvc1kgKyBoZWlnaHQgPCBzY3JvbGxIZWlnaHQpIC0gKE1hdGguYWJzKHRvcCAtIHkpIDw9IHNlbnMgJiYgISFzY3JvbGxQb3NZKTtcbiAgICBpZiAoIWF1dG9TY3JvbGxzW2xheWVyc091dF0pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGxheWVyc091dDsgaSsrKSB7XG4gICAgICAgIGlmICghYXV0b1Njcm9sbHNbaV0pIHtcbiAgICAgICAgICBhdXRvU2Nyb2xsc1tpXSA9IHt9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhdXRvU2Nyb2xsc1tsYXllcnNPdXRdLnZ4ICE9IHZ4IHx8IGF1dG9TY3JvbGxzW2xheWVyc091dF0udnkgIT0gdnkgfHwgYXV0b1Njcm9sbHNbbGF5ZXJzT3V0XS5lbCAhPT0gZWwpIHtcbiAgICAgIGF1dG9TY3JvbGxzW2xheWVyc091dF0uZWwgPSBlbDtcbiAgICAgIGF1dG9TY3JvbGxzW2xheWVyc091dF0udnggPSB2eDtcbiAgICAgIGF1dG9TY3JvbGxzW2xheWVyc091dF0udnkgPSB2eTtcbiAgICAgIGNsZWFySW50ZXJ2YWwoYXV0b1Njcm9sbHNbbGF5ZXJzT3V0XS5waWQpO1xuICAgICAgaWYgKHZ4ICE9IDAgfHwgdnkgIT0gMCkge1xuICAgICAgICBzY3JvbGxUaGlzSW5zdGFuY2UgPSB0cnVlO1xuICAgICAgICAvKiBqc2hpbnQgbG9vcGZ1bmM6dHJ1ZSAqL1xuICAgICAgICBhdXRvU2Nyb2xsc1tsYXllcnNPdXRdLnBpZCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBlbXVsYXRlIGRyYWcgb3ZlciBkdXJpbmcgYXV0b3Njcm9sbCAoZmFsbGJhY2spLCBlbXVsYXRpbmcgbmF0aXZlIERuRCBiZWhhdmlvdXJcbiAgICAgICAgICBpZiAoaXNGYWxsYmFjayAmJiB0aGlzLmxheWVyID09PSAwKSB7XG4gICAgICAgICAgICBTb3J0YWJsZS5hY3RpdmUuX29uVG91Y2hNb3ZlKHRvdWNoRXZ0JDEpOyAvLyBUbyBtb3ZlIGdob3N0IGlmIGl0IGlzIHBvc2l0aW9uZWQgYWJzb2x1dGVseVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgc2Nyb2xsT2Zmc2V0WSA9IGF1dG9TY3JvbGxzW3RoaXMubGF5ZXJdLnZ5ID8gYXV0b1Njcm9sbHNbdGhpcy5sYXllcl0udnkgKiBzcGVlZCA6IDA7XG4gICAgICAgICAgdmFyIHNjcm9sbE9mZnNldFggPSBhdXRvU2Nyb2xsc1t0aGlzLmxheWVyXS52eCA/IGF1dG9TY3JvbGxzW3RoaXMubGF5ZXJdLnZ4ICogc3BlZWQgOiAwO1xuICAgICAgICAgIGlmICh0eXBlb2Ygc2Nyb2xsQ3VzdG9tRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxDdXN0b21Gbi5jYWxsKFNvcnRhYmxlLmRyYWdnZWQucGFyZW50Tm9kZVtleHBhbmRvXSwgc2Nyb2xsT2Zmc2V0WCwgc2Nyb2xsT2Zmc2V0WSwgZXZ0LCB0b3VjaEV2dCQxLCBhdXRvU2Nyb2xsc1t0aGlzLmxheWVyXS5lbCkgIT09ICdjb250aW51ZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzY3JvbGxCeShhdXRvU2Nyb2xsc1t0aGlzLmxheWVyXS5lbCwgc2Nyb2xsT2Zmc2V0WCwgc2Nyb2xsT2Zmc2V0WSk7XG4gICAgICAgIH0uYmluZCh7XG4gICAgICAgICAgbGF5ZXI6IGxheWVyc091dFxuICAgICAgICB9KSwgMjQpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXllcnNPdXQrKztcbiAgfSB3aGlsZSAob3B0aW9ucy5idWJibGVTY3JvbGwgJiYgY3VycmVudFBhcmVudCAhPT0gd2luU2Nyb2xsZXIgJiYgKGN1cnJlbnRQYXJlbnQgPSBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChjdXJyZW50UGFyZW50LCBmYWxzZSkpKTtcbiAgc2Nyb2xsaW5nID0gc2Nyb2xsVGhpc0luc3RhbmNlOyAvLyBpbiBjYXNlIGFub3RoZXIgZnVuY3Rpb24gY2F0Y2hlcyBzY3JvbGxpbmcgYXMgZmFsc2UgaW4gYmV0d2VlbiB3aGVuIGl0IGlzIG5vdFxufSwgMzApO1xuXG52YXIgZHJvcCA9IGZ1bmN0aW9uIGRyb3AoX3JlZikge1xuICB2YXIgb3JpZ2luYWxFdmVudCA9IF9yZWYub3JpZ2luYWxFdmVudCxcbiAgICBwdXRTb3J0YWJsZSA9IF9yZWYucHV0U29ydGFibGUsXG4gICAgZHJhZ0VsID0gX3JlZi5kcmFnRWwsXG4gICAgYWN0aXZlU29ydGFibGUgPSBfcmVmLmFjdGl2ZVNvcnRhYmxlLFxuICAgIGRpc3BhdGNoU29ydGFibGVFdmVudCA9IF9yZWYuZGlzcGF0Y2hTb3J0YWJsZUV2ZW50LFxuICAgIGhpZGVHaG9zdEZvclRhcmdldCA9IF9yZWYuaGlkZUdob3N0Rm9yVGFyZ2V0LFxuICAgIHVuaGlkZUdob3N0Rm9yVGFyZ2V0ID0gX3JlZi51bmhpZGVHaG9zdEZvclRhcmdldDtcbiAgaWYgKCFvcmlnaW5hbEV2ZW50KSByZXR1cm47XG4gIHZhciB0b1NvcnRhYmxlID0gcHV0U29ydGFibGUgfHwgYWN0aXZlU29ydGFibGU7XG4gIGhpZGVHaG9zdEZvclRhcmdldCgpO1xuICB2YXIgdG91Y2ggPSBvcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzICYmIG9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoID8gb3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXSA6IG9yaWdpbmFsRXZlbnQ7XG4gIHZhciB0YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHRvdWNoLmNsaWVudFgsIHRvdWNoLmNsaWVudFkpO1xuICB1bmhpZGVHaG9zdEZvclRhcmdldCgpO1xuICBpZiAodG9Tb3J0YWJsZSAmJiAhdG9Tb3J0YWJsZS5lbC5jb250YWlucyh0YXJnZXQpKSB7XG4gICAgZGlzcGF0Y2hTb3J0YWJsZUV2ZW50KCdzcGlsbCcpO1xuICAgIHRoaXMub25TcGlsbCh7XG4gICAgICBkcmFnRWw6IGRyYWdFbCxcbiAgICAgIHB1dFNvcnRhYmxlOiBwdXRTb3J0YWJsZVxuICAgIH0pO1xuICB9XG59O1xuZnVuY3Rpb24gUmV2ZXJ0KCkge31cblJldmVydC5wcm90b3R5cGUgPSB7XG4gIHN0YXJ0SW5kZXg6IG51bGwsXG4gIGRyYWdTdGFydDogZnVuY3Rpb24gZHJhZ1N0YXJ0KF9yZWYyKSB7XG4gICAgdmFyIG9sZERyYWdnYWJsZUluZGV4ID0gX3JlZjIub2xkRHJhZ2dhYmxlSW5kZXg7XG4gICAgdGhpcy5zdGFydEluZGV4ID0gb2xkRHJhZ2dhYmxlSW5kZXg7XG4gIH0sXG4gIG9uU3BpbGw6IGZ1bmN0aW9uIG9uU3BpbGwoX3JlZjMpIHtcbiAgICB2YXIgZHJhZ0VsID0gX3JlZjMuZHJhZ0VsLFxuICAgICAgcHV0U29ydGFibGUgPSBfcmVmMy5wdXRTb3J0YWJsZTtcbiAgICB0aGlzLnNvcnRhYmxlLmNhcHR1cmVBbmltYXRpb25TdGF0ZSgpO1xuICAgIGlmIChwdXRTb3J0YWJsZSkge1xuICAgICAgcHV0U29ydGFibGUuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG4gICAgfVxuICAgIHZhciBuZXh0U2libGluZyA9IGdldENoaWxkKHRoaXMuc29ydGFibGUuZWwsIHRoaXMuc3RhcnRJbmRleCwgdGhpcy5vcHRpb25zKTtcbiAgICBpZiAobmV4dFNpYmxpbmcpIHtcbiAgICAgIHRoaXMuc29ydGFibGUuZWwuaW5zZXJ0QmVmb3JlKGRyYWdFbCwgbmV4dFNpYmxpbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNvcnRhYmxlLmVsLmFwcGVuZENoaWxkKGRyYWdFbCk7XG4gICAgfVxuICAgIHRoaXMuc29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgIGlmIChwdXRTb3J0YWJsZSkge1xuICAgICAgcHV0U29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgIH1cbiAgfSxcbiAgZHJvcDogZHJvcFxufTtcbl9leHRlbmRzKFJldmVydCwge1xuICBwbHVnaW5OYW1lOiAncmV2ZXJ0T25TcGlsbCdcbn0pO1xuZnVuY3Rpb24gUmVtb3ZlKCkge31cblJlbW92ZS5wcm90b3R5cGUgPSB7XG4gIG9uU3BpbGw6IGZ1bmN0aW9uIG9uU3BpbGwoX3JlZjQpIHtcbiAgICB2YXIgZHJhZ0VsID0gX3JlZjQuZHJhZ0VsLFxuICAgICAgcHV0U29ydGFibGUgPSBfcmVmNC5wdXRTb3J0YWJsZTtcbiAgICB2YXIgcGFyZW50U29ydGFibGUgPSBwdXRTb3J0YWJsZSB8fCB0aGlzLnNvcnRhYmxlO1xuICAgIHBhcmVudFNvcnRhYmxlLmNhcHR1cmVBbmltYXRpb25TdGF0ZSgpO1xuICAgIGRyYWdFbC5wYXJlbnROb2RlICYmIGRyYWdFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRyYWdFbCk7XG4gICAgcGFyZW50U29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICB9LFxuICBkcm9wOiBkcm9wXG59O1xuX2V4dGVuZHMoUmVtb3ZlLCB7XG4gIHBsdWdpbk5hbWU6ICdyZW1vdmVPblNwaWxsJ1xufSk7XG5cbnZhciBsYXN0U3dhcEVsO1xuZnVuY3Rpb24gU3dhcFBsdWdpbigpIHtcbiAgZnVuY3Rpb24gU3dhcCgpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgc3dhcENsYXNzOiAnc29ydGFibGUtc3dhcC1oaWdobGlnaHQnXG4gICAgfTtcbiAgfVxuICBTd2FwLnByb3RvdHlwZSA9IHtcbiAgICBkcmFnU3RhcnQ6IGZ1bmN0aW9uIGRyYWdTdGFydChfcmVmKSB7XG4gICAgICB2YXIgZHJhZ0VsID0gX3JlZi5kcmFnRWw7XG4gICAgICBsYXN0U3dhcEVsID0gZHJhZ0VsO1xuICAgIH0sXG4gICAgZHJhZ092ZXJWYWxpZDogZnVuY3Rpb24gZHJhZ092ZXJWYWxpZChfcmVmMikge1xuICAgICAgdmFyIGNvbXBsZXRlZCA9IF9yZWYyLmNvbXBsZXRlZCxcbiAgICAgICAgdGFyZ2V0ID0gX3JlZjIudGFyZ2V0LFxuICAgICAgICBvbk1vdmUgPSBfcmVmMi5vbk1vdmUsXG4gICAgICAgIGFjdGl2ZVNvcnRhYmxlID0gX3JlZjIuYWN0aXZlU29ydGFibGUsXG4gICAgICAgIGNoYW5nZWQgPSBfcmVmMi5jaGFuZ2VkLFxuICAgICAgICBjYW5jZWwgPSBfcmVmMi5jYW5jZWw7XG4gICAgICBpZiAoIWFjdGl2ZVNvcnRhYmxlLm9wdGlvbnMuc3dhcCkgcmV0dXJuO1xuICAgICAgdmFyIGVsID0gdGhpcy5zb3J0YWJsZS5lbCxcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0ICE9PSBlbCkge1xuICAgICAgICB2YXIgcHJldlN3YXBFbCA9IGxhc3RTd2FwRWw7XG4gICAgICAgIGlmIChvbk1vdmUodGFyZ2V0KSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICB0b2dnbGVDbGFzcyh0YXJnZXQsIG9wdGlvbnMuc3dhcENsYXNzLCB0cnVlKTtcbiAgICAgICAgICBsYXN0U3dhcEVsID0gdGFyZ2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxhc3RTd2FwRWwgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmV2U3dhcEVsICYmIHByZXZTd2FwRWwgIT09IGxhc3RTd2FwRWwpIHtcbiAgICAgICAgICB0b2dnbGVDbGFzcyhwcmV2U3dhcEVsLCBvcHRpb25zLnN3YXBDbGFzcywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjaGFuZ2VkKCk7XG4gICAgICBjb21wbGV0ZWQodHJ1ZSk7XG4gICAgICBjYW5jZWwoKTtcbiAgICB9LFxuICAgIGRyb3A6IGZ1bmN0aW9uIGRyb3AoX3JlZjMpIHtcbiAgICAgIHZhciBhY3RpdmVTb3J0YWJsZSA9IF9yZWYzLmFjdGl2ZVNvcnRhYmxlLFxuICAgICAgICBwdXRTb3J0YWJsZSA9IF9yZWYzLnB1dFNvcnRhYmxlLFxuICAgICAgICBkcmFnRWwgPSBfcmVmMy5kcmFnRWw7XG4gICAgICB2YXIgdG9Tb3J0YWJsZSA9IHB1dFNvcnRhYmxlIHx8IHRoaXMuc29ydGFibGU7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgIGxhc3RTd2FwRWwgJiYgdG9nZ2xlQ2xhc3MobGFzdFN3YXBFbCwgb3B0aW9ucy5zd2FwQ2xhc3MsIGZhbHNlKTtcbiAgICAgIGlmIChsYXN0U3dhcEVsICYmIChvcHRpb25zLnN3YXAgfHwgcHV0U29ydGFibGUgJiYgcHV0U29ydGFibGUub3B0aW9ucy5zd2FwKSkge1xuICAgICAgICBpZiAoZHJhZ0VsICE9PSBsYXN0U3dhcEVsKSB7XG4gICAgICAgICAgdG9Tb3J0YWJsZS5jYXB0dXJlQW5pbWF0aW9uU3RhdGUoKTtcbiAgICAgICAgICBpZiAodG9Tb3J0YWJsZSAhPT0gYWN0aXZlU29ydGFibGUpIGFjdGl2ZVNvcnRhYmxlLmNhcHR1cmVBbmltYXRpb25TdGF0ZSgpO1xuICAgICAgICAgIHN3YXBOb2RlcyhkcmFnRWwsIGxhc3RTd2FwRWwpO1xuICAgICAgICAgIHRvU29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgICAgICAgIGlmICh0b1NvcnRhYmxlICE9PSBhY3RpdmVTb3J0YWJsZSkgYWN0aXZlU29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBudWxsaW5nOiBmdW5jdGlvbiBudWxsaW5nKCkge1xuICAgICAgbGFzdFN3YXBFbCA9IG51bGw7XG4gICAgfVxuICB9O1xuICByZXR1cm4gX2V4dGVuZHMoU3dhcCwge1xuICAgIHBsdWdpbk5hbWU6ICdzd2FwJyxcbiAgICBldmVudFByb3BlcnRpZXM6IGZ1bmN0aW9uIGV2ZW50UHJvcGVydGllcygpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN3YXBJdGVtOiBsYXN0U3dhcEVsXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBzd2FwTm9kZXMobjEsIG4yKSB7XG4gIHZhciBwMSA9IG4xLnBhcmVudE5vZGUsXG4gICAgcDIgPSBuMi5wYXJlbnROb2RlLFxuICAgIGkxLFxuICAgIGkyO1xuICBpZiAoIXAxIHx8ICFwMiB8fCBwMS5pc0VxdWFsTm9kZShuMikgfHwgcDIuaXNFcXVhbE5vZGUobjEpKSByZXR1cm47XG4gIGkxID0gaW5kZXgobjEpO1xuICBpMiA9IGluZGV4KG4yKTtcbiAgaWYgKHAxLmlzRXF1YWxOb2RlKHAyKSAmJiBpMSA8IGkyKSB7XG4gICAgaTIrKztcbiAgfVxuICBwMS5pbnNlcnRCZWZvcmUobjIsIHAxLmNoaWxkcmVuW2kxXSk7XG4gIHAyLmluc2VydEJlZm9yZShuMSwgcDIuY2hpbGRyZW5baTJdKTtcbn1cblxudmFyIG11bHRpRHJhZ0VsZW1lbnRzID0gW10sXG4gIG11bHRpRHJhZ0Nsb25lcyA9IFtdLFxuICBsYXN0TXVsdGlEcmFnU2VsZWN0LFxuICAvLyBmb3Igc2VsZWN0aW9uIHdpdGggbW9kaWZpZXIga2V5IGRvd24gKFNISUZUKVxuICBtdWx0aURyYWdTb3J0YWJsZSxcbiAgaW5pdGlhbEZvbGRpbmcgPSBmYWxzZSxcbiAgLy8gSW5pdGlhbCBtdWx0aS1kcmFnIGZvbGQgd2hlbiBkcmFnIHN0YXJ0ZWRcbiAgZm9sZGluZyA9IGZhbHNlLFxuICAvLyBGb2xkaW5nIGFueSBvdGhlciB0aW1lXG4gIGRyYWdTdGFydGVkID0gZmFsc2UsXG4gIGRyYWdFbCQxLFxuICBjbG9uZXNGcm9tUmVjdCxcbiAgY2xvbmVzSGlkZGVuO1xuZnVuY3Rpb24gTXVsdGlEcmFnUGx1Z2luKCkge1xuICBmdW5jdGlvbiBNdWx0aURyYWcoc29ydGFibGUpIHtcbiAgICAvLyBCaW5kIGFsbCBwcml2YXRlIG1ldGhvZHNcbiAgICBmb3IgKHZhciBmbiBpbiB0aGlzKSB7XG4gICAgICBpZiAoZm4uY2hhckF0KDApID09PSAnXycgJiYgdHlwZW9mIHRoaXNbZm5dID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXNbZm5dID0gdGhpc1tmbl0uYmluZCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFzb3J0YWJsZS5vcHRpb25zLmF2b2lkSW1wbGljaXREZXNlbGVjdCkge1xuICAgICAgaWYgKHNvcnRhYmxlLm9wdGlvbnMuc3VwcG9ydFBvaW50ZXIpIHtcbiAgICAgICAgb24oZG9jdW1lbnQsICdwb2ludGVydXAnLCB0aGlzLl9kZXNlbGVjdE11bHRpRHJhZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvbihkb2N1bWVudCwgJ21vdXNldXAnLCB0aGlzLl9kZXNlbGVjdE11bHRpRHJhZyk7XG4gICAgICAgIG9uKGRvY3VtZW50LCAndG91Y2hlbmQnLCB0aGlzLl9kZXNlbGVjdE11bHRpRHJhZyk7XG4gICAgICB9XG4gICAgfVxuICAgIG9uKGRvY3VtZW50LCAna2V5ZG93bicsIHRoaXMuX2NoZWNrS2V5RG93bik7XG4gICAgb24oZG9jdW1lbnQsICdrZXl1cCcsIHRoaXMuX2NoZWNrS2V5VXApO1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBzZWxlY3RlZENsYXNzOiAnc29ydGFibGUtc2VsZWN0ZWQnLFxuICAgICAgbXVsdGlEcmFnS2V5OiBudWxsLFxuICAgICAgYXZvaWRJbXBsaWNpdERlc2VsZWN0OiBmYWxzZSxcbiAgICAgIHNldERhdGE6IGZ1bmN0aW9uIHNldERhdGEoZGF0YVRyYW5zZmVyLCBkcmFnRWwpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAnJztcbiAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aCAmJiBtdWx0aURyYWdTb3J0YWJsZSA9PT0gc29ydGFibGUpIHtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50LCBpKSB7XG4gICAgICAgICAgICBkYXRhICs9ICghaSA/ICcnIDogJywgJykgKyBtdWx0aURyYWdFbGVtZW50LnRleHRDb250ZW50O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGEgPSBkcmFnRWwudGV4dENvbnRlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZGF0YVRyYW5zZmVyLnNldERhdGEoJ1RleHQnLCBkYXRhKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIE11bHRpRHJhZy5wcm90b3R5cGUgPSB7XG4gICAgbXVsdGlEcmFnS2V5RG93bjogZmFsc2UsXG4gICAgaXNNdWx0aURyYWc6IGZhbHNlLFxuICAgIGRlbGF5U3RhcnRHbG9iYWw6IGZ1bmN0aW9uIGRlbGF5U3RhcnRHbG9iYWwoX3JlZikge1xuICAgICAgdmFyIGRyYWdnZWQgPSBfcmVmLmRyYWdFbDtcbiAgICAgIGRyYWdFbCQxID0gZHJhZ2dlZDtcbiAgICB9LFxuICAgIGRlbGF5RW5kZWQ6IGZ1bmN0aW9uIGRlbGF5RW5kZWQoKSB7XG4gICAgICB0aGlzLmlzTXVsdGlEcmFnID0gfm11bHRpRHJhZ0VsZW1lbnRzLmluZGV4T2YoZHJhZ0VsJDEpO1xuICAgIH0sXG4gICAgc2V0dXBDbG9uZTogZnVuY3Rpb24gc2V0dXBDbG9uZShfcmVmMikge1xuICAgICAgdmFyIHNvcnRhYmxlID0gX3JlZjIuc29ydGFibGUsXG4gICAgICAgIGNhbmNlbCA9IF9yZWYyLmNhbmNlbDtcbiAgICAgIGlmICghdGhpcy5pc011bHRpRHJhZykgcmV0dXJuO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtdWx0aURyYWdFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBtdWx0aURyYWdDbG9uZXMucHVzaChjbG9uZShtdWx0aURyYWdFbGVtZW50c1tpXSkpO1xuICAgICAgICBtdWx0aURyYWdDbG9uZXNbaV0uc29ydGFibGVJbmRleCA9IG11bHRpRHJhZ0VsZW1lbnRzW2ldLnNvcnRhYmxlSW5kZXg7XG4gICAgICAgIG11bHRpRHJhZ0Nsb25lc1tpXS5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgbXVsdGlEcmFnQ2xvbmVzW2ldLnN0eWxlWyd3aWxsLWNoYW5nZSddID0gJyc7XG4gICAgICAgIHRvZ2dsZUNsYXNzKG11bHRpRHJhZ0Nsb25lc1tpXSwgdGhpcy5vcHRpb25zLnNlbGVjdGVkQ2xhc3MsIGZhbHNlKTtcbiAgICAgICAgbXVsdGlEcmFnRWxlbWVudHNbaV0gPT09IGRyYWdFbCQxICYmIHRvZ2dsZUNsYXNzKG11bHRpRHJhZ0Nsb25lc1tpXSwgdGhpcy5vcHRpb25zLmNob3NlbkNsYXNzLCBmYWxzZSk7XG4gICAgICB9XG4gICAgICBzb3J0YWJsZS5faGlkZUNsb25lKCk7XG4gICAgICBjYW5jZWwoKTtcbiAgICB9LFxuICAgIGNsb25lOiBmdW5jdGlvbiBjbG9uZShfcmVmMykge1xuICAgICAgdmFyIHNvcnRhYmxlID0gX3JlZjMuc29ydGFibGUsXG4gICAgICAgIHJvb3RFbCA9IF9yZWYzLnJvb3RFbCxcbiAgICAgICAgZGlzcGF0Y2hTb3J0YWJsZUV2ZW50ID0gX3JlZjMuZGlzcGF0Y2hTb3J0YWJsZUV2ZW50LFxuICAgICAgICBjYW5jZWwgPSBfcmVmMy5jYW5jZWw7XG4gICAgICBpZiAoIXRoaXMuaXNNdWx0aURyYWcpIHJldHVybjtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZUNsb25lT25IaWRlKSB7XG4gICAgICAgIGlmIChtdWx0aURyYWdFbGVtZW50cy5sZW5ndGggJiYgbXVsdGlEcmFnU29ydGFibGUgPT09IHNvcnRhYmxlKSB7XG4gICAgICAgICAgaW5zZXJ0TXVsdGlEcmFnQ2xvbmVzKHRydWUsIHJvb3RFbCk7XG4gICAgICAgICAgZGlzcGF0Y2hTb3J0YWJsZUV2ZW50KCdjbG9uZScpO1xuICAgICAgICAgIGNhbmNlbCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzaG93Q2xvbmU6IGZ1bmN0aW9uIHNob3dDbG9uZShfcmVmNCkge1xuICAgICAgdmFyIGNsb25lTm93U2hvd24gPSBfcmVmNC5jbG9uZU5vd1Nob3duLFxuICAgICAgICByb290RWwgPSBfcmVmNC5yb290RWwsXG4gICAgICAgIGNhbmNlbCA9IF9yZWY0LmNhbmNlbDtcbiAgICAgIGlmICghdGhpcy5pc011bHRpRHJhZykgcmV0dXJuO1xuICAgICAgaW5zZXJ0TXVsdGlEcmFnQ2xvbmVzKGZhbHNlLCByb290RWwpO1xuICAgICAgbXVsdGlEcmFnQ2xvbmVzLmZvckVhY2goZnVuY3Rpb24gKGNsb25lKSB7XG4gICAgICAgIGNzcyhjbG9uZSwgJ2Rpc3BsYXknLCAnJyk7XG4gICAgICB9KTtcbiAgICAgIGNsb25lTm93U2hvd24oKTtcbiAgICAgIGNsb25lc0hpZGRlbiA9IGZhbHNlO1xuICAgICAgY2FuY2VsKCk7XG4gICAgfSxcbiAgICBoaWRlQ2xvbmU6IGZ1bmN0aW9uIGhpZGVDbG9uZShfcmVmNSkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIHZhciBzb3J0YWJsZSA9IF9yZWY1LnNvcnRhYmxlLFxuICAgICAgICBjbG9uZU5vd0hpZGRlbiA9IF9yZWY1LmNsb25lTm93SGlkZGVuLFxuICAgICAgICBjYW5jZWwgPSBfcmVmNS5jYW5jZWw7XG4gICAgICBpZiAoIXRoaXMuaXNNdWx0aURyYWcpIHJldHVybjtcbiAgICAgIG11bHRpRHJhZ0Nsb25lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbG9uZSkge1xuICAgICAgICBjc3MoY2xvbmUsICdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMucmVtb3ZlQ2xvbmVPbkhpZGUgJiYgY2xvbmUucGFyZW50Tm9kZSkge1xuICAgICAgICAgIGNsb25lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2xvbmUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNsb25lTm93SGlkZGVuKCk7XG4gICAgICBjbG9uZXNIaWRkZW4gPSB0cnVlO1xuICAgICAgY2FuY2VsKCk7XG4gICAgfSxcbiAgICBkcmFnU3RhcnRHbG9iYWw6IGZ1bmN0aW9uIGRyYWdTdGFydEdsb2JhbChfcmVmNikge1xuICAgICAgdmFyIHNvcnRhYmxlID0gX3JlZjYuc29ydGFibGU7XG4gICAgICBpZiAoIXRoaXMuaXNNdWx0aURyYWcgJiYgbXVsdGlEcmFnU29ydGFibGUpIHtcbiAgICAgICAgbXVsdGlEcmFnU29ydGFibGUubXVsdGlEcmFnLl9kZXNlbGVjdE11bHRpRHJhZygpO1xuICAgICAgfVxuICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50LnNvcnRhYmxlSW5kZXggPSBpbmRleChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTb3J0IG11bHRpLWRyYWcgZWxlbWVudHNcbiAgICAgIG11bHRpRHJhZ0VsZW1lbnRzID0gbXVsdGlEcmFnRWxlbWVudHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5zb3J0YWJsZUluZGV4IC0gYi5zb3J0YWJsZUluZGV4O1xuICAgICAgfSk7XG4gICAgICBkcmFnU3RhcnRlZCA9IHRydWU7XG4gICAgfSxcbiAgICBkcmFnU3RhcnRlZDogZnVuY3Rpb24gZHJhZ1N0YXJ0ZWQoX3JlZjcpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuICAgICAgdmFyIHNvcnRhYmxlID0gX3JlZjcuc29ydGFibGU7XG4gICAgICBpZiAoIXRoaXMuaXNNdWx0aURyYWcpIHJldHVybjtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc29ydCkge1xuICAgICAgICAvLyBDYXB0dXJlIHJlY3RzLFxuICAgICAgICAvLyBoaWRlIG11bHRpIGRyYWcgZWxlbWVudHMgKGJ5IHBvc2l0aW9uaW5nIHRoZW0gYWJzb2x1dGUpLFxuICAgICAgICAvLyBzZXQgbXVsdGkgZHJhZyBlbGVtZW50cyByZWN0cyB0byBkcmFnUmVjdCxcbiAgICAgICAgLy8gc2hvdyBtdWx0aSBkcmFnIGVsZW1lbnRzLFxuICAgICAgICAvLyBhbmltYXRlIHRvIHJlY3RzLFxuICAgICAgICAvLyB1bnNldCByZWN0cyAmIHJlbW92ZSBmcm9tIERPTVxuXG4gICAgICAgIHNvcnRhYmxlLmNhcHR1cmVBbmltYXRpb25TdGF0ZSgpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikge1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChtdWx0aURyYWdFbGVtZW50ID09PSBkcmFnRWwkMSkgcmV0dXJuO1xuICAgICAgICAgICAgY3NzKG11bHRpRHJhZ0VsZW1lbnQsICdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZhciBkcmFnUmVjdCA9IGdldFJlY3QoZHJhZ0VsJDEsIGZhbHNlLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAobXVsdGlEcmFnRWxlbWVudCA9PT0gZHJhZ0VsJDEpIHJldHVybjtcbiAgICAgICAgICAgIHNldFJlY3QobXVsdGlEcmFnRWxlbWVudCwgZHJhZ1JlY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZvbGRpbmcgPSB0cnVlO1xuICAgICAgICAgIGluaXRpYWxGb2xkaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc29ydGFibGUuYW5pbWF0ZUFsbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvbGRpbmcgPSBmYWxzZTtcbiAgICAgICAgaW5pdGlhbEZvbGRpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLmFuaW1hdGlvbikge1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgIHVuc2V0UmVjdChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBhbGwgYXV4aWxpYXJ5IG11bHRpZHJhZyBpdGVtcyBmcm9tIGVsLCBpZiBzb3J0aW5nIGVuYWJsZWRcbiAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLnNvcnQpIHtcbiAgICAgICAgICByZW1vdmVNdWx0aURyYWdFbGVtZW50cygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGRyYWdPdmVyOiBmdW5jdGlvbiBkcmFnT3ZlcihfcmVmOCkge1xuICAgICAgdmFyIHRhcmdldCA9IF9yZWY4LnRhcmdldCxcbiAgICAgICAgY29tcGxldGVkID0gX3JlZjguY29tcGxldGVkLFxuICAgICAgICBjYW5jZWwgPSBfcmVmOC5jYW5jZWw7XG4gICAgICBpZiAoZm9sZGluZyAmJiB+bXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZih0YXJnZXQpKSB7XG4gICAgICAgIGNvbXBsZXRlZChmYWxzZSk7XG4gICAgICAgIGNhbmNlbCgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmV2ZXJ0OiBmdW5jdGlvbiByZXZlcnQoX3JlZjkpIHtcbiAgICAgIHZhciBmcm9tU29ydGFibGUgPSBfcmVmOS5mcm9tU29ydGFibGUsXG4gICAgICAgIHJvb3RFbCA9IF9yZWY5LnJvb3RFbCxcbiAgICAgICAgc29ydGFibGUgPSBfcmVmOS5zb3J0YWJsZSxcbiAgICAgICAgZHJhZ1JlY3QgPSBfcmVmOS5kcmFnUmVjdDtcbiAgICAgIGlmIChtdWx0aURyYWdFbGVtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIC8vIFNldHVwIHVuZm9sZCBhbmltYXRpb25cbiAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgIHNvcnRhYmxlLmFkZEFuaW1hdGlvblN0YXRlKHtcbiAgICAgICAgICAgIHRhcmdldDogbXVsdGlEcmFnRWxlbWVudCxcbiAgICAgICAgICAgIHJlY3Q6IGZvbGRpbmcgPyBnZXRSZWN0KG11bHRpRHJhZ0VsZW1lbnQpIDogZHJhZ1JlY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB1bnNldFJlY3QobXVsdGlEcmFnRWxlbWVudCk7XG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudC5mcm9tUmVjdCA9IGRyYWdSZWN0O1xuICAgICAgICAgIGZyb21Tb3J0YWJsZS5yZW1vdmVBbmltYXRpb25TdGF0ZShtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvbGRpbmcgPSBmYWxzZTtcbiAgICAgICAgaW5zZXJ0TXVsdGlEcmFnRWxlbWVudHMoIXRoaXMub3B0aW9ucy5yZW1vdmVDbG9uZU9uSGlkZSwgcm9vdEVsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRyYWdPdmVyQ29tcGxldGVkOiBmdW5jdGlvbiBkcmFnT3ZlckNvbXBsZXRlZChfcmVmMTApIHtcbiAgICAgIHZhciBzb3J0YWJsZSA9IF9yZWYxMC5zb3J0YWJsZSxcbiAgICAgICAgaXNPd25lciA9IF9yZWYxMC5pc093bmVyLFxuICAgICAgICBpbnNlcnRpb24gPSBfcmVmMTAuaW5zZXJ0aW9uLFxuICAgICAgICBhY3RpdmVTb3J0YWJsZSA9IF9yZWYxMC5hY3RpdmVTb3J0YWJsZSxcbiAgICAgICAgcGFyZW50RWwgPSBfcmVmMTAucGFyZW50RWwsXG4gICAgICAgIHB1dFNvcnRhYmxlID0gX3JlZjEwLnB1dFNvcnRhYmxlO1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICBpZiAoaW5zZXJ0aW9uKSB7XG4gICAgICAgIC8vIENsb25lcyBtdXN0IGJlIGhpZGRlbiBiZWZvcmUgZm9sZGluZyBhbmltYXRpb24gdG8gY2FwdHVyZSBkcmFnUmVjdEFic29sdXRlIHByb3Blcmx5XG4gICAgICAgIGlmIChpc093bmVyKSB7XG4gICAgICAgICAgYWN0aXZlU29ydGFibGUuX2hpZGVDbG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIGluaXRpYWxGb2xkaW5nID0gZmFsc2U7XG4gICAgICAgIC8vIElmIGxlYXZpbmcgc29ydDpmYWxzZSByb290LCBvciBhbHJlYWR5IGZvbGRpbmcgLSBGb2xkIHRvIG5ldyBsb2NhdGlvblxuICAgICAgICBpZiAob3B0aW9ucy5hbmltYXRpb24gJiYgbXVsdGlEcmFnRWxlbWVudHMubGVuZ3RoID4gMSAmJiAoZm9sZGluZyB8fCAhaXNPd25lciAmJiAhYWN0aXZlU29ydGFibGUub3B0aW9ucy5zb3J0ICYmICFwdXRTb3J0YWJsZSkpIHtcbiAgICAgICAgICAvLyBGb2xkOiBTZXQgYWxsIG11bHRpIGRyYWcgZWxlbWVudHMncyByZWN0cyB0byBkcmFnRWwncyByZWN0IHdoZW4gbXVsdGktZHJhZyBlbGVtZW50cyBhcmUgaW52aXNpYmxlXG4gICAgICAgICAgdmFyIGRyYWdSZWN0QWJzb2x1dGUgPSBnZXRSZWN0KGRyYWdFbCQxLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnQgPT09IGRyYWdFbCQxKSByZXR1cm47XG4gICAgICAgICAgICBzZXRSZWN0KG11bHRpRHJhZ0VsZW1lbnQsIGRyYWdSZWN0QWJzb2x1dGUpO1xuXG4gICAgICAgICAgICAvLyBNb3ZlIGVsZW1lbnQocykgdG8gZW5kIG9mIHBhcmVudEVsIHNvIHRoYXQgaXQgZG9lcyBub3QgaW50ZXJmZXJlIHdpdGggbXVsdGktZHJhZyBjbG9uZXMgaW5zZXJ0aW9uIGlmIHRoZXkgYXJlIGluc2VydGVkXG4gICAgICAgICAgICAvLyB3aGlsZSBmb2xkaW5nLCBhbmQgc28gdGhhdCB3ZSBjYW4gY2FwdHVyZSB0aGVtIGFnYWluIGJlY2F1c2Ugb2xkIHNvcnRhYmxlIHdpbGwgbm8gbG9uZ2VyIGJlIGZyb21Tb3J0YWJsZVxuICAgICAgICAgICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQobXVsdGlEcmFnRWxlbWVudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZm9sZGluZyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbG9uZXMgbXVzdCBiZSBzaG93biAoYW5kIGNoZWNrIHRvIHJlbW92ZSBtdWx0aSBkcmFncykgYWZ0ZXIgZm9sZGluZyB3aGVuIGludGVyZmVyaW5nIG11bHRpRHJhZ0VsZW1lbnRzIGFyZSBtb3ZlZCBvdXRcbiAgICAgICAgaWYgKCFpc093bmVyKSB7XG4gICAgICAgICAgLy8gT25seSByZW1vdmUgaWYgbm90IGZvbGRpbmcgKGZvbGRpbmcgd2lsbCByZW1vdmUgdGhlbSBhbnl3YXlzKVxuICAgICAgICAgIGlmICghZm9sZGluZykge1xuICAgICAgICAgICAgcmVtb3ZlTXVsdGlEcmFnRWxlbWVudHMoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHZhciBjbG9uZXNIaWRkZW5CZWZvcmUgPSBjbG9uZXNIaWRkZW47XG4gICAgICAgICAgICBhY3RpdmVTb3J0YWJsZS5fc2hvd0Nsb25lKHNvcnRhYmxlKTtcblxuICAgICAgICAgICAgLy8gVW5mb2xkIGFuaW1hdGlvbiBmb3IgY2xvbmVzIGlmIHNob3dpbmcgZnJvbSBoaWRkZW5cbiAgICAgICAgICAgIGlmIChhY3RpdmVTb3J0YWJsZS5vcHRpb25zLmFuaW1hdGlvbiAmJiAhY2xvbmVzSGlkZGVuICYmIGNsb25lc0hpZGRlbkJlZm9yZSkge1xuICAgICAgICAgICAgICBtdWx0aURyYWdDbG9uZXMuZm9yRWFjaChmdW5jdGlvbiAoY2xvbmUpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVTb3J0YWJsZS5hZGRBbmltYXRpb25TdGF0ZSh7XG4gICAgICAgICAgICAgICAgICB0YXJnZXQ6IGNsb25lLFxuICAgICAgICAgICAgICAgICAgcmVjdDogY2xvbmVzRnJvbVJlY3RcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjbG9uZS5mcm9tUmVjdCA9IGNsb25lc0Zyb21SZWN0O1xuICAgICAgICAgICAgICAgIGNsb25lLnRoaXNBbmltYXRpb25EdXJhdGlvbiA9IG51bGw7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY3RpdmVTb3J0YWJsZS5fc2hvd0Nsb25lKHNvcnRhYmxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGRyYWdPdmVyQW5pbWF0aW9uQ2FwdHVyZTogZnVuY3Rpb24gZHJhZ092ZXJBbmltYXRpb25DYXB0dXJlKF9yZWYxMSkge1xuICAgICAgdmFyIGRyYWdSZWN0ID0gX3JlZjExLmRyYWdSZWN0LFxuICAgICAgICBpc093bmVyID0gX3JlZjExLmlzT3duZXIsXG4gICAgICAgIGFjdGl2ZVNvcnRhYmxlID0gX3JlZjExLmFjdGl2ZVNvcnRhYmxlO1xuICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50LnRoaXNBbmltYXRpb25EdXJhdGlvbiA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIGlmIChhY3RpdmVTb3J0YWJsZS5vcHRpb25zLmFuaW1hdGlvbiAmJiAhaXNPd25lciAmJiBhY3RpdmVTb3J0YWJsZS5tdWx0aURyYWcuaXNNdWx0aURyYWcpIHtcbiAgICAgICAgY2xvbmVzRnJvbVJlY3QgPSBfZXh0ZW5kcyh7fSwgZHJhZ1JlY3QpO1xuICAgICAgICB2YXIgZHJhZ01hdHJpeCA9IG1hdHJpeChkcmFnRWwkMSwgdHJ1ZSk7XG4gICAgICAgIGNsb25lc0Zyb21SZWN0LnRvcCAtPSBkcmFnTWF0cml4LmY7XG4gICAgICAgIGNsb25lc0Zyb21SZWN0LmxlZnQgLT0gZHJhZ01hdHJpeC5lO1xuICAgICAgfVxuICAgIH0sXG4gICAgZHJhZ092ZXJBbmltYXRpb25Db21wbGV0ZTogZnVuY3Rpb24gZHJhZ092ZXJBbmltYXRpb25Db21wbGV0ZSgpIHtcbiAgICAgIGlmIChmb2xkaW5nKSB7XG4gICAgICAgIGZvbGRpbmcgPSBmYWxzZTtcbiAgICAgICAgcmVtb3ZlTXVsdGlEcmFnRWxlbWVudHMoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRyb3A6IGZ1bmN0aW9uIGRyb3AoX3JlZjEyKSB7XG4gICAgICB2YXIgZXZ0ID0gX3JlZjEyLm9yaWdpbmFsRXZlbnQsXG4gICAgICAgIHJvb3RFbCA9IF9yZWYxMi5yb290RWwsXG4gICAgICAgIHBhcmVudEVsID0gX3JlZjEyLnBhcmVudEVsLFxuICAgICAgICBzb3J0YWJsZSA9IF9yZWYxMi5zb3J0YWJsZSxcbiAgICAgICAgZGlzcGF0Y2hTb3J0YWJsZUV2ZW50ID0gX3JlZjEyLmRpc3BhdGNoU29ydGFibGVFdmVudCxcbiAgICAgICAgb2xkSW5kZXggPSBfcmVmMTIub2xkSW5kZXgsXG4gICAgICAgIHB1dFNvcnRhYmxlID0gX3JlZjEyLnB1dFNvcnRhYmxlO1xuICAgICAgdmFyIHRvU29ydGFibGUgPSBwdXRTb3J0YWJsZSB8fCB0aGlzLnNvcnRhYmxlO1xuICAgICAgaWYgKCFldnQpIHJldHVybjtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICBjaGlsZHJlbiA9IHBhcmVudEVsLmNoaWxkcmVuO1xuXG4gICAgICAvLyBNdWx0aS1kcmFnIHNlbGVjdGlvblxuICAgICAgaWYgKCFkcmFnU3RhcnRlZCkge1xuICAgICAgICBpZiAob3B0aW9ucy5tdWx0aURyYWdLZXkgJiYgIXRoaXMubXVsdGlEcmFnS2V5RG93bikge1xuICAgICAgICAgIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKCk7XG4gICAgICAgIH1cbiAgICAgICAgdG9nZ2xlQ2xhc3MoZHJhZ0VsJDEsIG9wdGlvbnMuc2VsZWN0ZWRDbGFzcywgIX5tdWx0aURyYWdFbGVtZW50cy5pbmRleE9mKGRyYWdFbCQxKSk7XG4gICAgICAgIGlmICghfm11bHRpRHJhZ0VsZW1lbnRzLmluZGV4T2YoZHJhZ0VsJDEpKSB7XG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMucHVzaChkcmFnRWwkMSk7XG4gICAgICAgICAgZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgICBzb3J0YWJsZTogc29ydGFibGUsXG4gICAgICAgICAgICByb290RWw6IHJvb3RFbCxcbiAgICAgICAgICAgIG5hbWU6ICdzZWxlY3QnLFxuICAgICAgICAgICAgdGFyZ2V0RWw6IGRyYWdFbCQxLFxuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBNb2RpZmllciBhY3RpdmF0ZWQsIHNlbGVjdCBmcm9tIGxhc3QgdG8gZHJhZ0VsXG4gICAgICAgICAgaWYgKGV2dC5zaGlmdEtleSAmJiBsYXN0TXVsdGlEcmFnU2VsZWN0ICYmIHNvcnRhYmxlLmVsLmNvbnRhaW5zKGxhc3RNdWx0aURyYWdTZWxlY3QpKSB7XG4gICAgICAgICAgICB2YXIgbGFzdEluZGV4ID0gaW5kZXgobGFzdE11bHRpRHJhZ1NlbGVjdCksXG4gICAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGluZGV4KGRyYWdFbCQxKTtcbiAgICAgICAgICAgIGlmICh+bGFzdEluZGV4ICYmIH5jdXJyZW50SW5kZXggJiYgbGFzdEluZGV4ICE9PSBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBNdXN0IGluY2x1ZGUgbGFzdE11bHRpRHJhZ1NlbGVjdCAoc2VsZWN0IGl0KSwgaW4gY2FzZSBtb2RpZmllZCBzZWxlY3Rpb24gZnJvbSBubyBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICAvLyAoYnV0IHByZXZpb3VzIHNlbGVjdGlvbiBleGlzdGVkKVxuICAgICAgICAgICAgICAgIHZhciBuLCBpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SW5kZXggPiBsYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgIGkgPSBsYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgICBuID0gY3VycmVudEluZGV4O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpID0gY3VycmVudEluZGV4O1xuICAgICAgICAgICAgICAgICAgbiA9IGxhc3RJbmRleCArIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBmaWx0ZXIgPSBvcHRpb25zLmZpbHRlcjtcbiAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgICAgICAgaWYgKH5tdWx0aURyYWdFbGVtZW50cy5pbmRleE9mKGNoaWxkcmVuW2ldKSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGRyYWdnYWJsZVxuICAgICAgICAgICAgICAgICAgaWYgKCFjbG9zZXN0KGNoaWxkcmVuW2ldLCBvcHRpb25zLmRyYWdnYWJsZSwgcGFyZW50RWwsIGZhbHNlKSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGZpbHRlcmVkXG4gICAgICAgICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBmaWx0ZXIgJiYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicgPyBmaWx0ZXIuY2FsbChzb3J0YWJsZSwgZXZ0LCBjaGlsZHJlbltpXSwgc29ydGFibGUpIDogZmlsdGVyLnNwbGl0KCcsJykuc29tZShmdW5jdGlvbiAoY3JpdGVyaWEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsb3Nlc3QoY2hpbGRyZW5baV0sIGNyaXRlcmlhLnRyaW0oKSwgcGFyZW50RWwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJlZCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICB0b2dnbGVDbGFzcyhjaGlsZHJlbltpXSwgb3B0aW9ucy5zZWxlY3RlZENsYXNzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLnB1c2goY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgICAgZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlOiBzb3J0YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgcm9vdEVsOiByb290RWwsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdzZWxlY3QnLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRFbDogY2hpbGRyZW5baV0sXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXN0TXVsdGlEcmFnU2VsZWN0ID0gZHJhZ0VsJDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlID0gdG9Tb3J0YWJsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5zcGxpY2UobXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZihkcmFnRWwkMSksIDEpO1xuICAgICAgICAgIGxhc3RNdWx0aURyYWdTZWxlY3QgPSBudWxsO1xuICAgICAgICAgIGRpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgc29ydGFibGU6IHNvcnRhYmxlLFxuICAgICAgICAgICAgcm9vdEVsOiByb290RWwsXG4gICAgICAgICAgICBuYW1lOiAnZGVzZWxlY3QnLFxuICAgICAgICAgICAgdGFyZ2V0RWw6IGRyYWdFbCQxLFxuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTXVsdGktZHJhZyBkcm9wXG4gICAgICBpZiAoZHJhZ1N0YXJ0ZWQgJiYgdGhpcy5pc011bHRpRHJhZykge1xuICAgICAgICBmb2xkaW5nID0gZmFsc2U7XG4gICAgICAgIC8vIERvIG5vdCBcInVuZm9sZFwiIGFmdGVyIGFyb3VuZCBkcmFnRWwgaWYgcmV2ZXJ0ZWRcbiAgICAgICAgaWYgKChwYXJlbnRFbFtleHBhbmRvXS5vcHRpb25zLnNvcnQgfHwgcGFyZW50RWwgIT09IHJvb3RFbCkgJiYgbXVsdGlEcmFnRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHZhciBkcmFnUmVjdCA9IGdldFJlY3QoZHJhZ0VsJDEpLFxuICAgICAgICAgICAgbXVsdGlEcmFnSW5kZXggPSBpbmRleChkcmFnRWwkMSwgJzpub3QoLicgKyB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcyArICcpJyk7XG4gICAgICAgICAgaWYgKCFpbml0aWFsRm9sZGluZyAmJiBvcHRpb25zLmFuaW1hdGlvbikgZHJhZ0VsJDEudGhpc0FuaW1hdGlvbkR1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgICB0b1NvcnRhYmxlLmNhcHR1cmVBbmltYXRpb25TdGF0ZSgpO1xuICAgICAgICAgIGlmICghaW5pdGlhbEZvbGRpbmcpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFuaW1hdGlvbikge1xuICAgICAgICAgICAgICBkcmFnRWwkMS5mcm9tUmVjdCA9IGRyYWdSZWN0O1xuICAgICAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgbXVsdGlEcmFnRWxlbWVudC50aGlzQW5pbWF0aW9uRHVyYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChtdWx0aURyYWdFbGVtZW50ICE9PSBkcmFnRWwkMSkge1xuICAgICAgICAgICAgICAgICAgdmFyIHJlY3QgPSBmb2xkaW5nID8gZ2V0UmVjdChtdWx0aURyYWdFbGVtZW50KSA6IGRyYWdSZWN0O1xuICAgICAgICAgICAgICAgICAgbXVsdGlEcmFnRWxlbWVudC5mcm9tUmVjdCA9IHJlY3Q7XG5cbiAgICAgICAgICAgICAgICAgIC8vIFByZXBhcmUgdW5mb2xkIGFuaW1hdGlvblxuICAgICAgICAgICAgICAgICAgdG9Tb3J0YWJsZS5hZGRBbmltYXRpb25TdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogbXVsdGlEcmFnRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgcmVjdDogcmVjdFxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTXVsdGkgZHJhZyBlbGVtZW50cyBhcmUgbm90IG5lY2Vzc2FyaWx5IHJlbW92ZWQgZnJvbSB0aGUgRE9NIG9uIGRyb3AsIHNvIHRvIHJlaW5zZXJ0XG4gICAgICAgICAgICAvLyBwcm9wZXJseSB0aGV5IG11c3QgYWxsIGJlIHJlbW92ZWRcbiAgICAgICAgICAgIHJlbW92ZU11bHRpRHJhZ0VsZW1lbnRzKCk7XG4gICAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgICAgIGlmIChjaGlsZHJlblttdWx0aURyYWdJbmRleF0pIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRFbC5pbnNlcnRCZWZvcmUobXVsdGlEcmFnRWxlbWVudCwgY2hpbGRyZW5bbXVsdGlEcmFnSW5kZXhdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRFbC5hcHBlbmRDaGlsZChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBtdWx0aURyYWdJbmRleCsrO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIElmIGluaXRpYWwgZm9sZGluZyBpcyBkb25lLCB0aGUgZWxlbWVudHMgbWF5IGhhdmUgY2hhbmdlZCBwb3NpdGlvbiBiZWNhdXNlIHRoZXkgYXJlIG5vd1xuICAgICAgICAgICAgLy8gdW5mb2xkaW5nIGFyb3VuZCBkcmFnRWwsIGV2ZW4gdGhvdWdoIGRyYWdFbCBtYXkgbm90IGhhdmUgaGlzIGluZGV4IGNoYW5nZWQsIHNvIHVwZGF0ZSBldmVudFxuICAgICAgICAgICAgLy8gbXVzdCBiZSBmaXJlZCBoZXJlIGFzIFNvcnRhYmxlIHdpbGwgbm90LlxuICAgICAgICAgICAgaWYgKG9sZEluZGV4ID09PSBpbmRleChkcmFnRWwkMSkpIHtcbiAgICAgICAgICAgICAgdmFyIHVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnQuc29ydGFibGVJbmRleCAhPT0gaW5kZXgobXVsdGlEcmFnRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgIHVwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKHVwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoU29ydGFibGVFdmVudCgndXBkYXRlJyk7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hTb3J0YWJsZUV2ZW50KCdzb3J0Jyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBNdXN0IGJlIGRvbmUgYWZ0ZXIgY2FwdHVyaW5nIGluZGl2aWR1YWwgcmVjdHMgKHNjcm9sbCBiYXIpXG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgdW5zZXRSZWN0KG11bHRpRHJhZ0VsZW1lbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRvU29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgICAgICB9XG4gICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlID0gdG9Tb3J0YWJsZTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlIGNsb25lcyBpZiBuZWNlc3NhcnlcbiAgICAgIGlmIChyb290RWwgPT09IHBhcmVudEVsIHx8IHB1dFNvcnRhYmxlICYmIHB1dFNvcnRhYmxlLmxhc3RQdXRNb2RlICE9PSAnY2xvbmUnKSB7XG4gICAgICAgIG11bHRpRHJhZ0Nsb25lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbG9uZSkge1xuICAgICAgICAgIGNsb25lLnBhcmVudE5vZGUgJiYgY2xvbmUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjbG9uZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgbnVsbGluZ0dsb2JhbDogZnVuY3Rpb24gbnVsbGluZ0dsb2JhbCgpIHtcbiAgICAgIHRoaXMuaXNNdWx0aURyYWcgPSBkcmFnU3RhcnRlZCA9IGZhbHNlO1xuICAgICAgbXVsdGlEcmFnQ2xvbmVzLmxlbmd0aCA9IDA7XG4gICAgfSxcbiAgICBkZXN0cm95R2xvYmFsOiBmdW5jdGlvbiBkZXN0cm95R2xvYmFsKCkge1xuICAgICAgdGhpcy5fZGVzZWxlY3RNdWx0aURyYWcoKTtcbiAgICAgIG9mZihkb2N1bWVudCwgJ3BvaW50ZXJ1cCcsIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKTtcbiAgICAgIG9mZihkb2N1bWVudCwgJ21vdXNldXAnLCB0aGlzLl9kZXNlbGVjdE11bHRpRHJhZyk7XG4gICAgICBvZmYoZG9jdW1lbnQsICd0b3VjaGVuZCcsIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKTtcbiAgICAgIG9mZihkb2N1bWVudCwgJ2tleWRvd24nLCB0aGlzLl9jaGVja0tleURvd24pO1xuICAgICAgb2ZmKGRvY3VtZW50LCAna2V5dXAnLCB0aGlzLl9jaGVja0tleVVwKTtcbiAgICB9LFxuICAgIF9kZXNlbGVjdE11bHRpRHJhZzogZnVuY3Rpb24gX2Rlc2VsZWN0TXVsdGlEcmFnKGV2dCkge1xuICAgICAgaWYgKHR5cGVvZiBkcmFnU3RhcnRlZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkcmFnU3RhcnRlZCkgcmV0dXJuO1xuXG4gICAgICAvLyBPbmx5IGRlc2VsZWN0IGlmIHNlbGVjdGlvbiBpcyBpbiB0aGlzIHNvcnRhYmxlXG4gICAgICBpZiAobXVsdGlEcmFnU29ydGFibGUgIT09IHRoaXMuc29ydGFibGUpIHJldHVybjtcblxuICAgICAgLy8gT25seSBkZXNlbGVjdCBpZiB0YXJnZXQgaXMgbm90IGl0ZW0gaW4gdGhpcyBzb3J0YWJsZVxuICAgICAgaWYgKGV2dCAmJiBjbG9zZXN0KGV2dC50YXJnZXQsIHRoaXMub3B0aW9ucy5kcmFnZ2FibGUsIHRoaXMuc29ydGFibGUuZWwsIGZhbHNlKSkgcmV0dXJuO1xuXG4gICAgICAvLyBPbmx5IGRlc2VsZWN0IGlmIGxlZnQgY2xpY2tcbiAgICAgIGlmIChldnQgJiYgZXZ0LmJ1dHRvbiAhPT0gMCkgcmV0dXJuO1xuICAgICAgd2hpbGUgKG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICB2YXIgZWwgPSBtdWx0aURyYWdFbGVtZW50c1swXTtcbiAgICAgICAgdG9nZ2xlQ2xhc3MoZWwsIHRoaXMub3B0aW9ucy5zZWxlY3RlZENsYXNzLCBmYWxzZSk7XG4gICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLnNoaWZ0KCk7XG4gICAgICAgIGRpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgIHNvcnRhYmxlOiB0aGlzLnNvcnRhYmxlLFxuICAgICAgICAgIHJvb3RFbDogdGhpcy5zb3J0YWJsZS5lbCxcbiAgICAgICAgICBuYW1lOiAnZGVzZWxlY3QnLFxuICAgICAgICAgIHRhcmdldEVsOiBlbCxcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBfY2hlY2tLZXlEb3duOiBmdW5jdGlvbiBfY2hlY2tLZXlEb3duKGV2dCkge1xuICAgICAgaWYgKGV2dC5rZXkgPT09IHRoaXMub3B0aW9ucy5tdWx0aURyYWdLZXkpIHtcbiAgICAgICAgdGhpcy5tdWx0aURyYWdLZXlEb3duID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9jaGVja0tleVVwOiBmdW5jdGlvbiBfY2hlY2tLZXlVcChldnQpIHtcbiAgICAgIGlmIChldnQua2V5ID09PSB0aGlzLm9wdGlvbnMubXVsdGlEcmFnS2V5KSB7XG4gICAgICAgIHRoaXMubXVsdGlEcmFnS2V5RG93biA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgcmV0dXJuIF9leHRlbmRzKE11bHRpRHJhZywge1xuICAgIC8vIFN0YXRpYyBtZXRob2RzICYgcHJvcGVydGllc1xuICAgIHBsdWdpbk5hbWU6ICdtdWx0aURyYWcnLFxuICAgIHV0aWxzOiB7XG4gICAgICAvKipcclxuICAgICAgICogU2VsZWN0cyB0aGUgcHJvdmlkZWQgbXVsdGktZHJhZyBpdGVtXHJcbiAgICAgICAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbCAgICBUaGUgZWxlbWVudCB0byBiZSBzZWxlY3RlZFxyXG4gICAgICAgKi9cbiAgICAgIHNlbGVjdDogZnVuY3Rpb24gc2VsZWN0KGVsKSB7XG4gICAgICAgIHZhciBzb3J0YWJsZSA9IGVsLnBhcmVudE5vZGVbZXhwYW5kb107XG4gICAgICAgIGlmICghc29ydGFibGUgfHwgIXNvcnRhYmxlLm9wdGlvbnMubXVsdGlEcmFnIHx8IH5tdWx0aURyYWdFbGVtZW50cy5pbmRleE9mKGVsKSkgcmV0dXJuO1xuICAgICAgICBpZiAobXVsdGlEcmFnU29ydGFibGUgJiYgbXVsdGlEcmFnU29ydGFibGUgIT09IHNvcnRhYmxlKSB7XG4gICAgICAgICAgbXVsdGlEcmFnU29ydGFibGUubXVsdGlEcmFnLl9kZXNlbGVjdE11bHRpRHJhZygpO1xuICAgICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlID0gc29ydGFibGU7XG4gICAgICAgIH1cbiAgICAgICAgdG9nZ2xlQ2xhc3MoZWwsIHNvcnRhYmxlLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcywgdHJ1ZSk7XG4gICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLnB1c2goZWwpO1xuICAgICAgfSxcbiAgICAgIC8qKlxyXG4gICAgICAgKiBEZXNlbGVjdHMgdGhlIHByb3ZpZGVkIG11bHRpLWRyYWcgaXRlbVxyXG4gICAgICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWwgICAgVGhlIGVsZW1lbnQgdG8gYmUgZGVzZWxlY3RlZFxyXG4gICAgICAgKi9cbiAgICAgIGRlc2VsZWN0OiBmdW5jdGlvbiBkZXNlbGVjdChlbCkge1xuICAgICAgICB2YXIgc29ydGFibGUgPSBlbC5wYXJlbnROb2RlW2V4cGFuZG9dLFxuICAgICAgICAgIGluZGV4ID0gbXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZihlbCk7XG4gICAgICAgIGlmICghc29ydGFibGUgfHwgIXNvcnRhYmxlLm9wdGlvbnMubXVsdGlEcmFnIHx8ICF+aW5kZXgpIHJldHVybjtcbiAgICAgICAgdG9nZ2xlQ2xhc3MoZWwsIHNvcnRhYmxlLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcywgZmFsc2UpO1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZXZlbnRQcm9wZXJ0aWVzOiBmdW5jdGlvbiBldmVudFByb3BlcnRpZXMoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcbiAgICAgIHZhciBvbGRJbmRpY2llcyA9IFtdLFxuICAgICAgICBuZXdJbmRpY2llcyA9IFtdO1xuICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICBvbGRJbmRpY2llcy5wdXNoKHtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50OiBtdWx0aURyYWdFbGVtZW50LFxuICAgICAgICAgIGluZGV4OiBtdWx0aURyYWdFbGVtZW50LnNvcnRhYmxlSW5kZXhcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gbXVsdGlEcmFnRWxlbWVudHMgd2lsbCBhbHJlYWR5IGJlIHNvcnRlZCBpZiBmb2xkaW5nXG4gICAgICAgIHZhciBuZXdJbmRleDtcbiAgICAgICAgaWYgKGZvbGRpbmcgJiYgbXVsdGlEcmFnRWxlbWVudCAhPT0gZHJhZ0VsJDEpIHtcbiAgICAgICAgICBuZXdJbmRleCA9IC0xO1xuICAgICAgICB9IGVsc2UgaWYgKGZvbGRpbmcpIHtcbiAgICAgICAgICBuZXdJbmRleCA9IGluZGV4KG11bHRpRHJhZ0VsZW1lbnQsICc6bm90KC4nICsgX3RoaXMzLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcyArICcpJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3SW5kZXggPSBpbmRleChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBuZXdJbmRpY2llcy5wdXNoKHtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50OiBtdWx0aURyYWdFbGVtZW50LFxuICAgICAgICAgIGluZGV4OiBuZXdJbmRleFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXRlbXM6IF90b0NvbnN1bWFibGVBcnJheShtdWx0aURyYWdFbGVtZW50cyksXG4gICAgICAgIGNsb25lczogW10uY29uY2F0KG11bHRpRHJhZ0Nsb25lcyksXG4gICAgICAgIG9sZEluZGljaWVzOiBvbGRJbmRpY2llcyxcbiAgICAgICAgbmV3SW5kaWNpZXM6IG5ld0luZGljaWVzXG4gICAgICB9O1xuICAgIH0sXG4gICAgb3B0aW9uTGlzdGVuZXJzOiB7XG4gICAgICBtdWx0aURyYWdLZXk6IGZ1bmN0aW9uIG11bHRpRHJhZ0tleShrZXkpIHtcbiAgICAgICAga2V5ID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChrZXkgPT09ICdjdHJsJykge1xuICAgICAgICAgIGtleSA9ICdDb250cm9sJztcbiAgICAgICAgfSBlbHNlIGlmIChrZXkubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGtleSA9IGtleS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleS5zdWJzdHIoMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gaW5zZXJ0TXVsdGlEcmFnRWxlbWVudHMoY2xvbmVzSW5zZXJ0ZWQsIHJvb3RFbCkge1xuICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50LCBpKSB7XG4gICAgdmFyIHRhcmdldCA9IHJvb3RFbC5jaGlsZHJlblttdWx0aURyYWdFbGVtZW50LnNvcnRhYmxlSW5kZXggKyAoY2xvbmVzSW5zZXJ0ZWQgPyBOdW1iZXIoaSkgOiAwKV07XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgcm9vdEVsLmluc2VydEJlZm9yZShtdWx0aURyYWdFbGVtZW50LCB0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb290RWwuYXBwZW5kQ2hpbGQobXVsdGlEcmFnRWxlbWVudCk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXHJcbiAqIEluc2VydCBtdWx0aS1kcmFnIGNsb25lc1xyXG4gKiBAcGFyYW0gIHtbQm9vbGVhbl19IGVsZW1lbnRzSW5zZXJ0ZWQgIFdoZXRoZXIgdGhlIG11bHRpLWRyYWcgZWxlbWVudHMgYXJlIGluc2VydGVkXHJcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSByb290RWxcclxuICovXG5mdW5jdGlvbiBpbnNlcnRNdWx0aURyYWdDbG9uZXMoZWxlbWVudHNJbnNlcnRlZCwgcm9vdEVsKSB7XG4gIG11bHRpRHJhZ0Nsb25lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbG9uZSwgaSkge1xuICAgIHZhciB0YXJnZXQgPSByb290RWwuY2hpbGRyZW5bY2xvbmUuc29ydGFibGVJbmRleCArIChlbGVtZW50c0luc2VydGVkID8gTnVtYmVyKGkpIDogMCldO1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUoY2xvbmUsIHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3RFbC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIHJlbW92ZU11bHRpRHJhZ0VsZW1lbnRzKCkge1xuICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgaWYgKG11bHRpRHJhZ0VsZW1lbnQgPT09IGRyYWdFbCQxKSByZXR1cm47XG4gICAgbXVsdGlEcmFnRWxlbWVudC5wYXJlbnROb2RlICYmIG11bHRpRHJhZ0VsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChtdWx0aURyYWdFbGVtZW50KTtcbiAgfSk7XG59XG5cblNvcnRhYmxlLm1vdW50KG5ldyBBdXRvU2Nyb2xsUGx1Z2luKCkpO1xuU29ydGFibGUubW91bnQoUmVtb3ZlLCBSZXZlcnQpO1xuXG5leHBvcnQgZGVmYXVsdCBTb3J0YWJsZTtcbmV4cG9ydCB7IE11bHRpRHJhZ1BsdWdpbiBhcyBNdWx0aURyYWcsIFNvcnRhYmxlLCBTd2FwUGx1Z2luIGFzIFN3YXAgfTtcbiIsICJpbXBvcnQgU29ydGFibGUgZnJvbSBcInNvcnRhYmxlanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm9idXN0YVRhYmxlQ29sdW1uTWFuYWdlcih7XG4gICAgZGF0YSA9IFtdLFxuICAgIGZpeGVkID0gW10sXG4gICAgaXNMb2FkaW5nID0gZmFsc2Vcbn0gPSB7fSl7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkYXRhLFxuICAgICAgICBmaXhlZCxcbiAgICAgICAgaXNMb2FkaW5nLFxuICAgICAgICBzb3J0YWJsZTogbnVsbCxcbiAgICAgICAgdW53YXRjaExvYWRpbmc6IG51bGwsXG5cblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgdGhpcy5zb3J0YWJsZSA9IFNvcnRhYmxlLmNyZWF0ZSh0aGlzLiRyZWZzLnNvcnRhYmxlLCB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAxNTAsXG4gICAgICAgICAgICAgICAgZGF0YUlkQXR0cjogJ3gtc29ydGFibGUtaXRlbScsXG4gICAgICAgICAgICAgICAgaGFuZGxlOiAnLnJvYnVzdGEtc29ydGFibGUtaGFuZGxlJyxcbiAgICAgICAgICAgICAgICBvblNvcnQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc29ydGVkU3Vic2V0ID0gdGhpcy5zb3J0YWJsZS50b0FycmF5KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkodGhpcy5kYXRhKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc29ydGFibGVJbmRleCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5maXhlZC5pbmNsdWRlcyhpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChzb3J0ZWRTdWJzZXRbc29ydGFibGVJbmRleF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlSW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zcGxpY2UoMCwgdGhpcy5kYXRhLmxlbmd0aCwgLi4ucmVzdWx0KTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRkaXNwYXRjaChcInNvcnRlZFwiLCBbLi4udGhpcy5kYXRhXSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnVud2F0Y2hMb2FkaW5nID0gdGhpcy4kd2F0Y2goXCJpc0xvYWRpbmdcIiwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3J0YWJsZS5vcHRpb24oJ2Rpc2FibGVkJywgISF2YWx1ZSk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0aGlzLnNvcnRhYmxlLm9wdGlvbignZGlzYWJsZWQnLCAhIXRoaXMuaXNMb2FkaW5nKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgdGhpcy51bndhdGNoTG9hZGluZz8uKCk7XG4gICAgICAgICAgICB0aGlzLnNvcnRhYmxlPy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLnNvcnRhYmxlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQWNBLFNBQVMsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHO0FBQ2hDLFVBQVEsSUFBSSxlQUFlLENBQUMsTUFBTSxJQUFJLE9BQU8sZUFBZSxHQUFHLEdBQUc7QUFBQSxJQUNoRSxPQUFPO0FBQUEsSUFDUCxZQUFZO0FBQUEsSUFDWixjQUFjO0FBQUEsSUFDZCxVQUFVO0FBQUEsRUFDWixDQUFDLElBQUksRUFBRSxDQUFDLElBQUks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QUksRUFBRztBQUU5QixnQkFBTSxTQUFTLENBQUM7QUFDaEIsY0FBSSxnQkFBZ0I7QUFFcEIscUJBQVcsUUFBUSxLQUFLLE1BQU07QUFDMUIsZ0JBQUcsS0FBSyxNQUFNLFNBQVMsSUFBSSxHQUFHO0FBQzFCLHFCQUFPLEtBQUssSUFBSTtBQUFBLFlBQ3BCLE9BQU87QUFDSCxxQkFBTyxLQUFLLGFBQWEsYUFBYSxDQUFDO0FBQ3ZDO0FBQUEsWUFDSjtBQUFBLFVBQ0o7QUFFQSxlQUFLLEtBQUssT0FBTyxHQUFHLEtBQUssS0FBSyxRQUFRLEdBQUcsTUFBTTtBQUUvQyxlQUFLLFVBQVUsVUFBVSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUM7QUFBQSxRQUMzQztBQUFBLE1BQ0osQ0FBQztBQUVELFdBQUssaUJBQWlCLEtBQUssT0FBTyxhQUFhLENBQUMsVUFBVTtBQUN0RCxhQUFLLFNBQVMsT0FBTyxZQUFZLENBQUMsQ0FBQyxLQUFLO0FBQUEsTUFDNUMsQ0FBQztBQUVELFdBQUssU0FBUyxPQUFPLFlBQVksQ0FBQyxDQUFDLEtBQUssU0FBUztBQUFBLElBQ3JEO0FBQUEsSUFFQSxVQUFVO0FBQ04sV0FBSyxpQkFBaUI7QUFDdEIsV0FBSyxVQUFVLFFBQVE7QUFDdkIsV0FBSyxXQUFXO0FBQUEsSUFDcEI7QUFBQSxFQUNKO0FBQ0o7IiwKICAibmFtZXMiOiBbInIiLCAibyIsICJpbmRleCIsICJnaG9zdEVsIiwgIm9wdGlvbiIsICJkZWZhdWx0cyIsICJyb290RWwiLCAiY2xvbmVFbCIsICJvbGRJbmRleCIsICJuZXdJbmRleCIsICJvbGREcmFnZ2FibGVJbmRleCIsICJuZXdEcmFnZ2FibGVJbmRleCIsICJwdXRTb3J0YWJsZSIsICJwbHVnaW5FdmVudCIsICJfZGV0ZWN0RGlyZWN0aW9uIiwgIl9kcmFnRWxJblJvd0NvbHVtbiIsICJfZGV0ZWN0TmVhcmVzdEVtcHR5U29ydGFibGUiLCAiX3ByZXBhcmVHcm91cCIsICJkcmFnRWwiLCAiX2hpZGVHaG9zdEZvclRhcmdldCIsICJfdW5oaWRlR2hvc3RGb3JUYXJnZXQiLCAibmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQiLCAiX2NoZWNrT3V0c2lkZVRhcmdldEVsIiwgImRyYWdTdGFydEZuIiwgInRhcmdldCIsICJhZnRlciIsICJlbCIsICJwbHVnaW5zIiwgImRyb3AiLCAiYXV0b1Njcm9sbCIsICJvblNwaWxsIl0KfQo=
