(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[651],{

/***/ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/Project/Navigation/Navigation.scss":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/sass-loader/lib/loader.js!./src/Project/Navigation/Navigation.scss ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ \"./node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \".text-truncate {\\n  overflow: hidden;\\n  text-overflow: ellipsis;\\n  white-space: nowrap; }\\n\\n.bold {\\n  font-weight: 500; }\\n\\n.unselectable {\\n  -webkit-touch-callout: none;\\n  /* iOS Safari */\\n  -webkit-user-select: none;\\n  /* Chrome/Safari/Opera */\\n  -khtml-user-select: none;\\n  /* Konqueror */\\n  -moz-user-select: none;\\n  /* Firefox */\\n  -ms-user-select: none;\\n  /* Internet Explorer/Edge */\\n  user-select: none;\\n  /* Non-prefixed version, currently\\n                                  not supported by any browser */ }\\n\\n.hidden {\\n  display: none !important;\\n  visibility: hidden; }\\n\\n.text-hide {\\n  border: 0;\\n  background-color: transparent;\\n  color: transparent;\\n  text-shadow: none;\\n  font: \\\"0/0\\\" a; }\\n\\n.text-nowrap {\\n  white-space: nowrap !important; }\\n\\n.text-truncate {\\n  overflow: hidden;\\n  text-overflow: ellipsis;\\n  white-space: nowrap; }\\n\\n.text-center {\\n  text-align: center; }\\n\\n.text-left {\\n  text-align: left !important; }\\n\\n.text-right {\\n  text-align: right !important; }\\n\\n.text-justify {\\n  text-align: justify !important; }\\n\\n.text-lowercase {\\n  text-transform: lowercase !important; }\\n\\n.text-uppercase {\\n  text-transform: uppercase !important; }\\n\\n.text-capitalize {\\n  text-transform: capitalize !important; }\\n\\n.clickable {\\n  cursor: pointer !important; }\\n\\n.zindex-100 {\\n  z-index: 100; }\\n\\n.zindex-90 {\\n  z-index: 90; }\\n\\n.zindex-80 {\\n  z-index: 80; }\\n\\n.zindex-70 {\\n  z-index: 70; }\\n\\n.zindex-60 {\\n  z-index: 60; }\\n\\n.zindex-50 {\\n  z-index: 50; }\\n\\n.zindex-40 {\\n  z-index: 40; }\\n\\n.zindex-30 {\\n  z-index: 30; }\\n\\n.zindex-20 {\\n  z-index: 20; }\\n\\n.zindex-10 {\\n  z-index: 10; }\\n\\n.center-block {\\n  display: block;\\n  margin-right: auto;\\n  margin-left: auto; }\\n\\n.clearfix::after {\\n  display: table;\\n  clear: both;\\n  content: \\\"\\\"; }\\n\\n/*\\n// Multi-lang\\n@include button-ml($width: 180px);\\n//\\n*/\\n.project-navigation .edit-mode-switch {\\n  width: 100%;\\n  padding: 15px;\\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12);\\n  font-size: 12px; }\\n  .project-navigation .edit-mode-switch > div:first-child {\\n    padding-right: 10px;\\n    white-space: nowrap; }\\n    .project-navigation .edit-mode-switch > div:first-child translate {\\n      max-width: 80px;\\n      display: inline-flex; }\\n      .project-navigation .edit-mode-switch > div:first-child translate span {\\n        display: block;\\n        overflow: hidden;\\n        text-overflow: ellipsis;\\n        white-space: nowrap; }\\n  .project-navigation .edit-mode-switch button {\\n    width: 100%;\\n    height: 30px;\\n    line-height: 30px;\\n    margin: 0;\\n    padding: 0 12px;\\n    border: 0;\\n    font-size: 12px;\\n    font-weight: 500;\\n    text-align: center;\\n    text-transform: uppercase;\\n    color: #9D9D9D;\\n    background-color: #E0E0E0;\\n    outline: none;\\n    box-shadow: inset 0 0 5px 0 rgba(0, 0, 0, 0.2);\\n    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }\\n    .project-navigation .edit-mode-switch button translate {\\n      max-width: 80px;\\n      display: inline-flex; }\\n      .project-navigation .edit-mode-switch button translate span {\\n        display: block;\\n        overflow: hidden;\\n        text-overflow: ellipsis;\\n        white-space: nowrap; }\\n    .project-navigation .edit-mode-switch button:hover {\\n      color: #757575;\\n      background-color: #F5F5F5; }\\n    .project-navigation .edit-mode-switch button.draft {\\n      border-radius: 5px 0 0 5px; }\\n      .project-navigation .edit-mode-switch button.draft.active {\\n        background-color: #FBC02D;\\n        color: #212121;\\n        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2); }\\n    .project-navigation .edit-mode-switch button.publish {\\n      border-radius: 0 5px 5px 0; }\\n      .project-navigation .edit-mode-switch button.publish.active {\\n        background-color: #558B2F;\\n        color: #FFFFFF;\\n        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2); }\\n\\n.project-navigation .stepper ul {\\n  position: relative;\\n  list-style: none;\\n  margin: 20px 0;\\n  padding: 0; }\\n  @media only screen and (max-height: 700px) {\\n    .project-navigation .stepper ul {\\n      margin: 20px 0; } }\\n  .project-navigation .stepper ul::after {\\n    z-index: 1;\\n    content: \\\"\\\";\\n    position: absolute;\\n    top: 15px;\\n    left: 44px;\\n    display: inline-block;\\n    width: 1px;\\n    height: calc(100% - 35px);\\n    background-color: #BDBDBD; }\\n\\n.project-navigation .stepper li {\\n  z-index: 2;\\n  position: relative;\\n  cursor: pointer; }\\n  .project-navigation .stepper li.active a, .project-navigation .stepper li:hover a, .project-navigation .stepper li:active a {\\n    color: #212121; }\\n  .project-navigation .stepper li.active .step, .project-navigation .stepper li:hover .step, .project-navigation .stepper li:active .step {\\n    background-color: #CD9923;\\n    border-width: 2px; }\\n  .project-navigation .stepper li.active i, .project-navigation .stepper li:hover i, .project-navigation .stepper li:active i {\\n    opacity: 1;\\n    transform: translate(-50%, -50%) scale(1) rotate(0deg); }\\n\\n.project-navigation .stepper a {\\n  position: relative;\\n  display: block;\\n  padding: 0 20px 0 70px;\\n  height: 62px;\\n  line-height: 62px;\\n  color: #B0BEC5;\\n  text-decoration: none;\\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }\\n  .project-navigation .stepper a translate {\\n    max-width: 180px;\\n    display: inline-flex; }\\n    .project-navigation .stepper a translate span {\\n      display: block;\\n      overflow: hidden;\\n      text-overflow: ellipsis;\\n      white-space: nowrap; }\\n  @media only screen and (max-height: 720px) {\\n    .project-navigation .stepper a {\\n      height: 48px;\\n      line-height: 48px; } }\\n\\n.project-navigation .stepper .step {\\n  position: absolute;\\n  top: 15px;\\n  left: 30px;\\n  box-sizing: border-box;\\n  display: inline-block;\\n  width: 29px;\\n  height: 29px;\\n  border: 6px solid #FFFFFF;\\n  background-color: #B0BEC5;\\n  border-radius: 29px;\\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }\\n  @media only screen and (max-height: 720px) {\\n    .project-navigation .stepper .step {\\n      top: 8px; } }\\n  .project-navigation .stepper .step i {\\n    position: absolute;\\n    top: 50%;\\n    left: 50%;\\n    transform: translate(-50%, -50%) scale(0.5) rotate(-90deg);\\n    display: inline-block;\\n    width: 20px;\\n    height: 20px;\\n    text-align: center;\\n    font-size: 20px;\\n    line-height: 20px;\\n    color: #FFFFFF;\\n    opacity: 0;\\n    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }\\n\\n.project-navigation .edit-buttons {\\n  padding: 20px 0;\\n  background-color: #F5F5F5;\\n  text-align: center;\\n  box-shadow: inset 0 1px 0 0 rgba(0, 0, 0, 0.12); }\\n  @media only screen and (max-height: 700px) {\\n    .project-navigation .edit-buttons {\\n      padding: 10px 0; } }\\n  .project-navigation .edit-buttons .md-button {\\n    width: 180px; }\\n    .project-navigation .edit-buttons .md-button translate {\\n      max-width: 180px;\\n      display: inline-flex; }\\n      .project-navigation .edit-buttons .md-button translate span {\\n        display: block;\\n        overflow: hidden;\\n        text-overflow: ellipsis;\\n        white-space: nowrap; }\\n  .project-navigation .edit-buttons .primary-buttons .md-button {\\n    margin: 15px 0; }\\n\", \"\"]);\n\n// exports\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vc3JjL1Byb2plY3QvTmF2aWdhdGlvbi9OYXZpZ2F0aW9uLnNjc3MuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvUHJvamVjdC9OYXZpZ2F0aW9uL05hdmlnYXRpb24uc2Nzcz83ZDVlIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoZmFsc2UpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLnRleHQtdHJ1bmNhdGUge1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDsgfVxcblxcbi5ib2xkIHtcXG4gIGZvbnQtd2VpZ2h0OiA1MDA7IH1cXG5cXG4udW5zZWxlY3RhYmxlIHtcXG4gIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTtcXG4gIC8qIGlPUyBTYWZhcmkgKi9cXG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAvKiBDaHJvbWUvU2FmYXJpL09wZXJhICovXFxuICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAvKiBLb25xdWVyb3IgKi9cXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAvKiBGaXJlZm94ICovXFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAvKiBJbnRlcm5ldCBFeHBsb3Jlci9FZGdlICovXFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gIC8qIE5vbi1wcmVmaXhlZCB2ZXJzaW9uLCBjdXJyZW50bHlcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90IHN1cHBvcnRlZCBieSBhbnkgYnJvd3NlciAqLyB9XFxuXFxuLmhpZGRlbiB7XFxuICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XFxuICB2aXNpYmlsaXR5OiBoaWRkZW47IH1cXG5cXG4udGV4dC1oaWRlIHtcXG4gIGJvcmRlcjogMDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgdGV4dC1zaGFkb3c6IG5vbmU7XFxuICBmb250OiBcXFwiMC8wXFxcIiBhOyB9XFxuXFxuLnRleHQtbm93cmFwIHtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXAgIWltcG9ydGFudDsgfVxcblxcbi50ZXh0LXRydW5jYXRlIHtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cXG5cXG4udGV4dC1jZW50ZXIge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyOyB9XFxuXFxuLnRleHQtbGVmdCB7XFxuICB0ZXh0LWFsaWduOiBsZWZ0ICFpbXBvcnRhbnQ7IH1cXG5cXG4udGV4dC1yaWdodCB7XFxuICB0ZXh0LWFsaWduOiByaWdodCAhaW1wb3J0YW50OyB9XFxuXFxuLnRleHQtanVzdGlmeSB7XFxuICB0ZXh0LWFsaWduOiBqdXN0aWZ5ICFpbXBvcnRhbnQ7IH1cXG5cXG4udGV4dC1sb3dlcmNhc2Uge1xcbiAgdGV4dC10cmFuc2Zvcm06IGxvd2VyY2FzZSAhaW1wb3J0YW50OyB9XFxuXFxuLnRleHQtdXBwZXJjYXNlIHtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2UgIWltcG9ydGFudDsgfVxcblxcbi50ZXh0LWNhcGl0YWxpemUge1xcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemUgIWltcG9ydGFudDsgfVxcblxcbi5jbGlja2FibGUge1xcbiAgY3Vyc29yOiBwb2ludGVyICFpbXBvcnRhbnQ7IH1cXG5cXG4uemluZGV4LTEwMCB7XFxuICB6LWluZGV4OiAxMDA7IH1cXG5cXG4uemluZGV4LTkwIHtcXG4gIHotaW5kZXg6IDkwOyB9XFxuXFxuLnppbmRleC04MCB7XFxuICB6LWluZGV4OiA4MDsgfVxcblxcbi56aW5kZXgtNzAge1xcbiAgei1pbmRleDogNzA7IH1cXG5cXG4uemluZGV4LTYwIHtcXG4gIHotaW5kZXg6IDYwOyB9XFxuXFxuLnppbmRleC01MCB7XFxuICB6LWluZGV4OiA1MDsgfVxcblxcbi56aW5kZXgtNDAge1xcbiAgei1pbmRleDogNDA7IH1cXG5cXG4uemluZGV4LTMwIHtcXG4gIHotaW5kZXg6IDMwOyB9XFxuXFxuLnppbmRleC0yMCB7XFxuICB6LWluZGV4OiAyMDsgfVxcblxcbi56aW5kZXgtMTAge1xcbiAgei1pbmRleDogMTA7IH1cXG5cXG4uY2VudGVyLWJsb2NrIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87IH1cXG5cXG4uY2xlYXJmaXg6OmFmdGVyIHtcXG4gIGRpc3BsYXk6IHRhYmxlO1xcbiAgY2xlYXI6IGJvdGg7XFxuICBjb250ZW50OiBcXFwiXFxcIjsgfVxcblxcbi8qXFxuLy8gTXVsdGktbGFuZ1xcbkBpbmNsdWRlIGJ1dHRvbi1tbCgkd2lkdGg6IDE4MHB4KTtcXG4vL1xcbiovXFxuLnByb2plY3QtbmF2aWdhdGlvbiAuZWRpdC1tb2RlLXN3aXRjaCB7XFxuICB3aWR0aDogMTAwJTtcXG4gIHBhZGRpbmc6IDE1cHg7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjEyKTtcXG4gIGZvbnQtc2l6ZTogMTJweDsgfVxcbiAgLnByb2plY3QtbmF2aWdhdGlvbiAuZWRpdC1tb2RlLXN3aXRjaCA+IGRpdjpmaXJzdC1jaGlsZCB7XFxuICAgIHBhZGRpbmctcmlnaHQ6IDEwcHg7XFxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cXG4gICAgLnByb2plY3QtbmF2aWdhdGlvbiAuZWRpdC1tb2RlLXN3aXRjaCA+IGRpdjpmaXJzdC1jaGlsZCB0cmFuc2xhdGUge1xcbiAgICAgIG1heC13aWR0aDogODBweDtcXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDsgfVxcbiAgICAgIC5wcm9qZWN0LW5hdmlnYXRpb24gLmVkaXQtbW9kZS1zd2l0Y2ggPiBkaXY6Zmlyc3QtY2hpbGQgdHJhbnNsYXRlIHNwYW4ge1xcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XFxuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XFxuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwOyB9XFxuICAucHJvamVjdC1uYXZpZ2F0aW9uIC5lZGl0LW1vZGUtc3dpdGNoIGJ1dHRvbiB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBoZWlnaHQ6IDMwcHg7XFxuICAgIGxpbmUtaGVpZ2h0OiAzMHB4O1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDAgMTJweDtcXG4gICAgYm9yZGVyOiAwO1xcbiAgICBmb250LXNpemU6IDEycHg7XFxuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gICAgY29sb3I6ICM5RDlEOUQ7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNFMEUwRTA7XFxuICAgIG91dGxpbmU6IG5vbmU7XFxuICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCA1cHggMCByZ2JhKDAsIDAsIDAsIDAuMik7XFxuICAgIHRyYW5zaXRpb246IGFsbCAwLjRzIGN1YmljLWJlemllcigwLjI1LCAwLjgsIDAuMjUsIDEpOyB9XFxuICAgIC5wcm9qZWN0LW5hdmlnYXRpb24gLmVkaXQtbW9kZS1zd2l0Y2ggYnV0dG9uIHRyYW5zbGF0ZSB7XFxuICAgICAgbWF4LXdpZHRoOiA4MHB4O1xcbiAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4OyB9XFxuICAgICAgLnByb2plY3QtbmF2aWdhdGlvbiAuZWRpdC1tb2RlLXN3aXRjaCBidXR0b24gdHJhbnNsYXRlIHNwYW4ge1xcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XFxuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XFxuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwOyB9XFxuICAgIC5wcm9qZWN0LW5hdmlnYXRpb24gLmVkaXQtbW9kZS1zd2l0Y2ggYnV0dG9uOmhvdmVyIHtcXG4gICAgICBjb2xvcjogIzc1NzU3NTtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRjVGNUY1OyB9XFxuICAgIC5wcm9qZWN0LW5hdmlnYXRpb24gLmVkaXQtbW9kZS1zd2l0Y2ggYnV0dG9uLmRyYWZ0IHtcXG4gICAgICBib3JkZXItcmFkaXVzOiA1cHggMCAwIDVweDsgfVxcbiAgICAgIC5wcm9qZWN0LW5hdmlnYXRpb24gLmVkaXQtbW9kZS1zd2l0Y2ggYnV0dG9uLmRyYWZ0LmFjdGl2ZSB7XFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkJDMDJEO1xcbiAgICAgICAgY29sb3I6ICMyMTIxMjE7XFxuICAgICAgICBib3gtc2hhZG93OiAwIDJweCAycHggMCByZ2JhKDAsIDAsIDAsIDAuMik7IH1cXG4gICAgLnByb2plY3QtbmF2aWdhdGlvbiAuZWRpdC1tb2RlLXN3aXRjaCBidXR0b24ucHVibGlzaCB7XFxuICAgICAgYm9yZGVyLXJhZGl1czogMCA1cHggNXB4IDA7IH1cXG4gICAgICAucHJvamVjdC1uYXZpZ2F0aW9uIC5lZGl0LW1vZGUtc3dpdGNoIGJ1dHRvbi5wdWJsaXNoLmFjdGl2ZSB7XFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTU4QjJGO1xcbiAgICAgICAgY29sb3I6ICNGRkZGRkY7XFxuICAgICAgICBib3gtc2hhZG93OiAwIDJweCAycHggMCByZ2JhKDAsIDAsIDAsIDAuMik7IH1cXG5cXG4ucHJvamVjdC1uYXZpZ2F0aW9uIC5zdGVwcGVyIHVsIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxuICBtYXJnaW46IDIwcHggMDtcXG4gIHBhZGRpbmc6IDA7IH1cXG4gIEBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC1oZWlnaHQ6IDcwMHB4KSB7XFxuICAgIC5wcm9qZWN0LW5hdmlnYXRpb24gLnN0ZXBwZXIgdWwge1xcbiAgICAgIG1hcmdpbjogMjBweCAwOyB9IH1cXG4gIC5wcm9qZWN0LW5hdmlnYXRpb24gLnN0ZXBwZXIgdWw6OmFmdGVyIHtcXG4gICAgei1pbmRleDogMTtcXG4gICAgY29udGVudDogXFxcIlxcXCI7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiAxNXB4O1xcbiAgICBsZWZ0OiA0NHB4O1xcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgIHdpZHRoOiAxcHg7XFxuICAgIGhlaWdodDogY2FsYygxMDAlIC0gMzVweCk7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNCREJEQkQ7IH1cXG5cXG4ucHJvamVjdC1uYXZpZ2F0aW9uIC5zdGVwcGVyIGxpIHtcXG4gIHotaW5kZXg6IDI7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7IH1cXG4gIC5wcm9qZWN0LW5hdmlnYXRpb24gLnN0ZXBwZXIgbGkuYWN0aXZlIGEsIC5wcm9qZWN0LW5hdmlnYXRpb24gLnN0ZXBwZXIgbGk6aG92ZXIgYSwgLnByb2plY3QtbmF2aWdhdGlvbiAuc3RlcHBlciBsaTphY3RpdmUgYSB7XFxuICAgIGNvbG9yOiAjMjEyMTIxOyB9XFxuICAucHJvamVjdC1uYXZpZ2F0aW9uIC5zdGVwcGVyIGxpLmFjdGl2ZSAuc3RlcCwgLnByb2plY3QtbmF2aWdhdGlvbiAuc3RlcHBlciBsaTpob3ZlciAuc3RlcCwgLnByb2plY3QtbmF2aWdhdGlvbiAuc3RlcHBlciBsaTphY3RpdmUgLnN0ZXAge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjQ0Q5OTIzO1xcbiAgICBib3JkZXItd2lkdGg6IDJweDsgfVxcbiAgLnByb2plY3QtbmF2aWdhdGlvbiAuc3RlcHBlciBsaS5hY3RpdmUgaSwgLnByb2plY3QtbmF2aWdhdGlvbiAuc3RlcHBlciBsaTpob3ZlciBpLCAucHJvamVjdC1uYXZpZ2F0aW9uIC5zdGVwcGVyIGxpOmFjdGl2ZSBpIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSkgc2NhbGUoMSkgcm90YXRlKDBkZWcpOyB9XFxuXFxuLnByb2plY3QtbmF2aWdhdGlvbiAuc3RlcHBlciBhIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgcGFkZGluZzogMCAyMHB4IDAgNzBweDtcXG4gIGhlaWdodDogNjJweDtcXG4gIGxpbmUtaGVpZ2h0OiA2MnB4O1xcbiAgY29sb3I6ICNCMEJFQzU7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICB0cmFuc2l0aW9uOiBhbGwgMC40cyBjdWJpYy1iZXppZXIoMC4yNSwgMC44LCAwLjI1LCAxKTsgfVxcbiAgLnByb2plY3QtbmF2aWdhdGlvbiAuc3RlcHBlciBhIHRyYW5zbGF0ZSB7XFxuICAgIG1heC13aWR0aDogMTgwcHg7XFxuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4OyB9XFxuICAgIC5wcm9qZWN0LW5hdmlnYXRpb24gLnN0ZXBwZXIgYSB0cmFuc2xhdGUgc3BhbiB7XFxuICAgICAgZGlzcGxheTogYmxvY2s7XFxuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcXG4gICAgICB3aGl0ZS1zcGFjZTogbm93cmFwOyB9XFxuICBAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtaGVpZ2h0OiA3MjBweCkge1xcbiAgICAucHJvamVjdC1uYXZpZ2F0aW9uIC5zdGVwcGVyIGEge1xcbiAgICAgIGhlaWdodDogNDhweDtcXG4gICAgICBsaW5lLWhlaWdodDogNDhweDsgfSB9XFxuXFxuLnByb2plY3QtbmF2aWdhdGlvbiAuc3RlcHBlciAuc3RlcCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDE1cHg7XFxuICBsZWZ0OiAzMHB4O1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIHdpZHRoOiAyOXB4O1xcbiAgaGVpZ2h0OiAyOXB4O1xcbiAgYm9yZGVyOiA2cHggc29saWQgI0ZGRkZGRjtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNCMEJFQzU7XFxuICBib3JkZXItcmFkaXVzOiAyOXB4O1xcbiAgdHJhbnNpdGlvbjogYWxsIDAuNHMgY3ViaWMtYmV6aWVyKDAuMjUsIDAuOCwgMC4yNSwgMSk7IH1cXG4gIEBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC1oZWlnaHQ6IDcyMHB4KSB7XFxuICAgIC5wcm9qZWN0LW5hdmlnYXRpb24gLnN0ZXBwZXIgLnN0ZXAge1xcbiAgICAgIHRvcDogOHB4OyB9IH1cXG4gIC5wcm9qZWN0LW5hdmlnYXRpb24gLnN0ZXBwZXIgLnN0ZXAgaSB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiA1MCU7XFxuICAgIGxlZnQ6IDUwJTtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSkgc2NhbGUoMC41KSByb3RhdGUoLTkwZGVnKTtcXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgICB3aWR0aDogMjBweDtcXG4gICAgaGVpZ2h0OiAyMHB4O1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIGZvbnQtc2l6ZTogMjBweDtcXG4gICAgbGluZS1oZWlnaHQ6IDIwcHg7XFxuICAgIGNvbG9yOiAjRkZGRkZGO1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC40cyBjdWJpYy1iZXppZXIoMC4yNSwgMC44LCAwLjI1LCAxKTsgfVxcblxcbi5wcm9qZWN0LW5hdmlnYXRpb24gLmVkaXQtYnV0dG9ucyB7XFxuICBwYWRkaW5nOiAyMHB4IDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRjVGNUY1O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMCAwIHJnYmEoMCwgMCwgMCwgMC4xMik7IH1cXG4gIEBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC1oZWlnaHQ6IDcwMHB4KSB7XFxuICAgIC5wcm9qZWN0LW5hdmlnYXRpb24gLmVkaXQtYnV0dG9ucyB7XFxuICAgICAgcGFkZGluZzogMTBweCAwOyB9IH1cXG4gIC5wcm9qZWN0LW5hdmlnYXRpb24gLmVkaXQtYnV0dG9ucyAubWQtYnV0dG9uIHtcXG4gICAgd2lkdGg6IDE4MHB4OyB9XFxuICAgIC5wcm9qZWN0LW5hdmlnYXRpb24gLmVkaXQtYnV0dG9ucyAubWQtYnV0dG9uIHRyYW5zbGF0ZSB7XFxuICAgICAgbWF4LXdpZHRoOiAxODBweDtcXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDsgfVxcbiAgICAgIC5wcm9qZWN0LW5hdmlnYXRpb24gLmVkaXQtYnV0dG9ucyAubWQtYnV0dG9uIHRyYW5zbGF0ZSBzcGFuIHtcXG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDsgfVxcbiAgLnByb2plY3QtbmF2aWdhdGlvbiAuZWRpdC1idXR0b25zIC5wcmltYXJ5LWJ1dHRvbnMgLm1kLWJ1dHRvbiB7XFxuICAgIG1hcmdpbjogMTVweCAwOyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/Project/Navigation/Navigation.scss\n");

/***/ }),

/***/ "./src/Project/Navigation/Navigation.scss":
/*!************************************************!*\
  !*** ./src/Project/Navigation/Navigation.scss ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/sass-loader/lib/loader.js!./Navigation.scss */ \"./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/Project/Navigation/Navigation.scss\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9OYXZpZ2F0aW9uL05hdmlnYXRpb24uc2Nzcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9Qcm9qZWN0L05hdmlnYXRpb24vTmF2aWdhdGlvbi5zY3NzPzFmNTYiXSwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vTmF2aWdhdGlvbi5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL05hdmlnYXRpb24uc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vTmF2aWdhdGlvbi5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/Project/Navigation/Navigation.scss\n");

/***/ }),

/***/ "./src/Project/Navigation/NavigationController.js":
/*!********************************************************!*\
  !*** ./src/Project/Navigation/NavigationController.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _forEach = __webpack_require__(/*! lodash/forEach */ \"./node_modules/lodash/forEach.js\");\n\nvar _forEach2 = _interopRequireDefault(_forEach);\n\nvar _projects = __webpack_require__(/*! ../../store/modules/projects */ \"./src/store/modules/projects.js\");\n\nvar ProjectModule = _interopRequireWildcard(_projects);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar NavigationController = function () {\n    function NavigationController($element, $state, $ngRedux) {\n        _classCallCheck(this, NavigationController);\n\n        this.EE = window.EE;\n        this.element = $element;\n        this.state = $state;\n        this.$ngRedux = $ngRedux;\n        this.scrollTo = this.scrollTo.bind(this);\n        this.$onInit = this.onInit.bind(this);\n        this.$onDestroy = this.onDestroy.bind(this);\n        this.scrollHandler = this.scrollHandler.bind(this);\n        this.mapState = this.mapState.bind(this);\n    }\n\n    _createClass(NavigationController, [{\n        key: 'onInit',\n        value: function onInit() {\n            this.content = window.document.getElementsByClassName('main-content')[0];\n            this.content.addEventListener('scroll', this.scrollHandler);\n            this.EE.on('activateFieldSet', this.activateNavigation, this);\n            this.unsubscribe = this.$ngRedux.connect(this.mapState, ProjectModule)(this);\n        }\n    }, {\n        key: 'onDestroy',\n        value: function onDestroy() {\n            this.EE.removeListener('activateFieldSet', this.activateNavigation);\n            this.unsubscribe();\n        }\n    }, {\n        key: 'mapState',\n        value: function mapState(state) {\n            var countryFields = ProjectModule.getProjectCountryFields(state)(!this.isPublished);\n            return {\n                countryFields: countryFields\n            };\n        }\n    }, {\n        key: 'activateNavigation',\n        value: function activateNavigation(hash) {\n            var navigation = this.element[0].getElementsByTagName('li');\n            (0, _forEach2.default)(navigation, function (element) {\n                if (element.classList.contains(hash)) {\n                    element.classList.add('active');\n                } else {\n                    element.classList.remove('active');\n                }\n            });\n        }\n    }, {\n        key: 'scrollHandler',\n        value: function scrollHandler() {\n            if (this.content.scrollTop > 260) {\n                this.element[0].style.position = 'fixed';\n                this.element[0].style.top = '70px';\n            } else {\n                this.element[0].style.position = 'absolute';\n                this.element[0].style.top = '0px';\n            }\n        }\n    }, {\n        key: 'scrollTo',\n        value: function scrollTo(hash) {\n            this.EE.emit('projectScrollTo', hash);\n        }\n    }, {\n        key: 'goTo',\n        value: function goTo(editMode) {\n            if (editMode === 'draft' && !this.project.disableDraft || editMode === 'publish' && this.project.hasPublishedVersion) {\n                this.state.go(this.state.current.name, { editMode: editMode });\n            }\n        }\n    }, {\n        key: 'saveDraftEvent',\n        value: function saveDraftEvent(e) {\n            e.preventDefault();\n            this.EE.emit('projectSaveDraft');\n        }\n    }, {\n        key: 'discardDraftEvent',\n        value: function discardDraftEvent(e) {\n            e.preventDefault();\n            this.EE.emit('projectDiscardDraft');\n        }\n    }], [{\n        key: 'navigationFactory',\n        value: function navigationFactory() {\n            __webpack_require__(/*! ./Navigation.scss */ \"./src/Project/Navigation/Navigation.scss\");\n            function navigation($element, $state, $ngRedux) {\n                return new NavigationController($element, $state, $ngRedux);\n            }\n            navigation.$inject = ['$element', '$state', '$ngRedux'];\n            return navigation;\n        }\n    }]);\n\n    return NavigationController;\n}();\n\nexports.default = NavigationController;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvUHJvamVjdC9OYXZpZ2F0aW9uL05hdmlnYXRpb25Db250cm9sbGVyLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9Qcm9qZWN0L05hdmlnYXRpb24vTmF2aWdhdGlvbkNvbnRyb2xsZXIuanM/ODkzYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5pbXBvcnQgKiBhcyBQcm9qZWN0TW9kdWxlIGZyb20gJy4uLy4uL3N0b3JlL21vZHVsZXMvcHJvamVjdHMnO1xuY2xhc3MgTmF2aWdhdGlvbkNvbnRyb2xsZXIge1xuXG4gICAgY29uc3RydWN0b3IoJGVsZW1lbnQsICRzdGF0ZSwgJG5nUmVkdXgpIHtcbiAgICAgICAgdGhpcy5FRSA9IHdpbmRvdy5FRTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgIHRoaXMuJG5nUmVkdXggPSAkbmdSZWR1eDtcbiAgICAgICAgdGhpcy5zY3JvbGxUbyA9IHRoaXMuc2Nyb2xsVG8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy4kb25Jbml0ID0gdGhpcy5vbkluaXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gdGhpcy5vbkRlc3Ryb3kuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gdGhpcy5zY3JvbGxIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMubWFwU3RhdGUgPSB0aGlzLm1hcFN0YXRlLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgb25Jbml0KCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWFpbi1jb250ZW50JylbMF07XG4gICAgICAgIHRoaXMuY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLnNjcm9sbEhhbmRsZXIpO1xuICAgICAgICB0aGlzLkVFLm9uKCdhY3RpdmF0ZUZpZWxkU2V0JywgdGhpcy5hY3RpdmF0ZU5hdmlnYXRpb24sIHRoaXMpO1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlID0gdGhpcy4kbmdSZWR1eC5jb25uZWN0KHRoaXMubWFwU3RhdGUsIFByb2plY3RNb2R1bGUpKHRoaXMpO1xuICAgIH1cblxuICAgIG9uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5FRS5yZW1vdmVMaXN0ZW5lcignYWN0aXZhdGVGaWVsZFNldCcsIHRoaXMuYWN0aXZhdGVOYXZpZ2F0aW9uKTtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIG1hcFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIGNvbnN0IGNvdW50cnlGaWVsZHMgPSBQcm9qZWN0TW9kdWxlLmdldFByb2plY3RDb3VudHJ5RmllbGRzKHN0YXRlKSghdGhpcy5pc1B1Ymxpc2hlZCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb3VudHJ5RmllbGRzXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYWN0aXZhdGVOYXZpZ2F0aW9uKGhhc2gpIHtcbiAgICAgICAgY29uc3QgbmF2aWdhdGlvbiA9IHRoaXMuZWxlbWVudFswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKTtcbiAgICAgICAgZm9yRWFjaChuYXZpZ2F0aW9uLCBlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhoYXNoKSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzY3JvbGxIYW5kbGVyKCkge1xuICAgICAgICBpZiAodGhpcy5jb250ZW50LnNjcm9sbFRvcCA+IDI2MCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50WzBdLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudFswXS5zdHlsZS50b3AgPSAnNzBweCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRbMF0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50WzBdLnN0eWxlLnRvcCA9ICcwcHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2Nyb2xsVG8oaGFzaCkge1xuICAgICAgICB0aGlzLkVFLmVtaXQoJ3Byb2plY3RTY3JvbGxUbycsIGhhc2gpO1xuICAgIH1cblxuICAgIGdvVG8oZWRpdE1vZGUpIHtcbiAgICAgICAgaWYgKChlZGl0TW9kZSA9PT0gJ2RyYWZ0JyAmJiAhdGhpcy5wcm9qZWN0LmRpc2FibGVEcmFmdClcbiAgICAgICAgICB8fCAoZWRpdE1vZGUgPT09ICdwdWJsaXNoJyAmJiB0aGlzLnByb2plY3QuaGFzUHVibGlzaGVkVmVyc2lvbikpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZ28odGhpcy5zdGF0ZS5jdXJyZW50Lm5hbWUsIHsgZWRpdE1vZGUgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlRHJhZnRFdmVudChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5FRS5lbWl0KCdwcm9qZWN0U2F2ZURyYWZ0Jyk7XG4gICAgfVxuXG4gICAgZGlzY2FyZERyYWZ0RXZlbnQoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuRUUuZW1pdCgncHJvamVjdERpc2NhcmREcmFmdCcpO1xuICAgIH1cblxuICAgIHN0YXRpYyBuYXZpZ2F0aW9uRmFjdG9yeSgpIHtcbiAgICAgICAgcmVxdWlyZSgnLi9OYXZpZ2F0aW9uLnNjc3MnKTtcbiAgICAgICAgZnVuY3Rpb24gbmF2aWdhdGlvbigkZWxlbWVudCwgJHN0YXRlLCAkbmdSZWR1eCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBOYXZpZ2F0aW9uQ29udHJvbGxlcigkZWxlbWVudCwgJHN0YXRlLCAkbmdSZWR1eCk7XG4gICAgICAgIH1cbiAgICAgICAgbmF2aWdhdGlvbi4kaW5qZWN0ID0gWyckZWxlbWVudCcsICckc3RhdGUnLCAnJG5nUmVkdXgnXTtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb247XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBOYXZpZ2F0aW9uQ29udHJvbGxlcjtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBO0FBREE7QUFDQTs7Ozs7OztBQUFBO0FBRUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBR0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/Project/Navigation/NavigationController.js\n");

/***/ })

}]);