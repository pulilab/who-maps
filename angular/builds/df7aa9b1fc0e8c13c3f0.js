(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[554],{

/***/ "./src/Project/GeneralOverview/ReadOnlyGeneralOverview.html":
/*!******************************************************************!*\
  !*** ./src/Project/GeneralOverview/ReadOnlyGeneralOverview.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<div class=\\\"project-section section-projectdetails read-only active\\\" md-whiteframe=\\\"2\\\">\\n\\n  <div class=\\\"section-title md-title\\\">\\n    <translate>1. General overview</translate>\\n    <span class=\\\"toggler\\\" ng-click=\\\"vm.collapse()\\\"><i class=\\\"material-icons\\\">keyboard_arrow_down</i></span>\\n  </div>\\n\\n  <div class=\\\"section-wrapper\\\">\\n    <div>\\n      <h6>\\n        <translate>Project name</translate>\\n      </h6>\\n      <p>{{vm.project.name}}</p>\\n    </div>\\n\\n    <div>\\n      <h6>\\n        <translate>Organisation name</translate>\\n      </h6>\\n      <p>{{vm.project.organisation_name}}</p>\\n    </div>\\n\\n    <div>\\n      <h6>\\n        <translate>Project country</translate>\\n      </h6>\\n      <p>{{vm.project.country_name}}</p>\\n    </div>\\n\\n    <div>\\n      <h6>\\n        <translate>Geographic scope</translate>\\n      </h6>\\n      <p>{{vm.project.geographic_scope}}</p>\\n    </div>\\n\\n\\n    <div>\\n      <h6>\\n        <translate>Overview of the digital health implementation</translate>\\n      </h6>\\n      <p>{{vm.project.implementation_overview}}</p>\\n    </div>\\n\\n    <div layout=\\\"row\\\">\\n      <div>\\n        <h6>\\n          <translate>Project start date</translate>\\n        </h6>\\n        <p>{{vm.printDate(vm.project.start_date)}}</p>\\n      </div>\\n      <div>\\n        <h6>\\n          <translate>Project end date</translate>\\n        </h6>\\n        <p>{{vm.printDate(vm.project.end_date)}}</p>\\n      </div>\\n    </div>\\n\\n    <div layout=\\\"row\\\">\\n      <div>\\n        <h6>\\n          <translate>Contact name</translate>\\n        </h6>\\n        <p>{{vm.project.contact_name}}</p>\\n      </div>\\n\\n      <div>\\n        <h6>\\n          <translate>Contact email</translate>\\n        </h6>\\n        <p>{{vm.project.contact_email}}</p>\\n      </div>\\n    </div>\\n  </div>\\n\\n  <div class=\\\"section-wrapper alt\\\">\\n    <h6 class=\\\"first\\\">Team members (Editor role)</h6>\\n\\n    <div class=\\\"readonly-chipper\\\">\\n      <div ng-repeat=\\\"t in vm.team\\\">\\n        {{t.name}}\\n        <span ng-if=\\\"!$last\\\">,</span>\\n      </div>\\n    </div>\\n\\n\\n    <h6>\\n      <translate>Viewers (only Viewer role)</translate>\\n    </h6>\\n\\n    <div class=\\\"readonly-chipper\\\">\\n      <div ng-repeat=\\\"v in vm.viewers\\\">\\n        {{v.name}}\\n        <span ng-if=\\\"!$last\\\">,</span>\\n      </div>\\n    </div>\\n  </div>\\n</div>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9HZW5lcmFsT3ZlcnZpZXcvUmVhZE9ubHlHZW5lcmFsT3ZlcnZpZXcuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Qcm9qZWN0L0dlbmVyYWxPdmVydmlldy9SZWFkT25seUdlbmVyYWxPdmVydmlldy5odG1sP2IwZTIiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcInByb2plY3Qtc2VjdGlvbiBzZWN0aW9uLXByb2plY3RkZXRhaWxzIHJlYWQtb25seSBhY3RpdmVcXFwiIG1kLXdoaXRlZnJhbWU9XFxcIjJcXFwiPlxcblxcbiAgPGRpdiBjbGFzcz1cXFwic2VjdGlvbi10aXRsZSBtZC10aXRsZVxcXCI+XFxuICAgIDx0cmFuc2xhdGU+MS4gR2VuZXJhbCBvdmVydmlldzwvdHJhbnNsYXRlPlxcbiAgICA8c3BhbiBjbGFzcz1cXFwidG9nZ2xlclxcXCIgbmctY2xpY2s9XFxcInZtLmNvbGxhcHNlKClcXFwiPjxpIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+a2V5Ym9hcmRfYXJyb3dfZG93bjwvaT48L3NwYW4+XFxuICA8L2Rpdj5cXG5cXG4gIDxkaXYgY2xhc3M9XFxcInNlY3Rpb24td3JhcHBlclxcXCI+XFxuICAgIDxkaXY+XFxuICAgICAgPGg2PlxcbiAgICAgICAgPHRyYW5zbGF0ZT5Qcm9qZWN0IG5hbWU8L3RyYW5zbGF0ZT5cXG4gICAgICA8L2g2PlxcbiAgICAgIDxwPnt7dm0ucHJvamVjdC5uYW1lfX08L3A+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2PlxcbiAgICAgIDxoNj5cXG4gICAgICAgIDx0cmFuc2xhdGU+T3JnYW5pc2F0aW9uIG5hbWU8L3RyYW5zbGF0ZT5cXG4gICAgICA8L2g2PlxcbiAgICAgIDxwPnt7dm0ucHJvamVjdC5vcmdhbmlzYXRpb25fbmFtZX19PC9wPlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdj5cXG4gICAgICA8aDY+XFxuICAgICAgICA8dHJhbnNsYXRlPlByb2plY3QgY291bnRyeTwvdHJhbnNsYXRlPlxcbiAgICAgIDwvaDY+XFxuICAgICAgPHA+e3t2bS5wcm9qZWN0LmNvdW50cnlfbmFtZX19PC9wPlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdj5cXG4gICAgICA8aDY+XFxuICAgICAgICA8dHJhbnNsYXRlPkdlb2dyYXBoaWMgc2NvcGU8L3RyYW5zbGF0ZT5cXG4gICAgICA8L2g2PlxcbiAgICAgIDxwPnt7dm0ucHJvamVjdC5nZW9ncmFwaGljX3Njb3BlfX08L3A+XFxuICAgIDwvZGl2PlxcblxcblxcbiAgICA8ZGl2PlxcbiAgICAgIDxoNj5cXG4gICAgICAgIDx0cmFuc2xhdGU+T3ZlcnZpZXcgb2YgdGhlIGRpZ2l0YWwgaGVhbHRoIGltcGxlbWVudGF0aW9uPC90cmFuc2xhdGU+XFxuICAgICAgPC9oNj5cXG4gICAgICA8cD57e3ZtLnByb2plY3QuaW1wbGVtZW50YXRpb25fb3ZlcnZpZXd9fTwvcD5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXYgbGF5b3V0PVxcXCJyb3dcXFwiPlxcbiAgICAgIDxkaXY+XFxuICAgICAgICA8aDY+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+UHJvamVjdCBzdGFydCBkYXRlPC90cmFuc2xhdGU+XFxuICAgICAgICA8L2g2PlxcbiAgICAgICAgPHA+e3t2bS5wcmludERhdGUodm0ucHJvamVjdC5zdGFydF9kYXRlKX19PC9wPlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxkaXY+XFxuICAgICAgICA8aDY+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+UHJvamVjdCBlbmQgZGF0ZTwvdHJhbnNsYXRlPlxcbiAgICAgICAgPC9oNj5cXG4gICAgICAgIDxwPnt7dm0ucHJpbnREYXRlKHZtLnByb2plY3QuZW5kX2RhdGUpfX08L3A+XFxuICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2IGxheW91dD1cXFwicm93XFxcIj5cXG4gICAgICA8ZGl2PlxcbiAgICAgICAgPGg2PlxcbiAgICAgICAgICA8dHJhbnNsYXRlPkNvbnRhY3QgbmFtZTwvdHJhbnNsYXRlPlxcbiAgICAgICAgPC9oNj5cXG4gICAgICAgIDxwPnt7dm0ucHJvamVjdC5jb250YWN0X25hbWV9fTwvcD5cXG4gICAgICA8L2Rpdj5cXG5cXG4gICAgICA8ZGl2PlxcbiAgICAgICAgPGg2PlxcbiAgICAgICAgICA8dHJhbnNsYXRlPkNvbnRhY3QgZW1haWw8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvaDY+XFxuICAgICAgICA8cD57e3ZtLnByb2plY3QuY29udGFjdF9lbWFpbH19PC9wPlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gIDwvZGl2PlxcblxcbiAgPGRpdiBjbGFzcz1cXFwic2VjdGlvbi13cmFwcGVyIGFsdFxcXCI+XFxuICAgIDxoNiBjbGFzcz1cXFwiZmlyc3RcXFwiPlRlYW0gbWVtYmVycyAoRWRpdG9yIHJvbGUpPC9oNj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwicmVhZG9ubHktY2hpcHBlclxcXCI+XFxuICAgICAgPGRpdiBuZy1yZXBlYXQ9XFxcInQgaW4gdm0udGVhbVxcXCI+XFxuICAgICAgICB7e3QubmFtZX19XFxuICAgICAgICA8c3BhbiBuZy1pZj1cXFwiISRsYXN0XFxcIj4sPC9zcGFuPlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG5cXG5cXG4gICAgPGg2PlxcbiAgICAgIDx0cmFuc2xhdGU+Vmlld2VycyAob25seSBWaWV3ZXIgcm9sZSk8L3RyYW5zbGF0ZT5cXG4gICAgPC9oNj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwicmVhZG9ubHktY2hpcHBlclxcXCI+XFxuICAgICAgPGRpdiBuZy1yZXBlYXQ9XFxcInYgaW4gdm0udmlld2Vyc1xcXCI+XFxuICAgICAgICB7e3YubmFtZX19XFxuICAgICAgICA8c3BhbiBuZy1pZj1cXFwiISRsYXN0XFxcIj4sPC9zcGFuPlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gIDwvZGl2PlxcbjwvZGl2PlxcblwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Project/GeneralOverview/ReadOnlyGeneralOverview.html\n");

/***/ }),

/***/ "./src/Project/GeneralOverview/generalOverviewComponent.js":
/*!*****************************************************************!*\
  !*** ./src/Project/GeneralOverview/generalOverviewComponent.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.readOnlyGeneralOverview = undefined;\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _GeneralOverview = __webpack_require__(/*! ./GeneralOverview.html */ \"./src/Project/GeneralOverview/GeneralOverview.html\");\n\nvar _GeneralOverview2 = _interopRequireDefault(_GeneralOverview);\n\nvar _ReadOnlyGeneralOverview = __webpack_require__(/*! ./ReadOnlyGeneralOverview.html */ \"./src/Project/GeneralOverview/ReadOnlyGeneralOverview.html\");\n\nvar _ReadOnlyGeneralOverview2 = _interopRequireDefault(_ReadOnlyGeneralOverview);\n\nvar _GeneralOverviewController = __webpack_require__(/*! ./GeneralOverviewController */ \"./src/Project/GeneralOverview/GeneralOverviewController.js\");\n\nvar _GeneralOverviewController2 = _interopRequireDefault(_GeneralOverviewController);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar component = {\n    template: _GeneralOverview2.default,\n    controller: _GeneralOverviewController2.default.factory(),\n    controllerAs: 'vm',\n    name: 'generalOverview',\n    bindings: {\n        form: '<',\n        project: '<',\n        structure: '<',\n        team: '<',\n        viewers: '<',\n        users: '<',\n        activateValidation: '<'\n    }\n};\n\nexports.default = component;\nvar readOnlyGeneralOverview = exports.readOnlyGeneralOverview = _extends({}, component, { template: _ReadOnlyGeneralOverview2.default, name: 'readOnlyGeneralOverview' });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9HZW5lcmFsT3ZlcnZpZXcvZ2VuZXJhbE92ZXJ2aWV3Q29tcG9uZW50LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9Qcm9qZWN0L0dlbmVyYWxPdmVydmlldy9nZW5lcmFsT3ZlcnZpZXdDb21wb25lbnQuanM/OWE1MyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgX3RlbXBsYXRlIGZyb20gJy4vR2VuZXJhbE92ZXJ2aWV3Lmh0bWwnO1xuaW1wb3J0IF9yZWFkT25seVRlbXBsYXRlIGZyb20gJy4vUmVhZE9ubHlHZW5lcmFsT3ZlcnZpZXcuaHRtbCc7XG5pbXBvcnQgUHJvamVjdERldGFpbHNDb250cm9sbGVyIGZyb20gJy4vR2VuZXJhbE92ZXJ2aWV3Q29udHJvbGxlcic7XG5cbmNvbnN0IGNvbXBvbmVudCA9IHtcbiAgICB0ZW1wbGF0ZTogX3RlbXBsYXRlLFxuICAgIGNvbnRyb2xsZXI6IFByb2plY3REZXRhaWxzQ29udHJvbGxlci5mYWN0b3J5KCksXG4gICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgIG5hbWU6ICdnZW5lcmFsT3ZlcnZpZXcnLFxuICAgIGJpbmRpbmdzOiB7XG4gICAgICAgIGZvcm06ICc8JyxcbiAgICAgICAgcHJvamVjdDogJzwnLFxuICAgICAgICBzdHJ1Y3R1cmU6ICc8JyxcbiAgICAgICAgdGVhbTogJzwnLFxuICAgICAgICB2aWV3ZXJzOiAnPCcsXG4gICAgICAgIHVzZXJzOiAnPCcsXG4gICAgICAgIGFjdGl2YXRlVmFsaWRhdGlvbjogJzwnXG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29tcG9uZW50O1xuZXhwb3J0IGNvbnN0IHJlYWRPbmx5R2VuZXJhbE92ZXJ2aWV3ID0geyAuLi5jb21wb25lbnQsIHRlbXBsYXRlOiBfcmVhZE9ubHlUZW1wbGF0ZSwgbmFtZTogJ3JlYWRPbmx5R2VuZXJhbE92ZXJ2aWV3JyB9O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFMQTtBQUNBO0FBZUE7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/Project/GeneralOverview/generalOverviewComponent.js\n");

/***/ })

}]);