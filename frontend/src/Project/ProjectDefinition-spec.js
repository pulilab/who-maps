import ProjectDefinition from './ProjectDefinition';

/* global define, it, describe, beforeEach, expect, xit, spyOn, Promise, jasmine */

let pd = {};


const cs = {
    projectStructure: {},
    userProfile: {
        organisation: 'asd'
    },
    populateProjectStructure: jasmine.createSpy('pps'),
    getProjectData: jasmine.createSpy('gpd')
};

describe('ProjectDefinition class', () => {

    beforeEach(()=>{
        pd = new ProjectDefinition(cs);
    });

    it('should have a function that return a default definition object', () => {
        expect(pd.initializeDefinition).toBeDefined();
        pd.initializeDefinition();
        expect(pd.project.interoperability_standards.custom).toBe(undefined);
    });

});
