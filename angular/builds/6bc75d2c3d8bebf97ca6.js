(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[565],{

/***/ "./src/Project/ImplementationOverview/ReadOnlyImplementationOverview.html":
/*!********************************************************************************!*\
  !*** ./src/Project/ImplementationOverview/ReadOnlyImplementationOverview.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<div class=\\\"project-section section-strategy read-only\\\" md-whiteframe=\\\"2\\\">\\n  <div class=\\\"section-title md-title\\\">\\n    <translate>2. Implementation overview</translate>\\n    <span class=\\\"toggler\\\" ng-click=\\\"vm.collapse()\\\"><i class=\\\"material-icons\\\">keyboard_arrow_down</i></span>\\n  </div>\\n\\n  <div class=\\\"section-wrapper\\\">\\n    <h6>\\n      <translate>Add one or more Software and related Digital Health Interventions (DHI):</translate>\\n    </h6>\\n\\n    <div class=\\\"input-group\\\" ng-repeat=\\\"platform in vm.project.platforms\\\">\\n      <div class=\\\"extra-margin\\\">\\n        <h6>\\n          <translate>Software</translate>\\n        </h6>\\n        <p>{{platform.name}}</p>\\n      </div>\\n      <div>\\n        <h6>\\n          <translate>Digital Health Interventions</translate>\\n        </h6>\\n        <div layout=\\\"row\\\">\\n          <ul>\\n            <li ng-repeat=\\\"s in platform.strategies\\\">{{s.name}}</li>\\n          </ul>\\n        </div>\\n      </div>\\n    </div>\\n  </div>\\n\\n  <div class=\\\"section-wrapper\\\">\\n\\n    <h6>\\n      <translate>Health focus area(s)</translate>\\n    </h6>\\n\\n    <div>\\n      <ul>\\n        <li ng-repeat=\\\"hf in vm.project.health_focus_areas\\\">{{hf.name}}</li>\\n      </ul>\\n    </div>\\n\\n    <h6>\\n      <translate>What are the Health System Challenges (HSC) your project addresses?</translate>\\n    </h6>\\n\\n    <div>\\n      <ul>\\n        <li ng-repeat=\\\"hsc in vm.project.hsc_challenges\\\">{{hsc.challenge}}</li>\\n      </ul>\\n    </div>\\n\\n    <h6>\\n      <translate>What part(s) of the Health Information System (HIS) does this project support?</translate>\\n    </h6>\\n\\n    <div>\\n      <ul>\\n        <li ng-repeat=\\\"his in vm.project.his_bucket\\\">{{his.name}}</li>\\n      </ul>\\n    </div>\\n\\n    <h6>\\n      <translate>What kind of coverage does your project have?</translate>\\n    </h6>\\n\\n    <div>\\n      <div layout=\\\"column\\\">\\n        <span ng-show=\\\"vm.project.coverageType === 1\\\">\\n          <translate>Sub-national</translate>\\n        </span>\\n        <span ng-show=\\\"vm.project.coverageType === 2\\\">\\n          <translate>National</translate>\\n        </span>\\n      </div>\\n    </div>\\n\\n    <div ng-show=\\\"vm.project.coverageType === 1\\\">\\n      <h6 class=\\\"subtitle\\\"><i class=\\\"material-icons\\\">&#xE567;</i>\\n        <translate> {{vm.subLevelNames[0]}} level deployment</translate>\\n      </h6>\\n\\n      <div class=\\\"input-group\\\" ng-repeat=\\\"cov in vm.project.coverage\\\">\\n        <div layout=\\\"column\\\">\\n          <div layout=\\\"row\\\">\\n            <div class=\\\"district\\\" flex=\\\"50\\\">\\n              <h6 class=\\\"text-capitalize\\\">\\n                {{vm.subLevelNames[0]}}\\n              </h6>\\n              <p>{{cov.district}}</p>\\n            </div>\\n            <div flex=\\\"50\\\"></div>\\n          </div>\\n          <div layout=\\\"row\\\">\\n            <div class=\\\"number\\\" flex=\\\"20\\\">\\n              <h6>\\n                <translate># Health Workers</translate>\\n              </h6>\\n              <p>{{cov.health_workers}}</p>\\n            </div>\\n            <div class=\\\"number\\\" flex=\\\"20\\\">\\n              <h6>\\n                <translate># Facilities</translate>\\n              </h6>\\n              <p>{{cov.facilities}}</p>\\n            </div>\\n            <div class=\\\"number\\\" flex=\\\"20\\\">\\n              <h6>\\n                <translate># Clients</translate>\\n              </h6>\\n              <p>{{cov.clients}}</p>\\n            </div>\\n          </div>\\n        </div>\\n      </div>\\n\\n      <h6 class=\\\"subtitle\\\" ng-show=\\\"vm.project.coverage_second_level && vm.project.coverage_second_level.length > 0\\\">\\n        <i class=\\\"material-icons\\\">&#xE567;</i>\\n        <translate> {{vm.subLevelNames[1]}} level deployment</translate>\\n      </h6>\\n      <div class=\\\"input-group\\\" ng-repeat=\\\"cov in vm.project.coverage_second_level\\\">\\n        <div layout=\\\"column\\\">\\n          <div layout=\\\"row\\\">\\n            <div class=\\\"district\\\" flex=\\\"50\\\">\\n              <h6 class=\\\"text-capitalize\\\">\\n                {{vm.subLevelNames[1]}}\\n              </h6>\\n              <p>{{cov.district}}</p>\\n            </div>\\n            <div flex=\\\"50\\\"></div>\\n          </div>\\n          <div layout=\\\"row\\\">\\n            <div class=\\\"number\\\" flex=\\\"20\\\">\\n              <h6>\\n                <translate># Health Workers</translate>\\n              </h6>\\n              <p>{{cov.health_workers}}</p>\\n            </div>\\n            <div class=\\\"number\\\" flex=\\\"20\\\">\\n              <h6>\\n                <translate># Facilities</translate>\\n              </h6>\\n              <p>{{cov.facilities}}</p>\\n            </div>\\n            <div class=\\\"number\\\" flex=\\\"20\\\">\\n              <h6>\\n                <translate># Clients</translate>\\n              </h6>\\n              <p>{{cov.clients}}</p>\\n            </div>\\n          </div>\\n        </div>\\n      </div>\\n    </div>\\n\\n    <div ng-show=\\\"vm.project.coverageType === 2\\\">\\n      <h6 class=\\\"subtitle\\\"><i class=\\\"material-icons\\\">&#xE153;</i>\\n        <translate>National level deployment</translate>\\n      </h6>\\n\\n      <div class=\\\"input-group\\\">\\n        <div layout=\\\"row\\\">\\n          <div class=\\\"number\\\" flex=\\\"20\\\">\\n            <h6>\\n              <translate># Health Workers</translate>\\n            </h6>\\n            <p>{{vm.project.national_level_deployment.health_workers}}</p>\\n          </div>\\n          <div class=\\\"number\\\" flex=\\\"20\\\">\\n            <h6>\\n              <translate># Facilities</translate>\\n            </h6>\\n            <p>{{vm.project.national_level_deployment.facilities}}</p>\\n          </div>\\n          <div class=\\\"number\\\" flex=\\\"20\\\">\\n            <h6>\\n              <translate># Clients</translate>\\n            </h6>\\n            <p>{{vm.project.national_level_deployment.clients}}</p>\\n          </div>\\n          <div flex=\\\"40\\\"></div>\\n        </div>\\n      </div>\\n    </div>\\n\\n    <h6>\\n      <translate>Has the government financially invested in the project?</translate>\\n    </h6>\\n\\n    <div>\\n      <p ng-show=\\\"vm.project.government_investor === 0\\\">\\n        <translate>No, they have not yet contributed</translate>\\n      </p>\\n      <p ng-show=\\\"vm.project.government_investor === 1\\\">\\n        <translate>Yes, they are contributing in-kind people or time</translate>\\n      </p>\\n      <p ng-show=\\\"vm.project.government_investor === 2\\\">\\n        <translate>Yes, there is a financial contribution through MOH budget</translate>\\n      </p>\\n    </div>\\n\\n    <h6>\\n      <translate>Implementing partners</translate>\\n    </h6>\\n\\n    <div>\\n      <ul>\\n        <li ng-repeat=\\\"partner in vm.project.implementing_partners\\\">{{partner}}</li>\\n      </ul>\\n    </div>\\n\\n    <h6>\\n      <translate>Donors</translate>\\n    </h6>\\n\\n    <div>\\n      <ul>\\n        <li ng-repeat=\\\"donor in vm.project.donors\\\">{{donor}}</li>\\n      </ul>\\n    </div>\\n\\n  </div>\\n</div>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9JbXBsZW1lbnRhdGlvbk92ZXJ2aWV3L1JlYWRPbmx5SW1wbGVtZW50YXRpb25PdmVydmlldy5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL1Byb2plY3QvSW1wbGVtZW50YXRpb25PdmVydmlldy9SZWFkT25seUltcGxlbWVudGF0aW9uT3ZlcnZpZXcuaHRtbD9iZTA5Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPVxcXCJwcm9qZWN0LXNlY3Rpb24gc2VjdGlvbi1zdHJhdGVneSByZWFkLW9ubHlcXFwiIG1kLXdoaXRlZnJhbWU9XFxcIjJcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwic2VjdGlvbi10aXRsZSBtZC10aXRsZVxcXCI+XFxuICAgIDx0cmFuc2xhdGU+Mi4gSW1wbGVtZW50YXRpb24gb3ZlcnZpZXc8L3RyYW5zbGF0ZT5cXG4gICAgPHNwYW4gY2xhc3M9XFxcInRvZ2dsZXJcXFwiIG5nLWNsaWNrPVxcXCJ2bS5jb2xsYXBzZSgpXFxcIj48aSBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnNcXFwiPmtleWJvYXJkX2Fycm93X2Rvd248L2k+PC9zcGFuPlxcbiAgPC9kaXY+XFxuXFxuICA8ZGl2IGNsYXNzPVxcXCJzZWN0aW9uLXdyYXBwZXJcXFwiPlxcbiAgICA8aDY+XFxuICAgICAgPHRyYW5zbGF0ZT5BZGQgb25lIG9yIG1vcmUgU29mdHdhcmUgYW5kIHJlbGF0ZWQgRGlnaXRhbCBIZWFsdGggSW50ZXJ2ZW50aW9ucyAoREhJKTo8L3RyYW5zbGF0ZT5cXG4gICAgPC9oNj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXBcXFwiIG5nLXJlcGVhdD1cXFwicGxhdGZvcm0gaW4gdm0ucHJvamVjdC5wbGF0Zm9ybXNcXFwiPlxcbiAgICAgIDxkaXYgY2xhc3M9XFxcImV4dHJhLW1hcmdpblxcXCI+XFxuICAgICAgICA8aDY+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+U29mdHdhcmU8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvaDY+XFxuICAgICAgICA8cD57e3BsYXRmb3JtLm5hbWV9fTwvcD5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2PlxcbiAgICAgICAgPGg2PlxcbiAgICAgICAgICA8dHJhbnNsYXRlPkRpZ2l0YWwgSGVhbHRoIEludGVydmVudGlvbnM8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvaDY+XFxuICAgICAgICA8ZGl2IGxheW91dD1cXFwicm93XFxcIj5cXG4gICAgICAgICAgPHVsPlxcbiAgICAgICAgICAgIDxsaSBuZy1yZXBlYXQ9XFxcInMgaW4gcGxhdGZvcm0uc3RyYXRlZ2llc1xcXCI+e3tzLm5hbWV9fTwvbGk+XFxuICAgICAgICAgIDwvdWw+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICA8L2Rpdj5cXG5cXG4gIDxkaXYgY2xhc3M9XFxcInNlY3Rpb24td3JhcHBlclxcXCI+XFxuXFxuICAgIDxoNj5cXG4gICAgICA8dHJhbnNsYXRlPkhlYWx0aCBmb2N1cyBhcmVhKHMpPC90cmFuc2xhdGU+XFxuICAgIDwvaDY+XFxuXFxuICAgIDxkaXY+XFxuICAgICAgPHVsPlxcbiAgICAgICAgPGxpIG5nLXJlcGVhdD1cXFwiaGYgaW4gdm0ucHJvamVjdC5oZWFsdGhfZm9jdXNfYXJlYXNcXFwiPnt7aGYubmFtZX19PC9saT5cXG4gICAgICA8L3VsPlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGg2PlxcbiAgICAgIDx0cmFuc2xhdGU+V2hhdCBhcmUgdGhlIEhlYWx0aCBTeXN0ZW0gQ2hhbGxlbmdlcyAoSFNDKSB5b3VyIHByb2plY3QgYWRkcmVzc2VzPzwvdHJhbnNsYXRlPlxcbiAgICA8L2g2PlxcblxcbiAgICA8ZGl2PlxcbiAgICAgIDx1bD5cXG4gICAgICAgIDxsaSBuZy1yZXBlYXQ9XFxcImhzYyBpbiB2bS5wcm9qZWN0LmhzY19jaGFsbGVuZ2VzXFxcIj57e2hzYy5jaGFsbGVuZ2V9fTwvbGk+XFxuICAgICAgPC91bD5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxoNj5cXG4gICAgICA8dHJhbnNsYXRlPldoYXQgcGFydChzKSBvZiB0aGUgSGVhbHRoIEluZm9ybWF0aW9uIFN5c3RlbSAoSElTKSBkb2VzIHRoaXMgcHJvamVjdCBzdXBwb3J0PzwvdHJhbnNsYXRlPlxcbiAgICA8L2g2PlxcblxcbiAgICA8ZGl2PlxcbiAgICAgIDx1bD5cXG4gICAgICAgIDxsaSBuZy1yZXBlYXQ9XFxcImhpcyBpbiB2bS5wcm9qZWN0Lmhpc19idWNrZXRcXFwiPnt7aGlzLm5hbWV9fTwvbGk+XFxuICAgICAgPC91bD5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxoNj5cXG4gICAgICA8dHJhbnNsYXRlPldoYXQga2luZCBvZiBjb3ZlcmFnZSBkb2VzIHlvdXIgcHJvamVjdCBoYXZlPzwvdHJhbnNsYXRlPlxcbiAgICA8L2g2PlxcblxcbiAgICA8ZGl2PlxcbiAgICAgIDxkaXYgbGF5b3V0PVxcXCJjb2x1bW5cXFwiPlxcbiAgICAgICAgPHNwYW4gbmctc2hvdz1cXFwidm0ucHJvamVjdC5jb3ZlcmFnZVR5cGUgPT09IDFcXFwiPlxcbiAgICAgICAgICA8dHJhbnNsYXRlPlN1Yi1uYXRpb25hbDwvdHJhbnNsYXRlPlxcbiAgICAgICAgPC9zcGFuPlxcbiAgICAgICAgPHNwYW4gbmctc2hvdz1cXFwidm0ucHJvamVjdC5jb3ZlcmFnZVR5cGUgPT09IDJcXFwiPlxcbiAgICAgICAgICA8dHJhbnNsYXRlPk5hdGlvbmFsPC90cmFuc2xhdGU+XFxuICAgICAgICA8L3NwYW4+XFxuICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2IG5nLXNob3c9XFxcInZtLnByb2plY3QuY292ZXJhZ2VUeXBlID09PSAxXFxcIj5cXG4gICAgICA8aDYgY2xhc3M9XFxcInN1YnRpdGxlXFxcIj48aSBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnNcXFwiPiYjeEU1Njc7PC9pPlxcbiAgICAgICAgPHRyYW5zbGF0ZT4ge3t2bS5zdWJMZXZlbE5hbWVzWzBdfX0gbGV2ZWwgZGVwbG95bWVudDwvdHJhbnNsYXRlPlxcbiAgICAgIDwvaDY+XFxuXFxuICAgICAgPGRpdiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXBcXFwiIG5nLXJlcGVhdD1cXFwiY292IGluIHZtLnByb2plY3QuY292ZXJhZ2VcXFwiPlxcbiAgICAgICAgPGRpdiBsYXlvdXQ9XFxcImNvbHVtblxcXCI+XFxuICAgICAgICAgIDxkaXYgbGF5b3V0PVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImRpc3RyaWN0XFxcIiBmbGV4PVxcXCI1MFxcXCI+XFxuICAgICAgICAgICAgICA8aDYgY2xhc3M9XFxcInRleHQtY2FwaXRhbGl6ZVxcXCI+XFxuICAgICAgICAgICAgICAgIHt7dm0uc3ViTGV2ZWxOYW1lc1swXX19XFxuICAgICAgICAgICAgICA8L2g2PlxcbiAgICAgICAgICAgICAgPHA+e3tjb3YuZGlzdHJpY3R9fTwvcD5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGZsZXg9XFxcIjUwXFxcIj48L2Rpdj5cXG4gICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgIDxkaXYgbGF5b3V0PVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIm51bWJlclxcXCIgZmxleD1cXFwiMjBcXFwiPlxcbiAgICAgICAgICAgICAgPGg2PlxcbiAgICAgICAgICAgICAgICA8dHJhbnNsYXRlPiMgSGVhbHRoIFdvcmtlcnM8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgIDwvaDY+XFxuICAgICAgICAgICAgICA8cD57e2Nvdi5oZWFsdGhfd29ya2Vyc319PC9wPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIm51bWJlclxcXCIgZmxleD1cXFwiMjBcXFwiPlxcbiAgICAgICAgICAgICAgPGg2PlxcbiAgICAgICAgICAgICAgICA8dHJhbnNsYXRlPiMgRmFjaWxpdGllczwvdHJhbnNsYXRlPlxcbiAgICAgICAgICAgICAgPC9oNj5cXG4gICAgICAgICAgICAgIDxwPnt7Y292LmZhY2lsaXRpZXN9fTwvcD5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJudW1iZXJcXFwiIGZsZXg9XFxcIjIwXFxcIj5cXG4gICAgICAgICAgICAgIDxoNj5cXG4gICAgICAgICAgICAgICAgPHRyYW5zbGF0ZT4jIENsaWVudHM8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgIDwvaDY+XFxuICAgICAgICAgICAgICA8cD57e2Nvdi5jbGllbnRzfX08L3A+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgPC9kaXY+XFxuXFxuICAgICAgPGg2IGNsYXNzPVxcXCJzdWJ0aXRsZVxcXCIgbmctc2hvdz1cXFwidm0ucHJvamVjdC5jb3ZlcmFnZV9zZWNvbmRfbGV2ZWwgJiYgdm0ucHJvamVjdC5jb3ZlcmFnZV9zZWNvbmRfbGV2ZWwubGVuZ3RoID4gMFxcXCI+XFxuICAgICAgICA8aSBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnNcXFwiPiYjeEU1Njc7PC9pPlxcbiAgICAgICAgPHRyYW5zbGF0ZT4ge3t2bS5zdWJMZXZlbE5hbWVzWzFdfX0gbGV2ZWwgZGVwbG95bWVudDwvdHJhbnNsYXRlPlxcbiAgICAgIDwvaDY+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXBcXFwiIG5nLXJlcGVhdD1cXFwiY292IGluIHZtLnByb2plY3QuY292ZXJhZ2Vfc2Vjb25kX2xldmVsXFxcIj5cXG4gICAgICAgIDxkaXYgbGF5b3V0PVxcXCJjb2x1bW5cXFwiPlxcbiAgICAgICAgICA8ZGl2IGxheW91dD1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkaXN0cmljdFxcXCIgZmxleD1cXFwiNTBcXFwiPlxcbiAgICAgICAgICAgICAgPGg2IGNsYXNzPVxcXCJ0ZXh0LWNhcGl0YWxpemVcXFwiPlxcbiAgICAgICAgICAgICAgICB7e3ZtLnN1YkxldmVsTmFtZXNbMV19fVxcbiAgICAgICAgICAgICAgPC9oNj5cXG4gICAgICAgICAgICAgIDxwPnt7Y292LmRpc3RyaWN0fX08L3A+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBmbGV4PVxcXCI1MFxcXCI+PC9kaXY+XFxuICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8ZGl2IGxheW91dD1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJudW1iZXJcXFwiIGZsZXg9XFxcIjIwXFxcIj5cXG4gICAgICAgICAgICAgIDxoNj5cXG4gICAgICAgICAgICAgICAgPHRyYW5zbGF0ZT4jIEhlYWx0aCBXb3JrZXJzPC90cmFuc2xhdGU+XFxuICAgICAgICAgICAgICA8L2g2PlxcbiAgICAgICAgICAgICAgPHA+e3tjb3YuaGVhbHRoX3dvcmtlcnN9fTwvcD5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJudW1iZXJcXFwiIGZsZXg9XFxcIjIwXFxcIj5cXG4gICAgICAgICAgICAgIDxoNj5cXG4gICAgICAgICAgICAgICAgPHRyYW5zbGF0ZT4jIEZhY2lsaXRpZXM8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgIDwvaDY+XFxuICAgICAgICAgICAgICA8cD57e2Nvdi5mYWNpbGl0aWVzfX08L3A+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibnVtYmVyXFxcIiBmbGV4PVxcXCIyMFxcXCI+XFxuICAgICAgICAgICAgICA8aDY+XFxuICAgICAgICAgICAgICAgIDx0cmFuc2xhdGU+IyBDbGllbnRzPC90cmFuc2xhdGU+XFxuICAgICAgICAgICAgICA8L2g2PlxcbiAgICAgICAgICAgICAgPHA+e3tjb3YuY2xpZW50c319PC9wPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBuZy1zaG93PVxcXCJ2bS5wcm9qZWN0LmNvdmVyYWdlVHlwZSA9PT0gMlxcXCI+XFxuICAgICAgPGg2IGNsYXNzPVxcXCJzdWJ0aXRsZVxcXCI+PGkgY2xhc3M9XFxcIm1hdGVyaWFsLWljb25zXFxcIj4mI3hFMTUzOzwvaT5cXG4gICAgICAgIDx0cmFuc2xhdGU+TmF0aW9uYWwgbGV2ZWwgZGVwbG95bWVudDwvdHJhbnNsYXRlPlxcbiAgICAgIDwvaDY+XFxuXFxuICAgICAgPGRpdiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXBcXFwiPlxcbiAgICAgICAgPGRpdiBsYXlvdXQ9XFxcInJvd1xcXCI+XFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIm51bWJlclxcXCIgZmxleD1cXFwiMjBcXFwiPlxcbiAgICAgICAgICAgIDxoNj5cXG4gICAgICAgICAgICAgIDx0cmFuc2xhdGU+IyBIZWFsdGggV29ya2VyczwvdHJhbnNsYXRlPlxcbiAgICAgICAgICAgIDwvaDY+XFxuICAgICAgICAgICAgPHA+e3t2bS5wcm9qZWN0Lm5hdGlvbmFsX2xldmVsX2RlcGxveW1lbnQuaGVhbHRoX3dvcmtlcnN9fTwvcD5cXG4gICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIm51bWJlclxcXCIgZmxleD1cXFwiMjBcXFwiPlxcbiAgICAgICAgICAgIDxoNj5cXG4gICAgICAgICAgICAgIDx0cmFuc2xhdGU+IyBGYWNpbGl0aWVzPC90cmFuc2xhdGU+XFxuICAgICAgICAgICAgPC9oNj5cXG4gICAgICAgICAgICA8cD57e3ZtLnByb2plY3QubmF0aW9uYWxfbGV2ZWxfZGVwbG95bWVudC5mYWNpbGl0aWVzfX08L3A+XFxuICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJudW1iZXJcXFwiIGZsZXg9XFxcIjIwXFxcIj5cXG4gICAgICAgICAgICA8aDY+XFxuICAgICAgICAgICAgICA8dHJhbnNsYXRlPiMgQ2xpZW50czwvdHJhbnNsYXRlPlxcbiAgICAgICAgICAgIDwvaDY+XFxuICAgICAgICAgICAgPHA+e3t2bS5wcm9qZWN0Lm5hdGlvbmFsX2xldmVsX2RlcGxveW1lbnQuY2xpZW50c319PC9wPlxcbiAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgPGRpdiBmbGV4PVxcXCI0MFxcXCI+PC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxoNj5cXG4gICAgICA8dHJhbnNsYXRlPkhhcyB0aGUgZ292ZXJubWVudCBmaW5hbmNpYWxseSBpbnZlc3RlZCBpbiB0aGUgcHJvamVjdD88L3RyYW5zbGF0ZT5cXG4gICAgPC9oNj5cXG5cXG4gICAgPGRpdj5cXG4gICAgICA8cCBuZy1zaG93PVxcXCJ2bS5wcm9qZWN0LmdvdmVybm1lbnRfaW52ZXN0b3IgPT09IDBcXFwiPlxcbiAgICAgICAgPHRyYW5zbGF0ZT5ObywgdGhleSBoYXZlIG5vdCB5ZXQgY29udHJpYnV0ZWQ8L3RyYW5zbGF0ZT5cXG4gICAgICA8L3A+XFxuICAgICAgPHAgbmctc2hvdz1cXFwidm0ucHJvamVjdC5nb3Zlcm5tZW50X2ludmVzdG9yID09PSAxXFxcIj5cXG4gICAgICAgIDx0cmFuc2xhdGU+WWVzLCB0aGV5IGFyZSBjb250cmlidXRpbmcgaW4ta2luZCBwZW9wbGUgb3IgdGltZTwvdHJhbnNsYXRlPlxcbiAgICAgIDwvcD5cXG4gICAgICA8cCBuZy1zaG93PVxcXCJ2bS5wcm9qZWN0LmdvdmVybm1lbnRfaW52ZXN0b3IgPT09IDJcXFwiPlxcbiAgICAgICAgPHRyYW5zbGF0ZT5ZZXMsIHRoZXJlIGlzIGEgZmluYW5jaWFsIGNvbnRyaWJ1dGlvbiB0aHJvdWdoIE1PSCBidWRnZXQ8L3RyYW5zbGF0ZT5cXG4gICAgICA8L3A+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8aDY+XFxuICAgICAgPHRyYW5zbGF0ZT5JbXBsZW1lbnRpbmcgcGFydG5lcnM8L3RyYW5zbGF0ZT5cXG4gICAgPC9oNj5cXG5cXG4gICAgPGRpdj5cXG4gICAgICA8dWw+XFxuICAgICAgICA8bGkgbmctcmVwZWF0PVxcXCJwYXJ0bmVyIGluIHZtLnByb2plY3QuaW1wbGVtZW50aW5nX3BhcnRuZXJzXFxcIj57e3BhcnRuZXJ9fTwvbGk+XFxuICAgICAgPC91bD5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxoNj5cXG4gICAgICA8dHJhbnNsYXRlPkRvbm9yczwvdHJhbnNsYXRlPlxcbiAgICA8L2g2PlxcblxcbiAgICA8ZGl2PlxcbiAgICAgIDx1bD5cXG4gICAgICAgIDxsaSBuZy1yZXBlYXQ9XFxcImRvbm9yIGluIHZtLnByb2plY3QuZG9ub3JzXFxcIj57e2Rvbm9yfX08L2xpPlxcbiAgICAgIDwvdWw+XFxuICAgIDwvZGl2PlxcblxcbiAgPC9kaXY+XFxuPC9kaXY+XFxuXCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/Project/ImplementationOverview/ReadOnlyImplementationOverview.html\n");

/***/ })

}]);