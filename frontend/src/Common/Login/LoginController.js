import LoginService from './LoginService';

class LoginModuleController {

    constructor() {
        this.ls = new LoginService();
        this.EE = window.EE;
        this.user = {
            username: '',
            password: ''
        };
        this.style = {
            height: this.calculateHeight()
        };
    }

    calculateHeight() {
        const contentHeight = window.innerHeight - 48;
        return contentHeight + 'px';
    }

    login() {
        this.ls.login(this.user)
        .then(result => {
            if (result) {
                this.user.password = void 0;
                this.ls.storeUser(this.user);
                this.EE.emit('login');
            }
        });
    }


    static loginFactory() {
        require('./Login.scss');
        function loginController() {
            return new LoginModuleController();
        }

        loginController.$inject = [];

        return loginController;
    }

}

export default LoginModuleController;
