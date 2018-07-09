(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[628],{

/***/ "./src/Project/CollapsibleSet.js":
/*!***************************************!*\
  !*** ./src/Project/CollapsibleSet.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _angular = __webpack_require__(/*! angular */ \"./node_modules/angular/index.js\");\n\nvar _angular2 = _interopRequireDefault(_angular);\n\nvar _remove = __webpack_require__(/*! lodash/remove */ \"./node_modules/lodash/remove.js\");\n\nvar _remove2 = _interopRequireDefault(_remove);\n\nvar _moment = __webpack_require__(/*! moment */ \"./node_modules/moment/moment.js\");\n\nvar _moment2 = _interopRequireDefault(_moment);\n\nvar _debounce = __webpack_require__(/*! lodash/debounce */ \"./node_modules/lodash/debounce.js\");\n\nvar _debounce2 = _interopRequireDefault(_debounce);\n\nvar _Utilities = __webpack_require__(/*! ../Utilities */ \"./src/Utilities.js\");\n\nvar _projects = __webpack_require__(/*! ../store/modules/projects */ \"./src/store/modules/projects.js\");\n\nvar ProjectModule = _interopRequireWildcard(_projects);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar CollapsibleSet = function () {\n    function CollapsibleSet(element, scope, collectionName) {\n        var resetDefaultList = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];\n        var emptyCheckableArray = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];\n        var $ngRedux = arguments[5];\n\n        _classCallCheck(this, CollapsibleSet);\n\n        this.EE = window.EE;\n        this.element = element;\n        this.scope = scope;\n        this.$ngRedux = $ngRedux;\n        this.toggleClass = 'collapsed';\n        this.activateClass = 'active';\n        this.collectionName = collectionName;\n        this.resetDefaultList = resetDefaultList;\n        this.emptyCheckableArray = emptyCheckableArray;\n        this.dispatchChange = (0, _debounce2.default)(this.dispatchChange.bind(this), 300);\n    }\n\n    _createClass(CollapsibleSet, [{\n        key: 'defaultOnInit',\n        value: function defaultOnInit() {\n            var _this = this;\n\n            this.bindElementClick();\n            this.elementId = this.element[0].getAttribute('id');\n            this.elementMainSection = this.element[0].getElementsByClassName('project-section')[0];\n            this.EE.on('activateFieldSet', this.activateFieldSet, this);\n            setTimeout(function () {\n                _this.EE.emit('componentLoaded', _this.elementId);\n            });\n            this.defaultWatchers();\n            this.fixUrl = _Utilities.fixUrl;\n        }\n    }, {\n        key: 'defaultWatchers',\n        value: function defaultWatchers() {\n            var _this2 = this;\n\n            if (this.resetDefaultList && this.resetDefaultList.length > 0) {\n                this.resetDefaultList.forEach(function (item) {\n                    _this2.scope.$watch(function (s) {\n                        return s.vm[item.toWatch];\n                    }, _this2.emptyCustom.bind(_this2, item.field));\n                });\n            }\n            if (this.emptyCheckableArray && this.emptyCheckableArray.length > 0) {\n                this.emptyCheckableArray.forEach(function (item) {\n                    _this2.project[item.toWatch].forEach(function (innerItem, index) {\n                        _this2.scope.$watch(function (s) {\n                            return s.vm.project[item.toWatch][index];\n                        }, _this2.emptyCheckable.bind(_this2, item.check, item.field), true);\n                    });\n                });\n            }\n        }\n    }, {\n        key: 'dispatchChange',\n        value: function dispatchChange(field, change) {\n            var project = {};\n            project[field] = _angular2.default.copy(change);\n            this.$ngRedux.dispatch(ProjectModule.updateEditedProject(project));\n        }\n    }, {\n        key: 'emptyCustom',\n        value: function emptyCustom(field, checkbox) {\n            if (checkbox === false) {\n                this.project[field].custom = undefined;\n            }\n        }\n    }, {\n        key: 'emptyCheckable',\n        value: function emptyCheckable(check, field, item) {\n            if (!item[check]) {\n                item[field] = undefined;\n            }\n        }\n    }, {\n        key: 'defaultOnDestroy',\n        value: function defaultOnDestroy() {\n            this.EE.removeListener('projectScrollTo', this.activateFieldSet);\n        }\n    }, {\n        key: 'bindElementClick',\n        value: function bindElementClick() {\n            var _this3 = this;\n\n            var self = this;\n            this.element[0].addEventListener('click', function () {\n                self.EE.emit('activateFieldSet', _this3.elementId);\n            });\n        }\n    }, {\n        key: 'activateFieldSet',\n        value: function activateFieldSet(hash) {\n            if (hash === this.elementId) {\n                this.elementMainSection.classList.add(this.activateClass);\n            } else {\n                this.elementMainSection.classList.remove(this.activateClass);\n            }\n        }\n    }, {\n        key: 'addChild',\n        value: function addChild(childName) {\n            var child = this[this.collectionName][childName];\n            var toAdd = typeof child[0] === 'string' ? '' : {};\n            child.push(toAdd);\n        }\n    }, {\n        key: 'removeChild',\n        value: function removeChild(index, childName) {\n            var collection = this[this.collectionName][childName].splice(index, 1);\n            this.dispatchChange(childName, this[this.collectionName][childName]);\n            return collection;\n        }\n    }, {\n        key: 'showAddMore',\n        value: function showAddMore(index, collection) {\n            return index === collection.length - 1;\n        }\n    }, {\n        key: 'showRemove',\n        value: function showRemove(index, collection) {\n            return collection.length > 1;\n        }\n    }, {\n        key: 'collapse',\n        value: function collapse() {\n            this.elementMainSection.classList.toggle(this.toggleClass);\n        }\n    }, {\n        key: 'findField',\n        value: function findField(key) {\n            var field = this[this.collectionName][key];\n            return field && field.standard ? field.standard : field;\n        }\n    }, {\n        key: 'checkboxToggle',\n        value: function checkboxToggle(t, key) {\n            if (!t || !key) {\n                return;\n            }\n            var field = this.findField(key);\n            if (this.checkboxChecked(t, key)) {\n                (0, _remove2.default)(field, function (item) {\n                    return item === t.id;\n                });\n            } else {\n                field.push(t.id);\n            }\n            this.dispatchChange(key, field);\n        }\n    }, {\n        key: 'checkboxChecked',\n        value: function checkboxChecked(t, key) {\n            if (!t || !key) {\n                return false;\n            }\n            var field = this.findField(key);\n            return field && field.length ? field.some(function (f) {\n                return f === t.id;\n            }) : false;\n        }\n    }, {\n        key: 'printDate',\n        value: function printDate(date) {\n            if (date) {\n                return (0, _moment2.default)(date).format('DD-MM-YYYY');\n            }\n            return '';\n        }\n    }, {\n        key: 'setAvailableOptions',\n        value: function setAvailableOptions(category, options, fieldName) {\n            if (category && category.length > 0) {\n                var used = category.map(function (cat) {\n                    return cat[fieldName];\n                }).filter(function (name) {\n                    return name;\n                });\n                category.forEach(function (item) {\n                    var available = options.filter(function (p) {\n                        return used.indexOf(p) === -1;\n                    });\n                    if (item[fieldName]) {\n                        available.push(item[fieldName]);\n                    }\n                    available.sort(function (a, b) {\n                        return a.localeCompare(b);\n                    });\n                    item.available = available;\n                });\n            }\n        }\n    }, {\n        key: 'setAvailableDictOptions',\n        value: function setAvailableDictOptions(category, options, fieldName) {\n            if (category && category.length > 0) {\n                fieldName = fieldName ? fieldName : 'id';\n                var used = category.filter(function (cat) {\n                    return cat[fieldName];\n                });\n                category.forEach(function (item) {\n                    var available = options.filter(function (p) {\n                        return item[fieldName] === p.id || used.every(function (u) {\n                            return u[fieldName] !== p.id;\n                        });\n                    });\n                    available.sort(function (a, b) {\n                        return a.name.localeCompare(b.name);\n                    });\n                    item.available = available;\n                });\n            }\n        }\n    }, {\n        key: 'handleCustomError',\n        value: function handleCustomError(key) {\n            if (this.form[key]) {\n                this.form[key].$setValidity('custom', true);\n                this.form[key].customError = [];\n            }\n        }\n    }, {\n        key: 'setCustomError',\n        value: function setCustomError(key, error) {\n            key = key.trim();\n            var element = this.form[key];\n            if (element) {\n                var errors = element.customError || [];\n                if (errors.indexOf(error) === -1) {\n                    errors.push(error);\n                }\n                element.$setValidity('custom', false);\n                element.customError = errors;\n            } else {\n                console.warn('trying to set an error on an unexisting form element: ', key);\n            }\n        }\n    }]);\n\n    return CollapsibleSet;\n}();\n\nexports.default = CollapsibleSet;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9Db2xsYXBzaWJsZVNldC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvUHJvamVjdC9Db2xsYXBzaWJsZVNldC5qcz80MDM2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhbmd1bGFyIGZyb20gJ2FuZ3VsYXInO1xuaW1wb3J0IHJlbW92ZSBmcm9tICdsb2Rhc2gvcmVtb3ZlJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2gvZGVib3VuY2UnO1xuaW1wb3J0IHsgZml4VXJsIH0gZnJvbSAnLi4vVXRpbGl0aWVzJztcbmltcG9ydCAqIGFzIFByb2plY3RNb2R1bGUgZnJvbSAnLi4vc3RvcmUvbW9kdWxlcy9wcm9qZWN0cyc7XG5cbmNsYXNzIENvbGxhcHNpYmxlU2V0IHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBzY29wZSwgY29sbGVjdGlvbk5hbWUsIHJlc2V0RGVmYXVsdExpc3QgPSBbXSwgZW1wdHlDaGVja2FibGVBcnJheSA9IFtdLCAkbmdSZWR1eCkge1xuICAgICAgICB0aGlzLkVFID0gd2luZG93LkVFO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgICAgIHRoaXMuJG5nUmVkdXggPSAkbmdSZWR1eDtcbiAgICAgICAgdGhpcy50b2dnbGVDbGFzcyA9ICdjb2xsYXBzZWQnO1xuICAgICAgICB0aGlzLmFjdGl2YXRlQ2xhc3MgPSAnYWN0aXZlJztcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uTmFtZSA9IGNvbGxlY3Rpb25OYW1lO1xuICAgICAgICB0aGlzLnJlc2V0RGVmYXVsdExpc3QgPSByZXNldERlZmF1bHRMaXN0O1xuICAgICAgICB0aGlzLmVtcHR5Q2hlY2thYmxlQXJyYXkgPSBlbXB0eUNoZWNrYWJsZUFycmF5O1xuICAgICAgICB0aGlzLmRpc3BhdGNoQ2hhbmdlID0gZGVib3VuY2UodGhpcy5kaXNwYXRjaENoYW5nZS5iaW5kKHRoaXMpLCAzMDApO1xuICAgIH1cblxuICAgIGRlZmF1bHRPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuYmluZEVsZW1lbnRDbGljaygpO1xuICAgICAgICB0aGlzLmVsZW1lbnRJZCA9IHRoaXMuZWxlbWVudFswXS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudE1haW5TZWN0aW9uID0gdGhpcy5lbGVtZW50WzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Byb2plY3Qtc2VjdGlvbicpWzBdO1xuICAgICAgICB0aGlzLkVFLm9uKCdhY3RpdmF0ZUZpZWxkU2V0JywgdGhpcy5hY3RpdmF0ZUZpZWxkU2V0LCB0aGlzKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLkVFLmVtaXQoJ2NvbXBvbmVudExvYWRlZCcsIHRoaXMuZWxlbWVudElkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGVmYXVsdFdhdGNoZXJzKCk7XG4gICAgICAgIHRoaXMuZml4VXJsID0gZml4VXJsO1xuICAgIH1cblxuICAgIGRlZmF1bHRXYXRjaGVycygpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzZXREZWZhdWx0TGlzdCAmJiB0aGlzLnJlc2V0RGVmYXVsdExpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5yZXNldERlZmF1bHRMaXN0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZS4kd2F0Y2gocyA9PiBzLnZtW2l0ZW0udG9XYXRjaF0sIHRoaXMuZW1wdHlDdXN0b20uYmluZCh0aGlzLCBpdGVtLmZpZWxkKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5lbXB0eUNoZWNrYWJsZUFycmF5ICYmIHRoaXMuZW1wdHlDaGVja2FibGVBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmVtcHR5Q2hlY2thYmxlQXJyYXkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3RbaXRlbS50b1dhdGNoXS5mb3JFYWNoKChpbm5lckl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUuJHdhdGNoKHMgPT4gcy52bS5wcm9qZWN0W2l0ZW0udG9XYXRjaF1baW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1wdHlDaGVja2FibGUuYmluZCh0aGlzLCBpdGVtLmNoZWNrLCBpdGVtLmZpZWxkKSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpc3BhdGNoQ2hhbmdlKGZpZWxkLCBjaGFuZ2UpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IHt9O1xuICAgICAgICBwcm9qZWN0W2ZpZWxkXSA9IGFuZ3VsYXIuY29weShjaGFuZ2UpO1xuICAgICAgICB0aGlzLiRuZ1JlZHV4LmRpc3BhdGNoKFByb2plY3RNb2R1bGUudXBkYXRlRWRpdGVkUHJvamVjdChwcm9qZWN0KSk7XG4gICAgfVxuXG4gICAgZW1wdHlDdXN0b20oZmllbGQsIGNoZWNrYm94KSB7XG4gICAgICAgIGlmIChjaGVja2JveCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMucHJvamVjdFtmaWVsZF0uY3VzdG9tID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW1wdHlDaGVja2FibGUoY2hlY2ssIGZpZWxkLCBpdGVtKSB7XG4gICAgICAgIGlmICghaXRlbVtjaGVja10pIHtcbiAgICAgICAgICAgIGl0ZW1bZmllbGRdID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVmYXVsdE9uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5FRS5yZW1vdmVMaXN0ZW5lcigncHJvamVjdFNjcm9sbFRvJywgdGhpcy5hY3RpdmF0ZUZpZWxkU2V0KTtcbiAgICB9XG5cbiAgICBiaW5kRWxlbWVudENsaWNrKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5lbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PiB7XG4gICAgICAgICAgICBzZWxmLkVFLmVtaXQoJ2FjdGl2YXRlRmllbGRTZXQnLCB0aGlzLmVsZW1lbnRJZCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFjdGl2YXRlRmllbGRTZXQoaGFzaCkge1xuICAgICAgICBpZiAoaGFzaCA9PT0gdGhpcy5lbGVtZW50SWQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudE1haW5TZWN0aW9uLmNsYXNzTGlzdC5hZGQodGhpcy5hY3RpdmF0ZUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudE1haW5TZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5hY3RpdmF0ZUNsYXNzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZENoaWxkKGNoaWxkTmFtZSkge1xuICAgICAgICBjb25zdCBjaGlsZCA9IHRoaXNbdGhpcy5jb2xsZWN0aW9uTmFtZV1bY2hpbGROYW1lXTtcbiAgICAgICAgY29uc3QgdG9BZGQgPSB0eXBlb2YgY2hpbGRbMF0gPT09ICdzdHJpbmcnID8gJycgOiB7fTtcbiAgICAgICAgY2hpbGQucHVzaCh0b0FkZCk7XG4gICAgfVxuICAgIHJlbW92ZUNoaWxkKGluZGV4LCBjaGlsZE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9ICB0aGlzW3RoaXMuY29sbGVjdGlvbk5hbWVdW2NoaWxkTmFtZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaENoYW5nZShjaGlsZE5hbWUsIHRoaXNbdGhpcy5jb2xsZWN0aW9uTmFtZV1bY2hpbGROYW1lXSk7XG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH1cblxuICAgIHNob3dBZGRNb3JlKGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBpbmRleCA9PT0gKGNvbGxlY3Rpb24ubGVuZ3RoIC0gMSk7XG4gICAgfVxuXG4gICAgc2hvd1JlbW92ZShpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5sZW5ndGggPiAxO1xuICAgIH1cblxuICAgIGNvbGxhcHNlKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRNYWluU2VjdGlvbi5jbGFzc0xpc3QudG9nZ2xlKHRoaXMudG9nZ2xlQ2xhc3MpO1xuICAgIH1cblxuICAgIGZpbmRGaWVsZChrZXkpIHtcbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzW3RoaXMuY29sbGVjdGlvbk5hbWVdW2tleV07XG4gICAgICAgIHJldHVybiBmaWVsZCAmJiBmaWVsZC5zdGFuZGFyZCA/IGZpZWxkLnN0YW5kYXJkIDogZmllbGQ7XG4gICAgfVxuXG4gICAgY2hlY2tib3hUb2dnbGUodCwga2V5KSB7XG4gICAgICAgIGlmICghdCB8fCAha2V5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZpbmRGaWVsZChrZXkpO1xuICAgICAgICBpZiAodGhpcy5jaGVja2JveENoZWNrZWQodCwga2V5KSkge1xuICAgICAgICAgICAgcmVtb3ZlKGZpZWxkLCBpdGVtID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbSA9PT0gdC5pZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmllbGQucHVzaCh0LmlkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BhdGNoQ2hhbmdlKGtleSwgZmllbGQpO1xuICAgIH1cblxuICAgIGNoZWNrYm94Q2hlY2tlZCh0LCBrZXkpIHtcbiAgICAgICAgaWYgKCF0IHx8ICFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmluZEZpZWxkKGtleSk7XG4gICAgICAgIHJldHVybiBmaWVsZCAmJiBmaWVsZC5sZW5ndGggPyBmaWVsZC5zb21lKGYgPT4gZiA9PT0gdC5pZCkgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcmludERhdGUoZGF0ZSkge1xuICAgICAgICBpZiAoZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mb3JtYXQoJ0RELU1NLVlZWVknKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgc2V0QXZhaWxhYmxlT3B0aW9ucyhjYXRlZ29yeSwgb3B0aW9ucywgZmllbGROYW1lKSB7XG4gICAgICAgIGlmIChjYXRlZ29yeSAmJiBjYXRlZ29yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCB1c2VkID0gY2F0ZWdvcnkubWFwKGNhdCA9PiBjYXRbZmllbGROYW1lXSkuZmlsdGVyKG5hbWUgPT4gbmFtZSk7XG4gICAgICAgICAgICBjYXRlZ29yeS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF2YWlsYWJsZSA9IG9wdGlvbnMuZmlsdGVyKHAgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXNlZC5pbmRleE9mKHApID09PSAtMTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVtmaWVsZE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZS5wdXNoKGl0ZW1bZmllbGROYW1lXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLmxvY2FsZUNvbXBhcmUoYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaXRlbS5hdmFpbGFibGUgPSBhdmFpbGFibGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEF2YWlsYWJsZURpY3RPcHRpb25zKGNhdGVnb3J5LCBvcHRpb25zLCBmaWVsZE5hbWUpIHtcbiAgICAgICAgaWYgKGNhdGVnb3J5ICYmIGNhdGVnb3J5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZpZWxkTmFtZSA9IGZpZWxkTmFtZSA/IGZpZWxkTmFtZSA6ICdpZCc7XG4gICAgICAgICAgICBjb25zdCB1c2VkID0gY2F0ZWdvcnkuZmlsdGVyKGNhdCA9PiBjYXRbZmllbGROYW1lXSk7XG4gICAgICAgICAgICBjYXRlZ29yeS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF2YWlsYWJsZSA9IG9wdGlvbnMuZmlsdGVyKHAgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVtmaWVsZE5hbWVdID09PSBwLmlkIHx8IHVzZWQuZXZlcnkodSA9PiB1W2ZpZWxkTmFtZV0gIT09IHAuaWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGF2YWlsYWJsZS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGl0ZW0uYXZhaWxhYmxlID0gYXZhaWxhYmxlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVDdXN0b21FcnJvcihrZXkpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybVtrZXldKSB7XG4gICAgICAgICAgICB0aGlzLmZvcm1ba2V5XS4kc2V0VmFsaWRpdHkoJ2N1c3RvbScsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5mb3JtW2tleV0uY3VzdG9tRXJyb3IgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1c3RvbUVycm9yKGtleSwgZXJyb3IpIHtcbiAgICAgICAga2V5ID0ga2V5LnRyaW0oKTtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZm9ybVtrZXldO1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgZXJyb3JzID0gZWxlbWVudC5jdXN0b21FcnJvciB8fCBbXTtcbiAgICAgICAgICAgIGlmIChlcnJvcnMuaW5kZXhPZihlcnJvcikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudC4kc2V0VmFsaWRpdHkoJ2N1c3RvbScsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY3VzdG9tRXJyb3IgPSBlcnJvcnM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ3RyeWluZyB0byBzZXQgYW4gZXJyb3Igb24gYW4gdW5leGlzdGluZyBmb3JtIGVsZW1lbnQ6ICcsIGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29sbGFwc2libGVTZXQ7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBOzs7Ozs7O0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTs7O0FBRUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7Ozs7QUFJQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/Project/CollapsibleSet.js\n");

/***/ })

}]);