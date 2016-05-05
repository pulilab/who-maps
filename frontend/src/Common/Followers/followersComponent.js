import _template from './followers.html';
import './followers.scss';

const followersComponent = {
    template: _template,
    controllerAs: 'vm',
    name: 'followers',
    bindings: {
        number: '=',
        trend: '=' // 'up' || 'down' || 'flat'
    }
};

export default followersComponent;
