const assert = require('assert');


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
        var loginForm = void 0;

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
            expect(loginForm.getAttribute('a', 'aria-label')).toContain("Forgot password?");
        });

        it('that has login button', () => {
            expect(loginForm.getText('button.md-button')).toContain('LOGIN');
        });
    });
});
