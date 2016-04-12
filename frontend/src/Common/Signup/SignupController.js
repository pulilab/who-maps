
class SignupModuleController {

    constructor() {

    }


    static signupFactory() {
        require('./Signup.scss');
        function signupController() {
            return new SignupModuleController();
        }

        signupController.$inject = [];

        return signupController;
    }
}

export default SignupModuleController;
