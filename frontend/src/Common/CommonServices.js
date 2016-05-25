import _ from 'lodash';
import Protected from './Protected';

/* global define, Promise, DEV, Symbol, DEBUG */

const singleton = Symbol();
const singletonEnforcer = Symbol();


class CommonServices extends Protected {

    constructor(enforcer) {
        super('');
        if (enforcer !== singletonEnforcer) {
            const error = { error: 'Cannot construct singleton' };
            throw error;
        }
        this.initialize();
    }

    initialize() {
        this.user = this.retrieveLoginStatus();
        this.projectList = [];
        this.publicProject = [];
        this.hash = Math.random().toString(36);
        this.projectStructure = [];
        this.retrieveUserProfile = this.retrieveUserProfile.bind(this);
        this.loadingCheck = [];
        this.promiseResolve = void 0;
        this.promiseReject = void 0;
        this.loadedPromise = new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
            this.promiseReject = reject;
        });
        if (this.user) {
            this.loadData();
        }
        else {
            this.loadingCheck = ['structure'];
            this.populateProjectStructure();
        }
    }

    uglyfyCountryName(name) {
        let nameParts = name.replace(' ', '-').split('-');
        nameParts = _.map(nameParts, item =>{
            return _.lowerCase(item);
        });
        return nameParts.join('-');
    }

    prettifyCountryName(name) {
        let nameParts = name.replace('-', ' ').split(' ');
        nameParts = _.map(nameParts, item => {
            return _.capitalize(item);
        });
        return nameParts.join(' ');
    }

    reset() {
        this.initialize();
        return this;
    }

    loadData() {
        this.loadingCheck = ['list', 'structure', 'user-profile'];
        this.retrieveUserProfile();
        this.populateProjectList();
        this.populateProjectStructure();
    }

    loadingProgress(name) {
        if (DEBUG) {
            console.debug(this.loadingCheck, name);
        }
        _.remove(this.loadingCheck, item => {
            return item === name;
        });
        if (this.loadingCheck.length === 0) {
            this.mergeOperations();
            this.promiseResolve();
        }


    }

    getCountryName(project) {
        const country = _.find(this.projectStructure.countries, { id: project.country });
        if (country) {
            project.countryName = this.prettifyCountryName(country.name);
        }
    }

    mergeOperations() {
        _.forEach(this.projectList, project => {
            this.getCountryName(project);
        });

        _.forEach(this.projectStructure.countries, country => {
            country.name = this.prettifyCountryName(country.name);
        });
    }

    retrieveUserProfile() {
        const vm = this;
        vm.get('userprofiles/').then(user => {
            vm.userProfile = user[0];
            if (this.userProfile) {
                vm.userProfile.email = this.storage.get('user').username;
            }
            this.loadingProgress('user-profile');
        });
    }

    populateProjectList() {
        const promiseArray = [];
        this.get('projects/')
            .then((projects) => {
                this.projectList = projects;
                _.forEach(projects, project => {
                    if (project) {
                        this.getProjectDetail(project);
                        promiseArray.push(project.detailPromise);
                        this.getProjectFiles(project);
                        promiseArray.push(project.filePromise);
                    }
                });

                Promise.all(promiseArray)
                    .then(() => {
                        this.loadingProgress('list');
                    }, () => {
                        this.promiseReject();
                    });
            }, () => {
                // if the user has no user profile the loading should still go on!
                console.warn('the user has no user profile');
                this.loadingProgress('list');
            });
    }

    populateProjectStructure() {
        this.get('projects/structure/')
            .then(structure => {
                this.projectStructure = structure;
                this.loadingProgress('structure');
            }, () => {
                this.promiseReject();
            });
    }

    getProjectDetail(project) {
        project.detailPromise = this.get(`projects/${project.id}/`);
        project.detailPromise.then(data => {
            _.merge(project, data);
        });
    }

    getProjectFiles(project) {
        project.filePromise = this.get(`projects/${project.id}/files/`);
        project.filePromise.then(files => {
            project.files = files;
        });
    }

    fetchSingleProjectData(resolve, _id) {
        const vm = this;
        if (vm.publicProject[_id]) {
            resolve(vm.publicProject[_id]);
        }
        else {
            const project = {
                id: _id
            };
            vm.getProjectDetail(project);
            project.detailPromise.then(data => {
                vm.getCountryName(data);
                vm.publicProject[_id] = data;
                resolve(data);
            });
        }
    }

    getProjectData(_id) {
        const vm = this;
        return new Promise((resolve) => {
            const id = parseInt(_id, 10);
            const last = _.find(this.projectList, { id });
            if (last) {
                resolve(last);
            }
            else {
                vm.fetchSingleProjectData(resolve, _id);
            }

        });
    }

    static commonServiceFactory() {
        if (!this[singleton]) {
            this[singleton] = new CommonServices(singletonEnforcer);
        }
        return this[singleton];
    }
}

export default CommonServices.commonServiceFactory();
