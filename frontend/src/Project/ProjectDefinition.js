import * as ProjectModule from '../store/modules/projects';

class ProjectDefinition {

    constructor($ngRedux) {
        this.userProfile = this.cs.userProfile;
        this.initializeDefinition();
        this.unsubscribeProjects = $ngRedux.connect(this.mapData, ProjectModule)(this);
    }

    initializeDefinition() {
        this.project = {
            name: null,
            organisation: this.cs.userProfile.organisation,
            country: null,
            countryName: null,
            coverage: [{}],
            coverageType: undefined,
            start_date: void 0,
            end_date: void 0,
            platforms: [{
                name: null,
                strategies: []
            }],
            licenses: {
                standard: [],
                custom: void 0
            },
            donors: [{}],
            application: [],
            reports: [{}],
            publications: [{}],
            links: [{}],
            contact_name: null,
            contact_email: null,
            implementation_overview: null,
            implementation_dates: null,
            geographic_scope: null,
            interoperability_links: [],
            interoperability_standards: {
                standard: [],
                custom: void 0
            },
            wiki: '',
            repository: '',
            mobile_application: '',
            implementing_partners:[{}],
            data_exchanges: [],
            his_bucket: [],
            hsc_challenges: [],
            health_focus_areas: [],
            government_investor: null
        };
    }
}


export default ProjectDefinition;
