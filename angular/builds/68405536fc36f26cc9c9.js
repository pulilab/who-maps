(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[301],{

/***/ "./src/Dashboard/dashboardModule.js":
/*!******************************************!*\
  !*** ./src/Dashboard/dashboardModule.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _angular = __webpack_require__(/*! angular */ \"./node_modules/angular/index.js\");\n\nvar _angular2 = _interopRequireDefault(_angular);\n\nvar _angularUiRouter = __webpack_require__(/*! angular-ui-router */ \"./node_modules/angular-ui-router/lib/index.js\");\n\nvar _angularUiRouter2 = _interopRequireDefault(_angularUiRouter);\n\nvar _Utilities = __webpack_require__(/*! ../Utilities */ \"./src/Utilities.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar moduleName = 'dashboard'; /* global Promise */\n\nvar su = new _Utilities.StaticUtilities('Dashboard');\n\nfunction config($stateProvider, $compileProvider) {\n    $stateProvider.state(moduleName, {\n        url: '/dashboard',\n        parent: 'base',\n        profileRequired: true,\n        views: {\n            main: {\n                template: '<dashboard></dashboard>'\n            }\n        },\n        resolve: {\n            'country': function country() {\n                return su.lazyLoader($compileProvider, 'dashboardComponent');\n            }\n        }\n    });\n}\n\nconfig.$inject = ['$stateProvider', '$compileProvider'];\n\n_angular2.default.module(moduleName, [_angularUiRouter2.default]).config(config);\n\nexports.default = moduleName;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvRGFzaGJvYXJkL2Rhc2hib2FyZE1vZHVsZS5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvRGFzaGJvYXJkL2Rhc2hib2FyZE1vZHVsZS5qcz9mOTI4Il0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCBQcm9taXNlICovXG5pbXBvcnQgYW5ndWxhciBmcm9tICdhbmd1bGFyJztcbmltcG9ydCB1aVJvdXRlIGZyb20gJ2FuZ3VsYXItdWktcm91dGVyJztcbmltcG9ydCB7IFN0YXRpY1V0aWxpdGllcyB9IGZyb20gJy4uL1V0aWxpdGllcyc7XG5cbmNvbnN0IG1vZHVsZU5hbWUgPSAnZGFzaGJvYXJkJztcbmNvbnN0IHN1ID0gbmV3IFN0YXRpY1V0aWxpdGllcygnRGFzaGJvYXJkJyk7XG5cbmZ1bmN0aW9uIGNvbmZpZygkc3RhdGVQcm92aWRlciwgJGNvbXBpbGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAuc3RhdGUobW9kdWxlTmFtZSwge1xuICAgICAgICAgIHVybDogJy9kYXNoYm9hcmQnLFxuICAgICAgICAgIHBhcmVudDogJ2Jhc2UnLFxuICAgICAgICAgIHByb2ZpbGVSZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICBtYWluOiB7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkYXNoYm9hcmQ+PC9kYXNoYm9hcmQ+J1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICdjb3VudHJ5JzogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1LmxhenlMb2FkZXIoJGNvbXBpbGVQcm92aWRlciwgJ2Rhc2hib2FyZENvbXBvbmVudCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfSk7XG59XG5cbmNvbmZpZy4kaW5qZWN0ID0gWyckc3RhdGVQcm92aWRlcicsICckY29tcGlsZVByb3ZpZGVyJ107XG5cbmFuZ3VsYXIubW9kdWxlKG1vZHVsZU5hbWUsIFt1aVJvdXRlXSlcbiAgLmNvbmZpZyhjb25maWcpO1xuXG5leHBvcnQgZGVmYXVsdCBtb2R1bGVOYW1lO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQVRBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Dashboard/dashboardModule.js\n");

/***/ })

}]);