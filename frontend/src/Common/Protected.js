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
        this.storage = new Storage();
        this.isLogin = this.retrieveLoginStatus();
        this.user = this.storage.get('user');
        this.$onDestroy = () => {
          console.log('On destroy function called');
        };
        this.checkLoginStatus();
    }

    checkLoginStatus() {
        if (!this.isLogin) {
            this.EE.emit('logout');
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
