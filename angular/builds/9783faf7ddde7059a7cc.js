(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[639],{

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Project/GeneralOverview/GeneralOverview.scss":
/*!***************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js!./src/Project/GeneralOverview/GeneralOverview.scss ***!
  \***************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: `sass-loader` requires `node-sass` >=4. Please install a compatible version.\\n    at Object.sassLoader (/Users/nico/Projects/who-maps/frontend/node_modules/sass-loader/lib/loader.js:31:19)\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3NyYy9Qcm9qZWN0L0dlbmVyYWxPdmVydmlldy9HZW5lcmFsT3ZlcnZpZXcuc2Nzcy5qcyIsInNvdXJjZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Project/GeneralOverview/GeneralOverview.scss\n");

/***/ }),

/***/ "./node_modules/lodash/includes.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/includes.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var baseIndexOf = __webpack_require__(/*! ./_baseIndexOf */ \"./node_modules/lodash/_baseIndexOf.js\"),\n    isArrayLike = __webpack_require__(/*! ./isArrayLike */ \"./node_modules/lodash/isArrayLike.js\"),\n    isString = __webpack_require__(/*! ./isString */ \"./node_modules/lodash/isString.js\"),\n    toInteger = __webpack_require__(/*! ./toInteger */ \"./node_modules/lodash/toInteger.js\"),\n    values = __webpack_require__(/*! ./values */ \"./node_modules/lodash/values.js\");\n\n/* Built-in method references for those with the same name as other `lodash` methods. */\nvar nativeMax = Math.max;\n\n/**\n * Checks if `value` is in `collection`. If `collection` is a string, it's\n * checked for a substring of `value`, otherwise\n * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\n * is used for equality comparisons. If `fromIndex` is negative, it's used as\n * the offset from the end of `collection`.\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Collection\n * @param {Array|Object|string} collection The collection to inspect.\n * @param {*} value The value to search for.\n * @param {number} [fromIndex=0] The index to search from.\n * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.\n * @returns {boolean} Returns `true` if `value` is found, else `false`.\n * @example\n *\n * _.includes([1, 2, 3], 1);\n * // => true\n *\n * _.includes([1, 2, 3], 1, 2);\n * // => false\n *\n * _.includes({ 'a': 1, 'b': 2 }, 1);\n * // => true\n *\n * _.includes('abcd', 'bc');\n * // => true\n */\nfunction includes(collection, value, fromIndex, guard) {\n  collection = isArrayLike(collection) ? collection : values(collection);\n  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;\n\n  var length = collection.length;\n  if (fromIndex < 0) {\n    fromIndex = nativeMax(length + fromIndex, 0);\n  }\n  return isString(collection)\n    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)\n    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);\n}\n\nmodule.exports = includes;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvbG9kYXNoL2luY2x1ZGVzLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pbmNsdWRlcy5qcz84YTMwIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Jhc2VJbmRleE9mJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNTdHJpbmcgPSByZXF1aXJlKCcuL2lzU3RyaW5nJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKSxcbiAgICB2YWx1ZXMgPSByZXF1aXJlKCcuL3ZhbHVlcycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gYGNvbGxlY3Rpb25gLiBJZiBgY29sbGVjdGlvbmAgaXMgYSBzdHJpbmcsIGl0J3NcbiAqIGNoZWNrZWQgZm9yIGEgc3Vic3RyaW5nIG9mIGB2YWx1ZWAsIG90aGVyd2lzZVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGlzIHVzZWQgZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLiBJZiBgZnJvbUluZGV4YCBpcyBuZWdhdGl2ZSwgaXQncyB1c2VkIGFzXG4gKiB0aGUgb2Zmc2V0IGZyb20gdGhlIGVuZCBvZiBgY29sbGVjdGlvbmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZnJvbUluZGV4PTBdIFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBFbmFibGVzIHVzZSBhcyBhbiBpdGVyYXRlZSBmb3IgbWV0aG9kcyBsaWtlIGBfLnJlZHVjZWAuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmluY2x1ZGVzKFsxLCAyLCAzXSwgMSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pbmNsdWRlcyhbMSwgMiwgM10sIDEsIDIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmluY2x1ZGVzKHsgJ2EnOiAxLCAnYic6IDIgfSwgMSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pbmNsdWRlcygnYWJjZCcsICdiYycpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpbmNsdWRlcyhjb2xsZWN0aW9uLCB2YWx1ZSwgZnJvbUluZGV4LCBndWFyZCkge1xuICBjb2xsZWN0aW9uID0gaXNBcnJheUxpa2UoY29sbGVjdGlvbikgPyBjb2xsZWN0aW9uIDogdmFsdWVzKGNvbGxlY3Rpb24pO1xuICBmcm9tSW5kZXggPSAoZnJvbUluZGV4ICYmICFndWFyZCkgPyB0b0ludGVnZXIoZnJvbUluZGV4KSA6IDA7XG5cbiAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuICBpZiAoZnJvbUluZGV4IDwgMCkge1xuICAgIGZyb21JbmRleCA9IG5hdGl2ZU1heChsZW5ndGggKyBmcm9tSW5kZXgsIDApO1xuICB9XG4gIHJldHVybiBpc1N0cmluZyhjb2xsZWN0aW9uKVxuICAgID8gKGZyb21JbmRleCA8PSBsZW5ndGggJiYgY29sbGVjdGlvbi5pbmRleE9mKHZhbHVlLCBmcm9tSW5kZXgpID4gLTEpXG4gICAgOiAoISFsZW5ndGggJiYgYmFzZUluZGV4T2YoY29sbGVjdGlvbiwgdmFsdWUsIGZyb21JbmRleCkgPiAtMSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5jbHVkZXM7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/lodash/includes.js\n");

/***/ }),

/***/ "./node_modules/lodash/isString.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isString.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ \"./node_modules/lodash/_baseGetTag.js\"),\n    isArray = __webpack_require__(/*! ./isArray */ \"./node_modules/lodash/isArray.js\"),\n    isObjectLike = __webpack_require__(/*! ./isObjectLike */ \"./node_modules/lodash/isObjectLike.js\");\n\n/** `Object#toString` result references. */\nvar stringTag = '[object String]';\n\n/**\n * Checks if `value` is classified as a `String` primitive or object.\n *\n * @static\n * @since 0.1.0\n * @memberOf _\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a string, else `false`.\n * @example\n *\n * _.isString('abc');\n * // => true\n *\n * _.isString(1);\n * // => false\n */\nfunction isString(value) {\n  return typeof value == 'string' ||\n    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);\n}\n\nmodule.exports = isString;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3RyaW5nLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N0cmluZy5qcz9lMmEwIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTdHJpbmdgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzdHJpbmcsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N0cmluZygnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N0cmluZygxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHxcbiAgICAoIWlzQXJyYXkodmFsdWUpICYmIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3RyaW5nVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmluZztcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/lodash/isString.js\n");

/***/ }),

/***/ "./node_modules/lodash/toFinite.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/toFinite.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var toNumber = __webpack_require__(/*! ./toNumber */ \"./node_modules/lodash/toNumber.js\");\n\n/** Used as references for various `Number` constants. */\nvar INFINITY = 1 / 0,\n    MAX_INTEGER = 1.7976931348623157e+308;\n\n/**\n * Converts `value` to a finite number.\n *\n * @static\n * @memberOf _\n * @since 4.12.0\n * @category Lang\n * @param {*} value The value to convert.\n * @returns {number} Returns the converted number.\n * @example\n *\n * _.toFinite(3.2);\n * // => 3.2\n *\n * _.toFinite(Number.MIN_VALUE);\n * // => 5e-324\n *\n * _.toFinite(Infinity);\n * // => 1.7976931348623157e+308\n *\n * _.toFinite('3.2');\n * // => 3.2\n */\nfunction toFinite(value) {\n  if (!value) {\n    return value === 0 ? value : 0;\n  }\n  value = toNumber(value);\n  if (value === INFINITY || value === -INFINITY) {\n    var sign = (value < 0 ? -1 : 1);\n    return sign * MAX_INTEGER;\n  }\n  return value === value ? value : 0;\n}\n\nmodule.exports = toFinite;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvRmluaXRlLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b0Zpbml0ZS5qcz82NDI4Il0sInNvdXJjZXNDb250ZW50IjpbInZhciB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMCxcbiAgICBNQVhfSU5URUdFUiA9IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBmaW5pdGUgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMi4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9GaW5pdGUoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9GaW5pdGUoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvRmluaXRlKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0Zpbml0ZSgnMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9GaW5pdGUodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogMDtcbiAgfVxuICB2YWx1ZSA9IHRvTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlID09PSBJTkZJTklUWSB8fCB2YWx1ZSA9PT0gLUlORklOSVRZKSB7XG4gICAgdmFyIHNpZ24gPSAodmFsdWUgPCAwID8gLTEgOiAxKTtcbiAgICByZXR1cm4gc2lnbiAqIE1BWF9JTlRFR0VSO1xuICB9XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyB2YWx1ZSA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9GaW5pdGU7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/lodash/toFinite.js\n");

/***/ }),

/***/ "./node_modules/lodash/toInteger.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/toInteger.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var toFinite = __webpack_require__(/*! ./toFinite */ \"./node_modules/lodash/toFinite.js\");\n\n/**\n * Converts `value` to an integer.\n *\n * **Note:** This method is loosely based on\n * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to convert.\n * @returns {number} Returns the converted integer.\n * @example\n *\n * _.toInteger(3.2);\n * // => 3\n *\n * _.toInteger(Number.MIN_VALUE);\n * // => 0\n *\n * _.toInteger(Infinity);\n * // => 1.7976931348623157e+308\n *\n * _.toInteger('3.2');\n * // => 3\n */\nfunction toInteger(value) {\n  var result = toFinite(value),\n      remainder = result % 1;\n\n  return result === result ? (remainder ? result - remainder : result) : 0;\n}\n\nmodule.exports = toInteger;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvSW50ZWdlci5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdG9JbnRlZ2VyLmpzPzRiMTciXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHRvRmluaXRlID0gcmVxdWlyZSgnLi90b0Zpbml0ZScpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gaW50ZWdlci5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0ludGVnZXJgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9pbnRlZ2VyKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvSW50ZWdlcigzLjIpO1xuICogLy8gPT4gM1xuICpcbiAqIF8udG9JbnRlZ2VyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gMFxuICpcbiAqIF8udG9JbnRlZ2VyKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0ludGVnZXIoJzMuMicpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IHRvRmluaXRlKHZhbHVlKSxcbiAgICAgIHJlbWFpbmRlciA9IHJlc3VsdCAlIDE7XG5cbiAgcmV0dXJuIHJlc3VsdCA9PT0gcmVzdWx0ID8gKHJlbWFpbmRlciA/IHJlc3VsdCAtIHJlbWFpbmRlciA6IHJlc3VsdCkgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvSW50ZWdlcjtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/lodash/toInteger.js\n");

/***/ }),

/***/ "./src/Project/GeneralOverview/GeneralOverview.scss":
/*!**********************************************************!*\
  !*** ./src/Project/GeneralOverview/GeneralOverview.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/postcss-loader/lib!../../../node_modules/sass-loader/lib/loader.js!./GeneralOverview.scss */ \"./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js!./src/Project/GeneralOverview/GeneralOverview.scss\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9HZW5lcmFsT3ZlcnZpZXcvR2VuZXJhbE92ZXJ2aWV3LnNjc3MuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvUHJvamVjdC9HZW5lcmFsT3ZlcnZpZXcvR2VuZXJhbE92ZXJ2aWV3LnNjc3M/M2E5OCJdLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL0dlbmVyYWxPdmVydmlldy5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vR2VuZXJhbE92ZXJ2aWV3LnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vR2VuZXJhbE92ZXJ2aWV3LnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Project/GeneralOverview/GeneralOverview.scss\n");

/***/ }),

/***/ "./src/Project/GeneralOverview/GeneralOverviewController.js":
/*!******************************************************************!*\
  !*** ./src/Project/GeneralOverview/GeneralOverviewController.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"]) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); } }; }();\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _includes = __webpack_require__(/*! lodash/includes */ \"./node_modules/lodash/includes.js\");\n\nvar _includes2 = _interopRequireDefault(_includes);\n\nvar _moment = __webpack_require__(/*! moment */ \"./node_modules/moment/moment.js\");\n\nvar _moment2 = _interopRequireDefault(_moment);\n\nvar _CollapsibleSet2 = __webpack_require__(/*! ../CollapsibleSet */ \"./src/Project/CollapsibleSet.js\");\n\nvar _CollapsibleSet3 = _interopRequireDefault(_CollapsibleSet2);\n\nvar _projects = __webpack_require__(/*! ../../store/modules/projects */ \"./src/store/modules/projects.js\");\n\nvar ProjectModule = _interopRequireWildcard(_projects);\n\nvar _countries = __webpack_require__(/*! ../../store/modules/countries */ \"./src/store/modules/countries.js\");\n\nvar CountriesModule = _interopRequireWildcard(_countries);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step(\"next\", value); }, function (err) { step(\"throw\", err); }); } } return step(\"next\"); }); }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar GeneralOverviewController = function (_CollapsibleSet) {\n    _inherits(GeneralOverviewController, _CollapsibleSet);\n\n    function GeneralOverviewController($scope, $element, $state, $ngRedux) {\n        _classCallCheck(this, GeneralOverviewController);\n\n        var _this = _possibleConstructorReturn(this, (GeneralOverviewController.__proto__ || Object.getPrototypeOf(GeneralOverviewController)).call(this, $element, $scope, 'project', [], [], $ngRedux));\n\n        _this.state = $state;\n        _this.$onInit = _this.onInit.bind(_this);\n        _this.$onDestroy = _this.onDestroy.bind(_this);\n        _this.mapData = _this.mapData.bind(_this);\n        _this.getUsers = _this.getUsers.bind(_this);\n        _this.checkName = _this.checkName.bind(_this);\n        _this.validateDateRange = _this.validateDateRange.bind(_this);\n        _this.openSimilarProject = _this.openSimilarProject.bind(_this);\n        return _this;\n    }\n\n    _createClass(GeneralOverviewController, [{\n        key: 'mapData',\n        value: function mapData(state) {\n            var _this2 = this;\n\n            var similarProject = ProjectModule.getSimilarProject(state).filter(function (p) {\n                return !_this2.project || p.id !== _this2.project.id;\n            });\n            return {\n                similarProject: similarProject,\n                countriesList: CountriesModule.getCountriesList(state)\n            };\n        }\n    }, {\n        key: 'onInit',\n        value: function onInit() {\n            this.defaultOnInit();\n            this.unsubscribe = this.$ngRedux.connect(this.mapData, ProjectModule)(this);\n            this.watchers();\n        }\n    }, {\n        key: 'onDestroy',\n        value: function onDestroy() {\n            this.defaultOnDestroy();\n            this.unsubscribe();\n        }\n    }, {\n        key: 'watchers',\n        value: function watchers() {\n            var _this3 = this;\n\n            this.scope.$watch(function (s) {\n                return s.vm.project.name;\n            }, function (name) {\n                _this3.projectName = name;\n                _this3.currentName = _this3.currentName || name;\n            });\n\n            this.scope.$watchGroup([function (s) {\n                return s.vm.project.start_date;\n            }, function (s) {\n                return s.vm.project.end_date;\n            }], this.validateDateRange);\n        }\n    }, {\n        key: 'validateDateRange',\n        value: function validateDateRange(_ref) {\n            var _ref2 = _slicedToArray(_ref, 2),\n                start = _ref2[0],\n                end = _ref2[1];\n\n            if (!start || !end) {\n                return;\n            }\n            start = (0, _moment2.default)(start);\n            end = (0, _moment2.default)(end);\n            if (start.isAfter(end)) {\n                this.setCustomError('start_date', 'Start date can not be later than the end date');\n                this.setCustomError('end_date', 'End date can not be earlier than the start date');\n            } else {\n                this.handleCustomError('start_date');\n                this.handleCustomError('end_date');\n            }\n        }\n    }, {\n        key: 'getUsers',\n        value: function getUsers(criteria) {\n            return this.users.filter(function (el) {\n                // Avoid to search user that have no proper profile.\n                if (el && el.name && el.organisation_name) {\n                    return (0, _includes2.default)(el.name.toLowerCase(), criteria.toLowerCase()) || (0, _includes2.default)(el.organisation_name.toLowerCase(), criteria.toLowerCase());\n                }\n                return false;\n            });\n        }\n    }, {\n        key: 'checkName',\n        value: function () {\n            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {\n                return regeneratorRuntime.wrap(function _callee$(_context) {\n                    while (1) {\n                        switch (_context.prev = _context.next) {\n                            case 0:\n                                this.handleCustomError('name');\n\n                                if (!(this.projectName && this.projectName.length > 0 && this.projectName !== this.currentName)) {\n                                    _context.next = 5;\n                                    break;\n                                }\n\n                                _context.next = 4;\n                                return this.searchDuplicateProjectName(this.projectName);\n\n                            case 4:\n                                if (this.similarProject && this.similarProject[0] && this.similarProject[0].name.toLowerCase() === this.projectName.toLowerCase()) {\n                                    this.setCustomError('name', 'Project name is not unique');\n                                    this.dispatchChange('name', null);\n                                } else {\n                                    this.dispatchChange('name', this.projectName);\n                                }\n\n                            case 5:\n                            case 'end':\n                                return _context.stop();\n                        }\n                    }\n                }, _callee, this);\n            }));\n\n            function checkName() {\n                return _ref3.apply(this, arguments);\n            }\n\n            return checkName;\n        }()\n    }, {\n        key: 'openSimilarProject',\n        value: function openSimilarProject(project, event) {\n            event.preventDefault();\n            if (project.isOwn) {\n                this.state.go('dashboard', { appName: project.id });\n            } else {\n                this.state.go('public-dashboard', { appName: project.id });\n            }\n        }\n    }], [{\n        key: 'factory',\n        value: function factory() {\n            __webpack_require__(/*! ./GeneralOverview.scss */ \"./src/Project/GeneralOverview/GeneralOverview.scss\");\n            function generalOverview($scope, $element, $state, $ngRedux) {\n                return new GeneralOverviewController($scope, $element, $state, $ngRedux);\n            }\n            generalOverview.$inject = ['$scope', '$element', '$state', '$ngRedux'];\n            return generalOverview;\n        }\n    }]);\n\n    return GeneralOverviewController;\n}(_CollapsibleSet3.default);\n\nexports.default = GeneralOverviewController;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9HZW5lcmFsT3ZlcnZpZXcvR2VuZXJhbE92ZXJ2aWV3Q29udHJvbGxlci5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvUHJvamVjdC9HZW5lcmFsT3ZlcnZpZXcvR2VuZXJhbE92ZXJ2aWV3Q29udHJvbGxlci5qcz8yNDIzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbmNsdWRlcyBmcm9tICdsb2Rhc2gvaW5jbHVkZXMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IENvbGxhcHNpYmxlU2V0IGZyb20gJy4uL0NvbGxhcHNpYmxlU2V0JztcbmltcG9ydCAqIGFzIFByb2plY3RNb2R1bGUgZnJvbSAnLi4vLi4vc3RvcmUvbW9kdWxlcy9wcm9qZWN0cyc7XG5pbXBvcnQgKiBhcyBDb3VudHJpZXNNb2R1bGUgZnJvbSAnLi4vLi4vc3RvcmUvbW9kdWxlcy9jb3VudHJpZXMnO1xuXG5cbmNsYXNzIEdlbmVyYWxPdmVydmlld0NvbnRyb2xsZXIgZXh0ZW5kcyBDb2xsYXBzaWJsZVNldCB7XG5cbiAgICBjb25zdHJ1Y3Rvcigkc2NvcGUsICRlbGVtZW50LCAkc3RhdGUsICRuZ1JlZHV4KSB7XG4gICAgICAgIHN1cGVyKCRlbGVtZW50LCAkc2NvcGUsICdwcm9qZWN0JywgW10sIFtdLCAkbmdSZWR1eCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgIHRoaXMuJG9uSW5pdCA9IHRoaXMub25Jbml0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuJG9uRGVzdHJveSA9IHRoaXMub25EZXN0cm95LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMubWFwRGF0YSA9IHRoaXMubWFwRGF0YS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmdldFVzZXJzID0gdGhpcy5nZXRVc2Vycy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmNoZWNrTmFtZSA9IHRoaXMuY2hlY2tOYW1lLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudmFsaWRhdGVEYXRlUmFuZ2UgPSB0aGlzLnZhbGlkYXRlRGF0ZVJhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub3BlblNpbWlsYXJQcm9qZWN0ID0gdGhpcy5vcGVuU2ltaWxhclByb2plY3QuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBtYXBEYXRhKHN0YXRlKSB7XG4gICAgICAgIGNvbnN0IHNpbWlsYXJQcm9qZWN0ID0gUHJvamVjdE1vZHVsZS5nZXRTaW1pbGFyUHJvamVjdChzdGF0ZSlcbiAgICAgICAgICAuZmlsdGVyKHAgPT4gICF0aGlzLnByb2plY3QgfHwgcC5pZCAhPT0gdGhpcy5wcm9qZWN0LmlkKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNpbWlsYXJQcm9qZWN0LFxuICAgICAgICAgICAgY291bnRyaWVzTGlzdCA6IENvdW50cmllc01vZHVsZS5nZXRDb3VudHJpZXNMaXN0KHN0YXRlKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIG9uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0T25Jbml0KCk7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUgPSB0aGlzLiRuZ1JlZHV4LmNvbm5lY3QodGhpcy5tYXBEYXRhLCBQcm9qZWN0TW9kdWxlKSh0aGlzKTtcbiAgICAgICAgdGhpcy53YXRjaGVycygpO1xuICAgIH1cblxuICAgIG9uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0T25EZXN0cm95KCk7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICB3YXRjaGVycygpIHtcbiAgICAgICAgdGhpcy5zY29wZS4kd2F0Y2goXG4gICAgICAgICAgICBzID0+IHMudm0ucHJvamVjdC5uYW1lLFxuICAgICAgICAgICAgbmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0TmFtZSA9IG5hbWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TmFtZSA9IHRoaXMuY3VycmVudE5hbWUgfHwgbmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnNjb3BlLiR3YXRjaEdyb3VwKFxuICAgICAgICAgICAgIFtzID0+IHMudm0ucHJvamVjdC5zdGFydF9kYXRlLCBzID0+IHMudm0ucHJvamVjdC5lbmRfZGF0ZV0sXG4gICAgICAgICAgICAgdGhpcy52YWxpZGF0ZURhdGVSYW5nZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHZhbGlkYXRlRGF0ZVJhbmdlKFtzdGFydCwgZW5kXSkge1xuICAgICAgICBpZiAoIXN0YXJ0IHx8ICFlbmQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzdGFydCA9IG1vbWVudChzdGFydCk7XG4gICAgICAgIGVuZCA9IG1vbWVudChlbmQpO1xuICAgICAgICBpZiAoc3RhcnQuaXNBZnRlcihlbmQpKSB7XG4gICAgICAgICAgICB0aGlzLnNldEN1c3RvbUVycm9yKCdzdGFydF9kYXRlJywgJ1N0YXJ0IGRhdGUgY2FuIG5vdCBiZSBsYXRlciB0aGFuIHRoZSBlbmQgZGF0ZScpO1xuICAgICAgICAgICAgdGhpcy5zZXRDdXN0b21FcnJvcignZW5kX2RhdGUnLCAnRW5kIGRhdGUgY2FuIG5vdCBiZSBlYXJsaWVyIHRoYW4gdGhlIHN0YXJ0IGRhdGUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ3VzdG9tRXJyb3IoJ3N0YXJ0X2RhdGUnKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ3VzdG9tRXJyb3IoJ2VuZF9kYXRlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRVc2Vycyhjcml0ZXJpYSkge1xuICAgICAgICByZXR1cm4gdGhpcy51c2Vycy5maWx0ZXIoZWwgPT4ge1xuICAgICAgICAgICAgLy8gQXZvaWQgdG8gc2VhcmNoIHVzZXIgdGhhdCBoYXZlIG5vIHByb3BlciBwcm9maWxlLlxuICAgICAgICAgICAgaWYgKGVsICYmIGVsLm5hbWUgJiYgZWwub3JnYW5pc2F0aW9uX25hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZXMoZWwubmFtZS50b0xvd2VyQ2FzZSgpLCBjcml0ZXJpYS50b0xvd2VyQ2FzZSgpKSB8fFxuICAgICAgICAgICAgICAgICAgaW5jbHVkZXMoZWwub3JnYW5pc2F0aW9uX25hbWUudG9Mb3dlckNhc2UoKSwgY3JpdGVyaWEudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGNoZWNrTmFtZSgpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDdXN0b21FcnJvcignbmFtZScpO1xuICAgICAgICBpZiAodGhpcy5wcm9qZWN0TmFtZSAmJiB0aGlzLnByb2plY3ROYW1lLmxlbmd0aCA+IDAgJiYgdGhpcy5wcm9qZWN0TmFtZSAhPT0gdGhpcy5jdXJyZW50TmFtZSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zZWFyY2hEdXBsaWNhdGVQcm9qZWN0TmFtZSh0aGlzLnByb2plY3ROYW1lKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNpbWlsYXJQcm9qZWN0ICYmIHRoaXMuc2ltaWxhclByb2plY3RbMF1cbiAgICAgICAgICAgICAgJiYgdGhpcy5zaW1pbGFyUHJvamVjdFswXS5uYW1lLnRvTG93ZXJDYXNlKCkgPT09IHRoaXMucHJvamVjdE5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3VzdG9tRXJyb3IoJ25hbWUnLCAnUHJvamVjdCBuYW1lIGlzIG5vdCB1bmlxdWUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoQ2hhbmdlKCduYW1lJywgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoQ2hhbmdlKCduYW1lJywgdGhpcy5wcm9qZWN0TmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvcGVuU2ltaWxhclByb2plY3QocHJvamVjdCwgZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHByb2plY3QuaXNPd24pIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZ28oJ2Rhc2hib2FyZCcsIHsgYXBwTmFtZTogcHJvamVjdC5pZCB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZ28oJ3B1YmxpYy1kYXNoYm9hcmQnLCB7IGFwcE5hbWU6IHByb2plY3QuaWQgfSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgc3RhdGljIGZhY3RvcnkoKSB7XG4gICAgICAgIHJlcXVpcmUoJy4vR2VuZXJhbE92ZXJ2aWV3LnNjc3MnKTtcbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhbE92ZXJ2aWV3KCRzY29wZSwgJGVsZW1lbnQsICRzdGF0ZSwgJG5nUmVkdXgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgR2VuZXJhbE92ZXJ2aWV3Q29udHJvbGxlcigkc2NvcGUsICRlbGVtZW50LCAkc3RhdGUsICRuZ1JlZHV4KTtcbiAgICAgICAgfVxuICAgICAgICBnZW5lcmFsT3ZlcnZpZXcuJGluamVjdCA9IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRzdGF0ZScsICckbmdSZWR1eCddO1xuICAgICAgICByZXR1cm4gZ2VuZXJhbE92ZXJ2aWV3O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2VuZXJhbE92ZXJ2aWV3Q29udHJvbGxlcjtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUFFQTs7O0FBRUE7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQVVBO0FBQ0E7OztBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFHQTs7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQUdBO0FBQ0E7QUFBQTs7Ozs7O0FBQ0E7QUFDQTs7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBOUdBO0FBQ0E7QUFnSEEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Project/GeneralOverview/GeneralOverviewController.js\n");

/***/ })

}]);