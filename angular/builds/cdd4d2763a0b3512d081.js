(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[197],{

/***/ "./node_modules/css-loader/lib/url/escape.js":
/*!***************************************************!*\
  !*** ./node_modules/css-loader/lib/url/escape.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function escape(url) {\n    if (typeof url !== 'string') {\n        return url\n    }\n    // If url is already wrapped in quotes, remove them\n    if (/^['\"].*['\"]$/.test(url)) {\n        url = url.slice(1, -1);\n    }\n    // Should url be wrapped?\n    // See https://drafts.csswg.org/css-values-3/#urls\n    if (/[\"'() \\t\\n]/.test(url)) {\n        return '\"' + url.replace(/\"/g, '\\\\\"').replace(/\\n/g, '\\\\n') + '\"'\n    }\n\n    return url\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvdXJsL2VzY2FwZS5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi91cmwvZXNjYXBlLmpzP2IwNDEiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlc2NhcGUodXJsKSB7XG4gICAgaWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB1cmxcbiAgICB9XG4gICAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gICAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gICAgfVxuICAgIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuICAgIGlmICgvW1wiJygpIFxcdFxcbl0vLnRlc3QodXJsKSkge1xuICAgICAgICByZXR1cm4gJ1wiJyArIHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csICdcXFxcbicpICsgJ1wiJ1xuICAgIH1cblxuICAgIHJldHVybiB1cmxcbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/css-loader/lib/url/escape.js\n");

/***/ }),

/***/ "./src/Common/TermsOfUse/TermsOfUseController.js":
/*!*******************************************************!*\
  !*** ./src/Common/TermsOfUse/TermsOfUseController.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Utilities = __webpack_require__(/*! ../../Utilities */ \"./src/Utilities.js\");\n\nvar _countries = __webpack_require__(/*! ../../store/modules/countries */ \"./src/store/modules/countries.js\");\n\nvar CountriesModule = _interopRequireWildcard(_countries);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar TermOfUseController = function () {\n    function TermOfUseController($scope, $window, $ngRedux) {\n        _classCallCheck(this, TermOfUseController);\n\n        this.EE = window.EE;\n        this.scope = $scope;\n        this.window = $window;\n        this.$onInit = this.onInit.bind(this);\n        this.$onDestroy = this.onDestroy.bind(this);\n        this.$onDestroy = this.onDestroy.bind(this);\n        this.unsubscribe = $ngRedux.connect(this.mapState, CountriesModule)(this);\n    }\n\n    _createClass(TermOfUseController, [{\n        key: 'mapState',\n        value: function mapState(state) {\n            var countryData = CountriesModule.getCountryCoverPage(state);\n            var showFooter = countryData.footer_text && countryData.footer_title;\n            return {\n                countryData: countryData,\n                countryCover: CountriesModule.getCountryCoverPicture(state),\n                showFooter: showFooter\n            };\n        }\n    }, {\n        key: 'onInit',\n        value: function onInit() {\n            var subDomain = (0, _Utilities.getSubDomain)();\n            this.setCurrentCountryFromCode(subDomain);\n            this.menuEntry = ['contact', 'terms of use'];\n            this.currentSection = 'terms of use';\n            this.style = {\n                height: (0, _Utilities.calculateHeight)()\n            };\n        }\n    }, {\n        key: 'onDestroy',\n        value: function onDestroy() {\n            this.unsubscribe();\n        }\n    }, {\n        key: 'goBack',\n        value: function goBack() {\n            this.window.history.back();\n        }\n    }, {\n        key: 'onDestroy',\n        value: function onDestroy() {}\n    }, {\n        key: 'openSection',\n        value: function openSection(section) {\n            this.currentSection = section;\n        }\n    }], [{\n        key: 'termOfUseFactory',\n        value: function termOfUseFactory() {\n            __webpack_require__(/*! ./TermsOfUse.scss */ \"./src/Common/TermsOfUse/TermsOfUse.scss\");\n\n            function termOfUseController($scope, $window, $ngRedux) {\n                return new TermOfUseController($scope, $window, $ngRedux);\n            }\n\n            termOfUseController.$inject = ['$scope', '$window', '$ngRedux'];\n\n            return termOfUseController;\n        }\n    }]);\n\n    return TermOfUseController;\n}();\n\nexports.default = TermOfUseController;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1Rlcm1zT2ZVc2UvVGVybXNPZlVzZUNvbnRyb2xsZXIuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL0NvbW1vbi9UZXJtc09mVXNlL1Rlcm1zT2ZVc2VDb250cm9sbGVyLmpzPzMzOTYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2FsY3VsYXRlSGVpZ2h0LCBnZXRTdWJEb21haW4gfSBmcm9tICcuLi8uLi9VdGlsaXRpZXMnO1xuaW1wb3J0ICogYXMgQ291bnRyaWVzTW9kdWxlIGZyb20gJy4uLy4uL3N0b3JlL21vZHVsZXMvY291bnRyaWVzJztcblxuY2xhc3MgVGVybU9mVXNlQ29udHJvbGxlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcigkc2NvcGUsICR3aW5kb3csICRuZ1JlZHV4KSB7XG4gICAgICAgIHRoaXMuRUUgPSB3aW5kb3cuRUU7XG4gICAgICAgIHRoaXMuc2NvcGUgPSAkc2NvcGU7XG4gICAgICAgIHRoaXMud2luZG93ID0gJHdpbmRvdztcbiAgICAgICAgdGhpcy4kb25Jbml0ID0gdGhpcy5vbkluaXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gdGhpcy5vbkRlc3Ryb3kuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gdGhpcy5vbkRlc3Ryb3kuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSA9ICRuZ1JlZHV4LmNvbm5lY3QodGhpcy5tYXBTdGF0ZSwgQ291bnRyaWVzTW9kdWxlKSh0aGlzKTtcbiAgICB9XG5cbiAgICBtYXBTdGF0ZShzdGF0ZSkge1xuICAgICAgICBjb25zdCBjb3VudHJ5RGF0YSA9IENvdW50cmllc01vZHVsZS5nZXRDb3VudHJ5Q292ZXJQYWdlKHN0YXRlKTtcbiAgICAgICAgY29uc3Qgc2hvd0Zvb3RlciA9IGNvdW50cnlEYXRhLmZvb3Rlcl90ZXh0ICYmIGNvdW50cnlEYXRhLmZvb3Rlcl90aXRsZTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvdW50cnlEYXRhLFxuICAgICAgICAgICAgY291bnRyeUNvdmVyOiBDb3VudHJpZXNNb2R1bGUuZ2V0Q291bnRyeUNvdmVyUGljdHVyZShzdGF0ZSksXG4gICAgICAgICAgICBzaG93Rm9vdGVyXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb25Jbml0KCkge1xuICAgICAgICBjb25zdCBzdWJEb21haW4gPSBnZXRTdWJEb21haW4oKTtcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50Q291bnRyeUZyb21Db2RlKHN1YkRvbWFpbik7XG4gICAgICAgIHRoaXMubWVudUVudHJ5ID0gWydjb250YWN0JywgJ3Rlcm1zIG9mIHVzZSddO1xuICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gJ3Rlcm1zIG9mIHVzZSc7XG4gICAgICAgIHRoaXMuc3R5bGUgPSB7XG4gICAgICAgICAgICBoZWlnaHQ6IGNhbGN1bGF0ZUhlaWdodCgpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgZ29CYWNrKCkge1xuICAgICAgICB0aGlzLndpbmRvdy5oaXN0b3J5LmJhY2soKTtcbiAgICB9XG5cbiAgICBvbkRlc3Ryb3koKSB7XG4gICAgfVxuXG4gICAgb3BlblNlY3Rpb24oc2VjdGlvbikge1xuICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gc2VjdGlvbjtcbiAgICB9XG5cbiAgICBzdGF0aWMgdGVybU9mVXNlRmFjdG9yeSgpIHtcbiAgICAgICAgcmVxdWlyZSgnLi9UZXJtc09mVXNlLnNjc3MnKTtcblxuICAgICAgICBmdW5jdGlvbiB0ZXJtT2ZVc2VDb250cm9sbGVyKCRzY29wZSwgJHdpbmRvdywgJG5nUmVkdXgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVGVybU9mVXNlQ29udHJvbGxlcigkc2NvcGUsICR3aW5kb3csICRuZ1JlZHV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRlcm1PZlVzZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyR3aW5kb3cnLCAnJG5nUmVkdXgnXTtcblxuICAgICAgICByZXR1cm4gdGVybU9mVXNlQ29udHJvbGxlcjtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGVybU9mVXNlQ29udHJvbGxlcjtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7Ozs7O0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBOzs7QUFFQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTs7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBSUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/TermsOfUse/TermsOfUseController.js\n");

/***/ })

}]);