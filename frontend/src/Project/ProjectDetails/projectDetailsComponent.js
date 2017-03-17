import _template from './ProjectDetails.html';


const component = {
    template: _template,
    controller: () => {
        require('./ProjectDetails.scss');
    },
    controllerAs: 'vm',
    name: 'projectDetails',
    bindings: {
        counter: '='
    }
};

export default component;
