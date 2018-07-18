(window.webpackJsonp=window.webpackJsonp||[]).push([[166],{"./src/Project/CountryFields/ReadOnlyCountryFields.html":function(n,e){n.exports='<div class="project-section section-country-fields read-only" md-whiteframe="2" ng-show="vm.countryFields && vm.countryFields.length > 0">\n\n  <div class="section-title md-title">\n    <translate>5. Country fields</translate>\n    <span class="toggler" ng-click="vm.collapse()"><i class="material-icons">keyboard_arrow_down</i></span>\n  </div>\n\n  <div class="section-wrapper">\n\n      <div class="generic-container" flex ng-repeat="field in vm.countryFields">\n\n        \x3c!-- TEXT INPUT--\x3e\n        <div\n          ng-if="field.type === 1"\n          class="md-block string-field">\n          <h6>{{field.question}}</h6>\n          <p>{{field.answer}}</p>\n        </div>\n\n\n        \x3c!-- NUMERIC INPUT--\x3e\n        <div\n          ng-if="field.type === 2"\n          class="md-block number-field">\n          <h6>{{field.question}}</h6>\n          <p>{{field.answer}}</p>\n        </div>\n\n\n        \x3c!-- RADIO BUTTON--\x3e\n        <div\n          ng-if="field.type === 3"\n          class="yesno-field">\n          <h6>{{field.question}}</h6>\n          <p ng-show="field.answer">Yes</p>\n          <p ng-hide="field.answer">No</p>\n        </div>\n\n        \x3c!-- SINGLE SELECTION FIELD--\x3e\n        <div\n          ng-if="field.type ===4"\n          class="single-selection-field">\n          <h6>{{field.question}}</h6>\n          <p >{{field.answer}}</p>\n        </div>\n\n\n         \x3c!--MULTIPLE SELECTION--\x3e\n        <div\n          ng-if="field.type === 5"\n          class="multi-selection-field">\n          <h6>{{field.question}}</h6>\n          <ul>\n            <li ng-repeat="a in field.answer">{{a}}</li>\n          </ul>\n        </div>\n\n\n      </div>\n\n  </div>\n\n</div>\n'}}]);