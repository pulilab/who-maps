import _ from 'lodash';
import moment from 'moment';
import NewProjectService from './ProjectService';
import ProjectDefinition from './ProjectDefinition';
import EditProfileService from '../Common/EditProfile/EditProfileService';

/* global DEV, DEBUG, Promise */

class ProjectController extends ProjectDefinition {

    constructor($scope, $state, Upload, CommonService, toast) {
        super(CommonService);
        this.ns = new NewProjectService(Upload);
        this.es = new EditProfileService();
        this.ccs = require('../Common/CustomCountryService');
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.toast = toast;
    }

    eventListeners() {
        this.EE.on('projectScrollTo', this.scrollToFieldSet, this);
        this.EE.on('componentLoaded', this.automaticScroll, this);
        this.EE.on('activateFieldSet', this.changeHash, this);
    }

    onInit() {
        this.eventListeners();
        this.districtList = [];
        this.dataLoaded = false;
        this.handleStructureLoad();
        this.users = this.cs.usersProfiles;

        this.team = [];
        this.viewers = [];
        try {
            this.team.push(_.find(this.users, { id: this.userProfile.id }));
        }
        catch (e) {
            console.error('Auth token expired');
            this.EE.emit('unauthorized');
        }

        if (this.editMode) {
            this.projectId = this.state.params.appName;
            this.cs.getProjectData(this.projectId)
                .then(this.handleDataLoad.bind(this));
            this.ns.getGroups(this.state.params.appName)
                .then(groups => {
                    this.team = groups.data.team;
                    this.viewers = groups.data.viewers;
                });
        }
    }

    onDestroy() {
        this.EE.removeListener('projectScrollTo', this.scrollToFieldSet);
        this.EE.removeListener('componentLoaded', this.automaticScroll);
        this.EE.removeListener('activateFieldSet', this.changeHash);
    }

    automaticScroll(fieldSet) {
        const hash = window.location.hash.replace('#', '');
        if (hash === fieldSet) {
            this.EE.emit('projectScrollTo', hash);
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

    changeHash(hash) {
        const l = window.location;
        const url = `${l.protocol}//${l.host}${l.pathname}#${hash}`;
        history.replaceState({}, '', url);
    }

    isViewer(project) {
        return this.cs.isViewer(project);
    }

    isMember(project) {
        return this.cs.isMember(project);
    }

    handleStructureLoad() {
        this.dataLoaded = true;
        this.structure = this.cs.projectStructure;
        this.scope.$evalAsync();
    }

    handleDataLoad(data) {
        data = _.cloneDeep(data);
        this.convertArraytoStandardCustomObj(data);
        this.userProjects = this.cs.projectList;
        data.start_date = this.convertDate(data.start_date);
        data.implementation_dates = this.convertDate(data.implementation_dates);
        data.end_date = this.convertDate(data.end_date);
        this.scope.$evalAsync(() => {
            this.project = data;
        });

    }

    convertDate(date) {
        const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
        if (date) {
            return moment(date, dateFormat).toDate();
        }
        return undefined;
    }


    convertArraytoStandardCustomObj(data) {
        const keyArray = ['interoperability_standards', 'health_focus_areas', 'licenses'];

        keyArray.forEach(key=> {
            const scaffold = {
                standard: [],
                custom: void 0
            };
            this.structure[key] = _.union(this.structure[key], data[key]);
            scaffold.standard = data[key];
            data[key] = scaffold;
        });
    }

    isCurrentProject(projectId) {
        return parseInt(projectId, 10) === parseInt(this.projectId, 10);
    }


    createDateFields(processedForm) {
        processedForm.start_date = moment(this.project.start_date).toJSON();
        processedForm.end_date = moment(this.project.end_date).toJSON();
        processedForm.implementation_dates = moment(this.project.implementation_dates).toJSON();
    }


    save() {
        if (!this.form.$valid) {
            const processedForm = _.cloneDeep(this.project);
            this.createDateFields(processedForm);
            this.mergeCustomAndDefault(processedForm);
            if (!this.editMode) {
                this.saveForm(processedForm);
            }
            else {
                this.updateForm(processedForm);
                this.putGroups();
            }
        }

    }

    putGroups() {
        return this.ns.putGroups(this.projectId, this.team, this.viewers);
    }

    updateForm(processedForm) {
        this.ns.updateProject(processedForm, this.projectId)
            .then(response => {
                if (response && response.success) {
                    // update cached project data with the one from the backend
                    this.cs.updateProject(response.data, this.projectId);
                    this.confirmationToast();
                }
                else {
                    this.handleResponse(response);
                }
            });
    }

    saveForm(processedForm) {
        this.ns.newProject(processedForm)
            .then(response => {
                if (response && response.success) {
                    this.ownershipCheck(response.data);
                    this.putGroups().then(() => {
                        this.postSaveActions.bind(this);
                        this.confirmationToast();
                    });
                }
                else {
                    this.handleResponse(response);
                }

            });
    }

    confirmationToast() {
        this.toast.show(
            this.toast.simple()
                .textContent('Project Saved!')
                .position('bottom right')
                .hideDelay(3000)
        );
    }

    ownershipCheck(project) {
        const id = this.userProfile.id;
        const rights = _.concat(this.team, this.viewers);
        if (rights.length > 0 && _.find(rights, { id })) {
            this.projectId = project.id;
        }
        else {
            const last  = _.last(this.cs.projectList);
            this.projectId = last && last.id ? last.id : null;
        }
    }

    postSaveActions() {
        const go = 'editProject';
        this.EE.emit('refreshProjects', { go, appName: this.projectId });
    }

    handleResponse(response) {
        console.log(response.data, this.form);
        _.forEach(response.data, (item, key) => {
            if (this.form[key]) {
                this.form[key].customError = item;
                this.form[key].$setValidity('custom', false);
            }
            else {
                console.error('missing name in the form: ', key);
            }
        });
        this.scope.$evalAsync();
    }

    unfoldObjects(obj) {
        return _.chain(obj)
            .map(item => {
                item = item.value;
                return item;
            })
            .filter(item => {
                return !_.isNil(item);
            })
            .value();
    }

    concatCustom(obj) {
        const cat = _.concat(obj.custom, obj.standard);
        return _.filter(cat, item => {
            return !_.isNil(item) && !_.isEmpty(item);
        });
    }

    mergeCustomAndDefault(collection) {
        const copy = _.cloneDeep(collection);
        collection.organisation = copy.organisation.id;
        collection.interoperability_standards = this.concatCustom(collection.interoperability_standards);
        collection.licenses = this.concatCustom(collection.licenses);
        collection.health_focus_areas = this.concatCustom(collection.health_focus_areas);
        collection.interoperability_links = _.toArray(collection.interoperability_links);
        collection.donors = this.unfoldObjects(collection.donors);
    }

    handleCustomError(key) {
        this.form[key].$setValidity('custom', true);
        this.form[key].customError = [];
    }

    setCustomError(key, error) {
        this.form[key].$setValidity('custom', false);
        this.form[key].customError.push(error);
    }


    static newProjectFactory() {
        require('./Project.scss');
        const CommonService =  require('../Common/CommonServices');
        function newProject($scope, $state, Upload, $mdToast) {
            return new ProjectController($scope, $state, Upload, CommonService, $mdToast);
        }
        newProject.$inject = ['$scope', '$state', 'Upload', '$mdToast'];
        return newProject;
    }
}

export default ProjectController;
