import _ from 'lodash';
import MapsToolkitService from './MapsToolkitService';

class MapsToolkitModuleController  {

    constructor($scope, $state, structure) {
        this.state = $state;
        this.scope = $scope;
        this.EE = window.EE;
        this.dataLoaded = false;
        this.score = 0;
        this.structure = _.cloneDeep(structure);
        this.projectId = this.state.params.appName;
        this.domainId = this.state.params.domainId;
        this.axisId = this.state.params.axisId;
        this.ms = new MapsToolkitService(this.projectId);
        this.loadData();

        this.EE.on('mapsAxisChange', this.handleChangeAxis.bind(this));
        this.EE.on('mapsDomainChange', this.handleChangeDomain.bind(this));
    }

    loadData() {
        if (_.isNaN(parseInt(this.domainId, 10)) || _.isNaN(parseInt(this.axisId, 10))) {
            this.state.go('maps', {
                domainId: this.domainId ? this.domainId : 0,
                axisId: this.axisId ? this.axisId : 0
            });
            return;
        }
        this.ms.getProjectData().then(this.processAxesData.bind(this));

    }

    handleChangeAxis(id) {
        this.state.go(this.state.current.name, { 'axisId': id, 'domainId': 0 });
    }
    handleChangeDomain(axisId, domainId) {
        this.state.go(this.state.current.name, { axisId, domainId });
    }

    importHtmlTemplates() {
        // Import the whole folder in an collection of string templates, needed for proper webpack optimizations
        const templates = {};
        const templateRequire = require.context('./Resource/template/', true, /\.html$/);
        templateRequire.keys().forEach((item) => {
            const key = item.split('.')[1].replace('/', '');
            templates[key] = templateRequire(item);
        });
        return templates;
    }

    processAxesData(data) {
        this.rawData = _.cloneDeep(data);
        this.axis = data[this.axisId];
        this.domainStructure = this.structure[this.axisId].domains[this.domainId];

        const templates = this.importHtmlTemplates();

        this.domain = data[this.axisId].domains[this.domainId];
        this.data = _.merge(this.domain, this.domainStructure);
        _.forEach(this.data.questions, (question, questionKey) => {
            question.index = questionKey;
            question.answers = _.map(question.answers, (value, index) => {
                let template = null;
                if (question.answerTemplate && question.answerTemplate[index]) {
                    template = templates[question.answerTemplate[index]];
                }
                this.score += value === -1 ? 0 : value;
                return { index, value, template };
            });
        });
        this.dataLoaded = true;
        this.scope.$evalAsync();

    }

    calculateMainBoxSize(question) {
        if (question && question.choices) {
            return 90 - 10 * question.choices.length;
        }
        return 40;
    }


    checkChecked(questionId, answerId, points) {
        const answer = this.data.questions[questionId].answers[answerId];
        return answer.value === points;
    }

    setAnswer(questionId, answerId, points) {
        const answer = {
            axis: this.axisId,
            domain: this.domainId,
            question: questionId,
            answer: answerId,
            value: points
        };
        this.score +=  points - this.data.questions[questionId].answers[answerId].value;
        this.data.questions[questionId].answers[answerId].value = points;
        this.scope.$evalAsync();
        this.ms.saveAnswer(answer);
    }

    printAnswer(answer) {
        if (answer !== null && answer.value === -1) {
            return 0;
        }
        return answer.value;
    }

    backButtonDisabled() {
        return parseInt(this.domainId, 10) === 0
            && parseInt(this.axisId, 10) === 0;
    }

    isLastDomainInAxis() {
        return parseInt(this.domainId, 10) >= this.rawData[this.axisId].domains.length - 1;
    }

    goToNextDomain() {
        let nextDomain = parseInt(this.domainId, 10) + 1;
        let nextAxis = parseInt(this.axisId, 10);
        if (nextDomain >= this.rawData[this.axisId].domains.length) {
            nextAxis += 1;
            nextDomain = 0;
        }
        this.handleChangeDomain(nextAxis, nextDomain);
    }

    goToPrevDomain() {
        let prevDomain = parseInt(this.domainId, 10) - 1;
        let prevAxis = parseInt(this.axisId, 10);
        if (prevDomain <= 0) {
            prevAxis -= 1;
            prevDomain = this.rawData[prevAxis].domains.length - 1;
        }

        this.handleChangeDomain(prevAxis, prevDomain);
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
