import _template from './Scorecard.html';
import ScorecardController from './ScorecardController';

const scorecardComponent = {
    controller: ScorecardController.scorecardFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'scorecard'
};

export default scorecardComponent;
