import _ from 'lodash';
import MapsToolkitService from './MapsToolkitService';

class MapsToolkitModuleController {

    constructor($scope, $state, structure) {
        this.state = $state;
        this.scope = $scope;
        this.dataLoaded = false;
        this.structure = _.cloneDeep(structure);
        this.projectId = this.state.params.appName;
        this.domainId = this.state.params.domainId;
        this.axisId = this.state.params.axisId;
        this.ms = new MapsToolkitService(this.projectId);
        if (!this.domainId || !this.axisId) {
            this.state.go('maps', { domainId: 0, axisId: this.axisId ? this.axisId : 0 });
        }
        else {
            this.ms.getProjectData()
            .then(this.processAxesData.bind(this));
        }




    }

    processAxesData(data) {
        this.dataLoaded = true;
        this.rawData = _.cloneDeep(data);
        this.axis = data[this.axisId];
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
        console.log(this.rawData);
        this.scope.$evalAsync();
    }

    calculateMainBoxSize(question) {
        if (question.choices) {
            return 90 - 10 * question.choices.length;
        }

        return 40;
    }


    checkChecked(questionId, answerId, points) {
        const answer = this.domain.questions[questionId].answers[answerId];
        return answer === points;
    }

    setAnswer(questionId, answerId, points) {
        const answer = {
            axis: this.axisId,
            domain: this.domainId,
            question: questionId,
            answer: answerId,
            value: points
        };
        this.domain.questions[questionId].answers[answerId] = points;
        this.ms.saveAnswer(answer);
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
