import _template from './IntroJs.html';
import IntroJsController from './IntroJsController';


const introJsComponent = {
    controller: IntroJsController.introJsFactory(),
    template: _template,
    controllerAs: 'vm',
    bindings: {
        sourceString: '<'
    },
    name: 'introjs'
};

export default introJsComponent;
