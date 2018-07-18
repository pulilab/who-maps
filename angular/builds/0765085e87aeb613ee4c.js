(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[339],{

/***/ "./src/LandingPage/landingPageModule.js":
/*!**********************************************!*\
  !*** ./src/LandingPage/landingPageModule.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _angular = __webpack_require__(/*! angular */ \"./node_modules/angular/index.js\");\n\nvar _angular2 = _interopRequireDefault(_angular);\n\nvar _Utilities = __webpack_require__(/*! ../Utilities */ \"./src/Utilities.js\");\n\nvar _projects = __webpack_require__(/*! ../store/modules/projects */ \"./src/store/modules/projects.js\");\n\nvar ProjectModule = _interopRequireWildcard(_projects);\n\nvar _angularUiRouter = __webpack_require__(/*! angular-ui-router */ \"./node_modules/angular-ui-router/lib/index.js\");\n\nvar _angularUiRouter2 = _interopRequireDefault(_angularUiRouter);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step(\"next\", value); }, function (err) { step(\"throw\", err); }); } } return step(\"next\"); }); }; }\n/* global define Promise, $compileProvider */\n\nvar moduleName = 'landing';\nvar su = new _Utilities.StaticUtilities('LandingPage');\n\nfunction config($stateProvider, $compileProvider) {\n    var _this = this;\n\n    $stateProvider.state(moduleName, {\n        url: '/landing',\n        parent: 'base',\n        views: {\n            main: {\n                template: '<landing-page></landing-page>'\n            }\n        },\n        resolve: {\n            main: function main() {\n                return su.lazyLoader($compileProvider, 'landingPageComponent');\n            },\n            data: ['$ngRedux', function () {\n                var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee($ngRedux) {\n                    return regeneratorRuntime.wrap(function _callee$(_context) {\n                        while (1) {\n                            switch (_context.prev = _context.next) {\n                                case 0:\n                                    return _context.abrupt('return', $ngRedux.dispatch(ProjectModule.loadUserProjects()));\n\n                                case 1:\n                                case 'end':\n                                    return _context.stop();\n                            }\n                        }\n                    }, _callee, _this);\n                }));\n\n                return function (_x) {\n                    return _ref.apply(this, arguments);\n                };\n            }()]\n        }\n    }).state('landing-logged', {\n        url: '/landing',\n        parent: 'app',\n        views: {\n            main: {\n                template: '<landing-page></landing-page>'\n            }\n        },\n        resolve: {\n            main: function main() {\n                return su.lazyLoader($compileProvider, 'landingPageComponent');\n            },\n            data: ['$ngRedux', function () {\n                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2($ngRedux) {\n                    return regeneratorRuntime.wrap(function _callee2$(_context2) {\n                        while (1) {\n                            switch (_context2.prev = _context2.next) {\n                                case 0:\n                                    return _context2.abrupt('return', $ngRedux.dispatch(ProjectModule.loadUserProjects()));\n\n                                case 1:\n                                case 'end':\n                                    return _context2.stop();\n                            }\n                        }\n                    }, _callee2, _this);\n                }));\n\n                return function (_x2) {\n                    return _ref2.apply(this, arguments);\n                };\n            }()]\n        }\n    });\n}\n\nconfig.$inject = ['$stateProvider', '$compileProvider'];\n\n_angular2.default.module(moduleName, [_angularUiRouter2.default]).config(config);\n\nexports.default = moduleName;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTGFuZGluZ1BhZ2UvbGFuZGluZ1BhZ2VNb2R1bGUuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL0xhbmRpbmdQYWdlL2xhbmRpbmdQYWdlTW9kdWxlLmpzPzg4MzciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFuZ3VsYXIgZnJvbSAnYW5ndWxhcic7XG5pbXBvcnQgeyBTdGF0aWNVdGlsaXRpZXMgfSBmcm9tICcuLi9VdGlsaXRpZXMnO1xuaW1wb3J0ICogYXMgUHJvamVjdE1vZHVsZSBmcm9tICcuLi9zdG9yZS9tb2R1bGVzL3Byb2plY3RzJztcbi8qIGdsb2JhbCBkZWZpbmUgUHJvbWlzZSwgJGNvbXBpbGVQcm92aWRlciAqL1xuXG5pbXBvcnQgdWlSb3V0ZSBmcm9tICdhbmd1bGFyLXVpLXJvdXRlcic7XG5cbmNvbnN0IG1vZHVsZU5hbWUgPSAnbGFuZGluZyc7XG5jb25zdCBzdSA9IG5ldyBTdGF0aWNVdGlsaXRpZXMoJ0xhbmRpbmdQYWdlJyk7XG5cbmZ1bmN0aW9uIGNvbmZpZygkc3RhdGVQcm92aWRlciwgJGNvbXBpbGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAuc3RhdGUobW9kdWxlTmFtZSwge1xuICAgICAgICAgIHVybDogJy9sYW5kaW5nJyxcbiAgICAgICAgICBwYXJlbnQ6ICdiYXNlJyxcbiAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICBtYWluOiB7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxsYW5kaW5nLXBhZ2U+PC9sYW5kaW5nLXBhZ2U+J1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgIG1haW46ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBzdS5sYXp5TG9hZGVyKCRjb21waWxlUHJvdmlkZXIsICdsYW5kaW5nUGFnZUNvbXBvbmVudCcpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBkYXRhOiBbJyRuZ1JlZHV4JywgYXN5bmMgKCRuZ1JlZHV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJG5nUmVkdXguZGlzcGF0Y2goUHJvamVjdE1vZHVsZS5sb2FkVXNlclByb2plY3RzKCkpO1xuICAgICAgICAgICAgICB9XVxuICAgICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2xhbmRpbmctbG9nZ2VkJywge1xuICAgICAgICAgIHVybDogJy9sYW5kaW5nJyxcbiAgICAgICAgICBwYXJlbnQ6ICdhcHAnLFxuICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgIG1haW46IHtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGxhbmRpbmctcGFnZT48L2xhbmRpbmctcGFnZT4nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgbWFpbjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1LmxhenlMb2FkZXIoJGNvbXBpbGVQcm92aWRlciwgJ2xhbmRpbmdQYWdlQ29tcG9uZW50Jyk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGRhdGE6IFsnJG5nUmVkdXgnLCBhc3luYyAoJG5nUmVkdXgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAkbmdSZWR1eC5kaXNwYXRjaChQcm9qZWN0TW9kdWxlLmxvYWRVc2VyUHJvamVjdHMoKSk7XG4gICAgICAgICAgICAgIH1dXG4gICAgICAgICAgfVxuICAgICAgfSk7XG59XG5cbmNvbmZpZy4kaW5qZWN0ID0gWyckc3RhdGVQcm92aWRlcicsICckY29tcGlsZVByb3ZpZGVyJ107XG5cblxuYW5ndWxhci5tb2R1bGUobW9kdWxlTmFtZSwgW3VpUm91dGVdKS5jb25maWcoY29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgbW9kdWxlTmFtZTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBRUE7QUFDQTs7Ozs7Ozs7QUFIQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFEQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQUE7QUFBQTtBQUpBO0FBUkE7QUFrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUFBO0FBQUE7QUFKQTtBQVJBO0FBaUJBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/LandingPage/landingPageModule.js\n");

/***/ })

}]);