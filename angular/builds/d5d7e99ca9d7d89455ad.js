(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[575],{

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Project/Navigation/Navigation.scss":
/*!*****************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js!./src/Project/Navigation/Navigation.scss ***!
  \*****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: No PostCSS Config found in: /Users/nico/Projects/who-maps/frontend/src/Project/Navigation\\n    at /Users/nico/Projects/who-maps/frontend/node_modules/postcss-load-config/index.js:51:26\\n    at <anonymous>\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3NyYy9Qcm9qZWN0L05hdmlnYXRpb24vTmF2aWdhdGlvbi5zY3NzLmpzIiwic291cmNlcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Project/Navigation/Navigation.scss\n");

/***/ }),

/***/ "./src/Project/Navigation/Navigation.html":
/*!************************************************!*\
  !*** ./src/Project/Navigation/Navigation.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<div class=\\\"project-section project-navigation\\\" md-whiteframe=\\\"2\\\">\\n  <div class=\\\"section-title md-title\\\">\\n    <translate>Navigation</translate>\\n  </div>\\n  <div class=\\\"edit-mode-switch\\\" layout=\\\"row\\\" layout-align=\\\"start center\\\" ng-if=\\\"vm.state.current.name === 'editProject'\\\">\\n    <div>\\n      <translate>Switch view:</translate>\\n    </div>\\n    <div layout=\\\"row\\\" layout-align=\\\"start stretch\\\">\\n      <div>\\n        <button type=\\\"button\\\" ng-click=\\\"vm.goTo('draft')\\\"  class=\\\"draft\\\" ng-class=\\\"{'active': vm.state.params.editMode === 'draft'}\\\">\\n          <md-tooltip md-autohide md-direction=\\\"top\\\" ng-if=\\\"vm.project.disableDraft\\\">\\n            <translate>You are not allowed to access the draft</translate>\\n          </md-tooltip>\\n          <translate>Draft</translate>\\n        </button>\\n      </div>\\n      <div>\\n        <button type=\\\"button\\\"\\n                ng-click=\\\"vm.goTo('publish')\\\" class=\\\"publish\\\" ng-class=\\\"{'active': vm.state.params.editMode === 'publish'}\\\">\\n          <md-tooltip md-autohide md-direction=\\\"top\\\" ng-if=\\\"!vm.project.hasPublishedVersion\\\">\\n            <translate>There is no published version</translate>\\n          </md-tooltip>\\n          <translate>Published</translate>\\n        </button>\\n      </div>\\n    </div>\\n  </div>\\n  <div layout=\\\"column\\\" class=\\\"stepper\\\">\\n    <ul>\\n      <li class=\\\"general-overview active\\\">\\n        <a ng-click=\\\"vm.scrollTo('general-overview')\\\">\\n          <span class=\\\"step\\\">\\n            <i class=\\\"material-icons\\\">&#xE5C8;</i>\\n          </span>\\n          <translate>General</translate>\\n        </a>\\n      </li>\\n      <li class=\\\"implementation-overview\\\">\\n        <a ng-click=\\\"vm.scrollTo('implementation-overview')\\\">\\n          <span class=\\\"step\\\">\\n            <i class=\\\"material-icons\\\">&#xE5C8;</i>\\n          </span>\\n          <translate>Implementation</translate>\\n        </a>\\n      </li>\\n      <li class=\\\"technology\\\">\\n        <a ng-click=\\\"vm.scrollTo('technology')\\\">\\n          <span class=\\\"step\\\">\\n            <i class=\\\"material-icons\\\">&#xE5C8;</i>\\n          </span>\\n          <translate>Technology</translate>\\n        </a>\\n      </li>\\n      <li class=\\\"interoperability\\\">\\n        <a ng-click=\\\"vm.scrollTo('interoperability')\\\">\\n          <span class=\\\"step\\\">\\n            <i class=\\\"material-icons\\\">&#xE5C8;</i>\\n          </span>\\n          <translate>Interoperability</translate>\\n        </a>\\n      </li>\\n      <li class=\\\"country-fields\\\" ng-show=\\\"vm.countryFields && vm.countryFields.length > 0\\\">\\n        <a ng-click=\\\"vm.scrollTo('country-fields')\\\">\\n          <span class=\\\"step\\\">\\n            <i class=\\\"material-icons\\\">&#xE5C8;</i>\\n          </span>\\n          <translate>Country fields</translate>\\n        </a>\\n      </li>\\n    </ul>\\n  </div>\\n  <div layout=\\\"column\\\" class=\\\"edit-buttons\\\" ng-if=\\\"vm.isTeam || vm.state.current.name === 'newProject'\\\">\\n    <div class=\\\"primary-buttons\\\" ng-if-start=\\\"vm.state.params.editMode === 'draft' && vm.state.current.name === 'editProject'\\\">\\n      <md-button type=\\\"submit\\\" class=\\\"md-primary md-raised\\\">\\n        <translate>Publish</translate>\\n      </md-button>\\n    </div>\\n    <div class=\\\"secondary-buttons\\\">\\n      <md-button class=\\\"md-primary\\\" ng-click=\\\"vm.saveDraftEvent($event)\\\">\\n        <translate>Save draft</translate>\\n      </md-button>\\n    </div>\\n    <div ng-if-end class=\\\"secondary-buttons\\\" ng-show=\\\"vm.project.hasPublishedVersion\\\">\\n      <md-button class=\\\"md-warn\\\" ng-click=\\\"vm.discardDraftEvent($event)\\\">\\n        <translate>Discard draft</translate>\\n      </md-button>\\n    </div>\\n    <div class=\\\"primary-buttons\\\" ng-if=\\\"vm.state.current.name === 'newProject'\\\">\\n      <md-button class=\\\"md-primary md-raised\\\" ng-click=\\\"vm.saveDraftEvent($event)\\\">\\n        <translate>Save draft</translate>\\n      </md-button>\\n    </div>\\n    <div class=\\\"secondary-buttons\\\" ng-if=\\\"vm.state.params.editMode === 'publish' || vm.state.current.name === 'newProject'\\\">\\n      <md-button class=\\\"md-primary\\\" ui-sref=\\\"dashboard\\\">\\n        <translate>Go to dashboard</translate>\\n      </md-button>\\n    </div>\\n  </div>\\n</div>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9OYXZpZ2F0aW9uL05hdmlnYXRpb24uaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Qcm9qZWN0L05hdmlnYXRpb24vTmF2aWdhdGlvbi5odG1sPzQ5NjkiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcInByb2plY3Qtc2VjdGlvbiBwcm9qZWN0LW5hdmlnYXRpb25cXFwiIG1kLXdoaXRlZnJhbWU9XFxcIjJcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwic2VjdGlvbi10aXRsZSBtZC10aXRsZVxcXCI+XFxuICAgIDx0cmFuc2xhdGU+TmF2aWdhdGlvbjwvdHJhbnNsYXRlPlxcbiAgPC9kaXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJlZGl0LW1vZGUtc3dpdGNoXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJzdGFydCBjZW50ZXJcXFwiIG5nLWlmPVxcXCJ2bS5zdGF0ZS5jdXJyZW50Lm5hbWUgPT09ICdlZGl0UHJvamVjdCdcXFwiPlxcbiAgICA8ZGl2PlxcbiAgICAgIDx0cmFuc2xhdGU+U3dpdGNoIHZpZXc6PC90cmFuc2xhdGU+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtYWxpZ249XFxcInN0YXJ0IHN0cmV0Y2hcXFwiPlxcbiAgICAgIDxkaXY+XFxuICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcInZtLmdvVG8oJ2RyYWZ0JylcXFwiICBjbGFzcz1cXFwiZHJhZnRcXFwiIG5nLWNsYXNzPVxcXCJ7J2FjdGl2ZSc6IHZtLnN0YXRlLnBhcmFtcy5lZGl0TW9kZSA9PT0gJ2RyYWZ0J31cXFwiPlxcbiAgICAgICAgICA8bWQtdG9vbHRpcCBtZC1hdXRvaGlkZSBtZC1kaXJlY3Rpb249XFxcInRvcFxcXCIgbmctaWY9XFxcInZtLnByb2plY3QuZGlzYWJsZURyYWZ0XFxcIj5cXG4gICAgICAgICAgICA8dHJhbnNsYXRlPllvdSBhcmUgbm90IGFsbG93ZWQgdG8gYWNjZXNzIHRoZSBkcmFmdDwvdHJhbnNsYXRlPlxcbiAgICAgICAgICA8L21kLXRvb2x0aXA+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+RHJhZnQ8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvYnV0dG9uPlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxkaXY+XFxuICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCJcXG4gICAgICAgICAgICAgICAgbmctY2xpY2s9XFxcInZtLmdvVG8oJ3B1Ymxpc2gnKVxcXCIgY2xhc3M9XFxcInB1Ymxpc2hcXFwiIG5nLWNsYXNzPVxcXCJ7J2FjdGl2ZSc6IHZtLnN0YXRlLnBhcmFtcy5lZGl0TW9kZSA9PT0gJ3B1Ymxpc2gnfVxcXCI+XFxuICAgICAgICAgIDxtZC10b29sdGlwIG1kLWF1dG9oaWRlIG1kLWRpcmVjdGlvbj1cXFwidG9wXFxcIiBuZy1pZj1cXFwiIXZtLnByb2plY3QuaGFzUHVibGlzaGVkVmVyc2lvblxcXCI+XFxuICAgICAgICAgICAgPHRyYW5zbGF0ZT5UaGVyZSBpcyBubyBwdWJsaXNoZWQgdmVyc2lvbjwvdHJhbnNsYXRlPlxcbiAgICAgICAgICA8L21kLXRvb2x0aXA+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+UHVibGlzaGVkPC90cmFuc2xhdGU+XFxuICAgICAgICA8L2J1dHRvbj5cXG4gICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICA8L2Rpdj5cXG4gIDxkaXYgbGF5b3V0PVxcXCJjb2x1bW5cXFwiIGNsYXNzPVxcXCJzdGVwcGVyXFxcIj5cXG4gICAgPHVsPlxcbiAgICAgIDxsaSBjbGFzcz1cXFwiZ2VuZXJhbC1vdmVydmlldyBhY3RpdmVcXFwiPlxcbiAgICAgICAgPGEgbmctY2xpY2s9XFxcInZtLnNjcm9sbFRvKCdnZW5lcmFsLW92ZXJ2aWV3JylcXFwiPlxcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwic3RlcFxcXCI+XFxuICAgICAgICAgICAgPGkgY2xhc3M9XFxcIm1hdGVyaWFsLWljb25zXFxcIj4mI3hFNUM4OzwvaT5cXG4gICAgICAgICAgPC9zcGFuPlxcbiAgICAgICAgICA8dHJhbnNsYXRlPkdlbmVyYWw8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvYT5cXG4gICAgICA8L2xpPlxcbiAgICAgIDxsaSBjbGFzcz1cXFwiaW1wbGVtZW50YXRpb24tb3ZlcnZpZXdcXFwiPlxcbiAgICAgICAgPGEgbmctY2xpY2s9XFxcInZtLnNjcm9sbFRvKCdpbXBsZW1lbnRhdGlvbi1vdmVydmlldycpXFxcIj5cXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInN0ZXBcXFwiPlxcbiAgICAgICAgICAgIDxpIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+JiN4RTVDODs8L2k+XFxuICAgICAgICAgIDwvc3Bhbj5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5JbXBsZW1lbnRhdGlvbjwvdHJhbnNsYXRlPlxcbiAgICAgICAgPC9hPlxcbiAgICAgIDwvbGk+XFxuICAgICAgPGxpIGNsYXNzPVxcXCJ0ZWNobm9sb2d5XFxcIj5cXG4gICAgICAgIDxhIG5nLWNsaWNrPVxcXCJ2bS5zY3JvbGxUbygndGVjaG5vbG9neScpXFxcIj5cXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInN0ZXBcXFwiPlxcbiAgICAgICAgICAgIDxpIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+JiN4RTVDODs8L2k+XFxuICAgICAgICAgIDwvc3Bhbj5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5UZWNobm9sb2d5PC90cmFuc2xhdGU+XFxuICAgICAgICA8L2E+XFxuICAgICAgPC9saT5cXG4gICAgICA8bGkgY2xhc3M9XFxcImludGVyb3BlcmFiaWxpdHlcXFwiPlxcbiAgICAgICAgPGEgbmctY2xpY2s9XFxcInZtLnNjcm9sbFRvKCdpbnRlcm9wZXJhYmlsaXR5JylcXFwiPlxcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwic3RlcFxcXCI+XFxuICAgICAgICAgICAgPGkgY2xhc3M9XFxcIm1hdGVyaWFsLWljb25zXFxcIj4mI3hFNUM4OzwvaT5cXG4gICAgICAgICAgPC9zcGFuPlxcbiAgICAgICAgICA8dHJhbnNsYXRlPkludGVyb3BlcmFiaWxpdHk8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvYT5cXG4gICAgICA8L2xpPlxcbiAgICAgIDxsaSBjbGFzcz1cXFwiY291bnRyeS1maWVsZHNcXFwiIG5nLXNob3c9XFxcInZtLmNvdW50cnlGaWVsZHMgJiYgdm0uY291bnRyeUZpZWxkcy5sZW5ndGggPiAwXFxcIj5cXG4gICAgICAgIDxhIG5nLWNsaWNrPVxcXCJ2bS5zY3JvbGxUbygnY291bnRyeS1maWVsZHMnKVxcXCI+XFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJzdGVwXFxcIj5cXG4gICAgICAgICAgICA8aSBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnNcXFwiPiYjeEU1Qzg7PC9pPlxcbiAgICAgICAgICA8L3NwYW4+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+Q291bnRyeSBmaWVsZHM8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvYT5cXG4gICAgICA8L2xpPlxcbiAgICA8L3VsPlxcbiAgPC9kaXY+XFxuICA8ZGl2IGxheW91dD1cXFwiY29sdW1uXFxcIiBjbGFzcz1cXFwiZWRpdC1idXR0b25zXFxcIiBuZy1pZj1cXFwidm0uaXNUZWFtIHx8IHZtLnN0YXRlLmN1cnJlbnQubmFtZSA9PT0gJ25ld1Byb2plY3QnXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwicHJpbWFyeS1idXR0b25zXFxcIiBuZy1pZi1zdGFydD1cXFwidm0uc3RhdGUucGFyYW1zLmVkaXRNb2RlID09PSAnZHJhZnQnICYmIHZtLnN0YXRlLmN1cnJlbnQubmFtZSA9PT0gJ2VkaXRQcm9qZWN0J1xcXCI+XFxuICAgICAgPG1kLWJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiIGNsYXNzPVxcXCJtZC1wcmltYXJ5IG1kLXJhaXNlZFxcXCI+XFxuICAgICAgICA8dHJhbnNsYXRlPlB1Ymxpc2g8L3RyYW5zbGF0ZT5cXG4gICAgICA8L21kLWJ1dHRvbj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInNlY29uZGFyeS1idXR0b25zXFxcIj5cXG4gICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5XFxcIiBuZy1jbGljaz1cXFwidm0uc2F2ZURyYWZ0RXZlbnQoJGV2ZW50KVxcXCI+XFxuICAgICAgICA8dHJhbnNsYXRlPlNhdmUgZHJhZnQ8L3RyYW5zbGF0ZT5cXG4gICAgICA8L21kLWJ1dHRvbj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgbmctaWYtZW5kIGNsYXNzPVxcXCJzZWNvbmRhcnktYnV0dG9uc1xcXCIgbmctc2hvdz1cXFwidm0ucHJvamVjdC5oYXNQdWJsaXNoZWRWZXJzaW9uXFxcIj5cXG4gICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC13YXJuXFxcIiBuZy1jbGljaz1cXFwidm0uZGlzY2FyZERyYWZ0RXZlbnQoJGV2ZW50KVxcXCI+XFxuICAgICAgICA8dHJhbnNsYXRlPkRpc2NhcmQgZHJhZnQ8L3RyYW5zbGF0ZT5cXG4gICAgICA8L21kLWJ1dHRvbj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInByaW1hcnktYnV0dG9uc1xcXCIgbmctaWY9XFxcInZtLnN0YXRlLmN1cnJlbnQubmFtZSA9PT0gJ25ld1Byb2plY3QnXFxcIj5cXG4gICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5IG1kLXJhaXNlZFxcXCIgbmctY2xpY2s9XFxcInZtLnNhdmVEcmFmdEV2ZW50KCRldmVudClcXFwiPlxcbiAgICAgICAgPHRyYW5zbGF0ZT5TYXZlIGRyYWZ0PC90cmFuc2xhdGU+XFxuICAgICAgPC9tZC1idXR0b24+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJzZWNvbmRhcnktYnV0dG9uc1xcXCIgbmctaWY9XFxcInZtLnN0YXRlLnBhcmFtcy5lZGl0TW9kZSA9PT0gJ3B1Ymxpc2gnIHx8IHZtLnN0YXRlLmN1cnJlbnQubmFtZSA9PT0gJ25ld1Byb2plY3QnXFxcIj5cXG4gICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5XFxcIiB1aS1zcmVmPVxcXCJkYXNoYm9hcmRcXFwiPlxcbiAgICAgICAgPHRyYW5zbGF0ZT5HbyB0byBkYXNoYm9hcmQ8L3RyYW5zbGF0ZT5cXG4gICAgICA8L21kLWJ1dHRvbj5cXG4gICAgPC9kaXY+XFxuICA8L2Rpdj5cXG48L2Rpdj5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Project/Navigation/Navigation.html\n");

/***/ }),

/***/ "./src/Project/Navigation/Navigation.scss":
/*!************************************************!*\
  !*** ./src/Project/Navigation/Navigation.scss ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/postcss-loader/lib!../../../node_modules/sass-loader/lib/loader.js!./Navigation.scss */ \"./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Project/Navigation/Navigation.scss\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9OYXZpZ2F0aW9uL05hdmlnYXRpb24uc2Nzcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Qcm9qZWN0L05hdmlnYXRpb24vTmF2aWdhdGlvbi5zY3NzP2Y2ZGIiXSwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9OYXZpZ2F0aW9uLnNjc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9OYXZpZ2F0aW9uLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vTmF2aWdhdGlvbi5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Project/Navigation/Navigation.scss\n");

/***/ }),

/***/ "./src/Project/Navigation/NavigationController.js":
/*!********************************************************!*\
  !*** ./src/Project/Navigation/NavigationController.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _forEach = __webpack_require__(/*! lodash/forEach */ \"./node_modules/lodash/forEach.js\");\n\nvar _forEach2 = _interopRequireDefault(_forEach);\n\nvar _projects = __webpack_require__(/*! ../../store/modules/projects */ \"./src/store/modules/projects.js\");\n\nvar ProjectModule = _interopRequireWildcard(_projects);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar NavigationController = function () {\n    function NavigationController($element, $state, $ngRedux) {\n        _classCallCheck(this, NavigationController);\n\n        this.EE = window.EE;\n        this.element = $element;\n        this.state = $state;\n        this.$ngRedux = $ngRedux;\n        this.scrollTo = this.scrollTo.bind(this);\n        this.$onInit = this.onInit.bind(this);\n        this.$onDestroy = this.onDestroy.bind(this);\n        this.scrollHandler = this.scrollHandler.bind(this);\n        this.mapState = this.mapState.bind(this);\n    }\n\n    _createClass(NavigationController, [{\n        key: 'onInit',\n        value: function onInit() {\n            this.content = window.document.getElementsByClassName('main-content')[0];\n            this.content.addEventListener('scroll', this.scrollHandler);\n            this.EE.on('activateFieldSet', this.activateNavigation, this);\n            this.unsubscribe = this.$ngRedux.connect(this.mapState, ProjectModule)(this);\n        }\n    }, {\n        key: 'onDestroy',\n        value: function onDestroy() {\n            this.EE.removeListener('activateFieldSet', this.activateNavigation);\n            this.unsubscribe();\n        }\n    }, {\n        key: 'mapState',\n        value: function mapState(state) {\n            var countryFields = ProjectModule.getProjectCountryFields(state)(!this.isPublished);\n            return {\n                countryFields: countryFields\n            };\n        }\n    }, {\n        key: 'activateNavigation',\n        value: function activateNavigation(hash) {\n            var navigation = this.element[0].getElementsByTagName('li');\n            (0, _forEach2.default)(navigation, function (element) {\n                if (element.classList.contains(hash)) {\n                    element.classList.add('active');\n                } else {\n                    element.classList.remove('active');\n                }\n            });\n        }\n    }, {\n        key: 'scrollHandler',\n        value: function scrollHandler() {\n            if (this.content.scrollTop > 260) {\n                this.element[0].style.position = 'fixed';\n                this.element[0].style.top = '70px';\n            } else {\n                this.element[0].style.position = 'absolute';\n                this.element[0].style.top = '0px';\n            }\n        }\n    }, {\n        key: 'scrollTo',\n        value: function scrollTo(hash) {\n            this.EE.emit('projectScrollTo', hash);\n        }\n    }, {\n        key: 'goTo',\n        value: function goTo(editMode) {\n            if (editMode === 'draft' && !this.project.disableDraft || editMode === 'publish' && this.project.hasPublishedVersion) {\n                this.state.go(this.state.current.name, { editMode: editMode });\n            }\n        }\n    }, {\n        key: 'saveDraftEvent',\n        value: function saveDraftEvent(e) {\n            e.preventDefault();\n            this.EE.emit('projectSaveDraft');\n        }\n    }, {\n        key: 'discardDraftEvent',\n        value: function discardDraftEvent(e) {\n            e.preventDefault();\n            this.EE.emit('projectDiscardDraft');\n        }\n    }], [{\n        key: 'navigationFactory',\n        value: function navigationFactory() {\n            __webpack_require__(/*! ./Navigation.scss */ \"./src/Project/Navigation/Navigation.scss\");\n            function navigation($element, $state, $ngRedux) {\n                return new NavigationController($element, $state, $ngRedux);\n            }\n            navigation.$inject = ['$element', '$state', '$ngRedux'];\n            return navigation;\n        }\n    }]);\n\n    return NavigationController;\n}();\n\nexports.default = NavigationController;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9OYXZpZ2F0aW9uL05hdmlnYXRpb25Db250cm9sbGVyLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9Qcm9qZWN0L05hdmlnYXRpb24vTmF2aWdhdGlvbkNvbnRyb2xsZXIuanM/ODkzYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5pbXBvcnQgKiBhcyBQcm9qZWN0TW9kdWxlIGZyb20gJy4uLy4uL3N0b3JlL21vZHVsZXMvcHJvamVjdHMnO1xuY2xhc3MgTmF2aWdhdGlvbkNvbnRyb2xsZXIge1xuXG4gICAgY29uc3RydWN0b3IoJGVsZW1lbnQsICRzdGF0ZSwgJG5nUmVkdXgpIHtcbiAgICAgICAgdGhpcy5FRSA9IHdpbmRvdy5FRTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgIHRoaXMuJG5nUmVkdXggPSAkbmdSZWR1eDtcbiAgICAgICAgdGhpcy5zY3JvbGxUbyA9IHRoaXMuc2Nyb2xsVG8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy4kb25Jbml0ID0gdGhpcy5vbkluaXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gdGhpcy5vbkRlc3Ryb3kuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gdGhpcy5zY3JvbGxIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMubWFwU3RhdGUgPSB0aGlzLm1hcFN0YXRlLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgb25Jbml0KCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWFpbi1jb250ZW50JylbMF07XG4gICAgICAgIHRoaXMuY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLnNjcm9sbEhhbmRsZXIpO1xuICAgICAgICB0aGlzLkVFLm9uKCdhY3RpdmF0ZUZpZWxkU2V0JywgdGhpcy5hY3RpdmF0ZU5hdmlnYXRpb24sIHRoaXMpO1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlID0gdGhpcy4kbmdSZWR1eC5jb25uZWN0KHRoaXMubWFwU3RhdGUsIFByb2plY3RNb2R1bGUpKHRoaXMpO1xuICAgIH1cblxuICAgIG9uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5FRS5yZW1vdmVMaXN0ZW5lcignYWN0aXZhdGVGaWVsZFNldCcsIHRoaXMuYWN0aXZhdGVOYXZpZ2F0aW9uKTtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIG1hcFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIGNvbnN0IGNvdW50cnlGaWVsZHMgPSBQcm9qZWN0TW9kdWxlLmdldFByb2plY3RDb3VudHJ5RmllbGRzKHN0YXRlKSghdGhpcy5pc1B1Ymxpc2hlZCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb3VudHJ5RmllbGRzXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYWN0aXZhdGVOYXZpZ2F0aW9uKGhhc2gpIHtcbiAgICAgICAgY29uc3QgbmF2aWdhdGlvbiA9IHRoaXMuZWxlbWVudFswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKTtcbiAgICAgICAgZm9yRWFjaChuYXZpZ2F0aW9uLCBlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhoYXNoKSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzY3JvbGxIYW5kbGVyKCkge1xuICAgICAgICBpZiAodGhpcy5jb250ZW50LnNjcm9sbFRvcCA+IDI2MCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50WzBdLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudFswXS5zdHlsZS50b3AgPSAnNzBweCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRbMF0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50WzBdLnN0eWxlLnRvcCA9ICcwcHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2Nyb2xsVG8oaGFzaCkge1xuICAgICAgICB0aGlzLkVFLmVtaXQoJ3Byb2plY3RTY3JvbGxUbycsIGhhc2gpO1xuICAgIH1cblxuICAgIGdvVG8oZWRpdE1vZGUpIHtcbiAgICAgICAgaWYgKChlZGl0TW9kZSA9PT0gJ2RyYWZ0JyAmJiAhdGhpcy5wcm9qZWN0LmRpc2FibGVEcmFmdClcbiAgICAgICAgICB8fCAoZWRpdE1vZGUgPT09ICdwdWJsaXNoJyAmJiB0aGlzLnByb2plY3QuaGFzUHVibGlzaGVkVmVyc2lvbikpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZ28odGhpcy5zdGF0ZS5jdXJyZW50Lm5hbWUsIHsgZWRpdE1vZGUgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlRHJhZnRFdmVudChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5FRS5lbWl0KCdwcm9qZWN0U2F2ZURyYWZ0Jyk7XG4gICAgfVxuXG4gICAgZGlzY2FyZERyYWZ0RXZlbnQoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuRUUuZW1pdCgncHJvamVjdERpc2NhcmREcmFmdCcpO1xuICAgIH1cblxuICAgIHN0YXRpYyBuYXZpZ2F0aW9uRmFjdG9yeSgpIHtcbiAgICAgICAgcmVxdWlyZSgnLi9OYXZpZ2F0aW9uLnNjc3MnKTtcbiAgICAgICAgZnVuY3Rpb24gbmF2aWdhdGlvbigkZWxlbWVudCwgJHN0YXRlLCAkbmdSZWR1eCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBOYXZpZ2F0aW9uQ29udHJvbGxlcigkZWxlbWVudCwgJHN0YXRlLCAkbmdSZWR1eCk7XG4gICAgICAgIH1cbiAgICAgICAgbmF2aWdhdGlvbi4kaW5qZWN0ID0gWyckZWxlbWVudCcsICckc3RhdGUnLCAnJG5nUmVkdXgnXTtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb247XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBOYXZpZ2F0aW9uQ29udHJvbGxlcjtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBO0FBREE7QUFDQTs7Ozs7OztBQUFBO0FBRUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBR0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Project/Navigation/NavigationController.js\n");

/***/ }),

/***/ "./src/Project/Navigation/navigationComponent.js":
/*!*******************************************************!*\
  !*** ./src/Project/Navigation/navigationComponent.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _Navigation = __webpack_require__(/*! ./Navigation.html */ \"./src/Project/Navigation/Navigation.html\");\n\nvar _Navigation2 = _interopRequireDefault(_Navigation);\n\nvar _NavigationController = __webpack_require__(/*! ./NavigationController */ \"./src/Project/Navigation/NavigationController.js\");\n\nvar _NavigationController2 = _interopRequireDefault(_NavigationController);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar component = {\n    template: _Navigation2.default,\n    controller: _NavigationController2.default.navigationFactory(),\n    controllerAs: 'vm',\n    name: 'navigation',\n    bindings: {\n        isTeam: '<',\n        showCountryFields: '<',\n        project: '<',\n        isPublished: '<',\n        team: '<',\n        viewers: '<',\n        countryFields: '<'\n    }\n};\n\nexports.default = component;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9OYXZpZ2F0aW9uL25hdmlnYXRpb25Db21wb25lbnQuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL1Byb2plY3QvTmF2aWdhdGlvbi9uYXZpZ2F0aW9uQ29tcG9uZW50LmpzPzFiYmIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF90ZW1wbGF0ZSBmcm9tICcuL05hdmlnYXRpb24uaHRtbCc7XG5pbXBvcnQgTmF2aWdhdGlvbkNvbnRyb2xsZXIgZnJvbSAnLi9OYXZpZ2F0aW9uQ29udHJvbGxlcic7XG5cbmNvbnN0IGNvbXBvbmVudCA9IHtcbiAgICB0ZW1wbGF0ZTogX3RlbXBsYXRlLFxuICAgIGNvbnRyb2xsZXI6IE5hdmlnYXRpb25Db250cm9sbGVyLm5hdmlnYXRpb25GYWN0b3J5KCksXG4gICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgIG5hbWU6ICduYXZpZ2F0aW9uJyxcbiAgICBiaW5kaW5nczoge1xuICAgICAgICBpc1RlYW06ICc8JyxcbiAgICAgICAgc2hvd0NvdW50cnlGaWVsZHM6ICc8JyxcbiAgICAgICAgcHJvamVjdDogJzwnLFxuICAgICAgICBpc1B1Ymxpc2hlZDogJzwnLFxuICAgICAgICB0ZWFtOiAnPCcsXG4gICAgICAgIHZpZXdlcnM6ICc8JyxcbiAgICAgICAgY291bnRyeUZpZWxkczogJzwnXG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29tcG9uZW50O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFMQTtBQUNBO0FBZUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Project/Navigation/navigationComponent.js\n");

/***/ })

}]);