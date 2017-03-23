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
            'technology_platforms': {
                standard: [],
                custom: void 0
            },
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
            'implementing_partners': '',
            'implementation_dates': null,
            'health_focus_areas': {
                standard: [],
                custom: void 0
            },
            'geographic_scope': null,
            interoperability_links: [],
            interoperability_standards: {
                standard: [],
                custom: void 0
            },
            wiki: '',
            repository: '',
            'mobile_application': ''
        };
    }


    technologyPlatformChange(t) {
        if (this.technologyPlatformChecked(t)) {
            _.remove(this.project.technology_platforms.standard, item => item === t);
        }
        else {
            this.project.technology_platforms.standard.push(t);
        }
    }

    technologyPlatformChecked(t) {
        return this.project.technology_platforms.standard.indexOf(t) > -1;
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
            _.remove(this.project.health_focus_areas.standard, item => {
                return item === t;
            });
        }
        else {
            this.project.health_focus_areas.standard.push(t);
        }
    }

    interventionAreaChecked(t) {
        return this.project.health_focus_areas.standard.indexOf(t) > -1;
    }

    interoperabilityLinksChecked(t) {
        const inter = this.project.interoperability_links[t];
        return inter && inter.length > 0;
    }
    interoperabilityStandardsChecked(t) {
        return this.project.interoperability_standards.standard.indexOf(t) > -1;
    }

    interoperabilityStandardsChanged(t) {
        if (this.interoperabilityStandardsChecked(t)) {
            _.remove(this.project.interoperability_standards.standard, item => {
                return item === t;
            });
        }
        else {
            this.project.interoperability_standards.standard.push(t);
        }
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

    addReportLink() {
        this.project.reports.push({});
    }

    rmReportLink(l) {
        _.remove(this.project.reports, item => {
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
