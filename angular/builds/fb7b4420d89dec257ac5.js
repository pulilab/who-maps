(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[620],{

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/Searchbar/Searchbar.scss":
/*!**************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js!./src/Common/Searchbar/Searchbar.scss ***!
  \**************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: `sass-loader` requires `node-sass` >=4. Please install a compatible version.\\n    at Object.sassLoader (/Users/nico/Projects/who-maps/frontend/node_modules/sass-loader/lib/loader.js:31:19)\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3NyYy9Db21tb24vU2VhcmNoYmFyL1NlYXJjaGJhci5zY3NzLmpzIiwic291cmNlcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/Searchbar/Searchbar.scss\n");

/***/ }),

/***/ "./src/Common/Searchbar/Searchbar.html":
/*!*********************************************!*\
  !*** ./src/Common/Searchbar/Searchbar.html ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<md-button ng-if=\\\"vm.compactMode\\\" ng-click=\\\"vm.toggleSearch()\\\" class=\\\"md-icon-button\\\" aria-label=\\\"Search\\\" md-no-ink>\\n    <md-icon class=\\\"material-icons\\\">search</md-icon>\\n</md-button>\\n<div class=\\\"search-project\\\" ng-hide=\\\"vm.compactMode && !vm.showSearch\\\" ng-class=\\\"{'active': vm.showSearch, 'compact': vm.compactMode}\\\">\\n    <md-input-container class=\\\"searchinput md-block\\\">\\n        <md-icon>search</md-icon>\\n        <input\\n            type=\\\"text\\\"\\n            ng-model=\\\"vm.searchStr\\\"\\n            ng-model-options=\\\"{debounce: 500}\\\"\\n            ng-focus=\\\"vm.showSearch = true\\\"\\n            aria-label=\\\"search input field\\\"\\n            placeholder=\\\"{{ 'Type and search projects...' | translate}}\\\">\\n    </md-input-container>\\n\\n    <md-button\\n        ng-click=\\\"vm.close()\\\"\\n        id=\\\"closebtn\\\"\\n        class=\\\"md-icon-button md-gray md-no-ink\\\">\\n        <md-icon>close</md-icon>\\n    </md-button>\\n\\n    <md-card\\n        layout=\\\"column\\\"\\n        class=\\\"searchcard md-whiteframe-24dp\\\"\\n        ng-if=\\\"vm.showSearch\\\">\\n\\n        <div class=\\\"md-block filters\\\">\\n          <md-subheader class=\\\"md-no-sticky\\\">\\n            <translate>Set filters:</translate>\\n          </md-subheader>\\n\\n          <div>\\n              <div layout=\\\"row\\\" layout-wrap flex>\\n                  <div ng-repeat=\\\"filter in vm.filters\\\" flex=\\\"33\\\">\\n                      <md-checkbox class=\\\"md-primary small\\\" ng-model=\\\"filter.value\\\" ng-change=\\\"vm.checkboxChecks(filter)\\\">\\n                          {{filter.displayName}}\\n                      </md-checkbox>\\n                  </div>\\n              </div>\\n          </div>\\n        </div>\\n\\n        <div class=\\\"md-block results\\\" ng-show=\\\"vm.projects && vm.projects.length > 0\\\">\\n          <md-subheader class=\\\"md-no-sticky\\\">\\n            <translate>\\n              Results ({{vm.resultNr}} out of {{vm.totalNr}}):\\n            </translate>\\n          </md-subheader>\\n\\n          <project-component\\n              ng-repeat=\\\"project in vm.projects | limitTo: 5\\\"\\n              project=\\\"project\\\"\\n              show-version=\\\"false\\\">\\n          </project-component>\\n        </div>\\n    </md-card>\\n</div>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1NlYXJjaGJhci9TZWFyY2hiYXIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Db21tb24vU2VhcmNoYmFyL1NlYXJjaGJhci5odG1sP2E3MjIiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxtZC1idXR0b24gbmctaWY9XFxcInZtLmNvbXBhY3RNb2RlXFxcIiBuZy1jbGljaz1cXFwidm0udG9nZ2xlU2VhcmNoKClcXFwiIGNsYXNzPVxcXCJtZC1pY29uLWJ1dHRvblxcXCIgYXJpYS1sYWJlbD1cXFwiU2VhcmNoXFxcIiBtZC1uby1pbms+XFxuICAgIDxtZC1pY29uIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+c2VhcmNoPC9tZC1pY29uPlxcbjwvbWQtYnV0dG9uPlxcbjxkaXYgY2xhc3M9XFxcInNlYXJjaC1wcm9qZWN0XFxcIiBuZy1oaWRlPVxcXCJ2bS5jb21wYWN0TW9kZSAmJiAhdm0uc2hvd1NlYXJjaFxcXCIgbmctY2xhc3M9XFxcInsnYWN0aXZlJzogdm0uc2hvd1NlYXJjaCwgJ2NvbXBhY3QnOiB2bS5jb21wYWN0TW9kZX1cXFwiPlxcbiAgICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVxcXCJzZWFyY2hpbnB1dCBtZC1ibG9ja1xcXCI+XFxuICAgICAgICA8bWQtaWNvbj5zZWFyY2g8L21kLWljb24+XFxuICAgICAgICA8aW5wdXRcXG4gICAgICAgICAgICB0eXBlPVxcXCJ0ZXh0XFxcIlxcbiAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJ2bS5zZWFyY2hTdHJcXFwiXFxuICAgICAgICAgICAgbmctbW9kZWwtb3B0aW9ucz1cXFwie2RlYm91bmNlOiA1MDB9XFxcIlxcbiAgICAgICAgICAgIG5nLWZvY3VzPVxcXCJ2bS5zaG93U2VhcmNoID0gdHJ1ZVxcXCJcXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVxcXCJzZWFyY2ggaW5wdXQgZmllbGRcXFwiXFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcInt7ICdUeXBlIGFuZCBzZWFyY2ggcHJvamVjdHMuLi4nIHwgdHJhbnNsYXRlfX1cXFwiPlxcbiAgICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG5cXG4gICAgPG1kLWJ1dHRvblxcbiAgICAgICAgbmctY2xpY2s9XFxcInZtLmNsb3NlKClcXFwiXFxuICAgICAgICBpZD1cXFwiY2xvc2VidG5cXFwiXFxuICAgICAgICBjbGFzcz1cXFwibWQtaWNvbi1idXR0b24gbWQtZ3JheSBtZC1uby1pbmtcXFwiPlxcbiAgICAgICAgPG1kLWljb24+Y2xvc2U8L21kLWljb24+XFxuICAgIDwvbWQtYnV0dG9uPlxcblxcbiAgICA8bWQtY2FyZFxcbiAgICAgICAgbGF5b3V0PVxcXCJjb2x1bW5cXFwiXFxuICAgICAgICBjbGFzcz1cXFwic2VhcmNoY2FyZCBtZC13aGl0ZWZyYW1lLTI0ZHBcXFwiXFxuICAgICAgICBuZy1pZj1cXFwidm0uc2hvd1NlYXJjaFxcXCI+XFxuXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZC1ibG9jayBmaWx0ZXJzXFxcIj5cXG4gICAgICAgICAgPG1kLXN1YmhlYWRlciBjbGFzcz1cXFwibWQtbm8tc3RpY2t5XFxcIj5cXG4gICAgICAgICAgICA8dHJhbnNsYXRlPlNldCBmaWx0ZXJzOjwvdHJhbnNsYXRlPlxcbiAgICAgICAgICA8L21kLXN1YmhlYWRlcj5cXG5cXG4gICAgICAgICAgPGRpdj5cXG4gICAgICAgICAgICAgIDxkaXYgbGF5b3V0PVxcXCJyb3dcXFwiIGxheW91dC13cmFwIGZsZXg+XFxuICAgICAgICAgICAgICAgICAgPGRpdiBuZy1yZXBlYXQ9XFxcImZpbHRlciBpbiB2bS5maWx0ZXJzXFxcIiBmbGV4PVxcXCIzM1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgIDxtZC1jaGVja2JveCBjbGFzcz1cXFwibWQtcHJpbWFyeSBzbWFsbFxcXCIgbmctbW9kZWw9XFxcImZpbHRlci52YWx1ZVxcXCIgbmctY2hhbmdlPVxcXCJ2bS5jaGVja2JveENoZWNrcyhmaWx0ZXIpXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt7ZmlsdGVyLmRpc3BsYXlOYW1lfX1cXG4gICAgICAgICAgICAgICAgICAgICAgPC9tZC1jaGVja2JveD5cXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWQtYmxvY2sgcmVzdWx0c1xcXCIgbmctc2hvdz1cXFwidm0ucHJvamVjdHMgJiYgdm0ucHJvamVjdHMubGVuZ3RoID4gMFxcXCI+XFxuICAgICAgICAgIDxtZC1zdWJoZWFkZXIgY2xhc3M9XFxcIm1kLW5vLXN0aWNreVxcXCI+XFxuICAgICAgICAgICAgPHRyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgIFJlc3VsdHMgKHt7dm0ucmVzdWx0TnJ9fSBvdXQgb2Yge3t2bS50b3RhbE5yfX0pOlxcbiAgICAgICAgICAgIDwvdHJhbnNsYXRlPlxcbiAgICAgICAgICA8L21kLXN1YmhlYWRlcj5cXG5cXG4gICAgICAgICAgPHByb2plY3QtY29tcG9uZW50XFxuICAgICAgICAgICAgICBuZy1yZXBlYXQ9XFxcInByb2plY3QgaW4gdm0ucHJvamVjdHMgfCBsaW1pdFRvOiA1XFxcIlxcbiAgICAgICAgICAgICAgcHJvamVjdD1cXFwicHJvamVjdFxcXCJcXG4gICAgICAgICAgICAgIHNob3ctdmVyc2lvbj1cXFwiZmFsc2VcXFwiPlxcbiAgICAgICAgICA8L3Byb2plY3QtY29tcG9uZW50PlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvbWQtY2FyZD5cXG48L2Rpdj5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Common/Searchbar/Searchbar.html\n");

/***/ }),

/***/ "./src/Common/Searchbar/Searchbar.scss":
/*!*********************************************!*\
  !*** ./src/Common/Searchbar/Searchbar.scss ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/postcss-loader/lib!../../../node_modules/sass-loader/lib/loader.js!./Searchbar.scss */ \"./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/Searchbar/Searchbar.scss\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1NlYXJjaGJhci9TZWFyY2hiYXIuc2Nzcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Db21tb24vU2VhcmNoYmFyL1NlYXJjaGJhci5zY3NzPzM3MDgiXSwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9TZWFyY2hiYXIuc2Nzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL1NlYXJjaGJhci5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL1NlYXJjaGJhci5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Common/Searchbar/Searchbar.scss\n");

/***/ }),

/***/ "./src/Common/Searchbar/SearchbarController.js":
/*!*****************************************************!*\
  !*** ./src/Common/Searchbar/SearchbarController.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _min = __webpack_require__(/*! lodash/min */ \"./node_modules/lodash/min.js\");\n\nvar _min2 = _interopRequireDefault(_min);\n\nvar _map = __webpack_require__(/*! lodash/map */ \"./node_modules/lodash/map.js\");\n\nvar _map2 = _interopRequireDefault(_map);\n\nvar _every = __webpack_require__(/*! lodash/every */ \"./node_modules/lodash/every.js\");\n\nvar _every2 = _interopRequireDefault(_every);\n\nvar _system = __webpack_require__(/*! ../../store/modules/system */ \"./src/store/modules/system.js\");\n\nvar SystemModule = _interopRequireWildcard(_system);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step(\"next\", value); }, function (err) { step(\"throw\", err); }); } } return step(\"next\"); }); }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar SearchbarController = function () {\n    function SearchbarController($state, $scope, $ngRedux) {\n        _classCallCheck(this, SearchbarController);\n\n        this.EE = window.EE;\n        this.scope = $scope;\n        this.state = $state;\n        this.$onInit = this.onInit.bind(this);\n        this.$onDestroy = this.onDestroy.bind(this);\n        this.mapState = this.mapState.bind(this);\n        this.unsubscribe = $ngRedux.connect(this.mapState, SystemModule)(this);\n    }\n\n    _createClass(SearchbarController, [{\n        key: 'mapState',\n        value: function mapState(state) {\n            return {\n                projects: SystemModule.getSearchResult(state),\n                filters: SystemModule.getSearchFilters(state)\n            };\n        }\n    }, {\n        key: 'onInit',\n        value: function onInit() {\n            var _this = this;\n\n            this.showSearch = false;\n            this.searchStr = '';\n            this.resultNr = 0;\n            this.scope.$watch(function () {\n                return _this.searchStr;\n            }, function (tmpStr) {\n                _this.search(tmpStr);\n            });\n        }\n    }, {\n        key: 'onDestroy',\n        value: function onDestroy() {\n            this.unsetSearchedProjects();\n            this.unsubscribe();\n        }\n    }, {\n        key: 'toggleSearch',\n        value: function toggleSearch() {\n            this.showSearch = !this.showSearch;\n            if (!this.showSearch) {\n                this.unsetSearchedProjects();\n            }\n        }\n    }, {\n        key: 'search',\n        value: function () {\n            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(tmpStr) {\n                return regeneratorRuntime.wrap(function _callee$(_context) {\n                    while (1) {\n                        switch (_context.prev = _context.next) {\n                            case 0:\n                                if (!(!tmpStr || tmpStr.length === 0)) {\n                                    _context.next = 2;\n                                    break;\n                                }\n\n                                return _context.abrupt('return', false);\n\n                            case 2:\n                                if (!(tmpStr === this.searchStr)) {\n                                    _context.next = 8;\n                                    break;\n                                }\n\n                                if (!this.filters.some(function (v) {\n                                    return v.value;\n                                })) {\n                                    _context.next = 8;\n                                    break;\n                                }\n\n                                _context.next = 6;\n                                return this.searchProjects(this.searchStr, this.filters);\n\n                            case 6:\n                                this.resultNr = (0, _min2.default)([this.projects.length, 5]);\n                                this.totalNr = this.projects.length;\n\n                            case 8:\n                                return _context.abrupt('return', true);\n\n                            case 9:\n                            case 'end':\n                                return _context.stop();\n                        }\n                    }\n                }, _callee, this);\n            }));\n\n            function search(_x) {\n                return _ref.apply(this, arguments);\n            }\n\n            return search;\n        }()\n    }, {\n        key: 'close',\n        value: function close() {\n            this.showSearch = false;\n            this.searchStr = '';\n            this.projects = void 0;\n            this.totalNr = 0;\n            this.resultNr = 0;\n        }\n    }, {\n        key: 'checkboxChecks',\n        value: function checkboxChecks(filter) {\n            var _this2 = this;\n\n            this.filters = (0, _map2.default)(this.filters, function (f) {\n                if (filter.name === 'all' && filter.value && f.name !== 'all') {\n                    f.value = false;\n                } else if (filter.name !== 'all' && filter.value && f.name === 'all') {\n                    f.value = false;\n                } else if (!filter.value && (0, _every2.default)(_this2.filters, function (ff) {\n                    return !ff.value;\n                })) {\n                    f.value = true;\n                }\n                return f;\n            });\n\n            this.search(this.searchStr);\n        }\n    }], [{\n        key: 'searchbarFactory',\n        value: function searchbarFactory() {\n            __webpack_require__(/*! ./Searchbar.scss */ \"./src/Common/Searchbar/Searchbar.scss\");\n            function searchController($state, $scope, $ngRedux) {\n                return new SearchbarController($state, $scope, $ngRedux);\n            }\n\n            searchController.$inject = ['$state', '$scope', '$ngRedux'];\n\n            return searchController;\n        }\n    }]);\n\n    return SearchbarController;\n}();\n\nexports.default = SearchbarController;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1NlYXJjaGJhci9TZWFyY2hiYXJDb250cm9sbGVyLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9Db21tb24vU2VhcmNoYmFyL1NlYXJjaGJhckNvbnRyb2xsZXIuanM/YjYwZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWluIGZyb20gJ2xvZGFzaC9taW4nO1xuaW1wb3J0IG1hcCBmcm9tICdsb2Rhc2gvbWFwJztcbmltcG9ydCBldmVyeSBmcm9tICdsb2Rhc2gvZXZlcnknO1xuaW1wb3J0ICogYXMgU3lzdGVtTW9kdWxlIGZyb20gJy4uLy4uL3N0b3JlL21vZHVsZXMvc3lzdGVtJztcblxuY2xhc3MgU2VhcmNoYmFyQ29udHJvbGxlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcigkc3RhdGUsICRzY29wZSwgJG5nUmVkdXgpIHtcbiAgICAgICAgdGhpcy5FRSA9IHdpbmRvdy5FRTtcbiAgICAgICAgdGhpcy5zY29wZSA9ICRzY29wZTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICRzdGF0ZTtcbiAgICAgICAgdGhpcy4kb25Jbml0ID0gdGhpcy5vbkluaXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gdGhpcy5vbkRlc3Ryb3kuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5tYXBTdGF0ZSA9IHRoaXMubWFwU3RhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSA9ICRuZ1JlZHV4LmNvbm5lY3QodGhpcy5tYXBTdGF0ZSwgU3lzdGVtTW9kdWxlKSh0aGlzKTtcbiAgICB9XG5cbiAgICBtYXBTdGF0ZShzdGF0ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvamVjdHM6IFN5c3RlbU1vZHVsZS5nZXRTZWFyY2hSZXN1bHQoc3RhdGUpLFxuICAgICAgICAgICAgZmlsdGVyczogU3lzdGVtTW9kdWxlLmdldFNlYXJjaEZpbHRlcnMoc3RhdGUpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb25Jbml0KCkge1xuICAgICAgICB0aGlzLnNob3dTZWFyY2ggPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zZWFyY2hTdHIgPSAnJztcbiAgICAgICAgdGhpcy5yZXN1bHROciA9IDA7XG4gICAgICAgIHRoaXMuc2NvcGUuJHdhdGNoKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFN0cjtcbiAgICAgICAgfSwgdG1wU3RyID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoKHRtcFN0cik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bnNldFNlYXJjaGVkUHJvamVjdHMoKTtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuXG4gICAgdG9nZ2xlU2VhcmNoKCkge1xuICAgICAgICB0aGlzLnNob3dTZWFyY2ggPSAhdGhpcy5zaG93U2VhcmNoO1xuICAgICAgICBpZiAoIXRoaXMuc2hvd1NlYXJjaCkge1xuICAgICAgICAgICAgdGhpcy51bnNldFNlYXJjaGVkUHJvamVjdHMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgYXN5bmMgc2VhcmNoKHRtcFN0cikge1xuICAgICAgICBpZiAoIXRtcFN0ciB8fCB0bXBTdHIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRtcFN0ciA9PT0gdGhpcy5zZWFyY2hTdHIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcnMuc29tZSh2ID0+IHYudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zZWFyY2hQcm9qZWN0cyh0aGlzLnNlYXJjaFN0ciwgdGhpcy5maWx0ZXJzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdE5yID0gbWluKFt0aGlzLnByb2plY3RzLmxlbmd0aCwgNV0pO1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxOciA9IHRoaXMucHJvamVjdHMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNsb3NlKCkge1xuICAgICAgICB0aGlzLnNob3dTZWFyY2ggPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zZWFyY2hTdHIgPSAnJztcbiAgICAgICAgdGhpcy5wcm9qZWN0cyA9IHZvaWQgMDtcbiAgICAgICAgdGhpcy50b3RhbE5yID0gMDtcbiAgICAgICAgdGhpcy5yZXN1bHROciA9IDA7XG4gICAgfVxuXG4gICAgY2hlY2tib3hDaGVja3MoZmlsdGVyKSB7XG4gICAgICAgIHRoaXMuZmlsdGVycyA9IG1hcCh0aGlzLmZpbHRlcnMsIChmKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLm5hbWUgPT09ICdhbGwnICYmIGZpbHRlci52YWx1ZSAmJiBmLm5hbWUgIT09ICdhbGwnKSB7XG4gICAgICAgICAgICAgICAgZi52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZmlsdGVyLm5hbWUgIT09ICdhbGwnICYmIGZpbHRlci52YWx1ZSAmJiBmLm5hbWUgPT09ICdhbGwnKSB7XG4gICAgICAgICAgICAgICAgZi52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIWZpbHRlci52YWx1ZSAmJiBldmVyeSh0aGlzLmZpbHRlcnMsIChmZikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAhZmYudmFsdWU7XG4gICAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgICAgIGYudmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGY7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2VhcmNoKHRoaXMuc2VhcmNoU3RyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2VhcmNoYmFyRmFjdG9yeSgpIHtcbiAgICAgICAgcmVxdWlyZSgnLi9TZWFyY2hiYXIuc2NzcycpO1xuICAgICAgICBmdW5jdGlvbiBzZWFyY2hDb250cm9sbGVyKCRzdGF0ZSwgJHNjb3BlLCAkbmdSZWR1eCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTZWFyY2hiYXJDb250cm9sbGVyKCRzdGF0ZSwgJHNjb3BlLCAkbmdSZWR1eCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzdGF0ZScsICckc2NvcGUnLCAnJG5nUmVkdXgnXTtcblxuICAgICAgICByZXR1cm4gc2VhcmNoQ29udHJvbGxlcjtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VhcmNoYmFyQ29udHJvbGxlcjtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBO0FBREE7QUFDQTs7Ozs7Ozs7O0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTs7O0FBRUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBR0E7Ozs7O0FBQ0E7Ozs7O0FBQ0E7QUFDQTs7QUFDQTs7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7OztBQUNBO0FBQ0E7O0FBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQUlBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Common/Searchbar/SearchbarController.js\n");

/***/ }),

/***/ "./src/Common/Searchbar/searchbarComponent.js":
/*!****************************************************!*\
  !*** ./src/Common/Searchbar/searchbarComponent.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _Searchbar = __webpack_require__(/*! ./Searchbar.html */ \"./src/Common/Searchbar/Searchbar.html\");\n\nvar _Searchbar2 = _interopRequireDefault(_Searchbar);\n\nvar _SearchbarController = __webpack_require__(/*! ./SearchbarController */ \"./src/Common/Searchbar/SearchbarController.js\");\n\nvar _SearchbarController2 = _interopRequireDefault(_SearchbarController);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar searchbarComponent = {\n    controller: _SearchbarController2.default.searchbarFactory(),\n    template: _Searchbar2.default,\n    controllerAs: 'vm',\n    name: 'searchbar',\n    bindings: {\n        compactMode: '@'\n    }\n};\n\nexports.default = searchbarComponent;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1NlYXJjaGJhci9zZWFyY2hiYXJDb21wb25lbnQuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL0NvbW1vbi9TZWFyY2hiYXIvc2VhcmNoYmFyQ29tcG9uZW50LmpzPzJhNzEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF90ZW1wbGF0ZSBmcm9tICcuL1NlYXJjaGJhci5odG1sJztcbmltcG9ydCBTZWFyY2hiYXJDb250cm9sbGVyIGZyb20gJy4vU2VhcmNoYmFyQ29udHJvbGxlcic7XG5cbmNvbnN0IHNlYXJjaGJhckNvbXBvbmVudCA9IHtcbiAgICBjb250cm9sbGVyOiBTZWFyY2hiYXJDb250cm9sbGVyLnNlYXJjaGJhckZhY3RvcnkoKSxcbiAgICB0ZW1wbGF0ZTogX3RlbXBsYXRlLFxuICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICBuYW1lOiAnc2VhcmNoYmFyJyxcbiAgICBiaW5kaW5nczoge1xuICAgICAgICBjb21wYWN0TW9kZTogJ0AnXG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VhcmNoYmFyQ29tcG9uZW50O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFMQTtBQUNBO0FBU0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/Searchbar/searchbarComponent.js\n");

/***/ })

}]);