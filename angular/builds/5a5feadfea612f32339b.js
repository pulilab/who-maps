(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[301],{

/***/ "./src/Dashboard/Dashboard.html":
/*!**************************************!*\
  !*** ./src/Dashboard/Dashboard.html ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = \"\\n<div id=\\\"dashboard-container\\\" layout=\\\"column\\\">\\n\\n  <md-card md-whiteframe=\\\"2\\\" class=\\\"rel\\\" layout=\\\"row\\\">\\n    <div class=\\\"littleheader\\\">\\n      <translate>DASHBOARD</translate>\\n    </div>\\n\\n    <md-tabs md-border-bottom md-center-tabs=\\\"true\\\" flex class=\\\"dashboard-tab-container\\\" md-selected=\\\"vm.currentTab\\\">\\n\\n      <!-- MAP VIEW -->\\n\\n      <md-tab label=\\\"{{'map view' | translate }}\\\">\\n\\n        <div class=\\\"tab-wrap map\\\" id=\\\"map\\\" ng-class=\\\"{'emptyy': !vm.projectsData}\\\">\\n\\n          <md-card md-whiteframe=\\\"2\\\" class=\\\"countrychoser\\\">\\n            <md-input-container>\\n              <md-select\\n                class=\\\"no-border\\\"\\n                md-container-class=\\\"country-chooser topalign\\\"\\n                ng-model-options=\\\"{trackBy: '$value.id', allowInvalid: true}\\\"\\n                placeholder=\\\"{{'Select a country'|translate}}\\\"\\n                ng-model=\\\"vm.selectedCountry\\\">\\n\\n                <md-option ng-repeat=\\\"country in vm.countries track by $index\\\" ng-value=\\\"country\\\">{{country.name}}</md-option>\\n\\n              </md-select>\\n            </md-input-container>\\n          </md-card>\\n\\n          <countrymap\\n            big=\\\"true\\\"\\n            district-level-coverage=\\\"vm.districtProjects\\\"\\n            national-level-coverage=\\\"vm.nationalLevelCoverage\\\"\\n            map-data=\\\"vm.mapData\\\">\\n          </countrymap>\\n\\n        </div>\\n\\n      </md-tab>\\n\\n\\n      <!-- LIST VIEW -->\\n      <md-tab label=\\\"{{'list view' | translate }}\\\">\\n        <div class=\\\"tab-wrap\\\" id=\\\"list\\\">\\n\\n          <div class=\\\"headercont\\\" layout=\\\"row\\\">\\n            <md-card md-whiteframe=\\\"2\\\" class=\\\"countrychoser\\\" flex=\\\"nogrow\\\">\\n              <md-input-container>\\n                <md-select\\n                  class=\\\"no-border\\\"\\n                  md-container-class=\\\"country-chooser topalign\\\"\\n                  ng-model-options=\\\"{trackBy: '$value.id'}\\\"\\n                  placeholder=\\\"{{'Select a country'|translate}}\\\"\\n                  ng-model=\\\"vm.selectedCountry\\\">\\n\\n                  <md-option ng-value=\\\"vm.showAllCountries\\\">\\n                    <translate>Show all countries</translate>\\n                  </md-option>\\n                  <md-option ng-repeat=\\\"country in vm.countries track by $index\\\" ng-value=\\\"{{country}}\\\">{{country.name}}</md-option>\\n\\n                </md-select>\\n              </md-input-container>\\n            </md-card>\\n\\n            <div class=\\\"exports\\\" layout=\\\"row\\\" flex=\\\"grow\\\" layout-align=\\\"end center\\\" ng-show=\\\"vm.projectsData && vm.projectsData.length > 0\\\">\\n              <span class=\\\"exports-label\\\">\\n                <translate>Export list:</translate></span>\\n              <md-button class=\\\"md-primary md-raised md-small\\\" ng-click=\\\"vm.exportPDF()\\\">\\n                <md-icon>file_download</md-icon>\\n                <translate>PDF</translate>\\n              </md-button>\\n              <md-button class=\\\"md-primary md-raised md-small\\\" ng-click=\\\"vm.exportCSV()\\\">\\n                <md-icon>file_download</md-icon>\\n                <translate>CSV</translate>\\n              </md-button>\\n            </div>\\n\\n            <div class=\\\"starry\\\" layout=\\\"row\\\" flex=\\\"nogrow\\\" layout-align=\\\"end center\\\">\\n              <span><md-icon>visibility</md-icon><translate>Viewer</translate></span>\\n              <span><md-icon>grade</md-icon><translate>Team member</translate></span>\\n            </div>\\n          </div>\\n\\n          <md-content class=\\\"projectcont\\\">\\n            <div class=\\\"scroll-wrapper\\\">\\n              <div class=\\\"headerrow\\\" layout=\\\"row\\\" layout-padding md-whiteframe=\\\"2\\\">\\n                <div flex=\\\"30\\\" ng-click=\\\"vm.orderTable('name')\\\">\\n                  <translate>Project name</translate>\\n                  <md-icon ng-show=\\\"vm.header.name.up\\\" >expand_more</md-icon>\\n                  <md-icon ng-show=\\\"vm.header.name.down\\\" >expand_less</md-icon>\\n                </div>\\n                <div flex=\\\"20\\\" ng-click=\\\"vm.orderTable('country')\\\">\\n                  <translate>Country</translate>\\n                  <md-icon ng-show=\\\"vm.header.country.up\\\" >expand_more</md-icon>\\n                  <md-icon ng-show=\\\"vm.header.country.down\\\" >expand_less</md-icon>\\n                </div>\\n                <div flex=\\\"20\\\" ng-click=\\\"vm.orderTable('organisation_name')\\\">\\n                  <translate>Organisation name</translate>\\n                  <md-icon ng-show=\\\"vm.header.organisation_name.up\\\" >expand_more</md-icon>\\n                  <md-icon ng-show=\\\"vm.header.organisation_name.down\\\" >expand_less</md-icon>\\n                </div>\\n                <div flex=\\\"20\\\" ng-click=\\\"vm.orderTable('donors')\\\">\\n                  <translate>Donors</translate>\\n                  <md-icon ng-show=\\\"vm.header.donors.up\\\" >expand_more</md-icon>\\n                  <md-icon ng-show=\\\"vm.header.donors.down\\\" >expand_less</md-icon>\\n                </div>\\n                <div flex=\\\"20\\\" ng-click=\\\"vm.orderTable('contact_name')\\\">\\n                  <translate>Contact Name</translate>\\n                  <md-icon ng-show=\\\"vm.header.contact_name.up\\\" >expand_more</md-icon>\\n                  <md-icon ng-show=\\\"vm.header.contact_name.down\\\" >expand_less</md-icon>\\n                </div>\\n                <div flex=\\\"30\\\" ng-click=\\\"vm.orderTable('implementation_overview')\\\">\\n                  <translate>Overview of digital health implementation</translate>\\n                  <md-icon ng-show=\\\"vm.header.implementation_overview.up\\\" >expand_more</md-icon>\\n                  <md-icon ng-show=\\\"vm.header.implementation_overview.down\\\" >expand_less</md-icon>\\n                </div>\\n                <div flex=\\\"20\\\" ng-click=\\\"vm.orderTable('implementing_partners')\\\">\\n                  <translate>Implementing partners</translate>\\n                  <md-icon ng-show=\\\"vm.header.implementing_partners.up\\\" >expand_more</md-icon>\\n                  <md-icon ng-show=\\\"vm.header.implementing_partners.down\\\" >expand_less</md-icon>\\n                </div>\\n                <div flex=\\\"20\\\" ng-click=\\\"vm.orderTable('geographic_scope')\\\">\\n                  <translate>Geographic scope</translate>\\n                  <md-icon ng-show=\\\"vm.header.geographic_scope.up\\\" >expand_more</md-icon>\\n                  <md-icon ng-show=\\\"vm.header.geographic_scope.down\\\" >expand_less</md-icon>\\n                </div>\\n                <div flex=\\\"20\\\" ng-click=\\\"vm.orderTable('health_focus_areas')\\\">\\n                  <translate>Health Focus Areas</translate>\\n                  <md-icon ng-show=\\\"vm.header.health_focus_areas.up\\\" >expand_more</md-icon>\\n                  <md-icon ng-show=\\\"vm.header.health_focus_areas.down\\\" >expand_less</md-icon>\\n                </div>\\n              </div>\\n\\n              <div\\n                class=\\\"projectrow\\\"\\n                layout=\\\"row\\\"\\n                layout-padding\\n                ng-repeat=\\\"project in vm.projectsData track by $index\\\"\\n                ng-class=\\\"{'member': project.isMember, 'viewer': project.isViewer}\\\">\\n\\n                <div flex=\\\"30\\\" class=\\\"projectlink\\\" layout=\\\"row\\\">\\n                  <div layout=\\\"row\\\" flex class=\\\"name\\\">\\n                    <div>\\n                      <md-icon class=\\\"member\\\" ng-show=\\\"project.isMember\\\">grade</md-icon>\\n                      <md-icon class=\\\"viewer\\\" ng-show=\\\"project.isViewer\\\">visibility</md-icon>\\n                    </div>\\n                    <div>\\n                      <div class=\\\"name\\\">\\n                        {{project.name}}\\n                      </div>\\n\\n                      <div class=\\\"country-approved\\\" ng-show=\\\"project.approved\\\">\\n                        <i class=\\\"material-icons\\\">assignment_turned_in</i>\\n                        <translate>Verified by country</translate>\\n                      </div>\\n\\n                      <div class=\\\"links\\\">\\n                        <md-button  ui-sref=\\\"editProject({ appName: project.id, editMode: 'publish' })\\\" class=\\\"md-primary md-raised md-small\\\"><translate>Project Details</translate></md-button>\\n                      </div>\\n                    </div>\\n                  </div>\\n                </div>\\n                <div flex=\\\"20\\\" class=\\\"cap\\\">\\n                  {{vm.countriesLib[project.country]}}\\n                </div>\\n                <div flex=\\\"20\\\">{{project.organisation_name}}</div>\\n                <div flex=\\\"20\\\">\\n                        <span ng-repeat=\\\"donor in project.donors\\\">\\n                            {{donor}}{{$last ? '' : ', '}}\\n                        </span>\\n                </div>\\n                <div flex=\\\"20\\\">{{project.contact_name}}, <a ng-href=\\\"mailto:{{project.contact_email}}\\\">{{project.contact_email}}</a></div>\\n                <div flex=\\\"30\\\">{{project.implementation_overview}}</div>\\n                <div flex=\\\"20\\\">{{vm.printImplementingPartners(project)}}</div>\\n                <div flex=\\\"20\\\">{{project.geographic_scope}}</div>\\n                <div flex=\\\"20\\\">{{project.health_focus_areas.join(', ')}}</div>\\n\\n              </div>\\n              <div ng-if=\\\"!vm.projectsData.length\\\" class=\\\"projectrow\\\" layout=\\\"row\\\" layout-padding>\\n                <div flex><translate>There is no project to show in this country.</translate></div>\\n              </div>\\n            </div>\\n          </md-content>\\n        </div>\\n      </md-tab>\\n    </md-tabs>\\n\\n    <div class=\\\"dashboard-filter-container\\\" flex layout=\\\"row\\\">\\n      <div class=\\\"filter-wrapper\\\" layout=\\\"row\\\" flex=\\\"100\\\">\\n        <div class=\\\"filter-project-counter\\\" md-whiteframe=\\\"2\\\">\\n          <div class=\\\"project-counter-name\\\">\\n            <div class=\\\"description\\\">\\n              <translate>Number of Projects</translate>\\n            </div>\\n            <div class=\\\"country-name\\\">\\n              <!-- in {{vm.selectedCountry.name}} -->\\n              <translate>in selected country</translate>\\n            </div>\\n          </div>\\n          <div class=\\\"project-counter-arrow\\\">\\n            <img src=\\\"\" + __webpack_require__(/*! ./img/after-white.svg */ \"./src/Dashboard/img/after-white.svg\") + \"\\\" />\\n          </div>\\n          <div class=\\\"project-counter-number\\\">\\n            {{ vm.projectsData.length}}\\n          </div>\\n        </div>\\n\\n        <div class=\\\"filter-list\\\">\\n\\n          <div class=\\\"description\\\"><translate>Apply filters to map:</translate></div>\\n\\n          <div class=\\\"country-approval-switch\\\" layout=\\\"row\\\" layout-align=\\\"start center\\\" ng-show=\\\"vm.selectedCountry.project_approval\\\">\\n            <md-switch class=\\\"md-primary\\\" ng-model=\\\"vm.showOnlyApproved\\\" aria-label=\\\"show only verified\\\"></md-switch>\\n            <span class=\\\"md-label\\\">\\n              <translate>Show only verified projects</translate>\\n            </span>\\n          </div>\\n\\n          <div class=\\\"list-headers\\\" ng-repeat=\\\"header in vm.filters\\\">\\n\\n            <div class=\\\"header\\\" ng-click=\\\"header.open = !header.open\\\">\\n              <md-icon ng-hide=\\\"header.open\\\" >expand_more</md-icon>\\n              <md-icon ng-show=\\\"header.open\\\" >expand_less</md-icon>\\n              {{header.name}} ({{header.items.length}})\\n            </div>\\n\\n            <div class=\\\"list-item\\\" ng-repeat=\\\"item in header.items  | orderBy: 'name' \\\" ng-show=\\\"header.open\\\">\\n              <md-checkbox class=\\\"md-primary small\\\" ng-model=\\\"item.value\\\" aria-label=\\\"item.name\\\">\\n                {{item.name}}\\n              </md-checkbox>\\n            </div>\\n\\n          </div>\\n        </div>\\n      </div>\\n    </div>\\n  </md-card>\\n\\n  <disclaimer></disclaimer>\\n</div>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvRGFzaGJvYXJkL0Rhc2hib2FyZC5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0Rhc2hib2FyZC9EYXNoYm9hcmQuaHRtbD84ZDI5Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCJcXG48ZGl2IGlkPVxcXCJkYXNoYm9hcmQtY29udGFpbmVyXFxcIiBsYXlvdXQ9XFxcImNvbHVtblxcXCI+XFxuXFxuICA8bWQtY2FyZCBtZC13aGl0ZWZyYW1lPVxcXCIyXFxcIiBjbGFzcz1cXFwicmVsXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImxpdHRsZWhlYWRlclxcXCI+XFxuICAgICAgPHRyYW5zbGF0ZT5EQVNIQk9BUkQ8L3RyYW5zbGF0ZT5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxtZC10YWJzIG1kLWJvcmRlci1ib3R0b20gbWQtY2VudGVyLXRhYnM9XFxcInRydWVcXFwiIGZsZXggY2xhc3M9XFxcImRhc2hib2FyZC10YWItY29udGFpbmVyXFxcIiBtZC1zZWxlY3RlZD1cXFwidm0uY3VycmVudFRhYlxcXCI+XFxuXFxuICAgICAgPCEtLSBNQVAgVklFVyAtLT5cXG5cXG4gICAgICA8bWQtdGFiIGxhYmVsPVxcXCJ7eydtYXAgdmlldycgfCB0cmFuc2xhdGUgfX1cXFwiPlxcblxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwidGFiLXdyYXAgbWFwXFxcIiBpZD1cXFwibWFwXFxcIiBuZy1jbGFzcz1cXFwieydlbXB0eXknOiAhdm0ucHJvamVjdHNEYXRhfVxcXCI+XFxuXFxuICAgICAgICAgIDxtZC1jYXJkIG1kLXdoaXRlZnJhbWU9XFxcIjJcXFwiIGNsYXNzPVxcXCJjb3VudHJ5Y2hvc2VyXFxcIj5cXG4gICAgICAgICAgICA8bWQtaW5wdXQtY29udGFpbmVyPlxcbiAgICAgICAgICAgICAgPG1kLXNlbGVjdFxcbiAgICAgICAgICAgICAgICBjbGFzcz1cXFwibm8tYm9yZGVyXFxcIlxcbiAgICAgICAgICAgICAgICBtZC1jb250YWluZXItY2xhc3M9XFxcImNvdW50cnktY2hvb3NlciB0b3BhbGlnblxcXCJcXG4gICAgICAgICAgICAgICAgbmctbW9kZWwtb3B0aW9ucz1cXFwie3RyYWNrQnk6ICckdmFsdWUuaWQnLCBhbGxvd0ludmFsaWQ6IHRydWV9XFxcIlxcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwie3snU2VsZWN0IGEgY291bnRyeSd8dHJhbnNsYXRlfX1cXFwiXFxuICAgICAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJ2bS5zZWxlY3RlZENvdW50cnlcXFwiPlxcblxcbiAgICAgICAgICAgICAgICA8bWQtb3B0aW9uIG5nLXJlcGVhdD1cXFwiY291bnRyeSBpbiB2bS5jb3VudHJpZXMgdHJhY2sgYnkgJGluZGV4XFxcIiBuZy12YWx1ZT1cXFwiY291bnRyeVxcXCI+e3tjb3VudHJ5Lm5hbWV9fTwvbWQtb3B0aW9uPlxcblxcbiAgICAgICAgICAgICAgPC9tZC1zZWxlY3Q+XFxuICAgICAgICAgICAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuICAgICAgICAgIDwvbWQtY2FyZD5cXG5cXG4gICAgICAgICAgPGNvdW50cnltYXBcXG4gICAgICAgICAgICBiaWc9XFxcInRydWVcXFwiXFxuICAgICAgICAgICAgZGlzdHJpY3QtbGV2ZWwtY292ZXJhZ2U9XFxcInZtLmRpc3RyaWN0UHJvamVjdHNcXFwiXFxuICAgICAgICAgICAgbmF0aW9uYWwtbGV2ZWwtY292ZXJhZ2U9XFxcInZtLm5hdGlvbmFsTGV2ZWxDb3ZlcmFnZVxcXCJcXG4gICAgICAgICAgICBtYXAtZGF0YT1cXFwidm0ubWFwRGF0YVxcXCI+XFxuICAgICAgICAgIDwvY291bnRyeW1hcD5cXG5cXG4gICAgICAgIDwvZGl2PlxcblxcbiAgICAgIDwvbWQtdGFiPlxcblxcblxcbiAgICAgIDwhLS0gTElTVCBWSUVXIC0tPlxcbiAgICAgIDxtZC10YWIgbGFiZWw9XFxcInt7J2xpc3QgdmlldycgfCB0cmFuc2xhdGUgfX1cXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwidGFiLXdyYXBcXFwiIGlkPVxcXCJsaXN0XFxcIj5cXG5cXG4gICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaGVhZGVyY29udFxcXCIgbGF5b3V0PVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgIDxtZC1jYXJkIG1kLXdoaXRlZnJhbWU9XFxcIjJcXFwiIGNsYXNzPVxcXCJjb3VudHJ5Y2hvc2VyXFxcIiBmbGV4PVxcXCJub2dyb3dcXFwiPlxcbiAgICAgICAgICAgICAgPG1kLWlucHV0LWNvbnRhaW5lcj5cXG4gICAgICAgICAgICAgICAgPG1kLXNlbGVjdFxcbiAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJuby1ib3JkZXJcXFwiXFxuICAgICAgICAgICAgICAgICAgbWQtY29udGFpbmVyLWNsYXNzPVxcXCJjb3VudHJ5LWNob29zZXIgdG9wYWxpZ25cXFwiXFxuICAgICAgICAgICAgICAgICAgbmctbW9kZWwtb3B0aW9ucz1cXFwie3RyYWNrQnk6ICckdmFsdWUuaWQnfVxcXCJcXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwie3snU2VsZWN0IGEgY291bnRyeSd8dHJhbnNsYXRlfX1cXFwiXFxuICAgICAgICAgICAgICAgICAgbmctbW9kZWw9XFxcInZtLnNlbGVjdGVkQ291bnRyeVxcXCI+XFxuXFxuICAgICAgICAgICAgICAgICAgPG1kLW9wdGlvbiBuZy12YWx1ZT1cXFwidm0uc2hvd0FsbENvdW50cmllc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8dHJhbnNsYXRlPlNob3cgYWxsIGNvdW50cmllczwvdHJhbnNsYXRlPlxcbiAgICAgICAgICAgICAgICAgIDwvbWQtb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgIDxtZC1vcHRpb24gbmctcmVwZWF0PVxcXCJjb3VudHJ5IGluIHZtLmNvdW50cmllcyB0cmFjayBieSAkaW5kZXhcXFwiIG5nLXZhbHVlPVxcXCJ7e2NvdW50cnl9fVxcXCI+e3tjb3VudHJ5Lm5hbWV9fTwvbWQtb3B0aW9uPlxcblxcbiAgICAgICAgICAgICAgICA8L21kLXNlbGVjdD5cXG4gICAgICAgICAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbiAgICAgICAgICAgIDwvbWQtY2FyZD5cXG5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJleHBvcnRzXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCIgZmxleD1cXFwiZ3Jvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJlbmQgY2VudGVyXFxcIiBuZy1zaG93PVxcXCJ2bS5wcm9qZWN0c0RhdGEgJiYgdm0ucHJvamVjdHNEYXRhLmxlbmd0aCA+IDBcXFwiPlxcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImV4cG9ydHMtbGFiZWxcXFwiPlxcbiAgICAgICAgICAgICAgICA8dHJhbnNsYXRlPkV4cG9ydCBsaXN0OjwvdHJhbnNsYXRlPjwvc3Bhbj5cXG4gICAgICAgICAgICAgIDxtZC1idXR0b24gY2xhc3M9XFxcIm1kLXByaW1hcnkgbWQtcmFpc2VkIG1kLXNtYWxsXFxcIiBuZy1jbGljaz1cXFwidm0uZXhwb3J0UERGKClcXFwiPlxcbiAgICAgICAgICAgICAgICA8bWQtaWNvbj5maWxlX2Rvd25sb2FkPC9tZC1pY29uPlxcbiAgICAgICAgICAgICAgICA8dHJhbnNsYXRlPlBERjwvdHJhbnNsYXRlPlxcbiAgICAgICAgICAgICAgPC9tZC1idXR0b24+XFxuICAgICAgICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5IG1kLXJhaXNlZCBtZC1zbWFsbFxcXCIgbmctY2xpY2s9XFxcInZtLmV4cG9ydENTVigpXFxcIj5cXG4gICAgICAgICAgICAgICAgPG1kLWljb24+ZmlsZV9kb3dubG9hZDwvbWQtaWNvbj5cXG4gICAgICAgICAgICAgICAgPHRyYW5zbGF0ZT5DU1Y8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgIDwvbWQtYnV0dG9uPlxcbiAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInN0YXJyeVxcXCIgbGF5b3V0PVxcXCJyb3dcXFwiIGZsZXg9XFxcIm5vZ3Jvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJlbmQgY2VudGVyXFxcIj5cXG4gICAgICAgICAgICAgIDxzcGFuPjxtZC1pY29uPnZpc2liaWxpdHk8L21kLWljb24+PHRyYW5zbGF0ZT5WaWV3ZXI8L3RyYW5zbGF0ZT48L3NwYW4+XFxuICAgICAgICAgICAgICA8c3Bhbj48bWQtaWNvbj5ncmFkZTwvbWQtaWNvbj48dHJhbnNsYXRlPlRlYW0gbWVtYmVyPC90cmFuc2xhdGU+PC9zcGFuPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgPG1kLWNvbnRlbnQgY2xhc3M9XFxcInByb2plY3Rjb250XFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzY3JvbGwtd3JhcHBlclxcXCI+XFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJoZWFkZXJyb3dcXFwiIGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtcGFkZGluZyBtZC13aGl0ZWZyYW1lPVxcXCIyXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBmbGV4PVxcXCIzMFxcXCIgbmctY2xpY2s9XFxcInZtLm9yZGVyVGFibGUoJ25hbWUnKVxcXCI+XFxuICAgICAgICAgICAgICAgICAgPHRyYW5zbGF0ZT5Qcm9qZWN0IG5hbWU8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgICAgICA8bWQtaWNvbiBuZy1zaG93PVxcXCJ2bS5oZWFkZXIubmFtZS51cFxcXCIgPmV4cGFuZF9tb3JlPC9tZC1pY29uPlxcbiAgICAgICAgICAgICAgICAgIDxtZC1pY29uIG5nLXNob3c9XFxcInZtLmhlYWRlci5uYW1lLmRvd25cXFwiID5leHBhbmRfbGVzczwvbWQtaWNvbj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgZmxleD1cXFwiMjBcXFwiIG5nLWNsaWNrPVxcXCJ2bS5vcmRlclRhYmxlKCdjb3VudHJ5JylcXFwiPlxcbiAgICAgICAgICAgICAgICAgIDx0cmFuc2xhdGU+Q291bnRyeTwvdHJhbnNsYXRlPlxcbiAgICAgICAgICAgICAgICAgIDxtZC1pY29uIG5nLXNob3c9XFxcInZtLmhlYWRlci5jb3VudHJ5LnVwXFxcIiA+ZXhwYW5kX21vcmU8L21kLWljb24+XFxuICAgICAgICAgICAgICAgICAgPG1kLWljb24gbmctc2hvdz1cXFwidm0uaGVhZGVyLmNvdW50cnkuZG93blxcXCIgPmV4cGFuZF9sZXNzPC9tZC1pY29uPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBmbGV4PVxcXCIyMFxcXCIgbmctY2xpY2s9XFxcInZtLm9yZGVyVGFibGUoJ29yZ2FuaXNhdGlvbl9uYW1lJylcXFwiPlxcbiAgICAgICAgICAgICAgICAgIDx0cmFuc2xhdGU+T3JnYW5pc2F0aW9uIG5hbWU8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgICAgICA8bWQtaWNvbiBuZy1zaG93PVxcXCJ2bS5oZWFkZXIub3JnYW5pc2F0aW9uX25hbWUudXBcXFwiID5leHBhbmRfbW9yZTwvbWQtaWNvbj5cXG4gICAgICAgICAgICAgICAgICA8bWQtaWNvbiBuZy1zaG93PVxcXCJ2bS5oZWFkZXIub3JnYW5pc2F0aW9uX25hbWUuZG93blxcXCIgPmV4cGFuZF9sZXNzPC9tZC1pY29uPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBmbGV4PVxcXCIyMFxcXCIgbmctY2xpY2s9XFxcInZtLm9yZGVyVGFibGUoJ2Rvbm9ycycpXFxcIj5cXG4gICAgICAgICAgICAgICAgICA8dHJhbnNsYXRlPkRvbm9yczwvdHJhbnNsYXRlPlxcbiAgICAgICAgICAgICAgICAgIDxtZC1pY29uIG5nLXNob3c9XFxcInZtLmhlYWRlci5kb25vcnMudXBcXFwiID5leHBhbmRfbW9yZTwvbWQtaWNvbj5cXG4gICAgICAgICAgICAgICAgICA8bWQtaWNvbiBuZy1zaG93PVxcXCJ2bS5oZWFkZXIuZG9ub3JzLmRvd25cXFwiID5leHBhbmRfbGVzczwvbWQtaWNvbj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgZmxleD1cXFwiMjBcXFwiIG5nLWNsaWNrPVxcXCJ2bS5vcmRlclRhYmxlKCdjb250YWN0X25hbWUnKVxcXCI+XFxuICAgICAgICAgICAgICAgICAgPHRyYW5zbGF0ZT5Db250YWN0IE5hbWU8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgICAgICA8bWQtaWNvbiBuZy1zaG93PVxcXCJ2bS5oZWFkZXIuY29udGFjdF9uYW1lLnVwXFxcIiA+ZXhwYW5kX21vcmU8L21kLWljb24+XFxuICAgICAgICAgICAgICAgICAgPG1kLWljb24gbmctc2hvdz1cXFwidm0uaGVhZGVyLmNvbnRhY3RfbmFtZS5kb3duXFxcIiA+ZXhwYW5kX2xlc3M8L21kLWljb24+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGZsZXg9XFxcIjMwXFxcIiBuZy1jbGljaz1cXFwidm0ub3JkZXJUYWJsZSgnaW1wbGVtZW50YXRpb25fb3ZlcnZpZXcnKVxcXCI+XFxuICAgICAgICAgICAgICAgICAgPHRyYW5zbGF0ZT5PdmVydmlldyBvZiBkaWdpdGFsIGhlYWx0aCBpbXBsZW1lbnRhdGlvbjwvdHJhbnNsYXRlPlxcbiAgICAgICAgICAgICAgICAgIDxtZC1pY29uIG5nLXNob3c9XFxcInZtLmhlYWRlci5pbXBsZW1lbnRhdGlvbl9vdmVydmlldy51cFxcXCIgPmV4cGFuZF9tb3JlPC9tZC1pY29uPlxcbiAgICAgICAgICAgICAgICAgIDxtZC1pY29uIG5nLXNob3c9XFxcInZtLmhlYWRlci5pbXBsZW1lbnRhdGlvbl9vdmVydmlldy5kb3duXFxcIiA+ZXhwYW5kX2xlc3M8L21kLWljb24+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGZsZXg9XFxcIjIwXFxcIiBuZy1jbGljaz1cXFwidm0ub3JkZXJUYWJsZSgnaW1wbGVtZW50aW5nX3BhcnRuZXJzJylcXFwiPlxcbiAgICAgICAgICAgICAgICAgIDx0cmFuc2xhdGU+SW1wbGVtZW50aW5nIHBhcnRuZXJzPC90cmFuc2xhdGU+XFxuICAgICAgICAgICAgICAgICAgPG1kLWljb24gbmctc2hvdz1cXFwidm0uaGVhZGVyLmltcGxlbWVudGluZ19wYXJ0bmVycy51cFxcXCIgPmV4cGFuZF9tb3JlPC9tZC1pY29uPlxcbiAgICAgICAgICAgICAgICAgIDxtZC1pY29uIG5nLXNob3c9XFxcInZtLmhlYWRlci5pbXBsZW1lbnRpbmdfcGFydG5lcnMuZG93blxcXCIgPmV4cGFuZF9sZXNzPC9tZC1pY29uPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBmbGV4PVxcXCIyMFxcXCIgbmctY2xpY2s9XFxcInZtLm9yZGVyVGFibGUoJ2dlb2dyYXBoaWNfc2NvcGUnKVxcXCI+XFxuICAgICAgICAgICAgICAgICAgPHRyYW5zbGF0ZT5HZW9ncmFwaGljIHNjb3BlPC90cmFuc2xhdGU+XFxuICAgICAgICAgICAgICAgICAgPG1kLWljb24gbmctc2hvdz1cXFwidm0uaGVhZGVyLmdlb2dyYXBoaWNfc2NvcGUudXBcXFwiID5leHBhbmRfbW9yZTwvbWQtaWNvbj5cXG4gICAgICAgICAgICAgICAgICA8bWQtaWNvbiBuZy1zaG93PVxcXCJ2bS5oZWFkZXIuZ2VvZ3JhcGhpY19zY29wZS5kb3duXFxcIiA+ZXhwYW5kX2xlc3M8L21kLWljb24+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGZsZXg9XFxcIjIwXFxcIiBuZy1jbGljaz1cXFwidm0ub3JkZXJUYWJsZSgnaGVhbHRoX2ZvY3VzX2FyZWFzJylcXFwiPlxcbiAgICAgICAgICAgICAgICAgIDx0cmFuc2xhdGU+SGVhbHRoIEZvY3VzIEFyZWFzPC90cmFuc2xhdGU+XFxuICAgICAgICAgICAgICAgICAgPG1kLWljb24gbmctc2hvdz1cXFwidm0uaGVhZGVyLmhlYWx0aF9mb2N1c19hcmVhcy51cFxcXCIgPmV4cGFuZF9tb3JlPC9tZC1pY29uPlxcbiAgICAgICAgICAgICAgICAgIDxtZC1pY29uIG5nLXNob3c9XFxcInZtLmhlYWRlci5oZWFsdGhfZm9jdXNfYXJlYXMuZG93blxcXCIgPmV4cGFuZF9sZXNzPC9tZC1pY29uPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgICAgPGRpdlxcbiAgICAgICAgICAgICAgICBjbGFzcz1cXFwicHJvamVjdHJvd1xcXCJcXG4gICAgICAgICAgICAgICAgbGF5b3V0PVxcXCJyb3dcXFwiXFxuICAgICAgICAgICAgICAgIGxheW91dC1wYWRkaW5nXFxuICAgICAgICAgICAgICAgIG5nLXJlcGVhdD1cXFwicHJvamVjdCBpbiB2bS5wcm9qZWN0c0RhdGEgdHJhY2sgYnkgJGluZGV4XFxcIlxcbiAgICAgICAgICAgICAgICBuZy1jbGFzcz1cXFwieydtZW1iZXInOiBwcm9qZWN0LmlzTWVtYmVyLCAndmlld2VyJzogcHJvamVjdC5pc1ZpZXdlcn1cXFwiPlxcblxcbiAgICAgICAgICAgICAgICA8ZGl2IGZsZXg9XFxcIjMwXFxcIiBjbGFzcz1cXFwicHJvamVjdGxpbmtcXFwiIGxheW91dD1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICAgICAgICA8ZGl2IGxheW91dD1cXFwicm93XFxcIiBmbGV4IGNsYXNzPVxcXCJuYW1lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XFxuICAgICAgICAgICAgICAgICAgICAgIDxtZC1pY29uIGNsYXNzPVxcXCJtZW1iZXJcXFwiIG5nLXNob3c9XFxcInByb2plY3QuaXNNZW1iZXJcXFwiPmdyYWRlPC9tZC1pY29uPlxcbiAgICAgICAgICAgICAgICAgICAgICA8bWQtaWNvbiBjbGFzcz1cXFwidmlld2VyXFxcIiBuZy1zaG93PVxcXCJwcm9qZWN0LmlzVmlld2VyXFxcIj52aXNpYmlsaXR5PC9tZC1pY29uPlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJuYW1lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICB7e3Byb2plY3QubmFtZX19XFxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb3VudHJ5LWFwcHJvdmVkXFxcIiBuZy1zaG93PVxcXCJwcm9qZWN0LmFwcHJvdmVkXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnNcXFwiPmFzc2lnbm1lbnRfdHVybmVkX2luPC9pPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cmFuc2xhdGU+VmVyaWZpZWQgYnkgY291bnRyeTwvdHJhbnNsYXRlPlxcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlua3NcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxtZC1idXR0b24gIHVpLXNyZWY9XFxcImVkaXRQcm9qZWN0KHsgYXBwTmFtZTogcHJvamVjdC5pZCwgZWRpdE1vZGU6ICdwdWJsaXNoJyB9KVxcXCIgY2xhc3M9XFxcIm1kLXByaW1hcnkgbWQtcmFpc2VkIG1kLXNtYWxsXFxcIj48dHJhbnNsYXRlPlByb2plY3QgRGV0YWlsczwvdHJhbnNsYXRlPjwvbWQtYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBmbGV4PVxcXCIyMFxcXCIgY2xhc3M9XFxcImNhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAge3t2bS5jb3VudHJpZXNMaWJbcHJvamVjdC5jb3VudHJ5XX19XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGZsZXg9XFxcIjIwXFxcIj57e3Byb2plY3Qub3JnYW5pc2F0aW9uX25hbWV9fTwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGZsZXg9XFxcIjIwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBuZy1yZXBlYXQ9XFxcImRvbm9yIGluIHByb2plY3QuZG9ub3JzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3tkb25vcn19e3skbGFzdCA/ICcnIDogJywgJ319XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBmbGV4PVxcXCIyMFxcXCI+e3twcm9qZWN0LmNvbnRhY3RfbmFtZX19LCA8YSBuZy1ocmVmPVxcXCJtYWlsdG86e3twcm9qZWN0LmNvbnRhY3RfZW1haWx9fVxcXCI+e3twcm9qZWN0LmNvbnRhY3RfZW1haWx9fTwvYT48L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBmbGV4PVxcXCIzMFxcXCI+e3twcm9qZWN0LmltcGxlbWVudGF0aW9uX292ZXJ2aWV3fX08L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBmbGV4PVxcXCIyMFxcXCI+e3t2bS5wcmludEltcGxlbWVudGluZ1BhcnRuZXJzKHByb2plY3QpfX08L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBmbGV4PVxcXCIyMFxcXCI+e3twcm9qZWN0Lmdlb2dyYXBoaWNfc2NvcGV9fTwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGZsZXg9XFxcIjIwXFxcIj57e3Byb2plY3QuaGVhbHRoX2ZvY3VzX2FyZWFzLmpvaW4oJywgJyl9fTwvZGl2PlxcblxcbiAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICA8ZGl2IG5nLWlmPVxcXCIhdm0ucHJvamVjdHNEYXRhLmxlbmd0aFxcXCIgY2xhc3M9XFxcInByb2plY3Ryb3dcXFwiIGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtcGFkZGluZz5cXG4gICAgICAgICAgICAgICAgPGRpdiBmbGV4Pjx0cmFuc2xhdGU+VGhlcmUgaXMgbm8gcHJvamVjdCB0byBzaG93IGluIHRoaXMgY291bnRyeS48L3RyYW5zbGF0ZT48L2Rpdj5cXG4gICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8L21kLWNvbnRlbnQ+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L21kLXRhYj5cXG4gICAgPC9tZC10YWJzPlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJkYXNoYm9hcmQtZmlsdGVyLWNvbnRhaW5lclxcXCIgZmxleCBsYXlvdXQ9XFxcInJvd1xcXCI+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwiZmlsdGVyLXdyYXBwZXJcXFwiIGxheW91dD1cXFwicm93XFxcIiBmbGV4PVxcXCIxMDBcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZmlsdGVyLXByb2plY3QtY291bnRlclxcXCIgbWQtd2hpdGVmcmFtZT1cXFwiMlxcXCI+XFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInByb2plY3QtY291bnRlci1uYW1lXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXNjcmlwdGlvblxcXCI+XFxuICAgICAgICAgICAgICA8dHJhbnNsYXRlPk51bWJlciBvZiBQcm9qZWN0czwvdHJhbnNsYXRlPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvdW50cnktbmFtZVxcXCI+XFxuICAgICAgICAgICAgICA8IS0tIGluIHt7dm0uc2VsZWN0ZWRDb3VudHJ5Lm5hbWV9fSAtLT5cXG4gICAgICAgICAgICAgIDx0cmFuc2xhdGU+aW4gc2VsZWN0ZWQgY291bnRyeTwvdHJhbnNsYXRlPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgPGRpdiBjbGFzcz1cXFwicHJvamVjdC1jb3VudGVyLWFycm93XFxcIj5cXG4gICAgICAgICAgICA8aW1nIHNyYz1cXFwiXCIgKyByZXF1aXJlKFwiLi9pbWcvYWZ0ZXItd2hpdGUuc3ZnXCIpICsgXCJcXFwiIC8+XFxuICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwcm9qZWN0LWNvdW50ZXItbnVtYmVyXFxcIj5cXG4gICAgICAgICAgICB7eyB2bS5wcm9qZWN0c0RhdGEubGVuZ3RofX1cXG4gICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImZpbHRlci1saXN0XFxcIj5cXG5cXG4gICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGVzY3JpcHRpb25cXFwiPjx0cmFuc2xhdGU+QXBwbHkgZmlsdGVycyB0byBtYXA6PC90cmFuc2xhdGU+PC9kaXY+XFxuXFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvdW50cnktYXBwcm92YWwtc3dpdGNoXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJzdGFydCBjZW50ZXJcXFwiIG5nLXNob3c9XFxcInZtLnNlbGVjdGVkQ291bnRyeS5wcm9qZWN0X2FwcHJvdmFsXFxcIj5cXG4gICAgICAgICAgICA8bWQtc3dpdGNoIGNsYXNzPVxcXCJtZC1wcmltYXJ5XFxcIiBuZy1tb2RlbD1cXFwidm0uc2hvd09ubHlBcHByb3ZlZFxcXCIgYXJpYS1sYWJlbD1cXFwic2hvdyBvbmx5IHZlcmlmaWVkXFxcIj48L21kLXN3aXRjaD5cXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwibWQtbGFiZWxcXFwiPlxcbiAgICAgICAgICAgICAgPHRyYW5zbGF0ZT5TaG93IG9ubHkgdmVyaWZpZWQgcHJvamVjdHM8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgICA8L3NwYW4+XFxuICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LWhlYWRlcnNcXFwiIG5nLXJlcGVhdD1cXFwiaGVhZGVyIGluIHZtLmZpbHRlcnNcXFwiPlxcblxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImhlYWRlclxcXCIgbmctY2xpY2s9XFxcImhlYWRlci5vcGVuID0gIWhlYWRlci5vcGVuXFxcIj5cXG4gICAgICAgICAgICAgIDxtZC1pY29uIG5nLWhpZGU9XFxcImhlYWRlci5vcGVuXFxcIiA+ZXhwYW5kX21vcmU8L21kLWljb24+XFxuICAgICAgICAgICAgICA8bWQtaWNvbiBuZy1zaG93PVxcXCJoZWFkZXIub3BlblxcXCIgPmV4cGFuZF9sZXNzPC9tZC1pY29uPlxcbiAgICAgICAgICAgICAge3toZWFkZXIubmFtZX19ICh7e2hlYWRlci5pdGVtcy5sZW5ndGh9fSlcXG4gICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LWl0ZW1cXFwiIG5nLXJlcGVhdD1cXFwiaXRlbSBpbiBoZWFkZXIuaXRlbXMgIHwgb3JkZXJCeTogJ25hbWUnIFxcXCIgbmctc2hvdz1cXFwiaGVhZGVyLm9wZW5cXFwiPlxcbiAgICAgICAgICAgICAgPG1kLWNoZWNrYm94IGNsYXNzPVxcXCJtZC1wcmltYXJ5IHNtYWxsXFxcIiBuZy1tb2RlbD1cXFwiaXRlbS52YWx1ZVxcXCIgYXJpYS1sYWJlbD1cXFwiaXRlbS5uYW1lXFxcIj5cXG4gICAgICAgICAgICAgICAge3tpdGVtLm5hbWV9fVxcbiAgICAgICAgICAgICAgPC9tZC1jaGVja2JveD5cXG4gICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICA8L21kLWNhcmQ+XFxuXFxuICA8ZGlzY2xhaW1lcj48L2Rpc2NsYWltZXI+XFxuPC9kaXY+XFxuXCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/Dashboard/Dashboard.html\n");

/***/ }),

/***/ "./src/Dashboard/img/after-white.svg":
/*!*******************************************!*\
  !*** ./src/Dashboard/img/after-white.svg ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"public/fonts/after-white.svg\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvRGFzaGJvYXJkL2ltZy9hZnRlci13aGl0ZS5zdmcuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvRGFzaGJvYXJkL2ltZy9hZnRlci13aGl0ZS5zdmc/ODYxNCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJwdWJsaWMvZm9udHMvYWZ0ZXItd2hpdGUuc3ZnXCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/Dashboard/img/after-white.svg\n");

/***/ })

}]);