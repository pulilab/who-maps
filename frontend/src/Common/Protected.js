import Storage from './Storage';
import AuthApi from './AuthApi';

class Protected extends AuthApi {
    constructor() {
        super('userprofiles');
        this.EE = window.EE;
        this.userProfile = false;
        this.storage = new Storage();
        this.isLogin = this.retrieveLoginStatus();
        this.retrieveUser = this.retrieveUser.bind(this);
        this.retrieveUser();
        this.checkLoginStatus();
    }

    checkLoginStatus() {
        if (!this.isLogin) {
            this.EE.emit('logout');
        }
    }

    retrieveUser() {
        const vm = this;
        vm.user = vm.storage.get('user');
        if (!vm.userProfile) {
            vm.get('').then(user => {
                vm.userProfile = user[0];
                vm.EE.emit('userProfileFetched');
                vm.EE.emit('doDigest');
            });
        }
    }

    systemLogin() {
        this.retrieveUser();
        this.storage.set('login', true);
        this.isLogin = true;
    }

    systemLogout() {
        this.isLogin = false;
        this.storage.clear();
        this.checkLoginStatus();
    }

    handleLoginEvent() {
        this.systemLogin();
    }

    retrieveLoginStatus() {
        return this.storage.get('login');
    }

}


export default Protected;
