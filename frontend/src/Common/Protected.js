import Storage from './Storage';

class Protected {
    constructor() {
        this.EE = window.EE;
        this.storage = new Storage();
        this.isLogin = this.retrieveLoginStatus();

        this.retrieveUser = this.retrieveUser.bind(this);
        this.retrieveUser();
        this.checkLoginStatus();
        this.EE.on('login', this.handleLoginEvent.bind(this));
    }

    checkLoginStatus() {
        if (!this.isLogin) {
            this.EE.emit('unauthorized');
        }
    }

    retrieveUser() {
        this.user = this.storage.get('user');
    }

    systemLogin() {
        this.isLogin = true;
        this.retrieveUser();
        this.storage.set('login', true);
    }

    systemLogout() {
        this.isLogin = false;
        this.storage.clear();
        this.checkLoginStatus();
    }

    handleLoginEvent() {
        this.isLogin = true;
        this.storage.set('login', true);
        this.retrieveUser();
    }

    retrieveLoginStatus() {
        return this.storage.get('login');
    }

}


export default Protected;
