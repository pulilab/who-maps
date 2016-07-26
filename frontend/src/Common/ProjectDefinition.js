import _ from 'lodash';
import Protected from './Protected';

class ProjectDefinition extends Protected {

    constructor(CommonService) {
        super();
        this.cs = CommonService;
        this.userProfile = this.cs.userProfile;
        this.initializeDefinition();

    }

    initializeDefinition() {
        this.project = {
            name: null,
            organisation: this.userProfile.organisation,
            country: null,
            countryName: null,
            coverage: [{}],
            'technology_platforms': [],
            licenses: [],
            // 'digital_tools': [],
            'pre_assessment': [{}, {}, {}, {}, {}, {}],
            donors: [{}],
            application: [],
            reports: [{}],
            publications: [{}],
            links: [{}],
            pipelines: {
                standard: [],
                custom: void 0
            },
            contact_name: null,
            contact_email: null,
            'implementation_overview': null,
            'implementing_partners': null,
            'implementation_dates': null,
            'geographic_coverage': null,
            'intervention_areas': [],
            wiki: '',
            repository: '',
            'mobile_application': ''
        };
    }


    technologyPlatformChange(t) {
        if (this.technologyPlatformChecked(t)) {
            _.remove(this.project.technology_platforms, item => item === t);
        }
        else {
            this.project.technology_platforms.push(t);
        }
    }

    technologyPlatformChecked(t) {
        return this.project.technology_platforms.indexOf(t) > -1;
    }

    // addTechnologyPlatform() {
    //     this.project.technology_platforms.custom.push({});
    // }
    // rmTechnologyPlatform(t) {
    //     _.remove(this.project.technology_platforms.custom, item => {
    //         return item.$$hashKey === t.$$hashKey;
    //     });
    // }

    interventionAreaChanged(t) {
        if (this.interventionAreaChecked(t)) {
            _.remove(this.project.intervention_areas, item => {
                return item === t;
            });
        }
        else {
            this.project.intervention_areas.push(t);
        }
    }

    interventionAreaChecked(t) {
        return this.project.intervention_areas.indexOf(t) > -1;
    }


    licenseChange(t) {
        if (this.licenseChecked(t)) {
            _.remove(this.project.licenses, item => {
                return item === t;
            });
        }
        else {
            this.project.licenses.push(t);
        }
    }

    licenseChecked(t) {
        return this.project.licenses.indexOf(t) > -1;
    }

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

    addReportLink() {
        this.project.reports.push({});
    }

    rmReportLink(l) {
        _.remove(this.project.reports, item => {
            return item.$$hashKey === l.$$hashKey;
        });
    }

    addReportFile() {
        this.project.files.push({ type: 'report' });
    }

    delReportFile(l) {
        _.remove(this.project.files, item => {
            return item.$$hashKey === l.$$hashKey;
        });
    }


    addPublicationLink() {
        this.project.publications.push({});
    }

    rmPublicationLink(l) {
        _.remove(this.project.publications, item => {
            return item.$$hashKey === l.$$hashKey;
        });
    }


    addPublicationFile() {
        this.project.files.push({ type: 'publication' });
    }

    delPublicationFile(l) {
        _.remove(this.project.files, item => {
            return item.$$hashKey === l.$$hashKey;
        });
    }

    addCHMILink() {
        this.project.links.push({});
    }

    rmCHMILink(l) {
        _.remove(this.project.links, item => {
            return item.$$hashKey === l.$$hashKey;
        });
    }

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
