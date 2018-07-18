(window.webpackJsonp=window.webpackJsonp||[]).push([[153],{"./src/Project/Navigation/Navigation.html":function(n,t){n.exports='<div class="project-section project-navigation" md-whiteframe="2">\n  <div class="section-title md-title">\n    <translate>Navigation</translate>\n  </div>\n  <div class="edit-mode-switch" layout="row" layout-align="start center" ng-if="vm.state.current.name === \'editProject\'">\n    <div>\n      <translate>Switch view:</translate>\n    </div>\n    <div layout="row" layout-align="start stretch">\n      <div>\n        <button type="button" ng-click="vm.goTo(\'draft\')"  class="draft" ng-class="{\'active\': vm.state.params.editMode === \'draft\'}">\n          <md-tooltip md-autohide md-direction="top" ng-if="vm.project.disableDraft">\n            <translate>You are not allowed to access the draft</translate>\n          </md-tooltip>\n          <translate>Draft</translate>\n        </button>\n      </div>\n      <div>\n        <button type="button"\n                ng-click="vm.goTo(\'publish\')" class="publish" ng-class="{\'active\': vm.state.params.editMode === \'publish\'}">\n          <md-tooltip md-autohide md-direction="top" ng-if="!vm.project.hasPublishedVersion">\n            <translate>There is no published version</translate>\n          </md-tooltip>\n          <translate>Published</translate>\n        </button>\n      </div>\n    </div>\n  </div>\n  <div layout="column" class="stepper">\n    <ul>\n      <li class="general-overview active">\n        <a ng-click="vm.scrollTo(\'general-overview\')">\n          <span class="step">\n            <i class="material-icons">&#xE5C8;</i>\n          </span>\n          <translate>General</translate>\n        </a>\n      </li>\n      <li class="implementation-overview">\n        <a ng-click="vm.scrollTo(\'implementation-overview\')">\n          <span class="step">\n            <i class="material-icons">&#xE5C8;</i>\n          </span>\n          <translate>Implementation</translate>\n        </a>\n      </li>\n      <li class="technology">\n        <a ng-click="vm.scrollTo(\'technology\')">\n          <span class="step">\n            <i class="material-icons">&#xE5C8;</i>\n          </span>\n          <translate>Technology</translate>\n        </a>\n      </li>\n      <li class="interoperability">\n        <a ng-click="vm.scrollTo(\'interoperability\')">\n          <span class="step">\n            <i class="material-icons">&#xE5C8;</i>\n          </span>\n          <translate>Interoperability</translate>\n        </a>\n      </li>\n      <li class="country-fields" ng-show="vm.countryFields && vm.countryFields.length > 0">\n        <a ng-click="vm.scrollTo(\'country-fields\')">\n          <span class="step">\n            <i class="material-icons">&#xE5C8;</i>\n          </span>\n          <translate>Country fields</translate>\n        </a>\n      </li>\n    </ul>\n  </div>\n  <div layout="column" class="edit-buttons" ng-if="vm.isTeam || vm.state.current.name === \'newProject\'">\n    <div class="primary-buttons" ng-if-start="vm.state.params.editMode === \'draft\' && vm.state.current.name === \'editProject\'">\n      <md-button type="submit" class="md-primary md-raised">\n        <translate>Publish</translate>\n      </md-button>\n    </div>\n    <div class="secondary-buttons">\n      <md-button class="md-primary" ng-click="vm.saveDraftEvent($event)">\n        <translate>Save draft</translate>\n      </md-button>\n    </div>\n    <div ng-if-end class="secondary-buttons" ng-show="vm.project.hasPublishedVersion">\n      <md-button class="md-warn" ng-click="vm.discardDraftEvent($event)">\n        <translate>Discard draft</translate>\n      </md-button>\n    </div>\n    <div class="primary-buttons" ng-if="vm.state.current.name === \'newProject\'">\n      <md-button class="md-primary md-raised" ng-click="vm.saveDraftEvent($event)">\n        <translate>Save draft</translate>\n      </md-button>\n    </div>\n    <div class="secondary-buttons" ng-if="vm.state.params.editMode === \'publish\' || vm.state.current.name === \'newProject\'">\n      <md-button class="md-primary" ui-sref="dashboard">\n        <translate>Go to dashboard</translate>\n      </md-button>\n    </div>\n  </div>\n</div>\n'}}]);