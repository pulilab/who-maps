(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[180],{

/***/ "./src/Common/Searchbar/Searchbar.html":
/*!*********************************************!*\
  !*** ./src/Common/Searchbar/Searchbar.html ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<md-button ng-if=\\\"vm.compactMode\\\" ng-click=\\\"vm.toggleSearch()\\\" class=\\\"md-icon-button\\\" aria-label=\\\"Search\\\" md-no-ink>\\n    <md-icon class=\\\"material-icons\\\">search</md-icon>\\n</md-button>\\n<div class=\\\"search-project\\\" ng-hide=\\\"vm.compactMode && !vm.showSearch\\\" ng-class=\\\"{'active': vm.showSearch, 'compact': vm.compactMode}\\\">\\n    <md-input-container class=\\\"searchinput md-block\\\">\\n        <md-icon>search</md-icon>\\n        <input\\n            type=\\\"text\\\"\\n            ng-model=\\\"vm.searchStr\\\"\\n            ng-model-options=\\\"{debounce: 500}\\\"\\n            ng-focus=\\\"vm.showSearch = true\\\"\\n            aria-label=\\\"search input field\\\"\\n            placeholder=\\\"{{ 'Type and search projects...' | translate}}\\\">\\n    </md-input-container>\\n\\n    <md-button\\n        ng-click=\\\"vm.close()\\\"\\n        id=\\\"closebtn\\\"\\n        class=\\\"md-icon-button md-gray md-no-ink\\\">\\n        <md-icon>close</md-icon>\\n    </md-button>\\n\\n    <md-card\\n        layout=\\\"column\\\"\\n        class=\\\"searchcard md-whiteframe-24dp\\\"\\n        ng-if=\\\"vm.showSearch\\\">\\n\\n        <div class=\\\"md-block filters\\\">\\n          <md-subheader class=\\\"md-no-sticky\\\">\\n            <translate>Set filters:</translate>\\n          </md-subheader>\\n\\n          <div>\\n              <div layout=\\\"row\\\" layout-wrap flex>\\n                  <div ng-repeat=\\\"filter in vm.filters\\\" flex=\\\"33\\\">\\n                      <md-checkbox class=\\\"md-primary small\\\" ng-model=\\\"filter.value\\\" ng-change=\\\"vm.checkboxChecks(filter)\\\">\\n                          {{filter.displayName}}\\n                      </md-checkbox>\\n                  </div>\\n              </div>\\n          </div>\\n        </div>\\n\\n        <div class=\\\"md-block results\\\" ng-show=\\\"vm.projects && vm.projects.length > 0\\\">\\n          <md-subheader class=\\\"md-no-sticky\\\">\\n            <translate>\\n              Results ({{vm.resultNr}} out of {{vm.totalNr}}):\\n            </translate>\\n          </md-subheader>\\n\\n          <project-component\\n              ng-repeat=\\\"project in vm.projects | limitTo: 5\\\"\\n              project=\\\"project\\\"\\n              show-version=\\\"false\\\">\\n          </project-component>\\n        </div>\\n    </md-card>\\n</div>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1NlYXJjaGJhci9TZWFyY2hiYXIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Db21tb24vU2VhcmNoYmFyL1NlYXJjaGJhci5odG1sP2E3MjIiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxtZC1idXR0b24gbmctaWY9XFxcInZtLmNvbXBhY3RNb2RlXFxcIiBuZy1jbGljaz1cXFwidm0udG9nZ2xlU2VhcmNoKClcXFwiIGNsYXNzPVxcXCJtZC1pY29uLWJ1dHRvblxcXCIgYXJpYS1sYWJlbD1cXFwiU2VhcmNoXFxcIiBtZC1uby1pbms+XFxuICAgIDxtZC1pY29uIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+c2VhcmNoPC9tZC1pY29uPlxcbjwvbWQtYnV0dG9uPlxcbjxkaXYgY2xhc3M9XFxcInNlYXJjaC1wcm9qZWN0XFxcIiBuZy1oaWRlPVxcXCJ2bS5jb21wYWN0TW9kZSAmJiAhdm0uc2hvd1NlYXJjaFxcXCIgbmctY2xhc3M9XFxcInsnYWN0aXZlJzogdm0uc2hvd1NlYXJjaCwgJ2NvbXBhY3QnOiB2bS5jb21wYWN0TW9kZX1cXFwiPlxcbiAgICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVxcXCJzZWFyY2hpbnB1dCBtZC1ibG9ja1xcXCI+XFxuICAgICAgICA8bWQtaWNvbj5zZWFyY2g8L21kLWljb24+XFxuICAgICAgICA8aW5wdXRcXG4gICAgICAgICAgICB0eXBlPVxcXCJ0ZXh0XFxcIlxcbiAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJ2bS5zZWFyY2hTdHJcXFwiXFxuICAgICAgICAgICAgbmctbW9kZWwtb3B0aW9ucz1cXFwie2RlYm91bmNlOiA1MDB9XFxcIlxcbiAgICAgICAgICAgIG5nLWZvY3VzPVxcXCJ2bS5zaG93U2VhcmNoID0gdHJ1ZVxcXCJcXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVxcXCJzZWFyY2ggaW5wdXQgZmllbGRcXFwiXFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcInt7ICdUeXBlIGFuZCBzZWFyY2ggcHJvamVjdHMuLi4nIHwgdHJhbnNsYXRlfX1cXFwiPlxcbiAgICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG5cXG4gICAgPG1kLWJ1dHRvblxcbiAgICAgICAgbmctY2xpY2s9XFxcInZtLmNsb3NlKClcXFwiXFxuICAgICAgICBpZD1cXFwiY2xvc2VidG5cXFwiXFxuICAgICAgICBjbGFzcz1cXFwibWQtaWNvbi1idXR0b24gbWQtZ3JheSBtZC1uby1pbmtcXFwiPlxcbiAgICAgICAgPG1kLWljb24+Y2xvc2U8L21kLWljb24+XFxuICAgIDwvbWQtYnV0dG9uPlxcblxcbiAgICA8bWQtY2FyZFxcbiAgICAgICAgbGF5b3V0PVxcXCJjb2x1bW5cXFwiXFxuICAgICAgICBjbGFzcz1cXFwic2VhcmNoY2FyZCBtZC13aGl0ZWZyYW1lLTI0ZHBcXFwiXFxuICAgICAgICBuZy1pZj1cXFwidm0uc2hvd1NlYXJjaFxcXCI+XFxuXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZC1ibG9jayBmaWx0ZXJzXFxcIj5cXG4gICAgICAgICAgPG1kLXN1YmhlYWRlciBjbGFzcz1cXFwibWQtbm8tc3RpY2t5XFxcIj5cXG4gICAgICAgICAgICA8dHJhbnNsYXRlPlNldCBmaWx0ZXJzOjwvdHJhbnNsYXRlPlxcbiAgICAgICAgICA8L21kLXN1YmhlYWRlcj5cXG5cXG4gICAgICAgICAgPGRpdj5cXG4gICAgICAgICAgICAgIDxkaXYgbGF5b3V0PVxcXCJyb3dcXFwiIGxheW91dC13cmFwIGZsZXg+XFxuICAgICAgICAgICAgICAgICAgPGRpdiBuZy1yZXBlYXQ9XFxcImZpbHRlciBpbiB2bS5maWx0ZXJzXFxcIiBmbGV4PVxcXCIzM1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgIDxtZC1jaGVja2JveCBjbGFzcz1cXFwibWQtcHJpbWFyeSBzbWFsbFxcXCIgbmctbW9kZWw9XFxcImZpbHRlci52YWx1ZVxcXCIgbmctY2hhbmdlPVxcXCJ2bS5jaGVja2JveENoZWNrcyhmaWx0ZXIpXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt7ZmlsdGVyLmRpc3BsYXlOYW1lfX1cXG4gICAgICAgICAgICAgICAgICAgICAgPC9tZC1jaGVja2JveD5cXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWQtYmxvY2sgcmVzdWx0c1xcXCIgbmctc2hvdz1cXFwidm0ucHJvamVjdHMgJiYgdm0ucHJvamVjdHMubGVuZ3RoID4gMFxcXCI+XFxuICAgICAgICAgIDxtZC1zdWJoZWFkZXIgY2xhc3M9XFxcIm1kLW5vLXN0aWNreVxcXCI+XFxuICAgICAgICAgICAgPHRyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgIFJlc3VsdHMgKHt7dm0ucmVzdWx0TnJ9fSBvdXQgb2Yge3t2bS50b3RhbE5yfX0pOlxcbiAgICAgICAgICAgIDwvdHJhbnNsYXRlPlxcbiAgICAgICAgICA8L21kLXN1YmhlYWRlcj5cXG5cXG4gICAgICAgICAgPHByb2plY3QtY29tcG9uZW50XFxuICAgICAgICAgICAgICBuZy1yZXBlYXQ9XFxcInByb2plY3QgaW4gdm0ucHJvamVjdHMgfCBsaW1pdFRvOiA1XFxcIlxcbiAgICAgICAgICAgICAgcHJvamVjdD1cXFwicHJvamVjdFxcXCJcXG4gICAgICAgICAgICAgIHNob3ctdmVyc2lvbj1cXFwiZmFsc2VcXFwiPlxcbiAgICAgICAgICA8L3Byb2plY3QtY29tcG9uZW50PlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvbWQtY2FyZD5cXG48L2Rpdj5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Common/Searchbar/Searchbar.html\n");

/***/ })

}]);