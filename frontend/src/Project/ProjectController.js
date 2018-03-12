import forEach from 'lodash/forEach';
import isPlainObject from 'lodash/isPlainObject';
import * as ProjectModule from '../store/modules/projects';
import * as SystemModule from '../store/modules/system';
import * as UserModule from '../store/modules/user';
import * as CountryModule from '../store/modules/countries';

/* global DEV, DEBUG, Promise */

class ProjectController  {

    constructor($scope, $state, toast, $timeout, $mdDialog, $ngRedux, gettextCatalog) {
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.$ngRedux = $ngRedux;
        this.$mdDialog = $mdDialog;
        this.timeout = $timeout;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.postPublishAction = this.postPublishAction.bind(this);
        this.getCountryFields = this.getCountryFields.bind(this);
        this.eventListeners = this.eventListeners.bind(this);
        this.toast = toast;
        this.mapData = this.mapData.bind(this);
        this.createDialogs = this.createDialogs.bind(this, gettextCatalog);
    }

    mapData(state) {
        const userProfile = UserModule.getProfile(state);
        const newProject = this.state.current.name === 'newProject';
        const publishMode = this.state.params.editMode === 'publish';
        let project = null;
        let team = null;
        let viewers = null;
        let isViewer = false;
        let isTeam = false;
        let readOnlyMode = false;
        if (newProject) {
            project = ProjectModule.getNewProjectForEditing(state);
            team = [userProfile];
            viewers = [];
            isTeam = true;
        }
        else {
            team = ProjectModule.getTeam(state);
            viewers = ProjectModule.getViewers(state);

            isViewer = (team.every(t => t.id !== userProfile.id) && viewers.some(v => v.id === userProfile.id));
            isTeam = team.some(v => v.id === userProfile.id);
            readOnlyMode = publishMode || !isTeam;


            if (!publishMode && isTeam) {
                project = ProjectModule.getCurrentDraftProjectForEditing(state);
            }
            else if (!publishMode && !isTeam) {
                project = ProjectModule.getCurrentDraftInViewMode(state);
            }

            if (publishMode) {
                project = ProjectModule.getCurrentPublicProjectDetails(state, false);
            }
            else if (!isViewer && !isTeam && !newProject) {
                project = ProjectModule.getCurrentPublicProjectDetails(state, true);
            }
        }
        return {
            newProject,
            publishMode,
            readOnlyMode,
            isViewer,
            isTeam,
            project,
            team,
            viewers,
            structure: ProjectModule.getProjectStructure(state),
            users: SystemModule.getUserProfiles(state),
            userProfile,
            userProjects: ProjectModule.getPublishedProjects(state)
        };
    }

    eventListeners() {
        this.EE.on('projectScrollTo', this.scrollToFieldSet, this);
        this.EE.on('projectSaveDraft', this.saveDraftHandler, this);
        this.EE.on('projectDiscardDraft', this.discardDraftHandler, this);
    }

    onInit() {
        this.eventListeners();
        this.districtList = [];
        this.activateValidation = false;
        this.$ngRedux.dispatch(ProjectModule.clearSimilarNameList());
        if (this.state.current.name === 'newProject') {
            this.$ngRedux.dispatch(ProjectModule.setCurrentProject(-1));
        }
        this.unsubscribe = this.$ngRedux.connect(this.mapData, ProjectModule)(this);
        this.watchers();
        this.createDialogs();
    }

    onDestroy() {
        this.unsubscribe();
        this.$ngRedux.dispatch(ProjectModule.resetEditedProject());
        this.EE.removeAllListeners('projectScrollTo', this.scrollToFieldSet);
        this.EE.removeAllListeners('projectSaveDraft', this.saveDraftHandler);
        this.EE.removeAllListeners('projectDiscardDraft', this.discardDraftHandler);

    }

    createDialogs(gettextCatalog) {
        this.confirmDraftDiscard = this.$mdDialog.confirm({
            title: gettextCatalog.getString('Attention'),
            textContent: gettextCatalog.getString('The current draft will be overwritten by the published version'),
            ok: gettextCatalog.getString('Ok'),
            cancel: gettextCatalog.getString('Cancel'),
            theme: 'alert'
        });

        this.publishAlert = this.$mdDialog.alert({
            title: gettextCatalog.getString('Attention'),
            textContent: gettextCatalog.getString('You can\'t publish until all the required' +
            ' fields are filled, you can however save the draft'),
            ok: gettextCatalog.getString('Close'),
            theme: 'alert'
        });

        this.savingError = this.$mdDialog.alert({
            title: gettextCatalog.getString('Attention'),
            textContent: gettextCatalog.getString('An error occured while saving your project, your data is NOT saved'),
            ok: gettextCatalog.getString('Close'),
            theme: 'alert'
        });

        this.draftCongratulation = this.$mdDialog.alert({
            title: gettextCatalog.getString('Congratulation'),
            textContent: gettextCatalog.getString('Your draft has been saved successfully'),
            ok: gettextCatalog.getString('Close'),
            theme: 'alert'
        });

        this.draftDiscardCongratulation = this.$mdDialog.alert({
            title: gettextCatalog.getString('Congratulation'),
            textContent: gettextCatalog.getString('Your draft has been discarded successfully'),
            ok: gettextCatalog.getString('Close'),
            theme: 'alert'
        });

        this.publishCongratulation = this.$mdDialog.alert({
            title: gettextCatalog.getString('Congratulation'),
            textContent: gettextCatalog.getString('Your draft has been published successfully'),
            ok: gettextCatalog.getString('Close'),
            theme: 'alert'
        });


    }

    watchers() {
        this.scope.$watch(s => s.vm.project.country, this.getCountryFields);
    }

    getCountryFields(country) {
        if (country) {
            this.$ngRedux.dispatch(CountryModule.setCurrentCountry(country, ['districts', 'countryFields']));
        }
    }

    scrollToFieldSet(hash) {
        const element = window.document.getElementById(hash);
        const toScroll = window.document.getElementsByClassName('main-content')[0];
        if (element) {
            this.EE.emit('activateFieldSet', hash);
            toScroll.scrollTop = element.offsetTop - 60;
        }
    }

    clearCustomErrors() {
        forEach(this.form, formItem => {
            if (formItem && formItem.customError && formItem.customError.length > 0) {
                formItem.$setValidity('custom', true);
                formItem.customError = [];
            }
        });
    }

    publishProject() {
        this.clearCustomErrors();
        this.activateValidation = true;
        this.timeout(async () => {
            if (this.form.$valid) {
                try {
                    const data = await this.publish(this.project, this.team, this.viewers);
                    this.postPublishAction(data);
                }
                catch (e) {
                    this.handleResponse(e.response);
                    this.$mdDialog.show(this.publishAlert);
                }
            }
            else {
                await this.$mdDialog.show(this.publishAlert);
                this.focusInvalidField();
            }
        });

    }

    saveDraftHandler() {
        this.clearCustomErrors();
        this.activateValidation = false;
        this.timeout(async () => {
            if (this.form.$valid) {
                try {
                    const project = await this.saveDraft(this.project, this.team, this.viewers);
                    this.$mdDialog.show(this.draftCongratulation);
                    if (this.newProject) {
                        this.state.go('editProject', { appName: project.id }, {
                            location: 'replace',
                            reload: false
                        });
                    }
                }
                catch (e) {
                    console.log(e);
                    this.handleResponse(e.response);
                }
            }
            else {
                this.focusInvalidField();
            }
        });
    }

    async discardDraftHandler() {
        try {
            await this.$mdDialog.show(this.confirmDraftDiscard);
            await this.discardDraft();
            await this.$mdDialog.show(this.draftDiscardCongratulation);
        }
        catch (e) {
            console.log(e);
        }
    }

    focusInvalidField(focusCountryFields) {
        this.timeout(()=>{
            const firstInvalid = focusCountryFields ?
              document.getElementById('npf').querySelector('section-country-fields')
              : document.getElementById('npf').querySelector('.ng-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }, 100);
    }

    async postPublishAction({ id }) {
        this.$mdDialog.show(this.publishCongratulation);
        this.state.go('editProject', { appName: id, editMode: 'publish' }, {
            location: 'replace',
            reload: true
        });
    }

    addErrorArray(errors, key) {
        try {
            this.form[key].customError = errors;
            this.form[key].$setValidity('custom', false);
        }
        catch (e) {
            console.warn('failed to set the error for key: ', key);
        }
    }

    handleResponse(response) {
        if (response && response.status === 500) {
            console.error('500 from the API', response);
            this.$mdDialog.show(this.savingError);
            return;
        }
        if (response.custom) {
            this.focusInvalidField();
            return;
        }
        forEach(response.data, (item, key) => {
            try {
                if (item && isPlainObject(item)) {
                    forEach(item, (errors, subKey) => {
                        this.addErrorArray(errors, `${key}.${subKey}`);
                    });
                }
                else if (item && item[0] && isPlainObject(item[0])) {
                    forEach(item, (obj, index) => {
                        forEach(obj, (errors, subKey) => {
                            const fieldName = `${key}_${index}.${subKey}`;
                            this.addErrorArray(errors, fieldName);
                        });

                    });
                }
                else {
                    this.addErrorArray(item, key);
                }
            }
            catch (e) {
                console.error(e);
            }
        });
        this.$mdDialog.show(this.savingError);
        this.scope.$evalAsync(()=>{
            this.focusInvalidField();
        });

    }

    static newProjectFactory() {
        require('./Project.scss');
        function newProject($scope, $state, $mdToast, $timeout, $mdDialog, $ngRedux, gettextCatalog) {
            return new ProjectController($scope, $state, $mdToast, $timeout, $mdDialog, $ngRedux, gettextCatalog);
        }
        newProject.$inject = ['$scope', '$state', '$mdToast', '$timeout', '$mdDialog', '$ngRedux', 'gettextCatalog'];
        return newProject;
    }
}

export default ProjectController;
