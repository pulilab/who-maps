(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[547],{

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/MyProjects/MyProjectList/MyProjectList.scss":
/*!**************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js!./src/MyProjects/MyProjectList/MyProjectList.scss ***!
  \**************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: `sass-loader` requires `node-sass` >=4. Please install a compatible version.\\n    at Object.sassLoader (/Users/nico/Projects/who-maps/frontend/node_modules/sass-loader/lib/loader.js:31:19)\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3NyYy9NeVByb2plY3RzL015UHJvamVjdExpc3QvTXlQcm9qZWN0TGlzdC5zY3NzLmpzIiwic291cmNlcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/MyProjects/MyProjectList/MyProjectList.scss\n");

/***/ }),

/***/ "./src/MyProjects/MyProjectList/MyProjectList.html":
/*!*********************************************************!*\
  !*** ./src/MyProjects/MyProjectList/MyProjectList.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<div layout=\\\"column\\\" layout-align=\\\"start center\\\">\\n\\n  <div class=\\\"page-title\\\">\\n    <h1 class=\\\"md-display-1 text-center\\\">\\n      <translate>Projects list</translate>\\n    </h1>\\n    <h6 class=\\\"md-subhead text-center\\\">\\n      <translate>List of all the projects you are a </translate>\\n      <md-icon class=\\\"material-icons\\\">star_rate</md-icon>\\n      <translate><b>Member</b> or</translate>\\n      <md-icon class=\\\"material-icons\\\">visibility</md-icon>\\n      <translate><b>Viewer</b> of. </translate>\\n    </h6>\\n  </div>\\n\\n  <div class=\\\"wrapper\\\" layout=\\\"column\\\">\\n    <md-card md-whiteframe=\\\"2\\\" flex class=\\\"no-projects\\\" ng-show=\\\"!vm.projects || vm.projects.length === 0\\\">\\n      <div class=\\\"emptychild\\\" layout=\\\"column\\\" layout-align=\\\"start center\\\" >\\n        <md-button class=\\\"md-raised\\\" aria-label=\\\"start new project\\\" ui-sref=\\\"newProject\\\">\\n          <translate>add new project</translate>\\n        </md-button>\\n        <p>\\n          <translate>\\n            to include your project in the inventory and begin tracking your performance\\n          </translate>\\n        </p>\\n      </div>\\n    </md-card>\\n    <project-component\\n      ng-repeat=\\\"p in vm.projects\\\"\\n      show-details=\\\"true\\\"\\n      project=\\\"p\\\"\\n      show-version=\\\"true\\\">\\n    </project-component>\\n  </div>\\n\\n  <disclaimer></disclaimer>\\n\\n</div>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTXlQcm9qZWN0cy9NeVByb2plY3RMaXN0L015UHJvamVjdExpc3QuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NeVByb2plY3RzL015UHJvamVjdExpc3QvTXlQcm9qZWN0TGlzdC5odG1sPzRlOTYiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgbGF5b3V0PVxcXCJjb2x1bW5cXFwiIGxheW91dC1hbGlnbj1cXFwic3RhcnQgY2VudGVyXFxcIj5cXG5cXG4gIDxkaXYgY2xhc3M9XFxcInBhZ2UtdGl0bGVcXFwiPlxcbiAgICA8aDEgY2xhc3M9XFxcIm1kLWRpc3BsYXktMSB0ZXh0LWNlbnRlclxcXCI+XFxuICAgICAgPHRyYW5zbGF0ZT5Qcm9qZWN0cyBsaXN0PC90cmFuc2xhdGU+XFxuICAgIDwvaDE+XFxuICAgIDxoNiBjbGFzcz1cXFwibWQtc3ViaGVhZCB0ZXh0LWNlbnRlclxcXCI+XFxuICAgICAgPHRyYW5zbGF0ZT5MaXN0IG9mIGFsbCB0aGUgcHJvamVjdHMgeW91IGFyZSBhIDwvdHJhbnNsYXRlPlxcbiAgICAgIDxtZC1pY29uIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+c3Rhcl9yYXRlPC9tZC1pY29uPlxcbiAgICAgIDx0cmFuc2xhdGU+PGI+TWVtYmVyPC9iPiBvcjwvdHJhbnNsYXRlPlxcbiAgICAgIDxtZC1pY29uIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+dmlzaWJpbGl0eTwvbWQtaWNvbj5cXG4gICAgICA8dHJhbnNsYXRlPjxiPlZpZXdlcjwvYj4gb2YuIDwvdHJhbnNsYXRlPlxcbiAgICA8L2g2PlxcbiAgPC9kaXY+XFxuXFxuICA8ZGl2IGNsYXNzPVxcXCJ3cmFwcGVyXFxcIiBsYXlvdXQ9XFxcImNvbHVtblxcXCI+XFxuICAgIDxtZC1jYXJkIG1kLXdoaXRlZnJhbWU9XFxcIjJcXFwiIGZsZXggY2xhc3M9XFxcIm5vLXByb2plY3RzXFxcIiBuZy1zaG93PVxcXCIhdm0ucHJvamVjdHMgfHwgdm0ucHJvamVjdHMubGVuZ3RoID09PSAwXFxcIj5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJlbXB0eWNoaWxkXFxcIiBsYXlvdXQ9XFxcImNvbHVtblxcXCIgbGF5b3V0LWFsaWduPVxcXCJzdGFydCBjZW50ZXJcXFwiID5cXG4gICAgICAgIDxtZC1idXR0b24gY2xhc3M9XFxcIm1kLXJhaXNlZFxcXCIgYXJpYS1sYWJlbD1cXFwic3RhcnQgbmV3IHByb2plY3RcXFwiIHVpLXNyZWY9XFxcIm5ld1Byb2plY3RcXFwiPlxcbiAgICAgICAgICA8dHJhbnNsYXRlPmFkZCBuZXcgcHJvamVjdDwvdHJhbnNsYXRlPlxcbiAgICAgICAgPC9tZC1idXR0b24+XFxuICAgICAgICA8cD5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5cXG4gICAgICAgICAgICB0byBpbmNsdWRlIHlvdXIgcHJvamVjdCBpbiB0aGUgaW52ZW50b3J5IGFuZCBiZWdpbiB0cmFja2luZyB5b3VyIHBlcmZvcm1hbmNlXFxuICAgICAgICAgIDwvdHJhbnNsYXRlPlxcbiAgICAgICAgPC9wPlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L21kLWNhcmQ+XFxuICAgIDxwcm9qZWN0LWNvbXBvbmVudFxcbiAgICAgIG5nLXJlcGVhdD1cXFwicCBpbiB2bS5wcm9qZWN0c1xcXCJcXG4gICAgICBzaG93LWRldGFpbHM9XFxcInRydWVcXFwiXFxuICAgICAgcHJvamVjdD1cXFwicFxcXCJcXG4gICAgICBzaG93LXZlcnNpb249XFxcInRydWVcXFwiPlxcbiAgICA8L3Byb2plY3QtY29tcG9uZW50PlxcbiAgPC9kaXY+XFxuXFxuICA8ZGlzY2xhaW1lcj48L2Rpc2NsYWltZXI+XFxuXFxuPC9kaXY+XFxuXCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MyProjects/MyProjectList/MyProjectList.html\n");

/***/ }),

/***/ "./src/MyProjects/MyProjectList/MyProjectList.scss":
/*!*********************************************************!*\
  !*** ./src/MyProjects/MyProjectList/MyProjectList.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/postcss-loader/lib!../../../node_modules/sass-loader/lib/loader.js!./MyProjectList.scss */ \"./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/MyProjects/MyProjectList/MyProjectList.scss\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTXlQcm9qZWN0cy9NeVByb2plY3RMaXN0L015UHJvamVjdExpc3Quc2Nzcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NeVByb2plY3RzL015UHJvamVjdExpc3QvTXlQcm9qZWN0TGlzdC5zY3NzPzI1MTAiXSwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9NeVByb2plY3RMaXN0LnNjc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9NeVByb2plY3RMaXN0LnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vTXlQcm9qZWN0TGlzdC5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MyProjects/MyProjectList/MyProjectList.scss\n");

/***/ }),

/***/ "./src/MyProjects/MyProjectList/MyProjectListController.js":
/*!*****************************************************************!*\
  !*** ./src/MyProjects/MyProjectList/MyProjectListController.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _projects = __webpack_require__(/*! ../../store/modules/projects */ \"./src/store/modules/projects.js\");\n\nvar ProjectModule = _interopRequireWildcard(_projects);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar MyProjectListController = function () {\n    function MyProjectListController($scope, $state, $ngRedux) {\n        _classCallCheck(this, MyProjectListController);\n\n        this.scope = $scope;\n        this.state = $state;\n        this.$ngRedux = $ngRedux;\n        this.$onInit = this.onInit.bind(this);\n        this.$onDestroy = this.onDestroy.bind(this);\n    }\n\n    _createClass(MyProjectListController, [{\n        key: 'onInit',\n        value: function onInit() {\n            this.unsubscribe = this.$ngRedux.connect(this.mapState, ProjectModule)(this);\n        }\n    }, {\n        key: 'onDestroy',\n        value: function onDestroy() {\n            this.unsubscribe();\n        }\n    }, {\n        key: 'mapState',\n        value: function mapState(state) {\n            return {\n                projects: ProjectModule.getUserProjects(state)\n            };\n        }\n    }], [{\n        key: 'factory',\n        value: function factory() {\n            __webpack_require__(/*! ./MyProjectList.scss */ \"./src/MyProjects/MyProjectList/MyProjectList.scss\");\n            function myProjectList($scope, $state, $ngRedux) {\n                return new MyProjectListController($scope, $state, $ngRedux);\n            }\n            myProjectList.$inject = ['$scope', '$state', '$ngRedux'];\n            return myProjectList;\n        }\n    }]);\n\n    return MyProjectListController;\n}();\n\nexports.default = MyProjectListController;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTXlQcm9qZWN0cy9NeVByb2plY3RMaXN0L015UHJvamVjdExpc3RDb250cm9sbGVyLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9NeVByb2plY3RzL015UHJvamVjdExpc3QvTXlQcm9qZWN0TGlzdENvbnRyb2xsZXIuanM/MGI1OCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBQcm9qZWN0TW9kdWxlIGZyb20gJy4uLy4uL3N0b3JlL21vZHVsZXMvcHJvamVjdHMnO1xuXG5jbGFzcyBNeVByb2plY3RMaXN0Q29udHJvbGxlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcigkc2NvcGUsICRzdGF0ZSwgJG5nUmVkdXgpIHtcbiAgICAgICAgdGhpcy5zY29wZSA9ICRzY29wZTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICRzdGF0ZTtcbiAgICAgICAgdGhpcy4kbmdSZWR1eCA9ICRuZ1JlZHV4O1xuICAgICAgICB0aGlzLiRvbkluaXQgPSB0aGlzLm9uSW5pdC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSB0aGlzLm9uRGVzdHJveS5iaW5kKHRoaXMpO1xuXG4gICAgfVxuXG4gICAgb25Jbml0KCkge1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlID0gdGhpcy4kbmdSZWR1eC5jb25uZWN0KHRoaXMubWFwU3RhdGUsIFByb2plY3RNb2R1bGUpKHRoaXMpO1xuICAgIH1cbiAgICBvbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBtYXBTdGF0ZShzdGF0ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvamVjdHM6IFByb2plY3RNb2R1bGUuZ2V0VXNlclByb2plY3RzKHN0YXRlKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBmYWN0b3J5KCkge1xuICAgICAgICByZXF1aXJlKCcuL015UHJvamVjdExpc3Quc2NzcycpO1xuICAgICAgICBmdW5jdGlvbiBteVByb2plY3RMaXN0KCRzY29wZSwgJHN0YXRlLCAkbmdSZWR1eCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNeVByb2plY3RMaXN0Q29udHJvbGxlcigkc2NvcGUsICRzdGF0ZSwgJG5nUmVkdXgpO1xuICAgICAgICB9XG4gICAgICAgIG15UHJvamVjdExpc3QuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZScsICckbmdSZWR1eCddO1xuICAgICAgICByZXR1cm4gbXlQcm9qZWN0TGlzdDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE15UHJvamVjdExpc3RDb250cm9sbGVyO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFEQTtBQUNBOzs7OztBQUNBO0FBRUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFEQTtBQUdBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUFHQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MyProjects/MyProjectList/MyProjectListController.js\n");

/***/ }),

/***/ "./src/MyProjects/MyProjectList/myProjectListComponent.js":
/*!****************************************************************!*\
  !*** ./src/MyProjects/MyProjectList/myProjectListComponent.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _MyProjectListController = __webpack_require__(/*! ./MyProjectListController */ \"./src/MyProjects/MyProjectList/MyProjectListController.js\");\n\nvar _MyProjectListController2 = _interopRequireDefault(_MyProjectListController);\n\nvar _MyProjectList = __webpack_require__(/*! ./MyProjectList.html */ \"./src/MyProjects/MyProjectList/MyProjectList.html\");\n\nvar _MyProjectList2 = _interopRequireDefault(_MyProjectList);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar component = {\n    template: _MyProjectList2.default,\n    controller: _MyProjectListController2.default.factory(),\n    controllerAs: 'vm',\n    name: 'myProjectList',\n    bindings: {}\n};\n\nexports.default = component;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTXlQcm9qZWN0cy9NeVByb2plY3RMaXN0L215UHJvamVjdExpc3RDb21wb25lbnQuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL015UHJvamVjdHMvTXlQcm9qZWN0TGlzdC9teVByb2plY3RMaXN0Q29tcG9uZW50LmpzPzlmNGIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE15UHJvamVjdExpc3RDb250cm9sbGVyIGZyb20gJy4vTXlQcm9qZWN0TGlzdENvbnRyb2xsZXInO1xuaW1wb3J0IF90ZW1wbGF0ZSBmcm9tICcuL015UHJvamVjdExpc3QuaHRtbCc7XG5cblxuY29uc3QgY29tcG9uZW50ID0ge1xuICAgIHRlbXBsYXRlOiBfdGVtcGxhdGUsXG4gICAgY29udHJvbGxlcjogTXlQcm9qZWN0TGlzdENvbnRyb2xsZXIuZmFjdG9yeSgpLFxuICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICBuYW1lOiAnbXlQcm9qZWN0TGlzdCcsXG4gICAgYmluZGluZ3M6IHt9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb21wb25lbnQ7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFDQTtBQU9BIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MyProjects/MyProjectList/myProjectListComponent.js\n");

/***/ })

}]);