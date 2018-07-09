(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[252],{

/***/ "./src/Common/Thematic/modal-skeleton.html":
/*!*************************************************!*\
  !*** ./src/Common/Thematic/modal-skeleton.html ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<md-icon class=\\\"md-icons back-icon\\\">close</md-icon>\\n\\n<md-dialog\\n  flex-offset=\\\"15\\\"\\n  flex=\\\"85\\\"\\n  aria-label=\\\"Thematic overview (help) dialog\\\"\\n  class=\\\"thematic-overview\\\">\\n\\n  <md-dialog-content layout=\\\"row\\\">\\n\\n    <md-content class=\\\"left\\\">\\n\\n      <div class=\\\"headline\\\">\\n        <h6><translate>MAPS Toolkit</translate></h6>\\n        <p><translate>This section provides definitions and descriptions of key concepts, and highlights their relevance to scaling up and sustainability. It also includes diagrams to illustrate the conceptual framework underlying the Toolkit.</translate></p>\\n      </div>\\n\\n      <div class=\\\"axes\\\" ng-repeat=\\\"(axisId, axis) in vm.data track by $index\\\">\\n\\n        <div class=\\\"axis\\\" layout=\\\"row\\\">\\n\\n          <div flex layout=\\\"row\\\">\\n            <div\\n              class=\\\"iconcontainer\\\"\\n              layout=\\\"column\\\"\\n              layout-align=\\\"center center\\\"\\n              ng-click=\\\"vm.axisClick(axis, axisId);\\\"\\n              ng-class=\\\"(+vm.axis + 2) == $index ? 'active-axis' + (+vm.axis + 1) : ''\\\">\\n\\n              <img ng-src=\\\"{{vm.icons[$index]}}\\\" ng-click=\\\"vm.axisClick(axis, axisId);\\\">\\n\\n            </div>\\n\\n            <div\\n              class=\\\"titles\\\"\\n              layout=\\\"column\\\"\\n              ng-class=\\\"(+vm.axis + 2) == $index ? 'active' : ''\\\">\\n\\n              <span ng-if=\\\"$index > 1\\\" flex ng-click=\\\"vm.axisClick(axis, axisId);\\\">\\n                <translate>AXIS {{($index - 1)}}.</translate>\\n                  <br>\\n              </span>\\n              <span flex ng-click=\\\"vm.axisClick(axis, axisId);\\\">{{axis.name}}</span>\\n\\n              <div class=\\\"expander\\\">\\n                <md-icon ng-if=\\\"!axis.expand\\\" ng-click=\\\"axis.expand = true\\\">expand_more</md-icon>\\n                <md-icon ng-if=\\\"axis.expand\\\" ng-click=\\\"axis.expand = false\\\">expand_less</md-icon>\\n              </div>\\n\\n            </div>\\n          </div>\\n        </div>\\n\\n        <div\\n          class=\\\"domain\\\"\\n          ng-hide=\\\"!axis.expand\\\"\\n          ng-repeat=\\\"(domainId, domain) in axis.domains\\\"\\n          ng-click=\\\"vm.changeSpot(+axisId - 2, +domainId)\\\"\\n          ng-class=\\\"{'active-domain': domain.active}\\\">\\n\\n          <span ng-if=\\\"axisId > 1\\\"><translate>Domain {{domain.id}} : {{domain.name}} </translate></span>\\n          <span ng-if=\\\"axisId < 2\\\">{{domain.name}}</span>\\n\\n        </div>\\n      </div>\\n    </md-content>\\n\\n    <div class=\\\"right\\\" layout=\\\"column\\\" flex md-whiteframe=\\\"24\\\">\\n\\n      <div class=\\\"right-header\\\" ng-class=\\\"'axis' + (+vm.axis + 1)\\\">\\n        <div class=\\\"right-title\\\">\\n\\n          <img ng-src=\\\"{{vm.icons[+vm.axis + 2]}}\\\">\\n\\n          <span ng-if=\\\"vm.axis > -1\\\"><translate>AXIS</translate> {{+vm.axis + 1}}. - {{vm.data[+vm.axis + 2].domains[+vm.domain].name}}\\n          </span>\\n\\n          <span ng-if=\\\"vm.axis < 0\\\">{{vm.data[+vm.axis + 2].domains[+vm.domain].name}}</span>\\n\\n        </div>\\n      </div>\\n\\n      <md-content class=\\\"right-content\\\" ng-class=\\\"'axis' + (vm.axis + 1)\\\">\\n\\n        <div id=\\\"help-anchor\\\"></div>\\n        <div class=\\\"axis-html\\\" ng-html-compile=\\\"vm.templates[(vm.axis + 1) + '.html']\\\"></div>\\n        <div class=\\\"content-html\\\" ng-html-compile=\\\"vm.templates[(vm.axis + 1) + '-' + vm.domain + '.html']\\\"></div>\\n\\n      </md-content>\\n\\n    </div>\\n\\n  </md-dialog-content>\\n\\n</md-dialog>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1RoZW1hdGljL21vZGFsLXNrZWxldG9uLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQ29tbW9uL1RoZW1hdGljL21vZGFsLXNrZWxldG9uLmh0bWw/NGU2NSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPG1kLWljb24gY2xhc3M9XFxcIm1kLWljb25zIGJhY2staWNvblxcXCI+Y2xvc2U8L21kLWljb24+XFxuXFxuPG1kLWRpYWxvZ1xcbiAgZmxleC1vZmZzZXQ9XFxcIjE1XFxcIlxcbiAgZmxleD1cXFwiODVcXFwiXFxuICBhcmlhLWxhYmVsPVxcXCJUaGVtYXRpYyBvdmVydmlldyAoaGVscCkgZGlhbG9nXFxcIlxcbiAgY2xhc3M9XFxcInRoZW1hdGljLW92ZXJ2aWV3XFxcIj5cXG5cXG4gIDxtZC1kaWFsb2ctY29udGVudCBsYXlvdXQ9XFxcInJvd1xcXCI+XFxuXFxuICAgIDxtZC1jb250ZW50IGNsYXNzPVxcXCJsZWZ0XFxcIj5cXG5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJoZWFkbGluZVxcXCI+XFxuICAgICAgICA8aDY+PHRyYW5zbGF0ZT5NQVBTIFRvb2xraXQ8L3RyYW5zbGF0ZT48L2g2PlxcbiAgICAgICAgPHA+PHRyYW5zbGF0ZT5UaGlzIHNlY3Rpb24gcHJvdmlkZXMgZGVmaW5pdGlvbnMgYW5kIGRlc2NyaXB0aW9ucyBvZiBrZXkgY29uY2VwdHMsIGFuZCBoaWdobGlnaHRzIHRoZWlyIHJlbGV2YW5jZSB0byBzY2FsaW5nIHVwIGFuZCBzdXN0YWluYWJpbGl0eS4gSXQgYWxzbyBpbmNsdWRlcyBkaWFncmFtcyB0byBpbGx1c3RyYXRlIHRoZSBjb25jZXB0dWFsIGZyYW1ld29yayB1bmRlcmx5aW5nIHRoZSBUb29sa2l0LjwvdHJhbnNsYXRlPjwvcD5cXG4gICAgICA8L2Rpdj5cXG5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJheGVzXFxcIiBuZy1yZXBlYXQ9XFxcIihheGlzSWQsIGF4aXMpIGluIHZtLmRhdGEgdHJhY2sgYnkgJGluZGV4XFxcIj5cXG5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImF4aXNcXFwiIGxheW91dD1cXFwicm93XFxcIj5cXG5cXG4gICAgICAgICAgPGRpdiBmbGV4IGxheW91dD1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICA8ZGl2XFxuICAgICAgICAgICAgICBjbGFzcz1cXFwiaWNvbmNvbnRhaW5lclxcXCJcXG4gICAgICAgICAgICAgIGxheW91dD1cXFwiY29sdW1uXFxcIlxcbiAgICAgICAgICAgICAgbGF5b3V0LWFsaWduPVxcXCJjZW50ZXIgY2VudGVyXFxcIlxcbiAgICAgICAgICAgICAgbmctY2xpY2s9XFxcInZtLmF4aXNDbGljayhheGlzLCBheGlzSWQpO1xcXCJcXG4gICAgICAgICAgICAgIG5nLWNsYXNzPVxcXCIoK3ZtLmF4aXMgKyAyKSA9PSAkaW5kZXggPyAnYWN0aXZlLWF4aXMnICsgKCt2bS5heGlzICsgMSkgOiAnJ1xcXCI+XFxuXFxuICAgICAgICAgICAgICA8aW1nIG5nLXNyYz1cXFwie3t2bS5pY29uc1skaW5kZXhdfX1cXFwiIG5nLWNsaWNrPVxcXCJ2bS5heGlzQ2xpY2soYXhpcywgYXhpc0lkKTtcXFwiPlxcblxcbiAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgIDxkaXZcXG4gICAgICAgICAgICAgIGNsYXNzPVxcXCJ0aXRsZXNcXFwiXFxuICAgICAgICAgICAgICBsYXlvdXQ9XFxcImNvbHVtblxcXCJcXG4gICAgICAgICAgICAgIG5nLWNsYXNzPVxcXCIoK3ZtLmF4aXMgKyAyKSA9PSAkaW5kZXggPyAnYWN0aXZlJyA6ICcnXFxcIj5cXG5cXG4gICAgICAgICAgICAgIDxzcGFuIG5nLWlmPVxcXCIkaW5kZXggPiAxXFxcIiBmbGV4IG5nLWNsaWNrPVxcXCJ2bS5heGlzQ2xpY2soYXhpcywgYXhpc0lkKTtcXFwiPlxcbiAgICAgICAgICAgICAgICA8dHJhbnNsYXRlPkFYSVMge3soJGluZGV4IC0gMSl9fS48L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgICAgICA8YnI+XFxuICAgICAgICAgICAgICA8L3NwYW4+XFxuICAgICAgICAgICAgICA8c3BhbiBmbGV4IG5nLWNsaWNrPVxcXCJ2bS5heGlzQ2xpY2soYXhpcywgYXhpc0lkKTtcXFwiPnt7YXhpcy5uYW1lfX08L3NwYW4+XFxuXFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJleHBhbmRlclxcXCI+XFxuICAgICAgICAgICAgICAgIDxtZC1pY29uIG5nLWlmPVxcXCIhYXhpcy5leHBhbmRcXFwiIG5nLWNsaWNrPVxcXCJheGlzLmV4cGFuZCA9IHRydWVcXFwiPmV4cGFuZF9tb3JlPC9tZC1pY29uPlxcbiAgICAgICAgICAgICAgICA8bWQtaWNvbiBuZy1pZj1cXFwiYXhpcy5leHBhbmRcXFwiIG5nLWNsaWNrPVxcXCJheGlzLmV4cGFuZCA9IGZhbHNlXFxcIj5leHBhbmRfbGVzczwvbWQtaWNvbj5cXG4gICAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgPGRpdlxcbiAgICAgICAgICBjbGFzcz1cXFwiZG9tYWluXFxcIlxcbiAgICAgICAgICBuZy1oaWRlPVxcXCIhYXhpcy5leHBhbmRcXFwiXFxuICAgICAgICAgIG5nLXJlcGVhdD1cXFwiKGRvbWFpbklkLCBkb21haW4pIGluIGF4aXMuZG9tYWluc1xcXCJcXG4gICAgICAgICAgbmctY2xpY2s9XFxcInZtLmNoYW5nZVNwb3QoK2F4aXNJZCAtIDIsICtkb21haW5JZClcXFwiXFxuICAgICAgICAgIG5nLWNsYXNzPVxcXCJ7J2FjdGl2ZS1kb21haW4nOiBkb21haW4uYWN0aXZlfVxcXCI+XFxuXFxuICAgICAgICAgIDxzcGFuIG5nLWlmPVxcXCJheGlzSWQgPiAxXFxcIj48dHJhbnNsYXRlPkRvbWFpbiB7e2RvbWFpbi5pZH19IDoge3tkb21haW4ubmFtZX19IDwvdHJhbnNsYXRlPjwvc3Bhbj5cXG4gICAgICAgICAgPHNwYW4gbmctaWY9XFxcImF4aXNJZCA8IDJcXFwiPnt7ZG9tYWluLm5hbWV9fTwvc3Bhbj5cXG5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L21kLWNvbnRlbnQ+XFxuXFxuICAgIDxkaXYgY2xhc3M9XFxcInJpZ2h0XFxcIiBsYXlvdXQ9XFxcImNvbHVtblxcXCIgZmxleCBtZC13aGl0ZWZyYW1lPVxcXCIyNFxcXCI+XFxuXFxuICAgICAgPGRpdiBjbGFzcz1cXFwicmlnaHQtaGVhZGVyXFxcIiBuZy1jbGFzcz1cXFwiJ2F4aXMnICsgKCt2bS5heGlzICsgMSlcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicmlnaHQtdGl0bGVcXFwiPlxcblxcbiAgICAgICAgICA8aW1nIG5nLXNyYz1cXFwie3t2bS5pY29uc1srdm0uYXhpcyArIDJdfX1cXFwiPlxcblxcbiAgICAgICAgICA8c3BhbiBuZy1pZj1cXFwidm0uYXhpcyA+IC0xXFxcIj48dHJhbnNsYXRlPkFYSVM8L3RyYW5zbGF0ZT4ge3srdm0uYXhpcyArIDF9fS4gLSB7e3ZtLmRhdGFbK3ZtLmF4aXMgKyAyXS5kb21haW5zWyt2bS5kb21haW5dLm5hbWV9fVxcbiAgICAgICAgICA8L3NwYW4+XFxuXFxuICAgICAgICAgIDxzcGFuIG5nLWlmPVxcXCJ2bS5heGlzIDwgMFxcXCI+e3t2bS5kYXRhWyt2bS5heGlzICsgMl0uZG9tYWluc1srdm0uZG9tYWluXS5uYW1lfX08L3NwYW4+XFxuXFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG5cXG4gICAgICA8bWQtY29udGVudCBjbGFzcz1cXFwicmlnaHQtY29udGVudFxcXCIgbmctY2xhc3M9XFxcIidheGlzJyArICh2bS5heGlzICsgMSlcXFwiPlxcblxcbiAgICAgICAgPGRpdiBpZD1cXFwiaGVscC1hbmNob3JcXFwiPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiYXhpcy1odG1sXFxcIiBuZy1odG1sLWNvbXBpbGU9XFxcInZtLnRlbXBsYXRlc1sodm0uYXhpcyArIDEpICsgJy5odG1sJ11cXFwiPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29udGVudC1odG1sXFxcIiBuZy1odG1sLWNvbXBpbGU9XFxcInZtLnRlbXBsYXRlc1sodm0uYXhpcyArIDEpICsgJy0nICsgdm0uZG9tYWluICsgJy5odG1sJ11cXFwiPjwvZGl2PlxcblxcbiAgICAgIDwvbWQtY29udGVudD5cXG5cXG4gICAgPC9kaXY+XFxuXFxuICA8L21kLWRpYWxvZy1jb250ZW50PlxcblxcbjwvbWQtZGlhbG9nPlxcblwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/Thematic/modal-skeleton.html\n");

/***/ })

}]);