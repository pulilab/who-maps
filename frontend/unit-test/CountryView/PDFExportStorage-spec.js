import PDFExportStorage from '../../src/CountryView/PDFExport/PDFExportStorage';

/* global define, it, describe, xit, expect, beforeEach, spyOn */
let pes = {};

describe('PDFExport Controller', () => {

    beforeEach(() => {
        pes = PDFExportStorage.factory();
    });

    it('should have an setData function', () => {
        expect(pes.setData).toBeDefined();
        spyOn(pes.storage, 'set');
        pes.setData(1, 2, 3);
        expect(pes.storage.set).toHaveBeenCalledWith('pdfExport',
            { projectList: 1, country: 2, countryFlag: 3 });
        expect(pes.projectList).toBe(1);
        expect(pes.country).toBe(2);
        expect(pes.countryFlag).toBe(3);
    });

    it('should have a getData function', () => {
        expect(pes.getData).toBeDefined();
        spyOn(pes.storage, 'get');
        const result = pes.getData();
        expect(pes.storage.get).toHaveBeenCalledWith('pdfExport');
        expect(result.projectList).toBe(1);
        expect(result.country).toBe(2);
        expect(result.countryFlag).toBe(3);
    });
});
