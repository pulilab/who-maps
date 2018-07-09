(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[592],{

/***/ "./src/Storage.js":
/*!************************!*\
  !*** ./src/Storage.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar SessionStorage = function () {\n    function SessionStorage() {\n        _classCallCheck(this, SessionStorage);\n\n        this.storage = window.localStorage;\n    }\n\n    _createClass(SessionStorage, [{\n        key: 'set',\n        value: function set(key, value) {\n\n            if (typeof key !== 'string') {\n                throw new TypeError('this.storage key should be a string!');\n            }\n\n            var val = typeof value === 'string' ? value : JSON.stringify(value);\n\n            this.storage.setItem(key, val);\n        }\n    }, {\n        key: 'get',\n        value: function get(key) {\n            try {\n                return JSON.parse(this.storage.getItem(key));\n            } catch (e) {\n                return this.storage.getItem(key);\n            }\n        }\n    }, {\n        key: 'remove',\n        value: function remove(key) {\n            this.storage.removeItem(key);\n        }\n    }, {\n        key: 'clear',\n        value: function clear() {\n            this.storage.clear();\n        }\n\n        // DEBUG\n\n    }, {\n        key: 'check',\n        value: function check() {\n            console.log('this.storage contains:\\n');\n            var ret = {};\n            for (var key in this.storage) {\n                console.log(key + ': ' + this.storage.getItem(key));\n                ret[key] = this.storage.getItem(key);\n            }\n            return ret;\n        }\n    }]);\n\n    return SessionStorage;\n}();\n\nexports.default = SessionStorage;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvU3RvcmFnZS5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvU3RvcmFnZS5qcz83NjdlIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNlc3Npb25TdG9yYWdlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgIH1cblxuICAgIHNldChrZXksIHZhbHVlKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0aGlzLnN0b3JhZ2Uga2V5IHNob3VsZCBiZSBhIHN0cmluZyEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHZhbCA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgP1xuICAgICAgICAgICAgdmFsdWUgOlxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuXG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsKTtcblxuICAgIH1cblxuICAgIGdldChrZXkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZShrZXkpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgLy8gREVCVUdcbiAgICBjaGVjaygpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3RoaXMuc3RvcmFnZSBjb250YWluczpcXG4nKTtcbiAgICAgICAgY29uc3QgcmV0ID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuc3RvcmFnZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coa2V5ICsgJzogJyArIHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICAgICAgICAgICAgcmV0W2tleV0gPSB0aGlzLnN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXNzaW9uU3RvcmFnZTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBRUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFFQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQUdBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Storage.js\n");

/***/ })

}]);