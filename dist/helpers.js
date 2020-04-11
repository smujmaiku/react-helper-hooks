"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rebuildObjectTree = rebuildObjectTree;
exports.patchReducer = patchReducer;
exports.usePatch = usePatch;
exports.helperReducer = helperReducer;
exports.useHelper = useHelper;
exports.usePromise = usePromise;
exports.useFetch = useFetch;
exports.useJustOne = useJustOne;
exports.never = void 0;

var _react = require("react");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var never = new Promise(function () {});
exports.never = never;

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
 *
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

  var _useState = (0, _react.useState)({
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
      _useState2 = _slicedToArray(_useState, 1),
      actions = _useState2[0];

  return [state, actions];
}
/**
 * Promise hook
 * @param {Promise} promise
 * @returns {Array} [state, actions]
 */


function usePromise(promise) {
  var _useHelper = useHelper(),
      _useHelper2 = _slicedToArray(_useHelper, 2),
      state = _useHelper2[0],
      _useHelper2$ = _useHelper2[1],
      init = _useHelper2$.init,
      resolve = _useHelper2$.resolve,
      reject = _useHelper2$.reject;

  var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      reload = _useState4[0],
      setReload = _useState4[1];

  (0, _react.useEffect)(function () {
    init();
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
  }, [promise, init, resolve, reject, reload]);

  var _useState5 = (0, _react.useState)({
    reload: function reload() {
      setReload(Date.now());
    }
  }),
      _useState6 = _slicedToArray(_useState5, 1),
      actions = _useState6[0];

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

  var _useState7 = (0, _react.useState)([never]),
      _useState8 = _slicedToArray(_useState7, 2),
      _useState8$ = _slicedToArray(_useState8[0], 1),
      promise = _useState8$[0],
      setPromise = _useState8[1];

  var _opts$bodyType = opts.bodyType,
      bodyType = _opts$bodyType === void 0 ? 'none' : _opts$bodyType,
      fetchOpts = _objectWithoutProperties(opts, ["bodyType"]);

  var fetchOptsStr = JSON.stringify(fetchOpts);
  (0, _react.useEffect)(function () {
    setPromise([/*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
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
              return (0, _nodeFetch["default"])(url, JSON.parse(fetchOptsStr));

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
    }))]);
  }, [url, fetchOptsStr, bodyType]);
  return usePromise(promise);
}
/**
 * Expand a single value to an Array for a hook
 * @param {*} value
 * @returns {Array}
 */


function useJustOne(value) {
  var _useState9 = (0, _react.useState)([value]),
      _useState10 = _slicedToArray(_useState9, 2),
      state = _useState10[0],
      setState = _useState10[1];

  (0, _react.useEffect)(function () {
    setState([value]);
  }, [value]);
  return state;
}
