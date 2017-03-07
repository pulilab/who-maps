import PDFExportController from './PDFExportController';

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
        spyOn(pef.pdfStorage, 'getData');
        expect(pef.onInit).toBeDefined();
        pef.onInit();
        expect(pef.logo).toBeDefined();
        expect(pef.exportDate).toBeDefined();
        expect(pef.pdfStorage.getData).toHaveBeenCalled();
    });

    it('should create the pdf if and only instantMode is true', () => {
        pef.instantDownload = false;
        spyOn(pef, 'makePDF');
        pef.$onInit();
        expect(pef.makePDF).not.toHaveBeenCalled();
        pef.instantDownload = true;
        pef.$onInit();
        expect(pef.makePDF).toHaveBeenCalledTimes(1);

    });

    it('should have a function to generate a PDF with the pdfmake lib', () => {
        spyOn(pef, 'pdfMake').and.returnValue(pdfMakeReturn);
        pef.makePDF();
        expect(pef.pdfMake).toHaveBeenCalled();
    });
});
