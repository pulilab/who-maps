import Protected from '../Common/Protected';

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
            organisation: null,
            country: null,
            countryName: null,
            coverage: [{}],
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
            health_focus_areas: {
                standard: [],
                custom: void 0
            },
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
            interventions: [],
            government_investor: false
        };
    }
}


export default ProjectDefinition;
