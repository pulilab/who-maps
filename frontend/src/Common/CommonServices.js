import _ from 'lodash';
import Protected from './Protected';

/* global define, Promise, DEV */

let commonServices = false;
const loadingArray = ['list', 'structure'];

class CommonServices extends Protected {

    constructor() {
        super('');
        this.projectList = [];
        this.projectStructure = [];
        this.loadingCheck = _.cloneDeep(loadingArray);
        this.promiseResolve = void 0;
        this.promiseReject = void 0;
        this.loadedPromise = new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
            this.promiseReject = reject;
        });

        this.eventRegistrations();
        if (this.user) {
            this.loadData();
        }
    }

    loadData() {
        this.populateProjectList();
        this.populateProjectStructure();
    }

    eventRegistrations() {
        this.EE.on('refreshProjects', this.populateProjectList.bind(this));
    }

    loadingProgress(name) {
        if (DEV) {
            console.log(this.loadingCheck, name);
        }
        _.remove(this.loadingCheck, item => {
            return item === name;
        });
        if (this.loadingCheck.length === 0) {
            this.mergeOperations();
            this.promiseResolve();

            this.loadingCheck = _.cloneDeep(loadingArray);
        }


    }

    mergeOperations() {
        if (DEV) {
            console.log('Project Structure loaded: ', this.projectStructure.countries);
        }
        _.forEach(this.projectList, project => {
            const country = _.find(this.projectStructure.countries, { id: project.country });
            if (country) {
                project.countryName = country.name;
            }
        });
    }

    populateProjectList() {
        const promiseArray = [];
        this.get('projects/')
            .then((projects) => {
                this.projectList = projects;
                _.forEach(projects, project => {
                    this.getProjectDetail(project);
                    promiseArray.push(project.detailPromise);
                });

                Promise.all(promiseArray)
                    .then(() => {
                        this.loadingProgress('list');
                    }, () => {
                        this.promiseReject();
                    });
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

    getProjectData(_id) {
        const id = parseInt(_id, 10);
        return _.find(this.projectList, { id });
    }

    static commonServiceFactory(reset) {
        if (!commonServices || reset)  {
            commonServices = new CommonServices();
        }
        if (DEV) {
            console.log(commonServices);
        }
        return commonServices;
    }
}

export default CommonServices.commonServiceFactory();
export { CommonServices as ResetService };
