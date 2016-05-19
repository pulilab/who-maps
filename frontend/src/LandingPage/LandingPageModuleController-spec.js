import { default as LandingPageModuleController } from './LandingPageController';

/* global define, it, describe, expect */

describe('LandingPageModuleController', () => {

    it('should have a constructor, fetching the basic data of trending projects', () => {
        const cc = new LandingPageModuleController();
        expect(cc.trendingProjects.length).toBe(3);
    });

});
