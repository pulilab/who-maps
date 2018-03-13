import PDFExportController from '../../src/Dashboard/PDFExport/PDFExportController';
import pdfMake from 'pdfmake/build/pdfmake';
import { A } from '../testUtilities';

/* global define, it, describe, xit, expect, beforeEach, jasmine, spyOn */
let pef = {};

const pdfMakeReturn = {
    download: jasmine.createSpy('pdfdownload')
};

const gettextCatalogMock = {
    getString: jasmine.createSpy('getString')
};


describe('PDFExport Controller', () => {

    beforeEach(() => {
        pef = new PDFExportController(gettextCatalogMock);
        pef.country = {
            name: 'a'
        };
    });

    it('should have an init function', () => {
        expect(pef.onInit).toBeDefined();
        pef.onInit();
        expect(pef.logo).toBeDefined();
        expect(pef.exportDate).toBeDefined();
    });

    it('should have a function to generate a PDF with the pdfmake lib', A(async () => {
        spyOn(pdfMake, 'createPdf').and.returnValue(pdfMakeReturn);
        await pef.makePDF();
        expect(pef.pdfMake).toHaveBeenCalled();
    }));
});
