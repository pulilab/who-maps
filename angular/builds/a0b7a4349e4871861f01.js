(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[618],{

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/SubBar/subBar.scss":
/*!********************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js!./src/Common/SubBar/subBar.scss ***!
  \********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: `sass-loader` requires `node-sass` >=4. Please install a compatible version.\\n    at Object.sassLoader (/Users/nico/Projects/who-maps/frontend/node_modules/sass-loader/lib/loader.js:31:19)\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3NyYy9Db21tb24vU3ViQmFyL3N1YkJhci5zY3NzLmpzIiwic291cmNlcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/SubBar/subBar.scss\n");

/***/ }),

/***/ "./src/Common/SubBar/SubBarController.js":
/*!***********************************************!*\
  !*** ./src/Common/SubBar/SubBarController.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _filter = __webpack_require__(/*! lodash/filter */ \"./node_modules/lodash/filter.js\");\n\nvar _filter2 = _interopRequireDefault(_filter);\n\nvar _last = __webpack_require__(/*! lodash/last */ \"./node_modules/lodash/last.js\");\n\nvar _last2 = _interopRequireDefault(_last);\n\nvar _clipboard = __webpack_require__(/*! clipboard */ \"./node_modules/clipboard/lib/clipboard.js\");\n\nvar _clipboard2 = _interopRequireDefault(_clipboard);\n\nvar _projects = __webpack_require__(/*! ../../store/modules/projects */ \"./src/store/modules/projects.js\");\n\nvar ProjectModule = _interopRequireWildcard(_projects);\n\nvar _user = __webpack_require__(/*! ../../store/modules/user */ \"./src/store/modules/user.js\");\n\nvar UserModule = _interopRequireWildcard(_user);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar SubBarController = function () {\n    function SubBarController($state, $scope, $ngRedux) {\n        _classCallCheck(this, SubBarController);\n\n        this.state = $state;\n        this.scope = $scope;\n        this.$onInit = this.onInit.bind(this);\n        this.$onDestroy = this.onDestroy.bind(this);\n        this.mapState = this.mapState.bind(this);\n        this.unsubscribe = $ngRedux.connect(this.mapState, ProjectModule)(this);\n        this.navigateToProject = this.navigateToProject.bind(this);\n        this.iconFunction = this.iconFunction.bind(this);\n    }\n\n    _createClass(SubBarController, [{\n        key: 'mapState',\n        value: function mapState(state) {\n            return {\n                projects: ProjectModule.getPublishedProjects(state),\n                userProfile: UserModule.getProfile(state),\n                currentProject: ProjectModule.getCurrentProject(state),\n                lastVersion: ProjectModule.getCurrentVersion(state),\n                lastVersionDate: ProjectModule.getCurrentVersionDate(state)\n            };\n        }\n    }, {\n        key: 'onInit',\n        value: function onInit() {\n            if (this.currentProject) {\n                this.createShareDefinition();\n            }\n        }\n    }, {\n        key: 'onDestroy',\n        value: function onDestroy() {\n            this.unsubscribe();\n        }\n    }, {\n        key: 'createShareDefinition',\n        value: function createShareDefinition() {\n            var _this = this;\n\n            this.shareUrl = {\n                url: 'http://' + window.location.host + '/project/' + this.currentProject.public_id,\n                copyClicked: false,\n                clipboard: new _clipboard2.default('.share-copy')\n            };\n\n            this.shareUrl.clipboard.on('success', function (event) {\n                _this.shareUrl.copyClicked = true;\n                event.clearSelection();\n            });\n        }\n    }, {\n        key: 'hasProfile',\n        value: function hasProfile() {\n            return this.userProfile && this.userProfile.country;\n        }\n    }, {\n        key: 'iconFunction',\n        value: function iconFunction(item) {\n            var base = {\n                name: 'visibility',\n                style: {\n                    color: '#53A0CE',\n                    position: 'absolute',\n                    right: '5px',\n                    fontSize: '15px',\n                    lineHeight: '24px'\n                }\n            };\n            if (this.userProfile && this.userProfile.member && this.userProfile.member.indexOf(item.id) > -1) {\n                base.name = 'grade';\n                base.style.color = '#CD9924';\n            }\n            return base;\n        }\n    }, {\n        key: 'navigateToProject',\n        value: function navigateToProject(name) {\n            var id = (0, _filter2.default)(this.projects, { name: name })[0].id;\n            this.state.go(this.state.current.name, { 'appName': id });\n        }\n    }, {\n        key: 'goToDashboard',\n        value: function goToDashboard() {\n            this.state.go('dashboard', { 'appName': (0, _last2.default)(this.projects).id });\n        }\n    }, {\n        key: 'goToEditProject',\n        value: function goToEditProject() {\n            this.state.go('editProject', { 'appName': (0, _last2.default)(this.projects).id });\n        }\n    }, {\n        key: 'showSubBar',\n        value: function showSubBar() {\n            return this.state.params.appName !== null && this.state.current.parent !== 'public';\n        }\n    }, {\n        key: 'openMenu',\n        value: function openMenu($mdOpenMenu, event) {\n            $mdOpenMenu(event);\n        }\n    }], [{\n        key: 'subBarControllerFactory',\n        value: function subBarControllerFactory() {\n            __webpack_require__(/*! ./subBar.scss */ \"./src/Common/SubBar/subBar.scss\");\n            function subBarController($state, $scope, $ngRedux) {\n                return new SubBarController($state, $scope, $ngRedux);\n            }\n\n            subBarController.$inject = ['$state', '$scope', '$ngRedux'];\n\n            return subBarController;\n        }\n    }]);\n\n    return SubBarController;\n}();\n\nexports.default = SubBarController;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1N1YkJhci9TdWJCYXJDb250cm9sbGVyLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9Db21tb24vU3ViQmFyL1N1YkJhckNvbnRyb2xsZXIuanM/OGQ2NSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmlsdGVyIGZyb20gJ2xvZGFzaC9maWx0ZXInO1xuaW1wb3J0IGxhc3QgZnJvbSAnbG9kYXNoL2xhc3QnO1xuaW1wb3J0IENsaXBib2FyZCBmcm9tICdjbGlwYm9hcmQnO1xuaW1wb3J0ICogYXMgUHJvamVjdE1vZHVsZSBmcm9tICcuLi8uLi9zdG9yZS9tb2R1bGVzL3Byb2plY3RzJztcbmltcG9ydCAqIGFzIFVzZXJNb2R1bGUgZnJvbSAnLi4vLi4vc3RvcmUvbW9kdWxlcy91c2VyJztcblxuY2xhc3MgU3ViQmFyQ29udHJvbGxlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcigkc3RhdGUsICRzY29wZSwgJG5nUmVkdXgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICRzdGF0ZTtcbiAgICAgICAgdGhpcy5zY29wZSA9ICRzY29wZTtcbiAgICAgICAgdGhpcy4kb25Jbml0ID0gdGhpcy5vbkluaXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gdGhpcy5vbkRlc3Ryb3kuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5tYXBTdGF0ZSA9IHRoaXMubWFwU3RhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSA9ICRuZ1JlZHV4LmNvbm5lY3QodGhpcy5tYXBTdGF0ZSwgUHJvamVjdE1vZHVsZSkodGhpcyk7XG4gICAgICAgIHRoaXMubmF2aWdhdGVUb1Byb2plY3QgPSB0aGlzLm5hdmlnYXRlVG9Qcm9qZWN0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaWNvbkZ1bmN0aW9uID0gdGhpcy5pY29uRnVuY3Rpb24uYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBtYXBTdGF0ZShzdGF0ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvamVjdHM6IFByb2plY3RNb2R1bGUuZ2V0UHVibGlzaGVkUHJvamVjdHMoc3RhdGUpLFxuICAgICAgICAgICAgdXNlclByb2ZpbGU6IFVzZXJNb2R1bGUuZ2V0UHJvZmlsZShzdGF0ZSksXG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdDogUHJvamVjdE1vZHVsZS5nZXRDdXJyZW50UHJvamVjdChzdGF0ZSksXG4gICAgICAgICAgICBsYXN0VmVyc2lvbjogUHJvamVjdE1vZHVsZS5nZXRDdXJyZW50VmVyc2lvbihzdGF0ZSksXG4gICAgICAgICAgICBsYXN0VmVyc2lvbkRhdGU6IFByb2plY3RNb2R1bGUuZ2V0Q3VycmVudFZlcnNpb25EYXRlKHN0YXRlKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIG9uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFByb2plY3QpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcmVEZWZpbml0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVTaGFyZURlZmluaXRpb24oKSB7XG4gICAgICAgIHRoaXMuc2hhcmVVcmwgPSB7XG4gICAgICAgICAgICB1cmw6IGBodHRwOi8vJHt3aW5kb3cubG9jYXRpb24uaG9zdH0vcHJvamVjdC8ke3RoaXMuY3VycmVudFByb2plY3QucHVibGljX2lkfWAsXG4gICAgICAgICAgICBjb3B5Q2xpY2tlZDogZmFsc2UsXG4gICAgICAgICAgICBjbGlwYm9hcmQ6IG5ldyBDbGlwYm9hcmQoJy5zaGFyZS1jb3B5JylcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNoYXJlVXJsLmNsaXBib2FyZC5vbignc3VjY2VzcycsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hhcmVVcmwuY29weUNsaWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgZXZlbnQuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGFzUHJvZmlsZSgpIHtcbiAgICAgICAgcmV0dXJuICB0aGlzLnVzZXJQcm9maWxlICYmIHRoaXMudXNlclByb2ZpbGUuY291bnRyeTtcbiAgICB9XG5cbiAgICBpY29uRnVuY3Rpb24oaXRlbSkge1xuICAgICAgICBjb25zdCBiYXNlID0ge1xuICAgICAgICAgICAgbmFtZTogJ3Zpc2liaWxpdHknLFxuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICBjb2xvcjogJyM1M0EwQ0UnLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAnNXB4JyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE1cHgnLFxuICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6ICcyNHB4J1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy51c2VyUHJvZmlsZSAmJiB0aGlzLnVzZXJQcm9maWxlLm1lbWJlciAmJiB0aGlzLnVzZXJQcm9maWxlLm1lbWJlci5pbmRleE9mKGl0ZW0uaWQpID4gLTEpIHtcbiAgICAgICAgICAgIGJhc2UubmFtZSA9ICdncmFkZSc7XG4gICAgICAgICAgICBiYXNlLnN0eWxlLmNvbG9yID0gJyNDRDk5MjQnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXNlO1xuICAgIH1cblxuICAgIG5hdmlnYXRlVG9Qcm9qZWN0KG5hbWUpIHtcbiAgICAgICAgY29uc3QgaWQgPSBmaWx0ZXIodGhpcy5wcm9qZWN0cywgeyBuYW1lIH0pWzBdLmlkO1xuICAgICAgICB0aGlzLnN0YXRlLmdvKHRoaXMuc3RhdGUuY3VycmVudC5uYW1lLCB7ICdhcHBOYW1lJzogaWQgfSk7XG4gICAgfVxuXG5cbiAgICBnb1RvRGFzaGJvYXJkKCkge1xuICAgICAgICB0aGlzLnN0YXRlLmdvKCdkYXNoYm9hcmQnLCB7ICdhcHBOYW1lJzogbGFzdCh0aGlzLnByb2plY3RzKS5pZCB9KTtcbiAgICB9XG5cbiAgICBnb1RvRWRpdFByb2plY3QoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuZ28oJ2VkaXRQcm9qZWN0JywgeyAnYXBwTmFtZSc6IGxhc3QodGhpcy5wcm9qZWN0cykuaWQgfSk7XG4gICAgfVxuXG4gICAgc2hvd1N1YkJhcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUucGFyYW1zLmFwcE5hbWUgIT09IG51bGwgJiYgdGhpcy5zdGF0ZS5jdXJyZW50LnBhcmVudCAhPT0gJ3B1YmxpYyc7XG4gICAgfVxuXG5cbiAgICBvcGVuTWVudSgkbWRPcGVuTWVudSwgZXZlbnQpIHtcbiAgICAgICAgJG1kT3Blbk1lbnUoZXZlbnQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdWJCYXJDb250cm9sbGVyRmFjdG9yeSgpIHtcbiAgICAgICAgcmVxdWlyZSgnLi9zdWJCYXIuc2NzcycpO1xuICAgICAgICBmdW5jdGlvbiBzdWJCYXJDb250cm9sbGVyKCRzdGF0ZSwgJHNjb3BlLCAkbmdSZWR1eCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdWJCYXJDb250cm9sbGVyKCRzdGF0ZSwgJHNjb3BlLCAkbmdSZWR1eCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdWJCYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzdGF0ZScsICckc2NvcGUnLCAnJG5nUmVkdXgnXTtcblxuICAgICAgICByZXR1cm4gc3ViQmFyQ29udHJvbGxlcjtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3ViQmFyQ29udHJvbGxlcjtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBOzs7Ozs7O0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7OztBQUVBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFGQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQUlBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Common/SubBar/SubBarController.js\n");

/***/ }),

/***/ "./src/Common/SubBar/subBar.html":
/*!***************************************!*\
  !*** ./src/Common/SubBar/subBar.html ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<md-toolbar class=\\\"md-medium-tall toolbar-project md-whiteframe-1dp\\\" ng-if=\\\"vm.showSubBar()\\\">\\n  <div class=\\\"md-toolbar-tools md-toolbar-tools-bottom\\\" ng-hide=\\\"!vm.state.params.appName\\\">\\n\\n    <div class=\\\"large project-name\\\">\\n      <div>{{vm.currentProject.name}} ({{vm.currentProject.country_name}})</div>\\n      <md-icon class=\\\"material-icons viewerIcon\\\" ng-show=\\\"vm.currentProject.isViewer\\\">visibility</md-icon>\\n      <md-icon class=\\\"material-icons memberIcon\\\" ng-show=\\\"vm.currentProject.isMember\\\">grade</md-icon>\\n    </div>\\n\\n    <div flex></div>\\n\\n    <div class=\\\"project-info\\\" layout=\\\"row\\\" layout-align=\\\"end center\\\">\\n      <div class=\\\"info-block\\\" ng-show=\\\"vm.currentProject.isPublished\\\">\\n        <h6>\\n          <translate>UUID</translate>\\n        </h6>\\n        <span class=\\\"data-info\\\">{{vm.currentProject.public_id}}</span>\\n      </div>\\n      <div class=\\\"info-block\\\">\\n        <h6>\\n          <translate>Version</translate>\\n        </h6>\\n        <span ng-show=\\\"vm.currentProject.isPublished\\\" class=\\\"data-info\\\">\\n          {{vm.lastVersion}}.\\n          {{vm.lastVersionDate ? ('(' + (vm.lastVersionDate | date: medium) + ')') : '' }}\\n        </span>\\n        <span ng-hide=\\\"vm.currentProject.isPublished\\\" class=\\\"data-info\\\">\\n          <translate>Draft</translate>\\n        </span>\\n      </div>\\n      <div class=\\\"info-block\\\">\\n        <h6>\\n          <translate>Organisation</translate>\\n        </h6>\\n        <span class=\\\"data-info\\\">{{vm.currentProject.organisation_name}}</span>\\n      </div>\\n      <div class=\\\"info-block\\\" ng-if=\\\"vm.currentProject.contact_name\\\" layout=\\\"row\\\">\\n        <div>\\n          <h6>\\n            <translate>Contact Person</translate>\\n          </h6>\\n          <span class=\\\"data-info\\\">{{vm.currentProject.contact_name}}</span>\\n        </div>\\n        <div>\\n          <md-button class=\\\"contact-button\\\" ng-href=\\\"mailto:{{vm.currentProject.contact_email}}\\\"  md-no-ink>\\n            <md-icon class=\\\"material-icons\\\">\\n              mail_outline\\n            </md-icon>\\n            <translate>EMAIL</translate>\\n          </md-button>\\n        </div>\\n      </div>\\n\\n    </div>\\n  </div>\\n  <div class=\\\"md-toolbar-tools md-toolbar-tools-mainmenu\\\">\\n    <div class=\\\"project-mainmenu\\\">\\n      <md-button ui-sref=\\\"assessment\\\"\\n                 ng-hide=\\\"vm.currentProject.isPublic\\\"\\n                 ui-sref-active=\\\"active\\\" md-no-ink>\\n        <md-tooltip md-autohide md-direction=\\\"top\\\">\\n          <translate>GO TO ASSESSMENT</translate>\\n        </md-tooltip>\\n        <span>\\n          <translate>Assessment</translate>\\n        </span>\\n      </md-button>\\n\\n      <md-button ui-sref=\\\"editProject\\\" ng-disabled=\\\"!vm.hasProfile()\\\" ng-if=\\\"vm.currentProject.isMember && !vm.viewMode\\\" ui-sref-active=\\\"active\\\" md-no-ink>\\n        <md-tooltip md-autohide md-direction=\\\"top\\\">\\n          <translate >EDIT PROJECT DETAILS</translate>\\n        </md-tooltip>\\n        <span>\\n          <translate>Edit Project</translate>\\n        </span>\\n      </md-button>\\n\\n      <md-button ui-sref=\\\"maps\\\" ng-show=\\\"vm.userType !== 'G' && !vm.currentProject.isPublic\\\"\\n                 ng-if=\\\"!vm.viewMode\\\"\\n                 ng-disabled=\\\"!vm.hasProfile()\\\"\\n                 ui-sref-active=\\\"active\\\" md-no-ink>\\n        <md-tooltip md-autohide md-direction=\\\"top\\\">\\n          <translate >GO TO MAPS TOOLKIT</translate>\\n        </md-tooltip>\\n        <span ng-show=\\\"vm.currentProject.isViewer\\\">\\n          <translate>Visualize Score</translate>\\n        </span>\\n        <span ng-show=\\\"vm.currentProject.isMember\\\">\\n          <translate>Update Score</translate>\\n        </span>\\n      </md-button>\\n\\n      <md-button ui-sref=\\\"summary\\\" ng-show=\\\"vm.userType !== 'G' && !vm.currentProject.isPublic\\\" ng-if=\\\"!vm.viewMode\\\" ng-disabled=\\\"!vm.hasProfile()\\\" ui-sref-active=\\\"active\\\" md-no-ink>\\n        <md-tooltip md-autohide md-direction=\\\"top\\\">\\n          <translate>SHOW SCORE SUMMARY</translate>\\n        </md-tooltip>\\n        <span>\\n          <translate>Summary Score</translate>\\n        </span>\\n      </md-button>\\n\\n      <div class=\\\"project-submenu\\\">\\n        <md-menu md-position-mode=\\\"target-left target\\\">\\n          <md-button ng-click=\\\"vm.openMenu($mdOpenMenu, $event)\\\" ng-show=\\\"vm.currentProject.isPublished\\\" class=\\\"share-link\\\" aria-label=\\\"Share\\\" md-no-ink>\\n            <!-- <md-icon class=\\\"material-icons\\\">share</md-icon> -->\\n            <translate>Share Public Link</translate>\\n          </md-button>\\n          <md-menu-content class=\\\"share-url\\\">\\n            <md-menu-item>\\n              <span class=\\\"share-title\\\">\\n                <translate>Share Public Link</translate>\\n              </span>\\n            </md-menu-item>\\n            <md-menu-item>\\n              <input readonly class=\\\"share-url-box\\\" ng-model=\\\"vm.shareUrl.url\\\" />\\n            </md-menu-item>\\n            <md-menu-item>\\n              <div class=\\\"share-button-container\\\" >\\n                <md-button ng-hide=\\\"vm.shareUrl.copyClicked\\\"\\n                           data-clipboard-target='.share-url-box'\\n                           class=\\\"md-primary md-raised share-copy\\\"\\n                           md-prevent-menu-close=\\\"md-prevent-menu-close\\\" >\\n                  <translate>Copy URL</translate>\\n                </md-button>\\n                <md-button ng-show=\\\"vm.shareUrl.copyClicked\\\"\\n                           class=\\\"md-raised share-copy share-copied\\\">\\n                  <md-icon>check</md-icon>\\n                  <translate>Copied</translate>\\n                </md-button>\\n                <md-button class=\\\"share-cancel\\\">\\n                  <translate>Close</translate>\\n                </md-button>\\n              </div>\\n            </md-menu-item>\\n          </md-menu-content>\\n        </md-menu>\\n      </div>\\n    </div>\\n  </div>\\n\\n</md-toolbar>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1N1YkJhci9zdWJCYXIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Db21tb24vU3ViQmFyL3N1YkJhci5odG1sPzIzYzUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxtZC10b29sYmFyIGNsYXNzPVxcXCJtZC1tZWRpdW0tdGFsbCB0b29sYmFyLXByb2plY3QgbWQtd2hpdGVmcmFtZS0xZHBcXFwiIG5nLWlmPVxcXCJ2bS5zaG93U3ViQmFyKClcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwibWQtdG9vbGJhci10b29scyBtZC10b29sYmFyLXRvb2xzLWJvdHRvbVxcXCIgbmctaGlkZT1cXFwiIXZtLnN0YXRlLnBhcmFtcy5hcHBOYW1lXFxcIj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UgcHJvamVjdC1uYW1lXFxcIj5cXG4gICAgICA8ZGl2Pnt7dm0uY3VycmVudFByb2plY3QubmFtZX19ICh7e3ZtLmN1cnJlbnRQcm9qZWN0LmNvdW50cnlfbmFtZX19KTwvZGl2PlxcbiAgICAgIDxtZC1pY29uIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29ucyB2aWV3ZXJJY29uXFxcIiBuZy1zaG93PVxcXCJ2bS5jdXJyZW50UHJvamVjdC5pc1ZpZXdlclxcXCI+dmlzaWJpbGl0eTwvbWQtaWNvbj5cXG4gICAgICA8bWQtaWNvbiBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnMgbWVtYmVySWNvblxcXCIgbmctc2hvdz1cXFwidm0uY3VycmVudFByb2plY3QuaXNNZW1iZXJcXFwiPmdyYWRlPC9tZC1pY29uPlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBmbGV4PjwvZGl2PlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJwcm9qZWN0LWluZm9cXFwiIGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtYWxpZ249XFxcImVuZCBjZW50ZXJcXFwiPlxcbiAgICAgIDxkaXYgY2xhc3M9XFxcImluZm8tYmxvY2tcXFwiIG5nLXNob3c9XFxcInZtLmN1cnJlbnRQcm9qZWN0LmlzUHVibGlzaGVkXFxcIj5cXG4gICAgICAgIDxoNj5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5VVUlEPC90cmFuc2xhdGU+XFxuICAgICAgICA8L2g2PlxcbiAgICAgICAgPHNwYW4gY2xhc3M9XFxcImRhdGEtaW5mb1xcXCI+e3t2bS5jdXJyZW50UHJvamVjdC5wdWJsaWNfaWR9fTwvc3Bhbj5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJpbmZvLWJsb2NrXFxcIj5cXG4gICAgICAgIDxoNj5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5WZXJzaW9uPC90cmFuc2xhdGU+XFxuICAgICAgICA8L2g2PlxcbiAgICAgICAgPHNwYW4gbmctc2hvdz1cXFwidm0uY3VycmVudFByb2plY3QuaXNQdWJsaXNoZWRcXFwiIGNsYXNzPVxcXCJkYXRhLWluZm9cXFwiPlxcbiAgICAgICAgICB7e3ZtLmxhc3RWZXJzaW9ufX0uXFxuICAgICAgICAgIHt7dm0ubGFzdFZlcnNpb25EYXRlID8gKCcoJyArICh2bS5sYXN0VmVyc2lvbkRhdGUgfCBkYXRlOiBtZWRpdW0pICsgJyknKSA6ICcnIH19XFxuICAgICAgICA8L3NwYW4+XFxuICAgICAgICA8c3BhbiBuZy1oaWRlPVxcXCJ2bS5jdXJyZW50UHJvamVjdC5pc1B1Ymxpc2hlZFxcXCIgY2xhc3M9XFxcImRhdGEtaW5mb1xcXCI+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+RHJhZnQ8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvc3Bhbj5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJpbmZvLWJsb2NrXFxcIj5cXG4gICAgICAgIDxoNj5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5PcmdhbmlzYXRpb248L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvaDY+XFxuICAgICAgICA8c3BhbiBjbGFzcz1cXFwiZGF0YS1pbmZvXFxcIj57e3ZtLmN1cnJlbnRQcm9qZWN0Lm9yZ2FuaXNhdGlvbl9uYW1lfX08L3NwYW4+XFxuICAgICAgPC9kaXY+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwiaW5mby1ibG9ja1xcXCIgbmctaWY9XFxcInZtLmN1cnJlbnRQcm9qZWN0LmNvbnRhY3RfbmFtZVxcXCIgbGF5b3V0PVxcXCJyb3dcXFwiPlxcbiAgICAgICAgPGRpdj5cXG4gICAgICAgICAgPGg2PlxcbiAgICAgICAgICAgIDx0cmFuc2xhdGU+Q29udGFjdCBQZXJzb248L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgPC9oNj5cXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImRhdGEtaW5mb1xcXCI+e3t2bS5jdXJyZW50UHJvamVjdC5jb250YWN0X25hbWV9fTwvc3Bhbj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPGRpdj5cXG4gICAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwiY29udGFjdC1idXR0b25cXFwiIG5nLWhyZWY9XFxcIm1haWx0bzp7e3ZtLmN1cnJlbnRQcm9qZWN0LmNvbnRhY3RfZW1haWx9fVxcXCIgIG1kLW5vLWluaz5cXG4gICAgICAgICAgICA8bWQtaWNvbiBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnNcXFwiPlxcbiAgICAgICAgICAgICAgbWFpbF9vdXRsaW5lXFxuICAgICAgICAgICAgPC9tZC1pY29uPlxcbiAgICAgICAgICAgIDx0cmFuc2xhdGU+RU1BSUw8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgPC9tZC1idXR0b24+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG5cXG4gICAgPC9kaXY+XFxuICA8L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcIm1kLXRvb2xiYXItdG9vbHMgbWQtdG9vbGJhci10b29scy1tYWlubWVudVxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcInByb2plY3QtbWFpbm1lbnVcXFwiPlxcbiAgICAgIDxtZC1idXR0b24gdWktc3JlZj1cXFwiYXNzZXNzbWVudFxcXCJcXG4gICAgICAgICAgICAgICAgIG5nLWhpZGU9XFxcInZtLmN1cnJlbnRQcm9qZWN0LmlzUHVibGljXFxcIlxcbiAgICAgICAgICAgICAgICAgdWktc3JlZi1hY3RpdmU9XFxcImFjdGl2ZVxcXCIgbWQtbm8taW5rPlxcbiAgICAgICAgPG1kLXRvb2x0aXAgbWQtYXV0b2hpZGUgbWQtZGlyZWN0aW9uPVxcXCJ0b3BcXFwiPlxcbiAgICAgICAgICA8dHJhbnNsYXRlPkdPIFRPIEFTU0VTU01FTlQ8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvbWQtdG9vbHRpcD5cXG4gICAgICAgIDxzcGFuPlxcbiAgICAgICAgICA8dHJhbnNsYXRlPkFzc2Vzc21lbnQ8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvc3Bhbj5cXG4gICAgICA8L21kLWJ1dHRvbj5cXG5cXG4gICAgICA8bWQtYnV0dG9uIHVpLXNyZWY9XFxcImVkaXRQcm9qZWN0XFxcIiBuZy1kaXNhYmxlZD1cXFwiIXZtLmhhc1Byb2ZpbGUoKVxcXCIgbmctaWY9XFxcInZtLmN1cnJlbnRQcm9qZWN0LmlzTWVtYmVyICYmICF2bS52aWV3TW9kZVxcXCIgdWktc3JlZi1hY3RpdmU9XFxcImFjdGl2ZVxcXCIgbWQtbm8taW5rPlxcbiAgICAgICAgPG1kLXRvb2x0aXAgbWQtYXV0b2hpZGUgbWQtZGlyZWN0aW9uPVxcXCJ0b3BcXFwiPlxcbiAgICAgICAgICA8dHJhbnNsYXRlID5FRElUIFBST0pFQ1QgREVUQUlMUzwvdHJhbnNsYXRlPlxcbiAgICAgICAgPC9tZC10b29sdGlwPlxcbiAgICAgICAgPHNwYW4+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+RWRpdCBQcm9qZWN0PC90cmFuc2xhdGU+XFxuICAgICAgICA8L3NwYW4+XFxuICAgICAgPC9tZC1idXR0b24+XFxuXFxuICAgICAgPG1kLWJ1dHRvbiB1aS1zcmVmPVxcXCJtYXBzXFxcIiBuZy1zaG93PVxcXCJ2bS51c2VyVHlwZSAhPT0gJ0cnICYmICF2bS5jdXJyZW50UHJvamVjdC5pc1B1YmxpY1xcXCJcXG4gICAgICAgICAgICAgICAgIG5nLWlmPVxcXCIhdm0udmlld01vZGVcXFwiXFxuICAgICAgICAgICAgICAgICBuZy1kaXNhYmxlZD1cXFwiIXZtLmhhc1Byb2ZpbGUoKVxcXCJcXG4gICAgICAgICAgICAgICAgIHVpLXNyZWYtYWN0aXZlPVxcXCJhY3RpdmVcXFwiIG1kLW5vLWluaz5cXG4gICAgICAgIDxtZC10b29sdGlwIG1kLWF1dG9oaWRlIG1kLWRpcmVjdGlvbj1cXFwidG9wXFxcIj5cXG4gICAgICAgICAgPHRyYW5zbGF0ZSA+R08gVE8gTUFQUyBUT09MS0lUPC90cmFuc2xhdGU+XFxuICAgICAgICA8L21kLXRvb2x0aXA+XFxuICAgICAgICA8c3BhbiBuZy1zaG93PVxcXCJ2bS5jdXJyZW50UHJvamVjdC5pc1ZpZXdlclxcXCI+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+VmlzdWFsaXplIFNjb3JlPC90cmFuc2xhdGU+XFxuICAgICAgICA8L3NwYW4+XFxuICAgICAgICA8c3BhbiBuZy1zaG93PVxcXCJ2bS5jdXJyZW50UHJvamVjdC5pc01lbWJlclxcXCI+XFxuICAgICAgICAgIDx0cmFuc2xhdGU+VXBkYXRlIFNjb3JlPC90cmFuc2xhdGU+XFxuICAgICAgICA8L3NwYW4+XFxuICAgICAgPC9tZC1idXR0b24+XFxuXFxuICAgICAgPG1kLWJ1dHRvbiB1aS1zcmVmPVxcXCJzdW1tYXJ5XFxcIiBuZy1zaG93PVxcXCJ2bS51c2VyVHlwZSAhPT0gJ0cnICYmICF2bS5jdXJyZW50UHJvamVjdC5pc1B1YmxpY1xcXCIgbmctaWY9XFxcIiF2bS52aWV3TW9kZVxcXCIgbmctZGlzYWJsZWQ9XFxcIiF2bS5oYXNQcm9maWxlKClcXFwiIHVpLXNyZWYtYWN0aXZlPVxcXCJhY3RpdmVcXFwiIG1kLW5vLWluaz5cXG4gICAgICAgIDxtZC10b29sdGlwIG1kLWF1dG9oaWRlIG1kLWRpcmVjdGlvbj1cXFwidG9wXFxcIj5cXG4gICAgICAgICAgPHRyYW5zbGF0ZT5TSE9XIFNDT1JFIFNVTU1BUlk8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvbWQtdG9vbHRpcD5cXG4gICAgICAgIDxzcGFuPlxcbiAgICAgICAgICA8dHJhbnNsYXRlPlN1bW1hcnkgU2NvcmU8L3RyYW5zbGF0ZT5cXG4gICAgICAgIDwvc3Bhbj5cXG4gICAgICA8L21kLWJ1dHRvbj5cXG5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJwcm9qZWN0LXN1Ym1lbnVcXFwiPlxcbiAgICAgICAgPG1kLW1lbnUgbWQtcG9zaXRpb24tbW9kZT1cXFwidGFyZ2V0LWxlZnQgdGFyZ2V0XFxcIj5cXG4gICAgICAgICAgPG1kLWJ1dHRvbiBuZy1jbGljaz1cXFwidm0ub3Blbk1lbnUoJG1kT3Blbk1lbnUsICRldmVudClcXFwiIG5nLXNob3c9XFxcInZtLmN1cnJlbnRQcm9qZWN0LmlzUHVibGlzaGVkXFxcIiBjbGFzcz1cXFwic2hhcmUtbGlua1xcXCIgYXJpYS1sYWJlbD1cXFwiU2hhcmVcXFwiIG1kLW5vLWluaz5cXG4gICAgICAgICAgICA8IS0tIDxtZC1pY29uIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+c2hhcmU8L21kLWljb24+IC0tPlxcbiAgICAgICAgICAgIDx0cmFuc2xhdGU+U2hhcmUgUHVibGljIExpbms8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgPC9tZC1idXR0b24+XFxuICAgICAgICAgIDxtZC1tZW51LWNvbnRlbnQgY2xhc3M9XFxcInNoYXJlLXVybFxcXCI+XFxuICAgICAgICAgICAgPG1kLW1lbnUtaXRlbT5cXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJzaGFyZS10aXRsZVxcXCI+XFxuICAgICAgICAgICAgICAgIDx0cmFuc2xhdGU+U2hhcmUgUHVibGljIExpbms8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgIDwvc3Bhbj5cXG4gICAgICAgICAgICA8L21kLW1lbnUtaXRlbT5cXG4gICAgICAgICAgICA8bWQtbWVudS1pdGVtPlxcbiAgICAgICAgICAgICAgPGlucHV0IHJlYWRvbmx5IGNsYXNzPVxcXCJzaGFyZS11cmwtYm94XFxcIiBuZy1tb2RlbD1cXFwidm0uc2hhcmVVcmwudXJsXFxcIiAvPlxcbiAgICAgICAgICAgIDwvbWQtbWVudS1pdGVtPlxcbiAgICAgICAgICAgIDxtZC1tZW51LWl0ZW0+XFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzaGFyZS1idXR0b24tY29udGFpbmVyXFxcIiA+XFxuICAgICAgICAgICAgICAgIDxtZC1idXR0b24gbmctaGlkZT1cXFwidm0uc2hhcmVVcmwuY29weUNsaWNrZWRcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1jbGlwYm9hcmQtdGFyZ2V0PScuc2hhcmUtdXJsLWJveCdcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwibWQtcHJpbWFyeSBtZC1yYWlzZWQgc2hhcmUtY29weVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtZC1wcmV2ZW50LW1lbnUtY2xvc2U9XFxcIm1kLXByZXZlbnQtbWVudS1jbG9zZVxcXCIgPlxcbiAgICAgICAgICAgICAgICAgIDx0cmFuc2xhdGU+Q29weSBVUkw8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgICAgPC9tZC1idXR0b24+XFxuICAgICAgICAgICAgICAgIDxtZC1idXR0b24gbmctc2hvdz1cXFwidm0uc2hhcmVVcmwuY29weUNsaWNrZWRcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIm1kLXJhaXNlZCBzaGFyZS1jb3B5IHNoYXJlLWNvcGllZFxcXCI+XFxuICAgICAgICAgICAgICAgICAgPG1kLWljb24+Y2hlY2s8L21kLWljb24+XFxuICAgICAgICAgICAgICAgICAgPHRyYW5zbGF0ZT5Db3BpZWQ8L3RyYW5zbGF0ZT5cXG4gICAgICAgICAgICAgICAgPC9tZC1idXR0b24+XFxuICAgICAgICAgICAgICAgIDxtZC1idXR0b24gY2xhc3M9XFxcInNoYXJlLWNhbmNlbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgPHRyYW5zbGF0ZT5DbG9zZTwvdHJhbnNsYXRlPlxcbiAgICAgICAgICAgICAgICA8L21kLWJ1dHRvbj5cXG4gICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvbWQtbWVudS1pdGVtPlxcbiAgICAgICAgICA8L21kLW1lbnUtY29udGVudD5cXG4gICAgICAgIDwvbWQtbWVudT5cXG4gICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICA8L2Rpdj5cXG5cXG48L21kLXRvb2xiYXI+XFxuXCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/Common/SubBar/subBar.html\n");

/***/ }),

/***/ "./src/Common/SubBar/subBar.scss":
/*!***************************************!*\
  !*** ./src/Common/SubBar/subBar.scss ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/postcss-loader/lib!../../../node_modules/sass-loader/lib/loader.js!./subBar.scss */ \"./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/SubBar/subBar.scss\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1N1YkJhci9zdWJCYXIuc2Nzcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Db21tb24vU3ViQmFyL3N1YkJhci5zY3NzP2Y4YzciXSwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9zdWJCYXIuc2Nzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3N1YkJhci5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3N1YkJhci5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Common/SubBar/subBar.scss\n");

/***/ }),

/***/ "./src/Common/SubBar/subBarComponent.js":
/*!**********************************************!*\
  !*** ./src/Common/SubBar/subBarComponent.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _subBar = __webpack_require__(/*! ./subBar.html */ \"./src/Common/SubBar/subBar.html\");\n\nvar _subBar2 = _interopRequireDefault(_subBar);\n\nvar _SubBarController = __webpack_require__(/*! ./SubBarController */ \"./src/Common/SubBar/SubBarController.js\");\n\nvar _SubBarController2 = _interopRequireDefault(_SubBarController);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar subBarComponent = {\n    controller: _SubBarController2.default.subBarControllerFactory(),\n    template: _subBar2.default,\n    controllerAs: 'vm',\n    name: 'subBar',\n    bindings: {\n        viewMode: '<'\n    }\n};\n\nexports.default = subBarComponent;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1N1YkJhci9zdWJCYXJDb21wb25lbnQuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL0NvbW1vbi9TdWJCYXIvc3ViQmFyQ29tcG9uZW50LmpzPzQ3MmQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF90ZW1wbGF0ZSBmcm9tICcuL3N1YkJhci5odG1sJztcbmltcG9ydCBTdWJCYXJDb250cm9sbGVyIGZyb20gJy4vU3ViQmFyQ29udHJvbGxlcic7XG5cblxuY29uc3Qgc3ViQmFyQ29tcG9uZW50ID0ge1xuICAgIGNvbnRyb2xsZXI6IFN1YkJhckNvbnRyb2xsZXIuc3ViQmFyQ29udHJvbGxlckZhY3RvcnkoKSxcbiAgICB0ZW1wbGF0ZTogX3RlbXBsYXRlLFxuICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICBuYW1lOiAnc3ViQmFyJyxcbiAgICBiaW5kaW5nczoge1xuICAgICAgICB2aWV3TW9kZTogJzwnXG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc3ViQmFyQ29tcG9uZW50O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFMQTtBQUNBO0FBU0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Common/SubBar/subBarComponent.js\n");

/***/ })

}]);