(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[278],{

/***/ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/TopBar/topBar.scss":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/sass-loader/lib/loader.js!./src/Common/TopBar/topBar.scss ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var escape = __webpack_require__(/*! ../../../node_modules/css-loader/lib/url/escape.js */ \"./node_modules/css-loader/lib/url/escape.js\");\nexports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ \"./node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \".text-truncate {\\n  overflow: hidden;\\n  text-overflow: ellipsis;\\n  white-space: nowrap; }\\n\\n.bold {\\n  font-weight: 500; }\\n\\n.unselectable {\\n  -webkit-touch-callout: none;\\n  /* iOS Safari */\\n  -webkit-user-select: none;\\n  /* Chrome/Safari/Opera */\\n  -khtml-user-select: none;\\n  /* Konqueror */\\n  -moz-user-select: none;\\n  /* Firefox */\\n  -ms-user-select: none;\\n  /* Internet Explorer/Edge */\\n  user-select: none;\\n  /* Non-prefixed version, currently\\n                                  not supported by any browser */ }\\n\\n.hidden {\\n  display: none !important;\\n  visibility: hidden; }\\n\\n.text-hide {\\n  border: 0;\\n  background-color: transparent;\\n  color: transparent;\\n  text-shadow: none;\\n  font: \\\"0/0\\\" a; }\\n\\n.text-nowrap {\\n  white-space: nowrap !important; }\\n\\n.text-truncate {\\n  overflow: hidden;\\n  text-overflow: ellipsis;\\n  white-space: nowrap; }\\n\\n.text-center {\\n  text-align: center; }\\n\\n.text-left {\\n  text-align: left !important; }\\n\\n.text-right {\\n  text-align: right !important; }\\n\\n.text-justify {\\n  text-align: justify !important; }\\n\\n.text-lowercase {\\n  text-transform: lowercase !important; }\\n\\n.text-uppercase {\\n  text-transform: uppercase !important; }\\n\\n.text-capitalize {\\n  text-transform: capitalize !important; }\\n\\n.clickable {\\n  cursor: pointer !important; }\\n\\n.zindex-100 {\\n  z-index: 100; }\\n\\n.zindex-90 {\\n  z-index: 90; }\\n\\n.zindex-80 {\\n  z-index: 80; }\\n\\n.zindex-70 {\\n  z-index: 70; }\\n\\n.zindex-60 {\\n  z-index: 60; }\\n\\n.zindex-50 {\\n  z-index: 50; }\\n\\n.zindex-40 {\\n  z-index: 40; }\\n\\n.zindex-30 {\\n  z-index: 30; }\\n\\n.zindex-20 {\\n  z-index: 20; }\\n\\n.zindex-10 {\\n  z-index: 10; }\\n\\n.center-block {\\n  display: block;\\n  margin-right: auto;\\n  margin-left: auto; }\\n\\n.clearfix::after {\\n  display: table;\\n  clear: both;\\n  content: \\\"\\\"; }\\n\\n/*\\n// Multi-lang\\n@include button-ml($width: 180px);\\n//\\n*/\\n/* TOP NAVIGATION BAR\\n   ============================= */\\ntop-bar {\\n  position: relative;\\n  z-index: 49; }\\n  top-bar .main-toolbar.toolbar-global {\\n    background-color: #1A237E; }\\n\\n.main-toolbar {\\n  position: fixed;\\n  top: 0;\\n  left: 0;\\n  width: calc(100% - 10px);\\n  min-height: 48px;\\n  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12); }\\n  @media only screen and (max-width: 1140px) {\\n    .main-toolbar {\\n      width: 100% !important; } }\\n  .main-toolbar.toolbar-global {\\n    background-color: #FFFFFF; }\\n    .main-toolbar.toolbar-global .md-toolbar-tools {\\n      padding-right: 12px; }\\n      @media only screen and (max-width: 1180px) {\\n        .main-toolbar.toolbar-global .md-toolbar-tools .md-button:not(.app-title):not(.landing-link) > translate,\\n        .main-toolbar.toolbar-global .md-toolbar-tools .md-button:not(.app-title):not(.landing-link) > span {\\n          display: none; } }\\n  .main-toolbar .md-toolbar-tools {\\n    max-height: 48px;\\n    height: 48px;\\n    font-size: 14px; }\\n    .main-toolbar .md-toolbar-tools .md-button {\\n      margin-left: 12px; }\\n      .main-toolbar .md-toolbar-tools .md-button.view-selector {\\n        margin-right: 12px; }\\n      .main-toolbar .md-toolbar-tools .md-button.landing-link {\\n        margin-right: 12px; }\\n      .main-toolbar .md-toolbar-tools .md-button translate {\\n        max-width: 180px;\\n        display: inline-flex; }\\n        .main-toolbar .md-toolbar-tools .md-button translate span {\\n          display: block;\\n          overflow: hidden;\\n          text-overflow: ellipsis;\\n          white-space: nowrap; }\\n    .main-toolbar .md-toolbar-tools .add-new-project {\\n      margin-right: 18px !important; }\\n    .main-toolbar .md-toolbar-tools .language-badge {\\n      overflow: hidden;\\n      width: 22px;\\n      min-width: 22px;\\n      height: 22px;\\n      margin-left: 32px;\\n      margin-right: 12px;\\n      border-radius: 22px;\\n      border: 2px solid #A9AED3; }\\n      .main-toolbar .md-toolbar-tools .language-badge .country-flag {\\n        display: block;\\n        height: 100%;\\n        background-repeat: none;\\n        background-position: center center;\\n        background-size: auto 100%; }\\n  .main-toolbar .app-title {\\n    position: relative;\\n    margin: 0 24px 0 0 !important;\\n    padding: 4px 0;\\n    width: 165px !important;\\n    max-width: 165px !important;\\n    height: 28px; }\\n    .main-toolbar .app-title .logo {\\n      display: inline-block;\\n      width: 165px;\\n      height: 24px;\\n      background: url(\" + escape(__webpack_require__(/*! ./images/dha-logo.svg */ \"./src/Common/TopBar/images/dha-logo.svg\")) + \") left center no-repeat;\\n      text-indent: -999em;\\n      border: 0;\\n      background-color: transparent;\\n      color: transparent;\\n      text-shadow: none;\\n      font: \\\"0/0\\\" a; }\\n\\nmd-menu-content.user-menu {\\n  max-height: 90vh !important; }\\n  md-menu-content.user-menu .label {\\n    margin: 12px 16px 0;\\n    font-size: 12px;\\n    font-weight: 400;\\n    color: #9D9D9D;\\n    text-transform: uppercase; }\\n  md-menu-content.user-menu md-menu-item + .label {\\n    margin-top: 4px; }\\n  md-menu-content.user-menu .user-name > span,\\n  md-menu-content.user-menu .user-role > span {\\n    display: inline-block;\\n    padding: 0 12px 0 16px;\\n    font-size: 15px;\\n    font-weight: 400; }\\n  md-menu-content.user-menu .user-name > span {\\n    font-weight: 500; }\\n  md-menu-content.user-menu .user-lang {\\n    font-size: 15px; }\\n    md-menu-content.user-menu .user-lang .country-flag {\\n      position: relative;\\n      width: 24px;\\n      height: 24px; }\\n      md-menu-content.user-menu .user-lang .country-flag img {\\n        position: absolute;\\n        top: 50%;\\n        left: 0;\\n        max-width: 24px;\\n        height: auto;\\n        transform: translate(0, -50%); }\\n    md-menu-content.user-menu .user-lang .country-label {\\n      padding: 0 16px 0 20px; }\\n\", \"\"]);\n\n// exports\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vc3JjL0NvbW1vbi9Ub3BCYXIvdG9wQmFyLnNjc3MuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQ29tbW9uL1RvcEJhci90b3BCYXIuc2Nzcz8wMjYzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBlc2NhcGUgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL3VybC9lc2NhcGUuanNcIik7XG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKGZhbHNlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi50ZXh0LXRydW5jYXRlIHtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cXG5cXG4uYm9sZCB7XFxuICBmb250LXdlaWdodDogNTAwOyB9XFxuXFxuLnVuc2VsZWN0YWJsZSB7XFxuICAtd2Via2l0LXRvdWNoLWNhbGxvdXQ6IG5vbmU7XFxuICAvKiBpT1MgU2FmYXJpICovXFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLyogQ2hyb21lL1NhZmFyaS9PcGVyYSAqL1xcbiAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xcbiAgLyogS29ucXVlcm9yICovXFxuICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLyogRmlyZWZveCAqL1xcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcbiAgLyogSW50ZXJuZXQgRXhwbG9yZXIvRWRnZSAqL1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAvKiBOb24tcHJlZml4ZWQgdmVyc2lvbiwgY3VycmVudGx5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdCBzdXBwb3J0ZWQgYnkgYW55IGJyb3dzZXIgKi8gfVxcblxcbi5oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xcbiAgdmlzaWJpbGl0eTogaGlkZGVuOyB9XFxuXFxuLnRleHQtaGlkZSB7XFxuICBib3JkZXI6IDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIHRleHQtc2hhZG93OiBub25lO1xcbiAgZm9udDogXFxcIjAvMFxcXCIgYTsgfVxcblxcbi50ZXh0LW5vd3JhcCB7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwICFpbXBvcnRhbnQ7IH1cXG5cXG4udGV4dC10cnVuY2F0ZSB7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwOyB9XFxuXFxuLnRleHQtY2VudGVyIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjsgfVxcblxcbi50ZXh0LWxlZnQge1xcbiAgdGV4dC1hbGlnbjogbGVmdCAhaW1wb3J0YW50OyB9XFxuXFxuLnRleHQtcmlnaHQge1xcbiAgdGV4dC1hbGlnbjogcmlnaHQgIWltcG9ydGFudDsgfVxcblxcbi50ZXh0LWp1c3RpZnkge1xcbiAgdGV4dC1hbGlnbjoganVzdGlmeSAhaW1wb3J0YW50OyB9XFxuXFxuLnRleHQtbG93ZXJjYXNlIHtcXG4gIHRleHQtdHJhbnNmb3JtOiBsb3dlcmNhc2UgIWltcG9ydGFudDsgfVxcblxcbi50ZXh0LXVwcGVyY2FzZSB7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlICFpbXBvcnRhbnQ7IH1cXG5cXG4udGV4dC1jYXBpdGFsaXplIHtcXG4gIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplICFpbXBvcnRhbnQ7IH1cXG5cXG4uY2xpY2thYmxlIHtcXG4gIGN1cnNvcjogcG9pbnRlciAhaW1wb3J0YW50OyB9XFxuXFxuLnppbmRleC0xMDAge1xcbiAgei1pbmRleDogMTAwOyB9XFxuXFxuLnppbmRleC05MCB7XFxuICB6LWluZGV4OiA5MDsgfVxcblxcbi56aW5kZXgtODAge1xcbiAgei1pbmRleDogODA7IH1cXG5cXG4uemluZGV4LTcwIHtcXG4gIHotaW5kZXg6IDcwOyB9XFxuXFxuLnppbmRleC02MCB7XFxuICB6LWluZGV4OiA2MDsgfVxcblxcbi56aW5kZXgtNTAge1xcbiAgei1pbmRleDogNTA7IH1cXG5cXG4uemluZGV4LTQwIHtcXG4gIHotaW5kZXg6IDQwOyB9XFxuXFxuLnppbmRleC0zMCB7XFxuICB6LWluZGV4OiAzMDsgfVxcblxcbi56aW5kZXgtMjAge1xcbiAgei1pbmRleDogMjA7IH1cXG5cXG4uemluZGV4LTEwIHtcXG4gIHotaW5kZXg6IDEwOyB9XFxuXFxuLmNlbnRlci1ibG9jayB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG4gIG1hcmdpbi1sZWZ0OiBhdXRvOyB9XFxuXFxuLmNsZWFyZml4OjphZnRlciB7XFxuICBkaXNwbGF5OiB0YWJsZTtcXG4gIGNsZWFyOiBib3RoO1xcbiAgY29udGVudDogXFxcIlxcXCI7IH1cXG5cXG4vKlxcbi8vIE11bHRpLWxhbmdcXG5AaW5jbHVkZSBidXR0b24tbWwoJHdpZHRoOiAxODBweCk7XFxuLy9cXG4qL1xcbi8qIFRPUCBOQVZJR0FUSU9OIEJBUlxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxudG9wLWJhciB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB6LWluZGV4OiA0OTsgfVxcbiAgdG9wLWJhciAubWFpbi10b29sYmFyLnRvb2xiYXItZ2xvYmFsIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzFBMjM3RTsgfVxcblxcbi5tYWluLXRvb2xiYXIge1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIHdpZHRoOiBjYWxjKDEwMCUgLSAxMHB4KTtcXG4gIG1pbi1oZWlnaHQ6IDQ4cHg7XFxuICBib3gtc2hhZG93OiAwcHggMnB4IDRweCAtMXB4IHJnYmEoMCwgMCwgMCwgMC4yKSwgMHB4IDRweCA1cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xNCksIDBweCAxcHggMTBweCAwcHggcmdiYSgwLCAwLCAwLCAwLjEyKTsgfVxcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAxMTQwcHgpIHtcXG4gICAgLm1haW4tdG9vbGJhciB7XFxuICAgICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDsgfSB9XFxuICAubWFpbi10b29sYmFyLnRvb2xiYXItZ2xvYmFsIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjsgfVxcbiAgICAubWFpbi10b29sYmFyLnRvb2xiYXItZ2xvYmFsIC5tZC10b29sYmFyLXRvb2xzIHtcXG4gICAgICBwYWRkaW5nLXJpZ2h0OiAxMnB4OyB9XFxuICAgICAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAxMTgwcHgpIHtcXG4gICAgICAgIC5tYWluLXRvb2xiYXIudG9vbGJhci1nbG9iYWwgLm1kLXRvb2xiYXItdG9vbHMgLm1kLWJ1dHRvbjpub3QoLmFwcC10aXRsZSk6bm90KC5sYW5kaW5nLWxpbmspID4gdHJhbnNsYXRlLFxcbiAgICAgICAgLm1haW4tdG9vbGJhci50b29sYmFyLWdsb2JhbCAubWQtdG9vbGJhci10b29scyAubWQtYnV0dG9uOm5vdCguYXBwLXRpdGxlKTpub3QoLmxhbmRpbmctbGluaykgPiBzcGFuIHtcXG4gICAgICAgICAgZGlzcGxheTogbm9uZTsgfSB9XFxuICAubWFpbi10b29sYmFyIC5tZC10b29sYmFyLXRvb2xzIHtcXG4gICAgbWF4LWhlaWdodDogNDhweDtcXG4gICAgaGVpZ2h0OiA0OHB4O1xcbiAgICBmb250LXNpemU6IDE0cHg7IH1cXG4gICAgLm1haW4tdG9vbGJhciAubWQtdG9vbGJhci10b29scyAubWQtYnV0dG9uIHtcXG4gICAgICBtYXJnaW4tbGVmdDogMTJweDsgfVxcbiAgICAgIC5tYWluLXRvb2xiYXIgLm1kLXRvb2xiYXItdG9vbHMgLm1kLWJ1dHRvbi52aWV3LXNlbGVjdG9yIHtcXG4gICAgICAgIG1hcmdpbi1yaWdodDogMTJweDsgfVxcbiAgICAgIC5tYWluLXRvb2xiYXIgLm1kLXRvb2xiYXItdG9vbHMgLm1kLWJ1dHRvbi5sYW5kaW5nLWxpbmsge1xcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMnB4OyB9XFxuICAgICAgLm1haW4tdG9vbGJhciAubWQtdG9vbGJhci10b29scyAubWQtYnV0dG9uIHRyYW5zbGF0ZSB7XFxuICAgICAgICBtYXgtd2lkdGg6IDE4MHB4O1xcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7IH1cXG4gICAgICAgIC5tYWluLXRvb2xiYXIgLm1kLXRvb2xiYXItdG9vbHMgLm1kLWJ1dHRvbiB0cmFuc2xhdGUgc3BhbiB7XFxuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcXG4gICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDsgfVxcbiAgICAubWFpbi10b29sYmFyIC5tZC10b29sYmFyLXRvb2xzIC5hZGQtbmV3LXByb2plY3Qge1xcbiAgICAgIG1hcmdpbi1yaWdodDogMThweCAhaW1wb3J0YW50OyB9XFxuICAgIC5tYWluLXRvb2xiYXIgLm1kLXRvb2xiYXItdG9vbHMgLmxhbmd1YWdlLWJhZGdlIHtcXG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgICAgIHdpZHRoOiAyMnB4O1xcbiAgICAgIG1pbi13aWR0aDogMjJweDtcXG4gICAgICBoZWlnaHQ6IDIycHg7XFxuICAgICAgbWFyZ2luLWxlZnQ6IDMycHg7XFxuICAgICAgbWFyZ2luLXJpZ2h0OiAxMnB4O1xcbiAgICAgIGJvcmRlci1yYWRpdXM6IDIycHg7XFxuICAgICAgYm9yZGVyOiAycHggc29saWQgI0E5QUVEMzsgfVxcbiAgICAgIC5tYWluLXRvb2xiYXIgLm1kLXRvb2xiYXItdG9vbHMgLmxhbmd1YWdlLWJhZGdlIC5jb3VudHJ5LWZsYWcge1xcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XFxuICAgICAgICBoZWlnaHQ6IDEwMCU7XFxuICAgICAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm9uZTtcXG4gICAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XFxuICAgICAgICBiYWNrZ3JvdW5kLXNpemU6IGF1dG8gMTAwJTsgfVxcbiAgLm1haW4tdG9vbGJhciAuYXBwLXRpdGxlIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBtYXJnaW46IDAgMjRweCAwIDAgIWltcG9ydGFudDtcXG4gICAgcGFkZGluZzogNHB4IDA7XFxuICAgIHdpZHRoOiAxNjVweCAhaW1wb3J0YW50O1xcbiAgICBtYXgtd2lkdGg6IDE2NXB4ICFpbXBvcnRhbnQ7XFxuICAgIGhlaWdodDogMjhweDsgfVxcbiAgICAubWFpbi10b29sYmFyIC5hcHAtdGl0bGUgLmxvZ28ge1xcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gICAgICB3aWR0aDogMTY1cHg7XFxuICAgICAgaGVpZ2h0OiAyNHB4O1xcbiAgICAgIGJhY2tncm91bmQ6IHVybChcIiArIGVzY2FwZShyZXF1aXJlKFwiLi9pbWFnZXMvZGhhLWxvZ28uc3ZnXCIpKSArIFwiKSBsZWZ0IGNlbnRlciBuby1yZXBlYXQ7XFxuICAgICAgdGV4dC1pbmRlbnQ6IC05OTllbTtcXG4gICAgICBib3JkZXI6IDA7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICAgICAgY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgICAgIHRleHQtc2hhZG93OiBub25lO1xcbiAgICAgIGZvbnQ6IFxcXCIwLzBcXFwiIGE7IH1cXG5cXG5tZC1tZW51LWNvbnRlbnQudXNlci1tZW51IHtcXG4gIG1heC1oZWlnaHQ6IDkwdmggIWltcG9ydGFudDsgfVxcbiAgbWQtbWVudS1jb250ZW50LnVzZXItbWVudSAubGFiZWwge1xcbiAgICBtYXJnaW46IDEycHggMTZweCAwO1xcbiAgICBmb250LXNpemU6IDEycHg7XFxuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XFxuICAgIGNvbG9yOiAjOUQ5RDlEO1xcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyB9XFxuICBtZC1tZW51LWNvbnRlbnQudXNlci1tZW51IG1kLW1lbnUtaXRlbSArIC5sYWJlbCB7XFxuICAgIG1hcmdpbi10b3A6IDRweDsgfVxcbiAgbWQtbWVudS1jb250ZW50LnVzZXItbWVudSAudXNlci1uYW1lID4gc3BhbixcXG4gIG1kLW1lbnUtY29udGVudC51c2VyLW1lbnUgLnVzZXItcm9sZSA+IHNwYW4ge1xcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgIHBhZGRpbmc6IDAgMTJweCAwIDE2cHg7XFxuICAgIGZvbnQtc2l6ZTogMTVweDtcXG4gICAgZm9udC13ZWlnaHQ6IDQwMDsgfVxcbiAgbWQtbWVudS1jb250ZW50LnVzZXItbWVudSAudXNlci1uYW1lID4gc3BhbiB7XFxuICAgIGZvbnQtd2VpZ2h0OiA1MDA7IH1cXG4gIG1kLW1lbnUtY29udGVudC51c2VyLW1lbnUgLnVzZXItbGFuZyB7XFxuICAgIGZvbnQtc2l6ZTogMTVweDsgfVxcbiAgICBtZC1tZW51LWNvbnRlbnQudXNlci1tZW51IC51c2VyLWxhbmcgLmNvdW50cnktZmxhZyB7XFxuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICAgIHdpZHRoOiAyNHB4O1xcbiAgICAgIGhlaWdodDogMjRweDsgfVxcbiAgICAgIG1kLW1lbnUtY29udGVudC51c2VyLW1lbnUgLnVzZXItbGFuZyAuY291bnRyeS1mbGFnIGltZyB7XFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgICB0b3A6IDUwJTtcXG4gICAgICAgIGxlZnQ6IDA7XFxuICAgICAgICBtYXgtd2lkdGg6IDI0cHg7XFxuICAgICAgICBoZWlnaHQ6IGF1dG87XFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtNTAlKTsgfVxcbiAgICBtZC1tZW51LWNvbnRlbnQudXNlci1tZW51IC51c2VyLWxhbmcgLmNvdW50cnktbGFiZWwge1xcbiAgICAgIHBhZGRpbmc6IDAgMTZweCAwIDIwcHg7IH1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/TopBar/topBar.scss\n");

/***/ }),

/***/ "./node_modules/css-loader/lib/url/escape.js":
/*!***************************************************!*\
  !*** ./node_modules/css-loader/lib/url/escape.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function escape(url) {\n    if (typeof url !== 'string') {\n        return url\n    }\n    // If url is already wrapped in quotes, remove them\n    if (/^['\"].*['\"]$/.test(url)) {\n        url = url.slice(1, -1);\n    }\n    // Should url be wrapped?\n    // See https://drafts.csswg.org/css-values-3/#urls\n    if (/[\"'() \\t\\n]/.test(url)) {\n        return '\"' + url.replace(/\"/g, '\\\\\"').replace(/\\n/g, '\\\\n') + '\"'\n    }\n\n    return url\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvdXJsL2VzY2FwZS5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi91cmwvZXNjYXBlLmpzP2IwNDEiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlc2NhcGUodXJsKSB7XG4gICAgaWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB1cmxcbiAgICB9XG4gICAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gICAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gICAgfVxuICAgIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuICAgIGlmICgvW1wiJygpIFxcdFxcbl0vLnRlc3QodXJsKSkge1xuICAgICAgICByZXR1cm4gJ1wiJyArIHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csICdcXFxcbicpICsgJ1wiJ1xuICAgIH1cblxuICAgIHJldHVybiB1cmxcbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/css-loader/lib/url/escape.js\n");

/***/ }),

/***/ "./src/Common/TopBar/images/dha-logo.svg":
/*!***********************************************!*\
  !*** ./src/Common/TopBar/images/dha-logo.svg ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"public/fonts/dha-logo.svg\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1RvcEJhci9pbWFnZXMvZGhhLWxvZ28uc3ZnLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9Ub3BCYXIvaW1hZ2VzL2RoYS1sb2dvLnN2Zz84ZjQxIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcInB1YmxpYy9mb250cy9kaGEtbG9nby5zdmdcIjsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Common/TopBar/images/dha-logo.svg\n");

/***/ }),

/***/ "./src/Common/TopBar/topBar.scss":
/*!***************************************!*\
  !*** ./src/Common/TopBar/topBar.scss ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/sass-loader/lib/loader.js!./topBar.scss */ \"./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/Common/TopBar/topBar.scss\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQ29tbW9uL1RvcEJhci90b3BCYXIuc2Nzcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Db21tb24vVG9wQmFyL3RvcEJhci5zY3NzPzcyNmMiXSwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vdG9wQmFyLnNjc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vdG9wQmFyLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3RvcEJhci5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Common/TopBar/topBar.scss\n");

/***/ })

}]);