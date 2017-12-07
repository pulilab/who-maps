import PDFExportController from '../../src/CountryView/PDFExport/PDFExportController';

/* global define, it, describe, xit, expect, beforeEach, jasmine, spyOn */
let pef = {};

const pdfMakeReturn = {
    download: jasmine.createSpy('pdfdownload')
};


describe('PDFExport Controller', () => {

    beforeEach(() => {
        pef = PDFExportController.pdfExportFactory()();
        pef.$onInit();
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

    it('should have a function to generate a PDF with the pdfmake lib', () => {
        spyOn(pef, 'pdfMake').and.returnValue(pdfMakeReturn);
        pef.makePDF();
        expect(pef.pdfMake).toHaveBeenCalled();
    });
});
