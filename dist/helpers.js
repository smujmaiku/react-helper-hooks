"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchReducer = patchReducer;
exports.usePatch = usePatch;
exports.pendingReducer = pendingReducer;
exports.usePending = usePending;
exports.usePendingPromise = usePendingPromise;
exports.usePendingFetch = usePendingFetch;
exports.useJustOne = useJustOne;

var _react = require("react");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function patchReducer(state, patch) {
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

function pendingReducer(state, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      type = _ref2[0],
      payload = _ref2[1];

  switch (type) {
    case 'init':
      return {};

    case 'pending':
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

    default:
  }

  return state;
}

;
/**
 * Use pending hook
 * @returns {Array} [state,actions]
 */

function usePending() {
  var _useReducer = (0, _react.useReducer)(pendingReducer, {}),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var actions = {
    init: function init() {
      dispatch(['init']);
    },
    pending: function pending() {
      dispatch(['pending']);
    },
    reject: function reject(error) {
      dispatch(['reject', error]);
    },
    resolve: function resolve(data) {
      dispatch(['resolve', data]);
    }
  };
  return [state, actions];
}
/**
 * Use pending hook with a promise
 * @param {Promise} promise
 * @returns {Object}
 */


function usePendingPromise(promise) {
  var _usePending = usePending(),
      _usePending2 = _slicedToArray(_usePending, 2),
      state = _usePending2[0],
      actions = _usePending2[1];

  (0, _react.useEffect)(function () {
    actions.init();
    var timeout = false;
    promise.then(function (data) {
      if (timeout) return;
      actions.resolve(data);
    })["catch"](function () {
      if (timeout) return;
      actions.fail();
    });
    return function () {
      timeout = true;
    };
  }, [promise]);
  return state;
}
/**
 * Fetch hook
 * @param {string} url
 * @param {Object} opts
 * @param {string?} opts.bodyType none|buffer|text|json
 */


function usePendingFetch(url) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      promise = _useState2[0],
      setPromise = _useState2[1];

  var _opts$bodyType = opts.bodyType,
      bodyType = _opts$bodyType === void 0 ? 'none' : _opts$bodyType,
      fetchOpts = _objectWithoutProperties(opts, ["bodyType"]);

  var fetchOptsStr = JSON.stringify(fetchOpts);
  (0, _react.useEffect)(function () {
    setPromise( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var res, data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (url) {
                _context.next = 2;
                break;
              }

              throw new Error('useFetch url undefined');

            case 2:
              _context.next = 4;
              return (0, _nodeFetch["default"])(url, JSON.parse(fetchOptsStr));

            case 4:
              res = _context.sent;
              data = {
                status: res.status,
                headers: res.headers
              };
              _context.t0 = bodyType;
              _context.next = _context.t0 === 'buffer' ? 9 : _context.t0 === 'text' ? 13 : _context.t0 === 'json' ? 17 : 21;
              break;

            case 9:
              _context.next = 11;
              return res.buffer();

            case 11:
              data.body = _context.sent;
              return _context.abrupt("break", 21);

            case 13:
              _context.next = 15;
              return res.text();

            case 15:
              data.body = _context.sent;
              return _context.abrupt("break", 21);

            case 17:
              _context.next = 19;
              return res.json();

            case 19:
              data.body = _context.sent;
              return _context.abrupt("break", 21);

            case 21:
              return _context.abrupt("return", data);

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
  }, [url, fetchOptsStr, bodyType]);
  return usePendingPromise(promise);
}
/**
 * Expand a single value to an Array for a hook
 * @param {*} value
 * @returns {Array}
 */


function useJustOne(value) {
  var _useState3 = (0, _react.useState)([value]),
      _useState4 = _slicedToArray(_useState3, 2),
      state = _useState4[0],
      setState = _useState4[1];

  (0, _react.useEffect)(function () {
    setState([value]);
  }, [value]);
  return state;
}
