(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[646],{

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/Axis/Axis.scss":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js!./src/Common/Axis/Axis.scss ***!
  \****************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: `sass-loader` requires `node-sass` >=4. Please install a compatible version.\\n    at Object.sassLoader (/Users/nico/Projects/who-maps/frontend/node_modules/sass-loader/lib/loader.js:31:19)\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3NyYy9Db21tb24vQXhpcy9BeGlzLnNjc3MuanMiLCJzb3VyY2VzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/Axis/Axis.scss\n");

/***/ }),

/***/ "./src/Common/Axis/Axis.html":
/*!***********************************!*\
  !*** ./src/Common/Axis/Axis.html ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<md-card md-whiteframe=\\\"2\\\" layout=\\\"row\\\" ng-class=\\\"{'showCurrent': vm.showCurrent}\\\">\\n\\n    <!-- Colored Background & axis logo -->\\n    <div\\n        flex=\\\"nogrow\\\"\\n        ng-class=\\\"vm.axisClass\\\"\\n        class=\\\"picture\\\"\\n        layout=\\\"column\\\"\\n        layout-align=\\\"center center\\\">\\n\\n        <img ng-src=\\\"{{vm.axisPicture}}\\\"/>\\n\\n    </div>\\n\\n    <div layout=\\\"row\\\" class=\\\"axis-domains\\\">\\n\\n        <!-- Axis column -->\\n        <div\\n            flex=\\\"20\\\"\\n            class=\\\"axis\\\"\\n            ng-click=\\\"vm.goToAxis()\\\">\\n\\n            <div class=\\\"vert-divider\\\" layout=\\\"column\\\">\\n\\n                <div class=\\\"md-block label axis-label\\\" flex=\\\"60\\\">\\n                    <span>{{vm.axisName}}</span>\\n                </div>\\n\\n                <div class=\\\"scores\\\" layout=\\\"row\\\" flex=\\\"40\\\">\\n\\n                    <div flex=\\\"45\\\" layout=\\\"row\\\" layout-align=\\\"start center\\\">\\n\\n                        <span flex=\\\"nogrow\\\" layout-padding class=\\\"label ps\\\">P</span>\\n\\n                        <div flex=\\\"grow\\\" class=\\\"line\\\" layout=\\\"row\\\">\\n                            <div flex=\\\"nogrow\\\" ng-class=\\\"vm.axisCompletionClass\\\"></div>\\n                        </div>\\n\\n                    </div>\\n\\n                    <div flex=\\\"45\\\" layout=\\\"row\\\" layout-align=\\\"start center\\\">\\n\\n                        <span flex=\\\"nogrow\\\" layout-padding class=\\\"label ps\\\" >S</span>\\n                        <div flex=\\\"grow\\\" class=\\\"line\\\" layout=\\\"row\\\" >\\n                            <div flex=\\\"nogrow\\\" ng-class=\\\"vm.axisScoreClass\\\"></div>\\n                        </div>\\n\\n                    </div>\\n                </div>\\n\\n            </div>\\n\\n        </div>\\n\\n        <!-- Domain columns -->\\n        <div\\n            flex=\\\"20\\\"\\n            class=\\\"domains\\\"\\n            layout=\\\"column\\\"\\n            ng-repeat=\\\"domain in vm.domains\\\"\\n            ng-click=\\\"vm.changeDomain(domain)\\\"\\n            ng-class=\\\"{'gotdata': domain.domain_sum > 0, 'nodata': domain.domain_sum === 0, 'active': vm.setDomainActive(domain.index)}\\\">\\n\\n            <div class=\\\"vert-divider\\\" layout=\\\"column\\\">\\n\\n                <div class=\\\"md-block label\\\" flex=\\\"60\\\">\\n                    <span class=\\\"cap\\\">{{domain.name}}</span>\\n                </div>\\n\\n                <div class=\\\"scores\\\" layout=\\\"row\\\" ng-if=\\\"domain.domain_completion > 0\\\" flex=\\\"40\\\">\\n\\n                    <div flex=\\\"50\\\" layout=\\\"row\\\" layout-align=\\\"start center\\\">\\n\\n                        <span layout-padding class=\\\"label ps\\\" >S</span>\\n\\n                        <div class=\\\"line\\\">\\n\\n                            <div ng-class=\\\"vm.advanceClassGenerator(domain.domain_completion)\\\"></div>\\n\\n                        </div>\\n\\n                    </div>\\n\\n                </div>\\n\\n            </div>\\n\\n        </div>\\n\\n    </div>\\n\\n</md-card>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0F4aXMvQXhpcy5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BeGlzL0F4aXMuaHRtbD83MmViIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8bWQtY2FyZCBtZC13aGl0ZWZyYW1lPVxcXCIyXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCIgbmctY2xhc3M9XFxcInsnc2hvd0N1cnJlbnQnOiB2bS5zaG93Q3VycmVudH1cXFwiPlxcblxcbiAgICA8IS0tIENvbG9yZWQgQmFja2dyb3VuZCAmIGF4aXMgbG9nbyAtLT5cXG4gICAgPGRpdlxcbiAgICAgICAgZmxleD1cXFwibm9ncm93XFxcIlxcbiAgICAgICAgbmctY2xhc3M9XFxcInZtLmF4aXNDbGFzc1xcXCJcXG4gICAgICAgIGNsYXNzPVxcXCJwaWN0dXJlXFxcIlxcbiAgICAgICAgbGF5b3V0PVxcXCJjb2x1bW5cXFwiXFxuICAgICAgICBsYXlvdXQtYWxpZ249XFxcImNlbnRlciBjZW50ZXJcXFwiPlxcblxcbiAgICAgICAgPGltZyBuZy1zcmM9XFxcInt7dm0uYXhpc1BpY3R1cmV9fVxcXCIvPlxcblxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBsYXlvdXQ9XFxcInJvd1xcXCIgY2xhc3M9XFxcImF4aXMtZG9tYWluc1xcXCI+XFxuXFxuICAgICAgICA8IS0tIEF4aXMgY29sdW1uIC0tPlxcbiAgICAgICAgPGRpdlxcbiAgICAgICAgICAgIGZsZXg9XFxcIjIwXFxcIlxcbiAgICAgICAgICAgIGNsYXNzPVxcXCJheGlzXFxcIlxcbiAgICAgICAgICAgIG5nLWNsaWNrPVxcXCJ2bS5nb1RvQXhpcygpXFxcIj5cXG5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ2ZXJ0LWRpdmlkZXJcXFwiIGxheW91dD1cXFwiY29sdW1uXFxcIj5cXG5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibWQtYmxvY2sgbGFiZWwgYXhpcy1sYWJlbFxcXCIgZmxleD1cXFwiNjBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3t2bS5heGlzTmFtZX19PC9zcGFuPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2NvcmVzXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCIgZmxleD1cXFwiNDBcXFwiPlxcblxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBmbGV4PVxcXCI0NVxcXCIgbGF5b3V0PVxcXCJyb3dcXFwiIGxheW91dC1hbGlnbj1cXFwic3RhcnQgY2VudGVyXFxcIj5cXG5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBmbGV4PVxcXCJub2dyb3dcXFwiIGxheW91dC1wYWRkaW5nIGNsYXNzPVxcXCJsYWJlbCBwc1xcXCI+UDwvc3Bhbj5cXG5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGZsZXg9XFxcImdyb3dcXFwiIGNsYXNzPVxcXCJsaW5lXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZmxleD1cXFwibm9ncm93XFxcIiBuZy1jbGFzcz1cXFwidm0uYXhpc0NvbXBsZXRpb25DbGFzc1xcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgZmxleD1cXFwiNDVcXFwiIGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtYWxpZ249XFxcInN0YXJ0IGNlbnRlclxcXCI+XFxuXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZmxleD1cXFwibm9ncm93XFxcIiBsYXlvdXQtcGFkZGluZyBjbGFzcz1cXFwibGFiZWwgcHNcXFwiID5TPC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZmxleD1cXFwiZ3Jvd1xcXCIgY2xhc3M9XFxcImxpbmVcXFwiIGxheW91dD1cXFwicm93XFxcIiA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZmxleD1cXFwibm9ncm93XFxcIiBuZy1jbGFzcz1cXFwidm0uYXhpc1Njb3JlQ2xhc3NcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICA8IS0tIERvbWFpbiBjb2x1bW5zIC0tPlxcbiAgICAgICAgPGRpdlxcbiAgICAgICAgICAgIGZsZXg9XFxcIjIwXFxcIlxcbiAgICAgICAgICAgIGNsYXNzPVxcXCJkb21haW5zXFxcIlxcbiAgICAgICAgICAgIGxheW91dD1cXFwiY29sdW1uXFxcIlxcbiAgICAgICAgICAgIG5nLXJlcGVhdD1cXFwiZG9tYWluIGluIHZtLmRvbWFpbnNcXFwiXFxuICAgICAgICAgICAgbmctY2xpY2s9XFxcInZtLmNoYW5nZURvbWFpbihkb21haW4pXFxcIlxcbiAgICAgICAgICAgIG5nLWNsYXNzPVxcXCJ7J2dvdGRhdGEnOiBkb21haW4uZG9tYWluX3N1bSA+IDAsICdub2RhdGEnOiBkb21haW4uZG9tYWluX3N1bSA9PT0gMCwgJ2FjdGl2ZSc6IHZtLnNldERvbWFpbkFjdGl2ZShkb21haW4uaW5kZXgpfVxcXCI+XFxuXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidmVydC1kaXZpZGVyXFxcIiBsYXlvdXQ9XFxcImNvbHVtblxcXCI+XFxuXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIm1kLWJsb2NrIGxhYmVsXFxcIiBmbGV4PVxcXCI2MFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwiY2FwXFxcIj57e2RvbWFpbi5uYW1lfX08L3NwYW4+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzY29yZXNcXFwiIGxheW91dD1cXFwicm93XFxcIiBuZy1pZj1cXFwiZG9tYWluLmRvbWFpbl9jb21wbGV0aW9uID4gMFxcXCIgZmxleD1cXFwiNDBcXFwiPlxcblxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBmbGV4PVxcXCI1MFxcXCIgbGF5b3V0PVxcXCJyb3dcXFwiIGxheW91dC1hbGlnbj1cXFwic3RhcnQgY2VudGVyXFxcIj5cXG5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBsYXlvdXQtcGFkZGluZyBjbGFzcz1cXFwibGFiZWwgcHNcXFwiID5TPC9zcGFuPlxcblxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpbmVcXFwiPlxcblxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IG5nLWNsYXNzPVxcXCJ2bS5hZHZhbmNlQ2xhc3NHZW5lcmF0b3IoZG9tYWluLmRvbWFpbl9jb21wbGV0aW9uKVxcXCI+PC9kaXY+XFxuXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICA8L2Rpdj5cXG5cXG4gICAgPC9kaXY+XFxuXFxuPC9tZC1jYXJkPlxcblwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/Axis/Axis.html\n");

/***/ }),

/***/ "./src/Common/Axis/Axis.scss":
/*!***********************************!*\
  !*** ./src/Common/Axis/Axis.scss ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/postcss-loader/lib!../../../node_modules/sass-loader/lib/loader.js!./Axis.scss */ \"./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/Axis/Axis.scss\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0F4aXMvQXhpcy5zY3NzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BeGlzL0F4aXMuc2Nzcz8yNmM1Il0sInNvdXJjZXNDb250ZW50IjpbIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vQXhpcy5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vQXhpcy5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL0F4aXMuc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/Common/Axis/Axis.scss\n");

/***/ }),

/***/ "./src/Common/Axis/AxisController.js":
/*!*******************************************!*\
  !*** ./src/Common/Axis/AxisController.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _toolkit = __webpack_require__(/*! ../../store/modules/toolkit */ \"./src/store/modules/toolkit.js\");\n\nvar ToolkitModule = _interopRequireWildcard(_toolkit);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar AxisController = function () {\n    function AxisController($scope, $ngRedux) {\n        _classCallCheck(this, AxisController);\n\n        this.scope = $scope;\n        this.$ngRedux = $ngRedux;\n        this.EE = window.EE;\n        this.$onInit = this.onInit.bind(this);\n        this.$onDestroy = this.onDestroy.bind(this);\n        this.mapState = this.mapState.bind(this);\n        this.changeDomain = this.changeDomain.bind(this);\n    }\n\n    _createClass(AxisController, [{\n        key: 'mapState',\n        value: function mapState(state) {\n            var axisId = parseInt(this.axisIndex, 10) + 1;\n            var domainId = this.domainIndex ? parseInt(this.domainIndex, 10) + 1 : null;\n            var axis = ToolkitModule.getAxisDetail(state, axisId);\n            var axisClass = axis.axis.split('.')[0].replace(' ', '').toLowerCase();\n            var axisPicture = __webpack_require__(\"./src/Common/Axis/images sync recursive ^\\\\.\\\\/icon\\\\-.*\\\\.svg$\")(\"./icon-\" + axisClass + '.svg');\n            var axisScorePercentage = axis.axis_score;\n            var axisCompletion = axis.axis_completion;\n            return {\n                axisId: axisId,\n                domainId: domainId,\n                axisPicture: axisPicture,\n                axisName: axis.name,\n                axisClass: axisClass,\n                axisScoreClass: this.advanceClassGenerator(axisScorePercentage),\n                axisCompletionClass: this.advanceClassGenerator(axisCompletion),\n                domains: axis.domains\n            };\n        }\n    }, {\n        key: 'onInit',\n        value: function onInit() {\n            if (this.axisId === null || this.axisId === void 0) {\n                this.axisId = 0;\n            }\n            this.unsubscribe = this.$ngRedux.connect(this.mapState, null)(this);\n        }\n    }, {\n        key: 'onDestroy',\n        value: function onDestroy() {\n            this.unsubscribe();\n        }\n    }, {\n        key: 'setDomainActive',\n        value: function setDomainActive(id) {\n            if (this.domainIndex) {\n                return parseInt(this.domainIndex, 10) === id;\n            }\n            return false;\n        }\n    }, {\n        key: 'changeDomain',\n        value: function changeDomain(domain) {\n            this.EE.emit('mapsDomainChange', this.axisIndex, domain.index);\n        }\n    }, {\n        key: 'goToAxis',\n        value: function goToAxis() {\n            var axisId = parseInt(this.axisId, 10) - 1;\n            this.EE.emit('mapsAxisChange', axisId);\n        }\n    }, {\n        key: 'advanceClassGenerator',\n        value: function advanceClassGenerator(value) {\n            if (value < 50) {\n                return 'red';\n            }\n            if (value < 100) {\n                return 'yellow';\n            }\n\n            return 'green';\n        }\n    }], [{\n        key: 'axisFactory',\n        value: function axisFactory() {\n            __webpack_require__(/*! ./Axis.scss */ \"./src/Common/Axis/Axis.scss\");\n            function newAxis($scope, $ngRedux) {\n                return new AxisController($scope, $ngRedux);\n            }\n            newAxis.$inject = ['$scope', '$ngRedux'];\n            return newAxis;\n        }\n    }]);\n\n    return AxisController;\n}();\n\nexports.default = AxisController;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0F4aXMvQXhpc0NvbnRyb2xsZXIuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL0NvbW1vbi9BeGlzL0F4aXNDb250cm9sbGVyLmpzPzhkNmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVG9vbGtpdE1vZHVsZSBmcm9tICcuLi8uLi9zdG9yZS9tb2R1bGVzL3Rvb2xraXQnO1xuXG5cbmNsYXNzIEF4aXNDb250cm9sbGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCRzY29wZSwgJG5nUmVkdXgpIHtcbiAgICAgICAgdGhpcy5zY29wZSA9ICRzY29wZTtcbiAgICAgICAgdGhpcy4kbmdSZWR1eCA9ICRuZ1JlZHV4O1xuICAgICAgICB0aGlzLkVFID0gd2luZG93LkVFO1xuICAgICAgICB0aGlzLiRvbkluaXQgPSB0aGlzLm9uSW5pdC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSB0aGlzLm9uRGVzdHJveS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm1hcFN0YXRlID0gdGhpcy5tYXBTdGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmNoYW5nZURvbWFpbiA9IHRoaXMuY2hhbmdlRG9tYWluLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgbWFwU3RhdGUoc3RhdGUpIHtcbiAgICAgICAgY29uc3QgYXhpc0lkID0gcGFyc2VJbnQodGhpcy5heGlzSW5kZXgsIDEwKSArIDE7XG4gICAgICAgIGNvbnN0IGRvbWFpbklkID0gdGhpcy5kb21haW5JbmRleCA/IHBhcnNlSW50KHRoaXMuZG9tYWluSW5kZXgsIDEwKSArIDEgOiBudWxsO1xuICAgICAgICBjb25zdCBheGlzID0gVG9vbGtpdE1vZHVsZS5nZXRBeGlzRGV0YWlsKHN0YXRlLCBheGlzSWQpO1xuICAgICAgICBjb25zdCBheGlzQ2xhc3MgPSBheGlzLmF4aXMuc3BsaXQoJy4nKVswXS5yZXBsYWNlKCcgJywgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGF4aXNQaWN0dXJlID0gcmVxdWlyZSgnLi9pbWFnZXMvaWNvbi0nICsgYXhpc0NsYXNzICsgJy5zdmcnKTtcbiAgICAgICAgY29uc3QgYXhpc1Njb3JlUGVyY2VudGFnZSA9ICBheGlzLmF4aXNfc2NvcmU7XG4gICAgICAgIGNvbnN0IGF4aXNDb21wbGV0aW9uID0gIGF4aXMuYXhpc19jb21wbGV0aW9uO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXhpc0lkLFxuICAgICAgICAgICAgZG9tYWluSWQsXG4gICAgICAgICAgICBheGlzUGljdHVyZSxcbiAgICAgICAgICAgIGF4aXNOYW1lOiBheGlzLm5hbWUsXG4gICAgICAgICAgICBheGlzQ2xhc3MsXG4gICAgICAgICAgICBheGlzU2NvcmVDbGFzczogdGhpcy5hZHZhbmNlQ2xhc3NHZW5lcmF0b3IoYXhpc1Njb3JlUGVyY2VudGFnZSksXG4gICAgICAgICAgICBheGlzQ29tcGxldGlvbkNsYXNzOiB0aGlzLmFkdmFuY2VDbGFzc0dlbmVyYXRvcihheGlzQ29tcGxldGlvbiksXG4gICAgICAgICAgICBkb21haW5zOiBheGlzLmRvbWFpbnNcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBvbkluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmF4aXNJZCA9PT0gbnVsbCB8fCB0aGlzLmF4aXNJZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICB0aGlzLmF4aXNJZCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSA9IHRoaXMuJG5nUmVkdXguY29ubmVjdCh0aGlzLm1hcFN0YXRlLCBudWxsKSh0aGlzKTtcbiAgICB9XG5cbiAgICBvbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBzZXREb21haW5BY3RpdmUoaWQpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9tYWluSW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmRvbWFpbkluZGV4LCAxMCkgPT09IGlkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIGNoYW5nZURvbWFpbihkb21haW4pIHtcbiAgICAgICAgdGhpcy5FRS5lbWl0KCdtYXBzRG9tYWluQ2hhbmdlJywgdGhpcy5heGlzSW5kZXgsIGRvbWFpbi5pbmRleCk7XG4gICAgfVxuXG4gICAgZ29Ub0F4aXMoKSB7XG4gICAgICAgIGNvbnN0IGF4aXNJZCA9IHBhcnNlSW50KHRoaXMuYXhpc0lkLCAxMCkgLSAxO1xuICAgICAgICB0aGlzLkVFLmVtaXQoJ21hcHNBeGlzQ2hhbmdlJywgYXhpc0lkKTtcbiAgICB9XG5cblxuICAgIGFkdmFuY2VDbGFzc0dlbmVyYXRvcih2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPCA1MCkge1xuICAgICAgICAgICAgcmV0dXJuICdyZWQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZSA8IDEwMCkge1xuICAgICAgICAgICAgcmV0dXJuICd5ZWxsb3cnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICdncmVlbic7XG4gICAgfVxuXG5cbiAgICBzdGF0aWMgYXhpc0ZhY3RvcnkoKSB7XG4gICAgICAgIHJlcXVpcmUoJy4vQXhpcy5zY3NzJyk7XG4gICAgICAgIGZ1bmN0aW9uIG5ld0F4aXMoJHNjb3BlLCAkbmdSZWR1eCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBeGlzQ29udHJvbGxlcigkc2NvcGUsICRuZ1JlZHV4KTtcbiAgICAgICAgfVxuICAgICAgICBuZXdBeGlzLiRpbmplY3QgPSBbJyRzY29wZScsICckbmdSZWR1eCddO1xuICAgICAgICByZXR1cm4gbmV3QXhpcztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEF4aXNDb250cm9sbGVyO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFEQTtBQUNBOzs7OztBQUVBO0FBRUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFVQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQUdBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Common/Axis/AxisController.js\n");

/***/ }),

/***/ "./src/Common/Axis/axisComponent.js":
/*!******************************************!*\
  !*** ./src/Common/Axis/axisComponent.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _Axis = __webpack_require__(/*! ./Axis.html */ \"./src/Common/Axis/Axis.html\");\n\nvar _Axis2 = _interopRequireDefault(_Axis);\n\nvar _AxisController = __webpack_require__(/*! ./AxisController */ \"./src/Common/Axis/AxisController.js\");\n\nvar _AxisController2 = _interopRequireDefault(_AxisController);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar axisComponent = {\n    controller: _AxisController2.default.axisFactory(),\n    template: _Axis2.default,\n    controllerAs: 'vm',\n    name: 'axis',\n    bindings: {\n        axisIndex: '<',\n        showCurrent: '@',\n        domainIndex: '<'\n    }\n};\n\nexports.default = axisComponent;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0F4aXMvYXhpc0NvbXBvbmVudC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvQ29tbW9uL0F4aXMvYXhpc0NvbXBvbmVudC5qcz8zN2MxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfdGVtcGxhdGUgZnJvbSAnLi9BeGlzLmh0bWwnO1xuaW1wb3J0IEF4aXNDb250cm9sbGVyIGZyb20gJy4vQXhpc0NvbnRyb2xsZXInO1xuXG5cbmNvbnN0IGF4aXNDb21wb25lbnQgPSB7XG4gICAgY29udHJvbGxlcjogQXhpc0NvbnRyb2xsZXIuYXhpc0ZhY3RvcnkoKSxcbiAgICB0ZW1wbGF0ZTogX3RlbXBsYXRlLFxuICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICBuYW1lOiAnYXhpcycsXG4gICAgYmluZGluZ3M6IHtcbiAgICAgICAgYXhpc0luZGV4OiAnPCcsXG4gICAgICAgIHNob3dDdXJyZW50OiAnQCcsXG4gICAgICAgIGRvbWFpbkluZGV4OiAnPCdcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBheGlzQ29tcG9uZW50O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBTEE7QUFDQTtBQVdBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Common/Axis/axisComponent.js\n");

/***/ }),

/***/ "./src/Common/Axis/images sync recursive ^\\.\\/icon\\-.*\\.svg$":
/*!*********************************************************!*\
  !*** ./src/Common/Axis/images sync ^\.\/icon\-.*\.svg$ ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./icon-axis1.svg\": \"./src/Common/Axis/images/icon-axis1.svg\",\n\t\"./icon-axis2.svg\": \"./src/Common/Axis/images/icon-axis2.svg\",\n\t\"./icon-axis3.svg\": \"./src/Common/Axis/images/icon-axis3.svg\",\n\t\"./icon-axis4.svg\": \"./src/Common/Axis/images/icon-axis4.svg\",\n\t\"./icon-axis5.svg\": \"./src/Common/Axis/images/icon-axis5.svg\",\n\t\"./icon-axis6.svg\": \"./src/Common/Axis/images/icon-axis6.svg\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\tvar module = __webpack_require__(id);\n\treturn module;\n}\nfunction webpackContextResolve(req) {\n\tvar id = map[req];\n\tif(!(id + 1)) { // check for number or string\n\t\tvar e = new Error('Cannot find module \"' + req + '\".');\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn id;\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./src/Common/Axis/images sync recursive ^\\\\.\\\\/icon\\\\-.*\\\\.svg$\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0F4aXMvaW1hZ2VzIHN5bmMgcmVjdXJzaXZlIF5cXC5cXC9pY29uXFwtLipcXC5zdmckLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BeGlzL2ltYWdlcyBzeW5jIF5cXC5cXC9pY29uXFwtLipcXC5zdmckP2FmNGYiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIG1hcCA9IHtcblx0XCIuL2ljb24tYXhpczEuc3ZnXCI6IFwiLi9zcmMvQ29tbW9uL0F4aXMvaW1hZ2VzL2ljb24tYXhpczEuc3ZnXCIsXG5cdFwiLi9pY29uLWF4aXMyLnN2Z1wiOiBcIi4vc3JjL0NvbW1vbi9BeGlzL2ltYWdlcy9pY29uLWF4aXMyLnN2Z1wiLFxuXHRcIi4vaWNvbi1heGlzMy5zdmdcIjogXCIuL3NyYy9Db21tb24vQXhpcy9pbWFnZXMvaWNvbi1heGlzMy5zdmdcIixcblx0XCIuL2ljb24tYXhpczQuc3ZnXCI6IFwiLi9zcmMvQ29tbW9uL0F4aXMvaW1hZ2VzL2ljb24tYXhpczQuc3ZnXCIsXG5cdFwiLi9pY29uLWF4aXM1LnN2Z1wiOiBcIi4vc3JjL0NvbW1vbi9BeGlzL2ltYWdlcy9pY29uLWF4aXM1LnN2Z1wiLFxuXHRcIi4vaWNvbi1heGlzNi5zdmdcIjogXCIuL3NyYy9Db21tb24vQXhpcy9pbWFnZXMvaWNvbi1heGlzNi5zdmdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcblx0cmV0dXJuIG1vZHVsZTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0dmFyIGlkID0gbWFwW3JlcV07XG5cdGlmKCEoaWQgKyAxKSkgeyAvLyBjaGVjayBmb3IgbnVtYmVyIG9yIHN0cmluZ1xuXHRcdHZhciBlID0gbmV3IEVycm9yKCdDYW5ub3QgZmluZCBtb2R1bGUgXCInICsgcmVxICsgJ1wiLicpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBpZDtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL0NvbW1vbi9BeGlzL2ltYWdlcyBzeW5jIHJlY3Vyc2l2ZSBeXFxcXC5cXFxcL2ljb25cXFxcLS4qXFxcXC5zdmckXCI7Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/Axis/images sync recursive ^\\.\\/icon\\-.*\\.svg$\n");

/***/ }),

/***/ "./src/Common/Axis/images/icon-axis1.svg":
/*!***********************************************!*\
  !*** ./src/Common/Axis/images/icon-axis1.svg ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"public/fonts/icon-axis1.svg\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0F4aXMvaW1hZ2VzL2ljb24tYXhpczEuc3ZnLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BeGlzL2ltYWdlcy9pY29uLWF4aXMxLnN2Zz9lZWU5Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcInB1YmxpYy9mb250cy9pY29uLWF4aXMxLnN2Z1wiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/Axis/images/icon-axis1.svg\n");

/***/ }),

/***/ "./src/Common/Axis/images/icon-axis2.svg":
/*!***********************************************!*\
  !*** ./src/Common/Axis/images/icon-axis2.svg ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"public/fonts/icon-axis2.svg\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0F4aXMvaW1hZ2VzL2ljb24tYXhpczIuc3ZnLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BeGlzL2ltYWdlcy9pY29uLWF4aXMyLnN2Zz83NzkxIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcInB1YmxpYy9mb250cy9pY29uLWF4aXMyLnN2Z1wiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/Axis/images/icon-axis2.svg\n");

/***/ }),

/***/ "./src/Common/Axis/images/icon-axis3.svg":
/*!***********************************************!*\
  !*** ./src/Common/Axis/images/icon-axis3.svg ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"public/fonts/icon-axis3.svg\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0F4aXMvaW1hZ2VzL2ljb24tYXhpczMuc3ZnLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BeGlzL2ltYWdlcy9pY29uLWF4aXMzLnN2Zz8yNjMwIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcInB1YmxpYy9mb250cy9pY29uLWF4aXMzLnN2Z1wiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/Axis/images/icon-axis3.svg\n");

/***/ }),

/***/ "./src/Common/Axis/images/icon-axis4.svg":
/*!***********************************************!*\
  !*** ./src/Common/Axis/images/icon-axis4.svg ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"public/fonts/icon-axis4.svg\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0F4aXMvaW1hZ2VzL2ljb24tYXhpczQuc3ZnLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BeGlzL2ltYWdlcy9pY29uLWF4aXM0LnN2Zz9kNzhkIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcInB1YmxpYy9mb250cy9pY29uLWF4aXM0LnN2Z1wiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/Axis/images/icon-axis4.svg\n");

/***/ }),

/***/ "./src/Common/Axis/images/icon-axis5.svg":
/*!***********************************************!*\
  !*** ./src/Common/Axis/images/icon-axis5.svg ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"public/fonts/icon-axis5.svg\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0F4aXMvaW1hZ2VzL2ljb24tYXhpczUuc3ZnLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BeGlzL2ltYWdlcy9pY29uLWF4aXM1LnN2Zz9lMjg2Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcInB1YmxpYy9mb250cy9pY29uLWF4aXM1LnN2Z1wiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/Axis/images/icon-axis5.svg\n");

/***/ }),

/***/ "./src/Common/Axis/images/icon-axis6.svg":
/*!***********************************************!*\
  !*** ./src/Common/Axis/images/icon-axis6.svg ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"public/fonts/icon-axis6.svg\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL0F4aXMvaW1hZ2VzL2ljb24tYXhpczYuc3ZnLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BeGlzL2ltYWdlcy9pY29uLWF4aXM2LnN2Zz83YjM0Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcInB1YmxpYy9mb250cy9pY29uLWF4aXM2LnN2Z1wiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/Axis/images/icon-axis6.svg\n");

/***/ })

}]);