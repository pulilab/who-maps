import _template from './Signup.html';
import SignupController from './SignupController';


const signupComponent = {
    controller: SignupController.signupFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'signup'
};

export default signupComponent;
