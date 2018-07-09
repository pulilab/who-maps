(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[588],{

/***/ "./src/Project/projectModule.js":
/*!**************************************!*\
  !*** ./src/Project/projectModule.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _angular = __webpack_require__(/*! angular */ \"./node_modules/angular/index.js\");\n\nvar _angular2 = _interopRequireDefault(_angular);\n\nvar _projects = __webpack_require__(/*! ../store/modules/projects */ \"./src/store/modules/projects.js\");\n\nvar ProjectsModule = _interopRequireWildcard(_projects);\n\nvar _Utilities = __webpack_require__(/*! ../Utilities */ \"./src/Utilities.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar moduleName = 'Project';\n\nvar su = new _Utilities.StaticUtilities('Project');\n\nfunction config($stateProvider, $compileProvider) {\n    $stateProvider.state('newProject', {\n        url: '/new-project/:editMode/',\n        parent: 'app',\n        views: {\n            main: {\n                template: '<project layout-fill layout=\"column\" ></project>'\n            }\n        },\n        resolve: {\n            'components': function components() {\n                var component = su.lazyLoader($compileProvider, 'projectComponent');\n                var interoperability = su.lazyLoader($compileProvider, 'Interoperability/interoperabilityComponent.js');\n                var generalOverview = su.lazyLoader($compileProvider, 'GeneralOverview/generalOverviewComponent.js');\n                var navigation = su.lazyLoader($compileProvider, 'Navigation/navigationComponent.js');\n                var implementationOverview = su.lazyLoader($compileProvider, 'ImplementationOverview/implementationOverviewComponent.js');\n                var technology = su.lazyLoader($compileProvider, 'Technology/technologyComponent.js');\n                var countryFields = su.lazyLoader($compileProvider, 'CountryFields/countryFieldsComponent.js');\n                var dialogMultiSelection = su.lazyLoader($compileProvider, 'DialogMultiSelector/dialogMultiSelectorComponent.js');\n\n                return Promise.all([component, interoperability, generalOverview, navigation, implementationOverview, technology, countryFields, dialogMultiSelection]);\n            },\n            user: ['$ngRedux', function ($ngRedux) {\n                return $ngRedux.dispatch(ProjectsModule.loadProjectStructure());\n            }]\n        },\n        params: {\n            editMode: 'draft'\n        },\n        profileRequired: true\n    }).state('editProject', {\n        url: '/edit-project/:editMode/',\n        parent: 'app',\n        params: {\n            editMode: 'draft'\n        },\n        views: {\n            main: {\n                template: '<project edit-mode=\"true\" layout-fill layout=\"column\" ></project>'\n            }\n        },\n        resolve: {\n            'components': function components() {\n                var component = su.lazyLoader($compileProvider, 'projectComponent');\n                var interoperability = su.lazyLoader($compileProvider, 'Interoperability/interoperabilityComponent.js');\n                var generalOverview = su.lazyLoader($compileProvider, 'GeneralOverview/generalOverviewComponent.js');\n                var navigation = su.lazyLoader($compileProvider, 'Navigation/navigationComponent.js');\n                var implementationOverview = su.lazyLoader($compileProvider, 'ImplementationOverview/implementationOverviewComponent.js');\n                var technology = su.lazyLoader($compileProvider, 'Technology/technologyComponent.js');\n                var countryFields = su.lazyLoader($compileProvider, 'CountryFields/countryFieldsComponent.js');\n                var dialogMultiSelection = su.lazyLoader($compileProvider, 'DialogMultiSelector/dialogMultiSelectorComponent.js');\n\n                return Promise.all([component, interoperability, generalOverview, navigation, implementationOverview, technology, countryFields, dialogMultiSelection]);\n            },\n            user: ['$ngRedux', function ($ngRedux) {\n                return $ngRedux.dispatch(ProjectsModule.loadProjectStructure());\n            }]\n        },\n        profileRequired: true\n    });\n}\n\nconfig.$inject = ['$stateProvider', '$compileProvider'];\n\n_angular2.default.module(moduleName, []).config(config);\n\nexports.default = moduleName;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9wcm9qZWN0TW9kdWxlLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9Qcm9qZWN0L3Byb2plY3RNb2R1bGUuanM/ODFjNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYW5ndWxhciBmcm9tICdhbmd1bGFyJztcbmltcG9ydCAqIGFzIFByb2plY3RzTW9kdWxlIGZyb20gJy4uL3N0b3JlL21vZHVsZXMvcHJvamVjdHMnO1xuaW1wb3J0IHsgU3RhdGljVXRpbGl0aWVzIH0gZnJvbSAnLi4vVXRpbGl0aWVzJztcblxuY29uc3QgbW9kdWxlTmFtZSA9ICdQcm9qZWN0JztcblxuY29uc3Qgc3UgPSBuZXcgU3RhdGljVXRpbGl0aWVzKCdQcm9qZWN0Jyk7XG5cblxuZnVuY3Rpb24gY29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkY29tcGlsZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ25ld1Byb2plY3QnLCB7XG4gICAgICAgIHVybDogJy9uZXctcHJvamVjdC86ZWRpdE1vZGUvJyxcbiAgICAgICAgcGFyZW50OiAnYXBwJyxcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgIG1haW46IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxwcm9qZWN0IGxheW91dC1maWxsIGxheW91dD1cImNvbHVtblwiID48L3Byb2plY3Q+J1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAnY29tcG9uZW50cyc6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSAgc3UubGF6eUxvYWRlcigkY29tcGlsZVByb3ZpZGVyLCAncHJvamVjdENvbXBvbmVudCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGludGVyb3BlcmFiaWxpdHkgPSBzdS5sYXp5TG9hZGVyKCRjb21waWxlUHJvdmlkZXIsXG4gICAgICAgICAgICAgICAgICAnSW50ZXJvcGVyYWJpbGl0eS9pbnRlcm9wZXJhYmlsaXR5Q29tcG9uZW50LmpzJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2VuZXJhbE92ZXJ2aWV3ID0gc3UubGF6eUxvYWRlcigkY29tcGlsZVByb3ZpZGVyLFxuICAgICAgICAgICAgICAgICAgJ0dlbmVyYWxPdmVydmlldy9nZW5lcmFsT3ZlcnZpZXdDb21wb25lbnQuanMnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuYXZpZ2F0aW9uID0gc3UubGF6eUxvYWRlcigkY29tcGlsZVByb3ZpZGVyLFxuICAgICAgICAgICAgICAgICAgJ05hdmlnYXRpb24vbmF2aWdhdGlvbkNvbXBvbmVudC5qcycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGltcGxlbWVudGF0aW9uT3ZlcnZpZXcgPSBzdS5sYXp5TG9hZGVyKCRjb21waWxlUHJvdmlkZXIsXG4gICAgICAgICAgICAgICAgICAnSW1wbGVtZW50YXRpb25PdmVydmlldy9pbXBsZW1lbnRhdGlvbk92ZXJ2aWV3Q29tcG9uZW50LmpzJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGVjaG5vbG9neSA9IHN1LmxhenlMb2FkZXIoJGNvbXBpbGVQcm92aWRlcixcbiAgICAgICAgICAgICAgICAgICdUZWNobm9sb2d5L3RlY2hub2xvZ3lDb21wb25lbnQuanMnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb3VudHJ5RmllbGRzID0gc3UubGF6eUxvYWRlcigkY29tcGlsZVByb3ZpZGVyLFxuICAgICAgICAgICAgICAgICAgJ0NvdW50cnlGaWVsZHMvY291bnRyeUZpZWxkc0NvbXBvbmVudC5qcycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpYWxvZ011bHRpU2VsZWN0aW9uID0gc3UubGF6eUxvYWRlcigkY29tcGlsZVByb3ZpZGVyLFxuICAgICAgICAgICAgICAgICAgJ0RpYWxvZ011bHRpU2VsZWN0b3IvZGlhbG9nTXVsdGlTZWxlY3RvckNvbXBvbmVudC5qcycpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtjb21wb25lbnQsIGludGVyb3BlcmFiaWxpdHksIGdlbmVyYWxPdmVydmlldywgbmF2aWdhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb25PdmVydmlldywgdGVjaG5vbG9neSwgY291bnRyeUZpZWxkcywgZGlhbG9nTXVsdGlTZWxlY3Rpb25dKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1c2VyOiBbJyRuZ1JlZHV4JywgKCRuZ1JlZHV4KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRuZ1JlZHV4LmRpc3BhdGNoKFByb2plY3RzTW9kdWxlLmxvYWRQcm9qZWN0U3RydWN0dXJlKCkpO1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSxcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBlZGl0TW9kZTogJ2RyYWZ0J1xuICAgICAgICB9LFxuICAgICAgICBwcm9maWxlUmVxdWlyZWQ6IHRydWVcbiAgICB9KVxuICAgICAgLnN0YXRlKCdlZGl0UHJvamVjdCcsIHtcbiAgICAgICAgICB1cmw6ICcvZWRpdC1wcm9qZWN0LzplZGl0TW9kZS8nLFxuICAgICAgICAgIHBhcmVudDogJ2FwcCcsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgIGVkaXRNb2RlOiAnZHJhZnQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICBtYWluOiB7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxwcm9qZWN0IGVkaXQtbW9kZT1cInRydWVcIiBsYXlvdXQtZmlsbCBsYXlvdXQ9XCJjb2x1bW5cIiA+PC9wcm9qZWN0PidcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAnY29tcG9uZW50cyc6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9ICBzdS5sYXp5TG9hZGVyKCRjb21waWxlUHJvdmlkZXIsICdwcm9qZWN0Q29tcG9uZW50Jyk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBpbnRlcm9wZXJhYmlsaXR5ID0gc3UubGF6eUxvYWRlcigkY29tcGlsZVByb3ZpZGVyLFxuICAgICAgICAgICAgICAgICAgJ0ludGVyb3BlcmFiaWxpdHkvaW50ZXJvcGVyYWJpbGl0eUNvbXBvbmVudC5qcycpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgZ2VuZXJhbE92ZXJ2aWV3ID0gc3UubGF6eUxvYWRlcigkY29tcGlsZVByb3ZpZGVyLFxuICAgICAgICAgICAgICAgICAgJ0dlbmVyYWxPdmVydmlldy9nZW5lcmFsT3ZlcnZpZXdDb21wb25lbnQuanMnKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdmlnYXRpb24gPSBzdS5sYXp5TG9hZGVyKCRjb21waWxlUHJvdmlkZXIsXG4gICAgICAgICAgICAgICAgICAnTmF2aWdhdGlvbi9uYXZpZ2F0aW9uQ29tcG9uZW50LmpzJyk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBpbXBsZW1lbnRhdGlvbk92ZXJ2aWV3ID0gc3UubGF6eUxvYWRlcigkY29tcGlsZVByb3ZpZGVyLFxuICAgICAgICAgICAgICAgICAgJ0ltcGxlbWVudGF0aW9uT3ZlcnZpZXcvaW1wbGVtZW50YXRpb25PdmVydmlld0NvbXBvbmVudC5qcycpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgdGVjaG5vbG9neSA9IHN1LmxhenlMb2FkZXIoJGNvbXBpbGVQcm92aWRlcixcbiAgICAgICAgICAgICAgICAgICdUZWNobm9sb2d5L3RlY2hub2xvZ3lDb21wb25lbnQuanMnKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50cnlGaWVsZHMgPSBzdS5sYXp5TG9hZGVyKCRjb21waWxlUHJvdmlkZXIsXG4gICAgICAgICAgICAgICAgICAnQ291bnRyeUZpZWxkcy9jb3VudHJ5RmllbGRzQ29tcG9uZW50LmpzJyk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBkaWFsb2dNdWx0aVNlbGVjdGlvbiA9IHN1LmxhenlMb2FkZXIoJGNvbXBpbGVQcm92aWRlcixcbiAgICAgICAgICAgICAgICAgICdEaWFsb2dNdWx0aVNlbGVjdG9yL2RpYWxvZ011bHRpU2VsZWN0b3JDb21wb25lbnQuanMnKTtcblxuICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtjb21wb25lbnQsIGludGVyb3BlcmFiaWxpdHksIGdlbmVyYWxPdmVydmlldywgbmF2aWdhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICBpbXBsZW1lbnRhdGlvbk92ZXJ2aWV3LCB0ZWNobm9sb2d5LCBjb3VudHJ5RmllbGRzLCBkaWFsb2dNdWx0aVNlbGVjdGlvbl0pO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB1c2VyOiBbJyRuZ1JlZHV4JywgKCRuZ1JlZHV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJG5nUmVkdXguZGlzcGF0Y2goUHJvamVjdHNNb2R1bGUubG9hZFByb2plY3RTdHJ1Y3R1cmUoKSk7XG4gICAgICAgICAgICAgIH1dXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwcm9maWxlUmVxdWlyZWQ6IHRydWVcbiAgICAgIH0pO1xufVxuXG5cbmNvbmZpZy4kaW5qZWN0ID0gWyckc3RhdGVQcm92aWRlcicsICckY29tcGlsZVByb3ZpZGVyJ107XG5cbmFuZ3VsYXIubW9kdWxlKG1vZHVsZU5hbWUsIFtdKVxuICAuY29uZmlnKGNvbmZpZyk7XG5cblxuZXhwb3J0IGRlZmF1bHQgbW9kdWxlTmFtZTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBOzs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUF2QkE7QUF5QkE7QUFDQTtBQURBO0FBR0E7QUFwQ0E7QUF1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQXZCQTtBQXlCQTtBQXBDQTtBQXNDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/Project/projectModule.js\n");

/***/ })

}]);