import _template from './AdditionalInfo.html';


const component = {
    template: _template,
    controller: () => {
        require('./AdditionalInfo.scss');
    },
    controllerAs: 'vm',
    name: 'additionalInfo',
    bindings: {
        counter: '='
    }
};

export default component;
