import _template from './Navigation.html';


const component = {
    template: _template,
    controller: () => {
        require('./Navigation.scss');
    },
    controllerAs: 'vm',
    name: 'navigation',
    bindings: {
        counter: '='
    }
};

export default component;
