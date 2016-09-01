import signupForm from '../util/signup-form';
import loginForm from '../util/login-form';

describe('the system', () => {
    it('should register a user', () => {

        browser.url('/signup');

        const sf = new signupForm();
        sf.register();

    });

    it('should perform login', () => {
        browser.url('/login');
        const lg = new loginForm();
        lg.login();
    })
});