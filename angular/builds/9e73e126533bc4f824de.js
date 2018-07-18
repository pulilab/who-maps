(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[559],{

/***/ "./src/Project/Interoperability/Interoperability.html":
/*!************************************************************!*\
  !*** ./src/Project/Interoperability/Interoperability.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<div class=\\\"project-section section-interoperability\\\" md-whiteframe=\\\"2\\\">\\n\\n  <div class=\\\"section-title md-title\\\">\\n    <translate>4. Interoperability</translate>\\n    <span class=\\\"toggler\\\" ng-click=\\\"vm.collapse()\\\"><i class=\\\"material-icons\\\">keyboard_arrow_down</i></span>\\n  </div>\\n\\n  <div class=\\\"section-wrapper\\\">\\n\\n    <h6>\\n      <translate>Does your digital health project link to a digital HIS?</translate>\\n    </h6>\\n\\n    <md-input-container class=\\\"md-block error-placeholder\\\">\\n      <input  name=\\\"interoperability_links\\\" ng-model=\\\"vm.hiddenFields\\\" aria-label=\\\"hidden\\\" >\\n      <div ng-messages=\\\"vm.form.interoperability_links.$error\\\">\\n        <div ng-message=\\\"custom\\\">\\n          <div ng-repeat=\\\"message in vm.form.interoperability_links.customError\\\">\\n            {{message}}\\n          </div>\\n        </div>\\n      </div>\\n    </md-input-container>\\n\\n    <div layout=\\\"row\\\" ng-repeat=\\\"link in vm.structure.interoperability_links\\\">\\n      <md-checkbox md-no-ink aria-label=\\\"\\\"\\n                   ng-model=\\\"vm.project.interoperability_links[$index].selected\\\"\\n                   class=\\\"md-primary\\\" flex>\\n        {{link.pre}} {{link.name}}\\n      </md-checkbox>\\n      <md-input-container class=\\\"md-icon-float md-block\\\" flex>\\n        <label>\\n          <translate>Specify URL</translate>\\n        </label>\\n        <md-icon><i class=\\\"material-icons\\\">&#xE157;</i></md-icon>\\n        <input ng-disabled=\\\"!vm.project.interoperability_links[$index].selected\\\"\\n               name=\\\"{{'interoperability_links_' + $index + '_link'}}\\\"\\n               md-maxlength=\\\"200\\\"\\n               ng-change=\\\"vm.dispatchChange('interoperability_links', vm.project.interoperability_links)\\\"\\n               ng-model=\\\"vm.project.interoperability_links[$index].link\\\"\\n               ng-pattern=\\\"/^(http[s]?:\\\\/\\\\/){0,1}(www\\\\.){0,1}[a-zA-Z0-9\\\\.\\\\-]+\\\\.[a-zA-Z]{2,20}[\\\\.]{0,1}/\\\">\\n        <div ng-messages=\\\"vm.form['interoperability_links_' + $index + '_link'].$error\\\">\\n          <div ng-message=\\\"pattern\\\">\\n            <translate>Make sure your URL is valid.</translate>\\n          </div>\\n        </div>\\n      </md-input-container>\\n    </div>\\n\\n    <div class=\\\"checklist small-top\\\" >\\n      <h6>\\n        <translate>What data standards does your digital health project use?</translate>\\n      </h6>\\n      <md-input-container class=\\\"error-placeholder\\\">\\n        <input  name=\\\"interoperability_standards\\\" ng-model=\\\"vm.hiddenFields\\\" aria-label=\\\"hidden\\\">\\n        <div ng-messages=\\\"vm.form.interoperability_standards.$error\\\">\\n          <div ng-message=\\\"custom\\\">\\n            <div ng-repeat=\\\"message in vm.form.interoperability_standards.customError\\\">\\n              {{message}}\\n            </div>\\n          </div>\\n        </div>\\n      </md-input-container>\\n      <ul>\\n        <li ng-repeat=\\\"standard in vm.structure.interoperability_standards\\\">\\n          <md-checkbox md-no-ink aria-label=\\\"{{standard}}\\\"\\n                       ng-checked=\\\"vm.checkboxChecked(standard, 'interoperability_standards')\\\"\\n                       ng-click=\\\"vm.checkboxToggle(standard, 'interoperability_standards')\\\" class=\\\"md-primary\\\">\\n            {{standard.name}}\\n          </md-checkbox>\\n        </li>\\n      </ul>\\n\\n    </div>\\n  </div>\\n</div>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9JbnRlcm9wZXJhYmlsaXR5L0ludGVyb3BlcmFiaWxpdHkuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Qcm9qZWN0L0ludGVyb3BlcmFiaWxpdHkvSW50ZXJvcGVyYWJpbGl0eS5odG1sP2NiODIiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcInByb2plY3Qtc2VjdGlvbiBzZWN0aW9uLWludGVyb3BlcmFiaWxpdHlcXFwiIG1kLXdoaXRlZnJhbWU9XFxcIjJcXFwiPlxcblxcbiAgPGRpdiBjbGFzcz1cXFwic2VjdGlvbi10aXRsZSBtZC10aXRsZVxcXCI+XFxuICAgIDx0cmFuc2xhdGU+NC4gSW50ZXJvcGVyYWJpbGl0eTwvdHJhbnNsYXRlPlxcbiAgICA8c3BhbiBjbGFzcz1cXFwidG9nZ2xlclxcXCIgbmctY2xpY2s9XFxcInZtLmNvbGxhcHNlKClcXFwiPjxpIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+a2V5Ym9hcmRfYXJyb3dfZG93bjwvaT48L3NwYW4+XFxuICA8L2Rpdj5cXG5cXG4gIDxkaXYgY2xhc3M9XFxcInNlY3Rpb24td3JhcHBlclxcXCI+XFxuXFxuICAgIDxoNj5cXG4gICAgICA8dHJhbnNsYXRlPkRvZXMgeW91ciBkaWdpdGFsIGhlYWx0aCBwcm9qZWN0IGxpbmsgdG8gYSBkaWdpdGFsIEhJUz88L3RyYW5zbGF0ZT5cXG4gICAgPC9oNj5cXG5cXG4gICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cXFwibWQtYmxvY2sgZXJyb3ItcGxhY2Vob2xkZXJcXFwiPlxcbiAgICAgIDxpbnB1dCAgbmFtZT1cXFwiaW50ZXJvcGVyYWJpbGl0eV9saW5rc1xcXCIgbmctbW9kZWw9XFxcInZtLmhpZGRlbkZpZWxkc1xcXCIgYXJpYS1sYWJlbD1cXFwiaGlkZGVuXFxcIiA+XFxuICAgICAgPGRpdiBuZy1tZXNzYWdlcz1cXFwidm0uZm9ybS5pbnRlcm9wZXJhYmlsaXR5X2xpbmtzLiRlcnJvclxcXCI+XFxuICAgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XFxcImN1c3RvbVxcXCI+XFxuICAgICAgICAgIDxkaXYgbmctcmVwZWF0PVxcXCJtZXNzYWdlIGluIHZtLmZvcm0uaW50ZXJvcGVyYWJpbGl0eV9saW5rcy5jdXN0b21FcnJvclxcXCI+XFxuICAgICAgICAgICAge3ttZXNzYWdlfX1cXG4gICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG4gICAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuXFxuICAgIDxkaXYgbGF5b3V0PVxcXCJyb3dcXFwiIG5nLXJlcGVhdD1cXFwibGluayBpbiB2bS5zdHJ1Y3R1cmUuaW50ZXJvcGVyYWJpbGl0eV9saW5rc1xcXCI+XFxuICAgICAgPG1kLWNoZWNrYm94IG1kLW5vLWluayBhcmlhLWxhYmVsPVxcXCJcXFwiXFxuICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJ2bS5wcm9qZWN0LmludGVyb3BlcmFiaWxpdHlfbGlua3NbJGluZGV4XS5zZWxlY3RlZFxcXCJcXG4gICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIm1kLXByaW1hcnlcXFwiIGZsZXg+XFxuICAgICAgICB7e2xpbmsucHJlfX0ge3tsaW5rLm5hbWV9fVxcbiAgICAgIDwvbWQtY2hlY2tib3g+XFxuICAgICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cXFwibWQtaWNvbi1mbG9hdCBtZC1ibG9ja1xcXCIgZmxleD5cXG4gICAgICAgIDxsYWJlbD5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5TcGVjaWZ5IFVSTDwvdHJhbnNsYXRlPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgIDxtZC1pY29uPjxpIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+JiN4RTE1Nzs8L2k+PC9tZC1pY29uPlxcbiAgICAgICAgPGlucHV0IG5nLWRpc2FibGVkPVxcXCIhdm0ucHJvamVjdC5pbnRlcm9wZXJhYmlsaXR5X2xpbmtzWyRpbmRleF0uc2VsZWN0ZWRcXFwiXFxuICAgICAgICAgICAgICAgbmFtZT1cXFwie3snaW50ZXJvcGVyYWJpbGl0eV9saW5rc18nICsgJGluZGV4ICsgJ19saW5rJ319XFxcIlxcbiAgICAgICAgICAgICAgIG1kLW1heGxlbmd0aD1cXFwiMjAwXFxcIlxcbiAgICAgICAgICAgICAgIG5nLWNoYW5nZT1cXFwidm0uZGlzcGF0Y2hDaGFuZ2UoJ2ludGVyb3BlcmFiaWxpdHlfbGlua3MnLCB2bS5wcm9qZWN0LmludGVyb3BlcmFiaWxpdHlfbGlua3MpXFxcIlxcbiAgICAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJ2bS5wcm9qZWN0LmludGVyb3BlcmFiaWxpdHlfbGlua3NbJGluZGV4XS5saW5rXFxcIlxcbiAgICAgICAgICAgICAgIG5nLXBhdHRlcm49XFxcIi9eKGh0dHBbc10/OlxcXFwvXFxcXC8pezAsMX0od3d3XFxcXC4pezAsMX1bYS16QS1aMC05XFxcXC5cXFxcLV0rXFxcXC5bYS16QS1aXXsyLDIwfVtcXFxcLl17MCwxfS9cXFwiPlxcbiAgICAgICAgPGRpdiBuZy1tZXNzYWdlcz1cXFwidm0uZm9ybVsnaW50ZXJvcGVyYWJpbGl0eV9saW5rc18nICsgJGluZGV4ICsgJ19saW5rJ10uJGVycm9yXFxcIj5cXG4gICAgICAgICAgPGRpdiBuZy1tZXNzYWdlPVxcXCJwYXR0ZXJuXFxcIj5cXG4gICAgICAgICAgICA8dHJhbnNsYXRlPk1ha2Ugc3VyZSB5b3VyIFVSTCBpcyB2YWxpZC48L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXYgY2xhc3M9XFxcImNoZWNrbGlzdCBzbWFsbC10b3BcXFwiID5cXG4gICAgICA8aDY+XFxuICAgICAgICA8dHJhbnNsYXRlPldoYXQgZGF0YSBzdGFuZGFyZHMgZG9lcyB5b3VyIGRpZ2l0YWwgaGVhbHRoIHByb2plY3QgdXNlPzwvdHJhbnNsYXRlPlxcbiAgICAgIDwvaDY+XFxuICAgICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cXFwiZXJyb3ItcGxhY2Vob2xkZXJcXFwiPlxcbiAgICAgICAgPGlucHV0ICBuYW1lPVxcXCJpbnRlcm9wZXJhYmlsaXR5X3N0YW5kYXJkc1xcXCIgbmctbW9kZWw9XFxcInZtLmhpZGRlbkZpZWxkc1xcXCIgYXJpYS1sYWJlbD1cXFwiaGlkZGVuXFxcIj5cXG4gICAgICAgIDxkaXYgbmctbWVzc2FnZXM9XFxcInZtLmZvcm0uaW50ZXJvcGVyYWJpbGl0eV9zdGFuZGFyZHMuJGVycm9yXFxcIj5cXG4gICAgICAgICAgPGRpdiBuZy1tZXNzYWdlPVxcXCJjdXN0b21cXFwiPlxcbiAgICAgICAgICAgIDxkaXYgbmctcmVwZWF0PVxcXCJtZXNzYWdlIGluIHZtLmZvcm0uaW50ZXJvcGVyYWJpbGl0eV9zdGFuZGFyZHMuY3VzdG9tRXJyb3JcXFwiPlxcbiAgICAgICAgICAgICAge3ttZXNzYWdlfX1cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4gICAgICA8dWw+XFxuICAgICAgICA8bGkgbmctcmVwZWF0PVxcXCJzdGFuZGFyZCBpbiB2bS5zdHJ1Y3R1cmUuaW50ZXJvcGVyYWJpbGl0eV9zdGFuZGFyZHNcXFwiPlxcbiAgICAgICAgICA8bWQtY2hlY2tib3ggbWQtbm8taW5rIGFyaWEtbGFiZWw9XFxcInt7c3RhbmRhcmR9fVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgIG5nLWNoZWNrZWQ9XFxcInZtLmNoZWNrYm94Q2hlY2tlZChzdGFuZGFyZCwgJ2ludGVyb3BlcmFiaWxpdHlfc3RhbmRhcmRzJylcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICBuZy1jbGljaz1cXFwidm0uY2hlY2tib3hUb2dnbGUoc3RhbmRhcmQsICdpbnRlcm9wZXJhYmlsaXR5X3N0YW5kYXJkcycpXFxcIiBjbGFzcz1cXFwibWQtcHJpbWFyeVxcXCI+XFxuICAgICAgICAgICAge3tzdGFuZGFyZC5uYW1lfX1cXG4gICAgICAgICAgPC9tZC1jaGVja2JveD5cXG4gICAgICAgIDwvbGk+XFxuICAgICAgPC91bD5cXG5cXG4gICAgPC9kaXY+XFxuICA8L2Rpdj5cXG48L2Rpdj5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Project/Interoperability/Interoperability.html\n");

/***/ })

}]);