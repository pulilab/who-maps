/* global define, describe, it, beforeEach, expect, browser  */

export default class SignupForm {

    constructor() {
        this.form = browser.element('form[name="signupForm"]');
        this.radio = {
            group: browser.element('md-radio-group'),
            implementer: browser.element('#radio_0'),
            financial: browser.element('#radio_1'),
            governament: browser.element('#radio_2')
        };
        this.email = browser.element('input[name="email"');
        this.password = browser.element('input[name="password1"]');
        this.passwordConfirmation = browser.element('input[name="password2"]');
        this.submit = browser.element('button[aria-label="Sign up"]');
        this.loginText = browser.element('a[ui-sref="login"]');

        this.correctValues = {
            email: 'a@a.com',
            password: '123456a',
            passwordConfirmation: '123456a'
        };

        this.incorrectValues = {
            email: 'a@a.',
            password: '123456',
            passwordConfirmation: '123456a'
        }
    }

    fillCorrectly() {
        this.email.setValue(this.correctValues.email);
        this.password.setValue(this.correctValues.password);
        this.passwordConfirmation.setValue(this.correctValues.passwordConfirmation);
    }

    fillWrongly() {
        this.email.setValue(this.incorrectValues.email);
        this.password.setValue(this.incorrectValues.password);
        this.passwordConfirmation.setValue(this.incorrectValues.passwordConfirmation);
    }

}