import _ from 'lodash';
import { Protected } from '../Common/';
import MapsToolkitService from './MapsToolkitService';

class MapsToolkitController extends Protected {

    constructor($scope, $state, CommonService, structure) {
        super();
        this.state = $state;
        this.scope = $scope;
        this.cs = CommonService;
        this.structure = _.cloneDeep(structure);
        this.EE = window.EE;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
    }

    onInit() {
        const vm = this;
        vm.defaultOnInit();
        vm.bindEvents();
        vm.dataLoaded = false;
        vm.score = 0;
        vm.projectId = vm.state.params.appName;
        vm.domainId = vm.state.params.domainId;
        vm.axisId = vm.state.params.axisId;
        vm.ms = new MapsToolkitService(vm.projectId);
        vm.loadData();
        vm.adjustUserType(vm.cs.userProfile);
        vm.viewMode = vm.userType < 3;
    }

    onDestroy() {
        const vm = this;
        vm.defaultOnDestroy();
        vm.removeEvents();
    }

    bindEvents() {
        const vm = this;
        vm.EE.on('mapsAxisChange', vm.handleChangeAxis, this);
        vm.EE.on('mapsDomainChange', vm.handleChangeDomain, this);
    }

    removeEvents() {
        const vm = this;
        vm.EE.removeListener('mapsAxisChange', vm.handleChangeAxis, this);
        vm.EE.removeListener('mapsDomainChange', vm.handleChangeDomain, this);
    }

    loadData() {
        if (_.isNaN(parseInt(this.domainId, 10)) || _.isNaN(parseInt(this.axisId, 10))) {
            this.state.go(this.state.current.name, {
                domainId: this.domainId ? this.domainId : 0,
                axisId: this.axisId ? this.axisId : 0
            }, {
                location: 'replace'
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
        if (this.viewMode) {
            return;
        }
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

    goToScorecard() {
        const axisId = this.axisId;
        this.state.go(this.viewMode ? 'scorecard' : 'scorecard', { axisId });
    }


    static mapsControllerFactory() {
        function mapsController($scope, $state) {
            const structure = require('./Resource/structure.json');
            const CommonService = require('../Common/CommonServices');
            return new MapsToolkitController($scope, $state, CommonService, structure);
        }

        mapsController.$inject = ['$scope', '$state'];

        return mapsController;
    }
}

export default MapsToolkitController;
