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
        const signup = browser.isVisible('=LOGIN');
        expect(signup).toBeTruthy();
    });
    it ('should have the search box', () => {
        const searchContainer = browser.getText('.search-project');
        expect(searchContainer).toContain('Search projects');
    });

    it ('should have the sign-up box', () => {

    });

});