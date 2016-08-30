import SignupForm from '../util/signup-form';
import FieldErrors from '../util/field-errors';

const assert = require('assert');

/* global define, describe, it, beforeEach, expect, browser, it  */


describe('landing page', () => {

    it('should be loaded as the default page', () => {
        browser.url('/');

        const title = browser.getTitle();
        expect(title).toBe('Digital Health Atlas');

        const url = browser.getUrl();
        expect(url).toContain('landing');
    });
    it('should have the sign-up button', () => {
        const signup = browser.isVisible('=SIGN UP');
        expect(signup).toBeTruthy();
    });

    it('should have the Login button', () => {
        const login = browser.isVisible('=LOGIN');
        expect(login).toBeTruthy();
    });
    it('should have the search box', () => {
        const searchContainer = browser.getText('.search-project');
        expect(searchContainer).toContain('Search projects');
    });

    it('should have the sign-up box', () => {
        const signupForm = browser.element('form[name="signupForm"]');
        const signupGoToNextButton = signupForm.getText('button');
        expect(signupForm.isVisible()).toBeTruthy();
        expect(signupGoToNextButton).toContain('GO TO NEXT STEP');
    });

    it('should go to login page upon clicking on login btn', () => {
        const login = browser.element('=LOGIN');
        expect(login.click().getUrl()).toContain('login');
    });

    it('should go to signup page upon clicking on signup btn', () => {
        const signup = browser.element('=SIGN UP');
        expect(signup.click().getUrl()).toContain('signup');
    });
});

describe('login page', () => {
    beforeEach(() => {
        browser.url('/login');
    });

    describe('login form', () => {
        let loginForm = void 0;

        beforeEach(() => {
            loginForm = browser.element('form[name="vm.loginForm"]');
        });

        it('should have a login form', () => {
            expect(loginForm.isVisible()).toBeTruthy();
        });

        it('that has email address input', () => {
            expect(loginForm.getValue('input[name="username"]').length).toBe(0);
        });

        it('that has password input', () => {
            expect(loginForm.getValue('input[name="password"]').length).toBe(0);
        });

        it('that has forgot password button', () => {
            expect(loginForm.getAttribute('a', 'aria-label')).toContain('Forgot password?');
        });

        it('that has login button', () => {
            expect(loginForm.getText('button.md-button')).toContain('LOGIN');
        });
    });
});


describe('signup page', () => {

    beforeEach(() => {
        browser.url('/signup');
    });

    describe('signup form', () => {

        let signupForm = void 0;

        beforeEach(() => {
            signupForm = new SignupForm();
        });

        it('should have a SignupForm form', () => {
            expect(signupForm.form.isVisible()).toBeTruthy();
        });

        it('should have a role checkbox', () => {
            expect(signupForm.radio.group.isVisible()).toBeTruthy();

            expect(signupForm.radio.implementer.isVisible()).toBeTruthy();

            expect(signupForm.radio.financial.isVisible()).toBeTruthy();

            expect(signupForm.radio.governament.isVisible()).toBeTruthy();

        });

        describe('email form field', () => {
            it('should be preset', () => {
                expect(signupForm.email.isVisible()).toBeTruthy();
            });

            it('should show an error message when is filled with a wrong email', () => {
                signupForm.fillWrongly();
                const emailError = new FieldErrors(signupForm.email).email;
                expect(emailError.isVisible()).toBeTruthy();
            })
        });

        describe('should have a password form field', () => {

            it('should exist', () => {
                expect(signupForm.password.isVisible()).toBeTruthy();
            });

            it('should show an error message when is focused and not filled', () => {
                signupForm.password.click();
                signupForm.passwordConfirmation.click();
                const requiredError = new FieldErrors(signupForm.password).required;
                expect(requiredError.isVisible()).toBeTruthy();
            });

        });

        it('should have a password confirmation form field', () => {
            expect(signupForm.passwordConfirmation.isVisible()).toBeTruthy();

        });

        describe('sigup button', () => {
            it('should be present', () => {
                expect(signupForm.submit.isVisible()).toBeTruthy();
            });

            it('should be disabled until the form is completed correctly', () => {
                expect(signupForm.submit.isEnabled()).toBeFalsy();
            });

            it('should be enabled when the form is completed correctly', () => {
                signupForm.fillCorrectly();
                expect(signupForm.submit.isEnabled).toBeTruthy();
            })
        });

        it('should have a login text link', () => {
            expect(signupForm.loginText.isVisible()).toBeTruthy();
        })


    });


});
