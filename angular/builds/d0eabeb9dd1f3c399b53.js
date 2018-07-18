(window.webpackJsonp=window.webpackJsonp||[]).push([[151],{"./src/Project/Project.html":function(n,e){n.exports='<div layout="column" class="new-edit-project" layout-align="start center" ng-class="vm.state.params.editMode" >\n  <div class="page-title" >\n    <h1 class="md-display-1 text-center" ng-hide="vm.editMode">\n      <translate>Add New Digital Health Project</translate>\n    </h1>\n    <h1 class="md-display-1 text-center"  ng-show="vm.editMode">\n      <translate>Edit Project Info</translate>\n    </h1>\n    <h6 class="md-subhead text-center" ng-show="vm.editMode">\n      <translate>You are viewing the</translate>\n      <span class="draft-bit">\n        <translate>Draft</translate>\n      </span>\n      <span class="published-bit">\n        <translate>Published</translate>\n      </span>\n      <translate>version of the project.</translate>\n    </h6>\n  </div>\n\n  \x3c!--<div layout="row" layout-sm="column" layout-align="space-around" ng-show="!vm.dataLoaded">--\x3e\n    \x3c!--<md-progress-circular md-mode="indeterminate" md-diameter="50"></md-progress-circular>--\x3e\n  \x3c!--</div>--\x3e\n\n  <div class="project-form-wrapper md-block">\n    <form name="vm.form" ng-submit="vm.publishProject($event)" layout="row" id="npf" novalidate>\n      <div class="main-section" layout="column">\n\n        <general-overview\n          id="general-overview"\n          form="vm.form"\n          project="vm.project"\n          structure="vm.structure"\n          team="vm.team"\n          viewers="vm.viewers"\n          activate-validation="vm.activateValidation"\n          ng-if="!vm.readOnlyMode"\n          users="vm.users">\n        </general-overview>\n\n        <read-only-general-overview\n          id="general-overview"\n          form="vm.form"\n          project="vm.project"\n          structure="vm.structure"\n          team="vm.team"\n          viewers="vm.viewers"\n          activate-validation="vm.activateValidation"\n          ng-if="vm.readOnlyMode"\n          users="vm.users">\n        </read-only-general-overview>\n\n\n        <implementation-overview\n          id="implementation-overview"\n          form="vm.form"\n          project="vm.project"\n          activate-validation="vm.activateValidation"\n          ng-if="!vm.readOnlyMode"\n          structure="vm.structure">\n        </implementation-overview>\n\n        <read-only-implementation-overview\n          id="implementation-overview"\n          form="vm.form"\n          project="vm.project"\n          ng-if="vm.readOnlyMode"\n          activate-validation="vm.activateValidation"\n          structure="vm.structure">\n        </read-only-implementation-overview>\n\n\n        <technology\n          id="technology"\n          form="vm.form"\n          project="vm.project"\n          activate-validation="vm.activateValidation"\n          ng-if="!vm.readOnlyMode"\n          structure="vm.structure">\n        </technology>\n\n        <read-only-technology\n          id="technology"\n          form="vm.form"\n          project="vm.project"\n          activate-validation="vm.activateValidation"\n          ng-if="vm.readOnlyMode"\n          structure="vm.structure">\n        </read-only-technology>\n\n\n        <interoperability\n          id="interoperability"\n          form="vm.form"\n          project="vm.project"\n          activate-validation="vm.activateValidation"\n          ng-if="!vm.readOnlyMode"\n          structure="vm.structure">\n        </interoperability>\n\n        <read-only-interoperability\n          id="interoperability"\n          form="vm.form"\n          project="vm.project"\n          activate-validation="vm.activateValidation"\n          ng-if="vm.readOnlyMode"\n          structure="vm.structure">\n        </read-only-interoperability>\n\n\n        <country-fields\n          id="country-fields"\n          form="vm.form"\n          project="vm.project"\n          is-published="vm.publishMode"\n          is-new-project="vm.newProject"\n          activate-validation="vm.activateValidation"\n          ng-if="!vm.readOnlyMode">\n        </country-fields>\n\n        <read-only-country-fields\n          id="country-fields"\n          form="vm.form"\n          project="vm.project"\n          is-published="vm.publishMode"\n          is-new-project="vm.newProject"\n          activate-validation="vm.activateValidation"\n          ng-if="vm.readOnlyMode">\n        </read-only-country-fields>\n\n      </div>\n      <div class="navigation-area" layout="column">\n        <navigation\n          is-team="vm.isTeam"\n          is-published="vm.publishMode"\n          project="vm.project"\n          viewers="vm.viewers"\n          team="vm.team"\n        ></navigation>\n      </div>\n    </form>\n  </div>\n\n  <disclaimer></disclaimer>\n</div>\n'}}]);