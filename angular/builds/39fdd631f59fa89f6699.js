(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[344],{

/***/ "./src/MapsToolkit/AxisFooter/AxisFooter.html":
/*!****************************************************!*\
  !*** ./src/MapsToolkit/AxisFooter/AxisFooter.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<footer layout=\\\"row\\\" >\\n    <div flex ng-repeat=\\\"axis in vm.processedAxis\\\" ng-click=\\\"vm.changeAxis(axis)\\\" ng-class=\\\"vm.classGenerator(axis)\\\" class=\\\"axis\\\" layout=\\\"column\\\" layout-align=\\\"center center\\\">\\n        <div>\\n          <span class=\\\"number\\\">{{axis.axisId}}.</span>\\n          <strong>{{axis.axisName}}</strong>\\n        </div>\\n    </div>\\n</footer>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvQXhpc0Zvb3Rlci9BeGlzRm9vdGVyLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvQXhpc0Zvb3Rlci9BeGlzRm9vdGVyLmh0bWw/NTRjMCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPGZvb3RlciBsYXlvdXQ9XFxcInJvd1xcXCIgPlxcbiAgICA8ZGl2IGZsZXggbmctcmVwZWF0PVxcXCJheGlzIGluIHZtLnByb2Nlc3NlZEF4aXNcXFwiIG5nLWNsaWNrPVxcXCJ2bS5jaGFuZ2VBeGlzKGF4aXMpXFxcIiBuZy1jbGFzcz1cXFwidm0uY2xhc3NHZW5lcmF0b3IoYXhpcylcXFwiIGNsYXNzPVxcXCJheGlzXFxcIiBsYXlvdXQ9XFxcImNvbHVtblxcXCIgbGF5b3V0LWFsaWduPVxcXCJjZW50ZXIgY2VudGVyXFxcIj5cXG4gICAgICAgIDxkaXY+XFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJudW1iZXJcXFwiPnt7YXhpcy5heGlzSWR9fS48L3NwYW4+XFxuICAgICAgICAgIDxzdHJvbmc+e3theGlzLmF4aXNOYW1lfX08L3N0cm9uZz5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L2Zvb3Rlcj5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/AxisFooter/AxisFooter.html\n");

/***/ }),

/***/ "./src/MapsToolkit/AxisFooter/axisFooterComponent.js":
/*!***********************************************************!*\
  !*** ./src/MapsToolkit/AxisFooter/axisFooterComponent.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _AxisFooter = __webpack_require__(/*! ./AxisFooter.html */ \"./src/MapsToolkit/AxisFooter/AxisFooter.html\");\n\nvar _AxisFooter2 = _interopRequireDefault(_AxisFooter);\n\nvar _AxisFooterController = __webpack_require__(/*! ./AxisFooterController */ \"./src/MapsToolkit/AxisFooter/AxisFooterController.js\");\n\nvar _AxisFooterController2 = _interopRequireDefault(_AxisFooterController);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar axisFooterComponent = {\n    controller: _AxisFooterController2.default.axisFooterFactory(),\n    template: _AxisFooter2.default,\n    controllerAs: 'vm',\n    bindings: {\n        axes: '<'\n    },\n    name: 'axisFooter'\n};\n\nexports.default = axisFooterComponent;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvQXhpc0Zvb3Rlci9heGlzRm9vdGVyQ29tcG9uZW50LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9NYXBzVG9vbGtpdC9BeGlzRm9vdGVyL2F4aXNGb290ZXJDb21wb25lbnQuanM/ZjUzMyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgX3RlbXBsYXRlIGZyb20gJy4vQXhpc0Zvb3Rlci5odG1sJztcbmltcG9ydCBBeGlzRm9vdGVyQ29udHJvbGxlciBmcm9tICcuL0F4aXNGb290ZXJDb250cm9sbGVyJztcblxuY29uc3QgYXhpc0Zvb3RlckNvbXBvbmVudCA9IHtcbiAgICBjb250cm9sbGVyOiBBeGlzRm9vdGVyQ29udHJvbGxlci5heGlzRm9vdGVyRmFjdG9yeSgpLFxuICAgIHRlbXBsYXRlOiBfdGVtcGxhdGUsXG4gICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgIGJpbmRpbmdzOiB7XG4gICAgICAgIGF4ZXM6ICc8J1xuICAgIH0sXG4gICAgbmFtZTogJ2F4aXNGb290ZXInXG59O1xuXG5leHBvcnQgZGVmYXVsdCBheGlzRm9vdGVyQ29tcG9uZW50O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFQQTtBQUNBO0FBU0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/AxisFooter/axisFooterComponent.js\n");

/***/ })

}]);