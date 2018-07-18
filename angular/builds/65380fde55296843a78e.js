(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[273],{

/***/ "./src/Common/TopBar/topBar.html":
/*!***************************************!*\
  !*** ./src/Common/TopBar/topBar.html ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<md-toolbar class=\\\"main-toolbar toolbar-global\\\">\\n  <div class=\\\"md-toolbar-tools\\\">\\n\\n    <div>\\n      <md-button\\n        ui-sref=\\\"landing\\\"\\n        aria-label=\\\"Digital Health Atlas\\\"\\n        class=\\\"app-title\\\"\\n        md-no-ink\\n        flex=\\\"noshrink\\\">\\n        <span class=\\\"logo\\\">\\n          <translate>Digital Health Atlas</translate>\\n        </span>\\n      </md-button>\\n    </div>\\n\\n    <div>\\n      <md-button aria-label=\\\"Dashboard\\\"\\n                 title=\\\"Dashboard\\\"\\n                 class=\\\"view-selector\\\"\\n                 ui-sref=\\\"dashboard\\\"\\n                 ng-show=\\\"vm.profileValid\\\"\\n                 md-no-ink>\\n        <md-icon class=\\\"material-icons\\\">apps</md-icon>\\n        <translate>Dashboard</translate>\\n      </md-button>\\n    </div>\\n\\n    <div>\\n      <md-button aria-label=\\\"My Projects\\\"\\n                 title=\\\"My Projects\\\"\\n                 class=\\\"view-selector\\\"\\n                 ui-sref=\\\"my-projects\\\"\\n                 ng-show=\\\"vm.profileValid\\\"\\n                 md-no-ink>\\n        <md-icon class=\\\"material-icons \\\">toc</md-icon>\\n        <translate>My Projects</translate>\\n      </md-button>\\n    </div>\\n\\n    <div>\\n      <md-button aria-label=\\\"Planning and Guidance\\\"\\n                 title=\\\"Planning and Guidance\\\"\\n                 class=\\\"view-selector\\\"\\n                 ui-sref=\\\"cms\\\"\\n                 ng-show=\\\"vm.profileValid\\\"\\n                 md-no-ink>\\n        <md-icon class=\\\"material-icons \\\">import_contacts</md-icon>\\n        <translate>Planning &amp; Guidance</translate>\\n      </md-button>\\n    </div>\\n\\n    <thematic\\n      axis=\\\"vm.axis\\\"\\n      domain=\\\"vm.domain\\\"\\n      ng-show=\\\"vm.profileValid\\\"\\n      buttontitle=\\\"{{'MAPS Toolkit' | translate}}\\\"\\n      buttonclass=\\\"md-primary\\\"\\n      buttonicon=\\\"help_outline\\\"\\n      buttontext=\\\"{{'Toolkit' | translate}}\\\">\\n    </thematic>\\n\\n    <div flex></div>\\n\\n    <div class=\\\"language-badge\\\" ng-show=\\\"vm.userLanguage\\\">\\n      <div class=\\\"country-flag\\\" style=\\\"{{'background-image: url(' + vm.userLanguage.flag +')'}}\\\">\\n      </div>\\n    </div>\\n\\n    <div>\\n      <searchbar compact-mode=\\\"true\\\" ng-if=\\\"vm.profileValid\\\"></searchbar>\\n    </div>\\n\\n    <div>\\n      <md-button class=\\\"landing-link\\\"\\n                 ui-sref-active=\\\"active\\\"\\n                 ui-sref=\\\"login\\\"\\n                 aria-label=\\\"Login\\\"\\n                 ng-show=\\\"vm.currentState !== 'login' && !vm.token\\\"\\n                 md-no-ink>\\n        <translate>Login</translate>\\n      </md-button>\\n    </div>\\n\\n    <div>\\n      <md-button class=\\\"landing-link\\\"\\n                 ui-sref-active=\\\"active\\\"\\n                 ui-sref=\\\"signup\\\"\\n                 aria-label=\\\"Singup\\\"\\n                 ng-show=\\\"vm.currentState !== 'signup' && !vm.token\\\"\\n                 md-no-ink >\\n        <translate>Sign Up</translate>\\n      </md-button>\\n    </div>\\n\\n    <md-menu md-position-mode=\\\"target-right target\\\" ng-if=\\\"vm.token\\\">\\n      <md-button class=\\\"md-icon-button\\\" aria-label=\\\"User\\\" ng-click=\\\"vm.openMenu($mdOpenMenu, $event)\\\" md-no-ink>\\n        <md-icon md-menu-origin class=\\\"material-icons \\\">person</md-icon>\\n      </md-button>\\n\\n      <md-menu-content class=\\\"user-menu\\\" width=\\\"4\\\">\\n        <md-menu-item>\\n          <div class=\\\"user-name\\\">\\n            <md-icon class=\\\"material-icons\\\" md-menu-align-target>account_circle</md-icon>\\n            <span ng-hide =\\\"vm.profile.name\\\">{{vm.profile.email}}</span>\\n            <span ng-show =\\\"vm.profile.name\\\">{{vm.profile.name}}</span>\\n          </div>\\n        </md-menu-item>\\n        <md-menu-item>\\n          <div class=\\\"user-role\\\">\\n            <md-icon class=\\\"material-icons\\\" md-menu-align-target>verified_user</md-icon>\\n            <span>\\n              <translate>Role: {{vm.writeUserRole()}}</translate>\\n            </span>\\n          </div>\\n        </md-menu-item>\\n        <md-menu-divider></md-menu-divider>\\n        <md-menu-item>\\n          <md-button ui-sref=\\\"editProfile\\\">\\n            <md-icon class=\\\"material-icons\\\"><i class=\\\"material-icons\\\">settings</i></md-icon>\\n            <translate>Edit my Profile</translate>\\n          </md-button>\\n        </md-menu-item>\\n        <md-menu-item>\\n          <md-button ng-click=\\\"vm.logout()\\\">\\n            <md-icon class=\\\"material-icons\\\">exit_to_app</md-icon>\\n            <translate>Logout</translate>\\n          </md-button>\\n        </md-menu-item>\\n        <md-menu-divider></md-menu-divider>\\n        <div ng-show=\\\"vm.profile.country\\\">\\n        <span class=\\\"label\\\">\\n          <translate>Country</translate>\\n        </span>\\n          <md-menu-item>\\n            <div class=\\\"user-lang\\\" layout=\\\"row\\\" layout-align=\\\"start center\\\">\\n            <span class=\\\"country-flag\\\">\\n                <img ng-src=\\\"{{vm.profile.country.flag}}\\\" alt=\\\"{{vm.profile.country.prettyName}}\\\">\\n            </span>\\n              <span class=\\\"country-label\\\">\\n              {{vm.profile.country.prettyName}}\\n            </span>\\n            </div>\\n          </md-menu-item>\\n        </div>\\n        <span class=\\\"label\\\">\\n          <translate>Site Language</translate>\\n        </span>\\n        <md-menu-item>\\n          <div class=\\\"user-lang\\\" layout=\\\"row\\\" layout-align=\\\"start center\\\">\\n            <span class=\\\"country-flag\\\">\\n                <img ng-src=\\\"{{vm.userLanguage.flag}}\\\" alt=\\\"{{vm.userLanguage.name}}\\\">\\n            </span>\\n            <span class=\\\"country-label\\\">\\n              {{vm.userLanguage.name}}\\n            </span>\\n          </div>\\n        </md-menu-item>\\n      </md-menu-content>\\n    </md-menu>\\n\\n    <div>\\n      <md-button class=\\\"add-new-project\\\" ui-sref=\\\"newProject\\\"\\n                 aria-label=\\\"Add new project\\\"\\n                 ng-show=\\\"vm.profileValid\\\"\\n                 md-no-ink>\\n        <md-icon class=\\\"material-icons\\\">add</md-icon>\\n        <translate>New Project</translate>\\n      </md-button>\\n    </div>\\n\\n  </div>\\n</md-toolbar>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1RvcEJhci90b3BCYXIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Db21tb24vVG9wQmFyL3RvcEJhci5odG1sPzMzMjQiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxtZC10b29sYmFyIGNsYXNzPVxcXCJtYWluLXRvb2xiYXIgdG9vbGJhci1nbG9iYWxcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwibWQtdG9vbGJhci10b29sc1xcXCI+XFxuXFxuICAgIDxkaXY+XFxuICAgICAgPG1kLWJ1dHRvblxcbiAgICAgICAgdWktc3JlZj1cXFwibGFuZGluZ1xcXCJcXG4gICAgICAgIGFyaWEtbGFiZWw9XFxcIkRpZ2l0YWwgSGVhbHRoIEF0bGFzXFxcIlxcbiAgICAgICAgY2xhc3M9XFxcImFwcC10aXRsZVxcXCJcXG4gICAgICAgIG1kLW5vLWlua1xcbiAgICAgICAgZmxleD1cXFwibm9zaHJpbmtcXFwiPlxcbiAgICAgICAgPHNwYW4gY2xhc3M9XFxcImxvZ29cXFwiPlxcbiAgICAgICAgICA8dHJhbnNsYXRlPkRpZ2l0YWwgSGVhbHRoIEF0bGFzPC90cmFuc2xhdGU+XFxuICAgICAgICA8L3NwYW4+XFxuICAgICAgPC9tZC1idXR0b24+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2PlxcbiAgICAgIDxtZC1idXR0b24gYXJpYS1sYWJlbD1cXFwiRGFzaGJvYXJkXFxcIlxcbiAgICAgICAgICAgICAgICAgdGl0bGU9XFxcIkRhc2hib2FyZFxcXCJcXG4gICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJ2aWV3LXNlbGVjdG9yXFxcIlxcbiAgICAgICAgICAgICAgICAgdWktc3JlZj1cXFwiZGFzaGJvYXJkXFxcIlxcbiAgICAgICAgICAgICAgICAgbmctc2hvdz1cXFwidm0ucHJvZmlsZVZhbGlkXFxcIlxcbiAgICAgICAgICAgICAgICAgbWQtbm8taW5rPlxcbiAgICAgICAgPG1kLWljb24gY2xhc3M9XFxcIm1hdGVyaWFsLWljb25zXFxcIj5hcHBzPC9tZC1pY29uPlxcbiAgICAgICAgPHRyYW5zbGF0ZT5EYXNoYm9hcmQ8L3RyYW5zbGF0ZT5cXG4gICAgICA8L21kLWJ1dHRvbj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXY+XFxuICAgICAgPG1kLWJ1dHRvbiBhcmlhLWxhYmVsPVxcXCJNeSBQcm9qZWN0c1xcXCJcXG4gICAgICAgICAgICAgICAgIHRpdGxlPVxcXCJNeSBQcm9qZWN0c1xcXCJcXG4gICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJ2aWV3LXNlbGVjdG9yXFxcIlxcbiAgICAgICAgICAgICAgICAgdWktc3JlZj1cXFwibXktcHJvamVjdHNcXFwiXFxuICAgICAgICAgICAgICAgICBuZy1zaG93PVxcXCJ2bS5wcm9maWxlVmFsaWRcXFwiXFxuICAgICAgICAgICAgICAgICBtZC1uby1pbms+XFxuICAgICAgICA8bWQtaWNvbiBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnMgXFxcIj50b2M8L21kLWljb24+XFxuICAgICAgICA8dHJhbnNsYXRlPk15IFByb2plY3RzPC90cmFuc2xhdGU+XFxuICAgICAgPC9tZC1idXR0b24+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2PlxcbiAgICAgIDxtZC1idXR0b24gYXJpYS1sYWJlbD1cXFwiUGxhbm5pbmcgYW5kIEd1aWRhbmNlXFxcIlxcbiAgICAgICAgICAgICAgICAgdGl0bGU9XFxcIlBsYW5uaW5nIGFuZCBHdWlkYW5jZVxcXCJcXG4gICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJ2aWV3LXNlbGVjdG9yXFxcIlxcbiAgICAgICAgICAgICAgICAgdWktc3JlZj1cXFwiY21zXFxcIlxcbiAgICAgICAgICAgICAgICAgbmctc2hvdz1cXFwidm0ucHJvZmlsZVZhbGlkXFxcIlxcbiAgICAgICAgICAgICAgICAgbWQtbm8taW5rPlxcbiAgICAgICAgPG1kLWljb24gY2xhc3M9XFxcIm1hdGVyaWFsLWljb25zIFxcXCI+aW1wb3J0X2NvbnRhY3RzPC9tZC1pY29uPlxcbiAgICAgICAgPHRyYW5zbGF0ZT5QbGFubmluZyAmYW1wOyBHdWlkYW5jZTwvdHJhbnNsYXRlPlxcbiAgICAgIDwvbWQtYnV0dG9uPlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPHRoZW1hdGljXFxuICAgICAgYXhpcz1cXFwidm0uYXhpc1xcXCJcXG4gICAgICBkb21haW49XFxcInZtLmRvbWFpblxcXCJcXG4gICAgICBuZy1zaG93PVxcXCJ2bS5wcm9maWxlVmFsaWRcXFwiXFxuICAgICAgYnV0dG9udGl0bGU9XFxcInt7J01BUFMgVG9vbGtpdCcgfCB0cmFuc2xhdGV9fVxcXCJcXG4gICAgICBidXR0b25jbGFzcz1cXFwibWQtcHJpbWFyeVxcXCJcXG4gICAgICBidXR0b25pY29uPVxcXCJoZWxwX291dGxpbmVcXFwiXFxuICAgICAgYnV0dG9udGV4dD1cXFwie3snVG9vbGtpdCcgfCB0cmFuc2xhdGV9fVxcXCI+XFxuICAgIDwvdGhlbWF0aWM+XFxuXFxuICAgIDxkaXYgZmxleD48L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwibGFuZ3VhZ2UtYmFkZ2VcXFwiIG5nLXNob3c9XFxcInZtLnVzZXJMYW5ndWFnZVxcXCI+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwiY291bnRyeS1mbGFnXFxcIiBzdHlsZT1cXFwie3snYmFja2dyb3VuZC1pbWFnZTogdXJsKCcgKyB2bS51c2VyTGFuZ3VhZ2UuZmxhZyArJyknfX1cXFwiPlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdj5cXG4gICAgICA8c2VhcmNoYmFyIGNvbXBhY3QtbW9kZT1cXFwidHJ1ZVxcXCIgbmctaWY9XFxcInZtLnByb2ZpbGVWYWxpZFxcXCI+PC9zZWFyY2hiYXI+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2PlxcbiAgICAgIDxtZC1idXR0b24gY2xhc3M9XFxcImxhbmRpbmctbGlua1xcXCJcXG4gICAgICAgICAgICAgICAgIHVpLXNyZWYtYWN0aXZlPVxcXCJhY3RpdmVcXFwiXFxuICAgICAgICAgICAgICAgICB1aS1zcmVmPVxcXCJsb2dpblxcXCJcXG4gICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XFxcIkxvZ2luXFxcIlxcbiAgICAgICAgICAgICAgICAgbmctc2hvdz1cXFwidm0uY3VycmVudFN0YXRlICE9PSAnbG9naW4nICYmICF2bS50b2tlblxcXCJcXG4gICAgICAgICAgICAgICAgIG1kLW5vLWluaz5cXG4gICAgICAgIDx0cmFuc2xhdGU+TG9naW48L3RyYW5zbGF0ZT5cXG4gICAgICA8L21kLWJ1dHRvbj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXY+XFxuICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibGFuZGluZy1saW5rXFxcIlxcbiAgICAgICAgICAgICAgICAgdWktc3JlZi1hY3RpdmU9XFxcImFjdGl2ZVxcXCJcXG4gICAgICAgICAgICAgICAgIHVpLXNyZWY9XFxcInNpZ251cFxcXCJcXG4gICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XFxcIlNpbmd1cFxcXCJcXG4gICAgICAgICAgICAgICAgIG5nLXNob3c9XFxcInZtLmN1cnJlbnRTdGF0ZSAhPT0gJ3NpZ251cCcgJiYgIXZtLnRva2VuXFxcIlxcbiAgICAgICAgICAgICAgICAgbWQtbm8taW5rID5cXG4gICAgICAgIDx0cmFuc2xhdGU+U2lnbiBVcDwvdHJhbnNsYXRlPlxcbiAgICAgIDwvbWQtYnV0dG9uPlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPG1kLW1lbnUgbWQtcG9zaXRpb24tbW9kZT1cXFwidGFyZ2V0LXJpZ2h0IHRhcmdldFxcXCIgbmctaWY9XFxcInZtLnRva2VuXFxcIj5cXG4gICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1pY29uLWJ1dHRvblxcXCIgYXJpYS1sYWJlbD1cXFwiVXNlclxcXCIgbmctY2xpY2s9XFxcInZtLm9wZW5NZW51KCRtZE9wZW5NZW51LCAkZXZlbnQpXFxcIiBtZC1uby1pbms+XFxuICAgICAgICA8bWQtaWNvbiBtZC1tZW51LW9yaWdpbiBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnMgXFxcIj5wZXJzb248L21kLWljb24+XFxuICAgICAgPC9tZC1idXR0b24+XFxuXFxuICAgICAgPG1kLW1lbnUtY29udGVudCBjbGFzcz1cXFwidXNlci1tZW51XFxcIiB3aWR0aD1cXFwiNFxcXCI+XFxuICAgICAgICA8bWQtbWVudS1pdGVtPlxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ1c2VyLW5hbWVcXFwiPlxcbiAgICAgICAgICAgIDxtZC1pY29uIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCIgbWQtbWVudS1hbGlnbi10YXJnZXQ+YWNjb3VudF9jaXJjbGU8L21kLWljb24+XFxuICAgICAgICAgICAgPHNwYW4gbmctaGlkZSA9XFxcInZtLnByb2ZpbGUubmFtZVxcXCI+e3t2bS5wcm9maWxlLmVtYWlsfX08L3NwYW4+XFxuICAgICAgICAgICAgPHNwYW4gbmctc2hvdyA9XFxcInZtLnByb2ZpbGUubmFtZVxcXCI+e3t2bS5wcm9maWxlLm5hbWV9fTwvc3Bhbj5cXG4gICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L21kLW1lbnUtaXRlbT5cXG4gICAgICAgIDxtZC1tZW51LWl0ZW0+XFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInVzZXItcm9sZVxcXCI+XFxuICAgICAgICAgICAgPG1kLWljb24gY2xhc3M9XFxcIm1hdGVyaWFsLWljb25zXFxcIiBtZC1tZW51LWFsaWduLXRhcmdldD52ZXJpZmllZF91c2VyPC9tZC1pY29uPlxcbiAgICAgICAgICAgIDxzcGFuPlxcbiAgICAgICAgICAgICAgPHRyYW5zbGF0ZT5Sb2xlOiB7e3ZtLndyaXRlVXNlclJvbGUoKX19PC90cmFuc2xhdGU+XFxuICAgICAgICAgICAgPC9zcGFuPlxcbiAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvbWQtbWVudS1pdGVtPlxcbiAgICAgICAgPG1kLW1lbnUtZGl2aWRlcj48L21kLW1lbnUtZGl2aWRlcj5cXG4gICAgICAgIDxtZC1tZW51LWl0ZW0+XFxuICAgICAgICAgIDxtZC1idXR0b24gdWktc3JlZj1cXFwiZWRpdFByb2ZpbGVcXFwiPlxcbiAgICAgICAgICAgIDxtZC1pY29uIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+PGkgY2xhc3M9XFxcIm1hdGVyaWFsLWljb25zXFxcIj5zZXR0aW5nczwvaT48L21kLWljb24+XFxuICAgICAgICAgICAgPHRyYW5zbGF0ZT5FZGl0IG15IFByb2ZpbGU8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgPC9tZC1idXR0b24+XFxuICAgICAgICA8L21kLW1lbnUtaXRlbT5cXG4gICAgICAgIDxtZC1tZW51LWl0ZW0+XFxuICAgICAgICAgIDxtZC1idXR0b24gbmctY2xpY2s9XFxcInZtLmxvZ291dCgpXFxcIj5cXG4gICAgICAgICAgICA8bWQtaWNvbiBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnNcXFwiPmV4aXRfdG9fYXBwPC9tZC1pY29uPlxcbiAgICAgICAgICAgIDx0cmFuc2xhdGU+TG9nb3V0PC90cmFuc2xhdGU+XFxuICAgICAgICAgIDwvbWQtYnV0dG9uPlxcbiAgICAgICAgPC9tZC1tZW51LWl0ZW0+XFxuICAgICAgICA8bWQtbWVudS1kaXZpZGVyPjwvbWQtbWVudS1kaXZpZGVyPlxcbiAgICAgICAgPGRpdiBuZy1zaG93PVxcXCJ2bS5wcm9maWxlLmNvdW50cnlcXFwiPlxcbiAgICAgICAgPHNwYW4gY2xhc3M9XFxcImxhYmVsXFxcIj5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5Db3VudHJ5PC90cmFuc2xhdGU+XFxuICAgICAgICA8L3NwYW4+XFxuICAgICAgICAgIDxtZC1tZW51LWl0ZW0+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidXNlci1sYW5nXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJzdGFydCBjZW50ZXJcXFwiPlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJjb3VudHJ5LWZsYWdcXFwiPlxcbiAgICAgICAgICAgICAgICA8aW1nIG5nLXNyYz1cXFwie3t2bS5wcm9maWxlLmNvdW50cnkuZmxhZ319XFxcIiBhbHQ9XFxcInt7dm0ucHJvZmlsZS5jb3VudHJ5LnByZXR0eU5hbWV9fVxcXCI+XFxuICAgICAgICAgICAgPC9zcGFuPlxcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImNvdW50cnktbGFiZWxcXFwiPlxcbiAgICAgICAgICAgICAge3t2bS5wcm9maWxlLmNvdW50cnkucHJldHR5TmFtZX19XFxuICAgICAgICAgICAgPC9zcGFuPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8L21kLW1lbnUtaXRlbT5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPHNwYW4gY2xhc3M9XFxcImxhYmVsXFxcIj5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5TaXRlIExhbmd1YWdlPC90cmFuc2xhdGU+XFxuICAgICAgICA8L3NwYW4+XFxuICAgICAgICA8bWQtbWVudS1pdGVtPlxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ1c2VyLWxhbmdcXFwiIGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtYWxpZ249XFxcInN0YXJ0IGNlbnRlclxcXCI+XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImNvdW50cnktZmxhZ1xcXCI+XFxuICAgICAgICAgICAgICAgIDxpbWcgbmctc3JjPVxcXCJ7e3ZtLnVzZXJMYW5ndWFnZS5mbGFnfX1cXFwiIGFsdD1cXFwie3t2bS51c2VyTGFuZ3VhZ2UubmFtZX19XFxcIj5cXG4gICAgICAgICAgICA8L3NwYW4+XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImNvdW50cnktbGFiZWxcXFwiPlxcbiAgICAgICAgICAgICAge3t2bS51c2VyTGFuZ3VhZ2UubmFtZX19XFxuICAgICAgICAgICAgPC9zcGFuPlxcbiAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvbWQtbWVudS1pdGVtPlxcbiAgICAgIDwvbWQtbWVudS1jb250ZW50PlxcbiAgICA8L21kLW1lbnU+XFxuXFxuICAgIDxkaXY+XFxuICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwiYWRkLW5ldy1wcm9qZWN0XFxcIiB1aS1zcmVmPVxcXCJuZXdQcm9qZWN0XFxcIlxcbiAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cXFwiQWRkIG5ldyBwcm9qZWN0XFxcIlxcbiAgICAgICAgICAgICAgICAgbmctc2hvdz1cXFwidm0ucHJvZmlsZVZhbGlkXFxcIlxcbiAgICAgICAgICAgICAgICAgbWQtbm8taW5rPlxcbiAgICAgICAgPG1kLWljb24gY2xhc3M9XFxcIm1hdGVyaWFsLWljb25zXFxcIj5hZGQ8L21kLWljb24+XFxuICAgICAgICA8dHJhbnNsYXRlPk5ldyBQcm9qZWN0PC90cmFuc2xhdGU+XFxuICAgICAgPC9tZC1idXR0b24+XFxuICAgIDwvZGl2PlxcblxcbiAgPC9kaXY+XFxuPC9tZC10b29sYmFyPlxcblwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/TopBar/topBar.html\n");

/***/ })

}]);