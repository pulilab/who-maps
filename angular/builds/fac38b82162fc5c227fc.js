(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[310],{

/***/ "./src/EmailTemplates/Source/notification.html":
/*!*****************************************************!*\
  !*** ./src/EmailTemplates/Source/notification.html ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<!doctype html>\\n<html>\\n<head>\\n<meta name=\\\"viewport\\\" content=\\\"width=device-width\\\">\\n<meta http-equiv=\\\"Content-Type\\\" content=\\\"text/html; charset=UTF-8\\\">\\n<title>dhatlas email template</title>\\n<style>\\n/* -------------------------------------\\n    GLOBAL\\n------------------------------------- */\\n\\nimg {\\n  max-width: 600px;\\n  width: auto;\\n}\\n\\nbody {\\n  margin: 0;\\n  padding: 0;\\n  width: 100% !important;\\n  height: 100%;\\n  font-size: 100%;\\n  font-family: \\\"Helvetica Neue\\\", \\\"Helvetica\\\", Helvetica, Arial, sans-serif;\\n  line-height: 1.6;\\n  color: #212121;\\n  -webkit-font-smoothing: antialiased;\\n  -webkit-text-size-adjust: none;\\n}\\n\\n\\n/* -------------------------------------\\n    ELEMENTS\\n------------------------------------- */\\na {\\n  color: #283593;\\n  text-decoration: none;\\n  word-break: break-all;\\n}\\n\\n.btn-primary {\\n  margin-bottom: 20px;\\n  width: auto !important;\\n}\\n\\n.btn-primary td {\\n  border-radius: 5px;\\n  background-color: #283593;\\n  vertical-align: top;\\n  text-align: center;\\n  text-transform: uppercase;\\n  font-size: 14px;\\n  font-family: \\\"Helvetica Neue\\\", Helvetica, Arial, \\\"Lucida Grande\\\", sans-serif;\\n  /* box-shadow */\\n}\\n\\n.btn-primary td a {\\n  display: inline-block;\\n  padding: 12px 12px;\\n  border: 0;\\n  border-radius: 5px;\\n  background-color: #283593;\\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);\\n  color: #FFFFFF;\\n  text-decoration: none;\\n  font-weight: bold;\\n  line-height: 1;\\n  cursor: pointer;\\n}\\n\\n.last {\\n  margin-bottom: 0;\\n}\\n\\n.first {\\n  margin-top: 0;\\n}\\n\\n.center {\\n  margin-left: auto;\\n  margin-right: auto;\\n}\\n\\n.padding {\\n  padding: 10px 0;\\n}\\n\\n/* -------------------------------------\\n    TOPNAV\\n------------------------------------- */\\ntable.topnav-wrap {\\n  background-color: #283593;\\n  width: 100%;\\n  height: 50px;\\n  color: #FFFFFF;\\n}\\n\\ntable.topnav-wrap td {\\n  padding: 0 20px;\\n}\\n\\n.logo strong {\\n  display: inline-block;\\n  margin-top: 5px;\\n  width: 163px;\\n  height: 22px;\\n  border: 0;\\n  background: transparent url(\\\"images/dha-logo@2x.png\\\") 0 0 no-repeat;\\n  /*---*/\\n  background-color: transparent;\\n  -webkit-background-size: 163px 22px;\\n  background-size: 163px 22px;\\n  color: transparent;\\n  text-shadow: none;\\n}\\n\\n.link {\\n  text-align: right;\\n}\\n\\n.link a {\\n  color: #FFFFFF;\\n  text-decoration: none;\\n  font-size: 12px;\\n}\\n\\n/* -------------------------------------\\n    HEADLINE\\n------------------------------------- */\\ntable.headline-wrap {\\n  width: 100%;\\n  color: #283593;\\n  text-align: center;\\n}\\n\\ntable.headline-wrap h2 {\\n  margin: 30px 0;\\n}\\n\\n\\n/* -------------------------------------\\n    BODY\\n------------------------------------- */\\ntable.body-wrap {\\n  width: 100%;\\n  padding: 0 20px;\\n}\\n\\ntable.body-wrap .container {\\n  padding: 50px;\\n  -webkit-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);\\n  -moz-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);\\n  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);\\n}\\n\\ntable.body-wrap .container-bg-1 {\\n  background: #FFFFFF url(\\\"images/bg-icon-1.png\\\") center bottom no-repeat;\\n  /*---*/\\n  -webkit-background-size: 44% auto;\\n  background-size: 44% auto;\\n}\\n\\ntable.body-wrap .container-bg-2 {\\n  background: #FFFFFF url(\\\"images/bg-icon-2.png\\\") 40% bottom no-repeat;\\n  /*---*/\\n  -webkit-background-size: 44% auto;\\n  background-size: 44% auto;\\n}\\n\\n\\n/* -------------------------------------\\n    FOOTER\\n------------------------------------- */\\ntable.footer-wrap {\\n  clear: both !important;\\n  width: 100%;\\n  margin: 0 0 20px;\\n  padding: 0 20px;\\n  font-size: 12px;\\n}\\n\\n.footer-wrap .container p {\\n  color: #9D9D9D;\\n  font-size: 10px;\\n  line-height: 1.4;\\n}\\n\\ntable.footer-wrap ul {\\n  margin: 20px;\\n  padding: 0;\\n  font-size: 12px;\\n}\\n\\ntable.footer-wrap ul li {\\n  display: inline-block;\\n  margin: 0 10px 10px;\\n  list-style-type: none;\\n}\\n\\ntable.footer-wrap a {\\n  color: #9D9D9D;\\n  text-decoration: underline;\\n}\\n\\n\\n/* -------------------------------------\\n    TYPOGRAPHY\\n------------------------------------- */\\nh1,\\nh2,\\nh3 {\\n  margin: 40px 0 20px;\\n  color: #283593;\\n  font-weight: 500;\\n  font-family: \\\"Helvetica Neue\\\", Helvetica, Arial, \\\"Lucida Grande\\\", sans-serif;\\n  line-height: 1.2;\\n}\\n\\nh1 {\\n  font-size: 40px;\\n}\\nh2 {\\n  font-size: 30px;\\n}\\nh3 {\\n  font-size: 20px;\\n}\\n\\np,\\nul,\\nol {\\n  margin-bottom: 20px;\\n  font-weight: normal;\\n  font-size: 14px;\\n}\\n\\nul li,\\nol li {\\n  margin-left: 5px;\\n  list-style-position: inside;\\n}\\n\\n/* ---------------------------------------------------\\n    RESPONSIVENESS\\n------------------------------------------------------ */\\n.container {\\n  display: block !important;\\n  clear: both !important;\\n  margin: 0 auto !important;\\n  max-width: 600px !important;\\n}\\n\\n/* Outlook compatibility */\\n.body-wrap .container,\\n.headline-wrap .container  {\\n  padding: 0 20px;\\n}\\n\\n.content {\\n  display: block;\\n  margin: 0 auto;\\n  max-width: 600px;\\n}\\n\\n.content table {\\n  width: 100%;\\n}\\n\\n</style>\\n</head>\\n\\n<body bgcolor=\\\"#E3EAEF\\\">\\n\\n<!-- topnav -->\\n<table class=\\\"topnav-wrap\\\" width=\\\"100%\\\" height=\\\"50px\\\" bgcolor=\\\"#283593\\\">\\n  <tr>\\n    <td class=\\\"logo\\\"><strong>Digital Health Atlas</strong></td>\\n    <td class=\\\"link\\\"><a href=\\\"http://dhatlas.org\\\">Visit dhatlas.org</a></td>\\n  </tr>\\n</table>\\n\\n<!-- headline -->\\n<table class=\\\"headline-wrap\\\" width=\\\"100%\\\">\\n  <tr>\\n    <td class=\\\"container\\\">\\n      <div class=\\\"content\\\">\\n        <table>\\n          <tr>\\n            <td>\\n              <h2>Thank you!</h2>\\n            </td>\\n          </tr>\\n        </table>\\n      </div>\\n    </td>\\n  </tr>\\n</table>\\n\\n<!-- body -->\\n<table class=\\\"body-wrap\\\" bgcolor=\\\"#E3EAEF\\\">\\n  <tr>\\n    <td></td>\\n    <td class=\\\"container container-bg-2\\\" bgcolor=\\\"#FFFFFF\\\">\\n\\n      <!-- content -->\\n      <div class=\\\"content\\\">\\n      <table>\\n        <tr>\\n          <td>\\n            <h3 class=\\\"first\\\">You've been added to a group!</h3>\\n            <p>Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Quam temere in vitiis, legem sancimus haerentia. Prima luce, cum quibus mons aliud  consensu ab eo.</p>\\n\\n            <!-- button -->\\n            <table class=\\\"btn-primary last\\\" cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" border=\\\"0\\\">\\n              <tr>\\n                <td>\\n                  <a href=\\\"#\\\">Go to My Profile</a>\\n                </td>\\n              </tr>\\n            </table>\\n            <!-- /button -->\\n\\n          </td>\\n        </tr>\\n      </table>\\n      </div>\\n      <!-- /content -->\\n\\n    </td>\\n    <td></td>\\n  </tr>\\n</table>\\n<!-- /body -->\\n\\n<!-- footer -->\\n<table class=\\\"footer-wrap\\\">\\n  <tr>\\n    <td></td>\\n    <td class=\\\"container\\\">\\n\\n      <!-- content -->\\n      <div class=\\\"content\\\">\\n        <table>\\n          <tr>\\n            <td align=\\\"center\\\">\\n              <ul>\\n                <li><a href=\\\"http://dhatlas.org\\\">Go to website</a></li>\\n                <li><a href=\\\"http://dhatlas.org/#\\\">Terms of services</a></li>\\n                <li><a href=\\\"mailto:\\\">Contact us</a></li>\\n              </ul>\\n              <p><b>Disclaimer:</b> All reasonable precautions have been taken by the World Health Organization to verify the information contained in this publication. However, the published material is being distributed without warranty of any kind, either expressed or implied. The responsibility for the interpretation and use of the material lies with the reader. In no event shall the World Health Organization be liable for damages arising from its use.</p>\\n            </td>\\n          </tr>\\n        </table>\\n      </div>\\n      <!-- /content -->\\n\\n    </td>\\n    <td></td>\\n  </tr>\\n</table>\\n<!-- /footer -->\\n\\n</body>\\n</html>\\n\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvRW1haWxUZW1wbGF0ZXMvU291cmNlL25vdGlmaWNhdGlvbi5odG1sLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0VtYWlsVGVtcGxhdGVzL1NvdXJjZS9ub3RpZmljYXRpb24uaHRtbD9jNzY4Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8IWRvY3R5cGUgaHRtbD5cXG48aHRtbD5cXG48aGVhZD5cXG48bWV0YSBuYW1lPVxcXCJ2aWV3cG9ydFxcXCIgY29udGVudD1cXFwid2lkdGg9ZGV2aWNlLXdpZHRoXFxcIj5cXG48bWV0YSBodHRwLWVxdWl2PVxcXCJDb250ZW50LVR5cGVcXFwiIGNvbnRlbnQ9XFxcInRleHQvaHRtbDsgY2hhcnNldD1VVEYtOFxcXCI+XFxuPHRpdGxlPmRoYXRsYXMgZW1haWwgdGVtcGxhdGU8L3RpdGxlPlxcbjxzdHlsZT5cXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuICAgIEdMT0JBTFxcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cXG5cXG5pbWcge1xcbiAgbWF4LXdpZHRoOiA2MDBweDtcXG4gIHdpZHRoOiBhdXRvO1xcbn1cXG5cXG5ib2R5IHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgZm9udC1zaXplOiAxMDAlO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIsIFxcXCJIZWx2ZXRpY2FcXFwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xcbiAgbGluZS1oZWlnaHQ6IDEuNjtcXG4gIGNvbG9yOiAjMjEyMTIxO1xcbiAgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxuICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XFxufVxcblxcblxcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG4gICAgRUxFTUVOVFNcXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXFxuYSB7XFxuICBjb2xvcjogIzI4MzU5MztcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIHdvcmQtYnJlYWs6IGJyZWFrLWFsbDtcXG59XFxuXFxuLmJ0bi1wcmltYXJ5IHtcXG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XFxuICB3aWR0aDogYXV0byAhaW1wb3J0YW50O1xcbn1cXG5cXG4uYnRuLXByaW1hcnkgdGQge1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzI4MzU5MztcXG4gIHZlcnRpY2FsLWFsaWduOiB0b3A7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbiAgZm9udC1zaXplOiAxNHB4O1xcbiAgZm9udC1mYW1pbHk6IFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIsIEhlbHZldGljYSwgQXJpYWwsIFxcXCJMdWNpZGEgR3JhbmRlXFxcIiwgc2Fucy1zZXJpZjtcXG4gIC8qIGJveC1zaGFkb3cgKi9cXG59XFxuXFxuLmJ0bi1wcmltYXJ5IHRkIGEge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgcGFkZGluZzogMTJweCAxMnB4O1xcbiAgYm9yZGVyOiAwO1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzI4MzU5MztcXG4gIGJveC1zaGFkb3c6IDAgMnB4IDVweCAwIHJnYmEoMCwgMCwgMCwgMC4yNik7XFxuICBjb2xvcjogI0ZGRkZGRjtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5sYXN0IHtcXG4gIG1hcmdpbi1ib3R0b206IDA7XFxufVxcblxcbi5maXJzdCB7XFxuICBtYXJnaW4tdG9wOiAwO1xcbn1cXG5cXG4uY2VudGVyIHtcXG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xcbn1cXG5cXG4ucGFkZGluZyB7XFxuICBwYWRkaW5nOiAxMHB4IDA7XFxufVxcblxcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG4gICAgVE9QTkFWXFxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xcbnRhYmxlLnRvcG5hdi13cmFwIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMyODM1OTM7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogNTBweDtcXG4gIGNvbG9yOiAjRkZGRkZGO1xcbn1cXG5cXG50YWJsZS50b3BuYXYtd3JhcCB0ZCB7XFxuICBwYWRkaW5nOiAwIDIwcHg7XFxufVxcblxcbi5sb2dvIHN0cm9uZyB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBtYXJnaW4tdG9wOiA1cHg7XFxuICB3aWR0aDogMTYzcHg7XFxuICBoZWlnaHQ6IDIycHg7XFxuICBib3JkZXI6IDA7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudCB1cmwoXFxcImltYWdlcy9kaGEtbG9nb0AyeC5wbmdcXFwiKSAwIDAgbm8tcmVwZWF0O1xcbiAgLyotLS0qL1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICAtd2Via2l0LWJhY2tncm91bmQtc2l6ZTogMTYzcHggMjJweDtcXG4gIGJhY2tncm91bmQtc2l6ZTogMTYzcHggMjJweDtcXG4gIGNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIHRleHQtc2hhZG93OiBub25lO1xcbn1cXG5cXG4ubGluayB7XFxuICB0ZXh0LWFsaWduOiByaWdodDtcXG59XFxuXFxuLmxpbmsgYSB7XFxuICBjb2xvcjogI0ZGRkZGRjtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG59XFxuXFxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcbiAgICBIRUFETElORVxcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cXG50YWJsZS5oZWFkbGluZS13cmFwIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgY29sb3I6ICMyODM1OTM7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbnRhYmxlLmhlYWRsaW5lLXdyYXAgaDIge1xcbiAgbWFyZ2luOiAzMHB4IDA7XFxufVxcblxcblxcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG4gICAgQk9EWVxcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cXG50YWJsZS5ib2R5LXdyYXAge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBwYWRkaW5nOiAwIDIwcHg7XFxufVxcblxcbnRhYmxlLmJvZHktd3JhcCAuY29udGFpbmVyIHtcXG4gIHBhZGRpbmc6IDUwcHg7XFxuICAtd2Via2l0LWJveC1zaGFkb3c6IDBweCAxcHggNXB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMiksIDBweCAycHggMnB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTQpLCAwcHggM3B4IDFweCAtMnB4IHJnYmEoMCwgMCwgMCwgMC4xMik7XFxuICAtbW96LWJveC1zaGFkb3c6IDBweCAxcHggNXB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMiksIDBweCAycHggMnB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTQpLCAwcHggM3B4IDFweCAtMnB4IHJnYmEoMCwgMCwgMCwgMC4xMik7XFxuICBib3gtc2hhZG93OiAwcHggMXB4IDVweCAwcHggcmdiYSgwLCAwLCAwLCAwLjIpLCAwcHggMnB4IDJweCAwcHggcmdiYSgwLCAwLCAwLCAwLjE0KSwgMHB4IDNweCAxcHggLTJweCByZ2JhKDAsIDAsIDAsIDAuMTIpO1xcbn1cXG5cXG50YWJsZS5ib2R5LXdyYXAgLmNvbnRhaW5lci1iZy0xIHtcXG4gIGJhY2tncm91bmQ6ICNGRkZGRkYgdXJsKFxcXCJpbWFnZXMvYmctaWNvbi0xLnBuZ1xcXCIpIGNlbnRlciBib3R0b20gbm8tcmVwZWF0O1xcbiAgLyotLS0qL1xcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLXNpemU6IDQ0JSBhdXRvO1xcbiAgYmFja2dyb3VuZC1zaXplOiA0NCUgYXV0bztcXG59XFxuXFxudGFibGUuYm9keS13cmFwIC5jb250YWluZXItYmctMiB7XFxuICBiYWNrZ3JvdW5kOiAjRkZGRkZGIHVybChcXFwiaW1hZ2VzL2JnLWljb24tMi5wbmdcXFwiKSA0MCUgYm90dG9tIG5vLXJlcGVhdDtcXG4gIC8qLS0tKi9cXG4gIC13ZWJraXQtYmFja2dyb3VuZC1zaXplOiA0NCUgYXV0bztcXG4gIGJhY2tncm91bmQtc2l6ZTogNDQlIGF1dG87XFxufVxcblxcblxcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG4gICAgRk9PVEVSXFxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xcbnRhYmxlLmZvb3Rlci13cmFwIHtcXG4gIGNsZWFyOiBib3RoICFpbXBvcnRhbnQ7XFxuICB3aWR0aDogMTAwJTtcXG4gIG1hcmdpbjogMCAwIDIwcHg7XFxuICBwYWRkaW5nOiAwIDIwcHg7XFxuICBmb250LXNpemU6IDEycHg7XFxufVxcblxcbi5mb290ZXItd3JhcCAuY29udGFpbmVyIHAge1xcbiAgY29sb3I6ICM5RDlEOUQ7XFxuICBmb250LXNpemU6IDEwcHg7XFxuICBsaW5lLWhlaWdodDogMS40O1xcbn1cXG5cXG50YWJsZS5mb290ZXItd3JhcCB1bCB7XFxuICBtYXJnaW46IDIwcHg7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbn1cXG5cXG50YWJsZS5mb290ZXItd3JhcCB1bCBsaSB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBtYXJnaW46IDAgMTBweCAxMHB4O1xcbiAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xcbn1cXG5cXG50YWJsZS5mb290ZXItd3JhcCBhIHtcXG4gIGNvbG9yOiAjOUQ5RDlEO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XFxufVxcblxcblxcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG4gICAgVFlQT0dSQVBIWVxcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cXG5oMSxcXG5oMixcXG5oMyB7XFxuICBtYXJnaW46IDQwcHggMCAyMHB4O1xcbiAgY29sb3I6ICMyODM1OTM7XFxuICBmb250LXdlaWdodDogNTAwO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIsIEhlbHZldGljYSwgQXJpYWwsIFxcXCJMdWNpZGEgR3JhbmRlXFxcIiwgc2Fucy1zZXJpZjtcXG4gIGxpbmUtaGVpZ2h0OiAxLjI7XFxufVxcblxcbmgxIHtcXG4gIGZvbnQtc2l6ZTogNDBweDtcXG59XFxuaDIge1xcbiAgZm9udC1zaXplOiAzMHB4O1xcbn1cXG5oMyB7XFxuICBmb250LXNpemU6IDIwcHg7XFxufVxcblxcbnAsXFxudWwsXFxub2wge1xcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcXG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XFxuICBmb250LXNpemU6IDE0cHg7XFxufVxcblxcbnVsIGxpLFxcbm9sIGxpIHtcXG4gIG1hcmdpbi1sZWZ0OiA1cHg7XFxuICBsaXN0LXN0eWxlLXBvc2l0aW9uOiBpbnNpZGU7XFxufVxcblxcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcbiAgICBSRVNQT05TSVZFTkVTU1xcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xcbi5jb250YWluZXIge1xcbiAgZGlzcGxheTogYmxvY2sgIWltcG9ydGFudDtcXG4gIGNsZWFyOiBib3RoICFpbXBvcnRhbnQ7XFxuICBtYXJnaW46IDAgYXV0byAhaW1wb3J0YW50O1xcbiAgbWF4LXdpZHRoOiA2MDBweCAhaW1wb3J0YW50O1xcbn1cXG5cXG4vKiBPdXRsb29rIGNvbXBhdGliaWxpdHkgKi9cXG4uYm9keS13cmFwIC5jb250YWluZXIsXFxuLmhlYWRsaW5lLXdyYXAgLmNvbnRhaW5lciAge1xcbiAgcGFkZGluZzogMCAyMHB4O1xcbn1cXG5cXG4uY29udGVudCB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIG1hcmdpbjogMCBhdXRvO1xcbiAgbWF4LXdpZHRoOiA2MDBweDtcXG59XFxuXFxuLmNvbnRlbnQgdGFibGUge1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbjwvc3R5bGU+XFxuPC9oZWFkPlxcblxcbjxib2R5IGJnY29sb3I9XFxcIiNFM0VBRUZcXFwiPlxcblxcbjwhLS0gdG9wbmF2IC0tPlxcbjx0YWJsZSBjbGFzcz1cXFwidG9wbmF2LXdyYXBcXFwiIHdpZHRoPVxcXCIxMDAlXFxcIiBoZWlnaHQ9XFxcIjUwcHhcXFwiIGJnY29sb3I9XFxcIiMyODM1OTNcXFwiPlxcbiAgPHRyPlxcbiAgICA8dGQgY2xhc3M9XFxcImxvZ29cXFwiPjxzdHJvbmc+RGlnaXRhbCBIZWFsdGggQXRsYXM8L3N0cm9uZz48L3RkPlxcbiAgICA8dGQgY2xhc3M9XFxcImxpbmtcXFwiPjxhIGhyZWY9XFxcImh0dHA6Ly9kaGF0bGFzLm9yZ1xcXCI+VmlzaXQgZGhhdGxhcy5vcmc8L2E+PC90ZD5cXG4gIDwvdHI+XFxuPC90YWJsZT5cXG5cXG48IS0tIGhlYWRsaW5lIC0tPlxcbjx0YWJsZSBjbGFzcz1cXFwiaGVhZGxpbmUtd3JhcFxcXCIgd2lkdGg9XFxcIjEwMCVcXFwiPlxcbiAgPHRyPlxcbiAgICA8dGQgY2xhc3M9XFxcImNvbnRhaW5lclxcXCI+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwiY29udGVudFxcXCI+XFxuICAgICAgICA8dGFibGU+XFxuICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICA8aDI+VGhhbmsgeW91ITwvaDI+XFxuICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgPC90cj5cXG4gICAgICAgIDwvdGFibGU+XFxuICAgICAgPC9kaXY+XFxuICAgIDwvdGQ+XFxuICA8L3RyPlxcbjwvdGFibGU+XFxuXFxuPCEtLSBib2R5IC0tPlxcbjx0YWJsZSBjbGFzcz1cXFwiYm9keS13cmFwXFxcIiBiZ2NvbG9yPVxcXCIjRTNFQUVGXFxcIj5cXG4gIDx0cj5cXG4gICAgPHRkPjwvdGQ+XFxuICAgIDx0ZCBjbGFzcz1cXFwiY29udGFpbmVyIGNvbnRhaW5lci1iZy0yXFxcIiBiZ2NvbG9yPVxcXCIjRkZGRkZGXFxcIj5cXG5cXG4gICAgICA8IS0tIGNvbnRlbnQgLS0+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwiY29udGVudFxcXCI+XFxuICAgICAgPHRhYmxlPlxcbiAgICAgICAgPHRyPlxcbiAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgPGgzIGNsYXNzPVxcXCJmaXJzdFxcXCI+WW91J3ZlIGJlZW4gYWRkZWQgdG8gYSBncm91cCE8L2gzPlxcbiAgICAgICAgICAgIDxwPkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNpY2kgZWxpdCwgc2VkIGVpdXNtb2QgdGVtcG9yIGluY2lkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBRdWFtIHRlbWVyZSBpbiB2aXRpaXMsIGxlZ2VtIHNhbmNpbXVzIGhhZXJlbnRpYS4gUHJpbWEgbHVjZSwgY3VtIHF1aWJ1cyBtb25zIGFsaXVkICBjb25zZW5zdSBhYiBlby48L3A+XFxuXFxuICAgICAgICAgICAgPCEtLSBidXR0b24gLS0+XFxuICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVxcXCJidG4tcHJpbWFyeSBsYXN0XFxcIiBjZWxscGFkZGluZz1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCI+XFxuICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICA8YSBocmVmPVxcXCIjXFxcIj5HbyB0byBNeSBQcm9maWxlPC9hPlxcbiAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICA8L3RhYmxlPlxcbiAgICAgICAgICAgIDwhLS0gL2J1dHRvbiAtLT5cXG5cXG4gICAgICAgICAgPC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgPC90YWJsZT5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8IS0tIC9jb250ZW50IC0tPlxcblxcbiAgICA8L3RkPlxcbiAgICA8dGQ+PC90ZD5cXG4gIDwvdHI+XFxuPC90YWJsZT5cXG48IS0tIC9ib2R5IC0tPlxcblxcbjwhLS0gZm9vdGVyIC0tPlxcbjx0YWJsZSBjbGFzcz1cXFwiZm9vdGVyLXdyYXBcXFwiPlxcbiAgPHRyPlxcbiAgICA8dGQ+PC90ZD5cXG4gICAgPHRkIGNsYXNzPVxcXCJjb250YWluZXJcXFwiPlxcblxcbiAgICAgIDwhLS0gY29udGVudCAtLT5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJjb250ZW50XFxcIj5cXG4gICAgICAgIDx0YWJsZT5cXG4gICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgIDx0ZCBhbGlnbj1cXFwiY2VudGVyXFxcIj5cXG4gICAgICAgICAgICAgIDx1bD5cXG4gICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XFxcImh0dHA6Ly9kaGF0bGFzLm9yZ1xcXCI+R28gdG8gd2Vic2l0ZTwvYT48L2xpPlxcbiAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cXFwiaHR0cDovL2RoYXRsYXMub3JnLyNcXFwiPlRlcm1zIG9mIHNlcnZpY2VzPC9hPjwvbGk+XFxuICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVxcXCJtYWlsdG86XFxcIj5Db250YWN0IHVzPC9hPjwvbGk+XFxuICAgICAgICAgICAgICA8L3VsPlxcbiAgICAgICAgICAgICAgPHA+PGI+RGlzY2xhaW1lcjo8L2I+IEFsbCByZWFzb25hYmxlIHByZWNhdXRpb25zIGhhdmUgYmVlbiB0YWtlbiBieSB0aGUgV29ybGQgSGVhbHRoIE9yZ2FuaXphdGlvbiB0byB2ZXJpZnkgdGhlIGluZm9ybWF0aW9uIGNvbnRhaW5lZCBpbiB0aGlzIHB1YmxpY2F0aW9uLiBIb3dldmVyLCB0aGUgcHVibGlzaGVkIG1hdGVyaWFsIGlzIGJlaW5nIGRpc3RyaWJ1dGVkIHdpdGhvdXQgd2FycmFudHkgb2YgYW55IGtpbmQsIGVpdGhlciBleHByZXNzZWQgb3IgaW1wbGllZC4gVGhlIHJlc3BvbnNpYmlsaXR5IGZvciB0aGUgaW50ZXJwcmV0YXRpb24gYW5kIHVzZSBvZiB0aGUgbWF0ZXJpYWwgbGllcyB3aXRoIHRoZSByZWFkZXIuIEluIG5vIGV2ZW50IHNoYWxsIHRoZSBXb3JsZCBIZWFsdGggT3JnYW5pemF0aW9uIGJlIGxpYWJsZSBmb3IgZGFtYWdlcyBhcmlzaW5nIGZyb20gaXRzIHVzZS48L3A+XFxuICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgPC90cj5cXG4gICAgICAgIDwvdGFibGU+XFxuICAgICAgPC9kaXY+XFxuICAgICAgPCEtLSAvY29udGVudCAtLT5cXG5cXG4gICAgPC90ZD5cXG4gICAgPHRkPjwvdGQ+XFxuICA8L3RyPlxcbjwvdGFibGU+XFxuPCEtLSAvZm9vdGVyIC0tPlxcblxcbjwvYm9keT5cXG48L2h0bWw+XFxuXCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/EmailTemplates/Source/notification.html\n");

/***/ })

}]);