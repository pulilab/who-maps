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
            console.debug(`default protected init function called by ${this.constructor.name}`);
        }
        this.isLogin = this.retrieveLoginStatus();
        this.userProfileId = this.retrieveProfileId();
        this.user = this.storage.get('user');
        this.setUserType();
        // this.checkLoginStatus();
    }

    setUserType() {
        if (!this.isLogin) {
            this.userType = 0;
        }
        else if (this.isLogin) {
            this.userType = 1;
        }
    }

    adjustUserType(profile) {
        const projectId = parseInt(this.projectId, 10);
        if (profile.viewer && profile.viewer.indexOf(projectId) > -1) {
            this.userType = 2;
        }

        if (profile.member && profile.member.indexOf(projectId) > -1) {
            this.userType = 3;
        }
    }

    defaultOnDestroy() {
        if (DEBUG) {
            console.debug(`default protected destroy function called by ${this.constructor.name}`);
        }
        this.isLogin = void 0;
        this.user = void 0;
        this.userType = 0;
    }

    checkLoginStatus() {
        if (!this.isLogin) {
            // this.EE.emit('logout');
        }
    }

    systemLogout() {
        this.isLogin = false;
        this.userProfileId = null;
        this.storage.clear();
        this.EE.emit('logout');
    }

    retrieveLoginStatus() {
        return this.storage.get('login');
    }

    retrieveProfileId() {
        return this.storage.get('user_profile_id');
    }
}


export default Protected;
