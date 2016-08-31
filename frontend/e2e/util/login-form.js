import { validUser } from './common-data';

export default class LoginForm {
    constructor() {
        this.form = browser.element('form[name="vm.loginForm"]');
        this.email = browser.element('input[name="username"]');
        this.password = browser.element('input[name="password"]');
        this.reset = browser.element('a[ui-sref="reset"]');
        this.submit = browser.element('button[aria-label="Login"]');
    }

    login() {
        this.email.setValue(validUser.email);
        this.password.setValue(validUser.password);
        this.submit.click();
    }
}