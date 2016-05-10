import Storage from './Storage';
import AuthApi from './AuthApi';
import EE from './EE';

if (!window.EE) {
    EE.initialize();
}

class Protected extends AuthApi {
    constructor() {
        super('');
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
        if (!vm.userProfile && vm.isLogin && vm.EE) {
            vm.get('userprofiles').then(user => {
                vm.userProfile = user[0];
                vm.userProfile.email = this.user.username;
                vm.EE.emit('userProfileFetched');
                vm.EE.emit('doDigest');
            });
        }
    }

    systemLogout() {
        this.isLogin = false;
        this.storage.clear();
        this.checkLoginStatus();
    }

    retrieveLoginStatus() {
        return this.storage.get('login');
    }

}


export default Protected;
