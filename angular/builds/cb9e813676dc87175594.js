(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[564],{

/***/ "./src/Project/Navigation/Navigation.html":
/*!************************************************!*\
  !*** ./src/Project/Navigation/Navigation.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<div class=\\\"project-section project-navigation\\\" md-whiteframe=\\\"2\\\">\\n  <div class=\\\"section-title md-title\\\">\\n    <translate>Navigation</translate>\\n  </div>\\n  <div class=\\\"edit-mode-switch\\\" layout=\\\"row\\\" layout-align=\\\"start center\\\" ng-if=\\\"vm.state.current.name === 'editProject'\\\">\\n    <div>\\n      <translate>Switch view:</translate>\\n    </div>\\n    <div layout=\\\"row\\\" layout-align=\\\"start stretch\\\">\\n      <div>\\n        <button type=\\\"button\\\" ng-click=\\\"vm.goTo('draft')\\\"  class=\\\"draft\\\" ng-class=\\\"{'active': vm.state.params.editMode === 'draft'}\\\">\\n          <md-tooltip md-autohide md-direction=\\\"top\\\" ng-if=\\\"vm.project.disableDraft\\\">\\n            <translate>You are not allowed to access the draft</translate>\\n          </md-tooltip>\\n          <translate>Draft</translate>\\n        </button>\\n      </div>\\n      <div>\\n        <button type=\\\"button\\\"\\n                ng-click=\\\"vm.goTo('publish')\\\" class=\\\"publish\\\" ng-class=\\\"{'active': vm.state.params.editMode === 'publish'}\\\">\\n          <md-tooltip md-autohide md-direction=\\\"top\\\" ng-if=\\\"!vm.project.hasPublishedVersion\\\">\\n            <translate>There is no published version</translate>\\n          </md-tooltip>\\n          <translate>Published</translate>\\n        </button>\\n      </div>\\n    </div>\\n  </div>\\n  <div layout=\\\"column\\\" class=\\\"stepper\\\">\\n    <ul>\\n      <li class=\\\"general-overview active\\\">\\n        <a ng-click=\\\"vm.scrollTo('general-overview')\\\">\\n          <span class=\\\"step\\\">\\n            <i class=\\\"material-icons\\\">&#xE5C8;</i>\\n          </span>\\n          <translate>General</translate>\\n        </a>\\n      </li>\\n      <li class=\\\"implementation-overview\\\">\\n        <a ng-click=\\\"vm.scrollTo('implementation-overview')\\\">\\n          <span class=\\\"step\\\">\\n            <i class=\\\"material-icons\\\">&#xE5C8;</i>\\n          </span>\\n          <translate>Implementation</translate>\\n        </a>\\n      </li>\\n      <li class=\\\"technology\\\">\\n        <a ng-click=\\\"vm.scrollTo('technology')\\\">\\n          <span class=\\\"step\\\">\\n            <i class=\\\"material-icons\\\">&#xE5C8;</i>\\n          </span>\\n          <translate>Technology</translate>\\n        </a>\\n      </li>\\n      <li class=\\\"interoperability\\\">\\n        <a ng-click=\\\"vm.scrollTo('interoperability')\\\">\\n          <span class=\\\"step\\\">\\n            <i class=\\\"material-icons\\\">&#xE5C8;</i>\\n          </span>\\n          <translate>Interoperability</translate>\\n        </a>\\n      </li>\\n      <li class=\\\"country-fields\\\" ng-show=\\\"vm.countryFields && vm.countryFields.length > 0\\\">\\n        <a ng-click=\\\"vm.scrollTo('country-fields')\\\">\\n          <span class=\\\"step\\\">\\n            <i class=\\\"material-icons\\\">&#xE5C8;</i>\\n          </span>\\n          <translate>Country fields</translate>\\n        </a>\\n      </li>\\n    </ul>\\n  </div>\\n  <div layout=\\\"column\\\" class=\\\"edit-buttons\\\" ng-if=\\\"vm.isTeam || vm.state.current.name === 'newProject'\\\">\\n    <div class=\\\"primary-buttons\\\" ng-if-start=\\\"vm.state.params.editMode === 'draft' && vm.state.current.name === 'editProject'\\\">\\n      <md-button type=\\\"submit\\\" class=\\\"md-primary md-raised\\\">\\n        <translate>Publish</translate>\\n      </md-button>\\n    </div>\\n    <div class=\\\"secondary-buttons\\\">\\n      <md-button class=\\\"md-primary\\\" ng-click=\\\"vm.saveDraftEvent($event)\\\">\\n        <translate>Save draft</translate>\\n      </md-button>\\n    </div>\\n    <div ng-if-end class=\\\"secondary-buttons\\\" ng-show=\\\"vm.project.hasPublishedVersion\\\">\\n      <md-button class=\\\"md-warn\\\" ng-click=\\\"vm.discardDraftEvent($event)\\\">\\n        <translate>Discard draft</translate>\\n      </md-button>\\n    </div>\\n    <div class=\\\"primary-buttons\\\" ng-if=\\\"vm.state.current.name === 'newProject'\\\">\\n      <md-button class=\\\"md-primary md-raised\\\" ng-click=\\\"vm.saveDraftEvent($event)\\\">\\n        <translate>Save draft</translate>\\n      </md-button>\\n    </div>\\n    <div class=\\\"secondary-buttons\\\" ng-if=\\\"vm.state.params.editMode === 'publish' || vm.state.current.name === 'newProject'\\\">\\n      <md-button class=\\\"md-primary\\\" ui-sref=\\\"dashboard\\\">\\n        <translate>Go to dashboard</translate>\\n      </md-button>\\n    </div>\\n  </div>\\n</div>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9OYXZpZ2F0aW9uL05hdmlnYXRpb24uaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Qcm9qZWN0L05hdmlnYXRpb24vTmF2aWdhdGlvbi5odG1sPzQ5NjkiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcInByb2plY3Qtc2VjdGlvbiBwcm9qZWN0LW5hdmlnYXRpb25cXFwiIG1kLXdoaXRlZnJhbWU9XFxcIjJcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwic2VjdGlvbi10aXRsZSBtZC10aXRsZVxcXCI+XFxuICAgIDx0cmFuc2xhdGU+TmF2aWdhdGlvbjwvdHJhbnNsYXRlPlxcbiAgPC9kaXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJlZGl0LW1vZGUtc3dpdGNoXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJzdGFydCBjZW50ZXJcXFwiIG5nLWlmPVxcXCJ2bS5zdGF0ZS5jdXJyZW50Lm5hbWUgPT09ICdlZGl0UHJvamVjdCdcXFwiPlxcbiAgICA8ZGl2PlxcbiAgICAgIDx0cmFuc2xhdGU+U3dpdGNoIHZpZXc6PC90cmFuc2xhdGU+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtYWxpZ249XFxcInN0YXJ0IHN0cmV0Y2hcXFwiPlxcbiAgICAgIDxkaXY+XFxuICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcInZtLmdvVG8oJ2RyYWZ0JylcXFwiICBjbGFzcz1cXFwiZHJhZnRcXFwiIG5nLWNsYXNzPVxcXCJ7J2FjdGl2ZSc6IHZtLnN0YXRlLnBhcmFtcy5lZGl0TW9kZSA9PT0gJ2RyYWZ0J31cXFwiPlxcbiAgICAgICAgICA8bWQtdG9vbHRpcCBtZC1hdXRvaGlkZSBtZC1kaXJlY3Rpb249XFxcInRvcFxcXCIgbmctaWY9XFxcInZtLnByb2plY3QuZGlzYWJsZURyYWZ0XFxcIj5cXG4gICAgICAgICAgICA8dHJhbnNsYXRlPllvdSBhcmUgbm90IGFsbG93ZWQgdG8gYWNjZXNzIHRoZSBkcmFmdDwvdHJhbnNsYXRlPlxcbiAgICAgICAgICA8L21kLXRvb2x0aXA+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+RHJhZnQ8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvYnV0dG9uPlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxkaXY+XFxuICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCJcXG4gICAgICAgICAgICAgICAgbmctY2xpY2s9XFxcInZtLmdvVG8oJ3B1Ymxpc2gnKVxcXCIgY2xhc3M9XFxcInB1Ymxpc2hcXFwiIG5nLWNsYXNzPVxcXCJ7J2FjdGl2ZSc6IHZtLnN0YXRlLnBhcmFtcy5lZGl0TW9kZSA9PT0gJ3B1Ymxpc2gnfVxcXCI+XFxuICAgICAgICAgIDxtZC10b29sdGlwIG1kLWF1dG9oaWRlIG1kLWRpcmVjdGlvbj1cXFwidG9wXFxcIiBuZy1pZj1cXFwiIXZtLnByb2plY3QuaGFzUHVibGlzaGVkVmVyc2lvblxcXCI+XFxuICAgICAgICAgICAgPHRyYW5zbGF0ZT5UaGVyZSBpcyBubyBwdWJsaXNoZWQgdmVyc2lvbjwvdHJhbnNsYXRlPlxcbiAgICAgICAgICA8L21kLXRvb2x0aXA+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+UHVibGlzaGVkPC90cmFuc2xhdGU+XFxuICAgICAgICA8L2J1dHRvbj5cXG4gICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICA8L2Rpdj5cXG4gIDxkaXYgbGF5b3V0PVxcXCJjb2x1bW5cXFwiIGNsYXNzPVxcXCJzdGVwcGVyXFxcIj5cXG4gICAgPHVsPlxcbiAgICAgIDxsaSBjbGFzcz1cXFwiZ2VuZXJhbC1vdmVydmlldyBhY3RpdmVcXFwiPlxcbiAgICAgICAgPGEgbmctY2xpY2s9XFxcInZtLnNjcm9sbFRvKCdnZW5lcmFsLW92ZXJ2aWV3JylcXFwiPlxcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwic3RlcFxcXCI+XFxuICAgICAgICAgICAgPGkgY2xhc3M9XFxcIm1hdGVyaWFsLWljb25zXFxcIj4mI3hFNUM4OzwvaT5cXG4gICAgICAgICAgPC9zcGFuPlxcbiAgICAgICAgICA8dHJhbnNsYXRlPkdlbmVyYWw8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvYT5cXG4gICAgICA8L2xpPlxcbiAgICAgIDxsaSBjbGFzcz1cXFwiaW1wbGVtZW50YXRpb24tb3ZlcnZpZXdcXFwiPlxcbiAgICAgICAgPGEgbmctY2xpY2s9XFxcInZtLnNjcm9sbFRvKCdpbXBsZW1lbnRhdGlvbi1vdmVydmlldycpXFxcIj5cXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInN0ZXBcXFwiPlxcbiAgICAgICAgICAgIDxpIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+JiN4RTVDODs8L2k+XFxuICAgICAgICAgIDwvc3Bhbj5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5JbXBsZW1lbnRhdGlvbjwvdHJhbnNsYXRlPlxcbiAgICAgICAgPC9hPlxcbiAgICAgIDwvbGk+XFxuICAgICAgPGxpIGNsYXNzPVxcXCJ0ZWNobm9sb2d5XFxcIj5cXG4gICAgICAgIDxhIG5nLWNsaWNrPVxcXCJ2bS5zY3JvbGxUbygndGVjaG5vbG9neScpXFxcIj5cXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInN0ZXBcXFwiPlxcbiAgICAgICAgICAgIDxpIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+JiN4RTVDODs8L2k+XFxuICAgICAgICAgIDwvc3Bhbj5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5UZWNobm9sb2d5PC90cmFuc2xhdGU+XFxuICAgICAgICA8L2E+XFxuICAgICAgPC9saT5cXG4gICAgICA8bGkgY2xhc3M9XFxcImludGVyb3BlcmFiaWxpdHlcXFwiPlxcbiAgICAgICAgPGEgbmctY2xpY2s9XFxcInZtLnNjcm9sbFRvKCdpbnRlcm9wZXJhYmlsaXR5JylcXFwiPlxcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwic3RlcFxcXCI+XFxuICAgICAgICAgICAgPGkgY2xhc3M9XFxcIm1hdGVyaWFsLWljb25zXFxcIj4mI3hFNUM4OzwvaT5cXG4gICAgICAgICAgPC9zcGFuPlxcbiAgICAgICAgICA8dHJhbnNsYXRlPkludGVyb3BlcmFiaWxpdHk8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvYT5cXG4gICAgICA8L2xpPlxcbiAgICAgIDxsaSBjbGFzcz1cXFwiY291bnRyeS1maWVsZHNcXFwiIG5nLXNob3c9XFxcInZtLmNvdW50cnlGaWVsZHMgJiYgdm0uY291bnRyeUZpZWxkcy5sZW5ndGggPiAwXFxcIj5cXG4gICAgICAgIDxhIG5nLWNsaWNrPVxcXCJ2bS5zY3JvbGxUbygnY291bnRyeS1maWVsZHMnKVxcXCI+XFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJzdGVwXFxcIj5cXG4gICAgICAgICAgICA8aSBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnNcXFwiPiYjeEU1Qzg7PC9pPlxcbiAgICAgICAgICA8L3NwYW4+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+Q291bnRyeSBmaWVsZHM8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvYT5cXG4gICAgICA8L2xpPlxcbiAgICA8L3VsPlxcbiAgPC9kaXY+XFxuICA8ZGl2IGxheW91dD1cXFwiY29sdW1uXFxcIiBjbGFzcz1cXFwiZWRpdC1idXR0b25zXFxcIiBuZy1pZj1cXFwidm0uaXNUZWFtIHx8IHZtLnN0YXRlLmN1cnJlbnQubmFtZSA9PT0gJ25ld1Byb2plY3QnXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwicHJpbWFyeS1idXR0b25zXFxcIiBuZy1pZi1zdGFydD1cXFwidm0uc3RhdGUucGFyYW1zLmVkaXRNb2RlID09PSAnZHJhZnQnICYmIHZtLnN0YXRlLmN1cnJlbnQubmFtZSA9PT0gJ2VkaXRQcm9qZWN0J1xcXCI+XFxuICAgICAgPG1kLWJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiIGNsYXNzPVxcXCJtZC1wcmltYXJ5IG1kLXJhaXNlZFxcXCI+XFxuICAgICAgICA8dHJhbnNsYXRlPlB1Ymxpc2g8L3RyYW5zbGF0ZT5cXG4gICAgICA8L21kLWJ1dHRvbj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInNlY29uZGFyeS1idXR0b25zXFxcIj5cXG4gICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5XFxcIiBuZy1jbGljaz1cXFwidm0uc2F2ZURyYWZ0RXZlbnQoJGV2ZW50KVxcXCI+XFxuICAgICAgICA8dHJhbnNsYXRlPlNhdmUgZHJhZnQ8L3RyYW5zbGF0ZT5cXG4gICAgICA8L21kLWJ1dHRvbj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgbmctaWYtZW5kIGNsYXNzPVxcXCJzZWNvbmRhcnktYnV0dG9uc1xcXCIgbmctc2hvdz1cXFwidm0ucHJvamVjdC5oYXNQdWJsaXNoZWRWZXJzaW9uXFxcIj5cXG4gICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC13YXJuXFxcIiBuZy1jbGljaz1cXFwidm0uZGlzY2FyZERyYWZ0RXZlbnQoJGV2ZW50KVxcXCI+XFxuICAgICAgICA8dHJhbnNsYXRlPkRpc2NhcmQgZHJhZnQ8L3RyYW5zbGF0ZT5cXG4gICAgICA8L21kLWJ1dHRvbj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInByaW1hcnktYnV0dG9uc1xcXCIgbmctaWY9XFxcInZtLnN0YXRlLmN1cnJlbnQubmFtZSA9PT0gJ25ld1Byb2plY3QnXFxcIj5cXG4gICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5IG1kLXJhaXNlZFxcXCIgbmctY2xpY2s9XFxcInZtLnNhdmVEcmFmdEV2ZW50KCRldmVudClcXFwiPlxcbiAgICAgICAgPHRyYW5zbGF0ZT5TYXZlIGRyYWZ0PC90cmFuc2xhdGU+XFxuICAgICAgPC9tZC1idXR0b24+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJzZWNvbmRhcnktYnV0dG9uc1xcXCIgbmctaWY9XFxcInZtLnN0YXRlLnBhcmFtcy5lZGl0TW9kZSA9PT0gJ3B1Ymxpc2gnIHx8IHZtLnN0YXRlLmN1cnJlbnQubmFtZSA9PT0gJ25ld1Byb2plY3QnXFxcIj5cXG4gICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5XFxcIiB1aS1zcmVmPVxcXCJkYXNoYm9hcmRcXFwiPlxcbiAgICAgICAgPHRyYW5zbGF0ZT5HbyB0byBkYXNoYm9hcmQ8L3RyYW5zbGF0ZT5cXG4gICAgICA8L21kLWJ1dHRvbj5cXG4gICAgPC9kaXY+XFxuICA8L2Rpdj5cXG48L2Rpdj5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Project/Navigation/Navigation.html\n");

/***/ })

}]);