import Storage from './Storage';

class Protected {
    constructor() {
        this.EE = window.EE;
        this.storage = new Storage();
        this.isLogin = this.retrieveLoginStatus();
        this.user = this.storage.get('user');
        this.checkLoginStatus();
        this.EE.on('login', this.handleLoginEvent.bind(this));
    }

    checkLoginStatus() {
        if (!this.isLogin) {
            this.EE.emit('unauthorized');
        }
    }

    systemLogin() {
        this.isLogin = true;
        this.storage.set('login', true);
    }

    systemLogout() {
        this.isLogin = false;
        this.storage.remove('login');
        this.storage.remove('token');
        this.storage.remove('user');
        this.checkLoginStatus();
    }

    handleLoginEvent() {
        this.isLogin = true;
        this.storage.set('login', true);
    }

    retrieveLoginStatus() {
        return this.storage.get('login');
    }

}


export default Protected;
