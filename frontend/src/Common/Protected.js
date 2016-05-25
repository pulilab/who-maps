import Storage from './Storage';
import AuthApi from './AuthApi';
import EE from './EE';

if (!window.EE) {
    EE.initialize();
}

/* global define, DEV, DEBUG */

class Protected extends AuthApi {
    constructor() {
        super('');
        this.EE = window.EE;
        this.storage = new Storage();
        this.$onDestroy = this.defaultOnDestroy.bind(this);
        this.$onInit = this.defaultOnInit.bind(this);
    }

    defaultOnInit() {
        if (DEBUG) {
            console.debug('default protected init function called by', this.constructor.name);
        }
        this.isLogin = this.retrieveLoginStatus();
        this.user = this.storage.get('user');
        // this.checkLoginStatus();
    }

    defaultOnDestroy() {
        if (DEBUG) {
            console.debug('default protected destroy function called by', this.constructor.name);
        }
        this.isLogin = void 0;
        this.user = void 0;
    }

    checkLoginStatus() {
        if (!this.isLogin) {
            // this.EE.emit('logout');
        }
    }

    systemLogout() {
        this.isLogin = false;
        this.storage.clear();
        this.EE.emit('logout');
    }

    retrieveLoginStatus() {
        return this.storage.get('login');
    }

}


export default Protected;
