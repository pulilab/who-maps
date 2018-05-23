import PDFExportController from '../../src/Dashboard/PDFExport/PDFExportController';
import pdfMake from 'pdfmake/build/pdfmake';
import { A } from '../testUtilities';

let pef = {};

const pdfMakeReturn = {
  download: jest.fn()
};

const gettextCatalogMock = {
  getString: jest.fn()
};

describe('PDFExport Controller', () => {
  beforeEach(() => {
    pef = new PDFExportController(gettextCatalogMock);
    pef.country = {
      name: 'a'
    };
  });

  test('should have an init function', () => {
    expect(pef.onInit).toBeDefined();
    pef.onInit();
    expect(pef.logo).toBeDefined();
    expect(pef.exportDate).toBeDefined();
  });

  test('should have a function to generate a PDF with the pdfmake lib', A(async () => {
    jest.spyOn(pdfMake, 'createPdf').mockReturnValue(pdfMakeReturn);
    await pef.makePDF();
    expect(pef.pdfMake).toHaveBeenCalled();
  }));
});
