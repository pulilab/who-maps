import _ from 'lodash';
import MapsToolkitService from './MapsToolkitService';

class MapsToolkitModuleController {

    constructor($scope, $state, structure) {
        this.state = $state;
        this.scope = $scope;
        this.structure = structure;
        this.projectId = this.state.params.appName;
        this.domainId = this.state.params.domainId;
        this.axisId = this.state.params.axisId;

        if (!this.domainId || !this.axisId) {
            this.state.go('maps', { domainId: 0, axisId: this.axisId ? this.axisId : 0 });
        }

        this.ms = new MapsToolkitService(this.projectId);

        this.ms.getProjectData()
        .then(this.processAxesData.bind(this));
    }

    processAxesData(data) {
        this.rawData = _.cloneDeep(data);
        this.domainStructure = this.structure[this.axisId][this.domainId];
        _.forEach(this.domainStructure.questions, question => {
            question.answerTemplate = _.map(question.answerTemplate, answerTemplate => {
                const templatePath = './Resource/template/' + answerTemplate + '.html';
                answerTemplate = require(templatePath);
                return answerTemplate;
            });
        });

        this.domain = data[this.axisId].domains[this.domainId];
        _.map(this.domain.questions, (question, questionKey) => {
            question.index = questionKey;
        });
        console.log(this.domain);
        this.scope.$evalAsync();
    }

    static mapsControllerFactory() {
        function mapsController($scope, $state) {
            require('./MapsToolkit.scss');
            const structure = require('./Resource/structure.json');
            return new MapsToolkitModuleController($scope, $state, structure);
        }

        mapsController.$inject = ['$scope', '$state'];

        return mapsController;
    }
}

export default MapsToolkitModuleController;
