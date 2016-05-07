import _ from 'lodash';
import Protected from './Protected';

class ProjectDefinition extends Protected {

    constructor() {
        super();
        this.EE.on('userProfileFetched', this.updateProjectData.bind(this));
        this.project = {
            name: null,
            organisation: null,
            country: null,
            countryName: null,
            coverage: [{}],
            'technology_platforms': {
                standard: [],
                custom: [{}]
            },
            licenses: {
                standard: [],
                custom: [{}]
            },
            'digital_tools': {
                standard: [],
                custom: [{}]
            },
            'pre_assessment': [{}, {}, {}, {}, {}, {}],
            donors: [{}],
            application: [],
            reports: [{}],
            publications: [{}],
            pipelines: {
                standard: [],
                custom: void 0
            }

        };


    }

    updateProjectData() {
        this.project.organisation = this.userProfile.organisation;

    }

    addTechnologyPlatform() {
        this.project.technology_platforms.custom.push({});
    }
    rmTechnologyPlatform(t) {
        _.remove(this.project.technology_platforms.custom, item => {
            return item.$$hashKey === t.$$hashKey;
        });
    }

    technologyPlatformChange(t) {
        if (this.technologyPlatformChecked(t)) {
            _.remove(this.project.technology_platforms.standard, item => {
                return item === t;
            });
        }
        else {
            this.project.technology_platforms.standard.push(t);
        }
    }

    technologyPlatformChecked(t) {
        return this.project.technology_platforms.standard.indexOf(t) > -1;
    }


    // licenseChange(t) {
    //     if (this.licenseChecked(t)) {
    //         _.remove(this.project.licenses.standard, item => {
    //             return item === t;
    //         });
    //     }
    //     else {
    //         this.project.licenses.standard.push(t);
    //     }
    // }
    //
    // licenseChecked(t) {
    //     return this.project.licenses.standard.indexOf(t) > -1;
    // }
    //
    // digitalToolChange(t) {
    //     if (this.digitalToolChecked(t)) {
    //         _.remove(this.project.digital_tools.standard, item => {
    //             return item === t;
    //         });
    //     }
    //     else {
    //         this.project.digital_tools.standard.push(t);
    //     }
    // }
    //
    // digitalToolChecked(t) {
    //     return this.project.digital_tools.standard.indexOf(t) > -1;
    // }
    //
    // applicationChange(t) {
    //     if (this.applicationChecked(t)) {
    //         _.remove(this.project.application, item => {
    //             return item === t;
    //         });
    //     }
    //     else {
    //         this.project.application.push(t);
    //     }
    // }
    //
    // applicationChecked(t) {
    //     return this.project.application.indexOf(t) > -1;
    // }
    //
    // addLicense() {
    //     this.project.licenses.custom.push({});
    // }
    //
    // rmLicense(l) {
    //     _.remove(this.project.licenses.custom, item => {
    //         return item.$$hashKey === l.$$hashKey;
    //     });
    // }
    //
    // addDigitalTool() {
    //     this.project.digital_tools.custom.push({});
    // }
    //
    // rmDigitalTool(d) {
    //     _.remove(this.project.digital_tools.custom, item => {
    //         return item.$$hashKey === d.$$hashKey;
    //     });
    // }
    //
    //
    // addReportLink() {
    //     this.project.reports.push({});
    // }
    //
    // rmReportLink(l) {
    //     _.remove(this.project.reports, item => {
    //         return item.$$hashKey === l.$$hashKey;
    //     });
    // }
    //
    //
    // addPublicationLink() {
    //     this.project.publications.push({});
    // }
    //
    // rmPublicationLink(l) {
    //     _.remove(this.project.publications, item => {
    //         return item.$$hashKey === l.$$hashKey;
    //     });
    // }

    addDonor() {
        this.project.donors.push({});
    }

    rmDonor(l) {
        _.remove(this.project.donors, item => {
            return item.$$hashKey === l.$$hashKey;
        });
    }

    addCoverageItem() {
        this.project.coverage.push({});
    }

    rmCoverage(c) {
        _.remove(this.project.coverage, item => {
            return item.$$hashKey === c.$$hashKey;
        });
    }

    disableDetails() {
        return _.isNil(this.project.name) || _.isNil(this.project.organisation) || _.isNil(this.project.country);
    }
}


export default ProjectDefinition;
