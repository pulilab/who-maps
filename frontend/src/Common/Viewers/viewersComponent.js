import _template from './viewers.html';
import './viewers.scss';

const viewersComponent = {
    template: _template,
    controllerAs: 'vm',
    name: 'viewers',
    bindings: {
        number: '=',
        trend: '=' // 'up' || 'down' || 'flat'
    }
};

export default viewersComponent;
