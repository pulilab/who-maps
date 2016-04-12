import _template from './Badge.html';


const badgeComponent = {
    template: _template,
    controller: () => {
        require('./Badge.scss');
    },
    controllerAs: 'vm',
    name: 'badge',
    bindings: {
        counter: '='
    }
};

export default badgeComponent;
