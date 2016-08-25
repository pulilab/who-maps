import _template from './PDFExport.html';
import pdfExportController from './PDFExportController';

const pdfExport = {
    template: _template,
    controllerAs: 'vm',
    controller: pdfExportController.pdfExportFactory(),
    name: 'pdfExport',
    bindings: {
        instantDownload: '<'
    }
};

export default pdfExport;
