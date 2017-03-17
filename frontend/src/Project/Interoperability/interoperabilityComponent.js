import _template from './Interoperability.html';


const component = {
    template: _template,
    controller: () => {
        require('./Interoperability.scss');
    },
    controllerAs: 'vm',
    name: 'interoperability',
    bindings: {
        counter: '='
    }
};

export default component;
