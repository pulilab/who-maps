(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[627],{

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/CountryTopBar/countryTopBar.scss":
/*!**********************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js!./src/Common/CountryTopBar/countryTopBar.scss ***!
  \**********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: No PostCSS Config found in: /Users/nico/Projects/who-maps/frontend/src/Common/CountryTopBar\\n    at /Users/nico/Projects/who-maps/frontend/node_modules/postcss-load-config/index.js:51:26\\n    at <anonymous>\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3NyYy9Db21tb24vQ291bnRyeVRvcEJhci9jb3VudHJ5VG9wQmFyLnNjc3MuanMiLCJzb3VyY2VzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/CountryTopBar/countryTopBar.scss\n");

/***/ }),

/***/ "./src/Common/CountryTopBar/CountryTopBarController.js":
/*!*************************************************************!*\
  !*** ./src/Common/CountryTopBar/CountryTopBarController.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _TopBarBheaviour = __webpack_require__(/*! ../TopBarBheaviour */ \"./src/Common/TopBarBheaviour.js\");\n\nvar _TopBarBheaviour2 = _interopRequireDefault(_TopBarBheaviour);\n\nvar _countries = __webpack_require__(/*! ../../store/modules/countries */ \"./src/store/modules/countries.js\");\n\nvar CountryModule = _interopRequireWildcard(_countries);\n\nvar _user = __webpack_require__(/*! ../../store/modules/user */ \"./src/store/modules/user.js\");\n\nvar UserModule = _interopRequireWildcard(_user);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar CountryTopBarController = function (_TopBarBehaviour) {\n    _inherits(CountryTopBarController, _TopBarBehaviour);\n\n    function CountryTopBarController($state, $scope, $timeout, $ngRedux) {\n        _classCallCheck(this, CountryTopBarController);\n\n        var _this = _possibleConstructorReturn(this, (CountryTopBarController.__proto__ || Object.getPrototypeOf(CountryTopBarController)).call(this, $state, $scope, $ngRedux));\n\n        _this.EE = window.EE;\n        _this.timeout = $timeout;\n        _this.$onInit = _this.onInit.bind(_this);\n        _this.mapCountryState = _this.mapCountryState.bind(_this);\n        return _this;\n    }\n\n    _createClass(CountryTopBarController, [{\n        key: 'mapCountryState',\n        value: function mapCountryState(state) {\n            var countryData = CountryModule.getCountryCoverPage(state);\n            var showCountryNameAndFlag = countryData && countryData.name && countryData.name !== 'WHO';\n            return _extends({}, this.mapState(state), {\n                countryData: countryData,\n                countryFlag: CountryModule.getCurrentCountry(state).flag,\n                pageLoaded: !!countryData.name,\n                showCountryNameAndFlag: showCountryNameAndFlag,\n                logoClass: showCountryNameAndFlag ? 'has-country-logo' : ''\n            });\n        }\n    }, {\n        key: 'onInit',\n        value: function onInit() {\n            this.pageLoaded = false;\n            this.watchers();\n            this.commonInit();\n\n            window.onscroll = this.scrollEventHandler.bind(this);\n            document.addEventListener('scroll', this.scrollEventHandler.bind(this), true);\n\n            this.unsubscribe = this.$ngRedux.connect(this.mapCountryState, UserModule)(this);\n        }\n    }, {\n        key: 'onDestroy',\n        value: function onDestroy() {\n            this.unsubscribe();\n            this.commonOnDestroy();\n        }\n    }, {\n        key: 'watchers',\n        value: function watchers() {\n            var _this2 = this;\n\n            var self = this;\n            this.scope.$watch(function () {\n                return _this2.state.current.name;\n            }, function (stateName) {\n                stateName = stateName.replace(/ /g, '-');\n                self.pageClass = 'page-' + stateName;\n            });\n        }\n    }, {\n        key: 'scrollEventHandler',\n        value: function scrollEventHandler(e) {\n            var vm = this;\n            vm.timeout(function () {\n                vm.isScrolled = e.target.scrollTop > 100 ? 'scrolled-down' : 'not-scrolled';\n            });\n        }\n    }], [{\n        key: 'countryTopBarControllerFactory',\n        value: function countryTopBarControllerFactory() {\n            __webpack_require__(/*! ./countryTopBar.scss */ \"./src/Common/CountryTopBar/countryTopBar.scss\");\n\n            function countryTopBarController($state, $scope, $timeout, $ngRedux) {\n                return new CountryTopBarController($state, $scope, $timeout, $ngRedux);\n            }\n\n            countryTopBarController.$inject = ['$state', '$scope', '$timeout', '$ngRedux'];\n\n            return countryTopBarController;\n        }\n    }]);\n\n    return CountryTopBarController;\n}(_TopBarBheaviour2.default);\n\nexports.default = CountryTopBarController;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0NvdW50cnlUb3BCYXIvQ291bnRyeVRvcEJhckNvbnRyb2xsZXIuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL0NvbW1vbi9Db3VudHJ5VG9wQmFyL0NvdW50cnlUb3BCYXJDb250cm9sbGVyLmpzPzc0YTQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRvcEJhckJlaGF2aW91ciBmcm9tICcuLi9Ub3BCYXJCaGVhdmlvdXInO1xuaW1wb3J0ICogYXMgQ291bnRyeU1vZHVsZSBmcm9tICcuLi8uLi9zdG9yZS9tb2R1bGVzL2NvdW50cmllcyc7XG5pbXBvcnQgKiBhcyBVc2VyTW9kdWxlIGZyb20gJy4uLy4uL3N0b3JlL21vZHVsZXMvdXNlcic7XG5cbmNsYXNzIENvdW50cnlUb3BCYXJDb250cm9sbGVyIGV4dGVuZHMgVG9wQmFyQmVoYXZpb3VyIHtcblxuICAgIGNvbnN0cnVjdG9yKCRzdGF0ZSwgJHNjb3BlLCAkdGltZW91dCwgJG5nUmVkdXgpIHtcbiAgICAgICAgc3VwZXIoJHN0YXRlLCAkc2NvcGUsICRuZ1JlZHV4KTtcbiAgICAgICAgdGhpcy5FRSA9IHdpbmRvdy5FRTtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gJHRpbWVvdXQ7XG4gICAgICAgIHRoaXMuJG9uSW5pdCA9IHRoaXMub25Jbml0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMubWFwQ291bnRyeVN0YXRlID0gdGhpcy5tYXBDb3VudHJ5U3RhdGUuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBtYXBDb3VudHJ5U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgY29uc3QgY291bnRyeURhdGEgPSBDb3VudHJ5TW9kdWxlLmdldENvdW50cnlDb3ZlclBhZ2Uoc3RhdGUpO1xuICAgICAgICBjb25zdCBzaG93Q291bnRyeU5hbWVBbmRGbGFnID0gY291bnRyeURhdGEgJiYgY291bnRyeURhdGEubmFtZSAmJiBjb3VudHJ5RGF0YS5uYW1lICE9PSAnV0hPJztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnRoaXMubWFwU3RhdGUoc3RhdGUpLFxuICAgICAgICAgICAgY291bnRyeURhdGEsXG4gICAgICAgICAgICBjb3VudHJ5RmxhZzogQ291bnRyeU1vZHVsZS5nZXRDdXJyZW50Q291bnRyeShzdGF0ZSkuZmxhZyxcbiAgICAgICAgICAgIHBhZ2VMb2FkZWQ6ICEhY291bnRyeURhdGEubmFtZSxcbiAgICAgICAgICAgIHNob3dDb3VudHJ5TmFtZUFuZEZsYWcsXG4gICAgICAgICAgICBsb2dvQ2xhc3M6IHNob3dDb3VudHJ5TmFtZUFuZEZsYWcgPyAnaGFzLWNvdW50cnktbG9nbycgOiAnJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIG9uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYWdlTG9hZGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMud2F0Y2hlcnMoKTtcbiAgICAgICAgdGhpcy5jb21tb25Jbml0KCk7XG5cbiAgICAgICAgd2luZG93Lm9uc2Nyb2xsID0gdGhpcy5zY3JvbGxFdmVudEhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5zY3JvbGxFdmVudEhhbmRsZXIuYmluZCh0aGlzKSwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSA9IHRoaXMuJG5nUmVkdXguY29ubmVjdCh0aGlzLm1hcENvdW50cnlTdGF0ZSwgVXNlck1vZHVsZSkodGhpcyk7XG4gICAgfVxuXG4gICAgb25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMuY29tbW9uT25EZXN0cm95KCk7XG4gICAgfVxuXG4gICAgd2F0Y2hlcnMoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLnNjb3BlLiR3YXRjaCgoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5jdXJyZW50Lm5hbWU7XG4gICAgICAgIH0sIHN0YXRlTmFtZSA9PiB7XG4gICAgICAgICAgICBzdGF0ZU5hbWUgPSBzdGF0ZU5hbWUucmVwbGFjZSgvIC9nLCAnLScpO1xuICAgICAgICAgICAgc2VsZi5wYWdlQ2xhc3MgPSBgcGFnZS0ke3N0YXRlTmFtZX1gO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzY3JvbGxFdmVudEhhbmRsZXIoZSkge1xuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XG4gICAgICAgIHZtLnRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdm0uaXNTY3JvbGxlZCA9IGUudGFyZ2V0LnNjcm9sbFRvcCA+IDEwMCA/ICdzY3JvbGxlZC1kb3duJyA6ICdub3Qtc2Nyb2xsZWQnO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIHN0YXRpYyBjb3VudHJ5VG9wQmFyQ29udHJvbGxlckZhY3RvcnkoKSB7XG4gICAgICAgIHJlcXVpcmUoJy4vY291bnRyeVRvcEJhci5zY3NzJyk7XG5cbiAgICAgICAgZnVuY3Rpb24gY291bnRyeVRvcEJhckNvbnRyb2xsZXIoJHN0YXRlLCAkc2NvcGUsICR0aW1lb3V0LCAkbmdSZWR1eCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb3VudHJ5VG9wQmFyQ29udHJvbGxlcigkc3RhdGUsICRzY29wZSwgJHRpbWVvdXQsICRuZ1JlZHV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvdW50cnlUb3BCYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzdGF0ZScsICckc2NvcGUnLCAnJHRpbWVvdXQnLCAnJG5nUmVkdXgnXTtcblxuICAgICAgICByZXR1cm4gY291bnRyeVRvcEJhckNvbnRyb2xsZXI7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvdW50cnlUb3BCYXJDb250cm9sbGVyO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTs7Ozs7Ozs7Ozs7QUFDQTs7O0FBRUE7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFNQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVFBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQW5FQTtBQUNBO0FBc0VBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Common/CountryTopBar/CountryTopBarController.js\n");

/***/ }),

/***/ "./src/Common/CountryTopBar/countryTopBar.scss":
/*!*****************************************************!*\
  !*** ./src/Common/CountryTopBar/countryTopBar.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/postcss-loader/lib!../../../node_modules/sass-loader/lib/loader.js!./countryTopBar.scss */ \"./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/CountryTopBar/countryTopBar.scss\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0NvdW50cnlUb3BCYXIvY291bnRyeVRvcEJhci5zY3NzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9Db3VudHJ5VG9wQmFyL2NvdW50cnlUb3BCYXIuc2Nzcz9jODExIl0sInNvdXJjZXNDb250ZW50IjpbIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vY291bnRyeVRvcEJhci5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vY291bnRyeVRvcEJhci5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL2NvdW50cnlUb3BCYXIuc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/Common/CountryTopBar/countryTopBar.scss\n");

/***/ }),

/***/ "./src/Common/TopBarBheaviour.js":
/*!***************************************!*\
  !*** ./src/Common/TopBarBheaviour.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _user = __webpack_require__(/*! ../store/modules/user */ \"./src/store/modules/user.js\");\n\nvar UserModule = _interopRequireWildcard(_user);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step(\"next\", value); }, function (err) { step(\"throw\", err); }); } } return step(\"next\"); }); }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar TopBar = function () {\n    function TopBar($state, $scope, $ngRedux) {\n        _classCallCheck(this, TopBar);\n\n        this.EE = window.EE;\n        this.state = $state;\n        this.scope = $scope;\n        this.$ngRedux = $ngRedux;\n        this.commonInit = this.commonInit.bind(this);\n        this.commonOnDestroy = this.commonOnDestroy.bind(this);\n    }\n\n    _createClass(TopBar, [{\n        key: 'commonInit',\n        value: function commonInit() {\n            this.writeUserRole = this.writeUserRole.bind(this);\n            this.currentState = this.state.current.name;\n        }\n    }, {\n        key: 'commonOnDestroy',\n        value: function commonOnDestroy() {}\n    }, {\n        key: 'mapState',\n        value: function mapState(state) {\n            var profile = UserModule.getProfile(state);\n            var userLanguage = UserModule.getUserLanguage(state);\n            var profileValid = !!(profile && profile.country && profile.organisation && profile.name);\n            return {\n                profile: profile,\n                profileValid: profileValid,\n                token: state.user.token,\n                userLanguage: userLanguage\n            };\n        }\n    }, {\n        key: 'writeUserRole',\n        value: function writeUserRole() {\n            var type = null;\n            if (this.profile) {\n                switch (this.profile.account_type) {\n                    case 'I':\n                        type = 'Implementer';\n                        break;\n                    case 'G':\n                        type = 'Government';\n                        break;\n                    case 'D':\n                        type = 'Financial Investor';\n                        break;\n                    case 'Y':\n                        type = 'Inventory';\n                        break;\n                }\n            }\n            return type;\n        }\n    }, {\n        key: 'openMenu',\n        value: function openMenu($mdOpenMenu, event) {\n            var leftOver = window.document.querySelector('.md-open-menu-container.md-leave');\n            if (leftOver) {\n                leftOver.style.top = null;\n                leftOver.style.right = null;\n                leftOver.style.left = null;\n                leftOver.style.bottom = null;\n            }\n            $mdOpenMenu(event);\n        }\n    }, {\n        key: 'logout',\n        value: function () {\n            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {\n                return regeneratorRuntime.wrap(function _callee$(_context) {\n                    while (1) {\n                        switch (_context.prev = _context.next) {\n                            case 0:\n                                _context.next = 2;\n                                return this.state.go('landing');\n\n                            case 2:\n                                this.doLogout();\n\n                            case 3:\n                            case 'end':\n                                return _context.stop();\n                        }\n                    }\n                }, _callee, this);\n            }));\n\n            function logout() {\n                return _ref.apply(this, arguments);\n            }\n\n            return logout;\n        }()\n    }]);\n\n    return TopBar;\n}();\n\nexports.default = TopBar;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1RvcEJhckJoZWF2aW91ci5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvQ29tbW9uL1RvcEJhckJoZWF2aW91ci5qcz85ZGQ3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFVzZXJNb2R1bGUgZnJvbSAnLi4vc3RvcmUvbW9kdWxlcy91c2VyJztcblxuY2xhc3MgVG9wQmFyIHtcblxuICAgIGNvbnN0cnVjdG9yKCRzdGF0ZSwgJHNjb3BlLCAkbmdSZWR1eCkge1xuICAgICAgICB0aGlzLkVFID0gd2luZG93LkVFO1xuICAgICAgICB0aGlzLnN0YXRlID0gJHN0YXRlO1xuICAgICAgICB0aGlzLnNjb3BlID0gJHNjb3BlO1xuICAgICAgICB0aGlzLiRuZ1JlZHV4ID0gJG5nUmVkdXg7XG4gICAgICAgIHRoaXMuY29tbW9uSW5pdCA9IHRoaXMuY29tbW9uSW5pdC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmNvbW1vbk9uRGVzdHJveSA9IHRoaXMuY29tbW9uT25EZXN0cm95LmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgY29tbW9uSW5pdCgpIHtcbiAgICAgICAgdGhpcy53cml0ZVVzZXJSb2xlID0gdGhpcy53cml0ZVVzZXJSb2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gdGhpcy5zdGF0ZS5jdXJyZW50Lm5hbWU7XG4gICAgfVxuXG4gICAgY29tbW9uT25EZXN0cm95KCkge31cblxuICAgIG1hcFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIGNvbnN0IHByb2ZpbGUgPSBVc2VyTW9kdWxlLmdldFByb2ZpbGUoc3RhdGUpO1xuICAgICAgICBjb25zdCB1c2VyTGFuZ3VhZ2UgPSBVc2VyTW9kdWxlLmdldFVzZXJMYW5ndWFnZShzdGF0ZSk7XG4gICAgICAgIGNvbnN0IHByb2ZpbGVWYWxpZCA9ICEhKHByb2ZpbGUgJiYgcHJvZmlsZS5jb3VudHJ5ICYmIHByb2ZpbGUub3JnYW5pc2F0aW9uICYmIHByb2ZpbGUubmFtZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcm9maWxlLFxuICAgICAgICAgICAgcHJvZmlsZVZhbGlkLFxuICAgICAgICAgICAgdG9rZW46IHN0YXRlLnVzZXIudG9rZW4sXG4gICAgICAgICAgICB1c2VyTGFuZ3VhZ2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB3cml0ZVVzZXJSb2xlKCkge1xuICAgICAgICBsZXQgdHlwZSA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnByb2ZpbGUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5wcm9maWxlLmFjY291bnRfdHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnSSc6XG4gICAgICAgICAgICAgICAgdHlwZSA9ICdJbXBsZW1lbnRlcic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdHJzpcbiAgICAgICAgICAgICAgICB0eXBlID0gJ0dvdmVybm1lbnQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnRCc6XG4gICAgICAgICAgICAgICAgdHlwZSA9ICdGaW5hbmNpYWwgSW52ZXN0b3InO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnWSc6XG4gICAgICAgICAgICAgICAgdHlwZSA9ICdJbnZlbnRvcnknO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cblxuICAgIG9wZW5NZW51KCRtZE9wZW5NZW51LCBldmVudCkge1xuICAgICAgICBjb25zdCBsZWZ0T3ZlciA9IHdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWQtb3Blbi1tZW51LWNvbnRhaW5lci5tZC1sZWF2ZScpO1xuICAgICAgICBpZiAobGVmdE92ZXIpIHtcbiAgICAgICAgICAgIGxlZnRPdmVyLnN0eWxlLnRvcCA9IG51bGw7XG4gICAgICAgICAgICBsZWZ0T3Zlci5zdHlsZS5yaWdodCA9IG51bGw7XG4gICAgICAgICAgICBsZWZ0T3Zlci5zdHlsZS5sZWZ0ID0gbnVsbDtcbiAgICAgICAgICAgIGxlZnRPdmVyLnN0eWxlLmJvdHRvbSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgJG1kT3Blbk1lbnUoZXZlbnQpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvZ291dCgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5zdGF0ZS5nbygnbGFuZGluZycpO1xuICAgICAgICB0aGlzLmRvTG9nb3V0KCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUb3BCYXI7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQURBO0FBQ0E7Ozs7Ozs7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFaQTtBQWNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUFHQTtBQUNBOztBQUFBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/TopBarBheaviour.js\n");

/***/ })

}]);