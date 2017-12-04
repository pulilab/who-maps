import merge from 'lodash/merge';
import forEach from 'lodash/forEach';
import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';

import * as UserModule from '../store/modules/user';
import * as ToolkitModule from '../store/modules/toolkit';
import * as ProjectModule from '../store/modules/projects';


class MapsToolkitController {

    constructor($scope, $state, $ngRedux) {
        this.state = $state;
        this.scope = $scope;
        this.$ngRedux = $ngRedux;
        this.EE = window.EE;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.mapData = this.mapData.bind(this);
        this.watchers = this.watchers.bind(this);

    }

    mapData(state) {
        const structure = ToolkitModule.getStructure();
        const rawData = ToolkitModule.getToolkitData(state);
        return {
            profile: UserModule.getProfile(state),
            viewMode: ProjectModule.getCurrentProject(state).isViewer,
            rawData,
            structure,
            domainStructure: ToolkitModule.getDomainStructure(this.state.params.axisId, this.state.params.domainId)
        };
    }

    onInit() {
        this.bindEvents();
        this.dataLoaded = false;
        this.score = 0;
        this.projectId = this.state.params.appName;
        this.domainId = this.state.params.domainId;
        this.axisId = this.state.params.axisId;
        this.templates = this.importHtmlTemplates();
        this.watchers();
        this.unsubscribe = this.$ngRedux.connect(this.mapData, ToolkitModule)(this);
    }

    onDestroy() {
        this.removeEvents();
        this.unsubscribe();
    }

    watchers() {
        this.scope.$watch(s => s.vm.rawData,
          rawData => {
              this.processAxesData(cloneDeep(rawData), this.state.params.axisId, this.state.params.domainId);
          }, true);
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

    processAxesData(data, axisId, domainId) {
        if (data && data.length > 0 && axisId && domainId) {
            this.axis = data[axisId];
            this.domain = data[axisId].domains[domainId];
            this.data = merge(this.domain, this.domainStructure);
            this.score = 0;
            forEach(this.data.questions, (question, questionKey) => {
                question.index = questionKey;
                question.answers = map(question.answers, (value, index) => {
                    let template = null;
                    if (question.answerTemplate && question.answerTemplate[index]) {
                        template = this.templates[question.answerTemplate[index]];
                    }
                    this.score += value === -1 ? 0 : value;
                    return { index, value, template };
                });
            });
            this.dataLoaded = true;
        }

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
        this.saveAnswer(answer);
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
        function mapsController($scope, $state, $ngRedux) {
            const structure = require('./Resource/structure.json');
            return new MapsToolkitController($scope, $state, $ngRedux, structure);
        }

        mapsController.$inject = ['$scope', '$state', '$ngRedux'];

        return mapsController;
    }
}

export default MapsToolkitController;
