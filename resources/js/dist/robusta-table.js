// ../../../node_modules/filepond/dist/filepond.esm.js
var isNode = (value) => value instanceof HTMLElement;
var createStore = (initialState, queries2 = [], actions2 = []) => {
  const state2 = {
    ...initialState
  };
  const actionQueue = [];
  const dispatchQueue = [];
  const getState = () => ({ ...state2 });
  const processActionQueue = () => {
    const queue = [...actionQueue];
    actionQueue.length = 0;
    return queue;
  };
  const processDispatchQueue = () => {
    const queue = [...dispatchQueue];
    dispatchQueue.length = 0;
    queue.forEach(({ type, data: data2 }) => {
      dispatch(type, data2);
    });
  };
  const dispatch = (type, data2, isBlocking) => {
    if (isBlocking && !document.hidden) {
      dispatchQueue.push({ type, data: data2 });
      return;
    }
    if (actionHandlers[type]) {
      actionHandlers[type](data2);
    }
    actionQueue.push({
      type,
      data: data2
    });
  };
  const query = (str, ...args) => queryHandles[str] ? queryHandles[str](...args) : null;
  const api = {
    getState,
    processActionQueue,
    processDispatchQueue,
    dispatch,
    query
  };
  let queryHandles = {};
  queries2.forEach((query2) => {
    queryHandles = {
      ...query2(state2),
      ...queryHandles
    };
  });
  let actionHandlers = {};
  actions2.forEach((action) => {
    actionHandlers = {
      ...action(dispatch, query, state2),
      ...actionHandlers
    };
  });
  return api;
};
var defineProperty = (obj, property, definition) => {
  if (typeof definition === "function") {
    obj[property] = definition;
    return;
  }
  Object.defineProperty(obj, property, { ...definition });
};
var forin = (obj, cb) => {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    cb(key, obj[key]);
  }
};
var createObject = (definition) => {
  const obj = {};
  forin(definition, (property) => {
    defineProperty(obj, property, definition[property]);
  });
  return obj;
};
var attr = (node, name2, value = null) => {
  if (value === null) {
    return node.getAttribute(name2) || node.hasAttribute(name2);
  }
  node.setAttribute(name2, value);
};
var ns = "http://www.w3.org/2000/svg";
var svgElements = ["svg", "path"];
var isSVGElement = (tag) => svgElements.includes(tag);
var createElement = (tag, className, attributes = {}) => {
  if (typeof className === "object") {
    attributes = className;
    className = null;
  }
  const element = isSVGElement(tag) ? document.createElementNS(ns, tag) : document.createElement(tag);
  if (className) {
    if (isSVGElement(tag)) {
      attr(element, "class", className);
    } else {
      element.className = className;
    }
  }
  forin(attributes, (name2, value) => {
    attr(element, name2, value);
  });
  return element;
};
var appendChild = (parent) => (child, index) => {
  if (typeof index !== "undefined" && parent.children[index]) {
    parent.insertBefore(child, parent.children[index]);
  } else {
    parent.appendChild(child);
  }
};
var appendChildView = (parent, childViews) => (view, index) => {
  if (typeof index !== "undefined") {
    childViews.splice(index, 0, view);
  } else {
    childViews.push(view);
  }
  return view;
};
var removeChildView = (parent, childViews) => (view) => {
  childViews.splice(childViews.indexOf(view), 1);
  if (view.element.parentNode) {
    parent.removeChild(view.element);
  }
  return view;
};
var IS_BROWSER = (() => typeof window !== "undefined" && typeof window.document !== "undefined")();
var isBrowser = () => IS_BROWSER;
var testElement = isBrowser() ? createElement("svg") : {};
var getChildCount = "children" in testElement ? (el) => el.children.length : (el) => el.childNodes.length;
var getViewRect = (elementRect, childViews, offset, scale) => {
  const left = offset[0] || elementRect.left;
  const top = offset[1] || elementRect.top;
  const right = left + elementRect.width;
  const bottom = top + elementRect.height * (scale[1] || 1);
  const rect = {
    // the rectangle of the element itself
    element: {
      ...elementRect
    },
    // the rectangle of the element expanded to contain its children, does not include any margins
    inner: {
      left: elementRect.left,
      top: elementRect.top,
      right: elementRect.right,
      bottom: elementRect.bottom
    },
    // the rectangle of the element expanded to contain its children including own margin and child margins
    // margins will be added after we've recalculated the size
    outer: {
      left,
      top,
      right,
      bottom
    }
  };
  childViews.filter((childView) => !childView.isRectIgnored()).map((childView) => childView.rect).forEach((childViewRect) => {
    expandRect(rect.inner, { ...childViewRect.inner });
    expandRect(rect.outer, { ...childViewRect.outer });
  });
  calculateRectSize(rect.inner);
  rect.outer.bottom += rect.element.marginBottom;
  rect.outer.right += rect.element.marginRight;
  calculateRectSize(rect.outer);
  return rect;
};
var expandRect = (parent, child) => {
  child.top += parent.top;
  child.right += parent.left;
  child.bottom += parent.top;
  child.left += parent.left;
  if (child.bottom > parent.bottom) {
    parent.bottom = child.bottom;
  }
  if (child.right > parent.right) {
    parent.right = child.right;
  }
};
var calculateRectSize = (rect) => {
  rect.width = rect.right - rect.left;
  rect.height = rect.bottom - rect.top;
};
var isNumber = (value) => typeof value === "number";
var thereYet = (position, destination, velocity, errorMargin = 1e-3) => {
  return Math.abs(position - destination) < errorMargin && Math.abs(velocity) < errorMargin;
};
var spring = (
  // default options
  ({ stiffness = 0.5, damping = 0.75, mass = 10 } = {}) => {
    let target = null;
    let position = null;
    let velocity = 0;
    let resting = false;
    const interpolate = (ts, skipToEndState) => {
      if (resting) return;
      if (!(isNumber(target) && isNumber(position))) {
        resting = true;
        velocity = 0;
        return;
      }
      const f = -(position - target) * stiffness;
      velocity += f / mass;
      position += velocity;
      velocity *= damping;
      if (thereYet(position, target, velocity) || skipToEndState) {
        position = target;
        velocity = 0;
        resting = true;
        api.onupdate(position);
        api.oncomplete(position);
      } else {
        api.onupdate(position);
      }
    };
    const setTarget = (value) => {
      if (isNumber(value) && !isNumber(position)) {
        position = value;
      }
      if (target === null) {
        target = value;
        position = value;
      }
      target = value;
      if (position === target || typeof target === "undefined") {
        resting = true;
        velocity = 0;
        api.onupdate(position);
        api.oncomplete(position);
        return;
      }
      resting = false;
    };
    const api = createObject({
      interpolate,
      target: {
        set: setTarget,
        get: () => target
      },
      resting: {
        get: () => resting
      },
      onupdate: (value) => {
      },
      oncomplete: (value) => {
      }
    });
    return api;
  }
);
var easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
var tween = (
  // default values
  ({ duration = 500, easing = easeInOutQuad, delay = 0 } = {}) => {
    let start = null;
    let t;
    let p;
    let resting = true;
    let reverse = false;
    let target = null;
    const interpolate = (ts, skipToEndState) => {
      if (resting || target === null) return;
      if (start === null) {
        start = ts;
      }
      if (ts - start < delay) return;
      t = ts - start - delay;
      if (t >= duration || skipToEndState) {
        t = 1;
        p = reverse ? 0 : 1;
        api.onupdate(p * target);
        api.oncomplete(p * target);
        resting = true;
      } else {
        p = t / duration;
        api.onupdate((t >= 0 ? easing(reverse ? 1 - p : p) : 0) * target);
      }
    };
    const api = createObject({
      interpolate,
      target: {
        get: () => reverse ? 0 : target,
        set: (value) => {
          if (target === null) {
            target = value;
            api.onupdate(value);
            api.oncomplete(value);
            return;
          }
          if (value < target) {
            target = 1;
            reverse = true;
          } else {
            reverse = false;
            target = value;
          }
          resting = false;
          start = null;
        }
      },
      resting: {
        get: () => resting
      },
      onupdate: (value) => {
      },
      oncomplete: (value) => {
      }
    });
    return api;
  }
);
var animator = {
  spring,
  tween
};
var createAnimator = (definition, category, property) => {
  const def = definition[category] && typeof definition[category][property] === "object" ? definition[category][property] : definition[category] || definition;
  const type = typeof def === "string" ? def : def.type;
  const props = typeof def === "object" ? { ...def } : {};
  return animator[type] ? animator[type](props) : null;
};
var addGetSet = (keys, obj, props, overwrite = false) => {
  obj = Array.isArray(obj) ? obj : [obj];
  obj.forEach((o) => {
    keys.forEach((key) => {
      let name2 = key;
      let getter = () => props[key];
      let setter = (value) => props[key] = value;
      if (typeof key === "object") {
        name2 = key.key;
        getter = key.getter || getter;
        setter = key.setter || setter;
      }
      if (o[name2] && !overwrite) {
        return;
      }
      o[name2] = {
        get: getter,
        set: setter
      };
    });
  });
};
var animations = ({ mixinConfig, viewProps, viewInternalAPI, viewExternalAPI }) => {
  const initialProps = { ...viewProps };
  const animations2 = [];
  forin(mixinConfig, (property, animation) => {
    const animator2 = createAnimator(animation);
    if (!animator2) {
      return;
    }
    animator2.onupdate = (value) => {
      viewProps[property] = value;
    };
    animator2.target = initialProps[property];
    const prop = {
      key: property,
      setter: (value) => {
        if (animator2.target === value) {
          return;
        }
        animator2.target = value;
      },
      getter: () => viewProps[property]
    };
    addGetSet([prop], [viewInternalAPI, viewExternalAPI], viewProps, true);
    animations2.push(animator2);
  });
  return {
    write: (ts) => {
      let skipToEndState = document.hidden;
      let resting = true;
      animations2.forEach((animation) => {
        if (!animation.resting) resting = false;
        animation.interpolate(ts, skipToEndState);
      });
      return resting;
    },
    destroy: () => {
    }
  };
};
var addEvent = (element) => (type, fn2) => {
  element.addEventListener(type, fn2);
};
var removeEvent = (element) => (type, fn2) => {
  element.removeEventListener(type, fn2);
};
var listeners = ({
  mixinConfig,
  viewProps,
  viewInternalAPI,
  viewExternalAPI,
  viewState,
  view
}) => {
  const events = [];
  const add = addEvent(view.element);
  const remove = removeEvent(view.element);
  viewExternalAPI.on = (type, fn2) => {
    events.push({
      type,
      fn: fn2
    });
    add(type, fn2);
  };
  viewExternalAPI.off = (type, fn2) => {
    events.splice(events.findIndex((event) => event.type === type && event.fn === fn2), 1);
    remove(type, fn2);
  };
  return {
    write: () => {
      return true;
    },
    destroy: () => {
      events.forEach((event) => {
        remove(event.type, event.fn);
      });
    }
  };
};
var apis = ({ mixinConfig, viewProps, viewExternalAPI }) => {
  addGetSet(mixinConfig, viewExternalAPI, viewProps);
};
var isDefined = (value) => value != null;
var defaults = {
  opacity: 1,
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  originX: 0,
  originY: 0
};
var styles = ({ mixinConfig, viewProps, viewInternalAPI, viewExternalAPI, view }) => {
  const initialProps = { ...viewProps };
  const currentProps = {};
  addGetSet(mixinConfig, [viewInternalAPI, viewExternalAPI], viewProps);
  const getOffset = () => [viewProps["translateX"] || 0, viewProps["translateY"] || 0];
  const getScale = () => [viewProps["scaleX"] || 0, viewProps["scaleY"] || 0];
  const getRect = () => view.rect ? getViewRect(view.rect, view.childViews, getOffset(), getScale()) : null;
  viewInternalAPI.rect = { get: getRect };
  viewExternalAPI.rect = { get: getRect };
  mixinConfig.forEach((key) => {
    viewProps[key] = typeof initialProps[key] === "undefined" ? defaults[key] : initialProps[key];
  });
  return {
    write: () => {
      if (!propsHaveChanged(currentProps, viewProps)) {
        return;
      }
      applyStyles(view.element, viewProps);
      Object.assign(currentProps, { ...viewProps });
      return true;
    },
    destroy: () => {
    }
  };
};
var propsHaveChanged = (currentProps, newProps) => {
  if (Object.keys(currentProps).length !== Object.keys(newProps).length) {
    return true;
  }
  for (const prop in newProps) {
    if (newProps[prop] !== currentProps[prop]) {
      return true;
    }
  }
  return false;
};
var applyStyles = (element, {
  opacity,
  perspective,
  translateX,
  translateY,
  scaleX,
  scaleY,
  rotateX,
  rotateY,
  rotateZ,
  originX,
  originY,
  width,
  height
}) => {
  let transforms = "";
  let styles2 = "";
  if (isDefined(originX) || isDefined(originY)) {
    styles2 += `transform-origin: ${originX || 0}px ${originY || 0}px;`;
  }
  if (isDefined(perspective)) {
    transforms += `perspective(${perspective}px) `;
  }
  if (isDefined(translateX) || isDefined(translateY)) {
    transforms += `translate3d(${translateX || 0}px, ${translateY || 0}px, 0) `;
  }
  if (isDefined(scaleX) || isDefined(scaleY)) {
    transforms += `scale3d(${isDefined(scaleX) ? scaleX : 1}, ${isDefined(scaleY) ? scaleY : 1}, 1) `;
  }
  if (isDefined(rotateZ)) {
    transforms += `rotateZ(${rotateZ}rad) `;
  }
  if (isDefined(rotateX)) {
    transforms += `rotateX(${rotateX}rad) `;
  }
  if (isDefined(rotateY)) {
    transforms += `rotateY(${rotateY}rad) `;
  }
  if (transforms.length) {
    styles2 += `transform:${transforms};`;
  }
  if (isDefined(opacity)) {
    styles2 += `opacity:${opacity};`;
    if (opacity === 0) {
      styles2 += `visibility:hidden;`;
    }
    if (opacity < 1) {
      styles2 += `pointer-events:none;`;
    }
  }
  if (isDefined(height)) {
    styles2 += `height:${height}px;`;
  }
  if (isDefined(width)) {
    styles2 += `width:${width}px;`;
  }
  const elementCurrentStyle = element.elementCurrentStyle || "";
  if (styles2.length !== elementCurrentStyle.length || styles2 !== elementCurrentStyle) {
    element.style.cssText = styles2;
    element.elementCurrentStyle = styles2;
  }
};
var Mixins = {
  styles,
  listeners,
  animations,
  apis
};
var updateRect = (rect = {}, element = {}, style = {}) => {
  if (!element.layoutCalculated) {
    rect.paddingTop = parseInt(style.paddingTop, 10) || 0;
    rect.marginTop = parseInt(style.marginTop, 10) || 0;
    rect.marginRight = parseInt(style.marginRight, 10) || 0;
    rect.marginBottom = parseInt(style.marginBottom, 10) || 0;
    rect.marginLeft = parseInt(style.marginLeft, 10) || 0;
    element.layoutCalculated = true;
  }
  rect.left = element.offsetLeft || 0;
  rect.top = element.offsetTop || 0;
  rect.width = element.offsetWidth || 0;
  rect.height = element.offsetHeight || 0;
  rect.right = rect.left + rect.width;
  rect.bottom = rect.top + rect.height;
  rect.scrollTop = element.scrollTop;
  rect.hidden = element.offsetParent === null;
  return rect;
};
var createView = (
  // default view definition
  ({
    // element definition
    tag = "div",
    name: name2 = null,
    attributes = {},
    // view interaction
    read = () => {
    },
    write: write2 = () => {
    },
    create: create2 = () => {
    },
    destroy: destroy2 = () => {
    },
    // hooks
    filterFrameActionsForChild = (child, actions2) => actions2,
    didCreateView = () => {
    },
    didWriteView = () => {
    },
    // rect related
    ignoreRect = false,
    ignoreRectUpdate = false,
    // mixins
    mixins = []
  } = {}) => (store, props = {}) => {
    const element = createElement(tag, `filepond--${name2}`, attributes);
    const style = window.getComputedStyle(element, null);
    const rect = updateRect();
    let frameRect = null;
    let isResting = false;
    const childViews = [];
    const activeMixins = [];
    const ref = {};
    const state2 = {};
    const writers = [
      write2
      // default writer
    ];
    const readers = [
      read
      // default reader
    ];
    const destroyers = [
      destroy2
      // default destroy
    ];
    const getElement = () => element;
    const getChildViews = () => childViews.concat();
    const getReference = () => ref;
    const createChildView = (store2) => (view, props2) => view(store2, props2);
    const getRect = () => {
      if (frameRect) {
        return frameRect;
      }
      frameRect = getViewRect(rect, childViews, [0, 0], [1, 1]);
      return frameRect;
    };
    const getStyle = () => style;
    const _read = () => {
      frameRect = null;
      childViews.forEach((child) => child._read());
      const shouldUpdate = !(ignoreRectUpdate && rect.width && rect.height);
      if (shouldUpdate) {
        updateRect(rect, element, style);
      }
      const api = { root: internalAPI, props, rect };
      readers.forEach((reader) => reader(api));
    };
    const _write = (ts, frameActions, shouldOptimize) => {
      let resting = frameActions.length === 0;
      writers.forEach((writer) => {
        const writerResting = writer({
          props,
          root: internalAPI,
          actions: frameActions,
          timestamp: ts,
          shouldOptimize
        });
        if (writerResting === false) {
          resting = false;
        }
      });
      activeMixins.forEach((mixin) => {
        const mixinResting = mixin.write(ts);
        if (mixinResting === false) {
          resting = false;
        }
      });
      childViews.filter((child) => !!child.element.parentNode).forEach((child) => {
        const childResting = child._write(
          ts,
          filterFrameActionsForChild(child, frameActions),
          shouldOptimize
        );
        if (!childResting) {
          resting = false;
        }
      });
      childViews.forEach((child, index) => {
        if (child.element.parentNode) {
          return;
        }
        internalAPI.appendChild(child.element, index);
        child._read();
        child._write(
          ts,
          filterFrameActionsForChild(child, frameActions),
          shouldOptimize
        );
        resting = false;
      });
      isResting = resting;
      didWriteView({
        props,
        root: internalAPI,
        actions: frameActions,
        timestamp: ts
      });
      return resting;
    };
    const _destroy = () => {
      activeMixins.forEach((mixin) => mixin.destroy());
      destroyers.forEach((destroyer) => {
        destroyer({ root: internalAPI, props });
      });
      childViews.forEach((child) => child._destroy());
    };
    const sharedAPIDefinition = {
      element: {
        get: getElement
      },
      style: {
        get: getStyle
      },
      childViews: {
        get: getChildViews
      }
    };
    const internalAPIDefinition = {
      ...sharedAPIDefinition,
      rect: {
        get: getRect
      },
      // access to custom children references
      ref: {
        get: getReference
      },
      // dom modifiers
      is: (needle) => name2 === needle,
      appendChild: appendChild(element),
      createChildView: createChildView(store),
      linkView: (view) => {
        childViews.push(view);
        return view;
      },
      unlinkView: (view) => {
        childViews.splice(childViews.indexOf(view), 1);
      },
      appendChildView: appendChildView(element, childViews),
      removeChildView: removeChildView(element, childViews),
      registerWriter: (writer) => writers.push(writer),
      registerReader: (reader) => readers.push(reader),
      registerDestroyer: (destroyer) => destroyers.push(destroyer),
      invalidateLayout: () => element.layoutCalculated = false,
      // access to data store
      dispatch: store.dispatch,
      query: store.query
    };
    const externalAPIDefinition = {
      element: {
        get: getElement
      },
      childViews: {
        get: getChildViews
      },
      rect: {
        get: getRect
      },
      resting: {
        get: () => isResting
      },
      isRectIgnored: () => ignoreRect,
      _read,
      _write,
      _destroy
    };
    const mixinAPIDefinition = {
      ...sharedAPIDefinition,
      rect: {
        get: () => rect
      }
    };
    Object.keys(mixins).sort((a, b) => {
      if (a === "styles") {
        return 1;
      } else if (b === "styles") {
        return -1;
      }
      return 0;
    }).forEach((key) => {
      const mixinAPI = Mixins[key]({
        mixinConfig: mixins[key],
        viewProps: props,
        viewState: state2,
        viewInternalAPI: internalAPIDefinition,
        viewExternalAPI: externalAPIDefinition,
        view: createObject(mixinAPIDefinition)
      });
      if (mixinAPI) {
        activeMixins.push(mixinAPI);
      }
    });
    const internalAPI = createObject(internalAPIDefinition);
    create2({
      root: internalAPI,
      props
    });
    const childCount = getChildCount(element);
    childViews.forEach((child, index) => {
      internalAPI.appendChild(child.element, childCount + index);
    });
    didCreateView(internalAPI);
    return createObject(externalAPIDefinition);
  }
);
var createPainter = (read, write2, fps = 60) => {
  const name2 = "__framePainter";
  if (window[name2]) {
    window[name2].readers.push(read);
    window[name2].writers.push(write2);
    return;
  }
  window[name2] = {
    readers: [read],
    writers: [write2]
  };
  const painter = window[name2];
  const interval = 1e3 / fps;
  let last = null;
  let id = null;
  let requestTick = null;
  let cancelTick = null;
  const setTimerType = () => {
    if (document.hidden) {
      requestTick = () => window.setTimeout(() => tick(performance.now()), interval);
      cancelTick = () => window.clearTimeout(id);
    } else {
      requestTick = () => window.requestAnimationFrame(tick);
      cancelTick = () => window.cancelAnimationFrame(id);
    }
  };
  document.addEventListener("visibilitychange", () => {
    if (cancelTick) cancelTick();
    setTimerType();
    tick(performance.now());
  });
  const tick = (ts) => {
    id = requestTick(tick);
    if (!last) {
      last = ts;
    }
    const delta = ts - last;
    if (delta <= interval) {
      return;
    }
    last = ts - delta % interval;
    painter.readers.forEach((read2) => read2());
    painter.writers.forEach((write3) => write3(ts));
  };
  setTimerType();
  tick(performance.now());
  return {
    pause: () => {
      cancelTick(id);
    }
  };
};
var createRoute = (routes, fn2) => ({ root: root2, props, actions: actions2 = [], timestamp, shouldOptimize }) => {
  actions2.filter((action) => routes[action.type]).forEach(
    (action) => routes[action.type]({ root: root2, props, action: action.data, timestamp, shouldOptimize })
  );
  if (fn2) {
    fn2({ root: root2, props, actions: actions2, timestamp, shouldOptimize });
  }
};
var insertBefore = (newNode, referenceNode) => referenceNode.parentNode.insertBefore(newNode, referenceNode);
var insertAfter = (newNode, referenceNode) => {
  return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};
var isArray = (value) => Array.isArray(value);
var isEmpty = (value) => value == null;
var trim = (str) => str.trim();
var toString = (value) => "" + value;
var toArray = (value, splitter = ",") => {
  if (isEmpty(value)) {
    return [];
  }
  if (isArray(value)) {
    return value;
  }
  return toString(value).split(splitter).map(trim).filter((str) => str.length);
};
var isBoolean = (value) => typeof value === "boolean";
var toBoolean = (value) => isBoolean(value) ? value : value === "true";
var isString = (value) => typeof value === "string";
var toNumber = (value) => isNumber(value) ? value : isString(value) ? toString(value).replace(/[a-z]+/gi, "") : 0;
var toInt = (value) => parseInt(toNumber(value), 10);
var toFloat = (value) => parseFloat(toNumber(value));
var isInt = (value) => isNumber(value) && isFinite(value) && Math.floor(value) === value;
var toBytes = (value, base = 1e3) => {
  if (isInt(value)) {
    return value;
  }
  let naturalFileSize = toString(value).trim();
  if (/MB$/i.test(naturalFileSize)) {
    naturalFileSize = naturalFileSize.replace(/MB$i/, "").trim();
    return toInt(naturalFileSize) * base * base;
  }
  if (/KB/i.test(naturalFileSize)) {
    naturalFileSize = naturalFileSize.replace(/KB$i/, "").trim();
    return toInt(naturalFileSize) * base;
  }
  return toInt(naturalFileSize);
};
var isFunction = (value) => typeof value === "function";
var toFunctionReference = (string) => {
  let ref = self;
  let levels = string.split(".");
  let level = null;
  while (level = levels.shift()) {
    ref = ref[level];
    if (!ref) {
      return null;
    }
  }
  return ref;
};
var methods = {
  process: "POST",
  patch: "PATCH",
  revert: "DELETE",
  fetch: "GET",
  restore: "GET",
  load: "GET"
};
var createServerAPI = (outline) => {
  const api = {};
  api.url = isString(outline) ? outline : outline.url || "";
  api.timeout = outline.timeout ? parseInt(outline.timeout, 10) : 0;
  api.headers = outline.headers ? outline.headers : {};
  forin(methods, (key) => {
    api[key] = createAction(key, outline[key], methods[key], api.timeout, api.headers);
  });
  api.process = outline.process || isString(outline) || outline.url ? api.process : null;
  api.remove = outline.remove || null;
  delete api.headers;
  return api;
};
var createAction = (name2, outline, method, timeout, headers) => {
  if (outline === null) {
    return null;
  }
  if (typeof outline === "function") {
    return outline;
  }
  const action = {
    url: method === "GET" || method === "PATCH" ? `?${name2}=` : "",
    method,
    headers,
    withCredentials: false,
    timeout,
    onload: null,
    ondata: null,
    onerror: null
  };
  if (isString(outline)) {
    action.url = outline;
    return action;
  }
  Object.assign(action, outline);
  if (isString(action.headers)) {
    const parts = action.headers.split(/:(.+)/);
    action.headers = {
      header: parts[0],
      value: parts[1]
    };
  }
  action.withCredentials = toBoolean(action.withCredentials);
  return action;
};
var toServerAPI = (value) => createServerAPI(value);
var isNull = (value) => value === null;
var isObject = (value) => typeof value === "object" && value !== null;
var isAPI = (value) => {
  return isObject(value) && isString(value.url) && isObject(value.process) && isObject(value.revert) && isObject(value.restore) && isObject(value.fetch);
};
var getType = (value) => {
  if (isArray(value)) {
    return "array";
  }
  if (isNull(value)) {
    return "null";
  }
  if (isInt(value)) {
    return "int";
  }
  if (/^[0-9]+ ?(?:GB|MB|KB)$/gi.test(value)) {
    return "bytes";
  }
  if (isAPI(value)) {
    return "api";
  }
  return typeof value;
};
var replaceSingleQuotes = (str) => str.replace(/{\s*'/g, '{"').replace(/'\s*}/g, '"}').replace(/'\s*:/g, '":').replace(/:\s*'/g, ':"').replace(/,\s*'/g, ',"').replace(/'\s*,/g, '",');
var conversionTable = {
  array: toArray,
  boolean: toBoolean,
  int: (value) => getType(value) === "bytes" ? toBytes(value) : toInt(value),
  number: toFloat,
  float: toFloat,
  bytes: toBytes,
  string: (value) => isFunction(value) ? value : toString(value),
  function: (value) => toFunctionReference(value),
  serverapi: toServerAPI,
  object: (value) => {
    try {
      return JSON.parse(replaceSingleQuotes(value));
    } catch (e) {
      return null;
    }
  }
};
var convertTo = (value, type) => conversionTable[type](value);
var getValueByType = (newValue, defaultValue, valueType) => {
  if (newValue === defaultValue) {
    return newValue;
  }
  let newValueType = getType(newValue);
  if (newValueType !== valueType) {
    const convertedValue = convertTo(newValue, valueType);
    newValueType = getType(convertedValue);
    if (convertedValue === null) {
      throw `Trying to assign value with incorrect type to "${option}", allowed type: "${valueType}"`;
    } else {
      newValue = convertedValue;
    }
  }
  return newValue;
};
var createOption = (defaultValue, valueType) => {
  let currentValue = defaultValue;
  return {
    enumerable: true,
    get: () => currentValue,
    set: (newValue) => {
      currentValue = getValueByType(newValue, defaultValue, valueType);
    }
  };
};
var createOptions = (options) => {
  const obj = {};
  forin(options, (prop) => {
    const optionDefinition = options[prop];
    obj[prop] = createOption(optionDefinition[0], optionDefinition[1]);
  });
  return createObject(obj);
};
var createInitialState = (options) => ({
  // model
  items: [],
  // timeout used for calling update items
  listUpdateTimeout: null,
  // timeout used for stacking metadata updates
  itemUpdateTimeout: null,
  // queue of items waiting to be processed
  processingQueue: [],
  // options
  options: createOptions(options)
});
var fromCamels = (string, separator = "-") => string.split(/(?=[A-Z])/).map((part) => part.toLowerCase()).join(separator);
var createOptionAPI = (store, options) => {
  const obj = {};
  forin(options, (key) => {
    obj[key] = {
      get: () => store.getState().options[key],
      set: (value) => {
        store.dispatch(`SET_${fromCamels(key, "_").toUpperCase()}`, {
          value
        });
      }
    };
  });
  return obj;
};
var createOptionActions = (options) => (dispatch, query, state2) => {
  const obj = {};
  forin(options, (key) => {
    const name2 = fromCamels(key, "_").toUpperCase();
    obj[`SET_${name2}`] = (action) => {
      try {
        state2.options[key] = action.value;
      } catch (e) {
      }
      dispatch(`DID_SET_${name2}`, { value: state2.options[key] });
    };
  });
  return obj;
};
var createOptionQueries = (options) => (state2) => {
  const obj = {};
  forin(options, (key) => {
    obj[`GET_${fromCamels(key, "_").toUpperCase()}`] = (action) => state2.options[key];
  });
  return obj;
};
var InteractionMethod = {
  API: 1,
  DROP: 2,
  BROWSE: 3,
  PASTE: 4,
  NONE: 5
};
var getUniqueId = () => Math.random().toString(36).substring(2, 11);
var arrayRemove = (arr, index) => arr.splice(index, 1);
var run = (cb, sync) => {
  if (sync) {
    cb();
  } else if (document.hidden) {
    Promise.resolve(1).then(cb);
  } else {
    setTimeout(cb, 0);
  }
};
var on = () => {
  const listeners2 = [];
  const off = (event, cb) => {
    arrayRemove(
      listeners2,
      listeners2.findIndex((listener) => listener.event === event && (listener.cb === cb || !cb))
    );
  };
  const fire = (event, args, sync) => {
    listeners2.filter((listener) => listener.event === event).map((listener) => listener.cb).forEach((cb) => run(() => cb(...args), sync));
  };
  return {
    fireSync: (event, ...args) => {
      fire(event, args, true);
    },
    fire: (event, ...args) => {
      fire(event, args, false);
    },
    on: (event, cb) => {
      listeners2.push({ event, cb });
    },
    onOnce: (event, cb) => {
      listeners2.push({
        event,
        cb: (...args) => {
          off(event, cb);
          cb(...args);
        }
      });
    },
    off
  };
};
var copyObjectPropertiesToObject = (src, target, excluded) => {
  Object.getOwnPropertyNames(src).filter((property) => !excluded.includes(property)).forEach(
    (key) => Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(src, key))
  );
};
var PRIVATE = [
  "fire",
  "process",
  "revert",
  "load",
  "on",
  "off",
  "onOnce",
  "retryLoad",
  "extend",
  "archive",
  "archived",
  "release",
  "released",
  "requestProcessing",
  "freeze"
];
var createItemAPI = (item2) => {
  const api = {};
  copyObjectPropertiesToObject(item2, api, PRIVATE);
  return api;
};
var removeReleasedItems = (items) => {
  items.forEach((item2, index) => {
    if (item2.released) {
      arrayRemove(items, index);
    }
  });
};
var ItemStatus = {
  INIT: 1,
  IDLE: 2,
  PROCESSING_QUEUED: 9,
  PROCESSING: 3,
  PROCESSING_COMPLETE: 5,
  PROCESSING_ERROR: 6,
  PROCESSING_REVERT_ERROR: 10,
  LOADING: 7,
  LOAD_ERROR: 8
};
var FileOrigin = {
  INPUT: 1,
  LIMBO: 2,
  LOCAL: 3
};
var getNonNumeric = (str) => /[^0-9]+/.exec(str);
var getDecimalSeparator = () => getNonNumeric(1.1.toLocaleString())[0];
var getThousandsSeparator = () => {
  const decimalSeparator = getDecimalSeparator();
  const thousandsStringWithSeparator = 1e3.toLocaleString();
  const thousandsStringWithoutSeparator = 1e3.toString();
  if (thousandsStringWithSeparator !== thousandsStringWithoutSeparator) {
    return getNonNumeric(thousandsStringWithSeparator)[0];
  }
  return decimalSeparator === "." ? "," : ".";
};
var Type = {
  BOOLEAN: "boolean",
  INT: "int",
  NUMBER: "number",
  STRING: "string",
  ARRAY: "array",
  OBJECT: "object",
  FUNCTION: "function",
  ACTION: "action",
  SERVER_API: "serverapi",
  REGEX: "regex"
};
var filters = [];
var applyFilterChain = (key, value, utils) => new Promise((resolve, reject) => {
  const matchingFilters = filters.filter((f) => f.key === key).map((f) => f.cb);
  if (matchingFilters.length === 0) {
    resolve(value);
    return;
  }
  const initialFilter = matchingFilters.shift();
  matchingFilters.reduce(
    // loop over promises passing value to next promise
    (current, next) => current.then((value2) => next(value2, utils)),
    // call initial filter, will return a promise
    initialFilter(value, utils)
    // all executed
  ).then((value2) => resolve(value2)).catch((error2) => reject(error2));
});
var applyFilters = (key, value, utils) => filters.filter((f) => f.key === key).map((f) => f.cb(value, utils));
var addFilter = (key, cb) => filters.push({ key, cb });
var extendDefaultOptions = (additionalOptions) => Object.assign(defaultOptions, additionalOptions);
var getOptions = () => ({ ...defaultOptions });
var setOptions = (opts) => {
  forin(opts, (key, value) => {
    if (!defaultOptions[key]) {
      return;
    }
    defaultOptions[key][0] = getValueByType(
      value,
      defaultOptions[key][0],
      defaultOptions[key][1]
    );
  });
};
var defaultOptions = {
  // the id to add to the root element
  id: [null, Type.STRING],
  // input field name to use
  name: ["filepond", Type.STRING],
  // disable the field
  disabled: [false, Type.BOOLEAN],
  // classname to put on wrapper
  className: [null, Type.STRING],
  // is the field required
  required: [false, Type.BOOLEAN],
  // Allow media capture when value is set
  captureMethod: [null, Type.STRING],
  // - "camera", "microphone" or "camcorder",
  // - Does not work with multiple on apple devices
  // - If set, acceptedFileTypes must be made to match with media wildcard "image/*", "audio/*" or "video/*"
  // sync `acceptedFileTypes` property with `accept` attribute
  allowSyncAcceptAttribute: [true, Type.BOOLEAN],
  // Feature toggles
  allowDrop: [true, Type.BOOLEAN],
  // Allow dropping of files
  allowBrowse: [true, Type.BOOLEAN],
  // Allow browsing the file system
  allowPaste: [true, Type.BOOLEAN],
  // Allow pasting files
  allowMultiple: [false, Type.BOOLEAN],
  // Allow multiple files (disabled by default, as multiple attribute is also required on input to allow multiple)
  allowReplace: [true, Type.BOOLEAN],
  // Allow dropping a file on other file to replace it (only works when multiple is set to false)
  allowRevert: [true, Type.BOOLEAN],
  // Allows user to revert file upload
  allowRemove: [true, Type.BOOLEAN],
  // Allow user to remove a file
  allowProcess: [true, Type.BOOLEAN],
  // Allows user to process a file, when set to false, this removes the file upload button
  allowReorder: [false, Type.BOOLEAN],
  // Allow reordering of files
  allowDirectoriesOnly: [false, Type.BOOLEAN],
  // Allow only selecting directories with browse (no support for filtering dnd at this point)
  // Try store file if `server` not set
  storeAsFile: [false, Type.BOOLEAN],
  // Revert mode
  forceRevert: [false, Type.BOOLEAN],
  // Set to 'force' to require the file to be reverted before removal
  // Input requirements
  maxFiles: [null, Type.INT],
  // Max number of files
  checkValidity: [false, Type.BOOLEAN],
  // Enables custom validity messages
  // Where to put file
  itemInsertLocationFreedom: [true, Type.BOOLEAN],
  // Set to false to always add items to begin or end of list
  itemInsertLocation: ["before", Type.STRING],
  // Default index in list to add items that have been dropped at the top of the list
  itemInsertInterval: [75, Type.INT],
  // Drag 'n Drop related
  dropOnPage: [false, Type.BOOLEAN],
  // Allow dropping of files anywhere on page (prevents browser from opening file if dropped outside of Up)
  dropOnElement: [true, Type.BOOLEAN],
  // Drop needs to happen on element (set to false to also load drops outside of Up)
  dropValidation: [false, Type.BOOLEAN],
  // Enable or disable validating files on drop
  ignoredFiles: [[".ds_store", "thumbs.db", "desktop.ini"], Type.ARRAY],
  // Upload related
  instantUpload: [true, Type.BOOLEAN],
  // Should upload files immediately on drop
  maxParallelUploads: [2, Type.INT],
  // Maximum files to upload in parallel
  allowMinimumUploadDuration: [true, Type.BOOLEAN],
  // if true uploads take at least 750 ms, this ensures the user sees the upload progress giving trust the upload actually happened
  // Chunks
  chunkUploads: [false, Type.BOOLEAN],
  // Enable chunked uploads
  chunkForce: [false, Type.BOOLEAN],
  // Force use of chunk uploads even for files smaller than chunk size
  chunkSize: [5e6, Type.INT],
  // Size of chunks (5MB default)
  chunkRetryDelays: [[500, 1e3, 3e3], Type.ARRAY],
  // Amount of times to retry upload of a chunk when it fails
  // The server api end points to use for uploading (see docs)
  server: [null, Type.SERVER_API],
  // File size calculations, can set to 1024, this is only used for display, properties use file size base 1000
  fileSizeBase: [1e3, Type.INT],
  // Labels and status messages
  labelFileSizeBytes: ["bytes", Type.STRING],
  labelFileSizeKilobytes: ["KB", Type.STRING],
  labelFileSizeMegabytes: ["MB", Type.STRING],
  labelFileSizeGigabytes: ["GB", Type.STRING],
  labelDecimalSeparator: [getDecimalSeparator(), Type.STRING],
  // Default is locale separator
  labelThousandsSeparator: [getThousandsSeparator(), Type.STRING],
  // Default is locale separator
  labelIdle: [
    'Drag & Drop your files or <span class="filepond--label-action">Browse</span>',
    Type.STRING
  ],
  labelInvalidField: ["Field contains invalid files", Type.STRING],
  labelFileWaitingForSize: ["Waiting for size", Type.STRING],
  labelFileSizeNotAvailable: ["Size not available", Type.STRING],
  labelFileCountSingular: ["file in list", Type.STRING],
  labelFileCountPlural: ["files in list", Type.STRING],
  labelFileLoading: ["Loading", Type.STRING],
  labelFileAdded: ["Added", Type.STRING],
  // assistive only
  labelFileLoadError: ["Error during load", Type.STRING],
  labelFileRemoved: ["Removed", Type.STRING],
  // assistive only
  labelFileRemoveError: ["Error during remove", Type.STRING],
  labelFileProcessing: ["Uploading", Type.STRING],
  labelFileProcessingComplete: ["Upload complete", Type.STRING],
  labelFileProcessingAborted: ["Upload cancelled", Type.STRING],
  labelFileProcessingError: ["Error during upload", Type.STRING],
  labelFileProcessingRevertError: ["Error during revert", Type.STRING],
  labelTapToCancel: ["tap to cancel", Type.STRING],
  labelTapToRetry: ["tap to retry", Type.STRING],
  labelTapToUndo: ["tap to undo", Type.STRING],
  labelButtonRemoveItem: ["Remove", Type.STRING],
  labelButtonAbortItemLoad: ["Abort", Type.STRING],
  labelButtonRetryItemLoad: ["Retry", Type.STRING],
  labelButtonAbortItemProcessing: ["Cancel", Type.STRING],
  labelButtonUndoItemProcessing: ["Undo", Type.STRING],
  labelButtonRetryItemProcessing: ["Retry", Type.STRING],
  labelButtonProcessItem: ["Upload", Type.STRING],
  // make sure width and height plus viewpox are even numbers so icons are nicely centered
  iconRemove: [
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M11.586 13l-2.293 2.293a1 1 0 0 0 1.414 1.414L13 14.414l2.293 2.293a1 1 0 0 0 1.414-1.414L14.414 13l2.293-2.293a1 1 0 0 0-1.414-1.414L13 11.586l-2.293-2.293a1 1 0 0 0-1.414 1.414L11.586 13z" fill="currentColor" fill-rule="nonzero"/></svg>',
    Type.STRING
  ],
  iconProcess: [
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M14 10.414v3.585a1 1 0 0 1-2 0v-3.585l-1.293 1.293a1 1 0 0 1-1.414-1.415l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.415L14 10.414zM9 18a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2H9z" fill="currentColor" fill-rule="evenodd"/></svg>',
    Type.STRING
  ],
  iconRetry: [
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M10.81 9.185l-.038.02A4.997 4.997 0 0 0 8 13.683a5 5 0 0 0 5 5 5 5 0 0 0 5-5 1 1 0 0 1 2 0A7 7 0 1 1 9.722 7.496l-.842-.21a.999.999 0 1 1 .484-1.94l3.23.806c.535.133.86.675.73 1.21l-.804 3.233a.997.997 0 0 1-1.21.73.997.997 0 0 1-.73-1.21l.23-.928v-.002z" fill="currentColor" fill-rule="nonzero"/></svg>',
    Type.STRING
  ],
  iconUndo: [
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M9.185 10.81l.02-.038A4.997 4.997 0 0 1 13.683 8a5 5 0 0 1 5 5 5 5 0 0 1-5 5 1 1 0 0 0 0 2A7 7 0 1 0 7.496 9.722l-.21-.842a.999.999 0 1 0-1.94.484l.806 3.23c.133.535.675.86 1.21.73l3.233-.803a.997.997 0 0 0 .73-1.21.997.997 0 0 0-1.21-.73l-.928.23-.002-.001z" fill="currentColor" fill-rule="nonzero"/></svg>',
    Type.STRING
  ],
  iconDone: [
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M18.293 9.293a1 1 0 0 1 1.414 1.414l-7.002 7a1 1 0 0 1-1.414 0l-3.998-4a1 1 0 1 1 1.414-1.414L12 15.586l6.294-6.293z" fill="currentColor" fill-rule="nonzero"/></svg>',
    Type.STRING
  ],
  // event handlers
  oninit: [null, Type.FUNCTION],
  onwarning: [null, Type.FUNCTION],
  onerror: [null, Type.FUNCTION],
  onactivatefile: [null, Type.FUNCTION],
  oninitfile: [null, Type.FUNCTION],
  onaddfilestart: [null, Type.FUNCTION],
  onaddfileprogress: [null, Type.FUNCTION],
  onaddfile: [null, Type.FUNCTION],
  onprocessfilestart: [null, Type.FUNCTION],
  onprocessfileprogress: [null, Type.FUNCTION],
  onprocessfileabort: [null, Type.FUNCTION],
  onprocessfilerevert: [null, Type.FUNCTION],
  onprocessfile: [null, Type.FUNCTION],
  onprocessfiles: [null, Type.FUNCTION],
  onremovefile: [null, Type.FUNCTION],
  onpreparefile: [null, Type.FUNCTION],
  onupdatefiles: [null, Type.FUNCTION],
  onreorderfiles: [null, Type.FUNCTION],
  // hooks
  beforeDropFile: [null, Type.FUNCTION],
  beforeAddFile: [null, Type.FUNCTION],
  beforeRemoveFile: [null, Type.FUNCTION],
  beforePrepareFile: [null, Type.FUNCTION],
  // styles
  stylePanelLayout: [null, Type.STRING],
  // null 'integrated', 'compact', 'circle'
  stylePanelAspectRatio: [null, Type.STRING],
  // null or '3:2' or 1
  styleItemPanelAspectRatio: [null, Type.STRING],
  styleButtonRemoveItemPosition: ["left", Type.STRING],
  styleButtonProcessItemPosition: ["right", Type.STRING],
  styleLoadIndicatorPosition: ["right", Type.STRING],
  styleProgressIndicatorPosition: ["right", Type.STRING],
  styleButtonRemoveItemAlign: [false, Type.BOOLEAN],
  // custom initial files array
  files: [[], Type.ARRAY],
  // show support by displaying credits
  credits: [["https://filepond.com", "Powered by FilePond"], Type.ARRAY]
};
var getItemByQuery = (items, query) => {
  if (isEmpty(query)) {
    return items[0] || null;
  }
  if (isInt(query)) {
    return items[query] || null;
  }
  if (typeof query === "object") {
    query = query.id;
  }
  return items.find((item2) => item2.id === query) || null;
};
var getNumericAspectRatioFromString = (aspectRatio) => {
  if (isEmpty(aspectRatio)) {
    return aspectRatio;
  }
  if (/:/.test(aspectRatio)) {
    const parts = aspectRatio.split(":");
    return parts[1] / parts[0];
  }
  return parseFloat(aspectRatio);
};
var getActiveItems = (items) => items.filter((item2) => !item2.archived);
var Status = {
  EMPTY: 0,
  IDLE: 1,
  // waiting
  ERROR: 2,
  // a file is in error state
  BUSY: 3,
  // busy processing or loading
  READY: 4
  // all files uploaded
};
var res = null;
var canUpdateFileInput = () => {
  if (res === null) {
    try {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File(["hello world"], "This_Works.txt"));
      const el = document.createElement("input");
      el.setAttribute("type", "file");
      el.files = dataTransfer.files;
      res = el.files.length === 1;
    } catch (err) {
      res = false;
    }
  }
  return res;
};
var ITEM_ERROR = [
  ItemStatus.LOAD_ERROR,
  ItemStatus.PROCESSING_ERROR,
  ItemStatus.PROCESSING_REVERT_ERROR
];
var ITEM_BUSY = [
  ItemStatus.LOADING,
  ItemStatus.PROCESSING,
  ItemStatus.PROCESSING_QUEUED,
  ItemStatus.INIT
];
var ITEM_READY = [ItemStatus.PROCESSING_COMPLETE];
var isItemInErrorState = (item2) => ITEM_ERROR.includes(item2.status);
var isItemInBusyState = (item2) => ITEM_BUSY.includes(item2.status);
var isItemInReadyState = (item2) => ITEM_READY.includes(item2.status);
var isAsync = (state2) => isObject(state2.options.server) && (isObject(state2.options.server.process) || isFunction(state2.options.server.process));
var queries = (state2) => ({
  GET_STATUS: () => {
    const items = getActiveItems(state2.items);
    const { EMPTY, ERROR, BUSY, IDLE, READY } = Status;
    if (items.length === 0) return EMPTY;
    if (items.some(isItemInErrorState)) return ERROR;
    if (items.some(isItemInBusyState)) return BUSY;
    if (items.some(isItemInReadyState)) return READY;
    return IDLE;
  },
  GET_ITEM: (query) => getItemByQuery(state2.items, query),
  GET_ACTIVE_ITEM: (query) => getItemByQuery(getActiveItems(state2.items), query),
  GET_ACTIVE_ITEMS: () => getActiveItems(state2.items),
  GET_ITEMS: () => state2.items,
  GET_ITEM_NAME: (query) => {
    const item2 = getItemByQuery(state2.items, query);
    return item2 ? item2.filename : null;
  },
  GET_ITEM_SIZE: (query) => {
    const item2 = getItemByQuery(state2.items, query);
    return item2 ? item2.fileSize : null;
  },
  GET_STYLES: () => Object.keys(state2.options).filter((key) => /^style/.test(key)).map((option2) => ({
    name: option2,
    value: state2.options[option2]
  })),
  GET_PANEL_ASPECT_RATIO: () => {
    const isShapeCircle = /circle/.test(state2.options.stylePanelLayout);
    const aspectRatio = isShapeCircle ? 1 : getNumericAspectRatioFromString(state2.options.stylePanelAspectRatio);
    return aspectRatio;
  },
  GET_ITEM_PANEL_ASPECT_RATIO: () => state2.options.styleItemPanelAspectRatio,
  GET_ITEMS_BY_STATUS: (status) => getActiveItems(state2.items).filter((item2) => item2.status === status),
  GET_TOTAL_ITEMS: () => getActiveItems(state2.items).length,
  SHOULD_UPDATE_FILE_INPUT: () => state2.options.storeAsFile && canUpdateFileInput() && !isAsync(state2),
  IS_ASYNC: () => isAsync(state2),
  GET_FILE_SIZE_LABELS: (query) => ({
    labelBytes: query("GET_LABEL_FILE_SIZE_BYTES") || void 0,
    labelKilobytes: query("GET_LABEL_FILE_SIZE_KILOBYTES") || void 0,
    labelMegabytes: query("GET_LABEL_FILE_SIZE_MEGABYTES") || void 0,
    labelGigabytes: query("GET_LABEL_FILE_SIZE_GIGABYTES") || void 0
  })
});
var hasRoomForItem = (state2) => {
  const count = getActiveItems(state2.items).length;
  if (!state2.options.allowMultiple) {
    return count === 0;
  }
  const maxFileCount = state2.options.maxFiles;
  if (maxFileCount === null) {
    return true;
  }
  if (count < maxFileCount) {
    return true;
  }
  return false;
};
var limit = (value, min, max) => Math.max(Math.min(max, value), min);
var arrayInsert = (arr, index, item2) => arr.splice(index, 0, item2);
var insertItem = (items, item2, index) => {
  if (isEmpty(item2)) {
    return null;
  }
  if (typeof index === "undefined") {
    items.push(item2);
    return item2;
  }
  index = limit(index, 0, items.length);
  arrayInsert(items, index, item2);
  return item2;
};
var isBase64DataURI = (str) => /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*)\s*$/i.test(
  str
);
var getFilenameFromURL = (url) => `${url}`.split("/").pop().split("?").shift();
var getExtensionFromFilename = (name2) => name2.split(".").pop();
var guesstimateExtension = (type) => {
  if (typeof type !== "string") {
    return "";
  }
  const subtype = type.split("/").pop();
  if (/svg/.test(subtype)) {
    return "svg";
  }
  if (/zip|compressed/.test(subtype)) {
    return "zip";
  }
  if (/plain/.test(subtype)) {
    return "txt";
  }
  if (/msword/.test(subtype)) {
    return "doc";
  }
  if (/[a-z]+/.test(subtype)) {
    if (subtype === "jpeg") {
      return "jpg";
    }
    return subtype;
  }
  return "";
};
var leftPad = (value, padding = "") => (padding + value).slice(-padding.length);
var getDateString = (date = /* @__PURE__ */ new Date()) => `${date.getFullYear()}-${leftPad(date.getMonth() + 1, "00")}-${leftPad(
  date.getDate(),
  "00"
)}_${leftPad(date.getHours(), "00")}-${leftPad(date.getMinutes(), "00")}-${leftPad(
  date.getSeconds(),
  "00"
)}`;
var getFileFromBlob = (blob2, filename, type = null, extension = null) => {
  const file2 = typeof type === "string" ? blob2.slice(0, blob2.size, type) : blob2.slice(0, blob2.size, blob2.type);
  file2.lastModifiedDate = /* @__PURE__ */ new Date();
  if (blob2._relativePath) file2._relativePath = blob2._relativePath;
  if (!isString(filename)) {
    filename = getDateString();
  }
  if (filename && extension === null && getExtensionFromFilename(filename)) {
    file2.name = filename;
  } else {
    extension = extension || guesstimateExtension(file2.type);
    file2.name = filename + (extension ? "." + extension : "");
  }
  return file2;
};
var getBlobBuilder = () => {
  return window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
};
var createBlob = (arrayBuffer, mimeType) => {
  const BB = getBlobBuilder();
  if (BB) {
    const bb = new BB();
    bb.append(arrayBuffer);
    return bb.getBlob(mimeType);
  }
  return new Blob([arrayBuffer], {
    type: mimeType
  });
};
var getBlobFromByteStringWithMimeType = (byteString, mimeType) => {
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return createBlob(ab, mimeType);
};
var getMimeTypeFromBase64DataURI = (dataURI) => {
  return (/^data:(.+);/.exec(dataURI) || [])[1] || null;
};
var getBase64DataFromBase64DataURI = (dataURI) => {
  const data2 = dataURI.split(",")[1];
  return data2.replace(/\s/g, "");
};
var getByteStringFromBase64DataURI = (dataURI) => {
  return atob(getBase64DataFromBase64DataURI(dataURI));
};
var getBlobFromBase64DataURI = (dataURI) => {
  const mimeType = getMimeTypeFromBase64DataURI(dataURI);
  const byteString = getByteStringFromBase64DataURI(dataURI);
  return getBlobFromByteStringWithMimeType(byteString, mimeType);
};
var getFileFromBase64DataURI = (dataURI, filename, extension) => {
  return getFileFromBlob(getBlobFromBase64DataURI(dataURI), filename, null, extension);
};
var getFileNameFromHeader = (header) => {
  if (!/^content-disposition:/i.test(header)) return null;
  const matches = header.split(/filename=|filename\*=.+''/).splice(1).map((name2) => name2.trim().replace(/^["']|[;"']{0,2}$/g, "")).filter((name2) => name2.length);
  return matches.length ? decodeURI(matches[matches.length - 1]) : null;
};
var getFileSizeFromHeader = (header) => {
  if (/content-length:/i.test(header)) {
    const size = header.match(/[0-9]+/)[0];
    return size ? parseInt(size, 10) : null;
  }
  return null;
};
var getTranfserIdFromHeader = (header) => {
  if (/x-content-transfer-id:/i.test(header)) {
    const id = (header.split(":")[1] || "").trim();
    return id || null;
  }
  return null;
};
var getFileInfoFromHeaders = (headers) => {
  const info = {
    source: null,
    name: null,
    size: null
  };
  const rows = headers.split("\n");
  for (let header of rows) {
    const name2 = getFileNameFromHeader(header);
    if (name2) {
      info.name = name2;
      continue;
    }
    const size = getFileSizeFromHeader(header);
    if (size) {
      info.size = size;
      continue;
    }
    const source = getTranfserIdFromHeader(header);
    if (source) {
      info.source = source;
      continue;
    }
  }
  return info;
};
var createFileLoader = (fetchFn) => {
  const state2 = {
    source: null,
    complete: false,
    progress: 0,
    size: null,
    timestamp: null,
    duration: 0,
    request: null
  };
  const getProgress = () => state2.progress;
  const abort = () => {
    if (state2.request && state2.request.abort) {
      state2.request.abort();
    }
  };
  const load = () => {
    const source = state2.source;
    api.fire("init", source);
    if (source instanceof File) {
      api.fire("load", source);
    } else if (source instanceof Blob) {
      api.fire("load", getFileFromBlob(source, source.name));
    } else if (isBase64DataURI(source)) {
      api.fire("load", getFileFromBase64DataURI(source));
    } else {
      loadURL(source);
    }
  };
  const loadURL = (url) => {
    if (!fetchFn) {
      api.fire("error", {
        type: "error",
        body: "Can't load URL",
        code: 400
      });
      return;
    }
    state2.timestamp = Date.now();
    state2.request = fetchFn(
      url,
      (response) => {
        state2.duration = Date.now() - state2.timestamp;
        state2.complete = true;
        if (response instanceof Blob) {
          response = getFileFromBlob(response, response.name || getFilenameFromURL(url));
        }
        api.fire(
          "load",
          // if has received blob, we go with blob, if no response, we return null
          response instanceof Blob ? response : response ? response.body : null
        );
      },
      (error2) => {
        api.fire(
          "error",
          typeof error2 === "string" ? {
            type: "error",
            code: 0,
            body: error2
          } : error2
        );
      },
      (computable, current, total) => {
        if (total) {
          state2.size = total;
        }
        state2.duration = Date.now() - state2.timestamp;
        if (!computable) {
          state2.progress = null;
          return;
        }
        state2.progress = current / total;
        api.fire("progress", state2.progress);
      },
      () => {
        api.fire("abort");
      },
      (response) => {
        const fileinfo = getFileInfoFromHeaders(
          typeof response === "string" ? response : response.headers
        );
        api.fire("meta", {
          size: state2.size || fileinfo.size,
          filename: fileinfo.name,
          source: fileinfo.source
        });
      }
    );
  };
  const api = {
    ...on(),
    setSource: (source) => state2.source = source,
    getProgress,
    // file load progress
    abort,
    // abort file load
    load
    // start load
  };
  return api;
};
var isGet = (method) => /GET|HEAD/.test(method);
var sendRequest = (data2, url, options) => {
  const api = {
    onheaders: () => {
    },
    onprogress: () => {
    },
    onload: () => {
    },
    ontimeout: () => {
    },
    onerror: () => {
    },
    onabort: () => {
    },
    abort: () => {
      aborted = true;
      xhr.abort();
    }
  };
  let aborted = false;
  let headersReceived = false;
  options = {
    method: "POST",
    headers: {},
    withCredentials: false,
    ...options
  };
  url = encodeURI(url);
  if (isGet(options.method) && data2) {
    url = `${url}${encodeURIComponent(typeof data2 === "string" ? data2 : JSON.stringify(data2))}`;
  }
  const xhr = new XMLHttpRequest();
  const process = isGet(options.method) ? xhr : xhr.upload;
  process.onprogress = (e) => {
    if (aborted) {
      return;
    }
    api.onprogress(e.lengthComputable, e.loaded, e.total);
  };
  xhr.onreadystatechange = () => {
    if (xhr.readyState < 2) {
      return;
    }
    if (xhr.readyState === 4 && xhr.status === 0) {
      return;
    }
    if (headersReceived) {
      return;
    }
    headersReceived = true;
    api.onheaders(xhr);
  };
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      api.onload(xhr);
    } else {
      api.onerror(xhr);
    }
  };
  xhr.onerror = () => api.onerror(xhr);
  xhr.onabort = () => {
    aborted = true;
    api.onabort();
  };
  xhr.ontimeout = () => api.ontimeout(xhr);
  xhr.open(options.method, url, true);
  if (isInt(options.timeout)) {
    xhr.timeout = options.timeout;
  }
  Object.keys(options.headers).forEach((key) => {
    const value = unescape(encodeURIComponent(options.headers[key]));
    xhr.setRequestHeader(key, value);
  });
  if (options.responseType) {
    xhr.responseType = options.responseType;
  }
  if (options.withCredentials) {
    xhr.withCredentials = true;
  }
  xhr.send(data2);
  return api;
};
var createResponse = (type, code, body, headers) => ({
  type,
  code,
  body,
  headers
});
var createTimeoutResponse = (cb) => (xhr) => {
  cb(createResponse("error", 0, "Timeout", xhr.getAllResponseHeaders()));
};
var hasQS = (str) => /\?/.test(str);
var buildURL = (...parts) => {
  let url = "";
  parts.forEach((part) => {
    url += hasQS(url) && hasQS(part) ? part.replace(/\?/, "&") : part;
  });
  return url;
};
var createFetchFunction = (apiUrl = "", action) => {
  if (typeof action === "function") {
    return action;
  }
  if (!action || !isString(action.url)) {
    return null;
  }
  const onload = action.onload || ((res2) => res2);
  const onerror = action.onerror || ((res2) => null);
  return (url, load, error2, progress, abort, headers) => {
    const request = sendRequest(url, buildURL(apiUrl, action.url), {
      ...action,
      responseType: "blob"
    });
    request.onload = (xhr) => {
      const headers2 = xhr.getAllResponseHeaders();
      const filename = getFileInfoFromHeaders(headers2).name || getFilenameFromURL(url);
      load(
        createResponse(
          "load",
          xhr.status,
          action.method === "HEAD" ? null : getFileFromBlob(onload(xhr.response), filename),
          headers2
        )
      );
    };
    request.onerror = (xhr) => {
      error2(
        createResponse(
          "error",
          xhr.status,
          onerror(xhr.response) || xhr.statusText,
          xhr.getAllResponseHeaders()
        )
      );
    };
    request.onheaders = (xhr) => {
      headers(createResponse("headers", xhr.status, null, xhr.getAllResponseHeaders()));
    };
    request.ontimeout = createTimeoutResponse(error2);
    request.onprogress = progress;
    request.onabort = abort;
    return request;
  };
};
var ChunkStatus = {
  QUEUED: 0,
  COMPLETE: 1,
  PROCESSING: 2,
  ERROR: 3,
  WAITING: 4
};
var processFileChunked = (apiUrl, action, name2, file2, metadata, load, error2, progress, abort, transfer, options) => {
  const chunks = [];
  const { chunkTransferId, chunkServer, chunkSize, chunkRetryDelays } = options;
  const state2 = {
    serverId: chunkTransferId,
    aborted: false
  };
  const ondata = action.ondata || ((fd) => fd);
  const onload = action.onload || ((xhr, method) => method === "HEAD" ? xhr.getResponseHeader("Upload-Offset") : xhr.response);
  const onerror = action.onerror || ((res2) => null);
  const requestTransferId = (cb) => {
    const formData = new FormData();
    if (isObject(metadata)) formData.append(name2, JSON.stringify(metadata));
    const headers = typeof action.headers === "function" ? action.headers(file2, metadata) : {
      ...action.headers,
      "Upload-Length": file2.size
    };
    const requestParams = {
      ...action,
      headers
    };
    const request = sendRequest(ondata(formData), buildURL(apiUrl, action.url), requestParams);
    request.onload = (xhr) => cb(onload(xhr, requestParams.method));
    request.onerror = (xhr) => error2(
      createResponse(
        "error",
        xhr.status,
        onerror(xhr.response) || xhr.statusText,
        xhr.getAllResponseHeaders()
      )
    );
    request.ontimeout = createTimeoutResponse(error2);
  };
  const requestTransferOffset = (cb) => {
    const requestUrl = buildURL(apiUrl, chunkServer.url, state2.serverId);
    const headers = typeof action.headers === "function" ? action.headers(state2.serverId) : {
      ...action.headers
    };
    const requestParams = {
      headers,
      method: "HEAD"
    };
    const request = sendRequest(null, requestUrl, requestParams);
    request.onload = (xhr) => cb(onload(xhr, requestParams.method));
    request.onerror = (xhr) => error2(
      createResponse(
        "error",
        xhr.status,
        onerror(xhr.response) || xhr.statusText,
        xhr.getAllResponseHeaders()
      )
    );
    request.ontimeout = createTimeoutResponse(error2);
  };
  const lastChunkIndex = Math.floor(file2.size / chunkSize);
  for (let i = 0; i <= lastChunkIndex; i++) {
    const offset = i * chunkSize;
    const data2 = file2.slice(offset, offset + chunkSize, "application/offset+octet-stream");
    chunks[i] = {
      index: i,
      size: data2.size,
      offset,
      data: data2,
      file: file2,
      progress: 0,
      retries: [...chunkRetryDelays],
      status: ChunkStatus.QUEUED,
      error: null,
      request: null,
      timeout: null
    };
  }
  const completeProcessingChunks = () => load(state2.serverId);
  const canProcessChunk = (chunk) => chunk.status === ChunkStatus.QUEUED || chunk.status === ChunkStatus.ERROR;
  const processChunk = (chunk) => {
    if (state2.aborted) return;
    chunk = chunk || chunks.find(canProcessChunk);
    if (!chunk) {
      if (chunks.every((chunk2) => chunk2.status === ChunkStatus.COMPLETE)) {
        completeProcessingChunks();
      }
      return;
    }
    chunk.status = ChunkStatus.PROCESSING;
    chunk.progress = null;
    const ondata2 = chunkServer.ondata || ((fd) => fd);
    const onerror2 = chunkServer.onerror || ((res2) => null);
    const onload2 = chunkServer.onload || (() => {
    });
    const requestUrl = buildURL(apiUrl, chunkServer.url, state2.serverId);
    const headers = typeof chunkServer.headers === "function" ? chunkServer.headers(chunk) : {
      ...chunkServer.headers,
      "Content-Type": "application/offset+octet-stream",
      "Upload-Offset": chunk.offset,
      "Upload-Length": file2.size,
      "Upload-Name": file2.name
    };
    const request = chunk.request = sendRequest(ondata2(chunk.data), requestUrl, {
      ...chunkServer,
      headers
    });
    request.onload = (xhr) => {
      onload2(xhr, chunk.index, chunks.length);
      chunk.status = ChunkStatus.COMPLETE;
      chunk.request = null;
      processChunks();
    };
    request.onprogress = (lengthComputable, loaded, total) => {
      chunk.progress = lengthComputable ? loaded : null;
      updateTotalProgress();
    };
    request.onerror = (xhr) => {
      chunk.status = ChunkStatus.ERROR;
      chunk.request = null;
      chunk.error = onerror2(xhr.response) || xhr.statusText;
      if (!retryProcessChunk(chunk)) {
        error2(
          createResponse(
            "error",
            xhr.status,
            onerror2(xhr.response) || xhr.statusText,
            xhr.getAllResponseHeaders()
          )
        );
      }
    };
    request.ontimeout = (xhr) => {
      chunk.status = ChunkStatus.ERROR;
      chunk.request = null;
      if (!retryProcessChunk(chunk)) {
        createTimeoutResponse(error2)(xhr);
      }
    };
    request.onabort = () => {
      chunk.status = ChunkStatus.QUEUED;
      chunk.request = null;
      abort();
    };
  };
  const retryProcessChunk = (chunk) => {
    if (chunk.retries.length === 0) return false;
    chunk.status = ChunkStatus.WAITING;
    clearTimeout(chunk.timeout);
    chunk.timeout = setTimeout(() => {
      processChunk(chunk);
    }, chunk.retries.shift());
    return true;
  };
  const updateTotalProgress = () => {
    const totalBytesTransfered = chunks.reduce((p, chunk) => {
      if (p === null || chunk.progress === null) return null;
      return p + chunk.progress;
    }, 0);
    if (totalBytesTransfered === null) return progress(false, 0, 0);
    const totalSize = chunks.reduce((total, chunk) => total + chunk.size, 0);
    progress(true, totalBytesTransfered, totalSize);
  };
  const processChunks = () => {
    const totalProcessing = chunks.filter((chunk) => chunk.status === ChunkStatus.PROCESSING).length;
    if (totalProcessing >= 1) return;
    processChunk();
  };
  const abortChunks = () => {
    chunks.forEach((chunk) => {
      clearTimeout(chunk.timeout);
      if (chunk.request) {
        chunk.request.abort();
      }
    });
  };
  if (!state2.serverId) {
    requestTransferId((serverId) => {
      if (state2.aborted) return;
      transfer(serverId);
      state2.serverId = serverId;
      processChunks();
    });
  } else {
    requestTransferOffset((offset) => {
      if (state2.aborted) return;
      chunks.filter((chunk) => chunk.offset < offset).forEach((chunk) => {
        chunk.status = ChunkStatus.COMPLETE;
        chunk.progress = chunk.size;
      });
      processChunks();
    });
  }
  return {
    abort: () => {
      state2.aborted = true;
      abortChunks();
    }
  };
};
var createFileProcessorFunction = (apiUrl, action, name2, options) => (file2, metadata, load, error2, progress, abort, transfer) => {
  if (!file2) return;
  const canChunkUpload = options.chunkUploads;
  const shouldChunkUpload = canChunkUpload && file2.size > options.chunkSize;
  const willChunkUpload = canChunkUpload && (shouldChunkUpload || options.chunkForce);
  if (file2 instanceof Blob && willChunkUpload)
    return processFileChunked(
      apiUrl,
      action,
      name2,
      file2,
      metadata,
      load,
      error2,
      progress,
      abort,
      transfer,
      options
    );
  const ondata = action.ondata || ((fd) => fd);
  const onload = action.onload || ((res2) => res2);
  const onerror = action.onerror || ((res2) => null);
  const headers = typeof action.headers === "function" ? action.headers(file2, metadata) || {} : {
    ...action.headers
  };
  const requestParams = {
    ...action,
    headers
  };
  var formData = new FormData();
  if (isObject(metadata)) {
    formData.append(name2, JSON.stringify(metadata));
  }
  (file2 instanceof Blob ? [{ name: null, file: file2 }] : file2).forEach((item2) => {
    formData.append(
      name2,
      item2.file,
      item2.name === null ? item2.file.name : `${item2.name}${item2.file.name}`
    );
  });
  const request = sendRequest(ondata(formData), buildURL(apiUrl, action.url), requestParams);
  request.onload = (xhr) => {
    load(createResponse("load", xhr.status, onload(xhr.response), xhr.getAllResponseHeaders()));
  };
  request.onerror = (xhr) => {
    error2(
      createResponse(
        "error",
        xhr.status,
        onerror(xhr.response) || xhr.statusText,
        xhr.getAllResponseHeaders()
      )
    );
  };
  request.ontimeout = createTimeoutResponse(error2);
  request.onprogress = progress;
  request.onabort = abort;
  return request;
};
var createProcessorFunction = (apiUrl = "", action, name2, options) => {
  if (typeof action === "function") return (...params) => action(name2, ...params, options);
  if (!action || !isString(action.url)) return null;
  return createFileProcessorFunction(apiUrl, action, name2, options);
};
var createRevertFunction = (apiUrl = "", action) => {
  if (typeof action === "function") {
    return action;
  }
  if (!action || !isString(action.url)) {
    return (uniqueFileId, load) => load();
  }
  const onload = action.onload || ((res2) => res2);
  const onerror = action.onerror || ((res2) => null);
  return (uniqueFileId, load, error2) => {
    const request = sendRequest(
      uniqueFileId,
      apiUrl + action.url,
      action
      // contains method, headers and withCredentials properties
    );
    request.onload = (xhr) => {
      load(
        createResponse(
          "load",
          xhr.status,
          onload(xhr.response),
          xhr.getAllResponseHeaders()
        )
      );
    };
    request.onerror = (xhr) => {
      error2(
        createResponse(
          "error",
          xhr.status,
          onerror(xhr.response) || xhr.statusText,
          xhr.getAllResponseHeaders()
        )
      );
    };
    request.ontimeout = createTimeoutResponse(error2);
    return request;
  };
};
var getRandomNumber = (min = 0, max = 1) => min + Math.random() * (max - min);
var createPerceivedPerformanceUpdater = (cb, duration = 1e3, offset = 0, tickMin = 25, tickMax = 250) => {
  let timeout = null;
  const start = Date.now();
  const tick = () => {
    let runtime = Date.now() - start;
    let delay = getRandomNumber(tickMin, tickMax);
    if (runtime + delay > duration) {
      delay = runtime + delay - duration;
    }
    let progress = runtime / duration;
    if (progress >= 1 || document.hidden) {
      cb(1);
      return;
    }
    cb(progress);
    timeout = setTimeout(tick, delay);
  };
  if (duration > 0) tick();
  return {
    clear: () => {
      clearTimeout(timeout);
    }
  };
};
var createFileProcessor = (processFn, options) => {
  const state2 = {
    complete: false,
    perceivedProgress: 0,
    perceivedPerformanceUpdater: null,
    progress: null,
    timestamp: null,
    perceivedDuration: 0,
    duration: 0,
    request: null,
    response: null
  };
  const { allowMinimumUploadDuration } = options;
  const process = (file2, metadata) => {
    const progressFn = () => {
      if (state2.duration === 0 || state2.progress === null) return;
      api.fire("progress", api.getProgress());
    };
    const completeFn = () => {
      state2.complete = true;
      api.fire("load-perceived", state2.response.body);
    };
    api.fire("start");
    state2.timestamp = Date.now();
    state2.perceivedPerformanceUpdater = createPerceivedPerformanceUpdater(
      (progress) => {
        state2.perceivedProgress = progress;
        state2.perceivedDuration = Date.now() - state2.timestamp;
        progressFn();
        if (state2.response && state2.perceivedProgress === 1 && !state2.complete) {
          completeFn();
        }
      },
      // random delay as in a list of files you start noticing
      // files uploading at the exact same speed
      allowMinimumUploadDuration ? getRandomNumber(750, 1500) : 0
    );
    state2.request = processFn(
      // the file to process
      file2,
      // the metadata to send along
      metadata,
      // callbacks (load, error, progress, abort, transfer)
      // load expects the body to be a server id if
      // you want to make use of revert
      (response) => {
        state2.response = isObject(response) ? response : {
          type: "load",
          code: 200,
          body: `${response}`,
          headers: {}
        };
        state2.duration = Date.now() - state2.timestamp;
        state2.progress = 1;
        api.fire("load", state2.response.body);
        if (!allowMinimumUploadDuration || allowMinimumUploadDuration && state2.perceivedProgress === 1) {
          completeFn();
        }
      },
      // error is expected to be an object with type, code, body
      (error2) => {
        state2.perceivedPerformanceUpdater.clear();
        api.fire(
          "error",
          isObject(error2) ? error2 : {
            type: "error",
            code: 0,
            body: `${error2}`
          }
        );
      },
      // actual processing progress
      (computable, current, total) => {
        state2.duration = Date.now() - state2.timestamp;
        state2.progress = computable ? current / total : null;
        progressFn();
      },
      // abort does not expect a value
      () => {
        state2.perceivedPerformanceUpdater.clear();
        api.fire("abort", state2.response ? state2.response.body : null);
      },
      // register the id for this transfer
      (transferId) => {
        api.fire("transfer", transferId);
      }
    );
  };
  const abort = () => {
    if (!state2.request) return;
    state2.perceivedPerformanceUpdater.clear();
    if (state2.request.abort) state2.request.abort();
    state2.complete = true;
  };
  const reset = () => {
    abort();
    state2.complete = false;
    state2.perceivedProgress = 0;
    state2.progress = 0;
    state2.timestamp = null;
    state2.perceivedDuration = 0;
    state2.duration = 0;
    state2.request = null;
    state2.response = null;
  };
  const getProgress = allowMinimumUploadDuration ? () => state2.progress ? Math.min(state2.progress, state2.perceivedProgress) : null : () => state2.progress || null;
  const getDuration = allowMinimumUploadDuration ? () => Math.min(state2.duration, state2.perceivedDuration) : () => state2.duration;
  const api = {
    ...on(),
    process,
    // start processing file
    abort,
    // abort active process request
    getProgress,
    getDuration,
    reset
  };
  return api;
};
var getFilenameWithoutExtension = (name2) => name2.substring(0, name2.lastIndexOf(".")) || name2;
var createFileStub = (source) => {
  let data2 = [source.name, source.size, source.type];
  if (source instanceof Blob || isBase64DataURI(source)) {
    data2[0] = source.name || getDateString();
  } else if (isBase64DataURI(source)) {
    data2[1] = source.length;
    data2[2] = getMimeTypeFromBase64DataURI(source);
  } else if (isString(source)) {
    data2[0] = getFilenameFromURL(source);
    data2[1] = 0;
    data2[2] = "application/octet-stream";
  }
  return {
    name: data2[0],
    size: data2[1],
    type: data2[2]
  };
};
var isFile = (value) => !!(value instanceof File || value instanceof Blob && value.name);
var deepCloneObject = (src) => {
  if (!isObject(src)) return src;
  const target = isArray(src) ? [] : {};
  for (const key in src) {
    if (!src.hasOwnProperty(key)) continue;
    const v = src[key];
    target[key] = v && isObject(v) ? deepCloneObject(v) : v;
  }
  return target;
};
var createItem = (origin = null, serverFileReference = null, file2 = null) => {
  const id = getUniqueId();
  const state2 = {
    // is archived
    archived: false,
    // if is frozen, no longer fires events
    frozen: false,
    // removed from view
    released: false,
    // original source
    source: null,
    // file model reference
    file: file2,
    // id of file on server
    serverFileReference,
    // id of file transfer on server
    transferId: null,
    // is aborted
    processingAborted: false,
    // current item status
    status: serverFileReference ? ItemStatus.PROCESSING_COMPLETE : ItemStatus.INIT,
    // active processes
    activeLoader: null,
    activeProcessor: null
  };
  let abortProcessingRequestComplete = null;
  const metadata = {};
  const setStatus = (status) => state2.status = status;
  const fire = (event, ...params) => {
    if (state2.released || state2.frozen) return;
    api.fire(event, ...params);
  };
  const getFileExtension = () => getExtensionFromFilename(state2.file.name);
  const getFileType = () => state2.file.type;
  const getFileSize = () => state2.file.size;
  const getFile = () => state2.file;
  const load = (source, loader, onload) => {
    state2.source = source;
    api.fireSync("init");
    if (state2.file) {
      api.fireSync("load-skip");
      return;
    }
    state2.file = createFileStub(source);
    loader.on("init", () => {
      fire("load-init");
    });
    loader.on("meta", (meta) => {
      state2.file.size = meta.size;
      state2.file.filename = meta.filename;
      if (meta.source) {
        origin = FileOrigin.LIMBO;
        state2.serverFileReference = meta.source;
        state2.status = ItemStatus.PROCESSING_COMPLETE;
      }
      fire("load-meta");
    });
    loader.on("progress", (progress) => {
      setStatus(ItemStatus.LOADING);
      fire("load-progress", progress);
    });
    loader.on("error", (error2) => {
      setStatus(ItemStatus.LOAD_ERROR);
      fire("load-request-error", error2);
    });
    loader.on("abort", () => {
      setStatus(ItemStatus.INIT);
      fire("load-abort");
    });
    loader.on("load", (file3) => {
      state2.activeLoader = null;
      const success = (result) => {
        state2.file = isFile(result) ? result : state2.file;
        if (origin === FileOrigin.LIMBO && state2.serverFileReference) {
          setStatus(ItemStatus.PROCESSING_COMPLETE);
        } else {
          setStatus(ItemStatus.IDLE);
        }
        fire("load");
      };
      const error2 = (result) => {
        state2.file = file3;
        fire("load-meta");
        setStatus(ItemStatus.LOAD_ERROR);
        fire("load-file-error", result);
      };
      if (state2.serverFileReference) {
        success(file3);
        return;
      }
      onload(file3, success, error2);
    });
    loader.setSource(source);
    state2.activeLoader = loader;
    loader.load();
  };
  const retryLoad = () => {
    if (!state2.activeLoader) {
      return;
    }
    state2.activeLoader.load();
  };
  const abortLoad = () => {
    if (state2.activeLoader) {
      state2.activeLoader.abort();
      return;
    }
    setStatus(ItemStatus.INIT);
    fire("load-abort");
  };
  const process = (processor, onprocess) => {
    if (state2.processingAborted) {
      state2.processingAborted = false;
      return;
    }
    setStatus(ItemStatus.PROCESSING);
    abortProcessingRequestComplete = null;
    if (!(state2.file instanceof Blob)) {
      api.on("load", () => {
        process(processor, onprocess);
      });
      return;
    }
    processor.on("load", (serverFileReference2) => {
      state2.transferId = null;
      state2.serverFileReference = serverFileReference2;
    });
    processor.on("transfer", (transferId) => {
      state2.transferId = transferId;
    });
    processor.on("load-perceived", (serverFileReference2) => {
      state2.activeProcessor = null;
      state2.transferId = null;
      state2.serverFileReference = serverFileReference2;
      setStatus(ItemStatus.PROCESSING_COMPLETE);
      fire("process-complete", serverFileReference2);
    });
    processor.on("start", () => {
      fire("process-start");
    });
    processor.on("error", (error3) => {
      state2.activeProcessor = null;
      setStatus(ItemStatus.PROCESSING_ERROR);
      fire("process-error", error3);
    });
    processor.on("abort", (serverFileReference2) => {
      state2.activeProcessor = null;
      state2.serverFileReference = serverFileReference2;
      setStatus(ItemStatus.IDLE);
      fire("process-abort");
      if (abortProcessingRequestComplete) {
        abortProcessingRequestComplete();
      }
    });
    processor.on("progress", (progress) => {
      fire("process-progress", progress);
    });
    const success = (file3) => {
      if (state2.archived) return;
      processor.process(file3, { ...metadata });
    };
    const error2 = console.error;
    onprocess(state2.file, success, error2);
    state2.activeProcessor = processor;
  };
  const requestProcessing = () => {
    state2.processingAborted = false;
    setStatus(ItemStatus.PROCESSING_QUEUED);
  };
  const abortProcessing = () => new Promise((resolve) => {
    if (!state2.activeProcessor) {
      state2.processingAborted = true;
      setStatus(ItemStatus.IDLE);
      fire("process-abort");
      resolve();
      return;
    }
    abortProcessingRequestComplete = () => {
      resolve();
    };
    state2.activeProcessor.abort();
  });
  const revert = (revertFileUpload, forceRevert) => new Promise((resolve, reject) => {
    const serverTransferId = state2.serverFileReference !== null ? state2.serverFileReference : state2.transferId;
    if (serverTransferId === null) {
      resolve();
      return;
    }
    revertFileUpload(
      serverTransferId,
      () => {
        state2.serverFileReference = null;
        state2.transferId = null;
        resolve();
      },
      (error2) => {
        if (!forceRevert) {
          resolve();
          return;
        }
        setStatus(ItemStatus.PROCESSING_REVERT_ERROR);
        fire("process-revert-error");
        reject(error2);
      }
    );
    setStatus(ItemStatus.IDLE);
    fire("process-revert");
  });
  const setMetadata = (key, value, silent) => {
    const keys = key.split(".");
    const root2 = keys[0];
    const last = keys.pop();
    let data2 = metadata;
    keys.forEach((key2) => data2 = data2[key2]);
    if (JSON.stringify(data2[last]) === JSON.stringify(value)) return;
    data2[last] = value;
    fire("metadata-update", {
      key: root2,
      value: metadata[root2],
      silent
    });
  };
  const getMetadata = (key) => deepCloneObject(key ? metadata[key] : metadata);
  const api = {
    id: { get: () => id },
    origin: { get: () => origin, set: (value) => origin = value },
    serverId: { get: () => state2.serverFileReference },
    transferId: { get: () => state2.transferId },
    status: { get: () => state2.status },
    filename: { get: () => state2.file.name },
    filenameWithoutExtension: { get: () => getFilenameWithoutExtension(state2.file.name) },
    fileExtension: { get: getFileExtension },
    fileType: { get: getFileType },
    fileSize: { get: getFileSize },
    file: { get: getFile },
    relativePath: { get: () => state2.file._relativePath },
    source: { get: () => state2.source },
    getMetadata,
    setMetadata: (key, value, silent) => {
      if (isObject(key)) {
        const data2 = key;
        Object.keys(data2).forEach((key2) => {
          setMetadata(key2, data2[key2], value);
        });
        return key;
      }
      setMetadata(key, value, silent);
      return value;
    },
    extend: (name2, handler) => itemAPI[name2] = handler,
    abortLoad,
    retryLoad,
    requestProcessing,
    abortProcessing,
    load,
    process,
    revert,
    ...on(),
    freeze: () => state2.frozen = true,
    release: () => state2.released = true,
    released: { get: () => state2.released },
    archive: () => state2.archived = true,
    archived: { get: () => state2.archived },
    // replace source and file object
    setFile: (file3) => state2.file = file3
  };
  const itemAPI = createObject(api);
  return itemAPI;
};
var getItemIndexByQuery = (items, query) => {
  if (isEmpty(query)) {
    return 0;
  }
  if (!isString(query)) {
    return -1;
  }
  return items.findIndex((item2) => item2.id === query);
};
var getItemById = (items, itemId) => {
  const index = getItemIndexByQuery(items, itemId);
  if (index < 0) {
    return;
  }
  return items[index] || null;
};
var fetchBlob = (url, load, error2, progress, abort, headers) => {
  const request = sendRequest(null, url, {
    method: "GET",
    responseType: "blob"
  });
  request.onload = (xhr) => {
    const headers2 = xhr.getAllResponseHeaders();
    const filename = getFileInfoFromHeaders(headers2).name || getFilenameFromURL(url);
    load(createResponse("load", xhr.status, getFileFromBlob(xhr.response, filename), headers2));
  };
  request.onerror = (xhr) => {
    error2(createResponse("error", xhr.status, xhr.statusText, xhr.getAllResponseHeaders()));
  };
  request.onheaders = (xhr) => {
    headers(createResponse("headers", xhr.status, null, xhr.getAllResponseHeaders()));
  };
  request.ontimeout = createTimeoutResponse(error2);
  request.onprogress = progress;
  request.onabort = abort;
  return request;
};
var getDomainFromURL = (url) => {
  if (url.indexOf("//") === 0) {
    url = location.protocol + url;
  }
  return url.toLowerCase().replace("blob:", "").replace(/([a-z])?:\/\//, "$1").split("/")[0];
};
var isExternalURL = (url) => (url.indexOf(":") > -1 || url.indexOf("//") > -1) && getDomainFromURL(location.href) !== getDomainFromURL(url);
var dynamicLabel = (label) => (...params) => isFunction(label) ? label(...params) : label;
var isMockItem = (item2) => !isFile(item2.file);
var listUpdated = (dispatch, state2) => {
  clearTimeout(state2.listUpdateTimeout);
  state2.listUpdateTimeout = setTimeout(() => {
    dispatch("DID_UPDATE_ITEMS", { items: getActiveItems(state2.items) });
  }, 0);
};
var optionalPromise = (fn2, ...params) => new Promise((resolve) => {
  if (!fn2) {
    return resolve(true);
  }
  const result = fn2(...params);
  if (result == null) {
    return resolve(true);
  }
  if (typeof result === "boolean") {
    return resolve(result);
  }
  if (typeof result.then === "function") {
    result.then(resolve);
  }
});
var sortItems = (state2, compare) => {
  state2.items.sort((a, b) => compare(createItemAPI(a), createItemAPI(b)));
};
var getItemByQueryFromState = (state2, itemHandler) => ({
  query,
  success = () => {
  },
  failure = () => {
  },
  ...options
} = {}) => {
  const item2 = getItemByQuery(state2.items, query);
  if (!item2) {
    failure({
      error: createResponse("error", 0, "Item not found"),
      file: null
    });
    return;
  }
  itemHandler(item2, success, failure, options || {});
};
var actions = (dispatch, query, state2) => ({
  /**
   * Aborts all ongoing processes
   */
  ABORT_ALL: () => {
    getActiveItems(state2.items).forEach((item2) => {
      item2.freeze();
      item2.abortLoad();
      item2.abortProcessing();
    });
  },
  /**
   * Sets initial files
   */
  DID_SET_FILES: ({ value = [] }) => {
    const files = value.map((file2) => ({
      source: file2.source ? file2.source : file2,
      options: file2.options
    }));
    let activeItems = getActiveItems(state2.items);
    activeItems.forEach((item2) => {
      if (!files.find((file2) => file2.source === item2.source || file2.source === item2.file)) {
        dispatch("REMOVE_ITEM", { query: item2, remove: false });
      }
    });
    activeItems = getActiveItems(state2.items);
    files.forEach((file2, index) => {
      if (activeItems.find((item2) => item2.source === file2.source || item2.file === file2.source))
        return;
      dispatch("ADD_ITEM", {
        ...file2,
        interactionMethod: InteractionMethod.NONE,
        index
      });
    });
  },
  DID_UPDATE_ITEM_METADATA: ({ id, action, change }) => {
    if (change.silent) return;
    clearTimeout(state2.itemUpdateTimeout);
    state2.itemUpdateTimeout = setTimeout(() => {
      const item2 = getItemById(state2.items, id);
      if (!query("IS_ASYNC")) {
        applyFilterChain("SHOULD_PREPARE_OUTPUT", false, {
          item: item2,
          query,
          action,
          change
        }).then((shouldPrepareOutput) => {
          const beforePrepareFile = query("GET_BEFORE_PREPARE_FILE");
          if (beforePrepareFile)
            shouldPrepareOutput = beforePrepareFile(item2, shouldPrepareOutput);
          if (!shouldPrepareOutput) return;
          dispatch(
            "REQUEST_PREPARE_OUTPUT",
            {
              query: id,
              item: item2,
              success: (file2) => {
                dispatch("DID_PREPARE_OUTPUT", { id, file: file2 });
              }
            },
            true
          );
        });
        return;
      }
      if (item2.origin === FileOrigin.LOCAL) {
        dispatch("DID_LOAD_ITEM", {
          id: item2.id,
          error: null,
          serverFileReference: item2.source
        });
      }
      const upload = () => {
        setTimeout(() => {
          dispatch("REQUEST_ITEM_PROCESSING", { query: id });
        }, 32);
      };
      const revert = (doUpload) => {
        item2.revert(
          createRevertFunction(state2.options.server.url, state2.options.server.revert),
          query("GET_FORCE_REVERT")
        ).then(doUpload ? upload : () => {
        }).catch(() => {
        });
      };
      const abort = (doUpload) => {
        item2.abortProcessing().then(doUpload ? upload : () => {
        });
      };
      if (item2.status === ItemStatus.PROCESSING_COMPLETE) {
        return revert(state2.options.instantUpload);
      }
      if (item2.status === ItemStatus.PROCESSING) {
        return abort(state2.options.instantUpload);
      }
      if (state2.options.instantUpload) {
        upload();
      }
    }, 0);
  },
  MOVE_ITEM: ({ query: query2, index }) => {
    const item2 = getItemByQuery(state2.items, query2);
    if (!item2) return;
    const currentIndex = state2.items.indexOf(item2);
    index = limit(index, 0, state2.items.length - 1);
    if (currentIndex === index) return;
    state2.items.splice(index, 0, state2.items.splice(currentIndex, 1)[0]);
  },
  SORT: ({ compare }) => {
    sortItems(state2, compare);
    dispatch("DID_SORT_ITEMS", {
      items: query("GET_ACTIVE_ITEMS")
    });
  },
  ADD_ITEMS: ({ items, index, interactionMethod, success = () => {
  }, failure = () => {
  } }) => {
    let currentIndex = index;
    if (index === -1 || typeof index === "undefined") {
      const insertLocation = query("GET_ITEM_INSERT_LOCATION");
      const totalItems = query("GET_TOTAL_ITEMS");
      currentIndex = insertLocation === "before" ? 0 : totalItems;
    }
    const ignoredFiles = query("GET_IGNORED_FILES");
    const isValidFile = (source) => isFile(source) ? !ignoredFiles.includes(source.name.toLowerCase()) : !isEmpty(source);
    const validItems = items.filter(isValidFile);
    const promises = validItems.map(
      (source) => new Promise((resolve, reject) => {
        dispatch("ADD_ITEM", {
          interactionMethod,
          source: source.source || source,
          success: resolve,
          failure: reject,
          index: currentIndex++,
          options: source.options || {}
        });
      })
    );
    Promise.all(promises).then(success).catch(failure);
  },
  /**
   * @param source
   * @param index
   * @param interactionMethod
   */
  ADD_ITEM: ({
    source,
    index = -1,
    interactionMethod,
    success = () => {
    },
    failure = () => {
    },
    options = {}
  }) => {
    if (isEmpty(source)) {
      failure({
        error: createResponse("error", 0, "No source"),
        file: null
      });
      return;
    }
    if (isFile(source) && state2.options.ignoredFiles.includes(source.name.toLowerCase())) {
      return;
    }
    if (!hasRoomForItem(state2)) {
      if (state2.options.allowMultiple || !state2.options.allowMultiple && !state2.options.allowReplace) {
        const error2 = createResponse("warning", 0, "Max files");
        dispatch("DID_THROW_MAX_FILES", {
          source,
          error: error2
        });
        failure({ error: error2, file: null });
        return;
      }
      const item3 = getActiveItems(state2.items)[0];
      if (item3.status === ItemStatus.PROCESSING_COMPLETE || item3.status === ItemStatus.PROCESSING_REVERT_ERROR) {
        const forceRevert = query("GET_FORCE_REVERT");
        item3.revert(
          createRevertFunction(state2.options.server.url, state2.options.server.revert),
          forceRevert
        ).then(() => {
          if (!forceRevert) return;
          dispatch("ADD_ITEM", {
            source,
            index,
            interactionMethod,
            success,
            failure,
            options
          });
        }).catch(() => {
        });
        if (forceRevert) return;
      }
      dispatch("REMOVE_ITEM", { query: item3.id });
    }
    const origin = options.type === "local" ? FileOrigin.LOCAL : options.type === "limbo" ? FileOrigin.LIMBO : FileOrigin.INPUT;
    const item2 = createItem(
      // where did this file come from
      origin,
      // an input file never has a server file reference
      origin === FileOrigin.INPUT ? null : source,
      // file mock data, if defined
      options.file
    );
    Object.keys(options.metadata || {}).forEach((key) => {
      item2.setMetadata(key, options.metadata[key]);
    });
    applyFilters("DID_CREATE_ITEM", item2, { query, dispatch });
    const itemInsertLocation = query("GET_ITEM_INSERT_LOCATION");
    if (!state2.options.itemInsertLocationFreedom) {
      index = itemInsertLocation === "before" ? -1 : state2.items.length;
    }
    insertItem(state2.items, item2, index);
    if (isFunction(itemInsertLocation) && source) {
      sortItems(state2, itemInsertLocation);
    }
    const id = item2.id;
    item2.on("init", () => {
      dispatch("DID_INIT_ITEM", { id });
    });
    item2.on("load-init", () => {
      dispatch("DID_START_ITEM_LOAD", { id });
    });
    item2.on("load-meta", () => {
      dispatch("DID_UPDATE_ITEM_META", { id });
    });
    item2.on("load-progress", (progress) => {
      dispatch("DID_UPDATE_ITEM_LOAD_PROGRESS", { id, progress });
    });
    item2.on("load-request-error", (error2) => {
      const mainStatus = dynamicLabel(state2.options.labelFileLoadError)(error2);
      if (error2.code >= 400 && error2.code < 500) {
        dispatch("DID_THROW_ITEM_INVALID", {
          id,
          error: error2,
          status: {
            main: mainStatus,
            sub: `${error2.code} (${error2.body})`
          }
        });
        failure({ error: error2, file: createItemAPI(item2) });
        return;
      }
      dispatch("DID_THROW_ITEM_LOAD_ERROR", {
        id,
        error: error2,
        status: {
          main: mainStatus,
          sub: state2.options.labelTapToRetry
        }
      });
    });
    item2.on("load-file-error", (error2) => {
      dispatch("DID_THROW_ITEM_INVALID", {
        id,
        error: error2.status,
        status: error2.status
      });
      failure({ error: error2.status, file: createItemAPI(item2) });
    });
    item2.on("load-abort", () => {
      dispatch("REMOVE_ITEM", { query: id });
    });
    item2.on("load-skip", () => {
      item2.on("metadata-update", (change) => {
        if (!isFile(item2.file)) return;
        dispatch("DID_UPDATE_ITEM_METADATA", { id, change });
      });
      dispatch("COMPLETE_LOAD_ITEM", {
        query: id,
        item: item2,
        data: {
          source,
          success
        }
      });
    });
    item2.on("load", () => {
      const handleAdd = (shouldAdd) => {
        if (!shouldAdd) {
          dispatch("REMOVE_ITEM", {
            query: id
          });
          return;
        }
        item2.on("metadata-update", (change) => {
          dispatch("DID_UPDATE_ITEM_METADATA", { id, change });
        });
        applyFilterChain("SHOULD_PREPARE_OUTPUT", false, { item: item2, query }).then(
          (shouldPrepareOutput) => {
            const beforePrepareFile = query("GET_BEFORE_PREPARE_FILE");
            if (beforePrepareFile)
              shouldPrepareOutput = beforePrepareFile(item2, shouldPrepareOutput);
            const loadComplete = () => {
              dispatch("COMPLETE_LOAD_ITEM", {
                query: id,
                item: item2,
                data: {
                  source,
                  success
                }
              });
              listUpdated(dispatch, state2);
            };
            if (shouldPrepareOutput) {
              dispatch(
                "REQUEST_PREPARE_OUTPUT",
                {
                  query: id,
                  item: item2,
                  success: (file2) => {
                    dispatch("DID_PREPARE_OUTPUT", { id, file: file2 });
                    loadComplete();
                  }
                },
                true
              );
              return;
            }
            loadComplete();
          }
        );
      };
      applyFilterChain("DID_LOAD_ITEM", item2, { query, dispatch }).then(() => {
        optionalPromise(query("GET_BEFORE_ADD_FILE"), createItemAPI(item2)).then(
          handleAdd
        );
      }).catch((e) => {
        if (!e || !e.error || !e.status) return handleAdd(false);
        dispatch("DID_THROW_ITEM_INVALID", {
          id,
          error: e.error,
          status: e.status
        });
      });
    });
    item2.on("process-start", () => {
      dispatch("DID_START_ITEM_PROCESSING", { id });
    });
    item2.on("process-progress", (progress) => {
      dispatch("DID_UPDATE_ITEM_PROCESS_PROGRESS", { id, progress });
    });
    item2.on("process-error", (error2) => {
      dispatch("DID_THROW_ITEM_PROCESSING_ERROR", {
        id,
        error: error2,
        status: {
          main: dynamicLabel(state2.options.labelFileProcessingError)(error2),
          sub: state2.options.labelTapToRetry
        }
      });
    });
    item2.on("process-revert-error", (error2) => {
      dispatch("DID_THROW_ITEM_PROCESSING_REVERT_ERROR", {
        id,
        error: error2,
        status: {
          main: dynamicLabel(state2.options.labelFileProcessingRevertError)(error2),
          sub: state2.options.labelTapToRetry
        }
      });
    });
    item2.on("process-complete", (serverFileReference) => {
      dispatch("DID_COMPLETE_ITEM_PROCESSING", {
        id,
        error: null,
        serverFileReference
      });
      dispatch("DID_DEFINE_VALUE", { id, value: serverFileReference });
    });
    item2.on("process-abort", () => {
      dispatch("DID_ABORT_ITEM_PROCESSING", { id });
    });
    item2.on("process-revert", () => {
      dispatch("DID_REVERT_ITEM_PROCESSING", { id });
      dispatch("DID_DEFINE_VALUE", { id, value: null });
    });
    dispatch("DID_ADD_ITEM", { id, index, interactionMethod });
    listUpdated(dispatch, state2);
    const { url, load, restore, fetch } = state2.options.server || {};
    item2.load(
      source,
      // this creates a function that loads the file based on the type of file (string, base64, blob, file) and location of file (local, remote, limbo)
      createFileLoader(
        origin === FileOrigin.INPUT ? (
          // input, if is remote, see if should use custom fetch, else use default fetchBlob
          isString(source) && isExternalURL(source) ? fetch ? createFetchFunction(url, fetch) : fetchBlob : fetchBlob
        ) : (
          // limbo or local
          origin === FileOrigin.LIMBO ? createFetchFunction(url, restore) : createFetchFunction(url, load)
        )
        // local
      ),
      // called when the file is loaded so it can be piped through the filters
      (file2, success2, error2) => {
        applyFilterChain("LOAD_FILE", file2, { query }).then(success2).catch(error2);
      }
    );
  },
  REQUEST_PREPARE_OUTPUT: ({ item: item2, success, failure = () => {
  } }) => {
    const err = {
      error: createResponse("error", 0, "Item not found"),
      file: null
    };
    if (item2.archived) return failure(err);
    applyFilterChain("PREPARE_OUTPUT", item2.file, { query, item: item2 }).then((result) => {
      applyFilterChain("COMPLETE_PREPARE_OUTPUT", result, { query, item: item2 }).then((result2) => {
        if (item2.archived) return failure(err);
        success(result2);
      });
    });
  },
  COMPLETE_LOAD_ITEM: ({ item: item2, data: data2 }) => {
    const { success, source } = data2;
    const itemInsertLocation = query("GET_ITEM_INSERT_LOCATION");
    if (isFunction(itemInsertLocation) && source) {
      sortItems(state2, itemInsertLocation);
    }
    dispatch("DID_LOAD_ITEM", {
      id: item2.id,
      error: null,
      serverFileReference: item2.origin === FileOrigin.INPUT ? null : source
    });
    success(createItemAPI(item2));
    if (item2.origin === FileOrigin.LOCAL) {
      dispatch("DID_LOAD_LOCAL_ITEM", { id: item2.id });
      return;
    }
    if (item2.origin === FileOrigin.LIMBO) {
      dispatch("DID_COMPLETE_ITEM_PROCESSING", {
        id: item2.id,
        error: null,
        serverFileReference: source
      });
      dispatch("DID_DEFINE_VALUE", {
        id: item2.id,
        value: item2.serverId || source
      });
      return;
    }
    if (query("IS_ASYNC") && state2.options.instantUpload) {
      dispatch("REQUEST_ITEM_PROCESSING", { query: item2.id });
    }
  },
  RETRY_ITEM_LOAD: getItemByQueryFromState(state2, (item2) => {
    item2.retryLoad();
  }),
  REQUEST_ITEM_PREPARE: getItemByQueryFromState(state2, (item2, success, failure) => {
    dispatch(
      "REQUEST_PREPARE_OUTPUT",
      {
        query: item2.id,
        item: item2,
        success: (file2) => {
          dispatch("DID_PREPARE_OUTPUT", { id: item2.id, file: file2 });
          success({
            file: item2,
            output: file2
          });
        },
        failure
      },
      true
    );
  }),
  REQUEST_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2, success, failure) => {
    const itemCanBeQueuedForProcessing = (
      // waiting for something
      item2.status === ItemStatus.IDLE || // processing went wrong earlier
      item2.status === ItemStatus.PROCESSING_ERROR
    );
    if (!itemCanBeQueuedForProcessing) {
      const processNow = () => dispatch("REQUEST_ITEM_PROCESSING", { query: item2, success, failure });
      const process = () => document.hidden ? processNow() : setTimeout(processNow, 32);
      if (item2.status === ItemStatus.PROCESSING_COMPLETE || item2.status === ItemStatus.PROCESSING_REVERT_ERROR) {
        item2.revert(
          createRevertFunction(state2.options.server.url, state2.options.server.revert),
          query("GET_FORCE_REVERT")
        ).then(process).catch(() => {
        });
      } else if (item2.status === ItemStatus.PROCESSING) {
        item2.abortProcessing().then(process);
      }
      return;
    }
    if (item2.status === ItemStatus.PROCESSING_QUEUED) return;
    item2.requestProcessing();
    dispatch("DID_REQUEST_ITEM_PROCESSING", { id: item2.id });
    dispatch("PROCESS_ITEM", { query: item2, success, failure }, true);
  }),
  PROCESS_ITEM: getItemByQueryFromState(state2, (item2, success, failure) => {
    const maxParallelUploads = query("GET_MAX_PARALLEL_UPLOADS");
    const totalCurrentUploads = query("GET_ITEMS_BY_STATUS", ItemStatus.PROCESSING).length;
    if (totalCurrentUploads === maxParallelUploads) {
      state2.processingQueue.push({
        id: item2.id,
        success,
        failure
      });
      return;
    }
    if (item2.status === ItemStatus.PROCESSING) return;
    const processNext = () => {
      const queueEntry = state2.processingQueue.shift();
      if (!queueEntry) return;
      const { id, success: success2, failure: failure2 } = queueEntry;
      const itemReference = getItemByQuery(state2.items, id);
      if (!itemReference || itemReference.archived) {
        processNext();
        return;
      }
      dispatch("PROCESS_ITEM", { query: id, success: success2, failure: failure2 }, true);
    };
    item2.onOnce("process-complete", () => {
      success(createItemAPI(item2));
      processNext();
      const server = state2.options.server;
      const instantUpload = state2.options.instantUpload;
      if (instantUpload && item2.origin === FileOrigin.LOCAL && isFunction(server.remove)) {
        const noop = () => {
        };
        item2.origin = FileOrigin.LIMBO;
        state2.options.server.remove(item2.source, noop, noop);
      }
      const allItemsProcessed = query("GET_ITEMS_BY_STATUS", ItemStatus.PROCESSING_COMPLETE).length === state2.items.length;
      if (allItemsProcessed) {
        dispatch("DID_COMPLETE_ITEM_PROCESSING_ALL");
      }
    });
    item2.onOnce("process-error", (error2) => {
      failure({ error: error2, file: createItemAPI(item2) });
      processNext();
    });
    item2.onOnce("process-abort", () => {
      processNext();
    });
    const options = state2.options;
    item2.process(
      createFileProcessor(
        createProcessorFunction(options.server.url, options.server.process, options.name, {
          chunkTransferId: item2.transferId,
          chunkServer: options.server.patch,
          chunkUploads: options.chunkUploads,
          chunkForce: options.chunkForce,
          chunkSize: options.chunkSize,
          chunkRetryDelays: options.chunkRetryDelays
        }),
        {
          allowMinimumUploadDuration: query("GET_ALLOW_MINIMUM_UPLOAD_DURATION")
        }
      ),
      // called when the file is about to be processed so it can be piped through the transform filters
      (file2, success2, error2) => {
        applyFilterChain("PREPARE_OUTPUT", file2, { query, item: item2 }).then((file3) => {
          dispatch("DID_PREPARE_OUTPUT", { id: item2.id, file: file3 });
          success2(file3);
        }).catch(error2);
      }
    );
  }),
  RETRY_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
    dispatch("REQUEST_ITEM_PROCESSING", { query: item2 });
  }),
  REQUEST_REMOVE_ITEM: getItemByQueryFromState(state2, (item2) => {
    optionalPromise(query("GET_BEFORE_REMOVE_FILE"), createItemAPI(item2)).then((shouldRemove) => {
      if (!shouldRemove) {
        return;
      }
      dispatch("REMOVE_ITEM", { query: item2 });
    });
  }),
  RELEASE_ITEM: getItemByQueryFromState(state2, (item2) => {
    item2.release();
  }),
  REMOVE_ITEM: getItemByQueryFromState(state2, (item2, success, failure, options) => {
    const removeFromView = () => {
      const id = item2.id;
      getItemById(state2.items, id).archive();
      dispatch("DID_REMOVE_ITEM", { error: null, id, item: item2 });
      listUpdated(dispatch, state2);
      success(createItemAPI(item2));
    };
    const server = state2.options.server;
    if (item2.origin === FileOrigin.LOCAL && server && isFunction(server.remove) && options.remove !== false) {
      dispatch("DID_START_ITEM_REMOVE", { id: item2.id });
      server.remove(
        item2.source,
        () => removeFromView(),
        (status) => {
          dispatch("DID_THROW_ITEM_REMOVE_ERROR", {
            id: item2.id,
            error: createResponse("error", 0, status, null),
            status: {
              main: dynamicLabel(state2.options.labelFileRemoveError)(status),
              sub: state2.options.labelTapToRetry
            }
          });
        }
      );
    } else {
      if (options.revert && item2.origin !== FileOrigin.LOCAL && item2.serverId !== null || // if chunked uploads are enabled and we're uploading in chunks for this specific file
      // or if the file isn't big enough for chunked uploads but chunkForce is set then call
      // revert before removing from the view...
      state2.options.chunkUploads && item2.file.size > state2.options.chunkSize || state2.options.chunkUploads && state2.options.chunkForce) {
        item2.revert(
          createRevertFunction(state2.options.server.url, state2.options.server.revert),
          query("GET_FORCE_REVERT")
        );
      }
      removeFromView();
    }
  }),
  ABORT_ITEM_LOAD: getItemByQueryFromState(state2, (item2) => {
    item2.abortLoad();
  }),
  ABORT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
    if (item2.serverId) {
      dispatch("REVERT_ITEM_PROCESSING", { id: item2.id });
      return;
    }
    item2.abortProcessing().then(() => {
      const shouldRemove = state2.options.instantUpload;
      if (shouldRemove) {
        dispatch("REMOVE_ITEM", { query: item2.id });
      }
    });
  }),
  REQUEST_REVERT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
    if (!state2.options.instantUpload) {
      dispatch("REVERT_ITEM_PROCESSING", { query: item2 });
      return;
    }
    const handleRevert = (shouldRevert) => {
      if (!shouldRevert) return;
      dispatch("REVERT_ITEM_PROCESSING", { query: item2 });
    };
    const fn2 = query("GET_BEFORE_REMOVE_FILE");
    if (!fn2) {
      return handleRevert(true);
    }
    const requestRemoveResult = fn2(createItemAPI(item2));
    if (requestRemoveResult == null) {
      return handleRevert(true);
    }
    if (typeof requestRemoveResult === "boolean") {
      return handleRevert(requestRemoveResult);
    }
    if (typeof requestRemoveResult.then === "function") {
      requestRemoveResult.then(handleRevert);
    }
  }),
  REVERT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
    item2.revert(
      createRevertFunction(state2.options.server.url, state2.options.server.revert),
      query("GET_FORCE_REVERT")
    ).then(() => {
      const shouldRemove = state2.options.instantUpload || isMockItem(item2);
      if (shouldRemove) {
        dispatch("REMOVE_ITEM", { query: item2.id });
      }
    }).catch(() => {
    });
  }),
  SET_OPTIONS: ({ options }) => {
    const optionKeys = Object.keys(options);
    const prioritizedOptionKeys = PrioritizedOptions.filter((key) => optionKeys.includes(key));
    const orderedOptionKeys = [
      // add prioritized first if passed to options, else remove
      ...prioritizedOptionKeys,
      // prevent duplicate keys
      ...Object.keys(options).filter((key) => !prioritizedOptionKeys.includes(key))
    ];
    orderedOptionKeys.forEach((key) => {
      dispatch(`SET_${fromCamels(key, "_").toUpperCase()}`, {
        value: options[key]
      });
    });
  }
});
var PrioritizedOptions = [
  "server"
  // must be processed before "files"
];
var formatFilename = (name2) => name2;
var createElement$1 = (tagName) => {
  return document.createElement(tagName);
};
var text = (node, value) => {
  let textNode = node.childNodes[0];
  if (!textNode) {
    textNode = document.createTextNode(value);
    node.appendChild(textNode);
  } else if (value !== textNode.nodeValue) {
    textNode.nodeValue = value;
  }
};
var polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees % 360 - 90) * Math.PI / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};
var describeArc = (x, y, radius, startAngle, endAngle, arcSweep) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  return ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y].join(" ");
};
var percentageArc = (x, y, radius, from, to) => {
  let arcSweep = 1;
  if (to > from && to - from <= 0.5) {
    arcSweep = 0;
  }
  if (from > to && from - to >= 0.5) {
    arcSweep = 0;
  }
  return describeArc(
    x,
    y,
    radius,
    Math.min(0.9999, from) * 360,
    Math.min(0.9999, to) * 360,
    arcSweep
  );
};
var create = ({ root: root2, props }) => {
  props.spin = false;
  props.progress = 0;
  props.opacity = 0;
  const svg = createElement("svg");
  root2.ref.path = createElement("path", {
    "stroke-width": 2,
    "stroke-linecap": "round"
  });
  svg.appendChild(root2.ref.path);
  root2.ref.svg = svg;
  root2.appendChild(svg);
};
var write = ({ root: root2, props }) => {
  if (props.opacity === 0) {
    return;
  }
  if (props.align) {
    root2.element.dataset.align = props.align;
  }
  const ringStrokeWidth = parseInt(attr(root2.ref.path, "stroke-width"), 10);
  const size = root2.rect.element.width * 0.5;
  let ringFrom = 0;
  let ringTo = 0;
  if (props.spin) {
    ringFrom = 0;
    ringTo = 0.5;
  } else {
    ringFrom = 0;
    ringTo = props.progress;
  }
  const coordinates = percentageArc(size, size, size - ringStrokeWidth, ringFrom, ringTo);
  attr(root2.ref.path, "d", coordinates);
  attr(root2.ref.path, "stroke-opacity", props.spin || props.progress > 0 ? 1 : 0);
};
var progressIndicator = createView({
  tag: "div",
  name: "progress-indicator",
  ignoreRectUpdate: true,
  ignoreRect: true,
  create,
  write,
  mixins: {
    apis: ["progress", "spin", "align"],
    styles: ["opacity"],
    animations: {
      opacity: { type: "tween", duration: 500 },
      progress: {
        type: "spring",
        stiffness: 0.95,
        damping: 0.65,
        mass: 10
      }
    }
  }
});
var create$1 = ({ root: root2, props }) => {
  root2.element.innerHTML = (props.icon || "") + `<span>${props.label}</span>`;
  props.isDisabled = false;
};
var write$1 = ({ root: root2, props }) => {
  const { isDisabled } = props;
  const shouldDisable = root2.query("GET_DISABLED") || props.opacity === 0;
  if (shouldDisable && !isDisabled) {
    props.isDisabled = true;
    attr(root2.element, "disabled", "disabled");
  } else if (!shouldDisable && isDisabled) {
    props.isDisabled = false;
    root2.element.removeAttribute("disabled");
  }
};
var fileActionButton = createView({
  tag: "button",
  attributes: {
    type: "button"
  },
  ignoreRect: true,
  ignoreRectUpdate: true,
  name: "file-action-button",
  mixins: {
    apis: ["label"],
    styles: ["translateX", "translateY", "scaleX", "scaleY", "opacity"],
    animations: {
      scaleX: "spring",
      scaleY: "spring",
      translateX: "spring",
      translateY: "spring",
      opacity: { type: "tween", duration: 250 }
    },
    listeners: true
  },
  create: create$1,
  write: write$1
});
var toNaturalFileSize = (bytes, decimalSeparator = ".", base = 1e3, options = {}) => {
  const {
    labelBytes = "bytes",
    labelKilobytes = "KB",
    labelMegabytes = "MB",
    labelGigabytes = "GB"
  } = options;
  bytes = Math.round(Math.abs(bytes));
  const KB = base;
  const MB = base * base;
  const GB = base * base * base;
  if (bytes < KB) {
    return `${bytes} ${labelBytes}`;
  }
  if (bytes < MB) {
    return `${Math.floor(bytes / KB)} ${labelKilobytes}`;
  }
  if (bytes < GB) {
    return `${removeDecimalsWhenZero(bytes / MB, 1, decimalSeparator)} ${labelMegabytes}`;
  }
  return `${removeDecimalsWhenZero(bytes / GB, 2, decimalSeparator)} ${labelGigabytes}`;
};
var removeDecimalsWhenZero = (value, decimalCount, separator) => {
  return value.toFixed(decimalCount).split(".").filter((part) => part !== "0").join(separator);
};
var create$2 = ({ root: root2, props }) => {
  const fileName = createElement$1("span");
  fileName.className = "filepond--file-info-main";
  attr(fileName, "aria-hidden", "true");
  root2.appendChild(fileName);
  root2.ref.fileName = fileName;
  const fileSize = createElement$1("span");
  fileSize.className = "filepond--file-info-sub";
  root2.appendChild(fileSize);
  root2.ref.fileSize = fileSize;
  text(fileSize, root2.query("GET_LABEL_FILE_WAITING_FOR_SIZE"));
  text(fileName, formatFilename(root2.query("GET_ITEM_NAME", props.id)));
};
var updateFile = ({ root: root2, props }) => {
  text(
    root2.ref.fileSize,
    toNaturalFileSize(
      root2.query("GET_ITEM_SIZE", props.id),
      ".",
      root2.query("GET_FILE_SIZE_BASE"),
      root2.query("GET_FILE_SIZE_LABELS", root2.query)
    )
  );
  text(root2.ref.fileName, formatFilename(root2.query("GET_ITEM_NAME", props.id)));
};
var updateFileSizeOnError = ({ root: root2, props }) => {
  if (isInt(root2.query("GET_ITEM_SIZE", props.id))) {
    updateFile({ root: root2, props });
    return;
  }
  text(root2.ref.fileSize, root2.query("GET_LABEL_FILE_SIZE_NOT_AVAILABLE"));
};
var fileInfo = createView({
  name: "file-info",
  ignoreRect: true,
  ignoreRectUpdate: true,
  write: createRoute({
    DID_LOAD_ITEM: updateFile,
    DID_UPDATE_ITEM_META: updateFile,
    DID_THROW_ITEM_LOAD_ERROR: updateFileSizeOnError,
    DID_THROW_ITEM_INVALID: updateFileSizeOnError
  }),
  didCreateView: (root2) => {
    applyFilters("CREATE_VIEW", { ...root2, view: root2 });
  },
  create: create$2,
  mixins: {
    styles: ["translateX", "translateY"],
    animations: {
      translateX: "spring",
      translateY: "spring"
    }
  }
});
var toPercentage = (value) => Math.round(value * 100);
var create$3 = ({ root: root2 }) => {
  const main = createElement$1("span");
  main.className = "filepond--file-status-main";
  root2.appendChild(main);
  root2.ref.main = main;
  const sub = createElement$1("span");
  sub.className = "filepond--file-status-sub";
  root2.appendChild(sub);
  root2.ref.sub = sub;
  didSetItemLoadProgress({ root: root2, action: { progress: null } });
};
var didSetItemLoadProgress = ({ root: root2, action }) => {
  const title = action.progress === null ? root2.query("GET_LABEL_FILE_LOADING") : `${root2.query("GET_LABEL_FILE_LOADING")} ${toPercentage(action.progress)}%`;
  text(root2.ref.main, title);
  text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_CANCEL"));
};
var didSetItemProcessProgress = ({ root: root2, action }) => {
  const title = action.progress === null ? root2.query("GET_LABEL_FILE_PROCESSING") : `${root2.query("GET_LABEL_FILE_PROCESSING")} ${toPercentage(action.progress)}%`;
  text(root2.ref.main, title);
  text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_CANCEL"));
};
var didRequestItemProcessing = ({ root: root2 }) => {
  text(root2.ref.main, root2.query("GET_LABEL_FILE_PROCESSING"));
  text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_CANCEL"));
};
var didAbortItemProcessing = ({ root: root2 }) => {
  text(root2.ref.main, root2.query("GET_LABEL_FILE_PROCESSING_ABORTED"));
  text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_RETRY"));
};
var didCompleteItemProcessing = ({ root: root2 }) => {
  text(root2.ref.main, root2.query("GET_LABEL_FILE_PROCESSING_COMPLETE"));
  text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_UNDO"));
};
var clear = ({ root: root2 }) => {
  text(root2.ref.main, "");
  text(root2.ref.sub, "");
};
var error = ({ root: root2, action }) => {
  text(root2.ref.main, action.status.main);
  text(root2.ref.sub, action.status.sub);
};
var fileStatus = createView({
  name: "file-status",
  ignoreRect: true,
  ignoreRectUpdate: true,
  write: createRoute({
    DID_LOAD_ITEM: clear,
    DID_REVERT_ITEM_PROCESSING: clear,
    DID_REQUEST_ITEM_PROCESSING: didRequestItemProcessing,
    DID_ABORT_ITEM_PROCESSING: didAbortItemProcessing,
    DID_COMPLETE_ITEM_PROCESSING: didCompleteItemProcessing,
    DID_UPDATE_ITEM_PROCESS_PROGRESS: didSetItemProcessProgress,
    DID_UPDATE_ITEM_LOAD_PROGRESS: didSetItemLoadProgress,
    DID_THROW_ITEM_LOAD_ERROR: error,
    DID_THROW_ITEM_INVALID: error,
    DID_THROW_ITEM_PROCESSING_ERROR: error,
    DID_THROW_ITEM_PROCESSING_REVERT_ERROR: error,
    DID_THROW_ITEM_REMOVE_ERROR: error
  }),
  didCreateView: (root2) => {
    applyFilters("CREATE_VIEW", { ...root2, view: root2 });
  },
  create: create$3,
  mixins: {
    styles: ["translateX", "translateY", "opacity"],
    animations: {
      opacity: { type: "tween", duration: 250 },
      translateX: "spring",
      translateY: "spring"
    }
  }
});
var Buttons = {
  AbortItemLoad: {
    label: "GET_LABEL_BUTTON_ABORT_ITEM_LOAD",
    action: "ABORT_ITEM_LOAD",
    className: "filepond--action-abort-item-load",
    align: "LOAD_INDICATOR_POSITION"
    // right
  },
  RetryItemLoad: {
    label: "GET_LABEL_BUTTON_RETRY_ITEM_LOAD",
    action: "RETRY_ITEM_LOAD",
    icon: "GET_ICON_RETRY",
    className: "filepond--action-retry-item-load",
    align: "BUTTON_PROCESS_ITEM_POSITION"
    // right
  },
  RemoveItem: {
    label: "GET_LABEL_BUTTON_REMOVE_ITEM",
    action: "REQUEST_REMOVE_ITEM",
    icon: "GET_ICON_REMOVE",
    className: "filepond--action-remove-item",
    align: "BUTTON_REMOVE_ITEM_POSITION"
    // left
  },
  ProcessItem: {
    label: "GET_LABEL_BUTTON_PROCESS_ITEM",
    action: "REQUEST_ITEM_PROCESSING",
    icon: "GET_ICON_PROCESS",
    className: "filepond--action-process-item",
    align: "BUTTON_PROCESS_ITEM_POSITION"
    // right
  },
  AbortItemProcessing: {
    label: "GET_LABEL_BUTTON_ABORT_ITEM_PROCESSING",
    action: "ABORT_ITEM_PROCESSING",
    className: "filepond--action-abort-item-processing",
    align: "BUTTON_PROCESS_ITEM_POSITION"
    // right
  },
  RetryItemProcessing: {
    label: "GET_LABEL_BUTTON_RETRY_ITEM_PROCESSING",
    action: "RETRY_ITEM_PROCESSING",
    icon: "GET_ICON_RETRY",
    className: "filepond--action-retry-item-processing",
    align: "BUTTON_PROCESS_ITEM_POSITION"
    // right
  },
  RevertItemProcessing: {
    label: "GET_LABEL_BUTTON_UNDO_ITEM_PROCESSING",
    action: "REQUEST_REVERT_ITEM_PROCESSING",
    icon: "GET_ICON_UNDO",
    className: "filepond--action-revert-item-processing",
    align: "BUTTON_PROCESS_ITEM_POSITION"
    // right
  }
};
var ButtonKeys = [];
forin(Buttons, (key) => {
  ButtonKeys.push(key);
});
var calculateFileInfoOffset = (root2) => {
  if (getRemoveIndicatorAligment(root2) === "right") return 0;
  const buttonRect = root2.ref.buttonRemoveItem.rect.element;
  return buttonRect.hidden ? null : buttonRect.width + buttonRect.left;
};
var calculateButtonWidth = (root2) => {
  const buttonRect = root2.ref.buttonAbortItemLoad.rect.element;
  return buttonRect.width;
};
var calculateFileVerticalCenterOffset = (root2) => Math.floor(root2.ref.buttonRemoveItem.rect.element.height / 4);
var calculateFileHorizontalCenterOffset = (root2) => Math.floor(root2.ref.buttonRemoveItem.rect.element.left / 2);
var getLoadIndicatorAlignment = (root2) => root2.query("GET_STYLE_LOAD_INDICATOR_POSITION");
var getProcessIndicatorAlignment = (root2) => root2.query("GET_STYLE_PROGRESS_INDICATOR_POSITION");
var getRemoveIndicatorAligment = (root2) => root2.query("GET_STYLE_BUTTON_REMOVE_ITEM_POSITION");
var DefaultStyle = {
  buttonAbortItemLoad: { opacity: 0 },
  buttonRetryItemLoad: { opacity: 0 },
  buttonRemoveItem: { opacity: 0 },
  buttonProcessItem: { opacity: 0 },
  buttonAbortItemProcessing: { opacity: 0 },
  buttonRetryItemProcessing: { opacity: 0 },
  buttonRevertItemProcessing: { opacity: 0 },
  loadProgressIndicator: { opacity: 0, align: getLoadIndicatorAlignment },
  processProgressIndicator: { opacity: 0, align: getProcessIndicatorAlignment },
  processingCompleteIndicator: { opacity: 0, scaleX: 0.75, scaleY: 0.75 },
  info: { translateX: 0, translateY: 0, opacity: 0 },
  status: { translateX: 0, translateY: 0, opacity: 0 }
};
var IdleStyle = {
  buttonRemoveItem: { opacity: 1 },
  buttonProcessItem: { opacity: 1 },
  info: { translateX: calculateFileInfoOffset },
  status: { translateX: calculateFileInfoOffset }
};
var ProcessingStyle = {
  buttonAbortItemProcessing: { opacity: 1 },
  processProgressIndicator: { opacity: 1 },
  status: { opacity: 1 }
};
var StyleMap = {
  DID_THROW_ITEM_INVALID: {
    buttonRemoveItem: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset },
    status: { translateX: calculateFileInfoOffset, opacity: 1 }
  },
  DID_START_ITEM_LOAD: {
    buttonAbortItemLoad: { opacity: 1 },
    loadProgressIndicator: { opacity: 1 },
    status: { opacity: 1 }
  },
  DID_THROW_ITEM_LOAD_ERROR: {
    buttonRetryItemLoad: { opacity: 1 },
    buttonRemoveItem: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset },
    status: { opacity: 1 }
  },
  DID_START_ITEM_REMOVE: {
    processProgressIndicator: { opacity: 1, align: getRemoveIndicatorAligment },
    info: { translateX: calculateFileInfoOffset },
    status: { opacity: 0 }
  },
  DID_THROW_ITEM_REMOVE_ERROR: {
    processProgressIndicator: { opacity: 0, align: getRemoveIndicatorAligment },
    buttonRemoveItem: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset },
    status: { opacity: 1, translateX: calculateFileInfoOffset }
  },
  DID_LOAD_ITEM: IdleStyle,
  DID_LOAD_LOCAL_ITEM: {
    buttonRemoveItem: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset },
    status: { translateX: calculateFileInfoOffset }
  },
  DID_START_ITEM_PROCESSING: ProcessingStyle,
  DID_REQUEST_ITEM_PROCESSING: ProcessingStyle,
  DID_UPDATE_ITEM_PROCESS_PROGRESS: ProcessingStyle,
  DID_COMPLETE_ITEM_PROCESSING: {
    buttonRevertItemProcessing: { opacity: 1 },
    info: { opacity: 1 },
    status: { opacity: 1 }
  },
  DID_THROW_ITEM_PROCESSING_ERROR: {
    buttonRemoveItem: { opacity: 1 },
    buttonRetryItemProcessing: { opacity: 1 },
    status: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset }
  },
  DID_THROW_ITEM_PROCESSING_REVERT_ERROR: {
    buttonRevertItemProcessing: { opacity: 1 },
    status: { opacity: 1 },
    info: { opacity: 1 }
  },
  DID_ABORT_ITEM_PROCESSING: {
    buttonRemoveItem: { opacity: 1 },
    buttonProcessItem: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset },
    status: { opacity: 1 }
  },
  DID_REVERT_ITEM_PROCESSING: IdleStyle
};
var processingCompleteIndicatorView = createView({
  create: ({ root: root2 }) => {
    root2.element.innerHTML = root2.query("GET_ICON_DONE");
  },
  name: "processing-complete-indicator",
  ignoreRect: true,
  mixins: {
    styles: ["scaleX", "scaleY", "opacity"],
    animations: {
      scaleX: "spring",
      scaleY: "spring",
      opacity: { type: "tween", duration: 250 }
    }
  }
});
var create$4 = ({ root: root2, props }) => {
  const LocalButtons = Object.keys(Buttons).reduce((prev, curr) => {
    prev[curr] = { ...Buttons[curr] };
    return prev;
  }, {});
  const { id } = props;
  const allowRevert = root2.query("GET_ALLOW_REVERT");
  const allowRemove = root2.query("GET_ALLOW_REMOVE");
  const allowProcess = root2.query("GET_ALLOW_PROCESS");
  const instantUpload = root2.query("GET_INSTANT_UPLOAD");
  const isAsync2 = root2.query("IS_ASYNC");
  const alignRemoveItemButton = root2.query("GET_STYLE_BUTTON_REMOVE_ITEM_ALIGN");
  let buttonFilter;
  if (isAsync2) {
    if (allowProcess && !allowRevert) {
      buttonFilter = (key) => !/RevertItemProcessing/.test(key);
    } else if (!allowProcess && allowRevert) {
      buttonFilter = (key) => !/ProcessItem|RetryItemProcessing|AbortItemProcessing/.test(key);
    } else if (!allowProcess && !allowRevert) {
      buttonFilter = (key) => !/Process/.test(key);
    }
  } else {
    buttonFilter = (key) => !/Process/.test(key);
  }
  const enabledButtons = buttonFilter ? ButtonKeys.filter(buttonFilter) : ButtonKeys.concat();
  if (instantUpload && allowRevert) {
    LocalButtons["RevertItemProcessing"].label = "GET_LABEL_BUTTON_REMOVE_ITEM";
    LocalButtons["RevertItemProcessing"].icon = "GET_ICON_REMOVE";
  }
  if (isAsync2 && !allowRevert) {
    const map2 = StyleMap["DID_COMPLETE_ITEM_PROCESSING"];
    map2.info.translateX = calculateFileHorizontalCenterOffset;
    map2.info.translateY = calculateFileVerticalCenterOffset;
    map2.status.translateY = calculateFileVerticalCenterOffset;
    map2.processingCompleteIndicator = { opacity: 1, scaleX: 1, scaleY: 1 };
  }
  if (isAsync2 && !allowProcess) {
    [
      "DID_START_ITEM_PROCESSING",
      "DID_REQUEST_ITEM_PROCESSING",
      "DID_UPDATE_ITEM_PROCESS_PROGRESS",
      "DID_THROW_ITEM_PROCESSING_ERROR"
    ].forEach((key) => {
      StyleMap[key].status.translateY = calculateFileVerticalCenterOffset;
    });
    StyleMap["DID_THROW_ITEM_PROCESSING_ERROR"].status.translateX = calculateButtonWidth;
  }
  if (alignRemoveItemButton && allowRevert) {
    LocalButtons["RevertItemProcessing"].align = "BUTTON_REMOVE_ITEM_POSITION";
    const map2 = StyleMap["DID_COMPLETE_ITEM_PROCESSING"];
    map2.info.translateX = calculateFileInfoOffset;
    map2.status.translateY = calculateFileVerticalCenterOffset;
    map2.processingCompleteIndicator = { opacity: 1, scaleX: 1, scaleY: 1 };
  }
  if (!allowRemove) {
    LocalButtons["RemoveItem"].disabled = true;
  }
  forin(LocalButtons, (key, definition) => {
    const buttonView = root2.createChildView(fileActionButton, {
      label: root2.query(definition.label),
      icon: root2.query(definition.icon),
      opacity: 0
    });
    if (enabledButtons.includes(key)) {
      root2.appendChildView(buttonView);
    }
    if (definition.disabled) {
      buttonView.element.setAttribute("disabled", "disabled");
      buttonView.element.setAttribute("hidden", "hidden");
    }
    buttonView.element.dataset.align = root2.query(`GET_STYLE_${definition.align}`);
    buttonView.element.classList.add(definition.className);
    buttonView.on("click", (e) => {
      e.stopPropagation();
      if (definition.disabled) return;
      root2.dispatch(definition.action, { query: id });
    });
    root2.ref[`button${key}`] = buttonView;
  });
  root2.ref.processingCompleteIndicator = root2.appendChildView(
    root2.createChildView(processingCompleteIndicatorView)
  );
  root2.ref.processingCompleteIndicator.element.dataset.align = root2.query(
    `GET_STYLE_BUTTON_PROCESS_ITEM_POSITION`
  );
  root2.ref.info = root2.appendChildView(root2.createChildView(fileInfo, { id }));
  root2.ref.status = root2.appendChildView(root2.createChildView(fileStatus, { id }));
  const loadIndicatorView = root2.appendChildView(
    root2.createChildView(progressIndicator, {
      opacity: 0,
      align: root2.query(`GET_STYLE_LOAD_INDICATOR_POSITION`)
    })
  );
  loadIndicatorView.element.classList.add("filepond--load-indicator");
  root2.ref.loadProgressIndicator = loadIndicatorView;
  const progressIndicatorView = root2.appendChildView(
    root2.createChildView(progressIndicator, {
      opacity: 0,
      align: root2.query(`GET_STYLE_PROGRESS_INDICATOR_POSITION`)
    })
  );
  progressIndicatorView.element.classList.add("filepond--process-indicator");
  root2.ref.processProgressIndicator = progressIndicatorView;
  root2.ref.activeStyles = [];
};
var write$2 = ({ root: root2, actions: actions2, props }) => {
  route({ root: root2, actions: actions2, props });
  let action = actions2.concat().filter((action2) => /^DID_/.test(action2.type)).reverse().find((action2) => StyleMap[action2.type]);
  if (action) {
    root2.ref.activeStyles = [];
    const stylesToApply = StyleMap[action.type];
    forin(DefaultStyle, (name2, defaultStyles) => {
      const control = root2.ref[name2];
      forin(defaultStyles, (key, defaultValue) => {
        const value = stylesToApply[name2] && typeof stylesToApply[name2][key] !== "undefined" ? stylesToApply[name2][key] : defaultValue;
        root2.ref.activeStyles.push({ control, key, value });
      });
    });
  }
  root2.ref.activeStyles.forEach(({ control, key, value }) => {
    control[key] = typeof value === "function" ? value(root2) : value;
  });
};
var route = createRoute({
  DID_SET_LABEL_BUTTON_ABORT_ITEM_PROCESSING: ({ root: root2, action }) => {
    root2.ref.buttonAbortItemProcessing.label = action.value;
  },
  DID_SET_LABEL_BUTTON_ABORT_ITEM_LOAD: ({ root: root2, action }) => {
    root2.ref.buttonAbortItemLoad.label = action.value;
  },
  DID_SET_LABEL_BUTTON_ABORT_ITEM_REMOVAL: ({ root: root2, action }) => {
    root2.ref.buttonAbortItemRemoval.label = action.value;
  },
  DID_REQUEST_ITEM_PROCESSING: ({ root: root2 }) => {
    root2.ref.processProgressIndicator.spin = true;
    root2.ref.processProgressIndicator.progress = 0;
  },
  DID_START_ITEM_LOAD: ({ root: root2 }) => {
    root2.ref.loadProgressIndicator.spin = true;
    root2.ref.loadProgressIndicator.progress = 0;
  },
  DID_START_ITEM_REMOVE: ({ root: root2 }) => {
    root2.ref.processProgressIndicator.spin = true;
    root2.ref.processProgressIndicator.progress = 0;
  },
  DID_UPDATE_ITEM_LOAD_PROGRESS: ({ root: root2, action }) => {
    root2.ref.loadProgressIndicator.spin = false;
    root2.ref.loadProgressIndicator.progress = action.progress;
  },
  DID_UPDATE_ITEM_PROCESS_PROGRESS: ({ root: root2, action }) => {
    root2.ref.processProgressIndicator.spin = false;
    root2.ref.processProgressIndicator.progress = action.progress;
  }
});
var file = createView({
  create: create$4,
  write: write$2,
  didCreateView: (root2) => {
    applyFilters("CREATE_VIEW", { ...root2, view: root2 });
  },
  name: "file"
});
var create$5 = ({ root: root2, props }) => {
  root2.ref.fileName = createElement$1("legend");
  root2.appendChild(root2.ref.fileName);
  root2.ref.file = root2.appendChildView(root2.createChildView(file, { id: props.id }));
  root2.ref.data = false;
};
var didLoadItem = ({ root: root2, props }) => {
  text(root2.ref.fileName, formatFilename(root2.query("GET_ITEM_NAME", props.id)));
};
var fileWrapper = createView({
  create: create$5,
  ignoreRect: true,
  write: createRoute({
    DID_LOAD_ITEM: didLoadItem
  }),
  didCreateView: (root2) => {
    applyFilters("CREATE_VIEW", { ...root2, view: root2 });
  },
  tag: "fieldset",
  name: "file-wrapper"
});
var PANEL_SPRING_PROPS = { type: "spring", damping: 0.6, mass: 7 };
var create$6 = ({ root: root2, props }) => {
  [
    {
      name: "top"
    },
    {
      name: "center",
      props: {
        translateY: null,
        scaleY: null
      },
      mixins: {
        animations: {
          scaleY: PANEL_SPRING_PROPS
        },
        styles: ["translateY", "scaleY"]
      }
    },
    {
      name: "bottom",
      props: {
        translateY: null
      },
      mixins: {
        animations: {
          translateY: PANEL_SPRING_PROPS
        },
        styles: ["translateY"]
      }
    }
  ].forEach((section) => {
    createSection(root2, section, props.name);
  });
  root2.element.classList.add(`filepond--${props.name}`);
  root2.ref.scalable = null;
};
var createSection = (root2, section, className) => {
  const viewConstructor = createView({
    name: `panel-${section.name} filepond--${className}`,
    mixins: section.mixins,
    ignoreRectUpdate: true
  });
  const view = root2.createChildView(viewConstructor, section.props);
  root2.ref[section.name] = root2.appendChildView(view);
};
var write$3 = ({ root: root2, props }) => {
  if (root2.ref.scalable === null || props.scalable !== root2.ref.scalable) {
    root2.ref.scalable = isBoolean(props.scalable) ? props.scalable : true;
    root2.element.dataset.scalable = root2.ref.scalable;
  }
  if (!props.height) return;
  const topRect = root2.ref.top.rect.element;
  const bottomRect = root2.ref.bottom.rect.element;
  const height = Math.max(topRect.height + bottomRect.height, props.height);
  root2.ref.center.translateY = topRect.height;
  root2.ref.center.scaleY = (height - topRect.height - bottomRect.height) / 100;
  root2.ref.bottom.translateY = height - bottomRect.height;
};
var panel = createView({
  name: "panel",
  read: ({ root: root2, props }) => props.heightCurrent = root2.ref.bottom.translateY,
  write: write$3,
  create: create$6,
  ignoreRect: true,
  mixins: {
    apis: ["height", "heightCurrent", "scalable"]
  }
});
var createDragHelper = (items) => {
  const itemIds = items.map((item2) => item2.id);
  let prevIndex = void 0;
  return {
    setIndex: (index) => {
      prevIndex = index;
    },
    getIndex: () => prevIndex,
    getItemIndex: (item2) => itemIds.indexOf(item2.id)
  };
};
var ITEM_TRANSLATE_SPRING = {
  type: "spring",
  stiffness: 0.75,
  damping: 0.45,
  mass: 10
};
var ITEM_SCALE_SPRING = "spring";
var StateMap = {
  DID_START_ITEM_LOAD: "busy",
  DID_UPDATE_ITEM_LOAD_PROGRESS: "loading",
  DID_THROW_ITEM_INVALID: "load-invalid",
  DID_THROW_ITEM_LOAD_ERROR: "load-error",
  DID_LOAD_ITEM: "idle",
  DID_THROW_ITEM_REMOVE_ERROR: "remove-error",
  DID_START_ITEM_REMOVE: "busy",
  DID_START_ITEM_PROCESSING: "busy processing",
  DID_REQUEST_ITEM_PROCESSING: "busy processing",
  DID_UPDATE_ITEM_PROCESS_PROGRESS: "processing",
  DID_COMPLETE_ITEM_PROCESSING: "processing-complete",
  DID_THROW_ITEM_PROCESSING_ERROR: "processing-error",
  DID_THROW_ITEM_PROCESSING_REVERT_ERROR: "processing-revert-error",
  DID_ABORT_ITEM_PROCESSING: "cancelled",
  DID_REVERT_ITEM_PROCESSING: "idle"
};
var create$7 = ({ root: root2, props }) => {
  root2.ref.handleClick = (e) => root2.dispatch("DID_ACTIVATE_ITEM", { id: props.id });
  root2.element.id = `filepond--item-${props.id}`;
  root2.element.addEventListener("click", root2.ref.handleClick);
  root2.ref.container = root2.appendChildView(root2.createChildView(fileWrapper, { id: props.id }));
  root2.ref.panel = root2.appendChildView(root2.createChildView(panel, { name: "item-panel" }));
  root2.ref.panel.height = null;
  props.markedForRemoval = false;
  if (!root2.query("GET_ALLOW_REORDER")) return;
  root2.element.dataset.dragState = "idle";
  const grab = (e) => {
    if (!e.isPrimary) return;
    let removedActivateListener = false;
    const origin = {
      x: e.pageX,
      y: e.pageY
    };
    props.dragOrigin = {
      x: root2.translateX,
      y: root2.translateY
    };
    props.dragCenter = {
      x: e.offsetX,
      y: e.offsetY
    };
    const dragState = createDragHelper(root2.query("GET_ACTIVE_ITEMS"));
    root2.dispatch("DID_GRAB_ITEM", { id: props.id, dragState });
    const drag = (e2) => {
      if (!e2.isPrimary) return;
      e2.stopPropagation();
      e2.preventDefault();
      props.dragOffset = {
        x: e2.pageX - origin.x,
        y: e2.pageY - origin.y
      };
      const dist = props.dragOffset.x * props.dragOffset.x + props.dragOffset.y * props.dragOffset.y;
      if (dist > 16 && !removedActivateListener) {
        removedActivateListener = true;
        root2.element.removeEventListener("click", root2.ref.handleClick);
      }
      root2.dispatch("DID_DRAG_ITEM", { id: props.id, dragState });
    };
    const drop2 = (e2) => {
      if (!e2.isPrimary) return;
      props.dragOffset = {
        x: e2.pageX - origin.x,
        y: e2.pageY - origin.y
      };
      reset();
    };
    const cancel = () => {
      reset();
    };
    const reset = () => {
      document.removeEventListener("pointercancel", cancel);
      document.removeEventListener("pointermove", drag);
      document.removeEventListener("pointerup", drop2);
      root2.dispatch("DID_DROP_ITEM", { id: props.id, dragState });
      if (removedActivateListener) {
        setTimeout(() => root2.element.addEventListener("click", root2.ref.handleClick), 0);
      }
    };
    document.addEventListener("pointercancel", cancel);
    document.addEventListener("pointermove", drag);
    document.addEventListener("pointerup", drop2);
  };
  root2.element.addEventListener("pointerdown", grab);
};
var route$1 = createRoute({
  DID_UPDATE_PANEL_HEIGHT: ({ root: root2, action }) => {
    root2.height = action.height;
  }
});
var write$4 = createRoute(
  {
    DID_GRAB_ITEM: ({ root: root2, props }) => {
      props.dragOrigin = {
        x: root2.translateX,
        y: root2.translateY
      };
    },
    DID_DRAG_ITEM: ({ root: root2 }) => {
      root2.element.dataset.dragState = "drag";
    },
    DID_DROP_ITEM: ({ root: root2, props }) => {
      props.dragOffset = null;
      props.dragOrigin = null;
      root2.element.dataset.dragState = "drop";
    }
  },
  ({ root: root2, actions: actions2, props, shouldOptimize }) => {
    if (root2.element.dataset.dragState === "drop") {
      if (root2.scaleX <= 1) {
        root2.element.dataset.dragState = "idle";
      }
    }
    let action = actions2.concat().filter((action2) => /^DID_/.test(action2.type)).reverse().find((action2) => StateMap[action2.type]);
    if (action && action.type !== props.currentState) {
      props.currentState = action.type;
      root2.element.dataset.filepondItemState = StateMap[props.currentState] || "";
    }
    const aspectRatio = root2.query("GET_ITEM_PANEL_ASPECT_RATIO") || root2.query("GET_PANEL_ASPECT_RATIO");
    if (!aspectRatio) {
      route$1({ root: root2, actions: actions2, props });
      if (!root2.height && root2.ref.container.rect.element.height > 0) {
        root2.height = root2.ref.container.rect.element.height;
      }
    } else if (!shouldOptimize) {
      root2.height = root2.rect.element.width * aspectRatio;
    }
    if (shouldOptimize) {
      root2.ref.panel.height = null;
    }
    root2.ref.panel.height = root2.height;
  }
);
var item = createView({
  create: create$7,
  write: write$4,
  destroy: ({ root: root2, props }) => {
    root2.element.removeEventListener("click", root2.ref.handleClick);
    root2.dispatch("RELEASE_ITEM", { query: props.id });
  },
  tag: "li",
  name: "item",
  mixins: {
    apis: [
      "id",
      "interactionMethod",
      "markedForRemoval",
      "spawnDate",
      "dragCenter",
      "dragOrigin",
      "dragOffset"
    ],
    styles: ["translateX", "translateY", "scaleX", "scaleY", "opacity", "height"],
    animations: {
      scaleX: ITEM_SCALE_SPRING,
      scaleY: ITEM_SCALE_SPRING,
      translateX: ITEM_TRANSLATE_SPRING,
      translateY: ITEM_TRANSLATE_SPRING,
      opacity: { type: "tween", duration: 150 }
    }
  }
});
var getItemsPerRow = (horizontalSpace, itemWidth) => {
  return Math.max(1, Math.floor((horizontalSpace + 1) / itemWidth));
};
var getItemIndexByPosition = (view, children, positionInView) => {
  if (!positionInView) return;
  const horizontalSpace = view.rect.element.width;
  const l = children.length;
  let last = null;
  if (l === 0 || positionInView.top < children[0].rect.element.top) return -1;
  const item2 = children[0];
  const itemRect = item2.rect.element;
  const itemHorizontalMargin = itemRect.marginLeft + itemRect.marginRight;
  const itemWidth = itemRect.width + itemHorizontalMargin;
  const itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);
  if (itemsPerRow === 1) {
    for (let index = 0; index < l; index++) {
      const child = children[index];
      const childMid = child.rect.outer.top + child.rect.element.height * 0.5;
      if (positionInView.top < childMid) {
        return index;
      }
    }
    return l;
  }
  const itemVerticalMargin = itemRect.marginTop + itemRect.marginBottom;
  const itemHeight = itemRect.height + itemVerticalMargin;
  for (let index = 0; index < l; index++) {
    const indexX = index % itemsPerRow;
    const indexY = Math.floor(index / itemsPerRow);
    const offsetX = indexX * itemWidth;
    const offsetY = indexY * itemHeight;
    const itemTop = offsetY - itemRect.marginTop;
    const itemRight = offsetX + itemWidth;
    const itemBottom = offsetY + itemHeight + itemRect.marginBottom;
    if (positionInView.top < itemBottom && positionInView.top > itemTop) {
      if (positionInView.left < itemRight) {
        return index;
      } else if (index !== l - 1) {
        last = index;
      } else {
        last = null;
      }
    }
  }
  if (last !== null) {
    return last;
  }
  return l;
};
var dropAreaDimensions = {
  height: 0,
  width: 0,
  get getHeight() {
    return this.height;
  },
  set setHeight(val) {
    if (this.height === 0 || val === 0) this.height = val;
  },
  get getWidth() {
    return this.width;
  },
  set setWidth(val) {
    if (this.width === 0 || val === 0) this.width = val;
  },
  setDimensions: function(height, width) {
    if (this.height === 0 || height === 0) this.height = height;
    if (this.width === 0 || width === 0) this.width = width;
  }
};
var create$8 = ({ root: root2 }) => {
  attr(root2.element, "role", "list");
  root2.ref.lastItemSpanwDate = Date.now();
};
var addItemView = ({ root: root2, action }) => {
  const { id, index, interactionMethod } = action;
  root2.ref.addIndex = index;
  const now = Date.now();
  let spawnDate = now;
  let opacity = 1;
  if (interactionMethod !== InteractionMethod.NONE) {
    opacity = 0;
    const cooldown = root2.query("GET_ITEM_INSERT_INTERVAL");
    const dist = now - root2.ref.lastItemSpanwDate;
    spawnDate = dist < cooldown ? now + (cooldown - dist) : now;
  }
  root2.ref.lastItemSpanwDate = spawnDate;
  root2.appendChildView(
    root2.createChildView(
      // view type
      item,
      // props
      {
        spawnDate,
        id,
        opacity,
        interactionMethod
      }
    ),
    index
  );
};
var moveItem = (item2, x, y, vx = 0, vy = 1) => {
  if (item2.dragOffset) {
    item2.translateX = null;
    item2.translateY = null;
    item2.translateX = item2.dragOrigin.x + item2.dragOffset.x;
    item2.translateY = item2.dragOrigin.y + item2.dragOffset.y;
    item2.scaleX = 1.025;
    item2.scaleY = 1.025;
  } else {
    item2.translateX = x;
    item2.translateY = y;
    if (Date.now() > item2.spawnDate) {
      if (item2.opacity === 0) {
        introItemView(item2, x, y, vx, vy);
      }
      item2.scaleX = 1;
      item2.scaleY = 1;
      item2.opacity = 1;
    }
  }
};
var introItemView = (item2, x, y, vx, vy) => {
  if (item2.interactionMethod === InteractionMethod.NONE) {
    item2.translateX = null;
    item2.translateX = x;
    item2.translateY = null;
    item2.translateY = y;
  } else if (item2.interactionMethod === InteractionMethod.DROP) {
    item2.translateX = null;
    item2.translateX = x - vx * 20;
    item2.translateY = null;
    item2.translateY = y - vy * 10;
    item2.scaleX = 0.8;
    item2.scaleY = 0.8;
  } else if (item2.interactionMethod === InteractionMethod.BROWSE) {
    item2.translateY = null;
    item2.translateY = y - 30;
  } else if (item2.interactionMethod === InteractionMethod.API) {
    item2.translateX = null;
    item2.translateX = x - 30;
    item2.translateY = null;
  }
};
var removeItemView = ({ root: root2, action }) => {
  const { id } = action;
  const view = root2.childViews.find((child) => child.id === id);
  if (!view) {
    return;
  }
  view.scaleX = 0.9;
  view.scaleY = 0.9;
  view.opacity = 0;
  view.markedForRemoval = true;
};
var getItemHeight = (child) => child.rect.element.height + child.rect.element.marginBottom + child.rect.element.marginTop;
var getItemWidth = (child) => child.rect.element.width + child.rect.element.marginLeft * 0.5 + child.rect.element.marginRight * 0.5;
var dragItem = ({ root: root2, action }) => {
  const { id, dragState } = action;
  const item2 = root2.query("GET_ITEM", { id });
  const view = root2.childViews.find((child) => child.id === id);
  const numItems = root2.childViews.length;
  const oldIndex = dragState.getItemIndex(item2);
  if (!view) return;
  const dragPosition = {
    x: view.dragOrigin.x + view.dragOffset.x + view.dragCenter.x,
    y: view.dragOrigin.y + view.dragOffset.y + view.dragCenter.y
  };
  const dragHeight = getItemHeight(view);
  const dragWidth = getItemWidth(view);
  let cols = Math.floor(root2.rect.outer.width / dragWidth);
  if (cols > numItems) cols = numItems;
  const rows = Math.floor(numItems / cols + 1);
  dropAreaDimensions.setHeight = dragHeight * rows;
  dropAreaDimensions.setWidth = dragWidth * cols;
  var location2 = {
    y: Math.floor(dragPosition.y / dragHeight),
    x: Math.floor(dragPosition.x / dragWidth),
    getGridIndex: function getGridIndex() {
      if (dragPosition.y > dropAreaDimensions.getHeight || dragPosition.y < 0 || dragPosition.x > dropAreaDimensions.getWidth || dragPosition.x < 0)
        return oldIndex;
      return this.y * cols + this.x;
    },
    getColIndex: function getColIndex() {
      const items = root2.query("GET_ACTIVE_ITEMS");
      const visibleChildren = root2.childViews.filter((child) => child.rect.element.height);
      const children = items.map(
        (item3) => visibleChildren.find((childView) => childView.id === item3.id)
      );
      const currentIndex2 = children.findIndex((child) => child === view);
      const dragHeight2 = getItemHeight(view);
      const l = children.length;
      let idx = l;
      let childHeight = 0;
      let childBottom = 0;
      let childTop = 0;
      for (let i = 0; i < l; i++) {
        childHeight = getItemHeight(children[i]);
        childTop = childBottom;
        childBottom = childTop + childHeight;
        if (dragPosition.y < childBottom) {
          if (currentIndex2 > i) {
            if (dragPosition.y < childTop + dragHeight2) {
              idx = i;
              break;
            }
            continue;
          }
          idx = i;
          break;
        }
      }
      return idx;
    }
  };
  const index = cols > 1 ? location2.getGridIndex() : location2.getColIndex();
  root2.dispatch("MOVE_ITEM", { query: view, index });
  const currentIndex = dragState.getIndex();
  if (currentIndex === void 0 || currentIndex !== index) {
    dragState.setIndex(index);
    if (currentIndex === void 0) return;
    root2.dispatch("DID_REORDER_ITEMS", {
      items: root2.query("GET_ACTIVE_ITEMS"),
      origin: oldIndex,
      target: index
    });
  }
};
var route$2 = createRoute({
  DID_ADD_ITEM: addItemView,
  DID_REMOVE_ITEM: removeItemView,
  DID_DRAG_ITEM: dragItem
});
var write$5 = ({ root: root2, props, actions: actions2, shouldOptimize }) => {
  route$2({ root: root2, props, actions: actions2 });
  const { dragCoordinates } = props;
  const horizontalSpace = root2.rect.element.width;
  const visibleChildren = root2.childViews.filter((child) => child.rect.element.height);
  const children = root2.query("GET_ACTIVE_ITEMS").map((item2) => visibleChildren.find((child) => child.id === item2.id)).filter((item2) => item2);
  const dragIndex = dragCoordinates ? getItemIndexByPosition(root2, children, dragCoordinates) : null;
  const addIndex = root2.ref.addIndex || null;
  root2.ref.addIndex = null;
  let dragIndexOffset = 0;
  let removeIndexOffset = 0;
  let addIndexOffset = 0;
  if (children.length === 0) return;
  const childRect = children[0].rect.element;
  const itemVerticalMargin = childRect.marginTop + childRect.marginBottom;
  const itemHorizontalMargin = childRect.marginLeft + childRect.marginRight;
  const itemWidth = childRect.width + itemHorizontalMargin;
  const itemHeight = childRect.height + itemVerticalMargin;
  const itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);
  if (itemsPerRow === 1) {
    let offsetY = 0;
    let dragOffset = 0;
    children.forEach((child, index) => {
      if (dragIndex) {
        let dist = index - dragIndex;
        if (dist === -2) {
          dragOffset = -itemVerticalMargin * 0.25;
        } else if (dist === -1) {
          dragOffset = -itemVerticalMargin * 0.75;
        } else if (dist === 0) {
          dragOffset = itemVerticalMargin * 0.75;
        } else if (dist === 1) {
          dragOffset = itemVerticalMargin * 0.25;
        } else {
          dragOffset = 0;
        }
      }
      if (shouldOptimize) {
        child.translateX = null;
        child.translateY = null;
      }
      if (!child.markedForRemoval) {
        moveItem(child, 0, offsetY + dragOffset);
      }
      let itemHeight2 = child.rect.element.height + itemVerticalMargin;
      let visualHeight = itemHeight2 * (child.markedForRemoval ? child.opacity : 1);
      offsetY += visualHeight;
    });
  } else {
    let prevX = 0;
    let prevY = 0;
    children.forEach((child, index) => {
      if (index === dragIndex) {
        dragIndexOffset = 1;
      }
      if (index === addIndex) {
        addIndexOffset += 1;
      }
      if (child.markedForRemoval && child.opacity < 0.5) {
        removeIndexOffset -= 1;
      }
      const visualIndex = index + addIndexOffset + dragIndexOffset + removeIndexOffset;
      const indexX = visualIndex % itemsPerRow;
      const indexY = Math.floor(visualIndex / itemsPerRow);
      const offsetX = indexX * itemWidth;
      const offsetY = indexY * itemHeight;
      const vectorX = Math.sign(offsetX - prevX);
      const vectorY = Math.sign(offsetY - prevY);
      prevX = offsetX;
      prevY = offsetY;
      if (child.markedForRemoval) return;
      if (shouldOptimize) {
        child.translateX = null;
        child.translateY = null;
      }
      moveItem(child, offsetX, offsetY, vectorX, vectorY);
    });
  }
};
var filterSetItemActions = (child, actions2) => actions2.filter((action) => {
  if (action.data && action.data.id) {
    return child.id === action.data.id;
  }
  return true;
});
var list = createView({
  create: create$8,
  write: write$5,
  tag: "ul",
  name: "list",
  didWriteView: ({ root: root2 }) => {
    root2.childViews.filter((view) => view.markedForRemoval && view.opacity === 0 && view.resting).forEach((view) => {
      view._destroy();
      root2.removeChildView(view);
    });
  },
  filterFrameActionsForChild: filterSetItemActions,
  mixins: {
    apis: ["dragCoordinates"]
  }
});
var create$9 = ({ root: root2, props }) => {
  root2.ref.list = root2.appendChildView(root2.createChildView(list));
  props.dragCoordinates = null;
  props.overflowing = false;
};
var storeDragCoordinates = ({ root: root2, props, action }) => {
  if (!root2.query("GET_ITEM_INSERT_LOCATION_FREEDOM")) return;
  props.dragCoordinates = {
    left: action.position.scopeLeft - root2.ref.list.rect.element.left,
    top: action.position.scopeTop - (root2.rect.outer.top + root2.rect.element.marginTop + root2.rect.element.scrollTop)
  };
};
var clearDragCoordinates = ({ props }) => {
  props.dragCoordinates = null;
};
var route$3 = createRoute({
  DID_DRAG: storeDragCoordinates,
  DID_END_DRAG: clearDragCoordinates
});
var write$6 = ({ root: root2, props, actions: actions2 }) => {
  route$3({ root: root2, props, actions: actions2 });
  root2.ref.list.dragCoordinates = props.dragCoordinates;
  if (props.overflowing && !props.overflow) {
    props.overflowing = false;
    root2.element.dataset.state = "";
    root2.height = null;
  }
  if (props.overflow) {
    const newHeight = Math.round(props.overflow);
    if (newHeight !== root2.height) {
      props.overflowing = true;
      root2.element.dataset.state = "overflow";
      root2.height = newHeight;
    }
  }
};
var listScroller = createView({
  create: create$9,
  write: write$6,
  name: "list-scroller",
  mixins: {
    apis: ["overflow", "dragCoordinates"],
    styles: ["height", "translateY"],
    animations: {
      translateY: "spring"
    }
  }
});
var attrToggle = (element, name2, state2, enabledValue = "") => {
  if (state2) {
    attr(element, name2, enabledValue);
  } else {
    element.removeAttribute(name2);
  }
};
var resetFileInput = (input) => {
  if (!input || input.value === "") {
    return;
  }
  try {
    input.value = "";
  } catch (err) {
  }
  if (input.value) {
    const form = createElement$1("form");
    const parentNode = input.parentNode;
    const ref = input.nextSibling;
    form.appendChild(input);
    form.reset();
    if (ref) {
      parentNode.insertBefore(input, ref);
    } else {
      parentNode.appendChild(input);
    }
  }
};
var create$a = ({ root: root2, props }) => {
  root2.element.id = `filepond--browser-${props.id}`;
  attr(root2.element, "name", root2.query("GET_NAME"));
  attr(root2.element, "aria-controls", `filepond--assistant-${props.id}`);
  attr(root2.element, "aria-labelledby", `filepond--drop-label-${props.id}`);
  setAcceptedFileTypes({ root: root2, action: { value: root2.query("GET_ACCEPTED_FILE_TYPES") } });
  toggleAllowMultiple({ root: root2, action: { value: root2.query("GET_ALLOW_MULTIPLE") } });
  toggleDirectoryFilter({ root: root2, action: { value: root2.query("GET_ALLOW_DIRECTORIES_ONLY") } });
  toggleDisabled({ root: root2 });
  toggleRequired({ root: root2, action: { value: root2.query("GET_REQUIRED") } });
  setCaptureMethod({ root: root2, action: { value: root2.query("GET_CAPTURE_METHOD") } });
  root2.ref.handleChange = (e) => {
    if (!root2.element.value) {
      return;
    }
    const files = Array.from(root2.element.files).map((file2) => {
      file2._relativePath = file2.webkitRelativePath;
      return file2;
    });
    setTimeout(() => {
      props.onload(files);
      resetFileInput(root2.element);
    }, 250);
  };
  root2.element.addEventListener("change", root2.ref.handleChange);
};
var setAcceptedFileTypes = ({ root: root2, action }) => {
  if (!root2.query("GET_ALLOW_SYNC_ACCEPT_ATTRIBUTE")) return;
  attrToggle(root2.element, "accept", !!action.value, action.value ? action.value.join(",") : "");
};
var toggleAllowMultiple = ({ root: root2, action }) => {
  attrToggle(root2.element, "multiple", action.value);
};
var toggleDirectoryFilter = ({ root: root2, action }) => {
  attrToggle(root2.element, "webkitdirectory", action.value);
};
var toggleDisabled = ({ root: root2 }) => {
  const isDisabled = root2.query("GET_DISABLED");
  const doesAllowBrowse = root2.query("GET_ALLOW_BROWSE");
  const disableField = isDisabled || !doesAllowBrowse;
  attrToggle(root2.element, "disabled", disableField);
};
var toggleRequired = ({ root: root2, action }) => {
  if (!action.value) {
    attrToggle(root2.element, "required", false);
  } else if (root2.query("GET_TOTAL_ITEMS") === 0) {
    attrToggle(root2.element, "required", true);
  }
};
var setCaptureMethod = ({ root: root2, action }) => {
  attrToggle(root2.element, "capture", !!action.value, action.value === true ? "" : action.value);
};
var updateRequiredStatus = ({ root: root2 }) => {
  const { element } = root2;
  if (root2.query("GET_TOTAL_ITEMS") > 0) {
    attrToggle(element, "required", false);
    attrToggle(element, "name", false);
    const activeItems = root2.query("GET_ACTIVE_ITEMS");
    let hasInvalidField = false;
    for (let i = 0; i < activeItems.length; i++) {
      if (activeItems[i].status === ItemStatus.LOAD_ERROR) {
        hasInvalidField = true;
      }
    }
    root2.element.setCustomValidity(
      hasInvalidField ? root2.query("GET_LABEL_INVALID_FIELD") : ""
    );
  } else {
    attrToggle(element, "name", true, root2.query("GET_NAME"));
    const shouldCheckValidity = root2.query("GET_CHECK_VALIDITY");
    if (shouldCheckValidity) {
      element.setCustomValidity("");
    }
    if (root2.query("GET_REQUIRED")) {
      attrToggle(element, "required", true);
    }
  }
};
var updateFieldValidityStatus = ({ root: root2 }) => {
  const shouldCheckValidity = root2.query("GET_CHECK_VALIDITY");
  if (!shouldCheckValidity) return;
  root2.element.setCustomValidity(root2.query("GET_LABEL_INVALID_FIELD"));
};
var browser = createView({
  tag: "input",
  name: "browser",
  ignoreRect: true,
  ignoreRectUpdate: true,
  attributes: {
    type: "file"
  },
  create: create$a,
  destroy: ({ root: root2 }) => {
    root2.element.removeEventListener("change", root2.ref.handleChange);
  },
  write: createRoute({
    DID_LOAD_ITEM: updateRequiredStatus,
    DID_REMOVE_ITEM: updateRequiredStatus,
    DID_THROW_ITEM_INVALID: updateFieldValidityStatus,
    DID_SET_DISABLED: toggleDisabled,
    DID_SET_ALLOW_BROWSE: toggleDisabled,
    DID_SET_ALLOW_DIRECTORIES_ONLY: toggleDirectoryFilter,
    DID_SET_ALLOW_MULTIPLE: toggleAllowMultiple,
    DID_SET_ACCEPTED_FILE_TYPES: setAcceptedFileTypes,
    DID_SET_CAPTURE_METHOD: setCaptureMethod,
    DID_SET_REQUIRED: toggleRequired
  })
});
var Key = {
  ENTER: 13,
  SPACE: 32
};
var create$b = ({ root: root2, props }) => {
  const label = createElement$1("label");
  attr(label, "for", `filepond--browser-${props.id}`);
  attr(label, "id", `filepond--drop-label-${props.id}`);
  root2.ref.handleKeyDown = (e) => {
    const isActivationKey = e.keyCode === Key.ENTER || e.keyCode === Key.SPACE;
    if (!isActivationKey) return;
    e.preventDefault();
    root2.ref.label.click();
  };
  root2.ref.handleClick = (e) => {
    const isLabelClick = e.target === label || label.contains(e.target);
    if (isLabelClick) return;
    root2.ref.label.click();
  };
  label.addEventListener("keydown", root2.ref.handleKeyDown);
  root2.element.addEventListener("click", root2.ref.handleClick);
  updateLabelValue(label, props.caption);
  root2.appendChild(label);
  root2.ref.label = label;
};
var updateLabelValue = (label, value) => {
  label.innerHTML = value;
  const clickable = label.querySelector(".filepond--label-action");
  if (clickable) {
    attr(clickable, "tabindex", "0");
  }
  return value;
};
var dropLabel = createView({
  name: "drop-label",
  ignoreRect: true,
  create: create$b,
  destroy: ({ root: root2 }) => {
    root2.ref.label.addEventListener("keydown", root2.ref.handleKeyDown);
    root2.element.removeEventListener("click", root2.ref.handleClick);
  },
  write: createRoute({
    DID_SET_LABEL_IDLE: ({ root: root2, action }) => {
      updateLabelValue(root2.ref.label, action.value);
    }
  }),
  mixins: {
    styles: ["opacity", "translateX", "translateY"],
    animations: {
      opacity: { type: "tween", duration: 150 },
      translateX: "spring",
      translateY: "spring"
    }
  }
});
var blob = createView({
  name: "drip-blob",
  ignoreRect: true,
  mixins: {
    styles: ["translateX", "translateY", "scaleX", "scaleY", "opacity"],
    animations: {
      scaleX: "spring",
      scaleY: "spring",
      translateX: "spring",
      translateY: "spring",
      opacity: { type: "tween", duration: 250 }
    }
  }
});
var addBlob = ({ root: root2 }) => {
  const centerX = root2.rect.element.width * 0.5;
  const centerY = root2.rect.element.height * 0.5;
  root2.ref.blob = root2.appendChildView(
    root2.createChildView(blob, {
      opacity: 0,
      scaleX: 2.5,
      scaleY: 2.5,
      translateX: centerX,
      translateY: centerY
    })
  );
};
var moveBlob = ({ root: root2, action }) => {
  if (!root2.ref.blob) {
    addBlob({ root: root2 });
    return;
  }
  root2.ref.blob.translateX = action.position.scopeLeft;
  root2.ref.blob.translateY = action.position.scopeTop;
  root2.ref.blob.scaleX = 1;
  root2.ref.blob.scaleY = 1;
  root2.ref.blob.opacity = 1;
};
var hideBlob = ({ root: root2 }) => {
  if (!root2.ref.blob) {
    return;
  }
  root2.ref.blob.opacity = 0;
};
var explodeBlob = ({ root: root2 }) => {
  if (!root2.ref.blob) {
    return;
  }
  root2.ref.blob.scaleX = 2.5;
  root2.ref.blob.scaleY = 2.5;
  root2.ref.blob.opacity = 0;
};
var write$7 = ({ root: root2, props, actions: actions2 }) => {
  route$4({ root: root2, props, actions: actions2 });
  const { blob: blob2 } = root2.ref;
  if (actions2.length === 0 && blob2 && blob2.opacity === 0) {
    root2.removeChildView(blob2);
    root2.ref.blob = null;
  }
};
var route$4 = createRoute({
  DID_DRAG: moveBlob,
  DID_DROP: explodeBlob,
  DID_END_DRAG: hideBlob
});
var drip = createView({
  ignoreRect: true,
  ignoreRectUpdate: true,
  name: "drip",
  write: write$7
});
var setInputFiles = (element, files) => {
  try {
    const dataTransfer = new DataTransfer();
    files.forEach((file2) => {
      if (file2 instanceof File) {
        dataTransfer.items.add(file2);
      } else {
        dataTransfer.items.add(
          new File([file2], file2.name, {
            type: file2.type
          })
        );
      }
    });
    element.files = dataTransfer.files;
  } catch (err) {
    return false;
  }
  return true;
};
var create$c = ({ root: root2 }) => {
  root2.ref.fields = {};
  const legend = document.createElement("legend");
  legend.textContent = "Files";
  root2.element.appendChild(legend);
};
var getField = (root2, id) => root2.ref.fields[id];
var syncFieldPositionsWithItems = (root2) => {
  root2.query("GET_ACTIVE_ITEMS").forEach((item2) => {
    if (!root2.ref.fields[item2.id]) return;
    root2.element.appendChild(root2.ref.fields[item2.id]);
  });
};
var didReorderItems = ({ root: root2 }) => syncFieldPositionsWithItems(root2);
var didAddItem = ({ root: root2, action }) => {
  const fileItem = root2.query("GET_ITEM", action.id);
  const isLocalFile = fileItem.origin === FileOrigin.LOCAL;
  const shouldUseFileInput = !isLocalFile && root2.query("SHOULD_UPDATE_FILE_INPUT");
  const dataContainer = createElement$1("input");
  dataContainer.type = shouldUseFileInput ? "file" : "hidden";
  dataContainer.name = root2.query("GET_NAME");
  root2.ref.fields[action.id] = dataContainer;
  syncFieldPositionsWithItems(root2);
};
var didLoadItem$1 = ({ root: root2, action }) => {
  const field = getField(root2, action.id);
  if (!field) return;
  if (action.serverFileReference !== null) field.value = action.serverFileReference;
  if (!root2.query("SHOULD_UPDATE_FILE_INPUT")) return;
  const fileItem = root2.query("GET_ITEM", action.id);
  setInputFiles(field, [fileItem.file]);
};
var didPrepareOutput = ({ root: root2, action }) => {
  if (!root2.query("SHOULD_UPDATE_FILE_INPUT")) return;
  setTimeout(() => {
    const field = getField(root2, action.id);
    if (!field) return;
    setInputFiles(field, [action.file]);
  }, 0);
};
var didSetDisabled = ({ root: root2 }) => {
  root2.element.disabled = root2.query("GET_DISABLED");
};
var didRemoveItem = ({ root: root2, action }) => {
  const field = getField(root2, action.id);
  if (!field) return;
  if (field.parentNode) field.parentNode.removeChild(field);
  delete root2.ref.fields[action.id];
};
var didDefineValue = ({ root: root2, action }) => {
  const field = getField(root2, action.id);
  if (!field) return;
  if (action.value === null) {
    field.removeAttribute("value");
  } else {
    if (field.type != "file") {
      field.value = action.value;
    }
  }
  syncFieldPositionsWithItems(root2);
};
var write$8 = createRoute({
  DID_SET_DISABLED: didSetDisabled,
  DID_ADD_ITEM: didAddItem,
  DID_LOAD_ITEM: didLoadItem$1,
  DID_REMOVE_ITEM: didRemoveItem,
  DID_DEFINE_VALUE: didDefineValue,
  DID_PREPARE_OUTPUT: didPrepareOutput,
  DID_REORDER_ITEMS: didReorderItems,
  DID_SORT_ITEMS: didReorderItems
});
var data = createView({
  tag: "fieldset",
  name: "data",
  create: create$c,
  write: write$8,
  ignoreRect: true
});
var getRootNode = (element) => "getRootNode" in element ? element.getRootNode() : document;
var images = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff"];
var text$1 = ["css", "csv", "html", "txt"];
var map = {
  zip: "zip|compressed",
  epub: "application/epub+zip"
};
var guesstimateMimeType = (extension = "") => {
  extension = extension.toLowerCase();
  if (images.includes(extension)) {
    return "image/" + (extension === "jpg" ? "jpeg" : extension === "svg" ? "svg+xml" : extension);
  }
  if (text$1.includes(extension)) {
    return "text/" + extension;
  }
  return map[extension] || "";
};
var requestDataTransferItems = (dataTransfer) => new Promise((resolve, reject) => {
  const links = getLinks(dataTransfer);
  if (links.length && !hasFiles(dataTransfer)) {
    return resolve(links);
  }
  getFiles(dataTransfer).then(resolve);
});
var hasFiles = (dataTransfer) => {
  if (dataTransfer.files) return dataTransfer.files.length > 0;
  return false;
};
var getFiles = (dataTransfer) => new Promise((resolve, reject) => {
  const promisedFiles = (dataTransfer.items ? Array.from(dataTransfer.items) : []).filter((item2) => isFileSystemItem(item2)).map((item2) => getFilesFromItem(item2));
  if (!promisedFiles.length) {
    resolve(dataTransfer.files ? Array.from(dataTransfer.files) : []);
    return;
  }
  Promise.all(promisedFiles).then((returnedFileGroups) => {
    const files = [];
    returnedFileGroups.forEach((group) => {
      files.push.apply(files, group);
    });
    resolve(
      files.filter((file2) => file2).map((file2) => {
        if (!file2._relativePath) file2._relativePath = file2.webkitRelativePath;
        return file2;
      })
    );
  }).catch(console.error);
});
var isFileSystemItem = (item2) => {
  if (isEntry(item2)) {
    const entry = getAsEntry(item2);
    if (entry) {
      return entry.isFile || entry.isDirectory;
    }
  }
  return item2.kind === "file";
};
var getFilesFromItem = (item2) => new Promise((resolve, reject) => {
  if (isDirectoryEntry(item2)) {
    getFilesInDirectory(getAsEntry(item2)).then(resolve).catch(reject);
    return;
  }
  resolve([item2.getAsFile()]);
});
var getFilesInDirectory = (entry) => new Promise((resolve, reject) => {
  const files = [];
  let dirCounter = 0;
  let fileCounter = 0;
  const resolveIfDone = () => {
    if (fileCounter === 0 && dirCounter === 0) {
      resolve(files);
    }
  };
  const readEntries = (dirEntry) => {
    dirCounter++;
    const directoryReader = dirEntry.createReader();
    const readBatch = () => {
      directoryReader.readEntries((entries) => {
        if (entries.length === 0) {
          dirCounter--;
          resolveIfDone();
          return;
        }
        entries.forEach((entry2) => {
          if (entry2.isDirectory) {
            readEntries(entry2);
          } else {
            fileCounter++;
            entry2.file((file2) => {
              const correctedFile = correctMissingFileType(file2);
              if (entry2.fullPath) correctedFile._relativePath = entry2.fullPath;
              files.push(correctedFile);
              fileCounter--;
              resolveIfDone();
            });
          }
        });
        readBatch();
      }, reject);
    };
    readBatch();
  };
  readEntries(entry);
});
var correctMissingFileType = (file2) => {
  if (file2.type.length) return file2;
  const date = file2.lastModifiedDate;
  const name2 = file2.name;
  const type = guesstimateMimeType(getExtensionFromFilename(file2.name));
  if (!type.length) return file2;
  file2 = file2.slice(0, file2.size, type);
  file2.name = name2;
  file2.lastModifiedDate = date;
  return file2;
};
var isDirectoryEntry = (item2) => isEntry(item2) && (getAsEntry(item2) || {}).isDirectory;
var isEntry = (item2) => "webkitGetAsEntry" in item2;
var getAsEntry = (item2) => item2.webkitGetAsEntry();
var getLinks = (dataTransfer) => {
  let links = [];
  try {
    links = getLinksFromTransferMetaData(dataTransfer);
    if (links.length) {
      return links;
    }
    links = getLinksFromTransferURLData(dataTransfer);
  } catch (e) {
  }
  return links;
};
var getLinksFromTransferURLData = (dataTransfer) => {
  let data2 = dataTransfer.getData("url");
  if (typeof data2 === "string" && data2.length) {
    return [data2];
  }
  return [];
};
var getLinksFromTransferMetaData = (dataTransfer) => {
  let data2 = dataTransfer.getData("text/html");
  if (typeof data2 === "string" && data2.length) {
    const matches = data2.match(/src\s*=\s*"(.+?)"/);
    if (matches) {
      return [matches[1]];
    }
  }
  return [];
};
var dragNDropObservers = [];
var eventPosition = (e) => ({
  pageLeft: e.pageX,
  pageTop: e.pageY,
  scopeLeft: e.offsetX || e.layerX,
  scopeTop: e.offsetY || e.layerY
});
var createDragNDropClient = (element, scopeToObserve, filterElement) => {
  const observer = getDragNDropObserver(scopeToObserve);
  const client = {
    element,
    filterElement,
    state: null,
    ondrop: () => {
    },
    onenter: () => {
    },
    ondrag: () => {
    },
    onexit: () => {
    },
    onload: () => {
    },
    allowdrop: () => {
    }
  };
  client.destroy = observer.addListener(client);
  return client;
};
var getDragNDropObserver = (element) => {
  const observer = dragNDropObservers.find((item2) => item2.element === element);
  if (observer) {
    return observer;
  }
  const newObserver = createDragNDropObserver(element);
  dragNDropObservers.push(newObserver);
  return newObserver;
};
var createDragNDropObserver = (element) => {
  const clients = [];
  const routes = {
    dragenter,
    dragover,
    dragleave,
    drop
  };
  const handlers = {};
  forin(routes, (event, createHandler) => {
    handlers[event] = createHandler(element, clients);
    element.addEventListener(event, handlers[event], false);
  });
  const observer = {
    element,
    addListener: (client) => {
      clients.push(client);
      return () => {
        clients.splice(clients.indexOf(client), 1);
        if (clients.length === 0) {
          dragNDropObservers.splice(dragNDropObservers.indexOf(observer), 1);
          forin(routes, (event) => {
            element.removeEventListener(event, handlers[event], false);
          });
        }
      };
    }
  };
  return observer;
};
var elementFromPoint = (root2, point) => {
  if (!("elementFromPoint" in root2)) {
    root2 = document;
  }
  return root2.elementFromPoint(point.x, point.y);
};
var isEventTarget = (e, target) => {
  const root2 = getRootNode(target);
  const elementAtPosition = elementFromPoint(root2, {
    x: e.pageX - window.pageXOffset,
    y: e.pageY - window.pageYOffset
  });
  return elementAtPosition === target || target.contains(elementAtPosition);
};
var initialTarget = null;
var setDropEffect = (dataTransfer, effect) => {
  try {
    dataTransfer.dropEffect = effect;
  } catch (e) {
  }
};
var dragenter = (root2, clients) => (e) => {
  e.preventDefault();
  initialTarget = e.target;
  clients.forEach((client) => {
    const { element, onenter } = client;
    if (isEventTarget(e, element)) {
      client.state = "enter";
      onenter(eventPosition(e));
    }
  });
};
var dragover = (root2, clients) => (e) => {
  e.preventDefault();
  const dataTransfer = e.dataTransfer;
  requestDataTransferItems(dataTransfer).then((items) => {
    let overDropTarget = false;
    clients.some((client) => {
      const { filterElement, element, onenter, onexit, ondrag, allowdrop } = client;
      setDropEffect(dataTransfer, "copy");
      const allowsTransfer = allowdrop(items);
      if (!allowsTransfer) {
        setDropEffect(dataTransfer, "none");
        return;
      }
      if (isEventTarget(e, element)) {
        overDropTarget = true;
        if (client.state === null) {
          client.state = "enter";
          onenter(eventPosition(e));
          return;
        }
        client.state = "over";
        if (filterElement && !allowsTransfer) {
          setDropEffect(dataTransfer, "none");
          return;
        }
        ondrag(eventPosition(e));
      } else {
        if (filterElement && !overDropTarget) {
          setDropEffect(dataTransfer, "none");
        }
        if (client.state) {
          client.state = null;
          onexit(eventPosition(e));
        }
      }
    });
  });
};
var drop = (root2, clients) => (e) => {
  e.preventDefault();
  const dataTransfer = e.dataTransfer;
  requestDataTransferItems(dataTransfer).then((items) => {
    clients.forEach((client) => {
      const { filterElement, element, ondrop, onexit, allowdrop } = client;
      client.state = null;
      if (filterElement && !isEventTarget(e, element)) return;
      if (!allowdrop(items)) return onexit(eventPosition(e));
      ondrop(eventPosition(e), items);
    });
  });
};
var dragleave = (root2, clients) => (e) => {
  if (initialTarget !== e.target) {
    return;
  }
  clients.forEach((client) => {
    const { onexit } = client;
    client.state = null;
    onexit(eventPosition(e));
  });
};
var createHopper = (scope, validateItems, options) => {
  scope.classList.add("filepond--hopper");
  const { catchesDropsOnPage, requiresDropOnElement, filterItems = (items) => items } = options;
  const client = createDragNDropClient(
    scope,
    catchesDropsOnPage ? document.documentElement : scope,
    requiresDropOnElement
  );
  let lastState = "";
  let currentState = "";
  client.allowdrop = (items) => {
    return validateItems(filterItems(items));
  };
  client.ondrop = (position, items) => {
    const filteredItems = filterItems(items);
    if (!validateItems(filteredItems)) {
      api.ondragend(position);
      return;
    }
    currentState = "drag-drop";
    api.onload(filteredItems, position);
  };
  client.ondrag = (position) => {
    api.ondrag(position);
  };
  client.onenter = (position) => {
    currentState = "drag-over";
    api.ondragstart(position);
  };
  client.onexit = (position) => {
    currentState = "drag-exit";
    api.ondragend(position);
  };
  const api = {
    updateHopperState: () => {
      if (lastState !== currentState) {
        scope.dataset.hopperState = currentState;
        lastState = currentState;
      }
    },
    onload: () => {
    },
    ondragstart: () => {
    },
    ondrag: () => {
    },
    ondragend: () => {
    },
    destroy: () => {
      client.destroy();
    }
  };
  return api;
};
var listening = false;
var listeners$1 = [];
var handlePaste = (e) => {
  const activeEl = document.activeElement;
  const isActiveElementEditable = activeEl && (/textarea|input/i.test(activeEl.nodeName) || activeEl.getAttribute("contenteditable") === "true" || activeEl.getAttribute("contenteditable") === "");
  if (isActiveElementEditable) {
    let inScope = false;
    let element = activeEl;
    while (element !== document.body) {
      if (element.classList.contains("filepond--root")) {
        inScope = true;
        break;
      }
      element = element.parentNode;
    }
    if (!inScope) return;
  }
  requestDataTransferItems(e.clipboardData).then((files) => {
    if (!files.length) {
      return;
    }
    listeners$1.forEach((listener) => listener(files));
  });
};
var listen = (cb) => {
  if (listeners$1.includes(cb)) {
    return;
  }
  listeners$1.push(cb);
  if (listening) {
    return;
  }
  listening = true;
  document.addEventListener("paste", handlePaste);
};
var unlisten = (listener) => {
  arrayRemove(listeners$1, listeners$1.indexOf(listener));
  if (listeners$1.length === 0) {
    document.removeEventListener("paste", handlePaste);
    listening = false;
  }
};
var createPaster = () => {
  const cb = (files) => {
    api.onload(files);
  };
  const api = {
    destroy: () => {
      unlisten(cb);
    },
    onload: () => {
    }
  };
  listen(cb);
  return api;
};
var create$d = ({ root: root2, props }) => {
  root2.element.id = `filepond--assistant-${props.id}`;
  attr(root2.element, "role", "alert");
  attr(root2.element, "aria-live", "polite");
  attr(root2.element, "aria-relevant", "additions");
};
var addFilesNotificationTimeout = null;
var notificationClearTimeout = null;
var filenames = [];
var assist = (root2, message) => {
  root2.element.textContent = message;
};
var clear$1 = (root2) => {
  root2.element.textContent = "";
};
var listModified = (root2, filename, label) => {
  const total = root2.query("GET_TOTAL_ITEMS");
  assist(
    root2,
    `${label} ${filename}, ${total} ${total === 1 ? root2.query("GET_LABEL_FILE_COUNT_SINGULAR") : root2.query("GET_LABEL_FILE_COUNT_PLURAL")}`
  );
  clearTimeout(notificationClearTimeout);
  notificationClearTimeout = setTimeout(() => {
    clear$1(root2);
  }, 1500);
};
var isUsingFilePond = (root2) => root2.element.parentNode.contains(document.activeElement);
var itemAdded = ({ root: root2, action }) => {
  if (!isUsingFilePond(root2)) {
    return;
  }
  root2.element.textContent = "";
  const item2 = root2.query("GET_ITEM", action.id);
  filenames.push(item2.filename);
  clearTimeout(addFilesNotificationTimeout);
  addFilesNotificationTimeout = setTimeout(() => {
    listModified(root2, filenames.join(", "), root2.query("GET_LABEL_FILE_ADDED"));
    filenames.length = 0;
  }, 750);
};
var itemRemoved = ({ root: root2, action }) => {
  if (!isUsingFilePond(root2)) {
    return;
  }
  const item2 = action.item;
  listModified(root2, item2.filename, root2.query("GET_LABEL_FILE_REMOVED"));
};
var itemProcessed = ({ root: root2, action }) => {
  const item2 = root2.query("GET_ITEM", action.id);
  const filename = item2.filename;
  const label = root2.query("GET_LABEL_FILE_PROCESSING_COMPLETE");
  assist(root2, `${filename} ${label}`);
};
var itemProcessedUndo = ({ root: root2, action }) => {
  const item2 = root2.query("GET_ITEM", action.id);
  const filename = item2.filename;
  const label = root2.query("GET_LABEL_FILE_PROCESSING_ABORTED");
  assist(root2, `${filename} ${label}`);
};
var itemError = ({ root: root2, action }) => {
  const item2 = root2.query("GET_ITEM", action.id);
  const filename = item2.filename;
  assist(root2, `${action.status.main} ${filename} ${action.status.sub}`);
};
var assistant = createView({
  create: create$d,
  ignoreRect: true,
  ignoreRectUpdate: true,
  write: createRoute({
    DID_LOAD_ITEM: itemAdded,
    DID_REMOVE_ITEM: itemRemoved,
    DID_COMPLETE_ITEM_PROCESSING: itemProcessed,
    DID_ABORT_ITEM_PROCESSING: itemProcessedUndo,
    DID_REVERT_ITEM_PROCESSING: itemProcessedUndo,
    DID_THROW_ITEM_REMOVE_ERROR: itemError,
    DID_THROW_ITEM_LOAD_ERROR: itemError,
    DID_THROW_ITEM_INVALID: itemError,
    DID_THROW_ITEM_PROCESSING_ERROR: itemError
  }),
  tag: "span",
  name: "assistant"
});
var toCamels = (string, separator = "-") => string.replace(new RegExp(`${separator}.`, "g"), (sub) => sub.charAt(1).toUpperCase());
var debounce = (func, interval = 16, immidiateOnly = true) => {
  let last = Date.now();
  let timeout = null;
  return (...args) => {
    clearTimeout(timeout);
    const dist = Date.now() - last;
    const fn2 = () => {
      last = Date.now();
      func(...args);
    };
    if (dist < interval) {
      if (!immidiateOnly) {
        timeout = setTimeout(fn2, interval - dist);
      }
    } else {
      fn2();
    }
  };
};
var MAX_FILES_LIMIT = 1e6;
var prevent = (e) => e.preventDefault();
var create$e = ({ root: root2, props }) => {
  const id = root2.query("GET_ID");
  if (id) {
    root2.element.id = id;
  }
  const className = root2.query("GET_CLASS_NAME");
  if (className) {
    className.split(" ").filter((name2) => name2.length).forEach((name2) => {
      root2.element.classList.add(name2);
    });
  }
  root2.ref.label = root2.appendChildView(
    root2.createChildView(dropLabel, {
      ...props,
      translateY: null,
      caption: root2.query("GET_LABEL_IDLE")
    })
  );
  root2.ref.list = root2.appendChildView(root2.createChildView(listScroller, { translateY: null }));
  root2.ref.panel = root2.appendChildView(root2.createChildView(panel, { name: "panel-root" }));
  root2.ref.assistant = root2.appendChildView(root2.createChildView(assistant, { ...props }));
  root2.ref.data = root2.appendChildView(root2.createChildView(data, { ...props }));
  root2.ref.measure = createElement$1("div");
  root2.ref.measure.style.height = "100%";
  root2.element.appendChild(root2.ref.measure);
  root2.ref.bounds = null;
  root2.query("GET_STYLES").filter((style) => !isEmpty(style.value)).map(({ name: name2, value }) => {
    root2.element.dataset[name2] = value;
  });
  root2.ref.widthPrevious = null;
  root2.ref.widthUpdated = debounce(() => {
    root2.ref.updateHistory = [];
    root2.dispatch("DID_RESIZE_ROOT");
  }, 250);
  root2.ref.previousAspectRatio = null;
  root2.ref.updateHistory = [];
  const canHover = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
  const hasPointerEvents = "PointerEvent" in window;
  if (root2.query("GET_ALLOW_REORDER") && hasPointerEvents && !canHover) {
    root2.element.addEventListener("touchmove", prevent, { passive: false });
    root2.element.addEventListener("gesturestart", prevent);
  }
  const credits = root2.query("GET_CREDITS");
  const hasCredits = credits.length === 2;
  if (hasCredits) {
    const frag = document.createElement("a");
    frag.className = "filepond--credits";
    frag.href = credits[0];
    frag.tabIndex = -1;
    frag.target = "_blank";
    frag.rel = "noopener noreferrer nofollow";
    frag.textContent = credits[1];
    root2.element.appendChild(frag);
    root2.ref.credits = frag;
  }
};
var write$9 = ({ root: root2, props, actions: actions2 }) => {
  route$5({ root: root2, props, actions: actions2 });
  actions2.filter((action) => /^DID_SET_STYLE_/.test(action.type)).filter((action) => !isEmpty(action.data.value)).map(({ type, data: data2 }) => {
    const name2 = toCamels(type.substring(8).toLowerCase(), "_");
    root2.element.dataset[name2] = data2.value;
    root2.invalidateLayout();
  });
  if (root2.rect.element.hidden) return;
  if (root2.rect.element.width !== root2.ref.widthPrevious) {
    root2.ref.widthPrevious = root2.rect.element.width;
    root2.ref.widthUpdated();
  }
  let bounds = root2.ref.bounds;
  if (!bounds) {
    bounds = root2.ref.bounds = calculateRootBoundingBoxHeight(root2);
    root2.element.removeChild(root2.ref.measure);
    root2.ref.measure = null;
  }
  const { hopper, label, list: list2, panel: panel2 } = root2.ref;
  if (hopper) {
    hopper.updateHopperState();
  }
  const aspectRatio = root2.query("GET_PANEL_ASPECT_RATIO");
  const isMultiItem = root2.query("GET_ALLOW_MULTIPLE");
  const totalItems = root2.query("GET_TOTAL_ITEMS");
  const maxItems = isMultiItem ? root2.query("GET_MAX_FILES") || MAX_FILES_LIMIT : 1;
  const atMaxCapacity = totalItems === maxItems;
  const addAction = actions2.find((action) => action.type === "DID_ADD_ITEM");
  if (atMaxCapacity && addAction) {
    const interactionMethod = addAction.data.interactionMethod;
    label.opacity = 0;
    if (isMultiItem) {
      label.translateY = -40;
    } else {
      if (interactionMethod === InteractionMethod.API) {
        label.translateX = 40;
      } else if (interactionMethod === InteractionMethod.BROWSE) {
        label.translateY = 40;
      } else {
        label.translateY = 30;
      }
    }
  } else if (!atMaxCapacity) {
    label.opacity = 1;
    label.translateX = 0;
    label.translateY = 0;
  }
  const listItemMargin = calculateListItemMargin(root2);
  const listHeight = calculateListHeight(root2);
  const labelHeight = label.rect.element.height;
  const currentLabelHeight = !isMultiItem || atMaxCapacity ? 0 : labelHeight;
  const listMarginTop = atMaxCapacity ? list2.rect.element.marginTop : 0;
  const listMarginBottom = totalItems === 0 ? 0 : list2.rect.element.marginBottom;
  const visualHeight = currentLabelHeight + listMarginTop + listHeight.visual + listMarginBottom;
  const boundsHeight = currentLabelHeight + listMarginTop + listHeight.bounds + listMarginBottom;
  list2.translateY = Math.max(0, currentLabelHeight - list2.rect.element.marginTop) - listItemMargin.top;
  if (aspectRatio) {
    const width = root2.rect.element.width;
    const height = width * aspectRatio;
    if (aspectRatio !== root2.ref.previousAspectRatio) {
      root2.ref.previousAspectRatio = aspectRatio;
      root2.ref.updateHistory = [];
    }
    const history = root2.ref.updateHistory;
    history.push(width);
    const MAX_BOUNCES = 2;
    if (history.length > MAX_BOUNCES * 2) {
      const l = history.length;
      const bottom = l - 10;
      let bounces = 0;
      for (let i = l; i >= bottom; i--) {
        if (history[i] === history[i - 2]) {
          bounces++;
        }
        if (bounces >= MAX_BOUNCES) {
          return;
        }
      }
    }
    panel2.scalable = false;
    panel2.height = height;
    const listAvailableHeight = (
      // the height of the panel minus the label height
      height - currentLabelHeight - // the room we leave open between the end of the list and the panel bottom
      (listMarginBottom - listItemMargin.bottom) - // if we're full we need to leave some room between the top of the panel and the list
      (atMaxCapacity ? listMarginTop : 0)
    );
    if (listHeight.visual > listAvailableHeight) {
      list2.overflow = listAvailableHeight;
    } else {
      list2.overflow = null;
    }
    root2.height = height;
  } else if (bounds.fixedHeight) {
    panel2.scalable = false;
    const listAvailableHeight = (
      // the height of the panel minus the label height
      bounds.fixedHeight - currentLabelHeight - // the room we leave open between the end of the list and the panel bottom
      (listMarginBottom - listItemMargin.bottom) - // if we're full we need to leave some room between the top of the panel and the list
      (atMaxCapacity ? listMarginTop : 0)
    );
    if (listHeight.visual > listAvailableHeight) {
      list2.overflow = listAvailableHeight;
    } else {
      list2.overflow = null;
    }
  } else if (bounds.cappedHeight) {
    const isCappedHeight = visualHeight >= bounds.cappedHeight;
    const panelHeight = Math.min(bounds.cappedHeight, visualHeight);
    panel2.scalable = true;
    panel2.height = isCappedHeight ? panelHeight : panelHeight - listItemMargin.top - listItemMargin.bottom;
    const listAvailableHeight = (
      // the height of the panel minus the label height
      panelHeight - currentLabelHeight - // the room we leave open between the end of the list and the panel bottom
      (listMarginBottom - listItemMargin.bottom) - // if we're full we need to leave some room between the top of the panel and the list
      (atMaxCapacity ? listMarginTop : 0)
    );
    if (visualHeight > bounds.cappedHeight && listHeight.visual > listAvailableHeight) {
      list2.overflow = listAvailableHeight;
    } else {
      list2.overflow = null;
    }
    root2.height = Math.min(
      bounds.cappedHeight,
      boundsHeight - listItemMargin.top - listItemMargin.bottom
    );
  } else {
    const itemMargin = totalItems > 0 ? listItemMargin.top + listItemMargin.bottom : 0;
    panel2.scalable = true;
    panel2.height = Math.max(labelHeight, visualHeight - itemMargin);
    root2.height = Math.max(labelHeight, boundsHeight - itemMargin);
  }
  if (root2.ref.credits && panel2.heightCurrent)
    root2.ref.credits.style.transform = `translateY(${panel2.heightCurrent}px)`;
};
var calculateListItemMargin = (root2) => {
  const item2 = root2.ref.list.childViews[0].childViews[0];
  return item2 ? {
    top: item2.rect.element.marginTop,
    bottom: item2.rect.element.marginBottom
  } : {
    top: 0,
    bottom: 0
  };
};
var calculateListHeight = (root2) => {
  let visual = 0;
  let bounds = 0;
  const scrollList = root2.ref.list;
  const itemList = scrollList.childViews[0];
  const visibleChildren = itemList.childViews.filter((child) => child.rect.element.height);
  const children = root2.query("GET_ACTIVE_ITEMS").map((item2) => visibleChildren.find((child) => child.id === item2.id)).filter((item2) => item2);
  if (children.length === 0) return { visual, bounds };
  const horizontalSpace = itemList.rect.element.width;
  const dragIndex = getItemIndexByPosition(itemList, children, scrollList.dragCoordinates);
  const childRect = children[0].rect.element;
  const itemVerticalMargin = childRect.marginTop + childRect.marginBottom;
  const itemHorizontalMargin = childRect.marginLeft + childRect.marginRight;
  const itemWidth = childRect.width + itemHorizontalMargin;
  const itemHeight = childRect.height + itemVerticalMargin;
  const newItem = typeof dragIndex !== "undefined" && dragIndex >= 0 ? 1 : 0;
  const removedItem = children.find((child) => child.markedForRemoval && child.opacity < 0.45) ? -1 : 0;
  const verticalItemCount = children.length + newItem + removedItem;
  const itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);
  if (itemsPerRow === 1) {
    children.forEach((item2) => {
      const height = item2.rect.element.height + itemVerticalMargin;
      bounds += height;
      visual += height * item2.opacity;
    });
  } else {
    bounds = Math.ceil(verticalItemCount / itemsPerRow) * itemHeight;
    visual = bounds;
  }
  return { visual, bounds };
};
var calculateRootBoundingBoxHeight = (root2) => {
  const height = root2.ref.measureHeight || null;
  const cappedHeight = parseInt(root2.style.maxHeight, 10) || null;
  const fixedHeight = height === 0 ? null : height;
  return {
    cappedHeight,
    fixedHeight
  };
};
var exceedsMaxFiles = (root2, items) => {
  const allowReplace = root2.query("GET_ALLOW_REPLACE");
  const allowMultiple = root2.query("GET_ALLOW_MULTIPLE");
  const totalItems = root2.query("GET_TOTAL_ITEMS");
  let maxItems = root2.query("GET_MAX_FILES");
  const totalBrowseItems = items.length;
  if (!allowMultiple && totalBrowseItems > 1) {
    root2.dispatch("DID_THROW_MAX_FILES", {
      source: items,
      error: createResponse("warning", 0, "Max files")
    });
    return true;
  }
  maxItems = allowMultiple ? maxItems : 1;
  if (!allowMultiple && allowReplace) {
    return false;
  }
  const hasMaxItems = isInt(maxItems);
  if (hasMaxItems && totalItems + totalBrowseItems > maxItems) {
    root2.dispatch("DID_THROW_MAX_FILES", {
      source: items,
      error: createResponse("warning", 0, "Max files")
    });
    return true;
  }
  return false;
};
var getDragIndex = (list2, children, position) => {
  const itemList = list2.childViews[0];
  return getItemIndexByPosition(itemList, children, {
    left: position.scopeLeft - itemList.rect.element.left,
    top: position.scopeTop - (list2.rect.outer.top + list2.rect.element.marginTop + list2.rect.element.scrollTop)
  });
};
var toggleDrop = (root2) => {
  const isAllowed = root2.query("GET_ALLOW_DROP");
  const isDisabled = root2.query("GET_DISABLED");
  const enabled = isAllowed && !isDisabled;
  if (enabled && !root2.ref.hopper) {
    const hopper = createHopper(
      root2.element,
      (items) => {
        const beforeDropFile = root2.query("GET_BEFORE_DROP_FILE") || (() => true);
        const dropValidation = root2.query("GET_DROP_VALIDATION");
        return dropValidation ? items.every(
          (item2) => applyFilters("ALLOW_HOPPER_ITEM", item2, {
            query: root2.query
          }).every((result) => result === true) && beforeDropFile(item2)
        ) : true;
      },
      {
        filterItems: (items) => {
          const ignoredFiles = root2.query("GET_IGNORED_FILES");
          return items.filter((item2) => {
            if (isFile(item2)) {
              return !ignoredFiles.includes(item2.name.toLowerCase());
            }
            return true;
          });
        },
        catchesDropsOnPage: root2.query("GET_DROP_ON_PAGE"),
        requiresDropOnElement: root2.query("GET_DROP_ON_ELEMENT")
      }
    );
    hopper.onload = (items, position) => {
      const list2 = root2.ref.list.childViews[0];
      const visibleChildren = list2.childViews.filter((child) => child.rect.element.height);
      const children = root2.query("GET_ACTIVE_ITEMS").map((item2) => visibleChildren.find((child) => child.id === item2.id)).filter((item2) => item2);
      applyFilterChain("ADD_ITEMS", items, { dispatch: root2.dispatch }).then((queue) => {
        if (exceedsMaxFiles(root2, queue)) return false;
        root2.dispatch("ADD_ITEMS", {
          items: queue,
          index: getDragIndex(root2.ref.list, children, position),
          interactionMethod: InteractionMethod.DROP
        });
      });
      root2.dispatch("DID_DROP", { position });
      root2.dispatch("DID_END_DRAG", { position });
    };
    hopper.ondragstart = (position) => {
      root2.dispatch("DID_START_DRAG", { position });
    };
    hopper.ondrag = debounce((position) => {
      root2.dispatch("DID_DRAG", { position });
    });
    hopper.ondragend = (position) => {
      root2.dispatch("DID_END_DRAG", { position });
    };
    root2.ref.hopper = hopper;
    root2.ref.drip = root2.appendChildView(root2.createChildView(drip));
  } else if (!enabled && root2.ref.hopper) {
    root2.ref.hopper.destroy();
    root2.ref.hopper = null;
    root2.removeChildView(root2.ref.drip);
  }
};
var toggleBrowse = (root2, props) => {
  const isAllowed = root2.query("GET_ALLOW_BROWSE");
  const isDisabled = root2.query("GET_DISABLED");
  const enabled = isAllowed && !isDisabled;
  if (enabled && !root2.ref.browser) {
    root2.ref.browser = root2.appendChildView(
      root2.createChildView(browser, {
        ...props,
        onload: (items) => {
          applyFilterChain("ADD_ITEMS", items, {
            dispatch: root2.dispatch
          }).then((queue) => {
            if (exceedsMaxFiles(root2, queue)) return false;
            root2.dispatch("ADD_ITEMS", {
              items: queue,
              index: -1,
              interactionMethod: InteractionMethod.BROWSE
            });
          });
        }
      }),
      0
    );
  } else if (!enabled && root2.ref.browser) {
    root2.removeChildView(root2.ref.browser);
    root2.ref.browser = null;
  }
};
var togglePaste = (root2) => {
  const isAllowed = root2.query("GET_ALLOW_PASTE");
  const isDisabled = root2.query("GET_DISABLED");
  const enabled = isAllowed && !isDisabled;
  if (enabled && !root2.ref.paster) {
    root2.ref.paster = createPaster();
    root2.ref.paster.onload = (items) => {
      applyFilterChain("ADD_ITEMS", items, { dispatch: root2.dispatch }).then((queue) => {
        if (exceedsMaxFiles(root2, queue)) return false;
        root2.dispatch("ADD_ITEMS", {
          items: queue,
          index: -1,
          interactionMethod: InteractionMethod.PASTE
        });
      });
    };
  } else if (!enabled && root2.ref.paster) {
    root2.ref.paster.destroy();
    root2.ref.paster = null;
  }
};
var route$5 = createRoute({
  DID_SET_ALLOW_BROWSE: ({ root: root2, props }) => {
    toggleBrowse(root2, props);
  },
  DID_SET_ALLOW_DROP: ({ root: root2 }) => {
    toggleDrop(root2);
  },
  DID_SET_ALLOW_PASTE: ({ root: root2 }) => {
    togglePaste(root2);
  },
  DID_SET_DISABLED: ({ root: root2, props }) => {
    toggleDrop(root2);
    togglePaste(root2);
    toggleBrowse(root2, props);
    const isDisabled = root2.query("GET_DISABLED");
    if (isDisabled) {
      root2.element.dataset.disabled = "disabled";
    } else {
      root2.element.removeAttribute("data-disabled");
    }
  }
});
var root = createView({
  name: "root",
  read: ({ root: root2 }) => {
    if (root2.ref.measure) {
      root2.ref.measureHeight = root2.ref.measure.offsetHeight;
    }
  },
  create: create$e,
  write: write$9,
  destroy: ({ root: root2 }) => {
    if (root2.ref.paster) {
      root2.ref.paster.destroy();
    }
    if (root2.ref.hopper) {
      root2.ref.hopper.destroy();
    }
    root2.element.removeEventListener("touchmove", prevent);
    root2.element.removeEventListener("gesturestart", prevent);
  },
  mixins: {
    styles: ["height"]
  }
});
var createApp = (initialOptions = {}) => {
  let originalElement = null;
  const defaultOptions2 = getOptions();
  const store = createStore(
    // initial state (should be serializable)
    createInitialState(defaultOptions2),
    // queries
    [queries, createOptionQueries(defaultOptions2)],
    // action handlers
    [actions, createOptionActions(defaultOptions2)]
  );
  store.dispatch("SET_OPTIONS", { options: initialOptions });
  const visibilityHandler = () => {
    if (document.hidden) return;
    store.dispatch("KICK");
  };
  document.addEventListener("visibilitychange", visibilityHandler);
  let resizeDoneTimer = null;
  let isResizing = false;
  let isResizingHorizontally = false;
  let initialWindowWidth = null;
  let currentWindowWidth = null;
  const resizeHandler = () => {
    if (!isResizing) {
      isResizing = true;
    }
    clearTimeout(resizeDoneTimer);
    resizeDoneTimer = setTimeout(() => {
      isResizing = false;
      initialWindowWidth = null;
      currentWindowWidth = null;
      if (isResizingHorizontally) {
        isResizingHorizontally = false;
        store.dispatch("DID_STOP_RESIZE");
      }
    }, 500);
  };
  window.addEventListener("resize", resizeHandler);
  const view = root(store, { id: getUniqueId() });
  let isResting = false;
  let isHidden = false;
  const readWriteApi = {
    // necessary for update loop
    /**
     * Reads from dom (never call manually)
     * @private
     */
    _read: () => {
      if (isResizing) {
        currentWindowWidth = window.innerWidth;
        if (!initialWindowWidth) {
          initialWindowWidth = currentWindowWidth;
        }
        if (!isResizingHorizontally && currentWindowWidth !== initialWindowWidth) {
          store.dispatch("DID_START_RESIZE");
          isResizingHorizontally = true;
        }
      }
      if (isHidden && isResting) {
        isResting = view.element.offsetParent === null;
      }
      if (isResting) return;
      view._read();
      isHidden = view.rect.element.hidden;
    },
    /**
     * Writes to dom (never call manually)
     * @private
     */
    _write: (ts) => {
      const actions2 = store.processActionQueue().filter((action) => !/^SET_/.test(action.type));
      if (isResting && !actions2.length) return;
      routeActionsToEvents(actions2);
      isResting = view._write(ts, actions2, isResizingHorizontally);
      removeReleasedItems(store.query("GET_ITEMS"));
      if (isResting) {
        store.processDispatchQueue();
      }
    }
  };
  const createEvent = (name2) => (data2) => {
    const event = {
      type: name2
    };
    if (!data2) {
      return event;
    }
    if (data2.hasOwnProperty("error")) {
      event.error = data2.error ? { ...data2.error } : null;
    }
    if (data2.status) {
      event.status = { ...data2.status };
    }
    if (data2.file) {
      event.output = data2.file;
    }
    if (data2.source) {
      event.file = data2.source;
    } else if (data2.item || data2.id) {
      const item2 = data2.item ? data2.item : store.query("GET_ITEM", data2.id);
      event.file = item2 ? createItemAPI(item2) : null;
    }
    if (data2.items) {
      event.items = data2.items.map(createItemAPI);
    }
    if (/progress/.test(name2)) {
      event.progress = data2.progress;
    }
    if (data2.hasOwnProperty("origin") && data2.hasOwnProperty("target")) {
      event.origin = data2.origin;
      event.target = data2.target;
    }
    return event;
  };
  const eventRoutes = {
    DID_DESTROY: createEvent("destroy"),
    DID_INIT: createEvent("init"),
    DID_THROW_MAX_FILES: createEvent("warning"),
    DID_INIT_ITEM: createEvent("initfile"),
    DID_START_ITEM_LOAD: createEvent("addfilestart"),
    DID_UPDATE_ITEM_LOAD_PROGRESS: createEvent("addfileprogress"),
    DID_LOAD_ITEM: createEvent("addfile"),
    DID_THROW_ITEM_INVALID: [createEvent("error"), createEvent("addfile")],
    DID_THROW_ITEM_LOAD_ERROR: [createEvent("error"), createEvent("addfile")],
    DID_THROW_ITEM_REMOVE_ERROR: [createEvent("error"), createEvent("removefile")],
    DID_PREPARE_OUTPUT: createEvent("preparefile"),
    DID_START_ITEM_PROCESSING: createEvent("processfilestart"),
    DID_UPDATE_ITEM_PROCESS_PROGRESS: createEvent("processfileprogress"),
    DID_ABORT_ITEM_PROCESSING: createEvent("processfileabort"),
    DID_COMPLETE_ITEM_PROCESSING: createEvent("processfile"),
    DID_COMPLETE_ITEM_PROCESSING_ALL: createEvent("processfiles"),
    DID_REVERT_ITEM_PROCESSING: createEvent("processfilerevert"),
    DID_THROW_ITEM_PROCESSING_ERROR: [createEvent("error"), createEvent("processfile")],
    DID_REMOVE_ITEM: createEvent("removefile"),
    DID_UPDATE_ITEMS: createEvent("updatefiles"),
    DID_ACTIVATE_ITEM: createEvent("activatefile"),
    DID_REORDER_ITEMS: createEvent("reorderfiles")
  };
  const exposeEvent = (event) => {
    const detail = { pond: exports, ...event };
    delete detail.type;
    view.element.dispatchEvent(
      new CustomEvent(`FilePond:${event.type}`, {
        // event info
        detail,
        // event behaviour
        bubbles: true,
        cancelable: true,
        composed: true
        // triggers listeners outside of shadow root
      })
    );
    const params = [];
    if (event.hasOwnProperty("error")) {
      params.push(event.error);
    }
    if (event.hasOwnProperty("file")) {
      params.push(event.file);
    }
    const filtered = ["type", "error", "file"];
    Object.keys(event).filter((key) => !filtered.includes(key)).forEach((key) => params.push(event[key]));
    exports.fire(event.type, ...params);
    const handler = store.query(`GET_ON${event.type.toUpperCase()}`);
    if (handler) {
      handler(...params);
    }
  };
  const routeActionsToEvents = (actions2) => {
    if (!actions2.length) return;
    actions2.filter((action) => eventRoutes[action.type]).forEach((action) => {
      const routes = eventRoutes[action.type];
      (Array.isArray(routes) ? routes : [routes]).forEach((route2) => {
        if (action.type === "DID_INIT_ITEM") {
          exposeEvent(route2(action.data));
        } else {
          setTimeout(() => {
            exposeEvent(route2(action.data));
          }, 0);
        }
      });
    });
  };
  const setOptions2 = (options) => store.dispatch("SET_OPTIONS", { options });
  const getFile = (query) => store.query("GET_ACTIVE_ITEM", query);
  const prepareFile = (query) => new Promise((resolve, reject) => {
    store.dispatch("REQUEST_ITEM_PREPARE", {
      query,
      success: (item2) => {
        resolve(item2);
      },
      failure: (error2) => {
        reject(error2);
      }
    });
  });
  const addFile = (source, options = {}) => new Promise((resolve, reject) => {
    addFiles([{ source, options }], { index: options.index }).then((items) => resolve(items && items[0])).catch(reject);
  });
  const isFilePondFile = (obj) => obj.file && obj.id;
  const removeFile = (query, options) => {
    if (typeof query === "object" && !isFilePondFile(query) && !options) {
      options = query;
      query = void 0;
    }
    store.dispatch("REMOVE_ITEM", { ...options, query });
    return store.query("GET_ACTIVE_ITEM", query) === null;
  };
  const addFiles = (...args) => new Promise((resolve, reject) => {
    const sources = [];
    const options = {};
    if (isArray(args[0])) {
      sources.push.apply(sources, args[0]);
      Object.assign(options, args[1] || {});
    } else {
      const lastArgument = args[args.length - 1];
      if (typeof lastArgument === "object" && !(lastArgument instanceof Blob)) {
        Object.assign(options, args.pop());
      }
      sources.push(...args);
    }
    store.dispatch("ADD_ITEMS", {
      items: sources,
      index: options.index,
      interactionMethod: InteractionMethod.API,
      success: resolve,
      failure: reject
    });
  });
  const getFiles2 = () => store.query("GET_ACTIVE_ITEMS");
  const processFile = (query) => new Promise((resolve, reject) => {
    store.dispatch("REQUEST_ITEM_PROCESSING", {
      query,
      success: (item2) => {
        resolve(item2);
      },
      failure: (error2) => {
        reject(error2);
      }
    });
  });
  const prepareFiles = (...args) => {
    const queries2 = Array.isArray(args[0]) ? args[0] : args;
    const items = queries2.length ? queries2 : getFiles2();
    return Promise.all(items.map(prepareFile));
  };
  const processFiles = (...args) => {
    const queries2 = Array.isArray(args[0]) ? args[0] : args;
    if (!queries2.length) {
      const files = getFiles2().filter(
        (item2) => !(item2.status === ItemStatus.IDLE && item2.origin === FileOrigin.LOCAL) && item2.status !== ItemStatus.PROCESSING && item2.status !== ItemStatus.PROCESSING_COMPLETE && item2.status !== ItemStatus.PROCESSING_REVERT_ERROR
      );
      return Promise.all(files.map(processFile));
    }
    return Promise.all(queries2.map(processFile));
  };
  const removeFiles = (...args) => {
    const queries2 = Array.isArray(args[0]) ? args[0] : args;
    let options;
    if (typeof queries2[queries2.length - 1] === "object") {
      options = queries2.pop();
    } else if (Array.isArray(args[0])) {
      options = args[1];
    }
    const files = getFiles2();
    if (!queries2.length) return Promise.all(files.map((file2) => removeFile(file2, options)));
    const mappedQueries = queries2.map((query) => isNumber(query) ? files[query] ? files[query].id : null : query).filter((query) => query);
    return mappedQueries.map((q) => removeFile(q, options));
  };
  const exports = {
    // supports events
    ...on(),
    // inject private api methods
    ...readWriteApi,
    // inject all getters and setters
    ...createOptionAPI(store, defaultOptions2),
    /**
     * Override options defined in options object
     * @param options
     */
    setOptions: setOptions2,
    /**
     * Load the given file
     * @param source - the source of the file (either a File, base64 data uri or url)
     * @param options - object, { index: 0 }
     */
    addFile,
    /**
     * Load the given files
     * @param sources - the sources of the files to load
     * @param options - object, { index: 0 }
     */
    addFiles,
    /**
     * Returns the file objects matching the given query
     * @param query { string, number, null }
     */
    getFile,
    /**
     * Upload file with given name
     * @param query { string, number, null  }
     */
    processFile,
    /**
     * Request prepare output for file with given name
     * @param query { string, number, null  }
     */
    prepareFile,
    /**
     * Removes a file by its name
     * @param query { string, number, null  }
     */
    removeFile,
    /**
     * Moves a file to a new location in the files list
     */
    moveFile: (query, index) => store.dispatch("MOVE_ITEM", { query, index }),
    /**
     * Returns all files (wrapped in public api)
     */
    getFiles: getFiles2,
    /**
     * Starts uploading all files
     */
    processFiles,
    /**
     * Clears all files from the files list
     */
    removeFiles,
    /**
     * Starts preparing output of all files
     */
    prepareFiles,
    /**
     * Sort list of files
     */
    sort: (compare) => store.dispatch("SORT", { compare }),
    /**
     * Browse the file system for a file
     */
    browse: () => {
      var input = view.element.querySelector("input[type=file]");
      if (input) {
        input.click();
      }
    },
    /**
     * Destroys the app
     */
    destroy: () => {
      exports.fire("destroy", view.element);
      store.dispatch("ABORT_ALL");
      view._destroy();
      window.removeEventListener("resize", resizeHandler);
      document.removeEventListener("visibilitychange", visibilityHandler);
      store.dispatch("DID_DESTROY");
    },
    /**
     * Inserts the plugin before the target element
     */
    insertBefore: (element) => insertBefore(view.element, element),
    /**
     * Inserts the plugin after the target element
     */
    insertAfter: (element) => insertAfter(view.element, element),
    /**
     * Appends the plugin to the target element
     */
    appendTo: (element) => element.appendChild(view.element),
    /**
     * Replaces an element with the app
     */
    replaceElement: (element) => {
      insertBefore(view.element, element);
      element.parentNode.removeChild(element);
      originalElement = element;
    },
    /**
     * Restores the original element
     */
    restoreElement: () => {
      if (!originalElement) {
        return;
      }
      insertAfter(originalElement, view.element);
      view.element.parentNode.removeChild(view.element);
      originalElement = null;
    },
    /**
     * Returns true if the app root is attached to given element
     * @param element
     */
    isAttachedTo: (element) => view.element === element || originalElement === element,
    /**
     * Returns the root element
     */
    element: {
      get: () => view.element
    },
    /**
     * Returns the current pond status
     */
    status: {
      get: () => store.query("GET_STATUS")
    }
  };
  store.dispatch("DID_INIT");
  return createObject(exports);
};
var createAppObject = (customOptions = {}) => {
  const defaultOptions2 = {};
  forin(getOptions(), (key, value) => {
    defaultOptions2[key] = value[0];
  });
  const app = createApp({
    // default options
    ...defaultOptions2,
    // custom options
    ...customOptions
  });
  return app;
};
var lowerCaseFirstLetter = (string) => string.charAt(0).toLowerCase() + string.slice(1);
var attributeNameToPropertyName = (attributeName) => toCamels(attributeName.replace(/^data-/, ""));
var mapObject = (object, propertyMap) => {
  forin(propertyMap, (selector, mapping) => {
    forin(object, (property, value) => {
      const selectorRegExp = new RegExp(selector);
      const matches = selectorRegExp.test(property);
      if (!matches) {
        return;
      }
      delete object[property];
      if (mapping === false) {
        return;
      }
      if (isString(mapping)) {
        object[mapping] = value;
        return;
      }
      const group = mapping.group;
      if (isObject(mapping) && !object[group]) {
        object[group] = {};
      }
      object[group][lowerCaseFirstLetter(property.replace(selectorRegExp, ""))] = value;
    });
    if (mapping.mapping) {
      mapObject(object[mapping.group], mapping.mapping);
    }
  });
};
var getAttributesAsObject = (node, attributeMapping = {}) => {
  const attributes = [];
  forin(node.attributes, (index) => {
    attributes.push(node.attributes[index]);
  });
  const output = attributes.filter((attribute) => attribute.name).reduce((obj, attribute) => {
    const value = attr(node, attribute.name);
    obj[attributeNameToPropertyName(attribute.name)] = value === attribute.name ? true : value;
    return obj;
  }, {});
  mapObject(output, attributeMapping);
  return output;
};
var createAppAtElement = (element, options = {}) => {
  const attributeMapping = {
    // translate to other name
    "^class$": "className",
    "^multiple$": "allowMultiple",
    "^capture$": "captureMethod",
    "^webkitdirectory$": "allowDirectoriesOnly",
    // group under single property
    "^server": {
      group: "server",
      mapping: {
        "^process": {
          group: "process"
        },
        "^revert": {
          group: "revert"
        },
        "^fetch": {
          group: "fetch"
        },
        "^restore": {
          group: "restore"
        },
        "^load": {
          group: "load"
        }
      }
    },
    // don't include in object
    "^type$": false,
    "^files$": false
  };
  applyFilters("SET_ATTRIBUTE_TO_OPTION_MAP", attributeMapping);
  const mergedOptions = {
    ...options
  };
  const attributeOptions = getAttributesAsObject(
    element.nodeName === "FIELDSET" ? element.querySelector("input[type=file]") : element,
    attributeMapping
  );
  Object.keys(attributeOptions).forEach((key) => {
    if (isObject(attributeOptions[key])) {
      if (!isObject(mergedOptions[key])) {
        mergedOptions[key] = {};
      }
      Object.assign(mergedOptions[key], attributeOptions[key]);
    } else {
      mergedOptions[key] = attributeOptions[key];
    }
  });
  mergedOptions.files = (options.files || []).concat(
    Array.from(element.querySelectorAll("input:not([type=file])")).map((input) => ({
      source: input.value,
      options: {
        type: input.dataset.type
      }
    }))
  );
  const app = createAppObject(mergedOptions);
  if (element.files) {
    Array.from(element.files).forEach((file2) => {
      app.addFile(file2);
    });
  }
  app.replaceElement(element);
  return app;
};
var createApp$1 = (...args) => isNode(args[0]) ? createAppAtElement(...args) : createAppObject(...args);
var PRIVATE_METHODS = ["fire", "_read", "_write"];
var createAppAPI = (app) => {
  const api = {};
  copyObjectPropertiesToObject(app, api, PRIVATE_METHODS);
  return api;
};
var replaceInString = (string, replacements) => string.replace(/(?:{([a-zA-Z]+)})/g, (match, group) => replacements[group]);
var createWorker = (fn2) => {
  const workerBlob = new Blob(["(", fn2.toString(), ")()"], {
    type: "application/javascript"
  });
  const workerURL = URL.createObjectURL(workerBlob);
  const worker = new Worker(workerURL);
  return {
    transfer: (message, cb) => {
    },
    post: (message, cb, transferList) => {
      const id = getUniqueId();
      worker.onmessage = (e) => {
        if (e.data.id === id) {
          cb(e.data.message);
        }
      };
      worker.postMessage(
        {
          id,
          message
        },
        transferList
      );
    },
    terminate: () => {
      worker.terminate();
      URL.revokeObjectURL(workerURL);
    }
  };
};
var loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    resolve(img);
  };
  img.onerror = (e) => {
    reject(e);
  };
  img.src = url;
});
var renameFile = (file2, name2) => {
  const renamedFile = file2.slice(0, file2.size, file2.type);
  renamedFile.lastModifiedDate = file2.lastModifiedDate;
  renamedFile.name = name2;
  return renamedFile;
};
var copyFile = (file2) => renameFile(file2, file2.name);
var registeredPlugins = [];
var createAppPlugin = (plugin) => {
  if (registeredPlugins.includes(plugin)) {
    return;
  }
  registeredPlugins.push(plugin);
  const pluginOutline = plugin({
    addFilter,
    utils: {
      Type,
      forin,
      isString,
      isFile,
      toNaturalFileSize,
      replaceInString,
      getExtensionFromFilename,
      getFilenameWithoutExtension,
      guesstimateMimeType,
      getFileFromBlob,
      getFilenameFromURL,
      createRoute,
      createWorker,
      createView,
      createItemAPI,
      loadImage,
      copyFile,
      renameFile,
      createBlob,
      applyFilterChain,
      text,
      getNumericAspectRatioFromString
    },
    views: {
      fileActionButton
    }
  });
  extendDefaultOptions(pluginOutline.options);
};
var isOperaMini = () => Object.prototype.toString.call(window.operamini) === "[object OperaMini]";
var hasPromises = () => "Promise" in window;
var hasBlobSlice = () => "slice" in Blob.prototype;
var hasCreateObjectURL = () => "URL" in window && "createObjectURL" in window.URL;
var hasVisibility = () => "visibilityState" in document;
var hasTiming = () => "performance" in window;
var hasCSSSupports = () => "supports" in (window.CSS || {});
var isIE11 = () => /MSIE|Trident/.test(window.navigator.userAgent);
var supported = (() => {
  const isSupported = (
    // Has to be a browser
    isBrowser() && // Can't run on Opera Mini due to lack of everything
    !isOperaMini() && // Require these APIs to feature detect a modern browser
    hasVisibility() && hasPromises() && hasBlobSlice() && hasCreateObjectURL() && hasTiming() && // doesn't need CSSSupports but is a good way to detect Safari 9+ (we do want to support IE11 though)
    (hasCSSSupports() || isIE11())
  );
  return () => isSupported;
})();
var state = {
  // active app instances, used to redraw the apps and to find the later
  apps: []
};
var name = "filepond";
var fn = () => {
};
var Status$1 = {};
var FileStatus = {};
var FileOrigin$1 = {};
var OptionTypes = {};
var create$f = fn;
var destroy = fn;
var parse = fn;
var find = fn;
var registerPlugin = fn;
var getOptions$1 = fn;
var setOptions$1 = fn;
if (supported()) {
  createPainter(
    () => {
      state.apps.forEach((app) => app._read());
    },
    (ts) => {
      state.apps.forEach((app) => app._write(ts));
    }
  );
  const dispatch = () => {
    document.dispatchEvent(
      new CustomEvent("FilePond:loaded", {
        detail: {
          supported,
          create: create$f,
          destroy,
          parse,
          find,
          registerPlugin,
          setOptions: setOptions$1
        }
      })
    );
    document.removeEventListener("DOMContentLoaded", dispatch);
  };
  if (document.readyState !== "loading") {
    setTimeout(() => dispatch(), 0);
  } else {
    document.addEventListener("DOMContentLoaded", dispatch);
  }
  const updateOptionTypes = () => forin(getOptions(), (key, value) => {
    OptionTypes[key] = value[1];
  });
  Status$1 = { ...Status };
  FileOrigin$1 = { ...FileOrigin };
  FileStatus = { ...ItemStatus };
  OptionTypes = {};
  updateOptionTypes();
  create$f = (...args) => {
    const app = createApp$1(...args);
    app.on("destroy", destroy);
    state.apps.push(app);
    return createAppAPI(app);
  };
  destroy = (hook) => {
    const indexToRemove = state.apps.findIndex((app) => app.isAttachedTo(hook));
    if (indexToRemove >= 0) {
      const app = state.apps.splice(indexToRemove, 1)[0];
      app.restoreElement();
      return true;
    }
    return false;
  };
  parse = (context) => {
    const matchedHooks = Array.from(context.querySelectorAll(`.${name}`));
    const newHooks = matchedHooks.filter(
      (newHook) => !state.apps.find((app) => app.isAttachedTo(newHook))
    );
    return newHooks.map((hook) => create$f(hook));
  };
  find = (hook) => {
    const app = state.apps.find((app2) => app2.isAttachedTo(hook));
    if (!app) {
      return null;
    }
    return createAppAPI(app);
  };
  registerPlugin = (...plugins) => {
    plugins.forEach(createAppPlugin);
    updateOptionTypes();
  };
  getOptions$1 = () => {
    const opts = {};
    forin(getOptions(), (key, value) => {
      opts[key] = value[0];
    });
    return opts;
  };
  setOptions$1 = (opts) => {
    if (isObject(opts)) {
      state.apps.forEach((app) => {
        app.setOptions(opts);
      });
      setOptions(opts);
    }
    return getOptions$1();
  };
}

// resources/js/robusta-table.js
function filamentRobustaTable({ resizedConfig }) {
  const SELECTORS = {
    wrapper: ".fi-ta-content",
    table: ".fi-ta-table",
    headerCell: ".fi-table-header-cell-",
    cell: ".fi-table-cell-",
    resizeHandle: "column-resize-handle-bar",
    emptyHeaderCell: "th.fi-ta-actions-cell, th.fi-ta-cell.fi-ta-selection-cell",
    column: "x-robusta-table-column",
    excludeColumn: "x-robusta-table-exclude-column"
  };
  return {
    columns: null,
    excludedColumns: null,
    config: {
      minWidth: 50,
      maxWidth: -1,
      enable: false,
      fitContent: false,
      tableKey: null,
      ...resizedConfig
    },
    // state
    element: null,
    refs: {
      table: null,
      wrapper: null,
      content: null
    },
    state: {
      initialized: false,
      pendingUpdate: false,
      isLoading: false,
      totalWidth: 0,
      fitContentWidth: 0,
      currentResizeWidth: 0
    },
    livewireHookCleanup: null,
    abortController: null,
    init() {
      this.abortController = new AbortController();
      this.element = this.$el;
      this.initializeComponent();
      this.registerLivewireHooks();
    },
    registerLivewireHooks() {
      this.livewireHookCleanup = Livewire.hook("morph.updated", ({ el }) => {
        if (!this.element?.contains(el)) return;
        if (this.state.pendingUpdate) return;
        this.state.pendingUpdate = true;
        requestAnimationFrame(() => {
          if (this.element && document.body.contains(this.element)) {
            this.state.initialized = false;
            this.state.totalWidth = 0;
            this.initializeComponent();
          }
          this.state.pendingUpdate = false;
        });
      });
    },
    initializeComponent() {
      if (this.state.initialized) return;
      this.refs.wrapper = this.element.querySelector(SELECTORS.wrapper);
      this.refs.content = this.element.querySelector(SELECTORS.wrapper);
      this.refs.table = this.element.querySelector(SELECTORS.table);
      if (!this.refs.table || !this.refs.content) return;
      this.columns = this.refs.table.querySelectorAll(`[${SELECTORS.column}]`);
      this.excludedColumns = this.refs.table.querySelectorAll(`[${SELECTORS.excludeColumn}]`);
      if (this.config.fitContent) {
        this.calculateFitContentWidth();
      }
      this.initializeColumns();
      this.state.initialized = true;
    },
    calculateFitContentWidth() {
      if (!this.refs.wrapper) return;
      if (this.columns?.length === 0) return;
      let availableWidth = this.refs.wrapper.offsetWidth;
      this.refs.table.querySelectorAll(SELECTORS.emptyHeaderCell).forEach((cell) => {
        availableWidth -= cell.offsetWidth;
      });
      this.excludedColumns.forEach((column) => {
        availableWidth -= column.offsetWidth;
      });
      this.state.fitContentWidth = availableWidth / this.columns.length;
    },
    initializeColumns() {
      if (!this.config.enable || !this.columns.length) return;
      this.state.totalWidth = 0;
      this.columns.forEach((column) => {
        this.setupColumnHeader(column);
      });
      if (this.state.totalWidth > 0) {
        this.refs.table.style.width = `${this.state.totalWidth}px`;
      }
    },
    setupColumnHeader(column) {
      const columnName = this.getColumnName(column);
      column.classList.add(
        "relative",
        "group/column-resize",
        "overflow-hidden"
      );
      this.mountResizeHandle(column, columnName);
      const defaultKey = `${columnName}_default`;
      let width = this.getSavedWidth(columnName);
      const defaultWidth = this.getSavedWidth(defaultKey);
      if (!width && defaultWidth) {
        width = defaultWidth;
      }
      if (!width) {
        width = this.config.fitContent ? this.state.fitContentWidth : column.offsetWidth;
        if (width) this.saveColumnWidth(width, columnName, defaultKey);
      }
      if (width) {
        this.applyWidthToColumn(width, columnName);
        this.state.totalWidth += width;
      }
    },
    mountResizeHandle(column, columnName) {
      if (column.querySelector(`.${SELECTORS.resizeHandle}`)) return;
      const handle = document.createElement("button");
      handle.type = "button";
      handle.className = SELECTORS.resizeHandle;
      handle.title = "Resize column";
      handle.addEventListener("mousedown", (event) => {
        this.handleResizeStart(event, column, columnName);
      }, { signal: this.abortController.signal });
      handle.addEventListener("dblclick", (event) => {
        this.handleDoubleClick(event, column, columnName);
      }, { signal: this.abortController.signal });
      column.appendChild(handle);
    },
    handleResizeStart(event, column, columnName) {
      event.preventDefault();
      event.stopPropagation();
      const startX = event.pageX;
      const startWidth = column.offsetWidth;
      const startTableWidth = this.refs.table.offsetWidth;
      column.classList.add("resizing");
      const onMouseMove = this.throttle((moveEvent) => {
        const delta = moveEvent.pageX - startX;
        let newWidth = startWidth + delta - 16;
        const max = this.config.maxWidth === -1 ? Infinity : this.config.maxWidth;
        newWidth = Math.max(
          this.config.minWidth,
          Math.min(max, newWidth)
        );
        this.state.currentResizeWidth = Math.round(newWidth);
        const widthDiff = this.state.currentResizeWidth - startWidth;
        this.refs.table.style.width = `${startTableWidth + widthDiff}px`;
        this.applyWidthToColumn(
          this.state.currentResizeWidth,
          columnName
        );
      }, 16);
      const onMouseUp = () => {
        column.classList.remove("resizing");
        if (this.state.currentResizeWidth > 0) {
          this.saveColumnWidth(
            this.state.currentResizeWidth,
            columnName
          );
        }
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    handleDoubleClick(event, column, columnName) {
      event.preventDefault();
      event.stopPropagation();
      const defaultKey = `${columnName}_default`;
      const resetWidth = this.getSavedWidth(defaultKey) || this.config.minWidth;
      if (resetWidth !== column.offsetWidth) {
        this.applyWidthToColumn(resetWidth, columnName);
        this.saveColumnWidth(resetWidth, columnName);
      }
    },
    applyWidthToColumn(width, columnName) {
      if (!width || width <= 0) return;
      const name2 = this.sanitizeName(columnName);
      const widthPx = `${width}px`;
      const header = this.refs.table.querySelector(`${SELECTORS.headerCell}${name2}`);
      if (header) this.setElementWidth(header, widthPx);
      const cells = this.refs.table.querySelectorAll(`${SELECTORS.cell}${name2}`);
      cells.forEach((cell) => {
        this.setElementWidth(cell, widthPx);
        cell.style.overflow = "hidden";
        cell.style.textOverflow = "ellipsis";
        cell.style.whiteSpace = "nowrap";
      });
    },
    setElementWidth(element, width) {
      element.style.width = width;
      element.style.minWidth = width;
      element.style.maxWidth = width;
    },
    //  ---- Persistence ----
    saveColumnWidth(width, columnName, customKey = null) {
      const key = customKey || columnName;
      const max = this.config.maxWidth === -1 ? Infinity : this.config.maxWidth;
      const validWidth = Math.max(
        this.config.minWidth,
        Math.min(max, width)
      );
      sessionStorage.setItem(
        this.getStorageKey(key),
        validWidth.toString()
      );
    },
    getSavedWidth(name2) {
      const val = sessionStorage.getItem(this.getStorageKey(name2));
      return val ? parseInt(val, 10) : null;
    },
    getStorageKey(name2) {
      return `${this.config.tableKey}_columnWidth_${name2}`;
    },
    // ---- Helpers -----
    sanitizeName(name2) {
      return name2.split(".").map(
        (s) => s.replace(/_/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
      ).join("\\.");
    },
    throttle(callback, limit2) {
      let wait = false;
      let lastArgs = null;
      return function(...args) {
        lastArgs = args;
        if (!wait) {
          callback.apply(this, lastArgs);
          wait = true;
          setTimeout(() => {
            wait = false;
            if (lastArgs) {
              callback.apply(this, lastArgs);
            }
          }, limit2);
        }
      };
    },
    getColumnName(column, selector = SELECTORS.column) {
      return column.getAttribute(selector);
    },
    // ---- Cleanup ----
    destroy() {
      this.livewireHookCleanup?.();
      this.livewireHookCleanup = null;
      this.abortController?.abort();
      this.abortController = null;
      this.columns = null;
      this.excludedColumns = null;
      this.refs.table = null;
      this.refs.wrapper = null;
      this.refs.content = null;
      this.element = null;
    }
  };
}
export {
  filamentRobustaTable as default
};
/*! Bundled license information:

filepond/dist/filepond.esm.js:
  (*!
   * FilePond 4.32.12
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   *)
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZpbGVwb25kL2Rpc3QvZmlsZXBvbmQuZXNtLmpzIiwgIi4uL3JvYnVzdGEtdGFibGUuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qIVxuICogRmlsZVBvbmQgNC4zMi4xMlxuICogTGljZW5zZWQgdW5kZXIgTUlULCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC9cbiAqIFBsZWFzZSB2aXNpdCBodHRwczovL3BxaW5hLm5sL2ZpbGVwb25kLyBmb3IgZGV0YWlscy5cbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG5jb25zdCBpc05vZGUgPSB2YWx1ZSA9PiB2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuXG5jb25zdCBjcmVhdGVTdG9yZSA9IChpbml0aWFsU3RhdGUsIHF1ZXJpZXMgPSBbXSwgYWN0aW9ucyA9IFtdKSA9PiB7XG4gICAgLy8gaW50ZXJuYWwgc3RhdGVcbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgLi4uaW5pdGlhbFN0YXRlLFxuICAgIH07XG5cbiAgICAvLyBjb250YWlucyBhbGwgYWN0aW9ucyBmb3IgbmV4dCBmcmFtZSwgaXMgY2xlYXIgd2hlbiBhY3Rpb25zIGFyZSByZXF1ZXN0ZWRcbiAgICBjb25zdCBhY3Rpb25RdWV1ZSA9IFtdO1xuICAgIGNvbnN0IGRpc3BhdGNoUXVldWUgPSBbXTtcblxuICAgIC8vIHJldHVybnMgYSBkdXBsaWNhdGUgb2YgdGhlIGN1cnJlbnQgc3RhdGVcbiAgICBjb25zdCBnZXRTdGF0ZSA9ICgpID0+ICh7IC4uLnN0YXRlIH0pO1xuXG4gICAgLy8gcmV0dXJucyBhIGR1cGxpY2F0ZSBvZiB0aGUgYWN0aW9ucyBhcnJheSBhbmQgY2xlYXJzIHRoZSBhY3Rpb25zIGFycmF5XG4gICAgY29uc3QgcHJvY2Vzc0FjdGlvblF1ZXVlID0gKCkgPT4ge1xuICAgICAgICAvLyBjcmVhdGUgY29weSBvZiBhY3Rpb25zIHF1ZXVlXG4gICAgICAgIGNvbnN0IHF1ZXVlID0gWy4uLmFjdGlvblF1ZXVlXTtcblxuICAgICAgICAvLyBjbGVhciBhY3Rpb25zIHF1ZXVlICh3ZSBkb24ndCB3YW50IG5vIGRvdWJsZSBhY3Rpb25zKVxuICAgICAgICBhY3Rpb25RdWV1ZS5sZW5ndGggPSAwO1xuXG4gICAgICAgIHJldHVybiBxdWV1ZTtcbiAgICB9O1xuXG4gICAgLy8gcHJvY2Vzc2VzIGFjdGlvbnMgdGhhdCBtaWdodCBibG9jayB0aGUgbWFpbiBVSSB0aHJlYWRcbiAgICBjb25zdCBwcm9jZXNzRGlzcGF0Y2hRdWV1ZSA9ICgpID0+IHtcbiAgICAgICAgLy8gY3JlYXRlIGNvcHkgb2YgYWN0aW9ucyBxdWV1ZVxuICAgICAgICBjb25zdCBxdWV1ZSA9IFsuLi5kaXNwYXRjaFF1ZXVlXTtcblxuICAgICAgICAvLyBjbGVhciBhY3Rpb25zIHF1ZXVlICh3ZSBkb24ndCB3YW50IG5vIGRvdWJsZSBhY3Rpb25zKVxuICAgICAgICBkaXNwYXRjaFF1ZXVlLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgLy8gbm93IGRpc3BhdGNoIHRoZXNlIGFjdGlvbnNcbiAgICAgICAgcXVldWUuZm9yRWFjaCgoeyB0eXBlLCBkYXRhIH0pID0+IHtcbiAgICAgICAgICAgIGRpc3BhdGNoKHR5cGUsIGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gYWRkcyBhIG5ldyBhY3Rpb24sIGNhbGxzIGl0cyBoYW5kbGVyIGFuZFxuICAgIGNvbnN0IGRpc3BhdGNoID0gKHR5cGUsIGRhdGEsIGlzQmxvY2tpbmcpID0+IHtcbiAgICAgICAgLy8gaXMgYmxvY2tpbmcgYWN0aW9uIChzaG91bGQgbmV2ZXIgYmxvY2sgaWYgZG9jdW1lbnQgaXMgaGlkZGVuKVxuICAgICAgICBpZiAoaXNCbG9ja2luZyAmJiAhZG9jdW1lbnQuaGlkZGVuKSB7XG4gICAgICAgICAgICBkaXNwYXRjaFF1ZXVlLnB1c2goeyB0eXBlLCBkYXRhIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhpcyBhY3Rpb24gaGFzIGEgaGFuZGxlciwgaGFuZGxlIHRoZSBhY3Rpb25cbiAgICAgICAgaWYgKGFjdGlvbkhhbmRsZXJzW3R5cGVdKSB7XG4gICAgICAgICAgICBhY3Rpb25IYW5kbGVyc1t0eXBlXShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vdyBhZGQgYWN0aW9uXG4gICAgICAgIGFjdGlvblF1ZXVlLnB1c2goe1xuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBxdWVyeSA9IChzdHIsIC4uLmFyZ3MpID0+IChxdWVyeUhhbmRsZXNbc3RyXSA/IHF1ZXJ5SGFuZGxlc1tzdHJdKC4uLmFyZ3MpIDogbnVsbCk7XG5cbiAgICBjb25zdCBhcGkgPSB7XG4gICAgICAgIGdldFN0YXRlLFxuICAgICAgICBwcm9jZXNzQWN0aW9uUXVldWUsXG4gICAgICAgIHByb2Nlc3NEaXNwYXRjaFF1ZXVlLFxuICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgcXVlcnksXG4gICAgfTtcblxuICAgIGxldCBxdWVyeUhhbmRsZXMgPSB7fTtcbiAgICBxdWVyaWVzLmZvckVhY2gocXVlcnkgPT4ge1xuICAgICAgICBxdWVyeUhhbmRsZXMgPSB7XG4gICAgICAgICAgICAuLi5xdWVyeShzdGF0ZSksXG4gICAgICAgICAgICAuLi5xdWVyeUhhbmRsZXMsXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBsZXQgYWN0aW9uSGFuZGxlcnMgPSB7fTtcbiAgICBhY3Rpb25zLmZvckVhY2goYWN0aW9uID0+IHtcbiAgICAgICAgYWN0aW9uSGFuZGxlcnMgPSB7XG4gICAgICAgICAgICAuLi5hY3Rpb24oZGlzcGF0Y2gsIHF1ZXJ5LCBzdGF0ZSksXG4gICAgICAgICAgICAuLi5hY3Rpb25IYW5kbGVycyxcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBhcGk7XG59O1xuXG5jb25zdCBkZWZpbmVQcm9wZXJ0eSA9IChvYmosIHByb3BlcnR5LCBkZWZpbml0aW9uKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbml0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG9ialtwcm9wZXJ0eV0gPSBkZWZpbml0aW9uO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BlcnR5LCB7IC4uLmRlZmluaXRpb24gfSk7XG59O1xuXG5jb25zdCBmb3JpbiA9IChvYmosIGNiKSA9PiB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY2Ioa2V5LCBvYmpba2V5XSk7XG4gICAgfVxufTtcblxuY29uc3QgY3JlYXRlT2JqZWN0ID0gZGVmaW5pdGlvbiA9PiB7XG4gICAgY29uc3Qgb2JqID0ge307XG4gICAgZm9yaW4oZGVmaW5pdGlvbiwgcHJvcGVydHkgPT4ge1xuICAgICAgICBkZWZpbmVQcm9wZXJ0eShvYmosIHByb3BlcnR5LCBkZWZpbml0aW9uW3Byb3BlcnR5XSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbn07XG5cbmNvbnN0IGF0dHIgPSAobm9kZSwgbmFtZSwgdmFsdWUgPSBudWxsKSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZShuYW1lKSB8fCBub2RlLmhhc0F0dHJpYnV0ZShuYW1lKTtcbiAgICB9XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xufTtcblxuY29uc3QgbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuY29uc3Qgc3ZnRWxlbWVudHMgPSBbJ3N2ZycsICdwYXRoJ107IC8vIG9ubHkgc3ZnIGVsZW1lbnRzIHVzZWRcblxuY29uc3QgaXNTVkdFbGVtZW50ID0gdGFnID0+IHN2Z0VsZW1lbnRzLmluY2x1ZGVzKHRhZyk7XG5cbmNvbnN0IGNyZWF0ZUVsZW1lbnQgPSAodGFnLCBjbGFzc05hbWUsIGF0dHJpYnV0ZXMgPSB7fSkgPT4ge1xuICAgIGlmICh0eXBlb2YgY2xhc3NOYW1lID09PSAnb2JqZWN0Jykge1xuICAgICAgICBhdHRyaWJ1dGVzID0gY2xhc3NOYW1lO1xuICAgICAgICBjbGFzc05hbWUgPSBudWxsO1xuICAgIH1cbiAgICBjb25zdCBlbGVtZW50ID0gaXNTVkdFbGVtZW50KHRhZylcbiAgICAgICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgICBpZiAoaXNTVkdFbGVtZW50KHRhZykpIHtcbiAgICAgICAgICAgIGF0dHIoZWxlbWVudCwgJ2NsYXNzJywgY2xhc3NOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvcmluKGF0dHJpYnV0ZXMsIChuYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgICBhdHRyKGVsZW1lbnQsIG5hbWUsIHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZWxlbWVudDtcbn07XG5cbmNvbnN0IGFwcGVuZENoaWxkID0gcGFyZW50ID0+IChjaGlsZCwgaW5kZXgpID0+IHtcbiAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAndW5kZWZpbmVkJyAmJiBwYXJlbnQuY2hpbGRyZW5baW5kZXhdKSB7XG4gICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIHBhcmVudC5jaGlsZHJlbltpbmRleF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfVxufTtcblxuY29uc3QgYXBwZW5kQ2hpbGRWaWV3ID0gKHBhcmVudCwgY2hpbGRWaWV3cykgPT4gKHZpZXcsIGluZGV4KSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY2hpbGRWaWV3cy5zcGxpY2UoaW5kZXgsIDAsIHZpZXcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkVmlld3MucHVzaCh2aWV3KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmlldztcbn07XG5cbmNvbnN0IHJlbW92ZUNoaWxkVmlldyA9IChwYXJlbnQsIGNoaWxkVmlld3MpID0+IHZpZXcgPT4ge1xuICAgIC8vIHJlbW92ZSBmcm9tIGNoaWxkIHZpZXdzXG4gICAgY2hpbGRWaWV3cy5zcGxpY2UoY2hpbGRWaWV3cy5pbmRleE9mKHZpZXcpLCAxKTtcblxuICAgIC8vIHJlbW92ZSB0aGUgZWxlbWVudFxuICAgIGlmICh2aWV3LmVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodmlldy5lbGVtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmlldztcbn07XG5cbmNvbnN0IElTX0JST1dTRVIgPSAoKCkgPT5cbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LmRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykoKTtcbmNvbnN0IGlzQnJvd3NlciA9ICgpID0+IElTX0JST1dTRVI7XG5cbmNvbnN0IHRlc3RFbGVtZW50ID0gaXNCcm93c2VyKCkgPyBjcmVhdGVFbGVtZW50KCdzdmcnKSA6IHt9O1xuY29uc3QgZ2V0Q2hpbGRDb3VudCA9XG4gICAgJ2NoaWxkcmVuJyBpbiB0ZXN0RWxlbWVudCA/IGVsID0+IGVsLmNoaWxkcmVuLmxlbmd0aCA6IGVsID0+IGVsLmNoaWxkTm9kZXMubGVuZ3RoO1xuXG5jb25zdCBnZXRWaWV3UmVjdCA9IChlbGVtZW50UmVjdCwgY2hpbGRWaWV3cywgb2Zmc2V0LCBzY2FsZSkgPT4ge1xuICAgIGNvbnN0IGxlZnQgPSBvZmZzZXRbMF0gfHwgZWxlbWVudFJlY3QubGVmdDtcbiAgICBjb25zdCB0b3AgPSBvZmZzZXRbMV0gfHwgZWxlbWVudFJlY3QudG9wO1xuICAgIGNvbnN0IHJpZ2h0ID0gbGVmdCArIGVsZW1lbnRSZWN0LndpZHRoO1xuICAgIGNvbnN0IGJvdHRvbSA9IHRvcCArIGVsZW1lbnRSZWN0LmhlaWdodCAqIChzY2FsZVsxXSB8fCAxKTtcblxuICAgIGNvbnN0IHJlY3QgPSB7XG4gICAgICAgIC8vIHRoZSByZWN0YW5nbGUgb2YgdGhlIGVsZW1lbnQgaXRzZWxmXG4gICAgICAgIGVsZW1lbnQ6IHtcbiAgICAgICAgICAgIC4uLmVsZW1lbnRSZWN0LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHRoZSByZWN0YW5nbGUgb2YgdGhlIGVsZW1lbnQgZXhwYW5kZWQgdG8gY29udGFpbiBpdHMgY2hpbGRyZW4sIGRvZXMgbm90IGluY2x1ZGUgYW55IG1hcmdpbnNcbiAgICAgICAgaW5uZXI6IHtcbiAgICAgICAgICAgIGxlZnQ6IGVsZW1lbnRSZWN0LmxlZnQsXG4gICAgICAgICAgICB0b3A6IGVsZW1lbnRSZWN0LnRvcCxcbiAgICAgICAgICAgIHJpZ2h0OiBlbGVtZW50UmVjdC5yaWdodCxcbiAgICAgICAgICAgIGJvdHRvbTogZWxlbWVudFJlY3QuYm90dG9tLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHRoZSByZWN0YW5nbGUgb2YgdGhlIGVsZW1lbnQgZXhwYW5kZWQgdG8gY29udGFpbiBpdHMgY2hpbGRyZW4gaW5jbHVkaW5nIG93biBtYXJnaW4gYW5kIGNoaWxkIG1hcmdpbnNcbiAgICAgICAgLy8gbWFyZ2lucyB3aWxsIGJlIGFkZGVkIGFmdGVyIHdlJ3ZlIHJlY2FsY3VsYXRlZCB0aGUgc2l6ZVxuICAgICAgICBvdXRlcjoge1xuICAgICAgICAgICAgbGVmdCxcbiAgICAgICAgICAgIHRvcCxcbiAgICAgICAgICAgIHJpZ2h0LFxuICAgICAgICAgICAgYm90dG9tLFxuICAgICAgICB9LFxuICAgIH07XG5cbiAgICAvLyBleHBhbmQgcmVjdCB0byBmaXQgYWxsIGNoaWxkIHJlY3RhbmdsZXNcbiAgICBjaGlsZFZpZXdzXG4gICAgICAgIC5maWx0ZXIoY2hpbGRWaWV3ID0+ICFjaGlsZFZpZXcuaXNSZWN0SWdub3JlZCgpKVxuICAgICAgICAubWFwKGNoaWxkVmlldyA9PiBjaGlsZFZpZXcucmVjdClcbiAgICAgICAgLmZvckVhY2goY2hpbGRWaWV3UmVjdCA9PiB7XG4gICAgICAgICAgICBleHBhbmRSZWN0KHJlY3QuaW5uZXIsIHsgLi4uY2hpbGRWaWV3UmVjdC5pbm5lciB9KTtcbiAgICAgICAgICAgIGV4cGFuZFJlY3QocmVjdC5vdXRlciwgeyAuLi5jaGlsZFZpZXdSZWN0Lm91dGVyIH0pO1xuICAgICAgICB9KTtcblxuICAgIC8vIGNhbGN1bGF0ZSBpbm5lciB3aWR0aCBhbmQgaGVpZ2h0XG4gICAgY2FsY3VsYXRlUmVjdFNpemUocmVjdC5pbm5lcik7XG5cbiAgICAvLyBhcHBlbmQgYWRkaXRpb25hbCBtYXJnaW4gKHRvcCBhbmQgbGVmdCBtYXJnaW5zIGFyZSBpbmNsdWRlZCBpbiB0b3AgYW5kIGxlZnQgYXV0b21hdGljYWxseSlcbiAgICByZWN0Lm91dGVyLmJvdHRvbSArPSByZWN0LmVsZW1lbnQubWFyZ2luQm90dG9tO1xuICAgIHJlY3Qub3V0ZXIucmlnaHQgKz0gcmVjdC5lbGVtZW50Lm1hcmdpblJpZ2h0O1xuXG4gICAgLy8gY2FsY3VsYXRlIG91dGVyIHdpZHRoIGFuZCBoZWlnaHRcbiAgICBjYWxjdWxhdGVSZWN0U2l6ZShyZWN0Lm91dGVyKTtcblxuICAgIHJldHVybiByZWN0O1xufTtcblxuY29uc3QgZXhwYW5kUmVjdCA9IChwYXJlbnQsIGNoaWxkKSA9PiB7XG4gICAgLy8gYWRqdXN0IGZvciBwYXJlbnQgb2Zmc2V0XG4gICAgY2hpbGQudG9wICs9IHBhcmVudC50b3A7XG4gICAgY2hpbGQucmlnaHQgKz0gcGFyZW50LmxlZnQ7XG4gICAgY2hpbGQuYm90dG9tICs9IHBhcmVudC50b3A7XG4gICAgY2hpbGQubGVmdCArPSBwYXJlbnQubGVmdDtcblxuICAgIGlmIChjaGlsZC5ib3R0b20gPiBwYXJlbnQuYm90dG9tKSB7XG4gICAgICAgIHBhcmVudC5ib3R0b20gPSBjaGlsZC5ib3R0b207XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLnJpZ2h0ID4gcGFyZW50LnJpZ2h0KSB7XG4gICAgICAgIHBhcmVudC5yaWdodCA9IGNoaWxkLnJpZ2h0O1xuICAgIH1cbn07XG5cbmNvbnN0IGNhbGN1bGF0ZVJlY3RTaXplID0gcmVjdCA9PiB7XG4gICAgcmVjdC53aWR0aCA9IHJlY3QucmlnaHQgLSByZWN0LmxlZnQ7XG4gICAgcmVjdC5oZWlnaHQgPSByZWN0LmJvdHRvbSAtIHJlY3QudG9wO1xufTtcblxuY29uc3QgaXNOdW1iZXIgPSB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInO1xuXG4vKipcbiAqIERldGVybWluZXMgaWYgcG9zaXRpb24gaXMgYXQgZGVzdGluYXRpb25cbiAqIEBwYXJhbSBwb3NpdGlvblxuICogQHBhcmFtIGRlc3RpbmF0aW9uXG4gKiBAcGFyYW0gdmVsb2NpdHlcbiAqIEBwYXJhbSBlcnJvck1hcmdpblxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmNvbnN0IHRoZXJlWWV0ID0gKHBvc2l0aW9uLCBkZXN0aW5hdGlvbiwgdmVsb2NpdHksIGVycm9yTWFyZ2luID0gMC4wMDEpID0+IHtcbiAgICByZXR1cm4gTWF0aC5hYnMocG9zaXRpb24gLSBkZXN0aW5hdGlvbikgPCBlcnJvck1hcmdpbiAmJiBNYXRoLmFicyh2ZWxvY2l0eSkgPCBlcnJvck1hcmdpbjtcbn07XG5cbi8qKlxuICogU3ByaW5nIGFuaW1hdGlvblxuICovXG5jb25zdCBzcHJpbmcgPVxuICAgIC8vIGRlZmF1bHQgb3B0aW9uc1xuICAgICh7IHN0aWZmbmVzcyA9IDAuNSwgZGFtcGluZyA9IDAuNzUsIG1hc3MgPSAxMCB9ID0ge30pID0+XG4gICAgICAgIC8vIG1ldGhvZCBkZWZpbml0aW9uXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBudWxsO1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIGxldCB2ZWxvY2l0eSA9IDA7XG4gICAgICAgICAgICBsZXQgcmVzdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGVzIHNwcmluZyBzdGF0ZVxuICAgICAgICAgICAgY29uc3QgaW50ZXJwb2xhdGUgPSAodHMsIHNraXBUb0VuZFN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gaW4gcmVzdCwgZG9uJ3QgYW5pbWF0ZVxuICAgICAgICAgICAgICAgIGlmIChyZXN0aW5nKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAvLyBuZWVkIGF0IGxlYXN0IGEgdGFyZ2V0IG9yIHBvc2l0aW9uIHRvIGRvIHNwcmluZ3kgdGhpbmdzXG4gICAgICAgICAgICAgICAgaWYgKCEoaXNOdW1iZXIodGFyZ2V0KSAmJiBpc051bWJlcihwb3NpdGlvbikpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3RpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgc3ByaW5nIGZvcmNlXG4gICAgICAgICAgICAgICAgY29uc3QgZiA9IC0ocG9zaXRpb24gLSB0YXJnZXQpICogc3RpZmZuZXNzO1xuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHZlbG9jaXR5IGJ5IGFkZGluZyBmb3JjZSBiYXNlZCBvbiBtYXNzXG4gICAgICAgICAgICAgICAgdmVsb2NpdHkgKz0gZiAvIG1hc3M7XG5cbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgcG9zaXRpb24gYnkgYWRkaW5nIHZlbG9jaXR5XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gKz0gdmVsb2NpdHk7XG5cbiAgICAgICAgICAgICAgICAvLyBzbG93IGRvd24gYmFzZWQgb24gYW1vdW50IG9mIGRhbXBpbmdcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eSAqPSBkYW1waW5nO1xuXG4gICAgICAgICAgICAgICAgLy8gd2UndmUgYXJyaXZlZCBpZiB3ZSdyZSBuZWFyIHRhcmdldCBhbmQgb3VyIHZlbG9jaXR5IGlzIG5lYXIgemVyb1xuICAgICAgICAgICAgICAgIGlmICh0aGVyZVlldChwb3NpdGlvbiwgdGFyZ2V0LCB2ZWxvY2l0eSkgfHwgc2tpcFRvRW5kU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgZG9uZVxuICAgICAgICAgICAgICAgICAgICBhcGkub251cGRhdGUocG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBhcGkub25jb21wbGV0ZShwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcHJvZ3Jlc3MgdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgIGFwaS5vbnVwZGF0ZShwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTZXQgbmV3IHRhcmdldCB2YWx1ZVxuICAgICAgICAgICAgICogQHBhcmFtIHZhbHVlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHNldFRhcmdldCA9IHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICAvLyBpZiBjdXJyZW50bHkgaGFzIG5vIHBvc2l0aW9uLCBzZXQgdGFyZ2V0IGFuZCBwb3NpdGlvbiB0byB0aGlzIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKHZhbHVlKSAmJiAhaXNOdW1iZXIocG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gbmV4dCB0YXJnZXQgdmFsdWUgd2lsbCBub3QgYmUgYW5pbWF0ZWQgdG9cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGxldCBzdGFydCBtb3ZpbmcgdG8gdGFyZ2V0XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gdmFsdWU7XG5cbiAgICAgICAgICAgICAgICAvLyBhbHJlYWR5IGF0IHRhcmdldFxuICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdGFyZ2V0IHx8IHR5cGVvZiB0YXJnZXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdyByZXN0aW5nIGFzIHRhcmdldCBpcyBjdXJyZW50IHBvc2l0aW9uLCBzdG9wIG1vdmluZ1xuICAgICAgICAgICAgICAgICAgICByZXN0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRvbmUhXG4gICAgICAgICAgICAgICAgICAgIGFwaS5vbnVwZGF0ZShwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGFwaS5vbmNvbXBsZXRlKHBvc2l0aW9uKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gbmVlZCAnYXBpJyB0byBjYWxsIG9udXBkYXRlIGNhbGxiYWNrXG4gICAgICAgICAgICBjb25zdCBhcGkgPSBjcmVhdGVPYmplY3Qoe1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlLFxuICAgICAgICAgICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgICAgICAgICBzZXQ6IHNldFRhcmdldCxcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB0YXJnZXQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXN0aW5nOiB7XG4gICAgICAgICAgICAgICAgICAgIGdldDogKCkgPT4gcmVzdGluZyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9udXBkYXRlOiB2YWx1ZSA9PiB7fSxcbiAgICAgICAgICAgICAgICBvbmNvbXBsZXRlOiB2YWx1ZSA9PiB7fSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gYXBpO1xuICAgICAgICB9O1xuXG5jb25zdCBlYXNlTGluZWFyID0gdCA9PiB0O1xuY29uc3QgZWFzZUluT3V0UXVhZCA9IHQgPT4gKHQgPCAwLjUgPyAyICogdCAqIHQgOiAtMSArICg0IC0gMiAqIHQpICogdCk7XG5cbmNvbnN0IHR3ZWVuID1cbiAgICAvLyBkZWZhdWx0IHZhbHVlc1xuICAgICh7IGR1cmF0aW9uID0gNTAwLCBlYXNpbmcgPSBlYXNlSW5PdXRRdWFkLCBkZWxheSA9IDAgfSA9IHt9KSA9PlxuICAgICAgICAvLyBtZXRob2QgZGVmaW5pdGlvblxuICAgICAgICB7XG4gICAgICAgICAgICBsZXQgc3RhcnQgPSBudWxsO1xuICAgICAgICAgICAgbGV0IHQ7XG4gICAgICAgICAgICBsZXQgcDtcbiAgICAgICAgICAgIGxldCByZXN0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIGxldCByZXZlcnNlID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0ID0gbnVsbDtcblxuICAgICAgICAgICAgY29uc3QgaW50ZXJwb2xhdGUgPSAodHMsIHNraXBUb0VuZFN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3RpbmcgfHwgdGFyZ2V0ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSB0cztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHMgLSBzdGFydCA8IGRlbGF5KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0ID0gdHMgLSBzdGFydCAtIGRlbGF5O1xuXG4gICAgICAgICAgICAgICAgaWYgKHQgPj0gZHVyYXRpb24gfHwgc2tpcFRvRW5kU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHAgPSByZXZlcnNlID8gMCA6IDE7XG4gICAgICAgICAgICAgICAgICAgIGFwaS5vbnVwZGF0ZShwICogdGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYXBpLm9uY29tcGxldGUocCAqIHRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc3RpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHAgPSB0IC8gZHVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIGFwaS5vbnVwZGF0ZSgodCA+PSAwID8gZWFzaW5nKHJldmVyc2UgPyAxIC0gcCA6IHApIDogMCkgKiB0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIG5lZWQgJ2FwaScgdG8gY2FsbCBvbnVwZGF0ZSBjYWxsYmFja1xuICAgICAgICAgICAgY29uc3QgYXBpID0gY3JlYXRlT2JqZWN0KHtcbiAgICAgICAgICAgICAgICBpbnRlcnBvbGF0ZSxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiAocmV2ZXJzZSA/IDAgOiB0YXJnZXQpLFxuICAgICAgICAgICAgICAgICAgICBzZXQ6IHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlzIGluaXRpYWwgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkub251cGRhdGUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5vbmNvbXBsZXRlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdhbnQgdG8gdHdlZW4gdG8gYSBzbWFsbGVyIHZhbHVlIGFuZCBoYXZlIGEgY3VycmVudCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlIDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZlcnNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm90IHR3ZWVuaW5nIHRvIGEgc21hbGxlciB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmVyc2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV0J3MgZ28hXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXN0aW5nOiB7XG4gICAgICAgICAgICAgICAgICAgIGdldDogKCkgPT4gcmVzdGluZyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9udXBkYXRlOiB2YWx1ZSA9PiB7fSxcbiAgICAgICAgICAgICAgICBvbmNvbXBsZXRlOiB2YWx1ZSA9PiB7fSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gYXBpO1xuICAgICAgICB9O1xuXG5jb25zdCBhbmltYXRvciA9IHtcbiAgICBzcHJpbmcsXG4gICAgdHdlZW4sXG59O1xuXG4vKlxuIHsgdHlwZTogJ3NwcmluZycsIHN0aWZmbmVzczogLjUsIGRhbXBpbmc6IC43NSwgbWFzczogMTAgfTtcbiB7IHRyYW5zbGF0aW9uOiB7IHR5cGU6ICdzcHJpbmcnLCAuLi4gfSwgLi4uIH1cbiB7IHRyYW5zbGF0aW9uOiB7IHg6IHsgdHlwZTogJ3NwcmluZycsIC4uLiB9IH0gfVxuKi9cbmNvbnN0IGNyZWF0ZUFuaW1hdG9yID0gKGRlZmluaXRpb24sIGNhdGVnb3J5LCBwcm9wZXJ0eSkgPT4ge1xuICAgIC8vIGRlZmF1bHQgaXMgc2luZ2xlIGRlZmluaXRpb25cbiAgICAvLyB3ZSBjaGVjayBpZiB0cmFuc2Zvcm0gaXMgc2V0LCBpZiBzbywgd2UgY2hlY2sgaWYgcHJvcGVydHkgaXMgc2V0XG4gICAgY29uc3QgZGVmID1cbiAgICAgICAgZGVmaW5pdGlvbltjYXRlZ29yeV0gJiYgdHlwZW9mIGRlZmluaXRpb25bY2F0ZWdvcnldW3Byb3BlcnR5XSA9PT0gJ29iamVjdCdcbiAgICAgICAgICAgID8gZGVmaW5pdGlvbltjYXRlZ29yeV1bcHJvcGVydHldXG4gICAgICAgICAgICA6IGRlZmluaXRpb25bY2F0ZWdvcnldIHx8IGRlZmluaXRpb247XG5cbiAgICBjb25zdCB0eXBlID0gdHlwZW9mIGRlZiA9PT0gJ3N0cmluZycgPyBkZWYgOiBkZWYudHlwZTtcbiAgICBjb25zdCBwcm9wcyA9IHR5cGVvZiBkZWYgPT09ICdvYmplY3QnID8geyAuLi5kZWYgfSA6IHt9O1xuXG4gICAgcmV0dXJuIGFuaW1hdG9yW3R5cGVdID8gYW5pbWF0b3JbdHlwZV0ocHJvcHMpIDogbnVsbDtcbn07XG5cbmNvbnN0IGFkZEdldFNldCA9IChrZXlzLCBvYmosIHByb3BzLCBvdmVyd3JpdGUgPSBmYWxzZSkgPT4ge1xuICAgIG9iaiA9IEFycmF5LmlzQXJyYXkob2JqKSA/IG9iaiA6IFtvYmpdO1xuICAgIG9iai5mb3JFYWNoKG8gPT4ge1xuICAgICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGxldCBuYW1lID0ga2V5O1xuICAgICAgICAgICAgbGV0IGdldHRlciA9ICgpID0+IHByb3BzW2tleV07XG4gICAgICAgICAgICBsZXQgc2V0dGVyID0gdmFsdWUgPT4gKHByb3BzW2tleV0gPSB2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBrZXkua2V5O1xuICAgICAgICAgICAgICAgIGdldHRlciA9IGtleS5nZXR0ZXIgfHwgZ2V0dGVyO1xuICAgICAgICAgICAgICAgIHNldHRlciA9IGtleS5zZXR0ZXIgfHwgc2V0dGVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob1tuYW1lXSAmJiAhb3ZlcndyaXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvW25hbWVdID0ge1xuICAgICAgICAgICAgICAgIGdldDogZ2V0dGVyLFxuICAgICAgICAgICAgICAgIHNldDogc2V0dGVyLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG4vLyBhZGQgdG8gc3RhdGUsXG4vLyBhZGQgZ2V0dGVycyBhbmQgc2V0dGVycyB0byBpbnRlcm5hbCBhbmQgZXh0ZXJuYWwgYXBpIChpZiBub3Qgc2V0KVxuLy8gc2V0dXAgYW5pbWF0b3JzXG5cbmNvbnN0IGFuaW1hdGlvbnMgPSAoeyBtaXhpbkNvbmZpZywgdmlld1Byb3BzLCB2aWV3SW50ZXJuYWxBUEksIHZpZXdFeHRlcm5hbEFQSSB9KSA9PiB7XG4gICAgLy8gaW5pdGlhbCBwcm9wZXJ0aWVzXG4gICAgY29uc3QgaW5pdGlhbFByb3BzID0geyAuLi52aWV3UHJvcHMgfTtcblxuICAgIC8vIGxpc3Qgb2YgYWxsIGFjdGl2ZSBhbmltYXRpb25zXG4gICAgY29uc3QgYW5pbWF0aW9ucyA9IFtdO1xuXG4gICAgLy8gc2V0dXAgYW5pbWF0b3JzXG4gICAgZm9yaW4obWl4aW5Db25maWcsIChwcm9wZXJ0eSwgYW5pbWF0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGFuaW1hdG9yID0gY3JlYXRlQW5pbWF0b3IoYW5pbWF0aW9uKTtcbiAgICAgICAgaWYgKCFhbmltYXRvcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2hlbiB0aGUgYW5pbWF0b3IgdXBkYXRlcywgdXBkYXRlIHRoZSB2aWV3IHN0YXRlIHZhbHVlXG4gICAgICAgIGFuaW1hdG9yLm9udXBkYXRlID0gdmFsdWUgPT4ge1xuICAgICAgICAgICAgdmlld1Byb3BzW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHNldCBhbmltYXRvciB0YXJnZXRcbiAgICAgICAgYW5pbWF0b3IudGFyZ2V0ID0gaW5pdGlhbFByb3BzW3Byb3BlcnR5XTtcblxuICAgICAgICAvLyB3aGVuIHZhbHVlIGlzIHNldCwgc2V0IHRoZSBhbmltYXRvciB0YXJnZXQgdmFsdWVcbiAgICAgICAgY29uc3QgcHJvcCA9IHtcbiAgICAgICAgICAgIGtleTogcHJvcGVydHksXG4gICAgICAgICAgICBzZXR0ZXI6IHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICAvLyBpZiBhbHJlYWR5IGF0IHRhcmdldCwgd2UgZG9uZSFcbiAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IudGFyZ2V0ID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYW5pbWF0b3IudGFyZ2V0ID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0dGVyOiAoKSA9PiB2aWV3UHJvcHNbcHJvcGVydHldLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGFkZCBnZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gICAgICAgIGFkZEdldFNldChbcHJvcF0sIFt2aWV3SW50ZXJuYWxBUEksIHZpZXdFeHRlcm5hbEFQSV0sIHZpZXdQcm9wcywgdHJ1ZSk7XG5cbiAgICAgICAgLy8gYWRkIGl0IHRvIHRoZSBsaXN0IGZvciBlYXN5IHVwZGF0aW5nIGZyb20gdGhlIF93cml0ZSBtZXRob2RcbiAgICAgICAgYW5pbWF0aW9ucy5wdXNoKGFuaW1hdG9yKTtcbiAgICB9KTtcblxuICAgIC8vIGV4cG9zZSBpbnRlcm5hbCB3cml0ZSBhcGlcbiAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogdHMgPT4ge1xuICAgICAgICAgICAgbGV0IHNraXBUb0VuZFN0YXRlID0gZG9jdW1lbnQuaGlkZGVuO1xuICAgICAgICAgICAgbGV0IHJlc3RpbmcgPSB0cnVlO1xuICAgICAgICAgICAgYW5pbWF0aW9ucy5mb3JFYWNoKGFuaW1hdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFhbmltYXRpb24ucmVzdGluZykgcmVzdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5pbnRlcnBvbGF0ZSh0cywgc2tpcFRvRW5kU3RhdGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdGluZztcbiAgICAgICAgfSxcbiAgICAgICAgZGVzdHJveTogKCkgPT4ge30sXG4gICAgfTtcbn07XG5cbmNvbnN0IGFkZEV2ZW50ID0gZWxlbWVudCA9PiAodHlwZSwgZm4pID0+IHtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZm4pO1xufTtcblxuY29uc3QgcmVtb3ZlRXZlbnQgPSBlbGVtZW50ID0+ICh0eXBlLCBmbikgPT4ge1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBmbik7XG59O1xuXG4vLyBtaXhpblxuY29uc3QgbGlzdGVuZXJzID0gKHtcbiAgICBtaXhpbkNvbmZpZyxcbiAgICB2aWV3UHJvcHMsXG4gICAgdmlld0ludGVybmFsQVBJLFxuICAgIHZpZXdFeHRlcm5hbEFQSSxcbiAgICB2aWV3U3RhdGUsXG4gICAgdmlldyxcbn0pID0+IHtcbiAgICBjb25zdCBldmVudHMgPSBbXTtcblxuICAgIGNvbnN0IGFkZCA9IGFkZEV2ZW50KHZpZXcuZWxlbWVudCk7XG4gICAgY29uc3QgcmVtb3ZlID0gcmVtb3ZlRXZlbnQodmlldy5lbGVtZW50KTtcblxuICAgIHZpZXdFeHRlcm5hbEFQSS5vbiA9ICh0eXBlLCBmbikgPT4ge1xuICAgICAgICBldmVudHMucHVzaCh7XG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgZm4sXG4gICAgICAgIH0pO1xuICAgICAgICBhZGQodHlwZSwgZm4pO1xuICAgIH07XG5cbiAgICB2aWV3RXh0ZXJuYWxBUEkub2ZmID0gKHR5cGUsIGZuKSA9PiB7XG4gICAgICAgIGV2ZW50cy5zcGxpY2UoZXZlbnRzLmZpbmRJbmRleChldmVudCA9PiBldmVudC50eXBlID09PSB0eXBlICYmIGV2ZW50LmZuID09PSBmbiksIDEpO1xuICAgICAgICByZW1vdmUodHlwZSwgZm4pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogKCkgPT4ge1xuICAgICAgICAgICAgLy8gbm90IGJ1c3lcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBkZXN0cm95OiAoKSA9PiB7XG4gICAgICAgICAgICBldmVudHMuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlKGV2ZW50LnR5cGUsIGV2ZW50LmZuKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgIH07XG59O1xuXG4vLyBhZGQgdG8gZXh0ZXJuYWwgYXBpIGFuZCBsaW5rIHRvIHByb3BzXG5cbmNvbnN0IGFwaXMgPSAoeyBtaXhpbkNvbmZpZywgdmlld1Byb3BzLCB2aWV3RXh0ZXJuYWxBUEkgfSkgPT4ge1xuICAgIGFkZEdldFNldChtaXhpbkNvbmZpZywgdmlld0V4dGVybmFsQVBJLCB2aWV3UHJvcHMpO1xufTtcblxuY29uc3QgaXNEZWZpbmVkID0gdmFsdWUgPT4gdmFsdWUgIT0gbnVsbDtcblxuLy8gYWRkIHRvIHN0YXRlLFxuLy8gYWRkIGdldHRlcnMgYW5kIHNldHRlcnMgdG8gaW50ZXJuYWwgYW5kIGV4dGVybmFsIGFwaSAoaWYgbm90IHNldClcbi8vIHNldCBpbml0aWFsIHN0YXRlIGJhc2VkIG9uIHByb3BzIGluIHZpZXdQcm9wc1xuLy8gYXBwbHkgYXMgdHJhbnNmb3JtcyBlYWNoIGZyYW1lXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICAgIG9wYWNpdHk6IDEsXG4gICAgc2NhbGVYOiAxLFxuICAgIHNjYWxlWTogMSxcbiAgICB0cmFuc2xhdGVYOiAwLFxuICAgIHRyYW5zbGF0ZVk6IDAsXG4gICAgcm90YXRlWDogMCxcbiAgICByb3RhdGVZOiAwLFxuICAgIHJvdGF0ZVo6IDAsXG4gICAgb3JpZ2luWDogMCxcbiAgICBvcmlnaW5ZOiAwLFxufTtcblxuY29uc3Qgc3R5bGVzID0gKHsgbWl4aW5Db25maWcsIHZpZXdQcm9wcywgdmlld0ludGVybmFsQVBJLCB2aWV3RXh0ZXJuYWxBUEksIHZpZXcgfSkgPT4ge1xuICAgIC8vIGluaXRpYWwgcHJvcHNcbiAgICBjb25zdCBpbml0aWFsUHJvcHMgPSB7IC4uLnZpZXdQcm9wcyB9O1xuXG4gICAgLy8gY3VycmVudCBwcm9wc1xuICAgIGNvbnN0IGN1cnJlbnRQcm9wcyA9IHt9O1xuXG4gICAgLy8gd2Ugd2lsbCBhZGQgdGhvc2UgcHJvcGVydGllcyB0byB0aGUgZXh0ZXJuYWwgQVBJIGFuZCBsaW5rIHRoZW0gdG8gdGhlIHZpZXdTdGF0ZVxuICAgIGFkZEdldFNldChtaXhpbkNvbmZpZywgW3ZpZXdJbnRlcm5hbEFQSSwgdmlld0V4dGVybmFsQVBJXSwgdmlld1Byb3BzKTtcblxuICAgIC8vIG92ZXJyaWRlIHJlY3Qgb24gaW50ZXJuYWwgYW5kIGV4dGVybmFsIHJlY3QgZ2V0dGVyIHNvIGl0IHRha2VzIGluIGFjY291bnQgdHJhbnNmb3Jtc1xuICAgIGNvbnN0IGdldE9mZnNldCA9ICgpID0+IFt2aWV3UHJvcHNbJ3RyYW5zbGF0ZVgnXSB8fCAwLCB2aWV3UHJvcHNbJ3RyYW5zbGF0ZVknXSB8fCAwXTtcbiAgICBjb25zdCBnZXRTY2FsZSA9ICgpID0+IFt2aWV3UHJvcHNbJ3NjYWxlWCddIHx8IDAsIHZpZXdQcm9wc1snc2NhbGVZJ10gfHwgMF07XG4gICAgY29uc3QgZ2V0UmVjdCA9ICgpID0+XG4gICAgICAgIHZpZXcucmVjdCA/IGdldFZpZXdSZWN0KHZpZXcucmVjdCwgdmlldy5jaGlsZFZpZXdzLCBnZXRPZmZzZXQoKSwgZ2V0U2NhbGUoKSkgOiBudWxsO1xuICAgIHZpZXdJbnRlcm5hbEFQSS5yZWN0ID0geyBnZXQ6IGdldFJlY3QgfTtcbiAgICB2aWV3RXh0ZXJuYWxBUEkucmVjdCA9IHsgZ2V0OiBnZXRSZWN0IH07XG5cbiAgICAvLyBhcHBseSB2aWV3IHByb3BzXG4gICAgbWl4aW5Db25maWcuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICB2aWV3UHJvcHNba2V5XSA9XG4gICAgICAgICAgICB0eXBlb2YgaW5pdGlhbFByb3BzW2tleV0gPT09ICd1bmRlZmluZWQnID8gZGVmYXVsdHNba2V5XSA6IGluaXRpYWxQcm9wc1trZXldO1xuICAgIH0pO1xuXG4gICAgLy8gZXhwb3NlIGFwaVxuICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAvLyBzZWUgaWYgcHJvcHMgaGF2ZSBjaGFuZ2VkXG4gICAgICAgICAgICBpZiAoIXByb3BzSGF2ZUNoYW5nZWQoY3VycmVudFByb3BzLCB2aWV3UHJvcHMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBtb3ZlcyBlbGVtZW50IHRvIGNvcnJlY3QgcG9zaXRpb24gb24gc2NyZWVuXG4gICAgICAgICAgICBhcHBseVN0eWxlcyh2aWV3LmVsZW1lbnQsIHZpZXdQcm9wcyk7XG5cbiAgICAgICAgICAgIC8vIHN0b3JlIG5ldyB0cmFuc2Zvcm1zXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKGN1cnJlbnRQcm9wcywgeyAuLi52aWV3UHJvcHMgfSk7XG5cbiAgICAgICAgICAgIC8vIG5vIGxvbmdlciBidXN5XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVzdHJveTogKCkgPT4ge30sXG4gICAgfTtcbn07XG5cbmNvbnN0IHByb3BzSGF2ZUNoYW5nZWQgPSAoY3VycmVudFByb3BzLCBuZXdQcm9wcykgPT4ge1xuICAgIC8vIGRpZmZlcmVudCBhbW91bnQgb2Yga2V5c1xuICAgIGlmIChPYmplY3Qua2V5cyhjdXJyZW50UHJvcHMpLmxlbmd0aCAhPT0gT2JqZWN0LmtleXMobmV3UHJvcHMpLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBsZXRzIGFuYWx5emUgdGhlIGluZGl2aWR1YWwgcHJvcHNcbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gbmV3UHJvcHMpIHtcbiAgICAgICAgaWYgKG5ld1Byb3BzW3Byb3BdICE9PSBjdXJyZW50UHJvcHNbcHJvcF0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgYXBwbHlTdHlsZXMgPSAoXG4gICAgZWxlbWVudCxcbiAgICB7XG4gICAgICAgIG9wYWNpdHksXG4gICAgICAgIHBlcnNwZWN0aXZlLFxuICAgICAgICB0cmFuc2xhdGVYLFxuICAgICAgICB0cmFuc2xhdGVZLFxuICAgICAgICBzY2FsZVgsXG4gICAgICAgIHNjYWxlWSxcbiAgICAgICAgcm90YXRlWCxcbiAgICAgICAgcm90YXRlWSxcbiAgICAgICAgcm90YXRlWixcbiAgICAgICAgb3JpZ2luWCxcbiAgICAgICAgb3JpZ2luWSxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICB9XG4pID0+IHtcbiAgICBsZXQgdHJhbnNmb3JtcyA9ICcnO1xuICAgIGxldCBzdHlsZXMgPSAnJztcblxuICAgIC8vIGhhbmRsZSB0cmFuc2Zvcm0gb3JpZ2luXG4gICAgaWYgKGlzRGVmaW5lZChvcmlnaW5YKSB8fCBpc0RlZmluZWQob3JpZ2luWSkpIHtcbiAgICAgICAgc3R5bGVzICs9IGB0cmFuc2Zvcm0tb3JpZ2luOiAke29yaWdpblggfHwgMH1weCAke29yaWdpblkgfHwgMH1weDtgO1xuICAgIH1cblxuICAgIC8vIHRyYW5zZm9ybSBvcmRlciBpcyByZWxldmFudFxuICAgIC8vIDAuIHBlcnNwZWN0aXZlXG4gICAgaWYgKGlzRGVmaW5lZChwZXJzcGVjdGl2ZSkpIHtcbiAgICAgICAgdHJhbnNmb3JtcyArPSBgcGVyc3BlY3RpdmUoJHtwZXJzcGVjdGl2ZX1weCkgYDtcbiAgICB9XG5cbiAgICAvLyAxLiB0cmFuc2xhdGVcbiAgICBpZiAoaXNEZWZpbmVkKHRyYW5zbGF0ZVgpIHx8IGlzRGVmaW5lZCh0cmFuc2xhdGVZKSkge1xuICAgICAgICB0cmFuc2Zvcm1zICs9IGB0cmFuc2xhdGUzZCgke3RyYW5zbGF0ZVggfHwgMH1weCwgJHt0cmFuc2xhdGVZIHx8IDB9cHgsIDApIGA7XG4gICAgfVxuXG4gICAgLy8gMi4gc2NhbGVcbiAgICBpZiAoaXNEZWZpbmVkKHNjYWxlWCkgfHwgaXNEZWZpbmVkKHNjYWxlWSkpIHtcbiAgICAgICAgdHJhbnNmb3JtcyArPSBgc2NhbGUzZCgke2lzRGVmaW5lZChzY2FsZVgpID8gc2NhbGVYIDogMX0sICR7XG4gICAgICAgICAgICBpc0RlZmluZWQoc2NhbGVZKSA/IHNjYWxlWSA6IDFcbiAgICAgICAgfSwgMSkgYDtcbiAgICB9XG5cbiAgICAvLyAzLiByb3RhdGVcbiAgICBpZiAoaXNEZWZpbmVkKHJvdGF0ZVopKSB7XG4gICAgICAgIHRyYW5zZm9ybXMgKz0gYHJvdGF0ZVooJHtyb3RhdGVafXJhZCkgYDtcbiAgICB9XG5cbiAgICBpZiAoaXNEZWZpbmVkKHJvdGF0ZVgpKSB7XG4gICAgICAgIHRyYW5zZm9ybXMgKz0gYHJvdGF0ZVgoJHtyb3RhdGVYfXJhZCkgYDtcbiAgICB9XG5cbiAgICBpZiAoaXNEZWZpbmVkKHJvdGF0ZVkpKSB7XG4gICAgICAgIHRyYW5zZm9ybXMgKz0gYHJvdGF0ZVkoJHtyb3RhdGVZfXJhZCkgYDtcbiAgICB9XG5cbiAgICAvLyBhZGQgdHJhbnNmb3Jtc1xuICAgIGlmICh0cmFuc2Zvcm1zLmxlbmd0aCkge1xuICAgICAgICBzdHlsZXMgKz0gYHRyYW5zZm9ybToke3RyYW5zZm9ybXN9O2A7XG4gICAgfVxuXG4gICAgLy8gYWRkIG9wYWNpdHlcbiAgICBpZiAoaXNEZWZpbmVkKG9wYWNpdHkpKSB7XG4gICAgICAgIHN0eWxlcyArPSBgb3BhY2l0eToke29wYWNpdHl9O2A7XG5cbiAgICAgICAgLy8gaWYgd2UgcmVhY2ggemVybywgd2UgbWFrZSB0aGUgZWxlbWVudCBpbmFjY2Vzc2libGVcbiAgICAgICAgaWYgKG9wYWNpdHkgPT09IDApIHtcbiAgICAgICAgICAgIHN0eWxlcyArPSBgdmlzaWJpbGl0eTpoaWRkZW47YDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHdlJ3JlIGJlbG93IDEwMCUgb3BhY2l0eSB0aGlzIGVsZW1lbnQgY2FuJ3QgYmUgY2xpY2tlZFxuICAgICAgICBpZiAob3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgIHN0eWxlcyArPSBgcG9pbnRlci1ldmVudHM6bm9uZTtgO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWRkIGhlaWdodFxuICAgIGlmIChpc0RlZmluZWQoaGVpZ2h0KSkge1xuICAgICAgICBzdHlsZXMgKz0gYGhlaWdodDoke2hlaWdodH1weDtgO1xuICAgIH1cblxuICAgIC8vIGFkZCB3aWR0aFxuICAgIGlmIChpc0RlZmluZWQod2lkdGgpKSB7XG4gICAgICAgIHN0eWxlcyArPSBgd2lkdGg6JHt3aWR0aH1weDtgO1xuICAgIH1cblxuICAgIC8vIGFwcGx5IHN0eWxlc1xuICAgIGNvbnN0IGVsZW1lbnRDdXJyZW50U3R5bGUgPSBlbGVtZW50LmVsZW1lbnRDdXJyZW50U3R5bGUgfHwgJyc7XG5cbiAgICAvLyBpZiBuZXcgc3R5bGVzIGRvZXMgbm90IG1hdGNoIGN1cnJlbnQgc3R5bGVzLCBsZXRzIHVwZGF0ZSFcbiAgICBpZiAoc3R5bGVzLmxlbmd0aCAhPT0gZWxlbWVudEN1cnJlbnRTdHlsZS5sZW5ndGggfHwgc3R5bGVzICE9PSBlbGVtZW50Q3VycmVudFN0eWxlKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IHN0eWxlcztcbiAgICAgICAgLy8gc3RvcmUgY3VycmVudCBzdHlsZXMgc28gd2UgY2FuIGNvbXBhcmUgdGhlbSB0byBuZXcgc3R5bGVzIGxhdGVyIG9uXG4gICAgICAgIC8vIF9ub3RfIGdldHRpbmcgdGhlIHN0eWxlIHZhbHVlIGlzIGZhc3RlclxuICAgICAgICBlbGVtZW50LmVsZW1lbnRDdXJyZW50U3R5bGUgPSBzdHlsZXM7XG4gICAgfVxufTtcblxuY29uc3QgTWl4aW5zID0ge1xuICAgIHN0eWxlcyxcbiAgICBsaXN0ZW5lcnMsXG4gICAgYW5pbWF0aW9ucyxcbiAgICBhcGlzLFxufTtcblxuY29uc3QgdXBkYXRlUmVjdCA9IChyZWN0ID0ge30sIGVsZW1lbnQgPSB7fSwgc3R5bGUgPSB7fSkgPT4ge1xuICAgIGlmICghZWxlbWVudC5sYXlvdXRDYWxjdWxhdGVkKSB7XG4gICAgICAgIHJlY3QucGFkZGluZ1RvcCA9IHBhcnNlSW50KHN0eWxlLnBhZGRpbmdUb3AsIDEwKSB8fCAwO1xuICAgICAgICByZWN0Lm1hcmdpblRvcCA9IHBhcnNlSW50KHN0eWxlLm1hcmdpblRvcCwgMTApIHx8IDA7XG4gICAgICAgIHJlY3QubWFyZ2luUmlnaHQgPSBwYXJzZUludChzdHlsZS5tYXJnaW5SaWdodCwgMTApIHx8IDA7XG4gICAgICAgIHJlY3QubWFyZ2luQm90dG9tID0gcGFyc2VJbnQoc3R5bGUubWFyZ2luQm90dG9tLCAxMCkgfHwgMDtcbiAgICAgICAgcmVjdC5tYXJnaW5MZWZ0ID0gcGFyc2VJbnQoc3R5bGUubWFyZ2luTGVmdCwgMTApIHx8IDA7XG4gICAgICAgIGVsZW1lbnQubGF5b3V0Q2FsY3VsYXRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmVjdC5sZWZ0ID0gZWxlbWVudC5vZmZzZXRMZWZ0IHx8IDA7XG4gICAgcmVjdC50b3AgPSBlbGVtZW50Lm9mZnNldFRvcCB8fCAwO1xuICAgIHJlY3Qud2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoIHx8IDA7XG4gICAgcmVjdC5oZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodCB8fCAwO1xuXG4gICAgcmVjdC5yaWdodCA9IHJlY3QubGVmdCArIHJlY3Qud2lkdGg7XG4gICAgcmVjdC5ib3R0b20gPSByZWN0LnRvcCArIHJlY3QuaGVpZ2h0O1xuXG4gICAgcmVjdC5zY3JvbGxUb3AgPSBlbGVtZW50LnNjcm9sbFRvcDtcblxuICAgIHJlY3QuaGlkZGVuID0gZWxlbWVudC5vZmZzZXRQYXJlbnQgPT09IG51bGw7XG5cbiAgICByZXR1cm4gcmVjdDtcbn07XG5cbmNvbnN0IGNyZWF0ZVZpZXcgPVxuICAgIC8vIGRlZmF1bHQgdmlldyBkZWZpbml0aW9uXG4gICAgKHtcbiAgICAgICAgLy8gZWxlbWVudCBkZWZpbml0aW9uXG4gICAgICAgIHRhZyA9ICdkaXYnLFxuICAgICAgICBuYW1lID0gbnVsbCxcbiAgICAgICAgYXR0cmlidXRlcyA9IHt9LFxuXG4gICAgICAgIC8vIHZpZXcgaW50ZXJhY3Rpb25cbiAgICAgICAgcmVhZCA9ICgpID0+IHt9LFxuICAgICAgICB3cml0ZSA9ICgpID0+IHt9LFxuICAgICAgICBjcmVhdGUgPSAoKSA9PiB7fSxcbiAgICAgICAgZGVzdHJveSA9ICgpID0+IHt9LFxuXG4gICAgICAgIC8vIGhvb2tzXG4gICAgICAgIGZpbHRlckZyYW1lQWN0aW9uc0ZvckNoaWxkID0gKGNoaWxkLCBhY3Rpb25zKSA9PiBhY3Rpb25zLFxuICAgICAgICBkaWRDcmVhdGVWaWV3ID0gKCkgPT4ge30sXG4gICAgICAgIGRpZFdyaXRlVmlldyA9ICgpID0+IHt9LFxuXG4gICAgICAgIC8vIHJlY3QgcmVsYXRlZFxuICAgICAgICBpZ25vcmVSZWN0ID0gZmFsc2UsXG4gICAgICAgIGlnbm9yZVJlY3RVcGRhdGUgPSBmYWxzZSxcblxuICAgICAgICAvLyBtaXhpbnNcbiAgICAgICAgbWl4aW5zID0gW10sXG4gICAgfSA9IHt9KSA9PiAoXG4gICAgICAgIC8vIGVhY2ggdmlldyByZXF1aXJlcyByZWZlcmVuY2UgdG8gc3RvcmVcbiAgICAgICAgc3RvcmUsXG4gICAgICAgIC8vIHNwZWNpZmljIHByb3BlcnRpZXMgZm9yIHRoaXMgdmlld1xuICAgICAgICBwcm9wcyA9IHt9XG4gICAgKSA9PiB7XG4gICAgICAgIC8vIHJvb3QgZWxlbWVudCBzaG91bGQgbm90IGJlIGNoYW5nZWRcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQodGFnLCBgZmlsZXBvbmQtLSR7bmFtZX1gLCBhdHRyaWJ1dGVzKTtcblxuICAgICAgICAvLyBzdHlsZSByZWZlcmVuY2Ugc2hvdWxkIGFsc28gbm90IGJlIGNoYW5nZWRcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKTtcblxuICAgICAgICAvLyBlbGVtZW50IHJlY3RhbmdsZVxuICAgICAgICBjb25zdCByZWN0ID0gdXBkYXRlUmVjdCgpO1xuICAgICAgICBsZXQgZnJhbWVSZWN0ID0gbnVsbDtcblxuICAgICAgICAvLyByZXN0IHN0YXRlXG4gICAgICAgIGxldCBpc1Jlc3RpbmcgPSBmYWxzZTtcblxuICAgICAgICAvLyBwcmV0dHkgc2VsZiBleHBsYW5hdG9yeVxuICAgICAgICBjb25zdCBjaGlsZFZpZXdzID0gW107XG5cbiAgICAgICAgLy8gbG9hZGVkIG1peGluc1xuICAgICAgICBjb25zdCBhY3RpdmVNaXhpbnMgPSBbXTtcblxuICAgICAgICAvLyByZWZlcmVuY2VzIHRvIGNyZWF0ZWQgY2hpbGRyZW5cbiAgICAgICAgY29uc3QgcmVmID0ge307XG5cbiAgICAgICAgLy8gc3RhdGUgdXNlZCBmb3IgZWFjaCBpbnN0YW5jZVxuICAgICAgICBjb25zdCBzdGF0ZSA9IHt9O1xuXG4gICAgICAgIC8vIGxpc3Qgb2Ygd3JpdGVycyB0aGF0IHdpbGwgYmUgY2FsbGVkIHRvIHVwZGF0ZSB0aGlzIHZpZXdcbiAgICAgICAgY29uc3Qgd3JpdGVycyA9IFtcbiAgICAgICAgICAgIHdyaXRlLCAvLyBkZWZhdWx0IHdyaXRlclxuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IHJlYWRlcnMgPSBbXG4gICAgICAgICAgICByZWFkLCAvLyBkZWZhdWx0IHJlYWRlclxuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IGRlc3Ryb3llcnMgPSBbXG4gICAgICAgICAgICBkZXN0cm95LCAvLyBkZWZhdWx0IGRlc3Ryb3lcbiAgICAgICAgXTtcblxuICAgICAgICAvLyBjb3JlIHZpZXcgbWV0aG9kc1xuICAgICAgICBjb25zdCBnZXRFbGVtZW50ID0gKCkgPT4gZWxlbWVudDtcbiAgICAgICAgY29uc3QgZ2V0Q2hpbGRWaWV3cyA9ICgpID0+IGNoaWxkVmlld3MuY29uY2F0KCk7XG4gICAgICAgIGNvbnN0IGdldFJlZmVyZW5jZSA9ICgpID0+IHJlZjtcbiAgICAgICAgY29uc3QgY3JlYXRlQ2hpbGRWaWV3ID0gc3RvcmUgPT4gKHZpZXcsIHByb3BzKSA9PiB2aWV3KHN0b3JlLCBwcm9wcyk7XG4gICAgICAgIGNvbnN0IGdldFJlY3QgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZnJhbWVSZWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyYW1lUmVjdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZyYW1lUmVjdCA9IGdldFZpZXdSZWN0KHJlY3QsIGNoaWxkVmlld3MsIFswLCAwXSwgWzEsIDFdKTtcbiAgICAgICAgICAgIHJldHVybiBmcmFtZVJlY3Q7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGdldFN0eWxlID0gKCkgPT4gc3R5bGU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlYWQgZGF0YSBmcm9tIERPTVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3JlYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBmcmFtZVJlY3QgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyByZWFkIGNoaWxkIHZpZXdzXG4gICAgICAgICAgICBjaGlsZFZpZXdzLmZvckVhY2goY2hpbGQgPT4gY2hpbGQuX3JlYWQoKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9ICEoaWdub3JlUmVjdFVwZGF0ZSAmJiByZWN0LndpZHRoICYmIHJlY3QuaGVpZ2h0KTtcbiAgICAgICAgICAgIGlmIChzaG91bGRVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVSZWN0KHJlY3QsIGVsZW1lbnQsIHN0eWxlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVhZGVyc1xuICAgICAgICAgICAgY29uc3QgYXBpID0geyByb290OiBpbnRlcm5hbEFQSSwgcHJvcHMsIHJlY3QgfTtcbiAgICAgICAgICAgIHJlYWRlcnMuZm9yRWFjaChyZWFkZXIgPT4gcmVhZGVyKGFwaSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXcml0ZSBkYXRhIHRvIERPTVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3dyaXRlID0gKHRzLCBmcmFtZUFjdGlvbnMsIHNob3VsZE9wdGltaXplKSA9PiB7XG4gICAgICAgICAgICAvLyBpZiBubyBhY3Rpb25zLCB3ZSBhc3N1bWUgdGhhdCB0aGUgdmlldyBpcyByZXN0aW5nXG4gICAgICAgICAgICBsZXQgcmVzdGluZyA9IGZyYW1lQWN0aW9ucy5sZW5ndGggPT09IDA7XG5cbiAgICAgICAgICAgIC8vIHdyaXRlcnNcbiAgICAgICAgICAgIHdyaXRlcnMuZm9yRWFjaCh3cml0ZXIgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdyaXRlclJlc3RpbmcgPSB3cml0ZXIoe1xuICAgICAgICAgICAgICAgICAgICBwcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgcm9vdDogaW50ZXJuYWxBUEksXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IGZyYW1lQWN0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiB0cyxcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkT3B0aW1pemUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHdyaXRlclJlc3RpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3RpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gcnVuIG1peGluc1xuICAgICAgICAgICAgYWN0aXZlTWl4aW5zLmZvckVhY2gobWl4aW4gPT4ge1xuICAgICAgICAgICAgICAgIC8vIGlmIG9uZSBvZiB0aGUgbWl4aW5zIGlzIHN0aWxsIGJ1c3kgYWZ0ZXIgd3JpdGUgb3BlcmF0aW9uLCB3ZSBhcmUgbm90IHJlc3RpbmdcbiAgICAgICAgICAgICAgICBjb25zdCBtaXhpblJlc3RpbmcgPSBtaXhpbi53cml0ZSh0cyk7XG4gICAgICAgICAgICAgICAgaWYgKG1peGluUmVzdGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGVzIGNoaWxkIHZpZXdzIHRoYXQgYXJlIGN1cnJlbnRseSBhdHRhY2hlZCB0byB0aGUgRE9NXG4gICAgICAgICAgICBjaGlsZFZpZXdzXG4gICAgICAgICAgICAgICAgLmZpbHRlcihjaGlsZCA9PiAhIWNoaWxkLmVsZW1lbnQucGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGEgY2hpbGQgdmlldyBpcyBub3QgcmVzdGluZywgd2UgYXJlIG5vdCByZXN0aW5nXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkUmVzdGluZyA9IGNoaWxkLl93cml0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRnJhbWVBY3Rpb25zRm9yQ2hpbGQoY2hpbGQsIGZyYW1lQWN0aW9ucyksXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRPcHRpbWl6ZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoaWxkUmVzdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGFwcGVuZCBuZXcgZWxlbWVudHMgdG8gRE9NIGFuZCB1cGRhdGUgdGhvc2VcbiAgICAgICAgICAgIGNoaWxkVmlld3NcbiAgICAgICAgICAgICAgICAvLy5maWx0ZXIoY2hpbGQgPT4gIWNoaWxkLmVsZW1lbnQucGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgoY2hpbGQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNraXBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLmVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gYXBwZW5kIHRvIERPTVxuICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbEFQSS5hcHBlbmRDaGlsZChjaGlsZC5lbGVtZW50LCBpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCByZWFkIChuZWVkIHRvIGtub3cgdGhlIHNpemUgb2YgdGhlc2UgZWxlbWVudHMpXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLl9yZWFkKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmUtY2FsbCB3cml0ZVxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fd3JpdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckZyYW1lQWN0aW9uc0ZvckNoaWxkKGNoaWxkLCBmcmFtZUFjdGlvbnMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkT3B0aW1pemVcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBqdXN0IGFkZGVkIHNvbXRoaW5nIHRvIHRoZSBkb20sIG5vIHJlc3RcbiAgICAgICAgICAgICAgICAgICAgcmVzdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGUgcmVzdGluZyBzdGF0ZVxuICAgICAgICAgICAgaXNSZXN0aW5nID0gcmVzdGluZztcblxuICAgICAgICAgICAgZGlkV3JpdGVWaWV3KHtcbiAgICAgICAgICAgICAgICBwcm9wcyxcbiAgICAgICAgICAgICAgICByb290OiBpbnRlcm5hbEFQSSxcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBmcmFtZUFjdGlvbnMsXG4gICAgICAgICAgICAgICAgdGltZXN0YW1wOiB0cyxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBsZXQgcGFyZW50IGtub3cgaWYgd2UgYXJlIHJlc3RpbmdcbiAgICAgICAgICAgIHJldHVybiByZXN0aW5nO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IF9kZXN0cm95ID0gKCkgPT4ge1xuICAgICAgICAgICAgYWN0aXZlTWl4aW5zLmZvckVhY2gobWl4aW4gPT4gbWl4aW4uZGVzdHJveSgpKTtcbiAgICAgICAgICAgIGRlc3Ryb3llcnMuZm9yRWFjaChkZXN0cm95ZXIgPT4ge1xuICAgICAgICAgICAgICAgIGRlc3Ryb3llcih7IHJvb3Q6IGludGVybmFsQVBJLCBwcm9wcyB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2hpbGRWaWV3cy5mb3JFYWNoKGNoaWxkID0+IGNoaWxkLl9kZXN0cm95KCkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHNoYXJlZEFQSVxuICAgICAgICBjb25zdCBzaGFyZWRBUElEZWZpbml0aW9uID0ge1xuICAgICAgICAgICAgZWxlbWVudDoge1xuICAgICAgICAgICAgICAgIGdldDogZ2V0RWxlbWVudCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgIGdldDogZ2V0U3R5bGUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hpbGRWaWV3czoge1xuICAgICAgICAgICAgICAgIGdldDogZ2V0Q2hpbGRWaWV3cyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gcHJpdmF0ZSBBUEkgZGVmaW5pdGlvblxuICAgICAgICBjb25zdCBpbnRlcm5hbEFQSURlZmluaXRpb24gPSB7XG4gICAgICAgICAgICAuLi5zaGFyZWRBUElEZWZpbml0aW9uLFxuICAgICAgICAgICAgcmVjdDoge1xuICAgICAgICAgICAgICAgIGdldDogZ2V0UmVjdCxcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIGFjY2VzcyB0byBjdXN0b20gY2hpbGRyZW4gcmVmZXJlbmNlc1xuICAgICAgICAgICAgcmVmOiB7XG4gICAgICAgICAgICAgICAgZ2V0OiBnZXRSZWZlcmVuY2UsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBkb20gbW9kaWZpZXJzXG4gICAgICAgICAgICBpczogbmVlZGxlID0+IG5hbWUgPT09IG5lZWRsZSxcbiAgICAgICAgICAgIGFwcGVuZENoaWxkOiBhcHBlbmRDaGlsZChlbGVtZW50KSxcbiAgICAgICAgICAgIGNyZWF0ZUNoaWxkVmlldzogY3JlYXRlQ2hpbGRWaWV3KHN0b3JlKSxcbiAgICAgICAgICAgIGxpbmtWaWV3OiB2aWV3ID0+IHtcbiAgICAgICAgICAgICAgICBjaGlsZFZpZXdzLnB1c2godmlldyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdW5saW5rVmlldzogdmlldyA9PiB7XG4gICAgICAgICAgICAgICAgY2hpbGRWaWV3cy5zcGxpY2UoY2hpbGRWaWV3cy5pbmRleE9mKHZpZXcpLCAxKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhcHBlbmRDaGlsZFZpZXc6IGFwcGVuZENoaWxkVmlldyhlbGVtZW50LCBjaGlsZFZpZXdzKSxcbiAgICAgICAgICAgIHJlbW92ZUNoaWxkVmlldzogcmVtb3ZlQ2hpbGRWaWV3KGVsZW1lbnQsIGNoaWxkVmlld3MpLFxuICAgICAgICAgICAgcmVnaXN0ZXJXcml0ZXI6IHdyaXRlciA9PiB3cml0ZXJzLnB1c2god3JpdGVyKSxcbiAgICAgICAgICAgIHJlZ2lzdGVyUmVhZGVyOiByZWFkZXIgPT4gcmVhZGVycy5wdXNoKHJlYWRlciksXG4gICAgICAgICAgICByZWdpc3RlckRlc3Ryb3llcjogZGVzdHJveWVyID0+IGRlc3Ryb3llcnMucHVzaChkZXN0cm95ZXIpLFxuICAgICAgICAgICAgaW52YWxpZGF0ZUxheW91dDogKCkgPT4gKGVsZW1lbnQubGF5b3V0Q2FsY3VsYXRlZCA9IGZhbHNlKSxcblxuICAgICAgICAgICAgLy8gYWNjZXNzIHRvIGRhdGEgc3RvcmVcbiAgICAgICAgICAgIGRpc3BhdGNoOiBzdG9yZS5kaXNwYXRjaCxcbiAgICAgICAgICAgIHF1ZXJ5OiBzdG9yZS5xdWVyeSxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBwdWJsaWMgdmlldyBBUEkgbWV0aG9kc1xuICAgICAgICBjb25zdCBleHRlcm5hbEFQSURlZmluaXRpb24gPSB7XG4gICAgICAgICAgICBlbGVtZW50OiB7XG4gICAgICAgICAgICAgICAgZ2V0OiBnZXRFbGVtZW50LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoaWxkVmlld3M6IHtcbiAgICAgICAgICAgICAgICBnZXQ6IGdldENoaWxkVmlld3MsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVjdDoge1xuICAgICAgICAgICAgICAgIGdldDogZ2V0UmVjdCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0aW5nOiB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiBpc1Jlc3RpbmcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNSZWN0SWdub3JlZDogKCkgPT4gaWdub3JlUmVjdCxcbiAgICAgICAgICAgIF9yZWFkLFxuICAgICAgICAgICAgX3dyaXRlLFxuICAgICAgICAgICAgX2Rlc3Ryb3ksXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gbWl4aW4gQVBJIG1ldGhvZHNcbiAgICAgICAgY29uc3QgbWl4aW5BUElEZWZpbml0aW9uID0ge1xuICAgICAgICAgICAgLi4uc2hhcmVkQVBJRGVmaW5pdGlvbixcbiAgICAgICAgICAgIHJlY3Q6IHtcbiAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IHJlY3QsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGFkZCBtaXhpbiBmdW5jdGlvbmFsaXR5XG4gICAgICAgIE9iamVjdC5rZXlzKG1peGlucylcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gbW92ZSBzdHlsZXMgdG8gdGhlIGJhY2sgb2YgdGhlIG1peGluIGxpc3QgKHNvIGFkanVzdG1lbnRzIG9mIG90aGVyIG1peGlucyBhcmUgYXBwbGllZCB0byB0aGUgcHJvcHMgY29ycmVjdGx5KVxuICAgICAgICAgICAgICAgIGlmIChhID09PSAnc3R5bGVzJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGIgPT09ICdzdHlsZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtaXhpbkFQSSA9IE1peGluc1trZXldKHtcbiAgICAgICAgICAgICAgICAgICAgbWl4aW5Db25maWc6IG1peGluc1trZXldLFxuICAgICAgICAgICAgICAgICAgICB2aWV3UHJvcHM6IHByb3BzLFxuICAgICAgICAgICAgICAgICAgICB2aWV3U3RhdGU6IHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3SW50ZXJuYWxBUEk6IGludGVybmFsQVBJRGVmaW5pdGlvbixcbiAgICAgICAgICAgICAgICAgICAgdmlld0V4dGVybmFsQVBJOiBleHRlcm5hbEFQSURlZmluaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIHZpZXc6IGNyZWF0ZU9iamVjdChtaXhpbkFQSURlZmluaXRpb24pLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1peGluQVBJKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZU1peGlucy5wdXNoKG1peGluQVBJKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvLyBjb25zdHJ1Y3QgcHJpdmF0ZSBhcGlcbiAgICAgICAgY29uc3QgaW50ZXJuYWxBUEkgPSBjcmVhdGVPYmplY3QoaW50ZXJuYWxBUElEZWZpbml0aW9uKTtcblxuICAgICAgICAvLyBjcmVhdGUgdGhlIHZpZXdcbiAgICAgICAgY3JlYXRlKHtcbiAgICAgICAgICAgIHJvb3Q6IGludGVybmFsQVBJLFxuICAgICAgICAgICAgcHJvcHMsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGFwcGVuZCBjcmVhdGVkIGNoaWxkIHZpZXdzIHRvIHJvb3Qgbm9kZVxuICAgICAgICBjb25zdCBjaGlsZENvdW50ID0gZ2V0Q2hpbGRDb3VudChlbGVtZW50KTsgLy8gbmVlZCB0byBrbm93IHRoZSBjdXJyZW50IGNoaWxkIGNvdW50IHNvIGFwcGVuZGluZyBoYXBwZW5zIGluIGNvcnJlY3Qgb3JkZXJcbiAgICAgICAgY2hpbGRWaWV3cy5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGludGVybmFsQVBJLmFwcGVuZENoaWxkKGNoaWxkLmVsZW1lbnQsIGNoaWxkQ291bnQgKyBpbmRleCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNhbGwgZGlkIGNyZWF0ZVxuICAgICAgICBkaWRDcmVhdGVWaWV3KGludGVybmFsQVBJKTtcblxuICAgICAgICAvLyBleHBvc2UgcHVibGljIGFwaVxuICAgICAgICByZXR1cm4gY3JlYXRlT2JqZWN0KGV4dGVybmFsQVBJRGVmaW5pdGlvbik7XG4gICAgfTtcblxuY29uc3QgY3JlYXRlUGFpbnRlciA9IChyZWFkLCB3cml0ZSwgZnBzID0gNjApID0+IHtcbiAgICBjb25zdCBuYW1lID0gJ19fZnJhbWVQYWludGVyJztcblxuICAgIC8vIHNldCBnbG9iYWwgcGFpbnRlclxuICAgIGlmICh3aW5kb3dbbmFtZV0pIHtcbiAgICAgICAgd2luZG93W25hbWVdLnJlYWRlcnMucHVzaChyZWFkKTtcbiAgICAgICAgd2luZG93W25hbWVdLndyaXRlcnMucHVzaCh3cml0ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB3aW5kb3dbbmFtZV0gPSB7XG4gICAgICAgIHJlYWRlcnM6IFtyZWFkXSxcbiAgICAgICAgd3JpdGVyczogW3dyaXRlXSxcbiAgICB9O1xuXG4gICAgY29uc3QgcGFpbnRlciA9IHdpbmRvd1tuYW1lXTtcblxuICAgIGNvbnN0IGludGVydmFsID0gMTAwMCAvIGZwcztcbiAgICBsZXQgbGFzdCA9IG51bGw7XG4gICAgbGV0IGlkID0gbnVsbDtcbiAgICBsZXQgcmVxdWVzdFRpY2sgPSBudWxsO1xuICAgIGxldCBjYW5jZWxUaWNrID0gbnVsbDtcblxuICAgIGNvbnN0IHNldFRpbWVyVHlwZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmhpZGRlbikge1xuICAgICAgICAgICAgcmVxdWVzdFRpY2sgPSAoKSA9PiB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aWNrKHBlcmZvcm1hbmNlLm5vdygpKSwgaW50ZXJ2YWwpO1xuICAgICAgICAgICAgY2FuY2VsVGljayA9ICgpID0+IHdpbmRvdy5jbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVxdWVzdFRpY2sgPSAoKSA9PiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICAgICAgICAgICAgY2FuY2VsVGljayA9ICgpID0+IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShpZCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsICgpID0+IHtcbiAgICAgICAgaWYgKGNhbmNlbFRpY2spIGNhbmNlbFRpY2soKTtcbiAgICAgICAgc2V0VGltZXJUeXBlKCk7XG4gICAgICAgIHRpY2socGVyZm9ybWFuY2Uubm93KCkpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdGljayA9IHRzID0+IHtcbiAgICAgICAgLy8gcXVldWUgbmV4dCB0aWNrXG4gICAgICAgIGlkID0gcmVxdWVzdFRpY2sodGljayk7XG5cbiAgICAgICAgLy8gbGltaXQgZnBzXG4gICAgICAgIGlmICghbGFzdCkge1xuICAgICAgICAgICAgbGFzdCA9IHRzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVsdGEgPSB0cyAtIGxhc3Q7XG5cbiAgICAgICAgaWYgKGRlbHRhIDw9IGludGVydmFsKSB7XG4gICAgICAgICAgICAvLyBza2lwIGZyYW1lXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhbGlnbiBuZXh0IGZyYW1lXG4gICAgICAgIGxhc3QgPSB0cyAtIChkZWx0YSAlIGludGVydmFsKTtcblxuICAgICAgICAvLyB1cGRhdGUgdmlld1xuICAgICAgICBwYWludGVyLnJlYWRlcnMuZm9yRWFjaChyZWFkID0+IHJlYWQoKSk7XG4gICAgICAgIHBhaW50ZXIud3JpdGVycy5mb3JFYWNoKHdyaXRlID0+IHdyaXRlKHRzKSk7XG4gICAgfTtcblxuICAgIHNldFRpbWVyVHlwZSgpO1xuICAgIHRpY2socGVyZm9ybWFuY2Uubm93KCkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGF1c2U6ICgpID0+IHtcbiAgICAgICAgICAgIGNhbmNlbFRpY2soaWQpO1xuICAgICAgICB9LFxuICAgIH07XG59O1xuXG5jb25zdCBjcmVhdGVSb3V0ZSA9IChyb3V0ZXMsIGZuKSA9PiAoeyByb290LCBwcm9wcywgYWN0aW9ucyA9IFtdLCB0aW1lc3RhbXAsIHNob3VsZE9wdGltaXplIH0pID0+IHtcbiAgICBhY3Rpb25zXG4gICAgICAgIC5maWx0ZXIoYWN0aW9uID0+IHJvdXRlc1thY3Rpb24udHlwZV0pXG4gICAgICAgIC5mb3JFYWNoKGFjdGlvbiA9PlxuICAgICAgICAgICAgcm91dGVzW2FjdGlvbi50eXBlXSh7IHJvb3QsIHByb3BzLCBhY3Rpb246IGFjdGlvbi5kYXRhLCB0aW1lc3RhbXAsIHNob3VsZE9wdGltaXplIH0pXG4gICAgICAgICk7XG4gICAgaWYgKGZuKSB7XG4gICAgICAgIGZuKHsgcm9vdCwgcHJvcHMsIGFjdGlvbnMsIHRpbWVzdGFtcCwgc2hvdWxkT3B0aW1pemUgfSk7XG4gICAgfVxufTtcblxuY29uc3QgaW5zZXJ0QmVmb3JlID0gKG5ld05vZGUsIHJlZmVyZW5jZU5vZGUpID0+XG4gICAgcmVmZXJlbmNlTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCByZWZlcmVuY2VOb2RlKTtcblxuY29uc3QgaW5zZXJ0QWZ0ZXIgPSAobmV3Tm9kZSwgcmVmZXJlbmNlTm9kZSkgPT4ge1xuICAgIHJldHVybiByZWZlcmVuY2VOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld05vZGUsIHJlZmVyZW5jZU5vZGUubmV4dFNpYmxpbmcpO1xufTtcblxuY29uc3QgaXNBcnJheSA9IHZhbHVlID0+IEFycmF5LmlzQXJyYXkodmFsdWUpO1xuXG5jb25zdCBpc0VtcHR5ID0gdmFsdWUgPT4gdmFsdWUgPT0gbnVsbDtcblxuY29uc3QgdHJpbSA9IHN0ciA9PiBzdHIudHJpbSgpO1xuXG5jb25zdCB0b1N0cmluZyA9IHZhbHVlID0+ICcnICsgdmFsdWU7XG5cbmNvbnN0IHRvQXJyYXkgPSAodmFsdWUsIHNwbGl0dGVyID0gJywnKSA9PiB7XG4gICAgaWYgKGlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKVxuICAgICAgICAuc3BsaXQoc3BsaXR0ZXIpXG4gICAgICAgIC5tYXAodHJpbSlcbiAgICAgICAgLmZpbHRlcihzdHIgPT4gc3RyLmxlbmd0aCk7XG59O1xuXG5jb25zdCBpc0Jvb2xlYW4gPSB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJztcblxuY29uc3QgdG9Cb29sZWFuID0gdmFsdWUgPT4gKGlzQm9vbGVhbih2YWx1ZSkgPyB2YWx1ZSA6IHZhbHVlID09PSAndHJ1ZScpO1xuXG5jb25zdCBpc1N0cmluZyA9IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG5cbmNvbnN0IHRvTnVtYmVyID0gdmFsdWUgPT5cbiAgICBpc051bWJlcih2YWx1ZSkgPyB2YWx1ZSA6IGlzU3RyaW5nKHZhbHVlKSA/IHRvU3RyaW5nKHZhbHVlKS5yZXBsYWNlKC9bYS16XSsvZ2ksICcnKSA6IDA7XG5cbmNvbnN0IHRvSW50ID0gdmFsdWUgPT4gcGFyc2VJbnQodG9OdW1iZXIodmFsdWUpLCAxMCk7XG5cbmNvbnN0IHRvRmxvYXQgPSB2YWx1ZSA9PiBwYXJzZUZsb2F0KHRvTnVtYmVyKHZhbHVlKSk7XG5cbmNvbnN0IGlzSW50ID0gdmFsdWUgPT4gaXNOdW1iZXIodmFsdWUpICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWU7XG5cbmNvbnN0IHRvQnl0ZXMgPSAodmFsdWUsIGJhc2UgPSAxMDAwKSA9PiB7XG4gICAgLy8gaXMgaW4gYnl0ZXNcbiAgICBpZiAoaXNJbnQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBpcyBuYXR1cmFsIGZpbGUgc2l6ZVxuICAgIGxldCBuYXR1cmFsRmlsZVNpemUgPSB0b1N0cmluZyh2YWx1ZSkudHJpbSgpO1xuXG4gICAgLy8gaWYgaXMgdmFsdWUgaW4gbWVnYWJ5dGVzXG4gICAgaWYgKC9NQiQvaS50ZXN0KG5hdHVyYWxGaWxlU2l6ZSkpIHtcbiAgICAgICAgbmF0dXJhbEZpbGVTaXplID0gbmF0dXJhbEZpbGVTaXplLnJlcGxhY2UoL01CJGkvLCAnJykudHJpbSgpO1xuICAgICAgICByZXR1cm4gdG9JbnQobmF0dXJhbEZpbGVTaXplKSAqIGJhc2UgKiBiYXNlO1xuICAgIH1cblxuICAgIC8vIGlmIGlzIHZhbHVlIGluIGtpbG9ieXRlc1xuICAgIGlmICgvS0IvaS50ZXN0KG5hdHVyYWxGaWxlU2l6ZSkpIHtcbiAgICAgICAgbmF0dXJhbEZpbGVTaXplID0gbmF0dXJhbEZpbGVTaXplLnJlcGxhY2UoL0tCJGkvLCAnJykudHJpbSgpO1xuICAgICAgICByZXR1cm4gdG9JbnQobmF0dXJhbEZpbGVTaXplKSAqIGJhc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvSW50KG5hdHVyYWxGaWxlU2l6ZSk7XG59O1xuXG5jb25zdCBpc0Z1bmN0aW9uID0gdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xuXG5jb25zdCB0b0Z1bmN0aW9uUmVmZXJlbmNlID0gc3RyaW5nID0+IHtcbiAgICBsZXQgcmVmID0gc2VsZjtcbiAgICBsZXQgbGV2ZWxzID0gc3RyaW5nLnNwbGl0KCcuJyk7XG4gICAgbGV0IGxldmVsID0gbnVsbDtcbiAgICB3aGlsZSAoKGxldmVsID0gbGV2ZWxzLnNoaWZ0KCkpKSB7XG4gICAgICAgIHJlZiA9IHJlZltsZXZlbF07XG4gICAgICAgIGlmICghcmVmKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVmO1xufTtcblxuY29uc3QgbWV0aG9kcyA9IHtcbiAgICBwcm9jZXNzOiAnUE9TVCcsXG4gICAgcGF0Y2g6ICdQQVRDSCcsXG4gICAgcmV2ZXJ0OiAnREVMRVRFJyxcbiAgICBmZXRjaDogJ0dFVCcsXG4gICAgcmVzdG9yZTogJ0dFVCcsXG4gICAgbG9hZDogJ0dFVCcsXG59O1xuXG5jb25zdCBjcmVhdGVTZXJ2ZXJBUEkgPSBvdXRsaW5lID0+IHtcbiAgICBjb25zdCBhcGkgPSB7fTtcblxuICAgIGFwaS51cmwgPSBpc1N0cmluZyhvdXRsaW5lKSA/IG91dGxpbmUgOiBvdXRsaW5lLnVybCB8fCAnJztcbiAgICBhcGkudGltZW91dCA9IG91dGxpbmUudGltZW91dCA/IHBhcnNlSW50KG91dGxpbmUudGltZW91dCwgMTApIDogMDtcbiAgICBhcGkuaGVhZGVycyA9IG91dGxpbmUuaGVhZGVycyA/IG91dGxpbmUuaGVhZGVycyA6IHt9O1xuXG4gICAgZm9yaW4obWV0aG9kcywga2V5ID0+IHtcbiAgICAgICAgYXBpW2tleV0gPSBjcmVhdGVBY3Rpb24oa2V5LCBvdXRsaW5lW2tleV0sIG1ldGhvZHNba2V5XSwgYXBpLnRpbWVvdXQsIGFwaS5oZWFkZXJzKTtcbiAgICB9KTtcblxuICAgIC8vIHJlbW92ZSBwcm9jZXNzIGlmIG5vIHVybCBvciBwcm9jZXNzIG9uIG91dGxpbmVcbiAgICBhcGkucHJvY2VzcyA9IG91dGxpbmUucHJvY2VzcyB8fCBpc1N0cmluZyhvdXRsaW5lKSB8fCBvdXRsaW5lLnVybCA/IGFwaS5wcm9jZXNzIDogbnVsbDtcblxuICAgIC8vIHNwZWNpYWwgdHJlYXRtZW50IGZvciByZW1vdmVcbiAgICBhcGkucmVtb3ZlID0gb3V0bGluZS5yZW1vdmUgfHwgbnVsbDtcblxuICAgIC8vIHJlbW92ZSBnZW5lcmljIGhlYWRlcnMgZnJvbSBhcGkgb2JqZWN0XG4gICAgZGVsZXRlIGFwaS5oZWFkZXJzO1xuXG4gICAgcmV0dXJuIGFwaTtcbn07XG5cbmNvbnN0IGNyZWF0ZUFjdGlvbiA9IChuYW1lLCBvdXRsaW5lLCBtZXRob2QsIHRpbWVvdXQsIGhlYWRlcnMpID0+IHtcbiAgICAvLyBpcyBleHBsaWNpdGVseSBzZXQgdG8gbnVsbCBzbyBkaXNhYmxlXG4gICAgaWYgKG91dGxpbmUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gaWYgaXMgY3VzdG9tIGZ1bmN0aW9uLCBkb25lISBEZXYgaGFuZGxlcyBldmVyeXRoaW5nLlxuICAgIGlmICh0eXBlb2Ygb3V0bGluZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gb3V0bGluZTtcbiAgICB9XG5cbiAgICAvLyBidWlsZCBhY3Rpb24gb2JqZWN0XG4gICAgY29uc3QgYWN0aW9uID0ge1xuICAgICAgICB1cmw6IG1ldGhvZCA9PT0gJ0dFVCcgfHwgbWV0aG9kID09PSAnUEFUQ0gnID8gYD8ke25hbWV9PWAgOiAnJyxcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IGZhbHNlLFxuICAgICAgICB0aW1lb3V0LFxuICAgICAgICBvbmxvYWQ6IG51bGwsXG4gICAgICAgIG9uZGF0YTogbnVsbCxcbiAgICAgICAgb25lcnJvcjogbnVsbCxcbiAgICB9O1xuXG4gICAgLy8gaXMgYSBzaW5nbGUgdXJsXG4gICAgaWYgKGlzU3RyaW5nKG91dGxpbmUpKSB7XG4gICAgICAgIGFjdGlvbi51cmwgPSBvdXRsaW5lO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cblxuICAgIC8vIG92ZXJ3cml0ZVxuICAgIE9iamVjdC5hc3NpZ24oYWN0aW9uLCBvdXRsaW5lKTtcblxuICAgIC8vIHNlZSBpZiBzaG91bGQgcmVmb3JtYXQgaGVhZGVycztcbiAgICBpZiAoaXNTdHJpbmcoYWN0aW9uLmhlYWRlcnMpKSB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gYWN0aW9uLmhlYWRlcnMuc3BsaXQoLzooLispLyk7XG4gICAgICAgIGFjdGlvbi5oZWFkZXJzID0ge1xuICAgICAgICAgICAgaGVhZGVyOiBwYXJ0c1swXSxcbiAgICAgICAgICAgIHZhbHVlOiBwYXJ0c1sxXSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBpZiBpcyBib29sIHdpdGhDcmVkZW50aWFsc1xuICAgIGFjdGlvbi53aXRoQ3JlZGVudGlhbHMgPSB0b0Jvb2xlYW4oYWN0aW9uLndpdGhDcmVkZW50aWFscyk7XG5cbiAgICByZXR1cm4gYWN0aW9uO1xufTtcblxuY29uc3QgdG9TZXJ2ZXJBUEkgPSB2YWx1ZSA9PiBjcmVhdGVTZXJ2ZXJBUEkodmFsdWUpO1xuXG5jb25zdCBpc051bGwgPSB2YWx1ZSA9PiB2YWx1ZSA9PT0gbnVsbDtcblxuY29uc3QgaXNPYmplY3QgPSB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsO1xuXG5jb25zdCBpc0FQSSA9IHZhbHVlID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICBpc09iamVjdCh2YWx1ZSkgJiZcbiAgICAgICAgaXNTdHJpbmcodmFsdWUudXJsKSAmJlxuICAgICAgICBpc09iamVjdCh2YWx1ZS5wcm9jZXNzKSAmJlxuICAgICAgICBpc09iamVjdCh2YWx1ZS5yZXZlcnQpICYmXG4gICAgICAgIGlzT2JqZWN0KHZhbHVlLnJlc3RvcmUpICYmXG4gICAgICAgIGlzT2JqZWN0KHZhbHVlLmZldGNoKVxuICAgICk7XG59O1xuXG5jb25zdCBnZXRUeXBlID0gdmFsdWUgPT4ge1xuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG5cbiAgICBpZiAoaXNOdWxsKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gJ251bGwnO1xuICAgIH1cblxuICAgIGlmIChpc0ludCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuICdpbnQnO1xuICAgIH1cblxuICAgIGlmICgvXlswLTldKyA/KD86R0J8TUJ8S0IpJC9naS50ZXN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gJ2J5dGVzJztcbiAgICB9XG5cbiAgICBpZiAoaXNBUEkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiAnYXBpJztcbiAgICB9XG5cbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlO1xufTtcblxuY29uc3QgcmVwbGFjZVNpbmdsZVF1b3RlcyA9IHN0ciA9PlxuICAgIHN0clxuICAgICAgICAucmVwbGFjZSgve1xccyonL2csICd7XCInKVxuICAgICAgICAucmVwbGFjZSgvJ1xccyp9L2csICdcIn0nKVxuICAgICAgICAucmVwbGFjZSgvJ1xccyo6L2csICdcIjonKVxuICAgICAgICAucmVwbGFjZSgvOlxccyonL2csICc6XCInKVxuICAgICAgICAucmVwbGFjZSgvLFxccyonL2csICcsXCInKVxuICAgICAgICAucmVwbGFjZSgvJ1xccyosL2csICdcIiwnKTtcblxuY29uc3QgY29udmVyc2lvblRhYmxlID0ge1xuICAgIGFycmF5OiB0b0FycmF5LFxuICAgIGJvb2xlYW46IHRvQm9vbGVhbixcbiAgICBpbnQ6IHZhbHVlID0+IChnZXRUeXBlKHZhbHVlKSA9PT0gJ2J5dGVzJyA/IHRvQnl0ZXModmFsdWUpIDogdG9JbnQodmFsdWUpKSxcbiAgICBudW1iZXI6IHRvRmxvYXQsXG4gICAgZmxvYXQ6IHRvRmxvYXQsXG4gICAgYnl0ZXM6IHRvQnl0ZXMsXG4gICAgc3RyaW5nOiB2YWx1ZSA9PiAoaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZSA6IHRvU3RyaW5nKHZhbHVlKSksXG4gICAgZnVuY3Rpb246IHZhbHVlID0+IHRvRnVuY3Rpb25SZWZlcmVuY2UodmFsdWUpLFxuICAgIHNlcnZlcmFwaTogdG9TZXJ2ZXJBUEksXG4gICAgb2JqZWN0OiB2YWx1ZSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXBsYWNlU2luZ2xlUXVvdGVzKHZhbHVlKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSxcbn07XG5cbmNvbnN0IGNvbnZlcnRUbyA9ICh2YWx1ZSwgdHlwZSkgPT4gY29udmVyc2lvblRhYmxlW3R5cGVdKHZhbHVlKTtcblxuY29uc3QgZ2V0VmFsdWVCeVR5cGUgPSAobmV3VmFsdWUsIGRlZmF1bHRWYWx1ZSwgdmFsdWVUeXBlKSA9PiB7XG4gICAgLy8gY2FuIGFsd2F5cyBhc3NpZ24gZGVmYXVsdCB2YWx1ZVxuICAgIGlmIChuZXdWYWx1ZSA9PT0gZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICB9XG5cbiAgICAvLyBnZXQgdGhlIHR5cGUgb2YgdGhlIG5ldyB2YWx1ZVxuICAgIGxldCBuZXdWYWx1ZVR5cGUgPSBnZXRUeXBlKG5ld1ZhbHVlKTtcblxuICAgIC8vIGlzIHZhbGlkIHR5cGU/XG4gICAgaWYgKG5ld1ZhbHVlVHlwZSAhPT0gdmFsdWVUeXBlKSB7XG4gICAgICAgIC8vIGlzIHN0cmluZyBpbnB1dCwgbGV0J3MgYXR0ZW1wdCB0byBjb252ZXJ0XG4gICAgICAgIGNvbnN0IGNvbnZlcnRlZFZhbHVlID0gY29udmVydFRvKG5ld1ZhbHVlLCB2YWx1ZVR5cGUpO1xuXG4gICAgICAgIC8vIHdoYXQgaXMgdGhlIHR5cGUgbm93XG4gICAgICAgIG5ld1ZhbHVlVHlwZSA9IGdldFR5cGUoY29udmVydGVkVmFsdWUpO1xuXG4gICAgICAgIC8vIG5vIHZhbGlkIGNvbnZlcnNpb25zIGZvdW5kXG4gICAgICAgIGlmIChjb252ZXJ0ZWRWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgYFRyeWluZyB0byBhc3NpZ24gdmFsdWUgd2l0aCBpbmNvcnJlY3QgdHlwZSB0byBcIiR7b3B0aW9ufVwiLCBhbGxvd2VkIHR5cGU6IFwiJHt2YWx1ZVR5cGV9XCJgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3VmFsdWUgPSBjb252ZXJ0ZWRWYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFzc2lnbiBuZXcgdmFsdWVcbiAgICByZXR1cm4gbmV3VmFsdWU7XG59O1xuXG5jb25zdCBjcmVhdGVPcHRpb24gPSAoZGVmYXVsdFZhbHVlLCB2YWx1ZVR5cGUpID0+IHtcbiAgICBsZXQgY3VycmVudFZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgIHJldHVybiB7XG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGdldDogKCkgPT4gY3VycmVudFZhbHVlLFxuICAgICAgICBzZXQ6IG5ld1ZhbHVlID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IGdldFZhbHVlQnlUeXBlKG5ld1ZhbHVlLCBkZWZhdWx0VmFsdWUsIHZhbHVlVHlwZSk7XG4gICAgICAgIH0sXG4gICAgfTtcbn07XG5cbmNvbnN0IGNyZWF0ZU9wdGlvbnMgPSBvcHRpb25zID0+IHtcbiAgICBjb25zdCBvYmogPSB7fTtcbiAgICBmb3JpbihvcHRpb25zLCBwcm9wID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9uRGVmaW5pdGlvbiA9IG9wdGlvbnNbcHJvcF07XG4gICAgICAgIG9ialtwcm9wXSA9IGNyZWF0ZU9wdGlvbihvcHRpb25EZWZpbml0aW9uWzBdLCBvcHRpb25EZWZpbml0aW9uWzFdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY3JlYXRlT2JqZWN0KG9iaik7XG59O1xuXG5jb25zdCBjcmVhdGVJbml0aWFsU3RhdGUgPSBvcHRpb25zID0+ICh7XG4gICAgLy8gbW9kZWxcbiAgICBpdGVtczogW10sXG5cbiAgICAvLyB0aW1lb3V0IHVzZWQgZm9yIGNhbGxpbmcgdXBkYXRlIGl0ZW1zXG4gICAgbGlzdFVwZGF0ZVRpbWVvdXQ6IG51bGwsXG5cbiAgICAvLyB0aW1lb3V0IHVzZWQgZm9yIHN0YWNraW5nIG1ldGFkYXRhIHVwZGF0ZXNcbiAgICBpdGVtVXBkYXRlVGltZW91dDogbnVsbCxcblxuICAgIC8vIHF1ZXVlIG9mIGl0ZW1zIHdhaXRpbmcgdG8gYmUgcHJvY2Vzc2VkXG4gICAgcHJvY2Vzc2luZ1F1ZXVlOiBbXSxcblxuICAgIC8vIG9wdGlvbnNcbiAgICBvcHRpb25zOiBjcmVhdGVPcHRpb25zKG9wdGlvbnMpLFxufSk7XG5cbmNvbnN0IGZyb21DYW1lbHMgPSAoc3RyaW5nLCBzZXBhcmF0b3IgPSAnLScpID0+XG4gICAgc3RyaW5nXG4gICAgICAgIC5zcGxpdCgvKD89W0EtWl0pLylcbiAgICAgICAgLm1hcChwYXJ0ID0+IHBhcnQudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgLmpvaW4oc2VwYXJhdG9yKTtcblxuY29uc3QgY3JlYXRlT3B0aW9uQVBJID0gKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgY29uc3Qgb2JqID0ge307XG4gICAgZm9yaW4ob3B0aW9ucywga2V5ID0+IHtcbiAgICAgICAgb2JqW2tleV0gPSB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IHN0b3JlLmdldFN0YXRlKCkub3B0aW9uc1trZXldLFxuICAgICAgICAgICAgc2V0OiB2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goYFNFVF8ke2Zyb21DYW1lbHMoa2V5LCAnXycpLnRvVXBwZXJDYXNlKCl9YCwge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbn07XG5cbmNvbnN0IGNyZWF0ZU9wdGlvbkFjdGlvbnMgPSBvcHRpb25zID0+IChkaXNwYXRjaCwgcXVlcnksIHN0YXRlKSA9PiB7XG4gICAgY29uc3Qgb2JqID0ge307XG4gICAgZm9yaW4ob3B0aW9ucywga2V5ID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGZyb21DYW1lbHMoa2V5LCAnXycpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgb2JqW2BTRVRfJHtuYW1lfWBdID0gYWN0aW9uID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3RhdGUub3B0aW9uc1trZXldID0gYWN0aW9uLnZhbHVlO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIG5vcGUsIGZhaWxlZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB3ZSBzdWNjZXNzZnVsbHkgc2V0IHRoZSB2YWx1ZSBvZiB0aGlzIG9wdGlvblxuICAgICAgICAgICAgZGlzcGF0Y2goYERJRF9TRVRfJHtuYW1lfWAsIHsgdmFsdWU6IHN0YXRlLm9wdGlvbnNba2V5XSB9KTtcbiAgICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xufTtcblxuY29uc3QgY3JlYXRlT3B0aW9uUXVlcmllcyA9IG9wdGlvbnMgPT4gc3RhdGUgPT4ge1xuICAgIGNvbnN0IG9iaiA9IHt9O1xuICAgIGZvcmluKG9wdGlvbnMsIGtleSA9PiB7XG4gICAgICAgIG9ialtgR0VUXyR7ZnJvbUNhbWVscyhrZXksICdfJykudG9VcHBlckNhc2UoKX1gXSA9IGFjdGlvbiA9PiBzdGF0ZS5vcHRpb25zW2tleV07XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbn07XG5cbmNvbnN0IEludGVyYWN0aW9uTWV0aG9kID0ge1xuICAgIEFQSTogMSxcbiAgICBEUk9QOiAyLFxuICAgIEJST1dTRTogMyxcbiAgICBQQVNURTogNCxcbiAgICBOT05FOiA1LFxufTtcblxuY29uc3QgZ2V0VW5pcXVlSWQgPSAoKSA9PlxuICAgIE1hdGgucmFuZG9tKClcbiAgICAgICAgLnRvU3RyaW5nKDM2KVxuICAgICAgICAuc3Vic3RyaW5nKDIsIDExKTtcblxuY29uc3QgYXJyYXlSZW1vdmUgPSAoYXJyLCBpbmRleCkgPT4gYXJyLnNwbGljZShpbmRleCwgMSk7XG5cbmNvbnN0IHJ1biA9IChjYiwgc3luYykgPT4ge1xuICAgIGlmIChzeW5jKSB7XG4gICAgICAgIGNiKCk7XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudC5oaWRkZW4pIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKDEpLnRoZW4oY2IpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoY2IsIDApO1xuICAgIH1cbn07XG5cbmNvbnN0IG9uID0gKCkgPT4ge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IFtdO1xuICAgIGNvbnN0IG9mZiA9IChldmVudCwgY2IpID0+IHtcbiAgICAgICAgYXJyYXlSZW1vdmUoXG4gICAgICAgICAgICBsaXN0ZW5lcnMsXG4gICAgICAgICAgICBsaXN0ZW5lcnMuZmluZEluZGV4KGxpc3RlbmVyID0+IGxpc3RlbmVyLmV2ZW50ID09PSBldmVudCAmJiAobGlzdGVuZXIuY2IgPT09IGNiIHx8ICFjYikpXG4gICAgICAgICk7XG4gICAgfTtcbiAgICBjb25zdCBmaXJlID0gKGV2ZW50LCBhcmdzLCBzeW5jKSA9PiB7XG4gICAgICAgIGxpc3RlbmVyc1xuICAgICAgICAgICAgLmZpbHRlcihsaXN0ZW5lciA9PiBsaXN0ZW5lci5ldmVudCA9PT0gZXZlbnQpXG4gICAgICAgICAgICAubWFwKGxpc3RlbmVyID0+IGxpc3RlbmVyLmNiKVxuICAgICAgICAgICAgLmZvckVhY2goY2IgPT4gcnVuKCgpID0+IGNiKC4uLmFyZ3MpLCBzeW5jKSk7XG4gICAgfTtcbiAgICByZXR1cm4ge1xuICAgICAgICBmaXJlU3luYzogKGV2ZW50LCAuLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICBmaXJlKGV2ZW50LCBhcmdzLCB0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmlyZTogKGV2ZW50LCAuLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICBmaXJlKGV2ZW50LCBhcmdzLCBmYWxzZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uOiAoZXZlbnQsIGNiKSA9PiB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMucHVzaCh7IGV2ZW50LCBjYiB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25PbmNlOiAoZXZlbnQsIGNiKSA9PiB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgY2I6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9mZihldmVudCwgY2IpO1xuICAgICAgICAgICAgICAgICAgICBjYiguLi5hcmdzKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9mZixcbiAgICB9O1xufTtcblxuY29uc3QgY29weU9iamVjdFByb3BlcnRpZXNUb09iamVjdCA9IChzcmMsIHRhcmdldCwgZXhjbHVkZWQpID0+IHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzcmMpXG4gICAgICAgIC5maWx0ZXIocHJvcGVydHkgPT4gIWV4Y2x1ZGVkLmluY2x1ZGVzKHByb3BlcnR5KSlcbiAgICAgICAgLmZvckVhY2goa2V5ID0+XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc3JjLCBrZXkpKVxuICAgICAgICApO1xufTtcblxuY29uc3QgUFJJVkFURSA9IFtcbiAgICAnZmlyZScsXG4gICAgJ3Byb2Nlc3MnLFxuICAgICdyZXZlcnQnLFxuICAgICdsb2FkJyxcbiAgICAnb24nLFxuICAgICdvZmYnLFxuICAgICdvbk9uY2UnLFxuICAgICdyZXRyeUxvYWQnLFxuICAgICdleHRlbmQnLFxuICAgICdhcmNoaXZlJyxcbiAgICAnYXJjaGl2ZWQnLFxuICAgICdyZWxlYXNlJyxcbiAgICAncmVsZWFzZWQnLFxuICAgICdyZXF1ZXN0UHJvY2Vzc2luZycsXG4gICAgJ2ZyZWV6ZScsXG5dO1xuXG5jb25zdCBjcmVhdGVJdGVtQVBJID0gaXRlbSA9PiB7XG4gICAgY29uc3QgYXBpID0ge307XG4gICAgY29weU9iamVjdFByb3BlcnRpZXNUb09iamVjdChpdGVtLCBhcGksIFBSSVZBVEUpO1xuICAgIHJldHVybiBhcGk7XG59O1xuXG5jb25zdCByZW1vdmVSZWxlYXNlZEl0ZW1zID0gaXRlbXMgPT4ge1xuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChpdGVtLnJlbGVhc2VkKSB7XG4gICAgICAgICAgICBhcnJheVJlbW92ZShpdGVtcywgaW5kZXgpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5jb25zdCBJdGVtU3RhdHVzID0ge1xuICAgIElOSVQ6IDEsXG4gICAgSURMRTogMixcbiAgICBQUk9DRVNTSU5HX1FVRVVFRDogOSxcbiAgICBQUk9DRVNTSU5HOiAzLFxuICAgIFBST0NFU1NJTkdfQ09NUExFVEU6IDUsXG4gICAgUFJPQ0VTU0lOR19FUlJPUjogNixcbiAgICBQUk9DRVNTSU5HX1JFVkVSVF9FUlJPUjogMTAsXG4gICAgTE9BRElORzogNyxcbiAgICBMT0FEX0VSUk9SOiA4LFxufTtcblxuY29uc3QgRmlsZU9yaWdpbiA9IHtcbiAgICBJTlBVVDogMSxcbiAgICBMSU1CTzogMixcbiAgICBMT0NBTDogMyxcbn07XG5cbmNvbnN0IGdldE5vbk51bWVyaWMgPSBzdHIgPT4gL1teMC05XSsvLmV4ZWMoc3RyKTtcblxuY29uc3QgZ2V0RGVjaW1hbFNlcGFyYXRvciA9ICgpID0+IGdldE5vbk51bWVyaWMoKDEuMSkudG9Mb2NhbGVTdHJpbmcoKSlbMF07XG5cbmNvbnN0IGdldFRob3VzYW5kc1NlcGFyYXRvciA9ICgpID0+IHtcbiAgICAvLyBBZGRlZCBmb3IgYnJvd3NlcnMgdGhhdCBkbyBub3QgcmV0dXJuIHRoZSB0aG91c2FuZHMgc2VwYXJhdG9yIChoYXBwZW5kIG9uIG5hdGl2ZSBicm93c2VyIEFuZHJvaWQgNC40LjQpXG4gICAgLy8gV2UgY2hlY2sgYWdhaW5zdCB0aGUgbm9ybWFsIHRvU3RyaW5nIG91dHB1dCBhbmQgaWYgdGhleSdyZSB0aGUgc2FtZSByZXR1cm4gYSBjb21tYSB3aGVuIGRlY2ltYWwgc2VwYXJhdG9yIGlzIGEgZG90XG4gICAgY29uc3QgZGVjaW1hbFNlcGFyYXRvciA9IGdldERlY2ltYWxTZXBhcmF0b3IoKTtcbiAgICBjb25zdCB0aG91c2FuZHNTdHJpbmdXaXRoU2VwYXJhdG9yID0gKDEwMDAuMCkudG9Mb2NhbGVTdHJpbmcoKTtcbiAgICBjb25zdCB0aG91c2FuZHNTdHJpbmdXaXRob3V0U2VwYXJhdG9yID0gKDEwMDAuMCkudG9TdHJpbmcoKTtcbiAgICBpZiAodGhvdXNhbmRzU3RyaW5nV2l0aFNlcGFyYXRvciAhPT0gdGhvdXNhbmRzU3RyaW5nV2l0aG91dFNlcGFyYXRvcikge1xuICAgICAgICByZXR1cm4gZ2V0Tm9uTnVtZXJpYyh0aG91c2FuZHNTdHJpbmdXaXRoU2VwYXJhdG9yKVswXTtcbiAgICB9XG4gICAgcmV0dXJuIGRlY2ltYWxTZXBhcmF0b3IgPT09ICcuJyA/ICcsJyA6ICcuJztcbn07XG5cbmNvbnN0IFR5cGUgPSB7XG4gICAgQk9PTEVBTjogJ2Jvb2xlYW4nLFxuICAgIElOVDogJ2ludCcsXG4gICAgTlVNQkVSOiAnbnVtYmVyJyxcbiAgICBTVFJJTkc6ICdzdHJpbmcnLFxuICAgIEFSUkFZOiAnYXJyYXknLFxuICAgIE9CSkVDVDogJ29iamVjdCcsXG4gICAgRlVOQ1RJT046ICdmdW5jdGlvbicsXG4gICAgQUNUSU9OOiAnYWN0aW9uJyxcbiAgICBTRVJWRVJfQVBJOiAnc2VydmVyYXBpJyxcbiAgICBSRUdFWDogJ3JlZ2V4Jyxcbn07XG5cbi8vIGFsbCByZWdpc3RlcmVkIGZpbHRlcnNcbmNvbnN0IGZpbHRlcnMgPSBbXTtcblxuLy8gbG9vcHMgb3ZlciBtYXRjaGluZyBmaWx0ZXJzIGFuZCBwYXNzZXMgb3B0aW9ucyB0byBlYWNoIGZpbHRlciwgcmV0dXJuaW5nIHRoZSBtYXBwZWQgcmVzdWx0c1xuY29uc3QgYXBwbHlGaWx0ZXJDaGFpbiA9IChrZXksIHZhbHVlLCB1dGlscykgPT5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIC8vIGZpbmQgbWF0Y2hpbmcgZmlsdGVycyBmb3IgdGhpcyBrZXlcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdGaWx0ZXJzID0gZmlsdGVycy5maWx0ZXIoZiA9PiBmLmtleSA9PT0ga2V5KS5tYXAoZiA9PiBmLmNiKTtcblxuICAgICAgICAvLyByZXNvbHZlIG5vd1xuICAgICAgICBpZiAobWF0Y2hpbmdGaWx0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaXJzdCBmaWx0ZXIgdG8ga2ljayB0aGluZ3Mgb2ZcbiAgICAgICAgY29uc3QgaW5pdGlhbEZpbHRlciA9IG1hdGNoaW5nRmlsdGVycy5zaGlmdCgpO1xuXG4gICAgICAgIC8vIGNoYWluIGZpbHRlcnNcbiAgICAgICAgbWF0Y2hpbmdGaWx0ZXJzXG4gICAgICAgICAgICAucmVkdWNlKFxuICAgICAgICAgICAgICAgIC8vIGxvb3Agb3ZlciBwcm9taXNlcyBwYXNzaW5nIHZhbHVlIHRvIG5leHQgcHJvbWlzZVxuICAgICAgICAgICAgICAgIChjdXJyZW50LCBuZXh0KSA9PiBjdXJyZW50LnRoZW4odmFsdWUgPT4gbmV4dCh2YWx1ZSwgdXRpbHMpKSxcblxuICAgICAgICAgICAgICAgIC8vIGNhbGwgaW5pdGlhbCBmaWx0ZXIsIHdpbGwgcmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICAgICAgICAgIGluaXRpYWxGaWx0ZXIodmFsdWUsIHV0aWxzKVxuXG4gICAgICAgICAgICAgICAgLy8gYWxsIGV4ZWN1dGVkXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAudGhlbih2YWx1ZSA9PiByZXNvbHZlKHZhbHVlKSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiByZWplY3QoZXJyb3IpKTtcbiAgICB9KTtcblxuY29uc3QgYXBwbHlGaWx0ZXJzID0gKGtleSwgdmFsdWUsIHV0aWxzKSA9PlxuICAgIGZpbHRlcnMuZmlsdGVyKGYgPT4gZi5rZXkgPT09IGtleSkubWFwKGYgPT4gZi5jYih2YWx1ZSwgdXRpbHMpKTtcblxuLy8gYWRkcyBhIG5ldyBmaWx0ZXIgdG8gdGhlIGxpc3RcbmNvbnN0IGFkZEZpbHRlciA9IChrZXksIGNiKSA9PiBmaWx0ZXJzLnB1c2goeyBrZXksIGNiIH0pO1xuXG5jb25zdCBleHRlbmREZWZhdWx0T3B0aW9ucyA9IGFkZGl0aW9uYWxPcHRpb25zID0+IE9iamVjdC5hc3NpZ24oZGVmYXVsdE9wdGlvbnMsIGFkZGl0aW9uYWxPcHRpb25zKTtcblxuY29uc3QgZ2V0T3B0aW9ucyA9ICgpID0+ICh7IC4uLmRlZmF1bHRPcHRpb25zIH0pO1xuXG5jb25zdCBzZXRPcHRpb25zID0gb3B0cyA9PiB7XG4gICAgZm9yaW4ob3B0cywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgLy8ga2V5IGRvZXMgbm90IGV4aXN0LCBzbyB0aGlzIG9wdGlvbiBjYW5ub3QgYmUgc2V0XG4gICAgICAgIGlmICghZGVmYXVsdE9wdGlvbnNba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHRPcHRpb25zW2tleV1bMF0gPSBnZXRWYWx1ZUJ5VHlwZShcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgZGVmYXVsdE9wdGlvbnNba2V5XVswXSxcbiAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zW2tleV1bMV1cbiAgICAgICAgKTtcbiAgICB9KTtcbn07XG5cbi8vIGRlZmF1bHQgb3B0aW9ucyBvbiBhcHBcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIC8vIHRoZSBpZCB0byBhZGQgdG8gdGhlIHJvb3QgZWxlbWVudFxuICAgIGlkOiBbbnVsbCwgVHlwZS5TVFJJTkddLFxuXG4gICAgLy8gaW5wdXQgZmllbGQgbmFtZSB0byB1c2VcbiAgICBuYW1lOiBbJ2ZpbGVwb25kJywgVHlwZS5TVFJJTkddLFxuXG4gICAgLy8gZGlzYWJsZSB0aGUgZmllbGRcbiAgICBkaXNhYmxlZDogW2ZhbHNlLCBUeXBlLkJPT0xFQU5dLFxuXG4gICAgLy8gY2xhc3NuYW1lIHRvIHB1dCBvbiB3cmFwcGVyXG4gICAgY2xhc3NOYW1lOiBbbnVsbCwgVHlwZS5TVFJJTkddLFxuXG4gICAgLy8gaXMgdGhlIGZpZWxkIHJlcXVpcmVkXG4gICAgcmVxdWlyZWQ6IFtmYWxzZSwgVHlwZS5CT09MRUFOXSxcblxuICAgIC8vIEFsbG93IG1lZGlhIGNhcHR1cmUgd2hlbiB2YWx1ZSBpcyBzZXRcbiAgICBjYXB0dXJlTWV0aG9kOiBbbnVsbCwgVHlwZS5TVFJJTkddLFxuICAgIC8vIC0gXCJjYW1lcmFcIiwgXCJtaWNyb3Bob25lXCIgb3IgXCJjYW1jb3JkZXJcIixcbiAgICAvLyAtIERvZXMgbm90IHdvcmsgd2l0aCBtdWx0aXBsZSBvbiBhcHBsZSBkZXZpY2VzXG4gICAgLy8gLSBJZiBzZXQsIGFjY2VwdGVkRmlsZVR5cGVzIG11c3QgYmUgbWFkZSB0byBtYXRjaCB3aXRoIG1lZGlhIHdpbGRjYXJkIFwiaW1hZ2UvKlwiLCBcImF1ZGlvLypcIiBvciBcInZpZGVvLypcIlxuXG4gICAgLy8gc3luYyBgYWNjZXB0ZWRGaWxlVHlwZXNgIHByb3BlcnR5IHdpdGggYGFjY2VwdGAgYXR0cmlidXRlXG4gICAgYWxsb3dTeW5jQWNjZXB0QXR0cmlidXRlOiBbdHJ1ZSwgVHlwZS5CT09MRUFOXSxcblxuICAgIC8vIEZlYXR1cmUgdG9nZ2xlc1xuICAgIGFsbG93RHJvcDogW3RydWUsIFR5cGUuQk9PTEVBTl0sIC8vIEFsbG93IGRyb3BwaW5nIG9mIGZpbGVzXG4gICAgYWxsb3dCcm93c2U6IFt0cnVlLCBUeXBlLkJPT0xFQU5dLCAvLyBBbGxvdyBicm93c2luZyB0aGUgZmlsZSBzeXN0ZW1cbiAgICBhbGxvd1Bhc3RlOiBbdHJ1ZSwgVHlwZS5CT09MRUFOXSwgLy8gQWxsb3cgcGFzdGluZyBmaWxlc1xuICAgIGFsbG93TXVsdGlwbGU6IFtmYWxzZSwgVHlwZS5CT09MRUFOXSwgLy8gQWxsb3cgbXVsdGlwbGUgZmlsZXMgKGRpc2FibGVkIGJ5IGRlZmF1bHQsIGFzIG11bHRpcGxlIGF0dHJpYnV0ZSBpcyBhbHNvIHJlcXVpcmVkIG9uIGlucHV0IHRvIGFsbG93IG11bHRpcGxlKVxuICAgIGFsbG93UmVwbGFjZTogW3RydWUsIFR5cGUuQk9PTEVBTl0sIC8vIEFsbG93IGRyb3BwaW5nIGEgZmlsZSBvbiBvdGhlciBmaWxlIHRvIHJlcGxhY2UgaXQgKG9ubHkgd29ya3Mgd2hlbiBtdWx0aXBsZSBpcyBzZXQgdG8gZmFsc2UpXG4gICAgYWxsb3dSZXZlcnQ6IFt0cnVlLCBUeXBlLkJPT0xFQU5dLCAvLyBBbGxvd3MgdXNlciB0byByZXZlcnQgZmlsZSB1cGxvYWRcbiAgICBhbGxvd1JlbW92ZTogW3RydWUsIFR5cGUuQk9PTEVBTl0sIC8vIEFsbG93IHVzZXIgdG8gcmVtb3ZlIGEgZmlsZVxuICAgIGFsbG93UHJvY2VzczogW3RydWUsIFR5cGUuQk9PTEVBTl0sIC8vIEFsbG93cyB1c2VyIHRvIHByb2Nlc3MgYSBmaWxlLCB3aGVuIHNldCB0byBmYWxzZSwgdGhpcyByZW1vdmVzIHRoZSBmaWxlIHVwbG9hZCBidXR0b25cbiAgICBhbGxvd1Jlb3JkZXI6IFtmYWxzZSwgVHlwZS5CT09MRUFOXSwgLy8gQWxsb3cgcmVvcmRlcmluZyBvZiBmaWxlc1xuICAgIGFsbG93RGlyZWN0b3JpZXNPbmx5OiBbZmFsc2UsIFR5cGUuQk9PTEVBTl0sIC8vIEFsbG93IG9ubHkgc2VsZWN0aW5nIGRpcmVjdG9yaWVzIHdpdGggYnJvd3NlIChubyBzdXBwb3J0IGZvciBmaWx0ZXJpbmcgZG5kIGF0IHRoaXMgcG9pbnQpXG5cbiAgICAvLyBUcnkgc3RvcmUgZmlsZSBpZiBgc2VydmVyYCBub3Qgc2V0XG4gICAgc3RvcmVBc0ZpbGU6IFtmYWxzZSwgVHlwZS5CT09MRUFOXSxcblxuICAgIC8vIFJldmVydCBtb2RlXG4gICAgZm9yY2VSZXZlcnQ6IFtmYWxzZSwgVHlwZS5CT09MRUFOXSwgLy8gU2V0IHRvICdmb3JjZScgdG8gcmVxdWlyZSB0aGUgZmlsZSB0byBiZSByZXZlcnRlZCBiZWZvcmUgcmVtb3ZhbFxuXG4gICAgLy8gSW5wdXQgcmVxdWlyZW1lbnRzXG4gICAgbWF4RmlsZXM6IFtudWxsLCBUeXBlLklOVF0sIC8vIE1heCBudW1iZXIgb2YgZmlsZXNcbiAgICBjaGVja1ZhbGlkaXR5OiBbZmFsc2UsIFR5cGUuQk9PTEVBTl0sIC8vIEVuYWJsZXMgY3VzdG9tIHZhbGlkaXR5IG1lc3NhZ2VzXG5cbiAgICAvLyBXaGVyZSB0byBwdXQgZmlsZVxuICAgIGl0ZW1JbnNlcnRMb2NhdGlvbkZyZWVkb206IFt0cnVlLCBUeXBlLkJPT0xFQU5dLCAvLyBTZXQgdG8gZmFsc2UgdG8gYWx3YXlzIGFkZCBpdGVtcyB0byBiZWdpbiBvciBlbmQgb2YgbGlzdFxuICAgIGl0ZW1JbnNlcnRMb2NhdGlvbjogWydiZWZvcmUnLCBUeXBlLlNUUklOR10sIC8vIERlZmF1bHQgaW5kZXggaW4gbGlzdCB0byBhZGQgaXRlbXMgdGhhdCBoYXZlIGJlZW4gZHJvcHBlZCBhdCB0aGUgdG9wIG9mIHRoZSBsaXN0XG4gICAgaXRlbUluc2VydEludGVydmFsOiBbNzUsIFR5cGUuSU5UXSxcblxuICAgIC8vIERyYWcgJ24gRHJvcCByZWxhdGVkXG4gICAgZHJvcE9uUGFnZTogW2ZhbHNlLCBUeXBlLkJPT0xFQU5dLCAvLyBBbGxvdyBkcm9wcGluZyBvZiBmaWxlcyBhbnl3aGVyZSBvbiBwYWdlIChwcmV2ZW50cyBicm93c2VyIGZyb20gb3BlbmluZyBmaWxlIGlmIGRyb3BwZWQgb3V0c2lkZSBvZiBVcClcbiAgICBkcm9wT25FbGVtZW50OiBbdHJ1ZSwgVHlwZS5CT09MRUFOXSwgLy8gRHJvcCBuZWVkcyB0byBoYXBwZW4gb24gZWxlbWVudCAoc2V0IHRvIGZhbHNlIHRvIGFsc28gbG9hZCBkcm9wcyBvdXRzaWRlIG9mIFVwKVxuICAgIGRyb3BWYWxpZGF0aW9uOiBbZmFsc2UsIFR5cGUuQk9PTEVBTl0sIC8vIEVuYWJsZSBvciBkaXNhYmxlIHZhbGlkYXRpbmcgZmlsZXMgb24gZHJvcFxuICAgIGlnbm9yZWRGaWxlczogW1snLmRzX3N0b3JlJywgJ3RodW1icy5kYicsICdkZXNrdG9wLmluaSddLCBUeXBlLkFSUkFZXSxcblxuICAgIC8vIFVwbG9hZCByZWxhdGVkXG4gICAgaW5zdGFudFVwbG9hZDogW3RydWUsIFR5cGUuQk9PTEVBTl0sIC8vIFNob3VsZCB1cGxvYWQgZmlsZXMgaW1tZWRpYXRlbHkgb24gZHJvcFxuICAgIG1heFBhcmFsbGVsVXBsb2FkczogWzIsIFR5cGUuSU5UXSwgLy8gTWF4aW11bSBmaWxlcyB0byB1cGxvYWQgaW4gcGFyYWxsZWxcbiAgICBhbGxvd01pbmltdW1VcGxvYWREdXJhdGlvbjogW3RydWUsIFR5cGUuQk9PTEVBTl0sIC8vIGlmIHRydWUgdXBsb2FkcyB0YWtlIGF0IGxlYXN0IDc1MCBtcywgdGhpcyBlbnN1cmVzIHRoZSB1c2VyIHNlZXMgdGhlIHVwbG9hZCBwcm9ncmVzcyBnaXZpbmcgdHJ1c3QgdGhlIHVwbG9hZCBhY3R1YWxseSBoYXBwZW5lZFxuXG4gICAgLy8gQ2h1bmtzXG4gICAgY2h1bmtVcGxvYWRzOiBbZmFsc2UsIFR5cGUuQk9PTEVBTl0sIC8vIEVuYWJsZSBjaHVua2VkIHVwbG9hZHNcbiAgICBjaHVua0ZvcmNlOiBbZmFsc2UsIFR5cGUuQk9PTEVBTl0sIC8vIEZvcmNlIHVzZSBvZiBjaHVuayB1cGxvYWRzIGV2ZW4gZm9yIGZpbGVzIHNtYWxsZXIgdGhhbiBjaHVuayBzaXplXG4gICAgY2h1bmtTaXplOiBbNTAwMDAwMCwgVHlwZS5JTlRdLCAvLyBTaXplIG9mIGNodW5rcyAoNU1CIGRlZmF1bHQpXG4gICAgY2h1bmtSZXRyeURlbGF5czogW1s1MDAsIDEwMDAsIDMwMDBdLCBUeXBlLkFSUkFZXSwgLy8gQW1vdW50IG9mIHRpbWVzIHRvIHJldHJ5IHVwbG9hZCBvZiBhIGNodW5rIHdoZW4gaXQgZmFpbHNcblxuICAgIC8vIFRoZSBzZXJ2ZXIgYXBpIGVuZCBwb2ludHMgdG8gdXNlIGZvciB1cGxvYWRpbmcgKHNlZSBkb2NzKVxuICAgIHNlcnZlcjogW251bGwsIFR5cGUuU0VSVkVSX0FQSV0sXG5cbiAgICAvLyBGaWxlIHNpemUgY2FsY3VsYXRpb25zLCBjYW4gc2V0IHRvIDEwMjQsIHRoaXMgaXMgb25seSB1c2VkIGZvciBkaXNwbGF5LCBwcm9wZXJ0aWVzIHVzZSBmaWxlIHNpemUgYmFzZSAxMDAwXG4gICAgZmlsZVNpemVCYXNlOiBbMTAwMCwgVHlwZS5JTlRdLFxuXG4gICAgLy8gTGFiZWxzIGFuZCBzdGF0dXMgbWVzc2FnZXNcbiAgICBsYWJlbEZpbGVTaXplQnl0ZXM6IFsnYnl0ZXMnLCBUeXBlLlNUUklOR10sXG4gICAgbGFiZWxGaWxlU2l6ZUtpbG9ieXRlczogWydLQicsIFR5cGUuU1RSSU5HXSxcbiAgICBsYWJlbEZpbGVTaXplTWVnYWJ5dGVzOiBbJ01CJywgVHlwZS5TVFJJTkddLFxuICAgIGxhYmVsRmlsZVNpemVHaWdhYnl0ZXM6IFsnR0InLCBUeXBlLlNUUklOR10sXG5cbiAgICBsYWJlbERlY2ltYWxTZXBhcmF0b3I6IFtnZXREZWNpbWFsU2VwYXJhdG9yKCksIFR5cGUuU1RSSU5HXSwgLy8gRGVmYXVsdCBpcyBsb2NhbGUgc2VwYXJhdG9yXG4gICAgbGFiZWxUaG91c2FuZHNTZXBhcmF0b3I6IFtnZXRUaG91c2FuZHNTZXBhcmF0b3IoKSwgVHlwZS5TVFJJTkddLCAvLyBEZWZhdWx0IGlzIGxvY2FsZSBzZXBhcmF0b3JcblxuICAgIGxhYmVsSWRsZTogW1xuICAgICAgICAnRHJhZyAmIERyb3AgeW91ciBmaWxlcyBvciA8c3BhbiBjbGFzcz1cImZpbGVwb25kLS1sYWJlbC1hY3Rpb25cIj5Ccm93c2U8L3NwYW4+JyxcbiAgICAgICAgVHlwZS5TVFJJTkcsXG4gICAgXSxcbiAgICBsYWJlbEludmFsaWRGaWVsZDogWydGaWVsZCBjb250YWlucyBpbnZhbGlkIGZpbGVzJywgVHlwZS5TVFJJTkddLFxuICAgIGxhYmVsRmlsZVdhaXRpbmdGb3JTaXplOiBbJ1dhaXRpbmcgZm9yIHNpemUnLCBUeXBlLlNUUklOR10sXG4gICAgbGFiZWxGaWxlU2l6ZU5vdEF2YWlsYWJsZTogWydTaXplIG5vdCBhdmFpbGFibGUnLCBUeXBlLlNUUklOR10sXG4gICAgbGFiZWxGaWxlQ291bnRTaW5ndWxhcjogWydmaWxlIGluIGxpc3QnLCBUeXBlLlNUUklOR10sXG4gICAgbGFiZWxGaWxlQ291bnRQbHVyYWw6IFsnZmlsZXMgaW4gbGlzdCcsIFR5cGUuU1RSSU5HXSxcbiAgICBsYWJlbEZpbGVMb2FkaW5nOiBbJ0xvYWRpbmcnLCBUeXBlLlNUUklOR10sXG4gICAgbGFiZWxGaWxlQWRkZWQ6IFsnQWRkZWQnLCBUeXBlLlNUUklOR10sIC8vIGFzc2lzdGl2ZSBvbmx5XG4gICAgbGFiZWxGaWxlTG9hZEVycm9yOiBbJ0Vycm9yIGR1cmluZyBsb2FkJywgVHlwZS5TVFJJTkddLFxuICAgIGxhYmVsRmlsZVJlbW92ZWQ6IFsnUmVtb3ZlZCcsIFR5cGUuU1RSSU5HXSwgLy8gYXNzaXN0aXZlIG9ubHlcbiAgICBsYWJlbEZpbGVSZW1vdmVFcnJvcjogWydFcnJvciBkdXJpbmcgcmVtb3ZlJywgVHlwZS5TVFJJTkddLFxuICAgIGxhYmVsRmlsZVByb2Nlc3Npbmc6IFsnVXBsb2FkaW5nJywgVHlwZS5TVFJJTkddLFxuICAgIGxhYmVsRmlsZVByb2Nlc3NpbmdDb21wbGV0ZTogWydVcGxvYWQgY29tcGxldGUnLCBUeXBlLlNUUklOR10sXG4gICAgbGFiZWxGaWxlUHJvY2Vzc2luZ0Fib3J0ZWQ6IFsnVXBsb2FkIGNhbmNlbGxlZCcsIFR5cGUuU1RSSU5HXSxcbiAgICBsYWJlbEZpbGVQcm9jZXNzaW5nRXJyb3I6IFsnRXJyb3IgZHVyaW5nIHVwbG9hZCcsIFR5cGUuU1RSSU5HXSxcbiAgICBsYWJlbEZpbGVQcm9jZXNzaW5nUmV2ZXJ0RXJyb3I6IFsnRXJyb3IgZHVyaW5nIHJldmVydCcsIFR5cGUuU1RSSU5HXSxcblxuICAgIGxhYmVsVGFwVG9DYW5jZWw6IFsndGFwIHRvIGNhbmNlbCcsIFR5cGUuU1RSSU5HXSxcbiAgICBsYWJlbFRhcFRvUmV0cnk6IFsndGFwIHRvIHJldHJ5JywgVHlwZS5TVFJJTkddLFxuICAgIGxhYmVsVGFwVG9VbmRvOiBbJ3RhcCB0byB1bmRvJywgVHlwZS5TVFJJTkddLFxuXG4gICAgbGFiZWxCdXR0b25SZW1vdmVJdGVtOiBbJ1JlbW92ZScsIFR5cGUuU1RSSU5HXSxcbiAgICBsYWJlbEJ1dHRvbkFib3J0SXRlbUxvYWQ6IFsnQWJvcnQnLCBUeXBlLlNUUklOR10sXG4gICAgbGFiZWxCdXR0b25SZXRyeUl0ZW1Mb2FkOiBbJ1JldHJ5JywgVHlwZS5TVFJJTkddLFxuICAgIGxhYmVsQnV0dG9uQWJvcnRJdGVtUHJvY2Vzc2luZzogWydDYW5jZWwnLCBUeXBlLlNUUklOR10sXG4gICAgbGFiZWxCdXR0b25VbmRvSXRlbVByb2Nlc3Npbmc6IFsnVW5kbycsIFR5cGUuU1RSSU5HXSxcbiAgICBsYWJlbEJ1dHRvblJldHJ5SXRlbVByb2Nlc3Npbmc6IFsnUmV0cnknLCBUeXBlLlNUUklOR10sXG4gICAgbGFiZWxCdXR0b25Qcm9jZXNzSXRlbTogWydVcGxvYWQnLCBUeXBlLlNUUklOR10sXG5cbiAgICAvLyBtYWtlIHN1cmUgd2lkdGggYW5kIGhlaWdodCBwbHVzIHZpZXdwb3ggYXJlIGV2ZW4gbnVtYmVycyBzbyBpY29ucyBhcmUgbmljZWx5IGNlbnRlcmVkXG4gICAgaWNvblJlbW92ZTogW1xuICAgICAgICAnPHN2ZyB3aWR0aD1cIjI2XCIgaGVpZ2h0PVwiMjZcIiB2aWV3Qm94PVwiMCAwIDI2IDI2XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJNMTEuNTg2IDEzbC0yLjI5MyAyLjI5M2ExIDEgMCAwIDAgMS40MTQgMS40MTRMMTMgMTQuNDE0bDIuMjkzIDIuMjkzYTEgMSAwIDAgMCAxLjQxNC0xLjQxNEwxNC40MTQgMTNsMi4yOTMtMi4yOTNhMSAxIDAgMCAwLTEuNDE0LTEuNDE0TDEzIDExLjU4NmwtMi4yOTMtMi4yOTNhMSAxIDAgMCAwLTEuNDE0IDEuNDE0TDExLjU4NiAxM3pcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgZmlsbC1ydWxlPVwibm9uemVyb1wiLz48L3N2Zz4nLFxuICAgICAgICBUeXBlLlNUUklORyxcbiAgICBdLFxuICAgIGljb25Qcm9jZXNzOiBbXG4gICAgICAgICc8c3ZnIHdpZHRoPVwiMjZcIiBoZWlnaHQ9XCIyNlwiIHZpZXdCb3g9XCIwIDAgMjYgMjZcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIk0xNCAxMC40MTR2My41ODVhMSAxIDAgMCAxLTIgMHYtMy41ODVsLTEuMjkzIDEuMjkzYTEgMSAwIDAgMS0xLjQxNC0xLjQxNWwzLTNhMSAxIDAgMCAxIDEuNDE0IDBsMyAzYTEgMSAwIDAgMS0xLjQxNCAxLjQxNUwxNCAxMC40MTR6TTkgMThhMSAxIDAgMCAxIDAtMmg4YTEgMSAwIDAgMSAwIDJIOXpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiLz48L3N2Zz4nLFxuICAgICAgICBUeXBlLlNUUklORyxcbiAgICBdLFxuICAgIGljb25SZXRyeTogW1xuICAgICAgICAnPHN2ZyB3aWR0aD1cIjI2XCIgaGVpZ2h0PVwiMjZcIiB2aWV3Qm94PVwiMCAwIDI2IDI2XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJNMTAuODEgOS4xODVsLS4wMzguMDJBNC45OTcgNC45OTcgMCAwIDAgOCAxMy42ODNhNSA1IDAgMCAwIDUgNSA1IDUgMCAwIDAgNS01IDEgMSAwIDAgMSAyIDBBNyA3IDAgMSAxIDkuNzIyIDcuNDk2bC0uODQyLS4yMWEuOTk5Ljk5OSAwIDEgMSAuNDg0LTEuOTRsMy4yMy44MDZjLjUzNS4xMzMuODYuNjc1LjczIDEuMjFsLS44MDQgMy4yMzNhLjk5Ny45OTcgMCAwIDEtMS4yMS43My45OTcuOTk3IDAgMCAxLS43My0xLjIxbC4yMy0uOTI4di0uMDAyelwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBmaWxsLXJ1bGU9XCJub256ZXJvXCIvPjwvc3ZnPicsXG4gICAgICAgIFR5cGUuU1RSSU5HLFxuICAgIF0sXG4gICAgaWNvblVuZG86IFtcbiAgICAgICAgJzxzdmcgd2lkdGg9XCIyNlwiIGhlaWdodD1cIjI2XCIgdmlld0JveD1cIjAgMCAyNiAyNlwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwiTTkuMTg1IDEwLjgxbC4wMi0uMDM4QTQuOTk3IDQuOTk3IDAgMCAxIDEzLjY4MyA4YTUgNSAwIDAgMSA1IDUgNSA1IDAgMCAxLTUgNSAxIDEgMCAwIDAgMCAyQTcgNyAwIDEgMCA3LjQ5NiA5LjcyMmwtLjIxLS44NDJhLjk5OS45OTkgMCAxIDAtMS45NC40ODRsLjgwNiAzLjIzYy4xMzMuNTM1LjY3NS44NiAxLjIxLjczbDMuMjMzLS44MDNhLjk5Ny45OTcgMCAwIDAgLjczLTEuMjEuOTk3Ljk5NyAwIDAgMC0xLjIxLS43M2wtLjkyOC4yMy0uMDAyLS4wMDF6XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIGZpbGwtcnVsZT1cIm5vbnplcm9cIi8+PC9zdmc+JyxcbiAgICAgICAgVHlwZS5TVFJJTkcsXG4gICAgXSxcbiAgICBpY29uRG9uZTogW1xuICAgICAgICAnPHN2ZyB3aWR0aD1cIjI2XCIgaGVpZ2h0PVwiMjZcIiB2aWV3Qm94PVwiMCAwIDI2IDI2XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJNMTguMjkzIDkuMjkzYTEgMSAwIDAgMSAxLjQxNCAxLjQxNGwtNy4wMDIgN2ExIDEgMCAwIDEtMS40MTQgMGwtMy45OTgtNGExIDEgMCAxIDEgMS40MTQtMS40MTRMMTIgMTUuNTg2bDYuMjk0LTYuMjkzelwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBmaWxsLXJ1bGU9XCJub256ZXJvXCIvPjwvc3ZnPicsXG4gICAgICAgIFR5cGUuU1RSSU5HLFxuICAgIF0sXG5cbiAgICAvLyBldmVudCBoYW5kbGVyc1xuICAgIG9uaW5pdDogW251bGwsIFR5cGUuRlVOQ1RJT05dLFxuICAgIG9ud2FybmluZzogW251bGwsIFR5cGUuRlVOQ1RJT05dLFxuICAgIG9uZXJyb3I6IFtudWxsLCBUeXBlLkZVTkNUSU9OXSxcbiAgICBvbmFjdGl2YXRlZmlsZTogW251bGwsIFR5cGUuRlVOQ1RJT05dLFxuICAgIG9uaW5pdGZpbGU6IFtudWxsLCBUeXBlLkZVTkNUSU9OXSxcbiAgICBvbmFkZGZpbGVzdGFydDogW251bGwsIFR5cGUuRlVOQ1RJT05dLFxuICAgIG9uYWRkZmlsZXByb2dyZXNzOiBbbnVsbCwgVHlwZS5GVU5DVElPTl0sXG4gICAgb25hZGRmaWxlOiBbbnVsbCwgVHlwZS5GVU5DVElPTl0sXG4gICAgb25wcm9jZXNzZmlsZXN0YXJ0OiBbbnVsbCwgVHlwZS5GVU5DVElPTl0sXG4gICAgb25wcm9jZXNzZmlsZXByb2dyZXNzOiBbbnVsbCwgVHlwZS5GVU5DVElPTl0sXG4gICAgb25wcm9jZXNzZmlsZWFib3J0OiBbbnVsbCwgVHlwZS5GVU5DVElPTl0sXG4gICAgb25wcm9jZXNzZmlsZXJldmVydDogW251bGwsIFR5cGUuRlVOQ1RJT05dLFxuICAgIG9ucHJvY2Vzc2ZpbGU6IFtudWxsLCBUeXBlLkZVTkNUSU9OXSxcbiAgICBvbnByb2Nlc3NmaWxlczogW251bGwsIFR5cGUuRlVOQ1RJT05dLFxuICAgIG9ucmVtb3ZlZmlsZTogW251bGwsIFR5cGUuRlVOQ1RJT05dLFxuICAgIG9ucHJlcGFyZWZpbGU6IFtudWxsLCBUeXBlLkZVTkNUSU9OXSxcbiAgICBvbnVwZGF0ZWZpbGVzOiBbbnVsbCwgVHlwZS5GVU5DVElPTl0sXG4gICAgb25yZW9yZGVyZmlsZXM6IFtudWxsLCBUeXBlLkZVTkNUSU9OXSxcblxuICAgIC8vIGhvb2tzXG4gICAgYmVmb3JlRHJvcEZpbGU6IFtudWxsLCBUeXBlLkZVTkNUSU9OXSxcbiAgICBiZWZvcmVBZGRGaWxlOiBbbnVsbCwgVHlwZS5GVU5DVElPTl0sXG4gICAgYmVmb3JlUmVtb3ZlRmlsZTogW251bGwsIFR5cGUuRlVOQ1RJT05dLFxuICAgIGJlZm9yZVByZXBhcmVGaWxlOiBbbnVsbCwgVHlwZS5GVU5DVElPTl0sXG5cbiAgICAvLyBzdHlsZXNcbiAgICBzdHlsZVBhbmVsTGF5b3V0OiBbbnVsbCwgVHlwZS5TVFJJTkddLCAvLyBudWxsICdpbnRlZ3JhdGVkJywgJ2NvbXBhY3QnLCAnY2lyY2xlJ1xuICAgIHN0eWxlUGFuZWxBc3BlY3RSYXRpbzogW251bGwsIFR5cGUuU1RSSU5HXSwgLy8gbnVsbCBvciAnMzoyJyBvciAxXG4gICAgc3R5bGVJdGVtUGFuZWxBc3BlY3RSYXRpbzogW251bGwsIFR5cGUuU1RSSU5HXSxcbiAgICBzdHlsZUJ1dHRvblJlbW92ZUl0ZW1Qb3NpdGlvbjogWydsZWZ0JywgVHlwZS5TVFJJTkddLFxuICAgIHN0eWxlQnV0dG9uUHJvY2Vzc0l0ZW1Qb3NpdGlvbjogWydyaWdodCcsIFR5cGUuU1RSSU5HXSxcbiAgICBzdHlsZUxvYWRJbmRpY2F0b3JQb3NpdGlvbjogWydyaWdodCcsIFR5cGUuU1RSSU5HXSxcbiAgICBzdHlsZVByb2dyZXNzSW5kaWNhdG9yUG9zaXRpb246IFsncmlnaHQnLCBUeXBlLlNUUklOR10sXG4gICAgc3R5bGVCdXR0b25SZW1vdmVJdGVtQWxpZ246IFtmYWxzZSwgVHlwZS5CT09MRUFOXSxcblxuICAgIC8vIGN1c3RvbSBpbml0aWFsIGZpbGVzIGFycmF5XG4gICAgZmlsZXM6IFtbXSwgVHlwZS5BUlJBWV0sXG5cbiAgICAvLyBzaG93IHN1cHBvcnQgYnkgZGlzcGxheWluZyBjcmVkaXRzXG4gICAgY3JlZGl0czogW1snaHR0cHM6Ly9maWxlcG9uZC5jb20nLCAnUG93ZXJlZCBieSBGaWxlUG9uZCddLCBUeXBlLkFSUkFZXSxcbn07XG5cbmNvbnN0IGdldEl0ZW1CeVF1ZXJ5ID0gKGl0ZW1zLCBxdWVyeSkgPT4ge1xuICAgIC8vIGp1c3QgcmV0dXJuIGZpcnN0IGluZGV4XG4gICAgaWYgKGlzRW1wdHkocXVlcnkpKSB7XG4gICAgICAgIHJldHVybiBpdGVtc1swXSB8fCBudWxsO1xuICAgIH1cblxuICAgIC8vIHF1ZXJ5IGlzIGluZGV4XG4gICAgaWYgKGlzSW50KHF1ZXJ5KSkge1xuICAgICAgICByZXR1cm4gaXRlbXNbcXVlcnldIHx8IG51bGw7XG4gICAgfVxuXG4gICAgLy8gaWYgcXVlcnkgaXMgaXRlbSwgZ2V0IHRoZSBpZFxuICAgIGlmICh0eXBlb2YgcXVlcnkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHF1ZXJ5ID0gcXVlcnkuaWQ7XG4gICAgfVxuXG4gICAgLy8gYXNzdW1lIHF1ZXJ5IGlzIGEgc3RyaW5nIGFuZCByZXR1cm4gaXRlbSBieSBpZFxuICAgIHJldHVybiBpdGVtcy5maW5kKGl0ZW0gPT4gaXRlbS5pZCA9PT0gcXVlcnkpIHx8IG51bGw7XG59O1xuXG5jb25zdCBnZXROdW1lcmljQXNwZWN0UmF0aW9Gcm9tU3RyaW5nID0gYXNwZWN0UmF0aW8gPT4ge1xuICAgIGlmIChpc0VtcHR5KGFzcGVjdFJhdGlvKSkge1xuICAgICAgICByZXR1cm4gYXNwZWN0UmF0aW87XG4gICAgfVxuICAgIGlmICgvOi8udGVzdChhc3BlY3RSYXRpbykpIHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBhc3BlY3RSYXRpby5zcGxpdCgnOicpO1xuICAgICAgICByZXR1cm4gcGFydHNbMV0gLyBwYXJ0c1swXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoYXNwZWN0UmF0aW8pO1xufTtcblxuY29uc3QgZ2V0QWN0aXZlSXRlbXMgPSBpdGVtcyA9PiBpdGVtcy5maWx0ZXIoaXRlbSA9PiAhaXRlbS5hcmNoaXZlZCk7XG5cbmNvbnN0IFN0YXR1cyA9IHtcbiAgICBFTVBUWTogMCxcbiAgICBJRExFOiAxLCAvLyB3YWl0aW5nXG4gICAgRVJST1I6IDIsIC8vIGEgZmlsZSBpcyBpbiBlcnJvciBzdGF0ZVxuICAgIEJVU1k6IDMsIC8vIGJ1c3kgcHJvY2Vzc2luZyBvciBsb2FkaW5nXG4gICAgUkVBRFk6IDQsIC8vIGFsbCBmaWxlcyB1cGxvYWRlZFxufTtcblxubGV0IHJlcyA9IG51bGw7XG5jb25zdCBjYW5VcGRhdGVGaWxlSW5wdXQgPSAoKSA9PiB7XG4gICAgaWYgKHJlcyA9PT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZGF0YVRyYW5zZmVyID0gbmV3IERhdGFUcmFuc2ZlcigpO1xuICAgICAgICAgICAgZGF0YVRyYW5zZmVyLml0ZW1zLmFkZChuZXcgRmlsZShbJ2hlbGxvIHdvcmxkJ10sICdUaGlzX1dvcmtzLnR4dCcpKTtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgndHlwZScsICdmaWxlJyk7XG4gICAgICAgICAgICBlbC5maWxlcyA9IGRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgICAgICAgIHJlcyA9IGVsLmZpbGVzLmxlbmd0aCA9PT0gMTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufTtcblxuY29uc3QgSVRFTV9FUlJPUiA9IFtcbiAgICBJdGVtU3RhdHVzLkxPQURfRVJST1IsXG4gICAgSXRlbVN0YXR1cy5QUk9DRVNTSU5HX0VSUk9SLFxuICAgIEl0ZW1TdGF0dXMuUFJPQ0VTU0lOR19SRVZFUlRfRVJST1IsXG5dO1xuY29uc3QgSVRFTV9CVVNZID0gW1xuICAgIEl0ZW1TdGF0dXMuTE9BRElORyxcbiAgICBJdGVtU3RhdHVzLlBST0NFU1NJTkcsXG4gICAgSXRlbVN0YXR1cy5QUk9DRVNTSU5HX1FVRVVFRCxcbiAgICBJdGVtU3RhdHVzLklOSVQsXG5dO1xuY29uc3QgSVRFTV9SRUFEWSA9IFtJdGVtU3RhdHVzLlBST0NFU1NJTkdfQ09NUExFVEVdO1xuXG5jb25zdCBpc0l0ZW1JbkVycm9yU3RhdGUgPSBpdGVtID0+IElURU1fRVJST1IuaW5jbHVkZXMoaXRlbS5zdGF0dXMpO1xuY29uc3QgaXNJdGVtSW5CdXN5U3RhdGUgPSBpdGVtID0+IElURU1fQlVTWS5pbmNsdWRlcyhpdGVtLnN0YXR1cyk7XG5jb25zdCBpc0l0ZW1JblJlYWR5U3RhdGUgPSBpdGVtID0+IElURU1fUkVBRFkuaW5jbHVkZXMoaXRlbS5zdGF0dXMpO1xuXG5jb25zdCBpc0FzeW5jID0gc3RhdGUgPT5cbiAgICBpc09iamVjdChzdGF0ZS5vcHRpb25zLnNlcnZlcikgJiZcbiAgICAoaXNPYmplY3Qoc3RhdGUub3B0aW9ucy5zZXJ2ZXIucHJvY2VzcykgfHwgaXNGdW5jdGlvbihzdGF0ZS5vcHRpb25zLnNlcnZlci5wcm9jZXNzKSk7XG5cbmNvbnN0IHF1ZXJpZXMgPSBzdGF0ZSA9PiAoe1xuICAgIEdFVF9TVEFUVVM6ICgpID0+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBnZXRBY3RpdmVJdGVtcyhzdGF0ZS5pdGVtcyk7XG5cbiAgICAgICAgY29uc3QgeyBFTVBUWSwgRVJST1IsIEJVU1ksIElETEUsIFJFQURZIH0gPSBTdGF0dXM7XG5cbiAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMCkgcmV0dXJuIEVNUFRZO1xuXG4gICAgICAgIGlmIChpdGVtcy5zb21lKGlzSXRlbUluRXJyb3JTdGF0ZSkpIHJldHVybiBFUlJPUjtcblxuICAgICAgICBpZiAoaXRlbXMuc29tZShpc0l0ZW1JbkJ1c3lTdGF0ZSkpIHJldHVybiBCVVNZO1xuXG4gICAgICAgIGlmIChpdGVtcy5zb21lKGlzSXRlbUluUmVhZHlTdGF0ZSkpIHJldHVybiBSRUFEWTtcblxuICAgICAgICByZXR1cm4gSURMRTtcbiAgICB9LFxuXG4gICAgR0VUX0lURU06IHF1ZXJ5ID0+IGdldEl0ZW1CeVF1ZXJ5KHN0YXRlLml0ZW1zLCBxdWVyeSksXG5cbiAgICBHRVRfQUNUSVZFX0lURU06IHF1ZXJ5ID0+IGdldEl0ZW1CeVF1ZXJ5KGdldEFjdGl2ZUl0ZW1zKHN0YXRlLml0ZW1zKSwgcXVlcnkpLFxuXG4gICAgR0VUX0FDVElWRV9JVEVNUzogKCkgPT4gZ2V0QWN0aXZlSXRlbXMoc3RhdGUuaXRlbXMpLFxuXG4gICAgR0VUX0lURU1TOiAoKSA9PiBzdGF0ZS5pdGVtcyxcblxuICAgIEdFVF9JVEVNX05BTUU6IHF1ZXJ5ID0+IHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGdldEl0ZW1CeVF1ZXJ5KHN0YXRlLml0ZW1zLCBxdWVyeSk7XG4gICAgICAgIHJldHVybiBpdGVtID8gaXRlbS5maWxlbmFtZSA6IG51bGw7XG4gICAgfSxcblxuICAgIEdFVF9JVEVNX1NJWkU6IHF1ZXJ5ID0+IHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGdldEl0ZW1CeVF1ZXJ5KHN0YXRlLml0ZW1zLCBxdWVyeSk7XG4gICAgICAgIHJldHVybiBpdGVtID8gaXRlbS5maWxlU2l6ZSA6IG51bGw7XG4gICAgfSxcblxuICAgIEdFVF9TVFlMRVM6ICgpID0+XG4gICAgICAgIE9iamVjdC5rZXlzKHN0YXRlLm9wdGlvbnMpXG4gICAgICAgICAgICAuZmlsdGVyKGtleSA9PiAvXnN0eWxlLy50ZXN0KGtleSkpXG4gICAgICAgICAgICAubWFwKG9wdGlvbiA9PiAoe1xuICAgICAgICAgICAgICAgIG5hbWU6IG9wdGlvbixcbiAgICAgICAgICAgICAgICB2YWx1ZTogc3RhdGUub3B0aW9uc1tvcHRpb25dLFxuICAgICAgICAgICAgfSkpLFxuXG4gICAgR0VUX1BBTkVMX0FTUEVDVF9SQVRJTzogKCkgPT4ge1xuICAgICAgICBjb25zdCBpc1NoYXBlQ2lyY2xlID0gL2NpcmNsZS8udGVzdChzdGF0ZS5vcHRpb25zLnN0eWxlUGFuZWxMYXlvdXQpO1xuICAgICAgICBjb25zdCBhc3BlY3RSYXRpbyA9IGlzU2hhcGVDaXJjbGVcbiAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgOiBnZXROdW1lcmljQXNwZWN0UmF0aW9Gcm9tU3RyaW5nKHN0YXRlLm9wdGlvbnMuc3R5bGVQYW5lbEFzcGVjdFJhdGlvKTtcbiAgICAgICAgcmV0dXJuIGFzcGVjdFJhdGlvO1xuICAgIH0sXG5cbiAgICBHRVRfSVRFTV9QQU5FTF9BU1BFQ1RfUkFUSU86ICgpID0+IHN0YXRlLm9wdGlvbnMuc3R5bGVJdGVtUGFuZWxBc3BlY3RSYXRpbyxcblxuICAgIEdFVF9JVEVNU19CWV9TVEFUVVM6IHN0YXR1cyA9PlxuICAgICAgICBnZXRBY3RpdmVJdGVtcyhzdGF0ZS5pdGVtcykuZmlsdGVyKGl0ZW0gPT4gaXRlbS5zdGF0dXMgPT09IHN0YXR1cyksXG5cbiAgICBHRVRfVE9UQUxfSVRFTVM6ICgpID0+IGdldEFjdGl2ZUl0ZW1zKHN0YXRlLml0ZW1zKS5sZW5ndGgsXG5cbiAgICBTSE9VTERfVVBEQVRFX0ZJTEVfSU5QVVQ6ICgpID0+XG4gICAgICAgIHN0YXRlLm9wdGlvbnMuc3RvcmVBc0ZpbGUgJiYgY2FuVXBkYXRlRmlsZUlucHV0KCkgJiYgIWlzQXN5bmMoc3RhdGUpLFxuXG4gICAgSVNfQVNZTkM6ICgpID0+IGlzQXN5bmMoc3RhdGUpLFxuXG4gICAgR0VUX0ZJTEVfU0laRV9MQUJFTFM6IHF1ZXJ5ID0+ICh7XG4gICAgICAgIGxhYmVsQnl0ZXM6IHF1ZXJ5KCdHRVRfTEFCRUxfRklMRV9TSVpFX0JZVEVTJykgfHwgdW5kZWZpbmVkLFxuICAgICAgICBsYWJlbEtpbG9ieXRlczogcXVlcnkoJ0dFVF9MQUJFTF9GSUxFX1NJWkVfS0lMT0JZVEVTJykgfHwgdW5kZWZpbmVkLFxuICAgICAgICBsYWJlbE1lZ2FieXRlczogcXVlcnkoJ0dFVF9MQUJFTF9GSUxFX1NJWkVfTUVHQUJZVEVTJykgfHwgdW5kZWZpbmVkLFxuICAgICAgICBsYWJlbEdpZ2FieXRlczogcXVlcnkoJ0dFVF9MQUJFTF9GSUxFX1NJWkVfR0lHQUJZVEVTJykgfHwgdW5kZWZpbmVkLFxuICAgIH0pLFxufSk7XG5cbmNvbnN0IGhhc1Jvb21Gb3JJdGVtID0gc3RhdGUgPT4ge1xuICAgIGNvbnN0IGNvdW50ID0gZ2V0QWN0aXZlSXRlbXMoc3RhdGUuaXRlbXMpLmxlbmd0aDtcblxuICAgIC8vIGlmIGNhbm5vdCBoYXZlIG11bHRpcGxlIGl0ZW1zLCB0byBhZGQgb25lIGl0ZW0gaXQgc2hvdWxkIGN1cnJlbnRseSBub3QgY29udGFpbiBpdGVtc1xuICAgIGlmICghc3RhdGUub3B0aW9ucy5hbGxvd011bHRpcGxlKSB7XG4gICAgICAgIHJldHVybiBjb3VudCA9PT0gMDtcbiAgICB9XG5cbiAgICAvLyBpZiBhbGxvd3MgbXVsdGlwbGUgaXRlbXMsIHdlIGNoZWNrIGlmIGEgbWF4IGl0ZW0gY291bnQgaGFzIGJlZW4gc2V0LCBpZiBub3QsIHRoZXJlJ3Mgbm8gbGltaXRcbiAgICBjb25zdCBtYXhGaWxlQ291bnQgPSBzdGF0ZS5vcHRpb25zLm1heEZpbGVzO1xuICAgIGlmIChtYXhGaWxlQ291bnQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gd2UgY2hlY2sgaWYgdGhlIGN1cnJlbnQgY291bnQgaXMgc21hbGxlciB0aGFuIHRoZSBtYXggY291bnQsIGlmIHNvLCBhbm90aGVyIGZpbGUgY2FuIHN0aWxsIGJlIGFkZGVkXG4gICAgaWYgKGNvdW50IDwgbWF4RmlsZUNvdW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIG5vIG1vcmUgcm9vbSBmb3IgYW5vdGhlciBmaWxlXG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgbGltaXQgPSAodmFsdWUsIG1pbiwgbWF4KSA9PiBNYXRoLm1heChNYXRoLm1pbihtYXgsIHZhbHVlKSwgbWluKTtcblxuY29uc3QgYXJyYXlJbnNlcnQgPSAoYXJyLCBpbmRleCwgaXRlbSkgPT4gYXJyLnNwbGljZShpbmRleCwgMCwgaXRlbSk7XG5cbmNvbnN0IGluc2VydEl0ZW0gPSAoaXRlbXMsIGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgaWYgKGlzRW1wdHkoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gaWYgaW5kZXggaXMgdW5kZWZpbmVkLCBhcHBlbmRcbiAgICBpZiAodHlwZW9mIGluZGV4ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG5cbiAgICAvLyBsaW1pdCB0aGUgaW5kZXggdG8gdGhlIHNpemUgb2YgdGhlIGl0ZW1zIGFycmF5XG4gICAgaW5kZXggPSBsaW1pdChpbmRleCwgMCwgaXRlbXMubGVuZ3RoKTtcblxuICAgIC8vIGFkZCBpdGVtIHRvIGFycmF5XG4gICAgYXJyYXlJbnNlcnQoaXRlbXMsIGluZGV4LCBpdGVtKTtcblxuICAgIC8vIGV4cG9zZVxuICAgIHJldHVybiBpdGVtO1xufTtcblxuY29uc3QgaXNCYXNlNjREYXRhVVJJID0gc3RyID0+XG4gICAgL15cXHMqZGF0YTooW2Etel0rXFwvW2EtejAtOS0rLl0rKDtbYS16LV0rPVthLXowLTktXSspPyk/KDtiYXNlNjQpPywoW2EtejAtOSEkJicsKCkqKzs9XFwtLl9+OkBcXC8/JVxcc10qKVxccyokL2kudGVzdChcbiAgICAgICAgc3RyXG4gICAgKTtcblxuY29uc3QgZ2V0RmlsZW5hbWVGcm9tVVJMID0gdXJsID0+XG4gICAgYCR7dXJsfWBcbiAgICAgICAgLnNwbGl0KCcvJylcbiAgICAgICAgLnBvcCgpXG4gICAgICAgIC5zcGxpdCgnPycpXG4gICAgICAgIC5zaGlmdCgpO1xuXG5jb25zdCBnZXRFeHRlbnNpb25Gcm9tRmlsZW5hbWUgPSBuYW1lID0+IG5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcblxuY29uc3QgZ3Vlc3N0aW1hdGVFeHRlbnNpb24gPSB0eXBlID0+IHtcbiAgICAvLyBpZiBubyBleHRlbnNpb24gc3VwcGxpZWQsIGV4aXQgaGVyZVxuICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIC8vIGdldCBzdWJ0eXBlXG4gICAgY29uc3Qgc3VidHlwZSA9IHR5cGUuc3BsaXQoJy8nKS5wb3AoKTtcblxuICAgIC8vIGlzIHN2ZyBzdWJ0eXBlXG4gICAgaWYgKC9zdmcvLnRlc3Qoc3VidHlwZSkpIHtcbiAgICAgICAgcmV0dXJuICdzdmcnO1xuICAgIH1cblxuICAgIGlmICgvemlwfGNvbXByZXNzZWQvLnRlc3Qoc3VidHlwZSkpIHtcbiAgICAgICAgcmV0dXJuICd6aXAnO1xuICAgIH1cblxuICAgIGlmICgvcGxhaW4vLnRlc3Qoc3VidHlwZSkpIHtcbiAgICAgICAgcmV0dXJuICd0eHQnO1xuICAgIH1cblxuICAgIGlmICgvbXN3b3JkLy50ZXN0KHN1YnR5cGUpKSB7XG4gICAgICAgIHJldHVybiAnZG9jJztcbiAgICB9XG5cbiAgICAvLyBpZiBpcyB2YWxpZCBzdWJ0eXBlXG4gICAgaWYgKC9bYS16XSsvLnRlc3Qoc3VidHlwZSkpIHtcbiAgICAgICAgLy8gYWx3YXlzIHVzZSBqcGcgZXh0ZW5zaW9uXG4gICAgICAgIGlmIChzdWJ0eXBlID09PSAnanBlZycpIHtcbiAgICAgICAgICAgIHJldHVybiAnanBnJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJldHVybiBzdWJ0eXBlXG4gICAgICAgIHJldHVybiBzdWJ0eXBlO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbn07XG5cbmNvbnN0IGxlZnRQYWQgPSAodmFsdWUsIHBhZGRpbmcgPSAnJykgPT4gKHBhZGRpbmcgKyB2YWx1ZSkuc2xpY2UoLXBhZGRpbmcubGVuZ3RoKTtcblxuY29uc3QgZ2V0RGF0ZVN0cmluZyA9IChkYXRlID0gbmV3IERhdGUoKSkgPT5cbiAgICBgJHtkYXRlLmdldEZ1bGxZZWFyKCl9LSR7bGVmdFBhZChkYXRlLmdldE1vbnRoKCkgKyAxLCAnMDAnKX0tJHtsZWZ0UGFkKFxuICAgICAgICBkYXRlLmdldERhdGUoKSxcbiAgICAgICAgJzAwJ1xuICAgICl9XyR7bGVmdFBhZChkYXRlLmdldEhvdXJzKCksICcwMCcpfS0ke2xlZnRQYWQoZGF0ZS5nZXRNaW51dGVzKCksICcwMCcpfS0ke2xlZnRQYWQoXG4gICAgICAgIGRhdGUuZ2V0U2Vjb25kcygpLFxuICAgICAgICAnMDAnXG4gICAgKX1gO1xuXG5jb25zdCBnZXRGaWxlRnJvbUJsb2IgPSAoYmxvYiwgZmlsZW5hbWUsIHR5cGUgPSBudWxsLCBleHRlbnNpb24gPSBudWxsKSA9PiB7XG4gICAgY29uc3QgZmlsZSA9XG4gICAgICAgIHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgPyBibG9iLnNsaWNlKDAsIGJsb2Iuc2l6ZSwgdHlwZSlcbiAgICAgICAgICAgIDogYmxvYi5zbGljZSgwLCBibG9iLnNpemUsIGJsb2IudHlwZSk7XG4gICAgZmlsZS5sYXN0TW9kaWZpZWREYXRlID0gbmV3IERhdGUoKTtcblxuICAgIC8vIGNvcHkgcmVsYXRpdmUgcGF0aFxuICAgIGlmIChibG9iLl9yZWxhdGl2ZVBhdGgpIGZpbGUuX3JlbGF0aXZlUGF0aCA9IGJsb2IuX3JlbGF0aXZlUGF0aDtcblxuICAgIC8vIGlmIGJsb2IgaGFzIG5hbWUgcHJvcGVydHksIHVzZSBhcyBmaWxlbmFtZSBpZiBubyBmaWxlbmFtZSBzdXBwbGllZFxuICAgIGlmICghaXNTdHJpbmcoZmlsZW5hbWUpKSB7XG4gICAgICAgIGZpbGVuYW1lID0gZ2V0RGF0ZVN0cmluZygpO1xuICAgIH1cblxuICAgIC8vIGlmIGZpbGVuYW1lIHN1cHBsaWVkIGJ1dCBubyBleHRlbnNpb24gYW5kIGZpbGVuYW1lIGhhcyBleHRlbnNpb25cbiAgICBpZiAoZmlsZW5hbWUgJiYgZXh0ZW5zaW9uID09PSBudWxsICYmIGdldEV4dGVuc2lvbkZyb21GaWxlbmFtZShmaWxlbmFtZSkpIHtcbiAgICAgICAgZmlsZS5uYW1lID0gZmlsZW5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZXh0ZW5zaW9uID0gZXh0ZW5zaW9uIHx8IGd1ZXNzdGltYXRlRXh0ZW5zaW9uKGZpbGUudHlwZSk7XG4gICAgICAgIGZpbGUubmFtZSA9IGZpbGVuYW1lICsgKGV4dGVuc2lvbiA/ICcuJyArIGV4dGVuc2lvbiA6ICcnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsZTtcbn07XG5cbmNvbnN0IGdldEJsb2JCdWlsZGVyID0gKCkgPT4ge1xuICAgIHJldHVybiAod2luZG93LkJsb2JCdWlsZGVyID1cbiAgICAgICAgd2luZG93LkJsb2JCdWlsZGVyIHx8XG4gICAgICAgIHdpbmRvdy5XZWJLaXRCbG9iQnVpbGRlciB8fFxuICAgICAgICB3aW5kb3cuTW96QmxvYkJ1aWxkZXIgfHxcbiAgICAgICAgd2luZG93Lk1TQmxvYkJ1aWxkZXIpO1xufTtcblxuY29uc3QgY3JlYXRlQmxvYiA9IChhcnJheUJ1ZmZlciwgbWltZVR5cGUpID0+IHtcbiAgICBjb25zdCBCQiA9IGdldEJsb2JCdWlsZGVyKCk7XG5cbiAgICBpZiAoQkIpIHtcbiAgICAgICAgY29uc3QgYmIgPSBuZXcgQkIoKTtcbiAgICAgICAgYmIuYXBwZW5kKGFycmF5QnVmZmVyKTtcbiAgICAgICAgcmV0dXJuIGJiLmdldEJsb2IobWltZVR5cGUpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQmxvYihbYXJyYXlCdWZmZXJdLCB7XG4gICAgICAgIHR5cGU6IG1pbWVUeXBlLFxuICAgIH0pO1xufTtcblxuY29uc3QgZ2V0QmxvYkZyb21CeXRlU3RyaW5nV2l0aE1pbWVUeXBlID0gKGJ5dGVTdHJpbmcsIG1pbWVUeXBlKSA9PiB7XG4gICAgY29uc3QgYWIgPSBuZXcgQXJyYXlCdWZmZXIoYnl0ZVN0cmluZy5sZW5ndGgpO1xuICAgIGNvbnN0IGlhID0gbmV3IFVpbnQ4QXJyYXkoYWIpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlU3RyaW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlhW2ldID0gYnl0ZVN0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVCbG9iKGFiLCBtaW1lVHlwZSk7XG59O1xuXG5jb25zdCBnZXRNaW1lVHlwZUZyb21CYXNlNjREYXRhVVJJID0gZGF0YVVSSSA9PiB7XG4gICAgcmV0dXJuICgvXmRhdGE6KC4rKTsvLmV4ZWMoZGF0YVVSSSkgfHwgW10pWzFdIHx8IG51bGw7XG59O1xuXG5jb25zdCBnZXRCYXNlNjREYXRhRnJvbUJhc2U2NERhdGFVUkkgPSBkYXRhVVJJID0+IHtcbiAgICAvLyBnZXQgZGF0YSBwYXJ0IG9mIHN0cmluZyAocmVtb3ZlIGRhdGE6aW1hZ2UvanBlZy4uLiwpXG4gICAgY29uc3QgZGF0YSA9IGRhdGFVUkkuc3BsaXQoJywnKVsxXTtcblxuICAgIC8vIHJlbW92ZSBhbnkgd2hpdGVzcGFjZSBhcyB0aGF0IGNhdXNlcyBJbnZhbGlkQ2hhcmFjdGVyRXJyb3IgaW4gSUVcbiAgICByZXR1cm4gZGF0YS5yZXBsYWNlKC9cXHMvZywgJycpO1xufTtcblxuY29uc3QgZ2V0Qnl0ZVN0cmluZ0Zyb21CYXNlNjREYXRhVVJJID0gZGF0YVVSSSA9PiB7XG4gICAgcmV0dXJuIGF0b2IoZ2V0QmFzZTY0RGF0YUZyb21CYXNlNjREYXRhVVJJKGRhdGFVUkkpKTtcbn07XG5cbmNvbnN0IGdldEJsb2JGcm9tQmFzZTY0RGF0YVVSSSA9IGRhdGFVUkkgPT4ge1xuICAgIGNvbnN0IG1pbWVUeXBlID0gZ2V0TWltZVR5cGVGcm9tQmFzZTY0RGF0YVVSSShkYXRhVVJJKTtcbiAgICBjb25zdCBieXRlU3RyaW5nID0gZ2V0Qnl0ZVN0cmluZ0Zyb21CYXNlNjREYXRhVVJJKGRhdGFVUkkpO1xuXG4gICAgcmV0dXJuIGdldEJsb2JGcm9tQnl0ZVN0cmluZ1dpdGhNaW1lVHlwZShieXRlU3RyaW5nLCBtaW1lVHlwZSk7XG59O1xuXG5jb25zdCBnZXRGaWxlRnJvbUJhc2U2NERhdGFVUkkgPSAoZGF0YVVSSSwgZmlsZW5hbWUsIGV4dGVuc2lvbikgPT4ge1xuICAgIHJldHVybiBnZXRGaWxlRnJvbUJsb2IoZ2V0QmxvYkZyb21CYXNlNjREYXRhVVJJKGRhdGFVUkkpLCBmaWxlbmFtZSwgbnVsbCwgZXh0ZW5zaW9uKTtcbn07XG5cbmNvbnN0IGdldEZpbGVOYW1lRnJvbUhlYWRlciA9IGhlYWRlciA9PiB7XG4gICAgLy8gdGVzdCBpZiBpcyBjb250ZW50IGRpc3Bvc2l0aW9uIGhlYWRlciwgaWYgbm90IGV4aXRcbiAgICBpZiAoIS9eY29udGVudC1kaXNwb3NpdGlvbjovaS50ZXN0KGhlYWRlcikpIHJldHVybiBudWxsO1xuXG4gICAgLy8gZ2V0IGZpbGVuYW1lIHBhcnRzXG4gICAgY29uc3QgbWF0Y2hlcyA9IGhlYWRlclxuICAgICAgICAuc3BsaXQoL2ZpbGVuYW1lPXxmaWxlbmFtZVxcKj0uKycnLylcbiAgICAgICAgLnNwbGljZSgxKVxuICAgICAgICAubWFwKG5hbWUgPT4gbmFtZS50cmltKCkucmVwbGFjZSgvXltcIiddfFs7XCInXXswLDJ9JC9nLCAnJykpXG4gICAgICAgIC5maWx0ZXIobmFtZSA9PiBuYW1lLmxlbmd0aCk7XG5cbiAgICByZXR1cm4gbWF0Y2hlcy5sZW5ndGggPyBkZWNvZGVVUkkobWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdKSA6IG51bGw7XG59O1xuXG5jb25zdCBnZXRGaWxlU2l6ZUZyb21IZWFkZXIgPSBoZWFkZXIgPT4ge1xuICAgIGlmICgvY29udGVudC1sZW5ndGg6L2kudGVzdChoZWFkZXIpKSB7XG4gICAgICAgIGNvbnN0IHNpemUgPSBoZWFkZXIubWF0Y2goL1swLTldKy8pWzBdO1xuICAgICAgICByZXR1cm4gc2l6ZSA/IHBhcnNlSW50KHNpemUsIDEwKSA6IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufTtcblxuY29uc3QgZ2V0VHJhbmZzZXJJZEZyb21IZWFkZXIgPSBoZWFkZXIgPT4ge1xuICAgIGlmICgveC1jb250ZW50LXRyYW5zZmVyLWlkOi9pLnRlc3QoaGVhZGVyKSkge1xuICAgICAgICBjb25zdCBpZCA9IChoZWFkZXIuc3BsaXQoJzonKVsxXSB8fCAnJykudHJpbSgpO1xuICAgICAgICByZXR1cm4gaWQgfHwgbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG5jb25zdCBnZXRGaWxlSW5mb0Zyb21IZWFkZXJzID0gaGVhZGVycyA9PiB7XG4gICAgY29uc3QgaW5mbyA9IHtcbiAgICAgICAgc291cmNlOiBudWxsLFxuICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICBzaXplOiBudWxsLFxuICAgIH07XG5cbiAgICBjb25zdCByb3dzID0gaGVhZGVycy5zcGxpdCgnXFxuJyk7XG4gICAgZm9yIChsZXQgaGVhZGVyIG9mIHJvd3MpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGdldEZpbGVOYW1lRnJvbUhlYWRlcihoZWFkZXIpO1xuICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgaW5mby5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2l6ZSA9IGdldEZpbGVTaXplRnJvbUhlYWRlcihoZWFkZXIpO1xuICAgICAgICBpZiAoc2l6ZSkge1xuICAgICAgICAgICAgaW5mby5zaXplID0gc2l6ZTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc291cmNlID0gZ2V0VHJhbmZzZXJJZEZyb21IZWFkZXIoaGVhZGVyKTtcbiAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgICAgaW5mby5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpbmZvO1xufTtcblxuY29uc3QgY3JlYXRlRmlsZUxvYWRlciA9IGZldGNoRm4gPT4ge1xuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBzb3VyY2U6IG51bGwsXG4gICAgICAgIGNvbXBsZXRlOiBmYWxzZSxcbiAgICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICAgIHNpemU6IG51bGwsXG4gICAgICAgIHRpbWVzdGFtcDogbnVsbCxcbiAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgIHJlcXVlc3Q6IG51bGwsXG4gICAgfTtcblxuICAgIGNvbnN0IGdldFByb2dyZXNzID0gKCkgPT4gc3RhdGUucHJvZ3Jlc3M7XG4gICAgY29uc3QgYWJvcnQgPSAoKSA9PiB7XG4gICAgICAgIGlmIChzdGF0ZS5yZXF1ZXN0ICYmIHN0YXRlLnJlcXVlc3QuYWJvcnQpIHtcbiAgICAgICAgICAgIHN0YXRlLnJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBsb2FkIHNvdXJjZVxuICAgIGNvbnN0IGxvYWQgPSAoKSA9PiB7XG4gICAgICAgIC8vIGdldCBxdWljayByZWZlcmVuY2VcbiAgICAgICAgY29uc3Qgc291cmNlID0gc3RhdGUuc291cmNlO1xuXG4gICAgICAgIGFwaS5maXJlKCdpbml0Jywgc291cmNlKTtcblxuICAgICAgICAvLyBMb2FkIEZpbGVzXG4gICAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBGaWxlKSB7XG4gICAgICAgICAgICBhcGkuZmlyZSgnbG9hZCcsIHNvdXJjZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc291cmNlIGluc3RhbmNlb2YgQmxvYikge1xuICAgICAgICAgICAgLy8gTG9hZCBibG9icywgc2V0IGRlZmF1bHQgbmFtZSB0byBjdXJyZW50IGRhdGVcbiAgICAgICAgICAgIGFwaS5maXJlKCdsb2FkJywgZ2V0RmlsZUZyb21CbG9iKHNvdXJjZSwgc291cmNlLm5hbWUpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0Jhc2U2NERhdGFVUkkoc291cmNlKSkge1xuICAgICAgICAgICAgLy8gTG9hZCBiYXNlIDY0LCBzZXQgZGVmYXVsdCBuYW1lIHRvIGN1cnJlbnQgZGF0ZVxuICAgICAgICAgICAgYXBpLmZpcmUoJ2xvYWQnLCBnZXRGaWxlRnJvbUJhc2U2NERhdGFVUkkoc291cmNlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBEZWFsIGFzIGlmIGlzIGV4dGVybmFsIFVSTCwgbGV0J3MgbG9hZCBpdCFcbiAgICAgICAgICAgIGxvYWRVUkwoc291cmNlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBsb2FkcyBhIHVybFxuICAgIGNvbnN0IGxvYWRVUkwgPSB1cmwgPT4ge1xuICAgICAgICAvLyBpcyByZW1vdGUgdXJsIGFuZCBubyBmZXRjaCBtZXRob2Qgc3VwcGxpZWRcbiAgICAgICAgaWYgKCFmZXRjaEZuKSB7XG4gICAgICAgICAgICBhcGkuZmlyZSgnZXJyb3InLCB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICBib2R5OiBcIkNhbid0IGxvYWQgVVJMXCIsXG4gICAgICAgICAgICAgICAgY29kZTogNDAwLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZXQgcmVxdWVzdCBzdGFydFxuICAgICAgICBzdGF0ZS50aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgIC8vIGxvYWQgZmlsZVxuICAgICAgICBzdGF0ZS5yZXF1ZXN0ID0gZmV0Y2hGbihcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZHVyYXRpb25cbiAgICAgICAgICAgICAgICBzdGF0ZS5kdXJhdGlvbiA9IERhdGUubm93KCkgLSBzdGF0ZS50aW1lc3RhbXA7XG5cbiAgICAgICAgICAgICAgICAvLyBkb25lIVxuICAgICAgICAgICAgICAgIHN0YXRlLmNvbXBsZXRlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIC8vIHR1cm4gYmxvYiByZXNwb25zZSBpbnRvIGEgZmlsZVxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEJsb2IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBnZXRGaWxlRnJvbUJsb2IocmVzcG9uc2UsIHJlc3BvbnNlLm5hbWUgfHwgZ2V0RmlsZW5hbWVGcm9tVVJMKHVybCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGFwaS5maXJlKFxuICAgICAgICAgICAgICAgICAgICAnbG9hZCcsXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGhhcyByZWNlaXZlZCBibG9iLCB3ZSBnbyB3aXRoIGJsb2IsIGlmIG5vIHJlc3BvbnNlLCB3ZSByZXR1cm4gbnVsbFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSBpbnN0YW5jZW9mIEJsb2IgPyByZXNwb25zZSA6IHJlc3BvbnNlID8gcmVzcG9uc2UuYm9keSA6IG51bGxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICBhcGkuZmlyZShcbiAgICAgICAgICAgICAgICAgICAgJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGVycm9yID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IGVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICA6IGVycm9yXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoY29tcHV0YWJsZSwgY3VycmVudCwgdG90YWwpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb2xsZWN0ZWQgc29tZSBtZXRhIGRhdGEgYWxyZWFkeVxuICAgICAgICAgICAgICAgIGlmICh0b3RhbCkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5zaXplID0gdG90YWw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgc3RhdGUuZHVyYXRpb24gPSBEYXRlLm5vdygpIC0gc3RhdGUudGltZXN0YW1wO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgd2UgY2FuJ3QgY29tcHV0ZSBwcm9ncmVzcywgd2UncmUgbm90IGdvaW5nIHRvIGZpcmUgcHJvZ3Jlc3MgZXZlbnRzXG4gICAgICAgICAgICAgICAgaWYgKCFjb21wdXRhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBwcm9ncmVzcyBwZXJjZW50YWdlXG4gICAgICAgICAgICAgICAgc3RhdGUucHJvZ3Jlc3MgPSBjdXJyZW50IC8gdG90YWw7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBvc2VcbiAgICAgICAgICAgICAgICBhcGkuZmlyZSgncHJvZ3Jlc3MnLCBzdGF0ZS5wcm9ncmVzcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFwaS5maXJlKCdhYm9ydCcpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlaW5mbyA9IGdldEZpbGVJbmZvRnJvbUhlYWRlcnMoXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiByZXNwb25zZSA9PT0gJ3N0cmluZycgPyByZXNwb25zZSA6IHJlc3BvbnNlLmhlYWRlcnNcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGFwaS5maXJlKCdtZXRhJywge1xuICAgICAgICAgICAgICAgICAgICBzaXplOiBzdGF0ZS5zaXplIHx8IGZpbGVpbmZvLnNpemUsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBmaWxlaW5mby5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGZpbGVpbmZvLnNvdXJjZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3QgYXBpID0ge1xuICAgICAgICAuLi5vbigpLFxuICAgICAgICBzZXRTb3VyY2U6IHNvdXJjZSA9PiAoc3RhdGUuc291cmNlID0gc291cmNlKSxcbiAgICAgICAgZ2V0UHJvZ3Jlc3MsIC8vIGZpbGUgbG9hZCBwcm9ncmVzc1xuICAgICAgICBhYm9ydCwgLy8gYWJvcnQgZmlsZSBsb2FkXG4gICAgICAgIGxvYWQsIC8vIHN0YXJ0IGxvYWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIGFwaTtcbn07XG5cbmNvbnN0IGlzR2V0ID0gbWV0aG9kID0+IC9HRVR8SEVBRC8udGVzdChtZXRob2QpO1xuXG5jb25zdCBzZW5kUmVxdWVzdCA9IChkYXRhLCB1cmwsIG9wdGlvbnMpID0+IHtcbiAgICBjb25zdCBhcGkgPSB7XG4gICAgICAgIG9uaGVhZGVyczogKCkgPT4ge30sXG4gICAgICAgIG9ucHJvZ3Jlc3M6ICgpID0+IHt9LFxuICAgICAgICBvbmxvYWQ6ICgpID0+IHt9LFxuICAgICAgICBvbnRpbWVvdXQ6ICgpID0+IHt9LFxuICAgICAgICBvbmVycm9yOiAoKSA9PiB7fSxcbiAgICAgICAgb25hYm9ydDogKCkgPT4ge30sXG4gICAgICAgIGFib3J0OiAoKSA9PiB7XG4gICAgICAgICAgICBhYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgICB9LFxuICAgIH07XG5cbiAgICAvLyB0aW1lb3V0IGlkZW50aWZpZXIsIG9ubHkgdXNlZCB3aGVuIHRpbWVvdXQgaXMgZGVmaW5lZFxuICAgIGxldCBhYm9ydGVkID0gZmFsc2U7XG4gICAgbGV0IGhlYWRlcnNSZWNlaXZlZCA9IGZhbHNlO1xuXG4gICAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgLy8gZW5jb2RlIHVybFxuICAgIHVybCA9IGVuY29kZVVSSSh1cmwpO1xuXG4gICAgLy8gaWYgbWV0aG9kIGlzIEdFVCwgYWRkIGFueSByZWNlaXZlZCBkYXRhIHRvIHVybFxuXG4gICAgaWYgKGlzR2V0KG9wdGlvbnMubWV0aG9kKSAmJiBkYXRhKSB7XG4gICAgICAgIHVybCA9IGAke3VybH0ke2VuY29kZVVSSUNvbXBvbmVudCh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgPyBkYXRhIDogSlNPTi5zdHJpbmdpZnkoZGF0YSkpfWA7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIHJlcXVlc3RcbiAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIC8vIHByb2dyZXNzIG9mIGxvYWRcbiAgICBjb25zdCBwcm9jZXNzID0gaXNHZXQob3B0aW9ucy5tZXRob2QpID8geGhyIDogeGhyLnVwbG9hZDtcbiAgICBwcm9jZXNzLm9ucHJvZ3Jlc3MgPSBlID0+IHtcbiAgICAgICAgLy8gbm8gcHJvZ3Jlc3MgZXZlbnQgd2hlbiBhYm9ydGVkICggb25wcm9ncmVzcyBpcyBjYWxsZWQgb25jZSBhZnRlciBhYm9ydCgpIClcbiAgICAgICAgaWYgKGFib3J0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwaS5vbnByb2dyZXNzKGUubGVuZ3RoQ29tcHV0YWJsZSwgZS5sb2FkZWQsIGUudG90YWwpO1xuICAgIH07XG5cbiAgICAvLyB0cmllcyB0byBnZXQgaGVhZGVyIGluZm8gdG8gdGhlIGFwcCBhcyBmYXN0IGFzIHBvc3NpYmxlXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgLy8gbm90IGludGVyZXN0aW5nIGluIHRoZXNlIHN0YXRlcyAoJ3Vuc2VudCcgYW5kICdvcGVuZW5kJyBhcyB0aGV5IGRvbid0IGdpdmUgdXMgYW55IGFkZGl0aW9uYWwgaW5mbylcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlIDwgMikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm8gc2VydmVyIHJlc3BvbnNlXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCAmJiB4aHIuc3RhdHVzID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGVhZGVyc1JlY2VpdmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBoZWFkZXJzUmVjZWl2ZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIHdlJ3ZlIHByb2JhYmx5IHJlY2VpdmVkIHNvbWUgdXNlZnVsIGRhdGEgaW4gcmVzcG9uc2UgaGVhZGVyc1xuICAgICAgICBhcGkub25oZWFkZXJzKHhocik7XG4gICAgfTtcblxuICAgIC8vIGxvYWQgc3VjY2Vzc2Z1bFxuICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIC8vIGlzIGNsYXNzaWZpZWQgYXMgdmFsaWQgcmVzcG9uc2VcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgIGFwaS5vbmxvYWQoeGhyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFwaS5vbmVycm9yKHhocik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gZXJyb3IgZHVyaW5nIGxvYWRcbiAgICB4aHIub25lcnJvciA9ICgpID0+IGFwaS5vbmVycm9yKHhocik7XG5cbiAgICAvLyByZXF1ZXN0IGFib3J0ZWRcbiAgICB4aHIub25hYm9ydCA9ICgpID0+IHtcbiAgICAgICAgYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIGFwaS5vbmFib3J0KCk7XG4gICAgfTtcblxuICAgIC8vIHJlcXVlc3QgdGltZW91dFxuICAgIHhoci5vbnRpbWVvdXQgPSAoKSA9PiBhcGkub250aW1lb3V0KHhocik7XG5cbiAgICAvLyBvcGVuIHVwIG9wZW4gdXAhXG4gICAgeGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIHVybCwgdHJ1ZSk7XG5cbiAgICAvLyBzZXQgdGltZW91dCBpZiBkZWZpbmVkIChkbyBpdCBhZnRlciBvcGVuIHNvIElFMTEgcGxheXMgYmFsbClcbiAgICBpZiAoaXNJbnQob3B0aW9ucy50aW1lb3V0KSkge1xuICAgICAgICB4aHIudGltZW91dCA9IG9wdGlvbnMudGltZW91dDtcbiAgICB9XG5cbiAgICAvLyBhZGQgaGVhZGVyc1xuICAgIE9iamVjdC5rZXlzKG9wdGlvbnMuaGVhZGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChvcHRpb25zLmhlYWRlcnNba2V5XSkpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbHVlKTtcbiAgICB9KTtcblxuICAgIC8vIHNldCB0eXBlIG9mIHJlc3BvbnNlXG4gICAgaWYgKG9wdGlvbnMucmVzcG9uc2VUeXBlKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSBvcHRpb25zLnJlc3BvbnNlVHlwZTtcbiAgICB9XG5cbiAgICAvLyBzZXQgY3JlZGVudGlhbHNcbiAgICBpZiAob3B0aW9ucy53aXRoQ3JlZGVudGlhbHMpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gbGV0J3Mgc2VuZCBvdXIgZGF0YVxuICAgIHhoci5zZW5kKGRhdGEpO1xuXG4gICAgcmV0dXJuIGFwaTtcbn07XG5cbmNvbnN0IGNyZWF0ZVJlc3BvbnNlID0gKHR5cGUsIGNvZGUsIGJvZHksIGhlYWRlcnMpID0+ICh7XG4gICAgdHlwZSxcbiAgICBjb2RlLFxuICAgIGJvZHksXG4gICAgaGVhZGVycyxcbn0pO1xuXG5jb25zdCBjcmVhdGVUaW1lb3V0UmVzcG9uc2UgPSBjYiA9PiB4aHIgPT4ge1xuICAgIGNiKGNyZWF0ZVJlc3BvbnNlKCdlcnJvcicsIDAsICdUaW1lb3V0JywgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSk7XG59O1xuXG5jb25zdCBoYXNRUyA9IHN0ciA9PiAvXFw/Ly50ZXN0KHN0cik7XG5jb25zdCBidWlsZFVSTCA9ICguLi5wYXJ0cykgPT4ge1xuICAgIGxldCB1cmwgPSAnJztcbiAgICBwYXJ0cy5mb3JFYWNoKHBhcnQgPT4ge1xuICAgICAgICB1cmwgKz0gaGFzUVModXJsKSAmJiBoYXNRUyhwYXJ0KSA/IHBhcnQucmVwbGFjZSgvXFw/LywgJyYnKSA6IHBhcnQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIHVybDtcbn07XG5cbmNvbnN0IGNyZWF0ZUZldGNoRnVuY3Rpb24gPSAoYXBpVXJsID0gJycsIGFjdGlvbikgPT4ge1xuICAgIC8vIGN1c3RvbSBoYW5kbGVyIChzaG91bGQgYWxzbyBoYW5kbGUgZmlsZSwgbG9hZCwgZXJyb3IsIHByb2dyZXNzIGFuZCBhYm9ydClcbiAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cblxuICAgIC8vIG5vIGFjdGlvbiBzdXBwbGllZFxuICAgIGlmICghYWN0aW9uIHx8ICFpc1N0cmluZyhhY3Rpb24udXJsKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBzZXQgb25sb2FkIGhhbmxkZXJcbiAgICBjb25zdCBvbmxvYWQgPSBhY3Rpb24ub25sb2FkIHx8IChyZXMgPT4gcmVzKTtcbiAgICBjb25zdCBvbmVycm9yID0gYWN0aW9uLm9uZXJyb3IgfHwgKHJlcyA9PiBudWxsKTtcblxuICAgIC8vIGludGVybmFsIGhhbmRsZXJcbiAgICByZXR1cm4gKHVybCwgbG9hZCwgZXJyb3IsIHByb2dyZXNzLCBhYm9ydCwgaGVhZGVycykgPT4ge1xuICAgICAgICAvLyBkbyBsb2NhbCBvciByZW1vdGUgcmVxdWVzdCBiYXNlZCBvbiBpZiB0aGUgdXJsIGlzIGV4dGVybmFsXG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSBzZW5kUmVxdWVzdCh1cmwsIGJ1aWxkVVJMKGFwaVVybCwgYWN0aW9uLnVybCksIHtcbiAgICAgICAgICAgIC4uLmFjdGlvbixcbiAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ2Jsb2InLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IHhociA9PiB7XG4gICAgICAgICAgICAvLyBnZXQgaGVhZGVyc1xuICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKTtcblxuICAgICAgICAgICAgLy8gZ2V0IGZpbGVuYW1lXG4gICAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IGdldEZpbGVJbmZvRnJvbUhlYWRlcnMoaGVhZGVycykubmFtZSB8fCBnZXRGaWxlbmFtZUZyb21VUkwodXJsKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIHJlc3BvbnNlXG4gICAgICAgICAgICBsb2FkKFxuICAgICAgICAgICAgICAgIGNyZWF0ZVJlc3BvbnNlKFxuICAgICAgICAgICAgICAgICAgICAnbG9hZCcsXG4gICAgICAgICAgICAgICAgICAgIHhoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5tZXRob2QgPT09ICdIRUFEJ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGdldEZpbGVGcm9tQmxvYihvbmxvYWQoeGhyLnJlc3BvbnNlKSwgZmlsZW5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSB4aHIgPT4ge1xuICAgICAgICAgICAgZXJyb3IoXG4gICAgICAgICAgICAgICAgY3JlYXRlUmVzcG9uc2UoXG4gICAgICAgICAgICAgICAgICAgICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgIHhoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG9uZXJyb3IoeGhyLnJlc3BvbnNlKSB8fCB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXF1ZXN0Lm9uaGVhZGVycyA9IHhociA9PiB7XG4gICAgICAgICAgICBoZWFkZXJzKGNyZWF0ZVJlc3BvbnNlKCdoZWFkZXJzJywgeGhyLnN0YXR1cywgbnVsbCwgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBjcmVhdGVUaW1lb3V0UmVzcG9uc2UoZXJyb3IpO1xuICAgICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICAgICAgcmVxdWVzdC5vbmFib3J0ID0gYWJvcnQ7XG5cbiAgICAgICAgLy8gc2hvdWxkIHJldHVybiByZXF1ZXN0XG4gICAgICAgIHJldHVybiByZXF1ZXN0O1xuICAgIH07XG59O1xuXG5jb25zdCBDaHVua1N0YXR1cyA9IHtcbiAgICBRVUVVRUQ6IDAsXG4gICAgQ09NUExFVEU6IDEsXG4gICAgUFJPQ0VTU0lORzogMixcbiAgICBFUlJPUjogMyxcbiAgICBXQUlUSU5HOiA0LFxufTtcblxuLypcbmZ1bmN0aW9uIHNpZ25hdHVyZTpcbiAgKGZpbGUsIG1ldGFkYXRhLCBsb2FkLCBlcnJvciwgcHJvZ3Jlc3MsIGFib3J0LCB0cmFuc2Zlciwgb3B0aW9ucykgPT4ge1xuICAgIHJldHVybiB7XG4gICAgYWJvcnQ6KCkgPT4ge31cbiAgfVxufVxuKi9cblxuLy8gYXBpVXJsLCBhY3Rpb24sIG5hbWUsIGZpbGUsIG1ldGFkYXRhLCBsb2FkLCBlcnJvciwgcHJvZ3Jlc3MsIGFib3J0LCB0cmFuc2Zlciwgb3B0aW9uc1xuY29uc3QgcHJvY2Vzc0ZpbGVDaHVua2VkID0gKFxuICAgIGFwaVVybCxcbiAgICBhY3Rpb24sXG4gICAgbmFtZSxcbiAgICBmaWxlLFxuICAgIG1ldGFkYXRhLFxuICAgIGxvYWQsXG4gICAgZXJyb3IsXG4gICAgcHJvZ3Jlc3MsXG4gICAgYWJvcnQsXG4gICAgdHJhbnNmZXIsXG4gICAgb3B0aW9uc1xuKSA9PiB7XG4gICAgLy8gYWxsIGNodW5rc1xuICAgIGNvbnN0IGNodW5rcyA9IFtdO1xuICAgIGNvbnN0IHsgY2h1bmtUcmFuc2ZlcklkLCBjaHVua1NlcnZlciwgY2h1bmtTaXplLCBjaHVua1JldHJ5RGVsYXlzIH0gPSBvcHRpb25zO1xuXG4gICAgLy8gZGVmYXVsdCBzdGF0ZVxuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBzZXJ2ZXJJZDogY2h1bmtUcmFuc2ZlcklkLFxuICAgICAgICBhYm9ydGVkOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgLy8gc2V0IG9ubG9hZCBoYW5kbGVyc1xuICAgIGNvbnN0IG9uZGF0YSA9IGFjdGlvbi5vbmRhdGEgfHwgKGZkID0+IGZkKTtcbiAgICBjb25zdCBvbmxvYWQgPVxuICAgICAgICBhY3Rpb24ub25sb2FkIHx8XG4gICAgICAgICgoeGhyLCBtZXRob2QpID0+XG4gICAgICAgICAgICBtZXRob2QgPT09ICdIRUFEJyA/IHhoci5nZXRSZXNwb25zZUhlYWRlcignVXBsb2FkLU9mZnNldCcpIDogeGhyLnJlc3BvbnNlKTtcbiAgICBjb25zdCBvbmVycm9yID0gYWN0aW9uLm9uZXJyb3IgfHwgKHJlcyA9PiBudWxsKTtcblxuICAgIC8vIGNyZWF0ZSBzZXJ2ZXIgaG9va1xuICAgIGNvbnN0IHJlcXVlc3RUcmFuc2ZlcklkID0gY2IgPT4ge1xuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgICAgIC8vIGFkZCBtZXRhZGF0YSB1bmRlciBzYW1lIG5hbWVcbiAgICAgICAgaWYgKGlzT2JqZWN0KG1ldGFkYXRhKSkgZm9ybURhdGEuYXBwZW5kKG5hbWUsIEpTT04uc3RyaW5naWZ5KG1ldGFkYXRhKSk7XG5cbiAgICAgICAgY29uc3QgaGVhZGVycyA9XG4gICAgICAgICAgICB0eXBlb2YgYWN0aW9uLmhlYWRlcnMgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgICA/IGFjdGlvbi5oZWFkZXJzKGZpbGUsIG1ldGFkYXRhKVxuICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgIC4uLmFjdGlvbi5oZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICdVcGxvYWQtTGVuZ3RoJzogZmlsZS5zaXplLFxuICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByZXF1ZXN0UGFyYW1zID0ge1xuICAgICAgICAgICAgLi4uYWN0aW9uLFxuICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBzZW5kIHJlcXVlc3Qgb2JqZWN0XG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSBzZW5kUmVxdWVzdChvbmRhdGEoZm9ybURhdGEpLCBidWlsZFVSTChhcGlVcmwsIGFjdGlvbi51cmwpLCByZXF1ZXN0UGFyYW1zKTtcblxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IHhociA9PiBjYihvbmxvYWQoeGhyLCByZXF1ZXN0UGFyYW1zLm1ldGhvZCkpO1xuXG4gICAgICAgIHJlcXVlc3Qub25lcnJvciA9IHhociA9PlxuICAgICAgICAgICAgZXJyb3IoXG4gICAgICAgICAgICAgICAgY3JlYXRlUmVzcG9uc2UoXG4gICAgICAgICAgICAgICAgICAgICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgIHhoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG9uZXJyb3IoeGhyLnJlc3BvbnNlKSB8fCB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICByZXF1ZXN0Lm9udGltZW91dCA9IGNyZWF0ZVRpbWVvdXRSZXNwb25zZShlcnJvcik7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlcXVlc3RUcmFuc2Zlck9mZnNldCA9IGNiID0+IHtcbiAgICAgICAgY29uc3QgcmVxdWVzdFVybCA9IGJ1aWxkVVJMKGFwaVVybCwgY2h1bmtTZXJ2ZXIudXJsLCBzdGF0ZS5zZXJ2ZXJJZCk7XG5cbiAgICAgICAgY29uc3QgaGVhZGVycyA9XG4gICAgICAgICAgICB0eXBlb2YgYWN0aW9uLmhlYWRlcnMgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgICA/IGFjdGlvbi5oZWFkZXJzKHN0YXRlLnNlcnZlcklkKVxuICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgIC4uLmFjdGlvbi5oZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByZXF1ZXN0UGFyYW1zID0ge1xuICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgICAgIG1ldGhvZDogJ0hFQUQnLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSBzZW5kUmVxdWVzdChudWxsLCByZXF1ZXN0VXJsLCByZXF1ZXN0UGFyYW1zKTtcblxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IHhociA9PiBjYihvbmxvYWQoeGhyLCByZXF1ZXN0UGFyYW1zLm1ldGhvZCkpO1xuXG4gICAgICAgIHJlcXVlc3Qub25lcnJvciA9IHhociA9PlxuICAgICAgICAgICAgZXJyb3IoXG4gICAgICAgICAgICAgICAgY3JlYXRlUmVzcG9uc2UoXG4gICAgICAgICAgICAgICAgICAgICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgIHhoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG9uZXJyb3IoeGhyLnJlc3BvbnNlKSB8fCB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICByZXF1ZXN0Lm9udGltZW91dCA9IGNyZWF0ZVRpbWVvdXRSZXNwb25zZShlcnJvcik7XG4gICAgfTtcblxuICAgIC8vIGNyZWF0ZSBjaHVua3NcbiAgICBjb25zdCBsYXN0Q2h1bmtJbmRleCA9IE1hdGguZmxvb3IoZmlsZS5zaXplIC8gY2h1bmtTaXplKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBsYXN0Q2h1bmtJbmRleDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IGkgKiBjaHVua1NpemU7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBmaWxlLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgY2h1bmtTaXplLCAnYXBwbGljYXRpb24vb2Zmc2V0K29jdGV0LXN0cmVhbScpO1xuICAgICAgICBjaHVua3NbaV0gPSB7XG4gICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgIHNpemU6IGRhdGEuc2l6ZSxcbiAgICAgICAgICAgIG9mZnNldCxcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICAgICAgICByZXRyaWVzOiBbLi4uY2h1bmtSZXRyeURlbGF5c10sXG4gICAgICAgICAgICBzdGF0dXM6IENodW5rU3RhdHVzLlFVRVVFRCxcbiAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgcmVxdWVzdDogbnVsbCxcbiAgICAgICAgICAgIHRpbWVvdXQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgY29tcGxldGVQcm9jZXNzaW5nQ2h1bmtzID0gKCkgPT4gbG9hZChzdGF0ZS5zZXJ2ZXJJZCk7XG5cbiAgICBjb25zdCBjYW5Qcm9jZXNzQ2h1bmsgPSBjaHVuayA9PlxuICAgICAgICBjaHVuay5zdGF0dXMgPT09IENodW5rU3RhdHVzLlFVRVVFRCB8fCBjaHVuay5zdGF0dXMgPT09IENodW5rU3RhdHVzLkVSUk9SO1xuXG4gICAgY29uc3QgcHJvY2Vzc0NodW5rID0gY2h1bmsgPT4ge1xuICAgICAgICAvLyBwcm9jZXNzaW5nIGlzIHBhdXNlZCwgd2FpdCBoZXJlXG4gICAgICAgIGlmIChzdGF0ZS5hYm9ydGVkKSByZXR1cm47XG5cbiAgICAgICAgLy8gZ2V0IG5leHQgY2h1bmsgdG8gcHJvY2Vzc1xuICAgICAgICBjaHVuayA9IGNodW5rIHx8IGNodW5rcy5maW5kKGNhblByb2Nlc3NDaHVuayk7XG5cbiAgICAgICAgLy8gbm8gbW9yZSBjaHVua3MgdG8gcHJvY2Vzc1xuICAgICAgICBpZiAoIWNodW5rKSB7XG4gICAgICAgICAgICAvLyBhbGwgZG9uZT9cbiAgICAgICAgICAgIGlmIChjaHVua3MuZXZlcnkoY2h1bmsgPT4gY2h1bmsuc3RhdHVzID09PSBDaHVua1N0YXR1cy5DT01QTEVURSkpIHtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZVByb2Nlc3NpbmdDaHVua3MoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbm8gY2h1bmsgdG8gaGFuZGxlXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBub3cgcHJvY2Vzc2luZyB0aGlzIGNodW5rXG4gICAgICAgIGNodW5rLnN0YXR1cyA9IENodW5rU3RhdHVzLlBST0NFU1NJTkc7XG4gICAgICAgIGNodW5rLnByb2dyZXNzID0gbnVsbDtcblxuICAgICAgICAvLyBhbGxvdyBwYXJzaW5nIG9mIGZvcm1kYXRhXG4gICAgICAgIGNvbnN0IG9uZGF0YSA9IGNodW5rU2VydmVyLm9uZGF0YSB8fCAoZmQgPT4gZmQpO1xuICAgICAgICBjb25zdCBvbmVycm9yID0gY2h1bmtTZXJ2ZXIub25lcnJvciB8fCAocmVzID0+IG51bGwpO1xuICAgICAgICBjb25zdCBvbmxvYWQgPSBjaHVua1NlcnZlci5vbmxvYWQgfHwgKCgpID0+IHt9KTtcblxuICAgICAgICAvLyBzZW5kIHJlcXVlc3Qgb2JqZWN0XG4gICAgICAgIGNvbnN0IHJlcXVlc3RVcmwgPSBidWlsZFVSTChhcGlVcmwsIGNodW5rU2VydmVyLnVybCwgc3RhdGUuc2VydmVySWQpO1xuXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPVxuICAgICAgICAgICAgdHlwZW9mIGNodW5rU2VydmVyLmhlYWRlcnMgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgICA/IGNodW5rU2VydmVyLmhlYWRlcnMoY2h1bmspXG4gICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgLi4uY2h1bmtTZXJ2ZXIuaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL29mZnNldCtvY3RldC1zdHJlYW0nLFxuICAgICAgICAgICAgICAgICAgICAgICdVcGxvYWQtT2Zmc2V0JzogY2h1bmsub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICdVcGxvYWQtTGVuZ3RoJzogZmlsZS5zaXplLFxuICAgICAgICAgICAgICAgICAgICAgICdVcGxvYWQtTmFtZSc6IGZpbGUubmFtZSxcbiAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IChjaHVuay5yZXF1ZXN0ID0gc2VuZFJlcXVlc3Qob25kYXRhKGNodW5rLmRhdGEpLCByZXF1ZXN0VXJsLCB7XG4gICAgICAgICAgICAuLi5jaHVua1NlcnZlcixcbiAgICAgICAgICAgIGhlYWRlcnMsXG4gICAgICAgIH0pKTtcblxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IHhociA9PiB7XG4gICAgICAgICAgICAvLyBhbGxvdyBob29raW5nIGludG8gcmVxdWVzdCByZXN1bHRcbiAgICAgICAgICAgIG9ubG9hZCh4aHIsIGNodW5rLmluZGV4LCBjaHVua3MubGVuZ3RoKTtcblxuICAgICAgICAgICAgLy8gZG9uZSFcbiAgICAgICAgICAgIGNodW5rLnN0YXR1cyA9IENodW5rU3RhdHVzLkNPTVBMRVRFO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgcmVxdWVzdCByZWZlcmVuY2VcbiAgICAgICAgICAgIGNodW5rLnJlcXVlc3QgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBzdGFydCBwcm9jZXNzaW5nIG1vcmUgY2h1bmtzXG4gICAgICAgICAgICBwcm9jZXNzQ2h1bmtzKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVxdWVzdC5vbnByb2dyZXNzID0gKGxlbmd0aENvbXB1dGFibGUsIGxvYWRlZCwgdG90YWwpID0+IHtcbiAgICAgICAgICAgIGNodW5rLnByb2dyZXNzID0gbGVuZ3RoQ29tcHV0YWJsZSA/IGxvYWRlZCA6IG51bGw7XG4gICAgICAgICAgICB1cGRhdGVUb3RhbFByb2dyZXNzKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVxdWVzdC5vbmVycm9yID0geGhyID0+IHtcbiAgICAgICAgICAgIGNodW5rLnN0YXR1cyA9IENodW5rU3RhdHVzLkVSUk9SO1xuICAgICAgICAgICAgY2h1bmsucmVxdWVzdCA9IG51bGw7XG4gICAgICAgICAgICBjaHVuay5lcnJvciA9IG9uZXJyb3IoeGhyLnJlc3BvbnNlKSB8fCB4aHIuc3RhdHVzVGV4dDtcbiAgICAgICAgICAgIGlmICghcmV0cnlQcm9jZXNzQ2h1bmsoY2h1bmspKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVJlc3BvbnNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmVycm9yKHhoci5yZXNwb25zZSkgfHwgeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSB4aHIgPT4ge1xuICAgICAgICAgICAgY2h1bmsuc3RhdHVzID0gQ2h1bmtTdGF0dXMuRVJST1I7XG4gICAgICAgICAgICBjaHVuay5yZXF1ZXN0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghcmV0cnlQcm9jZXNzQ2h1bmsoY2h1bmspKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlVGltZW91dFJlc3BvbnNlKGVycm9yKSh4aHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlcXVlc3Qub25hYm9ydCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNodW5rLnN0YXR1cyA9IENodW5rU3RhdHVzLlFVRVVFRDtcbiAgICAgICAgICAgIGNodW5rLnJlcXVlc3QgPSBudWxsO1xuICAgICAgICAgICAgYWJvcnQoKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgY29uc3QgcmV0cnlQcm9jZXNzQ2h1bmsgPSBjaHVuayA9PiB7XG4gICAgICAgIC8vIG5vIG1vcmUgcmV0cmllcyBsZWZ0XG4gICAgICAgIGlmIChjaHVuay5yZXRyaWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIC8vIG5ldyByZXRyeVxuICAgICAgICBjaHVuay5zdGF0dXMgPSBDaHVua1N0YXR1cy5XQUlUSU5HO1xuICAgICAgICBjbGVhclRpbWVvdXQoY2h1bmsudGltZW91dCk7XG4gICAgICAgIGNodW5rLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHByb2Nlc3NDaHVuayhjaHVuayk7XG4gICAgICAgIH0sIGNodW5rLnJldHJpZXMuc2hpZnQoKSk7XG5cbiAgICAgICAgLy8gd2UncmUgZ29pbmcgdG8gcmV0cnlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZVRvdGFsUHJvZ3Jlc3MgPSAoKSA9PiB7XG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0b3RhbCBwcm9ncmVzcyBmcmFjdGlvblxuICAgICAgICBjb25zdCB0b3RhbEJ5dGVzVHJhbnNmZXJlZCA9IGNodW5rcy5yZWR1Y2UoKHAsIGNodW5rKSA9PiB7XG4gICAgICAgICAgICBpZiAocCA9PT0gbnVsbCB8fCBjaHVuay5wcm9ncmVzcyA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICByZXR1cm4gcCArIGNodW5rLnByb2dyZXNzO1xuICAgICAgICB9LCAwKTtcblxuICAgICAgICAvLyBjYW4ndCBjb21wdXRlIHByb2dyZXNzXG4gICAgICAgIGlmICh0b3RhbEJ5dGVzVHJhbnNmZXJlZCA9PT0gbnVsbCkgcmV0dXJuIHByb2dyZXNzKGZhbHNlLCAwLCAwKTtcblxuICAgICAgICAvLyBjYWxjdWxhdGUgcHJvZ3Jlc3MgdmFsdWVzXG4gICAgICAgIGNvbnN0IHRvdGFsU2l6ZSA9IGNodW5rcy5yZWR1Y2UoKHRvdGFsLCBjaHVuaykgPT4gdG90YWwgKyBjaHVuay5zaXplLCAwKTtcblxuICAgICAgICAvLyBjYW4gdXBkYXRlIHByb2dyZXNzIGluZGljYXRvclxuICAgICAgICBwcm9ncmVzcyh0cnVlLCB0b3RhbEJ5dGVzVHJhbnNmZXJlZCwgdG90YWxTaXplKTtcbiAgICB9O1xuXG4gICAgLy8gcHJvY2VzcyBuZXcgY2h1bmtzXG4gICAgY29uc3QgcHJvY2Vzc0NodW5rcyA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdG90YWxQcm9jZXNzaW5nID0gY2h1bmtzLmZpbHRlcihjaHVuayA9PiBjaHVuay5zdGF0dXMgPT09IENodW5rU3RhdHVzLlBST0NFU1NJTkcpXG4gICAgICAgICAgICAubGVuZ3RoO1xuICAgICAgICBpZiAodG90YWxQcm9jZXNzaW5nID49IDEpIHJldHVybjtcbiAgICAgICAgcHJvY2Vzc0NodW5rKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFib3J0Q2h1bmtzID0gKCkgPT4ge1xuICAgICAgICBjaHVua3MuZm9yRWFjaChjaHVuayA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoY2h1bmsudGltZW91dCk7XG4gICAgICAgICAgICBpZiAoY2h1bmsucmVxdWVzdCkge1xuICAgICAgICAgICAgICAgIGNodW5rLnJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIGxldCdzIGdvIVxuICAgIGlmICghc3RhdGUuc2VydmVySWQpIHtcbiAgICAgICAgcmVxdWVzdFRyYW5zZmVySWQoc2VydmVySWQgPT4ge1xuICAgICAgICAgICAgLy8gc3RvcCBoZXJlIGlmIGFib3J0ZWQsIG1pZ2h0IGhhdmUgaGFwcGVuZWQgaW4gYmV0d2VlbiByZXF1ZXN0IGFuZCBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHN0YXRlLmFib3J0ZWQpIHJldHVybjtcblxuICAgICAgICAgICAgLy8gcGFzcyBiYWNrIHRvIGl0ZW0gc28gd2UgY2FuIHVzZSBpdCBpZiBzb21ldGhpbmcgZ29lcyB3cm9uZ1xuICAgICAgICAgICAgdHJhbnNmZXIoc2VydmVySWQpO1xuXG4gICAgICAgICAgICAvLyBzdG9yZSBpbnRlcm5hbGx5XG4gICAgICAgICAgICBzdGF0ZS5zZXJ2ZXJJZCA9IHNlcnZlcklkO1xuICAgICAgICAgICAgcHJvY2Vzc0NodW5rcygpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0VHJhbnNmZXJPZmZzZXQob2Zmc2V0ID0+IHtcbiAgICAgICAgICAgIC8vIHN0b3AgaGVyZSBpZiBhYm9ydGVkLCBtaWdodCBoYXZlIGhhcHBlbmVkIGluIGJldHdlZW4gcmVxdWVzdCBhbmQgY2FsbGJhY2tcbiAgICAgICAgICAgIGlmIChzdGF0ZS5hYm9ydGVkKSByZXR1cm47XG5cbiAgICAgICAgICAgIC8vIG1hcmsgY2h1bmtzIHdpdGggbG93ZXIgb2Zmc2V0IGFzIGNvbXBsZXRlXG4gICAgICAgICAgICBjaHVua3NcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGNodW5rID0+IGNodW5rLm9mZnNldCA8IG9mZnNldClcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChjaHVuayA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNodW5rLnN0YXR1cyA9IENodW5rU3RhdHVzLkNPTVBMRVRFO1xuICAgICAgICAgICAgICAgICAgICBjaHVuay5wcm9ncmVzcyA9IGNodW5rLnNpemU7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGNvbnRpbnVlIHByb2Nlc3NpbmdcbiAgICAgICAgICAgIHByb2Nlc3NDaHVua3MoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWJvcnQ6ICgpID0+IHtcbiAgICAgICAgICAgIHN0YXRlLmFib3J0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgYWJvcnRDaHVua3MoKTtcbiAgICAgICAgfSxcbiAgICB9O1xufTtcblxuLypcbmZ1bmN0aW9uIHNpZ25hdHVyZTpcbiAgKGZpbGUsIG1ldGFkYXRhLCBsb2FkLCBlcnJvciwgcHJvZ3Jlc3MsIGFib3J0KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICBhYm9ydDooKSA9PiB7fVxuICB9XG59XG4qL1xuY29uc3QgY3JlYXRlRmlsZVByb2Nlc3NvckZ1bmN0aW9uID0gKGFwaVVybCwgYWN0aW9uLCBuYW1lLCBvcHRpb25zKSA9PiAoXG4gICAgZmlsZSxcbiAgICBtZXRhZGF0YSxcbiAgICBsb2FkLFxuICAgIGVycm9yLFxuICAgIHByb2dyZXNzLFxuICAgIGFib3J0LFxuICAgIHRyYW5zZmVyXG4pID0+IHtcbiAgICAvLyBubyBmaWxlIHJlY2VpdmVkXG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG5cbiAgICAvLyBpZiB3YXMgcGFzc2VkIGEgZmlsZSwgYW5kIHdlIGNhbiBjaHVuayBpdCwgZXhpdCBoZXJlXG4gICAgY29uc3QgY2FuQ2h1bmtVcGxvYWQgPSBvcHRpb25zLmNodW5rVXBsb2FkcztcbiAgICBjb25zdCBzaG91bGRDaHVua1VwbG9hZCA9IGNhbkNodW5rVXBsb2FkICYmIGZpbGUuc2l6ZSA+IG9wdGlvbnMuY2h1bmtTaXplO1xuICAgIGNvbnN0IHdpbGxDaHVua1VwbG9hZCA9IGNhbkNodW5rVXBsb2FkICYmIChzaG91bGRDaHVua1VwbG9hZCB8fCBvcHRpb25zLmNodW5rRm9yY2UpO1xuICAgIGlmIChmaWxlIGluc3RhbmNlb2YgQmxvYiAmJiB3aWxsQ2h1bmtVcGxvYWQpXG4gICAgICAgIHJldHVybiBwcm9jZXNzRmlsZUNodW5rZWQoXG4gICAgICAgICAgICBhcGlVcmwsXG4gICAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgIG1ldGFkYXRhLFxuICAgICAgICAgICAgbG9hZCxcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgcHJvZ3Jlc3MsXG4gICAgICAgICAgICBhYm9ydCxcbiAgICAgICAgICAgIHRyYW5zZmVyLFxuICAgICAgICAgICAgb3B0aW9uc1xuICAgICAgICApO1xuXG4gICAgLy8gc2V0IGhhbmRsZXJzXG4gICAgY29uc3Qgb25kYXRhID0gYWN0aW9uLm9uZGF0YSB8fCAoZmQgPT4gZmQpO1xuICAgIGNvbnN0IG9ubG9hZCA9IGFjdGlvbi5vbmxvYWQgfHwgKHJlcyA9PiByZXMpO1xuICAgIGNvbnN0IG9uZXJyb3IgPSBhY3Rpb24ub25lcnJvciB8fCAocmVzID0+IG51bGwpO1xuXG4gICAgY29uc3QgaGVhZGVycyA9XG4gICAgICAgIHR5cGVvZiBhY3Rpb24uaGVhZGVycyA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgPyBhY3Rpb24uaGVhZGVycyhmaWxlLCBtZXRhZGF0YSkgfHwge31cbiAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgLi4uYWN0aW9uLmhlYWRlcnMsXG4gICAgICAgICAgICAgIH07XG5cbiAgICBjb25zdCByZXF1ZXN0UGFyYW1zID0ge1xuICAgICAgICAuLi5hY3Rpb24sXG4gICAgICAgIGhlYWRlcnMsXG4gICAgfTtcblxuICAgIC8vIGNyZWF0ZSBmb3JtZGF0YSBvYmplY3RcbiAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgIC8vIGFkZCBtZXRhZGF0YSB1bmRlciBzYW1lIG5hbWVcbiAgICBpZiAoaXNPYmplY3QobWV0YWRhdGEpKSB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChuYW1lLCBKU09OLnN0cmluZ2lmeShtZXRhZGF0YSkpO1xuICAgIH1cblxuICAgIC8vIFR1cm4gaW50byBhbiBhcnJheSBvZiBvYmplY3RzIHNvIG5vIG1hdHRlciB3aGF0IHRoZSBpbnB1dCwgd2UgY2FuIGhhbmRsZSBpdCB0aGUgc2FtZSB3YXlcbiAgICAoZmlsZSBpbnN0YW5jZW9mIEJsb2IgPyBbeyBuYW1lOiBudWxsLCBmaWxlIH1dIDogZmlsZSkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFxuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIGl0ZW0uZmlsZSxcbiAgICAgICAgICAgIGl0ZW0ubmFtZSA9PT0gbnVsbCA/IGl0ZW0uZmlsZS5uYW1lIDogYCR7aXRlbS5uYW1lfSR7aXRlbS5maWxlLm5hbWV9YFxuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgLy8gc2VuZCByZXF1ZXN0IG9iamVjdFxuICAgIGNvbnN0IHJlcXVlc3QgPSBzZW5kUmVxdWVzdChvbmRhdGEoZm9ybURhdGEpLCBidWlsZFVSTChhcGlVcmwsIGFjdGlvbi51cmwpLCByZXF1ZXN0UGFyYW1zKTtcbiAgICByZXF1ZXN0Lm9ubG9hZCA9IHhociA9PiB7XG4gICAgICAgIGxvYWQoY3JlYXRlUmVzcG9uc2UoJ2xvYWQnLCB4aHIuc3RhdHVzLCBvbmxvYWQoeGhyLnJlc3BvbnNlKSwgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSk7XG4gICAgfTtcblxuICAgIHJlcXVlc3Qub25lcnJvciA9IHhociA9PiB7XG4gICAgICAgIGVycm9yKFxuICAgICAgICAgICAgY3JlYXRlUmVzcG9uc2UoXG4gICAgICAgICAgICAgICAgJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICB4aHIuc3RhdHVzLFxuICAgICAgICAgICAgICAgIG9uZXJyb3IoeGhyLnJlc3BvbnNlKSB8fCB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKClcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBjcmVhdGVUaW1lb3V0UmVzcG9uc2UoZXJyb3IpO1xuICAgIHJlcXVlc3Qub25wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgIHJlcXVlc3Qub25hYm9ydCA9IGFib3J0O1xuXG4gICAgLy8gc2hvdWxkIHJldHVybiByZXF1ZXN0XG4gICAgcmV0dXJuIHJlcXVlc3Q7XG59O1xuXG5jb25zdCBjcmVhdGVQcm9jZXNzb3JGdW5jdGlvbiA9IChhcGlVcmwgPSAnJywgYWN0aW9uLCBuYW1lLCBvcHRpb25zKSA9PiB7XG4gICAgLy8gY3VzdG9tIGhhbmRsZXIgKHNob3VsZCBhbHNvIGhhbmRsZSBmaWxlLCBsb2FkLCBlcnJvciwgcHJvZ3Jlc3MgYW5kIGFib3J0KVxuICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nKSByZXR1cm4gKC4uLnBhcmFtcykgPT4gYWN0aW9uKG5hbWUsIC4uLnBhcmFtcywgb3B0aW9ucyk7XG5cbiAgICAvLyBubyBhY3Rpb24gc3VwcGxpZWRcbiAgICBpZiAoIWFjdGlvbiB8fCAhaXNTdHJpbmcoYWN0aW9uLnVybCkpIHJldHVybiBudWxsO1xuXG4gICAgLy8gaW50ZXJuYWwgaGFuZGxlclxuICAgIHJldHVybiBjcmVhdGVGaWxlUHJvY2Vzc29yRnVuY3Rpb24oYXBpVXJsLCBhY3Rpb24sIG5hbWUsIG9wdGlvbnMpO1xufTtcblxuLypcbiBmdW5jdGlvbiBzaWduYXR1cmU6XG4gKHVuaXF1ZUZpbGVJZCwgbG9hZCwgZXJyb3IpID0+IHsgfVxuICovXG5jb25zdCBjcmVhdGVSZXZlcnRGdW5jdGlvbiA9IChhcGlVcmwgPSAnJywgYWN0aW9uKSA9PiB7XG4gICAgLy8gaXMgY3VzdG9tIGltcGxlbWVudGF0aW9uXG4gICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG5cbiAgICAvLyBubyBhY3Rpb24gc3VwcGxpZWQsIHJldHVybiBzdHViIGZ1bmN0aW9uLCBpbnRlcmZhY2Ugd2lsbCB3b3JrLCBidXQgZmlsZSB3b24ndCBiZSByZW1vdmVkXG4gICAgaWYgKCFhY3Rpb24gfHwgIWlzU3RyaW5nKGFjdGlvbi51cmwpKSB7XG4gICAgICAgIHJldHVybiAodW5pcXVlRmlsZUlkLCBsb2FkKSA9PiBsb2FkKCk7XG4gICAgfVxuXG4gICAgLy8gc2V0IG9ubG9hZCBoYW5sZGVyXG4gICAgY29uc3Qgb25sb2FkID0gYWN0aW9uLm9ubG9hZCB8fCAocmVzID0+IHJlcyk7XG4gICAgY29uc3Qgb25lcnJvciA9IGFjdGlvbi5vbmVycm9yIHx8IChyZXMgPT4gbnVsbCk7XG5cbiAgICAvLyBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvblxuICAgIHJldHVybiAodW5pcXVlRmlsZUlkLCBsb2FkLCBlcnJvcikgPT4ge1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gc2VuZFJlcXVlc3QoXG4gICAgICAgICAgICB1bmlxdWVGaWxlSWQsXG4gICAgICAgICAgICBhcGlVcmwgKyBhY3Rpb24udXJsLFxuICAgICAgICAgICAgYWN0aW9uIC8vIGNvbnRhaW5zIG1ldGhvZCwgaGVhZGVycyBhbmQgd2l0aENyZWRlbnRpYWxzIHByb3BlcnRpZXNcbiAgICAgICAgKTtcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSB4aHIgPT4ge1xuICAgICAgICAgICAgbG9hZChcbiAgICAgICAgICAgICAgICBjcmVhdGVSZXNwb25zZShcbiAgICAgICAgICAgICAgICAgICAgJ2xvYWQnLFxuICAgICAgICAgICAgICAgICAgICB4aHIuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBvbmxvYWQoeGhyLnJlc3BvbnNlKSxcbiAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSB4aHIgPT4ge1xuICAgICAgICAgICAgZXJyb3IoXG4gICAgICAgICAgICAgICAgY3JlYXRlUmVzcG9uc2UoXG4gICAgICAgICAgICAgICAgICAgICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgIHhoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG9uZXJyb3IoeGhyLnJlc3BvbnNlKSB8fCB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXF1ZXN0Lm9udGltZW91dCA9IGNyZWF0ZVRpbWVvdXRSZXNwb25zZShlcnJvcik7XG5cbiAgICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgfTtcbn07XG5cbmNvbnN0IGdldFJhbmRvbU51bWJlciA9IChtaW4gPSAwLCBtYXggPSAxKSA9PiBtaW4gKyBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbik7XG5cbmNvbnN0IGNyZWF0ZVBlcmNlaXZlZFBlcmZvcm1hbmNlVXBkYXRlciA9IChcbiAgICBjYixcbiAgICBkdXJhdGlvbiA9IDEwMDAsXG4gICAgb2Zmc2V0ID0gMCxcbiAgICB0aWNrTWluID0gMjUsXG4gICAgdGlja01heCA9IDI1MFxuKSA9PiB7XG4gICAgbGV0IHRpbWVvdXQgPSBudWxsO1xuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKTtcblxuICAgIGNvbnN0IHRpY2sgPSAoKSA9PiB7XG4gICAgICAgIGxldCBydW50aW1lID0gRGF0ZS5ub3coKSAtIHN0YXJ0O1xuICAgICAgICBsZXQgZGVsYXkgPSBnZXRSYW5kb21OdW1iZXIodGlja01pbiwgdGlja01heCk7XG5cbiAgICAgICAgaWYgKHJ1bnRpbWUgKyBkZWxheSA+IGR1cmF0aW9uKSB7XG4gICAgICAgICAgICBkZWxheSA9IHJ1bnRpbWUgKyBkZWxheSAtIGR1cmF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHByb2dyZXNzID0gcnVudGltZSAvIGR1cmF0aW9uO1xuICAgICAgICBpZiAocHJvZ3Jlc3MgPj0gMSB8fCBkb2N1bWVudC5oaWRkZW4pIHtcbiAgICAgICAgICAgIGNiKDEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2IocHJvZ3Jlc3MpO1xuXG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KHRpY2ssIGRlbGF5KTtcbiAgICB9O1xuXG4gICAgaWYgKGR1cmF0aW9uID4gMCkgdGljaygpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2xlYXI6ICgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgfSxcbiAgICB9O1xufTtcblxuY29uc3QgY3JlYXRlRmlsZVByb2Nlc3NvciA9IChwcm9jZXNzRm4sIG9wdGlvbnMpID0+IHtcbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgY29tcGxldGU6IGZhbHNlLFxuICAgICAgICBwZXJjZWl2ZWRQcm9ncmVzczogMCxcbiAgICAgICAgcGVyY2VpdmVkUGVyZm9ybWFuY2VVcGRhdGVyOiBudWxsLFxuICAgICAgICBwcm9ncmVzczogbnVsbCxcbiAgICAgICAgdGltZXN0YW1wOiBudWxsLFxuICAgICAgICBwZXJjZWl2ZWREdXJhdGlvbjogMCxcbiAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgIHJlcXVlc3Q6IG51bGwsXG4gICAgICAgIHJlc3BvbnNlOiBudWxsLFxuICAgIH07XG5cbiAgICBjb25zdCB7IGFsbG93TWluaW11bVVwbG9hZER1cmF0aW9uIH0gPSBvcHRpb25zO1xuXG4gICAgY29uc3QgcHJvY2VzcyA9IChmaWxlLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICBjb25zdCBwcm9ncmVzc0ZuID0gKCkgPT4ge1xuICAgICAgICAgICAgLy8gd2UndmUgbm90IHlldCBzdGFydGVkIHRoZSByZWFsIGRvd25sb2FkLCBzdG9wIGhlcmVcbiAgICAgICAgICAgIC8vIHRoZSByZXF1ZXN0IG1pZ2h0IG5vdCBnbyB0aHJvdWdoLCBmb3IgaW5zdGFuY2UsIHRoZXJlIG1pZ2h0IGJlIHNvbWUgc2VydmVyIHRyb3VibGVcbiAgICAgICAgICAgIC8vIGlmIHN0YXRlLnByb2dyZXNzIGlzIG51bGwsIHRoZSBzZXJ2ZXIgZG9lcyBub3QgYWxsb3cgY29tcHV0aW5nIHByb2dyZXNzIGFuZCB3ZSBzaG93IHRoZSBzcGlubmVyIGluc3RlYWRcbiAgICAgICAgICAgIGlmIChzdGF0ZS5kdXJhdGlvbiA9PT0gMCB8fCBzdGF0ZS5wcm9ncmVzcyA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBhcyB3ZSdyZSBub3cgcHJvY2Vzc2luZywgZmlyZSB0aGUgcHJvZ3Jlc3MgZXZlbnRcbiAgICAgICAgICAgIGFwaS5maXJlKCdwcm9ncmVzcycsIGFwaS5nZXRQcm9ncmVzcygpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjb21wbGV0ZUZuID0gKCkgPT4ge1xuICAgICAgICAgICAgc3RhdGUuY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgYXBpLmZpcmUoJ2xvYWQtcGVyY2VpdmVkJywgc3RhdGUucmVzcG9uc2UuYm9keSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gbGV0J3Mgc3RhcnQgcHJvY2Vzc2luZ1xuICAgICAgICBhcGkuZmlyZSgnc3RhcnQnKTtcblxuICAgICAgICAvLyBzZXQgcmVxdWVzdCBzdGFydFxuICAgICAgICBzdGF0ZS50aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBwZXJjZWl2ZWQgcGVyZm9ybWFuY2UgcHJvZ3Jlc3MgaW5kaWNhdG9yXG4gICAgICAgIHN0YXRlLnBlcmNlaXZlZFBlcmZvcm1hbmNlVXBkYXRlciA9IGNyZWF0ZVBlcmNlaXZlZFBlcmZvcm1hbmNlVXBkYXRlcihcbiAgICAgICAgICAgIHByb2dyZXNzID0+IHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5wZXJjZWl2ZWRQcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgICAgICAgICAgICAgIHN0YXRlLnBlcmNlaXZlZER1cmF0aW9uID0gRGF0ZS5ub3coKSAtIHN0YXRlLnRpbWVzdGFtcDtcblxuICAgICAgICAgICAgICAgIHByb2dyZXNzRm4oKTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIGZha2UgcHJvZ3Jlc3MgaXMgZG9uZSwgYW5kIGEgcmVzcG9uc2UgaGFzIGJlZW4gcmVjZWl2ZWQsXG4gICAgICAgICAgICAgICAgLy8gYW5kIHdlJ3ZlIG5vdCB5ZXQgY2FsbGVkIHRoZSBjb21wbGV0ZSBtZXRob2RcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUucmVzcG9uc2UgJiYgc3RhdGUucGVyY2VpdmVkUHJvZ3Jlc3MgPT09IDEgJiYgIXN0YXRlLmNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGRvbmUhXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlRm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gcmFuZG9tIGRlbGF5IGFzIGluIGEgbGlzdCBvZiBmaWxlcyB5b3Ugc3RhcnQgbm90aWNpbmdcbiAgICAgICAgICAgIC8vIGZpbGVzIHVwbG9hZGluZyBhdCB0aGUgZXhhY3Qgc2FtZSBzcGVlZFxuICAgICAgICAgICAgYWxsb3dNaW5pbXVtVXBsb2FkRHVyYXRpb24gPyBnZXRSYW5kb21OdW1iZXIoNzUwLCAxNTAwKSA6IDBcbiAgICAgICAgKTtcblxuICAgICAgICAvLyByZW1lbWJlciByZXF1ZXN0IHNvIHdlIGNhbiBhYm9ydCBpdCBsYXRlclxuICAgICAgICBzdGF0ZS5yZXF1ZXN0ID0gcHJvY2Vzc0ZuKFxuICAgICAgICAgICAgLy8gdGhlIGZpbGUgdG8gcHJvY2Vzc1xuICAgICAgICAgICAgZmlsZSxcblxuICAgICAgICAgICAgLy8gdGhlIG1ldGFkYXRhIHRvIHNlbmQgYWxvbmdcbiAgICAgICAgICAgIG1ldGFkYXRhLFxuXG4gICAgICAgICAgICAvLyBjYWxsYmFja3MgKGxvYWQsIGVycm9yLCBwcm9ncmVzcywgYWJvcnQsIHRyYW5zZmVyKVxuICAgICAgICAgICAgLy8gbG9hZCBleHBlY3RzIHRoZSBib2R5IHRvIGJlIGEgc2VydmVyIGlkIGlmXG4gICAgICAgICAgICAvLyB5b3Ugd2FudCB0byBtYWtlIHVzZSBvZiByZXZlcnRcbiAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAvLyB3ZSBwdXQgdGhlIHJlc3BvbnNlIGluIHN0YXRlIHNvIHdlIGNhbiBhY2Nlc3NcbiAgICAgICAgICAgICAgICAvLyBpdCBvdXRzaWRlIG9mIHRoaXMgbWV0aG9kXG4gICAgICAgICAgICAgICAgc3RhdGUucmVzcG9uc2UgPSBpc09iamVjdChyZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgPyByZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2xvYWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IGAke3Jlc3BvbnNlfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZHVyYXRpb25cbiAgICAgICAgICAgICAgICBzdGF0ZS5kdXJhdGlvbiA9IERhdGUubm93KCkgLSBzdGF0ZS50aW1lc3RhbXA7XG5cbiAgICAgICAgICAgICAgICAvLyBmb3JjZSBwcm9ncmVzcyB0byAxIGFzIHdlJ3JlIG5vdyBkb25lXG4gICAgICAgICAgICAgICAgc3RhdGUucHJvZ3Jlc3MgPSAxO1xuXG4gICAgICAgICAgICAgICAgLy8gYWN0dWFsIGxvYWQgaXMgZG9uZSBsZXQncyBzaGFyZSByZXN1bHRzXG4gICAgICAgICAgICAgICAgYXBpLmZpcmUoJ2xvYWQnLCBzdGF0ZS5yZXNwb25zZS5ib2R5KTtcblxuICAgICAgICAgICAgICAgIC8vIHdlIGFyZSByZWFsbHkgZG9uZVxuICAgICAgICAgICAgICAgIC8vIGlmIHBlcmNlaXZlZCBwcm9ncmVzcyBpcyAxICggd2FpdCBmb3IgcGVyY2VpdmVkIHByb2dyZXNzIHRvIGNvbXBsZXRlIClcbiAgICAgICAgICAgICAgICAvLyBvciBpZiBzZXJ2ZXIgZG9lcyBub3Qgc3VwcG9ydCBwcm9ncmVzcyAoIG51bGwgKVxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgIWFsbG93TWluaW11bVVwbG9hZER1cmF0aW9uIHx8XG4gICAgICAgICAgICAgICAgICAgIChhbGxvd01pbmltdW1VcGxvYWREdXJhdGlvbiAmJiBzdGF0ZS5wZXJjZWl2ZWRQcm9ncmVzcyA9PT0gMSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVGbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIGVycm9yIGlzIGV4cGVjdGVkIHRvIGJlIGFuIG9iamVjdCB3aXRoIHR5cGUsIGNvZGUsIGJvZHlcbiAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjYW5jZWwgdXBkYXRlclxuICAgICAgICAgICAgICAgIHN0YXRlLnBlcmNlaXZlZFBlcmZvcm1hbmNlVXBkYXRlci5jbGVhcigpO1xuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIG90aGVycyBhYm91dCB0aGlzIGVycm9yXG4gICAgICAgICAgICAgICAgYXBpLmZpcmUoXG4gICAgICAgICAgICAgICAgICAgICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgIGlzT2JqZWN0KGVycm9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IGAke2Vycm9yfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gYWN0dWFsIHByb2Nlc3NpbmcgcHJvZ3Jlc3NcbiAgICAgICAgICAgIChjb21wdXRhYmxlLCBjdXJyZW50LCB0b3RhbCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBhY3R1YWwgZHVyYXRpb25cbiAgICAgICAgICAgICAgICBzdGF0ZS5kdXJhdGlvbiA9IERhdGUubm93KCkgLSBzdGF0ZS50aW1lc3RhbXA7XG5cbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgYWN0dWFsIHByb2dyZXNzXG4gICAgICAgICAgICAgICAgc3RhdGUucHJvZ3Jlc3MgPSBjb21wdXRhYmxlID8gY3VycmVudCAvIHRvdGFsIDogbnVsbDtcblxuICAgICAgICAgICAgICAgIHByb2dyZXNzRm4oKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIGFib3J0IGRvZXMgbm90IGV4cGVjdCBhIHZhbHVlXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gc3RvcCB1cGRhdGVyXG4gICAgICAgICAgICAgICAgc3RhdGUucGVyY2VpdmVkUGVyZm9ybWFuY2VVcGRhdGVyLmNsZWFyKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBmaXJlIHRoZSBhYm9ydCBldmVudCBzbyB3ZSBjYW4gc3dpdGNoIHZpc3VhbHNcbiAgICAgICAgICAgICAgICBhcGkuZmlyZSgnYWJvcnQnLCBzdGF0ZS5yZXNwb25zZSA/IHN0YXRlLnJlc3BvbnNlLmJvZHkgOiBudWxsKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIHRoZSBpZCBmb3IgdGhpcyB0cmFuc2ZlclxuICAgICAgICAgICAgdHJhbnNmZXJJZCA9PiB7XG4gICAgICAgICAgICAgICAgYXBpLmZpcmUoJ3RyYW5zZmVyJywgdHJhbnNmZXJJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFib3J0ID0gKCkgPT4ge1xuICAgICAgICAvLyBubyByZXF1ZXN0IHJ1bm5pbmcsIGNhbid0IGFib3J0XG4gICAgICAgIGlmICghc3RhdGUucmVxdWVzdCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIHN0b3AgdXBkYXRlclxuICAgICAgICBzdGF0ZS5wZXJjZWl2ZWRQZXJmb3JtYW5jZVVwZGF0ZXIuY2xlYXIoKTtcblxuICAgICAgICAvLyBhYm9ydCBhY3R1YWwgcmVxdWVzdFxuICAgICAgICBpZiAoc3RhdGUucmVxdWVzdC5hYm9ydCkgc3RhdGUucmVxdWVzdC5hYm9ydCgpO1xuXG4gICAgICAgIC8vIGlmIGhhcyByZXNwb25zZSBvYmplY3QsIHdlJ3ZlIGNvbXBsZXRlZCB0aGUgcmVxdWVzdFxuICAgICAgICBzdGF0ZS5jb21wbGV0ZSA9IHRydWU7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlc2V0ID0gKCkgPT4ge1xuICAgICAgICBhYm9ydCgpO1xuICAgICAgICBzdGF0ZS5jb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICBzdGF0ZS5wZXJjZWl2ZWRQcm9ncmVzcyA9IDA7XG4gICAgICAgIHN0YXRlLnByb2dyZXNzID0gMDtcbiAgICAgICAgc3RhdGUudGltZXN0YW1wID0gbnVsbDtcbiAgICAgICAgc3RhdGUucGVyY2VpdmVkRHVyYXRpb24gPSAwO1xuICAgICAgICBzdGF0ZS5kdXJhdGlvbiA9IDA7XG4gICAgICAgIHN0YXRlLnJlcXVlc3QgPSBudWxsO1xuICAgICAgICBzdGF0ZS5yZXNwb25zZSA9IG51bGw7XG4gICAgfTtcblxuICAgIGNvbnN0IGdldFByb2dyZXNzID0gYWxsb3dNaW5pbXVtVXBsb2FkRHVyYXRpb25cbiAgICAgICAgPyAoKSA9PiAoc3RhdGUucHJvZ3Jlc3MgPyBNYXRoLm1pbihzdGF0ZS5wcm9ncmVzcywgc3RhdGUucGVyY2VpdmVkUHJvZ3Jlc3MpIDogbnVsbClcbiAgICAgICAgOiAoKSA9PiBzdGF0ZS5wcm9ncmVzcyB8fCBudWxsO1xuXG4gICAgY29uc3QgZ2V0RHVyYXRpb24gPSBhbGxvd01pbmltdW1VcGxvYWREdXJhdGlvblxuICAgICAgICA/ICgpID0+IE1hdGgubWluKHN0YXRlLmR1cmF0aW9uLCBzdGF0ZS5wZXJjZWl2ZWREdXJhdGlvbilcbiAgICAgICAgOiAoKSA9PiBzdGF0ZS5kdXJhdGlvbjtcblxuICAgIGNvbnN0IGFwaSA9IHtcbiAgICAgICAgLi4ub24oKSxcbiAgICAgICAgcHJvY2VzcywgLy8gc3RhcnQgcHJvY2Vzc2luZyBmaWxlXG4gICAgICAgIGFib3J0LCAvLyBhYm9ydCBhY3RpdmUgcHJvY2VzcyByZXF1ZXN0XG4gICAgICAgIGdldFByb2dyZXNzLFxuICAgICAgICBnZXREdXJhdGlvbixcbiAgICAgICAgcmVzZXQsXG4gICAgfTtcblxuICAgIHJldHVybiBhcGk7XG59O1xuXG5jb25zdCBnZXRGaWxlbmFtZVdpdGhvdXRFeHRlbnNpb24gPSBuYW1lID0+IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUubGFzdEluZGV4T2YoJy4nKSkgfHwgbmFtZTtcblxuY29uc3QgY3JlYXRlRmlsZVN0dWIgPSBzb3VyY2UgPT4ge1xuICAgIGxldCBkYXRhID0gW3NvdXJjZS5uYW1lLCBzb3VyY2Uuc2l6ZSwgc291cmNlLnR5cGVdO1xuXG4gICAgLy8gaXMgYmxvYiBvciBiYXNlNjQsIHRoZW4gd2UgbmVlZCB0byBzZXQgdGhlIG5hbWVcbiAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgQmxvYiB8fCBpc0Jhc2U2NERhdGFVUkkoc291cmNlKSkge1xuICAgICAgICBkYXRhWzBdID0gc291cmNlLm5hbWUgfHwgZ2V0RGF0ZVN0cmluZygpO1xuICAgIH0gZWxzZSBpZiAoaXNCYXNlNjREYXRhVVJJKHNvdXJjZSkpIHtcbiAgICAgICAgLy8gaWYgaXMgYmFzZTY0IGRhdGEgdXJpIHdlIG5lZWQgdG8gZGV0ZXJtaW5lIHRoZSBhdmVyYWdlIHNpemUgYW5kIHR5cGVcbiAgICAgICAgZGF0YVsxXSA9IHNvdXJjZS5sZW5ndGg7XG4gICAgICAgIGRhdGFbMl0gPSBnZXRNaW1lVHlwZUZyb21CYXNlNjREYXRhVVJJKHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmIChpc1N0cmluZyhzb3VyY2UpKSB7XG4gICAgICAgIC8vIHVybFxuICAgICAgICBkYXRhWzBdID0gZ2V0RmlsZW5hbWVGcm9tVVJMKHNvdXJjZSk7XG4gICAgICAgIGRhdGFbMV0gPSAwO1xuICAgICAgICBkYXRhWzJdID0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogZGF0YVswXSxcbiAgICAgICAgc2l6ZTogZGF0YVsxXSxcbiAgICAgICAgdHlwZTogZGF0YVsyXSxcbiAgICB9O1xufTtcblxuY29uc3QgaXNGaWxlID0gdmFsdWUgPT4gISEodmFsdWUgaW5zdGFuY2VvZiBGaWxlIHx8ICh2YWx1ZSBpbnN0YW5jZW9mIEJsb2IgJiYgdmFsdWUubmFtZSkpO1xuXG5jb25zdCBkZWVwQ2xvbmVPYmplY3QgPSBzcmMgPT4ge1xuICAgIGlmICghaXNPYmplY3Qoc3JjKSkgcmV0dXJuIHNyYztcbiAgICBjb25zdCB0YXJnZXQgPSBpc0FycmF5KHNyYykgPyBbXSA6IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIHNyYykge1xuICAgICAgICBpZiAoIXNyYy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgdiA9IHNyY1trZXldO1xuICAgICAgICB0YXJnZXRba2V5XSA9IHYgJiYgaXNPYmplY3QodikgPyBkZWVwQ2xvbmVPYmplY3QodikgOiB2O1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcblxuY29uc3QgY3JlYXRlSXRlbSA9IChvcmlnaW4gPSBudWxsLCBzZXJ2ZXJGaWxlUmVmZXJlbmNlID0gbnVsbCwgZmlsZSA9IG51bGwpID0+IHtcbiAgICAvLyB1bmlxdWUgaWQgZm9yIHRoaXMgaXRlbSwgaXMgdXNlZCB0byBpZGVudGlmeSB0aGUgaXRlbSBhY3Jvc3Mgdmlld3NcbiAgICBjb25zdCBpZCA9IGdldFVuaXF1ZUlkKCk7XG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBpdGVtIHN0YXRlXG4gICAgICovXG4gICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICAgIC8vIGlzIGFyY2hpdmVkXG4gICAgICAgIGFyY2hpdmVkOiBmYWxzZSxcblxuICAgICAgICAvLyBpZiBpcyBmcm96ZW4sIG5vIGxvbmdlciBmaXJlcyBldmVudHNcbiAgICAgICAgZnJvemVuOiBmYWxzZSxcblxuICAgICAgICAvLyByZW1vdmVkIGZyb20gdmlld1xuICAgICAgICByZWxlYXNlZDogZmFsc2UsXG5cbiAgICAgICAgLy8gb3JpZ2luYWwgc291cmNlXG4gICAgICAgIHNvdXJjZTogbnVsbCxcblxuICAgICAgICAvLyBmaWxlIG1vZGVsIHJlZmVyZW5jZVxuICAgICAgICBmaWxlLFxuXG4gICAgICAgIC8vIGlkIG9mIGZpbGUgb24gc2VydmVyXG4gICAgICAgIHNlcnZlckZpbGVSZWZlcmVuY2UsXG5cbiAgICAgICAgLy8gaWQgb2YgZmlsZSB0cmFuc2ZlciBvbiBzZXJ2ZXJcbiAgICAgICAgdHJhbnNmZXJJZDogbnVsbCxcblxuICAgICAgICAvLyBpcyBhYm9ydGVkXG4gICAgICAgIHByb2Nlc3NpbmdBYm9ydGVkOiBmYWxzZSxcblxuICAgICAgICAvLyBjdXJyZW50IGl0ZW0gc3RhdHVzXG4gICAgICAgIHN0YXR1czogc2VydmVyRmlsZVJlZmVyZW5jZSA/IEl0ZW1TdGF0dXMuUFJPQ0VTU0lOR19DT01QTEVURSA6IEl0ZW1TdGF0dXMuSU5JVCxcblxuICAgICAgICAvLyBhY3RpdmUgcHJvY2Vzc2VzXG4gICAgICAgIGFjdGl2ZUxvYWRlcjogbnVsbCxcbiAgICAgICAgYWN0aXZlUHJvY2Vzc29yOiBudWxsLFxuICAgIH07XG5cbiAgICAvLyBjYWxsYmFjayB1c2VkIHdoZW4gYWJvcnQgcHJvY2Vzc2luZyBpcyBjYWxsZWQgdG8gbGluayBiYWNrIHRvIHRoZSByZXNvbHZlIG1ldGhvZFxuICAgIGxldCBhYm9ydFByb2Nlc3NpbmdSZXF1ZXN0Q29tcGxldGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRXh0ZXJuYWxseSBhZGRlZCBpdGVtIG1ldGFkYXRhXG4gICAgICovXG4gICAgY29uc3QgbWV0YWRhdGEgPSB7fTtcblxuICAgIC8vIGl0ZW0gZGF0YVxuICAgIGNvbnN0IHNldFN0YXR1cyA9IHN0YXR1cyA9PiAoc3RhdGUuc3RhdHVzID0gc3RhdHVzKTtcblxuICAgIC8vIGZpcmUgZXZlbnQgdW5sZXNzIHRoZSBpdGVtIGhhcyBiZWVuIGFyY2hpdmVkXG4gICAgY29uc3QgZmlyZSA9IChldmVudCwgLi4ucGFyYW1zKSA9PiB7XG4gICAgICAgIGlmIChzdGF0ZS5yZWxlYXNlZCB8fCBzdGF0ZS5mcm96ZW4pIHJldHVybjtcbiAgICAgICAgYXBpLmZpcmUoZXZlbnQsIC4uLnBhcmFtcyk7XG4gICAgfTtcblxuICAgIC8vIGZpbGUgZGF0YVxuICAgIGNvbnN0IGdldEZpbGVFeHRlbnNpb24gPSAoKSA9PiBnZXRFeHRlbnNpb25Gcm9tRmlsZW5hbWUoc3RhdGUuZmlsZS5uYW1lKTtcbiAgICBjb25zdCBnZXRGaWxlVHlwZSA9ICgpID0+IHN0YXRlLmZpbGUudHlwZTtcbiAgICBjb25zdCBnZXRGaWxlU2l6ZSA9ICgpID0+IHN0YXRlLmZpbGUuc2l6ZTtcbiAgICBjb25zdCBnZXRGaWxlID0gKCkgPT4gc3RhdGUuZmlsZTtcblxuICAgIC8vXG4gICAgLy8gbG9naWMgdG8gbG9hZCBhIGZpbGVcbiAgICAvL1xuICAgIGNvbnN0IGxvYWQgPSAoc291cmNlLCBsb2FkZXIsIG9ubG9hZCkgPT4ge1xuICAgICAgICAvLyByZW1lbWJlciB0aGUgb3JpZ2luYWwgaXRlbSBzb3VyY2VcbiAgICAgICAgc3RhdGUuc291cmNlID0gc291cmNlO1xuXG4gICAgICAgIC8vIHNvdXJjZSBpcyBrbm93blxuICAgICAgICBhcGkuZmlyZVN5bmMoJ2luaXQnKTtcblxuICAgICAgICAvLyBmaWxlIHN0dWIgaXMgYWxyZWFkeSB0aGVyZVxuICAgICAgICBpZiAoc3RhdGUuZmlsZSkge1xuICAgICAgICAgICAgYXBpLmZpcmVTeW5jKCdsb2FkLXNraXAnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNldCBhIHN0dWIgZmlsZSBvYmplY3Qgd2hpbGUgbG9hZGluZyB0aGUgYWN0dWFsIGRhdGFcbiAgICAgICAgc3RhdGUuZmlsZSA9IGNyZWF0ZUZpbGVTdHViKHNvdXJjZSk7XG5cbiAgICAgICAgLy8gc3RhcnRzIGxvYWRpbmdcbiAgICAgICAgbG9hZGVyLm9uKCdpbml0JywgKCkgPT4ge1xuICAgICAgICAgICAgZmlyZSgnbG9hZC1pbml0Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHdlJ2V2ZSByZWNlaXZlZCBhIHNpemUgaW5kaWNhdGlvbiwgbGV0J3MgdXBkYXRlIHRoZSBzdHViXG4gICAgICAgIGxvYWRlci5vbignbWV0YScsIG1ldGEgPT4ge1xuICAgICAgICAgICAgLy8gc2V0IHNpemUgb2YgZmlsZSBzdHViXG4gICAgICAgICAgICBzdGF0ZS5maWxlLnNpemUgPSBtZXRhLnNpemU7XG5cbiAgICAgICAgICAgIC8vIHNldCBuYW1lIG9mIGZpbGUgc3R1YlxuICAgICAgICAgICAgc3RhdGUuZmlsZS5maWxlbmFtZSA9IG1ldGEuZmlsZW5hbWU7XG5cbiAgICAgICAgICAgIC8vIGlmIGhhcyByZWNlaXZlZCBzb3VyY2UsIHdlIGRvbmVcbiAgICAgICAgICAgIGlmIChtZXRhLnNvdXJjZSkge1xuICAgICAgICAgICAgICAgIG9yaWdpbiA9IEZpbGVPcmlnaW4uTElNQk87XG4gICAgICAgICAgICAgICAgc3RhdGUuc2VydmVyRmlsZVJlZmVyZW5jZSA9IG1ldGEuc291cmNlO1xuICAgICAgICAgICAgICAgIHN0YXRlLnN0YXR1cyA9IEl0ZW1TdGF0dXMuUFJPQ0VTU0lOR19DT01QTEVURTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2l6ZSBoYXMgYmVlbiB1cGRhdGVkXG4gICAgICAgICAgICBmaXJlKCdsb2FkLW1ldGEnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gdGhlIGZpbGUgaXMgbm93IGxvYWRpbmcgd2UgbmVlZCB0byB1cGRhdGUgdGhlIHByb2dyZXNzIGluZGljYXRvcnNcbiAgICAgICAgbG9hZGVyLm9uKCdwcm9ncmVzcycsIHByb2dyZXNzID0+IHtcbiAgICAgICAgICAgIHNldFN0YXR1cyhJdGVtU3RhdHVzLkxPQURJTkcpO1xuXG4gICAgICAgICAgICBmaXJlKCdsb2FkLXByb2dyZXNzJywgcHJvZ3Jlc3MpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBhbiBlcnJvciB3YXMgdGhyb3duIHdoaWxlIGxvYWRpbmcgdGhlIGZpbGUsIHdlIG5lZWQgdG8gc3dpdGNoIHRvIGVycm9yIHN0YXRlXG4gICAgICAgIGxvYWRlci5vbignZXJyb3InLCBlcnJvciA9PiB7XG4gICAgICAgICAgICBzZXRTdGF0dXMoSXRlbVN0YXR1cy5MT0FEX0VSUk9SKTtcblxuICAgICAgICAgICAgZmlyZSgnbG9hZC1yZXF1ZXN0LWVycm9yJywgZXJyb3IpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyB1c2VyIG9yIGFub3RoZXIgcHJvY2VzcyBhYm9ydGVkIHRoZSBmaWxlIGxvYWQgKGNhbm5vdCByZXRyeSlcbiAgICAgICAgbG9hZGVyLm9uKCdhYm9ydCcsICgpID0+IHtcbiAgICAgICAgICAgIHNldFN0YXR1cyhJdGVtU3RhdHVzLklOSVQpO1xuICAgICAgICAgICAgZmlyZSgnbG9hZC1hYm9ydCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBkb25lIGxvYWRpbmdcbiAgICAgICAgbG9hZGVyLm9uKCdsb2FkJywgZmlsZSA9PiB7XG4gICAgICAgICAgICAvLyBhcyB3ZSd2ZSBub3cgbG9hZGVkIHRoZSBmaWxlIHRoZSBsb2FkZXIgaXMgbm8gbG9uZ2VyIHJlcXVpcmVkXG4gICAgICAgICAgICBzdGF0ZS5hY3RpdmVMb2FkZXIgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBjYWxsZWQgd2hlbiBmaWxlIGhhcyBsb2FkZWQgc3VjY2VzZnVsbHlcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSByZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHNldCAocG9zc2libHkpIHRyYW5zZm9ybWVkIGZpbGVcbiAgICAgICAgICAgICAgICBzdGF0ZS5maWxlID0gaXNGaWxlKHJlc3VsdCkgPyByZXN1bHQgOiBzdGF0ZS5maWxlO1xuXG4gICAgICAgICAgICAgICAgLy8gZmlsZSByZWNlaXZlZFxuICAgICAgICAgICAgICAgIGlmIChvcmlnaW4gPT09IEZpbGVPcmlnaW4uTElNQk8gJiYgc3RhdGUuc2VydmVyRmlsZVJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRTdGF0dXMoSXRlbVN0YXR1cy5QUk9DRVNTSU5HX0NPTVBMRVRFKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXRTdGF0dXMoSXRlbVN0YXR1cy5JRExFKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmaXJlKCdsb2FkJyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IG9yaWdpbmFsIGZpbGVcbiAgICAgICAgICAgICAgICBzdGF0ZS5maWxlID0gZmlsZTtcbiAgICAgICAgICAgICAgICBmaXJlKCdsb2FkLW1ldGEnKTtcblxuICAgICAgICAgICAgICAgIHNldFN0YXR1cyhJdGVtU3RhdHVzLkxPQURfRVJST1IpO1xuICAgICAgICAgICAgICAgIGZpcmUoJ2xvYWQtZmlsZS1lcnJvcicsIHJlc3VsdCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBpZiB3ZSBhbHJlYWR5IGhhdmUgYSBzZXJ2ZXIgZmlsZSByZWZlcmVuY2UsIHdlIGRvbid0IG5lZWQgdG8gY2FsbCB0aGUgb25sb2FkIG1ldGhvZFxuICAgICAgICAgICAgaWYgKHN0YXRlLnNlcnZlckZpbGVSZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzKGZpbGUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbm8gc2VydmVyIGlkLCBsZXQncyBnaXZlIHRoaXMgZmlsZSB0aGUgZnVsbCB0cmVhdG1lbnRcbiAgICAgICAgICAgIG9ubG9hZChmaWxlLCBzdWNjZXNzLCBlcnJvcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNldCBsb2FkZXIgc291cmNlIGRhdGFcbiAgICAgICAgbG9hZGVyLnNldFNvdXJjZShzb3VyY2UpO1xuXG4gICAgICAgIC8vIHNldCBhcyBhY3RpdmUgbG9hZGVyXG4gICAgICAgIHN0YXRlLmFjdGl2ZUxvYWRlciA9IGxvYWRlcjtcblxuICAgICAgICAvLyBsb2FkIHRoZSBzb3VyY2UgZGF0YVxuICAgICAgICBsb2FkZXIubG9hZCgpO1xuICAgIH07XG5cbiAgICBjb25zdCByZXRyeUxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGlmICghc3RhdGUuYWN0aXZlTG9hZGVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUuYWN0aXZlTG9hZGVyLmxvYWQoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgYWJvcnRMb2FkID0gKCkgPT4ge1xuICAgICAgICBpZiAoc3RhdGUuYWN0aXZlTG9hZGVyKSB7XG4gICAgICAgICAgICBzdGF0ZS5hY3RpdmVMb2FkZXIuYWJvcnQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZXRTdGF0dXMoSXRlbVN0YXR1cy5JTklUKTtcbiAgICAgICAgZmlyZSgnbG9hZC1hYm9ydCcpO1xuICAgIH07XG5cbiAgICAvL1xuICAgIC8vIGxvZ2ljIHRvIHByb2Nlc3MgYSBmaWxlXG4gICAgLy9cbiAgICBjb25zdCBwcm9jZXNzID0gKHByb2Nlc3Nvciwgb25wcm9jZXNzKSA9PiB7XG4gICAgICAgIC8vIHByb2Nlc3Npbmcgd2FzIGFib3J0ZWRcbiAgICAgICAgaWYgKHN0YXRlLnByb2Nlc3NpbmdBYm9ydGVkKSB7XG4gICAgICAgICAgICBzdGF0ZS5wcm9jZXNzaW5nQWJvcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm93IHByb2Nlc3NpbmdcbiAgICAgICAgc2V0U3RhdHVzKEl0ZW1TdGF0dXMuUFJPQ0VTU0lORyk7XG5cbiAgICAgICAgLy8gcmVzZXQgYWJvcnQgY2FsbGJhY2tcbiAgICAgICAgYWJvcnRQcm9jZXNzaW5nUmVxdWVzdENvbXBsZXRlID0gbnVsbDtcblxuICAgICAgICAvLyBpZiBubyBmaWxlIGxvYWRlZCB3ZSdsbCB3YWl0IGZvciB0aGUgbG9hZCBldmVudFxuICAgICAgICBpZiAoIShzdGF0ZS5maWxlIGluc3RhbmNlb2YgQmxvYikpIHtcbiAgICAgICAgICAgIGFwaS5vbignbG9hZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzKHByb2Nlc3Nvciwgb25wcm9jZXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0dXAgcHJvY2Vzc29yXG4gICAgICAgIHByb2Nlc3Nvci5vbignbG9hZCcsIHNlcnZlckZpbGVSZWZlcmVuY2UgPT4ge1xuICAgICAgICAgICAgLy8gbmVlZCB0aGlzIGlkIHRvIGJlIGFibGUgdG8gcmV2ZXJ0IHRoZSB1cGxvYWRcbiAgICAgICAgICAgIHN0YXRlLnRyYW5zZmVySWQgPSBudWxsO1xuICAgICAgICAgICAgc3RhdGUuc2VydmVyRmlsZVJlZmVyZW5jZSA9IHNlcnZlckZpbGVSZWZlcmVuY2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJlZ2lzdGVyIHRyYW5zZmVyIGlkXG4gICAgICAgIHByb2Nlc3Nvci5vbigndHJhbnNmZXInLCB0cmFuc2ZlcklkID0+IHtcbiAgICAgICAgICAgIC8vIG5lZWQgdGhpcyBpZCB0byBiZSBhYmxlIHRvIHJldmVydCB0aGUgdXBsb2FkXG4gICAgICAgICAgICBzdGF0ZS50cmFuc2ZlcklkID0gdHJhbnNmZXJJZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJvY2Vzc29yLm9uKCdsb2FkLXBlcmNlaXZlZCcsIHNlcnZlckZpbGVSZWZlcmVuY2UgPT4ge1xuICAgICAgICAgICAgLy8gbm8gbG9uZ2VyIHJlcXVpcmVkXG4gICAgICAgICAgICBzdGF0ZS5hY3RpdmVQcm9jZXNzb3IgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBuZWVkIHRoaXMgaWQgdG8gYmUgYWJsZSB0byByZXZlciB0aGUgdXBsb2FkXG4gICAgICAgICAgICBzdGF0ZS50cmFuc2ZlcklkID0gbnVsbDtcbiAgICAgICAgICAgIHN0YXRlLnNlcnZlckZpbGVSZWZlcmVuY2UgPSBzZXJ2ZXJGaWxlUmVmZXJlbmNlO1xuXG4gICAgICAgICAgICBzZXRTdGF0dXMoSXRlbVN0YXR1cy5QUk9DRVNTSU5HX0NPTVBMRVRFKTtcbiAgICAgICAgICAgIGZpcmUoJ3Byb2Nlc3MtY29tcGxldGUnLCBzZXJ2ZXJGaWxlUmVmZXJlbmNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJvY2Vzc29yLm9uKCdzdGFydCcsICgpID0+IHtcbiAgICAgICAgICAgIGZpcmUoJ3Byb2Nlc3Mtc3RhcnQnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJvY2Vzc29yLm9uKCdlcnJvcicsIGVycm9yID0+IHtcbiAgICAgICAgICAgIHN0YXRlLmFjdGl2ZVByb2Nlc3NvciA9IG51bGw7XG4gICAgICAgICAgICBzZXRTdGF0dXMoSXRlbVN0YXR1cy5QUk9DRVNTSU5HX0VSUk9SKTtcbiAgICAgICAgICAgIGZpcmUoJ3Byb2Nlc3MtZXJyb3InLCBlcnJvcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHByb2Nlc3Nvci5vbignYWJvcnQnLCBzZXJ2ZXJGaWxlUmVmZXJlbmNlID0+IHtcbiAgICAgICAgICAgIHN0YXRlLmFjdGl2ZVByb2Nlc3NvciA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIGlmIGZpbGUgd2FzIHVwbG9hZGVkIGJ1dCBwcm9jZXNzaW5nIHdhcyBjYW5jZWxsZWQgZHVyaW5nIHBlcmNlaXZlZCBwcm9jZXNzb3IgdGltZSBzdG9yZSBmaWxlIHJlZmVyZW5jZVxuICAgICAgICAgICAgc3RhdGUuc2VydmVyRmlsZVJlZmVyZW5jZSA9IHNlcnZlckZpbGVSZWZlcmVuY2U7XG5cbiAgICAgICAgICAgIHNldFN0YXR1cyhJdGVtU3RhdHVzLklETEUpO1xuICAgICAgICAgICAgZmlyZSgncHJvY2Vzcy1hYm9ydCcpO1xuXG4gICAgICAgICAgICAvLyBoYXMgdGltZW91dCBzbyBkb2Vzbid0IGludGVyZmVyZSB3aXRoIHJlbW92ZSBhY3Rpb25cbiAgICAgICAgICAgIGlmIChhYm9ydFByb2Nlc3NpbmdSZXF1ZXN0Q29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICBhYm9ydFByb2Nlc3NpbmdSZXF1ZXN0Q29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJvY2Vzc29yLm9uKCdwcm9ncmVzcycsIHByb2dyZXNzID0+IHtcbiAgICAgICAgICAgIGZpcmUoJ3Byb2Nlc3MtcHJvZ3Jlc3MnLCBwcm9ncmVzcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHdoZW4gc3VjY2Vzc2Z1bGx5IHRyYW5zZm9ybWVkXG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBmaWxlID0+IHtcbiAgICAgICAgICAgIC8vIGlmIHdhcyBhcmNoaXZlZCBpbiB0aGUgbWVhbiB0aW1lLCBkb24ndCBwcm9jZXNzXG4gICAgICAgICAgICBpZiAoc3RhdGUuYXJjaGl2ZWQpIHJldHVybjtcblxuICAgICAgICAgICAgLy8gcHJvY2VzcyBmaWxlIVxuICAgICAgICAgICAgcHJvY2Vzc29yLnByb2Nlc3MoZmlsZSwgeyAuLi5tZXRhZGF0YSB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZyBkdXJpbmcgdHJhbnNmb3JtIHBoYXNlXG4gICAgICAgIGNvbnN0IGVycm9yID0gY29uc29sZS5lcnJvcjtcblxuICAgICAgICAvLyBzdGFydCBwcm9jZXNzaW5nIHRoZSBmaWxlXG4gICAgICAgIG9ucHJvY2VzcyhzdGF0ZS5maWxlLCBzdWNjZXNzLCBlcnJvcik7XG5cbiAgICAgICAgLy8gc2V0IGFzIGFjdGl2ZSBwcm9jZXNzb3JcbiAgICAgICAgc3RhdGUuYWN0aXZlUHJvY2Vzc29yID0gcHJvY2Vzc29yO1xuICAgIH07XG5cbiAgICBjb25zdCByZXF1ZXN0UHJvY2Vzc2luZyA9ICgpID0+IHtcbiAgICAgICAgc3RhdGUucHJvY2Vzc2luZ0Fib3J0ZWQgPSBmYWxzZTtcbiAgICAgICAgc2V0U3RhdHVzKEl0ZW1TdGF0dXMuUFJPQ0VTU0lOR19RVUVVRUQpO1xuICAgIH07XG5cbiAgICBjb25zdCBhYm9ydFByb2Nlc3NpbmcgPSAoKSA9PlxuICAgICAgICBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGlmICghc3RhdGUuYWN0aXZlUHJvY2Vzc29yKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUucHJvY2Vzc2luZ0Fib3J0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgc2V0U3RhdHVzKEl0ZW1TdGF0dXMuSURMRSk7XG4gICAgICAgICAgICAgICAgZmlyZSgncHJvY2Vzcy1hYm9ydCcpO1xuXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWJvcnRQcm9jZXNzaW5nUmVxdWVzdENvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHN0YXRlLmFjdGl2ZVByb2Nlc3Nvci5hYm9ydCgpO1xuICAgICAgICB9KTtcblxuICAgIC8vXG4gICAgLy8gbG9naWMgdG8gcmV2ZXJ0IGEgcHJvY2Vzc2VkIGZpbGVcbiAgICAvL1xuICAgIGNvbnN0IHJldmVydCA9IChyZXZlcnRGaWxlVXBsb2FkLCBmb3JjZVJldmVydCkgPT5cbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgLy8gYSBjb21wbGV0ZWQgdXBsb2FkIHdpbGwgaGF2ZSBhIHNlcnZlckZpbGVSZWZlcmVuY2UsIGEgZmFpbGVkIGNodW5rZWQgdXBsb2FkIHdoZXJlXG4gICAgICAgICAgICAvLyBnZXR0aW5nIGEgc2VydmVySWQgc3VjY2VlZGVkIGJ1dCA+PTAgY2h1bmtzIGhhdmUgYmVlbiB1cGxvYWRlZCB3aWxsIGhhdmUgdHJhbnNmZXJJZCBzZXRcbiAgICAgICAgICAgIGNvbnN0IHNlcnZlclRyYW5zZmVySWQgPVxuICAgICAgICAgICAgICAgIHN0YXRlLnNlcnZlckZpbGVSZWZlcmVuY2UgIT09IG51bGwgPyBzdGF0ZS5zZXJ2ZXJGaWxlUmVmZXJlbmNlIDogc3RhdGUudHJhbnNmZXJJZDtcblxuICAgICAgICAgICAgLy8gY2Fubm90IHJldmVydCB3aXRob3V0IGEgc2VydmVyIGlkIGZvciB0aGlzIHByb2Nlc3NcbiAgICAgICAgICAgIGlmIChzZXJ2ZXJUcmFuc2ZlcklkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmV2ZXJ0IHRoZSB1cGxvYWQgKGZpcmUgYW5kIGZvcmdldClcbiAgICAgICAgICAgIHJldmVydEZpbGVVcGxvYWQoXG4gICAgICAgICAgICAgICAgc2VydmVyVHJhbnNmZXJJZCxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc2V0IGZpbGUgc2VydmVyIGlkIGFuZCB0cmFuc2ZlciBpZCBhcyBub3cgaXQncyBub3QgYXZhaWxhYmxlIG9uIHRoZSBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuc2VydmVyRmlsZVJlZmVyZW5jZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnRyYW5zZmVySWQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvbid0IHNldCBlcnJvciBzdGF0ZSB3aGVuIHJldmVydGluZyBpcyBvcHRpb25hbCwgaXQgd2lsbCBhbHdheXMgcmVzb2x2ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvcmNlUmV2ZXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBvaCBubyBlcnJvcnNcbiAgICAgICAgICAgICAgICAgICAgc2V0U3RhdHVzKEl0ZW1TdGF0dXMuUFJPQ0VTU0lOR19SRVZFUlRfRVJST1IpO1xuICAgICAgICAgICAgICAgICAgICBmaXJlKCdwcm9jZXNzLXJldmVydC1lcnJvcicpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIGZpcmUgZXZlbnRcbiAgICAgICAgICAgIHNldFN0YXR1cyhJdGVtU3RhdHVzLklETEUpO1xuICAgICAgICAgICAgZmlyZSgncHJvY2Vzcy1yZXZlcnQnKTtcbiAgICAgICAgfSk7XG5cbiAgICAvLyBleHBvc2VkIG1ldGhvZHNcbiAgICBjb25zdCBzZXRNZXRhZGF0YSA9IChrZXksIHZhbHVlLCBzaWxlbnQpID0+IHtcbiAgICAgICAgY29uc3Qga2V5cyA9IGtleS5zcGxpdCgnLicpO1xuICAgICAgICBjb25zdCByb290ID0ga2V5c1swXTtcbiAgICAgICAgY29uc3QgbGFzdCA9IGtleXMucG9wKCk7XG4gICAgICAgIGxldCBkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgIGtleXMuZm9yRWFjaChrZXkgPT4gKGRhdGEgPSBkYXRhW2tleV0pKTtcblxuICAgICAgICAvLyBjb21wYXJlIG9sZCB2YWx1ZSBhZ2FpbnN0IG5ldyB2YWx1ZSwgaWYgdGhleSdyZSB0aGUgc2FtZSwgd2UncmUgbm90IHVwZGF0aW5nXG4gICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShkYXRhW2xhc3RdKSA9PT0gSlNPTi5zdHJpbmdpZnkodmFsdWUpKSByZXR1cm47XG5cbiAgICAgICAgLy8gdXBkYXRlIHZhbHVlXG4gICAgICAgIGRhdGFbbGFzdF0gPSB2YWx1ZTtcblxuICAgICAgICAvLyBmaXJlIHVwZGF0ZVxuICAgICAgICBmaXJlKCdtZXRhZGF0YS11cGRhdGUnLCB7XG4gICAgICAgICAgICBrZXk6IHJvb3QsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YWRhdGFbcm9vdF0sXG4gICAgICAgICAgICBzaWxlbnQsXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRNZXRhZGF0YSA9IGtleSA9PiBkZWVwQ2xvbmVPYmplY3Qoa2V5ID8gbWV0YWRhdGFba2V5XSA6IG1ldGFkYXRhKTtcblxuICAgIGNvbnN0IGFwaSA9IHtcbiAgICAgICAgaWQ6IHsgZ2V0OiAoKSA9PiBpZCB9LFxuICAgICAgICBvcmlnaW46IHsgZ2V0OiAoKSA9PiBvcmlnaW4sIHNldDogdmFsdWUgPT4gKG9yaWdpbiA9IHZhbHVlKSB9LFxuICAgICAgICBzZXJ2ZXJJZDogeyBnZXQ6ICgpID0+IHN0YXRlLnNlcnZlckZpbGVSZWZlcmVuY2UgfSxcbiAgICAgICAgdHJhbnNmZXJJZDogeyBnZXQ6ICgpID0+IHN0YXRlLnRyYW5zZmVySWQgfSxcbiAgICAgICAgc3RhdHVzOiB7IGdldDogKCkgPT4gc3RhdGUuc3RhdHVzIH0sXG4gICAgICAgIGZpbGVuYW1lOiB7IGdldDogKCkgPT4gc3RhdGUuZmlsZS5uYW1lIH0sXG4gICAgICAgIGZpbGVuYW1lV2l0aG91dEV4dGVuc2lvbjogeyBnZXQ6ICgpID0+IGdldEZpbGVuYW1lV2l0aG91dEV4dGVuc2lvbihzdGF0ZS5maWxlLm5hbWUpIH0sXG4gICAgICAgIGZpbGVFeHRlbnNpb246IHsgZ2V0OiBnZXRGaWxlRXh0ZW5zaW9uIH0sXG4gICAgICAgIGZpbGVUeXBlOiB7IGdldDogZ2V0RmlsZVR5cGUgfSxcbiAgICAgICAgZmlsZVNpemU6IHsgZ2V0OiBnZXRGaWxlU2l6ZSB9LFxuICAgICAgICBmaWxlOiB7IGdldDogZ2V0RmlsZSB9LFxuICAgICAgICByZWxhdGl2ZVBhdGg6IHsgZ2V0OiAoKSA9PiBzdGF0ZS5maWxlLl9yZWxhdGl2ZVBhdGggfSxcblxuICAgICAgICBzb3VyY2U6IHsgZ2V0OiAoKSA9PiBzdGF0ZS5zb3VyY2UgfSxcblxuICAgICAgICBnZXRNZXRhZGF0YSxcbiAgICAgICAgc2V0TWV0YWRhdGE6IChrZXksIHZhbHVlLCBzaWxlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChpc09iamVjdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGtleTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNldE1ldGFkYXRhKGtleSwgZGF0YVtrZXldLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldE1ldGFkYXRhKGtleSwgdmFsdWUsIHNpbGVudCk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0ZW5kOiAobmFtZSwgaGFuZGxlcikgPT4gKGl0ZW1BUElbbmFtZV0gPSBoYW5kbGVyKSxcblxuICAgICAgICBhYm9ydExvYWQsXG4gICAgICAgIHJldHJ5TG9hZCxcbiAgICAgICAgcmVxdWVzdFByb2Nlc3NpbmcsXG4gICAgICAgIGFib3J0UHJvY2Vzc2luZyxcblxuICAgICAgICBsb2FkLFxuICAgICAgICBwcm9jZXNzLFxuICAgICAgICByZXZlcnQsXG5cbiAgICAgICAgLi4ub24oKSxcblxuICAgICAgICBmcmVlemU6ICgpID0+IChzdGF0ZS5mcm96ZW4gPSB0cnVlKSxcblxuICAgICAgICByZWxlYXNlOiAoKSA9PiAoc3RhdGUucmVsZWFzZWQgPSB0cnVlKSxcbiAgICAgICAgcmVsZWFzZWQ6IHsgZ2V0OiAoKSA9PiBzdGF0ZS5yZWxlYXNlZCB9LFxuXG4gICAgICAgIGFyY2hpdmU6ICgpID0+IChzdGF0ZS5hcmNoaXZlZCA9IHRydWUpLFxuICAgICAgICBhcmNoaXZlZDogeyBnZXQ6ICgpID0+IHN0YXRlLmFyY2hpdmVkIH0sXG5cbiAgICAgICAgLy8gcmVwbGFjZSBzb3VyY2UgYW5kIGZpbGUgb2JqZWN0XG4gICAgICAgIHNldEZpbGU6IGZpbGUgPT4gKHN0YXRlLmZpbGUgPSBmaWxlKSxcbiAgICB9O1xuXG4gICAgLy8gY3JlYXRlIGl0IGhlcmUgaW5zdGVhZCBvZiByZXR1cm5pbmcgaXQgaW5zdGFudGx5IHNvIHdlIGNhbiBleHRlbmQgaXQgbGF0ZXJcbiAgICBjb25zdCBpdGVtQVBJID0gY3JlYXRlT2JqZWN0KGFwaSk7XG5cbiAgICByZXR1cm4gaXRlbUFQSTtcbn07XG5cbmNvbnN0IGdldEl0ZW1JbmRleEJ5UXVlcnkgPSAoaXRlbXMsIHF1ZXJ5KSA9PiB7XG4gICAgLy8ganVzdCByZXR1cm4gZmlyc3QgaW5kZXhcbiAgICBpZiAoaXNFbXB0eShxdWVyeSkpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgLy8gaW52YWxpZCBxdWVyaWVzXG4gICAgaWYgKCFpc1N0cmluZyhxdWVyeSkpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIC8vIHJldHVybiBpdGVtIGJ5IGlkIChvciAtMSBpZiBub3QgZm91bmQpXG4gICAgcmV0dXJuIGl0ZW1zLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IHF1ZXJ5KTtcbn07XG5cbmNvbnN0IGdldEl0ZW1CeUlkID0gKGl0ZW1zLCBpdGVtSWQpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IGdldEl0ZW1JbmRleEJ5UXVlcnkoaXRlbXMsIGl0ZW1JZCk7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBpdGVtc1tpbmRleF0gfHwgbnVsbDtcbn07XG5cbmNvbnN0IGZldGNoQmxvYiA9ICh1cmwsIGxvYWQsIGVycm9yLCBwcm9ncmVzcywgYWJvcnQsIGhlYWRlcnMpID0+IHtcbiAgICBjb25zdCByZXF1ZXN0ID0gc2VuZFJlcXVlc3QobnVsbCwgdXJsLCB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2Jsb2InLFxuICAgIH0pO1xuXG4gICAgcmVxdWVzdC5vbmxvYWQgPSB4aHIgPT4ge1xuICAgICAgICAvLyBnZXQgaGVhZGVyc1xuICAgICAgICBjb25zdCBoZWFkZXJzID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpO1xuXG4gICAgICAgIC8vIGdldCBmaWxlbmFtZVxuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IGdldEZpbGVJbmZvRnJvbUhlYWRlcnMoaGVhZGVycykubmFtZSB8fCBnZXRGaWxlbmFtZUZyb21VUkwodXJsKTtcblxuICAgICAgICAvLyBjcmVhdGUgcmVzcG9uc2VcbiAgICAgICAgbG9hZChjcmVhdGVSZXNwb25zZSgnbG9hZCcsIHhoci5zdGF0dXMsIGdldEZpbGVGcm9tQmxvYih4aHIucmVzcG9uc2UsIGZpbGVuYW1lKSwgaGVhZGVycykpO1xuICAgIH07XG5cbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSB4aHIgPT4ge1xuICAgICAgICBlcnJvcihjcmVhdGVSZXNwb25zZSgnZXJyb3InLCB4aHIuc3RhdHVzLCB4aHIuc3RhdHVzVGV4dCwgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSk7XG4gICAgfTtcblxuICAgIHJlcXVlc3Qub25oZWFkZXJzID0geGhyID0+IHtcbiAgICAgICAgaGVhZGVycyhjcmVhdGVSZXNwb25zZSgnaGVhZGVycycsIHhoci5zdGF0dXMsIG51bGwsIHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkpO1xuICAgIH07XG5cbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGNyZWF0ZVRpbWVvdXRSZXNwb25zZShlcnJvcik7XG4gICAgcmVxdWVzdC5vbnByb2dyZXNzID0gcHJvZ3Jlc3M7XG4gICAgcmVxdWVzdC5vbmFib3J0ID0gYWJvcnQ7XG5cbiAgICAvLyBzaG91bGQgcmV0dXJuIHJlcXVlc3RcbiAgICByZXR1cm4gcmVxdWVzdDtcbn07XG5cbmNvbnN0IGdldERvbWFpbkZyb21VUkwgPSB1cmwgPT4ge1xuICAgIGlmICh1cmwuaW5kZXhPZignLy8nKSA9PT0gMCkge1xuICAgICAgICB1cmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIHVybFxuICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAucmVwbGFjZSgnYmxvYjonLCAnJylcbiAgICAgICAgLnJlcGxhY2UoLyhbYS16XSk/OlxcL1xcLy8sICckMScpXG4gICAgICAgIC5zcGxpdCgnLycpWzBdO1xufTtcblxuY29uc3QgaXNFeHRlcm5hbFVSTCA9IHVybCA9PlxuICAgICh1cmwuaW5kZXhPZignOicpID4gLTEgfHwgdXJsLmluZGV4T2YoJy8vJykgPiAtMSkgJiZcbiAgICBnZXREb21haW5Gcm9tVVJMKGxvY2F0aW9uLmhyZWYpICE9PSBnZXREb21haW5Gcm9tVVJMKHVybCk7XG5cbmNvbnN0IGR5bmFtaWNMYWJlbCA9IGxhYmVsID0+ICguLi5wYXJhbXMpID0+IChpc0Z1bmN0aW9uKGxhYmVsKSA/IGxhYmVsKC4uLnBhcmFtcykgOiBsYWJlbCk7XG5cbmNvbnN0IGlzTW9ja0l0ZW0gPSBpdGVtID0+ICFpc0ZpbGUoaXRlbS5maWxlKTtcblxuY29uc3QgbGlzdFVwZGF0ZWQgPSAoZGlzcGF0Y2gsIHN0YXRlKSA9PiB7XG4gICAgY2xlYXJUaW1lb3V0KHN0YXRlLmxpc3RVcGRhdGVUaW1lb3V0KTtcbiAgICBzdGF0ZS5saXN0VXBkYXRlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCgnRElEX1VQREFURV9JVEVNUycsIHsgaXRlbXM6IGdldEFjdGl2ZUl0ZW1zKHN0YXRlLml0ZW1zKSB9KTtcbiAgICB9LCAwKTtcbn07XG5cbmNvbnN0IG9wdGlvbmFsUHJvbWlzZSA9IChmbiwgLi4ucGFyYW1zKSA9PlxuICAgIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGZuKC4uLnBhcmFtcyk7XG5cbiAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdC50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXN1bHQudGhlbihyZXNvbHZlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5jb25zdCBzb3J0SXRlbXMgPSAoc3RhdGUsIGNvbXBhcmUpID0+IHtcbiAgICBzdGF0ZS5pdGVtcy5zb3J0KChhLCBiKSA9PiBjb21wYXJlKGNyZWF0ZUl0ZW1BUEkoYSksIGNyZWF0ZUl0ZW1BUEkoYikpKTtcbn07XG5cbi8vIHJldHVybnMgaXRlbSBiYXNlZCBvbiBzdGF0ZVxuY29uc3QgZ2V0SXRlbUJ5UXVlcnlGcm9tU3RhdGUgPSAoc3RhdGUsIGl0ZW1IYW5kbGVyKSA9PiAoe1xuICAgIHF1ZXJ5LFxuICAgIHN1Y2Nlc3MgPSAoKSA9PiB7fSxcbiAgICBmYWlsdXJlID0gKCkgPT4ge30sXG4gICAgLi4ub3B0aW9uc1xufSA9IHt9KSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IGdldEl0ZW1CeVF1ZXJ5KHN0YXRlLml0ZW1zLCBxdWVyeSk7XG4gICAgaWYgKCFpdGVtKSB7XG4gICAgICAgIGZhaWx1cmUoe1xuICAgICAgICAgICAgZXJyb3I6IGNyZWF0ZVJlc3BvbnNlKCdlcnJvcicsIDAsICdJdGVtIG5vdCBmb3VuZCcpLFxuICAgICAgICAgICAgZmlsZTogbnVsbCxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXRlbUhhbmRsZXIoaXRlbSwgc3VjY2VzcywgZmFpbHVyZSwgb3B0aW9ucyB8fCB7fSk7XG59O1xuXG5jb25zdCBhY3Rpb25zID0gKGRpc3BhdGNoLCBxdWVyeSwgc3RhdGUpID0+ICh7XG4gICAgLyoqXG4gICAgICogQWJvcnRzIGFsbCBvbmdvaW5nIHByb2Nlc3Nlc1xuICAgICAqL1xuICAgIEFCT1JUX0FMTDogKCkgPT4ge1xuICAgICAgICBnZXRBY3RpdmVJdGVtcyhzdGF0ZS5pdGVtcykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGl0ZW0uZnJlZXplKCk7XG4gICAgICAgICAgICBpdGVtLmFib3J0TG9hZCgpO1xuICAgICAgICAgICAgaXRlbS5hYm9ydFByb2Nlc3NpbmcoKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgaW5pdGlhbCBmaWxlc1xuICAgICAqL1xuICAgIERJRF9TRVRfRklMRVM6ICh7IHZhbHVlID0gW10gfSkgPT4ge1xuICAgICAgICAvLyBtYXAgdmFsdWVzIHRvIGZpbGUgb2JqZWN0c1xuICAgICAgICBjb25zdCBmaWxlcyA9IHZhbHVlLm1hcChmaWxlID0+ICh7XG4gICAgICAgICAgICBzb3VyY2U6IGZpbGUuc291cmNlID8gZmlsZS5zb3VyY2UgOiBmaWxlLFxuICAgICAgICAgICAgb3B0aW9uczogZmlsZS5vcHRpb25zLFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gbG9vcCBvdmVyIGZpbGVzLCBpZiBmaWxlIGlzIGluIGxpc3QsIGxlYXZlIGl0IGJlLCBpZiBub3QsIHJlbW92ZVxuICAgICAgICAvLyB0ZXN0IGlmIGl0ZW1zIHNob3VsZCBiZSBtb3ZlZFxuICAgICAgICBsZXQgYWN0aXZlSXRlbXMgPSBnZXRBY3RpdmVJdGVtcyhzdGF0ZS5pdGVtcyk7XG5cbiAgICAgICAgYWN0aXZlSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIC8vIGlmIGl0ZW0gbm90IGlzIGluIG5ldyB2YWx1ZSwgcmVtb3ZlXG4gICAgICAgICAgICBpZiAoIWZpbGVzLmZpbmQoZmlsZSA9PiBmaWxlLnNvdXJjZSA9PT0gaXRlbS5zb3VyY2UgfHwgZmlsZS5zb3VyY2UgPT09IGl0ZW0uZmlsZSkpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCgnUkVNT1ZFX0lURU0nLCB7IHF1ZXJ5OiBpdGVtLCByZW1vdmU6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBhZGQgbmV3IGZpbGVzXG4gICAgICAgIGFjdGl2ZUl0ZW1zID0gZ2V0QWN0aXZlSXRlbXMoc3RhdGUuaXRlbXMpO1xuICAgICAgICBmaWxlcy5mb3JFYWNoKChmaWxlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgLy8gaWYgZmlsZSBpcyBhbHJlYWR5IGluIGxpc3RcbiAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtcy5maW5kKGl0ZW0gPT4gaXRlbS5zb3VyY2UgPT09IGZpbGUuc291cmNlIHx8IGl0ZW0uZmlsZSA9PT0gZmlsZS5zb3VyY2UpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgLy8gbm90IGluIGxpc3QsIGFkZFxuICAgICAgICAgICAgZGlzcGF0Y2goJ0FERF9JVEVNJywge1xuICAgICAgICAgICAgICAgIC4uLmZpbGUsXG4gICAgICAgICAgICAgICAgaW50ZXJhY3Rpb25NZXRob2Q6IEludGVyYWN0aW9uTWV0aG9kLk5PTkUsXG4gICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIERJRF9VUERBVEVfSVRFTV9NRVRBREFUQTogKHsgaWQsIGFjdGlvbiwgY2hhbmdlIH0pID0+IHtcbiAgICAgICAgLy8gZG9uJ3QgZG8gYW55dGhpbmdcbiAgICAgICAgaWYgKGNoYW5nZS5zaWxlbnQpIHJldHVybjtcblxuICAgICAgICAvLyBpZiBpcyBjYWxsZWQgbXVsdGlwbGUgdGltZXMgaW4gY2xvc2Ugc3VjY2Vzc2lvbiB3ZSBjb21iaW5lZCBhbGwgY2FsbHMgdG9nZXRoZXIgdG8gc2F2ZSByZXNvdXJjZXNcbiAgICAgICAgY2xlYXJUaW1lb3V0KHN0YXRlLml0ZW1VcGRhdGVUaW1lb3V0KTtcbiAgICAgICAgc3RhdGUuaXRlbVVwZGF0ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBnZXRJdGVtQnlJZChzdGF0ZS5pdGVtcywgaWQpO1xuXG4gICAgICAgICAgICAvLyBvbmx5IHJldmVydCBhbmQgYXR0ZW1wdCB0byB1cGxvYWQgd2hlbiB3ZSdyZSB1cGxvYWRpbmcgdG8gYSBzZXJ2ZXJcbiAgICAgICAgICAgIGlmICghcXVlcnkoJ0lTX0FTWU5DJykpIHtcbiAgICAgICAgICAgICAgICAvLyBzaG91bGQgd2UgdXBkYXRlIHRoZSBvdXRwdXQgZGF0YVxuICAgICAgICAgICAgICAgIGFwcGx5RmlsdGVyQ2hhaW4oJ1NIT1VMRF9QUkVQQVJFX09VVFBVVCcsIGZhbHNlLCB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZSxcbiAgICAgICAgICAgICAgICB9KS50aGVuKHNob3VsZFByZXBhcmVPdXRwdXQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBwbHVnaW5zIGRldGVybWluZWQgdGhlIG91dHB1dCBkYXRhIHNob3VsZCBiZSBwcmVwYXJlZCAob3Igbm90KSwgY2FuIGJlIGFkanVzdGVkIHdpdGggYmVmb3JlUHJlcGFyZU91dHB1dCBob29rXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJlZm9yZVByZXBhcmVGaWxlID0gcXVlcnkoJ0dFVF9CRUZPUkVfUFJFUEFSRV9GSUxFJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiZWZvcmVQcmVwYXJlRmlsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFByZXBhcmVPdXRwdXQgPSBiZWZvcmVQcmVwYXJlRmlsZShpdGVtLCBzaG91bGRQcmVwYXJlT3V0cHV0KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNob3VsZFByZXBhcmVPdXRwdXQpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgICdSRVFVRVNUX1BSRVBBUkVfT1VUUFVUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeTogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmaWxlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goJ0RJRF9QUkVQQVJFX09VVFBVVCcsIHsgaWQsIGZpbGUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIGlzIGxvY2FsIGl0ZW0gd2UgbmVlZCB0byBlbmFibGUgdXBsb2FkIGJ1dHRvbiBzbyBjaGFuZ2UgY2FuIGJlIHByb3BhZ2F0ZWQgdG8gc2VydmVyXG4gICAgICAgICAgICBpZiAoaXRlbS5vcmlnaW4gPT09IEZpbGVPcmlnaW4uTE9DQUwpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCgnRElEX0xPQURfSVRFTScsIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJGaWxlUmVmZXJlbmNlOiBpdGVtLnNvdXJjZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZm9yIGFzeW5jIHNjZW5hcmlvc1xuICAgICAgICAgICAgY29uc3QgdXBsb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHdlIHB1c2ggdGhpcyBmb3J3YXJkIGEgYml0IHNvIHRoZSBpbnRlcmZhY2UgaXMgdXBkYXRlZCBjb3JyZWN0bHlcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goJ1JFUVVFU1RfSVRFTV9QUk9DRVNTSU5HJywgeyBxdWVyeTogaWQgfSk7XG4gICAgICAgICAgICAgICAgfSwgMzIpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgcmV2ZXJ0ID0gZG9VcGxvYWQgPT4ge1xuICAgICAgICAgICAgICAgIGl0ZW0ucmV2ZXJ0KFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVSZXZlcnRGdW5jdGlvbihzdGF0ZS5vcHRpb25zLnNlcnZlci51cmwsIHN0YXRlLm9wdGlvbnMuc2VydmVyLnJldmVydCksXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5KCdHRVRfRk9SQ0VfUkVWRVJUJylcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGRvVXBsb2FkID8gdXBsb2FkIDogKCkgPT4ge30pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBhYm9ydCA9IGRvVXBsb2FkID0+IHtcbiAgICAgICAgICAgICAgICBpdGVtLmFib3J0UHJvY2Vzc2luZygpLnRoZW4oZG9VcGxvYWQgPyB1cGxvYWQgOiAoKSA9PiB7fSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBpZiB3ZSBzaG91bGQgcmUtdXBsb2FkIHRoZSBmaWxlIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICBpZiAoaXRlbS5zdGF0dXMgPT09IEl0ZW1TdGF0dXMuUFJPQ0VTU0lOR19DT01QTEVURSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXZlcnQoc3RhdGUub3B0aW9ucy5pbnN0YW50VXBsb2FkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgY3VycmVudGx5IHVwbG9hZGluZywgY2FuY2VsIHVwbG9hZFxuICAgICAgICAgICAgaWYgKGl0ZW0uc3RhdHVzID09PSBJdGVtU3RhdHVzLlBST0NFU1NJTkcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWJvcnQoc3RhdGUub3B0aW9ucy5pbnN0YW50VXBsb2FkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXRlLm9wdGlvbnMuaW5zdGFudFVwbG9hZCkge1xuICAgICAgICAgICAgICAgIHVwbG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICB9LFxuXG4gICAgTU9WRV9JVEVNOiAoeyBxdWVyeSwgaW5kZXggfSkgPT4ge1xuICAgICAgICBjb25zdCBpdGVtID0gZ2V0SXRlbUJ5UXVlcnkoc3RhdGUuaXRlbXMsIHF1ZXJ5KTtcbiAgICAgICAgaWYgKCFpdGVtKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHN0YXRlLml0ZW1zLmluZGV4T2YoaXRlbSk7XG4gICAgICAgIGluZGV4ID0gbGltaXQoaW5kZXgsIDAsIHN0YXRlLml0ZW1zLmxlbmd0aCAtIDEpO1xuICAgICAgICBpZiAoY3VycmVudEluZGV4ID09PSBpbmRleCkgcmV0dXJuO1xuICAgICAgICBzdGF0ZS5pdGVtcy5zcGxpY2UoaW5kZXgsIDAsIHN0YXRlLml0ZW1zLnNwbGljZShjdXJyZW50SW5kZXgsIDEpWzBdKTtcbiAgICB9LFxuXG4gICAgU09SVDogKHsgY29tcGFyZSB9KSA9PiB7XG4gICAgICAgIHNvcnRJdGVtcyhzdGF0ZSwgY29tcGFyZSk7XG4gICAgICAgIGRpc3BhdGNoKCdESURfU09SVF9JVEVNUycsIHtcbiAgICAgICAgICAgIGl0ZW1zOiBxdWVyeSgnR0VUX0FDVElWRV9JVEVNUycpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgQUREX0lURU1TOiAoeyBpdGVtcywgaW5kZXgsIGludGVyYWN0aW9uTWV0aG9kLCBzdWNjZXNzID0gKCkgPT4ge30sIGZhaWx1cmUgPSAoKSA9PiB7fSB9KSA9PiB7XG4gICAgICAgIGxldCBjdXJyZW50SW5kZXggPSBpbmRleDtcblxuICAgICAgICBpZiAoaW5kZXggPT09IC0xIHx8IHR5cGVvZiBpbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGluc2VydExvY2F0aW9uID0gcXVlcnkoJ0dFVF9JVEVNX0lOU0VSVF9MT0NBVElPTicpO1xuICAgICAgICAgICAgY29uc3QgdG90YWxJdGVtcyA9IHF1ZXJ5KCdHRVRfVE9UQUxfSVRFTVMnKTtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGluc2VydExvY2F0aW9uID09PSAnYmVmb3JlJyA/IDAgOiB0b3RhbEl0ZW1zO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaWdub3JlZEZpbGVzID0gcXVlcnkoJ0dFVF9JR05PUkVEX0ZJTEVTJyk7XG4gICAgICAgIGNvbnN0IGlzVmFsaWRGaWxlID0gc291cmNlID0+XG4gICAgICAgICAgICBpc0ZpbGUoc291cmNlKSA/ICFpZ25vcmVkRmlsZXMuaW5jbHVkZXMoc291cmNlLm5hbWUudG9Mb3dlckNhc2UoKSkgOiAhaXNFbXB0eShzb3VyY2UpO1xuICAgICAgICBjb25zdCB2YWxpZEl0ZW1zID0gaXRlbXMuZmlsdGVyKGlzVmFsaWRGaWxlKTtcblxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHZhbGlkSXRlbXMubWFwKFxuICAgICAgICAgICAgc291cmNlID0+XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCgnQUREX0lURU0nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcmFjdGlvbk1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogc291cmNlLnNvdXJjZSB8fCBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXNvbHZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbHVyZTogcmVqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGN1cnJlbnRJbmRleCsrLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogc291cmNlLm9wdGlvbnMgfHwge30sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgICAgICAgICAudGhlbihzdWNjZXNzKVxuICAgICAgICAgICAgLmNhdGNoKGZhaWx1cmUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gc291cmNlXG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICogQHBhcmFtIGludGVyYWN0aW9uTWV0aG9kXG4gICAgICovXG4gICAgQUREX0lURU06ICh7XG4gICAgICAgIHNvdXJjZSxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgaW50ZXJhY3Rpb25NZXRob2QsXG4gICAgICAgIHN1Y2Nlc3MgPSAoKSA9PiB7fSxcbiAgICAgICAgZmFpbHVyZSA9ICgpID0+IHt9LFxuICAgICAgICBvcHRpb25zID0ge30sXG4gICAgfSkgPT4ge1xuICAgICAgICAvLyBpZiBubyBzb3VyY2Ugc3VwcGxpZWRcbiAgICAgICAgaWYgKGlzRW1wdHkoc291cmNlKSkge1xuICAgICAgICAgICAgZmFpbHVyZSh7XG4gICAgICAgICAgICAgICAgZXJyb3I6IGNyZWF0ZVJlc3BvbnNlKCdlcnJvcicsIDAsICdObyBzb3VyY2UnKSxcbiAgICAgICAgICAgICAgICBmaWxlOiBudWxsLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaWx0ZXIgb3V0IGludmFsaWQgZmlsZSBpdGVtcywgdXNlZCB0byBmaWx0ZXIgZHJvcHBlZCBkaXJlY3RvcnkgY29udGVudHNcbiAgICAgICAgaWYgKGlzRmlsZShzb3VyY2UpICYmIHN0YXRlLm9wdGlvbnMuaWdub3JlZEZpbGVzLmluY2x1ZGVzKHNvdXJjZS5uYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICAvLyBmYWlsIHNpbGVudGx5XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0ZXN0IGlmIHRoZXJlJ3Mgc3RpbGwgcm9vbSBpbiB0aGUgbGlzdCBvZiBmaWxlc1xuICAgICAgICBpZiAoIWhhc1Jvb21Gb3JJdGVtKHN0YXRlKSkge1xuICAgICAgICAgICAgLy8gaWYgbXVsdGlwbGUgYWxsb3dlZCwgd2UgY2FuJ3QgcmVwbGFjZVxuICAgICAgICAgICAgLy8gb3IgaWYgb25seSBhIHNpbmdsZSBpdGVtIGlzIGFsbG93ZWQgYnV0IHdlJ3JlIG5vdCBhbGxvd2VkIHRvIHJlcGxhY2UgaXQgd2UgZXhpdFxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHN0YXRlLm9wdGlvbnMuYWxsb3dNdWx0aXBsZSB8fFxuICAgICAgICAgICAgICAgICghc3RhdGUub3B0aW9ucy5hbGxvd011bHRpcGxlICYmICFzdGF0ZS5vcHRpb25zLmFsbG93UmVwbGFjZSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gY3JlYXRlUmVzcG9uc2UoJ3dhcm5pbmcnLCAwLCAnTWF4IGZpbGVzJyk7XG5cbiAgICAgICAgICAgICAgICBkaXNwYXRjaCgnRElEX1RIUk9XX01BWF9GSUxFUycsIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGZhaWx1cmUoeyBlcnJvciwgZmlsZTogbnVsbCB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbGV0J3MgcmVwbGFjZSB0aGUgaXRlbVxuICAgICAgICAgICAgLy8gaWQgb2YgZmlyc3QgaXRlbSB3ZSdyZSBhYm91dCB0byByZW1vdmVcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBnZXRBY3RpdmVJdGVtcyhzdGF0ZS5pdGVtcylbMF07XG5cbiAgICAgICAgICAgIC8vIGlmIGhhcyBiZWVuIHByb2Nlc3NlZCByZW1vdmUgaXQgZnJvbSB0aGUgc2VydmVyIGFzIHdlbGxcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9PT0gSXRlbVN0YXR1cy5QUk9DRVNTSU5HX0NPTVBMRVRFIHx8XG4gICAgICAgICAgICAgICAgaXRlbS5zdGF0dXMgPT09IEl0ZW1TdGF0dXMuUFJPQ0VTU0lOR19SRVZFUlRfRVJST1JcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvcmNlUmV2ZXJ0ID0gcXVlcnkoJ0dFVF9GT1JDRV9SRVZFUlQnKTtcbiAgICAgICAgICAgICAgICBpdGVtLnJldmVydChcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlUmV2ZXJ0RnVuY3Rpb24oc3RhdGUub3B0aW9ucy5zZXJ2ZXIudXJsLCBzdGF0ZS5vcHRpb25zLnNlcnZlci5yZXZlcnQpLFxuICAgICAgICAgICAgICAgICAgICBmb3JjZVJldmVydFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3JjZVJldmVydCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0cnkgdG8gYWRkIG5vd1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goJ0FERF9JVEVNJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcmFjdGlvbk1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWx1cmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge30pOyAvLyBubyBuZWVkIHRvIGhhbmRsZSB0aGlzIGNhdGNoIHN0YXRlIGZvciBub3dcblxuICAgICAgICAgICAgICAgIGlmIChmb3JjZVJldmVydCkgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZW1vdmUgZmlyc3QgaXRlbSBhcyBpdCB3aWxsIGJlIHJlcGxhY2VkIGJ5IHRoaXMgaXRlbVxuICAgICAgICAgICAgZGlzcGF0Y2goJ1JFTU9WRV9JVEVNJywgeyBxdWVyeTogaXRlbS5pZCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdoZXJlIGRpZCB0aGUgZmlsZSBvcmlnaW5hdGVcbiAgICAgICAgY29uc3Qgb3JpZ2luID1cbiAgICAgICAgICAgIG9wdGlvbnMudHlwZSA9PT0gJ2xvY2FsJ1xuICAgICAgICAgICAgICAgID8gRmlsZU9yaWdpbi5MT0NBTFxuICAgICAgICAgICAgICAgIDogb3B0aW9ucy50eXBlID09PSAnbGltYm8nXG4gICAgICAgICAgICAgICAgPyBGaWxlT3JpZ2luLkxJTUJPXG4gICAgICAgICAgICAgICAgOiBGaWxlT3JpZ2luLklOUFVUO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBibGFuayBpdGVtXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBjcmVhdGVJdGVtKFxuICAgICAgICAgICAgLy8gd2hlcmUgZGlkIHRoaXMgZmlsZSBjb21lIGZyb21cbiAgICAgICAgICAgIG9yaWdpbixcblxuICAgICAgICAgICAgLy8gYW4gaW5wdXQgZmlsZSBuZXZlciBoYXMgYSBzZXJ2ZXIgZmlsZSByZWZlcmVuY2VcbiAgICAgICAgICAgIG9yaWdpbiA9PT0gRmlsZU9yaWdpbi5JTlBVVCA/IG51bGwgOiBzb3VyY2UsXG5cbiAgICAgICAgICAgIC8vIGZpbGUgbW9jayBkYXRhLCBpZiBkZWZpbmVkXG4gICAgICAgICAgICBvcHRpb25zLmZpbGVcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBzZXQgaW5pdGlhbCBtZXRhIGRhdGFcbiAgICAgICAgT2JqZWN0LmtleXMob3B0aW9ucy5tZXRhZGF0YSB8fCB7fSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaXRlbS5zZXRNZXRhZGF0YShrZXksIG9wdGlvbnMubWV0YWRhdGFba2V5XSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNyZWF0ZWQgdGhlIGl0ZW0sIGxldCBwbHVnaW5zIGFkZCBtZXRob2RzXG4gICAgICAgIGFwcGx5RmlsdGVycygnRElEX0NSRUFURV9JVEVNJywgaXRlbSwgeyBxdWVyeSwgZGlzcGF0Y2ggfSk7XG5cbiAgICAgICAgLy8gd2hlcmUgdG8gaW5zZXJ0IG5ldyBpdGVtc1xuICAgICAgICBjb25zdCBpdGVtSW5zZXJ0TG9jYXRpb24gPSBxdWVyeSgnR0VUX0lURU1fSU5TRVJUX0xPQ0FUSU9OJyk7XG5cbiAgICAgICAgLy8gYWRqdXN0IGluZGV4IGlmIGlzIG5vdCBhbGxvd2VkIHRvIHBpY2sgbG9jYXRpb25cbiAgICAgICAgaWYgKCFzdGF0ZS5vcHRpb25zLml0ZW1JbnNlcnRMb2NhdGlvbkZyZWVkb20pIHtcbiAgICAgICAgICAgIGluZGV4ID0gaXRlbUluc2VydExvY2F0aW9uID09PSAnYmVmb3JlJyA/IC0xIDogc3RhdGUuaXRlbXMubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIGl0ZW0gdG8gbGlzdFxuICAgICAgICBpbnNlcnRJdGVtKHN0YXRlLml0ZW1zLCBpdGVtLCBpbmRleCk7XG5cbiAgICAgICAgLy8gc29ydCBpdGVtcyBpbiBsaXN0XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGl0ZW1JbnNlcnRMb2NhdGlvbikgJiYgc291cmNlKSB7XG4gICAgICAgICAgICBzb3J0SXRlbXMoc3RhdGUsIGl0ZW1JbnNlcnRMb2NhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgYSBxdWljayByZWZlcmVuY2UgdG8gdGhlIGl0ZW0gaWRcbiAgICAgICAgY29uc3QgaWQgPSBpdGVtLmlkO1xuXG4gICAgICAgIC8vIG9ic2VydmUgaXRlbSBldmVudHNcbiAgICAgICAgaXRlbS5vbignaW5pdCcsICgpID0+IHtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdESURfSU5JVF9JVEVNJywgeyBpZCB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXRlbS5vbignbG9hZC1pbml0JywgKCkgPT4ge1xuICAgICAgICAgICAgZGlzcGF0Y2goJ0RJRF9TVEFSVF9JVEVNX0xPQUQnLCB7IGlkIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdGVtLm9uKCdsb2FkLW1ldGEnLCAoKSA9PiB7XG4gICAgICAgICAgICBkaXNwYXRjaCgnRElEX1VQREFURV9JVEVNX01FVEEnLCB7IGlkIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdGVtLm9uKCdsb2FkLXByb2dyZXNzJywgcHJvZ3Jlc3MgPT4ge1xuICAgICAgICAgICAgZGlzcGF0Y2goJ0RJRF9VUERBVEVfSVRFTV9MT0FEX1BST0dSRVNTJywgeyBpZCwgcHJvZ3Jlc3MgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0ZW0ub24oJ2xvYWQtcmVxdWVzdC1lcnJvcicsIGVycm9yID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1haW5TdGF0dXMgPSBkeW5hbWljTGFiZWwoc3RhdGUub3B0aW9ucy5sYWJlbEZpbGVMb2FkRXJyb3IpKGVycm9yKTtcblxuICAgICAgICAgICAgLy8gaXMgY2xpZW50IGVycm9yLCBubyB3YXkgdG8gcmVjb3ZlclxuICAgICAgICAgICAgaWYgKGVycm9yLmNvZGUgPj0gNDAwICYmIGVycm9yLmNvZGUgPCA1MDApIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCgnRElEX1RIUk9XX0lURU1fSU5WQUxJRCcsIHtcbiAgICAgICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IG1haW5TdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWI6IGAke2Vycm9yLmNvZGV9ICgke2Vycm9yLmJvZHl9KWAsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyByZWplY3QgdGhlIGZpbGUgc28gY2FuIGJlIGRlYWx0IHdpdGggdGhyb3VnaCBBUElcbiAgICAgICAgICAgICAgICBmYWlsdXJlKHsgZXJyb3IsIGZpbGU6IGNyZWF0ZUl0ZW1BUEkoaXRlbSkgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpcyBwb3NzaWJsZSBzZXJ2ZXIgZXJyb3IsIHNvIG1pZ2h0IGJlIHBvc3NpYmxlIHRvIHJldHJ5XG4gICAgICAgICAgICBkaXNwYXRjaCgnRElEX1RIUk9XX0lURU1fTE9BRF9FUlJPUicsIHtcbiAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICBzdGF0dXM6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFpbjogbWFpblN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgc3ViOiBzdGF0ZS5vcHRpb25zLmxhYmVsVGFwVG9SZXRyeSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0ZW0ub24oJ2xvYWQtZmlsZS1lcnJvcicsIGVycm9yID0+IHtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdESURfVEhST1dfSVRFTV9JTlZBTElEJywge1xuICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBlcnJvci5zdGF0dXMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZhaWx1cmUoeyBlcnJvcjogZXJyb3Iuc3RhdHVzLCBmaWxlOiBjcmVhdGVJdGVtQVBJKGl0ZW0pIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdGVtLm9uKCdsb2FkLWFib3J0JywgKCkgPT4ge1xuICAgICAgICAgICAgZGlzcGF0Y2goJ1JFTU9WRV9JVEVNJywgeyBxdWVyeTogaWQgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0ZW0ub24oJ2xvYWQtc2tpcCcsICgpID0+IHtcbiAgICAgICAgICAgIGl0ZW0ub24oJ21ldGFkYXRhLXVwZGF0ZScsIGNoYW5nZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0ZpbGUoaXRlbS5maWxlKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoKCdESURfVVBEQVRFX0lURU1fTUVUQURBVEEnLCB7IGlkLCBjaGFuZ2UgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGlzcGF0Y2goJ0NPTVBMRVRFX0xPQURfSVRFTScsIHtcbiAgICAgICAgICAgICAgICBxdWVyeTogaWQsXG4gICAgICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0ZW0ub24oJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoYW5kbGVBZGQgPSBzaG91bGRBZGQgPT4ge1xuICAgICAgICAgICAgICAgIC8vIG5vIHNob3VsZCBub3QgYWRkIHRoaXMgZmlsZVxuICAgICAgICAgICAgICAgIGlmICghc2hvdWxkQWRkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKCdSRU1PVkVfSVRFTScsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBpZCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBub3cgaW50ZXJlc3RlZCBpbiBtZXRhZGF0YSB1cGRhdGVzXG4gICAgICAgICAgICAgICAgaXRlbS5vbignbWV0YWRhdGEtdXBkYXRlJywgY2hhbmdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goJ0RJRF9VUERBVEVfSVRFTV9NRVRBREFUQScsIHsgaWQsIGNoYW5nZSB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIGxldCBwbHVnaW5zIGRlY2lkZSBpZiB0aGUgb3V0cHV0IGRhdGEgc2hvdWxkIGJlIHByZXBhcmVkIGF0IHRoaXMgcG9pbnRcbiAgICAgICAgICAgICAgICAvLyBtZWFucyB3ZSdsbCBkbyB0aGlzIGFuZCB3YWl0IGZvciBpZGxlIHN0YXRlXG4gICAgICAgICAgICAgICAgYXBwbHlGaWx0ZXJDaGFpbignU0hPVUxEX1BSRVBBUkVfT1VUUFVUJywgZmFsc2UsIHsgaXRlbSwgcXVlcnkgfSkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkUHJlcGFyZU91dHB1dCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwbHVnaW5zIGRldGVybWluZWQgdGhlIG91dHB1dCBkYXRhIHNob3VsZCBiZSBwcmVwYXJlZCAob3Igbm90KSwgY2FuIGJlIGFkanVzdGVkIHdpdGggYmVmb3JlUHJlcGFyZU91dHB1dCBob29rXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiZWZvcmVQcmVwYXJlRmlsZSA9IHF1ZXJ5KCdHRVRfQkVGT1JFX1BSRVBBUkVfRklMRScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJlZm9yZVByZXBhcmVGaWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFByZXBhcmVPdXRwdXQgPSBiZWZvcmVQcmVwYXJlRmlsZShpdGVtLCBzaG91bGRQcmVwYXJlT3V0cHV0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9hZENvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKCdDT01QTEVURV9MT0FEX0lURU0nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RVcGRhdGVkKGRpc3BhdGNoLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBleGl0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hvdWxkUHJlcGFyZU91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdhaXQgZm9yIGlkbGUgc3RhdGUgYW5kIHRoZW4gcnVuIFBSRVBBUkVfT1VUUFVUXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSRVFVRVNUX1BSRVBBUkVfT1VUUFVUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnk6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZpbGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKCdESURfUFJFUEFSRV9PVVRQVVQnLCB7IGlkLCBmaWxlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGl0ZW0gbG9hZGVkLCBhbGxvdyBwbHVnaW5zIHRvXG4gICAgICAgICAgICAvLyAtIHJlYWQgZGF0YSAocXVpY2tseSlcbiAgICAgICAgICAgIC8vIC0gYWRkIG1ldGFkYXRhXG4gICAgICAgICAgICBhcHBseUZpbHRlckNoYWluKCdESURfTE9BRF9JVEVNJywgaXRlbSwgeyBxdWVyeSwgZGlzcGF0Y2ggfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbmFsUHJvbWlzZShxdWVyeSgnR0VUX0JFRk9SRV9BRERfRklMRScpLCBjcmVhdGVJdGVtQVBJKGl0ZW0pKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlQWRkXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZSB8fCAhZS5lcnJvciB8fCAhZS5zdGF0dXMpIHJldHVybiBoYW5kbGVBZGQoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCgnRElEX1RIUk9XX0lURU1fSU5WQUxJRCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGUuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGUuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXRlbS5vbigncHJvY2Vzcy1zdGFydCcsICgpID0+IHtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdESURfU1RBUlRfSVRFTV9QUk9DRVNTSU5HJywgeyBpZCB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXRlbS5vbigncHJvY2Vzcy1wcm9ncmVzcycsIHByb2dyZXNzID0+IHtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdESURfVVBEQVRFX0lURU1fUFJPQ0VTU19QUk9HUkVTUycsIHsgaWQsIHByb2dyZXNzIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdGVtLm9uKCdwcm9jZXNzLWVycm9yJywgZXJyb3IgPT4ge1xuICAgICAgICAgICAgZGlzcGF0Y2goJ0RJRF9USFJPV19JVEVNX1BST0NFU1NJTkdfRVJST1InLCB7XG4gICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiB7XG4gICAgICAgICAgICAgICAgICAgIG1haW46IGR5bmFtaWNMYWJlbChzdGF0ZS5vcHRpb25zLmxhYmVsRmlsZVByb2Nlc3NpbmdFcnJvcikoZXJyb3IpLFxuICAgICAgICAgICAgICAgICAgICBzdWI6IHN0YXRlLm9wdGlvbnMubGFiZWxUYXBUb1JldHJ5LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXRlbS5vbigncHJvY2Vzcy1yZXZlcnQtZXJyb3InLCBlcnJvciA9PiB7XG4gICAgICAgICAgICBkaXNwYXRjaCgnRElEX1RIUk9XX0lURU1fUFJPQ0VTU0lOR19SRVZFUlRfRVJST1InLCB7XG4gICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiB7XG4gICAgICAgICAgICAgICAgICAgIG1haW46IGR5bmFtaWNMYWJlbChzdGF0ZS5vcHRpb25zLmxhYmVsRmlsZVByb2Nlc3NpbmdSZXZlcnRFcnJvcikoZXJyb3IpLFxuICAgICAgICAgICAgICAgICAgICBzdWI6IHN0YXRlLm9wdGlvbnMubGFiZWxUYXBUb1JldHJ5LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXRlbS5vbigncHJvY2Vzcy1jb21wbGV0ZScsIHNlcnZlckZpbGVSZWZlcmVuY2UgPT4ge1xuICAgICAgICAgICAgZGlzcGF0Y2goJ0RJRF9DT01QTEVURV9JVEVNX1BST0NFU1NJTkcnLCB7XG4gICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgc2VydmVyRmlsZVJlZmVyZW5jZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ0RJRF9ERUZJTkVfVkFMVUUnLCB7IGlkLCB2YWx1ZTogc2VydmVyRmlsZVJlZmVyZW5jZSB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXRlbS5vbigncHJvY2Vzcy1hYm9ydCcsICgpID0+IHtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdESURfQUJPUlRfSVRFTV9QUk9DRVNTSU5HJywgeyBpZCB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXRlbS5vbigncHJvY2Vzcy1yZXZlcnQnLCAoKSA9PiB7XG4gICAgICAgICAgICBkaXNwYXRjaCgnRElEX1JFVkVSVF9JVEVNX1BST0NFU1NJTkcnLCB7IGlkIH0pO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ0RJRF9ERUZJTkVfVkFMVUUnLCB7IGlkLCB2YWx1ZTogbnVsbCB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gbGV0IHZpZXcga25vdyB0aGUgaXRlbSBoYXMgYmVlbiBpbnNlcnRlZFxuICAgICAgICBkaXNwYXRjaCgnRElEX0FERF9JVEVNJywgeyBpZCwgaW5kZXgsIGludGVyYWN0aW9uTWV0aG9kIH0pO1xuXG4gICAgICAgIGxpc3RVcGRhdGVkKGRpc3BhdGNoLCBzdGF0ZSk7XG5cbiAgICAgICAgLy8gc3RhcnQgbG9hZGluZyB0aGUgc291cmNlXG4gICAgICAgIGNvbnN0IHsgdXJsLCBsb2FkLCByZXN0b3JlLCBmZXRjaCB9ID0gc3RhdGUub3B0aW9ucy5zZXJ2ZXIgfHwge307XG5cbiAgICAgICAgaXRlbS5sb2FkKFxuICAgICAgICAgICAgc291cmNlLFxuXG4gICAgICAgICAgICAvLyB0aGlzIGNyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGxvYWRzIHRoZSBmaWxlIGJhc2VkIG9uIHRoZSB0eXBlIG9mIGZpbGUgKHN0cmluZywgYmFzZTY0LCBibG9iLCBmaWxlKSBhbmQgbG9jYXRpb24gb2YgZmlsZSAobG9jYWwsIHJlbW90ZSwgbGltYm8pXG4gICAgICAgICAgICBjcmVhdGVGaWxlTG9hZGVyKFxuICAgICAgICAgICAgICAgIG9yaWdpbiA9PT0gRmlsZU9yaWdpbi5JTlBVVFxuICAgICAgICAgICAgICAgICAgICA/IC8vIGlucHV0LCBpZiBpcyByZW1vdGUsIHNlZSBpZiBzaG91bGQgdXNlIGN1c3RvbSBmZXRjaCwgZWxzZSB1c2UgZGVmYXVsdCBmZXRjaEJsb2JcbiAgICAgICAgICAgICAgICAgICAgICBpc1N0cmluZyhzb3VyY2UpICYmIGlzRXh0ZXJuYWxVUkwoc291cmNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBmZXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY3JlYXRlRmV0Y2hGdW5jdGlvbih1cmwsIGZldGNoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZmV0Y2hCbG9iIC8vIHJlbW90ZSB1cmxcbiAgICAgICAgICAgICAgICAgICAgICAgIDogZmV0Y2hCbG9iIC8vIHRyeSB0byBmZXRjaCB1cmxcbiAgICAgICAgICAgICAgICAgICAgOiAvLyBsaW1ibyBvciBsb2NhbFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW4gPT09IEZpbGVPcmlnaW4uTElNQk9cbiAgICAgICAgICAgICAgICAgICAgPyBjcmVhdGVGZXRjaEZ1bmN0aW9uKHVybCwgcmVzdG9yZSkgLy8gbGltYm9cbiAgICAgICAgICAgICAgICAgICAgOiBjcmVhdGVGZXRjaEZ1bmN0aW9uKHVybCwgbG9hZCkgLy8gbG9jYWxcbiAgICAgICAgICAgICksXG5cbiAgICAgICAgICAgIC8vIGNhbGxlZCB3aGVuIHRoZSBmaWxlIGlzIGxvYWRlZCBzbyBpdCBjYW4gYmUgcGlwZWQgdGhyb3VnaCB0aGUgZmlsdGVyc1xuICAgICAgICAgICAgKGZpbGUsIHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gbGV0J3MgcHJvY2VzcyB0aGUgZmlsZVxuICAgICAgICAgICAgICAgIGFwcGx5RmlsdGVyQ2hhaW4oJ0xPQURfRklMRScsIGZpbGUsIHsgcXVlcnkgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oc3VjY2VzcylcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgUkVRVUVTVF9QUkVQQVJFX09VVFBVVDogKHsgaXRlbSwgc3VjY2VzcywgZmFpbHVyZSA9ICgpID0+IHt9IH0pID0+IHtcbiAgICAgICAgLy8gZXJyb3IgcmVzcG9uc2UgaWYgaXRlbSBhcmNoaXZlZFxuICAgICAgICBjb25zdCBlcnIgPSB7XG4gICAgICAgICAgICBlcnJvcjogY3JlYXRlUmVzcG9uc2UoJ2Vycm9yJywgMCwgJ0l0ZW0gbm90IGZvdW5kJyksXG4gICAgICAgICAgICBmaWxlOiBudWxsLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGRvbid0IGhhbmRsZSBhcmNoaXZlZCBpdGVtcywgYW4gaXRlbSBjb3VsZCBoYXZlIGJlZW4gYXJjaGl2ZWQgKGxvYWQgYWJvcnRlZCkgd2hpbGUgd2FpdGluZyB0byBiZSBwcmVwYXJlZFxuICAgICAgICBpZiAoaXRlbS5hcmNoaXZlZCkgcmV0dXJuIGZhaWx1cmUoZXJyKTtcblxuICAgICAgICAvLyBhbGxvdyBwbHVnaW5zIHRvIGFsdGVyIHRoZSBmaWxlIGRhdGFcbiAgICAgICAgYXBwbHlGaWx0ZXJDaGFpbignUFJFUEFSRV9PVVRQVVQnLCBpdGVtLmZpbGUsIHsgcXVlcnksIGl0ZW0gfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgYXBwbHlGaWx0ZXJDaGFpbignQ09NUExFVEVfUFJFUEFSRV9PVVRQVVQnLCByZXN1bHQsIHsgcXVlcnksIGl0ZW0gfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGRvbid0IGhhbmRsZSBhcmNoaXZlZCBpdGVtcywgYW4gaXRlbSBjb3VsZCBoYXZlIGJlZW4gYXJjaGl2ZWQgKGxvYWQgYWJvcnRlZCkgd2hpbGUgYmVpbmcgcHJlcGFyZWRcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5hcmNoaXZlZCkgcmV0dXJuIGZhaWx1cmUoZXJyKTtcblxuICAgICAgICAgICAgICAgIC8vIHdlIGRvbmUhXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXN1bHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBDT01QTEVURV9MT0FEX0lURU06ICh7IGl0ZW0sIGRhdGEgfSkgPT4ge1xuICAgICAgICBjb25zdCB7IHN1Y2Nlc3MsIHNvdXJjZSB9ID0gZGF0YTtcblxuICAgICAgICAvLyBzb3J0IGl0ZW1zIGluIGxpc3RcbiAgICAgICAgY29uc3QgaXRlbUluc2VydExvY2F0aW9uID0gcXVlcnkoJ0dFVF9JVEVNX0lOU0VSVF9MT0NBVElPTicpO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihpdGVtSW5zZXJ0TG9jYXRpb24pICYmIHNvdXJjZSkge1xuICAgICAgICAgICAgc29ydEl0ZW1zKHN0YXRlLCBpdGVtSW5zZXJ0TG9jYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbGV0IGludGVyZmFjZSBrbm93IHRoZSBpdGVtIGhhcyBsb2FkZWRcbiAgICAgICAgZGlzcGF0Y2goJ0RJRF9MT0FEX0lURU0nLCB7XG4gICAgICAgICAgICBpZDogaXRlbS5pZCxcbiAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgc2VydmVyRmlsZVJlZmVyZW5jZTogaXRlbS5vcmlnaW4gPT09IEZpbGVPcmlnaW4uSU5QVVQgPyBudWxsIDogc291cmNlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBpdGVtIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBsb2FkZWQgYW5kIGFkZGVkIHRvIHRoZVxuICAgICAgICAvLyBsaXN0IG9mIGl0ZW1zIHNvIGNhbiBub3cgYmUgc2FmZWx5IHJldHVybmVkIGZvciB1c2VcbiAgICAgICAgc3VjY2VzcyhjcmVhdGVJdGVtQVBJKGl0ZW0pKTtcblxuICAgICAgICAvLyBpZiB0aGlzIGlzIGEgbG9jYWwgc2VydmVyIGZpbGUgd2UgbmVlZCB0byBzaG93IGEgZGlmZmVyZW50IHN0YXRlXG4gICAgICAgIGlmIChpdGVtLm9yaWdpbiA9PT0gRmlsZU9yaWdpbi5MT0NBTCkge1xuICAgICAgICAgICAgZGlzcGF0Y2goJ0RJRF9MT0FEX0xPQ0FMX0lURU0nLCB7IGlkOiBpdGVtLmlkIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgaXMgYSB0ZW1wIHNlcnZlciBmaWxlIHdlIHByZXZlbnQgYXN5bmMgdXBsb2FkIGNhbGwgaGVyZSAoYXMgdGhlIGZpbGUgaXMgYWxyZWFkeSBvbiB0aGUgc2VydmVyKVxuICAgICAgICBpZiAoaXRlbS5vcmlnaW4gPT09IEZpbGVPcmlnaW4uTElNQk8pIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdESURfQ09NUExFVEVfSVRFTV9QUk9DRVNTSU5HJywge1xuICAgICAgICAgICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgICAgIHNlcnZlckZpbGVSZWZlcmVuY2U6IHNvdXJjZSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkaXNwYXRjaCgnRElEX0RFRklORV9WQUxVRScsIHtcbiAgICAgICAgICAgICAgICBpZDogaXRlbS5pZCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbS5zZXJ2ZXJJZCB8fCBzb3VyY2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlkIHdlIGFyZSBhbGxvd2VkIHRvIHVwbG9hZCB0aGUgZmlsZSBpbW1lZGlhdGVseSwgbGV0cyBkbyBpdFxuICAgICAgICBpZiAocXVlcnkoJ0lTX0FTWU5DJykgJiYgc3RhdGUub3B0aW9ucy5pbnN0YW50VXBsb2FkKSB7XG4gICAgICAgICAgICBkaXNwYXRjaCgnUkVRVUVTVF9JVEVNX1BST0NFU1NJTkcnLCB7IHF1ZXJ5OiBpdGVtLmlkIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFJFVFJZX0lURU1fTE9BRDogZ2V0SXRlbUJ5UXVlcnlGcm9tU3RhdGUoc3RhdGUsIGl0ZW0gPT4ge1xuICAgICAgICAvLyB0cnkgbG9hZGluZyB0aGUgc291cmNlIG9uZSBtb3JlIHRpbWVcbiAgICAgICAgaXRlbS5yZXRyeUxvYWQoKTtcbiAgICB9KSxcblxuICAgIFJFUVVFU1RfSVRFTV9QUkVQQVJFOiBnZXRJdGVtQnlRdWVyeUZyb21TdGF0ZShzdGF0ZSwgKGl0ZW0sIHN1Y2Nlc3MsIGZhaWx1cmUpID0+IHtcbiAgICAgICAgZGlzcGF0Y2goXG4gICAgICAgICAgICAnUkVRVUVTVF9QUkVQQVJFX09VVFBVVCcsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcXVlcnk6IGl0ZW0uaWQsXG4gICAgICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmaWxlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goJ0RJRF9QUkVQQVJFX09VVFBVVCcsIHsgaWQ6IGl0ZW0uaWQsIGZpbGUgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dDogZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmYWlsdXJlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcbiAgICB9KSxcblxuICAgIFJFUVVFU1RfSVRFTV9QUk9DRVNTSU5HOiBnZXRJdGVtQnlRdWVyeUZyb21TdGF0ZShzdGF0ZSwgKGl0ZW0sIHN1Y2Nlc3MsIGZhaWx1cmUpID0+IHtcbiAgICAgICAgLy8gY2Fubm90IGJlIHF1ZXVlZCAob3IgaXMgYWxyZWFkeSBxdWV1ZWQpXG4gICAgICAgIGNvbnN0IGl0ZW1DYW5CZVF1ZXVlZEZvclByb2Nlc3NpbmcgPVxuICAgICAgICAgICAgLy8gd2FpdGluZyBmb3Igc29tZXRoaW5nXG4gICAgICAgICAgICBpdGVtLnN0YXR1cyA9PT0gSXRlbVN0YXR1cy5JRExFIHx8XG4gICAgICAgICAgICAvLyBwcm9jZXNzaW5nIHdlbnQgd3JvbmcgZWFybGllclxuICAgICAgICAgICAgaXRlbS5zdGF0dXMgPT09IEl0ZW1TdGF0dXMuUFJPQ0VTU0lOR19FUlJPUjtcblxuICAgICAgICAvLyBub3QgcmVhZHkgdG8gYmUgcHJvY2Vzc2VkXG4gICAgICAgIGlmICghaXRlbUNhbkJlUXVldWVkRm9yUHJvY2Vzc2luZykge1xuICAgICAgICAgICAgY29uc3QgcHJvY2Vzc05vdyA9ICgpID0+XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goJ1JFUVVFU1RfSVRFTV9QUk9DRVNTSU5HJywgeyBxdWVyeTogaXRlbSwgc3VjY2VzcywgZmFpbHVyZSB9KTtcblxuICAgICAgICAgICAgY29uc3QgcHJvY2VzcyA9ICgpID0+IChkb2N1bWVudC5oaWRkZW4gPyBwcm9jZXNzTm93KCkgOiBzZXRUaW1lb3V0KHByb2Nlc3NOb3csIDMyKSk7XG5cbiAgICAgICAgICAgIC8vIGlmIGFscmVhZHkgZG9uZSBwcm9jZXNzaW5nIG9yIHRyaWVkIHRvIHJldmVydCBidXQgZGlkbid0IHdvcmssIHRyeSBhZ2FpblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGl0ZW0uc3RhdHVzID09PSBJdGVtU3RhdHVzLlBST0NFU1NJTkdfQ09NUExFVEUgfHxcbiAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9PT0gSXRlbVN0YXR1cy5QUk9DRVNTSU5HX1JFVkVSVF9FUlJPUlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5yZXZlcnQoXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVJldmVydEZ1bmN0aW9uKHN0YXRlLm9wdGlvbnMuc2VydmVyLnVybCwgc3RhdGUub3B0aW9ucy5zZXJ2ZXIucmV2ZXJ0KSxcbiAgICAgICAgICAgICAgICAgICAgcXVlcnkoJ0dFVF9GT1JDRV9SRVZFUlQnKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4ocHJvY2VzcylcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHt9KTsgLy8gZG9uJ3QgY29udGludWUgd2l0aCBwcm9jZXNzaW5nIGlmIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uc3RhdHVzID09PSBJdGVtU3RhdHVzLlBST0NFU1NJTkcpIHtcbiAgICAgICAgICAgICAgICBpdGVtLmFib3J0UHJvY2Vzc2luZygpLnRoZW4ocHJvY2Vzcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFscmVhZHkgcXVldWVkIGZvciBwcm9jZXNzaW5nXG4gICAgICAgIGlmIChpdGVtLnN0YXR1cyA9PT0gSXRlbVN0YXR1cy5QUk9DRVNTSU5HX1FVRVVFRCkgcmV0dXJuO1xuXG4gICAgICAgIGl0ZW0ucmVxdWVzdFByb2Nlc3NpbmcoKTtcblxuICAgICAgICBkaXNwYXRjaCgnRElEX1JFUVVFU1RfSVRFTV9QUk9DRVNTSU5HJywgeyBpZDogaXRlbS5pZCB9KTtcblxuICAgICAgICBkaXNwYXRjaCgnUFJPQ0VTU19JVEVNJywgeyBxdWVyeTogaXRlbSwgc3VjY2VzcywgZmFpbHVyZSB9LCB0cnVlKTtcbiAgICB9KSxcblxuICAgIFBST0NFU1NfSVRFTTogZ2V0SXRlbUJ5UXVlcnlGcm9tU3RhdGUoc3RhdGUsIChpdGVtLCBzdWNjZXNzLCBmYWlsdXJlKSA9PiB7XG4gICAgICAgIGNvbnN0IG1heFBhcmFsbGVsVXBsb2FkcyA9IHF1ZXJ5KCdHRVRfTUFYX1BBUkFMTEVMX1VQTE9BRFMnKTtcbiAgICAgICAgY29uc3QgdG90YWxDdXJyZW50VXBsb2FkcyA9IHF1ZXJ5KCdHRVRfSVRFTVNfQllfU1RBVFVTJywgSXRlbVN0YXR1cy5QUk9DRVNTSU5HKS5sZW5ndGg7XG5cbiAgICAgICAgLy8gcXVldWUgYW5kIHdhaXQgdGlsbCBxdWV1ZSBpcyBmcmVlZCB1cFxuICAgICAgICBpZiAodG90YWxDdXJyZW50VXBsb2FkcyA9PT0gbWF4UGFyYWxsZWxVcGxvYWRzKSB7XG4gICAgICAgICAgICAvLyBxdWV1ZSBmb3IgbGF0ZXIgcHJvY2Vzc2luZ1xuICAgICAgICAgICAgc3RhdGUucHJvY2Vzc2luZ1F1ZXVlLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MsXG4gICAgICAgICAgICAgICAgZmFpbHVyZSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzdG9wIGl0IVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgd2FzIG5vdCBxdWV1ZWQgb3IgaXMgYWxyZWFkeSBwcm9jZXNzaW5nIGV4aXQgaGVyZVxuICAgICAgICBpZiAoaXRlbS5zdGF0dXMgPT09IEl0ZW1TdGF0dXMuUFJPQ0VTU0lORykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHByb2Nlc3NOZXh0ID0gKCkgPT4ge1xuICAgICAgICAgICAgLy8gcHJvY2VzcyBxdWV1ZXVkIGl0ZW1zXG4gICAgICAgICAgICBjb25zdCBxdWV1ZUVudHJ5ID0gc3RhdGUucHJvY2Vzc2luZ1F1ZXVlLnNoaWZ0KCk7XG5cbiAgICAgICAgICAgIC8vIG5vIGl0ZW1zIGxlZnRcbiAgICAgICAgICAgIGlmICghcXVldWVFbnRyeSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBnZXQgaXRlbSByZWZlcmVuY2VcbiAgICAgICAgICAgIGNvbnN0IHsgaWQsIHN1Y2Nlc3MsIGZhaWx1cmUgfSA9IHF1ZXVlRW50cnk7XG4gICAgICAgICAgICBjb25zdCBpdGVtUmVmZXJlbmNlID0gZ2V0SXRlbUJ5UXVlcnkoc3RhdGUuaXRlbXMsIGlkKTtcblxuICAgICAgICAgICAgLy8gaWYgaXRlbSB3YXMgYXJjaGl2ZWQgd2hpbGUgaW4gcXVldWUsIGp1bXAgdG8gbmV4dFxuICAgICAgICAgICAgaWYgKCFpdGVtUmVmZXJlbmNlIHx8IGl0ZW1SZWZlcmVuY2UuYXJjaGl2ZWQpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzTmV4dCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcHJvY2VzcyBxdWV1ZWQgaXRlbVxuICAgICAgICAgICAgZGlzcGF0Y2goJ1BST0NFU1NfSVRFTScsIHsgcXVlcnk6IGlkLCBzdWNjZXNzLCBmYWlsdXJlIH0sIHRydWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHdlIGRvbmUgZnVuY3Rpb25cbiAgICAgICAgaXRlbS5vbk9uY2UoJ3Byb2Nlc3MtY29tcGxldGUnLCAoKSA9PiB7XG4gICAgICAgICAgICBzdWNjZXNzKGNyZWF0ZUl0ZW1BUEkoaXRlbSkpO1xuICAgICAgICAgICAgcHJvY2Vzc05leHQoKTtcblxuICAgICAgICAgICAgLy8gaWYgb3JpZ2luIGlzIGxvY2FsLCBhbmQgd2UncmUgaW5zdGFudCB1cGxvYWRpbmcsIHRyaWdnZXIgcmVtb3ZlIG9mIG9yaWdpbmFsXG4gICAgICAgICAgICAvLyBhcyByZXZlcnQgd2lsbCByZW1vdmUgZmlsZSBmcm9tIGxpc3RcbiAgICAgICAgICAgIGNvbnN0IHNlcnZlciA9IHN0YXRlLm9wdGlvbnMuc2VydmVyO1xuICAgICAgICAgICAgY29uc3QgaW5zdGFudFVwbG9hZCA9IHN0YXRlLm9wdGlvbnMuaW5zdGFudFVwbG9hZDtcbiAgICAgICAgICAgIGlmIChpbnN0YW50VXBsb2FkICYmIGl0ZW0ub3JpZ2luID09PSBGaWxlT3JpZ2luLkxPQ0FMICYmIGlzRnVuY3Rpb24oc2VydmVyLnJlbW92ZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBub29wID0gKCkgPT4ge307XG4gICAgICAgICAgICAgICAgaXRlbS5vcmlnaW4gPSBGaWxlT3JpZ2luLkxJTUJPO1xuICAgICAgICAgICAgICAgIHN0YXRlLm9wdGlvbnMuc2VydmVyLnJlbW92ZShpdGVtLnNvdXJjZSwgbm9vcCwgbm9vcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFsbCBpdGVtcyBwcm9jZXNzZWQ/IE5vIGVycm9ycz9cbiAgICAgICAgICAgIGNvbnN0IGFsbEl0ZW1zUHJvY2Vzc2VkID1cbiAgICAgICAgICAgICAgICBxdWVyeSgnR0VUX0lURU1TX0JZX1NUQVRVUycsIEl0ZW1TdGF0dXMuUFJPQ0VTU0lOR19DT01QTEVURSkubGVuZ3RoID09PVxuICAgICAgICAgICAgICAgIHN0YXRlLml0ZW1zLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChhbGxJdGVtc1Byb2Nlc3NlZCkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoKCdESURfQ09NUExFVEVfSVRFTV9QUk9DRVNTSU5HX0FMTCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyB3ZSBlcnJvciBmdW5jdGlvblxuICAgICAgICBpdGVtLm9uT25jZSgncHJvY2Vzcy1lcnJvcicsIGVycm9yID0+IHtcbiAgICAgICAgICAgIGZhaWx1cmUoeyBlcnJvciwgZmlsZTogY3JlYXRlSXRlbUFQSShpdGVtKSB9KTtcbiAgICAgICAgICAgIHByb2Nlc3NOZXh0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGFib3J0IGZ1bmN0aW9uXG4gICAgICAgIGl0ZW0ub25PbmNlKCdwcm9jZXNzLWFib3J0JywgKCkgPT4ge1xuICAgICAgICAgICAgcHJvY2Vzc05leHQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc3RhcnQgZmlsZSBwcm9jZXNzaW5nXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBzdGF0ZS5vcHRpb25zO1xuICAgICAgICBpdGVtLnByb2Nlc3MoXG4gICAgICAgICAgICBjcmVhdGVGaWxlUHJvY2Vzc29yKFxuICAgICAgICAgICAgICAgIGNyZWF0ZVByb2Nlc3NvckZ1bmN0aW9uKG9wdGlvbnMuc2VydmVyLnVybCwgb3B0aW9ucy5zZXJ2ZXIucHJvY2Vzcywgb3B0aW9ucy5uYW1lLCB7XG4gICAgICAgICAgICAgICAgICAgIGNodW5rVHJhbnNmZXJJZDogaXRlbS50cmFuc2ZlcklkLFxuICAgICAgICAgICAgICAgICAgICBjaHVua1NlcnZlcjogb3B0aW9ucy5zZXJ2ZXIucGF0Y2gsXG4gICAgICAgICAgICAgICAgICAgIGNodW5rVXBsb2Fkczogb3B0aW9ucy5jaHVua1VwbG9hZHMsXG4gICAgICAgICAgICAgICAgICAgIGNodW5rRm9yY2U6IG9wdGlvbnMuY2h1bmtGb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgY2h1bmtTaXplOiBvcHRpb25zLmNodW5rU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgY2h1bmtSZXRyeURlbGF5czogb3B0aW9ucy5jaHVua1JldHJ5RGVsYXlzLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dNaW5pbXVtVXBsb2FkRHVyYXRpb246IHF1ZXJ5KCdHRVRfQUxMT1dfTUlOSU1VTV9VUExPQURfRFVSQVRJT04nKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgLy8gY2FsbGVkIHdoZW4gdGhlIGZpbGUgaXMgYWJvdXQgdG8gYmUgcHJvY2Vzc2VkIHNvIGl0IGNhbiBiZSBwaXBlZCB0aHJvdWdoIHRoZSB0cmFuc2Zvcm0gZmlsdGVyc1xuICAgICAgICAgICAgKGZpbGUsIHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gYWxsb3cgcGx1Z2lucyB0byBhbHRlciB0aGUgZmlsZSBkYXRhXG4gICAgICAgICAgICAgICAgYXBwbHlGaWx0ZXJDaGFpbignUFJFUEFSRV9PVVRQVVQnLCBmaWxlLCB7IHF1ZXJ5LCBpdGVtIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZpbGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goJ0RJRF9QUkVQQVJFX09VVFBVVCcsIHsgaWQ6IGl0ZW0uaWQsIGZpbGUgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSksXG5cbiAgICBSRVRSWV9JVEVNX1BST0NFU1NJTkc6IGdldEl0ZW1CeVF1ZXJ5RnJvbVN0YXRlKHN0YXRlLCBpdGVtID0+IHtcbiAgICAgICAgZGlzcGF0Y2goJ1JFUVVFU1RfSVRFTV9QUk9DRVNTSU5HJywgeyBxdWVyeTogaXRlbSB9KTtcbiAgICB9KSxcblxuICAgIFJFUVVFU1RfUkVNT1ZFX0lURU06IGdldEl0ZW1CeVF1ZXJ5RnJvbVN0YXRlKHN0YXRlLCBpdGVtID0+IHtcbiAgICAgICAgb3B0aW9uYWxQcm9taXNlKHF1ZXJ5KCdHRVRfQkVGT1JFX1JFTU9WRV9GSUxFJyksIGNyZWF0ZUl0ZW1BUEkoaXRlbSkpLnRoZW4oc2hvdWxkUmVtb3ZlID0+IHtcbiAgICAgICAgICAgIGlmICghc2hvdWxkUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGlzcGF0Y2goJ1JFTU9WRV9JVEVNJywgeyBxdWVyeTogaXRlbSB9KTtcbiAgICAgICAgfSk7XG4gICAgfSksXG5cbiAgICBSRUxFQVNFX0lURU06IGdldEl0ZW1CeVF1ZXJ5RnJvbVN0YXRlKHN0YXRlLCBpdGVtID0+IHtcbiAgICAgICAgaXRlbS5yZWxlYXNlKCk7XG4gICAgfSksXG5cbiAgICBSRU1PVkVfSVRFTTogZ2V0SXRlbUJ5UXVlcnlGcm9tU3RhdGUoc3RhdGUsIChpdGVtLCBzdWNjZXNzLCBmYWlsdXJlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbW92ZUZyb21WaWV3ID0gKCkgPT4ge1xuICAgICAgICAgICAgLy8gZ2V0IGlkIHJlZmVyZW5jZVxuICAgICAgICAgICAgY29uc3QgaWQgPSBpdGVtLmlkO1xuXG4gICAgICAgICAgICAvLyBhcmNoaXZlIHRoZSBpdGVtLCB0aGlzIGRvZXMgbm90IHJlbW92ZSBpdCBmcm9tIHRoZSBsaXN0XG4gICAgICAgICAgICBnZXRJdGVtQnlJZChzdGF0ZS5pdGVtcywgaWQpLmFyY2hpdmUoKTtcblxuICAgICAgICAgICAgLy8gdGVsbCB0aGUgdmlldyB0aGUgaXRlbSBoYXMgYmVlbiByZW1vdmVkXG4gICAgICAgICAgICBkaXNwYXRjaCgnRElEX1JFTU9WRV9JVEVNJywgeyBlcnJvcjogbnVsbCwgaWQsIGl0ZW0gfSk7XG5cbiAgICAgICAgICAgIC8vIG5vdyB0aGUgbGlzdCBoYXMgYmVlbiBtb2RpZmllZFxuICAgICAgICAgICAgbGlzdFVwZGF0ZWQoZGlzcGF0Y2gsIHN0YXRlKTtcblxuICAgICAgICAgICAgLy8gY29ycmVjdGx5IHJlbW92ZWRcbiAgICAgICAgICAgIHN1Y2Nlc3MoY3JlYXRlSXRlbUFQSShpdGVtKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhIGxvY2FsIGZpbGUgYW5kIHRoZSBgc2VydmVyLnJlbW92ZWAgZnVuY3Rpb24gaGFzIGJlZW4gY29uZmlndXJlZCxcbiAgICAgICAgLy8gc2VuZCBzb3VyY2UgdGhlcmUgc28gZGV2IGNhbiByZW1vdmUgZmlsZSBmcm9tIHNlcnZlclxuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBzdGF0ZS5vcHRpb25zLnNlcnZlcjtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgaXRlbS5vcmlnaW4gPT09IEZpbGVPcmlnaW4uTE9DQUwgJiZcbiAgICAgICAgICAgIHNlcnZlciAmJlxuICAgICAgICAgICAgaXNGdW5jdGlvbihzZXJ2ZXIucmVtb3ZlKSAmJlxuICAgICAgICAgICAgb3B0aW9ucy5yZW1vdmUgIT09IGZhbHNlXG4gICAgICAgICkge1xuICAgICAgICAgICAgZGlzcGF0Y2goJ0RJRF9TVEFSVF9JVEVNX1JFTU9WRScsIHsgaWQ6IGl0ZW0uaWQgfSk7XG5cbiAgICAgICAgICAgIHNlcnZlci5yZW1vdmUoXG4gICAgICAgICAgICAgICAgaXRlbS5zb3VyY2UsXG4gICAgICAgICAgICAgICAgKCkgPT4gcmVtb3ZlRnJvbVZpZXcoKSxcbiAgICAgICAgICAgICAgICBzdGF0dXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCgnRElEX1RIUk9XX0lURU1fUkVNT1ZFX0VSUk9SJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogY3JlYXRlUmVzcG9uc2UoJ2Vycm9yJywgMCwgc3RhdHVzLCBudWxsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IGR5bmFtaWNMYWJlbChzdGF0ZS5vcHRpb25zLmxhYmVsRmlsZVJlbW92ZUVycm9yKShzdGF0dXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Yjogc3RhdGUub3B0aW9ucy5sYWJlbFRhcFRvUmV0cnksXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgaXMgcmVxdWVzdGluZyByZXZlcnQgYW5kIGNhbiByZXZlcnQgbmVlZCB0byBjYWxsIHJldmVydCBoYW5kbGVyIChub3QgY2FsbGluZyByZXF1ZXN0XyBiZWNhdXNlIHRoYXQgd291bGQgYWxzbyB0cmlnZ2VyIGJlZm9yZVJlbW92ZUhvb2spXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKG9wdGlvbnMucmV2ZXJ0ICYmIGl0ZW0ub3JpZ2luICE9PSBGaWxlT3JpZ2luLkxPQ0FMICYmIGl0ZW0uc2VydmVySWQgIT09IG51bGwpIHx8XG4gICAgICAgICAgICAgICAgLy8gaWYgY2h1bmtlZCB1cGxvYWRzIGFyZSBlbmFibGVkIGFuZCB3ZSdyZSB1cGxvYWRpbmcgaW4gY2h1bmtzIGZvciB0aGlzIHNwZWNpZmljIGZpbGVcbiAgICAgICAgICAgICAgICAvLyBvciBpZiB0aGUgZmlsZSBpc24ndCBiaWcgZW5vdWdoIGZvciBjaHVua2VkIHVwbG9hZHMgYnV0IGNodW5rRm9yY2UgaXMgc2V0IHRoZW4gY2FsbFxuICAgICAgICAgICAgICAgIC8vIHJldmVydCBiZWZvcmUgcmVtb3ZpbmcgZnJvbSB0aGUgdmlldy4uLlxuICAgICAgICAgICAgICAgIChzdGF0ZS5vcHRpb25zLmNodW5rVXBsb2FkcyAmJiBpdGVtLmZpbGUuc2l6ZSA+IHN0YXRlLm9wdGlvbnMuY2h1bmtTaXplKSB8fFxuICAgICAgICAgICAgICAgIChzdGF0ZS5vcHRpb25zLmNodW5rVXBsb2FkcyAmJiBzdGF0ZS5vcHRpb25zLmNodW5rRm9yY2UpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBpdGVtLnJldmVydChcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlUmV2ZXJ0RnVuY3Rpb24oc3RhdGUub3B0aW9ucy5zZXJ2ZXIudXJsLCBzdGF0ZS5vcHRpb25zLnNlcnZlci5yZXZlcnQpLFxuICAgICAgICAgICAgICAgICAgICBxdWVyeSgnR0VUX0ZPUkNFX1JFVkVSVCcpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2FuIG5vdyBzYWZlbHkgcmVtb3ZlIGZyb20gdmlld1xuICAgICAgICAgICAgcmVtb3ZlRnJvbVZpZXcoKTtcbiAgICAgICAgfVxuICAgIH0pLFxuXG4gICAgQUJPUlRfSVRFTV9MT0FEOiBnZXRJdGVtQnlRdWVyeUZyb21TdGF0ZShzdGF0ZSwgaXRlbSA9PiB7XG4gICAgICAgIGl0ZW0uYWJvcnRMb2FkKCk7XG4gICAgfSksXG5cbiAgICBBQk9SVF9JVEVNX1BST0NFU1NJTkc6IGdldEl0ZW1CeVF1ZXJ5RnJvbVN0YXRlKHN0YXRlLCBpdGVtID0+IHtcbiAgICAgICAgLy8gdGVzdCBpZiBpcyBhbHJlYWR5IHByb2Nlc3NlZFxuICAgICAgICBpZiAoaXRlbS5zZXJ2ZXJJZCkge1xuICAgICAgICAgICAgZGlzcGF0Y2goJ1JFVkVSVF9JVEVNX1BST0NFU1NJTkcnLCB7IGlkOiBpdGVtLmlkIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWJvcnRcbiAgICAgICAgaXRlbS5hYm9ydFByb2Nlc3NpbmcoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZFJlbW92ZSA9IHN0YXRlLm9wdGlvbnMuaW5zdGFudFVwbG9hZDtcbiAgICAgICAgICAgIGlmIChzaG91bGRSZW1vdmUpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCgnUkVNT1ZFX0lURU0nLCB7IHF1ZXJ5OiBpdGVtLmlkIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KSxcblxuICAgIFJFUVVFU1RfUkVWRVJUX0lURU1fUFJPQ0VTU0lORzogZ2V0SXRlbUJ5UXVlcnlGcm9tU3RhdGUoc3RhdGUsIGl0ZW0gPT4ge1xuICAgICAgICAvLyBub3QgaW5zdGFudCB1cGxvYWRpbmcsIHJldmVydCBpbW1lZGlhdGVseVxuICAgICAgICBpZiAoIXN0YXRlLm9wdGlvbnMuaW5zdGFudFVwbG9hZCkge1xuICAgICAgICAgICAgZGlzcGF0Y2goJ1JFVkVSVF9JVEVNX1BST0NFU1NJTkcnLCB7IHF1ZXJ5OiBpdGVtIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgd2UncmUgaW5zdGFudCB1cGxvYWRpbmcgdGhlIGZpbGUgd2lsbCBhbHNvIGJlIHJlbW92ZWQgaWYgd2UgcmV2ZXJ0LFxuICAgICAgICAvLyBzbyBpZiBhIGJlZm9yZSByZW1vdmUgZmlsZSBob29rIGlzIGRlZmluZWQgd2UgbmVlZCB0byBydW4gaXQgbm93XG4gICAgICAgIGNvbnN0IGhhbmRsZVJldmVydCA9IHNob3VsZFJldmVydCA9PiB7XG4gICAgICAgICAgICBpZiAoIXNob3VsZFJldmVydCkgcmV0dXJuO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ1JFVkVSVF9JVEVNX1BST0NFU1NJTkcnLCB7IHF1ZXJ5OiBpdGVtIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGZuID0gcXVlcnkoJ0dFVF9CRUZPUkVfUkVNT1ZFX0ZJTEUnKTtcbiAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZVJldmVydCh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlcXVlc3RSZW1vdmVSZXN1bHQgPSBmbihjcmVhdGVJdGVtQVBJKGl0ZW0pKTtcbiAgICAgICAgaWYgKHJlcXVlc3RSZW1vdmVSZXN1bHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gdW5kZWZpbmVkIG9yIG51bGxcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVSZXZlcnQodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3RSZW1vdmVSZXN1bHQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZVJldmVydChyZXF1ZXN0UmVtb3ZlUmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdFJlbW92ZVJlc3VsdC50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXF1ZXN0UmVtb3ZlUmVzdWx0LnRoZW4oaGFuZGxlUmV2ZXJ0KTtcbiAgICAgICAgfVxuICAgIH0pLFxuXG4gICAgUkVWRVJUX0lURU1fUFJPQ0VTU0lORzogZ2V0SXRlbUJ5UXVlcnlGcm9tU3RhdGUoc3RhdGUsIGl0ZW0gPT4ge1xuICAgICAgICBpdGVtLnJldmVydChcbiAgICAgICAgICAgIGNyZWF0ZVJldmVydEZ1bmN0aW9uKHN0YXRlLm9wdGlvbnMuc2VydmVyLnVybCwgc3RhdGUub3B0aW9ucy5zZXJ2ZXIucmV2ZXJ0KSxcbiAgICAgICAgICAgIHF1ZXJ5KCdHRVRfRk9SQ0VfUkVWRVJUJylcbiAgICAgICAgKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNob3VsZFJlbW92ZSA9IHN0YXRlLm9wdGlvbnMuaW5zdGFudFVwbG9hZCB8fCBpc01vY2tJdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGlmIChzaG91bGRSZW1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goJ1JFTU9WRV9JVEVNJywgeyBxdWVyeTogaXRlbS5pZCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9KSxcblxuICAgIFNFVF9PUFRJT05TOiAoeyBvcHRpb25zIH0pID0+IHtcbiAgICAgICAgLy8gZ2V0IGFsbCBrZXlzIHBhc3NlZFxuICAgICAgICBjb25zdCBvcHRpb25LZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG5cbiAgICAgICAgLy8gZ2V0IHByaW9yaXRpemVkIGtleWVkIHRvIGluY2x1ZGUgKHJlbW92ZSBvbmNlIG5vdCBpbiBvcHRpb25zIG9iamVjdClcbiAgICAgICAgY29uc3QgcHJpb3JpdGl6ZWRPcHRpb25LZXlzID0gUHJpb3JpdGl6ZWRPcHRpb25zLmZpbHRlcihrZXkgPT4gb3B0aW9uS2V5cy5pbmNsdWRlcyhrZXkpKTtcblxuICAgICAgICAvLyBvcmRlciB0aGUga2V5cywgcHJpb3JpdGl6ZWQgZmlyc3QsIHRoZW4gcmVzdFxuICAgICAgICBjb25zdCBvcmRlcmVkT3B0aW9uS2V5cyA9IFtcbiAgICAgICAgICAgIC8vIGFkZCBwcmlvcml0aXplZCBmaXJzdCBpZiBwYXNzZWQgdG8gb3B0aW9ucywgZWxzZSByZW1vdmVcbiAgICAgICAgICAgIC4uLnByaW9yaXRpemVkT3B0aW9uS2V5cyxcblxuICAgICAgICAgICAgLy8gcHJldmVudCBkdXBsaWNhdGUga2V5c1xuICAgICAgICAgICAgLi4uT2JqZWN0LmtleXMob3B0aW9ucykuZmlsdGVyKGtleSA9PiAhcHJpb3JpdGl6ZWRPcHRpb25LZXlzLmluY2x1ZGVzKGtleSkpLFxuICAgICAgICBdO1xuXG4gICAgICAgIC8vIGRpc3BhdGNoIHNldCBldmVudCBmb3IgZWFjaCBvcHRpb25cbiAgICAgICAgb3JkZXJlZE9wdGlvbktleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgZGlzcGF0Y2goYFNFVF8ke2Zyb21DYW1lbHMoa2V5LCAnXycpLnRvVXBwZXJDYXNlKCl9YCwge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBvcHRpb25zW2tleV0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbn0pO1xuXG5jb25zdCBQcmlvcml0aXplZE9wdGlvbnMgPSBbXG4gICAgJ3NlcnZlcicsIC8vIG11c3QgYmUgcHJvY2Vzc2VkIGJlZm9yZSBcImZpbGVzXCJcbl07XG5cbmNvbnN0IGZvcm1hdEZpbGVuYW1lID0gbmFtZSA9PiBuYW1lO1xuXG5jb25zdCBjcmVhdGVFbGVtZW50JDEgPSB0YWdOYW1lID0+IHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbn07XG5cbmNvbnN0IHRleHQgPSAobm9kZSwgdmFsdWUpID0+IHtcbiAgICBsZXQgdGV4dE5vZGUgPSBub2RlLmNoaWxkTm9kZXNbMF07XG4gICAgaWYgKCF0ZXh0Tm9kZSkge1xuICAgICAgICB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZhbHVlKTtcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSAhPT0gdGV4dE5vZGUubm9kZVZhbHVlKSB7XG4gICAgICAgIHRleHROb2RlLm5vZGVWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbn07XG5cbmNvbnN0IHBvbGFyVG9DYXJ0ZXNpYW4gPSAoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBhbmdsZUluRGVncmVlcykgPT4ge1xuICAgIGNvbnN0IGFuZ2xlSW5SYWRpYW5zID0gKCgoYW5nbGVJbkRlZ3JlZXMgJSAzNjApIC0gOTApICogTWF0aC5QSSkgLyAxODAuMDtcbiAgICByZXR1cm4ge1xuICAgICAgICB4OiBjZW50ZXJYICsgcmFkaXVzICogTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpLFxuICAgICAgICB5OiBjZW50ZXJZICsgcmFkaXVzICogTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpLFxuICAgIH07XG59O1xuXG5jb25zdCBkZXNjcmliZUFyYyA9ICh4LCB5LCByYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBhcmNTd2VlcCkgPT4ge1xuICAgIGNvbnN0IHN0YXJ0ID0gcG9sYXJUb0NhcnRlc2lhbih4LCB5LCByYWRpdXMsIGVuZEFuZ2xlKTtcbiAgICBjb25zdCBlbmQgPSBwb2xhclRvQ2FydGVzaWFuKHgsIHksIHJhZGl1cywgc3RhcnRBbmdsZSk7XG4gICAgcmV0dXJuIFsnTScsIHN0YXJ0LngsIHN0YXJ0LnksICdBJywgcmFkaXVzLCByYWRpdXMsIDAsIGFyY1N3ZWVwLCAwLCBlbmQueCwgZW5kLnldLmpvaW4oJyAnKTtcbn07XG5cbmNvbnN0IHBlcmNlbnRhZ2VBcmMgPSAoeCwgeSwgcmFkaXVzLCBmcm9tLCB0bykgPT4ge1xuICAgIGxldCBhcmNTd2VlcCA9IDE7XG4gICAgaWYgKHRvID4gZnJvbSAmJiB0byAtIGZyb20gPD0gMC41KSB7XG4gICAgICAgIGFyY1N3ZWVwID0gMDtcbiAgICB9XG4gICAgaWYgKGZyb20gPiB0byAmJiBmcm9tIC0gdG8gPj0gMC41KSB7XG4gICAgICAgIGFyY1N3ZWVwID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2NyaWJlQXJjKFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByYWRpdXMsXG4gICAgICAgIE1hdGgubWluKDAuOTk5OSwgZnJvbSkgKiAzNjAsXG4gICAgICAgIE1hdGgubWluKDAuOTk5OSwgdG8pICogMzYwLFxuICAgICAgICBhcmNTd2VlcFxuICAgICk7XG59O1xuXG5jb25zdCBjcmVhdGUgPSAoeyByb290LCBwcm9wcyB9KSA9PiB7XG4gICAgLy8gc3RhcnQgYXQgMFxuICAgIHByb3BzLnNwaW4gPSBmYWxzZTtcbiAgICBwcm9wcy5wcm9ncmVzcyA9IDA7XG4gICAgcHJvcHMub3BhY2l0eSA9IDA7XG5cbiAgICAvLyBzdmdcbiAgICBjb25zdCBzdmcgPSBjcmVhdGVFbGVtZW50KCdzdmcnKTtcbiAgICByb290LnJlZi5wYXRoID0gY3JlYXRlRWxlbWVudCgncGF0aCcsIHtcbiAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDIsXG4gICAgICAgICdzdHJva2UtbGluZWNhcCc6ICdyb3VuZCcsXG4gICAgfSk7XG4gICAgc3ZnLmFwcGVuZENoaWxkKHJvb3QucmVmLnBhdGgpO1xuXG4gICAgcm9vdC5yZWYuc3ZnID0gc3ZnO1xuXG4gICAgcm9vdC5hcHBlbmRDaGlsZChzdmcpO1xufTtcblxuY29uc3Qgd3JpdGUgPSAoeyByb290LCBwcm9wcyB9KSA9PiB7XG4gICAgaWYgKHByb3BzLm9wYWNpdHkgPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5hbGlnbikge1xuICAgICAgICByb290LmVsZW1lbnQuZGF0YXNldC5hbGlnbiA9IHByb3BzLmFsaWduO1xuICAgIH1cblxuICAgIC8vIGdldCB3aWR0aCBvZiBzdHJva2VcbiAgICBjb25zdCByaW5nU3Ryb2tlV2lkdGggPSBwYXJzZUludChhdHRyKHJvb3QucmVmLnBhdGgsICdzdHJva2Utd2lkdGgnKSwgMTApO1xuXG4gICAgLy8gY2FsY3VsYXRlIHNpemUgb2YgcmluZ1xuICAgIGNvbnN0IHNpemUgPSByb290LnJlY3QuZWxlbWVudC53aWR0aCAqIDAuNTtcblxuICAgIC8vIHJpbmcgc3RhdGVcbiAgICBsZXQgcmluZ0Zyb20gPSAwO1xuICAgIGxldCByaW5nVG8gPSAwO1xuXG4gICAgLy8gbm93IGluIGJ1c3kgbW9kZVxuICAgIGlmIChwcm9wcy5zcGluKSB7XG4gICAgICAgIHJpbmdGcm9tID0gMDtcbiAgICAgICAgcmluZ1RvID0gMC41O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJpbmdGcm9tID0gMDtcbiAgICAgICAgcmluZ1RvID0gcHJvcHMucHJvZ3Jlc3M7XG4gICAgfVxuXG4gICAgLy8gZ2V0IGFyYyBwYXRoXG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBwZXJjZW50YWdlQXJjKHNpemUsIHNpemUsIHNpemUgLSByaW5nU3Ryb2tlV2lkdGgsIHJpbmdGcm9tLCByaW5nVG8pO1xuXG4gICAgLy8gdXBkYXRlIHByb2dyZXNzIGJhclxuICAgIGF0dHIocm9vdC5yZWYucGF0aCwgJ2QnLCBjb29yZGluYXRlcyk7XG5cbiAgICAvLyBoaWRlIHdoaWxlIGNvbnRhaW5zIDAgdmFsdWVcbiAgICBhdHRyKHJvb3QucmVmLnBhdGgsICdzdHJva2Utb3BhY2l0eScsIHByb3BzLnNwaW4gfHwgcHJvcHMucHJvZ3Jlc3MgPiAwID8gMSA6IDApO1xufTtcblxuY29uc3QgcHJvZ3Jlc3NJbmRpY2F0b3IgPSBjcmVhdGVWaWV3KHtcbiAgICB0YWc6ICdkaXYnLFxuICAgIG5hbWU6ICdwcm9ncmVzcy1pbmRpY2F0b3InLFxuICAgIGlnbm9yZVJlY3RVcGRhdGU6IHRydWUsXG4gICAgaWdub3JlUmVjdDogdHJ1ZSxcbiAgICBjcmVhdGUsXG4gICAgd3JpdGUsXG4gICAgbWl4aW5zOiB7XG4gICAgICAgIGFwaXM6IFsncHJvZ3Jlc3MnLCAnc3BpbicsICdhbGlnbiddLFxuICAgICAgICBzdHlsZXM6IFsnb3BhY2l0eSddLFxuICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICBvcGFjaXR5OiB7IHR5cGU6ICd0d2VlbicsIGR1cmF0aW9uOiA1MDAgfSxcbiAgICAgICAgICAgIHByb2dyZXNzOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3NwcmluZycsXG4gICAgICAgICAgICAgICAgc3RpZmZuZXNzOiAwLjk1LFxuICAgICAgICAgICAgICAgIGRhbXBpbmc6IDAuNjUsXG4gICAgICAgICAgICAgICAgbWFzczogMTAsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0sXG59KTtcblxuY29uc3QgY3JlYXRlJDEgPSAoeyByb290LCBwcm9wcyB9KSA9PiB7XG4gICAgcm9vdC5lbGVtZW50LmlubmVySFRNTCA9IChwcm9wcy5pY29uIHx8ICcnKSArIGA8c3Bhbj4ke3Byb3BzLmxhYmVsfTwvc3Bhbj5gO1xuXG4gICAgcHJvcHMuaXNEaXNhYmxlZCA9IGZhbHNlO1xufTtcblxuY29uc3Qgd3JpdGUkMSA9ICh7IHJvb3QsIHByb3BzIH0pID0+IHtcbiAgICBjb25zdCB7IGlzRGlzYWJsZWQgfSA9IHByb3BzO1xuICAgIGNvbnN0IHNob3VsZERpc2FibGUgPSByb290LnF1ZXJ5KCdHRVRfRElTQUJMRUQnKSB8fCBwcm9wcy5vcGFjaXR5ID09PSAwO1xuXG4gICAgaWYgKHNob3VsZERpc2FibGUgJiYgIWlzRGlzYWJsZWQpIHtcbiAgICAgICAgcHJvcHMuaXNEaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIGF0dHIocm9vdC5lbGVtZW50LCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICB9IGVsc2UgaWYgKCFzaG91bGREaXNhYmxlICYmIGlzRGlzYWJsZWQpIHtcbiAgICAgICAgcHJvcHMuaXNEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByb290LmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIH1cbn07XG5cbmNvbnN0IGZpbGVBY3Rpb25CdXR0b24gPSBjcmVhdGVWaWV3KHtcbiAgICB0YWc6ICdidXR0b24nLFxuICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgdHlwZTogJ2J1dHRvbicsXG4gICAgfSxcbiAgICBpZ25vcmVSZWN0OiB0cnVlLFxuICAgIGlnbm9yZVJlY3RVcGRhdGU6IHRydWUsXG4gICAgbmFtZTogJ2ZpbGUtYWN0aW9uLWJ1dHRvbicsXG4gICAgbWl4aW5zOiB7XG4gICAgICAgIGFwaXM6IFsnbGFiZWwnXSxcbiAgICAgICAgc3R5bGVzOiBbJ3RyYW5zbGF0ZVgnLCAndHJhbnNsYXRlWScsICdzY2FsZVgnLCAnc2NhbGVZJywgJ29wYWNpdHknXSxcbiAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgc2NhbGVYOiAnc3ByaW5nJyxcbiAgICAgICAgICAgIHNjYWxlWTogJ3NwcmluZycsXG4gICAgICAgICAgICB0cmFuc2xhdGVYOiAnc3ByaW5nJyxcbiAgICAgICAgICAgIHRyYW5zbGF0ZVk6ICdzcHJpbmcnLFxuICAgICAgICAgICAgb3BhY2l0eTogeyB0eXBlOiAndHdlZW4nLCBkdXJhdGlvbjogMjUwIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGxpc3RlbmVyczogdHJ1ZSxcbiAgICB9LFxuICAgIGNyZWF0ZTogY3JlYXRlJDEsXG4gICAgd3JpdGU6IHdyaXRlJDEsXG59KTtcblxuY29uc3QgdG9OYXR1cmFsRmlsZVNpemUgPSAoYnl0ZXMsIGRlY2ltYWxTZXBhcmF0b3IgPSAnLicsIGJhc2UgPSAxMDAwLCBvcHRpb25zID0ge30pID0+IHtcbiAgICBjb25zdCB7XG4gICAgICAgIGxhYmVsQnl0ZXMgPSAnYnl0ZXMnLFxuICAgICAgICBsYWJlbEtpbG9ieXRlcyA9ICdLQicsXG4gICAgICAgIGxhYmVsTWVnYWJ5dGVzID0gJ01CJyxcbiAgICAgICAgbGFiZWxHaWdhYnl0ZXMgPSAnR0InLFxuICAgIH0gPSBvcHRpb25zO1xuXG4gICAgLy8gbm8gbmVnYXRpdmUgYnl0ZSBzaXplc1xuICAgIGJ5dGVzID0gTWF0aC5yb3VuZChNYXRoLmFicyhieXRlcykpO1xuXG4gICAgY29uc3QgS0IgPSBiYXNlO1xuICAgIGNvbnN0IE1CID0gYmFzZSAqIGJhc2U7XG4gICAgY29uc3QgR0IgPSBiYXNlICogYmFzZSAqIGJhc2U7XG5cbiAgICAvLyBqdXN0IGJ5dGVzXG4gICAgaWYgKGJ5dGVzIDwgS0IpIHtcbiAgICAgICAgcmV0dXJuIGAke2J5dGVzfSAke2xhYmVsQnl0ZXN9YDtcbiAgICB9XG5cbiAgICAvLyBraWxvYnl0ZXNcbiAgICBpZiAoYnl0ZXMgPCBNQikge1xuICAgICAgICByZXR1cm4gYCR7TWF0aC5mbG9vcihieXRlcyAvIEtCKX0gJHtsYWJlbEtpbG9ieXRlc31gO1xuICAgIH1cblxuICAgIC8vIG1lZ2FieXRlc1xuICAgIGlmIChieXRlcyA8IEdCKSB7XG4gICAgICAgIHJldHVybiBgJHtyZW1vdmVEZWNpbWFsc1doZW5aZXJvKGJ5dGVzIC8gTUIsIDEsIGRlY2ltYWxTZXBhcmF0b3IpfSAke2xhYmVsTWVnYWJ5dGVzfWA7XG4gICAgfVxuXG4gICAgLy8gZ2lnYWJ5dGVzXG4gICAgcmV0dXJuIGAke3JlbW92ZURlY2ltYWxzV2hlblplcm8oYnl0ZXMgLyBHQiwgMiwgZGVjaW1hbFNlcGFyYXRvcil9ICR7bGFiZWxHaWdhYnl0ZXN9YDtcbn07XG5cbmNvbnN0IHJlbW92ZURlY2ltYWxzV2hlblplcm8gPSAodmFsdWUsIGRlY2ltYWxDb3VudCwgc2VwYXJhdG9yKSA9PiB7XG4gICAgcmV0dXJuIHZhbHVlXG4gICAgICAgIC50b0ZpeGVkKGRlY2ltYWxDb3VudClcbiAgICAgICAgLnNwbGl0KCcuJylcbiAgICAgICAgLmZpbHRlcihwYXJ0ID0+IHBhcnQgIT09ICcwJylcbiAgICAgICAgLmpvaW4oc2VwYXJhdG9yKTtcbn07XG5cbmNvbnN0IGNyZWF0ZSQyID0gKHsgcm9vdCwgcHJvcHMgfSkgPT4ge1xuICAgIC8vIGZpbGVuYW1lXG4gICAgY29uc3QgZmlsZU5hbWUgPSBjcmVhdGVFbGVtZW50JDEoJ3NwYW4nKTtcbiAgICBmaWxlTmFtZS5jbGFzc05hbWUgPSAnZmlsZXBvbmQtLWZpbGUtaW5mby1tYWluJztcbiAgICAvLyBoaWRlIGZvciBzY3JlZW5yZWFkZXJzXG4gICAgLy8gdGhlIGZpbGUgaXMgY29udGFpbmVkIGluIGEgZmllbGRzZXQgd2l0aCBsZWdlbmQgdGhhdCBjb250YWlucyB0aGUgZmlsZW5hbWVcbiAgICAvLyBubyBuZWVkIHRvIHJlYWQgaXQgdHdpY2VcbiAgICBhdHRyKGZpbGVOYW1lLCAnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoZmlsZU5hbWUpO1xuICAgIHJvb3QucmVmLmZpbGVOYW1lID0gZmlsZU5hbWU7XG5cbiAgICAvLyBmaWxlc2l6ZVxuICAgIGNvbnN0IGZpbGVTaXplID0gY3JlYXRlRWxlbWVudCQxKCdzcGFuJyk7XG4gICAgZmlsZVNpemUuY2xhc3NOYW1lID0gJ2ZpbGVwb25kLS1maWxlLWluZm8tc3ViJztcbiAgICByb290LmFwcGVuZENoaWxkKGZpbGVTaXplKTtcbiAgICByb290LnJlZi5maWxlU2l6ZSA9IGZpbGVTaXplO1xuXG4gICAgLy8gc2V0IGluaXRpYWwgdmFsdWVzXG4gICAgdGV4dChmaWxlU2l6ZSwgcm9vdC5xdWVyeSgnR0VUX0xBQkVMX0ZJTEVfV0FJVElOR19GT1JfU0laRScpKTtcbiAgICB0ZXh0KGZpbGVOYW1lLCBmb3JtYXRGaWxlbmFtZShyb290LnF1ZXJ5KCdHRVRfSVRFTV9OQU1FJywgcHJvcHMuaWQpKSk7XG59O1xuXG5jb25zdCB1cGRhdGVGaWxlID0gKHsgcm9vdCwgcHJvcHMgfSkgPT4ge1xuICAgIHRleHQoXG4gICAgICAgIHJvb3QucmVmLmZpbGVTaXplLFxuICAgICAgICB0b05hdHVyYWxGaWxlU2l6ZShcbiAgICAgICAgICAgIHJvb3QucXVlcnkoJ0dFVF9JVEVNX1NJWkUnLCBwcm9wcy5pZCksXG4gICAgICAgICAgICAnLicsXG4gICAgICAgICAgICByb290LnF1ZXJ5KCdHRVRfRklMRV9TSVpFX0JBU0UnKSxcbiAgICAgICAgICAgIHJvb3QucXVlcnkoJ0dFVF9GSUxFX1NJWkVfTEFCRUxTJywgcm9vdC5xdWVyeSlcbiAgICAgICAgKVxuICAgICk7XG4gICAgdGV4dChyb290LnJlZi5maWxlTmFtZSwgZm9ybWF0RmlsZW5hbWUocm9vdC5xdWVyeSgnR0VUX0lURU1fTkFNRScsIHByb3BzLmlkKSkpO1xufTtcblxuY29uc3QgdXBkYXRlRmlsZVNpemVPbkVycm9yID0gKHsgcm9vdCwgcHJvcHMgfSkgPT4ge1xuICAgIC8vIGlmIHNpemUgaXMgYXZhaWxhYmxlIGRvbid0IGZhbGxiYWNrIHRvIHVua25vd24gc2l6ZSBtZXNzYWdlXG4gICAgaWYgKGlzSW50KHJvb3QucXVlcnkoJ0dFVF9JVEVNX1NJWkUnLCBwcm9wcy5pZCkpKSB7XG4gICAgICAgIHVwZGF0ZUZpbGUoeyByb290LCBwcm9wcyB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRleHQocm9vdC5yZWYuZmlsZVNpemUsIHJvb3QucXVlcnkoJ0dFVF9MQUJFTF9GSUxFX1NJWkVfTk9UX0FWQUlMQUJMRScpKTtcbn07XG5cbmNvbnN0IGZpbGVJbmZvID0gY3JlYXRlVmlldyh7XG4gICAgbmFtZTogJ2ZpbGUtaW5mbycsXG4gICAgaWdub3JlUmVjdDogdHJ1ZSxcbiAgICBpZ25vcmVSZWN0VXBkYXRlOiB0cnVlLFxuICAgIHdyaXRlOiBjcmVhdGVSb3V0ZSh7XG4gICAgICAgIERJRF9MT0FEX0lURU06IHVwZGF0ZUZpbGUsXG4gICAgICAgIERJRF9VUERBVEVfSVRFTV9NRVRBOiB1cGRhdGVGaWxlLFxuICAgICAgICBESURfVEhST1dfSVRFTV9MT0FEX0VSUk9SOiB1cGRhdGVGaWxlU2l6ZU9uRXJyb3IsXG4gICAgICAgIERJRF9USFJPV19JVEVNX0lOVkFMSUQ6IHVwZGF0ZUZpbGVTaXplT25FcnJvcixcbiAgICB9KSxcbiAgICBkaWRDcmVhdGVWaWV3OiByb290ID0+IHtcbiAgICAgICAgYXBwbHlGaWx0ZXJzKCdDUkVBVEVfVklFVycsIHsgLi4ucm9vdCwgdmlldzogcm9vdCB9KTtcbiAgICB9LFxuICAgIGNyZWF0ZTogY3JlYXRlJDIsXG4gICAgbWl4aW5zOiB7XG4gICAgICAgIHN0eWxlczogWyd0cmFuc2xhdGVYJywgJ3RyYW5zbGF0ZVknXSxcbiAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgdHJhbnNsYXRlWDogJ3NwcmluZycsXG4gICAgICAgICAgICB0cmFuc2xhdGVZOiAnc3ByaW5nJyxcbiAgICAgICAgfSxcbiAgICB9LFxufSk7XG5cbmNvbnN0IHRvUGVyY2VudGFnZSA9IHZhbHVlID0+IE1hdGgucm91bmQodmFsdWUgKiAxMDApO1xuXG5jb25zdCBjcmVhdGUkMyA9ICh7IHJvb3QgfSkgPT4ge1xuICAgIC8vIG1haW4gc3RhdHVzXG4gICAgY29uc3QgbWFpbiA9IGNyZWF0ZUVsZW1lbnQkMSgnc3BhbicpO1xuICAgIG1haW4uY2xhc3NOYW1lID0gJ2ZpbGVwb25kLS1maWxlLXN0YXR1cy1tYWluJztcbiAgICByb290LmFwcGVuZENoaWxkKG1haW4pO1xuICAgIHJvb3QucmVmLm1haW4gPSBtYWluO1xuXG4gICAgLy8gc3ViIHN0YXR1c1xuICAgIGNvbnN0IHN1YiA9IGNyZWF0ZUVsZW1lbnQkMSgnc3BhbicpO1xuICAgIHN1Yi5jbGFzc05hbWUgPSAnZmlsZXBvbmQtLWZpbGUtc3RhdHVzLXN1Yic7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChzdWIpO1xuICAgIHJvb3QucmVmLnN1YiA9IHN1YjtcblxuICAgIGRpZFNldEl0ZW1Mb2FkUHJvZ3Jlc3MoeyByb290LCBhY3Rpb246IHsgcHJvZ3Jlc3M6IG51bGwgfSB9KTtcbn07XG5cbmNvbnN0IGRpZFNldEl0ZW1Mb2FkUHJvZ3Jlc3MgPSAoeyByb290LCBhY3Rpb24gfSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID1cbiAgICAgICAgYWN0aW9uLnByb2dyZXNzID09PSBudWxsXG4gICAgICAgICAgICA/IHJvb3QucXVlcnkoJ0dFVF9MQUJFTF9GSUxFX0xPQURJTkcnKVxuICAgICAgICAgICAgOiBgJHtyb290LnF1ZXJ5KCdHRVRfTEFCRUxfRklMRV9MT0FESU5HJyl9ICR7dG9QZXJjZW50YWdlKGFjdGlvbi5wcm9ncmVzcyl9JWA7XG4gICAgdGV4dChyb290LnJlZi5tYWluLCB0aXRsZSk7XG4gICAgdGV4dChyb290LnJlZi5zdWIsIHJvb3QucXVlcnkoJ0dFVF9MQUJFTF9UQVBfVE9fQ0FOQ0VMJykpO1xufTtcblxuY29uc3QgZGlkU2V0SXRlbVByb2Nlc3NQcm9ncmVzcyA9ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgY29uc3QgdGl0bGUgPVxuICAgICAgICBhY3Rpb24ucHJvZ3Jlc3MgPT09IG51bGxcbiAgICAgICAgICAgID8gcm9vdC5xdWVyeSgnR0VUX0xBQkVMX0ZJTEVfUFJPQ0VTU0lORycpXG4gICAgICAgICAgICA6IGAke3Jvb3QucXVlcnkoJ0dFVF9MQUJFTF9GSUxFX1BST0NFU1NJTkcnKX0gJHt0b1BlcmNlbnRhZ2UoYWN0aW9uLnByb2dyZXNzKX0lYDtcbiAgICB0ZXh0KHJvb3QucmVmLm1haW4sIHRpdGxlKTtcbiAgICB0ZXh0KHJvb3QucmVmLnN1Yiwgcm9vdC5xdWVyeSgnR0VUX0xBQkVMX1RBUF9UT19DQU5DRUwnKSk7XG59O1xuXG5jb25zdCBkaWRSZXF1ZXN0SXRlbVByb2Nlc3NpbmcgPSAoeyByb290IH0pID0+IHtcbiAgICB0ZXh0KHJvb3QucmVmLm1haW4sIHJvb3QucXVlcnkoJ0dFVF9MQUJFTF9GSUxFX1BST0NFU1NJTkcnKSk7XG4gICAgdGV4dChyb290LnJlZi5zdWIsIHJvb3QucXVlcnkoJ0dFVF9MQUJFTF9UQVBfVE9fQ0FOQ0VMJykpO1xufTtcblxuY29uc3QgZGlkQWJvcnRJdGVtUHJvY2Vzc2luZyA9ICh7IHJvb3QgfSkgPT4ge1xuICAgIHRleHQocm9vdC5yZWYubWFpbiwgcm9vdC5xdWVyeSgnR0VUX0xBQkVMX0ZJTEVfUFJPQ0VTU0lOR19BQk9SVEVEJykpO1xuICAgIHRleHQocm9vdC5yZWYuc3ViLCByb290LnF1ZXJ5KCdHRVRfTEFCRUxfVEFQX1RPX1JFVFJZJykpO1xufTtcblxuY29uc3QgZGlkQ29tcGxldGVJdGVtUHJvY2Vzc2luZyA9ICh7IHJvb3QgfSkgPT4ge1xuICAgIHRleHQocm9vdC5yZWYubWFpbiwgcm9vdC5xdWVyeSgnR0VUX0xBQkVMX0ZJTEVfUFJPQ0VTU0lOR19DT01QTEVURScpKTtcbiAgICB0ZXh0KHJvb3QucmVmLnN1Yiwgcm9vdC5xdWVyeSgnR0VUX0xBQkVMX1RBUF9UT19VTkRPJykpO1xufTtcblxuY29uc3QgY2xlYXIgPSAoeyByb290IH0pID0+IHtcbiAgICB0ZXh0KHJvb3QucmVmLm1haW4sICcnKTtcbiAgICB0ZXh0KHJvb3QucmVmLnN1YiwgJycpO1xufTtcblxuY29uc3QgZXJyb3IgPSAoeyByb290LCBhY3Rpb24gfSkgPT4ge1xuICAgIHRleHQocm9vdC5yZWYubWFpbiwgYWN0aW9uLnN0YXR1cy5tYWluKTtcbiAgICB0ZXh0KHJvb3QucmVmLnN1YiwgYWN0aW9uLnN0YXR1cy5zdWIpO1xufTtcblxuY29uc3QgZmlsZVN0YXR1cyA9IGNyZWF0ZVZpZXcoe1xuICAgIG5hbWU6ICdmaWxlLXN0YXR1cycsXG4gICAgaWdub3JlUmVjdDogdHJ1ZSxcbiAgICBpZ25vcmVSZWN0VXBkYXRlOiB0cnVlLFxuICAgIHdyaXRlOiBjcmVhdGVSb3V0ZSh7XG4gICAgICAgIERJRF9MT0FEX0lURU06IGNsZWFyLFxuICAgICAgICBESURfUkVWRVJUX0lURU1fUFJPQ0VTU0lORzogY2xlYXIsXG4gICAgICAgIERJRF9SRVFVRVNUX0lURU1fUFJPQ0VTU0lORzogZGlkUmVxdWVzdEl0ZW1Qcm9jZXNzaW5nLFxuICAgICAgICBESURfQUJPUlRfSVRFTV9QUk9DRVNTSU5HOiBkaWRBYm9ydEl0ZW1Qcm9jZXNzaW5nLFxuICAgICAgICBESURfQ09NUExFVEVfSVRFTV9QUk9DRVNTSU5HOiBkaWRDb21wbGV0ZUl0ZW1Qcm9jZXNzaW5nLFxuICAgICAgICBESURfVVBEQVRFX0lURU1fUFJPQ0VTU19QUk9HUkVTUzogZGlkU2V0SXRlbVByb2Nlc3NQcm9ncmVzcyxcbiAgICAgICAgRElEX1VQREFURV9JVEVNX0xPQURfUFJPR1JFU1M6IGRpZFNldEl0ZW1Mb2FkUHJvZ3Jlc3MsXG4gICAgICAgIERJRF9USFJPV19JVEVNX0xPQURfRVJST1I6IGVycm9yLFxuICAgICAgICBESURfVEhST1dfSVRFTV9JTlZBTElEOiBlcnJvcixcbiAgICAgICAgRElEX1RIUk9XX0lURU1fUFJPQ0VTU0lOR19FUlJPUjogZXJyb3IsXG4gICAgICAgIERJRF9USFJPV19JVEVNX1BST0NFU1NJTkdfUkVWRVJUX0VSUk9SOiBlcnJvcixcbiAgICAgICAgRElEX1RIUk9XX0lURU1fUkVNT1ZFX0VSUk9SOiBlcnJvcixcbiAgICB9KSxcbiAgICBkaWRDcmVhdGVWaWV3OiByb290ID0+IHtcbiAgICAgICAgYXBwbHlGaWx0ZXJzKCdDUkVBVEVfVklFVycsIHsgLi4ucm9vdCwgdmlldzogcm9vdCB9KTtcbiAgICB9LFxuICAgIGNyZWF0ZTogY3JlYXRlJDMsXG4gICAgbWl4aW5zOiB7XG4gICAgICAgIHN0eWxlczogWyd0cmFuc2xhdGVYJywgJ3RyYW5zbGF0ZVknLCAnb3BhY2l0eSddLFxuICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICBvcGFjaXR5OiB7IHR5cGU6ICd0d2VlbicsIGR1cmF0aW9uOiAyNTAgfSxcbiAgICAgICAgICAgIHRyYW5zbGF0ZVg6ICdzcHJpbmcnLFxuICAgICAgICAgICAgdHJhbnNsYXRlWTogJ3NwcmluZycsXG4gICAgICAgIH0sXG4gICAgfSxcbn0pO1xuXG4vKipcbiAqIEJ1dHRvbiBkZWZpbml0aW9ucyBmb3IgdGhlIGZpbGUgdmlld1xuICovXG5cbmNvbnN0IEJ1dHRvbnMgPSB7XG4gICAgQWJvcnRJdGVtTG9hZDoge1xuICAgICAgICBsYWJlbDogJ0dFVF9MQUJFTF9CVVRUT05fQUJPUlRfSVRFTV9MT0FEJyxcbiAgICAgICAgYWN0aW9uOiAnQUJPUlRfSVRFTV9MT0FEJyxcbiAgICAgICAgY2xhc3NOYW1lOiAnZmlsZXBvbmQtLWFjdGlvbi1hYm9ydC1pdGVtLWxvYWQnLFxuICAgICAgICBhbGlnbjogJ0xPQURfSU5ESUNBVE9SX1BPU0lUSU9OJywgLy8gcmlnaHRcbiAgICB9LFxuICAgIFJldHJ5SXRlbUxvYWQ6IHtcbiAgICAgICAgbGFiZWw6ICdHRVRfTEFCRUxfQlVUVE9OX1JFVFJZX0lURU1fTE9BRCcsXG4gICAgICAgIGFjdGlvbjogJ1JFVFJZX0lURU1fTE9BRCcsXG4gICAgICAgIGljb246ICdHRVRfSUNPTl9SRVRSWScsXG4gICAgICAgIGNsYXNzTmFtZTogJ2ZpbGVwb25kLS1hY3Rpb24tcmV0cnktaXRlbS1sb2FkJyxcbiAgICAgICAgYWxpZ246ICdCVVRUT05fUFJPQ0VTU19JVEVNX1BPU0lUSU9OJywgLy8gcmlnaHRcbiAgICB9LFxuICAgIFJlbW92ZUl0ZW06IHtcbiAgICAgICAgbGFiZWw6ICdHRVRfTEFCRUxfQlVUVE9OX1JFTU9WRV9JVEVNJyxcbiAgICAgICAgYWN0aW9uOiAnUkVRVUVTVF9SRU1PVkVfSVRFTScsXG4gICAgICAgIGljb246ICdHRVRfSUNPTl9SRU1PVkUnLFxuICAgICAgICBjbGFzc05hbWU6ICdmaWxlcG9uZC0tYWN0aW9uLXJlbW92ZS1pdGVtJyxcbiAgICAgICAgYWxpZ246ICdCVVRUT05fUkVNT1ZFX0lURU1fUE9TSVRJT04nLCAvLyBsZWZ0XG4gICAgfSxcbiAgICBQcm9jZXNzSXRlbToge1xuICAgICAgICBsYWJlbDogJ0dFVF9MQUJFTF9CVVRUT05fUFJPQ0VTU19JVEVNJyxcbiAgICAgICAgYWN0aW9uOiAnUkVRVUVTVF9JVEVNX1BST0NFU1NJTkcnLFxuICAgICAgICBpY29uOiAnR0VUX0lDT05fUFJPQ0VTUycsXG4gICAgICAgIGNsYXNzTmFtZTogJ2ZpbGVwb25kLS1hY3Rpb24tcHJvY2Vzcy1pdGVtJyxcbiAgICAgICAgYWxpZ246ICdCVVRUT05fUFJPQ0VTU19JVEVNX1BPU0lUSU9OJywgLy8gcmlnaHRcbiAgICB9LFxuICAgIEFib3J0SXRlbVByb2Nlc3Npbmc6IHtcbiAgICAgICAgbGFiZWw6ICdHRVRfTEFCRUxfQlVUVE9OX0FCT1JUX0lURU1fUFJPQ0VTU0lORycsXG4gICAgICAgIGFjdGlvbjogJ0FCT1JUX0lURU1fUFJPQ0VTU0lORycsXG4gICAgICAgIGNsYXNzTmFtZTogJ2ZpbGVwb25kLS1hY3Rpb24tYWJvcnQtaXRlbS1wcm9jZXNzaW5nJyxcbiAgICAgICAgYWxpZ246ICdCVVRUT05fUFJPQ0VTU19JVEVNX1BPU0lUSU9OJywgLy8gcmlnaHRcbiAgICB9LFxuICAgIFJldHJ5SXRlbVByb2Nlc3Npbmc6IHtcbiAgICAgICAgbGFiZWw6ICdHRVRfTEFCRUxfQlVUVE9OX1JFVFJZX0lURU1fUFJPQ0VTU0lORycsXG4gICAgICAgIGFjdGlvbjogJ1JFVFJZX0lURU1fUFJPQ0VTU0lORycsXG4gICAgICAgIGljb246ICdHRVRfSUNPTl9SRVRSWScsXG4gICAgICAgIGNsYXNzTmFtZTogJ2ZpbGVwb25kLS1hY3Rpb24tcmV0cnktaXRlbS1wcm9jZXNzaW5nJyxcbiAgICAgICAgYWxpZ246ICdCVVRUT05fUFJPQ0VTU19JVEVNX1BPU0lUSU9OJywgLy8gcmlnaHRcbiAgICB9LFxuICAgIFJldmVydEl0ZW1Qcm9jZXNzaW5nOiB7XG4gICAgICAgIGxhYmVsOiAnR0VUX0xBQkVMX0JVVFRPTl9VTkRPX0lURU1fUFJPQ0VTU0lORycsXG4gICAgICAgIGFjdGlvbjogJ1JFUVVFU1RfUkVWRVJUX0lURU1fUFJPQ0VTU0lORycsXG4gICAgICAgIGljb246ICdHRVRfSUNPTl9VTkRPJyxcbiAgICAgICAgY2xhc3NOYW1lOiAnZmlsZXBvbmQtLWFjdGlvbi1yZXZlcnQtaXRlbS1wcm9jZXNzaW5nJyxcbiAgICAgICAgYWxpZ246ICdCVVRUT05fUFJPQ0VTU19JVEVNX1BPU0lUSU9OJywgLy8gcmlnaHRcbiAgICB9LFxufTtcblxuLy8gbWFrZSBhIGxpc3Qgb2YgYnV0dG9ucywgd2UgY2FuIHRoZW4gcmVtb3ZlIGJ1dHRvbnMgZnJvbSB0aGlzIGxpc3QgaWYgdGhleSdyZSBkaXNhYmxlZFxuY29uc3QgQnV0dG9uS2V5cyA9IFtdO1xuZm9yaW4oQnV0dG9ucywga2V5ID0+IHtcbiAgICBCdXR0b25LZXlzLnB1c2goa2V5KTtcbn0pO1xuXG5jb25zdCBjYWxjdWxhdGVGaWxlSW5mb09mZnNldCA9IHJvb3QgPT4ge1xuICAgIGlmIChnZXRSZW1vdmVJbmRpY2F0b3JBbGlnbWVudChyb290KSA9PT0gJ3JpZ2h0JykgcmV0dXJuIDA7XG4gICAgY29uc3QgYnV0dG9uUmVjdCA9IHJvb3QucmVmLmJ1dHRvblJlbW92ZUl0ZW0ucmVjdC5lbGVtZW50O1xuICAgIHJldHVybiBidXR0b25SZWN0LmhpZGRlbiA/IG51bGwgOiBidXR0b25SZWN0LndpZHRoICsgYnV0dG9uUmVjdC5sZWZ0O1xufTtcblxuY29uc3QgY2FsY3VsYXRlQnV0dG9uV2lkdGggPSByb290ID0+IHtcbiAgICBjb25zdCBidXR0b25SZWN0ID0gcm9vdC5yZWYuYnV0dG9uQWJvcnRJdGVtTG9hZC5yZWN0LmVsZW1lbnQ7XG4gICAgcmV0dXJuIGJ1dHRvblJlY3Qud2lkdGg7XG59O1xuXG4vLyBGb3JjZSBvbiBmdWxsIHBpeGVscyBzbyB0ZXh0IHN0YXlzIGNyaXBzXG5jb25zdCBjYWxjdWxhdGVGaWxlVmVydGljYWxDZW50ZXJPZmZzZXQgPSByb290ID0+XG4gICAgTWF0aC5mbG9vcihyb290LnJlZi5idXR0b25SZW1vdmVJdGVtLnJlY3QuZWxlbWVudC5oZWlnaHQgLyA0KTtcbmNvbnN0IGNhbGN1bGF0ZUZpbGVIb3Jpem9udGFsQ2VudGVyT2Zmc2V0ID0gcm9vdCA9PlxuICAgIE1hdGguZmxvb3Iocm9vdC5yZWYuYnV0dG9uUmVtb3ZlSXRlbS5yZWN0LmVsZW1lbnQubGVmdCAvIDIpO1xuXG5jb25zdCBnZXRMb2FkSW5kaWNhdG9yQWxpZ25tZW50ID0gcm9vdCA9PiByb290LnF1ZXJ5KCdHRVRfU1RZTEVfTE9BRF9JTkRJQ0FUT1JfUE9TSVRJT04nKTtcbmNvbnN0IGdldFByb2Nlc3NJbmRpY2F0b3JBbGlnbm1lbnQgPSByb290ID0+IHJvb3QucXVlcnkoJ0dFVF9TVFlMRV9QUk9HUkVTU19JTkRJQ0FUT1JfUE9TSVRJT04nKTtcbmNvbnN0IGdldFJlbW92ZUluZGljYXRvckFsaWdtZW50ID0gcm9vdCA9PiByb290LnF1ZXJ5KCdHRVRfU1RZTEVfQlVUVE9OX1JFTU9WRV9JVEVNX1BPU0lUSU9OJyk7XG5cbmNvbnN0IERlZmF1bHRTdHlsZSA9IHtcbiAgICBidXR0b25BYm9ydEl0ZW1Mb2FkOiB7IG9wYWNpdHk6IDAgfSxcbiAgICBidXR0b25SZXRyeUl0ZW1Mb2FkOiB7IG9wYWNpdHk6IDAgfSxcbiAgICBidXR0b25SZW1vdmVJdGVtOiB7IG9wYWNpdHk6IDAgfSxcbiAgICBidXR0b25Qcm9jZXNzSXRlbTogeyBvcGFjaXR5OiAwIH0sXG4gICAgYnV0dG9uQWJvcnRJdGVtUHJvY2Vzc2luZzogeyBvcGFjaXR5OiAwIH0sXG4gICAgYnV0dG9uUmV0cnlJdGVtUHJvY2Vzc2luZzogeyBvcGFjaXR5OiAwIH0sXG4gICAgYnV0dG9uUmV2ZXJ0SXRlbVByb2Nlc3Npbmc6IHsgb3BhY2l0eTogMCB9LFxuICAgIGxvYWRQcm9ncmVzc0luZGljYXRvcjogeyBvcGFjaXR5OiAwLCBhbGlnbjogZ2V0TG9hZEluZGljYXRvckFsaWdubWVudCB9LFxuICAgIHByb2Nlc3NQcm9ncmVzc0luZGljYXRvcjogeyBvcGFjaXR5OiAwLCBhbGlnbjogZ2V0UHJvY2Vzc0luZGljYXRvckFsaWdubWVudCB9LFxuICAgIHByb2Nlc3NpbmdDb21wbGV0ZUluZGljYXRvcjogeyBvcGFjaXR5OiAwLCBzY2FsZVg6IDAuNzUsIHNjYWxlWTogMC43NSB9LFxuICAgIGluZm86IHsgdHJhbnNsYXRlWDogMCwgdHJhbnNsYXRlWTogMCwgb3BhY2l0eTogMCB9LFxuICAgIHN0YXR1czogeyB0cmFuc2xhdGVYOiAwLCB0cmFuc2xhdGVZOiAwLCBvcGFjaXR5OiAwIH0sXG59O1xuXG5jb25zdCBJZGxlU3R5bGUgPSB7XG4gICAgYnV0dG9uUmVtb3ZlSXRlbTogeyBvcGFjaXR5OiAxIH0sXG4gICAgYnV0dG9uUHJvY2Vzc0l0ZW06IHsgb3BhY2l0eTogMSB9LFxuICAgIGluZm86IHsgdHJhbnNsYXRlWDogY2FsY3VsYXRlRmlsZUluZm9PZmZzZXQgfSxcbiAgICBzdGF0dXM6IHsgdHJhbnNsYXRlWDogY2FsY3VsYXRlRmlsZUluZm9PZmZzZXQgfSxcbn07XG5cbmNvbnN0IFByb2Nlc3NpbmdTdHlsZSA9IHtcbiAgICBidXR0b25BYm9ydEl0ZW1Qcm9jZXNzaW5nOiB7IG9wYWNpdHk6IDEgfSxcbiAgICBwcm9jZXNzUHJvZ3Jlc3NJbmRpY2F0b3I6IHsgb3BhY2l0eTogMSB9LFxuICAgIHN0YXR1czogeyBvcGFjaXR5OiAxIH0sXG59O1xuXG5jb25zdCBTdHlsZU1hcCA9IHtcbiAgICBESURfVEhST1dfSVRFTV9JTlZBTElEOiB7XG4gICAgICAgIGJ1dHRvblJlbW92ZUl0ZW06IHsgb3BhY2l0eTogMSB9LFxuICAgICAgICBpbmZvOiB7IHRyYW5zbGF0ZVg6IGNhbGN1bGF0ZUZpbGVJbmZvT2Zmc2V0IH0sXG4gICAgICAgIHN0YXR1czogeyB0cmFuc2xhdGVYOiBjYWxjdWxhdGVGaWxlSW5mb09mZnNldCwgb3BhY2l0eTogMSB9LFxuICAgIH0sXG4gICAgRElEX1NUQVJUX0lURU1fTE9BRDoge1xuICAgICAgICBidXR0b25BYm9ydEl0ZW1Mb2FkOiB7IG9wYWNpdHk6IDEgfSxcbiAgICAgICAgbG9hZFByb2dyZXNzSW5kaWNhdG9yOiB7IG9wYWNpdHk6IDEgfSxcbiAgICAgICAgc3RhdHVzOiB7IG9wYWNpdHk6IDEgfSxcbiAgICB9LFxuICAgIERJRF9USFJPV19JVEVNX0xPQURfRVJST1I6IHtcbiAgICAgICAgYnV0dG9uUmV0cnlJdGVtTG9hZDogeyBvcGFjaXR5OiAxIH0sXG4gICAgICAgIGJ1dHRvblJlbW92ZUl0ZW06IHsgb3BhY2l0eTogMSB9LFxuICAgICAgICBpbmZvOiB7IHRyYW5zbGF0ZVg6IGNhbGN1bGF0ZUZpbGVJbmZvT2Zmc2V0IH0sXG4gICAgICAgIHN0YXR1czogeyBvcGFjaXR5OiAxIH0sXG4gICAgfSxcbiAgICBESURfU1RBUlRfSVRFTV9SRU1PVkU6IHtcbiAgICAgICAgcHJvY2Vzc1Byb2dyZXNzSW5kaWNhdG9yOiB7IG9wYWNpdHk6IDEsIGFsaWduOiBnZXRSZW1vdmVJbmRpY2F0b3JBbGlnbWVudCB9LFxuICAgICAgICBpbmZvOiB7IHRyYW5zbGF0ZVg6IGNhbGN1bGF0ZUZpbGVJbmZvT2Zmc2V0IH0sXG4gICAgICAgIHN0YXR1czogeyBvcGFjaXR5OiAwIH0sXG4gICAgfSxcbiAgICBESURfVEhST1dfSVRFTV9SRU1PVkVfRVJST1I6IHtcbiAgICAgICAgcHJvY2Vzc1Byb2dyZXNzSW5kaWNhdG9yOiB7IG9wYWNpdHk6IDAsIGFsaWduOiBnZXRSZW1vdmVJbmRpY2F0b3JBbGlnbWVudCB9LFxuICAgICAgICBidXR0b25SZW1vdmVJdGVtOiB7IG9wYWNpdHk6IDEgfSxcbiAgICAgICAgaW5mbzogeyB0cmFuc2xhdGVYOiBjYWxjdWxhdGVGaWxlSW5mb09mZnNldCB9LFxuICAgICAgICBzdGF0dXM6IHsgb3BhY2l0eTogMSwgdHJhbnNsYXRlWDogY2FsY3VsYXRlRmlsZUluZm9PZmZzZXQgfSxcbiAgICB9LFxuICAgIERJRF9MT0FEX0lURU06IElkbGVTdHlsZSxcbiAgICBESURfTE9BRF9MT0NBTF9JVEVNOiB7XG4gICAgICAgIGJ1dHRvblJlbW92ZUl0ZW06IHsgb3BhY2l0eTogMSB9LFxuICAgICAgICBpbmZvOiB7IHRyYW5zbGF0ZVg6IGNhbGN1bGF0ZUZpbGVJbmZvT2Zmc2V0IH0sXG4gICAgICAgIHN0YXR1czogeyB0cmFuc2xhdGVYOiBjYWxjdWxhdGVGaWxlSW5mb09mZnNldCB9LFxuICAgIH0sXG4gICAgRElEX1NUQVJUX0lURU1fUFJPQ0VTU0lORzogUHJvY2Vzc2luZ1N0eWxlLFxuICAgIERJRF9SRVFVRVNUX0lURU1fUFJPQ0VTU0lORzogUHJvY2Vzc2luZ1N0eWxlLFxuICAgIERJRF9VUERBVEVfSVRFTV9QUk9DRVNTX1BST0dSRVNTOiBQcm9jZXNzaW5nU3R5bGUsXG4gICAgRElEX0NPTVBMRVRFX0lURU1fUFJPQ0VTU0lORzoge1xuICAgICAgICBidXR0b25SZXZlcnRJdGVtUHJvY2Vzc2luZzogeyBvcGFjaXR5OiAxIH0sXG4gICAgICAgIGluZm86IHsgb3BhY2l0eTogMSB9LFxuICAgICAgICBzdGF0dXM6IHsgb3BhY2l0eTogMSB9LFxuICAgIH0sXG4gICAgRElEX1RIUk9XX0lURU1fUFJPQ0VTU0lOR19FUlJPUjoge1xuICAgICAgICBidXR0b25SZW1vdmVJdGVtOiB7IG9wYWNpdHk6IDEgfSxcbiAgICAgICAgYnV0dG9uUmV0cnlJdGVtUHJvY2Vzc2luZzogeyBvcGFjaXR5OiAxIH0sXG4gICAgICAgIHN0YXR1czogeyBvcGFjaXR5OiAxIH0sXG4gICAgICAgIGluZm86IHsgdHJhbnNsYXRlWDogY2FsY3VsYXRlRmlsZUluZm9PZmZzZXQgfSxcbiAgICB9LFxuICAgIERJRF9USFJPV19JVEVNX1BST0NFU1NJTkdfUkVWRVJUX0VSUk9SOiB7XG4gICAgICAgIGJ1dHRvblJldmVydEl0ZW1Qcm9jZXNzaW5nOiB7IG9wYWNpdHk6IDEgfSxcbiAgICAgICAgc3RhdHVzOiB7IG9wYWNpdHk6IDEgfSxcbiAgICAgICAgaW5mbzogeyBvcGFjaXR5OiAxIH0sXG4gICAgfSxcbiAgICBESURfQUJPUlRfSVRFTV9QUk9DRVNTSU5HOiB7XG4gICAgICAgIGJ1dHRvblJlbW92ZUl0ZW06IHsgb3BhY2l0eTogMSB9LFxuICAgICAgICBidXR0b25Qcm9jZXNzSXRlbTogeyBvcGFjaXR5OiAxIH0sXG4gICAgICAgIGluZm86IHsgdHJhbnNsYXRlWDogY2FsY3VsYXRlRmlsZUluZm9PZmZzZXQgfSxcbiAgICAgICAgc3RhdHVzOiB7IG9wYWNpdHk6IDEgfSxcbiAgICB9LFxuICAgIERJRF9SRVZFUlRfSVRFTV9QUk9DRVNTSU5HOiBJZGxlU3R5bGUsXG59O1xuXG4vLyBjb21wbGV0ZSBpbmRpY2F0b3Igdmlld1xuY29uc3QgcHJvY2Vzc2luZ0NvbXBsZXRlSW5kaWNhdG9yVmlldyA9IGNyZWF0ZVZpZXcoe1xuICAgIGNyZWF0ZTogKHsgcm9vdCB9KSA9PiB7XG4gICAgICAgIHJvb3QuZWxlbWVudC5pbm5lckhUTUwgPSByb290LnF1ZXJ5KCdHRVRfSUNPTl9ET05FJyk7XG4gICAgfSxcbiAgICBuYW1lOiAncHJvY2Vzc2luZy1jb21wbGV0ZS1pbmRpY2F0b3InLFxuICAgIGlnbm9yZVJlY3Q6IHRydWUsXG4gICAgbWl4aW5zOiB7XG4gICAgICAgIHN0eWxlczogWydzY2FsZVgnLCAnc2NhbGVZJywgJ29wYWNpdHknXSxcbiAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgc2NhbGVYOiAnc3ByaW5nJyxcbiAgICAgICAgICAgIHNjYWxlWTogJ3NwcmluZycsXG4gICAgICAgICAgICBvcGFjaXR5OiB7IHR5cGU6ICd0d2VlbicsIGR1cmF0aW9uOiAyNTAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxufSk7XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgZmlsZSB2aWV3XG4gKi9cbmNvbnN0IGNyZWF0ZSQ0ID0gKHsgcm9vdCwgcHJvcHMgfSkgPT4ge1xuICAgIC8vIGNvcHkgQnV0dG9ucyBvYmplY3RcbiAgICBjb25zdCBMb2NhbEJ1dHRvbnMgPSBPYmplY3Qua2V5cyhCdXR0b25zKS5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICAgICAgcHJldltjdXJyXSA9IHsgLi4uQnV0dG9uc1tjdXJyXSB9O1xuICAgICAgICByZXR1cm4gcHJldjtcbiAgICB9LCB7fSk7XG5cbiAgICBjb25zdCB7IGlkIH0gPSBwcm9wcztcblxuICAgIC8vIGFsbG93IHJldmVydGluZyB1cGxvYWRcbiAgICBjb25zdCBhbGxvd1JldmVydCA9IHJvb3QucXVlcnkoJ0dFVF9BTExPV19SRVZFUlQnKTtcblxuICAgIC8vIGFsbG93IHJlbW92ZSBmaWxlXG4gICAgY29uc3QgYWxsb3dSZW1vdmUgPSByb290LnF1ZXJ5KCdHRVRfQUxMT1dfUkVNT1ZFJyk7XG5cbiAgICAvLyBhbGxvdyBwcm9jZXNzaW5nIHVwbG9hZFxuICAgIGNvbnN0IGFsbG93UHJvY2VzcyA9IHJvb3QucXVlcnkoJ0dFVF9BTExPV19QUk9DRVNTJyk7XG5cbiAgICAvLyBpcyBpbnN0YW50IHVwbG9hZGluZywgbmVlZCB0aGlzIHRvIGRldGVybWluZSB0aGUgaWNvbiBvZiB0aGUgdW5kbyBidXR0b25cbiAgICBjb25zdCBpbnN0YW50VXBsb2FkID0gcm9vdC5xdWVyeSgnR0VUX0lOU1RBTlRfVVBMT0FEJyk7XG5cbiAgICAvLyBpcyBhc3luYyBzZXQgdXBcbiAgICBjb25zdCBpc0FzeW5jID0gcm9vdC5xdWVyeSgnSVNfQVNZTkMnKTtcblxuICAgIC8vIHNob3VsZCBhbGlnbiByZW1vdmUgaXRlbSBidXR0b25zXG4gICAgY29uc3QgYWxpZ25SZW1vdmVJdGVtQnV0dG9uID0gcm9vdC5xdWVyeSgnR0VUX1NUWUxFX0JVVFRPTl9SRU1PVkVfSVRFTV9BTElHTicpO1xuXG4gICAgLy8gZW5hYmxlZCBidXR0b25zIGFycmF5XG4gICAgbGV0IGJ1dHRvbkZpbHRlcjtcbiAgICBpZiAoaXNBc3luYykge1xuICAgICAgICBpZiAoYWxsb3dQcm9jZXNzICYmICFhbGxvd1JldmVydCkge1xuICAgICAgICAgICAgLy8gb25seSByZW1vdmUgcmV2ZXJ0IGJ1dHRvblxuICAgICAgICAgICAgYnV0dG9uRmlsdGVyID0ga2V5ID0+ICEvUmV2ZXJ0SXRlbVByb2Nlc3NpbmcvLnRlc3Qoa2V5KTtcbiAgICAgICAgfSBlbHNlIGlmICghYWxsb3dQcm9jZXNzICYmIGFsbG93UmV2ZXJ0KSB7XG4gICAgICAgICAgICAvLyBvbmx5IHJlbW92ZSBwcm9jZXNzIGJ1dHRvblxuICAgICAgICAgICAgYnV0dG9uRmlsdGVyID0ga2V5ID0+ICEvUHJvY2Vzc0l0ZW18UmV0cnlJdGVtUHJvY2Vzc2luZ3xBYm9ydEl0ZW1Qcm9jZXNzaW5nLy50ZXN0KGtleSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWFsbG93UHJvY2VzcyAmJiAhYWxsb3dSZXZlcnQpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBhbGwgcHJvY2VzcyBidXR0b25zXG4gICAgICAgICAgICBidXR0b25GaWx0ZXIgPSBrZXkgPT4gIS9Qcm9jZXNzLy50ZXN0KGtleSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBubyBwcm9jZXNzIGNvbnRyb2xzIGF2YWlsYWJsZVxuICAgICAgICBidXR0b25GaWx0ZXIgPSBrZXkgPT4gIS9Qcm9jZXNzLy50ZXN0KGtleSk7XG4gICAgfVxuXG4gICAgY29uc3QgZW5hYmxlZEJ1dHRvbnMgPSBidXR0b25GaWx0ZXIgPyBCdXR0b25LZXlzLmZpbHRlcihidXR0b25GaWx0ZXIpIDogQnV0dG9uS2V5cy5jb25jYXQoKTtcblxuICAgIC8vIHVwZGF0ZSBpY29uIGFuZCBsYWJlbCBmb3IgcmV2ZXJ0IGJ1dHRvbiB3aGVuIGluc3RhbnQgdXBsb2FkaW5nXG4gICAgaWYgKGluc3RhbnRVcGxvYWQgJiYgYWxsb3dSZXZlcnQpIHtcbiAgICAgICAgTG9jYWxCdXR0b25zWydSZXZlcnRJdGVtUHJvY2Vzc2luZyddLmxhYmVsID0gJ0dFVF9MQUJFTF9CVVRUT05fUkVNT1ZFX0lURU0nO1xuICAgICAgICBMb2NhbEJ1dHRvbnNbJ1JldmVydEl0ZW1Qcm9jZXNzaW5nJ10uaWNvbiA9ICdHRVRfSUNPTl9SRU1PVkUnO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBsYXN0IGJ1dHRvbiAocmV2ZXJ0KSBpZiBub3QgYWxsb3dlZFxuICAgIGlmIChpc0FzeW5jICYmICFhbGxvd1JldmVydCkge1xuICAgICAgICBjb25zdCBtYXAgPSBTdHlsZU1hcFsnRElEX0NPTVBMRVRFX0lURU1fUFJPQ0VTU0lORyddO1xuICAgICAgICBtYXAuaW5mby50cmFuc2xhdGVYID0gY2FsY3VsYXRlRmlsZUhvcml6b250YWxDZW50ZXJPZmZzZXQ7XG4gICAgICAgIG1hcC5pbmZvLnRyYW5zbGF0ZVkgPSBjYWxjdWxhdGVGaWxlVmVydGljYWxDZW50ZXJPZmZzZXQ7XG4gICAgICAgIG1hcC5zdGF0dXMudHJhbnNsYXRlWSA9IGNhbGN1bGF0ZUZpbGVWZXJ0aWNhbENlbnRlck9mZnNldDtcbiAgICAgICAgbWFwLnByb2Nlc3NpbmdDb21wbGV0ZUluZGljYXRvciA9IHsgb3BhY2l0eTogMSwgc2NhbGVYOiAxLCBzY2FsZVk6IDEgfTtcbiAgICB9XG5cbiAgICAvLyBzaG91bGQgYWxpZ24gY2VudGVyXG4gICAgaWYgKGlzQXN5bmMgJiYgIWFsbG93UHJvY2Vzcykge1xuICAgICAgICBbXG4gICAgICAgICAgICAnRElEX1NUQVJUX0lURU1fUFJPQ0VTU0lORycsXG4gICAgICAgICAgICAnRElEX1JFUVVFU1RfSVRFTV9QUk9DRVNTSU5HJyxcbiAgICAgICAgICAgICdESURfVVBEQVRFX0lURU1fUFJPQ0VTU19QUk9HUkVTUycsXG4gICAgICAgICAgICAnRElEX1RIUk9XX0lURU1fUFJPQ0VTU0lOR19FUlJPUicsXG4gICAgICAgIF0uZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgU3R5bGVNYXBba2V5XS5zdGF0dXMudHJhbnNsYXRlWSA9IGNhbGN1bGF0ZUZpbGVWZXJ0aWNhbENlbnRlck9mZnNldDtcbiAgICAgICAgfSk7XG4gICAgICAgIFN0eWxlTWFwWydESURfVEhST1dfSVRFTV9QUk9DRVNTSU5HX0VSUk9SJ10uc3RhdHVzLnRyYW5zbGF0ZVggPSBjYWxjdWxhdGVCdXR0b25XaWR0aDtcbiAgICB9XG5cbiAgICAvLyBtb3ZlIHJlbW92ZSBidXR0b24gdG8gcmlnaHRcbiAgICBpZiAoYWxpZ25SZW1vdmVJdGVtQnV0dG9uICYmIGFsbG93UmV2ZXJ0KSB7XG4gICAgICAgIExvY2FsQnV0dG9uc1snUmV2ZXJ0SXRlbVByb2Nlc3NpbmcnXS5hbGlnbiA9ICdCVVRUT05fUkVNT1ZFX0lURU1fUE9TSVRJT04nO1xuICAgICAgICBjb25zdCBtYXAgPSBTdHlsZU1hcFsnRElEX0NPTVBMRVRFX0lURU1fUFJPQ0VTU0lORyddO1xuICAgICAgICBtYXAuaW5mby50cmFuc2xhdGVYID0gY2FsY3VsYXRlRmlsZUluZm9PZmZzZXQ7XG4gICAgICAgIG1hcC5zdGF0dXMudHJhbnNsYXRlWSA9IGNhbGN1bGF0ZUZpbGVWZXJ0aWNhbENlbnRlck9mZnNldDtcbiAgICAgICAgbWFwLnByb2Nlc3NpbmdDb21wbGV0ZUluZGljYXRvciA9IHsgb3BhY2l0eTogMSwgc2NhbGVYOiAxLCBzY2FsZVk6IDEgfTtcbiAgICB9XG5cbiAgICAvLyBzaG93L2hpZGUgUmVtb3ZlSXRlbSBidXR0b25cbiAgICBpZiAoIWFsbG93UmVtb3ZlKSB7XG4gICAgICAgIExvY2FsQnV0dG9uc1snUmVtb3ZlSXRlbSddLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgdGhlIGJ1dHRvbiB2aWV3c1xuICAgIGZvcmluKExvY2FsQnV0dG9ucywgKGtleSwgZGVmaW5pdGlvbikgPT4ge1xuICAgICAgICAvLyBjcmVhdGUgYnV0dG9uXG4gICAgICAgIGNvbnN0IGJ1dHRvblZpZXcgPSByb290LmNyZWF0ZUNoaWxkVmlldyhmaWxlQWN0aW9uQnV0dG9uLCB7XG4gICAgICAgICAgICBsYWJlbDogcm9vdC5xdWVyeShkZWZpbml0aW9uLmxhYmVsKSxcbiAgICAgICAgICAgIGljb246IHJvb3QucXVlcnkoZGVmaW5pdGlvbi5pY29uKSxcbiAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNob3VsZCBiZSBhcHBlbmRlZD9cbiAgICAgICAgaWYgKGVuYWJsZWRCdXR0b25zLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGRWaWV3KGJ1dHRvblZpZXcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9nZ2xlXG4gICAgICAgIGlmIChkZWZpbml0aW9uLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBidXR0b25WaWV3LmVsZW1lbnQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgYnV0dG9uVmlldy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJ2hpZGRlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHBvc2l0aW9uIGF0dHJpYnV0ZVxuICAgICAgICBidXR0b25WaWV3LmVsZW1lbnQuZGF0YXNldC5hbGlnbiA9IHJvb3QucXVlcnkoYEdFVF9TVFlMRV8ke2RlZmluaXRpb24uYWxpZ259YCk7XG5cbiAgICAgICAgLy8gYWRkIGNsYXNzXG4gICAgICAgIGJ1dHRvblZpZXcuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGRlZmluaXRpb24uY2xhc3NOYW1lKTtcblxuICAgICAgICAvLyBoYW5kbGUgaW50ZXJhY3Rpb25zXG4gICAgICAgIGJ1dHRvblZpZXcub24oJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgaWYgKGRlZmluaXRpb24uZGlzYWJsZWQpIHJldHVybjtcbiAgICAgICAgICAgIHJvb3QuZGlzcGF0Y2goZGVmaW5pdGlvbi5hY3Rpb24sIHsgcXVlcnk6IGlkIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzZXQgcmVmZXJlbmNlXG4gICAgICAgIHJvb3QucmVmW2BidXR0b24ke2tleX1gXSA9IGJ1dHRvblZpZXc7XG4gICAgfSk7XG5cbiAgICAvLyBjaGVja21hcmtcbiAgICByb290LnJlZi5wcm9jZXNzaW5nQ29tcGxldGVJbmRpY2F0b3IgPSByb290LmFwcGVuZENoaWxkVmlldyhcbiAgICAgICAgcm9vdC5jcmVhdGVDaGlsZFZpZXcocHJvY2Vzc2luZ0NvbXBsZXRlSW5kaWNhdG9yVmlldylcbiAgICApO1xuICAgIHJvb3QucmVmLnByb2Nlc3NpbmdDb21wbGV0ZUluZGljYXRvci5lbGVtZW50LmRhdGFzZXQuYWxpZ24gPSByb290LnF1ZXJ5KFxuICAgICAgICBgR0VUX1NUWUxFX0JVVFRPTl9QUk9DRVNTX0lURU1fUE9TSVRJT05gXG4gICAgKTtcblxuICAgIC8vIGNyZWF0ZSBmaWxlIGluZm8gdmlld1xuICAgIHJvb3QucmVmLmluZm8gPSByb290LmFwcGVuZENoaWxkVmlldyhyb290LmNyZWF0ZUNoaWxkVmlldyhmaWxlSW5mbywgeyBpZCB9KSk7XG5cbiAgICAvLyBjcmVhdGUgZmlsZSBzdGF0dXMgdmlld1xuICAgIHJvb3QucmVmLnN0YXR1cyA9IHJvb3QuYXBwZW5kQ2hpbGRWaWV3KHJvb3QuY3JlYXRlQ2hpbGRWaWV3KGZpbGVTdGF0dXMsIHsgaWQgfSkpO1xuXG4gICAgLy8gYWRkIHByb2dyZXNzIGluZGljYXRvcnNcbiAgICBjb25zdCBsb2FkSW5kaWNhdG9yVmlldyA9IHJvb3QuYXBwZW5kQ2hpbGRWaWV3KFxuICAgICAgICByb290LmNyZWF0ZUNoaWxkVmlldyhwcm9ncmVzc0luZGljYXRvciwge1xuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIGFsaWduOiByb290LnF1ZXJ5KGBHRVRfU1RZTEVfTE9BRF9JTkRJQ0FUT1JfUE9TSVRJT05gKSxcbiAgICAgICAgfSlcbiAgICApO1xuICAgIGxvYWRJbmRpY2F0b3JWaWV3LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZmlsZXBvbmQtLWxvYWQtaW5kaWNhdG9yJyk7XG4gICAgcm9vdC5yZWYubG9hZFByb2dyZXNzSW5kaWNhdG9yID0gbG9hZEluZGljYXRvclZpZXc7XG5cbiAgICBjb25zdCBwcm9ncmVzc0luZGljYXRvclZpZXcgPSByb290LmFwcGVuZENoaWxkVmlldyhcbiAgICAgICAgcm9vdC5jcmVhdGVDaGlsZFZpZXcocHJvZ3Jlc3NJbmRpY2F0b3IsIHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICBhbGlnbjogcm9vdC5xdWVyeShgR0VUX1NUWUxFX1BST0dSRVNTX0lORElDQVRPUl9QT1NJVElPTmApLFxuICAgICAgICB9KVxuICAgICk7XG4gICAgcHJvZ3Jlc3NJbmRpY2F0b3JWaWV3LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZmlsZXBvbmQtLXByb2Nlc3MtaW5kaWNhdG9yJyk7XG4gICAgcm9vdC5yZWYucHJvY2Vzc1Byb2dyZXNzSW5kaWNhdG9yID0gcHJvZ3Jlc3NJbmRpY2F0b3JWaWV3O1xuXG4gICAgLy8gY3VycmVudCBhY3RpdmUgc3R5bGVzXG4gICAgcm9vdC5yZWYuYWN0aXZlU3R5bGVzID0gW107XG59O1xuXG5jb25zdCB3cml0ZSQyID0gKHsgcm9vdCwgYWN0aW9ucywgcHJvcHMgfSkgPT4ge1xuICAgIC8vIHJvdXRlIGFjdGlvbnNcbiAgICByb3V0ZSh7IHJvb3QsIGFjdGlvbnMsIHByb3BzIH0pO1xuXG4gICAgLy8gc2VsZWN0IGxhc3Qgc3RhdGUgY2hhbmdlIGFjdGlvblxuICAgIGxldCBhY3Rpb24gPSBhY3Rpb25zXG4gICAgICAgIC5jb25jYXQoKVxuICAgICAgICAuZmlsdGVyKGFjdGlvbiA9PiAvXkRJRF8vLnRlc3QoYWN0aW9uLnR5cGUpKVxuICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgIC5maW5kKGFjdGlvbiA9PiBTdHlsZU1hcFthY3Rpb24udHlwZV0pO1xuXG4gICAgLy8gYSBuZXcgYWN0aW9uIGhhcHBlbmVkLCBsZXQncyBnZXQgdGhlIG1hdGNoaW5nIHN0eWxlc1xuICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICAgLy8gZGVmaW5lIG5ldyBhY3RpdmUgc3R5bGVzXG4gICAgICAgIHJvb3QucmVmLmFjdGl2ZVN0eWxlcyA9IFtdO1xuXG4gICAgICAgIGNvbnN0IHN0eWxlc1RvQXBwbHkgPSBTdHlsZU1hcFthY3Rpb24udHlwZV07XG4gICAgICAgIGZvcmluKERlZmF1bHRTdHlsZSwgKG5hbWUsIGRlZmF1bHRTdHlsZXMpID0+IHtcbiAgICAgICAgICAgIC8vIGdldCByZWZlcmVuY2UgdG8gY29udHJvbFxuICAgICAgICAgICAgY29uc3QgY29udHJvbCA9IHJvb3QucmVmW25hbWVdO1xuXG4gICAgICAgICAgICAvLyBsb29wIG92ZXIgYWxsIHN0eWxlcyBmb3IgdGhpcyBjb250cm9sXG4gICAgICAgICAgICBmb3JpbihkZWZhdWx0U3R5bGVzLCAoa2V5LCBkZWZhdWx0VmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlc1RvQXBwbHlbbmFtZV0gJiYgdHlwZW9mIHN0eWxlc1RvQXBwbHlbbmFtZV1ba2V5XSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgICAgID8gc3R5bGVzVG9BcHBseVtuYW1lXVtrZXldXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICAgICAgICByb290LnJlZi5hY3RpdmVTdHlsZXMucHVzaCh7IGNvbnRyb2wsIGtleSwgdmFsdWUgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gYXBwbHkgYWN0aXZlIHN0eWxlcyB0byBlbGVtZW50XG4gICAgcm9vdC5yZWYuYWN0aXZlU3R5bGVzLmZvckVhY2goKHsgY29udHJvbCwga2V5LCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgIGNvbnRyb2xba2V5XSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IHZhbHVlKHJvb3QpIDogdmFsdWU7XG4gICAgfSk7XG59O1xuXG5jb25zdCByb3V0ZSA9IGNyZWF0ZVJvdXRlKHtcbiAgICBESURfU0VUX0xBQkVMX0JVVFRPTl9BQk9SVF9JVEVNX1BST0NFU1NJTkc6ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgICAgIHJvb3QucmVmLmJ1dHRvbkFib3J0SXRlbVByb2Nlc3NpbmcubGFiZWwgPSBhY3Rpb24udmFsdWU7XG4gICAgfSxcbiAgICBESURfU0VUX0xBQkVMX0JVVFRPTl9BQk9SVF9JVEVNX0xPQUQ6ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgICAgIHJvb3QucmVmLmJ1dHRvbkFib3J0SXRlbUxvYWQubGFiZWwgPSBhY3Rpb24udmFsdWU7XG4gICAgfSxcbiAgICBESURfU0VUX0xBQkVMX0JVVFRPTl9BQk9SVF9JVEVNX1JFTU9WQUw6ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgICAgIHJvb3QucmVmLmJ1dHRvbkFib3J0SXRlbVJlbW92YWwubGFiZWwgPSBhY3Rpb24udmFsdWU7XG4gICAgfSxcbiAgICBESURfUkVRVUVTVF9JVEVNX1BST0NFU1NJTkc6ICh7IHJvb3QgfSkgPT4ge1xuICAgICAgICByb290LnJlZi5wcm9jZXNzUHJvZ3Jlc3NJbmRpY2F0b3Iuc3BpbiA9IHRydWU7XG4gICAgICAgIHJvb3QucmVmLnByb2Nlc3NQcm9ncmVzc0luZGljYXRvci5wcm9ncmVzcyA9IDA7XG4gICAgfSxcbiAgICBESURfU1RBUlRfSVRFTV9MT0FEOiAoeyByb290IH0pID0+IHtcbiAgICAgICAgcm9vdC5yZWYubG9hZFByb2dyZXNzSW5kaWNhdG9yLnNwaW4gPSB0cnVlO1xuICAgICAgICByb290LnJlZi5sb2FkUHJvZ3Jlc3NJbmRpY2F0b3IucHJvZ3Jlc3MgPSAwO1xuICAgIH0sXG4gICAgRElEX1NUQVJUX0lURU1fUkVNT1ZFOiAoeyByb290IH0pID0+IHtcbiAgICAgICAgcm9vdC5yZWYucHJvY2Vzc1Byb2dyZXNzSW5kaWNhdG9yLnNwaW4gPSB0cnVlO1xuICAgICAgICByb290LnJlZi5wcm9jZXNzUHJvZ3Jlc3NJbmRpY2F0b3IucHJvZ3Jlc3MgPSAwO1xuICAgIH0sXG4gICAgRElEX1VQREFURV9JVEVNX0xPQURfUFJPR1JFU1M6ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgICAgIHJvb3QucmVmLmxvYWRQcm9ncmVzc0luZGljYXRvci5zcGluID0gZmFsc2U7XG4gICAgICAgIHJvb3QucmVmLmxvYWRQcm9ncmVzc0luZGljYXRvci5wcm9ncmVzcyA9IGFjdGlvbi5wcm9ncmVzcztcbiAgICB9LFxuICAgIERJRF9VUERBVEVfSVRFTV9QUk9DRVNTX1BST0dSRVNTOiAoeyByb290LCBhY3Rpb24gfSkgPT4ge1xuICAgICAgICByb290LnJlZi5wcm9jZXNzUHJvZ3Jlc3NJbmRpY2F0b3Iuc3BpbiA9IGZhbHNlO1xuICAgICAgICByb290LnJlZi5wcm9jZXNzUHJvZ3Jlc3NJbmRpY2F0b3IucHJvZ3Jlc3MgPSBhY3Rpb24ucHJvZ3Jlc3M7XG4gICAgfSxcbn0pO1xuXG5jb25zdCBmaWxlID0gY3JlYXRlVmlldyh7XG4gICAgY3JlYXRlOiBjcmVhdGUkNCxcbiAgICB3cml0ZTogd3JpdGUkMixcbiAgICBkaWRDcmVhdGVWaWV3OiByb290ID0+IHtcbiAgICAgICAgYXBwbHlGaWx0ZXJzKCdDUkVBVEVfVklFVycsIHsgLi4ucm9vdCwgdmlldzogcm9vdCB9KTtcbiAgICB9LFxuICAgIG5hbWU6ICdmaWxlJyxcbn0pO1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIGZpbGUgdmlld1xuICovXG5jb25zdCBjcmVhdGUkNSA9ICh7IHJvb3QsIHByb3BzIH0pID0+IHtcbiAgICAvLyBmaWxlbmFtZVxuICAgIHJvb3QucmVmLmZpbGVOYW1lID0gY3JlYXRlRWxlbWVudCQxKCdsZWdlbmQnKTtcbiAgICByb290LmFwcGVuZENoaWxkKHJvb3QucmVmLmZpbGVOYW1lKTtcblxuICAgIC8vIGZpbGUgYXBwZW5kZWRcbiAgICByb290LnJlZi5maWxlID0gcm9vdC5hcHBlbmRDaGlsZFZpZXcocm9vdC5jcmVhdGVDaGlsZFZpZXcoZmlsZSwgeyBpZDogcHJvcHMuaWQgfSkpO1xuXG4gICAgLy8gZGF0YSBoYXMgbW92ZWQgdG8gZGF0YS5qc1xuICAgIHJvb3QucmVmLmRhdGEgPSBmYWxzZTtcbn07XG5cbi8qKlxuICogRGF0YSBzdG9yYWdlXG4gKi9cbmNvbnN0IGRpZExvYWRJdGVtID0gKHsgcm9vdCwgcHJvcHMgfSkgPT4ge1xuICAgIC8vIHVwZGF0ZXMgdGhlIGxlZ2VuZCBvZiB0aGUgZmllbGRzZXQgc28gc2NyZWVucmVhZGVycyBjYW4gYmV0dGVyIGdyb3VwIGJ1dHRvbnNcbiAgICB0ZXh0KHJvb3QucmVmLmZpbGVOYW1lLCBmb3JtYXRGaWxlbmFtZShyb290LnF1ZXJ5KCdHRVRfSVRFTV9OQU1FJywgcHJvcHMuaWQpKSk7XG59O1xuXG5jb25zdCBmaWxlV3JhcHBlciA9IGNyZWF0ZVZpZXcoe1xuICAgIGNyZWF0ZTogY3JlYXRlJDUsXG4gICAgaWdub3JlUmVjdDogdHJ1ZSxcbiAgICB3cml0ZTogY3JlYXRlUm91dGUoe1xuICAgICAgICBESURfTE9BRF9JVEVNOiBkaWRMb2FkSXRlbSxcbiAgICB9KSxcbiAgICBkaWRDcmVhdGVWaWV3OiByb290ID0+IHtcbiAgICAgICAgYXBwbHlGaWx0ZXJzKCdDUkVBVEVfVklFVycsIHsgLi4ucm9vdCwgdmlldzogcm9vdCB9KTtcbiAgICB9LFxuICAgIHRhZzogJ2ZpZWxkc2V0JyxcbiAgICBuYW1lOiAnZmlsZS13cmFwcGVyJyxcbn0pO1xuXG5jb25zdCBQQU5FTF9TUFJJTkdfUFJPUFMgPSB7IHR5cGU6ICdzcHJpbmcnLCBkYW1waW5nOiAwLjYsIG1hc3M6IDcgfTtcblxuY29uc3QgY3JlYXRlJDYgPSAoeyByb290LCBwcm9wcyB9KSA9PiB7XG4gICAgW1xuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAndG9wJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2NlbnRlcicsXG4gICAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZVk6IG51bGwsXG4gICAgICAgICAgICAgICAgc2NhbGVZOiBudWxsLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1peGluczoge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVZOiBQQU5FTF9TUFJJTkdfUFJPUFMsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdHlsZXM6IFsndHJhbnNsYXRlWScsICdzY2FsZVknXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdib3R0b20nLFxuICAgICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGVZOiBudWxsLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1peGluczoge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlWTogUEFORUxfU1BSSU5HX1BST1BTLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbJ3RyYW5zbGF0ZVknXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgXS5mb3JFYWNoKHNlY3Rpb24gPT4ge1xuICAgICAgICBjcmVhdGVTZWN0aW9uKHJvb3QsIHNlY3Rpb24sIHByb3BzLm5hbWUpO1xuICAgIH0pO1xuXG4gICAgcm9vdC5lbGVtZW50LmNsYXNzTGlzdC5hZGQoYGZpbGVwb25kLS0ke3Byb3BzLm5hbWV9YCk7XG5cbiAgICByb290LnJlZi5zY2FsYWJsZSA9IG51bGw7XG59O1xuXG5jb25zdCBjcmVhdGVTZWN0aW9uID0gKHJvb3QsIHNlY3Rpb24sIGNsYXNzTmFtZSkgPT4ge1xuICAgIGNvbnN0IHZpZXdDb25zdHJ1Y3RvciA9IGNyZWF0ZVZpZXcoe1xuICAgICAgICBuYW1lOiBgcGFuZWwtJHtzZWN0aW9uLm5hbWV9IGZpbGVwb25kLS0ke2NsYXNzTmFtZX1gLFxuICAgICAgICBtaXhpbnM6IHNlY3Rpb24ubWl4aW5zLFxuICAgICAgICBpZ25vcmVSZWN0VXBkYXRlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdmlldyA9IHJvb3QuY3JlYXRlQ2hpbGRWaWV3KHZpZXdDb25zdHJ1Y3Rvciwgc2VjdGlvbi5wcm9wcyk7XG5cbiAgICByb290LnJlZltzZWN0aW9uLm5hbWVdID0gcm9vdC5hcHBlbmRDaGlsZFZpZXcodmlldyk7XG59O1xuXG5jb25zdCB3cml0ZSQzID0gKHsgcm9vdCwgcHJvcHMgfSkgPT4ge1xuICAgIC8vIHVwZGF0ZSBzY2FsYWJsZSBzdGF0ZVxuICAgIGlmIChyb290LnJlZi5zY2FsYWJsZSA9PT0gbnVsbCB8fCBwcm9wcy5zY2FsYWJsZSAhPT0gcm9vdC5yZWYuc2NhbGFibGUpIHtcbiAgICAgICAgcm9vdC5yZWYuc2NhbGFibGUgPSBpc0Jvb2xlYW4ocHJvcHMuc2NhbGFibGUpID8gcHJvcHMuc2NhbGFibGUgOiB0cnVlO1xuICAgICAgICByb290LmVsZW1lbnQuZGF0YXNldC5zY2FsYWJsZSA9IHJvb3QucmVmLnNjYWxhYmxlO1xuICAgIH1cblxuICAgIC8vIG5vIGhlaWdodCwgY2FuJ3Qgc2V0XG4gICAgaWYgKCFwcm9wcy5oZWlnaHQpIHJldHVybjtcblxuICAgIC8vIGdldCBjaGlsZCByZWN0c1xuICAgIGNvbnN0IHRvcFJlY3QgPSByb290LnJlZi50b3AucmVjdC5lbGVtZW50O1xuICAgIGNvbnN0IGJvdHRvbVJlY3QgPSByb290LnJlZi5ib3R0b20ucmVjdC5lbGVtZW50O1xuXG4gICAgLy8gbWFrZSBzdXJlIGhlaWdodCBuZXZlciBpcyBzbWFsbGVyIHRoYW4gYm90dG9tIGFuZCB0b3Agc2VjaXRvbiBoZWlnaHRzIGNvbWJpbmVkICh3aWxsIHByb2JhYmx5IG5ldmVyIGhhcHBlbiwgYnV0IHdobyBrbm93cylcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLm1heCh0b3BSZWN0LmhlaWdodCArIGJvdHRvbVJlY3QuaGVpZ2h0LCBwcm9wcy5oZWlnaHQpO1xuXG4gICAgLy8gb2Zmc2V0IGNlbnRlciBwYXJ0XG4gICAgcm9vdC5yZWYuY2VudGVyLnRyYW5zbGF0ZVkgPSB0b3BSZWN0LmhlaWdodDtcblxuICAgIC8vIHNjYWxlIGNlbnRlciBwYXJ0XG4gICAgLy8gdXNlIG1hdGggY2VpbCB0byBwcmV2ZW50IHRyYW5zcGFyZW50IGxpbmVzIGJlY2F1c2Ugb2Ygcm91bmRpbmcgZXJyb3JzXG4gICAgcm9vdC5yZWYuY2VudGVyLnNjYWxlWSA9IChoZWlnaHQgLSB0b3BSZWN0LmhlaWdodCAtIGJvdHRvbVJlY3QuaGVpZ2h0KSAvIDEwMDtcblxuICAgIC8vIG9mZnNldCBib3R0b20gcGFydFxuICAgIHJvb3QucmVmLmJvdHRvbS50cmFuc2xhdGVZID0gaGVpZ2h0IC0gYm90dG9tUmVjdC5oZWlnaHQ7XG59O1xuXG5jb25zdCBwYW5lbCA9IGNyZWF0ZVZpZXcoe1xuICAgIG5hbWU6ICdwYW5lbCcsXG4gICAgcmVhZDogKHsgcm9vdCwgcHJvcHMgfSkgPT4gKHByb3BzLmhlaWdodEN1cnJlbnQgPSByb290LnJlZi5ib3R0b20udHJhbnNsYXRlWSksXG4gICAgd3JpdGU6IHdyaXRlJDMsXG4gICAgY3JlYXRlOiBjcmVhdGUkNixcbiAgICBpZ25vcmVSZWN0OiB0cnVlLFxuICAgIG1peGluczoge1xuICAgICAgICBhcGlzOiBbJ2hlaWdodCcsICdoZWlnaHRDdXJyZW50JywgJ3NjYWxhYmxlJ10sXG4gICAgfSxcbn0pO1xuXG5jb25zdCBjcmVhdGVEcmFnSGVscGVyID0gaXRlbXMgPT4ge1xuICAgIGNvbnN0IGl0ZW1JZHMgPSBpdGVtcy5tYXAoaXRlbSA9PiBpdGVtLmlkKTtcbiAgICBsZXQgcHJldkluZGV4ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiB7XG4gICAgICAgIHNldEluZGV4OiBpbmRleCA9PiB7XG4gICAgICAgICAgICBwcmV2SW5kZXggPSBpbmRleDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0SW5kZXg6ICgpID0+IHByZXZJbmRleCxcbiAgICAgICAgZ2V0SXRlbUluZGV4OiBpdGVtID0+IGl0ZW1JZHMuaW5kZXhPZihpdGVtLmlkKSxcbiAgICB9O1xufTtcblxuY29uc3QgSVRFTV9UUkFOU0xBVEVfU1BSSU5HID0ge1xuICAgIHR5cGU6ICdzcHJpbmcnLFxuICAgIHN0aWZmbmVzczogMC43NSxcbiAgICBkYW1waW5nOiAwLjQ1LFxuICAgIG1hc3M6IDEwLFxufTtcblxuY29uc3QgSVRFTV9TQ0FMRV9TUFJJTkcgPSAnc3ByaW5nJztcblxuY29uc3QgU3RhdGVNYXAgPSB7XG4gICAgRElEX1NUQVJUX0lURU1fTE9BRDogJ2J1c3knLFxuICAgIERJRF9VUERBVEVfSVRFTV9MT0FEX1BST0dSRVNTOiAnbG9hZGluZycsXG4gICAgRElEX1RIUk9XX0lURU1fSU5WQUxJRDogJ2xvYWQtaW52YWxpZCcsXG4gICAgRElEX1RIUk9XX0lURU1fTE9BRF9FUlJPUjogJ2xvYWQtZXJyb3InLFxuICAgIERJRF9MT0FEX0lURU06ICdpZGxlJyxcbiAgICBESURfVEhST1dfSVRFTV9SRU1PVkVfRVJST1I6ICdyZW1vdmUtZXJyb3InLFxuICAgIERJRF9TVEFSVF9JVEVNX1JFTU9WRTogJ2J1c3knLFxuICAgIERJRF9TVEFSVF9JVEVNX1BST0NFU1NJTkc6ICdidXN5IHByb2Nlc3NpbmcnLFxuICAgIERJRF9SRVFVRVNUX0lURU1fUFJPQ0VTU0lORzogJ2J1c3kgcHJvY2Vzc2luZycsXG4gICAgRElEX1VQREFURV9JVEVNX1BST0NFU1NfUFJPR1JFU1M6ICdwcm9jZXNzaW5nJyxcbiAgICBESURfQ09NUExFVEVfSVRFTV9QUk9DRVNTSU5HOiAncHJvY2Vzc2luZy1jb21wbGV0ZScsXG4gICAgRElEX1RIUk9XX0lURU1fUFJPQ0VTU0lOR19FUlJPUjogJ3Byb2Nlc3NpbmctZXJyb3InLFxuICAgIERJRF9USFJPV19JVEVNX1BST0NFU1NJTkdfUkVWRVJUX0VSUk9SOiAncHJvY2Vzc2luZy1yZXZlcnQtZXJyb3InLFxuICAgIERJRF9BQk9SVF9JVEVNX1BST0NFU1NJTkc6ICdjYW5jZWxsZWQnLFxuICAgIERJRF9SRVZFUlRfSVRFTV9QUk9DRVNTSU5HOiAnaWRsZScsXG59O1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIGZpbGUgdmlld1xuICovXG5jb25zdCBjcmVhdGUkNyA9ICh7IHJvb3QsIHByb3BzIH0pID0+IHtcbiAgICAvLyBzZWxlY3RcbiAgICByb290LnJlZi5oYW5kbGVDbGljayA9IGUgPT4gcm9vdC5kaXNwYXRjaCgnRElEX0FDVElWQVRFX0lURU0nLCB7IGlkOiBwcm9wcy5pZCB9KTtcblxuICAgIC8vIHNldCBpZFxuICAgIHJvb3QuZWxlbWVudC5pZCA9IGBmaWxlcG9uZC0taXRlbS0ke3Byb3BzLmlkfWA7XG4gICAgcm9vdC5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcm9vdC5yZWYuaGFuZGxlQ2xpY2spO1xuXG4gICAgLy8gZmlsZSB2aWV3XG4gICAgcm9vdC5yZWYuY29udGFpbmVyID0gcm9vdC5hcHBlbmRDaGlsZFZpZXcocm9vdC5jcmVhdGVDaGlsZFZpZXcoZmlsZVdyYXBwZXIsIHsgaWQ6IHByb3BzLmlkIH0pKTtcblxuICAgIC8vIGZpbGUgcGFuZWxcbiAgICByb290LnJlZi5wYW5lbCA9IHJvb3QuYXBwZW5kQ2hpbGRWaWV3KHJvb3QuY3JlYXRlQ2hpbGRWaWV3KHBhbmVsLCB7IG5hbWU6ICdpdGVtLXBhbmVsJyB9KSk7XG5cbiAgICAvLyBkZWZhdWx0IHN0YXJ0IGhlaWdodFxuICAgIHJvb3QucmVmLnBhbmVsLmhlaWdodCA9IG51bGw7XG5cbiAgICAvLyBieSBkZWZhdWx0IG5vdCBtYXJrZWQgZm9yIHJlbW92YWxcbiAgICBwcm9wcy5tYXJrZWRGb3JSZW1vdmFsID0gZmFsc2U7XG5cbiAgICAvLyBpZiBub3QgYWxsb3dlZCB0byByZW9yZGVyIGZpbGUgaXRlbXMsIGV4aXQgaGVyZVxuICAgIGlmICghcm9vdC5xdWVyeSgnR0VUX0FMTE9XX1JFT1JERVInKSkgcmV0dXJuO1xuXG4gICAgLy8gc2V0IHRvIGlkbGUgc28gc2hvd3MgZ3JhYiBjdXJzb3JcbiAgICByb290LmVsZW1lbnQuZGF0YXNldC5kcmFnU3RhdGUgPSAnaWRsZSc7XG5cbiAgICBjb25zdCBncmFiID0gZSA9PiB7XG4gICAgICAgIGlmICghZS5pc1ByaW1hcnkpIHJldHVybjtcblxuICAgICAgICBsZXQgcmVtb3ZlZEFjdGl2YXRlTGlzdGVuZXIgPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBvcmlnaW4gPSB7XG4gICAgICAgICAgICB4OiBlLnBhZ2VYLFxuICAgICAgICAgICAgeTogZS5wYWdlWSxcbiAgICAgICAgfTtcblxuICAgICAgICBwcm9wcy5kcmFnT3JpZ2luID0ge1xuICAgICAgICAgICAgeDogcm9vdC50cmFuc2xhdGVYLFxuICAgICAgICAgICAgeTogcm9vdC50cmFuc2xhdGVZLFxuICAgICAgICB9O1xuXG4gICAgICAgIHByb3BzLmRyYWdDZW50ZXIgPSB7XG4gICAgICAgICAgICB4OiBlLm9mZnNldFgsXG4gICAgICAgICAgICB5OiBlLm9mZnNldFksXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZHJhZ1N0YXRlID0gY3JlYXRlRHJhZ0hlbHBlcihyb290LnF1ZXJ5KCdHRVRfQUNUSVZFX0lURU1TJykpO1xuXG4gICAgICAgIHJvb3QuZGlzcGF0Y2goJ0RJRF9HUkFCX0lURU0nLCB7IGlkOiBwcm9wcy5pZCwgZHJhZ1N0YXRlIH0pO1xuXG4gICAgICAgIGNvbnN0IGRyYWcgPSBlID0+IHtcbiAgICAgICAgICAgIGlmICghZS5pc1ByaW1hcnkpIHJldHVybjtcblxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgcHJvcHMuZHJhZ09mZnNldCA9IHtcbiAgICAgICAgICAgICAgICB4OiBlLnBhZ2VYIC0gb3JpZ2luLngsXG4gICAgICAgICAgICAgICAgeTogZS5wYWdlWSAtIG9yaWdpbi55LFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gaWYgZHJhZ2dlZCBzdG9wIGxpc3RlbmluZyB0byBjbGlja3MsIHdpbGwgcmUtYWRkIHdoZW4gZG9uZSBkcmFnZ2luZ1xuICAgICAgICAgICAgY29uc3QgZGlzdCA9XG4gICAgICAgICAgICAgICAgcHJvcHMuZHJhZ09mZnNldC54ICogcHJvcHMuZHJhZ09mZnNldC54ICsgcHJvcHMuZHJhZ09mZnNldC55ICogcHJvcHMuZHJhZ09mZnNldC55O1xuICAgICAgICAgICAgaWYgKGRpc3QgPiAxNiAmJiAhcmVtb3ZlZEFjdGl2YXRlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVkQWN0aXZhdGVMaXN0ZW5lciA9IHRydWU7XG4gICAgICAgICAgICAgICAgcm9vdC5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcm9vdC5yZWYuaGFuZGxlQ2xpY2spO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByb290LmRpc3BhdGNoKCdESURfRFJBR19JVEVNJywgeyBpZDogcHJvcHMuaWQsIGRyYWdTdGF0ZSB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkcm9wID0gZSA9PiB7XG4gICAgICAgICAgICBpZiAoIWUuaXNQcmltYXJ5KSByZXR1cm47XG5cbiAgICAgICAgICAgIHByb3BzLmRyYWdPZmZzZXQgPSB7XG4gICAgICAgICAgICAgICAgeDogZS5wYWdlWCAtIG9yaWdpbi54LFxuICAgICAgICAgICAgICAgIHk6IGUucGFnZVkgLSBvcmlnaW4ueSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByZXNldCA9ICgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCBjYW5jZWwpO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBkcmFnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIGRyb3ApO1xuXG4gICAgICAgICAgICByb290LmRpc3BhdGNoKCdESURfRFJPUF9JVEVNJywgeyBpZDogcHJvcHMuaWQsIGRyYWdTdGF0ZSB9KTtcblxuICAgICAgICAgICAgLy8gc3RhcnQgbGlzdGVuaW5nIHRvIGNsaWNrcyBhZ2FpblxuICAgICAgICAgICAgaWYgKHJlbW92ZWRBY3RpdmF0ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiByb290LmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByb290LnJlZi5oYW5kbGVDbGljayksIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCBjYW5jZWwpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIGRyYWcpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCBkcm9wKTtcbiAgICB9O1xuXG4gICAgcm9vdC5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgZ3JhYik7XG59O1xuXG5jb25zdCByb3V0ZSQxID0gY3JlYXRlUm91dGUoe1xuICAgIERJRF9VUERBVEVfUEFORUxfSEVJR0hUOiAoeyByb290LCBhY3Rpb24gfSkgPT4ge1xuICAgICAgICByb290LmhlaWdodCA9IGFjdGlvbi5oZWlnaHQ7XG4gICAgfSxcbn0pO1xuXG5jb25zdCB3cml0ZSQ0ID0gY3JlYXRlUm91dGUoXG4gICAge1xuICAgICAgICBESURfR1JBQl9JVEVNOiAoeyByb290LCBwcm9wcyB9KSA9PiB7XG4gICAgICAgICAgICBwcm9wcy5kcmFnT3JpZ2luID0ge1xuICAgICAgICAgICAgICAgIHg6IHJvb3QudHJhbnNsYXRlWCxcbiAgICAgICAgICAgICAgICB5OiByb290LnRyYW5zbGF0ZVksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBESURfRFJBR19JVEVNOiAoeyByb290IH0pID0+IHtcbiAgICAgICAgICAgIHJvb3QuZWxlbWVudC5kYXRhc2V0LmRyYWdTdGF0ZSA9ICdkcmFnJztcbiAgICAgICAgfSxcbiAgICAgICAgRElEX0RST1BfSVRFTTogKHsgcm9vdCwgcHJvcHMgfSkgPT4ge1xuICAgICAgICAgICAgcHJvcHMuZHJhZ09mZnNldCA9IG51bGw7XG4gICAgICAgICAgICBwcm9wcy5kcmFnT3JpZ2luID0gbnVsbDtcbiAgICAgICAgICAgIHJvb3QuZWxlbWVudC5kYXRhc2V0LmRyYWdTdGF0ZSA9ICdkcm9wJztcbiAgICAgICAgfSxcbiAgICB9LFxuICAgICh7IHJvb3QsIGFjdGlvbnMsIHByb3BzLCBzaG91bGRPcHRpbWl6ZSB9KSA9PiB7XG4gICAgICAgIGlmIChyb290LmVsZW1lbnQuZGF0YXNldC5kcmFnU3RhdGUgPT09ICdkcm9wJykge1xuICAgICAgICAgICAgaWYgKHJvb3Quc2NhbGVYIDw9IDEpIHtcbiAgICAgICAgICAgICAgICByb290LmVsZW1lbnQuZGF0YXNldC5kcmFnU3RhdGUgPSAnaWRsZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZWxlY3QgbGFzdCBzdGF0ZSBjaGFuZ2UgYWN0aW9uXG4gICAgICAgIGxldCBhY3Rpb24gPSBhY3Rpb25zXG4gICAgICAgICAgICAuY29uY2F0KClcbiAgICAgICAgICAgIC5maWx0ZXIoYWN0aW9uID0+IC9eRElEXy8udGVzdChhY3Rpb24udHlwZSkpXG4gICAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgICAuZmluZChhY3Rpb24gPT4gU3RhdGVNYXBbYWN0aW9uLnR5cGVdKTtcblxuICAgICAgICAvLyBubyBuZWVkIHRvIHNldCBzYW1lIHN0YXRlIHR3aWNlXG4gICAgICAgIGlmIChhY3Rpb24gJiYgYWN0aW9uLnR5cGUgIT09IHByb3BzLmN1cnJlbnRTdGF0ZSkge1xuICAgICAgICAgICAgLy8gc2V0IGN1cnJlbnQgc3RhdGVcbiAgICAgICAgICAgIHByb3BzLmN1cnJlbnRTdGF0ZSA9IGFjdGlvbi50eXBlO1xuXG4gICAgICAgICAgICAvLyBzZXQgc3RhdGVcbiAgICAgICAgICAgIHJvb3QuZWxlbWVudC5kYXRhc2V0LmZpbGVwb25kSXRlbVN0YXRlID0gU3RhdGVNYXBbcHJvcHMuY3VycmVudFN0YXRlXSB8fCAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJvdXRlIGFjdGlvbnNcbiAgICAgICAgY29uc3QgYXNwZWN0UmF0aW8gPVxuICAgICAgICAgICAgcm9vdC5xdWVyeSgnR0VUX0lURU1fUEFORUxfQVNQRUNUX1JBVElPJykgfHwgcm9vdC5xdWVyeSgnR0VUX1BBTkVMX0FTUEVDVF9SQVRJTycpO1xuICAgICAgICBpZiAoIWFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgICByb3V0ZSQxKHsgcm9vdCwgYWN0aW9ucywgcHJvcHMgfSk7XG4gICAgICAgICAgICBpZiAoIXJvb3QuaGVpZ2h0ICYmIHJvb3QucmVmLmNvbnRhaW5lci5yZWN0LmVsZW1lbnQuaGVpZ2h0ID4gMCkge1xuICAgICAgICAgICAgICAgIHJvb3QuaGVpZ2h0ID0gcm9vdC5yZWYuY29udGFpbmVyLnJlY3QuZWxlbWVudC5oZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIXNob3VsZE9wdGltaXplKSB7XG4gICAgICAgICAgICByb290LmhlaWdodCA9IHJvb3QucmVjdC5lbGVtZW50LndpZHRoICogYXNwZWN0UmF0aW87XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzeW5jIHBhbmVsIGhlaWdodCB3aXRoIGl0ZW0gaGVpZ2h0XG4gICAgICAgIGlmIChzaG91bGRPcHRpbWl6ZSkge1xuICAgICAgICAgICAgcm9vdC5yZWYucGFuZWwuaGVpZ2h0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvb3QucmVmLnBhbmVsLmhlaWdodCA9IHJvb3QuaGVpZ2h0O1xuICAgIH1cbik7XG5cbmNvbnN0IGl0ZW0gPSBjcmVhdGVWaWV3KHtcbiAgICBjcmVhdGU6IGNyZWF0ZSQ3LFxuICAgIHdyaXRlOiB3cml0ZSQ0LFxuICAgIGRlc3Ryb3k6ICh7IHJvb3QsIHByb3BzIH0pID0+IHtcbiAgICAgICAgcm9vdC5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcm9vdC5yZWYuaGFuZGxlQ2xpY2spO1xuICAgICAgICByb290LmRpc3BhdGNoKCdSRUxFQVNFX0lURU0nLCB7IHF1ZXJ5OiBwcm9wcy5pZCB9KTtcbiAgICB9LFxuICAgIHRhZzogJ2xpJyxcbiAgICBuYW1lOiAnaXRlbScsXG4gICAgbWl4aW5zOiB7XG4gICAgICAgIGFwaXM6IFtcbiAgICAgICAgICAgICdpZCcsXG4gICAgICAgICAgICAnaW50ZXJhY3Rpb25NZXRob2QnLFxuICAgICAgICAgICAgJ21hcmtlZEZvclJlbW92YWwnLFxuICAgICAgICAgICAgJ3NwYXduRGF0ZScsXG4gICAgICAgICAgICAnZHJhZ0NlbnRlcicsXG4gICAgICAgICAgICAnZHJhZ09yaWdpbicsXG4gICAgICAgICAgICAnZHJhZ09mZnNldCcsXG4gICAgICAgIF0sXG4gICAgICAgIHN0eWxlczogWyd0cmFuc2xhdGVYJywgJ3RyYW5zbGF0ZVknLCAnc2NhbGVYJywgJ3NjYWxlWScsICdvcGFjaXR5JywgJ2hlaWdodCddLFxuICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICBzY2FsZVg6IElURU1fU0NBTEVfU1BSSU5HLFxuICAgICAgICAgICAgc2NhbGVZOiBJVEVNX1NDQUxFX1NQUklORyxcbiAgICAgICAgICAgIHRyYW5zbGF0ZVg6IElURU1fVFJBTlNMQVRFX1NQUklORyxcbiAgICAgICAgICAgIHRyYW5zbGF0ZVk6IElURU1fVFJBTlNMQVRFX1NQUklORyxcbiAgICAgICAgICAgIG9wYWNpdHk6IHsgdHlwZTogJ3R3ZWVuJywgZHVyYXRpb246IDE1MCB9LFxuICAgICAgICB9LFxuICAgIH0sXG59KTtcblxudmFyIGdldEl0ZW1zUGVyUm93ID0gKGhvcml6b250YWxTcGFjZSwgaXRlbVdpZHRoKSA9PiB7XG4gICAgLy8gYWRkIG9uZSBwaXhlbCBsZWV3YXksIHdoZW4gdXNpbmcgcGVyY2VudGFnZXMgZm9yIGl0ZW0gd2lkdGggdG90YWwgaXRlbXMgY2FuIGJlIDEuOTkgcGVyIHJvd1xuXG4gICAgcmV0dXJuIE1hdGgubWF4KDEsIE1hdGguZmxvb3IoKGhvcml6b250YWxTcGFjZSArIDEpIC8gaXRlbVdpZHRoKSk7XG59O1xuXG5jb25zdCBnZXRJdGVtSW5kZXhCeVBvc2l0aW9uID0gKHZpZXcsIGNoaWxkcmVuLCBwb3NpdGlvbkluVmlldykgPT4ge1xuICAgIGlmICghcG9zaXRpb25JblZpZXcpIHJldHVybjtcblxuICAgIGNvbnN0IGhvcml6b250YWxTcGFjZSA9IHZpZXcucmVjdC5lbGVtZW50LndpZHRoO1xuICAgIC8vIGNvbnN0IGNoaWxkcmVuID0gdmlldy5jaGlsZFZpZXdzO1xuICAgIGNvbnN0IGwgPSBjaGlsZHJlbi5sZW5ndGg7XG4gICAgbGV0IGxhc3QgPSBudWxsO1xuXG4gICAgLy8gLTEsIGRvbid0IG1vdmUgaXRlbXMgdG8gYWNjb21vZGF0ZSAoZWl0aGVyIGFkZCB0byB0b3Agb3IgYm90dG9tKVxuICAgIGlmIChsID09PSAwIHx8IHBvc2l0aW9uSW5WaWV3LnRvcCA8IGNoaWxkcmVuWzBdLnJlY3QuZWxlbWVudC50b3ApIHJldHVybiAtMTtcblxuICAgIC8vIGxldCdzIGdldCB0aGUgaXRlbSB3aWR0aFxuICAgIGNvbnN0IGl0ZW0gPSBjaGlsZHJlblswXTtcbiAgICBjb25zdCBpdGVtUmVjdCA9IGl0ZW0ucmVjdC5lbGVtZW50O1xuICAgIGNvbnN0IGl0ZW1Ib3Jpem9udGFsTWFyZ2luID0gaXRlbVJlY3QubWFyZ2luTGVmdCArIGl0ZW1SZWN0Lm1hcmdpblJpZ2h0O1xuICAgIGNvbnN0IGl0ZW1XaWR0aCA9IGl0ZW1SZWN0LndpZHRoICsgaXRlbUhvcml6b250YWxNYXJnaW47XG4gICAgY29uc3QgaXRlbXNQZXJSb3cgPSBnZXRJdGVtc1BlclJvdyhob3Jpem9udGFsU3BhY2UsIGl0ZW1XaWR0aCk7XG5cbiAgICAvLyBzdGFja1xuICAgIGlmIChpdGVtc1BlclJvdyA9PT0gMSkge1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpbmRleF07XG4gICAgICAgICAgICBjb25zdCBjaGlsZE1pZCA9IGNoaWxkLnJlY3Qub3V0ZXIudG9wICsgY2hpbGQucmVjdC5lbGVtZW50LmhlaWdodCAqIDAuNTtcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbkluVmlldy50b3AgPCBjaGlsZE1pZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbDtcbiAgICB9XG5cbiAgICAvLyBncmlkXG4gICAgY29uc3QgaXRlbVZlcnRpY2FsTWFyZ2luID0gaXRlbVJlY3QubWFyZ2luVG9wICsgaXRlbVJlY3QubWFyZ2luQm90dG9tO1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSBpdGVtUmVjdC5oZWlnaHQgKyBpdGVtVmVydGljYWxNYXJnaW47XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGw7IGluZGV4KyspIHtcbiAgICAgICAgY29uc3QgaW5kZXhYID0gaW5kZXggJSBpdGVtc1BlclJvdztcbiAgICAgICAgY29uc3QgaW5kZXhZID0gTWF0aC5mbG9vcihpbmRleCAvIGl0ZW1zUGVyUm93KTtcblxuICAgICAgICBjb25zdCBvZmZzZXRYID0gaW5kZXhYICogaXRlbVdpZHRoO1xuICAgICAgICBjb25zdCBvZmZzZXRZID0gaW5kZXhZICogaXRlbUhlaWdodDtcblxuICAgICAgICBjb25zdCBpdGVtVG9wID0gb2Zmc2V0WSAtIGl0ZW1SZWN0Lm1hcmdpblRvcDtcbiAgICAgICAgY29uc3QgaXRlbVJpZ2h0ID0gb2Zmc2V0WCArIGl0ZW1XaWR0aDtcbiAgICAgICAgY29uc3QgaXRlbUJvdHRvbSA9IG9mZnNldFkgKyBpdGVtSGVpZ2h0ICsgaXRlbVJlY3QubWFyZ2luQm90dG9tO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbkluVmlldy50b3AgPCBpdGVtQm90dG9tICYmIHBvc2l0aW9uSW5WaWV3LnRvcCA+IGl0ZW1Ub3ApIHtcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbkluVmlldy5sZWZ0IDwgaXRlbVJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCAhPT0gbCAtIDEpIHtcbiAgICAgICAgICAgICAgICBsYXN0ID0gaW5kZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxhc3QgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGxhc3QgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGxhc3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIGw7XG59O1xuXG5jb25zdCBkcm9wQXJlYURpbWVuc2lvbnMgPSB7XG4gICAgaGVpZ2h0OiAwLFxuICAgIHdpZHRoOiAwLFxuICAgIGdldCBnZXRIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodDtcbiAgICB9LFxuICAgIHNldCBzZXRIZWlnaHQodmFsKSB7XG4gICAgICAgIGlmICh0aGlzLmhlaWdodCA9PT0gMCB8fCB2YWwgPT09IDApIHRoaXMuaGVpZ2h0ID0gdmFsO1xuICAgIH0sXG4gICAgZ2V0IGdldFdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53aWR0aDtcbiAgICB9LFxuICAgIHNldCBzZXRXaWR0aCh2YWwpIHtcbiAgICAgICAgaWYgKHRoaXMud2lkdGggPT09IDAgfHwgdmFsID09PSAwKSB0aGlzLndpZHRoID0gdmFsO1xuICAgIH0sXG4gICAgc2V0RGltZW5zaW9uczogZnVuY3Rpb24oaGVpZ2h0LCB3aWR0aCkge1xuICAgICAgICBpZiAodGhpcy5oZWlnaHQgPT09IDAgfHwgaGVpZ2h0ID09PSAwKSB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgaWYgKHRoaXMud2lkdGggPT09IDAgfHwgd2lkdGggPT09IDApIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB9LFxufTtcblxuY29uc3QgY3JlYXRlJDggPSAoeyByb290IH0pID0+IHtcbiAgICAvLyBuZWVkIHRvIHNldCByb2xlIHRvIGxpc3QgYXMgb3RoZXJ3aXNlIGl0IHdvbid0IGJlIHJlYWQgYXMgYSBsaXN0IGJ5IFZvaWNlT3ZlclxuICAgIGF0dHIocm9vdC5lbGVtZW50LCAncm9sZScsICdsaXN0Jyk7XG5cbiAgICByb290LnJlZi5sYXN0SXRlbVNwYW53RGF0ZSA9IERhdGUubm93KCk7XG59O1xuXG4vKipcbiAqIEluc2VydHMgYSBuZXcgaXRlbVxuICogQHBhcmFtIHJvb3RcbiAqIEBwYXJhbSBhY3Rpb25cbiAqL1xuY29uc3QgYWRkSXRlbVZpZXcgPSAoeyByb290LCBhY3Rpb24gfSkgPT4ge1xuICAgIGNvbnN0IHsgaWQsIGluZGV4LCBpbnRlcmFjdGlvbk1ldGhvZCB9ID0gYWN0aW9uO1xuXG4gICAgcm9vdC5yZWYuYWRkSW5kZXggPSBpbmRleDtcblxuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgbGV0IHNwYXduRGF0ZSA9IG5vdztcbiAgICBsZXQgb3BhY2l0eSA9IDE7XG5cbiAgICBpZiAoaW50ZXJhY3Rpb25NZXRob2QgIT09IEludGVyYWN0aW9uTWV0aG9kLk5PTkUpIHtcbiAgICAgICAgb3BhY2l0eSA9IDA7XG4gICAgICAgIGNvbnN0IGNvb2xkb3duID0gcm9vdC5xdWVyeSgnR0VUX0lURU1fSU5TRVJUX0lOVEVSVkFMJyk7XG4gICAgICAgIGNvbnN0IGRpc3QgPSBub3cgLSByb290LnJlZi5sYXN0SXRlbVNwYW53RGF0ZTtcbiAgICAgICAgc3Bhd25EYXRlID0gZGlzdCA8IGNvb2xkb3duID8gbm93ICsgKGNvb2xkb3duIC0gZGlzdCkgOiBub3c7XG4gICAgfVxuXG4gICAgcm9vdC5yZWYubGFzdEl0ZW1TcGFud0RhdGUgPSBzcGF3bkRhdGU7XG5cbiAgICByb290LmFwcGVuZENoaWxkVmlldyhcbiAgICAgICAgcm9vdC5jcmVhdGVDaGlsZFZpZXcoXG4gICAgICAgICAgICAvLyB2aWV3IHR5cGVcbiAgICAgICAgICAgIGl0ZW0sXG5cbiAgICAgICAgICAgIC8vIHByb3BzXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3Bhd25EYXRlLFxuICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgIG9wYWNpdHksXG4gICAgICAgICAgICAgICAgaW50ZXJhY3Rpb25NZXRob2QsXG4gICAgICAgICAgICB9XG4gICAgICAgICksXG4gICAgICAgIGluZGV4XG4gICAgKTtcbn07XG5cbmNvbnN0IG1vdmVJdGVtID0gKGl0ZW0sIHgsIHksIHZ4ID0gMCwgdnkgPSAxKSA9PiB7XG4gICAgLy8gc2V0IHRvIG51bGwgdG8gcmVtb3ZlIGFuaW1hdGlvbiB3aGlsZSBkcmFnZ2luZ1xuICAgIGlmIChpdGVtLmRyYWdPZmZzZXQpIHtcbiAgICAgICAgaXRlbS50cmFuc2xhdGVYID0gbnVsbDtcbiAgICAgICAgaXRlbS50cmFuc2xhdGVZID0gbnVsbDtcbiAgICAgICAgaXRlbS50cmFuc2xhdGVYID0gaXRlbS5kcmFnT3JpZ2luLnggKyBpdGVtLmRyYWdPZmZzZXQueDtcbiAgICAgICAgaXRlbS50cmFuc2xhdGVZID0gaXRlbS5kcmFnT3JpZ2luLnkgKyBpdGVtLmRyYWdPZmZzZXQueTtcbiAgICAgICAgaXRlbS5zY2FsZVggPSAxLjAyNTtcbiAgICAgICAgaXRlbS5zY2FsZVkgPSAxLjAyNTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtLnRyYW5zbGF0ZVggPSB4O1xuICAgICAgICBpdGVtLnRyYW5zbGF0ZVkgPSB5O1xuXG4gICAgICAgIGlmIChEYXRlLm5vdygpID4gaXRlbS5zcGF3bkRhdGUpIHtcbiAgICAgICAgICAgIC8vIHJldmVhbCBlbGVtZW50XG4gICAgICAgICAgICBpZiAoaXRlbS5vcGFjaXR5ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaW50cm9JdGVtVmlldyhpdGVtLCB4LCB5LCB2eCwgdnkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgaXMgZGVmYXVsdCBzY2FsZSBldmVyeSBmcmFtZVxuICAgICAgICAgICAgaXRlbS5zY2FsZVggPSAxO1xuICAgICAgICAgICAgaXRlbS5zY2FsZVkgPSAxO1xuICAgICAgICAgICAgaXRlbS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmNvbnN0IGludHJvSXRlbVZpZXcgPSAoaXRlbSwgeCwgeSwgdngsIHZ5KSA9PiB7XG4gICAgaWYgKGl0ZW0uaW50ZXJhY3Rpb25NZXRob2QgPT09IEludGVyYWN0aW9uTWV0aG9kLk5PTkUpIHtcbiAgICAgICAgaXRlbS50cmFuc2xhdGVYID0gbnVsbDtcbiAgICAgICAgaXRlbS50cmFuc2xhdGVYID0geDtcbiAgICAgICAgaXRlbS50cmFuc2xhdGVZID0gbnVsbDtcbiAgICAgICAgaXRlbS50cmFuc2xhdGVZID0geTtcbiAgICB9IGVsc2UgaWYgKGl0ZW0uaW50ZXJhY3Rpb25NZXRob2QgPT09IEludGVyYWN0aW9uTWV0aG9kLkRST1ApIHtcbiAgICAgICAgaXRlbS50cmFuc2xhdGVYID0gbnVsbDtcbiAgICAgICAgaXRlbS50cmFuc2xhdGVYID0geCAtIHZ4ICogMjA7XG5cbiAgICAgICAgaXRlbS50cmFuc2xhdGVZID0gbnVsbDtcbiAgICAgICAgaXRlbS50cmFuc2xhdGVZID0geSAtIHZ5ICogMTA7XG5cbiAgICAgICAgaXRlbS5zY2FsZVggPSAwLjg7XG4gICAgICAgIGl0ZW0uc2NhbGVZID0gMC44O1xuICAgIH0gZWxzZSBpZiAoaXRlbS5pbnRlcmFjdGlvbk1ldGhvZCA9PT0gSW50ZXJhY3Rpb25NZXRob2QuQlJPV1NFKSB7XG4gICAgICAgIGl0ZW0udHJhbnNsYXRlWSA9IG51bGw7XG4gICAgICAgIGl0ZW0udHJhbnNsYXRlWSA9IHkgLSAzMDtcbiAgICB9IGVsc2UgaWYgKGl0ZW0uaW50ZXJhY3Rpb25NZXRob2QgPT09IEludGVyYWN0aW9uTWV0aG9kLkFQSSkge1xuICAgICAgICBpdGVtLnRyYW5zbGF0ZVggPSBudWxsO1xuICAgICAgICBpdGVtLnRyYW5zbGF0ZVggPSB4IC0gMzA7XG4gICAgICAgIGl0ZW0udHJhbnNsYXRlWSA9IG51bGw7XG4gICAgfVxufTtcblxuLyoqXG4gKiBSZW1vdmVzIGFuIGV4aXN0aW5nIGl0ZW1cbiAqIEBwYXJhbSByb290XG4gKiBAcGFyYW0gYWN0aW9uXG4gKi9cbmNvbnN0IHJlbW92ZUl0ZW1WaWV3ID0gKHsgcm9vdCwgYWN0aW9uIH0pID0+IHtcbiAgICBjb25zdCB7IGlkIH0gPSBhY3Rpb247XG5cbiAgICAvLyBnZXQgdGhlIHZpZXcgbWF0Y2hpbmcgdGhlIGdpdmVuIGlkXG4gICAgY29uc3QgdmlldyA9IHJvb3QuY2hpbGRWaWV3cy5maW5kKGNoaWxkID0+IGNoaWxkLmlkID09PSBpZCk7XG5cbiAgICAvLyBpZiBubyB2aWV3IGZvdW5kLCBleGl0XG4gICAgaWYgKCF2aWV3KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBhbmltYXRlIHZpZXcgb3V0IG9mIHZpZXdcbiAgICB2aWV3LnNjYWxlWCA9IDAuOTtcbiAgICB2aWV3LnNjYWxlWSA9IDAuOTtcbiAgICB2aWV3Lm9wYWNpdHkgPSAwO1xuXG4gICAgLy8gbWFyayBmb3IgcmVtb3ZhbFxuICAgIHZpZXcubWFya2VkRm9yUmVtb3ZhbCA9IHRydWU7XG59O1xuXG5jb25zdCBnZXRJdGVtSGVpZ2h0ID0gY2hpbGQgPT5cbiAgICBjaGlsZC5yZWN0LmVsZW1lbnQuaGVpZ2h0ICsgY2hpbGQucmVjdC5lbGVtZW50Lm1hcmdpbkJvdHRvbSArIGNoaWxkLnJlY3QuZWxlbWVudC5tYXJnaW5Ub3A7XG5jb25zdCBnZXRJdGVtV2lkdGggPSBjaGlsZCA9PlxuICAgIGNoaWxkLnJlY3QuZWxlbWVudC53aWR0aCArXG4gICAgY2hpbGQucmVjdC5lbGVtZW50Lm1hcmdpbkxlZnQgKiAwLjUgK1xuICAgIGNoaWxkLnJlY3QuZWxlbWVudC5tYXJnaW5SaWdodCAqIDAuNTtcblxuY29uc3QgZHJhZ0l0ZW0gPSAoeyByb290LCBhY3Rpb24gfSkgPT4ge1xuICAgIGNvbnN0IHsgaWQsIGRyYWdTdGF0ZSB9ID0gYWN0aW9uO1xuXG4gICAgLy8gcmVmZXJlbmNlIHRvIGl0ZW1cbiAgICBjb25zdCBpdGVtID0gcm9vdC5xdWVyeSgnR0VUX0lURU0nLCB7IGlkIH0pO1xuXG4gICAgLy8gZ2V0IHRoZSB2aWV3IG1hdGNoaW5nIHRoZSBnaXZlbiBpZFxuICAgIGNvbnN0IHZpZXcgPSByb290LmNoaWxkVmlld3MuZmluZChjaGlsZCA9PiBjaGlsZC5pZCA9PT0gaWQpO1xuXG4gICAgY29uc3QgbnVtSXRlbXMgPSByb290LmNoaWxkVmlld3MubGVuZ3RoO1xuICAgIGNvbnN0IG9sZEluZGV4ID0gZHJhZ1N0YXRlLmdldEl0ZW1JbmRleChpdGVtKTtcblxuICAgIC8vIGlmIG5vIHZpZXcgZm91bmQsIGV4aXRcbiAgICBpZiAoIXZpZXcpIHJldHVybjtcblxuICAgIGNvbnN0IGRyYWdQb3NpdGlvbiA9IHtcbiAgICAgICAgeDogdmlldy5kcmFnT3JpZ2luLnggKyB2aWV3LmRyYWdPZmZzZXQueCArIHZpZXcuZHJhZ0NlbnRlci54LFxuICAgICAgICB5OiB2aWV3LmRyYWdPcmlnaW4ueSArIHZpZXcuZHJhZ09mZnNldC55ICsgdmlldy5kcmFnQ2VudGVyLnksXG4gICAgfTtcblxuICAgIC8vIGdldCBkcmFnIGFyZWEgZGltZW5zaW9uc1xuICAgIGNvbnN0IGRyYWdIZWlnaHQgPSBnZXRJdGVtSGVpZ2h0KHZpZXcpO1xuICAgIGNvbnN0IGRyYWdXaWR0aCA9IGdldEl0ZW1XaWR0aCh2aWV3KTtcblxuICAgIC8vIGdldCByb3dzIGFuZCBjb2x1bW5zIChUaGVyZSB3aWxsIGFsd2F5cyBiZSBhdCBsZWFzdCBvbmUgcm93IGFuZCBvbmUgY29sdW1uIGlmIGEgZmlsZSBpcyBwcmVzZW50KVxuICAgIGxldCBjb2xzID0gTWF0aC5mbG9vcihyb290LnJlY3Qub3V0ZXIud2lkdGggLyBkcmFnV2lkdGgpO1xuICAgIGlmIChjb2xzID4gbnVtSXRlbXMpIGNvbHMgPSBudW1JdGVtcztcblxuICAgIC8vIHJvd3MgYXJlIHVzZWQgdG8gZmluZCB3aGVuIHdlIGhhdmUgbGVmdCB0aGUgcHJldmlldyBhcmVhIGJvdW5kaW5nIGJveFxuICAgIGNvbnN0IHJvd3MgPSBNYXRoLmZsb29yKG51bUl0ZW1zIC8gY29scyArIDEpO1xuXG4gICAgZHJvcEFyZWFEaW1lbnNpb25zLnNldEhlaWdodCA9IGRyYWdIZWlnaHQgKiByb3dzO1xuICAgIGRyb3BBcmVhRGltZW5zaW9ucy5zZXRXaWR0aCA9IGRyYWdXaWR0aCAqIGNvbHM7XG5cbiAgICAvLyBnZXQgbmV3IGluZGV4IG9mIGRyYWdnZWQgaXRlbVxuICAgIHZhciBsb2NhdGlvbiA9IHtcbiAgICAgICAgeTogTWF0aC5mbG9vcihkcmFnUG9zaXRpb24ueSAvIGRyYWdIZWlnaHQpLFxuICAgICAgICB4OiBNYXRoLmZsb29yKGRyYWdQb3NpdGlvbi54IC8gZHJhZ1dpZHRoKSxcbiAgICAgICAgZ2V0R3JpZEluZGV4OiBmdW5jdGlvbiBnZXRHcmlkSW5kZXgoKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZHJhZ1Bvc2l0aW9uLnkgPiBkcm9wQXJlYURpbWVuc2lvbnMuZ2V0SGVpZ2h0IHx8XG4gICAgICAgICAgICAgICAgZHJhZ1Bvc2l0aW9uLnkgPCAwIHx8XG4gICAgICAgICAgICAgICAgZHJhZ1Bvc2l0aW9uLnggPiBkcm9wQXJlYURpbWVuc2lvbnMuZ2V0V2lkdGggfHxcbiAgICAgICAgICAgICAgICBkcmFnUG9zaXRpb24ueCA8IDBcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICByZXR1cm4gb2xkSW5kZXg7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy55ICogY29scyArIHRoaXMueDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q29sSW5kZXg6IGZ1bmN0aW9uIGdldENvbEluZGV4KCkge1xuICAgICAgICAgICAgY29uc3QgaXRlbXMgPSByb290LnF1ZXJ5KCdHRVRfQUNUSVZFX0lURU1TJyk7XG4gICAgICAgICAgICBjb25zdCB2aXNpYmxlQ2hpbGRyZW4gPSByb290LmNoaWxkVmlld3MuZmlsdGVyKGNoaWxkID0+IGNoaWxkLnJlY3QuZWxlbWVudC5oZWlnaHQpO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBpdGVtcy5tYXAoaXRlbSA9PlxuICAgICAgICAgICAgICAgIHZpc2libGVDaGlsZHJlbi5maW5kKGNoaWxkVmlldyA9PiBjaGlsZFZpZXcuaWQgPT09IGl0ZW0uaWQpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gY2hpbGRyZW4uZmluZEluZGV4KGNoaWxkID0+IGNoaWxkID09PSB2aWV3KTtcbiAgICAgICAgICAgIGNvbnN0IGRyYWdIZWlnaHQgPSBnZXRJdGVtSGVpZ2h0KHZpZXcpO1xuICAgICAgICAgICAgY29uc3QgbCA9IGNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBpZHggPSBsO1xuICAgICAgICAgICAgbGV0IGNoaWxkSGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZEJvdHRvbSA9IDA7XG4gICAgICAgICAgICBsZXQgY2hpbGRUb3AgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjaGlsZEhlaWdodCA9IGdldEl0ZW1IZWlnaHQoY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgIGNoaWxkVG9wID0gY2hpbGRCb3R0b207XG4gICAgICAgICAgICAgICAgY2hpbGRCb3R0b20gPSBjaGlsZFRvcCArIGNoaWxkSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmIChkcmFnUG9zaXRpb24ueSA8IGNoaWxkQm90dG9tKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SW5kZXggPiBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZHJhZ1Bvc2l0aW9uLnkgPCBjaGlsZFRvcCArIGRyYWdIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHggPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWR4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlkeDtcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgLy8gZ2V0IG5ldyBpbmRleFxuICAgIGNvbnN0IGluZGV4ID0gY29scyA+IDEgPyBsb2NhdGlvbi5nZXRHcmlkSW5kZXgoKSA6IGxvY2F0aW9uLmdldENvbEluZGV4KCk7XG4gICAgcm9vdC5kaXNwYXRjaCgnTU9WRV9JVEVNJywgeyBxdWVyeTogdmlldywgaW5kZXggfSk7XG5cbiAgICAvLyBpZiB0aGUgaW5kZXggb2YgdGhlIGl0ZW0gY2hhbmdlZCwgZGlzcGF0Y2ggcmVvcmRlciBhY3Rpb25cbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSBkcmFnU3RhdGUuZ2V0SW5kZXgoKTtcblxuICAgIGlmIChjdXJyZW50SW5kZXggPT09IHVuZGVmaW5lZCB8fCBjdXJyZW50SW5kZXggIT09IGluZGV4KSB7XG4gICAgICAgIGRyYWdTdGF0ZS5zZXRJbmRleChpbmRleCk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgcm9vdC5kaXNwYXRjaCgnRElEX1JFT1JERVJfSVRFTVMnLCB7XG4gICAgICAgICAgICBpdGVtczogcm9vdC5xdWVyeSgnR0VUX0FDVElWRV9JVEVNUycpLFxuICAgICAgICAgICAgb3JpZ2luOiBvbGRJbmRleCxcbiAgICAgICAgICAgIHRhcmdldDogaW5kZXgsXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8qKlxuICogU2V0dXAgYWN0aW9uIHJvdXRlc1xuICovXG5jb25zdCByb3V0ZSQyID0gY3JlYXRlUm91dGUoe1xuICAgIERJRF9BRERfSVRFTTogYWRkSXRlbVZpZXcsXG4gICAgRElEX1JFTU9WRV9JVEVNOiByZW1vdmVJdGVtVmlldyxcbiAgICBESURfRFJBR19JVEVNOiBkcmFnSXRlbSxcbn0pO1xuXG4vKipcbiAqIFdyaXRlIHRvIHZpZXdcbiAqIEBwYXJhbSByb290XG4gKiBAcGFyYW0gYWN0aW9uc1xuICogQHBhcmFtIHByb3BzXG4gKi9cbmNvbnN0IHdyaXRlJDUgPSAoeyByb290LCBwcm9wcywgYWN0aW9ucywgc2hvdWxkT3B0aW1pemUgfSkgPT4ge1xuICAgIC8vIHJvdXRlIGFjdGlvbnNcbiAgICByb3V0ZSQyKHsgcm9vdCwgcHJvcHMsIGFjdGlvbnMgfSk7XG5cbiAgICBjb25zdCB7IGRyYWdDb29yZGluYXRlcyB9ID0gcHJvcHM7XG5cbiAgICAvLyBhdmFpbGFibGUgc3BhY2Ugb24gaG9yaXpvbnRhbCBheGlzXG4gICAgY29uc3QgaG9yaXpvbnRhbFNwYWNlID0gcm9vdC5yZWN0LmVsZW1lbnQud2lkdGg7XG5cbiAgICAvLyBvbmx5IGRyYXcgY2hpbGRyZW4gdGhhdCBoYXZlIGRpbWVuc2lvbnNcbiAgICBjb25zdCB2aXNpYmxlQ2hpbGRyZW4gPSByb290LmNoaWxkVmlld3MuZmlsdGVyKGNoaWxkID0+IGNoaWxkLnJlY3QuZWxlbWVudC5oZWlnaHQpO1xuXG4gICAgLy8gc29ydCBiYXNlZCBvbiBjdXJyZW50IGFjdGl2ZSBpdGVtc1xuICAgIGNvbnN0IGNoaWxkcmVuID0gcm9vdFxuICAgICAgICAucXVlcnkoJ0dFVF9BQ1RJVkVfSVRFTVMnKVxuICAgICAgICAubWFwKGl0ZW0gPT4gdmlzaWJsZUNoaWxkcmVuLmZpbmQoY2hpbGQgPT4gY2hpbGQuaWQgPT09IGl0ZW0uaWQpKVxuICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gaXRlbSk7XG5cbiAgICAvLyBnZXQgaW5kZXhcbiAgICBjb25zdCBkcmFnSW5kZXggPSBkcmFnQ29vcmRpbmF0ZXNcbiAgICAgICAgPyBnZXRJdGVtSW5kZXhCeVBvc2l0aW9uKHJvb3QsIGNoaWxkcmVuLCBkcmFnQ29vcmRpbmF0ZXMpXG4gICAgICAgIDogbnVsbDtcblxuICAgIC8vIGFkZCBpbmRleCBpcyB1c2VkIHRvIHJlc2VydmUgdGhlIGRyb3BwZWQvYWRkZWQgaXRlbSBpbmRleCB0aWxsIHRoZSBhY3R1YWwgaXRlbSBpcyByZW5kZXJlZFxuICAgIGNvbnN0IGFkZEluZGV4ID0gcm9vdC5yZWYuYWRkSW5kZXggfHwgbnVsbDtcblxuICAgIC8vIGFkZCBpbmRleCBubyBsb25nZXIgbmVlZGVkIHRpbGwgcG9zc2libHkgbmV4dCBkcmF3XG4gICAgcm9vdC5yZWYuYWRkSW5kZXggPSBudWxsO1xuXG4gICAgbGV0IGRyYWdJbmRleE9mZnNldCA9IDA7XG4gICAgbGV0IHJlbW92ZUluZGV4T2Zmc2V0ID0gMDtcbiAgICBsZXQgYWRkSW5kZXhPZmZzZXQgPSAwO1xuXG4gICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgY29uc3QgY2hpbGRSZWN0ID0gY2hpbGRyZW5bMF0ucmVjdC5lbGVtZW50O1xuICAgIGNvbnN0IGl0ZW1WZXJ0aWNhbE1hcmdpbiA9IGNoaWxkUmVjdC5tYXJnaW5Ub3AgKyBjaGlsZFJlY3QubWFyZ2luQm90dG9tO1xuICAgIGNvbnN0IGl0ZW1Ib3Jpem9udGFsTWFyZ2luID0gY2hpbGRSZWN0Lm1hcmdpbkxlZnQgKyBjaGlsZFJlY3QubWFyZ2luUmlnaHQ7XG4gICAgY29uc3QgaXRlbVdpZHRoID0gY2hpbGRSZWN0LndpZHRoICsgaXRlbUhvcml6b250YWxNYXJnaW47XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IGNoaWxkUmVjdC5oZWlnaHQgKyBpdGVtVmVydGljYWxNYXJnaW47XG4gICAgY29uc3QgaXRlbXNQZXJSb3cgPSBnZXRJdGVtc1BlclJvdyhob3Jpem9udGFsU3BhY2UsIGl0ZW1XaWR0aCk7XG5cbiAgICAvLyBzdGFja1xuICAgIGlmIChpdGVtc1BlclJvdyA9PT0gMSkge1xuICAgICAgICBsZXQgb2Zmc2V0WSA9IDA7XG4gICAgICAgIGxldCBkcmFnT2Zmc2V0ID0gMDtcblxuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChkcmFnSW5kZXgpIHtcbiAgICAgICAgICAgICAgICBsZXQgZGlzdCA9IGluZGV4IC0gZHJhZ0luZGV4O1xuICAgICAgICAgICAgICAgIGlmIChkaXN0ID09PSAtMikge1xuICAgICAgICAgICAgICAgICAgICBkcmFnT2Zmc2V0ID0gLWl0ZW1WZXJ0aWNhbE1hcmdpbiAqIDAuMjU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXN0ID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBkcmFnT2Zmc2V0ID0gLWl0ZW1WZXJ0aWNhbE1hcmdpbiAqIDAuNzU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXN0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRyYWdPZmZzZXQgPSBpdGVtVmVydGljYWxNYXJnaW4gKiAwLjc1O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlzdCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkcmFnT2Zmc2V0ID0gaXRlbVZlcnRpY2FsTWFyZ2luICogMC4yNTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkcmFnT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzaG91bGRPcHRpbWl6ZSkge1xuICAgICAgICAgICAgICAgIGNoaWxkLnRyYW5zbGF0ZVggPSBudWxsO1xuICAgICAgICAgICAgICAgIGNoaWxkLnRyYW5zbGF0ZVkgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWNoaWxkLm1hcmtlZEZvclJlbW92YWwpIHtcbiAgICAgICAgICAgICAgICBtb3ZlSXRlbShjaGlsZCwgMCwgb2Zmc2V0WSArIGRyYWdPZmZzZXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaXRlbUhlaWdodCA9IGNoaWxkLnJlY3QuZWxlbWVudC5oZWlnaHQgKyBpdGVtVmVydGljYWxNYXJnaW47XG5cbiAgICAgICAgICAgIGxldCB2aXN1YWxIZWlnaHQgPSBpdGVtSGVpZ2h0ICogKGNoaWxkLm1hcmtlZEZvclJlbW92YWwgPyBjaGlsZC5vcGFjaXR5IDogMSk7XG5cbiAgICAgICAgICAgIG9mZnNldFkgKz0gdmlzdWFsSGVpZ2h0O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gZ3JpZFxuICAgIGVsc2Uge1xuICAgICAgICBsZXQgcHJldlggPSAwO1xuICAgICAgICBsZXQgcHJldlkgPSAwO1xuXG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBkcmFnSW5kZXgpIHtcbiAgICAgICAgICAgICAgICBkcmFnSW5kZXhPZmZzZXQgPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IGFkZEluZGV4KSB7XG4gICAgICAgICAgICAgICAgYWRkSW5kZXhPZmZzZXQgKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNoaWxkLm1hcmtlZEZvclJlbW92YWwgJiYgY2hpbGQub3BhY2l0eSA8IDAuNSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZUluZGV4T2Zmc2V0IC09IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHZpc3VhbEluZGV4ID0gaW5kZXggKyBhZGRJbmRleE9mZnNldCArIGRyYWdJbmRleE9mZnNldCArIHJlbW92ZUluZGV4T2Zmc2V0O1xuXG4gICAgICAgICAgICBjb25zdCBpbmRleFggPSB2aXN1YWxJbmRleCAlIGl0ZW1zUGVyUm93O1xuICAgICAgICAgICAgY29uc3QgaW5kZXhZID0gTWF0aC5mbG9vcih2aXN1YWxJbmRleCAvIGl0ZW1zUGVyUm93KTtcblxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IGluZGV4WCAqIGl0ZW1XaWR0aDtcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldFkgPSBpbmRleFkgKiBpdGVtSGVpZ2h0O1xuXG4gICAgICAgICAgICBjb25zdCB2ZWN0b3JYID0gTWF0aC5zaWduKG9mZnNldFggLSBwcmV2WCk7XG4gICAgICAgICAgICBjb25zdCB2ZWN0b3JZID0gTWF0aC5zaWduKG9mZnNldFkgLSBwcmV2WSk7XG5cbiAgICAgICAgICAgIHByZXZYID0gb2Zmc2V0WDtcbiAgICAgICAgICAgIHByZXZZID0gb2Zmc2V0WTtcblxuICAgICAgICAgICAgaWYgKGNoaWxkLm1hcmtlZEZvclJlbW92YWwpIHJldHVybjtcblxuICAgICAgICAgICAgaWYgKHNob3VsZE9wdGltaXplKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQudHJhbnNsYXRlWCA9IG51bGw7XG4gICAgICAgICAgICAgICAgY2hpbGQudHJhbnNsYXRlWSA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vdmVJdGVtKGNoaWxkLCBvZmZzZXRYLCBvZmZzZXRZLCB2ZWN0b3JYLCB2ZWN0b3JZKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBGaWx0ZXJzIGFjdGlvbnMgdGhhdCBhcmUgbWVhbnQgc3BlY2lmaWNhbGx5IGZvciBhIGNlcnRhaW4gY2hpbGQgb2YgdGhlIGxpc3RcbiAqIEBwYXJhbSBjaGlsZFxuICogQHBhcmFtIGFjdGlvbnNcbiAqL1xuY29uc3QgZmlsdGVyU2V0SXRlbUFjdGlvbnMgPSAoY2hpbGQsIGFjdGlvbnMpID0+XG4gICAgYWN0aW9ucy5maWx0ZXIoYWN0aW9uID0+IHtcbiAgICAgICAgLy8gaWYgYWN0aW9uIGhhcyBhbiBpZCwgZmlsdGVyIG91dCBhY3Rpb25zIHRoYXQgZG9uJ3QgaGF2ZSB0aGlzIGNoaWxkIGlkXG4gICAgICAgIGlmIChhY3Rpb24uZGF0YSAmJiBhY3Rpb24uZGF0YS5pZCkge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLmlkID09PSBhY3Rpb24uZGF0YS5pZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFsbG93IGFsbCBvdGhlciBhY3Rpb25zXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG5jb25zdCBsaXN0ID0gY3JlYXRlVmlldyh7XG4gICAgY3JlYXRlOiBjcmVhdGUkOCxcbiAgICB3cml0ZTogd3JpdGUkNSxcbiAgICB0YWc6ICd1bCcsXG4gICAgbmFtZTogJ2xpc3QnLFxuICAgIGRpZFdyaXRlVmlldzogKHsgcm9vdCB9KSA9PiB7XG4gICAgICAgIHJvb3QuY2hpbGRWaWV3c1xuICAgICAgICAgICAgLmZpbHRlcih2aWV3ID0+IHZpZXcubWFya2VkRm9yUmVtb3ZhbCAmJiB2aWV3Lm9wYWNpdHkgPT09IDAgJiYgdmlldy5yZXN0aW5nKVxuICAgICAgICAgICAgLmZvckVhY2godmlldyA9PiB7XG4gICAgICAgICAgICAgICAgdmlldy5fZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHJvb3QucmVtb3ZlQ2hpbGRWaWV3KHZpZXcpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSxcbiAgICBmaWx0ZXJGcmFtZUFjdGlvbnNGb3JDaGlsZDogZmlsdGVyU2V0SXRlbUFjdGlvbnMsXG4gICAgbWl4aW5zOiB7XG4gICAgICAgIGFwaXM6IFsnZHJhZ0Nvb3JkaW5hdGVzJ10sXG4gICAgfSxcbn0pO1xuXG5jb25zdCBjcmVhdGUkOSA9ICh7IHJvb3QsIHByb3BzIH0pID0+IHtcbiAgICByb290LnJlZi5saXN0ID0gcm9vdC5hcHBlbmRDaGlsZFZpZXcocm9vdC5jcmVhdGVDaGlsZFZpZXcobGlzdCkpO1xuICAgIHByb3BzLmRyYWdDb29yZGluYXRlcyA9IG51bGw7XG4gICAgcHJvcHMub3ZlcmZsb3dpbmcgPSBmYWxzZTtcbn07XG5cbmNvbnN0IHN0b3JlRHJhZ0Nvb3JkaW5hdGVzID0gKHsgcm9vdCwgcHJvcHMsIGFjdGlvbiB9KSA9PiB7XG4gICAgaWYgKCFyb290LnF1ZXJ5KCdHRVRfSVRFTV9JTlNFUlRfTE9DQVRJT05fRlJFRURPTScpKSByZXR1cm47XG4gICAgcHJvcHMuZHJhZ0Nvb3JkaW5hdGVzID0ge1xuICAgICAgICBsZWZ0OiBhY3Rpb24ucG9zaXRpb24uc2NvcGVMZWZ0IC0gcm9vdC5yZWYubGlzdC5yZWN0LmVsZW1lbnQubGVmdCxcbiAgICAgICAgdG9wOlxuICAgICAgICAgICAgYWN0aW9uLnBvc2l0aW9uLnNjb3BlVG9wIC1cbiAgICAgICAgICAgIChyb290LnJlY3Qub3V0ZXIudG9wICsgcm9vdC5yZWN0LmVsZW1lbnQubWFyZ2luVG9wICsgcm9vdC5yZWN0LmVsZW1lbnQuc2Nyb2xsVG9wKSxcbiAgICB9O1xufTtcblxuY29uc3QgY2xlYXJEcmFnQ29vcmRpbmF0ZXMgPSAoeyBwcm9wcyB9KSA9PiB7XG4gICAgcHJvcHMuZHJhZ0Nvb3JkaW5hdGVzID0gbnVsbDtcbn07XG5cbmNvbnN0IHJvdXRlJDMgPSBjcmVhdGVSb3V0ZSh7XG4gICAgRElEX0RSQUc6IHN0b3JlRHJhZ0Nvb3JkaW5hdGVzLFxuICAgIERJRF9FTkRfRFJBRzogY2xlYXJEcmFnQ29vcmRpbmF0ZXMsXG59KTtcblxuY29uc3Qgd3JpdGUkNiA9ICh7IHJvb3QsIHByb3BzLCBhY3Rpb25zIH0pID0+IHtcbiAgICAvLyByb3V0ZSBhY3Rpb25zXG4gICAgcm91dGUkMyh7IHJvb3QsIHByb3BzLCBhY3Rpb25zIH0pO1xuXG4gICAgLy8gY3VycmVudCBkcmFnIHBvc2l0aW9uXG4gICAgcm9vdC5yZWYubGlzdC5kcmFnQ29vcmRpbmF0ZXMgPSBwcm9wcy5kcmFnQ29vcmRpbmF0ZXM7XG5cbiAgICAvLyBpZiBjdXJyZW50bHkgb3ZlcmZsb3dpbmcgYnV0IG5vIGxvbmdlciByZWNlaXZlZCBvdmVyZmxvd1xuICAgIGlmIChwcm9wcy5vdmVyZmxvd2luZyAmJiAhcHJvcHMub3ZlcmZsb3cpIHtcbiAgICAgICAgcHJvcHMub3ZlcmZsb3dpbmcgPSBmYWxzZTtcblxuICAgICAgICAvLyByZXNldCBvdmVyZmxvdyBzdGF0ZVxuICAgICAgICByb290LmVsZW1lbnQuZGF0YXNldC5zdGF0ZSA9ICcnO1xuICAgICAgICByb290LmhlaWdodCA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gaWYgaXMgbm90IG92ZXJmbG93aW5nIGN1cnJlbnRseSBidXQgZG9lcyByZWNlaXZlIG92ZXJmbG93IHZhbHVlXG4gICAgaWYgKHByb3BzLm92ZXJmbG93KSB7XG4gICAgICAgIGNvbnN0IG5ld0hlaWdodCA9IE1hdGgucm91bmQocHJvcHMub3ZlcmZsb3cpO1xuICAgICAgICBpZiAobmV3SGVpZ2h0ICE9PSByb290LmhlaWdodCkge1xuICAgICAgICAgICAgcHJvcHMub3ZlcmZsb3dpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcm9vdC5lbGVtZW50LmRhdGFzZXQuc3RhdGUgPSAnb3ZlcmZsb3cnO1xuICAgICAgICAgICAgcm9vdC5oZWlnaHQgPSBuZXdIZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jb25zdCBsaXN0U2Nyb2xsZXIgPSBjcmVhdGVWaWV3KHtcbiAgICBjcmVhdGU6IGNyZWF0ZSQ5LFxuICAgIHdyaXRlOiB3cml0ZSQ2LFxuICAgIG5hbWU6ICdsaXN0LXNjcm9sbGVyJyxcbiAgICBtaXhpbnM6IHtcbiAgICAgICAgYXBpczogWydvdmVyZmxvdycsICdkcmFnQ29vcmRpbmF0ZXMnXSxcbiAgICAgICAgc3R5bGVzOiBbJ2hlaWdodCcsICd0cmFuc2xhdGVZJ10sXG4gICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgIHRyYW5zbGF0ZVk6ICdzcHJpbmcnLFxuICAgICAgICB9LFxuICAgIH0sXG59KTtcblxuY29uc3QgYXR0clRvZ2dsZSA9IChlbGVtZW50LCBuYW1lLCBzdGF0ZSwgZW5hYmxlZFZhbHVlID0gJycpID0+IHtcbiAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgYXR0cihlbGVtZW50LCBuYW1lLCBlbmFibGVkVmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIH1cbn07XG5cbmNvbnN0IHJlc2V0RmlsZUlucHV0ID0gaW5wdXQgPT4ge1xuICAgIC8vIG5vIHZhbHVlLCBubyBuZWVkIHRvIHJlc2V0XG4gICAgaWYgKCFpbnB1dCB8fCBpbnB1dC52YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIC8vIGZvciBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICB9IGNhdGNoIChlcnIpIHt9XG5cbiAgICAvLyBmb3IgSUUxMFxuICAgIGlmIChpbnB1dC52YWx1ZSkge1xuICAgICAgICAvLyBxdWlja2x5IGFwcGVuZCBpbnB1dCB0byB0ZW1wIGZvcm0gYW5kIHJlc2V0IGZvcm1cbiAgICAgICAgY29uc3QgZm9ybSA9IGNyZWF0ZUVsZW1lbnQkMSgnZm9ybScpO1xuICAgICAgICBjb25zdCBwYXJlbnROb2RlID0gaW5wdXQucGFyZW50Tm9kZTtcbiAgICAgICAgY29uc3QgcmVmID0gaW5wdXQubmV4dFNpYmxpbmc7XG4gICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgICAgICBmb3JtLnJlc2V0KCk7XG5cbiAgICAgICAgLy8gcmUtaW5qZWN0IGlucHV0IHdoZXJlIGl0IG9yaWdpbmFsbHkgd2FzXG4gICAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGlucHV0LCByZWYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jb25zdCBjcmVhdGUkYSA9ICh7IHJvb3QsIHByb3BzIH0pID0+IHtcbiAgICAvLyBzZXQgaWQgc28gY2FuIGJlIHJlZmVyZW5jZWQgZnJvbSBvdXRzaWRlIGxhYmVsc1xuICAgIHJvb3QuZWxlbWVudC5pZCA9IGBmaWxlcG9uZC0tYnJvd3Nlci0ke3Byb3BzLmlkfWA7XG5cbiAgICAvLyBzZXQgbmFtZSBvZiBlbGVtZW50IChpcyByZW1vdmVkIHdoZW4gYSB2YWx1ZSBpcyBzZXQpXG4gICAgYXR0cihyb290LmVsZW1lbnQsICduYW1lJywgcm9vdC5xdWVyeSgnR0VUX05BTUUnKSk7XG5cbiAgICAvLyB3ZSBoYXZlIHRvIGxpbmsgdGhpcyBlbGVtZW50IHRvIHRoZSBzdGF0dXMgZWxlbWVudFxuICAgIGF0dHIocm9vdC5lbGVtZW50LCAnYXJpYS1jb250cm9scycsIGBmaWxlcG9uZC0tYXNzaXN0YW50LSR7cHJvcHMuaWR9YCk7XG5cbiAgICAvLyBzZXQgbGFiZWwsIHdlIHVzZSBsYWJlbGxlZCBieSBhcyBvdGhlcndpc2UgdGhlIHNjcmVlbnJlYWRlciBkb2VzIG5vdCByZWFkIHRoZSBcImJyb3dzZVwiIHRleHQgaW4gdGhlIGxhYmVsIChhcyBpdCBoYXMgdGFiaW5kZXg6IDApXG4gICAgYXR0cihyb290LmVsZW1lbnQsICdhcmlhLWxhYmVsbGVkYnknLCBgZmlsZXBvbmQtLWRyb3AtbGFiZWwtJHtwcm9wcy5pZH1gKTtcblxuICAgIC8vIHNldCBjb25maWd1cmFibGUgcHJvcHNcbiAgICBzZXRBY2NlcHRlZEZpbGVUeXBlcyh7IHJvb3QsIGFjdGlvbjogeyB2YWx1ZTogcm9vdC5xdWVyeSgnR0VUX0FDQ0VQVEVEX0ZJTEVfVFlQRVMnKSB9IH0pO1xuICAgIHRvZ2dsZUFsbG93TXVsdGlwbGUoeyByb290LCBhY3Rpb246IHsgdmFsdWU6IHJvb3QucXVlcnkoJ0dFVF9BTExPV19NVUxUSVBMRScpIH0gfSk7XG4gICAgdG9nZ2xlRGlyZWN0b3J5RmlsdGVyKHsgcm9vdCwgYWN0aW9uOiB7IHZhbHVlOiByb290LnF1ZXJ5KCdHRVRfQUxMT1dfRElSRUNUT1JJRVNfT05MWScpIH0gfSk7XG4gICAgdG9nZ2xlRGlzYWJsZWQoeyByb290IH0pO1xuICAgIHRvZ2dsZVJlcXVpcmVkKHsgcm9vdCwgYWN0aW9uOiB7IHZhbHVlOiByb290LnF1ZXJ5KCdHRVRfUkVRVUlSRUQnKSB9IH0pO1xuICAgIHNldENhcHR1cmVNZXRob2QoeyByb290LCBhY3Rpb246IHsgdmFsdWU6IHJvb3QucXVlcnkoJ0dFVF9DQVBUVVJFX01FVEhPRCcpIH0gfSk7XG5cbiAgICAvLyBoYW5kbGUgY2hhbmdlcyB0byB0aGUgaW5wdXQgZmllbGRcbiAgICByb290LnJlZi5oYW5kbGVDaGFuZ2UgPSBlID0+IHtcbiAgICAgICAgaWYgKCFyb290LmVsZW1lbnQudmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGV4dHJhY3QgZmlsZXMgYW5kIG1vdmUgdmFsdWUgb2Ygd2Via2l0UmVsYXRpdmVQYXRoIHBhdGggdG8gX3JlbGF0aXZlUGF0aFxuICAgICAgICBjb25zdCBmaWxlcyA9IEFycmF5LmZyb20ocm9vdC5lbGVtZW50LmZpbGVzKS5tYXAoZmlsZSA9PiB7XG4gICAgICAgICAgICBmaWxlLl9yZWxhdGl2ZVBhdGggPSBmaWxlLndlYmtpdFJlbGF0aXZlUGF0aDtcbiAgICAgICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyB3ZSBhZGQgYSBsaXR0bGUgZGVsYXkgc28gdGhlIE9TIGZpbGUgc2VsZWN0IHdpbmRvdyBjYW4gbW92ZSBvdXQgb2YgdGhlIHdheSBiZWZvcmUgd2UgYWRkIG91ciBmaWxlXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gbG9hZCBmaWxlc1xuICAgICAgICAgICAgcHJvcHMub25sb2FkKGZpbGVzKTtcblxuICAgICAgICAgICAgLy8gcmVzZXQgaW5wdXQsIGl0J3MganVzdCBmb3IgZXhwb3NpbmcgYSBtZXRob2QgdG8gZHJvcCBmaWxlcywgc2hvdWxkIG5vdCByZXRhaW4gYW55IHN0YXRlXG4gICAgICAgICAgICByZXNldEZpbGVJbnB1dChyb290LmVsZW1lbnQpO1xuICAgICAgICB9LCAyNTApO1xuICAgIH07XG5cbiAgICByb290LmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgcm9vdC5yZWYuaGFuZGxlQ2hhbmdlKTtcbn07XG5cbmNvbnN0IHNldEFjY2VwdGVkRmlsZVR5cGVzID0gKHsgcm9vdCwgYWN0aW9uIH0pID0+IHtcbiAgICBpZiAoIXJvb3QucXVlcnkoJ0dFVF9BTExPV19TWU5DX0FDQ0VQVF9BVFRSSUJVVEUnKSkgcmV0dXJuO1xuICAgIGF0dHJUb2dnbGUocm9vdC5lbGVtZW50LCAnYWNjZXB0JywgISFhY3Rpb24udmFsdWUsIGFjdGlvbi52YWx1ZSA/IGFjdGlvbi52YWx1ZS5qb2luKCcsJykgOiAnJyk7XG59O1xuXG5jb25zdCB0b2dnbGVBbGxvd011bHRpcGxlID0gKHsgcm9vdCwgYWN0aW9uIH0pID0+IHtcbiAgICBhdHRyVG9nZ2xlKHJvb3QuZWxlbWVudCwgJ211bHRpcGxlJywgYWN0aW9uLnZhbHVlKTtcbn07XG5cbmNvbnN0IHRvZ2dsZURpcmVjdG9yeUZpbHRlciA9ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgYXR0clRvZ2dsZShyb290LmVsZW1lbnQsICd3ZWJraXRkaXJlY3RvcnknLCBhY3Rpb24udmFsdWUpO1xufTtcblxuY29uc3QgdG9nZ2xlRGlzYWJsZWQgPSAoeyByb290IH0pID0+IHtcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gcm9vdC5xdWVyeSgnR0VUX0RJU0FCTEVEJyk7XG4gICAgY29uc3QgZG9lc0FsbG93QnJvd3NlID0gcm9vdC5xdWVyeSgnR0VUX0FMTE9XX0JST1dTRScpO1xuICAgIGNvbnN0IGRpc2FibGVGaWVsZCA9IGlzRGlzYWJsZWQgfHwgIWRvZXNBbGxvd0Jyb3dzZTtcbiAgICBhdHRyVG9nZ2xlKHJvb3QuZWxlbWVudCwgJ2Rpc2FibGVkJywgZGlzYWJsZUZpZWxkKTtcbn07XG5cbmNvbnN0IHRvZ2dsZVJlcXVpcmVkID0gKHsgcm9vdCwgYWN0aW9uIH0pID0+IHtcbiAgICAvLyB3YW50IHRvIHJlbW92ZSByZXF1aXJlZCwgYWx3YXlzIHBvc3NpYmxlXG4gICAgaWYgKCFhY3Rpb24udmFsdWUpIHtcbiAgICAgICAgYXR0clRvZ2dsZShyb290LmVsZW1lbnQsICdyZXF1aXJlZCcsIGZhbHNlKTtcbiAgICB9XG4gICAgLy8gaWYgd2FudCB0byBtYWtlIHJlcXVpcmVkLCBvbmx5IHBvc3NpYmxlIHdoZW4gemVybyBpdGVtc1xuICAgIGVsc2UgaWYgKHJvb3QucXVlcnkoJ0dFVF9UT1RBTF9JVEVNUycpID09PSAwKSB7XG4gICAgICAgIGF0dHJUb2dnbGUocm9vdC5lbGVtZW50LCAncmVxdWlyZWQnLCB0cnVlKTtcbiAgICB9XG59O1xuXG5jb25zdCBzZXRDYXB0dXJlTWV0aG9kID0gKHsgcm9vdCwgYWN0aW9uIH0pID0+IHtcbiAgICBhdHRyVG9nZ2xlKHJvb3QuZWxlbWVudCwgJ2NhcHR1cmUnLCAhIWFjdGlvbi52YWx1ZSwgYWN0aW9uLnZhbHVlID09PSB0cnVlID8gJycgOiBhY3Rpb24udmFsdWUpO1xufTtcblxuY29uc3QgdXBkYXRlUmVxdWlyZWRTdGF0dXMgPSAoeyByb290IH0pID0+IHtcbiAgICBjb25zdCB7IGVsZW1lbnQgfSA9IHJvb3Q7XG4gICAgLy8gYWx3YXlzIHJlbW92ZSB0aGUgcmVxdWlyZWQgYXR0cmlidXRlIHdoZW4gbW9yZSB0aGFuIHplcm8gaXRlbXNcbiAgICBpZiAocm9vdC5xdWVyeSgnR0VUX1RPVEFMX0lURU1TJykgPiAwKSB7XG4gICAgICAgIGF0dHJUb2dnbGUoZWxlbWVudCwgJ3JlcXVpcmVkJywgZmFsc2UpO1xuICAgICAgICBhdHRyVG9nZ2xlKGVsZW1lbnQsICduYW1lJywgZmFsc2UpO1xuXG4gICAgICAgIC8vIHN0aWxsIGhhcyBpdGVtc1xuICAgICAgICBjb25zdCBhY3RpdmVJdGVtcyA9IHJvb3QucXVlcnkoJ0dFVF9BQ1RJVkVfSVRFTVMnKTtcbiAgICAgICAgbGV0IGhhc0ludmFsaWRGaWVsZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFjdGl2ZUl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYWN0aXZlSXRlbXNbaV0uc3RhdHVzID09PSBJdGVtU3RhdHVzLkxPQURfRVJST1IpIHtcbiAgICAgICAgICAgICAgICBoYXNJbnZhbGlkRmllbGQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHNldCB2YWxpZGl0eSBzdGF0dXNcbiAgICAgICAgcm9vdC5lbGVtZW50LnNldEN1c3RvbVZhbGlkaXR5KFxuICAgICAgICAgICAgaGFzSW52YWxpZEZpZWxkID8gcm9vdC5xdWVyeSgnR0VUX0xBQkVMX0lOVkFMSURfRklFTEQnKSA6ICcnXG4gICAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYWRkIG5hbWUgYXR0cmlidXRlXG4gICAgICAgIGF0dHJUb2dnbGUoZWxlbWVudCwgJ25hbWUnLCB0cnVlLCByb290LnF1ZXJ5KCdHRVRfTkFNRScpKTtcblxuICAgICAgICAvLyByZW1vdmUgYW55IHZhbGlkYXRpb24gbWVzc2FnZXNcbiAgICAgICAgY29uc3Qgc2hvdWxkQ2hlY2tWYWxpZGl0eSA9IHJvb3QucXVlcnkoJ0dFVF9DSEVDS19WQUxJRElUWScpO1xuICAgICAgICBpZiAoc2hvdWxkQ2hlY2tWYWxpZGl0eSkge1xuICAgICAgICAgICAgZWxlbWVudC5zZXRDdXN0b21WYWxpZGl0eSgnJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZSBvbmx5IGFkZCByZXF1aXJlZCBpZiB0aGUgZmllbGQgaGFzIGJlZW4gZGVlbWVkIHJlcXVpcmVkXG4gICAgICAgIGlmIChyb290LnF1ZXJ5KCdHRVRfUkVRVUlSRUQnKSkge1xuICAgICAgICAgICAgYXR0clRvZ2dsZShlbGVtZW50LCAncmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmNvbnN0IHVwZGF0ZUZpZWxkVmFsaWRpdHlTdGF0dXMgPSAoeyByb290IH0pID0+IHtcbiAgICBjb25zdCBzaG91bGRDaGVja1ZhbGlkaXR5ID0gcm9vdC5xdWVyeSgnR0VUX0NIRUNLX1ZBTElESVRZJyk7XG4gICAgaWYgKCFzaG91bGRDaGVja1ZhbGlkaXR5KSByZXR1cm47XG4gICAgcm9vdC5lbGVtZW50LnNldEN1c3RvbVZhbGlkaXR5KHJvb3QucXVlcnkoJ0dFVF9MQUJFTF9JTlZBTElEX0ZJRUxEJykpO1xufTtcblxuY29uc3QgYnJvd3NlciA9IGNyZWF0ZVZpZXcoe1xuICAgIHRhZzogJ2lucHV0JyxcbiAgICBuYW1lOiAnYnJvd3NlcicsXG4gICAgaWdub3JlUmVjdDogdHJ1ZSxcbiAgICBpZ25vcmVSZWN0VXBkYXRlOiB0cnVlLFxuICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgdHlwZTogJ2ZpbGUnLFxuICAgIH0sXG4gICAgY3JlYXRlOiBjcmVhdGUkYSxcbiAgICBkZXN0cm95OiAoeyByb290IH0pID0+IHtcbiAgICAgICAgcm9vdC5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHJvb3QucmVmLmhhbmRsZUNoYW5nZSk7XG4gICAgfSxcbiAgICB3cml0ZTogY3JlYXRlUm91dGUoe1xuICAgICAgICBESURfTE9BRF9JVEVNOiB1cGRhdGVSZXF1aXJlZFN0YXR1cyxcbiAgICAgICAgRElEX1JFTU9WRV9JVEVNOiB1cGRhdGVSZXF1aXJlZFN0YXR1cyxcbiAgICAgICAgRElEX1RIUk9XX0lURU1fSU5WQUxJRDogdXBkYXRlRmllbGRWYWxpZGl0eVN0YXR1cyxcblxuICAgICAgICBESURfU0VUX0RJU0FCTEVEOiB0b2dnbGVEaXNhYmxlZCxcbiAgICAgICAgRElEX1NFVF9BTExPV19CUk9XU0U6IHRvZ2dsZURpc2FibGVkLFxuICAgICAgICBESURfU0VUX0FMTE9XX0RJUkVDVE9SSUVTX09OTFk6IHRvZ2dsZURpcmVjdG9yeUZpbHRlcixcbiAgICAgICAgRElEX1NFVF9BTExPV19NVUxUSVBMRTogdG9nZ2xlQWxsb3dNdWx0aXBsZSxcbiAgICAgICAgRElEX1NFVF9BQ0NFUFRFRF9GSUxFX1RZUEVTOiBzZXRBY2NlcHRlZEZpbGVUeXBlcyxcbiAgICAgICAgRElEX1NFVF9DQVBUVVJFX01FVEhPRDogc2V0Q2FwdHVyZU1ldGhvZCxcbiAgICAgICAgRElEX1NFVF9SRVFVSVJFRDogdG9nZ2xlUmVxdWlyZWQsXG4gICAgfSksXG59KTtcblxuY29uc3QgS2V5ID0ge1xuICAgIEVOVEVSOiAxMyxcbiAgICBTUEFDRTogMzIsXG59O1xuXG5jb25zdCBjcmVhdGUkYiA9ICh7IHJvb3QsIHByb3BzIH0pID0+IHtcbiAgICAvLyBjcmVhdGUgdGhlIGxhYmVsIGFuZCBsaW5rIGl0IHRvIHRoZSBmaWxlIGJyb3dzZXJcbiAgICBjb25zdCBsYWJlbCA9IGNyZWF0ZUVsZW1lbnQkMSgnbGFiZWwnKTtcbiAgICBhdHRyKGxhYmVsLCAnZm9yJywgYGZpbGVwb25kLS1icm93c2VyLSR7cHJvcHMuaWR9YCk7XG5cbiAgICAvLyB1c2UgZm9yIGxhYmVsaW5nIGZpbGUgaW5wdXQgKGFyaWEtbGFiZWxsZWRieSBvbiBmaWxlIGlucHV0KVxuICAgIGF0dHIobGFiZWwsICdpZCcsIGBmaWxlcG9uZC0tZHJvcC1sYWJlbC0ke3Byb3BzLmlkfWApO1xuXG4gICAgLy8gaGFuZGxlIGtleXNcbiAgICByb290LnJlZi5oYW5kbGVLZXlEb3duID0gZSA9PiB7XG4gICAgICAgIGNvbnN0IGlzQWN0aXZhdGlvbktleSA9IGUua2V5Q29kZSA9PT0gS2V5LkVOVEVSIHx8IGUua2V5Q29kZSA9PT0gS2V5LlNQQUNFO1xuICAgICAgICBpZiAoIWlzQWN0aXZhdGlvbktleSkgcmV0dXJuO1xuICAgICAgICAvLyBzdG9wcyBmcm9tIHRyaWdnZXJpbmcgdGhlIGVsZW1lbnQgYSBzZWNvbmQgdGltZVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLy8gY2xpY2sgbGluayAod2lsbCB0aGVuIGluIHR1cm4gYWN0aXZhdGUgZmlsZSBpbnB1dClcbiAgICAgICAgcm9vdC5yZWYubGFiZWwuY2xpY2soKTtcbiAgICB9O1xuXG4gICAgcm9vdC5yZWYuaGFuZGxlQ2xpY2sgPSBlID0+IHtcbiAgICAgICAgY29uc3QgaXNMYWJlbENsaWNrID0gZS50YXJnZXQgPT09IGxhYmVsIHx8IGxhYmVsLmNvbnRhaW5zKGUudGFyZ2V0KTtcblxuICAgICAgICAvLyBkb24ndCB3YW50IHRvIGNsaWNrIHR3aWNlXG4gICAgICAgIGlmIChpc0xhYmVsQ2xpY2spIHJldHVybjtcblxuICAgICAgICAvLyBjbGljayBsaW5rICh3aWxsIHRoZW4gaW4gdHVybiBhY3RpdmF0ZSBmaWxlIGlucHV0KVxuICAgICAgICByb290LnJlZi5sYWJlbC5jbGljaygpO1xuICAgIH07XG5cbiAgICAvLyBhdHRhY2ggZXZlbnRzXG4gICAgbGFiZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHJvb3QucmVmLmhhbmRsZUtleURvd24pO1xuICAgIHJvb3QuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJvb3QucmVmLmhhbmRsZUNsaWNrKTtcblxuICAgIC8vIHVwZGF0ZVxuICAgIHVwZGF0ZUxhYmVsVmFsdWUobGFiZWwsIHByb3BzLmNhcHRpb24pO1xuXG4gICAgLy8gYWRkIVxuICAgIHJvb3QuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIHJvb3QucmVmLmxhYmVsID0gbGFiZWw7XG59O1xuXG5jb25zdCB1cGRhdGVMYWJlbFZhbHVlID0gKGxhYmVsLCB2YWx1ZSkgPT4ge1xuICAgIGxhYmVsLmlubmVySFRNTCA9IHZhbHVlO1xuICAgIGNvbnN0IGNsaWNrYWJsZSA9IGxhYmVsLnF1ZXJ5U2VsZWN0b3IoJy5maWxlcG9uZC0tbGFiZWwtYWN0aW9uJyk7XG4gICAgaWYgKGNsaWNrYWJsZSkge1xuICAgICAgICBhdHRyKGNsaWNrYWJsZSwgJ3RhYmluZGV4JywgJzAnKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufTtcblxuY29uc3QgZHJvcExhYmVsID0gY3JlYXRlVmlldyh7XG4gICAgbmFtZTogJ2Ryb3AtbGFiZWwnLFxuICAgIGlnbm9yZVJlY3Q6IHRydWUsXG4gICAgY3JlYXRlOiBjcmVhdGUkYixcbiAgICBkZXN0cm95OiAoeyByb290IH0pID0+IHtcbiAgICAgICAgcm9vdC5yZWYubGFiZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHJvb3QucmVmLmhhbmRsZUtleURvd24pO1xuICAgICAgICByb290LmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCByb290LnJlZi5oYW5kbGVDbGljayk7XG4gICAgfSxcbiAgICB3cml0ZTogY3JlYXRlUm91dGUoe1xuICAgICAgICBESURfU0VUX0xBQkVMX0lETEU6ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgICAgICAgICB1cGRhdGVMYWJlbFZhbHVlKHJvb3QucmVmLmxhYmVsLCBhY3Rpb24udmFsdWUpO1xuICAgICAgICB9LFxuICAgIH0pLFxuICAgIG1peGluczoge1xuICAgICAgICBzdHlsZXM6IFsnb3BhY2l0eScsICd0cmFuc2xhdGVYJywgJ3RyYW5zbGF0ZVknXSxcbiAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgb3BhY2l0eTogeyB0eXBlOiAndHdlZW4nLCBkdXJhdGlvbjogMTUwIH0sXG4gICAgICAgICAgICB0cmFuc2xhdGVYOiAnc3ByaW5nJyxcbiAgICAgICAgICAgIHRyYW5zbGF0ZVk6ICdzcHJpbmcnLFxuICAgICAgICB9LFxuICAgIH0sXG59KTtcblxuY29uc3QgYmxvYiA9IGNyZWF0ZVZpZXcoe1xuICAgIG5hbWU6ICdkcmlwLWJsb2InLFxuICAgIGlnbm9yZVJlY3Q6IHRydWUsXG4gICAgbWl4aW5zOiB7XG4gICAgICAgIHN0eWxlczogWyd0cmFuc2xhdGVYJywgJ3RyYW5zbGF0ZVknLCAnc2NhbGVYJywgJ3NjYWxlWScsICdvcGFjaXR5J10sXG4gICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgIHNjYWxlWDogJ3NwcmluZycsXG4gICAgICAgICAgICBzY2FsZVk6ICdzcHJpbmcnLFxuICAgICAgICAgICAgdHJhbnNsYXRlWDogJ3NwcmluZycsXG4gICAgICAgICAgICB0cmFuc2xhdGVZOiAnc3ByaW5nJyxcbiAgICAgICAgICAgIG9wYWNpdHk6IHsgdHlwZTogJ3R3ZWVuJywgZHVyYXRpb246IDI1MCB9LFxuICAgICAgICB9LFxuICAgIH0sXG59KTtcblxuY29uc3QgYWRkQmxvYiA9ICh7IHJvb3QgfSkgPT4ge1xuICAgIGNvbnN0IGNlbnRlclggPSByb290LnJlY3QuZWxlbWVudC53aWR0aCAqIDAuNTtcbiAgICBjb25zdCBjZW50ZXJZID0gcm9vdC5yZWN0LmVsZW1lbnQuaGVpZ2h0ICogMC41O1xuXG4gICAgcm9vdC5yZWYuYmxvYiA9IHJvb3QuYXBwZW5kQ2hpbGRWaWV3KFxuICAgICAgICByb290LmNyZWF0ZUNoaWxkVmlldyhibG9iLCB7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgc2NhbGVYOiAyLjUsXG4gICAgICAgICAgICBzY2FsZVk6IDIuNSxcbiAgICAgICAgICAgIHRyYW5zbGF0ZVg6IGNlbnRlclgsXG4gICAgICAgICAgICB0cmFuc2xhdGVZOiBjZW50ZXJZLFxuICAgICAgICB9KVxuICAgICk7XG59O1xuXG5jb25zdCBtb3ZlQmxvYiA9ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgaWYgKCFyb290LnJlZi5ibG9iKSB7XG4gICAgICAgIGFkZEJsb2IoeyByb290IH0pO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcm9vdC5yZWYuYmxvYi50cmFuc2xhdGVYID0gYWN0aW9uLnBvc2l0aW9uLnNjb3BlTGVmdDtcbiAgICByb290LnJlZi5ibG9iLnRyYW5zbGF0ZVkgPSBhY3Rpb24ucG9zaXRpb24uc2NvcGVUb3A7XG4gICAgcm9vdC5yZWYuYmxvYi5zY2FsZVggPSAxO1xuICAgIHJvb3QucmVmLmJsb2Iuc2NhbGVZID0gMTtcbiAgICByb290LnJlZi5ibG9iLm9wYWNpdHkgPSAxO1xufTtcblxuY29uc3QgaGlkZUJsb2IgPSAoeyByb290IH0pID0+IHtcbiAgICBpZiAoIXJvb3QucmVmLmJsb2IpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByb290LnJlZi5ibG9iLm9wYWNpdHkgPSAwO1xufTtcblxuY29uc3QgZXhwbG9kZUJsb2IgPSAoeyByb290IH0pID0+IHtcbiAgICBpZiAoIXJvb3QucmVmLmJsb2IpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByb290LnJlZi5ibG9iLnNjYWxlWCA9IDIuNTtcbiAgICByb290LnJlZi5ibG9iLnNjYWxlWSA9IDIuNTtcbiAgICByb290LnJlZi5ibG9iLm9wYWNpdHkgPSAwO1xufTtcblxuY29uc3Qgd3JpdGUkNyA9ICh7IHJvb3QsIHByb3BzLCBhY3Rpb25zIH0pID0+IHtcbiAgICByb3V0ZSQ0KHsgcm9vdCwgcHJvcHMsIGFjdGlvbnMgfSk7XG5cbiAgICBjb25zdCB7IGJsb2IgfSA9IHJvb3QucmVmO1xuXG4gICAgaWYgKGFjdGlvbnMubGVuZ3RoID09PSAwICYmIGJsb2IgJiYgYmxvYi5vcGFjaXR5ID09PSAwKSB7XG4gICAgICAgIHJvb3QucmVtb3ZlQ2hpbGRWaWV3KGJsb2IpO1xuICAgICAgICByb290LnJlZi5ibG9iID0gbnVsbDtcbiAgICB9XG59O1xuXG5jb25zdCByb3V0ZSQ0ID0gY3JlYXRlUm91dGUoe1xuICAgIERJRF9EUkFHOiBtb3ZlQmxvYixcbiAgICBESURfRFJPUDogZXhwbG9kZUJsb2IsXG4gICAgRElEX0VORF9EUkFHOiBoaWRlQmxvYixcbn0pO1xuXG5jb25zdCBkcmlwID0gY3JlYXRlVmlldyh7XG4gICAgaWdub3JlUmVjdDogdHJ1ZSxcbiAgICBpZ25vcmVSZWN0VXBkYXRlOiB0cnVlLFxuICAgIG5hbWU6ICdkcmlwJyxcbiAgICB3cml0ZTogd3JpdGUkNyxcbn0pO1xuXG5jb25zdCBzZXRJbnB1dEZpbGVzID0gKGVsZW1lbnQsIGZpbGVzKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgRGF0YVRyYW5zZmVyIGluc3RhbmNlIGFuZCBhZGQgYSBuZXdseSBjcmVhdGVkIGZpbGVcbiAgICAgICAgY29uc3QgZGF0YVRyYW5zZmVyID0gbmV3IERhdGFUcmFuc2ZlcigpO1xuICAgICAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBGaWxlKSB7XG4gICAgICAgICAgICAgICAgZGF0YVRyYW5zZmVyLml0ZW1zLmFkZChmaWxlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YVRyYW5zZmVyLml0ZW1zLmFkZChcbiAgICAgICAgICAgICAgICAgICAgbmV3IEZpbGUoW2ZpbGVdLCBmaWxlLm5hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpbGUudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBc3NpZ24gdGhlIERhdGFUcmFuc2ZlciBmaWxlcyBsaXN0IHRvIHRoZSBmaWxlIGlucHV0XG4gICAgICAgIGVsZW1lbnQuZmlsZXMgPSBkYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5jb25zdCBjcmVhdGUkYyA9ICh7IHJvb3QgfSkgPT4ge1xuICAgIHJvb3QucmVmLmZpZWxkcyA9IHt9O1xuICAgIGNvbnN0IGxlZ2VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xlZ2VuZCcpO1xuICAgIGxlZ2VuZC50ZXh0Q29udGVudCA9ICdGaWxlcyc7XG4gICAgcm9vdC5lbGVtZW50LmFwcGVuZENoaWxkKGxlZ2VuZCk7XG59O1xuXG5jb25zdCBnZXRGaWVsZCA9IChyb290LCBpZCkgPT4gcm9vdC5yZWYuZmllbGRzW2lkXTtcblxuY29uc3Qgc3luY0ZpZWxkUG9zaXRpb25zV2l0aEl0ZW1zID0gcm9vdCA9PiB7XG4gICAgcm9vdC5xdWVyeSgnR0VUX0FDVElWRV9JVEVNUycpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGlmICghcm9vdC5yZWYuZmllbGRzW2l0ZW0uaWRdKSByZXR1cm47XG4gICAgICAgIHJvb3QuZWxlbWVudC5hcHBlbmRDaGlsZChyb290LnJlZi5maWVsZHNbaXRlbS5pZF0pO1xuICAgIH0pO1xufTtcblxuY29uc3QgZGlkUmVvcmRlckl0ZW1zID0gKHsgcm9vdCB9KSA9PiBzeW5jRmllbGRQb3NpdGlvbnNXaXRoSXRlbXMocm9vdCk7XG5cbmNvbnN0IGRpZEFkZEl0ZW0gPSAoeyByb290LCBhY3Rpb24gfSkgPT4ge1xuICAgIGNvbnN0IGZpbGVJdGVtID0gcm9vdC5xdWVyeSgnR0VUX0lURU0nLCBhY3Rpb24uaWQpO1xuICAgIGNvbnN0IGlzTG9jYWxGaWxlID0gZmlsZUl0ZW0ub3JpZ2luID09PSBGaWxlT3JpZ2luLkxPQ0FMO1xuICAgIGNvbnN0IHNob3VsZFVzZUZpbGVJbnB1dCA9ICFpc0xvY2FsRmlsZSAmJiByb290LnF1ZXJ5KCdTSE9VTERfVVBEQVRFX0ZJTEVfSU5QVVQnKTtcbiAgICBjb25zdCBkYXRhQ29udGFpbmVyID0gY3JlYXRlRWxlbWVudCQxKCdpbnB1dCcpO1xuICAgIGRhdGFDb250YWluZXIudHlwZSA9IHNob3VsZFVzZUZpbGVJbnB1dCA/ICdmaWxlJyA6ICdoaWRkZW4nO1xuICAgIGRhdGFDb250YWluZXIubmFtZSA9IHJvb3QucXVlcnkoJ0dFVF9OQU1FJyk7XG4gICAgcm9vdC5yZWYuZmllbGRzW2FjdGlvbi5pZF0gPSBkYXRhQ29udGFpbmVyO1xuICAgIHN5bmNGaWVsZFBvc2l0aW9uc1dpdGhJdGVtcyhyb290KTtcbn07XG5cbmNvbnN0IGRpZExvYWRJdGVtJDEgPSAoeyByb290LCBhY3Rpb24gfSkgPT4ge1xuICAgIGNvbnN0IGZpZWxkID0gZ2V0RmllbGQocm9vdCwgYWN0aW9uLmlkKTtcbiAgICBpZiAoIWZpZWxkKSByZXR1cm47XG5cbiAgICAvLyBzdG9yZSBzZXJ2ZXIgcmVmIGluIGhpZGRlbiBpbnB1dFxuICAgIGlmIChhY3Rpb24uc2VydmVyRmlsZVJlZmVyZW5jZSAhPT0gbnVsbCkgZmllbGQudmFsdWUgPSBhY3Rpb24uc2VydmVyRmlsZVJlZmVyZW5jZTtcblxuICAgIC8vIHN0b3JlIGZpbGUgaXRlbSBpbiBmaWxlIGlucHV0XG4gICAgaWYgKCFyb290LnF1ZXJ5KCdTSE9VTERfVVBEQVRFX0ZJTEVfSU5QVVQnKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgZmlsZUl0ZW0gPSByb290LnF1ZXJ5KCdHRVRfSVRFTScsIGFjdGlvbi5pZCk7XG4gICAgc2V0SW5wdXRGaWxlcyhmaWVsZCwgW2ZpbGVJdGVtLmZpbGVdKTtcbn07XG5cbmNvbnN0IGRpZFByZXBhcmVPdXRwdXQgPSAoeyByb290LCBhY3Rpb24gfSkgPT4ge1xuICAgIC8vIHRoaXMgdGltZW91dCBwdXNoZXMgdGhlIGhhbmRsZXIgYWZ0ZXIgJ2xvYWQnXG4gICAgaWYgKCFyb290LnF1ZXJ5KCdTSE9VTERfVVBEQVRFX0ZJTEVfSU5QVVQnKSkgcmV0dXJuO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWVsZCA9IGdldEZpZWxkKHJvb3QsIGFjdGlvbi5pZCk7XG4gICAgICAgIGlmICghZmllbGQpIHJldHVybjtcbiAgICAgICAgc2V0SW5wdXRGaWxlcyhmaWVsZCwgW2FjdGlvbi5maWxlXSk7XG4gICAgfSwgMCk7XG59O1xuXG5jb25zdCBkaWRTZXREaXNhYmxlZCA9ICh7IHJvb3QgfSkgPT4ge1xuICAgIHJvb3QuZWxlbWVudC5kaXNhYmxlZCA9IHJvb3QucXVlcnkoJ0dFVF9ESVNBQkxFRCcpO1xufTtcblxuY29uc3QgZGlkUmVtb3ZlSXRlbSA9ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgY29uc3QgZmllbGQgPSBnZXRGaWVsZChyb290LCBhY3Rpb24uaWQpO1xuICAgIGlmICghZmllbGQpIHJldHVybjtcbiAgICBpZiAoZmllbGQucGFyZW50Tm9kZSkgZmllbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmaWVsZCk7XG4gICAgZGVsZXRlIHJvb3QucmVmLmZpZWxkc1thY3Rpb24uaWRdO1xufTtcblxuLy8gb25seSBydW5zIGZvciBzZXJ2ZXIgZmlsZXMuIHdpbGwgcmVmdXNlIHRvIHVwZGF0ZSB0aGUgdmFsdWUgaWYgdGhlIGZpZWxkXG4vLyBpcyBhIGZpbGUgZmllbGRcbmNvbnN0IGRpZERlZmluZVZhbHVlID0gKHsgcm9vdCwgYWN0aW9uIH0pID0+IHtcbiAgICBjb25zdCBmaWVsZCA9IGdldEZpZWxkKHJvb3QsIGFjdGlvbi5pZCk7XG4gICAgaWYgKCFmaWVsZCkgcmV0dXJuO1xuICAgIGlmIChhY3Rpb24udmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgLy8gY2xlYXIgZmllbGQgdmFsdWVcbiAgICAgICAgZmllbGQucmVtb3ZlQXR0cmlidXRlKCd2YWx1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNldCBmaWVsZCB2YWx1ZVxuICAgICAgICBpZiAoZmllbGQudHlwZSAhPSAnZmlsZScpIHtcbiAgICAgICAgICAgIGZpZWxkLnZhbHVlID0gYWN0aW9uLnZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN5bmNGaWVsZFBvc2l0aW9uc1dpdGhJdGVtcyhyb290KTtcbn07XG5cbmNvbnN0IHdyaXRlJDggPSBjcmVhdGVSb3V0ZSh7XG4gICAgRElEX1NFVF9ESVNBQkxFRDogZGlkU2V0RGlzYWJsZWQsXG4gICAgRElEX0FERF9JVEVNOiBkaWRBZGRJdGVtLFxuICAgIERJRF9MT0FEX0lURU06IGRpZExvYWRJdGVtJDEsXG4gICAgRElEX1JFTU9WRV9JVEVNOiBkaWRSZW1vdmVJdGVtLFxuICAgIERJRF9ERUZJTkVfVkFMVUU6IGRpZERlZmluZVZhbHVlLFxuICAgIERJRF9QUkVQQVJFX09VVFBVVDogZGlkUHJlcGFyZU91dHB1dCxcbiAgICBESURfUkVPUkRFUl9JVEVNUzogZGlkUmVvcmRlckl0ZW1zLFxuICAgIERJRF9TT1JUX0lURU1TOiBkaWRSZW9yZGVySXRlbXMsXG59KTtcblxuY29uc3QgZGF0YSA9IGNyZWF0ZVZpZXcoe1xuICAgIHRhZzogJ2ZpZWxkc2V0JyxcbiAgICBuYW1lOiAnZGF0YScsXG4gICAgY3JlYXRlOiBjcmVhdGUkYyxcbiAgICB3cml0ZTogd3JpdGUkOCxcbiAgICBpZ25vcmVSZWN0OiB0cnVlLFxufSk7XG5cbmNvbnN0IGdldFJvb3ROb2RlID0gZWxlbWVudCA9PiAoJ2dldFJvb3ROb2RlJyBpbiBlbGVtZW50ID8gZWxlbWVudC5nZXRSb290Tm9kZSgpIDogZG9jdW1lbnQpO1xuXG5jb25zdCBpbWFnZXMgPSBbJ2pwZycsICdqcGVnJywgJ3BuZycsICdnaWYnLCAnYm1wJywgJ3dlYnAnLCAnc3ZnJywgJ3RpZmYnXTtcbmNvbnN0IHRleHQkMSA9IFsnY3NzJywgJ2NzdicsICdodG1sJywgJ3R4dCddO1xuY29uc3QgbWFwID0ge1xuICAgIHppcDogJ3ppcHxjb21wcmVzc2VkJyxcbiAgICBlcHViOiAnYXBwbGljYXRpb24vZXB1Yit6aXAnLFxufTtcblxuY29uc3QgZ3Vlc3N0aW1hdGVNaW1lVHlwZSA9IChleHRlbnNpb24gPSAnJykgPT4ge1xuICAgIGV4dGVuc2lvbiA9IGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChpbWFnZXMuaW5jbHVkZXMoZXh0ZW5zaW9uKSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgJ2ltYWdlLycgKyAoZXh0ZW5zaW9uID09PSAnanBnJyA/ICdqcGVnJyA6IGV4dGVuc2lvbiA9PT0gJ3N2ZycgPyAnc3ZnK3htbCcgOiBleHRlbnNpb24pXG4gICAgICAgICk7XG4gICAgfVxuICAgIGlmICh0ZXh0JDEuaW5jbHVkZXMoZXh0ZW5zaW9uKSkge1xuICAgICAgICByZXR1cm4gJ3RleHQvJyArIGV4dGVuc2lvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFwW2V4dGVuc2lvbl0gfHwgJyc7XG59O1xuXG5jb25zdCByZXF1ZXN0RGF0YVRyYW5zZmVySXRlbXMgPSBkYXRhVHJhbnNmZXIgPT5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIC8vIHRyeSB0byBnZXQgbGlua3MgZnJvbSB0cmFuc2ZlciwgaWYgZm91bmQgd2UnbGwgZXhpdCBpbW1lZGlhdGVseSAodW5sZXNzIGEgZmlsZSBpcyBpbiB0aGUgZGF0YVRyYW5zZmVyIGFzIHdlbGwsIHRoaXMgaXMgYmVjYXVzZSBGaXJlZm94IGNvdWxkIHJlcHJlc2VudCB0aGUgZmlsZSBhcyBhIFVSTCBhbmQgYSBmaWxlIG9iamVjdCBhdCB0aGUgc2FtZSB0aW1lKVxuICAgICAgICBjb25zdCBsaW5rcyA9IGdldExpbmtzKGRhdGFUcmFuc2Zlcik7XG4gICAgICAgIGlmIChsaW5rcy5sZW5ndGggJiYgIWhhc0ZpbGVzKGRhdGFUcmFuc2ZlcikpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGxpbmtzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0cnkgdG8gZ2V0IGZpbGVzIGZyb20gdGhlIHRyYW5zZmVyXG4gICAgICAgIGdldEZpbGVzKGRhdGFUcmFuc2ZlcikudGhlbihyZXNvbHZlKTtcbiAgICB9KTtcblxuLyoqXG4gKiBUZXN0IGlmIGRhdGF0cmFuc2ZlciBoYXMgZmlsZXNcbiAqL1xuY29uc3QgaGFzRmlsZXMgPSBkYXRhVHJhbnNmZXIgPT4ge1xuICAgIGlmIChkYXRhVHJhbnNmZXIuZmlsZXMpIHJldHVybiBkYXRhVHJhbnNmZXIuZmlsZXMubGVuZ3RoID4gMDtcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIEV4dHJhY3RzIGZpbGVzIGZyb20gYSBEYXRhVHJhbnNmZXIgb2JqZWN0XG4gKi9cbmNvbnN0IGdldEZpbGVzID0gZGF0YVRyYW5zZmVyID0+XG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAvLyBnZXQgdGhlIHRyYW5zZmVyIGl0ZW1zIGFzIHByb21pc2VzXG4gICAgICAgIGNvbnN0IHByb21pc2VkRmlsZXMgPSAoZGF0YVRyYW5zZmVyLml0ZW1zID8gQXJyYXkuZnJvbShkYXRhVHJhbnNmZXIuaXRlbXMpIDogW10pXG5cbiAgICAgICAgICAgIC8vIG9ubHkga2VlcCBmaWxlIHN5c3RlbSBpdGVtcyAoZmlsZXMgYW5kIGRpcmVjdG9yaWVzKVxuICAgICAgICAgICAgLmZpbHRlcihpdGVtID0+IGlzRmlsZVN5c3RlbUl0ZW0oaXRlbSkpXG5cbiAgICAgICAgICAgIC8vIG1hcCBlYWNoIGl0ZW0gdG8gcHJvbWlzZVxuICAgICAgICAgICAgLm1hcChpdGVtID0+IGdldEZpbGVzRnJvbUl0ZW0oaXRlbSkpO1xuXG4gICAgICAgIC8vIGlmIGlzIGVtcHR5LCBzZWUgaWYgd2UgY2FuIGV4dHJhY3Qgc29tZSBpbmZvIGZyb20gdGhlIGZpbGVzIHByb3BlcnR5IGFzIGEgZmFsbGJhY2tcbiAgICAgICAgaWYgKCFwcm9taXNlZEZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gVE9ETzogdGVzdCBmb3IgZGlyZWN0b3JpZXMgKHNob3VsZCBub3QgYmUgYWxsb3dlZClcbiAgICAgICAgICAgIC8vIFVzZSBGaWxlUmVhZGVyLCBwcm9ibGVtIGlzIHRoYXQgdGhlIGZpbGVzIHByb3BlcnR5IGdldHMgbG9zdCBpbiB0aGUgcHJvY2Vzc1xuICAgICAgICAgICAgcmVzb2x2ZShkYXRhVHJhbnNmZXIuZmlsZXMgPyBBcnJheS5mcm9tKGRhdGFUcmFuc2Zlci5maWxlcykgOiBbXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkb25lIVxuICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlZEZpbGVzKVxuICAgICAgICAgICAgLnRoZW4ocmV0dXJuZWRGaWxlR3JvdXBzID0+IHtcbiAgICAgICAgICAgICAgICAvLyBmbGF0dGVuIGdyb3Vwc1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gW107XG4gICAgICAgICAgICAgICAgcmV0dXJuZWRGaWxlR3JvdXBzLmZvckVhY2goZ3JvdXAgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaWxlcy5wdXNoLmFwcGx5KGZpbGVzLCBncm91cCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBkb25lIChmaWx0ZXIgb3V0IGVtcHR5IGZpbGVzKSFcbiAgICAgICAgICAgICAgICByZXNvbHZlKFxuICAgICAgICAgICAgICAgICAgICBmaWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmaWxlID0+IGZpbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGZpbGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmlsZS5fcmVsYXRpdmVQYXRoKSBmaWxlLl9yZWxhdGl2ZVBhdGggPSBmaWxlLndlYmtpdFJlbGF0aXZlUGF0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goY29uc29sZS5lcnJvcik7XG4gICAgfSk7XG5cbmNvbnN0IGlzRmlsZVN5c3RlbUl0ZW0gPSBpdGVtID0+IHtcbiAgICBpZiAoaXNFbnRyeShpdGVtKSkge1xuICAgICAgICBjb25zdCBlbnRyeSA9IGdldEFzRW50cnkoaXRlbSk7XG4gICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgcmV0dXJuIGVudHJ5LmlzRmlsZSB8fCBlbnRyeS5pc0RpcmVjdG9yeTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXRlbS5raW5kID09PSAnZmlsZSc7XG59O1xuXG5jb25zdCBnZXRGaWxlc0Zyb21JdGVtID0gaXRlbSA9PlxuICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKGlzRGlyZWN0b3J5RW50cnkoaXRlbSkpIHtcbiAgICAgICAgICAgIGdldEZpbGVzSW5EaXJlY3RvcnkoZ2V0QXNFbnRyeShpdGVtKSlcbiAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZShbaXRlbS5nZXRBc0ZpbGUoKV0pO1xuICAgIH0pO1xuXG5jb25zdCBnZXRGaWxlc0luRGlyZWN0b3J5ID0gZW50cnkgPT5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gW107XG5cbiAgICAgICAgLy8gdGhlIHRvdGFsIGVudHJpZXMgdG8gcmVhZFxuICAgICAgICBsZXQgZGlyQ291bnRlciA9IDA7XG4gICAgICAgIGxldCBmaWxlQ291bnRlciA9IDA7XG5cbiAgICAgICAgY29uc3QgcmVzb2x2ZUlmRG9uZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlQ291bnRlciA9PT0gMCAmJiBkaXJDb3VudGVyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShmaWxlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gdGhlIHJlY3Vyc2l2ZSBmdW5jdGlvblxuICAgICAgICBjb25zdCByZWFkRW50cmllcyA9IGRpckVudHJ5ID0+IHtcbiAgICAgICAgICAgIGRpckNvdW50ZXIrKztcblxuICAgICAgICAgICAgY29uc3QgZGlyZWN0b3J5UmVhZGVyID0gZGlyRW50cnkuY3JlYXRlUmVhZGVyKCk7XG5cbiAgICAgICAgICAgIC8vIGRpcmVjdG9yaWVzIGFyZSByZXR1cm5lZCBpbiBiYXRjaGVzLCB3ZSBuZWVkIHRvIHByb2Nlc3MgYWxsIGJhdGNoZXMgYmVmb3JlIHdlJ3JlIGRvbmVcbiAgICAgICAgICAgIGNvbnN0IHJlYWRCYXRjaCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBkaXJlY3RvcnlSZWFkZXIucmVhZEVudHJpZXMoZW50cmllcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlyQ291bnRlci0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUlmRG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlY3Vyc2l2ZWx5IHJlYWQgbW9yZSBkaXJlY3Rvcmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZEVudHJpZXMoZW50cnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWFkIGFzIGZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlQ291bnRlcisrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkuZmlsZShmaWxlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29ycmVjdGVkRmlsZSA9IGNvcnJlY3RNaXNzaW5nRmlsZVR5cGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbnRyeS5mdWxsUGF0aCkgY29ycmVjdGVkRmlsZS5fcmVsYXRpdmVQYXRoID0gZW50cnkuZnVsbFBhdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzLnB1c2goY29ycmVjdGVkRmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVDb3VudGVyLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVJZkRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdHJ5IHRvIGdldCBuZXh0IGJhdGNoIG9mIGZpbGVzXG4gICAgICAgICAgICAgICAgICAgIHJlYWRCYXRjaCgpO1xuICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyByZWFkIGZpcnN0IGJhdGNoIG9mIGZpbGVzXG4gICAgICAgICAgICByZWFkQmF0Y2goKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBnbyFcbiAgICAgICAgcmVhZEVudHJpZXMoZW50cnkpO1xuICAgIH0pO1xuXG5jb25zdCBjb3JyZWN0TWlzc2luZ0ZpbGVUeXBlID0gZmlsZSA9PiB7XG4gICAgaWYgKGZpbGUudHlwZS5sZW5ndGgpIHJldHVybiBmaWxlO1xuICAgIGNvbnN0IGRhdGUgPSBmaWxlLmxhc3RNb2RpZmllZERhdGU7XG4gICAgY29uc3QgbmFtZSA9IGZpbGUubmFtZTtcbiAgICBjb25zdCB0eXBlID0gZ3Vlc3N0aW1hdGVNaW1lVHlwZShnZXRFeHRlbnNpb25Gcm9tRmlsZW5hbWUoZmlsZS5uYW1lKSk7XG4gICAgaWYgKCF0eXBlLmxlbmd0aCkgcmV0dXJuIGZpbGU7XG4gICAgZmlsZSA9IGZpbGUuc2xpY2UoMCwgZmlsZS5zaXplLCB0eXBlKTtcbiAgICBmaWxlLm5hbWUgPSBuYW1lO1xuICAgIGZpbGUubGFzdE1vZGlmaWVkRGF0ZSA9IGRhdGU7XG4gICAgcmV0dXJuIGZpbGU7XG59O1xuXG5jb25zdCBpc0RpcmVjdG9yeUVudHJ5ID0gaXRlbSA9PiBpc0VudHJ5KGl0ZW0pICYmIChnZXRBc0VudHJ5KGl0ZW0pIHx8IHt9KS5pc0RpcmVjdG9yeTtcblxuY29uc3QgaXNFbnRyeSA9IGl0ZW0gPT4gJ3dlYmtpdEdldEFzRW50cnknIGluIGl0ZW07XG5cbmNvbnN0IGdldEFzRW50cnkgPSBpdGVtID0+IGl0ZW0ud2Via2l0R2V0QXNFbnRyeSgpO1xuXG4vKipcbiAqIEV4dHJhY3RzIGxpbmtzIGZyb20gYSBEYXRhVHJhbnNmZXIgb2JqZWN0XG4gKi9cbmNvbnN0IGdldExpbmtzID0gZGF0YVRyYW5zZmVyID0+IHtcbiAgICBsZXQgbGlua3MgPSBbXTtcbiAgICB0cnkge1xuICAgICAgICAvLyBsb29rIGluIG1ldGEgZGF0YSBwcm9wZXJ0eVxuICAgICAgICBsaW5rcyA9IGdldExpbmtzRnJvbVRyYW5zZmVyTWV0YURhdGEoZGF0YVRyYW5zZmVyKTtcbiAgICAgICAgaWYgKGxpbmtzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGxpbmtzO1xuICAgICAgICB9XG4gICAgICAgIGxpbmtzID0gZ2V0TGlua3NGcm9tVHJhbnNmZXJVUkxEYXRhKGRhdGFUcmFuc2Zlcik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBub3BlIG5vcGUgbm9wZSAocHJvYmFibHkgSUUgdHJvdWJsZSlcbiAgICB9XG4gICAgcmV0dXJuIGxpbmtzO1xufTtcblxuY29uc3QgZ2V0TGlua3NGcm9tVHJhbnNmZXJVUkxEYXRhID0gZGF0YVRyYW5zZmVyID0+IHtcbiAgICBsZXQgZGF0YSA9IGRhdGFUcmFuc2Zlci5nZXREYXRhKCd1cmwnKTtcbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnICYmIGRhdGEubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBbZGF0YV07XG4gICAgfVxuICAgIHJldHVybiBbXTtcbn07XG5cbmNvbnN0IGdldExpbmtzRnJvbVRyYW5zZmVyTWV0YURhdGEgPSBkYXRhVHJhbnNmZXIgPT4ge1xuICAgIGxldCBkYXRhID0gZGF0YVRyYW5zZmVyLmdldERhdGEoJ3RleHQvaHRtbCcpO1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgJiYgZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IGRhdGEubWF0Y2goL3NyY1xccyo9XFxzKlwiKC4rPylcIi8pO1xuICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgcmV0dXJuIFttYXRjaGVzWzFdXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107XG59O1xuXG5jb25zdCBkcmFnTkRyb3BPYnNlcnZlcnMgPSBbXTtcblxuY29uc3QgZXZlbnRQb3NpdGlvbiA9IGUgPT4gKHtcbiAgICBwYWdlTGVmdDogZS5wYWdlWCxcbiAgICBwYWdlVG9wOiBlLnBhZ2VZLFxuICAgIHNjb3BlTGVmdDogZS5vZmZzZXRYIHx8IGUubGF5ZXJYLFxuICAgIHNjb3BlVG9wOiBlLm9mZnNldFkgfHwgZS5sYXllclksXG59KTtcblxuY29uc3QgY3JlYXRlRHJhZ05Ecm9wQ2xpZW50ID0gKGVsZW1lbnQsIHNjb3BlVG9PYnNlcnZlLCBmaWx0ZXJFbGVtZW50KSA9PiB7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBnZXREcmFnTkRyb3BPYnNlcnZlcihzY29wZVRvT2JzZXJ2ZSk7XG5cbiAgICBjb25zdCBjbGllbnQgPSB7XG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgIGZpbHRlckVsZW1lbnQsXG4gICAgICAgIHN0YXRlOiBudWxsLFxuICAgICAgICBvbmRyb3A6ICgpID0+IHt9LFxuICAgICAgICBvbmVudGVyOiAoKSA9PiB7fSxcbiAgICAgICAgb25kcmFnOiAoKSA9PiB7fSxcbiAgICAgICAgb25leGl0OiAoKSA9PiB7fSxcbiAgICAgICAgb25sb2FkOiAoKSA9PiB7fSxcbiAgICAgICAgYWxsb3dkcm9wOiAoKSA9PiB7fSxcbiAgICB9O1xuXG4gICAgY2xpZW50LmRlc3Ryb3kgPSBvYnNlcnZlci5hZGRMaXN0ZW5lcihjbGllbnQpO1xuXG4gICAgcmV0dXJuIGNsaWVudDtcbn07XG5cbmNvbnN0IGdldERyYWdORHJvcE9ic2VydmVyID0gZWxlbWVudCA9PiB7XG4gICAgLy8gc2VlIGlmIGFscmVhZHkgZXhpc3RzLCBpZiBzbywgcmV0dXJuXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBkcmFnTkRyb3BPYnNlcnZlcnMuZmluZChpdGVtID0+IGl0ZW0uZWxlbWVudCA9PT0gZWxlbWVudCk7XG4gICAgaWYgKG9ic2VydmVyKSB7XG4gICAgICAgIHJldHVybiBvYnNlcnZlcjtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgbmV3IG9ic2VydmVyLCBkb2VzIG5vdCB5ZXQgZXhpc3QgZm9yIHRoaXMgZWxlbWVudFxuICAgIGNvbnN0IG5ld09ic2VydmVyID0gY3JlYXRlRHJhZ05Ecm9wT2JzZXJ2ZXIoZWxlbWVudCk7XG4gICAgZHJhZ05Ecm9wT2JzZXJ2ZXJzLnB1c2gobmV3T2JzZXJ2ZXIpO1xuICAgIHJldHVybiBuZXdPYnNlcnZlcjtcbn07XG5cbmNvbnN0IGNyZWF0ZURyYWdORHJvcE9ic2VydmVyID0gZWxlbWVudCA9PiB7XG4gICAgY29uc3QgY2xpZW50cyA9IFtdO1xuXG4gICAgY29uc3Qgcm91dGVzID0ge1xuICAgICAgICBkcmFnZW50ZXIsXG4gICAgICAgIGRyYWdvdmVyLFxuICAgICAgICBkcmFnbGVhdmUsXG4gICAgICAgIGRyb3AsXG4gICAgfTtcblxuICAgIGNvbnN0IGhhbmRsZXJzID0ge307XG5cbiAgICBmb3Jpbihyb3V0ZXMsIChldmVudCwgY3JlYXRlSGFuZGxlcikgPT4ge1xuICAgICAgICBoYW5kbGVyc1tldmVudF0gPSBjcmVhdGVIYW5kbGVyKGVsZW1lbnQsIGNsaWVudHMpO1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXJzW2V2ZW50XSwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSB7XG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgIGFkZExpc3RlbmVyOiBjbGllbnQgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGFzIGNsaWVudFxuICAgICAgICAgICAgY2xpZW50cy5wdXNoKGNsaWVudCk7XG5cbiAgICAgICAgICAgIC8vIHJldHVybiByZW1vdmVMaXN0ZW5lciBmdW5jdGlvblxuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgY2xpZW50XG4gICAgICAgICAgICAgICAgY2xpZW50cy5zcGxpY2UoY2xpZW50cy5pbmRleE9mKGNsaWVudCksIDEpO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgbm8gbW9yZSBjbGllbnRzLCBjbGVhbiB1cCBvYnNlcnZlclxuICAgICAgICAgICAgICAgIGlmIChjbGllbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBkcmFnTkRyb3BPYnNlcnZlcnMuc3BsaWNlKGRyYWdORHJvcE9ic2VydmVycy5pbmRleE9mKG9ic2VydmVyKSwgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yaW4ocm91dGVzLCBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXJzW2V2ZW50XSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgIH07XG5cbiAgICByZXR1cm4gb2JzZXJ2ZXI7XG59O1xuXG5jb25zdCBlbGVtZW50RnJvbVBvaW50ID0gKHJvb3QsIHBvaW50KSA9PiB7XG4gICAgaWYgKCEoJ2VsZW1lbnRGcm9tUG9pbnQnIGluIHJvb3QpKSB7XG4gICAgICAgIHJvb3QgPSBkb2N1bWVudDtcbiAgICB9XG4gICAgcmV0dXJuIHJvb3QuZWxlbWVudEZyb21Qb2ludChwb2ludC54LCBwb2ludC55KTtcbn07XG5cbmNvbnN0IGlzRXZlbnRUYXJnZXQgPSAoZSwgdGFyZ2V0KSA9PiB7XG4gICAgLy8gZ2V0IHJvb3RcbiAgICBjb25zdCByb290ID0gZ2V0Um9vdE5vZGUodGFyZ2V0KTtcblxuICAgIC8vIGdldCBlbGVtZW50IGF0IHBvc2l0aW9uXG4gICAgLy8gaWYgcm9vdCBpcyBub3QgYWN0dWFsIHNoYWRvdyBET00gYW5kIGRvZXMgbm90IGhhdmUgZWxlbWVudEZyb21Qb2ludCBtZXRob2QsIHVzZSB0aGUgb25lIG9uIGRvY3VtZW50XG4gICAgY29uc3QgZWxlbWVudEF0UG9zaXRpb24gPSBlbGVtZW50RnJvbVBvaW50KHJvb3QsIHtcbiAgICAgICAgeDogZS5wYWdlWCAtIHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICAgICAgeTogZS5wYWdlWSAtIHdpbmRvdy5wYWdlWU9mZnNldCxcbiAgICB9KTtcblxuICAgIC8vIHRlc3QgaWYgdGFyZ2V0IGlzIHRoZSBlbGVtZW50IG9yIGlmIG9uZSBvZiBpdHMgY2hpbGRyZW4gaXNcbiAgICByZXR1cm4gZWxlbWVudEF0UG9zaXRpb24gPT09IHRhcmdldCB8fCB0YXJnZXQuY29udGFpbnMoZWxlbWVudEF0UG9zaXRpb24pO1xufTtcblxubGV0IGluaXRpYWxUYXJnZXQgPSBudWxsO1xuXG5jb25zdCBzZXREcm9wRWZmZWN0ID0gKGRhdGFUcmFuc2ZlciwgZWZmZWN0KSA9PiB7XG4gICAgLy8gaXMgaW4gdHJ5IGNhdGNoIGFzIElFMTEgd2lsbCB0aHJvdyBlcnJvciBpZiBub3RcbiAgICB0cnkge1xuICAgICAgICBkYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IGVmZmVjdDtcbiAgICB9IGNhdGNoIChlKSB7fVxufTtcblxuY29uc3QgZHJhZ2VudGVyID0gKHJvb3QsIGNsaWVudHMpID0+IGUgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGluaXRpYWxUYXJnZXQgPSBlLnRhcmdldDtcblxuICAgIGNsaWVudHMuZm9yRWFjaChjbGllbnQgPT4ge1xuICAgICAgICBjb25zdCB7IGVsZW1lbnQsIG9uZW50ZXIgfSA9IGNsaWVudDtcblxuICAgICAgICBpZiAoaXNFdmVudFRhcmdldChlLCBlbGVtZW50KSkge1xuICAgICAgICAgICAgY2xpZW50LnN0YXRlID0gJ2VudGVyJztcblxuICAgICAgICAgICAgLy8gZmlyZSBlbnRlciBldmVudFxuICAgICAgICAgICAgb25lbnRlcihldmVudFBvc2l0aW9uKGUpKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuY29uc3QgZHJhZ292ZXIgPSAocm9vdCwgY2xpZW50cykgPT4gZSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgZGF0YVRyYW5zZmVyID0gZS5kYXRhVHJhbnNmZXI7XG5cbiAgICByZXF1ZXN0RGF0YVRyYW5zZmVySXRlbXMoZGF0YVRyYW5zZmVyKS50aGVuKGl0ZW1zID0+IHtcbiAgICAgICAgbGV0IG92ZXJEcm9wVGFyZ2V0ID0gZmFsc2U7XG5cbiAgICAgICAgY2xpZW50cy5zb21lKGNsaWVudCA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGZpbHRlckVsZW1lbnQsIGVsZW1lbnQsIG9uZW50ZXIsIG9uZXhpdCwgb25kcmFnLCBhbGxvd2Ryb3AgfSA9IGNsaWVudDtcblxuICAgICAgICAgICAgLy8gYnkgZGVmYXVsdCB3ZSBjYW4gZHJvcFxuICAgICAgICAgICAgc2V0RHJvcEVmZmVjdChkYXRhVHJhbnNmZXIsICdjb3B5Jyk7XG5cbiAgICAgICAgICAgIC8vIGFsbG93IHRyYW5zZmVyIG9mIHRoZXNlIGl0ZW1zXG4gICAgICAgICAgICBjb25zdCBhbGxvd3NUcmFuc2ZlciA9IGFsbG93ZHJvcChpdGVtcyk7XG5cbiAgICAgICAgICAgIC8vIG9ubHkgdXNlZCB3aGVuIGNhbiBiZSBkcm9wcGVkIG9uIHBhZ2VcbiAgICAgICAgICAgIGlmICghYWxsb3dzVHJhbnNmZXIpIHtcbiAgICAgICAgICAgICAgICBzZXREcm9wRWZmZWN0KGRhdGFUcmFuc2ZlciwgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHRhcmdldHRpbmcgdGhpcyBjbGllbnRcbiAgICAgICAgICAgIGlmIChpc0V2ZW50VGFyZ2V0KGUsIGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgb3ZlckRyb3BUYXJnZXQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gaGFkIG5vIHByZXZpb3VzIHN0YXRlLCBtZWFucyB3ZSBhcmUgZW50ZXJpbmcgdGhpcyBjbGllbnRcbiAgICAgICAgICAgICAgICBpZiAoY2xpZW50LnN0YXRlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudC5zdGF0ZSA9ICdlbnRlcic7XG4gICAgICAgICAgICAgICAgICAgIG9uZW50ZXIoZXZlbnRQb3NpdGlvbihlKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBub3cgb3ZlciBlbGVtZW50IChubyBtYXR0ZXIgaWYgaXQgYWxsb3dzIHRoZSBkcm9wIG9yIG5vdClcbiAgICAgICAgICAgICAgICBjbGllbnQuc3RhdGUgPSAnb3Zlcic7XG5cbiAgICAgICAgICAgICAgICAvLyBuZWVkcyB0byBhbGxvdyB0cmFuc2ZlclxuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJFbGVtZW50ICYmICFhbGxvd3NUcmFuc2Zlcikge1xuICAgICAgICAgICAgICAgICAgICBzZXREcm9wRWZmZWN0KGRhdGFUcmFuc2ZlciwgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRyYWdnaW5nXG4gICAgICAgICAgICAgICAgb25kcmFnKGV2ZW50UG9zaXRpb24oZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzaG91bGQgYmUgb3ZlciBhbiBlbGVtZW50IHRvIGRyb3BcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyRWxlbWVudCAmJiAhb3ZlckRyb3BUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0RHJvcEVmZmVjdChkYXRhVHJhbnNmZXIsICdub25lJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gbWlnaHQgaGF2ZSBqdXN0IGxlZnQgdGhpcyBjbGllbnQ/XG4gICAgICAgICAgICAgICAgaWYgKGNsaWVudC5zdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBjbGllbnQuc3RhdGUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBvbmV4aXQoZXZlbnRQb3NpdGlvbihlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbmNvbnN0IGRyb3AgPSAocm9vdCwgY2xpZW50cykgPT4gZSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgZGF0YVRyYW5zZmVyID0gZS5kYXRhVHJhbnNmZXI7XG5cbiAgICByZXF1ZXN0RGF0YVRyYW5zZmVySXRlbXMoZGF0YVRyYW5zZmVyKS50aGVuKGl0ZW1zID0+IHtcbiAgICAgICAgY2xpZW50cy5mb3JFYWNoKGNsaWVudCA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGZpbHRlckVsZW1lbnQsIGVsZW1lbnQsIG9uZHJvcCwgb25leGl0LCBhbGxvd2Ryb3AgfSA9IGNsaWVudDtcblxuICAgICAgICAgICAgY2xpZW50LnN0YXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gaWYgd2UncmUgZmlsdGVyaW5nIG9uIGVsZW1lbnQgd2UgbmVlZCB0byBiZSBvdmVyIHRoZSBlbGVtZW50IHRvIGRyb3BcbiAgICAgICAgICAgIGlmIChmaWx0ZXJFbGVtZW50ICYmICFpc0V2ZW50VGFyZ2V0KGUsIGVsZW1lbnQpKSByZXR1cm47XG5cbiAgICAgICAgICAgIC8vIG5vIHRyYW5zZmVyIGZvciB0aGlzIGNsaWVudFxuICAgICAgICAgICAgaWYgKCFhbGxvd2Ryb3AoaXRlbXMpKSByZXR1cm4gb25leGl0KGV2ZW50UG9zaXRpb24oZSkpO1xuXG4gICAgICAgICAgICAvLyB3ZSBjYW4gZHJvcCB0aGVzZSBpdGVtcyBvbiB0aGlzIGNsaWVudFxuICAgICAgICAgICAgb25kcm9wKGV2ZW50UG9zaXRpb24oZSksIGl0ZW1zKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5jb25zdCBkcmFnbGVhdmUgPSAocm9vdCwgY2xpZW50cykgPT4gZSA9PiB7XG4gICAgaWYgKGluaXRpYWxUYXJnZXQgIT09IGUudGFyZ2V0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjbGllbnRzLmZvckVhY2goY2xpZW50ID0+IHtcbiAgICAgICAgY29uc3QgeyBvbmV4aXQgfSA9IGNsaWVudDtcblxuICAgICAgICBjbGllbnQuc3RhdGUgPSBudWxsO1xuXG4gICAgICAgIG9uZXhpdChldmVudFBvc2l0aW9uKGUpKTtcbiAgICB9KTtcbn07XG5cbmNvbnN0IGNyZWF0ZUhvcHBlciA9IChzY29wZSwgdmFsaWRhdGVJdGVtcywgb3B0aW9ucykgPT4ge1xuICAgIC8vIGlzIG5vdyBob3BwZXIgc2NvcGVcbiAgICBzY29wZS5jbGFzc0xpc3QuYWRkKCdmaWxlcG9uZC0taG9wcGVyJyk7XG5cbiAgICAvLyBzaG9ydGN1dHNcbiAgICBjb25zdCB7IGNhdGNoZXNEcm9wc09uUGFnZSwgcmVxdWlyZXNEcm9wT25FbGVtZW50LCBmaWx0ZXJJdGVtcyA9IGl0ZW1zID0+IGl0ZW1zIH0gPSBvcHRpb25zO1xuXG4gICAgLy8gY3JlYXRlIGEgZG5kIGNsaWVudFxuICAgIGNvbnN0IGNsaWVudCA9IGNyZWF0ZURyYWdORHJvcENsaWVudChcbiAgICAgICAgc2NvcGUsXG4gICAgICAgIGNhdGNoZXNEcm9wc09uUGFnZSA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCA6IHNjb3BlLFxuICAgICAgICByZXF1aXJlc0Ryb3BPbkVsZW1lbnRcbiAgICApO1xuXG4gICAgLy8gY3VycmVudCBjbGllbnQgc3RhdGVcbiAgICBsZXQgbGFzdFN0YXRlID0gJyc7XG4gICAgbGV0IGN1cnJlbnRTdGF0ZSA9ICcnO1xuXG4gICAgLy8gZGV0ZXJtaW5lcyBpZiBhIGZpbGUgbWF5IGJlIGRyb3BwZWRcbiAgICBjbGllbnQuYWxsb3dkcm9wID0gaXRlbXMgPT4ge1xuICAgICAgICAvLyBUT0RPOiBpZiB3ZSBjYW4sIHRocm93IGVycm9yIHRvIGluZGljYXRlIHRoZSBpdGVtcyBjYW5ub3QgYnkgZHJvcHBlZFxuXG4gICAgICAgIHJldHVybiB2YWxpZGF0ZUl0ZW1zKGZpbHRlckl0ZW1zKGl0ZW1zKSk7XG4gICAgfTtcblxuICAgIGNsaWVudC5vbmRyb3AgPSAocG9zaXRpb24sIGl0ZW1zKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJJdGVtcyhpdGVtcyk7XG5cbiAgICAgICAgaWYgKCF2YWxpZGF0ZUl0ZW1zKGZpbHRlcmVkSXRlbXMpKSB7XG4gICAgICAgICAgICBhcGkub25kcmFnZW5kKHBvc2l0aW9uKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRTdGF0ZSA9ICdkcmFnLWRyb3AnO1xuXG4gICAgICAgIGFwaS5vbmxvYWQoZmlsdGVyZWRJdGVtcywgcG9zaXRpb24pO1xuICAgIH07XG5cbiAgICBjbGllbnQub25kcmFnID0gcG9zaXRpb24gPT4ge1xuICAgICAgICBhcGkub25kcmFnKHBvc2l0aW9uKTtcbiAgICB9O1xuXG4gICAgY2xpZW50Lm9uZW50ZXIgPSBwb3NpdGlvbiA9PiB7XG4gICAgICAgIGN1cnJlbnRTdGF0ZSA9ICdkcmFnLW92ZXInO1xuXG4gICAgICAgIGFwaS5vbmRyYWdzdGFydChwb3NpdGlvbik7XG4gICAgfTtcblxuICAgIGNsaWVudC5vbmV4aXQgPSBwb3NpdGlvbiA9PiB7XG4gICAgICAgIGN1cnJlbnRTdGF0ZSA9ICdkcmFnLWV4aXQnO1xuXG4gICAgICAgIGFwaS5vbmRyYWdlbmQocG9zaXRpb24pO1xuICAgIH07XG5cbiAgICBjb25zdCBhcGkgPSB7XG4gICAgICAgIHVwZGF0ZUhvcHBlclN0YXRlOiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAobGFzdFN0YXRlICE9PSBjdXJyZW50U3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5kYXRhc2V0LmhvcHBlclN0YXRlID0gY3VycmVudFN0YXRlO1xuICAgICAgICAgICAgICAgIGxhc3RTdGF0ZSA9IGN1cnJlbnRTdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25sb2FkOiAoKSA9PiB7fSxcbiAgICAgICAgb25kcmFnc3RhcnQ6ICgpID0+IHt9LFxuICAgICAgICBvbmRyYWc6ICgpID0+IHt9LFxuICAgICAgICBvbmRyYWdlbmQ6ICgpID0+IHt9LFxuICAgICAgICBkZXN0cm95OiAoKSA9PiB7XG4gICAgICAgICAgICAvLyBkZXN0cm95IGNsaWVudFxuICAgICAgICAgICAgY2xpZW50LmRlc3Ryb3koKTtcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGFwaTtcbn07XG5cbmxldCBsaXN0ZW5pbmcgPSBmYWxzZTtcbmNvbnN0IGxpc3RlbmVycyQxID0gW107XG5cbmNvbnN0IGhhbmRsZVBhc3RlID0gZSA9PiB7XG4gICAgLy8gaWYgaXMgcGFzdGluZyBpbiBpbnB1dCBvciB0ZXh0YXJlYSBhbmQgdGhlIHRhcmdldCBpcyBvdXRzaWRlIG9mIGEgZmlsZXBvbmQgc2NvcGUsIGlnbm9yZVxuICAgIGNvbnN0IGFjdGl2ZUVsID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBjb25zdCBpc0FjdGl2ZUVsZW1lbnRFZGl0YWJsZSA9XG4gICAgICAgIGFjdGl2ZUVsICYmXG4gICAgICAgICgvdGV4dGFyZWF8aW5wdXQvaS50ZXN0KGFjdGl2ZUVsLm5vZGVOYW1lKSB8fFxuICAgICAgICAgICAgYWN0aXZlRWwuZ2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSA9PT0gJ3RydWUnIHx8XG4gICAgICAgICAgICBhY3RpdmVFbC5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpID09PSAnJyk7XG5cbiAgICBpZiAoaXNBY3RpdmVFbGVtZW50RWRpdGFibGUpIHtcbiAgICAgICAgLy8gdGVzdCB0ZXh0YXJlYSBvciBpbnB1dCBpcyBjb250YWluZWQgaW4gZmlsZXBvbmQgcm9vdFxuICAgICAgICBsZXQgaW5TY29wZSA9IGZhbHNlO1xuICAgICAgICBsZXQgZWxlbWVudCA9IGFjdGl2ZUVsO1xuICAgICAgICB3aGlsZSAoZWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlcG9uZC0tcm9vdCcpKSB7XG4gICAgICAgICAgICAgICAgaW5TY29wZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpblNjb3BlKSByZXR1cm47XG4gICAgfVxuXG4gICAgcmVxdWVzdERhdGFUcmFuc2Zlckl0ZW1zKGUuY2xpcGJvYXJkRGF0YSkudGhlbihmaWxlcyA9PiB7XG4gICAgICAgIC8vIG5vIGZpbGVzIHJlY2VpdmVkXG4gICAgICAgIGlmICghZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBub3RpZnkgbGlzdGVuZXJzIG9mIHJlY2VpdmVkIGZpbGVzXG4gICAgICAgIGxpc3RlbmVycyQxLmZvckVhY2gobGlzdGVuZXIgPT4gbGlzdGVuZXIoZmlsZXMpKTtcbiAgICB9KTtcbn07XG5cbmNvbnN0IGxpc3RlbiA9IGNiID0+IHtcbiAgICAvLyBjYW4ndCBhZGQgdHdpY2VcbiAgICBpZiAobGlzdGVuZXJzJDEuaW5jbHVkZXMoY2IpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBhZGQgaW5pdGlhbCBsaXN0ZW5lclxuICAgIGxpc3RlbmVycyQxLnB1c2goY2IpO1xuXG4gICAgLy8gc2V0dXAgcGFzdGUgbGlzdGVuZXIgZm9yIGVudGlyZSBwYWdlXG4gICAgaWYgKGxpc3RlbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGlzdGVuaW5nID0gdHJ1ZTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIGhhbmRsZVBhc3RlKTtcbn07XG5cbmNvbnN0IHVubGlzdGVuID0gbGlzdGVuZXIgPT4ge1xuICAgIGFycmF5UmVtb3ZlKGxpc3RlbmVycyQxLCBsaXN0ZW5lcnMkMS5pbmRleE9mKGxpc3RlbmVyKSk7XG5cbiAgICAvLyBjbGVhbiB1cFxuICAgIGlmIChsaXN0ZW5lcnMkMS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGFzdGUnLCBoYW5kbGVQYXN0ZSk7XG4gICAgICAgIGxpc3RlbmluZyA9IGZhbHNlO1xuICAgIH1cbn07XG5cbmNvbnN0IGNyZWF0ZVBhc3RlciA9ICgpID0+IHtcbiAgICBjb25zdCBjYiA9IGZpbGVzID0+IHtcbiAgICAgICAgYXBpLm9ubG9hZChmaWxlcyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFwaSA9IHtcbiAgICAgICAgZGVzdHJveTogKCkgPT4ge1xuICAgICAgICAgICAgdW5saXN0ZW4oY2IpO1xuICAgICAgICB9LFxuICAgICAgICBvbmxvYWQ6ICgpID0+IHt9LFxuICAgIH07XG5cbiAgICBsaXN0ZW4oY2IpO1xuXG4gICAgcmV0dXJuIGFwaTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgZmlsZSB2aWV3XG4gKi9cbmNvbnN0IGNyZWF0ZSRkID0gKHsgcm9vdCwgcHJvcHMgfSkgPT4ge1xuICAgIHJvb3QuZWxlbWVudC5pZCA9IGBmaWxlcG9uZC0tYXNzaXN0YW50LSR7cHJvcHMuaWR9YDtcbiAgICBhdHRyKHJvb3QuZWxlbWVudCwgJ3JvbGUnLCAnYWxlcnQnKTtcbiAgICBhdHRyKHJvb3QuZWxlbWVudCwgJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcbiAgICBhdHRyKHJvb3QuZWxlbWVudCwgJ2FyaWEtcmVsZXZhbnQnLCAnYWRkaXRpb25zJyk7XG59O1xuXG5sZXQgYWRkRmlsZXNOb3RpZmljYXRpb25UaW1lb3V0ID0gbnVsbDtcbmxldCBub3RpZmljYXRpb25DbGVhclRpbWVvdXQgPSBudWxsO1xuXG5jb25zdCBmaWxlbmFtZXMgPSBbXTtcblxuY29uc3QgYXNzaXN0ID0gKHJvb3QsIG1lc3NhZ2UpID0+IHtcbiAgICByb290LmVsZW1lbnQudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xufTtcblxuY29uc3QgY2xlYXIkMSA9IHJvb3QgPT4ge1xuICAgIHJvb3QuZWxlbWVudC50ZXh0Q29udGVudCA9ICcnO1xufTtcblxuY29uc3QgbGlzdE1vZGlmaWVkID0gKHJvb3QsIGZpbGVuYW1lLCBsYWJlbCkgPT4ge1xuICAgIGNvbnN0IHRvdGFsID0gcm9vdC5xdWVyeSgnR0VUX1RPVEFMX0lURU1TJyk7XG4gICAgYXNzaXN0KFxuICAgICAgICByb290LFxuICAgICAgICBgJHtsYWJlbH0gJHtmaWxlbmFtZX0sICR7dG90YWx9ICR7XG4gICAgICAgICAgICB0b3RhbCA9PT0gMVxuICAgICAgICAgICAgICAgID8gcm9vdC5xdWVyeSgnR0VUX0xBQkVMX0ZJTEVfQ09VTlRfU0lOR1VMQVInKVxuICAgICAgICAgICAgICAgIDogcm9vdC5xdWVyeSgnR0VUX0xBQkVMX0ZJTEVfQ09VTlRfUExVUkFMJylcbiAgICAgICAgfWBcbiAgICApO1xuXG4gICAgLy8gY2xlYXIgZ3JvdXAgYWZ0ZXIgc2V0IGFtb3VudCBvZiB0aW1lIHNvIHRoZSBzdGF0dXMgaXMgbm90IHJlYWQgdHdpY2VcbiAgICBjbGVhclRpbWVvdXQobm90aWZpY2F0aW9uQ2xlYXJUaW1lb3V0KTtcbiAgICBub3RpZmljYXRpb25DbGVhclRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2xlYXIkMShyb290KTtcbiAgICB9LCAxNTAwKTtcbn07XG5cbmNvbnN0IGlzVXNpbmdGaWxlUG9uZCA9IHJvb3QgPT4gcm9vdC5lbGVtZW50LnBhcmVudE5vZGUuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG5cbmNvbnN0IGl0ZW1BZGRlZCA9ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgaWYgKCFpc1VzaW5nRmlsZVBvbmQocm9vdCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJvb3QuZWxlbWVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgIGNvbnN0IGl0ZW0gPSByb290LnF1ZXJ5KCdHRVRfSVRFTScsIGFjdGlvbi5pZCk7XG4gICAgZmlsZW5hbWVzLnB1c2goaXRlbS5maWxlbmFtZSk7XG5cbiAgICBjbGVhclRpbWVvdXQoYWRkRmlsZXNOb3RpZmljYXRpb25UaW1lb3V0KTtcbiAgICBhZGRGaWxlc05vdGlmaWNhdGlvblRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgbGlzdE1vZGlmaWVkKHJvb3QsIGZpbGVuYW1lcy5qb2luKCcsICcpLCByb290LnF1ZXJ5KCdHRVRfTEFCRUxfRklMRV9BRERFRCcpKTtcbiAgICAgICAgZmlsZW5hbWVzLmxlbmd0aCA9IDA7XG4gICAgfSwgNzUwKTtcbn07XG5cbmNvbnN0IGl0ZW1SZW1vdmVkID0gKHsgcm9vdCwgYWN0aW9uIH0pID0+IHtcbiAgICBpZiAoIWlzVXNpbmdGaWxlUG9uZChyb290KSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXRlbSA9IGFjdGlvbi5pdGVtO1xuICAgIGxpc3RNb2RpZmllZChyb290LCBpdGVtLmZpbGVuYW1lLCByb290LnF1ZXJ5KCdHRVRfTEFCRUxfRklMRV9SRU1PVkVEJykpO1xufTtcblxuY29uc3QgaXRlbVByb2Nlc3NlZCA9ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgLy8gd2lsbCBhbHNvIG5vdGlmeSB0aGUgdXNlciB3aGVuIEZpbGVQb25kIGlzIG5vdCBiZWluZyB1c2VkLCBhcyB0aGUgdXNlciBtaWdodCBiZSBvY2N1cGllZCB3aXRoIG90aGVyIGFjdGl2aXRpZXMgd2hpbGUgdXBsb2FkaW5nIGEgZmlsZVxuXG4gICAgY29uc3QgaXRlbSA9IHJvb3QucXVlcnkoJ0dFVF9JVEVNJywgYWN0aW9uLmlkKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGl0ZW0uZmlsZW5hbWU7XG4gICAgY29uc3QgbGFiZWwgPSByb290LnF1ZXJ5KCdHRVRfTEFCRUxfRklMRV9QUk9DRVNTSU5HX0NPTVBMRVRFJyk7XG5cbiAgICBhc3Npc3Qocm9vdCwgYCR7ZmlsZW5hbWV9ICR7bGFiZWx9YCk7XG59O1xuXG5jb25zdCBpdGVtUHJvY2Vzc2VkVW5kbyA9ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IHJvb3QucXVlcnkoJ0dFVF9JVEVNJywgYWN0aW9uLmlkKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGl0ZW0uZmlsZW5hbWU7XG4gICAgY29uc3QgbGFiZWwgPSByb290LnF1ZXJ5KCdHRVRfTEFCRUxfRklMRV9QUk9DRVNTSU5HX0FCT1JURUQnKTtcblxuICAgIGFzc2lzdChyb290LCBgJHtmaWxlbmFtZX0gJHtsYWJlbH1gKTtcbn07XG5cbmNvbnN0IGl0ZW1FcnJvciA9ICh7IHJvb3QsIGFjdGlvbiB9KSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IHJvb3QucXVlcnkoJ0dFVF9JVEVNJywgYWN0aW9uLmlkKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGl0ZW0uZmlsZW5hbWU7XG5cbiAgICAvLyB3aWxsIGFsc28gbm90aWZ5IHRoZSB1c2VyIHdoZW4gRmlsZVBvbmQgaXMgbm90IGJlaW5nIHVzZWQsIGFzIHRoZSB1c2VyIG1pZ2h0IGJlIG9jY3VwaWVkIHdpdGggb3RoZXIgYWN0aXZpdGllcyB3aGlsZSB1cGxvYWRpbmcgYSBmaWxlXG5cbiAgICBhc3Npc3Qocm9vdCwgYCR7YWN0aW9uLnN0YXR1cy5tYWlufSAke2ZpbGVuYW1lfSAke2FjdGlvbi5zdGF0dXMuc3VifWApO1xufTtcblxuY29uc3QgYXNzaXN0YW50ID0gY3JlYXRlVmlldyh7XG4gICAgY3JlYXRlOiBjcmVhdGUkZCxcbiAgICBpZ25vcmVSZWN0OiB0cnVlLFxuICAgIGlnbm9yZVJlY3RVcGRhdGU6IHRydWUsXG4gICAgd3JpdGU6IGNyZWF0ZVJvdXRlKHtcbiAgICAgICAgRElEX0xPQURfSVRFTTogaXRlbUFkZGVkLFxuICAgICAgICBESURfUkVNT1ZFX0lURU06IGl0ZW1SZW1vdmVkLFxuICAgICAgICBESURfQ09NUExFVEVfSVRFTV9QUk9DRVNTSU5HOiBpdGVtUHJvY2Vzc2VkLFxuXG4gICAgICAgIERJRF9BQk9SVF9JVEVNX1BST0NFU1NJTkc6IGl0ZW1Qcm9jZXNzZWRVbmRvLFxuICAgICAgICBESURfUkVWRVJUX0lURU1fUFJPQ0VTU0lORzogaXRlbVByb2Nlc3NlZFVuZG8sXG5cbiAgICAgICAgRElEX1RIUk9XX0lURU1fUkVNT1ZFX0VSUk9SOiBpdGVtRXJyb3IsXG4gICAgICAgIERJRF9USFJPV19JVEVNX0xPQURfRVJST1I6IGl0ZW1FcnJvcixcbiAgICAgICAgRElEX1RIUk9XX0lURU1fSU5WQUxJRDogaXRlbUVycm9yLFxuICAgICAgICBESURfVEhST1dfSVRFTV9QUk9DRVNTSU5HX0VSUk9SOiBpdGVtRXJyb3IsXG4gICAgfSksXG4gICAgdGFnOiAnc3BhbicsXG4gICAgbmFtZTogJ2Fzc2lzdGFudCcsXG59KTtcblxuY29uc3QgdG9DYW1lbHMgPSAoc3RyaW5nLCBzZXBhcmF0b3IgPSAnLScpID0+XG4gICAgc3RyaW5nLnJlcGxhY2UobmV3IFJlZ0V4cChgJHtzZXBhcmF0b3J9LmAsICdnJyksIHN1YiA9PiBzdWIuY2hhckF0KDEpLnRvVXBwZXJDYXNlKCkpO1xuXG5jb25zdCBkZWJvdW5jZSA9IChmdW5jLCBpbnRlcnZhbCA9IDE2LCBpbW1pZGlhdGVPbmx5ID0gdHJ1ZSkgPT4ge1xuICAgIGxldCBsYXN0ID0gRGF0ZS5ub3coKTtcbiAgICBsZXQgdGltZW91dCA9IG51bGw7XG5cbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXG4gICAgICAgIGNvbnN0IGRpc3QgPSBEYXRlLm5vdygpIC0gbGFzdDtcblxuICAgICAgICBjb25zdCBmbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgZnVuYyguLi5hcmdzKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZGlzdCA8IGludGVydmFsKSB7XG4gICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIGRlbGF5IGJ5IHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gaW50ZXJ2YWwgYW5kIGRpc3RcbiAgICAgICAgICAgIC8vIGZvciBleGFtcGxlOiBpZiBkaXN0YW5jZSBpcyAxMCBtcyBhbmQgaW50ZXJ2YWwgaXMgMTYgbXMsXG4gICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIHdhaXQgYW4gYWRkaXRpb25hbCA2bXMgYmVmb3JlIGNhbGxpbmcgdGhlIGZ1bmN0aW9uKVxuICAgICAgICAgICAgaWYgKCFpbW1pZGlhdGVPbmx5KSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZm4sIGludGVydmFsIC0gZGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBnbyFcbiAgICAgICAgICAgIGZuKCk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxuY29uc3QgTUFYX0ZJTEVTX0xJTUlUID0gMTAwMDAwMDtcblxuY29uc3QgcHJldmVudCA9IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5jb25zdCBjcmVhdGUkZSA9ICh7IHJvb3QsIHByb3BzIH0pID0+IHtcbiAgICAvLyBBZGQgaWRcbiAgICBjb25zdCBpZCA9IHJvb3QucXVlcnkoJ0dFVF9JRCcpO1xuICAgIGlmIChpZCkge1xuICAgICAgICByb290LmVsZW1lbnQuaWQgPSBpZDtcbiAgICB9XG5cbiAgICAvLyBBZGQgY2xhc3NOYW1lXG4gICAgY29uc3QgY2xhc3NOYW1lID0gcm9vdC5xdWVyeSgnR0VUX0NMQVNTX05BTUUnKTtcbiAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgICAgICAgLnNwbGl0KCcgJylcbiAgICAgICAgICAgIC5maWx0ZXIobmFtZSA9PiBuYW1lLmxlbmd0aClcbiAgICAgICAgICAgIC5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIHJvb3QuZWxlbWVudC5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRmllbGQgbGFiZWxcbiAgICByb290LnJlZi5sYWJlbCA9IHJvb3QuYXBwZW5kQ2hpbGRWaWV3KFxuICAgICAgICByb290LmNyZWF0ZUNoaWxkVmlldyhkcm9wTGFiZWwsIHtcbiAgICAgICAgICAgIC4uLnByb3BzLFxuICAgICAgICAgICAgdHJhbnNsYXRlWTogbnVsbCxcbiAgICAgICAgICAgIGNhcHRpb246IHJvb3QucXVlcnkoJ0dFVF9MQUJFTF9JRExFJyksXG4gICAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIExpc3Qgb2YgaXRlbXNcbiAgICByb290LnJlZi5saXN0ID0gcm9vdC5hcHBlbmRDaGlsZFZpZXcocm9vdC5jcmVhdGVDaGlsZFZpZXcobGlzdFNjcm9sbGVyLCB7IHRyYW5zbGF0ZVk6IG51bGwgfSkpO1xuXG4gICAgLy8gQmFja2dyb3VuZCBwYW5lbFxuICAgIHJvb3QucmVmLnBhbmVsID0gcm9vdC5hcHBlbmRDaGlsZFZpZXcocm9vdC5jcmVhdGVDaGlsZFZpZXcocGFuZWwsIHsgbmFtZTogJ3BhbmVsLXJvb3QnIH0pKTtcblxuICAgIC8vIEFzc2lzdGFudCBub3RpZmllcyBhc3Npc3RpdmUgdGVjaCB3aGVuIGNvbnRlbnQgY2hhbmdlc1xuICAgIHJvb3QucmVmLmFzc2lzdGFudCA9IHJvb3QuYXBwZW5kQ2hpbGRWaWV3KHJvb3QuY3JlYXRlQ2hpbGRWaWV3KGFzc2lzdGFudCwgeyAuLi5wcm9wcyB9KSk7XG5cbiAgICAvLyBEYXRhXG4gICAgcm9vdC5yZWYuZGF0YSA9IHJvb3QuYXBwZW5kQ2hpbGRWaWV3KHJvb3QuY3JlYXRlQ2hpbGRWaWV3KGRhdGEsIHsgLi4ucHJvcHMgfSkpO1xuXG4gICAgLy8gTWVhc3VyZSAodGVzdHMgaWYgZml4ZWQgaGVpZ2h0IHdhcyBzZXQpXG4gICAgLy8gRE9DVFlQRSBuZWVkcyB0byBiZSBzZXQgZm9yIHRoaXMgdG8gd29ya1xuICAgIHJvb3QucmVmLm1lYXN1cmUgPSBjcmVhdGVFbGVtZW50JDEoJ2RpdicpO1xuICAgIHJvb3QucmVmLm1lYXN1cmUuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgIHJvb3QuZWxlbWVudC5hcHBlbmRDaGlsZChyb290LnJlZi5tZWFzdXJlKTtcblxuICAgIC8vIGluZm9ybWF0aW9uIG9uIHRoZSByb290IGhlaWdodCBvciBmaXhlZCBoZWlnaHQgc3RhdHVzXG4gICAgcm9vdC5yZWYuYm91bmRzID0gbnVsbDtcblxuICAgIC8vIGFwcGx5IGluaXRpYWwgc3R5bGUgcHJvcGVydGllc1xuICAgIHJvb3QucXVlcnkoJ0dFVF9TVFlMRVMnKVxuICAgICAgICAuZmlsdGVyKHN0eWxlID0+ICFpc0VtcHR5KHN0eWxlLnZhbHVlKSlcbiAgICAgICAgLm1hcCgoeyBuYW1lLCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICByb290LmVsZW1lbnQuZGF0YXNldFtuYW1lXSA9IHZhbHVlO1xuICAgICAgICB9KTtcblxuICAgIC8vIGRldGVybWluZSBpZiB3aWR0aCBjaGFuZ2VkXG4gICAgcm9vdC5yZWYud2lkdGhQcmV2aW91cyA9IG51bGw7XG4gICAgcm9vdC5yZWYud2lkdGhVcGRhdGVkID0gZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICByb290LnJlZi51cGRhdGVIaXN0b3J5ID0gW107XG4gICAgICAgIHJvb3QuZGlzcGF0Y2goJ0RJRF9SRVNJWkVfUk9PVCcpO1xuICAgIH0sIDI1MCk7XG5cbiAgICAvLyBoaXN0b3J5IG9mIHVwZGF0ZXNcbiAgICByb290LnJlZi5wcmV2aW91c0FzcGVjdFJhdGlvID0gbnVsbDtcbiAgICByb290LnJlZi51cGRhdGVIaXN0b3J5ID0gW107XG5cbiAgICAvLyBwcmV2ZW50IHNjcm9sbGluZyBhbmQgem9vbWluZyBvbiBpT1MgKG9ubHkgaWYgc3VwcG9ydHMgcG9pbnRlciBldmVudHMsIGZvciB0aGVuIHdlIGNhbiBlbmFibGUgcmVvcmRlcilcbiAgICBjb25zdCBjYW5Ib3ZlciA9IHdpbmRvdy5tYXRjaE1lZGlhKCcocG9pbnRlcjogZmluZSkgYW5kIChob3ZlcjogaG92ZXIpJykubWF0Y2hlcztcbiAgICBjb25zdCBoYXNQb2ludGVyRXZlbnRzID0gJ1BvaW50ZXJFdmVudCcgaW4gd2luZG93O1xuICAgIGlmIChyb290LnF1ZXJ5KCdHRVRfQUxMT1dfUkVPUkRFUicpICYmIGhhc1BvaW50ZXJFdmVudHMgJiYgIWNhbkhvdmVyKSB7XG4gICAgICAgIHJvb3QuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50LCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuICAgICAgICByb290LmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZ2VzdHVyZXN0YXJ0JywgcHJldmVudCk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGNyZWRpdHNcbiAgICBjb25zdCBjcmVkaXRzID0gcm9vdC5xdWVyeSgnR0VUX0NSRURJVFMnKTtcbiAgICBjb25zdCBoYXNDcmVkaXRzID0gY3JlZGl0cy5sZW5ndGggPT09IDI7XG4gICAgaWYgKGhhc0NyZWRpdHMpIHtcbiAgICAgICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgZnJhZy5jbGFzc05hbWUgPSAnZmlsZXBvbmQtLWNyZWRpdHMnO1xuICAgICAgICBmcmFnLmhyZWYgPSBjcmVkaXRzWzBdO1xuICAgICAgICBmcmFnLnRhYkluZGV4ID0gLTE7XG4gICAgICAgIGZyYWcudGFyZ2V0ID0gJ19ibGFuayc7XG4gICAgICAgIGZyYWcucmVsID0gJ25vb3BlbmVyIG5vcmVmZXJyZXIgbm9mb2xsb3cnO1xuICAgICAgICBmcmFnLnRleHRDb250ZW50ID0gY3JlZGl0c1sxXTtcbiAgICAgICAgcm9vdC5lbGVtZW50LmFwcGVuZENoaWxkKGZyYWcpO1xuICAgICAgICByb290LnJlZi5jcmVkaXRzID0gZnJhZztcbiAgICB9XG59O1xuXG5jb25zdCB3cml0ZSQ5ID0gKHsgcm9vdCwgcHJvcHMsIGFjdGlvbnMgfSkgPT4ge1xuICAgIC8vIHJvdXRlIGFjdGlvbnNcbiAgICByb3V0ZSQ1KHsgcm9vdCwgcHJvcHMsIGFjdGlvbnMgfSk7XG5cbiAgICAvLyBhcHBseSBzdHlsZSBwcm9wZXJ0aWVzXG4gICAgYWN0aW9uc1xuICAgICAgICAuZmlsdGVyKGFjdGlvbiA9PiAvXkRJRF9TRVRfU1RZTEVfLy50ZXN0KGFjdGlvbi50eXBlKSlcbiAgICAgICAgLmZpbHRlcihhY3Rpb24gPT4gIWlzRW1wdHkoYWN0aW9uLmRhdGEudmFsdWUpKVxuICAgICAgICAubWFwKCh7IHR5cGUsIGRhdGEgfSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IHRvQ2FtZWxzKHR5cGUuc3Vic3RyaW5nKDgpLnRvTG93ZXJDYXNlKCksICdfJyk7XG4gICAgICAgICAgICByb290LmVsZW1lbnQuZGF0YXNldFtuYW1lXSA9IGRhdGEudmFsdWU7XG4gICAgICAgICAgICByb290LmludmFsaWRhdGVMYXlvdXQoKTtcbiAgICAgICAgfSk7XG5cbiAgICBpZiAocm9vdC5yZWN0LmVsZW1lbnQuaGlkZGVuKSByZXR1cm47XG5cbiAgICBpZiAocm9vdC5yZWN0LmVsZW1lbnQud2lkdGggIT09IHJvb3QucmVmLndpZHRoUHJldmlvdXMpIHtcbiAgICAgICAgcm9vdC5yZWYud2lkdGhQcmV2aW91cyA9IHJvb3QucmVjdC5lbGVtZW50LndpZHRoO1xuICAgICAgICByb290LnJlZi53aWR0aFVwZGF0ZWQoKTtcbiAgICB9XG5cbiAgICAvLyBnZXQgYm94IGJvdW5kcywgd2UgZG8gdGhpcyBvbmx5IG9uY2VcbiAgICBsZXQgYm91bmRzID0gcm9vdC5yZWYuYm91bmRzO1xuICAgIGlmICghYm91bmRzKSB7XG4gICAgICAgIGJvdW5kcyA9IHJvb3QucmVmLmJvdW5kcyA9IGNhbGN1bGF0ZVJvb3RCb3VuZGluZ0JveEhlaWdodChyb290KTtcblxuICAgICAgICAvLyBkZXN0cm95IG1lYXN1cmUgZWxlbWVudFxuICAgICAgICByb290LmVsZW1lbnQucmVtb3ZlQ2hpbGQocm9vdC5yZWYubWVhc3VyZSk7XG4gICAgICAgIHJvb3QucmVmLm1lYXN1cmUgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIGdldCBxdWljayByZWZlcmVuY2VzIHRvIHZhcmlvdXMgaGlnaCBsZXZlbCBwYXJ0cyBvZiB0aGUgdXBsb2FkIHRvb2xcbiAgICBjb25zdCB7IGhvcHBlciwgbGFiZWwsIGxpc3QsIHBhbmVsIH0gPSByb290LnJlZjtcblxuICAgIC8vIHNldHMgY29ycmVjdCBzdGF0ZSB0byBob3BwZXIgc2NvcGVcbiAgICBpZiAoaG9wcGVyKSB7XG4gICAgICAgIGhvcHBlci51cGRhdGVIb3BwZXJTdGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIGJvb2wgdG8gaW5kaWNhdGUgaWYgd2UncmUgZnVsbCBvciBub3RcbiAgICBjb25zdCBhc3BlY3RSYXRpbyA9IHJvb3QucXVlcnkoJ0dFVF9QQU5FTF9BU1BFQ1RfUkFUSU8nKTtcbiAgICBjb25zdCBpc011bHRpSXRlbSA9IHJvb3QucXVlcnkoJ0dFVF9BTExPV19NVUxUSVBMRScpO1xuICAgIGNvbnN0IHRvdGFsSXRlbXMgPSByb290LnF1ZXJ5KCdHRVRfVE9UQUxfSVRFTVMnKTtcbiAgICBjb25zdCBtYXhJdGVtcyA9IGlzTXVsdGlJdGVtID8gcm9vdC5xdWVyeSgnR0VUX01BWF9GSUxFUycpIHx8IE1BWF9GSUxFU19MSU1JVCA6IDE7XG4gICAgY29uc3QgYXRNYXhDYXBhY2l0eSA9IHRvdGFsSXRlbXMgPT09IG1heEl0ZW1zO1xuXG4gICAgLy8gYWN0aW9uIHVzZWQgdG8gYWRkIGl0ZW1cbiAgICBjb25zdCBhZGRBY3Rpb24gPSBhY3Rpb25zLmZpbmQoYWN0aW9uID0+IGFjdGlvbi50eXBlID09PSAnRElEX0FERF9JVEVNJyk7XG5cbiAgICAvLyBpZiByZWFjaGVkIG1heCBjYXBhY2l0eSBhbmQgd2UndmUganVzdCByZWFjaGVkIGl0XG4gICAgaWYgKGF0TWF4Q2FwYWNpdHkgJiYgYWRkQWN0aW9uKSB7XG4gICAgICAgIC8vIGdldCBpbnRlcmFjdGlvbiB0eXBlXG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uTWV0aG9kID0gYWRkQWN0aW9uLmRhdGEuaW50ZXJhY3Rpb25NZXRob2Q7XG5cbiAgICAgICAgLy8gaGlkZSBsYWJlbFxuICAgICAgICBsYWJlbC5vcGFjaXR5ID0gMDtcblxuICAgICAgICBpZiAoaXNNdWx0aUl0ZW0pIHtcbiAgICAgICAgICAgIGxhYmVsLnRyYW5zbGF0ZVkgPSAtNDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoaW50ZXJhY3Rpb25NZXRob2QgPT09IEludGVyYWN0aW9uTWV0aG9kLkFQSSkge1xuICAgICAgICAgICAgICAgIGxhYmVsLnRyYW5zbGF0ZVggPSA0MDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW50ZXJhY3Rpb25NZXRob2QgPT09IEludGVyYWN0aW9uTWV0aG9kLkJST1dTRSkge1xuICAgICAgICAgICAgICAgIGxhYmVsLnRyYW5zbGF0ZVkgPSA0MDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGFiZWwudHJhbnNsYXRlWSA9IDMwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICghYXRNYXhDYXBhY2l0eSkge1xuICAgICAgICBsYWJlbC5vcGFjaXR5ID0gMTtcbiAgICAgICAgbGFiZWwudHJhbnNsYXRlWCA9IDA7XG4gICAgICAgIGxhYmVsLnRyYW5zbGF0ZVkgPSAwO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3RJdGVtTWFyZ2luID0gY2FsY3VsYXRlTGlzdEl0ZW1NYXJnaW4ocm9vdCk7XG5cbiAgICBjb25zdCBsaXN0SGVpZ2h0ID0gY2FsY3VsYXRlTGlzdEhlaWdodChyb290KTtcblxuICAgIGNvbnN0IGxhYmVsSGVpZ2h0ID0gbGFiZWwucmVjdC5lbGVtZW50LmhlaWdodDtcbiAgICBjb25zdCBjdXJyZW50TGFiZWxIZWlnaHQgPSAhaXNNdWx0aUl0ZW0gfHwgYXRNYXhDYXBhY2l0eSA/IDAgOiBsYWJlbEhlaWdodDtcblxuICAgIGNvbnN0IGxpc3RNYXJnaW5Ub3AgPSBhdE1heENhcGFjaXR5ID8gbGlzdC5yZWN0LmVsZW1lbnQubWFyZ2luVG9wIDogMDtcbiAgICBjb25zdCBsaXN0TWFyZ2luQm90dG9tID0gdG90YWxJdGVtcyA9PT0gMCA/IDAgOiBsaXN0LnJlY3QuZWxlbWVudC5tYXJnaW5Cb3R0b207XG5cbiAgICBjb25zdCB2aXN1YWxIZWlnaHQgPSBjdXJyZW50TGFiZWxIZWlnaHQgKyBsaXN0TWFyZ2luVG9wICsgbGlzdEhlaWdodC52aXN1YWwgKyBsaXN0TWFyZ2luQm90dG9tO1xuICAgIGNvbnN0IGJvdW5kc0hlaWdodCA9IGN1cnJlbnRMYWJlbEhlaWdodCArIGxpc3RNYXJnaW5Ub3AgKyBsaXN0SGVpZ2h0LmJvdW5kcyArIGxpc3RNYXJnaW5Cb3R0b207XG5cbiAgICAvLyBsaW5rIGxpc3QgdG8gbGFiZWwgYm90dG9tIHBvc2l0aW9uXG4gICAgbGlzdC50cmFuc2xhdGVZID1cbiAgICAgICAgTWF0aC5tYXgoMCwgY3VycmVudExhYmVsSGVpZ2h0IC0gbGlzdC5yZWN0LmVsZW1lbnQubWFyZ2luVG9wKSAtIGxpc3RJdGVtTWFyZ2luLnRvcDtcblxuICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICAvLyBmaXhlZCBhc3BlY3QgcmF0aW9cblxuICAgICAgICAvLyBjYWxjdWxhdGUgaGVpZ2h0IGJhc2VkIG9uIHdpZHRoXG4gICAgICAgIGNvbnN0IHdpZHRoID0gcm9vdC5yZWN0LmVsZW1lbnQud2lkdGg7XG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHdpZHRoICogYXNwZWN0UmF0aW87XG5cbiAgICAgICAgLy8gY2xlYXIgaGlzdG9yeSBpZiBhc3BlY3QgcmF0aW8gaGFzIGNoYW5nZWRcbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvICE9PSByb290LnJlZi5wcmV2aW91c0FzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgICByb290LnJlZi5wcmV2aW91c0FzcGVjdFJhdGlvID0gYXNwZWN0UmF0aW87XG4gICAgICAgICAgICByb290LnJlZi51cGRhdGVIaXN0b3J5ID0gW107XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1lbWJlciB0aGlzIHdpZHRoXG4gICAgICAgIGNvbnN0IGhpc3RvcnkgPSByb290LnJlZi51cGRhdGVIaXN0b3J5O1xuICAgICAgICBoaXN0b3J5LnB1c2god2lkdGgpO1xuXG4gICAgICAgIGNvbnN0IE1BWF9CT1VOQ0VTID0gMjtcbiAgICAgICAgaWYgKGhpc3RvcnkubGVuZ3RoID4gTUFYX0JPVU5DRVMgKiAyKSB7XG4gICAgICAgICAgICBjb25zdCBsID0gaGlzdG9yeS5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSBsIC0gMTA7XG4gICAgICAgICAgICBsZXQgYm91bmNlcyA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gbDsgaSA+PSBib3R0b207IGktLSkge1xuICAgICAgICAgICAgICAgIGlmIChoaXN0b3J5W2ldID09PSBoaXN0b3J5W2kgLSAyXSkge1xuICAgICAgICAgICAgICAgICAgICBib3VuY2VzKys7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJvdW5jZXMgPj0gTUFYX0JPVU5DRVMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG9udCBhZGp1c3QgaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaXggaGVpZ2h0IG9mIHBhbmVsIHNvIGl0IGFkaGVyZXMgdG8gYXNwZWN0IHJhdGlvXG4gICAgICAgIHBhbmVsLnNjYWxhYmxlID0gZmFsc2U7XG4gICAgICAgIHBhbmVsLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAvLyBhdmFpbGFibGUgaGVpZ2h0IGZvciBsaXN0XG4gICAgICAgIGNvbnN0IGxpc3RBdmFpbGFibGVIZWlnaHQgPVxuICAgICAgICAgICAgLy8gdGhlIGhlaWdodCBvZiB0aGUgcGFuZWwgbWludXMgdGhlIGxhYmVsIGhlaWdodFxuICAgICAgICAgICAgaGVpZ2h0IC1cbiAgICAgICAgICAgIGN1cnJlbnRMYWJlbEhlaWdodCAtXG4gICAgICAgICAgICAvLyB0aGUgcm9vbSB3ZSBsZWF2ZSBvcGVuIGJldHdlZW4gdGhlIGVuZCBvZiB0aGUgbGlzdCBhbmQgdGhlIHBhbmVsIGJvdHRvbVxuICAgICAgICAgICAgKGxpc3RNYXJnaW5Cb3R0b20gLSBsaXN0SXRlbU1hcmdpbi5ib3R0b20pIC1cbiAgICAgICAgICAgIC8vIGlmIHdlJ3JlIGZ1bGwgd2UgbmVlZCB0byBsZWF2ZSBzb21lIHJvb20gYmV0d2VlbiB0aGUgdG9wIG9mIHRoZSBwYW5lbCBhbmQgdGhlIGxpc3RcbiAgICAgICAgICAgIChhdE1heENhcGFjaXR5ID8gbGlzdE1hcmdpblRvcCA6IDApO1xuXG4gICAgICAgIGlmIChsaXN0SGVpZ2h0LnZpc3VhbCA+IGxpc3RBdmFpbGFibGVIZWlnaHQpIHtcbiAgICAgICAgICAgIGxpc3Qub3ZlcmZsb3cgPSBsaXN0QXZhaWxhYmxlSGVpZ2h0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGlzdC5vdmVyZmxvdyA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZXQgY29udGFpbmVyIGJvdW5kcyAoc28gcHVzaGVzIHNpYmxpbmdzIGRvd253YXJkcylcbiAgICAgICAgcm9vdC5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgfSBlbHNlIGlmIChib3VuZHMuZml4ZWRIZWlnaHQpIHtcbiAgICAgICAgLy8gZml4ZWQgaGVpZ2h0XG5cbiAgICAgICAgLy8gZml4IGhlaWdodCBvZiBwYW5lbFxuICAgICAgICBwYW5lbC5zY2FsYWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGF2YWlsYWJsZSBoZWlnaHQgZm9yIGxpc3RcbiAgICAgICAgY29uc3QgbGlzdEF2YWlsYWJsZUhlaWdodCA9XG4gICAgICAgICAgICAvLyB0aGUgaGVpZ2h0IG9mIHRoZSBwYW5lbCBtaW51cyB0aGUgbGFiZWwgaGVpZ2h0XG4gICAgICAgICAgICBib3VuZHMuZml4ZWRIZWlnaHQgLVxuICAgICAgICAgICAgY3VycmVudExhYmVsSGVpZ2h0IC1cbiAgICAgICAgICAgIC8vIHRoZSByb29tIHdlIGxlYXZlIG9wZW4gYmV0d2VlbiB0aGUgZW5kIG9mIHRoZSBsaXN0IGFuZCB0aGUgcGFuZWwgYm90dG9tXG4gICAgICAgICAgICAobGlzdE1hcmdpbkJvdHRvbSAtIGxpc3RJdGVtTWFyZ2luLmJvdHRvbSkgLVxuICAgICAgICAgICAgLy8gaWYgd2UncmUgZnVsbCB3ZSBuZWVkIHRvIGxlYXZlIHNvbWUgcm9vbSBiZXR3ZWVuIHRoZSB0b3Agb2YgdGhlIHBhbmVsIGFuZCB0aGUgbGlzdFxuICAgICAgICAgICAgKGF0TWF4Q2FwYWNpdHkgPyBsaXN0TWFyZ2luVG9wIDogMCk7XG5cbiAgICAgICAgLy8gc2V0IGxpc3QgaGVpZ2h0XG4gICAgICAgIGlmIChsaXN0SGVpZ2h0LnZpc3VhbCA+IGxpc3RBdmFpbGFibGVIZWlnaHQpIHtcbiAgICAgICAgICAgIGxpc3Qub3ZlcmZsb3cgPSBsaXN0QXZhaWxhYmxlSGVpZ2h0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGlzdC5vdmVyZmxvdyA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBubyBuZWVkIHRvIHNldCBjb250YWluZXIgYm91bmRzIGFzIHRoZXNlIGFyZSBoYW5kbGVzIGJ5IENTUyBmaXhlZCBoZWlnaHRcbiAgICB9IGVsc2UgaWYgKGJvdW5kcy5jYXBwZWRIZWlnaHQpIHtcbiAgICAgICAgLy8gbWF4LWhlaWdodFxuXG4gICAgICAgIC8vIG5vdCBhIGZpeGVkIGhlaWdodCBwYW5lbFxuICAgICAgICBjb25zdCBpc0NhcHBlZEhlaWdodCA9IHZpc3VhbEhlaWdodCA+PSBib3VuZHMuY2FwcGVkSGVpZ2h0O1xuICAgICAgICBjb25zdCBwYW5lbEhlaWdodCA9IE1hdGgubWluKGJvdW5kcy5jYXBwZWRIZWlnaHQsIHZpc3VhbEhlaWdodCk7XG4gICAgICAgIHBhbmVsLnNjYWxhYmxlID0gdHJ1ZTtcbiAgICAgICAgcGFuZWwuaGVpZ2h0ID0gaXNDYXBwZWRIZWlnaHRcbiAgICAgICAgICAgID8gcGFuZWxIZWlnaHRcbiAgICAgICAgICAgIDogcGFuZWxIZWlnaHQgLSBsaXN0SXRlbU1hcmdpbi50b3AgLSBsaXN0SXRlbU1hcmdpbi5ib3R0b207XG5cbiAgICAgICAgLy8gYXZhaWxhYmxlIGhlaWdodCBmb3IgbGlzdFxuICAgICAgICBjb25zdCBsaXN0QXZhaWxhYmxlSGVpZ2h0ID1cbiAgICAgICAgICAgIC8vIHRoZSBoZWlnaHQgb2YgdGhlIHBhbmVsIG1pbnVzIHRoZSBsYWJlbCBoZWlnaHRcbiAgICAgICAgICAgIHBhbmVsSGVpZ2h0IC1cbiAgICAgICAgICAgIGN1cnJlbnRMYWJlbEhlaWdodCAtXG4gICAgICAgICAgICAvLyB0aGUgcm9vbSB3ZSBsZWF2ZSBvcGVuIGJldHdlZW4gdGhlIGVuZCBvZiB0aGUgbGlzdCBhbmQgdGhlIHBhbmVsIGJvdHRvbVxuICAgICAgICAgICAgKGxpc3RNYXJnaW5Cb3R0b20gLSBsaXN0SXRlbU1hcmdpbi5ib3R0b20pIC1cbiAgICAgICAgICAgIC8vIGlmIHdlJ3JlIGZ1bGwgd2UgbmVlZCB0byBsZWF2ZSBzb21lIHJvb20gYmV0d2VlbiB0aGUgdG9wIG9mIHRoZSBwYW5lbCBhbmQgdGhlIGxpc3RcbiAgICAgICAgICAgIChhdE1heENhcGFjaXR5ID8gbGlzdE1hcmdpblRvcCA6IDApO1xuXG4gICAgICAgIC8vIHNldCBsaXN0IGhlaWdodCAoaWYgaXMgb3ZlcmZsb3dpbmcpXG4gICAgICAgIGlmICh2aXN1YWxIZWlnaHQgPiBib3VuZHMuY2FwcGVkSGVpZ2h0ICYmIGxpc3RIZWlnaHQudmlzdWFsID4gbGlzdEF2YWlsYWJsZUhlaWdodCkge1xuICAgICAgICAgICAgbGlzdC5vdmVyZmxvdyA9IGxpc3RBdmFpbGFibGVIZWlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaXN0Lm92ZXJmbG93ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNldCBjb250YWluZXIgYm91bmRzIChzbyBwdXNoZXMgc2libGluZ3MgZG93bndhcmRzKVxuICAgICAgICByb290LmhlaWdodCA9IE1hdGgubWluKFxuICAgICAgICAgICAgYm91bmRzLmNhcHBlZEhlaWdodCxcbiAgICAgICAgICAgIGJvdW5kc0hlaWdodCAtIGxpc3RJdGVtTWFyZ2luLnRvcCAtIGxpc3RJdGVtTWFyZ2luLmJvdHRvbVxuICAgICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGZsZXhpYmxlIGhlaWdodFxuXG4gICAgICAgIC8vIG5vdCBhIGZpeGVkIGhlaWdodCBwYW5lbFxuICAgICAgICBjb25zdCBpdGVtTWFyZ2luID0gdG90YWxJdGVtcyA+IDAgPyBsaXN0SXRlbU1hcmdpbi50b3AgKyBsaXN0SXRlbU1hcmdpbi5ib3R0b20gOiAwO1xuICAgICAgICBwYW5lbC5zY2FsYWJsZSA9IHRydWU7XG4gICAgICAgIHBhbmVsLmhlaWdodCA9IE1hdGgubWF4KGxhYmVsSGVpZ2h0LCB2aXN1YWxIZWlnaHQgLSBpdGVtTWFyZ2luKTtcblxuICAgICAgICAvLyBzZXQgY29udGFpbmVyIGJvdW5kcyAoc28gcHVzaGVzIHNpYmxpbmdzIGRvd253YXJkcylcbiAgICAgICAgcm9vdC5oZWlnaHQgPSBNYXRoLm1heChsYWJlbEhlaWdodCwgYm91bmRzSGVpZ2h0IC0gaXRlbU1hcmdpbik7XG4gICAgfVxuXG4gICAgLy8gbW92ZSBjcmVkaXRzIHRvIGJvdHRvbVxuICAgIGlmIChyb290LnJlZi5jcmVkaXRzICYmIHBhbmVsLmhlaWdodEN1cnJlbnQpXG4gICAgICAgIHJvb3QucmVmLmNyZWRpdHMuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoJHtwYW5lbC5oZWlnaHRDdXJyZW50fXB4KWA7XG59O1xuXG5jb25zdCBjYWxjdWxhdGVMaXN0SXRlbU1hcmdpbiA9IHJvb3QgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSByb290LnJlZi5saXN0LmNoaWxkVmlld3NbMF0uY2hpbGRWaWV3c1swXTtcbiAgICByZXR1cm4gaXRlbVxuICAgICAgICA/IHtcbiAgICAgICAgICAgICAgdG9wOiBpdGVtLnJlY3QuZWxlbWVudC5tYXJnaW5Ub3AsXG4gICAgICAgICAgICAgIGJvdHRvbTogaXRlbS5yZWN0LmVsZW1lbnQubWFyZ2luQm90dG9tLFxuICAgICAgICAgIH1cbiAgICAgICAgOiB7XG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgIH07XG59O1xuXG5jb25zdCBjYWxjdWxhdGVMaXN0SGVpZ2h0ID0gcm9vdCA9PiB7XG4gICAgbGV0IHZpc3VhbCA9IDA7XG4gICAgbGV0IGJvdW5kcyA9IDA7XG5cbiAgICAvLyBnZXQgZmlsZSBsaXN0IHJlZmVyZW5jZVxuICAgIGNvbnN0IHNjcm9sbExpc3QgPSByb290LnJlZi5saXN0O1xuICAgIGNvbnN0IGl0ZW1MaXN0ID0gc2Nyb2xsTGlzdC5jaGlsZFZpZXdzWzBdO1xuICAgIGNvbnN0IHZpc2libGVDaGlsZHJlbiA9IGl0ZW1MaXN0LmNoaWxkVmlld3MuZmlsdGVyKGNoaWxkID0+IGNoaWxkLnJlY3QuZWxlbWVudC5oZWlnaHQpO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gcm9vdFxuICAgICAgICAucXVlcnkoJ0dFVF9BQ1RJVkVfSVRFTVMnKVxuICAgICAgICAubWFwKGl0ZW0gPT4gdmlzaWJsZUNoaWxkcmVuLmZpbmQoY2hpbGQgPT4gY2hpbGQuaWQgPT09IGl0ZW0uaWQpKVxuICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gaXRlbSk7XG5cbiAgICAvLyBubyBjaGlsZHJlbiwgZG9uZSFcbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAwKSByZXR1cm4geyB2aXN1YWwsIGJvdW5kcyB9O1xuXG4gICAgY29uc3QgaG9yaXpvbnRhbFNwYWNlID0gaXRlbUxpc3QucmVjdC5lbGVtZW50LndpZHRoO1xuICAgIGNvbnN0IGRyYWdJbmRleCA9IGdldEl0ZW1JbmRleEJ5UG9zaXRpb24oaXRlbUxpc3QsIGNoaWxkcmVuLCBzY3JvbGxMaXN0LmRyYWdDb29yZGluYXRlcyk7XG5cbiAgICBjb25zdCBjaGlsZFJlY3QgPSBjaGlsZHJlblswXS5yZWN0LmVsZW1lbnQ7XG5cbiAgICBjb25zdCBpdGVtVmVydGljYWxNYXJnaW4gPSBjaGlsZFJlY3QubWFyZ2luVG9wICsgY2hpbGRSZWN0Lm1hcmdpbkJvdHRvbTtcbiAgICBjb25zdCBpdGVtSG9yaXpvbnRhbE1hcmdpbiA9IGNoaWxkUmVjdC5tYXJnaW5MZWZ0ICsgY2hpbGRSZWN0Lm1hcmdpblJpZ2h0O1xuXG4gICAgY29uc3QgaXRlbVdpZHRoID0gY2hpbGRSZWN0LndpZHRoICsgaXRlbUhvcml6b250YWxNYXJnaW47XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IGNoaWxkUmVjdC5oZWlnaHQgKyBpdGVtVmVydGljYWxNYXJnaW47XG5cbiAgICBjb25zdCBuZXdJdGVtID0gdHlwZW9mIGRyYWdJbmRleCAhPT0gJ3VuZGVmaW5lZCcgJiYgZHJhZ0luZGV4ID49IDAgPyAxIDogMDtcbiAgICBjb25zdCByZW1vdmVkSXRlbSA9IGNoaWxkcmVuLmZpbmQoY2hpbGQgPT4gY2hpbGQubWFya2VkRm9yUmVtb3ZhbCAmJiBjaGlsZC5vcGFjaXR5IDwgMC40NSlcbiAgICAgICAgPyAtMVxuICAgICAgICA6IDA7XG4gICAgY29uc3QgdmVydGljYWxJdGVtQ291bnQgPSBjaGlsZHJlbi5sZW5ndGggKyBuZXdJdGVtICsgcmVtb3ZlZEl0ZW07XG4gICAgY29uc3QgaXRlbXNQZXJSb3cgPSBnZXRJdGVtc1BlclJvdyhob3Jpem9udGFsU3BhY2UsIGl0ZW1XaWR0aCk7XG5cbiAgICAvLyBzdGFja1xuICAgIGlmIChpdGVtc1BlclJvdyA9PT0gMSkge1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gaXRlbS5yZWN0LmVsZW1lbnQuaGVpZ2h0ICsgaXRlbVZlcnRpY2FsTWFyZ2luO1xuICAgICAgICAgICAgYm91bmRzICs9IGhlaWdodDtcbiAgICAgICAgICAgIHZpc3VhbCArPSBoZWlnaHQgKiBpdGVtLm9wYWNpdHk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBncmlkXG4gICAgZWxzZSB7XG4gICAgICAgIGJvdW5kcyA9IE1hdGguY2VpbCh2ZXJ0aWNhbEl0ZW1Db3VudCAvIGl0ZW1zUGVyUm93KSAqIGl0ZW1IZWlnaHQ7XG4gICAgICAgIHZpc3VhbCA9IGJvdW5kcztcbiAgICB9XG5cbiAgICByZXR1cm4geyB2aXN1YWwsIGJvdW5kcyB9O1xufTtcblxuY29uc3QgY2FsY3VsYXRlUm9vdEJvdW5kaW5nQm94SGVpZ2h0ID0gcm9vdCA9PiB7XG4gICAgY29uc3QgaGVpZ2h0ID0gcm9vdC5yZWYubWVhc3VyZUhlaWdodCB8fCBudWxsO1xuICAgIGNvbnN0IGNhcHBlZEhlaWdodCA9IHBhcnNlSW50KHJvb3Quc3R5bGUubWF4SGVpZ2h0LCAxMCkgfHwgbnVsbDtcbiAgICBjb25zdCBmaXhlZEhlaWdodCA9IGhlaWdodCA9PT0gMCA/IG51bGwgOiBoZWlnaHQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjYXBwZWRIZWlnaHQsXG4gICAgICAgIGZpeGVkSGVpZ2h0LFxuICAgIH07XG59O1xuXG5jb25zdCBleGNlZWRzTWF4RmlsZXMgPSAocm9vdCwgaXRlbXMpID0+IHtcbiAgICBjb25zdCBhbGxvd1JlcGxhY2UgPSByb290LnF1ZXJ5KCdHRVRfQUxMT1dfUkVQTEFDRScpO1xuICAgIGNvbnN0IGFsbG93TXVsdGlwbGUgPSByb290LnF1ZXJ5KCdHRVRfQUxMT1dfTVVMVElQTEUnKTtcbiAgICBjb25zdCB0b3RhbEl0ZW1zID0gcm9vdC5xdWVyeSgnR0VUX1RPVEFMX0lURU1TJyk7XG4gICAgbGV0IG1heEl0ZW1zID0gcm9vdC5xdWVyeSgnR0VUX01BWF9GSUxFUycpO1xuXG4gICAgLy8gdG90YWwgYW1vdW50IG9mIGl0ZW1zIGJlaW5nIGRyYWdnZWRcbiAgICBjb25zdCB0b3RhbEJyb3dzZUl0ZW1zID0gaXRlbXMubGVuZ3RoO1xuXG4gICAgLy8gaWYgZG9lcyBub3QgYWxsb3cgbXVsdGlwbGUgaXRlbXMgYW5kIGRyYWdnaW5nIG1vcmUgdGhhbiBvbmUgaXRlbVxuICAgIGlmICghYWxsb3dNdWx0aXBsZSAmJiB0b3RhbEJyb3dzZUl0ZW1zID4gMSkge1xuICAgICAgICByb290LmRpc3BhdGNoKCdESURfVEhST1dfTUFYX0ZJTEVTJywge1xuICAgICAgICAgICAgc291cmNlOiBpdGVtcyxcbiAgICAgICAgICAgIGVycm9yOiBjcmVhdGVSZXNwb25zZSgnd2FybmluZycsIDAsICdNYXggZmlsZXMnKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGxpbWl0IG1heCBpdGVtcyB0byBvbmUgaWYgbm90IGFsbG93ZWQgdG8gZHJvcCBtdWx0aXBsZSBpdGVtc1xuICAgIG1heEl0ZW1zID0gYWxsb3dNdWx0aXBsZSA/IG1heEl0ZW1zIDogMTtcblxuICAgIGlmICghYWxsb3dNdWx0aXBsZSAmJiBhbGxvd1JlcGxhY2UpIHtcbiAgICAgICAgLy8gVGhlcmUgaXMgb25seSBvbmUgaXRlbSwgc28gdGhlcmUgaXMgcm9vbSB0byByZXBsYWNlIG9yIGFkZCBhbiBpdGVtXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBubyBtb3JlIHJvb20/XG4gICAgY29uc3QgaGFzTWF4SXRlbXMgPSBpc0ludChtYXhJdGVtcyk7XG4gICAgaWYgKGhhc01heEl0ZW1zICYmIHRvdGFsSXRlbXMgKyB0b3RhbEJyb3dzZUl0ZW1zID4gbWF4SXRlbXMpIHtcbiAgICAgICAgcm9vdC5kaXNwYXRjaCgnRElEX1RIUk9XX01BWF9GSUxFUycsIHtcbiAgICAgICAgICAgIHNvdXJjZTogaXRlbXMsXG4gICAgICAgICAgICBlcnJvcjogY3JlYXRlUmVzcG9uc2UoJ3dhcm5pbmcnLCAwLCAnTWF4IGZpbGVzJyksXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBnZXREcmFnSW5kZXggPSAobGlzdCwgY2hpbGRyZW4sIHBvc2l0aW9uKSA9PiB7XG4gICAgY29uc3QgaXRlbUxpc3QgPSBsaXN0LmNoaWxkVmlld3NbMF07XG4gICAgcmV0dXJuIGdldEl0ZW1JbmRleEJ5UG9zaXRpb24oaXRlbUxpc3QsIGNoaWxkcmVuLCB7XG4gICAgICAgIGxlZnQ6IHBvc2l0aW9uLnNjb3BlTGVmdCAtIGl0ZW1MaXN0LnJlY3QuZWxlbWVudC5sZWZ0LFxuICAgICAgICB0b3A6XG4gICAgICAgICAgICBwb3NpdGlvbi5zY29wZVRvcCAtXG4gICAgICAgICAgICAobGlzdC5yZWN0Lm91dGVyLnRvcCArIGxpc3QucmVjdC5lbGVtZW50Lm1hcmdpblRvcCArIGxpc3QucmVjdC5lbGVtZW50LnNjcm9sbFRvcCksXG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEVuYWJsZSBvciBkaXNhYmxlIGZpbGUgZHJvcCBmdW5jdGlvbmFsaXR5XG4gKi9cbmNvbnN0IHRvZ2dsZURyb3AgPSByb290ID0+IHtcbiAgICBjb25zdCBpc0FsbG93ZWQgPSByb290LnF1ZXJ5KCdHRVRfQUxMT1dfRFJPUCcpO1xuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSByb290LnF1ZXJ5KCdHRVRfRElTQUJMRUQnKTtcbiAgICBjb25zdCBlbmFibGVkID0gaXNBbGxvd2VkICYmICFpc0Rpc2FibGVkO1xuICAgIGlmIChlbmFibGVkICYmICFyb290LnJlZi5ob3BwZXIpIHtcbiAgICAgICAgY29uc3QgaG9wcGVyID0gY3JlYXRlSG9wcGVyKFxuICAgICAgICAgICAgcm9vdC5lbGVtZW50LFxuICAgICAgICAgICAgaXRlbXMgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGFsbG93IHF1aWNrIHZhbGlkYXRpb24gb2YgZHJvcHBlZCBpdGVtc1xuICAgICAgICAgICAgICAgIGNvbnN0IGJlZm9yZURyb3BGaWxlID0gcm9vdC5xdWVyeSgnR0VUX0JFRk9SRV9EUk9QX0ZJTEUnKSB8fCAoKCkgPT4gdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBhbGwgaXRlbXMgc2hvdWxkIGJlIHZhbGlkYXRlZCBieSBhbGwgZmlsdGVycyBhcyB2YWxpZFxuICAgICAgICAgICAgICAgIGNvbnN0IGRyb3BWYWxpZGF0aW9uID0gcm9vdC5xdWVyeSgnR0VUX0RST1BfVkFMSURBVElPTicpO1xuICAgICAgICAgICAgICAgIHJldHVybiBkcm9wVmFsaWRhdGlvblxuICAgICAgICAgICAgICAgICAgICA/IGl0ZW1zLmV2ZXJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBseUZpbHRlcnMoJ0FMTE9XX0hPUFBFUl9JVEVNJywgaXRlbSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiByb290LnF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuZXZlcnkocmVzdWx0ID0+IHJlc3VsdCA9PT0gdHJ1ZSkgJiYgYmVmb3JlRHJvcEZpbGUoaXRlbSlcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIDogdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZmlsdGVySXRlbXM6IGl0ZW1zID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWdub3JlZEZpbGVzID0gcm9vdC5xdWVyeSgnR0VUX0lHTk9SRURfRklMRVMnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zLmZpbHRlcihpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0ZpbGUoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWlnbm9yZWRGaWxlcy5pbmNsdWRlcyhpdGVtLm5hbWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjYXRjaGVzRHJvcHNPblBhZ2U6IHJvb3QucXVlcnkoJ0dFVF9EUk9QX09OX1BBR0UnKSxcbiAgICAgICAgICAgICAgICByZXF1aXJlc0Ryb3BPbkVsZW1lbnQ6IHJvb3QucXVlcnkoJ0dFVF9EUk9QX09OX0VMRU1FTlQnKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBob3BwZXIub25sb2FkID0gKGl0ZW1zLCBwb3NpdGlvbikgPT4ge1xuICAgICAgICAgICAgLy8gZ2V0IGl0ZW0gY2hpbGRyZW4gZWxlbWVudHMgYW5kIHNvcnQgYmFzZWQgb24gbGlzdCBzb3J0XG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gcm9vdC5yZWYubGlzdC5jaGlsZFZpZXdzWzBdO1xuICAgICAgICAgICAgY29uc3QgdmlzaWJsZUNoaWxkcmVuID0gbGlzdC5jaGlsZFZpZXdzLmZpbHRlcihjaGlsZCA9PiBjaGlsZC5yZWN0LmVsZW1lbnQuaGVpZ2h0KTtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuID0gcm9vdFxuICAgICAgICAgICAgICAgIC5xdWVyeSgnR0VUX0FDVElWRV9JVEVNUycpXG4gICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IHZpc2libGVDaGlsZHJlbi5maW5kKGNoaWxkID0+IGNoaWxkLmlkID09PSBpdGVtLmlkKSlcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gaXRlbSk7XG5cbiAgICAgICAgICAgIGFwcGx5RmlsdGVyQ2hhaW4oJ0FERF9JVEVNUycsIGl0ZW1zLCB7IGRpc3BhdGNoOiByb290LmRpc3BhdGNoIH0pLnRoZW4ocXVldWUgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHRoZXNlIGZpbGVzIGRvbid0IGZpdCBzbyBzdG9wIGhlcmVcbiAgICAgICAgICAgICAgICBpZiAoZXhjZWVkc01heEZpbGVzKHJvb3QsIHF1ZXVlKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgLy8gZ29cbiAgICAgICAgICAgICAgICByb290LmRpc3BhdGNoKCdBRERfSVRFTVMnLCB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBxdWV1ZSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGdldERyYWdJbmRleChyb290LnJlZi5saXN0LCBjaGlsZHJlbiwgcG9zaXRpb24pLFxuICAgICAgICAgICAgICAgICAgICBpbnRlcmFjdGlvbk1ldGhvZDogSW50ZXJhY3Rpb25NZXRob2QuRFJPUCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByb290LmRpc3BhdGNoKCdESURfRFJPUCcsIHsgcG9zaXRpb24gfSk7XG5cbiAgICAgICAgICAgIHJvb3QuZGlzcGF0Y2goJ0RJRF9FTkRfRFJBRycsIHsgcG9zaXRpb24gfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaG9wcGVyLm9uZHJhZ3N0YXJ0ID0gcG9zaXRpb24gPT4ge1xuICAgICAgICAgICAgcm9vdC5kaXNwYXRjaCgnRElEX1NUQVJUX0RSQUcnLCB7IHBvc2l0aW9uIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGhvcHBlci5vbmRyYWcgPSBkZWJvdW5jZShwb3NpdGlvbiA9PiB7XG4gICAgICAgICAgICByb290LmRpc3BhdGNoKCdESURfRFJBRycsIHsgcG9zaXRpb24gfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGhvcHBlci5vbmRyYWdlbmQgPSBwb3NpdGlvbiA9PiB7XG4gICAgICAgICAgICByb290LmRpc3BhdGNoKCdESURfRU5EX0RSQUcnLCB7IHBvc2l0aW9uIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJvb3QucmVmLmhvcHBlciA9IGhvcHBlcjtcblxuICAgICAgICByb290LnJlZi5kcmlwID0gcm9vdC5hcHBlbmRDaGlsZFZpZXcocm9vdC5jcmVhdGVDaGlsZFZpZXcoZHJpcCkpO1xuICAgIH0gZWxzZSBpZiAoIWVuYWJsZWQgJiYgcm9vdC5yZWYuaG9wcGVyKSB7XG4gICAgICAgIHJvb3QucmVmLmhvcHBlci5kZXN0cm95KCk7XG4gICAgICAgIHJvb3QucmVmLmhvcHBlciA9IG51bGw7XG4gICAgICAgIHJvb3QucmVtb3ZlQ2hpbGRWaWV3KHJvb3QucmVmLmRyaXApO1xuICAgIH1cbn07XG5cbi8qKlxuICogRW5hYmxlIG9yIGRpc2FibGUgYnJvd3NlIGZ1bmN0aW9uYWxpdHlcbiAqL1xuY29uc3QgdG9nZ2xlQnJvd3NlID0gKHJvb3QsIHByb3BzKSA9PiB7XG4gICAgY29uc3QgaXNBbGxvd2VkID0gcm9vdC5xdWVyeSgnR0VUX0FMTE9XX0JST1dTRScpO1xuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSByb290LnF1ZXJ5KCdHRVRfRElTQUJMRUQnKTtcbiAgICBjb25zdCBlbmFibGVkID0gaXNBbGxvd2VkICYmICFpc0Rpc2FibGVkO1xuICAgIGlmIChlbmFibGVkICYmICFyb290LnJlZi5icm93c2VyKSB7XG4gICAgICAgIHJvb3QucmVmLmJyb3dzZXIgPSByb290LmFwcGVuZENoaWxkVmlldyhcbiAgICAgICAgICAgIHJvb3QuY3JlYXRlQ2hpbGRWaWV3KGJyb3dzZXIsIHtcbiAgICAgICAgICAgICAgICAuLi5wcm9wcyxcbiAgICAgICAgICAgICAgICBvbmxvYWQ6IGl0ZW1zID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXBwbHlGaWx0ZXJDaGFpbignQUREX0lURU1TJywgaXRlbXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoOiByb290LmRpc3BhdGNoLFxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHF1ZXVlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZXNlIGZpbGVzIGRvbid0IGZpdCBzbyBzdG9wIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGNlZWRzTWF4RmlsZXMocm9vdCwgcXVldWUpKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBpdGVtcyFcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3QuZGlzcGF0Y2goJ0FERF9JVEVNUycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogcXVldWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyYWN0aW9uTWV0aG9kOiBJbnRlcmFjdGlvbk1ldGhvZC5CUk9XU0UsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgMFxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoIWVuYWJsZWQgJiYgcm9vdC5yZWYuYnJvd3Nlcikge1xuICAgICAgICByb290LnJlbW92ZUNoaWxkVmlldyhyb290LnJlZi5icm93c2VyKTtcbiAgICAgICAgcm9vdC5yZWYuYnJvd3NlciA9IG51bGw7XG4gICAgfVxufTtcblxuLyoqXG4gKiBFbmFibGUgb3IgZGlzYWJsZSBwYXN0ZSBmdW5jdGlvbmFsaXR5XG4gKi9cbmNvbnN0IHRvZ2dsZVBhc3RlID0gcm9vdCA9PiB7XG4gICAgY29uc3QgaXNBbGxvd2VkID0gcm9vdC5xdWVyeSgnR0VUX0FMTE9XX1BBU1RFJyk7XG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IHJvb3QucXVlcnkoJ0dFVF9ESVNBQkxFRCcpO1xuICAgIGNvbnN0IGVuYWJsZWQgPSBpc0FsbG93ZWQgJiYgIWlzRGlzYWJsZWQ7XG4gICAgaWYgKGVuYWJsZWQgJiYgIXJvb3QucmVmLnBhc3Rlcikge1xuICAgICAgICByb290LnJlZi5wYXN0ZXIgPSBjcmVhdGVQYXN0ZXIoKTtcbiAgICAgICAgcm9vdC5yZWYucGFzdGVyLm9ubG9hZCA9IGl0ZW1zID0+IHtcbiAgICAgICAgICAgIGFwcGx5RmlsdGVyQ2hhaW4oJ0FERF9JVEVNUycsIGl0ZW1zLCB7IGRpc3BhdGNoOiByb290LmRpc3BhdGNoIH0pLnRoZW4ocXVldWUgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHRoZXNlIGZpbGVzIGRvbid0IGZpdCBzbyBzdG9wIGhlcmVcbiAgICAgICAgICAgICAgICBpZiAoZXhjZWVkc01heEZpbGVzKHJvb3QsIHF1ZXVlKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgLy8gYWRkIGl0ZW1zIVxuICAgICAgICAgICAgICAgIHJvb3QuZGlzcGF0Y2goJ0FERF9JVEVNUycsIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IHF1ZXVlLFxuICAgICAgICAgICAgICAgICAgICBpbmRleDogLTEsXG4gICAgICAgICAgICAgICAgICAgIGludGVyYWN0aW9uTWV0aG9kOiBJbnRlcmFjdGlvbk1ldGhvZC5QQVNURSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSBpZiAoIWVuYWJsZWQgJiYgcm9vdC5yZWYucGFzdGVyKSB7XG4gICAgICAgIHJvb3QucmVmLnBhc3Rlci5kZXN0cm95KCk7XG4gICAgICAgIHJvb3QucmVmLnBhc3RlciA9IG51bGw7XG4gICAgfVxufTtcblxuLyoqXG4gKiBSb3V0ZSBhY3Rpb25zXG4gKi9cbmNvbnN0IHJvdXRlJDUgPSBjcmVhdGVSb3V0ZSh7XG4gICAgRElEX1NFVF9BTExPV19CUk9XU0U6ICh7IHJvb3QsIHByb3BzIH0pID0+IHtcbiAgICAgICAgdG9nZ2xlQnJvd3NlKHJvb3QsIHByb3BzKTtcbiAgICB9LFxuICAgIERJRF9TRVRfQUxMT1dfRFJPUDogKHsgcm9vdCB9KSA9PiB7XG4gICAgICAgIHRvZ2dsZURyb3Aocm9vdCk7XG4gICAgfSxcbiAgICBESURfU0VUX0FMTE9XX1BBU1RFOiAoeyByb290IH0pID0+IHtcbiAgICAgICAgdG9nZ2xlUGFzdGUocm9vdCk7XG4gICAgfSxcbiAgICBESURfU0VUX0RJU0FCTEVEOiAoeyByb290LCBwcm9wcyB9KSA9PiB7XG4gICAgICAgIHRvZ2dsZURyb3Aocm9vdCk7XG4gICAgICAgIHRvZ2dsZVBhc3RlKHJvb3QpO1xuICAgICAgICB0b2dnbGVCcm93c2Uocm9vdCwgcHJvcHMpO1xuICAgICAgICBjb25zdCBpc0Rpc2FibGVkID0gcm9vdC5xdWVyeSgnR0VUX0RJU0FCTEVEJyk7XG4gICAgICAgIGlmIChpc0Rpc2FibGVkKSB7XG4gICAgICAgICAgICByb290LmVsZW1lbnQuZGF0YXNldC5kaXNhYmxlZCA9ICdkaXNhYmxlZCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBkZWxldGUgcm9vdC5lbGVtZW50LmRhdGFzZXQuZGlzYWJsZWQ7IDw9IHRoaXMgZG9lcyBub3Qgd29yayBvbiBpT1MgMTBcbiAgICAgICAgICAgIHJvb3QuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxuY29uc3Qgcm9vdCA9IGNyZWF0ZVZpZXcoe1xuICAgIG5hbWU6ICdyb290JyxcbiAgICByZWFkOiAoeyByb290IH0pID0+IHtcbiAgICAgICAgaWYgKHJvb3QucmVmLm1lYXN1cmUpIHtcbiAgICAgICAgICAgIHJvb3QucmVmLm1lYXN1cmVIZWlnaHQgPSByb290LnJlZi5tZWFzdXJlLm9mZnNldEhlaWdodDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY3JlYXRlOiBjcmVhdGUkZSxcbiAgICB3cml0ZTogd3JpdGUkOSxcbiAgICBkZXN0cm95OiAoeyByb290IH0pID0+IHtcbiAgICAgICAgaWYgKHJvb3QucmVmLnBhc3Rlcikge1xuICAgICAgICAgICAgcm9vdC5yZWYucGFzdGVyLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocm9vdC5yZWYuaG9wcGVyKSB7XG4gICAgICAgICAgICByb290LnJlZi5ob3BwZXIuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIHJvb3QuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50KTtcbiAgICAgICAgcm9vdC5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2dlc3R1cmVzdGFydCcsIHByZXZlbnQpO1xuICAgIH0sXG4gICAgbWl4aW5zOiB7XG4gICAgICAgIHN0eWxlczogWydoZWlnaHQnXSxcbiAgICB9LFxufSk7XG5cbi8vIGNyZWF0ZXMgdGhlIGFwcFxuY29uc3QgY3JlYXRlQXBwID0gKGluaXRpYWxPcHRpb25zID0ge30pID0+IHtcbiAgICAvLyBsZXQgZWxlbWVudFxuICAgIGxldCBvcmlnaW5hbEVsZW1lbnQgPSBudWxsO1xuXG4gICAgLy8gZ2V0IGRlZmF1bHQgb3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0gZ2V0T3B0aW9ucygpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBkYXRhIHN0b3JlLCB0aGlzIHdpbGwgY29udGFpbiBhbGwgb3VyIGFwcCBpbmZvXG4gICAgY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcbiAgICAgICAgLy8gaW5pdGlhbCBzdGF0ZSAoc2hvdWxkIGJlIHNlcmlhbGl6YWJsZSlcbiAgICAgICAgY3JlYXRlSW5pdGlhbFN0YXRlKGRlZmF1bHRPcHRpb25zKSxcblxuICAgICAgICAvLyBxdWVyaWVzXG4gICAgICAgIFtxdWVyaWVzLCBjcmVhdGVPcHRpb25RdWVyaWVzKGRlZmF1bHRPcHRpb25zKV0sXG5cbiAgICAgICAgLy8gYWN0aW9uIGhhbmRsZXJzXG4gICAgICAgIFthY3Rpb25zLCBjcmVhdGVPcHRpb25BY3Rpb25zKGRlZmF1bHRPcHRpb25zKV1cbiAgICApO1xuXG4gICAgLy8gc2V0IGluaXRpYWwgb3B0aW9uc1xuICAgIHN0b3JlLmRpc3BhdGNoKCdTRVRfT1BUSU9OUycsIHsgb3B0aW9uczogaW5pdGlhbE9wdGlvbnMgfSk7XG5cbiAgICAvLyBraWNrIHRocmVhZCBpZiB2aXNpYmlsaXR5IGNoYW5nZXNcbiAgICBjb25zdCB2aXNpYmlsaXR5SGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmhpZGRlbikgcmV0dXJuO1xuICAgICAgICBzdG9yZS5kaXNwYXRjaCgnS0lDSycpO1xuICAgIH07XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIHZpc2liaWxpdHlIYW5kbGVyKTtcblxuICAgIC8vIHJlLXJlbmRlciBvbiB3aW5kb3cgcmVzaXplIHN0YXJ0IGFuZCBmaW5pc2hcbiAgICBsZXQgcmVzaXplRG9uZVRpbWVyID0gbnVsbDtcbiAgICBsZXQgaXNSZXNpemluZyA9IGZhbHNlO1xuICAgIGxldCBpc1Jlc2l6aW5nSG9yaXpvbnRhbGx5ID0gZmFsc2U7XG4gICAgbGV0IGluaXRpYWxXaW5kb3dXaWR0aCA9IG51bGw7XG4gICAgbGV0IGN1cnJlbnRXaW5kb3dXaWR0aCA9IG51bGw7XG4gICAgY29uc3QgcmVzaXplSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFpc1Jlc2l6aW5nKSB7XG4gICAgICAgICAgICBpc1Jlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplRG9uZVRpbWVyKTtcbiAgICAgICAgcmVzaXplRG9uZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpc1Jlc2l6aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBpbml0aWFsV2luZG93V2lkdGggPSBudWxsO1xuICAgICAgICAgICAgY3VycmVudFdpbmRvd1dpZHRoID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChpc1Jlc2l6aW5nSG9yaXpvbnRhbGx5KSB7XG4gICAgICAgICAgICAgICAgaXNSZXNpemluZ0hvcml6b250YWxseSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKCdESURfU1RPUF9SRVNJWkUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgNTAwKTtcbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVIYW5kbGVyKTtcblxuICAgIC8vIHJlbmRlciBpbml0aWFsIHZpZXdcbiAgICBjb25zdCB2aWV3ID0gcm9vdChzdG9yZSwgeyBpZDogZ2V0VW5pcXVlSWQoKSB9KTtcblxuICAgIC8vXG4gICAgLy8gUFJJVkFURSBBUEkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgbGV0IGlzUmVzdGluZyA9IGZhbHNlO1xuICAgIGxldCBpc0hpZGRlbiA9IGZhbHNlO1xuXG4gICAgY29uc3QgcmVhZFdyaXRlQXBpID0ge1xuICAgICAgICAvLyBuZWNlc3NhcnkgZm9yIHVwZGF0ZSBsb29wXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlYWRzIGZyb20gZG9tIChuZXZlciBjYWxsIG1hbnVhbGx5KVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX3JlYWQ6ICgpID0+IHtcbiAgICAgICAgICAgIC8vIHRlc3QgaWYgd2UncmUgcmVzaXppbmcgaG9yaXpvbnRhbGx5XG4gICAgICAgICAgICAvLyBUT0RPOiBzZWUgaWYgd2UgY2FuIG9wdGltaXplIHRoaXMgYnkgbWVhc3VyaW5nIHJvb3QgcmVjdFxuICAgICAgICAgICAgaWYgKGlzUmVzaXppbmcpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50V2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgICAgICBpZiAoIWluaXRpYWxXaW5kb3dXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBpbml0aWFsV2luZG93V2lkdGggPSBjdXJyZW50V2luZG93V2lkdGg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFpc1Jlc2l6aW5nSG9yaXpvbnRhbGx5ICYmIGN1cnJlbnRXaW5kb3dXaWR0aCAhPT0gaW5pdGlhbFdpbmRvd1dpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKCdESURfU1RBUlRfUkVTSVpFJyk7XG4gICAgICAgICAgICAgICAgICAgIGlzUmVzaXppbmdIb3Jpem9udGFsbHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzSGlkZGVuICYmIGlzUmVzdGluZykge1xuICAgICAgICAgICAgICAgIC8vIHRlc3QgaWYgaXMgbm8gbG9uZ2VyIGhpZGRlblxuICAgICAgICAgICAgICAgIGlzUmVzdGluZyA9IHZpZXcuZWxlbWVudC5vZmZzZXRQYXJlbnQgPT09IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHJlc3RpbmcsIG5vIG5lZWQgdG8gcmVhZCBhcyBudW1iZXJzIHdpbGwgc3RpbGwgYWxsIGJlIGNvcnJlY3RcbiAgICAgICAgICAgIGlmIChpc1Jlc3RpbmcpIHJldHVybjtcblxuICAgICAgICAgICAgLy8gcmVhZCB2aWV3IGRhdGFcbiAgICAgICAgICAgIHZpZXcuX3JlYWQoKTtcblxuICAgICAgICAgICAgLy8gaWYgaXMgaGlkZGVuIHdlIG5lZWQgdG8ga25vdyBzbyB3ZSBleGl0IHJlc3QgbW9kZSB3aGVuIHJldmVhbGVkXG4gICAgICAgICAgICBpc0hpZGRlbiA9IHZpZXcucmVjdC5lbGVtZW50LmhpZGRlbjtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogV3JpdGVzIHRvIGRvbSAobmV2ZXIgY2FsbCBtYW51YWxseSlcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF93cml0ZTogdHMgPT4ge1xuICAgICAgICAgICAgLy8gZ2V0IGFsbCBhY3Rpb25zIGZyb20gc3RvcmVcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSBzdG9yZVxuICAgICAgICAgICAgICAgIC5wcm9jZXNzQWN0aW9uUXVldWUoKVxuXG4gICAgICAgICAgICAgICAgLy8gZmlsdGVyIG91dCBzZXQgYWN0aW9ucyAodGhlc2Ugd2lsbCBhdXRvbWF0aWNhbGx5IHRyaWdnZXIgRElEX1NFVClcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGFjdGlvbiA9PiAhL15TRVRfLy50ZXN0KGFjdGlvbi50eXBlKSk7XG5cbiAgICAgICAgICAgIC8vIGlmIHdhcyBpZGxpbmcgYW5kIG5vIGFjdGlvbnMgc3RvcCBoZXJlXG4gICAgICAgICAgICBpZiAoaXNSZXN0aW5nICYmICFhY3Rpb25zLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBzb21lIGFjdGlvbnMgbWlnaHQgdHJpZ2dlciBldmVudHNcbiAgICAgICAgICAgIHJvdXRlQWN0aW9uc1RvRXZlbnRzKGFjdGlvbnMpO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHZpZXdcbiAgICAgICAgICAgIGlzUmVzdGluZyA9IHZpZXcuX3dyaXRlKHRzLCBhY3Rpb25zLCBpc1Jlc2l6aW5nSG9yaXpvbnRhbGx5KTtcblxuICAgICAgICAgICAgLy8gd2lsbCBjbGVhbiB1cCBhbGwgYXJjaGl2ZWQgaXRlbXNcbiAgICAgICAgICAgIHJlbW92ZVJlbGVhc2VkSXRlbXMoc3RvcmUucXVlcnkoJ0dFVF9JVEVNUycpKTtcblxuICAgICAgICAgICAgLy8gbm93IGlkbGluZ1xuICAgICAgICAgICAgaWYgKGlzUmVzdGluZykge1xuICAgICAgICAgICAgICAgIHN0b3JlLnByb2Nlc3NEaXNwYXRjaFF1ZXVlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcblxuICAgIC8vXG4gICAgLy8gRVhQT1NFIEVWRU5UUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy9cbiAgICBjb25zdCBjcmVhdGVFdmVudCA9IG5hbWUgPT4gZGF0YSA9PiB7XG4gICAgICAgIC8vIGNyZWF0ZSBkZWZhdWx0IGV2ZW50XG4gICAgICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBubyBkYXRhIHRvIGFkZFxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBldmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvcHkgcmVsZXZhbnQgcHJvcHNcbiAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoJ2Vycm9yJykpIHtcbiAgICAgICAgICAgIGV2ZW50LmVycm9yID0gZGF0YS5lcnJvciA/IHsgLi4uZGF0YS5lcnJvciB9IDogbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhLnN0YXR1cykge1xuICAgICAgICAgICAgZXZlbnQuc3RhdHVzID0geyAuLi5kYXRhLnN0YXR1cyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGEuZmlsZSkge1xuICAgICAgICAgICAgZXZlbnQub3V0cHV0ID0gZGF0YS5maWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb25seSBzb3VyY2UgaXMgYXZhaWxhYmxlLCBlbHNlIGFkZCBpdGVtIGlmIHBvc3NpYmxlXG4gICAgICAgIGlmIChkYXRhLnNvdXJjZSkge1xuICAgICAgICAgICAgZXZlbnQuZmlsZSA9IGRhdGEuc291cmNlO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuaXRlbSB8fCBkYXRhLmlkKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gZGF0YS5pdGVtID8gZGF0YS5pdGVtIDogc3RvcmUucXVlcnkoJ0dFVF9JVEVNJywgZGF0YS5pZCk7XG4gICAgICAgICAgICBldmVudC5maWxlID0gaXRlbSA/IGNyZWF0ZUl0ZW1BUEkoaXRlbSkgOiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFwIGFsbCBpdGVtcyBpbiBhIHBvc3NpYmxlIGl0ZW1zIGFycmF5XG4gICAgICAgIGlmIChkYXRhLml0ZW1zKSB7XG4gICAgICAgICAgICBldmVudC5pdGVtcyA9IGRhdGEuaXRlbXMubWFwKGNyZWF0ZUl0ZW1BUEkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhIHByb2dyZXNzIGV2ZW50IGFkZCB0aGUgcHJvZ3Jlc3MgYW1vdW50XG4gICAgICAgIGlmICgvcHJvZ3Jlc3MvLnRlc3QobmFtZSkpIHtcbiAgICAgICAgICAgIGV2ZW50LnByb2dyZXNzID0gZGF0YS5wcm9ncmVzcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvcHkgcmVsZXZhbnQgcHJvcHNcbiAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoJ29yaWdpbicpICYmIGRhdGEuaGFzT3duUHJvcGVydHkoJ3RhcmdldCcpKSB7XG4gICAgICAgICAgICBldmVudC5vcmlnaW4gPSBkYXRhLm9yaWdpbjtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldCA9IGRhdGEudGFyZ2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV2ZW50O1xuICAgIH07XG5cbiAgICBjb25zdCBldmVudFJvdXRlcyA9IHtcbiAgICAgICAgRElEX0RFU1RST1k6IGNyZWF0ZUV2ZW50KCdkZXN0cm95JyksXG5cbiAgICAgICAgRElEX0lOSVQ6IGNyZWF0ZUV2ZW50KCdpbml0JyksXG5cbiAgICAgICAgRElEX1RIUk9XX01BWF9GSUxFUzogY3JlYXRlRXZlbnQoJ3dhcm5pbmcnKSxcblxuICAgICAgICBESURfSU5JVF9JVEVNOiBjcmVhdGVFdmVudCgnaW5pdGZpbGUnKSxcbiAgICAgICAgRElEX1NUQVJUX0lURU1fTE9BRDogY3JlYXRlRXZlbnQoJ2FkZGZpbGVzdGFydCcpLFxuICAgICAgICBESURfVVBEQVRFX0lURU1fTE9BRF9QUk9HUkVTUzogY3JlYXRlRXZlbnQoJ2FkZGZpbGVwcm9ncmVzcycpLFxuICAgICAgICBESURfTE9BRF9JVEVNOiBjcmVhdGVFdmVudCgnYWRkZmlsZScpLFxuXG4gICAgICAgIERJRF9USFJPV19JVEVNX0lOVkFMSUQ6IFtjcmVhdGVFdmVudCgnZXJyb3InKSwgY3JlYXRlRXZlbnQoJ2FkZGZpbGUnKV0sXG5cbiAgICAgICAgRElEX1RIUk9XX0lURU1fTE9BRF9FUlJPUjogW2NyZWF0ZUV2ZW50KCdlcnJvcicpLCBjcmVhdGVFdmVudCgnYWRkZmlsZScpXSxcblxuICAgICAgICBESURfVEhST1dfSVRFTV9SRU1PVkVfRVJST1I6IFtjcmVhdGVFdmVudCgnZXJyb3InKSwgY3JlYXRlRXZlbnQoJ3JlbW92ZWZpbGUnKV0sXG5cbiAgICAgICAgRElEX1BSRVBBUkVfT1VUUFVUOiBjcmVhdGVFdmVudCgncHJlcGFyZWZpbGUnKSxcblxuICAgICAgICBESURfU1RBUlRfSVRFTV9QUk9DRVNTSU5HOiBjcmVhdGVFdmVudCgncHJvY2Vzc2ZpbGVzdGFydCcpLFxuICAgICAgICBESURfVVBEQVRFX0lURU1fUFJPQ0VTU19QUk9HUkVTUzogY3JlYXRlRXZlbnQoJ3Byb2Nlc3NmaWxlcHJvZ3Jlc3MnKSxcbiAgICAgICAgRElEX0FCT1JUX0lURU1fUFJPQ0VTU0lORzogY3JlYXRlRXZlbnQoJ3Byb2Nlc3NmaWxlYWJvcnQnKSxcbiAgICAgICAgRElEX0NPTVBMRVRFX0lURU1fUFJPQ0VTU0lORzogY3JlYXRlRXZlbnQoJ3Byb2Nlc3NmaWxlJyksXG4gICAgICAgIERJRF9DT01QTEVURV9JVEVNX1BST0NFU1NJTkdfQUxMOiBjcmVhdGVFdmVudCgncHJvY2Vzc2ZpbGVzJyksXG4gICAgICAgIERJRF9SRVZFUlRfSVRFTV9QUk9DRVNTSU5HOiBjcmVhdGVFdmVudCgncHJvY2Vzc2ZpbGVyZXZlcnQnKSxcblxuICAgICAgICBESURfVEhST1dfSVRFTV9QUk9DRVNTSU5HX0VSUk9SOiBbY3JlYXRlRXZlbnQoJ2Vycm9yJyksIGNyZWF0ZUV2ZW50KCdwcm9jZXNzZmlsZScpXSxcblxuICAgICAgICBESURfUkVNT1ZFX0lURU06IGNyZWF0ZUV2ZW50KCdyZW1vdmVmaWxlJyksXG5cbiAgICAgICAgRElEX1VQREFURV9JVEVNUzogY3JlYXRlRXZlbnQoJ3VwZGF0ZWZpbGVzJyksXG5cbiAgICAgICAgRElEX0FDVElWQVRFX0lURU06IGNyZWF0ZUV2ZW50KCdhY3RpdmF0ZWZpbGUnKSxcblxuICAgICAgICBESURfUkVPUkRFUl9JVEVNUzogY3JlYXRlRXZlbnQoJ3Jlb3JkZXJmaWxlcycpLFxuICAgIH07XG5cbiAgICBjb25zdCBleHBvc2VFdmVudCA9IGV2ZW50ID0+IHtcbiAgICAgICAgLy8gY3JlYXRlIGV2ZW50IG9iamVjdCB0byBiZSBkaXNwYXRjaGVkXG4gICAgICAgIGNvbnN0IGRldGFpbCA9IHsgcG9uZDogZXhwb3J0cywgLi4uZXZlbnQgfTtcbiAgICAgICAgZGVsZXRlIGRldGFpbC50eXBlO1xuICAgICAgICB2aWV3LmVsZW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICAgIG5ldyBDdXN0b21FdmVudChgRmlsZVBvbmQ6JHtldmVudC50eXBlfWAsIHtcbiAgICAgICAgICAgICAgICAvLyBldmVudCBpbmZvXG4gICAgICAgICAgICAgICAgZGV0YWlsLFxuXG4gICAgICAgICAgICAgICAgLy8gZXZlbnQgYmVoYXZpb3VyXG4gICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbXBvc2VkOiB0cnVlLCAvLyB0cmlnZ2VycyBsaXN0ZW5lcnMgb3V0c2lkZSBvZiBzaGFkb3cgcm9vdFxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBldmVudCBvYmplY3QgdG8gcGFyYW1zIHVzZWQgZm9yIGBvbigpYCBldmVudCBoYW5kbGVycyBhbmQgY2FsbGJhY2tzIGBvbmluaXQoKWBcbiAgICAgICAgY29uc3QgcGFyYW1zID0gW107XG5cbiAgICAgICAgLy8gaWYgaXMgcG9zc2libGUgZXJyb3IgZXZlbnQsIG1ha2UgaXQgdGhlIGZpcnN0IHBhcmFtXG4gICAgICAgIGlmIChldmVudC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKSkge1xuICAgICAgICAgICAgcGFyYW1zLnB1c2goZXZlbnQuZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmlsZSBpcyBhbHdheXMgc2VjdGlvblxuICAgICAgICBpZiAoZXZlbnQuaGFzT3duUHJvcGVydHkoJ2ZpbGUnKSkge1xuICAgICAgICAgICAgcGFyYW1zLnB1c2goZXZlbnQuZmlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhcHBlbmQgb3RoZXIgcHJvcHNcbiAgICAgICAgY29uc3QgZmlsdGVyZWQgPSBbJ3R5cGUnLCAnZXJyb3InLCAnZmlsZSddO1xuICAgICAgICBPYmplY3Qua2V5cyhldmVudClcbiAgICAgICAgICAgIC5maWx0ZXIoa2V5ID0+ICFmaWx0ZXJlZC5pbmNsdWRlcyhrZXkpKVxuICAgICAgICAgICAgLmZvckVhY2goa2V5ID0+IHBhcmFtcy5wdXNoKGV2ZW50W2tleV0pKTtcblxuICAgICAgICAvLyBvbih0eXBlLCAoKSA9PiB7IH0pXG4gICAgICAgIGV4cG9ydHMuZmlyZShldmVudC50eXBlLCAuLi5wYXJhbXMpO1xuXG4gICAgICAgIC8vIG9uaW5pdCA9ICgpID0+IHt9XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBzdG9yZS5xdWVyeShgR0VUX09OJHtldmVudC50eXBlLnRvVXBwZXJDYXNlKCl9YCk7XG4gICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgICBoYW5kbGVyKC4uLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgcm91dGVBY3Rpb25zVG9FdmVudHMgPSBhY3Rpb25zID0+IHtcbiAgICAgICAgaWYgKCFhY3Rpb25zLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICBhY3Rpb25zXG4gICAgICAgICAgICAuZmlsdGVyKGFjdGlvbiA9PiBldmVudFJvdXRlc1thY3Rpb24udHlwZV0pXG4gICAgICAgICAgICAuZm9yRWFjaChhY3Rpb24gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvdXRlcyA9IGV2ZW50Um91dGVzW2FjdGlvbi50eXBlXTtcbiAgICAgICAgICAgICAgICAoQXJyYXkuaXNBcnJheShyb3V0ZXMpID8gcm91dGVzIDogW3JvdXRlc10pLmZvckVhY2gocm91dGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGlzbid0IGZhbnRhc3RpYywgYnV0IGJlY2F1c2Ugb2YgdGhlIHN0YWNraW5nIG9mIHNldHRpbWVvdXRzIHBsdWdpbnMgY2FuIGhhbmRsZSB0aGUgZGlkX2xvYWQgYmVmb3JlIHRoZSBkaWRfaW5pdFxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnR5cGUgPT09ICdESURfSU5JVF9JVEVNJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3NlRXZlbnQocm91dGUoYWN0aW9uLmRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9zZUV2ZW50KHJvdXRlKGFjdGlvbi5kYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vXG4gICAgLy8gUFVCTElDIEFQSSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy9cbiAgICBjb25zdCBzZXRPcHRpb25zID0gb3B0aW9ucyA9PiBzdG9yZS5kaXNwYXRjaCgnU0VUX09QVElPTlMnLCB7IG9wdGlvbnMgfSk7XG5cbiAgICBjb25zdCBnZXRGaWxlID0gcXVlcnkgPT4gc3RvcmUucXVlcnkoJ0dFVF9BQ1RJVkVfSVRFTScsIHF1ZXJ5KTtcblxuICAgIGNvbnN0IHByZXBhcmVGaWxlID0gcXVlcnkgPT5cbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goJ1JFUVVFU1RfSVRFTV9QUkVQQVJFJywge1xuICAgICAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmFpbHVyZTogZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICBjb25zdCBhZGRGaWxlID0gKHNvdXJjZSwgb3B0aW9ucyA9IHt9KSA9PlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBhZGRGaWxlcyhbeyBzb3VyY2UsIG9wdGlvbnMgfV0sIHsgaW5kZXg6IG9wdGlvbnMuaW5kZXggfSlcbiAgICAgICAgICAgICAgICAudGhlbihpdGVtcyA9PiByZXNvbHZlKGl0ZW1zICYmIGl0ZW1zWzBdKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgfSk7XG5cbiAgICBjb25zdCBpc0ZpbGVQb25kRmlsZSA9IG9iaiA9PiBvYmouZmlsZSAmJiBvYmouaWQ7XG5cbiAgICBjb25zdCByZW1vdmVGaWxlID0gKHF1ZXJ5LCBvcHRpb25zKSA9PiB7XG4gICAgICAgIC8vIGlmIG9ubHkgcGFzc2VkIG9wdGlvbnNcbiAgICAgICAgaWYgKHR5cGVvZiBxdWVyeSA9PT0gJ29iamVjdCcgJiYgIWlzRmlsZVBvbmRGaWxlKHF1ZXJ5KSAmJiAhb3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHF1ZXJ5O1xuICAgICAgICAgICAgcXVlcnkgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXF1ZXN0IGl0ZW0gcmVtb3ZhbFxuICAgICAgICBzdG9yZS5kaXNwYXRjaCgnUkVNT1ZFX0lURU0nLCB7IC4uLm9wdGlvbnMsIHF1ZXJ5IH0pO1xuXG4gICAgICAgIC8vIHNlZSBpZiBpdGVtIGhhcyBiZWVuIHJlbW92ZWRcbiAgICAgICAgcmV0dXJuIHN0b3JlLnF1ZXJ5KCdHRVRfQUNUSVZFX0lURU0nLCBxdWVyeSkgPT09IG51bGw7XG4gICAgfTtcblxuICAgIGNvbnN0IGFkZEZpbGVzID0gKC4uLmFyZ3MpID0+XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZXMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuICAgICAgICAgICAgLy8gdXNlciBwYXNzZWQgYSBzb3VyY2VzIGFycmF5XG4gICAgICAgICAgICBpZiAoaXNBcnJheShhcmdzWzBdKSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZXMucHVzaC5hcHBseShzb3VyY2VzLCBhcmdzWzBdKTtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKG9wdGlvbnMsIGFyZ3NbMV0gfHwge30pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB1c2VyIHBhc3NlZCBzb3VyY2VzIGFzIGFyZ3VtZW50cywgbGFzdCBvbmUgbWlnaHQgYmUgb3B0aW9ucyBvYmplY3RcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0QXJndW1lbnQgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsYXN0QXJndW1lbnQgPT09ICdvYmplY3QnICYmICEobGFzdEFyZ3VtZW50IGluc3RhbmNlb2YgQmxvYikpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvcHRpb25zLCBhcmdzLnBvcCgpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBhZGQgcmVzdCB0byBzb3VyY2VzXG4gICAgICAgICAgICAgICAgc291cmNlcy5wdXNoKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCgnQUREX0lURU1TJywge1xuICAgICAgICAgICAgICAgIGl0ZW1zOiBzb3VyY2VzLFxuICAgICAgICAgICAgICAgIGluZGV4OiBvcHRpb25zLmluZGV4LFxuICAgICAgICAgICAgICAgIGludGVyYWN0aW9uTWV0aG9kOiBJbnRlcmFjdGlvbk1ldGhvZC5BUEksXG4gICAgICAgICAgICAgICAgc3VjY2VzczogcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICBmYWlsdXJlOiByZWplY3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICBjb25zdCBnZXRGaWxlcyA9ICgpID0+IHN0b3JlLnF1ZXJ5KCdHRVRfQUNUSVZFX0lURU1TJyk7XG5cbiAgICBjb25zdCBwcm9jZXNzRmlsZSA9IHF1ZXJ5ID0+XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKCdSRVFVRVNUX0lURU1fUFJPQ0VTU0lORycsIHtcbiAgICAgICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpdGVtKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZhaWx1cmU6IGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgY29uc3QgcHJlcGFyZUZpbGVzID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY29uc3QgcXVlcmllcyA9IEFycmF5LmlzQXJyYXkoYXJnc1swXSkgPyBhcmdzWzBdIDogYXJncztcbiAgICAgICAgY29uc3QgaXRlbXMgPSBxdWVyaWVzLmxlbmd0aCA/IHF1ZXJpZXMgOiBnZXRGaWxlcygpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoaXRlbXMubWFwKHByZXBhcmVGaWxlKSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHByb2Nlc3NGaWxlcyA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIGNvbnN0IHF1ZXJpZXMgPSBBcnJheS5pc0FycmF5KGFyZ3NbMF0pID8gYXJnc1swXSA6IGFyZ3M7XG4gICAgICAgIGlmICghcXVlcmllcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gZ2V0RmlsZXMoKS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgaXRlbSA9PlxuICAgICAgICAgICAgICAgICAgICAhKGl0ZW0uc3RhdHVzID09PSBJdGVtU3RhdHVzLklETEUgJiYgaXRlbS5vcmlnaW4gPT09IEZpbGVPcmlnaW4uTE9DQUwpICYmXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3RhdHVzICE9PSBJdGVtU3RhdHVzLlBST0NFU1NJTkcgJiZcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdGF0dXMgIT09IEl0ZW1TdGF0dXMuUFJPQ0VTU0lOR19DT01QTEVURSAmJlxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyAhPT0gSXRlbVN0YXR1cy5QUk9DRVNTSU5HX1JFVkVSVF9FUlJPUlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChmaWxlcy5tYXAocHJvY2Vzc0ZpbGUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocXVlcmllcy5tYXAocHJvY2Vzc0ZpbGUpKTtcbiAgICB9O1xuXG4gICAgY29uc3QgcmVtb3ZlRmlsZXMgPSAoLi4uYXJncykgPT4ge1xuICAgICAgICBjb25zdCBxdWVyaWVzID0gQXJyYXkuaXNBcnJheShhcmdzWzBdKSA/IGFyZ3NbMF0gOiBhcmdzO1xuXG4gICAgICAgIGxldCBvcHRpb25zO1xuICAgICAgICBpZiAodHlwZW9mIHF1ZXJpZXNbcXVlcmllcy5sZW5ndGggLSAxXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBxdWVyaWVzLnBvcCgpO1xuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnc1swXSkpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhcmdzWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZXMgPSBnZXRGaWxlcygpO1xuXG4gICAgICAgIGlmICghcXVlcmllcy5sZW5ndGgpIHJldHVybiBQcm9taXNlLmFsbChmaWxlcy5tYXAoZmlsZSA9PiByZW1vdmVGaWxlKGZpbGUsIG9wdGlvbnMpKSk7XG5cbiAgICAgICAgLy8gd2hlbiByZW1vdmluZyBieSBpbmRleCB0aGUgaW5kZXhlcyBzaGlmdCBhZnRlciBlYWNoIGZpbGUgcmVtb3ZhbCBzbyB3ZSBuZWVkIHRvIGNvbnZlcnQgaW5kZXhlcyB0byBpZHNcbiAgICAgICAgY29uc3QgbWFwcGVkUXVlcmllcyA9IHF1ZXJpZXNcbiAgICAgICAgICAgIC5tYXAocXVlcnkgPT4gKGlzTnVtYmVyKHF1ZXJ5KSA/IChmaWxlc1txdWVyeV0gPyBmaWxlc1txdWVyeV0uaWQgOiBudWxsKSA6IHF1ZXJ5KSlcbiAgICAgICAgICAgIC5maWx0ZXIocXVlcnkgPT4gcXVlcnkpO1xuXG4gICAgICAgIHJldHVybiBtYXBwZWRRdWVyaWVzLm1hcChxID0+IHJlbW92ZUZpbGUocSwgb3B0aW9ucykpO1xuICAgIH07XG5cbiAgICBjb25zdCBleHBvcnRzID0ge1xuICAgICAgICAvLyBzdXBwb3J0cyBldmVudHNcbiAgICAgICAgLi4ub24oKSxcblxuICAgICAgICAvLyBpbmplY3QgcHJpdmF0ZSBhcGkgbWV0aG9kc1xuICAgICAgICAuLi5yZWFkV3JpdGVBcGksXG5cbiAgICAgICAgLy8gaW5qZWN0IGFsbCBnZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gICAgICAgIC4uLmNyZWF0ZU9wdGlvbkFQSShzdG9yZSwgZGVmYXVsdE9wdGlvbnMpLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPdmVycmlkZSBvcHRpb25zIGRlZmluZWQgaW4gb3B0aW9ucyBvYmplY3RcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgICAgICovXG4gICAgICAgIHNldE9wdGlvbnMsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgdGhlIGdpdmVuIGZpbGVcbiAgICAgICAgICogQHBhcmFtIHNvdXJjZSAtIHRoZSBzb3VyY2Ugb2YgdGhlIGZpbGUgKGVpdGhlciBhIEZpbGUsIGJhc2U2NCBkYXRhIHVyaSBvciB1cmwpXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIC0gb2JqZWN0LCB7IGluZGV4OiAwIH1cbiAgICAgICAgICovXG4gICAgICAgIGFkZEZpbGUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgdGhlIGdpdmVuIGZpbGVzXG4gICAgICAgICAqIEBwYXJhbSBzb3VyY2VzIC0gdGhlIHNvdXJjZXMgb2YgdGhlIGZpbGVzIHRvIGxvYWRcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgLSBvYmplY3QsIHsgaW5kZXg6IDAgfVxuICAgICAgICAgKi9cbiAgICAgICAgYWRkRmlsZXMsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGZpbGUgb2JqZWN0cyBtYXRjaGluZyB0aGUgZ2l2ZW4gcXVlcnlcbiAgICAgICAgICogQHBhcmFtIHF1ZXJ5IHsgc3RyaW5nLCBudW1iZXIsIG51bGwgfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RmlsZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBsb2FkIGZpbGUgd2l0aCBnaXZlbiBuYW1lXG4gICAgICAgICAqIEBwYXJhbSBxdWVyeSB7IHN0cmluZywgbnVtYmVyLCBudWxsICB9XG4gICAgICAgICAqL1xuICAgICAgICBwcm9jZXNzRmlsZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVxdWVzdCBwcmVwYXJlIG91dHB1dCBmb3IgZmlsZSB3aXRoIGdpdmVuIG5hbWVcbiAgICAgICAgICogQHBhcmFtIHF1ZXJ5IHsgc3RyaW5nLCBudW1iZXIsIG51bGwgIH1cbiAgICAgICAgICovXG4gICAgICAgIHByZXBhcmVGaWxlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIGEgZmlsZSBieSBpdHMgbmFtZVxuICAgICAgICAgKiBAcGFyYW0gcXVlcnkgeyBzdHJpbmcsIG51bWJlciwgbnVsbCAgfVxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlRmlsZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW92ZXMgYSBmaWxlIHRvIGEgbmV3IGxvY2F0aW9uIGluIHRoZSBmaWxlcyBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICBtb3ZlRmlsZTogKHF1ZXJ5LCBpbmRleCkgPT4gc3RvcmUuZGlzcGF0Y2goJ01PVkVfSVRFTScsIHsgcXVlcnksIGluZGV4IH0pLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIGFsbCBmaWxlcyAod3JhcHBlZCBpbiBwdWJsaWMgYXBpKVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RmlsZXMsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN0YXJ0cyB1cGxvYWRpbmcgYWxsIGZpbGVzXG4gICAgICAgICAqL1xuICAgICAgICBwcm9jZXNzRmlsZXMsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsZWFycyBhbGwgZmlsZXMgZnJvbSB0aGUgZmlsZXMgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlRmlsZXMsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN0YXJ0cyBwcmVwYXJpbmcgb3V0cHV0IG9mIGFsbCBmaWxlc1xuICAgICAgICAgKi9cbiAgICAgICAgcHJlcGFyZUZpbGVzLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTb3J0IGxpc3Qgb2YgZmlsZXNcbiAgICAgICAgICovXG4gICAgICAgIHNvcnQ6IGNvbXBhcmUgPT4gc3RvcmUuZGlzcGF0Y2goJ1NPUlQnLCB7IGNvbXBhcmUgfSksXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJyb3dzZSB0aGUgZmlsZSBzeXN0ZW0gZm9yIGEgZmlsZVxuICAgICAgICAgKi9cbiAgICAgICAgYnJvd3NlOiAoKSA9PiB7XG4gICAgICAgICAgICAvLyBuZWVkcyB0byBiZSB0cmlnZ2VyIGRpcmVjdGx5IGFzIHVzZXIgYWN0aW9uIG5lZWRzIHRvIGJlIHRyYWNlYWJsZSAoaXMgbm90IHRyYWNlYWJsZSBpbiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICAgICAgICB2YXIgaW5wdXQgPSB2aWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1maWxlXScpO1xuICAgICAgICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVzdHJveXMgdGhlIGFwcFxuICAgICAgICAgKi9cbiAgICAgICAgZGVzdHJveTogKCkgPT4ge1xuICAgICAgICAgICAgLy8gcmVxdWVzdCBkZXN0cnVjdGlvblxuICAgICAgICAgICAgZXhwb3J0cy5maXJlKCdkZXN0cm95Jywgdmlldy5lbGVtZW50KTtcblxuICAgICAgICAgICAgLy8gc3RvcCBhY3RpdmUgcHJvY2Vzc2VzIChmaWxlIHVwbG9hZHMsIGZldGNoZXMsIHN0dWZmIGxpa2UgdGhhdClcbiAgICAgICAgICAgIC8vIGxvb3Agb3ZlciBpdGVtcyBhbmQgZGVwZW5kaW5nIG9uIHN0YXRlcyBjYWxsIGFib3J0IGZvciBvbmdvaW5nIHByb2Nlc3Nlc1xuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goJ0FCT1JUX0FMTCcpO1xuXG4gICAgICAgICAgICAvLyBkZXN0cm95IHZpZXdcbiAgICAgICAgICAgIHZpZXcuX2Rlc3Ryb3koKTtcblxuICAgICAgICAgICAgLy8gc3RvcCBsaXN0ZW5pbmcgdG8gcmVzaXplXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplSGFuZGxlcik7XG5cbiAgICAgICAgICAgIC8vIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSB2aXNpYmxpdHljaGFuZ2UgZXZlbnRcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCB2aXNpYmlsaXR5SGFuZGxlcik7XG5cbiAgICAgICAgICAgIC8vIGRpc3BhdGNoIGRlc3Ryb3lcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKCdESURfREVTVFJPWScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnNlcnRzIHRoZSBwbHVnaW4gYmVmb3JlIHRoZSB0YXJnZXQgZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgaW5zZXJ0QmVmb3JlOiBlbGVtZW50ID0+IGluc2VydEJlZm9yZSh2aWV3LmVsZW1lbnQsIGVsZW1lbnQpLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnNlcnRzIHRoZSBwbHVnaW4gYWZ0ZXIgdGhlIHRhcmdldCBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnRBZnRlcjogZWxlbWVudCA9PiBpbnNlcnRBZnRlcih2aWV3LmVsZW1lbnQsIGVsZW1lbnQpLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcHBlbmRzIHRoZSBwbHVnaW4gdG8gdGhlIHRhcmdldCBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICBhcHBlbmRUbzogZWxlbWVudCA9PiBlbGVtZW50LmFwcGVuZENoaWxkKHZpZXcuZWxlbWVudCksXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlcGxhY2VzIGFuIGVsZW1lbnQgd2l0aCB0aGUgYXBwXG4gICAgICAgICAqL1xuICAgICAgICByZXBsYWNlRWxlbWVudDogZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAvLyBpbnNlcnQgdGhlIGFwcCBiZWZvcmUgdGhlIGVsZW1lbnRcbiAgICAgICAgICAgIGluc2VydEJlZm9yZSh2aWV3LmVsZW1lbnQsIGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIG9yaWdpbmFsIGVsZW1lbnRcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcblxuICAgICAgICAgICAgLy8gcmVtZW1iZXIgb3JpZ2luYWwgZWxlbWVudFxuICAgICAgICAgICAgb3JpZ2luYWxFbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzdG9yZXMgdGhlIG9yaWdpbmFsIGVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIHJlc3RvcmVFbGVtZW50OiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIW9yaWdpbmFsRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gbm8gZWxlbWVudCB0byByZXN0b3JlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlc3RvcmUgb3JpZ2luYWwgZWxlbWVudFxuICAgICAgICAgICAgaW5zZXJ0QWZ0ZXIob3JpZ2luYWxFbGVtZW50LCB2aWV3LmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgb3VyIGVsZW1lbnRcbiAgICAgICAgICAgIHZpZXcuZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHZpZXcuZWxlbWVudCk7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSByZWZlcmVuY2VcbiAgICAgICAgICAgIG9yaWdpbmFsRWxlbWVudCA9IG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgYXBwIHJvb3QgaXMgYXR0YWNoZWQgdG8gZ2l2ZW4gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgaXNBdHRhY2hlZFRvOiBlbGVtZW50ID0+IHZpZXcuZWxlbWVudCA9PT0gZWxlbWVudCB8fCBvcmlnaW5hbEVsZW1lbnQgPT09IGVsZW1lbnQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIHJvb3QgZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgZWxlbWVudDoge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiB2aWV3LmVsZW1lbnQsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGN1cnJlbnQgcG9uZCBzdGF0dXNcbiAgICAgICAgICovXG4gICAgICAgIHN0YXR1czoge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiBzdG9yZS5xdWVyeSgnR0VUX1NUQVRVUycpLFxuICAgICAgICB9LFxuICAgIH07XG5cbiAgICAvLyBEb25lIVxuICAgIHN0b3JlLmRpc3BhdGNoKCdESURfSU5JVCcpO1xuXG4gICAgLy8gY3JlYXRlIGFjdHVhbCBhcGkgb2JqZWN0XG4gICAgcmV0dXJuIGNyZWF0ZU9iamVjdChleHBvcnRzKTtcbn07XG5cbmNvbnN0IGNyZWF0ZUFwcE9iamVjdCA9IChjdXN0b21PcHRpb25zID0ge30pID0+IHtcbiAgICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHt9O1xuICAgIGZvcmluKGdldE9wdGlvbnMoKSwgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgZGVmYXVsdE9wdGlvbnNba2V5XSA9IHZhbHVlWzBdO1xuICAgIH0pO1xuXG4gICAgLy8gc2V0IGFwcCBvcHRpb25zXG4gICAgY29uc3QgYXBwID0gY3JlYXRlQXBwKHtcbiAgICAgICAgLy8gZGVmYXVsdCBvcHRpb25zXG4gICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuXG4gICAgICAgIC8vIGN1c3RvbSBvcHRpb25zXG4gICAgICAgIC4uLmN1c3RvbU9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICAvLyByZXR1cm4gdGhlIHBsdWdpbiBpbnN0YW5jZVxuICAgIHJldHVybiBhcHA7XG59O1xuXG5jb25zdCBsb3dlckNhc2VGaXJzdExldHRlciA9IHN0cmluZyA9PiBzdHJpbmcuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSk7XG5cbmNvbnN0IGF0dHJpYnV0ZU5hbWVUb1Byb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUgPT4gdG9DYW1lbHMoYXR0cmlidXRlTmFtZS5yZXBsYWNlKC9eZGF0YS0vLCAnJykpO1xuXG5jb25zdCBtYXBPYmplY3QgPSAob2JqZWN0LCBwcm9wZXJ0eU1hcCkgPT4ge1xuICAgIC8vIHJlbW92ZSB1bndhbnRlZFxuICAgIGZvcmluKHByb3BlcnR5TWFwLCAoc2VsZWN0b3IsIG1hcHBpbmcpID0+IHtcbiAgICAgICAgZm9yaW4ob2JqZWN0LCAocHJvcGVydHksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgcmVnZXhwIHNob3J0Y3V0XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RvclJlZ0V4cCA9IG5ldyBSZWdFeHAoc2VsZWN0b3IpO1xuXG4gICAgICAgICAgICAvLyB0ZXN0cyBpZlxuICAgICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHNlbGVjdG9yUmVnRXhwLnRlc3QocHJvcGVydHkpO1xuXG4gICAgICAgICAgICAvLyBubyBtYXRjaCwgc2tpcFxuICAgICAgICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSdzIGEgbWFwcGluZywgdGhlIG9yaWdpbmFsIHByb3BlcnR5IGlzIGFsd2F5cyByZW1vdmVkXG4gICAgICAgICAgICBkZWxldGUgb2JqZWN0W3Byb3BlcnR5XTtcblxuICAgICAgICAgICAgLy8gc2hvdWxkIG9ubHkgcmVtb3ZlLCB3ZSBkb25lIVxuICAgICAgICAgICAgaWYgKG1hcHBpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBtb3ZlIHZhbHVlIHRvIG5ldyBwcm9wZXJ0eVxuICAgICAgICAgICAgaWYgKGlzU3RyaW5nKG1hcHBpbmcpKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0W21hcHBpbmddID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBtb3ZlIHRvIGdyb3VwXG4gICAgICAgICAgICBjb25zdCBncm91cCA9IG1hcHBpbmcuZ3JvdXA7XG4gICAgICAgICAgICBpZiAoaXNPYmplY3QobWFwcGluZykgJiYgIW9iamVjdFtncm91cF0pIHtcbiAgICAgICAgICAgICAgICBvYmplY3RbZ3JvdXBdID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9iamVjdFtncm91cF1bbG93ZXJDYXNlRmlyc3RMZXR0ZXIocHJvcGVydHkucmVwbGFjZShzZWxlY3RvclJlZ0V4cCwgJycpKV0gPSB2YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZG8gc3VibWFwcGluZ1xuICAgICAgICBpZiAobWFwcGluZy5tYXBwaW5nKSB7XG4gICAgICAgICAgICBtYXBPYmplY3Qob2JqZWN0W21hcHBpbmcuZ3JvdXBdLCBtYXBwaW5nLm1hcHBpbmcpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5jb25zdCBnZXRBdHRyaWJ1dGVzQXNPYmplY3QgPSAobm9kZSwgYXR0cmlidXRlTWFwcGluZyA9IHt9KSA9PiB7XG4gICAgLy8gdHVybiBhdHRyaWJ1dGVzIGludG8gb2JqZWN0XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IFtdO1xuICAgIGZvcmluKG5vZGUuYXR0cmlidXRlcywgaW5kZXggPT4ge1xuICAgICAgICBhdHRyaWJ1dGVzLnB1c2gobm9kZS5hdHRyaWJ1dGVzW2luZGV4XSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBhdHRyaWJ1dGVzXG4gICAgICAgIC5maWx0ZXIoYXR0cmlidXRlID0+IGF0dHJpYnV0ZS5uYW1lKVxuICAgICAgICAucmVkdWNlKChvYmosIGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyKG5vZGUsIGF0dHJpYnV0ZS5uYW1lKTtcblxuICAgICAgICAgICAgb2JqW2F0dHJpYnV0ZU5hbWVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGUubmFtZSldID1cbiAgICAgICAgICAgICAgICB2YWx1ZSA9PT0gYXR0cmlidXRlLm5hbWUgPyB0cnVlIDogdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9LCB7fSk7XG5cbiAgICAvLyBkbyBtYXBwaW5nIG9mIG9iamVjdCBwcm9wZXJ0aWVzXG4gICAgbWFwT2JqZWN0KG91dHB1dCwgYXR0cmlidXRlTWFwcGluZyk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuY29uc3QgY3JlYXRlQXBwQXRFbGVtZW50ID0gKGVsZW1lbnQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgIC8vIGhvdyBhdHRyaWJ1dGVzIG9mIHRoZSBpbnB1dCBlbGVtZW50IGFyZSBtYXBwZWQgdG8gdGhlIG9wdGlvbnMgZm9yIHRoZSBwbHVnaW5cbiAgICBjb25zdCBhdHRyaWJ1dGVNYXBwaW5nID0ge1xuICAgICAgICAvLyB0cmFuc2xhdGUgdG8gb3RoZXIgbmFtZVxuICAgICAgICAnXmNsYXNzJCc6ICdjbGFzc05hbWUnLFxuICAgICAgICAnXm11bHRpcGxlJCc6ICdhbGxvd011bHRpcGxlJyxcbiAgICAgICAgJ15jYXB0dXJlJCc6ICdjYXB0dXJlTWV0aG9kJyxcbiAgICAgICAgJ153ZWJraXRkaXJlY3RvcnkkJzogJ2FsbG93RGlyZWN0b3JpZXNPbmx5JyxcblxuICAgICAgICAvLyBncm91cCB1bmRlciBzaW5nbGUgcHJvcGVydHlcbiAgICAgICAgJ15zZXJ2ZXInOiB7XG4gICAgICAgICAgICBncm91cDogJ3NlcnZlcicsXG4gICAgICAgICAgICBtYXBwaW5nOiB7XG4gICAgICAgICAgICAgICAgJ15wcm9jZXNzJzoge1xuICAgICAgICAgICAgICAgICAgICBncm91cDogJ3Byb2Nlc3MnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ15yZXZlcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwOiAncmV2ZXJ0JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdeZmV0Y2gnOiB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwOiAnZmV0Y2gnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ15yZXN0b3JlJzoge1xuICAgICAgICAgICAgICAgICAgICBncm91cDogJ3Jlc3RvcmUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ15sb2FkJzoge1xuICAgICAgICAgICAgICAgICAgICBncm91cDogJ2xvYWQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGRvbid0IGluY2x1ZGUgaW4gb2JqZWN0XG4gICAgICAgICdedHlwZSQnOiBmYWxzZSxcbiAgICAgICAgJ15maWxlcyQnOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgLy8gYWRkIGFkZGl0aW9uYWwgb3B0aW9uIHRyYW5zbGF0b3JzXG4gICAgYXBwbHlGaWx0ZXJzKCdTRVRfQVRUUklCVVRFX1RPX09QVElPTl9NQVAnLCBhdHRyaWJ1dGVNYXBwaW5nKTtcblxuICAgIC8vIGNyZWF0ZSBmaW5hbCBvcHRpb25zIG9iamVjdCBieSBzZXR0aW5nIG9wdGlvbnMgb2JqZWN0IGFuZCB0aGVuIG92ZXJyaWRpbmcgb3B0aW9ucyBzdXBwbGllZCBvbiBlbGVtZW50XG4gICAgY29uc3QgbWVyZ2VkT3B0aW9ucyA9IHtcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgY29uc3QgYXR0cmlidXRlT3B0aW9ucyA9IGdldEF0dHJpYnV0ZXNBc09iamVjdChcbiAgICAgICAgZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0ZJRUxEU0VUJyA/IGVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1maWxlXScpIDogZWxlbWVudCxcbiAgICAgICAgYXR0cmlidXRlTWFwcGluZ1xuICAgICk7XG5cbiAgICAvLyBtZXJnZSB3aXRoIG9wdGlvbnMgb2JqZWN0XG4gICAgT2JqZWN0LmtleXMoYXR0cmlidXRlT3B0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBpZiAoaXNPYmplY3QoYXR0cmlidXRlT3B0aW9uc1trZXldKSkge1xuICAgICAgICAgICAgaWYgKCFpc09iamVjdChtZXJnZWRPcHRpb25zW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgbWVyZ2VkT3B0aW9uc1trZXldID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKG1lcmdlZE9wdGlvbnNba2V5XSwgYXR0cmlidXRlT3B0aW9uc1trZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lcmdlZE9wdGlvbnNba2V5XSA9IGF0dHJpYnV0ZU9wdGlvbnNba2V5XTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gaWYgcGFyZW50IGlzIGEgZmllbGRzZXQsIGdldCBmaWxlcyBmcm9tIHBhcmVudCBieSBzZWxlY3RpbmcgYWxsIGlucHV0IGZpZWxkcyB0aGF0IGFyZSBub3QgZmlsZSB1cGxvYWQgZmllbGRzXG4gICAgLy8gdGhlc2Ugd2lsbCB0aGVuIGJlIGF1dG9tYXRpY2FsbHkgc2V0IHRvIHRoZSBpbml0aWFsIGZpbGVzXG4gICAgbWVyZ2VkT3B0aW9ucy5maWxlcyA9IChvcHRpb25zLmZpbGVzIHx8IFtdKS5jb25jYXQoXG4gICAgICAgIEFycmF5LmZyb20oZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9ZmlsZV0pJykpLm1hcChpbnB1dCA9PiAoe1xuICAgICAgICAgICAgc291cmNlOiBpbnB1dC52YWx1ZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBpbnB1dC5kYXRhc2V0LnR5cGUsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KSlcbiAgICApO1xuXG4gICAgLy8gYnVpbGQgcGx1Z2luXG4gICAgY29uc3QgYXBwID0gY3JlYXRlQXBwT2JqZWN0KG1lcmdlZE9wdGlvbnMpO1xuXG4gICAgLy8gYWRkIGFscmVhZHkgc2VsZWN0ZWQgZmlsZXNcbiAgICBpZiAoZWxlbWVudC5maWxlcykge1xuICAgICAgICBBcnJheS5mcm9tKGVsZW1lbnQuZmlsZXMpLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICAgICAgICBhcHAuYWRkRmlsZShmaWxlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gcmVwbGFjZSB0aGUgdGFyZ2V0IGVsZW1lbnRcbiAgICBhcHAucmVwbGFjZUVsZW1lbnQoZWxlbWVudCk7XG5cbiAgICAvLyBleHBvc2VcbiAgICByZXR1cm4gYXBwO1xufTtcblxuLy8gaWYgYW4gZWxlbWVudCBpcyBwYXNzZWQsIHdlIGNyZWF0ZSB0aGUgaW5zdGFuY2UgYXQgdGhhdCBlbGVtZW50LCBpZiBub3QsIHdlIGp1c3QgY3JlYXRlIGFuIHVwIG9iamVjdFxuY29uc3QgY3JlYXRlQXBwJDEgPSAoLi4uYXJncykgPT5cbiAgICBpc05vZGUoYXJnc1swXSkgPyBjcmVhdGVBcHBBdEVsZW1lbnQoLi4uYXJncykgOiBjcmVhdGVBcHBPYmplY3QoLi4uYXJncyk7XG5cbmNvbnN0IFBSSVZBVEVfTUVUSE9EUyA9IFsnZmlyZScsICdfcmVhZCcsICdfd3JpdGUnXTtcblxuY29uc3QgY3JlYXRlQXBwQVBJID0gYXBwID0+IHtcbiAgICBjb25zdCBhcGkgPSB7fTtcblxuICAgIGNvcHlPYmplY3RQcm9wZXJ0aWVzVG9PYmplY3QoYXBwLCBhcGksIFBSSVZBVEVfTUVUSE9EUyk7XG5cbiAgICByZXR1cm4gYXBpO1xufTtcblxuLyoqXG4gKiBSZXBsYWNlcyBwbGFjZWhvbGRlcnMgaW4gZ2l2ZW4gc3RyaW5nIHdpdGggcmVwbGFjZW1lbnRzXG4gKiBAcGFyYW0gc3RyaW5nIC0gXCJGb28ge2Jhcn1cIlwiXG4gKiBAcGFyYW0gcmVwbGFjZW1lbnRzIC0geyBcImJhclwiOiAxMCB9XG4gKi9cbmNvbnN0IHJlcGxhY2VJblN0cmluZyA9IChzdHJpbmcsIHJlcGxhY2VtZW50cykgPT5cbiAgICBzdHJpbmcucmVwbGFjZSgvKD86eyhbYS16QS1aXSspfSkvZywgKG1hdGNoLCBncm91cCkgPT4gcmVwbGFjZW1lbnRzW2dyb3VwXSk7XG5cbmNvbnN0IGNyZWF0ZVdvcmtlciA9IGZuID0+IHtcbiAgICBjb25zdCB3b3JrZXJCbG9iID0gbmV3IEJsb2IoWycoJywgZm4udG9TdHJpbmcoKSwgJykoKSddLCB7XG4gICAgICAgIHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyxcbiAgICB9KTtcbiAgICBjb25zdCB3b3JrZXJVUkwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHdvcmtlckJsb2IpO1xuICAgIGNvbnN0IHdvcmtlciA9IG5ldyBXb3JrZXIod29ya2VyVVJMKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHRyYW5zZmVyOiAobWVzc2FnZSwgY2IpID0+IHt9LFxuICAgICAgICBwb3N0OiAobWVzc2FnZSwgY2IsIHRyYW5zZmVyTGlzdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaWQgPSBnZXRVbmlxdWVJZCgpO1xuXG4gICAgICAgICAgICB3b3JrZXIub25tZXNzYWdlID0gZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUuZGF0YS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoZS5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHdvcmtlci5wb3N0TWVzc2FnZShcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdHJhbnNmZXJMaXN0XG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICB0ZXJtaW5hdGU6ICgpID0+IHtcbiAgICAgICAgICAgIHdvcmtlci50ZXJtaW5hdGUoKTtcbiAgICAgICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwod29ya2VyVVJMKTtcbiAgICAgICAgfSxcbiAgICB9O1xufTtcblxuY29uc3QgbG9hZEltYWdlID0gdXJsID0+XG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoaW1nKTtcbiAgICAgICAgfTtcbiAgICAgICAgaW1nLm9uZXJyb3IgPSBlID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfTtcbiAgICAgICAgaW1nLnNyYyA9IHVybDtcbiAgICB9KTtcblxuY29uc3QgcmVuYW1lRmlsZSA9IChmaWxlLCBuYW1lKSA9PiB7XG4gICAgY29uc3QgcmVuYW1lZEZpbGUgPSBmaWxlLnNsaWNlKDAsIGZpbGUuc2l6ZSwgZmlsZS50eXBlKTtcbiAgICByZW5hbWVkRmlsZS5sYXN0TW9kaWZpZWREYXRlID0gZmlsZS5sYXN0TW9kaWZpZWREYXRlO1xuICAgIHJlbmFtZWRGaWxlLm5hbWUgPSBuYW1lO1xuICAgIHJldHVybiByZW5hbWVkRmlsZTtcbn07XG5cbmNvbnN0IGNvcHlGaWxlID0gZmlsZSA9PiByZW5hbWVGaWxlKGZpbGUsIGZpbGUubmFtZSk7XG5cbi8vIGFscmVhZHkgcmVnaXN0ZXJlZCBwbHVnaW5zIChjYW4ndCByZWdpc3RlciB0d2ljZSlcbmNvbnN0IHJlZ2lzdGVyZWRQbHVnaW5zID0gW107XG5cbi8vIHBhc3MgdXRpbHMgdG8gcGx1Z2luXG5jb25zdCBjcmVhdGVBcHBQbHVnaW4gPSBwbHVnaW4gPT4ge1xuICAgIC8vIGFscmVhZHkgcmVnaXN0ZXJlZFxuICAgIGlmIChyZWdpc3RlcmVkUGx1Z2lucy5pbmNsdWRlcyhwbHVnaW4pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyByZW1lbWJlciB0aGlzIHBsdWdpblxuICAgIHJlZ2lzdGVyZWRQbHVnaW5zLnB1c2gocGx1Z2luKTtcblxuICAgIC8vIHNldHVwIVxuICAgIGNvbnN0IHBsdWdpbk91dGxpbmUgPSBwbHVnaW4oe1xuICAgICAgICBhZGRGaWx0ZXIsXG4gICAgICAgIHV0aWxzOiB7XG4gICAgICAgICAgICBUeXBlLFxuICAgICAgICAgICAgZm9yaW4sXG4gICAgICAgICAgICBpc1N0cmluZyxcbiAgICAgICAgICAgIGlzRmlsZSxcbiAgICAgICAgICAgIHRvTmF0dXJhbEZpbGVTaXplLFxuICAgICAgICAgICAgcmVwbGFjZUluU3RyaW5nLFxuICAgICAgICAgICAgZ2V0RXh0ZW5zaW9uRnJvbUZpbGVuYW1lLFxuICAgICAgICAgICAgZ2V0RmlsZW5hbWVXaXRob3V0RXh0ZW5zaW9uLFxuICAgICAgICAgICAgZ3Vlc3N0aW1hdGVNaW1lVHlwZSxcbiAgICAgICAgICAgIGdldEZpbGVGcm9tQmxvYixcbiAgICAgICAgICAgIGdldEZpbGVuYW1lRnJvbVVSTCxcbiAgICAgICAgICAgIGNyZWF0ZVJvdXRlLFxuICAgICAgICAgICAgY3JlYXRlV29ya2VyLFxuICAgICAgICAgICAgY3JlYXRlVmlldyxcbiAgICAgICAgICAgIGNyZWF0ZUl0ZW1BUEksXG4gICAgICAgICAgICBsb2FkSW1hZ2UsXG4gICAgICAgICAgICBjb3B5RmlsZSxcbiAgICAgICAgICAgIHJlbmFtZUZpbGUsXG4gICAgICAgICAgICBjcmVhdGVCbG9iLFxuICAgICAgICAgICAgYXBwbHlGaWx0ZXJDaGFpbixcbiAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICBnZXROdW1lcmljQXNwZWN0UmF0aW9Gcm9tU3RyaW5nLFxuICAgICAgICB9LFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgZmlsZUFjdGlvbkJ1dHRvbixcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIGFkZCBwbHVnaW4gb3B0aW9ucyB0byBkZWZhdWx0IG9wdGlvbnNcbiAgICBleHRlbmREZWZhdWx0T3B0aW9ucyhwbHVnaW5PdXRsaW5lLm9wdGlvbnMpO1xufTtcblxuLy8gZmVhdHVyZSBkZXRlY3Rpb24gdXNlZCBieSBzdXBwb3J0ZWQoKSBtZXRob2RcbmNvbnN0IGlzT3BlcmFNaW5pID0gKCkgPT4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHdpbmRvdy5vcGVyYW1pbmkpID09PSAnW29iamVjdCBPcGVyYU1pbmldJztcbmNvbnN0IGhhc1Byb21pc2VzID0gKCkgPT4gJ1Byb21pc2UnIGluIHdpbmRvdztcbmNvbnN0IGhhc0Jsb2JTbGljZSA9ICgpID0+ICdzbGljZScgaW4gQmxvYi5wcm90b3R5cGU7XG5jb25zdCBoYXNDcmVhdGVPYmplY3RVUkwgPSAoKSA9PiAnVVJMJyBpbiB3aW5kb3cgJiYgJ2NyZWF0ZU9iamVjdFVSTCcgaW4gd2luZG93LlVSTDtcbmNvbnN0IGhhc1Zpc2liaWxpdHkgPSAoKSA9PiAndmlzaWJpbGl0eVN0YXRlJyBpbiBkb2N1bWVudDtcbmNvbnN0IGhhc1RpbWluZyA9ICgpID0+ICdwZXJmb3JtYW5jZScgaW4gd2luZG93OyAvLyBpT1MgOC54XG5jb25zdCBoYXNDU1NTdXBwb3J0cyA9ICgpID0+ICdzdXBwb3J0cycgaW4gKHdpbmRvdy5DU1MgfHwge30pOyAvLyB1c2UgdG8gZGV0ZWN0IFNhZmFyaSA5K1xuY29uc3QgaXNJRTExID0gKCkgPT4gL01TSUV8VHJpZGVudC8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbmNvbnN0IHN1cHBvcnRlZCA9ICgoKSA9PiB7XG4gICAgLy8gUnVucyBpbW1lZGlhdGVseSBhbmQgdGhlbiByZW1lbWJlcnMgcmVzdWx0IGZvciBzdWJzZXF1ZW50IGNhbGxzXG4gICAgY29uc3QgaXNTdXBwb3J0ZWQgPVxuICAgICAgICAvLyBIYXMgdG8gYmUgYSBicm93c2VyXG4gICAgICAgIGlzQnJvd3NlcigpICYmXG4gICAgICAgIC8vIENhbid0IHJ1biBvbiBPcGVyYSBNaW5pIGR1ZSB0byBsYWNrIG9mIGV2ZXJ5dGhpbmdcbiAgICAgICAgIWlzT3BlcmFNaW5pKCkgJiZcbiAgICAgICAgLy8gUmVxdWlyZSB0aGVzZSBBUElzIHRvIGZlYXR1cmUgZGV0ZWN0IGEgbW9kZXJuIGJyb3dzZXJcbiAgICAgICAgaGFzVmlzaWJpbGl0eSgpICYmXG4gICAgICAgIGhhc1Byb21pc2VzKCkgJiZcbiAgICAgICAgaGFzQmxvYlNsaWNlKCkgJiZcbiAgICAgICAgaGFzQ3JlYXRlT2JqZWN0VVJMKCkgJiZcbiAgICAgICAgaGFzVGltaW5nKCkgJiZcbiAgICAgICAgLy8gZG9lc24ndCBuZWVkIENTU1N1cHBvcnRzIGJ1dCBpcyBhIGdvb2Qgd2F5IHRvIGRldGVjdCBTYWZhcmkgOSsgKHdlIGRvIHdhbnQgdG8gc3VwcG9ydCBJRTExIHRob3VnaClcbiAgICAgICAgKGhhc0NTU1N1cHBvcnRzKCkgfHwgaXNJRTExKCkpO1xuXG4gICAgcmV0dXJuICgpID0+IGlzU3VwcG9ydGVkO1xufSkoKTtcblxuLyoqXG4gKiBQbHVnaW4gaW50ZXJuYWwgc3RhdGUgKG92ZXIgYWxsIGluc3RhbmNlcylcbiAqL1xuY29uc3Qgc3RhdGUgPSB7XG4gICAgLy8gYWN0aXZlIGFwcCBpbnN0YW5jZXMsIHVzZWQgdG8gcmVkcmF3IHRoZSBhcHBzIGFuZCB0byBmaW5kIHRoZSBsYXRlclxuICAgIGFwcHM6IFtdLFxufTtcblxuLy8gcGx1Z2luIG5hbWVcbmNvbnN0IG5hbWUgPSAnZmlsZXBvbmQnO1xuXG4vKipcbiAqIFB1YmxpYyBQbHVnaW4gbWV0aG9kc1xuICovXG5jb25zdCBmbiA9ICgpID0+IHt9O1xubGV0IFN0YXR1cyQxID0ge307XG5sZXQgRmlsZVN0YXR1cyA9IHt9O1xubGV0IEZpbGVPcmlnaW4kMSA9IHt9O1xubGV0IE9wdGlvblR5cGVzID0ge307XG5sZXQgY3JlYXRlJGYgPSBmbjtcbmxldCBkZXN0cm95ID0gZm47XG5sZXQgcGFyc2UgPSBmbjtcbmxldCBmaW5kID0gZm47XG5sZXQgcmVnaXN0ZXJQbHVnaW4gPSBmbjtcbmxldCBnZXRPcHRpb25zJDEgPSBmbjtcbmxldCBzZXRPcHRpb25zJDEgPSBmbjtcblxuLy8gaWYgbm90IHN1cHBvcnRlZCwgbm8gQVBJXG5pZiAoc3VwcG9ydGVkKCkpIHtcbiAgICAvLyBzdGFydCBwYWludGVyIGFuZCBmaXJlIGxvYWQgZXZlbnRcbiAgICBjcmVhdGVQYWludGVyKFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBzdGF0ZS5hcHBzLmZvckVhY2goYXBwID0+IGFwcC5fcmVhZCgpKTtcbiAgICAgICAgfSxcbiAgICAgICAgdHMgPT4ge1xuICAgICAgICAgICAgc3RhdGUuYXBwcy5mb3JFYWNoKGFwcCA9PiBhcHAuX3dyaXRlKHRzKSk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gZmlyZSBsb2FkZWQgZXZlbnQgc28gd2Uga25vdyB3aGVuIEZpbGVQb25kIGlzIGF2YWlsYWJsZVxuICAgIGNvbnN0IGRpc3BhdGNoID0gKCkgPT4ge1xuICAgICAgICAvLyBsZXQgb3RoZXJzIGtub3cgd2UgaGF2ZSBhcmVhIHJlYWR5XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ0ZpbGVQb25kOmxvYWRlZCcsIHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgc3VwcG9ydGVkLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGU6IGNyZWF0ZSRmLFxuICAgICAgICAgICAgICAgICAgICBkZXN0cm95LFxuICAgICAgICAgICAgICAgICAgICBwYXJzZSxcbiAgICAgICAgICAgICAgICAgICAgZmluZCxcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJQbHVnaW4sXG4gICAgICAgICAgICAgICAgICAgIHNldE9wdGlvbnM6IHNldE9wdGlvbnMkMSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBjbGVhbiB1cCBldmVudFxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZGlzcGF0Y2gpO1xuICAgIH07XG5cbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnKSB7XG4gICAgICAgIC8vIG1vdmUgdG8gYmFjayBvZiBleGVjdXRpb24gcXVldWUsIEZpbGVQb25kIHNob3VsZCBoYXZlIGJlZW4gZXhwb3J0ZWQgYnkgdGhlblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGRpc3BhdGNoKCksIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBkaXNwYXRjaCk7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlcyB0aGUgT3B0aW9uVHlwZXMgb2JqZWN0IGJhc2VkIG9uIHRoZSBjdXJyZW50IG9wdGlvbnNcbiAgICBjb25zdCB1cGRhdGVPcHRpb25UeXBlcyA9ICgpID0+XG4gICAgICAgIGZvcmluKGdldE9wdGlvbnMoKSwgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIE9wdGlvblR5cGVzW2tleV0gPSB2YWx1ZVsxXTtcbiAgICAgICAgfSk7XG5cbiAgICBTdGF0dXMkMSA9IHsgLi4uU3RhdHVzIH07XG4gICAgRmlsZU9yaWdpbiQxID0geyAuLi5GaWxlT3JpZ2luIH07XG4gICAgRmlsZVN0YXR1cyA9IHsgLi4uSXRlbVN0YXR1cyB9O1xuXG4gICAgT3B0aW9uVHlwZXMgPSB7fTtcbiAgICB1cGRhdGVPcHRpb25UeXBlcygpO1xuXG4gICAgLy8gY3JlYXRlIG1ldGhvZCwgY3JlYXRlcyBhcHBzIGFuZCBhZGRzIHRoZW0gdG8gdGhlIGFwcCBhcnJheVxuICAgIGNyZWF0ZSRmID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY29uc3QgYXBwID0gY3JlYXRlQXBwJDEoLi4uYXJncyk7XG4gICAgICAgIGFwcC5vbignZGVzdHJveScsIGRlc3Ryb3kpO1xuICAgICAgICBzdGF0ZS5hcHBzLnB1c2goYXBwKTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUFwcEFQSShhcHApO1xuICAgIH07XG5cbiAgICAvLyBkZXN0cm95cyBhcHBzIGFuZCByZW1vdmVzIHRoZW0gZnJvbSB0aGUgYXBwIGFycmF5XG4gICAgZGVzdHJveSA9IGhvb2sgPT4ge1xuICAgICAgICAvLyByZXR1cm5zIHRydWUgaWYgdGhlIGFwcCB3YXMgZGVzdHJveWVkIHN1Y2Nlc3NmdWxseVxuICAgICAgICBjb25zdCBpbmRleFRvUmVtb3ZlID0gc3RhdGUuYXBwcy5maW5kSW5kZXgoYXBwID0+IGFwcC5pc0F0dGFjaGVkVG8oaG9vaykpO1xuICAgICAgICBpZiAoaW5kZXhUb1JlbW92ZSA+PSAwKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgZnJvbSBhcHBzXG4gICAgICAgICAgICBjb25zdCBhcHAgPSBzdGF0ZS5hcHBzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKVswXTtcblxuICAgICAgICAgICAgLy8gcmVzdG9yZSBvcmlnaW5hbCBkb20gZWxlbWVudFxuICAgICAgICAgICAgYXBwLnJlc3RvcmVFbGVtZW50KCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvLyBwYXJzZXMgdGhlIGdpdmVuIGNvbnRleHQgZm9yIHBsdWdpbnMgKGRvZXMgbm90IGluY2x1ZGUgdGhlIGNvbnRleHQgZWxlbWVudCBpdHNlbGYpXG4gICAgcGFyc2UgPSBjb250ZXh0ID0+IHtcbiAgICAgICAgLy8gZ2V0IGFsbCBwb3NzaWJsZSBob29rc1xuICAgICAgICBjb25zdCBtYXRjaGVkSG9va3MgPSBBcnJheS5mcm9tKGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChgLiR7bmFtZX1gKSk7XG5cbiAgICAgICAgLy8gZmlsdGVyIG91dCBhbHJlYWR5IGFjdGl2ZSBob29rc1xuICAgICAgICBjb25zdCBuZXdIb29rcyA9IG1hdGNoZWRIb29rcy5maWx0ZXIoXG4gICAgICAgICAgICBuZXdIb29rID0+ICFzdGF0ZS5hcHBzLmZpbmQoYXBwID0+IGFwcC5pc0F0dGFjaGVkVG8obmV3SG9vaykpXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gY3JlYXRlIG5ldyBpbnN0YW5jZSBmb3IgZWFjaCBob29rXG4gICAgICAgIHJldHVybiBuZXdIb29rcy5tYXAoaG9vayA9PiBjcmVhdGUkZihob29rKSk7XG4gICAgfTtcblxuICAgIC8vIHJldHVybnMgYW4gYXBwIGJhc2VkIG9uIHRoZSBnaXZlbiBlbGVtZW50IGhvb2tcbiAgICBmaW5kID0gaG9vayA9PiB7XG4gICAgICAgIGNvbnN0IGFwcCA9IHN0YXRlLmFwcHMuZmluZChhcHAgPT4gYXBwLmlzQXR0YWNoZWRUbyhob29rKSk7XG4gICAgICAgIGlmICghYXBwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlQXBwQVBJKGFwcCk7XG4gICAgfTtcblxuICAgIC8vIGFkZHMgYSBwbHVnaW4gZXh0ZW5zaW9uXG4gICAgcmVnaXN0ZXJQbHVnaW4gPSAoLi4ucGx1Z2lucykgPT4ge1xuICAgICAgICAvLyByZWdpc3RlciBwbHVnaW5zXG4gICAgICAgIHBsdWdpbnMuZm9yRWFjaChjcmVhdGVBcHBQbHVnaW4pO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBPcHRpb25UeXBlcywgZWFjaCBwbHVnaW4gbWlnaHQgaGF2ZSBleHRlbmRlZCB0aGUgZGVmYXVsdCBvcHRpb25zXG4gICAgICAgIHVwZGF0ZU9wdGlvblR5cGVzKCk7XG4gICAgfTtcblxuICAgIGdldE9wdGlvbnMkMSA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgb3B0cyA9IHt9O1xuICAgICAgICBmb3JpbihnZXRPcHRpb25zKCksIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBvcHRzW2tleV0gPSB2YWx1ZVswXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvcHRzO1xuICAgIH07XG5cbiAgICBzZXRPcHRpb25zJDEgPSBvcHRzID0+IHtcbiAgICAgICAgaWYgKGlzT2JqZWN0KG9wdHMpKSB7XG4gICAgICAgICAgICAvLyB1cGRhdGUgZXhpc3RpbmcgcGx1Z2luc1xuICAgICAgICAgICAgc3RhdGUuYXBwcy5mb3JFYWNoKGFwcCA9PiB7XG4gICAgICAgICAgICAgICAgYXBwLnNldE9wdGlvbnMob3B0cyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gb3ZlcnJpZGUgZGVmYXVsdHNcbiAgICAgICAgICAgIHNldE9wdGlvbnMob3B0cyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXR1cm4gbmV3IG9wdGlvbnNcbiAgICAgICAgcmV0dXJuIGdldE9wdGlvbnMkMSgpO1xuICAgIH07XG59XG5cbmV4cG9ydCB7XG4gICAgRmlsZU9yaWdpbiQxIGFzIEZpbGVPcmlnaW4sXG4gICAgRmlsZVN0YXR1cyxcbiAgICBPcHRpb25UeXBlcyxcbiAgICBTdGF0dXMkMSBhcyBTdGF0dXMsXG4gICAgY3JlYXRlJGYgYXMgY3JlYXRlLFxuICAgIGRlc3Ryb3ksXG4gICAgZmluZCxcbiAgICBnZXRPcHRpb25zJDEgYXMgZ2V0T3B0aW9ucyxcbiAgICBwYXJzZSxcbiAgICByZWdpc3RlclBsdWdpbixcbiAgICBzZXRPcHRpb25zJDEgYXMgc2V0T3B0aW9ucyxcbiAgICBzdXBwb3J0ZWQsXG59O1xuIiwgImltcG9ydCB7IGRlc3Ryb3kgfSBmcm9tIFwiZmlsZXBvbmRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmlsYW1lbnRSb2J1c3RhVGFibGUoeyByZXNpemVkQ29uZmlnIH0pIHtcbiAgICBjb25zdCBTRUxFQ1RPUlMgPSB7XG4gICAgICAgIHdyYXBwZXI6ICcuZmktdGEtY29udGVudCcsXG4gICAgICAgIHRhYmxlOiAnLmZpLXRhLXRhYmxlJyxcbiAgICAgICAgaGVhZGVyQ2VsbDogJy5maS10YWJsZS1oZWFkZXItY2VsbC0nLFxuICAgICAgICBjZWxsOiAnLmZpLXRhYmxlLWNlbGwtJyxcbiAgICAgICAgcmVzaXplSGFuZGxlOiAnY29sdW1uLXJlc2l6ZS1oYW5kbGUtYmFyJyxcbiAgICAgICAgZW1wdHlIZWFkZXJDZWxsOiAndGguZmktdGEtYWN0aW9ucy1jZWxsLCB0aC5maS10YS1jZWxsLmZpLXRhLXNlbGVjdGlvbi1jZWxsJyxcbiAgICAgICAgY29sdW1uOiAneC1yb2J1c3RhLXRhYmxlLWNvbHVtbicsXG4gICAgICAgIGV4Y2x1ZGVDb2x1bW46ICd4LXJvYnVzdGEtdGFibGUtZXhjbHVkZS1jb2x1bW4nLFxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb2x1bW5zOiBudWxsLFxuICAgICAgICBleGNsdWRlZENvbHVtbnM6IG51bGwsXG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgbWluV2lkdGg6IDUwLFxuICAgICAgICAgICAgbWF4V2lkdGg6IC0xLFxuICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGZpdENvbnRlbnQ6IGZhbHNlLFxuICAgICAgICAgICAgdGFibGVLZXk6IG51bGwsXG4gICAgICAgICAgICAuLi5yZXNpemVkQ29uZmlnLFxuICAgICAgICB9LFxuICAgICAgICAvLyBzdGF0ZVxuICAgICAgICBlbGVtZW50OiBudWxsLFxuICAgICAgICByZWZzOiB7XG4gICAgICAgICAgICB0YWJsZTogbnVsbCxcbiAgICAgICAgICAgIHdyYXBwZXI6IG51bGwsXG4gICAgICAgICAgICBjb250ZW50OiBudWxsLFxuICAgICAgICB9LFxuICAgICAgICBzdGF0ZToge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgcGVuZGluZ1VwZGF0ZTogZmFsc2UsXG4gICAgICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgdG90YWxXaWR0aDogMCxcbiAgICAgICAgICAgIGZpdENvbnRlbnRXaWR0aDogMCxcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemVXaWR0aDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgbGl2ZXdpcmVIb29rQ2xlYW51cDogbnVsbCxcbiAgICAgICAgYWJvcnRDb250cm9sbGVyOiBudWxsLFxuXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICB0aGlzLmFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMuJGVsO1xuXG4gICAgICAgICAgICAvLyBpbml0aWFsIHNldHVwXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVDb21wb25lbnQoKTtcblxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckxpdmV3aXJlSG9va3MoKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWdpc3RlckxpdmV3aXJlSG9va3MoKXtcbiAgICAgICAgICAgIHRoaXMubGl2ZXdpcmVIb29rQ2xlYW51cCA9IExpdmV3aXJlLmhvb2soJ21vcnBoLnVwZGF0ZWQnLCAoeyBlbCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQ/LmNvbnRhaW5zKGVsKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUucGVuZGluZ1VwZGF0ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5wZW5kaW5nVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQgJiYgZG9jdW1lbnQuYm9keS5jb250YWlucyh0aGlzLmVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnRvdGFsV2lkdGggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplQ29tcG9uZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnBlbmRpbmdVcGRhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplQ29tcG9uZW50KCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuaW5pdGlhbGl6ZWQpIHJldHVybjtcblxuICAgICAgICAgICAgLy8gbG9jYXRlIGVsZW1lbnRzXG4gICAgICAgICAgICB0aGlzLnJlZnMud3JhcHBlciA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy53cmFwcGVyKTtcbiAgICAgICAgICAgIHRoaXMucmVmcy5jb250ZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLndyYXBwZXIpO1xuICAgICAgICAgICAgdGhpcy5yZWZzLnRhYmxlID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLnRhYmxlKTtcblxuICAgICAgICAgICAgaWYoIXRoaXMucmVmcy50YWJsZSB8fCAhdGhpcy5yZWZzLmNvbnRlbnQpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5jb2x1bW5zID0gdGhpcy5yZWZzLnRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoYFske1NFTEVDVE9SUy5jb2x1bW59XWApO1xuICAgICAgICAgICAgdGhpcy5leGNsdWRlZENvbHVtbnMgPSB0aGlzLnJlZnMudGFibGUucXVlcnlTZWxlY3RvckFsbChgWyR7U0VMRUNUT1JTLmV4Y2x1ZGVDb2x1bW59XWApO1xuXG4gICAgICAgICAgICAvLyAgQ2FsY3VsYXRlIEZpdCBDb250ZW50IChpZiBlbmFibGVkKVxuICAgICAgICAgICAgaWYodGhpcy5jb25maWcuZml0Q29udGVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlRml0Q29udGVudFdpZHRoKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNvbHVtbnMoKTtcblxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FsY3VsYXRlRml0Q29udGVudFdpZHRoKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnJlZnMud3JhcHBlcikgcmV0dXJuO1xuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIGlmKHRoaXMuY29sdW1ucz8ubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgICAgICAgIGxldCBhdmFpbGFibGVXaWR0aCA9IHRoaXMucmVmcy53cmFwcGVyLm9mZnNldFdpZHRoO1xuXG4gICAgICAgICAgICB0aGlzLnJlZnMudGFibGVcbiAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUlMuZW1wdHlIZWFkZXJDZWxsKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVXaWR0aCAtPSBjZWxsLm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHRoaXMuZXhjbHVkZWRDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVXaWR0aCAtPSBjb2x1bW4ub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmZpdENvbnRlbnRXaWR0aCA9IGF2YWlsYWJsZVdpZHRoIC8gdGhpcy5jb2x1bW5zLmxlbmd0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplQ29sdW1ucygpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcuZW5hYmxlIHx8ICF0aGlzLmNvbHVtbnMubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUudG90YWxXaWR0aCA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMuY29sdW1ucy5mb3JFYWNoKChjb2x1bW4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwQ29sdW1uSGVhZGVyKGNvbHVtbik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYodGhpcy5zdGF0ZS50b3RhbFdpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVmcy50YWJsZS5zdHlsZS53aWR0aCA9IGAke3RoaXMuc3RhdGUudG90YWxXaWR0aH1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0dXBDb2x1bW5IZWFkZXIoY29sdW1uKSB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5OYW1lID0gdGhpcy5nZXRDb2x1bW5OYW1lKGNvbHVtbik7XG5cbiAgICAgICAgICAgIGNvbHVtbi5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgICAgJ2dyb3VwL2NvbHVtbi1yZXNpemUnLFxuICAgICAgICAgICAgICAgICdvdmVyZmxvdy1oaWRkZW4nLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5tb3VudFJlc2l6ZUhhbmRsZShjb2x1bW4sIGNvbHVtbk5hbWUpO1xuXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0S2V5ID0gYCR7Y29sdW1uTmFtZX1fZGVmYXVsdGA7XG4gICAgICAgICAgICBsZXQgd2lkdGggPSB0aGlzLmdldFNhdmVkV2lkdGgoY29sdW1uTmFtZSk7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0V2lkdGggPSB0aGlzLmdldFNhdmVkV2lkdGgoZGVmYXVsdEtleSk7XG5cbiAgICAgICAgICAgIGlmICghd2lkdGggJiYgZGVmYXVsdFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgd2lkdGggPSBkZWZhdWx0V2lkdGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2lkdGgpe1xuICAgICAgICAgICAgICAgIHdpZHRoID0gdGhpcy5jb25maWcuZml0Q29udGVudFxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMuc3RhdGUuZml0Q29udGVudFdpZHRoXG4gICAgICAgICAgICAgICAgICAgIDogY29sdW1uLm9mZnNldFdpZHRoO1xuXG4gICAgICAgICAgICAgICAgaWYod2lkdGgpIHRoaXMuc2F2ZUNvbHVtbldpZHRoKHdpZHRoLCBjb2x1bW5OYW1lLCBkZWZhdWx0S2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYod2lkdGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5V2lkdGhUb0NvbHVtbih3aWR0aCwgY29sdW1uTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS50b3RhbFdpZHRoICs9IHdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG1vdW50UmVzaXplSGFuZGxlKGNvbHVtbiwgY29sdW1uTmFtZSkge1xuICAgICAgICAgICAgaWYgKGNvbHVtbi5xdWVyeVNlbGVjdG9yKGAuJHtTRUxFQ1RPUlMucmVzaXplSGFuZGxlfWApKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4gICAgICAgICAgICBoYW5kbGUudHlwZSA9ICdidXR0b24nO1xuICAgICAgICAgICAgaGFuZGxlLmNsYXNzTmFtZSA9IFNFTEVDVE9SUy5yZXNpemVIYW5kbGU7XG4gICAgICAgICAgICBoYW5kbGUudGl0bGUgPSAnUmVzaXplIGNvbHVtbic7XG5cbiAgICAgICAgICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZVN0YXJ0KGV2ZW50LCBjb2x1bW4sIGNvbHVtbk5hbWUpO1xuICAgICAgICAgICAgfSwgeyBzaWduYWw6IHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbCB9KTtcblxuICAgICAgICAgICAgaGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVEb3VibGVDbGljayhldmVudCwgY29sdW1uLCBjb2x1bW5OYW1lKTtcbiAgICAgICAgICAgIH0sIHsgc2lnbmFsOiB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWwgfSk7XG5cbiAgICAgICAgICAgIGNvbHVtbi5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZVJlc2l6ZVN0YXJ0KGV2ZW50LCBjb2x1bW4sIGNvbHVtbk5hbWUpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRYID0gZXZlbnQucGFnZVg7XG4gICAgICAgICAgICBjb25zdCBzdGFydFdpZHRoID0gY29sdW1uLm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRUYWJsZVdpZHRoID0gdGhpcy5yZWZzLnRhYmxlLm9mZnNldFdpZHRoO1xuXG4gICAgICAgICAgICBjb2x1bW4uY2xhc3NMaXN0LmFkZCgncmVzaXppbmcnKTtcblxuICAgICAgICAgICAgY29uc3Qgb25Nb3VzZU1vdmUgPSB0aGlzLnRocm90dGxlKChtb3ZlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWx0YSA9IG1vdmVFdmVudC5wYWdlWCAtIHN0YXJ0WDtcblxuICAgICAgICAgICAgICAgIGxldCBuZXdXaWR0aCA9IHN0YXJ0V2lkdGggKyBkZWx0YSAtIDE2IC8vIC0xNiBidWZmZXJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXggPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5tYXhXaWR0aCA9PT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgID8gSW5maW5pdHlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogdGhpcy5jb25maWcubWF4V2lkdGhcblxuICAgICAgICAgICAgICAgIG5ld1dpZHRoID0gTWF0aC5tYXgoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLm1pbldpZHRoLFxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihtYXgsIG5ld1dpZHRoKSxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50UmVzaXplV2lkdGggPSBNYXRoLnJvdW5kKG5ld1dpZHRoKVxuXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIFRhYmxlIFdpZHRoIHN5bmNocm9ub3VzbHkgc28gaXQgZmVlbHMgcmVzcG9uc2l2ZVxuICAgICAgICAgICAgICAgIGNvbnN0IHdpZHRoRGlmZiA9IHRoaXMuc3RhdGUuY3VycmVudFJlc2l6ZVdpZHRoIC0gc3RhcnRXaWR0aFxuICAgICAgICAgICAgICAgIHRoaXMucmVmcy50YWJsZS5zdHlsZS53aWR0aCA9IGAke3N0YXJ0VGFibGVXaWR0aCArIHdpZHRoRGlmZn1weGBcblxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlXaWR0aFRvQ29sdW1uKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRSZXNpemVXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uTmFtZSxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9LCAxNilcblxuICAgICAgICAgICAgY29uc3Qgb25Nb3VzZVVwID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbHVtbi5jbGFzc0xpc3QucmVtb3ZlKCdyZXNpemluZycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudFJlc2l6ZVdpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVDb2x1bW5XaWR0aChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFJlc2l6ZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uTmFtZVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKVxuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZURvdWJsZUNsaWNrKGV2ZW50LCBjb2x1bW4sIGNvbHVtbk5hbWUpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdEtleSA9IGAke2NvbHVtbk5hbWV9X2RlZmF1bHRgO1xuICAgICAgICAgICAgY29uc3QgcmVzZXRXaWR0aCA9IHRoaXMuZ2V0U2F2ZWRXaWR0aChkZWZhdWx0S2V5KSB8fCB0aGlzLmNvbmZpZy5taW5XaWR0aDtcblxuICAgICAgICAgICAgaWYocmVzZXRXaWR0aCAhPT0gY29sdW1uLm9mZnNldFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseVdpZHRoVG9Db2x1bW4ocmVzZXRXaWR0aCwgY29sdW1uTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlQ29sdW1uV2lkdGgocmVzZXRXaWR0aCwgY29sdW1uTmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICBhcHBseVdpZHRoVG9Db2x1bW4od2lkdGgsIGNvbHVtbk5hbWUpIHtcbiAgICAgICAgICAgIGlmICghd2lkdGggfHwgd2lkdGggPD0gMCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5zYW5pdGl6ZU5hbWUoY29sdW1uTmFtZSk7XG4gICAgICAgICAgICBjb25zdCB3aWR0aFB4ID0gIGAke3dpZHRofXB4YDtcblxuICAgICAgICAgICAgY29uc3QgaGVhZGVyID0gdGhpcy5yZWZzLnRhYmxlLnF1ZXJ5U2VsZWN0b3IoYCR7U0VMRUNUT1JTLmhlYWRlckNlbGx9JHtuYW1lfWApO1xuXG4gICAgICAgICAgICBpZiAoaGVhZGVyKSB0aGlzLnNldEVsZW1lbnRXaWR0aChoZWFkZXIsIHdpZHRoUHgpO1xuXG4gICAgICAgICAgICBjb25zdCBjZWxscyA9IHRoaXMucmVmcy50YWJsZS5xdWVyeVNlbGVjdG9yQWxsKGAke1NFTEVDVE9SUy5jZWxsfSR7bmFtZX1gKTtcblxuICAgICAgICAgICAgY2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVsZW1lbnRXaWR0aChjZWxsLCB3aWR0aFB4KTtcbiAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICAgICAgY2VsbC5zdHlsZS50ZXh0T3ZlcmZsb3cgPSAnZWxsaXBzaXMnO1xuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUud2hpdGVTcGFjZSA9ICdub3dyYXAnO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0RWxlbWVudFdpZHRoKGVsZW1lbnQsIHdpZHRoKSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLndpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1pbldpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1heFdpZHRoID0gd2lkdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gIC0tLS0gUGVyc2lzdGVuY2UgLS0tLVxuXG4gICAgICAgIHNhdmVDb2x1bW5XaWR0aCh3aWR0aCwgY29sdW1uTmFtZSwgY3VzdG9tS2V5ID0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gY3VzdG9tS2V5IHx8IGNvbHVtbk5hbWU7XG4gICAgICAgICAgICBjb25zdCBtYXggPSB0aGlzLmNvbmZpZy5tYXhXaWR0aCA9PT0gLTEgPyBJbmZpbml0eSA6IHRoaXMuY29uZmlnLm1heFdpZHRoO1xuICAgICAgICAgICAgY29uc3QgdmFsaWRXaWR0aCA9IE1hdGgubWF4KFxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLm1pbldpZHRoLFxuICAgICAgICAgICAgICAgIE1hdGgubWluKG1heCwgd2lkdGgpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBGcm9udGVuZCBTYXZlXG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U3RvcmFnZUtleShrZXkpLFxuICAgICAgICAgICAgICAgIHZhbGlkV2lkdGgudG9TdHJpbmcoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTYXZlZFdpZHRoKG5hbWUpIHtcbiAgICAgICAgICBjb25zdCB2YWwgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKHRoaXMuZ2V0U3RvcmFnZUtleShuYW1lKSk7XG4gICAgICAgICAgICByZXR1cm4gdmFsID8gcGFyc2VJbnQodmFsLCAxMCkgOiBudWxsOyAgXG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0U3RvcmFnZUtleShuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5jb25maWcudGFibGVLZXl9X2NvbHVtbldpZHRoXyR7bmFtZX1gO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIC0tLS0gSGVscGVycyAtLS0tLVxuXG4gICAgICAgIHNhbml0aXplTmFtZShuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbmFtZVxuICAgICAgICAgICAgICAgIC5zcGxpdCgnLicpXG4gICAgICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAgICAgKHMpID0+IHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9fL2csICctJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5qb2luKCdcXFxcLicpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRocm90dGxlKGNhbGxiYWNrLCBsaW1pdCkge1xuICAgICAgICAgICAgbGV0IHdhaXQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IGxhc3RBcmdzID0gbnVsbFxuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBsYXN0QXJncyA9IGFyZ3NcblxuICAgICAgICAgICAgICAgIGlmICghd2FpdCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBsYXN0QXJncylcbiAgICAgICAgICAgICAgICAgICAgd2FpdCA9IHRydWVcblxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhaXQgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RBcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgbGFzdEFyZ3MpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIGxpbWl0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIGdldENvbHVtbk5hbWUoY29sdW1uLCBzZWxlY3RvciA9IFNFTEVDVE9SUy5jb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW4uZ2V0QXR0cmlidXRlKHNlbGVjdG9yKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyAtLS0tIENsZWFudXAgLS0tLVxuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgdGhpcy5saXZld2lyZUhvb2tDbGVhbnVwPy4oKTtcbiAgICAgICAgICAgIHRoaXMubGl2ZXdpcmVIb29rQ2xlYW51cCA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuYWJvcnRDb250cm9sbGVyPy5hYm9ydCgpO1xuICAgICAgICAgICAgdGhpcy5hYm9ydENvbnRyb2xsZXIgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLmNvbHVtbnMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leGNsdWRlZENvbHVtbnMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5yZWZzLnRhYmxlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucmVmcy53cmFwcGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucmVmcy5jb250ZW50ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xufSAiXSwKICAibWFwcGluZ3MiOiAiO0FBUUEsSUFBTSxTQUFTLFdBQVMsaUJBQWlCO0FBRXpDLElBQU0sY0FBYyxDQUFDLGNBQWNBLFdBQVUsQ0FBQyxHQUFHQyxXQUFVLENBQUMsTUFBTTtBQUU5RCxRQUFNQyxTQUFRO0FBQUEsSUFDVixHQUFHO0FBQUEsRUFDUDtBQUdBLFFBQU0sY0FBYyxDQUFDO0FBQ3JCLFFBQU0sZ0JBQWdCLENBQUM7QUFHdkIsUUFBTSxXQUFXLE9BQU8sRUFBRSxHQUFHQSxPQUFNO0FBR25DLFFBQU0scUJBQXFCLE1BQU07QUFFN0IsVUFBTSxRQUFRLENBQUMsR0FBRyxXQUFXO0FBRzdCLGdCQUFZLFNBQVM7QUFFckIsV0FBTztBQUFBLEVBQ1g7QUFHQSxRQUFNLHVCQUF1QixNQUFNO0FBRS9CLFVBQU0sUUFBUSxDQUFDLEdBQUcsYUFBYTtBQUcvQixrQkFBYyxTQUFTO0FBR3ZCLFVBQU0sUUFBUSxDQUFDLEVBQUUsTUFBTSxNQUFBQyxNQUFLLE1BQU07QUFDOUIsZUFBUyxNQUFNQSxLQUFJO0FBQUEsSUFDdkIsQ0FBQztBQUFBLEVBQ0w7QUFHQSxRQUFNLFdBQVcsQ0FBQyxNQUFNQSxPQUFNLGVBQWU7QUFFekMsUUFBSSxjQUFjLENBQUMsU0FBUyxRQUFRO0FBQ2hDLG9CQUFjLEtBQUssRUFBRSxNQUFNLE1BQUFBLE1BQUssQ0FBQztBQUNqQztBQUFBLElBQ0o7QUFHQSxRQUFJLGVBQWUsSUFBSSxHQUFHO0FBQ3RCLHFCQUFlLElBQUksRUFBRUEsS0FBSTtBQUFB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QUk7QUFBQSxJQUN0RDtBQUFBO0FBQUEsSUFJQSxhQUFhQSxPQUFNO0FBQ2YsYUFBT0EsTUFDRixNQUFNLEdBQUcsRUFDVDtBQUFBLFFBQ0csQ0FBQyxNQUFNLEVBQ0YsUUFBUSxNQUFNLEdBQUcsRUFDakIsUUFBUSxtQkFBbUIsT0FBTyxFQUNsQyxZQUFZO0FBQUEsTUFDckIsRUFDQyxLQUFLLEtBQUs7QUFBQSxJQUNuQjtBQUFBLElBRUEsU0FBUyxVQUFVQyxRQUFPO0FBQ3RCLFVBQUksT0FBTztBQUNYLFVBQUksV0FBVztBQUVmLGFBQU8sWUFBYSxNQUFNO0FBQ3RCLG1CQUFXO0FBRVgsWUFBSSxDQUFDLE1BQU07QUFDUCxtQkFBUyxNQUFNLE1BQU0sUUFBUTtBQUM3QixpQkFBTztBQUVQLHFCQUFXLE1BQU07QUFDYixtQkFBTztBQUNQLGdCQUFJLFVBQVU7QUFDVix1QkFBUyxNQUFNLE1BQU0sUUFBUTtBQUFBLFlBQ2pDO0FBQUEsVUFDSixHQUFHQSxNQUFLO0FBQUEsUUFDWjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFFQSxjQUFjLFFBQVEsV0FBVyxVQUFVLFFBQVE7QUFDL0MsYUFBTyxPQUFPLGFBQWEsUUFBUTtBQUFBLElBQ3ZDO0FBQUE7QUFBQSxJQUdBLFVBQVU7QUFDTixXQUFLLHNCQUFzQjtBQUMzQixXQUFLLHNCQUFzQjtBQUUzQixXQUFLLGlCQUFpQixNQUFNO0FBQzVCLFdBQUssa0JBQWtCO0FBRXZCLFdBQUssVUFBVTtBQUNmLFdBQUssa0JBQWtCO0FBQ3ZCLFdBQUssS0FBSyxRQUFRO0FBQ2xCLFdBQUssS0FBSyxVQUFVO0FBQ3BCLFdBQUssS0FBSyxVQUFVO0FBQ3BCLFdBQUssVUFBVTtBQUFBLElBQ25CO0FBQUEsRUFDSjtBQUNKOyIsCiAgIm5hbWVzIjogWyJxdWVyaWVzIiwgImFjdGlvbnMiLCAic3RhdGUiLCAiZGF0YSIsICJxdWVyeSIsICJuYW1lIiwgIm5hbWUiLCAiYW5pbWF0aW9ucyIsICJhbmltYXRvciIsICJmbiIsICJzdHlsZXMiLCAid3JpdGUiLCAiY3JlYXRlIiwgImRlc3Ryb3kiLCAiYWN0aW9ucyIsICJzdGF0ZSIsICJzdG9yZSIsICJwcm9wcyIsICJyZWFkIiwgInJvb3QiLCAibGlzdGVuZXJzIiwgIml0ZW0iLCAidmFsdWUiLCAiZXJyb3IiLCAib3B0aW9uIiwgImJsb2IiLCAiZmlsZSIsICJkYXRhIiwgInJlcyIsICJoZWFkZXJzIiwgImNodW5rIiwgIm9uZGF0YSIsICJvbmVycm9yIiwgIm9ubG9hZCIsICJzZXJ2ZXJGaWxlUmVmZXJlbmNlIiwgImtleSIsICJxdWVyeSIsICJzdWNjZXNzIiwgInJlc3VsdCIsICJmYWlsdXJlIiwgImlzQXN5bmMiLCAibWFwIiwgImFjdGlvbiIsICJlIiwgImRyb3AiLCAibG9jYXRpb24iLCAiY3VycmVudEluZGV4IiwgImRyYWdIZWlnaHQiLCAiaXRlbUhlaWdodCIsICJlbnRyeSIsICJsaXN0IiwgInBhbmVsIiwgImRlZmF1bHRPcHRpb25zIiwgInJvdXRlIiwgInNldE9wdGlvbnMiLCAiZ2V0RmlsZXMiLCAicXVlcmllcyIsICJhcHAiLCAibmFtZSIsICJsaW1pdCJdCn0K
