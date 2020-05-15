"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useObject = useObject;
exports.rebuildObjectTree = rebuildObjectTree;
exports.patchReducer = patchReducer;
exports.usePatch = usePatch;
exports.helperReducer = helperReducer;
exports.useHelper = useHelper;
exports.useAllHelpers = useAllHelpers;
exports.usePromise = usePromise;
exports.useFetch = useFetch;
exports.makeHelperWall = makeHelperWall;
exports.checkHelpersFailed = exports.checkHelpersReady = exports.never = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var never = new Promise(function () {});
/**
 * Use an object in a dependancy
 * @param {*} object
 */

exports.never = never;

function useObject(object) {
  var _useState = (0, _react.useState)(object),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var str = JSON.stringify(object);
  (0, _react.useEffect)(function () {
    setState(JSON.parse(str));
  }, [str]);
  return state;
}
/**
 * Rebuilds an object's required nodes down a tree path
 * @param {Object} state
 * @param {Array} list
 * @returns {Object} newState
 */


function rebuildObjectTree(state, list) {
  var newState = _objectSpread({}, state);

  var node = newState;

  var _iterator = _createForOfIteratorHelper(list),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var key = _step.value;
      var child = node[key];

      if (child && child instanceof Object && !(child instanceof Array)) {
        node[key] = _objectSpread({}, child);
      } else {
        node[key] = {};
      }

      node = node[key];
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return [newState, node];
}

function patchReducer(state, patch) {
  if (!(patch instanceof Object)) return {};
  if (Object.keys(patch) < 1) return state;
  return _objectSpread({}, state, {}, patch);
}
/**
 * Use simple patch hook
 * @param {Object?} init
 * @returns {Array} [state : Object, patch : Function]
 */


function usePatch() {
  var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _react.useReducer)(patchReducer, init);
}

function helperReducer(state, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      type = _ref2[0],
      payload = _ref2[1];

  switch (type) {
    case 'init':
      return {};

    case 'reset':
      if (state.failed) return {};
      return state;

    case 'reject':
      return _objectSpread({}, state, {
        ready: true,
        failed: true,
        error: payload
      });

    case 'resolve':
      return {
        ready: true,
        data: payload
      };

    case 'patch':
      if (!state.ready || state.failed) return state;
      return _objectSpread({}, state, {
        data: _objectSpread({}, state.data, {}, payload)
      });

    case 'setIn':
      {
        if (!state.ready || state.failed) return state;
        var list = ['data'].concat(_toConsumableArray(payload.key));
        var lastKey = list.pop();

        var _rebuildObjectTree = rebuildObjectTree(state, list),
            _rebuildObjectTree2 = _slicedToArray(_rebuildObjectTree, 2),
            newState = _rebuildObjectTree2[0],
            node = _rebuildObjectTree2[1];

        node[lastKey] = payload.data;
        return newState;
      }

    default:
  }

  return state;
}
/**
 * Use helper reducer
 * @param {*?} initialState
 * @returns {Array} [state, actions]
 */


function useHelper(initialState) {
  var _arguments = arguments;

  var _useReducer = (0, _react.useReducer)(helperReducer, {}, function () {
    if (_arguments.length < 1) {
      return helperReducer({}, ['init']);
    } else if (initialState instanceof Error) {
      return helperReducer({}, ['reject', initialState]);
    }

    return helperReducer({}, ['resolve', initialState]);
  }),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var _useState3 = (0, _react.useState)({
    init: function init() {
      dispatch(['init']);
    },
    reset: function reset() {
      dispatch(['reset']);
    },
    reject: function reject(error) {
      dispatch(['reject', error]);
    },
    resolve: function resolve(data) {
      dispatch(['resolve', data]);
    },
    patch: function patch(data) {
      dispatch(['patch', data]);
    },
    setIn: function setIn(key, data) {
      dispatch(['setIn', {
        key: key,
        data: data
      }]);
    }
  }),
      _useState4 = _slicedToArray(_useState3, 1),
      actions = _useState4[0];

  return [state, actions];
}
/**
 * Check helpers are ready
 * @param {Array} helpers
 * @returns {Boolean}
 */


var checkHelpersReady = function checkHelpersReady(helpers) {
  return helpers.every(function (_ref3) {
    var ready = _ref3.ready;
    return ready;
  });
};
/**
 * Check helpers have failed
 * @param {Array} helpers
 * @returns {Boolean}
 */


exports.checkHelpersReady = checkHelpersReady;

var checkHelpersFailed = function checkHelpersFailed(helpers) {
  return helpers.some(function (_ref4) {
    var failed = _ref4.failed;
    return failed;
  });
};
/**
 * Combine helpers
 * @param {Object} helpers with useMemo
 * @param {Function?} postProcessor with useCallback
 * @returns {Array} [state, actions]
 * @example
 * const [state] = useAllHelpers(
 *   useMemo(() => ({
 *     one, two, three
 *   }), [one, two, three]),
 *   useCallback((data) => {
 *     // Mutate the data
 *     return newData;
 *   }, []),
 * )
 */


exports.checkHelpersFailed = checkHelpersFailed;

function useAllHelpers(helpers) {
  var postProcessor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  var _useHelper = useHelper(),
      _useHelper2 = _slicedToArray(_useHelper, 2),
      state = _useHelper2[0],
      actions = _useHelper2[1];

  var init = actions.init,
      resolve = actions.resolve,
      reject = actions.reject;
  (0, _react.useEffect)(function () {
    var list = Object.values(helpers);

    if (!checkHelpersReady(list)) {
      init();
      return;
    }

    if (checkHelpersFailed(list)) {
      reject();
      return;
    }

    var newState = {};
    Object.entries(helpers).forEach(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          key = _ref6[0],
          data = _ref6[1].data;

      newState[key] = data;
    });

    if (postProcessor) {
      newState = postProcessor(newState);
    }

    resolve(newState);
  }, [helpers, postProcessor, init, resolve, reject]);
  return [state, actions];
}
/**
 * Promise hook
 * @param {Promise} promise with useCallback
 * @returns {Array} [state, actions]
 * @example
 * const promise = useCallback(async () => {
 *   ...
 * }, []);
 * return usePromise(promise);
 */


function usePromise(promise) {
  var _useHelper3 = useHelper(),
      _useHelper4 = _slicedToArray(_useHelper3, 2),
      state = _useHelper4[0],
      _useHelper4$ = _useHelper4[1],
      init = _useHelper4$.init,
      reset = _useHelper4$.reset,
      resolve = _useHelper4$.resolve,
      reject = _useHelper4$.reject;

  var _useState5 = (0, _react.useState)(0),
      _useState6 = _slicedToArray(_useState5, 2),
      reload = _useState6[0],
      setReload = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      softReload = _useState8[0],
      setSoftReload = _useState8[1];

  (0, _react.useEffect)(function () {
    if (softReload) {
      reset();
    } else {
      init();
    }

    var timeout = false;

    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!timeout) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              _context.next = 4;
              return promise();

            case 4:
              data = _context.sent;

              if (!timeout) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return");

            case 7:
              resolve(data);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))()["catch"](function (error) {
      if (timeout) return;
      reject(error);
    });

    return function () {
      timeout = true;
    };
  }, [promise, init, resolve, reject, reload, softReload]);

  var _useState9 = (0, _react.useState)({
    reload: function reload() {
      var soft = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      setSoftReload(soft);
      setReload(Date.now());
    }
  }),
      _useState10 = _slicedToArray(_useState9, 1),
      actions = _useState10[0];

  return [state, actions];
}
/**
 * Fetch hook
 * @param {string} url
 * @param {Object} opts
 * @param {string?} opts.bodyType none|buffer|text|json
 * @returns {Array} [state, actions]
 */


function useFetch(url) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _opts$bodyType = opts.bodyType,
      bodyType = _opts$bodyType === void 0 ? 'none' : _opts$bodyType,
      otherOpts = _objectWithoutProperties(opts, ["bodyType"]);

  var fetchOpts = useObject(otherOpts);
  var promise = (0, _react.useCallback)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var res, data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (url) {
              _context2.next = 2;
              break;
            }

            throw new Error('usePendingFetch url undefined');

          case 2:
            _context2.next = 4;
            return (0, _nodeFetch["default"])(url, fetchOpts);

          case 4:
            res = _context2.sent;
            data = {
              status: res.status,
              headers: res.headers
            };
            _context2.t0 = bodyType;
            _context2.next = _context2.t0 === 'buffer' ? 9 : _context2.t0 === 'text' ? 13 : _context2.t0 === 'json' ? 17 : 21;
            break;

          case 9:
            _context2.next = 11;
            return res.buffer();

          case 11:
            data.body = _context2.sent;
            return _context2.abrupt("break", 21);

          case 13:
            _context2.next = 15;
            return res.text();

          case 15:
            data.body = _context2.sent;
            return _context2.abrupt("break", 21);

          case 17:
            _context2.next = 19;
            return res.json();

          case 19:
            data.body = _context2.sent;
            return _context2.abrupt("break", 21);

          case 21:
            return _context2.abrupt("return", data);

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })), [url, fetchOpts, bodyType]);
  return usePromise(promise);
}
/**
 * Make a helper wall to validate loading data
 * @returns {Array} [HelperWall, useHelperWall, context]
 * @example
 * const [Wall, useData] = makeHelperWall();
 * // ...
 * return <Wall state={someHelper}>...</Wall>
 * // ...
 * const [state] = useData();
 */


function makeHelperWall() {
  var context = (0, _react.createContext)();

  function useHelperWall() {
    return (0, _react.useContext)(context);
  }

  function HelperWall(props) {
    var children = props.children,
        state = props.state,
        loadingComponent = props.loadingComponent,
        failedComponent = props.failedComponent,
        validate = props.validate;
    var ready = state.ready,
        failed = state.failed,
        data = state.data;

    if (!ready) {
      return loadingComponent;
    }

    if (failed || !validate(data)) {
      return failedComponent;
    }

    return /*#__PURE__*/_react["default"].createElement(context.Provider, {
      value: [data]
    }, children);
  }

  HelperWall.defaultProps = {
    loadingComponent: false,
    failedComponent: false,
    validate: function validate() {
      return true;
    }
  };
  HelperWall.propTypes = {
    children: _propTypes["default"].node.isRequired,
    state: _propTypes["default"].object.isRequired,
    loadingComponent: _propTypes["default"].node,
    failedComponent: _propTypes["default"].node,
    validate: _propTypes["default"].func
  };
  return [HelperWall, useHelperWall, context];
}
