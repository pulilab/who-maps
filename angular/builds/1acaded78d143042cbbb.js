(window.webpackJsonp=window.webpackJsonp||[]).push([[509],{"./src/Common/EditProfile/EditProfile.html":function(n,e){n.exports='<div layout="column" layout-align="start center" >\n\n  <div class="page-title">\n    <h1 class="md-display-1 text-center"><translate>Edit User profile</translate></h1>\n  </div>\n\n\n  <div layout="row" layout-sm="column" layout-align="space-around" ng-show="!vm.dataLoaded">\n    <md-progress-circular md-mode="indeterminate" md-diameter="50"></md-progress-circular>\n  </div>\n\n  <div md-whiteframe="2" class="layout-padding-xl wrapper" layout-fill layout="column" ng-if="vm.dataLoaded">\n    <div class="profile-header md-title">\n      <translate>General info</translate>\n      <span class="last-update"><translate>Last update:</translate> {{vm.userProfile.modified}}</span>\n    </div>\n    <form name="vm.editProfileForm" ng-submit="vm.save($event)" novalidate>\n      <div layout="row" class="first">\n        <div flex="50">\n          <md-input-container class="md-block">\n            <label><translate>My name</translate></label>\n            <input ng-model="vm.userProfile.name" required name="name" type="text" ng-change="vm.handleCustomError(\'name\')" />\n            <div ng-messages="vm.editProfileForm.name.$error">\n              <div ng-message="required"><translate>This is required.</translate></div>\n              <div ng-message="custom" ng-repeat="error in vm.editProfileForm.name.customError">{{error}}</div>\n            </div>\n          </md-input-container>\n        </div>\n\n        <div flex="50">\n          <md-input-container class="md-block">\n            <label><translate>My email address</translate></label>\n            <input ng-model="vm.userProfile.email"\n                   ng-disabled="true" required name="email"\n                   type="email" ng-change="vm.handleCustomError(\'email\')" />\n            <div ng-messages="vm.editProfileForm.email.$error">\n              <div ng-message="email"><translate>This must be a valid email</translate></div>\n              <div ng-message="required"><translate>This is required.</translate></div>\n              <div ng-message="custom" ng-repeat="error in vm.editProfileForm.email.customError">{{error}}</div>\n            </div>\n          </md-input-container>\n        </div>\n      </div>\n\n      <div class="md-block">\n        <organisation-autocomplete\n          organisation="vm.userProfile.organisation"\n          form="vm.editProfileForm">\n        </organisation-autocomplete>\n      </div>\n\n      <div layout="row">\n        <div class="countries" flex="50">\n          <md-input-container class="md-block">\n            <label>\n              <translate>Country</translate>\n            </label>\n            <md-select\n              ng-disabled="vm.editMode"\n              required\n              name="country"\n              options="vm.countriesList"\n              ng-model="vm.userProfile.country.id"\n              placeholder="{{\'Select country from list\'|translate}}">\n              <md-option ng-value="country.id" ng-repeat="country in vm.countriesList track by country.id">\n                {{country.name}}\n              </md-option>\n            </md-select>\n            <div ng-messages="vm.editProfileForm.country.$error">\n              <div ng-message="required"><translate>This is required.</translate></div>\n              <div ng-message="custom" ng-repeat="error in vm.editProfileForm.country.customError">{{error}}</div>\n            </div>\n          </md-input-container>\n        </div>\n\n        <div class="languages" flex="50">\n          <md-input-container class="md-block">\n            <label>\n              <translate>Site language</translate>\n            </label>\n            <md-select ng-model="vm.userProfile.language">\n              <md-option ng-value="lang.code" ng-repeat="lang in vm.languages">{{lang.name}}</md-option>\n            </md-select>\n            <div ng-messages="vm.editProfileForm.country.$error">\n              <div ng-message="required">\n                <translate>This is required.</translate>\n              </div>\n              <div ng-message="custom" ng-repeat="error in vm.editProfileForm.country.customError">{{error}}</div>\n            </div>\n          </md-input-container>\n        </div>\n\n      </div>\n\n      <div layout="row" class="edit-button">\n        <div flex="50" layout="row" layout-align="start center">\n          <md-button class="md-gray md-raised" ui-sref="dashboard"><translate>Dismiss Changes</translate></md-button>\n        </div>\n        <div flex="50" layout="row" layout-align="end center">\n          <md-button type="submit" class="md-primary md-raised"><translate>Save Profile</translate></md-button>\n        </div>\n      </div>\n    </form>\n  </div>\n\n  <disclaimer></disclaimer>\n</div>\n'}}]);