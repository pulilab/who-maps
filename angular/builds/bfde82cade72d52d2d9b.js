(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[606],{

/***/ "./src/MapsToolkit/MapsToolkitController.js":
/*!**************************************************!*\
  !*** ./src/MapsToolkit/MapsToolkitController.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _merge = __webpack_require__(/*! lodash/merge */ \"./node_modules/lodash/merge.js\");\n\nvar _merge2 = _interopRequireDefault(_merge);\n\nvar _forEach = __webpack_require__(/*! lodash/forEach */ \"./node_modules/lodash/forEach.js\");\n\nvar _forEach2 = _interopRequireDefault(_forEach);\n\nvar _cloneDeep = __webpack_require__(/*! lodash/cloneDeep */ \"./node_modules/lodash/cloneDeep.js\");\n\nvar _cloneDeep2 = _interopRequireDefault(_cloneDeep);\n\nvar _map = __webpack_require__(/*! lodash/map */ \"./node_modules/lodash/map.js\");\n\nvar _map2 = _interopRequireDefault(_map);\n\nvar _user = __webpack_require__(/*! ../store/modules/user */ \"./src/store/modules/user.js\");\n\nvar UserModule = _interopRequireWildcard(_user);\n\nvar _toolkit = __webpack_require__(/*! ../store/modules/toolkit */ \"./src/store/modules/toolkit.js\");\n\nvar ToolkitModule = _interopRequireWildcard(_toolkit);\n\nvar _projects = __webpack_require__(/*! ../store/modules/projects */ \"./src/store/modules/projects.js\");\n\nvar ProjectModule = _interopRequireWildcard(_projects);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar MapsToolkitController = function () {\n    function MapsToolkitController($scope, $state, $ngRedux, $sce) {\n        _classCallCheck(this, MapsToolkitController);\n\n        this.state = $state;\n        this.scope = $scope;\n        this.$sce = $sce;\n        this.$ngRedux = $ngRedux;\n        this.EE = window.EE;\n        this.$onInit = this.onInit.bind(this);\n        this.$onDestroy = this.onDestroy.bind(this);\n        this.mapData = this.mapData.bind(this);\n        this.watchers = this.watchers.bind(this);\n    }\n\n    _createClass(MapsToolkitController, [{\n        key: 'mapData',\n        value: function mapData(state) {\n            var rawData = ToolkitModule.getToolkitData(state);\n            return {\n                profile: UserModule.getProfile(state),\n                viewMode: ProjectModule.getCurrentProject(state).isViewer,\n                rawData: rawData,\n                domainStructure: ToolkitModule.getDomainStructure(state, this.state.params.axisId, this.state.params.domainId)\n            };\n        }\n    }, {\n        key: 'onInit',\n        value: function onInit() {\n            this.EE.on('mapsAxisChange', this.handleChangeAxis, this);\n            this.EE.on('mapsDomainChange', this.handleChangeDomain, this);\n            this.dataLoaded = false;\n            this.score = 0;\n            this.projectId = this.state.params.appName;\n            this.domainId = this.state.params.domainId;\n            this.axisId = this.state.params.axisId;\n            this.templates = this.importHtmlTemplates();\n            this.watchers();\n            this.unsubscribe = this.$ngRedux.connect(this.mapData, ToolkitModule)(this);\n        }\n    }, {\n        key: 'onDestroy',\n        value: function onDestroy() {\n            this.EE.removeListener('mapsAxisChange', this.handleChangeAxis, this);\n            this.EE.removeListener('mapsDomainChange', this.handleChangeDomain, this);\n            this.unsubscribe();\n        }\n    }, {\n        key: 'watchers',\n        value: function watchers() {\n            var _this = this;\n\n            this.scope.$watch(function (s) {\n                return s.vm.rawData;\n            }, function (rawData) {\n                _this.processAxesData((0, _cloneDeep2.default)(rawData), _this.state.params.axisId, _this.state.params.domainId);\n            }, true);\n        }\n    }, {\n        key: 'handleChangeAxis',\n        value: function handleChangeAxis(id) {\n            this.state.go(this.state.current.name, { 'axisId': id, 'domainId': 0 });\n        }\n    }, {\n        key: 'handleChangeDomain',\n        value: function handleChangeDomain(axisId, domainId) {\n            this.state.go(this.state.current.name, { axisId: axisId, domainId: domainId });\n        }\n    }, {\n        key: 'importHtmlTemplates',\n        value: function importHtmlTemplates() {\n            // Import the whole folder in an collection of string templates, needed for proper webpack optimizations\n            var templates = {};\n            var templateRequire = __webpack_require__(\"./src/MapsToolkit/Resource/template sync recursive \\\\.html$\");\n            templateRequire.keys().forEach(function (item) {\n                var key = item.split('.')[1].replace('/', '');\n                templates[key] = templateRequire(item);\n            });\n            return templates;\n        }\n    }, {\n        key: 'processAxesData',\n        value: function processAxesData(data, axisId, domainId) {\n            var _this2 = this;\n\n            if (data && data.length > 0 && axisId && domainId) {\n                this.axis = data[axisId];\n                this.domain = data[axisId].domains[domainId];\n                this.data = (0, _merge2.default)(this.domain, this.domainStructure);\n                this.score = 0;\n                (0, _forEach2.default)(this.data.questions, function (question, questionKey) {\n                    question.index = questionKey;\n                    question.answers = (0, _map2.default)(question.answers, function (value, index) {\n                        var template = null;\n                        if (question.answerTemplate && question.answerTemplate[index]) {\n                            template = _this2.$sce.trustAsHtml(_this2.templates[question.answerTemplate[index]]);\n                        }\n                        _this2.score += value === -1 ? 0 : value;\n                        return { index: index, value: value, template: template };\n                    });\n                });\n                this.dataLoaded = true;\n            }\n        }\n    }, {\n        key: 'calculateMainBoxSize',\n        value: function calculateMainBoxSize(question) {\n            if (question && question.choices) {\n                return 90 - 10 * question.choices.length;\n            }\n            return 40;\n        }\n    }, {\n        key: 'checkChecked',\n        value: function checkChecked(questionId, answerId, points) {\n            var answer = this.data.questions[questionId].answers[answerId];\n            return answer.value === points;\n        }\n    }, {\n        key: 'setAnswer',\n        value: function setAnswer(questionId, answerId, points) {\n            if (this.viewMode) {\n                return;\n            }\n            var answer = {\n                axis: this.axisId,\n                domain: this.domainId,\n                question: questionId,\n                answer: answerId,\n                value: points\n            };\n            this.saveAnswer(answer);\n        }\n    }, {\n        key: 'printAnswer',\n        value: function printAnswer(answer) {\n            if (answer !== null && answer.value === -1) {\n                return 0;\n            }\n            return answer.value;\n        }\n    }, {\n        key: 'backButtonDisabled',\n        value: function backButtonDisabled() {\n            return parseInt(this.domainId, 10) === 0 && parseInt(this.axisId, 10) === 0;\n        }\n    }, {\n        key: 'isLastDomainInAxis',\n        value: function isLastDomainInAxis() {\n            return parseInt(this.domainId, 10) >= this.rawData[this.axisId].domains.length - 1;\n        }\n    }, {\n        key: 'goToNextDomain',\n        value: function goToNextDomain() {\n            var nextDomain = parseInt(this.domainId, 10) + 1;\n            var nextAxis = parseInt(this.axisId, 10);\n            if (nextDomain >= this.rawData[this.axisId].domains.length) {\n                nextAxis += 1;\n                nextDomain = 0;\n            }\n            this.handleChangeDomain(nextAxis, nextDomain);\n        }\n    }, {\n        key: 'goToPrevDomain',\n        value: function goToPrevDomain() {\n            var prevDomain = parseInt(this.domainId, 10) - 1;\n            var prevAxis = parseInt(this.axisId, 10);\n            if (prevDomain <= 0) {\n                prevAxis -= 1;\n                prevDomain = this.rawData[prevAxis].domains.length - 1;\n            }\n\n            this.handleChangeDomain(prevAxis, prevDomain);\n        }\n    }, {\n        key: 'goToScorecard',\n        value: function goToScorecard() {\n            var axisId = this.axisId;\n            this.state.go(this.viewMode ? 'scorecard' : 'scorecard', { axisId: axisId });\n        }\n    }], [{\n        key: 'mapsControllerFactory',\n        value: function mapsControllerFactory() {\n            function mapsController($scope, $state, $ngRedux, $sce) {\n                return new MapsToolkitController($scope, $state, $ngRedux, $sce);\n            }\n\n            mapsController.$inject = ['$scope', '$state', '$ngRedux', '$sce'];\n\n            return mapsController;\n        }\n    }]);\n\n    return MapsToolkitController;\n}();\n\nexports.default = MapsToolkitController;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvTWFwc1Rvb2xraXRDb250cm9sbGVyLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9NYXBzVG9vbGtpdC9NYXBzVG9vbGtpdENvbnRyb2xsZXIuanM/OWI2OCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWVyZ2UgZnJvbSAnbG9kYXNoL21lcmdlJztcbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcbmltcG9ydCBjbG9uZURlZXAgZnJvbSAnbG9kYXNoL2Nsb25lRGVlcCc7XG5pbXBvcnQgbWFwIGZyb20gJ2xvZGFzaC9tYXAnO1xuXG5pbXBvcnQgKiBhcyBVc2VyTW9kdWxlIGZyb20gJy4uL3N0b3JlL21vZHVsZXMvdXNlcic7XG5pbXBvcnQgKiBhcyBUb29sa2l0TW9kdWxlIGZyb20gJy4uL3N0b3JlL21vZHVsZXMvdG9vbGtpdCc7XG5pbXBvcnQgKiBhcyBQcm9qZWN0TW9kdWxlIGZyb20gJy4uL3N0b3JlL21vZHVsZXMvcHJvamVjdHMnO1xuXG5cbmNsYXNzIE1hcHNUb29sa2l0Q29udHJvbGxlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcigkc2NvcGUsICRzdGF0ZSwgJG5nUmVkdXgsICRzY2UpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICRzdGF0ZTtcbiAgICAgICAgdGhpcy5zY29wZSA9ICRzY29wZTtcbiAgICAgICAgdGhpcy4kc2NlID0gJHNjZTtcbiAgICAgICAgdGhpcy4kbmdSZWR1eCA9ICRuZ1JlZHV4O1xuICAgICAgICB0aGlzLkVFID0gd2luZG93LkVFO1xuICAgICAgICB0aGlzLiRvbkluaXQgPSB0aGlzLm9uSW5pdC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSB0aGlzLm9uRGVzdHJveS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm1hcERhdGEgPSB0aGlzLm1hcERhdGEuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy53YXRjaGVycyA9IHRoaXMud2F0Y2hlcnMuYmluZCh0aGlzKTtcblxuICAgIH1cblxuICAgIG1hcERhdGEoc3RhdGUpIHtcbiAgICAgICAgY29uc3QgcmF3RGF0YSA9IFRvb2xraXRNb2R1bGUuZ2V0VG9vbGtpdERhdGEoc3RhdGUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvZmlsZTogVXNlck1vZHVsZS5nZXRQcm9maWxlKHN0YXRlKSxcbiAgICAgICAgICAgIHZpZXdNb2RlOiBQcm9qZWN0TW9kdWxlLmdldEN1cnJlbnRQcm9qZWN0KHN0YXRlKS5pc1ZpZXdlcixcbiAgICAgICAgICAgIHJhd0RhdGEsXG4gICAgICAgICAgICBkb21haW5TdHJ1Y3R1cmU6XG4gICAgICAgICAgICAgIFRvb2xraXRNb2R1bGUuZ2V0RG9tYWluU3RydWN0dXJlKHN0YXRlLCB0aGlzLnN0YXRlLnBhcmFtcy5heGlzSWQsIHRoaXMuc3RhdGUucGFyYW1zLmRvbWFpbklkKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIG9uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5FRS5vbignbWFwc0F4aXNDaGFuZ2UnLCB0aGlzLmhhbmRsZUNoYW5nZUF4aXMsIHRoaXMpO1xuICAgICAgICB0aGlzLkVFLm9uKCdtYXBzRG9tYWluQ2hhbmdlJywgdGhpcy5oYW5kbGVDaGFuZ2VEb21haW4sIHRoaXMpO1xuICAgICAgICB0aGlzLmRhdGFMb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMucHJvamVjdElkID0gdGhpcy5zdGF0ZS5wYXJhbXMuYXBwTmFtZTtcbiAgICAgICAgdGhpcy5kb21haW5JZCA9IHRoaXMuc3RhdGUucGFyYW1zLmRvbWFpbklkO1xuICAgICAgICB0aGlzLmF4aXNJZCA9IHRoaXMuc3RhdGUucGFyYW1zLmF4aXNJZDtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSB0aGlzLmltcG9ydEh0bWxUZW1wbGF0ZXMoKTtcbiAgICAgICAgdGhpcy53YXRjaGVycygpO1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlID0gdGhpcy4kbmdSZWR1eC5jb25uZWN0KHRoaXMubWFwRGF0YSwgVG9vbGtpdE1vZHVsZSkodGhpcyk7XG4gICAgfVxuXG4gICAgb25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLkVFLnJlbW92ZUxpc3RlbmVyKCdtYXBzQXhpc0NoYW5nZScsIHRoaXMuaGFuZGxlQ2hhbmdlQXhpcywgdGhpcyk7XG4gICAgICAgIHRoaXMuRUUucmVtb3ZlTGlzdGVuZXIoJ21hcHNEb21haW5DaGFuZ2UnLCB0aGlzLmhhbmRsZUNoYW5nZURvbWFpbiwgdGhpcyk7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICB3YXRjaGVycygpIHtcbiAgICAgICAgdGhpcy5zY29wZS4kd2F0Y2gocyA9PiBzLnZtLnJhd0RhdGEsXG4gICAgICAgICAgcmF3RGF0YSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0F4ZXNEYXRhKGNsb25lRGVlcChyYXdEYXRhKSwgdGhpcy5zdGF0ZS5wYXJhbXMuYXhpc0lkLCB0aGlzLnN0YXRlLnBhcmFtcy5kb21haW5JZCk7XG4gICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaGFuZGxlQ2hhbmdlQXhpcyhpZCkge1xuICAgICAgICB0aGlzLnN0YXRlLmdvKHRoaXMuc3RhdGUuY3VycmVudC5uYW1lLCB7ICdheGlzSWQnOiBpZCwgJ2RvbWFpbklkJzogMCB9KTtcbiAgICB9XG4gICAgaGFuZGxlQ2hhbmdlRG9tYWluKGF4aXNJZCwgZG9tYWluSWQpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5nbyh0aGlzLnN0YXRlLmN1cnJlbnQubmFtZSwgeyBheGlzSWQsIGRvbWFpbklkIH0pO1xuICAgIH1cblxuICAgIGltcG9ydEh0bWxUZW1wbGF0ZXMoKSB7XG4gICAgICAgIC8vIEltcG9ydCB0aGUgd2hvbGUgZm9sZGVyIGluIGFuIGNvbGxlY3Rpb24gb2Ygc3RyaW5nIHRlbXBsYXRlcywgbmVlZGVkIGZvciBwcm9wZXIgd2VicGFjayBvcHRpbWl6YXRpb25zXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlcyA9IHt9O1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZVJlcXVpcmUgPSByZXF1aXJlLmNvbnRleHQoJy4vUmVzb3VyY2UvdGVtcGxhdGUvJywgdHJ1ZSwgL1xcLmh0bWwkLyk7XG4gICAgICAgIHRlbXBsYXRlUmVxdWlyZS5rZXlzKCkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gaXRlbS5zcGxpdCgnLicpWzFdLnJlcGxhY2UoJy8nLCAnJyk7XG4gICAgICAgICAgICB0ZW1wbGF0ZXNba2V5XSA9IHRlbXBsYXRlUmVxdWlyZShpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZXM7XG4gICAgfVxuXG4gICAgcHJvY2Vzc0F4ZXNEYXRhKGRhdGEsIGF4aXNJZCwgZG9tYWluSWQpIHtcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwICYmIGF4aXNJZCAmJiBkb21haW5JZCkge1xuICAgICAgICAgICAgdGhpcy5heGlzID0gZGF0YVtheGlzSWRdO1xuICAgICAgICAgICAgdGhpcy5kb21haW4gPSBkYXRhW2F4aXNJZF0uZG9tYWluc1tkb21haW5JZF07XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBtZXJnZSh0aGlzLmRvbWFpbiwgdGhpcy5kb21haW5TdHJ1Y3R1cmUpO1xuICAgICAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgICAgICBmb3JFYWNoKHRoaXMuZGF0YS5xdWVzdGlvbnMsIChxdWVzdGlvbiwgcXVlc3Rpb25LZXkpID0+IHtcbiAgICAgICAgICAgICAgICBxdWVzdGlvbi5pbmRleCA9IHF1ZXN0aW9uS2V5O1xuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLmFuc3dlcnMgPSBtYXAocXVlc3Rpb24uYW5zd2VycywgKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb24uYW5zd2VyVGVtcGxhdGUgJiYgcXVlc3Rpb24uYW5zd2VyVGVtcGxhdGVbaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IHRoaXMuJHNjZS50cnVzdEFzSHRtbCh0aGlzLnRlbXBsYXRlc1txdWVzdGlvbi5hbnN3ZXJUZW1wbGF0ZVtpbmRleF1dKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3JlICs9IHZhbHVlID09PSAtMSA/IDAgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgaW5kZXgsIHZhbHVlLCB0ZW1wbGF0ZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmRhdGFMb2FkZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjYWxjdWxhdGVNYWluQm94U2l6ZShxdWVzdGlvbikge1xuICAgICAgICBpZiAocXVlc3Rpb24gJiYgcXVlc3Rpb24uY2hvaWNlcykge1xuICAgICAgICAgICAgcmV0dXJuIDkwIC0gMTAgKiBxdWVzdGlvbi5jaG9pY2VzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gNDA7XG4gICAgfVxuXG5cbiAgICBjaGVja0NoZWNrZWQocXVlc3Rpb25JZCwgYW5zd2VySWQsIHBvaW50cykge1xuICAgICAgICBjb25zdCBhbnN3ZXIgPSB0aGlzLmRhdGEucXVlc3Rpb25zW3F1ZXN0aW9uSWRdLmFuc3dlcnNbYW5zd2VySWRdO1xuICAgICAgICByZXR1cm4gYW5zd2VyLnZhbHVlID09PSBwb2ludHM7XG4gICAgfVxuXG4gICAgc2V0QW5zd2VyKHF1ZXN0aW9uSWQsIGFuc3dlcklkLCBwb2ludHMpIHtcbiAgICAgICAgaWYgKHRoaXMudmlld01vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhbnN3ZXIgPSB7XG4gICAgICAgICAgICBheGlzOiB0aGlzLmF4aXNJZCxcbiAgICAgICAgICAgIGRvbWFpbjogdGhpcy5kb21haW5JZCxcbiAgICAgICAgICAgIHF1ZXN0aW9uOiBxdWVzdGlvbklkLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXJJZCxcbiAgICAgICAgICAgIHZhbHVlOiBwb2ludHNcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zYXZlQW5zd2VyKGFuc3dlcik7XG4gICAgfVxuXG4gICAgcHJpbnRBbnN3ZXIoYW5zd2VyKSB7XG4gICAgICAgIGlmIChhbnN3ZXIgIT09IG51bGwgJiYgYW5zd2VyLnZhbHVlID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuc3dlci52YWx1ZTtcbiAgICB9XG5cbiAgICBiYWNrQnV0dG9uRGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmRvbWFpbklkLCAxMCkgPT09IDBcbiAgICAgICAgICAmJiBwYXJzZUludCh0aGlzLmF4aXNJZCwgMTApID09PSAwO1xuICAgIH1cblxuICAgIGlzTGFzdERvbWFpbkluQXhpcygpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuZG9tYWluSWQsIDEwKSA+PSB0aGlzLnJhd0RhdGFbdGhpcy5heGlzSWRdLmRvbWFpbnMubGVuZ3RoIC0gMTtcbiAgICB9XG5cbiAgICBnb1RvTmV4dERvbWFpbigpIHtcbiAgICAgICAgbGV0IG5leHREb21haW4gPSBwYXJzZUludCh0aGlzLmRvbWFpbklkLCAxMCkgKyAxO1xuICAgICAgICBsZXQgbmV4dEF4aXMgPSBwYXJzZUludCh0aGlzLmF4aXNJZCwgMTApO1xuICAgICAgICBpZiAobmV4dERvbWFpbiA+PSB0aGlzLnJhd0RhdGFbdGhpcy5heGlzSWRdLmRvbWFpbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBuZXh0QXhpcyArPSAxO1xuICAgICAgICAgICAgbmV4dERvbWFpbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oYW5kbGVDaGFuZ2VEb21haW4obmV4dEF4aXMsIG5leHREb21haW4pO1xuICAgIH1cblxuICAgIGdvVG9QcmV2RG9tYWluKCkge1xuICAgICAgICBsZXQgcHJldkRvbWFpbiA9IHBhcnNlSW50KHRoaXMuZG9tYWluSWQsIDEwKSAtIDE7XG4gICAgICAgIGxldCBwcmV2QXhpcyA9IHBhcnNlSW50KHRoaXMuYXhpc0lkLCAxMCk7XG4gICAgICAgIGlmIChwcmV2RG9tYWluIDw9IDApIHtcbiAgICAgICAgICAgIHByZXZBeGlzIC09IDE7XG4gICAgICAgICAgICBwcmV2RG9tYWluID0gdGhpcy5yYXdEYXRhW3ByZXZBeGlzXS5kb21haW5zLmxlbmd0aCAtIDE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmhhbmRsZUNoYW5nZURvbWFpbihwcmV2QXhpcywgcHJldkRvbWFpbik7XG4gICAgfVxuXG4gICAgZ29Ub1Njb3JlY2FyZCgpIHtcbiAgICAgICAgY29uc3QgYXhpc0lkID0gdGhpcy5heGlzSWQ7XG4gICAgICAgIHRoaXMuc3RhdGUuZ28odGhpcy52aWV3TW9kZSA/ICdzY29yZWNhcmQnIDogJ3Njb3JlY2FyZCcsIHsgYXhpc0lkIH0pO1xuICAgIH1cblxuXG4gICAgc3RhdGljIG1hcHNDb250cm9sbGVyRmFjdG9yeSgpIHtcbiAgICAgICAgZnVuY3Rpb24gbWFwc0NvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGUsICRuZ1JlZHV4LCAkc2NlKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hcHNUb29sa2l0Q29udHJvbGxlcigkc2NvcGUsICRzdGF0ZSwgJG5nUmVkdXgsICRzY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFwc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZScsICckbmdSZWR1eCcsICckc2NlJ107XG5cbiAgICAgICAgcmV0dXJuIG1hcHNDb250cm9sbGVyO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwc1Rvb2xraXRDb250cm9sbGVyO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTs7Ozs7OztBQUVBO0FBRUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU9BOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUVBOzs7QUFFQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQUdBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/MapsToolkitController.js\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template sync recursive \\.html$":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template sync \.html$ ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./1-1-1.html\": \"./src/MapsToolkit/Resource/template/1-1-1.html\",\n\t\"./1-1-2.html\": \"./src/MapsToolkit/Resource/template/1-1-2.html\",\n\t\"./1-1-3.html\": \"./src/MapsToolkit/Resource/template/1-1-3.html\",\n\t\"./1-2-1.html\": \"./src/MapsToolkit/Resource/template/1-2-1.html\",\n\t\"./10-1-1.html\": \"./src/MapsToolkit/Resource/template/10-1-1.html\",\n\t\"./10-1-2.html\": \"./src/MapsToolkit/Resource/template/10-1-2.html\",\n\t\"./10-1-3.html\": \"./src/MapsToolkit/Resource/template/10-1-3.html\",\n\t\"./10-1-4.html\": \"./src/MapsToolkit/Resource/template/10-1-4.html\",\n\t\"./10-2-1.html\": \"./src/MapsToolkit/Resource/template/10-2-1.html\",\n\t\"./10-2-2.html\": \"./src/MapsToolkit/Resource/template/10-2-2.html\",\n\t\"./10-2-3.html\": \"./src/MapsToolkit/Resource/template/10-2-3.html\",\n\t\"./10-3-1.html\": \"./src/MapsToolkit/Resource/template/10-3-1.html\",\n\t\"./10-3-2.html\": \"./src/MapsToolkit/Resource/template/10-3-2.html\",\n\t\"./11-1-1.html\": \"./src/MapsToolkit/Resource/template/11-1-1.html\",\n\t\"./11-1-2.html\": \"./src/MapsToolkit/Resource/template/11-1-2.html\",\n\t\"./11-1-3.html\": \"./src/MapsToolkit/Resource/template/11-1-3.html\",\n\t\"./11-1-4.html\": \"./src/MapsToolkit/Resource/template/11-1-4.html\",\n\t\"./11-1-5.html\": \"./src/MapsToolkit/Resource/template/11-1-5.html\",\n\t\"./11-1-6.html\": \"./src/MapsToolkit/Resource/template/11-1-6.html\",\n\t\"./11-1-7.html\": \"./src/MapsToolkit/Resource/template/11-1-7.html\",\n\t\"./11-2-1.html\": \"./src/MapsToolkit/Resource/template/11-2-1.html\",\n\t\"./11-2-2.html\": \"./src/MapsToolkit/Resource/template/11-2-2.html\",\n\t\"./11-2-3.html\": \"./src/MapsToolkit/Resource/template/11-2-3.html\",\n\t\"./11-2-4.html\": \"./src/MapsToolkit/Resource/template/11-2-4.html\",\n\t\"./12-1a-1.html\": \"./src/MapsToolkit/Resource/template/12-1a-1.html\",\n\t\"./12-1a-2.html\": \"./src/MapsToolkit/Resource/template/12-1a-2.html\",\n\t\"./12-1a-3.html\": \"./src/MapsToolkit/Resource/template/12-1a-3.html\",\n\t\"./12-1a-4.html\": \"./src/MapsToolkit/Resource/template/12-1a-4.html\",\n\t\"./12-1a-5.html\": \"./src/MapsToolkit/Resource/template/12-1a-5.html\",\n\t\"./12-1b-1.html\": \"./src/MapsToolkit/Resource/template/12-1b-1.html\",\n\t\"./12-1b-2.html\": \"./src/MapsToolkit/Resource/template/12-1b-2.html\",\n\t\"./12-1b-3.html\": \"./src/MapsToolkit/Resource/template/12-1b-3.html\",\n\t\"./12-1b-4.html\": \"./src/MapsToolkit/Resource/template/12-1b-4.html\",\n\t\"./12-2-1.html\": \"./src/MapsToolkit/Resource/template/12-2-1.html\",\n\t\"./12-2-2.html\": \"./src/MapsToolkit/Resource/template/12-2-2.html\",\n\t\"./12-2-3.html\": \"./src/MapsToolkit/Resource/template/12-2-3.html\",\n\t\"./12-3-1.html\": \"./src/MapsToolkit/Resource/template/12-3-1.html\",\n\t\"./12-3-2.html\": \"./src/MapsToolkit/Resource/template/12-3-2.html\",\n\t\"./12-3-3.html\": \"./src/MapsToolkit/Resource/template/12-3-3.html\",\n\t\"./13-1-1.html\": \"./src/MapsToolkit/Resource/template/13-1-1.html\",\n\t\"./13-1-2.html\": \"./src/MapsToolkit/Resource/template/13-1-2.html\",\n\t\"./13-1-3.html\": \"./src/MapsToolkit/Resource/template/13-1-3.html\",\n\t\"./13-2-1.html\": \"./src/MapsToolkit/Resource/template/13-2-1.html\",\n\t\"./13-2-2.html\": \"./src/MapsToolkit/Resource/template/13-2-2.html\",\n\t\"./14-1-1.html\": \"./src/MapsToolkit/Resource/template/14-1-1.html\",\n\t\"./14-1-2.html\": \"./src/MapsToolkit/Resource/template/14-1-2.html\",\n\t\"./14-1-3.html\": \"./src/MapsToolkit/Resource/template/14-1-3.html\",\n\t\"./14-2-1.html\": \"./src/MapsToolkit/Resource/template/14-2-1.html\",\n\t\"./14-2-2.html\": \"./src/MapsToolkit/Resource/template/14-2-2.html\",\n\t\"./14-2-3.html\": \"./src/MapsToolkit/Resource/template/14-2-3.html\",\n\t\"./15-1a-1.html\": \"./src/MapsToolkit/Resource/template/15-1a-1.html\",\n\t\"./15-1a-2.html\": \"./src/MapsToolkit/Resource/template/15-1a-2.html\",\n\t\"./15-1b-1.html\": \"./src/MapsToolkit/Resource/template/15-1b-1.html\",\n\t\"./15-1b-2.html\": \"./src/MapsToolkit/Resource/template/15-1b-2.html\",\n\t\"./15-1b-3.html\": \"./src/MapsToolkit/Resource/template/15-1b-3.html\",\n\t\"./15-2-1.html\": \"./src/MapsToolkit/Resource/template/15-2-1.html\",\n\t\"./15-2-2.html\": \"./src/MapsToolkit/Resource/template/15-2-2.html\",\n\t\"./15-2-3.html\": \"./src/MapsToolkit/Resource/template/15-2-3.html\",\n\t\"./15-2-4.html\": \"./src/MapsToolkit/Resource/template/15-2-4.html\",\n\t\"./16-1a-1.html\": \"./src/MapsToolkit/Resource/template/16-1a-1.html\",\n\t\"./16-1a-2.html\": \"./src/MapsToolkit/Resource/template/16-1a-2.html\",\n\t\"./16-1a-3.html\": \"./src/MapsToolkit/Resource/template/16-1a-3.html\",\n\t\"./16-1b-1.html\": \"./src/MapsToolkit/Resource/template/16-1b-1.html\",\n\t\"./16-1b-2.html\": \"./src/MapsToolkit/Resource/template/16-1b-2.html\",\n\t\"./16-1b-3.html\": \"./src/MapsToolkit/Resource/template/16-1b-3.html\",\n\t\"./16-1c-1.html\": \"./src/MapsToolkit/Resource/template/16-1c-1.html\",\n\t\"./16-1c-2.html\": \"./src/MapsToolkit/Resource/template/16-1c-2.html\",\n\t\"./16-2a-1.html\": \"./src/MapsToolkit/Resource/template/16-2a-1.html\",\n\t\"./16-2a-2.html\": \"./src/MapsToolkit/Resource/template/16-2a-2.html\",\n\t\"./16-2a-3.html\": \"./src/MapsToolkit/Resource/template/16-2a-3.html\",\n\t\"./16-2a-4.html\": \"./src/MapsToolkit/Resource/template/16-2a-4.html\",\n\t\"./16-2b-1.html\": \"./src/MapsToolkit/Resource/template/16-2b-1.html\",\n\t\"./16-2b-2.html\": \"./src/MapsToolkit/Resource/template/16-2b-2.html\",\n\t\"./16-2b-3.html\": \"./src/MapsToolkit/Resource/template/16-2b-3.html\",\n\t\"./16-2b-4.html\": \"./src/MapsToolkit/Resource/template/16-2b-4.html\",\n\t\"./16-2c-1.html\": \"./src/MapsToolkit/Resource/template/16-2c-1.html\",\n\t\"./16-2c-2.html\": \"./src/MapsToolkit/Resource/template/16-2c-2.html\",\n\t\"./16-2c-3.html\": \"./src/MapsToolkit/Resource/template/16-2c-3.html\",\n\t\"./16-2c-4.html\": \"./src/MapsToolkit/Resource/template/16-2c-4.html\",\n\t\"./16-2c-5.html\": \"./src/MapsToolkit/Resource/template/16-2c-5.html\",\n\t\"./16-3-1.html\": \"./src/MapsToolkit/Resource/template/16-3-1.html\",\n\t\"./16-3-2.html\": \"./src/MapsToolkit/Resource/template/16-3-2.html\",\n\t\"./2-1-1.html\": \"./src/MapsToolkit/Resource/template/2-1-1.html\",\n\t\"./2-1-2.html\": \"./src/MapsToolkit/Resource/template/2-1-2.html\",\n\t\"./2-1-3.html\": \"./src/MapsToolkit/Resource/template/2-1-3.html\",\n\t\"./2-2-1.html\": \"./src/MapsToolkit/Resource/template/2-2-1.html\",\n\t\"./2-2-2.html\": \"./src/MapsToolkit/Resource/template/2-2-2.html\",\n\t\"./2-2-3.html\": \"./src/MapsToolkit/Resource/template/2-2-3.html\",\n\t\"./2-2-4.html\": \"./src/MapsToolkit/Resource/template/2-2-4.html\",\n\t\"./2-3-1.html\": \"./src/MapsToolkit/Resource/template/2-3-1.html\",\n\t\"./2-3-2.html\": \"./src/MapsToolkit/Resource/template/2-3-2.html\",\n\t\"./2-3-3.html\": \"./src/MapsToolkit/Resource/template/2-3-3.html\",\n\t\"./2-3-4.html\": \"./src/MapsToolkit/Resource/template/2-3-4.html\",\n\t\"./3-1a-1.html\": \"./src/MapsToolkit/Resource/template/3-1a-1.html\",\n\t\"./3-1a-2.html\": \"./src/MapsToolkit/Resource/template/3-1a-2.html\",\n\t\"./3-1a-3.html\": \"./src/MapsToolkit/Resource/template/3-1a-3.html\",\n\t\"./3-1a-4.html\": \"./src/MapsToolkit/Resource/template/3-1a-4.html\",\n\t\"./3-1b-1.html\": \"./src/MapsToolkit/Resource/template/3-1b-1.html\",\n\t\"./3-1b-2.html\": \"./src/MapsToolkit/Resource/template/3-1b-2.html\",\n\t\"./3-2-1.html\": \"./src/MapsToolkit/Resource/template/3-2-1.html\",\n\t\"./3-2-2.html\": \"./src/MapsToolkit/Resource/template/3-2-2.html\",\n\t\"./3-2-3.html\": \"./src/MapsToolkit/Resource/template/3-2-3.html\",\n\t\"./3-2-4.html\": \"./src/MapsToolkit/Resource/template/3-2-4.html\",\n\t\"./3-2-5.html\": \"./src/MapsToolkit/Resource/template/3-2-5.html\",\n\t\"./3-2-6.html\": \"./src/MapsToolkit/Resource/template/3-2-6.html\",\n\t\"./4-1a-1.html\": \"./src/MapsToolkit/Resource/template/4-1a-1.html\",\n\t\"./4-1a-2.html\": \"./src/MapsToolkit/Resource/template/4-1a-2.html\",\n\t\"./4-1a-3.html\": \"./src/MapsToolkit/Resource/template/4-1a-3.html\",\n\t\"./4-1b-1.html\": \"./src/MapsToolkit/Resource/template/4-1b-1.html\",\n\t\"./4-1b-2.html\": \"./src/MapsToolkit/Resource/template/4-1b-2.html\",\n\t\"./4-1b-3.html\": \"./src/MapsToolkit/Resource/template/4-1b-3.html\",\n\t\"./4-1b-4.html\": \"./src/MapsToolkit/Resource/template/4-1b-4.html\",\n\t\"./4-1b-5.html\": \"./src/MapsToolkit/Resource/template/4-1b-5.html\",\n\t\"./4-1b-6.html\": \"./src/MapsToolkit/Resource/template/4-1b-6.html\",\n\t\"./4-1b-7.html\": \"./src/MapsToolkit/Resource/template/4-1b-7.html\",\n\t\"./4-1b-8.html\": \"./src/MapsToolkit/Resource/template/4-1b-8.html\",\n\t\"./4-1b-9.html\": \"./src/MapsToolkit/Resource/template/4-1b-9.html\",\n\t\"./4-2-1.html\": \"./src/MapsToolkit/Resource/template/4-2-1.html\",\n\t\"./4-2-2.html\": \"./src/MapsToolkit/Resource/template/4-2-2.html\",\n\t\"./4-2-3.html\": \"./src/MapsToolkit/Resource/template/4-2-3.html\",\n\t\"./4-2-4.html\": \"./src/MapsToolkit/Resource/template/4-2-4.html\",\n\t\"./5-1a-1.html\": \"./src/MapsToolkit/Resource/template/5-1a-1.html\",\n\t\"./5-1a-2.html\": \"./src/MapsToolkit/Resource/template/5-1a-2.html\",\n\t\"./5-1a-3.html\": \"./src/MapsToolkit/Resource/template/5-1a-3.html\",\n\t\"./5-1b-1.html\": \"./src/MapsToolkit/Resource/template/5-1b-1.html\",\n\t\"./5-1b-2.html\": \"./src/MapsToolkit/Resource/template/5-1b-2.html\",\n\t\"./5-1b-3.html\": \"./src/MapsToolkit/Resource/template/5-1b-3.html\",\n\t\"./5-1b-4.html\": \"./src/MapsToolkit/Resource/template/5-1b-4.html\",\n\t\"./5-1b-5.html\": \"./src/MapsToolkit/Resource/template/5-1b-5.html\",\n\t\"./5-1c-1.html\": \"./src/MapsToolkit/Resource/template/5-1c-1.html\",\n\t\"./5-1c-2.html\": \"./src/MapsToolkit/Resource/template/5-1c-2.html\",\n\t\"./5-1c-3.html\": \"./src/MapsToolkit/Resource/template/5-1c-3.html\",\n\t\"./5-1c-4.html\": \"./src/MapsToolkit/Resource/template/5-1c-4.html\",\n\t\"./5-1c-5.html\": \"./src/MapsToolkit/Resource/template/5-1c-5.html\",\n\t\"./5-2a-1.html\": \"./src/MapsToolkit/Resource/template/5-2a-1.html\",\n\t\"./5-2a-2.html\": \"./src/MapsToolkit/Resource/template/5-2a-2.html\",\n\t\"./5-2a-3.html\": \"./src/MapsToolkit/Resource/template/5-2a-3.html\",\n\t\"./5-2a-4.html\": \"./src/MapsToolkit/Resource/template/5-2a-4.html\",\n\t\"./5-2b-1.html\": \"./src/MapsToolkit/Resource/template/5-2b-1.html\",\n\t\"./5-2b-2.html\": \"./src/MapsToolkit/Resource/template/5-2b-2.html\",\n\t\"./5-2b-3.html\": \"./src/MapsToolkit/Resource/template/5-2b-3.html\",\n\t\"./6-1-1.html\": \"./src/MapsToolkit/Resource/template/6-1-1.html\",\n\t\"./6-1-2.html\": \"./src/MapsToolkit/Resource/template/6-1-2.html\",\n\t\"./6-1-3.html\": \"./src/MapsToolkit/Resource/template/6-1-3.html\",\n\t\"./6-1-4.html\": \"./src/MapsToolkit/Resource/template/6-1-4.html\",\n\t\"./6-1-5.html\": \"./src/MapsToolkit/Resource/template/6-1-5.html\",\n\t\"./6-1-6.html\": \"./src/MapsToolkit/Resource/template/6-1-6.html\",\n\t\"./6-2-1.html\": \"./src/MapsToolkit/Resource/template/6-2-1.html\",\n\t\"./6-2-2.html\": \"./src/MapsToolkit/Resource/template/6-2-2.html\",\n\t\"./6-3-1.html\": \"./src/MapsToolkit/Resource/template/6-3-1.html\",\n\t\"./6-3-2.html\": \"./src/MapsToolkit/Resource/template/6-3-2.html\",\n\t\"./6-3-3.html\": \"./src/MapsToolkit/Resource/template/6-3-3.html\",\n\t\"./6-4-1.html\": \"./src/MapsToolkit/Resource/template/6-4-1.html\",\n\t\"./6-4-2.html\": \"./src/MapsToolkit/Resource/template/6-4-2.html\",\n\t\"./6-4-3.html\": \"./src/MapsToolkit/Resource/template/6-4-3.html\",\n\t\"./6-4-4.html\": \"./src/MapsToolkit/Resource/template/6-4-4.html\",\n\t\"./7-1-1.html\": \"./src/MapsToolkit/Resource/template/7-1-1.html\",\n\t\"./7-1-2.html\": \"./src/MapsToolkit/Resource/template/7-1-2.html\",\n\t\"./7-1-3.html\": \"./src/MapsToolkit/Resource/template/7-1-3.html\",\n\t\"./7-1-4.html\": \"./src/MapsToolkit/Resource/template/7-1-4.html\",\n\t\"./7-2-1.html\": \"./src/MapsToolkit/Resource/template/7-2-1.html\",\n\t\"./7-2-2.html\": \"./src/MapsToolkit/Resource/template/7-2-2.html\",\n\t\"./7-2-3.html\": \"./src/MapsToolkit/Resource/template/7-2-3.html\",\n\t\"./7-2-4.html\": \"./src/MapsToolkit/Resource/template/7-2-4.html\",\n\t\"./7-3-1.html\": \"./src/MapsToolkit/Resource/template/7-3-1.html\",\n\t\"./7-3-2.html\": \"./src/MapsToolkit/Resource/template/7-3-2.html\",\n\t\"./7-3-3.html\": \"./src/MapsToolkit/Resource/template/7-3-3.html\",\n\t\"./7-3-4.html\": \"./src/MapsToolkit/Resource/template/7-3-4.html\",\n\t\"./8-1-1.html\": \"./src/MapsToolkit/Resource/template/8-1-1.html\",\n\t\"./8-1-2.html\": \"./src/MapsToolkit/Resource/template/8-1-2.html\",\n\t\"./8-1-3.html\": \"./src/MapsToolkit/Resource/template/8-1-3.html\",\n\t\"./8-2-1.html\": \"./src/MapsToolkit/Resource/template/8-2-1.html\",\n\t\"./8-2-2.html\": \"./src/MapsToolkit/Resource/template/8-2-2.html\",\n\t\"./8-2-3.html\": \"./src/MapsToolkit/Resource/template/8-2-3.html\",\n\t\"./8-2-4.html\": \"./src/MapsToolkit/Resource/template/8-2-4.html\",\n\t\"./8-2-5.html\": \"./src/MapsToolkit/Resource/template/8-2-5.html\",\n\t\"./8-2-6.html\": \"./src/MapsToolkit/Resource/template/8-2-6.html\",\n\t\"./8-3a-1.html\": \"./src/MapsToolkit/Resource/template/8-3a-1.html\",\n\t\"./8-3a-2.html\": \"./src/MapsToolkit/Resource/template/8-3a-2.html\",\n\t\"./8-3a-3.html\": \"./src/MapsToolkit/Resource/template/8-3a-3.html\",\n\t\"./8-3a-4.html\": \"./src/MapsToolkit/Resource/template/8-3a-4.html\",\n\t\"./8-3b-1.html\": \"./src/MapsToolkit/Resource/template/8-3b-1.html\",\n\t\"./8-3b-2.html\": \"./src/MapsToolkit/Resource/template/8-3b-2.html\",\n\t\"./9-1-1.html\": \"./src/MapsToolkit/Resource/template/9-1-1.html\",\n\t\"./9-1-2.html\": \"./src/MapsToolkit/Resource/template/9-1-2.html\",\n\t\"./9-1-3.html\": \"./src/MapsToolkit/Resource/template/9-1-3.html\",\n\t\"./9-2-1.html\": \"./src/MapsToolkit/Resource/template/9-2-1.html\",\n\t\"./9-2-2.html\": \"./src/MapsToolkit/Resource/template/9-2-2.html\",\n\t\"./9-2-3.html\": \"./src/MapsToolkit/Resource/template/9-2-3.html\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\tvar module = __webpack_require__(id);\n\treturn module;\n}\nfunction webpackContextResolve(req) {\n\tvar id = map[req];\n\tif(!(id + 1)) { // check for number or string\n\t\tvar e = new Error('Cannot find module \"' + req + '\".');\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn id;\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./src/MapsToolkit/Resource/template sync recursive \\\\.html$\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUgc3luYyByZWN1cnNpdmUgXFwuaHRtbCQuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUgc3luYyBcXC5odG1sJD9iNDU2Il0sInNvdXJjZXNDb250ZW50IjpbInZhciBtYXAgPSB7XG5cdFwiLi8xLTEtMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMS0xLTEuaHRtbFwiLFxuXHRcIi4vMS0xLTIuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEtMS0yLmh0bWxcIixcblx0XCIuLzEtMS0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xLTEtMy5odG1sXCIsXG5cdFwiLi8xLTItMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMS0yLTEuaHRtbFwiLFxuXHRcIi4vMTAtMS0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMC0xLTEuaHRtbFwiLFxuXHRcIi4vMTAtMS0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMC0xLTIuaHRtbFwiLFxuXHRcIi4vMTAtMS0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMC0xLTMuaHRtbFwiLFxuXHRcIi4vMTAtMS00Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMC0xLTQuaHRtbFwiLFxuXHRcIi4vMTAtMi0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMC0yLTEuaHRtbFwiLFxuXHRcIi4vMTAtMi0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMC0yLTIuaHRtbFwiLFxuXHRcIi4vMTAtMi0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMC0yLTMuaHRtbFwiLFxuXHRcIi4vMTAtMy0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMC0zLTEuaHRtbFwiLFxuXHRcIi4vMTAtMy0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMC0zLTIuaHRtbFwiLFxuXHRcIi4vMTEtMS0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMS0xLTEuaHRtbFwiLFxuXHRcIi4vMTEtMS0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMS0xLTIuaHRtbFwiLFxuXHRcIi4vMTEtMS0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMS0xLTMuaHRtbFwiLFxuXHRcIi4vMTEtMS00Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMS0xLTQuaHRtbFwiLFxuXHRcIi4vMTEtMS01Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMS0xLTUuaHRtbFwiLFxuXHRcIi4vMTEtMS02Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMS0xLTYuaHRtbFwiLFxuXHRcIi4vMTEtMS03Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMS0xLTcuaHRtbFwiLFxuXHRcIi4vMTEtMi0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMS0yLTEuaHRtbFwiLFxuXHRcIi4vMTEtMi0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMS0yLTIuaHRtbFwiLFxuXHRcIi4vMTEtMi0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMS0yLTMuaHRtbFwiLFxuXHRcIi4vMTEtMi00Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMS0yLTQuaHRtbFwiLFxuXHRcIi4vMTItMWEtMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMWEtMS5odG1sXCIsXG5cdFwiLi8xMi0xYS0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMi0xYS0yLmh0bWxcIixcblx0XCIuLzEyLTFhLTMuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEyLTFhLTMuaHRtbFwiLFxuXHRcIi4vMTItMWEtNC5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMWEtNC5odG1sXCIsXG5cdFwiLi8xMi0xYS01Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMi0xYS01Lmh0bWxcIixcblx0XCIuLzEyLTFiLTEuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEyLTFiLTEuaHRtbFwiLFxuXHRcIi4vMTItMWItMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMWItMi5odG1sXCIsXG5cdFwiLi8xMi0xYi0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMi0xYi0zLmh0bWxcIixcblx0XCIuLzEyLTFiLTQuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEyLTFiLTQuaHRtbFwiLFxuXHRcIi4vMTItMi0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMi0yLTEuaHRtbFwiLFxuXHRcIi4vMTItMi0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMi0yLTIuaHRtbFwiLFxuXHRcIi4vMTItMi0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMi0yLTMuaHRtbFwiLFxuXHRcIi4vMTItMy0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMi0zLTEuaHRtbFwiLFxuXHRcIi4vMTItMy0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMi0zLTIuaHRtbFwiLFxuXHRcIi4vMTItMy0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMi0zLTMuaHRtbFwiLFxuXHRcIi4vMTMtMS0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMy0xLTEuaHRtbFwiLFxuXHRcIi4vMTMtMS0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMy0xLTIuaHRtbFwiLFxuXHRcIi4vMTMtMS0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMy0xLTMuaHRtbFwiLFxuXHRcIi4vMTMtMi0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMy0yLTEuaHRtbFwiLFxuXHRcIi4vMTMtMi0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xMy0yLTIuaHRtbFwiLFxuXHRcIi4vMTQtMS0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNC0xLTEuaHRtbFwiLFxuXHRcIi4vMTQtMS0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNC0xLTIuaHRtbFwiLFxuXHRcIi4vMTQtMS0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNC0xLTMuaHRtbFwiLFxuXHRcIi4vMTQtMi0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNC0yLTEuaHRtbFwiLFxuXHRcIi4vMTQtMi0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNC0yLTIuaHRtbFwiLFxuXHRcIi4vMTQtMi0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNC0yLTMuaHRtbFwiLFxuXHRcIi4vMTUtMWEtMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMWEtMS5odG1sXCIsXG5cdFwiLi8xNS0xYS0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNS0xYS0yLmh0bWxcIixcblx0XCIuLzE1LTFiLTEuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE1LTFiLTEuaHRtbFwiLFxuXHRcIi4vMTUtMWItMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMWItMi5odG1sXCIsXG5cdFwiLi8xNS0xYi0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNS0xYi0zLmh0bWxcIixcblx0XCIuLzE1LTItMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMi0xLmh0bWxcIixcblx0XCIuLzE1LTItMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMi0yLmh0bWxcIixcblx0XCIuLzE1LTItMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMi0zLmh0bWxcIixcblx0XCIuLzE1LTItNC5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMi00Lmh0bWxcIixcblx0XCIuLzE2LTFhLTEuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTFhLTEuaHRtbFwiLFxuXHRcIi4vMTYtMWEtMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMWEtMi5odG1sXCIsXG5cdFwiLi8xNi0xYS0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNi0xYS0zLmh0bWxcIixcblx0XCIuLzE2LTFiLTEuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTFiLTEuaHRtbFwiLFxuXHRcIi4vMTYtMWItMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMWItMi5odG1sXCIsXG5cdFwiLi8xNi0xYi0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNi0xYi0zLmh0bWxcIixcblx0XCIuLzE2LTFjLTEuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTFjLTEuaHRtbFwiLFxuXHRcIi4vMTYtMWMtMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMWMtMi5odG1sXCIsXG5cdFwiLi8xNi0yYS0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNi0yYS0xLmh0bWxcIixcblx0XCIuLzE2LTJhLTIuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJhLTIuaHRtbFwiLFxuXHRcIi4vMTYtMmEtMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmEtMy5odG1sXCIsXG5cdFwiLi8xNi0yYS00Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNi0yYS00Lmh0bWxcIixcblx0XCIuLzE2LTJiLTEuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJiLTEuaHRtbFwiLFxuXHRcIi4vMTYtMmItMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmItMi5odG1sXCIsXG5cdFwiLi8xNi0yYi0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNi0yYi0zLmh0bWxcIixcblx0XCIuLzE2LTJiLTQuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJiLTQuaHRtbFwiLFxuXHRcIi4vMTYtMmMtMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmMtMS5odG1sXCIsXG5cdFwiLi8xNi0yYy0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNi0yYy0yLmh0bWxcIixcblx0XCIuLzE2LTJjLTMuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJjLTMuaHRtbFwiLFxuXHRcIi4vMTYtMmMtNC5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmMtNC5odG1sXCIsXG5cdFwiLi8xNi0yYy01Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xNi0yYy01Lmh0bWxcIixcblx0XCIuLzE2LTMtMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMy0xLmh0bWxcIixcblx0XCIuLzE2LTMtMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMy0yLmh0bWxcIixcblx0XCIuLzItMS0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTEtMS5odG1sXCIsXG5cdFwiLi8yLTEtMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0xLTIuaHRtbFwiLFxuXHRcIi4vMi0xLTMuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzItMS0zLmh0bWxcIixcblx0XCIuLzItMi0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTItMS5odG1sXCIsXG5cdFwiLi8yLTItMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0yLTIuaHRtbFwiLFxuXHRcIi4vMi0yLTMuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzItMi0zLmh0bWxcIixcblx0XCIuLzItMi00Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTItNC5odG1sXCIsXG5cdFwiLi8yLTMtMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0zLTEuaHRtbFwiLFxuXHRcIi4vMi0zLTIuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzItMy0yLmh0bWxcIixcblx0XCIuLzItMy0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTMtMy5odG1sXCIsXG5cdFwiLi8yLTMtNC5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0zLTQuaHRtbFwiLFxuXHRcIi4vMy0xYS0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTFhLTEuaHRtbFwiLFxuXHRcIi4vMy0xYS0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTFhLTIuaHRtbFwiLFxuXHRcIi4vMy0xYS0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTFhLTMuaHRtbFwiLFxuXHRcIi4vMy0xYS00Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTFhLTQuaHRtbFwiLFxuXHRcIi4vMy0xYi0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTFiLTEuaHRtbFwiLFxuXHRcIi4vMy0xYi0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTFiLTIuaHRtbFwiLFxuXHRcIi4vMy0yLTEuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzMtMi0xLmh0bWxcIixcblx0XCIuLzMtMi0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTItMi5odG1sXCIsXG5cdFwiLi8zLTItMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0yLTMuaHRtbFwiLFxuXHRcIi4vMy0yLTQuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzMtMi00Lmh0bWxcIixcblx0XCIuLzMtMi01Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTItNS5odG1sXCIsXG5cdFwiLi8zLTItNi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0yLTYuaHRtbFwiLFxuXHRcIi4vNC0xYS0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTFhLTEuaHRtbFwiLFxuXHRcIi4vNC0xYS0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTFhLTIuaHRtbFwiLFxuXHRcIi4vNC0xYS0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTFhLTMuaHRtbFwiLFxuXHRcIi4vNC0xYi0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTFiLTEuaHRtbFwiLFxuXHRcIi4vNC0xYi0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTFiLTIuaHRtbFwiLFxuXHRcIi4vNC0xYi0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTFiLTMuaHRtbFwiLFxuXHRcIi4vNC0xYi00Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTFiLTQuaHRtbFwiLFxuXHRcIi4vNC0xYi01Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTFiLTUuaHRtbFwiLFxuXHRcIi4vNC0xYi02Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTFiLTYuaHRtbFwiLFxuXHRcIi4vNC0xYi03Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTFiLTcuaHRtbFwiLFxuXHRcIi4vNC0xYi04Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTFiLTguaHRtbFwiLFxuXHRcIi4vNC0xYi05Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTFiLTkuaHRtbFwiLFxuXHRcIi4vNC0yLTEuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzQtMi0xLmh0bWxcIixcblx0XCIuLzQtMi0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTItMi5odG1sXCIsXG5cdFwiLi80LTItMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0yLTMuaHRtbFwiLFxuXHRcIi4vNC0yLTQuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzQtMi00Lmh0bWxcIixcblx0XCIuLzUtMWEtMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYS0xLmh0bWxcIixcblx0XCIuLzUtMWEtMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYS0yLmh0bWxcIixcblx0XCIuLzUtMWEtMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYS0zLmh0bWxcIixcblx0XCIuLzUtMWItMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi0xLmh0bWxcIixcblx0XCIuLzUtMWItMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi0yLmh0bWxcIixcblx0XCIuLzUtMWItMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi0zLmh0bWxcIixcblx0XCIuLzUtMWItNC5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi00Lmh0bWxcIixcblx0XCIuLzUtMWItNS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi01Lmh0bWxcIixcblx0XCIuLzUtMWMtMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy0xLmh0bWxcIixcblx0XCIuLzUtMWMtMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy0yLmh0bWxcIixcblx0XCIuLzUtMWMtMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy0zLmh0bWxcIixcblx0XCIuLzUtMWMtNC5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy00Lmh0bWxcIixcblx0XCIuLzUtMWMtNS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy01Lmh0bWxcIixcblx0XCIuLzUtMmEtMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYS0xLmh0bWxcIixcblx0XCIuLzUtMmEtMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYS0yLmh0bWxcIixcblx0XCIuLzUtMmEtMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYS0zLmh0bWxcIixcblx0XCIuLzUtMmEtNC5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYS00Lmh0bWxcIixcblx0XCIuLzUtMmItMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYi0xLmh0bWxcIixcblx0XCIuLzUtMmItMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYi0yLmh0bWxcIixcblx0XCIuLzUtMmItMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYi0zLmh0bWxcIixcblx0XCIuLzYtMS0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTEtMS5odG1sXCIsXG5cdFwiLi82LTEtMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0xLTIuaHRtbFwiLFxuXHRcIi4vNi0xLTMuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzYtMS0zLmh0bWxcIixcblx0XCIuLzYtMS00Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTEtNC5odG1sXCIsXG5cdFwiLi82LTEtNS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0xLTUuaHRtbFwiLFxuXHRcIi4vNi0xLTYuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzYtMS02Lmh0bWxcIixcblx0XCIuLzYtMi0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTItMS5odG1sXCIsXG5cdFwiLi82LTItMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0yLTIuaHRtbFwiLFxuXHRcIi4vNi0zLTEuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzYtMy0xLmh0bWxcIixcblx0XCIuLzYtMy0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTMtMi5odG1sXCIsXG5cdFwiLi82LTMtMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0zLTMuaHRtbFwiLFxuXHRcIi4vNi00LTEuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzYtNC0xLmh0bWxcIixcblx0XCIuLzYtNC0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTQtMi5odG1sXCIsXG5cdFwiLi82LTQtMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi00LTMuaHRtbFwiLFxuXHRcIi4vNi00LTQuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzYtNC00Lmh0bWxcIixcblx0XCIuLzctMS0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTEtMS5odG1sXCIsXG5cdFwiLi83LTEtMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0xLTIuaHRtbFwiLFxuXHRcIi4vNy0xLTMuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzctMS0zLmh0bWxcIixcblx0XCIuLzctMS00Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTEtNC5odG1sXCIsXG5cdFwiLi83LTItMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0yLTEuaHRtbFwiLFxuXHRcIi4vNy0yLTIuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzctMi0yLmh0bWxcIixcblx0XCIuLzctMi0zLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTItMy5odG1sXCIsXG5cdFwiLi83LTItNC5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0yLTQuaHRtbFwiLFxuXHRcIi4vNy0zLTEuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzctMy0xLmh0bWxcIixcblx0XCIuLzctMy0yLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTMtMi5odG1sXCIsXG5cdFwiLi83LTMtMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0zLTMuaHRtbFwiLFxuXHRcIi4vNy0zLTQuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzctMy00Lmh0bWxcIixcblx0XCIuLzgtMS0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS84LTEtMS5odG1sXCIsXG5cdFwiLi84LTEtMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0xLTIuaHRtbFwiLFxuXHRcIi4vOC0xLTMuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzgtMS0zLmh0bWxcIixcblx0XCIuLzgtMi0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS84LTItMS5odG1sXCIsXG5cdFwiLi84LTItMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0yLTIuaHRtbFwiLFxuXHRcIi4vOC0yLTMuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzgtMi0zLmh0bWxcIixcblx0XCIuLzgtMi00Lmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS84LTItNC5odG1sXCIsXG5cdFwiLi84LTItNS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0yLTUuaHRtbFwiLFxuXHRcIi4vOC0yLTYuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzgtMi02Lmh0bWxcIixcblx0XCIuLzgtM2EtMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYS0xLmh0bWxcIixcblx0XCIuLzgtM2EtMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYS0yLmh0bWxcIixcblx0XCIuLzgtM2EtMy5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYS0zLmh0bWxcIixcblx0XCIuLzgtM2EtNC5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYS00Lmh0bWxcIixcblx0XCIuLzgtM2ItMS5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYi0xLmh0bWxcIixcblx0XCIuLzgtM2ItMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYi0yLmh0bWxcIixcblx0XCIuLzktMS0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS85LTEtMS5odG1sXCIsXG5cdFwiLi85LTEtMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOS0xLTIuaHRtbFwiLFxuXHRcIi4vOS0xLTMuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzktMS0zLmh0bWxcIixcblx0XCIuLzktMi0xLmh0bWxcIjogXCIuL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS85LTItMS5odG1sXCIsXG5cdFwiLi85LTItMi5odG1sXCI6IFwiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOS0yLTIuaHRtbFwiLFxuXHRcIi4vOS0yLTMuaHRtbFwiOiBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzktMi0zLmh0bWxcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcblx0cmV0dXJuIG1vZHVsZTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0dmFyIGlkID0gbWFwW3JlcV07XG5cdGlmKCEoaWQgKyAxKSkgeyAvLyBjaGVjayBmb3IgbnVtYmVyIG9yIHN0cmluZ1xuXHRcdHZhciBlID0gbmV3IEVycm9yKCdDYW5ub3QgZmluZCBtb2R1bGUgXCInICsgcmVxICsgJ1wiLicpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBpZDtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlIHN5bmMgcmVjdXJzaXZlIFxcXFwuaHRtbCRcIjsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template sync recursive \\.html$\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/1-1-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/1-1-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    i) The health outcomes and the specific health interventions for which the mHealth product is targeted have been detailed. This may include health outcomes/priorities that occur at the following life stages (examples of specific outcomes or health interventions are given in brackets):*\\n  </translate>\\n</p>\\n\\n<ul>\\n  <li>\\n    <translate>\\n      Adolescence/before pregnancy (e.g. family planning, prevention of sexually transmitted infections)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Pregnancy (e.g. ANC, pregnancy complications)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Birth (e.g. transport, skilled attendance at birth)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Postpartum mother and postnatal newborn (e.g. postnatal care, newborn illnesses)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Maternal health and infancy/childhood (e.g. exclusive breastfeeding, routine immunizations, growth monitoring and nutrition).\\n    </translate>\\n  </li>\\n</ul>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMS0xLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xLTEtMS5odG1sPzFlYzEiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaSkgVGhlIGhlYWx0aCBvdXRjb21lcyBhbmQgdGhlIHNwZWNpZmljIGhlYWx0aCBpbnRlcnZlbnRpb25zIGZvciB3aGljaCB0aGUgbUhlYWx0aCBwcm9kdWN0IGlzIHRhcmdldGVkIGhhdmUgYmVlbiBkZXRhaWxlZC4gVGhpcyBtYXkgaW5jbHVkZSBoZWFsdGggb3V0Y29tZXMvcHJpb3JpdGllcyB0aGF0IG9jY3VyIGF0IHRoZSBmb2xsb3dpbmcgbGlmZSBzdGFnZXMgKGV4YW1wbGVzIG9mIHNwZWNpZmljIG91dGNvbWVzIG9yIGhlYWx0aCBpbnRlcnZlbnRpb25zIGFyZSBnaXZlbiBpbiBicmFja2V0cyk6KlxcbiAgPC90cmFuc2xhdGU+XFxuPC9wPlxcblxcbjx1bD5cXG4gIDxsaT5cXG4gICAgPHRyYW5zbGF0ZT5cXG4gICAgICBBZG9sZXNjZW5jZS9iZWZvcmUgcHJlZ25hbmN5IChlLmcuIGZhbWlseSBwbGFubmluZywgcHJldmVudGlvbiBvZiBzZXh1YWxseSB0cmFuc21pdHRlZCBpbmZlY3Rpb25zKVxcbiAgICA8L3RyYW5zbGF0ZT5cXG4gIDwvbGk+XFxuICA8bGk+XFxuICAgIDx0cmFuc2xhdGU+XFxuICAgICAgUHJlZ25hbmN5IChlLmcuIEFOQywgcHJlZ25hbmN5IGNvbXBsaWNhdGlvbnMpXFxuICAgIDwvdHJhbnNsYXRlPlxcbiAgPC9saT5cXG4gIDxsaT5cXG4gICAgPHRyYW5zbGF0ZT5cXG4gICAgICBCaXJ0aCAoZS5nLiB0cmFuc3BvcnQsIHNraWxsZWQgYXR0ZW5kYW5jZSBhdCBiaXJ0aClcXG4gICAgPC90cmFuc2xhdGU+XFxuICA8L2xpPlxcbiAgPGxpPlxcbiAgICA8dHJhbnNsYXRlPlxcbiAgICAgIFBvc3RwYXJ0dW0gbW90aGVyIGFuZCBwb3N0bmF0YWwgbmV3Ym9ybiAoZS5nLiBwb3N0bmF0YWwgY2FyZSwgbmV3Ym9ybiBpbGxuZXNzZXMpXFxuICAgIDwvdHJhbnNsYXRlPlxcbiAgPC9saT5cXG4gIDxsaT5cXG4gICAgPHRyYW5zbGF0ZT5cXG4gICAgICBNYXRlcm5hbCBoZWFsdGggYW5kIGluZmFuY3kvY2hpbGRob29kIChlLmcuIGV4Y2x1c2l2ZSBicmVhc3RmZWVkaW5nLCByb3V0aW5lIGltbXVuaXphdGlvbnMsIGdyb3d0aCBtb25pdG9yaW5nIGFuZCBudXRyaXRpb24pLlxcbiAgICA8L3RyYW5zbGF0ZT5cXG4gIDwvbGk+XFxuPC91bD5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/1-1-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/1-1-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/1-1-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    i) The health outcomes and the specific health interventions for which the mHealth product is targeted have been detailed. This may include health outcomes/priorities that occur at the following life stages (examples of specific outcomes or health interventions are given in brackets):*\\n  </translate>\\n</p>\\n\\n<ul>\\n  <li>\\n    <translate>\\n      Adolescence/before pregnancy (e.g. family planning, prevention of sexually transmitted infections)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Pregnancy (e.g. ANC, pregnancy complications)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Birth (e.g. transport, skilled attendance at birth)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Postpartum mother and postnatal newborn (e.g. postnatal care, newborn illnesses)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Maternal health and infancy/childhood (e.g. exclusive breastfeeding, routine immunizations, growth monitoring and nutrition).\\n    </translate>\\n  </li>\\n</ul>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMS0xLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xLTEtMi5odG1sPzMyZmMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaSkgVGhlIGhlYWx0aCBvdXRjb21lcyBhbmQgdGhlIHNwZWNpZmljIGhlYWx0aCBpbnRlcnZlbnRpb25zIGZvciB3aGljaCB0aGUgbUhlYWx0aCBwcm9kdWN0IGlzIHRhcmdldGVkIGhhdmUgYmVlbiBkZXRhaWxlZC4gVGhpcyBtYXkgaW5jbHVkZSBoZWFsdGggb3V0Y29tZXMvcHJpb3JpdGllcyB0aGF0IG9jY3VyIGF0IHRoZSBmb2xsb3dpbmcgbGlmZSBzdGFnZXMgKGV4YW1wbGVzIG9mIHNwZWNpZmljIG91dGNvbWVzIG9yIGhlYWx0aCBpbnRlcnZlbnRpb25zIGFyZSBnaXZlbiBpbiBicmFja2V0cyk6KlxcbiAgPC90cmFuc2xhdGU+XFxuPC9wPlxcblxcbjx1bD5cXG4gIDxsaT5cXG4gICAgPHRyYW5zbGF0ZT5cXG4gICAgICBBZG9sZXNjZW5jZS9iZWZvcmUgcHJlZ25hbmN5IChlLmcuIGZhbWlseSBwbGFubmluZywgcHJldmVudGlvbiBvZiBzZXh1YWxseSB0cmFuc21pdHRlZCBpbmZlY3Rpb25zKVxcbiAgICA8L3RyYW5zbGF0ZT5cXG4gIDwvbGk+XFxuICA8bGk+XFxuICAgIDx0cmFuc2xhdGU+XFxuICAgICAgUHJlZ25hbmN5IChlLmcuIEFOQywgcHJlZ25hbmN5IGNvbXBsaWNhdGlvbnMpXFxuICAgIDwvdHJhbnNsYXRlPlxcbiAgPC9saT5cXG4gIDxsaT5cXG4gICAgPHRyYW5zbGF0ZT5cXG4gICAgICBCaXJ0aCAoZS5nLiB0cmFuc3BvcnQsIHNraWxsZWQgYXR0ZW5kYW5jZSBhdCBiaXJ0aClcXG4gICAgPC90cmFuc2xhdGU+XFxuICA8L2xpPlxcbiAgPGxpPlxcbiAgICA8dHJhbnNsYXRlPlxcbiAgICAgIFBvc3RwYXJ0dW0gbW90aGVyIGFuZCBwb3N0bmF0YWwgbmV3Ym9ybiAoZS5nLiBwb3N0bmF0YWwgY2FyZSwgbmV3Ym9ybiBpbGxuZXNzZXMpXFxuICAgIDwvdHJhbnNsYXRlPlxcbiAgPC9saT5cXG4gIDxsaT5cXG4gICAgPHRyYW5zbGF0ZT5cXG4gICAgICBNYXRlcm5hbCBoZWFsdGggYW5kIGluZmFuY3kvY2hpbGRob29kIChlLmcuIGV4Y2x1c2l2ZSBicmVhc3RmZWVkaW5nLCByb3V0aW5lIGltbXVuaXphdGlvbnMsIGdyb3d0aCBtb25pdG9yaW5nIGFuZCBudXRyaXRpb24pLlxcbiAgICA8L3RyYW5zbGF0ZT5cXG4gIDwvbGk+XFxuPC91bD5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/1-1-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/1-1-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/1-1-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    i) The health outcomes and the specific health interventions for which the mHealth product is targeted have been detailed. This may include health outcomes/priorities that occur at the following life stages (examples of specific outcomes or health interventions are given in brackets):*\\n  </translate>\\n</p>\\n\\n<ul>\\n  <li>\\n    <translate>\\n      Adolescence/before pregnancy (e.g. family planning, prevention of sexually transmitted infections)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Pregnancy (e.g. ANC, pregnancy complications)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Birth (e.g. transport, skilled attendance at birth)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Postpartum mother and postnatal newborn (e.g. postnatal care, newborn illnesses)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Maternal health and infancy/childhood (e.g. exclusive breastfeeding, routine immunizations, growth monitoring and nutrition).\\n    </translate>\\n  </li>\\n</ul>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMS0xLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xLTEtMy5odG1sPzA5MWIiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaSkgVGhlIGhlYWx0aCBvdXRjb21lcyBhbmQgdGhlIHNwZWNpZmljIGhlYWx0aCBpbnRlcnZlbnRpb25zIGZvciB3aGljaCB0aGUgbUhlYWx0aCBwcm9kdWN0IGlzIHRhcmdldGVkIGhhdmUgYmVlbiBkZXRhaWxlZC4gVGhpcyBtYXkgaW5jbHVkZSBoZWFsdGggb3V0Y29tZXMvcHJpb3JpdGllcyB0aGF0IG9jY3VyIGF0IHRoZSBmb2xsb3dpbmcgbGlmZSBzdGFnZXMgKGV4YW1wbGVzIG9mIHNwZWNpZmljIG91dGNvbWVzIG9yIGhlYWx0aCBpbnRlcnZlbnRpb25zIGFyZSBnaXZlbiBpbiBicmFja2V0cyk6KlxcbiAgPC90cmFuc2xhdGU+XFxuPC9wPlxcblxcbjx1bD5cXG4gIDxsaT5cXG4gICAgPHRyYW5zbGF0ZT5cXG4gICAgICBBZG9sZXNjZW5jZS9iZWZvcmUgcHJlZ25hbmN5IChlLmcuIGZhbWlseSBwbGFubmluZywgcHJldmVudGlvbiBvZiBzZXh1YWxseSB0cmFuc21pdHRlZCBpbmZlY3Rpb25zKVxcbiAgICA8L3RyYW5zbGF0ZT5cXG4gIDwvbGk+XFxuICA8bGk+XFxuICAgIDx0cmFuc2xhdGU+XFxuICAgICAgUHJlZ25hbmN5IChlLmcuIEFOQywgcHJlZ25hbmN5IGNvbXBsaWNhdGlvbnMpXFxuICAgIDwvdHJhbnNsYXRlPlxcbiAgPC9saT5cXG4gIDxsaT5cXG4gICAgPHRyYW5zbGF0ZT5cXG4gICAgICBCaXJ0aCAoZS5nLiB0cmFuc3BvcnQsIHNraWxsZWQgYXR0ZW5kYW5jZSBhdCBiaXJ0aClcXG4gICAgPC90cmFuc2xhdGU+XFxuICA8L2xpPlxcbiAgPGxpPlxcbiAgICA8dHJhbnNsYXRlPlxcbiAgICAgIFBvc3RwYXJ0dW0gbW90aGVyIGFuZCBwb3N0bmF0YWwgbmV3Ym9ybiAoZS5nLiBwb3N0bmF0YWwgY2FyZSwgbmV3Ym9ybiBpbGxuZXNzZXMpXFxuICAgIDwvdHJhbnNsYXRlPlxcbiAgPC9saT5cXG4gIDxsaT5cXG4gICAgPHRyYW5zbGF0ZT5cXG4gICAgICBNYXRlcm5hbCBoZWFsdGggYW5kIGluZmFuY3kvY2hpbGRob29kIChlLmcuIGV4Y2x1c2l2ZSBicmVhc3RmZWVkaW5nLCByb3V0aW5lIGltbXVuaXphdGlvbnMsIGdyb3d0aCBtb25pdG9yaW5nIGFuZCBudXRyaXRpb24pLlxcbiAgICA8L3RyYW5zbGF0ZT5cXG4gIDwvbGk+XFxuPC91bD5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/1-1-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/1-2-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/1-2-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    i) The health outcomes and the specific health interventions for which the mHealth product is targeted have been detailed. This may include health outcomes/priorities that occur at the following life stages (examples of specific outcomes or health interventions are given in brackets):*\\n  </translate>\\n</p>\\n\\n<ul>\\n  <li>\\n    <translate>\\n      Adolescence/before pregnancy (e.g. family planning, prevention of sexually transmitted infections)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Pregnancy (e.g. ANC, pregnancy complications)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Birth (e.g. transport, skilled attendance at birth)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Postpartum mother and postnatal newborn (e.g. postnatal care, newborn illnesses)\\n    </translate>\\n  </li>\\n  <li>\\n    <translate>\\n      Maternal health and infancy/childhood (e.g. exclusive breastfeeding, routine immunizations, growth monitoring and nutrition).\\n    </translate>\\n  </li>\\n</ul>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMS0yLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8xLTItMS5odG1sPzlmZTIiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaSkgVGhlIGhlYWx0aCBvdXRjb21lcyBhbmQgdGhlIHNwZWNpZmljIGhlYWx0aCBpbnRlcnZlbnRpb25zIGZvciB3aGljaCB0aGUgbUhlYWx0aCBwcm9kdWN0IGlzIHRhcmdldGVkIGhhdmUgYmVlbiBkZXRhaWxlZC4gVGhpcyBtYXkgaW5jbHVkZSBoZWFsdGggb3V0Y29tZXMvcHJpb3JpdGllcyB0aGF0IG9jY3VyIGF0IHRoZSBmb2xsb3dpbmcgbGlmZSBzdGFnZXMgKGV4YW1wbGVzIG9mIHNwZWNpZmljIG91dGNvbWVzIG9yIGhlYWx0aCBpbnRlcnZlbnRpb25zIGFyZSBnaXZlbiBpbiBicmFja2V0cyk6KlxcbiAgPC90cmFuc2xhdGU+XFxuPC9wPlxcblxcbjx1bD5cXG4gIDxsaT5cXG4gICAgPHRyYW5zbGF0ZT5cXG4gICAgICBBZG9sZXNjZW5jZS9iZWZvcmUgcHJlZ25hbmN5IChlLmcuIGZhbWlseSBwbGFubmluZywgcHJldmVudGlvbiBvZiBzZXh1YWxseSB0cmFuc21pdHRlZCBpbmZlY3Rpb25zKVxcbiAgICA8L3RyYW5zbGF0ZT5cXG4gIDwvbGk+XFxuICA8bGk+XFxuICAgIDx0cmFuc2xhdGU+XFxuICAgICAgUHJlZ25hbmN5IChlLmcuIEFOQywgcHJlZ25hbmN5IGNvbXBsaWNhdGlvbnMpXFxuICAgIDwvdHJhbnNsYXRlPlxcbiAgPC9saT5cXG4gIDxsaT5cXG4gICAgPHRyYW5zbGF0ZT5cXG4gICAgICBCaXJ0aCAoZS5nLiB0cmFuc3BvcnQsIHNraWxsZWQgYXR0ZW5kYW5jZSBhdCBiaXJ0aClcXG4gICAgPC90cmFuc2xhdGU+XFxuICA8L2xpPlxcbiAgPGxpPlxcbiAgICA8dHJhbnNsYXRlPlxcbiAgICAgIFBvc3RwYXJ0dW0gbW90aGVyIGFuZCBwb3N0bmF0YWwgbmV3Ym9ybiAoZS5nLiBwb3N0bmF0YWwgY2FyZSwgbmV3Ym9ybiBpbGxuZXNzZXMpXFxuICAgIDwvdHJhbnNsYXRlPlxcbiAgPC9saT5cXG4gIDxsaT5cXG4gICAgPHRyYW5zbGF0ZT5cXG4gICAgICBNYXRlcm5hbCBoZWFsdGggYW5kIGluZmFuY3kvY2hpbGRob29kIChlLmcuIGV4Y2x1c2l2ZSBicmVhc3RmZWVkaW5nLCByb3V0aW5lIGltbXVuaXphdGlvbnMsIGdyb3d0aCBtb25pdG9yaW5nIGFuZCBudXRyaXRpb24pLlxcbiAgICA8L3RyYW5zbGF0ZT5cXG4gIDwvbGk+XFxuPC91bD5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/1-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/10-1-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/10-1-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Processes for updating and replicating the application with new user groups have been defined\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMS0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMS0xLmh0bWw/NDJkNyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBQcm9jZXNzZXMgZm9yIHVwZGF0aW5nIGFuZCByZXBsaWNhdGluZyB0aGUgYXBwbGljYXRpb24gd2l0aCBuZXcgdXNlciBncm91cHMgaGF2ZSBiZWVuIGRlZmluZWRcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/10-1-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/10-1-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/10-1-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Processes for adapting the application so it may address new health domains have been defined\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMS0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMS0yLmh0bWw/MmUxYyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgUHJvY2Vzc2VzIGZvciBhZGFwdGluZyB0aGUgYXBwbGljYXRpb24gc28gaXQgbWF5IGFkZHJlc3MgbmV3IGhlYWx0aCBkb21haW5zIGhhdmUgYmVlbiBkZWZpbmVkXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/10-1-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/10-1-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/10-1-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Documentation for guiding the adaptation of technology is available\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMS0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMS0zLmh0bWw/YzY5YSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIERvY3VtZW50YXRpb24gZm9yIGd1aWRpbmcgdGhlIGFkYXB0YXRpb24gb2YgdGVjaG5vbG9neSBpcyBhdmFpbGFibGVcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/10-1-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/10-1-4.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/10-1-4.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) The application can be modified by locally available developers\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMS00Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMS00Lmh0bWw/ZjU4NyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpdikgVGhlIGFwcGxpY2F0aW9uIGNhbiBiZSBtb2RpZmllZCBieSBsb2NhbGx5IGF2YWlsYWJsZSBkZXZlbG9wZXJzXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/10-1-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/10-2-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/10-2-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Processes for translating the content into a new language have been defined\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMi0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMi0xLmh0bWw/ZDRmZiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBQcm9jZXNzZXMgZm9yIHRyYW5zbGF0aW5nIHRoZSBjb250ZW50IGludG8gYSBuZXcgbGFuZ3VhZ2UgaGF2ZSBiZWVuIGRlZmluZWRcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/10-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/10-2-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/10-2-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Processes for making the content accessible to illiterate users have been defined\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMi0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMi0yLmh0bWw/YTZhNCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgUHJvY2Vzc2VzIGZvciBtYWtpbmcgdGhlIGNvbnRlbnQgYWNjZXNzaWJsZSB0byBpbGxpdGVyYXRlIHVzZXJzIGhhdmUgYmVlbiBkZWZpbmVkXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/10-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/10-2-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/10-2-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Processes for modifying the content based on a new cultural context have been defined\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMi0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMi0zLmh0bWw/M2Q0MiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIFByb2Nlc3NlcyBmb3IgbW9kaWZ5aW5nIHRoZSBjb250ZW50IGJhc2VkIG9uIGEgbmV3IGN1bHR1cmFsIGNvbnRleHQgaGF2ZSBiZWVuIGRlZmluZWRcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/10-2-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/10-3-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/10-3-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) The application can run on different types of mobile devices (e.g. basic phone, feature phone, smartphone, personal data assistant [PDA], tablet)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMy0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMy0xLmh0bWw/MjFmZiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBUaGUgYXBwbGljYXRpb24gY2FuIHJ1biBvbiBkaWZmZXJlbnQgdHlwZXMgb2YgbW9iaWxlIGRldmljZXMgKGUuZy4gYmFzaWMgcGhvbmUsIGZlYXR1cmUgcGhvbmUsIHNtYXJ0cGhvbmUsIHBlcnNvbmFsIGRhdGEgYXNzaXN0YW50IFtQREFdLCB0YWJsZXQpXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/10-3-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/10-3-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/10-3-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) The application is compatible with different types of operating systems (e.g. Android, Windows phone, iOS, Java)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMy0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTAtMy0yLmh0bWw/NGNkYiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgVGhlIGFwcGxpY2F0aW9uIGlzIGNvbXBhdGlibGUgd2l0aCBkaWZmZXJlbnQgdHlwZXMgb2Ygb3BlcmF0aW5nIHN5c3RlbXMgKGUuZy4gQW5kcm9pZCwgV2luZG93cyBwaG9uZSwgaU9TLCBKYXZhKVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/10-3-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/11-1-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/11-1-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Future personnel needs have been projected based on the scope-goals of scaling up\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS0xLmh0bWw/M2QzOSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBGdXR1cmUgcGVyc29ubmVsIG5lZWRzIGhhdmUgYmVlbiBwcm9qZWN0ZWQgYmFzZWQgb24gdGhlIHNjb3BlLWdvYWxzIG9mIHNjYWxpbmcgdXBcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/11-1-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/11-1-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/11-1-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) The job descriptions of existing project team members have been restructured or adjusted to meet the needs of scaling up\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS0yLmh0bWw/NjViMiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgVGhlIGpvYiBkZXNjcmlwdGlvbnMgb2YgZXhpc3RpbmcgcHJvamVjdCB0ZWFtIG1lbWJlcnMgaGF2ZSBiZWVuIHJlc3RydWN0dXJlZCBvciBhZGp1c3RlZCB0byBtZWV0IHRoZSBuZWVkcyBvZiBzY2FsaW5nIHVwXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/11-1-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/11-1-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/11-1-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Mechanisms for expanding human resource capacity have been developed, as needed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS0zLmh0bWw/MDgxNyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIE1lY2hhbmlzbXMgZm9yIGV4cGFuZGluZyBodW1hbiByZXNvdXJjZSBjYXBhY2l0eSBoYXZlIGJlZW4gZGV2ZWxvcGVkLCBhcyBuZWVkZWRcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/11-1-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/11-1-4.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/11-1-4.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) The roles and responsibilities of all project team members have been defined and communicated for scaling up\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS00Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS00Lmh0bWw/YjBkMSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpdikgVGhlIHJvbGVzIGFuZCByZXNwb25zaWJpbGl0aWVzIG9mIGFsbCBwcm9qZWN0IHRlYW0gbWVtYmVycyBoYXZlIGJlZW4gZGVmaW5lZCBhbmQgY29tbXVuaWNhdGVkIGZvciBzY2FsaW5nIHVwXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/11-1-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/11-1-5.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/11-1-5.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    v) Strategies for project team member retention have been developed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS01Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS01Lmh0bWw/YzFjMyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICB2KSBTdHJhdGVnaWVzIGZvciBwcm9qZWN0IHRlYW0gbWVtYmVyIHJldGVudGlvbiBoYXZlIGJlZW4gZGV2ZWxvcGVkXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/11-1-5.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/11-1-6.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/11-1-6.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    vi) Mechanisms are in place to maintain institutional knowledge in light of project team member turnover\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS02Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS02Lmh0bWw/M2YzNSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICB2aSkgTWVjaGFuaXNtcyBhcmUgaW4gcGxhY2UgdG8gbWFpbnRhaW4gaW5zdGl0dXRpb25hbCBrbm93bGVkZ2UgaW4gbGlnaHQgb2YgcHJvamVjdCB0ZWFtIG1lbWJlciB0dXJub3ZlclxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/11-1-6.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/11-1-7.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/11-1-7.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    vii) New policies have been created to respond to estimated changes in workload and salary structures while scaling up\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS03Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMS03Lmh0bWw/MmY3ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICB2aWkpIE5ldyBwb2xpY2llcyBoYXZlIGJlZW4gY3JlYXRlZCB0byByZXNwb25kIHRvIGVzdGltYXRlZCBjaGFuZ2VzIGluIHdvcmtsb2FkIGFuZCBzYWxhcnkgc3RydWN0dXJlcyB3aGlsZSBzY2FsaW5nIHVwXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/11-1-7.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/11-2-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/11-2-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) An advisor/director to provide strategic oversight has been appointed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMi0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMi0xLmh0bWw/MDJhNiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBBbiBhZHZpc29yL2RpcmVjdG9yIHRvIHByb3ZpZGUgc3RyYXRlZ2ljIG92ZXJzaWdodCBoYXMgYmVlbiBhcHBvaW50ZWRcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/11-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/11-2-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/11-2-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) A manager for supporting organizational and personnel needs has been appointed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMi0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMi0yLmh0bWw/NDA0MiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgQSBtYW5hZ2VyIGZvciBzdXBwb3J0aW5nIG9yZ2FuaXphdGlvbmFsIGFuZCBwZXJzb25uZWwgbmVlZHMgaGFzIGJlZW4gYXBwb2ludGVkXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/11-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/11-2-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/11-2-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) A systems administrator for managing the technology has been appointed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMi0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMi0zLmh0bWw/NGFlNiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIEEgc3lzdGVtcyBhZG1pbmlzdHJhdG9yIGZvciBtYW5hZ2luZyB0aGUgdGVjaG5vbG9neSBoYXMgYmVlbiBhcHBvaW50ZWRcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/11-2-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/11-2-4.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/11-2-4.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) A financial manager for tracking costs and expenditures has been appointed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMi00Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTEtMi00Lmh0bWw/YmVlNSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpdikgQSBmaW5hbmNpYWwgbWFuYWdlciBmb3IgdHJhY2tpbmcgY29zdHMgYW5kIGV4cGVuZGl0dXJlcyBoYXMgYmVlbiBhcHBvaW50ZWRcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/11-2-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-1a-1.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-1a-1.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Initial training is in place for end-users of the application (e.g. health workers using the product, and clients)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMWEtMS5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEyLTFhLTEuaHRtbD9jNjNjIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGkpIEluaXRpYWwgdHJhaW5pbmcgaXMgaW4gcGxhY2UgZm9yIGVuZC11c2VycyBvZiB0aGUgYXBwbGljYXRpb24gKGUuZy4gaGVhbHRoIHdvcmtlcnMgdXNpbmcgdGhlIHByb2R1Y3QsIGFuZCBjbGllbnRzKVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-1a-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-1a-2.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-1a-2.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Operational guides (e.g. standard operating procedures [SOPs], job aid) with instructions for managing the application is available and accessible to all project team members\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMWEtMi5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEyLTFhLTIuaHRtbD9lNGRlIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpKSBPcGVyYXRpb25hbCBndWlkZXMgKGUuZy4gc3RhbmRhcmQgb3BlcmF0aW5nIHByb2NlZHVyZXMgW1NPUHNdLCBqb2IgYWlkKSB3aXRoIGluc3RydWN0aW9ucyBmb3IgbWFuYWdpbmcgdGhlIGFwcGxpY2F0aW9uIGlzIGF2YWlsYWJsZSBhbmQgYWNjZXNzaWJsZSB0byBhbGwgcHJvamVjdCB0ZWFtIG1lbWJlcnNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-1a-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-1a-3.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-1a-3.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Refresher training for end-users of the application is in place\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMWEtMy5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEyLTFhLTMuaHRtbD9lNDQwIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpaSkgUmVmcmVzaGVyIHRyYWluaW5nIGZvciBlbmQtdXNlcnMgb2YgdGhlIGFwcGxpY2F0aW9uIGlzIGluIHBsYWNlXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-1a-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-1a-4.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-1a-4.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) Training for secondary users (e.g. district-level managers and supervisors) is in place\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMWEtNC5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEyLTFhLTQuaHRtbD9mNDZmIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGl2KSBUcmFpbmluZyBmb3Igc2Vjb25kYXJ5IHVzZXJzIChlLmcuIGRpc3RyaWN0LWxldmVsIG1hbmFnZXJzIGFuZCBzdXBlcnZpc29ycykgaXMgaW4gcGxhY2VcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-1a-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-1a-5.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-1a-5.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    v) The resources required for conducting the training are available\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMWEtNS5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEyLTFhLTUuaHRtbD80NjUzIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIHYpIFRoZSByZXNvdXJjZXMgcmVxdWlyZWQgZm9yIGNvbmR1Y3RpbmcgdGhlIHRyYWluaW5nIGFyZSBhdmFpbGFibGVcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-1a-5.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-1b-1.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-1b-1.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) The training programme has taken account of users’ literacy and relevant content knowledge\\r\\n  </translate>\\r\\n\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMWItMS5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEyLTFiLTEuaHRtbD9kNGU3Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGkpIFRoZSB0cmFpbmluZyBwcm9ncmFtbWUgaGFzIHRha2VuIGFjY291bnQgb2YgdXNlcnPigJkgbGl0ZXJhY3kgYW5kIHJlbGV2YW50IGNvbnRlbnQga25vd2xlZGdlXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-1b-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-1b-2.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-1b-2.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) An appropriate delivery mechanism for training (e.g. internal versus external training; training-of-trainers) based on needs and project resources has been established\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMWItMi5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEyLTFiLTIuaHRtbD9mYWVlIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpKSBBbiBhcHByb3ByaWF0ZSBkZWxpdmVyeSBtZWNoYW5pc20gZm9yIHRyYWluaW5nIChlLmcuIGludGVybmFsIHZlcnN1cyBleHRlcm5hbCB0cmFpbmluZzsgdHJhaW5pbmctb2YtdHJhaW5lcnMpIGJhc2VkIG9uIG5lZWRzIGFuZCBwcm9qZWN0IHJlc291cmNlcyBoYXMgYmVlbiBlc3RhYmxpc2hlZFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-1b-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-1b-3.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-1b-3.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Training curriculum and/or other tools to ensure capacity for end-users are available\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMWItMy5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEyLTFiLTMuaHRtbD9iYjU4Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpaSkgVHJhaW5pbmcgY3VycmljdWx1bSBhbmQvb3Igb3RoZXIgdG9vbHMgdG8gZW5zdXJlIGNhcGFjaXR5IGZvciBlbmQtdXNlcnMgYXJlIGF2YWlsYWJsZVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-1b-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-1b-4.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-1b-4.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) Mechanisms are in place for quality assurance of the training programme (e.g. checkpoints for competency and certification)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMWItNC5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzEyLTFiLTQuaHRtbD80ODQ5Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGl2KSBNZWNoYW5pc21zIGFyZSBpbiBwbGFjZSBmb3IgcXVhbGl0eSBhc3N1cmFuY2Ugb2YgdGhlIHRyYWluaW5nIHByb2dyYW1tZSAoZS5nLiBjaGVja3BvaW50cyBmb3IgY29tcGV0ZW5jeSBhbmQgY2VydGlmaWNhdGlvbilcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-1b-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-2-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-2-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) An organizational structure for providing supportive field supervision and monitoring of end-users’ activities is in place\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMi0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMi0xLmh0bWw/ZmI2MSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBBbiBvcmdhbml6YXRpb25hbCBzdHJ1Y3R1cmUgZm9yIHByb3ZpZGluZyBzdXBwb3J0aXZlIGZpZWxkIHN1cGVydmlzaW9uIGFuZCBtb25pdG9yaW5nIG9mIGVuZC11c2Vyc+KAmSBhY3Rpdml0aWVzIGlzIGluIHBsYWNlXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-2-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-2-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Required resources have been allocated for routine field supervision or monitoring end-users’ interactions with the system\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMi0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMi0yLmh0bWw/Zjk5OSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgUmVxdWlyZWQgcmVzb3VyY2VzIGhhdmUgYmVlbiBhbGxvY2F0ZWQgZm9yIHJvdXRpbmUgZmllbGQgc3VwZXJ2aXNpb24gb3IgbW9uaXRvcmluZyBlbmQtdXNlcnPigJkgaW50ZXJhY3Rpb25zIHdpdGggdGhlIHN5c3RlbVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-2-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-2-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) End-users have been trained on how to get their questions and problems addressed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMi0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMi0zLmh0bWw/ZjRlNSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIEVuZC11c2VycyBoYXZlIGJlZW4gdHJhaW5lZCBvbiBob3cgdG8gZ2V0IHRoZWlyIHF1ZXN0aW9ucyBhbmQgcHJvYmxlbXMgYWRkcmVzc2VkXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-2-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-3-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-3-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) A local first-line technical support team has been identified and trained appropriately to provide troubleshooting\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMy0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMy0xLmh0bWw/MGQxZiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBBIGxvY2FsIGZpcnN0LWxpbmUgdGVjaG5pY2FsIHN1cHBvcnQgdGVhbSBoYXMgYmVlbiBpZGVudGlmaWVkIGFuZCB0cmFpbmVkIGFwcHJvcHJpYXRlbHkgdG8gcHJvdmlkZSB0cm91Ymxlc2hvb3RpbmdcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-3-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-3-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-3-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) There is a procedure in place to connect the local technical support team to a higher level of support when needed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMy0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMy0yLmh0bWw/ZmFlNCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgVGhlcmUgaXMgYSBwcm9jZWR1cmUgaW4gcGxhY2UgdG8gY29ubmVjdCB0aGUgbG9jYWwgdGVjaG5pY2FsIHN1cHBvcnQgdGVhbSB0byBhIGhpZ2hlciBsZXZlbCBvZiBzdXBwb3J0IHdoZW4gbmVlZGVkXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-3-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/12-3-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/12-3-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) There are strategies in place for providing user support through peer assistance (e.g. having champions within the health workforce cadre)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMy0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTItMy0zLmh0bWw/YjgyNyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIFRoZXJlIGFyZSBzdHJhdGVnaWVzIGluIHBsYWNlIGZvciBwcm92aWRpbmcgdXNlciBzdXBwb3J0IHRocm91Z2ggcGVlciBhc3Npc3RhbmNlIChlLmcuIGhhdmluZyBjaGFtcGlvbnMgd2l0aGluIHRoZSBoZWFsdGggd29ya2ZvcmNlIGNhZHJlKVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/12-3-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/13-1-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/13-1-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Orientation for implementing partners (e.g. NGOs, CBOs) that will be involved directly in the scaling-up implementation has been established\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTMtMS0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTMtMS0xLmh0bWw/NThlYiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBPcmllbnRhdGlvbiBmb3IgaW1wbGVtZW50aW5nIHBhcnRuZXJzIChlLmcuIE5HT3MsIENCT3MpIHRoYXQgd2lsbCBiZSBpbnZvbHZlZCBkaXJlY3RseSBpbiB0aGUgc2NhbGluZy11cCBpbXBsZW1lbnRhdGlvbiBoYXMgYmVlbiBlc3RhYmxpc2hlZFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/13-1-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/13-1-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/13-1-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Orientation for government representatives has been established through meetings, workshops or other face-to-face mechanisms\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTMtMS0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTMtMS0yLmh0bWw/ZTBlZiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgT3JpZW50YXRpb24gZm9yIGdvdmVybm1lbnQgcmVwcmVzZW50YXRpdmVzIGhhcyBiZWVuIGVzdGFibGlzaGVkIHRocm91Z2ggbWVldGluZ3MsIHdvcmtzaG9wcyBvciBvdGhlciBmYWNlLXRvLWZhY2UgbWVjaGFuaXNtc1xcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/13-1-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/13-1-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/13-1-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Efforts to engage with local community leaders and/or community council members have been made in order to obtain approval for introducing the mHealth product\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTMtMS0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTMtMS0zLmh0bWw/OGZiNiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIEVmZm9ydHMgdG8gZW5nYWdlIHdpdGggbG9jYWwgY29tbXVuaXR5IGxlYWRlcnMgYW5kL29yIGNvbW11bml0eSBjb3VuY2lsIG1lbWJlcnMgaGF2ZSBiZWVuIG1hZGUgaW4gb3JkZXIgdG8gb2J0YWluIGFwcHJvdmFsIGZvciBpbnRyb2R1Y2luZyB0aGUgbUhlYWx0aCBwcm9kdWN0XFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/13-1-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/13-2-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/13-2-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Efforts to spread awareness of the mHealth product and its value have been made\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTMtMi0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTMtMi0xLmh0bWw/Mzg5NCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBFZmZvcnRzIHRvIHNwcmVhZCBhd2FyZW5lc3Mgb2YgdGhlIG1IZWFsdGggcHJvZHVjdCBhbmQgaXRzIHZhbHVlIGhhdmUgYmVlbiBtYWRlXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/13-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/13-2-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/13-2-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) The community has been encouraged to provide their feedback on concerns and issues related to the mHealth product through specific feedback events\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTMtMi0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTMtMi0yLmh0bWw/NTk3ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgVGhlIGNvbW11bml0eSBoYXMgYmVlbiBlbmNvdXJhZ2VkIHRvIHByb3ZpZGUgdGhlaXIgZmVlZGJhY2sgb24gY29uY2VybnMgYW5kIGlzc3VlcyByZWxhdGVkIHRvIHRoZSBtSGVhbHRoIHByb2R1Y3QgdGhyb3VnaCBzcGVjaWZpYyBmZWVkYmFjayBldmVudHNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/13-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/14-1-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/14-1-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Procedures for addressing lack of/inconsistencies in connectivity have been established (e.g. provision of several SIM cards so health workers can use different networks when necessary)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTQtMS0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTQtMS0xLmh0bWw/ZmMxNCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBQcm9jZWR1cmVzIGZvciBhZGRyZXNzaW5nIGxhY2sgb2YvaW5jb25zaXN0ZW5jaWVzIGluIGNvbm5lY3Rpdml0eSBoYXZlIGJlZW4gZXN0YWJsaXNoZWQgKGUuZy4gcHJvdmlzaW9uIG9mIHNldmVyYWwgU0lNIGNhcmRzIHNvIGhlYWx0aCB3b3JrZXJzIGNhbiB1c2UgZGlmZmVyZW50IG5ldHdvcmtzIHdoZW4gbmVjZXNzYXJ5KVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/14-1-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/14-1-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/14-1-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Procedures for addressing lack of/inconsistencies in electricity have been established (e.g. provision of solar chargers, setting up charging stations in communities)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTQtMS0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTQtMS0yLmh0bWw/NGM4NSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgUHJvY2VkdXJlcyBmb3IgYWRkcmVzc2luZyBsYWNrIG9mL2luY29uc2lzdGVuY2llcyBpbiBlbGVjdHJpY2l0eSBoYXZlIGJlZW4gZXN0YWJsaXNoZWQgKGUuZy4gcHJvdmlzaW9uIG9mIHNvbGFyIGNoYXJnZXJzLCBzZXR0aW5nIHVwIGNoYXJnaW5nIHN0YXRpb25zIGluIGNvbW11bml0aWVzKVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/14-1-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/14-1-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/14-1-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Information regarding these strategies is included within the standard operating procedures (SOPs)/job aids provided to end-users and secondary users\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTQtMS0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTQtMS0zLmh0bWw/OTdiZCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIEluZm9ybWF0aW9uIHJlZ2FyZGluZyB0aGVzZSBzdHJhdGVnaWVzIGlzIGluY2x1ZGVkIHdpdGhpbiB0aGUgc3RhbmRhcmQgb3BlcmF0aW5nIHByb2NlZHVyZXMgKFNPUHMpL2pvYiBhaWRzIHByb3ZpZGVkIHRvIGVuZC11c2VycyBhbmQgc2Vjb25kYXJ5IHVzZXJzXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/14-1-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/14-2-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/14-2-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Procedures for preventing loss/theft of mobile devices have been developed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTQtMi0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTQtMi0xLmh0bWw/Y2YxMyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBQcm9jZWR1cmVzIGZvciBwcmV2ZW50aW5nIGxvc3MvdGhlZnQgb2YgbW9iaWxlIGRldmljZXMgaGF2ZSBiZWVuIGRldmVsb3BlZFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/14-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/14-2-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/14-2-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Policies (and contracts, if appropriate) for replacing lost or damaged mobile devices have been developed and vetted with appropriate stakeholders\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTQtMi0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTQtMi0yLmh0bWw/NDI1OSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgUG9saWNpZXMgKGFuZCBjb250cmFjdHMsIGlmIGFwcHJvcHJpYXRlKSBmb3IgcmVwbGFjaW5nIGxvc3Qgb3IgZGFtYWdlZCBtb2JpbGUgZGV2aWNlcyBoYXZlIGJlZW4gZGV2ZWxvcGVkIGFuZCB2ZXR0ZWQgd2l0aCBhcHByb3ByaWF0ZSBzdGFrZWhvbGRlcnNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/14-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/14-2-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/14-2-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Methods for preventing the misuse of mobile devices are in place (e.g. preventing specific weblinks or application usage)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTQtMi0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTQtMi0zLmh0bWw/NmE0MyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIE1ldGhvZHMgZm9yIHByZXZlbnRpbmcgdGhlIG1pc3VzZSBvZiBtb2JpbGUgZGV2aWNlcyBhcmUgaW4gcGxhY2UgKGUuZy4gcHJldmVudGluZyBzcGVjaWZpYyB3ZWJsaW5rcyBvciBhcHBsaWNhdGlvbiB1c2FnZSlcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/14-2-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/15-1a-1.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/15-1a-1.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Sufficient funds are earmarked and applied to general monitoring activities (e.g. 10% of the project budget)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMWEtMS5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE1LTFhLTEuaHRtbD9mMjcxIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGkpIFN1ZmZpY2llbnQgZnVuZHMgYXJlIGVhcm1hcmtlZCBhbmQgYXBwbGllZCB0byBnZW5lcmFsIG1vbml0b3JpbmcgYWN0aXZpdGllcyAoZS5nLiAxMCUgb2YgdGhlIHByb2plY3QgYnVkZ2V0KVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/15-1a-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/15-1a-2.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/15-1a-2.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Appropriate internal staff have been identified to manage and support monitoring activities\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMWEtMi5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE1LTFhLTIuaHRtbD8yNjdhIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpKSBBcHByb3ByaWF0ZSBpbnRlcm5hbCBzdGFmZiBoYXZlIGJlZW4gaWRlbnRpZmllZCB0byBtYW5hZ2UgYW5kIHN1cHBvcnQgbW9uaXRvcmluZyBhY3Rpdml0aWVzXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/15-1a-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/15-1b-1.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/15-1b-1.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) A Performance Monitoring Plan (PMP) or the equivalent, which defines data collection procedures and intervals, has been developed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMWItMS5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE1LTFiLTEuaHRtbD83NDU1Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGkpIEEgUGVyZm9ybWFuY2UgTW9uaXRvcmluZyBQbGFuIChQTVApIG9yIHRoZSBlcXVpdmFsZW50LCB3aGljaCBkZWZpbmVzIGRhdGEgY29sbGVjdGlvbiBwcm9jZWR1cmVzIGFuZCBpbnRlcnZhbHMsIGhhcyBiZWVuIGRldmVsb3BlZFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/15-1b-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/15-1b-2.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/15-1b-2.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Performance indicators and information sources have been defined\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMWItMi5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE1LTFiLTIuaHRtbD9kODVjIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpKSBQZXJmb3JtYW5jZSBpbmRpY2F0b3JzIGFuZCBpbmZvcm1hdGlvbiBzb3VyY2VzIGhhdmUgYmVlbiBkZWZpbmVkXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/15-1b-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/15-1b-3.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/15-1b-3.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Appropriate instruments for measuring the indicators have been identified\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMWItMy5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE1LTFiLTMuaHRtbD85NTJhIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpaSkgQXBwcm9wcmlhdGUgaW5zdHJ1bWVudHMgZm9yIG1lYXN1cmluZyB0aGUgaW5kaWNhdG9ycyBoYXZlIGJlZW4gaWRlbnRpZmllZFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/15-1b-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/15-2-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/15-2-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Processes for regular analysis and interpretation of monitoring data have been defined (including frequency of meetings, who will participate, etc.)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMi0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMi0xLmh0bWw/NjQ1OCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBQcm9jZXNzZXMgZm9yIHJlZ3VsYXIgYW5hbHlzaXMgYW5kIGludGVycHJldGF0aW9uIG9mIG1vbml0b3JpbmcgZGF0YSBoYXZlIGJlZW4gZGVmaW5lZCAoaW5jbHVkaW5nIGZyZXF1ZW5jeSBvZiBtZWV0aW5ncywgd2hvIHdpbGwgcGFydGljaXBhdGUsIGV0Yy4pXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/15-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/15-2-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/15-2-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Dashboards and scorecards are in place to track implementation progress of the system\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMi0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMi0yLmh0bWw/MDNiMCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgRGFzaGJvYXJkcyBhbmQgc2NvcmVjYXJkcyBhcmUgaW4gcGxhY2UgdG8gdHJhY2sgaW1wbGVtZW50YXRpb24gcHJvZ3Jlc3Mgb2YgdGhlIHN5c3RlbVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/15-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/15-2-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/15-2-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Processes for collecting user feedback and addressing implementation-related challenges have been developed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMi0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMi0zLmh0bWw/NjEzYSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIFByb2Nlc3NlcyBmb3IgY29sbGVjdGluZyB1c2VyIGZlZWRiYWNrIGFuZCBhZGRyZXNzaW5nIGltcGxlbWVudGF0aW9uLXJlbGF0ZWQgY2hhbGxlbmdlcyBoYXZlIGJlZW4gZGV2ZWxvcGVkXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/15-2-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/15-2-4.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/15-2-4.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) Protocol for making course corrections for implementation activities based on monitoring data is in place\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMi00Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTUtMi00Lmh0bWw/Njc5NiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpdikgUHJvdG9jb2wgZm9yIG1ha2luZyBjb3Vyc2UgY29ycmVjdGlvbnMgZm9yIGltcGxlbWVudGF0aW9uIGFjdGl2aXRpZXMgYmFzZWQgb24gbW9uaXRvcmluZyBkYXRhIGlzIGluIHBsYWNlXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/15-2-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-1a-1.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-1a-1.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Sufficient funds are available for designing and conducting rigorous studies of the outcomes of scaling up the product\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMWEtMS5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTFhLTEuaHRtbD9lNGI0Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGkpIFN1ZmZpY2llbnQgZnVuZHMgYXJlIGF2YWlsYWJsZSBmb3IgZGVzaWduaW5nIGFuZCBjb25kdWN0aW5nIHJpZ29yb3VzIHN0dWRpZXMgb2YgdGhlIG91dGNvbWVzIG9mIHNjYWxpbmcgdXAgdGhlIHByb2R1Y3RcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-1a-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-1a-2.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-1a-2.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Appropriate internal staff have been identified for managing and supporting evaluation activities\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMWEtMi5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTFhLTIuaHRtbD8yZTc5Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpKSBBcHByb3ByaWF0ZSBpbnRlcm5hbCBzdGFmZiBoYXZlIGJlZW4gaWRlbnRpZmllZCBmb3IgbWFuYWdpbmcgYW5kIHN1cHBvcnRpbmcgZXZhbHVhdGlvbiBhY3Rpdml0aWVzXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-1a-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-1a-3.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-1a-3.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) External organization(s) have been recruited to assist with evaluation research, as needed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMWEtMy5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTFhLTMuaHRtbD9iNzk0Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpaSkgRXh0ZXJuYWwgb3JnYW5pemF0aW9uKHMpIGhhdmUgYmVlbiByZWNydWl0ZWQgdG8gYXNzaXN0IHdpdGggZXZhbHVhdGlvbiByZXNlYXJjaCwgYXMgbmVlZGVkXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-1a-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-1b-1.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-1b-1.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) The specific evidence priorities and reporting needs of each key stakeholder can be articulated\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMWItMS5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTFiLTEuaHRtbD8zMzE0Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGkpIFRoZSBzcGVjaWZpYyBldmlkZW5jZSBwcmlvcml0aWVzIGFuZCByZXBvcnRpbmcgbmVlZHMgb2YgZWFjaCBrZXkgc3Rha2Vob2xkZXIgY2FuIGJlIGFydGljdWxhdGVkXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-1b-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-1b-2.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-1b-2.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) A framework (e.g. theory of change, logical framework) describing the links among the product’s inputs, activities, outputs and outcomes, and impacts has been developed\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMWItMi5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTFiLTIuaHRtbD81NzJkIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpKSBBIGZyYW1ld29yayAoZS5nLiB0aGVvcnkgb2YgY2hhbmdlLCBsb2dpY2FsIGZyYW1ld29yaykgZGVzY3JpYmluZyB0aGUgbGlua3MgYW1vbmcgdGhlIHByb2R1Y3TigJlzIGlucHV0cywgYWN0aXZpdGllcywgb3V0cHV0cyBhbmQgb3V0Y29tZXMsIGFuZCBpbXBhY3RzIGhhcyBiZWVuIGRldmVsb3BlZFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-1b-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-1b-3.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-1b-3.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Ethical approval has been granted to carry out the planned evaluation study\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMWItMy5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTFiLTMuaHRtbD83NWYxIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpaSkgRXRoaWNhbCBhcHByb3ZhbCBoYXMgYmVlbiBncmFudGVkIHRvIGNhcnJ5IG91dCB0aGUgcGxhbm5lZCBldmFsdWF0aW9uIHN0dWR5XFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-1b-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-1c-1.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-1c-1.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Procedures for accessing system-generated data from the mHealth platform for evaluation and reporting purposes have been established\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMWMtMS5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTFjLTEuaHRtbD84OGY2Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGkpIFByb2NlZHVyZXMgZm9yIGFjY2Vzc2luZyBzeXN0ZW0tZ2VuZXJhdGVkIGRhdGEgZnJvbSB0aGUgbUhlYWx0aCBwbGF0Zm9ybSBmb3IgZXZhbHVhdGlvbiBhbmQgcmVwb3J0aW5nIHB1cnBvc2VzIGhhdmUgYmVlbiBlc3RhYmxpc2hlZFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-1c-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-1c-2.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-1c-2.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Methods for assembling human-collected data and accessing it for evaluation and reporting purposes have been established\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMWMtMi5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTFjLTIuaHRtbD9jZWM0Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpKSBNZXRob2RzIGZvciBhc3NlbWJsaW5nIGh1bWFuLWNvbGxlY3RlZCBkYXRhIGFuZCBhY2Nlc3NpbmcgaXQgZm9yIGV2YWx1YXRpb24gYW5kIHJlcG9ydGluZyBwdXJwb3NlcyBoYXZlIGJlZW4gZXN0YWJsaXNoZWRcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-1c-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2a-1.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2a-1.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Health systems-level outcomes have been articulated\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmEtMS5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJhLTEuaHRtbD9iN2U4Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGkpIEhlYWx0aCBzeXN0ZW1zLWxldmVsIG91dGNvbWVzIGhhdmUgYmVlbiBhcnRpY3VsYXRlZFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2a-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2a-2.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2a-2.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Provider/health service delivery-level outcomes have been articulated\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmEtMi5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJhLTIuaHRtbD80Y2M1Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpKSBQcm92aWRlci9oZWFsdGggc2VydmljZSBkZWxpdmVyeS1sZXZlbCBvdXRjb21lcyBoYXZlIGJlZW4gYXJ0aWN1bGF0ZWRcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2a-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2a-3.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2a-3.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Client-level outcomes have been articulated\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmEtMy5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJhLTMuaHRtbD8zODk4Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpaSkgQ2xpZW50LWxldmVsIG91dGNvbWVzIGhhdmUgYmVlbiBhcnRpY3VsYXRlZFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2a-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2a-4.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2a-4.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) Population health outcomes/impacts have been articulated\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmEtNC5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJhLTQuaHRtbD8yMThhIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGl2KSBQb3B1bGF0aW9uIGhlYWx0aCBvdXRjb21lcy9pbXBhY3RzIGhhdmUgYmVlbiBhcnRpY3VsYXRlZFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2a-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2b-1.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2b-1.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Indicators for measuring the specified outcomes have been defined\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmItMS5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJiLTEuaHRtbD9jNWI5Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGkpIEluZGljYXRvcnMgZm9yIG1lYXN1cmluZyB0aGUgc3BlY2lmaWVkIG91dGNvbWVzIGhhdmUgYmVlbiBkZWZpbmVkXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2b-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2b-2.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2b-2.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Data sources pertaining to each indicator have been defined\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmItMi5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJiLTIuaHRtbD9hYjQ5Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpKSBEYXRhIHNvdXJjZXMgcGVydGFpbmluZyB0byBlYWNoIGluZGljYXRvciBoYXZlIGJlZW4gZGVmaW5lZFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2b-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2b-3.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2b-3.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Data collection methods (quantitative and qualitative, as needed) are appropriate and sufficient to capture evidence priorities\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmItMy5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJiLTMuaHRtbD81YWY1Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpaSkgRGF0YSBjb2xsZWN0aW9uIG1ldGhvZHMgKHF1YW50aXRhdGl2ZSBhbmQgcXVhbGl0YXRpdmUsIGFzIG5lZWRlZCkgYXJlIGFwcHJvcHJpYXRlIGFuZCBzdWZmaWNpZW50IHRvIGNhcHR1cmUgZXZpZGVuY2UgcHJpb3JpdGllc1xcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2b-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2b-4.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2b-4.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) Frequency of data collection and comparators have been defined\\r\\n  </translate>\\r\\n</p>\\r\\n<em>\\r\\n  <translate>\\r\\n    Comparators may involve a comparison/control group or, if the study design is pre- and post-, then comparators may involve the baseline characteristics.\\r\\n  </translate>\\r\\n</em>\\r\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmItNC5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJiLTQuaHRtbD9mZDU3Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGl2KSBGcmVxdWVuY3kgb2YgZGF0YSBjb2xsZWN0aW9uIGFuZCBjb21wYXJhdG9ycyBoYXZlIGJlZW4gZGVmaW5lZFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlxcclxcbjxlbT5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIENvbXBhcmF0b3JzIG1heSBpbnZvbHZlIGEgY29tcGFyaXNvbi9jb250cm9sIGdyb3VwIG9yLCBpZiB0aGUgc3R1ZHkgZGVzaWduIGlzIHByZS0gYW5kIHBvc3QtLCB0aGVuIGNvbXBhcmF0b3JzIG1heSBpbnZvbHZlIHRoZSBiYXNlbGluZSBjaGFyYWN0ZXJpc3RpY3MuXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L2VtPlxcclxcblwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2b-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2c-1.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2c-1.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) The functionality of the technology has been demonstrated (Does the technology work as intended?)\\r\\n  </translate>\\r\\n</p>\\r\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmMtMS5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJjLTEuaHRtbD8yZjFhIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGkpIFRoZSBmdW5jdGlvbmFsaXR5IG9mIHRoZSB0ZWNobm9sb2d5IGhhcyBiZWVuIGRlbW9uc3RyYXRlZCAoRG9lcyB0aGUgdGVjaG5vbG9neSB3b3JrIGFzIGludGVuZGVkPylcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cXHJcXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2c-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2c-2.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2c-2.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) The usability of the product has been demonstrated (Can the product be used effectively by intended users?)\\r\\n  </translate>\\r\\n</p>\\r\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmMtMi5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJjLTIuaHRtbD9hODRiIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpKSBUaGUgdXNhYmlsaXR5IG9mIHRoZSBwcm9kdWN0IGhhcyBiZWVuIGRlbW9uc3RyYXRlZCAoQ2FuIHRoZSBwcm9kdWN0IGJlIHVzZWQgZWZmZWN0aXZlbHkgYnkgaW50ZW5kZWQgdXNlcnM/KVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlxcclxcblwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2c-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2c-3.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2c-3.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) The efficacy of the product has been demonstrated (Does the product have the effect that was intended in an ideal/controlled setting?)\\r\\n  </translate>\\r\\n</p>\\r\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmMtMy5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJjLTMuaHRtbD9iZmVlIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGlpaSkgVGhlIGVmZmljYWN5IG9mIHRoZSBwcm9kdWN0IGhhcyBiZWVuIGRlbW9uc3RyYXRlZCAoRG9lcyB0aGUgcHJvZHVjdCBoYXZlIHRoZSBlZmZlY3QgdGhhdCB3YXMgaW50ZW5kZWQgaW4gYW4gaWRlYWwvY29udHJvbGxlZCBzZXR0aW5nPylcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cXHJcXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2c-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2c-4.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2c-4.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) The effectiveness of the product has been demonstrated (Does the product have the effect that was intended in a non-research setting?)\\r\\n  </translate>\\r\\n</p>\\r\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmMtNC5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJjLTQuaHRtbD85MzZlIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIGl2KSBUaGUgZWZmZWN0aXZlbmVzcyBvZiB0aGUgcHJvZHVjdCBoYXMgYmVlbiBkZW1vbnN0cmF0ZWQgKERvZXMgdGhlIHByb2R1Y3QgaGF2ZSB0aGUgZWZmZWN0IHRoYXQgd2FzIGludGVuZGVkIGluIGEgbm9uLXJlc2VhcmNoIHNldHRpbmc/KVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlxcclxcblwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2c-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-2c-5.html":
/*!********************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-2c-5.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    v) The cost-effectiveness and/or cost-utility of the product has been demonstrated (Does the product offer a greater value for impact compared to existing alternatives?)\\r\\n  </translate>\\r\\n</p>\\r\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMmMtNS5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL01hcHNUb29sa2l0L1Jlc291cmNlL3RlbXBsYXRlLzE2LTJjLTUuaHRtbD9kMDNkIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cD5cXHJcXG4gIDx0cmFuc2xhdGU+XFxyXFxuICAgIHYpIFRoZSBjb3N0LWVmZmVjdGl2ZW5lc3MgYW5kL29yIGNvc3QtdXRpbGl0eSBvZiB0aGUgcHJvZHVjdCBoYXMgYmVlbiBkZW1vbnN0cmF0ZWQgKERvZXMgdGhlIHByb2R1Y3Qgb2ZmZXIgYSBncmVhdGVyIHZhbHVlIGZvciBpbXBhY3QgY29tcGFyZWQgdG8gZXhpc3RpbmcgYWx0ZXJuYXRpdmVzPylcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cXHJcXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-2c-5.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-3-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-3-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Opportunities for local dissemination (e.g. community briefings) have been identified\\r\\n  </translate>\\r\\n</p>\\r\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMy0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMy0xLmh0bWw/MDE5OSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBPcHBvcnR1bml0aWVzIGZvciBsb2NhbCBkaXNzZW1pbmF0aW9uIChlLmcuIGNvbW11bml0eSBicmllZmluZ3MpIGhhdmUgYmVlbiBpZGVudGlmaWVkXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XFxyXFxuXCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-3-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/16-3-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/16-3-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Opportunities for wider dissemination have been identified (e.g. publications, poster sessions, websites)\\r\\n  </translate>\\r\\n</p>\\r\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMy0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMTYtMy0yLmh0bWw/MWZmMiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgT3Bwb3J0dW5pdGllcyBmb3Igd2lkZXIgZGlzc2VtaW5hdGlvbiBoYXZlIGJlZW4gaWRlbnRpZmllZCAoZS5nLiBwdWJsaWNhdGlvbnMsIHBvc3RlciBzZXNzaW9ucywgd2Vic2l0ZXMpXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XFxyXFxuXCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/16-3-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/2-1-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/2-1-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    i) We can describe how the product fits into national health or health system priority area(s)\\n  </translate>\\n</p>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0xLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTEtMS5odG1sPzhlOTkiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaSkgV2UgY2FuIGRlc2NyaWJlIGhvdyB0aGUgcHJvZHVjdCBmaXRzIGludG8gbmF0aW9uYWwgaGVhbHRoIG9yIGhlYWx0aCBzeXN0ZW0gcHJpb3JpdHkgYXJlYShzKVxcbiAgPC90cmFuc2xhdGU+XFxuPC9wPlxcblwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/2-1-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/2-1-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/2-1-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    ii) We can describe how the product fits into the principles and/or guidelines of the national eHealth/mHealth strategy if one exists (or the national health policy priorities related to the health information system (HIS), if a national eHealth/mHealth strategy does not exist)\\n  </translate>\\n</p>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0xLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTEtMi5odG1sPzg3NWUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaWkpIFdlIGNhbiBkZXNjcmliZSBob3cgdGhlIHByb2R1Y3QgZml0cyBpbnRvIHRoZSBwcmluY2lwbGVzIGFuZC9vciBndWlkZWxpbmVzIG9mIHRoZSBuYXRpb25hbCBlSGVhbHRoL21IZWFsdGggc3RyYXRlZ3kgaWYgb25lIGV4aXN0cyAob3IgdGhlIG5hdGlvbmFsIGhlYWx0aCBwb2xpY3kgcHJpb3JpdGllcyByZWxhdGVkIHRvIHRoZSBoZWFsdGggaW5mb3JtYXRpb24gc3lzdGVtIChISVMpLCBpZiBhIG5hdGlvbmFsIGVIZWFsdGgvbUhlYWx0aCBzdHJhdGVneSBkb2VzIG5vdCBleGlzdClcXG4gIDwvdHJhbnNsYXRlPlxcbjwvcD5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/2-1-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/2-1-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/2-1-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    iii) We actively participate in existing eHealth/mHealth working groups (e.g. a community of practice) or eHealth/mHealth national-level meetings\\n  </translate>\\n</p>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0xLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTEtMy5odG1sPzI0OGUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaWlpKSBXZSBhY3RpdmVseSBwYXJ0aWNpcGF0ZSBpbiBleGlzdGluZyBlSGVhbHRoL21IZWFsdGggd29ya2luZyBncm91cHMgKGUuZy4gYSBjb21tdW5pdHkgb2YgcHJhY3RpY2UpIG9yIGVIZWFsdGgvbUhlYWx0aCBuYXRpb25hbC1sZXZlbCBtZWV0aW5nc1xcbiAgPC90cmFuc2xhdGU+XFxuPC9wPlxcblwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/2-1-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/2-2-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/2-2-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    i) We have assessed the reach of network coverage, and can articulate it in terms of daily operational requirements for the mHealth product and deployments\\n  </translate>\\n</p>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0yLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTItMS5odG1sPzZiNWEiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaSkgV2UgaGF2ZSBhc3Nlc3NlZCB0aGUgcmVhY2ggb2YgbmV0d29yayBjb3ZlcmFnZSwgYW5kIGNhbiBhcnRpY3VsYXRlIGl0IGluIHRlcm1zIG9mIGRhaWx5IG9wZXJhdGlvbmFsIHJlcXVpcmVtZW50cyBmb3IgdGhlIG1IZWFsdGggcHJvZHVjdCBhbmQgZGVwbG95bWVudHNcXG4gIDwvdHJhbnNsYXRlPlxcbjwvcD5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/2-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/2-2-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/2-2-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    ii) We have assessed the reliability of network coverage, and can articulate it in terms of which networks offer needed coverage for which users\\n  </translate>\\n</p>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0yLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTItMi5odG1sP2U5YzciXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaWkpIFdlIGhhdmUgYXNzZXNzZWQgdGhlIHJlbGlhYmlsaXR5IG9mIG5ldHdvcmsgY292ZXJhZ2UsIGFuZCBjYW4gYXJ0aWN1bGF0ZSBpdCBpbiB0ZXJtcyBvZiB3aGljaCBuZXR3b3JrcyBvZmZlciBuZWVkZWQgY292ZXJhZ2UgZm9yIHdoaWNoIHVzZXJzXFxuICA8L3RyYW5zbGF0ZT5cXG48L3A+XFxuXCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/2-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/2-2-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/2-2-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    iii) We have assessed the reach of electricity, and can articulate it in terms of the functional requirements of the users\\n  </translate>\\n</p>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0yLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTItMy5odG1sPzhiOTUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaWlpKSBXZSBoYXZlIGFzc2Vzc2VkIHRoZSByZWFjaCBvZiBlbGVjdHJpY2l0eSwgYW5kIGNhbiBhcnRpY3VsYXRlIGl0IGluIHRlcm1zIG9mIHRoZSBmdW5jdGlvbmFsIHJlcXVpcmVtZW50cyBvZiB0aGUgdXNlcnNcXG4gIDwvdHJhbnNsYXRlPlxcbjwvcD5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/2-2-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/2-2-4.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/2-2-4.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    iv) We have assessed the reliability of electricity, and can articulate it in terms of the offline/online requirements of the users and the server(s)\\n  </translate>\\n</p>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0yLTQuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTItNC5odG1sPzNhZWMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaXYpIFdlIGhhdmUgYXNzZXNzZWQgdGhlIHJlbGlhYmlsaXR5IG9mIGVsZWN0cmljaXR5LCBhbmQgY2FuIGFydGljdWxhdGUgaXQgaW4gdGVybXMgb2YgdGhlIG9mZmxpbmUvb25saW5lIHJlcXVpcmVtZW50cyBvZiB0aGUgdXNlcnMgYW5kIHRoZSBzZXJ2ZXIocylcXG4gIDwvdHJhbnNsYXRlPlxcbjwvcD5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/2-2-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/2-3-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/2-3-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    i) We have assessed other mHealth projects in the local settings(s) or in the country (via working on the ground and/or via reviewing online repositories)\\n  </translate>\\n</p>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0zLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTMtMS5odG1sPzMxOGMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaSkgV2UgaGF2ZSBhc3Nlc3NlZCBvdGhlciBtSGVhbHRoIHByb2plY3RzIGluIHRoZSBsb2NhbCBzZXR0aW5ncyhzKSBvciBpbiB0aGUgY291bnRyeSAodmlhIHdvcmtpbmcgb24gdGhlIGdyb3VuZCBhbmQvb3IgdmlhIHJldmlld2luZyBvbmxpbmUgcmVwb3NpdG9yaWVzKVxcbiAgPC90cmFuc2xhdGU+XFxuPC9wPlxcblwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/2-3-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/2-3-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/2-3-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    ii) We can articulate our product’s differences and similarities in comparison with other projects\\n  </translate>\\n</p>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0zLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTMtMi5odG1sP2JhZWEiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaWkpIFdlIGNhbiBhcnRpY3VsYXRlIG91ciBwcm9kdWN04oCZcyBkaWZmZXJlbmNlcyBhbmQgc2ltaWxhcml0aWVzIGluIGNvbXBhcmlzb24gd2l0aCBvdGhlciBwcm9qZWN0c1xcbiAgPC90cmFuc2xhdGU+XFxuPC9wPlxcblwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/2-3-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/2-3-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/2-3-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    iii) We can articulate our product’s advantages in comparison with other projects in the mHealth landscape, and the added value of our product\\n  </translate>\\n</p>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0zLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTMtMy5odG1sPzMzNzgiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaWlpKSBXZSBjYW4gYXJ0aWN1bGF0ZSBvdXIgcHJvZHVjdOKAmXMgYWR2YW50YWdlcyBpbiBjb21wYXJpc29uIHdpdGggb3RoZXIgcHJvamVjdHMgaW4gdGhlIG1IZWFsdGggbGFuZHNjYXBlLCBhbmQgdGhlIGFkZGVkIHZhbHVlIG9mIG91ciBwcm9kdWN0XFxuICA8L3RyYW5zbGF0ZT5cXG48L3A+XFxuXCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/2-3-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/2-3-4.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/2-3-4.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    iv) We have developed strategies for either aligning with or differentiating ourselves from those other projects at this stage or in the future\\n  </translate>\\n</p>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMi0zLTQuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8yLTMtNC5odG1sPzkyNTgiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcbiAgPHRyYW5zbGF0ZT5cXG4gICAgaXYpIFdlIGhhdmUgZGV2ZWxvcGVkIHN0cmF0ZWdpZXMgZm9yIGVpdGhlciBhbGlnbmluZyB3aXRoIG9yIGRpZmZlcmVudGlhdGluZyBvdXJzZWx2ZXMgZnJvbSB0aG9zZSBvdGhlciBwcm9qZWN0cyBhdCB0aGlzIHN0YWdlIG9yIGluIHRoZSBmdXR1cmVcXG4gIDwvdHJhbnNsYXRlPlxcbjwvcD5cXG5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/2-3-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/3-1a-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/3-1a-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) The functionality of the technology has been demonstrated (Does the technology work as intended?)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0xYS0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0xYS0xLmh0bWw/NTM5MCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBUaGUgZnVuY3Rpb25hbGl0eSBvZiB0aGUgdGVjaG5vbG9neSBoYXMgYmVlbiBkZW1vbnN0cmF0ZWQgKERvZXMgdGhlIHRlY2hub2xvZ3kgd29yayBhcyBpbnRlbmRlZD8pXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/3-1a-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/3-1a-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/3-1a-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) The usability of the mHealth product has been demonstrated by carrying out user testing with anticipated user groups (Can the mHealth product be used effectively by intended users?)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0xYS0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0xYS0yLmh0bWw/NDIyMyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgVGhlIHVzYWJpbGl0eSBvZiB0aGUgbUhlYWx0aCBwcm9kdWN0IGhhcyBiZWVuIGRlbW9uc3RyYXRlZCBieSBjYXJyeWluZyBvdXQgdXNlciB0ZXN0aW5nIHdpdGggYW50aWNpcGF0ZWQgdXNlciBncm91cHMgKENhbiB0aGUgbUhlYWx0aCBwcm9kdWN0IGJlIHVzZWQgZWZmZWN0aXZlbHkgYnkgaW50ZW5kZWQgdXNlcnM/KVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/3-1a-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/3-1a-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/3-1a-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) The efficacy of the mHealth product has been demonstrated (Does the mHealth product have the effect that was intended in an ideal/controlled setting?)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0xYS0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0xYS0zLmh0bWw/ZWQwMCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIFRoZSBlZmZpY2FjeSBvZiB0aGUgbUhlYWx0aCBwcm9kdWN0IGhhcyBiZWVuIGRlbW9uc3RyYXRlZCAoRG9lcyB0aGUgbUhlYWx0aCBwcm9kdWN0IGhhdmUgdGhlIGVmZmVjdCB0aGF0IHdhcyBpbnRlbmRlZCBpbiBhbiBpZGVhbC9jb250cm9sbGVkIHNldHRpbmc/KVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/3-1a-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/3-1a-4.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/3-1a-4.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) The effectiveness of the mHealth product has been demonstrated (Does the mHealth product have the effect that was intended in a non-research setting?)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0xYS00Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0xYS00Lmh0bWw/NWZmZCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpdikgVGhlIGVmZmVjdGl2ZW5lc3Mgb2YgdGhlIG1IZWFsdGggcHJvZHVjdCBoYXMgYmVlbiBkZW1vbnN0cmF0ZWQgKERvZXMgdGhlIG1IZWFsdGggcHJvZHVjdCBoYXZlIHRoZSBlZmZlY3QgdGhhdCB3YXMgaW50ZW5kZWQgaW4gYSBub24tcmVzZWFyY2ggc2V0dGluZz8pXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/3-1a-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/3-1b-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/3-1b-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) The content and key activities are drawn from evidence-based guidelines (e.g. WHO guidelines) or national operational procedures (e.g. from existing MOH documentation), and we are able to list these sources\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0xYi0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0xYi0xLmh0bWw/MzBmZiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBUaGUgY29udGVudCBhbmQga2V5IGFjdGl2aXRpZXMgYXJlIGRyYXduIGZyb20gZXZpZGVuY2UtYmFzZWQgZ3VpZGVsaW5lcyAoZS5nLiBXSE8gZ3VpZGVsaW5lcykgb3IgbmF0aW9uYWwgb3BlcmF0aW9uYWwgcHJvY2VkdXJlcyAoZS5nLiBmcm9tIGV4aXN0aW5nIE1PSCBkb2N1bWVudGF0aW9uKSwgYW5kIHdlIGFyZSBhYmxlIHRvIGxpc3QgdGhlc2Ugc291cmNlc1xcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/3-1b-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/3-1b-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/3-1b-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Operational procedures for the mHealth strategy (e.g. timing, frequency or actions defining the mHealth activities) have been informed by credible external sources and/or a pilot study, and we are able to list these sources\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0xYi0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0xYi0yLmh0bWw/MWU2MyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgT3BlcmF0aW9uYWwgcHJvY2VkdXJlcyBmb3IgdGhlIG1IZWFsdGggc3RyYXRlZ3kgKGUuZy4gdGltaW5nLCBmcmVxdWVuY3kgb3IgYWN0aW9ucyBkZWZpbmluZyB0aGUgbUhlYWx0aCBhY3Rpdml0aWVzKSBoYXZlIGJlZW4gaW5mb3JtZWQgYnkgY3JlZGlibGUgZXh0ZXJuYWwgc291cmNlcyBhbmQvb3IgYSBwaWxvdCBzdHVkeSwgYW5kIHdlIGFyZSBhYmxlIHRvIGxpc3QgdGhlc2Ugc291cmNlc1xcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/3-1b-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/3-2-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/3-2-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Formative research has been conducted in this setting to assess needs (e.g. using qualitative methods such as focus group discussions)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0yLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTItMS5odG1sPzk5MmEiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaSkgRm9ybWF0aXZlIHJlc2VhcmNoIGhhcyBiZWVuIGNvbmR1Y3RlZCBpbiB0aGlzIHNldHRpbmcgdG8gYXNzZXNzIG5lZWRzIChlLmcuIHVzaW5nIHF1YWxpdGF0aXZlIG1ldGhvZHMgc3VjaCBhcyBmb2N1cyBncm91cCBkaXNjdXNzaW9ucylcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/3-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/3-2-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/3-2-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) A pilot study has been conducted in this setting (or in settings that are similar in terms of sociocultural, geographic and institutional features)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0yLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTItMi5odG1sPzg4ZjEiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWkpIEEgcGlsb3Qgc3R1ZHkgaGFzIGJlZW4gY29uZHVjdGVkIGluIHRoaXMgc2V0dGluZyAob3IgaW4gc2V0dGluZ3MgdGhhdCBhcmUgc2ltaWxhciBpbiB0ZXJtcyBvZiBzb2Npb2N1bHR1cmFsLCBnZW9ncmFwaGljIGFuZCBpbnN0aXR1dGlvbmFsIGZlYXR1cmVzKVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/3-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/3-2-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/3-2-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) We have assessed local health system constraints in relation to the mHealth product\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0yLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTItMy5odG1sP2ZmN2IiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWlpKSBXZSBoYXZlIGFzc2Vzc2VkIGxvY2FsIGhlYWx0aCBzeXN0ZW0gY29uc3RyYWludHMgaW4gcmVsYXRpb24gdG8gdGhlIG1IZWFsdGggcHJvZHVjdFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/3-2-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/3-2-4.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/3-2-4.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) We have assessed the availability and capacity of local health services in relation to the mHealth product\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0yLTQuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTItNC5odG1sPzZhMDIiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaXYpIFdlIGhhdmUgYXNzZXNzZWQgdGhlIGF2YWlsYWJpbGl0eSBhbmQgY2FwYWNpdHkgb2YgbG9jYWwgaGVhbHRoIHNlcnZpY2VzIGluIHJlbGF0aW9uIHRvIHRoZSBtSGVhbHRoIHByb2R1Y3RcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/3-2-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/3-2-5.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/3-2-5.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    v) We have assessed how the mHealth product will integrate with existing workflow, behaviours and needs of health workers or other health system staff\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0yLTUuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTItNS5odG1sP2Q2ZmUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgdikgV2UgaGF2ZSBhc3Nlc3NlZCBob3cgdGhlIG1IZWFsdGggcHJvZHVjdCB3aWxsIGludGVncmF0ZSB3aXRoIGV4aXN0aW5nIHdvcmtmbG93LCBiZWhhdmlvdXJzIGFuZCBuZWVkcyBvZiBoZWFsdGggd29ya2VycyBvciBvdGhlciBoZWFsdGggc3lzdGVtIHN0YWZmXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/3-2-5.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/3-2-6.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/3-2-6.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    vi) We have assessed local sociocultural norms (including gender norms), and can describe them in terms of barriers and opportunities for the use and scaling up of the mHealth product\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvMy0yLTYuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS8zLTItNi5odG1sPzdhYzUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgdmkpIFdlIGhhdmUgYXNzZXNzZWQgbG9jYWwgc29jaW9jdWx0dXJhbCBub3JtcyAoaW5jbHVkaW5nIGdlbmRlciBub3JtcyksIGFuZCBjYW4gZGVzY3JpYmUgdGhlbSBpbiB0ZXJtcyBvZiBiYXJyaWVycyBhbmQgb3Bwb3J0dW5pdGllcyBmb3IgdGhlIHVzZSBhbmQgc2NhbGluZyB1cCBvZiB0aGUgbUhlYWx0aCBwcm9kdWN0XFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/3-2-6.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-1a-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-1a-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) We can clearly define our project team’s internal competencies, and based on these considerations, can identify our external need for partners\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYS0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYS0xLmh0bWw/YzJmYiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBXZSBjYW4gY2xlYXJseSBkZWZpbmUgb3VyIHByb2plY3QgdGVhbeKAmXMgaW50ZXJuYWwgY29tcGV0ZW5jaWVzLCBhbmQgYmFzZWQgb24gdGhlc2UgY29uc2lkZXJhdGlvbnMsIGNhbiBpZGVudGlmeSBvdXIgZXh0ZXJuYWwgbmVlZCBmb3IgcGFydG5lcnNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-1a-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-1a-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-1a-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) We have decided on the types of individuals and institutions that we will need to partner with to meet those needs\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYS0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYS0yLmh0bWw/ZWViYSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgV2UgaGF2ZSBkZWNpZGVkIG9uIHRoZSB0eXBlcyBvZiBpbmRpdmlkdWFscyBhbmQgaW5zdGl0dXRpb25zIHRoYXQgd2Ugd2lsbCBuZWVkIHRvIHBhcnRuZXIgd2l0aCB0byBtZWV0IHRob3NlIG5lZWRzXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-1a-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-1a-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-1a-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) We have determined the stages in the scaling-up process or timing when those outside partners are relevant or necessary\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYS0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYS0zLmh0bWw/NDFhYSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIFdlIGhhdmUgZGV0ZXJtaW5lZCB0aGUgc3RhZ2VzIGluIHRoZSBzY2FsaW5nLXVwIHByb2Nlc3Mgb3IgdGltaW5nIHdoZW4gdGhvc2Ugb3V0c2lkZSBwYXJ0bmVycyBhcmUgcmVsZXZhbnQgb3IgbmVjZXNzYXJ5XFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-1a-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-1b-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-1b-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) MOH/government entities\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi0xLmh0bWw/ZDc3OSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBNT0gvZ292ZXJubWVudCBlbnRpdGllc1xcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-1b-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-1b-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-1b-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Financing partner(s)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi0yLmh0bWw/OWMxZSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgRmluYW5jaW5nIHBhcnRuZXIocylcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-1b-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-1b-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-1b-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) MNOs or aggregator\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi0zLmh0bWw/MzY5YSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIE1OT3Mgb3IgYWdncmVnYXRvclxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-1b-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-1b-4.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-1b-4.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) Implementation partner(s) (e.g. NGO, CBO)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi00Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi00Lmh0bWw/MWI0MSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpdikgSW1wbGVtZW50YXRpb24gcGFydG5lcihzKSAoZS5nLiBOR08sIENCTylcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-1b-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-1b-5.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-1b-5.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    v) Technology partner(s) (e.g. software developer)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi01Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi01Lmh0bWw/NzRkYyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICB2KSBUZWNobm9sb2d5IHBhcnRuZXIocykgKGUuZy4gc29mdHdhcmUgZGV2ZWxvcGVyKVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-1b-5.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-1b-6.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-1b-6.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    vi) Service provider(s) (e.g. hardware vendor)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi02Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi02Lmh0bWw/YjU2NiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICB2aSkgU2VydmljZSBwcm92aWRlcihzKSAoZS5nLiBoYXJkd2FyZSB2ZW5kb3IpXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-1b-6.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-1b-7.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-1b-7.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    vii) Marketing/communications partner\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi03Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi03Lmh0bWw/YzQ2ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICB2aWkpIE1hcmtldGluZy9jb21tdW5pY2F0aW9ucyBwYXJ0bmVyXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-1b-7.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-1b-8.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-1b-8.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    viii) Evaluation or research partner\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi04Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi04Lmh0bWw/NjcxMCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICB2aWlpKSBFdmFsdWF0aW9uIG9yIHJlc2VhcmNoIHBhcnRuZXJcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-1b-8.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-1b-9.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-1b-9.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ix) Partner/advisor for health content\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi05Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0xYi05Lmh0bWw/MjEwYiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpeCkgUGFydG5lci9hZHZpc29yIGZvciBoZWFsdGggY29udGVudFxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-1b-9.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-2-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-2-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) We are able to articulate the value proposition (i.e. the advantages of the mHealth product compared with alternatives) specifically to each partner\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0yLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTItMS5odG1sPzdiYjgiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaSkgV2UgYXJlIGFibGUgdG8gYXJ0aWN1bGF0ZSB0aGUgdmFsdWUgcHJvcG9zaXRpb24gKGkuZS4gdGhlIGFkdmFudGFnZXMgb2YgdGhlIG1IZWFsdGggcHJvZHVjdCBjb21wYXJlZCB3aXRoIGFsdGVybmF0aXZlcykgc3BlY2lmaWNhbGx5IHRvIGVhY2ggcGFydG5lclxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-2-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-2-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) We have communicated the ways in which the mHealth product is aligned with partner priorities (e.g. evidence, cost-effectiveness, financial returns, brand equity)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0yLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTItMi5odG1sPzAyNjQiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWkpIFdlIGhhdmUgY29tbXVuaWNhdGVkIHRoZSB3YXlzIGluIHdoaWNoIHRoZSBtSGVhbHRoIHByb2R1Y3QgaXMgYWxpZ25lZCB3aXRoIHBhcnRuZXIgcHJpb3JpdGllcyAoZS5nLiBldmlkZW5jZSwgY29zdC1lZmZlY3RpdmVuZXNzLCBmaW5hbmNpYWwgcmV0dXJucywgYnJhbmQgZXF1aXR5KVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-2-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-2-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) We have communicated the relevance of the mHealth product to local health needs and government priorities\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0yLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTItMy5odG1sPzliMjQiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWlpKSBXZSBoYXZlIGNvbW11bmljYXRlZCB0aGUgcmVsZXZhbmNlIG9mIHRoZSBtSGVhbHRoIHByb2R1Y3QgdG8gbG9jYWwgaGVhbHRoIG5lZWRzIGFuZCBnb3Zlcm5tZW50IHByaW9yaXRpZXNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-2-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/4-2-4.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/4-2-4.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) We have communicated the relevance of the mHealth product to global health concerns (e.g. Millennium Development Goals, Sustainable Development Goals, universal health coverage, etc.) or multicountry donor initiatives\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNC0yLTQuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS80LTItNC5odG1sP2QwNzUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaXYpIFdlIGhhdmUgY29tbXVuaWNhdGVkIHRoZSByZWxldmFuY2Ugb2YgdGhlIG1IZWFsdGggcHJvZHVjdCB0byBnbG9iYWwgaGVhbHRoIGNvbmNlcm5zIChlLmcuIE1pbGxlbm5pdW0gRGV2ZWxvcG1lbnQgR29hbHMsIFN1c3RhaW5hYmxlIERldmVsb3BtZW50IEdvYWxzLCB1bml2ZXJzYWwgaGVhbHRoIGNvdmVyYWdlLCBldGMuKSBvciBtdWx0aWNvdW50cnkgZG9ub3IgaW5pdGlhdGl2ZXNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/4-2-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1a-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1a-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) We have identified the areas in which champions will be valuable to scaling up\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYS0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYS0xLmh0bWw/MTM3NyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBXZSBoYXZlIGlkZW50aWZpZWQgdGhlIGFyZWFzIGluIHdoaWNoIGNoYW1waW9ucyB3aWxsIGJlIHZhbHVhYmxlIHRvIHNjYWxpbmcgdXBcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1a-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1a-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1a-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) We have developed relationships with those champions\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYS0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYS0yLmh0bWw/OTc1ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgV2UgaGF2ZSBkZXZlbG9wZWQgcmVsYXRpb25zaGlwcyB3aXRoIHRob3NlIGNoYW1waW9uc1xcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1a-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1a-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1a-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) We have identified the times at which support from champions will be most essential\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYS0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYS0zLmh0bWw/YTM4ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIFdlIGhhdmUgaWRlbnRpZmllZCB0aGUgdGltZXMgYXQgd2hpY2ggc3VwcG9ydCBmcm9tIGNoYW1waW9ucyB3aWxsIGJlIG1vc3QgZXNzZW50aWFsXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1a-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1b-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1b-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Champion(s) have decision-making capabilities and authority\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi0xLmh0bWw/NGUxOSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBDaGFtcGlvbihzKSBoYXZlIGRlY2lzaW9uLW1ha2luZyBjYXBhYmlsaXRpZXMgYW5kIGF1dGhvcml0eVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1b-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1b-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1b-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Champion(s) have stability in current position\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi0yLmh0bWw/NmMzZCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgQ2hhbXBpb24ocykgaGF2ZSBzdGFiaWxpdHkgaW4gY3VycmVudCBwb3NpdGlvblxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1b-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1b-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1b-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Champion(s) have organizational support and relevant resources (e.g. financial, political, in-kind human resources)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi0zLmh0bWw/ZjY3NyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIENoYW1waW9uKHMpIGhhdmUgb3JnYW5pemF0aW9uYWwgc3VwcG9ydCBhbmQgcmVsZXZhbnQgcmVzb3VyY2VzIChlLmcuIGZpbmFuY2lhbCwgcG9saXRpY2FsLCBpbi1raW5kIGh1bWFuIHJlc291cmNlcylcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1b-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1b-4.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1b-4.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) Champion(s) are aware of their responsibilities and scope of work during the scaling-up process\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi00Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi00Lmh0bWw/YWJhNCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpdikgQ2hhbXBpb24ocykgYXJlIGF3YXJlIG9mIHRoZWlyIHJlc3BvbnNpYmlsaXRpZXMgYW5kIHNjb3BlIG9mIHdvcmsgZHVyaW5nIHRoZSBzY2FsaW5nLXVwIHByb2Nlc3NcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1b-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1b-5.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1b-5.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    v) Champion(s) have demonstrated their commitment to the product and ability to advocate for it through previous efforts\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi01Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYi01Lmh0bWw/NGQ1MyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICB2KSBDaGFtcGlvbihzKSBoYXZlIGRlbW9uc3RyYXRlZCB0aGVpciBjb21taXRtZW50IHRvIHRoZSBwcm9kdWN0IGFuZCBhYmlsaXR5IHRvIGFkdm9jYXRlIGZvciBpdCB0aHJvdWdoIHByZXZpb3VzIGVmZm9ydHNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1b-5.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1c-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1c-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) Champion(s) have decision-making capabilities and authority\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy0xLmh0bWw/NWUzMCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBDaGFtcGlvbihzKSBoYXZlIGRlY2lzaW9uLW1ha2luZyBjYXBhYmlsaXRpZXMgYW5kIGF1dGhvcml0eVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1c-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1c-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1c-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Champion(s) have stability in current position\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy0yLmh0bWw/MDc0NyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgQ2hhbXBpb24ocykgaGF2ZSBzdGFiaWxpdHkgaW4gY3VycmVudCBwb3NpdGlvblxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1c-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1c-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1c-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Champion(s) have organizational support and relevant resources (e.g. financial, political, in-kind human resources)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy0zLmh0bWw/NTlhNCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIENoYW1waW9uKHMpIGhhdmUgb3JnYW5pemF0aW9uYWwgc3VwcG9ydCBhbmQgcmVsZXZhbnQgcmVzb3VyY2VzIChlLmcuIGZpbmFuY2lhbCwgcG9saXRpY2FsLCBpbi1raW5kIGh1bWFuIHJlc291cmNlcylcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1c-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1c-4.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1c-4.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\niv) Champion(s) are aware of their responsibilities and scope of work during the scaling-up process\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy00Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy00Lmh0bWw/ZmI4MCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbml2KSBDaGFtcGlvbihzKSBhcmUgYXdhcmUgb2YgdGhlaXIgcmVzcG9uc2liaWxpdGllcyBhbmQgc2NvcGUgb2Ygd29yayBkdXJpbmcgdGhlIHNjYWxpbmctdXAgcHJvY2Vzc1xcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1c-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-1c-5.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-1c-5.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    v) Champion(s) have demonstrated their commitment to the product and ability to advocate for it through previous efforts\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy01Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0xYy01Lmh0bWw/MzVmMiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICB2KSBDaGFtcGlvbihzKSBoYXZlIGRlbW9uc3RyYXRlZCB0aGVpciBjb21taXRtZW50IHRvIHRoZSBwcm9kdWN0IGFuZCBhYmlsaXR5IHRvIGFkdm9jYXRlIGZvciBpdCB0aHJvdWdoIHByZXZpb3VzIGVmZm9ydHNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-1c-5.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-2a-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-2a-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) A steering committee or decision-making board that is representative of partners, as appropriate, has been created\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYS0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYS0xLmh0bWw/MmE1ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBBIHN0ZWVyaW5nIGNvbW1pdHRlZSBvciBkZWNpc2lvbi1tYWtpbmcgYm9hcmQgdGhhdCBpcyByZXByZXNlbnRhdGl2ZSBvZiBwYXJ0bmVycywgYXMgYXBwcm9wcmlhdGUsIGhhcyBiZWVuIGNyZWF0ZWRcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-2a-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-2a-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-2a-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) There is a regular schedule of meetings among committee/board representatives\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYS0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYS0yLmh0bWw/ZmVmMCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgVGhlcmUgaXMgYSByZWd1bGFyIHNjaGVkdWxlIG9mIG1lZXRpbmdzIGFtb25nIGNvbW1pdHRlZS9ib2FyZCByZXByZXNlbnRhdGl2ZXNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-2a-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-2a-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-2a-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Terms of reference have been established to guide the structure and decision-making processes of the committee/board, and these terms are understood by all\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYS0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYS0zLmh0bWw/NjE2ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIFRlcm1zIG9mIHJlZmVyZW5jZSBoYXZlIGJlZW4gZXN0YWJsaXNoZWQgdG8gZ3VpZGUgdGhlIHN0cnVjdHVyZSBhbmQgZGVjaXNpb24tbWFraW5nIHByb2Nlc3NlcyBvZiB0aGUgY29tbWl0dGVlL2JvYXJkLCBhbmQgdGhlc2UgdGVybXMgYXJlIHVuZGVyc3Rvb2QgYnkgYWxsXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-2a-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-2a-4.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-2a-4.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) Mechanisms are in place to consistently elicit feedback from partners\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYS00Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYS00Lmh0bWw/MGQ4MCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpdikgTWVjaGFuaXNtcyBhcmUgaW4gcGxhY2UgdG8gY29uc2lzdGVudGx5IGVsaWNpdCBmZWVkYmFjayBmcm9tIHBhcnRuZXJzXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-2a-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-2b-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-2b-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\n  <translate>\\n    i) Agreement has been reached on the project vision\\n  </translate>\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYi0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYi0xLmh0bWw/OTEyYyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxuICA8dHJhbnNsYXRlPlxcbiAgICBpKSBBZ3JlZW1lbnQgaGFzIGJlZW4gcmVhY2hlZCBvbiB0aGUgcHJvamVjdCB2aXNpb25cXG4gIDwvdHJhbnNsYXRlPlxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-2b-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-2b-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-2b-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) Agreement has been reached on the scope and goals of scaling up (as specified in SAQ 1-1)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYi0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYi0yLmh0bWw/MmI5ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgQWdyZWVtZW50IGhhcyBiZWVuIHJlYWNoZWQgb24gdGhlIHNjb3BlIGFuZCBnb2FscyBvZiBzY2FsaW5nIHVwIChhcyBzcGVjaWZpZWQgaW4gU0FRIDEtMSlcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-2b-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/5-2b-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/5-2b-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) Agreement has been reached on the general approach and timeline of activities for scaling up (e.g. joint workplan)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYi0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNS0yYi0zLmh0bWw/ODFmMiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIEFncmVlbWVudCBoYXMgYmVlbiByZWFjaGVkIG9uIHRoZSBnZW5lcmFsIGFwcHJvYWNoIGFuZCB0aW1lbGluZSBvZiBhY3Rpdml0aWVzIGZvciBzY2FsaW5nIHVwIChlLmcuIGpvaW50IHdvcmtwbGFuKVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/5-2b-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-1-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-1-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) A mechanism for tracking expenditures, according to the phase of implementation, is in place\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0xLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTEtMS5odG1sP2Y1ZTUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaSkgQSBtZWNoYW5pc20gZm9yIHRyYWNraW5nIGV4cGVuZGl0dXJlcywgYWNjb3JkaW5nIHRvIHRoZSBwaGFzZSBvZiBpbXBsZW1lbnRhdGlvbiwgaXMgaW4gcGxhY2VcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-1-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-1-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-1-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) We have captured costs according to the phases of implementation (i.e. development, pilot, scaling up)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0xLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTEtMi5odG1sPzkzNGUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWkpIFdlIGhhdmUgY2FwdHVyZWQgY29zdHMgYWNjb3JkaW5nIHRvIHRoZSBwaGFzZXMgb2YgaW1wbGVtZW50YXRpb24gKGkuZS4gZGV2ZWxvcG1lbnQsIHBpbG90LCBzY2FsaW5nIHVwKVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-1-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-1-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-1-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) We have categorized costs in terms of one-time capital costs, recurring costs and variable costs\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0xLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTEtMy5odG1sP2NlNzkiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWlpKSBXZSBoYXZlIGNhdGVnb3JpemVkIGNvc3RzIGluIHRlcm1zIG9mIG9uZS10aW1lIGNhcGl0YWwgY29zdHMsIHJlY3VycmluZyBjb3N0cyBhbmQgdmFyaWFibGUgY29zdHNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-1-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-1-4.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-1-4.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) We have quantified in-kind contributions and other intangible assets (e.g. office space, Internet)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0xLTQuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTEtNC5odG1sPzAyZGMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaXYpIFdlIGhhdmUgcXVhbnRpZmllZCBpbi1raW5kIGNvbnRyaWJ1dGlvbnMgYW5kIG90aGVyIGludGFuZ2libGUgYXNzZXRzIChlLmcuIG9mZmljZSBzcGFjZSwgSW50ZXJuZXQpXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-1-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-1-5.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-1-5.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    v) We have explored cost-share opportunities\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0xLTUuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTEtNS5odG1sP2Q3MjkiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgdikgV2UgaGF2ZSBleHBsb3JlZCBjb3N0LXNoYXJlIG9wcG9ydHVuaXRpZXNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-1-5.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-1-6.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-1-6.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    vi) A protocol is in place to regularly revisit and revise budgets as funding, assumptions and/or activities change\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0xLTYuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTEtNi5odG1sP2Q0ZjUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgdmkpIEEgcHJvdG9jb2wgaXMgaW4gcGxhY2UgdG8gcmVndWxhcmx5IHJldmlzaXQgYW5kIHJldmlzZSBidWRnZXRzIGFzIGZ1bmRpbmcsIGFzc3VtcHRpb25zIGFuZC9vciBhY3Rpdml0aWVzIGNoYW5nZVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-1-6.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-2-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-2-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\ni) We have considered technology costs incurred by users (e.g. mobile device, airtime, etc.)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0yLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTItMS5odG1sPzJkYjAiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG5pKSBXZSBoYXZlIGNvbnNpZGVyZWQgdGVjaG5vbG9neSBjb3N0cyBpbmN1cnJlZCBieSB1c2VycyAoZS5nLiBtb2JpbGUgZGV2aWNlLCBhaXJ0aW1lLCBldGMuKVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-2-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-2-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) We have considered non-technology costs incurred by users (e.g. care-seeking and/or engagement)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0yLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTItMi5odG1sP2E4OGYiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWkpIFdlIGhhdmUgY29uc2lkZXJlZCBub24tdGVjaG5vbG9neSBjb3N0cyBpbmN1cnJlZCBieSB1c2VycyAoZS5nLiBjYXJlLXNlZWtpbmcgYW5kL29yIGVuZ2FnZW1lbnQpXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-3-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-3-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) We have estimated increased demand for care as a result of the mHealth project activities and the resulting additional workload on providers (e.g. time spent filling out electronic registers, etc.)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0zLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTMtMS5odG1sPzQ4NWMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaSkgV2UgaGF2ZSBlc3RpbWF0ZWQgaW5jcmVhc2VkIGRlbWFuZCBmb3IgY2FyZSBhcyBhIHJlc3VsdCBvZiB0aGUgbUhlYWx0aCBwcm9qZWN0IGFjdGl2aXRpZXMgYW5kIHRoZSByZXN1bHRpbmcgYWRkaXRpb25hbCB3b3JrbG9hZCBvbiBwcm92aWRlcnMgKGUuZy4gdGltZSBzcGVudCBmaWxsaW5nIG91dCBlbGVjdHJvbmljIHJlZ2lzdGVycywgZXRjLilcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-3-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-3-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-3-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) We have estimated the increased cost of health workers’ time as a result of mHealth project activities\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0zLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTMtMi5odG1sPzgxZmUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWkpIFdlIGhhdmUgZXN0aW1hdGVkIHRoZSBpbmNyZWFzZWQgY29zdCBvZiBoZWFsdGggd29ya2Vyc+KAmSB0aW1lIGFzIGEgcmVzdWx0IG9mIG1IZWFsdGggcHJvamVjdCBhY3Rpdml0aWVzXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-3-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-3-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-3-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) We have estimated the additional costs of commodities, equipment and/or supplies as a result of the mHealth project activities\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi0zLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTMtMy5odG1sP2QxNzQiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWlpKSBXZSBoYXZlIGVzdGltYXRlZCB0aGUgYWRkaXRpb25hbCBjb3N0cyBvZiBjb21tb2RpdGllcywgZXF1aXBtZW50IGFuZC9vciBzdXBwbGllcyBhcyBhIHJlc3VsdCBvZiB0aGUgbUhlYWx0aCBwcm9qZWN0IGFjdGl2aXRpZXNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-3-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-4-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-4-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) We have identified the total cost of ownership (including hardware, software, equipment, training, support, marketing, staff, etc.) over the next five years, to reach our projected units of scale (Factor 1-1.)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi00LTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTQtMS5odG1sPzU1NjkiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaSkgV2UgaGF2ZSBpZGVudGlmaWVkIHRoZSB0b3RhbCBjb3N0IG9mIG93bmVyc2hpcCAoaW5jbHVkaW5nIGhhcmR3YXJlLCBzb2Z0d2FyZSwgZXF1aXBtZW50LCB0cmFpbmluZywgc3VwcG9ydCwgbWFya2V0aW5nLCBzdGFmZiwgZXRjLikgb3ZlciB0aGUgbmV4dCBmaXZlIHllYXJzLCB0byByZWFjaCBvdXIgcHJvamVjdGVkIHVuaXRzIG9mIHNjYWxlIChGYWN0b3IgMS0xLilcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-4-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-4-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-4-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) We have identified key drivers of cost associated with scaling up the project\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi00LTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTQtMi5odG1sP2M1NzUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWkpIFdlIGhhdmUgaWRlbnRpZmllZCBrZXkgZHJpdmVycyBvZiBjb3N0IGFzc29jaWF0ZWQgd2l0aCBzY2FsaW5nIHVwIHRoZSBwcm9qZWN0XFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-4-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-4-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-4-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) We have identified areas for achieving economies of scale or other means of cost savings\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi00LTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTQtMy5odG1sP2FlZWYiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWlpKSBXZSBoYXZlIGlkZW50aWZpZWQgYXJlYXMgZm9yIGFjaGlldmluZyBlY29ub21pZXMgb2Ygc2NhbGUgb3Igb3RoZXIgbWVhbnMgb2YgY29zdCBzYXZpbmdzXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-4-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/6-4-4.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/6-4-4.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) We have outlined the key assumptions and corresponding risks in forecasting economic costs\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNi00LTQuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS82LTQtNC5odG1sPzUyYjAiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaXYpIFdlIGhhdmUgb3V0bGluZWQgdGhlIGtleSBhc3N1bXB0aW9ucyBhbmQgY29ycmVzcG9uZGluZyByaXNrcyBpbiBmb3JlY2FzdGluZyBlY29ub21pYyBjb3N0c1xcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/6-4-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/7-1-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/7-1-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) We have completed a value chain analysis to identify the key interests of potential payer12\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0xLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTEtMS5odG1sPzI3NjgiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaSkgV2UgaGF2ZSBjb21wbGV0ZWQgYSB2YWx1ZSBjaGFpbiBhbmFseXNpcyB0byBpZGVudGlmeSB0aGUga2V5IGludGVyZXN0cyBvZiBwb3RlbnRpYWwgcGF5ZXIxMlxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/7-1-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/7-1-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/7-1-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) We have quantified the tangible/monetary costs and benefits of the status quo (e.g. cost of materials)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0xLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTEtMi5odG1sPzMyMWYiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWkpIFdlIGhhdmUgcXVhbnRpZmllZCB0aGUgdGFuZ2libGUvbW9uZXRhcnkgY29zdHMgYW5kIGJlbmVmaXRzIG9mIHRoZSBzdGF0dXMgcXVvIChlLmcuIGNvc3Qgb2YgbWF0ZXJpYWxzKVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/7-1-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/7-1-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/7-1-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) We have quantified the intangible/non-monetary costs and benefits of the status quo (e.g. efficiency, access to care)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0xLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTEtMy5odG1sP2FmMGYiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWlpKSBXZSBoYXZlIHF1YW50aWZpZWQgdGhlIGludGFuZ2libGUvbm9uLW1vbmV0YXJ5IGNvc3RzIGFuZCBiZW5lZml0cyBvZiB0aGUgc3RhdHVzIHF1byAoZS5nLiBlZmZpY2llbmN5LCBhY2Nlc3MgdG8gY2FyZSlcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/7-1-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/7-1-4.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/7-1-4.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) We can articulate our project’s value proposition to each potential payer\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0xLTQuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTEtNC5odG1sPzhhNWYiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaXYpIFdlIGNhbiBhcnRpY3VsYXRlIG91ciBwcm9qZWN04oCZcyB2YWx1ZSBwcm9wb3NpdGlvbiB0byBlYWNoIHBvdGVudGlhbCBwYXllclxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/7-1-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/7-2-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/7-2-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) We have conducted a comprehensive analysis of the resources necessary for reaching the goals of scaling up (Factor 1-1.)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0yLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTItMS5odG1sPzcxM2IiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaSkgV2UgaGF2ZSBjb25kdWN0ZWQgYSBjb21wcmVoZW5zaXZlIGFuYWx5c2lzIG9mIHRoZSByZXNvdXJjZXMgbmVjZXNzYXJ5IGZvciByZWFjaGluZyB0aGUgZ29hbHMgb2Ygc2NhbGluZyB1cCAoRmFjdG9yIDEtMS4pXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/7-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/7-2-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/7-2-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\nii) We have consulted with partners and other local stakeholders to develop our resource mobilization plan\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0yLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTItMi5odG1sP2EzMTgiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG5paSkgV2UgaGF2ZSBjb25zdWx0ZWQgd2l0aCBwYXJ0bmVycyBhbmQgb3RoZXIgbG9jYWwgc3Rha2Vob2xkZXJzIHRvIGRldmVsb3Agb3VyIHJlc291cmNlIG1vYmlsaXphdGlvbiBwbGFuXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/7-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/7-2-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/7-2-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) We have developed a marketing plan that can be sustained over time\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0yLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTItMy5odG1sPzg0YzQiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWlpKSBXZSBoYXZlIGRldmVsb3BlZCBhIG1hcmtldGluZyBwbGFuIHRoYXQgY2FuIGJlIHN1c3RhaW5lZCBvdmVyIHRpbWVcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/7-2-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/7-2-4.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/7-2-4.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) The business plan is available in a format that can be shared with partners\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0yLTQuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTItNC5odG1sPzMzZTIiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaXYpIFRoZSBidXNpbmVzcyBwbGFuIGlzIGF2YWlsYWJsZSBpbiBhIGZvcm1hdCB0aGF0IGNhbiBiZSBzaGFyZWQgd2l0aCBwYXJ0bmVyc1xcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/7-2-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/7-3-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/7-3-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) We have explored diverse funding streams (including opportunities with non-health sectors), and chosen the most strategic option(s) for our project\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0zLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTMtMS5odG1sPzEwMmEiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaSkgV2UgaGF2ZSBleHBsb3JlZCBkaXZlcnNlIGZ1bmRpbmcgc3RyZWFtcyAoaW5jbHVkaW5nIG9wcG9ydHVuaXRpZXMgd2l0aCBub24taGVhbHRoIHNlY3RvcnMpLCBhbmQgY2hvc2VuIHRoZSBtb3N0IHN0cmF0ZWdpYyBvcHRpb24ocykgZm9yIG91ciBwcm9qZWN0XFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/7-3-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/7-3-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/7-3-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) We have identified payers and alternative payers at each level of the value chain\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0zLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTMtMi5odG1sPzNhYzYiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWkpIFdlIGhhdmUgaWRlbnRpZmllZCBwYXllcnMgYW5kIGFsdGVybmF0aXZlIHBheWVycyBhdCBlYWNoIGxldmVsIG9mIHRoZSB2YWx1ZSBjaGFpblxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/7-3-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/7-3-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/7-3-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) We have developed plans to engage with main and alternative payers\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0zLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTMtMy5odG1sPzk0MDQiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWlpKSBXZSBoYXZlIGRldmVsb3BlZCBwbGFucyB0byBlbmdhZ2Ugd2l0aCBtYWluIGFuZCBhbHRlcm5hdGl2ZSBwYXllcnNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/7-3-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/7-3-4.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/7-3-4.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) We have identified and mitigated risks for a transition plan for changing from one payer to another\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvNy0zLTQuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS83LTMtNC5odG1sP2NmMDMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaXYpIFdlIGhhdmUgaWRlbnRpZmllZCBhbmQgbWl0aWdhdGVkIHJpc2tzIGZvciBhIHRyYW5zaXRpb24gcGxhbiBmb3IgY2hhbmdpbmcgZnJvbSBvbmUgcGF5ZXIgdG8gYW5vdGhlclxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/7-3-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-1-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-1-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) The application includes data quality assurance measures, such as validation rules and logic checks, to reduce data entry errors and increase accuracy\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0xLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS84LTEtMS5odG1sPzIwNjciXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaSkgVGhlIGFwcGxpY2F0aW9uIGluY2x1ZGVzIGRhdGEgcXVhbGl0eSBhc3N1cmFuY2UgbWVhc3VyZXMsIHN1Y2ggYXMgdmFsaWRhdGlvbiBydWxlcyBhbmQgbG9naWMgY2hlY2tzLCB0byByZWR1Y2UgZGF0YSBlbnRyeSBlcnJvcnMgYW5kIGluY3JlYXNlIGFjY3VyYWN5XFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-1-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-1-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-1-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) A user-appropriate dashboard allows the data to be accessed and monitored in real time\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0xLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS84LTEtMi5odG1sPzZlZmEiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWkpIEEgdXNlci1hcHByb3ByaWF0ZSBkYXNoYm9hcmQgYWxsb3dzIHRoZSBkYXRhIHRvIGJlIGFjY2Vzc2VkIGFuZCBtb25pdG9yZWQgaW4gcmVhbCB0aW1lXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-1-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-1-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-1-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) There is a process in place for extracting and exporting the data that are appropriate to its users\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0xLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS84LTEtMy5odG1sPzIzYzAiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWlpKSBUaGVyZSBpcyBhIHByb2Nlc3MgaW4gcGxhY2UgZm9yIGV4dHJhY3RpbmcgYW5kIGV4cG9ydGluZyB0aGUgZGF0YSB0aGF0IGFyZSBhcHByb3ByaWF0ZSB0byBpdHMgdXNlcnNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-1-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-2-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-2-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) The processing capacity (i.e. the capacity to handle requests or deliver them through the data centre) is appropriate for the anticipated scope of scale\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0yLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS84LTItMS5odG1sP2NlNDMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaSkgVGhlIHByb2Nlc3NpbmcgY2FwYWNpdHkgKGkuZS4gdGhlIGNhcGFjaXR5IHRvIGhhbmRsZSByZXF1ZXN0cyBvciBkZWxpdmVyIHRoZW0gdGhyb3VnaCB0aGUgZGF0YSBjZW50cmUpIGlzIGFwcHJvcHJpYXRlIGZvciB0aGUgYW50aWNpcGF0ZWQgc2NvcGUgb2Ygc2NhbGVcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-2-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-2-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) The latency of the data centre based on its location is appropriate for the anticipated scope of scale\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0yLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS84LTItMi5odG1sPzM0ZjQiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWkpIFRoZSBsYXRlbmN5IG9mIHRoZSBkYXRhIGNlbnRyZSBiYXNlZCBvbiBpdHMgbG9jYXRpb24gaXMgYXBwcm9wcmlhdGUgZm9yIHRoZSBhbnRpY2lwYXRlZCBzY29wZSBvZiBzY2FsZVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-2-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-2-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) The bandwidth for data transmission is sufficient for the anticipated scope of scale\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0yLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS84LTItMy5odG1sPzBhZjAiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWlpKSBUaGUgYmFuZHdpZHRoIGZvciBkYXRhIHRyYW5zbWlzc2lvbiBpcyBzdWZmaWNpZW50IGZvciB0aGUgYW50aWNpcGF0ZWQgc2NvcGUgb2Ygc2NhbGVcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-2-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-2-4.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-2-4.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) The data storage system has been configured to accommodate anticipated increases in data volume\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0yLTQuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS84LTItNC5odG1sPzljYWYiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaXYpIFRoZSBkYXRhIHN0b3JhZ2Ugc3lzdGVtIGhhcyBiZWVuIGNvbmZpZ3VyZWQgdG8gYWNjb21tb2RhdGUgYW50aWNpcGF0ZWQgaW5jcmVhc2VzIGluIGRhdGEgdm9sdW1lXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-2-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-2-5.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-2-5.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    v) The project operations adhere to government requirements on data storage/hosting\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0yLTUuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS84LTItNS5odG1sPzk4NGMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgdikgVGhlIHByb2plY3Qgb3BlcmF0aW9ucyBhZGhlcmUgdG8gZ292ZXJubWVudCByZXF1aXJlbWVudHMgb24gZGF0YSBzdG9yYWdlL2hvc3RpbmdcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-2-5.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-2-6.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-2-6.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\nvi) The system as a whole has successfully passed a stress test\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0yLTYuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS84LTItNi5odG1sPzMwZTYiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG52aSkgVGhlIHN5c3RlbSBhcyBhIHdob2xlIGhhcyBzdWNjZXNzZnVsbHkgcGFzc2VkIGEgc3RyZXNzIHRlc3RcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-2-6.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-3a-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-3a-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) There is a secure connection to the server\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYS0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYS0xLmh0bWw/MTM1MCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpKSBUaGVyZSBpcyBhIHNlY3VyZSBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXJcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-3a-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-3a-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-3a-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) There are security mechanisms in place for accessing the data (e.g authentication process)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYS0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYS0yLmh0bWw/NmNiYSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgVGhlcmUgYXJlIHNlY3VyaXR5IG1lY2hhbmlzbXMgaW4gcGxhY2UgZm9yIGFjY2Vzc2luZyB0aGUgZGF0YSAoZS5nIGF1dGhlbnRpY2F0aW9uIHByb2Nlc3MpXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-3a-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-3a-3.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-3a-3.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) There are security mechanisms for using the device (e.g. passcode)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYS0zLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYS0zLmh0bWw/N2M2YiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaWkpIFRoZXJlIGFyZSBzZWN1cml0eSBtZWNoYW5pc21zIGZvciB1c2luZyB0aGUgZGV2aWNlIChlLmcuIHBhc3Njb2RlKVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-3a-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-3a-4.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-3a-4.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iv) A protocol is in place for responding to breaches in compliance and guaranteeing accountability\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYS00Lmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYS00Lmh0bWw/NzllZCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpdikgQSBwcm90b2NvbCBpcyBpbiBwbGFjZSBmb3IgcmVzcG9uZGluZyB0byBicmVhY2hlcyBpbiBjb21wbGlhbmNlIGFuZCBndWFyYW50ZWVpbmcgYWNjb3VudGFiaWxpdHlcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-3a-4.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-3b-1.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-3b-1.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\ni) The mHealth product meets relevant national eHealth security standards for data collection, transmission and storage\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYi0xLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYi0xLmh0bWw/NWMwOSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbmkpIFRoZSBtSGVhbHRoIHByb2R1Y3QgbWVldHMgcmVsZXZhbnQgbmF0aW9uYWwgZUhlYWx0aCBzZWN1cml0eSBzdGFuZGFyZHMgZm9yIGRhdGEgY29sbGVjdGlvbiwgdHJhbnNtaXNzaW9uIGFuZCBzdG9yYWdlXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-3b-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/8-3b-2.html":
/*!*******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/8-3b-2.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) The mHealth product adheres to national data privacy policies and standards for protecting client data (e.g. HIPAA in the United States)*\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYi0yLmh0bWwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOC0zYi0yLmh0bWw/YzhiNCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+XFxyXFxuICA8dHJhbnNsYXRlPlxcclxcbiAgICBpaSkgVGhlIG1IZWFsdGggcHJvZHVjdCBhZGhlcmVzIHRvIG5hdGlvbmFsIGRhdGEgcHJpdmFjeSBwb2xpY2llcyBhbmQgc3RhbmRhcmRzIGZvciBwcm90ZWN0aW5nIGNsaWVudCBkYXRhIChlLmcuIEhJUEFBIGluIHRoZSBVbml0ZWQgU3RhdGVzKSpcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/8-3b-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/9-1-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/9-1-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) We have identified the types of systems with which the mHealth product will need to interoperate (e.g. DHIS2, eLMIS, HRIS)*\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOS0xLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS85LTEtMS5odG1sPzMyNzciXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaSkgV2UgaGF2ZSBpZGVudGlmaWVkIHRoZSB0eXBlcyBvZiBzeXN0ZW1zIHdpdGggd2hpY2ggdGhlIG1IZWFsdGggcHJvZHVjdCB3aWxsIG5lZWQgdG8gaW50ZXJvcGVyYXRlIChlLmcuIERISVMyLCBlTE1JUywgSFJJUykqXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/9-1-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/9-1-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/9-1-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) We have identified the types of applications/software/functions with which the mHealth product will ideally interoperate (e.g. mobile money applications)\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOS0xLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS85LTEtMi5odG1sPzdkZjkiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWkpIFdlIGhhdmUgaWRlbnRpZmllZCB0aGUgdHlwZXMgb2YgYXBwbGljYXRpb25zL3NvZnR3YXJlL2Z1bmN0aW9ucyB3aXRoIHdoaWNoIHRoZSBtSGVhbHRoIHByb2R1Y3Qgd2lsbCBpZGVhbGx5IGludGVyb3BlcmF0ZSAoZS5nLiBtb2JpbGUgbW9uZXkgYXBwbGljYXRpb25zKVxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/9-1-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/9-1-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/9-1-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) We have designed the application with the use of data dictionaries in order to adhere to data standards used by the appropriate systems\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOS0xLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS85LTEtMy5odG1sP2Q2MTEiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWlpKSBXZSBoYXZlIGRlc2lnbmVkIHRoZSBhcHBsaWNhdGlvbiB3aXRoIHRoZSB1c2Ugb2YgZGF0YSBkaWN0aW9uYXJpZXMgaW4gb3JkZXIgdG8gYWRoZXJlIHRvIGRhdGEgc3RhbmRhcmRzIHVzZWQgYnkgdGhlIGFwcHJvcHJpYXRlIHN5c3RlbXNcXHJcXG4gIDwvdHJhbnNsYXRlPlxcclxcbjwvcD5cIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/9-1-3.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/9-2-1.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/9-2-1.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    i) The mHealth product meets the data standards (e.g. HL7) used by the government health information systems (e.g. DHIS2, eLMIS)*\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOS0yLTEuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS85LTItMS5odG1sP2Y3NTYiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaSkgVGhlIG1IZWFsdGggcHJvZHVjdCBtZWV0cyB0aGUgZGF0YSBzdGFuZGFyZHMgKGUuZy4gSEw3KSB1c2VkIGJ5IHRoZSBnb3Zlcm5tZW50IGhlYWx0aCBpbmZvcm1hdGlvbiBzeXN0ZW1zIChlLmcuIERISVMyLCBlTE1JUykqXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/9-2-1.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/9-2-2.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/9-2-2.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    ii) The mHealth product adheres to clinical terminology standards where appropriate (e.g. ICD-10, SNOMED CT)*\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOS0yLTIuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS85LTItMi5odG1sPzU5ZGMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWkpIFRoZSBtSGVhbHRoIHByb2R1Y3QgYWRoZXJlcyB0byBjbGluaWNhbCB0ZXJtaW5vbG9neSBzdGFuZGFyZHMgd2hlcmUgYXBwcm9wcmlhdGUgKGUuZy4gSUNELTEwLCBTTk9NRUQgQ1QpKlxcclxcbiAgPC90cmFuc2xhdGU+XFxyXFxuPC9wPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/9-2-2.html\n");

/***/ }),

/***/ "./src/MapsToolkit/Resource/template/9-2-3.html":
/*!******************************************************!*\
  !*** ./src/MapsToolkit/Resource/template/9-2-3.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<p>\\r\\n  <translate>\\r\\n    iii) The mHealth product adheres to other terminology standards where appropriate (e.g. INN)*\\r\\n  </translate>\\r\\n</p>\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvTWFwc1Rvb2xraXQvUmVzb3VyY2UvdGVtcGxhdGUvOS0yLTMuaHRtbC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9NYXBzVG9vbGtpdC9SZXNvdXJjZS90ZW1wbGF0ZS85LTItMy5odG1sPzAwNTUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxwPlxcclxcbiAgPHRyYW5zbGF0ZT5cXHJcXG4gICAgaWlpKSBUaGUgbUhlYWx0aCBwcm9kdWN0IGFkaGVyZXMgdG8gb3RoZXIgdGVybWlub2xvZ3kgc3RhbmRhcmRzIHdoZXJlIGFwcHJvcHJpYXRlIChlLmcuIElOTikqXFxyXFxuICA8L3RyYW5zbGF0ZT5cXHJcXG48L3A+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/MapsToolkit/Resource/template/9-2-3.html\n");

/***/ })

}]);