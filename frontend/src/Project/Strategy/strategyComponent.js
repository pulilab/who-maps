import _template from './Strategy.html';


const component = {
    template: _template,
    controller: () => {
        require('./Strategy.scss');
    },
    controllerAs: 'vm',
    name: 'strategy',
    bindings: {
        counter: '='
    }
};

export default component;
