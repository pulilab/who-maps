import _template from './Hint.html';


const hintComponent = {
    template: _template,
    controller: () => {
        require('./Hint.scss');
    },
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
