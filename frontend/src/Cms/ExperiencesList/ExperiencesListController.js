class ExperienceListController {

    constructor() {
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        const mockData = require('../resources/mockData');
        this.domains = require('../resources/domains');
        const axisId = parseInt(this.axisId, 10);
        const domainId = parseInt(this.domainId, 10);
        const domain = this.domains[axisId].domains[domainId];
        this.experiences = mockData.experiences.filter(exp => {
            return exp.domain === domain;
        });
        this.newExperience = {
            value: null,
            valid: false
        };
    }

    static factory() {
        require('./ExperiencesList.scss');
        function experienceListController() {
            return new ExperienceListController();
        }
        experienceListController().$inject = [];
        return experienceListController;
    }
}

export default ExperienceListController;
