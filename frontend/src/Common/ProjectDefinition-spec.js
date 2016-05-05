import ProjectDefinition from './ProjectDefinition';

/* global define, it, describe, beforeEach, expect, xit, spyOn, Promise */

let pd = {};
const t = {
    $$hasKey : 1
};

describe('ProjectDefinition class', () => {

    beforeEach(()=>{
        pd = new ProjectDefinition();
    });

    it('should have a function that add a tp', () => {
        pd.addTechnologyPlatform();
        expect(pd.project.technology_platforms.custom.length).toBe(2);
    });

    it('should have a function that remove a tp', () => {

        pd.project.technology_platforms.custom[0] = t;
        pd.rmTechnologyPlatform(t)
        expect(pd.project.technology_platforms.custom.length).toBe(0);
    });

    it('should have a function that check if a tp is checked', () => {
        pd.project.technology_platforms.standard[0] = t;
        const r = pd.technologyPlatformChecked(t);
        expect(r).toBeTruthy();
    });

    it('should have a function that check a tp or uncheck it onclick', () => {
        pd.technologyPlatformChange(t);
        expect(pd.project.technology_platforms.standard[0]).toBe(t);
        pd.technologyPlatformChange(t);
        expect(pd.project.technology_platforms.standard[0]).not.toBe(t);
    });


    it('should have a function that add a donor', () => {
        pd.addDonor();
        expect(pd.project.donors.length).toBe(2);
    });

    it('should have a function that remove a donor', () => {
        pd.project.donors[0] = t;
        pd.rmDonor(t)
        expect(pd.project.donors.length).toBe(0);
    });

    it('should have a function that add a coverage item', () => {
        pd.addCoverageItem();
        expect(pd.project.coverage.length).toBe(2);
    });

    it('should have a function that remove a coverageItem', () => {
        pd.project.coverage[0] = t;
        pd.rmCoverage(t)
        expect(pd.project.coverage.length).toBe(0);
    });

    it('should have a function that disable the detail if the main field are not set', () => {
        let r = pd.disableDetails();
        expect(r).toBeTruthy();
        pd.project.name = 1;
        r = pd.disableDetails();
        expect(r).toBeTruthy();

        pd.project.organisation = 2;
        r = pd.disableDetails();
        expect(r).toBeTruthy();

        pd.project.country = 1;
        r = pd.disableDetails();
        expect(r).toBeFalsy();

    });

});
