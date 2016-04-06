import _template from './Hint.html';
import HintController from './HintController';

const hintComponent = {
    template: _template,
    controller: HintController.hintControllerFactory(),
    controllerAs: 'vm',
    name: 'hint',
    transclude: {
        'longTile': '?long',
        'shortTile': '?short',
        'tallTile': '?tall'
    },
    bindings: {
        showLong: '<',
        showShort: '<',
        showTall: '<'
    }
};

export default hintComponent;
