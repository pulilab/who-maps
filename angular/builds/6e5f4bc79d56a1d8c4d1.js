(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[534],{

/***/ "./src/MyProjects/MyProjectList/MyProjectList.html":
/*!*********************************************************!*\
  !*** ./src/MyProjects/MyProjectList/MyProjectList.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<div layout=\\\"column\\\" layout-align=\\\"start center\\\">\\n\\n  <div class=\\\"page-title\\\">\\n    <h1 class=\\\"md-display-1 text-center\\\">\\n      <translate>Projects list</translate>\\n    </h1>\\n    <h6 class=\\\"md-subhead text-center\\\">\\n      <translate>List of all the projects you are a </translate>\\n      <md-icon class=\\\"material-icons\\\">star_rate</md-icon>\\n      <translate><b>Member</b> or</translate>\\n      <md-icon class=\\\"material-icons\\\">visibility</md-icon>\\n      <translate><b>Viewer</b> of. </translate>\\n    </h6>\\n  </div>\\n\\n  <div class=\\\"wrapper\\\" layout=\\\"column\\\">\\n    <md-card md-whiteframe=\\\"2\\\" flex class=\\\"no-projects\\\" ng-show=\\\"!vm.projects || vm.projects.length === 0\\\">\\n      <div class=\\\"emptychild\\\" layout=\\\"column\\\" layout-align=\\\"start center\\\" >\\n        <md-button class=\\\"md-raised\\\" aria-label=\\\"start new project\\\" ui-sref=\\\"newProject\\\">\\n          <translate>add new project</translate>\\n        </md-button>\\n        <p>\\n          <translate>\\n            to include your project in the inventory and begin tracking your performance\\n          </translate>\\n        </p>\\n      </div>\\n    </md-card>\\n    <project-component\\n      ng-repeat=\\\"p in vm.projects\\\"\\n      show-details=\\\"true\\\"\\n      project=\\\"p\\\"\\n      show-version=\\\"true\\\">\\n    </project-component>\\n  </div>\\n\\n  <disclaimer></disclaimer>\\n\\n</div>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTXlQcm9qZWN0cy9NeVByb2plY3RMaXN0L015UHJvamVjdExpc3QuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NeVByb2plY3RzL015UHJvamVjdExpc3QvTXlQcm9qZWN0TGlzdC5odG1sPzRlOTYiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgbGF5b3V0PVxcXCJjb2x1bW5cXFwiIGxheW91dC1hbGlnbj1cXFwic3RhcnQgY2VudGVyXFxcIj5cXG5cXG4gIDxkaXYgY2xhc3M9XFxcInBhZ2UtdGl0bGVcXFwiPlxcbiAgICA8aDEgY2xhc3M9XFxcIm1kLWRpc3BsYXktMSB0ZXh0LWNlbnRlclxcXCI+XFxuICAgICAgPHRyYW5zbGF0ZT5Qcm9qZWN0cyBsaXN0PC90cmFuc2xhdGU+XFxuICAgIDwvaDE+XFxuICAgIDxoNiBjbGFzcz1cXFwibWQtc3ViaGVhZCB0ZXh0LWNlbnRlclxcXCI+XFxuICAgICAgPHRyYW5zbGF0ZT5MaXN0IG9mIGFsbCB0aGUgcHJvamVjdHMgeW91IGFyZSBhIDwvdHJhbnNsYXRlPlxcbiAgICAgIDxtZC1pY29uIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+c3Rhcl9yYXRlPC9tZC1pY29uPlxcbiAgICAgIDx0cmFuc2xhdGU+PGI+TWVtYmVyPC9iPiBvcjwvdHJhbnNsYXRlPlxcbiAgICAgIDxtZC1pY29uIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+dmlzaWJpbGl0eTwvbWQtaWNvbj5cXG4gICAgICA8dHJhbnNsYXRlPjxiPlZpZXdlcjwvYj4gb2YuIDwvdHJhbnNsYXRlPlxcbiAgICA8L2g2PlxcbiAgPC9kaXY+XFxuXFxuICA8ZGl2IGNsYXNzPVxcXCJ3cmFwcGVyXFxcIiBsYXlvdXQ9XFxcImNvbHVtblxcXCI+XFxuICAgIDxtZC1jYXJkIG1kLXdoaXRlZnJhbWU9XFxcIjJcXFwiIGZsZXggY2xhc3M9XFxcIm5vLXByb2plY3RzXFxcIiBuZy1zaG93PVxcXCIhdm0ucHJvamVjdHMgfHwgdm0ucHJvamVjdHMubGVuZ3RoID09PSAwXFxcIj5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJlbXB0eWNoaWxkXFxcIiBsYXlvdXQ9XFxcImNvbHVtblxcXCIgbGF5b3V0LWFsaWduPVxcXCJzdGFydCBjZW50ZXJcXFwiID5cXG4gICAgICAgIDxtZC1idXR0b24gY2xhc3M9XFxcIm1kLXJhaXNlZFxcXCIgYXJpYS1sYWJlbD1cXFwic3RhcnQgbmV3IHByb2plY3RcXFwiIHVpLXNyZWY9XFxcIm5ld1Byb2plY3RcXFwiPlxcbiAgICAgICAgICA8dHJhbnNsYXRlPmFkZCBuZXcgcHJvamVjdDwvdHJhbnNsYXRlPlxcbiAgICAgICAgPC9tZC1idXR0b24+XFxuICAgICAgICA8cD5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5cXG4gICAgICAgICAgICB0byBpbmNsdWRlIHlvdXIgcHJvamVjdCBpbiB0aGUgaW52ZW50b3J5IGFuZCBiZWdpbiB0cmFja2luZyB5b3VyIHBlcmZvcm1hbmNlXFxuICAgICAgICAgIDwvdHJhbnNsYXRlPlxcbiAgICAgICAgPC9wPlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L21kLWNhcmQ+XFxuICAgIDxwcm9qZWN0LWNvbXBvbmVudFxcbiAgICAgIG5nLXJlcGVhdD1cXFwicCBpbiB2bS5wcm9qZWN0c1xcXCJcXG4gICAgICBzaG93LWRldGFpbHM9XFxcInRydWVcXFwiXFxuICAgICAgcHJvamVjdD1cXFwicFxcXCJcXG4gICAgICBzaG93LXZlcnNpb249XFxcInRydWVcXFwiPlxcbiAgICA8L3Byb2plY3QtY29tcG9uZW50PlxcbiAgPC9kaXY+XFxuXFxuICA8ZGlzY2xhaW1lcj48L2Rpc2NsYWltZXI+XFxuXFxuPC9kaXY+XFxuXCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MyProjects/MyProjectList/MyProjectList.html\n");

/***/ })

}]);