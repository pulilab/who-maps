class ExperienceListController {

    constructor($scope) {
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        this.cs = require('../CmsService');
        this.commonServices = require('../../Common/CommonServices');
        this.domains = require('../resources/domains');
        const axisId = parseInt(this.axisId, 10);
        const domainId = parseInt(this.domainId, 10);
        this.domain = this.domains[axisId].domains[domainId];
        this.data = [];
        this.cs.getData().then(data => {
            this.data = data;
        });


        this.newExperience = {
            body: null,
            valid: false,
            name: this.commonServices.userProfile.name,
            domain: this.domain.id,
            type: 3
        };

        this.watchers();
    }

    watchers() {
        this.scope.$watchCollection(() => {
            return this.data;
        }, data => {
            this.experiences = data.filter(exp => {
                return exp.domain === this.domain.id && exp.type === 3;
            });
        });
    }

    saveExperience() {
        this.cs.addContent(this.newExperience).then(() => {
            this.scope.$evalAsync(() => {
                this.newExperience.body = false;
            });
        });
    }

    static factory() {
        require('./ExperiencesList.scss');
        function experienceListController($scope) {
            return new ExperienceListController($scope);
        }
        experienceListController().$inject = ['$scope'];
        return experienceListController;
    }
}

export default ExperienceListController;
