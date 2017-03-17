import _template from './Technology.html';


const technology = {
    template: _template,
    controller: () => {
        require('./Technology.scss');
    },
    controllerAs: 'vm',
    name: 'technology',
    bindings: {
        counter: '='
    }
};

export default technology;
